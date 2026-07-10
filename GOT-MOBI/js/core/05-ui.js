// ============================================================
// js/core/05-ui.js — ПОЛНЫЙ UI (БОЕВКА + ПОИСК + КАРТА МЕСТ)
// ============================================================

console.log('🔧 UI загружается...');

// ============================================================
// 1. БОЕВКА
// ============================================================

window._battle = null;

window.getMobsForLocation = function(region, place) {
    var m = {'Королевские земли':'crownlands','Север':'north','Западные земли':'westlands','Простор':'reach','Речные земли':'riverlands','Штормовые земли':'stormlands','Дорн':'dorne','Долина':'vale','Железные острова':'iron_islands'};
    var k = m[region] || 'crownlands';
    var mobs = MOBS[k] || MOBS.crownlands || [];
    var lvl = LOCATION_LEVELS[place] || 1;
    var min = Math.max(1, lvl - 3), max = lvl + 3;
    var f = mobs.filter(function(m) { return m.level >= min && m.level <= max; });
    return f.length > 0 ? f : mobs.slice(0, 5);
};

window.getRandomMobByRegionAndLevel = function(region, place) {
    var mobs = window.getMobsForLocation(region, place);
    if (mobs.length === 0) return { name:'Крыса', hp:8, damage:2, defense:0, xp:3, level:1, type:'animal', agility:2 };
    return mobs[Math.floor(Math.random() * mobs.length)];
};

window.startBattle = function(mob) {
    var g = users[currentUser].game;
    var maxHp = getMaxHp(g);
    g.maxHp = maxHp;
    if (g.hp > maxHp) g.hp = maxHp;
    var totalStats = getTotalStats(g);
    var horseAlive = false, horseHp = 0, horseMaxHp = 0, mounted = false;
    if (g.equipment && g.equipment.horse) {
        var h = HORSE_TYPES[g.equipment.horse.horseType];
        if (h) { horseAlive = true; horseHp = g.equipment.horse.hp || h.hp; horseMaxHp = g.equipment.horse.maxHp || h.hp; mounted = true; }
    }
    window._battle = {
        mob: mob, playerHp: g.hp, mobHp: mob.hp, maxPlayerHp: maxHp, turn: 'player', inProgress: true,
        log: [], fleeAttempts: 0, playerStats: totalStats, mobAgility: mob.agility || 1,
        mobLevel: mob.level || 1, horseAlive: horseAlive, horseHp: horseHp, horseMaxHp: horseMaxHp,
        mounted: mounted, horseDismounted: false, mobDefense: mob.defense || 0
    };
    isBusy = true;
    document.getElementById('busy-status').classList.remove('hide');
    document.getElementById('busy-status').textContent = '⚔️ Бой с ' + mob.name + '!';
    window.renderBattle();
};

window.renderBattle = function() {
    var b = window._battle;
    if (!b || !b.inProgress) return;
    var mobHpP = Math.max(0, (b.mobHp / b.mob.hp) * 100), playerHpP = Math.max(0, (b.playerHp / b.maxPlayerHp) * 100);
    var msg = '⚔️ БОЙ С ' + b.mob.name.toUpperCase() + ' (ур.' + b.mobLevel + ')\n\n';
    msg += '🐺 ' + b.mob.name + '\n❤️ HP: ' + b.mobHp + '/' + b.mob.hp + '\n';
    msg += '█'.repeat(Math.floor(mobHpP/5)) + '░'.repeat(20-Math.floor(mobHpP/5)) + '\n\n';
    msg += '❤️ ВЫ\n❤️ HP: ' + b.playerHp + '/' + b.maxPlayerHp + '\n';
    msg += '█'.repeat(Math.floor(playerHpP/5)) + '░'.repeat(20-Math.floor(playerHpP/5)) + '\n\n';
    if (b.horseAlive && b.horseHp > 0) {
        msg += '🐴 Лошадь HP: ' + b.horseHp + '/' + b.horseMaxHp + ' | ' + (b.mounted ? '🐴 Верхом' : '🚶 Пешком') + '\n';
    }
    msg += '\n🔄 Ход: ' + (b.turn === 'player' ? 'ВАШ' : b.mob.name.toUpperCase());
    if (b.log.length > 0) { msg += '\n\n📋 ' + b.log.slice(-3).join('\n'); }
    setMessage(msg);
    updateMenu();
    showBattleButtons();
};

window.battleAction = function(action) {
    var b = window._battle;
    if (!b || !b.inProgress) return;
    if (b.turn !== 'player') { setMessage('⏳ Ждите ход противника.'); return; }
    var g = users[currentUser].game;
    
    if (action === 'battle_flee') {
        if (Math.random() * 100 < 25 + (b.fleeAttempts||0)*5) { window.endBattle(false, 'Побег'); return; }
        b.fleeAttempts = (b.fleeAttempts||0) + 1; b.log.push('🏃 Побег не удался!');
        b.turn = 'mob'; window.renderBattle(); setTimeout(function(){ window.mobTurn(); }, 3000); return;
    }
    
    if (action === 'battle_attack') {
        var ts = getTotalStats(g); b.playerStats = ts;
        var hitChance = getHitChance(ts, { agility: b.mobAgility });
        if (Math.random() * 100 > hitChance) { b.log.push('💨 ' + b.mob.name + ' увернулся!'); b.turn = 'mob'; window.renderBattle(); setTimeout(function(){ window.mobTurn(); }, 3000); return; }
        var dmg = ts.damage + Math.floor(Math.random()*4);
        if (Math.random()*100 < ts.crit) { dmg = Math.round(dmg*2); b.log.push('💥 КРИТ!'); }
        if (ts.pierce > 0 && b.mobDefense) { var pr = Math.round(b.mobDefense*(ts.pierce/100)); b.mobDefense = Math.max(0, b.mobDefense-pr); }
        dmg = Math.max(1, dmg - b.mobDefense);
        b.mobHp = Math.max(0, b.mobHp - dmg); b.log.push('⚔️ Вы нанесли ' + dmg + ' урона.');
        if (Math.random()*100 < ts.doubleHit) { var d2 = Math.max(1, Math.round((ts.damage+Math.floor(Math.random()*4))*0.7) - b.mobDefense); b.mobHp = Math.max(0, b.mobHp - d2); b.log.push('⚡ ДВОЙНОЙ УДАР! +' + d2); }
        if (b.mobHp <= 0) { window.endBattle(true, 'Победа'); return; }
        b.turn = 'mob'; window.renderBattle(); setTimeout(function(){ window.mobTurn(); }, 3000); return;
    }
    
    if (action === 'battle_mount') { if (b.horseAlive && !b.mounted && b.horseHp>0) { b.mounted=true; setMessage('🐴 Вы сели на лошадь!'); } window.renderBattle(); return; }
    if (action === 'battle_dismount') { if (b.mounted) { b.mounted=false; setMessage('🐴 Вы слезли с лошади.'); } window.renderBattle(); return; }
};

window.mobTurn = function() {
    var b = window._battle; if (!b || !b.inProgress) { window._battle=null; return; }
    var g = users[currentUser].game, ts = getTotalStats(g); b.playerStats = ts;
    if (Math.random()*100 < calcChance(ts.agility)) {
        b.log.push('💨 Вы увернулись!');
        if (Math.random()*100 < ts.counter) { var cd = Math.max(1, Math.round(ts.damage*0.5)); b.mobHp = Math.max(0, b.mobHp-cd); b.log.push('💫 КОНТРАТАКА! +' + cd); if (b.mobHp<=0) { window.endBattle(true,'Победа'); return; } }
        b.turn='player'; window.renderBattle(); return;
    }
    var dmg = Math.max(1, b.mob.damage + Math.floor(Math.random()*3));
    if (b.mounted && b.horseAlive && b.horseHp>0) { var hd = Math.floor(dmg*0.3); b.horseHp = Math.max(0, b.horseHp-hd); dmg = Math.floor(dmg*0.7); b.log.push('🐴 Лошадь -' + hd + ' HP'); if (b.horseHp<=0) { b.horseAlive=false; b.mounted=false; setMessage('💀 Лошадь пала!'); } }
    b.playerHp = Math.max(0, b.playerHp - dmg); b.log.push('🐺 ' + b.mob.name + ' нанёс ' + dmg + ' урона.');
    if (b.playerHp <= 0) { window.endBattle(false, 'Смерть'); return; }
    b.turn = 'player'; window.renderBattle();
};

window.endBattle = function(won, reason) {
    var b = window._battle; if (!b) return; var g = users[currentUser].game;
    g.hp = b.playerHp; if (g.hp > g.maxHp) g.hp = g.maxHp;
    if (g.equipment && g.equipment.horse) { if (b.horseHp<=0) { g.equipment.horse=null; setMessage('💀 Лошадь погибла.'); } else { g.equipment.horse.hp = b.horseHp; } }
    if (won) {
        var xp = Math.round((b.mob.xp + Math.floor(Math.random()*5)) * getXpMultiplier(g));
        g.xp += xp;
        while (g.xp >= g.nextLevelXp) { g.xp -= g.nextLevelXp; g.level++; g.nextLevelXp = 100 + g.level*10; if (g.level<=100) g.attributePoints++; }
        if (b.mob.type==='animal') { var sc = 2+Math.floor(Math.random()*3); for (var i=0;i<sc;i++) addToInventory(g,{name:'Шкура',quality:'Обычное',type:'resource',resourceType:'leather',count:1}); setMessage('⚔️ ПОБЕДА! +'+xp+' XP\n🧵 Шкура ×'+sc); }
        if (b.mob.type==='human') { var coins = b.mob.level*3 + Math.floor(Math.random()*b.mob.level*3); g.copper += coins; convertCurrency(g); setMessage('⚔️ ПОБЕДА! +'+xp+' XP\n💰 +'+coins+' МП'); }
    } else {
        if (reason==='Смерть') { g.hp=g.maxHp; g.location.place='Таверна'; g.location.location='Королевская Гавань'; g.food=100; g.thirst=100; g.fatigue=100; g.outside=false; setMessage('💀 Вы возродились в таверне.'); updateStory(); }
        else { setMessage('🏃 Вы сбежали.'); }
    }
    window._battle = null; isBusy = false;
    document.getElementById('busy-status').classList.add('hide');
    updateMenu(); updateActions(); saveData();
};

// ============================================================
// 2. ПОИСК
// ============================================================

window.doSearch = function() {
    var g = users[currentUser].game;
    var region = g.location.region || 'Королевские земли';
    var place = g.location.place || 'Дорога';
    
    var cityPlaces = ['kings_landing', 'Таверна', 'Рынок', 'Кузница', 'Оружейная лавка', 
                      'Кожевник', 'Бронник', 'Плотник', 'Конюшня', 'Гильдия торговцев',
                      'Магистрат', 'Ворота', 'Королевский квартал', 'Торговый квартал',
                      'Квартал бедноты', 'Дом', 'Великая септа', 'Порт', 'Тюрьма',
                      'Библиотека мейстеров', 'Гильдия наёмников', 'Бордель'];
    
    if (cityPlaces.indexOf(place) !== -1) {
        setMessage('🏙️ В городе не водится дичь.');
        return;
    }
    
    if (g.food < 20) { setMessage('🍽️ Вы слишком голодны!'); return; }
    if (g.fatigue < 20) { setMessage('😴 Вы слишком устали!'); return; }
    
    if (Math.random() * 100 < 4.5) {
        var gold = 2 + Math.floor(Math.random() * 8);
        g.copper += gold; convertCurrency(g);
        setMessage('🪙 Клад! +' + gold + ' золота!');
        updateMenu(); saveData(); return;
    }
    
    if (Math.random() * 100 < 47.5) {
        var mob = window.getRandomMobByRegionAndLevel(region, place);
        if (mob) { setMessage('⚔️ Вы встретили ' + mob.name + ' (ур.' + mob.level + ')!'); window.startBattle(mob); return; }
    }
    
    setMessage('🔍 Вы никого не нашли.');
};

// ============================================================
// 3. КНОПКИ БОЯ
// ============================================================

function showBattleButtons() {
    var container = document.getElementById('actions-container');
    if (!container) return;
    container.innerHTML = '';
    var ba = [{ id: 'battle_attack', label: '⚔️ Атака' }, { id: 'battle_flee', label: '🏃 Побег' }];
    var b = window._battle;
    if (b && b.horseAlive && b.horseHp > 0) {
        ba.push(b.mounted ? { id: 'battle_dismount', label: '🐴 Слезть' } : { id: 'battle_mount', label: '🐴 Сесть' });
    }
    for (var i = 0; i < ba.length; i++) {
        var btn = document.createElement('button');
        btn.className = 'btn-game';
        btn.textContent = ba[i].label;
        btn.onclick = (function(id) { return function() { window.battleAction(id); }; })(ba[i].id);
        container.appendChild(btn);
    }
}

// ============================================================
// 4. КАРТА МЕСТ (ГЛОБАЛЬНАЯ)
// ============================================================

window.openPlaces = function() {
    var g = users[currentUser].game;
    var place = g.location.place;
    var loc = KL_AREAS[place];
    
    if (!loc || !loc.places || loc.places.length === 0) {
        setMessage('📍 Здесь нет мест.');
        return;
    }
    
    var modal = document.getElementById('modal-places');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-places';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closePlaces(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🏘️ МЕСТА</h3><button class="close-btn" onclick="closePlaces()">✕</button></div><div id="modal-places-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-places-content');
    var html = '<div class="modal-section"><h4>📍 ' + loc.name + '</h4>';
    html += '<div class="modal-section">';
    loc.places.forEach(function(p) {
        var isCurrent = (p === g.location.place);
        html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
        html += '<span class="label">' + p + (isCurrent ? ' ⭐' : '') + '</span>';
        if (!isCurrent) {
            html += '<span class="value"><button class="btn btn-small" onclick="goToPlace(\'' + p + '\'); closePlaces();">🚶 Идти</button></span>';
        } else {
            html += '<span class="value" style="color:#6a5a48;">Вы здесь</span>';
        }
        html += '</div>';
    });
    html += '</div><button class="btn" onclick="closePlaces()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
};

window.closePlaces = function() {
    var modal = document.getElementById('modal-places');
    if (modal) modal.classList.add('hide');
};

window.goToPlace = function(placeName) {
    var g = users[currentUser].game;
    if (!g) return;
    g.location.place = placeName;
    setMessage('🚶 Вы перешли в ' + placeName);
    updateMenu();
    updateStory();
    updateActions();
    saveData();
};

// ============================================================
// 5. ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

function setMessage(msg) {
    var el = document.getElementById('game-message');
    if (el) el.textContent = msg;
}

console.log('✅ UI полностью загружен!');

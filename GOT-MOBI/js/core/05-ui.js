// ============================================================
// js/core/05-ui.js — UI + ПОЛНАЯ БОЕВКА + ПОИСК
// ============================================================

console.log('🔧 UI + Боевка + Поиск загружаются...');

// ============================================================
// 1. БОЕВКА (ПОЛНАЯ ВЕРСИЯ)
// ============================================================

window._battle = null;

// 1.1. Мобы для локации
window.getMobsForLocation = function(region, place) {
    var regionMap = {
        'Королевские земли': 'crownlands',
        'Север': 'north',
        'Западные земли': 'westlands',
        'Простор': 'reach',
        'Речные земли': 'riverlands',
        'Штормовые земли': 'stormlands',
        'Дорн': 'dorne',
        'Долина': 'vale',
        'Железные острова': 'iron_islands'
    };
    var regionKey = regionMap[region] || 'crownlands';
    var regionMobs = MOBS[regionKey] || [];
    if (regionMobs.length === 0) regionMobs = MOBS.crownlands || [];
    
    var locationLevel = LOCATION_LEVELS[place] || 1;
    var minLevel = Math.max(1, locationLevel - 3);
    var maxLevel = locationLevel + 3;
    
    var filtered = regionMobs.filter(function(mob) {
        return mob.level >= minLevel && mob.level <= maxLevel;
    });
    
    if (filtered.length === 0 && regionMobs.length > 0) {
        filtered = regionMobs.slice(0, 5);
    }
    
    return filtered;
};

// 1.2. Случайный моб
window.getRandomMobByRegionAndLevel = function(region, place) {
    var mobs = window.getMobsForLocation(region, place);
    if (mobs.length === 0) {
        return { name: 'Крыса', hp: 8, damage: 2, defense: 0, xp: 3, level: 1, type: 'animal', agility: 2 };
    }
    return mobs[Math.floor(Math.random() * mobs.length)];
};

// 1.3. Запуск боя
window.startBattle = function(mob) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var maxHp = getMaxHp(g);
    g.maxHp = maxHp;
    if (g.hp === undefined || g.hp > maxHp) g.hp = maxHp;
    
    var totalStats = getTotalStats(g);
    
    var horseAlive = false, horseHp = 0, horseMaxHp = 0, mounted = false;
    if (g.equipment && g.equipment.horse) {
        var horse = HORSE_TYPES[g.equipment.horse.horseType];
        if (horse) {
            horseAlive = true;
            horseHp = g.equipment.horse.hp || horse.hp;
            horseMaxHp = g.equipment.horse.maxHp || horse.hp;
            mounted = true;
        }
    }
    
    window._battle = {
        mob: mob,
        playerHp: g.hp,
        mobHp: mob.hp,
        maxPlayerHp: maxHp,
        turn: 'player',
        inProgress: true,
        log: [],
        fleeAttempts: 0,
        playerStats: totalStats,
        mobAgility: mob.agility || 1,
        mobLevel: mob.level || 1,
        lastActionTime: Date.now(),
        horseAlive: horseAlive,
        horseHp: horseHp,
        horseMaxHp: horseMaxHp,
        mounted: mounted,
        horseDismounted: false,
        mobDefense: mob.defense || 0
    };
    
    isBusy = true;
    document.getElementById('busy-status').classList.remove('hide');
    document.getElementById('busy-status').textContent = '⚔️ Бой с ' + mob.name + '!';
    window.updateActions();
    window.renderBattle();
    window.saveBattleState();
};

// 1.4. Сохранение боя
window.saveBattleState = function() {
    var b = window._battle;
    if (b && b.inProgress) {
        b.lastActionTime = Date.now();
        localStorage.setItem('got_battle', JSON.stringify(b));
    } else {
        localStorage.removeItem('got_battle');
    }
};

// 1.5. Отображение боя
window.renderBattle = function() {
    var b = window._battle;
    if (!b || !b.inProgress) return;
    
    var mobHpPercent = Math.max(0, (b.mobHp / b.mob.hp) * 100);
    var playerHpPercent = Math.max(0, (b.playerHp / b.maxPlayerHp) * 100);
    
    var msg = '⚔️ БОЙ С ' + b.mob.name.toUpperCase() + ' (ур. ' + b.mobLevel + ')\n\n';
    msg += '🐺 ' + b.mob.name + ' (ур. ' + b.mobLevel + ')\n';
    msg += '❤️ HP: ' + Math.max(0, b.mobHp) + '/' + b.mob.hp + '\n';
    msg += '█'.repeat(Math.floor(mobHpPercent / 5)) + '░'.repeat(20 - Math.floor(mobHpPercent / 5)) + '\n\n';
    msg += '❤️ ВЫ\n';
    msg += 'HP: ' + Math.max(0, b.playerHp) + '/' + b.maxPlayerHp + '\n';
    msg += '█'.repeat(Math.floor(playerHpPercent / 5)) + '░'.repeat(20 - Math.floor(playerHpPercent / 5)) + '\n\n';
    
    if (b.horseAlive && b.horseHp > 0) {
        msg += '🐴 Лошадь (HP: ' + Math.max(0, b.horseHp) + '/' + b.horseMaxHp + ')\n';
        msg += '📌 ' + (b.mounted ? '🐴 Верхом' : '🚶 Пешком') + '\n';
    }
    msg += '\n🔄 Ход: ' + (b.turn === 'player' ? 'ВАШ' : b.mob.name.toUpperCase());
    if (b.turn === 'mob') msg += ' (⏳ 3 сек)';
    
    if (b.log.length > 0) {
        msg += '\n\n📋 Лог боя:\n';
        b.log.slice(-5).forEach(function(entry) { msg += '• ' + entry + '\n'; });
    }
    
    setMessage(msg);
    updateMenu();
};

// 1.6. Действия в бою
window.battleAction = function(action) {
    var b = window._battle;
    if (!b || !b.inProgress) { setMessage('❌ Бой не активен.'); return; }
    if (b.turn !== 'player') { setMessage('⏳ Сейчас ход противника. Подождите.'); return; }
    
    var g = users[currentUser].game;
    
    if (action === 'battle_flee') {
        var fleeChance = 25 + (b.fleeAttempts || 0) * 5;
        if (Math.random() * 100 < fleeChance) {
            b.log.push('🏃 Вы сбежали!');
            setMessage('🏃 Вы сбежали!');
            window.endBattle(false, 'Побег');
        } else {
            b.fleeAttempts = (b.fleeAttempts || 0) + 1;
            b.log.push('🏃 Побег не удался!');
            b.turn = 'mob';
            window.renderBattle();
            window.saveBattleState();
            setTimeout(function() { window.mobTurn(); }, 3000);
        }
        return;
    }
    
    if (action === 'battle_attack') {
        var totalStats = getTotalStats(g);
        b.playerStats = totalStats;
        var hitChance = getHitChance(totalStats, { agility: b.mobAgility });
        
        if (Math.random() * 100 > hitChance) {
            b.log.push('💨 ' + b.mob.name + ' увернулся! (шанс: ' + hitChance + '%)');
            b.turn = 'mob';
            window.renderBattle();
            window.saveBattleState();
            setTimeout(function() { window.mobTurn(); }, 3000);
            return;
        }
        
        var baseDamage = totalStats.damage + Math.floor(Math.random() * 4);
        var finalDamage = baseDamage;
        
        if (Math.random() * 100 < totalStats.crit) {
            finalDamage = Math.round(finalDamage * 2);
            b.log.push('💥 КРИТИЧЕСКИЙ УДАР!');
        }
        
        if (totalStats.pierce > 0 && b.mobDefense) {
            var pierceReduction = Math.round(b.mobDefense * (totalStats.pierce / 100));
            if (pierceReduction > 0) b.log.push('🛡️ Пробитие: -' + pierceReduction + ' защиты');
            var mobDefense = Math.max(0, b.mobDefense - pierceReduction);
        } else {
            var mobDefense = b.mobDefense;
        }
        
        finalDamage = Math.max(1, finalDamage - mobDefense);
        b.mobHp = Math.max(0, b.mobHp - finalDamage);
        b.log.push('⚔️ Вы нанесли ' + finalDamage + ' урона.');
        
        var weapon = g.equipment.rightHand;
        if (weapon && g.skills[weapon.type]) {
            var xpGain = Math.round(1 * getXpMultiplier(g));
            g.skills[weapon.type].xp = (g.skills[weapon.type].xp || 0) + xpGain;
            var needed = g.skills[weapon.type].level * 20 + 10;
            while (g.skills[weapon.type].xp >= needed) {
                g.skills[weapon.type].xp -= needed;
                g.skills[weapon.type].level = Math.min(999, g.skills[weapon.type].level + 1);
                setMessage('⚔️ Мастерство повышено до ' + g.skills[weapon.type].level + '!');
            }
        }
        
        if (Math.random() * 100 < totalStats.doubleHit) {
            var secondDamage = Math.max(1, Math.round(baseDamage * 0.7) - mobDefense);
            b.mobHp = Math.max(0, b.mobHp - secondDamage);
            b.log.push('⚡ ДВОЙНОЙ УДАР! +' + secondDamage + ' урона.');
        }
        
        if (b.mobHp <= 0) { window.endBattle(true, 'Победа'); return; }
        
        b.turn = 'mob';
        window.renderBattle();
        window.saveBattleState();
        setTimeout(function() { window.mobTurn(); }, 3000);
        return;
    }
    
    if (action === 'battle_mount') {
        if (b.horseAlive && !b.mounted && b.horseHp > 0) {
            b.mounted = true;
            b.log.push('🐴 Вы сели на лошадь!');
            setMessage('🐴 Вы снова верхом!');
        } else if (!b.horseAlive || b.horseHp <= 0) {
            setMessage('❌ Ваша лошадь мертва.');
        } else { setMessage('❌ Вы уже верхом.'); }
        window.renderBattle();
        window.saveBattleState();
        return;
    }
    
    if (action === 'battle_dismount') {
        if (b.mounted) {
            b.mounted = false;
            b.log.push('🐴 Вы слезли с лошади.');
            setMessage('🐴 Вы слезли с лошади.');
        } else { setMessage('❌ Вы не верхом.'); }
        window.renderBattle();
        window.saveBattleState();
        return;
    }
    
    window.updateActions();
};

// 1.7. Ход моба
window.mobTurn = function() {
    var b = window._battle;
    if (!b || !b.inProgress) { window._battle = null; localStorage.removeItem('got_battle'); return; }
    
    var g = users[currentUser].game;
    var totalStats = getTotalStats(g);
    b.playerStats = totalStats;
    
    var dodgeChance = calcChance(totalStats.agility);
    var mobDamage = b.mob.damage + Math.floor(Math.random() * 3);
    
    if (Math.random() * 100 < dodgeChance) {
        b.log.push('💨 Вы увернулись от атаки!');
        if (Math.random() * 100 < totalStats.counter) {
            var counterDamage = Math.max(1, Math.round(totalStats.damage * 0.5));
            b.mobHp = Math.max(0, b.mobHp - counterDamage);
            b.log.push('💫 КОНТРАТАКА! Урон: ' + counterDamage);
            if (b.mobHp <= 0) { window.endBattle(true, 'Победа'); return; }
        }
        b.turn = 'player';
        window.renderBattle();
        window.saveBattleState();
        window.updateActions();
        return;
    }
    
    var finalDamage = Math.max(1, mobDamage);
    
    if (b.mounted && b.horseAlive && b.horseHp > 0) {
        var horseDamage = Math.floor(finalDamage * 0.3);
        b.horseHp = Math.max(0, b.horseHp - horseDamage);
        finalDamage = Math.floor(finalDamage * 0.7);
        b.log.push('🐴 Лошадь получила ' + horseDamage + ' урона (HP: ' + b.horseHp + '/' + b.horseMaxHp + ')');
        if (b.horseHp <= 0) {
            b.horseAlive = false;
            b.mounted = false;
            b.log.push('💀 Ваша лошадь пала в бою!');
            setMessage('💀 Ваша лошадь пала в бою!');
        }
    }
    
    finalDamage = Math.max(1, finalDamage);
    b.playerHp = Math.max(0, b.playerHp - finalDamage);
    b.log.push('🐺 ' + b.mob.name + ' нанёс ' + finalDamage + ' урона');
    
    if (b.playerHp <= 0) { window.endBattle(false, 'Смерть'); return; }
    
    b.turn = 'player';
    window.renderBattle();
    window.saveBattleState();
    window.updateActions();
};

// 1.8. Завершение боя
window.endBattle = function(won, reason) {
    var b = window._battle;
    if (!b) return;
    
    var g = users[currentUser].game;
    
    g.hp = b.playerHp;
    if (g.hp > g.maxHp) g.hp = g.maxHp;
    
    if (g.equipment && g.equipment.horse) {
        var horse = g.equipment.horse;
        if (b.horseAlive && b.horseHp > 0) {
            horse.hp = horse.maxHp || 100;
        } else if (b.horseHp <= 0) {
            g.equipment.horse = null;
            setMessage('💀 Ваша лошадь погибла.');
        }
    }
    
    if (won) {
        var xpMultiplier = getXpMultiplier(g);
        var xpGain = Math.round((b.mob.xp + Math.floor(Math.random() * 5)) * xpMultiplier);
        g.xp += xpGain;
        
        while (g.xp >= g.nextLevelXp) {
            g.xp -= g.nextLevelXp;
            g.level++;
            g.nextLevelXp = 100 + g.level * 10;
            if (g.level <= 100) { g.attributePoints++; setMessage('🎉 Вы достигли ' + g.level + ' уровня!'); }
        }
        
        g.stamina.xp = (g.stamina.xp || 0) + Math.round(1 * getXpMultiplier(g));
        var staminaNeeded = g.stamina.level * 8 + 3;
        while (g.stamina.xp >= staminaNeeded) {
            g.stamina.xp -= staminaNeeded;
            g.stamina.level = Math.min(333, g.stamina.level + 1);
            g.maxHp = getMaxHp(g);
            g.hp = Math.min(g.hp + 5, g.maxHp);
            setMessage('💪 Выносливость повышена до ' + g.stamina.level + ' уровня!');
        }
        
        if (b.mob.type === 'animal') {
            var skinQuality = 'Обычное';
            var r = Math.random() * 100;
            if (r < 25) skinQuality = 'Хорошее';
            var skinCount = 2 + Math.floor(Math.random() * 3);
            for (var i = 0; i < skinCount; i++) {
                addToInventory(g, { name: 'Шкура', quality: skinQuality, type: 'resource', resourceType: 'leather', count: 1 });
            }
            setMessage('⚔️ ПОБЕДА! +' + xpGain + ' XP\n🧵 Добыто: Шкура ×' + skinCount);
        }
        
        if (b.mob.type === 'human') {
            var coins = (b.mob.level * 3) + Math.floor(Math.random() * (b.mob.level * 3));
            g.copper += coins;
            convertCurrency(g);
            setMessage('⚔️ ПОБЕДА! +' + xpGain + ' XP\n💰 Добыто: ' + coins + ' МП');
        }
    } else {
        if (reason === 'Смерть') {
            setMessage('💀 Вас убил ' + b.mob.name + '. Вы возродились в таверне.');
            g.hp = g.maxHp;
            g.location.place = 'Таверна';
            g.location.location = 'Королевская Гавань';
            g.food = 100; g.thirst = 100; g.fatigue = 100;
            g.outside = false;
        } else if (reason === 'Побег') {
            setMessage('🏃 Вы сбежали с поля боя.');
        }
    }
    
    window._battle = null;
    isBusy = false;
    document.getElementById('busy-status').classList.add('hide');
    localStorage.removeItem('got_battle');
    updateMenu();
    window.updateActions();
    updateStory();
    saveData();
};

// 1.9. Поиск сокровищ
window.findTreasure = function() {
    var g = users[currentUser].game;
    var luck = Math.min(25, g.luck || 0);
    var goldAmount = 2 + Math.floor(Math.random() * 8) + Math.floor(luck / 5);
    g.copper += goldAmount;
    convertCurrency(g);
    setMessage('🪙 Вы нашли клад! +' + goldAmount + ' золота!');
    updateMenu();
    saveData();
};

// ============================================================
// 2. ПОИСК
// ============================================================

window.doSearch = function() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var region = g.location.region || 'Королевские земли';
    var place = g.location.place || 'Дорога';
    var luck = Math.min(25, g.luck || 0);
    var luckBonus = Math.floor(luck / 10);
    
    if (g.food < 20) { setMessage('🍽️ Вы слишком голодны для поиска!'); return; }
    if (g.fatigue < 20) { setMessage('😴 Вы слишком устали для поиска!'); return; }
    
    var treasureChance = Math.min(4.5, 2 + luckBonus);
    if (Math.random() * 100 < treasureChance) {
        window.findTreasure();
        return;
    }
    
    var monsterChance = Math.min(47.5, 45 + luckBonus);
    if (Math.random() * 100 < monsterChance) {
        var mob = window.getRandomMobByRegionAndLevel(region, place);
        if (mob) {
            setMessage('⚔️ Вы встретили ' + mob.name + ' (уровень ' + mob.level + ')!');
            window.startBattle(mob);
            return;
        }
    }
    
    setMessage('🔍 Вы никого не нашли.');
};

// ============================================================
// 3. КНОПКИ
// ============================================================

function createActionButton(actionId, label) {
    var btn = document.createElement('button');
    btn.className = 'btn-game';
    btn.textContent = label;
    btn.onclick = function() {
        if (actionId === 'search') { window.doSearch(); return; }
        if (actionId === 'battle_attack' || actionId === 'battle_flee' || actionId === 'battle_mount' || actionId === 'battle_dismount') {
            if (typeof window.battleAction === 'function') { window.battleAction(actionId); }
            return;
        }
        if (typeof gameAction === 'function') { gameAction(actionId); }
        else { setMessage('❌ Действие недоступно.'); }
    };
    return btn;
}

// ============================================================
// 4. ОБНОВЛЕНИЕ КНОПОК
// ============================================================

var originalUpdateActions = window.updateActions;

window.updateActions = function() {
    var container = document.getElementById('actions-container');
    if (!container) return;
    
    // Если идёт бой — показываем боевые кнопки
    if (window._battle && window._battle.inProgress) {
        container.innerHTML = '';
        var battleActions = [
            { id: 'battle_attack', label: '⚔️ Атака' },
            { id: 'battle_flee', label: '🏃 Побег' }
        ];
        var b = window._battle;
        if (b.horseAlive && b.horseHp > 0) {
            if (b.mounted) {
                battleActions.push({ id: 'battle_dismount', label: '🐴 Слезть с лошади' });
            } else {
                battleActions.push({ id: 'battle_mount', label: '🐴 Сесть на лошадь' });
            }
        }
        for (var i = 0; i < battleActions.length; i++) {
            var btn = createActionButton(battleActions[i].id, battleActions[i].label);
            container.appendChild(btn);
        }
        return;
    }
    
    // Иначе — стандартные кнопки из kings_landing.js
    if (typeof originalUpdateActions === 'function') {
        originalUpdateActions();
    }
};

console.log('✅ ПОЛНАЯ БОЕВКА + UI ЗАГРУЖЕНЫ!');

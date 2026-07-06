// ============================================================
// js/core/05-ui.js — UI С ПОИСКОМ (ГОТОВО)
// ============================================================

function createActionButton(actionId, label) {
    var btn = document.createElement('button');
    btn.className = 'btn-game';
    btn.textContent = label;
    
    btn.onclick = function() {
        // ===== ПОИСК =====
        if (actionId === 'search') {
            window.doSearch();
            return;
        }
        
        // ===== ВСЁ ОСТАЛЬНОЕ =====
        if (typeof gameAction === 'function') {
            gameAction(actionId);
        } else {
            setMessage('❌ Действие недоступно.');
        }
    };
    
    return btn;
}

window.updateActions = function() {
    var container = document.getElementById('actions-container');
    if (!container) return;
    container.innerHTML = '';
    
    var g = users[currentUser]?.game;
    if (!g) return;
    
    var place = g.location.place || 'Таверна';
    var actions = [
        { id: 'inventory', label: '🎒 Инвентарь' },
        { id: 'character', label: '👤 Персонаж' },
        { id: 'menu', label: '📋 Меню' },
        { id: 'map', label: '🗺️ Карта' }
    ];
    
    if (place === 'Дорога') {
        actions.unshift(
            { id: 'enter_city', label: '🚶 Войти' },
            { id: 'search', label: '🔍 Поиск' }
        );
    }
    
    if (place === 'Таверна') {
        actions.unshift(
            { id: 'tavern_eat', label: '🍞 Попросить еды' },
            { id: 'rest', label: '🛏️ Отдохнуть' }
        );
    }
    
    if (place === 'Ворота') {
        if (!g.outside) {
            actions.unshift({ id: 'leave_city', label: '🚪 Выйти' });
        } else {
            actions.unshift({ id: 'enter_city', label: '🚶 Войти' });
        }
    }
    
    if (place === 'Дом') {
        actions.unshift(
            { id: 'home_rest', label: '🛏️ Отдохнуть' },
            { id: 'home_storage', label: '📦 Склад' },
            { id: 'home_leave', label: '🚪 Выйти' }
        );
    }
    
    for (var i = 0; i < actions.length; i++) {
        var btn = createActionButton(actions[i].id, actions[i].label);
        container.appendChild(btn);
    }
};

// ============================================================
// ПОИСК (ВСТРОЕН В UI)
// ============================================================

window.doSearch = function() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var region = g.location.region || 'Королевские земли';
    var place = g.location.place || 'Дорога';
    var luck = Math.min(25, g.luck || 0);
    var luckBonus = Math.floor(luck / 10);
    
    if (g.food < 20) {
        setMessage('🍽️ Вы слишком голодны для поиска!');
        return;
    }
    if (g.fatigue < 20) {
        setMessage('😴 Вы слишком устали для поиска!');
        return;
    }
    
    var treasureChance = Math.min(4.5, 2 + luckBonus);
    if (Math.random() * 100 < treasureChance) {
        findTreasure();
        return;
    }
    
    var monsterChance = Math.min(47.5, 45 + luckBonus);
    if (Math.random() * 100 < monsterChance) {
        var mob = getRandomMobByRegionAndLevel(region, place);
        if (mob) {
            setMessage('⚔️ Вы встретили ' + mob.name + ' (уровень ' + mob.level + ')');
            addLog('⚔️ ' + currentUser + ' встретил ' + mob.name);
            startBattle(mob);
            return;
        }
    }
    
    setMessage('🔍 Вы никого не нашли.');
};

window.findTreasure = function() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var luck = Math.min(25, g.luck || 0);
    var bonusLuck = Math.min(5, Math.floor(luck / 5));
    
    var goldAmount = 2 + Math.floor(Math.random() * 8) + bonusLuck;
    g.copper += goldAmount;
    convertCurrency(g);
    setMessage('🪙 Вы нашли клад! +' + goldAmount + ' золота!');
    addLog('🪙 ' + currentUser + ' нашёл клад: ' + goldAmount + ' золота');
    updateMenu();
    saveData();
};

console.log('✅ UI с поиском загружен!');
// ============================================================
// БОЕВКА (КОПИЯ ИЗ 02-battle.js)
// ============================================================
var battleState = null;
function getMobsForLocation(region, place) {
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
    if (filtered.length === 0) {
        var sorted = regionMobs.slice().sort(function(a, b) {
            return Math.abs(a.level - locationLevel) - Math.abs(b.level - locationLevel);
        });
        filtered = sorted.slice(0, 5);
    }
    if (filtered.length === 0 && regionMobs.length > 0) {
        filtered = regionMobs.slice(0, 5);
    }
    return filtered;
}

function getRandomMobByRegionAndLevel(region, place) {
    var mobs = getMobsForLocation(region, place);
    if (mobs.length === 0) {
        return { name: 'Крыса', hp: 8, damage: 2, defense: 0, xp: 3, level: 1, type: 'animal', agility: 2 };
    }
    return mobs[Math.floor(Math.random() * mobs.length)];
}

function startBattle(mob) {
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
    battleState = {
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
    updateActions();
    renderBattle();
    saveBattleState();
}

function saveBattleState() {
    if (battleState) {
        battleState.lastActionTime = Date.now();
        localStorage.setItem('got_battle', JSON.stringify(battleState));
    } else {
        localStorage.removeItem('got_battle');
    }
}

function renderBattle() {
    if (!battleState || !battleState.inProgress) return;
    var b = battleState;
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
        msg += '█'.repeat(Math.floor((b.horseHp / b.horseMaxHp) * 20)) + '░'.repeat(20 - Math.floor((b.horseHp / b.horseMaxHp) * 20)) + '\n';
        msg += '📌 ' + (b.mounted ? '🐴 Верхом' : '🚶 Пешком') + '\n';
    }
    msg += '\n🔄 Ход: ' + (b.turn === 'player' ? 'ВАШ' : b.mob.name.toUpperCase());
    if (b.turn === 'mob') msg += ' (⏳ 3 сек)';
    if (b.log.length > 0) {
        msg += '\n\n📋 Лог боя:\n';
        b.log.slice(-5).forEach(function(entry) {
            msg += '• ' + entry + '\n';
        });
    }
    setMessage(msg);
    updateActions();
    updateMenu();
    saveBattleState();
}

function battleAction(action) {
    if (!battleState || !battleState.inProgress) {
        setMessage('❌ Бой не активен.');
        return;
    }
    if (battleState.turn !== 'player') {
        setMessage('⏳ Сейчас ход противника. Подождите.');
        return;
    }
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    if (action === 'battle_flee') {
        attemptFlee();
        return;
    }
    if (action === 'battle_attack') {
        playerAttack();
        return;
    }
    if (action === 'battle_mount') {
        if (battleState.horseAlive && !battleState.mounted && battleState.horseHp > 0) {
            battleState.mounted = true;
            battleState.log.push('🐴 Вы сели на лошадь!');
            setMessage('🐴 Вы снова верхом!');
            renderBattle();
            saveBattleState();
        } else if (!battleState.horseAlive || battleState.horseHp <= 0) {
            setMessage('❌ Ваша лошадь мертва.');
        } else {
            setMessage('❌ Вы уже верхом.');
        }
        return;
    }
    if (action === 'battle_dismount') {
        if (battleState.mounted) {
            battleState.mounted = false;
            battleState.log.push('🐴 Вы слезли с лошади.');
            setMessage('🐴 Вы слезли с лошади.');
            renderBattle();
            saveBattleState();
        } else {
            setMessage('❌ Вы не верхом.');
        }
        return;
    }
}

function playerAttack() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var b = battleState;
    var totalStats = getTotalStats(g);
    b.playerStats = totalStats;
    var hitChance = getHitChance(totalStats, { agility: b.mobAgility });
    if (Math.random() * 100 > hitChance) {
        b.log.push('💨 ' + b.mob.name + ' увернулся! (шанс: ' + hitChance + '%)');
        b.turn = 'mob';
        renderBattle();
        saveBattleState();
        setTimeout(function() {
            if (battleState && battleState.inProgress) mobTurn();
        }, 3000);
        return;
    }
    var baseDamage = totalStats.damage + Math.floor(Math.random() * 4);
    var finalDamage = baseDamage;
    if (Math.random() * 100 < totalStats.crit) {
        finalDamage = Math.round(finalDamage * 2);
        b.log.push('💥 КРИТИЧЕСКИЙ УДАР!');
    }
    var pierceReduction = 0;
    if (totalStats.pierce > 0 && b.mobDefense) {
        pierceReduction = Math.round(b.mobDefense * (totalStats.pierce / 100));
        if (pierceReduction > 0) {
            b.log.push('🛡️ Пробитие: -' + pierceReduction + ' защиты');
        }
    }
    var mobDefense = Math.max(0, b.mobDefense - pierceReduction);
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
    if (b.mobHp <= 0) {
        endBattle(true, 'Победа');
        return;
    }
    b.turn = 'mob';
    renderBattle();
    saveBattleState();
    setTimeout(function() {
        if (battleState && battleState.inProgress) mobTurn();
    }, 3000);
}

function mobTurn() {
    if (!battleState || !battleState.inProgress) {
        battleState = null;
        localStorage.removeItem('got_battle');
        return;
    }
    var user = users[currentUser];
    if (!user) {
        battleState = null;
        localStorage.removeItem('got_battle');
        return;
    }
    var g = user.game;
    var b = battleState;
    var totalStats = getTotalStats(g);
    b.playerStats = totalStats;
    var dodgeChance = calcChance(totalStats.agility);
    var mobDamage = b.mob.damage + Math.floor(Math.random() * 3);
    if (Math.random() * 100 < dodgeChance) {
        b.log.push('💨 Вы увернулись от атаки! (шанс: ' + dodgeChance + '%)');
        if (Math.random() * 100 < totalStats.counter) {
            var counterDamage = Math.max(1, Math.round(totalStats.damage * 0.5));
            b.mobHp = Math.max(0, b.mobHp - counterDamage);
            b.log.push('💫 КОНТРАТАКА! Урон: ' + counterDamage);
            if (b.mobHp <= 0) {
                endBattle(true, 'Победа');
                return;
            }
        }
        b.turn = 'player';
        renderBattle();
        saveBattleState();
        return;
    }
    var finalDamage = Math.max(1, mobDamage);
    var newHorseHp = b.horseHp;
    if (b.mounted && b.horseAlive && b.horseHp > 0) {
        var horseDamage = Math.floor(finalDamage * 0.3);
        newHorseHp = Math.max(0, b.horseHp - horseDamage);
        finalDamage = Math.floor(finalDamage * 0.7);
        b.log.push('🐴 Лошадь получила ' + horseDamage + ' урона (HP: ' + newHorseHp + '/' + b.horseMaxHp + ')');
        if (newHorseHp <= 0) {
            b.horseAlive = false;
            b.mounted = false;
            b.log.push('💀 Ваша лошадь пала в бою!');
            setMessage('💀 Ваша лошадь пала в бою!');
        }
        b.horseHp = newHorseHp;
    }
    finalDamage = Math.max(1, finalDamage);
    b.playerHp = Math.max(0, b.playerHp - finalDamage);
    b.log.push('🐺 ' + b.mob.name + ' нанёс ' + finalDamage + ' урона');
    if (b.playerHp <= 0) {
        endBattle(false, 'Смерть');
        return;
    }
    b.turn = 'player';
    renderBattle();
    saveBattleState();
}

function attemptFlee() {
    var b = battleState;
    var fleeChance = 25 + (b.fleeAttempts || 0) * 5;
    if (Math.random() * 100 < fleeChance) {
        b.log.push('🏃 Вы сбежали!');
        endBattle(false, 'Побег');
    } else {
        b.fleeAttempts = (b.fleeAttempts || 0) + 1;
        b.log.push('🏃 Побег не удался! (шанс: ' + fleeChance + '%)');
        b.turn = 'mob';
        renderBattle();
        saveBattleState();
        setTimeout(function() {
            if (battleState && battleState.inProgress) mobTurn();
        }, 

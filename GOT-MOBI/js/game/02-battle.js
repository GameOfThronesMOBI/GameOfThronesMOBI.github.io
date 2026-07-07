// ============================================================
// js/game/02-battle2.js — БОЕВКА (МИНИМАЛЬНАЯ)
// ============================================================

console.log('⚔️ Боевка v2 загружена');

var battleState = null;

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
    return regionMobs.filter(function(mob) {
        return mob.level >= minLevel && mob.level <= maxLevel;
    });
};

window.getRandomMobByRegionAndLevel = function(region, place) {
    var mobs = window.getMobsForLocation(region, place);
    if (mobs.length === 0) return { name: 'Крыса', hp: 8, damage: 2, defense: 0, xp: 3, level: 1, type: 'animal', agility: 2 };
    return mobs[Math.floor(Math.random() * mobs.length)];
};

window.startBattle = function(mob) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    battleState = {
        mob: mob,
        playerHp: g.hp,
        mobHp: mob.hp,
        maxPlayerHp: getMaxHp(g),
        turn: 'player',
        inProgress: true,
        log: [],
        mobLevel: mob.level || 1
    };
    
    isBusy = true;
    document.getElementById('busy-status').classList.remove('hide');
    document.getElementById('busy-status').textContent = '⚔️ Бой с ' + mob.name + '!';
    
    var msg = '⚔️ БОЙ С ' + mob.name.toUpperCase() + ' (ур.' + mob.level + ')\n\n';
    msg += '❤️ Враг HP: ' + mob.hp + '/' + mob.hp + '\n';
    msg += '❤️ Вы HP: ' + g.hp + '/' + getMaxHp(g) + '\n\n';
    msg += '🔄 Ваш ход.';
    
    setMessage(msg);
    window.updateActions();
};

window.battleAction = function(action) {
    if (!battleState || !battleState.inProgress) return;
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    var b = battleState;
    
    if (action === 'battle_attack') {
        var damage = (g.stats.damage || 1) + Math.floor(Math.random() * 4);
        b.mobHp = Math.max(0, b.mobHp - damage);
        b.log.push('⚔️ Вы нанесли ' + damage + ' урона.');
        
        if (b.mobHp <= 0) {
            var xp = b.mob.xp || 5;
            g.xp += xp;
            g.copper += Math.floor(Math.random() * 10) + 1;
            convertCurrency(g);
            setMessage('⚔️ ПОБЕДА! +' + xp + ' XP\n💰 Добыто: ' + (Math.floor(Math.random() * 10) + 1) + ' МП');
            battleState = null;
            isBusy = false;
            document.getElementById('busy-status').classList.add('hide');
            window.updateActions();
            updateMenu();
            saveData();
            return;
        }
        
        var mobDamage = b.mob.damage + Math.floor(Math.random() * 3);
        b.playerHp = Math.max(0, b.playerHp - mobDamage);
        b.log.push('🐺 ' + b.mob.name + ' нанёс ' + mobDamage + ' урона.');
        
        if (b.playerHp <= 0) {
            setMessage('💀 Вас убил ' + b.mob.name + '. Вы возродились в таверне.');
            g.hp = getMaxHp(g);
            g.location.place = 'Таверна';
            g.location.location = 'Королевская Гавань';
            g.outside = false;
            battleState = null;
            isBusy = false;
            document.getElementById('busy-status').classList.add('hide');
            window.updateActions();
            updateMenu();
            updateStory();
            saveData();
            return;
        }
        
        var msg = '⚔️ БОЙ С ' + b.mob.name.toUpperCase() + '\n\n';
        msg += '❤️ Враг HP: ' + b.mobHp + '/' + b.mob.hp + '\n';
        msg += '❤️ Вы HP: ' + b.playerHp + '/' + b.maxPlayerHp + '\n\n';
        msg += b.log.slice(-2).join('\n');
        setMessage(msg);
        updateMenu();
    }
    
    if (action === 'battle_flee') {
        if (Math.random() * 100 < 30) {
            setMessage('🏃 Вы сбежали!');
            battleState = null;
            isBusy = false;
            document.getElementById('busy-status').classList.add('hide');
            window.updateActions();
            return;
        }
        setMessage('🏃 Побег не удался!');
    }
    
    window.updateActions();
};

console.log('⚔️ Боевка v2 готова!');

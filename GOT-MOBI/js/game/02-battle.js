// ============================================================
// js/game/02-battle.js — БОЙ (БЕЗ ПОИСКА)
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
    
    var drunkards = [];
    if (place === 'Квартал бедноты' || place === 'Таверна' || place === 'Бордель') {
        drunkards = MOBS.drunkards || [];
        drunkards.forEach(function(d) {
            if (Math.random() * 100 < 30) regionMobs.push(d);
        });
        if (Math.random() * 100 < 50 && drunkards.length > 0) {
            regionMobs.push(drunkards[Math.floor(Math.random() * drunkards.length)]);
        }
    }
    
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
        var fallback = getMobsForLocation('Королевские земли', place);
        if (fallback.length === 0) {
            return { name: 'Крыса', hp: 8, damage: 2, defense: 0, xp: 3, level: 1, type: 'animal', agility: 2 };
        }
        return fallback[Math.floor(Math.random() * fallback.length)];
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
    
    var horseAlive = false;
    var horseHp = 0;
    var horseMaxHp = 0;
    var mounted = false;
    
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
        }, 3000);
    }
}

function endBattle(won, reason) {
    if (!battleState) return;
    
    var user = users[currentUser];
    if (!user) {
        battleState = null;
        localStorage.removeItem('got_battle');
        return;
    }
    var g = user.game;
    var b = battleState;
    
    g.hp = b.playerHp;
    if (g.hp > g.maxHp) g.hp = g.maxHp;
    
    if (g.equipment && g.equipment.horse) {
        var horse = g.equipment.horse;
        if (b.horseAlive && b.horseHp > 0) {
            horse.hp = horse.maxHp || 100;
            if (b.horseHp < horse.maxHp) {
                setMessage('🐴 Ваша лошадь восстановила силы.');
            }
        } else if (b.horseHp <= 0) {
            g.equipment.horse = null;
            setMessage('💀 Ваша лошадь погибла.');
            addLog('💀 ' + currentUser + ' потерял лошадь в бою');
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
            if (g.level <= 100) {
                g.attributePoints++;
                setMessage('🎉 Вы достигли ' + g.level + ' уровня! +1 очко атрибутов.');
            } else {
                setMessage('🎉 Вы достигли ' + g.level + ' уровня!');
            }
        }
        
        g.stamina.xp = (g.stamina.xp || 0) + Math.round(1 * getXpMultiplier(g));
        var staminaNeeded = g.stamina.level * 8 + 3;
        while (g.stamina.xp >= staminaNeeded) {
            g.stamina.xp -= staminaNeeded;
            g.stamina.level = Math.min(333, g.stamina.level + 1);
            g.maxHp = getMaxHp(g);
            g.hp = Math.min(g.hp + 5, g.maxHp);
            setMessage('💪 Выносливость повышена до ' + g.stamina.level + ' уровня! (+5 HP)');
        }
        
        if (b.mob.type === 'animal') {
            dropLoot(g, b.mob);
        }
        
        if (b.mob.type === 'human') {
            var coins = (b.mob.level * 3) + Math.floor(Math.random() * (b.mob.level * 3));
            g.copper += coins;
            convertCurrency(g);
            setMessage('💰 Вы нашли ' + coins + ' МП у ' + b.mob.name);
        }
        
        setMessage('⚔️ ПОБЕДА! +' + xpGain + ' XP');
        addLog('⚔️ ' + currentUser + ' победил ' + b.mob.name + ' (ур. ' + b.mob.level + ')');
        
    } else {
        if (reason === 'Смерть') {
            setMessage('💀 Вас убил ' + b.mob.name + '. Вы возродились в таверне.');
            g.hp = g.maxHp;
            g.location.place = 'Таверна';
            g.location.location = 'Королевская Гавань';
            g.food = 100;
            g.thirst = 100;
            g.fatigue = 100;
            g.outside = false;
            addLog('💀 ' + currentUser + ' убит ' + b.mob.name);
        } else if (reason === 'Побег') {
            setMessage('🏃 Вы сбежали с поля боя.');
        }
    }
    
    battleState.inProgress = false;
    battleState = null;
    isBusy = false;
    document.getElementById('busy-status').classList.add('hide');
    localStorage.removeItem('got_battle');
    
    updateMenu();
    updateActions();
    saveData();
}

function dropLoot(g, mob) {
    function rollSkinQ(ml) {
        var r = Math.random() * 100;
        if (ml >= 50 && r < 5) return 'Мастерское';
        if (ml >= 40 && r < 10) return 'Качественное';
        if (ml >= 30 && r < 15) return 'Хорошее';
        if (ml >= 20 && r < 25) return 'Хорошее';
        if (ml >= 10 && r < 40) return 'Обычное';
        if (r < 60) return 'Плохое';
        return 'Рваное';
    }
    
    function getSkinC(ml) {
        if (ml >= 50) return 5 + Math.floor(Math.random() * 4);
        if (ml >= 40) return 4 + Math.floor(Math.random() * 3);
        if (ml >= 30) return 3 + Math.floor(Math.random() * 3);
        if (ml >= 20) return 2 + Math.floor(Math.random() * 3);
        if (ml >= 10) return 2 + Math.floor(Math.random() * 2);
        if (ml >= 5) return 1 + Math.floor(Math.random() * 2);
        return 1;
    }
    
    function getMeatC(ml) {
        if (ml >= 50) return 4 + Math.floor(Math.random() * 3);
        if (ml >= 30) return 3 + Math.floor(Math.random() * 3);
        if (ml >= 15) return 2 + Math.floor(Math.random() * 3);
        if (ml >= 5) return 1 + Math.floor(Math.random() * 2);
        return 1;
    }
    
    var skinQuality = rollSkinQ(mob.level);
    var hunterBonus = Math.floor((g.professions['Охотник'] || 1) / 10);
    var skinCount = getSkinC(mob.level) + hunterBonus;
    
    for (var i = 0; i < skinCount; i++) {
        addToInventory(g, {
            name: 'Шкура',
            quality: skinQuality,
            type: 'resource',
            resourceType: 'leather',
            count: 1
        });
    }
    
    var meatCount = getMeatC(mob.level);
    for (var i = 0; i < meatCount; i++) {
        addToInventory(g, {
            name: '🥩 Мясо',
            quality: 'Обычное',
            type: 'food',
            effect: { food: 30 },
            count: 1
        });
    }
    
    setMessage('🧵 Добыто: Шкура ×' + skinCount + ' (' + skinQuality + ')\n🍖 Мясо ×' + meatCount);
    
    g.professionXp['Охотник'] = (g.professionXp['Охотник'] || 0) + Math.round(3 * getXpMultiplier(g));
    while (g.professionXp['Охотник'] >= g.professions['Охотник'] * 10) {
        g.professionXp['Охотник'] -= g.professions['Охотник'] * 10;
        g.professions['Охотник']++;
        setMessage('👷 Охотник повышен до ' + g.professions['Охотник'] + ' уровня!');
    }
}

// ============================================================
// РЕГИСТРАЦИЯ В WINDOW
// ============================================================

window.startBattle = startBattle;
window.battleAction = battleAction;
window.getMobsForLocation = getMobsForLocation;
window.getRandomMobByRegionAndLevel = getRandomMobByRegionAndLevel;

console.log('⚔️ Боевая система загружена (без поиска)!');

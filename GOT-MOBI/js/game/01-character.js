// ============================================================
// js/game/01-character.js — ПЕРСОНАЖ, СТАТЫ, ПРОКАЧКА
// ============================================================

// ============================================================
// 1. ОСНОВНЫЕ СТАТЫ
// ============================================================

function getMaxHp(g) {
    var staminaLevel = g.stamina ? g.stamina.level : 1;
    var bonusHp = 0;
    if (g.housing && g.housing.type && HOUSING_TYPES[g.housing.type]) {
        bonusHp = HOUSING_TYPES[g.housing.type].restHp || 0;
    }
    return 60 + (g.level - 1) * 10 + staminaLevel * 2 + bonusHp;
}

function getXpMultiplier(g) {
    var multiplier = 1 + (g.stats.intelligence / 100);
    
    if (g.brothelBuffs) {
        var now = Date.now();
        g.brothelBuffs = g.brothelBuffs.filter(function(b) { return b.expires > now; });
        g.brothelBuffs.forEach(function(buff) {
            if (buff.type === 'xp') {
                multiplier += buff.value / 100;
            }
        });
    }
    
    if (g.blessing && g.blessing.active && g.blessing.expires > Date.now()) {
        multiplier *= 1.1;
    }
    
    return multiplier;
}

function getMaxInventory(g) {
    var baseLimit = 50;
    var bonusSlots = 0;
    if (g.equipment && g.equipment.horse) {
        var horse = HORSE_TYPES[g.equipment.horse.horseType];
        if (horse) bonusSlots = horse.inventorySlots || 0;
    }
    return baseLimit + bonusSlots;
}

// ============================================================
// 2. БОНУСЫ ОТ ЭКИПИРОВКИ
// ============================================================

function getEquippedStats(g) {
    var bonusDamage = 0, bonusDefense = 0, bonusAgility = 0, bonusSpeedPercent = 0;
    var slots = ['rightHand','leftHand','helmet','chestplate','shoulders','leggings','boots','gloves','belt','cloak'];
    slots.forEach(function(slot) {
        var item = g.equipment[slot];
        if (item) {
            if (item.finalDamage) bonusDamage += item.finalDamage;
            if (item.finalDefense) bonusDefense += item.finalDefense;
            if (item.agilityBonus) bonusAgility += item.agilityBonus;
            if (item.speedPercent) bonusSpeedPercent += item.speedPercent;
        }
    });
    return { bonusDamage: bonusDamage, bonusDefense: bonusDefense, bonusAgility: bonusAgility, bonusSpeedPercent: bonusSpeedPercent };
}

// ============================================================
// 3. МАСТЕРСТВО ОРУЖИЯ
// ============================================================

function getWeaponMasteryBonus(g) {
    var weapon = g.equipment.rightHand;
    if (!weapon) {
        return {
            damageBonus: 0,
            defenseBonus: 0,
            agilityBonus: 0,
            critBonus: 0,
            pierceBonus: 0,
            doubleHitBonus: 0,
            counterBonus: 0,
            speedBonus: 0,
            skillLevel: 0,
            weaponType: 'нет'
        };
    }
    
    var weaponType = weapon.type;
    var skill = g.skills[weaponType];
    var skillLevel = skill ? Math.min(skill.level, 999) : 1;
    
    var damageBonus = 0, defenseBonus = 0, agilityBonus = 0;
    for (var i = 1; i <= skillLevel; i++) {
        var cycle = i % 3;
        if (cycle === 1) damageBonus += 1;
        else if (cycle === 2) defenseBonus += 1;
        else if (cycle === 0) agilityBonus += 1;
    }
    
    var speedBonus = Math.min(65, Math.floor(skillLevel / 5));
    
    var maxActive = Math.min(skillLevel, 325);
    var critBonus = Math.floor(maxActive / 5);
    var pierceBonus = Math.floor(maxActive / 5);
    var doubleHitBonus = Math.floor(maxActive / 5);
    
    var counterBonus = 0;
    if (skillLevel > 325) {
        var counterLevels = Math.min(skillLevel - 325, 325);
        counterBonus = Math.floor(counterLevels / 5);
    }
    
    return {
        damageBonus: damageBonus,
        defenseBonus: defenseBonus,
        agilityBonus: agilityBonus,
        critBonus: critBonus,
        pierceBonus: pierceBonus,
        doubleHitBonus: doubleHitBonus,
        counterBonus: counterBonus,
        speedBonus: speedBonus,
        skillLevel: skillLevel,
        weaponType: weaponType
    };
}

// ============================================================
// 4. АКТИВНЫЕ БОНУСЫ
// ============================================================

function getActiveBonus(g, type) {
    var base = 5;
    var bonus = g.activeBonuses[type] || 0;
    return Math.min(37.5, base + bonus * 0.5);
}

function distributeMasteryPoint(type) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (g.activeBonuses.points <= 0) {
        setMessage('❌ Нет доступных очков мастерства.');
        return;
    }
    
    var current = g.activeBonuses[type] || 0;
    if (current >= 65) {
        setMessage('❌ Максимум для ' + type + ' достигнут.');
        return;
    }
    
    g.activeBonuses[type] += 1;
    g.activeBonuses.points -= 1;
    setMessage('✅ +0.5% к ' + type + ' (всего: ' + getActiveBonus(g, type) + '%)');
    saveData();
    updateMenu();
    openCharacter();
}

// ============================================================
// 5. ПОЛНЫЙ РАСЧЁТ СТАТОВ
// ============================================================

function getTotalStats(g) {
    var equipped = getEquippedStats(g);
    var mastery = getWeaponMasteryBonus(g);
    
    var totalAgility = (g.stats.agility || 1) + equipped.bonusAgility + mastery.agilityBonus;
    var totalDefense = (g.stats.defense || 1) + equipped.bonusDefense + mastery.defenseBonus;
    var totalDamage = (g.stats.damage || 1) + equipped.bonusDamage + mastery.damageBonus;
    
    var bonusInt = 0, bonusLuck = 0, bonusDef = 0;
    if (g.housing && g.housing.type && HOUSING_TYPES[g.housing.type]) {
        var house = HOUSING_TYPES[g.housing.type];
        bonusInt = house.bonusInt || 0;
        bonusLuck = house.bonusLuck || 0;
        bonusDef = house.bonusDef || 0;
    }
    
    var speedPercent = mastery.speedBonus || 0;
    if (g.equipment && g.equipment.boots && g.equipment.boots.speedPercent) {
        speedPercent += g.equipment.boots.speedPercent;
    }
    if (g.equipment && g.equipment.horse) {
        var horse = HORSE_TYPES[g.equipment.horse.horseType];
        if (horse) speedPercent += horse.speedBonus || 0;
    }
    
    var horseDefensePercent = 0;
    if (g.equipment && g.equipment.horse) {
        var horse = HORSE_TYPES[g.equipment.horse.horseType];
        if (horse) horseDefensePercent = horse.defensePercent || 0;
    }
    
    var finalDefense = totalDefense + bonusDef;
    if (horseDefensePercent > 0) {
        finalDefense = Math.round(finalDefense * (1 + horseDefensePercent / 100));
    }
    
    var luck = Math.min(25, g.luck || 0);
    var critFromLuck = Math.floor(luck / 10);
    
    var blessingMultiplier = 1;
    if (g.blessing && g.blessing.active && g.blessing.expires > Date.now()) {
        blessingMultiplier = 1.1;
    }
    
    var damageBuff = 0;
    if (g.brothelBuffs) {
        var now = Date.now();
        g.brothelBuffs = g.brothelBuffs.filter(function(b) { return b.expires > now; });
        g.brothelBuffs.forEach(function(buff) {
            if (buff.type === 'damage') {
                damageBuff += buff.value;
            }
        });
    }
    
    return {
        damage: totalDamage + damageBuff,
        defense: finalDefense,
        agility: totalAgility,
        intelligence: (g.stats.intelligence || 1) + bonusInt,
        speedPercent: speedPercent,
        crit: getActiveBonus(g, 'crit') + critFromLuck,
        pierce: getActiveBonus(g, 'pierce'),
        doubleHit: getActiveBonus(g, 'doubleHit'),
        counter: getActiveBonus(g, 'counter'),
        weaponType: mastery.weaponType,
        skillLevel: mastery.skillLevel,
        maxHp: getMaxHp(g),
        luck: luck,
        horseDefensePercent: horseDefensePercent,
        blessingMultiplier: blessingMultiplier,
        speedDetails: {
            boots: g.equipment && g.equipment.boots ? (g.equipment.boots.speedPercent || 0) : 0,
            horse: (g.equipment && g.equipment.horse) ? (HORSE_TYPES[g.equipment.horse.horseType]?.speedBonus || 0) : 0,
            mastery: mastery.speedBonus || 0
        }
    };
}

// ============================================================
// 6. ШАНСЫ
// ============================================================

function calcDamageReduction(defense) {
    var reduction = defense / 10.4714;
    return Math.min(70, Math.max(0, Math.round(reduction * 10) / 10));
}

function calcChance(agility) {
    var chance = 50 + (agility / 10.4714);
    return Math.min(70, Math.max(30, Math.round(chance * 10) / 10));
}

function getHitChance(attackerStats, defenderStats) {
    var chance = 50 + (attackerStats.agility - defenderStats.agility) * 0.1;
    return Math.min(70, Math.max(30, Math.round(chance * 10) / 10));
}

// ============================================================
// 7. АТРИБУТЫ
// ============================================================

function getDistributedPoints(g) {
    return (g.stats.damage || 1) + (g.stats.defense || 1) + (g.stats.agility || 1) + (g.stats.intelligence || 1) - 4;
}

function resetAttributes() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var now = Date.now();
    
    if (g.lastReset && (now - g.lastReset) < 3 * 24 * 60 * 60 * 1000) {
        setMessage('❌ Сброс доступен раз в 3 дня.');
        return;
    }
    
    g.attributePoints = Math.min(100, g.level);
    g.stats = { damage: 1, defense: 1, intelligence: 1, agility: 1 };
    g.lastReset = now;
    setMessage('✅ Атрибуты сброшены! Доступно очков: ' + g.attributePoints);
    updateMenu();
    saveData();
    openCharacter();
}

function addAttribute(statId) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (g.attributePoints <= 0) {
        setMessage('❌ Нет свободных очков атрибутов.');
        return;
    }
    
    g.attributePoints--;
    g.stats[statId] = (g.stats[statId] || 1) + 1;
    saveData();
    updateMenu();
    openCharacter();
}

// ============================================================
// 8. ОТКРЫТИЕ ПЕРСОНАЖА (МОДАЛЬНОЕ ОКНО)
// ============================================================

function openCharacter() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var modal = document.getElementById('modal-character');
    var content = document.getElementById('modal-content');
    
    var totalStats = getTotalStats(g);
    var equipped = getEquippedStats(g);
    var mastery = getWeaponMasteryBonus(g);
    
    var html = '';
    
    html += '<div class="modal-section"><h4>📋 ОСНОВНОЕ</h4>';
    html += '<div class="row"><span class="label">Имя</span><span class="value">' + currentUser + '</span></div>';
    
    // Пол
    var genderEmoji = g.gender === 'male' ? '♂️' : (g.gender === 'female' ? '♀️' : '❓');
    var genderText = g.gender === 'male' ? 'Мужской' : (g.gender === 'female' ? 'Женский' : 'Не указан');
    html += '<div class="row"><span class="label">👤 Пол</span><span class="value">' + genderEmoji + ' ' + genderText + '</span></div>';
    
    html += '<div class="row"><span class="label">Национальность</span><span class="value">' + user.nationality + '</span></div>';
    html += '<div class="row"><span class="label">Дом</span><span class="value">' + (g.house || 'Нет') + '</span></div>';
    
    // Титул
    var title = '';
    if (g.house && g.houseRank && HOUSE_RANKS && HOUSE_RANKS[g.houseRank]) {
        title = HOUSE_RANKS[g.houseRank].name;
    } else if (g.house) {
        title = 'Член дома';
    } else {
        title = 'Без дома';
    }
    html += '<div class="row"><span class="label">🎖️ Титул</span><span class="value">' + title + '</span></div>';
    
    html += '<div class="row"><span class="label">Уровень</span><span class="value">' + g.level + ' (' + g.xp + '/' + g.nextLevelXp + ')</span></div>';
    html += '<div class="row"><span class="label">Очки атрибутов</span><span class="value">' + g.attributePoints + '</span></div>';
    html += '<div class="row"><span class="label">HP</span><span class="value">' + Math.round(g.hp) + '/' + g.maxHp + '</span></div>';
    
    if (g.blessing && g.blessing.active && g.blessing.expires > Date.now()) {
        var timeLeft = Math.ceil((g.blessing.expires - Date.now()) / 60000);
        html += '<div class="row"><span class="label">🙏 Благословение</span><span class="value" style="color:#ffd700;">✅ +10% опыта (' + timeLeft + ' мин)</span></div>';
    }
    
    if (g.equipment && g.equipment.horse) {
        var horse = HORSE_TYPES[g.equipment.horse.horseType];
        if (horse) {
            html += '<div class="row"><span class="label">🐴 Лошадь</span><span class="value">' + horse.emoji + ' ' + horse.name + ' (HP: ' + g.equipment.horse.hp + '/' + g.equipment.horse.maxHp + ')</span></div>';
        }
    }
    html += '</div>';
    
    html += '<div class="modal-section"><h4>⚔️ АТРИБУТЫ (распределено: ' + getDistributedPoints(g) + '/100)</h4>';
    var statLabels = {
        damage: '⚔️ Урон',
        defense: '🛡️ Защита',
        intelligence: '🧠 Интеллект',
        agility: '💨 Ловкость'
    };
    ['damage', 'defense', 'intelligence', 'agility'].forEach(function(s) {
        var base = g.stats[s] || 1;
        var bonus = 0;
        var bonusText = '';
        if (s === 'damage') {
            bonus = equipped.bonusDamage + mastery.damageBonus;
            bonusText = ' (оружие: +' + equipped.bonusDamage + ' | мастерство: +' + mastery.damageBonus + ')';
        }
        if (s === 'defense') {
            bonus = equipped.bonusDefense + mastery.defenseBonus;
            bonusText = ' (броня: +' + equipped.bonusDefense + ' | мастерство: +' + mastery.defenseBonus + ')';
        }
        if (s === 'agility') {
            bonus = equipped.bonusAgility + mastery.agilityBonus;
            bonusText = ' (экипировка: +' + equipped.bonusAgility + ' | мастерство: +' + mastery.agilityBonus + ')';
        }
        var total = base + bonus;
        html += '<div class="row"><span class="label">' + statLabels[s] + '</span>';
        html += '<span class="value">' + base;
        if (bonus > 0) html += ' <span style="color:#7ac98a;">+</span><span style="color:#7ac98a;">' + bonus + '</span>';
        html += ' = <strong>' + total + '</strong>';
        if (g.attributePoints > 0 && s !== 'intelligence') {
            html += ' <button class="btn btn-small" onclick="addAttribute(\'' + s + '\')">+1</button>';
        }
        html += '<br><span style="font-size:10px;color:#6a5a48;">' + bonusText + '</span>';
        html += '</span></div>';
    });
    html += '</div>';
    
    html += '<div class="modal-section"><h4>🏃 СКОРОСТЬ</h4>';
    html += '<div class="row"><span class="label">👢 Ботинки</span><span class="value">+' + totalStats.speedDetails.boots + '%</span></div>';
    html += '<div class="row"><span class="label">🐴 Лошадь</span><span class="value">+' + totalStats.speedDetails.horse + '%</span></div>';
    html += '<div class="row"><span class="label">🗡️ Мастерство</span><span class="value">+' + (totalStats.speedDetails.mastery || 0) + '%</span></div>';
    html += '<div class="row" style="border-top:1px solid #3d3026;padding-top:6px;"><span class="label" style="color:#c9b694;">✅ ИТОГО</span><span class="value" style="color:#7ac98a;font-size:16px;">+' + totalStats.speedPercent + '%</span></div>';
    html += '</div>';
    
    var hitChance = calcChance(totalStats.agility);
    var dodgeChance = calcChance(totalStats.agility);
    html += '<div class="modal-section"><h4>💨 ЛОВКОСТЬ</h4>';
    html += '<div class="row"><span class="label">🎯 Попадание</span><span class="value">' + hitChance + '%</span></div>';
    html += '<div class="row"><span class="label">💨 Уворот</span><span class="value">' + dodgeChance + '%</span></div>';
    html += '</div>';
    
    var reduction = calcDamageReduction(totalStats.defense);
    html += '<div class="modal-section"><h4>🛡️ ЗАЩИТА</h4>';
    html += '<div class="row"><span class="label">🛡️ Защита</span><span class="value">' + totalStats.defense + ' (' + reduction + '% поглощения)</span></div>';
    html += '</div>';
    
    var st = g.stamina || { level: 1, xp: 0 };
    var staminaNeeded = st.level * 8 + 3;
    var staminaProgress = Math.min(100, Math.round((st.xp / staminaNeeded) * 100));
    html += '<div class="modal-section"><h4>💪 ВЫНОСЛИВОСТЬ</h4>';
    html += '<div class="row"><span class="label">Уровень</span><span class="value">' + st.level + '</span></div>';
    html += '<div class="row"><span class="label">📊 Прогресс</span><span class="value">' + staminaProgress + '% (' + st.xp + '/' + staminaNeeded + ')</span></div>';
    html += '<div class="row"><span class="label">❤️ Бонус HP</span><span class="value" style="color:#7ac98a;">+' + (st.level * 2) + '</span></div>';
    html += '</div>';
    
    html += '<div class="modal-section"><h4>🗡️ МАСТЕРСТВО ОРУЖИЯ</h4>';
    html += '<div class="row"><span class="label">Оружие</span><span class="value">' + (g.equipment.rightHand ? g.equipment.rightHand.name : 'нет') + '</span></div>';
    html += '<div class="row"><span class="label">Уровень</span><span class="value">' + mastery.skillLevel + '</span></div>';
    
    var skill = g.skills[mastery.weaponType];
    if (skill) {
        var currentXp = skill.xp || 0;
        var neededXp = skill.level * 20 + 10;
        var progress = Math.min(100, Math.round((currentXp / neededXp) * 100));
        html += '<div class="row"><span class="label">📊 Прогресс</span><span class="value">' + progress + '% (' + currentXp + '/' + neededXp + ')</span></div>';
    } else {
        html += '<div class="row"><span class="label">📊 Прогресс</span><span class="value">0% (0/0)</span></div>';
    }
    
    html += '<div class="row"><span class="label">⚔️ Урон</span><span class="value" style="color:#7ac98a;">+' + mastery.damageBonus + '</span></div>';
    html += '<div class="row"><span class="label">🛡️ Защита</span><span class="value" style="color:#7ac98a;">+' + mastery.defenseBonus + '</span></div>';
    html += '<div class="row"><span class="label">💨 Ловкость</span><span class="value" style="color:#7ac98a;">+' + mastery.agilityBonus + '</span></div>';
    
    var critBonus = getActiveBonus(g, 'crit');
    var pierceBonus = getActiveBonus(g, 'pierce');
    var doubleHitBonus = getActiveBonus(g, 'doubleHit');
    var counterBonus = getActiveBonus(g, 'counter');
    
    html += '<div class="row"><span class="label">💥 Крит</span><span class="value" style="color:#7ac98a;">' + critBonus + '%</span></div>';
    html += '<div class="row"><span class="label">🛡️ Пробитие</span><span class="value" style="color:#7ac98a;">' + pierceBonus + '%</span></div>';
    html += '<div class="row"><span class="label">⚡ Двойной удар</span><span class="value" style="color:#7ac98a;">' + doubleHitBonus + '%</span></div>';
    html += '<div class="row"><span class="label">💫 Контратака</span><span class="value" style="color:#7ac98a;">' + counterBonus + '%</span></div>';
    html += '<div class="row"><span class="label">📊 Очков мастерства</span><span class="value">' + g.activeBonuses.points + '</span></div>';
    html += '</div>';
    
    html += '<div class="modal-section"><h4>👷 ПРОФЕССИИ</h4>';
    html += '<div class="row"><span class="label">Активная</span><span class="value">' + (g.activeProfession || 'Охотник') + ' <button class="btn btn-small" onclick="changeProfession()">Сменить (24ч)</button></span></div>';
    ['Шахтёр', 'Лесоруб', 'Охотник', 'Кузнец'].forEach(function(p) {
        var level = g.professions[p] || 1;
        var xp = g.professionXp[p] || 0;
        var nx = level * 10;
        var isActive = g.activeProfession === p;
        html += '<div class="row"><span class="label">' + p + (isActive ? ' ✅' : '') + '</span><span class="value">ур. ' + level + ' (' + xp + '/' + nx + ')</span></div>';
    });
    html += '</div>';
    
    html += '<div class="modal-section"><h4>🛡️ ЭКИПИРОВКА</h4>';
    var slots = [
        { key: 'rightHand', label: 'Правая рука' },
        { key: 'leftHand', label: 'Левая рука' },
        { key: 'helmet', label: 'Голова' },
        { key: 'chestplate', label: 'Грудь' },
        { key: 'shoulders', label: 'Плечи' },
        { key: 'leggings', label: 'Ноги' },
        { key: 'boots', label: 'Стопы' },
        { key: 'gloves', label: 'Руки' },
        { key: 'belt', label: 'Пояс' },
        { key: 'cloak', label: 'Спина' },
        { key: 'horse', label: '🐴 Лошадь' }
    ];
    slots.forEach(function(s) {
        var item = g.equipment[s.key];
        html += '<div class="row"><span class="label">' + s.label + '</span><span class="value">' + (item ? (item.quality ? item.quality + ' ' : '') + item.name + ' <button class="btn btn-small" style="background:#3d2a1a;" onclick="unequipItem(\'' + s.key + '\')">Снять</button>' : 'пусто') + '</span></div>';
    });
    html += '</div>';
    
    html += '<div class="row" style="margin-top:10px;"><span class="label">🔄 Сброс атрибутов</span>';
    var now = Date.now();
    var canReset = !g.lastReset || (now - g.lastReset) >= 3 * 24 * 60 * 60 * 1000;
    if (canReset) {
        html += '<span class="value"><button class="btn btn-small" onclick="resetAttributes()">Сбросить (бесплатно)</button></span>';
    } else {
        var timeLeft = Math.ceil((3 * 24 * 60 * 60 * 1000 - (now - g.lastReset)) / (60 * 60 * 1000));
        html += '<span class="value" style="color:#6a5a48;">Доступно через ' + timeLeft + ' ч.</span>';
    }
    html += '</div>';
    
    html += '<button class="btn" onclick="closeCharacter()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeCharacter() {
    var modal = document.getElementById('modal-character');
    if (modal) modal.classList.add('hide');
}

// ============================================================
// 9. СМЕНА ПРОФЕССИИ
// ============================================================

function changeProfession() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var now = Date.now();
    
    if (g.lastProfessionChange && (now - g.lastProfessionChange) < 86400000) {
        var hoursLeft = Math.ceil((86400000 - (now - g.lastProfessionChange)) / 3600000);
        setMessage('⏳ Смена профессии доступна через ' + hoursLeft + ' часов.');
        return;
    }
    
    var professions = ['Охотник', 'Шахтёр', 'Лесоруб', 'Кузнец'];
    var msg = 'Выберите профессию:\n';
    professions.forEach(function(p) {
        msg += '• ' + p + (g.activeProfession === p ? ' ✅' : '') + '\n';
    });
    
    var choice = prompt(msg);
    if (choice && professions.indexOf(choice) !== -1) {
        var oldProfession = g.activeProfession || 'Охотник';
        g.activeProfession = choice;
        g.lastProfessionChange = now;
        setMessage('✅ Вы сменили профессию с ' + oldProfession + ' на ' + choice);
        addLog('👷 ' + currentUser + ' сменил профессию на ' + choice);
        updateMenu();
        saveData();
        openCharacter();
    } else {
        setMessage('❌ Отменено.');
    }
}

// ============================================================
// 10. РЕГИСТРАЦИЯ В ГЛОБАЛЬНУЮ ОБЛАСТЬ
// ============================================================

window.openCharacter = openCharacter;
window.closeCharacter = closeCharacter;
window.addAttribute = addAttribute;
window.resetAttributes = resetAttributes;
window.changeProfession = changeProfession;
window.distributeMasteryPoint = distributeMasteryPoint;
window.getMaxInventory = getMaxInventory;
window.getMaxHp = getMaxHp;
window.getXpMultiplier = getXpMultiplier;
window.getTotalStats = getTotalStats;
window.getEquippedStats = getEquippedStats;
window.getWeaponMasteryBonus = getWeaponMasteryBonus;
window.calcChance = calcChance;
window.calcDamageReduction = calcDamageReduction;
window.getHitChance = getHitChance;

console.log('👤 Персонаж загружен!');

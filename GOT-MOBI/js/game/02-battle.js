// ============================================================
// js/game/02-battle.js — БОЙ (СТАБИЛЬНАЯ ВЕРСИЯ ДЛЯ ТЕЛЕФОНА)
// ============================================================

console.log('⚔️ ЗАГРУЗКА БОЕВОЙ СИСТЕМЫ...');

// ============================================================
// 1. СОСТОЯНИЕ БОЯ
// ============================================================
var battleState = null;

// ============================================================
// 2. ПОЛУЧЕНИЕ МОБОВ (ОБЁРНУТО В TRY)
// ============================================================
window.getMobsForLocation = function(region, place) {
    try {
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
    } catch(e) {
        console.error('Ошибка getMobsForLocation:', e);
        return [];
    }
};

// ============================================================
// 3. СЛУЧАЙНЫЙ МОБ
// ============================================================
window.getRandomMobByRegionAndLevel = function(region, place) {
    try {
        var mobs = window.getMobsForLocation(region, place);
        if (mobs.length === 0) {
            return { name: 'Крыса', hp: 8, damage: 2, defense: 0, xp: 3, level: 1, type: 'animal', agility: 2 };
        }
        return mobs[Math.floor(Math.random() * mobs.length)];
    } catch(e) {
        console.error('Ошибка getRandomMob:', e);
        return { name: 'Крыса', hp: 8, damage: 2, defense: 0, xp: 3, level: 1, type: 'animal', agility: 2 };
    }
};

// ============================================================
// 4. НАЧАЛО БОЯ (ЗАГЛУШКА ДЛЯ ТЕСТА)
// ============================================================
window.startBattle = function(mob) {
    try {
        var user = users[currentUser];
        if (!user) { setMessage('❌ Игрок не найден.'); return; }
        var g = user.game;
        var maxHp = getMaxHp(g);
        g.maxHp = maxHp;
        if (g.hp === undefined || g.hp > maxHp) g.hp = maxHp;

        // ЗАГЛУШКА: просто показываем уведомление
        setMessage('⚔️ БОЙ с ' + mob.name + ' (ур. ' + mob.level + ')');
        alert('⚔️ Начинается бой с ' + mob.name + '!\nHP: ' + mob.hp + '\nУрон: ' + mob.damage);
    } catch(e) {
        console.error('Ошибка startBattle:', e);
        setMessage('❌ Ошибка начала боя');
    }
};

// ============================================================
// 5. ПОИСК (ГЛАВНАЯ ФУНКЦИЯ)
// ============================================================
window.doSearch = function() {
    try {
        var user = users[currentUser];
        if (!user) { setMessage('❌ Игрок не найден.'); return; }
        var g = user.game;
        var region = g.location.region || 'Королевские земли';
        var place = g.location.place || 'Дорога';
        var luck = Math.min(25, g.luck || 0);
        var luckBonus = Math.floor(luck / 10);

        // Проверка на голод/усталость
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
            setMessage('🪙 Вы нашли клад!');
            return;
        }

        var monsterChance = Math.min(47.5, 45 + luckBonus);
        if (Math.random() * 100 < monsterChance) {
            var mob = window.getRandomMobByRegionAndLevel(region, place);
            if (mob) {
                setMessage('⚔️ Вы встретили ' + mob.name + ' (уровень ' + mob.level + ')');
                addLog('⚔️ ' + currentUser + ' встретил ' + mob.name);
                window.startBattle(mob);
                return;
            }
        }
        setMessage('🔍 Вы никого не нашли.');
    } catch(e) {
        console.error('Ошибка doSearch:', e);
        setMessage('❌ Ошибка поиска: ' + e.message);
    }
};

// ============================================================
// 6. РЕГИСТРАЦИЯ В WINDOW
// ============================================================
window.battleState = battleState;
window.doSearch = window.doSearch;
window.getMobsForLocation = window.getMobsForLocation;
window.getRandomMobByRegionAndLevel = window.getRandomMobByRegionAndLevel;
window.startBattle = window.startBattle;

console.log('✅ БОЕВАЯ СИСТЕМА ЗАГРУЖЕНА!');
console.log('doSearch:', typeof window.doSearch);
console.log('getMobsForLocation:', typeof window.getMobsForLocation);

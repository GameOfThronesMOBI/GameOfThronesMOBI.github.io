// ============================================================
// js/game/02-combat.js — БОЙ (ПОЛНАЯ ВЕРСИЯ) — ФИКС
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
    
    if (filtered.length === 0 && regionMobs.length > 0) {
        filtered = regionMobs.slice(0, 5);
    }
    
    return filtered;
}

function getRandomMobByRegionAndLevel(region, place) {
    var mobs = getMobsForLocation(region, place);
    if (mobs.length === 0) return { name: 'Крыса', hp: 8, damage: 2, defense: 0, xp: 3, level: 1, type: 'animal', agility: 2 };
    return mobs[Math.floor(Math.random() * mobs.length)];
}

function doSearch() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var region = g.location.region || 'Королевские земли';
    var place = g.location.place || 'Дорога';
    
    if (Math.random() * 100 < 50) {
        var mob = getRandomMobByRegionAndLevel(region, place);
        setMessage('⚔️ Вы встретили ' + mob.name + ' (уровень ' + mob.level + ')');
        if (typeof startBattle === 'function') startBattle(mob);
        return;
    }
    setMessage('🔍 Вы никого не нашли.');
}

window.doSearch = doSearch;
window.getMobsForLocation = getMobsForLocation;
window.getRandomMobByRegionAndLevel = getRandomMobByRegionAndLevel;

console.log('⚔️ Боевая система загружена!');

console.log('Тест 2');

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
    return regionMobs.filter(function(mob) {
        return mob.level >= minLevel && mob.level <= maxLevel;
    });
}

window.getMobsForLocation = getMobsForLocation;
window.testBattle = 'шаг2';

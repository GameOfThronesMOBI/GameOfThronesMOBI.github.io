if (tab === 'army') {
    html += '<div class="modal-section"><h4>⚔️ АРМИЯ ДОМА</h4>';
    var garrison = window._castleGarrisons && window._castleGarrisons[g.house] ? window._castleGarrisons[g.house] : { infantry: [], cavalry: [], siege: [] };
    
    var infantryGrouped = {};
    if (garrison.infantry && Array.isArray(garrison.infantry)) {
        garrison.infantry.forEach(function(u) {
            var k = u.type;
            if (!infantryGrouped[k]) infantryGrouped[k] = 0;
            infantryGrouped[k]++;
        });
    }
    html += '<h5>🗡️ Пехота (' + (garrison.infantry ? garrison.infantry.length : 0) + ' чел.)</h5>';
    if (Object.keys(infantryGrouped).length === 0) html += '<p style="color:#6a5a48;">Нет пехоты.</p>';
    else {
        for (var k in infantryGrouped) {
            var ut = typeof UNIT_TYPES !== 'undefined' ? UNIT_TYPES[k] : null;
            html += '<div class="row"><span class="label">' + (ut ? ut.emoji + ' ' + ut.name : k) + '</span><span class="value">×' + infantryGrouped[k] + '</span></div>';
        }
    }
    
    var cavalryGrouped = {};
    if (garrison.cavalry && Array.isArray(garrison.cavalry)) {
        garrison.cavalry.forEach(function(u) {
            var k = u.type;
            if (!cavalryGrouped[k]) cavalryGrouped[k] = 0;
            cavalryGrouped[k]++;
        });
    }
    html += '<h5 style="margin-top:10px;">🐴 Кавалерия (' + (garrison.cavalry ? garrison.cavalry.length : 0) + ' чел.)</h5>';
    if (Object.keys(cavalryGrouped).length === 0) html += '<p style="color:#6a5a48;">Нет кавалерии.</p>';
    else {
        for (var k in cavalryGrouped) {
            var ut = typeof UNIT_TYPES !== 'undefined' ? UNIT_TYPES[k] : null;
            html += '<div class="row"><span class="label">' + (ut ? ut.emoji + ' ' + ut.name : k) + '</span><span class="value">×' + cavalryGrouped[k] + '</span></div>';
        }
    }
    
    var siegeGrouped = {};
    if (garrison.siege && Array.isArray(garrison.siege)) {
        garrison.siege.forEach(function(u) {
            var k = u.siegeType || u.type;
            if (!siegeGrouped[k]) siegeGrouped[k] = 0;
            siegeGrouped[k]++;
        });
    }
    html += '<h5 style="margin-top:10px;">🏗️ Осадные орудия (' + (garrison.siege ? garrison.siege.length : 0) + ' шт.)</h5>';
    if (Object.keys(siegeGrouped).length === 0) html += '<p style="color:#6a5a48;">Нет осадных орудий.</p>';
    else {
        for (var k in siegeGrouped) {
            var sw = typeof SIEGE_WEAPONS !== 'undefined' ? SIEGE_WEAPONS[k] : null;
            html += '<div class="row"><span class="label">' + (sw ? sw.name : k) + '</span><span class="value">×' + siegeGrouped[k] + '</span></div>';
        }
    }
    
    // КНОПКА КОМАНДОВАНИЯ
    html += '<div style="text-align:center;margin-top:12px;">';
    html += '<button class="btn btn-primary" onclick="closeHouses(); openCommandMap();">🎯 Командование</button>';
    html += '</div>';
    
    html += '</div>';
}

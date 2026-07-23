// ============================================================
// js/game/08-command.js — КОМАНДОВАНИЕ ВОЙСКАМИ + PvP
// ============================================================

// ============================================================
// 1. КАРТА КОМАНДОВАНИЯ
// ============================================================

window.openCommandMap = function() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    var houseId = g.house;
    if (!houseId) { setMessage('❌ Вы не состоите в доме.'); return; }
    
    var modal = document.getElementById('modal-command');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-command';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeCommandMap(); };
        overlay.innerHTML = '<div class="modal-box" style="max-width:95vw;width:95vw;max-height:95vh;overflow-y:auto;"><div class="modal-header"><h3>🎯 КОМАНДОВАНИЕ</h3><button class="close-btn" onclick="closeCommandMap()">✕</button></div><div id="modal-command-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-command-content');
    var house = HOUSES[houseId];
    
    var html = '<div class="modal-section"><h4>🎯 КОМАНДОВАНИЕ — ' + (house ? house.sigil + ' ' + house.name : houseId) + '</h4>';
    
    // Вкладки
    html += '<div class="tabs" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;">';
    html += '<button class="tab-btn active" onclick="showCommandTab(\'map\')">🗺️ Карта</button>';
    html += '<button class="tab-btn" onclick="showCommandTab(\'garrison\')">🏰 Гарнизон</button>';
    html += '<button class="tab-btn" onclick="showCommandTab(\'field\')">🌍 В поле</button>';
    html += '<button class="tab-btn" onclick="showCommandTab(\'marching\')">🚶 В пути</button>';
    html += '</div>';
    html += '<div id="command-tab-content"></div>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
    showCommandTab('map');
};

window.showCommandTab = function(tab) {
    var container = document.getElementById('command-tab-content');
    if (!container) return;
    var user = users[currentUser];
    var g = user.game;
    var houseId = g.house;
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [], marching: [] };
    var html = '';
    
    if (tab === 'map') {
        html += buildCommandWorldMap(houseId);
    }
    
    if (tab === 'garrison') {
        html += '<div class="modal-section"><h4>🏰 ГАРНИЗОН В ЗАМКЕ</h4>';
        html += buildUnitSelection(garrison, 'garrison');
        html += '<button class="btn" onclick="selectAllGarrison()">☑ Выбрать всех</button> ';
        html += '<button class="btn" onclick="clearAllGarrison()">☐ Снять всех</button>';
        html += '<br><br><button class="btn btn-primary" onclick="openTargetMap(\'garrison\')">🎯 Отправить выбранных</button>';
        html += '</div>';
    }
    
    if (tab === 'field') {
        html += '<div class="modal-section"><h4>🌍 ОТРЯДЫ В ПОЛЕ</h4>';
        html += buildFieldUnitsHTML(houseId);
        html += '</div>';
    }
    
    if (tab === 'marching') {
        html += '<div class="modal-section"><h4>🚶 ОТРЯДЫ В ПУТИ</h4>';
        var marching = garrison.marching || [];
        if (marching.length === 0) {
            html += '<p style="color:#6a5a48;">Нет отрядов в пути.</p>';
        } else {
            marching.forEach(function(m, i) {
                var timeLeft = Math.max(0, Math.ceil((m.arrivesAt - Date.now()) / 60000));
                var totalUnits = m.units ? m.units.length : 0;
                html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
                html += '<span class="label">🚶 Отряд #' + (i+1) + ' → ' + getZoneName(m.targetZone) + ' (' + totalUnits + ' юнитов)</span>';
                html += '<span class="value">' + timeLeft + ' мин</span>';
                html += '</div>';
            });
        }
        html += '</div>';
    }
    
    container.innerHTML = html;
};

// ============================================================
// 2. КАРТА МИРА С ВОЙСКАМИ
// ============================================================

function buildCommandWorldMap(houseId) {
    var allZones = [];
    var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    for (var id in WORLD_AREAS) {
        var z = WORLD_AREAS[id];
        allZones.push(z);
        if (z.x < minX) minX = z.x;
        if (z.x > maxX) maxX = z.x;
        if (z.y < minY) minY = z.y;
        if (z.y > maxY) maxY = z.y;
    }
    
    if (allZones.length === 0) return '<p style="color:#c96a5a;">Мир пуст.</p>';
    
    var cols = maxX - minX + 1;
    var rows = maxY - minY + 1;
    var cellSize = Math.max(14, Math.min(30, Math.floor(460 / Math.max(cols, rows))));
    var mapWidth = cols * cellSize;
    var mapHeight = rows * cellSize;
    
    var lookup = {};
    for (var i = 0; i < allZones.length; i++) {
        lookup[allZones[i].x + ',' + allZones[i].y] = allZones[i];
    }
    
    // Сбор всех войск по зонам
    var troopsByZone = {};
    for (var hid in window._castleGarrisons) {
        var g = window._castleGarrisons[hid];
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (g[cat]) {
                g[cat].forEach(function(u) {
                    if (u.location && u.location !== 'castle') {
                        if (!troopsByZone[u.location]) troopsByZone[u.location] = {};
                        if (!troopsByZone[u.location][hid]) troopsByZone[u.location][hid] = 0;
                        troopsByZone[u.location][hid]++;
                    }
                });
            }
        });
    }
    
    var typeColors = {
        'road': '#8B7355', 'forest': '#2d5016', 'plain': '#7a9a3a', 'mountain': '#6b6b6b',
        'river': '#2980b9', 'coast': '#d4b896', 'sea': '#0d3b5c', 'shallows': '#1a5276',
        'crossroads': '#8B7355', 'castle': '#4a3728', 'castle_gate': '#4a3728',
        'village': '#6b8a3a', 'mine': '#3d3d3d', 'swamp': '#3d5020'
    };
    
    var html = '<div class="modal-section"><h4>🗺️ КАРТА ВОЕННЫХ ДЕЙСТВИЙ</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;text-align:center;">🟢 Свои | 🔴 Враги | 🔵 Союзники | ⭐ Вы</p>';
    html += '<p style="color:#6a5a48;font-size:11px;text-align:center;">Нажмите на зону чтобы выбрать цель для атаки</p>';
    html += '</div>';
    
    var user = users[currentUser];
    var g = user.game;
    var currentZone = g.location.locationId || g.location.place;
    var currentLoc = WORLD_AREAS[currentZone];
    var curX = currentLoc ? currentLoc.x : 0;
    var curY = currentLoc ? currentLoc.y : 0;
    
    html += '<div style="overflow:auto;max-width:100%;max-height:60vh;margin-top:8px;">';
    html += '<div style="position:relative;width:' + mapWidth + 'px;height:' + mapHeight + 'px;min-width:' + mapWidth + 'px;background:#0a0806;border-radius:8px;">';
    
    for (var y = minY; y <= maxY; y++) {
        for (var x = minX; x <= maxX; x++) {
            var zone = lookup[x + ',' + y];
            var bg = '#0a0806';
            var isCurrent = false;
            var isWater = false;
            
            if (zone) {
                var colorKey = zone.type;
                if (zone.type === 'coast' && zone.resourceType === 'shallows') colorKey = 'shallows';
                bg = typeColors[colorKey] || '#3d3026';
                
                if (zone.type === 'river' || zone.type === 'sea' || zone.type === 'shallows') isWater = true;
                if (zone.id === currentZone) isCurrent = true;
            }
            
            var left = (x - minX) * cellSize + 1;
            var top = (y - minY) * cellSize + 1;
            var size = cellSize - 2;
            
            var dist = Math.abs(x - curX) + Math.abs(y - curY);
            var timeEst = isWater ? '—' : (dist * 5 + 'м');
            
            html += '<div onclick="commandMapClick(\'' + (zone ? zone.id : '') + '\',' + x + ',' + y + ',' + isWater + ')" style="';
            html += 'position:absolute;left:' + left + 'px;top:' + top + 'px;width:' + size + 'px;height:' + size + 'px;';
            html += 'background:' + bg + ';border:1px solid #2a201a;border-radius:2px;cursor:pointer;';
            html += 'display:flex;align-items:center;justify-content:center;flex-direction:column;font-size:' + Math.max(7, cellSize*0.3) + 'px;';
            if (isCurrent) html += 'box-shadow:inset 0 0 0 2px #ffd700;';
            if (isWater) html += 'opacity:0.6;';
            html += '">';
            
            // Войска в зоне
            if (zone && troopsByZone[zone.id]) {
                var hasOwn = false, hasEnemy = false, hasAlly = false;
                for (var hid in troopsByZone[zone.id]) {
                    if (hid === houseId) hasOwn = true;
                    else if (HOUSES[hid] && HOUSES[hid].liege === houseId) hasAlly = true;
                    else hasEnemy = true;
                }
                if (hasOwn) html += '<span style="font-size:' + Math.max(8, cellSize*0.4) + 'px;">🟢</span>';
                else if (hasAlly) html += '<span style="font-size:' + Math.max(8, cellSize*0.4) + 'px;">🔵</span>';
                else if (hasEnemy) html += '<span style="font-size:' + Math.max(8, cellSize*0.4) + 'px;">🔴</span>';
            }
            
            html += '<span style="font-size:' + Math.max(6, cellSize*0.28) + 'px;color:#b8a890;">' + (zone ? zone.name.substring(0,4) : '') + '</span>';
            html += '<span style="font-size:' + Math.max(5, cellSize*0.22) + 'px;color:#6a5a48;">' + timeEst + '</span>';
            html += '</div>';
        }
    }
    
    html += '</div></div>';
    
    // Легенда
    html += '<div class="modal-section" style="margin-top:8px;">';
    html += '<p style="color:#6a5a48;font-size:11px;">📍 Текущая позиция: ' + (currentLoc ? currentLoc.name : '?') + ' [' + curX + ',' + curY + ']</p>';
    html += '<p style="color:#6a5a48;font-size:11px;">🟢 Свои войска | 🔴 Вражеские | 🔵 Союзные</p>';
    html += '</div>';
    
    return html;
}

// ============================================================
// 3. КЛИК ПО ЗОНЕ НА КАРТЕ КОМАНДОВАНИЯ
// ============================================================

window.commandMapClick = function(zoneId, x, y, isWater) {
    if (!zoneId || isWater) {
        setMessage('⛵ Нельзя отправить войска на воду.');
        return;
    }
    
    var user = users[currentUser];
    var houseId = user.game.house;
    var zone = WORLD_AREAS[zoneId];
    var zoneName = zone ? zone.name : zoneId;
    
    // Проверяем есть ли враги в зоне
    var hasEnemies = false;
    for (var hid in window._castleGarrisons) {
        if (hid === houseId) continue;
        var g = window._castleGarrisons[hid];
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (g[cat]) {
                g[cat].forEach(function(u) {
                    if (u.location === zoneId) hasEnemies = true;
                });
            }
        });
    }
    
    // Проверяем есть ли свои войска в зоне
    var hasOwn = false;
    var ownGarrison = window._castleGarrisons[houseId];
    if (ownGarrison) {
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (ownGarrison[cat]) {
                ownGarrison[cat].forEach(function(u) {
                    if (u.location === zoneId) hasOwn = true;
                });
            }
        });
    }
    
    var isOwnZone = zone && zone.owner === houseId;
    var currentZone = user.game.location.locationId || user.game.location.place;
    var currentLoc = WORLD_AREAS[currentZone];
    var curX = currentLoc ? currentLoc.x : 0;
    var curY = currentLoc ? currentLoc.y : 0;
    var dist = Math.abs(x - curX) + Math.abs(y - curY);
    var timeMinutes = dist * 5;
    
    var modal = document.getElementById('modal-command-action');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-command-action';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeCommandAction(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>⚡ ДЕЙСТВИЕ</h3><button class="close-btn" onclick="closeCommandAction()">✕</button></div><div id="modal-command-action-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-command-action-content');
    var h = '<div class="modal-section"><h4>📍 ' + zoneName + '</h4>';
    h += '<p style="color:#6a5a48;">Дистанция: ' + dist + ' зон (~' + timeMinutes + ' мин)</p>';
    h += '<p style="color:#6a5a48;">Тип: ' + (zone ? zone.type : '?') + ' | Владелец: ' + (zone && zone.owner ? zone.owner : 'ничья') + '</p>';
    
    if (hasOwn) h += '<p style="color:#7ac98a;">🟢 Есть свои войска</p>';
    if (hasEnemies) h += '<p style="color:#c96a5a;">🔴 Есть вражеские войска!</p>';
    h += '</div>';
    
    h += '<div class="modal-section"><h4>⚡ ВЫБЕРИТЕ ДЕЙСТВИЕ</h4>';
    
    if (isOwnZone) {
        h += '<button class="btn btn-game" onclick="closeCommandAction(); openTargetMap(\'garrison\');" style="margin:4px 0;">🚶 Отправить войска</button><br>';
        h += '<span style="font-size:10px;color:#6a5a48;">Открыть гарнизон для отправки</span><br><br>';
    }
    
    if (hasEnemies && !hasOwn) {
        h += '<button class="btn btn-game" style="background:#5a2020;margin:4px 0;" onclick="closeCommandAction(); openTargetMap(\'garrison\');">⚔️ Атаковать</button><br>';
        h += '<span style="font-size:10px;color:#c96a5a;">Отправить войска в атаку</span><br><br>';
    }
    
    if (hasOwn) {
        h += '<button class="btn btn-game" onclick="closeCommandAction(); showCommandTab(\'field\');" style="margin:4px 0;">👁️ Посмотреть свои войска</button><br>';
    }
    
    h += '<button class="btn btn-secondary" onclick="closeCommandAction();">Закрыть</button>';
    
    content.innerHTML = h;
    modal.classList.remove('hide');
};

window.closeCommandAction = function() {
    var m = document.getElementById('modal-command-action');
    if (m) m.classList.add('hide');
};

// ============================================================
// 4. ГАРНИЗОН И ОТПРАВКА
// ============================================================

function buildUnitSelection(garrison, source) {
    var html = '';
    var allUnits = [];
    
    if (garrison.infantry) garrison.infantry.forEach(function(u, i) { if (!u.location || u.location === 'castle') allUnits.push({ unit: u, index: i, category: 'infantry' }); });
    if (garrison.cavalry) garrison.cavalry.forEach(function(u, i) { if (!u.location || u.location === 'castle') allUnits.push({ unit: u, index: i, category: 'cavalry' }); });
    if (garrison.siege) garrison.siege.forEach(function(u, i) { if (!u.location || u.location === 'castle') allUnits.push({ unit: u, index: i, category: 'siege' }); });
    
    if (allUnits.length === 0) {
        html += '<p style="color:#6a5a48;">Нет юнитов в гарнизоне.</p>';
        return html;
    }
    
    var grouped = {};
    allUnits.forEach(function(item) {
        var k = item.unit.type;
        if (!grouped[k]) grouped[k] = { count: 0, type: item.unit.type, category: item.category, indices: [] };
        grouped[k].count++;
        grouped[k].indices.push({ category: item.category, index: item.index });
    });
    
    for (var k in grouped) {
        var grp = grouped[k];
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[k] : null;
        var name = ut ? ut.emoji + ' ' + ut.name : k;
        html += '<div class="row" style="padding:4px 0; border-bottom:1px solid #1a1410;">';
        html += '<span class="label"><input type="checkbox" class="cmd-check" data-type="' + k + '" data-source="' + source + '" data-category="' + grp.category + '" checked> ' + name + ' ×' + grp.count + '</span>';
        html += '<span class="value"><input type="number" class="cmd-count" data-type="' + k + '" value="' + grp.count + '" min="1" max="' + grp.count + '" style="width:60px;padding:4px;" onchange="updateCommandCheckbox(this)"></span>';
        html += '</div>';
    }
    
    return html;
}

function buildFieldUnitsHTML(houseId) {
    var html = '';
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [] };
    var fieldUnits = [];
    
    if (garrison.infantry) garrison.infantry.forEach(function(u) { if (u.location && u.location !== 'castle') fieldUnits.push(u); });
    if (garrison.cavalry) garrison.cavalry.forEach(function(u) { if (u.location && u.location !== 'castle') fieldUnits.push(u); });
    if (garrison.siege) garrison.siege.forEach(function(u) { if (u.location && u.location !== 'castle') fieldUnits.push(u); });
    
    if (fieldUnits.length === 0) {
        html += '<p style="color:#6a5a48;">Нет отрядов в поле.</p>';
        return html;
    }
    
    var grouped = {};
    fieldUnits.forEach(function(u) {
        var loc = u.location || '?';
        if (!grouped[loc]) grouped[loc] = {};
        var k = u.type;
        if (!grouped[loc][k]) grouped[loc][k] = 0;
        grouped[loc][k]++;
    });
    
    for (var loc in grouped) {
        html += '<h5 style="color:#c9b694;">📍 ' + getZoneName(loc) + '</h5>';
        for (var k in grouped[loc]) {
            var ut = window.UNIT_TYPES ? window.UNIT_TYPES[k] : null;
            var name = ut ? ut.emoji + ' ' + ut.name : k;
            html += '<div class="row"><span class="label">' + name + '</span><span class="value">×' + grouped[loc][k] + ' <button class="btn btn-small" onclick="moveFieldUnits(\'' + loc + '\')">🚶 Двигать</button></span></div>';
        }
    }
    
    return html;
}

window.moveFieldUnits = function(zoneId) {
    // Пока просто открываем карту для выбора цели
    setMessage('Выберите целевую зону на карте.');
    showCommandTab('map');
};

window.selectAllGarrison = function() {
    var checks = document.querySelectorAll('.cmd-check');
    checks.forEach(function(c) { c.checked = true; });
};

window.clearAllGarrison = function() {
    var checks = document.querySelectorAll('.cmd-check');
    checks.forEach(function(c) { c.checked = false; });
};

function updateCommandCheckbox(input) {
    var row = input.closest('.row');
    if (row) {
        var checkbox = row.querySelector('.cmd-check');
        if (checkbox && parseInt(input.value) > 0) checkbox.checked = true;
    }
}

// ============================================================
// 5. КАРТА ЦЕЛЕЙ ДЛЯ ОТПРАВКИ
// ============================================================

window.openTargetMap = function(source) {
    var modal = document.getElementById('modal-target-map');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-target-map';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeTargetMap(); };
        overlay.innerHTML = '<div class="modal-box" style="max-width:95vw;width:700px;max-height:95vh;overflow-y:auto;"><div class="modal-header"><h3>🗺️ ВЫБОР ЦЕЛИ</h3><button class="close-btn" onclick="closeTargetMap()">✕</button></div><div id="modal-target-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-target-content');
    var user = users[currentUser];
    var g = user.game;
    var currentZone = g.location.locationId || g.location.place;
    
    var html = '<div class="modal-section"><h4>🗺️ ВЫБЕРИТЕ ЦЕЛЕВУЮ ЗОНУ</h4>';
    html += '<p style="color:#6a5a48;font-size:11px;">Нажмите на зону на карте</p>';
    html += '<div id="target-minimap" style="margin:10px 0;"></div>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
    
    buildTargetMinimap(source, currentZone);
};

function buildTargetMinimap(source, currentZone) {
    var container = document.getElementById('target-minimap');
    if (!container) return;
    
    var allZones = [];
    var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    for (var id in WORLD_AREAS) {
        var z = WORLD_AREAS[id];
        allZones.push(z);
        if (z.x < minX) minX = z.x;
        if (z.x > maxX) maxX = z.x;
        if (z.y < minY) minY = z.y;
        if (z.y > maxY) maxY = z.y;
    }
    
    if (allZones.length === 0) { container.innerHTML = '<p style="color:#c96a5a;">Мир пуст.</p>'; return; }
    
    var cols = maxX - minX + 1;
    var rows = maxY - minY + 1;
    var cellSize = Math.max(12, Math.min(28, Math.floor(400 / Math.max(cols, rows))));
    var mapWidth = cols * cellSize;
    var mapHeight = rows * cellSize;
    
    var lookup = {};
    for (var i = 0; i < allZones.length; i++) {
        lookup[allZones[i].x + ',' + allZones[i].y] = allZones[i];
    }
    
    var currentLoc = WORLD_AREAS[currentZone];
    var curX = currentLoc ? currentLoc.x : 0;
    var curY = currentLoc ? currentLoc.y : 0;
    
    var html = '<div style="position:relative;width:' + mapWidth + 'px;height:' + mapHeight + 'px;background:#0a0806;border-radius:8px;margin:0 auto;">';
    
    for (var y = minY; y <= maxY; y++) {
        for (var x = minX; x <= maxX; x++) {
            var zone = lookup[x + ',' + y];
            var bg = '#1a1410';
            var isCurrent = false;
            var isWater = false;
            
            if (zone) {
                if (zone.type === 'river' || zone.type === 'sea' || zone.type === 'shallows') { bg = '#0d3b5c'; isWater = true; }
                else if (zone.type === 'forest') bg = '#2d5016';
                else if (zone.type === 'mountain') bg = '#4a3728';
                else if (zone.type === 'plain') bg = '#5a6a3a';
                else if (zone.type === 'coast') bg = '#8B7355';
                else if (zone.type === 'castle' || zone.type === 'castle_gate') bg = '#6b4a2a';
                else if (zone.type === 'road') bg = '#6b5a3a';
                else if (zone.type === 'crossroads') bg = '#7a6a4a';
                else if (zone.type === 'village') bg = '#5a6a3a';
                else bg = '#3a3a2a';
                
                if (zone.id === currentZone) isCurrent = true;
            }
            
            var left = (x - minX) * cellSize + 1;
            var top = (y - minY) * cellSize + 1;
            var size = cellSize - 2;
            
            var dist = Math.abs(x - curX) + Math.abs(y - curY);
            var timeEst = isWater ? '—' : (dist * 5 + 'м');
            
            html += '<div onclick="selectTargetZone(\'' + (zone ? zone.id : x+','+y) + '\',\'' + source + '\',' + dist + ')" style="';
            html += 'position:absolute;left:' + left + 'px;top:' + top + 'px;width:' + size + 'px;height:' + size + 'px;';
            html += 'background:' + bg + ';border:1px solid #2a201a;border-radius:2px;cursor:pointer;';
            html += 'display:flex;align-items:center;justify-content:center;flex-direction:column;font-size:' + Math.max(7, cellSize*0.3) + 'px;';
            if (isCurrent) html += 'box-shadow:inset 0 0 0 2px #ffd700;';
            if (isWater) html += 'opacity:0.6;';
            html += '">';
            html += '<span style="font-size:' + Math.max(7, cellSize*0.35) + 'px;color:#b8a890;">' + (zone ? zone.name.substring(0,3) : '') + '</span>';
            html += '<span style="font-size:' + Math.max(6, cellSize*0.25) + 'px;color:#6a5a48;">' + dist + ' (' + timeEst + ')</span>';
            html += '</div>';
        }
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// ============================================================
// 6. ОТПРАВКА ВОЙСК
// ============================================================

window.selectedUnits = { infantry: [], cavalry: [], siege: [] };
window.selectedSource = '';

window.selectTargetZone = function(targetZoneId, source, distance) {
    var zone = WORLD_AREAS[targetZoneId];
    var zoneName = zone ? zone.name : targetZoneId;
    var isWater = zone && (zone.type === 'river' || zone.type === 'sea' || zone.type === 'shallows');
    
    if (isWater) { setMessage('⛵ Нельзя отправить войска на воду.'); return; }
    
    window.selectedUnits = { infantry: [], cavalry: [], siege: [] };
    window.selectedSource = source;
    
    var checks = document.querySelectorAll('.cmd-check:checked');
    checks.forEach(function(cb) {
        var type = cb.getAttribute('data-type');
        var category = cb.getAttribute('data-category');
        var countInput = cb.closest('.row') ? cb.closest('.row').querySelector('.cmd-count') : null;
        var count = countInput ? parseInt(countInput.value) || 0 : 1;
        if (count > 0) window.selectedUnits[category].push({ type: type, count: count });
    });
    
    var totalSelected = 0;
    ['infantry','cavalry','siege'].forEach(function(cat) {
        window.selectedUnits[cat].forEach(function(s) { totalSelected += s.count; });
    });
    
    if (totalSelected === 0) { setMessage('❌ Не выбрано ни одного юнита.'); return; }
    
    var timeMinutes = distance * 5;
    var houseId = users[currentUser].game.house;
    var isOwnZone = zone && zone.owner === houseId;
    
    var actions = [];
    actions.push({ id: 'move', label: '🚶 Идти (' + timeMinutes + ' мин)', desc: 'Переместиться в зону' });
    if (isOwnZone) actions.push({ id: 'defend', label: '🛡️ Защита (' + timeMinutes + ' мин)', desc: 'Занять оборону' });
    else actions.push({ id: 'attack', label: '⚔️ Атака (' + timeMinutes + ' мин)', desc: 'Атаковать зону' });
    
    var modal = document.getElementById('modal-confirm-move');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-confirm-move';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeConfirmMove(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📋 ПОДТВЕРЖДЕНИЕ</h3><button class="close-btn" onclick="closeConfirmMove()">✕</button></div><div id="modal-confirm-move-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-confirm-move-content');
    var h = '<div class="modal-section"><h4>🎯 ' + zoneName + '</h4>';
    h += '<p style="color:#6a5a48;">Дистанция: ' + distance + ' зон (~' + timeMinutes + ' мин)</p>';
    h += '<p style="color:#6a5a48;">Выбрано юнитов: ' + totalSelected + '</p>';
    h += '</div><div class="modal-section"><h4>⚡ ДЕЙСТВИЕ</h4>';
    actions.forEach(function(a) {
        h += '<button class="btn btn-game" onclick="confirmMove(\'' + targetZoneId + '\',\'' + a.id + '\',' + timeMinutes + ')" style="margin:4px 0;">' + a.label + '</button><br>';
    });
    h += '</div><button class="btn btn-secondary" onclick="closeConfirmMove()">Отмена</button>';
    
    content.innerHTML = h;
    modal.classList.remove('hide');
};

window.confirmMove = function(targetZoneId, action, timeMinutes) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [], marching: [] };
    
    var takenUnits = [];
    ['infantry','cavalry','siege'].forEach(function(cat) {
        window.selectedUnits[cat].forEach(function(sel) {
            var taken = 0;
            for (var i = garrison[cat].length - 1; i >= 0; i--) {
                if (garrison[cat][i].type === sel.type && (!garrison[cat][i].location || garrison[cat][i].location === 'castle') && taken < sel.count) {
                    var unit = garrison[cat].splice(i, 1)[0];
                    takenUnits.push(unit);
                    taken++;
                }
            }
        });
    });
    
    if (takenUnits.length === 0) { setMessage('❌ Не удалось забрать юнитов.'); return; }
    
    var arrivesAt = Date.now() + timeMinutes * 60 * 1000;
    var marchingEntry = {
        units: takenUnits,
        targetZone: targetZoneId,
        action: action,
        arrivesAt: arrivesAt,
        departedAt: Date.now(),
        commander: currentUser
    };
    
    if (!garrison.marching) garrison.marching = [];
    garrison.marching.push(marchingEntry);
    
    saveData();
    closeConfirmMove();
    closeTargetMap();
    openCommandMap();
    
    setMessage('✅ Отряд (' + takenUnits.length + ' юнитов) выступил. Прибудет через ' + timeMinutes + ' мин.');
    addHouseLog(houseId, '🚶 ' + currentUser + ' отправил ' + takenUnits.length + ' юнитов в ' + getZoneName(targetZoneId));
    
    setTimeout(function() {
        processMarchArrival(marchingEntry, houseId);
    }, timeMinutes * 60 * 1000);
};

// ============================================================
// 7. ПРИБЫТИЕ И БОЙ
// ============================================================

function processMarchArrival(marchingEntry, houseId) {
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : null;
    if (!garrison || !garrison.marching) return;
    
    var idx = garrison.marching.indexOf(marchingEntry);
    if (idx === -1) return;
    garrison.marching.splice(idx, 1);
    
    var targetZone = WORLD_AREAS[marchingEntry.targetZone];
    var action = marchingEntry.action;
    var units = marchingEntry.units;
    
    if (action === 'defend') {
        units.forEach(function(u) { u.location = marchingEntry.targetZone; u.stance = 'defending'; returnUnit(u, garrison); });
        saveData();
        setMessage('🛡️ Отряд занял оборону в ' + getZoneName(marchingEntry.targetZone));
        addHouseLog(houseId, '🛡️ Отряд занял оборону в ' + getZoneName(marchingEntry.targetZone));
    }
    
    if (action === 'move') {
        units.forEach(function(u) { u.location = marchingEntry.targetZone; u.stance = 'moving'; returnUnit(u, garrison); });
        saveData();
        setMessage('🚶 Отряд прибыл в ' + getZoneName(marchingEntry.targetZone));
        addHouseLog(houseId, '🚶 Отряд прибыл в ' + getZoneName(marchingEntry.targetZone));
    }
    
    if (action === 'attack') {
        var enemies = findEnemiesInZone(marchingEntry.targetZone, houseId);
        if (enemies.length > 0) {
            resolveBattle(units, enemies, marchingEntry.targetZone, houseId);
        } else {
            if (targetZone) targetZone.owner = houseId;
            units.forEach(function(u) { u.location = marchingEntry.targetZone; u.stance = 'attacking'; returnUnit(u, garrison); });
            saveData();
            setMessage('⚔️ Зона ' + getZoneName(marchingEntry.targetZone) + ' захвачена!');
            addHouseLog(houseId, '⚔️ Захвачена зона ' + getZoneName(marchingEntry.targetZone));
        }
    }
    
    updateMenu();
};

function returnUnit(u, garrison) {
    if (u.siege) garrison.siege.push(u);
    else if (u.horse || u.type === 'rider' || u.type === 'heavy_rider' || u.type === 'knight') garrison.cavalry.push(u);
    else garrison.infantry.push(u);
}

function findEnemiesInZone(zoneId, myHouseId) {
    var enemies = [];
    for (var hid in window._castleGarrisons) {
        if (hid === myHouseId) continue;
        var g = window._castleGarrisons[hid];
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (g[cat]) {
                g[cat].forEach(function(u) {
                    if (u.location === zoneId) enemies.push({ unit: u, house: hid });
                });
            }
        });
    }
    return enemies;
}

function resolveBattle(attackers, defenders, zoneId, attackerHouseId) {
    var attPower = attackers.length;
    var defPower = defenders.length;
    var defenderHouseId = defenders.length > 0 ? defenders[0].house : null;
    
    var attRoll = attPower * (0.8 + Math.random() * 0.4);
    var defRoll = defPower * (0.8 + Math.random() * 0.4);
    
    if (attRoll > defRoll) {
        var attLosses = Math.max(1, Math.floor(attackers.length * (1 - attRoll / (attRoll + defRoll))));
        var defLosses = defenders.length;
        
        // Удаляем защитников
        for (var hid in window._castleGarrisons) {
            var g = window._castleGarrisons[hid];
            ['infantry','cavalry','siege'].forEach(function(cat) {
                if (g[cat]) {
                    for (var i = g[cat].length - 1; i >= 0; i--) {
                        if (g[cat][i].location === zoneId) g[cat].splice(i, 1);
                    }
                }
            });
        }
        
        // Потери атакующих
        var lost = 0;
        var garrison = window._castleGarrisons[attackerHouseId];
        for (var cat in {infantry:1,cavalry:1,siege:1}) {
            if (garrison[cat]) {
                for (var i = garrison[cat].length - 1; i >= 0 && lost < attLosses; i--) {
                    if (garrison[cat][i].location === zoneId) { garrison[cat].splice(i, 1); lost++; }
                }
            }
        }
        
        if (WORLD_AREAS[zoneId]) WORLD_AREAS[zoneId].owner = attackerHouseId;
        setMessage('⚔️ ПОБЕДА! Потери: ' + attLosses + ' vs ' + defLosses);
        addHouseLog(attackerHouseId, '⚔️ Победа в ' + getZoneName(zoneId) + ' (-' + attLosses + ' юнитов)');
    } else {
        var defLosses = Math.max(1, Math.floor(defenders.length * (1 - defRoll / (attRoll + defRoll))));
        var attLosses = attackers.length;
        
        // Удаляем всех атакующих
        var garrison = window._castleGarrisons[attackerHouseId];
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (garrison[cat]) {
                for (var i = garrison[cat].length - 1; i >= 0; i--) {
                    if (garrison[cat][i].location === zoneId || attackers.indexOf(garrison[cat][i]) !== -1) {
                        garrison[cat].splice(i, 1);
                    }
                }
            }
        });
        
        // Потери защитников
        var lost = 0;
        for (var hid in window._castleGarrisons) {
            var g = window._castleGarrisons[hid];
            ['infantry','cavalry','siege'].forEach(function(cat) {
                if (g[cat]) {
                    for (var i = g[cat].length - 1; i >= 0 && lost < defLosses; i--) {
                        if (g[cat][i].location === zoneId) { g[cat].splice(i, 1); lost++; }
                    }
                }
            });
        }
        
        setMessage('🛡️ ПОРАЖЕНИЕ! Защитники удержали зону.');
        addHouseLog(attackerHouseId, '🛡️ Поражение в ' + getZoneName(zoneId) + ' (-' + attLosses + ' юнитов)');
    }
    
    saveData();
    updateMenu();
}

// ============================================================
// 8. ВСПОМОГАТЕЛЬНЫЕ
// ============================================================

function getZoneName(zoneId) {
    var z = WORLD_AREAS[zoneId];
    return z ? z.name : zoneId;
}

window.closeCommandMap = function() { var m = document.getElementById('modal-command'); if (m) m.classList.add('hide'); };
window.closeTargetMap = function() { var m = document.getElementById('modal-target-map'); if (m) m.classList.add('hide'); };
window.closeConfirmMove = function() { var m = document.getElementById('modal-confirm-move'); if (m) m.classList.add('hide'); };

// ============================================================
// 9. ТАЙМЕР ПРИБЫТИЯ ПРИ ЗАГРУЗКЕ
// ============================================================

window.restoreMarchingTimers = function() {
    for (var hid in window._castleGarrisons) {
        var g = window._castleGarrisons[hid];
        if (g.marching && g.marching.length > 0) {
            g.marching.forEach(function(m) {
                var timeLeft = m.arrivesAt - Date.now();
                if (timeLeft <= 0) {
                    processMarchArrival(m, hid);
                } else {
                    setTimeout(function() { processMarchArrival(m, hid); }, timeLeft);
                }
            });
        }
    }
};

// ============================================================
// 10. РЕГИСТРАЦИЯ
// ============================================================

window.openCommandMap = openCommandMap;
window.showCommandTab = showCommandTab;
window.selectAllGarrison = selectAllGarrison;
window.clearAllGarrison = clearAllGarrison;
window.openTargetMap = openTargetMap;
window.selectTargetZone = selectTargetZone;
window.confirmMove = confirmMove;
window.commandMapClick = commandMapClick;
window.closeCommandAction = closeCommandAction;
window.moveFieldUnits = moveFieldUnits;
window.processMarchArrival = processMarchArrival;
window.resolveBattle = resolveBattle;
window.restoreMarchingTimers = restoreMarchingTimers;

setTimeout(function() {
    if (typeof window._castleGarrisons !== 'undefined') restoreMarchingTimers();
}, 1000);

console.log('🎯 Командование + PvP загружены!');

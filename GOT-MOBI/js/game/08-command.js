// ============================================================
// js/game/08-command.js — КОМАНДОВАНИЕ ВОЙСКАМИ + PvP
// ПОЛНАЯ ВЕРСИЯ
// ============================================================

// ============================================================
// 1. ОТКРЫТИЕ КАРТЫ КОМАНДОВАНИЯ
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
    html += '<p style="color:#6a5a48;font-size:11px;text-align:center;">🟢 Свои | 🔴 Враги | 🔵 Союзники | ⭐ Вы</p>';
    html += '<p style="color:#6a5a48;font-size:10px;text-align:center;">Нажмите на зону со своими войсками чтобы управлять</p>';
    html += buildCommandWorldMap(houseId);
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
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
    
    // Сбор всех войск по зонам с информацией о командирах
    var troopsByZone = {};
    for (var hid in window._castleGarrisons) {
        var g = window._castleGarrisons[hid];
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (g[cat]) {
                g[cat].forEach(function(u) {
                    if (u.location && u.location !== 'castle') {
                        if (!troopsByZone[u.location]) troopsByZone[u.location] = {};
                        if (!troopsByZone[u.location][hid]) troopsByZone[u.location][hid] = { count: 0, hasCommander: false, commander: null };
                        troopsByZone[u.location][hid].count++;
                        if (u.commander) {
                            troopsByZone[u.location][hid].hasCommander = true;
                            troopsByZone[u.location][hid].commander = u.commander;
                        }
                    }
                });
            }
        });
    }
    
    // Кеш цветов
    var typeColors = {
        'road': '#8B7355', 'forest': '#2d5016', 'plain': '#7a9a3a', 'mountain': '#6b6b6b',
        'river': '#2980b9', 'coast': '#d4b896', 'sea': '#0d3b5c', 'shallows': '#1a5276',
        'crossroads': '#8B7355', 'castle': '#4a3728', 'castle_gate': '#4a3728',
        'village': '#6b8a3a', 'mine': '#3d3d3d', 'swamp': '#3d5020'
    };
    
    var user = users[currentUser];
    var g = user.game;
    var currentZone = g.location.locationId || g.location.place;
    var currentLoc = WORLD_AREAS[currentZone];
    var curX = currentLoc ? currentLoc.x : 0;
    var curY = currentLoc ? currentLoc.y : 0;
    
    var html = '<div style="overflow:auto;max-width:100%;max-height:60vh;margin-top:8px;">';
    html += '<div style="position:relative;width:' + mapWidth + 'px;height:' + mapHeight + 'px;min-width:' + mapWidth + 'px;background:#0a0806;border-radius:8px;">';
    
    for (var y = minY; y <= maxY; y++) {
        for (var x = minX; x <= maxX; x++) {
            var zone = lookup[x + ',' + y];
            var bg = '#0a0806';
            var isCurrent = false;
            var isWater = false;
            var hasTroops = false;
            
            if (zone) {
                var colorKey = zone.type;
                if (zone.type === 'coast' && zone.resourceType === 'shallows') colorKey = 'shallows';
                bg = typeColors[colorKey] || '#3d3026';
                
                if (zone.type === 'river' || zone.type === 'sea' || zone.type === 'shallows') isWater = true;
                if (zone.id === currentZone) isCurrent = true;
                if (troopsByZone[zone.id]) hasTroops = true;
            }
            
            var left = (x - minX) * cellSize + 1;
            var top = (y - minY) * cellSize + 1;
            var size = cellSize - 2;
            
            html += '<div onclick="handleZoneClick(\'' + (zone ? zone.id : '') + '\',' + x + ',' + y + ',' + isWater + ')" style="';
            html += 'position:absolute;left:' + left + 'px;top:' + top + 'px;width:' + size + 'px;height:' + size + 'px;';
            html += 'background:' + bg + ';border:1px solid #2a201a;border-radius:2px;cursor:pointer;';
            html += 'display:flex;align-items:center;justify-content:center;flex-direction:column;font-size:' + Math.max(7, cellSize*0.3) + 'px;';
            if (isCurrent) html += 'box-shadow:inset 0 0 0 2px #ffd700;';
            if (isWater) html += 'opacity:0.6;';
            html += '">';
            
            // Войска в зоне
            if (zone && troopsByZone[zone.id]) {
                var troopData = troopsByZone[zone.id];
                var hasOwn = false, hasEnemy = false, hasAlly = false;
                for (var hid in troopData) {
                    if (hid === houseId) hasOwn = true;
                    else if (HOUSES[hid] && HOUSES[hid].liege === houseId) hasAlly = true;
                    else hasEnemy = true;
                }
                if (hasOwn) html += '<span style="font-size:' + Math.max(8, cellSize*0.4) + 'px;">🟢</span>';
                else if (hasAlly) html += '<span style="font-size:' + Math.max(8, cellSize*0.4) + 'px;">🔵</span>';
                else if (hasEnemy) html += '<span style="font-size:' + Math.max(8, cellSize*0.4) + 'px;">🔴</span>';
                else html += '<span style="font-size:' + Math.max(8, cellSize*0.4) + 'px;">⚪</span>';
            }
            
            html += '<span style="font-size:' + Math.max(6, cellSize*0.28) + 'px;color:#b8a890;">' + (zone ? zone.name.substring(0,4) : '') + '</span>';
            html += '</div>';
        }
    }
    
    html += '</div></div>';
    
    // Легенда
    html += '<div class="modal-section" style="margin-top:8px;">';
    html += '<p style="color:#6a5a48;font-size:11px;">📍 Вы: ' + (currentLoc ? currentLoc.name : '?') + ' [' + curX + ',' + curY + ']</p>';
    html += '</div>';
    
    return html;
}

// ============================================================
// 3. КЛИК ПО ЗОНЕ
// ============================================================

window.handleZoneClick = function(zoneId, x, y, isWater) {
    if (!zoneId || isWater) return;
    
    var user = users[currentUser];
    var houseId = user.game.house;
    var zone = WORLD_AREAS[zoneId];
    var zoneName = zone ? zone.name : zoneId;
    
    // Собираем свои войска в этой зоне
    var ownUnits = getOwnUnitsInZone(zoneId, houseId);
    
    if (ownUnits.length === 0) {
        // Нет своих войск — показываем инфо о зоне
        showZoneInfo(zoneId, zoneName, houseId);
        return;
    }
    
    // Есть свои войска — показываем модалку управления
    showOwnUnitsModal(zoneId, zoneName, ownUnits, houseId);
};

// ============================================================
// 4. СБОР СВОИХ ВОЙСК В ЗОНЕ
// ============================================================

function getOwnUnitsInZone(zoneId, houseId) {
    var result = {
        commanders: [],      // Рыцари-командоры
        captains: [],        // Капитаны с сержантами
        sergeants: [],       // Отдельные сержанты
        unattached: []       // Непривязанные войска
    };
    
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [] };
    var allUnits = [];
    
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (garrison[cat]) {
            garrison[cat].forEach(function(u, idx) {
                if (u.location === zoneId) allUnits.push({ unit: u, category: cat, index: idx });
            });
        }
    });
    
    // Группируем по командирам
    var commandersMap = {};
    var captainsMap = {};
    var sergeantsMap = {};
    var unattachedList = [];
    
    allUnits.forEach(function(item) {
        var u = item.unit;
        if (u.commander) {
            var rank = getCommanderRank(u.commander, houseId);
            if (rank === 'knight_commander') {
                if (!commandersMap[u.commander]) commandersMap[u.commander] = { name: u.commander, units: [], captains: {} };
                commandersMap[u.commander].units.push(item);
            } else if (rank === 'captain_officer') {
                if (!captainsMap[u.commander]) captainsMap[u.commander] = { name: u.commander, units: [], sergeants: {} };
                captainsMap[u.commander].units.push(item);
            } else if (rank === 'sergeant') {
                if (!sergeantsMap[u.commander]) sergeantsMap[u.commander] = { name: u.commander, units: [] };
                sergeantsMap[u.commander].units.push(item);
            } else {
                unattachedList.push(item);
            }
        } else {
            unattachedList.push(item);
        }
    });
    
    // Конвертируем в массивы
    for (var name in commandersMap) result.commanders.push(commandersMap[name]);
    for (var name in captainsMap) result.captains.push(captainsMap[name]);
    for (var name in sergeantsMap) result.sergeants.push(sergeantsMap[name]);
    result.unattached = unattachedList;
    
    return result;
}

function getCommanderRank(playerName, houseId) {
    var u = users[playerName];
    if (!u || u.game.house !== houseId) return null;
    return u.game.houseRank || null;
}

// ============================================================
// 5. МОДАЛКА СВОИХ ВОЙСК
// ============================================================

function showOwnUnitsModal(zoneId, zoneName, ownUnits, houseId) {
    var modal = document.getElementById('modal-own-units');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-own-units';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeOwnUnitsModal(); };
        overlay.innerHTML = '<div class="modal-box" style="max-height:90vh;overflow-y:auto;"><div class="modal-header"><h3>⚔️ ВОЙСКА В ЗОНЕ</h3><button class="close-btn" onclick="closeOwnUnitsModal()">✕</button></div><div id="modal-own-units-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-own-units-content');
    var html = '<div class="modal-section"><h4>📍 ' + zoneName + '</h4>';
    html += '<p style="color:#6a5a48;">Выберите отряд для отправки</p></div>';
    
    // Рыцари-командоры
    if (ownUnits.commanders.length > 0) {
        html += '<div class="modal-section"><h4>⭐ РЫЦАРИ-КОМАНДОРЫ</h4>';
        ownUnits.commanders.forEach(function(cmd) {
            var totalUnits = cmd.units.length;
            html += '<div class="row" style="padding:8px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label">⭐ ' + cmd.name + '<br><span style="font-size:10px;color:#6a5a48;">Командор — ' + totalUnits + ' юнитов (с капитанами)</span></span>';
            html += '<span class="value"><button class="btn btn-small" onclick="selectCommanderForMove(\'' + zoneId + '\',\'knight_commander\',\'' + cmd.name + '\')">🚶 Отправить</button></span>';
            html += '</div>';
        });
        html += '</div>';
    }
    
    // Капитаны
    if (ownUnits.captains.length > 0) {
        html += '<div class="modal-section"><h4>🗡️ КАПИТАНЫ</h4>';
        ownUnits.captains.forEach(function(cap) {
            var totalUnits = cap.units.length;
            html += '<div class="row" style="padding:8px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label">🗡️ ' + cap.name + '<br><span style="font-size:10px;color:#6a5a48;">Капитан — ' + totalUnits + ' юнитов (с сержантами)</span></span>';
            html += '<span class="value"><button class="btn btn-small" onclick="selectCommanderForMove(\'' + zoneId + '\',\'captain_officer\',\'' + cap.name + '\')">🚶 Отправить</button></span>';
            html += '</div>';
        });
        html += '</div>';
    }
    
    // Сержанты
    if (ownUnits.sergeants.length > 0) {
        html += '<div class="modal-section"><h4>🛡️ СЕРЖАНТЫ</h4>';
        ownUnits.sergeants.forEach(function(sgt) {
            var totalUnits = sgt.units.length;
            var unitTypes = {};
            sgt.units.forEach(function(item) {
                var t = item.unit.type;
                if (!unitTypes[t]) unitTypes[t] = 0;
                unitTypes[t]++;
            });
            var unitStr = '';
            for (var t in unitTypes) {
                var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
                unitStr += (ut ? ut.emoji : '') + '×' + unitTypes[t] + ' ';
            }
            html += '<div class="row" style="padding:8px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label">🛡️ ' + sgt.name + '<br><span style="font-size:10px;color:#6a5a48;">' + unitStr + '</span></span>';
            html += '<span class="value"><button class="btn btn-small" onclick="selectCommanderForMove(\'' + zoneId + '\',\'sergeant\',\'' + sgt.name + '\')">🚶 Отправить</button></span>';
            html += '</div>';
        });
        html += '</div>';
    }
    
    // Непривязанные
    if (ownUnits.unattached.length > 0) {
        html += '<div class="modal-section"><h4>📦 НЕПРИВЯЗАННЫЕ ВОЙСКА</h4>';
        var unitTypes = {};
        ownUnits.unattached.forEach(function(item) {
            var t = item.unit.type;
            if (!unitTypes[t]) unitTypes[t] = 0;
            unitTypes[t]++;
        });
        for (var t in unitTypes) {
            var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
            html += '<div class="row" style="padding:8px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label">' + (ut ? ut.emoji + ' ' + ut.name : t) + '</span>';
            html += '<span class="value">×' + unitTypes[t] + ' <input type="number" class="unattached-count" data-type="' + t + '" value="' + unitTypes[t] + '" min="1" max="' + unitTypes[t] + '" style="width:50px;padding:2px;"></span>';
            html += '</div>';
        }
        html += '<button class="btn btn-small" onclick="selectUnattachedForMove(\'' + zoneId + '\')">🚶 Отправить выбранных</button>';
        html += '</div>';
    }
    
    html += '</div>';
    html += '<button class="btn btn-secondary" onclick="closeOwnUnitsModal()" style="margin-top:10px;">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
};

window.closeOwnUnitsModal = function() {
    var m = document.getElementById('modal-own-units');
    if (m) m.classList.add('hide');
};

// ============================================================
// 6. ВЫБОР КОМАНДИРА ДЛЯ ОТПРАВКИ
// ============================================================

window.currentMovingCommander = null;

window.selectCommanderForMove = function(zoneId, rank, name) {
    window.currentMovingCommander = { zoneId: zoneId, rank: rank, name: name, type: 'commander' };
    closeOwnUnitsModal();
    // Открываем карту для выбора цели
    openMovementTargetMap(zoneId);
};

window.selectUnattachedForMove = function(zoneId) {
    window.currentMovingCommander = { zoneId: zoneId, type: 'unattached' };
    closeOwnUnitsModal();
    openMovementTargetMap(zoneId);
};

// ============================================================
// 7. КАРТА ВЫБОРА ЦЕЛИ
// ============================================================

function openMovementTargetMap(fromZoneId) {
    var modal = document.getElementById('modal-move-target');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-move-target';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeMovementTargetMap(); };
        overlay.innerHTML = '<div class="modal-box" style="max-width:95vw;width:95vw;max-height:95vh;overflow-y:auto;"><div class="modal-header"><h3>🗺️ ВЫБОР ЦЕЛИ</h3><button class="close-btn" onclick="closeMovementTargetMap()">✕</button></div><div id="modal-move-target-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-move-target-content');
    var zone = WORLD_AREAS[fromZoneId];
    var zoneName = zone ? zone.name : fromZoneId;
    
    var html = '<div class="modal-section"><h4>🗺️ ВЫБЕРИТЕ ЦЕЛЬ</h4>';
    html += '<p style="color:#6a5a48;">Откуда: ' + zoneName + '</p>';
    html += '<p style="color:#6a5a48;font-size:10px;">Нажмите на зону чтобы выбрать действие</p>';
    html += '<div id="move-target-minimap" style="margin:10px 0;"></div>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
    
    buildMoveTargetMap(fromZoneId);
}

function buildMoveTargetMap(fromZoneId) {
    var container = document.getElementById('move-target-minimap');
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
    var cellSize = Math.max(14, Math.min(30, Math.floor(460 / Math.max(cols, rows))));
    var mapWidth = cols * cellSize;
    var mapHeight = rows * cellSize;
    
    var lookup = {};
    for (var i = 0; i < allZones.length; i++) {
        lookup[allZones[i].x + ',' + allZones[i].y] = allZones[i];
    }
    
    var fromZone = WORLD_AREAS[fromZoneId];
    var fromX = fromZone ? fromZone.x : 0;
    var fromY = fromZone ? fromZone.y : 0;
    
    var typeColors = {
        'road': '#8B7355', 'forest': '#2d5016', 'plain': '#7a9a3a', 'mountain': '#6b6b6b',
        'river': '#2980b9', 'coast': '#d4b896', 'sea': '#0d3b5c', 'shallows': '#1a5276',
        'crossroads': '#8B7355', 'castle': '#4a3728', 'castle_gate': '#4a3728',
        'village': '#6b8a3a', 'mine': '#3d3d3d'
    };
    
    var html = '<div style="position:relative;width:' + mapWidth + 'px;height:' + mapHeight + 'px;background:#0a0806;border-radius:8px;margin:0 auto;">';
    
    for (var y = minY; y <= maxY; y++) {
        for (var x = minX; x <= maxX; x++) {
            var zone = lookup[x + ',' + y];
            var bg = '#1a1410';
            var isFrom = false;
            var isWater = false;
            
            if (zone) {
                var colorKey = zone.type;
                if (zone.type === 'coast' && zone.resourceType === 'shallows') colorKey = 'shallows';
                bg = typeColors[colorKey] || '#3d3026';
                
                if (zone.type === 'river' || zone.type === 'sea' || zone.type === 'shallows') isWater = true;
                if (zone.id === fromZoneId) isFrom = true;
            }
            
            var left = (x - minX) * cellSize + 1;
            var top = (y - minY) * cellSize + 1;
            var size = cellSize - 2;
            
            var dist = Math.abs(x - fromX) + Math.abs(y - fromY);
            var timeEst = isWater ? '—' : (dist * 5 + 'м');
            
            html += '<div onclick="selectMoveTarget(\'' + (zone ? zone.id : '') + '\',' + dist + ',' + isWater + ')" style="';
            html += 'position:absolute;left:' + left + 'px;top:' + top + 'px;width:' + size + 'px;height:' + size + 'px;';
            html += 'background:' + bg + ';border:1px solid #2a201a;border-radius:2px;cursor:pointer;';
            html += 'display:flex;align-items:center;justify-content:center;flex-direction:column;font-size:' + Math.max(7, cellSize*0.3) + 'px;';
            if (isFrom) html += 'box-shadow:inset 0 0 0 2px #ffd700;';
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

window.selectMoveTarget = function(targetZoneId, distance, isWater) {
    if (!targetZoneId || isWater) {
        setMessage('⛵ Нельзя отправить войска на воду.');
        return;
    }
    
    var user = users[currentUser];
    var houseId = user.game.house;
    var fromZoneId = window.currentMovingCommander.zoneId;
    var targetZone = WORLD_AREAS[targetZoneId];
    var isOwnZone = targetZone && targetZone.owner === houseId;
    var timeMinutes = distance * 5;
    
    var actions = [];
    actions.push({ id: 'move', label: '🚶 Идти (' + timeMinutes + ' мин)', desc: 'Переместиться в зону' });
    if (isOwnZone) {
        actions.push({ id: 'defend', label: '🛡️ Защита (' + timeMinutes + ' мин)', desc: 'Занять оборону в зоне' });
    } else {
        actions.push({ id: 'attack', label: '⚔️ Атака (' + timeMinutes + ' мин)', desc: 'Атаковать и захватить зону' });
    }
    
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
    var targetZoneName = targetZone ? targetZone.name : targetZoneId;
    var fromZone = WORLD_AREAS[fromZoneId];
    var fromZoneName = fromZone ? fromZone.name : fromZoneId;
    
    var h = '<div class="modal-section"><h4>🎯 ' + fromZoneName + ' → ' + targetZoneName + '</h4>';
    h += '<p style="color:#6a5a48;">Дистанция: ' + distance + ' зон (~' + timeMinutes + ' мин)</p>';
    h += '<p style="color:#6a5a48;">Владелец цели: ' + (targetZone && targetZone.owner ? targetZone.owner : 'ничья') + '</p>';
    
    if (window.currentMovingCommander.type === 'commander') {
        h += '<p style="color:#ffd700;">Отправляется: ' + window.currentMovingCommander.name + ' (' + window.currentMovingCommander.rank + ')</p>';
    }
    
    h += '</div><div class="modal-section"><h4>⚡ ДЕЙСТВИЕ</h4>';
    actions.forEach(function(a) {
        h += '<button class="btn btn-game" onclick="confirmMovement(\'' + fromZoneId + '\',\'' + targetZoneId + '\',\'' + a.id + '\',' + timeMinutes + ')" style="margin:4px 0;">' + a.label + '</button><br>';
        h += '<span style="font-size:10px;color:#6a5a48;">' + a.desc + '</span><br>';
    });
    h += '</div><button class="btn btn-secondary" onclick="closeConfirmMove()">Отмена</button>';
    
    content.innerHTML = h;
    modal.classList.remove('hide');
};

window.closeMovementTargetMap = function() {
    var m = document.getElementById('modal-move-target');
    if (m) m.classList.add('hide');
};

window.closeConfirmMove = function() {
    var m = document.getElementById('modal-confirm-move');
    if (m) m.classList.add('hide');
};

// ============================================================
// 8. ПОДТВЕРЖДЕНИЕ И ОТПРАВКА
// ============================================================

window.confirmMovement = function(fromZoneId, targetZoneId, action, timeMinutes) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [], marching: [] };
    
    var takenUnits = [];
    var commander = window.currentMovingCommander;
    
    if (commander.type === 'commander') {
        // Забираем все юниты командира из зоны
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (garrison[cat]) {
                for (var i = garrison[cat].length - 1; i >= 0; i--) {
                    var u = garrison[cat][i];
                    if (u.location === fromZoneId && u.commander === commander.name) {
                        takenUnits.push(garrison[cat].splice(i, 1)[0]);
                    }
                }
            }
        });
        
        // Также забираем юниты подчинённых если это командор/капитан
        if (commander.rank === 'knight_commander' || commander.rank === 'captain_officer') {
            // Все юниты в зоне с любым командиром (подчинённые)
            ['infantry','cavalry','siege'].forEach(function(cat) {
                if (garrison[cat]) {
                    for (var i = garrison[cat].length - 1; i >= 0; i--) {
                        var u = garrison[cat][i];
                        if (u.location === fromZoneId && u.commander && u.commander !== commander.name && takenUnits.indexOf(u) === -1) {
                            takenUnits.push(garrison[cat].splice(i, 1)[0]);
                        }
                    }
                }
            });
        }
    } else if (commander.type === 'unattached') {
        // Забираем выбранные непривязанные юниты
        var inputs = document.querySelectorAll('.unattached-count');
        inputs.forEach(function(inp) {
            var type = inp.getAttribute('data-type');
            var count = parseInt(inp.value) || 0;
            var taken = 0;
            ['infantry','cavalry','siege'].forEach(function(cat) {
                if (garrison[cat]) {
                    for (var i = garrison[cat].length - 1; i >= 0 && taken < count; i--) {
                        var u = garrison[cat][i];
                        if (u.location === fromZoneId && u.type === type && !u.commander) {
                            takenUnits.push(garrison[cat].splice(i, 1)[0]);
                            taken++;
                        }
                    }
                }
            });
        });
    }
    
    if (takenUnits.length === 0) {
        setMessage('❌ Не удалось забрать юнитов.');
        return;
    }
    
    var arrivesAt = Date.now() + timeMinutes * 60 * 1000;
    var marchingEntry = {
        units: takenUnits,
        fromZone: fromZoneId,
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
    closeMovementTargetMap();
    closeOwnUnitsModal();
    openCommandMap();
    
    setMessage('✅ Отряд (' + takenUnits.length + ' юнитов) выступил. Прибудет через ' + timeMinutes + ' мин.');
    addHouseLog(houseId, '🚶 ' + currentUser + ' отправил ' + takenUnits.length + ' юнитов в ' + getZoneName(targetZoneId));
    
    setTimeout(function() {
        processMarchArrival(marchingEntry, houseId);
    }, timeMinutes * 60 * 1000);
};

// ============================================================
// 9. ИНФО О ЗОНЕ БЕЗ СВОИХ ВОЙСК
// ============================================================

function showZoneInfo(zoneId, zoneName, houseId) {
    var zone = WORLD_AREAS[zoneId];
    var isOwnZone = zone && zone.owner === houseId;
    var enemies = [];
    
    for (var hid in window._castleGarrisons) {
        if (hid === houseId) continue;
        var g = window._castleGarrisons[hid];
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (g[cat]) {
                g[cat].forEach(function(u) {
                    if (u.location === zoneId) enemies.push({ house: hid, unit: u });
                });
            }
        });
    }
    
    var modal = document.getElementById('modal-zone-info');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-zone-info';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeZoneInfo(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📍 ЗОНА</h3><button class="close-btn" onclick="closeZoneInfo()">✕</button></div><div id="modal-zone-info-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-zone-info-content');
    var h = '<div class="modal-section"><h4>📍 ' + zoneName + '</h4>';
    h += '<p style="color:#6a5a48;">Тип: ' + (zone ? zone.type : '?') + '</p>';
    h += '<p style="color:#6a5a48;">Владелец: ' + (zone && zone.owner ? zone.owner : 'ничья') + '</p>';
    
    if (enemies.length > 0) {
        var enemyCount = {};
        enemies.forEach(function(e) {
            var hh = HOUSES[e.house];
            var name = hh ? hh.sigil + ' ' + hh.name : e.house;
            if (!enemyCount[name]) enemyCount[name] = 0;
            enemyCount[name]++;
        });
        h += '<p style="color:#c96a5a;">🔴 Вражеские войска:</p>';
        for (var n in enemyCount) {
            h += '<p style="color:#c96a5a;font-size:11px;">' + n + ': ~' + enemyCount[n] + ' юнитов</p>';
        }
    } else {
        h += '<p style="color:#7ac98a;">Нет вражеских войск</p>';
    }
    
    h += '</div>';
    h += '<button class="btn btn-secondary" onclick="closeZoneInfo()">Закрыть</button>';
    
    content.innerHTML = h;
    modal.classList.remove('hide');
};

window.closeZoneInfo = function() {
    var m = document.getElementById('modal-zone-info');
    if (m) m.classList.add('hide');
};

// ============================================================
// 10. ПРИБЫТИЕ И БОЙ
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
    
    // Проверяем врагов в зоне
    var enemies = findEnemiesInZone(marchingEntry.targetZone, houseId);
    
    if (enemies.length > 0) {
        // Бой в любом случае если есть враги
        resolveBattle(units, enemies, marchingEntry.targetZone, houseId, action);
    } else {
        // Нет врагов
        if (action === 'attack' && targetZone) {
            targetZone.owner = houseId;
        }
        units.forEach(function(u) {
            u.location = marchingEntry.targetZone;
            u.stance = action === 'defend' ? 'defending' : 'moving';
            returnUnit(u, garrison);
        });
        saveData();
        setMessage('✅ Отряд прибыл в ' + getZoneName(marchingEntry.targetZone));
        addHouseLog(houseId, '🚶 Отряд прибыл в ' + getZoneName(marchingEntry.targetZone));
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
        if (HOUSES[hid] && HOUSES[hid].liege === myHouseId) continue; // Союзники
        var g = window._castleGarrisons[hid];
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (g[cat]) {
                g[cat].forEach(function(u) {
                    if (u.location === zoneId && u.stance === 'defending') enemies.push({ unit: u, house: hid });
                });
            }
        });
    }
    return enemies;
}

function resolveBattle(attackers, defenders, zoneId, attackerHouseId, action) {
    var attPower = attackers.length;
    var defPower = defenders.length;
    
    var attRoll = attPower * (0.8 + Math.random() * 0.4);
    var defRoll = defPower * (0.8 + Math.random() * 0.4) * 1.2; // Защитники имеют бонус
    
    var attackerGarrison = window._castleGarrisons[attackerHouseId];
    
    if (attRoll > defRoll) {
        var attLosses = Math.max(1, Math.floor(attackers.length * 0.3));
        var defLosses = defenders.length;
        
        // Удаляем защитников
        for (var hid in window._castleGarrisons) {
            var g = window._castleGarrisons[hid];
            ['infantry','cavalry','siege'].forEach(function(cat) {
                if (g[cat]) {
                    for (var i = g[cat].length - 1; i >= 0; i--) {
                        if (g[cat][i].location === zoneId && g[cat][i].stance === 'defending') g[cat].splice(i, 1);
                    }
                }
            });
        }
        
        // Потери атакующих
        var lost = 0;
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (attackerGarrison[cat]) {
                for (var i = attackerGarrison[cat].length - 1; i >= 0 && lost < attLosses; i--) {
                    if (attackers.indexOf(attackerGarrison[cat][i]) !== -1) {
                        attackerGarrison[cat].splice(i, 1);
                        lost++;
                    }
                }
            }
        });
        
        // Оставшиеся атакующие занимают зону
        if (action === 'attack' && WORLD_AREAS[zoneId]) WORLD_AREAS[zoneId].owner = attackerHouseId;
        attackers.forEach(function(u) {
            if (u.location !== undefined) {
                u.location = zoneId;
                u.stance = 'moving';
                returnUnit(u, attackerGarrison);
            }
        });
        
        saveData();
        setMessage('⚔️ ПОБЕДА! Потери: ' + attLosses + ' vs ' + defLosses);
        addHouseLog(attackerHouseId, '⚔️ Победа в ' + getZoneName(zoneId) + ' (-' + attLosses + ' юнитов)');
    } else {
        var defLosses = Math.max(1, Math.floor(defenders.length * 0.2));
        var attLosses = attackers.length;
        
        // Удаляем всех атакующих
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (attackerGarrison[cat]) {
                for (var i = attackerGarrison[cat].length - 1; i >= 0; i--) {
                    if (attackers.indexOf(attackerGarrison[cat][i]) !== -1) {
                        attackerGarrison[cat].splice(i, 1);
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
                        if (g[cat][i].location === zoneId && g[cat][i].stance === 'defending') {
                            g[cat].splice(i, 1);
                            lost++;
                        }
                    }
                }
            });
        }
        
        saveData();
        setMessage('🛡️ ПОРАЖЕНИЕ! Защитники удержали зону.');
        addHouseLog(attackerHouseId, '🛡️ Поражение в ' + getZoneName(zoneId) + ' (-' + attLosses + ' юнитов)');
    }
    
    updateMenu();
}

// ============================================================
// 11. ВСПОМОГАТЕЛЬНЫЕ
// ============================================================

function getZoneName(zoneId) {
    var z = WORLD_AREAS[zoneId];
    return z ? z.name : zoneId;
}

window.closeCommandMap = function() { var m = document.getElementById('modal-command'); if (m) m.classList.add('hide'); };

// ============================================================
// 12. ТАЙМЕР ПРИ ЗАГРУЗКЕ
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
// 13. РЕГИСТРАЦИЯ
// ============================================================

window.openCommandMap = openCommandMap;
window.handleZoneClick = handleZoneClick;
window.closeOwnUnitsModal = closeOwnUnitsModal;
window.selectCommanderForMove = selectCommanderForMove;
window.selectUnattachedForMove = selectUnattachedForMove;
window.selectMoveTarget = selectMoveTarget;
window.confirmMovement = confirmMovement;
window.closeConfirmMove = closeConfirmMove;
window.closeMovementTargetMap = closeMovementTargetMap;
window.closeZoneInfo = closeZoneInfo;
window.processMarchArrival = processMarchArrival;
window.resolveBattle = resolveBattle;
window.restoreMarchingTimers = restoreMarchingTimers;

setTimeout(function() {
    if (typeof window._castleGarrisons !== 'undefined') restoreMarchingTimers();
}, 1000);

console.log('🎯 Командование + PvP загружены!');

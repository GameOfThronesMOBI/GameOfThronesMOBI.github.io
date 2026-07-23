// ============================================================
// js/game/08-command.js — КОМАНДОВАНИЕ ВОЙСКАМИ + PvP + РАЗВЕДКА
// ПОЛНАЯ ВЕРСИЯ
// ============================================================

var _showCommandCoords = false;
var _showCommandOwners = false;

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
    html += '<p style="color:#6a5a48;font-size:11px;text-align:center;">🟢 Свои | 🔴 Враги | 🔵 Союзники | ⭐ Вы | 👁️ Разведчик</p>';
    html += '<p style="color:#6a5a48;font-size:10px;text-align:center;">Нажмите на зону со своими войсками чтобы управлять</p>';
    
    // Галочки
    html += '<div style="text-align:center;margin:6px 0;display:flex;justify-content:center;gap:10px;">';
    html += '<label style="font-size:11px;color:#b8a890;cursor:pointer;" onclick="toggleCommandCoords()"><input type="checkbox" id="chk-command-coords" ' + (_showCommandCoords ? 'checked' : '') + '> 📍 Координаты</label>';
    html += '<label style="font-size:11px;color:#b8a890;cursor:pointer;" onclick="toggleCommandOwners()"><input type="checkbox" id="chk-command-owners" ' + (_showCommandOwners ? 'checked' : '') + '> 🎨 Владения</label>';
    html += '</div>';
    
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
    
    // Сбор всех войск по зонам с учётом видимости и разведчиков
    var troopsByZone = {};
    var ownZones = {}; // Зоны дома
    var ownTroopZones = {}; // Зоны где есть свои войска
    
    // Сначала собираем свои зоны и зоны с войсками
    for (var id in WORLD_AREAS) {
        if (WORLD_AREAS[id].owner === houseId) ownZones[id] = true;
    }
    
    for (var hid in window._castleGarrisons) {
        var g = window._castleGarrisons[hid];
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (g[cat]) {
                g[cat].forEach(function(u) {
                    if (u.location && u.location !== 'castle') {
                        if (hid === houseId) ownTroopZones[u.location] = true;
                    }
                });
            }
        });
    }
    
    // Зоны видимости: свои зоны + соседние + зоны с войсками + 2 клетки от войск
    var visibleZones = {};
    for (var id in ownZones) visibleZones[id] = true;
    for (var id in ownTroopZones) {
        visibleZones[id] = true;
        var z = WORLD_AREAS[id];
        if (z) {
            for (var dx = -2; dx <= 2; dx++) {
                for (var dy = -2; dy <= 2; dy++) {
                    if (Math.abs(dx) + Math.abs(dy) <= 2) {
                        var nkey = (z.x + dx) + ',' + (z.y + dy);
                        for (var tid in WORLD_AREAS) {
                            if (WORLD_AREAS[tid].x === z.x + dx && WORLD_AREAS[tid].y === z.y + dy) {
                                visibleZones[tid] = true;
                            }
                        }
                    }
                }
            }
        }
    }
    
    // Теперь собираем войска только в видимых зонах
    for (var hid in window._castleGarrisons) {
        var g = window._castleGarrisons[hid];
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (g[cat]) {
                g[cat].forEach(function(u) {
                    if (u.location && u.location !== 'castle') {
                        // Разведчики видны только свои
                        if (u.isScout && hid !== houseId) return;
                        
                        // Вражеские войска видны только в видимых зонах
                        if (hid !== houseId && !visibleZones[u.location]) return;
                        
                        if (!troopsByZone[u.location]) troopsByZone[u.location] = {};
                        if (!troopsByZone[u.location][hid]) troopsByZone[u.location][hid] = { count: 0, hasScout: false };
                        troopsByZone[u.location][hid].count++;
                        if (u.isScout) troopsByZone[u.location][hid].hasScout = true;
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
    
    var html = '';
    
    // Рамки владений
    if (_showCommandOwners) {
        var ownerGroups = buildOwnerGroups(lookup, allZones);
        ownerGroups.forEach(function(group) {
            var frameLeft = (group.minX - minX) * cellSize + 1;
            var frameTop = (group.minY - minY) * cellSize + 1;
            var frameW = (group.maxX - group.minX + 1) * cellSize - 2;
            var frameH = (group.maxY - group.minY + 1) * cellSize - 2;
            
            var houseColor = '#ffd700';
            if (group.owner === 'crown') houseColor = '#ffd700';
            else if (HOUSES[group.owner]) houseColor = HOUSES[group.owner].color || '#ffd700';
            
            html += '<div style="position:absolute;left:' + frameLeft + 'px;top:' + frameTop + 'px;width:' + frameW + 'px;height:' + frameH + 'px;border:2px solid ' + houseColor + ';border-radius:4px;pointer-events:none;z-index:5;box-shadow:0 0 4px ' + houseColor + ';"></div>';
        });
    }
    
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
            
            html += '<div onclick="handleZoneClick(\'' + (zone ? zone.id : '') + '\',' + x + ',' + y + ',' + isWater + ')" style="';
            html += 'position:absolute;left:' + left + 'px;top:' + top + 'px;width:' + size + 'px;height:' + size + 'px;';
            html += 'background:' + bg + ';border:1px solid #2a201a;border-radius:2px;cursor:pointer;';
            html += 'display:flex;align-items:center;justify-content:center;flex-direction:column;font-size:' + Math.max(7, cellSize*0.3) + 'px;';
            if (isCurrent) html += 'box-shadow:inset 0 0 0 2px #ffd700;';
            if (isWater) html += 'opacity:0.6;';
            html += '">';
            
            // Координаты
            if (_showCommandCoords) {
                html += '<span style="position:absolute;top:1px;left:2px;font-size:' + Math.max(5, cellSize*0.2) + 'px;color:#fff;opacity:0.7;z-index:3;line-height:1;pointer-events:none;">' + x + ',' + y + '</span>';
            }
            
            // Войска в зоне
            if (zone && troopsByZone[zone.id]) {
                var troopData = troopsByZone[zone.id];
                var hasOwn = false, hasEnemy = false, hasAlly = false, hasOwnScout = false;
                for (var hid in troopData) {
                    if (hid === houseId) {
                        hasOwn = true;
                        if (troopData[hid].hasScout) hasOwnScout = true;
                    } else if (HOUSES[hid] && HOUSES[hid].liege === houseId) hasAlly = true;
                    else hasEnemy = true;
                }
                if (hasOwnScout) html += '<span style="font-size:' + Math.max(8, cellSize*0.4) + 'px;">👁️</span>';
                else if (hasOwn) html += '<span style="font-size:' + Math.max(8, cellSize*0.4) + 'px;">🟢</span>';
                else if (hasAlly) html += '<span style="font-size:' + Math.max(8, cellSize*0.4) + 'px;">🔵</span>';
                else if (hasEnemy) html += '<span style="font-size:' + Math.max(8, cellSize*0.4) + 'px;">🔴</span>';
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

function buildOwnerGroups(lookup, allZones) {
    var ownerGroups = [];
    var visited = {};
    var dirs = [{x:0,y:-1},{x:0,y:1},{x:-1,y:0},{x:1,y:0}];
    
    for (var i = 0; i < allZones.length; i++) {
        var z = allZones[i];
        var key = z.x + ',' + z.y;
        if (visited[key]) continue;
        if (!z.owner || z.owner === 'none') continue;
        
        var group = { owner: z.owner, zones: [], minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
        var queue = [z];
        visited[key] = true;
        
        while (queue.length > 0) {
            var cz = queue.shift();
            group.zones.push(cz);
            if (cz.x < group.minX) group.minX = cz.x;
            if (cz.x > group.maxX) group.maxX = cz.x;
            if (cz.y < group.minY) group.minY = cz.y;
            if (cz.y > group.maxY) group.maxY = cz.y;
            
            dirs.forEach(function(d) {
                var nkey = (cz.x + d.x) + ',' + (cz.y + d.y);
                var nz = lookup[nkey];
                if (nz && !visited[nkey] && nz.owner === group.owner) {
                    visited[nkey] = true;
                    queue.push(nz);
                }
            });
        }
        
        if (group.zones.length >= 1) ownerGroups.push(group);
    }
    
    return ownerGroups;
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
    
    if (ownUnits.length === 0 && ownUnits.scouts.length === 0) {
        // Нет своих войск — показываем инфо о зоне (может быть разведка)
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
        commanders: [],
        captains: [],
        sergeants: [],
        unattached: [],
        scouts: [],
        length: 0
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
    
    var commandersMap = {};
    var captainsMap = {};
    var sergeantsMap = {};
    var unattachedList = [];
    var scoutsList = [];
    
    allUnits.forEach(function(item) {
        var u = item.unit;
        if (u.isScout) {
            scoutsList.push(item);
        } else if (u.commander) {
            var rank = getCommanderRank(u.commander, houseId);
            if (rank === 'knight_commander') {
                if (!commandersMap[u.commander]) commandersMap[u.commander] = { name: u.commander, units: [] };
                commandersMap[u.commander].units.push(item);
            } else if (rank === 'captain_officer') {
                if (!captainsMap[u.commander]) captainsMap[u.commander] = { name: u.commander, units: [] };
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
    
    for (var name in commandersMap) result.commanders.push(commandersMap[name]);
    for (var name in captainsMap) result.captains.push(captainsMap[name]);
    for (var name in sergeantsMap) result.sergeants.push(sergeantsMap[name]);
    result.unattached = unattachedList;
    result.scouts = scoutsList;
    result.length = allUnits.length;
    
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

window.currentMovingCommander = null;

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
    html += '<p style="color:#6a5a48;">Выберите отряд для отправки или отделите разведчика</p></div>';
    
    // Разведчики
    if (ownUnits.scouts.length > 0) {
        html += '<div class="modal-section"><h4>👁️ РАЗВЕДЧИКИ</h4>';
        ownUnits.scouts.forEach(function(item, i) {
            var u = item.unit;
            var ut = window.UNIT_TYPES ? window.UNIT_TYPES[u.type] : null;
            html += '<div class="row" style="padding:8px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label">👁️ Разведчик (' + (ut ? ut.emoji + ' ' + ut.name : u.type) + ')</span>';
            html += '<span class="value"><button class="btn btn-small" onclick="selectScoutForMove(\'' + zoneId + '\',' + i + ')">🚶 Двигать</button></span>';
            html += '</div>';
        });
        html += '</div>';
    }
    
    // Рыцари-командоры
    if (ownUnits.commanders.length > 0) {
        html += '<div class="modal-section"><h4>⭐ РЫЦАРИ-КОМАНДОРЫ</h4>';
        ownUnits.commanders.forEach(function(cmd) {
            var totalUnits = cmd.units.length;
            html += '<div class="row" style="padding:8px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label">⭐ ' + cmd.name + '<br><span style="font-size:10px;color:#6a5a48;">Командор — ' + totalUnits + ' юнитов</span></span>';
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
            html += '<span class="label">🗡️ ' + cap.name + '<br><span style="font-size:10px;color:#6a5a48;">Капитан — ' + totalUnits + ' юнитов</span></span>';
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
        html += '<button class="btn btn-small" onclick="detachScout(\'' + zoneId + '\')" style="margin-left:4px;">👁️ Отделить разведчика</button>';
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
// 6. ОТДЕЛЕНИЕ РАЗВЕДЧИКА
// ============================================================

window.detachScout = function(zoneId) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [] };
    
    // Берём 1 непривязанного юнита и делаем разведчиком
    var scout = null;
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (!scout && garrison[cat]) {
            for (var i = garrison[cat].length - 1; i >= 0; i--) {
                if (garrison[cat][i].location === zoneId && !garrison[cat][i].commander && !garrison[cat][i].isScout) {
                    scout = garrison[cat].splice(i, 1)[0];
                    break;
                }
            }
        }
    });
    
    if (!scout) {
        setMessage('❌ Нет свободных юнитов для разведки.');
        return;
    }
    
    scout.isScout = true;
    scout.scoutHome = zoneId;
    
    // Возвращаем в гарнизон как разведчика
    if (scout.siege) garrison.siege.push(scout);
    else if (scout.horse || scout.type === 'rider' || scout.type === 'heavy_rider' || scout.type === 'knight') garrison.cavalry.push(scout);
    else garrison.infantry.push(scout);
    
    saveData();
    closeOwnUnitsModal();
    openCommandMap();
    setMessage('👁️ Разведчик отделён от отряда.');
    addHouseLog(houseId, '👁️ Разведчик отделён в ' + getZoneName(zoneId));
};

// ============================================================
// 7. ВЫБОР ДЛЯ ОТПРАВКИ
// ============================================================

window.selectCommanderForMove = function(zoneId, rank, name) {
    window.currentMovingCommander = { zoneId: zoneId, rank: rank, name: name, type: 'commander' };
    closeOwnUnitsModal();
    openMovementTargetMap(zoneId);
};

window.selectScoutForMove = function(zoneId, scoutIndex) {
    window.currentMovingCommander = { zoneId: zoneId, type: 'scout', scoutIndex: scoutIndex };
    closeOwnUnitsModal();
    openScoutTargetMap(zoneId);
};

window.selectUnattachedForMove = function(zoneId) {
    window.currentMovingCommander = { zoneId: zoneId, type: 'unattached' };
    closeOwnUnitsModal();
    openMovementTargetMap(zoneId);
};

// ============================================================
// 8. КАРТА ЦЕЛЕЙ ДЛЯ РАЗВЕДЧИКА
// ============================================================

function openScoutTargetMap(fromZoneId) {
    var modal = document.getElementById('modal-scout-target');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-scout-target';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeScoutTargetMap(); };
        overlay.innerHTML = '<div class="modal-box" style="max-width:95vw;width:95vw;max-height:95vh;overflow-y:auto;"><div class="modal-header"><h3>👁️ РАЗВЕДЧИК — ВЫБОР ЦЕЛИ</h3><button class="close-btn" onclick="closeScoutTargetMap()">✕</button></div><div id="modal-scout-target-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-scout-target-content');
    var zone = WORLD_AREAS[fromZoneId];
    var zoneName = zone ? zone.name : fromZoneId;
    
    var html = '<div class="modal-section"><h4>👁️ РАЗВЕДЧИК</h4>';
    html += '<p style="color:#6a5a48;">Откуда: ' + zoneName + '</p>';
    html += '<p style="color:#6a5a48;font-size:10px;">Нажмите на зону. Разведчик невидим на вражеской территории.</p>';
    html += '<div id="scout-minimap" style="margin:10px 0;"></div>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
    
    buildScoutTargetMap(fromZoneId);
}

function buildScoutTargetMap(fromZoneId) {
    var container = document.getElementById('scout-minimap');
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
    
    var user = users[currentUser];
    var houseId = user.game.house;
    
    var html = '<div style="position:relative;width:' + mapWidth + 'px;height:' + mapHeight + 'px;background:#0a0806;border-radius:8px;margin:0 auto;">';
    
    for (var y = minY; y <= maxY; y++) {
        for (var x = minX; x <= maxX; x++) {
            var zone = lookup[x + ',' + y];
            var bg = '#1a1410';
            var isFrom = false;
            var isWater = false;
            var hasEnemy = false;
            
            if (zone) {
                var colorKey = zone.type;
                if (zone.type === 'coast' && zone.resourceType === 'shallows') colorKey = 'shallows';
                bg = typeColors[colorKey] || '#3d3026';
                
                if (zone.type === 'river' || zone.type === 'sea' || zone.type === 'shallows') isWater = true;
                if (zone.id === fromZoneId) isFrom = true;
                
                // Проверяем есть ли враги в зоне
                if (!isFrom) {
                    for (var hid in window._castleGarrisons) {
                        if (hid === houseId) continue;
                        var g = window._castleGarrisons[hid];
                        ['infantry','cavalry','siege'].forEach(function(cat) {
                            if (g[cat]) {
                                g[cat].forEach(function(u) {
                                    if (u.location === zone.id && !u.isScout) hasEnemy = true;
                                });
                            }
                        });
                    }
                }
            }
            
            var left = (x - minX) * cellSize + 1;
            var top = (y - minY) * cellSize + 1;
            var size = cellSize - 2;
            
            var dist = Math.abs(x - fromX) + Math.abs(y - fromY);
            var timeEst = isWater ? '—' : (dist * 2 + 'м');
            
            html += '<div onclick="selectScoutTarget(\'' + (zone ? zone.id : '') + '\',' + dist + ',' + isWater + ',' + hasEnemy + ')" style="';
            html += 'position:absolute;left:' + left + 'px;top:' + top + 'px;width:' + size + 'px;height:' + size + 'px;';
            html += 'background:' + bg + ';border:1px solid #2a201a;border-radius:2px;cursor:pointer;';
            html += 'display:flex;align-items:center;justify-content:center;flex-direction:column;font-size:' + Math.max(7, cellSize*0.3) + 'px;';
            if (isFrom) html += 'box-shadow:inset 0 0 0 2px #ffd700;';
            if (isWater) html += 'opacity:0.6;';
            html += '">';
            if (hasEnemy) html += '<span style="font-size:10px;">🔴</span>';
            html += '<span style="font-size:' + Math.max(7, cellSize*0.35) + 'px;color:#b8a890;">' + (zone ? zone.name.substring(0,3) : '') + '</span>';
            html += '<span style="font-size:' + Math.max(6, cellSize*0.25) + 'px;color:#6a5a48;">' + dist + ' (' + timeEst + ')</span>';
            html += '</div>';
        }
    }
    
    html += '</div>';
    container.innerHTML = html;
}

window.selectScoutTarget = function(targetZoneId, distance, isWater, hasEnemy) {
    if (!targetZoneId || isWater) {
        setMessage('⛵ Нельзя отправить разведчика на воду.');
        return;
    }
    
    var user = users[currentUser];
    var houseId = user.game.house;
    var timeMinutes = distance * 2; // Разведчик быстрее: 2 мин/зона
    
    var modal = document.getElementById('modal-scout-action');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-scout-action';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeScoutAction(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>👁️ РАЗВЕДЧИК</h3><button class="close-btn" onclick="closeScoutAction()">✕</button></div><div id="modal-scout-action-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-scout-action-content');
    var targetZone = WORLD_AREAS[targetZoneId];
    var targetZoneName = targetZone ? targetZone.name : targetZoneId;
    
    var h = '<div class="modal-section"><h4>👁️ ' + targetZoneName + '</h4>';
    h += '<p style="color:#6a5a48;">Дистанция: ' + distance + ' зон (~' + timeMinutes + ' мин)</p>';
    h += '</div>';
    
    h += '<div class="modal-section"><h4>⚡ ДЕЙСТВИЕ</h4>';
    h += '<button class="btn btn-game" onclick="moveScout(\'' + targetZoneId + '\',\'move\',' + timeMinutes + ')" style="margin:4px 0;">🚶 Идти</button><br>';
    
    if (hasEnemy) {
        h += '<button class="btn btn-game" onclick="moveScout(\'' + targetZoneId + '\',\'scout\',' + timeMinutes + ')" style="margin:4px 0;background:#5a3a1a;">🔍 Разведка (50% риск)</button><br>';
        h += '<span style="font-size:10px;color:#c96a5a;">Разведчик может погибнуть, но узнает состав врага</span><br>';
    }
    
    h += '</div><button class="btn btn-secondary" onclick="closeScoutAction()">Отмена</button>';
    
    content.innerHTML = h;
    modal.classList.remove('hide');
};

window.closeScoutAction = function() {
    var m = document.getElementById('modal-scout-action');
    if (m) m.classList.add('hide');
};

window.closeScoutTargetMap = function() {
    var m = document.getElementById('modal-scout-target');
    if (m) m.classList.add('hide');
};

// ============================================================
// 9. ДВИЖЕНИЕ РАЗВЕДЧИКА
// ============================================================

window.moveScout = function(targetZoneId, action, timeMinutes) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var commander = window.currentMovingCommander;
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [], marching: [] };
    
    var scout = null;
    var scoutCat = '';
    
    // Ищем разведчика по индексу
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (!scout && garrison[cat]) {
            var cnt = 0;
            for (var i = garrison[cat].length - 1; i >= 0; i--) {
                if (garrison[cat][i].location === commander.zoneId && garrison[cat][i].isScout) {
                    if (cnt === commander.scoutIndex) {
                        scout = garrison[cat].splice(i, 1)[0];
                        scoutCat = cat;
                        break;
                    }
                    cnt++;
                }
            }
        }
    });
    
    if (!scout) {
        setMessage('❌ Разведчик не найден.');
        return;
    }
    
    if (action === 'scout') {
        // Разведка: 50% успех
        if (Math.random() < 0.5) {
            // Успех — показываем инфу о врагах и возвращаем
            var enemies = findEnemiesInZone(targetZoneId, houseId);
            var enemyInfo = '🔍 РАЗВЕДКА УСПЕШНА!\n\nВраги в зоне:\n';
            if (enemies.length === 0) {
                enemyInfo += 'Нет вражеских войск.';
            } else {
                var enemyCount = {};
                enemies.forEach(function(e) {
                    var hh = HOUSES[e.house];
                    var name = hh ? hh.sigil + ' ' + hh.name : e.house;
                    if (!enemyCount[name]) enemyCount[name] = 0;
                    enemyCount[name]++;
                });
                for (var n in enemyCount) {
                    enemyInfo += n + ': ~' + enemyCount[n] + ' юнитов\n';
                }
            }
            
            // Возвращаем разведчика на домашнюю зону
            scout.location = scout.scoutHome || commander.zoneId;
            if (scoutCat === 'infantry') garrison.infantry.push(scout);
            else if (scoutCat === 'cavalry') garrison.cavalry.push(scout);
            else if (scoutCat === 'siege') garrison.siege.push(scout);
            
            saveData();
            alert(enemyInfo);
            setMessage('👁️ Разведка успешна! Разведчик вернулся.');
            addHouseLog(houseId, '👁️ Успешная разведка в ' + getZoneName(targetZoneId));
        } else {
            // Провал — разведчик убит
            saveData();
            setMessage('💀 Разведчик погиб при выполнении задания.');
            addHouseLog(houseId, '💀 Разведчик погиб в ' + getZoneName(targetZoneId));
        }
    } else {
        // Просто движение
        var arrivesAt = Date.now() + timeMinutes * 60 * 1000;
        var marchingEntry = {
            units: [scout],
            fromZone: commander.zoneId,
            targetZone: targetZoneId,
            action: 'move',
            arrivesAt: arrivesAt,
            departedAt: Date.now(),
            commander: currentUser,
            isScout: true
        };
        
        if (!garrison.marching) garrison.marching = [];
        garrison.marching.push(marchingEntry);
        
        saveData();
        setMessage('👁️ Разведчик выдвинулся. Прибудет через ' + timeMinutes + ' мин.');
        
        setTimeout(function() {
            processScoutArrival(marchingEntry, houseId, scoutCat);
        }, timeMinutes * 60 * 1000);
    }
    
    closeScoutAction();
    closeScoutTargetMap();
    openCommandMap();
};

function processScoutArrival(marchingEntry, houseId, cat) {
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : null;
    if (!garrison || !garrison.marching) return;
    
    var idx = garrison.marching.indexOf(marchingEntry);
    if (idx === -1) return;
    garrison.marching.splice(idx, 1);
    
    var unit = marchingEntry.units[0];
    if (!unit) return;
    
    unit.location = marchingEntry.targetZone;
    unit.isScout = true;
    if (!unit.scoutHome) unit.scoutHome = marchingEntry.fromZone;
    
    if (cat === 'infantry') garrison.infantry.push(unit);
    else if (cat === 'cavalry') garrison.cavalry.push(unit);
    else if (cat === 'siege') garrison.siege.push(unit);
    
    saveData();
    setMessage('👁️ Разведчик прибыл в ' + getZoneName(marchingEntry.targetZone));
    updateMenu();
}

// ============================================================
// 10. КАРТА ЦЕЛЕЙ ДЛЯ ОБЫЧНЫХ ВОЙСК
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
        h += '<p style="color:#ffd700;">Отправляется: ' + window.currentMovingCommander.name + '</p>';
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
// 11. ПОДТВЕРЖДЕНИЕ И ОТПРАВКА ВОЙСК
// ============================================================

window.confirmMovement = function(fromZoneId, targetZoneId, action, timeMinutes) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [], marching: [] };
    
    var takenUnits = [];
    var commander = window.currentMovingCommander;
    
    if (commander.type === 'commander') {
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (garrison[cat]) {
                for (var i = garrison[cat].length - 1; i >= 0; i--) {
                    var u = garrison[cat][i];
                    if (u.location === fromZoneId && u.commander === commander.name && !u.isScout) {
                        takenUnits.push(garrison[cat].splice(i, 1)[0]);
                    }
                }
            }
        });
        
        if (commander.rank === 'knight_commander' || commander.rank === 'captain_officer') {
            ['infantry','cavalry','siege'].forEach(function(cat) {
                if (garrison[cat]) {
                    for (var i = garrison[cat].length - 1; i >= 0; i--) {
                        var u = garrison[cat][i];
                        if (u.location === fromZoneId && u.commander && u.commander !== commander.name && !u.isScout && takenUnits.indexOf(u) === -1) {
                            takenUnits.push(garrison[cat].splice(i, 1)[0]);
                        }
                    }
                }
            });
        }
    } else if (commander.type === 'unattached') {
        var inputs = document.querySelectorAll('.unattached-count');
        inputs.forEach(function(inp) {
            var type = inp.getAttribute('data-type');
            var count = parseInt(inp.value) || 0;
            var taken = 0;
            ['infantry','cavalry','siege'].forEach(function(cat) {
                if (garrison[cat]) {
                    for (var i = garrison[cat].length - 1; i >= 0 && taken < count; i--) {
                        var u = garrison[cat][i];
                        if (u.location === fromZoneId && u.type === type && !u.commander && !u.isScout) {
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
// 12. ИНФО О ЗОНЕ
// ============================================================

function showZoneInfo(zoneId, zoneName, houseId) {
    var zone = WORLD_AREAS[zoneId];
    var enemies = [];
    
    for (var hid in window._castleGarrisons) {
        if (hid === houseId) continue;
        var g = window._castleGarrisons[hid];
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (g[cat]) {
                g[cat].forEach(function(u) {
                    if (u.location === zoneId && !u.isScout) enemies.push({ house: hid, unit: u });
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
// 13. ПРИБЫТИЕ И БОЙ
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
    
    var enemies = findEnemiesInZone(marchingEntry.targetZone, houseId);
    
    if (enemies.length > 0) {
        resolveBattle(units, enemies, marchingEntry.targetZone, houseId, action);
    } else {
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
        if (HOUSES[hid] && HOUSES[hid].liege === myHouseId) continue;
        var g = window._castleGarrisons[hid];
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (g[cat]) {
                g[cat].forEach(function(u) {
                    if (u.location === zoneId && u.stance === 'defending' && !u.isScout) enemies.push({ unit: u, house: hid });
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
    var defRoll = defPower * (0.8 + Math.random() * 0.4) * 1.2;
    
    var attackerGarrison = window._castleGarrisons[attackerHouseId];
    
    if (attRoll > defRoll) {
        var attLosses = Math.max(1, Math.floor(attackers.length * 0.3));
        var defLosses = defenders.length;
        
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
        
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (attackerGarrison[cat]) {
                for (var i = attackerGarrison[cat].length - 1; i >= 0; i--) {
                    if (attackers.indexOf(attackerGarrison[cat][i]) !== -1) {
                        attackerGarrison[cat].splice(i, 1);
                    }
                }
            }
        });
        
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
// 14. ВСПОМОГАТЕЛЬНЫЕ
// ============================================================

function getZoneName(zoneId) {
    var z = WORLD_AREAS[zoneId];
    return z ? z.name : zoneId;
}

window.closeCommandMap = function() { var m = document.getElementById('modal-command'); if (m) m.classList.add('hide'); };

window.toggleCommandCoords = function() {
    _showCommandCoords = !_showCommandCoords;
    document.getElementById('chk-command-coords').checked = _showCommandCoords;
    openCommandMap();
};

window.toggleCommandOwners = function() {
    _showCommandOwners = !_showCommandOwners;
    document.getElementById('chk-command-owners').checked = _showCommandOwners;
    openCommandMap();
};

// ============================================================
// 15. ТАЙМЕР ПРИ ЗАГРУЗКЕ
// ============================================================

window.restoreMarchingTimers = function() {
    for (var hid in window._castleGarrisons) {
        var g = window._castleGarrisons[hid];
        if (g.marching && g.marching.length > 0) {
            g.marching.forEach(function(m) {
                var timeLeft = m.arrivesAt - Date.now();
                if (timeLeft <= 0) {
                    if (m.isScout) {
                        var cat = m.units[0] && m.units[0].siege ? 'siege' : (m.units[0] && (m.units[0].horse || m.units[0].type === 'rider' || m.units[0].type === 'heavy_rider' || m.units[0].type === 'knight') ? 'cavalry' : 'infantry');
                        processScoutArrival(m, hid, cat);
                    } else {
                        processMarchArrival(m, hid);
                    }
                } else {
                    setTimeout(function() {
                        if (m.isScout) {
                            var cat = m.units[0] && m.units[0].siege ? 'siege' : (m.units[0] && (m.units[0].horse || m.units[0].type === 'rider' || m.units[0].type === 'heavy_rider' || m.units[0].type === 'knight') ? 'cavalry' : 'infantry');
                            processScoutArrival(m, hid, cat);
                        } else {
                            processMarchArrival(m, hid);
                        }
                    }, timeLeft);
                }
            });
        }
    }
};

// ============================================================
// 16. РЕГИСТРАЦИЯ
// ============================================================

window.openCommandMap = openCommandMap;
window.handleZoneClick = handleZoneClick;
window.closeOwnUnitsModal = closeOwnUnitsModal;
window.detachScout = detachScout;
window.selectCommanderForMove = selectCommanderForMove;
window.selectScoutForMove = selectScoutForMove;
window.selectUnattachedForMove = selectUnattachedForMove;
window.selectMoveTarget = selectMoveTarget;
window.selectScoutTarget = selectScoutTarget;
window.moveScout = moveScout;
window.confirmMovement = confirmMovement;
window.closeConfirmMove = closeConfirmMove;
window.closeMovementTargetMap = closeMovementTargetMap;
window.closeScoutTargetMap = closeScoutTargetMap;
window.closeScoutAction = closeScoutAction;
window.closeZoneInfo = closeZoneInfo;
window.toggleCommandCoords = toggleCommandCoords;
window.toggleCommandOwners = toggleCommandOwners;
window.processMarchArrival = processMarchArrival;
window.resolveBattle = resolveBattle;
window.restoreMarchingTimers = restoreMarchingTimers;

setTimeout(function() {
    if (typeof window._castleGarrisons !== 'undefined') restoreMarchingTimers();
}, 1000);

console.log('🎯 Командование + PvP + Разведка загружены!');

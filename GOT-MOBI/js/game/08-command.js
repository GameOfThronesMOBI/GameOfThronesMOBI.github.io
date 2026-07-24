// ============================================================
// js/game/08-command.js — КОМАНДОВАНИЕ + PvP + РАЗВЕДКА + АНИМАЦИЯ
// ПОЛНАЯ ВЕРСИЯ — ВСЕ ФУНКЦИИ
// ============================================================

window.closeZoneInfo = function() {
    var m = document.getElementById('modal-zone-info');
    if (m) m.classList.add('hide');
};

window._awaitingTarget = false;
window._targetData = null;
window._selectedUnitTypes = {};

// ============================================================
// ПОИСК ПУТИ (BFS) — 8 НАПРАВЛЕНИЙ
// ============================================================

function findPath(fromZoneId, toZoneId) {
    if (fromZoneId === toZoneId) return [fromZoneId];
    
    var visited = {};
    var queue = [[fromZoneId]];
    visited[fromZoneId] = true;
    
    while (queue.length > 0) {
        var path = queue.shift();
        var current = path[path.length - 1];
        
        if (current === toZoneId) return path;
        
        var currentZone = WORLD_AREAS[current];
        if (!currentZone) continue;
        
        var neighbors = getNeighborZones(currentZone);
        for (var i = 0; i < neighbors.length; i++) {
            var nid = neighbors[i];
            if (!visited[nid]) {
                visited[nid] = true;
                var newPath = path.slice();
                newPath.push(nid);
                queue.push(newPath);
            }
        }
    }
    
    return [fromZoneId, toZoneId];
}

function getNeighborZones(zone) {
    var neighbors = [];
    var dirs = [[0,-1],[0,1],[-1,0],[1,0],[-1,-1],[1,-1],[-1,1],[1,1]];
    for (var i = 0; i < dirs.length; i++) {
        var nx = zone.x + dirs[i][0];
        var ny = zone.y + dirs[i][1];
        for (var id in WORLD_AREAS) {
            var z = WORLD_AREAS[id];
            if (z.x === nx && z.y === ny) {
                var isWater = (z.type === 'river' || z.type === 'sea' || z.type === 'shallows' || z.type === 'abyss' || z.type === 'maelstrom' || z.type === 'bay' || z.type === 'reef');
                if (!isWater) neighbors.push(id);
                break;
            }
        }
    }
    return neighbors;
}

// ============================================================
// 1. КЛИК ПО ЗОНЕ НА КАРТЕ МИРА (ДЛЯ ВСЕХ)
// ============================================================

window.handleZoneClick = function(zoneId) {
    if (!zoneId) return;
    
    var user = users[currentUser];
    if (!user) return;
    
    var zone = WORLD_AREAS[zoneId];
    var zoneName = zone ? zone.name : zoneId;
    
    if (zone && (zone.type === 'river' || zone.type === 'sea' || zone.type === 'shallows' || zone.type === 'abyss' || zone.type === 'maelstrom' || zone.type === 'bay' || zone.type === 'reef')) return;
    
    var houseId = user.game.house;
    
    // ============================================================
    // РЕЖИМ ВЫБОРА ЦЕЛИ
    // ============================================================
    if (window._awaitingTarget && houseId) {
        var fromZone = WORLD_AREAS[window._targetData.fromZone];
        var fromX = fromZone ? fromZone.x : 0;
        var fromY = fromZone ? fromZone.y : 0;
        var toX = zone ? zone.x : 0;
        var toY = zone ? zone.y : 0;
        var dist = Math.abs(toX - fromX) + Math.abs(toY - fromY);
        var isWater = zone && (zone.type === 'river' || zone.type === 'sea' || zone.type === 'shallows');
        var targetZoneId = zoneId;
        
        if (isWater) {
            setMessage('⛵ Нельзя отправить войска на воду.');
            return;
        }
        
        var isOwnZone = zone && zone.owner === houseId;
        
        var speed = 2;
        if (window._targetData.isScout) speed = 2;
        var timeMinutes = dist * speed;
        
        var actions = [];
        actions.push({ id: 'move', label: '🚶 Идти (~' + timeMinutes + ' мин)', desc: 'Переместиться в зону' });
        
        if (window._targetData.isScout) {
            var hasEnemy = false;
            for (var hid in window._castleGarrisons) {
                if (hid === houseId) continue;
                var g = window._castleGarrisons[hid];
                ['infantry','cavalry','siege'].forEach(function(cat) {
                    if (g[cat]) {
                        g[cat].forEach(function(u) {
                            if (u.location === targetZoneId && !u.isScout) hasEnemy = true;
                        });
                    }
                });
            }
            if (hasEnemy) {
                actions.push({ id: 'scout', label: '🔍 Разведка (50% риск)', desc: 'Разведчик может погибнуть, но узнает состав врага' });
            }
        } else {
            if (isOwnZone) {
                actions.push({ id: 'defend', label: '🛡️ Защита', desc: 'Занять оборону в зоне' });
            } else {
                actions.push({ id: 'attack', label: '⚔️ Атака', desc: 'Атаковать и захватить зону' });
            }
        }
        
        var targetZoneName = zoneName;
        var fromZoneName = fromZone ? fromZone.name : window._targetData.fromZone;
        
        var modal = document.getElementById('modal-confirm-move');
        if (!modal) {
            var overlay = document.createElement('div');
            overlay.id = 'modal-confirm-move';
            overlay.className = 'modal-overlay hide';
            overlay.onclick = function(e) { if (e.target === this) window.closeConfirmMove(); };
            overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📋 ПОДТВЕРЖДЕНИЕ</h3><button class="close-btn" onclick="window.closeConfirmMove()">✕</button></div><div id="modal-confirm-move-content"></div></div>';
            document.body.appendChild(overlay);
            modal = overlay;
        }
        
        var content = document.getElementById('modal-confirm-move-content');
        var h = '<div class="modal-section"><h4>🎯 ' + fromZoneName + ' → ' + targetZoneName + '</h4>';
        h += '<p style="color:#6a5a48;">Дистанция: ' + dist + ' зон (~' + timeMinutes + ' мин)</p>';
        h += '<p style="color:#6a5a48;">Владелец цели: ' + (zone && zone.owner ? zone.owner : 'ничья') + '</p>';
        
        if (window._targetData.isScout) {
            h += '<p style="color:#ffd700;">👁️ Отправляется разведчик</p>';
        } else if (window._targetData.commander) {
            h += '<p style="color:#ffd700;">Отправляется: ' + window.currentMovingCommander.name + '</p>';
        }
        
        h += '</div><div class="modal-section"><h4>⚡ ДЕЙСТВИЕ</h4>';
        actions.forEach(function(a) {
            h += '<button class="btn btn-game" onclick="window.confirmTarget(\'' + targetZoneId + '\',\'' + a.id + '\',' + timeMinutes + ')" style="margin:4px 0;">' + a.label + '</button><br>';
            h += '<span style="font-size:10px;color:#6a5a48;">' + a.desc + '</span><br>';
        });
        h += '</div><button class="btn btn-secondary" onclick="window.closeConfirmMove(); window._awaitingTarget=false;">Отмена</button>';
        
        content.innerHTML = h;
        modal.classList.remove('hide');
        return;
    }
    
    // ============================================================
    // ОБЫЧНЫЙ РЕЖИМ
    // ============================================================
    
    if (!houseId) {
        showZoneInfoPublic(zoneId, zoneName);
        return;
    }
    
    var ownUnits = getOwnUnitsInZone(zoneId, houseId);
    var enemyScouts = findEnemyScoutsInZone(zoneId, houseId);
    
    if (ownUnits.length === 0 && ownUnits.scouts.length === 0) {
        var enemies = findEnemiesInZone(zoneId, houseId);
        if (enemies.length > 0) {
            showEnemyInfo(zoneId, zoneName, enemies);
        } else if (enemyScouts.length > 0) {
            showZoneInfoPublic(zoneId, zoneName);
        } else {
            showZoneInfoPublic(zoneId, zoneName);
        }
        return;
    }
    
    if (ownUnits.scouts.length > 0 && enemyScouts.length > 0) {
        showOwnUnitsModal(zoneId, zoneName, ownUnits, houseId, enemyScouts);
        return;
    }
    
    showOwnUnitsModal(zoneId, zoneName, ownUnits, houseId, []);
};

// ============================================================
// 1.5 ИНФО О ЗОНЕ ДЛЯ ВСЕХ
// ============================================================

function showZoneInfoPublic(zoneId, zoneName) {
    var zone = WORLD_AREAS[zoneId];
    
    var modal = document.getElementById('modal-zone-info');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-zone-info';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) window.closeZoneInfo(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📍 ЗОНА</h3><button class="close-btn" onclick="window.closeZoneInfo()">✕</button></div><div id="modal-zone-info-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-zone-info-content');
    var h = '<div class="modal-section"><h4>📍 ' + zoneName + '</h4>';
    
    if (zone) {
        h += '<div class="row"><span class="label">Тип</span><span class="value">' + (zone.type || '?') + '</span></div>';
        h += '<div class="row"><span class="label">Уровень</span><span class="value">' + (zone.level || 1) + '</span></div>';
        h += '<div class="row"><span class="label">Владелец</span><span class="value">';
        if (zone.owner === 'crown') h += '👑 Корона';
        else if (zone.owner === 'none' || !zone.owner) h += 'Ничья';
        else if (HOUSES[zone.owner]) h += HOUSES[zone.owner].sigil + ' ' + HOUSES[zone.owner].name;
        else h += zone.owner;
        h += '</span></div>';
        
        if (zone.places && zone.places.length > 0) {
            h += '<div class="row"><span class="label">Места</span><span class="value">' + zone.places.join(', ') + '</span></div>';
        }
        
        if (zone.actions && zone.actions.length > 0) {
            h += '<div class="row"><span class="label">Действия</span><span class="value">';
            zone.actions.forEach(function(a) {
                if (a.id === 'enter_city') h += '🚶 Войти в город';
                if (a.id === 'enter_buckler_castle') h += '🏰 Войти в замок';
            });
            h += '</span></div>';
        }
        
        if (zone.x !== undefined && zone.y !== undefined) {
            h += '<div class="row"><span class="label">Координаты</span><span class="value">[' + zone.x + ', ' + zone.y + ']</span></div>';
        }
    }
    
    h += '</div>';
    h += '<button class="btn btn-secondary" onclick="window.closeZoneInfo()">Закрыть</button>';
    
    content.innerHTML = h;
    modal.classList.remove('hide');
};

// ============================================================
// 1.6 ИНФО О ВРАГАХ
// ============================================================

function showEnemyInfo(zoneId, zoneName, enemies) {
    var modal = document.getElementById('modal-zone-info');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-zone-info';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) window.closeZoneInfo(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📍 ЗОНА</h3><button class="close-btn" onclick="window.closeZoneInfo()">✕</button></div><div id="modal-zone-info-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-zone-info-content');
    var h = '<div class="modal-section"><h4>📍 ' + zoneName + '</h4>';
    h += '<p style="color:#c96a5a;">🔴 ОБНАРУЖЕНЫ ВРАГИ</p>';
    
    var enemyCount = {};
    enemies.forEach(function(e) {
        var hh = HOUSES[e.house];
        var name = hh ? hh.sigil + ' ' + hh.name : e.house;
        if (!enemyCount[name]) enemyCount[name] = 0;
        enemyCount[name]++;
    });
    
    for (var n in enemyCount) {
        h += '<div class="row"><span class="label">' + n + '</span><span class="value">~' + enemyCount[n] + ' юнитов</span></div>';
    }
    
    h += '</div>';
    h += '<button class="btn btn-secondary" onclick="window.closeZoneInfo()">Закрыть</button>';
    
    content.innerHTML = h;
    modal.classList.remove('hide');
};

// ============================================================
// 2. СБОР СВОИХ ВОЙСК В ЗОНЕ (ВКЛЮЧАЯ ГАРНИЗОН ЗАМКА)
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
    
    var zone = WORLD_AREAS[zoneId];
    var isCastle = zone && (zone.type === 'castle' || zone.type === 'castle_gate');
    
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (garrison[cat]) {
            garrison[cat].forEach(function(u, idx) {
                if (u.location === zoneId || (isCastle && u.location === 'castle')) {
                    allUnits.push({ unit: u, category: cat, index: idx });
                }
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
// 2.5 ПОИСК ВРАЖЕСКИХ РАЗВЕДЧИКОВ
// ============================================================

function findEnemyScoutsInZone(zoneId, myHouseId) {
    var scouts = [];
    for (var hid in window._castleGarrisons) {
        if (hid === myHouseId) continue;
        if (HOUSES[hid] && HOUSES[hid].liege === myHouseId) continue;
        var g = window._castleGarrisons[hid];
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (g[cat]) {
                g[cat].forEach(function(u) {
                    if (u.location === zoneId && u.isScout) scouts.push({ unit: u, house: hid });
                });
            }
        });
    }
    return scouts;
}

// ============================================================
// 3. МОДАЛКА СВОИХ ВОЙСК
// ============================================================

window.currentMovingCommander = null;

window.closeOwnUnitsModal = function() {
    var m = document.getElementById('modal-own-units');
    if (m) m.classList.add('hide');
};

function showOwnUnitsModal(zoneId, zoneName, ownUnits, houseId, enemyScouts) {
    var modal = document.getElementById('modal-own-units');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-own-units';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) window.closeOwnUnitsModal(); };
        overlay.innerHTML = '<div class="modal-box" style="max-height:90vh;overflow-y:auto;"><div class="modal-header"><h3>⚔️ ВОЙСКА В ЗОНЕ</h3><button class="close-btn" onclick="window.closeOwnUnitsModal()">✕</button></div><div id="modal-own-units-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-own-units-content');
    var html = '<div class="modal-section"><h4>📍 ' + zoneName + '</h4>';
    html += '<p style="color:#6a5a48;">Выберите отряд для отправки или отделите разведчика</p></div>';
    
    // Вражеские разведчики
    if (enemyScouts && enemyScouts.length > 0) {
        html += '<div class="modal-section"><h4>👁️ ОБНАРУЖЕНЫ ВРАЖЕСКИЕ РАЗВЕДЧИКИ</h4>';
        enemyScouts.forEach(function(es, i) {
            var hh = HOUSES[es.house];
            var houseName = hh ? hh.sigil + ' ' + hh.name : es.house;
            html += '<div class="row" style="padding:8px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label">👁️ Разведчик ' + houseName + '</span>';
            html += '<span class="value"><button class="btn btn-small" style="background:#5a2020;" onclick="window.attackEnemyScout(\'' + zoneId + '\',' + i + ')">⚔️ Атаковать (50%)</button></span>';
            html += '</div>';
        });
        html += '</div>';
    }
    
    // Свои разведчики
    if (ownUnits.scouts.length > 0) {
        html += '<div class="modal-section"><h4>👁️ РАЗВЕДЧИКИ</h4>';
        ownUnits.scouts.forEach(function(item, i) {
            var u = item.unit;
            var ut = window.UNIT_TYPES ? window.UNIT_TYPES[u.type] : null;
            html += '<div class="row" style="padding:8px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label">👁️ Разведчик (' + (ut ? ut.emoji + ' ' + ut.name : u.type) + ')</span>';
            html += '<span class="value">';
            html += '<button class="btn btn-small" onclick="window.selectScoutForMove(\'' + zoneId + '\',' + i + ')">🚶 Двигать</button> ';
            if (ownUnits.unattached.length > 0 || ownUnits.sergeants.length > 0 || ownUnits.captains.length > 0 || ownUnits.commanders.length > 0) {
                html += '<button class="btn btn-small" onclick="window.mergeScout(' + i + ',\'' + zoneId + '\')">🔗 В отряд</button>';
            }
            html += '</span>';
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
            html += '<span class="value"><button class="btn btn-small" onclick="window.selectCommanderForMove(\'' + zoneId + '\',\'knight_commander\',\'' + cmd.name + '\')">🚶 Отправить</button></span>';
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
            html += '<span class="value"><button class="btn btn-small" onclick="window.selectCommanderForMove(\'' + zoneId + '\',\'captain_officer\',\'' + cap.name + '\')">🚶 Отправить</button></span>';
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
            html += '<span class="value"><button class="btn btn-small" onclick="window.selectCommanderForMove(\'' + zoneId + '\',\'sergeant\',\'' + sgt.name + '\')">🚶 Отправить</button></span>';
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
        
        if (!window._selectedUnitTypes) window._selectedUnitTypes = {};
        
        for (var t in unitTypes) {
            var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
            window._selectedUnitTypes[t] = unitTypes[t];
            html += '<div class="row" style="padding:8px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label">' + (ut ? ut.emoji + ' ' + ut.name : t) + '</span>';
            html += '<span class="value">×' + unitTypes[t] + ' <input type="number" class="unattached-count" data-type="' + t + '" value="' + unitTypes[t] + '" min="1" max="' + unitTypes[t] + '" style="width:50px;padding:2px;" onchange="window._selectedUnitTypes[\'' + t + '\'] = parseInt(this.value) || 0;"></span>';
            html += '</div>';
        }
        html += '<button class="btn btn-small" onclick="window.selectUnattachedForMove(\'' + zoneId + '\')">🚶 Отправить выбранных</button>';
        html += '<button class="btn btn-small" onclick="window.detachScout(\'' + zoneId + '\')" style="margin-left:4px;">👁️ Отделить разведчика</button>';
        html += '</div>';
    }
    
    html += '</div>';
    html += '<button class="btn btn-secondary" onclick="window.closeOwnUnitsModal()" style="margin-top:10px;">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
};

// ============================================================
// 3.5 АТАКА ВРАЖЕСКОГО РАЗВЕДЧИКА
// ============================================================

window.attackEnemyScout = function(zoneId, enemyIndex) {
    var user = users[currentUser];
    var houseId = user.game.house;
    
    var enemyScouts = findEnemyScoutsInZone(zoneId, houseId);
    if (enemyIndex >= enemyScouts.length) {
        setMessage('❌ Разведчик не найден.');
        return;
    }
    
    var enemy = enemyScouts[enemyIndex];
    var enemyHouse = enemy.house;
    
    if (Math.random() < 0.5) {
        var enemyGarrison = window._castleGarrisons[enemyHouse];
        if (enemyGarrison) {
            ['infantry','cavalry','siege'].forEach(function(cat) {
                if (enemyGarrison[cat]) {
                    for (var i = enemyGarrison[cat].length - 1; i >= 0; i--) {
                        if (enemyGarrison[cat][i] === enemy.unit) {
                            enemyGarrison[cat].splice(i, 1);
                            break;
                        }
                    }
                }
            });
        }
        saveData();
        setMessage('⚔️ Вражеский разведчик уничтожен!');
        addHouseLog(houseId, '⚔️ Разведчик уничтожил вражеского разведчика в ' + getZoneName(zoneId));
    } else {
        var ownGarrison = window._castleGarrisons[houseId];
        if (ownGarrison) {
            ['infantry','cavalry','siege'].forEach(function(cat) {
                if (ownGarrison[cat]) {
                    for (var i = ownGarrison[cat].length - 1; i >= 0; i--) {
                        if (ownGarrison[cat][i].location === zoneId && ownGarrison[cat][i].isScout) {
                            ownGarrison[cat].splice(i, 1);
                            break;
                        }
                    }
                }
            });
        }
        saveData();
        setMessage('💀 Ваш разведчик убит вражеским разведчиком!');
        addHouseLog(houseId, '💀 Разведчик убит вражеским разведчиком в ' + getZoneName(zoneId));
    }
    
    window.closeOwnUnitsModal();
    updateMenu();
};

// ============================================================
// 3.6 ОБЪЕДИНЕНИЕ РАЗВЕДЧИКА С ОТРЯДОМ
// ============================================================

window.mergeScout = function(scoutIndex, zoneId) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [] };
    
    var scout = null;
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (!scout && garrison[cat]) {
            var cnt = 0;
            for (var i = garrison[cat].length - 1; i >= 0; i--) {
                if (garrison[cat][i].location === zoneId && garrison[cat][i].isScout) {
                    if (cnt === scoutIndex) {
                        scout = garrison[cat][i];
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
    
    scout.isScout = false;
    scout.scoutHome = null;
    saveData();
    window.closeOwnUnitsModal();
    setMessage('✅ Разведчик возвращён в отряд.');
    addHouseLog(houseId, '👁️➡️⚔️ Разведчик возвращён в отряд в ' + getZoneName(zoneId));
};

// ============================================================
// 4. ОТДЕЛЕНИЕ РАЗВЕДЧИКА
// ============================================================

window.detachScout = function(zoneId) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [] };
    
    var zone = WORLD_AREAS[zoneId];
    var isCastle = zone && (zone.type === 'castle' || zone.type === 'castle_gate');
    
    var scout = null;
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (!scout && garrison[cat]) {
            for (var i = garrison[cat].length - 1; i >= 0; i--) {
                var u = garrison[cat][i];
                if ((u.location === zoneId || (isCastle && u.location === 'castle')) && !u.commander && !u.isScout) {
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
    scout.scoutHome = isCastle ? 'castle' : zoneId;
    
    if (scout.siege) garrison.siege.push(scout);
    else if (scout.horse || scout.type === 'rider' || scout.type === 'heavy_rider' || scout.type === 'knight') garrison.cavalry.push(scout);
    else garrison.infantry.push(scout);
    
    saveData();
    window.closeOwnUnitsModal();
    setMessage('👁️ Разведчик отделён от отряда.');
    addHouseLog(houseId, '👁️ Разведчик отделён в ' + getZoneName(zoneId));
};

// ============================================================
// 5. ВЫБОР ДЛЯ ОТПРАВКИ
// ============================================================

window.selectCommanderForMove = function(zoneId, rank, name) {
    window.currentMovingCommander = { zoneId: zoneId, rank: rank, name: name, type: 'commander' };
    window._awaitingTarget = true;
    window._targetData = { fromZone: zoneId, isScout: false, commander: true };
    window.closeOwnUnitsModal();
    setMessage('🎯 Выберите целевую зону на карте.');
};

window.selectScoutForMove = function(zoneId, scoutIndex) {
    window.currentMovingCommander = { zoneId: zoneId, type: 'scout', scoutIndex: scoutIndex };
    window._awaitingTarget = true;
    window._targetData = { fromZone: zoneId, isScout: true, scoutIndex: scoutIndex };
    window.closeOwnUnitsModal();
    setMessage('🎯 Выберите целевую зону на карте.');
};

window.selectUnattachedForMove = function(zoneId) {
    window.currentMovingCommander = { zoneId: zoneId, type: 'unattached' };
    window._awaitingTarget = true;
    window._targetData = { fromZone: zoneId, isScout: false, commander: false };
    window.closeOwnUnitsModal();
    setMessage('🎯 Выберите целевую зону на карте.');
};

// ============================================================
// 6. ПОДТВЕРЖДЕНИЕ ЦЕЛИ
// ============================================================

window.confirmTarget = function(targetZoneId, action, timeMinutes) {
    var data = window._targetData;
    if (!data) {
        setMessage('❌ Нет данных для отправки.');
        return;
    }
    
    var isScout = data.isScout;
    
    window._awaitingTarget = false;
    window._targetData = null;
    
    window.confirmMovement(data.fromZone, targetZoneId, action, timeMinutes, isScout);
    
    window.closeConfirmMove();
};

window.closeConfirmMove = function() {
    var m = document.getElementById('modal-confirm-move');
    if (m) m.classList.add('hide');
};

// ============================================================
// 7. ОТПРАВКА ВОЙСК С АНИМАЦИЕЙ
// ============================================================

window.confirmMovement = function(fromZoneId, targetZoneId, action, timeMinutes, isScout) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [], marching: [] };
    
    var takenUnits = [];
    var commander = window.currentMovingCommander;
    
    if (!isScout) isScout = false;
    
    var zone = WORLD_AREAS[fromZoneId];
    var isCastle = zone && (zone.type === 'castle' || zone.type === 'castle_gate');
    
    // Собираем юнитов
    if (commander.type === 'commander') {
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (garrison[cat]) {
                for (var i = garrison[cat].length - 1; i >= 0; i--) {
                    var u = garrison[cat][i];
                    if ((u.location === fromZoneId || (isCastle && u.location === 'castle')) && u.commander === commander.name && !u.isScout) {
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
                        if ((u.location === fromZoneId || (isCastle && u.location === 'castle')) && u.commander && u.commander !== commander.name && !u.isScout && takenUnits.indexOf(u) === -1) {
                            takenUnits.push(garrison[cat].splice(i, 1)[0]);
                        }
                    }
                }
            });
        }
    } else if (commander.type === 'unattached') {
        var selectedTypes = window._selectedUnitTypes || {};
        for (var type in selectedTypes) {
            var count = selectedTypes[type];
            var taken = 0;
            ['infantry','cavalry','siege'].forEach(function(cat) {
                if (garrison[cat]) {
                    for (var i = garrison[cat].length - 1; i >= 0 && taken < count; i--) {
                        var u = garrison[cat][i];
                        if ((u.location === fromZoneId || (isCastle && u.location === 'castle')) && u.type === type && !u.commander && !u.isScout) {
                            takenUnits.push(garrison[cat].splice(i, 1)[0]);
                            taken++;
                        }
                    }
                }
            });
        }
        window._selectedUnitTypes = {};
    } else if (commander.type === 'scout') {
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (!takenUnits.length && garrison[cat]) {
                var cnt = 0;
                for (var i = garrison[cat].length - 1; i >= 0; i--) {
                    var u = garrison[cat][i];
                    if ((u.location === commander.zoneId || (isCastle && u.location === 'castle')) && garrison[cat][i].isScout) {
                        if (cnt === commander.scoutIndex) {
                            takenUnits.push(garrison[cat].splice(i, 1)[0]);
                            break;
                        }
                        cnt++;
                    }
                }
            }
        });
    }
    
    if (takenUnits.length === 0) {
        setMessage('❌ Не удалось забрать юнитов.');
        return;
    }
    
    // Определяем скорость по типу войск
    var speedPerZone = 2;
    if (!isScout && takenUnits.length > 0) {
        var hasCavalry = false, hasSiege = false, hasInfantry = false;
        takenUnits.forEach(function(u) {
            if (u.siege) hasSiege = true;
            else if (u.horse || u.type === 'rider' || u.type === 'heavy_rider' || u.type === 'knight') hasCavalry = true;
            else hasInfantry = true;
        });
        if (hasSiege) speedPerZone = 5;
        else if (hasCavalry && !hasInfantry) speedPerZone = 1;
    }
    
    // Строим путь
    var path = findPath(fromZoneId, targetZoneId);
    
    // Время движения одной зоны в миллисекундах
    var moveTimeMs = speedPerZone * 60 * 1000;
    var waitTimeMs = 10000;
    
    // Создаём запись марша
    var marchId = 'march_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    var marchData = {
        id: marchId,
        units: takenUnits,
        path: path,
        currentStep: 0,
        action: action,
        houseId: houseId,
        speedPerZone: speedPerZone,
        moveTimeMs: moveTimeMs,
        waitTimeMs: waitTimeMs,
        phase: 'waiting',
        nextPhaseTime: Date.now() + waitTimeMs,
        isScout: isScout
    };
    
    if (!garrison.marching) garrison.marching = [];
    garrison.marching.push(marchData);
    
    saveData();
    
    setMessage('✅ Отряд выступил! ' + takenUnits.length + ' юнитов, ' + (path.length - 1) + ' зон.');
    addHouseLog(houseId, '🚶 ' + currentUser + ' отправил ' + takenUnits.length + ' юнитов в ' + getZoneName(targetZoneId));
    
    processMarchStep(marchId);
};

// ============================================================
// 8. ПОШАГОВОЕ ДВИЖЕНИЕ
// ============================================================

function processMarchStep(marchId) {
    var marchData = null;
    var garrison = null;
    
    for (var hid in window._castleGarrisons) {
        var g = window._castleGarrisons[hid];
        if (g.marching) {
            for (var i = 0; i < g.marching.length; i++) {
                if (g.marching[i].id === marchId) {
                    marchData = g.marching[i];
                    garrison = g;
                    break;
                }
            }
        }
        if (marchData) break;
    }
    
    if (!marchData) return;
    
    var now = Date.now();
    
    if (now < marchData.nextPhaseTime) {
        setTimeout(function() { processMarchStep(marchId); }, marchData.nextPhaseTime - now);
        return;
    }
    
    // ============================================================
    // Фаза WAITING — отряд стоял на зоне, начинаем движение
    // ============================================================
    if (marchData.phase === 'waiting') {
        marchData.phase = 'moving';
        marchData.nextPhaseTime = Date.now() + marchData.moveTimeMs;
        
        saveData();
        updateMenu();
        
        setTimeout(function() { processMarchStep(marchId); }, marchData.moveTimeMs);
        return;
    }
    
    // ============================================================
    // Фаза MOVING — отряд двигался, прибыл на следующую зону
    // ============================================================
    if (marchData.phase === 'moving') {
        marchData.currentStep++;
        
        // Проверяем — не прибыли ли?
        if (marchData.currentStep >= marchData.path.length - 1) {
            // Прибытие
            var idx = garrison.marching.indexOf(marchData);
            if (idx !== -1) garrison.marching.splice(idx, 1);
            
            var targetZone = WORLD_AREAS[marchData.path[marchData.path.length - 1]];
            var action = marchData.action;
            var units = marchData.units;
            
            if (marchData.isScout && action === 'scout') {
                // Разведка
                if (Math.random() < 0.5) {
                    var enemies = findEnemiesInZone(targetZone.id, marchData.houseId);
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
                    
                    var homeZone = units[0].scoutHome || marchData.path[0];
                    units.forEach(function(u) {
                        u.location = homeZone;
                        u.isScout = true;
                        returnUnit(u, window._castleGarrisons[marchData.houseId]);
                    });
                    saveData();
                    alert(enemyInfo);
                    setMessage('👁️ Разведка успешна! Разведчик вернулся.');
                    addHouseLog(marchData.houseId, '👁️ Успешная разведка в ' + getZoneName(targetZone.id));
                } else {
                    saveData();
                    setMessage('💀 Разведчик погиб при выполнении задания.');
                    addHouseLog(marchData.houseId, '💀 Разведчик погиб в ' + getZoneName(targetZone.id));
                }
            } else {
                // Обычный отряд или разведчик в режиме движения
                var enemies = findEnemiesInZone(targetZone.id, marchData.houseId);
                if (enemies.length > 0) {
                    resolveBattle(units, enemies, targetZone.id, marchData.houseId, action);
                } else {
                    if (action === 'attack' && targetZone) {
                        targetZone.owner = marchData.houseId;
                    }
                    var isCastleZone = targetZone && (targetZone.type === 'castle' || targetZone.type === 'castle_gate');
                    units.forEach(function(u) {
                        u.location = isCastleZone ? 'castle' : targetZone.id;
                        u.stance = action === 'defend' ? 'defending' : 'moving';
                        if (marchData.isScout) { u.isScout = true; u.scoutHome = u.scoutHome || marchData.path[0]; }
                        returnUnit(u, window._castleGarrisons[marchData.houseId]);
                    });
                    saveData();
                    setMessage('✅ Отряд прибыл в ' + getZoneName(targetZone.id));
                    addHouseLog(marchData.houseId, '🚶 Отряд прибыл в ' + getZoneName(targetZone.id));
                }
            }
            
            updateMenu();
            return;
        }
        
        // Ещё не конец пути — начинаем ждать на промежуточной зоне
        marchData.phase = 'waiting';
        marchData.nextPhaseTime = Date.now() + marchData.waitTimeMs;
        
        saveData();
        updateMenu();
        
        setTimeout(function() { processMarchStep(marchId); }, marchData.waitTimeMs);
        return;
    }
}

function returnUnit(u, garrison) {
    if (u.siege) garrison.siege.push(u);
    else if (u.horse || u.type === 'rider' || u.type === 'heavy_rider' || u.type === 'knight') garrison.cavalry.push(u);
    else garrison.infantry.push(u);
}

// ============================================================
// 9. БОЙ
// ============================================================

function findEnemiesInZone(zoneId, myHouseId) {
    var enemies = [];
    for (var hid in window._castleGarrisons) {
        if (hid === myHouseId) continue;
        if (HOUSES[hid] && HOUSES[hid].liege === myHouseId) continue;
        var g = window._castleGarrisons[hid];
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (g[cat]) {
                g[cat].forEach(function(u) {
                    if (u.location === zoneId && u.stance === 'defending' && !u.isScout) {
                        enemies.push({ unit: u, house: hid });
                    }
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
        
        for (var hid in window._castleGarrisons) {
            var g = window._castleGarrisons[hid];
            ['infantry','cavalry','siege'].forEach(function(cat) {
                if (g[cat]) {
                    for (var i = g[cat].length - 1; i >= 0; i--) {
                        if (g[cat][i].location === zoneId && g[cat][i].stance === 'defending') {
                            g[cat].splice(i, 1);
                        }
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
        
        if (action === 'attack' && WORLD_AREAS[zoneId]) {
            WORLD_AREAS[zoneId].owner = attackerHouseId;
        }
        
        var targetZone = WORLD_AREAS[zoneId];
        var isCastleZone = targetZone && (targetZone.type === 'castle' || targetZone.type === 'castle_gate');
        attackers.forEach(function(u) {
            if (u.location !== undefined) {
                u.location = isCastleZone ? 'castle' : zoneId;
                u.stance = 'moving';
                returnUnit(u, attackerGarrison);
            }
        });
        
        saveData();
        setMessage('⚔️ ПОБЕДА! Потери: ' + attLosses + ' vs ' + defenders.length);
        addHouseLog(attackerHouseId, '⚔️ Победа в ' + getZoneName(zoneId) + ' (-' + attLosses + ' юнитов)');
    } else {
        var defLosses = Math.max(1, Math.floor(defenders.length * 0.2));
        
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
        addHouseLog(attackerHouseId, '🛡️ Поражение в ' + getZoneName(zoneId) + ' (-' + attackers.length + ' юнитов)');
    }
    
    updateMenu();
}

// ============================================================
// 10. ВСПОМОГАТЕЛЬНЫЕ
// ============================================================

function getZoneName(zoneId) {
    var z = WORLD_AREAS[zoneId];
    return z ? z.name : zoneId;
}

// ============================================================
// 11. ТАЙМЕР ПРИ ЗАГРУЗКЕ
// ============================================================

window.restoreMarchingTimers = function() {
    for (var hid in window._castleGarrisons) {
        var g = window._castleGarrisons[hid];
        if (g.marching && g.marching.length > 0) {
            // Удаляем старые марши без path
            g.marching = g.marching.filter(function(m) { return m.path; });
            // Запускаем оставшиеся
            g.marching.forEach(function(m) {
                processMarchStep(m.id);
            });
        }
    }
};

// ============================================================
// 12. РЕГИСТРАЦИЯ
// ============================================================

window.handleZoneClick = handleZoneClick;
window.closeOwnUnitsModal = closeOwnUnitsModal;
window.attackEnemyScout = attackEnemyScout;
window.mergeScout = mergeScout;
window.detachScout = detachScout;
window.selectCommanderForMove = selectCommanderForMove;
window.selectScoutForMove = selectScoutForMove;
window.selectUnattachedForMove = selectUnattachedForMove;
window.confirmMovement = confirmMovement;
window.confirmTarget = confirmTarget;
window.closeConfirmMove = closeConfirmMove;
window.closeZoneInfo = closeZoneInfo;
window.processMarchStep = processMarchStep;
window.resolveBattle = resolveBattle;
window.restoreMarchingTimers = restoreMarchingTimers;

setTimeout(function() {
    if (typeof window._castleGarrisons !== 'undefined') {
        restoreMarchingTimers();
    }
}, 1000);

console.log('🎯 Командование + PvP + Разведка + Марш загружены!');

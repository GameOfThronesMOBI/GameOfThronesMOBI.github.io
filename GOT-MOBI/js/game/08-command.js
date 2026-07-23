// ============================================================
// js/game/08-command.js — КОМАНДОВАНИЕ ВОЙСКАМИ + PvP + РАЗВЕДКА
// ПОЛНАЯ ВЕРСИЯ (ВЫБОР ЦЕЛИ НА ОСНОВНОЙ КАРТЕ)
// ============================================================

window.closeZoneInfo = function() {
    var m = document.getElementById('modal-zone-info');
    if (m) m.classList.add('hide');
};

window._awaitingTarget = false;
window._targetData = null;

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
    
    // Если ждём выбора цели
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
        var timeMinutes = window._targetData.isScout ? dist * 2 : dist * 5;
        
        var actions = [];
        actions.push({ id: 'move', label: '🚶 Идти (' + timeMinutes + ' мин)', desc: 'Переместиться в зону' });
        
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
                actions.push({ id: 'defend', label: '🛡️ Защита (' + timeMinutes + ' мин)', desc: 'Занять оборону в зоне' });
            } else {
                actions.push({ id: 'attack', label: '⚔️ Атака (' + timeMinutes + ' мин)', desc: 'Атаковать и захватить зону' });
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
    
    // Обычный режим
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
// ПОДТВЕРЖДЕНИЕ ЦЕЛИ И ОТПРАВКА
// ============================================================

window.confirmTarget = function(targetZoneId, action, timeMinutes) {
    var data = window._targetData;
    if (!data) { setMessage('❌ Нет данных для отправки.'); return; }
    
    window._awaitingTarget = false;
    window._targetData = null;
    
    if (data.isScout) {
        window.moveScout(targetZoneId, action, timeMinutes);
    } else {
        window.confirmMovement(data.fromZone, targetZoneId, action, timeMinutes);
    }
    
    window.closeConfirmMove();
};

window.closeConfirmMove = function() {
    var m = document.getElementById('modal-confirm-move');
    if (m) m.classList.add('hide');
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
// 2. СБОР СВОИХ ВОЙСК В ЗОНЕ
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
// 7. ДВИЖЕНИЕ РАЗВЕДЧИКА
// ============================================================

window.moveScout = function(targetZoneId, action, timeMinutes) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var commander = window.currentMovingCommander;
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [], marching: [] };
    
    var scout = null;
    var scoutCat = '';
    
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
        if (Math.random() < 0.5) {
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
            
            scout.location = scout.scoutHome || commander.zoneId;
            if (scoutCat === 'infantry') garrison.infantry.push(scout);
            else if (scoutCat === 'cavalry') garrison.cavalry.push(scout);
            else if (scoutCat === 'siege') garrison.siege.push(scout);
            
            saveData();
            alert(enemyInfo);
            setMessage('👁️ Разведка успешна! Разведчик вернулся.');
            addHouseLog(houseId, '👁️ Успешная разведка в ' + getZoneName(targetZoneId));
        } else {
            saveData();
            setMessage('💀 Разведчик погиб при выполнении задания.');
            addHouseLog(houseId, '💀 Разведчик погиб в ' + getZoneName(targetZoneId));
        }
    } else {
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
};

function processScoutArrival(marchingEntry, houseId, cat) {
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : null;
    if (!garrison || !garrison.marching) return;
    
    var idx = garrison.marching.indexOf(marchingEntry);
    if (idx === -1) return;
    garrison.marching.splice(idx, 1);
    
    var unit = marchingEntry.units[0];
    if (!unit) return;
    
    var enemyScouts = findEnemyScoutsInZone(marchingEntry.targetZone, houseId);
    if (enemyScouts.length > 0) {
        if (Math.random() < 0.5) {
            var enemyHouse = enemyScouts[0].house;
            var enemyGarrison = window._castleGarrisons[enemyHouse];
            if (enemyGarrison) {
                ['infantry','cavalry','siege'].forEach(function(c) {
                    if (enemyGarrison[c]) {
                        for (var i = enemyGarrison[c].length - 1; i >= 0; i--) {
                            if (enemyGarrison[c][i] === enemyScouts[0].unit) {
                                enemyGarrison[c].splice(i, 1);
                                break;
                            }
                        }
                    }
                });
            }
            unit.location = marchingEntry.targetZone;
            unit.isScout = true;
            if (!unit.scoutHome) unit.scoutHome = marchingEntry.fromZone;
            if (cat === 'infantry') garrison.infantry.push(unit);
            else if (cat === 'cavalry') garrison.cavalry.push(unit);
            else if (cat === 'siege') garrison.siege.push(unit);
            
            saveData();
            setMessage('⚔️ Разведчик уничтожил вражеского разведчика в ' + getZoneName(marchingEntry.targetZone));
            addHouseLog(houseId, '⚔️ Разведчик убил вражеского разведчика в ' + getZoneName(marchingEntry.targetZone));
        } else {
            saveData();
            setMessage('💀 Разведчик убит вражеским разведчиком в ' + getZoneName(marchingEntry.targetZone));
            addHouseLog(houseId, '💀 Разведчик убит вражеским разведчиком в ' + getZoneName(marchingEntry.targetZone));
        }
    } else {
        unit.location = marchingEntry.targetZone;
        unit.isScout = true;
        if (!unit.scoutHome) unit.scoutHome = marchingEntry.fromZone;
        if (cat === 'infantry') garrison.infantry.push(unit);
        else if (cat === 'cavalry') garrison.cavalry.push(unit);
        else if (cat === 'siege') garrison.siege.push(unit);
        
        saveData();
        setMessage('👁️ Разведчик прибыл в ' + getZoneName(marchingEntry.targetZone));
    }
    
    updateMenu();
}

// ============================================================
// 9. ПОДТВЕРЖДЕНИЕ И ОТПРАВКА ВОЙСК
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
    
    setMessage('✅ Отряд (' + takenUnits.length + ' юнитов) выступил. Прибудет через ' + timeMinutes + ' мин.');
    addHouseLog(houseId, '🚶 ' + currentUser + ' отправил ' + takenUnits.length + ' юнитов в ' + getZoneName(targetZoneId));
    
    setTimeout(function() {
        processMarchArrival(marchingEntry, houseId);
    }, timeMinutes * 60 * 1000);
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
    
    var enemies = findEnemiesInZone(marchingEntry.targetZone, houseId);
    
    if (enemies.length > 0) {
        resolveBattle(units, enemies, marchingEntry.targetZone, houseId, action);
    } else {
        if (action === 'attack' && targetZone) {
            targetZone.owner = houseId;
        }
        var isCastleZone = targetZone && (targetZone.type === 'castle' || targetZone.type === 'castle_gate');
        units.forEach(function(u) {
            u.location = isCastleZone ? 'castle' : marchingEntry.targetZone;
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
// 11. ВСПОМОГАТЕЛЬНЫЕ
// ============================================================

function getZoneName(zoneId) {
    var z = WORLD_AREAS[zoneId];
    return z ? z.name : zoneId;
}

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
// 13. РЕГИСТРАЦИЯ
// ============================================================

window.handleZoneClick = handleZoneClick;
window.closeOwnUnitsModal = closeOwnUnitsModal;
window.attackEnemyScout = attackEnemyScout;
window.mergeScout = mergeScout;
window.detachScout = detachScout;
window.selectCommanderForMove = selectCommanderForMove;
window.selectScoutForMove = selectScoutForMove;
window.selectUnattachedForMove = selectUnattachedForMove;
window.moveScout = moveScout;
window.confirmMovement = confirmMovement;
window.confirmTarget = confirmTarget;
window.closeConfirmMove = closeConfirmMove;
window.closeZoneInfo = closeZoneInfo;
window.processMarchArrival = processMarchArrival;
window.resolveBattle = resolveBattle;
window.restoreMarchingTimers = restoreMarchingTimers;

setTimeout(function() {
    if (typeof window._castleGarrisons !== 'undefined') restoreMarchingTimers();
}, 1000);

console.log('🎯 Командование + PvP + Разведка загружены!');

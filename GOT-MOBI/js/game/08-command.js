// ============================================================
// js/game/08-command.js — КОМАНДОВАНИЕ + PvP + РАЗВЕДКА + АНИМАЦИЯ
// ПОЛНАЯ ВЕРСИЯ
// ============================================================

window.closeZoneInfo = function() {
    var m = document.getElementById('modal-zone-info');
    if (m) m.classList.add('hide');
};

window._awaitingTarget = false;
window._targetData = null;
window._marchingMarkers = {};

// ============================================================
// ПОИСК ПУТИ (BFS)
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
    var dirs = [[0,-1],[0,1],[-1,0],[1,0]];
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
// 1. КЛИК ПО ЗОНЕ
// ============================================================

window.handleZoneClick = function(zoneId) {
    if (!zoneId) return;
    
    var user = users[currentUser];
    if (!user) return;
    
    var zone = WORLD_AREAS[zoneId];
    var zoneName = zone ? zone.name : zoneId;
    
    if (zone && (zone.type === 'river' || zone.type === 'sea' || zone.type === 'shallows' || zone.type === 'abyss' || zone.type === 'maelstrom' || zone.type === 'bay' || zone.type === 'reef')) return;
    
    var houseId = user.game.house;
    
    if (window._awaitingTarget && houseId) {
        var fromZone = WORLD_AREAS[window._targetData.fromZone];
        var fromX = fromZone ? fromZone.x : 0;
        var fromY = fromZone ? fromZone.y : 0;
        var toX = zone ? zone.x : 0;
        var toY = zone ? zone.y : 0;
        var dist = Math.abs(toX - fromX) + Math.abs(toY - fromY);
        var isWater = zone && (zone.type === 'river' || zone.type === 'sea' || zone.type === 'shallows');
        var targetZoneId = zoneId;
        
        if (isWater) { setMessage('⛵ Нельзя отправить войска на воду.'); return; }
        
        var isOwnZone = zone && zone.owner === houseId;
        
        var speed = 2;
        if (window._targetData.isScout) speed = 2;
        else if (window._targetData.commander) speed = 2;
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
                actions.push({ id: 'scout', label: '🔍 Разведка (50% риск)', desc: 'Разведчик может погибнуть' });
            }
        } else {
            if (isOwnZone) {
                actions.push({ id: 'defend', label: '🛡️ Защита', desc: 'Занять оборону' });
            } else {
                actions.push({ id: 'attack', label: '⚔️ Атака', desc: 'Атаковать и захватить' });
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
        h += '<p style="color:#6a5a48;">Дистанция: ' + dist + ' зон</p>';
        h += '<p style="color:#6a5a48;">Владелец: ' + (zone && zone.owner ? zone.owner : 'ничья') + '</p>';
        h += '</div><div class="modal-section"><h4>⚡ ДЕЙСТВИЕ</h4>';
        actions.forEach(function(a) {
            h += '<button class="btn btn-game" onclick="window.confirmTarget(\'' + targetZoneId + '\',\'' + a.id + '\',' + timeMinutes + ')" style="margin:4px 0;">' + a.label + '</button><br>';
        });
        h += '</div><button class="btn btn-secondary" onclick="window.closeConfirmMove(); window._awaitingTarget=false;">Отмена</button>';
        
        content.innerHTML = h;
        modal.classList.remove('hide');
        return;
    }
    
    if (!houseId) { showZoneInfoPublic(zoneId, zoneName); return; }
    
    var ownUnits = getOwnUnitsInZone(zoneId, houseId);
    var enemyScouts = findEnemyScoutsInZone(zoneId, houseId);
    
    if (ownUnits.length === 0 && ownUnits.scouts.length === 0) {
        var enemies = findEnemiesInZone(zoneId, houseId);
        if (enemies.length > 0) showEnemyInfo(zoneId, zoneName, enemies);
        else showZoneInfoPublic(zoneId, zoneName);
        return;
    }
    
    if (ownUnits.scouts.length > 0 && enemyScouts.length > 0) {
        showOwnUnitsModal(zoneId, zoneName, ownUnits, houseId, enemyScouts);
        return;
    }
    
    showOwnUnitsModal(zoneId, zoneName, ownUnits, houseId, []);
};

// ============================================================
// ПОДТВЕРЖДЕНИЕ ЦЕЛИ
// ============================================================

window.confirmTarget = function(targetZoneId, action, timeMinutes) {
    var data = window._targetData;
    if (!data) { setMessage('❌ Нет данных.'); return; }
    
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
// ОТПРАВКА С АНИМАЦИЕЙ
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
    
    if (takenUnits.length === 0) { setMessage('❌ Не удалось забрать юнитов.'); return; }
    
    var hasCavalry = false, hasSiege = false, hasInfantry = false;
    takenUnits.forEach(function(u) {
        if (u.siege) hasSiege = true;
        else if (u.horse || u.type === 'rider' || u.type === 'heavy_rider' || u.type === 'knight') hasCavalry = true;
        else hasInfantry = true;
    });
    
    var speedPerZone = 2;
    if (hasSiege) speedPerZone = 5;
    else if (hasCavalry && !hasInfantry) speedPerZone = 1;
    
    var path = findPath(fromZoneId, targetZoneId);
    
    var marchId = 'march_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    var marchData = {
        id: marchId,
        units: takenUnits,
        path: path,
        currentStep: 0,
        action: action,
        houseId: houseId,
        speedPerZone: speedPerZone,
        nextMoveTime: Date.now() + speedPerZone * 60 * 1000
    };
    
    if (!garrison.marching) garrison.marching = [];
    garrison.marching.push(marchData);
    
    saveData();
    
    setMessage('✅ Отряд выступил! ' + takenUnits.length + ' юнитов, ' + path.length + ' зон.');
    addHouseLog(houseId, '🚶 ' + currentUser + ' отправил ' + takenUnits.length + ' юнитов в ' + getZoneName(targetZoneId));
    
    processMarchStep(marchId);
};

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
    if (now < marchData.nextMoveTime) {
        setTimeout(function() { processMarchStep(marchId); }, marchData.nextMoveTime - now);
        return;
    }
    
    marchData.currentStep++;
    
    if (marchData.currentStep >= marchData.path.length - 1) {
        var idx = garrison.marching.indexOf(marchData);
        if (idx !== -1) garrison.marching.splice(idx, 1);
        
        var targetZone = WORLD_AREAS[marchData.path[marchData.path.length - 1]];
        var action = marchData.action;
        var units = marchData.units;
        
        var enemies = findEnemiesInZone(targetZone.id, marchData.houseId);
        
        if (enemies.length > 0) {
            resolveBattle(units, enemies, targetZone.id, marchData.houseId, action);
        } else {
            if (action === 'attack' && targetZone) targetZone.owner = marchData.houseId;
            var isCastle = targetZone && (targetZone.type === 'castle' || targetZone.type === 'castle_gate');
            units.forEach(function(u) {
                u.location = isCastle ? 'castle' : targetZone.id;
                u.stance = action === 'defend' ? 'defending' : 'moving';
                returnUnit(u, window._castleGarrisons[marchData.houseId]);
            });
            saveData();
            setMessage('✅ Отряд прибыл в ' + getZoneName(targetZone.id));
            addHouseLog(marchData.houseId, '🚶 Отряд прибыл в ' + getZoneName(targetZone.id));
        }
        
        updateMenu();
        return;
    }
    
    // Следующий шаг
    marchData.nextMoveTime = Date.now() + marchData.speedPerZone * 60 * 1000 + 10000;
    
    saveData();
    updateMenu();
    
    setTimeout(function() { processMarchStep(marchId); }, marchData.speedPerZone * 60 * 1000 + 10000);
}

function returnUnit(u, garrison) {
    if (u.siege) garrison.siege.push(u);
    else if (u.horse || u.type === 'rider' || u.type === 'heavy_rider' || u.type === 'knight') garrison.cavalry.push(u);
    else garrison.infantry.push(u);
}

// ============================================================
// ОСТАЛЬНЫЕ ФУНКЦИИ
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
        h += '<div class="row"><span class="label">Тип</span><span class="value">' + zone.type + '</span></div>';
        h += '<div class="row"><span class="label">Уровень</span><span class="value">' + (zone.level||1) + '</span></div>';
        h += '<div class="row"><span class="label">Владелец</span><span class="value">' + (zone.owner==='crown'?'👑 Корона':zone.owner||'Ничья') + '</span></div>';
    }
    h += '</div><button class="btn btn-secondary" onclick="window.closeZoneInfo()">Закрыть</button>';
    content.innerHTML = h; modal.classList.remove('hide');
}

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
    var ec = {};
    enemies.forEach(function(e) {
        var hh = HOUSES[e.house];
        var n = hh ? hh.sigil+' '+hh.name : e.house;
        if (!ec[n]) ec[n] = 0;
        ec[n]++;
    });
    for (var n in ec) h += '<div class="row"><span class="label">'+n+'</span><span class="value">~'+ec[n]+' юнитов</span></div>';
    h += '</div><button class="btn btn-secondary" onclick="window.closeZoneInfo()">Закрыть</button>';
    content.innerHTML = h; modal.classList.remove('hide');
}

function getOwnUnitsInZone(zoneId, houseId) {
    var result = { commanders:[], captains:[], sergeants:[], unattached:[], scouts:[], length:0 };
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry:[], cavalry:[], siege:[] };
    var allUnits = [];
    var zone = WORLD_AREAS[zoneId];
    var isCastle = zone && (zone.type==='castle'||zone.type==='castle_gate');
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (garrison[cat]) {
            garrison[cat].forEach(function(u, idx) {
                if (u.location===zoneId||(isCastle&&u.location==='castle')) allUnits.push({unit:u,category:cat,index:idx});
            });
        }
    });
    var cmdMap={}, capMap={}, sgtMap={}, unattached=[], scouts=[];
    allUnits.forEach(function(item) {
        var u = item.unit;
        if (u.isScout) { scouts.push(item); }
        else if (u.commander) {
            var rank = getCommanderRank(u.commander, houseId);
            if (rank==='knight_commander') { if(!cmdMap[u.commander])cmdMap[u.commander]={name:u.commander,units:[]}; cmdMap[u.commander].units.push(item); }
            else if (rank==='captain_officer') { if(!capMap[u.commander])capMap[u.commander]={name:u.commander,units:[]}; capMap[u.commander].units.push(item); }
            else if (rank==='sergeant') { if(!sgtMap[u.commander])sgtMap[u.commander]={name:u.commander,units:[]}; sgtMap[u.commander].units.push(item); }
            else { unattached.push(item); }
        } else { unattached.push(item); }
    });
    for (var n in cmdMap) result.commanders.push(cmdMap[n]);
    for (var n in capMap) result.captains.push(capMap[n]);
    for (var n in sgtMap) result.sergeants.push(sgtMap[n]);
    result.unattached = unattached;
    result.scouts = scouts;
    result.length = allUnits.length;
    return result;
}

function getCommanderRank(playerName, houseId) {
    var u = users[playerName];
    if (!u || u.game.house !== houseId) return null;
    return u.game.houseRank || null;
}

function findEnemyScoutsInZone(zoneId, myHouseId) {
    var scouts = [];
    for (var hid in window._castleGarrisons) {
        if (hid===myHouseId) continue;
        if (HOUSES[hid]&&HOUSES[hid].liege===myHouseId) continue;
        var g = window._castleGarrisons[hid];
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (g[cat]) g[cat].forEach(function(u) {
                if (u.location===zoneId&&u.isScout) scouts.push({unit:u,house:hid});
            });
        });
    }
    return scouts;
}

window.closeOwnUnitsModal = function() { var m = document.getElementById('modal-own-units'); if(m)m.classList.add('hide'); };

function showOwnUnitsModal(zoneId, zoneName, ownUnits, houseId, enemyScouts) {
    var modal = document.getElementById('modal-own-units');
    if (!modal) {
        var o = document.createElement('div'); o.id='modal-own-units'; o.className='modal-overlay hide';
        o.onclick = function(e) { if(e.target===this)window.closeOwnUnitsModal(); };
        o.innerHTML = '<div class="modal-box" style="max-height:90vh;overflow-y:auto;"><div class="modal-header"><h3>⚔️ ВОЙСКА В ЗОНЕ</h3><button class="close-btn" onclick="window.closeOwnUnitsModal()">✕</button></div><div id="modal-own-units-content"></div></div>';
        document.body.appendChild(o); modal = o;
    }
    var c = document.getElementById('modal-own-units-content');
    var h = '<div class="modal-section"><h4>📍 '+zoneName+'</h4><p style="color:#6a5a48;">Выберите отряд</p></div>';
    
    if (enemyScouts && enemyScouts.length > 0) {
        h += '<div class="modal-section"><h4>👁️ ВРАЖЕСКИЕ РАЗВЕДЧИКИ</h4>';
        enemyScouts.forEach(function(es,i) {
            var hh=HOUSES[es.house]; var hn=hh?hh.sigil+' '+hh.name:es.house;
            h += '<div class="row"><span class="label">👁️ '+hn+'</span><span class="value"><button class="btn btn-small" style="background:#5a2020;" onclick="window.attackEnemyScout(\''+zoneId+'\','+i+')">⚔️ (50%)</button></span></div>';
        });
        h += '</div>';
    }
    
    if (ownUnits.scouts.length > 0) {
        h += '<div class="modal-section"><h4>👁️ РАЗВЕДЧИКИ</h4>';
        ownUnits.scouts.forEach(function(item,i) {
            var ut = window.UNIT_TYPES ? window.UNIT_TYPES[item.unit.type] : null;
            h += '<div class="row"><span class="label">👁️ '+(ut?ut.emoji+' '+ut.name:item.unit.type)+'</span><span class="value">';
            h += '<button class="btn btn-small" onclick="window.selectScoutForMove(\''+zoneId+'\','+i+')">🚶</button> ';
            h += '<button class="btn btn-small" onclick="window.mergeScout('+i+',\''+zoneId+'\')">🔗</button>';
            h += '</span></div>';
        });
        h += '</div>';
    }
    
    if (ownUnits.unattached.length > 0) {
        h += '<div class="modal-section"><h4>📦 НЕПРИВЯЗАННЫЕ</h4>';
        var utypes = {};
        ownUnits.unattached.forEach(function(item) { var t=item.unit.type; if(!utypes[t])utypes[t]=0; utypes[t]++; });
        for (var t in utypes) {
            var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
            h += '<div class="row"><span class="label">'+(ut?ut.emoji+' '+ut.name:t)+'</span><span class="value">×'+utypes[t]+' <input type="number" class="unattached-count" data-type="'+t+'" value="'+utypes[t]+'" min="1" max="'+utypes[t]+'" style="width:50px;"></span></div>';
        }
        h += '<button class="btn btn-small" onclick="window.selectUnattachedForMove(\''+zoneId+'\')">🚶 Отправить</button> ';
        h += '<button class="btn btn-small" onclick="window.detachScout(\''+zoneId+'\')">👁️ Разведчик</button>';
        h += '</div>';
    }
    
    h += '</div><button class="btn btn-secondary" onclick="window.closeOwnUnitsModal()">Закрыть</button>';
    c.innerHTML = h; modal.classList.remove('hide');
}

window.attackEnemyScout = function(zoneId, enemyIndex) {
    var user = users[currentUser]; var houseId = user.game.house;
    var enemyScouts = findEnemyScoutsInZone(zoneId, houseId);
    if (enemyIndex >= enemyScouts.length) { setMessage('❌ Не найден.'); return; }
    var enemy = enemyScouts[enemyIndex];
    if (Math.random() < 0.5) {
        var eg = window._castleGarrisons[enemy.house];
        if (eg) ['infantry','cavalry','siege'].forEach(function(cat) { if(eg[cat]) for(var i=eg[cat].length-1;i>=0;i--) if(eg[cat][i]===enemy.unit){eg[cat].splice(i,1);break;} });
        saveData(); setMessage('⚔️ Вражеский разведчик уничтожен!');
    } else {
        var og = window._castleGarrisons[houseId];
        if (og) ['infantry','cavalry','siege'].forEach(function(cat) { if(og[cat]) for(var i=og[cat].length-1;i>=0;i--) if(og[cat][i].location===zoneId&&og[cat][i].isScout){og[cat].splice(i,1);break;} });
        saveData(); setMessage('💀 Ваш разведчик убит.');
    }
    window.closeOwnUnitsModal(); updateMenu();
};

window.mergeScout = function(scoutIndex, zoneId) {
    var user = users[currentUser]; var houseId = user.game.house;
    var garrison = window._castleGarrisons&&window._castleGarrisons[houseId]?window._castleGarrisons[houseId]:{infantry:[],cavalry:[],siege:[]};
    var scout = null;
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if(!scout&&garrison[cat]){var cnt=0;for(var i=garrison[cat].length-1;i>=0;i--){if(garrison[cat][i].location===zoneId&&garrison[cat][i].isScout){if(cnt===scoutIndex){scout=garrison[cat][i];break;}cnt++;}}}
    });
    if(!scout){setMessage('❌ Не найден.');return;}
    scout.isScout=false; scout.scoutHome=null;
    saveData(); window.closeOwnUnitsModal(); setMessage('✅ В отряд.');
};

window.detachScout = function(zoneId) {
    var user = users[currentUser]; var houseId = user.game.house;
    var garrison = window._castleGarrisons&&window._castleGarrisons[houseId]?window._castleGarrisons[houseId]:{infantry:[],cavalry:[],siege:[]};
    var scout = null;
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if(!scout&&garrison[cat]){for(var i=garrison[cat].length-1;i>=0;i--){if(garrison[cat][i].location===zoneId&&!garrison[cat][i].commander&&!garrison[cat][i].isScout){scout=garrison[cat].splice(i,1)[0];break;}}}
    });
    if(!scout){setMessage('❌ Нет свободных.');return;}
    scout.isScout=true; scout.scoutHome=zoneId;
    if(scout.siege)garrison.siege.push(scout);else if(scout.horse||scout.type==='rider'||scout.type==='heavy_rider'||scout.type==='knight')garrison.cavalry.push(scout);else garrison.infantry.push(scout);
    saveData(); window.closeOwnUnitsModal(); setMessage('👁️ Разведчик отделён.');
};

window.selectCommanderForMove = function(zoneId, rank, name) {
    window.currentMovingCommander = {zoneId:zoneId,rank:rank,name:name,type:'commander'};
    window._awaitingTarget = true;
    window._targetData = {fromZone:zoneId,isScout:false,commander:true};
    window.closeOwnUnitsModal();
    setMessage('🎯 Выберите целевую зону.');
};

window.selectScoutForMove = function(zoneId, scoutIndex) {
    window.currentMovingCommander = {zoneId:zoneId,type:'scout',scoutIndex:scoutIndex};
    window._awaitingTarget = true;
    window._targetData = {fromZone:zoneId,isScout:true,scoutIndex:scoutIndex};
    window.closeOwnUnitsModal();
    setMessage('🎯 Выберите целевую зону.');
};

window.selectUnattachedForMove = function(zoneId) {
    window.currentMovingCommander = {zoneId:zoneId,type:'unattached'};
    window._awaitingTarget = true;
    window._targetData = {fromZone:zoneId,isScout:false,commander:false};
    window.closeOwnUnitsModal();
    setMessage('🎯 Выберите целевую зону.');
};

window.moveScout = function(targetZoneId, action, timeMinutes) {
    var user = users[currentUser]; var houseId = user.game.house;
    var commander = window.currentMovingCommander;
    var garrison = window._castleGarrisons&&window._castleGarrisons[houseId]?window._castleGarrisons[houseId]:{infantry:[],cavalry:[],siege:[],marching:[]};
    var scout = null; var scoutCat = '';
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if(!scout&&garrison[cat]){var cnt=0;for(var i=garrison[cat].length-1;i>=0;i--){if(garrison[cat][i].location===commander.zoneId&&garrison[cat][i].isScout){if(cnt===commander.scoutIndex){scout=garrison[cat].splice(i,1)[0];scoutCat=cat;break;}cnt++;}}}
    });
    if(!scout){setMessage('❌ Не найден.');return;}
    if(action==='scout'){
        if(Math.random()<0.5){
            var enemies = findEnemiesInZone(targetZoneId, houseId);
            var info = '🔍 РАЗВЕДКА!\n\nВраги:\n';
            if(enemies.length===0)info+='Нет.';
            else {var ec={};enemies.forEach(function(e){var hh=HOUSES[e.house];var n=hh?hh.sigil+' '+hh.name:e.house;if(!ec[n])ec[n]=0;ec[n]++;});
            for(var n in ec)info+=n+': ~'+ec[n]+' юнитов\n';}
            scout.location=scout.scoutHome||commander.zoneId;
            if(scoutCat==='infantry')garrison.infantry.push(scout);else if(scoutCat==='cavalry')garrison.cavalry.push(scout);else garrison.siege.push(scout);
            saveData(); alert(info); setMessage('👁️ Разведка успешна!');
        } else { saveData(); setMessage('💀 Разведчик погиб.'); }
    } else {
        var arrivesAt = Date.now() + timeMinutes * 60 * 1000;
        var me = {units:[scout],fromZone:commander.zoneId,targetZone:targetZoneId,action:'move',arrivesAt:arrivesAt,departedAt:Date.now(),commander:currentUser,isScout:true};
        if(!garrison.marching)garrison.marching=[];
        garrison.marching.push(me);
        saveData();
        setMessage('👁️ Разведчик выдвинулся.');
        setTimeout(function(){processScoutArrival(me,houseId,scoutCat);},timeMinutes*60*1000);
    }
};

function processScoutArrival(me, houseId, cat) {
    var garrison = window._castleGarrisons&&window._castleGarrisons[houseId]?window._castleGarrisons[houseId]:null;
    if(!garrison||!garrison.marching)return;
    var idx=garrison.marching.indexOf(me); if(idx===-1)return;
    garrison.marching.splice(idx,1);
    var unit=me.units[0]; if(!unit)return;
    var enemyScouts=findEnemyScoutsInZone(me.targetZone,houseId);
    if(enemyScouts.length>0){
        if(Math.random()<0.5){
            var eh=enemyScouts[0].house; var eg=window._castleGarrisons[eh];
            if(eg){['infantry','cavalry','siege'].forEach(function(c){if(eg[c])for(var i=eg[c].length-1;i>=0;i--)if(eg[c][i]===enemyScouts[0].unit){eg[c].splice(i,1);break;}});}
            unit.location=me.targetZone; unit.isScout=true; if(!unit.scoutHome)unit.scoutHome=me.fromZone;
            if(cat==='infantry')garrison.infantry.push(unit);else if(cat==='cavalry')garrison.cavalry.push(unit);else garrison.siege.push(unit);
            saveData(); setMessage('⚔️ Разведчик уничтожил вражеского.');
        } else { saveData(); setMessage('💀 Разведчик убит.'); }
    } else {
        unit.location=me.targetZone; unit.isScout=true; if(!unit.scoutHome)unit.scoutHome=me.fromZone;
        if(cat==='infantry')garrison.infantry.push(unit);else if(cat==='cavalry')garrison.cavalry.push(unit);else garrison.siege.push(unit);
        saveData(); setMessage('👁️ Разведчик прибыл.');
    }
    updateMenu();
}

function findEnemiesInZone(zoneId, myHouseId) {
    var enemies = [];
    for (var hid in window._castleGarrisons) {
        if (hid===myHouseId) continue;
        if (HOUSES[hid]&&HOUSES[hid].liege===myHouseId) continue;
        var g = window._castleGarrisons[hid];
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (g[cat]) g[cat].forEach(function(u) {
                if (u.location===zoneId && u.stance==='defending' && !u.isScout) enemies.push({unit:u,house:hid});
            });
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
                if (g[cat]) for (var i=g[cat].length-1;i>=0;i--) if (g[cat][i].location===zoneId&&g[cat][i].stance==='defending') g[cat].splice(i,1);
            });
        }
        var lost=0;
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (attackerGarrison[cat]) for (var i=attackerGarrison[cat].length-1;i>=0&&lost<attLosses;i--) {
                if (attackers.indexOf(attackerGarrison[cat][i])!==-1) { attackerGarrison[cat].splice(i,1); lost++; }
            }
        });
        if (action==='attack'&&WORLD_AREAS[zoneId]) WORLD_AREAS[zoneId].owner = attackerHouseId;
        var tz=WORLD_AREAS[zoneId]; var isCastle=tz&&(tz.type==='castle'||tz.type==='castle_gate');
        attackers.forEach(function(u) { if(u.location!==undefined){u.location=isCastle?'castle':zoneId;u.stance='moving';returnUnit(u,attackerGarrison);} });
        saveData(); setMessage('⚔️ ПОБЕДА! -'+attLosses); addHouseLog(attackerHouseId,'⚔️ Победа в '+getZoneName(zoneId));
    } else {
        var defLosses = Math.max(1, Math.floor(defenders.length * 0.2));
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (attackerGarrison[cat]) for (var i=attackerGarrison[cat].length-1;i>=0;i--) {
                if (attackers.indexOf(attackerGarrison[cat][i])!==-1) attackerGarrison[cat].splice(i,1);
            }
        });
        var lost=0;
        for (var hid in window._castleGarrisons) {
            var g=window._castleGarrisons[hid];
            ['infantry','cavalry','siege'].forEach(function(cat) {
                if (g[cat]) for (var i=g[cat].length-1;i>=0&&lost<defLosses;i--) {
                    if (g[cat][i].location===zoneId&&g[cat][i].stance==='defending') { g[cat].splice(i,1); lost++; }
                }
            });
        }
        saveData(); setMessage('🛡️ ПОРАЖЕНИЕ!'); addHouseLog(attackerHouseId,'🛡️ Поражение в '+getZoneName(zoneId));
    }
    updateMenu();
}

function getZoneName(zoneId) { var z=WORLD_AREAS[zoneId]; return z?z.name:zoneId; }

window.restoreMarchingTimers = function() {
    for (var hid in window._castleGarrisons) {
        var g = window._castleGarrisons[hid];
        if (g.marching && g.marching.length > 0) {
            g.marching.forEach(function(m) {
                if (m.path) {
                    processMarchStep(m.id);
                } else {
                    var timeLeft = m.arrivesAt - Date.now();
                    if (timeLeft <= 0) {
                        if (m.isScout) {
                            var cat = m.units[0]&&m.units[0].siege?'siege':(m.units[0]&&(m.units[0].horse||m.units[0].type==='rider'||m.units[0].type==='heavy_rider'||m.units[0].type==='knight')?'cavalry':'infantry');
                            processScoutArrival(m, hid, cat);
                        }
                    }
                }
            });
        }
    }
};

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
window.processMarchStep = processMarchStep;
window.resolveBattle = resolveBattle;
window.restoreMarchingTimers = restoreMarchingTimers;

setTimeout(function() {
    if (typeof window._castleGarrisons !== 'undefined') restoreMarchingTimers();
}, 1000);

console.log('🎯 Командование + PvP + Разведка + Марш загружены!');

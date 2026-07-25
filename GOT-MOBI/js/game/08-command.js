// ============================================================
// js/game/08-command.js — КОМАНДОВАНИЕ + PvP + РАЗВЕДКА + АНИМАЦИЯ + ОТРЯДЫ
// ПОЛНАЯ ВЕРСИЯ — ВСЕ ФУНКЦИИ — ИСПРАВЛЕНО
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
// СИСТЕМА ОТРЯДОВ (SQUADS) — ПОЛНАЯ ВЕРСИЯ
// ============================================================

window.getSquads = function(houseId) {
    if (!window._castleGarrisons) window._castleGarrisons = {};
    if (!window._castleGarrisons[houseId]) window._castleGarrisons[houseId] = { infantry: [], cavalry: [], siege: [], marching: [] };
    if (!window._castleGarrisons[houseId].squads) window._castleGarrisons[houseId].squads = {};
    return window._castleGarrisons[houseId].squads;
};

window.getMySquad = function() {
    var user = users[currentUser];
    if (!user || !user.game.house) return null;
    var squads = window.getSquads(user.game.house);
    
    for (var cmdName in squads) {
        var squad = squads[cmdName];
        if (squad.commander === currentUser) return { role: 'commander', squad: squad, commanderName: cmdName };
        if (squad.captains) {
            for (var capName in squad.captains) {
                if (capName === currentUser) return { role: 'captain', squad: squad, commanderName: cmdName, captainName: capName };
                if (squad.captains[capName].sergeants) {
                    for (var sgtName in squad.captains[capName].sergeants) {
                        if (sgtName === currentUser) return { role: 'sergeant', squad: squad, commanderName: cmdName, captainName: capName, sergeantName: sgtName };
                    }
                }
            }
        }
    }
    return null;
};

window.createSquad = function(commanderName) {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return null; }
    var houseId = user.game.house;
    
    var myRank = user.game.houseRank;
    if (!myRank || ['lord','heir','war_master'].indexOf(myRank) === -1) {
        setMessage('❌ Только лорд, наследник или мастер над войной могут создавать отряды.');
        return null;
    }
    
    if (!users[commanderName] || users[commanderName].game.house !== houseId) {
        setMessage('❌ Игрок не в вашем доме.');
        return null;
    }
    
    var squads = window.getSquads(houseId);
    if (squads[commanderName]) { setMessage('❌ У этого командира уже есть отряд.'); return null; }
    
    squads[commanderName] = {
        commander: commanderName,
        units: [],
        captains: {},
        location: 'castle',
        stance: 'moving',
        isSquad: true,
        detached: false,
        createdAt: Date.now()
    };
    
    saveData();
    addHouseLog(houseId, '👑 Создан отряд для командора ' + commanderName);
    setMessage('✅ Отряд создан для ' + commanderName);
    return squads[commanderName];
};

window.disbandSquad = function(commanderName) {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return false; }
    var houseId = user.game.house;
    
    var myRank = user.game.houseRank;
    if (!myRank || ['lord','heir','war_master'].indexOf(myRank) === -1) {
        setMessage('❌ Только лорд, наследник или мастер над войной могут расформировывать отряды.');
        return false;
    }
    
    var squads = window.getSquads(houseId);
    var squad = squads[commanderName];
    if (!squad) { setMessage('❌ Отряд не найден.'); return false; }
    
    var garrison = window._castleGarrisons[houseId];
    var totalReturned = 0;
    
    var allUnits = [];
    allUnits = allUnits.concat(squad.units);
    for (var capName in squad.captains) {
        allUnits = allUnits.concat(squad.captains[capName].units);
        for (var sgtName in squad.captains[capName].sergeants) {
            allUnits = allUnits.concat(squad.captains[capName].sergeants[sgtName].units);
        }
    }
    
    allUnits.forEach(function(u) {
        u.squadId = null;
        u.commander = null;
        u.captainId = null;
        u.sergeantId = null;
        u.location = 'castle';
        returnUnit(u, garrison);
        totalReturned++;
    });
    
    delete squads[commanderName];
    saveData();
    addHouseLog(houseId, '💔 Отряд ' + commanderName + ' расформирован. ' + totalReturned + ' юнитов возвращены.');
    setMessage('✅ Отряд расформирован. ' + totalReturned + ' юнитов возвращены в гарнизон.');
    return true;
};

// ============================================================
// ВЫДЕЛЕНИЕ ВОЙСК КОМАНДОРУ (БЕРЁТ ВСЕХ СВОБОДНЫХ)
// ============================================================

window.assignUnitsToCommander = function(targetName, unitTypes) {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return false; }
    var houseId = user.game.house;
    
    var myRank = user.game.houseRank;
    if (!myRank || ['lord','heir','war_master'].indexOf(myRank) === -1) {
        setMessage('❌ Только лорд, наследник или мастер над войной могут распределять войска.');
        return false;
    }
    
    var garrison = window._castleGarrisons[houseId];
    if (!garrison) { setMessage('❌ Нет гарнизона.'); return false; }
    
    var squads = window.getSquads(houseId);
    var squad = squads[targetName];
    if (!squad) { squad = window.createSquad(targetName); if (!squad) return false; }
    
    var totalAssigned = 0;
    var alreadyAssigned = squad.units.length;
    for (var capName in squad.captains) {
        alreadyAssigned += squad.captains[capName].units.length;
        for (var sgtName in squad.captains[capName].sergeants) {
            alreadyAssigned += squad.captains[capName].sergeants[sgtName].units.length;
        }
    }
    var maxCanAssign = 1000 - alreadyAssigned;
    if (maxCanAssign <= 0) { setMessage('❌ У командора уже максимум (1000) юнитов.'); return false; }
    
    for (var type in unitTypes) {
        var count = Math.min(unitTypes[type], maxCanAssign - totalAssigned);
        if (count <= 0) break;
        var taken = 0;
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (garrison[cat]) {
                for (var i = garrison[cat].length - 1; i >= 0 && taken < count; i--) {
                    var u = garrison[cat][i];
                    if (u.type === type && !u.commander && !u.isScout && !u.squadId) {
                        u.squadId = targetName;
                        u.commander = targetName;
                        squad.units.push(garrison[cat].splice(i, 1)[0]);
                        taken++;
                        totalAssigned++;
                    }
                }
            }
        });
    }
    
    if (totalAssigned > 0) {
        saveData();
        setMessage('✅ ' + totalAssigned + ' юнитов закреплено за командором ' + targetName);
        addHouseLog(houseId, '👥 ' + totalAssigned + ' юнитов → командор ' + targetName);
    } else {
        setMessage('❌ Не удалось закрепить юнитов.');
    }
    return totalAssigned > 0;
};

// ============================================================
// ОТВЯЗКА ВОЙСК ОТ КОМАНДОРА
// ============================================================

window.unassignUnitsFromCommander = function(targetName, unitTypes) {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return false; }
    var houseId = user.game.house;
    
    var myRank = user.game.houseRank;
    if (!myRank || ['lord','heir','war_master'].indexOf(myRank) === -1) {
        setMessage('❌ Только высшее командование может отвязывать войска.');
        return false;
    }
    
    var squads = window.getSquads(houseId);
    var squad = squads[targetName];
    if (!squad) { setMessage('❌ Отряд не найден.'); return false; }
    
    var garrison = window._castleGarrisons[houseId];
    var totalUnassigned = 0;
    
    if (!unitTypes || Object.keys(unitTypes).length === 0) {
        totalUnassigned = unassignAllFromSquad(squad, garrison);
    } else {
        for (var type in unitTypes) {
            var count = unitTypes[type];
            var taken = 0;
            for (var i = squad.units.length - 1; i >= 0 && taken < count; i--) {
                if (squad.units[i].type === type) {
                    var u = squad.units.splice(i, 1)[0];
                    u.squadId = null; u.commander = null; u.captainId = null; u.sergeantId = null;
                    u.location = 'castle';
                    returnUnit(u, garrison);
                    taken++; totalUnassigned++;
                }
            }
            if (taken < count) {
                for (var capName in squad.captains) {
                    var cap = squad.captains[capName];
                    for (var i = cap.units.length - 1; i >= 0 && taken < count; i--) {
                        if (cap.units[i].type === type) {
                            var u = cap.units.splice(i, 1)[0];
                            u.squadId = null; u.commander = null; u.captainId = null; u.sergeantId = null;
                            u.location = 'castle';
                            returnUnit(u, garrison);
                            taken++; totalUnassigned++;
                        }
                    }
                }
            }
            if (taken < count) {
                for (var capName in squad.captains) {
                    var cap = squad.captains[capName];
                    for (var sgtName in cap.sergeants) {
                        var sgt = cap.sergeants[sgtName];
                        for (var i = sgt.units.length - 1; i >= 0 && taken < count; i--) {
                            if (sgt.units[i].type === type) {
                                var u = sgt.units.splice(i, 1)[0];
                                u.squadId = null; u.commander = null; u.captainId = null; u.sergeantId = null;
                                u.location = 'castle';
                                returnUnit(u, garrison);
                                taken++; totalUnassigned++;
                            }
                        }
                    }
                }
            }
        }
    }
    
    if (totalUnassigned > 0) {
        saveData();
        setMessage('✅ ' + totalUnassigned + ' юнитов отвязано от командора ' + targetName);
        addHouseLog(houseId, '🔓 ' + totalUnassigned + ' юнитов отвязано от ' + targetName);
    } else {
        setMessage('❌ Не удалось отвязать юнитов.');
    }
    return totalUnassigned > 0;
};

function unassignAllFromSquad(squad, garrison) {
    var total = 0;
    var allUnits = [];
    allUnits = allUnits.concat(squad.units);
    for (var capName in squad.captains) {
        allUnits = allUnits.concat(squad.captains[capName].units);
        for (var sgtName in squad.captains[capName].sergeants) {
            allUnits = allUnits.concat(squad.captains[capName].sergeants[sgtName].units);
        }
    }
    allUnits.forEach(function(u) {
        u.squadId = null; u.commander = null; u.captainId = null; u.sergeantId = null;
        u.location = 'castle';
        returnUnit(u, garrison);
        total++;
    });
    squad.units = [];
    for (var capName in squad.captains) {
        squad.captains[capName].units = [];
        for (var sgtName in squad.captains[capName].sergeants) {
            squad.captains[capName].sergeants[sgtName].units = [];
        }
    }
    return total;
}

// ============================================================
// РАСПРЕДЕЛЕНИЕ ПО ИЕРАРХИИ (ЛОРД МОЖЕТ)
// ============================================================

window.commanderAssignToCaptain = function(captainName, unitTypes) {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return false; }
    var houseId = user.game.house;
    
    var myRank = user.game.houseRank;
    var isHighCommand = myRank && ['lord','heir','war_master'].indexOf(myRank) !== -1;
    var mySquad = window.getMySquad();
    
    if (!isHighCommand && (!mySquad || mySquad.role !== 'commander')) {
        setMessage('❌ Только командор или высшее командование могут назначать капитанов.');
        return false;
    }
    
    if (!users[captainName] || users[captainName].game.house !== houseId) {
        setMessage('❌ Игрок не в вашем доме.');
        return false;
    }
    
    var squad;
    if (isHighCommand) {
        if (!mySquad) { setMessage('❌ Укажите командора.'); return false; }
        squad = mySquad.squad;
    } else {
        squad = mySquad.squad;
    }
    
    var squads = window.getSquads(houseId);
    for (var cmdName in squads) {
        if (squads[cmdName].captains && squads[cmdName].captains[captainName]) {
            setMessage('❌ Этот капитан уже в отряде ' + cmdName);
            return false;
        }
    }
    
    var captainSquad = squad.captains[captainName];
    if (!captainSquad) {
        captainSquad = { commander: captainName, units: [], sergeants: {}, detached: false };
        squad.captains[captainName] = captainSquad;
    }
    
    var totalAssigned = 0;
    if (unitTypes && Object.keys(unitTypes).length > 0) {
        for (var type in unitTypes) {
            var count = unitTypes[type];
            var taken = 0;
            for (var i = squad.units.length - 1; i >= 0 && taken < count; i--) {
                var u = squad.units[i];
                if (u.type === type) {
                    u.captainId = captainName;
                    captainSquad.units.push(squad.units.splice(i, 1)[0]);
                    taken++;
                    totalAssigned++;
                }
            }
        }
    }
    
    saveData();
    if (totalAssigned > 0) {
        setMessage('✅ ' + captainName + ' назначен капитаном с ' + totalAssigned + ' юнитами.');
    } else {
        setMessage('✅ ' + captainName + ' назначен капитаном (без юнитов).');
    }
    addHouseLog(houseId, '👥 ' + currentUser + ' → капитан ' + captainName);
    return true;
};

window.lordAssignToCaptain = function(cmdName, captainName, unitTypes) {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return false; }
    var houseId = user.game.house;
    
    var myRank = user.game.houseRank;
    if (!myRank || ['lord','heir','war_master'].indexOf(myRank) === -1) {
        setMessage('❌ Только высшее командование.');
        return false;
    }
    
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad) { setMessage('❌ Отряд не найден.'); return false; }
    
    if (!users[captainName] || users[captainName].game.house !== houseId) {
        setMessage('❌ Игрок не в вашем доме.');
        return false;
    }
    
    for (var c in squads) {
        if (squads[c].captains && squads[c].captains[captainName] && c !== cmdName) {
            setMessage('❌ Капитан уже в отряде ' + c);
            return false;
        }
    }
    
    var captainSquad = squad.captains[captainName];
    if (!captainSquad) {
        captainSquad = { commander: captainName, units: [], sergeants: {}, detached: false };
        squad.captains[captainName] = captainSquad;
    }
    
    if (unitTypes && Object.keys(unitTypes).length > 0) {
        var totalAssigned = 0;
        for (var type in unitTypes) {
            var count = unitTypes[type];
            var taken = 0;
            for (var i = squad.units.length - 1; i >= 0 && taken < count; i--) {
                var u = squad.units[i];
                if (u.type === type) {
                    u.captainId = captainName;
                    captainSquad.units.push(squad.units.splice(i, 1)[0]);
                    taken++; totalAssigned++;
                }
            }
        }
        saveData();
        setMessage('✅ ' + totalAssigned + ' юнитов → капитан ' + captainName);
    } else {
        saveData();
        setMessage('✅ ' + captainName + ' назначен капитаном (без юнитов).');
    }
    addHouseLog(houseId, '👥 Лорд → капитан ' + captainName);
    return true;
};

window.lordAssignToSergeant = function(cmdName, capName, sgtName, unitTypes) {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return false; }
    var houseId = user.game.house;
    
    var myRank = user.game.houseRank;
    if (!myRank || ['lord','heir','war_master'].indexOf(myRank) === -1) {
        setMessage('❌ Только высшее командование.');
        return false;
    }
    
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad || !squad.captains[capName]) { setMessage('❌ Капитан не найден.'); return false; }
    var cap = squad.captains[capName];
    
    var sergeantSquad = cap.sergeants[sgtName];
    if (!sergeantSquad) {
        sergeantSquad = { commander: sgtName, units: [], detached: false };
        cap.sergeants[sgtName] = sergeantSquad;
    }
    
    saveData();
    setMessage('✅ ' + sgtName + ' назначен сержантом.');
    return true;
};

window.captainAssignToSergeant = function(sergeantName, unitTypes) {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return false; }
    var houseId = user.game.house;
    
    var myRank = user.game.houseRank;
    var isHighCommand = myRank && ['lord','heir','war_master'].indexOf(myRank) !== -1;
    var mySquad = window.getMySquad();
    
    if (!isHighCommand && (!mySquad || mySquad.role !== 'captain')) {
        setMessage('❌ Только капитан или высшее командование могут назначать сержантов.');
        return false;
    }
    
    if (!users[sergeantName] || users[sergeantName].game.house !== houseId) {
        setMessage('❌ Игрок не в вашем доме.');
        return false;
    }
    
    var captainSquad = mySquad.squad.captains[mySquad.captainName];
    if (!captainSquad) { setMessage('❌ Ошибка: отряд капитана не найден.'); return false; }
    
    var sergeantSquad = captainSquad.sergeants[sergeantName];
    if (!sergeantSquad) {
        sergeantSquad = { commander: sergeantName, units: [], detached: false };
        captainSquad.sergeants[sergeantName] = sergeantSquad;
    }
    
    var totalAssigned = 0;
    if (unitTypes && Object.keys(unitTypes).length > 0) {
        for (var type in unitTypes) {
            var count = unitTypes[type];
            var taken = 0;
            for (var i = captainSquad.units.length - 1; i >= 0 && taken < count; i--) {
                var u = captainSquad.units[i];
                if (u.type === type) {
                    u.sergeantId = sergeantName;
                    sergeantSquad.units.push(captainSquad.units.splice(i, 1)[0]);
                    taken++;
                    totalAssigned++;
                }
            }
        }
    }
    
    saveData();
    if (totalAssigned > 0) {
        setMessage('✅ ' + sergeantName + ' назначен сержантом с ' + totalAssigned + ' юнитами.');
    } else {
        setMessage('✅ ' + sergeantName + ' назначен сержантом (без юнитов).');
    }
    addHouseLog(houseId, '👥 Капитан ' + currentUser + ' → сержант ' + sergeantName);
    return true;
};

// ============================================================
// ОТЗЫВ ВОЙСК (ЛОРД МОЖЕТ НАПРЯМУЮ)
// ============================================================

window.recallUnitsFromCaptain = function(cmdName, captainName, unitTypes) {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return false; }
    var houseId = user.game.house;
    
    var myRank = user.game.houseRank;
    var isHighCommand = myRank && ['lord','heir','war_master'].indexOf(myRank) !== -1;
    
    var squads = window.getSquads(houseId);
    var squad;
    
    if (isHighCommand && cmdName) {
        squad = squads[cmdName];
    } else {
        var mySquad = window.getMySquad();
        if (!mySquad || mySquad.role !== 'commander') { setMessage('❌ Только командор может отзывать.'); return false; }
        squad = mySquad.squad;
    }
    
    if (!squad) { setMessage('❌ Отряд не найден.'); return false; }
    var captainSquad = squad.captains[captainName];
    if (!captainSquad) { setMessage('❌ Капитан не найден.'); return false; }
    
    var totalRecalled = 0;
    if (!unitTypes || Object.keys(unitTypes).length === 0) {
        totalRecalled = captainSquad.units.length;
        captainSquad.units.forEach(function(u) { u.captainId = null; u.sergeantId = null; });
        squad.units = squad.units.concat(captainSquad.units);
        captainSquad.units = [];
    } else {
        for (var type in unitTypes) {
            var count = unitTypes[type];
            var taken = 0;
            for (var i = captainSquad.units.length - 1; i >= 0 && taken < count; i--) {
                var u = captainSquad.units[i];
                if (u.type === type) {
                    u.captainId = null; u.sergeantId = null;
                    squad.units.push(captainSquad.units.splice(i, 1)[0]);
                    taken++; totalRecalled++;
                }
            }
        }
    }
    
    if (totalRecalled > 0) {
        saveData();
        setMessage('✅ ' + totalRecalled + ' юнитов возвращено от капитана ' + captainName);
    }
    return totalRecalled > 0;
};

window.captainRecallFromSergeant = function(cmdName, capName, sergeantName, unitTypes) {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return false; }
    var houseId = user.game.house;
    
    var myRank = user.game.houseRank;
    var isHighCommand = myRank && ['lord','heir','war_master'].indexOf(myRank) !== -1;
    
    var squads = window.getSquads(houseId);
    var squad, captainSquad;
    
    if (isHighCommand && cmdName && capName) {
        squad = squads[cmdName];
        if (squad) captainSquad = squad.captains[capName];
    } else {
        var mySquad = window.getMySquad();
        if (!mySquad) { setMessage('❌ Вы не в отряде.'); return false; }
        squad = mySquad.squad;
        if (mySquad.role === 'captain') captainSquad = squad.captains[mySquad.captainName];
        else if (mySquad.role === 'commander') captainSquad = squad.captains[capName];
    }
    
    if (!captainSquad) { setMessage('❌ Капитан не найден.'); return false; }
    var sergeantSquad = captainSquad.sergeants[sergeantName];
    if (!sergeantSquad) { setMessage('❌ Сержант не найден.'); return false; }
    
    var totalRecalled = 0;
    if (!unitTypes || Object.keys(unitTypes).length === 0) {
        totalRecalled = sergeantSquad.units.length;
        sergeantSquad.units.forEach(function(u) { u.sergeantId = null; });
        captainSquad.units = captainSquad.units.concat(sergeantSquad.units);
        sergeantSquad.units = [];
    } else {
        for (var type in unitTypes) {
            var count = unitTypes[type];
            var taken = 0;
            for (var i = sergeantSquad.units.length - 1; i >= 0 && taken < count; i--) {
                var u = sergeantSquad.units[i];
                if (u.type === type) {
                    u.sergeantId = null;
                    captainSquad.units.push(sergeantSquad.units.splice(i, 1)[0]);
                    taken++; totalRecalled++;
                }
            }
        }
    }
    
    if (totalRecalled > 0) {
        saveData();
        setMessage('✅ ' + totalRecalled + ' юнитов возвращено от сержанта ' + sergeantName);
    }
    return totalRecalled > 0;
};

// ============================================================
// ПОКИНУТЬ/ВЕРНУТЬСЯ В ОТРЯД
// ============================================================

window.leaveSquad = function() {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return false; }
    
    var mySquad = window.getMySquad();
    if (!mySquad) { setMessage('❌ Вы не состоите в отряде.'); return false; }
    
    var garrison = window._castleGarrisons[user.game.house];
    if (garrison && garrison.marching) {
        for (var i = 0; i < garrison.marching.length; i++) {
            if (garrison.marching[i].squadId === mySquad.commanderName) {
                setMessage('❌ Нельзя покинуть отряд во время марша.');
                return false;
            }
        }
    }
    
    user.game._leftSquad = {
        commanderName: mySquad.commanderName,
        captainName: mySquad.captainName || null,
        sergeantName: mySquad.sergeantName || null,
        role: mySquad.role,
        houseId: user.game.house
    };
    
    saveData();
    setMessage('🚶 Вы покинули отряд. Войска остались в отряде.');
    addHouseLog(user.game.house, '🚶 ' + currentUser + ' покинул отряд ' + mySquad.commanderName);
    return true;
};

window.rejoinSquad = function() {
    var user = users[currentUser];
    if (!user || !user.game._leftSquad) { setMessage('❌ Вы не покидали отряд.'); return false; }
    
    var data = user.game._leftSquad;
    var squads = window.getSquads(data.houseId);
    var squad = squads[data.commanderName];
    if (!squad) { setMessage('❌ Отряд больше не существует.'); user.game._leftSquad = null; saveData(); return false; }
    
    var g = user.game;
    var squadLocation = squad.location === 'castle' ? 'bl_-1_0' : squad.location;
    var playerLocation = g.location.parentZone || g.location.place;
    if (playerLocation === 'Таверна' || playerLocation === 'Дом') playerLocation = 'kl_0_0';
    
    if (playerLocation !== squadLocation && squadLocation !== 'castle') {
        setMessage('❌ Вы не на той же клетке что и отряд.');
        return false;
    }
    
    user.game._leftSquad = null;
    if (user.game._chaseInterval) { clearInterval(user.game._chaseInterval); user.game._chaseInterval = null; }
    
    saveData();
    setMessage('✅ Вы вернулись в отряд ' + data.commanderName);
    addHouseLog(data.houseId, '✅ ' + currentUser + ' вернулся в отряд ' + data.commanderName);
    return true;
};

// ============================================================
// ДВИЖЕНИЕ ОТРЯДА
// ============================================================

window.moveSquad = function(targetZoneId, action) {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return false; }
    var houseId = user.game.house;
    
    var mySquad = window.getMySquad();
    if (!mySquad || mySquad.role !== 'commander') { setMessage('❌ Только командор может двигать отряд.'); return false; }
    
    var squad = mySquad.squad;
    var currentZoneId = squad.location === 'castle' ? 'bl_-1_0' : squad.location;
    
    var allUnits = [];
    allUnits = allUnits.concat(squad.units);
    for (var capName in squad.captains) {
        allUnits = allUnits.concat(squad.captains[capName].units);
        for (var sgtName in squad.captains[capName].sergeants) {
            allUnits = allUnits.concat(squad.captains[capName].sergeants[sgtName].units);
        }
    }
    
    if (allUnits.length === 0) { setMessage('❌ Нет юнитов в отряде.'); return false; }
    
    var speedPerZone = 2;
    var hasC = false, hasS = false;
    allUnits.forEach(function(u) { if(u.siege)hasS=true; else if(u.horse||u.type==='rider'||u.type==='heavy_rider'||u.type==='knight')hasC=true; });
    if (hasS) speedPerZone = 5; else if (hasC) speedPerZone = 1;
    
    var path = findPath(currentZoneId, targetZoneId);
    var moveTimeMs = speedPerZone * 60 * 1000;
    var waitTimeMs = 10000;
    
    var marchId = 'squad_' + Date.now() + '_' + Math.floor(Math.random()*1000);
    var marchData = {
        id: marchId, units: allUnits, path: path, currentStep: 0,
        action: action, houseId: houseId, speedPerZone: speedPerZone,
        moveTimeMs: moveTimeMs, waitTimeMs: waitTimeMs,
        phase: 'waiting', nextPhaseTime: Date.now() + waitTimeMs,
        isSquad: true, squadId: mySquad.commanderName, commanderName: mySquad.commanderName
    };
    
    var garrison = window._castleGarrisons[houseId];
    if (!garrison.marching) garrison.marching = [];
    garrison.marching.push(marchData);
    
    squad.units = [];
    for (var capName in squad.captains) {
        squad.captains[capName].units = [];
        for (var sgtName in squad.captains[capName].sergeants) {
            squad.captains[capName].sergeants[sgtName].units = [];
        }
    }
    
    saveData();
    setMessage('✅ Отряд выступил! ' + allUnits.length + ' юнитов.');
    addHouseLog(houseId, '🚶 Отряд ' + mySquad.commanderName + ' → ' + getZoneName(targetZoneId));
    processMarchStep(marchId);
    return true;
};

window.movePlayerUnits = function(targetZoneId) {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return false; }
    var houseId = user.game.house;
    
    var mySquad = window.getMySquad();
    if (!mySquad) { setMessage('❌ Вы не в отряде.'); return false; }
    
    var squad = mySquad.squad;
    var myUnits = [];
    var currentZoneId = squad.location === 'castle' ? 'bl_-1_0' : squad.location;
    
    if (mySquad.role === 'commander') {
        myUnits = myUnits.concat(squad.units);
    } else if (mySquad.role === 'captain') {
        var cap = squad.captains[mySquad.captainName];
        if (cap) myUnits = myUnits.concat(cap.units);
    } else if (mySquad.role === 'sergeant') {
        var cap = squad.captains[mySquad.captainName];
        if (cap && cap.sergeants[mySquad.sergeantName]) {
            myUnits = myUnits.concat(cap.sergeants[mySquad.sergeantName].units);
        }
    }
    
    if (myUnits.length === 0) { setMessage('❌ У вас нет привязанных юнитов.'); return false; }
    
    var speedPerZone = 2;
    var hasC = false, hasS = false;
    myUnits.forEach(function(u) { if(u.siege)hasS=true; else if(u.horse||u.type==='rider'||u.type==='heavy_rider'||u.type==='knight')hasC=true; });
    if (hasS) speedPerZone = 5; else if (hasC) speedPerZone = 1;
    
    var path = findPath(currentZoneId, targetZoneId);
    var marchId = 'player_' + Date.now() + '_' + Math.floor(Math.random()*1000);
    var marchData = {
        id: marchId, units: myUnits.slice(), path: path, currentStep: 0,
        action: 'move', houseId: houseId, speedPerZone: speedPerZone,
        moveTimeMs: speedPerZone * 60 * 1000, waitTimeMs: 10000,
        phase: 'waiting', nextPhaseTime: Date.now() + 10000,
        isPlayerMove: true, playerName: currentUser,
        squadId: mySquad.commanderName,
        captainId: mySquad.captainName || null,
        sergeantId: mySquad.sergeantName || null
    };
    
    var garrison = window._castleGarrisons[houseId];
    if (!garrison.marching) garrison.marching = [];
    garrison.marching.push(marchData);
    
    if (mySquad.role === 'commander') { squad.units = []; }
    else if (mySquad.role === 'captain') { squad.captains[mySquad.captainName].units = []; }
    else if (mySquad.role === 'sergeant') { squad.captains[mySquad.captainName].sergeants[mySquad.sergeantName].units = []; }
    
    saveData();
    setMessage('✅ Ваши войска выдвинулись!');
    processMarchStep(marchId);
    return true;
};

// ============================================================
// СБОР ВСЕХ ВОЙСК КОМАНДОРА
// ============================================================

window.rallySquadTo = function(cmdName, targetZoneId) {
    var houseId = users[currentUser].game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad) { setMessage('❌ Командор не найден.'); return; }
    
    var garrison = window._castleGarrisons[houseId];
    var allUnits = [];
    
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (garrison[cat]) {
            for (var i = garrison[cat].length - 1; i >= 0; i--) {
                var u = garrison[cat][i];
                if ((u.squadId === cmdName || u.commander === cmdName) && !u.isScout) {
                    allUnits.push(garrison[cat].splice(i, 1)[0]);
                }
            }
        }
    });
    
    if (allUnits.length === 0) { setMessage('❌ Нет привязанных войск.'); return; }
    
    var speedPerZone = 2;
    var hasC = false, hasS = false;
    allUnits.forEach(function(u) { if(u.siege)hasS=true; else if(u.horse||u.type==='rider'||u.type==='heavy_rider'||u.type==='knight')hasC=true; });
    if (hasS) speedPerZone = 5; else if (hasC) speedPerZone = 1;
    
    var currentLoc = squad.location === 'castle' ? 'bl_-1_0' : squad.location;
    var path = findPath(currentLoc, targetZoneId);
    
    var marchId = 'rally_' + Date.now() + '_' + Math.floor(Math.random()*1000);
    var marchData = {
        id: marchId, units: allUnits, path: path, currentStep: 0,
        action: 'move', houseId: houseId, speedPerZone: speedPerZone,
        moveTimeMs: speedPerZone * 60 * 1000, waitTimeMs: 10000,
        phase: 'waiting', nextPhaseTime: Date.now() + 10000,
        isSquad: true, squadId: cmdName, isRally: true
    };
    
    if (!garrison.marching) garrison.marching = [];
    garrison.marching.push(marchData);
    
    squad.units = [];
    for (var capName in squad.captains) {
        squad.captains[capName].units = [];
        for (var sgtName in squad.captains[capName].sergeants) {
            squad.captains[capName].sergeants[sgtName].units = [];
        }
    }
    
    saveData();
    addHouseLog(houseId, '📦 Сбор войск ' + cmdName + ' → ' + getZoneName(targetZoneId));
    processMarchStep(marchId);
};

// ============================================================
// КЛИК ПО ЗОНЕ НА КАРТЕ МИРА (ИСПРАВЛЕНО — СБОР РАБОТАЕТ)
// ============================================================

window.handleZoneClick = function(zoneId) {
    if (!zoneId) return;
    
    var user = users[currentUser];
    if (!user) return;
    
    var zone = WORLD_AREAS[zoneId];
    var zoneName = zone ? zone.name : zoneId;
    
    if (zone && (zone.type === 'river' || zone.type === 'sea' || zone.type === 'shallows' || zone.type === 'abyss' || zone.type === 'maelstrom' || zone.type === 'bay' || zone.type === 'reef')) return;
    
    var houseId = user.game.house;
    
    // ПРОВЕРКА НА СБОР — ДО ВСЕГО ОСТАЛЬНОГО
    if (window._awaitingTarget && window._targetData && window._targetData.isRally) {
        var data = window._targetData;
        window._awaitingTarget = false;
        window._targetData = null;
        
        if (data.rallyAll) {
            window.rallySquadTo(data.commanderName, zoneId);
            setMessage('📦 Войска командора ' + data.commanderName + ' выдвигаются в точку сбора.');
        } else if (data.rallySelected) {
            rallySelectedUnits(data.rallySelected, zoneId);
        }
        return;
    }
    
    // РЕЖИМ ВЫБОРА ЦЕЛИ (обычный)
    if (window._awaitingTarget && houseId) {
        var fromZone = WORLD_AREAS[window._targetData.fromZone];
        var dist = 0;
        if (zone && fromZone) dist = Math.abs(zone.x - fromZone.x) + Math.abs(zone.y - fromZone.y);
        var isWater = zone && (zone.type === 'river' || zone.type === 'sea' || zone.type === 'shallows');
        var targetZoneId = zoneId;
        
        if (isWater) { setMessage('⛵ Нельзя отправить войска на воду.'); return; }
        
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
                    if (g[cat]) g[cat].forEach(function(u) { if (u.location === targetZoneId && !u.isScout) hasEnemy = true; });
                });
            }
            if (hasEnemy) actions.push({ id: 'scout', label: '🔍 Разведка (50% риск)', desc: 'Разведчик может погибнуть' });
        } else {
            if (isOwnZone) actions.push({ id: 'defend', label: '🛡️ Защита', desc: 'Занять оборону' });
            else actions.push({ id: 'attack', label: '⚔️ Атака', desc: 'Атаковать и захватить' });
        }
        
        var targetZoneName = zoneName;
        var fromZoneName = fromZone ? fromZone.name : window._targetData.fromZone;
        
        var modal = document.getElementById('modal-confirm-move');
        if (!modal) {
            var overlay = document.createElement('div');
            overlay.id = 'modal-confirm-move'; overlay.className = 'modal-overlay hide';
            overlay.onclick = function(e) { if (e.target === this) window.closeConfirmMove(); };
            overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📋 ПОДТВЕРЖДЕНИЕ</h3><button class="close-btn" onclick="window.closeConfirmMove()">✕</button></div><div id="modal-confirm-move-content"></div></div>';
            document.body.appendChild(overlay); modal = overlay;
        }
        
        var content = document.getElementById('modal-confirm-move-content');
        var h = '<div class="modal-section"><h4>🎯 ' + fromZoneName + ' → ' + targetZoneName + '</h4>';
        h += '<p style="color:#6a5a48;">Дистанция: ' + dist + ' зон (~' + timeMinutes + ' мин)</p>';
        h += '<p style="color:#6a5a48;">Владелец цели: ' + (zone && zone.owner ? zone.owner : 'ничья') + '</p>';
        h += '</div><div class="modal-section"><h4>⚡ ДЕЙСТВИЕ</h4>';
        actions.forEach(function(a) { h += '<button class="btn btn-game" onclick="window.confirmTarget(\'' + targetZoneId + '\',\'' + a.id + '\',' + timeMinutes + ')" style="margin:4px 0;">' + a.label + '</button><br>'; });
        h += '</div><button class="btn btn-secondary" onclick="window.closeConfirmMove(); window._awaitingTarget=false;">Отмена</button>';
        content.innerHTML = h; modal.classList.remove('hide');
        return;
    }
    
    // ОБЫЧНЫЙ РЕЖИМ
    if (!houseId) { showZoneInfoPublic(zoneId, zoneName); return; }
    
    var ownUnits = getOwnUnitsInZone(zoneId, houseId);
    var enemyScouts = findEnemyScoutsInZone(zoneId, houseId);
    
    if (ownUnits.length === 0 && ownUnits.scouts.length === 0) {
        var enemies = findEnemiesInZone(zoneId, houseId);
        if (enemies.length > 0) showEnemyInfo(zoneId, zoneName, enemies);
        else showZoneInfoPublic(zoneId, zoneName);
        return;
    }
    
    showOwnUnitsModal(zoneId, zoneName, ownUnits, houseId, enemyScouts);
};

// ============================================================
// rallySelectedUnits
// ============================================================

function rallySelectedUnits(selected, targetZoneId) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var mySquad = window.getMySquad();
    if (!mySquad) return;
    
    var squad = mySquad.squad;
    var garrison = window._castleGarrisons[houseId];
    var allUnits = [];
    
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (garrison[cat]) {
            for (var i = garrison[cat].length - 1; i >= 0; i--) {
                var u = garrison[cat][i];
                if (!u.isScout && u.squadId === mySquad.commanderName) {
                    var shouldTake = false;
                    
                    if (selected.indexOf('commander_units') !== -1 && u.commander === currentUser && !u.captainId) shouldTake = true;
                    if (selected.indexOf('captain_units') !== -1 && u.captainId === currentUser && !u.sergeantId) shouldTake = true;
                    
                    for (var si = 0; si < selected.length; si++) {
                        var s = selected[si];
                        if (s.indexOf('captain_') === 0 && u.captainId === s.replace('captain_', '')) shouldTake = true;
                        if (s.indexOf('sergeant_') === 0) {
                            var parts = s.replace('sergeant_', '').split('_');
                            if (u.sergeantId === parts[parts.length-1] && u.captainId === parts.slice(0, -1).join('_')) shouldTake = true;
                        }
                    }
                    
                    if (shouldTake) allUnits.push(garrison[cat].splice(i, 1)[0]);
                }
            }
        }
    });
    
    if (allUnits.length === 0) { setMessage('❌ Нет выбранных юнитов.'); return; }
    
    var speedPerZone = 2;
    var hasC = false, hasS = false;
    allUnits.forEach(function(u) { if(u.siege)hasS=true; else if(u.horse||u.type==='rider'||u.type==='heavy_rider'||u.type==='knight')hasC=true; });
    if (hasS) speedPerZone = 5; else if (hasC) speedPerZone = 1;
    
    var currentLoc = squad.location === 'castle' ? 'bl_-1_0' : squad.location;
    var path = findPath(currentLoc, targetZoneId);
    var marchId = 'rally_select_' + Date.now() + '_' + Math.floor(Math.random()*1000);
    var marchData = {
        id: marchId, units: allUnits, path: path, currentStep: 0,
        action: 'move', houseId: houseId, speedPerZone: speedPerZone,
        moveTimeMs: speedPerZone * 60 * 1000, waitTimeMs: 10000,
        phase: 'waiting', nextPhaseTime: Date.now() + 10000,
        isSquad: true, squadId: mySquad.commanderName, isRally: true
    };
    
    if (!garrison.marching) garrison.marching = [];
    garrison.marching.push(marchData);
    
    saveData();
    setMessage('📦 ' + allUnits.length + ' юнитов выдвигаются в точку сбора.');
    addHouseLog(houseId, '📦 Сбор ' + allUnits.length + ' юнитов → ' + getZoneName(targetZoneId));
    processMarchStep(marchId);
}

// ============================================================
// ИНФО О ЗОНЕ
// ============================================================

function showZoneInfoPublic(zoneId, zoneName) {
    var zone = WORLD_AREAS[zoneId];
    var modal = document.getElementById('modal-zone-info');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-zone-info'; overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) window.closeZoneInfo(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📍 ЗОНА</h3><button class="close-btn" onclick="window.closeZoneInfo()">✕</button></div><div id="modal-zone-info-content"></div></div>';
        document.body.appendChild(overlay); modal = overlay;
    }
    var content = document.getElementById('modal-zone-info-content');
    var h = '<div class="modal-section"><h4>📍 ' + zoneName + '</h4>';
    if (zone) {
        h += '<div class="row"><span class="label">Тип</span><span class="value">' + zone.type + '</span></div>';
        h += '<div class="row"><span class="label">Уровень</span><span class="value">' + (zone.level||1) + '</span></div>';
        h += '<div class="row"><span class="label">Владелец</span><span class="value">' + (zone.owner==='crown'?'👑 Корона':zone.owner||'Ничья') + '</span></div>';
        if (zone.x !== undefined) h += '<div class="row"><span class="label">Координаты</span><span class="value">[' + zone.x + ', ' + zone.y + ']</span></div>';
    }
    h += '</div><button class="btn btn-secondary" onclick="window.closeZoneInfo()">Закрыть</button>';
    content.innerHTML = h; modal.classList.remove('hide');
}

function showEnemyInfo(zoneId, zoneName, enemies) {
    var modal = document.getElementById('modal-zone-info');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-zone-info'; overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) window.closeZoneInfo(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📍 ЗОНА</h3><button class="close-btn" onclick="window.closeZoneInfo()">✕</button></div><div id="modal-zone-info-content"></div></div>';
        document.body.appendChild(overlay); modal = overlay;
    }
    var content = document.getElementById('modal-zone-info-content');
    var h = '<div class="modal-section"><h4>📍 ' + zoneName + '</h4>';
    h += '<p style="color:#c96a5a;">🔴 ОБНАРУЖЕНЫ ВРАГИ</p>';
    var ec = {}; enemies.forEach(function(e) { var hh=HOUSES[e.house]; var n=hh?hh.sigil+' '+hh.name:e.house; if(!ec[n])ec[n]=0; ec[n]++; });
    for (var n in ec) h += '<div class="row"><span class="label">'+n+'</span><span class="value">~'+ec[n]+' юнитов</span></div>';
    h += '</div><button class="btn btn-secondary" onclick="window.closeZoneInfo()">Закрыть</button>';
    content.innerHTML = h; modal.classList.remove('hide');
}

// ============================================================
// СБОР ВОЙСК В ЗОНЕ
// ============================================================

function getOwnUnitsInZone(zoneId, houseId) {
    var result = { commanders:[], captains:[], sergeants:[], unattached:[], scouts:[], length:0 };
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry:[], cavalry:[], siege:[] };
    var allUnits = [];
    var zone = WORLD_AREAS[zoneId];
    var isCastle = zone && (zone.type==='castle'||zone.type==='castle_gate');
    
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (garrison[cat]) garrison[cat].forEach(function(u) {
            if (u.location===zoneId||(isCastle&&u.location==='castle')) allUnits.push({unit:u,category:cat});
        });
    });
    
    // Добавляем юнитов из squads которые в этой зоне
    if (isCastle || zoneId === 'bl_-1_0') {
        var squads = window.getSquads(houseId);
        for (var cmdName in squads) {
            var squad = squads[cmdName];
            if (squad.location === 'castle' || squad.location === zoneId) {
                squad.units.forEach(function(u) { allUnits.push({unit:u,category:'infantry',squadUnit:true}); });
                for (var capName in squad.captains) {
                    squad.captains[capName].units.forEach(function(u) { allUnits.push({unit:u,category:'infantry',squadUnit:true}); });
                    for (var sgtName in squad.captains[capName].sergeants) {
                        squad.captains[capName].sergeants[sgtName].units.forEach(function(u) { allUnits.push({unit:u,category:'infantry',squadUnit:true}); });
                    }
                }
            }
        }
    }
    
    var cmdMap={}, capMap={}, sgtMap={}, unattached=[], scouts=[];
    
    allUnits.forEach(function(item) {
        var u = item.unit;
        if (u.isScout) { scouts.push(item); return; }
        
        if (u.squadId) {
            if (!cmdMap[u.squadId]) cmdMap[u.squadId] = { name: u.squadId, units: [], isSquad: true };
            cmdMap[u.squadId].units.push(item);
        } else if (u.commander) {
            var rank = getCommanderRank(u.commander, houseId);
            if (rank==='knight_commander') {
                if (!cmdMap[u.commander]) cmdMap[u.commander] = { name: u.commander, units: [], isSquad: false };
                cmdMap[u.commander].units.push(item);
            } else if (rank==='captain_officer') {
                if (!capMap[u.commander]) capMap[u.commander] = { name: u.commander, units: [] };
                capMap[u.commander].units.push(item);
            } else if (rank==='sergeant') {
                if (!sgtMap[u.commander]) sgtMap[u.commander] = { name: u.commander, units: [] };
                sgtMap[u.commander].units.push(item);
            } else unattached.push(item);
        } else unattached.push(item);
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
        var g=window._castleGarrisons[hid];
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (g[cat]) g[cat].forEach(function(u) {
                if (u.location===zoneId&&u.isScout) scouts.push({unit:u,house:hid});
            });
        });
    }
    return scouts;
}

// ============================================================
// МОДАЛКА ВОЙСК
// ============================================================

window.currentMovingCommander = null;

window.closeOwnUnitsModal = function() {
    var m = document.getElementById('modal-own-units');
    if (m) m.classList.add('hide');
};

function showOwnUnitsModal(zoneId, zoneName, ownUnits, houseId, enemyScouts) {
    var modal = document.getElementById('modal-own-units');
    if (!modal) {
        var o = document.createElement('div'); o.id='modal-own-units'; o.className='modal-overlay hide';
        o.onclick = function(e) { if(e.target===this)window.closeOwnUnitsModal(); };
        o.innerHTML = '<div class="modal-box" style="max-height:90vh;overflow-y:auto;"><div class="modal-header"><h3>⚔️ ВОЙСКА В ЗОНЕ</h3><button class="close-btn" onclick="window.closeOwnUnitsModal()">✕</button></div><div id="modal-own-units-content"></div></div>';
        document.body.appendChild(o); modal = o;
    }
    
    var c = document.getElementById('modal-own-units-content');
    var h = '<div class="modal-section"><h4>📍 ' + zoneName + '</h4>';
    h += '<p style="color:#6a5a48;">Выберите отряд или войска для отправки</p></div>';
    
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
            var ut=window.UNIT_TYPES?window.UNIT_TYPES[item.unit.type]:null;
            h += '<div class="row"><span class="label">👁️ '+(ut?ut.emoji+' '+ut.name:item.unit.type)+'</span><span class="value">';
            h += '<button class="btn btn-small" onclick="window.selectScoutForMove(\''+zoneId+'\','+i+')">🚶</button> ';
            h += '<button class="btn btn-small" onclick="window.mergeScout('+i+',\''+zoneId+'\')">🔗</button></span></div>';
        });
        h += '</div>';
    }
    
    if (ownUnits.commanders.length > 0) {
        h += '<div class="modal-section"><h4>👑 ОТРЯДЫ / КОМАНДОРЫ</h4>';
        ownUnits.commanders.forEach(function(cmd) {
            var totalUnits = cmd.units.length;
            var isSquad = cmd.isSquad;
            var icon = isSquad ? '👑' : '⭐';
            h += '<div class="row" style="padding:8px 0; border-bottom:1px solid #1a1410;">';
            h += '<span class="label">' + icon + ' ' + cmd.name + ' — ' + totalUnits + ' юнитов</span>';
            h += '<span class="value">';
            if (isSquad && cmd.name === currentUser) {
                h += '<button class="btn btn-small" onclick="window.moveSquadFromModal(\'' + zoneId + '\')">🚶 Отправить отряд</button>';
            } else {
                h += '<button class="btn btn-small" onclick="window.selectCommanderForMove(\'' + zoneId + '\',\'knight_commander\',\'' + cmd.name + '\')">🚶 Отправить</button>';
            }
            h += '</span></div>';
        });
        h += '</div>';
    }
    
    if (ownUnits.captains.length > 0) {
        h += '<div class="modal-section"><h4>🗡️ КАПИТАНЫ</h4>';
        ownUnits.captains.forEach(function(cap) {
            h += '<div class="row"><span class="label">🗡️ ' + cap.name + ' — ' + cap.units.length + ' юнитов</span>';
            h += '<span class="value"><button class="btn btn-small" onclick="window.selectCommanderForMove(\'' + zoneId + '\',\'captain_officer\',\'' + cap.name + '\')">🚶</button></span></div>';
        });
        h += '</div>';
    }
    
    if (ownUnits.sergeants.length > 0) {
        h += '<div class="modal-section"><h4>🛡️ СЕРЖАНТЫ</h4>';
        ownUnits.sergeants.forEach(function(sgt) {
            h += '<div class="row"><span class="label">🛡️ ' + sgt.name + ' — ' + sgt.units.length + ' юнитов</span>';
            h += '<span class="value"><button class="btn btn-small" onclick="window.selectCommanderForMove(\'' + zoneId + '\',\'sergeant\',\'' + sgt.name + '\')">🚶</button></span></div>';
        });
        h += '</div>';
    }
    
    if (ownUnits.unattached.length > 0) {
        h += '<div class="modal-section"><h4>📦 НЕПРИВЯЗАННЫЕ</h4>';
        var utypes = {};
        ownUnits.unattached.forEach(function(item) { var t=item.unit.type; if(!utypes[t])utypes[t]=0; utypes[t]++; });
        if (!window._selectedUnitTypes) window._selectedUnitTypes = {};
        for (var t in utypes) {
            var ut=window.UNIT_TYPES?window.UNIT_TYPES[t]:null;
            window._selectedUnitTypes[t]=utypes[t];
            h += '<div class="row"><span class="label">'+(ut?ut.emoji+' '+ut.name:t)+'</span><span class="value">×'+utypes[t]+' <input type="number" class="unattached-count" data-type="'+t+'" value="'+utypes[t]+'" min="1" max="'+utypes[t]+'" style="width:50px;" onchange="window._selectedUnitTypes[\''+t+'\']=parseInt(this.value)||0;"></span></div>';
        }
        h += '<button class="btn btn-small" onclick="window.selectUnattachedForMove(\''+zoneId+'\')">🚶 Отправить</button> ';
        h += '<button class="btn btn-small" onclick="window.detachScout(\''+zoneId+'\')">👁️ Разведчик</button>';
        h += '</div>';
    }
    
    h += '</div><button class="btn btn-secondary" onclick="window.closeOwnUnitsModal()">Закрыть</button>';
    c.innerHTML = h; modal.classList.remove('hide');
}

window.moveSquadFromModal = function(zoneId) {
    window.currentMovingCommander = { zoneId: zoneId, type: 'squad' };
    window._awaitingTarget = true;
    window._targetData = { fromZone: zoneId, isScout: false, isSquad: true };
    window.closeOwnUnitsModal();
    setMessage('🎯 Выберите целевую зону для отряда.');
};

// ============================================================
// РАЗВЕДЧИКИ
// ============================================================

window.attackEnemyScout = function(zoneId, enemyIndex) {
    var user=users[currentUser]; var houseId=user.game.house;
    var enemyScouts=findEnemyScoutsInZone(zoneId, houseId);
    if(enemyIndex>=enemyScouts.length){setMessage('❌ Не найден.');return;}
    var enemy=enemyScouts[enemyIndex];
    if(Math.random()<0.5){
        var eg=window._castleGarrisons[enemy.house];
        if(eg)['infantry','cavalry','siege'].forEach(function(cat){if(eg[cat])for(var i=eg[cat].length-1;i>=0;i--)if(eg[cat][i]===enemy.unit){eg[cat].splice(i,1);break;}});
        saveData();setMessage('⚔️ Вражеский разведчик уничтожен!');
    } else {
        var og=window._castleGarrisons[houseId];
        if(og)['infantry','cavalry','siege'].forEach(function(cat){if(og[cat])for(var i=og[cat].length-1;i>=0;i--)if(og[cat][i].location===zoneId&&og[cat][i].isScout){og[cat].splice(i,1);break;}});
        saveData();setMessage('💀 Ваш разведчик убит.');
    }
    window.closeOwnUnitsModal();updateMenu();
};

window.mergeScout = function(scoutIndex, zoneId) {
    var user=users[currentUser];var houseId=user.game.house;
    var garrison=window._castleGarrisons[houseId];
    var scout=null;
    ['infantry','cavalry','siege'].forEach(function(cat){
        if(!scout&&garrison[cat]){var cnt=0;for(var i=garrison[cat].length-1;i>=0;i--){if(garrison[cat][i].location===zoneId&&garrison[cat][i].isScout){if(cnt===scoutIndex){scout=garrison[cat][i];break;}cnt++;}}}
    });
    if(!scout){setMessage('❌ Не найден.');return;}
    scout.isScout=false;scout.scoutHome=null;saveData();window.closeOwnUnitsModal();setMessage('✅ Разведчик возвращён в отряд.');
};

window.detachScout = function(zoneId) {
    var user=users[currentUser];var houseId=user.game.house;
    var garrison=window._castleGarrisons[houseId];
    var zone=WORLD_AREAS[zoneId];var isCastle=zone&&(zone.type==='castle'||zone.type==='castle_gate');
    var scout=null;
    ['infantry','cavalry','siege'].forEach(function(cat){
        if(!scout&&garrison[cat]){for(var i=garrison[cat].length-1;i>=0;i--){var u=garrison[cat][i];if((u.location===zoneId||(isCastle&&u.location==='castle'))&&!u.commander&&!u.isScout){scout=garrison[cat].splice(i,1)[0];break;}}}
    });
    if(!scout){setMessage('❌ Нет свободных.');return;}
    scout.isScout=true;scout.scoutHome=isCastle?'castle':zoneId;
    if(scout.siege)garrison.siege.push(scout);else if(scout.horse||scout.type==='rider'||scout.type==='heavy_rider'||scout.type==='knight')garrison.cavalry.push(scout);else garrison.infantry.push(scout);
    saveData();window.closeOwnUnitsModal();setMessage('👁️ Разведчик отделён.');
};

// ============================================================
// ВЫБОР ДЛЯ ОТПРАВКИ
// ============================================================

window.selectCommanderForMove = function(zoneId, rank, name) {
    window.currentMovingCommander = {zoneId:zoneId,rank:rank,name:name,type:'commander'};
    window._awaitingTarget = true; window._targetData = {fromZone:zoneId,isScout:false,commander:true};
    window.closeOwnUnitsModal(); setMessage('🎯 Выберите целевую зону.');
};

window.selectScoutForMove = function(zoneId, scoutIndex) {
    window.currentMovingCommander = {zoneId:zoneId,type:'scout',scoutIndex:scoutIndex};
    window._awaitingTarget = true; window._targetData = {fromZone:zoneId,isScout:true,scoutIndex:scoutIndex};
    window.closeOwnUnitsModal(); setMessage('🎯 Выберите целевую зону.');
};

window.selectUnattachedForMove = function(zoneId) {
    window.currentMovingCommander = {zoneId:zoneId,type:'unattached'};
    window._awaitingTarget = true; window._targetData = {fromZone:zoneId,isScout:false,commander:false};
    window.closeOwnUnitsModal(); setMessage('🎯 Выберите целевую зону.');
};

// ============================================================
// ПОДТВЕРЖДЕНИЕ И ОТПРАВКА
// ============================================================

window.confirmTarget = function(targetZoneId, action, timeMinutes) {
    var data = window._targetData;
    if (!data) { setMessage('❌ Нет данных.'); return; }
    
    window._awaitingTarget = false;
    window._targetData = null;
    
    if (data.isRally) {
        window.closeConfirmMove();
        return;
    }
    
    if (data.isSquad) {
        window.closeConfirmMove();
        window.moveSquad(targetZoneId, action);
        return;
    }
    
    window.confirmMovement(data.fromZone, targetZoneId, action, timeMinutes, data.isScout);
    window.closeConfirmMove();
};

window.closeConfirmMove = function() {
    var m = document.getElementById('modal-confirm-move');
    if (m) m.classList.add('hide');
};

window.confirmMovement = function(fromZoneId, targetZoneId, action, timeMinutes, isScout) {
    var user=users[currentUser]; var houseId=user.game.house;
    var garrison=window._castleGarrisons[houseId];
    if (!garrison) garrison = { infantry:[], cavalry:[], siege:[], marching:[] };
    var takenUnits=[]; var commander=window.currentMovingCommander; if(!isScout)isScout=false;
    var zone=WORLD_AREAS[fromZoneId]; var isCastle=zone&&(zone.type==='castle'||zone.type==='castle_gate');
    
    if (commander.type==='commander') {
        ['infantry','cavalry','siege'].forEach(function(cat){
            if(garrison[cat])for(var i=garrison[cat].length-1;i>=0;i--){
                var u=garrison[cat][i];
                if((u.location===fromZoneId||(isCastle&&u.location==='castle'))&&u.commander===commander.name&&!u.isScout)
                    takenUnits.push(garrison[cat].splice(i,1)[0]);
            }
        });
        if(commander.rank==='knight_commander'||commander.rank==='captain_officer'){
            ['infantry','cavalry','siege'].forEach(function(cat){
                if(garrison[cat])for(var i=garrison[cat].length-1;i>=0;i--){
                    var u=garrison[cat][i];
                    if((u.location===fromZoneId||(isCastle&&u.location==='castle'))&&u.commander&&u.commander!==commander.name&&!u.isScout&&takenUnits.indexOf(u)===-1)
                        takenUnits.push(garrison[cat].splice(i,1)[0]);
                }
            });
        }
    } else if (commander.type==='unattached') {
        var selectedTypes=window._selectedUnitTypes||{};
        for(var type in selectedTypes){
            var count=selectedTypes[type];var taken=0;
            ['infantry','cavalry','siege'].forEach(function(cat){
                if(garrison[cat])for(var i=garrison[cat].length-1;i>=0&&taken<count;i--){
                    var u=garrison[cat][i];
                    if((u.location===fromZoneId||(isCastle&&u.location==='castle'))&&u.type===type&&!u.commander&&!u.isScout){
                        takenUnits.push(garrison[cat].splice(i,1)[0]);taken++;
                    }
                }
            });
        }
        window._selectedUnitTypes={};
    } else if (commander.type==='scout') {
        ['infantry','cavalry','siege'].forEach(function(cat){
            if(!takenUnits.length&&garrison[cat]){
                var cnt=0;
                for(var i=garrison[cat].length-1;i>=0;i--){
                    var u=garrison[cat][i];
                    if((u.location===commander.zoneId||(isCastle&&u.location==='castle'))&&garrison[cat][i].isScout){
                        if(cnt===commander.scoutIndex){takenUnits.push(garrison[cat].splice(i,1)[0]);break;}cnt++;
                    }
                }
            }
        });
    }
    
    if(takenUnits.length===0){setMessage('❌ Не удалось забрать юнитов.');return;}
    
    var speedPerZone=2;
    if(!isScout&&takenUnits.length>0){
        var hasC=false,hasS=false,hasI=false;
        takenUnits.forEach(function(u){if(u.siege)hasS=true;else if(u.horse||u.type==='rider'||u.type==='heavy_rider'||u.type==='knight')hasC=true;else hasI=true;});
        if(hasS)speedPerZone=5;else if(hasC&&!hasI)speedPerZone=1;
    }
    
    var path=findPath(fromZoneId,targetZoneId);
    var moveTimeMs=speedPerZone*60*1000;var waitTimeMs=10000;
    var marchId='march_'+Date.now()+'_'+Math.floor(Math.random()*1000);
    var marchData={
        id:marchId,units:takenUnits,path:path,currentStep:0,
        action:action,houseId:houseId,speedPerZone:speedPerZone,
        moveTimeMs:moveTimeMs,waitTimeMs:waitTimeMs,
        phase:'waiting',nextPhaseTime:Date.now()+waitTimeMs,isScout:isScout,
        squadId: commander.squadId || null,
        captainId: commander.captainId || null,
        sergeantId: commander.sergeantId || null
    };
    if(!garrison.marching)garrison.marching=[];
    garrison.marching.push(marchData);
    
    saveData();
    setMessage('✅ Отряд выступил! '+takenUnits.length+' юнитов, '+(path.length-1)+' зон.');
    addHouseLog(houseId,'🚶 Отряд в '+getZoneName(targetZoneId));
    processMarchStep(marchId);
};

// ============================================================
// ПОШАГОВОЕ ДВИЖЕНИЕ
// ============================================================

function processMarchStep(marchId) {
    var marchData=null,garrison=null;
    for(var hid in window._castleGarrisons){
        var g=window._castleGarrisons[hid];
        if(g.marching)for(var i=0;i<g.marching.length;i++){if(g.marching[i].id===marchId){marchData=g.marching[i];garrison=g;break;}}
        if(marchData)break;
    }
    if(!marchData)return;
    var now=Date.now();
    if(now<marchData.nextPhaseTime){setTimeout(function(){processMarchStep(marchId);},marchData.nextPhaseTime-now);return;}
    
    if(marchData.phase==='waiting'){
        marchData.phase='moving';marchData.nextPhaseTime=Date.now()+marchData.moveTimeMs;
        saveData();updateMenu();
        setTimeout(function(){processMarchStep(marchId);},marchData.moveTimeMs);return;
    }
    
    if(marchData.phase==='moving'){
        marchData.currentStep++;
        
        if(marchData.currentStep>=marchData.path.length-1){
            var idx=garrison.marching.indexOf(marchData);
            if(idx!==-1)garrison.marching.splice(idx,1);
            
            var targetZone=WORLD_AREAS[marchData.path[marchData.path.length-1]];
            var action=marchData.action;var units=marchData.units;
            
            if(marchData.isScout&&action==='scout'){
                if(Math.random()<0.5){
                    var enemies=findEnemiesInZone(targetZone.id,marchData.houseId);
                    var info='🔍 РАЗВЕДКА!\n\nВраги:\n';
                    if(enemies.length===0)info+='Нет.';
                    else{var ec={};enemies.forEach(function(e){var hh=HOUSES[e.house];var n=hh?hh.sigil+' '+hh.name:e.house;if(!ec[n])ec[n]=0;ec[n]++;});
                    for(var n in ec)info+=n+': ~'+ec[n]+' юнитов\n';}
                    var homeZone=units[0].scoutHome||marchData.path[0];
                    units.forEach(function(u){u.location=homeZone;u.isScout=true;returnUnit(u,window._castleGarrisons[marchData.houseId]);});
                    saveData();alert(info);setMessage('👁️ Разведка успешна!');
                }else{saveData();setMessage('💀 Разведчик погиб.');}
            } else {
                if (marchData.isSquad || marchData.isRally) {
                    returnSquadUnits(marchData, targetZone);
                } else if (marchData.isPlayerMove) {
                    returnPlayerUnits(marchData, targetZone);
                } else {
                    var enemies=findEnemiesInZone(targetZone.id,marchData.houseId);
                    if(enemies.length>0)resolveBattle(units,enemies,targetZone.id,marchData.houseId,action);
                    else{
                        if(action==='attack'&&targetZone)targetZone.owner=marchData.houseId;
                        var isCastleZone=targetZone&&(targetZone.type==='castle'||targetZone.type==='castle_gate');
                        var newLoc = isCastleZone?'castle':targetZone.id;
                        
                        if (marchData.squadId) {
                            var squads = window.getSquads(marchData.houseId);
                            var squad = squads[marchData.squadId];
                            if (squad) {
                                squad.location = newLoc;
                                units.forEach(function(u) {
                                    u.location = newLoc;
                                    u.stance = action==='defend'?'defending':'moving';
                                    if (u.sergeantId && squad.captains[u.captainId] && squad.captains[u.captainId].sergeants[u.sergeantId]) {
                                        squad.captains[u.captainId].sergeants[u.sergeantId].units.push(u);
                                    } else if (u.captainId && squad.captains[u.captainId]) {
                                        squad.captains[u.captainId].units.push(u);
                                    } else {
                                        squad.units.push(u);
                                    }
                                });
                            } else {
                                units.forEach(function(u) {
                                    u.location = newLoc; u.stance = 'moving';
                                    returnUnit(u, window._castleGarrisons[marchData.houseId]);
                                });
                            }
                        } else {
                            units.forEach(function(u){
                                u.location = newLoc;
                                u.stance = action==='defend'?'defending':'moving';
                                if(marchData.isScout){u.isScout=true;u.scoutHome=u.scoutHome||marchData.path[0];}
                                returnUnit(u,window._castleGarrisons[marchData.houseId]);
                            });
                        }
                        saveData();setMessage('✅ Отряд прибыл в '+getZoneName(targetZone.id));
                    }
                }
            }
            updateMenu();return;
        }
        
        marchData.phase='waiting';marchData.nextPhaseTime=Date.now()+marchData.waitTimeMs;
        saveData();updateMenu();
        setTimeout(function(){processMarchStep(marchId);},marchData.waitTimeMs);
    }
}

function returnSquadUnits(marchData, targetZone) {
    var houseId = marchData.houseId;
    var squads = window.getSquads(houseId);
    var squad = squads[marchData.squadId || marchData.commanderName];
    var isCastleZone = targetZone && (targetZone.type==='castle'||targetZone.type==='castle_gate');
    var newLocation = isCastleZone ? 'castle' : targetZone.id;
    
    if (!squad) {
        marchData.units.forEach(function(u) {
            u.location = newLocation;
            u.stance = 'moving';
            returnUnit(u, window._castleGarrisons[houseId]);
        });
        saveData();
        setMessage('⚠️ Отряд расформирован, юниты возвращены в гарнизон.');
        return;
    }
    
    squad.location = newLocation;
    
    var enemies = findEnemiesInZone(targetZone.id, houseId);
    if (enemies.length > 0) {
        resolveBattle(marchData.units, enemies, targetZone.id, houseId, marchData.action);
    }
    
    if (marchData.action === 'attack' && targetZone && enemies.length === 0) {
        targetZone.owner = houseId;
    }
    
    marchData.units.forEach(function(u) {
        u.location = newLocation;
        u.stance = marchData.action === 'defend' ? 'defending' : 'moving';
        
        if (u.sergeantId && squad.captains[u.captainId] && squad.captains[u.captainId].sergeants[u.sergeantId]) {
            squad.captains[u.captainId].sergeants[u.sergeantId].units.push(u);
        } else if (u.captainId && squad.captains[u.captainId]) {
            squad.captains[u.captainId].units.push(u);
        } else {
            squad.units.push(u);
        }
    });
    
    saveData();
    setMessage('✅ Отряд прибыл в ' + getZoneName(targetZone.id));
    addHouseLog(houseId, '🚶 Отряд ' + (marchData.squadId || '') + ' прибыл в ' + getZoneName(targetZone.id));
}

function returnPlayerUnits(marchData, targetZone) {
    var houseId = marchData.houseId;
    var isCastleZone = targetZone && (targetZone.type==='castle'||targetZone.type==='castle_gate');
    var newLocation = isCastleZone ? 'castle' : targetZone.id;
    
    var squads = window.getSquads(houseId);
    var squad = squads[marchData.squadId];
    
    if (squad) {
        squad.location = newLocation;
        
        marchData.units.forEach(function(u) {
            u.location = newLocation;
            u.stance = 'moving';
            
            if (marchData.sergeantId && squad.captains[marchData.captainId] && squad.captains[marchData.captainId].sergeants[marchData.sergeantId]) {
                squad.captains[marchData.captainId].sergeants[marchData.sergeantId].units.push(u);
            } else if (marchData.captainId && squad.captains[marchData.captainId]) {
                squad.captains[marchData.captainId].units.push(u);
            } else {
                squad.units.push(u);
            }
        });
    } else {
        var garrison = window._castleGarrisons[houseId];
        marchData.units.forEach(function(u) {
            u.location = newLocation;
            u.stance = 'moving';
            returnUnit(u, garrison);
        });
    }
    
    saveData();
    setMessage('✅ Ваши войска прибыли в ' + getZoneName(targetZone.id));
}

function returnUnit(u, garrison) {
    if (u.siege) garrison.siege.push(u);
    else if (u.horse || u.type==='rider' || u.type==='heavy_rider' || u.type==='knight') garrison.cavalry.push(u);
    else garrison.infantry.push(u);
}

// ============================================================
// БОЙ
// ============================================================

function findEnemiesInZone(zoneId, myHouseId) {
    var enemies=[];
    for(var hid in window._castleGarrisons){
        if(hid===myHouseId)continue;
        if(HOUSES[hid]&&HOUSES[hid].liege===myHouseId)continue;
        var g=window._castleGarrisons[hid];
        ['infantry','cavalry','siege'].forEach(function(cat){
            if(g[cat])g[cat].forEach(function(u){
                if(u.location===zoneId&&u.stance==='defending'&&!u.isScout)enemies.push({unit:u,house:hid});
            });
        });
    }
    return enemies;
}

function resolveBattle(attackers, defenders, zoneId, attackerHouseId, action) {
    var attPower=attackers.length,defPower=defenders.length;
    var attRoll=attPower*(0.8+Math.random()*0.4),defRoll=defPower*(0.8+Math.random()*0.4)*1.2;
    var attackerGarrison=window._castleGarrisons[attackerHouseId];
    
    if(attRoll>defRoll){
        var attLosses=Math.max(1,Math.floor(attackers.length*0.3));
        for(var hid in window._castleGarrisons){
            var g=window._castleGarrisons[hid];
            ['infantry','cavalry','siege'].forEach(function(cat){
                if(g[cat])for(var i=g[cat].length-1;i>=0;i--)
                    if(g[cat][i].location===zoneId&&g[cat][i].stance==='defending')g[cat].splice(i,1);
            });
        }
        var lost=0;
        ['infantry','cavalry','siege'].forEach(function(cat){
            if(attackerGarrison[cat])for(var i=attackerGarrison[cat].length-1;i>=0&&lost<attLosses;i--){
                if(attackers.indexOf(attackerGarrison[cat][i])!==-1){attackerGarrison[cat].splice(i,1);lost++;}
            }
        });
        if(action==='attack'&&WORLD_AREAS[zoneId])WORLD_AREAS[zoneId].owner=attackerHouseId;
        var tz=WORLD_AREAS[zoneId];var isCastle=tz&&(tz.type==='castle'||tz.type==='castle_gate');
        attackers.forEach(function(u){
            if(u.location!==undefined){u.location=isCastle?'castle':zoneId;u.stance='moving';returnUnit(u,attackerGarrison);}
        });
        saveData();setMessage('⚔️ ПОБЕДА! Потери: '+attLosses);
    } else {
        var defLosses=Math.max(1,Math.floor(defenders.length*0.2));
        ['infantry','cavalry','siege'].forEach(function(cat){
            if(attackerGarrison[cat])for(var i=attackerGarrison[cat].length-1;i>=0;i--){
                if(attackers.indexOf(attackerGarrison[cat][i])!==-1)attackerGarrison[cat].splice(i,1);
            }
        });
        var lost=0;
        for(var hid in window._castleGarrisons){
            var g=window._castleGarrisons[hid];
            ['infantry','cavalry','siege'].forEach(function(cat){
                if(g[cat])for(var i=g[cat].length-1;i>=0&&lost<defLosses;i--){
                    if(g[cat][i].location===zoneId&&g[cat][i].stance==='defending'){g[cat].splice(i,1);lost++;}
                }
            });
        }
        saveData();setMessage('🛡️ ПОРАЖЕНИЕ!');
    }
    updateMenu();
}

function getZoneName(zoneId) {
    var z = WORLD_AREAS[zoneId];
    return z ? z.name : zoneId;
}

// ============================================================
// ВОССТАНОВЛЕНИЕ ТАЙМЕРОВ
// ============================================================

window.restoreMarchingTimers = function() {
    for(var hid in window._castleGarrisons){
        var g=window._castleGarrisons[hid];
        if(g.marching&&g.marching.length>0){
            g.marching=g.marching.filter(function(m){return m.path;});
            g.marching.forEach(function(m){processMarchStep(m.id);});
        }
    }
};

// ============================================================
// РЕГИСТРАЦИЯ ВСЕХ ФУНКЦИЙ
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

// Система отрядов
window.getSquads = getSquads;
window.getMySquad = getMySquad;
window.createSquad = createSquad;
window.disbandSquad = disbandSquad;
window.assignUnitsToCommander = assignUnitsToCommander;
window.unassignUnitsFromCommander = unassignUnitsFromCommander;
window.commanderAssignToCaptain = commanderAssignToCaptain;
window.lordAssignToCaptain = lordAssignToCaptain;
window.lordAssignToSergeant = lordAssignToSergeant;
window.captainAssignToSergeant = captainAssignToSergeant;
window.recallUnitsFromCaptain = recallUnitsFromCaptain;
window.captainRecallFromSergeant = captainRecallFromSergeant;
window.leaveSquad = leaveSquad;
window.rejoinSquad = rejoinSquad;
window.moveSquad = moveSquad;
window.movePlayerUnits = movePlayerUnits;
window.moveSquadFromModal = moveSquadFromModal;
window.rallySquadTo = rallySquadTo;
window.rallySelectedUnits = rallySelectedUnits;

// Вспомогательные
window.findPath = findPath;
window.getNeighborZones = getNeighborZones;
window.returnUnit = returnUnit;
window.findEnemiesInZone = findEnemiesInZone;
window.getZoneName = getZoneName;

setTimeout(function() {
    if (typeof window._castleGarrisons !== 'undefined') restoreMarchingTimers();
}, 1000);

console.log('🎯 Командование + PvP + Разведка + Марш + Отряды + Сбор (ПОЛНЫЙ ФИКС) загружены!');

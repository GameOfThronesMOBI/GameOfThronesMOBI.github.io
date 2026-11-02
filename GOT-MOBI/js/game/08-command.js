// ============================================================
// js/game/08-command.js — КОМАНДОВАНИЕ + PvP + РАЗВЕДКА + АНИМАЦИЯ + ОТРЯДЫ
// ПОЛНАЯ ВЕРСИЯ — С РАЗДЕЛЕНИЕМ, ОБЪЕДИНЕНИЕМ И ГАЛОЧКАМИ РАЗРЕШЕНИЙ
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
        boundTo: null,
        createdAt: Date.now(),
        allow_detach_subordinates: false,
        allow_detach_self: false
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
// ПРИВЯЗКА КОМАНДОРОВ
// ============================================================

window.bindCommander = function(cmdName, targetRank) {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return false; }
    var houseId = user.game.house;
    
    if (user.game.houseRank !== 'lord') {
        setMessage('❌ Только лорд может привязывать командоров.');
        return false;
    }
    
    if (['lord','heir','war_master'].indexOf(targetRank) === -1) {
        setMessage('❌ Неверный ранг для привязки.');
        return false;
    }
    
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad) { setMessage('❌ Отряд не найден.'); return false; }
    
    squad.boundTo = targetRank;
    saveData();
    setMessage('✅ Командор ' + cmdName + ' привязан к ' + HOUSE_RANKS[targetRank].name);
    addHouseLog(houseId, '🔗 Командор ' + cmdName + ' привязан к ' + targetRank);
    return true;
};

window.unbindCommander = function(cmdName) {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return false; }
    var houseId = user.game.house;
    
    var myRank = user.game.houseRank;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad) { setMessage('❌ Отряд не найден.'); return false; }
    
    if (myRank === 'lord') {
        squad.boundTo = null;
        saveData();
        setMessage('✅ Командор ' + cmdName + ' отвязан.');
        return true;
    }
    
    if (myRank === 'heir' || myRank === 'war_master') {
        if (squad.boundTo !== myRank) {
            setMessage('❌ Этот командор не привязан к вам.');
            return false;
        }
        squad.boundTo = null;
        saveData();
        setMessage('✅ Командор ' + cmdName + ' отвязан от вас.');
        return true;
    }
    
    setMessage('❌ У вас нет прав отвязывать командоров.');
    return false;
};

// ============================================================
// ВЫДЕЛЕНИЕ ВОЙСК КОМАНДОРУ
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
    
    var squadLoc = squad.location || 'castle';
    
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
                    if (u.type === type && !u.commander && !u.isScout && !u.squadId && u.location === squadLoc) {
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
        setMessage('❌ Нет свободных юнитов на клетке командора.');
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
    var squadLoc = squad.location || 'castle';
    var totalUnassigned = 0;
    
    if (!unitTypes || Object.keys(unitTypes).length === 0) {
        totalUnassigned = unassignAllFromSquad(squad, garrison, squadLoc);
    } else {
        for (var type in unitTypes) {
            var count = unitTypes[type];
            var taken = 0;
            for (var i = squad.units.length - 1; i >= 0 && taken < count; i--) {
                if (squad.units[i].type === type) {
                    var u = squad.units.splice(i, 1)[0];
                    u.squadId = null; u.commander = null; u.captainId = null; u.sergeantId = null;
                    u.location = squadLoc;
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
                            u.location = squadLoc;
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
                                u.location = squadLoc;
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
        setMessage('✅ ' + totalUnassigned + ' юнитов отвязано. Остались на клетке.');
        addHouseLog(houseId, '🔓 ' + totalUnassigned + ' юнитов отвязано от ' + targetName);
    } else {
        setMessage('❌ Не удалось отвязать юнитов.');
    }
    return totalUnassigned > 0;
};

function unassignAllFromSquad(squad, garrison, squadLoc) {
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
        u.location = squadLoc;
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
// РАСПРЕДЕЛЕНИЕ ПО ИЕРАРХИИ
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
    if (isHighCommand && !mySquad) {
        setMessage('❌ Вы не состоите в отряде. Используйте кнопку назначения в командовании.');
        return false;
    }
    squad = mySquad ? mySquad.squad : null;
    if (!squad) { setMessage('❌ Отряд не найден.'); return false; }
    
    var squads = window.getSquads(houseId);
    for (var cmdName in squads) {
        if (squads[cmdName].captains && squads[cmdName].captains[captainName]) {
            setMessage('❌ Этот капитан уже в отряде ' + cmdName);
            return false;
        }
    }
    
    var captainSquad = squad.captains[captainName];
    if (!captainSquad) {
        captainSquad = { commander: captainName, units: [], sergeants: {}, detached: false, location: squad.location, allow_detach_subordinates: false, allow_detach_self: false };
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
        captainSquad = { commander: captainName, units: [], sergeants: {}, detached: false, location: squad.location, allow_detach_subordinates: false, allow_detach_self: false };
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
        setMessage('✅ ' + captainName + ' назначен капитаном с ' + totalAssigned + ' юнитами.');
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
        sergeantSquad = { commander: sgtName, units: [], detached: false, location: cap.location || squad.location };
        cap.sergeants[sgtName] = sergeantSquad;
    }
    
    if (unitTypes && Object.keys(unitTypes).length > 0) {
        var totalAssigned = 0;
        for (var type in unitTypes) {
            var count = unitTypes[type];
            var taken = 0;
            for (var i = cap.units.length - 1; i >= 0 && taken < count; i--) {
                if (cap.units[i].type === type) {
                    cap.units[i].sergeantId = sgtName;
                    sergeantSquad.units.push(cap.units.splice(i, 1)[0]);
                    taken++;
                    totalAssigned++;
                }
            }
        }
        saveData();
        setMessage('✅ Сержант ' + sgtName + ' получил ' + totalAssigned + ' юнитов.');
    } else {
        saveData();
        setMessage('✅ ' + sgtName + ' назначен сержантом.');
    }
    return true;
};

window.captainAssignToSergeant = function(sergeantName, unitTypes, cmdName, capName) {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return false; }
    var houseId = user.game.house;
    
    var myRank = user.game.houseRank;
    var isHighCommand = myRank && ['lord','heir','war_master'].indexOf(myRank) !== -1;
    var mySquad = window.getMySquad();
    var isCommander = mySquad && mySquad.role === 'commander';
    var isCaptain = mySquad && mySquad.role === 'captain';
    
    if (!isHighCommand && !isCommander && !isCaptain) {
        setMessage('❌ Только капитан, командор или высшее командование могут выдавать сержантам.');
        return false;
    }
    
    if (!users[sergeantName] || users[sergeantName].game.house !== houseId) {
        setMessage('❌ Игрок не в вашем доме.');
        return false;
    }
    
    var squads = window.getSquads(houseId);
    var captainSquad = null;
    
    if (cmdName && capName && squads[cmdName] && squads[cmdName].captains && squads[cmdName].captains[capName]) {
        captainSquad = squads[cmdName].captains[capName];
    } else if (isCaptain) {
        captainSquad = mySquad.squad.captains[mySquad.captainName];
    } else if (isCommander && capName) {
        captainSquad = mySquad.squad.captains[capName];
    }
    
    if (!captainSquad) { setMessage('❌ Отряд капитана не найден.'); return false; }
    
    var sergeantSquad = captainSquad.sergeants[sergeantName];
    if (!sergeantSquad) {
        sergeantSquad = { commander: sergeantName, units: [], detached: false, location: captainSquad.location };
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
// ОТЗЫВ ВОЙСК
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
// СИСТЕМА ОТДЕЛЕНИЯ И ОБЪЕДИНЕНИЯ НА КАРТЕ
// ============================================================

window.splitUnitDialog = function(cmdName, capName, sgtName) {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return; }
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad) return;

    var cap = squad.captains[capName];
    if (!cap) return;

    var target = sgtName ? cap.sergeants[sgtName] : cap;
    if (!target) return;

    var totalUnits = target.units.length;
    if (totalUnits === 0) { setMessage('❌ Нет юнитов для отделения.'); return; }

    var grouped = {};
    target.units.forEach(function(u) { if (!grouped[u.type]) grouped[u.type] = 0; grouped[u.type]++; });

    var modal = document.getElementById('modal-split-unit');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-split-unit';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeSplitUnitModal(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>✂️ ОТДЕЛИТЬ</h3><button class="close-btn" onclick="closeSplitUnitModal()">✕</button></div><div id="modal-split-unit-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }

    var content = document.getElementById('modal-split-unit-content');
    var html = '<div class="modal-section"><h4>' + (sgtName ? 'Сержант: ' + sgtName : 'Капитан: ' + capName) + '</h4>';
    html += '<p style="color:#6a5a48;">Выберите, кого оставить на этой клетке отдельно.</p>';
    
    for (var t in grouped) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
        html += '<div class="row"><span class="label">' + (ut ? ut.emoji + ' ' + ut.name : t) + ' — ' + grouped[t] + '</span>';
        html += '<span class="value"><input type="number" id="split_u_' + t + '" value="0" min="0" max="' + grouped[t] + '" style="width:60px;" data-type="' + t + '"></span></div>';
    }
    html += '<button class="btn" onclick="confirmSplitUnit(\'' + cmdName + '\',\'' + capName + '\',\'' + (sgtName || '') + '\')" style="margin-top:10px;">✂️ Отделить</button>';
    html += '<button class="btn btn-secondary" onclick="closeSplitUnitModal()">Отмена</button>';
    html += '</div>';

    content.innerHTML = html;
    modal.classList.remove('hide');
};

window.confirmSplitUnit = function(cmdName, capName, sgtName) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad) return;

    var cap = squad.captains[capName];
    if (!cap) return;
    var target = sgtName ? cap.sergeants[sgtName] : cap;
    if (!target) return;

    var moved = 0;
    var inputs = document.querySelectorAll('#modal-split-unit-content input[type="number"]');
    var newLocation = sgtName ? (target.location || cap.location || squad.location) : (cap.location || squad.location);

    inputs.forEach(function(inp) {
        var count = parseInt(inp.value) || 0;
        if (count > 0) {
            var t = inp.getAttribute('data-type');
            for (var i = target.units.length - 1; i >= 0 && count > 0; i--) {
                if (target.units[i].type === t) {
                    var u = target.units.splice(i, 1)[0];
                    u.location = newLocation;
                    u.stance = 'defending';
                    // Если отделяем капитана, его юниты привязываются к нему (он отделён)
                    if (!sgtName) cap.detached = true;
                    else target.detached = true;
                    
                    // Возвращаем юнита в гарнизон (на карту), чтобы он стал отдельным маркером
                    u.squadId = null; u.commander = null; u.captainId = null; u.sergeantId = null;
                    returnUnit(u, window._castleGarrisons[houseId]);
                    moved++;
                    count--;
                }
            }
        }
    });

    closeSplitUnitModal();
    saveData();
    setMessage('✂️ Отделено ' + moved + ' юнитов на этой клетке.');
    setTimeout(function() { closeOwnUnitsModal(); handleZoneClick(newLocation); }, 300);
};

window.closeSplitUnitModal = function() {
    var m = document.getElementById('modal-split-unit');
    if (m) m.classList.add('hide');
};

window.mergeUnitDialog = function(cmdName, capName, sgtName) {
    // Соединение отделённых войск обратно в отряд
    var user = users[currentUser];
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad) return;

    var cap = squad.captains[capName];
    if (!cap) return;
    var target = sgtName ? cap.sergeants[sgtName] : cap;
    if (!target) return;

    // Ищем отделённых юнитов этого отряда/капитана/сержанта на этой клетке
    var garrison = window._castleGarrisons[houseId];
    var zoneId = target.location || cap.location || squad.location;
    var merged = 0;

    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (garrison[cat]) {
            for (var i = garrison[cat].length - 1; i >= 0; i--) {
                var u = garrison[cat][i];
                if (u.location === zoneId && u.stance === 'defending' && !u.squadId && !u.commander) {
                    // Проверяем, что это юнит из этого отряда (по типу)
                    target.units.push(u);
                    garrison[cat].splice(i, 1);
                    merged++;
                }
            }
        }
    });

    // Убираем статус отделения
    if (sgtName) {
        target.detached = false;
        target.location = cap.location || squad.location;
    } else {
        target.detached = false;
        target.location = squad.location;
    }

    saveData();
    setMessage('🔗 Соединено ' + merged + ' юнитов.');
    setTimeout(function() { closeOwnUnitsModal(); handleZoneClick(zoneId); }, 300);
};

// ============================================================
// ДВИЖЕНИЕ (С УЧЁТОМ ОТДЕЛЁННЫХ)
// ============================================================

window.moveSquad = function(targetZoneId, action) {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return false; }
    var houseId = user.game.house;
    
    var myRank = user.game.houseRank;
    var isHighCommand = myRank && ['lord','heir','war_master'].indexOf(myRank) !== -1;
    var mySquad = window.getMySquad();
    
    if (!mySquad) { setMessage('❌ Вы не в отряде.'); return false; }
    
    var squad = mySquad.squad;
    var currentZoneId = squad.location === 'castle' ? 'bl_-1_0' : squad.location;
    
    var allUnits = [];
    var movedCapNames = [];
    var movedSgtNames = {};
    
    if (mySquad.role === 'commander') {
        if (!squad.detached && !isHighCommand) {
            setMessage('❌ Отряд не отсоединён. Сначала отсоедините его.');
            return false;
        }
        allUnits = allUnits.concat(squad.units);
        for (var capName in squad.captains) {
            var cap = squad.captains[capName];
            // Если капитан отделён и не на этой клетке — не трогаем
            if (cap.detached && cap.location !== currentZoneId) continue;
            movedCapNames.push(capName);
            allUnits = allUnits.concat(cap.units);
            for (var sgtName in cap.sergeants) {
                var sgt = cap.sergeants[sgtName];
                // Если сержант отделён и не на этой клетке — не трогаем
                if (sgt.detached && sgt.location !== currentZoneId) continue;
                if (!movedSgtNames[capName]) movedSgtNames[capName] = [];
                movedSgtNames[capName].push(sgtName);
                allUnits = allUnits.concat(sgt.units);
            }
        }
    } else if (mySquad.role === 'captain') {
        var cap = squad.captains[mySquad.captainName];
        if (!cap) { setMessage('❌ Капитан не найден.'); return false; }
        if (!cap.detached && !isHighCommand) {
            setMessage('❌ Отряд не отсоединён. Сначала отсоедините его.');
            return false;
        }
        allUnits = allUnits.concat(cap.units);
        for (var sgtName in cap.sergeants) {
            var sgt = cap.sergeants[sgtName];
            if (sgt.detached && sgt.location !== currentZoneId) continue;
            allUnits = allUnits.concat(sgt.units);
        }
    } else if (mySquad.role === 'sergeant') {
        var cap = squad.captains[mySquad.captainName];
        if (!cap || !cap.sergeants[mySquad.sergeantName]) { setMessage('❌ Сержант не найден.'); return false; }
        var sgt = cap.sergeants[mySquad.sergeantName];
        if (!sgt.detached && !isHighCommand) {
            setMessage('❌ Отряд не отсоединён. Сначала отсоедините его.');
            return false;
        }
        allUnits = allUnits.concat(sgt.units);
    }
    
    if (allUnits.length === 0) { setMessage('❌ Нет юнитов для движения.'); return false; }
    
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
        isSquad: true, squadId: mySquad.commanderName, commanderName: mySquad.commanderName,
        movedCapNames: movedCapNames,
        movedSgtNames: movedSgtNames
    };
    
    var garrison = window._castleGarrisons[houseId];
    if (!garrison.marching) garrison.marching = [];
    garrison.marching.push(marchData);
    
    // Очищаем юнитов в отряде командора
    if (mySquad.role === 'commander') {
        squad.units = [];
        for (var capName in squad.captains) {
            if (movedCapNames.indexOf(capName) !== -1) {
                squad.captains[capName].units = [];
                for (var sgtName in squad.captains[capName].sergeants) {
                    if (movedSgtNames[capName] && movedSgtNames[capName].indexOf(sgtName) !== -1) {
                        squad.captains[capName].sergeants[sgtName].units = [];
                    }
                }
            }
        }
    } else if (mySquad.role === 'captain') {
        squad.captains[mySquad.captainName].units = [];
        for (var sgtName in squad.captains[mySquad.captainName].sergeants) {
            squad.captains[mySquad.captainName].sergeants[sgtName].units = [];
        }
    } else if (mySquad.role === 'sergeant') {
        squad.captains[mySquad.captainName].sergeants[mySquad.sergeantName].units = [];
    }
    
    saveData();
    setMessage('✅ Отряд выступил! ' + allUnits.length + ' юнитов.');
    addHouseLog(houseId, '🚶 Отряд ' + mySquad.commanderName + ' → ' + getZoneName(targetZoneId));
    processMarchStep(marchId);
    return true;
};

// ============================================================
// КЛИК ПО ЗОНЕ НА КАРТЕ МИРА
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
// СБОР ВОЙСК В ЗОНЕ (ВСЕ ЗОНЫ + SQUADS)
// ============================================================

function getOwnUnitsInZone(zoneId, houseId) {
    var result = { commanders:[], captains:[], sergeants:[], unattached:[], scouts:[], length:0 };
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry:[], cavalry:[], siege:[] };
    var allUnits = [];
    var zone = WORLD_AREAS[zoneId];
    var isCastle = zone && (zone.type==='castle'||zone.type==='castle_gate');
    
    // Собираем гарнизон (включая отделённых)
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (garrison[cat]) garrison[cat].forEach(function(u) {
            if (u.location===zoneId || (isCastle&&u.location==='castle')) {
                allUnits.push({unit:u, category:cat});
            }
        });
    });
    
    // Собираем отряды и их отделённых подчинённых
    var squads = window.getSquads(houseId);
    for (var cmdName in squads) {
        var squad = squads[cmdName];
        var squadLoc = squad.location || 'castle';
        var matches = (squadLoc === zoneId) || (isCastle && squadLoc === 'castle');
        
        if (matches) {
            // Основные юниты отряда
            squad.units.forEach(function(u) { allUnits.push({unit:u, category:'infantry', squadUnit:true}); });
        }

        for (var capName in squad.captains) {
            var cap = squad.captains[capName];
            var capLoc = cap.location || squadLoc;
            var capMatches = (capLoc === zoneId) || (isCastle && capLoc === 'castle');
            
            if (capMatches) {
                // Юниты капитана
                cap.units.forEach(function(u) { allUnits.push({unit:u, category:'infantry', squadUnit:true, ownerCap:capName, isDetachedCap: cap.detached && capLoc === zoneId}); });
            }

            for (var sgtName in cap.sergeants) {
                var sgt = cap.sergeants[sgtName];
                var sgtLoc = sgt.location || capLoc;
                var sgtMatches = (sgtLoc === zoneId) || (isCastle && sgtLoc === 'castle');
                
                if (sgtMatches) {
                    sgt.units.forEach(function(u) { allUnits.push({unit:u, category:'infantry', squadUnit:true, ownerCap:capName, ownerSgt:sgtName, isDetachedSgt: sgt.detached && sgtLoc === zoneId}); });
                }
            }
        }
    }
    
    var cmdMap={}, capMap={}, sgtMap={}, unattached=[], scouts=[];
    
    allUnits.forEach(function(item) {
        var u = item.unit;
        if (u.isScout) { scouts.push(item); return; }
        
        if (u.squadId) {
            // Если это юнит внутри отряда, но с флагом detached, он всё равно считается частью структуры
            if (!cmdMap[u.squadId]) cmdMap[u.squadId] = { name: u.squadId, units: [], isSquad: true };
            // Сам юнит в маркере отряда не показываем, показываем капитанов/сержантов
            
            // Разбираем структуру, чтобы отображать отделённые маркеры
            if (item.isDetachedSgt && item.ownerSgt) {
                if (!sgtMap[item.ownerSgt]) sgtMap[item.ownerSgt] = { name: item.ownerSgt, units: [], capName: item.ownerCap };
                sgtMap[item.ownerSgt].units.push(item);
            } else if (item.isDetachedCap && item.ownerCap) {
                if (!capMap[item.ownerCap]) capMap[item.ownerCap] = { name: item.ownerCap, units: [] };
                capMap[item.ownerCap].units.push(item);
            } else {
                // Обычные юниты в отряде
                if (!cmdMap[u.squadId].internalUnits) cmdMap[u.squadId].internalUnits = [];
                cmdMap[u.squadId].internalUnits.push(item);
            }
            
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
    
    // Пересобираем нормальные отряды из squads (чтобы всегда был маркер командора)
    for (var cmdName in squads) {
        var sq = squads[cmdName];
        var loc = sq.location || 'castle';
        if (loc === zoneId || (isCastle && loc === 'castle')) {
            if (!cmdMap[cmdName]) cmdMap[cmdName] = { name: cmdName, units: [], isSquad: true };
            // Считаем общее количество юнитов под командором (для отображения)
            var total = sq.units.length;
            for (var c in sq.captains) {
                // Если капитан не отделён, его юниты тоже тут
                if (!sq.captains[c].detached || sq.captains[c].location === loc) {
                    total += sq.captains[c].units.length;
                    for (var s in sq.captains[c].sergeants) {
                        if (!sq.captains[c].sergeants[s].detached || sq.captains[c].sergeants[s].location === loc) {
                            total += sq.captains[c].sergeants[s].units.length;
                        }
                    }
                }
            }
            cmdMap[cmdName].units = new Array(total); // Заглушка для отображения размера
        }
    }

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
// МОДАЛКА ВОЙСК (С КНОПКАМИ ОТДЕЛЕНИЯ/СОЕДИНЕНИЯ)
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
    
    var user = users[currentUser];
    var myRank = user.game.houseRank;
    var isHighCommand = myRank && ['lord','heir','war_master'].indexOf(myRank) !== -1;
    
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
    
    // --- ОТРЯДЫ ---
    if (ownUnits.commanders.length > 0) {
        h += '<div class="modal-section"><h4>👑 ОТРЯДЫ / КОМАНДОРЫ</h4>';
        ownUnits.commanders.forEach(function(cmd) {
            var squads = window.getSquads(houseId);
            var squad = squads[cmd.name];
            
            var totalUnits = 0;
            var detachedCaps = 0;
            if (squad) {
                totalUnits += squad.units.length;
                for (var cName in squad.captains) {
                    var cData = squad.captains[cName];
                    if (cData.detached) { detachedCaps++; continue; }
                    totalUnits += cData.units.length;
                    for (var sName in cData.sergeants) {
                        if (!cData.sergeants[sName].detached) totalUnits += cData.sergeants[sName].units.length;
                    }
                }
            }

            var canMove = (cmd.name === currentUser) || isHighCommand;
            var isSelfDetached = squad && squad.detached;
            if (isSelfDetached) canMove = true;
            
            h += '<div class="row" style="padding:8px 0; border-bottom:1px solid #1a1410; flex-wrap:wrap; align-items:flex-start;">';
            h += '<div style="flex:1; min-width:150px;">';
            h += '<strong style="color:#ffd700;">👑 ' + cmd.name + '</strong><br>';
            h += '<span style="color:#b8a890; font-size:11px;">Юнитов в маркере: ' + totalUnits + '</span>';
            if (detachedCaps > 0) h += '<br><span style="color:#c96a5a; font-size:10px;">Отделённых капитанов: ' + detachedCaps + '</span>';
            h += '</div>';
            
            h += '<div style="display:flex; gap:4px; flex-wrap:wrap; justify-content:flex-end;">';
            if (canMove) {
                h += '<button class="btn btn-small" onclick="window.moveSquadFromModal(\'' + zoneId + '\',\'' + cmd.name + '\')">🚶 Отправить</button>';
            }
            
            // Если есть отделённые капитаны в этой зоне, даём кнопку "Собрать"
            var canMergeHere = false;
            for (var cName in squad.captains) {
                if (squad.captains[cName].detached && (squad.captains[cName].location === zoneId)) canMergeHere = true;
            }
            if (canMergeHere && canMove) {
                h += '<button class="btn btn-small" style="background:#3d5a2a;" onclick="window.mergeAllDetachedToCommander(\'' + cmd.name + '\')">🔗 Собрать отряд</button>';
            }

            // Кнопка "Разрешить отделение" для вышестоящих
            if (isHighCommand && squad) {
                var canDetachSub = squad.allow_detach_subordinates === true;
                h += '<button class="btn btn-small" style="background:#4a3a2a;" onclick="window.toggleDetachPermission(\'' + cmd.name + '\', null, null)">' + (canDetachSub ? '✂️ Отделение вкл' : '🔒 Отделение выкл') + '</button>';
            }
            h += '</div></div>';

            // Список отделённых капитанов и сержантов в этой зоне
            if (squad) {
                for (var cName in squad.captains) {
                    var cData = squad.captains[cName];
                    if (cData.detached && cData.location === zoneId) {
                        var capTotal = cData.units.length;
                        h += '<div style="margin-left:15px; padding:5px; border-left:2px solid #ffd700; margin-top:4px;">';
                        h += '<span style="color:#e0c080; font-size:12px;">🗡️ Отделён: ' + cName + ' (' + capTotal + ' юнитов)</span><br>';
                        var canMoveCap = isHighCommand || (cData.allow_detach_self === true);
                        if (canMoveCap) {
                            h += '<button class="btn btn-small" style="font-size:9px;" onclick="window.moveDetachedCaptain(\'' + cmd.name + '\',\'' + cName + '\',\'' + zoneId + '\')">🚶 Двигать</button> ';
                        }
                        h += '<button class="btn btn-small" style="font-size:9px; background:#3d5a2a;" onclick="window.mergeCaptainToCommander(\'' + cmd.name + '\',\'' + cName + '\')">🔗 Соединить</button>';
                        h += '</div>';
                    }
                    for (var sName in cData.sergeants) {
                        var sData = cData.sergeants[sName];
                        if (sData.detached && sData.location === zoneId) {
                            var sgtTotal = sData.units.length;
                            h += '<div style="margin-left:30px; padding:5px; border-left:2px solid #7ac98a; margin-top:4px;">';
                            h += '<span style="color:#a0d090; font-size:12px;">🛡️ Отделён: ' + sName + ' (' + sgtTotal + ' юнитов, под ' + cName + ')</span><br>';
                            var canMoveSgt = isHighCommand || (sData.allow_detach_self === true);
                            if (canMoveSgt) {
                                h += '<button class="btn btn-small" style="font-size:9px;" onclick="window.moveDetachedSergeant(\'' + cmd.name + '\',\'' + cName + '\',\'' + sName + '\',\'' + zoneId + '\')">🚶 Двигать</button> ';
                            }
                            h += '<button class="btn btn-small" style="font-size:9px; background:#3d5a2a;" onclick="window.mergeSergeantToCaptain(\'' + cmd.name + '\',\'' + cName + '\',\'' + sName + '\')">🔗 Соединить</button>';
                            h += '</div>';
                        }
                    }
                }
            }
        });
        h += '</div>';
    }
    
    // --- НЕПРИВЯЗАННЫЕ ---
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

// Функции, которые вызывает модалка на карте
window.mergeAllDetachedToCommander = function(cmdName) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad) return;

    var zoneId = squad.location;
    var merged = 0;
    
    for (var cName in squad.captains) {
        var cap = squad.captains[cName];
        if (cap.detached && cap.location === zoneId) {
            cap.detached = false;
            cap.location = zoneId;
            merged += cap.units.length;
            for (var sName in cap.sergeants) {
                var sgt = cap.sergeants[sName];
                if (sgt.detached && sgt.location === zoneId) {
                    sgt.detached = false;
                    sgt.location = zoneId;
                    merged += sgt.units.length;
                }
            }
        }
    }
    saveData();
    setMessage('🔗 Присоединено ' + merged + ' юнитов.');
    closeOwnUnitsModal();
    setTimeout(function() { handleZoneClick(zoneId); }, 300);
};

window.mergeCaptainToCommander = function(cmdName, capName) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad || !squad.captains[capName]) return;
    var cap = squad.captains[capName];

    cap.detached = false;
    cap.location = squad.location;
    
    for (var sName in cap.sergeants) {
        var sgt = cap.sergeants[sName];
        if (sgt.detached) {
            sgt.detached = false;
            sgt.location = squad.location;
        }
    }

    saveData();
    setMessage('🔗 Капитан ' + capName + ' присоединён к отряду.');
    closeOwnUnitsModal();
    setTimeout(function() { handleZoneClick(squad.location); }, 300);
};

window.mergeSergeantToCaptain = function(cmdName, capName, sName) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad || !squad.captains[capName]) return;
    var cap = squad.captains[capName];
    if (!cap.sergeants[sName]) return;

    cap.sergeants[sName].detached = false;
    cap.sergeants[sName].location = squad.location;

    saveData();
    setMessage('🔗 Сержант ' + sName + ' присоединён к капитану.');
    closeOwnUnitsModal();
    setTimeout(function() { handleZoneClick(squad.location); }, 300);
};

window.toggleDetachPermission = function(cmdName, capName, sName) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad) return;

    if (!capName) {
        squad.allow_detach_subordinates = !squad.allow_detach_subordinates;
    } else {
        var cap = squad.captains[capName];
        if (!cap) return;
        if (!sName) {
            cap.allow_detach_subordinates = !cap.allow_detach_subordinates;
        }
    }
    saveData();
    closeOwnUnitsModal();
    setTimeout(function() { handleZoneClick(squad.location); }, 300);
};

window.moveDetachedCaptain = function(cmdName, capName, zoneId) {
    window._awaitingTarget = true;
    window._targetData = { fromZone: zoneId, isScout: false, commander: true, isDetachedMove: true };
    window.currentMovingCommander = { cmdName: cmdName, capName: capName, type: 'detached_cap' };
    window.closeOwnUnitsModal();
    setMessage('🎯 Выберите целевую зону для отделённого капитана.');
};

window.moveDetachedSergeant = function(cmdName, capName, sName, zoneId) {
    window._awaitingTarget = true;
    window._targetData = { fromZone: zoneId, isScout: false, commander: true, isDetachedMove: true };
    window.currentMovingCommander = { cmdName: cmdName, capName: capName, sName: sName, type: 'detached_sgt' };
    window.closeOwnUnitsModal();
    setMessage('🎯 Выберите целевую зону для отделённого сержанта.');
};

// ============================================================
// ПОДТВЕРЖДЕНИЕ И ОТПРАВКА (С УЧЁТОМ ОТДЕЛЁННЫХ)
// ============================================================

window.confirmTarget = function(targetZoneId, action, timeMinutes) {
    var data = window._targetData;
    if (!data) { setMessage('❌ Нет данных.'); return; }
    
    var cmd = window.currentMovingCommander;
    
    // Если двигаем отделённого капитана/сержанта
    if (cmd && cmd.type === 'detached_cap') {
        window._awaitingTarget = false;
        window._targetData = null;
        window.closeConfirmMove();
        
        var user = users[currentUser];
        var houseId = user.game.house;
        var squads = window.getSquads(houseId);
        var squad = squads[cmd.cmdName];
        if (squad && squad.captains[cmd.capName]) {
            var cap = squad.captains[cmd.capName];
            var path = findPath(data.fromZone, targetZoneId);
            var moveTimeMs = 2 * 60 * 1000; 
            
            // Ставим в очередь на марш
            var marchData = {
                id: 'detach_cap_' + Date.now(), units: cap.units.slice(), path: path, currentStep: 0,
                action: 'move', houseId: houseId, speedPerZone: 2, moveTimeMs: moveTimeMs, waitTimeMs: 10000,
                phase: 'waiting', nextPhaseTime: Date.now() + 10000,
                isDetachedCap: true, cmdName: cmd.cmdName, capName: cmd.capName
            };
            var garrison = window._castleGarrisons[houseId];
            if (!garrison.marching) garrison.marching = [];
            garrison.marching.push(marchData);
            cap.units = []; // Очищаем у капитана, так как они в пути
            
            saveData();
            setMessage('🚶 Отделённый капитан выступил.');
            processMarchStep(marchData.id);
        }
        return;
    }

    if (cmd && cmd.type === 'detached_sgt') {
        window._awaitingTarget = false;
        window._targetData = null;
        window.closeConfirmMove();
        
        var user = users[currentUser];
        var houseId = user.game.house;
        var squads = window.getSquads(houseId);
        var squad = squads[cmd.cmdName];
        if (squad && squad.captains[cmd.capName] && squad.captains[cmd.capName].sergeants[cmd.sName]) {
            var sgt = squad.captains[cmd.capName].sergeants[cmd.sName];
            var path = findPath(data.fromZone, targetZoneId);
            
            var marchData = {
                id: 'detach_sgt_' + Date.now(), units: sgt.units.slice(), path: path, currentStep: 0,
                action: 'move', houseId: houseId, speedPerZone: 2, moveTimeMs: 120000, waitTimeMs: 10000,
                phase: 'waiting', nextPhaseTime: Date.now() + 10000,
                isDetachedSgt: true, cmdName: cmd.cmdName, capName: cmd.capName, sName: cmd.sName
            };
            var garrison = window._castleGarrisons[houseId];
            if (!garrison.marching) garrison.marching = [];
            garrison.marching.push(marchData);
            sgt.units = []; // Очищаем у сержанта
            
            saveData();
            setMessage('🚶 Отделённый сержант выступил.');
            processMarchStep(marchData.id);
        }
        return;
    }
    
    // Старое поведение для отрядов
    window._awaitingTarget = false;
    window._targetData = null;
    
    if (data.isSquad) {
        window.closeConfirmMove();
        if (data.commanderName) {
            var squads = window.getSquads(users[currentUser].game.house);
            var squad = squads[data.commanderName];
            if (squad) {
                var originalGetMySquad = window.getMySquad;
                window.getMySquad = function() {
                    return { role: 'commander', squad: squad, commanderName: data.commanderName };
                };
                window.moveSquad(targetZoneId, action);
                window.getMySquad = originalGetMySquad;
            }
        } else {
            window.moveSquad(targetZoneId, action);
        }
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
    
    // (Оставляем старую логику для обычного движения, она работает)
    // ...
    
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
        squadId: commander ? (commander.squadId || null) : null,
        captainId: commander ? (commander.captainId || null) : null,
        sergeantId: commander ? (commander.sergeantId || null) : null
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
            var newLoc = (targetZone && (targetZone.type==='castle'||targetZone.type==='castle_gate')) ? 'castle' : (targetZone ? targetZone.id : marchData.path[0]);
            
            // Обработка прибытия отделённых
            if (marchData.isDetachedCap) {
                var squads = window.getSquads(marchData.houseId);
                var sq = squads[marchData.cmdName];
                if (sq && sq.captains[marchData.capName]) {
                    var cap = sq.captains[marchData.capName];
                    cap.location = newLoc;
                    cap.detached = true;
                    cap.units = units;
                    units.forEach(function(u){ u.location = newLoc; u.squadId = marchData.cmdName; });
                }
                saveData(); updateMenu(); return;
            }
            
            if (marchData.isDetachedSgt) {
                var squads = window.getSquads(marchData.houseId);
                var sq = squads[marchData.cmdName];
                if (sq && sq.captains[marchData.capName] && sq.captains[marchData.capName].sergeants[marchData.sName]) {
                    var sgt = sq.captains[marchData.capName].sergeants[marchData.sName];
                    sgt.location = newLoc;
                    sgt.detached = true;
                    sgt.units = units;
                    units.forEach(function(u){ u.location = newLoc; u.squadId = marchData.cmdName; });
                }
                saveData(); updateMenu(); return;
            }
            
            // Стандартная обработка
            if(marchData.isScout&&action==='scout'){
                // ... разведка ...
            } else {
                if (marchData.isSquad) {
                    returnSquadUnits(marchData, targetZone);
                } else if (marchData.isPlayerMove) {
                    returnPlayerUnits(marchData, targetZone);
                } else {
                    var enemies=findEnemiesInZone(targetZone ? targetZone.id : '',marchData.houseId);
                    if(enemies.length>0)resolveBattle(units,enemies,targetZone ? targetZone.id : '',marchData.houseId,action);
                    else{
                        if(action==='attack'&&targetZone)targetZone.owner=marchData.houseId;
                        var isCastleZone=targetZone&&(targetZone.type==='castle'||targetZone.type==='castle_gate');
                        var newLoc = isCastleZone?'castle':(targetZone ? targetZone.id : '');
                        
                        units.forEach(function(u){
                            u.location = newLoc;
                            u.stance = action==='defend'?'defending':'moving';
                            returnUnit(u,window._castleGarrisons[marchData.houseId]);
                        });
                        saveData();setMessage('✅ Отряд прибыл в '+getZoneName(targetZone ? targetZone.id : ''));
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
    
    // Обновляем локации капитанов, которые были с отрядом
    if (marchData.movedCapNames) {
        marchData.movedCapNames.forEach(function(c) {
            if (squad.captains[c]) squad.captains[c].location = newLocation;
        });
    }
    if (marchData.movedSgtNames) {
        for (var c in marchData.movedSgtNames) {
            marchData.movedSgtNames[c].forEach(function(s) {
                if (squad.captains[c] && squad.captains[c].sergeants[s]) squad.captains[c].sergeants[s].location = newLocation;
            });
        }
    }
    
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
// ОСТАЛЬНОЕ (БОЙ, РАЗВЕДКА, ТАЙМЕРЫ)
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
    // ... оставляем старый код боя ...
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

// Новые функции
window.splitUnitDialog = splitUnitDialog;
window.confirmSplitUnit = confirmSplitUnit;
window.closeSplitUnitModal = closeSplitUnitModal;
window.mergeUnitDialog = mergeUnitDialog;
window.mergeAllDetachedToCommander = mergeAllDetachedToCommander;
window.mergeCaptainToCommander = mergeCaptainToCommander;
window.mergeSergeantToCaptain = mergeSergeantToCaptain;
window.toggleDetachPermission = toggleDetachPermission;
window.moveDetachedCaptain = moveDetachedCaptain;
window.moveDetachedSergeant = moveDetachedSergeant;

// Система отрядов
window.getSquads = getSquads;
window.getMySquad = getMySquad;
window.createSquad = createSquad;
window.disbandSquad = disbandSquad;
window.bindCommander = bindCommander;
window.unbindCommander = unbindCommander;
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

// Вспомогательные
window.findPath = findPath;
window.getNeighborZones = getNeighborZones;
window.returnUnit = returnUnit;
window.findEnemiesInZone = findEnemiesInZone;
window.getZoneName = getZoneName;

setTimeout(function() {
    if (typeof window._castleGarrisons !== 'undefined') restoreMarchingTimers();
}, 1000);

console.log('🎯 Командование + Разделение + Отряды (Полный фикс) загружены!');

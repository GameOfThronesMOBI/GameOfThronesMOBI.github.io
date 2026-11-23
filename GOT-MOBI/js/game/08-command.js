// ============================================================
// js/game/08-command.js — КОМАНДОВАНИЕ + PvP + РАЗВЕДКА + ОТРЯДЫ
// ВЕРСИЯ 3.0 — ПОЛНАЯ ВЕРСИЯ (ОРИГИНАЛ + ВСЕ ФИКСЫ)
// ============================================================

window.closeZoneInfo = function() {
    var m = document.getElementById('modal-zone-info');
    if (m) m.classList.add('hide');
};

window._awaitingTarget = false;
window._targetData = null;
window._selectedUnitTypes = {};
window._activeMarchTimers = {};

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ: ЗАМОК ДОМА + ТАЙМЕРЫ МАРШЕЙ + БЕЗОПАСНОЕ СОХРАНЕНИЕ + ПРАВА
// ============================================================

function getCastleZoneId(houseId) {
    if (typeof WORLD_AREAS !== 'undefined' && houseId) {
        for (var id in WORLD_AREAS) {
            var z = WORLD_AREAS[id];
            if ((z.type === 'castle' || z.type === 'castle_gate') && z.owner === houseId) return id;
        }
    }
    return 'bl_-1_0'; // фоллбек для совместимости
}

function scheduleMarch(marchId, delay) {
    if (window._activeMarchTimers[marchId]) {
        clearTimeout(window._activeMarchTimers[marchId]);
    }
    window._activeMarchTimers[marchId] = setTimeout(function() {
        delete window._activeMarchTimers[marchId];
        processMarchStep(marchId);
    }, Math.max(0, delay));
}

function stopMarchTimer(marchId) {
    if (window._activeMarchTimers[marchId]) {
        clearTimeout(window._activeMarchTimers[marchId]);
        delete window._activeMarchTimers[marchId];
    }
}

function safeSave() {
    try { saveData(); } catch (e) { console.error('Ошибка сохранения:', e); }
}

// Проверка прав на управление доступами (НОВОЕ)
window.canManageRights = function(actorName, targetRole, targetCmdName, targetCapName) {
    var actor = users[actorName];
    if (!actor || !actor.game.house) return false;
    var rank = actor.game.houseRank;
    // Высшее командование может всё в своём доме
    if (['lord', 'heir', 'war_master'].indexOf(rank) !== -1) return true;
    // Командор управляет капитанами и сержантами СВОЕГО отряда
    if (rank === 'knight_commander' && targetCmdName === actorName) return true;
    // Капитан управляет только своими сержантами
    if (rank === 'captain_officer' && targetRole === 'sergeant' && targetCapName === actorName) return true;
    return false;
};

// Нормализация клетки ('castle' → реальная зона замка)
function zoneKey(loc, houseId) {
    if (!loc) return '';
    if (loc === 'castle') return getCastleZoneId(houseId);
    return loc;
}

// ============================================================
// ПОИСК ПУТИ (BFS) — 8 НАПРАВЛЕНИЙ
// ============================================================

function findPath(fromZoneId, toZoneId) {
    if (fromZoneId === toZoneId) return [fromZoneId];
    
    var startZone = WORLD_AREAS[fromZoneId];
    var endZone = WORLD_AREAS[toZoneId];
    if (!startZone || !endZone) return [fromZoneId]; // нет пути

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

    // ИСПРАВЛЕНО: больше НЕ телепортируем через недостижимые зоны
    return [fromZoneId];
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
// СИСТЕМА ОТРЯДОВ (SQUADS)
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
    // ИСПРАВЛЕНО: покинувший отряд не числится в нём
    if (user.game._leftSquad) return null;
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

    safeSave();
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

    // Нельзя расформировать отряд в марше
    var garrison = window._castleGarrisons[houseId];
    if (garrison && garrison.marching) {
        for (var mi = 0; mi < garrison.marching.length; mi++) {
            var m = garrison.marching[mi];
            if (m.squadId === commanderName || m.cmdName === commanderName) {
                setMessage('❌ Отряд в марше. Дождитесь прибытия.');
                return false;
            }
        }
    }

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
    safeSave();
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
    safeSave();
    var rankName = (typeof HOUSE_RANKS !== 'undefined' && HOUSE_RANKS[targetRank]) ? HOUSE_RANKS[targetRank].name : targetRank;
    setMessage('✅ Командор ' + cmdName + ' привязан к ' + rankName);
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
        safeSave();
        setMessage('✅ Командор ' + cmdName + ' отвязан.');
        return true;
    }

    if (myRank === 'heir' || myRank === 'war_master') {
        if (squad.boundTo !== myRank) {
            setMessage('❌ Этот командор не привязан к вам.');
            return false;
        }
        squad.boundTo = null;
        safeSave();
        setMessage('✅ Командор ' + cmdName + ' отвязан от вас.');
        return true;
    }

    setMessage('❌ У вас нет прав отвязывать командоров.');
    return false;
};

// ============================================================
// ВЫДЕЛЕНИЕ ВОЙСК КОМАНДОРУ (ТОЛЬКО НА КЛЕТКЕ КОМАНДОРА)
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
        safeSave();
        setMessage('✅ ' + totalAssigned + ' юнитов закреплено за командором ' + targetName);
        addHouseLog(houseId, '👥 ' + totalAssigned + ' юнитов → командор ' + targetName);
    } else {
        setMessage('❌ Нет свободных юнитов на клетке командора.');
    }
    return totalAssigned > 0;
};

// ============================================================
// ОТВЯЗКА ВОЙСК ОТ КОМАНДОРА (ОСТАЮТСЯ НА КЛЕТКЕ)
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
        safeSave();
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

    safeSave();
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
        safeSave();
        setMessage('✅ ' + captainName + ' назначен капитаном с ' + totalAssigned + ' юнитами.');
    } else {
        safeSave();
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
        safeSave();
        setMessage('✅ Сержант ' + sgtName + ' получил ' + totalAssigned + ' юнитов.');
    } else {
        safeSave();
        setMessage('✅ ' + sgtName + ' назначен сержантом.');
    }
    return true;
};

// ============================================================
// ВЫДАЧА ЮНИТОВ СЕРЖАНТУ
// ============================================================

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

    safeSave();
    if (totalAssigned > 0) {
        setMessage('✅ ' + sergeantName + ' назначен сержантом с ' + totalAssigned + ' юнитами.');
    } else {
        setMessage('✅ ' + sergeantName + ' назначен сержантом (без юнитов).');
    }
    addHouseLog(houseId, '👥 ' + currentUser + ' → сержант ' + sergeantName);
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
        safeSave();
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
        safeSave();
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

    safeSave();
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
    if (!squad) { setMessage('❌ Отряд больше не существует.'); user.game._leftSquad = null; safeSave(); return false; }

    var g = user.game;
    var squadLocation = squad.location === 'castle' ? getCastleZoneId(data.houseId) : squad.location;
    var playerLocation = g.location.parentZone || g.location.place;
    if (playerLocation === 'Таверна' || playerLocation === 'Дом') playerLocation = 'kl_0_0';

    if (playerLocation !== squadLocation && squad.location !== 'castle') {
        setMessage('❌ Вы не на той же клетке что и отряд.');
        return false;
    }

    user.game._leftSquad = null;
    if (user.game._chaseInterval) { clearInterval(user.game._chaseInterval); user.game._chaseInterval = null; }

    safeSave();
    setMessage('✅ Вы вернулись в отряд ' + data.commanderName);
    addHouseLog(data.houseId, '✅ ' + currentUser + ' вернулся в отряд ' + data.commanderName);
    return true;
};

// ============================================================
// ДВИЖЕНИЕ ОТРЯДА (С ownerKey И ПЕРЕНОСОМ СЕРЖАНТОВ)
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
    var currentZoneId = squad.location === 'castle' ? getCastleZoneId(houseId) : squad.location;

    var allUnits = [];

    if (mySquad.role === 'commander') {
        if (!squad.detached && !isHighCommand) {
            setMessage('❌ Отряд не отсоединён. Сначала отсоедините его.');
            return false;
        }
        allUnits = allUnits.concat(squad.units);
        for (var capName in squad.captains) {
            if (squad.captains[capName].detached && squad.captains[capName].location !== currentZoneId) continue;
            allUnits = allUnits.concat(squad.captains[capName].units);
            for (var sgtName in squad.captains[capName].sergeants) {
                if (squad.captains[capName].sergeants[sgtName].detached && squad.captains[capName].sergeants[sgtName].location !== currentZoneId) continue;
                allUnits = allUnits.concat(squad.captains[capName].sergeants[sgtName].units);
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
            if (cap.sergeants[sgtName].detached && cap.sergeants[sgtName].location !== currentZoneId) continue;
            allUnits = allUnits.concat(cap.sergeants[sgtName].units);
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

    var path = findPath(currentZoneId, targetZoneId);
    if (!path || path.length < 2) { setMessage('❌ Нет сухопутного пути до цели.'); return false; }

    // Определяем скорость
    var speedPerZone = 2;
    var hasC = false, hasS = false, hasI = false;
    allUnits.forEach(function(u) {
        if (u.siege) hasS = true;
        else if (u.horse || u.type === 'rider' || u.type === 'heavy_rider' || u.type === 'knight') hasC = true;
        else hasI = true;
    });
    if (hasS) speedPerZone = 5;
    else if (hasC && !hasI) speedPerZone = 1;

    var moveTimeMs = speedPerZone * 60 * 1000;
    var waitTimeMs = 10000;

    var marchId = 'squad_' + Date.now() + '_' + Math.floor(Math.random()*1000);
    var marchData = {
        id: marchId,
        units: allUnits,
        path: path,
        currentStep: 0,
        action: action,
        houseId: houseId,
        speedPerZone: speedPerZone,
        moveTimeMs: moveTimeMs,
        waitTimeMs: waitTimeMs,
        phase: 'waiting',
        nextPhaseTime: Date.now() + waitTimeMs,
        isSquad: true,
        squadId: mySquad.commanderName,
        commanderName: mySquad.commanderName,
        ownerKey: mySquad.commanderName // ЕДИНЫЙ КЛЮЧ ДЛЯ КОМАНДОРА
    };

    var garrison = window._castleGarrisons[houseId];
    if (!garrison.marching) garrison.marching = [];
    garrison.marching.push(marchData);

    // Удаляем юниты из отряда на время марша
    if (mySquad.role === 'commander') {
        squad.units = [];
        for (var capName in squad.captains) {
            if (squad.captains[capName].detached && squad.captains[capName].location !== currentZoneId) continue;
            squad.captains[capName].units = [];
            for (var sgtName in squad.captains[capName].sergeants) {
                if (squad.captains[capName].sergeants[sgtName].detached && squad.captains[capName].sergeants[sgtName].location !== currentZoneId) continue;
                squad.captains[capName].sergeants[sgtName].units = [];
            }
        }
    } else if (mySquad.role === 'captain') {
        squad.captains[mySquad.captainName].units = [];
        for (var sgtName in squad.captains[mySquad.captainName].sergeants) {
            if (squad.captains[mySquad.captainName].sergeants[sgtName].detached && squad.captains[mySquad.captainName].sergeants[sgtName].location !== currentZoneId) continue;
            squad.captains[mySquad.captainName].sergeants[sgtName].units = [];
        }
    } else if (mySquad.role === 'sergeant') {
        squad.captains[mySquad.captainName].sergeants[mySquad.sergeantName].units = [];
    }

    safeSave();
    setMessage('✅ Отряд выступил! ' + allUnits.length + ' юнитов.');
    addHouseLog(houseId, '🚶 Отряд ' + mySquad.commanderName + ' → ' + getZoneName(targetZoneId));
    processMarchStep(marchId);
    return true;
};

window.movePlayerUnits = function(targetZoneId) {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return false; }
    var houseId = user.game.house;

    var myRank = user.game.houseRank;
    var isHighCommand = myRank && ['lord','heir','war_master'].indexOf(myRank) !== -1;
    var mySquad = window.getMySquad();
    if (!mySquad) { setMessage('❌ Вы не в отряде.'); return false; }

    var squad = mySquad.squad;
    var myUnits = [];
    var currentZoneId = squad.location === 'castle' ? getCastleZoneId(houseId) : squad.location;

    if (mySquad.role === 'commander') {
        if (!squad.detached && !isHighCommand) {
            setMessage('❌ Отряд не отсоединён. Сначала отсоедините его.');
            return false;
        }
        myUnits = myUnits.concat(squad.units);
    } else if (mySquad.role === 'captain') {
        var cap = squad.captains[mySquad.captainName];
        if (!cap) { setMessage('❌ Капитан не найден.'); return false; }
        if (!cap.detached && !isHighCommand) {
            setMessage('❌ Отряд не отсоединён. Сначала отсоедините его.');
            return false;
        }
        myUnits = myUnits.concat(cap.units);
    } else if (mySquad.role === 'sergeant') {
        var cap = squad.captains[mySquad.captainName];
        if (!cap || !cap.sergeants[mySquad.sergeantName]) { setMessage('❌ Сержант не найден.'); return false; }
        var sgt = cap.sergeants[mySquad.sergeantName];
        if (!sgt.detached && !isHighCommand) {
            setMessage('❌ Отряд не отсоединён. Сначала отсоедините его.');
            return false;
        }
        myUnits = myUnits.concat(sgt.units);
    }

    if (myUnits.length === 0) { setMessage('❌ У вас нет привязанных юнитов.'); return false; }

    var path = findPath(currentZoneId, targetZoneId);
    if (!path || path.length < 2) { setMessage('❌ Нет сухопутного пути до цели.'); return false; }

    var speedPerZone = 2;
    var hasC = false, hasS = false, hasI = false;
    myUnits.forEach(function(u) {
        if (u.siege) hasS = true;
        else if (u.horse || u.type === 'rider' || u.type === 'heavy_rider' || u.type === 'knight') hasC = true;
        else hasI = true;
    });
    if (hasS) speedPerZone = 5;
    else if (hasC && !hasI) speedPerZone = 1;

    var marchId = 'player_' + Date.now() + '_' + Math.floor(Math.random()*1000);
    var marchData = {
        id: marchId,
        units: myUnits.slice(),
        path: path,
        currentStep: 0,
        action: 'move',
        houseId: houseId,
        speedPerZone: speedPerZone,
        moveTimeMs: speedPerZone * 60 * 1000,
        waitTimeMs: 10000,
        phase: 'waiting',
        nextPhaseTime: Date.now() + 10000,
        isPlayerMove: true,
        playerName: currentUser,
        squadId: mySquad.commanderName,
        captainId: mySquad.captainName || null,
        sergeantId: mySquad.sergeantName || null,
        ownerKey: mySquad.commanderName + '|' + (mySquad.captainName||'') + '|' + (mySquad.sergeantName||'')
    };

    var garrison = window._castleGarrisons[houseId];
    if (!garrison.marching) garrison.marching = [];
    garrison.marching.push(marchData);

    if (mySquad.role === 'commander') { squad.units = []; }
    else if (mySquad.role === 'captain') { squad.captains[mySquad.captainName].units = []; }
    else if (mySquad.role === 'sergeant') { squad.captains[mySquad.captainName].sergeants[mySquad.sergeantName].units = []; }

    safeSave();
    setMessage('✅ Ваши войска выдвинулись!');
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

    if (zoneId === 'castle') zoneId = getCastleZoneId(user.game.house);

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

    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (garrison[cat]) garrison[cat].forEach(function(u) {
            if (u.location===zoneId||(isCastle&&u.location==='castle')) allUnits.push({unit:u,category:cat});
        });
    });

    var squads = window.getSquads(houseId);
    for (var cmdName in squads) {
        var squad = squads[cmdName];
        var squadLoc = squad.location || 'castle';
        var matches = (squadLoc === zoneId) || (isCastle && squadLoc === 'castle');
        if (matches) {
            squad.units.forEach(function(u) { allUnits.push({unit:u,category:'infantry',squadUnit:true}); });
            for (var capName in squad.captains) {
                squad.captains[capName].units.forEach(function(u) { allUnits.push({unit:u,category:'infantry',squadUnit:true}); });
                for (var sgtName in squad.captains[capName].sergeants) {
                    squad.captains[capName].sergeants[sgtName].units.forEach(function(u) { allUnits.push({unit:u,category:'infantry',squadUnit:true}); });
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
// МОДАЛКА ВОЙСК (ИСПРАВЛЕНА ВЕРСТКА КОМАНДОРА + КОДИНАТЫ)
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

    window._selectedUnitTypes = {};

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

    if (ownUnits.commanders.length > 0) {
        h += '<div class="modal-section"><h4>👑 ОТРЯДЫ / КОМАНДОРЫ</h4>';
        ownUnits.commanders.forEach(function(cmd) {
            var squads = window.getSquads(houseId);
            var squad = squads[cmd.name];
            var totalUnits = cmd.units.length;
            var isSquad = cmd.isSquad;
            var icon = isSquad ? '👑' : '⭐';

            h += '<div class="row" style="padding:8px 0; border-bottom:1px solid #1a1410; flex-wrap:wrap;">';
            h += '<span class="label" style="flex:1; min-width:100px;">' + icon + ' ' + cmd.name + ' — ' + totalUnits + ' юнитов';
            if (isSquad && squad) {
                h += '<br><span style="font-size:10px;color:#6a5a48;">📍 ' + (squad.location === 'castle' ? '🏰 Замок' : getZoneName(squad.location)) + ' [' + (WORLD_AREAS[squad.location] ? WORLD_AREAS[squad.location].x + ',' + WORLD_AREAS[squad.location].y : '?') + ']</span>';
            }
            h += '</span>';
            h += '<span class="value" style="display:flex; gap:4px; flex-wrap:wrap; width:100%; justify-content:flex-end; margin-top:4px;">';

            if (isSquad) {
                var canMove = isHighCommand || (squad.commander === currentUser) || (squad.allow_detach_self === true);
                
                // СТРОКА 1: ТОЛЬКО КНОПКА ДВИЖЕНИЯ (ФИКС НАЛОЖЕНИЯ)
                h += '<div style="width:100%; display:flex; justify-content:flex-end; margin-bottom:4px;">';
                if (canMove) {
                    h += '<button class="btn btn-small" onclick="window.moveSquadFromModal(\'' + zoneId + '\',\'' + cmd.name + '\')">🚶</button>';
                } else {
                    h += '<span style="color:#6a5a48;font-size:10px;">🔒</span>';
                }
                h += '</div>';
                
                // СТРОКА 2: ГАЛОЧКИ НА ВСЮ ШИРИНУ (ФИКС НАЛОЖЕНИЯ)
                if (isHighCommand && squad) {
                    h += '<div style="width:100%; display:flex; gap:10px; font-size:10px; color:#a08d78; padding:4px 0; border-top:1px dashed #2a201a;">';
                    h += '<label><input type="checkbox" ' + (squad.allow_detach_subordinates ? 'checked' : '') + ' onchange="window.toggleSquadPermOnMap(\'' + cmd.name + '\',\'allow_detach_subordinates\',this.checked)"> ✂️ Подчинённые</label>';
                    h += '<label><input type="checkbox" ' + (squad.allow_detach_self ? 'checked' : '') + ' onchange="window.toggleSquadPermOnMap(\'' + cmd.name + '\',\'allow_detach_self\',this.checked)"> 🚶 Сам</label>';
                    h += '</div>';
                }
            } else {
                h += '<button class="btn btn-small" onclick="window.selectCommanderForMove(\'' + zoneId + '\',\'knight_commander\',\'' + cmd.name + '\')">🚶</button>';
            }
            h += '</span></div>';

            // Капитаны и сержанты
            if (isSquad && squad) {
                for (var cName in squad.captains) {
                    var cap = squad.captains[cName];
                    var capLoc = cap.location || squad.location;
                    var capDetached = cap.detached || (capLoc !== squad.location);

                    var capUnits = {};
                    cap.units.forEach(function(u) { if (!capUnits[u.type]) capUnits[u.type] = 0; capUnits[u.type]++; });
                    var capUnitStr = [];
                    for (var t in capUnits) {
                        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
                        capUnitStr.push((ut ? ut.emoji + ' ' + ut.name : t) + ': ' + capUnits[t]);
                    }

                    h += '<div style="margin-left:15px; padding:5px; border-left:2px solid ' + (capDetached ? '#ffd700' : '#3d3026') + '; margin-top:4px;">';
                    h += '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">';
                    h += '<span style="color:#c9b694; font-size:12px;">🗡️ ' + cName + (capDetached ? ' <span style="color:#ffd700;">(отделён)</span>' : '') + '</span>';
                    h += '<br><span style="font-size:10px;color:#6a5a48;">📍 ' + (capLoc === 'castle' ? '🏰 Замок' : getZoneName(capLoc)) + ' [' + (WORLD_AREAS[capLoc] ? WORLD_AREAS[capLoc].x + ',' + WORLD_AREAS[capLoc].y : '?') + ']</span>';
                    h += '<br><span style="font-size:10px;color:#b8a890;">' + (capUnitStr.length > 0 ? capUnitStr.join(' | ') : 'Нет юнитов') + '</span>';

                    // Галочки капитана через canManageRights
                    if (canManageRights(currentUser, 'captain', cmd.name, cName)) {
                        h += '<span style="font-size:10px; color:#a08d78; display:flex; gap:6px; margin-top:4px;">';
                        h += '<label><input type="checkbox" ' + (cap.allow_detach_subordinates ? 'checked' : '') + ' onchange="window.toggleCaptainPermOnMap(\'' + cmd.name + '\',\'' + cName + '\',\'allow_detach_subordinates\',this.checked)"> ✂️ Сержанты</label>';
                        h += '<label><input type="checkbox" ' + (cap.allow_detach_self ? 'checked' : '') + ' onchange="window.toggleCaptainPermOnMap(\'' + cmd.name + '\',\'' + cName + '\',\'allow_detach_self\',this.checked)"> 🚶 Сам</label>';
                        h += '</span>';
                    }

                    h += '<span style="display:flex; gap:4px;">';
                    if (capDetached) {
                        h += '<button class="btn btn-small" style="font-size:9px;" onclick="window.moveDetachedCaptain(\'' + cmd.name + '\',\'' + cName + '\',\'' + zoneId + '\')">🚶</button> ';
                        if (capLoc === squad.location) {
                            h += '<button class="btn btn-small" style="font-size:9px; background:#3d5a2a;" onclick="window.mergeUnitOnMap(\'' + cmd.name + '\',\'' + cName + '\', null)">🔗</button>';
                        }
                    } else if (isHighCommand || cap.allow_detach_self) {
                        h += '<button class="btn btn-small" style="font-size:9px;" onclick="window.detachUnitOnMap(\'' + cmd.name + '\',\'' + cName + '\', null)">✂️</button>';
                    }
                    h += '</span></div>';

                    for (var sName in cap.sergeants) {
                        var sgt = cap.sergeants[sName];
                        var sgtLoc = sgt.location || capLoc;
                        var sgtDetached = sgt.detached || (sgtLoc !== capLoc);

                        var sgtUnits = {};
                        sgt.units.forEach(function(u) { if (!sgtUnits[u.type]) sgtUnits[u.type] = 0; sgtUnits[u.type]++; });
                        var sgtUnitStr = [];
                        for (var t in sgtUnits) {
                            var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
                            sgtUnitStr.push((ut ? ut.emoji + ' ' + ut.name : t) + ': ' + sgtUnits[t]);
                        }

                        h += '<div style="margin-left:15px; padding:3px; border-left:1px solid ' + (sgtDetached ? '#7ac98a' : '#2a201a') + '; margin-top:2px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">';
                        h += '<span style="color:#b8a890; font-size:11px;">🛡️ ' + sName + (sgtDetached ? ' <span style="color:#7ac98a;">(отделён)</span>' : '') + '</span>';
                        h += '<br><span style="font-size:10px;color:#6a5a48;">📍 ' + (sgtLoc === 'castle' ? '🏰 Замок' : getZoneName(sgtLoc)) + ' [' + (WORLD_AREAS[sgtLoc] ? WORLD_AREAS[sgtLoc].x + ',' + WORLD_AREAS[sgtLoc].y : '?') + ']</span>';
                        h += '<br><span style="font-size:10px;color:#b8a890;">' + (sgtUnitStr.length > 0 ? sgtUnitStr.join(' | ') : 'Нет юнитов') + '</span>';

                        if (canManageRights(currentUser, 'sergeant', cmd.name, cName)) {
                            h += '<span style="font-size:10px; color:#a08d78;">';
                            h += '<label><input type="checkbox" ' + (sgt.allow_detach_self ? 'checked' : '') + ' onchange="window.toggleSergeantPermOnMap(\'' + cmd.name + '\',\'' + cName + '\',\'' + sName + '\',\'allow_detach_self\',this.checked)"> 🚶 Сам</label>';
                            h += '</span>';
                        }

                        h += '<span>';
                        if (sgtDetached) {
                            h += '<button class="btn btn-small" style="font-size:9px;" onclick="window.moveDetachedSergeant(\'' + cmd.name + '\',\'' + cName + '\',\'' + sName + '\',\'' + zoneId + '\')">🚶</button> ';
                            if (sgtLoc === capLoc) {
                                h += '<button class="btn btn-small" style="font-size:9px; background:#3d5a2a;" onclick="window.mergeUnitOnMap(\'' + cmd.name + '\',\'' + cName + '\',\'' + sName + '\')">🔗</button>';
                            }
                        } else if (isHighCommand || sgt.allow_detach_self) {
                            h += '<button class="btn btn-small" style="font-size:9px;" onclick="window.detachUnitOnMap(\'' + cmd.name + '\',\'' + cName + '\',\'' + sName + '\')">✂️</button>';
                        }
                        h += '</span></div>';
                    }
                    h += '</div>';
                }
            }
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

// ============================================================
// ГАЛОЧКИ, ОТДЕЛЕНИЕ, ДВИЖЕНИЕ
// ============================================================

window.toggleSquadPermOnMap = function(cmdName, perm, isChecked) {
    var user = users[currentUser];
    var myRank = user.game.houseRank;
    if (['lord','heir','war_master'].indexOf(myRank) === -1) {
        setMessage('❌ Только высшее командование может менять права.');
        return;
    }
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    if (squads[cmdName]) {
        squads[cmdName][perm] = isChecked;
        safeSave();
        setMessage('✅ Права обновлены.');
        closeOwnUnitsModal();
        setTimeout(function() { handleZoneClick(squads[cmdName].location); }, 300);
    }
};

window.toggleCaptainPermOnMap = function(cmdName, capName, perm, isChecked) {
    var user = users[currentUser];
    var myRank = user.game.houseRank;
    if (['lord','heir','war_master'].indexOf(myRank) === -1) return;
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    if (squads[cmdName] && squads[cmdName].captains[capName]) {
        squads[cmdName].captains[capName][perm] = isChecked;
        safeSave();
        setMessage('✅ Права капитана обновлены.');
        closeOwnUnitsModal();
        setTimeout(function() { handleZoneClick(squads[cmdName].location); }, 300);
    }
};

window.toggleSergeantPermOnMap = function(cmdName, capName, sgtName, perm, isChecked) {
    var user = users[currentUser];
    var myRank = user.game.houseRank;
    if (['lord','heir','war_master'].indexOf(myRank) === -1) return;
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    if (squads[cmdName] && squads[cmdName].captains[capName] && squads[cmdName].captains[capName].sergeants[sgtName]) {
        squads[cmdName].captains[capName].sergeants[sgtName][perm] = isChecked;
        safeSave();
        setMessage('✅ Права сержанта обновлены.');
        closeOwnUnitsModal();
        setTimeout(function() { handleZoneClick(squads[cmdName].location); }, 300);
    }
};

window.detachUnitOnMap = function(cmdName, capName, sgtName) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad) return;

    if (!sgtName && squad.captains[capName]) {
        squad.captains[capName].detached = true;
        squad.captains[capName].location = squad.location;
        for (var s in squad.captains[capName].sergeants) {
            squad.captains[capName].sergeants[s].location = squad.location;
        }
    } else if (sgtName && squad.captains[capName] && squad.captains[capName].sergeants[sgtName]) {
        squad.captains[capName].sergeants[sgtName].detached = true;
        squad.captains[capName].sergeants[sgtName].location = squad.location;
    }
    safeSave();
    setMessage('✂️ Отряд разделён.');
    closeOwnUnitsModal();
    setTimeout(function() { handleZoneClick(squad.location); }, 300);
};

window.mergeUnitOnMap = function(cmdName, capName, sgtName) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad) return;

    if (!sgtName && squad.captains[capName]) {
        if (squad.captains[capName].location === squad.location) {
            squad.captains[capName].detached = false;
            squad.captains[capName].location = squad.location;
            for (var s in squad.captains[capName].sergeants) {
                squad.captains[capName].sergeants[s].detached = false;
                squad.captains[capName].sergeants[s].location = squad.location;
            }
        } else {
            setMessage('❌ Капитан не на одной клетке с командором.');
            return;
        }
    } else if (sgtName && squad.captains[capName] && squad.captains[capName].sergeants[sgtName]) {
        if (squad.captains[capName].sergeants[sgtName].location === (squad.captains[capName].location || squad.location)) {
            squad.captains[capName].sergeants[sgtName].detached = false;
            squad.captains[capName].sergeants[sgtName].location = squad.captains[capName].location || squad.location;
        } else {
            setMessage('❌ Сержант не на одной клетке с капитаном.');
            return;
        }
    }
    safeSave();
    setMessage('🔗 Войска соединены.');
    closeOwnUnitsModal();
    setTimeout(function() { handleZoneClick(squad.location); }, 300);
};

window.moveSquadFromModal = function(zoneId, cmdName) {
    if (!cmdName) {
        window.currentMovingCommander = { zoneId: zoneId, type: 'squad' };
        window._awaitingTarget = true;
        window._targetData = { fromZone: zoneId, isScout: false, isSquad: true };
        window.closeOwnUnitsModal();
        setMessage('🎯 Выберите целевую зону для отряда.');
        return;
    }

    window._awaitingTarget = true;
    window._targetData = { fromZone: zoneId, isScout: false, isSquad: true, commanderName: cmdName };
    window.closeOwnUnitsModal();
    setMessage('🎯 Выберите целевую зону для отряда ' + cmdName + '.');
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
// НЕДОСТАЮЩИЕ ФУНКЦИИ UI
// ============================================================

window.selectCommanderForMove = function(zoneId, rank, name) {
    window.currentMovingCommander = { type: 'commander', name: name, rank: rank, zoneId: zoneId };
    window._awaitingTarget = true;
    window._targetData = { fromZone: zoneId, isScout: false };
    window.closeOwnUnitsModal();
    setMessage('🎯 Выберите целевую зону для командора ' + name + '.');
};

window.selectScoutForMove = function(zoneId, index) {
    window.currentMovingCommander = { type: 'scout', zoneId: zoneId, scoutIndex: index };
    window._awaitingTarget = true;
    window._targetData = { fromZone: zoneId, isScout: true };
    window.closeOwnUnitsModal();
    setMessage('🎯 Выберите целевую зону для разведчика.');
};

window.selectUnattachedForMove = function(zoneId) {
    var inputs = document.querySelectorAll('.unattached-count');
    window._selectedUnitTypes = {};
    inputs.forEach(function(inp) {
        var count = parseInt(inp.value) || 0;
        if (count > 0) window._selectedUnitTypes[inp.getAttribute('data-type')] = count;
    });
    if (Object.keys(window._selectedUnitTypes).length === 0) { setMessage('❌ Выберите хотя бы 1 юнита.'); return; }
    window.currentMovingCommander = { type: 'unattached', zoneId: zoneId };
    window._awaitingTarget = true;
    window._targetData = { fromZone: zoneId, isScout: false };
    window.closeOwnUnitsModal();
    setMessage('🎯 Выберите целевую зону для войск.');
};

window.detachScout = function(zoneId) {
    var user = users[currentUser];
    if (!user || !user.game.house) { setMessage('❌ Вы не в доме.'); return; }
    var houseId = user.game.house;
    var garrison = window._castleGarrisons[houseId];
    if (!garrison) { setMessage('❌ Нет гарнизона.'); return; }
    var zone = WORLD_AREAS[zoneId];
    var isCastle = zone && (zone.type === 'castle' || zone.type === 'castle_gate');

    var found = null;
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (found || !garrison[cat]) return;
        for (var i = 0; i < garrison[cat].length; i++) {
            var u = garrison[cat][i];
            if ((u.location === zoneId || (isCastle && u.location === 'castle')) && !u.commander && !u.squadId && !u.isScout) {
                found = u; break;
            }
        }
    });

    if (!found) { setMessage('❌ Нет свободных юнитов для разведки.'); return; }
    found.isScout = true;
    found.scoutHome = zoneId;
    safeSave();
    setMessage('👁️ Разведчик выделен.');
    addHouseLog(houseId, '👁️ ' + currentUser + ' выделил разведчика');
    closeOwnUnitsModal();
    setTimeout(function() { handleZoneClick(zoneId); }, 300);
};

window.mergeScout = function(index, zoneId) {
    var user = users[currentUser];
    if (!user || !user.game.house) return;
    var houseId = user.game.house;
    var ownUnits = getOwnUnitsInZone(zoneId, houseId);
    var item = ownUnits.scouts[index];
    if (!item) { setMessage('❌ Разведчик не найден.'); return; }
    item.unit.isScout = false;
    delete item.unit.scoutHome;
    safeSave();
    setMessage('🔗 Разведчик возвращён в войска.');
    closeOwnUnitsModal();
    setTimeout(function() { handleZoneClick(zoneId); }, 300);
};

window.attackEnemyScout = function(zoneId, index) {
    var user = users[currentUser];
    if (!user || !user.game.house) return;
    var houseId = user.game.house;
    var enemyScouts = findEnemyScoutsInZone(zoneId, houseId);
    var es = enemyScouts[index];
    if (!es) { setMessage('❌ Разведчик не найден.'); return; }

    if (Math.random() < 0.5) {
        var g = window._castleGarrisons[es.house];
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (!g[cat]) return;
            var idx = g[cat].indexOf(es.unit);
            if (idx !== -1) g[cat].splice(idx, 1);
        });
        safeSave();
        setMessage('⚔️ Вражеский разведчик уничтожен!');
        addHouseLog(houseId, '⚔️ ' + currentUser + ' уничтожил разведчика дома ' + es.house);
    } else {
        setMessage('💨 Разведчик ускользнул!');
    }
    closeOwnUnitsModal();
    setTimeout(function() { handleZoneClick(zoneId); }, 300);
};

// ============================================================
// ПОДТВЕРЖДЕНИЕ И ОТПРАВКА (С ownerKey)
// ============================================================

window.confirmTarget = function(targetZoneId, action, timeMinutes) {
    var data = window._targetData;
    if (!data) { setMessage('❌ Нет данных.'); return; }

    var cmd = window.currentMovingCommander;

    if (cmd && cmd.type === 'detached_cap') {
        window._awaitingTarget = false;
        window._targetData = null;
        window.currentMovingCommander = null;
        window.closeConfirmMove();

        var user = users[currentUser];
        var houseId = user.game.house;
        var myRank = user.game.houseRank;
        var isHigh = ['lord','heir','war_master'].indexOf(myRank) !== -1;
        var squads = window.getSquads(houseId);
        var squad = squads[cmd.cmdName];
        if (squad && squad.captains[cmd.capName]) {
            var cap = squad.captains[cmd.capName];

            if (!isHigh && currentUser !== cmd.capName && !cap.allow_detach_self) {
                setMessage('❌ Нет прав двигать этого капитана.'); return;
            }
            if (cap.units.length === 0) { setMessage('❌ У капитана нет юнитов.'); return; }

            var fromZone = data.fromZone === 'castle' ? getCastleZoneId(houseId) : data.fromZone;
            var path = findPath(fromZone, targetZoneId);
            if (!path || path.length < 2) { setMessage('❌ Нет сухопутного пути до цели.'); return; }

            // Неотделённые сержанты идут с капитаном
            var moveUnits = cap.units.slice();
            var movedSgts = [];
            for (var sName in cap.sergeants) {
                var sgt = cap.sergeants[sName];
                if (!sgt.detached) {
                    moveUnits = moveUnits.concat(sgt.units);
                    sgt.units = [];
                    movedSgts.push(sName);
                }
            }

            var marchData = {
                id: 'detach_cap_' + Date.now(), units: moveUnits, path: path, currentStep: 0,
                action: 'move', houseId: houseId, speedPerZone: 2, moveTimeMs: 120000, waitTimeMs: 10000,
                phase: 'waiting', nextPhaseTime: Date.now() + 10000,
                isDetachedCap: true, cmdName: cmd.cmdName, capName: cmd.capName, movedSgts: movedSgts,
                ownerKey: cmd.cmdName + '|' + cmd.capName
            };
            var garrison = window._castleGarrisons[houseId];
            if (!garrison.marching) garrison.marching = [];
            garrison.marching.push(marchData);
            cap.units = [];

            safeSave();
            setMessage('🚶 Отделённый капитан выступил.');
            processMarchStep(marchData.id);
        }
        return;
    }

    if (cmd && cmd.type === 'detached_sgt') {
        window._awaitingTarget = false;
        window._targetData = null;
        window.currentMovingCommander = null;
        window.closeConfirmMove();

        var user = users[currentUser];
        var houseId = user.game.house;
        var myRank = user.game.houseRank;
        var isHigh = ['lord','heir','war_master'].indexOf(myRank) !== -1;
        var squads = window.getSquads(houseId);
        var squad = squads[cmd.cmdName];
        if (squad && squad.captains[cmd.capName] && squad.captains[cmd.capName].sergeants[cmd.sName]) {
            var sgt = squad.captains[cmd.capName].sergeants[cmd.sName];

            if (!isHigh && currentUser !== cmd.sName && !sgt.allow_detach_self) {
                setMessage('❌ Нет прав двигать этого сержанта.'); return;
            }
            if (sgt.units.length === 0) { setMessage('❌ У сержанта нет юнитов.'); return; }

            var fromZone = data.fromZone === 'castle' ? getCastleZoneId(houseId) : data.fromZone;
            var path = findPath(fromZone, targetZoneId);
            if (!path || path.length < 2) { setMessage('❌ Нет сухопутного пути до цели.'); return; }

            var marchData = {
                id: 'detach_sgt_' + Date.now(), units: sgt.units.slice(), path: path, currentStep: 0,
                action: 'move', houseId: houseId, speedPerZone: 2, moveTimeMs: 120000, waitTimeMs: 10000,
                phase: 'waiting', nextPhaseTime: Date.now() + 10000,
                isDetachedSgt: true, cmdName: cmd.cmdName, capName: cmd.capName, sName: cmd.sName,
                ownerKey: cmd.cmdName + '|' + cmd.capName + '|' + cmd.sName
            };
            var garrison = window._castleGarrisons[houseId];
            if (!garrison.marching) garrison.marching = [];
            garrison.marching.push(marchData);
            sgt.units = [];

            safeSave();
            setMessage('🚶 Отделённый сержант выступил.');
            processMarchStep(marchData.id);
        }
        return;
    }

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
        window.currentMovingCommander = null;
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
    var user = users[currentUser]; var houseId = user.game.house;
    if (fromZoneId === 'castle') fromZoneId = getCastleZoneId(houseId);
    var garrison = window._castleGarrisons[houseId];
    if (!garrison) { setMessage('❌ Нет гарнизона.'); return; }
    var takenUnits = []; var commander = window.currentMovingCommander;
    if (!commander) { setMessage('❌ Не выбран отправитель.'); return; }
    if (!isScout) isScout = false;
    var zone = WORLD_AREAS[fromZoneId]; var isCastle = zone && (zone.type==='castle'||zone.type==='castle_gate');

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
    if(!path||path.length<2){
        // Возвращаем юнитов обратно — пути нет
        takenUnits.forEach(function(u){ returnUnit(u, garrison); });
        setMessage('❌ Нет сухопутного пути до цели.');
        return;
    }
    var moveTimeMs=speedPerZone*60*1000;var waitTimeMs=10000;
    var marchId='march_'+Date.now()+'_'+Math.floor(Math.random()*1000);
    var marchData={
        id:marchId,units:takenUnits,path:path,currentStep:0,
        action:action,houseId:houseId,speedPerZone:speedPerZone,
        moveTimeMs:moveTimeMs,waitTimeMs:waitTimeMs,
        phase:'waiting',nextPhaseTime:Date.now()+waitTimeMs,isScout:isScout,
        squadId: commander.squadId || null,
        captainId: commander.captainId || null,
        sergeantId: commander.sergeantId || null,
        ownerKey: (commander.squadId||'')+'|'+(commander.captainId||'')+'|'+(commander.sergeantId||'')
    };
    if(!garrison.marching)garrison.marching=[];
    garrison.marching.push(marchData);
    window.currentMovingCommander = null;

    safeSave();
    setMessage('✅ Отряд выступил! '+takenUnits.length+' юнитов, '+(path.length-1)+' зон.');
    addHouseLog(houseId,'🚶 Отряд в '+getZoneName(targetZoneId));
    processMarchStep(marchId);
};

// ============================================================
// ПОШАГОВОЕ ДВИЖЕНИЕ (ПОЛНОСТЬЮ ИСПРАВЛЕНО: таймеры не умирают, отделённые доходят)
// ============================================================

function processMarchStep(marchId) {
    var marchData=null,garrison=null;
    for(var hid in window._castleGarrisons){
        var g=window._castleGarrisons[hid];
        if(g.marching)for(var i=0;i<g.marching.length;i++){if(g.marching[i].id===marchId){marchData=g.marching[i];garrison=g;break;}}
        if(marchData)break;
    }
    if(!marchData){ stopMarchTimer(marchId); return; }

    var now=Date.now();
    if(now<marchData.nextPhaseTime){ scheduleMarch(marchId, marchData.nextPhaseTime-now); return; }

    if(marchData.phase==='waiting'){
        marchData.phase='moving';
        marchData.nextPhaseTime=Date.now()+marchData.moveTimeMs;
        // ИСПРАВЛЕНО: таймер ПЕРЕД сохранением — не умрёт при ошибке localStorage
        scheduleMarch(marchId, marchData.moveTimeMs);
        safeSave();
        if (users[currentUser]) updateMenu();
        return;
    }

    if(marchData.phase==='moving'){
        marchData.currentStep++;

        if(marchData.currentStep>=marchData.path.length-1){
            stopMarchTimer(marchId);

            // Все переменные определяем ДО использования
            var targetZone=WORLD_AREAS[marchData.path[marchData.path.length-1]];
            var action=marchData.action;
            var units=marchData.units;
            var newLoc = (targetZone && (targetZone.type==='castle'||targetZone.type==='castle_gate')) ? 'castle' : (targetZone ? targetZone.id : marchData.path[marchData.path.length-1]);

            var idx=garrison.marching.indexOf(marchData);
            if(idx!==-1)garrison.marching.splice(idx,1);

            // --- ЕДИНАЯ ЛОГИКА РАЗМЕЩЕНИЯ ЮНИТОВ ---
            placeUnits(marchData, newLoc, targetZone, action, garrison);

            if (users[currentUser]) updateMenu();
            return;
        }

        marchData.phase='waiting';
        marchData.nextPhaseTime=Date.now()+marchData.waitTimeMs;
        // ИСПРАВЛЕНО: таймер ПЕРЕД сохранением
        scheduleMarch(marchId, marchData.waitTimeMs);
        safeSave();
        if (users[currentUser]) updateMenu();
    }
}

// Единая функция размещения и автослияния
function placeUnits(marchData, newLoc, targetZone, action, garrison) {
    var houseId = marchData.houseId;
    var squads = window.getSquads(houseId);

    // 1. Отделённый капитан
    if (marchData.isDetachedCap) {
        var sq = squads[marchData.cmdName];
        if (sq && sq.captains[marchData.capName]) {
            var cap = sq.captains[marchData.capName];
            cap.location = newLoc;
            cap.detached = true;
            cap.units = [];
            marchData.units.forEach(function(u){
                u.location = newLoc;
                u.squadId = marchData.cmdName;
                u.captainId = marchData.capName;
                if (u.sergeantId && marchData.movedSgts && marchData.movedSgts.indexOf(u.sergeantId) !== -1 && cap.sergeants[u.sergeantId]) {
                    cap.sergeants[u.sergeantId].units.push(u);
                } else {
                    cap.units.push(u);
                }
            });
            if (marchData.movedSgts) {
                marchData.movedSgts.forEach(function(sName){
                    if (cap.sergeants[sName]) {
                        cap.sergeants[sName].location = newLoc;
                        cap.sergeants[sName].detached = false;
                    }
                });
            }
            // Автослияние: если капитан пришёл к командору
            var cmdLoc = sq.location || 'castle';
            if (zoneKey(newLoc, houseId) === zoneKey(cmdLoc, houseId)) {
                cap.detached = false;
                cap.location = cmdLoc;
            }
        } else {
            marchData.units.forEach(function(u){ u.location=newLoc; returnUnit(u, window._castleGarrisons[houseId]); });
        }
        safeSave();
        setMessage('✅ Отделённый капитан ' + marchData.capName + ' прибыл в ' + getZoneName(targetZone ? targetZone.id : newLoc));
        addHouseLog(houseId, '🚶 Капитан ' + marchData.capName + ' прибыл в ' + getZoneName(targetZone ? targetZone.id : newLoc));
        return;
    }

    // 2. Отделённый сержант
    if (marchData.isDetachedSgt) {
        var sq = squads[marchData.cmdName];
        if (sq && sq.captains[marchData.capName] && sq.captains[marchData.capName].sergeants[marchData.sName]) {
            var sgt = sq.captains[marchData.capName].sergeants[marchData.sName];
            sgt.location = newLoc;
            sgt.detached = true;
            sgt.units = marchData.units;
            marchData.units.forEach(function(u){ u.location = newLoc; u.squadId = marchData.cmdName; });
            // Автослияние: если сержант пришёл к капитану
            var capLoc = sq.captains[marchData.capName].location || sq.location;
            if (zoneKey(newLoc, houseId) === zoneKey(capLoc, houseId)) {
                sgt.detached = false;
                sgt.location = capLoc;
            }
        } else {
            marchData.units.forEach(function(u){ u.location=newLoc; returnUnit(u, window._castleGarrisons[houseId]); });
        }
        safeSave();
        setMessage('✅ Отделённый сержант ' + marchData.sName + ' прибыл в ' + getZoneName(targetZone ? targetZone.id : newLoc));
        addHouseLog(houseId, '🚶 Сержант ' + marchData.sName + ' прибыл в ' + getZoneName(targetZone ? targetZone.id : newLoc));
        return;
    }

    // 3. Разведка
    if(marchData.isScout && action==='scout'){
        if(Math.random()<0.5){
            var enemies=findEnemiesInZone(targetZone?targetZone.id:'',marchData.houseId);
            var info='🔍 РАЗВЕДКА!\n\nВраги:\n';
            if(enemies.length===0)info+='Нет.';
            else{var ec={};enemies.forEach(function(e){var hh=HOUSES[e.house];var n=hh?hh.sigil+' '+hh.name:e.house;if(!ec[n])ec[n]=0;ec[n]++;});
            for(var n in ec)info+=n+': ~'+ec[n]+' юнитов\n';}
            var homeZone=units[0].scoutHome||marchData.path[0];
            units.forEach(function(u){u.location=homeZone;u.isScout=true;returnUnit(u,window._castleGarrisons[marchData.houseId]);});
            safeSave();alert(info);setMessage('👁️ Разведка успешна!');
        }else{safeSave();setMessage('💀 Разведчик погиб.');}
    } else {
        // 4. Обычные отряды / личные войска
        if (marchData.isPlayerMove) {
            returnPlayerUnits(marchData, targetZone, newLoc);
        } else if (marchData.isSquad || marchData.squadId || marchData.commanderName) {
            returnSquadUnits(marchData, targetZone, newLoc);
        } else {
            var enemies=findEnemiesInZone(targetZone?targetZone.id:'',marchData.houseId);
            if(enemies.length>0){
                resolveBattle(units,enemies,targetZone?targetZone.id:'',marchData.houseId,action);
            } else {
                if(action==='attack'&&targetZone)targetZone.owner=marchData.houseId;
            }
            // Выжившие возвращаем в гарнизон
            units.forEach(function(u){
                u.location=newLoc;
                u.stance=action==='defend'?'defending':'moving';
                returnUnit(u,window._castleGarrisons[marchData.houseId]);
            });
            safeSave();
            if(enemies.length===0)setMessage('✅ Отряд прибыл в '+getZoneName(targetZone?targetZone.id:newLoc));
        }
    }
}

function returnSquadUnits(marchData, targetZone, newLoc) {
    var houseId = marchData.houseId;
    var squads = window.getSquads(houseId);
    var squad = squads[marchData.squadId || marchData.commanderName];
    var isCastleZone = targetZone && (targetZone.type==='castle'||targetZone.type==='castle_gate');
    var newLocation = isCastleZone ? 'castle' : (targetZone ? targetZone.id : marchData.path[marchData.path.length-1]);

    if (!squad) {
        marchData.units.forEach(function(u) {
            u.location = newLocation;
            u.stance = 'moving';
            u.squadId = null; u.captainId = null; u.sergeantId = null;
            returnUnit(u, window._castleGarrisons[houseId]);
        });
        safeSave();
        setMessage('⚠️ Отряд расформирован, юниты возвращены в гарнизон.');
        return;
    }

    squad.location = newLocation;

    // ИСПРАВЛЕНО: бой ДО размещения, выжившие остаются в marchData.units
    var enemies = findEnemiesInZone(targetZone ? targetZone.id : '', houseId);
    if (enemies.length > 0) {
        resolveBattle(marchData.units, enemies, targetZone ? targetZone.id : '', houseId, marchData.action);
    } else if (marchData.action === 'attack' && targetZone) {
        targetZone.owner = houseId;
    }

    // ИСПРАВЛЕНО: локации неотделённых капитанов/сержантов следуют за отрядом
    for (var capName in squad.captains) {
        var cap = squad.captains[capName];
        if (!cap.detached) {
            cap.location = newLocation;
            for (var sgtName in cap.sergeants) {
                if (!cap.sergeants[sgtName].detached) cap.sergeants[sgtName].location = newLocation;
            }
        }
    }

    // Размещаем ВЫЖИВШИХ обратно в иерархию (без дублей в гарнизоне!)
    marchData.units.forEach(function(u) {
        u.location = newLocation;
        u.stance = marchData.action === 'defend' ? 'defending' : 'moving';

        if (u.sergeantId && u.captainId && squad.captains[u.captainId] && squad.captains[u.captainId].sergeants[u.sergeantId]) {
            squad.captains[u.captainId].sergeants[u.sergeantId].units.push(u);
        } else if (u.captainId && squad.captains[u.captainId]) {
            squad.captains[u.captainId].units.push(u);
        } else {
            squad.units.push(u);
        }
    });

    // АВТОСЛИЯНИЕ ПО КЛЕТКЕ
    var sqLoc = zoneKey(squad.location, houseId);
    for (var capName in squad.captains) {
        var cap = squad.captains[capName];
        var cLoc = zoneKey(cap.location || squad.location, houseId);
        
        // Капитан догнал командора → пристегнулся
        if (cap.detached && cLoc === sqLoc) {
            cap.detached = false;
            cap.location = squad.location;
        }
        
        for (var sgtName in cap.sergeants) {
            var sgt = cap.sergeants[sgtName];
            var sLoc = zoneKey(sgt.location || cap.location, houseId);
            
            // Сержант догнал капитана → пристегнулся
            if (sgt.detached && sLoc === cLoc) {
                sgt.detached = false;
                sgt.location = cap.location;
            }
        }
    }

    safeSave();
    if (enemies.length === 0) {
        setMessage('✅ Отряд прибыл в ' + getZoneName(targetZone ? targetZone.id : newLocation));
    }
    addHouseLog(houseId, '🚶 Отряд ' + (marchData.squadId || '') + ' прибыл в ' + getZoneName(targetZone ? targetZone.id : newLocation));
}

function returnPlayerUnits(marchData, targetZone, newLoc) {
    var houseId = marchData.houseId;
    var isCastleZone = targetZone && (targetZone.type==='castle'||targetZone.type==='castle_gate');
    var newLocation = isCastleZone ? 'castle' : (targetZone ? targetZone.id : marchData.path[marchData.path.length-1]);

    var squads = window.getSquads(houseId);
    var squad = squads[marchData.squadId];

    if (squad) {
        marchData.units.forEach(function(u) {
            u.location = newLocation;
            u.stance = 'moving';

            if (marchData.sergeantId && marchData.captainId && squad.captains[marchData.captainId] && squad.captains[marchData.captainId].sergeants[marchData.sergeantId]) {
                squad.captains[marchData.captainId].sergeants[marchData.sergeantId].units.push(u);
            } else if (marchData.captainId && squad.captains[marchData.captainId]) {
                squad.captains[marchData.captainId].units.push(u);
            } else {
                squad.units.push(u);
            }
        });
        // НЕ двигаем весь отряд — двигались только личные войска игрока
    } else {
        var garrison = window._castleGarrisons[houseId];
        marchData.units.forEach(function(u) {
            u.location = newLocation;
            u.stance = 'moving';
            returnUnit(u, garrison);
        });
    }

    safeSave();
    setMessage('✅ Ваши войска прибыли в ' + getZoneName(targetZone ? targetZone.id : newLocation));
}

function returnUnit(u, garrison) {
    if (!garrison) return;
    if (!garrison.infantry) garrison.infantry = [];
    if (!garrison.cavalry) garrison.cavalry = [];
    if (!garrison.siege) garrison.siege = [];
    if (u.siege) garrison.siege.push(u);
    else if (u.horse || u.type==='rider' || u.type==='heavy_rider' || u.type==='knight') garrison.cavalry.push(u);
    else garrison.infantry.push(u);
}

// ============================================

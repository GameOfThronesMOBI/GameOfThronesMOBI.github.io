// ============================================================
// js/game/06-diplomacy.js — ПОЛИТИКА, ДОМ, РОЛИ, АРМИЯ, КОМАНДОВАНИЕ
// ПОЛНАЯ ВЕРСИЯ — ВСЕ ФУНКЦИИ — ИСПРАВЛЕНО
// ============================================================

var HOUSE_RANKS = {
    lord: { name: '👑 Лорд/Леди', order: 1, description: 'Глава дома.', canAssign: ['heir','war_master','castellan','steward','treasurer','maester','whisperer','knight_commander','captain_officer','sergeant','knight'] },
    heir: { name: '🏴 Наследник', order: 2, description: 'Преемник лорда.', canAssign: ['war_master','castellan','steward','treasurer','maester','whisperer','knight_commander','captain_officer','sergeant','knight'] },
    war_master: { name: '⚔️ Мастер над войной', order: 3, description: 'Оборона и гарнизон.', canAssign: ['knight_commander','captain_officer','sergeant','knight'] },
    castellan: { name: '🏰 Кастелян', order: 4, description: 'Управление замком.', canAssign: [] },
    steward: { name: '🍞 Стюард', order: 5, description: 'Хозяйство и припасы.', canAssign: [] },
    treasurer: { name: '💰 Казначей', order: 6, description: 'Доходы и налоги.', canAssign: [] },
    maester: { name: '📜 Мейстер', order: 7, description: 'Советник и врач.', canAssign: [] },
    whisperer: { name: '🕵️ Мастер над шпионажем', order: 8, description: 'Разведка.', canAssign: [] },
    knight_commander: { name: '⭐ Рыцарь-командор', order: 9, description: 'Командует армией.', canAssign: ['captain_officer','sergeant','knight'] },
    captain_officer: { name: '🗡️ Капитан', order: 10, description: 'Командует ротой.', canAssign: ['sergeant','knight'] },
    sergeant: { name: '🛡️ Сержант', order: 11, description: 'Командует отрядом.', canAssign: [] },
    knight: { name: '⚔️ Рыцарь', order: 12, description: 'Элитный воин.', canAssign: [] }
};

var RANK_LIMITS = {
    lord: 1, heir: 1, war_master: 1, castellan: 1, steward: 1,
    treasurer: 1, maester: 1, whisperer: 1,
    knight_commander: -1, captain_officer: -1, sergeant: -1, knight: -1
};

var invitations = {};

// ============================================================
// 1. МОЙ ДОМ
// ============================================================

window.openMyHouse = function() {
    var user = users[currentUser];
    var g = user.game;
    var modal = document.getElementById('modal-houses');
    var content = document.getElementById('modal-houses-content');
    var menuModal = document.getElementById('modal-menu');
    if (menuModal) menuModal.classList.add('hide');
    
    var html = '<div class="modal-section"><h4>🏰 МОЙ ДОМ</h4>';
    
    if (!g.house) {
        html += '<p style="color:#6a5a48;">Вы не состоите в доме.</p>';
        html += '<div class="modal-section"><h4>📨 ПРИГЛАШЕНИЯ</h4>';
        var invs = invitations[currentUser] || [];
        if (invs.length === 0) {
            html += '<p style="color:#6a5a48;">У вас нет приглашений.</p>';
        } else {
            invs.forEach(function(inv) {
                var h = HOUSES[inv.houseId];
                html += '<div class="row" style="padding:8px 0; border-bottom:1px solid #1a1410;">';
                html += '<span class="label">' + (h ? h.sigil + ' ' + h.name : inv.houseId) + ' (от ' + (inv.from || '?') + ')</span>';
                html += '<span class="value"><button class="btn btn-small" onclick="acceptInvite(\'' + inv.houseId + '\')">✅</button> <button class="btn btn-small" style="background:#3d2a1a;" onclick="declineInvite(\'' + inv.houseId + '\')">❌</button></span>';
                html += '</div>';
            });
        }
        html += '</div>';
    } else {
        var house = HOUSES[g.house];
        if (house) {
            html += '<div style="text-align:center;margin-bottom:10px;">';
            html += '<span style="font-size:32px;">' + house.sigil + '</span><br>';
            html += '<strong style="color:#c9b694;font-size:18px;">' + house.name + '</strong><br>';
            html += '<span style="color:#6a5a48;">' + (house.motto || '') + '</span>';
            if (g.houseRank) html += '<br><span style="color:#ffd700;">' + (HOUSE_RANKS[g.houseRank] ? HOUSE_RANKS[g.houseRank].name : g.houseRank) + '</span>';
            html += '</div>';
            
            html += '<div class="tabs" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;">';
            html += '<button class="tab-btn active" onclick="showHouseTab(\'info\')">📜 Инфо</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'members\')">👥 Участники</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'army\')">⚔️ Армия</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'chronicle\')">📜 Летопись</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'invite\')">📨 Пригласить</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'sent\')">📤 Отправленные</button>';
            html += '</div>';
            html += '<div id="house-tab-content"></div>';
            
            html += '<div class="modal-section" style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;">';
            var mySquad = window.getMySquad ? window.getMySquad() : null;
            if (mySquad) {
                html += '<button class="btn btn-small" onclick="window.leaveSquad(); setTimeout(function(){ showHouseTab(\'army\'); }, 300);">🚶 Покинуть отряд</button>';
            } else if (g._leftSquad) {
                html += '<button class="btn btn-small" onclick="rejoinSquadAuto(); setTimeout(function(){ showHouseTab(\'army\'); }, 300);">✅ Вернуться в отряд</button>';
            }
            html += '<button class="btn btn-danger" onclick="leaveHouse()">🚪 Покинуть дом</button>';
            html += '</div>';
        }
    }
    
    html += '<button class="btn btn-secondary" onclick="closeHouses()" style="margin-top:10px;">Закрыть</button>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
    
    if (g.house) showHouseTab('info');
};

// ============================================================
// 2. ВКЛАДКИ ДОМА
// ============================================================

window.showHouseTab = function(tab) {
    var container = document.getElementById('house-tab-content');
    if (!container) return;
    var user = users[currentUser];
    var g = user.game;
    var house = HOUSES[g.house];
    if (!house) return;
    var html = '';
    
    var allTabs = document.querySelectorAll('#modal-houses .tab-btn');
    allTabs.forEach(function(t) { t.classList.remove('active'); });
    var activeTab = document.querySelector('#modal-houses .tab-btn[onclick*="\'' + tab + '\'"]');
    if (activeTab) activeTab.classList.add('active');
    
    if (tab === 'info') {
        html += '<div class="modal-section">';
        html += '<div class="row"><span class="label">📍 Регион</span><span class="value">' + (house.region || '—') + '</span></div>';
        html += '<div class="row"><span class="label">🏰 Замок</span><span class="value">' + (house.castle || 'Нет') + '</span></div>';
        html += '<div class="row"><span class="label">👑 Сюзерен</span><span class="value">' + (house.liege ? (HOUSES[house.liege] ? HOUSES[house.liege].sigil + ' ' + HOUSES[house.liege].name : house.liege) : 'Независимый') + '</span></div>';
        var vassals = [];
        for (var id in HOUSES) { if (HOUSES[id].liege === g.house) vassals.push(HOUSES[id]); }
        html += '<div class="row"><span class="label">⚓ Вассалы</span><span class="value">' + (vassals.length > 0 ? vassals.length + ' домов' : 'Нет') + '</span></div>';
        if (vassals.length > 0) vassals.forEach(function(v) { html += '<div class="row"><span class="label" style="font-size:11px;padding-left:12px;">' + v.sigil + ' ' + v.name + '</span><span class="value"></span></div>'; });
        var zoneCount = 0;
        if (typeof WORLD_AREAS !== 'undefined') { for (var zoneId in WORLD_AREAS) { if (WORLD_AREAS[zoneId].owner === g.house) zoneCount++; } }
        html += '<div class="row"><span class="label">📍 Зон</span><span class="value">' + zoneCount + '</span></div>';
        html += '<div class="row"><span class="label">💰 Казна</span><span class="value">' + (house.treasury || 0) + ' зол.</span></div>';
        html += '</div>';
    }
    
    if (tab === 'members') {
        html += '<div class="modal-section"><h4>👥 УЧАСТНИКИ</h4>';
        var members = getHouseMembers(g.house);
        if (members.length === 0) { html += '<p style="color:#6a5a48;">Нет участников.</p>'; }
        else {
            var canAssign = g.houseRank && HOUSE_RANKS[g.houseRank] && HOUSE_RANKS[g.houseRank].canAssign.length > 0;
            members.forEach(function(m) {
                var rankName = m.rank ? (HOUSE_RANKS[m.rank] ? HOUSE_RANKS[m.rank].name : m.rank) : 'Без звания';
                var isYou = m.name === currentUser;
                html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
                html += '<span class="label">👤 ' + m.name + (isYou ? ' (вы)' : '') + '</span>';
                html += '<span class="value">' + rankName;
                if (!isYou && canAssign && canManageMember(m.name)) {
                    html += ' <button class="btn btn-small" onclick="assignRank(\'' + m.name + '\')">📋</button>';
                }
                html += '</span></div>';
            });
        }
        html += '</div>';
    }
    
    if (tab === 'army') {
        html += '<div class="modal-section"><h4>⚔️ АРМИЯ ДОМА</h4>';
        html += '<div class="tabs" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;">';
        html += '<button class="tab-btn active" onclick="showArmySubTab(\'total\')">⚔️ Общая</button>';
        html += '<button class="tab-btn" onclick="showArmySubTab(\'command\')">👑 Командование</button>';
        html += '<button class="tab-btn" onclick="showArmySubTab(\'my_squad\')">🎯 Мой отряд</button>';
        html += '<button class="tab-btn" onclick="showArmySubTab(\'garrison\')">📍 Гарнизон</button>';
        html += '<button class="tab-btn" onclick="showArmySubTab(\'marching\')">🚶 В пути</button>';
        html += '</div>';
        html += '<div id="army-sub-tab-content"></div>';
        html += '</div>';
        container.innerHTML = html;
        showArmySubTab('total');
        return;
    }
    
    if (tab === 'chronicle') {
        html += '<div class="modal-section"><h4>📜 ЛЕТОПИСЬ</h4>';
        var chronicle = getHouseChronicle(g.house);
        if (chronicle.length === 0) { html += '<p style="color:#6a5a48;">Пусто.</p>'; }
        else { chronicle.forEach(function(entry) { html += '<div style="padding:4px 0; border-bottom:1px solid #1a1410; font-size:12px; color:#b8a890;">' + entry + '</div>'; }); }
        html += '</div>';
    }
    
    if (tab === 'invite') {
        html += '<div class="modal-section"><h4>📨 ПРИГЛАСИТЬ</h4>';
        if (!g.houseRank || !HOUSE_RANKS[g.houseRank] || HOUSE_RANKS[g.houseRank].canAssign.length === 0) {
            html += '<p style="color:#6a5a48;">У вас нет прав приглашать.</p>';
        } else {
            html += '<button class="btn" onclick="invitePlayer()">📨 Пригласить игрока</button>';
        }
        html += '</div>';
    }
    
    if (tab === 'sent') {
        html += '<div class="modal-section"><h4>📤 ОТПРАВЛЕННЫЕ</h4>';
        var sent = [];
        for (var name in invitations) {
            for (var i = 0; i < invitations[name].length; i++) {
                if (invitations[name][i].houseId === g.house) sent.push({ playerName: name });
            }
        }
        if (sent.length === 0) { html += '<p style="color:#6a5a48;">Нет.</p>'; }
        else {
            sent.forEach(function(s) {
                html += '<div class="row"><span class="label">👤 ' + s.playerName + '</span>';
                html += '<span class="value"><button class="btn btn-small" style="background:#3d2a1a;" onclick="cancelInvite(\'' + s.playerName + '\')">❌</button></span></div>';
            });
        }
        html += '</div>';
    }
    
    container.innerHTML = html;
};

// ============================================================
// ПОД-ВКЛАДКИ АРМИИ
// ============================================================

window.showArmySubTab = function(subTab) {
    var container = document.getElementById('army-sub-tab-content');
    if (!container) return;
    var user = users[currentUser];
    var g = user.game;
    var houseId = g.house;
    
    if (subTab === 'total') {
        showArmyTotalTab(houseId, container);
    } else if (subTab === 'command') {
        container.innerHTML = showCommandTab(houseId);
    } else if (subTab === 'my_squad') {
        container.innerHTML = showMySquadTab(houseId);
    } else if (subTab === 'garrison') {
        container.innerHTML = showGarrisonTab(houseId);
    } else if (subTab === 'marching') {
        showArmyMarchingTab(houseId, container);
    }
};

function showArmyTotalTab(houseId, container) {
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [], marching: [] };
    var html = '<h4>⚔️ ОБЩАЯ АРМИЯ</h4>';
    
    var allGrouped = {};
    var totalCount = 0;
    
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (garrison[cat]) {
            garrison[cat].forEach(function(u) {
                totalCount++;
                var k = u.isScout ? 'scout' : u.type;
                if (!allGrouped[k]) allGrouped[k] = 0;
                allGrouped[k]++;
            });
        }
    });
    
    var squads = window.getSquads(houseId);
    for (var cmdName in squads) {
        var squad = squads[cmdName];
        squad.units.forEach(function(u) {
            totalCount++;
            var k = u.type;
            if (!allGrouped[k]) allGrouped[k] = 0;
            allGrouped[k]++;
        });
        for (var capName in squad.captains) {
            squad.captains[capName].units.forEach(function(u) {
                totalCount++;
                var k = u.type;
                if (!allGrouped[k]) allGrouped[k] = 0;
                allGrouped[k]++;
            });
            for (var sgtName in squad.captains[capName].sergeants) {
                squad.captains[capName].sergeants[sgtName].units.forEach(function(u) {
                    totalCount++;
                    var k = u.type;
                    if (!allGrouped[k]) allGrouped[k] = 0;
                    allGrouped[k]++;
                });
            }
        }
    }
    
    if (totalCount === 0) { html += '<p style="color:#6a5a48;">Нет войск.</p>'; container.innerHTML = html; return; }
    
    html += '<p style="color:#6a5a48;">Всего: ' + totalCount + ' юнитов</p>';
    html += '<h5>🗡️ Пехота</h5>';
    for (var k in allGrouped) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[k] : null;
        if (ut && !ut.horse && !ut.siege && k !== 'scout') {
            html += '<div class="row"><span class="label">' + ut.emoji + ' ' + ut.name + '</span><span class="value">×' + allGrouped[k] + '</span></div>';
        }
    }
    html += '<h5 style="margin-top:8px;">🐴 Конница</h5>';
    for (var k in allGrouped) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[k] : null;
        if (ut && ut.horse) {
            html += '<div class="row"><span class="label">' + ut.emoji + ' ' + ut.name + '</span><span class="value">×' + allGrouped[k] + '</span></div>';
        }
    }
    html += '<h5 style="margin-top:8px;">🏗️ Осадные</h5>';
    for (var k in allGrouped) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[k] : null;
        if (ut && ut.siege && k !== 'scout') {
            html += '<div class="row"><span class="label">' + ut.emoji + ' ' + ut.name + '</span><span class="value">×' + allGrouped[k] + '</span></div>';
        }
    }
    if (allGrouped['scout']) {
        html += '<h5 style="margin-top:8px;">👁️ Разведчики</h5>';
        html += '<div class="row"><span class="label">👁️ Разведчики</span><span class="value">×' + allGrouped['scout'] + '</span></div>';
    }
    
    container.innerHTML = html;
}

function showArmyMarchingTab(houseId, container) {
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [], marching: [] };
    var html = '<h4>🚶 В ПУТИ</h4>';
    var marching = garrison.marching || [];
    
    if (marching.length === 0) { html += '<p style="color:#6a5a48;">Нет армий в пути.</p>'; }
    else {
        html += '<p style="color:#6a5a48;">Отрядов: ' + marching.length + '</p>';
        marching.forEach(function(m, i) {
            var from = m.path ? getZoneName(m.path[0]) : '?';
            var to = m.path ? getZoneName(m.path[m.path.length-1]) : '?';
            var tl = Math.max(0, Math.ceil((m.nextPhaseTime - Date.now()) / 60000));
            html += '<div style="font-size:11px;color:#b8a890;padding:4px 0;border-bottom:1px solid #1a1410;">';
            html += (m.isSquad ? '👑' : '🟢') + ' ' + from + ' → ' + to + ' | ' + m.units.length + ' юн. | ~' + tl + ' мин';
            html += ' <button class="btn btn-small" style="font-size:9px;" onclick="showMarchDetails(' + i + ')">📋</button>';
            html += '</div>';
        });
    }
    
    container.innerHTML = html;
}

// ============================================================
// КОМАНДОВАНИЕ
// ============================================================

function showCommandTab(houseId) {
    if (!window.getSquads) return '<p style="color:#c96a5a;">❌ Система командования не загружена.</p>';
    
    var user = users[currentUser];
    var myRank = user.game.houseRank;
    var isHighCommand = myRank && ['lord','heir','war_master'].indexOf(myRank) !== -1;
    var isLord = myRank === 'lord';
    
    var html = '<div class="modal-section"><h4>👑 КОМАНДОВАНИЕ</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Военная иерархия: Командоры → Капитаны → Сержанты.</p>';
    
    var commanders = [];
    for (var name in users) {
        if (users[name].game.house === houseId && users[name].game.houseRank === 'knight_commander') {
            commanders.push(name);
        }
    }
    
    if (commanders.length === 0) {
        html += '<p style="color:#6a5a48;">Нет рыцарей-командоров. Назначьте во вкладке «Участники».</p>';
        html += '</div>';
        return html;
    }
    
    var squads = window.getSquads(houseId);
    
    commanders.forEach(function(cmdName) {
        var squad = squads[cmdName];
        var cmdUser = users[cmdName];
        var cmdLeft = cmdUser && cmdUser.game._leftSquad && cmdUser.game._leftSquad.commanderName === cmdName;
        var cmdStatus = cmdLeft ? '🟡' : '🟢';
        var controlLocked = squad && squad.detached === true;
        var controlIcon = controlLocked ? '🔒' : '🔓';
        var boundTo = squad ? squad.boundTo : null;
        var boundText = boundTo ? ' 🔗 ' + (HOUSE_RANKS[boundTo] ? HOUSE_RANKS[boundTo].name : boundTo) : '';
        
        var cmdUnits = squad ? squad.units.length : 0;
        var totalUnits = cmdUnits;
        
        var locationName = squad ? (squad.location === 'castle' ? '🏰 Замок' : getZoneName(squad.location) + ' ' + getZoneCoords(squad.location)) : '—';
        
        var canManage = false;
        if (isLord) {
            canManage = true;
        } else if (isHighCommand) {
            if (!boundTo || boundTo === myRank) canManage = true;
        } else if (currentUser === cmdName) {
            canManage = true;
        }
        
        html += '<div style="background:#120e0b;border:2px solid #3d3026;border-radius:12px;padding:14px;margin:10px 0;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">';
        html += '<div>';
        html += '<strong style="color:#ffd700;font-size:16px;">⭐ ' + cmdName + '</strong> ' + cmdStatus + ' ' + controlIcon + boundText;
        html += '<br><span style="color:#6a5a48;font-size:11px;">📍 ' + locationName + '</span>';
        html += '<br><span style="color:#b8a890;font-size:12px;">👥 <strong>' + cmdUnits + '</strong> юнитов</span>';
        html += '</div>';
        html += '<div style="display:flex;gap:4px;flex-wrap:wrap;">';
        
        if (squad && squad.location) {
            html += '<button class="btn btn-small" onclick="showSquadOnMap(\'' + cmdName + '\')">🗺️</button>';
        }
        
        if (isLord) {
            html += '<button class="btn btn-small" onclick="bindCommanderDialog(\'' + cmdName + '\')">🔗</button>';
            html += '<button class="btn btn-small" onclick="window.unbindCommander(\'' + cmdName + '\'); setTimeout(function(){ showArmySubTab(\'command\'); }, 300);">🔓</button>';
        } else if (isHighCommand && boundTo === myRank) {
            html += '<button class="btn btn-small" onclick="window.unbindCommander(\'' + cmdName + '\'); setTimeout(function(){ showArmySubTab(\'command\'); }, 300);">🔓 Отвязать</button>';
        }
        
        if (canManage) {
            html += '<button class="btn btn-small" onclick="assignUnitsDialog(\'' + cmdName + '\')">⚔️ Выделить</button>';
            html += '<button class="btn btn-small" onclick="unassignUnitsDialog(\'' + cmdName + '\')">🔓 Отвязать войска</button>';
            html += '<button class="btn btn-small" onclick="toggleCommanderControl(\'' + cmdName + '\')">' + (controlLocked ? '🔒' : '🔓') + ' Управление</button>';
        }
        
        html += '</div>';
        html += '</div>';
        
        if (squad && canManage) {
            var capNames = squad.captains ? Object.keys(squad.captains) : [];
            html += '<div style="margin-top:10px;padding-left:10px;border-left:2px solid #3d3026;">';
            html += '<p style="color:#6a5a48;font-size:11px;">🗡️ Капитаны (' + capNames.length + '/5):</p>';
            
            for (var ci = 0; ci < 5; ci++) {
                if (ci < capNames.length) {
                    var capName = capNames[ci];
                    var cap = squad.captains[capName];
                    var capUser = users[capName];
                    var capLeft = capUser && capUser.game._leftSquad && capUser.game._leftSquad.captainName === capName;
                    var capStatus = capLeft ? '🟡' : '🟢';
                    var capLocked = cap.detached === true;
                    var capControlIcon = capLocked ? '🔒' : '🔓';
                    var capUnits = cap.units.length;
                    totalUnits += capUnits;
                    for (var sgtName in cap.sergeants) { totalUnits += cap.sergeants[sgtName].units.length; }
                    
                    html += '<div style="background:#1a1410;border:1px solid #2a201a;border-radius:8px;padding:8px;margin:4px 0;">';
                    html += '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">';
                    html += '<div>';
                    html += '<span style="color:#c9b694;">🗡️ ' + capName + '</span> ' + capStatus + ' ' + capControlIcon;
                    html += '<br><span style="font-size:10px;color:#6a5a48;">👥 ' + capUnits + ' / 200 юнитов</span>';
                    html += '</div>';
                    html += '<div style="display:flex;gap:2px;flex-wrap:wrap;">';
                    
                    html += '<button class="btn btn-small" style="font-size:9px;" onclick="assignUnitsToCaptainModal(\'' + cmdName + '\',\'' + capName + '\')">⚔️ Выдать</button>';
                    html += '<button class="btn btn-small" style="font-size:9px;" onclick="recallFromCaptainModal(\'' + cmdName + '\',\'' + capName + '\')">📥 Отозвать</button>';
                    html += '<button class="btn btn-small" style="font-size:9px;" onclick="removeCaptain(\'' + cmdName + '\',\'' + capName + '\')">❌ Убрать</button>';
                    html += '<button class="btn btn-small" style="font-size:9px;" onclick="toggleCaptainControl(\'' + cmdName + '\',\'' + capName + '\')">' + (capLocked ? '🔒' : '🔓') + ' Упр.</button>';
                    
                    html += '</div>';
                    html += '</div>';
                    
                    if (cap.sergeants) {
                        var sgtNames = Object.keys(cap.sergeants);
                        html += '<div style="margin-top:4px;padding-left:10px;border-left:1px solid #2a201a;">';
                        html += '<p style="color:#6a5a48;font-size:10px;">🛡️ Сержанты (' + sgtNames.length + '/4):</p>';
                        
                        for (var si = 0; si < 4; si++) {
                            if (si < sgtNames.length) {
                                var sgtName = sgtNames[si];
                                var sgt = cap.sergeants[sgtName];
                                var sgtUser = users[sgtName];
                                var sgtLeft = sgtUser && sgtUser.game._leftSquad && sgtUser.game._leftSquad.sergeantName === sgtName;
                                var sgtStatus = sgtLeft ? '🟡' : '🟢';
                                var sgtLocked = sgt.detached === true;
                                var sgtControlIcon = sgtLocked ? '🔒' : '🔓';
                                
                                html += '<div style="padding:2px 0;font-size:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">';
                                html += '<span><span style="color:#b8a890;">🛡️ ' + sgtName + '</span> ' + sgtStatus + ' ' + sgtControlIcon + ' <span style="color:#6a5a48;">👥 ' + sgt.units.length + ' / 50</span></span>';
                                html += '<span>';
                                html += '<button class="btn btn-small" style="font-size:8px;padding:1px 4px;" onclick="assignUnitsToSergeantModal(\'' + cmdName + '\',\'' + capName + '\',\'' + sgtName + '\')">⚔️</button>';
                                html += '<button class="btn btn-small" style="font-size:8px;padding:1px 4px;" onclick="recallFromSergeantModal(\'' + cmdName + '\',\'' + capName + '\',\'' + sgtName + '\')">📥</button>';
                                html += '<button class="btn btn-small" style="font-size:8px;padding:1px 4px;" onclick="removeSergeant(\'' + cmdName + '\',\'' + capName + '\',\'' + sgtName + '\')">❌</button>';
                                html += '<button class="btn btn-small" style="font-size:8px;padding:1px 4px;" onclick="toggleSergeantControl(\'' + cmdName + '\',\'' + capName + '\',\'' + sgtName + '\')">' + (sgtLocked ? '🔒' : '🔓') + '</button>';
                                html += '</span>';
                                html += '</div>';
                            } else {
                                html += '<div style="padding:2px 0;font-size:10px;color:#3d3026;">🛡️ Пустой слот</div>';
                            }
                        }
                        
                        if (sgtNames.length < 4) {
                            var freeSgts = getFreeSergeants(houseId, squads, sgtNames);
                            if (freeSgts.length > 0) {
                                html += '<button class="btn btn-small" style="font-size:9px;margin-top:4px;" onclick="assignSergeantToCaptainModal(\'' + cmdName + '\',\'' + capName + '\')">➕ Назначить сержанта</button>';
                            }
                        }
                        html += '</div>';
                    }
                    html += '</div>';
                } else {
                    html += '<div style="background:#1a1410;border:1px solid #1a1410;border-radius:8px;padding:8px;margin:4px 0;color:#3d3026;font-size:11px;">🗡️ Пустой слот</div>';
                }
            }
            
            if (capNames.length < 5) {
                var freeCaps = getFreeCaptains(houseId, squads, capNames);
                if (freeCaps.length > 0) {
                    html += '<button class="btn btn-small" style="margin-top:6px;" onclick="assignCaptainModal(\'' + cmdName + '\')">➕ Назначить капитана</button>';
                }
            }
            html += '</div>';
        }
        
        html += '<div style="margin-top:8px;padding-top:6px;border-top:1px solid #2a201a;text-align:right;">';
        html += '<span style="color:#6a5a48;font-size:11px;">Всего: <strong>' + totalUnits + '</strong> юнитов</span>';
        html += '</div>';
        html += '</div>';
    });
    
    return html;
}

// ============================================================
// МОДАЛКИ НАЗНАЧЕНИЯ
// ============================================================

function assignCaptainModal(cmdName) {
    var houseId = users[currentUser].game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    var capNames = squad ? Object.keys(squad.captains || {}) : [];
    var freeCaptains = getFreeCaptains(houseId, squads, capNames);
    
    if (freeCaptains.length === 0) { setMessage('❌ Нет свободных капитанов.'); return; }
    
    var modal = document.getElementById('modal-assign-captain');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-assign-captain';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeAssignCaptainModal(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🗡️ НАЗНАЧИТЬ КАПИТАНА</h3><button class="close-btn" onclick="closeAssignCaptainModal()">✕</button></div><div id="modal-assign-captain-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-assign-captain-content');
    var html = '<div class="modal-section"><h4>👑 Командор: ' + cmdName + '</h4>';
    html += '<p style="color:#6a5a48;">Выберите капитана:</p>';
    
    freeCaptains.forEach(function(name) {
        html += '<button class="btn btn-game" onclick="confirmCaptainAssign(\'' + cmdName + '\',\'' + name + '\')" style="margin:4px 0;display:block;width:100%;">🗡️ ' + name + '</button>';
    });
    
    html += '<button class="btn btn-secondary" onclick="closeAssignCaptainModal()" style="margin-top:10px;">Закрыть</button>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function confirmCaptainAssign(cmdName, capName) {
    closeAssignCaptainModal();
    
    var user = users[currentUser];
    var myRank = user.game.houseRank;
    var isHighCommand = myRank && ['lord','heir','war_master'].indexOf(myRank) !== -1;
    
    if (isHighCommand) {
        window.lordAssignToCaptain(cmdName, capName, {});
    } else {
        window.commanderAssignToCaptain(capName, {});
    }
    setMessage('✅ ' + capName + ' назначен капитаном.');
    setTimeout(function() { showArmySubTab('command'); }, 300);
}

function closeAssignCaptainModal() {
    var m = document.getElementById('modal-assign-captain');
    if (m) m.classList.add('hide');
}

function assignSergeantToCaptainModal(cmdName, capName) {
    var houseId = users[currentUser].game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad || !squad.captains[capName]) { setMessage('❌ Капитан не найден.'); return; }
    var cap = squad.captains[capName];
    var sgtNames = cap.sergeants ? Object.keys(cap.sergeants) : [];
    var freeSergeants = getFreeSergeants(houseId, squads, sgtNames);
    
    if (freeSergeants.length === 0) { setMessage('❌ Нет свободных сержантов.'); return; }
    
    var modal = document.getElementById('modal-assign-sergeant');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-assign-sergeant';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeAssignSergeantModal(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🛡️ НАЗНАЧИТЬ СЕРЖАНТА</h3><button class="close-btn" onclick="closeAssignSergeantModal()">✕</button></div><div id="modal-assign-sergeant-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-assign-sergeant-content');
    var html = '<div class="modal-section"><h4>🗡️ Капитан: ' + capName + '</h4>';
    html += '<p style="color:#6a5a48;">Выберите сержанта:</p>';
    
    freeSergeants.forEach(function(name) {
        html += '<button class="btn btn-game" onclick="confirmSergeantAssign(\'' + cmdName + '\',\'' + capName + '\',\'' + name + '\')" style="margin:4px 0;display:block;width:100%;">🛡️ ' + name + '</button>';
    });
    
    html += '<button class="btn btn-secondary" onclick="closeAssignSergeantModal()" style="margin-top:10px;">Закрыть</button>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function confirmSergeantAssign(cmdName, capName, sgtName) {
    closeAssignSergeantModal();
    
    var user = users[currentUser];
    var myRank = user.game.houseRank;
    var isHighCommand = myRank && ['lord','heir','war_master'].indexOf(myRank) !== -1;
    
    if (isHighCommand) {
        window.lordAssignToSergeant(cmdName, capName, sgtName, {});
    } else {
        window.captainAssignToSergeant(sgtName, {});
    }
    setMessage('✅ ' + sgtName + ' назначен сержантом.');
    setTimeout(function() { showArmySubTab('command'); }, 300);
}

function closeAssignSergeantModal() {
    var m = document.getElementById('modal-assign-sergeant');
    if (m) m.classList.add('hide');
}

// ============================================================
// МОДАЛКИ ВЫДАЧИ ВОЙСК
// ============================================================

function assignUnitsToCaptainModal(cmdName, capName) {
    var houseId = users[currentUser].game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad || !squad.captains[capName]) { setMessage('❌ Капитан не найден.'); return; }
    var cap = squad.captains[capName];
    
    var currentCapUnits = cap.units.length;
    var maxCapCanGet = 200 - currentCapUnits;
    if (maxCapCanGet <= 0) { setMessage('❌ У капитана уже максимум (200) юнитов.'); return; }
    if (squad.units.length === 0) { setMessage('❌ У командора нет свободных юнитов.'); return; }
    
    var grouped = {};
    squad.units.forEach(function(u) { if (!grouped[u.type]) grouped[u.type] = 0; grouped[u.type]++; });
    
    var modal = document.getElementById('modal-assign-units');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-assign-units';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeAssignUnitsModal(); };
        overlay.innerHTML = '<div class="modal-box" style="max-height:90vh;overflow-y:auto;"><div class="modal-header"><h3>⚔️ ВЫДАТЬ ВОЙСКА КАПИТАНУ</h3><button class="close-btn" onclick="closeAssignUnitsModal()">✕</button></div><div id="modal-assign-units-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-assign-units-content');
    var html = '<div class="modal-section"><h4>🗡️ Капитан: ' + capName + ' (' + currentCapUnits + '/200)</h4>';
    html += '<p style="color:#6a5a48;">У командора: ' + squad.units.length + ' юнитов. Можно добавить: <strong>' + maxCapCanGet + '</strong></p>';
    
    for (var t in grouped) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
        var safeId = 'assign_to_cap_' + t.replace(/[^a-zA-Z0-9]/g, '_');
        html += '<div class="row"><span class="label">' + (ut ? ut.emoji + ' ' + ut.name : t) + ' — ' + grouped[t] + '</span>';
        html += '<span class="value"><input type="number" id="' + safeId + '" value="0" min="0" max="' + Math.min(grouped[t], maxCapCanGet) + '" style="width:60px;" data-type="' + t + '"></span></div>';
    }
    
    html += '<p style="color:#c96a5a;font-size:10px;margin-top:8px;" id="assign-cap-error"></p>';
    html += '<button class="btn" onclick="confirmAssignToCaptain(\'' + cmdName + '\',\'' + capName + '\',' + maxCapCanGet + ')" style="margin-top:10px;">✅ Выдать</button>';
    html += '<button class="btn btn-secondary" onclick="closeAssignUnitsModal()">Закрыть</button>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
    
    var allInputs = document.querySelectorAll('#modal-assign-units-content input[type="number"]');
    allInputs.forEach(function(inp) {
        inp.addEventListener('input', function() {
            var total = 0;
            var allInps = document.querySelectorAll('#modal-assign-units-content input[type="number"]');
            allInps.forEach(function(i) { total += parseInt(i.value) || 0; });
            var errEl = document.getElementById('assign-cap-error');
            if (total > maxCapCanGet) {
                errEl.textContent = '⚠️ Превышение! Максимум: ' + maxCapCanGet + '. Сейчас: ' + total;
            } else {
                errEl.textContent = '';
            }
        });
    });
}

function confirmAssignToCaptain(cmdName, capName, maxCapCanGet) {
    var unitTypes = {};
    var totalRequested = 0;
    
    var inputs = document.querySelectorAll('#modal-assign-units-content input[type="number"]');
    inputs.forEach(function(inp) {
        var count = parseInt(inp.value) || 0;
        if (count > 0) {
            var t = inp.getAttribute('data-type');
            unitTypes[t] = (unitTypes[t] || 0) + count;
            totalRequested += count;
        }
    });
    
    closeAssignUnitsModal();
    
    var user = users[currentUser];
    var myRank = user.game.houseRank;
    var isHighCommand = myRank && ['lord','heir','war_master'].indexOf(myRank) !== -1;
    
    if (totalRequested === 0) {
        setMessage('✅ Юниты не выданы.');
        setTimeout(function() { showArmySubTab('command'); }, 300);
        return;
    }
    if (totalRequested > maxCapCanGet) {
        setMessage('❌ Превышение лимита! Максимум: ' + maxCapCanGet);
        return;
    }
    
    if (isHighCommand) {
        window.lordAssignToCaptain(cmdName, capName, unitTypes);
    } else {
        window.commanderAssignToCaptain(capName, unitTypes);
    }
    setTimeout(function() { showArmySubTab('command'); }, 300);
}

function assignUnitsToSergeantModal(cmdName, capName, sgtName) {
    var houseId = users[currentUser].game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad || !squad.captains[capName]) { setMessage('❌ Капитан не найден.'); return; }
    var cap = squad.captains[capName];
    if (!cap.sergeants || !cap.sergeants[sgtName]) { setMessage('❌ Сержант не найден.'); return; }
    var sgt = cap.sergeants[sgtName];
    
    var currentSgtUnits = sgt.units.length;
    var maxSgtCanGet = 50 - currentSgtUnits;
    if (maxSgtCanGet <= 0) { setMessage('❌ У сержанта уже максимум (50) юнитов.'); return; }
    
    var grouped = {};
    cap.units.forEach(function(u) { if (!grouped[u.type]) grouped[u.type] = 0; grouped[u.type]++; });
    var capFreeUnits = cap.units.length;
    
    var modal = document.getElementById('modal-assign-units');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-assign-units';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeAssignUnitsModal(); };
        overlay.innerHTML = '<div class="modal-box" style="max-height:90vh;overflow-y:auto;"><div class="modal-header"><h3>⚔️ ВЫДАТЬ ВОЙСКА СЕРЖАНТУ</h3><button class="close-btn" onclick="closeAssignUnitsModal()">✕</button></div><div id="modal-assign-units-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-assign-units-content');
    var html = '<div class="modal-section"><h4>🛡️ Сержант: ' + sgtName + ' (' + currentSgtUnits + '/50)</h4>';
    
    if (capFreeUnits === 0) {
        html += '<p style="color:#6a5a48;">У капитана нет свободных юнитов.</p>';
    } else {
        html += '<p style="color:#6a5a48;">У капитана: ' + capFreeUnits + ' юнитов. Можно добавить: <strong>' + maxSgtCanGet + '</strong></p>';
        
        for (var t in grouped) {
            var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
            var safeId = 'assign_to_sgt_' + t.replace(/[^a-zA-Z0-9]/g, '_');
            html += '<div class="row"><span class="label">' + (ut ? ut.emoji + ' ' + ut.name : t) + ' — ' + grouped[t] + '</span>';
            html += '<span class="value"><input type="number" id="' + safeId + '" value="0" min="0" max="' + Math.min(grouped[t], maxSgtCanGet) + '" style="width:60px;" data-type="' + t + '"></span></div>';
        }
        
        html += '<p style="color:#c96a5a;font-size:10px;margin-top:8px;" id="assign-sgt-error"></p>';
        html += '<button class="btn" onclick="confirmAssignToSergeant(\'' + cmdName + '\',\'' + capName + '\',\'' + sgtName + '\',' + maxSgtCanGet + ')" style="margin-top:10px;">✅ Выдать</button>';
    }
    
    html += '<button class="btn btn-secondary" onclick="closeAssignUnitsModal()">Закрыть</button>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
    
    var allInputs = document.querySelectorAll('#modal-assign-units-content input[type="number"]');
    allInputs.forEach(function(inp) {
        inp.addEventListener('input', function() {
            var total = 0;
            var allInps = document.querySelectorAll('#modal-assign-units-content input[type="number"]');
            allInps.forEach(function(i) { total += parseInt(i.value) || 0; });
            var errEl = document.getElementById('assign-sgt-error');
            if (total > maxSgtCanGet) {
                errEl.textContent = '⚠️ Превышение! Максимум: ' + maxSgtCanGet + '. Сейчас: ' + total;
            } else {
                errEl.textContent = '';
            }
        });
    });
}

function confirmAssignToSergeant(cmdName, capName, sgtName, maxSgtCanGet) {
    var unitTypes = {};
    var totalRequested = 0;
    
    var inputs = document.querySelectorAll('#modal-assign-units-content input[type="number"]');
    inputs.forEach(function(inp) {
        var count = parseInt(inp.value) || 0;
        if (count > 0) {
            var t = inp.getAttribute('data-type');
            unitTypes[t] = (unitTypes[t] || 0) + count;
            totalRequested += count;
        }
    });
    
    closeAssignUnitsModal();
    
    var user = users[currentUser];
    var myRank = user.game.houseRank;
    var isHighCommand = myRank && ['lord','heir','war_master'].indexOf(myRank) !== -1;
    
    if (totalRequested === 0) {
        setMessage('✅ Юниты не выданы.');
        setTimeout(function() { showArmySubTab('command'); }, 300);
        return;
    }
    if (totalRequested > maxSgtCanGet) {
        setMessage('❌ Превышение лимита! Максимум: ' + maxSgtCanGet);
        return;
    }
    
    if (isHighCommand) {
        window.lordAssignToSergeant(cmdName, capName, sgtName, unitTypes);
    } else {
        window.captainAssignToSergeant(sgtName, unitTypes);
    }
    setTimeout(function() { showArmySubTab('command'); }, 300);
}

function closeAssignUnitsModal() {
    var m = document.getElementById('modal-assign-units');
    if (m) m.classList.add('hide');
}

// ============================================================
// МОДАЛКИ ОТЗЫВА (БЕЗ PROMPT)
// ============================================================

function recallFromCaptainModal(cmdName, capName) {
    var houseId = users[currentUser].game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad || !squad.captains[capName]) { setMessage('❌ Капитан не найден.'); return; }
    var cap = squad.captains[capName];
    if (cap.units.length === 0) { setMessage('❌ У капитана нет юнитов.'); return; }
    
    var grouped = {};
    cap.units.forEach(function(u) { if (!grouped[u.type]) grouped[u.type] = 0; grouped[u.type]++; });
    
    var modal = document.getElementById('modal-assign-units');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-assign-units';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeAssignUnitsModal(); };
        overlay.innerHTML = '<div class="modal-box" style="max-height:90vh;overflow-y:auto;"><div class="modal-header"><h3>📥 ОТОЗВАТЬ ВОЙСКА У КАПИТАНА</h3><button class="close-btn" onclick="closeAssignUnitsModal()">✕</button></div><div id="modal-assign-units-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-assign-units-content');
    var html = '<div class="modal-section"><h4>🗡️ Капитан: ' + capName + ' (' + cap.units.length + ' юнитов)</h4>';
    
    html += '<label style="display:block;padding:6px 0;color:#b8a890;cursor:pointer;">';
    html += '<input type="checkbox" id="recall_cap_all" onchange="toggleRecallCapAll()" checked> <strong>ОТОЗВАТЬ ВСЕХ</strong>';
    html += '</label>';
    html += '<hr style="border-color:#2a201a;">';
    
    for (var t in grouped) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
        html += '<div class="row"><span class="label">' + (ut ? ut.emoji + ' ' + ut.name : t) + ' — ' + grouped[t] + '</span>';
        html += '<span class="value"><input type="number" class="recall-cap-count" data-type="' + t + '" value="' + grouped[t] + '" min="0" max="' + grouped[t] + '" style="width:60px;"></span></div>';
    }
    
    html += '<button class="btn" onclick="confirmRecallFromCaptain(\'' + cmdName + '\',\'' + capName + '\')" style="margin-top:10px;">✅ Отозвать</button>';
    html += '<button class="btn btn-secondary" onclick="closeAssignUnitsModal()">Закрыть</button>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function toggleRecallCapAll() {
    var allChecked = document.getElementById('recall_cap_all').checked;
    var inputs = document.querySelectorAll('.recall-cap-count');
    inputs.forEach(function(inp) { inp.value = allChecked ? inp.max : 0; });
}

function confirmRecallFromCaptain(cmdName, capName) {
    var allChecked = document.getElementById('recall_cap_all');
    var unitTypes = {};
    
    if (!allChecked || !allChecked.checked) {
        var inputs = document.querySelectorAll('.recall-cap-count');
        inputs.forEach(function(inp) {
            var count = parseInt(inp.value) || 0;
            if (count > 0) {
                var t = inp.getAttribute('data-type');
                unitTypes[t] = (unitTypes[t] || 0) + count;
            }
        });
        if (Object.keys(unitTypes).length === 0) {
            setMessage('❌ Выберите хотя бы 1 тип.');
            return;
        }
    }
    
    closeAssignUnitsModal();
    window.recallUnitsFromCaptain(cmdName, capName, unitTypes);
    setTimeout(function() { showArmySubTab('command'); }, 300);
}

function recallFromSergeantModal(cmdName, capName, sgtName) {
    var houseId = users[currentUser].game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad || !squad.captains[capName]) { setMessage('❌ Капитан не найден.'); return; }
    var cap = squad.captains[capName];
    if (!cap.sergeants || !cap.sergeants[sgtName]) { setMessage('❌ Сержант не найден.'); return; }
    var sgt = cap.sergeants[sgtName];
    if (sgt.units.length === 0) { setMessage('❌ У сержанта нет юнитов.'); return; }
    
    var grouped = {};
    sgt.units.forEach(function(u) { if (!grouped[u.type]) grouped[u.type] = 0; grouped[u.type]++; });
    
    var modal = document.getElementById('modal-assign-units');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-assign-units';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeAssignUnitsModal(); };
        overlay.innerHTML = '<div class="modal-box" style="max-height:90vh;overflow-y:auto;"><div class="modal-header"><h3>📥 ОТОЗВАТЬ ВОЙСКА У СЕРЖАНТА</h3><button class="close-btn" onclick="closeAssignUnitsModal()">✕</button></div><div id="modal-assign-units-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-assign-units-content');
    var html = '<div class="modal-section"><h4>🛡️ Сержант: ' + sgtName + ' (' + sgt.units.length + ' юнитов)</h4>';
    
    html += '<label style="display:block;padding:6px 0;color:#b8a890;cursor:pointer;">';
    html += '<input type="checkbox" id="recall_sgt_all" onchange="toggleRecallSgtAll()" checked> <strong>ОТОЗВАТЬ ВСЕХ</strong>';
    html += '</label>';
    html += '<hr style="border-color:#2a201a;">';
    
    for (var t in grouped) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
        html += '<div class="row"><span class="label">' + (ut ? ut.emoji + ' ' + ut.name : t) + ' — ' + grouped[t] + '</span>';
        html += '<span class="value"><input type="number" class="recall-sgt-count" data-type="' + t + '" value="' + grouped[t] + '" min="0" max="' + grouped[t] + '" style="width:60px;"></span></div>';
    }
    
    html += '<button class="btn" onclick="confirmRecallFromSergeant(\'' + cmdName + '\',\'' + capName + '\',\'' + sgtName + '\')" style="margin-top:10px;">✅ Отозвать</button>';
    html += '<button class="btn btn-secondary" onclick="closeAssignUnitsModal()">Закрыть</button>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function toggleRecallSgtAll() {
    var allChecked = document.getElementById('recall_sgt_all').checked;
    var inputs = document.querySelectorAll('.recall-sgt-count');
    inputs.forEach(function(inp) { inp.value = allChecked ? inp.max : 0; });
}

function confirmRecallFromSergeant(cmdName, capName, sgtName) {
    var allChecked = document.getElementById('recall_sgt_all');
    var unitTypes = {};
    
    if (!allChecked || !allChecked.checked) {
        var inputs = document.querySelectorAll('.recall-sgt-count');
        inputs.forEach(function(inp) {
            var count = parseInt(inp.value) || 0;
            if (count > 0) {
                var t = inp.getAttribute('data-type');
                unitTypes[t] = (unitTypes[t] || 0) + count;
            }
        });
        if (Object.keys(unitTypes).length === 0) {
            setMessage('❌ Выберите хотя бы 1 тип.');
            return;
        }
    }
    
    closeAssignUnitsModal();
    window.captainRecallFromSergeant(cmdName, capName, sgtName, unitTypes);
    setTimeout(function() { showArmySubTab('command'); }, 300);
}

// ============================================================
// УБРАТЬ КАПИТАНА / СЕРЖАНТА
// ============================================================

function removeCaptain(cmdName, capName) {
    var squads = window.getSquads(users[currentUser].game.house);
    var squad = squads[cmdName];
    if (!squad || !squad.captains[capName]) { setMessage('❌ Капитан не найден.'); return; }
    
    if (!confirm('Убрать капитана ' + capName + '? Все его войска вернутся командору.')) return;
    
    window.recallUnitsFromCaptain(cmdName, capName, {});
    delete squad.captains[capName];
    saveData();
    setMessage('✅ Капитан ' + capName + ' убран из отряда.');
    setTimeout(function() { showArmySubTab('command'); }, 300);
}

function removeSergeant(cmdName, capName, sgtName) {
    var squads = window.getSquads(users[currentUser].game.house);
    var squad = squads[cmdName];
    if (!squad || !squad.captains[capName]) { setMessage('❌ Капитан не найден.'); return; }
    var cap = squad.captains[capName];
    if (!cap.sergeants || !cap.sergeants[sgtName]) { setMessage('❌ Сержант не найден.'); return; }
    
    if (!confirm('Убрать сержанта ' + sgtName + '? Все его войска вернутся капитану.')) return;
    
    window.captainRecallFromSergeant(cmdName, capName, sgtName, {});
    delete cap.sergeants[sgtName];
    saveData();
    setMessage('✅ Сержант ' + sgtName + ' убран из отряда.');
    setTimeout(function() { showArmySubTab('command'); }, 300);
}

// ============================================================
// УПРАВЛЕНИЕ (ЗАМОК)
// ============================================================

function toggleCommanderControl(cmdName) {
    var squads = window.getSquads(users[currentUser].game.house);
    var squad = squads[cmdName];
    if (!squad) { setMessage('❌ Командор не найден.'); return; }
    squad.detached = !squad.detached;
    saveData();
    setMessage(squad.detached ? '🔒 Управление закрыто.' : '🔓 Управление открыто.');
    setTimeout(function() { showArmySubTab('command'); }, 300);
}

function toggleCaptainControl(cmdName, capName) {
    var squads = window.getSquads(users[currentUser].game.house);
    var squad = squads[cmdName];
    if (!squad || !squad.captains[capName]) { setMessage('❌ Капитан не найден.'); return; }
    squad.captains[capName].detached = !squad.captains[capName].detached;
    saveData();
    setMessage(squad.captains[capName].detached ? '🔒 Управление закрыто.' : '🔓 Управление открыто.');
    setTimeout(function() { showArmySubTab('command'); }, 300);
}

function toggleSergeantControl(cmdName, capName, sgtName) {
    var squads = window.getSquads(users[currentUser].game.house);
    var squad = squads[cmdName];
    if (!squad || !squad.captains[capName]) { setMessage('❌ Капитан не найден.'); return; }
    var cap = squad.captains[capName];
    if (!cap.sergeants || !cap.sergeants[sgtName]) { setMessage('❌ Сержант не найден.'); return; }
    cap.sergeants[sgtName].detached = !cap.sergeants[sgtName].detached;
    saveData();
    setMessage(cap.sergeants[sgtName].detached ? '🔒 Управление закрыто.' : '🔓 Управление открыто.');
    setTimeout(function() { showArmySubTab('command'); }, 300);
}

// ============================================================
// МОДАЛКИ ВЫДЕЛЕНИЯ/ОТВЯЗКИ
// ============================================================

function assignUnitsDialog(cmdName) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [] };
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    var squadLoc = squad ? squad.location : 'castle';
    
    var freeUnitsHere = {};
    var totalHere = 0;
    
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (garrison[cat]) {
            garrison[cat].forEach(function(u) {
                if (!u.commander && !u.squadId && !u.isScout && u.location === squadLoc) {
                    var t = u.type;
                    if (!freeUnitsHere[t]) freeUnitsHere[t] = 0;
                    freeUnitsHere[t]++;
                    totalHere++;
                }
            });
        }
    });
    
    if (totalHere === 0) {
        setMessage('❌ Нет свободных войск на клетке командора.');
        return;
    }
    
    var alreadyAssigned = 0;
    if (squad) {
        alreadyAssigned += squad.units.length;
        for (var capName in squad.captains) {
            alreadyAssigned += squad.captains[capName].units.length;
            for (var sgtName in squad.captains[capName].sergeants) {
                alreadyAssigned += squad.captains[capName].sergeants[sgtName].units.length;
            }
        }
    }
    var maxCanAssign = 1000 - alreadyAssigned;
    if (maxCanAssign <= 0) {
        setMessage('❌ У командора уже максимум (1000) юнитов.');
        return;
    }
    
    var modal = document.getElementById('modal-assign');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-assign';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeAssignModal(); };
        overlay.innerHTML = '<div class="modal-box" style="max-height:90vh;overflow-y:auto;"><div class="modal-header"><h3>⚔️ ВЫДЕЛИТЬ ВОЙСКА</h3><button class="close-btn" onclick="closeAssignModal()">✕</button></div><div id="modal-assign-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-assign-content');
    var locName = squadLoc === 'castle' ? '🏰 Замок' : getZoneName(squadLoc);
    var html = '<div class="modal-section"><h4>⭐ Командор: ' + cmdName + ' 📍 ' + locName + '</h4>';
    html += '<p style="color:#6a5a48;">Свободных на клетке: ' + totalHere + ' | Можно добавить: <strong>' + maxCanAssign + '</strong> | Уже: ' + alreadyAssigned + '/1000</p>';
    
    for (var t in freeUnitsHere) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
        var safeId = 'assign_here_' + t.replace(/[^a-zA-Z0-9]/g, '_');
        html += '<div class="row"><span class="label">' + (ut ? ut.emoji + ' ' + ut.name : t) + ' — ' + freeUnitsHere[t] + '</span>';
        html += '<span class="value"><input type="number" id="' + safeId + '" value="0" min="0" max="' + Math.min(freeUnitsHere[t], maxCanAssign) + '" style="width:60px;" data-type="' + t + '" data-max="' + freeUnitsHere[t] + '"></span></div>';
    }
    
    html += '<p style="color:#c96a5a;font-size:10px;margin-top:8px;" id="assign-error"></p>';
    html += '<button class="btn" onclick="confirmAssignUnits(\'' + cmdName + '\',' + maxCanAssign + ')" style="margin-top:10px;">✅ Выделить</button>';
    html += '<button class="btn btn-secondary" onclick="closeAssignModal()">Закрыть</button>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
    
    var allInputs = document.querySelectorAll('#modal-assign-content input[type="number"]');
    allInputs.forEach(function(inp) {
        inp.addEventListener('input', function() {
            var total = 0;
            var allInps = document.querySelectorAll('#modal-assign-content input[type="number"]');
            allInps.forEach(function(i) { total += parseInt(i.value) || 0; });
            var errEl = document.getElementById('assign-error');
            if (total > maxCanAssign) {
                errEl.textContent = '⚠️ Превышение! Максимум: ' + maxCanAssign + '. Сейчас: ' + total;
            } else {
                errEl.textContent = '';
            }
        });
    });
}

function confirmAssignUnits(cmdName, maxCanAssign) {
    var unitTypes = {};
    var totalRequested = 0;
    
    var inputs = document.querySelectorAll('#modal-assign-content input[type="number"]');
    inputs.forEach(function(inp) {
        var count = parseInt(inp.value) || 0;
        if (count > 0) {
            var t = inp.getAttribute('data-type');
            unitTypes[t] = (unitTypes[t] || 0) + count;
            totalRequested += count;
        }
    });
    
    if (totalRequested === 0) { setMessage('❌ Выберите хотя бы 1 юнита.'); return; }
    if (totalRequested > maxCanAssign) { setMessage('❌ Превышение лимита! Максимум: ' + maxCanAssign); return; }
    
    window.assignUnitsToCommander(cmdName, unitTypes);
    closeAssignModal();
    setTimeout(function() { showArmySubTab('command'); }, 300);
}

function closeAssignModal() {
    var m = document.getElementById('modal-assign');
    if (m) m.classList.add('hide');
}

function unassignUnitsDialog(cmdName) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad) { setMessage('❌ Отряд не найден.'); return; }
    
    var allUnits = {};
    squad.units.forEach(function(u) { if (!allUnits[u.type]) allUnits[u.type] = 0; allUnits[u.type]++; });
    for (var capName in squad.captains) {
        squad.captains[capName].units.forEach(function(u) { if (!allUnits[u.type]) allUnits[u.type] = 0; allUnits[u.type]++; });
        for (var sgtName in squad.captains[capName].sergeants) {
            squad.captains[capName].sergeants[sgtName].units.forEach(function(u) { if (!allUnits[u.type]) allUnits[u.type] = 0; allUnits[u.type]++; });
        }
    }
    
    var totalBound = 0;
    for (var t in allUnits) totalBound += allUnits[t];
    
    if (totalBound === 0) { setMessage('❌ У командора нет привязанных юнитов.'); return; }
    
    var modal = document.getElementById('modal-unassign');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-unassign';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeUnassignModal(); };
        overlay.innerHTML = '<div class="modal-box" style="max-height:90vh;overflow-y:auto;"><div class="modal-header"><h3>🔓 ОТВЯЗАТЬ ВОЙСКА</h3><button class="close-btn" onclick="closeUnassignModal()">✕</button></div><div id="modal-unassign-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-unassign-content');
    var html = '<div class="modal-section"><h4>⭐ Командор: ' + cmdName + '</h4>';
    html += '<p style="color:#6a5a48;">Всего привязано: ' + totalBound + ' юнитов. Выберите кого отвязать.</p>';
    
    html += '<label style="display:block;padding:6px 0;color:#b8a890;cursor:pointer;">';
    html += '<input type="checkbox" id="unassign_all" onchange="toggleAllUnassign()" checked> <strong>ОТВЯЗАТЬ ВСЕХ</strong>';
    html += '</label>';
    html += '<hr style="border-color:#2a201a;">';
    
    for (var t in allUnits) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
        html += '<div class="row">';
        html += '<span class="label">' + (ut ? ut.emoji + ' ' + ut.name : t) + ' — ' + allUnits[t] + ' шт.</span>';
        html += '<span class="value"><input type="number" class="unassign-count" data-type="' + t + '" value="' + allUnits[t] + '" min="0" max="' + allUnits[t] + '" style="width:60px;"></span>';
        html += '</div>';
    }
    
    html += '<button class="btn" onclick="confirmUnassignUnits(\'' + cmdName + '\')" style="margin-top:10px;">✅ Отвязать</button>';
    html += '<button class="btn btn-secondary" onclick="closeUnassignModal()">Закрыть</button>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function toggleAllUnassign() {
    var allChecked = document.getElementById('unassign_all').checked;
    var inputs = document.querySelectorAll('.unassign-count');
    inputs.forEach(function(inp) { inp.value = allChecked ? inp.max : 0; });
}

function confirmUnassignUnits(cmdName) {
    var allChecked = document.getElementById('unassign_all').checked;
    
    if (allChecked) {
        window.unassignUnitsFromCommander(cmdName, {});
    } else {
        var unitTypes = {};
        var inputs = document.querySelectorAll('.unassign-count');
        inputs.forEach(function(inp) {
            var count = parseInt(inp.value) || 0;
            if (count > 0) {
                var t = inp.getAttribute('data-type');
                unitTypes[t] = count;
            }
        });
        if (Object.keys(unitTypes).length === 0) { setMessage('❌ Выберите хотя бы 1 тип.'); return; }
        window.unassignUnitsFromCommander(cmdName, unitTypes);
    }
    closeUnassignModal();
    setTimeout(function() { showArmySubTab('command'); }, 300);
}

function closeUnassignModal() {
    var m = document.getElementById('modal-unassign');
    if (m) m.classList.add('hide');
}

// ============================================================
// ПРИВЯЗКА КОМАНДОРА
// ============================================================

function bindCommanderDialog(cmdName) {
    var modal = document.getElementById('modal-bind');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-bind';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeBindModal(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🔗 ПРИВЯЗАТЬ КОМАНДОРА</h3><button class="close-btn" onclick="closeBindModal()">✕</button></div><div id="modal-bind-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-bind-content');
    var html = '<div class="modal-section"><h4>⭐ ' + cmdName + '</h4>';
    html += '<p style="color:#6a5a48;">Выберите к кому привязать:</p>';
    
    var options = [
        { rank: 'lord', name: '👑 Лорд (к себе)' },
        { rank: 'heir', name: '🏴 Наследник' },
        { rank: 'war_master', name: '⚔️ Мастер над войной' }
    ];
    
    options.forEach(function(opt) {
        html += '<button class="btn btn-game" onclick="window.bindCommander(\'' + cmdName + '\',\'' + opt.rank + '\'); closeBindModal(); setTimeout(function(){ showArmySubTab(\'command\'); }, 300);" style="margin:4px 0;display:block;width:100%;">' + opt.name + '</button>';
    });
    
    html += '<button class="btn btn-secondary" onclick="closeBindModal()" style="margin-top:10px;">Закрыть</button>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeBindModal() {
    var m = document.getElementById('modal-bind');
    if (m) m.classList.add('hide');
}

// ============================================================
// КАРТА
// ============================================================

function showSquadOnMap(cmdName) {
    var houseId = users[currentUser].game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad || !squad.location) { setMessage('❌ Локация не найдена.'); return; }
    
    var locId = squad.location === 'castle' ? 'bl_-1_0' : squad.location;
    var loc = WORLD_AREAS[locId];
    if (!loc) { setMessage('❌ Зона не найдена.'); return; }
    
    closeHouses();
    if (typeof openWorldMap === 'function') {
        openWorldMap();
        setTimeout(function() {
            setMessage('🗺️ Отряд ' + cmdName + ': ' + (squad.location === 'castle' ? '🏰 Замок' : getZoneName(squad.location)) + ' ' + getZoneCoords(locId));
        }, 500);
    }
}

// ============================================================
// ВКЛАДКА «МОЙ ОТРЯД»
// ============================================================

function rejoinSquadAuto() {
    var user = users[currentUser];
    if (!user || !user.game._leftSquad) { setMessage('❌ Вы не покидали отряд.'); return; }
    
    var data = user.game._leftSquad;
    var squads = window.getSquads(data.houseId);
    var squad = squads[data.commanderName];
    if (!squad) { setMessage('❌ Отряд расформирован.'); user.game._leftSquad = null; saveData(); return; }
    
    var g = user.game;
    var squadLocation = squad.location === 'castle' ? 'bl_-1_0' : squad.location;
    var playerLocation = g.location.parentZone || g.location.place;
    if (playerLocation === 'Таверна' || playerLocation === 'Дом') playerLocation = 'kl_0_0';
    
    if (playerLocation === squadLocation) {
        window.rejoinSquad();
        setMessage('✅ Вы вернулись в отряд!');
    } else {
        setMessage('🏃 Вы следуете за отрядом...');
        startChaseSquad(data);
    }
    setTimeout(function() { showArmySubTab('my_squad'); }, 300);
}

function startChaseSquad(data) {
    var g = users[currentUser].game;
    var playerLoc = g.location.parentZone || g.location.place;
    if (playerLoc === 'Таверна' || playerLoc === 'Дом') playerLoc = 'kl_0_0';
    
    var chaseInterval = setInterval(function() {
        var squads = window.getSquads(data.houseId);
        var squad = squads[data.commanderName];
        if (!squad) { clearInterval(chaseInterval); setMessage('❌ Отряд расформирован.'); return; }
        
        var squadLoc = squad.location === 'castle' ? 'bl_-1_0' : squad.location;
        var playerLoc2 = users[currentUser].game.location.parentZone || users[currentUser].game.location.place;
        if (playerLoc2 === 'Таверна' || playerLoc2 === 'Дом') playerLoc2 = 'kl_0_0';
        
        if (playerLoc2 === squadLoc) {
            clearInterval(chaseInterval);
            window.rejoinSquad();
            setMessage('✅ Вы догнали отряд!');
            updateMenu();
            return;
        }
        
        if (typeof findPath === 'function') {
            var path = findPath(playerLoc2, squadLoc);
            if (path.length > 1) {
                var nextLoc = path[1];
                var nextZone = WORLD_AREAS[nextLoc];
                if (nextZone) {
                    var isWater = (nextZone.type === 'river' || nextZone.type === 'sea' || nextZone.type === 'shallows');
                    if (!isWater) {
                        g.location.place = nextLoc;
                        g.location.locationId = nextLoc;
                        g.location.parentZone = null;
                        g.outside = true;
                        updateMenu();
                        updateStory();
                        updateActions();
                        saveData();
                    }
                }
            }
        }
    }, 10000);
    
    g._chaseInterval = chaseInterval;
}

function showMySquadTab(houseId) {
    if (!window.getSquads) return '<p style="color:#c96a5a;">❌ Система отрядов не загружена.</p>';
    
    var user = users[currentUser];
    var myRank = user.game.houseRank;
    var isHighCommand = myRank && ['lord','heir','war_master'].indexOf(myRank) !== -1;
    var mySquad = window.getMySquad();
    
    var html = '<h4>🎯 МОЙ ОТРЯД</h4>';
    
    if (isHighCommand) {
        html += '<p style="color:#6a5a48;font-size:11px;">Вы видите все отряды дома.</p>';
        var squads = window.getSquads(houseId);
        var squadList = [];
        for (var cmdName in squads) squadList.push({ name: cmdName, squad: squads[cmdName] });
        
        if (squadList.length === 0) {
            html += '<p style="color:#6a5a48;">Нет созданных отрядов.</p>';
        } else {
            squadList.forEach(function(item) {
                var s = item.squad;
                var locationName = s.location === 'castle' ? '🏰 Замок' : getZoneName(s.location) + ' ' + getZoneCoords(s.location);
                var isDetached = s.detached === true;
                var totalUnits = s.units.length;
                for (var capName in s.captains) {
                    totalUnits += s.captains[capName].units.length;
                    for (var sgtName in s.captains[capName].sergeants) {
                        totalUnits += s.captains[capName].sergeants[sgtName].units.length;
                    }
                }
                
                html += '<div style="background:#120e0b;border:1px solid #2a201a;border-radius:10px;padding:10px;margin:6px 0;">';
                html += '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">';
                html += '<div>';
                html += '<strong style="color:#ffd700;">⭐ ' + item.name + '</strong>';
                html += '<br><span style="color:#6a5a48;font-size:11px;">📍 ' + locationName + (isDetached ? ' 🔓' : ' 🔒') + '</span>';
                html += '<br><span style="color:#b8a890;">👥 ' + totalUnits + ' юнитов</span>';
                html += '</div>';
                html += '<button class="btn btn-small" onclick="showSquadOnMap(\'' + item.name + '\')">🗺️</button>';
                html += '</div>';
                
                if (s.units.length > 0) html += '<div style="font-size:10px;color:#6a5a48;padding-left:10px;">' + showUnitGroupInline(s.units) + '</div>';
                for (var capName in s.captains) {
                    var cap = s.captains[capName];
                    html += '<div style="font-size:10px;color:#c9b694;padding-left:10px;">🗡️ ' + capName + (cap.detached ? ' 🔓' : '') + ' — ' + cap.units.length + ' юн.</div>';
                    for (var sgtName in cap.sergeants) {
                        html += '<div style="font-size:10px;color:#b8a890;padding-left:20px;">🛡️ ' + sgtName + (cap.sergeants[sgtName].detached ? ' 🔓' : '') + ' — ' + cap.sergeants[sgtName].units.length + ' юн.</div>';
                    }
                }
                html += '</div>';
            });
        }
        return html;
    }
    
    if (!mySquad) {
        html += '<p style="color:#6a5a48;">Вы не состоите в отряде.</p>';
        if (user.game._leftSquad) {
            var data = user.game._leftSquad;
            var squads = window.getSquads(data.houseId);
            var squad = squads[data.commanderName];
            var locName = '—';
            if (squad) locName = squad.location === 'castle' ? '🏰 Замок' : getZoneName(squad.location) + ' ' + getZoneCoords(squad.location);
            
            html += '<div style="background:#2a201a;border:1px solid #ffd700;border-radius:10px;padding:10px;margin:10px 0;">';
            html += '<p style="color:#ffd700;">📌 Вы покинули отряд ' + data.commanderName + '</p>';
            html += '<p style="color:#6a5a48;">📍 ' + locName + '</p>';
            html += '<button class="btn btn-small" onclick="rejoinSquadAuto()">✅ Вернуться в отряд</button>';
            html += '</div>';
        }
    } else {
        var s = mySquad.squad;
        var locationName = s.location === 'castle' ? '🏰 Замок' : (WORLD_AREAS[s.location] ? WORLD_AREAS[s.location].name : s.location) + ' ' + getZoneCoords(s.location);
        var isDetached = s.detached === true;
        
        html += '<div style="background:#120e0b;border:1px solid #3d3026;border-radius:10px;padding:12px;margin:6px 0;">';
        html += '<p><strong style="color:#c9b694;">👑 Командор:</strong> ' + mySquad.commanderName + '</p>';
        html += '<p><strong style="color:#c9b694;">🎯 Роль:</strong> ' + (mySquad.role === 'commander' ? 'Командор' : mySquad.role === 'captain' ? 'Капитан' : 'Сержант') + '</p>';
        html += '<p><strong style="color:#c9b694;">📍 Локация:</strong> ' + locationName + (isDetached ? ' 🔓' : ' 🔒') + '</p>';
        html += '<button class="btn btn-small" onclick="showSquadOnMap(\'' + mySquad.commanderName + '\')">🗺️ На карте</button>';
        html += '</div>';
        
        if (mySquad.role === 'commander') {
            html += '<p style="color:#6a5a48;">⭐ Ваши юниты: <strong>' + s.units.length + '</strong></p>';
            if (s.units.length > 0) html += showUnitGroup(s.units);
            for (var capName in s.captains) {
                var cap = s.captains[capName];
                html += '<p style="margin-top:8px;color:#c9b694;">🗡️ ' + capName + (cap.detached ? ' 🔓' : '') + ' — ' + cap.units.length + ' юнитов</p>';
                if (cap.units.length > 0) html += showUnitGroup(cap.units);
                for (var sgtName in cap.sergeants) {
                    var sgt = cap.sergeants[sgtName];
                    html += '<p style="padding-left:10px;color:#b8a890;">🛡️ ' + sgtName + (sgt.detached ? ' 🔓' : '') + ' — ' + sgt.units.length + ' юнитов</p>';
                }
            }
        }
        
        if (mySquad.role === 'captain') {
            var cap = s.captains[mySquad.captainName];
            if (cap) {
                html += '<p style="color:#6a5a48;">🗡️ Ваши юниты: <strong>' + cap.units.length + '</strong></p>';
                if (cap.units.length > 0) html += showUnitGroup(cap.units);
                for (var sgtName in cap.sergeants) {
                    var sgt = cap.sergeants[sgtName];
                    html += '<p style="padding-left:10px;color:#b8a890;">🛡️ ' + sgtName + (sgt.detached ? ' 🔓' : '') + ' — ' + sgt.units.length + ' юнитов</p>';
                }
            }
        }
        
        if (mySquad.role === 'sergeant') {
            var cap = s.captains[mySquad.captainName];
            if (cap && cap.sergeants[mySquad.sergeantName]) {
                var sgt = cap.sergeants[mySquad.sergeantName];
                html += '<p style="color:#6a5a48;">🛡️ Ваши юниты: <strong>' + sgt.units.length + '</strong></p>';
                if (sgt.units.length > 0) html += showUnitGroup(sgt.units);
            }
        }
    }
    
    return html;
}

// ============================================================
// ВКЛАДКА «ГАРНИЗОН»
// ============================================================

function showGarrisonTab(houseId) {
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [], marching: [] };
    var house = HOUSES[houseId];
    var castleName = house ? house.castle : 'Замок';
    
    var html = '<h4>📍 ГАРНИЗОН</h4>';
    html += '<p style="color:#6a5a48;font-size:11px;">Все войска дома по локациям.</p>';
    
    var byLocation = {};
    var totalAll = 0;
    
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (garrison[cat]) {
            garrison[cat].forEach(function(u) {
                totalAll++;
                var loc = u.location || 'castle';
                var locName = loc === 'castle' ? '🏰 ' + castleName : getZoneName(loc) + ' ' + getZoneCoords(loc);
                if (!byLocation[locName]) byLocation[locName] = { infantry: 0, cavalry: 0, siege: 0, scouts: 0, squads: {} };
                
                if (u.isScout) byLocation[locName].scouts++;
                else if (u.siege) byLocation[locName].siege++;
                else if (u.horse || u.type === 'rider' || u.type === 'heavy_rider' || u.type === 'knight') byLocation[locName].cavalry++;
                else byLocation[locName].infantry++;
                
                if (u.squadId) {
                    if (!byLocation[locName].squads[u.squadId]) byLocation[locName].squads[u.squadId] = 0;
                    byLocation[locName].squads[u.squadId]++;
                }
            });
        }
    });
    
    var squads = window.getSquads(houseId);
    for (var cmdName in squads) {
        var squad = squads[cmdName];
        var loc = squad.location || 'castle';
        var locName = loc === 'castle' ? '🏰 ' + castleName : getZoneName(loc) + ' ' + getZoneCoords(loc);
        if (!byLocation[locName]) byLocation[locName] = { infantry: 0, cavalry: 0, siege: 0, scouts: 0, squads: {} };
        if (!byLocation[locName].squads[cmdName]) byLocation[locName].squads[cmdName] = 0;
        
        squad.units.forEach(function(u) {
            totalAll++;
            byLocation[locName].squads[cmdName]++;
            if (u.horse || u.type === 'rider' || u.type === 'heavy_rider' || u.type === 'knight') byLocation[locName].cavalry++;
            else byLocation[locName].infantry++;
        });
        for (var capName in squad.captains) {
            squad.captains[capName].units.forEach(function(u) {
                totalAll++;
                byLocation[locName].squads[cmdName]++;
                if (u.horse || u.type === 'rider' || u.type === 'heavy_rider' || u.type === 'knight') byLocation[locName].cavalry++;
                else byLocation[locName].infantry++;
            });
            for (var sgtName in squad.captains[capName].sergeants) {
                squad.captains[capName].sergeants[sgtName].units.forEach(function(u) {
                    totalAll++;
                    byLocation[locName].squads[cmdName]++;
                    if (u.horse || u.type === 'rider' || u.type === 'heavy_rider' || u.type === 'knight') byLocation[locName].cavalry++;
                    else byLocation[locName].infantry++;
                });
            }
        }
    }
    
    html += '<p style="color:#6a5a48;">Всего: <strong>' + totalAll + '</strong></p>';
    
    if (totalAll === 0) { html += '<p style="color:#6a5a48;">Нет войск.</p>'; }
    else {
        for (var loc in byLocation) {
            var data = byLocation[loc];
            var locTotal = data.infantry + data.cavalry + data.siege + data.scouts;
            html += '<div style="background:#120e0b;border:1px solid #2a201a;border-radius:10px;padding:10px;margin:6px 0;">';
            html += '<h5 style="color:#c9b694;">📍 ' + loc + ' — ' + locTotal + '</h5>';
            var parts = [];
            if (data.infantry > 0) parts.push('🗡️ ' + data.infantry);
            if (data.cavalry > 0) parts.push('🐴 ' + data.cavalry);
            if (data.siege > 0) parts.push('🏗️ ' + data.siege);
            if (data.scouts > 0) parts.push('👁️ ' + data.scouts);
            html += '<div style="font-size:11px;color:#b8a890;">' + parts.join(' | ') + '</div>';
            var sKeys = Object.keys(data.squads);
            if (sKeys.length > 0) {
                html += '<div style="font-size:11px;">';
                sKeys.forEach(function(sid) { html += '<span style="color:#ffd700;">👑 ' + sid + ': ' + data.squads[sid] + '</span><br>'; });
                html += '</div>';
            }
            html += '</div>';
        }
    }
    
    return html;
}

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ
// ============================================================

function getFreeCaptains(houseId, squads, excludeNames) {
    var free = [];
    for (var name in users) {
        if (users[name].game.house === houseId && users[name].game.houseRank === 'captain_officer') {
            if (users[name].game._leftSquad && users[name].game._leftSquad.role === 'captain') continue;
            var assigned = false;
            for (var cmd in squads) { if (squads[cmd].captains && squads[cmd].captains[name]) { assigned = true; break; } }
            if (!assigned && excludeNames.indexOf(name) === -1) free.push(name);
        }
    }
    return free;
}

function getFreeSergeants(houseId, squads, excludeNames) {
    var free = [];
    for (var name in users) {
        if (users[name].game.house === houseId && users[name].game.houseRank === 'sergeant') {
            if (users[name].game._leftSquad && users[name].game._leftSquad.role === 'sergeant') continue;
            var assigned = false;
            for (var cmd in squads) {
                for (var cap in squads[cmd].captains) {
                    if (squads[cmd].captains[cap].sergeants && squads[cmd].captains[cap].sergeants[name]) { assigned = true; break; }
                }
                if (assigned) break;
            }
            if (!assigned && excludeNames.indexOf(name) === -1) free.push(name);
        }
    }
    return free;
}

function getZoneName(zoneId) {
    var z = WORLD_AREAS[zoneId];
    return z ? z.name : zoneId;
}

function getZoneCoords(zoneId) {
    if (zoneId === 'castle') return '';
    var z = WORLD_AREAS[zoneId];
    return z ? '[' + z.x + ',' + z.y + ']' : '';
}

function showUnitGroup(units) {
    var grouped = {};
    units.forEach(function(u) { if (!grouped[u.type]) grouped[u.type] = 0; grouped[u.type]++; });
    var html = '<div style="font-size:10px;color:#6a5a48;padding-left:10px;">';
    for (var t in grouped) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
        html += (ut ? ut.emoji + ' ' + ut.name : t) + ' ×' + grouped[t] + ' ';
    }
    html += '</div>';
    return html;
}

function showUnitGroupInline(units) {
    var grouped = {};
    units.forEach(function(u) { if (!grouped[u.type]) grouped[u.type] = 0; grouped[u.type]++; });
    var html = '';
    for (var t in grouped) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
        html += (ut ? ut.emoji + ' ' + ut.name : t) + ' ×' + grouped[t] + ' ';
    }
    return html;
}

function parseUnitInput(input, available) {
    var unitTypes = {};
    var parts = input.split(',');
    var hasError = false;
    parts.forEach(function(part) {
        var kv = part.split(':');
        if (kv.length !== 2) { hasError = true; return; }
        var typeName = kv[0].trim();
        var count = parseInt(kv[1].trim());
        var foundType = null;
        if (window.UNIT_TYPES) {
            for (var t in window.UNIT_TYPES) {
                if (window.UNIT_TYPES[t].name.toLowerCase() === typeName.toLowerCase() || t === typeName.toLowerCase()) { foundType = t; break; }
            }
        }
        if (!foundType) foundType = typeName;
        if (isNaN(count) || count <= 0) { hasError = true; return; }
        if (available && count > (available[foundType] || 0)) { hasError = true; return; }
        unitTypes[foundType] = (unitTypes[foundType] || 0) + count;
    });
    return hasError || Object.keys(unitTypes).length === 0 ? null : unitTypes;
}

// ============================================================
// МАРШ
// ============================================================

window.showMarchDetails = function(index) {
    var houseId = users[currentUser].game.house;
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [], marching: [] };
    var marching = garrison.marching || [];
    if (index >= marching.length) { setMessage('❌ Не найден.'); return; }
    var m = marching[index];
    
    var modal = document.getElementById('modal-march-details');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-march-details';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeMarchDetails(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📋 СОСТАВ</h3><button class="close-btn" onclick="closeMarchDetails()">✕</button></div><div id="modal-march-details-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    var content = document.getElementById('modal-march-details-content');
    var html = '<div class="modal-section"><h4>📋 СОСТАВ</h4><p style="color:#6a5a48;">' + m.units.length + ' юнитов</p>';
    var grouped = {};
    m.units.forEach(function(u) { if (!grouped[u.type]) grouped[u.type] = 0; grouped[u.type]++; });
    for (var k in grouped) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[k] : null;
        html += '<div class="row"><span class="label">' + (ut ? ut.emoji + ' ' + ut.name : k) + '</span><span class="value">×' + grouped[k] + '</span></div>';
    }
    html += '</div><button class="btn btn-secondary" onclick="closeMarchDetails()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
};

window.closeMarchDetails = function() {
    var m = document.getElementById('modal-march-details');
    if (m) m.classList.add('hide');
};

// ============================================================
// ПРИГЛАШЕНИЯ И РОЛИ
// ============================================================

function getHouseMembers(houseId) {
    var members = [];
    for (var name in users) {
        if (users[name].game.house === houseId) members.push({ name: name, rank: users[name].game.houseRank || null });
    }
    members.sort(function(a, b) {
        var oA = a.rank && HOUSE_RANKS[a.rank] ? HOUSE_RANKS[a.rank].order : 99;
        var oB = b.rank && HOUSE_RANKS[b.rank] ? HOUSE_RANKS[b.rank].order : 99;
        return oA - oB;
    });
    return members;
}

function canManageMember(targetName) {
    var u = users[currentUser], t = users[targetName];
    if (!u || !t || u.game.house !== t.game.house) return false;
    if (!u.game.houseRank || !HOUSE_RANKS[u.game.houseRank]) return false;
    if (!t.game.houseRank || !HOUSE_RANKS[t.game.houseRank]) return true;
    return HOUSE_RANKS[u.game.houseRank].order < HOUSE_RANKS[t.game.houseRank].order;
}

function getHouseChronicle(houseId) { return houseLogs[houseId] || []; }

function invitePlayer() {
    var name = prompt('Введите имя:');
    if (!name) return;
    if (!users[name]) { setMessage('❌ Не найден.'); return; }
    if (users[name].game.house) { setMessage('❌ Уже в доме.'); return; }
    var houseId = users[currentUser].game.house;
    if (!invitations[name]) invitations[name] = [];
    if (invitations[name].some(function(i) { return i.houseId === houseId; })) { setMessage('❌ Уже отправлено.'); return; }
    invitations[name].push({ houseId: houseId, from: currentUser });
    saveInvitations();
    addHouseLog(houseId, '📨 Приглашение → ' + name);
    setMessage('✅ Отправлено.');
    showHouseTab('sent');
}

function cancelInvite(playerName) {
    var houseId = users[currentUser].game.house;
    if (!invitations[playerName]) return;
    invitations[playerName] = invitations[playerName].filter(function(i) { return i.houseId !== houseId; });
    if (invitations[playerName].length === 0) delete invitations[playerName];
    saveInvitations();
    addHouseLog(houseId, '❌ Приглашение отменено');
    setMessage('❌ Отменено.');
    showHouseTab('sent');
}

function acceptInvite(houseId) {
    var user = users[currentUser];
    user.game.house = houseId;
    var hasLord = Object.values(users).some(function(u) { return u.game.house === houseId && u.game.houseRank === 'lord'; });
    user.game.houseRank = hasLord ? 'knight' : 'lord';
    invitations[currentUser] = (invitations[currentUser] || []).filter(function(i) { return i.houseId !== houseId; });
    if (!invitations[currentUser].length) delete invitations[currentUser];
    saveInvitations(); saveData();
    addHouseLog(houseId, '👤 ' + currentUser + ' вступил');
    setMessage('✅ Вы вступили в дом!');
    closeHouses(); openMyHouse();
}

function declineInvite(houseId) {
    invitations[currentUser] = (invitations[currentUser] || []).filter(function(i) { return i.houseId !== houseId; });
    if (!invitations[currentUser].length) delete invitations[currentUser];
    saveInvitations();
    addHouseLog(houseId, '❌ ' + currentUser + ' отклонил');
    setMessage('❌ Отклонено.');
    openMyHouse();
}

function leaveHouse() {
    if (!confirm('Покинуть дом?')) return;
    var user = users[currentUser];
    var houseId = user.game.house;
    user.game.house = null;
    user.game.houseRank = null;
    user.game._leftSquad = null;
    saveData();
    addHouseLog(houseId, '🚪 ' + currentUser + ' покинул');
    setMessage('🚪 Вы покинули дом.');
    closeHouses(); openMyHouse();
}

function assignRank(playerName) {
    var user = users[currentUser];
    if (!user.game.houseRank || !HOUSE_RANKS[user.game.houseRank]) { setMessage('❌ Нет прав.'); return; }
    var canAssign = HOUSE_RANKS[user.game.houseRank].canAssign;
    var options = [];
    canAssign.forEach(function(r) {
        if (RANK_LIMITS[r] && RANK_LIMITS[r] > 0) {
            var cnt = Object.values(users).filter(function(u) { return u.game.house === user.game.house && u.game.houseRank === r; }).length;
            if (cnt >= RANK_LIMITS[r]) return;
        }
        options.push(r);
    });
    if (!options.length) { setMessage('❌ Нет ролей.'); return; }
    
    var modal = document.getElementById('modal-rank');
    if (!modal) {
        var o = document.createElement('div'); o.id = 'modal-rank'; o.className = 'modal-overlay hide';
        o.onclick = function(e) { if (e.target === this) closeRankModal(); };
        o.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📋 НАЗНАЧИТЬ РОЛЬ</h3><button class="close-btn" onclick="closeRankModal()">✕</button></div><div id="modal-rank-content"></div></div>';
        document.body.appendChild(o); modal = o;
    }
    var c = document.getElementById('modal-rank-content');
    var h = '<div class="modal-section"><h4>👤 ' + playerName + '</h4></div><div class="modal-section">';
    options.forEach(function(r) {
        var ri = HOUSE_RANKS[r];
        h += '<div class="row"><span class="label"><strong>' + ri.name + '</strong><br><span style="font-size:11px;color:#6a5a48;">' + ri.description + '</span></span>';
        h += '<span class="value"><button class="btn btn-small" onclick="confirmAssignRank(\'' + playerName + '\',\'' + r + '\')">✅</button></span></div>';
    });
    h += '</div><button class="btn btn-secondary" onclick="closeRankModal()">Закрыть</button>';
    c.innerHTML = h; modal.classList.remove('hide');
}

function confirmAssignRank(playerName, newRank) {
    var user = users[currentUser], target = users[playerName];
    if (!target || target.game.house !== user.game.house) { setMessage('❌ Не в доме.'); closeRankModal(); return; }
    if (newRank === 'lord') {
        Object.values(users).forEach(function(u) { if (u.game.house === user.game.house && u.game.houseRank === 'lord') u.game.houseRank = 'heir'; });
        user.game.houseRank = 'heir';
    }
    target.game.houseRank = newRank;
    saveData();
    addHouseLog(user.game.house, '📋 ' + playerName + ' → ' + HOUSE_RANKS[newRank].name);
    setMessage('✅ Назначен.');
    closeRankModal(); showHouseTab('members');
}

function closeRankModal() { var m = document.getElementById('modal-rank'); if (m) m.classList.add('hide'); }

function loadInvitations() { try { var r = localStorage.getItem('got_invitations'); if (r) invitations = JSON.parse(r); } catch(e) { invitations = {}; } }
function saveInvitations() { localStorage.setItem('got_invitations', JSON.stringify(invitations)); }

// ============================================================
// РЕГИСТРАЦИЯ ВСЕХ ФУНКЦИЙ
// ============================================================

window.openMyHouse = openMyHouse;
window.showHouseTab = showHouseTab;
window.showArmySubTab = showArmySubTab;
window.showMarchDetails = showMarchDetails;
window.closeMarchDetails = closeMarchDetails;
window.invitePlayer = invitePlayer;
window.cancelInvite = cancelInvite;
window.acceptInvite = acceptInvite;
window.declineInvite = declineInvite;
window.leaveHouse = leaveHouse;
window.assignRank = assignRank;
window.confirmAssignRank = confirmAssignRank;
window.closeRankModal = closeRankModal;

// Командование
window.assignUnitsDialog = assignUnitsDialog;
window.confirmAssignUnits = confirmAssignUnits;
window.closeAssignModal = closeAssignModal;
window.unassignUnitsDialog = unassignUnitsDialog;
window.toggleAllUnassign = toggleAllUnassign;
window.confirmUnassignUnits = confirmUnassignUnits;
window.closeUnassignModal = closeUnassignModal;
window.assignCaptainModal = assignCaptainModal;
window.confirmCaptainAssign = confirmCaptainAssign;
window.closeAssignCaptainModal = closeAssignCaptainModal;
window.assignSergeantToCaptainModal = assignSergeantToCaptainModal;
window.confirmSergeantAssign = confirmSergeantAssign;
window.closeAssignSergeantModal = closeAssignSergeantModal;
window.assignUnitsToCaptainModal = assignUnitsToCaptainModal;
window.confirmAssignToCaptain = confirmAssignToCaptain;
window.assignUnitsToSergeantModal = assignUnitsToSergeantModal;
window.confirmAssignToSergeant = confirmAssignToSergeant;
window.closeAssignUnitsModal = closeAssignUnitsModal;
window.recallFromCaptainModal = recallFromCaptainModal;
window.toggleRecallCapAll = toggleRecallCapAll;
window.confirmRecallFromCaptain = confirmRecallFromCaptain;
window.recallFromSergeantModal = recallFromSergeantModal;
window.toggleRecallSgtAll = toggleRecallSgtAll;
window.confirmRecallFromSergeant = confirmRecallFromSergeant;
window.removeCaptain = removeCaptain;
window.removeSergeant = removeSergeant;
window.toggleCommanderControl = toggleCommanderControl;
window.toggleCaptainControl = toggleCaptainControl;
window.toggleSergeantControl = toggleSergeantControl;
window.bindCommanderDialog = bindCommanderDialog;
window.closeBindModal = closeBindModal;
window.showSquadOnMap = showSquadOnMap;
window.rejoinSquadAuto = rejoinSquadAuto;
window.parseUnitInput = parseUnitInput;

loadInvitations();
console.log('🏰 Дипломатия + Командование v3.0 загружены!');

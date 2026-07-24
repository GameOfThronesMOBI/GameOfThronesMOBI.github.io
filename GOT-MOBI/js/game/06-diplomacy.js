// ============================================================
// js/game/06-diplomacy.js — ПОЛИТИКА, ДОМ, РОЛИ, АРМИЯ, КОМАНДОВАНИЕ
// ПОЛНАЯ ВЕРСИЯ — ВСЕ ФУНКЦИИ
// ============================================================

var HOUSE_RANKS = {
    lord: { name: '👑 Лорд/Леди', order: 1, description: 'Глава дома.', canAssign: ['heir','war_master','castellan','steward','treasurer','maester','whisperer','knight_commander','captain_officer','sergeant','knight'] },
    heir: { name: '🏴 Наследник', order: 2, description: 'Преемник лорда.', canAssign: ['war_master','castellan','steward','treasurer','maester','whisperer','knight_commander','captain_officer','sergeant','knight'] },
    war_master: { name: '⚔️ Мастер над войной', order: 3, description: 'Оборона и гарнизон.', canAssign: ['knight_commander','captain_officer','sergeant','knight'] },
    castellan: { name: '🏰 Кастелян', order: 4, description: 'Управление замком.', canAssign: [] },
    steward: { name: '🍞 Стюард', order: 5, description: 'Хозяйство и припасы.', canAssign: [] },
    treasurer: { name: '💰 Казначей', order: 6, description: 'Доходы и налоги.', canAssign: [] },
    maester: { name: '📜 Мейстер', order: 7, description: 'Советник и врач.', canAssign: [] },
    whisperer: { name: '🕵️ Мастер над шептунами', order: 8, description: 'Разведка.', canAssign: [] },
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
            html += '<button class="tab-btn" onclick="showHouseTab(\'command\')">👑 Командование</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'army\')">⚔️ Армия</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'my_squad\')">🎯 Мой отряд</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'garrison\')">📍 Гарнизон</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'chronicle\')">📜 Летопись</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'invite\')">📨 Пригласить</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'sent\')">📤 Отправленные</button>';
            html += '</div>';
            html += '<div id="house-tab-content"></div>';
            
            html += '<div class="modal-section" style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;">';
            var mySquad = window.getMySquad ? window.getMySquad() : null;
            if (mySquad) {
                html += '<button class="btn btn-small" onclick="window.leaveSquad(); setTimeout(function(){ showHouseTab(\'my_squad\'); }, 300);">🚶 Покинуть отряд</button>';
            } else if (g._leftSquad) {
                html += '<button class="btn btn-small" onclick="rejoinSquadAuto(); setTimeout(function(){ showHouseTab(\'my_squad\'); }, 300);">✅ Вернуться в отряд</button>';
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
        html += '<div class="row"><span class="label">📍 Контролируемых зон</span><span class="value">' + zoneCount + '</span></div>';
        html += '<div class="row"><span class="label">💰 Казна</span><span class="value">' + (house.treasury || 0) + ' зол.</span></div>';
        html += '</div>';
    }
    
    if (tab === 'members') {
        html += '<div class="modal-section"><h4>👥 УЧАСТНИКИ</h4>';
        var members = getHouseMembers(g.house);
        if (members.length === 0) {
            html += '<p style="color:#6a5a48;">Нет участников.</p>';
        } else {
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
    
    if (tab === 'command') {
        html += showCommandTab(g.house);
    }
    
    if (tab === 'army') {
        html += '<div class="modal-section"><h4>⚔️ АРМИЯ ДОМА</h4>';
        html += '<div class="tabs" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;">';
        html += '<button class="tab-btn active" onclick="showArmySubTab(\'total\')">⚔️ Общая</button>';
        html += '<button class="tab-btn" onclick="showArmySubTab(\'garrison\')">📍 Гарнизоны</button>';
        html += '<button class="tab-btn" onclick="showArmySubTab(\'marching\')">🚶 В пути</button>';
        html += '</div>';
        html += '<div id="army-sub-tab-content"></div>';
        html += '</div>';
        container.innerHTML = html;
        showArmySubTab('total');
        return;
    }
    
    if (tab === 'my_squad') {
        html += showMySquadTab(g.house);
    }
    
    if (tab === 'garrison') {
        html += showGarrisonTab(g.house);
    }
    
    if (tab === 'chronicle') {
        html += '<div class="modal-section"><h4>📜 ЛЕТОПИСЬ</h4>';
        var chronicle = getHouseChronicle(g.house);
        if (chronicle.length === 0) { html += '<p style="color:#6a5a48;">Пусто.</p>'; }
        else { chronicle.forEach(function(entry) { html += '<div style="padding:4px 0; border-bottom:1px solid #1a1410; font-size:12px; color:#b8a890;">' + entry + '</div>'; }); }
        html += '</div>';
    }
    
    if (tab === 'invite') {
        html += '<div class="modal-section"><h4>📨 ПРИГЛАСИТЬ ИГРОКА</h4>';
        if (!g.houseRank || !HOUSE_RANKS[g.houseRank] || HOUSE_RANKS[g.houseRank].canAssign.length === 0) {
            html += '<p style="color:#6a5a48;">У вас нет прав приглашать игроков.</p>';
        } else {
            html += '<p style="color:#6a5a48;">Введите имя игрока для приглашения в дом.</p>';
            html += '<button class="btn" onclick="invitePlayer()">📨 Пригласить игрока</button>';
        }
        html += '</div>';
    }
    
    if (tab === 'sent') {
        html += '<div class="modal-section"><h4>📤 ОТПРАВЛЕННЫЕ ПРИГЛАШЕНИЯ</h4>';
        var sent = [];
        for (var name in invitations) {
            for (var i = 0; i < invitations[name].length; i++) {
                if (invitations[name][i].houseId === g.house) sent.push({ playerName: name, from: invitations[name][i].from });
            }
        }
        if (sent.length === 0) { html += '<p style="color:#6a5a48;">Нет отправленных приглашений.</p>'; }
        else {
            sent.forEach(function(s) {
                html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
                html += '<span class="label">👤 ' + s.playerName + '</span>';
                html += '<span class="value"><button class="btn btn-small" style="background:#3d2a1a;" onclick="cancelInvite(\'' + s.playerName + '\')">❌ Отменить</button></span>';
                html += '</div>';
            });
        }
        html += '</div>';
    }
    
    container.innerHTML = html;
};

// ============================================================
// 2.1 ВКЛАДКА «КОМАНДОВАНИЕ» — ПОЛНАЯ ВОЕННАЯ ИЕРАРХИЯ
// ============================================================

function showCommandTab(houseId) {
    if (!window.getSquads) return '<p style="color:#c96a5a;">❌ Система командования не загружена.</p>';
    
    var user = users[currentUser];
    var myRank = user.game.houseRank;
    var isHighCommand = myRank && ['lord','heir','war_master'].indexOf(myRank) !== -1;
    var isCommander = myRank === 'knight_commander';
    var isCaptain = myRank === 'captain_officer';
    
    var html = '<div class="modal-section"><h4>👑 КОМАНДОВАНИЕ</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Военная иерархия дома. Командоры → Капитаны → Сержанты.</p>';
    
    // Кнопка сбора для высшего командования
    if (isHighCommand) {
        html += '<button class="btn" onclick="rallyHighCommandDialog()" style="margin-bottom:10px;">📦 Сбор войск</button>';
    }
    
    var commanders = [];
    for (var name in users) {
        if (users[name].game.house === houseId && users[name].game.houseRank === 'knight_commander') {
            commanders.push(name);
        }
    }
    
    var allCaptains = [];
    for (var name in users) { if (users[name].game.house === houseId && users[name].game.houseRank === 'captain_officer') allCaptains.push(name); }
    
    var allSergeants = [];
    for (var name in users) { if (users[name].game.house === houseId && users[name].game.houseRank === 'sergeant') allSergeants.push(name); }
    
    if (commanders.length === 0) {
        html += '<p style="color:#6a5a48;">Нет рыцарей-командоров. Назначьте игроков на эту роль во вкладке «Участники».</p>';
        html += '</div>';
        return html;
    }
    
    var squads = window.getSquads(houseId);
    
    commanders.forEach(function(cmdName) {
        var squad = squads[cmdName];
        var cmdUser = users[cmdName];
        var cmdLeft = cmdUser && cmdUser.game._leftSquad && cmdUser.game._leftSquad.commanderName === cmdName;
        var cmdStatus = cmdLeft ? '🟡' : '🟢';
        var isDetached = squad && squad.detached === true;
        var detachIcon = isDetached ? '🔓' : '🔒';
        
        var cmdUnits = squad ? squad.units.length : 0;
        var totalUnits = cmdUnits;
        
        var locationName = squad ? (squad.location === 'castle' ? '🏰 Замок' : getZoneName(squad.location)) : '—';
        
        html += '<div style="background:#120e0b;border:2px solid #3d3026;border-radius:12px;padding:14px;margin:10px 0;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
        html += '<div>';
        html += '<strong style="color:#ffd700;font-size:16px;">⭐ ' + cmdName + '</strong> ' + cmdStatus + ' ' + detachIcon;
        html += '<br><span style="color:#6a5a48;font-size:11px;">Рыцарь-командор | 📍 ' + locationName + '</span>';
        html += '<br><span style="color:#b8a890;font-size:12px;">👥 Юнитов: <strong>' + cmdUnits + '</strong></span>';
        html += '</div>';
        html += '<div style="display:flex;gap:4px;flex-wrap:wrap;">';
        
        // Кнопка 🗺️ для всех членов дома
        if (squad && squad.location) {
            html += '<button class="btn btn-small" onclick="showSquadOnMap(\'' + cmdName + '\')">🗺️</button>';
        }
        
        if (isHighCommand) {
            html += '<button class="btn btn-small" onclick="assignUnitsDialog(\'' + cmdName + '\')">⚔️ Выделить</button>';
            html += '<button class="btn btn-small" onclick="toggleDetachCommander(\'' + cmdName + '\')">' + (isDetached ? '🔒' : '🔓') + '</button>';
        }
        
        if ((isCommander || isCaptain) && (currentUser === cmdName || (mySquadBelongsTo(cmdName)))) {
            html += '<button class="btn btn-small" onclick="rallyCommanderDialog(\'' + cmdName + '\')">📦 Сбор</button>';
        }
        
        html += '</div>';
        html += '</div>';
        
        // Капитаны
        if (squad && squad.captains) {
            var capNames = Object.keys(squad.captains);
            
            html += '<div style="margin-top:10px;padding-left:10px;border-left:2px solid #3d3026;">';
            html += '<p style="color:#6a5a48;font-size:11px;">🗡️ Капитаны (' + capNames.length + '/5):</p>';
            
            for (var ci = 0; ci < 5; ci++) {
                if (ci < capNames.length) {
                    var capName = capNames[ci];
                    var cap = squad.captains[capName];
                    var capUser = users[capName];
                    var capLeft = capUser && capUser.game._leftSquad && capUser.game._leftSquad.captainName === capName;
                    var capStatus = capLeft ? '🟡' : '🟢';
                    var capDetached = cap.detached === true;
                    var capDetachIcon = capDetached ? '🔓' : '🔒';
                    var capUnits = cap.units.length;
                    totalUnits += capUnits;
                    
                    for (var sgtName in cap.sergeants) { totalUnits += cap.sergeants[sgtName].units.length; }
                    
                    html += '<div style="background:#1a1410;border:1px solid #2a201a;border-radius:8px;padding:8px;margin:4px 0;">';
                    html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
                    html += '<div>';
                    html += '<span style="color:#c9b694;">🗡️ ' + capName + '</span> ' + capStatus + ' ' + capDetachIcon;
                    html += '<br><span style="font-size:10px;color:#6a5a48;">👥 ' + capUnits + ' юнитов</span>';
                    html += '</div>';
                    html += '<div style="display:flex;gap:2px;flex-wrap:wrap;">';
                    
                    if (isHighCommand || currentUser === cmdName) {
                        html += '<button class="btn btn-small" style="font-size:9px;" onclick="assignUnitsToCaptainDialog(\'' + cmdName + '\',\'' + capName + '\')">⚔️</button>';
                        html += '<button class="btn btn-small" style="font-size:9px;" onclick="recallFromCaptainDialog(\'' + cmdName + '\',\'' + capName + '\')">📥</button>';
                        html += '<button class="btn btn-small" style="font-size:9px;" onclick="toggleDetachCaptain(\'' + cmdName + '\',\'' + capName + '\')">' + (capDetached ? '🔒' : '🔓') + '</button>';
                    }
                    html += '</div>';
                    html += '</div>';
                    
                    // Сержанты
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
                                var sgtDetached = sgt.detached === true;
                                var sgtDetachIcon = sgtDetached ? '🔓' : '🔒';
                                var sgtUnits = sgt.units.length;
                                
                                html += '<div style="padding:2px 0;font-size:10px;">';
                                html += '<span style="color:#b8a890;">🛡️ ' + sgtName + '</span> ' + sgtStatus + ' ' + sgtDetachIcon;
                                html += ' <span style="color:#6a5a48;">👥 ' + sgtUnits + '</span>';
                                
                                if (isHighCommand || currentUser === cmdName || currentUser === capName) {
                                    html += ' <button class="btn btn-small" style="font-size:8px;padding:1px 4px;" onclick="assignUnitsToSergeantDialog(\'' + cmdName + '\',\'' + capName + '\',\'' + sgtName + '\')">⚔️</button>';
                                    html += ' <button class="btn btn-small" style="font-size:8px;padding:1px 4px;" onclick="recallFromSergeantDialog(\'' + cmdName + '\',\'' + capName + '\',\'' + sgtName + '\')">📥</button>';
                                    html += ' <button class="btn btn-small" style="font-size:8px;padding:1px 4px;" onclick="toggleDetachSergeant(\'' + cmdName + '\',\'' + capName + '\',\'' + sgtName + '\')">' + (sgtDetached ? '🔒' : '🔓') + '</button>';
                                }
                                html += '</div>';
                            } else {
                                html += '<div style="padding:2px 0;font-size:10px;color:#3d3026;">🛡️ Пустой слот</div>';
                            }
                        }
                        
                        if ((isHighCommand || currentUser === cmdName || currentUser === capName) && sgtNames.length < 4) {
                            var freeSergeants = getFreeSergeants(houseId, squads, sgtNames);
                            if (freeSergeants.length > 0) {
                                html += '<button class="btn btn-small" style="font-size:9px;margin-top:4px;" onclick="assignSergeantToCaptainDialog(\'' + cmdName + '\',\'' + capName + '\')">➕ Назначить сержанта</button>';
                            }
                        }
                        html += '</div>';
                    }
                    html += '</div>';
                } else {
                    html += '<div style="background:#1a1410;border:1px solid #1a1410;border-radius:8px;padding:8px;margin:4px 0;color:#3d3026;font-size:11px;">🗡️ Пустой слот капитана</div>';
                }
            }
            
            if ((isHighCommand || currentUser === cmdName) && capNames.length < 5) {
                var freeCaptains = getFreeCaptains(houseId, squads, capNames);
                if (freeCaptains.length > 0) {
                    html += '<button class="btn btn-small" style="margin-top:6px;" onclick="assignCaptainDialog(\'' + cmdName + '\')">➕ Назначить капитана</button>';
                }
            }
            html += '</div>';
        } else if (isHighCommand) {
            html += '<div style="margin-top:10px;padding-left:10px;border-left:2px solid #3d3026;">';
            html += '<p style="color:#6a5a48;font-size:11px;">🗡️ Капитаны (0/5):</p>';
            html += '<p style="color:#6a5a48;font-size:10px;">Выделите командору войска, чтобы открыть слоты.</p>';
            html += '</div>';
        }
        
        html += '<div style="margin-top:8px;padding-top:6px;border-top:1px solid #2a201a;text-align:right;">';
        html += '<span style="color:#6a5a48;font-size:11px;">Всего в командовании: <strong>' + totalUnits + '</strong> юнитов</span>';
        html += '</div>';
        html += '</div>';
    });
    
    html += '</div>';
    return html;
}

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ КОМАНДОВАНИЯ
// ============================================================

function getFreeCaptains(houseId, squads, excludeNames) {
    var free = [];
    for (var name in users) {
        if (users[name].game.house === houseId && users[name].game.houseRank === 'captain_officer' && name !== currentUser) {
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
        if (users[name].game.house === houseId && users[name].game.houseRank === 'sergeant' && name !== currentUser) {
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

function mySquadBelongsTo(cmdName) {
    var mySquad = window.getMySquad ? window.getMySquad() : null;
    return mySquad && mySquad.commanderName === cmdName;
}

function getZoneName(zoneId) {
    var z = WORLD_AREAS[zoneId];
    return z ? z.name : zoneId;
}

function getZoneCoords(zoneId) {
    var z = WORLD_AREAS[zoneId];
    return z ? '[' + z.x + ',' + z.y + ']' : '';
}

// ============================================================
// ДИАЛОГИ КОМАНДОВАНИЯ
// ============================================================

function assignUnitsDialog(cmdName) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [] };
    
    var freeUnitsCastle = {};
    var totalCastle = 0;
    var freeUnitsMap = {};
    var totalMap = 0;
    
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (garrison[cat]) {
            garrison[cat].forEach(function(u) {
                if (!u.commander && !u.squadId && !u.isScout) {
                    var t = u.type;
                    if (u.location === 'castle') {
                        if (!freeUnitsCastle[t]) freeUnitsCastle[t] = 0;
                        freeUnitsCastle[t]++; totalCastle++;
                    } else {
                        var locName = getZoneName(u.location) + ' ' + getZoneCoords(u.location);
                        if (!freeUnitsMap[locName]) freeUnitsMap[locName] = {};
                        if (!freeUnitsMap[locName][t]) freeUnitsMap[locName][t] = 0;
                        freeUnitsMap[locName][t]++; totalMap++;
                    }
                }
            });
        }
    });
    
    if (totalCastle + totalMap === 0) {
        setMessage('❌ Нет свободных войск.');
        return;
    }
    
    var modal = document.getElementById('modal-assign');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-assign'; overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeAssignModal(); };
        overlay.innerHTML = '<div class="modal-box" style="max-height:90vh;overflow-y:auto;"><div class="modal-header"><h3>⚔️ ВЫДЕЛИТЬ ВОЙСКА</h3><button class="close-btn" onclick="closeAssignModal()">✕</button></div><div id="modal-assign-content"></div></div>';
        document.body.appendChild(overlay); modal = overlay;
    }
    
    var content = document.getElementById('modal-assign-content');
    var html = '<div class="modal-section"><h4>⭐ Командор: ' + cmdName + '</h4>';
    html += '<p style="color:#6a5a48;">Выберите войска (макс. 1000). Войска останутся на местах после выделения.</p>';
    
    // Секция: Замок
    if (totalCastle > 0) {
        html += '<h5>🏰 Замок (' + totalCastle + ' юнитов)</h5>';
        for (var t in freeUnitsCastle) {
            var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
            html += '<div class="row">';
            html += '<span class="label">' + (ut ? ut.emoji + ' ' + ut.name : t) + ' — ' + freeUnitsCastle[t] + ' шт.</span>';
            html += '<span class="value"><input type="number" id="assign_castle_' + t + '" value="0" min="0" max="' + freeUnitsCastle[t] + '" style="width:60px;"></span>';
            html += '</div>';
        }
    }
    
    // Секция: Карта
    if (totalMap > 0) {
        html += '<h5 style="margin-top:10px;">🌍 На карте (' + totalMap + ' юнитов)</h5>';
        html += '<p style="color:#c96a5a;font-size:10px;">⚠️ Войска с карты пойдут к командору после выделения.</p>';
        for (var loc in freeUnitsMap) {
            html += '<p style="color:#6a5a48;font-size:11px;">📍 ' + loc + '</p>';
            for (var t in freeUnitsMap[loc]) {
                var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
                html += '<div class="row">';
                html += '<span class="label" style="padding-left:10px;">' + (ut ? ut.emoji + ' ' + ut.name : t) + ' — ' + freeUnitsMap[loc][t] + ' шт.</span>';
                html += '<span class="value"><input type="number" id="assign_map_' + loc.replace(/[^a-z0-9]/gi,'_') + '_' + t + '" value="0" min="0" max="' + freeUnitsMap[loc][t] + '" style="width:60px;"></span>';
                html += '</div>';
            }
        }
    }
    
    html += '<button class="btn" onclick="confirmAssignUnits(\'' + cmdName + '\')" style="margin-top:10px;">✅ Выделить</button>';
    html += '<button class="btn btn-secondary" onclick="closeAssignModal()">Закрыть</button>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function confirmAssignUnits(cmdName) {
    var unitTypes = {};
    var totalRequested = 0;
    var mapAssignments = {};
    
    // Собираем из замка
    var inputs = document.querySelectorAll('#modal-assign-content input[id^="assign_castle_"]');
    inputs.forEach(function(inp) {
        var count = parseInt(inp.value) || 0;
        if (count > 0) {
            var t = inp.id.replace('assign_castle_', '');
            unitTypes[t] = (unitTypes[t] || 0) + count;
            totalRequested += count;
        }
    });
    
    // Собираем с карты
    var mapInputs = document.querySelectorAll('#modal-assign-content input[id^="assign_map_"]');
    mapInputs.forEach(function(inp) {
        var count = parseInt(inp.value) || 0;
        if (count > 0) {
            var parts = inp.id.replace('assign_map_', '').split('_');
            var t = parts[parts.length-1];
            var locKey = parts.slice(0, -1).join('_');
            unitTypes[t] = (unitTypes[t] || 0) + count;
            if (!mapAssignments[locKey]) mapAssignments[locKey] = {};
            mapAssignments[locKey][t] = count;
            totalRequested += count;
        }
    });
    
    if (totalRequested === 0) { setMessage('❌ Выберите хотя бы 1 юнита.'); return; }
    if (totalRequested > 1000) { setMessage('❌ Максимум 1000 юнитов.'); return; }
    
    var success = window.assignUnitsToCommander(cmdName, unitTypes);
    if (success) {
        // TODO: запустить марш для войск с карты к командору
        closeAssignModal();
        setTimeout(function() { showHouseTab('command'); }, 300);
    }
}

function closeAssignModal() {
    var m = document.getElementById('modal-assign');
    if (m) m.classList.add('hide');
}

function assignCaptainDialog(cmdName) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    var capNames = squad ? Object.keys(squad.captains || {}) : [];
    var freeCaptains = getFreeCaptains(houseId, squads, capNames);
    
    if (freeCaptains.length === 0) { setMessage('❌ Нет свободных капитанов.'); return; }
    
    var msg = 'Назначить капитана командору ' + cmdName + ':\n';
    freeCaptains.forEach(function(name, i) { msg += (i+1) + '. ' + name + '\n'; });
    msg += '0. Отмена';
    
    var choice = prompt(msg);
    if (!choice || choice === '0') return;
    var index = parseInt(choice) - 1;
    if (isNaN(index) || index < 0 || index >= freeCaptains.length) { setMessage('❌ Отменено.'); return; }
    
    var capName = freeCaptains[index];
    
    if (!squad) { window.createSquad(cmdName); squad = window.getSquads(houseId)[cmdName]; }
    if (!squad) { setMessage('❌ Ошибка создания отряда.'); return; }
    
    var countStr = prompt('Сколько юнитов передать капитану ' + capName + '?\nУ командора: ' + squad.units.length + ' юнитов.');
    var count = parseInt(countStr);
    if (isNaN(count) || count <= 0 || count > squad.units.length) { setMessage('❌ Неверное количество.'); return; }
    
    var unitTypes = {};
    var taken = 0;
    for (var i = 0; i < squad.units.length && taken < count; i++) {
        var t = squad.units[i].type;
        if (!unitTypes[t]) unitTypes[t] = 0;
        unitTypes[t]++; taken++;
    }
    
    window.commanderAssignToCaptain(capName, unitTypes);
    setTimeout(function() { showHouseTab('command'); }, 300);
}

function assignSergeantToCaptainDialog(cmdName, capName) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad || !squad.captains[capName]) { setMessage('❌ Капитан не найден.'); return; }
    var cap = squad.captains[capName];
    var sgtNames = cap.sergeants ? Object.keys(cap.sergeants) : [];
    var freeSergeants = getFreeSergeants(houseId, squads, sgtNames);
    
    if (freeSergeants.length === 0) { setMessage('❌ Нет свободных сержантов.'); return; }
    
    var msg = 'Назначить сержанта капитану ' + capName + ':\n';
    freeSergeants.forEach(function(name, i) { msg += (i+1) + '. ' + name + '\n'; });
    msg += '0. Отмена';
    
    var choice = prompt(msg);
    if (!choice || choice === '0') return;
    var index = parseInt(choice) - 1;
    if (isNaN(index) || index < 0 || index >= freeSergeants.length) { setMessage('❌ Отменено.'); return; }
    
    var sgtName = freeSergeants[index];
    var countStr = prompt('Сколько юнитов передать сержанту ' + sgtName + '?\nУ капитана: ' + cap.units.length + ' юнитов.');
    var count = parseInt(countStr);
    if (isNaN(count) || count <= 0 || count > cap.units.length) { setMessage('❌ Неверное количество.'); return; }
    
    var unitTypes = {};
    var taken = 0;
    for (var i = 0; i < cap.units.length && taken < count; i++) {
        var t = cap.units[i].type;
        if (!unitTypes[t]) unitTypes[t] = 0;
        unitTypes[t]++; taken++;
    }
    
    window.captainAssignToSergeant(sgtName, unitTypes);
    setTimeout(function() { showHouseTab('command'); }, 300);
}

function assignUnitsToCaptainDialog(cmdName, capName) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad || !squad.captains[capName]) { setMessage('❌ Капитан не найден.'); return; }
    
    if (squad.units.length === 0) { setMessage('❌ У командора нет свободных юнитов.'); return; }
    
    var msg = 'Выделить юнитов капитану ' + capName + ':\nУ командора:\n';
    var grouped = {};
    squad.units.forEach(function(u) { if (!grouped[u.type]) grouped[u.type] = 0; grouped[u.type]++; });
    for (var t in grouped) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
        msg += (ut ? ut.emoji + ' ' + ut.name : t) + ': ' + grouped[t] + '\n';
    }
    msg += '\nВведите: тип:количество, тип:количество\nПример: light_swordsman:50, archer:30';
    
    var input = prompt(msg);
    if (!input) { setMessage('❌ Отменено.'); return; }
    
    var unitTypes = parseUnitInput(input, grouped);
    if (!unitTypes) { setMessage('❌ Неверный формат.'); return; }
    
    window.commanderAssignToCaptain(capName, unitTypes);
    setTimeout(function() { showHouseTab('command'); }, 300);
}

function assignUnitsToSergeantDialog(cmdName, capName, sgtName) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad || !squad.captains[capName]) { setMessage('❌ Капитан не найден.'); return; }
    var cap = squad.captains[capName];
    if (!cap.sergeants || !cap.sergeants[sgtName]) { setMessage('❌ Сержант не найден.'); return; }
    
    if (cap.units.length === 0) { setMessage('❌ У капитана нет свободных юнитов.'); return; }
    
    var msg = 'Выделить юнитов сержанту ' + sgtName + ':\nУ капитана:\n';
    var grouped = {};
    cap.units.forEach(function(u) { if (!grouped[u.type]) grouped[u.type] = 0; grouped[u.type]++; });
    for (var t in grouped) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
        msg += (ut ? ut.emoji + ' ' + ut.name : t) + ': ' + grouped[t] + '\n';
    }
    msg += '\nВведите: тип:количество, тип:количество';
    
    var input = prompt(msg);
    if (!input) { setMessage('❌ Отменено.'); return; }
    
    var unitTypes = parseUnitInput(input, grouped);
    if (!unitTypes) { setMessage('❌ Неверный формат.'); return; }
    
    window.captainAssignToSergeant(sgtName, unitTypes);
    setTimeout(function() { showHouseTab('command'); }, 300);
}

function recallFromCaptainDialog(cmdName, capName) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad || !squad.captains[capName]) { setMessage('❌ Капитан не найден.'); return; }
    var cap = squad.captains[capName];
    
    if (cap.units.length === 0) { setMessage('❌ У капитана нет юнитов.'); return; }
    
    var msg = 'Отозвать юнитов у капитана ' + capName + ':\nУ капитана:\n';
    var grouped = {};
    cap.units.forEach(function(u) { if (!grouped[u.type]) grouped[u.type] = 0; grouped[u.type]++; });
    for (var t in grouped) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
        msg += (ut ? ut.emoji + ' ' + ut.name : t) + ': ' + grouped[t] + '\n';
    }
    msg += '\nВведите: тип:количество (или 0 для всех)';
    
    var input = prompt(msg);
    if (!input) { setMessage('❌ Отменено.'); return; }
    
    if (input === '0' || input === '') {
        window.recallUnitsFromCaptain(capName, {});
    } else {
        var unitTypes = parseUnitInput(input, grouped);
        if (!unitTypes) { setMessage('❌ Неверный формат.'); return; }
        window.recallUnitsFromCaptain(capName, unitTypes);
    }
    setTimeout(function() { showHouseTab('command'); }, 300);
}

function recallFromSergeantDialog(cmdName, capName, sgtName) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad || !squad.captains[capName]) { setMessage('❌ Капитан не найден.'); return; }
    var cap = squad.captains[capName];
    if (!cap.sergeants || !cap.sergeants[sgtName]) { setMessage('❌ Сержант не найден.'); return; }
    var sgt = cap.sergeants[sgtName];
    
    if (sgt.units.length === 0) { setMessage('❌ У сержанта нет юнитов.'); return; }
    
    var msg = 'Отозвать юнитов у сержанта ' + sgtName + ':\nУ сержанта:\n';
    var grouped = {};
    sgt.units.forEach(function(u) { if (!grouped[u.type]) grouped[u.type] = 0; grouped[u.type]++; });
    for (var t in grouped) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
        msg += (ut ? ut.emoji + ' ' + ut.name : t) + ': ' + grouped[t] + '\n';
    }
    msg += '\nВведите: тип:количество (или 0 для всех)';
    
    var input = prompt(msg);
    if (!input) { setMessage('❌ Отменено.'); return; }
    
    if (input === '0' || input === '') {
        window.captainRecallFromSergeant(sgtName, {});
    } else {
        var unitTypes = parseUnitInput(input, grouped);
        if (!unitTypes) { setMessage('❌ Неверный формат.'); return; }
        window.captainRecallFromSergeant(sgtName, unitTypes);
    }
    setTimeout(function() { showHouseTab('command'); }, 300);
}

function toggleDetachCaptain(cmdName, capName) {
    var squads = window.getSquads(users[currentUser].game.house);
    var squad = squads[cmdName];
    if (!squad || !squad.captains[capName]) { setMessage('❌ Капитан не найден.'); return; }
    squad.captains[capName].detached = !squad.captains[capName].detached;
    saveData();
    setMessage(squad.captains[capName].detached ? '🔓 Капитан отсоединён.' : '🔒 Капитан присоединён.');
    setTimeout(function() { showHouseTab('command'); }, 300);
}

function toggleDetachSergeant(cmdName, capName, sgtName) {
    var squads = window.getSquads(users[currentUser].game.house);
    var squad = squads[cmdName];
    if (!squad || !squad.captains[capName]) { setMessage('❌ Капитан не найден.'); return; }
    var cap = squad.captains[capName];
    if (!cap.sergeants || !cap.sergeants[sgtName]) { setMessage('❌ Сержант не найден.'); return; }
    cap.sergeants[sgtName].detached = !cap.sergeants[sgtName].detached;
    saveData();
    setMessage(cap.sergeants[sgtName].detached ? '🔓 Сержант отсоединён.' : '🔒 Сержант присоединён.');
    setTimeout(function() { showHouseTab('command'); }, 300);
}

function toggleDetachCommander(cmdName) {
    var squads = window.getSquads(users[currentUser].game.house);
    var squad = squads[cmdName];
    if (!squad) { setMessage('❌ Командор не найден.'); return; }
    squad.detached = !squad.detached;
    saveData();
    setMessage(squad.detached ? '🔓 Командор отсоединён.' : '🔒 Командор присоединён.');
    setTimeout(function() { showHouseTab('command'); }, 300);
}

// ============================================================
// СБОР ВОЙСК
// ============================================================

function rallyHighCommandDialog() {
    var houseId = users[currentUser].game.house;
    var squads = window.getSquads(houseId);
    var cmdNames = Object.keys(squads);
    
    if (cmdNames.length === 0) { setMessage('❌ Нет командоров для сбора.'); return; }
    
    var msg = 'Выберите командора для сбора войск:\n';
    cmdNames.forEach(function(name, i) { msg += (i+1) + '. ' + name + '\n'; });
    msg += '0. Отмена';
    
    var choice = prompt(msg);
    if (!choice || choice === '0') return;
    var index = parseInt(choice) - 1;
    if (isNaN(index) || index < 0 || index >= cmdNames.length) { setMessage('❌ Отменено.'); return; }
    
    var cmdName = cmdNames[index];
    window._awaitingTarget = true;
    window._targetData = { fromZone: 'rally', isRally: true, commanderName: cmdName };
    setMessage('🗺️ Выберите точку сбора на карте мира.');
    closeHouses();
}

function rallyCommanderDialog(cmdName) {
    window._awaitingTarget = true;
    window._targetData = { fromZone: 'rally', isRally: true, commanderName: cmdName };
    setMessage('🗺️ Выберите точку сбора на карте мира.');
    closeHouses();
}

// Обработка клика по карте для сбора
window._originalHandleZoneClick = window.handleZoneClick;
window.handleZoneClick = function(zoneId) {
    if (window._awaitingTarget && window._targetData && window._targetData.isRally) {
        var data = window._targetData;
        window._awaitingTarget = false;
        window._targetData = null;
        
        var cmdName = data.commanderName;
        window.rallySquadTo(cmdName, zoneId);
        setMessage('📦 Войска командора ' + cmdName + ' выдвигаются в точку сбора.');
        return;
    }
    
    if (window._originalHandleZoneClick) {
        window._originalHandleZoneClick(zoneId);
    }
};

window.rallySquadTo = function(cmdName, targetZoneId) {
    var houseId = users[currentUser].game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[cmdName];
    if (!squad) { setMessage('❌ Командор не найден.'); return; }
    
    // Собираем все привязанные войска из всех локаций
    var garrison = window._castleGarrisons[houseId];
    var allUnits = [];
    
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (garrison[cat]) {
            for (var i = garrison[cat].length - 1; i >= 0; i--) {
                var u = garrison[cat][i];
                if (u.squadId === cmdName && !u.isScout) {
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
    
    var marchId = 'rally_' + Date.now() + '_' + Math.floor(Math.random()*1000);
    var marchData = {
        id: marchId, units: allUnits, path: [squad.location || 'castle', targetZoneId], currentStep: 0,
        action: 'move', houseId: houseId, speedPerZone: speedPerZone,
        moveTimeMs: speedPerZone * 60 * 1000, waitTimeMs: 10000,
        phase: 'waiting', nextPhaseTime: Date.now() + 10000,
        isSquad: true, squadId: cmdName, isRally: true
    };
    
    if (!garrison.marching) garrison.marching = [];
    garrison.marching.push(marchData);
    
    squad.units = [];
    if (squad.captains) {
        for (var capName in squad.captains) {
            squad.captains[capName].units = [];
            if (squad.captains[capName].sergeants) {
                for (var sgtName in squad.captains[capName].sergeants) {
                    squad.captains[capName].sergeants[sgtName].units = [];
                }
            }
        }
    }
    
    saveData();
    addHouseLog(houseId, '📦 Сбор войск ' + cmdName + ' → ' + getZoneName(targetZoneId));
    processMarchStep(marchId);
};

// ============================================================
// ПОКАЗАТЬ ОТРЯД НА КАРТЕ
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
            setMessage('🗺️ Отряд ' + cmdName + ' находится: ' + (squad.location === 'castle' ? '🏰 Замок' : getZoneName(squad.location)) + ' ' + getZoneCoords(locId));
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
    
    if (playerLocation === squadLocation) {
        window.rejoinSquad();
        setMessage('✅ Вы вернулись в отряд!');
    } else {
        // Запускаем преследование
        setMessage('🏃 Вы следуете за отрядом...');
        startChaseSquad(data);
    }
}

function startChaseSquad(data) {
    var g = users[currentUser].game;
    var playerLoc = g.location.parentZone || g.location.place;
    if (playerLoc === 'Таверна' || playerLoc === 'Дом') playerLoc = 'kl_0_0';
    
    // Запускаем интервал проверки
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
            setMessage('✅ Вы догнали отряд и вернулись в него!');
            updateMenu();
            return;
        }
        
        // Двигаем игрока на 1 шаг к отряду
        var path = findPath(playerLoc2, squadLoc);
        if (path.length > 1) {
            var nextLoc = path[1];
            g.location.place = nextLoc;
            g.location.locationId = nextLoc;
            g.location.parentZone = null;
            g.outside = true;
            updateMenu();
            updateStory();
            updateActions();
            saveData();
            setMessage('🏃 Преследую отряд... (' + nextLoc + ')');
        }
    }, 10000); // Каждые 10 секунд шаг
    
    g._chaseInterval = chaseInterval;
}

function showMySquadTab(houseId) {
    if (!window.getMySquad) return '<p style="color:#c96a5a;">❌ Система отрядов не загружена.</p>';
    
    var mySquad = window.getMySquad();
    var html = '<div class="modal-section"><h4>🎯 МОЙ ОТРЯД</h4>';
    
    if (!mySquad) {
        html += '<p style="color:#6a5a48;">Вы не состоите в отряде.</p>';
        var user = users[currentUser];
        if (user && user.game._leftSquad) {
            var data = user.game._leftSquad;
            var squads = window.getSquads(data.houseId);
            var squad = squads[data.commanderName];
            var locName = '—';
            if (squad) locName = squad.location === 'castle' ? '🏰 Замок' : getZoneName(squad.location);
            
            html += '<div style="background:#2a201a;border:1px solid #ffd700;border-radius:10px;padding:10px;margin:10px 0;">';
            html += '<p style="color:#ffd700;">📌 Вы покинули отряд ' + data.commanderName + '</p>';
            html += '<p style="color:#6a5a48;">📍 Отряд: ' + locName + '</p>';
            html += '<button class="btn btn-small" onclick="rejoinSquadAuto(); setTimeout(function(){ showHouseTab(\'my_squad\'); }, 500);">✅ Вернуться в отряд</button>';
            html += '</div>';
        }
    } else {
        var s = mySquad.squad;
        var locationName = s.location === 'castle' ? '🏰 Замок' : (WORLD_AREAS[s.location] ? WORLD_AREAS[s.location].name : s.location);
        var isDetached = s.detached === true;
        
        html += '<div style="background:#120e0b;border:1px solid #3d3026;border-radius:10px;padding:12px;margin:6px 0;">';
        html += '<p><strong style="color:#c9b694;">👑 Командор:</strong> ' + mySquad.commanderName + '</p>';
        html += '<p><strong style="color:#c9b694;">🎯 Ваша роль:</strong> ' + (mySquad.role === 'commander' ? 'Командор' : mySquad.role === 'captain' ? 'Капитан' : 'Сержант') + '</p>';
        html += '<p><strong style="color:#c9b694;">📍 Локация:</strong> ' + locationName + (isDetached ? ' 🔓' : ' 🔒') + '</p>';
        html += '</div>';
        
        if (mySquad.role === 'commander') {
            html += '<p style="color:#6a5a48;">⭐ Ваши юниты: <strong>' + s.units.length + '</strong></p>';
            if (s.units.length > 0) html += showUnitGroup(s.units);
            
            for (var capName in s.captains) {
                var cap = s.captains[capName];
                var capDetached = cap.detached ? ' 🔓' : '';
                html += '<p style="margin-top:8px;color:#c9b694;">🗡️ ' + capName + capDetached + ' — ' + cap.units.length + ' юнитов</p>';
                if (cap.units.length > 0) html += showUnitGroup(cap.units);
                for (var sgtName in cap.sergeants) {
                    var sgt = cap.sergeants[sgtName];
                    var sgtDetached = sgt.detached ? ' 🔓' : '';
                    html += '<p style="margin-top:4px;padding-left:10px;color:#b8a890;">🛡️ ' + sgtName + sgtDetached + ' — ' + sgt.units.length + ' юнитов</p>';
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
                    html += '<p style="margin-top:4px;padding-left:10px;color:#b8a890;">🛡️ ' + sgtName + ' — ' + sgt.units.length + ' юнитов</p>';
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
    
    html += '</div>';
    return html;
}

// ============================================================
// ВКЛАДКА «ГАРНИЗОН»
// ============================================================

function showGarrisonTab(houseId) {
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [], marching: [] };
    
    var html = '<div class="modal-section"><h4>📍 ГАРНИЗОН — ВСЕ ВОЙСКА</h4>';
    html += '<p style="color:#6a5a48;font-size:11px;">Расположение всех войск дома с координатами.</p>';
    
    var byLocation = {};
    var totalAll = 0;
    
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (garrison[cat]) {
            garrison[cat].forEach(function(u) {
                totalAll++;
                var loc = u.location || 'castle';
                var locName = loc === 'castle' ? '🏰 Замок' : getZoneName(loc) + ' ' + getZoneCoords(loc);
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
    
    html += '<p style="color:#6a5a48;">Всего войск: <strong>' + totalAll + '</strong></p>';
    
    if (totalAll === 0) {
        html += '<p style="color:#6a5a48;">Нет войск.</p>';
    } else {
        for (var loc in byLocation) {
            var data = byLocation[loc];
            var locTotal = data.infantry + data.cavalry + data.siege + data.scouts;
            
            html += '<div style="background:#120e0b;border:1px solid #2a201a;border-radius:10px;padding:10px;margin:6px 0;">';
            html += '<h5 style="color:#c9b694;">📍 ' + loc + ' — ' + locTotal + ' юнитов</h5>';
            
            var parts = [];
            if (data.infantry > 0) parts.push('🗡️ ' + data.infantry);
            if (data.cavalry > 0) parts.push('🐴 ' + data.cavalry);
            if (data.siege > 0) parts.push('🏗️ ' + data.siege);
            if (data.scouts > 0) parts.push('👁️ ' + data.scouts);
            html += '<div style="font-size:11px;color:#b8a890;">' + parts.join(' | ') + '</div>';
            
            var squadKeys = Object.keys(data.squads);
            if (squadKeys.length > 0) {
                html += '<div style="margin-top:4px;font-size:11px;">';
                squadKeys.forEach(function(sid) {
                    html += '<span style="color:#ffd700;">👑 ' + sid + ': ' + data.squads[sid] + ' юнитов</span><br>';
                });
                html += '</div>';
            }
            html += '</div>';
        }
    }
    
    if (garrison.marching && garrison.marching.length > 0) {
        html += '<div class="modal-section"><h4>🚶 В ПУТИ</h4>';
        garrison.marching.forEach(function(m) {
            var fromName = m.path && m.path[0] ? getZoneName(m.path[0]) : '?';
            var toName = m.path && m.path[m.path.length-1] ? getZoneName(m.path[m.path.length-1]) : '?';
            var timeLeft = Math.max(0, Math.ceil((m.nextPhaseTime - Date.now()) / 60000));
            html += '<div style="font-size:11px;color:#b8a890;padding:4px 0;border-bottom:1px solid #1a1410;">';
            html += (m.isSquad ? '👑 ' : '🟢 ') + fromName + ' → ' + toName;
            html += ' | ' + m.units.length + ' юнитов | ⏱️ ~' + timeLeft + ' мин';
            html += '</div>';
        });
        html += '</div>';
    }
    
    html += '</div>';
    return html;
}

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ
// ============================================================

function showUnitGroup(units) {
    var grouped = {};
    units.forEach(function(u) { var t = u.type; if (!grouped[t]) grouped[t] = 0; grouped[t]++; });
    var html = '<div style="font-size:10px;color:#6a5a48;padding-left:10px;">';
    for (var t in grouped) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
        html += (ut ? ut.emoji + ' ' + ut.name : t) + ' ×' + grouped[t] + ' ';
    }
    html += '</div>';
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
                if (window.UNIT_TYPES[t].name.toLowerCase() === typeName.toLowerCase() || t === typeName.toLowerCase()) {
                    foundType = t; break;
                }
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
// ПОД-ВКЛАДКИ АРМИИ
// ============================================================

window.showArmySubTab = function(subTab) {
    var container = document.getElementById('army-sub-tab-content');
    if (!container) return;
    var houseId = users[currentUser].game.house;
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [], marching: [] };
    var html = '';
    
    if (subTab === 'total') {
        html += '<h4>⚔️ ОБЩАЯ АРМИЯ</h4>';
        var allGrouped = {};
        var totalCount = 0;
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (garrison[cat]) garrison[cat].forEach(function(u) {
                totalCount++;
                var k = u.isScout ? 'scout' : u.type;
                if (!allGrouped[k]) allGrouped[k] = 0; allGrouped[k]++;
            });
        });
        if (totalCount === 0) { html += '<p style="color:#6a5a48;">Нет войск.</p>'; }
        else {
            html += '<p style="color:#6a5a48;">Всего: ' + totalCount + ' юнитов</p>';
            html += '<h5>🗡️ Пехота</h5>';
            var hasInf = false;
            for (var k in allGrouped) {
                var ut = window.UNIT_TYPES ? window.UNIT_TYPES[k] : null;
                if (ut && !ut.horse && !ut.siege && k !== 'scout') {
                    hasInf = true;
                    html += '<div class="row"><span class="label">' + ut.emoji + ' ' + ut.name + '</span><span class="value">×' + allGrouped[k] + '</span></div>';
                }
            }
            if (!hasInf) html += '<p style="color:#6a5a48;">Нет пехоты.</p>';
            
            html += '<h5>🐴 Конница</h5>';
            var hasCav = false;
            for (var k in allGrouped) {
                var ut = window.UNIT_TYPES ? window.UNIT_TYPES[k] : null;
                if (ut && ut.horse) { hasCav = true;
                    html += '<div class="row"><span class="label">' + ut.emoji + ' ' + ut.name + '</span><span class="value">×' + allGrouped[k] + '</span></div>';
                }
            }
            if (!hasCav) html += '<p style="color:#6a5a48;">Нет конницы.</p>';
            
            html += '<h5>🏗️ Осадные</h5>';
            var hasSiege = false;
            for (var k in allGrouped) {
                var ut = window.UNIT_TYPES ? window.UNIT_TYPES[k] : null;
                if (ut && ut.siege && k !== 'scout') { hasSiege = true;
                    html += '<div class="row"><span class="label">' + ut.emoji + ' ' + ut.name + '</span><span class="value">×' + allGrouped[k] + '</span></div>';
                }
            }
            if (!hasSiege) html += '<p style="color:#6a5a48;">Нет осадных.</p>';
            if (allGrouped['scout']) html += '<h5>👁️ Разведчики</h5><div class="row"><span class="label">👁️ Разведчики</span><span class="value">×' + allGrouped['scout'] + '</span></div>';
        }
    }
    
    if (subTab === 'garrison') {
        html += '<h4>📍 ГАРНИЗОНЫ</h4>';
        var byZone = {}; var totalG = 0;
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (garrison[cat]) garrison[cat].forEach(function(u) {
                var zid = u.location || 'castle';
                var zname = zid === 'castle' ? '🏰 Замок' : getZoneName(zid) + ' ' + getZoneCoords(zid);
                if (!byZone[zname]) byZone[zname] = { units: {}, scouts: 0, total: 0 };
                totalG++;
                if (u.isScout) byZone[zname].scouts++;
                else { var k = u.type; if (!byZone[zname].units[k]) byZone[zname].units[k] = 0; byZone[zname].units[k]++; }
                byZone[zname].total++;
            });
        });
        if (totalG === 0) { html += '<p style="color:#6a5a48;">Нет гарнизонов.</p>'; }
        else {
            html += '<p style="color:#6a5a48;">Всего: ' + totalG + ' юнитов</p>';
            for (var zname in byZone) {
                var zd = byZone[zname];
                html += '<div style="background:#120e0b;border:1px solid #2a201a;border-radius:10px;padding:10px;margin:6px 0;">';
                html += '<h5 style="color:#c9b694;">📍 ' + zname + ' (' + zd.total + ')</h5>';
                for (var k in zd.units) { var ut = window.UNIT_TYPES?window.UNIT_TYPES[k]:null;
                    html += '<div class="row"><span class="label">' + (ut?ut.emoji+' '+ut.name:k) + '</span><span class="value">×' + zd.units[k] + '</span></div>'; }
                if (zd.scouts>0) html += '<div class="row"><span class="label">👁️ Разведчики</span><span class="value">×' + zd.scouts + '</span></div>';
                html += '</div>';
            }
        }
    }
    
    if (subTab === 'marching') {
        html += '<h4>🚶 В ПУТИ</h4>';
        var marching = garrison.marching || [];
        if (marching.length === 0) { html += '<p style="color:#6a5a48;">Нет армий в пути.</p>'; }
        else {
            html += '<p style="color:#6a5a48;">Отрядов: ' + marching.length + '</p>';
            marching.forEach(function(m) {
                var from = m.path?getZoneName(m.path[0]):'?', to = m.path?getZoneName(m.path[m.path.length-1]):'?';
                var tl = Math.max(0, Math.ceil((m.nextPhaseTime - Date.now()) / 60000));
                html += '<div style="font-size:11px;color:#b8a890;padding:4px 0;">' + (m.isSquad?'👑':'🟢') + ' ' + from + ' → ' + to + ' | ' + m.units.length + ' юн. | ~' + tl + ' мин</div>';
            });
        }
    }
    
    container.innerHTML = html;
};

window.showMarchDetails = function(index) {
    var houseId = users[currentUser].game.house;
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [], marching: [] };
    var marching = garrison.marching || [];
    if (index >= marching.length) { setMessage('❌ Отряд не найден.'); return; }
    var m = marching[index];
    
    var modal = document.getElementById('modal-march-details');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-march-details'; overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeMarchDetails(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📋 СОСТАВ</h3><button class="close-btn" onclick="closeMarchDetails()">✕</button></div><div id="modal-march-details-content"></div></div>';
        document.body.appendChild(overlay); modal = overlay;
    }
    var content = document.getElementById('modal-march-details-content');
    var html = '<div class="modal-section"><h4>📋 СОСТАВ</h4><p style="color:#6a5a48;">Всего: ' + m.units.length + ' юнитов</p>';
    var grouped = {};
    m.units.forEach(function(u) { var k = u.type; if (!grouped[k]) grouped[k] = 0; grouped[k]++; });
    for (var k in grouped) { var ut = window.UNIT_TYPES ? window.UNIT_TYPES[k] : null;
        html += '<div class="row"><span class="label">' + (ut ? ut.emoji + ' ' + ut.name : k) + '</span><span class="value">×' + grouped[k] + '</span></div>'; }
    html += '</div><button class="btn btn-secondary" onclick="closeMarchDetails()">Закрыть</button>';
    content.innerHTML = html; modal.classList.remove('hide');
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
        if (users[name].game.house === houseId) {
            members.push({ name: name, rank: users[name].game.houseRank || null });
        }
    }
    members.sort(function(a, b) {
        var orderA = a.rank && HOUSE_RANKS[a.rank] ? HOUSE_RANKS[a.rank].order : 99;
        var orderB = b.rank && HOUSE_RANKS[b.rank] ? HOUSE_RANKS[b.rank].order : 99;
        return orderA - orderB;
    });
    return members;
}

function canManageMember(targetName) {
    var user = users[currentUser];
    var target = users[targetName];
    if (!user || !target) return false;
    if (user.game.house !== target.game.house) return false;
    var myRank = user.game.houseRank;
    var targetRank = target.game.houseRank;
    if (!myRank || !HOUSE_RANKS[myRank]) return false;
    if (!targetRank || !HOUSE_RANKS[targetRank]) return true;
    return HOUSE_RANKS[myRank].order < HOUSE_RANKS[targetRank].order;
}

function getHouseChronicle(houseId) { return houseLogs[houseId] || []; }

function invitePlayer() {
    var name = prompt('Введите имя игрока:');
    if (!name) return;
    if (!users[name]) { setMessage('❌ Игрок не найден.'); return; }
    if (users[name].game.house) { setMessage('❌ Игрок уже в доме.'); return; }
    var user = users[currentUser];
    var houseId = user.game.house;
    if (!invitations[name]) invitations[name] = [];
    for (var i = 0; i < invitations[name].length; i++) {
        if (invitations[name][i].houseId === houseId) { setMessage('❌ Приглашение уже отправлено.'); return; }
    }
    invitations[name].push({ houseId: houseId, from: currentUser });
    saveInvitations();
    addHouseLog(houseId, '📨 Приглашение → ' + name);
    setMessage('✅ Приглашение отправлено.');
    showHouseTab('sent');
}

function cancelInvite(playerName) {
    var user = users[currentUser];
    var houseId = user.game.house;
    if (!invitations[playerName]) return;
    invitations[playerName] = invitations[playerName].filter(function(inv) { return inv.houseId !== houseId; });
    if (invitations[playerName].length === 0) delete invitations[playerName];
    saveInvitations();
    addHouseLog(houseId, '❌ Приглашение отменено');
    setMessage('❌ Приглашение отменено.');
    showHouseTab('sent');
}

function acceptInvite(houseId) {
    var user = users[currentUser];
    user.game.house = houseId;
    var hasLord = false;
    for (var name in users) {
        if (name !== currentUser && users[name].game.house === houseId && users[name].game.houseRank === 'lord') { hasLord = true; break; }
    }
    var rank = hasLord ? 'knight' : 'lord';
    user.game.houseRank = rank;
    invitations[currentUser] = (invitations[currentUser] || []).filter(function(inv) { return inv.houseId !== houseId; });
    if (invitations[currentUser].length === 0) delete invitations[currentUser];
    saveInvitations(); saveData();
    addHouseLog(houseId, '👤 ' + currentUser + ' вступил как ' + (HOUSE_RANKS[rank]?HOUSE_RANKS[rank].name:rank));
    setMessage('✅ Вы вступили в дом!');
    closeHouses(); openMyHouse();
}

function declineInvite(houseId) {
    invitations[currentUser] = (invitations[currentUser] || []).filter(function(inv) { return inv.houseId !== houseId; });
    if (invitations[currentUser].length === 0) delete invitations[currentUser];
    saveInvitations();
    addHouseLog(houseId, '❌ ' + currentUser + ' отклонил');
    setMessage('❌ Вы отклонили приглашение.');
    openMyHouse();
}

function leaveHouse() {
    if (!confirm('Вы уверены, что хотите покинуть дом?')) return;
    var user = users[currentUser];
    var houseId = user.game.house;
    user.game.house = null;
    user.game.houseRank = null;
    user.game._leftSquad = null;
    saveData();
    addHouseLog(houseId, '🚪 ' + currentUser + ' покинул дом');
    setMessage('🚪 Вы покинули дом.');
    closeHouses(); openMyHouse();
}

function assignRank(playerName) {
    var user = users[currentUser];
    var myRank = user.game.houseRank;
    if (!myRank || !HOUSE_RANKS[myRank]) { setMessage('❌ У вас нет прав.'); return; }
    var canAssign = HOUSE_RANKS[myRank].canAssign;
    var options = [];
    canAssign.forEach(function(rank) {
        if (RANK_LIMITS[rank] && RANK_LIMITS[rank] > 0) {
            var count = 0;
            for (var name in users) { if (users[name].game.house === user.game.house && users[name].game.houseRank === rank) count++; }
            if (count >= RANK_LIMITS[rank]) return;
        }
        options.push(rank);
    });
    if (options.length === 0) { setMessage('❌ Нет доступных ролей.'); return; }
    
    var modal = document.getElementById('modal-rank');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-rank'; overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeRankModal(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📋 НАЗНАЧИТЬ РОЛЬ</h3><button class="close-btn" onclick="closeRankModal()">✕</button></div><div id="modal-rank-content"></div></div>';
        document.body.appendChild(overlay); modal = overlay;
    }
    var content = document.getElementById('modal-rank-content');
    var html = '<div class="modal-section"><h4>👤 ' + playerName + '</h4><p style="color:#6a5a48;">Выберите роль:</p></div><div class="modal-section">';
    options.forEach(function(rank) {
        var ri = HOUSE_RANKS[rank];
        html += '<div class="row"><span class="label"><strong>' + ri.name + '</strong><br><span style="font-size:11px;color:#6a5a48;">' + ri.description + '</span></span>';
        html += '<span class="value"><button class="btn btn-small" onclick="confirmAssignRank(\'' + playerName + '\',\'' + rank + '\')">✅</button></span></div>';
    });
    html += '</div><button class="btn btn-secondary" onclick="closeRankModal()">Закрыть</button>';
    content.innerHTML = html; modal.classList.remove('hide');
}

function confirmAssignRank(playerName, newRank) {
    var user = users[currentUser];
    var target = users[playerName];
    if (!target || target.game.house !== user.game.house) { setMessage('❌ Игрок не в доме.'); closeRankModal(); return; }
    if (newRank === 'lord') {
        for (var name in users) { if (users[name].game.house === user.game.house && users[name].game.houseRank === 'lord') users[name].game.houseRank = 'heir'; }
        user.game.houseRank = 'heir';
    }
    target.game.houseRank = newRank;
    saveData();
    addHouseLog(user.game.house, '📋 ' + playerName + ' → ' + HOUSE_RANKS[newRank].name);
    setMessage('✅ ' + playerName + ' назначен: ' + HOUSE_RANKS[newRank].name);
    closeRankModal();
    showHouseTab('members');
}

function closeRankModal() { var m = document.getElementById('modal-rank'); if (m) m.classList.add('hide'); }

function loadInvitations() { try { var raw = localStorage.getItem('got_invitations'); if (raw) invitations = JSON.parse(raw); } catch(e) { invitations = {}; } }
function saveInvitations() { localStorage.setItem('got_invitations', JSON.stringify(invitations)); }

// ============================================================
// РЕГИСТРАЦИЯ ВСЕХ ФУНКЦИЙ
// ============================================================

window.openMyHouse = window.openMyHouse;
window.showHouseTab = window.showHouseTab;
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
window.assignCaptainDialog = assignCaptainDialog;
window.assignSergeantToCaptainDialog = assignSergeantToCaptainDialog;
window.assignUnitsToCaptainDialog = assignUnitsToCaptainDialog;
window.assignUnitsToSergeantDialog = assignUnitsToSergeantDialog;
window.recallFromCaptainDialog = recallFromCaptainDialog;
window.recallFromSergeantDialog = recallFromSergeantDialog;
window.toggleDetachCaptain = toggleDetachCaptain;
window.toggleDetachSergeant = toggleDetachSergeant;
window.toggleDetachCommander = toggleDetachCommander;
window.rallyHighCommandDialog = rallyHighCommandDialog;
window.rallyCommanderDialog = rallyCommanderDialog;
window.rallySquadTo = rallySquadTo;
window.showSquadOnMap = showSquadOnMap;
window.rejoinSquadAuto = rejoinSquadAuto;

loadInvitations();
console.log('🏰 Дипломатия + Командование + Сбор + Преследование загружены!');

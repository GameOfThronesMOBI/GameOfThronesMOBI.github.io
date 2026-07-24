// ============================================================
// js/game/06-diplomacy.js — МОЙ ДОМ, ПРИГЛАШЕНИЯ, РОЛИ, АРМИЯ, ОТРЯДЫ, ГАРНИЗОН
// ПОЛНАЯ ВЕРСИЯ
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
    knight_commander: { name: '⭐ Рыцарь-командор', order: 9, description: 'Командует отрядом.', canAssign: ['captain_officer','sergeant','knight'] },
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
            html += '<button class="tab-btn" onclick="showHouseTab(\'squads\')">👑 Отряды</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'my_squad\')">🎯 Мой отряд</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'garrison\')">📍 Гарнизон</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'chronicle\')">📜 Летопись</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'invite\')">📨 Пригласить</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'sent\')">📤 Отправленные</button>';
            html += '</div>';
            html += '<div id="house-tab-content"></div>';
            
            // Кнопки действий
            html += '<div class="modal-section" style="margin-top:10px;">';
            var mySquad = window.getMySquad ? window.getMySquad() : null;
            if (mySquad) {
                html += '<button class="btn btn-small" onclick="window.leaveSquad()" style="margin:4px;">🚶 Покинуть отряд</button>';
            } else if (g._leftSquad) {
                html += '<button class="btn btn-small" onclick="window.rejoinSquad()" style="margin:4px;">✅ Вернуться в отряд</button>';
            }
            html += '<button class="btn btn-danger" onclick="leaveHouse()" style="margin:4px;">🚪 Покинуть дом</button>';
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
    
    // Обновляем активную вкладку
    var tabs = document.querySelectorAll('#modal-houses .tab-btn');
    tabs.forEach(function(t) { t.classList.remove('active'); });
    var activeTab = document.querySelector('#modal-houses .tab-btn[onclick*="' + tab + '"]');
    if (activeTab) activeTab.classList.add('active');
    
    if (tab === 'info') {
        html += '<div class="modal-section">';
        html += '<div class="row"><span class="label">📍 Регион</span><span class="value">' + (house.region || '—') + '</span></div>';
        html += '<div class="row"><span class="label">🏰 Замок</span><span class="value">' + (house.castle || 'Нет') + '</span></div>';
        html += '<div class="row"><span class="label">👑 Сюзерен</span><span class="value">' + (house.liege ? (HOUSES[house.liege] ? HOUSES[house.liege].sigil + ' ' + HOUSES[house.liege].name : house.liege) : 'Независимый') + '</span></div>';
        
        var vassals = [];
        for (var id in HOUSES) {
            if (HOUSES[id].liege === g.house) vassals.push(HOUSES[id]);
        }
        html += '<div class="row"><span class="label">⚓ Вассалы</span><span class="value">' + (vassals.length > 0 ? vassals.length + ' домов' : 'Нет') + '</span></div>';
        if (vassals.length > 0) {
            vassals.forEach(function(v) {
                html += '<div class="row"><span class="label" style="font-size:11px;padding-left:12px;">' + v.sigil + ' ' + v.name + '</span><span class="value"></span></div>';
            });
        }
        
        var zoneCount = 0;
        if (typeof WORLD_AREAS !== 'undefined') {
            for (var zoneId in WORLD_AREAS) {
                if (WORLD_AREAS[zoneId].owner === g.house) zoneCount++;
            }
        }
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
    
    if (tab === 'army') {
        html += '<div class="modal-section"><h4>⚔️ АРМИЯ ДОМА</h4>';
        html += '<div class="tabs" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;">';
        html += '<button class="tab-btn active" onclick="showArmySubTab(\'total\')">⚔️ Армия</button>';
        html += '<button class="tab-btn" onclick="showArmySubTab(\'garrison\')">📍 Гарнизоны</button>';
        html += '<button class="tab-btn" onclick="showArmySubTab(\'marching\')">🚶 В пути</button>';
        html += '</div>';
        html += '<div id="army-sub-tab-content"></div>';
        html += '</div>';
        
        container.innerHTML = html;
        showArmySubTab('total');
        return;
    }
    
    if (tab === 'squads') {
        html += showSquadsTab(g.house);
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
        if (chronicle.length === 0) {
            html += '<p style="color:#6a5a48;">Пусто.</p>';
        } else {
            chronicle.forEach(function(entry) {
                html += '<div style="padding:4px 0; border-bottom:1px solid #1a1410; font-size:12px; color:#b8a890;">' + entry + '</div>';
            });
        }
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
                if (invitations[name][i].houseId === g.house) {
                    sent.push({ playerName: name, from: invitations[name][i].from });
                }
            }
        }
        if (sent.length === 0) {
            html += '<p style="color:#6a5a48;">Нет отправленных приглашений.</p>';
        } else {
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
// 2.1 ВКЛАДКА «ОТРЯДЫ» — ВСЕ ОТРЯДЫ ДОМА
// ============================================================

function showSquadsTab(houseId) {
    if (!window.getSquads) return '<p style="color:#c96a5a;">❌ Система отрядов не загружена.</p>';
    
    var squads = window.getSquads(houseId);
    var squadList = [];
    for (var name in squads) squadList.push({ name: name, squad: squads[name] });
    
    var html = '<div class="modal-section"><h4>👑 ОТРЯДЫ ДОМА</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Все отряды дома и их структура.</p>';
    
    if (squadList.length === 0) {
        html += '<p style="color:#6a5a48;">Нет созданных отрядов.</p>';
    } else {
        squadList.forEach(function(item) {
            var s = item.squad;
            var totalUnits = s.units.length;
            var totalCaptains = Object.keys(s.captains).length;
            var totalSergeants = 0;
            for (var capName in s.captains) {
                totalUnits += s.captains[capName].units.length;
                totalSergeants += Object.keys(s.captains[capName].sergeants || {}).length;
                for (var sgtName in s.captains[capName].sergeants) {
                    totalUnits += s.captains[capName].sergeants[sgtName].units.length;
                }
            }
            
            var locationName = s.location === 'castle' ? '🏰 Замок' : (WORLD_AREAS[s.location] ? WORLD_AREAS[s.location].name : s.location);
            
            html += '<div style="background:#120e0b;border:1px solid #2a201a;border-radius:10px;padding:12px;margin:6px 0;">';
            html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
            html += '<div>';
            html += '<strong style="color:#c9b694;font-size:16px;">👑 ' + item.name + '</strong>';
            html += '<br><span style="color:#6a5a48;font-size:11px;">📍 ' + locationName + '</span>';
            html += '<br><span style="color:#6a5a48;font-size:11px;">👥 ' + totalUnits + ' юнитов | 🗡️ ' + totalCaptains + ' капитанов | 🛡️ ' + totalSergeants + ' сержантов</span>';
            html += '</div>';
            html += '<div>';
            html += '<button class="btn btn-small" onclick="showSquadDetails(\'' + item.name + '\')">📋 Состав</button>';
            html += '</div>';
            html += '</div></div>';
        });
    }
    
    // Кнопка создать отряд (только для лорда/наследника/мастера войны)
    var user = users[currentUser];
    if (user && ['lord','heir','war_master'].indexOf(user.game.houseRank) !== -1) {
        html += '<button class="btn" onclick="createSquadDialog()" style="margin-top:10px;">👑 Создать отряд</button>';
    }
    
    html += '</div>';
    return html;
}

function showSquadDetails(commanderName) {
    var user = users[currentUser];
    if (!user || !user.game.house) return;
    var houseId = user.game.house;
    var squads = window.getSquads(houseId);
    var squad = squads[commanderName];
    if (!squad) { setMessage('❌ Отряд не найден.'); return; }
    
    var modal = document.getElementById('modal-squad-details');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-squad-details'; overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeSquadDetails(); };
        overlay.innerHTML = '<div class="modal-box" style="max-height:90vh;overflow-y:auto;"><div class="modal-header"><h3>📋 СОСТАВ ОТРЯДА</h3><button class="close-btn" onclick="closeSquadDetails()">✕</button></div><div id="modal-squad-details-content"></div></div>';
        document.body.appendChild(overlay); modal = overlay;
    }
    
    var content = document.getElementById('modal-squad-details-content');
    var html = '<div class="modal-section"><h4>👑 Отряд командора ' + commanderName + '</h4>';
    html += '<p style="color:#6a5a48;">📍 ' + (squad.location === 'castle' ? '🏰 Замок' : getZoneName(squad.location)) + '</p>';
    
    // Юниты непосредственно у командора
    html += '<h5>⭐ Командор — ' + squad.units.length + ' юнитов</h5>';
    if (squad.units.length > 0) {
        html += showUnitGroup(squad.units);
    } else {
        html += '<p style="color:#6a5a48;font-size:11px;">Нет юнитов.</p>';
    }
    
    // Капитаны
    for (var capName in squad.captains) {
        var cap = squad.captains[capName];
        html += '<h5 style="margin-top:10px;">🗡️ Капитан ' + capName + ' — ' + cap.units.length + ' юнитов</h5>';
        if (cap.units.length > 0) {
            html += showUnitGroup(cap.units);
        }
        
        // Сержанты капитана
        for (var sgtName in cap.sergeants) {
            var sgt = cap.sergeants[sgtName];
            html += '<h5 style="margin-top:6px;padding-left:10px;">🛡️ Сержант ' + sgtName + ' — ' + sgt.units.length + ' юнитов</h5>';
            if (sgt.units.length > 0) {
                html += '<div style="padding-left:20px;">' + showUnitGroup(sgt.units) + '</div>';
            }
        }
    }
    
    html += '</div>';
    html += '<button class="btn btn-secondary" onclick="closeSquadDetails()">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function showUnitGroup(units) {
    var grouped = {};
    units.forEach(function(u) {
        var t = u.type;
        if (!grouped[t]) grouped[t] = 0;
        grouped[t]++;
    });
    
    var html = '';
    for (var t in grouped) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[t] : null;
        var name = ut ? ut.emoji + ' ' + ut.name : t;
        html += '<div style="font-size:11px;color:#b8a890;">' + name + ' ×' + grouped[t] + '</div>';
    }
    return html;
}

function closeSquadDetails() {
    var m = document.getElementById('modal-squad-details');
    if (m) m.classList.add('hide');
}

function createSquadDialog() {
    var user = users[currentUser];
    if (!user || !user.game.house) return;
    var houseId = user.game.house;
    
    // Находим рыцарей-командоров без отряда
    var availableCommanders = [];
    for (var name in users) {
        if (users[name].game.house === houseId && users[name].game.houseRank === 'knight_commander') {
            var squads = window.getSquads(houseId);
            if (!squads[name]) availableCommanders.push(name);
        }
    }
    
    if (availableCommanders.length === 0) {
        setMessage('❌ Нет доступных рыцарей-командоров. Назначьте кого-нибудь на эту роль.');
        return;
    }
    
    var msg = 'Выберите командора для отряда:\n';
    availableCommanders.forEach(function(name, i) {
        msg += (i + 1) + '. ' + name + '\n';
    });
    msg += '0. Отмена';
    
    var choice = prompt(msg);
    if (!choice || choice === '0') { setMessage('❌ Отменено.'); return; }
    var index = parseInt(choice) - 1;
    if (isNaN(index) || index < 0 || index >= availableCommanders.length) {
        setMessage('❌ Неверный выбор.');
        return;
    }
    
    window.createSquad(availableCommanders[index]);
    showHouseTab('squads');
}

// ============================================================
// 2.2 ВКЛАДКА «МОЙ ОТРЯД»
// ============================================================

function showMySquadTab(houseId) {
    if (!window.getMySquad) return '<p style="color:#c96a5a;">❌ Система отрядов не загружена.</p>';
    
    var mySquad = window.getMySquad();
    var html = '<div class="modal-section"><h4>🎯 МОЙ ОТРЯД</h4>';
    
    if (!mySquad) {
        html += '<p style="color:#6a5a48;">Вы не состоите в отряде.</p>';
        
        // Проверяем, покидал ли игрок отряд
        var user = users[currentUser];
        if (user && user.game._leftSquad) {
            var data = user.game._leftSquad;
            html += '<div style="background:#2a201a;border:1px solid #ffd700;border-radius:10px;padding:10px;margin:10px 0;">';
            html += '<p style="color:#ffd700;">📌 Вы покинули отряд ' + data.commanderName + '</p>';
            html += '<button class="btn btn-small" onclick="window.rejoinSquad(); showHouseTab(\'my_squad\');">✅ Вернуться в отряд</button>';
            html += '</div>';
        }
    } else {
        var s = mySquad.squad;
        var locationName = s.location === 'castle' ? '🏰 Замок' : (WORLD_AREAS[s.location] ? WORLD_AREAS[s.location].name : s.location);
        
        html += '<div style="background:#120e0b;border:1px solid #3d3026;border-radius:10px;padding:12px;margin:6px 0;">';
        html += '<p><strong style="color:#c9b694;">👑 Командор:</strong> ' + mySquad.commanderName + '</p>';
        html += '<p><strong style="color:#c9b694;">🎯 Ваша роль:</strong> ' + (mySquad.role === 'commander' ? 'Командор' : mySquad.role === 'captain' ? 'Капитан' : 'Сержант') + '</p>';
        html += '<p><strong style="color:#c9b694;">📍 Локация:</strong> ' + locationName + '</p>';
        html += '</div>';
        
        // Если командор — показываем структуру
        if (mySquad.role === 'commander') {
            html += '<h5>⭐ Ваши юниты: ' + s.units.length + '</h5>';
            if (s.units.length > 0) html += showUnitGroup(s.units);
            else html += '<p style="color:#6a5a48;font-size:11px;">Нет юнитов.</p>';
            
            // Кнопки управления
            html += '<div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;">';
            html += '<button class="btn btn-small" onclick="commanderAssignDialog()">🗡️ Передать капитану</button>';
            html += '<button class="btn btn-small" onclick="commanderRecallDialog()">📥 Вернуть от капитана</button>';
            html += '</div>';
            
            // Капитаны
            for (var capName in s.captains) {
                var cap = s.captains[capName];
                html += '<h5 style="margin-top:10px;">🗡️ Капитан ' + capName + ' — ' + cap.units.length + ' юнитов</h5>';
                if (cap.units.length > 0) html += showUnitGroup(cap.units);
                
                for (var sgtName in cap.sergeants) {
                    var sgt = cap.sergeants[sgtName];
                    html += '<div style="padding-left:10px;font-size:11px;color:#b8a890;">🛡️ ' + sgtName + ' — ' + sgt.units.length + ' юнитов</div>';
                }
            }
        }
        
        // Если капитан — показываем своих юнитов и сержантов
        if (mySquad.role === 'captain') {
            var cap = s.captains[mySquad.captainName];
            if (cap) {
                html += '<h5>🗡️ Ваши юниты: ' + cap.units.length + '</h5>';
                if (cap.units.length > 0) html += showUnitGroup(cap.units);
                else html += '<p style="color:#6a5a48;font-size:11px;">Нет юнитов.</p>';
                
                html += '<div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;">';
                html += '<button class="btn btn-small" onclick="captainAssignDialog()">🛡️ Передать сержанту</button>';
                html += '<button class="btn btn-small" onclick="captainRecallDialog()">📥 Вернуть от сержанта</button>';
                html += '</div>';
                
                for (var sgtName in cap.sergeants) {
                    var sgt = cap.sergeants[sgtName];
                    html += '<div style="margin-top:6px;font-size:11px;color:#b8a890;">🛡️ Сержант ' + sgtName + ' — ' + sgt.units.length + ' юнитов</div>';
                }
            }
        }
        
        // Если сержант
        if (mySquad.role === 'sergeant') {
            var cap = s.captains[mySquad.captainName];
            if (cap && cap.sergeants[mySquad.sergeantName]) {
                var sgt = cap.sergeants[mySquad.sergeantName];
                html += '<h5>🛡️ Ваши юниты: ' + sgt.units.length + '</h5>';
                if (sgt.units.length > 0) html += showUnitGroup(sgt.units);
                else html += '<p style="color:#6a5a48;font-size:11px;">Нет юнитов.</p>';
            }
        }
    }
    
    html += '</div>';
    return html;
}

// ============================================================
// 2.3 ВКЛАДКА «ГАРНИЗОН» — ВСЕ ВОЙСКА С КООРДИНАТАМИ
// ============================================================

function showGarrisonTab(houseId) {
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [], marching: [] };
    
    var html = '<div class="modal-section"><h4>📍 ГАРНИЗОН — ВСЕ ВОЙСКА</h4>';
    html += '<p style="color:#6a5a48;font-size:11px;">Расположение всех отрядов и войск дома.</p>';
    
    // Собираем по локациям
    var byLocation = {};
    var totalAll = 0;
    
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (garrison[cat]) {
            garrison[cat].forEach(function(u) {
                totalAll++;
                var loc = u.location || 'castle';
                var locName = loc === 'castle' ? '🏰 Замок' : getZoneName(loc);
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
            if (data.infantry > 0) parts.push('🗡️ Пехота: ' + data.infantry);
            if (data.cavalry > 0) parts.push('🐴 Конница: ' + data.cavalry);
            if (data.siege > 0) parts.push('🏗️ Осадные: ' + data.siege);
            if (data.scouts > 0) parts.push('👁️ Разведчики: ' + data.scouts);
            html += '<div style="font-size:11px;color:#b8a890;">' + parts.join(' | ') + '</div>';
            
            // Отряды в этой локации
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
    
    // Марширующие
    if (garrison.marching && garrison.marching.length > 0) {
        html += '<div class="modal-section"><h4>🚶 В ПУТИ</h4>';
        garrison.marching.forEach(function(m) {
            var fromName = m.path && m.path[0] ? getZoneName(m.path[0]) : '?';
            var toName = m.path && m.path[m.path.length-1] ? getZoneName(m.path[m.path.length-1]) : '?';
            var timeLeft = Math.max(0, Math.ceil((m.nextPhaseTime - Date.now()) / 60000));
            var isSquad = m.isSquad || m.squadId;
            
            html += '<div style="font-size:11px;color:#b8a890;padding:4px 0;border-bottom:1px solid #1a1410;">';
            html += (isSquad ? '👑 ' : '🟢 ') + fromName + ' → ' + toName;
            html += ' | ' + m.units.length + ' юнитов';
            html += ' | ⏱️ ~' + timeLeft + ' мин';
            html += '</div>';
        });
        html += '</div>';
    }
    
    html += '</div>';
    return html;
}

function getZoneName(zoneId) {
    var z = WORLD_AREAS[zoneId];
    return z ? z.name : zoneId;
}

// ============================================================
// 2.5 ДИАЛОГИ КОМАНДОРА И КАПИТАНА
// ============================================================

function commanderAssignDialog() {
    var user = users[currentUser];
    if (!user || !user.game.house) return;
    var houseId = user.game.house;
    var mySquad = window.getMySquad();
    if (!mySquad || mySquad.role !== 'commander') { setMessage('❌ Вы не командор.'); return; }
    
    // Ищем капитанов в доме без отряда
    var availableCaptains = [];
    for (var name in users) {
        if (users[name].game.house === houseId && users[name].game.houseRank === 'captain_officer' && name !== currentUser) {
            // Проверяем, не состоит ли уже в этом отряде
            if (!mySquad.squad.captains[name]) availableCaptains.push(name);
        }
    }
    
    if (availableCaptains.length === 0) {
        setMessage('❌ Нет доступных капитанов.');
        return;
    }
    
    var msg = 'Выберите капитана:\n';
    availableCaptains.forEach(function(name, i) { msg += (i+1) + '. ' + name + '\n'; });
    msg += '0. Отмена';
    
    var choice = prompt(msg);
    if (!choice || choice === '0') return;
    var index = parseInt(choice) - 1;
    if (isNaN(index) || index < 0 || index >= availableCaptains.length) { setMessage('❌ Отменено.'); return; }
    
    var captainName = availableCaptains[index];
    
    // Сколько юнитов передать
    var countStr = prompt('Сколько юнитов передать капитану ' + captainName + '?\nУ вас: ' + mySquad.squad.units.length + ' юнитов.');
    var count = parseInt(countStr);
    if (isNaN(count) || count <= 0 || count > mySquad.squad.units.length) { setMessage('❌ Неверное количество.'); return; }
    
    // Группируем по типам
    var unitTypes = {};
    var taken = 0;
    for (var i = 0; i < mySquad.squad.units.length && taken < count; i++) {
        var t = mySquad.squad.units[i].type;
        if (!unitTypes[t]) unitTypes[t] = 0;
        unitTypes[t]++;
        taken++;
    }
    
    window.commanderAssignToCaptain(captainName, unitTypes);
    showHouseTab('my_squad');
}

function commanderRecallDialog() {
    var user = users[currentUser];
    if (!user || !user.game.house) return;
    var mySquad = window.getMySquad();
    if (!mySquad || mySquad.role !== 'commander') { setMessage('❌ Вы не командор.'); return; }
    
    var captainNames = Object.keys(mySquad.squad.captains);
    if (captainNames.length === 0) { setMessage('❌ Нет капитанов в отряде.'); return; }
    
    var msg = 'Выберите капитана для возврата юнитов:\n';
    captainNames.forEach(function(name, i) {
        msg += (i+1) + '. ' + name + ' (' + mySquad.squad.captains[name].units.length + ' юнитов)\n';
    });
    msg += '0. Отмена';
    
    var choice = prompt(msg);
    if (!choice || choice === '0') return;
    var index = parseInt(choice) - 1;
    if (isNaN(index) || index < 0 || index >= captainNames.length) { setMessage('❌ Отменено.'); return; }
    
    var captainName = captainNames[index];
    var capUnits = mySquad.squad.captains[captainName].units.length;
    var countStr = prompt('Сколько юнитов вернуть? (0 = всех, макс: ' + capUnits + ')');
    var count = parseInt(countStr);
    
    if (countStr === '0' || count === 0) {
        window.recallUnitsFromCaptain(captainName, {});
    } else if (!isNaN(count) && count > 0 && count <= capUnits) {
        var unitTypes = {};
        var taken = 0;
        for (var i = 0; i < mySquad.squad.captains[captainName].units.length && taken < count; i++) {
            var t = mySquad.squad.captains[captainName].units[i].type;
            if (!unitTypes[t]) unitTypes[t] = 0;
            unitTypes[t]++;
            taken++;
        }
        window.recallUnitsFromCaptain(captainName, unitTypes);
    } else {
        setMessage('❌ Неверное количество.');
        return;
    }
    
    showHouseTab('my_squad');
}

function captainAssignDialog() {
    var user = users[currentUser];
    if (!user || !user.game.house) return;
    var houseId = user.game.house;
    var mySquad = window.getMySquad();
    if (!mySquad || mySquad.role !== 'captain') { setMessage('❌ Вы не капитан.'); return; }
    
    var availableSergeants = [];
    for (var name in users) {
        if (users[name].game.house === houseId && users[name].game.houseRank === 'sergeant' && name !== currentUser) {
            var cap = mySquad.squad.captains[mySquad.captainName];
            if (!cap.sergeants[name]) availableSergeants.push(name);
        }
    }
    
    if (availableSergeants.length === 0) { setMessage('❌ Нет доступных сержантов.'); return; }
    
    var msg = 'Выберите сержанта:\n';
    availableSergeants.forEach(function(name, i) { msg += (i+1) + '. ' + name + '\n'; });
    msg += '0. Отмена';
    
    var choice = prompt(msg);
    if (!choice || choice === '0') return;
    var index = parseInt(choice) - 1;
    if (isNaN(index) || index < 0 || index >= availableSergeants.length) { setMessage('❌ Отменено.'); return; }
    
    var sergeantName = availableSergeants[index];
    var cap = mySquad.squad.captains[mySquad.captainName];
    
    var countStr = prompt('Сколько юнитов передать сержанту ' + sergeantName + '?\nУ вас: ' + cap.units.length + ' юнитов.');
    var count = parseInt(countStr);
    if (isNaN(count) || count <= 0 || count > cap.units.length) { setMessage('❌ Неверное количество.'); return; }
    
    var unitTypes = {};
    var taken = 0;
    for (var i = 0; i < cap.units.length && taken < count; i++) {
        var t = cap.units[i].type;
        if (!unitTypes[t]) unitTypes[t] = 0;
        unitTypes[t]++;
        taken++;
    }
    
    window.captainAssignToSergeant(sergeantName, unitTypes);
    showHouseTab('my_squad');
}

function captainRecallDialog() {
    var user = users[currentUser];
    if (!user || !user.game.house) return;
    var mySquad = window.getMySquad();
    if (!mySquad || mySquad.role !== 'captain') { setMessage('❌ Вы не капитан.'); return; }
    
    var cap = mySquad.squad.captains[mySquad.captainName];
    var sgtNames = Object.keys(cap.sergeants);
    if (sgtNames.length === 0) { setMessage('❌ Нет сержантов.'); return; }
    
    var msg = 'Выберите сержанта для возврата юнитов:\n';
    sgtNames.forEach(function(name, i) {
        msg += (i+1) + '. ' + name + ' (' + cap.sergeants[name].units.length + ' юнитов)\n';
    });
    msg += '0. Отмена';
    
    var choice = prompt(msg);
    if (!choice || choice === '0') return;
    var index = parseInt(choice) - 1;
    if (isNaN(index) || index < 0 || index >= sgtNames.length) { setMessage('❌ Отменено.'); return; }
    
    var sgtName = sgtNames[index];
    var sgtUnits = cap.sergeants[sgtName].units.length;
    var countStr = prompt('Сколько юнитов вернуть? (0 = всех, макс: ' + sgtUnits + ')');
    var count = parseInt(countStr);
    
    if (countStr === '0' || count === 0) {
        window.captainRecallFromSergeant(sgtName, {});
    } else if (!isNaN(count) && count > 0 && count <= sgtUnits) {
        var unitTypes = {};
        var taken = 0;
        for (var i = 0; i < cap.sergeants[sgtName].units.length && taken < count; i++) {
            var t = cap.sergeants[sgtName].units[i].type;
            if (!unitTypes[t]) unitTypes[t] = 0;
            unitTypes[t]++;
            taken++;
        }
        window.captainRecallFromSergeant(sgtName, unitTypes);
    } else {
        setMessage('❌ Неверное количество.');
        return;
    }
    
    showHouseTab('my_squad');
}

// ============================================================
// 2.6 ПОД-ВКЛАДКИ АРМИИ
// ============================================================

window.showArmySubTab = function(subTab) {
    var container = document.getElementById('army-sub-tab-content');
    if (!container) return;
    var user = users[currentUser];
    var g = user.game;
    var houseId = g.house;
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [], marching: [] };
    var html = '';
    
    if (subTab === 'total') {
        html += '<div class="modal-section"><h4>⚔️ ОБЩАЯ АРМИЯ</h4>';
        
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
        
        if (totalCount === 0) {
            html += '<p style="color:#6a5a48;">Нет войск.</p>';
        } else {
            html += '<p style="color:#6a5a48;">Всего: ' + totalCount + ' юнитов</p>';
            
            html += '<h5>🗡️ Пехота</h5>';
            var hasInfantry = false;
            for (var k in allGrouped) {
                var ut = window.UNIT_TYPES ? window.UNIT_TYPES[k] : null;
                if (ut && !ut.horse && !ut.siege && k !== 'scout') {
                    hasInfantry = true;
                    html += '<div class="row"><span class="label">' + ut.emoji + ' ' + ut.name + '</span><span class="value">×' + allGrouped[k] + '</span></div>';
                }
            }
            if (!hasInfantry) html += '<p style="color:#6a5a48;">Нет пехоты.</p>';
            
            html += '<h5 style="margin-top:10px;">🐴 Конница</h5>';
            var hasCavalry = false;
            for (var k in allGrouped) {
                var ut = window.UNIT_TYPES ? window.UNIT_TYPES[k] : null;
                if (ut && ut.horse) {
                    hasCavalry = true;
                    html += '<div class="row"><span class="label">' + ut.emoji + ' ' + ut.name + '</span><span class="value">×' + allGrouped[k] + '</span></div>';
                }
            }
            if (!hasCavalry) html += '<p style="color:#6a5a48;">Нет конницы.</p>';
            
            html += '<h5 style="margin-top:10px;">🏗️ Осадные орудия</h5>';
            var hasSiege = false;
            for (var k in allGrouped) {
                var ut = window.UNIT_TYPES ? window.UNIT_TYPES[k] : null;
                if (ut && ut.siege && k !== 'scout') {
                    hasSiege = true;
                    html += '<div class="row"><span class="label">' + ut.emoji + ' ' + ut.name + '</span><span class="value">×' + allGrouped[k] + '</span></div>';
                }
            }
            if (!hasSiege) html += '<p style="color:#6a5a48;">Нет осадных орудий.</p>';
            
            if (allGrouped['scout']) {
                html += '<h5 style="margin-top:10px;">👁️ Разведчики</h5>';
                html += '<div class="row"><span class="label">👁️ Разведчики</span><span class="value">×' + allGrouped['scout'] + '</span></div>';
            }
        }
        html += '</div>';
    }
    
    if (subTab === 'garrison') {
        html += '<div class="modal-section"><h4>📍 ГАРНИЗОНЫ</h4>';
        var byZone = {};
        var totalGarrison = 0;
        
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (garrison[cat]) {
                garrison[cat].forEach(function(u) {
                    var zid = u.location || 'castle';
                    if (!byZone[zid]) byZone[zid] = { units: {}, scouts: 0, total: 0 };
                    totalGarrison++;
                    if (u.isScout) {
                        byZone[zid].scouts++;
                    } else {
                        var k = u.type;
                        if (!byZone[zid].units[k]) byZone[zid].units[k] = 0;
                        byZone[zid].units[k]++;
                    }
                    byZone[zid].total++;
                });
            }
        });
        
        if (totalGarrison === 0) {
            html += '<p style="color:#6a5a48;">Нет гарнизонов.</p>';
        } else {
            html += '<p style="color:#6a5a48;">Всего в гарнизонах: ' + totalGarrison + ' юнитов</p>';
            
            for (var zid in byZone) {
                var zd = byZone[zid];
                var zoneName = zid === 'castle' ? '🏰 Замок' : getZoneName(zid);
                html += '<div style="background:#120e0b;border:1px solid #2a201a;border-radius:10px;padding:10px;margin:6px 0;">';
                html += '<h5 style="color:#c9b694;">📍 ' + zoneName + ' (' + zd.total + ' юнитов)</h5>';
                
                for (var k in zd.units) {
                    var ut = window.UNIT_TYPES ? window.UNIT_TYPES[k] : null;
                    html += '<div class="row"><span class="label">' + (ut ? ut.emoji + ' ' + ut.name : k) + '</span><span class="value">×' + zd.units[k] + '</span></div>';
                }
                if (zd.scouts > 0) {
                    html += '<div class="row"><span class="label">👁️ Разведчики</span><span class="value">×' + zd.scouts + '</span></div>';
                }
                html += '</div>';
            }
        }
        html += '</div>';
    }
    
    if (subTab === 'marching') {
        html += '<div class="modal-section"><h4>🚶 АРМИИ В ПУТИ</h4>';
        var marching = garrison.marching || [];
        
        if (marching.length === 0) {
            html += '<p style="color:#6a5a48;">Нет армий в пути.</p>';
        } else {
            html += '<p style="color:#6a5a48;">Марширующих отрядов: ' + marching.length + '</p>';
            
            marching.forEach(function(m, i) {
                var fromZoneName = '?';
                var toZoneName = '?';
                var currentZoneName = '?';
                var totalUnits = m.units ? m.units.length : 0;
                var timeLeft = 0;
                var progress = '';
                
                if (m.path) {
                    var currentZoneId = m.path[m.currentStep] || m.path[0];
                    fromZoneName = getZoneName(m.path[0]);
                    toZoneName = getZoneName(m.path[m.path.length - 1]);
                    currentZoneName = getZoneName(currentZoneId);
                    timeLeft = Math.max(0, Math.ceil((m.nextMoveTime - Date.now()) / 60000));
                    progress = 'Шаг ' + (m.currentStep + 1) + '/' + (m.path.length - 1);
                }
                
                var emoji = m.isSquad ? '👑' : '🟢';
                if (m.isScout) emoji = '👁️';
                
                html += '<div style="background:#120e0b;border:1px solid #2a201a;border-radius:10px;padding:10px;margin:6px 0;">';
                html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
                html += '<div>';
                html += '<span style="font-size:16px;">' + emoji + '</span> ';
                html += '<strong style="color:#c9b694;">' + fromZoneName + ' → ' + toZoneName + '</strong>';
                html += '<br><span style="font-size:11px;color:#6a5a48;">📍 ' + currentZoneName + ' | ⏱️ ~' + timeLeft + ' мин | ' + progress + '</span>';
                html += '<br><span style="font-size:11px;color:#6a5a48;">👥 ' + totalUnits + ' юнитов</span>';
                html += '</div>';
                html += '</div></div>';
            });
        }
        html += '</div>';
    }
    
    container.innerHTML = html;
};

// ============================================================
// 2.7 ДЕТАЛИ МАРША
// ============================================================

window.showMarchDetails = function(index) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [], marching: [] };
    var marching = garrison.marching || [];
    
    if (index >= marching.length) { setMessage('❌ Отряд не найден.'); return; }
    
    var m = marching[index];
    var units = m.units || [];
    
    var modal = document.getElementById('modal-march-details');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-march-details'; overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeMarchDetails(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📋 СОСТАВ ОТРЯДА</h3><button class="close-btn" onclick="closeMarchDetails()">✕</button></div><div id="modal-march-details-content"></div></div>';
        document.body.appendChild(overlay); modal = overlay;
    }
    
    var content = document.getElementById('modal-march-details-content');
    var html = '<div class="modal-section"><h4>📋 СОСТАВ ОТРЯДА</h4>';
    html += '<p style="color:#6a5a48;">Всего: ' + units.length + ' юнитов</p>';
    
    var grouped = {};
    units.forEach(function(u) { var k = u.type; if (!grouped[k]) grouped[k] = 0; grouped[k]++; });
    for (var k in grouped) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[k] : null;
        html += '<div class="row"><span class="label">' + (ut ? ut.emoji + ' ' + ut.name : k) + '</span><span class="value">×' + grouped[k] + '</span></div>';
    }
    
    html += '</div><button class="btn btn-secondary" onclick="closeMarchDetails()">Закрыть</button>';
    content.innerHTML = html; modal.classList.remove('hide');
};

window.closeMarchDetails = function() {
    var m = document.getElementById('modal-march-details');
    if (m) m.classList.add('hide');
};

// ============================================================
// 3. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
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

function getHouseChronicle(houseId) {
    return houseLogs[houseId] || [];
}

// ============================================================
// 4. ПРИГЛАШЕНИЯ
// ============================================================

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
    addHouseLog(houseId, '📨 Приглашение отправлено игроку ' + name);
    setMessage('✅ Приглашение отправлено игроку ' + name + '.');
    showHouseTab('sent');
}

function cancelInvite(playerName) {
    var user = users[currentUser];
    var houseId = user.game.house;
    if (!invitations[playerName]) return;
    invitations[playerName] = invitations[playerName].filter(function(inv) { return inv.houseId !== houseId; });
    if (invitations[playerName].length === 0) delete invitations[playerName];
    saveInvitations();
    addHouseLog(houseId, '❌ Приглашение для ' + playerName + ' отменено');
    setMessage('❌ Приглашение для ' + playerName + ' отменено.');
    showHouseTab('sent');
}

function acceptInvite(houseId) {
    var user = users[currentUser];
    user.game.house = houseId;
    
    var hasLord = false;
    for (var name in users) {
        if (name !== currentUser && users[name].game.house === houseId && users[name].game.houseRank === 'lord') {
            hasLord = true; break;
        }
    }
    
    var rank = hasLord ? 'knight' : 'lord';
    user.game.houseRank = rank;
    
    invitations[currentUser] = (invitations[currentUser] || []).filter(function(inv) { return inv.houseId !== houseId; });
    if (invitations[currentUser].length === 0) delete invitations[currentUser];
    saveInvitations();
    saveData();
    addHouseLog(houseId, '👤 ' + currentUser + ' вступил в дом как ' + (HOUSE_RANKS[rank] ? HOUSE_RANKS[rank].name : rank));
    setMessage('✅ Вы вступили в дом ' + (HOUSES[houseId] ? HOUSES[houseId].name : houseId) + '!');
    closeHouses();
    openMyHouse();
}

function declineInvite(houseId) {
    invitations[currentUser] = (invitations[currentUser] || []).filter(function(inv) { return inv.houseId !== houseId; });
    if (invitations[currentUser].length === 0) delete invitations[currentUser];
    saveInvitations();
    addHouseLog(houseId, '❌ ' + currentUser + ' отклонил приглашение');
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
    closeHouses();
    openMyHouse();
}

// ============================================================
// 5. НАЗНАЧЕНИЕ РОЛЕЙ
// ============================================================

function assignRank(playerName) {
    var user = users[currentUser];
    var myRank = user.game.houseRank;
    if (!myRank || !HOUSE_RANKS[myRank]) { setMessage('❌ У вас нет прав.'); return; }
    var canAssign = HOUSE_RANKS[myRank].canAssign;
    
    var options = [];
    canAssign.forEach(function(rank) {
        if (RANK_LIMITS[rank] && RANK_LIMITS[rank] > 0) {
            var count = 0;
            for (var name in users) {
                if (users[name].game.house === user.game.house && users[name].game.houseRank === rank) count++;
            }
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
    var html = '<div class="modal-section"><h4>👤 ' + playerName + '</h4><p style="color:#6a5a48;">Выберите новую роль:</p></div>';
    html += '<div class="modal-section">';
    
    options.forEach(function(rank) {
        var rankInfo = HOUSE_RANKS[rank];
        html += '<div class="row" style="padding:8px 0; border-bottom:1px solid #1a1410;">';
        html += '<span class="label"><strong>' + rankInfo.name + '</strong><br><span style="font-size:11px;color:#6a5a48;">' + rankInfo.description + '</span></span>';
        html += '<span class="value"><button class="btn btn-small" onclick="confirmAssignRank(\'' + playerName + '\',\'' + rank + '\')">✅ Выбрать</button></span>';
        html += '</div>';
    });
    
    html += '</div><button class="btn btn-secondary" onclick="closeRankModal()">Закрыть</button>';
    content.innerHTML = html; modal.classList.remove('hide');
}

function confirmAssignRank(playerName, newRank) {
    var user = users[currentUser];
    var target = users[playerName];
    if (!target || target.game.house !== user.game.house) { setMessage('❌ Игрок не в вашем доме.'); closeRankModal(); return; }
    
    if (newRank === 'lord') {
        for (var name in users) {
            if (users[name].game.house === user.game.house && users[name].game.houseRank === 'lord') {
                users[name].game.houseRank = 'heir';
            }
        }
        user.game.houseRank = 'heir';
    }
    
    target.game.houseRank = newRank;
    saveData();
    addHouseLog(user.game.house, '📋 ' + playerName + ' назначен: ' + HOUSE_RANKS[newRank].name);
    setMessage('✅ ' + playerName + ' назначен: ' + HOUSE_RANKS[newRank].name);
    closeRankModal();
    showHouseTab('members');
}

function closeRankModal() {
    var modal = document.getElementById('modal-rank');
    if (modal) modal.classList.add('hide');
}

// ============================================================
// 6. СОХРАНЕНИЕ ПРИГЛАШЕНИЙ
// ============================================================

function loadInvitations() {
    try { var raw = localStorage.getItem('got_invitations'); if (raw) invitations = JSON.parse(raw); } catch(e) { invitations = {}; }
}

function saveInvitations() {
    localStorage.setItem('got_invitations', JSON.stringify(invitations));
}

// ============================================================
// 7. РЕГИСТРАЦИЯ
// ============================================================

window.openMyHouse = window.openMyHouse;
window.showHouseTab = window.showHouseTab;
window.showArmySubTab = showArmySubTab;
window.showMarchDetails = showMarchDetails;
window.closeMarchDetails = closeMarchDetails;
window.showSquadDetails = showSquadDetails;
window.closeSquadDetails = closeSquadDetails;
window.createSquadDialog = createSquadDialog;
window.invitePlayer = invitePlayer;
window.cancelInvite = cancelInvite;
window.acceptInvite = acceptInvite;
window.declineInvite = declineInvite;
window.leaveHouse = leaveHouse;
window.assignRank = assignRank;
window.confirmAssignRank = confirmAssignRank;
window.closeRankModal = closeRankModal;
window.commanderAssignDialog = commanderAssignDialog;
window.commanderRecallDialog = commanderRecallDialog;
window.captainAssignDialog = captainAssignDialog;
window.captainRecallDialog = captainRecallDialog;

loadInvitations();
console.log('🏰 Дипломатия + Мой дом + Роли + Армия + Отряды + Гарнизон загружены!');

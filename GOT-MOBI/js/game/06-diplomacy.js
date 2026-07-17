// ============================================================
// js/game/06-diplomacy.js — МОЙ ДОМ, ПРИГЛАШЕНИЯ, РОЛИ (С ЛЕТОПИСЬЮ)
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
    knight_commander: { name: '⭐ Рыцарь-командор', order: 9, description: 'Командует крылом.', canAssign: ['captain_officer','sergeant','knight'] },
    captain_officer: { name: '🗡️ Капитан', order: 10, description: 'Командует ротой.', canAssign: ['sergeant','knight'] },
    sergeant: { name: '🛡️ Сержант', order: 11, description: 'Командует отрядом.', canAssign: [] },
    knight: { name: '⚔️ Рыцарь', order: 12, description: 'Элитный воин.', canAssign: [] }
};

var RANK_LIMITS = {
    lord: 1, heir: 1, war_master: 1, castellan: 1, steward: 1,
    treasurer: 1, maester: 1, whisperer: 1,
    knight_commander: 2,
    captain_officer: -1, sergeant: -1, knight: -1
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
            
            html += '<div class="tabs">';
            html += '<button class="tab-btn active" onclick="showHouseTab(\'info\')">📜 Инфо</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'members\')">👥 Участники</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'lands\')">🏘️ Владения</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'treasury\')">💰 Казна</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'chronicle\')">📜 Летопись</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'invite\')">📨 Пригласить</button>';
            html += '<button class="tab-btn" onclick="showHouseTab(\'sent\')">📤 Отправленные</button>';
            html += '</div>';
            html += '<div id="house-tab-content"></div>';
            html += '<button class="btn btn-danger" onclick="leaveHouse()" style="margin-top:10px;">🚪 Покинуть дом</button>';
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
    
    if (tab === 'info') {
        html += '<div class="modal-section">';
        html += '<div class="row"><span class="label">📍 Регион</span><span class="value">' + (house.region || '—') + '</span></div>';
        html += '<div class="row"><span class="label">🏰 Замок</span><span class="value">' + (house.castle || 'Нет') + '</span></div>';
        html += '<div class="row"><span class="label">👑 Сюзерен</span><span class="value">' + (house.liege ? (HOUSES[house.liege] ? HOUSES[house.liege].name : house.liege) : 'Независимый') + '</span></div>';
        html += '<div class="row"><span class="label">🌟 Репутация</span><span class="value">' + (house.reputation || 0) + '%</span></div>';
        html += '<div class="row"><span class="label">🤝 Лояльность</span><span class="value">' + (house.loyalty || 0) + '%</span></div>';
        html += '<div class="row"><span class="label">⚔️ Армия</span><span class="value">🗡️' + (house.army.infantry || 0) + ' 🐴' + (house.army.cavalry || 0) + ' ⛵' + (house.army.ships || 0) + '</span></div>';
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
    
    if (tab === 'lands') {
        html += '<div class="modal-section"><h4>🏘️ ВЛАДЕНИЯ</h4>';
        var lands = getHouseLands(g.house);
        if (lands.length === 0) {
            html += '<p style="color:#6a5a48;">Нет владений.</p>';
        } else {
            lands.forEach(function(land) {
                html += '<div class="row" style="padding:4px 0; border-bottom:1px solid #1a1410;">';
                html += '<span class="label">📍 ' + land.name + '</span><span class="value">' + land.type + ' | ур.' + land.level + '</span>';
                html += '</div>';
            });
        }
        html += '<p style="color:#6a5a48;font-size:11px;">Захватывайте локации чтобы увеличить доход.</p>';
        html += '</div>';
    }
    
    if (tab === 'treasury') {
        html += '<div class="modal-section"><h4>💰 КАЗНА</h4>';
        html += '<div class="row"><span class="label">💰 Золото</span><span class="value">' + (house.treasury || 0) + '</span></div>';
        html += '<div class="row"><span class="label">📊 Доход в час</span><span class="value" style="color:#7ac98a;">+' + getHouseIncome(g.house) + ' зол.</span></div>';
        html += '<div class="row"><span class="label">📉 Расход в час</span><span class="value" style="color:#c96a5a;">-' + getHouseExpense(g.house) + ' зол.</span></div>';
        html += '<p style="color:#6a5a48;font-size:11px;">Доход зависит от владений и налогов. Расход — от армии и замка.</p>';
        html += '</div>';
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

function getHouseLands(houseId) {
    var lands = [];
    for (var id in KL_AREAS) {
        if (KL_AREAS[id].owner === houseId) {
            lands.push({ name: KL_AREAS[id].name, type: KL_AREAS[id].type, level: KL_AREAS[id].level });
        }
    }
    return lands;
}

function getHouseIncome(houseId) {
    var lands = getHouseLands(houseId);
    var income = 0;
    lands.forEach(function(land) { income += land.level * 2; });
    return income;
}

function getHouseExpense(houseId) {
    var house = HOUSES[houseId];
    if (!house) return 0;
    var troops = (house.army.infantry || 0) + (house.army.cavalry || 0) * 2 + (house.army.ships || 0) * 5;
    return Math.floor(troops / 10);
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
        if (users[name].game.house === houseId && users[name].game.houseRank === 'lord') { hasLord = true; break; }
    }
    var rank = hasLord ? 'knight' : 'lord';
    if (!hasLord) { user.game.houseRank = 'lord'; }
    else { user.game.houseRank = 'knight'; }
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
        overlay.id = 'modal-rank';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeRankModal(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📋 НАЗНАЧИТЬ РОЛЬ</h3><button class="close-btn" onclick="closeRankModal()">✕</button></div><div id="modal-rank-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
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
    content.innerHTML = html;
    modal.classList.remove('hide');
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
window.invitePlayer = invitePlayer;
window.cancelInvite = cancelInvite;
window.acceptInvite = acceptInvite;
window.declineInvite = declineInvite;
window.leaveHouse = leaveHouse;
window.assignRank = assignRank;
window.confirmAssignRank = confirmAssignRank;
window.closeRankModal = closeRankModal;

loadInvitations();
console.log('🏰 Дипломатия + Мой дом + Роли + Летопись загружены!');

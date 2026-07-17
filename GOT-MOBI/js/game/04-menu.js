// ============================================================
// js/game/04-menu.js — МЕНЮ, ДОМА, СТОЛИЦЫ, МОЙ ДОМ (ПОЛНЫЙ ФАЙЛ)
// ============================================================

// Иерархия званий
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

// Максимальное количество
var RANK_LIMITS = {
    lord: 1, heir: 1, war_master: 1, castellan: 1, steward: 1,
    treasurer: 1, maester: 1, whisperer: 1,
    knight_commander: 2,
    captain_officer: -1, // без лимита
    sergeant: -1, knight: -1
};

// Приглашения в дома
var invitations = {};

// ============================================================
// 1. ГЛАВНОЕ МЕНЮ
// ============================================================

function openMainMenu() {
    var modal = document.getElementById('modal-menu');
    var content = document.getElementById('modal-menu-content');
    
    var html = '<div class="modal-section">';
    html += '<button class="btn" style="margin:4px 0;" onclick="openMyHouse()">🏰 Мой дом</button>';
    html += '<button class="btn" style="margin:4px 0;" onclick="openHouses()">🏘️ Дома Вестероса</button>';
    html += '<button class="btn" style="margin:4px 0;background:#3d2e20;border-color:#8a7a5a;" onclick="openCapitals()">🏙️ Столицы регионов</button>';
    html += '<button class="btn" style="margin:4px 0;background:#2a1a12;border-color:#4a2a20;" onclick="showKingsLanding()">👑 Королевская Гавань</button>';
    html += '<button class="btn btn-secondary" style="margin-top:10px;" onclick="closeMenu()">Закрыть</button>';
    html += '</div>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeMenu() {
    var modal = document.getElementById('modal-menu');
    if (modal) modal.classList.add('hide');
}

// ============================================================
// 2. МОЙ ДОМ
// ============================================================

function openMyHouse() {
    var user = users[currentUser];
    var g = user.game;
    var modal = document.getElementById('modal-houses');
    var content = document.getElementById('modal-houses-content');
    var menuModal = document.getElementById('modal-menu');
    if (menuModal) menuModal.classList.add('hide');
    
    var html = '<div class="modal-section"><h4>🏰 МОЙ ДОМ</h4>';
    
    if (!g.house) {
        // Нет дома — только приглашения
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
        // Есть дом
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
            html += '<button class="tab-btn" onclick="showHouseTab(\'roles\')">📋 Роли</button>';
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
}

function showHouseTab(tab) {
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
            members.forEach(function(m) {
                var rankName = m.rank ? (HOUSE_RANKS[m.rank] ? HOUSE_RANKS[m.rank].name : m.rank) : 'Без звания';
                var isYou = m.name === currentUser;
                html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
                html += '<span class="label">👤 ' + m.name + (isYou ? ' (вы)' : '') + '</span>';
                html += '<span class="value">' + rankName;
                // Кнопка разжаловать
                if (!isYou && canManageMember(m.name)) {
                    html += ' <button class="btn btn-small" style="background:#3d2a1a;" onclick="demoteMember(\'' + m.name + '\')">⬇️</button>';
                }
                html += '</span></div>';
            });
        }
        html += '</div>';
    }
    
    if (tab === 'roles') {
        html += '<div class="modal-section"><h4>📋 НАЗНАЧИТЬ РОЛИ</h4>';
        if (!g.houseRank || !HOUSE_RANKS[g.houseRank] || HOUSE_RANKS[g.houseRank].canAssign.length === 0) {
            html += '<p style="color:#6a5a48;">У вас нет прав назначать на роли.</p>';
        } else {
            var members = getHouseMembers(g.house);
            var hasAny = false;
            members.forEach(function(m) {
                if (m.name === currentUser) return;
                hasAny = true;
                html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
                html += '<span class="label">👤 ' + m.name + ' (' + (m.rank ? (HOUSE_RANKS[m.rank] ? HOUSE_RANKS[m.rank].name : m.rank) : 'без звания') + ')</span>';
                html += '<span class="value"><button class="btn btn-small" onclick="assignRank(\'' + m.name + '\')">📋 Назначить</button></span>';
                html += '</div>';
            });
            if (!hasAny) html += '<p style="color:#6a5a48;">Нет других участников.</p>';
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
}

function getHouseMembers(houseId) {
    var members = [];
    for (var name in users) {
        if (users[name].game.house === houseId) {
            members.push({ name: name, rank: users[name].game.houseRank || null });
        }
    }
    // Сортировка по званию
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
    if (!targetRank || !HOUSE_RANKS[targetRank]) return true; // можно управлять без звания
    return HOUSE_RANKS[myRank].order < HOUSE_RANKS[targetRank].order;
}

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
    if (!hasLord) { user.game.houseRank = 'lord'; }
    else { user.game.houseRank = 'knight'; }
    invitations[currentUser] = (invitations[currentUser] || []).filter(function(inv) { return inv.houseId !== houseId; });
    if (invitations[currentUser].length === 0) delete invitations[currentUser];
    saveInvitations();
    saveData();
    setMessage('✅ Вы вступили в дом ' + (HOUSES[houseId] ? HOUSES[houseId].name : houseId) + '!');
    closeHouses();
    openMyHouse();
}

function declineInvite(houseId) {
    invitations[currentUser] = (invitations[currentUser] || []).filter(function(inv) { return inv.houseId !== houseId; });
    if (invitations[currentUser].length === 0) delete invitations[currentUser];
    saveInvitations();
    setMessage('❌ Вы отклонили приглашение.');
    openMyHouse();
}

function leaveHouse() {
    if (!confirm('Вы уверены, что хотите покинуть дом?')) return;
    var user = users[currentUser];
    user.game.house = null;
    user.game.houseRank = null;
    saveData();
    setMessage('🚪 Вы покинули дом.');
    closeHouses();
    openMyHouse();
}

function assignRank(playerName) {
    var user = users[currentUser];
    var myRank = user.game.houseRank;
    if (!myRank || !HOUSE_RANKS[myRank]) { setMessage('❌ У вас нет прав.'); return; }
    var canAssign = HOUSE_RANKS[myRank].canAssign;
    var msg = 'Выберите роль для ' + playerName + ':\n';
    var options = [];
    canAssign.forEach(function(rank) {
        if (RANK_LIMITS[rank] && RANK_LIMITS[rank] > 0) {
            var count = 0;
            for (var name in users) {
                if (users[name].game.house === user.game.house && users[name].game.houseRank === rank) count++;
            }
            if (count >= RANK_LIMITS[rank]) return;
        }
        msg += (options.length + 1) + '. ' + HOUSE_RANKS[rank].name + '\n';
        options.push(rank);
    });
    if (options.length === 0) { setMessage('❌ Нет доступных ролей для назначения.'); return; }
    msg += '0. Отмена';
    var choice = parseInt(prompt(msg));
    if (isNaN(choice) || choice < 1 || choice > options.length) { setMessage('❌ Отменено.'); return; }
    var target = users[playerName];
    if (!target || target.game.house !== user.game.house) { setMessage('❌ Игрок не в вашем доме.'); return; }
    // Если назначаем лордом — старый лорд теряет титул
    if (options[choice - 1] === 'lord') {
        for (var name in users) {
            if (users[name].game.house === user.game.house && users[name].game.houseRank === 'lord') {
                users[name].game.houseRank = 'knight';
            }
        }
        user.game.houseRank = 'heir'; // старый лорд становится наследником
    }
    target.game.houseRank = options[choice - 1];
    saveData();
    setMessage('✅ ' + playerName + ' назначен на роль ' + HOUSE_RANKS[options[choice - 1]].name + '.');
    showHouseTab('members');
}

function demoteMember(playerName) {
    if (!confirm('Разжаловать ' + playerName + ' до рыцаря?')) return;
    var target = users[playerName];
    if (!target) return;
    target.game.houseRank = 'knight';
    saveData();
    setMessage('⬇️ ' + playerName + ' разжалован до рыцаря.');
    showHouseTab('members');
}

// ============================================================
// СОХРАНЕНИЕ ПРИГЛАШЕНИЙ
// ============================================================

function loadInvitations() {
    try { var raw = localStorage.getItem('got_invitations'); if (raw) invitations = JSON.parse(raw); } catch(e) { invitations = {}; }
}

function saveInvitations() {
    localStorage.setItem('got_invitations', JSON.stringify(invitations));
}

// ============================================================
// 3. СТОЛИЦЫ РЕГИОНОВ
// ============================================================

var CAPITALS = {
    north: { id:'white_harbor', name:'Белая Гавань', region:'north', regionName:'❄️ Север', emoji:'🏙️', controller:null, description:'Крупнейший порт Севера. Центр торговли с Эссосом.' },
    westlands: { id:'lannisport', name:'Ланниспорт', region:'westlands', regionName:'🦁 Западные земли', emoji:'🏙️', controller:null, description:'Третий по величине город Вестероса. Порт и золото.' },
    reach: { id:'oldtown', name:'Старомест', region:'reach', regionName:'🌹 Простор', emoji:'🏙️', controller:null, description:'Второй по величине город. Цитадель мейстеров и торговля.' },
    riverlands: { id:'maidenpool', name:'Девичье озеро', region:'riverlands', regionName:'🐟 Речные земли', emoji:'🏙️', controller:null, description:'Город на перекрёстке речных путей. Рынок и торговля.' },
    stormlands: { id:'weeping_town', name:'Скорбящий Городок', region:'stormlands', regionName:'⛈️ Штормовые земли', emoji:'🏙️', controller:null, description:'Портовый город на Дорнийском море. Торговля с югом.' },
    dorne: { id:'sandy_shore', name:'Песчаный Берег', region:'dorne', regionName:'☀️ Дорн', emoji:'🏙️', controller:null, description:'Портовый город на юге Дорна. Торговля с Эссосом.' },
    vale: { id:'gulltown', name:'Чаячий город', region:'vale', regionName:'🦅 Долина', emoji:'🏙️', controller:null, description:'Крупнейший порт Долины. Торговля с Севером и Эссосом.' },
    iron_islands: { id:'lordsport', name:'Лордпорт', region:'iron_islands', regionName:'🐙 Железные острова', emoji:'🏙️', controller:null, description:'Крупнейший порт Железных островов на Пайке.' }
};

var KINGS_LANDING = {
    id:'kings_landing', name:'Королевская Гавань', emoji:'👑', controller:null,
    description:'Столица Семи Королевств. Железный Трон. Кто владеет Гаванью — тот правит Вестеросом.'
};

function openCapitals() {
    var modal = document.getElementById('modal-houses');
    var content = document.getElementById('modal-houses-content');
    var menuModal = document.getElementById('modal-menu');
    if (menuModal) menuModal.classList.add('hide');
    
    var html = '<div class="modal-section"><h4>🏙️ СТОЛИЦЫ РЕГИОНОВ</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Захват столицы делает дом Великим. Налог устанавливается владельцем (до 10% казны и ресурсов).</p>';
    html += '</div>';
    
    for (var key in CAPITALS) {
        var capital = CAPITALS[key];
        var controllerHouse = null;
        if (capital.controller) {
            for (var id in HOUSES) {
                if (HOUSES[id].id === capital.controller) { controllerHouse = HOUSES[id]; break; }
            }
        }
        
        html += '<div class="modal-section" style="border:1px solid #2a201a;border-radius:12px;padding:14px;margin:10px 0;background:#120e0b;">';
        html += '<span style="font-size:20px;">' + capital.emoji + '</span> ';
        html += '<strong style="color:#c9b694;font-size:16px;">' + capital.name + '</strong>';
        html += '<br><span style="color:#6a5a48;font-size:12px;">' + capital.regionName + '</span>';
        html += '<br><span style="color:#6a5a48;font-size:12px;">' + capital.description + '</span>';
        html += '<br><span style="color:#6a5a48;font-size:12px;">💰 Налог: устанавливается владельцем (до 10%)</span>';
        if (controllerHouse) {
            html += '<br><span style="color:#e74c3c;font-size:13px;">🏰 ' + controllerHouse.sigil + ' ' + controllerHouse.name + ' — ВЕЛИКИЙ ДОМ</span>';
        } else {
            html += '<br><span style="color:#7ac98a;font-size:13px;">⚔️ НЕЙТРАЛЬНА — свободна для захвата</span>';
        }
        html += '</div>';
    }
    
    html += '<button class="btn btn-secondary" onclick="openHouses()" style="margin-top:4px;">🏘️ К списку домов</button>';
    html += '<button class="btn btn-secondary" onclick="closeHouses()" style="margin-top:4px;">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function showKingsLanding() {
    var modal = document.getElementById('modal-houses');
    var content = document.getElementById('modal-houses-content');
    var menuModal = document.getElementById('modal-menu');
    if (menuModal) menuModal.classList.add('hide');
    
    var controllerHouse = null;
    if (KINGS_LANDING.controller) {
        for (var id in HOUSES) {
            if (HOUSES[id].id === KINGS_LANDING.controller) { controllerHouse = HOUSES[id]; break; }
        }
    }
    
    var html = '<div class="modal-section" style="border:2px solid #ffd700;border-radius:12px;padding:14px;background:#120e0b;">';
    html += '<div style="text-align:center;font-size:32px;margin-bottom:8px;">👑</div>';
    html += '<h3 style="color:#ffd700;text-align:center;font-size:20px;">КОРОЛЕВСКАЯ ГАВАНЬ</h3>';
    html += '<p style="color:#ffd700;text-align:center;font-size:14px;">Железный Трон</p>';
    html += '<p style="color:#6a5a48;text-align:center;font-size:12px;">' + KINGS_LANDING.description + '</p>';
    html += '<p style="color:#6a5a48;text-align:center;font-size:12px;">💰 Налог на все регионы: устанавливается Короной (до 10%)</p>';
    
    if (controllerHouse) {
        html += '<div style="text-align:center;margin-top:10px;">';
        html += '<span style="color:#ffd700;font-size:16px;">👑 ' + controllerHouse.sigil + ' ' + controllerHouse.name + '</span>';
        html += '<br><span style="color:#ffd700;font-size:13px;">ПРАВИТ СЕМЬЮ КОРОЛЕВСТВАМИ</span>';
        html += '</div>';
    } else {
        html += '<div style="text-align:center;margin-top:10px;">';
        html += '<span style="color:#7ac98a;font-size:16px;">⚔️ ТРОН СВОБОДЕН</span>';
        html += '<br><span style="color:#7ac98a;font-size:13px;">Королевская Гавань ждёт своего завоевателя</span>';
        html += '</div>';
    }
    html += '</div>';
    
    html += '<button class="btn btn-secondary" onclick="openMainMenu()" style="margin-top:10px;">⬅️ Назад в меню</button>';
    html += '<button class="btn btn-secondary" onclick="closeHouses()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

// ============================================================
// 4. ДОМА ВЕСТЕРОСА
// ============================================================

function openHouses() {
    var modal = document.getElementById('modal-houses');
    var content = document.getElementById('modal-houses-content');
    var menuModal = document.getElementById('modal-menu');
    if (menuModal) menuModal.classList.add('hide');
    
    if (typeof HOUSES === 'undefined') {
        content.innerHTML = '<div class="modal-section"><h4>🏘️ ДОМА ВЕСТЕРОСА</h4><p style="color:#c96a5a;">❌ Данные о домах не загружены.</p><button class="btn btn-secondary" onclick="closeHouses()">Закрыть</button></div>';
        modal.classList.remove('hide');
        return;
    }
    
    var regions = {
        'north': { label: '❄️ СЕВЕР', houses: [] },
        'westlands': { label: '🦁 ЗАПАДНЫЕ ЗЕМЛИ', houses: [] },
        'reach': { label: '🌹 ПРОСТОР', houses: [] },
        'riverlands': { label: '🐟 РЕЧНЫЕ ЗЕМЛИ', houses: [] },
        'stormlands': { label: '⛈️ ШТОРМОВЫЕ ЗЕМЛИ', houses: [] },
        'dorne': { label: '☀️ ДОРН', houses: [] },
        'vale': { label: '🦅 ДОЛИНА', houses: [] },
        'iron_islands': { label: '🐙 ЖЕЛЕЗНЫЕ ОСТРОВА', houses: [] }
    };
    
    for (var id in HOUSES) {
        var house = HOUSES[id];
        if (house.region && regions[house.region]) {
            regions[house.region].houses.push(house);
        }
    }
    
    var greatHouses = {};
    for (var key in CAPITALS) {
        if (CAPITALS[key].controller) greatHouses[CAPITALS[key].controller] = key;
    }
    var royalHouse = KINGS_LANDING.controller || null;
    
    var html = '<div class="modal-section"><h4>🏘️ ДОМА ВЕСТЕРОСА</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Все дома стартуют независимыми. Захват столицы делает дом Великим, захват Королевской Гавани — Королём.</p>';
    html += '</div>';
    
    for (var regionKey in regions) {
        var region = regions[regionKey];
        if (region.houses.length === 0) continue;
        
        region.houses.sort(function(a, b) { return a.name.localeCompare(b.name); });
        
        html += '<div class="modal-section" style="border-top:1px solid #2a201a;padding-top:10px;margin-top:10px;">';
        html += '<h4 style="color:#c9b694;">' + region.label + ' (' + region.houses.length + ')</h4>';
        
        region.houses.forEach(function(house) {
            var sigil = house.sigil || '🏰';
            var style = '';
            var badge = '';
            if (royalHouse === house.id) { style = 'color:#ffd700;font-weight:bold;'; badge = ' 👑'; }
            else if (greatHouses[house.id]) { style = 'color:#e74c3c;font-weight:bold;'; badge = ' 🏰'; }
            if (house.liege) { var liegeHouse = HOUSES[house.liege]; if (liegeHouse) badge += ' [вассал ' + liegeHouse.sigil + ']'; }
            
            html += '<div class="row" style="padding:4px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label" style="' + style + '">' + sigil + ' ' + house.name + badge + '</span>';
            html += '<span class="value"><button class="btn btn-small" onclick="showHouseInfo(\'' + house.id + '\')">📜 Подробнее</button></span>';
            html += '</div>';
        });
        html += '</div>';
    }
    
    html += '<button class="btn" style="margin-top:8px;background:#3d2e20;border-color:#8a7a5a;" onclick="openCapitals()">🏙️ Столицы регионов</button>';
    html += '<button class="btn" style="margin-top:4px;background:#2a1a12;border-color:#4a2a20;" onclick="showKingsLanding()">👑 Королевская Гавань</button>';
    html += '<button class="btn btn-secondary" onclick="closeHouses()" style="margin-top:10px;">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeHouses() {
    var modal = document.getElementById('modal-houses');
    if (modal) modal.classList.add('hide');
}

function showHouseInfo(houseId) {
    if (typeof HOUSES === 'undefined') { setMessage('❌ Данные о домах не загружены.'); return; }
    var house = HOUSES[houseId];
    if (!house) { setMessage('❌ Дом не найден.'); return; }
    
    var modal = document.getElementById('modal-houses');
    var content = document.getElementById('modal-houses-content');
    
    var regionNames = {
        'north':'❄️ Север','westlands':'🦁 Западные земли','reach':'🌹 Простор','riverlands':'🐟 Речные земли',
        'stormlands':'⛈️ Штормовые земли','dorne':'☀️ Дорн','vale':'🦅 Долина','iron_islands':'🐙 Железные острова'
    };
    
    var isRoyal = KINGS_LANDING.controller === house.id;
    var isGreat = false;
    var capitalName = '';
    for (var key in CAPITALS) {
        if (CAPITALS[key].controller === house.id) { isGreat = true; capitalName = CAPITALS[key].name; break; }
    }
    
    var sigil = house.sigil || '🏰';
    var color = house.color || '#b8a890';
    if (isRoyal) color = '#ffd700';
    else if (isGreat) color = '#e74c3c';
    
    var html = '<div class="modal-section">';
    html += '<button class="btn btn-secondary" style="margin-bottom:10px;" onclick="openHouses()">⬅️ Назад к списку</button>';
    html += '</div>';
    
    html += '<div class="modal-section" style="border:2px solid ' + color + ';border-radius:12px;padding:14px;background:#120e0b;">';
    html += '<div style="font-size:24px;text-align:center;margin-bottom:6px;">' + sigil + '</div>';
    html += '<h3 style="color:' + color + ';text-align:center;font-size:20px;font-weight:400;">' + house.name + '</h3>';
    html += '<p style="color:#6a5a48;text-align:center;font-style:italic;font-size:14px;">' + (house.motto || '—') + '</p>';
    if (isRoyal) html += '<p style="color:#ffd700;text-align:center;font-size:16px;font-weight:bold;">👑 КОРОЛЬ ВЕСТЕРОСА</p>';
    else if (isGreat) html += '<p style="color:#e74c3c;text-align:center;font-size:16px;font-weight:bold;">🏰 ВЕЛИКИЙ ДОМ</p><p style="color:#6a5a48;text-align:center;font-size:12px;">Контролирует столицу: ' + capitalName + '</p>';
    if (house.liege) {
        var liegeHouse = HOUSES[house.liege];
        if (liegeHouse) html += '<p style="color:#6a5a48;text-align:center;font-size:12px;">⚓ Вассал дома ' + liegeHouse.sigil + ' ' + liegeHouse.name + '</p>';
    }
    html += '</div>';
    
    html += '<div class="modal-section">';
    html += '<div class="row"><span class="label">📍 Регион</span><span class="value">' + (regionNames[house.region] || house.region || '—') + '</span></div>';
    html += '<div class="row"><span class="label">🏰 Замок</span><span class="value">' + (house.castle || '—') + '</span></div>';
    html += '<div class="row"><span class="label">👑 Сюзерен</span><span class="value">' + (house.liege ? (HOUSES[house.liege] ? HOUSES[house.liege].sigil + ' ' + HOUSES[house.liege].name : house.liege) : 'Нет (независимый дом)') + '</span></div>';
    html += '</div>';
    
    html += '<div class="modal-section"><h4>⚔️ АРМИЯ</h4>';
    if (house.army) {
        html += '<div class="row"><span class="label">🗡️ Пехота</span><span class="value">' + (house.army.infantry || 0) + '</span></div>';
        html += '<div class="row"><span class="label">🐴 Кавалерия</span><span class="value">' + (house.army.cavalry || 0) + '</span></div>';
        html += '<div class="row"><span class="label">⛵ Корабли</span><span class="value">' + (house.army.ships || 0) + '</span></div>';
    } else { html += '<p style="color:#6a5a48;">Нет данных</p>'; }
    html += '</div>';
    
    html += '<div class="modal-section"><h4>💰 ЭКОНОМИКА</h4>';
    html += '<div class="row"><span class="label">💰 Казна</span><span class="value">' + (house.treasury || 0) + ' зол.</span></div>';
    html += '<div class="row"><span class="label">🤝 Верность (своих)</span><span class="value">' + (house.loyalty || 0) + '%</span></div>';
    html += '<div class="row"><span class="label">🌟 Репутация (в мире)</span><span class="value">' + (house.reputation || 0) + '%</span></div>';
    html += '</div>';
    
    html += '<button class="btn btn-secondary" onclick="openHouses()" style="margin-top:10px;">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

// ============================================================
// 5. РЕГИСТРАЦИЯ
// ============================================================

window.openMainMenu = openMainMenu;
window.closeMenu = closeMenu;
window.openMyHouse = openMyHouse;
window.showHouseTab = showHouseTab;
window.invitePlayer = invitePlayer;
window.cancelInvite = cancelInvite;
window.acceptInvite = acceptInvite;
window.declineInvite = declineInvite;
window.leaveHouse = leaveHouse;
window.assignRank = assignRank;
window.demoteMember = demoteMember;
window.openHouses = openHouses;
window.closeHouses = closeHouses;
window.showHouseInfo = showHouseInfo;
window.openCapitals = openCapitals;
window.showKingsLanding = showKingsLanding;

loadInvitations();
console.log('📋 Меню + Дома + Столицы + Мой дом + Приглашения + Роли загружены!');

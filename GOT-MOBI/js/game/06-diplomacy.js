// ============================================================
// js/game/06-diplomacy.js — МОЙ ДОМ, ПРИГЛАШЕНИЯ, РОЛИ, АРМИЯ
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
            html += '<button class="tab-btn" onclick="showHouseTab(\'army\')">⚔️ Армия</button>';
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
        
        // Под-вкладки
        html += '<div class="tabs" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;">';
        html += '<button class="tab-btn active" onclick="showArmySubTab(\'castle\')">🏰 В замке</button>';
        html += '<button class="tab-btn" onclick="showArmySubTab(\'field\')">🌍 В поле</button>';
        html += '<button class="tab-btn" onclick="showArmySubTab(\'marching\')">🚶 В пути</button>';
        html += '</div>';
        html += '<div id="army-sub-tab-content"></div>';
        html += '</div>';
        
        container.innerHTML = html;
        showArmySubTab('castle');
        return;
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
// 2.5 ПОД-ВКЛАДКИ АРМИИ
// ============================================================

window.showArmySubTab = function(subTab) {
    var container = document.getElementById('army-sub-tab-content');
    if (!container) return;
    var user = users[currentUser];
    var g = user.game;
    var houseId = g.house;
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [], marching: [] };
    var html = '';
    
    if (subTab === 'castle') {
        // В замке
        html += '<div class="modal-section"><h4>🏰 ГАРНИЗОН В ЗАМКЕ</h4>';
        var castleUnits = { infantry: 0, cavalry: 0, siege: 0, scouts: 0 };
        
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (garrison[cat]) {
                garrison[cat].forEach(function(u) {
                    if (u.location === 'castle' || !u.location) {
                        if (u.isScout) castleUnits.scouts++;
                        else castleUnits[cat]++;
                    }
                });
            }
        });
        
        var totalCastle = castleUnits.infantry + castleUnits.cavalry + castleUnits.siege + castleUnits.scouts;
        if (totalCastle === 0) {
            html += '<p style="color:#6a5a48;">Нет войск в замке.</p>';
        } else {
            html += '<p style="color:#6a5a48;">Всего: ' + totalCastle + ' юнитов</p>';
            
            if (castleUnits.infantry > 0 || castleUnits.cavalry > 0 || castleUnits.siege > 0) {
                html += '<h5>⚔️ Боевые юниты</h5>';
                var castleGrouped = {};
                ['infantry','cavalry','siege'].forEach(function(cat) {
                    if (garrison[cat]) {
                        garrison[cat].forEach(function(u) {
                            if ((u.location === 'castle' || !u.location) && !u.isScout) {
                                var k = u.type;
                                if (!castleGrouped[k]) castleGrouped[k] = 0;
                                castleGrouped[k]++;
                            }
                        });
                    }
                });
                for (var k in castleGrouped) {
                    var ut = window.UNIT_TYPES ? window.UNIT_TYPES[k] : null;
                    html += '<div class="row"><span class="label">' + (ut ? ut.emoji + ' ' + ut.name : k) + '</span><span class="value">×' + castleGrouped[k] + '</span></div>';
                }
            }
            
            if (castleUnits.scouts > 0) {
                html += '<h5>👁️ Разведчики</h5>';
                html += '<div class="row"><span class="label">👁️ Разведчики</span><span class="value">×' + castleUnits.scouts + '</span></div>';
            }
        }
        html += '</div>';
    }
    
    if (subTab === 'field') {
        // В поле
        html += '<div class="modal-section"><h4>🌍 ВОЙСКА В ПОЛЕ</h4>';
        var fieldByZone = {};
        
        ['infantry','cavalry','siege'].forEach(function(cat) {
            if (garrison[cat]) {
                garrison[cat].forEach(function(u) {
                    if (u.location && u.location !== 'castle') {
                        var zid = u.location;
                        if (!fieldByZone[zid]) fieldByZone[zid] = { units: {}, scouts: 0, total: 0 };
                        if (u.isScout) {
                            fieldByZone[zid].scouts++;
                        } else {
                            var k = u.type;
                            if (!fieldByZone[zid].units[k]) fieldByZone[zid].units[k] = 0;
                            fieldByZone[zid].units[k]++;
                        }
                        fieldByZone[zid].total++;
                    }
                });
            }
        });
        
        var zoneCount = Object.keys(fieldByZone).length;
        if (zoneCount === 0) {
            html += '<p style="color:#6a5a48;">Нет войск в поле.</p>';
        } else {
            html += '<p style="color:#6a5a48;">Войска в ' + zoneCount + ' зонах</p>';
            
            for (var zid in fieldByZone) {
                var zd = fieldByZone[zid];
                var zoneName = getZoneName(zid);
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
        // В пути
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
                    // Новый формат (пошаговый)
                    var currentZoneId = m.path[m.currentStep] || m.path[0];
                    var nextZoneId = m.path[m.currentStep + 1] || m.path[m.path.length - 1];
                    var lastZoneId = m.path[m.path.length - 1];
                    
                    fromZoneName = getZoneName(m.path[0]);
                    toZoneName = getZoneName(lastZoneId);
                    currentZoneName = getZoneName(currentZoneId);
                    
                    timeLeft = Math.max(0, Math.ceil((m.nextMoveTime - Date.now()) / 60000));
                    progress = 'Шаг ' + (m.currentStep + 1) + '/' + (m.path.length - 1);
                } else {
                    fromZoneName = getZoneName(m.fromZone);
                    toZoneName = getZoneName(m.targetZone);
                    currentZoneName = fromZoneName;
                    timeLeft = Math.max(0, Math.ceil((m.arrivesAt - Date.now()) / 60000));
                    progress = 'В пути';
                }
                
                var emoji = '🟢';
                if (m.isScout) emoji = '👁️';
                else if (m.units) {
                    var hasC = false, hasS = false;
                    m.units.forEach(function(u) {
                        if (u.siege) hasS = true;
                        else if (u.horse || u.type === 'rider' || u.type === 'heavy_rider' || u.type === 'knight') hasC = true;
                    });
                    if (hasS) emoji = '🟤';
                    else if (hasC) emoji = '🐴';
                }
                
                html += '<div style="background:#120e0b;border:1px solid #2a201a;border-radius:10px;padding:10px;margin:6px 0;">';
                html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
                html += '<div>';
                html += '<span style="font-size:16px;">' + emoji + '</span> ';
                html += '<strong style="color:#c9b694;">' + fromZoneName + ' → ' + toZoneName + '</strong>';
                html += '<br><span style="font-size:11px;color:#6a5a48;">📍 ' + currentZoneName + ' | ⏱️ ~' + timeLeft + ' мин | ' + progress + '</span>';
                html += '<br><span style="font-size:11px;color:#6a5a48;">👥 ' + totalUnits + ' юнитов</span>';
                html += '</div>';
                html += '<div>';
                html += '<button class="btn btn-small" onclick="showMarchDetails(' + i + ')">📋 Состав</button>';
                html += '</div>';
                html += '</div></div>';
            });
        }
        html += '</div>';
    }
    
    container.innerHTML = html;
};

// ============================================================
// 2.6 ДЕТАЛИ МАРША
// ============================================================

window.showMarchDetails = function(index) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : { infantry: [], cavalry: [], siege: [], marching: [] };
    var marching = garrison.marching || [];
    
    if (index >= marching.length) {
        setMessage('❌ Отряд не найден.');
        return;
    }
    
    var m = marching[index];
    var units = m.units || [];
    
    var modal = document.getElementById('modal-march-details');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-march-details';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeMarchDetails(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📋 СОСТАВ ОТРЯДА</h3><button class="close-btn" onclick="closeMarchDetails()">✕</button></div><div id="modal-march-details-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-march-details-content');
    var html = '<div class="modal-section"><h4>📋 СОСТАВ ОТРЯДА</h4>';
    html += '<p style="color:#6a5a48;">Всего: ' + units.length + ' юнитов</p>';
    
    var grouped = {};
    units.forEach(function(u) {
        var k = u.type;
        if (!grouped[k]) grouped[k] = 0;
        grouped[k]++;
    });
    
    for (var k in grouped) {
        var ut = window.UNIT_TYPES ? window.UNIT_TYPES[k] : null;
        html += '<div class="row"><span class="label">' + (ut ? ut.emoji + ' ' + ut.name : k) + '</span><span class="value">×' + grouped[k] + '</span></div>';
    }
    
    html += '</div>';
    html += '<button class="btn btn-secondary" onclick="closeMarchDetails()">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
};

window.closeMarchDetails = function() {
    var m = document.getElementById('modal-march-details');
    if (m) m.classList.add('hide');
};

function getZoneName(zoneId) {
    var z = WORLD_AREAS[zoneId];
    return z ? z.name : zoneId;
}

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
            hasLord = true;
            break;
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

loadInvitations();
console.log('🏰 Дипломатия + Мой дом + Роли + Армия + Летопись загружены!');

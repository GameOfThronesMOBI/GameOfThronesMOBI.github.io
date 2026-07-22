// ============================================================
// js/regions/stormlands/castles/buckler_castle.js
// ЗАМОК БРОНЗОВЫЙ ЩИТ — 11 ЗДАНИЙ
// ============================================================

var _castlePrevUpdateStory = window.updateStory;
var _castlePrevUpdateActions = window.updateActions;

const CASTLE_BUILDINGS = [
    { id: 'castle_gate', label: '🚪 Ворота замка' },
    { id: 'castle_donjon', label: '🏰 Донжон' },
    { id: 'castle_barracks', label: '⚔️ Казармы' },
    { id: 'castle_training', label: '🎯 Тренировочная площадка' },
    { id: 'castle_forge', label: '⚒️ Кузница' },
    { id: 'castle_granary', label: '🌾 Амбар' },
    { id: 'castle_storage', label: '📦 Склад' },
    { id: 'castle_armory', label: '🗡️ Оружейная' },
    { id: 'castle_stable', label: '🐴 Конюшня' },
    { id: 'castle_market', label: '🏪 Рынок' },
    { id: 'castle_dungeon', label: '⛓️ Темница' }
];

function openCastleMap() {
    var g = users[currentUser].game;
    var modal = document.getElementById('modal-map');
    var content = document.getElementById('modal-map-content');
    
    var html = '<div class="modal-section"><h4>🏰 Бронзовый Щит</h4></div>';
    html += '<div class="modal-section">';
    
    for (var i = 0; i < CASTLE_BUILDINGS.length; i++) {
        var b = CASTLE_BUILDINGS[i];
        var isCurrent = b.id === g.location.place;
        
        html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
        html += '<span class="label">' + b.label + (isCurrent ? ' ⭐' : '') + '</span>';
        if (!isCurrent) {
            html += '<span class="value"><button class="btn btn-small" onclick="goToCastleBuilding(\'' + b.id + '\')">🚶 Идти</button></span>';
        } else {
            html += '<span class="value" style="color:#6a5a48;">Вы здесь</span>';
        }
        html += '</div>';
    }
    
    html += '</div><button class="btn" onclick="closeMap()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function goToCastleBuilding(building) {
    var g = users[currentUser].game;
    
    if (isBusy) { setMessage('⏳ Вы заняты.'); return; }
    if (building === g.location.place) { setMessage('📍 Вы уже здесь.'); return; }
    
    var exists = false;
    for (var i = 0; i < CASTLE_BUILDINGS.length; i++) {
        if (CASTLE_BUILDINGS[i].id === building) { exists = true; break; }
    }
    if (!exists) { setMessage('❌ Здание не найдено.'); return; }
    
    g.location.place = building;
    g.location.location = 'Бронзовый Щит';
    
    setMessage('✅ Вы прибыли в ' + building);
    
    closeMap();
    updateMenu();
    updateStory();
    updateActions();
    saveData();
}

// ============================================================
// STORY
// ============================================================

window.updateStory = function() {
    var g = users[currentUser].game;
    var place = g.location.place;
    
    var isCastle = false;
    for (var i = 0; i < CASTLE_BUILDINGS.length; i++) {
        if (CASTLE_BUILDINGS[i].id === place) { isCastle = true; break; }
    }
    
    if (!isCastle) {
        if (typeof _castlePrevUpdateStory === 'function') return _castlePrevUpdateStory();
        return;
    }
    
    var titleEl = document.getElementById('story-title');
    var textEl = document.getElementById('story-text');
    
    if (titleEl) titleEl.textContent = '🏰 Бронзовый Щит';
    
    var texts = {
        'castle_gate': '🚪 Ворота замка Бронзовый Щит. Отсюда можно выйти наружу.',
        'castle_donjon': '🗼 Донжон — сердце замка. Здесь живёт лорд Баклеров.',
        'castle_barracks': '⚔️ Казармы гарнизона.',
        'castle_training': '🎯 Тренировочная площадка.',
        'castle_forge': '⚒️ Замковая кузница.',
        'castle_granary': '🌾 Амбар с запасами.',
        'castle_storage': '📦 Склад ресурсов.',
        'castle_armory': '🗡️ Оружейная замка.',
        'castle_stable': '🐴 Замковая конюшня.',
        'castle_market': '🏪 Замковый рынок.',
        'castle_dungeon': '⛓️ Темница замка.'
    };
    
    if (textEl) textEl.textContent = texts[place] || 'Вы в ' + place;
    
    if (typeof updateActions === 'function') updateActions();
};

// ============================================================
// ACTIONS
// ============================================================

window.updateActions = function() {
    var g = users[currentUser].game;
    var place = g.location.place;
    var container = document.getElementById('actions-container');
    if (!container) return;
    
    var isCastle = false;
    for (var i = 0; i < CASTLE_BUILDINGS.length; i++) {
        if (CASTLE_BUILDINGS[i].id === place) { isCastle = true; break; }
    }
    
    if (!isCastle) {
        if (typeof _castlePrevUpdateActions === 'function') return _castlePrevUpdateActions();
        return;
    }
    
    container.innerHTML = '';
    var actions = [];
    
    if (place === 'castle_gate') {
        actions.push({ id: 'leave_buckler_castle', label: '🚪 Выйти из замка' });
    }
    if (place === 'castle_barracks') {
        actions.push({ id: 'barracks_manage', label: '⚔️ Управление армией' });
    }
    if (place === 'castle_training') {
        actions.push({ id: 'training_manage', label: '🎯 Тренировка' });
    }
    if (place === 'castle_forge') {
        actions.push({ id: 'castle_forge_craft', label: '⚒️ Ковка' });
    }
    if (place === 'castle_granary') {
        actions.push({ id: 'granary_manage', label: '🌾 Запасы' });
    }
    if (place === 'castle_storage') {
        actions.push({ id: 'castle_storage_manage', label: '📦 Склад' });
    }
    if (place === 'castle_armory') {
        actions.push({ id: 'armory_manage', label: '🗡️ Экипировка' });
    }
    if (place === 'castle_stable') {
        actions.push({ id: 'castle_stable_open', label: '🐴 Конюшня' });
    }
    if (place === 'castle_market') {
        actions.push({ id: 'market_open', label: '🏪 Торговля' });
    }
    if (place === 'castle_dungeon') {
        actions.push({ id: 'dungeon_open', label: '⛓️ Узники' });
    }
    
    actions.push({ id: 'castle_map', label: '🗺️ Карта замка' });
    actions.push({ id: 'inventory', label: '🎒 Инвентарь' });
    actions.push({ id: 'character', label: '👤 Персонаж' });
    actions.push({ id: 'menu', label: '📋 Меню' });
    
    for (var i = 0; i < actions.length; i++) {
        var a = actions[i];
        var btn = document.createElement('button');
        btn.className = 'btn-game';
        btn.textContent = a.label;
        btn.onclick = (function(action) {
            return function() {
                if (action.id === 'castle_map') { openCastleMap(); return; }
                if (action.id === 'leave_buckler_castle') {
                    g.location.place = 'bl_-1_0';
                    g.location.location = 'Владения Баклеров';
                    g.location.locationId = 'bl_-1_0';
                    g.location.parentZone = null;
                    setMessage('🚪 Вы вышли из замка.');
                    updateMenu(); updateStory(); updateActions(); saveData();
                    return;
                }
                if (typeof gameAction === 'function') gameAction(action.id);
                else setMessage('❌ Действие временно недоступно.');
            };
        })(a);
        container.appendChild(btn);
    }
};

// Вход в замок
window.enterBucklerCastle = function() {
    var g = users[currentUser].game;
    g.location.place = 'castle_gate';
    g.location.location = 'Бронзовый Щит';
    g.location.parentZone = null;
    setMessage('🏰 Вы вошли в замок Бронзовый Щит.');
    updateMenu(); updateStory(); updateActions(); saveData();
};

window.openCastleMap = openCastleMap;
window.goToCastleBuilding = goToCastleBuilding;
window.updateStory = window.updateStory;
window.updateActions = window.updateActions;

console.log('🏰 Замок Бронзовый Щит загружен!');

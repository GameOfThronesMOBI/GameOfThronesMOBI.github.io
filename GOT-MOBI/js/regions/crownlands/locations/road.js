// ============================================================
// js/regions/crownlands/locations/road.js — ДОРОГА (ур.5)
// ============================================================

console.log('🛤️ Дорога загружена (ур.5)');

var ROAD_LEVEL = 5;
var ROAD_REGION = 'Королевские земли';

// ============================================================
// 1. КАРТА
// ============================================================

function openMap() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    
    var modal = document.getElementById('modal-map');
    var content = document.getElementById('modal-map-content');
    
    var html = '<div class="modal-section"><h4>📍 Дорога (ур.' + ROAD_LEVEL + ')</h4></div>';
    html += '<div class="modal-section">';
    html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
    html += '<span class="label">🚪 Ворота</span>';
    html += '<span class="value"><button class="btn btn-small" onclick="goToCity()">🚶 Войти</button></span>';
    html += '</div>';
    html += '</div><button class="btn" onclick="closeMap()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeMap() {
    document.getElementById('modal-map').classList.add('hide');
}

// ============================================================
// 2. ВХОД В ГОРОД
// ============================================================

function goToCity() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (isBusy) { setMessage('⏳ Вы заняты.'); return; }
    
    g.location.place = 'Ворота';
    g.location.location = 'Королевская Гавань';
    g.outside = false;
    
    setMessage('🚪 Вы вошли в Королевскую Гавань.');
    closeMap();
    updateMenu();
    updateStory();
    updateActions();
    saveData();
}

// ============================================================
// 3. STORY
// ============================================================

function updateStory() {
    var titleEl = document.getElementById('story-title');
    var textEl = document.getElementById('story-text');
    
    if (titleEl) {
        titleEl.textContent = '📍 Дорога (ур.' + ROAD_LEVEL + ')';
    }
    if (textEl) {
        textEl.textContent = '🛤️ Королевский тракт. Уровень ' + ROAD_LEVEL + '. Можно найти врагов (2-8 ур.) или клады.';
    }
    
    if (typeof updateActions === 'function') {
        updateActions();
    }
}

// ============================================================
// 4. КНОПКИ
// ============================================================

function updateActions() {
    var container = document.getElementById('actions-container');
    if (!container) return;
    container.innerHTML = '';
    
    var actions = [
        { id: 'inventory', label: '🎒 Инвентарь' },
        { id: 'character', label: '👤 Персонаж' },
        { id: 'menu', label: '📋 Меню' },
        { id: 'map', label: '🗺️ Карта' },
        { id: 'enter_city', label: '🚶 Войти' },
        { id: 'search', label: '🔍 Поиск' }
    ];
    
    for (var i = 0; i < actions.length; i++) {
        var a = actions[i];
        var btn = document.createElement('button');
        btn.className = 'btn-game';
        btn.textContent = a.label;
        btn.onclick = (function(actionId) {
            return function() {
                if (actionId === 'search') {
                    if (typeof window.doSearch === 'function') {
                        window.doSearch();
                    } else {
                        setMessage('❌ Боевая система не загружена.');
                    }
                    return;
                }
                if (actionId === 'enter_city') {
                    goToCity();
                    return;
                }
                if (typeof gameAction === 'function') {
                    gameAction(actionId);
                } else {
                    setMessage('❌ Действие временно недоступно.');
                }
            };
        })(a.id);
        container.appendChild(btn);
    }
}

// ============================================================
// 5. РЕГИСТРАЦИЯ
// ============================================================

window.openMap = openMap;
window.closeMap = closeMap;
window.goToCity = goToCity;
window.updateStory = updateStory;
window.updateActions = updateActions;

console.log('🛤️ Дорога загружена (ур.' + ROAD_LEVEL + ')');

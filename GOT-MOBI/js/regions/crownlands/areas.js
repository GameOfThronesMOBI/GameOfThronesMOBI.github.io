// ============================================================
// js/regions/crownlands/areas.js — ФИНАЛ (КАРТА БЕЗ ПЕРЕХОДОВ)
// ============================================================

const KL_AREAS = {
    kl_crossroads: {
        id: 'kl_crossroads', name: 'Перекрёсток', type: 'crossroads', level: 1,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Придорожный камень', 'Столб с указателями'],
        actions: [{ id: 'enter_castle', label: '🏰 Войти в замок' }]
    },
    kl_n_1: {
        id: 'kl_n_1', name: 'Северный тракт', type: 'road', level: 5,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Придорожный камень', 'Старый колодец'],
        actions: [{ id: 'enter_city', label: '🚶 Войти в город' }]
    },
    kl_n_2: {
        id: 'kl_n_2', name: 'Северный тракт', type: 'road', level: 10,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Развилка', 'Привал'], actions: []
    },
    kl_n_3: {
        id: 'kl_n_3', name: 'Северный тракт', type: 'road', level: 15,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Смотровая вышка'], actions: []
    },
    kl_n_4: {
        id: 'kl_n_4', name: 'Северный тракт', type: 'road', level: 20,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Сторожевая башня'], actions: []
    },
    kl_ne_1: {
        id: 'kl_ne_1', name: 'Берег Чёрноводной', type: 'coast', level: 5,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Песчаный пляж'], actions: []
    },
    kl_ne_2: {
        id: 'kl_ne_2', name: 'Берег Чёрноводной', type: 'coast', level: 10,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Скалистый мыс'], actions: []
    },
    kl_ne_3: {
        id: 'kl_ne_3', name: 'Берег Чёрноводной', type: 'coast', level: 15,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Деревня', 'Причал'], actions: []
    },
    kl_ne_4: {
        id: 'kl_ne_4', name: 'Берег Чёрноводной', type: 'coast', level: 20,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Старая сторожевая башня'], actions: []
    },
    kl_ne_5: {
        id: 'kl_ne_5', name: 'Берег Чёрноводной', type: 'coast', level: 25,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Старый маяк'], actions: []
    },
    kl_ne_6: {
        id: 'kl_ne_6', name: 'Берег Чёрноводной', type: 'coast', level: 30,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Пещера контрабандистов'], actions: []
    },
    kl_nw_1: {
        id: 'kl_nw_1', name: 'Королевский лес', type: 'forest', level: 5,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Лесная тропа', 'Старый дуб'], actions: []
    },
    kl_nw_2: {
        id: 'kl_nw_2', name: 'Лесная поляна', type: 'forest', level: 10,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Деревня', 'Кострище'], actions: []
    },
    kl_nw_3: {
        id: 'kl_nw_3', name: 'Заброшенная мельница', type: 'forest', level: 15,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Мельничное колесо'], actions: []
    },
    kl_nw_4: {
        id: 'kl_nw_4', name: 'Перекрёсток у холмов', type: 'forest', level: 20,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Придорожный камень'], actions: []
    },
    kl_nw_5: {
        id: 'kl_nw_5', name: 'Королевский лес', type: 'forest', level: 25,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Глухомань'], actions: []
    },
    kl_nw_6: {
        id: 'kl_nw_6', name: 'Королевский лес', type: 'forest', level: 30,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Развалины старой крепости'], actions: []
    },
    kl_s_1: {
        id: 'kl_s_1', name: 'Южный тракт', type: 'road', level: 5,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Привал'], actions: []
    },
    kl_s_2: {
        id: 'kl_s_2', name: 'Южный тракт', type: 'road', level: 10,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Развилка'], actions: []
    },
    kl_s_3: {
        id: 'kl_s_3', name: 'Южный тракт', type: 'road', level: 15,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Сторожевая вышка'], actions: []
    },
    kl_s_4: {
        id: 'kl_s_4', name: 'Южный тракт', type: 'road', level: 20,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Застава'], actions: []
    },
    kl_sw_1: {
        id: 'kl_sw_1', name: 'Юго-западный тракт', type: 'road', level: 5,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Деревня', 'Привал'], actions: []
    },
    kl_sw_2: {
        id: 'kl_sw_2', name: 'Юго-западный тракт', type: 'road', level: 10,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Развилка'], actions: []
    },
    kl_sw_3: {
        id: 'kl_sw_3', name: 'Юго-западный тракт', type: 'road', level: 15,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Смотровая вышка'], actions: []
    },
    kl_sw_4: {
        id: 'kl_sw_4', name: 'Юго-западный тракт', type: 'road', level: 20,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Застава'], actions: []
    }
};

// ============================================================
// КАРТА (ТОЛЬКО МЕСТА + ЦЕНТР, БЕЗ ПЕРЕХОДОВ)
// ============================================================

window.openPlaces = function() {
    var g = users[currentUser].game;
    var locationId = g.location.locationId;
    
    if (!locationId || !KL_AREAS[locationId]) {
        if (KL_AREAS[g.location.place]) {
            locationId = g.location.place;
            g.location.locationId = locationId;
        } else {
            for (var id in KL_AREAS) {
                var l = KL_AREAS[id];
                if (l.places && l.places.indexOf(g.location.place) !== -1) {
                    locationId = id;
                    g.location.locationId = id;
                    break;
                }
            }
        }
    }
    
    if (!locationId || !KL_AREAS[locationId]) {
        setMessage('📍 Вы не на внешней локации.');
        return;
    }

    var loc = KL_AREAS[locationId];
    
    var modal = document.getElementById('modal-places');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-places';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closePlaces(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🗺️ КАРТА</h3><button class="close-btn" onclick="closePlaces()">✕</button></div><div id="modal-places-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-places-content');
    var html = '<div class="modal-section"><h4>📍 ' + loc.name + ' (ур.' + (loc.level || 1) + ')</h4>';
    
    // ЦЕНТР ЛОКАЦИИ
    var isAtCenter = (g.location.place === locationId);
    html += '<div class="modal-section"><h4>📍 Центр</h4>';
    html += '<div class="row" style="padding:8px 0; border-bottom:2px solid #3d3026;">';
    html += '<span class="label" style="color:#c9b694;">📍 ' + loc.name + '</span>';
    if (!isAtCenter) {
        html += '<span class="value"><button class="btn btn-small" onclick="goToPlace(\'' + locationId + '\'); closePlaces();">🚶 Вернуться</button></span>';
    } else {
        html += '<span class="value" style="color:#7ac98a;">⭐ Вы здесь</span>';
    }
    html += '</div></div>';
    
    // МЕСТА
    if (loc.places && loc.places.length > 0) {
        html += '<div class="modal-section" style="margin-top:10px;"><h4>🏘️ Места поблизости</h4>';
        loc.places.forEach(function(p) {
            var isCurrent = (p === g.location.place);
            html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label">📍 ' + p + (isCurrent ? ' ⭐' : '') + '</span>';
            if (!isCurrent) {
                html += '<span class="value"><button class="btn btn-small" onclick="goToPlace(\'' + p + '\'); closePlaces();">🚶 Идти</button></span>';
            } else {
                html += '<span class="value" style="color:#6a5a48;">Вы здесь</span>';
            }
            html += '</div>';
        });
        html += '</div>';
    }
    
    html += '<button class="btn" onclick="closePlaces()" style="margin-top:8px;">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
};

window.closePlaces = function() {
    var modal = document.getElementById('modal-places');
    if (modal) modal.classList.add('hide');
};

window.goToPlace = function(placeName) {
    var g = users[currentUser].game;
    if (!g) return;
    g.location.place = placeName;
    setMessage('🚶 Вы подошли к ' + placeName);
    updateMenu();
    updateStory();
    updateActions();
    saveData();
};

// ============================================================
// ОБНОВЛЕНИЕ STORY
// ============================================================

window.updateStory = function() {
    var g = users[currentUser].game;
    var place = g.location.place;
    var loc = KL_AREAS[place];
    
    if (!g.location.locationId || !KL_AREAS[g.location.locationId]) {
        if (KL_AREAS[place]) {
            g.location.locationId = place;
            loc = KL_AREAS[place];
        } else {
            for (var id in KL_AREAS) {
                var l = KL_AREAS[id];
                if (l.places && l.places.indexOf(place) !== -1) {
                    g.location.locationId = id;
                    loc = KL_AREAS[id];
                    break;
                }
            }
        }
    }
    
    if (!loc) {
        if (typeof _areasPrevUpdateStory === 'function') {
            _areasPrevUpdateStory();
        }
        return;
    }
    
    var titleEl = document.getElementById('story-title');
    var textEl = document.getElementById('story-text');
    
    if (titleEl) {
        titleEl.textContent = '📍 ' + loc.name + ' (ур.' + loc.level + ')';
    }
    if (textEl) {
        var desc = {
            'road': '🛤️ Дорога. Можно идти в разные стороны.',
            'forest': '🌲 Лес. Тихо и темно.',
            'coast': '🌊 Берег. Слышен шум волн.',
            'crossroads': '🔄 Перекрёсток. Много путей.'
        };
        textEl.textContent = desc[loc.type] || '📍 ' + loc.name;
    }
};

// ============================================================
// ОБНОВЛЕНИЕ ACTIONS (БЕЗ КНОПОК НАПРАВЛЕНИЙ)
// ============================================================

window.updateActions = function() {
    var g = users[currentUser].game;
    var place = g.location.place;
    var loc = KL_AREAS[place];
    var container = document.getElementById('actions-container');
    if (!container) return;
    
    if (!loc) {
        if (typeof _areasPrevUpdateActions === 'function') {
            _areasPrevUpdateActions();
        }
        return;
    }
    
    g.location.locationId = place;
    
    container.innerHTML = '';
    var localActions = loc.actions || [];
    
    for (var i = 0; i < localActions.length; i++) {
        var a = localActions[i];
        var btn = document.createElement('button');
        btn.className = 'btn-game';
        btn.textContent = a.label;
        if (a.action) {
            btn.onclick = a.action;
        } else {
            btn.onclick = (function(id) {
                return function() {
                    if (id === 'enter_city') {
                        g.location.place = 'Ворота';
                        g.location.location = 'Королевская Гавань';
                        g.outside = false;
                        setMessage('🚪 Вы вошли в Королевскую Гавань.');
                        updateMenu(); updateStory(); updateActions(); saveData();
                        return;
                    }
                    if (id === 'enter_castle') {
                        g.location.place = 'kings_landing';
                        setMessage('🏰 Вы вошли в Красный замок.');
                        updateMenu(); updateStory(); updateActions(); saveData();
                        return;
                    }
                    if (typeof gameAction === 'function') gameAction(id);
                };
            })(a.id);
        }
        container.appendChild(btn);
    }
    
    var globalActions = [
        { id: 'map', label: '🗺️ Карта' },
        { id: 'compass', label: '🧭 Компас' },
        { id: 'search', label: '🔍 Поиск' },
        { id: 'inventory', label: '🎒 Инвентарь' },
        { id: 'character', label: '👤 Персонаж' },
        { id: 'menu', label: '📋 Меню' }
    ];
    
    for (var j = 0; j < globalActions.length; j++) {
        var ga = globalActions[j];
        var btn = document.createElement('button');
        btn.className = 'btn-game';
        btn.textContent = ga.label;
        btn.onclick = (function(id) {
            return function() {
                if (id === 'map') {
                    if (typeof openPlaces === 'function') {
                        openPlaces();
                    } else {
                        setMessage('❌ Карта мест не загружена.');
                    }
                    return;
                }
                if (id === 'compass') {
                    if (typeof openCompass === 'function') {
                        openCompass();
                    } else {
                        setMessage('❌ Компас не загружен.');
                    }
                    return;
                }
                if (id === 'search') {
                    if (typeof window.doSearch === 'function') {
                        window.doSearch();
                    } else {
                        setMessage('❌ Боевая система не загружена.');
                    }
                    return;
                }
                if (typeof gameAction === 'function') {
                    gameAction(id);
                } else {
                    setMessage('❌ Действие временно недоступно.');
                }
            };
        })(ga.id);
        container.appendChild(btn);
    }
};

// ============================================================
// РЕГИСТРАЦИЯ
// ============================================================

var _areasPrevUpdateStory = window.updateStory;
var _areasPrevUpdateActions = window.updateActions;

window.updateStory = window.updateStory;
window.updateActions = window.updateActions;

console.log('✅ Внешние локации загружены');

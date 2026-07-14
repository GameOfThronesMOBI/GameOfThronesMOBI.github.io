// ============================================================
// js/regions/crownlands/areas.js — 29 ЗОН + ГЛОБАЛЬНЫЕ НОМЕРА
// ============================================================

const KL_AREAS = {
    // 🔄 ПЕРЕКРЁСТОК
    kl_crossroads: {
        id: 'kl_crossroads', name: 'Перекрёсток у Гавани', type: 'crossroads', level: 1,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Придорожный камень', 'Столб с указателями'],
        actions: [{ id: 'enter_castle', label: '🏰 Войти в замок' }],
        zoneNumber: 0
    },

    // ⬆️ СЕВЕРНАЯ ДОРОГА
    kl_n_1: {
        id: 'kl_n_1', name: 'Королевский тракт: Северные ворота', type: 'road', level: 5,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Старый колодец'],
        actions: [{ id: 'enter_city', label: '🚶 Войти в город' }],
        zoneNumber: 1
    },
    kl_n_2: {
        id: 'kl_n_2', name: 'Королевский тракт: Придорожная роща', type: 'road', level: 10,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Привал'], actions: [],
        zoneNumber: 2
    },
    kl_n_3: {
        id: 'kl_n_3', name: 'Королевский тракт: Смотровая вышка', type: 'road', level: 15,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Древний курган'], actions: [],
        zoneNumber: 3
    },
    kl_n_4: {
        id: 'kl_n_4', name: 'Королевский тракт: Граница Речных земель', type: 'road', level: 20,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Пограничный камень'], actions: [],
        zoneNumber: 4
    },

    // ↗️ СЕВЕРО-ВОСТОЧНЫЙ БЕРЕГ
    kl_ne_1: {
        id: 'kl_ne_1', name: 'Берег Чёрноводной: Песчаный пляж', type: 'coast', level: 5,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: [], actions: [],
        zoneNumber: 1
    },
    kl_ne_2: {
        id: 'kl_ne_2', name: 'Берег Чёрноводной: Скалистый мыс', type: 'coast', level: 10,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Рыбацкие лодки'], actions: [],
        zoneNumber: 2
    },
    kl_ne_3: {
        id: 'kl_ne_3', name: 'Берег Чёрноводной: Причал', type: 'coast', level: 15,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Деревня', 'Старый причал'], actions: [],
        zoneNumber: 3
    },
    kl_ne_4: {
        id: 'kl_ne_4', name: 'Берег Чёрноводной: Старый маяк', type: 'coast', level: 20,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Заброшенный маяк'], actions: [],
        zoneNumber: 4
    },

    // ↘️ ЮГО-ВОСТОЧНЫЙ БЕРЕГ
    kl_se_1: {
        id: 'kl_se_1', name: 'Южный берег: Песчаная коса', type: 'coast', level: 5,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: [], actions: [],
        zoneNumber: 1
    },
    kl_se_2: {
        id: 'kl_se_2', name: 'Южный берег: Солёные скалы', type: 'coast', level: 10,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: [], actions: [],
        zoneNumber: 2
    },
    kl_se_3: {
        id: 'kl_se_3', name: 'Южный берег: Старый причал', type: 'coast', level: 15,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Деревня', 'Ветхий причал'], actions: [],
        zoneNumber: 3
    },
    kl_se_4: {
        id: 'kl_se_4', name: 'Южный берег: Бухта', type: 'coast', level: 20,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Пещера в скалах'], actions: [],
        zoneNumber: 4
    },

    // ⬇️ ЮЖНАЯ ДОРОГА
    kl_s_1: {
        id: 'kl_s_1', name: 'Королевский тракт: Южные ворота', type: 'road', level: 5,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Придорожный камень'], actions: [],
        zoneNumber: 1
    },
    kl_s_2: {
        id: 'kl_s_2', name: 'Королевский тракт: Придорожный привал', type: 'road', level: 10,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Привал'], actions: [],
        zoneNumber: 2
    },
    kl_s_3: {
        id: 'kl_s_3', name: 'Королевский тракт: Сторожевая вышка', type: 'road', level: 15,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Старая вышка'], actions: [],
        zoneNumber: 3
    },
    kl_s_4: {
        id: 'kl_s_4', name: 'Королевский тракт: Граница Штормовых земель', type: 'road', level: 20,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Пограничный камень'], actions: [],
        zoneNumber: 4
    },

    // ↙️ ЮГО-ЗАПАДНАЯ РЕКА
    kl_sw_1: {
        id: 'kl_sw_1', name: 'Черноводная: Речной берег', type: 'coast', level: 5,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: [], actions: [],
        zoneNumber: 1
    },
    kl_sw_2: {
        id: 'kl_sw_2', name: 'Черноводная: Паромная переправа', type: 'coast', level: 10,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Деревня', 'Причал'], actions: [],
        zoneNumber: 2
    },
    kl_sw_3: {
        id: 'kl_sw_3', name: 'Черноводная: Водяная мельница', type: 'coast', level: 15,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Мельничное колесо'], actions: [],
        zoneNumber: 3
    },
    kl_sw_4: {
        id: 'kl_sw_4', name: 'Черноводная: Старый мост', type: 'coast', level: 20,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Каменный мост'], actions: [],
        zoneNumber: 4
    },

    // ⬅️ ЗАПАДНАЯ ДОРОГА
    kl_w_1: {
        id: 'kl_w_1', name: 'Золотая дорога: Западные ворота', type: 'road', level: 5,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Придорожный камень'], actions: [],
        zoneNumber: 1
    },
    kl_w_2: {
        id: 'kl_w_2', name: 'Золотая дорога: Старая мельница', type: 'road', level: 10,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Мельничный пруд'], actions: [],
        zoneNumber: 2
    },
    kl_w_3: {
        id: 'kl_w_3', name: 'Золотая дорога: Заброшенная ферма', type: 'road', level: 15,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Старый амбар'], actions: [],
        zoneNumber: 3
    },
    kl_w_4: {
        id: 'kl_w_4', name: 'Золотая дорога: Граница Простора', type: 'road', level: 20,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Пограничный камень'], actions: [],
        zoneNumber: 4
    },

    // ↖️ СЕВЕРО-ЗАПАДНЫЙ ЛЕС
    kl_nw_1: {
        id: 'kl_nw_1', name: 'Королевский лес: Лесная тропа', type: 'forest', level: 5,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Старый дуб'], actions: [],
        zoneNumber: 1
    },
    kl_nw_2: {
        id: 'kl_nw_2', name: 'Королевский лес: Поляна', type: 'forest', level: 10,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Деревня', 'Кострище'], actions: [],
        zoneNumber: 2
    },
    kl_nw_3: {
        id: 'kl_nw_3', name: 'Королевский лес: Мельничный ручей', type: 'forest', level: 15,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Заброшенная мельница'], actions: [],
        zoneNumber: 3
    },
    kl_nw_4: {
        id: 'kl_nw_4', name: 'Королевский лес: Развалины крепости', type: 'forest', level: 20,
        region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown',
        places: ['Старые руины'], actions: [],
        zoneNumber: 4
    }
};

// ============================================================
// КАРТА (ТОЛЬКО МЕСТА + ЦЕНТР)
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
    var zn = loc.zoneNumber || 0;
    var numberStr = zn > 0 ? ' [#' + zn + ']' : '';
    
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
    var html = '<div class="modal-section"><h4>📍 ' + loc.name + numberStr + ' (ур.' + (loc.level || 1) + ')</h4>';
    
    var isAtCenter = (g.location.place === locationId);
    html += '<div class="modal-section"><h4>📍 Центр</h4>';
    html += '<div class="row" style="padding:8px 0; border-bottom:2px solid #3d3026;">';
    html += '<span class="label" style="color:#c9b694;">📍 ' + loc.name + numberStr + '</span>';
    if (!isAtCenter) {
        html += '<span class="value"><button class="btn btn-small" onclick="goToPlace(\'' + locationId + '\'); closePlaces();">🚶 Вернуться</button></span>';
    } else {
        html += '<span class="value" style="color:#7ac98a;">⭐ Вы здесь</span>';
    }
    html += '</div></div>';
    
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
    var loc = KL_AREAS[placeName];
    var displayName = loc ? loc.name : placeName;
    g.location.place = placeName;
    setMessage('🚶 Вы подошли к ' + displayName);
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
    
    var zn = loc.zoneNumber || 0;
    var numberStr = zn > 0 ? ' [#' + zn + ']' : '';
    
    var titleEl = document.getElementById('story-title');
    var textEl = document.getElementById('story-text');
    
    if (titleEl) {
        titleEl.textContent = '📍 ' + loc.name + numberStr + ' (ур.' + loc.level + ')';
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
// ОБНОВЛЕНИЕ ACTIONS
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

console.log('✅ Внешние локации загружены (29 зон, глобальные номера)');

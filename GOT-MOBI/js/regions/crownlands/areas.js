// ============================================================
// js/regions/crownlands/areas.js — ВСЕ ВНЕШНИЕ ЛОКАЦИИ
// ============================================================

const KL_AREAS = {
    // ПЕРЕКРЁСТОК
    kl_crossroads: {
        id: 'kl_crossroads',
        name: 'Перекрёсток',
        type: 'crossroads',
        level: 1,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Придорожный камень', 'Столб с указателями'],
        actions: [
            { id: 'enter_castle', label: '🏰 Войти в замок' }
        ]
    },

    // СЕВЕР (дорога)
    kl_n_1: {
        id: 'kl_n_1',
        name: 'Северный тракт',
        type: 'road',
        level: 5,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Придорожный камень', 'Старый колодец'],
        actions: [
            { id: 'enter_city', label: '🚶 Войти в город' }
        ]
    },
    kl_n_2: {
        id: 'kl_n_2',
        name: 'Северный тракт',
        type: 'road',
        level: 10,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Развилка', 'Привал'],
        actions: []
    },
    kl_n_3: {
        id: 'kl_n_3',
        name: 'Северный тракт',
        type: 'road',
        level: 15,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Смотровая вышка'],
        actions: []
    },
    kl_n_4: {
        id: 'kl_n_4',
        name: 'Северный тракт',
        type: 'road',
        level: 20,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Сторожевая башня'],
        actions: []
    },

    // СЕВЕРО-ВОСТОК (берег)
    kl_ne_1: {
        id: 'kl_ne_1',
        name: 'Берег Чёрноводной',
        type: 'coast',
        level: 5,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Песчаный пляж'],
        actions: []
    },
    kl_ne_2: {
        id: 'kl_ne_2',
        name: 'Берег Чёрноводной',
        type: 'coast',
        level: 10,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Скалистый мыс'],
        actions: []
    },
    kl_ne_3: {
        id: 'kl_ne_3',
        name: 'Берег Чёрноводной',
        type: 'coast',
        level: 15,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Деревня', 'Причал'],
        actions: []
    },
    kl_ne_4: {
        id: 'kl_ne_4',
        name: 'Берег Чёрноводной',
        type: 'coast',
        level: 20,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Старая сторожевая башня'],
        actions: []
    },
    kl_ne_5: {
        id: 'kl_ne_5',
        name: 'Берег Чёрноводной',
        type: 'coast',
        level: 25,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Старый маяк'],
        actions: []
    },
    kl_ne_6: {
        id: 'kl_ne_6',
        name: 'Берег Чёрноводной',
        type: 'coast',
        level: 30,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Пещера контрабандистов'],
        actions: []
    },

    // СЕВЕРО-ЗАПАД (лес)
    kl_nw_1: {
        id: 'kl_nw_1',
        name: 'Королевский лес',
        type: 'forest',
        level: 5,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Лесная тропа', 'Старый дуб'],
        actions: []
    },
    kl_nw_2: {
        id: 'kl_nw_2',
        name: 'Лесная поляна',
        type: 'forest',
        level: 10,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Деревня', 'Кострище'],
        actions: []
    },
    kl_nw_3: {
        id: 'kl_nw_3',
        name: 'Заброшенная мельница',
        type: 'forest',
        level: 15,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Мельничное колесо'],
        actions: []
    },
    kl_nw_4: {
        id: 'kl_nw_4',
        name: 'Перекрёсток у холмов',
        type: 'forest',
        level: 20,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Придорожный камень'],
        actions: []
    },
    kl_nw_5: {
        id: 'kl_nw_5',
        name: 'Королевский лес',
        type: 'forest',
        level: 25,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Глухомань'],
        actions: []
    },
    kl_nw_6: {
        id: 'kl_nw_6',
        name: 'Королевский лес',
        type: 'forest',
        level: 30,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Развалины старой крепости'],
        actions: []
    },

    // ЮГ (дорога)
    kl_s_1: {
        id: 'kl_s_1',
        name: 'Южный тракт',
        type: 'road',
        level: 5,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Привал'],
        actions: []
    },
    kl_s_2: {
        id: 'kl_s_2',
        name: 'Южный тракт',
        type: 'road',
        level: 10,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Развилка'],
        actions: []
    },
    kl_s_3: {
        id: 'kl_s_3',
        name: 'Южный тракт',
        type: 'road',
        level: 15,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Сторожевая вышка'],
        actions: []
    },
    kl_s_4: {
        id: 'kl_s_4',
        name: 'Южный тракт',
        type: 'road',
        level: 20,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Застава'],
        actions: []
    },

    // ЮГО-ЗАПАД (дорога)
    kl_sw_1: {
        id: 'kl_sw_1',
        name: 'Юго-западный тракт',
        type: 'road',
        level: 5,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Деревня', 'Привал'],
        actions: []
    },
    kl_sw_2: {
        id: 'kl_sw_2',
        name: 'Юго-западный тракт',
        type: 'road',
        level: 10,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Развилка'],
        actions: []
    },
    kl_sw_3: {
        id: 'kl_sw_3',
        name: 'Юго-западный тракт',
        type: 'road',
        level: 15,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Смотровая вышка'],
        actions: []
    },
    kl_sw_4: {
        id: 'kl_sw_4',
        name: 'Юго-западный тракт',
        type: 'road',
        level: 20,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Застава'],
        actions: []
    }
};

// ============================================================
// УНИВЕРСАЛЬНЫЙ ОБНОВИТЕЛЬ ДЛЯ ВСЕХ ВНЕШНИХ ЛОКАЦИЙ
// ============================================================

window.updateStory = function() {
    var g = users[currentUser].game;
    var place = g.location.place;
    var loc = KL_AREAS[place];
    
    if (!loc) {
        // Если нет в KL_AREAS — передаём управление городу
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

window.updateActions = function() {
    var g = users[currentUser].game;
    var place = g.location.place;
    var loc = KL_AREAS[place];
    var container = document.getElementById('actions-container');
    if (!container) return;
    
    // Если нет в KL_AREAS — передаём управление городу
    if (!loc) {
        if (typeof _areasPrevUpdateActions === 'function') {
            _areasPrevUpdateActions();
        }
        return;
    }
    
    // ===== ЛОКАЛЬНЫЕ КНОПКИ (из KL_AREAS) =====
    container.innerHTML = '';
    var localActions = loc.actions || [];
    
    // Кнопки перемещения (из transitions.js)
    var transitions = KL_TRANSITIONS[place] || {};
    var dirLabels = {
        'n': '⬆️ Север',
        'ne': '↗️ СВ',
        'e': '➡️ Восток',
        'se': '↘️ ЮВ',
        's': '⬇️ Юг',
        'sw': '↙️ ЮЗ',
        'w': '⬅️ Запад',
        'nw': '↖️ СЗ'
    };
    for (var dir in transitions) {
        if (transitions[dir]) {
            localActions.push({
                id: 'move_' + dir,
                label: dirLabels[dir] || dir,
                action: function(d) {
                    return function() {
                        if (typeof window.moveTo === 'function') {
                            window.moveTo(d);
                        } else {
                            setMessage('❌ Система перемещений не загружена.');
                        }
                    };
                }(dir)
            });
        }
    }
    
    // Рендерим локальные кнопки
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
    
    // ===== ГЛОБАЛЬНЫЕ КНОПКИ (добавляем поверх) =====
    var globalActions = [
        { id: 'map', label: '🗺️ Карта' },
        { id: 'world', label: '🌍 Мир' },
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
                if (id === 'world') {
                    if (typeof openWorldMap === 'function') {
                        openWorldMap();
                    } else {
                        setMessage('🌍 Глобальная карта в разработке.');
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

// Сохраняем старые обработчики (для города)
var _areasPrevUpdateStory = window.updateStory;
var _areasPrevUpdateActions = window.updateActions;

window.updateStory = window.updateStory;
window.updateActions = window.updateActions;

console.log('✅ Внешние локации загружены (универсальная система)');

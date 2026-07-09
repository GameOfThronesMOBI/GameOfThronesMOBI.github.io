// ============================================================
// КОРОЛЕВСКАЯ ГАВАНЬ — ПОЛНЫЙ КОД
// ============================================================

// ============================================================
// 1. ЛОКАЦИИ (KL_AREAS)
// ============================================================

const KL_AREAS = {
    // ПЕРЕКРЁСТОК (связующая локация)
    kl_crossroads: {
        id: 'kl_crossroads',
        name: 'Перекрёсток',
        type: 'crossroads',
        level: 1,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Придорожный камень', 'Столб с указателями']
    },

    // СЕВЕР (4)
    kl_n_1: { id: 'kl_n_1', name: 'Северный тракт', type: 'road', level: 5, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Придорожный камень', 'Старый колодец'] },
    kl_n_2: { id: 'kl_n_2', name: 'Северный тракт', type: 'road', level: 10, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Развилка', 'Привал'] },
    kl_n_3: { id: 'kl_n_3', name: 'Северный тракт', type: 'road', level: 15, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Смотровая вышка'] },
    kl_n_4: { id: 'kl_n_4', name: 'Северный тракт', type: 'road', level: 20, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Сторожевая башня'] },

    // СЕВЕРО-ВОСТОК (6)
    kl_ne_1: { id: 'kl_ne_1', name: 'Берег Чёрноводной', type: 'coast', level: 5, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Песчаный пляж'] },
    kl_ne_2: { id: 'kl_ne_2', name: 'Берег Чёрноводной', type: 'coast', level: 10, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Скалистый мыс'] },
    kl_ne_3: { id: 'kl_ne_3', name: 'Берег Чёрноводной', type: 'coast', level: 15, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Деревня', 'Причал'] },
    kl_ne_4: { id: 'kl_ne_4', name: 'Берег Чёрноводной', type: 'coast', level: 20, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Старая сторожевая башня'] },
    kl_ne_5: { id: 'kl_ne_5', name: 'Берег Чёрноводной', type: 'coast', level: 25, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Старый маяк'] },
    kl_ne_6: { id: 'kl_ne_6', name: 'Берег Чёрноводной', type: 'coast', level: 30, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Пещера контрабандистов'] },

    // СЕВЕРО-ЗАПАД (6)
    kl_nw_1: { id: 'kl_nw_1', name: 'Королевский лес', type: 'forest', level: 5, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Лесная тропа', 'Старый дуб'] },
    kl_nw_2: { id: 'kl_nw_2', name: 'Лесная поляна', type: 'forest', level: 10, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Деревня', 'Кострище'] },
    kl_nw_3: { id: 'kl_nw_3', name: 'Заброшенная мельница', type: 'forest', level: 15, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Мельничное колесо'] },
    kl_nw_4: { id: 'kl_nw_4', name: 'Перекрёсток у холмов', type: 'forest', level: 20, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Придорожный камень'] },
    kl_nw_5: { id: 'kl_nw_5', name: 'Королевский лес', type: 'forest', level: 25, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Глухомань'] },
    kl_nw_6: { id: 'kl_nw_6', name: 'Королевский лес', type: 'forest', level: 30, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Развалины старой крепости'] },

    // ЮГ (4)
    kl_s_1: { id: 'kl_s_1', name: 'Южный тракт', type: 'road', level: 5, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Привал'] },
    kl_s_2: { id: 'kl_s_2', name: 'Южный тракт', type: 'road', level: 10, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Развилка'] },
    kl_s_3: { id: 'kl_s_3', name: 'Южный тракт', type: 'road', level: 15, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Сторожевая вышка'] },
    kl_s_4: { id: 'kl_s_4', name: 'Южный тракт', type: 'road', level: 20, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Застава'] },

    // ЮГО-ЗАПАД (4)
    kl_sw_1: { id: 'kl_sw_1', name: 'Юго-западный тракт', type: 'road', level: 5, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Деревня', 'Привал'] },
    kl_sw_2: { id: 'kl_sw_2', name: 'Юго-западный тракт', type: 'road', level: 10, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Развилка'] },
    kl_sw_3: { id: 'kl_sw_3', name: 'Юго-западный тракт', type: 'road', level: 15, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Смотровая вышка'] },
    kl_sw_4: { id: 'kl_sw_4', name: 'Юго-западный тракт', type: 'road', level: 20, region: 'Королевские земли', area: 'Королевская Гавань', owner: 'crown', places: ['Застава'] }
};

// ============================================================
// 2. ПЕРЕХОДЫ (KL_TRANSITIONS)
// ============================================================

const KL_TRANSITIONS = {
    // ПЕРЕКРЁСТОК
    'kl_crossroads': {
        n: 'kl_n_1',
        ne: 'kl_ne_1',
        nw: 'kl_nw_1',
        s: 'kl_s_1',
        sw: 'kl_sw_1'
    },

    // СЕВЕР
    'kl_n_1': { n: 'kl_n_2', s: 'kl_crossroads', w: 'kl_nw_1' },
    'kl_n_2': { n: 'kl_n_3', s: 'kl_n_1', w: 'kl_nw_2' },
    'kl_n_3': { n: 'kl_n_4', s: 'kl_n_2', w: 'kl_nw_3' },
    'kl_n_4': { n: 'riverlands', s: 'kl_n_3', w: 'kl_nw_4' },

    // СЕВЕРО-ВОСТОК
    'kl_ne_1': { ne: 'kl_ne_2', sw: 'kl_crossroads', nw: 'kl_n_1' },
    'kl_ne_2': { ne: 'kl_ne_3', sw: 'kl_ne_1', nw: 'kl_n_2' },
    'kl_ne_3': { ne: 'kl_ne_4', sw: 'kl_ne_2', nw: 'kl_n_3' },
    'kl_ne_4': { ne: 'kl_ne_5', sw: 'kl_ne_3', nw: 'kl_n_4' },
    'kl_ne_5': { ne: 'kl_ne_6', sw: 'kl_ne_4' },
    'kl_ne_6': { sw: 'kl_ne_5' },

    // СЕВЕРО-ЗАПАД
    'kl_nw_1': { nw: 'kl_nw_2', se: 'kl_crossroads', ne: 'kl_n_1' },
    'kl_nw_2': { nw: 'kl_nw_3', se: 'kl_nw_1', ne: 'kl_n_2' },
    'kl_nw_3': { nw: 'kl_nw_4', se: 'kl_nw_2', ne: 'kl_n_3' },
    'kl_nw_4': { nw: 'kl_nw_5', se: 'kl_nw_3', ne: 'kl_n_4' },
    'kl_nw_5': { nw: 'kl_nw_6', se: 'kl_nw_4' },
    'kl_nw_6': { se: 'kl_nw_5' },

    // ЮГ
    'kl_s_1': { s: 'kl_s_2', n: 'kl_crossroads', sw: 'kl_sw_1' },
    'kl_s_2': { s: 'kl_s_3', n: 'kl_s_1', sw: 'kl_sw_2' },
    'kl_s_3': { s: 'kl_s_4', n: 'kl_s_2', sw: 'kl_sw_3' },
    'kl_s_4': { s: 'stormlands', n: 'kl_s_3', sw: 'kl_sw_4' },

    // ЮГО-ЗАПАД
    'kl_sw_1': { sw: 'kl_sw_2', ne: 'kl_crossroads', nw: 'kl_s_1' },
    'kl_sw_2': { sw: 'kl_sw_3', ne: 'kl_sw_1', nw: 'kl_s_2' },
    'kl_sw_3': { sw: 'kl_sw_4', ne: 'kl_sw_2', nw: 'kl_s_3' },
    'kl_sw_4': { sw: 'reach', ne: 'kl_sw_3', nw: 'kl_s_4' }
};

// ============================================================
// 3. ОПИСАНИЯ ЛОКАЦИЙ
// ============================================================

function getDescriptionByType(type, name) {
    var desc = {
        'road': '🛤️ Дорога. Можно идти в разные стороны.',
        'forest': '🌲 Лес. Тихо и темно.',
        'coast': '🌊 Берег. Слышен шум волн.',
        'crossroads': '🔄 Перекрёсток. Много путей.',
        'castle': '🏰 Замок. Мощные стены.',
        'village': '🏘️ Деревня. Жизнь кипит.',
        'ruins': '🏚️ Развалины. Древние камни.'
    };
    return desc[type] || '📍 ' + name;
}

// ============================================================
// 4. UPDATE STORY
// ============================================================

window.updateStory = function() {
    var g = users[currentUser].game;
    if (!g) return;
    var place = g.location.place;
    
    var loc = KL_AREAS[place];
    var titleEl = document.getElementById('story-title');
    var textEl = document.getElementById('story-text');
    
    if (!loc) {
        if (titleEl) titleEl.textContent = '📍 ' + place;
        if (textEl) textEl.textContent = 'Вы находитесь в ' + place + '.';
        return;
    }
    
    if (titleEl) titleEl.textContent = '📍 ' + loc.name + ' (ур.' + loc.level + ')';
    if (textEl) textEl.textContent = getDescriptionByType(loc.type, loc.name);
};

// ============================================================
// 5. ПЕРЕМЕЩЕНИЕ (moveTo)
// ============================================================

function moveTo(direction) {
    var g = users[currentUser].game;
    if (!g) return;
    
    var current = g.location.place;
    var transitions = KL_TRANSITIONS[current];
    if (!transitions) return;
    
    var next = transitions[direction];
    if (!next) {
        setMessage('❌ Туда нельзя пойти.');
        return;
    }
    
    // Переход в другой регион
    if (typeof next === 'string' && !KL_AREAS[next] && !KL_TRANSITIONS[next]) {
        g.location.region = getRegionByLocation(next);
        g.location.place = next;
        setMessage('🚶 Вы перешли в ' + next);
        updateMenu();
        updateStory();
        updateActions();
        saveData();
        return;
    }
    
    g.location.place = next;
    setMessage('🚶 Вы пошли на ' + direction);
    updateMenu();
    updateStory();
    updateActions();
    saveData();
}

// ============================================================
// 6. UPDATE ACTIONS (КНОПКИ)
// ============================================================

window.updateActions = function() {
    var g = users[currentUser].game;
    if (!g) return;
    var place = g.location.place;
    var container = document.getElementById('actions-container');
    if (!container) return;
    container.innerHTML = '';
    
    var transitions = KL_TRANSITIONS[place] || {};
    var directions = {
        'n': '⬆️ Север',
        'ne': '↗️ Северо-восток',
        'e': '➡️ Восток',
        'se': '↘️ Юго-восток',
        's': '⬇️ Юг',
        'sw': '↙️ Юго-запад',
        'w': '⬅️ Запад',
        'nw': '↖️ Северо-запад'
    };
    
    // Кнопки переходов
    for (var dir in directions) {
        if (transitions[dir]) {
            var btn = document.createElement('button');
            btn.className = 'btn-game';
            btn.textContent = directions[dir];
            btn.onclick = (function(d) {
                return function() { moveTo(d); };
            })(dir);
            container.appendChild(btn);
        }
    }
    
    // Кнопка "Войти в замок" (на перекрёстке)
    if (place === 'kl_crossroads') {
        var enterBtn = document.createElement('button');
        enterBtn.className = 'btn-game';
        enterBtn.textContent = '🏰 Войти в замок';
        enterBtn.onclick = function() {
            g.location.place = 'kings_landing';
            setMessage('🏰 Вы вошли в Красный замок.');
            updateMenu();
            updateStory();
            updateActions();
            saveData();
        };
        container.appendChild(enterBtn);
    }
    
    // Кнопка "Выйти из замка" (в замке)
    if (place === 'kings_landing') {
        var exitBtn = document.createElement('button');
        exitBtn.className = 'btn-game';
        exitBtn.textContent = '🚪 Выйти из замка';
        exitBtn.onclick = function() {
            g.location.place = 'kl_crossroads';
            setMessage('🚪 Вы вышли из замка на перекрёсток.');
            updateMenu();
            updateStory();
            updateActions();
            saveData();
        };
        container.appendChild(exitBtn);
    }
    
    // Стандартные действия (Поиск, Инвентарь, Персонаж, Меню)
    var actions = [
        { id: 'search', label: '🔍 Поиск' },
        { id: 'inventory', label: '🎒 Инвентарь' },
        { id: 'character', label: '👤 Персонаж' },
        { id: 'menu', label: '📋 Меню' }
    ];
    
    for (var i = 0; i < actions.length; i++) {
        var a = actions[i];
        var btn = document.createElement('button');
        btn.className = 'btn-game';
        btn.textContent = a.label;
        btn.onclick = (function(id) {
            return function() {
                if (id === 'search') {
                    if (typeof window.doSearch === 'function') { window.doSearch(); return; }
                    setMessage('❌ Боевая система не загружена.');
                    return;
                }
                if (typeof gameAction === 'function') gameAction(id);
            };
        })(a.id);
        container.appendChild(btn);
    }
};

// ============================================================
// 7. ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ
// ============================================================

function getRegionByLocation(location) {
    var regionMap = {
        'riverlands': 'Речные земли',
        'stormlands': 'Штормовые земли',
        'reach': 'Простор'
    };
    return regionMap[location] || 'Королевские земли';
}

console.log('✅ Королевская Гавань загружена!');

// ============================================================
// js/regions/crownlands/areas.js — КООРДИНАТНАЯ СИСТЕМА (29 ЗОН)
// ============================================================

const KL_AREAS = {

    // 🔄 ЦЕНТР
    'kl_0_0': {
        id: 'kl_0_0',
        name: 'Перекрёсток у Гавани',
        type: 'crossroads',
        level: 1,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Придорожный камень', 'Столб с указателями'],
        actions: [{ id: 'enter_city', label: '🚶 Войти в город' }],
        resourceType: 'plain',
        zoneNumber: 0,
        x: 0,
        y: 0
    },

    // ⬆️ СЕВЕРНАЯ ДОРОГА
    'kl_0_-1': {
        id: 'kl_0_-1',
        name: 'Королевский тракт: Северные ворота',
        type: 'road',
        level: 5,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Старый колодец'],
        actions: [],
        resourceType: 'plain',
        zoneNumber: 1,
        x: 0,
        y: -1
    },
    'kl_0_-2': {
        id: 'kl_0_-2',
        name: 'Королевский тракт: Придорожная роща',
        type: 'road',
        level: 10,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Привал'],
        actions: [],
        resourceType: 'plain',
        zoneNumber: 2,
        x: 0,
        y: -2
    },
    'kl_0_-3': {
        id: 'kl_0_-3',
        name: 'Королевский тракт: Смотровая вышка',
        type: 'road',
        level: 15,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Древний курган'],
        actions: [],
        resourceType: 'forest',
        zoneNumber: 3,
        x: 0,
        y: -3
    },
    'kl_0_-4': {
        id: 'kl_0_-4',
        name: 'Королевский тракт: Граница Речных земель',
        type: 'road',
        level: 20,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Пограничный камень'],
        actions: [],
        resourceType: 'mountain',
        zoneNumber: 4,
        x: 0,
        y: -4
    },

    // ↗️ СЕВЕРО-ВОСТОЧНЫЙ БЕРЕГ
    'kl_1_-1': {
        id: 'kl_1_-1',
        name: 'Берег Чёрноводной: Песчаный пляж',
        type: 'coast',
        level: 5,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: [],
        actions: [],
        resourceType: 'coast',
        zoneNumber: 1,
        x: 1,
        y: -1
    },
    'kl_2_-2': {
        id: 'kl_2_-2',
        name: 'Берег Чёрноводной: Скалистый мыс',
        type: 'coast',
        level: 10,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Рыбацкие лодки'],
        actions: [],
        resourceType: 'coast',
        zoneNumber: 2,
        x: 2,
        y: -2
    },
    'kl_3_-3': {
        id: 'kl_3_-3',
        name: 'Берег Чёрноводной: Причал',
        type: 'coast',
        level: 15,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Деревня', 'Старый причал'],
        actions: [],
        resourceType: 'coast',
        zoneNumber: 3,
        x: 3,
        y: -3
    },
    'kl_4_-4': {
        id: 'kl_4_-4',
        name: 'Берег Чёрноводной: Старый маяк',
        type: 'coast',
        level: 20,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Заброшенный маяк'],
        actions: [],
        resourceType: 'coast',
        zoneNumber: 4,
        x: 4,
        y: -4
    },

    // ↘️ ЮГО-ВОСТОЧНЫЙ БЕРЕГ
    'kl_1_1': {
        id: 'kl_1_1',
        name: 'Южный берег: Песчаная коса',
        type: 'coast',
        level: 5,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: [],
        actions: [],
        resourceType: 'coast',
        zoneNumber: 1,
        x: 1,
        y: 1
    },
    'kl_2_2': {
        id: 'kl_2_2',
        name: 'Южный берег: Солёные скалы',
        type: 'coast',
        level: 10,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: [],
        actions: [],
        resourceType: 'coast',
        zoneNumber: 2,
        x: 2,
        y: 2
    },
    'kl_3_3': {
        id: 'kl_3_3',
        name: 'Южный берег: Старый причал',
        type: 'coast',
        level: 15,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Деревня', 'Ветхий причал'],
        actions: [],
        resourceType: 'coast',
        zoneNumber: 3,
        x: 3,
        y: 3
    },
    'kl_4_4': {
        id: 'kl_4_4',
        name: 'Южный берег: Бухта',
        type: 'coast',
        level: 20,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Пещера в скалах'],
        actions: [],
        resourceType: 'coast',
        zoneNumber: 4,
        x: 4,
        y: 4
    },

    // ⬇️ ЮЖНАЯ ДОРОГА
    'kl_0_1': {
        id: 'kl_0_1',
        name: 'Королевский тракт: Южные ворота',
        type: 'road',
        level: 5,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Придорожный камень'],
        actions: [],
        resourceType: 'plain',
        zoneNumber: 1,
        x: 0,
        y: 1
    },
    'kl_0_2': {
        id: 'kl_0_2',
        name: 'Королевский тракт: Придорожный привал',
        type: 'road',
        level: 10,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Привал'],
        actions: [],
        resourceType: 'plain',
        zoneNumber: 2,
        x: 0,
        y: 2
    },
    'kl_0_3': {
        id: 'kl_0_3',
        name: 'Королевский тракт: Сторожевая вышка',
        type: 'road',
        level: 15,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Старая вышка'],
        actions: [],
        resourceType: 'forest',
        zoneNumber: 3,
        x: 0,
        y: 3
    },
    'kl_0_4': {
        id: 'kl_0_4',
        name: 'Королевский тракт: Граница Штормовых земель',
        type: 'road',
        level: 20,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Пограничный камень'],
        actions: [],
        resourceType: 'mountain',
        zoneNumber: 4,
        x: 0,
        y: 4
    },

    // ↙️ ЮГО-ЗАПАДНАЯ РЕКА
    'kl_-1_1': {
        id: 'kl_-1_1',
        name: 'Черноводная: Речной берег',
        type: 'coast',
        level: 5,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: [],
        actions: [],
        resourceType: 'river',
        zoneNumber: 1,
        x: -1,
        y: 1
    },
    'kl_-2_2': {
        id: 'kl_-2_2',
        name: 'Черноводная: Паромная переправа',
        type: 'coast',
        level: 10,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Деревня', 'Причал'],
        actions: [],
        resourceType: 'river',
        zoneNumber: 2,
        x: -2,
        y: 2
    },
    'kl_-3_3': {
        id: 'kl_-3_3',
        name: 'Черноводная: Водяная мельница',
        type: 'coast',
        level: 15,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Мельничное колесо'],
        actions: [],
        resourceType: 'river',
        zoneNumber: 3,
        x: -3,
        y: 3
    },
    'kl_-4_4': {
        id: 'kl_-4_4',
        name: 'Черноводная: Старый мост',
        type: 'coast',
        level: 20,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Каменный мост'],
        actions: [],
        resourceType: 'river',
        zoneNumber: 4,
        x: -4,
        y: 4
    },

    // ⬅️ ЗАПАДНАЯ ДОРОГА
    'kl_-1_0': {
        id: 'kl_-1_0',
        name: 'Золотая дорога: Западные ворота',
        type: 'road',
        level: 5,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Придорожный камень'],
        actions: [],
        resourceType: 'plain',
        zoneNumber: 1,
        x: -1,
        y: 0
    },
    'kl_-2_0': {
        id: 'kl_-2_0',
        name: 'Золотая дорога: Старая мельница',
        type: 'road',
        level: 10,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Мельничный пруд'],
        actions: [],
        resourceType: 'plain',
        zoneNumber: 2,
        x: -2,
        y: 0
    },
    'kl_-3_0': {
        id: 'kl_-3_0',
        name: 'Золотая дорога: Заброшенная ферма',
        type: 'road',
        level: 15,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Старый амбар'],
        actions: [],
        resourceType: 'forest',
        zoneNumber: 3,
        x: -3,
        y: 0
    },
    'kl_-4_0': {
        id: 'kl_-4_0',
        name: 'Золотая дорога: Граница Простора',
        type: 'road',
        level: 20,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Пограничный камень'],
        actions: [],
        resourceType: 'mountain',
        zoneNumber: 4,
        x: -4,
        y: 0
    },

    // ↖️ СЕВЕРО-ЗАПАДНЫЙ ЛЕС
    'kl_-1_-1': {
        id: 'kl_-1_-1',
        name: 'Королевский лес: Лесная тропа',
        type: 'forest',
        level: 5,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Старый дуб'],
        actions: [],
        resourceType: 'forest',
        zoneNumber: 1,
        x: -1,
        y: -1
    },
    'kl_-2_-2': {
        id: 'kl_-2_-2',
        name: 'Королевский лес: Поляна',
        type: 'forest',
        level: 10,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Деревня', 'Кострище'],
        actions: [],
        resourceType: 'forest',
        zoneNumber: 2,
        x: -2,
        y: -2
    },
    'kl_-3_-3': {
        id: 'kl_-3_-3',
        name: 'Королевский лес: Мельничный ручей',
        type: 'forest',
        level: 15,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Заброшенная мельница'],
        actions: [],
        resourceType: 'forest',
        zoneNumber: 3,
        x: -3,
        y: -3
    },
    'kl_-4_-4': {
        id: 'kl_-4_-4',
        name: 'Королевский лес: Развалины крепости',
        type: 'forest',
        level: 20,
        region: 'Королевские земли',
        area: 'Королевская Гавань',
        owner: 'crown',
        places: ['Старые руины'],
        actions: [],
        resourceType: 'mountain',
        zoneNumber: 4,
        x: -4,
        y: -4
    }
};

// ============================================================
// ГЕНЕРАТОР ПЕРЕХОДОВ
// ============================================================

var KL_TRANSITIONS = {};
var _dirs = { n:[0,-1], ne:[1,-1], e:[1,0], se:[1,1], s:[0,1], sw:[-1,1], w:[-1,0], nw:[-1,-1] };

function _findByCoords(x, y) {
    for (var id in KL_AREAS) {
        if (KL_AREAS[id].x === x && KL_AREAS[id].y === y) return id;
    }
    return null;
}

for (var id in KL_AREAS) {
    var z = KL_AREAS[id];
    KL_TRANSITIONS[id] = {};
    for (var d in _dirs) {
        var nx = z.x + _dirs[d][0];
        var ny = z.y + _dirs[d][1];
        KL_TRANSITIONS[id][d] = _findByCoords(nx, ny);
    }
}

// ============================================================
// КАРТА
// ============================================================

window.openPlaces = function() {
    var g = users[currentUser].game;
    var locationId = g.location.locationId || g.location.place;
    
    if (!locationId || !KL_AREAS[locationId]) {
        setMessage('📍 Вы не на внешней локации.');
        return;
    }
    var loc = KL_AREAS[locationId];
    
    var modal = document.getElementById('modal-places');
    if (!modal) {
        var overlay = document.createElement('div'); overlay.id='modal-places'; overlay.className='modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closePlaces(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🗺️ КАРТА</h3><button class="close-btn" onclick="closePlaces()">✕</button></div><div id="modal-places-content"></div></div>';
        document.body.appendChild(overlay); modal = overlay;
    }
    var content = document.getElementById('modal-places-content');
    var html = '<div class="modal-section"><h4>📍 ' + loc.name + ' (ур.' + (loc.level||1) + ')</h4>';
    
    var isAtCenter = (g.location.place === locationId);
    html += '<div class="modal-section"><h4>📍 Центр</h4><div class="row" style="padding:8px 0; border-bottom:2px solid #3d3026;">';
    html += '<span class="label" style="color:#c9b694;">📍 ' + loc.name + '</span>';
    if (!isAtCenter) html += '<span class="value"><button class="btn btn-small" onclick="goToPlace(\''+locationId+'\');closePlaces();">🚶 Вернуться</button></span>';
    else html += '<span class="value" style="color:#7ac98a;">⭐ Вы здесь</span>';
    html += '</div></div>';
    
    if (loc.places && loc.places.length > 0) {
        html += '<div class="modal-section"><h4>🏘️ Места</h4>';
        loc.places.forEach(function(p) {
            var isCurrent = (p === g.location.place);
            html += '<div class="row"><span class="label">📍 '+p+(isCurrent?' ⭐':'')+'</span>';
            if (!isCurrent) html += '<span class="value"><button class="btn btn-small" onclick="goToPlace(\''+p+'\');closePlaces();">🚶 Идти</button></span>';
            else html += '<span class="value" style="color:#6a5a48;">Вы здесь</span>';
            html += '</div>';
        });
        html += '</div>';
    }
    html += '<button class="btn" onclick="closePlaces()">Закрыть</button>';
    content.innerHTML = html; modal.classList.remove('hide');
};

window.closePlaces = function() { var m = document.getElementById('modal-places'); if (m) m.classList.add('hide'); };
window.goToPlace = function(placeName) {
    var g = users[currentUser].game; if (!g) return;
    var loc = KL_AREAS[placeName]; g.location.place = placeName;
    setMessage('🚶 Вы подошли к ' + (loc ? loc.name : placeName));
    updateMenu(); updateStory(); updateActions(); saveData();
};

// ============================================================
// STORY
// ============================================================

window.updateStory = function() {
    var g = users[currentUser].game; var place = g.location.place; var loc = KL_AREAS[place];
    if (!g.location.locationId || !KL_AREAS[g.location.locationId]) g.location.locationId = place;
    if (!loc) { if (typeof _areasPrevUpdateStory === 'function') return _areasPrevUpdateStory(); return; }
    document.getElementById('story-title').textContent = '📍 ' + loc.name + ' (ур.' + loc.level + ')';
    var desc = { road:'🛤️ Дорога', forest:'🌲 Лес', coast:'🌊 Берег', crossroads:'🔄 Перекрёсток' };
    document.getElementById('story-text').textContent = desc[loc.type] || '📍 ' + loc.name;
};

// ============================================================
// ACTIONS
// ============================================================

window.updateActions = function() {
    var g = users[currentUser].game; var place = g.location.place; var loc = KL_AREAS[place];
    var container = document.getElementById('actions-container'); if (!container) return;
    if (!loc) { if (typeof _areasPrevUpdateActions === 'function') return _areasPrevUpdateActions(); return; }
    g.location.locationId = place;
    container.innerHTML = '';
    var actions = (loc.actions || []).slice();
    
    actions.push({ id:'map', label:'🗺️ Карта' },{ id:'compass', label:'🧭 Компас' },{ id:'search', label:'🔍 Поиск' },
                 { id:'inventory', label:'🎒 Инвентарь' },{ id:'character', label:'👤 Персонаж' },{ id:'menu', label:'📋 Меню' });
    
    actions.forEach(function(a) {
        var btn = document.createElement('button'); btn.className='btn-game'; btn.textContent=a.label;
        btn.onclick = (function(id){ return function(){
            if (id==='enter_city') { g.location.place='Ворота'; g.location.location='Королевская Гавань'; g.outside=false; setMessage('🚪 Вы вошли в Королевскую Гавань.'); updateMenu(); updateStory(); updateActions(); saveData(); return; }
            if (id==='map') { if (typeof openPlaces==='function') openPlaces(); else setMessage('❌ Карта не загружена.'); return; }
            if (id==='compass') { if (typeof openCompass==='function') openCompass(); else setMessage('❌ Компас не загружен.'); return; }
            if (id==='search') { if (typeof window.doSearch==='function') window.doSearch(); else setMessage('❌ Поиск не загружен.'); return; }
            if (typeof gameAction==='function') gameAction(id); else setMessage('❌ Действие недоступно.');
        }; })(a.id);
        container.appendChild(btn);
    });
};

var _areasPrevUpdateStory = window.updateStory;
var _areasPrevUpdateActions = window.updateActions;
window.updateStory = window.updateStory;
window.updateActions = window.updateActions;

console.log('✅ Координатная система загружена (29 зон)');

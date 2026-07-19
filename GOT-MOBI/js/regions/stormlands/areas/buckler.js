// ============================================================
// js/regions/stormlands/areas/buckler.js — БАКЛЕРЫ (9×9, 81 ЗОНА)
// ============================================================

const BUCKLER_AREAS = {

    // ==================== РЯД 0 (Северная граница с КЛ) ====================
    'bl_-4_0': { id:'bl_-4_0', name:'Граница', type:'mountain', level:30, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень'], zoneNumber:0, x:-4, y:0 },
    'bl_-3_0': { id:'bl_-3_0', name:'Приграничье', type:'road', level:34, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:0, x:-3, y:0 },
    'bl_-2_0': { id:'bl_-2_0', name:'Приграничье', type:'road', level:34, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:0, x:-2, y:0 },
    'bl_-1_0': { id:'bl_-1_0', name:'Тракт Баклеров', type:'road', level:36, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:0, x:-1, y:0 },
    'bl_0_0': { id:'bl_0_0', name:'Тракт Баклеров', type:'road', level:36, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:['Придорожный камень'], actions:[], zoneNumber:0, x:0, y:0 },
    'bl_1_0': { id:'bl_1_0', name:'Тракт Баклеров', type:'road', level:36, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:0, x:1, y:0 },
    'bl_2_0': { id:'bl_2_0', name:'Приграничье', type:'road', level:34, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:0, x:2, y:0 },
    'bl_3_0': { id:'bl_3_0', name:'Приграничье', type:'road', level:34, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:0, x:3, y:0 },
    'bl_4_0': { id:'bl_4_0', name:'Граница', type:'mountain', level:30, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень'], zoneNumber:0, x:4, y:0 },

    // ==================== РЯД 1 ====================
    'bl_-4_1': { id:'bl_-4_1', name:'Горный склон', type:'mountain', level:37, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:1, x:-4, y:1 },
    'bl_-3_1': { id:'bl_-3_1', name:'Холмы', type:'mountain', level:39, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:1, x:-3, y:1 },
    'bl_-2_1': { id:'bl_-2_1', name:'Холмы', type:'mountain', level:39, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:1, x:-2, y:1 },
    'bl_-1_1': { id:'bl_-1_1', name:'Тракт Баклеров', type:'road', level:40, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:1, x:-1, y:1 },
    'bl_0_1': { id:'bl_0_1', name:'Тракт Баклеров', type:'road', level:40, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:['Привал'], actions:[], zoneNumber:1, x:0, y:1 },
    'bl_1_1': { id:'bl_1_1', name:'Тракт Баклеров', type:'road', level:40, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:1, x:1, y:1 },
    'bl_2_1': { id:'bl_2_1', name:'Холмы', type:'mountain', level:39, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:1, x:2, y:1 },
    'bl_3_1': { id:'bl_3_1', name:'Холмы', type:'mountain', level:39, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:1, x:3, y:1 },
    'bl_4_1': { id:'bl_4_1', name:'Горный склон', type:'mountain', level:37, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:1, x:4, y:1 },

    // ==================== РЯД 2 ====================
    'bl_-4_2': { id:'bl_-4_2', name:'Горы', type:'mountain', level:42, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:2, x:-4, y:2 },
    'bl_-3_2': { id:'bl_-3_2', name:'Предгорье', type:'mountain', level:44, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:2, x:-3, y:2 },
    'bl_-2_2': { id:'bl_-2_2', name:'Предгорье', type:'mountain', level:44, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:2, x:-2, y:2 },
    'bl_-1_2': { id:'bl_-1_2', name:'Тракт Баклеров', type:'road', level:45, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:2, x:-1, y:2 },
    'bl_0_2': { id:'bl_0_2', name:'Тракт Баклеров', type:'road', level:45, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:['Колодец'], actions:[], zoneNumber:2, x:0, y:2 },
    'bl_1_2': { id:'bl_1_2', name:'Тракт Баклеров', type:'road', level:45, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:2, x:1, y:2 },
    'bl_2_2': { id:'bl_2_2', name:'Предгорье', type:'mountain', level:44, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:2, x:2, y:2 },
    'bl_3_2': { id:'bl_3_2', name:'Предгорье', type:'mountain', level:44, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:2, x:3, y:2 },
    'bl_4_2': { id:'bl_4_2', name:'Горы', type:'mountain', level:42, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:2, x:4, y:2 },

    // ==================== РЯД 3 ====================
    'bl_-4_3': { id:'bl_-4_3', name:'Горы', type:'mountain', level:47, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:3, x:-4, y:3 },
    'bl_-3_3': { id:'bl_-3_3', name:'Лес', type:'forest', level:49, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'forest', resources:['Дерево','Шкура'], zoneNumber:3, x:-3, y:3 },
    'bl_-2_3': { id:'bl_-2_3', name:'Лес', type:'forest', level:49, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'forest', resources:['Дерево','Шкура'], zoneNumber:3, x:-2, y:3 },
    'bl_-1_3': { id:'bl_-1_3', name:'Тракт Баклеров', type:'road', level:50, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:3, x:-1, y:3 },
    'bl_0_3': { id:'bl_0_3', name:'Бронзовый Щит', type:'castle', level:55, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:['Ворота замка','Кузница'], actions:[], zoneNumber:3, x:0, y:3 },
    'bl_1_3': { id:'bl_1_3', name:'Тракт Баклеров', type:'road', level:50, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:3, x:1, y:3 },
    'bl_2_3': { id:'bl_2_3', name:'Лес', type:'forest', level:49, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'forest', resources:['Дерево','Шкура'], zoneNumber:3, x:2, y:3 },
    'bl_3_3': { id:'bl_3_3', name:'Лес', type:'forest', level:49, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'forest', resources:['Дерево','Шкура'], zoneNumber:3, x:3, y:3 },
    'bl_4_3': { id:'bl_4_3', name:'Горы', type:'mountain', level:47, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:3, x:4, y:3 },

    // ==================== РЯД 4 (Центр) ====================
    'bl_-4_4': { id:'bl_-4_4', name:'Горы', type:'mountain', level:52, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:4, x:-4, y:4 },
    'bl_-3_4': { id:'bl_-3_4', name:'Лес', type:'forest', level:54, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'forest', resources:['Дерево','Шкура'], zoneNumber:4, x:-3, y:4 },
    'bl_-2_4': { id:'bl_-2_4', name:'Лес', type:'forest', level:54, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'forest', resources:['Дерево','Шкура'], zoneNumber:4, x:-2, y:4 },
    'bl_-1_4': { id:'bl_-1_4', name:'Тракт Баклеров', type:'road', level:55, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:4, x:-1, y:4 },
    'bl_0_4': { id:'bl_0_4', name:'Тракт Баклеров', type:'road', level:55, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:['Привал'], actions:[], zoneNumber:4, x:0, y:4 },
    'bl_1_4': { id:'bl_1_4', name:'Тракт Баклеров', type:'road', level:55, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:4, x:1, y:4 },
    'bl_2_4': { id:'bl_2_4', name:'Лес', type:'forest', level:54, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'forest', resources:['Дерево','Шкура'], zoneNumber:4, x:2, y:4 },
    'bl_3_4': { id:'bl_3_4', name:'Лес', type:'forest', level:54, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'forest', resources:['Дерево','Шкура'], zoneNumber:4, x:3, y:4 },
    'bl_4_4': { id:'bl_4_4', name:'Горы', type:'mountain', level:52, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:4, x:4, y:4 },

    // ==================== РЯД 5 ====================
    'bl_-4_5': { id:'bl_-4_5', name:'Горы', type:'mountain', level:57, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:5, x:-4, y:5 },
    'bl_-3_5': { id:'bl_-3_5', name:'Лес', type:'forest', level:59, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'forest', resources:['Дерево','Шкура'], zoneNumber:5, x:-3, y:5 },
    'bl_-2_5': { id:'bl_-2_5', name:'Лес', type:'forest', level:59, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'forest', resources:['Дерево','Шкура'], zoneNumber:5, x:-2, y:5 },
    'bl_-1_5': { id:'bl_-1_5', name:'Тракт Баклеров', type:'road', level:60, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:5, x:-1, y:5 },
    'bl_0_5': { id:'bl_0_5', name:'Тракт Баклеров', type:'road', level:60, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:['Перекрёсток'], actions:[], zoneNumber:5, x:0, y:5 },
    'bl_1_5': { id:'bl_1_5', name:'Тракт Баклеров', type:'road', level:60, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:5, x:1, y:5 },
    'bl_2_5': { id:'bl_2_5', name:'Лес', type:'forest', level:59, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'forest', resources:['Дерево','Шкура'], zoneNumber:5, x:2, y:5 },
    'bl_3_5': { id:'bl_3_5', name:'Лес', type:'forest', level:59, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'forest', resources:['Дерево','Шкура'], zoneNumber:5, x:3, y:5 },
    'bl_4_5': { id:'bl_4_5', name:'Горы', type:'mountain', level:57, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:5, x:4, y:5 },

    // ==================== РЯД 6 ====================
    'bl_-4_6': { id:'bl_-4_6', name:'Горы', type:'mountain', level:62, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:6, x:-4, y:6 },
    'bl_-3_6': { id:'bl_-3_6', name:'Лес', type:'forest', level:64, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'forest', resources:['Дерево','Шкура'], zoneNumber:6, x:-3, y:6 },
    'bl_-2_6': { id:'bl_-2_6', name:'Лес', type:'forest', level:64, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'forest', resources:['Дерево','Шкура'], zoneNumber:6, x:-2, y:6 },
    'bl_-1_6': { id:'bl_-1_6', name:'Тракт Баклеров', type:'road', level:65, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:6, x:-1, y:6 },
    'bl_0_6': { id:'bl_0_6', name:'Тракт Баклеров', type:'road', level:65, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:['Привал'], actions:[], zoneNumber:6, x:0, y:6 },
    'bl_1_6': { id:'bl_1_6', name:'Тракт Баклеров', type:'road', level:65, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:6, x:1, y:6 },
    'bl_2_6': { id:'bl_2_6', name:'Лес', type:'forest', level:64, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'forest', resources:['Дерево','Шкура'], zoneNumber:6, x:2, y:6 },
    'bl_3_6': { id:'bl_3_6', name:'Лес', type:'forest', level:64, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'forest', resources:['Дерево','Шкура'], zoneNumber:6, x:3, y:6 },
    'bl_4_6': { id:'bl_4_6', name:'Горы', type:'mountain', level:62, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:6, x:4, y:6 },

    // ==================== РЯД 7 ====================
    'bl_-4_7': { id:'bl_-4_7', name:'Горы', type:'mountain', level:67, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:7, x:-4, y:7 },
    'bl_-3_7': { id:'bl_-3_7', name:'Предгорье', type:'mountain', level:69, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:7, x:-3, y:7 },
    'bl_-2_7': { id:'bl_-2_7', name:'Предгорье', type:'mountain', level:69, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:7, x:-2, y:7 },
    'bl_-1_7': { id:'bl_-1_7', name:'Тракт Баклеров', type:'road', level:70, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:7, x:-1, y:7 },
    'bl_0_7': { id:'bl_0_7', name:'Тракт Баклеров', type:'road', level:70, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:['Колодец'], actions:[], zoneNumber:7, x:0, y:7 },
    'bl_1_7': { id:'bl_1_7', name:'Тракт Баклеров', type:'road', level:70, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:7, x:1, y:7 },
    'bl_2_7': { id:'bl_2_7', name:'Предгорье', type:'mountain', level:69, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:7, x:2, y:7 },
    'bl_3_7': { id:'bl_3_7', name:'Предгорье', type:'mountain', level:69, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:7, x:3, y:7 },
    'bl_4_7': { id:'bl_4_7', name:'Горы', type:'mountain', level:67, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:7, x:4, y:7 },

    // ==================== РЯД 8 (Южная граница) ====================
    'bl_-4_8': { id:'bl_-4_8', name:'Южная граница', type:'mountain', level:72, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень'], zoneNumber:8, x:-4, y:8 },
    'bl_-3_8': { id:'bl_-3_8', name:'Южная граница', type:'mountain', level:74, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень'], zoneNumber:8, x:-3, y:8 },
    'bl_-2_8': { id:'bl_-2_8', name:'Южная граница', type:'mountain', level:74, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень'], zoneNumber:8, x:-2, y:8 },
    'bl_-1_8': { id:'bl_-1_8', name:'Тракт Баклеров', type:'road', level:75, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:8, x:-1, y:8 },
    'bl_0_8': { id:'bl_0_8', name:'Тракт Баклеров: Конец', type:'road', level:80, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:['Пограничный камень'], actions:[], zoneNumber:8, x:0, y:8 },
    'bl_1_8': { id:'bl_1_8', name:'Тракт Баклеров', type:'road', level:75, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], zoneNumber:8, x:1, y:8 },
    'bl_2_8': { id:'bl_2_8', name:'Южная граница', type:'mountain', level:74, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень'], zoneNumber:8, x:2, y:8 },
    'bl_3_8': { id:'bl_3_8', name:'Южная граница', type:'mountain', level:74, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень'], zoneNumber:8, x:3, y:8 },
    'bl_4_8': { id:'bl_4_8', name:'Южная граница', type:'mountain', level:72, region:'Штормовые земли', area:'Баклеры', owner:'crown', places:[], actions:[], resourceType:'mountain', resources:['Камень'], zoneNumber:8, x:4, y:8 }
};

// Добавляем в глобальный мир
Object.assign(WORLD_AREAS, BUCKLER_AREAS);

// Строим переходы
buildWorldTransitions();

// ============================================================
// STORY
// ============================================================

var _bucklerPrevUpdateStory = window.updateStory;
window.updateStory = function() {
    var g = users[currentUser].game; var place = g.location.place; var loc = WORLD_AREAS[place];
    if (!g.location.locationId || !WORLD_AREAS[g.location.locationId]) g.location.locationId = place;
    if (!loc) { if (typeof _bucklerPrevUpdateStory === 'function') return _bucklerPrevUpdateStory(); return; }
    document.getElementById('story-title').textContent = '📍 ' + loc.name + ' (ур.' + loc.level + ')';
    var desc = { road:'🛤️ Дорога', forest:'🌲 Лес', coast:'🏖️ Берег', crossroads:'🔄 Перекрёсток', river:'🏞️ Река', mountain:'⛰️ Горы', plain:'🌾 Равнина', castle:'🏰 Замок' };
    document.getElementById('story-text').textContent = desc[loc.type] || '📍 ' + loc.name;
};

// ============================================================
// ACTIONS
// ============================================================

var _bucklerPrevUpdateActions = window.updateActions;
window.updateActions = function() {
    var g = users[currentUser].game; var place = g.location.place;
    var container = document.getElementById('actions-container'); if (!container) return;
    
    var loc = WORLD_AREAS[place];
    if (!loc && g.location.parentZone) {
        loc = WORLD_AREAS[g.location.parentZone];
    }
    
    if (!loc) { if (typeof _bucklerPrevUpdateActions === 'function') return _bucklerPrevUpdateActions(); return; }
    
    g.location.locationId = g.location.parentZone || place;
    container.innerHTML = '';
    var actions = (loc.actions || []).slice();
    
    if (loc.places && loc.places.indexOf('Шахта') !== -1 && g.location.place === 'Шахта') {
        actions.push({ id: 'mine', label: '⛏️ Добывать' });
    }
    if (loc.places && loc.places.indexOf('Лесосека') !== -1 && g.location.place === 'Лесосека') {
        actions.push({ id: 'woodcut', label: '🪓 Рубить лес' });
    }
    
    actions.push({ id:'map', label:'🗺️ Карта' },{ id:'compass', label:'🧭 Компас' },{ id:'search', label:'🔍 Поиск' },
                 { id:'inventory', label:'🎒 Инвентарь' },{ id:'character', label:'👤 Персонаж' },{ id:'menu', label:'📋 Меню' });
    actions.forEach(function(a) {
        var btn = document.createElement('button'); btn.className='btn-game'; btn.textContent=a.label;
        btn.onclick = (function(id){ return function(){
            if (typeof gameAction==='function') gameAction(id); else setMessage('❌ Действие недоступно.');
        }; })(a.id);
        container.appendChild(btn);
    });
};

console.log('✅ Баклеры загружены (81 зона, 9×9)');

// ============================================================
// js/regions/crownlands/areas.js — КООРДИНАТНАЯ СИСТЕМА (33 ЗОНЫ)
// ============================================================

const KL_AREAS = {
    // ЦЕНТР
    'kl_0_0': { id:'kl_0_0', name:'Перекрёсток у Гавани', type:'crossroads', level:1, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Придорожный камень','Столб с указателями'], actions:[{ id:'enter_city', label:'🚶 Войти в город' }], x:0, y:0 },

    // ⬆️ СЕВЕР (x=0, y=-1..-4)
    'kl_0_-1': { id:'kl_0_-1', name:'Королевский тракт: Северные ворота', type:'road', level:5, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старый колодец'], actions:[], x:0, y:-1 },
    'kl_0_-2': { id:'kl_0_-2', name:'Королевский тракт: Придорожная роща', type:'road', level:10, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Привал'], actions:[], x:0, y:-2 },
    'kl_0_-3': { id:'kl_0_-3', name:'Королевский тракт: Смотровая вышка', type:'road', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Древний курган'], actions:[], x:0, y:-3 },
    'kl_0_-4': { id:'kl_0_-4', name:'Королевский тракт: Граница Речных земель', type:'road', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Пограничный камень'], actions:[], x:0, y:-4 },

    // ↘️ ЮГ (x=0, y=1..4)
    'kl_0_1': { id:'kl_0_1', name:'Королевский тракт: Южные ворота', type:'road', level:5, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Придорожный камень'], actions:[], x:0, y:1 },
    'kl_0_2': { id:'kl_0_2', name:'Королевский тракт: Придорожный привал', type:'road', level:10, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Привал'], actions:[], x:0, y:2 },
    'kl_0_3': { id:'kl_0_3', name:'Королевский тракт: Сторожевая вышка', type:'road', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старая вышка'], actions:[], x:0, y:3 },
    'kl_0_4': { id:'kl_0_4', name:'Королевский тракт: Граница Штормовых земель', type:'road', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Пограничный камень'], actions:[], x:0, y:4 },

    // ⬅️ ЗАПАД (x=-1..-4, y=0)
    'kl_-1_0': { id:'kl_-1_0', name:'Золотая дорога: Западные ворота', type:'road', level:5, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Придорожный камень'], actions:[], x:-1, y:0 },
    'kl_-2_0': { id:'kl_-2_0', name:'Золотая дорога: Старая мельница', type:'road', level:10, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Мельничный пруд'], actions:[], x:-2, y:0 },
    'kl_-3_0': { id:'kl_-3_0', name:'Золотая дорога: Заброшенная ферма', type:'road', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старый амбар'], actions:[], x:-3, y:0 },
    'kl_-4_0': { id:'kl_-4_0', name:'Золотая дорога: Граница Простора', type:'road', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Пограничный камень'], actions:[], x:-4, y:0 },

    // ↗️ СЕВЕРО-ВОСТОК — БЕРЕГ (x=1, y=-1..-4)
    'kl_1_-1': { id:'kl_1_-1', name:'Берег Чёрноводной: Песчаный пляж', type:'coast', level:5, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:[], actions:[], x:1, y:-1 },
    'kl_1_-2': { id:'kl_1_-2', name:'Берег Чёрноводной: Скалистый мыс', type:'coast', level:10, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Рыбацкие лодки'], actions:[], x:1, y:-2 },
    'kl_1_-3': { id:'kl_1_-3', name:'Берег Чёрноводной: Причал', type:'coast', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Деревня','Старый причал'], actions:[], x:1, y:-3 },
    'kl_1_-4': { id:'kl_1_-4', name:'Берег Чёрноводной: Старый маяк', type:'coast', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Заброшенный маяк'], actions:[], x:1, y:-4 },

    // ↘️ ЮГО-ВОСТОК — БЕРЕГ (x=1, y=1..4)
    'kl_1_1': { id:'kl_1_1', name:'Южный берег: Песчаная коса', type:'coast', level:5, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:[], actions:[], x:1, y:1 },
    'kl_1_2': { id:'kl_1_2', name:'Южный берег: Солёные скалы', type:'coast', level:10, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:[], actions:[], x:1, y:2 },
    'kl_1_3': { id:'kl_1_3', name:'Южный берег: Старый причал', type:'coast', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Деревня','Ветхий причал'], actions:[], x:1, y:3 },
    'kl_1_4': { id:'kl_1_4', name:'Южный берег: Бухта', type:'coast', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Пещера в скалах'], actions:[], x:1, y:4 },

    // ↙️ ЮГО-ЗАПАД — РЕКА (x=-1, y=1..4)
    'kl_-1_1': { id:'kl_-1_1', name:'Черноводная: Речной берег', type:'coast', level:5, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:[], actions:[], x:-1, y:1 },
    'kl_-1_2': { id:'kl_-1_2', name:'Черноводная: Паромная переправа', type:'coast', level:10, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Деревня','Причал'], actions:[], x:-1, y:2 },
    'kl_-1_3': { id:'kl_-1_3', name:'Черноводная: Водяная мельница', type:'coast', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Мельничное колесо'], actions:[], x:-1, y:3 },
    'kl_-1_4': { id:'kl_-1_4', name:'Черноводная: Старый мост', type:'coast', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Каменный мост'], actions:[], x:-1, y:4 },

    // ↖️ СЕВЕРО-ЗАПАД — ЛЕС (x=-1, y=-1..-4)
    'kl_-1_-1': { id:'kl_-1_-1', name:'Королевский лес: Лесная тропа', type:'forest', level:5, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старый дуб'], actions:[], x:-1, y:-1 },
    'kl_-1_-2': { id:'kl_-1_-2', name:'Королевский лес: Поляна', type:'forest', level:10, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Деревня','Кострище'], actions:[], x:-1, y:-2 },
    'kl_-1_-3': { id:'kl_-1_-3', name:'Королевский лес: Мельничный ручей', type:'forest', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Заброшенная мельница'], actions:[], x:-1, y:-3 },
    'kl_-1_-4': { id:'kl_-1_-4', name:'Королевский лес: Развалины крепости', type:'forest', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старые руины'], actions:[], x:-1, y:-4 }
};

// ============================================================
// АВТОГЕНЕРАЦИЯ ПЕРЕХОДОВ ПО КООРДИНАТАМ
// ============================================================

function findZoneByCoords(x, y) {
    for (var id in KL_AREAS) {
        if (KL_AREAS[id].x === x && KL_AREAS[id].y === y) return id;
    }
    return null;
}

var KL_TRANSITIONS = {};
for (var id in KL_AREAS) {
    var z = KL_AREAS[id];
    KL_TRANSITIONS[id] = {};
    var dirs = { n:[0,-1], ne:[1,-1], e:[1,0], se:[1,1], s:[0,1], sw:[-1,1], w:[-1,0], nw:[-1,-1] };
    for (var d in dirs) {
        var neighbor = findZoneByCoords(z.x + dirs[d][0], z.y + dirs[d][1]);
        KL_TRANSITIONS[id][d] = neighbor || null;
    }
                }

// ============================================================
// js/regions/crownlands/areas.js — 121 ЗОНА (11×11) + ГЛОБАЛЬНАЯ СИСТЕМА
// ============================================================

const WORLD_AREAS = window.WORLD_AREAS || {};
const CROWNLANDS_AREAS = {

    // ==================== ЦЕНТР ====================
    'kl_0_0': { id:'kl_0_0', name:'Перекрёсток у Гавани', type:'crossroads', level:1, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Придорожный камень','Столб с указателями'], actions:[{id:'enter_city',label:'🚶 Войти в город'}], zoneNumber:0, x:0, y:0 },

    // ==================== СЕВЕР — Северный тракт ====================
    'kl_-4_-5': { id:'kl_-4_-5', name:'Северная опушка', type:'forest', level:30, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Охотничья тропа'], actions:[], resourceType:'forest', resources:[{name:'Дерево',chance:25},{name:'Шкура',chance:20}], zoneNumber:5, x:-4, y:-5 },
    'kl_-3_-5': { id:'kl_-3_-5', name:'Чаща', type:'forest', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Волчье логово'], actions:[], resourceType:'forest', resources:[{name:'Дерево',chance:25},{name:'Мясо',chance:20}], zoneNumber:5, x:-3, y:-5 },
    'kl_-2_-5': { id:'kl_-2_-5', name:'Северный рубеж', type:'plain', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Пограничная застава'], actions:[], resourceType:'plain', resources:['Пшеница','Камень'], zoneNumber:5, x:-2, y:-5 },
    'kl_-1_-5': { id:'kl_-1_-5', name:'Северный рубеж', type:'plain', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Дозорная башня'], actions:[], resourceType:'plain', resources:['Пшеница','Камень'], zoneNumber:5, x:-1, y:-5 },
    'kl_0_-5':  { id:'kl_0_-5', name:'Северный тракт 5', type:'road', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Пограничный камень','Застава'], actions:[], zoneNumber:5, x:0, y:-5 },
    'kl_1_-5':  { id:'kl_1_-5', name:'Северо-восточный рубеж', type:'mountain', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старая крепость'], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:5, x:1, y:-5 },
    'kl_2_-5':  { id:'kl_2_-5', name:'Северо-восточные холмы', type:'mountain', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Заброшенная шахта'], actions:[], resourceType:'mountain', resources:['Камень','Руда','Уголь'], zoneNumber:5, x:2, y:-5 },
    'kl_3_-5':  { id:'kl_3_-5', name:'Прибрежные скалы', type:'mountain', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Смотровая площадка'], actions:[], resourceType:'mountain', resources:['Камень'], zoneNumber:5, x:3, y:-5 },
    'kl_4_-5':  { id:'kl_4_-5', name:'Утёс над морем', type:'mountain', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старый маяк'], actions:[], resourceType:'mountain', resources:['Камень'], zoneNumber:5, x:4, y:-5 },
    'kl_5_-5':  { id:'kl_5_-5', name:'Крайний утёс', type:'mountain', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Руины дозорной башни'], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:5, x:5, y:-5 },

    'kl_0_-1': { id:'kl_0_-1', name:'Северный тракт 1', type:'road', level:5, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старый колодец'], actions:[], zoneNumber:1, x:0, y:-1 },
    'kl_0_-2': { id:'kl_0_-2', name:'Северный тракт 2', type:'road', level:10, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Привал'], actions:[], zoneNumber:2, x:0, y:-2 },
    'kl_0_-3': { id:'kl_0_-3', name:'Северный тракт 3', type:'road', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Древний курган'], actions:[], zoneNumber:3, x:0, y:-3 },
    'kl_0_-4': { id:'kl_0_-4', name:'Северный тракт 4', type:'road', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Пограничный камень'], actions:[], zoneNumber:4, x:0, y:-4 },

    // ==================== ЮГ — Королевский тракт ====================
    'kl_-4_5': { id:'kl_-4_5', name:'Южное пастбище', type:'plain', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Пастушья хижина'], actions:[], resourceType:'plain', resources:['Пшеница','Овощи'], zoneNumber:5, x:-4, y:5 },
    'kl_-3_5': { id:'kl_-3_5', name:'Южный рубеж', type:'plain', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Пограничный пост'], actions:[], resourceType:'plain', resources:['Пшеница','Камень'], zoneNumber:5, x:-3, y:5 },
    'kl_-2_5': { id:'kl_-2_5', name:'Южный рубеж', type:'plain', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Деревня'], actions:[], resourceType:'plain', resources:['Пшеница','Овощи'], zoneNumber:5, x:-2, y:5 },
    'kl_-1_5': { id:'kl_-1_5', name:'Равнина', type:'plain', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Придорожная таверна'], actions:[], resourceType:'plain', resources:['Пшеница','Овощи'], zoneNumber:5, x:-1, y:5 },
    'kl_0_5':  { id:'kl_0_5', name:'Королевский тракт 5', type:'road', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Пограничная застава','Таверна'], actions:[], zoneNumber:5, x:0, y:5 },
    'kl_1_5':  { id:'kl_1_5', name:'Юго-восточная равнина', type:'plain', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Ферма'], actions:[], resourceType:'plain', resources:['Пшеница','Овощи'], zoneNumber:5, x:1, y:5 },
    'kl_2_5':  { id:'kl_2_5', name:'Юго-восточный рубеж', type:'plain', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Дозорная вышка'], actions:[], resourceType:'plain', resources:['Пшеница','Камень'], zoneNumber:5, x:2, y:5 },
    'kl_3_5':  { id:'kl_3_5', name:'Прибрежная равнина', type:'plain', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Рыбацкая деревня'], actions:[], resourceType:'plain', resources:['Пшеница','Овощи'], zoneNumber:5, x:3, y:5 },
    'kl_4_5':  { id:'kl_4_5', name:'Южный берег', type:'coast', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Причал'], actions:[], resourceType:'coast', resources:['Рыба','Соль'], zoneNumber:5, x:4, y:5 },
    'kl_5_5':  { id:'kl_5_5', name:'Мелководье Чёрноводной', type:'coast', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старый форт'], actions:[], resourceType:'shallows', resources:['Рыба','Соль'], zoneNumber:5, x:5, y:5 },

    'kl_0_1': { id:'kl_0_1', name:'Королевский тракт 1', type:'road', level:5, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Придорожный камень'], actions:[], zoneNumber:1, x:0, y:1 },
    'kl_0_2': { id:'kl_0_2', name:'Королевский тракт 2', type:'road', level:10, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Привал'], actions:[], zoneNumber:2, x:0, y:2 },
    'kl_0_3': { id:'kl_0_3', name:'Королевский тракт 3', type:'road', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старая вышка'], actions:[], zoneNumber:3, x:0, y:3 },
    'kl_0_4': { id:'kl_0_4', name:'Королевский тракт 4', type:'road', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Пограничный камень'], actions:[], zoneNumber:4, x:0, y:4 },

    // ==================== ЗАПАД — Золотой тракт ====================
    'kl_-5_-4': { id:'kl_-5_-4', name:'Западная чаща', type:'forest', level:30, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Берлога'], actions:[], resourceType:'forest', resources:[{name:'Дерево',chance:30},{name:'Мясо',chance:20}], zoneNumber:4, x:-5, y:-4 },
    'kl_-5_-3': { id:'kl_-5_-3', name:'Западный лес', type:'forest', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Лесной лагерь'], actions:[], resourceType:'forest', resources:[{name:'Дерево',chance:30},{name:'Шкура',chance:20}], zoneNumber:3, x:-5, y:-3 },
    'kl_-5_-2': { id:'kl_-5_-2', name:'Западная опушка', type:'forest', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старая тропа'], actions:[], resourceType:'forest', resources:[{name:'Дерево',chance:25},{name:'Шкура',chance:15}], zoneNumber:2, x:-5, y:-2 },
    'kl_-5_-1': { id:'kl_-5_-1', name:'Западный тракт', type:'road', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Придорожный камень'], actions:[], zoneNumber:1, x:-5, y:-1 },
    'kl_-5_0':  { id:'kl_-5_0', name:'Золотой тракт 5', type:'road', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Пограничная застава','Таверна'], actions:[], zoneNumber:5, x:-5, y:0 },
    'kl_-5_1':  { id:'kl_-5_1', name:'Западная река', type:'river', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Брод'], actions:[], resourceType:'river', resources:['Рыба','Вода'], zoneNumber:1, x:-5, y:1 },
    'kl_-5_2':  { id:'kl_-5_2', name:'Западная пойма', type:'plain', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Деревня'], actions:[], resourceType:'plain', resources:['Пшеница','Овощи'], zoneNumber:2, x:-5, y:2 },
    'kl_-5_3':  { id:'kl_-5_3', name:'Западные холмы', type:'mountain', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Каменоломня'], actions:[], resourceType:'mountain', resources:['Камень','Руда'], zoneNumber:3, x:-5, y:3 },
    'kl_-5_4':  { id:'kl_-5_4', name:'Западный рубеж', type:'mountain', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Пограничный форт'], actions:[], resourceType:'mountain', resources:['Камень'], zoneNumber:4, x:-5, y:4 },
    'kl_-5_5':  { id:'kl_-5_5', name:'Южная равнина', type:'plain', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старая мельница'], actions:[], resourceType:'plain', resources:['Пшеница','Овощи'], zoneNumber:5, x:-5, y:5 },

    'kl_-1_0': { id:'kl_-1_0', name:'Золотой тракт 1', type:'road', level:5, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Придорожный камень'], actions:[], zoneNumber:1, x:-1, y:0 },
    'kl_-2_0': { id:'kl_-2_0', name:'Золотой тракт 2', type:'road', level:10, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Мельничный пруд'], actions:[], zoneNumber:2, x:-2, y:0 },
    'kl_-3_0': { id:'kl_-3_0', name:'Золотой тракт 3', type:'road', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старый амбар'], actions:[], zoneNumber:3, x:-3, y:0 },
    'kl_-4_0': { id:'kl_-4_0', name:'Золотой тракт 4', type:'road', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Пограничный камень'], actions:[], zoneNumber:4, x:-4, y:0 },

    // ==================== ВОСТОК — Мелководье Чёрноводной ====================
    'kl_5_-4': { id:'kl_5_-4', name:'Мелководье Чёрноводной', type:'coast', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Остов корабля'], actions:[], resourceType:'shallows', resources:['Рыба','Соль'], zoneNumber:4, x:5, y:-4 },
    'kl_5_-3': { id:'kl_5_-3', name:'Мелководье Чёрноводной', type:'coast', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Затонувший корабль'], actions:[], resourceType:'shallows', resources:['Рыба','Соль'], zoneNumber:3, x:5, y:-3 },
    'kl_5_-2': { id:'kl_5_-2', name:'Мелководье Чёрноводной', type:'coast', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Рифы'], actions:[], resourceType:'shallows', resources:['Рыба','Соль'], zoneNumber:2, x:5, y:-2 },
    'kl_5_-1': { id:'kl_5_-1', name:'Мелководье Чёрноводной', type:'coast', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Рыбацкий лагерь'], actions:[], resourceType:'shallows', resources:['Рыба','Соль'], zoneNumber:1, x:5, y:-1 },
    'kl_5_0':  { id:'kl_5_0', name:'Мелководье Чёрноводной', type:'coast', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Затонувший дромон','Риф'], actions:[], resourceType:'shallows', resources:['Рыба','Соль'], zoneNumber:5, x:5, y:0 },
    'kl_5_1':  { id:'kl_5_1', name:'Восточный берег', type:'coast', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Песчаная коса'], actions:[], resourceType:'coast', resources:['Рыба','Соль'], zoneNumber:1, x:5, y:1 },
    'kl_5_2':  { id:'kl_5_2', name:'Мелководье Чёрноводной', type:'coast', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Лагуна'], actions:[], resourceType:'shallows', resources:['Рыба','Соль'], zoneNumber:2, x:5, y:2 },
    'kl_5_3':  { id:'kl_5_3', name:'Мелководье Чёрноводной', type:'coast', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старый причал'], actions:[], resourceType:'shallows', resources:['Рыба','Соль'], zoneNumber:3, x:5, y:3 },
    'kl_5_4':  { id:'kl_5_4', name:'Мелководье Чёрноводной', type:'coast', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Сторожевая башня'], actions:[], resourceType:'shallows', resources:['Рыба','Соль'], zoneNumber:4, x:5, y:4 },

    'kl_1_0': { id:'kl_1_0', name:'Мелководье Чёрноводной', type:'coast', level:5, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старая лагуна'], actions:[], resourceType:'shallows', resources:['Рыба','Соль'], zoneNumber:1, x:1, y:0 },
    'kl_2_0': { id:'kl_2_0', name:'Мелководье Чёрноводной', type:'coast', level:10, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Затонувший корабль'], actions:[], resourceType:'shallows', resources:['Рыба','Соль'], zoneNumber:2, x:2, y:0 },
    'kl_3_0': { id:'kl_3_0', name:'Мелководье Чёрноводной', type:'coast', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Остов галеры'], actions:[], resourceType:'shallows', resources:['Рыба','Соль'], zoneNumber:3, x:3, y:0 },
    'kl_4_0': { id:'kl_4_0', name:'Мелководье Чёрноводной', type:'coast', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Затонувший дромон'], actions:[], resourceType:'shallows', resources:['Рыба','Соль'], zoneNumber:4, x:4, y:0 },

    // ==================== СЕВЕРО-ВОСТОК — Берег Чёрноводной ====================
    'kl_1_-1': { id:'kl_1_-1', name:'Песчаный пляж', type:'coast', level:5, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:[], actions:[], resourceType:'coast', resources:['Рыба','Соль'], zoneNumber:1, x:1, y:-1 },
    'kl_2_-2': { id:'kl_2_-2', name:'Скалистый мыс', type:'coast', level:10, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Рыбацкие лодки'], actions:[], resourceType:'coast', resources:['Рыба','Соль'], zoneNumber:2, x:2, y:-2 },
    'kl_3_-3': { id:'kl_3_-3', name:'Причал', type:'coast', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Деревня','Старый причал'], actions:[], resourceType:'coast', resources:['Рыба','Соль'], zoneNumber:3, x:3, y:-3 },
    'kl_4_-4': { id:'kl_4_-4', name:'Старый маяк', type:'coast', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Заброшенный маяк'], actions:[], resourceType:'coast', resources:['Рыба','Соль'], zoneNumber:4, x:4, y:-4 },

    // ==================== ЮГО-ВОСТОК — Южный берег ====================
    'kl_1_1': { id:'kl_1_1', name:'Песчаная коса', type:'coast', level:5, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:[], actions:[], resourceType:'coast', resources:['Рыба','Соль'], zoneNumber:1, x:1, y:1 },
    'kl_2_2': { id:'kl_2_2', name:'Солёные скалы', type:'coast', level:10, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:[], actions:[], resourceType:'coast', resources:['Рыба','Соль'], zoneNumber:2, x:2, y:2 },
    'kl_3_3': { id:'kl_3_3', name:'Старый причал', type:'coast', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Деревня','Ветхий причал'], actions:[], resourceType:'coast', resources:['Рыба','Соль'], zoneNumber:3, x:3, y:3 },
    'kl_4_4': { id:'kl_4_4', name:'Бухта', type:'coast', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Пещера в скалах'], actions:[], resourceType:'coast', resources:['Рыба','Соль'], zoneNumber:4, x:4, y:4 },

    // ==================== ЮГО-ЗАПАД — Р. Черноводная ====================
    'kl_-4_1':{id:'kl_-4_1',name:'Р. Черноводная',type:'river',level:5,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:1,x:-4,y:1},
    'kl_-3_2':{id:'kl_-3_2',name:'Р. Черноводная',type:'river',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:2,x:-3,y:2},
    'kl_-2_3':{id:'kl_-2_3',name:'Р. Черноводная',type:'river',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:3,x:-2,y:3},
    'kl_-1_4':{id:'kl_-1_4',name:'Р. Черноводная',type:'river',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:4,x:-1,y:4},

    // ==================== ЮГО-ЗАПАД — равнина ====================
    'kl_-4_2':{id:'kl_-4_2',name:'Равнина',type:'plain',level:5,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:2,x:-4,y:2},
    'kl_-4_3':{id:'kl_-4_3',name:'Равнина',type:'plain',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:3,x:-4,y:3},
    'kl_-4_4':{id:'kl_-4_4',name:'Равнина',type:'plain',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:4,x:-4,y:4},
    'kl_-3_3':{id:'kl_-3_3',name:'Равнина',type:'plain',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:3,x:-3,y:3},
    'kl_-3_4':{id:'kl_-3_4',name:'Равнина',type:'plain',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:4,x:-3,y:4},
    'kl_-2_4':{id:'kl_-2_4',name:'Равнина',type:'plain',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:4,x:-2,y:4},

    // ==================== ЮГО-ЗАПАД — Речной берег ====================
    'kl_-1_1':{id:'kl_-1_1',name:'Речной берег',type:'river',level:5,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:1,x:-1,y:1},

    // ==================== ЮГО-ЗАПАД — Пойма реки ====================
    'kl_-3_1':{id:'kl_-3_1',name:'Пойма реки',type:'river',level:5,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:1,x:-3,y:1},
    'kl_-2_2':{id:'kl_-2_2',name:'Пойма реки',type:'river',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:['Деревня','Причал'],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:2,x:-2,y:2},
    'kl_-2_1':{id:'kl_-2_1',name:'Пойма реки',type:'river',level:5,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:1,x:-2,y:1},
    'kl_-1_3':{id:'kl_-1_3',name:'Равнина',type:'plain',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:3,x:-1,y:3},
    'kl_-1_2':{id:'kl_-1_2',name:'Равнина',type:'plain',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:2,x:-1,y:2},

    // ==================== СЕВЕРО-ЗАПАД — Королевский лес ====================
    'kl_-1_-1': { id:'kl_-1_-1', name:'Королевский лес: Лесная тропа', type:'forest', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Лесосека','Старый дуб'], actions:[], resourceType:'forest', resources:['Дерево','Шкура','Мясо'], zoneNumber:1, x:-1, y:-1 },
    'kl_-2_-2': { id:'kl_-2_-2', name:'Королевский лес: Поляна', type:'forest', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Деревня','Кострище'], actions:[], resourceType:'forest', resources:['Дерево','Шкура','Мясо'], zoneNumber:2, x:-2, y:-2 },
    'kl_-3_-3': { id:'kl_-3_-3', name:'Королевский лес: Мельничный ручей', type:'forest', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Заброшенная мельница'], actions:[], resourceType:'forest', resources:['Дерево','Шкура','Мясо'], zoneNumber:3, x:-3, y:-3 },
    'kl_-4_-4': { id:'kl_-4_-4', name:'Королевский лес: Развалины крепости', type:'forest', level:30, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старые руины'], actions:[], resourceType:'forest', resources:['Дерево','Шкура','Мясо'], zoneNumber:4, x:-4, y:-4 },
    'kl_-5_-5': { id:'kl_-5_-5', name:'Глубь Королевского леса', type:'forest', level:35, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Древний дуб','Заброшенная хижина'], actions:[], resourceType:'forest', resources:[{name:'Дерево',chance:30},{name:'Шкура',chance:20},{name:'Мясо',chance:15}], zoneNumber:5, x:-5, y:-5 },

    // ==================== Сектор ЗАПАД — СЕВЕРО-ЗАПАД ====================
    'kl_-2_-1':{id:'kl_-2_-1',name:'Опушка леса',type:'forest',level:5,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'forest',resources:['Дерево','Шкура','Мясо'],zoneNumber:1,x:-2,y:-1},
    'kl_-3_-2':{id:'kl_-3_-2',name:'Опушка леса',type:'forest',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'forest',resources:['Дерево','Шкура','Мясо'],zoneNumber:2,x:-3,y:-2},
    'kl_-4_-3':{id:'kl_-4_-3',name:'Опушка леса',type:'forest',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'forest',resources:['Дерево','Шкура','Мясо'],zoneNumber:3,x:-4,y:-3},
    'kl_-3_-1':{id:'kl_-3_-1',name:'Опушка леса',type:'forest',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'forest',resources:['Дерево','Шкура','Мясо'],zoneNumber:2,x:-3,y:-1},
    'kl_-4_-2':{id:'kl_-4_-2',name:'Опушка леса',type:'forest',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'forest',resources:['Дерево','Шкура','Мясо'],zoneNumber:3,x:-4,y:-2},
    'kl_-4_-1':{id:'kl_-4_-1',name:'Опушка леса',type:'forest',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'forest',resources:['Дерево','Шкура','Мясо'],zoneNumber:4,x:-4,y:-1},

    // ==================== Сектор СЕВЕР — СЕВЕРО-ВОСТОК ====================
    'kl_1_-2':{id:'kl_1_-2',name:'Прибрежные холмы',type:'mountain',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'mountain',resources:['Камень','Руда'],zoneNumber:2,x:1,y:-2},
    'kl_1_-3':{id:'kl_1_-3',name:'Прибрежные холмы',type:'mountain',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'mountain',resources:['Камень','Руда'],zoneNumber:3,x:1,y:-3},
    'kl_2_-3':{id:'kl_2_-3',name:'Шахта',type:'mountain',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:['Шахта'],actions:[],resourceType:'mountain',resources:[{name:'Камень',chance:70},{name:'Уголь',chance:20},{name:'Руда',chance:10}],zoneNumber:3,x:2,y:-3},
    'kl_1_-4':{id:'kl_1_-4',name:'Прибрежные холмы',type:'mountain',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'mountain',resources:['Камень','Руда'],zoneNumber:4,x:1,y:-4},
    'kl_2_-4':{id:'kl_2_-4',name:'Прибрежные холмы',type:'mountain',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'mountain',resources:['Камень','Руда'],zoneNumber:4,x:2,y:-4},
    'kl_3_-4':{id:'kl_3_-4',name:'Прибрежные холмы',type:'mountain',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'mountain',resources:['Камень','Руда'],zoneNumber:4,x:3,y:-4},

    // ==================== Сектор СЕВЕРО-ВОСТОК — ВОСТОК (Мелководье) ====================
    'kl_2_-1':{id:'kl_2_-1',name:'Мелководье',type:'coast',level:5,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'shallows',resources:['Рыба','Соль'],zoneNumber:1,x:2,y:-1},
    'kl_3_-2':{id:'kl_3_-2',name:'Мелководье',type:'coast',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'shallows',resources:['Рыба','Соль'],zoneNumber:2,x:3,y:-2},
    'kl_4_-3':{id:'kl_4_-3',name:'Мелководье',type:'coast',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'shallows',resources:['Рыба','Соль'],zoneNumber:3,x:4,y:-3},
    'kl_3_-1':{id:'kl_3_-1',name:'Мелководье',type:'coast',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'shallows',resources:['Рыба','Соль'],zoneNumber:2,x:3,y:-1},
    'kl_4_-2':{id:'kl_4_-2',name:'Мелководье',type:'coast',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'shallows',resources:['Рыба','Соль'],zoneNumber:3,x:4,y:-2},
    'kl_4_-1':{id:'kl_4_-1',name:'Мелководье',type:'coast',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'shallows',resources:['Рыба','Соль'],zoneNumber:4,x:4,y:-1},

    // ==================== Сектор ВОСТОК — ЮГО-ВОСТОК (Мелководье) ====================
    'kl_2_1':{id:'kl_2_1',name:'Мелководье',type:'coast',level:5,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'shallows',resources:['Рыба','Соль'],zoneNumber:1,x:2,y:1},
    'kl_3_2':{id:'kl_3_2',name:'Мелководье',type:'coast',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'shallows',resources:['Рыба','Соль'],zoneNumber:2,x:3,y:2},
    'kl_4_3':{id:'kl_4_3',name:'Мелководье',type:'coast',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'shallows',resources:['Рыба','Соль'],zoneNumber:3,x:4,y:3},
    'kl_3_1':{id:'kl_3_1',name:'Мелководье',type:'coast',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'shallows',resources:['Рыба','Соль'],zoneNumber:2,x:3,y:1},
    'kl_4_2':{id:'kl_4_2',name:'Мелководье',type:'coast',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'shallows',resources:['Рыба','Соль'],zoneNumber:3,x:4,y:2},
    'kl_4_1':{id:'kl_4_1',name:'Мелководье',type:'coast',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'shallows',resources:['Рыба','Соль'],zoneNumber:4,x:4,y:1},

    // ==================== Сектор ЮГО-ВОСТОК — ЮГ (Равнина) ====================
    'kl_1_2':{id:'kl_1_2',name:'Равнина',type:'plain',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:['Деревня'],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:2,x:1,y:2},
    'kl_1_3':{id:'kl_1_3',name:'Равнина',type:'plain',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:3,x:1,y:3},
    'kl_2_3':{id:'kl_2_3',name:'Равнина',type:'plain',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:3,x:2,y:3},
    'kl_1_4':{id:'kl_1_4',name:'Равнина',type:'plain',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:4,x:1,y:4},
    'kl_2_4':{id:'kl_2_4',name:'Равнина',type:'plain',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:4,x:2,y:4},
    'kl_3_4':{id:'kl_3_4',name:'Равнина',type:'plain',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:4,x:3,y:4},

    // ==================== Сектор СЕВЕРО-ЗАПАД — СЕВЕР ====================
    'kl_-1_-2':{id:'kl_-1_-2',name:'Предлесье',type:'plain',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:2,x:-1,y:-2},
    'kl_-1_-3':{id:'kl_-1_-3',name:'Предлесье',type:'plain',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:3,x:-1,y:-3},
    'kl_-2_-3':{id:'kl_-2_-3',name:'Предлесье',type:'plain',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:3,x:-2,y:-3},
    'kl_-1_-4':{id:'kl_-1_-4',name:'Предлесье',type:'plain',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:4,x:-1,y:-4},
    'kl_-2_-4':{id:'kl_-2_-4',name:'Предлесье',type:'plain',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:4,x:-2,y:-4},
    'kl_-3_-4':{id:'kl_-3_-4',name:'Предлесье',type:'plain',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'plain',resources:['Пшеница','Овощи'],zoneNumber:4,x:-3,y:-4}
};

// Добавляем в глобальный мир
Object.assign(WORLD_AREAS, CROWNLANDS_AREAS);
window.WORLD_AREAS = WORLD_AREAS;

// Сохраняем предыдущие обработчики ДО переопределения
var _areasPrevUpdateStory = window.updateStory;
var _areasPrevUpdateActions = window.updateActions;

// ============================================================
// ГЛОБАЛЬНЫЙ ГЕНЕРАТОР ПЕРЕХОДОВ
// ============================================================

var _dirs = { n:[0,-1], ne:[1,-1], e:[1,0], se:[1,1], s:[0,1], sw:[-1,1], w:[-1,0], nw:[-1,-1] };

function buildWorldTransitions() {
    window.WORLD_TRANSITIONS = {};
    for (var id in WORLD_AREAS) {
        var z = WORLD_AREAS[id];
        WORLD_TRANSITIONS[id] = {};
        for (var d in _dirs) {
            var nx = z.x + _dirs[d][0];
            var ny = z.y + _dirs[d][1];
            WORLD_TRANSITIONS[id][d] = null;
            for (var tid in WORLD_AREAS) {
                if (WORLD_AREAS[tid].x === nx && WORLD_AREAS[tid].y === ny) {
                    WORLD_TRANSITIONS[id][d] = tid;
                    break;
                }
            }
        }
    }
    console.log('✅ WORLD_TRANSITIONS построен (' + Object.keys(WORLD_AREAS).length + ' зон)');
}

// ============================================================
// КАРТА С МЕСТАМИ
// ============================================================

window.openPlaces = function() {
    var g = users[currentUser].game;
    var locationId = g.location.parentZone || g.location.locationId || g.location.place;
    var loc = WORLD_AREAS[locationId];
    if (!loc) { setMessage('📍 Вы не на внешней локации.'); return; }
    
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
    html += '<div class="modal-section">';
    html += '<button class="btn btn-game" onclick="goToPlace(\'' + locationId + '\'); closePlaces();">🏠 Вернуться в центр</button>';
    
    if (loc.places && loc.places.length > 0) {
        loc.places.forEach(function(p) {
            var isCurrent = (p === g.location.place);
            html += '<div class="row"><span class="label">📍 '+p+(isCurrent?' ⭐':'')+'</span>';
            if (!isCurrent) {
                html += '<span class="value"><button class="btn btn-small" onclick="goToPlace(\'' + p + '\'); closePlaces();">🚶 Идти</button></span>';
            } else {
                html += '<span class="value" style="color:#6a5a48;">Вы здесь</span>';
            }
            html += '</div>';
        });
    }
    html += '</div>';
    html += '<button class="btn" onclick="closePlaces()">Закрыть</button>';
    content.innerHTML = html; modal.classList.remove('hide');
};

window.closePlaces = function() { var m = document.getElementById('modal-places'); if (m) m.classList.add('hide'); };

window.goToPlace = function(placeName) {
    var g = users[currentUser].game; if (!g) return;
    var loc = WORLD_AREAS[placeName];
    if (loc) {
        g.location.parentZone = placeName;
        g.location.place = placeName;
        setMessage('🚶 Вы подошли к ' + loc.name);
    } else {
        if (WORLD_AREAS[g.location.place]) {
            g.location.parentZone = g.location.place;
        }
        g.location.place = placeName;
        setMessage('🚶 Вы подошли к ' + placeName);
    }
    updateMenu(); updateStory(); updateActions(); saveData();
};

// ============================================================
// STORY
// ============================================================

window.updateStory = function() {
    var g = users[currentUser].game; var place = g.location.place; var loc = WORLD_AREAS[place];
    if (!g.location.locationId || !WORLD_AREAS[g.location.locationId]) g.location.locationId = place;
    if (!loc) { if (typeof _areasPrevUpdateStory === 'function') return _areasPrevUpdateStory(); return; }
    document.getElementById('story-title').textContent = '📍 ' + loc.name + ' (ур.' + loc.level + ')';
    var desc = { road:'🛤️ Дорога', forest:'🌲 Лес', coast:'🏖️ Берег', crossroads:'🔄 Перекрёсток', river:'🏞️ Река', mountain:'⛰️ Горы', plain:'🌾 Равнина' };
    document.getElementById('story-text').textContent = desc[loc.type] || '📍 ' + loc.name;
};

// ============================================================
// ACTIONS
// ============================================================

window.updateActions = function() {
    var g = users[currentUser].game; var place = g.location.place;
    var container = document.getElementById('actions-container'); if (!container) return;
    
    var loc = WORLD_AREAS[place];
    if (!loc && g.location.parentZone) {
        loc = WORLD_AREAS[g.location.parentZone];
    }
    
    if (!loc) { if (typeof _areasPrevUpdateActions === 'function') return _areasPrevUpdateActions(); return; }
    
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
            if (id==='enter_city') { g.location.place='Ворота'; g.location.location='Королевская Гавань'; g.outside=false; setMessage('🚪 Вы вошли в Королевскую Гавань.'); updateMenu(); updateStory(); updateActions(); saveData(); return; }
            if (id==='map') { if (typeof openPlaces==='function') openPlaces(); else setMessage('❌ Карта не загружена.'); return; }
            if (id==='compass') { if (typeof openCompass==='function') openCompass(); else setMessage('❌ Компас не загружен.'); return; }
            if (id==='search') { if (typeof window.doSearch==='function') window.doSearch(); else setMessage('❌ Поиск не загружен.'); return; }
            if (typeof gameAction==='function') gameAction(id); else setMessage('❌ Действие недоступно.');
        }; })(a.id);
        container.appendChild(btn);
    });
};

window.updateStory = updateStory;
window.updateActions = updateActions;

// Строим переходы
buildWorldTransitions();

console.log('✅ Королевская Гавань загружена (121 зона, 11×11, глобальная система)');

// ============================================================
// js/regions/crownlands/areas.js — 81 ЗОНА (9×9)
// ============================================================

const CROWNLANDS_AREAS = {

    // ==================== ЦЕНТР ====================
    'kl_0_0': { id:'kl_0_0', name:'Перекрёсток у Гавани', type:'crossroads', level:1, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Придорожный камень','Столб с указателями'], actions:[{id:'enter_city',label:'🚶 Войти в город'}], zoneNumber:0, x:0, y:0 },

    // ==================== СЕВЕР — Северный тракт ====================
    'kl_0_-1': { id:'kl_0_-1', name:'Северный тракт 1', type:'road', level:5, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старый колодец'], actions:[], zoneNumber:1, x:0, y:-1 },
    'kl_0_-2': { id:'kl_0_-2', name:'Северный тракт 2', type:'road', level:10, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Привал'], actions:[], zoneNumber:2, x:0, y:-2 },
    'kl_0_-3': { id:'kl_0_-3', name:'Северный тракт 3', type:'road', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Древний курган'], actions:[], zoneNumber:3, x:0, y:-3 },
    'kl_0_-4': { id:'kl_0_-4', name:'Северный тракт 4: Граница Речных земель', type:'road', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Пограничный камень'], actions:[], zoneNumber:4, x:0, y:-4 },

    // ==================== ЮГ — Королевский тракт ====================
    'kl_0_1': { id:'kl_0_1', name:'Королевский тракт 1', type:'road', level:5, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Придорожный камень'], actions:[], zoneNumber:1, x:0, y:1 },
    'kl_0_2': { id:'kl_0_2', name:'Королевский тракт 2', type:'road', level:10, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Привал'], actions:[], zoneNumber:2, x:0, y:2 },
    'kl_0_3': { id:'kl_0_3', name:'Королевский тракт 3', type:'road', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старая вышка'], actions:[], zoneNumber:3, x:0, y:3 },
    'kl_0_4': { id:'kl_0_4', name:'Королевский тракт 4: Граница Штормовых земель', type:'road', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Пограничный камень'], actions:[], zoneNumber:4, x:0, y:4 },

    // ==================== ЗАПАД — Золотой тракт ====================
    'kl_-1_0': { id:'kl_-1_0', name:'Золотой тракт 1', type:'road', level:5, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Придорожный камень'], actions:[], zoneNumber:1, x:-1, y:0 },
    'kl_-2_0': { id:'kl_-2_0', name:'Золотой тракт 2', type:'road', level:10, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Мельничный пруд'], actions:[], zoneNumber:2, x:-2, y:0 },
    'kl_-3_0': { id:'kl_-3_0', name:'Золотой тракт 3', type:'road', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старый амбар'], actions:[], zoneNumber:3, x:-3, y:0 },
    'kl_-4_0': { id:'kl_-4_0', name:'Золотой тракт 4: Граница Простора', type:'road', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Пограничный камень'], actions:[], zoneNumber:4, x:-4, y:0 },

    // ==================== ВОСТОК — Мелководье Чёрноводной ====================
    'kl_1_0': { id:'kl_1_0', name:'Мелководье Чёрноводной', type:'coast', level:5, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старая лагуна'], actions:[], resourceType:'coast', resources:['Рыба','Соль'], zoneNumber:1, x:1, y:0 },
    'kl_2_0': { id:'kl_2_0', name:'Мелководье Чёрноводной', type:'coast', level:10, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Затонувший корабль'], actions:[], resourceType:'coast', resources:['Рыба','Соль'], zoneNumber:2, x:2, y:0 },
    'kl_3_0': { id:'kl_3_0', name:'Мелководье Чёрноводной', type:'coast', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Остов галеры'], actions:[], resourceType:'coast', resources:['Рыба','Соль'], zoneNumber:3, x:3, y:0 },
    'kl_4_0': { id:'kl_4_0', name:'Мелководье Чёрноводной', type:'coast', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Затонувший дромон'], actions:[], resourceType:'coast', resources:['Рыба','Соль'], zoneNumber:4, x:4, y:0 },

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

    // ==================== ЮГО-ЗАПАД — Черноводная ====================
    'kl_-1_1': { id:'kl_-1_1', name:'Речной берег', type:'river', level:5, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:[], actions:[], resourceType:'river', resources:['Рыба','Вода'], zoneNumber:1, x:-1, y:1 },
    'kl_-2_2': { id:'kl_-2_2', name:'Паромная переправа', type:'river', level:10, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Деревня','Причал'], actions:[], resourceType:'river', resources:['Рыба','Вода'], zoneNumber:2, x:-2, y:2 },
    'kl_-3_3': { id:'kl_-3_3', name:'Водяная мельница', type:'river', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Мельничное колесо'], actions:[], resourceType:'river', resources:['Рыба','Вода'], zoneNumber:3, x:-3, y:3 },
    'kl_-4_4': { id:'kl_-4_4', name:'Старый мост', type:'river', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Каменный мост'], actions:[], resourceType:'river', resources:['Рыба','Вода'], zoneNumber:4, x:-4, y:4 },

    // ==================== СЕВЕРО-ЗАПАД — Королевский лес ====================
    'kl_-1_-1': { id:'kl_-1_-1', name:'Королевский лес: Лесная тропа', type:'forest', level:15, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старый дуб'], actions:[], resourceType:'forest', resources:['Дерево','Шкура','Мясо'], zoneNumber:1, x:-1, y:-1 },
    'kl_-2_-2': { id:'kl_-2_-2', name:'Королевский лес: Поляна', type:'forest', level:20, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Деревня','Кострище'], actions:[], resourceType:'forest', resources:['Дерево','Шкура','Мясо'], zoneNumber:2, x:-2, y:-2 },
    'kl_-3_-3': { id:'kl_-3_-3', name:'Королевский лес: Мельничный ручей', type:'forest', level:25, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Заброшенная мельница'], actions:[], resourceType:'forest', resources:['Дерево','Шкура','Мясо'], zoneNumber:3, x:-3, y:-3 },
    'kl_-4_-4': { id:'kl_-4_-4', name:'Королевский лес: Развалины крепости', type:'forest', level:30, region:'Королевские земли', area:'Королевская Гавань', owner:'crown', places:['Старые руины'], actions:[], resourceType:'forest', resources:['Дерево','Шкура','Мясо'], zoneNumber:4, x:-4, y:-4 },

    // ==================== ЗАПОЛНЕНИЕ МЕЖДУ ЛУЧАМИ ====================

    // Сектор СЕВЕР — СЕВЕРО-ВОСТОК (Прибрежные холмы)
    'kl_1_-2':{id:'kl_1_-2',name:'Прибрежные холмы',type:'coast',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:2,x:1,y:-2},
    'kl_1_-3':{id:'kl_1_-3',name:'Прибрежные холмы',type:'coast',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:3,x:1,y:-3},
    'kl_2_-3':{id:'kl_2_-3',name:'Прибрежные холмы',type:'coast',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:3,x:2,y:-3},
    'kl_1_-4':{id:'kl_1_-4',name:'Прибрежные холмы',type:'coast',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:4,x:1,y:-4},
    'kl_2_-4':{id:'kl_2_-4',name:'Прибрежные холмы',type:'coast',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:4,x:2,y:-4},
    'kl_3_-4':{id:'kl_3_-4',name:'Прибрежные холмы',type:'coast',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:4,x:3,y:-4},

    // Сектор СЕВЕРО-ВОСТОК — ВОСТОК (Мелководье)
    'kl_2_-1':{id:'kl_2_-1',name:'Мелководье',type:'coast',level:5,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:1,x:2,y:-1},
    'kl_3_-2':{id:'kl_3_-2',name:'Мелководье',type:'coast',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:2,x:3,y:-2},
    'kl_4_-3':{id:'kl_4_-3',name:'Мелководье',type:'coast',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:3,x:4,y:-3},
    'kl_3_-1':{id:'kl_3_-1',name:'Мелководье',type:'coast',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:2,x:3,y:-1},
    'kl_4_-2':{id:'kl_4_-2',name:'Мелководье',type:'coast',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:3,x:4,y:-2},
    'kl_4_-1':{id:'kl_4_-1',name:'Мелководье',type:'coast',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:4,x:4,y:-1},

    // Сектор ВОСТОК — ЮГО-ВОСТОК (Мелководье)
    'kl_2_1':{id:'kl_2_1',name:'Мелководье',type:'coast',level:5,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:1,x:2,y:1},
    'kl_3_2':{id:'kl_3_2',name:'Мелководье',type:'coast',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:2,x:3,y:2},
    'kl_4_3':{id:'kl_4_3',name:'Мелководье',type:'coast',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:3,x:4,y:3},
    'kl_3_1':{id:'kl_3_1',name:'Мелководье',type:'coast',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:2,x:3,y:1},
    'kl_4_2':{id:'kl_4_2',name:'Мелководье',type:'coast',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:3,x:4,y:2},
    'kl_4_1':{id:'kl_4_1',name:'Мелководье',type:'coast',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:4,x:4,y:1},

    // Сектор ЮГО-ВОСТОК — ЮГ (Прибрежные дюны)
    'kl_1_2':{id:'kl_1_2',name:'Прибрежные дюны',type:'coast',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:2,x:1,y:2},
    'kl_1_3':{id:'kl_1_3',name:'Прибрежные дюны',type:'coast',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:3,x:1,y:3},
    'kl_2_3':{id:'kl_2_3',name:'Прибрежные дюны',type:'coast',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:3,x:2,y:3},
    'kl_1_4':{id:'kl_1_4',name:'Прибрежные дюны',type:'coast',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:4,x:1,y:4},
    'kl_2_4':{id:'kl_2_4',name:'Прибрежные дюны',type:'coast',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:4,x:2,y:4},
    'kl_3_4':{id:'kl_3_4',name:'Прибрежные дюны',type:'coast',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'coast',resources:['Рыба','Соль'],zoneNumber:4,x:3,y:4},

    // Сектор ЮГ — ЮГО-ЗАПАД (Речная долина)
    'kl_-1_2':{id:'kl_-1_2',name:'Речная долина',type:'river',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:2,x:-1,y:2},
    'kl_-1_3':{id:'kl_-1_3',name:'Речная долина',type:'river',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:3,x:-1,y:3},
    'kl_-2_3':{id:'kl_-2_3',name:'Речная долина',type:'river',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:3,x:-2,y:3},
    'kl_-1_4':{id:'kl_-1_4',name:'Речная долина',type:'river',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:4,x:-1,y:4},
    'kl_-2_4':{id:'kl_-2_4',name:'Речная долина',type:'river',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:4,x:-2,y:4},
    'kl_-3_4':{id:'kl_-3_4',name:'Речная долина',type:'river',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:4,x:-3,y:4},

    // Сектор ЮГО-ЗАПАД — ЗАПАД (Пойма реки)
    'kl_-2_1':{id:'kl_-2_1',name:'Пойма реки',type:'river',level:5,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:1,x:-2,y:1},
    'kl_-3_2':{id:'kl_-3_2',name:'Пойма реки',type:'river',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:2,x:-3,y:2},
    'kl_-4_3':{id:'kl_-4_3',name:'Пойма реки',type:'river',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:3,x:-4,y:3},
    'kl_-3_1':{id:'kl_-3_1',name:'Пойма реки',type:'river',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:2,x:-3,y:1},
    'kl_-4_2':{id:'kl_-4_2',name:'Пойма реки',type:'river',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:3,x:-4,y:2},
    'kl_-4_1':{id:'kl_-4_1',name:'Пойма реки',type:'river',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'river',resources:['Рыба','Вода'],zoneNumber:4,x:-4,y:1},

    // Сектор ЗАПАД — СЕВЕРО-ЗАПАД (Опушка леса)
    'kl_-2_-1':{id:'kl_-2_-1',name:'Опушка леса',type:'forest',level:5,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'forest',resources:['Дерево','Шкура','Мясо'],zoneNumber:1,x:-2,y:-1},
    'kl_-3_-2':{id:'kl_-3_-2',name:'Опушка леса',type:'forest',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'forest',resources:['Дерево','Шкура','Мясо'],zoneNumber:2,x:-3,y:-2},
    'kl_-4_-3':{id:'kl_-4_-3',name:'Опушка леса',type:'forest',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'forest',resources:['Дерево','Шкура','Мясо'],zoneNumber:3,x:-4,y:-3},
    'kl_-3_-1':{id:'kl_-3_-1',name:'Опушка леса',type:'forest',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'forest',resources:['Дерево','Шкура','Мясо'],zoneNumber:2,x:-3,y:-1},
    'kl_-4_-2':{id:'kl_-4_-2',name:'Опушка леса',type:'forest',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'forest',resources:['Дерево','Шкура','Мясо'],zoneNumber:3,x:-4,y:-2},
    'kl_-4_-1':{id:'kl_-4_-1',name:'Опушка леса',type:'forest',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'forest',resources:['Дерево','Шкура','Мясо'],zoneNumber:4,x:-4,y:-1},

    // Сектор СЕВЕРО-ЗАПАД — СЕВЕР (Предлесье)
    'kl_-1_-2':{id:'kl_-1_-2',name:'Предлесье',type:'forest',level:10,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'forest',resources:['Дерево','Шкура','Мясо'],zoneNumber:2,x:-1,y:-2},
    'kl_-1_-3':{id:'kl_-1_-3',name:'Предлесье',type:'forest',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'forest',resources:['Дерево','Шкура','Мясо'],zoneNumber:3,x:-1,y:-3},
    'kl_-2_-3':{id:'kl_-2_-3',name:'Предлесье',type:'forest',level:15,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'forest',resources:['Дерево','Шкура','Мясо'],zoneNumber:3,x:-2,y:-3},
    'kl_-1_-4':{id:'kl_-1_-4',name:'Предлесье',type:'forest',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'forest',resources:['Дерево','Шкура','Мясо'],zoneNumber:4,x:-1,y:-4},
    'kl_-2_-4':{id:'kl_-2_-4',name:'Предлесье',type:'forest',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'forest',resources:['Дерево','Шкура','Мясо'],zoneNumber:4,x:-2,y:-4},
    'kl_-3_-4':{id:'kl_-3_-4',name:'Предлесье',type:'forest',level:20,region:'Королевские земли',area:'Королевская Гавань',owner:'crown',places:[],actions:[],resourceType:'forest',resources:['Дерево','Шкура','Мясо'],zoneNumber:4,x:-3,y:-4}
};

// Добавляем в глобальный мир
Object.assign(WORLD_AREAS, CROWNLANDS_AREAS);

// ============================================================
// КАРТА
// ============================================================

window.openPlaces = function() {
    var g = users[currentUser].game;
    var locationId = g.location.locationId || g.location.place;
    if (!locationId || !WORLD_AREAS[locationId]) { setMessage('📍 Вы не на внешней локации.'); return; }
    var loc = WORLD_AREAS[locationId];
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
    var loc = WORLD_AREAS[placeName]; g.location.place = placeName;
    setMessage('🚶 Вы подошли к ' + (loc ? loc.name : placeName));
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
    var desc = { road:'🛤️ Дорога', forest:'🌲 Лес', coast:'🌊 Берег', crossroads:'🔄 Перекрёсток', river:'🌊 Река' };
    document.getElementById('story-text').textContent = desc[loc.type] || '📍 ' + loc.name;
};

// ============================================================
// ACTIONS
// ============================================================

window.updateActions = function() {
    var g = users[currentUser].game; var place = g.location.place; var loc = WORLD_AREAS[place];
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

console.log('✅ Королевская Гавань загружена (81 зона, 9×9)');

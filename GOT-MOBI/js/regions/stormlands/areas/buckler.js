// ============================================================
// js/regions/stormlands/areas/buckler.js — 121 ЗОНА (11×11) + ГЛОБАЛЬНАЯ СИСТЕМА
// Центральная локация: bl_0_0, координаты x:0, y:11
// Северная граница (стык с КЛ): y=6
// Южная граница: y=16
// Западная граница: x=-5
// Восточная граница: x=5
// ============================================================

const BUCKLER_AREAS = {

    // ==================== ЦЕНТР ====================
    'bl_0_0': { id:'bl_0_0', name:'Тракт Баклеров', x:0, y:11, type:'road', level:5, resources:[{name:'Камень',chance:15},{name:'Железная руда',chance:5}], description:'Центральный тракт владений Баклеров.' },

    // ==================== СЕВЕР — Северный тракт (y=6-10) ====================
    'bl_0_-5': { id:'bl_0_-5', name:'Северная граница', x:0, y:6, type:'road', level:7, resources:[{name:'Камень',chance:10}], description:'Северная граница владений Баклеров, стык с Королевскими землями.' },
    'bl_0_-4': { id:'bl_0_-4', name:'Северный тракт 1', x:0, y:7, type:'road', level:5, resources:[{name:'Камень',chance:15}], description:'Тракт ведущий к замку Баклеров.' },
    'bl_0_-3': { id:'bl_0_-3', name:'Северный тракт 2', x:0, y:8, type:'road', level:6, resources:[{name:'Камень',chance:15}], description:'Тракт ведущий к замку Баклеров.' },
    'bl_0_-2': { id:'bl_0_-2', name:'Подножие холма', x:0, y:9, type:'mountain', level:6, resources:[{name:'Камень',chance:20},{name:'Железная руда',chance:10}], description:'Подножие холма с видом на замок.' },
    'bl_0_-1': { id:'bl_0_-1', name:'Ворота замка', x:0, y:10, type:'castle_gate', level:8, description:'Ворота замка Бронзовый Щит.' },

    // ==================== ЮГ — Южный тракт (y=12-16) ====================
    'bl_0_1': { id:'bl_0_1', name:'Крепостной двор', x:0, y:12, type:'castle', level:8, description:'Внутренний двор замка.' },
    'bl_0_2': { id:'bl_0_2', name:'Башня лорда', x:0, y:13, type:'castle', level:9, description:'Башня лорда Баклеров.' },
    'bl_0_3': { id:'bl_0_3', name:'Тронный зал', x:0, y:14, type:'castle', level:10, description:'Тронный зал замка.' },
    'bl_0_4': { id:'bl_0_4', name:'Секретный проход', x:0, y:15, type:'dungeon', level:12, description:'Тайный проход под замком.' },
    'bl_0_5': { id:'bl_0_5', name:'Южная граница', x:0, y:16, type:'border', level:10, description:'Южная граница владений Баклеров.' },

    // ==================== ЗАПАД — Западные земли (x=-5...-1, y=11) ====================
    'bl_-5_0': { id:'bl_-5_0', name:'Западная застава', x:-5, y:11, type:'tower', level:8, description:'Западная пограничная застава.' },
    'bl_-4_0': { id:'bl_-4_0', name:'Лесная опушка', x:-4, y:11, type:'forest', level:5, resources:[{name:'Древесина',chance:25},{name:'Трава',chance:15}], description:'Опушка леса у тракта.' },
    'bl_-3_0': { id:'bl_-3_0', name:'Поля', x:-3, y:11, type:'plain', level:5, resources:[{name:'Пшеница',chance:20},{name:'Трава',chance:10}], description:'Поля крестьян владений Баклеров.' },
    'bl_-2_0': { id:'bl_-2_0', name:'Река', x:-2, y:11, type:'river', level:5, resources:[{name:'Рыба',chance:30},{name:'Вода',chance:20}], description:'Река, текущая к Узкому морю.' },
    'bl_-1_0': { id:'bl_-1_0', name:'Берег', x:-1, y:11, type:'coast', level:5, resources:[{name:'Ракушки',chance:15},{name:'Песок',chance:10}], description:'Берег Узкого моря.' },

    // ==================== ВОСТОК — Восточные земли (x=1...5, y=11) ====================
    'bl_1_0': { id:'bl_1_0', name:'Узкое море', x:1, y:11, type:'sea', level:5, resources:[{name:'Рыба',chance:20},{name:'Соль',chance:10}], description:'Воды Узкого моря.' },
    'bl_2_0': { id:'bl_2_0', name:'Остров', x:2, y:11, type:'island', level:6, description:'Маленький остров у берега.' },
    'bl_3_0': { id:'bl_3_0', name:'Открытое море', x:3, y:11, type:'sea', level:6, resources:[{name:'Рыба',chance:15}], description:'Открытые воды Узкого моря.' },
    'bl_4_0': { id:'bl_4_0', name:'Морская пучина', x:4, y:11, type:'abyss', level:8, description:'Глубокая морская пучина.' },
    'bl_5_0': { id:'bl_5_0', name:'Восточная граница', x:5, y:11, type:'border', level:10, description:'Восточная граница владений.' },

    // ==================== СЕВЕРО-ЗАПАД (x=-5...-1, y=6-10) ====================
    'bl_-1_-1': { id:'bl_-1_-1', name:'Маяк', x:-1, y:10, type:'lighthouse', level:7, description:'Старый маяк на берегу.' },
    'bl_-2_-1': { id:'bl_-2_-1', name:'Стена замка', x:-2, y:10, type:'wall', level:8, description:'Крепостная стена, южная сторона.' },
    'bl_-3_-1': { id:'bl_-3_-1', name:'Стена замка', x:-3, y:10, type:'wall', level:8, description:'Крепостная стена, восточная сторона.' },
    'bl_-4_-1': { id:'bl_-4_-1', name:'Стена замка', x:-4, y:10, type:'wall', level:8, description:'Крепостная стена замка.' },
    'bl_-5_-1': { id:'bl_-5_-1', name:'Западная стена', x:-5, y:10, type:'wall', level:8, description:'Западная крепостная стена.' },

    'bl_-1_-2': { id:'bl_-1_-2', name:'Скалы', x:-1, y:9, type:'mountain', level:6, resources:[{name:'Камень',chance:25}], description:'Скалистый берег.' },
    'bl_-2_-2': { id:'bl_-2_-2', name:'Болото', x:-2, y:9, type:'swamp', level:6, resources:[{name:'Трава',chance:20},{name:'Вода',chance:15}], description:'Трясина у реки, опасное место.' },
    'bl_-3_-2': { id:'bl_-3_-2', name:'Перекрёсток', x:-3, y:9, type:'crossroads', level:6, description:'Перекрёсток дорог в Штормовых землях.' },
    'bl_-4_-2': { id:'bl_-4_-2', name:'Холм', x:-4, y:9, type:'mountain', level:6, resources:[{name:'Камень',chance:20}], description:'Невысокий холм с видом на тракт.' },
    'bl_-5_-2': { id:'bl_-5_-2', name:'Западный холм', x:-5, y:9, type:'mountain', level:7, resources:[{name:'Камень',chance:25}], description:'Холм на западе.' },

    'bl_-1_-3': { id:'bl_-1_-3', name:'Лесная тропа', x:-1, y:8, type:'forest', level:5, resources:[{name:'Древесина',chance:20}], description:'Тропа через лес к реке.' },
    'bl_-2_-3': { id:'bl_-2_-3', name:'Лесная поляна', x:-2, y:8, type:'forest', level:5, resources:[{name:'Древесина',chance:20},{name:'Трава',chance:25}], description:'Поляна в лесу, место сбора трав.' },
    'bl_-3_-3': { id:'bl_-3_-3', name:'Ферма', x:-3, y:8, type:'farm', level:5, resources:[{name:'Пшеница',chance:25},{name:'Овощи',chance:15}], description:'Ферма местного крестьянина.' },
    'bl_-4_-3': { id:'bl_-4_-3', name:'Лесная чаща', x:-4, y:8, type:'forest', level:6, resources:[{name:'Древесина',chance:30},{name:'Трава',chance:15}], description:'Чаща, где бандиты прячутся.' },
    'bl_-5_-3': { id:'bl_-5_-3', name:'Западный ручей', x:-5, y:8, type:'river', level:6, resources:[{name:'Рыба',chance:20},{name:'Вода',chance:20}], description:'Ручей на западе.' },

    'bl_-1_-4': { id:'bl_-1_-4', name:'Пляж', x:-1, y:7, type:'coast', level:5, resources:[{name:'Ракушки',chance:20}], description:'Песчаный пляж.' },
    'bl_-2_-4': { id:'bl_-2_-4', name:'Речная пристань', x:-2, y:7, type:'dock', level:5, resources:[{name:'Рыба',chance:25}], description:'Пристань для рыбацких лодок.' },
    'bl_-3_-4': { id:'bl_-3_-4', name:'Лес Баклеров', x:-3, y:7, type:'forest', level:5, resources:[{name:'Древесина',chance:30},{name:'Трава',chance:20}], description:'Густой лес владений Баклеров.' },
    'bl_-4_-4': { id:'bl_-4_-4', name:'Западная чаща', x:-4, y:7, type:'forest', level:7, resources:[{name:'Древесина',chance:30}], description:'Густая чаща на западе.' },
    'bl_-5_-4': { id:'bl_-5_-4', name:'Западная опушка', x:-5, y:7, type:'forest', level:7, resources:[{name:'Древесина',chance:25}], description:'Опушка леса на западе.' },

    'bl_-1_-5': { id:'bl_-1_-5', name:'Прибрежный лагерь', x:-1, y:6, type:'camp', level:7, description:'Лагерь у северного берега.' },
    'bl_-2_-5': { id:'bl_-2_-5', name:'Северный ручей', x:-2, y:6, type:'river', level:5, resources:[{name:'Рыба',chance:20},{name:'Вода',chance:15}], description:'Ручей на северной границе.' },
    'bl_-3_-5': { id:'bl_-3_-5', name:'Северный холм', x:-3, y:6, type:'mountain', level:6, resources:[{name:'Камень',chance:20}], description:'Холм на северной границе.' },
    'bl_-4_-5': { id:'bl_-4_-5', name:'Северная опушка', x:-4, y:6, type:'forest', level:6, resources:[{name:'Древесина',chance:25},{name:'Трава',chance:15}], description:'Северная опушка леса.' },
    'bl_-5_-5': { id:'bl_-5_-5', name:'Северо-западная граница', x:-5, y:6, type:'border', level:7, resources:[{name:'Камень',chance:15}], description:'Северо-западная граница владений Баклеров.' },

    // ==================== СЕВЕРО-ВОСТОК (x=1...5, y=6-10) ====================
    'bl_1_-1': { id:'bl_1_-1', name:'Конюшня', x:1, y:10, type:'stables', level:7, description:'Конюшня замка.' },
    'bl_2_-1': { id:'bl_2_-1', name:'Охотничьи угодья', x:2, y:10, type:'hunting', level:6, resources:[{name:'Мясо',chance:15}], description:'Угодья для охоты лорда.' },
    'bl_3_-1': { id:'bl_3_-1', name:'Торговый пост', x:3, y:10, type:'trading_post', level:7, description:'Торговый пост у границы.' },
    'bl_4_-1': { id:'bl_4_-1', name:'Сторожевая башня', x:4, y:10, type:'tower', level:7, description:'Башня на границе.' },
    'bl_5_-1': { id:'bl_5_-1', name:'Восточная башня', x:5, y:10, type:'tower', level:8, description:'Восточная дозорная башня.' },

    'bl_1_-2': { id:'bl_1_-2', name:'Таверна', x:1, y:9, type:'tavern', level:6, description:'Таверна у моря.' },
    'bl_2_-2': { id:'bl_2_-2', name:'Башня дозорная', x:2, y:9, type:'tower', level:7, description:'Дозорная башня на границе.' },
    'bl_3_-2': { id:'bl_3_-2', name:'Караванный путь', x:3, y:9, type:'road', level:6, resources:[{name:'Камень',chance:10}], description:'Путь для караванов.' },
    'bl_4_-2': { id:'bl_4_-2', name:'Ферма', x:4, y:9, type:'farm', level:5, resources:[{name:'Пшеница',chance:20}], description:'Ферма на востоке.' },
    'bl_5_-2': { id:'bl_5_-2', name:'Восточный холм', x:5, y:9, type:'mountain', level:7, resources:[{name:'Камень',chance:20}], description:'Холм на востоке.' },

    'bl_1_-3': { id:'bl_1_-3', name:'Пристань', x:1, y:8, type:'dock', level:6, resources:[{name:'Рыба',chance:20}], description:'Торговая пристань.' },
    'bl_2_-3': { id:'bl_2_-3', name:'Залив', x:2, y:8, type:'bay', level:5, resources:[{name:'Рыба',chance:25}], description:'Тихий залив.' },
    'bl_3_-3': { id:'bl_3_-3', name:'Гавань', x:3, y:8, type:'harbor', level:6, description:'Небольшая гавань.' },
    'bl_4_-3': { id:'bl_4_-3', name:'Мыс', x:4, y:8, type:'cape', level:6, description:'Мыс на краю земель Баклеров.' },
    'bl_5_-3': { id:'bl_5_-3', name:'Восточный мыс', x:5, y:8, type:'cape', level:7, description:'Мыс на востоке.' },

    'bl_1_-4': { id:'bl_1_-4', name:'Рыбацкая деревня', x:1, y:7, type:'village', level:5, description:'Деревня рыбаков.' },
    'bl_2_-4': { id:'bl_2_-4', name:'Рифы', x:2, y:7, type:'reef', level:6, resources:[{name:'Ракушки',chance:15}], description:'Подводные рифы.' },
    'bl_3_-4': { id:'bl_3_-4', name:'Кораблекрушение', x:3, y:7, type:'wreck', level:7, description:'Обломки затонувшего корабля.' },
    'bl_4_-4': { id:'bl_4_-4', name:'Остров пиратов', x:4, y:7, type:'pirate_island', level:9, description:'Остров, захваченный пиратами.' },
    'bl_5_-4': { id:'bl_5_-4', name:'Восточное море', x:5, y:7, type:'sea', level:8, resources:[{name:'Рыба',chance:20}], description:'Открытое море на востоке.' },

    'bl_1_-5': { id:'bl_1_-5', name:'Поля', x:1, y:6, type:'plain', level:5, resources:[{name:'Пшеница',chance:20},{name:'Трава',chance:10}], description:'Поля на северо-востоке.' },
    'bl_2_-5': { id:'bl_2_-5', name:'Северо-восточный лес', x:2, y:6, type:'forest', level:6, resources:[{name:'Древесина',chance:30}], description:'Лес на северо-востоке.' },
    'bl_3_-5': { id:'bl_3_-5', name:'Северо-восточные холмы', x:3, y:6, type:'mountain', level:7, resources:[{name:'Камень',chance:20}], description:'Холмы на северо-востоке.' },
    'bl_4_-5': { id:'bl_4_-5', name:'Северо-восточная башня', x:4, y:6, type:'tower', level:8, description:'Дозорная башня на северо-востоке.' },
    'bl_5_-5': { id:'bl_5_-5', name:'Крайний северо-восток', x:5, y:6, type:'border', level:10, description:'Дальняя северо-восточная граница.' },

    // ==================== ЮГО-ЗАПАД (x=-5...-1, y=12-16) ====================
    'bl_-1_1': { id:'bl_-1_1', name:'Часовня', x:-1, y:12, type:'septa', level:8, description:'Часовня Семерых в замке.' },
    'bl_-2_1': { id:'bl_-2_1', name:'Кухня', x:-2, y:12, type:'kitchen', level:8, description:'Замковая кухня.' },
    'bl_-3_1': { id:'bl_-3_1', name:'Погреб', x:-3, y:12, type:'cellar', level:8, description:'Погреб с припасами замка.' },
    'bl_-4_1': { id:'bl_-4_1', name:'Кузница', x:-4, y:12, type:'forge', level:8, resources:[{name:'Уголь',chance:10}], description:'Кузница замка Баклеров.' },
    'bl_-5_1': { id:'bl_-5_1', name:'Западная равнина', x:-5, y:12, type:'plain', level:7, resources:['Пшеница'], description:'Равнина на западе.' },

    'bl_-1_2': { id:'bl_-1_2', name:'Сад', x:-1, y:13, type:'garden', level:8, resources:[{name:'Трава',chance:15},{name:'Цветы',chance:10}], description:'Замковый сад.' },
    'bl_-2_2': { id:'bl_-2_2', name:'Столовая', x:-2, y:13, type:'hall', level:8, description:'Столовая для гарнизона.' },
    'bl_-3_2': { id:'bl_-3_2', name:'Арсенал', x:-3, y:13, type:'armory', level:9, description:'Оружейная палата замка.' },
    'bl_-4_2': { id:'bl_-4_2', name:'Казармы', x:-4, y:13, type:'barracks', level:8, description:'Казармы гарнизона.' },
    'bl_-5_2': { id:'bl_-5_2', name:'Западный холм', x:-5, y:13, type:'mountain', level:7, resources:[{name:'Камень',chance:25}], description:'Холм на западе.' },

    'bl_-1_3': { id:'bl_-1_3', name:'Оружейная', x:-1, y:14, type:'armory', level:9, description:'Мастерская оружейника.' },
    'bl_-2_3': { id:'bl_-2_3', name:'Покои лорда', x:-2, y:14, type:'chambers', level:10, description:'Личные покои лорда Баклеров.' },
    'bl_-3_3': { id:'bl_-3_3', name:'Библиотека', x:-3, y:14, type:'library', level:9, description:'Библиотека с хрониками Баклеров.' },
    'bl_-4_3': { id:'bl_-4_3', name:'Тренировочный двор', x:-4, y:14, type:'training', level:9, description:'Двор для тренировок воинов.' },
    'bl_-5_3': { id:'bl_-5_3', name:'Западная граница', x:-5, y:14, type:'border', level:9, description:'Западная граница.' },

    'bl_-1_4': { id:'bl_-1_4', name:'Темница', x:-1, y:15, type:'dungeon', level:11, description:'Темница замка.' },
    'bl_-2_4': { id:'bl_-2_4', name:'Балкон', x:-2, y:15, type:'balcony', level:10, description:'Балкон с видом на Штормовые земли.' },
    'bl_-3_4': { id:'bl_-3_4', name:'Склеп', x:-3, y:15, type:'crypt', level:12, description:'Семейный склеп Баклеров.' },
    'bl_-4_4': { id:'bl_-4_4', name:'Тайник', x:-4, y:15, type:'hideout', level:11, description:'Секретный тайник под замком.' },
    'bl_-5_4': { id:'bl_-5_4', name:'Западный форт', x:-5, y:15, type:'ruins', level:10, description:'Старый форт.' },

    'bl_-1_5': { id:'bl_-1_5', name:'Южный берег', x:-1, y:16, type:'coast', level:8, resources:[{name:'Рыба',chance:20}], description:'Южный берег.' },
    'bl_-2_5': { id:'bl_-2_5', name:'Южный перекрёсток', x:-2, y:16, type:'crossroads', level:7, description:'Перекрёсток на юге.' },
    'bl_-3_5': { id:'bl_-3_5', name:'Южная граница', x:-3, y:16, type:'border', level:9, description:'Южная граница.' },
    'bl_-4_5': { id:'bl_-4_5', name:'Южные холмы', x:-4, y:16, type:'mountain', level:8, resources:[{name:'Камень',chance:20}], description:'Холмы на юге.' },
    'bl_-5_5': { id:'bl_-5_5', name:'Юго-западная граница', x:-5, y:16, type:'border', level:10, description:'Юго-западная граница.' },

    // ==================== ЮГО-ВОСТОК (x=1...5, y=12-16) ====================
    'bl_1_1': { id:'bl_1_1', name:'Арена', x:1, y:12, type:'arena', level:8, description:'Турнирная арена.' },
    'bl_2_1': { id:'bl_2_1', name:'Турнирное поле', x:2, y:12, type:'field', level:8, description:'Поле для рыцарских турниров.' },
    'bl_3_1': { id:'bl_3_1', name:'Лагерь наёмников', x:3, y:12, type:'camp', level:9, description:'Лагерь наёмного отряда.' },
    'bl_4_1': { id:'bl_4_1', name:'Лагерь разбойников', x:4, y:12, type:'bandit_camp', level:10, description:'Лагерь шайки разбойников.' },
    'bl_5_1': { id:'bl_5_1', name:'Восточная гавань', x:5, y:12, type:'harbor', level:8, description:'Гавань на востоке.' },

    'bl_1_2': { id:'bl_1_2', name:'Лес', x:1, y:13, type:'forest', level:5, resources:[{name:'Древесина',chance:20}], description:'Лес на востоке владений.' },
    'bl_2_2': { id:'bl_2_2', name:'Руины', x:2, y:13, type:'ruins', level:8, description:'Древние руины.' },
    'bl_3_2': { id:'bl_3_2', name:'Лесная чаща', x:3, y:13, type:'forest', level:6, resources:[{name:'Древесина',chance:25}], description:'Густая чаща.' },
    'bl_4_2': { id:'bl_4_2', name:'Лесорубный лагерь', x:4, y:13, type:'logging_camp', level:5, resources:[{name:'Древесина',chance:30}], description:'Лагерь лесорубов.' },
    'bl_5_2': { id:'bl_5_2', name:'Восточный торговый пост', x:5, y:13, type:'trading_post', level:8, description:'Торговый пост.' },

    'bl_1_3': { id:'bl_1_3', name:'Пещера', x:1, y:14, type:'cave', level:9, resources:[{name:'Камень',chance:20},{name:'Железная руда',chance:10}], description:'Пещера в лесу.' },
    'bl_2_3': { id:'bl_2_3', name:'Старый мост', x:2, y:14, type:'bridge', level:7, description:'Разрушенный мост через реку.' },
    'bl_3_3': { id:'bl_3_3', name:'Граница Дорна', x:3, y:14, type:'border', level:10, description:'Граница с Дорном.' },
    'bl_4_3': { id:'bl_4_3', name:'Заброшенная шахта', x:4, y:14, type:'mine', level:8, resources:[{name:'Железная руда',chance:15},{name:'Уголь',chance:10}], description:'Старая заброшенная шахта.' },
    'bl_5_3': { id:'bl_5_3', name:'Восточная застава', x:5, y:14, type:'tower', level:9, description:'Восточная застава.' },

    'bl_1_4': { id:'bl_1_4', name:'Гнездо виверны', x:1, y:15, type:'nest', level:12, description:'Гнездо дикой виверны.' },
    'bl_2_4': { id:'bl_2_4', name:'Пещера', x:2, y:15, type:'cave', level:9, resources:[{name:'Камень',chance:20},{name:'Железная руда',chance:10}], description:'Пещера в лесу.' },
    'bl_3_4': { id:'bl_3_4', name:'Старый мост', x:3, y:15, type:'bridge', level:7, description:'Разрушенный мост.' },
    'bl_4_4': { id:'bl_4_4', name:'Заброшенная шахта', x:4, y:15, type:'mine', level:8, resources:[{name:'Железная руда',chance:15},{name:'Уголь',chance:10}], description:'Старая шахта.' },
    'bl_5_4': { id:'bl_5_4', name:'Восточная граница', x:5, y:15, type:'border', level:11, description:'Восточная граница.' },

    'bl_1_5': { id:'bl_1_5', name:'Юго-восточная равнина', x:1, y:16, type:'plain', level:7, resources:['Пшеница'], description:'Равнина на юго-востоке.' },
    'bl_2_5': { id:'bl_2_5', name:'Юго-восточный лес', x:2, y:16, type:'forest', level:8, resources:[{name:'Древесина',chance:25}], description:'Лес на юго-востоке.' },
    'bl_3_5': { id:'bl_3_5', name:'Юго-восточный берег', x:3, y:16, type:'coast', level:8, resources:[{name:'Рыба',chance:20}], description:'Берег на юго-востоке.' },
    'bl_4_5': { id:'bl_4_5', name:'Юго-восточная башня', x:4, y:16, type:'tower', level:9, description:'Башня на юго-востоке.' },
    'bl_5_5': { id:'bl_5_5', name:'Крайний юго-восток', x:5, y:16, type:'border', level:12, description:'Дальняя юго-восточная граница.' }
};

// Добавляем в глобальный мир
Object.assign(WORLD_AREAS, BUCKLER_AREAS);
buildWorldTransitions();

console.log('✅ Владения Баклеров загружены (121 зона, 11×11, глобальная система)');

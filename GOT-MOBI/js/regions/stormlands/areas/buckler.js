// ============================================================
// js/regions/stormlands/areas/buckler.js — БРОНЗОВЫЙ ЩИТ
// ============================================================

// Смещение относительно Королевской Гавани
// kl_0_4 имеет y:4, поэтому bl_0_0 = y:5
const BUCKLER_Y_OFFSET = 5;

const BUCKLER_AREAS = {
    'bl_0_0': { id:'bl_0_0', name:'Тракт Баклеров', x:0, y:0+BUCKLER_Y_OFFSET, type:'road', level:5, resources:[{name:'Камень',chance:15},{name:'Железная руда',chance:5}], description:'Тракт ведущий к замку Баклеров.' },
    'bl_0_1': { id:'bl_0_1', name:'Тракт Баклеров 2', x:0, y:1+BUCKLER_Y_OFFSET, type:'road', level:5, resources:[{name:'Камень',chance:15}], description:'Тракт ведущий к замку Баклеров.' },
    'bl_0_2': { id:'bl_0_2', name:'Тракт Баклеров 3', x:0, y:2+BUCKLER_Y_OFFSET, type:'road', level:6, resources:[{name:'Камень',chance:15}], description:'Тракт ведущий к замку Баклеров.' },
    'bl_0_3': { id:'bl_0_3', name:'Подножие холма', x:0, y:3+BUCKLER_Y_OFFSET, type:'mountain', level:6, resources:[{name:'Камень',chance:20},{name:'Железная руда',chance:10}], description:'Подножие холма с видом на замок.' },
    'bl_0_4': { id:'bl_0_4', name:'Ворота замка', x:0, y:4+BUCKLER_Y_OFFSET, type:'castle_gate', level:8, description:'Ворота замка Бронзовый Щит.' },
    'bl_0_5': { id:'bl_0_5', name:'Крепостной двор', x:0, y:5+BUCKLER_Y_OFFSET, type:'castle', level:8, description:'Внутренний двор замка.' },
    'bl_0_6': { id:'bl_0_6', name:'Башня лорда', x:0, y:6+BUCKLER_Y_OFFSET, type:'castle', level:9, description:'Башня лорда Баклеров.' },
    'bl_0_7': { id:'bl_0_7', name:'Тронный зал', x:0, y:7+BUCKLER_Y_OFFSET, type:'castle', level:10, description:'Тронный зал замка.' },
    'bl_0_8': { id:'bl_0_8', name:'Секретный проход', x:0, y:8+BUCKLER_Y_OFFSET, type:'dungeon', level:12, description:'Тайный проход под замком.' },

    'bl_1_0': { id:'bl_1_0', name:'Лесная опушка', x:1, y:0+BUCKLER_Y_OFFSET, type:'forest', level:5, resources:[{name:'Древесина',chance:25},{name:'Трава',chance:15}], description:'Опушка леса у тракта.' },
    'bl_1_1': { id:'bl_1_1', name:'Лес Баклеров', x:1, y:1+BUCKLER_Y_OFFSET, type:'forest', level:5, resources:[{name:'Древесина',chance:30},{name:'Трава',chance:20}], description:'Густой лес владений Баклеров.' },
    'bl_1_2': { id:'bl_1_2', name:'Лесная чаща', x:1, y:2+BUCKLER_Y_OFFSET, type:'forest', level:6, resources:[{name:'Древесина',chance:30},{name:'Трава',chance:15}], description:'Чаща, где бандиты прячутся.' },
    'bl_1_3': { id:'bl_1_3', name:'Холм', x:1, y:3+BUCKLER_Y_OFFSET, type:'mountain', level:6, resources:[{name:'Камень',chance:20}], description:'Невысокий холм с видом на тракт.' },
    'bl_1_4': { id:'bl_1_4', name:'Стена замка', x:1, y:4+BUCKLER_Y_OFFSET, type:'wall', level:8, description:'Крепостная стена замка.' },
    'bl_1_5': { id:'bl_1_5', name:'Кузница', x:1, y:5+BUCKLER_Y_OFFSET, type:'forge', level:8, resources:[{name:'Уголь',chance:10}], description:'Кузница замка Баклеров.' },
    'bl_1_6': { id:'bl_1_6', name:'Казармы', x:1, y:6+BUCKLER_Y_OFFSET, type:'barracks', level:8, description:'Казармы гарнизона.' },
    'bl_1_7': { id:'bl_1_7', name:'Тренировочный двор', x:1, y:7+BUCKLER_Y_OFFSET, type:'training', level:9, description:'Двор для тренировок воинов.' },
    'bl_1_8': { id:'bl_1_8', name:'Тайник', x:1, y:8+BUCKLER_Y_OFFSET, type:'hideout', level:11, description:'Секретный тайник под замком.' },

    'bl_2_0': { id:'bl_2_0', name:'Поля', x:2, y:0+BUCKLER_Y_OFFSET, type:'plain', level:5, resources:[{name:'Пшеница',chance:20},{name:'Трава',chance:10}], description:'Поля крестьян владений Баклеров.' },
    'bl_2_1': { id:'bl_2_1', name:'Ферма', x:2, y:1+BUCKLER_Y_OFFSET, type:'farm', level:5, resources:[{name:'Пшеница',chance:25},{name:'Овощи',chance:15}], description:'Ферма местного крестьянина.' },
    'bl_2_2': { id:'bl_2_2', name:'Лесная поляна', x:2, y:2+BUCKLER_Y_OFFSET, type:'forest', level:5, resources:[{name:'Древесина',chance:20},{name:'Трава',chance:25}], description:'Поляна в лесу, место сбора трав.' },
    'bl_2_3': { id:'bl_2_3', name:'Перекрёсток', x:2, y:3+BUCKLER_Y_OFFSET, type:'crossroads', level:6, description:'Перекрёсток дорог в Штормовых землях.' },
    'bl_2_4': { id:'bl_2_4', name:'Стена замка', x:2, y:4+BUCKLER_Y_OFFSET, type:'wall', level:8, description:'Крепостная стена, восточная сторона.' },
    'bl_2_5': { id:'bl_2_5', name:'Погреб', x:2, y:5+BUCKLER_Y_OFFSET, type:'cellar', level:8, description:'Погреб с припасами замка.' },
    'bl_2_6': { id:'bl_2_6', name:'Арсенал', x:2, y:6+BUCKLER_Y_OFFSET, type:'armory', level:9, description:'Оружейная палата замка.' },
    'bl_2_7': { id:'bl_2_7', name:'Библиотека', x:2, y:7+BUCKLER_Y_OFFSET, type:'library', level:9, description:'Библиотека с хрониками Баклеров.' },
    'bl_2_8': { id:'bl_2_8', name:'Склеп', x:2, y:8+BUCKLER_Y_OFFSET, type:'crypt', level:12, description:'Семейный склеп Баклеров.' },

    'bl_3_0': { id:'bl_3_0', name:'Река', x:3, y:0+BUCKLER_Y_OFFSET, type:'river', level:5, resources:[{name:'Рыба',chance:30},{name:'Вода',chance:20}], description:'Река, текущая к Узкому морю.' },
    'bl_3_1': { id:'bl_3_1', name:'Речная пристань', x:3, y:1+BUCKLER_Y_OFFSET, type:'dock', level:5, resources:[{name:'Рыба',chance:25}], description:'Пристань для рыбацких лодок.' },
    'bl_3_2': { id:'bl_3_2', name:'Лесная тропа', x:3, y:2+BUCKLER_Y_OFFSET, type:'forest', level:5, resources:[{name:'Древесина',chance:20}], description:'Тропа через лес к реке.' },
    'bl_3_3': { id:'bl_3_3', name:'Болото', x:3, y:3+BUCKLER_Y_OFFSET, type:'swamp', level:6, resources:[{name:'Трава',chance:20},{name:'Вода',chance:15}], description:'Трясина у реки, опасное место.' },
    'bl_3_4': { id:'bl_3_4', name:'Стена замка', x:3, y:4+BUCKLER_Y_OFFSET, type:'wall', level:8, description:'Крепостная стена, южная сторона.' },
    'bl_3_5': { id:'bl_3_5', name:'Кухня', x:3, y:5+BUCKLER_Y_OFFSET, type:'kitchen', level:8, description:'Замковая кухня.' },
    'bl_3_6': { id:'bl_3_6', name:'Столовая', x:3, y:6+BUCKLER_Y_OFFSET, type:'hall', level:8, description:'Столовая для гарнизона.' },
    'bl_3_7': { id:'bl_3_7', name:'Покои лорда', x:3, y:7+BUCKLER_Y_OFFSET, type:'chambers', level:10, description:'Личные покои лорда Баклеров.' },
    'bl_3_8': { id:'bl_3_8', name:'Балкон', x:3, y:8+BUCKLER_Y_OFFSET, type:'balcony', level:10, description:'Балкон с видом на Штормовые земли.' },

    'bl_4_0': { id:'bl_4_0', name:'Берег', x:4, y:0+BUCKLER_Y_OFFSET, type:'coast', level:5, resources:[{name:'Ракушки',chance:15},{name:'Песок',chance:10}], description:'Берег Узкого моря.' },
    'bl_4_1': { id:'bl_4_1', name:'Пляж', x:4, y:1+BUCKLER_Y_OFFSET, type:'coast', level:5, resources:[{name:'Ракушки',chance:20}], description:'Песчаный пляж.' },
    'bl_4_2': { id:'bl_4_2', name:'Скалы', x:4, y:2+BUCKLER_Y_OFFSET, type:'mountain', level:6, resources:[{name:'Камень',chance:25}], description:'Скалистый берег.' },
    'bl_4_3': { id:'bl_4_3', name:'Маяк', x:4, y:3+BUCKLER_Y_OFFSET, type:'lighthouse', level:7, description:'Старый маяк на берегу.' },
    'bl_4_4': { id:'bl_4_4', name:'Стена замка', x:4, y:4+BUCKLER_Y_OFFSET, type:'wall', level:8, description:'Крепостная стена, западная сторона.' },
    'bl_4_5': { id:'bl_4_5', name:'Часовня', x:4, y:5+BUCKLER_Y_OFFSET, type:'septa', level:8, description:'Часовня Семерых в замке.' },
    'bl_4_6': { id:'bl_4_6', name:'Сад', x:4, y:6+BUCKLER_Y_OFFSET, type:'garden', level:8, resources:[{name:'Трава',chance:15},{name:'Цветы',chance:10}], description:'Замковый сад.' },
    'bl_4_7': { id:'bl_4_7', name:'Оружейная', x:4, y:7+BUCKLER_Y_OFFSET, type:'armory', level:9, description:'Мастерская оружейника.' },
    'bl_4_8': { id:'bl_4_8', name:'Темница', x:4, y:8+BUCKLER_Y_OFFSET, type:'dungeon', level:11, description:'Темница замка.' },

    'bl_5_0': { id:'bl_5_0', name:'Узкое море', x:5, y:0+BUCKLER_Y_OFFSET, type:'sea', level:5, resources:[{name:'Рыба',chance:20},{name:'Соль',chance:10}], description:'Воды Узкого моря.' },
    'bl_5_1': { id:'bl_5_1', name:'Рыбацкая деревня', x:5, y:1+BUCKLER_Y_OFFSET, type:'village', level:5, description:'Деревня рыбаков.' },
    'bl_5_2': { id:'bl_5_2', name:'Таверна', x:5, y:2+BUCKLER_Y_OFFSET, type:'tavern', level:6, description:'Таверна у моря.' },
    'bl_5_3': { id:'bl_5_3', name:'Пристань', x:5, y:3+BUCKLER_Y_OFFSET, type:'dock', level:6, resources:[{name:'Рыба',chance:20}], description:'Торговая пристань.' },
    'bl_5_4': { id:'bl_5_4', name:'Конюшня', x:5, y:4+BUCKLER_Y_OFFSET, type:'stables', level:7, description:'Конюшня замка.' },
    'bl_5_5': { id:'bl_5_5', name:'Арена', x:5, y:5+BUCKLER_Y_OFFSET, type:'arena', level:8, description:'Турнирная арена.' },
    'bl_5_6': { id:'bl_5_6', name:'Турнирное поле', x:5, y:6+BUCKLER_Y_OFFSET, type:'field', level:8, description:'Поле для рыцарских турниров.' },
    'bl_5_7': { id:'bl_5_7', name:'Лагерь наёмников', x:5, y:7+BUCKLER_Y_OFFSET, type:'camp', level:9, description:'Лагерь наёмного отряда.' },
    'bl_5_8': { id:'bl_5_8', name:'Лагерь разбойников', x:5, y:8+BUCKLER_Y_OFFSET, type:'bandit_camp', level:10, description:'Лагерь шайки разбойников.' },

    'bl_6_0': { id:'bl_6_0', name:'Остров', x:6, y:0+BUCKLER_Y_OFFSET, type:'island', level:6, description:'Маленький остров у берега.' },
    'bl_6_1': { id:'bl_6_1', name:'Рифы', x:6, y:1+BUCKLER_Y_OFFSET, type:'reef', level:6, resources:[{name:'Ракушки',chance:15}], description:'Подводные рифы.' },
    'bl_6_2': { id:'bl_6_2', name:'Залив', x:6, y:2+BUCKLER_Y_OFFSET, type:'bay', level:5, resources:[{name:'Рыба',chance:25}], description:'Тихий залив.' },
    'bl_6_3': { id:'bl_6_3', name:'Лес', x:6, y:3+BUCKLER_Y_OFFSET, type:'forest', level:5, resources:[{name:'Древесина',chance:20}], description:'Лес на востоке владений.' },
    'bl_6_4': { id:'bl_6_4', name:'Охотничьи угодья', x:6, y:4+BUCKLER_Y_OFFSET, type:'hunting', level:6, resources:[{name:'Мясо',chance:15}], description:'Угодья для охоты лорда.' },
    'bl_6_5': { id:'bl_6_5', name:'Башня дозорная', x:6, y:5+BUCKLER_Y_OFFSET, type:'tower', level:7, description:'Дозорная башня на границе.' },
    'bl_6_6': { id:'bl_6_6', name:'Руины', x:6, y:6+BUCKLER_Y_OFFSET, type:'ruins', level:8, description:'Древние руины.' },
    'bl_6_7': { id:'bl_6_7', name:'Пещера', x:6, y:7+BUCKLER_Y_OFFSET, type:'cave', level:9, resources:[{name:'Камень',chance:20},{name:'Железная руда',chance:10}], description:'Пещера в лесу.' },
    'bl_6_8': { id:'bl_6_8', name:'Гнездо виверны', x:6, y:8+BUCKLER_Y_OFFSET, type:'nest', level:12, description:'Гнездо дикой виверны.' },

    'bl_7_0': { id:'bl_7_0', name:'Открытое море', x:7, y:0+BUCKLER_Y_OFFSET, type:'sea', level:6, resources:[{name:'Рыба',chance:15}], description:'Открытые воды Узкого моря.' },
    'bl_7_1': { id:'bl_7_1', name:'Кораблекрушение', x:7, y:1+BUCKLER_Y_OFFSET, type:'wreck', level:7, description:'Обломки затонувшего корабля.' },
    'bl_7_2': { id:'bl_7_2', name:'Водоворот', x:7, y:2+BUCKLER_Y_OFFSET, type:'maelstrom', level:8, description:'Опасный водоворот.' },
    'bl_7_3': { id:'bl_7_3', name:'Гавань', x:7, y:3+BUCKLER_Y_OFFSET, type:'harbor', level:6, description:'Небольшая гавань.' },
    'bl_7_4': { id:'bl_7_4', name:'Торговый пост', x:7, y:4+BUCKLER_Y_OFFSET, type:'trading_post', level:7, description:'Торговый пост у границы.' },
    'bl_7_5': { id:'bl_7_5', name:'Караванный путь', x:7, y:5+BUCKLER_Y_OFFSET, type:'road', level:6, resources:[{name:'Камень',chance:10}], description:'Путь для караванов.' },
    'bl_7_6': { id:'bl_7_6', name:'Лесная чаща', x:7, y:6+BUCKLER_Y_OFFSET, type:'forest', level:6, resources:[{name:'Древесина',chance:25}], description:'Густая чаща.' },
    'bl_7_7': { id:'bl_7_7', name:'Старый мост', x:7, y:7+BUCKLER_Y_OFFSET, type:'bridge', level:7, description:'Разрушенный мост через реку.' },
    'bl_7_8': { id:'bl_7_8', name:'Граница Дорна', x:7, y:8+BUCKLER_Y_OFFSET, type:'border', level:10, description:'Граница с Дорном.' },

    'bl_8_0': { id:'bl_8_0', name:'Морская пучина', x:8, y:0+BUCKLER_Y_OFFSET, type:'abyss', level:8, description:'Глубокая морская пучина.' },
    'bl_8_1': { id:'bl_8_1', name:'Остров пиратов', x:8, y:1+BUCKLER_Y_OFFSET, type:'pirate_island', level:9, description:'Остров, захваченный пиратами.' },
    'bl_8_2': { id:'bl_8_2', name:'Скала', x:8, y:2+BUCKLER_Y_OFFSET, type:'rock', level:6, resources:[{name:'Камень',chance:20}], description:'Одинокая скала в море.' },
    'bl_8_3': { id:'bl_8_3', name:'Мыс', x:8, y:3+BUCKLER_Y_OFFSET, type:'cape', level:6, description:'Мыс на краю земель Баклеров.' },
    'bl_8_4': { id:'bl_8_4', name:'Сторожевая башня', x:8, y:4+BUCKLER_Y_OFFSET, type:'tower', level:7, description:'Башня на границе.' },
    'bl_8_5': { id:'bl_8_5', name:'Ферма', x:8, y:5+BUCKLER_Y_OFFSET, type:'farm', level:5, resources:[{name:'Пшеница',chance:20}], description:'Ферма на востоке.' },
    'bl_8_6': { id:'bl_8_6', name:'Лесорубный лагерь', x:8, y:6+BUCKLER_Y_OFFSET, type:'logging_camp', level:5, resources:[{name:'Древесина',chance:30}], description:'Лагерь лесорубов.' },
    'bl_8_7': { id:'bl_8_7', name:'Заброшенная шахта', x:8, y:7+BUCKLER_Y_OFFSET, type:'mine', level:8, resources:[{name:'Железная руда',chance:15},{name:'Уголь',chance:10}], description:'Старая заброшенная шахта.' },
    'bl_8_8': { id:'bl_8_8', name:'Граница Дорна', x:8, y:8+BUCKLER_Y_OFFSET, type:'border', level:10, description:'Граница с Дорном, охраняемая стражей.' }
};

// Добавляем в мир
Object.assign(WORLD_AREAS, BUCKLER_AREAS);

// Строим переходы
buildWorldTransitions();

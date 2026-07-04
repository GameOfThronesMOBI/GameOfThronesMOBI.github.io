// ============================================================
// КОРОЛЕВСКАЯ ГАВАНЬ — ВСЕ ЗДАНИЯ, ПЕРЕХОДЫ, ЦЕНЫ, ТОВАРЫ
// ПОЛНАЯ ЛОГИКА
// ============================================================

// --- СПИСОК ЗДАНИЙ ---
const KINGS_LANDING_BUILDINGS = [
    { id:'Таверна', label:'🍺 Таверна' },
    { id:'Рынок', label:'🏪 Рынок' },
    { id:'Кузница', label:'⚒️ Кузница' },
    { id:'Оружейная лавка', label:'🗡️ Оружейная лавка' },
    { id:'Кожевник', label:'🪡 Кожевник' },
    { id:'Бронник', label:'🛡️ Бронник' },
    { id:'Плотник', label:'🪵 Плотник' },
    { id:'Конюшня', label:'🐴 Конюшня' },
    { id:'Гильдия торговцев', label:'🏛️ Гильдия торговцев' },
    { id:'Магистрат', label:'📜 Магистрат' },
    { id:'Ворота', label:'🚪 Ворота' },
    { id:'Королевский квартал', label:'👑 Королевский квартал' },
    { id:'Торговый квартал', label:'🏙️ Торговый квартал' },
    { id:'Квартал бедноты', label:'🏚️ Квартал бедноты' },
    { id:'Дом', label:'🏠 Дом' },
    { id:'Великая септа', label:'⛪ Великая септа' },
    { id:'Порт', label:'⛵ Порт' },
    { id:'Тюрьма', label:'⛓️ Тюрьма' },
    { id:'Библиотека мейстеров', label:'📚 Библиотека мейстеров' },
    { id:'Гильдия наёмников', label:'🗡️ Гильдия наёмников' },
    { id:'Бордель', label:'💃 Бордель' }
];

// --- УРОВНИ ЗДАНИЙ ---
const KINGS_LANDING_LEVELS = {
    'Таверна':1, 'Рынок':1, 'Кузница':1, 'Оружейная лавка':1,
    'Кожевник':1, 'Бронник':1, 'Плотник':1, 'Конюшня':1,
    'Гильдия торговцев':1, 'Магистрат':1, 'Ворота':1,
    'Королевский квартал':1, 'Торговый квартал':1, 'Квартал бедноты':1,
    'Дом':1, 'Великая септа':1, 'Порт':1, 'Тюрьма':1,
    'Библиотека мейстеров':1, 'Гильдия наёмников':1, 'Бордель':1,
    'Дорога':5
};

// --- ОПИСАНИЯ ЗДАНИЙ ---
const KINGS_LANDING_TEXTS = {
    'Таверна': '🍺 Добро пожаловать в таверну «Пьяный Лев». Здесь можно поесть, поработать и поговорить с трактирщиком. Лучший эль в городе! Говорят, сам король Роберт захаживал сюда инкогнито.',
    'Рынок': '🏪 Центральный рынок Королевской Гавани. Десятки торговых лавок, крики зазывал, запах специй и рыбы. Здесь можно торговать с другими игроками. Купите лавку в Магистрате и станьте торговцем!',
    'Кузница': '⚒️ Вы в кузнице Тобхо Мотта. Жар от горна, звон молотов. Здесь можно купить ресурсы и скрафтить предметы. Тобхо Мотт — лучший кузнец в городе, работает с самой Валирийской сталью.',
    'Оружейная лавка': '🗡️ Оружейная лавка. Стены увешаны мечами, копьями, топорами. Здесь можно купить и продать оружие. Хозяин — бывший наёмник, знает толк в стали.',
    'Кожевник': '🪡 Вы у кожевника. Запах дублёной кожи. Здесь можно купить и продать кожаную броню. Лёгкая, но прочная — выбор разведчиков и охотников.',
    'Бронник': '🛡️ Вы у бронника. На стойках сияют стальные доспехи. Здесь можно купить и продать латную броню. Тяжёлая сталь для тех, кто идёт в бой.',
    'Плотник': '🪵 Вы у плотника. Пахнет свежей древесиной. Здесь можно купить и продать луки и арбалеты. Лучшие тисовые луки во всём Вестеросе.',
    'Конюшня': '🐴 Королевская конюшня. Здесь можно купить лошадь, продать или просто полюбоваться на скакунов. От рабочих лошадок до Огненных жеребцов — выбор за вами.',
    'Гильдия торговцев': '🏛️ Гильдия торговцев Королевской Гавани. Здесь можно торговать на аукционе с другими игроками. Комиссия всего 1%. Срок лота — 7 дней.',
    'Магистрат': '📜 Магистрат — центр управления городом. Здесь можно купить жильё, оплатить аренду и уладить городские дела. Храните вещи в камере хранения.',
    'Ворота': '🚪 Вы у городских ворот Королевской Гавани. Массивные дубовые створки, стража в золотых плащах. Отсюда можно выйти на Дорогу — но будьте осторожны, там водятся разбойники.',
    'Королевский квартал': '👑 Элитный район Королевской Гавани. Здесь живут самые богатые и влиятельные люди. Особняки, сады, фонтаны. Воздух пахнет властью и золотом.',
    'Торговый квартал': '🏙️ Центр торговли. Здесь селятся ремесленники и купцы. Уютные дома и комнаты. Вечно шумно, вечно пахнет специями и кожей.',
    'Квартал бедноты': '🏚️ Окраина города. Жильё здесь дёшево, но опасно. Можно встретить пьянчуг, нищих и разбойников. Ночлежки, грязь, крысы. Но говорят, здесь можно найти клад...',
    'Дом': '🏠 Ваш дом. Здесь можно отдохнуть, хранить вещи и чувствовать себя в безопасности. Крепкие стены, тёплый очаг.',
    'Великая септа': '⛪ Великая Септа Бейлора — главный храм Семерых в Вестеросе. Здесь можно исцелиться, получить благословение удачи и купить зелья у септонов.',
    'Порт': '⛵ Порт Королевской Гавани. Корабли со всего света — из Браавоса, Волантиса, Летних островов. Скоро здесь можно будет путешествовать между городами Вестероса.',
    'Тюрьма': '⛓️ Вы в тюрьме Королевской Гавани. Сырые стены, крысы, цепи. Заплатите штраф или ждите освобождения. А можете попытаться сбежать — но берегитесь, стража не дремлет.',
    'Библиотека мейстеров': '📚 Библиотека мейстеров. Пыльные фолианты, свечи, тишина. Здесь можно купить и читать книги. Знания — сила. Буквально: книги дают опыт.',
    'Гильдия наёмников': '🗡️ Гильдия наёмников. Здесь дают ежедневные задания и контракты. Пахнет потом и сталью. Убийство крыс, охота на бандитов, сбор ресурсов — работа найдётся каждому.',
    'Бордель': '💃 Бордель Королевской Гавани. Бархат, вино, музыка. Отдых, развлечения и игра в кости. Сыграйте с другими игроками на деньги!',
    'Дорога': '🛤️ Вы на дороге у ворот Королевской Гавани. Впереди — бескрайние земли Вестероса. Здесь можно встретить диких зверей, разбойников или найти клад. Куда направитесь?'
};

// --- ТОВАРЫ В ТАВЕРНЕ ---
const TAVERN_ITEMS = [
    { id:'bread', name:'🍞 Хлеб', price:5, food:20, thirst:0, hp:0 },
    { id:'meat', name:'🥩 Мясо', price:10, food:30, thirst:0, hp:0 },
    { id:'water', name:'💧 Вода', price:2, food:0, thirst:15, hp:0 },
    { id:'ale', name:'🍺 Эль', price:5, food:0, thirst:10, hp:5 },
    { id:'wine', name:'🍷 Вино', price:8, food:0, thirst:15, hp:8 },
    { id:'fish', name:'🐟 Жареная рыба', price:12, food:35, thirst:0, hp:3 },
    { id:'stew', name:'🥘 Похлёбка', price:7, food:25, thirst:5, hp:5 },
    { id:'cheese', name:'🧀 Сыр', price:4, food:15, thirst:0, hp:2 },
    { id:'pie', name:'🥧 Пирог с мясом', price:15, food:40, thirst:0, hp:8 },
    { id:'honey', name:'🍯 Мёд', price:6, food:10, thirst:0, hp:10 }
];

// --- РАБОТЫ В ТАВЕРНЕ ---
const TAVERN_JOBS = [
    { id:'wash', name:'🧼 Помыть посуду', duration:1, reward:1 },
    { id:'sweep', name:'🧹 Подмести пол', duration:5, reward:5 },
    { id:'serve', name:'🍺 Подавать эль', duration:10, reward:12 },
    { id:'kitchen', name:'🔪 Помочь на кухне', duration:15, reward:20 },
    { id:'cellar', name:'📦 Разгрузить погреб', duration:20, reward:30 }
];

// --- РЕПЛИКИ ТРАКТИРЩИКА ---
const BARKEEP_QUOTES = [
    '🍺 Трактирщик: «Добро пожаловать, путник! Лучший эль в городе!»',
    '🍺 Трактирщик: «Хочешь заработать? Помой посуду.»',
    '🍺 Трактирщик: «Будь осторожен за воротами. Разбойники совсем обнаглели.»',
    '🍺 Трактирщик: «Слыхал, в Квартале бедноты клад нашли. А может, враки.»',
    '🍺 Трактирщик: «Ланнистеры всегда платят свои долги. А ты свои заплатил?»',
    '🍺 Трактирщик: «Зима близко. Запасайся едой.»',
    '🍺 Трактирщик: «Эль сегодня особенно хорош!»',
    '🍺 Трактирщик: «Не лезь в драку с пьяными — до добра не доведёт.»',
    '🍺 Трактирщик: «В порту новый корабль. Говорят, из-за Узкого моря.»',
    '🍺 Трактирщик: «Если нужны деньги — иди в Гильдию наёмников.»'
];

// --- ПЬЯНЧУЖКИ ---
const DRUNKARDS = [
    { name:'Пьяный рыбак', hp:15, damage:2, defense:0, xp:2, level:1, emoji:'🎣' },
    { name:'Пьяный грузчик', hp:20, damage:3, defense:1, xp:3, level:2, emoji:'📦' },
    { name:'Пьяный матрос', hp:25, damage:4, defense:1, xp:4, level:3, emoji:'⛵' },
    { name:'Пьяный стражник', hp:30, damage:5, defense:2, xp:5, level:4, emoji:'🛡️' }
];

// --- МОБЫ ДЛЯ ПОИСКА ---
const KINGS_LANDING_MOBS = {
    1: [
        { name:'Крыса', hp:8, damage:2, defense:0, xp:3, level:1, type:'animal', agility:2, loot:null },
        { name:'Бродяга', hp:12, damage:3, defense:0, xp:4, level:2, type:'human', agility:2, loot:'vagabond' }
    ],
    5: [
        { name:'Крыса', hp:8, damage:2, defense:0, xp:3, level:1, type:'animal', agility:2, loot:null },
        { name:'Бродяга', hp:12, damage:3, defense:0, xp:4, level:2, type:'human', agility:2, loot:'vagabond' },
        { name:'Собака', hp:18, damage:4, defense:1, xp:6, level:3, type:'animal', agility:3, loot:null },
        { name:'Нищий бандит', hp:20, damage:5, defense:1, xp:8, level:5, type:'human', agility:3, loot:null }
    ],
    15: [
        { name:'Волк', hp:25, damage:6, defense:2, xp:10, level:8, type:'animal', agility:4, loot:null },
        { name:'Бандит', hp:30, damage:7, defense:2, xp:12, level:6, type:'human', agility:3, loot:null },
        { name:'Разбойник', hp:40, damage:9, defense:3, xp:18, level:10, type:'human', agility:4, loot:null }
    ],
    30: [
        { name:'Разбойник', hp:40, damage:9, defense:3, xp:18, level:10, type:'human', agility:4, loot:null },
        { name:'Головорез', hp:50, damage:11, defense:4, xp:25, level:15, type:'human', agility:5, loot:null },
        { name:'Волк', hp:25, damage:6, defense:2, xp:10, level:8, type:'animal', agility:4, loot:null }
    ],
    50: [
        { name:'Головорез', hp:50, damage:11, defense:4, xp:25, level:15, type:'human', agility:5, loot:null },
        { name:'Пещерный волк', hp:60, damage:14, defense:5, xp:35, level:20, type:'animal', agility:6, loot:null },
        { name:'Опытный бандит', hp:70, damage:16, defense:6, xp:40, level:25, type:'human', agility:5, loot:null }
    ],
    100: [
        { name:'Медведь', hp:80, damage:18, defense:8, xp:50, level:30, type:'animal', agility:4, loot:null },
        { name:'Вожак волков', hp:90, damage:20, defense:7, xp:60, level:35, type:'animal', agility:7, loot:null },
        { name:'Элитный разбойник', hp:100, damage:22, defense:9, xp:70, level:40, type:'human', agility:6, loot:null }
    ]
};

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================
function initKingsLanding() {
    BUILDINGS.length = 0;
    for (var i = 0; i < KINGS_LANDING_BUILDINGS.length; i++) {
        BUILDINGS.push(KINGS_LANDING_BUILDINGS[i]);
    }
    Object.assign(LOCATION_LEVELS, KINGS_LANDING_LEVELS);
    if (!window.LOCATION_TEXTS) window.LOCATION_TEXTS = {};
    Object.assign(window.LOCATION_TEXTS, KINGS_LANDING_TEXTS);
    console.log('🦁 Королевская Гавань загружена. 21 здание.');
}

// ============================================================
// ОБНОВЛЕНИЕ ОПИСАНИЯ ЛОКАЦИИ
// ============================================================
function updateKingsLandingStory() {
    var user = users[currentUser];
    if (!user) return;
    if (user.game.location.location !== 'Королевская Гавань') return;
    var place = user.game.location.place;
    var text = KINGS_LANDING_TEXTS[place] || ('Вы находитесь в ' + place + '.');
    var level = KINGS_LANDING_LEVELS[place] || 1;
    document.getElementById('story-title').textContent = '📍 ' + place + ' (ур.' + level + ')';
    document.getElementById('story-text').textContent = text;
}

// ============================================================
// ДЕЙСТВИЯ ДЛЯ КАЖДОГО ЗДАНИЯ
// ============================================================
function getKingsLandingActions(place) {
    var user = users[currentUser];
    if (!user) return [];
    var g = user.game;
    var baseActions = [
        { id:'inventory', label:'🎒 Инвентарь' },
        { id:'character', label:'👤 Персонаж' },
        { id:'menu', label:'📋 Меню' },
        { id:'map', label:'🗺️ Карта' }
    ];
    var actions = [];
    
    if (place === 'Таверна') {
        actions = [
            { id:'eat', label:'🍞 Попросить еды (+25)' },
            { id:'trade', label:'🛒 Торговля в таверне' },
            { id:'wash', label:'🧼 Помыть посуду (1 мин → 1 МП)' },
            { id:'sweep', label:'🧹 Подмести пол (5 мин → 5 МП)' },
            { id:'rest', label:'🛏️ Отдохнуть (10 МП → +30 уст., +15 HP)' },
            { id:'talk', label:'🗣️ Поговорить с трактирщиком' },
            ...baseActions
        ];
    } else if (place === 'Рынок') {
        actions = [{ id:'open_market', label:'🏪 Рынок' }, ...baseActions];
    } else if (place === 'Кузница') {
        actions = [{ id:'shop', label:'⚒️ Кузница' }, { id:'craft', label:'🔨 Крафт' }, ...baseActions];
    } else if (place === 'Оружейная лавка') {
        actions = [{ id:'shop', label:'🗡️ Оружейная лавка' }, ...baseActions];
    } else if (place === 'Кожевник') {
        actions = [{ id:'shop', label:'🪡 Кожевник' }, ...baseActions];
    } else if (place === 'Бронник') {
        actions = [{ id:'shop', label:'🛡️ Бронник' }, ...baseActions];
    } else if (place === 'Плотник') {
        actions = [{ id:'shop', label:'🪵 Плотник' }, ...baseActions];
    } else if (place === 'Конюшня') {
        actions = [{ id:'open_stable', label:'🐴 Конюшня' }, ...baseActions];
    } else if (place === 'Гильдия торговцев') {
        actions = [{ id:'guild', label:'🏛️ Аукцион' }, ...baseActions];
    } else if (place === 'Магистрат') {
        actions = [{ id:'open_magistrate', label:'📜 Недвижимость' }, ...baseActions];
    } else if (place === 'Ворота') {
        if (!g.outside) {
            actions = [{ id:'leave_city', label:'🚪 Выйти на Дорогу' }, ...baseActions];
        } else {
            actions = [...baseActions];
        }
    } else if (place === 'Дорога') {
        actions = [
            { id:'enter_city', label:'🚶 Войти в Королевскую Гавань' },
            { id:'search', label:'🔍 Поиск' },
            ...baseActions
        ];
    } else if (place === 'Королевский квартал' || place === 'Торговый квартал' || place === 'Квартал бедноты') {
        var hasHouse = checkHouseInDistrict(place);
        if (hasHouse) {
            actions = [{ id:'enter_home', label:'🏠 Зайти домой' }, { id:'search', label:'🔍 Поиск' }, ...baseActions];
        } else {
            actions = [{ id:'buy_housing', label:'🏠 Купить жильё' }, { id:'search', label:'🔍 Поиск' }, ...baseActions];
        }
    } else if (place === 'Дом') {
        actions = [
            { id:'rest_at_home', label:'🛏️ Отдохнуть (бесплатно)' },
            { id:'storage', label:'📦 Склад' },
            { id:'leave_home', label:'🚪 Выйти из дома' },
            ...baseActions
        ];
    } else if (place === 'Великая септа') {
        actions = [{ id:'open_temple', label:'⛪ Септа' }, ...baseActions];
    } else if (place === 'Порт') {
        actions = [{ id:'open_port', label:'⛵ Порт' }, ...baseActions];
    } else if (place === 'Тюрьма') {
        actions = [
            { id:'jail_pay', label:'💰 Заплатить штраф' },
            { id:'jail_wait', label:'⏳ Ждать освобождения (5 мин)' },
            { id:'jail_escape', label:'🏃 Попытаться сбежать' },
            ...baseActions
        ];
    } else if (place === 'Библиотека мейстеров') {
        actions = [{ id:'open_library', label:'📚 Библиотека' }, ...baseActions];
    } else if (place === 'Гильдия наёмников') {
        actions = [{ id:'open_guildhall', label:'🗡️ Гильдия наёмников' }, ...baseActions];
    } else if (place === 'Бордель') {
        actions = [{ id:'open_brothel', label:'💃 Бордель' }, ...baseActions];
        if (g.brothelRoom) actions.unshift({ id:'rest_brothel', label:'🛏️ Отдохнуть (бесплатно)' });
    } else {
        actions = [...baseActions];
    }
    
    if (!actions.find(a => a.id === 'refresh')) {
        actions.push({ id:'refresh', label:'🔄 Обновить' });
    }
    return actions;
}

// ============================================================
// ОБРАБОТЧИК ДЕЙСТВИЙ
// ============================================================
function handleKingsLandingAction(action) {
    var user = users[currentUser];
    if (!user) return false;
    var g = user.game;
    if (battleState && battleState.inProgress) {
        if (['character','inventory','refresh','map','menu'].includes(action)) return false;
        if (action.startsWith('battle_')) return false;
        setMessage('⚔️ Вы в бою!'); return true;
    }
    
    if (action === 'eat') {
        if (g.food >= 100) { setMessage('🍖 Вы сыты.'); return true; }
        g.food = Math.min(g.food + 25, 100);
        setMessage('🍞 Вы поели. Еда +25.');
        updateMenu(); saveData(); return true;
    }
    if (action === 'trade') { openTavernTrade(); return true; }
    if (action === 'wash') {
        startBusy('Моете посуду', 1, function(){
            g.copper += 1; convertCurrency(g);
            setMessage('🧼 +1 МП.'); updateMenu(); saveData();
        }); return true;
    }
    if (action === 'sweep') {
        startBusy('Подметаете пол', 5, function(){
            g.copper += 5; convertCurrency(g);
            setMessage('🧹 +5 МП.'); updateMenu(); saveData();
        }); return true;
    }
    if (action === 'rest') {
        if (!spendMoney(g, 10)) { setMessage('❌ Недостаточно денег (10 МП).'); return true; }
        g.fatigue = Math.min(100, g.fatigue + 30);
        g.hp = Math.min(g.maxHp, g.hp + 15);
        setMessage('🛏️ Вы отдохнули. +30 уст., +15 HP.');
        updateMenu(); saveData(); return true;
    }
    if (action === 'talk') {
        setMessage(BARKEEP_QUOTES[Math.floor(Math.random() * BARKEEP_QUOTES.length)]);
        return true;
    }
    if (action === 'search') {
        if (searchCooldown) { setMessage('⏳ Подождите 5 секунд.'); return true; }
        searchCooldown = true;
        setTimeout(function(){ searchCooldown = false; }, 5000);
        doKingsLandingSearch(); return true;
    }
    if (action === 'leave_city') {
        g.location.place = 'Дорога'; g.location.location = 'Дорога'; g.outside = true;
        setMessage('🛤️ Вы вышли на Дорогу.');
        updateMenu(); updateKingsLandingStory(); updateKingsLandingActions(); saveData(); return true;
    }
    if (action === 'enter_city') {
        g.location.place = 'Ворота'; g.location.location = 'Королевская Гавань'; g.outside = false;
        setMessage('🚪 Вы вошли в город.');
        updateMenu(); updateKingsLandingStory(); updateKingsLandingActions(); saveData(); return true;
    }
    if (action === 'buy_housing') { viewDistrict(g.location.place); return true; }
    if (action === 'enter_home') { enterHome(); return true; }
    if (action === 'rest_at_home') { restAtHome(); return true; }
    if (action === 'storage') { openStorage(); return true; }
    if (action === 'leave_home') {
        if (g.housing && g.housing.type) {
            g.location.place = HOUSING_TYPES[g.housing.type].district;
        } else { g.location.place = 'Таверна'; }
        g.location.location = 'Королевская Гавань';
        setMessage('🚪 Вы вышли из дома.');
        updateMenu(); updateKingsLandingStory(); updateKingsLandingActions(); saveData(); return true;
    }
    if (action === 'rest_brothel') {
        if (g.brothelRoom) {
            g.fatigue = Math.min(100, g.fatigue + 30);
            g.hp = Math.min(g.maxHp, g.hp + 10);
            setMessage('🛏️ Вы отдохнули. +30 уст., +10 HP');
            updateMenu(); saveData();
        } else { setMessage('❌ У вас нет комнаты.'); }
        return true;
    }
    return false;
}

// ============================================================
// ПОИСК
// ============================================================
function doKingsLandingSearch() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    var place = g.location.place;
    var locationLevel = KINGS_LANDING_LEVELS[place] || 1;
    var luck = Math.min(25, g.luck || 0);
    var luckBonus = Math.floor(luck / 10);
    
    if (place === 'Квартал бедноты') {
        if (Math.random() * 100 < 20) { findDrunkard(); return; }
        if (Math.random() * 100 < Math.min(4.5, 2 + luckBonus)) { findTreasure(); return; }
        if (Math.random() * 100 < Math.min(47.5, 45 + luckBonus)) {
            var mobs1 = getMobsForLevel(locationLevel);
            var mob1 = mobs1[Math.floor(Math.random() * mobs1.length)];
            setMessage('⚔️ Вы встретили ' + mob1.name + ' (ур.' + mob1.level + ')');
            addLog('⚔️ ' + currentUser + ' встретил ' + mob1.name);
            startBattle(mob1); return;
        }
        setMessage('🔍 Тихо... Пока.'); return;
    }
    
    if (Math.random() * 100 < Math.min(4.5, 2 + luckBonus)) { findTreasure(); return; }
    if (Math.random() * 100 < Math.min(47.5, 45 + luckBonus)) {
        var mobs2 = getMobsForLevel(locationLevel);
        var mob2 = mobs2[Math.floor(Math.random() * mobs2.length)];
        setMessage('⚔️ Вы встретили ' + mob2.name + ' (ур.' + mob2.level + ')');
        addLog('⚔️ ' + currentUser + ' встретил ' + mob2.name);
        startBattle(mob2); return;
    }
    setMessage('🔍 Никого. Тишина...');
}

function getMobsForLevel(level) {
    var thresholds = Object.keys(KINGS_LANDING_MOBS).map(Number).sort(function(a,b){ return a-b; });
    var selectedKey = thresholds[0];
    for (var i = 0; i < thresholds.length; i++) {
        var key = thresholds[i];
        if (level <= key) { selectedKey = key; break; }
        selectedKey = key;
    }
    return KINGS_LANDING_MOBS[selectedKey] || KINGS_LANDING_MOBS[1];
}

// ============================================================
// ОБНОВЛЕНИЕ КНОПОК
// ============================================================
function updateKingsLandingActions() {
    var user = users[currentUser];
    if (!user) return;
    if (user.game.location.location !== 'Королевская Гавань' && user.game.location.location !== 'Дорога') return;
    
    var container = document.getElementById('actions-container');
    if (!container) return;
    container.innerHTML = '';
    
    var inBattle = battleState && battleState.inProgress;
    var actions = [];
    
    if (inBattle) {
        actions = [
            { id:'battle_attack', label:'⚔️ Атака' },
            { id:'battle_defend', label:'🛡️ Защита' },
            { id:'battle_dodge', label:'💨 Уклонение' },
            { id:'battle_flee', label:'🏃 Побег' }
        ];
        if (battleState.horseAlive && battleState.horseHp > 0) {
            if (battleState.mounted) actions.unshift({ id:'battle_dismount', label:'🐴 Слезть' });
            else actions.unshift({ id:'battle_mount', label:'🐴 Сесть' });
        }
    } else {
        actions = getKingsLandingActions(user.game.location.place);
    }
    
    for (var i = 0; i < actions.length; i++) {
        var a = actions[i];
        var btn = document.createElement('button');
        btn.className = 'btn-game';
        btn.textContent = a.label;
        if (isBusy && !['character','inventory','refresh','map','menu','enter_city','leave_city'].includes(a.id) && !a.id.startsWith('battle_')) btn.disabled = true;
        
        btn.onclick = (function(actionId){
            return function(){
                setMessage('');
                if (actionId.startsWith('battle_')) { battleAction(actionId); return; }
                var handled = handleKingsLandingAction(actionId);
                if (!handled) {
                    if (typeof gameAction === 'function') gameAction(actionId);
                }
            };
        })(a.id);
        
        container.appendChild(btn);
    }
}

// ============================================================
// ПЕРЕХОД МЕЖДУ ЗДАНИЯМИ
// ============================================================
function goToKingsLandingBuilding(building) {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    if (isBusy) { setMessage('⏳ Вы заняты.'); return; }
    if (building === g.location.place) { setMessage('📍 Вы уже здесь.'); return; }
    
    var cityBuildings = [];
    for (var i = 0; i < KINGS_LANDING_BUILDINGS.length; i++) {
        cityBuildings.push(KINGS_LANDING_BUILDINGS[i].id);
    }
    var targetIsCity = false;
    for (var j = 0; j < cityBuildings.length; j++) {
        if (cityBuildings[j] === building) { targetIsCity = true; break; }
    }
    
    if (targetIsCity && g.outside) g.outside = false;
    else if (!targetIsCity && !g.outside) g.outside = true;
    
    g.location.place = building;
    g.location.location = targetIsCity ? 'Королевская Гавань' : building;
    
    setMessage('✅ Вы прибыли в ' + building + '.');
    addLog('🚶 ' + currentUser + ' перешёл в ' + building);
    closeMap();
    updateMenu(); updateKingsLandingStory(); updateKingsLandingActions(); saveData();
}

// ============================================================
// КАРТА (ИСПРАВЛЕНО — ДОРОГА ТОЛЬКО СНАРУЖИ)
// ============================================================
function openKingsLandingMap() {
    var user = users[currentUser];
    if (!user) return;
    var modal = document.getElementById('modal-map');
    var content = document.getElementById('modal-map-content');
    if (!modal || !content) return;
    
    var currentPlace = user.game.location.place;
    var isOutside = user.game.outside;
    
    var html = '';
    html += '<div class="modal-section"><h4>📍 ' + currentPlace + ' (ур.' + (KINGS_LANDING_LEVELS[currentPlace] || 1) + ')</h4></div>';
    html += '<div class="modal-section">';
    
    if (isOutside) {
        html += '<div class="row">';
        html += '<span class="label">🛤️ Дорога' + (currentPlace === 'Дорога' ? ' ⭐' : '') + '</span>';
        if (currentPlace !== 'Дорога') {
            html += '<span class="value"><button class="btn btn-small" onclick="goToKingsLandingBuilding(\'Дорога\')">🚶 Идти</button></span>';
        } else {
            html += '<span class="value" style="color:#6a5a48;">Вы здесь</span>';
        }
        html += '</div>';
        
        html += '<div class="row">';
        html += '<span class="label">🚪 Ворота (вход в город)</span>';
        html += '<span class="value"><button class="btn btn-small" onclick="goToKingsLandingBuilding(\'Ворота\')">🚶 Идти</button></span>';
        html += '</div>';
    } else {
        for (var j = 0; j < KINGS_LANDING_BUILDINGS.length; j++) {
            var b = KINGS_LANDING_BUILDINGS[j];
            var isCurrent = (b.id === currentPlace);
            html += '<div class="row">';
            html += '<span class="label">' + b.label + (isCurrent ? ' ⭐' : '') + '</span>';
            if (!isCurrent) {
                html += '<span class="value"><button class="btn btn-small" onclick="goToKingsLandingBuilding(\'' + b.id + '\')">🚶 Идти</button></span>';
            } else {
                html += '<span class="value" style="color:#6a5a48;">Вы здесь</span>';
            }
            html += '</div>';
        }
        
        html += '<div class="row" style="border-top:1px solid #3d3026; margin-top:8px; padding-top:8px;">';
        html += '<span class="label">🛤️ Выйти на Дорогу</span>';
        html += '<span class="value"><button class="btn btn-small" onclick="goToKingsLandingBuilding(\'Дорога\')">🚶 Идти</button></span>';
        html += '</div>';
    }
    
    html += '</div><button class="btn" onclick="closeMap()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

// ============================================================
// ПЕРЕОПРЕДЕЛЕНИЕ ГЛОБАЛЬНЫХ ФУНКЦИЙ
// ============================================================
var _origUpdateStory = (typeof updateStory === 'function') ? updateStory : null;
var _origUpdateActions = (typeof updateActions === 'function') ? updateActions : null;
var _origOpenMap = (typeof openMap === 'function') ? openMap : null;
var _origGoToBuilding = (typeof goToBuilding === 'function') ? goToBuilding : null;
var _origDoSearch = (typeof doSearch === 'function') ? doSearch : null;

updateStory = function(){
    var u = users[currentUser];
    if (!u) return;
    if (u.game.location.location === 'Королевская Гавань' || u.game.location.location === 'Дорога') {
        updateKingsLandingStory();
    } else if (_origUpdateStory) {
        _origUpdateStory();
    }
};

updateActions = function(){
    var u = users[currentUser];
    if (!u) return;
    if (u.game.location.location === 'Королевская Гавань' || u.game.location.location === 'Дорога') {
        updateKingsLandingActions();
    } else if (_origUpdateActions) {
        _origUpdateActions();
    }
};

openMap = function(){
    var u = users[currentUser];
    if (!u) return;
    if (u.game.location.location === 'Королевская Гавань' || u.game.location.location === 'Дорога') {
        openKingsLandingMap();
    } else if (_origOpenMap) {
        _origOpenMap();
    }
};

goToBuilding = function(building){
    var u = users[currentUser];
    if (!u) return;
    if (u.game.location.location === 'Королевская Гавань' || u.game.location.location === 'Дорога') {
        goToKingsLandingBuilding(building);
    } else if (_origGoToBuilding) {
        _origGoToBuilding(building);
    }
};

doSearch = function(){
    var u = users[currentUser];
    if (!u) return;
    if (u.game.location.location === 'Королевская Гавань' || u.game.location.location === 'Дорога') {
        doKingsLandingSearch();
    } else if (_origDoSearch) {
        _origDoSearch();
    }
};

// ============================================================
// ЗАПУСК
// ============================================================
initKingsLanding();
console.log('🦁 Королевская Гавань готова.');

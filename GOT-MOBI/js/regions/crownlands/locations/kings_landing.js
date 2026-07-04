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

// --- ОПИСАНИЯ ЗДАНИЙ (для updateStory) ---
const KINGS_LANDING_TEXTS = {
    'Таверна': '🍺 Добро пожаловать в таверну «Пьяный Лев». Здесь можно поесть, поработать и поговорить с трактирщиком. Лучший эль в городе!',
    'Рынок': '🏪 Центральный рынок Королевской Гавани. Десятки торговых лавок, крики зазывал, запах специй и рыбы. Здесь можно торговать с другими игроками.',
    'Кузница': '⚒️ Вы в кузнице Тобхо Мотта. Жар от горна, звон молотов. Здесь можно купить ресурсы и скрафтить предметы.',
    'Оружейная лавка': '🗡️ Оружейная лавка. Стены увешаны мечами, копьями, топорами. Здесь можно купить и продать оружие.',
    'Кожевник': '🪡 Вы у кожевника. Запах дублёной кожи. Здесь можно купить и продать кожаную броню.',
    'Бронник': '🛡️ Вы у бронника. На стойках сияют стальные доспехи. Здесь можно купить и продать латную броню.',
    'Плотник': '🪵 Вы у плотника. Пахнет свежей древесиной. Здесь можно купить и продать луки и арбалеты.',
    'Конюшня': '🐴 Королевская конюшня. Здесь можно купить лошадь, продать или просто полюбоваться на скакунов.',
    'Гильдия торговцев': '🏛️ Гильдия торговцев Королевской Гавани. Здесь можно торговать на аукционе с другими игроками.',
    'Магистрат': '📜 Магистрат — центр управления городом. Здесь можно купить жильё, оплатить аренду и уладить городские дела.',
    'Ворота': '🚪 Вы у городских ворот Королевской Гавани. Отсюда можно выйти на Дорогу.',
    'Королевский квартал': '👑 Элитный район Королевской Гавани. Здесь живут самые богатые и влиятельные люди. Особняки, сады, фонтаны.',
    'Торговый квартал': '🏙️ Центр торговли. Здесь селятся ремесленники и купцы. Уютные дома и комнаты.',
    'Квартал бедноты': '🏚️ Окраина города. Жильё здесь дёшево, но опасно. Можно встретить пьянчуг, нищих и разбойников.',
    'Дом': '🏠 Ваш дом. Здесь можно отдохнуть, хранить вещи и чувствовать себя в безопасности.',
    'Великая септа': '⛪ Великая Септа Бейлора — главный храм Семерых в Вестеросе. Здесь можно исцелиться и получить благословение удачи.',
    'Порт': '⛵ Порт Королевской Гавани. Корабли со всего света. Скоро здесь можно будет путешествовать между городами Вестероса.',
    'Тюрьма': '⛓️ Вы в тюрьме Королевской Гавани. Сырые стены, крысы, цепи. Заплатите штраф или ждите освобождения.',
    'Библиотека мейстеров': '📚 Библиотека мейстеров. Пыльные фолианты, свечи, тишина. Здесь можно купить и читать книги.',
    'Гильдия наёмников': '🗡️ Гильдия наёмников. Здесь дают ежедневные задания и контракты. Пахнет потом и сталью.',
    'Бордель': '💃 Бордель Королевской Гавани. Бархат, вино, музыка. Отдых, развлечения и игра в кости.',
    'Дорога': '🛤️ Вы на дороге у ворот Королевской Гавани. Куда направитесь?'
};

// --- ТОВАРЫ В ТАВЕРНЕ (цены в меди) ---
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

// --- РАБОТЫ В ТАВЕРНЕ ---
const TAVERN_JOBS = [
    { id:'wash', name:'🧼 Помыть посуду', duration:1, reward:1 },
    { id:'sweep', name:'🧹 Подмести пол', duration:5, reward:5 },
    { id:'serve', name:'🍺 Подавать эль', duration:10, reward:12 },
    { id:'kitchen', name:'🔪 Помочь на кухне', duration:15, reward:20 },
    { id:'cellar', name:'📦 Разгрузить погреб', duration:20, reward:30 }
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
// ИНИЦИАЛИЗАЦИЯ КОРОЛЕВСКОЙ ГАВАНИ
// ============================================================
function initKingsLanding() {
    // Расширяем глобальный BUILDINGS
    BUILDINGS.length = 0;
    KINGS_LANDING_BUILDINGS.forEach(b => BUILDINGS.push(b));
    
    // Расширяем LOCATION_LEVELS
    Object.assign(LOCATION_LEVELS, KINGS_LANDING_LEVELS);
    
    // Расширяем тексты
    if (!window.LOCATION_TEXTS) window.LOCATION_TEXTS = {};
    Object.assign(window.LOCATION_TEXTS, KINGS_LANDING_TEXTS);
    
    console.log('🦁 Королевская Гавань загружена. 21 здание.');
}

// ============================================================
// ОБНОВЛЕНИЕ ОПИСАНИЯ ЛОКАЦИИ
// ============================================================
function updateKingsLandingStory() {
    const user = users[currentUser];
    if (!user) return;
    if (user.game.location.location !== 'Королевская Гавань') return;
    
    const place = user.game.location.place;
    const text = KINGS_LANDING_TEXTS[place] || 'Вы находитесь в ' + place + '.';
    document.getElementById('story-title').textContent = '📍 ' + place + ' (ур.' + (KINGS_LANDING_LEVELS[place] || 1) + ')';
    document.getElementById('story-text').textContent = text;
}

// ============================================================
// ДЕЙСТВИЯ ДЛЯ КАЖДОГО ЗДАНИЯ
// ============================================================
function getKingsLandingActions(place) {
    const user = users[currentUser];
    if (!user) return [];
    const g = user.game;
    let actions = [];
    
    // Базовые действия (есть везде)
    const baseActions = [
        { id:'inventory', label:'🎒 Инвентарь' },
        { id:'character', label:'👤 Персонаж' },
        { id:'menu', label:'📋 Меню' },
        { id:'map', label:'🗺️ Карта' }
    ];
    
    switch(place) {
        case 'Таверна':
            actions = [
                { id:'eat', label:'🍞 Попросить еды (+25)' },
                { id:'trade', label:'🛒 Торговля в таверне' },
                { id:'wash', label:'🧼 Помыть посуду (1 мин → 1 МП)' },
                { id:'sweep', label:'🧹 Подмести пол (5 мин → 5 МП)' },
                { id:'rest', label:'🛏️ Отдохнуть (10 МП → +30 уст., +15 HP)' },
                { id:'talk', label:'🗣️ Поговорить с трактирщиком' },
                ...baseActions
            ];
            break;
            
        case 'Рынок':
            actions = [
                { id:'open_market', label:'🏪 Рынок' },
                ...baseActions
            ];
            break;
            
        case 'Кузница':
            actions = [
                { id:'shop', label:'⚒️ Кузница' },
                { id:'craft', label:'🔨 Крафт' },
                ...baseActions
            ];
            break;
            
        case 'Оружейная лавка':
            actions = [
                { id:'shop', label:'🗡️ Оружейная лавка' },
                ...baseActions
            ];
            break;
            
        case 'Кожевник':
            actions = [
                { id:'shop', label:'🪡 Кожевник' },
                ...baseActions
            ];
            break;
            
        case 'Бронник':
            actions = [
                { id:'shop', label:'🛡️ Бронник' },
                ...baseActions
            ];
            break;
            
        case 'Плотник':
            actions = [
                { id:'shop', label:'🪵 Плотник' },
                ...baseActions
            ];
            break;
            
        case 'Конюшня':
            actions = [
                { id:'open_stable', label:'🐴 Конюшня' },
                ...baseActions
            ];
            break;
            
        case 'Гильдия торговцев':
            actions = [
                { id:'guild', label:'🏛️ Аукцион' },
                ...baseActions
            ];
            break;
            
        case 'Магистрат':
            actions = [
                { id:'open_magistrate', label:'📜 Недвижимость' },
                ...baseActions
            ];
            break;
            
        case 'Ворота':
            if (!g.outside) {
                actions = [
                    { id:'leave_city', label:'🚪 Выйти на Дорогу' },
                    ...baseActions
                ];
            } else {
                actions = [...baseActions];
            }
            break;
            
        case 'Дорога':
            actions = [
                { id:'enter_city', label:'🚶 Войти в Королевскую Гавань' },
                { id:'search', label:'🔍 Поиск' },
                ...baseActions
            ];
            break;
            
        case 'Королевский квартал':
        case 'Торговый квартал':
        case 'Квартал бедноты':
            const hasHouse = checkHouseInDistrict(place);
            if (hasHouse) {
                actions = [
                    { id:'enter_home', label:'🏠 Зайти домой' },
                    { id:'search', label:'🔍 Поиск' },
                    ...baseActions
                ];
            } else {
                actions = [
                    { id:'buy_housing', label:'🏠 Купить жильё в этом районе' },
                    { id:'search', label:'🔍 Поиск' },
                    ...baseActions
                ];
            }
            break;
            
        case 'Дом':
            actions = [
                { id:'rest_at_home', label:'🛏️ Отдохнуть (бесплатно)' },
                { id:'storage', label:'📦 Склад' },
                { id:'leave_home', label:'🚪 Выйти из дома' },
                ...baseActions
            ];
            break;
            
        case 'Великая септа':
            actions = [
                { id:'open_temple', label:'⛪ Септа' },
                ...baseActions
            ];
            break;
            
        case 'Порт':
            actions = [
                { id:'open_port', label:'⛵ Порт' },
                ...baseActions
            ];
            break;
            
        case 'Тюрьма':
            actions = [
                { id:'jail_pay', label:'💰 Заплатить штраф' },
                { id:'jail_wait', label:'⏳ Ждать освобождения (5 мин)' },
                { id:'jail_escape', label:'🏃 Попытаться сбежать' },
                ...baseActions
            ];
            break;
            
        case 'Библиотека мейстеров':
            actions = [
                { id:'open_library', label:'📚 Библиотека' },
                ...baseActions
            ];
            break;
            
        case 'Гильдия наёмников':
            actions = [
                { id:'open_guildhall', label:'🗡️ Гильдия наёмников' },
                ...baseActions
            ];
            break;
            
        case 'Бордель':
            actions = [
                { id:'open_brothel', label:'💃 Бордель' },
                ...baseActions
            ];
            if (g.brothelRoom) {
                actions.unshift({ id:'rest_brothel', label:'🛏️ Отдохнуть (бесплатно)' });
            }
            break;
            
        default:
            actions = [...baseActions];
    }
    
    // Добавляем обновление
    if (!actions.find(a => a.id === 'refresh')) {
        actions.push({ id:'refresh', label:'🔄 Обновить' });
    }
    
    return actions;
}

// ============================================================
// ОБРАБОТЧИК ДЕЙСТВИЙ КОРОЛЕВСКОЙ ГАВАНИ
// ============================================================
function handleKingsLandingAction(action) {
    const user = users[currentUser];
    if (!user) return false;
    const g = user.game;
    
    // Проверяем, не в бою ли мы
    if (battleState && battleState.inProgress) {
        if (['character','inventory','refresh','map','menu'].includes(action)) {
            return false; // разрешаем базовые действия даже в бою
        }
        if (action.startsWith('battle_')) {
            return false; // боевые действия обрабатываются отдельно
        }
        setMessage('⚔️ Вы в бою! Завершите бой.');
        return true;
    }
    
    switch(action) {
        case 'eat':
            if (g.food >= 100) { setMessage('🍖 Вы сыты.'); return true; }
            g.food = Math.min(g.food + 25, 100);
            setMessage('🍞 Вы поели. Еда +25.');
            updateMenu(); saveData();
            return true;
            
        case 'trade':
            openTavernTrade();
            return true;
            
        case 'wash':
            startBusy('Моете посуду', 1, function(){
                g.copper += 1;
                convertCurrency(g);
                setMessage('🧼 Вы помыли посуду. +1 МП.');
                updateMenu(); saveData();
            });
            return true;
            
        case 'sweep':
            startBusy('Подметаете пол', 5, function(){
                g.copper += 5;
                convertCurrency(g);
                setMessage('🧹 Вы подмели пол. +5 МП.');
                updateMenu(); saveData();
            });
            return true;
            
        case 'rest':
            if (!spendMoney(g, 10)) {
                setMessage('❌ Недостаточно денег для отдыха (10 МП).');
                return true;
            }
            g.fatigue = Math.min(100, g.fatigue + 30);
            g.hp = Math.min(g.maxHp, g.hp + 15);
            setMessage('🛏️ Вы отдохнули. Усталость +30, HP +15.');
            updateMenu(); saveData();
            return true;
            
        case 'talk':
            const msg = BARKEEP_QUOTES[Math.floor(Math.random() * BARKEEP_QUOTES.length)];
            setMessage(msg);
            return true;
            
        case 'search':
            if (searchCooldown) { setMessage('⏳ Подождите 5 секунд.'); return true; }
            searchCooldown = true;
            setTimeout(() => { searchCooldown = false; }, 5000);
            doKingsLandingSearch();
            return true;
            
        case 'leave_city':
            g.location.place = 'Дорога';
            g.location.location = 'Дорога';
            g.outside = true;
            setMessage('🛤️ Вы вышли на Дорогу.');
            updateMenu(); updateKingsLandingStory(); updateKingsLandingActions(); saveData();
            return true;
            
        case 'enter_city':
            g.location.place = 'Ворота';
            g.location.location = 'Королевская Гавань';
            g.outside = false;
            setMessage('🚪 Вы вошли в город через Ворота.');
            updateMenu(); updateKingsLandingStory(); updateKingsLandingActions(); saveData();
            return true;
            
        case 'buy_housing':
            viewDistrict(g.location.place);
            return true;
            
        case 'enter_home':
            enterHome();
            return true;
            
        case 'rest_at_home':
            restAtHome();
            return true;
            
        case 'storage':
            openStorage();
            return true;
            
        case 'leave_home':
            if (g.housing && g.housing.type) {
                const house = HOUSING_TYPES[g.housing.type];
                g.location.place = house.district;
                g.location.location = 'Королевская Гавань';
                setMessage('🚪 Вы вышли из дома в ' + house.district + '.');
            } else {
                g.location.place = 'Таверна';
                g.location.location = 'Королевская Гавань';
                setMessage('🚪 Вы вышли из дома.');
            }
            updateMenu(); updateKingsLandingStory(); updateKingsLandingActions(); saveData();
            return true;
            
        case 'rest_brothel':
            if (g.brothelRoom) {
                g.fatigue = Math.min(100, g.fatigue + 30);
                g.hp = Math.min(g.maxHp, g.hp + 10);
                setMessage('🛏️ Вы отдохнули в своей комнате. +30 усталости, +10 HP');
                updateMenu(); saveData();
            } else {
                setMessage('❌ У вас нет комнаты. Арендуйте её.');
            }
            return true;
    }
    
    // Если действие не обработано здесь, возвращаем false для глобального обработчика
    return false;
}

// ============================================================
// ПОИСК В КОРОЛЕВСКОЙ ГАВАНИ
// ============================================================
function doKingsLandingSearch() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    const place = g.location.place;
    const locationLevel = KINGS_LANDING_LEVELS[place] || 1;
    const luck = Math.min(25, g.luck || 0);
    const luckBonus = Math.floor(luck / 10);
    
    // Поиск в Квартале бедноты (особый)
    if (place === 'Квартал бедноты') {
        if (Math.random() * 100 < 20) {
            findDrunkard();
            return;
        }
        const treasureChance = Math.min(4.5, 2 + luckBonus);
        if (Math.random() * 100 < treasureChance) {
            findTreasure();
            return;
        }
        const monsterChance = Math.min(47.5, 45 + luckBonus);
        if (Math.random() * 100 < monsterChance) {
            const mobs = getMobsForLevel(locationLevel);
            const mob = mobs[Math.floor(Math.random() * mobs.length)];
            setMessage('⚔️ Вы встретили ' + mob.name + ' (уровень ' + mob.level + ')');
            addLog('⚔️ ' + currentUser + ' встретил ' + mob.name);
            startBattle(mob);
            return;
        }
        setMessage('🔍 В Квартале бедноты тихо... Пока.');
        return;
    }
    
    // Обычный поиск
    const treasureChance = Math.min(4.5, 2 + luckBonus);
    if (Math.random() * 100 < treasureChance) {
        findTreasure();
        return;
    }
    
    const monsterChance = Math.min(47.5, 45 + luckBonus);
    if (Math.random() * 100 < monsterChance) {
        const mobs = getMobsForLevel(locationLevel);
        const mob = mobs[Math.floor(Math.random() * mobs.length)];
        setMessage('⚔️ Вы встретили ' + mob.name + ' (уровень ' + mob.level + ')');
        addLog('⚔️ ' + currentUser + ' встретил ' + mob.name);
        startBattle(mob);
        return;
    }
    
    setMessage('🔍 Вы никого не нашли. Тишина...');
}

function getMobsForLevel(level) {
    const thresholds = Object.keys(KINGS_LANDING_MOBS).map(Number).sort((a,b) => a-b);
    let selectedKey = thresholds[0];
    for (let key of thresholds) {
        if (level <= key) {
            selectedKey = key;
            break;
        }
        selectedKey = key;
    }
    return KINGS_LANDING_MOBS[selectedKey] || KINGS_LANDING_MOBS[1];
}

// ============================================================
// ОБНОВЛЕНИЕ КНОПОК ДЕЙСТВИЙ
// ============================================================
function updateKingsLandingActions() {
    const user = users[currentUser];
    if (!user) return;
    if (user.game.location.location !== 'Королевская Гавань' && 
        user.game.location.location !== 'Дорога') return;
    
    const place = user.game.location.place;
    const container = document.getElementById('actions-container');
    if (!container) return;
    container.innerHTML = '';
    
    const inBattle = battleState && battleState.inProgress;
    let actions = [];
    
    if (inBattle) {
        actions = [
            { id:'battle_attack', label:'⚔️ Атака' },
            { id:'battle_defend', label:'🛡️ Защита' },
            { id:'battle_dodge', label:'💨 Уклонение' },
            { id:'battle_flee', label:'🏃 Побег' }
        ];
        if (battleState.horseAlive && battleState.horseHp > 0) {
            if (battleState.mounted) {
                actions.unshift({ id:'battle_dismount', label:'🐴 Слезть с лошади' });
            } else {
                actions.unshift({ id:'battle_mount', label:'🐴 Сесть на лошадь' });
            }
        }
    } else {
        actions = getKingsLandingActions(place);
    }
    
    actions.forEach(a => {
        const btn = document.createElement('button');
        btn.className = 'btn-game';
        btn.textContent = a.label;
        if (isBusy && !['character','inventory','refresh','map','menu','enter_city','leave_city'].includes(a.id) && !a.id.startsWith('battle_')) {
            btn.disabled = true;
        }
        btn.onclick = function() {
            setMessage('');
            // Сначала пробуем обработать локально
            if (a.id.startsWith('battle_')) {
                battleAction(a.id);
                return;
            }
            if (!handleKingsLandingAction(a.id)) {
                // Если не обработано, пробуем глобальный обработчик
                if (typeof gameAction === 'function') {
                    gameAction(a.id);
                }
            }
        };
        container.appendChild(btn);
    });
}

// ============================================================
// ПЕРЕХОД МЕЖДУ ЗДАНИЯМИ
// ============================================================
function goToKingsLandingBuilding(building) {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    
    if (isBusy) { setMessage('⏳ Вы заняты.'); return; }
    if (building === g.location.place) { setMessage('📍 Вы уже здесь.'); return; }
    
    const cityBuildings = KINGS_LANDING_BUILDINGS.map(b => b.id);
    const targetIsCity = cityBuildings.includes(building);
    
    if (targetIsCity && g.outside) g.outside = false;
    else if (!targetIsCity && !g.outside) g.outside = true;
    
    g.location.place = building;
    if (targetIsCity) g.location.location = 'Королевская Гавань';
    else g.location.location = building;
    
    setMessage('✅ Вы прибыли в ' + building + '.');
    addLog('🚶 ' + currentUser + ' перешёл в ' + building);
    
    closeMap();
    updateMenu();
    updateKingsLandingStory();
    updateKingsLandingActions();
    saveData();
}

// ============================================================
// ОТКРЫТИЕ КАРТЫ ГОРОДА// ============================================================
function openKingsLandingMap() {
    const user = users[currentUser];
    if (!user) return;
    const modal = document.getElementById('modal-map');
    const content = document.getElementById('modal-map-content');
    
    let html = '<div class="modal-section"><h4>📍 ' + user.game.location.place + ' (ур. ' + (KINGS_LANDING_LEVELS[user.game.location.place] || 1) + ')</h4></div>';
    html += '<div class="modal-section">';
    
    KINGS_LANDING_BUILDINGS.forEach(b => {
        const isCurrent = b.id === user.game.location.place;
        const showBuilding = user.game.outside ? !cityBuildings.includes(b.id) : cityBuildings.includes(b.id);
        
        if ((user.game.outside && b.id === 'Дорога') || (!user.game.outside && b.id !== 'Дорога')) {
            html += '<div class="row">';
            html += '<span class="label">' + b.label + (isCurrent ? ' ⭐' : '') + '</span>';
            if (!isCurrent) {
                html += '<span class="value"><button class="btn btn-small" onclick="goToKingsLandingBuilding(\'' + b.id + '\')">🚶 Идти</button></span>';
            } else {
                html += '<span class="value" style="color:#6a5a48;">Вы здесь</span>';
            }
            html += '</div>';
        }
    });
    
    // Дорога (всегда показываем)
    if (user.game.outside) {
        html += '<div class="row">';
        html += '<span class="label">🚪 Ворота</span>';
        html += '<span class="value"><button class="btn btn-small" onclick="goToKingsLandingBuilding(\'Ворота\')">🚶 Идти</button></span>';
        html += '</div>';
    } else {
        html += '<div class="row">';
        html += '<span class="label">🛤️ Дорога</span>';
        html += '<span class="value"><button class="btn btn-small" onclick="goToKingsLandingBuilding(\'Дорога\')">🚶 Идти</button></span>';
        html += '</div>';
    }
    
    html += '</div><button class="btn" onclick="closeMap()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

// ============================================================
// ПЕРЕОПРЕДЕЛЯЕМ ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ КОРОЛЕВСКОЙ ГАВАНИ
// ============================================================

// Сохраняем оригинальные функции
const _originalUpdateStory = typeof updateStory === 'function' ? updateStory : null;
const _originalUpdateActions = typeof updateActions === 'function' ? updateActions : null;
const _originalOpenMap = typeof openMap === 'function' ? openMap : null;
const _originalGoToBuilding = typeof goToBuilding === 'function' ? goToBuilding : null;
const _originalDoSearch = typeof doSearch === 'function' ? doSearch : null;

// Переопределяем
updateStory = function() {
    const user = users[currentUser];
    if (!user) return;
    if (user.game.location.location === 'Королевская Гавань' || user.game.location.location === 'Дорога') {
        updateKingsLandingStory();
    } else if (_originalUpdateStory) {
        _originalUpdateStory();
    }
};

updateActions = function() {
    const user = users[currentUser];
    if (!user) return;
    if (user.game.location.location === 'Королевская Гавань' || user.game.location.location === 'Дорога') {
        updateKingsLandingActions();
    } else if (_originalUpdateActions) {
        _originalUpdateActions();
    }
};

openMap = function() {
    const user = users[currentUser];
    if (!user) return;
    if (user.game.location.location === 'Королевская Гавань' || user.game.location.location === 'Дорога') {
        openKingsLandingMap();
    } else if (_originalOpenMap) {
        _originalOpenMap();
    }
};

goToBuilding = function(building) {
    const user = users[currentUser];
    if (!user) return;
    if (user.game.location.location === 'Королевская Гавань' || user.game.location.location === 'Дорога') {
        goToKingsLandingBuilding(building);
    } else if (_originalGoToBuilding) {
        _originalGoToBuilding(building);
    }
};

doSearch = function() {
    const user = users[currentUser];
    if (!user) return;
    if (user.game.location.location === 'Королевская Гавань' || user.game.location.location === 'Дорога') {
        doKingsLandingSearch();
    } else if (_originalDoSearch) {
        _originalDoSearch();
    }
};

// ============================================================
// ЗАПУСК ИНИЦИАЛИЗАЦИИ
// ============================================================
initKingsLanding();

console.log('🦁 Королевская Гавань: все здания активны.');
console.log('   🍺 Таверна (еда, работа, отдых, трактирщик)');
console.log('   🏪 Рынок (торговые лавки)');
console.log('   ⚒️ Кузница (ресурсы, крафт)');
console.log('   🗡️ Оружейная лавка (оружие)');
console.log('   🪡 Кожевник (кожаная броня)');
console.log('   🛡️ Бронник (латная броня)');
console.log('   🪵 Плотник (луки, арбалеты)');
console.log('   🐴 Конюшня (лошади)');
console.log('   🏛️ Гильдия торговцев (аукцион)');
console.log('   📜 Магистрат (недвижимость)');
console.log('   🚪 Ворота (выход на Дорогу)');
console.log('   👑 Королевский квартал (элитное жильё)');
console.log('   🏙️ Торговый квартал (среднее жильё)');
console.log('   🏚️ Квартал бедноты (дешёвое жильё, пьянчужки)');
console.log('   🏠 Дом (отдых, склад)');
console.log('   ⛪ Великая септа (зелья, исцеление, молитва)');
console.log('   ⛵ Порт (путешествия — скоро)');
console.log('   ⛓️ Тюрьма (штраф, побег)');
console.log('   📚 Библиотека мейстеров (книги)');
console.log('   🗡️ Гильдия наёмников (задания)');
console.log('   💃 Бордель (отдых, баффы, кости)');

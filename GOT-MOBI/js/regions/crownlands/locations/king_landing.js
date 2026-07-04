// ============================================================
// MAIN.JS — ТОЧКА ВХОДА
// ============================================================

// ============================================================
// РЕГИСТРАЦИЯ
// ============================================================
function handleRegister() {
    const name = document.getElementById('reg-name').value.trim();
    const password = document.getElementById('reg-password').value;
    const nationality = document.getElementById('reg-nationality').value;
    const secret = document.getElementById('reg-secret').value.trim();
    const errEl = document.getElementById('register-error');
    const okEl = document.getElementById('register-success');
    const formEl = document.getElementById('register-form');
    
    errEl.classList.add('hide'); 
    okEl.classList.add('hide'); 
    formEl.classList.remove('hide');
    
    if (!name || !password || !nationality || !secret) {
        errEl.textContent = '❌ Заполните все поля'; 
        errEl.classList.remove('hide'); 
        return;
    }
    if (name.length < 2) { 
        errEl.textContent = '❌ Имя слишком короткое'; 
        errEl.classList.remove('hide'); 
        return; 
    }
    if (password.length < 4) { 
        errEl.textContent = '❌ Пароль слишком короткий'; 
        errEl.classList.remove('hide'); 
        return; 
    }
    if (!NATIONALITIES[nationality]) { 
        errEl.textContent = '❌ Выберите национальность'; 
        errEl.classList.remove('hide'); 
        return; 
    }
    if (users[name]) { 
        errEl.textContent = '❌ Это имя уже занято'; 
        errEl.classList.remove('hide'); 
        return; 
    }
    
    const now = Date.now();
    const skills = {};
    ['sword', 'spear', 'mace', 'axe', 'bow', 'crossbow', 'shield', 'dagger'].forEach(s => { 
        skills[s] = { level: 1, xp: 0 }; 
    });
    
    users[name] = {
        password: hash(password),
        nationality: nationality,
        secret: hash(secret),
        created: now,
        game: {
            gold: 100, silver: 0, copper: 0,
            food: 100, thirst: 100, fatigue: 100,
            hp: 60, maxHp: 60,
            level: 1, xp: 0, nextLevelXp: 100,
            attributePoints: 0,
            stats: { damage: 1, defense: 1, intelligence: 1, agility: 1 },
            equipment: { rightHand: null, leftHand: null, helmet: null, chestplate: null, shoulders: null, leggings: null, boots: null, gloves: null, belt: null, cloak: null, horse: null },
            skills: skills,
            stamina: { level: 1, xp: 0 },
            professions: { 'Шахтёр': 1, 'Лесоруб': 1, 'Охотник': 1, 'Кузнец': 1 },
            professionXp: { 'Шахтёр': 0, 'Лесоруб': 0, 'Охотник': 0, 'Кузнец': 0 },
            activeProfession: 'Охотник',
            lastProfessionChange: 0,
            inventory: [],
            location: { region: 'Королевские земли', location: 'Королевская Гавань', place: 'Таверна' },
            outside: false,
            death: null,
            lastReset: null,
            lastActive: now,
            online: true,
            lastResourceUpdate: now,
            luck: 0,
            lastHeal: null,
            lastPrayer: null,
            blessing: { active: false, expires: 0 },
            jail: null,
            activeBonuses: { crit: 5, pierce: 5, doubleHit: 5, counter: 5, points: 0 },
            marketStall: { owned: false, stallId: null, rentPaid: null, rentDays: 0, debt: 0 },
            housing: { type: null, purchased: null, rentPaid: null, rentDays: 0, debt: 0, storage: [], storageHold: [] },
            booksBoughtToday: 0,
            lastBookReset: now,
            quests: { completed: [], lastReset: 0, active: null, progress: {} },
            brothelBuffs: [],
            brothelRoom: false
        }
    };
    
    addLog('👤 ' + name + ' создал персонажа (' + nationality + ')');
    saveData();
    
    formEl.classList.add('hide');
    okEl.innerHTML = '✅ Поздравляем, <strong>' + name + '</strong>!<br>Вы — ' + nationality;
    okEl.classList.remove('hide');
    currentUser = name;
    localStorage.setItem('got_user', name);
    
    setTimeout(function() { enterGame(name); }, 1200);
}

// ============================================================
// ВХОД
// ============================================================
function handleLogin() {
    const name = document.getElementById('login-name').value.trim();
    const password = document.getElementById('login-password').value;
    const errEl = document.getElementById('login-error');
    errEl.classList.add('hide');
    
    if (!name || !password) { 
        errEl.textContent = '❌ Заполните все поля'; 
        errEl.classList.remove('hide'); 
        return; 
    }
    
    const user = users[name];
    if (!user || user.password !== hash(password)) {
        errEl.textContent = '❌ Неверное имя или пароль';
        errEl.classList.remove('hide');
        return;
    }
    
    localStorage.setItem('got_user', name);
    currentUser = name;
    addLog('👤 ' + name + ' вошёл в игру');
    enterGame(name);
}

// ============================================================
// ФИКС СТАРЫХ АККАУНТОВ
// ============================================================
function fixOldAccount(user) {
    if (!user) return user;
    if (!user.game) {
        user.game = {
            gold: 100, silver: 0, copper: 0,
            food: 100, thirst: 100, fatigue: 100,
            hp: 60, maxHp: 60,
            level: 1, xp: 0, nextLevelXp: 100,
            attributePoints: 0,
            stats: { damage: 1, defense: 1, intelligence: 1, agility: 1 },
            equipment: { rightHand: null, leftHand: null, helmet: null, chestplate: null, shoulders: null, leggings: null, boots: null, gloves: null, belt: null, cloak: null, horse: null },
            skills: {},
            stamina: { level: 1, xp: 0 },
            professions: { 'Шахтёр': 1, 'Лесоруб': 1, 'Охотник': 1, 'Кузнец': 1 },
            professionXp: { 'Шахтёр': 0, 'Лесоруб': 0, 'Охотник': 0, 'Кузнец': 0 },
            activeProfession: 'Охотник',
            lastProfessionChange: 0,
            inventory: [],
            location: { region: 'Королевские земли', location: 'Королевская Гавань', place: 'Таверна' },
            outside: false,
            death: null,
            lastReset: null,
            lastActive: Date.now(),
            online: true,
            lastResourceUpdate: Date.now(),
            luck: 0,
            lastHeal: null,
            lastPrayer: null,
            blessing: { active: false, expires: 0 },
            jail: null,
            activeBonuses: { crit: 5, pierce: 5, doubleHit: 5, counter: 5, points: 0 },
            marketStall: { owned: false, stallId: null, rentPaid: null, rentDays: 0, debt: 0 },
            housing: { type: null, purchased: null, rentPaid: null, rentDays: 0, debt: 0, storage: [], storageHold: [] },
            booksBoughtToday: 0,
            lastBookReset: Date.now(),
            quests: { completed: [], lastReset: 0, active: null, progress: {} },
            brothelBuffs: [],
            brothelRoom: false
        };
        return user;
    }
    
    const g = user.game;
    if (g.lastResourceUpdate === undefined) g.lastResourceUpdate = Date.now();
    if (g.stamina === undefined) g.stamina = { level: 1, xp: 0 };
    if (g.professions === undefined) {
        g.professions = { 'Шахтёр': 1, 'Лесоруб': 1, 'Охотник': 1, 'Кузнец': 1 };
        g.professionXp = { 'Шахтёр': 0, 'Лесоруб': 0, 'Охотник': 0, 'Кузнец': 0 };
    }
    if (g.activeProfession === undefined) g.activeProfession = 'Охотник';
    if (g.lastProfessionChange === undefined) g.lastProfessionChange = 0;
    if (g.skills === undefined) {
        g.skills = {};
        ['sword', 'spear', 'mace', 'axe', 'bow', 'crossbow', 'shield', 'dagger'].forEach(s => { 
            g.skills[s] = { level: 1, xp: 0 }; 
        });
    }
    if (g.equipment === undefined) {
        g.equipment = { rightHand: null, leftHand: null, helmet: null, chestplate: null, shoulders: null, leggings: null, boots: null, gloves: null, belt: null, cloak: null, horse: null };
    }
    if (g.hp === undefined) g.hp = 60;
    if (g.maxHp === undefined) g.maxHp = 60;
    if (g.outside === undefined) g.outside = false;
    if (g.stats === undefined) g.stats = { damage: 1, defense: 1, intelligence: 1, agility: 1 };
    if (g.attributePoints === undefined) g.attributePoints = 0;
    if (g.lastReset === undefined) g.lastReset = null;
    if (g.luck === undefined) g.luck = 0;
    if (g.lastHeal === undefined) g.lastHeal = null;
    if (g.lastPrayer === undefined) g.lastPrayer = null;
    if (g.blessing === undefined) g.blessing = { active: false, expires: 0 };
    if (g.jail === undefined) g.jail = null;
    if (g.activeBonuses === undefined) {
        g.activeBonuses = { crit: 5, pierce: 5, doubleHit: 5, counter: 5, points: 0 };
    }
    if (g.marketStall === undefined) {
        g.marketStall = { owned: false, stallId: null, rentPaid: null, rentDays: 0, debt: 0 };
    }
    if (g.housing === undefined) {
        g.housing = { type: null, purchased: null, rentPaid: null, rentDays: 0, debt: 0, storage: [], storageHold: [] };
    }
    if (g.housing.storage === undefined) g.housing.storage = [];
    if (g.housing.storageHold === undefined) g.housing.storageHold = [];
    if (g.online === undefined) g.online = true;
    if (g.lastActive === undefined) g.lastActive = Date.now();
    if (g.booksBoughtToday === undefined) g.booksBoughtToday = 0;
    if (g.lastBookReset === undefined) g.lastBookReset = Date.now();
    if (g.quests === undefined) {
        g.quests = { completed: [], lastReset: 0, active: null, progress: {} };
    }
    if (g.brothelBuffs === undefined) g.brothelBuffs = [];
    if (g.brothelRoom === undefined) g.brothelRoom = false;
    return user;
}

// ============================================================
// ВХОД В ИГРУ
// ============================================================
function getMaxHp(g) {
    const staminaLevel = g.stamina?.level || 1;
    let bonusHp = 0;
    if (g.housing && g.housing.type && HOUSING_TYPES[g.housing.type]) {
        bonusHp = HOUSING_TYPES[g.housing.type].restHp || 0;
    }
    return 60 + (g.level - 1) * 10 + staminaLevel * 2 + bonusHp;
}

function enterGame(name) {
    const user = users[name];
    if (!user) return;
    
    fixOldAccount(user);
    
    const g = user.game;
    if (!g) return;
    
    showPage('game');
    g.online = true;
    
    const now = Date.now();
    const lastActive = g.lastActive || now;
    const diffMinutes = lastActive ? (now - lastActive) / 60000 : 0;
    
    if (diffMinutes > 1) {
        const foodLoss = Math.floor(diffMinutes / 15);
        const thirstLoss = Math.floor(diffMinutes / 10);
        g.food = Math.max(0, g.food - foodLoss);
        g.thirst = Math.max(0, g.thirst - thirstLoss);
        if (foodLoss > 0 || thirstLoss > 0) {
            setMessage('⏰ За время отсутствия: еда -' + foodLoss + ', жажда -' + thirstLoss);
        }
    }
    
    g.lastActive = now;
    g.lastResourceUpdate = now;
    g.maxHp = getMaxHp(g);
    if (g.hp === undefined || g.hp > g.maxHp) g.hp = g.maxHp;
    
    normalizeInventory(g);
    
    updateMenu();
    updateStory();
    updateActions();
    setMessage('');
    
    isBusy = false;
    if (busyTimer) { clearTimeout(busyTimer); busyTimer = null; }
    document.getElementById('busy-status').classList.add('hide');
    
    updateOnline();
    saveData();
    startResourceSystem();
    startAutoSave();
}

// ============================================================
// ОБНОВЛЕНИЕ МЕНЮ
// ============================================================
function updateMenu() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    const time = getTimeOfDay();
    
    g.maxHp = getMaxHp(g);
    if (g.hp > g.maxHp) g.hp = g.maxHp;
    if (g.hp === undefined || g.hp <= 0) g.hp = g.maxHp;
    
    document.getElementById('menu-time').textContent = time.timeStr;
    document.getElementById('menu-period').textContent = time.emoji + ' ' + time.period;
    document.getElementById('menu-location').textContent = g.location.place + (g.outside ? ' 🌲' : ' 🏰');
    
    const locationLevel = LOCATION_LEVELS[g.location.place] || 1;
    document.getElementById('menu-location-level').textContent = ' (ур. ' + locationLevel + ')';
    
    document.getElementById('menu-hp').textContent = Math.round(g.hp);
    document.getElementById('menu-hp-max').textContent = Math.round(g.maxHp);
    document.getElementById('menu-level').textContent = g.level;
    document.getElementById('menu-gold').textContent = g.gold;
    document.getElementById('menu-silver').textContent = g.silver;
    document.getElementById('menu-copper').textContent = g.copper;
    document.getElementById('menu-food').textContent = Math.round(g.food);
    document.getElementById('menu-thirst').textContent = Math.round(g.thirst);
    document.getElementById('menu-fatigue').textContent = Math.round(g.fatigue);
}

// ============================================================
// ОБРАБОТКА ДЕЙСТВИЙ
// ============================================================
function gameAction(action) {
    setMessage('');
    
    if (isBusy && !['character', 'inventory', 'refresh', 'map', 'menu', 'enter_city', 'leave_city'].includes(action) && !action.startsWith('battle_')) {
        setMessage('⏳ Вы заняты. Завершите текущее действие.');
        return;
    }
    
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    
    switch(action) {
        // Карта
        case 'map': openMap(); break;
        
        // Вход/выход из города
        case 'leave_city':
            g.location.place = 'Дорога';
            g.location.location = 'Дорога';
            g.outside = true;
            setMessage('🛤️ Вы вышли на Королевский тракт.');
            updateMenu(); updateStory(); updateActions(); saveData();
            break;
        
        case 'enter_city':
            g.location.place = 'Ворота';
            g.location.location = 'Королевская Гавань';
            g.outside = false;
            setMessage('🚪 Вы вошли в Королевскую Гавань.');
            updateMenu(); updateStory(); updateActions(); saveData();
            break;
        
        // Таверна
        case 'eat':
            if (g.food >= 100) { setMessage('🍖 Вы сыты.'); return; }
            g.food = Math.min(g.food + 25, 100);
            setMessage('🍞 Вы поели. Еда +25.');
            updateMenu(); saveData();
            break;
        
        case 'wash':
            startBusy('Моете посуду', 1, function() {
                g.copper += 1;
                convertCurrency(g);
                setMessage('🧹 Вы помыли посуду. +1 МП.');
                updateMenu(); saveData();
            });
            break;
        
        case 'sweep':
            startBusy('Подметаете пол', 5, function() {
                g.copper += 5;
                convertCurrency(g);
                setMessage('🧹 Вы подмели пол. +5 МП.');
                updateMenu(); saveData();
            });
            break;
        
        case 'rest':
            if (!spendMoney(g, 10)) {
                setMessage('❌ Недостаточно денег (10 МП).');
                return;
            }
            g.fatigue = Math.min(100, g.fatigue + 30);
            g.hp = Math.min(g.maxHp, g.hp + 15);
            setMessage('🛏️ Вы отдохнули. Усталость +30, HP +15.');
            updateMenu(); saveData();
            break;
        
        case 'talk':
            const msgs = [
                '🍺 Трактирщик: «Добро пожаловать, путник!»',
                '🍺 Трактирщик: «Хочешь заработать? Помой посуду.»',
                '🍺 Трактирщик: «Будь осторожен за воротами.»'
            ];
            setMessage(msgs[Math.floor(Math.random() * msgs.length)]);
            break;
        
        // Заглушки (будут в game/ модулях)
        case 'trade': setMessage('🚧 Торговля в разработке.'); break;
        case 'guild': setMessage('🚧 Аукцион в разработке.'); break;
        case 'shop': setMessage('🚧 Магазин в разработке.'); break;
        case 'craft': setMessage('🚧 Крафт в разработке.'); break;
        case 'open_stable': setMessage('🚧 Конюшня в разработке.'); break;
        case 'open_temple': setMessage('🚧 Септа в разработке.'); break;
        case 'open_port': setMessage('🚧 Порт в разработке.'); break;
        case 'open_market': setMessage('🚧 Рынок в разработке.'); break;
        case 'open_magistrate': setMessage('🚧 Магистрат в разработке.'); break;
        case 'open_library': setMessage('🚧 Библиотека в разработке.'); break;
        case 'open_guildhall': setMessage('🚧 Гильдия наёмников в разработке.'); break;
        case 'open_brothel': setMessage('🚧 Бордель в разработке.'); break;
        case 'search': setMessage('🔍 Вы осматриваетесь... Пока тихо.'); break;
        case 'inventory': setMessage('🚧 Инвентарь в разработке.'); break;
        case 'character': setMessage('🚧 Персонаж в разработке.'); break;
        case 'menu': setMessage('🚧 Меню в разработке.'); break;
        case 'buy_housing': setMessage('🚧 Покупка жилья в разработке.'); break;
        case 'enter_home': setMessage('🚧 Дом в разработке.'); break;
        case 'rest_at_home': setMessage('🚧 Отдых дома в разработке.'); break;
        case 'storage': setMessage('🚧 Склад в разработке.'); break;
        case 'leave_home': setMessage('🚧 Выход из дома в разработке.'); break;
        case 'rest_brothel': setMessage('🚧 Отдых в борделе в разработке.'); break;
        case 'jail_pay': setMessage('🚧 Тюрьма в разработке.'); break;
        case 'jail_wait': setMessage('🚧 Тюрьма в разработке.'); break;
        case 'jail_escape': setMessage('🚧 Тюрьма в разработке.'); break;
        case 'refresh': location.reload(); break;
    }
}

// ============================================================
// ЗАНЯТОСТЬ
// ============================================================
function startBusy(actionName, minutes, callback) {
    if (isBusy) return;
    isBusy = true;
    document.getElementById('busy-status').classList.remove('hide');
    document.getElementById('busy-status').textContent = '⏳ ' + actionName + '... (' + minutes + ' мин)';
    updateActions();
    if (busyTimer) clearTimeout(busyTimer);
    busyTimer = setTimeout(function() {
        isBusy = false;
        document.getElementById('busy-status').classList.add('hide');
        busyTimer = null;
        if (callback) callback();
        updateActions();
    }, minutes * 60 * 1000);
}

// ============================================================
// ТАЙМЕРЫ
// ============================================================
function startAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(() => {
        if (currentUser && users[currentUser]) saveData();
    }, 30000);
}

function startResourceSystem() {
    if (resourceInterval) clearInterval(resourceInterval);
    resourceInterval = setInterval(() => {
        const user = users[currentUser];
        if (!user || !user.game.online) return;
        const g = user.game;
        const now = Date.now();
        const diff = (now - g.lastResourceUpdate) / 60000;
        if (diff < 1) return;
        
        const foodLoss = Math.floor(diff / 15);
        const thirstLoss = Math.floor(diff / 10);
        if (foodLoss > 0) g.food = Math.max(0, g.food - foodLoss);
        if (thirstLoss > 0) g.thirst = Math.max(0, g.thirst - thirstLoss);
        
        g.lastResourceUpdate = now;
        updateMenu();
        saveData();
    }, 30000);
}

// ============================================================
// ОНЛАЙН
// ============================================================
function updateOnline() {
    const online = { global: 0, region: 0, location: 0 };
    if (!currentUser || !users[currentUser]) return;
    const cur = users[currentUser];
    for (const name in users) {
        if (users[name].game.online) {
            online.global++;
            if (cur && users[name].game.location.region === cur.game.location.region) online.region++;
            if (cur && users[name].game.location.location === cur.game.location.location) online.location++;
        }
    }
    document.getElementById('online-global').textContent = online.global;
    document.getElementById('online-region').textContent = online.region;
    document.getElementById('online-location').textContent = online.location;
    setTimeout(updateOnline, 10000);
}

// ============================================================
// ВЫХОД
// ============================================================
function handleLogout() {
    if (isBusy) { setMessage('⏳ Вы заняты. Завершите текущее действие.'); return; }
    if (currentUser && users[currentUser]) {
        users[currentUser].game.online = false;
        users[currentUser].game.lastActive = Date.now();
        addLog('👤 ' + currentUser + ' вышел из игры');
        saveData();
    }
    localStorage.removeItem('got_user');
    currentUser = null;
    showPage('login');
    if (busyTimer) { clearTimeout(busyTimer); busyTimer = null; }
    isBusy = false;
    document.getElementById('busy-status').classList.add('hide');
    if (resourceInterval) { clearInterval(resourceInterval); resourceInterval = null; }
    if (autoSaveInterval) { clearInterval(autoSaveInterval); autoSaveInterval = null; }
}

// ============================================================
// ЗАПУСК
// ============================================================
loadData();
const savedUser = localStorage.getItem('got_user');
if (savedUser && users[savedUser]) {
    currentUser = savedUser;
    enterGame(savedUser);
} else {
    showPage('login');
}

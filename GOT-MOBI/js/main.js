// ============================================================
// MAIN.JS — ТОЧКА ВХОДА
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
    if (name.length < 2) { errEl.textContent = '❌ Имя слишком короткое'; errEl.classList.remove('hide'); return; }
    if (password.length < 4) { errEl.textContent = '❌ Пароль слишком короткий'; errEl.classList.remove('hide'); return; }
    if (!NATIONALITIES[nationality]) { errEl.textContent = '❌ Выберите национальность'; errEl.classList.remove('hide'); return; }
    if (users[name]) { errEl.textContent = '❌ Это имя уже занято'; errEl.classList.remove('hide'); return; }
    
    const now = Date.now();
    const skills = {};
    ['sword', 'spear', 'mace', 'axe', 'bow', 'crossbow', 'shield', 'dagger'].forEach(s => { skills[s] = { level: 1, xp: 0 }; });
    
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

function handleLogin() {
    const name = document.getElementById('login-name').value.trim();
    const password = document.getElementById('login-password').value;
    const errEl = document.getElementById('login-error');
    errEl.classList.add('hide');
    
    if (!name || !password) { errEl.textContent = '❌ Заполните все поля'; errEl.classList.remove('hide'); return; }
    
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

function fixOldAccount(user) {
    if (!user) return user;
    if (!user.game) {
        user.game = {
            gold: 100, silver: 0, copper: 0, food: 100, thirst: 100, fatigue: 100,
            hp: 60, maxHp: 60, level: 1, xp: 0, nextLevelXp: 100, attributePoints: 0,
            stats: { damage: 1, defense: 1, intelligence: 1, agility: 1 },
            equipment: { rightHand: null, leftHand: null, helmet: null, chestplate: null, shoulders: null, leggings: null, boots: null, gloves: null, belt: null, cloak: null, horse: null },
            skills: {}, stamina: { level: 1, xp: 0 },
            professions: { 'Шахтёр': 1, 'Лесоруб': 1, 'Охотник': 1, 'Кузнец': 1 },
            professionXp: { 'Шахтёр': 0, 'Лесоруб': 0, 'Охотник': 0, 'Кузнец': 0 },
            activeProfession: 'Охотник', lastProfessionChange: 0, inventory: [],
            location: { region: 'Королевские земли', location: 'Королевская Гавань', place: 'Таверна' },
            outside: false, death: null, lastReset: null, lastActive: Date.now(), online: true,
            lastResourceUpdate: Date.now(), luck: 0, lastHeal: null, lastPrayer: null,
            blessing: { active: false, expires: 0 }, jail: null,
            activeBonuses: { crit: 5, pierce: 5, doubleHit: 5, counter: 5, points: 0 },
            marketStall: { owned: false, stallId: null, rentPaid: null, rentDays: 0, debt: 0 },
            housing: { type: null, purchased: null, rentPaid: null, rentDays: 0, debt: 0, storage: [], storageHold: [] },
            booksBoughtToday: 0, lastBookReset: Date.now(),
            quests: { completed: [], lastReset: 0, active: null, progress: {} },
            brothelBuffs: [], brothelRoom: false
        };
        return user;
    }
    return user;
}

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
    g.lastActive = Date.now();
    g.lastResourceUpdate = Date.now();
    g.maxHp = getMaxHp(g);
    if (g.hp > g.maxHp) g.hp = g.maxHp;
    
    updateMenu();
    // updateStory и updateActions из kings_landing.js
    if (typeof updateStory === 'function') updateStory();
    if (typeof updateActions === 'function') updateActions();
    setMessage('');
    
    isBusy = false;
    if (busyTimer) { clearTimeout(busyTimer); busyTimer = null; }
    document.getElementById('busy-status').classList.add('hide');
    
    updateOnline();
    saveData();
    startResourceSystem();
    startAutoSave();
}

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
    document.getElementById('menu-location-level').textContent = ' (ур. ' + (LOCATION_LEVELS[g.location.place] || 1) + ')';
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

// updateStory и updateActions берутся из kings_landing.js

function gameAction(action) {
    setMessage('');
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    
    // Карта
    if (action === 'map') { if (typeof openMap === 'function') openMap(); else setMessage('🚧 Карта в разработке.'); return; }
    
    // Вход/выход из города
    if (action === 'leave_city') {
        g.location.place = 'Дорога'; g.location.location = 'Дорога'; g.outside = true;
        setMessage('🛤️ Вы вышли на Королевский тракт.');
        updateMenu(); if (typeof updateStory === 'function') updateStory(); if (typeof updateActions === 'function') updateActions(); saveData();
        return;
    }
    if (action === 'enter_city') {
        g.location.place = 'Ворота'; g.location.location = 'Королевская Гавань'; g.outside = false;
        setMessage('🚪 Вы вошли в Королевскую Гавань.');
        updateMenu(); if (typeof updateStory === 'function') updateStory(); if (typeof updateActions === 'function') updateActions(); saveData();
        return;
    }
    
    // Таверна
    if (action === 'eat') {
        if (g.food >= 100) { setMessage('🍖 Вы сыты.'); return; }
        g.food = Math.min(g.food + 25, 100);
        setMessage('🍞 Вы поели. Еда +25.');
        updateMenu(); saveData();
        return;
    }
    if (action === 'wash') {
        startBusy('Моете посуду', 1, function() { g.copper += 1; convertCurrency(g); setMessage('🧹 +1 МП.'); updateMenu(); saveData(); });
        return;
    }
    if (action === 'sweep') {
        startBusy('Подметаете пол', 5, function() { g.copper += 5; convertCurrency(g); setMessage('🧹 +5 МП.'); updateMenu(); saveData(); });
        return;
    }
    if (action === 'rest') {
        if (!spendMoney(g, 10)) { setMessage('❌ Недостаточно денег (10 МП).'); return; }
        g.fatigue = Math.min(100, g.fatigue + 30);
        g.hp = Math.min(g.maxHp, g.hp + 15);
        setMessage('🛏️ Вы отдохнули. Усталость +30, HP +15.');
        updateMenu(); saveData();
        return;
    }
    if (action === 'talk') {
        setMessage(['🍺 Трактирщик: «Добро пожаловать!»','🍺 Трактирщик: «Заработай — помой посуду.»','🍺 Трактирщик: «Будь осторожен за воротами.»'][Math.floor(Math.random()*3)]);
        return;
    }
    
    // Перемещение (из карты)
    if (action.startsWith('move_')) {
        const place = action.replace('move_', '');
        if (typeof moveToLocation === 'function') moveToLocation(place);
        else setMessage('🚧 Перемещение в разработке.');
        return;
    }
    
    if (action === 'refresh') { location.reload(); return; }
    
    setMessage('🚧 В разработке.');
}

function startBusy(actionName, minutes, callback) {
    if (isBusy) return;
    isBusy = true;
    document.getElementById('busy-status').classList.remove('hide');
    document.getElementById('busy-status').textContent = '⏳ ' + actionName + '... (' + minutes + ' мин)';
    if (typeof updateActions === 'function') updateActions();
    if (busyTimer) clearTimeout(busyTimer);
    busyTimer = setTimeout(function() {
        isBusy = false;
        document.getElementById('busy-status').classList.add('hide');
        busyTimer = null;
        if (callback) callback();
        if (typeof updateActions === 'function') updateActions();
    }, minutes * 60 * 1000);
}

function startAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(() => { if (currentUser && users[currentUser]) saveData(); }, 30000);
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
        g.food = Math.max(0, g.food - Math.floor(diff / 15));
        g.thirst = Math.max(0, g.thirst - Math.floor(diff / 10));
        g.lastResourceUpdate = now;
        updateMenu();
        saveData();
    }, 30000);
}

function updateOnline() {
    const online = { global: 0, region: 0, location: 0 };
    if (!currentUser || !users[currentUser]) return;
    const cur = users[currentUser];
    for (const name in users) {
        if (users[name].game.online) {
            online.global++;
            if (users[name].game.location.region === cur.game.location.region) online.region++;
            if (users[name].game.location.location === cur.game.location.location) online.location++;
        }
    }
    document.getElementById('online-global').textContent = online.global;
    document.getElementById('online-region').textContent = online.region;
    document.getElementById('online-location').textContent = online.location;
    setTimeout(updateOnline, 10000);
}

function handleLogout() {
    if (isBusy) { setMessage('⏳ Вы заняты.'); return; }
    if (currentUser && users[currentUser]) {
        users[currentUser].game.online = false;
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

// Заглушки для кнопок меню-бара
function openCharacter() { setMessage('🚧 Персонаж в разработке.'); }
function openInventory() { setMessage('🚧 Инвентарь в разработке.'); }
function openLog() { setMessage('🚧 Лог в разработке.'); }
function openMainMenu() { setMessage('🚧 Меню в разработке.'); }
function showOnlineList() { setMessage('🚧 Список онлайн в разработке.'); }
function closeMap() { document.getElementById('modal-map').classList.add('hide'); }
function closeHouses() { document.getElementById('modal-houses').classList.add('hide'); }
function closeOnline() { document.getElementById('modal-online').classList.add('hide'); }
function closeMenu() { document.getElementById('modal-menu').classList.add('hide'); }
function closeLog() { document.getElementById('modal-log').classList.add('hide'); }
function closeTrade() { document.getElementById('modal-trade').classList.add('hide'); }
function closeGuild() { document.getElementById('modal-guild').classList.add('hide'); }
function closeHouses() { document.getElementById('modal-houses').classList.add('hide'); }

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

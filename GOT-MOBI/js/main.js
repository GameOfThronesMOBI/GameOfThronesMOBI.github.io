// ============================================================
// MAIN.JS — ФИНАЛ (ГЛОБАЛЬНАЯ СЕТКА)
// ============================================================

function handleRegister() {
    var name = document.getElementById('reg-name').value.trim();
    var password = document.getElementById('reg-password').value;
    var nationality = document.getElementById('reg-nationality').value;
    var secret = document.getElementById('reg-secret').value.trim();
    var gender = document.getElementById('reg-gender').value;
    var errEl = document.getElementById('register-error');
    var okEl = document.getElementById('register-success');
    var formEl = document.getElementById('register-form');
    
    errEl.classList.add('hide');
    okEl.classList.add('hide');
    formEl.classList.remove('hide');
    
    if (!name || !password || !nationality || !secret || !gender) {
        errEl.textContent = '❌ Заполните все поля';
        errEl.classList.remove('hide');
        return;
    }
    if (name.length < 2) { errEl.textContent = '❌ Имя слишком короткое'; errEl.classList.remove('hide'); return; }
    if (password.length < 4) { errEl.textContent = '❌ Пароль слишком короткий'; errEl.classList.remove('hide'); return; }
    if (!NATIONALITIES[nationality]) { errEl.textContent = '❌ Выберите национальность'; errEl.classList.remove('hide'); return; }
    if (users[name]) { errEl.textContent = '❌ Это имя уже занято'; errEl.classList.remove('hide'); return; }
    
    var now = Date.now();
    var skills = {};
    ['sword', 'spear', 'mace', 'axe', 'bow', 'crossbow', 'shield', 'dagger'].forEach(function(s) { skills[s] = { level: 1, xp: 0 }; });
    
    users[name] = {
        password: password,
        passwordHash: hash(password),
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
            location: { region: 'Королевские земли', location: 'Королевская Гавань', place: 'Таверна', locationId: null, parentZone: null },
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
            brothelRoom: false,
            lastTavernEat: 0,
            house: null,
            isLord: false,
            gender: gender
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
    var name = document.getElementById('login-name').value.trim();
    var password = document.getElementById('login-password').value;
    var errEl = document.getElementById('login-error');
    errEl.classList.add('hide');
    
    if (loginBlockedUntil[name] && Date.now() < loginBlockedUntil[name]) {
        var minutesLeft = Math.ceil((loginBlockedUntil[name] - Date.now()) / 60000);
        errEl.textContent = '⏳ Слишком много попыток. Попробуйте через ' + minutesLeft + ' мин.';
        errEl.classList.remove('hide');
        return;
    }
    
    if (!name || !password) { errEl.textContent = '❌ Заполните все поля'; errEl.classList.remove('hide'); return; }
    
    var user = users[name];
    if (!user || user.password !== password) {
        loginAttempts[name] = (loginAttempts[name] || 0) + 1;
        if (loginAttempts[name] >= 3) {
            loginBlockedUntil[name] = Date.now() + 5 * 60 * 1000;
            loginAttempts[name] = 0;
            saveLoginData();
            errEl.textContent = '⏳ 3 неверные попытки. Вход заблокирован на 5 минут.';
        } else {
            errEl.textContent = '❌ Неверное имя или пароль. Осталось попыток: ' + (3 - loginAttempts[name]);
        }
        errEl.classList.remove('hide');
        saveLoginData();
        return;
    }
    
    loginAttempts[name] = 0;
    saveLoginData();
    localStorage.setItem('got_user', name);
    currentUser = name;
    addLog('👤 ' + name + ' вошёл в игру');
    enterGame(name);
}

function forgotPassword() {
    var loginName = prompt('Введите логин для восстановления:');
    if (!loginName) return;
    if (!users[loginName]) { setMessage('❌ Персонаж не найден.'); return; }
    
    var secret = prompt('Введите секретное слово:');
    if (!secret) return;
    if (users[loginName].secret !== hash(secret)) { setMessage('❌ Неверное секретное слово.'); return; }
    
    alert('Ваш пароль: ' + users[loginName].password);
    setMessage('🔑 Пароль показан в окне.');
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
            location: { region: 'Королевские земли', location: 'Королевская Гавань', place: 'Таверна', locationId: null, parentZone: null },
            outside: false, death: null, lastReset: null, lastActive: Date.now(), online: true,
            lastResourceUpdate: Date.now(), luck: 0, lastHeal: null, lastPrayer: null,
            blessing: { active: false, expires: 0 }, jail: null,
            activeBonuses: { crit: 5, pierce: 5, doubleHit: 5, counter: 5, points: 0 },
            marketStall: { owned: false, stallId: null, rentPaid: null, rentDays: 0, debt: 0 },
            housing: { type: null, purchased: null, rentPaid: null, rentDays: 0, debt: 0, storage: [], storageHold: [] },
            booksBoughtToday: 0, lastBookReset: Date.now(),
            quests: { completed: [], lastReset: 0, active: null, progress: {} },
            brothelBuffs: [], brothelRoom: false,
            lastTavernEat: 0,
            house: null,
            isLord: false,
            gender: null
        };
        return user;
    }
    var g = user.game;
    if (g.lastTavernEat === undefined) g.lastTavernEat = 0;
    if (g.house === undefined) g.house = null;
    if (g.isLord === undefined) g.isLord = false;
    if (g.gender === undefined) g.gender = null;
    if (g.location.locationId === undefined) g.location.locationId = null;
    if (g.location.parentZone === undefined) g.location.parentZone = null;
    return user;
}

function getMaxHp(g) {
    var staminaLevel = g.stamina ? g.stamina.level : 1;
    var bonusHp = 0;
    if (g.housing && g.housing.type && HOUSING_TYPES[g.housing.type]) {
        bonusHp = HOUSING_TYPES[g.housing.type].restHp || 0;
    }
    return 60 + (g.level - 1) * 10 + staminaLevel * 2 + bonusHp;
}

function enterGame(name) {
    var user = users[name];
    if (!user) return;
    fixOldAccount(user);
    var g = user.game;
    if (!g) return;
    
    showPage('game');
    g.online = true;
    g.lastActive = Date.now();
    g.lastResourceUpdate = Date.now();
    g.maxHp = getMaxHp(g);
    if (g.hp > g.maxHp) g.hp = g.maxHp;
    if (!g.location.locationId) g.location.locationId = g.location.place;
    
    if (typeof normalizeInventory === 'function') normalizeInventory(g);
    
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

function updateMenu() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    var time = getTimeOfDay();
    
    g.maxHp = getMaxHp(g);
    if (g.hp > g.maxHp) g.hp = g.maxHp;
    if (g.hp === undefined || g.hp <= 0) g.hp = g.maxHp;
    
    document.getElementById('menu-time').textContent = time.timeStr;
    document.getElementById('menu-period').textContent = time.emoji + ' ' + time.period;
    
    var locName = g.location.place;
    if (typeof WORLD_AREAS !== 'undefined' && WORLD_AREAS[g.location.place]) {
        locName = WORLD_AREAS[g.location.place].name;
    }
    document.getElementById('menu-location').textContent = locName + (g.outside ? ' 🌲' : ' 🏰');
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

function gameAction(action) {
    setMessage('');
    
    if (isBusy && action !== 'refresh' && action !== 'map' && action !== 'compass' && action !== 'search' && action !== 'inventory' && action !== 'character' && action !== 'menu') {
        setMessage('⏳ Вы заняты. Завершите текущее действие.');
        return;
    }
    
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    
    // КАРТА
    if (action === 'map') {
        var place = g.location.place;
        var cityPlaces = ['kings_landing', 'Таверна', 'Рынок', 'Кузница', 'Кожевник', 'Плотник', 
                          'Конюшня', 'Гильдия торговцев', 'Магистрат', 'Ворота', 'Ворота Красного замка',
                          'Королевский квартал', 'Торговый квартал', 'Квартал бедноты', 'Дом',
                          'Великая септа', 'Порт', 'Тюрьма', 'Библиотека мейстеров', 'Гильдия наёмников', 'Бордель'];
        
        if (cityPlaces.indexOf(place) !== -1) {
            if (typeof window.openMap === 'function') {
                window.openMap();
            } else {
                setMessage('❌ Карта города не загружена.');
            }
        } else if (typeof WORLD_AREAS !== 'undefined' && WORLD_AREAS[place]) {
            if (typeof window.openCompass === 'function') {
                window.openCompass();
            } else {
                setMessage('❌ Компас не загружен.');
            }
        } else {
            if (typeof window.openPlaces === 'function') {
                window.openPlaces();
            } else {
                setMessage('❌ Карта мест не загружена.');
            }
        }
        return;
    }
    
    // КОМПАС
    if (action === 'compass') {
        if (typeof openCompass === 'function') { openCompass(); return; }
        setMessage('❌ Компас не загружен.');
        return;
    }
    
    // ВХОД/ВЫХОД ИЗ ГОРОДА
    if (action === 'leave_city') {
        g.location.place = 'kl_0_0';
        g.location.locationId = 'kl_0_0';
        g.location.parentZone = null;
        g.location.location = 'Королевская Гавань';
        g.outside = true;
        setMessage('🚪 Вы вышли из города на перекрёсток.');
        updateMenu(); updateStory(); updateActions(); saveData();
        return;
    }
    if (action === 'enter_city') {
        g.location.place = 'Ворота'; g.location.location = 'Королевская Гавань'; g.outside = false;
        g.location.parentZone = null;
        setMessage('🚪 Вы вошли в Королевскую Гавань.');
        updateMenu(); updateStory(); updateActions(); saveData();
        return;
    }
    
    // ВХОД В ЗАМОК
    if (action === 'enter_castle') {
        g.location.place = 'castle_gate';
        g.location.location = 'Красный замок';
        g.location.parentZone = null;
        setMessage('🏰 Вы вошли в Красный замок.');
        updateMenu(); updateStory(); updateActions(); saveData();
        return;
    }
    
    // ТАВЕРНА — ЕДА (КУЛДАУН 2 ЧАСА)
    if (action === 'tavern_eat') {
        var now = Date.now();
        var cooldown = 2 * 60 * 60 * 1000;
        if (g.lastTavernEat && (now - g.lastTavernEat) < cooldown) {
            var timeLeft = Math.ceil((cooldown - (now - g.lastTavernEat)) / (60 * 1000));
            setMessage('⏳ Трактирщик сказал: «Приходи через ' + timeLeft + ' мин.»');
            return;
        }
        if (g.food >= 100) { setMessage('🍖 Вы сыты.'); return; }
        g.food = Math.min(g.food + 25, 100);
        g.lastTavernEat = now;
        setMessage('🍞 Вы поели. Еда +25. Следующий раз через 2 часа.');
        updateMenu(); saveData();
        return;
    }
    
    if (action === 'tavern_buy') { if (typeof openTavernTrade === 'function') { openTavernTrade(); return; } return; }
    if (action === 'wash') { startBusy('Моете посуду', 1, function() { g.copper += 1; convertCurrency(g); setMessage('🧹 +1 МП.'); updateMenu(); saveData(); }); return; }
    if (action === 'sweep') { startBusy('Подметаете пол', 5, function() { g.copper += 5; convertCurrency(g); setMessage('🧹 +5 МП.'); updateMenu(); saveData(); }); return; }
    if (action === 'sweep_streets') { startBusy('Убираете улицы', 8, function() { g.copper += 10; convertCurrency(g); setMessage('🧹 +10 МП.'); updateMenu(); saveData(); }); return; }
    if (action === 'rest') {
        if (!spendMoney(g, 10)) { setMessage('❌ Недостаточно денег (10 МП).'); return; }
        g.fatigue = Math.min(100, g.fatigue + 30);
        g.hp = Math.min(g.maxHp, g.hp + 15);
        setMessage('🛏️ Вы отдохнули. Усталость +30, HP +15.');
        updateMenu(); saveData();
        return;
    }
    if (action === 'talk') {
        var msgs = ['🍺 Трактирщик: «Добро пожаловать!»', '🍺 Трактирщик: «Заработай — помой посуду.»', '🍺 Трактирщик: «Будь осторожен за воротами.»'];
        setMessage(msgs[Math.floor(Math.random() * 3)]);
        return;
    }
    
    // МАГАЗИНЫ
    if (action === 'shop_weapons') { if (typeof openShop === 'function') { openShop('Оружейная лавка'); return; } return; }
    if (action === 'shop_leather') { if (typeof openShop === 'function') { openShop('Кожевник'); return; } return; }
    if (action === 'shop_plate') { if (typeof openShop === 'function') { openShop('Бронник'); return; } return; }
    if (action === 'shop_bows') { if (typeof openShop === 'function') { openShop('Плотник'); return; } return; }
    if (action === 'shop_resources') { if (typeof openShop === 'function') { openShop('Кузница'); return; } return; }
    if (action === 'shop_trade') { if (typeof openShop === 'function') { openShop('Торговля'); return; } return; }
    if (action === 'craft') { if (typeof openCraftMenu === 'function') { openCraftMenu(); return; } return; }
    if (action === 'craft_leather') { if (typeof openCraftLeatherMenu === 'function') { openCraftLeatherMenu(); return; } return; }
    if (action === 'craft_wood') { if (typeof openCraftWoodMenu === 'function') { openCraftWoodMenu(); return; } return; }
    
    // КОНЮШНЯ
    if (action === 'stable_open' || action === 'stable_buy' || action === 'stable_sell') {
        if (typeof openStable === 'function') { openStable(); return; }
        return;
    }
    
    // СЕПТА
    if (action === 'temple_open' || action === 'temple_heal' || action === 'temple_bless' || action === 'temple_luck') {
        if (typeof openTemple === 'function') { openTemple(); return; }
        return;
    }
    
    // РЫНОК
    if (action === 'market_stalls') { if (typeof openMarket === 'function') { openMarket(); return; } return; }
    
    // АУКЦИОН
    if (action === 'auction_list' || action === 'auction_my' || action === 'auction_sell') {
        if (typeof openGuild === 'function') { openGuild(); return; }
        return;
    }
    
    // МАГИСТРАТ
    if (action === 'magistrate_open' || action === 'magistrate_housing' || action === 'magistrate_stall_buy' || action === 'magistrate_stall_pay' || action === 'magistrate_rent_pay' || action === 'magistrate_confiscated') {
        if (typeof openMagistrate === 'function') { openMagistrate(); return; }
        return;
    }
    
    // ЖИЛЬЁ
    if (action === 'housing_view') { if (typeof viewDistrict === 'function') { viewDistrict(g.location.place); return; } return; }
    if (action === 'housing_enter') { if (typeof enterHome === 'function') { enterHome(); return; } return; }
    
    // ДОМ
    if (action === 'home_rest') { if (typeof restAtHome === 'function') { restAtHome(); return; } return; }
    if (action === 'home_storage') { if (typeof openStorage === 'function') { openStorage(); return; } return; }
    if (action === 'home_leave') {
        if (g.housing && g.housing.type) {
            g.location.place = HOUSING_TYPES[g.housing.type].district;
            g.location.location = 'Королевская Гавань';
        } else {
            g.location.place = 'Таверна';
            g.location.location = 'Королевская Гавань';
        }
        g.location.parentZone = null;
        updateMenu(); updateStory(); updateActions(); saveData();
        return;
    }
    
    // БИБЛИОТЕКА
    if (action === 'library_open' || action === 'library_buy' || action === 'library_read') {
        if (typeof openLibrary === 'function') { openLibrary(); return; }
        return;
    }
    
    // ГИЛЬДИЯ НАЁМНИКОВ
    if (action === 'guildhall_open' || action === 'quest_take' || action === 'quest_abandon' || action === 'quest_progress') {
        if (typeof openGuildHall === 'function') { openGuildHall(); return; }
        return;
    }
    
    // БОРДЕЛЬ
    if (action === 'brothel_rest' || action === 'brothel_dice') {
        if (typeof openBrothel === 'function') { openBrothel(); return; }
        return;
    }
    
    // ТЮРЬМА
    if (action === 'jail_pay') { if (typeof payJailFine === 'function') { payJailFine(); return; } return; }
    if (action === 'jail_wait') { if (typeof waitJailTime === 'function') { waitJailTime(); return; } return; }
    if (action === 'jail_escape') { if (typeof attemptEscape === 'function') { attemptEscape(); return; } return; }
    
    // ПОРТ
    if (action === 'port_travel') { if (typeof openPort === 'function') { openPort(); return; } return; }
    
    // ДОБЫЧА
    if (action === 'mine') { if (typeof gatherResource === 'function') { gatherResource('Шахтёр', 'mountain'); } return; }
    if (action === 'woodcut') { if (typeof gatherResource === 'function') { gatherResource('Лесоруб', 'forest'); } return; }
    
    // ПОИСК
    if (action === 'search') {
        var region = g.location.region || 'Королевские земли';
        var place = g.location.place || 'Дорога';
        var luck = Math.min(25, g.luck || 0);
        var luckBonus = Math.floor(luck / 10);
        
        var treasureChance = Math.min(4.5, 2 + luckBonus);
        if (Math.random() * 100 < treasureChance) {
            if (typeof findTreasure === 'function') { findTreasure(); return; }
            var goldAmount = 2 + Math.floor(Math.random() * 8) + luckBonus;
            g.copper += goldAmount;
            convertCurrency(g);
            setMessage('🪙 Вы нашли клад! +' + goldAmount + ' золота!');
            updateMenu(); saveData();
            return;
        }
        
        var monsterChance = Math.min(47.5, 45 + luckBonus);
        if (Math.random() * 100 < monsterChance) {
            var mob = null;
            if (typeof getMobsForLocation === 'function') {
                var mobs = getMobsForLocation(region, place);
                if (mobs.length > 0) mob = mobs[Math.floor(Math.random() * mobs.length)];
            }
            if (mob) {
                setMessage('⚔️ Вы встретили ' + mob.name + ' (уровень ' + mob.level + ')');
                if (typeof startBattle === 'function') { startBattle(mob); return; }
                return;
            }
        }
        
        setMessage('🔍 Вы никого не нашли.');
        return;
    }
    
    // ИНВЕНТАРЬ
    if (action === 'inventory') { if (typeof openInventory === 'function') { openInventory(); return; } return; }
    
    // ПЕРСОНАЖ
    if (action === 'character') { if (typeof openCharacter === 'function') { openCharacter(); return; } return; }
    
    // МЕНЮ
    if (action === 'menu') { if (typeof openMainMenu === 'function') { openMainMenu(); return; } return; }
    
    // ОБНОВЛЕНИЕ
    if (action === 'refresh') { location.reload(); return; }
    
    setMessage('❌ Неизвестное действие: ' + action);
}

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

function startAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(function() { if (currentUser && users[currentUser]) saveData(); }, 30000);
}

function startResourceSystem() {
    if (resourceInterval) clearInterval(resourceInterval);
    resourceInterval = setInterval(function() {
        var user = users[currentUser];
        if (!user || !user.game.online) return;
        var g = user.game;
        var now = Date.now();
        var diff = (now - g.lastResourceUpdate) / 60000;
        if (diff < 1) return;
        g.food = Math.max(0, g.food - Math.floor(diff / 15));
        g.thirst = Math.max(0, g.thirst - Math.floor(diff / 10));
        g.lastResourceUpdate = now;
        updateMenu();
        saveData();
    }, 30000);
}

function updateOnline() {
    var online = { global: 0, region: 0, location: 0 };
    if (!currentUser || !users[currentUser]) return;
    var cur = users[currentUser];
    for (var name in users) {
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

// ============================================================
// ЗАПУСК
// ============================================================
loadData();
var savedUser = localStorage.getItem('got_user');
if (savedUser && users[savedUser]) {
    currentUser = savedUser;
    enterGame(savedUser);
} else {
    showPage('login');
}

// ============================================================
// РЕГИСТРАЦИЯ / ВХОД
// ============================================================
function handleRegister() {
    const name = document.getElementById('reg-name').value.trim();
    const password = document.getElementById('reg-password').value;
    const nationality = document.getElementById('reg-nationality').value;
    const secret = document.getElementById('reg-secret').value.trim();
    const errEl = document.getElementById('register-error');
    const okEl = document.getElementById('register-success');
    const formEl = document.getElementById('register-form');
    errEl.classList.add('hide'); okEl.classList.add('hide'); formEl.classList.remove('hide');
    if(!name||!password||!nationality||!secret) {
        errEl.textContent='❌ Заполните все поля'; errEl.classList.remove('hide'); return;
    }
    if(name.length<2){ errEl.textContent='❌ Имя слишком короткое'; errEl.classList.remove('hide'); return; }
    if(password.length<4){ errEl.textContent='❌ Пароль слишком короткий'; errEl.classList.remove('hide'); return; }
    if(!NATIONALITIES[nationality]){ errEl.textContent='❌ Выберите национальность'; errEl.classList.remove('hide'); return; }
    if(users[name]){ errEl.textContent='❌ Это имя уже занято'; errEl.classList.remove('hide'); return; }
    
    const now = Date.now();
    const skills = {};
    ['sword','spear','mace','axe','bow','crossbow','shield','dagger'].forEach(s => { skills[s]={level:1,xp:0}; });
    
    users[name] = {
        password: hash(password),
        nationality: nationality,
        secret: hash(secret),
        created: now,
        game: {
            gold:100, silver:0, copper:0,
            food:100, thirst:100, fatigue:100,
            hp:60, maxHp:60,
            level:1, xp:0, nextLevelXp:100,
            attributePoints:0,
            stats: { damage:1, defense:1, intelligence:1, agility:1 },
            equipment: { rightHand:null, leftHand:null, helmet:null, chestplate:null, shoulders:null, leggings:null, boots:null, gloves:null, belt:null, cloak:null, horse:null },
            skills: skills,
            stamina: { level:1, xp:0 },
            professions: { 'Шахтёр':1, 'Лесоруб':1, 'Охотник':1, 'Кузнец':1 },
            professionXp: { 'Шахтёр':0, 'Лесоруб':0, 'Охотник':0, 'Кузнец':0 },
            activeProfession: 'Охотник',
            lastProfessionChange: 0,
            inventory: [],
            location: { region:'Королевские земли', location:'Королевская Гавань', place:'Таверна' },
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
    addLog('👤 '+name+' создал персонажа ('+nationality+')');
    saveData();
    formEl.classList.add('hide');
    okEl.innerHTML='✅ Поздравляем, <strong>'+name+'</strong>!<br>Вы — '+nationality;
    okEl.classList.remove('hide');
    currentUser = name;
    localStorage.setItem('got_user', name);
    setTimeout(function(){ enterGame(name); }, 1200);
}

function handleLogin() {
    const name = document.getElementById('login-name').value.trim();
    const password = document.getElementById('login-password').value;
    const errEl = document.getElementById('login-error');
    errEl.classList.add('hide');
    if(!name||!password){ errEl.textContent='❌ Заполните все поля'; errEl.classList.remove('hide'); return; }
    const user = users[name];
    if(!user || user.password !== hash(password)) {
        errEl.textContent='❌ Неверное имя или пароль';
        errEl.classList.remove('hide');
        return;
    }
    localStorage.setItem('got_user', name);
    currentUser = name;
    addLog('👤 '+name+' вошёл в игру');
    enterGame(name);
}

// ============================================================
// ВХОД В ИГРУ
// ============================================================
function fixOldAccount(user) {
    if (!user) return user;
    if (!user.game) {
        user.game = {
            gold:100, silver:0, copper:0, food:100, thirst:100, fatigue:100, hp:60, maxHp:60,
            level:1, xp:0, nextLevelXp:100, attributePoints:0,
            stats: { damage:1, defense:1, intelligence:1, agility:1 },
            equipment: { rightHand:null, leftHand:null, helmet:null, chestplate:null, shoulders:null, leggings:null, boots:null, gloves:null, belt:null, cloak:null, horse:null },
            skills: {}, stamina: { level:1, xp:0 },
            professions: { 'Шахтёр':1, 'Лесоруб':1, 'Охотник':1, 'Кузнец':1 },
            professionXp: { 'Шахтёр':0, 'Лесоруб':0, 'Охотник':0, 'Кузнец':0 },
            activeProfession: 'Охотник', lastProfessionChange: 0, inventory: [],
            location: { region:'Королевские земли', location:'Королевская Гавань', place:'Таверна' },
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
    const g = user.game;
    if (g.lastResourceUpdate === undefined) g.lastResourceUpdate = Date.now();
    if (g.stamina === undefined) g.stamina = { level:1, xp:0 };
    if (g.professions === undefined) { g.professions = { 'Шахтёр':1, 'Лесоруб':1, 'Охотник':1, 'Кузнец':1 }; g.professionXp = { 'Шахтёр':0, 'Лесоруб':0, 'Охотник':0, 'Кузнец':0 }; }
    if (g.activeProfession === undefined) g.activeProfession = 'Охотник';
    if (g.lastProfessionChange === undefined) g.lastProfessionChange = 0;
    if (g.skills === undefined) { g.skills = {}; ['sword','spear','mace','axe','bow','crossbow','shield','dagger'].forEach(s => { g.skills[s]={level:1,xp:0}; }); }
    if (g.equipment === undefined) { g.equipment = { rightHand:null, leftHand:null, helmet:null, chestplate:null, shoulders:null, leggings:null, boots:null, gloves:null, belt:null, cloak:null, horse:null }; }
    if (g.hp === undefined) g.hp = 60;
    if (g.maxHp === undefined) g.maxHp = 60;
    if (g.outside === undefined) g.outside = false;
    if (g.stats === undefined) g.stats = { damage:1, defense:1, intelligence:1, agility:1 };
    if (g.attributePoints === undefined) g.attributePoints = 0;
    if (g.lastReset === undefined) g.lastReset = null;
    if (g.luck === undefined) g.luck = 0;
    if (g.lastHeal === undefined) g.lastHeal = null;
    if (g.lastPrayer === undefined) g.lastPrayer = null;
    if (g.blessing === undefined) g.blessing = { active: false, expires: 0 };
    if (g.jail === undefined) g.jail = null;
    if (g.activeBonuses === undefined) { g.activeBonuses = { crit: 5, pierce: 5, doubleHit: 5, counter: 5, points: 0 }; }
    if (g.marketStall === undefined) { g.marketStall = { owned: false, stallId: null, rentPaid: null, rentDays: 0, debt: 0 }; }
    if (g.housing === undefined) { g.housing = { type: null, purchased: null, rentPaid: null, rentDays: 0, debt: 0, storage: [], storageHold: [] }; }
    if (g.housing.storage === undefined) g.housing.storage = [];
    if (g.housing.storageHold === undefined) g.housing.storageHold = [];
    if (g.online === undefined) g.online = true;
    if (g.lastActive === undefined) g.lastActive = Date.now();
    if (g.booksBoughtToday === undefined) g.booksBoughtToday = 0;
    if (g.lastBookReset === undefined) g.lastBookReset = Date.now();
    if (g.quests === undefined) { g.quests = { completed: [], lastReset: 0, active: null, progress: {} }; }
    if (g.brothelBuffs === undefined) g.brothelBuffs = [];
    if (g.brothelRoom === undefined) g.brothelRoom = false;
    return user;
}

function enterGame(name) {
    const user = users[name];
    if(!user) return;
    fixOldAccount(user);
    checkRent();
    checkStallRent();
    getActiveDiceGames();
    showPage('game');
    user.game.online = true;
    const now = Date.now();
    const g = user.game;
    const lastActive = g.lastActive || now;
    const diffMinutes = lastActive ? (now - lastActive) / 60000 : 0;
    if(diffMinutes > 1) {
        const foodLoss = Math.floor(diffMinutes / 15);
        const thirstLoss = Math.floor(diffMinutes / 10);
        g.food = Math.max(0, g.food - foodLoss);
        g.thirst = Math.max(0, g.thirst - thirstLoss);
        if(foodLoss>0||thirstLoss>0) setMessage('⏰ За время отсутствия: еда -'+foodLoss+', жажда -'+thirstLoss);
    }
    g.lastActive = now;
    g.lastResourceUpdate = now;
    g.maxHp = getMaxHp(g);
    if (g.hp === undefined || g.hp > g.maxHp) g.hp = g.maxHp;
    const savedBattle = localStorage.getItem('got_battle');
    if (savedBattle) {
        try {
            battleState = JSON.parse(savedBattle);
            if (battleState && battleState.inProgress) {
                if (battleState.turn === 'mob') {
                    const timeSince = Date.now() - (battleState.lastActionTime || now);
                    if (timeSince > 10000) { mobTurn(); saveBattleState(); }
                }
                setMessage('⚔️ Бой продолжается!');
                updateMenu(); updateStory(); updateActions(); renderBattle();
                return;
            }
        } catch(e) { localStorage.removeItem('got_battle'); battleState = null; }
    }
    normalizeInventory(g);
    updateMenu(); updateStory(); updateActions(); setMessage('');
    isBusy = false;
    if(busyTimer){ clearTimeout(busyTimer); busyTimer=null; }
    document.getElementById('busy-status').classList.add('hide');
    updateOnline(); saveData(); startResourceSystem(); startAutoSave();
}

function startAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(() => { if (currentUser && users[currentUser]) saveData(); }, 30000);
}

function startResourceSystem() {
    if (resourceInterval) clearInterval(resourceInterval);
    resourceInterval = setInterval(() => {
        const user = users[currentUser];
        if(!user || !user.game.online) return;
        const g = user.game;
        const now = Date.now();
        const diff = (now - g.lastResourceUpdate) / 60000;
        if (diff < 1) return;
        const foodLoss = Math.floor(diff / 15);
        const thirstLoss = Math.floor(diff / 10);
        if (foodLoss > 0) g.food = Math.max(0, g.food - foodLoss);
        if (thirstLoss > 0) g.thirst = Math.max(0, g.thirst - thirstLoss);
        if (!isBusy) { const fatigueLoss = Math.floor(diff / 30); if (fatigueLoss > 0) g.fatigue = Math.max(0, g.fatigue - fatigueLoss); }
        if (g.food <= 0) { const hpLoss = Math.floor(diff * 2); if (hpLoss > 0) { g.hp = Math.max(0, g.hp - hpLoss); setMessage('⚠️ Вы умираете от голода! HP -'+hpLoss); if (g.hp <= 0) handleDeath('голода'); } }
        if (g.thirst <= 0) { const hpLoss = Math.floor(diff * 3); if (hpLoss > 0) { g.hp = Math.max(0, g.hp - hpLoss); setMessage('⚠️ Вы умираете от жажды! HP -'+hpLoss); if (g.hp <= 0) handleDeath('жажды'); } }
        g.lastResourceUpdate = now;
        updateMenu(); saveData();
    }, 30000);
}

function handleDeath(cause) {
    const user = users[currentUser]; if(!user) return;
    const g = user.game;
    g.hp = g.maxHp; g.location.place = 'Таверна'; g.location.location = 'Королевская Гавань';
    g.food = 100; g.thirst = 100; g.fatigue = 100; g.outside = false;
    setMessage('💀 Вы умерли от ' + cause + '. Вы возродились в таверне.');
    addLog('💀 '+currentUser+' умер от '+cause);
    updateMenu(); updateStory(); updateActions(); saveData();
}

function handleLogout() {
    if (isBusy) { setMessage('⏳ Вы заняты.'); return; }
    if (currentUser && users[currentUser]) {
        users[currentUser].game.online = false;
        users[currentUser].game.lastActive = Date.now();
        addLog('👤 ' + currentUser + ' вышел');
        saveData();
    }
    localStorage.removeItem('got_user');
    currentUser = null;
    showPage('login');
    document.getElementById('login-name').value = '';
    document.getElementById('login-password').value = '';
    if (busyTimer) { clearTimeout(busyTimer); busyTimer = null; }
    isBusy = false;
    document.getElementById('busy-status').classList.add('hide');
    if (resourceInterval) { clearInterval(resourceInterval); resourceInterval = null; }
    if (autoSaveInterval) { clearInterval(autoSaveInterval); autoSaveInterval = null; }
}

function startBusy(actionName, minutes, callback) {
    if(isBusy) return;
    isBusy=true;
    document.getElementById('busy-status').classList.remove('hide');
    document.getElementById('busy-status').textContent='⏳ '+actionName+'... ('+minutes+' мин)';
    updateActions();
    if(busyTimer) clearTimeout(busyTimer);
    busyTimer=setTimeout(function(){
        isBusy=false;
        document.getElementById('busy-status').classList.add('hide');
        busyTimer=null;
        if(callback) callback();
        updateActions();
    }, minutes*60*1000);
}

// ============================================================
// ИНТЕРФЕЙС
// ============================================================
function updateMenu() {
    const user=users[currentUser]; if(!user) return;
    const g=user.game;
    const time=getTimeOfDay();
    g.maxHp=getMaxHp(g);
    if(g.hp>g.maxHp) g.hp=g.maxHp;
    document.getElementById('menu-time').textContent=time.timeStr;
    document.getElementById('menu-period').textContent=time.emoji+' '+time.period;
    document.getElementById('menu-location').textContent=g.location.place+(g.outside?' 🌲':' 🏰');
    document.getElementById('menu-location-level').textContent=' (ур. '+(LOCATION_LEVELS[g.location.place]||1)+')';
    document.getElementById('menu-hp').textContent=Math.round(g.hp);
    document.getElementById('menu-hp-max').textContent=Math.round(g.maxHp);
    document.getElementById('menu-level').textContent=g.level;
    document.getElementById('menu-gold').textContent=g.gold;
    document.getElementById('menu-silver').textContent=g.silver;
    document.getElementById('menu-copper').textContent=g.copper;
    document.getElementById('menu-food').textContent=Math.round(g.food);
    document.getElementById('menu-thirst').textContent=Math.round(g.thirst);
    document.getElementById('menu-fatigue').textContent=Math.round(g.fatigue);
}

function updateStory() {
    const user = users[currentUser]; if (!user) return;
    const place = user.game.location.place;
    document.getElementById('story-title').textContent = '📍 ' + place + ' (ур.' + (LOCATION_LEVELS[place] || 1) + ')';
    const texts = {
        'Таверна': 'Добро пожаловать в таверну. Здесь можно поесть, поработать и поговорить с трактирщиком.',
        'Рынок': '🏪 Центральный рынок Королевской Гавани. Здесь можно торговать с другими игроками.',
        'Кузница': 'Вы в кузнице. Здесь можно купить ресурсы и скрафтить предметы.',
        'Оружейная лавка': 'Вы в оружейной лавке. Здесь можно купить и продать оружие.',
        'Кожевник': 'Вы у кожевника. Здесь можно купить и продать кожаную броню.',
        'Бронник': 'Вы у бронника. Здесь можно купить и продать латную броню.',
        'Плотник': 'Вы у плотника. Здесь можно купить и продать луки и арбалеты.',
        'Конюшня': '🐴 Королевская конюшня. Здесь можно купить лошадь, продать или просто полюбоваться на скакунов.',
        'Гильдия торговцев': 'Вы в гильдии торговцев. Здесь можно торговать на аукционе.',
        'Магистрат': '📜 Магистрат — центр управления городом. Здесь можно купить жильё, оплатить аренду и уладить городские дела.',
        'Ворота': 'Вы у городских ворот.' + (user.game.outside ? ' Снаружи виднеется дорога.' : ' Отсюда можно выйти на Дорогу.'),
        'Королевский квартал': '👑 Элитный район. Здесь живут самые богатые и влиятельные люди.',
        'Торговый квартал': '🏙️ Центр торговли. Здесь селятся ремесленники и купцы.',
        'Квартал бедноты': '🏚️ Окраина города. Жильё здесь дёшево, но опасно. Можно встретить пьянчуг.',
        'Дом': '🏠 Ваш дом. Здесь можно отдохнуть, хранить вещи и чувствовать себя в безопасности.',
        'Великая септа': '⛪ Великая Септа Бейлора — главный храм Семерых в Вестеросе. Здесь можно исцелиться и получить благословение удачи.',
        'Порт': '⛵ Порт Королевской Гавани. Скоро здесь можно будет путешествовать между городами Вестероса.',
        'Тюрьма': '⛓️ Вы в тюрьме. Заплатите штраф или ждите освобождения.',
        'Дорога': '🛤️ Дорога у ворот Королевской Гавани.',
        'Библиотека мейстеров': '📚 Библиотека мейстеров. Здесь можно купить и читать книги.',
        'Гильдия наёмников': '🗡️ Гильдия наёмников. Ежедневные задания и контракты.',
        'Бордель': '💃 Бордель Королевской Гавани. Отдых, развлечения и игра в кости.'
    };
    document.getElementById('story-text').textContent = texts[place] || 'Вы находитесь в ' + place + '.';
}

function updateActions() {
    const user = users[currentUser]; if (!user) return;
    const place = user.game.location.place;
    const container = document.getElementById('actions-container'); container.innerHTML = '';
    const inBattle = battleState && battleState.inProgress;
    let actions = [];
    if (inBattle) {
        actions = [
            { id:'battle_attack', label:'⚔️ Атака' },
            { id:'battle_defend', label:'🛡️ Защита' },
            { id:'battle_dodge', label:'💨 Уклонение' },
            { id:'battle_flee', label:'🏃 Побег' }
        ];
    } else {
        actions = [
            { id:'inventory', label:'🎒 Инвентарь' },
            { id:'character', label:'👤 Персонаж' },
            { id:'menu', label:'📋 Меню' },
            { id:'map', label:'🗺️ Карта' }
        ];
        if (place === 'Ворота' && !user.game.outside) actions.unshift({ id:'leave_city', label:'🚪 Выйти на Дорогу' });
        if (place === 'Дорога') { actions.unshift({ id:'enter_city', label:'🚶 Войти в Королевскую Гавань' }); actions.unshift({ id:'search', label:'🔍 Поиск' }); }
        if (place === 'Таверна') actions = [{ id:'eat', label:'🍞 Попросить еды (+25)' },{ id:'trade', label:'🛒 Торговля в таверне' },{ id:'wash', label:'🧹 Помыть посуду (1 мин → 1 МП)' },{ id:'sweep', label:'🧹 Подмести пол (5 мин → 5 МП)' },{ id:'rest', label:'🛏️ Отдохнуть (10 МП → +30 уст., +15 HP)' },{ id:'talk', label:'🗣️ Поговорить с трактирщиком' },...actions];
        if (place === 'Гильдия торговцев') actions = [{ id:'guild', label:'🏛️ Аукцион' },...actions];
        if (place === 'Оружейная лавка') actions = [{ id:'shop', label:'🗡️ Оружейная лавка' },...actions];
        if (place === 'Кожевник') actions = [{ id:'shop', label:'🪡 Кожевник' },...actions];
        if (place === 'Бронник') actions = [{ id:'shop', label:'🛡️ Бронник' },...actions];
        if (place === 'Плотник') actions = [{ id:'shop', label:'🪵 Плотник' },...actions];
        if (place === 'Кузница') actions = [{ id:'shop', label:'⚒️ Кузница' },{ id:'craft', label:'🔨 Крафт' },...actions];
        if (place === 'Конюшня') actions.unshift({ id:'open_stable', label:'🐴 Конюшня' });
        if (place === 'Магистрат') actions.unshift({ id:'open_magistrate', label:'📜 Недвижимость' });
        if (place === 'Великая септа') actions.unshift({ id:'open_temple', label:'⛪ Септа' });
        if (place === 'Порт') actions.unshift({ id:'open_port', label:'⛵ Порт' });
        if (place === 'Рынок') actions.unshift({ id:'open_market', label:'🏪 Рынок' });
        if (place === 'Библиотека мейстеров') actions.unshift({ id:'open_library', label:'📚 Библиотека' });
        if (place === 'Гильдия наёмников') actions.unshift({ id:'open_guildhall', label:'🗡️ Гильдия наёмников' });
        if (place === 'Бордель') actions.unshift({ id:'open_brothel', label:'💃 Бордель' });
        actions.push({ id:'refresh', label:'🔄 Обновить' });
    }
    actions.forEach(a => {
        const btn = document.createElement('button'); btn.className = 'btn-game'; btn.textContent = a.label;
        if (isBusy && !['character','inventory','refresh','map','menu','enter_city','leave_city'].includes(a.id) && !a.id.startsWith('battle_')) btn.disabled = true;
        btn.onclick = function(){ gameAction(a.id); };
        container.appendChild(btn);
    });
}
// ============================================================
// ГЛАВНЫЙ РОУТЕР
// ============================================================
function gameAction(action) {
    setMessage('');
    if (isBusy && !['character','inventory','refresh','map','menu','enter_city','leave_city'].includes(action) && !action.startsWith('battle_')) {
        setMessage('⏳ Вы заняты. Завершите текущее действие.');
        return;
    }
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    
    switch(action) {
        case 'menu': openMainMenu(); break;
        case 'guild': openGuild(); break;
        case 'shop': openShop(g.location.place); break;
        case 'craft': openCraftMenu(); break;
        case 'open_stable': openStable(); break;
        case 'open_temple': openTemple(); break;
        case 'open_port': openPort(); break;
        case 'open_market': openMarket(); break;
        case 'trade': openTavernTrade(); break;
        case 'map': openMap(); break;
        case 'inventory': openInventory(); break;
        case 'character': openCharacter(); break;
        case 'refresh': location.reload(); break;
        case 'open_library': openLibrary(); break;
        case 'open_guildhall': openGuildHall(); break;
        case 'open_brothel': openBrothel(); break;
        
        case 'open_magistrate':
            if (typeof openMagistrate === 'function') openMagistrate();
            else setMessage('❌ Магистрат временно недоступен.');
            break;
        
        case 'search':
            if (searchCooldown) { setMessage('⏳ Подождите 5 секунд.'); return; }
            searchCooldown = true;
            setTimeout(function() { searchCooldown = false; }, 5000);
            doSearch();
            break;
        
        case 'battle_attack': case 'battle_defend': case 'battle_dodge': case 'battle_flee':
            battleAction(action);
            break;
    }
}

// ============================================================
// МЕНЮ
// ============================================================
function openMainMenu() {
    const modal = document.getElementById('modal-menu');
    const content = document.getElementById('modal-menu-content');
    let html = '<div class="modal-section">';
    html += '<button class="btn" style="margin:4px 0;" onclick="openHouses(); closeMenu();">🏘️ Дома</button>';
    html += '<button class="btn btn-secondary" style="margin-top:10px;" onclick="closeMenu()">Закрыть</button>';
    html += '</div>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeMenu() { document.getElementById('modal-menu').classList.add('hide'); }

// ============================================================
// КАРТА И ПЕРЕМЕЩЕНИЕ
// ============================================================
function openMap() {
    const user = users[currentUser];
    if (!user) return;
    const modal = document.getElementById('modal-map');
    const content = document.getElementById('modal-map-content');
    const cityBuildings = ['Таверна','Рынок','Кузница','Оружейная лавка','Кожевник','Бронник','Плотник','Конюшня','Гильдия торговцев','Магистрат','Ворота','Королевский квартал','Торговый квартал','Квартал бедноты','Дом','Великая септа','Порт','Тюрьма','Дорога','Библиотека мейстеров','Гильдия наёмников','Бордель'];
    let html = '<div class="modal-section"><h4>📍 ' + user.game.location.place + ' (ур. ' + (LOCATION_LEVELS[user.game.location.place] || 1) + ')</h4></div>';
    html += '<div class="modal-section">';
    BUILDINGS.forEach(function(b) {
        const bIsCity = cityBuildings.includes(b.id);
        if (user.game.outside && bIsCity) return;
        if (!user.game.outside && !bIsCity) return;
        const isCurrent = b.id === user.game.location.place;
        html += '<div class="row">';
        html += '<span class="label">' + b.label + (isCurrent ? ' ⭐' : '') + '</span>';
        if (!isCurrent) {
            html += '<span class="value"><button class="btn btn-small" onclick="goToBuilding(\'' + b.id + '\')">🚶 Идти</button></span>';
        } else {
            html += '<span class="value" style="color:#6a5a48;">Вы здесь</span>';
        }
        html += '</div>';
    });
    html += '</div><button class="btn" onclick="closeMap()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeMap() { document.getElementById('modal-map').classList.add('hide'); }

function goToBuilding(building) {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    if (isBusy) { setMessage('⏳ Вы заняты.'); return; }
    if (building === g.location.place) { setMessage('📍 Вы уже здесь.'); return; }
    
    const cityBuildings = ['Таверна','Рынок','Кузница','Оружейная лавка','Кожевник','Бронник','Плотник','Конюшня','Гильдия торговцев','Магистрат','Ворота','Королевский квартал','Торговый квартал','Квартал бедноты','Дом','Великая септа','Порт','Тюрьма'];
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
    updateStory();
    updateActions();
    saveData();
}

// ============================================================
// ЛОГ
// ============================================================
function openLog() {
    const modal = document.getElementById('modal-log');
    const content = document.getElementById('modal-log-content');
    let html = '<div class="modal-section"><h4>📜 ПОСЛЕДНИЕ СОБЫТИЯ</h4>';
    if (gameLog.length === 0) {
        html += '<p style="color:#6a5a48;">Пусто</p>';
    } else {
        gameLog.slice(-20).reverse().forEach(function(entry) {
            html += '<p style="color:#b8a890;font-size:12px;padding:2px 0;">' + entry + '</p>';
        });
    }
    html += '</div><button class="btn" onclick="closeLog()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeLog() { document.getElementById('modal-log').classList.add('hide'); }

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

function showOnlineList() {
    const modal = document.getElementById('modal-online');
    const content = document.getElementById('modal-online-content');
    let html = '<div class="modal-section"><h4>👥 ИГРОКИ ОНЛАЙН</h4>';
    let count = 0;
    for (const name in users) {
        if (users[name].game.online) {
            count++;
            html += '<div class="row"><span class="label">' + name + '</span><span class="value">ур. ' + users[name].game.level + ' | ' + users[name].game.location.place + '</span></div>';
        }
    }
    if (count === 0) html += '<p style="color:#6a5a48;">Нет игроков онлайн</p>';
    html += '</div>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeOnline() { document.getElementById('modal-online').classList.add('hide'); }

// ============================================================
// ДОМА
// ============================================================
function openHouses() {
    const modal = document.getElementById('modal-houses');
    const content = document.getElementById('modal-houses-content');
    let html = '<div class="modal-section"><h4>🏘️ ВЫБЕРИТЕ РЕГИОН</h4>';
    const regions = Object.keys(HOUSES_DATA);
    regions.forEach(function(region) {
        const data = HOUSES_DATA[region];
        html += '<button class="btn" style="margin:4px 0;padding:10px;" onclick="showRegionHouses(\'' + region + '\')">' + region + ' (' + data.totalAcres.toLocaleString() + ' акров)</button>';
    });
    html += '<button class="btn btn-secondary" onclick="closeHouses()">Закрыть</button>';
    html += '</div>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function showRegionHouses(region) {
    const data = HOUSES_DATA[region];
    if (!data) return;
    const modal = document.getElementById('modal-houses');
    const content = document.getElementById('modal-houses-content');
    let html = '<div class="modal-section"><h4>🏘️ ' + region.toUpperCase() + '</h4>';
    html += '<p style="color:#6a5a48;margin-bottom:10px;">Столица: ' + data.capital + ' | Всего акров: ' + data.totalAcres.toLocaleString() + '</p>';
    data.houses.forEach(function(house) {
        html += '<button class="btn" style="margin:4px 0;padding:10px;text-align:left;" onclick="showHouseInfo(\'' + region + '\',\'' + house.id + '\')">';
        html += house.sigil + ' ' + house.name + ' (' + house.status + ') — ' + house.acres.toLocaleString() + ' акров';
        html += '</button>';
    });
    html += '<button class="btn btn-secondary" onclick="openHouses()" style="margin-top:10px;">⬅️ Назад</button>';
    html += '</div>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function showHouseInfo(region, houseId) {
    const data = HOUSES_DATA[region];
    if (!data) return;
    const house = data.houses.find(function(h) { return h.id === houseId; });
    if (!house) return;
    const modal = document.getElementById('modal-houses');
    const content = document.getElementById('modal-houses-content');
    let html = '<div class="modal-section"><h4>🏘️ ДОМ ' + house.name.toUpperCase() + '</h4>';
    html += '<div class="row"><span class="label">🦁 Герб</span><span class="value">' + house.sigil + '</span></div>';
    html += '<div class="row"><span class="label">🏰 Цитадель</span><span class="value">' + house.castle + '</span></div>';
    html += '<div class="row"><span class="label">👑 Сюзерен</span><span class="value">' + house.liege + '</span></div>';
    html += '<div class="row"><span class="label">📜 Статус</span><span class="value">' + house.status + '</span></div>';
    html += '<div class="row"><span class="label">🌾 Владения</span><span class="value">' + house.acres.toLocaleString() + ' акров</span></div>';
    html += '<button class="btn btn-secondary" onclick="showRegionHouses(\'' + region + '\')" style="margin-top:10px;">⬅️ Назад</button>';
    html += '</div>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeHouses() { document.getElementById('modal-houses').classList.add('hide'); }
// ============================================================
// ПЕРСОНАЖ
// ============================================================
function openCharacter() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    const modal = document.getElementById('modal-character');
    const content = document.getElementById('modal-content');
    const totalStats = getTotalStats(g);
    const equipped = getEquippedStats(g);
    const mastery = getWeaponMasteryBonus(g);
    let html = '';
    html += '<div class="modal-section"><h4>📋 ОСНОВНОЕ</h4>';
    html += '<div class="row"><span class="label">Имя</span><span class="value">' + currentUser + '</span></div>';
    html += '<div class="row"><span class="label">Национальность</span><span class="value">' + user.nationality + '</span></div>';
    html += '<div class="row"><span class="label">Уровень</span><span class="value">' + g.level + ' (' + g.xp + '/' + g.nextLevelXp + ')</span></div>';
    html += '<div class="row"><span class="label">Очки атрибутов</span><span class="value">' + g.attributePoints + '</span></div>';
    html += '<div class="row"><span class="label">HP</span><span class="value">' + Math.round(g.hp) + '/' + g.maxHp + '</span></div>';
    html += '</div>';
    
    html += '<div class="modal-section"><h4>⚔️ АТРИБУТЫ</h4>';
    ['damage','defense','intelligence','agility'].forEach(function(s) {
        const base = g.stats[s] || 1;
        let bonus = 0;
        if (s === 'damage') bonus = equipped.bonusDamage + mastery.damageBonus;
        if (s === 'defense') bonus = equipped.bonusDefense + mastery.defenseBonus;
        if (s === 'agility') bonus = equipped.bonusAgility + mastery.agilityBonus;
        const total = base + bonus;
        html += '<div class="row"><span class="label">' + ({damage:'⚔️ Урон',defense:'🛡️ Защита',intelligence:'🧠 Интеллект',agility:'💨 Ловкость'}[s]) + '</span>';
        html += '<span class="value">' + base + (bonus > 0 ? ' <span style="color:#7ac98a;">+' + bonus + '</span>' : '') + ' = <strong>' + total + '</strong>';
        if (g.attributePoints > 0 && s !== 'intelligence') html += ' <button class="btn btn-small" onclick="addAttribute(\'' + s + '\')">+1</button>';
        html += '</span></div>';
    });
    html += '</div>';
    
    html += '<div class="modal-section"><h4>💪 ВЫНОСЛИВОСТЬ</h4>';
    const st = g.stamina || { level: 1, xp: 0 };
    html += '<div class="row"><span class="label">Уровень</span><span class="value">' + st.level + '</span></div>';
    html += '</div>';
    
    html += '<div class="modal-section"><h4>👷 ПРОФЕССИИ</h4>';
    ['Шахтёр','Лесоруб','Охотник','Кузнец'].forEach(function(p) {
        const lvl = g.professions[p] || 1;
        html += '<div class="row"><span class="label">' + p + '</span><span class="value">ур. ' + lvl + '</span></div>';
    });
    html += '</div>';
    
    html += '<div class="modal-section"><h4>🛡️ ЭКИПИРОВКА</h4>';
    const slots = [
        { key:'rightHand', label:'Правая рука' }, { key:'leftHand', label:'Левая рука' },
        { key:'helmet', label:'Голова' }, { key:'chestplate', label:'Грудь' },
        { key:'shoulders', label:'Плечи' }, { key:'leggings', label:'Ноги' },
        { key:'boots', label:'Стопы' }, { key:'gloves', label:'Руки' },
        { key:'belt', label:'Пояс' }, { key:'cloak', label:'Спина' },
        { key:'horse', label:'🐴 Лошадь' }
    ];
    slots.forEach(function(s) {
        const item = g.equipment[s.key];
        html += '<div class="row"><span class="label">' + s.label + '</span><span class="value">' + (item ? (item.quality || '') + ' ' + item.name + ' <button class="btn btn-small" style="background:#3d2a1a;" onclick="unequipItem(\'' + s.key + '\')">Снять</button>' : 'пусто') + '</span></div>';
    });
    html += '</div>';
    
    html += '<button class="btn" onclick="document.getElementById(\'modal-character\').classList.add(\'hide\')">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function addAttribute(statId) {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    if (g.attributePoints <= 0) return;
    g.attributePoints--;
    g.stats[statId] = (g.stats[statId] || 1) + 1;
    saveData();
    openCharacter();
    updateMenu();
}

function getMaxHp(g) {
    const staminaLevel = g.stamina?.level || 1;
    return 60 + (g.level - 1) * 10 + staminaLevel * 2;
}

function getEquippedStats(g) {
    let bonusDamage = 0, bonusDefense = 0, bonusAgility = 0;
    const slots = ['rightHand','leftHand','helmet','chestplate','shoulders','leggings','boots','gloves','belt','cloak'];
    slots.forEach(function(slot) {
        const item = g.equipment[slot];
        if (item) {
            if (item.finalDamage) bonusDamage += item.finalDamage;
            if (item.finalDefense) bonusDefense += item.finalDefense;
            if (item.agilityBonus) bonusAgility += item.agilityBonus;
        }
    });
    return { bonusDamage, bonusDefense, bonusAgility };
}

function getWeaponMasteryBonus(g) {
    const weapon = g.equipment.rightHand;
    if (!weapon) return { damageBonus: 0, defenseBonus: 0, agilityBonus: 0, weaponType: 'нет', skillLevel: 0 };
    const weaponType = weapon.type;
    const skill = g.skills[weaponType];
    const skillLevel = skill ? Math.min(skill.level, 999) : 1;
    let damageBonus = 0, defenseBonus = 0, agilityBonus = 0;
    for (let i = 1; i <= skillLevel; i++) {
        const cycle = i % 3;
        if (cycle === 1) damageBonus += 1;
        else if (cycle === 2) defenseBonus += 1;
        else agilityBonus += 1;
    }
    return { damageBonus, defenseBonus, agilityBonus, weaponType, skillLevel };
}

function getTotalStats(g) {
    const equipped = getEquippedStats(g);
    const mastery = getWeaponMasteryBonus(g);
    return {
        damage: (g.stats.damage || 1) + equipped.bonusDamage + mastery.damageBonus,
        defense: (g.stats.defense || 1) + equipped.bonusDefense + mastery.defenseBonus,
        agility: (g.stats.agility || 1) + equipped.bonusAgility + mastery.agilityBonus,
        intelligence: (g.stats.intelligence || 1)
    };
}

function getXpMultiplier(g) { return 1 + (g.stats.intelligence / 100); }

function changeProfession() {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    const now = Date.now();
    if (g.lastProfessionChange && (now - g.lastProfessionChange) < 86400000) {
        setMessage('⏳ Смена профессии доступна раз в 24 часа.'); return;
    }
    const professions = ['Охотник','Шахтёр','Лесоруб','Кузнец'];
    const choice = prompt('Выберите профессию:\n' + professions.map(function(p) { return '• ' + p + (g.activeProfession === p ? ' ✅' : ''); }).join('\n'));
    if (choice && professions.includes(choice)) {
        g.activeProfession = choice;
        g.lastProfessionChange = now;
        setMessage('✅ Вы сменили профессию на ' + choice);
        saveData();
        openCharacter();
    }
}
// ============================================================
// ИНВЕНТАРЬ
// ============================================================
function openInventory() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    const modal = document.getElementById('modal-inventory');
    const content = document.getElementById('modal-inventory-content');
    
    let html = '<div class="modal-section"><h4>🎒 ИНВЕНТАРЬ</h4>';
    html += '<button class="btn btn-small" onclick="mergeStacks()">🔗 Объединить все стеки</button></div>';
    
    if (g.inventory.length === 0) {
        html += '<p style="color:#6a5a48;text-align:center;padding:20px 0;">🎒 Пусто</p>';
    } else {
        g.inventory.forEach(function(item, i) {
            const quality = item.quality || 'Обычное';
            const q = QUALITIES[quality] || QUALITIES['Обычное'];
            let stats = '';
            let countDisplay = '';
            if (isStackable(item) && item.count) countDisplay = ' ×' + item.count;
            if (item.finalDamage) stats = '⚔️ ' + item.finalDamage;
            else if (item.finalDefense) stats = '🛡️ ' + item.finalDefense;
            else if (item.type === 'resource') stats = '📦 ' + (item.resourceType || 'ресурс');
            
            const equippableTypes = ['sword','spear','axe','mace','bow','crossbow','dagger','shield','helmet','chestplate','shoulders','leggings','boots','gloves','belt','cloak','horse'];
            const isEquippable = equippableTypes.includes(item.type);
            const canEquip = !item.level || g.level >= item.level;
            
            html += '<div class="row" style="padding:4px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label" style="color:' + q.color + ';">' + q.emoji + ' ' + item.name + ' (' + quality + ')' + countDisplay + '</span>';
            html += '<span class="value" style="font-size:12px;">' + stats;
            
            if (isStackable(item) && item.count > 1) {
                html += ' <button class="btn btn-small" onclick="splitStack(' + i + ')">🔪</button>';
                html += ' <button class="btn btn-small" onclick="mergeSpecificStack(' + i + ')">🔗</button>';
                if (isConsumable(item)) html += ' <button class="btn btn-small" onclick="useOneFromStack(' + i + ')">🍽️</button>';
            }
            if (isEquippable && canEquip) html += ' <button class="btn btn-small" onclick="equipItem(' + i + ')">Надеть</button>';
            if (!isStackable(item) && isConsumable(item)) html += ' <button class="btn btn-small" onclick="useItem(' + i + ')">🍽️</button>';
            
            html += '</span></div>';
        });
    }
    
    html += '<div class="modal-section"><h4>🛡️ НАДЕТО</h4>';
    const slots = [
        { key:'rightHand', label:'Правая рука' }, { key:'leftHand', label:'Левая рука' },
        { key:'helmet', label:'Голова' }, { key:'chestplate', label:'Грудь' },
        { key:'shoulders', label:'Плечи' }, { key:'leggings', label:'Ноги' },
        { key:'boots', label:'Стопы' }, { key:'gloves', label:'Руки' },
        { key:'belt', label:'Пояс' }, { key:'cloak', label:'Спина' },
        { key:'horse', label:'🐴 Лошадь' }
    ];
    slots.forEach(function(s) {
        const item = g.equipment[s.key];
        html += '<div class="row"><span class="label">' + s.label + '</span><span class="value">' + (item ? (item.quality || '') + ' ' + item.name + ' <button class="btn btn-small" style="background:#3d2a1a;" onclick="unequipItem(\'' + s.key + '\')">Снять</button>' : 'пусто') + '</span></div>';
    });
    html += '</div>';
    
    html += '<button class="btn" onclick="document.getElementById(\'modal-inventory\').classList.add(\'hide\')">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function equipItem(index) {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    if (index >= g.inventory.length) { setMessage('❌ Предмет не найден.'); return; }
    const item = g.inventory[index];
    if (item.level && g.level < item.level) { setMessage('❌ Требуется уровень ' + item.level); return; }
    
    const slotMap = {
        'sword':'rightHand','spear':'rightHand','axe':'rightHand','mace':'rightHand',
        'bow':'rightHand','crossbow':'rightHand','dagger':'rightHand','shield':'leftHand',
        'helmet':'helmet','chestplate':'chestplate','shoulders':'shoulders',
        'leggings':'leggings','boots':'boots','gloves':'gloves','belt':'belt','cloak':'cloak','horse':'horse'
    };
    const slot = slotMap[item.type];
    if (!slot) { setMessage('❌ Нельзя надеть.'); return; }
    
    if (g.equipment[slot]) addToInventory(g, g.equipment[slot]);
    g.equipment[slot] = item;
    g.inventory.splice(index, 1);
    setMessage('✅ Вы надели ' + item.name);
    updateMenu(); saveData(); openInventory();
}

function unequipItem(slot) {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    if (!g.equipment[slot]) { setMessage('❌ Слот пуст.'); return; }
    addToInventory(g, g.equipment[slot]);
    g.equipment[slot] = null;
    setMessage('✅ Вы сняли предмет.');
    updateMenu(); saveData(); openInventory();
}

function useItem(index) {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    if (index >= g.inventory.length) { setMessage('❌ Предмет не найден.'); return; }
    const item = g.inventory[index];
    
    if (item.effect) {
        if (item.effect.food) g.food = Math.min(100, g.food + item.effect.food);
        if (item.effect.thirst) g.thirst = Math.min(100, g.thirst + item.effect.thirst);
        if (item.effect.hp) g.hp = Math.min(g.maxHp, g.hp + item.effect.hp);
    } else if (item.name.includes('Хлеб') || item.name.includes('Мясо') || item.name.includes('Рыба')) {
        g.food = Math.min(100, g.food + 20);
    } else if (item.name.includes('Вода')) {
        g.thirst = Math.min(100, g.thirst + 15);
    } else if (item.name.includes('Эль')) {
        g.hp = Math.min(g.maxHp, g.hp + 5);
        g.thirst = Math.min(100, g.thirst + 10);
    } else if (item.name.includes('Вино')) {
        g.hp = Math.min(g.maxHp, g.hp + 8);
        g.thirst = Math.min(100, g.thirst + 15);
    } else { setMessage('❌ Нельзя использовать.'); return; }
    
    if (item.count && item.count > 1) { item.count--; if (item.count === 0) g.inventory.splice(index, 1); }
    else g.inventory.splice(index, 1);
    
    setMessage('✅ Использовано: ' + item.name);
    updateMenu(); saveData(); openInventory();
}
// ============================================================
// БОЙ И ПОИСК
// ============================================================
function saveBattleState() {
    if (battleState) {
        battleState.lastActionTime = Date.now();
        localStorage.setItem('got_battle', JSON.stringify(battleState));
    } else {
        localStorage.removeItem('got_battle');
    }
}

function doSearch() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    const place = g.location.place;
    const locationLevel = LOCATION_LEVELS[place] || 1;
    const luck = Math.min(25, g.luck || 0);
    const luckBonus = Math.floor(luck / 10);
    
    if (place === 'Квартал бедноты') {
        if (Math.random() * 100 < 20) { findDrunkard(); return; }
    }
    
    const treasureChance = Math.min(4.5, 2 + luckBonus);
    if (Math.random() * 100 < treasureChance) { findTreasure(); return; }
    
    const monsterChance = Math.min(47.5, 45 + luckBonus);
    if (Math.random() * 100 < monsterChance) {
        let mobs = [];
        if (locationLevel <= 1) {
            mobs = [
                { name:'Крыса', hp:8, damage:2, defense:0, xp:3, level:1, type:'animal', agility:2 },
                { name:'Бродяга', hp:12, damage:3, defense:0, xp:4, level:2, type:'human', agility:2 }
            ];
        } else if (locationLevel <= 5) {
            mobs = [
                { name:'Крыса', hp:8, damage:2, defense:0, xp:3, level:1, type:'animal', agility:2 },
                { name:'Бродяга', hp:12, damage:3, defense:0, xp:4, level:2, type:'human', agility:2 },
                { name:'Собака', hp:18, damage:4, defense:1, xp:6, level:3, type:'animal', agility:3 }
            ];
        } else if (locationLevel <= 15) {
            mobs = [
                { name:'Волк', hp:25, damage:6, defense:2, xp:10, level:8, type:'animal', agility:4 },
                { name:'Бандит', hp:30, damage:7, defense:2, xp:12, level:6, type:'human', agility:3 },
                { name:'Разбойник', hp:40, damage:9, defense:3, xp:18, level:10, type:'human', agility:4 }
            ];
        } else if (locationLevel <= 30) {
            mobs = [
                { name:'Разбойник', hp:40, damage:9, defense:3, xp:18, level:10, type:'human', agility:4 },
                { name:'Головорез', hp:50, damage:11, defense:4, xp:25, level:15, type:'human', agility:5 }
            ];
        } else {
            mobs = [
                { name:'Медведь', hp:80, damage:18, defense:8, xp:50, level:30, type:'animal', agility:4 },
                { name:'Элитный разбойник', hp:100, damage:22, defense:9, xp:70, level:40, type:'human', agility:6 }
            ];
        }
        const mob = mobs[Math.floor(Math.random() * mobs.length)];
        setMessage('⚔️ Вы встретили ' + mob.name + ' (ур. ' + mob.level + ')');
        startBattle(mob);
        return;
    }
    setMessage('🔍 Вы никого не нашли. Тишина...');
}

function findDrunkard() {
    const drunkards = [
        { name:'Пьяный рыбак', hp:15, damage:2, defense:0, xp:2, level:1 },
        { name:'Пьяный грузчик', hp:20, damage:3, defense:1, xp:3, level:2 },
        { name:'Пьяный матрос', hp:25, damage:4, defense:1, xp:4, level:3 },
        { name:'Пьяный стражник', hp:30, damage:5, defense:2, xp:5, level:4 }
    ];
    const drunkard = drunkards[Math.floor(Math.random() * drunkards.length)];
    setMessage('🍺 Вы нашли ' + drunkard.name + '!');
    startDrunkardFight(drunkard);
}

function findTreasure() {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    const luck = Math.min(25, g.luck || 0);
    const bonusLuck = Math.min(5, Math.floor(luck / 5));
    const typeRoll = Math.random() * 100;
    
    if (typeRoll < 40) {
        const goldAmount = 2 + Math.floor(Math.random() * 8) + bonusLuck;
        g.copper += goldAmount;
        convertCurrency(g);
        setMessage('🪙 Вы нашли клад! +' + goldAmount + ' золота!');
        updateMenu(); saveData();
        return;
    }
    setMessage('📦 Вы что-то нашли, но не поняли что.');
}

function startBattle(mob) {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    const maxHp = getMaxHp(g);
    g.maxHp = maxHp;
    if (g.hp === undefined || g.hp > maxHp) g.hp = maxHp;
    
    let horseAlive = false, horseHp = 0, horseMaxHp = 0, horseDefensePercent = 0, mounted = false;
    if (g.equipment && g.equipment.horse) {
        const horse = HORSE_TYPES[g.equipment.horse.horseType];
        if (horse) {
            horseAlive = true; horseHp = horse.hp; horseMaxHp = horse.hp;
            horseDefensePercent = horse.defensePercent || 0; mounted = true;
        }
    }
    
    battleState = {
        mob: mob, playerHp: g.hp, mobHp: mob.hp, maxPlayerHp: maxHp,
        turn: 'player', inProgress: true, defending: false, log: [], fleeAttempts: 0,
        playerAgility: g.stats.agility || 1, playerDefense: g.stats.defense || 1,
        mobAgility: mob.agility || 1, mobLevel: mob.level || 1, lastActionTime: Date.now(),
        horseAlive: horseAlive, horseHp: horseHp, horseMaxHp: horseMaxHp,
        horseDefensePercent: horseDefensePercent, mounted: mounted, horseDismounted: false,
        isDrunkardFight: false
    };
    
    isBusy = true;
    document.getElementById('busy-status').classList.remove('hide');
    document.getElementById('busy-status').textContent = '⚔️ Бой с ' + mob.name + '!';
    updateActions();
    renderBattle();
    saveBattleState();
}

function startDrunkardFight(drunkard) {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    const maxHp = getMaxHp(g);
    g.maxHp = maxHp;
    if (g.hp === undefined || g.hp > maxHp) g.hp = maxHp;
    
    battleState = {
        mob: drunkard, playerHp: g.hp, mobHp: drunkard.hp, maxPlayerHp: maxHp,
        turn: 'player', inProgress: true, defending: false, log: [], fleeAttempts: 0,
        playerAgility: g.stats.agility || 1, playerDefense: g.stats.defense || 1,
        mobAgility: 1, mobLevel: drunkard.level || 1, lastActionTime: Date.now(),
        isDrunkardFight: true,
        horseAlive: false, horseHp: 0, horseMaxHp: 0, horseDefensePercent: 0, mounted: false, horseDismounted: false
    };
    
    isBusy = true;
    document.getElementById('busy-status').classList.remove('hide');
    document.getElementById('busy-status').textContent = '🍺 Драка с ' + drunkard.name + '!';
    updateActions();
    renderBattle();
    saveBattleState();
}

function renderBattle() {
    if (!battleState || !battleState.inProgress) return;
    const mob = battleState.mob;
    const mobHpPercent = Math.max(0, (battleState.mobHp / mob.hp) * 100);
    const playerHpPercent = Math.max(0, (battleState.playerHp / battleState.maxPlayerHp) * 100);
    
    let msg = '⚔️ БОЙ С ' + mob.name.toUpperCase() + ' (ур. ' + battleState.mobLevel + ')\n\n';
    msg += '🐺 ' + mob.name + '\nHP: ' + Math.max(0, battleState.mobHp) + '/' + mob.hp + '\n';
    msg += '█'.repeat(Math.floor(mobHpPercent / 5)) + '░'.repeat(20 - Math.floor(mobHpPercent / 5)) + '\n\n';
    msg += '❤️ Вы\nHP: ' + Math.max(0, battleState.playerHp) + '/' + battleState.maxPlayerHp + '\n';
    msg += '█'.repeat(Math.floor(playerHpPercent / 5)) + '░'.repeat(20 - Math.floor(playerHpPercent / 5)) + '\n';
    msg += '\n🔄 Ход: ' + (battleState.turn === 'player' ? 'ВАШ' : mob.name.toUpperCase());
    
    if (battleState.log.length > 0) {
        msg += '\n\n📋 Лог:\n';
        battleState.log.slice(-5).forEach(function(e) { msg += '• ' + e + '\n'; });
    }
    
    setMessage(msg);
    updateActions();
    updateMenu();
    saveBattleState();
}

function battleAction(action) {
    if (!battleState || !battleState.inProgress) return;
    if (battleState.turn !== 'player') { setMessage('⏳ Ход противника.'); return; }
    
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    const mob = battleState.mob;
    
    if (action === 'battle_flee') {
        if (Math.random() * 100 < 25) {
            battleState.log.push('🏃 Вы сбежали!');
            endBattle(false, 'Побег');
            return;
        }
        battleState.log.push('🏃 Побег не удался!');
        battleState.turn = 'mob';
        renderBattle(); saveBattleState();
        setTimeout(function() { if (battleState && battleState.inProgress) mobTurn(); }, 4000);
        return;
    }
    
    if (action === 'battle_attack') {
        const totalStats = getTotalStats(g, battleState);
        let damage = Math.max(1, totalStats.damage + Math.floor(Math.random() * 4) - (mob.defense || 0));
        battleState.mobHp = Math.max(0, battleState.mobHp - damage);
        battleState.log.push('⚔️ Вы нанесли ' + damage + ' урона.');
        
        if (battleState.mobHp <= 0) { endBattle(true, 'Победа'); return; }
    }
    
    if (action === 'battle_defend') { battleState.defending = true; battleState.log.push('🛡️ Вы защищаетесь.'); }
    if (action === 'battle_dodge') {
        if (Math.random() * 100 < 50) { battleState.log.push('💨 Вы увернулись!'); battleState.turn = 'player'; renderBattle(); saveBattleState(); return; }
        else battleState.log.push('💨 Не удалось.');
    }
    
    battleState.turn = 'mob';
    renderBattle(); saveBattleState();
    setTimeout(function() { if (battleState && battleState.inProgress) mobTurn(); }, 4000);
}

function mobTurn() {
    if (!battleState || !battleState.inProgress) return;
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    const mob = battleState.mob;
    const totalStats = getTotalStats(g, battleState);
    
    let damage = mob.damage + Math.floor(Math.random() * 3);
    if (battleState.defending) { damage = Math.round(damage * 0.5); battleState.defending = false; }
    damage = Math.max(1, damage);
    
    battleState.playerHp = Math.max(0, battleState.playerHp - damage);
    battleState.log.push('🐺 ' + mob.name + ' нанёс ' + damage + ' урона');
    
    if (battleState.playerHp <= 0) { endBattle(false, 'Смерть'); return; }
    
    battleState.turn = 'player';
    renderBattle(); saveBattleState();
}

function endBattle(won, reason) {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    const mob = battleState.mob;
    
    g.hp = battleState.playerHp;
    if (g.hp > g.maxHp) g.hp = g.maxHp;
    
    if (won) {
        const xpGain = Math.round((mob.xp + Math.floor(Math.random() * 5)) * getXpMultiplier(g));
        g.xp += xpGain;
        while (g.xp >= g.nextLevelXp) { g.xp -= g.nextLevelXp; g.level++; g.nextLevelXp = 100 + g.level * 10; if (g.level <= 100) g.attributePoints++; }
        
        if (mob.type === 'human') { g.copper += mob.level * 3 + Math.floor(Math.random() * mob.level * 3); convertCurrency(g); }
        if (mob.type === 'animal') {
            for (let i = 0; i < 2; i++) addToInventory(g, { name:'🥩 Мясо', quality:'Обычное', type:'food', effect:{food:30}, count:1 });
        }
        setMessage('⚔️ Победа! +' + xpGain + ' XP');
    } else {
        if (reason === 'Смерть') {
            g.hp = g.maxHp; g.location.place = 'Таверна'; g.location.location = 'Королевская Гавань';
            g.food = 100; g.thirst = 100; g.fatigue = 100; g.outside = false;
            setMessage('💀 Вас убили. Вы возродились в таверне.');
        }
    }
    
    battleState.inProgress = false; battleState = null;
    isBusy = false;
    document.getElementById('busy-status').classList.add('hide');
    localStorage.removeItem('got_battle');
    updateMenu(); updateActions(); saveData();
}
// ============================================================
// МАГАЗИНЫ И ТОРГОВЛЯ
// ============================================================
function getShopCategories(shopType) {
    if (shopType === 'Оружейная лавка') return [
        { id:'sword', label:'🗡️ Мечи' }, { id:'spear', label:'🔱 Копья' },
        { id:'axe', label:'🪓 Топоры' }, { id:'mace', label:'🔨 Булавы' },
        { id:'dagger', label:'🔪 Кинжалы' }, { id:'shield', label:'🛡️ Щиты' }
    ];
    if (shopType === 'Кожевник') return [
        { id:'leather', label:'🧵 Кожа' }, { id:'helmet', label:'🪖 Шлемы' },
        { id:'chestplate', label:'🦺 Нагрудники' }, { id:'shoulders', label:'💪 Наплечники' },
        { id:'leggings', label:'👖 Поножи' }, { id:'boots', label:'👢 Сапоги' },
        { id:'gloves', label:'🧤 Перчатки' }, { id:'belt', label:'🎗️ Пояса' }, { id:'cloak', label:'🧥 Плащи' }
    ];
    if (shopType === 'Бронник') return [
        { id:'steel', label:'⚒️ Сталь' }, { id:'helmet', label:'🪖 Шлемы' },
        { id:'chestplate', label:'🦺 Нагрудники' }, { id:'shoulders', label:'💪 Наплечники' },
        { id:'leggings', label:'👖 Поножи' }, { id:'boots', label:'👢 Сапоги' },
        { id:'gloves', label:'🧤 Перчатки' }, { id:'belt', label:'🎗️ Пояса' }, { id:'cloak', label:'🧥 Плащи' }
    ];
    if (shopType === 'Плотник') return [
        { id:'wood', label:'🪵 Дерево' }, { id:'bow', label:'🏹 Луки' }, { id:'crossbow', label:'🎯 Арбалеты' }
    ];
    if (shopType === 'Кузница') return [
        { id:'iron', label:'⛏️ Руда' }, { id:'coal', label:'🔥 Уголь' },
        { id:'steel', label:'⚒️ Сталь' }
    ];
    return [];
}

function getArmorClass(shopType) {
    if (shopType === 'Кожевник') return 'leather';
    if (shopType === 'Бронник') return 'plate';
    return null;
}

function getSellPrice(item) {
    if (!item) return 0;
    const q = QUALITIES[item.quality] || QUALITIES['Обычное'];
    let basePrice = 5;
    if (item.type === 'resource') {
        const rp = { leather:5, iron:8, wood:3, steel:20, coal:4 };
        basePrice = rp[item.resourceType] || 5;
    } else if (item.baseDamage) {
        basePrice = 5 + (item.level || 1) * 2 + (item.baseDamage || 0);
    } else if (item.baseDefense || item.defense) {
        const def = item.defense || item.baseDefense || 0;
        basePrice = 5 + (item.level || 1) * 2 + def;
    }
    return Math.max(1, Math.round(basePrice * q.multiplier * 0.5));
}

function openShop(shopType) {
    const modal = document.getElementById('modal-trade');
    const content = document.getElementById('modal-trade-content');
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    const categories = getShopCategories(shopType);
    
    let html = '<div class="modal-section"><h4>🏪 ' + shopType + '</h4>';
    html += '<p style="color:#6a5a48;">💰 ' + formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper) + '</p></div>';
    
    html += '<div class="modal-section"><h4>💰 ПРОДАЖА</h4>';
    if (g.inventory.length === 0) {
        html += '<p style="color:#6a5a48;">Пусто.</p>';
    } else {
        g.inventory.forEach(function(item, index) {
            const quality = item.quality || 'Обычное';
            const q = QUALITIES[quality] || QUALITIES['Обычное'];
            const pricePerItem = getSellPrice(item);
            html += '<div class="row"><span class="label" style="color:' + q.color + ';">' + q.emoji + ' ' + item.name + '</span>';
            html += '<span class="value">' + formatCurrency(pricePerItem) + ' <button class="btn btn-small" onclick="sellToShop(\'' + shopType + '\',\'' + item.name + '\',\'' + quality + '\',' + pricePerItem + ')">Продать</button></span></div>';
        });
    }
    html += '</div>';
    
    html += '<div class="modal-section"><h4>📂 КУПИТЬ</h4><div class="tabs">';
    categories.forEach(function(cat) {
        html += '<button class="tab-btn" onclick="openCategory(\'' + shopType + '\',\'' + cat.id + '\')">' + cat.label + '</button>';
    });
    if (shopType === 'Кузница') html += '<button class="tab-btn" style="background:#3d2e20;" onclick="openCraftTab()">🔨 Крафт</button>';
    html += '</div></div>';
    html += '<div id="shop-category-content" class="modal-section"><p style="color:#6a5a48;">👆 Выберите раздел</p></div>';
    html += '<button class="btn" onclick="document.getElementById(\'modal-trade\').classList.add(\'hide\')">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function openCategory(shopType, categoryId) {
    const container = document.getElementById('shop-category-content');
    const armorClass = getArmorClass(shopType);
    
    if (shopType === 'Кузница') {
        if (categoryId === 'iron') { showQualitySelect(shopType, 'Руда железная', 1, 'resource', 0, 0, 'iron', ''); return; }
        if (categoryId === 'coal') { showQualitySelect(shopType, 'Уголь', 1, 'resource', 0, 0, 'coal', ''); return; }
        if (categoryId === 'steel') { showQualitySelect(shopType, 'Сталь', 1, 'resource', 0, 0, 'steel', ''); return; }
    }
    if (shopType === 'Кожевник' && categoryId === 'leather') { showQualitySelect(shopType, 'Кожа', 1, 'resource', 0, 0, 'leather', ''); return; }
    if (shopType === 'Бронник' && categoryId === 'steel') { showQualitySelect(shopType, 'Сталь', 1, 'resource', 0, 0, 'steel', ''); return; }
    if (shopType === 'Плотник' && categoryId === 'wood') { showQualitySelect(shopType, 'Дерево', 1, 'resource', 0, 0, 'wood', ''); return; }
    
    let itemNames = [];
    if (armorClass) {
        const categoryData = ALL_ITEMS[armorClass][categoryId];
        if (categoryData) {
            const seen = new Set();
            categoryData.forEach(function(item) {
                if (!seen.has(item.name)) { seen.add(item.name); itemNames.push({ name:item.name, level:item.level, type:categoryId, armorClass:armorClass, baseDefense:item.baseDefense || 0 }); }
            });
        }
    } else if (ALL_ITEMS.weapons[categoryId]) {
        const seen = new Set();
        ALL_ITEMS.weapons[categoryId].forEach(function(item) {
            if (!seen.has(item.name)) { seen.add(item.name); itemNames.push({ name:item.name, level:item.level, type:categoryId, baseDamage:item.baseDamage || 0, defense:item.defense || 0 }); }
        });
    }
    
    let html = '<button class="btn btn-secondary" style="margin-bottom:10px;" onclick="openShop(\'' + shopType + '\')">⬅️ Назад</button>';
    itemNames.forEach(function(item) {
        html += '<div class="row"><span class="label">' + item.name + ' (ур.' + (item.level || 1) + ')</span>';
        html += '<span class="value"><button class="btn btn-small" onclick="showQualitySelect(\'' + shopType + '\',\'' + item.name + '\',' + item.level + ',\'' + item.type + '\',' + (item.baseDamage || 0) + ',' + (item.defense || item.baseDefense || 0) + ',\'\',\'' + (item.armorClass || '') + '\')">🔍 Выбрать</button></span></div>';
    });
    container.innerHTML = html;
}

function showQualitySelect(shopType, itemName, level, type, baseDamage, defense, resourceType, armorClass) {
    const container = document.getElementById('shop-category-content');
    const isResource = resourceType !== undefined && resourceType !== '';
    let qualities = isResource ? ['Плохое','Обычное','Хорошее','Качественное','Мастерское'] : ['Рваное','Плохое','Обычное','Хорошее','Качественное'];
    
    let html = '<button class="btn btn-secondary" style="margin-bottom:10px;" onclick="openCategory(\'' + shopType + '\',\'' + type + '\')">⬅️ Назад</button>';
    html += '<h4>' + itemName + '</h4>';
    
    qualities.forEach(function(quality) {
        const q = QUALITIES[quality] || QUALITIES['Обычное'];
        const stockKey = itemName + '|' + quality;
        const stock = getTraderStock(shopType, stockKey);
        let price = isResource ? getResourcePrice(resourceType, quality) : Math.round((5 + level * 2) * q.multiplier);
        
        html += '<div class="row"><span class="label" style="color:' + q.color + ';">' + q.emoji + ' ' + quality + '</span>';
        html += '<span class="value">' + formatCurrency(price) + ' 📦' + stock + ' ';
        html += stock > 0 ? '<button class="btn btn-small" onclick="buyItem(\'' + shopType + '\',\'' + itemName + '\',\'' + quality + '\',' + price + ',' + level + ',\'' + type + '\',' + baseDamage + ',' + defense + ',\'' + (resourceType || '') + '\',\'' + (armorClass || '') + '\')">Купить</button>' : '<button class="btn btn-small" disabled>Нет</button>';
        html += '</span></div>';
    });
    container.innerHTML = html;
}

function buyItem(shopType, itemName, quality, price, level, type, baseDamage, defense, resourceType, armorClass) {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    const stockKey = itemName + '|' + quality;
    if (getTraderStock(shopType, stockKey) <= 0) { setMessage('❌ Нет в наличии.'); return; }
    if (!spendMoney(g, price)) { setMessage('❌ Недостаточно денег.'); return; }
    removeTraderStock(shopType, stockKey, 1);
    
    const q = QUALITIES[quality] || QUALITIES['Обычное'];
    let item = { name:itemName, level:level, quality:quality, type:type };
    if (baseDamage > 0) { item.baseDamage = baseDamage; item.finalDamage = Math.round(baseDamage * q.multiplier); }
    if (defense > 0) { item.baseDefense = defense; item.finalDefense = Math.round(defense * q.multiplier); if (armorClass === 'leather') item.agilityBonus = item.finalDefense; item.armorClass = armorClass || 'plate'; }
    if (resourceType) { item.type = 'resource'; item.resourceType = resourceType; }
    
    addToInventory(g, item);
    setMessage('✅ Вы купили ' + itemName + ' (' + quality + ')');
    updateMenu(); saveData();
    showQualitySelect(shopType, itemName, level, type, baseDamage, defense, resourceType, armorClass);
}

function sellToShop(shopType, itemName, quality, pricePerItem) {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    for (let i = g.inventory.length - 1; i >= 0; i--) {
        if (g.inventory[i].name === itemName && g.inventory[i].quality === quality) {
            const item = g.inventory.splice(i, 1)[0];
            g.copper += pricePerItem;
            convertCurrency(g);
            addTraderStock(shopType, itemName + '|' + quality, 1);
            setMessage('💰 Продано: ' + itemName);
            updateMenu(); saveData(); openShop(shopType);
            return;
        }
    }
}

function openTavernTrade() {
    const modal = document.getElementById('modal-trade');
    const content = document.getElementById('modal-trade-content');
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    
    let html = '<div class="modal-section"><h4>🍺 ТОРГОВЛЯ В ТАВЕРНЕ</h4>';
    html += '<p style="color:#6a5a48;">💰 ' + formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper) + '</p></div>';
    
    const items = [
        { id:'bread', name:'🍞 Хлеб', price:5 }, { id:'meat', name:'🥩 Мясо', price:10 },
        { id:'water', name:'💧 Вода', price:2 }, { id:'ale', name:'🍺 Эль', price:5 }, { id:'wine', name:'🍷 Вино', price:8 }
    ];
    html += '<div class="modal-section"><h4>📦 КУПИТЬ</h4>';
    items.forEach(function(item) {
        html += '<div class="row"><span class="label">' + item.name + '</span><span class="value">' + formatCurrency(item.price) + ' <button class="btn btn-small" onclick="buyTavernItem(\'' + item.id + '\',' + item.price + ')">Купить</button></span></div>';
    });
    html += '</div>';
    
    html += '<button class="btn" onclick="document.getElementById(\'modal-trade\').classList.add(\'hide\')">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function buyTavernItem(itemId, price) {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    if (!spendMoney(g, price)) { setMessage('❌ Недостаточно денег.'); return; }
    
    const itemMap = { bread:{name:'Хлеб',food:20}, meat:{name:'Мясо',food:30}, water:{name:'Вода',thirst:15}, ale:{name:'Эль',hp:5,thirst:10}, wine:{name:'Вино',hp:8,thirst:15} };
    const data = itemMap[itemId];
    const item = { name:data.name, quality:'Обычное', type:'food', effect:{}, count:1 };
    if (data.food) item.effect.food = data.food;
    if (data.thirst) item.effect.thirst = data.thirst;
    if (data.hp) item.effect.hp = data.hp;
    
    addToInventory(g, item);
    if (data.food) g.food = Math.min(100, g.food + data.food);
    if (data.thirst) g.thirst = Math.min(100, g.thirst + data.thirst);
    if (data.hp) g.hp = Math.min(g.maxHp, g.hp + data.hp);
    
    setMessage('✅ Вы купили ' + data.name);
    updateMenu(); saveData(); openTavernTrade();
}

function openCraftMenu() {
    const modal = document.getElementById('modal-trade');
    const content = document.getElementById('modal-trade-content');
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    
    let ironCount = 0, coalCount = 0;
    g.inventory.forEach(function(item) {
        if (item.resourceType === 'iron') ironCount += (item.count || 1);
        if (item.resourceType === 'coal') coalCount += (item.count || 1);
    });
    
    let html = '<div class="modal-section"><h4>🔨 КРАФТ</h4>';
    html += '<p>⛏️ Руда: ' + ironCount + ' | 🔥 Уголь: ' + coalCount + '</p>';
    html += '<button class="btn" onclick="craftSteel()" ' + (ironCount >= 2 && coalCount >= 1 ? '' : 'disabled') + '>⚒️ Создать сталь (2 руды + 1 уголь)</button>';
    html += '<button class="btn btn-secondary" onclick="document.getElementById(\'modal-trade\').classList.add(\'hide\')">Закрыть</button></div>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function craftSteel() {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    
    let removed = 0;
    for (let i = g.inventory.length - 1; i >= 0 && removed < 2; i--) {
        if (g.inventory[i].resourceType === 'iron') {
            if (g.inventory[i].count > 1) { g.inventory[i].count--; removed++; }
            else { g.inventory.splice(i, 1); removed++; }
        }
    }
    for (let i = g.inventory.length - 1; i >= 0; i--) {
        if (g.inventory[i].resourceType === 'coal') {
            if (g.inventory[i].count > 1) g.inventory[i].count--;
            else g.inventory.splice(i, 1);
            break;
        }
    }
    
    addToInventory(g, { name:'Сталь', quality:'Обычное', type:'resource', resourceType:'steel', count:1 });
    setMessage('✅ Вы скрафтили сталь!');
    updateMenu(); saveData(); openCraftMenu();
}

function openGuild() {
    const modal = document.getElementById('modal-guild');
    const content = document.getElementById('modal-guild-content');
    
    let html = '<div class="modal-section"><h4>🏛️ АУКЦИОН</h4>';
    html += '<p style="color:#6a5a48;">Комиссия: 1%</p>';
    
    if (marketListings.length === 0) {
        html += '<p style="color:#6a5a48;">Нет активных лотов.</p>';
    } else {
        marketListings.forEach(function(listing, index) {
            html += '<div class="row"><span class="label">' + listing.item.name + ' (' + (listing.item.quality || 'Обычное') + ')</span>';
            html += '<span class="value">' + formatCurrency(listing.price) + ' ';
            if (listing.seller !== currentUser) html += '<button class="btn btn-small" onclick="buyListing(' + index + ')">Купить</button>';
            else html += '<button class="btn btn-small" onclick="removeListing(' + index + ')">Снять</button>';
            html += '</span></div>';
        });
    }
    
    html += '<div class="modal-section"><h4>💰 ВЫСТАВИТЬ</h4>';
    const user = users[currentUser]; if (!user) return;
    user.game.inventory.forEach(function(item, i) {
        html += '<div class="row"><span class="label">' + item.name + '</span><span class="value"><button class="btn btn-small" onclick="sellItemToMarket(' + i + ')">Выставить</button></span></div>';
    });
    html += '</div>';
    
    html += '<button class="btn" onclick="document.getElementById(\'modal-guild\').classList.add(\'hide\')">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function sellItemToMarket(itemIndex) {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    if (itemIndex >= g.inventory.length) return;
    const item = g.inventory[itemIndex];
    const input = prompt('Введите цену (МП):');
    if (!input) return;
    const price = parseInt(input);
    if (isNaN(price) || price < 1) { setMessage('❌ Неверная цена.'); return; }
    
    g.inventory.splice(itemIndex, 1);
    marketListings.push({ item:item, price:price, seller:currentUser, listedAt:Date.now() });
    setMessage('✅ Товар выставлен!');
    saveData(); openGuild();
}

function buyListing(index) {
    if (index >= marketListings.length) return;
    const listing = marketListings[index];
    const user = users[currentUser]; if (!user) return;
    if (!spendMoney(user.game, listing.price)) { setMessage('❌ Недостаточно денег.'); return; }
    
    addToInventory(user.game, listing.item);
    const seller = users[listing.seller];
    if (seller) { seller.game.copper += listing.price; convertCurrency(seller.game); }
    marketListings.splice(index, 1);
    setMessage('✅ Вы купили лот!');
    saveData(); openGuild();
}

function removeListing(index) {
    if (index >= marketListings.length) return;
    const listing = marketListings[index];
    if (listing.seller !== currentUser) return;
    addToInventory(users[currentUser].game, listing.item);
    marketListings.splice(index, 1);
    setMessage('✅ Лот снят.');
    saveData(); openGuild();
}
// ============================================================
// КОНЮШНЯ
// ============================================================
function openStable() {
    const modal = document.getElementById('modal-stable');
    if (!modal) {
        const overlay = document.createElement('div');
        overlay.id = 'modal-stable';
        overlay.className = 'modal-overlay hide';
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🐴 КОНЮШНЯ</h3><button class="close-btn" onclick="document.getElementById(\'modal-stable\').classList.add(\'hide\')">✕</button></div><div id="modal-stable-content"></div></div>';
        document.body.appendChild(overlay);
    }
    const content = document.getElementById('modal-stable-content');
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    checkHorseReset();
    
    let html = '<div class="modal-section"><h4>🐴 КОНЮШНЯ</h4>';
    if (g.equipment && g.equipment.horse) {
        const horse = g.equipment.horse;
        const ht = HORSE_TYPES[horse.horseType];
        html += '<p>🐴 ' + ht.name + ' | HP: ' + horse.hp + '/' + horse.maxHp + '</p>';
        html += '<button class="btn btn-danger" onclick="sellHorse()">💰 Продать</button>';
    } else {
        html += '<p style="color:#6a5a48;">У вас нет лошади.</p>';
    }
    html += '</div>';
    
    html += '<div class="modal-section"><h4>📦 КУПИТЬ</h4>';
    for (let key in HORSE_TYPES) {
        const horse = HORSE_TYPES[key];
        const market = horseMarket[key];
        const available = market.total - market.sold;
        html += '<div class="row"><span class="label">' + horse.emoji + ' ' + horse.name + '</span>';
        html += '<span class="value">' + formatCurrency(horse.price * 210 * 56) + ' (' + available + ') ';
        if (available > 0 && !(g.equipment && g.equipment.horse)) html += '<button class="btn btn-small" onclick="buyHorse(\'' + key + '\')">Купить</button>';
        html += '</span></div>';
    }
    html += '</div>';
    html += '<button class="btn btn-secondary" onclick="document.getElementById(\'modal-stable\').classList.add(\'hide\')">Закрыть</button>';
    content.innerHTML = html;
    document.getElementById('modal-stable').classList.remove('hide');
}

function buyHorse(type) {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    const horse = HORSE_TYPES[type];
    if (g.equipment && g.equipment.horse) { setMessage('❌ У вас уже есть лошадь.'); return; }
    if (!spendMoney(g, horse.price * 210 * 56)) { setMessage('❌ Недостаточно денег.'); return; }
    
    g.equipment.horse = { horseType:type, name:horse.name, hp:horse.hp, maxHp:horse.hp };
    horseMarket[type].sold++;
    saveHorseMarket();
    setMessage('✅ Вы купили ' + horse.name + '!');
    updateMenu(); saveData(); openStable();
}

function sellHorse() {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    if (!g.equipment || !g.equipment.horse) return;
    const ht = HORSE_TYPES[g.equipment.horse.horseType];
    g.copper += Math.floor(ht.price * 0.5);
    convertCurrency(g);
    g.equipment.horse = null;
    setMessage('💰 Лошадь продана.');
    updateMenu(); saveData(); openStable();
}

// ============================================================
// ВЕЛИКАЯ СЕПТА
// ============================================================
function openTemple() {
    const modal = document.getElementById('modal-temple');
    if (!modal) {
        const overlay = document.createElement('div');
        overlay.id = 'modal-temple';
        overlay.className = 'modal-overlay hide';
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>⛪ ВЕЛИКАЯ СЕПТА</h3><button class="close-btn" onclick="document.getElementById(\'modal-temple\').classList.add(\'hide\')">✕</button></div><div id="modal-temple-content"></div></div>';
        document.body.appendChild(overlay);
    }
    const content = document.getElementById('modal-temple-content');
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    
    let html = '<div class="modal-section"><h4>⛪ СЕПТА</h4>';
    html += '<p>💰 ' + formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper) + '</p>';
    
    const potions = [
        { id:'health_small', name:'🧪 Малое зелье', price:30, hp:20 },
        { id:'health_medium', name:'🧪 Среднее зелье', price:80, hp:50 },
        { id:'health_large', name:'🧪 Большое зелье', price:150, hp:100 }
    ];
    html += '<h4>🧪 ЗЕЛЬЯ</h4>';
    potions.forEach(function(p) {
        html += '<div class="row"><span class="label">' + p.name + ' (+' + p.hp + ' HP)</span><span class="value">' + formatCurrency(p.price) + ' <button class="btn btn-small" onclick="buyPotion(\'' + p.id + '\',' + p.price + ',' + p.hp + ')">Купить</button></span></div>';
    });
    
    html += '<h4>💉 ИСЦЕЛЕНИЕ</h4>';
    const maxHp = getMaxHp(g);
    if (g.hp >= maxHp) html += '<p style="color:#7ac98a;">✅ Вы здоровы!</p>';
    else html += '<button class="btn" onclick="freeHeal()">💉 Исцелиться (бесплатно, раз в 2ч)</button>';
    
    html += '<h4>🙏 МОЛИТВА</h4>';
    if (g.blessing && g.blessing.active && g.blessing.expires > Date.now()) {
        html += '<p style="color:#7ac98a;">✅ Благословение активно!</p>';
    } else {
        html += '<button class="btn" onclick="prayForBlessing()">🙏 Помолиться (+10% XP, 1ч)</button>';
    }
    html += '</div>';
    html += '<button class="btn btn-secondary" onclick="document.getElementById(\'modal-temple\').classList.add(\'hide\')">Закрыть</button>';
    content.innerHTML = html;
    document.getElementById('modal-temple').classList.remove('hide');
}

function buyPotion(id, price, hp) {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    if (!spendMoney(g, price)) { setMessage('❌ Недостаточно денег.'); return; }
    g.hp = Math.min(g.maxHp, g.hp + hp);
    setMessage('✅ Вы выпили зелье! +' + hp + ' HP');
    updateMenu(); saveData(); openTemple();
}

function freeHeal() {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    const now = Date.now();
    if (g.lastHeal && (now - g.lastHeal) < 7200000) { setMessage('⏳ Исцеление недоступно.'); return; }
    g.hp = getMaxHp(g);
    g.lastHeal = now;
    setMessage('💉 Вы исцелены!');
    updateMenu(); saveData(); openTemple();
}

function prayForBlessing() {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    const now = Date.now();
    if (g.lastPrayer && (now - g.lastPrayer) < 86400000) { setMessage('⏳ Молитва недоступна.'); return; }
    g.lastPrayer = now;
    g.blessing = { active:true, expires:now + 3600000 };
    setMessage('🙏 Благословение получено! +10% XP на 1 час.');
    saveData(); openTemple();
}

// ============================================================
// ПОРТ
// ============================================================
function openPort() {
    const modal = document.getElementById('modal-port');
    if (!modal) {
        const overlay = document.createElement('div');
        overlay.id = 'modal-port';
        overlay.className = 'modal-overlay hide';
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>⛵ ПОРТ</h3><button class="close-btn" onclick="document.getElementById(\'modal-port\').classList.add(\'hide\')">✕</button></div><div id="modal-port-content"></div></div>';
        document.body.appendChild(overlay);
    }
    const content = document.getElementById('modal-port-content');
    let html = '<div class="modal-section"><h4>⛵ ПОРТ</h4>';
    html += '<p style="color:#6a5a48;">🚧 Путешествия между городами скоро появятся.</p>';
    for (let city in PORT_CITIES) {
        const data = PORT_CITIES[city];
        html += '<div class="row"><span class="label">' + data.emoji + ' ' + city + '</span><span class="value">' + data.region + '</span></div>';
    }
    html += '</div>';
    html += '<button class="btn btn-secondary" onclick="document.getElementById(\'modal-port\').classList.add(\'hide\')">Закрыть</button>';
    content.innerHTML = html;
    document.getElementById('modal-port').classList.remove('hide');
}

// ============================================================
// ТЮРЬМА
// ============================================================
function enterJail() {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    g.jail = { enterTime:Date.now() };
    g.location.place = 'Тюрьма';
    g.location.location = 'Королевская Гавань';
    g.outside = false;
    setMessage('⛓️ Вас арестовали!');
    updateMenu(); updateStory(); updateActions(); saveData();
}

function payJailFine() {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    if (!spendMoney(g, 1 * 210 * 56)) { setMessage('❌ Недостаточно золота (1 зол.)'); return; }
    g.jail = null;
    g.location.place = 'Таверна';
    g.location.location = 'Королевская Гавань';
    setMessage('💰 Вы оплатили штраф и вышли!');
    updateMenu(); updateStory(); updateActions(); saveData();
}

function waitJailTime() {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    startBusy('В тюрьме', 5, function() {
        g.jail = null;
        g.location.place = 'Таверна';
        g.location.location = 'Королевская Гавань';
        setMessage('⛓️ Вы освободились!');
        updateMenu(); updateStory(); updateActions(); saveData();
    });
}

function attemptEscape() {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    if (Math.random() * 100 < 10) {
        g.jail = null;
        g.location.place = 'Таверна';
        g.location.location = 'Королевская Гавань';
        setMessage('🏃 Вы сбежали!');
    } else {
        setMessage('⛓️ Побег не удался!');
    }
    updateMenu(); updateStory(); updateActions(); saveData();
}

// ============================================================
// РЫНОК
// ============================================================
function openMarket() {
    const modal = document.getElementById('modal-market');
    if (!modal) {
        const overlay = document.createElement('div');
        overlay.id = 'modal-market';
        overlay.className = 'modal-overlay hide';
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🏪 РЫНОК</h3><button class="close-btn" onclick="document.getElementById(\'modal-market\').classList.add(\'hide\')">✕</button></div><div id="modal-market-content"></div></div>';
        document.body.appendChild(overlay);
    }
    const content = document.getElementById('modal-market-content');
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    
    let html = '<div class="modal-section"><h4>🏪 РЫНОК</h4>';
    if (g.marketStall && g.marketStall.owned) {
        html += '<p>✅ Ваша лавка #' + g.marketStall.stallId + '</p>';
        html += '<button class="btn" onclick="enterStall(' + g.marketStall.stallId + ')">📦 Войти в лавку</button>';
    } else {
        html += '<p style="color:#6a5a48;">У вас нет лавки.</p>';
    }
    html += '</div>';
    html += '<button class="btn btn-secondary" onclick="document.getElementById(\'modal-market\').classList.add(\'hide\')">Закрыть</button>';
    content.innerHTML = html;
    document.getElementById('modal-market').classList.remove('hide');
}

function enterStall(stallId) {
    const stall = marketStalls[stallId];
    if (!stall) return;
    const modal = document.getElementById('modal-stall');
    if (!modal) {
        const overlay = document.createElement('div');
        overlay.id = 'modal-stall';
        overlay.className = 'modal-overlay hide';
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🏪 ЛАВКА</h3><button class="close-btn" onclick="document.getElementById(\'modal-stall\').classList.add(\'hide\')">✕</button></div><div id="modal-stall-content"></div></div>';
        document.body.appendChild(overlay);
    }
    const content = document.getElementById('modal-stall-content');
    let html = '<div class="modal-section"><h4>🏪 ЛАВКА #' + stallId + '</h4>';
    html += '<p>👤 ' + stall.owner + '</p>';
    if (stall.inventory && stall.inventory.length > 0) {
        stall.inventory.forEach(function(item, i) {
            html += '<div class="row"><span class="label">' + item.name + '</span><span class="value">' + formatCurrency(stall.prices[i] || 0) + '</span></div>';
        });
    } else {
        html += '<p style="color:#6a5a48;">Пусто.</p>';
    }
    html += '</div>';
    html += '<button class="btn" onclick="document.getElementById(\'modal-stall\').classList.add(\'hide\')">Закрыть</button>';
    content.innerHTML = html;
    document.getElementById('modal-stall').classList.remove('hide');
}

// ============================================================
// БИБЛИОТЕКА
// ============================================================
function openLibrary() {
    const modal = document.getElementById('modal-library');
    if (!modal) {
        const overlay = document.createElement('div');
        overlay.id = 'modal-library';
        overlay.className = 'modal-overlay hide';
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📚 БИБЛИОТЕКА</h3><button class="close-btn" onclick="document.getElementById(\'modal-library\').classList.add(\'hide\')">✕</button></div><div id="modal-library-content"></div></div>';
        document.body.appendChild(overlay);
    }
    const content = document.getElementById('modal-library-content');
    let html = '<div class="modal-section"><h4>📚 БИБЛИОТЕКА МЕЙСТЕРОВ</h4>';
    html += '<p style="color:#6a5a48;">📖 Книги для прокачки.</p>';
    html += '<div class="row"><span class="label">📖 Искусство войны (ур.1)</span><span class="value">100 МП <button class="btn btn-small" onclick="buyBook(1,50,100)">Купить</button></span></div>';
    html += '<div class="row"><span class="label">📖 Искусство войны (ур.5)</span><span class="value">200 МП <button class="btn btn-small" onclick="buyBook(5,100,200)">Купить</button></span></div>';
    html += '</div>';
    html += '<button class="btn btn-secondary" onclick="document.getElementById(\'modal-library\').classList.add(\'hide\')">Закрыть</button>';
    content.innerHTML = html;
    document.getElementById('modal-library').classList.remove('hide');
}

function buyBook(level, xp, price) {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    if (!spendMoney(g, price)) { setMessage('❌ Недостаточно денег.'); return; }
    g.xp += xp;
    while (g.xp >= g.nextLevelXp) { g.xp -= g.nextLevelXp; g.level++; g.nextLevelXp = 100 + g.level * 10; if (g.level <= 100) g.attributePoints++; }
    setMessage('📖 Вы прочитали книгу! +' + xp + ' XP');
    updateMenu(); saveData(); openLibrary();
}

// ============================================================
// ГИЛЬДИЯ НАЁМНИКОВ
// ============================================================
function openGuildHall() {
    const modal = document.getElementById('modal-guildhall');
    if (!modal) {
        const overlay = document.createElement('div');
        overlay.id = 'modal-guildhall';
        overlay.className = 'modal-overlay hide';
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🗡️ ГИЛЬДИЯ НАЁМНИКОВ</h3><button class="close-btn" onclick="document.getElementById(\'modal-guildhall\').classList.add(\'hide\')">✕</button></div><div id="modal-guildhall-content"></div></div>';
        document.body.appendChild(overlay);
    }
    const content = document.getElementById('modal-guildhall-content');
    let html = '<div class="modal-section"><h4>🗡️ ГИЛЬДИЯ НАЁМНИКОВ</h4>';
    html += '<p style="color:#6a5a48;">Ежедневные задания.</p>';
    html += '<div class="row"><span class="label">🐀 Крысиная охота</span><span class="value">50 МП <button class="btn btn-small" onclick="setMessage(\'📋 Задание взято!\')">Взять</button></span></div>';
    html += '</div>';
    html += '<button class="btn btn-secondary" onclick="document.getElementById(\'modal-guildhall\').classList.add(\'hide\')">Закрыть</button>';
    content.innerHTML = html;
    document.getElementById('modal-guildhall').classList.remove('hide');
}

// ============================================================
// БОРДЕЛЬ
// ============================================================
function openBrothel() {
    const modal = document.getElementById('modal-brothel');
    if (!modal) {
        const overlay = document.createElement('div');
        overlay.id = 'modal-brothel';
        overlay.className = 'modal-overlay hide';
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>💃 БОРДЕЛЬ</h3><button class="close-btn" onclick="document.getElementById(\'modal-brothel\').classList.add(\'hide\')">✕</button></div><div id="modal-brothel-content"></div></div>';
        document.body.appendChild(overlay);
    }
    const content = document.getElementById('modal-brothel-content');
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    
    let html = '<div class="modal-section"><h4>💃 БОРДЕЛЬ</h4>';
    html += '<p>💰 ' + formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper) + ' | 😴 ' + g.fatigue + '/100</p>';
    
    const services = [
        { id:'rest', name:'🛏️ Отдых', price:20, fatigue:50, hp:10 },
        { id:'wine', name:'🍷 Вино', price:50, fatigue:30, hp:5 },
        { id:'vip', name:'👑 VIP', price:200, fatigue:80, hp:20 }
    ];
    services.forEach(function(s) {
        html += '<div class="row"><span class="label">' + s.name + ' (+' + s.fatigue + ' уст., +' + s.hp + ' HP)</span>';
        html += '<span class="value">' + formatCurrency(s.price) + ' <button class="btn btn-small" onclick="useBrothelService(' + s.price + ',' + s.fatigue + ',' + s.hp + ')">Взять</button></span></div>';
    });
    html += '</div>';
    html += '<button class="btn btn-secondary" onclick="document.getElementById(\'modal-brothel\').classList.add(\'hide\')">Закрыть</button>';
    content.innerHTML = html;
    document.getElementById('modal-brothel').classList.remove('hide');
}

function useBrothelService(price, fatigue, hp) {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    if (!spendMoney(g, price)) { setMessage('❌ Недостаточно денег.'); return; }
    g.fatigue = Math.min(100, g.fatigue + fatigue);
    if (hp > 0) g.hp = Math.min(g.maxHp, g.hp + hp);
    setMessage('✅ Отдых +' + fatigue + ' уст., +' + hp + ' HP');
    updateMenu(); saveData(); openBrothel();
}

// ============================================================
// МАГИСТРАТ И ЖИЛЬЁ
// ============================================================
function openMagistrate() {
    const modal = document.getElementById('modal-magistrate');
    if (!modal) {
        const overlay = document.createElement('div');
        overlay.id = 'modal-magistrate';
        overlay.className = 'modal-overlay hide';
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📜 МАГИСТРАТ</h3><button class="close-btn" onclick="document.getElementById(\'modal-magistrate\').classList.add(\'hide\')">✕</button></div><div id="modal-magistrate-content"></div></div>';
        document.body.appendChild(overlay);
    }
    const content = document.getElementById('modal-magistrate-content');
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    
    let html = '<div class="modal-section"><h4>📜 МАГИСТРАТ</h4>';
    if (g.housing && g.housing.type) {
        const house = HOUSING_TYPES[g.housing.type];
        html += '<p>🏠 ' + house.name + ' | 📍 ' + house.district + '</p>';
        html += '<button class="btn btn-danger" onclick="sellHouse()">🏚️ Продать</button>';
    } else {
        html += '<p style="color:#6a5a48;">У вас нет жилья.</p>';
        for (let key in HOUSING_TYPES) {
            const h = HOUSING_TYPES[key];
            const available = housingMarket[key].total - housingMarket[key].occupied;
            html += '<div class="row"><span class="label">' + h.emoji + ' ' + h.name + ' (' + available + ')</span>';
            html += '<span class="value">' + h.price + ' зол. <button class="btn btn-small" onclick="buyHouse(\'' + key + '\')">Купить</button></span></div>';
        }
    }
    html += '</div>';
    html += '<button class="btn btn-secondary" onclick="document.getElementById(\'modal-magistrate\').classList.add(\'hide\')">Закрыть</button>';
    content.innerHTML = html;
    document.getElementById('modal-magistrate').classList.remove('hide');
}

function buyHouse(type) {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    const house = HOUSING_TYPES[type];
    if (g.housing && g.housing.type) { setMessage('❌ У вас уже есть жильё.'); return; }
    if (!spendMoney(g, house.price * 210 * 56)) { setMessage('❌ Недостаточно денег.'); return; }
    
    g.housing = { type:type, purchased:Date.now(), rentPaid:Date.now(), rentDays:1, debt:0, storage:[], storageHold:[] };
    housingMarket[type].occupied++;
    saveHousingMarket();
    setMessage('✅ Вы купили ' + house.name + '!');
    updateMenu(); saveData(); openMagistrate();
}

function sellHouse() {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    if (!g.housing || !g.housing.type) return;
    const house = HOUSING_TYPES[g.housing.type];
    housingMarket[g.housing.type].occupied = Math.max(0, housingMarket[g.housing.type].occupied - 1);
    saveHousingMarket();
    g.copper += Math.floor(house.price * 0.6);
    convertCurrency(g);
    g.housing = { type:null, purchased:null, rentPaid:null, rentDays:0, debt:0, storage:[], storageHold:[] };
    setMessage('💰 Жильё продано.');
    updateMenu(); saveData(); openMagistrate();
}

function enterHome() {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    if (!g.housing || !g.housing.type) { setMessage('❌ У вас нет дома.'); return; }
    g.location.place = 'Дом';
    g.location.location = 'Королевская Гавань';
    setMessage('🏠 Вы вошли в свой дом.');
    updateMenu(); updateStory(); updateActions(); saveData();
}

function restAtHome() {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    if (!g.housing || !g.housing.type) return;
    const house = HOUSING_TYPES[g.housing.type];
    g.hp = Math.min(g.maxHp, g.hp + house.restHp);
    g.fatigue = Math.min(100, g.fatigue + house.restFatigue);
    setMessage('🛏️ Вы отдохнули дома!');
    updateMenu(); saveData();
}

function viewDistrict(district) {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    const districtMap = { 'Королевский квартал':['mansion','townhouse'], 'Торговый квартал':['house','room'], 'Квартал бедноты':['night'] };
    const types = districtMap[district];
    if (!types) return;
    let msg = '📍 ' + district + '\n\n';
    types.forEach(function(type) {
        const h = HOUSING_TYPES[type];
        const available = housingMarket[type].total - housingMarket[type].occupied;
        msg += h.emoji + ' ' + h.name + ' — ' + h.price + ' зол. (' + (available > 0 ? available + ' своб.' : '❌ РАСПРОДАНО') + ')\n';
    });
    setMessage(msg);
}

function checkRent() {
    const user = users[currentUser]; if (!user) return;
    const g = user.game;
    if (!g.housing || !g.housing.type) return;
    const timeLeft = getTimeLeft(g.housing.rentPaid, g.housing.rentDays || 1);
    if (timeLeft.expired) {
        housingMarket[g.housing.type].occupied = Math.max(0, housingMarket[g.housing.type].occupied - 1);
        saveHousingMarket();
        g.housing = { type:null, purchased:null, rentPaid:null, rentDays:0, debt:0, storage:[], storageHold:[] };
        setMessage('🚪 Вас выселили за неуплату!');
    }
}

function checkStallRent() {}
function getActiveDiceGames() { return []; }
// ============================================================
// ЗАПУСК ИГРЫ
// ============================================================
loadData();
var savedUser = localStorage.getItem('got_user');
if (savedUser && users[savedUser]) {
    currentUser = savedUser;
    enterGame(savedUser);
} else {
    showPage('login');
}

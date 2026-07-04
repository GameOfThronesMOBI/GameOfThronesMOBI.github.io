// ============================================================
// MAIN.JS — ТОЧКА ВХОДА (МИНИМАЛЬНЫЙ)
// Только регистрация и вход. Город в regions/crownlands/
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
    
    // НЕ ПЕРЕХОДИМ В ИГРУ — ждём, пока появится контент из regions/
    // setTimeout(function() { enterGame(name); }, 1200);
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
// ВХОД В ИГРУ (заглушка — не падает)
// ============================================================
function enterGame(name) {
    showPage('game');
    
    // Обновляем меню (без модулей — просто показываем что есть)
    const user = users[name];
    if (!user) return;
    user.game.online = true;
    
    document.getElementById('menu-location').textContent = 'Таверна 🏰';
    document.getElementById('menu-hp').textContent = '60';
    document.getElementById('menu-hp-max').textContent = '60';
    document.getElementById('menu-level').textContent = '1';
    document.getElementById('menu-gold').textContent = '100';
    document.getElementById('menu-silver').textContent = '0';
    document.getElementById('menu-copper').textContent = '0';
    document.getElementById('menu-food').textContent = '100';
    document.getElementById('menu-thirst').textContent = '100';
    document.getElementById('menu-fatigue').textContent = '100';
    document.getElementById('story-title').textContent = '📍 Таверна';
    document.getElementById('story-text').textContent = '🚧 Контент локации загружается...';
    
    // Кнопки-заглушки
    const container = document.getElementById('actions-container');
    container.innerHTML = '';
    const actions = [
        { id: 'inventory', label: '🎒 Инвентарь' },
        { id: 'character', label: '👤 Персонаж' },
        { id: 'menu', label: '📋 Меню' },
        { id: 'refresh', label: '🔄 Обновить' }
    ];
    actions.forEach(a => {
        const btn = document.createElement('button');
        btn.className = 'btn-game';
        btn.textContent = a.label;
        btn.onclick = function() { setMessage('🚧 Функция в разработке'); };
        container.appendChild(btn);
    });
    
    saveData();
}

// ============================================================
// ЗАГЛУШКИ (чтоб не падало)
// ============================================================
function updateMenu() {}
function updateStory() {}
function updateActions() {}
function gameAction(action) { setMessage('🚧 Функция в разработке'); }
function startBusy() {}
function handleDeath() {}
function getMaxHp() { return 60; }
function startResourceSystem() {}
function startAutoSave() {}
function updateOnline() {}
function handleLogout() {
    if (currentUser && users[currentUser]) {
        users[currentUser].game.online = false;
        saveData();
    }
    localStorage.removeItem('got_user');
    currentUser = null;
    showPage('login');
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

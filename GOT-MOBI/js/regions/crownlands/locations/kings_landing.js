// ============================================================
// js/regions/crownlands/locations/kings_landing.js
// КОРОЛЕВСКАЯ ГАВАНЬ — ПОЛНАЯ ЛОГИКА
// ============================================================

// ============================================================
// 1. КАРТА ГАВАНИ
// ============================================================

function openMap() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    
    var modal = document.getElementById('modal-map');
    var content = document.getElementById('modal-map-content');
    
    var html = '<div class="modal-section"><h4>📍 ' + g.location.place + '</h4></div>';
    html += '<div class="modal-section">';
    
    for (var i = 0; i < BUILDINGS.length; i++) {
        var b = BUILDINGS[i];
        var isCurrent = b.id === g.location.place;
        
        if (g.outside && b.id !== 'Дорога' && b.id !== 'Ворота') continue;
        if (!g.outside && b.id === 'Дорога') continue;
        
        html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
        html += '<span class="label">' + b.label + (isCurrent ? ' ⭐' : '') + '</span>';
        if (!isCurrent) {
            html += '<span class="value"><button class="btn btn-small" onclick="goToBuilding(\'' + b.id + '\')">🚶 Идти</button></span>';
        } else {
            html += '<span class="value" style="color:#6a5a48;">Вы здесь</span>';
        }
        html += '</div>';
    }
    
    html += '</div><button class="btn" onclick="closeMap()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeMap() {
    document.getElementById('modal-map').classList.add('hide');
}

// ============================================================
// 2. ПЕРЕМЕЩЕНИЕ
// ============================================================

function goToBuilding(building) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (isBusy) { setMessage('⏳ Вы заняты.'); return; }
    if (building === g.location.place) { setMessage('📍 Вы уже здесь.'); return; }
    
    var exists = false;
    for (var i = 0; i < BUILDINGS.length; i++) {
        if (BUILDINGS[i].id === building) { exists = true; break; }
    }
    if (!exists) { setMessage('❌ Здание не найдено.'); return; }
    
    g.location.place = building;
    g.location.location = 'Королевская Гавань';
    
    if (building === 'Дорога') {
        g.outside = true;
        g.location.location = 'Дорога';
        setMessage('🛤️ Вы вышли на тракт.');
    } else if (building === 'Ворота') {
        g.outside = false;
        setMessage('🚪 Вы у Ворот.');
    } else {
        g.outside = false;
        setMessage('✅ Вы прибыли в ' + building + '.');
    }
    
    closeMap();
    updateMenu();
    updateStory();
    updateActions();
    saveData();
}

// ============================================================
// 3. STORY И ACTIONS
// ============================================================

function updateStory() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    var place = g.location.place;
    
    var titleEl = document.getElementById('story-title');
    var textEl = document.getElementById('story-text');
    
    if (titleEl) {
        titleEl.textContent = '📍 ' + place + ' (ур.' + (LOCATION_LEVELS[place] || 1) + ')';
    }
    
    var texts = {
        'Таверна': '🍺 Добро пожаловать в таверну!',
        'Рынок': '🏪 Центральный рынок.',
        'Кузница': '⚒️ Вы в кузнице.',
        'Оружейная лавка': '🗡️ Оружейная лавка.',
        'Кожевник': '🪡 Кожевник.',
        'Бронник': '🛡️ Бронник.',
        'Плотник': '🪵 Плотник.',
        'Конюшня': '🐴 Конюшня.',
        'Гильдия торговцев': '🏛️ Гильдия торговцев.',
        'Магистрат': '📜 Магистрат.',
        'Ворота': '🚪 Городские ворота.',
        'Королевский квартал': '👑 Королевский квартал.',
        'Торговый квартал': '🏙️ Торговый квартал.',
        'Квартал бедноты': '🏚️ Квартал бедноты.',
        'Дом': '🏠 Ваш дом.',
        'Великая септа': '⛪ Великая Септа.',
        'Порт': '⛵ Порт.',
        'Тюрьма': '⛓️ Тюрьма.',
        'Дорога': '🛤️ Королевский тракт.',
        'Библиотека мейстеров': '📚 Библиотека.',
        'Гильдия наёмников': '🗡️ Гильдия наёмников.',
        'Бордель': '💃 Бордель.'
    };
    
    if (textEl) {
        textEl.textContent = texts[place] || 'Вы в ' + place + '.';
    }
    
    updateActions();
}

function updateActions() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    var place = g.location.place;
    var container = document.getElementById('actions-container');
    if (!container) return;
    
    container.innerHTML = '';
    var actions = [];
    
    actions.push({ id: 'inventory', label: '🎒 Инвентарь' });
    actions.push({ id: 'character', label: '👤 Персонаж' });
    actions.push({ id: 'menu', label: '📋 Меню' });
    actions.push({ id: 'map', label: '🗺️ Карта' });
    
    if (place === 'Таверна') {
        actions = [
            { id: 'tavern_eat', label: '🍞 Попросить еды' },
            { id: 'tavern_buy', label: '🛒 Торговля' },
            { id: 'wash', label: '🧹 Помыть посуду' },
            { id: 'sweep', label: '🧹 Подмести пол' },
            { id: 'rest', label: '🛏️ Отдохнуть' },
            { id: 'talk', label: '🗣️ Поговорить' }
        ].concat(actions);
    }
    
    if (place === 'Рынок') {
        actions = [{ id: 'market_stalls', label: '🏪 Рынок' }].concat(actions);
    }
    
    if (place === 'Кузница') {
        actions = [
            { id: 'shop_resources', label: '⚒️ Кузница' },
            { id: 'craft', label: '🔨 Крафт' }
        ].concat(actions);
    }
    
    if (place === 'Оружейная лавка') {
        actions = [{ id: 'shop_weapons', label: '🗡️ Оружейная' }].concat(actions);
    }
    
    if (place === 'Кожевник') {
        actions = [{ id: 'shop_leather', label: '🪡 Кожевник' }].concat(actions);
    }
    
    if (place === 'Бронник') {
        actions = [{ id: 'shop_plate', label: '🛡️ Бронник' }].concat(actions);
    }
    
    if (place === 'Плотник') {
        actions = [{ id: 'shop_bows', label: '🪵 Плотник' }].concat(actions);
    }
    
    if (place === 'Конюшня') {
        actions = [
            { id: 'stable_buy', label: '🐴 Купить' },
            { id: 'stable_sell', label: '💰 Продать' }
        ].concat(actions);
    }
    
    if (place === 'Гильдия торговцев') {
        actions = [
            { id: 'auction_list', label: '🏛️ Аукцион' },
            { id: 'auction_my', label: '📦 Мои лоты' },
            { id: 'auction_sell', label: '💰 Выставить' }
        ].concat(actions);
    }
    
    if (place === 'Магистрат') {
        actions = [{ id: 'magistrate_open', label: '📜 Магистрат' }].concat(actions);
    }
    
    if (place === 'Ворота') {
        if (!g.outside) {
            actions = [{ id: 'leave_city', label: '🚪 Выйти' }].concat(actions);
        } else {
            actions = [{ id: 'enter_city', label: '🚶 Войти' }].concat(actions);
        }
    }
    
    if (place === 'Дорога') {
        actions = [
            { id: 'enter_city', label: '🚶 Войти' },
            { id: 'search', label: '🔍 Поиск' }
        ].concat(actions);
    }
    
    if (place === 'Королевский квартал' || place === 'Торговый квартал' || place === 'Квартал бедноты') {
        var hasHouse = g.housing && g.housing.type && HOUSING_TYPES[g.housing.type] && HOUSING_TYPES[g.housing.type].district === place;
        if (hasHouse) {
            actions = [{ id: 'housing_enter', label: '🏠 Домой' }].concat(actions);
        } else {
            actions = [{ id: 'housing_view', label: '🏠 Купить' }].concat(actions);
        }
    }
    
    if (place === 'Дом') {
        actions = [
            { id: 'home_rest', label: '🛏️ Отдохнуть' },
            { id: 'home_storage', label: '📦 Склад' },
            { id: 'home_leave', label: '🚪 Выйти' }
        ].concat(actions);
    }
    
    if (place === 'Великая септа') {
        actions = [
            { id: 'temple_heal', label: '💉 Исцеление' },
            { id: 'temple_bless', label: '🙏 Молитва' },
            { id: 'temple_luck', label: '🍀 Удача' }
        ].concat(actions);
    }
    
    if (place === 'Порт') {
        actions = [{ id: 'port_travel', label: '⛵ Порт' }].concat(actions);
    }
    
    if (place === 'Тюрьма') {
        actions = [
            { id: 'jail_pay', label: '💰 Штраф' },
            { id: 'jail_wait', label: '⏳ Ждать' },
            { id: 'jail_escape', label: '🏃 Сбежать' }
        ].concat(actions);
    }
    
    if (place === 'Библиотека мейстеров') {
        actions = [
            { id: 'library_buy', label: '📚 Купить' },
            { id: 'library_read', label: '📖 Читать' }
        ].concat(actions);
    }
    
    if (place === 'Гильдия наёмников') {
        actions = [
            { id: 'quest_take', label: '📋 Взять' },
            { id: 'quest_abandon', label: '❌ Отказаться' }
        ].concat(actions);
    }
    
    if (place === 'Бордель') {
        actions = [
            { id: 'brothel_rest', label: '🛏️ Отдых' },
            { id: 'brothel_dice', label: '🎲 Кости' }
        ].concat(actions);
    }
    
    for (var i = 0; i < actions.length; i++) {
        var a = actions[i];
        var btn = document.createElement('button');
        btn.className = 'btn-game';
        btn.textContent = a.label;
        btn.onclick = (function(actionId) {
            return function() {
                if (typeof gameAction === 'function') {
                    gameAction(actionId);
                }
            };
        })(a.id);
        container.appendChild(btn);
    }
}

// ============================================================
// 4. ДОМА
// ============================================================

function buyHouse(type) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var house = HOUSING_TYPES[type];
    if (!house) { setMessage('❌ Такого жилья нет.'); return; }
    if (g.housing && g.housing.type) { setMessage('❌ У вас уже есть жильё!'); return; }
    
    var market = housingMarket[type];
    if (!market || market.occupied >= market.total) {
        setMessage('❌ Все ' + house.name + ' проданы!');
        return;
    }
    
    if (!spendMoney(g, house.price * 210 * 56)) {
        setMessage('❌ Недостаточно денег! Нужно: ' + house.price + ' зол.');
        return;
    }
    
    if (!g.housing) {
        g.housing = { type: null, purchased: null, rentPaid: null, rentDays: 0, debt: 0, storage: [], storageHold: [] };
    }
    
    g.housing.type = type;
    g.housing.purchased = Date.now();
    g.housing.rentPaid = Date.now();
    g.housing.rentDays = 1;
    g.housing.debt = 0;
    if (!g.housing.storage) g.housing.storage = [];
    if (!g.housing.storageHold) g.housing.storageHold = [];
    
    market.occupied++;
    saveHousingMarket();
    saveData();
    
    setMessage('✅ Вы купили ' + house.name + '!');
    addLog('🏠 ' + currentUser + ' купил ' + house.name);
    updateMenu();
    updateActions();
}

function sellHouse() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.housing || !g.housing.type) { setMessage('❌ У вас нет жилья.'); return; }
    
    var house = HOUSING_TYPES[g.housing.type];
    var refund = Math.floor(house.price * 0.6);
    g.copper += refund;
    convertCurrency(g);
    
    if (g.housing.storage && g.housing.storage.length > 0) {
        if (!g.housing.storageHold) g.housing.storageHold = [];
        g.housing.storageHold = g.housing.storageHold.concat(g.housing.storage);
        g.housing.storage = [];
    }
    
    var market = housingMarket[g.housing.type];
    if (market) market.occupied = Math.max(0, market.occupied - 1);
    saveHousingMarket();
    
    g.housing.type = null;
    g.housing.debt = 0;
    g.housing.rentPaid = null;
    g.housing.rentDays = 0;
    
    saveData();
    setMessage('🏚️ Вы продали ' + house.name + ' за ' + refund + ' зол.');
    addLog('💰 ' + currentUser + ' продал ' + house.name);
    updateMenu();
    updateActions();
}

function payRent() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.housing || !g.housing.type) { setMessage('❌ У вас нет жилья!'); return; }
    
    var house = HOUSING_TYPES[g.housing.type];
    var currentDays = g.housing.rentDays || 0;
    var totalDays = currentDays + 7;
    
    if (totalDays > 28) {
        setMessage('⏳ Вы оплатили 4 недели вперёд.');
        return;
    }
    
    if (!spendMoney(g, house.rent * 210 * 56)) {
        setMessage('❌ Недостаточно денег! Нужно: ' + house.rent + ' зол.');
        return;
    }
    
    g.housing.rentDays = (g.housing.rentDays || 0) + 7;
    g.housing.rentPaid = Date.now();
    
    saveData();
    setMessage('✅ Аренда оплачена на неделю!');
    addLog('💰 ' + currentUser + ' оплатил аренду');
    updateMenu();
    updateActions();
}

function checkRent() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    if (!g.housing || !g.housing.type) return;
    
    var timeLeft = getTimeLeft(g.housing.rentPaid, g.housing.rentDays || 1);
    if (timeLeft.expired) {
        evictFromHousing();
        setMessage('🚪 Дом конфискован за неуплату!');
    }
}

function evictFromHousing() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    if (!g.housing || !g.housing.type) return;
    
    var house = HOUSING_TYPES[g.housing.type];
    var market = housingMarket[g.housing.type];
    if (market) market.occupied = Math.max(0, market.occupied - 1);
    saveHousingMarket();
    
    if (g.housing.storage && g.housing.storage.length > 0) {
        if (!confiscatedItems) confiscatedItems = [];
        confiscatedItems.push({
            owner: currentUser,
            items: g.housing.storage,
            confiscatedAt: Date.now(),
            type: 'house'
        });
        g.housing.storage = [];
        saveData();
    }
    
    g.housing.type = null;
    g.housing.rentDays = 0;
    g.housing.rentPaid = null;
    g.housing.debt = 0;
    
    saveData();
    setMessage('💀 Вас выселили из ' + house.name);
    addLog('💀 ' + currentUser + ' выселен');
    updateMenu();
    updateActions();
}

// ============================================================
// 5. СКЛАД
// ============================================================

function openStorage() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.housing || !g.housing.type) { setMessage('❌ У вас нет жилья!'); return; }
    
    var house = HOUSING_TYPES[g.housing.type];
    var storage = g.housing.storage || [];
    
    var msg = '📦 СКЛАД (' + house.name + ')\n';
    msg += 'Свободно: ' + ((house.storageSlots || 10) - storage.length) + '/' + house.storageSlots + '\n\n';
    
    if (storage.length === 0) {
        msg += '📭 Пусто';
    } else {
        storage.forEach(function(item, i) {
            var quality = item.quality || 'Обычное';
            var countDisplay = '';
            if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
            msg += (i + 1) + '. ' + item.name + ' (' + quality + ')' + countDisplay + '\n';
        });
    }
    
    var action = prompt(msg + '\n\n1. Положить\n2. Забрать\n0. Выйти');
    
    if (action === '1') { moveToStorage(); }
    else if (action === '2') {
        var idx = prompt('Номер:');
        var index = parseInt(idx) - 1;
        if (!isNaN(index) && index >= 0 && index < storage.length) {
            takeFromStorage(index);
        }
    }
}

function moveToStorage() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.housing || !g.housing.type) { setMessage('❌ У вас нет жилья!'); return; }
    
    var house = HOUSING_TYPES[g.housing.type];
    var storage = g.housing.storage || [];
    
    if (storage.length >= house.storageSlots) { setMessage('❌ Склад переполнен!'); return; }
    if (g.inventory.length === 0) { setMessage('❌ Инвентарь пуст!'); return; }
    
    var choices = 'Выберите предмет:\n';
    g.inventory.forEach(function(item, i) {
        var countDisplay = '';
        if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
        choices += (i + 1) + '. ' + item.name + ' (' + (item.quality || 'Обычное') + ')' + countDisplay + '\n';
    });
    
    var choice = prompt(choices);
    var index = parseInt(choice) - 1;
    if (isNaN(index) || index < 0 || index >= g.inventory.length) {
        setMessage('❌ Отменено.');
        return;
    }
    
    var item = g.inventory.splice(index, 1)[0];
    if (!g.housing.storage) g.housing.storage = [];
    g.housing.storage.push(item);
    
    setMessage('✅ Вы положили ' + item.name + ' на склад.');
    saveData();
    updateMenu();
}

function takeFromStorage(index) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.housing || !g.housing.storage) { setMessage('❌ Склад пуст.'); return; }
    if (index >= g.housing.storage.length) { setMessage('❌ Предмет не найден.'); return; }
    
    var item = g.housing.storage.splice(index, 1)[0];
    addToInventory(g, item);
    
    setMessage('✅ Вы забрали ' + item.name + ' со склада.');
    saveData();
    updateMenu();
}

function openStorageHold() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var hold = (g.housing && g.housing.storageHold) || [];
    var msg = '📦 КАМЕРА ХРАНЕНИЯ\n';
    msg += 'Всего: ' + hold.length + '\n\n';
    
    if (hold.length === 0) {
        msg += '📭 Пусто';
    } else {
        hold.forEach(function(item, i) {
            var quality = item.quality || 'Обычное';
            var countDisplay = '';
            if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
            msg += (i + 1) + '. ' + item.name + ' (' + quality + ')' + countDisplay + '\n';
        });
    }
    
    var choice = prompt(msg + '\n\nВведите номер для забора, или 0 для выхода:');
    var idx = parseInt(choice) - 1;
    if (!isNaN(idx) && idx >= 0 && idx < hold.length) {
        var item = hold.splice(idx, 1)[0];
        addToInventory(g, item);
        setMessage('✅ Вы забрали ' + item.name);
        saveData();
        updateMenu();
    }
}

// ============================================================
// 6. КОНЮШНЯ
// ============================================================

function openStable() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    checkHorseReset();
    
    var msg = '🐴 КОНЮШНЯ\n\n';
    
    if (g.equipment && g.equipment.horse) {
        var horse = HORSE_TYPES[g.equipment.horse.horseType];
        if (horse) {
            msg += 'ВАША ЛОШАДЬ:\n';
            msg += horse.emoji + ' ' + horse.name + '\n';
            msg += '❤️ HP: ' + g.equipment.horse.hp + '/' + g.equipment.horse.maxHp + '\n';
            msg += '⚡ +' + horse.speedBonus + '%\n\n';
        }
    } else {
        msg += 'У вас нет лошади.\n\n';
    }
    
    msg += 'ДОСТУПНЫЕ:\n';
    for (var key in HORSE_TYPES) {
        var h = HORSE_TYPES[key];
        var market = horseMarket[key];
        var available = market.total - market.sold;
        
        if (g.equipment && g.equipment.horse && g.equipment.horse.horseType === key) {
            msg += '✅ ' + h.emoji + ' ' + h.name + ' (ваша)\n';
        } else if (available > 0) {
            msg += h.emoji + ' ' + h.name + ' - ' + formatCurrency(h.price * 210 * 56) + ' (осталось: ' + available + ')\n';
        } else {
            msg += '❌ ' + h.emoji + ' ' + h.name + ' (распродано)\n';
        }
    }
    
    var action = prompt(msg + '\n\nВведите тип (work, riding, war, racer, heavy, royal, fire) или 0:');
    if (action && action !== '0') { buyHorse(action); }
}

function buyHorse(type) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var horse = HORSE_TYPES[type];
    if (!horse) { setMessage('❌ Такой лошади нет.'); return; }
    
    checkHorseReset();
    var market = horseMarket[type];
    if (market.sold >= market.total) {
        setMessage('❌ Все ' + horse.name + ' проданы!');
        return;
    }
    
    if (g.equipment && g.equipment.horse) {
        setMessage('❌ У вас уже есть лошадь!');
        return;
    }
    
    if (!spendMoney(g, horse.price * 210 * 56)) {
        setMessage('❌ Недостаточно денег! Нужно: ' + formatCurrency(horse.price * 210 * 56));
        return;
    }
    
    g.equipment.horse = {
        horseType: type,
        name: horse.name,
        hp: horse.hp,
        maxHp: horse.hp,
        speedBonus: horse.speedBonus,
        defensePercent: horse.defensePercent,
        inventorySlots: horse.inventorySlots
    };
    
    market.sold++;
    saveHorseMarket();
    saveData();
    
    setMessage('✅ Вы купили ' + horse.name + '!');
    addLog('🐴 ' + currentUser + ' купил ' + horse.name);
    updateMenu();
    updateActions();
}

function sellHorse() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.equipment || !g.equipment.horse) { setMessage('❌ У вас нет лошади.'); return; }
    
    var horseType = HORSE_TYPES[g.equipment.horse.horseType];
    if (!horseType) { setMessage('❌ Лошадь не найдена.'); return; }
    
    var refund = Math.floor(horseType.price * 0.5);
    g.copper += refund;
    convertCurrency(g);
    g.equipment.horse = null;
    
    saveData();
    setMessage('💰 Вы продали лошадь за ' + formatCurrency(refund * 210 * 56));
    addLog('💰 ' + currentUser + ' продал лошадь');
    updateMenu();
    updateActions();
}

// ============================================================
// 7. СЕПТА
// ============================================================

function openTemple() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var maxHp = getMaxHp(g);
    
    var msg = '⛪ ВЕЛИКАЯ СЕПТА\n\n';
    msg += '💰 ' + formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper) + '\n';
    msg += '❤️ HP: ' + Math.round(g.hp) + '/' + maxHp + '\n';
    msg += '🍀 Удача: ' + (g.luck || 0) + '/25\n\n';
    msg += '1. 💉 Исцеление\n';
    msg += '2. 🙏 Молитва\n';
    msg += '3. 🍀 Удача\n';
    msg += '4. 🧪 Зелье\n';
    msg += '0. Выйти';
    
    var action = prompt(msg);
    if (action === '1') { freeHeal(); }
    else if (action === '2') { prayForBlessing(); }
    else if (action === '3') { donateLuck(); }
    else if (action === '4') { buyPotionMenu(); }
}

function freeHeal() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var maxHp = getMaxHp(g);
    
    if (g.hp >= maxHp) { setMessage('✅ Вы здоровы!'); return; }
    
    var now = Date.now();
    var healCooldown = 2 * 60 * 60 * 1000;
    
    if (g.lastHeal && (now - g.lastHeal) < healCooldown) {
        var timeLeft = Math.ceil((healCooldown - (now - g.lastHeal)) / (60 * 1000));
        setMessage('⏳ Исцеление через ' + timeLeft + ' мин.');
        return;
    }
    
    g.hp = maxHp;
    g.lastHeal = now;
    saveData();
    setMessage('💉 Вы исцелились!');
    updateMenu();
}

function prayForBlessing() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var now = Date.now();
    var dayMs = 24 * 60 * 60 * 1000;
    
    if (g.lastPrayer && (now - g.lastPrayer) < dayMs) {
        var timeLeft = Math.ceil((dayMs - (now - g.lastPrayer)) / (60 * 60 * 1000));
        setMessage('⏳ Молитва через ' + timeLeft + ' ч.');
        return;
    }
    
    g.lastPrayer = now;
    if (!g.blessing) g.blessing = { active: true, expires: now + 60 * 60 * 1000 };
    g.blessing.active = true;
    g.blessing.expires = now + 60 * 60 * 1000;
    
    saveData();
    setMessage('🙏 Благословение! +10% опыта на 1 час.');
    addLog('🙏 ' + currentUser + ' получил благословение');
    updateMenu();
}

function donateLuck() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if ((g.luck || 0) >= 25) { setMessage('🍀 Удача максимальна!'); return; }
    if (!spendMoney(g, 1000 * 210 * 56)) { setMessage('❌ Нужно 1000 зол.'); return; }
    
    g.luck = Math.min(25, (g.luck || 0) + 5);
    saveData();
    setMessage('🍀 +5 удачи! (всего: ' + g.luck + '/25)');
    addLog('🍀 ' + currentUser + ' купил удачу');
    updateMenu();
}

function buyPotionMenu() {
    var potions = [
        { id: 'health_small', name: '🧪 Малое зелье', price: 30, hp: 20 },
        { id: 'health_medium', name: '🧪 Среднее зелье', price: 80, hp: 50 },
        { id: 'health_large', name: '🧪 Большое зелье', price: 150, hp: 100 },
        { id: 'restore', name: '🧪 Восстановление', price: 200, hp: 50, fatigue: 30 },
        { id: 'stamina', name: '🧪 Выносливость', price: 100, hp: 10, fatigue: 20 }
    ];
    
    var msg = '🧪 ЗЕЛЬЯ\n\n';
    potions.forEach(function(p, i) {
        msg += (i + 1) + '. ' + p.name + ' - ' + formatCurrency(p.price);
        msg += ' (❤️+' + p.hp;
        if (p.fatigue) msg += ', 😴+' + p.fatigue;
        msg += ')\n';
    });
    msg += '\n0. Выйти';
    
    var choice = parseInt(prompt(msg));
    if (isNaN(choice) || choice < 1 || choice > potions.length) { setMessage('❌ Отменено.'); return; }
    
    var potion = potions[choice - 1];
    buyPotion(potion.id, potion.price, potion.hp, potion.fatigue || 0);
}

function buyPotion(potionId, price, hp, fatigue) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!spendMoney(g, price)) {
        setMessage('❌ Недостаточно денег! Нужно: ' + formatCurrency(price));
        return;
    }
    
    var potionNames = {
        'health_small': 'Малое зелье здоровья',
        'health_medium': 'Среднее зелье здоровья',
        'health_large': 'Большое зелье здоровья',
        'restore': 'Зелье восстановления',
        'stamina': 'Зелье выносливости'
    };
    
    var item = {
        name: potionNames[potionId] || potionId,
        quality: 'Обычное',
        type: 'food',
        effect: { hp: hp || 0, fatigue: fatigue || 0 },
        count: 1
    };
    
    addToInventory(g, item);
    saveData();
    setMessage('✅ Вы купили ' + item.name);
    updateMenu();
}

// ============================================================
// 8. ГИЛЬДИЯ НАЁМНИКОВ
// ============================================================

function openGuildHall() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.quests) {
        g.quests = { completed: [], lastReset: 0, active: null, progress: {} };
    }
    
    var now = Date.now();
    var resetInterval = 5 * 60 * 60 * 1000;
    
    if (!g.quests.lastReset || (now - g.quests.lastReset) >= resetInterval) {
        g.quests.completed = [];
        g.quests.lastReset = now;
        g.quests.active = null;
        g.quests.progress = {};
        saveData();
    }
    
    var quests = generateDailyQuests();
    var nextReset = g.quests.lastReset + resetInterval;
    var timeLeft = nextReset - now;
    var hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
    var minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    
    var msg = '🗡️ ГИЛЬДИЯ НАЁМНИКОВ\n\n';
    msg += '⏳ Обновление через: ' + hoursLeft + 'ч ' + minutesLeft + 'м\n\n';
    
    if (g.quests.active) {
        var activeQuest = null;
        for (var i = 0; i < quests.length; i++) {
            if (quests[i].id === g.quests.active) { activeQuest = quests[i]; break; }
        }
        if (activeQuest) {
            var progress = g.quests.progress[activeQuest.id] || 0;
            msg += '📌 АКТИВНОЕ:\n';
            msg += activeQuest.name + '\n';
            msg += activeQuest.desc + '\n';
            msg += '📊 Прогресс: ' + progress + '/' + activeQuest.count + '\n';
            msg += '💰 ' + formatCurrency(activeQuest.rewardGold) + ' | ⭐ ' + activeQuest.rewardXp + '\n\n';
        }
    }
    
    msg += 'ДОСТУПНЫЕ:\n';
    for (var j = 0; j < quests.length; j++) {
        var q = quests[j];
        var isCompleted = false;
        for (var k = 0; k < g.quests.completed.length; k++) {
            if (g.quests.completed[k] === q.id) { isCompleted = true; break; }
        }
        var isActive = g.quests.active === q.id;
        var status = isCompleted ? '✅' : (isActive ? '⏳' : (j + 1));
        msg += status + ' ' + q.name + ' (' + q.difficulty + ')\n';
    }
    msg += '\nВведите номер, или 0 для выхода:';
    
    var choice = parseInt(prompt(msg));
    if (isNaN(choice) || choice < 1 || choice > quests.length) { setMessage('❌ Отменено.'); return; }
    
    var quest = quests[choice - 1];
    var isCompleted = false;
    for (var l = 0; l < g.quests.completed.length; l++) {
        if (g.quests.completed[l] === quest.id) { isCompleted = true; break; }
    }
    if (isCompleted) { setMessage('❌ Уже выполнено.'); return; }
    if (g.quests.active) { setMessage('❌ У вас уже есть задание!'); return; }
    
    takeQuest(quest.id);
}

function generateDailyQuests() {
    var easy = [
        { id: 'easy_kill_rats', name: '🐀 Крысиная охота', desc: 'Убить 5 крыс', type: 'kill', target: 'Крыса', count: 5, rewardGold: 50, rewardXp: 20, difficulty: '🟢 Лёгкий' },
        { id: 'easy_gather_skins', name: '🧵 Сбор шкур', desc: 'Принести 10 шкур', type: 'gather', target: 'Шкура', count: 10, rewardGold: 40, rewardXp: 15, difficulty: '🟢 Лёгкий' },
        { id: 'easy_gather_wood', name: '🪵 Дрова', desc: 'Принести 15 дерева', type: 'gather', target: 'Дерево', count: 15, rewardGold: 35, rewardXp: 12, difficulty: '🟢 Лёгкий' }
    ];
    
    var medium = [
        { id: 'medium_kill_bandits', name: '🗡️ Очистка дорог', desc: 'Убить 5 бандитов', type: 'kill', target: 'Бандит', count: 5, rewardGold: 150, rewardXp: 50, difficulty: '🟡 Средний' },
        { id: 'medium_gather_ore', name: '⛏️ Поставка руды', desc: 'Принести 20 руды', type: 'gather', target: 'Руда железная', count: 20, rewardGold: 100, rewardXp: 40, difficulty: '🟡 Средний' }
    ];
    
    var hard = [
        { id: 'hard_kill_thugs', name: '⚔️ Уничтожение банды', desc: 'Убить 3 головорезов', type: 'kill', target: 'Головорез', count: 3, rewardGold: 300, rewardXp: 100, difficulty: '🔴 Сложный' }
    ];
    
    var shuffledEasy = easy.sort(function() { return Math.random() - 0.5; }).slice(0, 1);
    var shuffledMedium = medium.sort(function() { return Math.random() - 0.5; }).slice(0, 1);
    var shuffledHard = hard.sort(function() { return Math.random() - 0.5; }).slice(0, 1);
    
    return shuffledEasy.concat(shuffledMedium).concat(shuffledHard);
}

function takeQuest(questId) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    g.quests.active = questId;
    if (!g.quests.progress) g.quests.progress = {};
    g.quests.progress[questId] = 0;
    
    saveData();
    setMessage('📋 Вы взяли задание!');
    updateMenu();
}

function abandonQuest() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.quests.active) { setMessage('❌ Нет активного задания.'); return; }
    
    g.quests.active = null;
    saveData();
    setMessage('❌ Вы отказались.');
    updateMenu();
}

function checkQuestProgress(type, target, count) {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    if (!g.quests || !g.quests.active) return;
    
    var quests = generateDailyQuests();
    var quest = null;
    for (var i = 0; i < quests.length; i++) {
        if (quests[i].id === g.quests.active) { quest = quests[i]; break; }
    }
    if (!quest) return;
    if (quest.type !== type || quest.target !== target) return;
    
    var isCompleted = false;
    for (var j = 0; j < g.quests.completed.length; j++) {
        if (g.quests.completed[j] === quest.id) { isCompleted = true; break; }
    }
    if (isCompleted) return;
    
    if (!g.quests.progress) g.quests.progress = {};
    g.quests.progress[quest.id] = (g.quests.progress[quest.id] || 0) + count;
    
    if (g.quests.progress[quest.id] >= quest.count) {
        g.quests.completed.push(quest.id);
        g.quests.active = null;
        
        var xpMultiplier = 1 + (g.stats.intelligence / 100);
        var xpGain = Math.round(quest.rewardXp * xpMultiplier);
        g.copper += quest.rewardGold;
        convertCurrency(g);
        g.xp += xpGain;
        
        while (g.xp >= g.nextLevelXp) {
            g.xp -= g.nextLevelXp;
            g.level++;
            g.nextLevelXp = 100 + g.level * 10;
            if (g.level <= 100) {
                g.attributePoints++;
                setMessage('🎉 ' + g.level + ' уровень! +1 очко.');
            } else {
                setMessage('🎉 ' + g.level + ' уровень!');
            }
        }
        
        saveData();
        setMessage('✅ Задание выполнено! +' + formatCurrency(quest.rewardGold) + ', +' + xpGain + ' XP');
        addLog('✅ ' + currentUser + ' выполнил задание');
        updateMenu();
    }
}

// ============================================================
// 9. БИБЛИОТЕКА
// ============================================================

function openLibrary() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var available = getBooksAvailable(g);
    
    var msg = '📚 БИБЛИОТЕКА\n\n';
    msg += '💰 ' + formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper) + '\n';
    msg += '📖 Осталось: ' + available + '/3\n\n';
    
    var books = [
        { level: 1, xp: 50, price: 100 },
        { level: 5, xp: 100, price: 200 },
        { level: 10, xp: 150, price: 350 },
        { level: 15, xp: 200, price: 500 },
        { level: 20, xp: 300, price: 700 },
        { level: 25, xp: 400, price: 1000 }
    ];
    
    msg += 'КНИГИ:\n';
    books.forEach(function(book, i) {
        msg += (i + 1) + '. Книга (ур.' + book.level + ') - ' + formatCurrency(book.price) + ' (+' + book.xp + ' XP)\n';
    });
    msg += '\n0. Выйти';
    
    var choice = parseInt(prompt(msg));
    if (isNaN(choice) || choice < 1 || choice > books.length) { setMessage('❌ Отменено.'); return; }
    
    var book = books[choice - 1];
    buyBook(book.level, book.xp, book.price);
}

function getBooksAvailable(g) {
    var now = Date.now();
    var dayMs = 24 * 60 * 60 * 1000;
    
    if (now - g.lastBookReset >= dayMs) {
        g.booksBoughtToday = 0;
        g.lastBookReset = now;
        saveData();
    }
    
    return 3 - g.booksBoughtToday;
}

function buyBook(level, xp, price) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var available = getBooksAvailable(g);
    if (available <= 0) { setMessage('❌ Вы купили 3 книги сегодня.'); return; }
    if (!spendMoney(g, price)) { setMessage('❌ Недостаточно денег! Нужно: ' + formatCurrency(price)); return; }
    
    var book = {
        name: '📖 Искусство войны',
        level: level,
        xp: xp,
        isBook: true,
        type: 'book',
        count: 1
    };
    
    addToInventory(g, book);
    g.booksBoughtToday = (g.booksBoughtToday || 0) + 1;
    
    saveData();
    setMessage('✅ Вы купили книгу (ур.' + level + '). Осталось: ' + (available - 1));
    updateMenu();
}

function readBook(index) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (index >= g.inventory.length) { setMessage('❌ Книга не найдена.'); return; }
    var item = g.inventory[index];
    if (!item.isBook) { setMessage('❌ Это не книга.'); return; }
    
    var weapon = g.equipment.rightHand;
    var weaponType = null;
    if (weapon) { weaponType = weapon.type; }
    
    if (!weaponType) { setMessage('❌ Наденьте оружие.'); return; }
    
    var baseTime = 30;
    var intelligence = Math.min(30, g.stats.intelligence || 1);
    var readTimeMinutes = Math.max(5, baseTime - intelligence);
    
    setMessage('⏳ Чтение займёт ' + readTimeMinutes + ' мин.');
    
    setTimeout(function() {
        var xpMultiplier = 1 + (g.stats.intelligence / 100);
        var xpGain = Math.round(item.xp * xpMultiplier);
        
        g.xp += xpGain;
        while (g.xp >= g.nextLevelXp) {
            g.xp -= g.nextLevelXp;
            g.level++;
            g.nextLevelXp = 100 + g.level * 10;
            if (g.level <= 100) {
                g.attributePoints++;
                setMessage('🎉 ' + g.level + ' уровень! +1 очко.');
            } else {
                setMessage('🎉 ' + g.level + ' уровень!');
            }
        }
        
        if (g.skills[weaponType]) {
            g.skills[weaponType].xp = (g.skills[weaponType].xp || 0) + xpGain;
            var needed = g.skills[weaponType].level * 20 + 10;
            while (g.skills[weaponType].xp >= needed) {
                g.skills[weaponType].xp -= needed;
                g.skills[weaponType].level = Math.min(999, g.skills[weaponType].level + 1);
                setMessage('⚔️ Мастерство повышено!');
            }
        }
        
        g.inventory.splice(index, 1);
        saveData();
        setMessage('📖 Вы прочитали книгу! +' + xpGain + ' XP');
        updateMenu();
    }, readTimeMinutes * 60 * 1000);
}

// ============================================================
// 10. БОРДЕЛЬ
// ============================================================

function openBrothel() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var services = [
        { id: 'rest', name: '🛏️ Отдых', desc: '+50 усталости, +10 HP', price: 20, fatigue: 50, hp: 10 },
        { id: 'wine', name: '🍷 Вино', desc: '+30 усталости, +5 HP, +5% XP 30 мин', price: 50, fatigue: 30, hp: 5, buff: { type: 'xp', value: 5, duration: 30 } },
        { id: 'dance', name: '💃 Танец', desc: '+20 усталости, +10% урон 15 мин', price: 100, fatigue: 20, hp: 0, buff: { type: 'damage', value: 10, duration: 15 } },
        { id: 'vip', name: '👑 VIP', desc: '+80 усталости, +20 HP, +15% XP 1 час', price: 200, fatigue: 80, hp: 20, buff: { type: 'xp', value: 15, duration: 60 } }
    ];
    
    var msg = '💃 БОРДЕЛЬ\n\n';
    msg += '💰 ' + formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper) + '\n';
    msg += '😴 Усталость: ' + g.fatigue + '/100\n\n';
    msg += 'УСЛУГИ:\n';
    services.forEach(function(service, i) {
        msg += (i + 1) + '. ' + service.name + ' - ' + formatCurrency(service.price) + '\n';
        msg += '   ' + service.desc + '\n';
    });
    msg += '\n0. Выйти';
    
    var choice = parseInt(prompt(msg));
    if (isNaN(choice) || choice < 1 || choice > services.length) { setMessage('❌ Отменено.'); return; }
    
    var service = services[choice - 1];
    useBrothelService(service.id, service.price, service.fatigue, service.hp, service.buff);
}

function useBrothelService(serviceId, price, fatigue, hp, buff) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!spendMoney(g, price)) { setMessage('❌ Недостаточно денег! Нужно: ' + formatCurrency(price)); return; }
    
    g.fatigue = Math.min(100, g.fatigue + fatigue);
    if (hp > 0) g.hp = Math.min(getMaxHp(g), g.hp + hp);
    
    if (buff) {
        if (!g.brothelBuffs) g.brothelBuffs = [];
        var buffNames = { 'xp': '🎯 Опыт', 'damage': '⚔️ Урон' };
        g.brothelBuffs.push({
            name: buffNames[buff.type] || 'Бафф',
            desc: '+' + buff.value + '% ' + (buff.type === 'xp' ? 'опыта' : 'урона'),
            type: buff.type,
            value: buff.value,
            expires: Date.now() + buff.duration * 60 * 1000
        });
    }
    
    var serviceNames = { 'rest': 'Отдых', 'wine': 'Вино', 'dance': 'Танец', 'vip': 'VIP' };
    
    saveData();
    setMessage('✅ ' + serviceNames[serviceId] + '! +' + fatigue + ' усталости' + (hp > 0 ? ', +' + hp + ' HP' : ''));
    addLog('💃 ' + currentUser + ' посетил бордель');
    updateMenu();
}

// ============================================================
// 11. РЫНОК (ЛАВКИ)
// ============================================================

function openMarket() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var msg = '🏪 РЫНОК\n\n';
    
    if (g.marketStall && g.marketStall.owned) {
        var stall = marketStalls[g.marketStall.stallId];
        var timeLeft = getTimeLeft(stall.rentPaid, stall.rentDays || 1);
        msg += '🏪 Ваша лавка #' + g.marketStall.stallId + '\n';
        msg += timeLeft.expired ? '⛔ Аренда истекла!\n' : '✅ Активна (' + timeLeft.text + ')\n';
        msg += '📦 ' + (stall.inventory ? stall.inventory.length : 0) + ' товаров\n\n';
    } else {
        msg += 'У вас нет лавки.\n';
        msg += '💡 Купите в Магистрате (80 зол.)\n\n';
    }
    
    msg += 'АКТИВНЫЕ ЛАВКИ:\n';
    var hasStalls = false;
    for (var i = 1; i <= MARKET_STALLS_TOTAL; i++) {
        var stall = marketStalls[i];
        if (stall && stall.owner) {
            var timeLeft = getTimeLeft(stall.rentPaid, stall.rentDays || 1);
            if (!timeLeft.expired) {
                hasStalls = true;
                msg += '#' + i + ' - ' + stall.owner + ' (' + (stall.inventory ? stall.inventory.length : 0) + ')\n';
            }
        }
    }
    if (!hasStalls) msg += 'Нет активных лавок\n';
    
    msg += '\nВведите номер лавки, или 0 для выхода:';
    var choice = parseInt(prompt(msg));
    if (isNaN(choice) || choice < 1 || choice > MARKET_STALLS_TOTAL) { setMessage('❌ Отменено.'); return; }
    
    enterStall(choice);
}

function enterStall(stallId) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var stall = marketStalls[stallId];
    
    if (!stall) { setMessage('❌ Лавка не найдена.'); return; }
    
    var isOwner = stall.owner === currentUser;
    var timeLeft = getTimeLeft(stall.rentPaid, stall.rentDays || 1);
    var isActive = !timeLeft.expired;
    
    var msg = '🏪 ЛАВКА #' + stallId + '\n';
    msg += '👤 Владелец: ' + (stall.owner || 'Свободна') + '\n';
    msg += isActive ? '✅ Активна\n' : '⛔ Аренда истекла\n\n';
    
    if (isOwner && isActive) {
        msg += 'УПРАВЛЕНИЕ:\n';
        msg += '1. 📥 Добавить\n';
        msg += '2. ❌ Убрать\n';
        msg += '3. 🏛️ Магистрат\n\n';
    }
    
    msg += 'ТОВАРЫ:\n';
    if (!stall.inventory || stall.inventory.length === 0) {
        msg += 'Нет товаров\n';
    } else {
        stall.inventory.forEach(function(item, i) {
            var price = stall.prices && stall.prices[i] ? stall.prices[i] : 0;
            var quality = item.quality || 'Обычное';
            var countDisplay = '';
            if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
            msg += (i + 1) + '. ' + item.name + ' (' + quality + ')' + countDisplay + ' - ' + formatCurrency(price) + '\n';
        });
    }
    
    if (!isOwner && isActive && stall.inventory && stall.inventory.length > 0) {
        msg += '\nВведите номер товара для покупки, или 0 для выхода:';
        var choice = parseInt(prompt(msg));
        if (!isNaN(choice) && choice >= 1 && choice <= stall.inventory.length) {
            buyFromStall(stallId, choice - 1);
        }
    } else if (isOwner && isActive) {
        var choice = parseInt(prompt(msg + '\nВведите действие:'));
        if (choice === 1) { addToStall(stallId); }
        else if (choice === 2) {
            var idx = parseInt(prompt('Номер товара:'));
            if (!isNaN(idx) && idx >= 1 && idx <= stall.inventory.length) {
                removeFromStall(stallId, idx - 1);
            }
        } else if (choice === 3) { payStallRent(); }
    } else {
        alert(msg);
    }
}

function addToStall(stallId) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var stall = marketStalls[stallId];
    
    if (!stall || stall.owner !== currentUser) { setMessage('❌ Не ваша лавка.'); return; }
    if (g.inventory.length === 0) { setMessage('❌ Инвентарь пуст.'); return; }
    
    var choices = 'Выберите предмет:\n';
    g.inventory.forEach(function(item, i) {
        var countDisplay = '';
        if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
        choices += (i + 1) + '. ' + item.name + ' (' + (item.quality || 'Обычное') + ')' + countDisplay + '\n';
    });
    choices += '0. Отмена';
    
    var choice = parseInt(prompt(choices));
    if (isNaN(choice) || choice < 1 || choice > g.inventory.length) { setMessage('❌ Отменено.'); return; }
    
    var item = g.inventory.splice(choice - 1, 1)[0];
    
    var priceInput = prompt('Цена (например: 100, 5 ЗОЛ, 1 ЗОЛ 50 МП):');
    var price = parseCurrencyInput(priceInput);
    if (price === null || price < 1) {
        setMessage('❌ Цена должна быть >= 1 МП.');
        addToInventory(g, item);
        return;
    }
    
    if (!stall.inventory) stall.inventory = [];
    if (!stall.prices) stall.prices = {};
    var newIdx = stall.inventory.length;
    stall.inventory.push(item);
    stall.prices[newIdx] = price;
    
    saveMarketStalls();
    saveData();
    setMessage('✅ Вы добавили ' + item.name + ' за ' + formatCurrency(price));
    updateMenu();
}

function buyFromStall(stallId, idx) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var stall = marketStalls[stallId];
    
    if (!stall || !stall.inventory || idx >= stall.inventory.length) {
        setMessage('❌ Товар не найден.');
        return;
    }
    
    var item = stall.inventory[idx];
    var price = stall.prices && stall.prices[idx] ? stall.prices[idx] : 0;
    if (price <= 0) { setMessage('❌ Цена не указана.'); return; }
    if (!spendMoney(g, price)) { setMessage('❌ Недостаточно денег! Нужно: ' + formatCurrency(price)); return; }
    
    var owner = users[stall.owner];
    if (owner) {
        owner.game.copper += price;
        convertCurrency(owner.game);
        saveData();
    }
    
    stall.inventory.splice(idx, 1);
    if (stall.prices) delete stall.prices[idx];
    addToInventory(g, item);
    saveMarketStalls();
    saveData();
    setMessage('✅ Вы купили ' + item.name + ' за ' + formatCurrency(price));
    updateMenu();
}

function removeFromStall(stallId, idx) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var stall = marketStalls[stallId];
    
    if (!stall || stall.owner !== currentUser) { setMessage('❌ Не ваша лавка.'); return; }
    if (!stall.inventory || idx >= stall.inventory.length) { setMessage('❌ Товар не найден.'); return; }
    
    var item = stall.inventory.splice(idx, 1)[0];
    if (stall.prices) delete stall.prices[idx];
    addToInventory(g, item);
    saveMarketStalls();
    saveData();
    setMessage('✅ Вы убрали ' + item.name);
    updateMenu();
}

function payStallRent() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.marketStall || !g.marketStall.owned) { setMessage('❌ У вас нет лавки!'); return; }
    var stall = marketStalls[g.marketStall.stallId];
    if (!stall || stall.owner !== currentUser) { setMessage('❌ Не ваша лавка.'); return; }
    
    var rentCost = 10;
    var currentDays = stall.rentDays || 0;
    var totalDays = currentDays + 7;
    if (totalDays > 28) { setMessage('⏳ Оплачено на 4 недели.'); return; }
    if (!spendMoney(g, rentCost * 210 * 56)) { setMessage('❌ Нужно ' + rentCost + ' зол.'); return; }
    
    stall.rentDays = (stall.rentDays || 0) + 7;
    stall.rentPaid = Date.now();
    g.marketStall.rentDays = stall.rentDays;
    g.marketStall.rentPaid = Date.now();
    
    saveMarketStalls();
    saveData();
    setMessage('✅ Аренда оплачена на неделю!');
    updateMenu();
}

function checkStallRent() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    if (!g.marketStall || !g.marketStall.owned) return;
    
    var stall = marketStalls[g.marketStall.stallId];
    if (!stall) return;
    
    var timeLeft = getTimeLeft(stall.rentPaid, stall.rentDays || 1);
    if (timeLeft.expired) {
        confiscateStall();
        setMessage('🚪 Лавка конфискована!');
    }
}

function confiscateStall() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    var stallId = g.marketStall.stallId;
    var stall = marketStalls[stallId];
    
    if (!stall || stall.owner !== currentUser) return;
    
    if (stall.inventory && stall.inventory.length > 0) {
        if (!confiscatedItems) confiscatedItems = [];
        confiscatedItems.push({
            owner: currentUser,
            items: stall.inventory,
            confiscatedAt: Date.now(),
            type: 'stall'
        });
        saveData();
        setMessage('📦 Товары в конфискат.');
    }
    
    stall.owner = null;
    stall.rentPaid = null;
    stall.rentDays = 0;
    stall.inventory = [];
    stall.prices = {};
    
    g.marketStall = { owned: false, stallId: null, rentPaid: null, rentDays: 0, debt: 0 };
    
    saveMarketStalls();
    saveData();
    setMessage('🚪 Лавка #' + stallId + ' конфискована!');
    addLog('🚪 ' + currentUser + ' потерял лавку');
    updateMenu();
}

// ============================================================
// 12. КОНФИСКАТ
// ============================================================

function openConfiscated() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var userItems = [];
    for (var i = 0; i < confiscatedItems.length; i++) {
        if (confiscatedItems[i].owner === currentUser) {
            userItems.push(confiscatedItems[i]);
        }
    }
    
    if (userItems.length === 0) { setMessage('📦 У вас нет вещей в конфискате.'); return; }
    
    var msg = '📦 КОНФИСКАТ\n\n';
    var totalItems = 0;
    for (var ei = 0; ei < userItems.length; ei++) {
        var entry = userItems[ei];
        msg += '📅 ' + new Date(entry.confiscatedAt).toLocaleString() + '\n';
        for (var ii = 0; ii < entry.items.length; ii++) {
            var item = entry.items[ii];
            var quality = item.quality || 'Обычное';
            var countDisplay = '';
            if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
            totalItems++;
            msg += '  ' + totalItems + '. ' + item.name + ' (' + quality + ')' + countDisplay + '\n';
        }
        msg += '\n';
    }
    msg += 'Введите номер для забора, или 0 для выхода:';
    
    var choice = parseInt(prompt(msg));
    if (isNaN(choice) || choice < 1) { setMessage('❌ Отменено.'); return; }
    
    var foundEntry = null;
    var foundIdx = -1;
    var currentCount = 0;
    
    for (var ei2 = 0; ei2 < userItems.length; ei2++) {
        var entry2 = userItems[ei2];
        for (var ii2 = 0; ii2 < entry2.items.length; ii2++) {
            currentCount++;
            if (currentCount === choice) {
                foundEntry = entry2;
                foundIdx = ii2;
                break;
            }
        }
        if (foundEntry) break;
    }
    
    if (!foundEntry) { setMessage('❌ Предмет не найден.'); return; }
    
    var realEntryIdx = -1;
    for (var ri = 0; ri < confiscatedItems.length; ri++) {
        if (confiscatedItems[ri] === foundEntry) { realEntryIdx = ri; break; }
    }
    if (realEntryIdx === -1) { setMessage('❌ Ошибка.'); return; }
    
    var item = foundEntry.items.splice(foundIdx, 1)[0];
    addToInventory(g, item);
    
    if (foundEntry.items.length === 0) {
        confiscatedItems.splice(realEntryIdx, 1);
    }
    
    saveData();
    setMessage('✅ Вы забрали ' + item.name);
    updateMenu();
}

// ============================================================
// 13. МАГИСТРАТ (МОДАЛЬНЫЕ ОКНА)
// ============================================================

function openMagistrate() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var modal = document.getElementById('modal-magistrate');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-magistrate';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeMagistrate(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📜 МАГИСТРАТ</h3><button class="close-btn" onclick="closeMagistrate()">✕</button></div><div id="modal-magistrate-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-magistrate-content');
    
    var html = '<div class="modal-section"><h4>📜 МАГИСТРАТ</h4></div>';
    html += '<div class="tabs">';
    html += '<button class="tab-btn" onclick="showMagistrateHousing()">🏠 Недвижимость</button>';
    html += '<button class="tab-btn" onclick="showMagistrateStalls()">🏪 Лавки</button>';
    html += '<button class="tab-btn" onclick="openConfiscated()">📦 Конфискат</button>';
    html += '</div>';
    html += '<div id="magistrate-content" class="modal-section"></div>';
    html += '<button class="btn btn-secondary" onclick="closeMagistrate()">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
    
    showMagistrateHousing();
}

function closeMagistrate() {
    var modal = document.getElementById('modal-magistrate');
    if (modal) modal.classList.add('hide');
}

function showMagistrateHousing() {
    var container = document.getElementById('magistrate-content');
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    
    var html = '<h4>🏠 НЕДВИЖИМОСТЬ</h4>';
    
    if (g.housing && g.housing.type) {
        var house = HOUSING_TYPES[g.housing.type];
        var timeLeft = getTimeLeft(g.housing.rentPaid, g.housing.rentDays || 1);
        
        html += '<div style="background:#120e0b;border:1px solid #3d3026;border-radius:12px;padding:14px;margin:10px 0;">';
        html += '<div style="color:#c9b694;">' + house.emoji + ' ' + house.name + '</div>';
        html += '<div style="color:#6a5a48;font-size:12px;">📍 ' + house.district + '</div>';
        html += '<div class="row"><span class="label">📦 Склад</span><span class="value">' + (g.housing.storage ? g.housing.storage.length : 0) + '/' + house.storageSlots + '</span></div>';
        html += '<div class="row"><span class="label">💰 Аренда</span><span class="value">' + house.rent + ' зол./нед</span></div>';
        
        if (timeLeft.expired) {
            html += '<div style="color:#c96a5a;margin:10px 0;">⚠️ АРЕНДА ПРОСРОЧЕНА!</div>';
            html += '<button class="btn" onclick="payRent()">💰 Оплатить (' + house.rent + ' зол.)</button>';
        } else {
            html += '<div class="row"><span class="label">⏳ Осталось</span><span class="value" style="color:#7ac98a;">' + timeLeft.text + '</span></div>';
            var currentWeeks = Math.floor((g.housing.rentDays || 1) / 7);
            if (currentWeeks < 4) {
                html += '<button class="btn" onclick="payRent()">💰 Оплатить (+1 нед, ' + house.rent + ' зол.)</button>';
            } else {
                html += '<div style="color:#6a5a48;">✅ Оплачено на 4 недели</div>';
            }
        }
        html += '<button class="btn btn-danger" onclick="sellHouse()">🏚️ Продать</button>';
        html += '</div>';
    } else {
        html += '<p style="color:#6a5a48;">У вас нет жилья.</p>';
    }
    
    html += '<div style="margin-top:10px;"><p style="color:#6a5a48;">🏘️ ДОСТУПНОЕ ЖИЛЬЁ</p>';
    
    var districts = {
        'Королевский квартал': ['mansion', 'townhouse'],
        'Торговый квартал': ['house', 'room'],
        'Квартал бедноты': ['night']
    };
    
    for (var districtName in districts) {
        var types = districts[districtName];
        html += '<div style="margin-top:10px;"><p style="color:#6a5a48;">📍 ' + districtName + '</p>';
        
        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            var house = HOUSING_TYPES[type];
            var market = housingMarket[type];
            var available = market.total - market.occupied;
            var isAvailable = available > 0;
            
            html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #1a1410;">';
            html += '<div>' + house.emoji + ' <strong>' + house.name + '</strong>';
            html += '<br><span style="font-size:11px;color:#6a5a48;">📦 ' + house.storageSlots + ' слотов | 🛏️ +' + house.restHp + ' HP</span></div>';
            html += '<div style="text-align:right;">';
            if (isAvailable) {
                html += '<span style="color:#c9b694;">' + house.price + ' зол.</span><br>';
                html += '<span style="font-size:10px;color:#6a5a48;">аренда ' + house.rent + '/нед</span><br>';
                html += '<button class="btn btn-small" onclick="buyHouse(\'' + type + '\')">✅ Купить</button>';
                html += ' <span style="font-size:10px;color:#7ac98a;">' + available + ' свободно</span>';
            } else {
                html += '<span style="color:#c96a5a;">❌ РАСПРОДАНО</span>';
            }
            html += '</div></div>';
        }
    }
    html += '</div>';
    
    container.innerHTML = html;
}

function showMagistrateStalls() {
    var container = document.getElementById('magistrate-content');
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    
    var html = '<h4>🏪 ТОРГОВЫЕ ЛАВКИ</h4>';
    html += '<p style="color:#6a5a48;">Стоимость: 80 зол. Аренда: 10 зол./нед.</p>';
    
    if (g.marketStall && g.marketStall.owned) {
        var stall = marketStalls[g.marketStall.stallId];
        var timeLeft = getTimeLeft(stall.rentPaid, stall.rentDays || 1);
        
        html += '<div style="background:#120e0b;border:1px solid #3d3026;border-radius:12px;padding:14px;margin:10px 0;">';
        html += '<div style="color:#c9b694;">🏪 Ваша лавка #' + g.marketStall.stallId + '</div>';
        
        if (timeLeft.expired) {
            html += '<div style="color:#c96a5a;margin:10px 0;">⚠️ АРЕНДА ПРОСРОЧЕНА!</div>';
            html += '<button class="btn" onclick="payStallRent()">💰 Оплатить (10 зол.)</button>';
        } else {
            html += '<div class="row"><span class="label">⏳ Осталось</span><span class="value" style="color:#7ac98a;">' + timeLeft.text + '</span></div>';
            var currentWeeks = Math.floor((stall.rentDays || 1) / 7);
            if (currentWeeks < 4) {
                html += '<button class="btn" onclick="payStallRent()">💰 Оплатить (+1 нед, 10 зол.)</button>';
            } else {
                html += '<div style="color:#6a5a48;">✅ Оплачено на 4 недели</div>';
            }
        }
        html += '<button class="btn btn-small" onclick="enterStall(' + g.marketStall.stallId + ')">📦 Войти</button>';
        html += '<button class="btn btn-danger" onclick="leaveStall()">🚪 Оставить</button>';
        html += '</div>';
    } else {
        html += '<p style="color:#6a5a48;">У вас нет лавки.</p>';
        
        var freeStalls = 0;
        for (var i = 1; i <= MARKET_STALLS_TOTAL; i++) {
            if (!marketStalls[i].owner) freeStalls++;
        }
        
        if (freeStalls > 0) {
            html += '<p style="color:#6a5a48;">Свободных: ' + freeStalls + '</p>';
            html += '<button class="btn" onclick="buyStall()">🏪 Купить (80 зол.)</button>';
        } else {
            html += '<p style="color:#c96a5a;">❌ Все лавки заняты!</p>';
        }
    }
    container.innerHTML = html;
}

function buyStall() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (g.marketStall && g.marketStall.owned) { setMessage('❌ У вас уже есть лавка!'); return; }
    
    var freeStall = null;
    for (var i = 1; i <= MARKET_STALLS_TOTAL; i++) {
        if (!marketStalls[i].owner) { freeStall = i; break; }
    }
    if (!freeStall) { setMessage('❌ Все лавки заняты!'); return; }
    
    if (!spendMoney(g, 80 * 210 * 56)) { setMessage('❌ Нужно 80 зол.'); return; }
    
    marketStalls[freeStall].owner = currentUser;
    marketStalls[freeStall].rentPaid = Date.now();
    marketStalls[freeStall].rentDays = 1;
    marketStalls[freeStall].inventory = [];
    marketStalls[freeStall].prices = {};
    
    g.marketStall = {
        owned: true,
        stallId: freeStall,
        rentPaid: Date.now(),
        rentDays: 1,
        debt: 0
    };
    
    saveMarketStalls();
    saveData();
    setMessage('✅ Вы купили лавку #' + freeStall);
    addLog('🏪 ' + currentUser + ' купил лавку');
    updateMenu();
}

function leaveStall() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.marketStall || !g.marketStall.owned) { setMessage('❌ У вас нет лавки.'); return; }
    
    var stallId = g.marketStall.stallId;
    var stall = marketStalls[stallId];
    if (!stall || stall.owner !== currentUser) { setMessage('❌ Не ваша лавка.'); return; }
    
    if (!confirm('Оставить лавку #' + stallId + '?\nТовары вернутся в инвентарь.')) return;
    
    if (stall.inventory && stall.inventory.length > 0) {
        stall.inventory.forEach(function(item) { addToInventory(g, item); });
        setMessage('📦 ' + stall.inventory.length + ' товаров возвращено.');
    }
    
    stall.owner = null;
    stall.rentPaid = null;
    stall.rentDays = 0;
    stall.inventory = [];
    stall.prices = {};
    
    g.marketStall = { owned: false, stallId: null, rentPaid: null, rentDays: 0, debt: 0 };
    
    saveMarketStalls();
    saveData();
    setMessage('🚪 Вы оставили лавку #' + stallId);
    addLog('🚪 ' + currentUser + ' оставил лавку');
    updateMenu();
}

// ============================================================
// 14. КОСТИ
// ============================================================

function playDice() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var activeGames = getActiveDiceGames();
    var msg = '🎲 КОСТИ\n\n';
    
    if (activeGames.length > 0) {
        msg += 'АКТИВНЫЕ:\n';
        for (var i = 0; i < activeGames.length; i++) {
            var game = activeGames[i];
            if (game.creator !== currentUser) {
                var timeLeft = Math.ceil((game.createdAt + 5 * 60 * 1000 - Date.now()) / 60000);
                msg += '🎲 ' + game.creator + ' (ставка: ' + formatCurrency(game.bet) + ') - ⏳ ' + timeLeft + ' мин\n';
            }
        }
        msg += '\n';
    }
    
    msg += 'СОЗДАТЬ:\n';
    msg += '1. 10 МП\n';
    msg += '2. 25 МП\n';
    msg += '3. 50 МП\n';
    msg += '4. 100 МП\n';
    msg += '5. 200 МП\n';
    msg += '6. Присоединиться (введите ID)\n';
    msg += '0. Выйти';
    
    var choice = parseInt(prompt(msg));
    
    if (choice >= 1 && choice <= 5) {
        var bets = [10, 25, 50, 100, 200];
        createDiceGame(bets[choice - 1]);
    } else if (choice === 6) {
        var gameId = prompt('ID игры:');
        if (gameId) joinDiceGame(gameId);
    }
}

function getActiveDiceGames() {
    var now = Date.now();
    var timeout = 5 * 60 * 1000;
    var active = [];
    
    for (var id in diceGames) {
        var game = diceGames[id];
        if (now - game.createdAt > timeout && game.status === 'waiting') {
            var creator = users[game.creator];
            if (creator) {
                creator.game.copper += game.bet;
                convertCurrency(creator.game);
                saveData();
            }
            delete diceGames[id];
            continue;
        }
        if (game.status === 'waiting' || game.status === 'playing') {
            active.push(game);
        }
    }
    
    return active;
}

function createDiceGame(bet) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    for (var id in diceGames) {
        if (diceGames[id].creator === currentUser && diceGames[id].status === 'waiting') {
            setMessage('❌ У вас уже есть игра!');
            return;
        }
    }
    
    if (!spendMoney(g, bet)) { setMessage('❌ Недостаточно денег!'); return; }
    
    var gameId = 'dice_' + (++diceGameIdCounter);
    diceGames[gameId] = {
        id: gameId,
        creator: currentUser,
        bet: bet,
        createdAt: Date.now(),
        status: 'waiting',
        player2: null,
        creatorRoll: null,
        player2Roll: null
    };
    
    saveData();
    setMessage('✅ Игра создана на ' + formatCurrency(bet) + '! ID: ' + gameId);
    addLog('🎲 ' + currentUser + ' создал игру');
}

function joinDiceGame(gameId) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var game = diceGames[gameId];
    
    if (!game) { setMessage('❌ Игра не найдена.'); return; }
    if (game.creator === currentUser) { setMessage('❌ Свою игру нельзя.'); return; }
    if (game.status !== 'waiting') { setMessage('❌ Игра началась.'); return; }
    if (!spendMoney(g, game.bet)) { setMessage('❌ Недостаточно денег!'); return; }
    
    game.player2 = currentUser;
    game.status = 'playing';
    
    saveData();
    setMessage('✅ Вы присоединились! Бросайте кости.');
    addLog('🎲 ' + currentUser + ' присоединился');
    
    rollDice(gameId);
}

function rollDice(gameId) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var game = diceGames[gameId];
    
    if (!game) { setMessage('❌ Игра не найдена.'); return; }
    if (game.creator !== currentUser && game.player2 !== currentUser) { setMessage('❌ Вы не участник.'); return; }
    
    var dice1 = Math.floor(Math.random() * 6) + 1;
    var dice2 = Math.floor(Math.random() * 6) + 1;
    var total = dice1 + dice2;
    
    if (game.creator === currentUser) {
        if (game.creatorRoll !== null) { setMessage('❌ Вы уже бросили!'); return; }
        game.creatorRoll = total;
        setMessage('🎲 Ваш бросок: ' + dice1 + ' + ' + dice2 + ' = ' + total);
    } else if (game.player2 === currentUser) {
        if (game.player2Roll !== null) { setMessage('❌ Вы уже бросили!'); return; }
        game.player2Roll = total;
        setMessage('🎲 Ваш бросок: ' + dice1 + ' + ' + dice2 + ' = ' + total);
    }
    
    saveData();
    
    if (game.creatorRoll !== null && game.player2Roll !== null) {
        finishDiceGame(gameId);
    }
}

function finishDiceGame(gameId) {
    var game = diceGames[gameId];
    if (!game) return;
    
    var creator = users[game.creator];
    var player2 = users[game.player2];
    var totalBet = game.bet * 2;
    
    var winner = null;
    var winnerName = '';
    
    if (game.creatorRoll > game.player2Roll) {
        winner = creator;
        winnerName = game.creator;
    } else if (game.player2Roll > game.creatorRoll) {
        winner = player2;
        winnerName = game.player2;
    } else {
        creator.game.copper += game.bet;
        player2.game.copper += game.bet;
        convertCurrency(creator.game);
        convertCurrency(player2.game);
        setMessage('🤝 Ничья! Ставки возвращены.');
        addLog('🤝 Ничья в кости');
        game.status = 'finished';
        delete diceGames[gameId];
        saveData();
        updateMenu();
        return;
    }
    
    if (winner) {
        winner.game.copper += totalBet;
        convertCurrency(winner.game);
        setMessage('🏆 ' + winnerName + ' выиграл ' + formatCurrency(totalBet) + '!');
        addLog('🏆 ' + winnerName + ' выиграл в кости');
    }
    
    game.status = 'finished';
    delete diceGames[gameId];
    saveData();
    updateMenu();
}

// ============================================================
// 15. ПОРТ
// ============================================================

function openPort() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var currentCity = g.location.location || 'Королевская Гавань';
    
    var msg = '⛵ ПОРТ\n\n';
    msg += '📍 Текущий город: ' + currentCity + '\n\n';
    msg += '🚧 В разработке.\n\n';
    msg += 'ГОРОДА:\n';
    
    for (var city in PORT_CITIES) {
        var data = PORT_CITIES[city];
        var isCurrent = city === currentCity;
        msg += (isCurrent ? '✅ ' : '   ') + data.emoji + ' ' + city;
        msg += isCurrent ? ' (вы здесь)' : ' (' + data.region + ')';
        if (!isCurrent) msg += ' - ' + data.price + ' зол.';
        msg += '\n';
    }
    
    alert(msg);
}

// ============================================================
// 16. ВСПОМОГАТЕЛЬНЫЕ
// ============================================================

function parseCurrencyInput(input) {
    input = input.trim().toUpperCase();
    if (!input) return null;
    
    if (/^\d+$/.test(input)) {
        return parseInt(input);
    }
    
    var total = 0;
    var patterns = [
        { regex: /(\d+)\s*ЗОЛ(ОТО)?/i, multiplier: 210 * 56 },
        { regex: /(\d+)\s*СО(РЕБРО)?/i, multiplier: 56 },
        { regex: /(\d+)\s*МП(ЕДЬ)?/i, multiplier: 1 },
        { regex: /(\d+)\s*G(OLD)?/i, multiplier: 210 * 56 },
        { regex: /(\d+)\s*S(ILVER)?/i, multiplier: 56 },
        { regex: /(\d+)\s*C(OPPER)?/i, multiplier: 1 }
    ];
    
    for (var pi = 0; pi < patterns.length; pi++) {
        var pattern = patterns[pi];
        var regex = new RegExp(pattern.regex.source, 'gi');
        var match;
        while ((match = regex.exec(input)) !== null) {
            var value = parseInt(match[1]);
            if (!isNaN(value)) {
                total += value * pattern.multiplier;
            }
        }
    }
    
    if (total > 0) return total;
    
    var parts = input.split(' ');
    for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        var num = parseInt(part);
        if (isNaN(num)) continue;
        var next = i + 1 < parts.length ? parts[i + 1] : '';
        if (next === 'ЗОЛ' || next === 'ЗОЛОТО' || next === 'GOLD' || next === 'G') {
            total += num * 210 * 56;
            i++;
        } else if (next === 'СО' || next === 'СЕРЕБРО' || next === 'SILVER' || next === 'S') {
            total += num * 56;
            i++;
        } else if (next === 'МП' || next === 'МЕДЬ' || next === 'COPPER' || next === 'C') {
            total += num;
            i++;
        } else {
            total += num;
        }
    }
    return total;
}

// ============================================================
// 17. ОТКРЫТИЕ ЗДАНИЙ (ОБЁРТКИ)
// ============================================================

function openInventory() {
    if (typeof window.openInventory === 'function') {
        window.openInventory();
    } else {
        setMessage('🎒 Инвентарь временно недоступен.');
    }
}

function openCharacter() {
    if (typeof window.openCharacter === 'function') {
        window.openCharacter();
    } else {
        setMessage('👤 Персонаж временно недоступен.');
    }
}

function openMainMenu() {
    var modal = document.getElementById('modal-menu');
    var content = document.getElementById('modal-menu-content');
    var html = '<div class="modal-section">';
    html += '<button class="btn" style="margin:4px 0;" onclick="openHouses(); closeMenu();">🏘️ Дома</button>';
    html += '<button class="btn btn-secondary" style="margin-top:10px;" onclick="closeMenu()">Закрыть</button>';
    html += '</div>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function openLog() {
    var modal = document.getElementById('modal-log');
    var content = document.getElementById('modal-log-content');
    var html = '<div class="modal-section"><h4>📜 ПОСЛЕДНИЕ СОБЫТИЯ</h4>';
    if (gameLog.length === 0) {
        html += '<p style="color:#6a5a48;">Пусто</p>';
    } else {
        for (var i = gameLog.length - 1; i >= Math.max(0, gameLog.length - 20); i--) {
            html += '<p style="color:#b8a890;font-size:12px;padding:2px 0;">' + gameLog[i] + '</p>';
        }
    }
    html += '</div><button class="btn" onclick="closeLog()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeLog() {
    document.getElementById('modal-log').classList.add('hide');
}

function closeMenu() {
    document.getElementById('modal-menu').classList.add('hide');
}

function openHouses() {
    var modal = document.getElementById('modal-houses');
    var content = document.getElementById('modal-houses-content');
    var html = '<div class="modal-section"><h4>🏘️ ДОМА ВЕСТЕРОСА</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Информация о Великих Домах Вестероса.</p>';
    html += '<div style="padding:10px;text-align:center;color:#6a5a48;">🔒 Раздел в разработке</div>';
    html += '<button class="btn btn-secondary" onclick="closeHouses()">Закрыть</button>';
    html += '</div>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeHouses() {
    document.getElementById('modal-houses').classList.add('hide');
}

function showOnlineList() {
    var modal = document.getElementById('modal-online');
    var content = document.getElementById('modal-online-content');
    var html = '<div class="modal-section"><h4>👥 ИГРОКИ ОНЛАЙН</h4>';
    var count = 0;
    for (var name in users) {
        if (users[name].game.online) {
            count++;
            html += '<div class="row"><span class="label">' + name + '</span><span class="value">ур. ' + users[name].game.level + ' | ' + users[name].game.location.place + '</span></div>';
        }
    }
    if (count === 0) html += '<p style="color:#6a5a48;">Нет игроков онлайн</p>';
    html += '</div><button class="btn" onclick="closeOnline()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeOnline() {
    document.getElementById('modal-online').classList.add('hide');
}

// ============================================================
// 18. РЕГИСТРАЦИЯ В ГЛОБАЛЬНУЮ ОБЛАСТЬ
// ============================================================

window.openMap = openMap;
window.closeMap = closeMap;
window.goToBuilding = goToBuilding;
window.updateStory = updateStory;
window.updateActions = updateActions;

// ЗДАНИЯ
window.openStable = openStable;
window.openTemple = openTemple;
window.openLibrary = openLibrary;
window.openGuildHall = openGuildHall;
window.openBrothel = openBrothel;
window.openMarket = openMarket;
window.openMagistrate = openMagistrate;
window.openPort = openPort;
window.openStorage = openStorage;
window.openStorageHold = openStorageHold;
window.openConfiscated = openConfiscated;

// ЖИЛЬЁ
window.buyHouse = buyHouse;
window.sellHouse = sellHouse;
window.payRent = payRent;
window.checkRent = checkRent;

// ЛАВКИ
window.enterStall = enterStall;
window.addToStall = addToStall;
window.buyFromStall = buyFromStall;
window.removeFromStall = removeFromStall;
window.payStallRent = payStallRent;
window.checkStallRent = checkStallRent;
window.confiscateStall = confiscateStall;
window.buyStall = buyStall;
window.leaveStall = leaveStall;

// КНИГИ
window.readBook = readBook;
window.buyBook = buyBook;

// КВЕСТЫ
window.takeQuest = takeQuest;
window.abandonQuest = abandonQuest;
window.checkQuestProgress = checkQuestProgress;

// КОСТИ
window.playDice = playDice;
window.createDiceGame = createDiceGame;
window.joinDiceGame = joinDiceGame;
window.rollDice = rollDice;
window.finishDiceGame = finishDiceGame;

// МАГИСТРАТ
window.showMagistrateHousing = showMagistrateHousing;
window.showMagistrateStalls = showMagistrateStalls;
window.closeMagistrate = closeMagistrate;

// МЕНЮ
window.openMainMenu = openMainMenu;
window.openLog = openLog;
window.closeLog = closeLog;
window.closeMenu = closeMenu;
window.openHouses = openHouses;
window.closeHouses = closeHouses;
window.showOnlineList = showOnlineList;
window.closeOnline = closeOnline;
window.openInventory = openInventory;
window.openCharacter = openCharacter;

console.log('🏰 Королевская Гавань загружена!');

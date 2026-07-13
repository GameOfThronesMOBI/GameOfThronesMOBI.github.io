// ============================================================
// js/regions/crownlands/locations/kings_landing.js
// КОРОЛЕВСКАЯ ГАВАНЬ — НЕЗАВИСИМАЯ ЛОКАЦИЯ
// ============================================================

// Сохраняем предыдущие обработчики (для Дороги или других локаций)
var _kingsLandingPrevUpdateStory = window.updateStory;
var _kingsLandingPrevUpdateActions = window.updateActions;

// ============================================================
// 1. КАРТА
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
        
        // Пропускаем Дорогу (она отдельная локация) и Дом (вход через район)
        if (b.id === 'Дорога' || b.id === 'Дом') continue;
        
        if (g.outside && b.id !== 'Ворота') continue;
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
    
    if (building === 'Ворота') {
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
// 3. STORY
// ============================================================

window.updateStory = function() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    var place = g.location.place;
    
    // Если это Дорога — передаём управление предыдущему обработчику
    if (place === 'Дорога' || (typeof KL_AREAS !== 'undefined' && KL_AREAS[place])) {
        if (typeof _kingsLandingPrevUpdateStory === 'function') {
            return _kingsLandingPrevUpdateStory();
        }
        return;
    }
    
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
        'Библиотека мейстеров': '📚 Библиотека.',
        'Гильдия наёмников': '🗡️ Гильдия наёмников.',
        'Бордель': '💃 Бордель.'
    };
    
    if (textEl) {
        textEl.textContent = texts[place] || 'Вы в ' + place + '.';
    }
    
    if (typeof updateActions === 'function') {
        updateActions();
    }
};

// ============================================================
// 4. ACTIONS (КНОПКИ)
// ============================================================

window.updateActions = function() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    var place = g.location.place;
    var container = document.getElementById('actions-container');
    if (!container) return;
    
    // Если это Дорога — передаём управление предыдущему обработчику
    if (place === 'Дорога' || (typeof KL_AREAS !== 'undefined' && KL_AREAS[place])) {
        if (typeof _kingsLandingPrevUpdateActions === 'function') {
            return _kingsLandingPrevUpdateActions();
        }
        return;
    }
    
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
            { id: 'rest', label: '🛏️ Отдохнуть (10 МП)' },
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
        actions = [{ id: 'stable_open', label: '🐴 Конюшня' }].concat(actions);
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
        actions = [{ id: 'leave_city', label: '🚪 Выйти из города' }].concat(actions);
    }
    
    if (place === 'Королевский квартал' || place === 'Торговый квартал' || place === 'Квартал бедноты') {
        var hasHouse = g.housing && g.housing.type && HOUSING_TYPES[g.housing.type] && HOUSING_TYPES[g.housing.type].district === place;
        if (hasHouse) {
            actions = [{ id: 'housing_enter', label: '🏠 Зайти домой' }].concat(actions);
        } else {
            actions = [{ id: 'housing_view', label: '🏠 Купить жильё' }].concat(actions);
        }
    }
    
    if (place === 'Дом') {
        actions = [
            { id: 'home_rest', label: '🛏️ Отдохнуть (бесплатно)' },
            { id: 'home_storage', label: '📦 Склад' },
            { id: 'home_leave', label: '🚪 Выйти из дома' }
        ].concat(actions);
    }
    
    if (place === 'Великая септа') {
        actions = [{ id: 'temple_open', label: '⛪ Септа' }].concat(actions);
    }
    
    if (place === 'Порт') {
        actions = [{ id: 'port_travel', label: '⛵ Порт' }].concat(actions);
    }
    
    if (place === 'Тюрьма') {
        actions = [
            { id: 'jail_pay', label: '💰 Заплатить штраф' },
            { id: 'jail_wait', label: '⏳ Ждать освобождения' },
            { id: 'jail_escape', label: '🏃 Попытаться сбежать' }
        ].concat(actions);
    }
    
    if (place === 'Библиотека мейстеров') {
        actions = [{ id: 'library_open', label: '📚 Библиотека' }].concat(actions);
    }
    
    if (place === 'Гильдия наёмников') {
        actions = [{ id: 'guildhall_open', label: '🗡️ Гильдия' }].concat(actions);
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
                } else {
                    setMessage('❌ Действие временно недоступно.');
                }
            };
        })(a.id);
        container.appendChild(btn);
    }
};

// ============================================================
// 5. ДОМА
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
    
    g.housing.rentDays = totalDays;
    g.housing.rentPaid = Date.now();
    
    saveData();
    setMessage('✅ Аренда оплачена на неделю!');
    addLog('💰 ' + currentUser + ' оплатил аренду за ' + house.name);
    updateMenu();
    updateActions();
    if (typeof showMagistrateHousing === 'function') showMagistrateHousing();
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
        if (!g.housing.storageHold) g.housing.storageHold = [];
        g.housing.storage.forEach(function(item) {
            g.housing.storageHold.push(item);
        });
        g.housing.storage = [];
        setMessage('📦 ' + g.housing.storageHold.length + ' вещей перемещено в хранилище Магистрата.');
        saveData();
    }
    
    g.housing.type = null;
    g.housing.rentDays = 0;
    g.housing.rentPaid = null;
    g.housing.debt = 0;
    
    saveData();
    setMessage('💀 Вас выселили из ' + house.name + ' за неуплату!');
    addLog('💀 ' + currentUser + ' выселен из ' + house.name);
    updateMenu();
    updateActions();
}

function enterHome() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.housing || !g.housing.type) {
        setMessage('❌ У вас нет дома!');
        return;
    }
    
    var house = HOUSING_TYPES[g.housing.type];
    var timeLeft = getTimeLeft(g.housing.rentPaid, g.housing.rentDays || 1);
    if (timeLeft.expired) {
        setMessage('❌ Аренда дома истекла! Оплатите в Магистрате.');
        return;
    }
    
    g.location.place = 'Дом';
    g.location.location = 'Королевская Гавань';
    setMessage('🏠 Вы вошли в свой дом.');
    addLog('🏠 ' + currentUser + ' вошёл в дом');
    updateMenu();
    updateStory();
    updateActions();
    saveData();
}

function restAtHome() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.housing || !g.housing.type) {
        setMessage('❌ У вас нет дома!');
        return;
    }
    
    var house = HOUSING_TYPES[g.housing.type];
    var timeLeft = getTimeLeft(g.housing.rentPaid, g.housing.rentDays || 1);
    if (timeLeft.expired) {
        setMessage('❌ Аренда дома истекла! Оплатите в Магистрате.');
        return;
    }
    
    g.hp = Math.min(g.maxHp, g.hp + house.restHp);
    g.fatigue = Math.min(100, g.fatigue + house.restFatigue);
    setMessage('🛏️ Вы отдохнули дома. HP +' + house.restHp + ', усталость +' + house.restFatigue);
    addLog('🛏️ ' + currentUser + ' отдохнул в ' + house.name);
    updateMenu();
    saveData();
}

function viewDistrict(district) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (g.housing && g.housing.type) {
        setMessage('❌ У вас уже есть жильё!');
        return;
    }
    
    var districtMap = {
        'Королевский квартал': ['mansion', 'townhouse'],
        'Торговый квартал': ['house', 'room'],
        'Квартал бедноты': ['night']
    };
    var types = districtMap[district];
    if (!types) {
        setMessage('❌ В этом районе нет жилья.');
        return;
    }
    
    var msg = '📍 ' + district + '\n\nДоступные варианты:\n';
    var availableTypes = [];
    types.forEach(function(type) {
        var house = HOUSING_TYPES[type];
        var market = housingMarket[type];
        var available = market.total - market.occupied;
        if (available > 0) {
            availableTypes.push(type);
            msg += house.emoji + ' ' + house.name + ' — ' + house.price + ' зол. (свободно: ' + available + ')\n';
        } else {
            msg += house.emoji + ' ' + house.name + ' — ❌ РАСПРОДАНО\n';
        }
    });
    
    if (availableTypes.length === 0) {
        setMessage(msg + '\n❌ В этом районе нет свободного жилья.');
        return;
    }
    
    msg += '\nВведите номер для покупки:\n';
    availableTypes.forEach(function(type, i) {
        var house = HOUSING_TYPES[type];
        msg += (i + 1) + '. ' + house.emoji + ' ' + house.name + ' (' + house.price + ' зол., аренда ' + house.rent + '/нед)\n';
    });
    msg += '0. Отмена';
    
    var choice = prompt(msg);
    if (!choice || choice === '0') { setMessage('❌ Отменено.'); return; }
    var index = parseInt(choice) - 1;
    if (isNaN(index) || index < 0 || index >= availableTypes.length) {
        setMessage('❌ Неверный выбор.');
        return;
    }
    
    var selectedType = availableTypes[index];
    var house = HOUSING_TYPES[selectedType];
    var market = housingMarket[selectedType];
    var available = market.total - market.occupied;
    if (available <= 0) {
        setMessage('❌ К сожалению, все ' + house.name + ' распродали!');
        return;
    }
    
    var confirmMsg = '🏠 ' + house.name + '\n' +
                     '📖 ' + house.description + '\n' +
                     '📍 ' + house.district + '\n' +
                     '💰 Цена: ' + house.price + ' зол.\n' +
                     '💳 Аренда: ' + house.rent + ' зол./нед\n' +
                     '📦 Склад: ' + house.storageSlots + ' слотов\n' +
                     '🛏️ Отдых: +' + house.restHp + ' HP\n' +
                     '📊 Свободно: ' + available + ' из ' + market.total + '\n\n' +
                     'Купить? (да/нет)';
    if (confirm(confirmMsg)) {
        buyHouse(selectedType);
    }
}

// ============================================================
// 6. СКЛАД
// ============================================================

function openStorage() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.housing || !g.housing.type) { setMessage('❌ У вас нет жилья!'); return; }
    
    var house = HOUSING_TYPES[g.housing.type];
    var storage = g.housing.storage || [];
    
    var modal = document.getElementById('modal-storage');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-storage';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeStorage(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📦 СКЛАД</h3><button class="close-btn" onclick="closeStorage()">✕</button></div><div id="modal-storage-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-storage-content');
    
    var html = '<div class="modal-section"><h4>📦 СКЛАД (' + house.name + ')</h4>';
    html += '<p style="color:#6a5a48;">Свободно: ' + ((house.storageSlots || 10) - storage.length) + '/' + house.storageSlots + ' слотов</p>';
    
    if (storage.length === 0) {
        html += '<p style="color:#6a5a48;text-align:center;padding:20px 0;">📭 Склад пуст</p>';
    } else {
        storage.forEach(function(item, i) {
            var quality = item.quality || 'Обычное';
            var q = QUALITIES[quality] || QUALITIES['Обычное'];
            var countDisplay = '';
            if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
            html += '<div class="row" style="padding:4px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label" style="color:' + q.color + ';">' + q.emoji + ' ' + item.name + ' (' + quality + ')' + countDisplay + '</span>';
            html += '<span class="value">';
            html += ' <button class="btn btn-small" onclick="takeFromStorage(' + i + ')">📤 Забрать</button>';
            html += '</span></div>';
        });
    }
    
    html += '<hr style="border-color:#2a201a;margin:10px 0;">';
    html += '<button class="btn" onclick="moveToStorage()">📥 Положить предмет</button>';
    html += '<button class="btn btn-secondary" onclick="closeStorage()" style="margin-top:10px;">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeStorage() {
    var modal = document.getElementById('modal-storage');
    if (modal) modal.classList.add('hide');
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
    
    var choices = 'Выберите предмет для склада:\n';
    g.inventory.forEach(function(item, i) {
        var countDisplay = '';
        if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
        choices += (i + 1) + '. ' + item.name + ' (' + (item.quality || 'Обычное') + ')' + countDisplay + '\n';
    });
    
    var choice = prompt(choices + '\nВведите номер предмета:');
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
    openStorage();
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
    openStorage();
}

function openStorageHold() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var hold = (g.housing && g.housing.storageHold) || [];
    
    var modal = document.getElementById('modal-storage-hold');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-storage-hold';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeStorageHold(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📦 КАМЕРА ХРАНЕНИЯ</h3><button class="close-btn" onclick="closeStorageHold()">✕</button></div><div id="modal-storage-hold-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-storage-hold-content');
    
    var html = '<div class="modal-section"><h4>📦 КАМЕРА ХРАНЕНИЯ МАГИСТРАТА</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Здесь хранятся вещи из просроченных домов и лавок.</p>';
    html += '<p style="color:#6a5a48;font-size:12px;">📊 Всего предметов: ' + hold.length + '</p>';
    
    if (hold.length === 0) {
        html += '<p style="color:#6a5a48;text-align:center;padding:20px 0;">📭 Хранилище пусто</p>';
    } else {
        var grouped = {};
        hold.forEach(function(item, idx) {
            var key = item.name + '|' + (item.quality || 'Обычное');
            if (!grouped[key]) {
                grouped[key] = { item: item, indices: [], count: 0 };
            }
            grouped[key].indices.push(idx);
            grouped[key].count += (item.count || 1);
        });
        
        for (var key in grouped) {
            var data = grouped[key];
            var item = data.item;
            var quality = item.quality || 'Обычное';
            var q = QUALITIES[quality] || QUALITIES['Обычное'];
            var countDisplay = data.count > 1 ? ' ×' + data.count : '';
            html += '<div class="row" style="padding:4px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label" style="color:' + q.color + ';">' + q.emoji + ' ' + item.name + ' (' + quality + ')' + countDisplay + '</span>';
            html += '<span class="value">';
            html += '<button class="btn btn-small" onclick="takeFromStorageHold(\'' + key + '\')">📤 Забрать все</button>';
            html += '</span></div>';
        }
    }
    
    html += '<button class="btn btn-secondary" onclick="closeStorageHold()" style="margin-top:10px;">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeStorageHold() {
    var modal = document.getElementById('modal-storage-hold');
    if (modal) modal.classList.add('hide');
}

function takeFromStorageHold(key) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.housing || !g.housing.storageHold) { setMessage('❌ Хранилище пусто.'); return; }
    
    var hold = g.housing.storageHold;
    var parts = key.split('|');
    var name = parts[0];
    var quality = parts[1] || 'Обычное';
    
    var indices = [];
    hold.forEach(function(item, i) {
        if (item.name === name && (item.quality || 'Обычное') === quality) {
            indices.push(i);
        }
    });
    
    if (indices.length === 0) { setMessage('❌ Предметы не найдены.'); return; }
    
    var totalCount = 0;
    indices.forEach(function(i) {
        totalCount += hold[i].count || 1;
    });
    
    if (g.inventory.length + totalCount > 50) {
        setMessage('❌ В инвентаре недостаточно места! (макс. 50)');
        return;
    }
    
    var items = [];
    indices.sort(function(a, b) { return b - a; }).forEach(function(i) {
        items.push(hold.splice(i, 1)[0]);
    });
    items.forEach(function(item) { addToInventory(g, item); });
    
    setMessage('✅ Вы забрали ' + items.length + ' ' + name + ' из хранилища.');
    addLog('📤 ' + currentUser + ' забрал ' + items.length + ' ' + name + ' из хранилища');
    saveData();
    updateMenu();
    openStorageHold();
}

// ============================================================
// 7. КОНЮШНЯ
// ============================================================

function openStable() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    checkHorseReset();
    
    var modal = document.getElementById('modal-stable');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-stable';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeStable(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🐴 КОНЮШНЯ</h3><button class="close-btn" onclick="closeStable()">✕</button></div><div id="modal-stable-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-stable-content');
    var html = '';
    
    if (g.equipment && g.equipment.horse) {
        var horse = HORSE_TYPES[g.equipment.horse.horseType];
        if (horse) {
            html += '<div style="background:#120e0b;border:1px solid #3d3026;border-radius:12px;padding:14px;margin-bottom:16px;">';
            html += '<div style="color:#c9b694;font-size:16px;">🐴 ВАША ЛОШАДЬ</div>';
            html += '<div style="color:#b8a890;">' + horse.emoji + ' ' + horse.name + '</div>';
            html += '<div style="color:#6a5a48;font-size:12px;">❤️ HP: ' + g.equipment.horse.hp + '/' + g.equipment.horse.maxHp + '</div>';
            html += '<div style="color:#6a5a48;font-size:12px;">⚡ Скорость: +' + horse.speedBonus + '%</div>';
            html += '<button class="btn btn-danger" onclick="sellHorse(); closeStable();" style="margin-top:8px;">💰 Продать лошадь</button>';
            html += '</div>';
        }
    } else {
        html += '<p style="color:#6a5a48;text-align:center;padding:10px 0;">🐴 У вас нет лошади.</p>';
    }
    
    html += '<h4 style="color:#c9b694;margin-top:16px;">📦 ДОСТУПНЫЕ ЛОШАДИ (обновление раз в неделю)</h4>';
    
    for (var key in HORSE_TYPES) {
        var h = HORSE_TYPES[key];
        var market = horseMarket[key];
        var available = market.total - market.sold;
        var isOwned = g.equipment && g.equipment.horse && g.equipment.horse.horseType === key;
        
        html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #1a1410;">';
        html += '<div>' + h.emoji + ' <strong>' + h.name + '</strong>';
        if (isOwned) html += ' <span style="color:#7ac98a;">✅ Ваша</span>';
        html += '<br><span style="font-size:11px;color:#6a5a48;">' + h.description + '</span></div>';
        html += '<div style="text-align:right;">';
        if (isOwned) {
            html += '<span style="color:#7ac98a;">Уже куплена</span>';
        } else if (available > 0) {
            html += '<span style="color:#c9b694;">' + formatCurrency(h.price * 210 * 56) + '</span><br>';
            html += '<span style="font-size:10px;color:#6a5a48;">Осталось: ' + available + '</span><br>';
            html += '<button class="btn btn-small" onclick="buyHorse(\'' + key + '\'); closeStable();" style="margin-top:4px;">✅ Купить</button>';
        } else {
            html += '<span style="color:#c96a5a;">❌ РАСПРОДАНО</span>';
        }
        html += '</div></div>';
    }
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeStable() {
    var modal = document.getElementById('modal-stable');
    if (modal) modal.classList.add('hide');
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
        setMessage('❌ Все ' + horse.name + ' на этой неделе уже проданы!');
        return;
    }
    
    if (g.equipment && g.equipment.horse) {
        setMessage('❌ У вас уже есть лошадь! Продайте её.');
        return;
    }
    
    if (!spendMoney(g, horse.price * 210 * 56)) {
        setMessage('❌ Недостаточно денег! Нужно: ' + formatCurrency(horse.price * 210 * 56));
        return;
    }
    
    g.equipment.horse = {
        type: 'horse',
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
}

// ============================================================
// 8. СЕПТА
// ============================================================

function openTemple() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var maxHp = getMaxHp(g);
    
    var modal = document.getElementById('modal-temple');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-temple';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeTemple(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>⛪ ВЕЛИКАЯ СЕПТА</h3><button class="close-btn" onclick="closeTemple()">✕</button></div><div id="modal-temple-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-temple-content');
    
    var html = '<div class="modal-section"><h4>⛪ ВЕЛИКАЯ СЕПТА БЕЙЛОРА</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Храм Семерых. Исцеление, молитва и удача.</p>';
    html += '<p style="color:#6a5a48;">💰 ' + formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper) + '</p>';
    html += '</div>';
    
    var lastHeal = g.lastHeal || 0;
    var canHeal = (Date.now() - lastHeal) >= 2 * 60 * 60 * 1000;
    html += '<div class="modal-section"><h4>💉 БЕСПЛАТНОЕ ИСЦЕЛЕНИЕ</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Раз в 2 часа. Полное восстановление HP.</p>';
    if (g.hp >= maxHp) {
        html += '<div style="color:#7ac98a;">✅ Вы полностью здоровы!</div>';
    } else if (canHeal) {
        html += '<button class="btn" onclick="freeHeal(); closeTemple();">💉 Исцелиться (бесплатно)</button>';
    } else {
        var timeLeft = Math.ceil((2 * 60 * 60 * 1000 - (Date.now() - lastHeal)) / (60 * 1000));
        html += '<div style="color:#c96a5a;">⏳ Доступно через ' + timeLeft + ' мин.</div>';
    }
    html += '</div>';
    
    var blessing = g.blessing || { active: false, expires: 0 };
    html += '<div class="modal-section"><h4>🙏 МОЛИТВА (Благословение)</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">+10% к опыту на 1 час. Раз в сутки.</p>';
    if (blessing.active && blessing.expires > Date.now()) {
        var timeLeft = Math.ceil((blessing.expires - Date.now()) / 60000);
        html += '<div style="color:#7ac98a;">✅ Благословение активно! Осталось: ' + timeLeft + ' мин.</div>';
    } else {
        var lastPrayer = g.lastPrayer || 0;
        var dayMs = 24 * 60 * 60 * 1000;
        if (Date.now() - lastPrayer >= dayMs) {
            html += '<button class="btn" onclick="prayForBlessing(); closeTemple();">🙏 Помолиться (бесплатно, 1 раз в день)</button>';
        } else {
            var timeLeft = Math.ceil((dayMs - (Date.now() - lastPrayer)) / (60 * 60 * 1000));
            html += '<div style="color:#c96a5a;">⏳ Молитва доступна через ' + timeLeft + ' ч.</div>';
        }
    }
    html += '</div>';
    
    html += '<div class="modal-section"><h4>🍀 УДАЧА</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">🍀 Текущая удача: <strong>' + (g.luck || 0) + '/25</strong></p>';
    html += '<p style="color:#6a5a48;font-size:12px;">💰 1000 золота → +5 удачи</p>';
    if ((g.luck || 0) >= 25) {
        html += '<p style="color:#7ac98a;">✅ Максимум удачи достигнут!</p>';
    } else {
        var canAfford = g.gold * 210 * 56 + g.silver * 56 + g.copper >= 1000 * 210 * 56;
        html += '<button class="btn" onclick="donateLuck(); closeTemple();" ' + (canAfford ? '' : 'disabled') + '>';
        html += '💰 Купить удачу (1000 зол.)';
        if (!canAfford) html += ' ❌';
        html += '</button>';
    }
    html += '</div>';
    
    html += '<div class="modal-section"><h4>🧪 ЗЕЛЬЯ</h4>';
    var potions = [
        { id: 'health_small', name: '🧪 Малое зелье здоровья', price: 30, hp: 20 },
        { id: 'health_medium', name: '🧪 Среднее зелье здоровья', price: 80, hp: 50 },
        { id: 'health_large', name: '🧪 Большое зелье здоровья', price: 150, hp: 100 },
        { id: 'restore', name: '🧪 Зелье восстановления', price: 200, hp: 50, fatigue: 30 },
        { id: 'stamina', name: '🧪 Зелье выносливости', price: 100, hp: 10, fatigue: 20 }
    ];
    potions.forEach(function(potion) {
        var canBuy = g.gold * 210 * 56 + g.silver * 56 + g.copper >= potion.price;
        html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
        html += '<span class="label" style="font-size:13px;">' + potion.name + '</span>';
        html += '<span class="value" style="font-size:11px;">';
        html += '❤️ +' + potion.hp + ' HP';
        if (potion.fatigue > 0) html += ' | 😴 +' + potion.fatigue + ' устал.';
        html += ' | 💰' + formatCurrency(potion.price);
        html += ' <button class="btn btn-small" onclick="buyPotion(\'' + potion.id + '\',' + potion.price + ',' + potion.hp + ',' + (potion.fatigue || 0) + '); openTemple();" ' + (canBuy ? '' : 'disabled') + '>' + (canBuy ? 'Купить' : '❌') + '</button>';
        html += '</span></div>';
    });
    html += '</div>';
    
    html += '<button class="btn btn-secondary" onclick="closeTemple()">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeTemple() {
    var modal = document.getElementById('modal-temple');
    if (modal) modal.classList.add('hide');
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
    openTemple();
}

// ============================================================
// 9. БИБЛИОТЕКА
// ============================================================

function openLibrary() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var available = getBooksAvailable(g);
    
    var modal = document.getElementById('modal-library');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-library';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeLibrary(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📚 БИБЛИОТЕКА</h3><button class="close-btn" onclick="closeLibrary()">✕</button></div><div id="modal-library-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-library-content');
    
    var html = '<div class="modal-section"><h4>📚 БИБЛИОТЕКА МЕЙСТЕРОВ</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Мейстеры хранят древние знания. Читайте книги, чтобы стать сильнее.</p>';
    html += '<p style="color:#6a5a48;">💰 ' + formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper) + '</p>';
    html += '<p style="color:#ffd700;">📖 Осталось покупок сегодня: ' + available + '/3</p>';
    html += '</div>';
    
    html += '<div class="modal-section"><h4>📖 КУПИТЬ КНИГИ</h4>';
    var books = [
        { level: 1, xp: 50, price: 100 },
        { level: 5, xp: 100, price: 200 },
        { level: 10, xp: 150, price: 350 },
        { level: 15, xp: 200, price: 500 },
        { level: 20, xp: 300, price: 700 },
        { level: 25, xp: 400, price: 1000 }
    ];
    books.forEach(function(book) {
        var canBuy = available > 0 && g.gold * 210 * 56 + g.silver * 56 + g.copper >= book.price;
        html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
        html += '<span class="label">📖 Искусство войны (ур.' + book.level + ')</span>';
        html += '<span class="value">' + formatCurrency(book.price) + ' <button class="btn btn-small" onclick="buyBook(' + book.level + ',' + book.xp + ',' + book.price + ')" ' + (canBuy ? '' : 'disabled') + '>' + (canBuy ? '✅ Купить' : '❌') + '</button></span>';
        html += '</div>';
    });
    html += '</div>';
    
    var userBooks = [];
    g.inventory.forEach(function(item, idx) {
        if (item.isBook) userBooks.push(idx);
    });
    html += '<div class="modal-section"><h4>📚 ВАШИ КНИГИ</h4>';
    if (userBooks.length === 0) {
        html += '<p style="color:#6a5a48;">У вас нет книг.</p>';
    } else {
        userBooks.forEach(function(idx) {
            var item = g.inventory[idx];
            html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label">📖 ' + item.name + ' (ур.' + item.level + ')</span>';
            html += '<span class="value">';
            html += '<button class="btn btn-small" onclick="readBook(' + idx + ')">📖 Читать</button>';
            html += ' <button class="btn btn-small" onclick="sellBook(' + idx + ')">💰 Продать</button>';
            html += '</span></div>';
        });
    }
    html += '</div>';
    
    html += '<button class="btn btn-secondary" onclick="closeLibrary()" style="margin-top:10px;">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeLibrary() {
    var modal = document.getElementById('modal-library');
    if (modal) modal.classList.add('hide');
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
    if (available <= 0) { setMessage('❌ Вы уже купили 3 книги сегодня.'); return; }
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
    openLibrary();
}

function sellBook(index) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (index >= g.inventory.length) { setMessage('❌ Книга не найдена.'); return; }
    
    var item = g.inventory[index];
    if (!item.isBook) { setMessage('❌ Это не книга.'); return; }
    
    var price = Math.round(item.xp * 2);
    g.copper += price;
    convertCurrency(g);
    g.inventory.splice(index, 1);
    
    saveData();
    setMessage('💰 Вы продали книгу за ' + formatCurrency(price));
    addLog('💰 ' + currentUser + ' продал книгу');
    updateMenu();
    openLibrary();
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
    
    if (!weaponType) { setMessage('❌ Наденьте оружие для чтения книги.'); return; }
    
    var baseTime = 30;
    var intelligence = Math.min(30, g.stats.intelligence || 1);
    var readTimeMinutes = Math.max(5, baseTime - intelligence);
    var readTimeMs = readTimeMinutes * 60 * 1000;
    
    setMessage('⏳ Чтение книги займёт ' + readTimeMinutes + ' мин.');
    
    if (busyTimer) clearTimeout(busyTimer);
    isBusy = true;
    document.getElementById('busy-status').classList.remove('hide');
    document.getElementById('busy-status').textContent = '📖 Чтение книги... (' + readTimeMinutes + ' мин)';
    updateActions();
    
    busyTimer = setTimeout(function() {
        var xpMultiplier = 1 + (g.stats.intelligence / 100);
        var xpGain = Math.round(item.xp * xpMultiplier);
        
        g.xp += xpGain;
        while (g.xp >= g.nextLevelXp) {
            g.xp -= g.nextLevelXp;
            g.level++;
            g.nextLevelXp = 100 + g.level * 10;
            if (g.level <= 100) {
                g.attributePoints++;
                setMessage('🎉 Вы достигли ' + g.level + ' уровня! +1 очко атрибутов.');
            } else {
                setMessage('🎉 Вы достигли ' + g.level + ' уровня!');
            }
        }
        
        if (g.skills[weaponType]) {
            g.skills[weaponType].xp = (g.skills[weaponType].xp || 0) + xpGain;
            var needed = g.skills[weaponType].level * 20 + 10;
            while (g.skills[weaponType].xp >= needed) {
                g.skills[weaponType].xp -= needed;
                g.skills[weaponType].level = Math.min(999, g.skills[weaponType].level + 1);
                setMessage('⚔️ Мастерство повышено до ' + g.skills[weaponType].level + '!');
            }
        }
        
        g.inventory.splice(index, 1);
        saveData();
        setMessage('📖 Вы прочитали книгу! +' + xpGain + ' XP');
        updateMenu();
        openLibrary();
        
        isBusy = false;
        document.getElementById('busy-status').classList.add('hide');
        busyTimer = null;
        updateActions();
    }, readTimeMs);
}

// ============================================================
// 10. ГИЛЬДИЯ НАЁМНИКОВ
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
    
    var modal = document.getElementById('modal-guildhall');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-guildhall';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeGuildHall(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🗡️ ГИЛЬДИЯ НАЁМНИКОВ</h3><button class="close-btn" onclick="closeGuildHall()">✕</button></div><div id="modal-guildhall-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-guildhall-content');
    
    var html = '<div class="modal-section"><h4>🗡️ ГИЛЬДИЯ НАЁМНИКОВ</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Задания обновляются каждые 5 часов.</p>';
    html += '<p style="color:#6a5a48;font-size:12px;">⏳ Следующее обновление через: ' + hoursLeft + ' ч ' + minutesLeft + ' мин</p>';
    
    if (g.quests.active) {
        var activeQuest = null;
        for (var i = 0; i < quests.length; i++) {
            if (quests[i].id === g.quests.active) { activeQuest = quests[i]; break; }
        }
        if (activeQuest) {
            var progress = g.quests.progress[activeQuest.id] || 0;
            var percent = Math.min(100, Math.round((progress / activeQuest.count) * 100));
            html += '<div style="background:#2a201a;border:1px solid #ffd700;border-radius:12px;padding:14px;margin:10px 0;">';
            html += '<div style="color:#ffd700;">📌 АКТИВНОЕ ЗАДАНИЕ</div>';
            html += '<div style="font-size:16px;color:#c9b694;">' + activeQuest.name + '</div>';
            html += '<div style="color:#6a5a48;font-size:12px;">' + activeQuest.desc + '</div>';
            html += '<div style="color:#6a5a48;font-size:12px;">📊 Прогресс: ' + progress + '/' + activeQuest.count + ' (' + percent + '%)</div>';
            html += '<div style="color:#6a5a48;font-size:12px;">Награда: ' + formatCurrency(activeQuest.rewardGold) + ', ' + activeQuest.rewardXp + ' XP</div>';
            html += '<button class="btn btn-small" onclick="abandonQuest()" style="margin-top:6px;">❌ Отказаться</button>';
            html += '</div>';
        }
    }
    
    html += '<h4 style="margin-top:10px;">📜 ДОСТУПНЫЕ ЗАДАНИЯ</h4>';
    quests.forEach(function(quest) {
        var isCompleted = false;
        for (var k = 0; k < g.quests.completed.length; k++) {
            if (g.quests.completed[k] === quest.id) { isCompleted = true; break; }
        }
        var isActive = g.quests.active === quest.id;
        var canTake = !isCompleted && !isActive && !g.quests.active;
        
        html += '<div style="background:#120e0b;border:1px solid #2a201a;border-radius:10px;padding:12px;margin:6px 0;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
        html += '<div>';
        html += '<div style="font-size:14px;color:#c9b694;">' + quest.name + ' <span style="font-size:11px;color:#6a5a48;">' + quest.difficulty + '</span></div>';
        html += '<div style="font-size:12px;color:#6a5a48;">' + quest.desc + '</div>';
        html += '<div style="font-size:11px;color:#6a5a48;">💰 ' + formatCurrency(quest.rewardGold) + ' | ⭐ ' + quest.rewardXp + ' XP</div>';
        html += '</div>';
        html += '<div>';
        if (isCompleted) {
            html += '<span style="color:#7ac98a;">✅ Выполнено</span>';
        } else if (isActive) {
            html += '<span style="color:#ffd700;">⏳ В процессе</span>';
        } else if (canTake) {
            html += '<button class="btn btn-small" onclick="takeQuest(\'' + quest.id + '\')">📋 Взять</button>';
        } else {
            html += '<span style="color:#6a5a48;">🔒 Занято</span>';
        }
        html += '</div></div></div>';
    });
    
    html += '</div>';
    html += '<button class="btn btn-secondary" onclick="closeGuildHall()" style="margin-top:10px;">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeGuildHall() {
    var modal = document.getElementById('modal-guildhall');
    if (modal) modal.classList.add('hide');
}

function generateDailyQuests() {
    var easy = [
        { id: 'easy_kill_rats', name: '🐀 Крысиная охота', desc: 'Убить 5 крыс', type: 'kill', target: 'Крыса', count: 5, rewardGold: 50, rewardXp: 20, difficulty: '🟢 Лёгкий' },
        { id: 'easy_gather_skins', name: '🧵 Сбор шкур', desc: 'Принести 10 шкур', type: 'gather', target: 'Шкура', count: 10, rewardGold: 40, rewardXp: 15, difficulty: '🟢 Лёгкий' },
        { id: 'easy_gather_wood', name: '🪵 Дрова для таверны', desc: 'Принести 15 дерева', type: 'gather', target: 'Дерево', count: 15, rewardGold: 35, rewardXp: 12, difficulty: '🟢 Лёгкий' },
        { id: 'easy_gather_meat', name: '🥩 Охотник', desc: 'Принести 5 мяса', type: 'gather', target: 'Мясо', count: 5, rewardGold: 45, rewardXp: 18, difficulty: '🟢 Лёгкий' },
        { id: 'easy_gather_water', name: '💧 Чистая вода', desc: 'Принести 10 воды', type: 'gather', target: 'Вода', count: 10, rewardGold: 25, rewardXp: 8, difficulty: '🟢 Лёгкий' }
    ];
    
    var medium = [
        { id: 'medium_kill_bandits', name: '🗡️ Очистка дорог', desc: 'Убить 5 бандитов', type: 'kill', target: 'Бандит', count: 5, rewardGold: 150, rewardXp: 50, difficulty: '🟡 Средний' },
        { id: 'medium_gather_ore', name: '⛏️ Поставка руды', desc: 'Принести 20 руды', type: 'gather', target: 'Руда железная', count: 20, rewardGold: 100, rewardXp: 40, difficulty: '🟡 Средний' },
        { id: 'medium_kill_wolves', name: '🐺 Волчий бич', desc: 'Убить 3 волков', type: 'kill', target: 'Волк', count: 3, rewardGold: 120, rewardXp: 45, difficulty: '🟡 Средний' },
        { id: 'medium_gather_coal', name: '🔥 Уголь для кузни', desc: 'Принести 15 угля', type: 'gather', target: 'Уголь', count: 15, rewardGold: 90, rewardXp: 35, difficulty: '🟡 Средний' }
    ];
    
    var hard = [
        { id: 'hard_kill_thugs', name: '⚔️ Уничтожение банды', desc: 'Убить 3 головорезов', type: 'kill', target: 'Головорез', count: 3, rewardGold: 300, rewardXp: 100, difficulty: '🔴 Сложный' },
        { id: 'hard_kill_bears', name: '🐻 Медвежья угроза', desc: 'Убить 2 медведей', type: 'kill', target: 'Медведь', count: 2, rewardGold: 350, rewardXp: 120, difficulty: '🔴 Сложный' }
    ];
    
    var shuffledEasy = easy.sort(function() { return Math.random() - 0.5; }).slice(0, 2);
    var shuffledMedium = medium.sort(function() { return Math.random() - 0.5; }).slice(0, 2);
    var shuffledHard = hard.sort(function() { return Math.random() - 0.5; }).slice(0, 2);
    
    return shuffledEasy.concat(shuffledMedium).concat(shuffledHard);
}

function takeQuest(questId) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (g.quests.active) { setMessage('❌ У вас уже есть активное задание!'); return; }
    
    g.quests.active = questId;
    if (!g.quests.progress) g.quests.progress = {};
    g.quests.progress[questId] = 0;
    
    saveData();
    setMessage('📋 Вы взяли задание!');
    addLog('📋 ' + currentUser + ' взял задание ' + questId);
    updateMenu();
    openGuildHall();
}

function abandonQuest() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.quests.active) { setMessage('❌ У вас нет активного задания.'); return; }
    
    g.quests.active = null;
    saveData();
    setMessage('❌ Вы отказались от задания.');
    addLog('❌ ' + currentUser + ' отказался от задания');
    updateMenu();
    openGuildHall();
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
                setMessage('🎉 Вы достигли ' + g.level + ' уровня! +1 очко атрибутов.');
            } else {
                setMessage('🎉 Вы достигли ' + g.level + ' уровня!');
            }
        }
        
        saveData();
        setMessage('✅ Задание выполнено! +' + formatCurrency(quest.rewardGold) + ', +' + xpGain + ' XP');
        addLog('✅ ' + currentUser + ' выполнил задание ' + quest.name);
        updateMenu();
        openGuildHall();
    }
}

// ============================================================
// 11. БОРДЕЛЬ
// ============================================================

function openBrothel() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var services = [
        { id: 'rest', name: '🛏️ Отдых с девушкой', desc: '+50 усталости, +10 HP', price: 20, fatigue: 50, hp: 10, buff: null },
        { id: 'wine', name: '🍷 Вино с компанией', desc: '+30 усталости, +5 HP, бафф "Веселье" (+5% XP 30 мин)', price: 50, fatigue: 30, hp: 5, buff: { type: 'xp', value: 5, duration: 30 } },
        { id: 'dance', name: '💃 Танец', desc: '+20 усталости, бафф "Вдохновение" (+10% урон 15 мин)', price: 100, fatigue: 20, hp: 0, buff: { type: 'damage', value: 10, duration: 15 } },
        { id: 'vip', name: '👑 VIP-комната', desc: '+80 усталости, +20 HP, бафф "+15% XP 1 час"', price: 200, fatigue: 80, hp: 20, buff: { type: 'xp', value: 15, duration: 60 } }
    ];
    
    var modal = document.getElementById('modal-brothel');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-brothel';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeBrothel(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>💃 БОРДЕЛЬ</h3><button class="close-btn" onclick="closeBrothel()">✕</button></div><div id="modal-brothel-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-brothel-content');
    
    var html = '<div class="modal-section"><h4>💃 БОРДЕЛЬ КОРОЛЕВСКОЙ ГАВАНИ</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Тёплый приём, вино и отдых для уставших путников.</p>';
    html += '<p style="color:#6a5a48;">💰 ' + formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper) + '</p>';
    html += '<p style="color:#6a5a48;">😴 Усталость: ' + g.fatigue + '/100</p>';
    html += '</div>';
    
    html += '<div class="modal-section"><h4>🛏️ УСЛУГИ</h4>';
    services.forEach(function(service) {
        var canAfford = g.gold * 210 * 56 + g.silver * 56 + g.copper >= service.price;
        html += '<div class="row" style="padding:8px 0; border-bottom:1px solid #1a1410;">';
        html += '<div style="flex:1;">';
        html += '<div style="color:#c9b694;">' + service.name + '</div>';
        html += '<div style="font-size:11px;color:#6a5a48;">' + service.desc + '</div>';
        html += '</div>';
        html += '<div style="text-align:right;">';
        html += '<span style="color:#6a5a48;">' + formatCurrency(service.price) + '</span><br>';
        html += '<button class="btn btn-small" onclick="useBrothelService(\'' + service.id + '\',' + service.price + ',' + service.fatigue + ',' + service.hp + ',\'' + (service.buff ? JSON.stringify(service.buff) : 'null') + '\')" ' + (canAfford ? '' : 'disabled') + '>' + (canAfford ? '✅ Взять' : '❌') + '</button>';
        html += '</div></div>';
    });
    html += '</div>';
    
    if (g.brothelBuffs && g.brothelBuffs.length > 0) {
        html += '<div class="modal-section"><h4>✨ АКТИВНЫЕ БАФФЫ</h4>';
        var now = Date.now();
        g.brothelBuffs.forEach(function(buff) {
            if (buff.expires > now) {
                var timeLeft = Math.ceil((buff.expires - now) / 60000);
                html += '<div class="row">';
                html += '<span class="label" style="color:#ffd700;">' + buff.name + '</span>';
                html += '<span class="value">' + buff.desc + ' (' + timeLeft + ' мин)</span>';
                html += '</div>';
            }
        });
        html += '</div>';
    }
    
    html += '<div class="modal-section"><h4>🎲 ИГРА В КОСТИ (PvP)</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Сыграйте с другим игроком. Победитель забирает банк!</p>';
    
    var activeGames = getActiveDiceGames();
    if (activeGames.length > 0) {
        html += '<p style="color:#6a5a48;font-size:12px;">📋 Активные игры:</p>';
        activeGames.forEach(function(game) {
            if (game.creator !== currentUser) {
                var timeLeft = Math.ceil((game.createdAt + 5 * 60 * 1000 - Date.now()) / 60000);
                html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
                html += '<span class="label">🎲 ' + game.creator + ' (ставка: ' + formatCurrency(game.bet) + ')</span>';
                html += '<span class="value">';
                html += '<span style="font-size:11px;color:#6a5a48;">⏳ ' + timeLeft + ' мин</span> ';
                html += '<button class="btn btn-small" onclick="joinDiceGame(\'' + game.id + '\')">📥 Присоединиться</button>';
                html += '</span></div>';
            }
        });
    } else {
        html += '<p style="color:#6a5a48;font-size:11px;">Нет активных игр. Создайте свою!</p>';
    }
    
    html += '<div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">';
    var betOptions = [10, 25, 50, 100, 200];
    betOptions.forEach(function(bet) {
        var canAfford = g.gold * 210 * 56 + g.silver * 56 + g.copper >= bet;
        html += '<button class="btn btn-small" onclick="createDiceGame(' + bet + ')" ' + (canAfford ? '' : 'disabled') + ' style="flex:1;min-width:60px;">🎲 ' + formatCurrency(bet) + '</button>';
    });
    html += '</div>';
    html += '</div>';
    
    html += '<button class="btn btn-secondary" onclick="closeBrothel()" style="margin-top:10px;">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeBrothel() {
    var modal = document.getElementById('modal-brothel');
    if (modal) modal.classList.add('hide');
}

function useBrothelService(serviceId, price, fatigue, hp, buffData) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!spendMoney(g, price)) { setMessage('❌ Недостаточно денег!'); return; }
    
    g.fatigue = Math.min(100, g.fatigue + fatigue);
    if (hp > 0) g.hp = Math.min(g.maxHp, g.hp + hp);
    
    if (buffData && buffData !== 'null') {
        var buff = JSON.parse(buffData);
        if (!g.brothelBuffs) g.brothelBuffs = [];
        var buffNames = { 'xp': '🎯 Благословение опыта', 'damage': '⚔️ Вдохновение' };
        g.brothelBuffs.push({
            name: buffNames[buff.type] || 'Бафф',
            desc: '+' + buff.value + '% ' + (buff.type === 'xp' ? 'опыта' : 'урона'),
            type: buff.type,
            value: buff.value,
            expires: Date.now() + buff.duration * 60 * 1000
        });
    }
    
    var serviceNames = { 'rest': 'Отдых с девушкой', 'wine': 'Вино с компанией', 'dance': 'Танец', 'vip': 'VIP-комната' };
    
    saveData();
    setMessage('✅ ' + serviceNames[serviceId] + '! +' + fatigue + ' усталости' + (hp > 0 ? ', +' + hp + ' HP' : ''));
    addLog('💃 ' + currentUser + ' посетил бордель (' + serviceNames[serviceId] + ')');
    updateMenu();
    openBrothel();
}

// ============================================================
// 12. РЫНОК (ЛАВКИ)
// ============================================================

function openMarket() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var modal = document.getElementById('modal-market');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-market';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeMarket(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🏪 РЫНОК</h3><button class="close-btn" onclick="closeMarket()">✕</button></div><div id="modal-market-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-market-content');
    
    var html = '<div class="modal-section"><h4>🏪 РЫНОК КОРОЛЕВСКОЙ ГАВАНИ</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Здесь можно торговать с другими игроками.</p>';
    
    if (g.marketStall && g.marketStall.owned) {
        var stall = marketStalls[g.marketStall.stallId];
        var timeLeft = getTimeLeft(stall.rentPaid, stall.rentDays || 1);
        html += '<div style="background:#120e0b;border:1px solid #3d3026;border-radius:12px;padding:14px;margin:10px 0;">';
        html += '<div style="color:#c9b694;font-size:16px;">🏪 Ваша лавка #' + g.marketStall.stallId + '</div>';
        if (timeLeft.expired) {
            html += '<div style="color:#c96a5a;">⛔ Аренда истекла! Оплатите в Магистрате.</div>';
        } else {
            html += '<div style="color:#7ac98a;">✅ Аренда активна</div>';
            html += '<div style="color:#6a5a48;font-size:11px;">⏳ Осталось: ' + timeLeft.text + '</div>';
        }
        html += '<button class="btn btn-small" onclick="enterStall(' + g.marketStall.stallId + ')" style="margin-top:6px;">📦 Войти в лавку</button>';
        if (timeLeft.expired) {
            html += '<button class="btn btn-small" onclick="openMagistrate()" style="margin-top:4px;">🏛️ Перейти в Магистрат</button>';
        }
        html += '</div>';
    } else {
        html += '<p style="color:#6a5a48;font-size:12px;">У вас нет лавки. Приобретите её в Магистрате.</p>';
        html += '<button class="btn btn-small" onclick="openMagistrate()" style="margin-top:6px;">🏛️ Перейти в Магистрат</button>';
    }
    html += '</div>';
    
    html += '<div class="modal-section"><h4>📋 СПИСОК ЛАВОК</h4>';
    html += '<div class="stall-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px;">';
    var hasStalls = false;
    for (var i = 1; i <= MARKET_STALLS_TOTAL; i++) {
        var stall = marketStalls[i];
        if (stall && stall.owner) {
            var timeLeft = getTimeLeft(stall.rentPaid, stall.rentDays || 1);
            var isActive = !timeLeft.expired;
            hasStalls = true;
            html += '<div class="stall-card" style="background:#120e0b;border:1px solid #2a201a;border-radius:10px;padding:10px;text-align:center;cursor:pointer;" onclick="enterStall(' + i + ')">';
            html += '<div class="stall-number" style="color:#6a5a48;font-size:12px;">🏪 #' + i + '</div>';
            html += '<div class="stall-owner" style="color:#c9b694;font-size:13px;">' + stall.owner + '</div>';
            html += '<div class="stall-status" style="font-size:11px;margin-top:4px;">' + (isActive ? '<span class="badge-green" style="color:#7ac98a;">✅ Активна</span>' : '<span class="badge-red" style="color:#c96a5a;">⛔ Истекла</span>') + '</div>';
            html += '<div style="font-size:11px;color:#6a5a48;">📦 ' + (stall.inventory ? stall.inventory.length : 0) + ' товаров</div>';
            html += '</div>';
        }
    }
    if (!hasStalls) {
        html += '<p style="color:#6a5a48;grid-column:1/-1;text-align:center;padding:20px 0;">Нет активных лавок</p>';
    }
    html += '</div>';
    html += '</div>';
    
    html += '<button class="btn btn-secondary" onclick="closeMarket()" style="margin-top:10px;">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeMarket() {
    var modal = document.getElementById('modal-market');
    if (modal) modal.classList.add('hide');
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
    
    var modal = document.getElementById('modal-stall');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-stall';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeStall(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🏪 ЛАВКА</h3><button class="close-btn" onclick="closeStall()">✕</button></div><div id="modal-stall-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-stall-content');
    
    var html = '<div class="modal-section"><h4>🏪 ЛАВКА #' + stallId + '</h4>';
    html += '<p style="color:#6a5a48;">👤 Владелец: <strong>' + stall.owner + '</strong></p>';
    html += '<p style="color:#6a5a48;">' + (isActive ? '✅ Активна' : '⛔ Аренда истекла') + '</p>';
    if (!isActive && isOwner) {
        html += '<p style="color:#c96a5a;">⚠️ Оплатите аренду в Магистрате!</p>';
    }
    html += '</div>';
    
    if (isOwner && isActive) {
        html += '<div class="modal-section"><h4>📦 УПРАВЛЕНИЕ ЛАВКОЙ</h4>';
        html += '<button class="btn btn-small" onclick="addToStall(' + stallId + ')" style="margin:4px 0;">📥 Добавить товар из инвентаря</button>';
        html += '</div>';
    }
    
    html += '<div class="modal-section"><h4>🛒 ТОВАРЫ</h4>';
    if (!stall.inventory || stall.inventory.length === 0) {
        html += '<p style="color:#6a5a48;">В лавке нет товаров.</p>';
    } else {
        stall.inventory.forEach(function(item, idx) {
            var quality = item.quality || 'Обычное';
            var q = QUALITIES[quality] || QUALITIES['Обычное'];
            var price = stall.prices && stall.prices[idx] ? stall.prices[idx] : 0;
            var stats = '';
            var countDisplay = '';
            if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
            if (item.finalDamage) stats = '⚔️ ' + item.finalDamage;
            else if (item.finalDefense) stats = '🛡️ ' + item.finalDefense;
            
            html += '<div class="row" style="padding:4px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label" style="color:' + q.color + ';">' + q.emoji + ' ' + item.name + ' (' + quality + ')' + countDisplay + '</span>';
            html += '<span class="value" style="font-size:11px;">' + stats + ' | 💰' + formatCurrency(price);
            if (isOwner && isActive) {
                html += ' <button class="btn btn-small" onclick="removeFromStall(' + stallId + ',' + idx + ')">❌ Убрать</button>';
            } else if (isActive && !isOwner) {
                html += ' <button class="btn btn-small" onclick="buyFromStall(' + stallId + ',' + idx + ')">🛒 Купить</button>';
            }
            html += '</span></div>';
        });
    }
    html += '</div>';
    html += '<button class="btn btn-secondary" onclick="closeStall()">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeStall() {
    var modal = document.getElementById('modal-stall');
    if (modal) modal.classList.add('hide');
}

function addToStall(stallId) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var stall = marketStalls[stallId];
    
    if (!stall || stall.owner !== currentUser) { setMessage('❌ Это не ваша лавка.'); return; }
    if (g.inventory.length === 0) { setMessage('❌ Инвентарь пуст.'); return; }
    
    var choices = 'Выберите предмет для лавки (можно целый стек):\n';
    g.inventory.forEach(function(item, i) {
        var countDisplay = '';
        if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
        choices += (i + 1) + '. ' + item.name + ' (' + (item.quality || 'Обычное') + ')' + countDisplay + '\n';
    });
    choices += '0. Отмена';
    var choice = prompt(choices);
    var index = parseInt(choice) - 1;
    if (isNaN(index) || index < 0 || index >= g.inventory.length) {
        setMessage('❌ Отменено.');
        return;
    }
    
    var item = g.inventory.splice(index, 1)[0];
    var priceInput = prompt('Введите цену (в меди, например: 100, 5 ЗОЛ, 1 ЗОЛ 50 МП):');
    var price = parseCurrencyInput(priceInput);
    if (price === null || price < 1) {
        setMessage('❌ Цена должна быть не менее 1 МП.');
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
    setMessage('✅ Вы добавили ' + item.name + ' в лавку за ' + formatCurrency(price));
    addLog('🏪 ' + currentUser + ' добавил ' + item.name + ' в лавку #' + stallId);
    updateMenu();
    enterStall(stallId);
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
    addLog('🏪 ' + currentUser + ' купил ' + item.name + ' в лавке #' + stallId + ' за ' + formatCurrency(price));
    updateMenu();
    enterStall(stallId);
}

function removeFromStall(stallId, idx) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var stall = marketStalls[stallId];
    
    if (!stall || stall.owner !== currentUser) { setMessage('❌ Это не ваша лавка.'); return; }
    if (!stall.inventory || idx >= stall.inventory.length) { setMessage('❌ Товар не найден.'); return; }
    var item = stall.inventory.splice(idx, 1)[0];
    if (stall.prices) delete stall.prices[idx];
    addToInventory(g, item);
    saveMarketStalls();
    saveData();
    setMessage('✅ Вы убрали ' + item.name + ' из лавки.');
    updateMenu();
    enterStall(stallId);
}

// ============================================================
// 13. ПОРТ
// ============================================================

function openPort() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var currentCity = g.location.location || 'Королевская Гавань';
    
    var msg = '⛵ ПОРТ КОРОЛЕВСКОЙ ГАВАНИ\n\n';
    msg += '📍 Текущий город: ' + currentCity + '\n\n';
    msg += '🚧 В разработке. Скоро здесь можно будет путешествовать.\n\n';
    msg += 'ГОРОДА ВЕСТЕРОСА:\n';
    
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
// 14. МАГИСТРАТ
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
    
    var html = '<div class="modal-section"><h4>📜 МАГИСТРАТ КОРОЛЕВСКОЙ ГАВАНИ</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Управление недвижимостью и торговыми лавками.</p></div>';
    html += '<div class="tabs">';
    html += '<button class="tab-btn" onclick="showMagistrateHousing()">🏠 Недвижимость</button>';
    html += '<button class="tab-btn" onclick="showMagistrateStalls()">🏪 Торг. лавки</button>';
    html += '<button class="tab-btn" onclick="openConfiscated()">📦 Конфискат</button>';
    html += '</div>';
    html += '<div id="magistrate-content" class="modal-section"></div>';
    html += '<button class="btn btn-secondary" onclick="closeMagistrate()" style="margin-top:10px;">Закрыть</button>';
    
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
        html += '<div style="color:#c9b694;font-size:18px;">' + house.emoji + ' ' + house.name + '</div>';
        html += '<div style="color:#6a5a48;font-size:12px;">📍 ' + house.district + '</div>';
        html += '<div style="color:#b8a890;font-size:13px;margin:6px 0;">' + house.description + '</div>';
        html += '<div class="row"><span class="label">📦 Склад</span><span class="value">' + (g.housing.storage ? g.housing.storage.length : 0) + '/' + house.storageSlots + ' слотов</span></div>';
        html += '<div class="row"><span class="label">💰 Аренда</span><span class="value">' + house.rent + ' зол./неделя</span></div>';
        
        if (timeLeft.expired) {
            html += '<div style="color:#c96a5a;font-size:16px;margin:10px 0;">⚠️ АРЕНДА ПРОСРОЧЕНА!</div>';
            html += '<button class="btn" onclick="payRent()" style="margin-top:6px;">💰 Срочно оплатить аренду (' + house.rent + ' зол.)</button>';
        } else {
            html += '<div class="row"><span class="label">⏳ Осталось</span><span class="value" style="color:#7ac98a;">' + timeLeft.text + '</span></div>';
            var currentWeeks = Math.floor((g.housing.rentDays || 1) / 7);
            if (currentWeeks < 4) {
                html += '<button class="btn" onclick="payRent()" style="margin-top:6px;">💰 Оплатить аренду (+1 нед, ' + house.rent + ' зол.)</button>';
            } else {
                html += '<div style="color:#6a5a48;">✅ Оплачено на 4 недели вперёд</div>';
            }
        }
        html += '<button class="btn btn-danger" onclick="sellHouse()" style="margin-top:6px;">🏚️ Продать жильё</button>';
        html += '</div>';
    } else {
        html += '<p style="color:#6a5a48;text-align:center;padding:10px 0;">🏚️ У вас нет жилья. Выберите вариант ниже.</p>';
    }
    
    html += '<div style="margin-top:10px;"><p style="color:#6a5a48;font-size:13px;font-weight:bold;">🏘️ ДОСТУПНОЕ ЖИЛЬЁ</p>';
    var districts = {
        'Королевский квартал': ['mansion', 'townhouse'],
        'Торговый квартал': ['house', 'room'],
        'Квартал бедноты': ['night']
    };
    
    for (var districtName in districts) {
        var types = districts[districtName];
        html += '<div style="margin-top:10px;"><p style="color:#6a5a48;font-size:13px;">📍 ' + districtName + '</p>';
        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            var house = HOUSING_TYPES[type];
            var market = housingMarket[type];
            var available = market.total - market.occupied;
            var isAvailable = available > 0;
            
            html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #1a1410;">';
            html += '<div style="flex:1;">';
            html += '<span style="font-size:16px;">' + house.emoji + '</span> <strong>' + house.name + '</strong>';
            html += '<span style="color:#6a5a48;font-size:11px;"> (' + market.total + ')</span>';
            html += '<br><span style="font-size:11px;color:#6a5a48;">📦 ' + house.storageSlots + ' слотов | 🛏️ +' + house.restHp + ' HP</span>';
            html += '</div>';
            html += '<div style="text-align:right;">';
            if (isAvailable) {
                html += '<span style="color:#c9b694;">' + house.price + ' зол.</span><br>';
                html += '<span style="font-size:10px;color:#6a5a48;">аренда ' + house.rent + '/нед</span><br>';
                html += '<button class="btn btn-small" onclick="buyHouse(\'' + type + '\')" style="margin-top:2px;">✅ Купить</button>';
                html += ' <span style="font-size:10px;color:#7ac98a;">' + available + ' свободно</span>';
            } else {
                html += '<span style="color:#c96a5a;">❌ РАСПРОДАНО</span>';
            }
            html += '</div></div>';
        }
        html += '</div>';
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
    html += '<p style="color:#6a5a48;font-size:12px;">Стоимость лавки: 80 золота. Аренда: 10 золота/неделя.</p>';
    
    if (g.marketStall && g.marketStall.owned) {
        var stall = marketStalls[g.marketStall.stallId];
        var timeLeft = getTimeLeft(stall.rentPaid, stall.rentDays || 1);
        
        html += '<div style="background:#120e0b;border:1px solid #3d3026;border-radius:12px;padding:14px;margin:10px 0;">';
        html += '<div style="color:#c9b694;font-size:16px;">🏪 Ваша лавка #' + g.marketStall.stallId + '</div>';
        if (timeLeft.expired) {
            html += '<div style="color:#c96a5a;font-size:16px;margin:10px 0;">⚠️ АРЕНДА ПРОСРОЧЕНА!</div>';
            html += '<button class="btn" onclick="payStallRent()" style="margin-top:6px;">💰 Срочно оплатить аренду (10 зол.)</button>';
        } else {
            html += '<div class="row"><span class="label">⏳ Осталось</span><span class="value" style="color:#7ac98a;">' + timeLeft.text + '</span></div>';
            var currentWeeks = Math.floor((stall.rentDays || 1) / 7);
            if (currentWeeks < 1) {
                html += '<button class="btn" onclick="payStallRent()" style="margin-top:6px;">💰 Оплатить аренду (+1 нед, 10 зол.)</button>';
            } else {
                html += '<div style="color:#6a5a48;">✅ Оплачено на 1 неделю</div>';
            }
        }
        html += '<button class="btn btn-small" onclick="enterStall(' + g.marketStall.stallId + ')" style="margin-top:6px;">📦 Войти в лавку</button>';
        html += '<button class="btn btn-danger" onclick="leaveStall()" style="margin-top:6px;">🚪 Оставить лавку</button>';
        html += '</div>';
    } else {
        html += '<p style="color:#6a5a48;margin:10px 0;">У вас нет торговой лавки.</p>';
        var freeStalls = 0;
        for (var i = 1; i <= MARKET_STALLS_TOTAL; i++) {
            if (!marketStalls[i].owner) freeStalls++;
        }
        if (freeStalls > 0) {
            html += '<p style="color:#6a5a48;">Свободных лавок: ' + freeStalls + '</p>';
            html += '<button class="btn" onclick="buyStall()">🏪 Купить лавку (80 зол.)</button>';
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
    
    if (!spendMoney(g, 80 * 210 * 56)) { setMessage('❌ Недостаточно денег! Нужно: 80 золота.'); return; }
    
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
    setMessage('✅ Вы купили лавку #' + freeStall + ' за 80 золота!');
    addLog('🏪 ' + currentUser + ' купил лавку #' + freeStall);
    updateMenu();
    showMagistrateStalls();
    openMarket();
}

function leaveStall() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.marketStall || !g.marketStall.owned) { setMessage('❌ У вас нет лавки.'); return; }
    var stallId = g.marketStall.stallId;
    var stall = marketStalls[stallId];
    if (!stall || stall.owner !== currentUser) { setMessage('❌ Это не ваша лавка.'); return; }
    
    if (!confirm('Вы уверены, что хотите оставить лавку #' + stallId + '?\nВсе товары вернутся в инвентарь.')) return;
    
    if (stall.inventory && stall.inventory.length > 0) {
        stall.inventory.forEach(function(item) { addToInventory(g, item); });
        setMessage('📦 ' + stall.inventory.length + ' товаров возвращено в инвентарь.');
    }
    
    stall.owner = null;
    stall.rentPaid = null;
    stall.rentDays = 0;
    stall.inventory = [];
    stall.prices = {};
    
    g.marketStall = { owned: false, stallId: null, rentPaid: null, rentDays: 0, debt: 0 };
    
    saveMarketStalls();
    saveData();
    setMessage('🚪 Вы оставили лавку #' + stallId + '.');
    addLog('🚪 ' + currentUser + ' оставил лавку #' + stallId);
    updateMenu();
    showMagistrateStalls();
}

function payStallRent() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.marketStall || !g.marketStall.owned) { setMessage('❌ У вас нет лавки!'); return; }
    var stall = marketStalls[g.marketStall.stallId];
    if (!stall || stall.owner !== currentUser) { setMessage('❌ Это не ваша лавка.'); return; }
    
    var rentCost = 10;
    var currentDays = stall.rentDays || 0;
    var totalDays = currentDays + 7;
    if (totalDays > 7) {
        setMessage('⏳ Лавку можно оплатить только на 1 неделю вперёд.');
        return;
    }
    if (!spendMoney(g, rentCost * 210 * 56)) {
        setMessage('❌ Недостаточно денег! Нужно: ' + rentCost + ' зол.');
        return;
    }
    
    stall.rentDays = totalDays;
    stall.rentPaid = Date.now();
    g.marketStall.rentDays = totalDays;
    g.marketStall.rentPaid = Date.now();
    
    saveMarketStalls();
    saveData();
    setMessage('✅ Аренда лавки оплачена на неделю!');
    addLog('💰 ' + currentUser + ' оплатил аренду лавки');
    updateMenu();
    showMagistrateStalls();
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
        setMessage('🚪 Ваша лавка конфискована за неуплату!');
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
        stall.inventory.forEach(function(item) {
            confiscatedItems.push({
                owner: currentUser,
                items: [item],
                confiscatedAt: Date.now(),
                type: 'stall'
            });
        });
        stall.inventory = [];
        setMessage('📦 Товары из лавки #' + stallId + ' перемещены в конфискат.');
        saveData();
    }
    
    stall.owner = null;
    stall.rentPaid = null;
    stall.rentDays = 0;
    stall.inventory = [];
    stall.prices = {};
    g.marketStall = { owned: false, stallId: null, rentPaid: null, rentDays: 0, debt: 0 };
    
    saveMarketStalls();
    saveData();
    setMessage('🚪 Лавка #' + stallId + ' конфискована за неуплату!');
    addLog('🚪 ' + currentUser + ' потерял лавку #' + stallId);
    updateMenu();
    showMagistrateStalls();
}

// ============================================================
// 15. КОНФИСКАТ
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
    
    var modal = document.getElementById('modal-confiscated');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-confiscated';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeConfiscated(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📦 КОНФИСКАТ</h3><button class="close-btn" onclick="closeConfiscated()">✕</button></div><div id="modal-confiscated-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-confiscated-content');
    
    var html = '<div class="modal-section"><h4>📦 КОНФИСКАТ</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Вещи из просроченных лавок и домов.</p>';
    
    for (var ei = 0; ei < userItems.length; ei++) {
        var entry = userItems[ei];
        html += '<div style="border:1px solid #3d3026;border-radius:10px;padding:10px;margin:6px 0;">';
        html += '<p style="color:#6a5a48;">📅 Конфисковано: ' + new Date(entry.confiscatedAt).toLocaleString() + '</p>';
        for (var ii = 0; ii < entry.items.length; ii++) {
            var item = entry.items[ii];
            var quality = item.quality || 'Обычное';
            var q = QUALITIES[quality] || QUALITIES['Обычное'];
            var countDisplay = '';
            if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
            html += '<div class="row" style="padding:4px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label" style="color:' + q.color + ';">' + q.emoji + ' ' + item.name + ' (' + quality + ')' + countDisplay + '</span>';
            html += '<span class="value"><button class="btn btn-small" onclick="returnFromConfiscate(' + ei + ',' + ii + ')">📤 Забрать</button></span>';
            html += '</div>';
        }
        html += '</div>';
    }
    
    html += '<button class="btn btn-secondary" onclick="closeConfiscated()" style="margin-top:10px;">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeConfiscated() {
    var modal = document.getElementById('modal-confiscated');
    if (modal) modal.classList.add('hide');
}

function returnFromConfiscate(entryIdx, itemIdx) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var entry = confiscatedItems[entryIdx];
    if (!entry || entry.owner !== currentUser) { setMessage('❌ Ошибка.'); return; }
    if (itemIdx >= entry.items.length) { setMessage('❌ Предмет не найден.'); return; }
    
    var item = entry.items.splice(itemIdx, 1)[0];
    addToInventory(g, item);
    
    if (entry.items.length === 0) {
        confiscatedItems.splice(entryIdx, 1);
    }
    
    saveData();
    setMessage('✅ Вы забрали ' + item.name + ' из конфиската.');
    updateMenu();
    openConfiscated();
}

// ============================================================
// 16. КОСТИ
// ============================================================

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
            setMessage('❌ У вас уже есть активная игра!');
            return;
        }
    }
    
    if (!spendMoney(g, bet)) { setMessage('❌ Недостаточно денег для ставки!'); return; }
    
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
    setMessage('✅ Вы создали игру в кости на ' + formatCurrency(bet) + '! Ждите соперника.');
    addLog('🎲 ' + currentUser + ' создал игру в кости на ' + formatCurrency(bet));
    updateMenu();
    openBrothel();
}

function joinDiceGame(gameId) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var game = diceGames[gameId];
    if (!game) { setMessage('❌ Игра не найдена.'); return; }
    if (game.creator === currentUser) { setMessage('❌ Вы не можете присоединиться к своей игре.'); return; }
    if (game.status !== 'waiting') { setMessage('❌ Игра уже началась или завершена.'); return; }
    if (!spendMoney(g, game.bet)) { setMessage('❌ Недостаточно денег для ставки!'); return; }
    
    game.player2 = currentUser;
    game.status = 'playing';
    
    saveData();
    setMessage('✅ Вы присоединились к игре! Бросайте кости.');
    addLog('🎲 ' + currentUser + ' присоединился к игре ' + gameId);
    updateMenu();
    playDicePvP(gameId);
}

function playDicePvP(gameId) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var game = diceGames[gameId];
    if (!game) { setMessage('❌ Игра не найдена.'); return; }
    if (game.creator !== currentUser && game.player2 !== currentUser) { setMessage('❌ Вы не участник этой игры.'); return; }
    
    var dice1 = Math.floor(Math.random() * 6) + 1;
    var dice2 = Math.floor(Math.random() * 6) + 1;
    var total = dice1 + dice2;
    
    if (game.creator === currentUser) {
        if (game.creatorRoll !== null) { setMessage('❌ Вы уже бросили кости! Ждите соперника.'); return; }
        game.creatorRoll = total;
        setMessage('🎲 Ваш бросок: ' + dice1 + ' + ' + dice2 + ' = ' + total + ' (ждём соперника)');
    } else if (game.player2 === currentUser) {
        if (game.player2Roll !== null) { setMessage('❌ Вы уже бросили кости! Ждите соперника.'); return; }
        game.player2Roll = total;
        setMessage('🎲 Ваш бросок: ' + dice1 + ' + ' + dice2 + ' = ' + total + ' (ждём соперника)');
    }
    
    saveData();
    updateMenu();
    
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
        setMessage('🎉 ' + game.creator + ' победил! (' + game.creatorRoll + ' vs ' + game.player2Roll + ')');
    } else if (game.player2Roll > game.creatorRoll) {
        winner = player2;
        winnerName = game.player2;
        setMessage('🎉 ' + game.player2 + ' победил! (' + game.player2Roll + ' vs ' + game.creatorRoll + ')');
    } else {
        creator.game.copper += game.bet;
        player2.game.copper += game.bet;
        convertCurrency(creator.game);
        convertCurrency(player2.game);
        setMessage('🤝 Ничья! (' + game.creatorRoll + ' vs ' + game.player2Roll + ') Ставки возвращены.');
        addLog('🤝 Ничья в кости между ' + game.creator + ' и ' + game.player2);
        game.status = 'finished';
        delete diceGames[gameId];
        saveData();
        updateMenu();
        openBrothel();
        return;
    }
    
    if (winner) {
        winner.game.copper += totalBet;
        convertCurrency(winner.game);
        setMessage('🏆 ' + winnerName + ' выиграл ' + formatCurrency(totalBet) + '!');
        addLog('🏆 ' + winnerName + ' выиграл ' + formatCurrency(totalBet) + ' в кости у ' + (winnerName === game.creator ? game.player2 : game.creator));
    }
    
    game.status = 'finished';
    delete diceGames[gameId];
    saveData();
    updateMenu();
    openBrothel();
}

// ============================================================
// 17. ТЮРЬМА
// ============================================================

function payJailFine() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.jail) { setMessage('❌ Вы не в тюрьме.'); return; }
    
    var fine = getJailFine(g);
    if (!spendMoney(g, fine * 210 * 56)) {
        setMessage('❌ Недостаточно денег! Штраф: ' + fine + ' зол.');
        return;
    }
    
    setMessage('💰 Вы заплатили штраф ' + fine + ' зол. и вышли на свободу!');
    addLog('💰 ' + currentUser + ' заплатил штраф ' + fine + ' зол.');
    freeFromJail();
}

function waitJailTime() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.jail) { setMessage('❌ Вы не в тюрьме.'); return; }
    
    var jailTime = 5 * 60 * 1000;
    var timeSpent = Date.now() - g.jail.enterTime;
    var timeLeft = jailTime - timeSpent;
    if (timeLeft <= 0) {
        freeFromJail();
        return;
    }
    
    var minutes = Math.ceil(timeLeft / 60000);
    setMessage('⏳ Вы ждёте освобождения... Осталось ' + minutes + ' мин.');
    
    isBusy = true;
    document.getElementById('busy-status').classList.remove('hide');
    document.getElementById('busy-status').textContent = '⛓️ В тюрьме... (' + minutes + ' мин)';
    updateActions();
    if (busyTimer) clearTimeout(busyTimer);
    busyTimer = setTimeout(function() {
        freeFromJail();
        isBusy = false;
        document.getElementById('busy-status').classList.add('hide');
        busyTimer = null;
        updateActions();
    }, timeLeft);
}

function attemptEscape() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.jail) { setMessage('❌ Вы не в тюрьме.'); return; }
    
    var escapeCooldown = 4 * 60 * 1000;
    var lastEscape = g.jail.lastEscapeAttempt || 0;
    if (Date.now() - lastEscape < escapeCooldown) {
        var timeLeft = Math.ceil((escapeCooldown - (Date.now() - lastEscape)) / 60000);
        setMessage('⏳ Попытка побега доступна через ' + timeLeft + ' мин.');
        return;
    }
    
    g.jail.lastEscapeAttempt = Date.now();
    if (Math.random() * 100 < 10) {
        setMessage('🏃 Вы сбежали из тюрьмы!');
        addLog('🏃 ' + currentUser + ' сбежал из тюрьмы');
        freeFromJail();
    } else {
        var extraTime = 10 * 60 * 1000;
        g.jail.enterTime = Date.now() - extraTime;
        setMessage('⛓️ Побег не удался! Стража добавила 10 минут.');
        addLog('⛓️ ' + currentUser + ' не удалось сбежать из тюрьмы');
        updateMenu();
        saveData();
    }
}

function getJailFine(g) {
    if (!g.jail || !g.jail.enterTime) return 1;
    var timeSpent = Date.now() - g.jail.enterTime;
    var fiveMinutes = 5 * 60 * 1000;
    var intervals = Math.ceil(timeSpent / fiveMinutes);
    return Math.max(1, intervals);
}

function freeFromJail() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    
    var previousLocation = g.jail?.previousLocation || 'Таверна';
    var previousLocationFull = g.jail?.previousLocationFull || 'Королевская Гавань';
    g.location.place = previousLocation;
    g.location.location = previousLocationFull;
    g.outside = false;
    g.jail = null;
    
    setMessage('⛓️ Вы освободились из тюрьмы!');
    addLog('⛓️ ' + currentUser + ' освободился из тюрьмы');
    isBusy = false;
    document.getElementById('busy-status').classList.add('hide');
    if (busyTimer) { clearTimeout(busyTimer); busyTimer = null; }
    updateMenu();
    updateStory();
    updateActions();
    saveData();
}

// ============================================================
// 18. ВСПОМОГАТЕЛЬНЫЕ
// ============================================================

function parseCurrencyInput(input) {
    input = input.trim().toUpperCase();
    if (!input) return null;
    if (/^\d+$/.test(input)) return parseInt(input);
    
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
            if (!isNaN(value)) total += value * pattern.multiplier;
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
            total += num * 210 * 56; i++;
        } else if (next === 'СО' || next === 'СЕРЕБРО' || next === 'SILVER' || next === 'S') {
            total += num * 56; i++;
        } else if (next === 'МП' || next === 'МЕДЬ' || next === 'COPPER' || next === 'C') {
            total += num; i++;
        } else {
            total += num;
        }
    }
    return total;
}

// ============================================================
// 19. РЕГИСТРАЦИЯ
// ============================================================

window.openMap = openMap;
window.closeMap = closeMap;
window.goToBuilding = goToBuilding;
window.updateStory = window.updateStory;
window.updateActions = window.updateActions;

window.openStable = openStable;
window.closeStable = closeStable;
window.openTemple = openTemple;
window.closeTemple = closeTemple;
window.openLibrary = openLibrary;
window.closeLibrary = closeLibrary;
window.openGuildHall = openGuildHall;
window.closeGuildHall = closeGuildHall;
window.openBrothel = openBrothel;
window.closeBrothel = closeBrothel;
window.openMarket = openMarket;
window.closeMarket = closeMarket;
window.openMagistrate = openMagistrate;
window.closeMagistrate = closeMagistrate;
window.openPort = openPort;
window.openStorage = openStorage;
window.closeStorage = closeStorage;
window.openStorageHold = openStorageHold;
window.closeStorageHold = closeStorageHold;
window.openConfiscated = openConfiscated;
window.closeConfiscated = closeConfiscated;
window.enterStall = enterStall;
window.closeStall = closeStall;
window.enterHome = enterHome;
window.restAtHome = restAtHome;
window.viewDistrict = viewDistrict;
window.payJailFine = payJailFine;
window.waitJailTime = waitJailTime;
window.attemptEscape = attemptEscape;
window.freeFromJail = freeFromJail;

window.buyHouse = buyHouse;
window.sellHouse = sellHouse;
window.payRent = payRent;
window.checkRent = checkRent;

window.addToStall = addToStall;
window.buyFromStall = buyFromStall;
window.removeFromStall = removeFromStall;
window.payStallRent = payStallRent;
window.checkStallRent = checkStallRent;
window.confiscateStall = confiscateStall;
window.buyStall = buyStall;
window.leaveStall = leaveStall;

window.readBook = readBook;
window.buyBook = buyBook;
window.sellBook = sellBook;

window.takeQuest = takeQuest;
window.abandonQuest = abandonQuest;
window.checkQuestProgress = checkQuestProgress;

window.createDiceGame = createDiceGame;
window.joinDiceGame = joinDiceGame;
window.playDicePvP = playDicePvP;
window.finishDiceGame = finishDiceGame;

window.showMagistrateHousing = showMagistrateHousing;
window.showMagistrateStalls = showMagistrateStalls;

console.log('🏰 Королевская Гавань загружена!');

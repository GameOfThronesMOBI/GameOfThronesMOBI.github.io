// ============================================================
// js/regions/crownlands/locations/kings_landing.js
// КОРОЛЕВСКАЯ ГАВАНЬ - ПОЛНАЯ ЛОГИКА (ИСПРАВЛЕННАЯ)
// ============================================================

// ============================================================
// 1. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (локальные)
// ============================================================

function getHousingMarket() { return housingMarket; }
function getMarketStalls() { return marketStalls; }
function getHorseMarket() { return horseMarket; }

// ============================================================
// 2. КАРТА ГАВАНИ (открытие)
// ============================================================

function openMap() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    
    var modal = document.getElementById('modal-map');
    var content = document.getElementById('modal-map-content');
    
    var cityBuildings = ['Таверна','Рынок','Кузница','Оружейная лавка','Кожевник','Бронник','Плотник','Конюшня','Гильдия торговцев','Магистрат','Ворота','Королевский квартал','Торговый квартал','Квартал бедноты','Дом','Великая септа','Порт','Тюрьма','Библиотека мейстеров','Гильдия наёмников','Бордель','Дорога'];
    
    var html = '<div class="modal-section"><h4>📍 ' + g.location.place + '</h4></div>';
    html += '<div class="modal-section">';
    
    for (var i = 0; i < BUILDINGS.length; i++) {
        var b = BUILDINGS[i];
        var isCurrent = b.id === g.location.place;
        var isCityBuilding = cityBuildings.indexOf(b.id) !== -1;
        
        // Показываем только доступные здания
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
// 3. ПЕРЕМЕЩЕНИЕ ПО ГАВАНИ (ОБНОВЛЕНО)
// ============================================================

function goToBuilding(building) {
    var user = users[currentUser];
    if (!user) {
        setMessage('❌ Игрок не найден.');
        return;
    }
    var g = user.game;
    
    if (isBusy) {
        setMessage('⏳ Вы заняты.');
        return;
    }
    if (building === g.location.place) {
        setMessage('📍 Вы уже здесь.');
        return;
    }
    
    // Проверка существования здания
    var exists = false;
    for (var i = 0; i < BUILDINGS.length; i++) {
        if (BUILDINGS[i].id === building) { exists = true; break; }
    }
    if (!exists) {
        setMessage('❌ Здание не найдено.');
        return;
    }
    
    // МЕНЯЕМ ЛОКАЦИЮ
    g.location.place = building;
    g.location.location = 'Королевская Гавань';
    
    // Особые случаи
    if (building === 'Дорога') {
        g.outside = true;
        g.location.location = 'Дорога';
        setMessage('🛤️ Вы вышли на Королевский тракт.');
    } else if (building === 'Ворота') {
        g.outside = false;
        setMessage('🚪 Вы у Ворот.');
    } else {
        g.outside = false;
        setMessage('✅ Вы прибыли в ' + building + '.');
    }
    
    // ЗАКРЫВАЕМ КАРТУ
    closeMap();
    
    // ОБНОВЛЯЕМ UI
    if (typeof updateMenu === 'function') updateMenu();
    if (typeof updateStory === 'function') updateStory();
    if (typeof updateActions === 'function') updateActions();
    
    // СОХРАНЯЕМ
    if (typeof saveData === 'function') saveData();
}

// ============================================================
// 4. ОБНОВЛЕНИЕ STORY (НОВОЕ)
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
        'Таверна': '🍺 Добро пожаловать в таверну! Здесь можно поесть, поработать и отдохнуть.',
        'Рынок': '🏪 Центральный рынок. Здесь можно торговать с другими игроками.',
        'Кузница': '⚒️ Вы в кузнице. Здесь можно купить ресурсы и скрафтить предметы.',
        'Оружейная лавка': '🗡️ Вы в оружейной лавке. Здесь можно купить и продать оружие.',
        'Кожевник': '🪡 Вы у кожевника. Здесь можно купить и продать кожаную броню.',
        'Бронник': '🛡️ Вы у бронника. Здесь можно купить и продать латную броню.',
        'Плотник': '🪵 Вы у плотника. Здесь можно купить и продать луки и арбалеты.',
        'Конюшня': '🐴 Королевская конюшня. Здесь можно купить или продать лошадь.',
        'Гильдия торговцев': '🏛️ Вы в гильдии торговцев. Здесь можно торговать на аукционе.',
        'Магистрат': '📜 Магистрат — центр управления городом. Недвижимость и лавки.',
        'Ворота': '🚪 Вы у городских ворот.',
        'Королевский квартал': '👑 Элитный район. Здесь живут самые богатые люди.',
        'Торговый квартал': '🏙️ Центр торговли. Здесь селятся ремесленники и купцы.',
        'Квартал бедноты': '🏚️ Окраина города. Жильё дёшево, но опасно.',
        'Дом': '🏠 Ваш дом. Здесь можно отдохнуть и хранить вещи.',
        'Великая септа': '⛪ Великая Септа Бейлора. Исцеление, молитва и удача.',
        'Порт': '⛵ Порт Королевской Гавани.',
        'Тюрьма': '⛓️ Вы в тюрьме.',
        'Дорога': '🛤️ Королевский тракт. Отсюда можно отправиться в другие земли.',
        'Библиотека мейстеров': '📚 Библиотека мейстеров. Книги для развития.',
        'Гильдия наёмников': '🗡️ Гильдия наёмников. Ежедневные задания.',
        'Бордель': '💃 Бордель Королевской Гавани. Отдых и развлечения.'
    };
    
    if (textEl) {
        textEl.textContent = texts[place] || 'Вы находитесь в ' + place + '.';
    }
    
    // ОБНОВЛЯЕМ ДЕЙСТВИЯ
    if (typeof updateActions === 'function') {
        updateActions();
    }
}

// ============================================================
// 5. ОБНОВЛЕНИЕ ACTIONS (НОВОЕ)
// ============================================================

function updateActions() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    var place = g.location.place;
    var container = document.getElementById('actions-container');
    if (!container) return;
    
    container.innerHTML = '';
    var actions = [];
    
    // БАЗОВЫЕ ДЕЙСТВИЯ (всегда)
    actions.push({ id: 'inventory', label: '🎒 Инвентарь' });
    actions.push({ id: 'character', label: '👤 Персонаж' });
    actions.push({ id: 'menu', label: '📋 Меню' });
    actions.push({ id: 'map', label: '🗺️ Карта' });
    
    // ДЕЙСТВИЯ ПО ЗДАНИЯМ
    if (place === 'Таверна') {
        actions = [
            { id: 'tavern_eat', label: '🍞 Попросить еды (+25)' },
            { id: 'tavern_buy', label: '🛒 Торговля в таверне' },
            { id: 'wash', label: '🧹 Помыть посуду (1 мин → 1 МП)' },
            { id: 'sweep', label: '🧹 Подмести пол (5 мин → 5 МП)' },
            { id: 'rest', label: '🛏️ Отдохнуть (10 МП → +30 уст., +15 HP)' },
            { id: 'talk', label: '🗣️ Поговорить с трактирщиком' }
        ].concat(actions);
    }
    
    if (place === 'Рынок') {
        actions = [
            { id: 'market_stalls', label: '🏪 Рынок (лавки)' }
        ].concat(actions);
    }
    
    if (place === 'Кузница') {
        actions = [
            { id: 'shop_resources', label: '⚒️ Кузница (ресурсы)' },
            { id: 'craft', label: '🔨 Крафт' }
        ].concat(actions);
    }
    
    if (place === 'Оружейная лавка') {
        actions = [
            { id: 'shop_weapons', label: '🗡️ Оружейная лавка' }
        ].concat(actions);
    }
    
    if (place === 'Кожевник') {
        actions = [
            { id: 'shop_leather', label: '🪡 Кожевник' }
        ].concat(actions);
    }
    
    if (place === 'Бронник') {
        actions = [
            { id: 'shop_plate', label: '🛡️ Бронник' }
        ].concat(actions);
    }
    
    if (place === 'Плотник') {
        actions = [
            { id: 'shop_bows', label: '🪵 Плотник' }
        ].concat(actions);
    }
    
    if (place === 'Конюшня') {
        actions = [
            { id: 'stable_buy', label: '🐴 Конюшня (купить)' },
            { id: 'stable_sell', label: '💰 Конюшня (продать)' }
        ].concat(actions);
    }
    
    if (place === 'Гильдия торговцев') {
        actions = [
            { id: 'auction_list', label: '🏛️ Аукцион (все лоты)' },
            { id: 'auction_my', label: '📦 Мои лоты' },
            { id: 'auction_sell', label: '💰 Выставить лот' }
        ].concat(actions);
    }
    
    if (place === 'Магистрат') {
        actions = [
            { id: 'magistrate_housing', label: '🏠 Недвижимость' },
            { id: 'magistrate_stall_buy', label: '🏪 Купить лавку' },
            { id: 'magistrate_stall_pay', label: '💰 Оплатить лавку' },
            { id: 'magistrate_confiscated', label: '📦 Конфискат' }
        ].concat(actions);
    }
    
    if (place === 'Ворота') {
        if (!g.outside) {
            actions = [
                { id: 'leave_city', label: '🚪 Выйти на Дорогу' }
            ].concat(actions);
        } else {
            actions = [
                { id: 'enter_city', label: '🚶 Войти в город' }
            ].concat(actions);
        }
    }
    
    if (place === 'Дорога') {
        actions = [
            { id: 'enter_city', label: '🚶 Войти в Королевскую Гавань' },
            { id: 'search', label: '🔍 Поиск' }
        ].concat(actions);
    }
    
    if (place === 'Королевский квартал' || place === 'Торговый квартал' || place === 'Квартал бедноты') {
        var hasHouse = false;
        if (g.housing && g.housing.type && HOUSING_TYPES[g.housing.type]) {
            if (HOUSING_TYPES[g.housing.type].district === place) {
                hasHouse = true;
            }
        }
        if (hasHouse) {
            actions = [
                { id: 'housing_enter', label: '🏠 Зайти домой' }
            ].concat(actions);
        } else {
            actions = [
                { id: 'housing_view', label: '🏠 Купить жильё' }
            ].concat(actions);
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
        actions = [
            { id: 'temple_heal', label: '💉 Бесплатное исцеление' },
            { id: 'temple_bless', label: '🙏 Молитва (благословение)' },
            { id: 'temple_luck', label: '🍀 Купить удачу' }
        ].concat(actions);
    }
    
    if (place === 'Порт') {
        actions = [
            { id: 'port_travel', label: '⛵ Порт' }
        ].concat(actions);
    }
    
    if (place === 'Тюрьма') {
        actions = [
            { id: 'jail_pay', label: '💰 Заплатить штраф' },
            { id: 'jail_wait', label: '⏳ Ждать освобождения' },
            { id: 'jail_escape', label: '🏃 Попытаться сбежать' }
        ].concat(actions);
    }
    
    if (place === 'Библиотека мейстеров') {
        actions = [
            { id: 'library_buy', label: '📚 Купить книгу' },
            { id: 'library_read', label: '📖 Читать книгу' }
        ].concat(actions);
    }
    
    if (place === 'Гильдия наёмников') {
        actions = [
            { id: 'quest_take', label: '📋 Взять задание' },
            { id: 'quest_abandon', label: '❌ Отказаться' }
        ].concat(actions);
    }
    
    if (place === 'Бордель') {
        actions = [
            { id: 'brothel_rest', label: '🛏️ Отдых' },
            { id: 'brothel_dice', label: '🎲 Игра в кости' }
        ].concat(actions);
    }
    
    // ДОБАВЛЯЕМ КНОПКИ
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
}

// ============================================================
// 6. ОТКРЫТИЕ ЗДАНИЙ
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
// 7. РАБОТА С ДОМАМИ
// ============================================================

function buyHouse(type) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var house = HOUSING_TYPES[type];
    if (!house) { setMessage('❌ Такого жилья нет.'); return; }
    
    if (g.housing && g.housing.type) {
        setMessage('❌ У вас уже есть жильё! Продайте его.');
        return;
    }
    
    var market = housingMarket[type];
    if (!market || market.occupied >= market.total) {
        setMessage('❌ Все ' + house.name + ' уже проданы!');
        return;
    }
    
    if (!spendMoney(g, house.price * 210 * 56)) {
        setMessage('❌ Недостаточно денег! Нужно: ' + house.price + ' золота.');
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
    
    setMessage('✅ Вы купили ' + house.name + '! Осталось: ' + (market.total - market.occupied) + ' свободных.');
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
        setMessage('📦 Предметы со склада перемещены в камеру хранения.');
    }
    
    var market = housingMarket[g.housing.type];
    if (market) market.occupied = Math.max(0, market.occupied - 1);
    saveHousingMarket();
    
    g.housing.type = null;
    g.housing.debt = 0;
    g.housing.rentPaid = null;
    g.housing.rentDays = 0;
    
    saveData();
    setMessage('🏚️ Вы продали ' + house.name + ' за ' + refund + ' золота.');
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
        setMessage('⏳ Вы уже оплатили аренду на 4 недели вперёд.');
        return;
    }
    
    if (!spendMoney(g, house.rent * 210 * 56)) {
        setMessage('❌ Недостаточно денег! Нужно: ' + house.rent + ' золота.');
        return;
    }
    
    g.housing.rentDays = (g.housing.rentDays || 0) + 7;
    g.housing.rentPaid = Date.now();
    
    saveData();
    setMessage('✅ Вы оплатили аренду за ' + house.name + ' на неделю!');
    addLog('💰 ' + currentUser + ' оплатил аренду за ' + house.name);
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
        setMessage('🚪 Ваш дом конфискован за неуплату!');
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
        setMessage('📦 Предметы со склада перемещены в конфискат.');
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

// ============================================================
// 8. СКЛАД
// ============================================================

function openStorage() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.housing || !g.housing.type) { setMessage('❌ У вас нет жилья!'); return; }
    
    var house = HOUSING_TYPES[g.housing.type];
    var storage = g.housing.storage || [];
    
    var msg = '📦 СКЛАД (' + house.name + ')\n';
    msg += 'Свободно: ' + ((house.storageSlots || 10) - storage.length) + '/' + house.storageSlots + ' слотов\n\n';
    
    if (storage.length === 0) {
        msg += '📭 Склад пуст';
    } else {
        storage.forEach(function(item, i) {
            var quality = item.quality || 'Обычное';
            var countDisplay = '';
            if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
            msg += (i + 1) + '. ' + item.name + ' (' + quality + ')' + countDisplay + '\n';
        });
    }
    
    var action = prompt(msg + '\n\nВыберите действие:\n1. Положить предмет\n2. Забрать предмет\n0. Выйти');
    
    if (action === '1') {
        moveToStorage();
    } else if (action === '2') {
        var idx = prompt('Введите номер предмета для забора:');
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
    msg += 'Всего предметов: ' + hold.length + '\n\n';
    
    if (hold.length === 0) {
        msg += '📭 Хранилище пусто';
    } else {
        hold.forEach(function(item, i) {
            var quality = item.quality || 'Обычное';
            var countDisplay = '';
            if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
            msg += (i + 1) + '. ' + item.name + ' (' + quality + ')' + countDisplay + '\n';
        });
    }
    
    var choice = prompt(msg + '\n\nВведите номер предмета для забора, или 0 для выхода:');
    var idx = parseInt(choice) - 1;
    if (!isNaN(idx) && idx >= 0 && idx < hold.length) {
        var item = hold.splice(idx, 1)[0];
        addToInventory(g, item);
        setMessage('✅ Вы забрали ' + item.name + ' из камеры хранения.');
        saveData();
        updateMenu();
    }
}

// ============================================================
// 9. КОНЮШНЯ
// ============================================================

function openStable() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    checkHorseReset();
    
    var msg = '🐴 КОНЮШНЯ КОРОЛЕВСКОЙ ГАВАНИ\n\n';
    
    if (g.equipment && g.equipment.horse) {
        var horse = HORSE_TYPES[g.equipment.horse.horseType];
        if (horse) {
            msg += 'ВАША ЛОШАДЬ:\n';
            msg += horse.emoji + ' ' + horse.name + '\n';
            msg += '❤️ HP: ' + g.equipment.horse.hp + '/' + g.equipment.horse.maxHp + '\n';
            msg += '⚡ Скорость: +' + horse.speedBonus + '%\n';
            msg += '🛡️ Защита: +' + horse.defensePercent + '%\n\n';
        }
    } else {
        msg += 'У вас нет лошади.\n\n';
    }
    
    msg += 'ДОСТУПНЫЕ ЛОШАДИ (обновление раз в неделю):\n';
    for (var key in HORSE_TYPES) {
        var h = HORSE_TYPES[key];
        var market = horseMarket[key];
        var available = market.total - market.sold;
        
        if (g.equipment && g.equipment.horse && g.equipment.horse.horseType === key) {
            msg += '✅ ' + h.emoji + ' ' + h.name + ' (ваша)\n';
        } else if (available > 0) {
            msg += h.emoji + ' ' + h.name + ' - ' + formatCurrency(h.price * 210 * 56) + ' (осталось: ' + available + '/' + market.total + ')\n';
        } else {
            msg += '❌ ' + h.emoji + ' ' + h.name + ' (распродано)\n';
        }
    }
    
    var action = prompt(msg + '\n\nВведите тип лошади для покупки (work, riding, war, racer, heavy, royal, fire) или 0 для выхода:');
    
    if (action && action !== '0') {
        buyHorse(action);
    }
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
    
    setMessage('✅ Вы купили ' + horse.name + '! Осталось: ' + (market.total - market.sold));
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
// 10. ВЕЛИКАЯ СЕПТА
// ============================================================

function openTemple() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var maxHp = getMaxHp(g);
    
    var msg = '⛪ ВЕЛИКАЯ СЕПТА БЕЙЛОРА\n\n';
    msg += '💰 ' + formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper) + '\n';
    msg += '❤️ HP: ' + Math.round(g.hp) + '/' + maxHp + '\n';
    msg += '🍀 Удача: ' + (g.luck || 0) + '/25\n\n';
    msg += 'ДОСТУПНЫЕ ДЕЙСТВИЯ:\n';
    msg += '1. 💉 Бесплатное исцеление (раз в 2 часа)\n';
    msg += '2. 🙏 Молитва (+10% опыта на 1 час, раз в день)\n';
    msg += '3. 🍀 Купить удачу (1000 зол. → +5 удачи)\n';
    msg += '4. 🧪 Купить зелье\n';
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
    
    if (g.hp >= maxHp) { setMessage('✅ Вы уже здоровы!'); return; }
    
    var now = Date.now();
    var healCooldown = 2 * 60 * 60 * 1000;
    
    if (g.lastHeal && (now - g.lastHeal) < healCooldown) {
        var timeLeft = Math.ceil((healCooldown - (now - g.lastHeal)) / (60 * 1000));
        setMessage('⏳ Исцеление доступно через ' + timeLeft + ' мин.');
        return;
    }
    
    g.hp = maxHp;
    g.lastHeal = now;
    saveData();
    setMessage('💉 Вы полностью исцелились!');
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
        setMessage('⏳ Молитва доступна через ' + timeLeft + ' ч.');
        return;
    }
    
    g.lastPrayer = now;
    if (!g.blessing) g.blessing = { active: true, expires: now + 60 * 60 * 1000 };
    g.blessing.active = true;
    g.blessing.expires = now + 60 * 60 * 1000;
    
    saveData();
    setMessage('🙏 Вы получили благословение! +10% к опыту на 1 час.');
    addLog('🙏 ' + currentUser + ' получил благословение');
    updateMenu();
}

function donateLuck() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if ((g.luck || 0) >= 25) { setMessage('🍀 Удача уже максимальная (25)!'); return; }
    if (!spendMoney(g, 1000 * 210 * 56)) { setMessage('❌ Недостаточно золота! Нужно: 1000 зол.'); return; }
    
    g.luck = Math.min(25, (g.luck || 0) + 5);
    saveData();
    setMessage('🍀 Вы купили удачу! +5 (всего: ' + g.luck + '/25)');
    addLog('🍀 ' + currentUser + ' купил удачу за 1000 зол.');
    updateMenu();
}

function buyPotionMenu() {
    var potions = [
        { id: 'health_small', name: '🧪 Малое зелье здоровья', price: 30, hp: 20, fatigue: 0 },
        { id: 'health_medium', name: '🧪 Среднее зелье здоровья', price: 80, hp: 50, fatigue: 0 },
        { id: 'health_large', name: '🧪 Большое зелье здоровья', price: 150, hp: 100, fatigue: 0 },
        { id: 'restore', name: '🧪 Зелье восстановления', price: 200, hp: 50, fatigue: 30 },
        { id: 'stamina', name: '🧪 Зелье выносливости', price: 100, hp: 10, fatigue: 20 }
    ];
    
    var msg = '🧪 ЗЕЛЬЯ\n\n';
    potions.forEach(function(p, i) {
        msg += (i + 1) + '. ' + p.name + ' - ' + formatCurrency(p.price);
        msg += ' (❤️+' + p.hp;
        if (p.fatigue > 0) msg += ', 😴+' + p.fatigue;
        msg += ')\n';
    });
    msg += '\n0. Выйти';
    
    var choice = parseInt(prompt(msg));
    if (isNaN(choice) || choice < 1 || choice > potions.length) { setMessage('❌ Отменено.'); return; }
    
    var potion = potions[choice - 1];
    buyPotion(potion.id, potion.price, potion.hp, potion.fatigue);
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
// 11. ГИЛЬДИЯ НАЁМНИКОВ
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
            msg += '📌 АКТИВНОЕ ЗАДАНИЕ:\n';
            msg += activeQuest.name + '\n';
            msg += activeQuest.desc + '\n';
            msg += '📊 Прогресс: ' + progress + '/' + activeQuest.count + '\n';
            msg += '💰 ' + formatCurrency(activeQuest.rewardGold) + ' | ⭐ ' + activeQuest.rewardXp + ' XP\n\n';
        }
    }
    
    msg += 'ДОСТУПНЫЕ ЗАДАНИЯ:\n';
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
    msg += '\nВведите номер задания для взятия, или 0 для выхода:';
    
    var choice = parseInt(prompt(msg));
    if (isNaN(choice) || choice < 1 || choice > quests.length) { setMessage('❌ Отменено.'); return; }
    
    var quest = quests[choice - 1];
    var isCompleted = false;
    for (var l = 0; l < g.quests.completed.length; l++) {
        if (g.quests.completed[l] === quest.id) { isCompleted = true; break; }
    }
    if (isCompleted) { setMessage('❌ Это задание уже выполнено.'); return; }
    if (g.quests.active) { setMessage('❌ У вас уже есть активное задание!'); return; }
    
    takeQuest(quest.id);
}

function generateDailyQuests() {
    var easy = [
        { id: 'easy_kill_rats', name: '🐀 Крысиная охота', desc: 'Убить 5 крыс', type: 'kill', target: 'Крыса', count: 5, rewardGold: 50, rewardXp: 20, difficulty: '🟢 Лёгкий' },
        { id: 'easy_gather_skins', name: '🧵 Сбор шкур', desc: 'Принести 10 шкур', type: 'gather', target: 'Шкура', count: 10, rewardGold: 40, rewardXp: 15, difficulty: '🟢 Лёгкий' },
        { id: 'easy_gather_wood', name: '🪵 Дрова для таверны', desc: 'Принести 15 дерева', type: 'gather', target: 'Дерево', count: 15, rewardGold: 35, rewardXp: 12, difficulty: '🟢 Лёгкий' }
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
    
    if (!g.quests.active) { setMessage('❌ У вас нет активного задания.'); return; }
    
    g.quests.active = null;
    saveData();
    setMessage('❌ Вы отказались от задания.');
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
                setMessage('🎉 Вы достигли ' + g.level + ' уровня! +1 очко атрибутов.');
            } else {
                setMessage('🎉 Вы достигли ' + g.level + ' уровня!');
            }
        }
        
        saveData();
        setMessage('✅ Задание выполнено! +' + formatCurrency(quest.rewardGold) + ', +' + xpGain + ' XP');
        addLog('✅ ' + currentUser + ' выполнил задание ' + quest.name);
        updateMenu();
    }
}

// ============================================================
// 12. БИБЛИОТЕКА МЕЙСТЕРОВ
// ============================================================

function openLibrary() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var available = getBooksAvailable(g);
    
    var msg = '📚 БИБЛИОТЕКА МЕЙСТЕРОВ\n\n';
    msg += '💰 ' + formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper) + '\n';
    msg += '📖 Осталось покупок сегодня: ' + available + '/3\n\n';
    
    var books = [
        { level: 1, xp: 50, price: 100 },
        { level: 5, xp: 100, price: 200 },
        { level: 10, xp: 150, price: 350 },
        { level: 15, xp: 200, price: 500 },
        { level: 20, xp: 300, price: 700 },
        { level: 25, xp: 400, price: 1000 }
    ];
    
    msg += 'ДОСТУПНЫЕ КНИГИ:\n';
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
    
    setMessage('⏳ Чтение книги займёт ' + readTimeMinutes + ' мин.');
    
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
    }, readTimeMinutes * 60 * 1000);
}

// ============================================================
// 13. БОРДЕЛЬ
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
    
    var msg = '💃 БОРДЕЛЬ КОРОЛЕВСКОЙ ГАВАНИ\n\n';
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
        var buffNames = { 'xp': '🎯 Благословение опыта', 'damage': '⚔️ Вдохновение' };
        g.brothelBuffs.push({
            name: buffNames[buff.type] || 'Бафф',
            desc: '+' + buff.value + '% ' + (buff.type === 'xp' ? 'опыта' : 'урона'),
            type: buff.type,
            value: buff.value,
            expires: Date.now() + buff.duration * 60 * 1000
        });
    }
    
    var serviceNames = {
        'rest': 'Отдых с девушкой',
        'wine': 'Вино с компанией',
        'dance': 'Танец',
        'vip': 'VIP-комната'
    };
    
    saveData();
    setMessage('✅ ' + serviceNames[serviceId] + '! +' + fatigue + ' усталости' + (hp > 0 ? ', +' + hp + ' HP' : ''));
    addLog('💃 ' + currentUser + ' посетил бордель (' + serviceNames[serviceId] + ')');
    updateMenu();
}

// ============================================================
// 14. РЫНОК (ТОРГОВЫЕ ЛАВКИ)
// ============================================================

function openMarket() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var msg = '🏪 РЫНОК КОРОЛЕВСКОЙ ГАВАНИ\n\n';
    
    if (g.marketStall && g.marketStall.owned) {
        var stall = marketStalls[g.marketStall.stallId];
        var timeLeft = getTimeLeft(stall.rentPaid, stall.rentDays || 1);
        msg += '🏪 Ваша лавка #' + g.marketStall.stallId + '\n';
        msg += timeLeft.expired ? '⛔ Аренда истекла!\n' : '✅ Активна (' + timeLeft.text + ')\n';
        msg += '📦 ' + (stall.inventory ? stall.inventory.length : 0) + ' товаров\n\n';
    } else {
        msg += 'У вас нет лавки.\n';
        msg += '💡 Купите лавку в Магистрате (80 зол.)\n\n';
    }
    
    msg += 'АКТИВНЫЕ ЛАВКИ:\n';
    var hasStalls = false;
    for (var i = 1; i <= MARKET_STALLS_TOTAL; i++) {
        var stall = marketStalls[i];
        if (stall && stall.owner) {
            var timeLeft = getTimeLeft(stall.rentPaid, stall.rentDays || 1);
            if (!timeLeft.expired) {
                hasStalls = true;
                msg += '#' + i + ' - ' + stall.owner + ' (' + (stall.inventory ? stall.inventory.length : 0) + ' товаров)\n';
            }
        }
    }
    if (!hasStalls) msg += 'Нет активных лавок\n';
    
    msg += '\nВведите номер лавки для входа, или 0 для выхода:';
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
        msg += '1. 📥 Добавить товар\n';
        msg += '2. ❌ Убрать товар\n';
        msg += '3. 🏛️ В Магистрат (оплатить аренду)\n\n';
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
            var idx = parseInt(prompt('Введите номер товара для удаления:'));
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
    
    if (!stall || stall.owner !== currentUser) { setMessage('❌ Это не ваша лавка.'); return; }
    if (g.inventory.length === 0) { setMessage('❌ Инвентарь пуст.'); return; }
    
    var choices = 'Выберите предмет для лавки:\n';
    g.inventory.forEach(function(item, i) {
        var countDisplay = '';
        if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
        choices += (i + 1) + '. ' + item.name + ' (' + (item.quality || 'Обычное') + ')' + countDisplay + '\n';
    });
    choices += '0. Отмена';
    
    var choice = parseInt(prompt(choices));
    if (isNaN(choice) || choice < 1 || choice > g.inventory.length) { setMessage('❌ Отменено.'); return; }
    
    var item = g.inventory.splice(choice - 1, 1)[0];
    
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
    
    if (!stall || stall.owner !== currentUser) { setMessage('❌ Это не ваша лавка.'); return; }
    if (!stall.inventory || idx >= stall.inventory.length) { setMessage('❌ Товар не найден.'); return; }
    
    var item = stall.inventory.splice(idx, 1)[0];
    if (stall.prices) delete stall.prices[idx];
    addToInventory(g, item);
    saveMarketStalls();
    saveData();
    setMessage('✅ Вы убрали ' + item.name + ' из лавки.');
    updateMenu();
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
    if (totalDays > 28) { setMessage('⏳ Вы уже оплатили аренду на 4 недели вперёд.'); return; }
    if (!spendMoney(g, rentCost * 210 * 56)) { setMessage('❌ Недостаточно денег! Нужно: ' + rentCost + ' золота.'); return; }
    
    stall.rentDays = (stall.rentDays || 0) + 7;
    stall.rentPaid = Date.now();
    g.marketStall.rentDays = stall.rentDays;
    g.marketStall.rentPaid = Date.now();
    
    saveMarketStalls();
    saveData();
    setMessage('✅ Вы оплатили аренду лавки на неделю!');
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
        confiscatedItems.push({
            owner: currentUser,
            items: stall.inventory,
            confiscatedAt: Date.now(),
            type: 'stall'
        });
        saveData();
        setMessage('📦 Товары из лавки #' + stallId + ' перемещены в конфискат.');
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
    msg += 'Введите номер предмета для забора, или 0 для выхода:';
    
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
    if (realEntryIdx === -1) { setMessage('❌ Ошибка: предмет не найден.'); return; }
    
    var item = foundEntry.items.splice(foundIdx, 1)[0];
    addToInventory(g, item);
    
    if (foundEntry.items.length === 0) {
        confiscatedItems.splice(realEntryIdx, 1);
    }
    
    saveData();
    setMessage('✅ Вы забрали ' + item.name + ' из конфиската.');
    updateMenu();
}

// ============================================================
// 16. МАГИСТРАТ (ЦЕНТР УПРАВЛЕНИЯ)
// ============================================================

function openMagistrate() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var msg = '📜 МАГИСТРАТ КОРОЛЕВСКОЙ ГАВАНИ\n\n';
    msg += '1. 🏠 Недвижимость\n';
    msg += '2. 🏪 Торговые лавки\n';
    msg += '3. 📦 Конфискат\n';
    msg += '0. Выйти';
    
    var choice = prompt(msg);
    if (choice === '1') { magistrateHousing(); }
    else if (choice === '2') { magistrateStalls(); }
    else if (choice === '3') { openConfiscated(); }
}

function magistrateHousing() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var msg = '🏠 НЕДВИЖИМОСТЬ\n\n';
    
    if (g.housing && g.housing.type) {
        var house = HOUSING_TYPES[g.housing.type];
        var timeLeft = getTimeLeft(g.housing.rentPaid, g.housing.rentDays || 1);
        msg += 'ВАШЕ ЖИЛЬЁ:\n';
        msg += house.emoji + ' ' + house.name + '\n';
        msg += '📍 ' + house.district + '\n';
        msg += '📦 Склад: ' + (g.housing.storage ? g.housing.storage.length : 0) + '/' + house.storageSlots + '\n';
        msg += timeLeft.expired ? '⛔ АРЕНДА ПРОСРОЧЕНА!\n' : '⏳ Осталось: ' + timeLeft.text + '\n';
        msg += '\n1. 💰 Оплатить аренду (' + house.rent + ' зол./нед)\n';
        msg += '2. 🏚️ Продать жильё\n';
        msg += '0. Назад\n\n';
    } else {
        msg += 'У вас нет жилья.\n\n';
    }
    
    msg += 'ДОСТУПНОЕ ЖИЛЬЁ:\n';
    var districts = {
        'Королевский квартал': ['mansion', 'townhouse'],
        'Торговый квартал': ['house', 'room'],
        'Квартал бедноты': ['night']
    };
    
    for (var dist in districts) {
        msg += '\n📍 ' + dist + ':\n';
        var types = districts[dist];
        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            var h = HOUSING_TYPES[type];
            var market = housingMarket[type];
            var available = market.total - market.occupied;
            msg += '  ' + h.emoji + ' ' + h.name + ' - ' + h.price + ' зол.';
            msg += (available > 0) ? ' (✅ ' + available + ' свободно)' : ' (❌ РАСПРОДАНО)';
            if (available > 0) {
                msg += ' [введите ' + type + ' для покупки]';
            }
            msg += '\n';
        }
    }
    
    var action = prompt(msg + '\n\nВведите команду:');
    if (!action || action === '0') return;
    
    if (action === '1' && g.housing && g.housing.type) {
        payRent();
        return;
    }
    if (action === '2' && g.housing && g.housing.type) {
        sellHouse();
        return;
    }
    
    if (HOUSING_TYPES[action]) {
        buyHouse(action);
    } else {
        setMessage('❌ Неверная команда.');
    }
}

function magistrateStalls() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var msg = '🏪 ТОРГОВЫЕ ЛАВКИ\n\n';
    msg += 'Стоимость лавки: 80 золота. Аренда: 10 золота/неделя.\n\n';
    
    if (g.marketStall && g.marketStall.owned) {
        var stall = marketStalls[g.marketStall.stallId];
        var timeLeft = getTimeLeft(stall.rentPaid, stall.rentDays || 1);
        msg += '🏪 Ваша лавка #' + g.marketStall.stallId + '\n';
        msg += timeLeft.expired ? '⛔ АРЕНДА ПРОСРОЧЕНА!\n' : '⏳ Осталось: ' + timeLeft.text + '\n';
        msg += '📦 ' + (stall.inventory ? stall.inventory.length : 0) + ' товаров\n';
        msg += '\n1. 💰 Оплатить аренду (10 зол.)\n';
        msg += '2. 🚪 Оставить лавку\n';
        msg += '0. Назад\n\n';
    } else {
        var freeStalls = 0;
        for (var i = 1; i <= MARKET_STALLS_TOTAL; i++) {
            if (!marketStalls[i].owner) freeStalls++;
        }
        msg += 'Свободных лавок: ' + freeStalls + '\n';
        msg += '\n1. 🏪 Купить лавку (80 зол.)\n';
        msg += '0. Назад\n\n';
    }
    
    var action = prompt(msg);
    if (!action || action === '0') return;
    
    if (action === '1') {
        if (g.marketStall && g.marketStall.owned) {
            payStallRent();
        } else {
            buyStall();
        }
    } else if (action === '2' && g.marketStall && g.marketStall.owned) {
        leaveStall();
    }
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
}

// ============================================================
// 17. ИГРА В КОСТИ (PvP)
// ============================================================

function playDice() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var activeGames = getActiveDiceGames();
    var msg = '🎲 ИГРА В КОСТИ (PvP)\n\n';
    
    if (activeGames.length > 0) {
        msg += 'АКТИВНЫЕ ИГРЫ:\n';
        for (var i = 0; i < activeGames.length; i++) {
            var game = activeGames[i];
            if (game.creator !== currentUser) {
                var timeLeft = Math.ceil((game.createdAt + 5 * 60 * 1000 - Date.now()) / 60000);
                msg += '🎲 ' + game.creator + ' (ставка: ' + formatCurrency(game.bet) + ') - ⏳ ' + timeLeft + ' мин\n';
            }
        }
        msg += '\n';
    }
    
    msg += 'СОЗДАТЬ ИГРУ (ставка):\n';
    msg += '1. 10 МП\n';
    msg += '2. 25 МП\n';
    msg += '3. 50 МП\n';
    msg += '4. 100 МП\n';
    msg += '5. 200 МП\n';
    msg += '6. Присоединиться к игре (введите ID)\n';
    msg += '0. Выйти';
    
    var choice = parseInt(prompt(msg));
    
    if (choice >= 1 && choice <= 5) {
        var bets = [10, 25, 50, 100, 200];
        createDiceGame(bets[choice - 1]);
    } else if (choice === 6) {
        var gameId = prompt('Введите ID игры:');
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
    setMessage('✅ Вы создали игру в кости на ' + formatCurrency(bet) + '! ID: ' + gameId);
    addLog('🎲 ' + currentUser + ' создал игру в кости на ' + formatCurrency(bet));
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
    
    rollDice(gameId);
}

function rollDice(gameId) {
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
        if (game.creatorRoll !== null) { setMessage('❌ Вы уже бросили кости!'); return; }
        game.creatorRoll = total;
        setMessage('🎲 Ваш бросок: ' + dice1 + ' + ' + dice2 + ' = ' + total + ' (ждём соперника)');
    } else if (game.player2 === currentUser) {
        if (game.player2Roll !== null) { setMessage('❌ Вы уже бросили кости!'); return; }
        game.player2Roll = total;
        setMessage('🎲 Ваш бросок: ' + dice1 + ' + ' + dice2 + ' = ' + total + ' (ждём соперника)');
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
}

// ============================================================
// 18. ПОРТ
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
// 19. ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ parseCurrencyInput
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
// 20. ПЕРЕОПРЕДЕЛЕНИЕ updateStory И updateActions (если нужно)
// ============================================================

// Заменяем функции в main.js на наши, если они есть
if (typeof window.updateStory !== 'function' || window.updateStory.toString().indexOf('Таверна') !== -1) {
    window.updateStory = updateStory;
}

if (typeof window.updateActions !== 'function' || window.updateActions.toString().indexOf('actions-container') === -1) {
    window.updateActions = updateActions;
}

// ============================================================
// 21. РЕГИСТРАЦИЯ В ГЛОБАЛЬНУЮ ОБЛАСТЬ
// ============================================================

// Регистрируем все функции в глобальной области
window.openMap = openMap;
window.closeMap = closeMap;
window.goToBuilding = goToBuilding;
window.updateStory = updateStory;
window.updateActions = updateActions;
window.openInventory = openInventory;
window.openCharacter = openCharacter;
window.openMainMenu = openMainMenu;
window.openLog = openLog;
window.closeLog = closeLog;
window.closeMenu = closeMenu;
window.openHouses = openHouses;
window.closeHouses = closeHouses;
window.showOnlineList = showOnlineList;
window.closeOnline = closeOnline;

// Функции для зданий
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

// Функции для жилья
window.buyHouse = buyHouse;
window.sellHouse = sellHouse;
window.payRent = payRent;
window.checkRent = checkRent;

// Функции для лавок
window.enterStall = enterStall;
window.addToStall = addToStall;
window.buyFromStall = buyFromStall;
window.removeFromStall = removeFromStall;
window.payStallRent = payStallRent;
window.checkStallRent = checkStallRent;
window.confiscateStall = confiscateStall;
window.buyStall = buyStall;
window.leaveStall = leaveStall;

// Функции для книг
window.readBook = readBook;
window.buyBook = buyBook;

// Функции для квестов
window.takeQuest = takeQuest;
window.abandonQuest = abandonQuest;
window.checkQuestProgress = checkQuestProgress;

// Функции для костей
window.playDice = playDice;
window.createDiceGame = createDiceGame;
window.joinDiceGame = joinDiceGame;
window.rollDice = rollDice;
window.finishDiceGame = finishDiceGame;

// Функции для магазинов (заглушки, пока нет логики)
window.openShop = function(shopType) {
    setMessage('🏪 ' + shopType + ' (в разработке)');
};

window.openCraftMenu = function() {
    setMessage('🔨 Крафт (в разработке)');
};

// ============================================================
// 22. ИНИЦИАЛИЗАЦИЯ
// ============================================================

(function() {
    console.log('🏰 Королевская Гавань загружена!');
    console.log('📍 Текущая локация: ' + (currentUser ? users[currentUser]?.game?.location?.place : 'неизвестно'));
})();

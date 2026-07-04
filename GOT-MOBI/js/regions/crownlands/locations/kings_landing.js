// ============================================================
// core/kingsLanding.js - ПОЛНАЯ ЛОГИКА КОРОЛЕВСКОЙ ГАВАНИ
// ============================================================

// ============================================================
// 1. КОНСТАНТЫ
// ============================================================

// 1.1 ЗДАНИЯ ГОРОДА
export const BUILDINGS = [
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

// 1.2 УРОВНИ ЛОКАЦИЙ
export const LOCATION_LEVELS = {
    'Таверна':1,'Рынок':1,'Кузница':1,'Оружейная лавка':1,'Кожевник':1,'Бронник':1,
    'Плотник':1,'Конюшня':1,'Гильдия торговцев':1,'Магистрат':1,
    'Ворота':1,
    'Королевский квартал':1,'Торговый квартал':1,'Квартал бедноты':1,'Дом':1,
    'Великая септа':1,'Порт':1,'Тюрьма':1,
    'Дорога':5,
    'Библиотека мейстеров':1,
    'Гильдия наёмников':1,
    'Бордель':1
};

// 1.3 ТИПЫ ЖИЛЬЯ
export const HOUSING_TYPES = {
    'night': { 
        name: 'Ночлежка', 
        district: 'Квартал бедноты', 
        price: 30, 
        rent: 3, 
        storageSlots: 10, 
        restHp: 10, 
        restFatigue: 10,
        bonusInt: 0, bonusLuck: -1, bonusDef: 0,
        emoji: '🏚️', 
        description: 'Общая комната. Дешево, но шумно.'
    },
    'room': { 
        name: 'Комната', 
        district: 'Торговый квартал', 
        price: 120, 
        rent: 8, 
        storageSlots: 20, 
        restHp: 20, 
        restFatigue: 20,
        bonusInt: 1, bonusLuck: 0, bonusDef: 0,
        emoji: '🏠', 
        description: 'Скромная комната с кроватью, столом и шкафом.'
    },
    'house': { 
        name: 'Дом', 
        district: 'Торговый квартал', 
        price: 400, 
        rent: 20, 
        storageSlots: 40, 
        restHp: 35, 
        restFatigue: 35,
        bonusInt: 2, bonusLuck: 0, bonusDef: 1,
        emoji: '🏡', 
        description: 'Собственный дом с садом, подвалом и чердаком.'
    },
    'townhouse': { 
        name: 'Таунхаус', 
        district: 'Королевский квартал', 
        price: 800, 
        rent: 35, 
        storageSlots: 60, 
        restHp: 50, 
        restFatigue: 50,
        bonusInt: 3, bonusLuck: 1, bonusDef: 2,
        emoji: '🏘️', 
        description: 'Двухэтажный дом в престижном районе.'
    },
    'mansion': { 
        name: 'Особняк', 
        district: 'Королевский квартал', 
        price: 2000, 
        rent: 80, 
        storageSlots: 100, 
        restHp: 70, 
        restFatigue: 70,
        bonusInt: 5, bonusLuck: 2, bonusDef: 3,
        emoji: '🏛️', 
        description: 'Роскошный особняк. Огромные залы и подвалы.'
    }
};

// 1.4 РЫНОК НЕДВИЖИМОСТИ
export let housingMarket = {
    'night': { total: 400, occupied: 0 },
    'room': { total: 300, occupied: 0 },
    'house': { total: 250, occupied: 0 },
    'townhouse': { total: 80, occupied: 0 },
    'mansion': { total: 10, occupied: 0 }
};

// 1.5 ТОРГОВЫЕ ЛАВКИ
export const MARKET_STALLS_TOTAL = 50;
export let marketStalls = {};

// 1.6 КНИГИ
export const BOOKS = [
    { level: 1, xp: 50, price: 100 },
    { level: 5, xp: 100, price: 200 },
    { level: 10, xp: 150, price: 350 },
    { level: 15, xp: 200, price: 500 },
    { level: 20, xp: 300, price: 700 },
    { level: 25, xp: 400, price: 1000 }
];

// 1.7 ВРЕМЯ В СЕПТЕ
export const TEMPLE_COOLDOWNS = { 
    heal: 2 * 60 * 60 * 1000  // 2 часа
};

// 1.8 КОНИ
export const HORSE_TYPES = {
    'work': { name: 'Рабочая лошадь', price: 50, speedBonus: 10, defensePercent: 0, hp: 80, inventorySlots: 5, emoji: '🐴', description: 'Надёжная, но медленная.' },
    'riding': { name: 'Верховая лошадь', price: 150, speedBonus: 25, defensePercent: 2, hp: 100, inventorySlots: 10, emoji: '🏇', description: 'Отличный баланс скорости и выносливости.' },
    'war': { name: 'Боевой конь', price: 400, speedBonus: 20, defensePercent: 5, hp: 150, inventorySlots: 8, emoji: '⚔️', description: 'Смелый и сильный.' },
    'racer': { name: 'Скакун', price: 600, speedBonus: 50, defensePercent: 0, hp: 70, inventorySlots: 3, emoji: '🏃', description: 'Очень быстрый, но хрупкий.' },
    'heavy': { name: 'Тяжелый скакун', price: 800, speedBonus: 15, defensePercent: 8, hp: 200, inventorySlots: 15, emoji: '🛡️', description: 'Мощный и выносливый.' },
    'royal': { name: 'Королевский скакун', price: 1500, speedBonus: 40, defensePercent: 6, hp: 180, inventorySlots: 12, emoji: '👑', description: 'Элитный скакун для знати.' },
    'fire': { name: 'Огненный жеребец', price: 3000, speedBonus: 60, defensePercent: 10, hp: 250, inventorySlots: 10, emoji: '🔥', description: 'Легендарный жеребец. Всего 1 в неделю!' }
};

// 1.9 РЫНОК КОНЕЙ
export let horseMarket = {
    'work': { total: 50, sold: 0, resetTime: null },
    'riding': { total: 30, sold: 0, resetTime: null },
    'war': { total: 20, sold: 0, resetTime: null },
    'racer': { total: 15, sold: 0, resetTime: null },
    'heavy': { total: 10, sold: 0, resetTime: null },
    'royal': { total: 5, sold: 0, resetTime: null },
    'fire': { total: 1, sold: 0, resetTime: null }
};

// 1.10 КОНФИСКАТ
export let confiscatedItems = [];

// 1.11 ИГРЫ В КОСТИ (PvP)
export let diceGames = {};
export let diceGameIdCounter = 0;

// ============================================================
// 2. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

// 2.1 КОНВЕРТАЦИЯ ВАЛЮТЫ
export function convertCurrency(g) {
    while (g.copper >= 56) {
        g.silver += Math.floor(g.copper / 56);
        g.copper = g.copper % 56;
    }
    while (g.silver >= 210) {
        g.gold += Math.floor(g.silver / 210);
        g.silver = g.silver % 210;
    }
    return g;
}

// 2.2 ТРАТА ДЕНЕГ
export function spendMoney(g, amount) {
    if (amount <= 0) return true;
    let total = g.copper + g.silver*56 + g.gold*210*56;
    if (total < amount) return false;
    total -= amount;
    g.gold = Math.floor(total / (210*56));
    total %= (210*56);
    g.silver = Math.floor(total / 56);
    g.copper = total % 56;
    return true;
}

// 2.3 ФОРМАТИРОВАНИЕ ВАЛЮТЫ
export function formatCurrency(amount) {
    if (amount < 0) return '0 МП';
    if (amount === 0) return '0 МП';
    
    const gold = Math.floor(amount / (210 * 56));
    let remaining = amount % (210 * 56);
    const silver = Math.floor(remaining / 56);
    const copper = remaining % 56;
    
    let parts = [];
    if (gold > 0) parts.push(gold + ' ЗОЛ');
    if (silver > 0) parts.push(silver + ' СО');
    if (copper > 0 || parts.length === 0) parts.push(copper + ' МП');
    
    return parts.join(' ');
}

// 2.4 ПАРСИНГ ВВОДА ЦЕНЫ
export function parseCurrencyInput(input) {
    input = input.trim().toUpperCase();
    if (!input) return null;
    
    if (/^\d+$/.test(input)) {
        return parseInt(input);
    }
    
    let total = 0;
    const patterns = [
        { regex: /(\d+)\s*ЗОЛ(ОТО)?/i, multiplier: 210 * 56 },
        { regex: /(\d+)\s*СО(РЕБРО)?/i, multiplier: 56 },
        { regex: /(\d+)\s*МП(ЕДЬ)?/i, multiplier: 1 },
        { regex: /(\d+)\s*G(OLD)?/i, multiplier: 210 * 56 },
        { regex: /(\d+)\s*S(ILVER)?/i, multiplier: 56 },
        { regex: /(\d+)\s*C(OPPER)?/i, multiplier: 1 },
    ];
    
    for (const pattern of patterns) {
        const regex = new RegExp(pattern.regex.source, 'gi');
        let match;
        while ((match = regex.exec(input)) !== null) {
            const value = parseInt(match[1]);
            if (!isNaN(value)) {
                total += value * pattern.multiplier;
            }
        }
    }
    
    if (total > 0) return total;
    
    let parts = input.split(' ');
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const num = parseInt(part);
        if (isNaN(num)) continue;
        const next = i + 1 < parts.length ? parts[i + 1] : '';
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

// 2.5 ВРЕМЯ ДО ОКОНЧАНИЯ АРЕНДЫ
export function getTimeLeft(timestamp, daysPaid) {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const hourMs = 60 * 60 * 1000;
    const expireTime = timestamp + (daysPaid * dayMs);
    const timeLeft = expireTime - now;
    
    if (timeLeft <= 0) {
        return { expired: true, text: '⚠️ ПРОСРОЧЕНО!' };
    }
    
    const days = Math.floor(timeLeft / dayMs);
    const hours = Math.floor((timeLeft % dayMs) / hourMs);
    
    return {
        expired: false,
        days: days,
        hours: hours,
        text: days + ' дн. ' + hours + ' ч.'
    };
}

// 2.6 ДОБАВЛЕНИЕ В ИНВЕНТАРЬ (СТЕКИ)
export function addToInventory(g, item) {
    if (!g || !g.inventory) return false;
    
    if (!isStackable(item)) {
        g.inventory.push(item);
        return true;
    }
    
    const key = item.name + '|' + (item.quality || 'Обычное') + '|' + (item.resourceType || '');
    for (let i = 0; i < g.inventory.length; i++) {
        const existing = g.inventory[i];
        if (!isStackable(existing)) continue;
        const existingKey = existing.name + '|' + (existing.quality || 'Обычное') + '|' + (existing.resourceType || '');
        if (existingKey === key) {
            existing.count = (existing.count || 1) + (item.count || 1);
            return true;
        }
    }
    if (!item.count) item.count = 1;
    g.inventory.push(item);
    return true;
}

// 2.7 ПРОВЕРКА СТЕКАЕМОСТИ
export function isStackable(item) {
    if (!item) return false;
    if (item.type === 'resource') return true;
    if (item.type === 'food' && item.effect) return true;
    const stackableNames = ['Хлеб', 'Мясо', 'Рыба', 'Вода', 'Эль', 'Вино', 'Кожа', 'Руда', 'Уголь', 'Сталь', 'Дерево', 'Шкура'];
    if (item.name) {
        for (let name of stackableNames) {
            if (item.name.includes(name)) return true;
        }
    }
    return false;
}

// ============================================================
// 3. МАГИСТРАТ (НЕДВИЖИМОСТЬ)
// ============================================================

// 3.1 ПОКУПКА ЖИЛЬЯ
export function buyHouse(g, type) {
    const house = HOUSING_TYPES[type];
    if (!house) { setMessage('❌ Такого жилья нет.'); return false; }
    
    if (g.housing && g.housing.type) {
        setMessage('❌ У вас уже есть жильё! Продайте его, чтобы купить новое.');
        return false;
    }
    
    const market = housingMarket[type];
    if (!market || market.occupied >= market.total) {
        setMessage('❌ Все ' + house.name + ' уже проданы!');
        return false;
    }
    
    if (!spendMoney(g, house.price * 210 * 56)) {
        setMessage('❌ Недостаточно денег! Нужно: ' + house.price + ' золота.');
        return false;
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
    
    setMessage('✅ Вы купили ' + house.name + '! Осталось: ' + (market.total - market.occupied) + ' свободных.');
    addLog('🏠 ' + currentUser + ' купил ' + house.name);
    return true;
}

// 3.2 ПРОДАЖА ЖИЛЬЯ
export function sellHouse(g) {
    if (!g.housing || !g.housing.type) { 
        setMessage('❌ У вас нет жилья.'); 
        return false; 
    }
    
    const house = HOUSING_TYPES[g.housing.type];
    const refund = Math.floor(house.price * 0.6);
    g.copper += refund;
    convertCurrency(g);
    
    if (g.housing.storage && g.housing.storage.length > 0) {
        if (!g.housing.storageHold) g.housing.storageHold = [];
        g.housing.storageHold = g.housing.storageHold.concat(g.housing.storage);
        g.housing.storage = [];
        setMessage('📦 Предметы со склада перемещены в камеру хранения Магистрата.');
    }
    
    const market = housingMarket[g.housing.type];
    if (market) market.occupied = Math.max(0, market.occupied - 1);
    saveHousingMarket();
    
    g.housing.type = null;
    g.housing.debt = 0;
    g.housing.rentPaid = null;
    g.housing.rentDays = 0;
    
    setMessage('🏚️ Вы продали ' + house.name + ' за ' + refund + ' золота.');
    addLog('💰 ' + currentUser + ' продал ' + house.name);
    return true;
}

// 3.3 ОПЛАТА АРЕНДЫ
export function payRent(g) {
    if (!g.housing || !g.housing.type) {
        setMessage('❌ У вас нет жилья!');
        return false;
    }
    
    const house = HOUSING_TYPES[g.housing.type];
    const maxWeeks = 4;
    const currentDays = g.housing.rentDays || 0;
    const totalDays = currentDays + 7;
    
    if (totalDays > 28) {
        setMessage('⏳ Вы уже оплатили аренду на 4 недели вперёд.');
        return false;
    }
    
    if (!spendMoney(g, house.rent * 210 * 56)) {
        setMessage('❌ Недостаточно денег! Нужно: ' + house.rent + ' золота.');
        return false;
    }
    
    g.housing.rentDays = (g.housing.rentDays || 0) + 7;
    g.housing.rentPaid = Date.now();
    
    setMessage('✅ Вы оплатили аренду за ' + house.name + ' на неделю!');
    addLog('💰 ' + currentUser + ' оплатил аренду за ' + house.name);
    return true;
}

// 3.4 ПРОВЕРКА АРЕНДЫ
export function checkRent(g) {
    if (!g.housing || !g.housing.type) return;
    
    const timeLeft = getTimeLeft(g.housing.rentPaid, g.housing.rentDays || 1);
    
    if (timeLeft.expired) {
        evictFromHousing(g);
        setMessage('🚪 Ваш дом конфискован за неуплату!');
    }
}

// 3.5 ВЫСЕЛЕНИЕ
export function evictFromHousing(g) {
    if (!g.housing || !g.housing.type) return;
    
    const house = HOUSING_TYPES[g.housing.type];
    const market = housingMarket[g.housing.type];
    if (market) market.occupied = Math.max(0, market.occupied - 1);
    saveHousingMarket();
    
    if (g.housing.storage && g.housing.storage.length > 0) {
        confiscatedItems.push({
            owner: currentUser,
            items: g.housing.storage,
            confiscatedAt: Date.now(),
            type: 'house'
        });
        g.housing.storage = [];
        setMessage('📦 Предметы со склада перемещены в конфискат.');
    }
    
    const oldType = g.housing.type;
    g.housing.type = null;
    g.housing.rentDays = 0;
    g.housing.rentPaid = null;
    g.housing.debt = 0;
    
    setMessage('💀 Вас выселили из ' + house.name + ' за неуплату!');
    addLog('💀 ' + currentUser + ' выселен из ' + oldType);
}

// 3.6 СОХРАНЕНИЕ РЫНКА НЕДВИЖИМОСТИ
export function saveHousingMarket() {
    localStorage.setItem('got_housing_market', JSON.stringify(housingMarket));
}

export function loadHousingMarket() {
    try {
        const raw = localStorage.getItem('got_housing_market');
        if (raw) {
            const parsed = JSON.parse(raw);
            for (let key in housingMarket) {
                if (parsed[key]) {
                    housingMarket[key].occupied = parsed[key].occupied || 0;
                }
            }
        }
    } catch(e) {}
}

// ============================================================
// 4. ТОРГОВЫЕ ЛАВКИ (РЫНОК)
// ============================================================

// 4.1 ИНИЦИАЛИЗАЦИЯ ЛАВОК
export function initMarketStalls() {
    for (let i = 1; i <= MARKET_STALLS_TOTAL; i++) {
        if (!marketStalls[i]) {
            marketStalls[i] = {
                owner: null,
                rentPaid: null,
                rentDays: 0,
                inventory: [],
                prices: {}
            };
        }
    }
}

// 4.2 ЗАГРУЗКА ЛАВОК
export function loadMarketStalls() {
    try {
        const raw = localStorage.getItem('got_market_stalls');
        if (raw) {
            marketStalls = JSON.parse(raw);
        } else {
            initMarketStalls();
        }
    } catch(e) {
        initMarketStalls();
    }
}

// 4.3 СОХРАНЕНИЕ ЛАВОК
export function saveMarketStalls() {
    localStorage.setItem('got_market_stalls', JSON.stringify(marketStalls));
}

// 4.4 ДОБАВЛЕНИЕ ТОВАРА В ЛАВКУ
export function addToStall(g, stallId) {
    const stall = marketStalls[stallId];
    if (!stall || stall.owner !== currentUser) {
        setMessage('❌ Это не ваша лавка.');
        return false;
    }
    
    if (g.inventory.length === 0) {
        setMessage('❌ Инвентарь пуст.');
        return false;
    }
    
    // Выбор предмета
    let choices = 'Выберите предмет для лавки (можно целый стек):\n';
    g.inventory.forEach((item, i) => {
        let countDisplay = '';
        if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
        choices += (i + 1) + '. ' + item.name + ' (' + (item.quality || 'Обычное') + ')' + countDisplay + '\n';
    });
    choices += '0. Отмена';
    const choice = prompt(choices);
    const index = parseInt(choice) - 1;
    if (isNaN(index) || index < 0 || index >= g.inventory.length) {
        setMessage('❌ Отменено.');
        return false;
    }
    
    const item = g.inventory.splice(index, 1)[0];
    
    // Ввод цены
    const input = prompt(
        'Введите цену:\n' +
        'Примеры:\n' +
        '• 100 (медь)\n' +
        '• 5 ЗОЛ (золото)\n' +
        '• 2 СО (серебро)\n' +
        '• 1 ЗОЛ 50 МП'
    );
    
    if (!input) {
        setMessage('❌ Отменено.');
        addToInventory(g, item);
        return false;
    }
    
    const price = parseCurrencyInput(input);
    if (price === null || price < 1) {
        setMessage('❌ Цена должна быть не менее 1 МП.');
        addToInventory(g, item);
        return false;
    }
    
    if (!stall.inventory) stall.inventory = [];
    if (!stall.prices) stall.prices = {};
    const newIdx = stall.inventory.length;
    stall.inventory.push(item);
    stall.prices[newIdx] = price;
    
    saveMarketStalls();
    setMessage('✅ Вы добавили ' + item.name + ' в лавку за ' + formatCurrency(price));
    addLog('🏪 ' + currentUser + ' добавил ' + item.name + ' в лавку #' + stallId);
    return true;
}

// 4.5 ПОКУПКА ТОВАРА ИЗ ЛАВКИ
export function buyFromStall(g, stallId, idx) {
    const stall = marketStalls[stallId];
    if (!stall || !stall.inventory || idx >= stall.inventory.length) {
        setMessage('❌ Товар не найден.');
        return false;
    }
    
    const item = stall.inventory[idx];
    const price = stall.prices && stall.prices[idx] ? stall.prices[idx] : 0;
    if (price <= 0) {
        setMessage('❌ Цена не указана.');
        return false;
    }
    
    if (!spendMoney(g, price)) {
        setMessage('❌ Недостаточно денег! Нужно: ' + formatCurrency(price));
        return false;
    }
    
    const owner = users[stall.owner];
    if (owner) {
        owner.game.copper += price;
        convertCurrency(owner.game);
        saveData();
    }
    
    stall.inventory.splice(idx, 1);
    if (stall.prices) delete stall.prices[idx];
    addToInventory(g, item);
    saveMarketStalls();
    
    setMessage('✅ Вы купили ' + item.name + ' за ' + formatCurrency(price));
    addLog('🏪 ' + currentUser + ' купил ' + item.name + ' в лавке #' + stallId + ' за ' + formatCurrency(price));
    return true;
}

// 4.6 ПРОВЕРКА АРЕНДЫ ЛАВКИ
export function checkStallRent(g) {
    if (!g.marketStall || !g.marketStall.owned) return;
    const stall = marketStalls[g.marketStall.stallId];
    if (!stall) return;
    
    const timeLeft = getTimeLeft(stall.rentPaid, stall.rentDays || 1);
    if (timeLeft.expired) {
        confiscateStall(g);
        setMessage('🚪 Ваша лавка конфискована за неуплату!');
    }
}

// 4.7 КОНФИСКАЦИЯ ЛАВКИ
export function confiscateStall(g) {
    const stallId = g.marketStall.stallId;
    const stall = marketStalls[stallId];
    if (!stall || stall.owner !== currentUser) return;
    
    if (stall.inventory && stall.inventory.length > 0) {
        confiscatedItems.push({
            owner: currentUser,
            items: stall.inventory,
            confiscatedAt: Date.now(),
            type: 'stall'
        });
        setMessage('📦 Товары из лавки #' + stallId + ' перемещены в конфискат.');
    }
    
    stall.owner = null;
    stall.rentPaid = null;
    stall.rentDays = 0;
    stall.inventory = [];
    stall.prices = {};
    
    g.marketStall = { owned: false, stallId: null, rentPaid: null, rentDays: 0, debt: 0 };
    
    saveMarketStalls();
    setMessage('🚪 Лавка #' + stallId + ' конфискована за неуплату!');
    addLog('🚪 ' + currentUser + ' потерял лавку #' + stallId + ' (конфискат)');
}

// ============================================================
// 5. СКЛАД (ДОМ)
// ============================================================

// 5.1 ОТКРЫТЬ СКЛАД
export function openStorage(g) {
    if (!g.housing || !g.housing.type) {
        setMessage('❌ У вас нет жилья!');
        return;
    }
    
    const house = HOUSING_TYPES[g.housing.type];
    const storage = g.housing.storage || [];
    
    // Показать содержимое склада
    let msg = '📦 СКЛАД (' + house.name + ')\n';
    msg += 'Свободно: ' + ((house.storageSlots || 10) - storage.length) + '/' + house.storageSlots + ' слотов\n\n';
    
    if (storage.length === 0) {
        msg += '📭 Склад пуст';
    } else {
        storage.forEach((item, i) => {
            const quality = item.quality || 'Обычное';
            let countDisplay = '';
            if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
            msg += (i + 1) + '. ' + item.name + ' (' + quality + ')' + countDisplay + '\n';
        });
    }
    
    // Действия со складом
    const action = prompt(msg + '\n\nВыберите действие:\n1. Положить предмет\n2. Забрать предмет\n0. Выйти');
    
    if (action === '1') {
        moveToStorage(g);
    } else if (action === '2') {
        const idx = prompt('Введите номер предмета для забора:');
        const index = parseInt(idx) - 1;
        if (!isNaN(index) && index >= 0 && index < storage.length) {
            takeFromStorage(g, index);
        }
    }
}

// 5.2 ПОЛОЖИТЬ НА СКЛАД
export function moveToStorage(g) {
    if (!g.housing || !g.housing.type) {
        setMessage('❌ У вас нет жилья!');
        return;
    }
    
    const house = HOUSING_TYPES[g.housing.type];
    const storage = g.housing.storage || [];
    
    if (storage.length >= house.storageSlots) {
        setMessage('❌ Склад переполнен!');
        return;
    }
    
    if (g.inventory.length === 0) {
        setMessage('❌ Инвентарь пуст!');
        return;
    }
    
    let choices = 'Выберите предмет для склада:\n';
    g.inventory.forEach((item, i) => {
        let countDisplay = '';
        if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
        choices += (i + 1) + '. ' + item.name + ' (' + (item.quality || 'Обычное') + ')' + countDisplay + '\n';
    });
    const choice = prompt(choices + '\nВведите номер предмета:');
    const index = parseInt(choice) - 1;
    if (isNaN(index) || index < 0 || index >= g.inventory.length) {
        setMessage('❌ Отменено.');
        return;
    }
    
    const item = g.inventory.splice(index, 1)[0];
    if (!g.housing.storage) g.housing.storage = [];
    g.housing.storage.push(item);
    setMessage('✅ Вы положили ' + item.name + ' на склад.');
}

// 5.3 ЗАБРАТЬ СО СКЛАДА
export function takeFromStorage(g, index) {
    if (!g.housing || !g.housing.storage) {
        setMessage('❌ Склад пуст.');
        return;
    }
    if (index >= g.housing.storage.length) {
        setMessage('❌ Предмет не найден.');
        return;
    }
    const item = g.housing.storage.splice(index, 1)[0];
    addToInventory(g, item);
    setMessage('✅ Вы забрали ' + item.name + ' со склада.');
}

// ============================================================
// 6. КОНЮШНЯ
// ============================================================

// 6.1 ПОКУПКА ЛОШАДИ
export function buyHorse(g, type) {
    const horse = HORSE_TYPES[type];
    if (!horse) { setMessage('❌ Такой лошади нет.'); return false; }
    
    checkHorseReset();
    const market = horseMarket[type];
    if (market.sold >= market.total) {
        setMessage('❌ Все ' + horse.name + ' на этой неделе уже проданы!');
        return false;
    }
    
    if (g.equipment && g.equipment.horse) {
        setMessage('❌ У вас уже есть лошадь! Продайте её, чтобы купить новую.');
        return false;
    }
    
    if (!spendMoney(g, horse.price * 210 * 56)) {
        setMessage('❌ Недостаточно денег! Нужно: ' + formatCurrency(horse.price * 210 * 56));
        return false;
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
    
    setMessage('✅ Вы купили ' + horse.name + '! Осталось: ' + (market.total - market.sold));
    addLog('🐴 ' + currentUser + ' купил ' + horse.name);
    return true;
}

// 6.2 ПРОДАЖА ЛОШАДИ
export function sellHorse(g) {
    if (!g.equipment || !g.equipment.horse) {
        setMessage('❌ У вас нет лошади.');
        return false;
    }
    
    const horseType = HORSE_TYPES[g.equipment.horse.horseType];
    if (!horseType) return false;
    
    const refund = Math.floor(horseType.price * 0.5);
    g.copper += refund;
    convertCurrency(g);
    g.equipment.horse = null;
    
    setMessage('💰 Вы продали лошадь за ' + formatCurrency(refund * 210 * 56));
    addLog('💰 ' + currentUser + ' продал лошадь');
    return true;
}

// 6.3 ПРОВЕРКА ОБНОВЛЕНИЯ РЫНКА КОНЕЙ
export function checkHorseReset() {
    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    let reset = false;
    
    for (let key in horseMarket) {
        if (!horseMarket[key].resetTime || (now - horseMarket[key].resetTime) > weekMs) {
            horseMarket[key].sold = 0;
            horseMarket[key].resetTime = now;
            reset = true;
        }
    }
    if (reset) saveHorseMarket();
}

// 6.4 СОХРАНЕНИЕ РЫНКА КОНЕЙ
export function saveHorseMarket() {
    localStorage.setItem('got_horse_market', JSON.stringify(horseMarket));
}

export function loadHorseMarket() {
    try {
        const raw = localStorage.getItem('got_horse_market');
        if (raw) {
            const parsed = JSON.parse(raw);
            for (let key in horseMarket) {
                if (parsed[key]) {
                    horseMarket[key].sold = parsed[key].sold || 0;
                    horseMarket[key].resetTime = parsed[key].resetTime || null;
                }
            }
        }
    } catch(e) {}
}

// ============================================================
// 7. ВЕЛИКАЯ СЕПТА
// ============================================================

// 7.1 БЕСПЛАТНОЕ ИСЦЕЛЕНИЕ
export function freeHeal(g) {
    const maxHp = getMaxHp(g);
    if (g.hp >= maxHp) {
        setMessage('✅ Вы уже здоровы!');
        return false;
    }
    
    const now = Date.now();
    if (g.lastHeal && (now - g.lastHeal) < TEMPLE_COOLDOWNS.heal) {
        const timeLeft = Math.ceil((TEMPLE_COOLDOWNS.heal - (now - g.lastHeal)) / (60 * 1000));
        setMessage('⏳ Исцеление доступно через ' + timeLeft + ' мин.');
        return false;
    }
    
    g.hp = maxHp;
    g.lastHeal = now;
    setMessage('💉 Вы полностью исцелились!');
    addLog('💉 ' + currentUser + ' бесплатно исцелился в Септе');
    return true;
}

// 7.2 МОЛИТВА (БЛАГОСЛОВЕНИЕ)
export function prayForBlessing(g) {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    if (g.lastPrayer && (now - g.lastPrayer) < dayMs) {
        const timeLeft = Math.ceil((dayMs - (now - g.lastPrayer)) / (60 * 60 * 1000));
        setMessage('⏳ Молитва доступна через ' + timeLeft + ' ч.');
        return false;
    }
    
    g.lastPrayer = now;
    if (!g.blessing) g.blessing = { active: true, expires: now + 60 * 60 * 1000 };
    g.blessing.active = true;
    g.blessing.expires = now + 60 * 60 * 1000;
    
    setMessage('🙏 Вы получили благословение! +10% к опыту на 1 час.');
    addLog('🙏 ' + currentUser + ' получил благословение (+10% опыта)');
    return true;
}

// 7.3 ПОКУПКА УДАЧИ
export function donateLuck(g) {
    if ((g.luck || 0) >= 25) {
        setMessage('🍀 Удача уже максимальная (25)!');
        return false;
    }
    
    if (!spendMoney(g, 1000 * 210 * 56)) {
        setMessage('❌ Недостаточно золота! Нужно: 1000 зол.');
        return false;
    }
    
    g.luck = Math.min(25, (g.luck || 0) + 5);
    setMessage('🍀 Вы купили удачу! +5 (всего: ' + g.luck + '/25)');
    addLog('🍀 ' + currentUser + ' купил удачу за 1000 зол.');
    return true;
}

// 7.4 ПОКУПКА ЗЕЛЬЯ
export function buyPotion(g, potionId, price, hp, fatigue) {
    if (!spendMoney(g, price)) {
        setMessage('❌ Недостаточно денег! Нужно: ' + formatCurrency(price));
        return false;
    }
    
    const potionNames = {
        'health_small': 'Малое зелье здоровья',
        'health_medium': 'Среднее зелье здоровья',
        'health_large': 'Большое зелье здоровья',
        'restore': 'Зелье восстановления',
        'stamina': 'Зелье выносливости'
    };
    
    const item = {
        name: potionNames[potionId] || potionId,
        quality: 'Обычное',
        type: 'food',
        effect: { hp: hp || 0, fatigue: fatigue || 0 },
        count: 1
    };
    
    addToInventory(g, item);
    setMessage('✅ Вы купили ' + item.name);
    addLog('🛒 ' + currentUser + ' купил ' + item.name + ' за ' + formatCurrency(price));
    convertCurrency(g);
    return true;
}

// ============================================================
// 8. БИБЛИОТЕКА МЕЙСТЕРОВ
// ============================================================

// 8.1 КОЛИЧЕСТВО ДОСТУПНЫХ КНИГ
export function getBooksAvailable(g) {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    if (now - g.lastBookReset >= dayMs) {
        g.booksBoughtToday = 0;
        g.lastBookReset = now;
        saveData();
    }
    
    return 3 - g.booksBoughtToday;
}

// 8.2 ПОКУПКА КНИГИ
export function buyBook(g, level, xp, price) {
    const available = getBooksAvailable(g);
    if (available <= 0) {
        setMessage('❌ Вы уже купили 3 книги сегодня. Приходите завтра.');
        return false;
    }
    
    if (!spendMoney(g, price)) {
        setMessage('❌ Недостаточно денег! Нужно: ' + formatCurrency(price));
        return false;
    }
    
    const book = {
        name: '📖 Искусство войны',
        level: level,
        xp: xp,
        isBook: true,
        type: 'book',
        count: 1
    };
    
    addToInventory(g, book);
    g.booksBoughtToday = (g.booksBoughtToday || 0) + 1;
    
    setMessage('✅ Вы купили книгу (ур.' + level + '). Осталось: ' + (available - 1));
    addLog('📖 ' + currentUser + ' купил книгу (ур.' + level + ')');
    return true;
}

// 8.3 ЧТЕНИЕ КНИГИ
export function readBook(g, index) {
    if (index >= g.inventory.length) { 
        setMessage('❌ Книга не найдена.'); 
        return false; 
    }
    
    const item = g.inventory[index];
    if (!item.isBook) {
        setMessage('❌ Это не книга.');
        return false;
    }
    
    const weapon = g.equipment.rightHand;
    let weaponType = null;
    if (weapon) {
        weaponType = weapon.type;
    }
    
    if (!weaponType) {
        setMessage('❌ Наденьте оружие для чтения книги.');
        return false;
    }
    
    const baseTime = 30;
    const intelligence = Math.min(30, g.stats.intelligence || 1);
    const readTimeMinutes = Math.max(5, baseTime - intelligence);
    const readTimeMs = readTimeMinutes * 60 * 1000;
    
    setMessage('⏳ Чтение книги займёт ' + readTimeMinutes + ' мин.');
    
    // Чтение книги (асинхронно)
    setTimeout(() => {
        const xpMultiplier = getXpMultiplier(g);
        const xpGain = Math.round(item.xp * xpMultiplier);
        
        // Общий опыт
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
        
        // Мастерство оружия
        if (g.skills[weaponType]) {
            g.skills[weaponType].xp = (g.skills[weaponType].xp || 0) + xpGain;
            const needed = g.skills[weaponType].level * 20 + 10;
            while (g.skills[weaponType].xp >= needed) {
                g.skills[weaponType].xp -= needed;
                g.skills[weaponType].level = Math.min(999, g.skills[weaponType].level + 1);
                setMessage('⚔️ Мастерство повышено до ' + g.skills[weaponType].level + '!');
            }
        }
        
        g.inventory.splice(index, 1);
        setMessage('📖 Вы прочитали книгу! +' + xpGain + ' XP');
        updateMenu();
        saveData();
    }, readTimeMs);
    
    return true;
}

// 8.4 ПРОДАЖА КНИГИ
export function sellBook(g, index) {
    if (index >= g.inventory.length) { 
        setMessage('❌ Книга не найдена.'); 
        return false; 
    }
    
    const item = g.inventory[index];
    if (!item.isBook) {
        setMessage('❌ Это не книга.');
        return false;
    }
    
    const price = Math.round(item.xp * 2);
    g.copper += price;
    convertCurrency(g);
    g.inventory.splice(index, 1);
    
    setMessage('💰 Вы продали книгу за ' + formatCurrency(price));
    addLog('💰 ' + currentUser + ' продал книгу за ' + formatCurrency(price));
    return true;
}

// ============================================================
// 9. ГИЛЬДИЯ НАЁМНИКОВ
// ============================================================

// 9.1 ГЕНЕРАЦИЯ ЗАДАНИЙ
export function generateDailyQuests() {
    const easy = [
        { id: 'easy_kill_rats', name: '🐀 Крысиная охота', desc: 'Убить 5 крыс', type: 'kill', target: 'Крыса', count: 5, rewardGold: 50, rewardXp: 20, difficulty: '🟢 Лёгкий' },
        { id: 'easy_gather_skins', name: '🧵 Сбор шкур', desc: 'Принести 10 шкур', type: 'gather', target: 'Шкура', count: 10, rewardGold: 40, rewardXp: 15, difficulty: '🟢 Лёгкий' },
        { id: 'easy_gather_wood', name: '🪵 Дрова для таверны', desc: 'Принести 15 дерева', type: 'gather', target: 'Дерево', count: 15, rewardGold: 35, rewardXp: 12, difficulty: '🟢 Лёгкий' },
        { id: 'easy_gather_meat', name: '🥩 Охотник', desc: 'Принести 5 мяса', type: 'gather', target: 'Мясо', count: 5, rewardGold: 45, rewardXp: 18, difficulty: '🟢 Лёгкий' },
        { id: 'easy_gather_water', name: '💧 Чистая вода', desc: 'Принести 10 воды', type: 'gather', target: 'Вода', count: 10, rewardGold: 25, rewardXp: 8, difficulty: '🟢 Лёгкий' }
    ];
    
    const medium = [
        { id: 'medium_kill_bandits', name: '🗡️ Очистка дорог', desc: 'Убить 5 бандитов', type: 'kill', target: 'Бандит', count: 5, rewardGold: 150, rewardXp: 50, difficulty: '🟡 Средний' },
        { id: 'medium_gather_ore', name: '⛏️ Поставка руды', desc: 'Принести 20 руды', type: 'gather', target: 'Руда железная', count: 20, rewardGold: 100, rewardXp: 40, difficulty: '🟡 Средний' },
        { id: 'medium_kill_wolves', name: '🐺 Волчий бич', desc: 'Убить 3 волков', type: 'kill', target: 'Волк', count: 3, rewardGold: 120, rewardXp: 45, difficulty: '🟡 Средний' },
        { id: 'medium_gather_coal', name: '🔥 Уголь для кузни', desc: 'Принести 15 угля', type: 'gather', target: 'Уголь', count: 15, rewardGold: 90, rewardXp: 35, difficulty: '🟡 Средний' }
    ];
    
    const hard = [
        { id: 'hard_kill_thugs', name: '⚔️ Уничтожение банды', desc: 'Убить 3 головорезов', type: 'kill', target: 'Головорез', count: 3, rewardGold: 300, rewardXp: 100, difficulty: '🔴 Сложный' },
        { id: 'hard_kill_bears', name: '🐻 Медвежья угроза', desc: 'Убить 2 медведей', type: 'kill', target: 'Медведь', count: 2, rewardGold: 350, rewardXp: 120, difficulty: '🔴 Сложный' }
    ];
    
    const shuffledEasy = easy.sort(() => Math.random() - 0.5).slice(0, 2);
    const shuffledMedium = medium.sort(() => Math.random() - 0.5).slice(0, 2);
    const shuffledHard = hard.sort(() => Math.random() - 0.5).slice(0, 2);
    
    return [...shuffledEasy, ...shuffledMedium, ...shuffledHard];
}

// 9.2 ВЗЯТЬ ЗАДАНИЕ
export function takeQuest(g, questId) {
    if (g.quests.active) {
        setMessage('❌ У вас уже есть активное задание!');
        return false;
    }
    
    g.quests.active = questId;
    if (!g.quests.progress) g.quests.progress = {};
    g.quests.progress[questId] = 0;
    
    setMessage('📋 Вы взяли задание!');
    addLog('📋 ' + currentUser + ' взял задание ' + questId);
    return true;
}

// 9.3 ОТКАЗ ОТ ЗАДАНИЯ
export function abandonQuest(g) {
    if (!g.quests.active) {
        setMessage('❌ У вас нет активного задания.');
        return false;
    }
    
    g.quests.active = null;
    setMessage('❌ Вы отказались от задания.');
    addLog('❌ ' + currentUser + ' отказался от задания');
    return true;
}

// 9.4 ПРОВЕРКА ПРОГРЕССА ЗАДАНИЯ
export function checkQuestProgress(g, type, target, count) {
    if (!g.quests || !g.quests.active) return;
    
    const quests = generateDailyQuests();
    const quest = quests.find(q => q.id === g.quests.active);
    if (!quest) return;
    if (quest.type !== type || quest.target !== target) return;
    if (g.quests.completed.includes(quest.id)) return;
    
    if (!g.quests.progress) g.quests.progress = {};
    g.quests.progress[quest.id] = (g.quests.progress[quest.id] || 0) + count;
    
    if (g.quests.progress[quest.id] >= quest.count) {
        g.quests.completed.push(quest.id);
        g.quests.active = null;
        
        const xpMultiplier = getXpMultiplier(g);
        const xpGain = Math.round(quest.rewardXp * xpMultiplier);
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
        
        setMessage('✅ Задание выполнено! +' + formatCurrency(quest.rewardGold) + ', +' + xpGain + ' XP');
        addLog('✅ ' + currentUser + ' выполнил задание ' + quest.name);
        saveData();
        updateMenu();
    }
}

// ============================================================
// 10. БОРДЕЛЬ
// ============================================================

// 10.1 УСЛУГИ БОРДЕЛЯ
export const BROTHEL_SERVICES = [
    { 
        id: 'rest', 
        name: '🛏️ Отдых с девушкой', 
        desc: '+50 усталости, +10 HP', 
        price: 20, 
        fatigue: 50, 
        hp: 10, 
        buff: null 
    },
    { 
        id: 'wine', 
        name: '🍷 Вино с компанией', 
        desc: '+30 усталости, +5 HP, бафф "Веселье" (+5% XP 30 мин)', 
        price: 50, 
        fatigue: 30, 
        hp: 5, 
        buff: { type: 'xp', value: 5, duration: 30 } 
    },
    { 
        id: 'dance', 
        name: '💃 Танец', 
        desc: '+20 усталости, бафф "Вдохновение" (+10% урон 15 мин)', 
        price: 100, 
        fatigue: 20, 
        hp: 0, 
        buff: { type: 'damage', value: 10, duration: 15 } 
    },
    { 
        id: 'vip', 
        name: '👑 VIP-комната', 
        desc: '+80 усталости, +20 HP, бафф "+15% XP 1 час"', 
        price: 200, 
        fatigue: 80, 
        hp: 20, 
        buff: { type: 'xp', value: 15, duration: 60 } 
    }
];

// 10.2 ИСПОЛЬЗОВАТЬ УСЛУГУ
export function useBrothelService(g, serviceId) {
    const service = BROTHEL_SERVICES.find(s => s.id === serviceId);
    if (!service) {
        setMessage('❌ Услуга не найдена.');
        return false;
    }
    
    if (!spendMoney(g, service.price)) {
        setMessage('❌ Недостаточно денег! Нужно: ' + formatCurrency(service.price));
        return false;
    }
    
    // Восстановление
    g.fatigue = Math.min(100, g.fatigue + service.fatigue);
    if (service.hp > 0) g.hp = Math.min(g.maxHp, g.hp + service.hp);
    
    // Бафф
    if (service.buff) {
        if (!g.brothelBuffs) g.brothelBuffs = [];
        
        const buffNames = {
            'xp': '🎯 Благословение опыта',
            'damage': '⚔️ Вдохновение'
        };
        
        g.brothelBuffs.push({
            name: buffNames[service.buff.type] || 'Бафф',
            desc: '+' + service.buff.value + '% ' + (service.buff.type === 'xp' ? 'опыта' : 'урона'),
            type: service.buff.type,
            value: service.buff.value,
            expires: Date.now() + service.buff.duration * 60 * 1000
        });
    }
    
    setMessage('✅ ' + service.name + '! +' + service.fatigue + ' усталости' + (service.hp > 0 ? ', +' + service.hp + ' HP' : ''));
    addLog('💃 ' + currentUser + ' посетил бордель (' + service.name + ')');
    updateMenu();
    saveData();
    return true;
}

// ============================================================
// 11. ИГРА В КОСТИ (PvP)
// ============================================================

// 11.1 ПОЛУЧИТЬ АКТИВНЫЕ ИГРЫ
export function getActiveDiceGames() {
    const now = Date.now();
    const timeout = 5 * 60 * 1000;
    const active = [];
    
    for (let id in diceGames) {
        const game = diceGames[id];
        if (now - game.createdAt > timeout && game.status === 'waiting') {
            const creator = users[game.creator];
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

// 11.2 СОЗДАТЬ ИГРУ
export function createDiceGame(g, bet) {
    for (let id in diceGames) {
        if (diceGames[id].creator === currentUser && diceGames[id].status === 'waiting') {
            setMessage('❌ У вас уже есть активная игра!');
            return false;
        }
    }
    
    if (!spendMoney(g, bet)) {
        setMessage('❌ Недостаточно денег для ставки!');
        return false;
    }
    
    const gameId = 'dice_' + (++diceGameIdCounter);
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
    return true;
}

// 11.3 ПРИСОЕДИНИТЬСЯ К ИГРЕ
export function joinDiceGame(g, gameId) {
    const game = diceGames[gameId];
    if (!game) {
        setMessage('❌ Игра не найдена.');
        return false;
    }
    
    if (game.creator === currentUser) {
        setMessage('❌ Вы не можете присоединиться к своей игре.');
        return false;
    }
    
    if (game.status !== 'waiting') {
        setMessage('❌ Игра уже началась или завершена.');
        return false;
    }
    
    if (!spendMoney(g, game.bet)) {
        setMessage('❌ Недостаточно денег для ставки!');
        return false;
    }
    
    game.player2 = currentUser;
    game.status = 'playing';
    
    saveData();
    setMessage('✅ Вы присоединились к игре! Бросайте кости.');
    addLog('🎲 ' + currentUser + ' присоединился к игре ' + gameId);
    updateMenu();
    return true;
}

// 11.4 БРОСОК КОСТЕЙ
export function rollDice(g, gameId) {
    const game = diceGames[gameId];
    if (!game) {
        setMessage('❌ Игра не найдена.');
        return false;
    }
    
    if (game.creator !== currentUser && game.player2 !== currentUser) {
        setMessage('❌ Вы не участник этой игры.');
        return false;
    }
    
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;
    
    if (game.creator === currentUser) {
        if (game.creatorRoll !== null) {
            setMessage('❌ Вы уже бросили кости! Ждите соперника.');
            return false;
        }
        game.creatorRoll = total;
        setMessage('🎲 Ваш бросок: ' + dice1 + ' + ' + dice2 + ' = ' + total + ' (ждём соперника)');
    } else if (game.player2 === currentUser) {
        if (game.player2Roll !== null) {
            setMessage('❌ Вы уже бросили кости! Ждите соперника.');
            return false;
        }
        game.player2Roll = total;
        setMessage('🎲 Ваш бросок: ' + dice1 + ' + ' + dice2 + ' = ' + total + ' (ждём соперника)');
    }
    
    saveData();
    updateMenu();
    
    if (game.creatorRoll !== null && game.player2Roll !== null) {
        finishDiceGame(gameId);
    }
    
    return true;
}

// 11.5 ЗАВЕРШЕНИЕ ИГРЫ
export function finishDiceGame(gameId) {
    const game = diceGames[gameId];
    if (!game) return;
    
    const creator = users[game.creator];
    const player2 = users[game.player2];
    const totalBet = game.bet * 2;
    
    let winner = null;
    let winnerName = '';
    
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
// 12. КОНФИСКАТ
// ============================================================

// 12.1 ЗАБРАТЬ ИЗ КОНФИСКАТА
export function returnFromConfiscate(g, entryIdx, itemIdx) {
    const entry = confiscatedItems[entryIdx];
    if (!entry || entry.owner !== currentUser) return false;
    
    const item = entry.items.splice(itemIdx, 1)[0];
    addToInventory(g, item);
    
    if (entry.items.length === 0) {
        confiscatedItems.splice(entryIdx, 1);
    }
    
    saveData();
    setMessage('✅ Вы забрали ' + item.name + ' из конфиската.');
    updateMenu();
    return true;
}

// 12.2 СОХРАНЕНИЕ КОНФИСКАТА
export function saveConfiscated() {
    localStorage.setItem('got_confiscated', JSON.stringify(confiscatedItems));
}

export function loadConfiscated() {
    try {
        const raw = localStorage.getItem('got_confiscated');
        if (raw) {
            confiscatedItems = JSON.parse(raw);
        }
    } catch(e) {
        confiscatedItems = [];
    }
}

// ============================================================
// 13. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ СТАТОВ
// ============================================================

// 13.1 МАКСИМАЛЬНЫЙ HP
export function getMaxHp(g) {
    const staminaLevel = g.stamina?.level || 1;
    let bonusHp = 0;
    if (g.housing && g.housing.type && HOUSING_TYPES[g.housing.type]) {
        bonusHp = HOUSING_TYPES[g.housing.type].restHp || 0;
    }
    return 60 + (g.level - 1) * 10 + staminaLevel * 2 + bonusHp;
}

// 13.2 МНОЖИТЕЛЬ ОПЫТА
export function getXpMultiplier(g) {
    let multiplier = 1 + (g.stats.intelligence / 100);
    
    if (g.brothelBuffs) {
        const now = Date.now();
        g.brothelBuffs = g.brothelBuffs.filter(b => b.expires > now);
        g.brothelBuffs.forEach(buff => {
            if (buff.type === 'xp') {
                multiplier += buff.value / 100;
            }
        });
    }
    
    if (g.blessing && g.blessing.active && g.blessing.expires > Date.now()) {
        multiplier *= 1.1;
    }
    
    return multiplier;
}

// 13.3 МАКСИМАЛЬНЫЙ ИНВЕНТАРЬ
export function getMaxInventory(g) {
    const baseLimit = 50;
    let bonusSlots = 0;
    if (g.equipment && g.equipment.horse) {
        const horse = HORSE_TYPES[g.equipment.horse.horseType];
        if (horse) bonusSlots = horse.inventorySlots || 0;
    }
    return baseLimit + bonusSlots;
}

// ============================================================
// 14. ПОЛНОСТЬЮ ГОТОВЫЙ МОДУЛЬ - ЭКСПОРТ ВСЕХ ФУНКЦИЙ
// ============================================================

export default {
    // Константы
    BUILDINGS,
    LOCATION_LEVELS,
    HOUSING_TYPES,
    housingMarket,
    MARKET_STALLS_TOTAL,
    marketStalls,
    BOOKS,
    TEMPLE_COOLDOWNS,
    HORSE_TYPES,
    horseMarket,
    confiscatedItems,
    diceGames,
    diceGameIdCounter,
    BROTHEL_SERVICES,
    
    // Вспомогательные
    convertCurrency,
    spendMoney,
    formatCurrency,
    parseCurrencyInput,
    getTimeLeft,
    addToInventory,
    isStackable,
    
    // Магистрат
    buyHouse,
    sellHouse,
    payRent,
    checkRent,
    evictFromHousing,
    saveHousingMarket,
    loadHousingMarket,
    
    // Торговые лавки
    initMarketStalls,
    loadMarketStalls,
    saveMarketStalls,
    addToStall,
    buyFromStall,
    checkStallRent,
    confiscateStall,
    
    // Склад
    openStorage,
    moveToStorage,
    takeFromStorage,
    
    // Конюшня
    buyHorse,
    sellHorse,
    checkHorseReset,
    saveHorseMarket,
    loadHorseMarket,
    
    // Септа
    freeHeal,
    prayForBlessing,
    donateLuck,
    buyPotion,
    
    // Библиотека
    getBooksAvailable,
    buyBook,
    readBook,
    sellBook,
    
    // Гильдия наёмников
    generateDailyQuests,
    takeQuest,
    abandonQuest,
    checkQuestProgress,
    
    // Бордель
    useBrothelService,
    
    // Кости
    getActiveDiceGames,
    createDiceGame,
    joinDiceGame,
    rollDice,
    finishDiceGame,
    
    // Конфискат
    returnFromConfiscate,
    saveConfiscated,
    loadConfiscated,
    
    // Статы
    getMaxHp,
    getXpMultiplier,
    getMaxInventory
};

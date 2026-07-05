// ============================================================
// js/regions/crownlands/locations/kings_landing.js
// КОРОЛЕВСКАЯ ГАВАНЬ - УНИКАЛЬНАЯ ЛОГИКА ГОРОДА
// ============================================================

// 1. ИМПОРТЫ из core
import { QUALITIES, BUILDINGS, LOCATION_LEVELS, HOUSING_TYPES } from '../../core/01-config.js';
import { users, currentUser, isBusy, gameLog } from '../../core/02-state.js';
import { formatCurrency, spendMoney, convertCurrency, addToInventory, getTimeLeft, isStackable } from '../../core/03-utils.js';
import { saveData, loadData } from '../../core/04-storage.js';

// 2. ИМПОРТЫ из game
import { getMaxHp, getXpMultiplier, getMaxInventory } from '../../game/character.js';
import { openShop, openCraftMenu } from '../../game/locations.js';
import { updateMenu, updateStory, updateActions } from '../../game/menu.js';

// ============================================================
// 3. КОНСТАНТЫ ГАВАНИ (уникальные для города)
// ============================================================

// 3.1 РЫНОК НЕДВИЖИМОСТИ
let housingMarket = {
    'night': { total: 400, occupied: 0 },
    'room': { total: 300, occupied: 0 },
    'house': { total: 250, occupied: 0 },
    'townhouse': { total: 80, occupied: 0 },
    'mansion': { total: 10, occupied: 0 }
};

// 3.2 ТОРГОВЫЕ ЛАВКИ
const MARKET_STALLS_TOTAL = 50;
let marketStalls = {};

// 3.3 РЫНОК КОНЕЙ
let horseMarket = {
    'work': { total: 50, sold: 0, resetTime: null },
    'riding': { total: 30, sold: 0, resetTime: null },
    'war': { total: 20, sold: 0, resetTime: null },
    'racer': { total: 15, sold: 0, resetTime: null },
    'heavy': { total: 10, sold: 0, resetTime: null },
    'royal': { total: 5, sold: 0, resetTime: null },
    'fire': { total: 1, sold: 0, resetTime: null }
};

// 3.4 КОНФИСКАТ
let confiscatedItems = [];

// 3.5 КНИГИ
const BOOKS = [
    { level: 1, xp: 50, price: 100 },
    { level: 5, xp: 100, price: 200 },
    { level: 10, xp: 150, price: 350 },
    { level: 15, xp: 200, price: 500 },
    { level: 20, xp: 300, price: 700 },
    { level: 25, xp: 400, price: 1000 }
];

// 3.6 БОРДЕЛЬ
const BROTHEL_SERVICES = [
    { id: 'rest', name: '🛏️ Отдых с девушкой', desc: '+50 усталости, +10 HP', price: 20, fatigue: 50, hp: 10, buff: null },
    { id: 'wine', name: '🍷 Вино с компанией', desc: '+30 усталости, +5 HP, бафф "Веселье" (+5% XP 30 мин)', price: 50, fatigue: 30, hp: 5, buff: { type: 'xp', value: 5, duration: 30 } },
    { id: 'dance', name: '💃 Танец', desc: '+20 усталости, бафф "Вдохновение" (+10% урон 15 мин)', price: 100, fatigue: 20, hp: 0, buff: { type: 'damage', value: 10, duration: 15 } },
    { id: 'vip', name: '👑 VIP-комната', desc: '+80 усталости, +20 HP, бафф "+15% XP 1 час"', price: 200, fatigue: 80, hp: 20, buff: { type: 'xp', value: 15, duration: 60 } }
];

// 3.7 ИГРЫ В КОСТИ (PvP)
let diceGames = {};
let diceGameIdCounter = 0;

// ============================================================
// 4. ИНИЦИАЛИЗАЦИЯ
// ============================================================

export function initKingsLanding() {
    loadHousingMarket();
    loadMarketStalls();
    loadHorseMarket();
    loadConfiscated();
    loadDiceGames();
    initMarketStalls();
    console.log('🏰 Королевская Гавань инициализирована');
}

// ============================================================
// 5. ДВИЖЕНИЕ ПО ГОРОДУ
// ============================================================

export function goToBuilding(buildingId) {
    const user = users[currentUser];
    if (!user) return { success: false, message: '❌ Игрок не найден.' };
    
    const g = user.game;
    
    if (isBusy) {
        return { success: false, message: '⏳ Вы заняты.' };
    }
    
    const exists = BUILDINGS.find(b => b.id === buildingId);
    if (!exists) {
        return { success: false, message: '❌ Здание не найдено.' };
    }
    
    // Перемещение
    g.location.place = buildingId;
    g.location.location = 'Королевская Гавань';
    
    // Особые случаи
    if (buildingId === 'Ворота') {
        g.outside = false;
    } else if (buildingId === 'Дорога') {
        g.outside = true;
    } else {
        g.outside = false;
    }
    
    // Обновление UI
    updateMenu();
    updateStory();
    updateActions();
    saveData();
    
    return { success: true, message: `✅ Вы прибыли в ${buildingId}.` };
}

// ============================================================
// 6. МАГИСТРАТ - НЕДВИЖИМОСТЬ
// ============================================================

export function buyHouse(type) {
    const user = users[currentUser];
    if (!user) return { success: false, message: '❌ Игрок не найден.' };
    
    const g = user.game;
    const house = HOUSING_TYPES[type];
    
    if (!house) return { success: false, message: '❌ Такого жилья нет.' };
    
    if (g.housing && g.housing.type) {
        return { success: false, message: '❌ У вас уже есть жильё!' };
    }
    
    const market = housingMarket[type];
    if (!market || market.occupied >= market.total) {
        return { success: false, message: `❌ Все ${house.name} уже проданы!` };
    }
    
    if (!spendMoney(g, house.price * 210 * 56)) {
        return { success: false, message: `❌ Недостаточно денег! Нужно: ${house.price} золота.` };
    }
    
    if (!g.housing) {
        g.housing = { type: null, purchased: null, rentPaid: null, rentDays: 0, debt: 0, storage: [], storageHold: [] };
    }
    
    g.housing.type = type;
    g.housing.purchased = Date.now();
    g.housing.rentPaid = Date.now();
    g.housing.rentDays = 1;
    g.housing.debt = 0;
    
    market.occupied++;
    saveHousingMarket();
    saveData();
    
    updateMenu();
    
    return { success: true, message: `✅ Вы купили ${house.name}! Осталось: ${market.total - market.occupied} свободных.` };
}

export function sellHouse() {
    const user = users[currentUser];
    if (!user) return { success: false, message: '❌ Игрок не найден.' };
    
    const g = user.game;
    
    if (!g.housing || !g.housing.type) {
        return { success: false, message: '❌ У вас нет жилья.' };
    }
    
    const house = HOUSING_TYPES[g.housing.type];
    const refund = Math.floor(house.price * 0.6);
    
    g.copper += refund;
    convertCurrency(g);
    
    // Перемещение вещей в камеру хранения
    if (g.housing.storage && g.housing.storage.length > 0) {
        if (!g.housing.storageHold) g.housing.storageHold = [];
        g.housing.storageHold = g.housing.storageHold.concat(g.housing.storage);
        g.housing.storage = [];
    }
    
    const market = housingMarket[g.housing.type];
    if (market) market.occupied = Math.max(0, market.occupied - 1);
    saveHousingMarket();
    
    g.housing.type = null;
    g.housing.debt = 0;
    g.housing.rentPaid = null;
    g.housing.rentDays = 0;
    
    saveData();
    updateMenu();
    
    return { success: true, message: `🏚️ Вы продали ${house.name} за ${refund} золота.` };
}

export function payRent() {
    const user = users[currentUser];
    if (!user) return { success: false, message: '❌ Игрок не найден.' };
    
    const g = user.game;
    
    if (!g.housing || !g.housing.type) {
        return { success: false, message: '❌ У вас нет жилья!' };
    }
    
    const house = HOUSING_TYPES[g.housing.type];
    const currentDays = g.housing.rentDays || 0;
    const totalDays = currentDays + 7;
    
    if (totalDays > 28) {
        return { success: false, message: '⏳ Вы уже оплатили аренду на 4 недели вперёд.' };
    }
    
    if (!spendMoney(g, house.rent * 210 * 56)) {
        return { success: false, message: `❌ Недостаточно денег! Нужно: ${house.rent} золота.` };
    }
    
    g.housing.rentDays = (g.housing.rentDays || 0) + 7;
    g.housing.rentPaid = Date.now();
    
    saveData();
    updateMenu();
    
    return { success: true, message: `✅ Вы оплатили аренду за ${house.name} на неделю!` };
}

export function checkRent() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    if (!g.housing || !g.housing.type) return;
    
    const timeLeft = getTimeLeft(g.housing.rentPaid, g.housing.rentDays || 1);
    
    if (timeLeft.expired) {
        evictFromHousing();
    }
}

function evictFromHousing() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
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
        saveConfiscated();
    }
    
    g.housing.type = null;
    g.housing.rentDays = 0;
    g.housing.rentPaid = null;
    g.housing.debt = 0;
    
    saveData();
    updateMenu();
}

// ============================================================
// 7. СКЛАД
// ============================================================

export function openStorage() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    if (!g.housing || !g.housing.type) {
        alert('❌ У вас нет жилья!');
        return;
    }
    
    const house = HOUSING_TYPES[g.housing.type];
    const storage = g.housing.storage || [];
    
    let msg = `📦 СКЛАД (${house.name})\n`;
    msg += `Свободно: ${(house.storageSlots || 10) - storage.length}/${house.storageSlots} слотов\n\n`;
    
    if (storage.length === 0) {
        msg += '📭 Склад пуст';
    } else {
        storage.forEach((item, i) => {
            const quality = item.quality || 'Обычное';
            let countDisplay = '';
            if (item.count && item.count > 1) countDisplay = ` ×${item.count}`;
            msg += `${i + 1}. ${item.name} (${quality})${countDisplay}\n`;
        });
    }
    
    const action = prompt(msg + '\n\nВыберите действие:\n1. Положить предмет\n2. Забрать предмет\n0. Выйти');
    
    if (action === '1') {
        moveToStorage();
    } else if (action === '2') {
        const idx = prompt('Введите номер предмета для забора:');
        const index = parseInt(idx) - 1;
        if (!isNaN(index) && index >= 0 && index < storage.length) {
            takeFromStorage(index);
        }
    }
}

function moveToStorage() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    if (!g.housing || !g.housing.type) {
        alert('❌ У вас нет жилья!');
        return;
    }
    
    const house = HOUSING_TYPES[g.housing.type];
    const storage = g.housing.storage || [];
    
    if (storage.length >= house.storageSlots) {
        alert('❌ Склад переполнен!');
        return;
    }
    
    if (g.inventory.length === 0) {
        alert('❌ Инвентарь пуст!');
        return;
    }
    
    let choices = 'Выберите предмет для склада:\n';
    g.inventory.forEach((item, i) => {
        let countDisplay = '';
        if (item.count && item.count > 1) countDisplay = ` ×${item.count}`;
        choices += `${i + 1}. ${item.name} (${item.quality || 'Обычное'})${countDisplay}\n`;
    });
    
    const choice = prompt(choices + '\nВведите номер предмета:');
    const index = parseInt(choice) - 1;
    if (isNaN(index) || index < 0 || index >= g.inventory.length) {
        alert('❌ Отменено.');
        return;
    }
    
    const item = g.inventory.splice(index, 1)[0];
    if (!g.housing.storage) g.housing.storage = [];
    g.housing.storage.push(item);
    
    alert(`✅ Вы положили ${item.name} на склад.`);
    saveData();
    updateMenu();
}

function takeFromStorage(index) {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    if (!g.housing || !g.housing.storage) {
        alert('❌ Склад пуст.');
        return;
    }
    
    if (index >= g.housing.storage.length) {
        alert('❌ Предмет не найден.');
        return;
    }
    
    const item = g.housing.storage.splice(index, 1)[0];
    addToInventory(g, item);
    
    alert(`✅ Вы забрали ${item.name} со склада.`);
    saveData();
    updateMenu();
}

// ============================================================
// 8. КОНЮШНЯ
// ============================================================

export function openStable() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    checkHorseReset();
    
    let msg = '🐴 КОНЮШНЯ КОРОЛЕВСКОЙ ГАВАНИ\n\n';
    
    // Текущая лошадь
    if (g.equipment && g.equipment.horse) {
        const horse = HORSE_TYPES[g.equipment.horse.horseType];
        if (horse) {
            msg += `ВАША ЛОШАДЬ:\n`;
            msg += `${horse.emoji} ${horse.name}\n`;
            msg += `❤️ HP: ${g.equipment.horse.hp}/${g.equipment.horse.maxHp}\n`;
            msg += `⚡ Скорость: +${horse.speedBonus}%\n`;
            msg += `🛡️ Защита: +${horse.defensePercent}%\n\n`;
        }
    } else {
        msg += `У вас нет лошади.\n\n`;
    }
    
    // Доступные лошади
    msg += 'ДОСТУПНЫЕ ЛОШАДИ (обновление раз в неделю):\n';
    for (let key in HORSE_TYPES) {
        const horse = HORSE_TYPES[key];
        const market = horseMarket[key];
        const available = market.total - market.sold;
        
        if (g.equipment && g.equipment.horse && g.equipment.horse.horseType === key) {
            msg += `✅ ${horse.emoji} ${horse.name} (ваша)\n`;
        } else if (available > 0) {
            msg += `${horse.emoji} ${horse.name} - ${formatCurrency(horse.price * 210 * 56)} (осталось: ${available}/${market.total})\n`;
        } else {
            msg += `❌ ${horse.emoji} ${horse.name} (распродано)\n`;
        }
    }
    
    const action = prompt(msg + '\n\nВведите тип лошади для покупки (work, riding, war, racer, heavy, royal, fire) или 0 для выхода:');
    
    if (action && action !== '0') {
        buyHorse(action);
    }
}

export function buyHorse(type) {
    const user = users[currentUser];
    if (!user) return { success: false, message: '❌ Игрок не найден.' };
    
    const g = user.game;
    const horse = HORSE_TYPES[type];
    
    if (!horse) return { success: false, message: '❌ Такой лошади нет.' };
    
    checkHorseReset();
    const market = horseMarket[type];
    
    if (market.sold >= market.total) {
        return { success: false, message: `❌ Все ${horse.name} на этой неделе уже проданы!` };
    }
    
    if (g.equipment && g.equipment.horse) {
        return { success: false, message: '❌ У вас уже есть лошадь! Продайте её.' };
    }
    
    if (!spendMoney(g, horse.price * 210 * 56)) {
        return { success: false, message: `❌ Недостаточно денег! Нужно: ${formatCurrency(horse.price * 210 * 56)}` };
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
    updateMenu();
    
    return { success: true, message: `✅ Вы купили ${horse.name}! Осталось: ${market.total - market.sold}` };
}

export function sellHorse() {
    const user = users[currentUser];
    if (!user) return { success: false, message: '❌ Игрок не найден.' };
    
    const g = user.game;
    
    if (!g.equipment || !g.equipment.horse) {
        return { success: false, message: '❌ У вас нет лошади.' };
    }
    
    const horseType = HORSE_TYPES[g.equipment.horse.horseType];
    if (!horseType) return { success: false, message: '❌ Лошадь не найдена.' };
    
    const refund = Math.floor(horseType.price * 0.5);
    g.copper += refund;
    convertCurrency(g);
    g.equipment.horse = null;
    
    saveData();
    updateMenu();
    
    return { success: true, message: `💰 Вы продали лошадь за ${formatCurrency(refund * 210 * 56)}` };
}

function checkHorseReset() {
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

// ============================================================
// 9. ВЕЛИКАЯ СЕПТА
// ============================================================

export function openTemple() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    const maxHp = getMaxHp(g);
    const lastHeal = g.lastHeal || 0;
    const canHeal = (Date.now() - lastHeal) >= 2 * 60 * 60 * 1000;
    
    let msg = '⛪ ВЕЛИКАЯ СЕПТА БЕЙЛОРА\n\n';
    msg += `💰 ${formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper)}\n\n`;
    msg += `❤️ HP: ${Math.round(g.hp)}/${maxHp}\n`;
    msg += `🍀 Удача: ${g.luck || 0}/25\n\n`;
    
    msg += 'ДОСТУПНЫЕ ДЕЙСТВИЯ:\n';
    msg += '1. 💉 Бесплатное исцеление (раз в 2 часа)\n';
    msg += '2. 🙏 Молитва (+10% опыта на 1 час, раз в день)\n';
    msg += '3. 🍀 Купить удачу (1000 зол. → +5 удачи)\n';
    msg += '4. 🧪 Купить зелье\n';
    msg += '0. Выйти';
    
    const action = prompt(msg);
    
    if (action === '1') {
        freeHeal();
    } else if (action === '2') {
        prayForBlessing();
    } else if (action === '3') {
        donateLuck();
    } else if (action === '4') {
        buyPotionMenu();
    }
}

function freeHeal() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    const maxHp = getMaxHp(g);
    
    if (g.hp >= maxHp) {
        alert('✅ Вы уже здоровы!');
        return;
    }
    
    const now = Date.now();
    const healCooldown = 2 * 60 * 60 * 1000;
    
    if (g.lastHeal && (now - g.lastHeal) < healCooldown) {
        const timeLeft = Math.ceil((healCooldown - (now - g.lastHeal)) / (60 * 1000));
        alert(`⏳ Исцеление доступно через ${timeLeft} мин.`);
        return;
    }
    
    g.hp = maxHp;
    g.lastHeal = now;
    
    alert('💉 Вы полностью исцелились!');
    saveData();
    updateMenu();
}

function prayForBlessing() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    if (g.lastPrayer && (now - g.lastPrayer) < dayMs) {
        const timeLeft = Math.ceil((dayMs - (now - g.lastPrayer)) / (60 * 60 * 1000));
        alert(`⏳ Молитва доступна через ${timeLeft} ч.`);
        return;
    }
    
    g.lastPrayer = now;
    if (!g.blessing) g.blessing = { active: true, expires: now + 60 * 60 * 1000 };
    g.blessing.active = true;
    g.blessing.expires = now + 60 * 60 * 1000;
    
    alert('🙏 Вы получили благословение! +10% к опыту на 1 час.');
    saveData();
    updateMenu();
}

function donateLuck() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    
    if ((g.luck || 0) >= 25) {
        alert('🍀 Удача уже максимальная (25)!');
        return;
    }
    
    if (!spendMoney(g, 1000 * 210 * 56)) {
        alert('❌ Недостаточно золота! Нужно: 1000 зол.');
        return;
    }
    
    g.luck = Math.min(25, (g.luck || 0) + 5);
    alert(`🍀 Вы купили удачу! +5 (всего: ${g.luck}/25)`);
    saveData();
    updateMenu();
}

function buyPotionMenu() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    
    const potions = [
        { id: 'health_small', name: '🧪 Малое зелье здоровья', price: 30, hp: 20, fatigue: 0 },
        { id: 'health_medium', name: '🧪 Среднее зелье здоровья', price: 80, hp: 50, fatigue: 0 },
        { id: 'health_large', name: '🧪 Большое зелье здоровья', price: 150, hp: 100, fatigue: 0 },
        { id: 'restore', name: '🧪 Зелье восстановления', price: 200, hp: 50, fatigue: 30 },
        { id: 'stamina', name: '🧪 Зелье выносливости', price: 100, hp: 10, fatigue: 20 }
    ];
    
    let msg = '🧪 ЗЕЛЬЯ\n\n';
    potions.forEach((p, i) => {
        msg += `${i + 1}. ${p.name} - ${formatCurrency(p.price)}`;
        msg += ` (❤️+${p.hp}`;
        if (p.fatigue > 0) msg += `, 😴+${p.fatigue}`;
        msg += ')\n';
    });
    msg += '\n0. Выйти';
    
    const choice = parseInt(prompt(msg));
    if (isNaN(choice) || choice < 1 || choice > potions.length) {
        alert('❌ Отменено.');
        return;
    }
    
    const potion = potions[choice - 1];
    buyPotion(potion.id, potion.price, potion.hp, potion.fatigue);
}

function buyPotion(potionId, price, hp, fatigue) {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    
    if (!spendMoney(g, price)) {
        alert(`❌ Недостаточно денег! Нужно: ${formatCurrency(price)}`);
        return;
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
    alert(`✅ Вы купили ${item.name}`);
    saveData();
    updateMenu();
}

// ============================================================
// 10. БИБЛИОТЕКА МЕЙСТЕРОВ
// ============================================================

export function openLibrary() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    const available = getBooksAvailable(g);
    
    let msg = '📚 БИБЛИОТЕКА МЕЙСТЕРОВ\n\n';
    msg += `💰 ${formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper)}\n`;
    msg += `📖 Осталось покупок сегодня: ${available}/3\n\n`;
    
    msg += 'ДОСТУПНЫЕ КНИГИ:\n';
    BOOKS.forEach((book, i) => {
        msg += `${i + 1}. Книга (ур.${book.level}) - ${formatCurrency(book.price)} (+${book.xp} XP)\n`;
    });
    msg += '\n0. Выйти';
    
    const choice = parseInt(prompt(msg));
    if (isNaN(choice) || choice < 1 || choice > BOOKS.length) {
        alert('❌ Отменено.');
        return;
    }
    
    const book = BOOKS[choice - 1];
    buyBook(book.level, book.xp, book.price);
}

function getBooksAvailable(g) {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    if (now - g.lastBookReset >= dayMs) {
        g.booksBoughtToday = 0;
        g.lastBookReset = now;
        saveData();
    }
    
    return 3 - g.booksBoughtToday;
}

function buyBook(level, xp, price) {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    const available = getBooksAvailable(g);
    
    if (available <= 0) {
        alert('❌ Вы уже купили 3 книги сегодня. Приходите завтра.');
        return;
    }
    
    if (!spendMoney(g, price)) {
        alert(`❌ Недостаточно денег! Нужно: ${formatCurrency(price)}`);
        return;
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
    
    alert(`✅ Вы купили книгу (ур.${level}). Осталось: ${available - 1}`);
    saveData();
    updateMenu();
}

export function readBook(index) {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    if (index >= g.inventory.length) {
        alert('❌ Книга не найдена.');
        return;
    }
    
    const item = g.inventory[index];
    if (!item.isBook) {
        alert('❌ Это не книга.');
        return;
    }
    
    const weapon = g.equipment.rightHand;
    let weaponType = null;
    if (weapon) {
        weaponType = weapon.type;
    }
    
    if (!weaponType) {
        alert('❌ Наденьте оружие для чтения книги.');
        return;
    }
    
    const baseTime = 30;
    const intelligence = Math.min(30, g.stats.intelligence || 1);
    const readTimeMinutes = Math.max(5, baseTime - intelligence);
    
    alert(`⏳ Чтение книги займёт ${readTimeMinutes} мин.`);
    
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
                alert(`🎉 Вы достигли ${g.level} уровня! +1 очко атрибутов.`);
            } else {
                alert(`🎉 Вы достигли ${g.level} уровня!`);
            }
        }
        
        // Мастерство оружия
        if (g.skills[weaponType]) {
            g.skills[weaponType].xp = (g.skills[weaponType].xp || 0) + xpGain;
            const needed = g.skills[weaponType].level * 20 + 10;
            while (g.skills[weaponType].xp >= needed) {
                g.skills[weaponType].xp -= needed;
                g.skills[weaponType].level = Math.min(999, g.skills[weaponType].level + 1);
                alert(`⚔️ Мастерство повышено до ${g.skills[weaponType].level}!`);
            }
        }
        
        g.inventory.splice(index, 1);
        alert(`📖 Вы прочитали книгу! +${xpGain} XP`);
        saveData();
        updateMenu();
    }, readTimeMinutes * 60 * 1000);
}

// ============================================================
// 11. ГИЛЬДИЯ НАЁМНИКОВ
// ============================================================

export function openGuildHall() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    
    if (!g.quests) {
        g.quests = { completed: [], lastReset: 0, active: null, progress: {} };
    }
    
    const now = Date.now();
    const resetInterval = 5 * 60 * 60 * 1000;
    
    if (!g.quests.lastReset || (now - g.quests.lastReset) >= resetInterval) {
        g.quests.completed = [];
        g.quests.lastReset = now;
        g.quests.active = null;
        g.quests.progress = {};
        saveData();
    }
    
    const quests = generateDailyQuests();
    const nextReset = g.quests.lastReset + resetInterval;
    const timeLeft = nextReset - now;
    const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    
    let msg = '🗡️ ГИЛЬДИЯ НАЁМНИКОВ\n\n';
    msg += `⏳ Следующее обновление через: ${hoursLeft}ч ${minutesLeft}м\n\n`;
    
    if (g.quests.active) {
        const activeQuest = quests.find(q => q.id === g.quests.active);
        if (activeQuest) {
            const progress = g.quests.progress[activeQuest.id] || 0;
            msg += `📌 АКТИВНОЕ ЗАДАНИЕ:\n`;
            msg += `${activeQuest.name}\n`;
            msg += `${activeQuest.desc}\n`;
            msg += `📊 Прогресс: ${progress}/${activeQuest.count}\n`;
            msg += `💰 ${formatCurrency(activeQuest.rewardGold)} | ⭐ ${activeQuest.rewardXp} XP\n\n`;
        }
    }
    
    msg += 'ДОСТУПНЫЕ ЗАДАНИЯ:\n';
    quests.forEach((quest, i) => {
        const isCompleted = g.quests.completed.includes(quest.id);
        const isActive = g.quests.active === quest.id;
        const status = isCompleted ? '✅' : (isActive ? '⏳' : `${i + 1}`);
        msg += `${status} ${quest.name} (${quest.difficulty})\n`;
    });
    msg += '\nВведите номер задания для взятия, или 0 для выхода:';
    
    const choice = parseInt(prompt(msg));
    if (isNaN(choice) || choice < 1 || choice > quests.length) {
        alert('❌ Отменено.');
        return;
    }
    
    const quest = quests[choice - 1];
    if (g.quests.completed.includes(quest.id)) {
        alert('❌ Это задание уже выполнено.');
        return;
    }
    if (g.quests.active) {
        alert('❌ У вас уже есть активное задание!');
        return;
    }
    
    takeQuest(quest.id);
}

function generateDailyQuests() {
    const easy = [
        { id: 'easy_kill_rats', name: '🐀 Крысиная охота', desc: 'Убить 5 крыс', type: 'kill', target: 'Крыса', count: 5, rewardGold: 50, rewardXp: 20, difficulty: '🟢 Лёгкий' },
        { id: 'easy_gather_skins', name: '🧵 Сбор шкур', desc: 'Принести 10 шкур', type: 'gather', target: 'Шкура', count: 10, rewardGold: 40, rewardXp: 15, difficulty: '🟢 Лёгкий' },
        { id: 'easy_gather_wood', name: '🪵 Дрова для таверны', desc: 'Принести 15 дерева', type: 'gather', target: 'Дерево', count: 15, rewardGold: 35, rewardXp: 12, difficulty: '🟢 Лёгкий' }
    ];
    
    const medium = [
        { id: 'medium_kill_bandits', name: '🗡️ Очистка дорог', desc: 'Убить 5 бандитов', type: 'kill', target: 'Бандит', count: 5, rewardGold: 150, rewardXp: 50, difficulty: '🟡 Средний' },
        { id: 'medium_gather_ore', name: '⛏️ Поставка руды', desc: 'Принести 20 руды', type: 'gather', target: 'Руда железная', count: 20, rewardGold: 100, rewardXp: 40, difficulty: '🟡 Средний' }
    ];
    
    const hard = [
        { id: 'hard_kill_thugs', name: '⚔️ Уничтожение банды', desc: 'Убить 3 головорезов', type: 'kill', target: 'Головорез', count: 3, rewardGold: 300, rewardXp: 100, difficulty: '🔴 Сложный' }
    ];
    
    const shuffledEasy = easy.sort(() => Math.random() - 0.5).slice(0, 1);
    const shuffledMedium = medium.sort(() => Math.random() - 0.5).slice(0, 1);
    const shuffledHard = hard.sort(() => Math.random() - 0.5).slice(0, 1);
    
    return [...shuffledEasy, ...shuffledMedium, ...shuffledHard];
}

function takeQuest(questId) {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    g.quests.active = questId;
    if (!g.quests.progress) g.quests.progress = {};
    g.quests.progress[questId] = 0;
    
    alert('📋 Вы взяли задание!');
    saveData();
}

export function abandonQuest() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    if (!g.quests.active) {
        alert('❌ У вас нет активного задания.');
        return;
    }
    
    g.quests.active = null;
    alert('❌ Вы отказались от задания.');
    saveData();
}

export function checkQuestProgress(type, target, count) {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
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
                alert(`🎉 Вы достигли ${g.level} уровня! +1 очко атрибутов.`);
            } else {
                alert(`🎉 Вы достигли ${g.level} уровня!`);
            }
        }
        
        alert(`✅ Задание выполнено! +${formatCurrency(quest.rewardGold)}, +${xpGain} XP`);
        saveData();
        updateMenu();
    }
}

// ============================================================
// 12. БОРДЕЛЬ
// ============================================================

export function openBrothel() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    
    let msg = '💃 БОРДЕЛЬ КОРОЛЕВСКОЙ ГАВАНИ\n\n';
    msg += `💰 ${formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper)}\n`;
    msg += `😴 Усталость: ${g.fatigue}/100\n\n`;
    
    msg += 'УСЛУГИ:\n';
    BROTHEL_SERVICES.forEach((service, i) => {
        msg += `${i + 1}. ${service.name} - ${formatCurrency(service.price)}\n`;
        msg += `   ${service.desc}\n`;
    });
    msg += '\n0. Выйти';
    
    const choice = parseInt(prompt(msg));
    if (isNaN(choice) || choice < 1 || choice > BROTHEL_SERVICES.length) {
        alert('❌ Отменено.');
        return;
    }
    
    const service = BROTHEL_SERVICES[choice - 1];
    useBrothelService(service.id);
}

function useBrothelService(serviceId) {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    const service = BROTHEL_SERVICES.find(s => s.id === serviceId);
    if (!service) {
        alert('❌ Услуга не найдена.');
        return;
    }
    
    if (!spendMoney(g, service.price)) {
        alert(`❌ Недостаточно денег! Нужно: ${formatCurrency(service.price)}`);
        return;
    }
    
    // Восстановление
    g.fatigue = Math.min(100, g.fatigue + service.fatigue);
    if (service.hp > 0) g.hp = Math.min(getMaxHp(g), g.hp + service.hp);
    
    // Бафф
    if (service.buff) {
        if (!g.brothelBuffs) g.brothelBuffs = [];
        
        const buffNames = {
            'xp': '🎯 Благословение опыта',
            'damage': '⚔️ Вдохновение'
        };
        
        g.brothelBuffs.push({
            name: buffNames[service.buff.type] || 'Бафф',
            desc: `+${service.buff.value}% ${service.buff.type === 'xp' ? 'опыта' : 'урона'}`,
            type: service.buff.type,
            value: service.buff.value,
            expires: Date.now() + service.buff.duration * 60 * 1000
        });
    }
    
    alert(`✅ ${service.name}! +${service.fatigue} усталости${service.hp > 0 ? `, +${service.hp} HP` : ''}`);
    saveData();
    updateMenu();
}

// ============================================================
// 13. ТОРГОВЫЕ ЛАВКИ (РЫНОК)
// ============================================================

export function openMarket() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    let msg = '🏪 РЫНОК КОРОЛЕВСКОЙ ГАВАНИ\n\n';
    
    // Проверка лавки игрока
    if (g.marketStall && g.marketStall.owned) {
        const stall = marketStalls[g.marketStall.stallId];
        const timeLeft = getTimeLeft(stall.rentPaid, stall.rentDays || 1);
        msg += `🏪 Ваша лавка #${g.marketStall.stallId}\n`;
        msg += timeLeft.expired ? '⛔ Аренда истекла!\n' : `✅ Активна (${timeLeft.text})\n`;
        msg += `📦 ${stall.inventory ? stall.inventory.length : 0} товаров\n\n`;
    } else {
        msg += 'У вас нет лавки.\n';
        msg += '💡 Купите лавку в Магистрате (80 зол.)\n\n';
    }
    
    // Список лавок
    msg += 'АКТИВНЫЕ ЛАВКИ:\n';
    let hasStalls = false;
    for (let i = 1; i <= MARKET_STALLS_TOTAL; i++) {
        const stall = marketStalls[i];
        if (stall && stall.owner) {
            const timeLeft = getTimeLeft(stall.rentPaid, stall.rentDays || 1);
            if (!timeLeft.expired) {
                hasStalls = true;
                msg += `#${i} - ${stall.owner} (${stall.inventory ? stall.inventory.length : 0} товаров)\n`;
            }
        }
    }
    if (!hasStalls) msg += 'Нет активных лавок\n';
    
    msg += '\nВведите номер лавки для входа, или 0 для выхода:';
    const choice = parseInt(prompt(msg));
    if (isNaN(choice) || choice < 1 || choice > MARKET_STALLS_TOTAL) {
        alert('❌ Отменено.');
        return;
    }
    
    enterStall(choice);
}

function enterStall(stallId) {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    const stall = marketStalls[stallId];
    
    if (!stall) {
        alert('❌ Лавка не найдена.');
        return;
    }
    
    const isOwner = stall.owner === currentUser;
    const timeLeft = getTimeLeft(stall.rentPaid, stall.rentDays || 1);
    const isActive = !timeLeft.expired;
    
    let msg = `🏪 ЛАВКА #${stallId}\n`;
    msg += `👤 Владелец: ${stall.owner || 'Свободна'}\n`;
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
        stall.inventory.forEach((item, i) => {
            const price = stall.prices && stall.prices[i] ? stall.prices[i] : 0;
            const quality = item.quality || 'Обычное';
            let countDisplay = '';
            if (item.count && item.count > 1) countDisplay = ` ×${item.count}`;
            msg += `${i + 1}. ${item.name} (${quality})${countDisplay} - ${formatCurrency(price)}\n`;
        });
    }
    
    if (!isOwner && isActive && stall.inventory && stall.inventory.length > 0) {
        msg += '\nВведите номер товара для покупки, или 0 для выхода:';
        const choice = parseInt(prompt(msg));
        if (!isNaN(choice) && choice >= 1 && choice <= stall.inventory.length) {
            buyFromStall(stallId, choice - 1);
        }
    } else if (isOwner && isActive) {
        const choice = parseInt(prompt(msg + '\nВведите действие:'));
        if (choice === 1) {
            addToStall(stallId);
        } else if (choice === 2) {
            const idx = parseInt(prompt('Введите номер товара для удаления:'));
            if (!isNaN(idx) && idx >= 1 && idx <= stall.inventory.length) {
                removeFromStall(stallId, idx - 1);
            }
        } else if (choice === 3) {
            payStallRent();
        }
    } else {
        alert(msg);
    }
}

function addToStall(stallId) {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    const stall = marketStalls[stallId];
    
    if (!stall || stall.owner !== currentUser) {
        alert('❌ Это не ваша лавка.');
        return;
    }
    
    if (g.inventory.length === 0) {
        alert('❌ Инвентарь пуст.');
        return;
    }
    
    let choices = 'Выберите предмет для лавки:\n';
    g.inventory.forEach((item, i) => {
        let countDisplay = '';
        if (item.count && item.count > 1) countDisplay = ` ×${item.count}`;
        choices += `${i + 1}. ${item.name} (${item.quality || 'Обычное'})${countDisplay}\n`;
    });
    choices += '0. Отмена';
    
    const choice = parseInt(prompt(choices));
    if (isNaN(choice) || choice < 1 || choice > g.inventory.length) {
        alert('❌ Отменено.');
        return;
    }
    
    const item = g.inventory.splice(choice - 1, 1)[0];
    
    const priceInput = prompt('Введите цену (в меди, например: 100, 5 ЗОЛ, 1 ЗОЛ 50 МП):');
    const price = parseCurrencyInput(priceInput);
    
    if (price === null || price < 1) {
        alert('❌ Цена должна быть не менее 1 МП.');
        addToInventory(g, item);
        return;
    }
    
    if (!stall.inventory) stall.inventory = [];
    if (!stall.prices) stall.prices = {};
    const newIdx = stall.inventory.length;
    stall.inventory.push(item);
    stall.prices[newIdx] = price;
    
    saveMarketStalls();
    alert(`✅ Вы добавили ${item.name} в лавку за ${formatCurrency(price)}`);
    saveData();
    updateMenu();
}

function buyFromStall(stallId, idx) {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    const stall = marketStalls[stallId];
    
    if (!stall || !stall.inventory || idx >= stall.inventory.length) {
        alert('❌ Товар не найден.');
        return;
    }
    
    const item = stall.inventory[idx];
    const price = stall.prices && stall.prices[idx] ? stall.prices[idx] : 0;
    
    if (price <= 0) {
        alert('❌ Цена не указана.');
        return;
    }
    
    if (!spendMoney(g, price)) {
        alert(`❌ Недостаточно денег! Нужно: ${formatCurrency(price)}`);
        return;
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
    
    alert(`✅ Вы купили ${item.name} за ${formatCurrency(price)}`);
    saveData();
    updateMenu();
}

function removeFromStall(stallId, idx) {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    const stall = marketStalls[stallId];
    
    if (!stall || stall.owner !== currentUser) {
        alert('❌ Это не ваша лавка.');
        return;
    }
    
    if (!stall.inventory || idx >= stall.inventory.length) {
        alert('❌ Товар не найден.');
        return;
    }
    
    const item = stall.inventory.splice(idx, 1)[0];
    if (stall.prices) delete stall.prices[idx];
    addToInventory(g, item);
    saveMarketStalls();
    
    alert(`✅ Вы убрали ${item.name} из лавки.`);
    saveData();
    updateMenu();
}

function payStallRent() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    if (!g.marketStall || !g.marketStall.owned) {
        alert('❌ У вас нет лавки!');
        return;
    }
    
    const stall = marketStalls[g.marketStall.stallId];
    if (!stall || stall.owner !== currentUser) {
        alert('❌ Это не ваша лавка.');
        return;
    }
    
    const rentCost = 10;
    const currentDays = stall.rentDays || 0;
    const totalDays = currentDays + 7;
    
    if (totalDays > 28) {
        alert('⏳ Вы уже оплатили аренду на 4 недели вперёд.');
        return;
    }
    
    if (!spendMoney(g, rentCost * 210 * 56)) {
        alert(`❌ Недостаточно денег! Нужно: ${rentCost} золота.`);
        return;
    }
    
    stall.rentDays = (stall.rentDays || 0) + 7;
    stall.rentPaid = Date.now();
    g.marketStall.rentDays = stall.rentDays;
    g.marketStall.rentPaid = Date.now();
    
    saveMarketStalls();
    alert('✅ Вы оплатили аренду лавки на неделю!');
    saveData();
    updateMenu();
}

function checkStallRent() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    if (!g.marketStall || !g.marketStall.owned) return;
    
    const stall = marketStalls[g.marketStall.stallId];
    if (!stall) return;
    
    const timeLeft = getTimeLeft(stall.rentPaid, stall.rentDays || 1);
    if (timeLeft.expired) {
        confiscateStall();
    }
}

function confiscateStall() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
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
        saveConfiscated();
        alert(`📦 Товары из лавки #${stallId} перемещены в конфискат.`);
    }
    
    stall.owner = null;
    stall.rentPaid = null;
    stall.rentDays = 0;
    stall.inventory = [];
    stall.prices = {};
    
    g.marketStall = { owned: false, stallId: null, rentPaid: null, rentDays: 0, debt: 0 };
    
    saveMarketStalls();
    alert(`🚪 Лавка #${stallId} конфискована за неуплату!`);
    saveData();
    updateMenu();
}

// ============================================================
// 14. КОНФИСКАТ
// ============================================================

export function openConfiscated() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    const userItems = confiscatedItems.filter(item => item.owner === currentUser);
    
    if (userItems.length === 0) {
        alert('📦 У вас нет вещей в конфискате.');
        return;
    }
    
    let msg = '📦 КОНФИСКАТ\n\n';
    userItems.forEach((entry, ei) => {
        msg += `📅 ${new Date(entry.confiscatedAt).toLocaleString()}\n`;
        entry.items.forEach((item, ii) => {
            const quality = item.quality || 'Обычное';
            let countDisplay = '';
            if (item.count && item.count > 1) countDisplay = ` ×${item.count}`;
            msg += `  ${ii + 1}. ${item.name} (${quality})${countDisplay}\n`;
        });
        msg += '\n';
    });
    msg += 'Введите номер предмета для забора, или 0 для выхода:';
    
    const choice = parseInt(prompt(msg));
    if (isNaN(choice) || choice < 1) {
        alert('❌ Отменено.');
        return;
    }
    
    let totalItems = 0;
    let foundEntry = null;
    let foundIdx = -1;
    
    for (let ei = 0; ei < userItems.length; ei++) {
        const entry = userItems[ei];
        for (let ii = 0; ii < entry.items.length; ii++) {
            totalItems++;
            if (totalItems === choice) {
                foundEntry = entry;
                foundIdx = ii;
                break;
            }
        }
        if (foundEntry) break;
    }
    
    if (!foundEntry) {
        alert('❌ Предмет не найден.');
        return;
    }
    
    const realEntryIdx = confiscatedItems.indexOf(foundEntry);
    if (realEntryIdx === -1) {
        alert('❌ Ошибка: предмет не найден.');
        return;
    }
    
    const item = foundEntry.items.splice(foundIdx, 1)[0];
    addToInventory(g, item);
    
    if (foundEntry.items.length === 0) {
        confiscatedItems.splice(realEntryIdx, 1);
    }
    
    saveConfiscated();
    saveData();
    alert(`✅ Вы забрали ${item.name} из конфиската.`);
    updateMenu();
}

// ============================================================
// 15. ИГРА В КОСТИ (PvP)
// ============================================================

export function playDice() {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    const activeGames = getActiveDiceGames();
    
    let msg = '🎲 ИГРА В КОСТИ (PvP)\n\n';
    
    if (activeGames.length > 0) {
        msg += 'АКТИВНЫЕ ИГРЫ:\n';
        activeGames.forEach(game => {
            if (game.creator !== currentUser) {
                const timeLeft = Math.ceil((game.createdAt + 5 * 60 * 1000 - Date.now()) / 60000);
                msg += `🎲 ${game.creator} (ставка: ${formatCurrency(game.bet)}) - ⏳ ${timeLeft} мин\n`;
            }
        });
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
    
    const choice = parseInt(prompt(msg));
    
    if (choice >= 1 && choice <= 5) {
        const bets = [10, 25, 50, 100, 200];
        createDiceGame(bets[choice - 1]);
    } else if (choice === 6) {
        const gameId = prompt('Введите ID игры:');
        if (gameId) joinDiceGame(gameId);
    }
}

function getActiveDiceGames() {
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

function createDiceGame(bet) {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    
    for (let id in diceGames) {
        if (diceGames[id].creator === currentUser && diceGames[id].status === 'waiting') {
            alert('❌ У вас уже есть активная игра!');
            return;
        }
    }
    
    if (!spendMoney(g, bet)) {
        alert('❌ Недостаточно денег для ставки!');
        return;
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
    
    saveDiceGames();
    saveData();
    alert(`✅ Вы создали игру в кости на ${formatCurrency(bet)}! ID: ${gameId}`);
}

function joinDiceGame(gameId) {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    const game = diceGames[gameId];
    
    if (!game) {
        alert('❌ Игра не найдена.');
        return;
    }
    
    if (game.creator === currentUser) {
        alert('❌ Вы не можете присоединиться к своей игре.');
        return;
    }
    
    if (game.status !== 'waiting') {
        alert('❌ Игра уже началась или завершена.');
        return;
    }
    
    if (!spendMoney(g, game.bet)) {
        alert('❌ Недостаточно денег для ставки!');
        return;
    }
    
    game.player2 = currentUser;
    game.status = 'playing';
    
    saveDiceGames();
    saveData();
    alert('✅ Вы присоединились к игре! Бросайте кости.');
    
    rollDice(gameId);
}

function rollDice(gameId) {
    const user = users[currentUser];
    if (!user) return;
    
    const g = user.game;
    const game = diceGames[gameId];
    
    if (!game) {
        alert('❌ Игра не найдена.');
        return;
    }
    
    if (game.creator !== currentUser && game.player2 !== currentUser) {
        alert('❌ Вы не участник этой игры.');
        return;
    }
    
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;
    
    if (game.creator === currentUser) {
        if (game.creatorRoll !== null) {
            alert('❌ Вы уже бросили кости! Ждите соперника.');
            return;
        }
        game.creatorRoll = total;
        alert(`🎲 Ваш бросок: ${dice1} + ${dice2} = ${total} (ждём соперника)`);
    } else if (game.player2 === currentUser) {
        if (game.player2Roll !== null) {
            alert('❌ Вы уже бросили кости! Ждите соперника.');
            return;
        }
        game.player2Roll = total;
        alert(`🎲 Ваш бросок: ${dice1} + ${dice2} = ${total} (ждём соперника)`);
    }
    
    saveDiceGames();
    saveData();
    
    if (game.creatorRoll !== null && game.player2Roll !== null) {
        finishDiceGame(gameId);
    }
}

function finishDiceGame(gameId) {
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
    } else if (game.player2Roll > game.creatorRoll) {
        winner = player2;
        winnerName = game.player2;
    } else {
        creator.game.copper += game.bet;
        player2.game.copper += game.bet;
        convertCurrency(creator.game);
        convertCurrency(player2.game);
        alert(`🤝 Ничья! (${game.creatorRoll} vs ${game.player2Roll}) Ставки возвращены.`);
        game.status = 'finished';
        delete diceGames[gameId];
        saveDiceGames();
        saveData();
        return;
    }
    
    if (winner) {
        winner.game.copper += totalBet;
        convertCurrency(winner.game);
        alert(`🏆 ${winnerName} выиграл ${formatCurrency(totalBet)}!`);
    }
    
    game.status = 'finished';
    delete diceGames[gameId];
    saveDiceGames();
    saveData();
}

// ============================================================
// 16. СОХРАНЕНИЕ (локальное для гавани)
// ============================================================

function loadHousingMarket() {
    try {
        const raw = localStorage.getItem('kl_housing_market');
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

function saveHousingMarket() {
    localStorage.setItem('kl_housing_market', JSON.stringify(housingMarket));
}

function loadMarketStalls() {
    try {
        const raw = localStorage.getItem('kl_market_stalls');
        if (raw) {
            marketStalls = JSON.parse(raw);
        }
    } catch(e) {}
    initMarketStalls();
}

function saveMarketStalls() {
    localStorage.setItem('kl_market_stalls', JSON.stringify(marketStalls));
}

function initMarketStalls() {
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

function loadHorseMarket() {
    try {
        const raw = localStorage.getItem('kl_horse_market');
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

function saveHorseMarket() {
    localStorage.setItem('kl_horse_market', JSON.stringify(horseMarket));
}

function loadConfiscated() {
    try {
        const raw = localStorage.getItem('kl_confiscated');
        if (raw) {
            confiscatedItems = JSON.parse(raw);
        }
    } catch(e) {
        confiscatedItems = [];
    }
}

function saveConfiscated() {
    localStorage.setItem('kl_confiscated', JSON.stringify(confiscatedItems));
}

function loadDiceGames() {
    try {
        const raw = localStorage.getItem('kl_dice_games');
        if (raw) {
            diceGames = JSON.parse(raw);
        }
    } catch(e) {
        diceGames = {};
    }
}

function saveDiceGames() {
    localStorage.setItem('kl_dice_games', JSON.stringify(diceGames));
}

// ============================================================
// 17. ЭКСПОРТ ВСЕХ ФУНКЦИЙ
// ============================================================

export default {
    // Инициализация
    initKingsLanding,
    
    // Движение
    goToBuilding,
    
    // Магистрат (недвижимость)
    buyHouse,
    sellHouse,
    payRent,
    checkRent,
    
    // Склад
    openStorage,
    
    // Конюшня
    openStable,
    buyHorse,
    sellHorse,
    
    // Септа
    openTemple,
    
    // Библиотека
    openLibrary,
    readBook,
    
    // Гильдия наёмников
    openGuildHall,
    abandonQuest,
    checkQuestProgress,
    
    // Бордель
    openBrothel,
    
    // Рынок (лавки)
    openMarket,
    
    // Конфискат
    openConfiscated,
    
    // Кости
    playDice,
    
    // Константы (для использования в других файлах)
    BUILDINGS,
    HOUSING_TYPES,
    HORSE_TYPES,
    BOOKS,
    BROTHEL_SERVICES
};

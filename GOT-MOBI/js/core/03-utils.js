// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (ПОЛНАЯ ВЕРСИЯ)
// ============================================================

function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) - h) + str.charCodeAt(i);
        h = h & h;
    }
    return h.toString(36);
}

function showPage(page) {
    ['login', 'register', 'game'].forEach(function(id) {
        document.getElementById('page-' + id).classList.add('hide');
    });
    document.getElementById('page-' + page).classList.remove('hide');
}

function setMessage(msg) {
    const el = document.getElementById('game-message');
    el.textContent = msg || '';
    clearTimeout(el._timer);
    if (msg && msg.length > 0) {
        el._timer = setTimeout(function() { el.textContent = ''; }, 8000);
    }
}

function getTimeOfDay() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const t = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
    let p = '', e = '';
    if (h >= 6 && h < 12) { p = 'Утро'; e = '☀️'; }
    else if (h >= 12 && h < 18) { p = 'День'; e = '🌤️'; }
    else if (h >= 18 && h < 24) { p = 'Вечер'; e = '🌆'; }
    else { p = 'Ночь'; e = '🌙'; }
    return { timeStr: t, period: p, emoji: e };
}

function convertCurrency(g) {
    while (g.copper >= 56) { g.silver += Math.floor(g.copper / 56); g.copper = g.copper % 56; }
    while (g.silver >= 210) { g.gold += Math.floor(g.silver / 210); g.silver = g.silver % 210; }
    return g;
}

function spendMoney(g, amount) {
    if (amount <= 0) return true;
    let total = g.copper + g.silver * 56 + g.gold * 210 * 56;
    if (total < amount) return false;
    total -= amount;
    g.gold = Math.floor(total / (210 * 56));
    total %= (210 * 56);
    g.silver = Math.floor(total / 56);
    g.copper = total % 56;
    return true;
}

function formatCurrency(amount) {
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

function getResourcePrice(resourceType, quality) {
    const basePrices = { leather:5, iron:8, wood:3, steel:20, coal:4 };
    const base = basePrices[resourceType] || 5;
    const q = QUALITIES[quality] || QUALITIES['Обычное'];
    return Math.round(base * q.multiplier);
}

function addLog(msg) {
    const now = new Date();
    const time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    gameLog.push('[' + time + '] ' + msg);
    if (gameLog.length > 100) gameLog = gameLog.slice(-100);
    saveData();
}

function addHouseLog(houseId, msg) {
    if (!houseId) return;
    if (!houseLogs[houseId]) houseLogs[houseId] = [];
    var now = new Date();
    var time = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
    houseLogs[houseId].push('[' + time + '] ' + msg);
    if (houseLogs[houseId].length > 50) houseLogs[houseId] = houseLogs[houseId].slice(-50);
    saveData();
}

function getTimeLeft(timestamp, daysPaid) {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const hourMs = 60 * 60 * 1000;
    const expireTime = timestamp + (daysPaid * dayMs);
    const timeLeft = expireTime - now;
    if (timeLeft <= 0) return { expired: true, text: '⚠️ ПРОСРОЧЕНО!' };
    const days = Math.floor(timeLeft / dayMs);
    const hours = Math.floor((timeLeft % dayMs) / hourMs);
    return { expired: false, days: days, hours: hours, text: days + ' дн. ' + hours + ' ч.' };
}

function isStackable(item) {
    if (!item) return false;
    if (item.type === 'resource') return true;
    if (item.type === 'food' && item.effect) return true;
    const names = ['Хлеб','Мясо','Рыба','Вода','Эль','Вино','Кожа','Руда','Уголь','Сталь','Дерево','Шкура'];
    if (item.name) { for (let n of names) { if (item.name.includes(n)) return true; } }
    return false;
}

function isConsumable(item) {
    if (!item) return false;
    if (item.type === 'food') return true;
    if (item.effect) return true;
    if (item.name && (item.name.includes('Хлеб')||item.name.includes('Мясо')||item.name.includes('Рыба')||item.name.includes('Вода')||item.name.includes('Эль')||item.name.includes('Вино'))) return true;
    return false;
}

function addTraderStock(place, itemKey, amount) {
    if (!traderInventory) traderInventory = {};
    if (!traderInventory[place]) traderInventory[place] = {};
    traderInventory[place][itemKey] = (traderInventory[place][itemKey] || 0) + amount;
    saveData();
}

function removeTraderStock(place, itemKey, amount) {
    if (!traderInventory) traderInventory = {};
    if (!traderInventory[place]) traderInventory[place] = {};
    const current = traderInventory[place][itemKey] || 0;
    traderInventory[place][itemKey] = Math.max(0, current - amount);
    saveData();
}

function getTraderStock(place, itemKey) {
    if (!traderInventory) traderInventory = {};
    if (!traderInventory[place]) traderInventory[place] = {};
    return traderInventory[place][itemKey] || 0;
}

function initTraderStock() {
    const shops = ['Кожевник', 'Плотник', 'Кузница'];
    shops.forEach(function(shop) {
        if (!traderInventory[shop]) traderInventory[shop] = {};
        
        if (shop === 'Кожевник') {
            ['Плохое','Обычное','Хорошее','Качественное','Мастерское','Легендарное'].forEach(function(q) {
                traderInventory[shop]['Кожа|' + q] = 10;
            });
            Object.keys(ALL_ITEMS.leather).forEach(function(type) {
                ALL_ITEMS.leather[type].forEach(function(item) {
                    ['Плохое','Обычное','Хорошее','Качественное'].forEach(function(q) {
                        traderInventory[shop][item.name + '|' + q] = 1;
                    });
                });
            });
        }
        
        if (shop === 'Плотник') {
            ['Плохое','Обычное','Хорошее','Качественное','Мастерское','Легендарное'].forEach(function(q) {
                traderInventory[shop]['Дерево|' + q] = 10;
            });
            ['bow','crossbow'].forEach(function(type) {
                ALL_ITEMS.weapons[type].forEach(function(item) {
                    ['Плохое','Обычное','Хорошее','Качественное'].forEach(function(q) {
                        traderInventory[shop][item.name + '|' + q] = 1;
                    });
                });
            });
        }
        
        if (shop === 'Кузница') {
            ['sword','spear','axe','mace','dagger','shield'].forEach(function(type) {
                ALL_ITEMS.weapons[type].forEach(function(item) {
                    ['Плохое','Обычное','Хорошее','Качественное'].forEach(function(q) {
                        traderInventory[shop][item.name + '|' + q] = 1;
                    });
                });
            });
            Object.keys(ALL_ITEMS.plate).forEach(function(type) {
                ALL_ITEMS.plate[type].forEach(function(item) {
                    ['Плохое','Обычное','Хорошее','Качественное'].forEach(function(q) {
                        traderInventory[shop][item.name + '|' + q] = 1;
                    });
                });
            });
            ['Плохое','Обычное','Хорошее','Качественное','Мастерское','Легендарное'].forEach(function(q) {
                traderInventory[shop]['Руда железная|' + q] = 15;
            });
            traderInventory[shop]['Руда 14 огней|Мифическое'] = 1;
            ['Плохое','Обычное','Хорошее','Качественное','Мастерское'].forEach(function(q) {
                traderInventory[shop]['Уголь|' + q] = 10;
            });
            ['Плохое','Обычное','Хорошее','Качественное','Мастерское','Легендарное'].forEach(function(q) {
                traderInventory[shop]['Сталь|' + q] = 3;
            });
            traderInventory[shop]['Валирийская сталь|Мифическое'] = 1;
        }
    });
    saveData();
}

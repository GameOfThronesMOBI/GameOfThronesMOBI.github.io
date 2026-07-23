// ============================================================
// СОХРАНЕНИЕ И ЗАГРУЗКА
// ============================================================

function loadHousingMarket() {
    try {
        const raw = localStorage.getItem('got_housing_market');
        if (raw) {
            const parsed = JSON.parse(raw);
            for (let key in housingMarket) {
                if (parsed[key]) housingMarket[key].occupied = parsed[key].occupied || 0;
            }
        }
    } catch(e) {}
}

function saveHousingMarket() {
    localStorage.setItem('got_housing_market', JSON.stringify(housingMarket));
}

function loadHorseMarket() {
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

function saveHorseMarket() {
    localStorage.setItem('got_horse_market', JSON.stringify(horseMarket));
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

function initMarketStalls() {
    for (let i = 1; i <= MARKET_STALLS_TOTAL; i++) {
        if (!marketStalls[i]) {
            marketStalls[i] = { owner: null, rentPaid: null, rentDays: 0, inventory: [], prices: {} };
        }
    }
}

function loadMarketStalls() {
    try {
        const raw = localStorage.getItem('got_market_stalls');
        if (raw) { marketStalls = JSON.parse(raw); } else { initMarketStalls(); }
    } catch(e) { initMarketStalls(); }
}

function saveMarketStalls() {
    localStorage.setItem('got_market_stalls', JSON.stringify(marketStalls));
}

function loadLoginData() {
    try {
        const raw = localStorage.getItem('got_login_data');
        if (raw) {
            const parsed = JSON.parse(raw);
            loginAttempts = parsed.attempts || {};
            loginBlockedUntil = parsed.blocked || {};
        }
    } catch(e) {
        loginAttempts = {};
        loginBlockedUntil = {};
    }
}

function saveLoginData() {
    localStorage.setItem('got_login_data', JSON.stringify({
        attempts: loginAttempts,
        blocked: loginBlockedUntil
    }));
}

function loadData() {
    try { const raw = localStorage.getItem('got_users'); if (raw) users = JSON.parse(raw); } catch(e) { users = {}; }
    try { const raw = localStorage.getItem('got_market'); if (raw) marketListings = JSON.parse(raw); } catch(e) { marketListings = []; }
    try { const raw = localStorage.getItem('got_trader'); if (raw) traderInventory = JSON.parse(raw); } catch(e) { traderInventory = {}; }
    try { const raw = localStorage.getItem('got_log'); if (raw) gameLog = JSON.parse(raw); } catch(e) { gameLog = []; }
    try { const raw = localStorage.getItem('got_house_logs'); if (raw) houseLogs = JSON.parse(raw); } catch(e) { houseLogs = {}; }
    try { const raw = localStorage.getItem('got_confiscated'); if (raw) confiscatedItems = JSON.parse(raw); } catch(e) { confiscatedItems = []; }
    try { const raw = localStorage.getItem('got_dice_games'); if (raw) { diceGames = JSON.parse(raw); } } catch(e) { diceGames = {}; }
    
    // Замковые хранилища
    try { const raw = localStorage.getItem('got_castle_storages'); if (raw) window._castleStorages = JSON.parse(raw); } catch(e) { window._castleStorages = {}; }
    try { const raw = localStorage.getItem('got_castle_granaries'); if (raw) window._castleGranaries = JSON.parse(raw); } catch(e) { window._castleGranaries = {}; }
    try { const raw = localStorage.getItem('got_castle_armories'); if (raw) window._castleArmories = JSON.parse(raw); } catch(e) { window._castleArmories = {}; }
    try { const raw = localStorage.getItem('got_castle_queues'); if (raw) window._castleQueues = JSON.parse(raw); } catch(e) { window._castleQueues = {}; }
    try { const raw = localStorage.getItem('got_castle_stables'); if (raw) window._castleStables = JSON.parse(raw); } catch(e) { window._castleStables = {}; }
    try { const raw = localStorage.getItem('got_castle_garrisons'); if (raw) window._castleGarrisons = JSON.parse(raw); } catch(e) { window._castleGarrisons = {}; }
    try { const raw = localStorage.getItem('got_castle_horse_limits'); if (raw) window._castleHorseLimits = JSON.parse(raw); } catch(e) { window._castleHorseLimits = {}; }
    
    loadHousingMarket();
    loadHorseMarket();
    loadMarketStalls();
    loadLoginData();
    if (Object.keys(traderInventory).length === 0) initTraderStock();
}

function saveData() {
    localStorage.setItem('got_users', JSON.stringify(users));
    localStorage.setItem('got_market', JSON.stringify(marketListings));
    localStorage.setItem('got_trader', JSON.stringify(traderInventory));
    localStorage.setItem('got_confiscated', JSON.stringify(confiscatedItems));
    localStorage.setItem('got_dice_games', JSON.stringify(diceGames));
    localStorage.setItem('got_house_logs', JSON.stringify(houseLogs));
    
    // Замковые хранилища
    localStorage.setItem('got_castle_storages', JSON.stringify(window._castleStorages || {}));
    localStorage.setItem('got_castle_granaries', JSON.stringify(window._castleGranaries || {}));
    localStorage.setItem('got_castle_armories', JSON.stringify(window._castleArmories || {}));
    localStorage.setItem('got_castle_queues', JSON.stringify(window._castleQueues || {}));
    localStorage.setItem('got_castle_stables', JSON.stringify(window._castleStables || {}));
    localStorage.setItem('got_castle_garrisons', JSON.stringify(window._castleGarrisons || {}));
    localStorage.setItem('got_castle_horse_limits', JSON.stringify(window._castleHorseLimits || {}));
    
    if (gameLog.length > 100) gameLog = gameLog.slice(-100);
    localStorage.setItem('got_log', JSON.stringify(gameLog));
    saveHousingMarket();
    saveHorseMarket();
    saveMarketStalls();
    saveLoginData();
}

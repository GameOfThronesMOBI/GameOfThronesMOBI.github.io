// ============================================================
// js/regions/stormlands/castles/buckler_castle.js
// ЗАМОК БРОНЗОВЫЙ ЩИТ — ПОЛНЫЙ ФАЙЛ
// ============================================================

var _castlePrevUpdateStory = window.updateStory;
var _castlePrevUpdateActions = window.updateActions;

if (!window._castleStorages) window._castleStorages = {};
if (!window._castleGranaries) window._castleGranaries = {};
if (!window._castleArmories) window._castleArmories = {};
if (!window._castleQueues) window._castleQueues = {};
if (!window._castleHorseLimits) window._castleHorseLimits = {};
if (!window._castleStables) window._castleStables = {};
if (!window._castleGarrisons) window._castleGarrisons = {};

function getCastleStorage(id) {
    if (!window._castleStorages[id]) window._castleStorages[id] = { iron: {}, coal: 0, steel: {}, planks: {}, leather: {}, hardenedLeather: {}, stone: 0, wood: {}, salt: 0, valyrian_ore: 0, valyrian_steel: 0 };
    return window._castleStorages[id];
}
function getCastleGranary(id) {
    if (!window._castleGranaries[id]) window._castleGranaries[id] = { wheat: 0, vegetables: 0, fish: 0, water: 0, bread: 0, meat: 0, cheese: 0, apple: 0, milk: 0, ale: 0, wine: 0 };
    return window._castleGranaries[id];
}
function getCastleArmory(id) {
    if (!window._castleArmories[id]) window._castleArmories[id] = { weapons: [], armor: [], soldierWeapons: [], soldierArmor: [], siegeWeapons: [] };
    return window._castleArmories[id];
}
function getCastleQueue(id) {
    if (!window._castleQueues[id]) window._castleQueues[id] = [];
    return window._castleQueues[id];
}
function getCastleStable(id) {
    if (!window._castleStables[id]) window._castleStables[id] = { personal: {}, shared: [] };
    return window._castleStables[id];
}
function getCastleGarrison(id) {
    if (!window._castleGarrisons[id]) window._castleGarrisons[id] = { infantry: [], cavalry: [], siege: [] };
    return window._castleGarrisons[id];
}
function getCastleHorseLimits(id) {
    if (!window._castleHorseLimits[id]) window._castleHorseLimits[id] = { war: { total: 50, sold: 0, resetTime: Date.now() + 7*24*60*60*1000 }, heavy: { total: 30, sold: 0, resetTime: Date.now() + 7*24*60*60*1000 } };
    var L = window._castleHorseLimits[id], now = Date.now();
    if (now > L.war.resetTime) { L.war.sold = 0; L.war.resetTime = now + 7*24*60*60*1000; }
    if (now > L.heavy.resetTime) { L.heavy.sold = 0; L.heavy.resetTime = now + 7*24*60*60*1000; }
    return L;
}
function addQualityResource(s, key, q, c) {
    if (!s[key]) s[key] = {};
    if (!s[key][q]) s[key][q] = 0;
    s[key][q] += c;
}
function getTotalQualityResource(s, key) {
    if (!s[key]) return 0;
    var t = 0;
    for (var q in s[key]) t += s[key][q];
    return t;
}
function isBucklerMember() { return users[currentUser] && users[currentUser].game && users[currentUser].game.house === 'buckler'; }
function checkBucklerAccess() { if (!isBucklerMember()) { setMessage('❌ Только для членов дома Баклеров.'); return false; } return true; }

var CASTLE_BUILDINGS_STATUS = { forge: true, carpenter: false, tannery: false };

const CASTLE_BUILDINGS = [
    { id: 'castle_gate', label: '🚪 Ворота замка' },
    { id: 'castle_donjon', label: '🏰 Донжон' },
    { id: 'castle_barracks', label: '⚔️ Казармы' },
    { id: 'castle_training', label: '🎯 Тренировочная площадка' },
    { id: 'castle_workshop', label: '🛠️ Мастерская' },
    { id: 'castle_forge', label: '⚒️ Кузница' },
    { id: 'castle_granary', label: '🌾 Амбар' },
    { id: 'castle_storage', label: '📦 Склад' },
    { id: 'castle_armory', label: '🗡️ Оружейная' },
    { id: 'castle_stable', label: '🐴 Конюшня' },
    { id: 'castle_market', label: '🏪 Рынок' },
    { id: 'castle_tavern', label: '🍺 Таверна' },
    { id: 'castle_dungeon', label: '⛓️ Темница' }
];

var CASTLE_ID = 'buckler';

var UNIT_TYPES = {
    light_swordsman:   { name: 'Мечник лёгкий',       emoji: '⚔️', weapon: ['sword'],              armor: 'leather', horse: null,      siege: false },
    heavy_swordsman:   { name: 'Мечник тяжёлый',      emoji: '🗡️', weapon: ['sword','shield'],     armor: 'plate',   horse: null,      siege: false },
    light_spearman:    { name: 'Копейщик лёгкий',     emoji: '🔱', weapon: ['spear','sword'],      armor: 'leather', horse: null,      siege: false },
    heavy_spearman:    { name: 'Копейщик тяжёлый',    emoji: '🛡️', weapon: ['spear','sword','shield'], armor: 'plate', horse: null,      siege: false },
    archer:            { name: 'Лучник',               emoji: '🏹', weapon: ['bow'],                armor: 'leather', horse: null,      siege: false },
    crossbowman:       { name: 'Арбалетчик',          emoji: '🔩', weapon: ['crossbow'],           armor: 'plate',   horse: null,      siege: false },
    rider:             { name: 'Всадник',             emoji: '🏇', weapon: ['sword'],              armor: 'leather', horse: 'war',     siege: false },
    heavy_rider:       { name: 'Тяжёлый всадник',     emoji: '🐎', weapon: ['sword'],              armor: 'plate',   horse: 'war',     siege: false },
    knight:            { name: 'Рыцарь',               emoji: '👑', weapon: ['sword','shield'],     armor: 'plate',   horse: 'heavy',   siege: false }
};

var UNIT_COSTS = {
    light_swordsman:   { gold: 10, peasants: 1 },
    heavy_swordsman:   { gold: 25, peasants: 1 },
    light_spearman:    { gold: 15, peasants: 1 },
    heavy_spearman:    { gold: 35, peasants: 1 },
    archer:            { gold: 12, peasants: 1 },
    crossbowman:       { gold: 22, peasants: 1 },
    rider:             { gold: 30, peasants: 1, horse: 'war' },
    heavy_rider:       { gold: 50, peasants: 1, horse: 'war' },
    knight:            { gold: 80, peasants: 1, horse: 'heavy' }
};

var SIEGE_CREW_REQUIREMENTS = { ram: 6, scorpion: 3, catapult: 2, tower: 8, trebuchet: 4 };

var SIEGE_RECIPES = {
    ram:       { itemKey: 'ram',       planks: 10, steel: 5,  leather: 0, time: 180, needs: { forge: true, carpenter: true,  tannery: false } },
    scorpion:  { itemKey: 'scorpion',  planks: 8,  steel: 5,  leather: 3, time: 120, needs: { forge: true, carpenter: true,  tannery: true  } },
    catapult:  { itemKey: 'catapult',  planks: 15, steel: 10, leather: 0, time: 240, needs: { forge: true, carpenter: true,  tannery: false } },
    tower:     { itemKey: 'tower',     planks: 20, steel: 0,  leather: 5, time: 360, needs: { forge: false, carpenter: true, tannery: true  } },
    trebuchet: { itemKey: 'trebuchet', planks: 25, steel: 15, leather: 5, time: 480, needs: { forge: true, carpenter: true,  tannery: true  } }
};

// ============================================================
// ТАВЕРНА
// ============================================================
function openCastleTavern() {
    var g = users[currentUser].game;
    var modal = document.getElementById('modal-tavern') || (function(){
        var o = document.createElement('div'); o.id = 'modal-tavern'; o.className = 'modal-overlay hide';
        o.onclick = function(e) { if (e.target === this) closeCastleTavern(); };
        o.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🍺 ТАВЕРНА ЗАМКА</h3><button class="close-btn" onclick="closeCastleTavern()">✕</button></div><div id="modal-tavern-content"></div></div>';
        document.body.appendChild(o); return o;
    })();
    var c = document.getElementById('modal-tavern-content');
    var h = '<div class="modal-section"><h4>🍺 ТАВЕРНА БРОНЗОВОГО ЩИТА</h4>';
    h += '<p style="color:#6a5a48;">💰 ' + formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper) + '</p></div>';
    
    h += '<div class="modal-section"><h4>🍞 ЕДА</h4>';
    [{name:'🍞 Хлеб',price:5,food:20},{name:'🥩 Мясо',price:10,food:30},{name:'🐟 Рыба',price:8,food:25},{name:'🧀 Сыр',price:7,food:22},{name:'🍎 Яблоко',price:3,food:15}].forEach(function(item){
        h += '<div class="row"><span class="label">'+item.name+'</span><span class="value">'+formatCurrency(item.price)+' <button class="btn btn-small" onclick="buyTavernItem(\''+item.name+'\','+item.price+','+item.food+',0)">Купить</button></span></div>';
    });
    h += '</div>';
    
    h += '<div class="modal-section"><h4>🍺 НАПИТКИ</h4>';
    [{name:'💧 Вода',price:2,food:0,thirst:15},{name:'🍺 Эль',price:5,food:0,thirst:10},{name:'🍷 Вино',price:8,food:0,thirst:15},{name:'🥛 Молоко',price:4,food:10,thirst:10}].forEach(function(item){
        h += '<div class="row"><span class="label">'+item.name+'</span><span class="value">'+formatCurrency(item.price)+' <button class="btn btn-small" onclick="buyTavernItem(\''+item.name+'\','+item.price+','+item.food+','+item.thirst+')">Купить</button></span></div>';
    });
    h += '</div>';
    
    h += '<div class="modal-section"><h4>🛏️ ОТДЫХ</h4>';
    h += '<div class="row"><span class="label">Отдохнуть (10 МП)</span><span class="value"><button class="btn btn-small" onclick="restInTavern()">🛏️ Отдых</button></span></div></div>';
    
    h += '<button class="btn btn-secondary" onclick="closeCastleTavern()" style="margin-top:10px;">Закрыть</button>';
    c.innerHTML = h; modal.classList.remove('hide');
}
function buyTavernItem(name, price, food, thirst) {
    var g = users[currentUser].game;
    if (!spendMoney(g, price)) { setMessage('❌ Недостаточно денег!'); return; }
    if (food > 0) g.food = Math.min(100, g.food + food);
    if (thirst > 0) g.thirst = Math.min(100, g.thirst + thirst);
    saveData(); setMessage('✅ Куплено: ' + name); updateMenu(); openCastleTavern();
}
function restInTavern() {
    var g = users[currentUser].game;
    if (!spendMoney(g, 10)) { setMessage('❌ Недостаточно денег!'); return; }
    g.fatigue = Math.min(100, g.fatigue + 30);
    g.hp = Math.min(g.maxHp, g.hp + 15);
    saveData(); setMessage('🛏️ Вы отдохнули.'); updateMenu(); openCastleTavern();
}
function closeCastleTavern() { var m = document.getElementById('modal-tavern'); if (m) m.classList.add('hide'); }

// ============================================================
// КОНЮШНЯ
// ============================================================
function openCastleStable() {
    if (!checkBucklerAccess()) return;
    var g = users[currentUser].game;
    var stable = getCastleStable(CASTLE_ID);
    
    var modal = document.getElementById('modal-stable') || (function(){
        var o = document.createElement('div'); o.id = 'modal-stable'; o.className = 'modal-overlay hide';
        o.onclick = function(e) { if (e.target === this) closeCastleStable(); };
        o.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🐴 ЗАМКОВАЯ КОНЮШНЯ</h3><button class="close-btn" onclick="closeCastleStable()">✕</button></div><div id="modal-stable-content"></div></div>';
        document.body.appendChild(o); return o;
    })();
    
    var c = document.getElementById('modal-stable-content');
    var h = '';
    
    h += '<div class="modal-section"><h4>🐴 ВАША ЛОШАДЬ</h4>';
    if (g.equipment && g.equipment.horse) {
        var horse = HORSE_TYPES[g.equipment.horse.horseType];
        if (horse) {
            h += '<div style="background:#120e0b;border:1px solid #3d3026;border-radius:12px;padding:14px;margin-bottom:16px;">';
            h += '<div style="color:#c9b694;font-size:16px;">' + horse.emoji + ' ' + horse.name + '</div>';
            h += '<div style="color:#6a5a48;font-size:12px;">❤️ HP: ' + g.equipment.horse.hp + '/' + g.equipment.horse.maxHp + '</div>';
            h += '<button class="btn btn-small" onclick="stablePersonalHorse()" style="margin-top:8px;">📥 Оставить в конюшне</button>';
            h += '<button class="btn btn-small" onclick="donateHorseToShared()" style="margin-top:4px;">🐴 Передать в общак</button>';
            h += '</div>';
        }
    } else {
        h += '<p style="color:#6a5a48;">У вас нет лошади.</p>';
    }
    h += '</div>';
    
    h += '<div class="modal-section"><h4>🔒 ЛИЧНАЯ КОНЮШНЯ</h4>';
    var personalHorses = stable.personal[currentUser] || [];
    if (personalHorses.length === 0) {
        h += '<p style="color:#6a5a48;">Пусто.</p>';
    } else {
        personalHorses.forEach(function(hh, i) {
            h += '<div class="row"><span class="label">' + HORSE_TYPES[hh.horseType].emoji + ' ' + hh.name + ' (HP: ' + hh.hp + '/' + hh.maxHp + ')</span>';
            h += '<span class="value"><button class="btn btn-small" onclick="takePersonalHorse(' + i + ')">📤 Забрать</button></span></div>';
        });
    }
    h += '</div>';
    
    h += '<div class="modal-section"><h4>🐴 ОБЩАЯ КОНЮШНЯ (для конницы)</h4>';
    h += '<p style="color:#6a5a48;font-size:11px;">Лошади для найма конницы.</p>';
    if (stable.shared.length === 0) {
        h += '<p style="color:#6a5a48;">Пусто.</p>';
    } else {
        var sharedGrouped = {};
        stable.shared.forEach(function(hh) {
            var k = hh.horseType;
            if (!sharedGrouped[k]) sharedGrouped[k] = 0;
            sharedGrouped[k]++;
        });
        for (var k in sharedGrouped) {
            h += '<div class="row"><span class="label">' + HORSE_TYPES[k].emoji + ' ' + HORSE_TYPES[k].name + '</span>';
            h += '<span class="value">×' + sharedGrouped[k] + '</span></div>';
        }
    }
    h += '</div>';
    
    h += '<h4 style="color:#c9b694;margin-top:16px;">📦 БОЕВЫЕ ЛОШАДИ (-50% цены, для Баклеров)</h4>';
    var limits = getCastleHorseLimits(CASTLE_ID);
    var now = Date.now();
    
    var castleHorses = [
        { type: 'war', name: HORSE_TYPES['war'].name, emoji: '⚔️', price: Math.floor(HORSE_TYPES['war'].price * 0.5), limit: limits.war },
        { type: 'heavy', name: HORSE_TYPES['heavy'].name, emoji: '🛡️', price: Math.floor(HORSE_TYPES['heavy'].price * 0.5), limit: limits.heavy }
    ];
    
    castleHorses.forEach(function(hh) {
        var available = hh.limit.total - hh.limit.sold;
        var canBuy = !g.equipment || !g.equipment.horse;
        var timeLeft = Math.ceil((hh.limit.resetTime - now) / (24 * 60 * 60 * 1000));
        
        h += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #1a1410;">';
        h += '<div>' + hh.emoji + ' <strong>' + hh.name + '</strong>';
        h += '<br><span style="font-size:11px;color:#6a5a48;">Доступно: ' + available + '/' + hh.limit.total + ' | Сброс: ' + timeLeft + ' дн.</span>';
        h += '</div><div style="text-align:right;">';
        if (canBuy && available > 0) h += formatCurrency(hh.price * 210 * 56) + ' <button class="btn btn-small" onclick="buyCastleHorse(\'' + hh.type + '\',' + hh.price + '); closeCastleStable();">✅</button>';
        else if (available <= 0) h += '<span style="color:#c96a5a;">Распродано</span>';
        else h += '<span style="color:#c96a5a;">Продайте текущую</span>';
        h += '</div></div>';
    });
    
    c.innerHTML = h; modal.classList.remove('hide');
}
function stablePersonalHorse() {
    var g = users[currentUser].game;
    if (!g.equipment || !g.equipment.horse) { setMessage('❌ У вас нет лошади.'); return; }
    var stable = getCastleStable(CASTLE_ID);
    if (!stable.personal[currentUser]) stable.personal[currentUser] = [];
    stable.personal[currentUser].push(g.equipment.horse);
    g.equipment.horse = null;
    saveData(); setMessage('✅ Лошадь оставлена в личной конюшне.'); updateMenu(); openCastleStable();
}
function takePersonalHorse(index) {
    var g = users[currentUser].game;
    if (g.equipment && g.equipment.horse) { setMessage('❌ У вас уже есть лошадь.'); return; }
    var stable = getCastleStable(CASTLE_ID);
    var horses = stable.personal[currentUser] || [];
    if (index >= horses.length) { setMessage('❌ Лошадь не найдена.'); return; }
    g.equipment.horse = horses.splice(index, 1)[0];
    saveData(); setMessage('✅ Лошадь забрана.'); updateMenu(); openCastleStable();
}
function donateHorseToShared() {
    var g = users[currentUser].game;
    if (!g.equipment || !g.equipment.horse) { setMessage('❌ У вас нет лошади.'); return; }
    var stable = getCastleStable(CASTLE_ID);
    stable.shared.push(g.equipment.horse);
    g.equipment.horse = null;
    saveData(); setMessage('✅ Лошадь передана в общую конюшню.'); updateMenu(); openCastleStable();
}
function buyCastleHorse(type, price) {
    if (!checkBucklerAccess()) return;
    var g = users[currentUser].game;
    var horse = HORSE_TYPES[type];
    if (!horse) { setMessage('❌ Такой лошади нет.'); return; }
    if (g.equipment && g.equipment.horse) { setMessage('❌ У вас уже есть лошадь!'); return; }
    var limits = getCastleHorseLimits(CASTLE_ID);
    if (type === 'war' && limits.war.sold >= limits.war.total) { setMessage('❌ Все боевые кони распроданы.'); return; }
    if (type === 'heavy' && limits.heavy.sold >= limits.heavy.total) { setMessage('❌ Все тяжёлые кони распроданы.'); return; }
    if (!spendMoney(g, price * 210 * 56)) { setMessage('❌ Недостаточно денег!'); return; }
    g.equipment.horse = { type: 'horse', horseType: type, name: horse.name, hp: horse.hp, maxHp: horse.hp, speedBonus: horse.speedBonus, defensePercent: horse.defensePercent, inventorySlots: horse.inventorySlots };
    if (type === 'war') limits.war.sold++;
    else if (type === 'heavy') limits.heavy.sold++;
    saveData(); setMessage('✅ Вы купили ' + horse.name); updateMenu();
}
function closeCastleStable() { var m = document.getElementById('modal-stable'); if (m) m.classList.add('hide'); }

// ============================================================
// МАСТЕРСКАЯ
// ============================================================
function openCastleWorkshop() {
    if (!checkBucklerAccess()) return;
    var storage = getCastleStorage(CASTLE_ID);
    var queue = getCastleQueue(CASTLE_ID);
    var armory = getCastleArmory(CASTLE_ID);
    
    var modal = document.getElementById('modal-workshop') || (function(){
        var o = document.createElement('div'); o.id = 'modal-workshop'; o.className = 'modal-overlay hide';
        o.onclick = function(e) { if (e.target === this) closeCastleWorkshop(); };
        o.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🛠️ МАСТЕРСКАЯ</h3><button class="close-btn" onclick="closeCastleWorkshop()">✕</button></div><div id="modal-workshop-content"></div></div>';
        document.body.appendChild(o); return o;
    })();
    
    var c = document.getElementById('modal-workshop-content');
    var totalArmory = armory.weapons.length + armory.armor.length + armory.soldierWeapons.length + armory.soldierArmor.length + (armory.siegeWeapons ? armory.siegeWeapons.length : 0);
    var totalIron = getTotalQualityResource(storage, 'iron');
    var totalSteel = getTotalQualityResource(storage, 'steel');
    var totalPlanks = getTotalQualityResource(storage, 'planks');
    
    var h = '<div class="modal-section"><h4>🛠️ МАСТЕРСКАЯ ЗАМКА</h4>';
    h += '<p style="color:#6a5a48;font-size:11px;">⚒️ Кузница: ' + (CASTLE_BUILDINGS_STATUS.forge ? '✅' : '❌') + ' | 🪵 Плотник: ' + (CASTLE_BUILDINGS_STATUS.carpenter ? '✅' : '❌') + ' | 🧵 Кожевник: ' + (CASTLE_BUILDINGS_STATUS.tannery ? '✅' : '❌') + '</p>';
    h += '<p style="color:#6a5a48;font-size:11px;">📦 Руда:' + totalIron + ' Уголь:' + storage.coal + ' Сталь:' + totalSteel + ' Доски:' + totalPlanks + '</p>';
    h += '<p style="color:#6a5a48;font-size:11px;">🗡️ Оружейная: ' + totalArmory + ' предм.</p>';
    
    if (queue.length > 0) {
        h += '<p style="color:#ffd700;font-size:11px;">⏳ Очередь: ' + queue.length + '/10</p>';
        queue.forEach(function(q, i) {
            h += '<div style="font-size:10px;color:#b8a890;">' + (i+1) + '. ' + q.name + ' — ' + q.timeLeft + ' мин ';
            h += '<button class="btn btn-small" style="background:#3d2a1a;font-size:9px;" onclick="cancelQueueItem(' + i + ')">❌</button></div>';
        });
    }
    h += '</div>';
    
    h += '<div class="modal-section"><h4>⚒️ РЕСУРСЫ</h4>';
    h += '<div class="row"><span class="label">Сталь (2 руды + 1 уголь)</span><span class="value"><button class="btn btn-small" onclick="queueWorkshopItem(\'steel\')">🔨 1ч</button></span></div>';
    h += '</div>';
    
    h += '<div class="modal-section"><h4>🗡️ ОРУЖИЕ (Кузница)</h4>';
    [{id:'sword',name:'Меч солдата',steel:3,planks:0},{id:'spear',name:'Копьё солдата',steel:1,planks:2},{id:'shield',name:'Щит солдата',steel:6,planks:0}].forEach(function(w){
        h += '<div class="row"><span class="label">'+w.name+' ('+w.steel+' стали'+(w.planks>0?' + '+w.planks+' досок':'')+')</span><span class="value"><button class="btn btn-small" onclick="queueWorkshopItem(\''+w.id+'\')">🔨 1ч</button></span></div>';
    });
    h += '</div>';
    
    h += '<div class="modal-section"><h4>🛡️ ЛАТНАЯ БРОНЯ</h4>';
    h += '<div class="row"><span class="label">Комплект латной брони (12 стали)</span><span class="value"><button class="btn btn-small" onclick="queueWorkshopItem(\'plate_armor\')">🔨 1ч</button></span></div>';
    h += '</div>';
    
    h += '<div class="modal-section"><h4>🏗️ ОСАДНЫЕ ОРУДИЯ</h4>';
    h += '<button class="btn" onclick="openSiegeCraft()">🏗️ Открыть производство осадных орудий</button>';
    h += '</div>';
    
    h += '<button class="btn btn-secondary" onclick="closeCastleWorkshop()" style="margin-top:10px;">Закрыть</button>';
    c.innerHTML = h; modal.classList.remove('hide');
}
function queueWorkshopItem(itemId) {
    var queue = getCastleQueue(CASTLE_ID);
    var storage = getCastleStorage(CASTLE_ID);
    if (queue.length >= 10) { setMessage('❌ Очередь заполнена.'); return; }
    
    var name = '', needsSteel = 0, needsIron = 0, needsCoal = 0, needsPlanks = 0;
    if (itemId === 'steel') { name = 'Сталь'; needsIron = 2; needsCoal = 1; }
    else if (itemId === 'sword') { name = 'Меч солдата'; needsSteel = 3; }
    else if (itemId === 'spear') { name = 'Копьё солдата'; needsSteel = 1; needsPlanks = 2; }
    else if (itemId === 'shield') { name = 'Щит солдата'; needsSteel = 6; }
    else if (itemId === 'plate_armor') { name = 'Комплект латной брони'; needsSteel = 12; }
    else { setMessage('❌ Неизвестный предмет.'); return; }
    
    var totalIron = getTotalQualityResource(storage, 'iron');
    var totalSteel = getTotalQualityResource(storage, 'steel');
    var totalPlanks = getTotalQualityResource(storage, 'planks');
    
    if (totalIron < needsIron || storage.coal < needsCoal || totalSteel < needsSteel || totalPlanks < needsPlanks) {
        setMessage('❌ Недостаточно ресурсов на складе.'); return;
    }
    
    if (needsIron > 0 && storage.iron['Обычное']) { var t = Math.min(storage.iron['Обычное'], needsIron); storage.iron['Обычное'] -= t; if (storage.iron['Обычное'] <= 0) delete storage.iron['Обычное']; }
    if (needsSteel > 0 && storage.steel['Обычное']) { var t = Math.min(storage.steel['Обычное'], needsSteel); storage.steel['Обычное'] -= t; if (storage.steel['Обычное'] <= 0) delete storage.steel['Обычное']; }
    if (needsPlanks > 0 && storage.planks['Обычное']) { var t = Math.min(storage.planks['Обычное'], needsPlanks); storage.planks['Обычное'] -= t; if (storage.planks['Обычное'] <= 0) delete storage.planks['Обычное']; }
    storage.coal -= needsCoal;
    
    queue.push({ id: itemId, name: name, timeLeft: 60 });
    setMessage('✅ Добавлено в очередь: ' + name + ' (1 час)');
    processWorkshopQueue(); closeCastleWorkshop(); openCastleWorkshop();
}
function cancelQueueItem(index) {
    var queue = getCastleQueue(CASTLE_ID);
    var storage = getCastleStorage(CASTLE_ID);
    if (index >= queue.length) { setMessage('❌ Предмет не найден.'); return; }
    var item = queue.splice(index, 1)[0];
    
    if (item.isSiege) {
        var recipe = SIEGE_RECIPES[item.siegeKey || item.itemKey];
        if (recipe) {
            if (recipe.planks > 0) addQualityResource(storage, 'planks', 'Обычное', recipe.planks);
            if (recipe.steel > 0) addQualityResource(storage, 'steel', 'Обычное', recipe.steel);
            if (recipe.leather > 0) addQualityResource(storage, 'leather', 'Обычное', recipe.leather);
        }
    } else if (item.id === 'steel') { addQualityResource(storage, 'iron', 'Обычное', 2); storage.coal += 1; }
    else if (item.id === 'sword') { addQualityResource(storage, 'steel', 'Обычное', 3); }
    else if (item.id === 'spear') { addQualityResource(storage, 'steel', 'Обычное', 1); addQualityResource(storage, 'planks', 'Обычное', 2); }
    else if (item.id === 'shield') { addQualityResource(storage, 'steel', 'Обычное', 6); }
    else if (item.id === 'plate_armor') { addQualityResource(storage, 'steel', 'Обычное', 12); }
    
    saveData();
    setMessage('❌ ' + item.name + ' удалён из очереди. Ресурсы возвращены.');
    closeCastleWorkshop(); openCastleWorkshop();
}
function processWorkshopQueue() {
    var queue = getCastleQueue(CASTLE_ID);
    if (queue.length === 0 || window._workshopTimer) return;
    window._workshopTimer = setInterval(function() {
        if (queue.length === 0) { clearInterval(window._workshopTimer); window._workshopTimer = null; return; }
        queue[0].timeLeft--;
        if (queue[0].timeLeft <= 0) {
            var done = queue.shift();
            var storage = getCastleStorage(CASTLE_ID);
            var armory = getCastleArmory(CASTLE_ID);
            
            if (done.isSiege) {
                var siegeItem = JSON.parse(JSON.stringify(SIEGE_WEAPONS[done.itemKey]));
                siegeItem.count = 1;
                if (!armory.siegeWeapons) armory.siegeWeapons = [];
                armory.siegeWeapons.push(siegeItem);
                setMessage('✅ ' + done.name + ' готов!');
            } else if (done.id === 'steel') {
                addQualityResource(storage, 'steel', 'Обычное', 1);
                setMessage('✅ Сталь готова!');
            } else {
                var item = null, cat = '';
                if (done.id === 'sword') { item = SOLDIER_ITEMS.weapons.sword[0]; cat = 'soldierWeapons'; }
                else if (done.id === 'spear') { item = SOLDIER_ITEMS.weapons.spear[0]; cat = 'soldierWeapons'; }
                else if (done.id === 'shield') { item = SOLDIER_ITEMS.weapons.shield[0]; cat = 'soldierWeapons'; }
                else if (done.id === 'plate_armor') { item = SOLDIER_ITEMS.armor.plate[0]; cat = 'soldierArmor'; }
                if (item) { armory[cat].push(item); setMessage('✅ ' + item.name + ' готов!'); }
            }
            saveData();
        }
        if (queue.length === 0) { clearInterval(window._workshopTimer); window._workshopTimer = null; }
    }, 60000);
}
function closeCastleWorkshop() { var m = document.getElementById('modal-workshop'); if (m) m.classList.add('hide'); }

// ============================================================
// ОСАДНЫЕ ОРУДИЯ — КРАФТ
// ============================================================
function openSiegeCraft() {
    if (!checkBucklerAccess()) return;
    var storage = getCastleStorage(CASTLE_ID);
    var queue = getCastleQueue(CASTLE_ID);
    
    var modal = document.getElementById('modal-siege') || (function(){
        var o = document.createElement('div'); o.id = 'modal-siege'; o.className = 'modal-overlay hide';
        o.onclick = function(e) { if (e.target === this) closeSiegeCraft(); };
        o.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🏗️ ОСАДНЫЕ ОРУДИЯ</h3><button class="close-btn" onclick="closeSiegeCraft()">✕</button></div><div id="modal-siege-content"></div></div>';
        document.body.appendChild(o); return o;
    })();
    
    var c = document.getElementById('modal-siege-content');
    var totalPlanks = getTotalQualityResource(storage, 'planks');
    var totalSteel = getTotalQualityResource(storage, 'steel');
    var totalLeather = getTotalQualityResource(storage, 'leather');
    
    var h = '<div class="modal-section"><h4>🏗️ ПРОИЗВОДСТВО ОСАДНЫХ ОРУДИЙ</h4>';
    h += '<p style="color:#6a5a48;font-size:11px;">📦 Доски: ' + totalPlanks + ' | Сталь: ' + totalSteel + ' | Кожа: ' + totalLeather + '</p>';
    h += '<p style="color:#6a5a48;font-size:11px;">🏗️ Здания: ⚒️ Кузница ' + (CASTLE_BUILDINGS_STATUS.forge ? '✅' : '❌') + ' | 🪵 Плотник ' + (CASTLE_BUILDINGS_STATUS.carpenter ? '✅' : '❌') + ' | 🧵 Кожевник ' + (CASTLE_BUILDINGS_STATUS.tannery ? '✅' : '❌') + '</p>';
    h += '<p style="color:#6a5a48;font-size:11px;">⏳ Очередь: ' + queue.length + '/10</p></div>';
    
    h += '<div class="modal-section"><h4>🔨 ДОСТУПНЫЕ ОРУДИЯ</h4>';
    
    for (var key in SIEGE_RECIPES) {
        var recipe = SIEGE_RECIPES[key];
        var item = SIEGE_WEAPONS[recipe.itemKey];
        if (!item) continue;
        
        var buildingsMet = true;
        var buildingIcons = [];
        if (recipe.needs.forge) buildingIcons.push('⚒️' + (CASTLE_BUILDINGS_STATUS.forge ? '✅' : '❌'));
        if (recipe.needs.carpenter) buildingIcons.push('🪵' + (CASTLE_BUILDINGS_STATUS.carpenter ? '✅' : '❌'));
        if (recipe.needs.tannery) buildingIcons.push('🧵' + (CASTLE_BUILDINGS_STATUS.tannery ? '✅' : '❌'));
        
        if (recipe.needs.forge && !CASTLE_BUILDINGS_STATUS.forge) buildingsMet = false;
        if (recipe.needs.carpenter && !CASTLE_BUILDINGS_STATUS.carpenter) buildingsMet = false;
        if (recipe.needs.tannery && !CASTLE_BUILDINGS_STATUS.tannery) buildingsMet = false;
        
        var canCraft = buildingsMet && totalPlanks >= recipe.planks && totalSteel >= recipe.steel && totalLeather >= recipe.leather;
        var timeStr = Math.floor(recipe.time / 60) + ' ч ' + (recipe.time % 60) + ' мин';
        
        h += '<div style="background:#120e0b;border:1px solid #2a201a;border-radius:10px;padding:12px;margin:6px 0;">';
        h += '<div style="display:flex;justify-content:space-between;align-items:center;">';
        h += '<div>';
        h += '<div style="font-size:14px;color:#c9b694;">' + item.name + '</div>';
        h += '<div style="font-size:11px;color:#6a5a48;">' + item.description + '</div>';
        h += '<div style="font-size:11px;color:#6a5a48;">';
        h += '🪵 Доски: ' + recipe.planks;
        if (recipe.steel > 0) h += ' | ⚒️ Сталь: ' + recipe.steel;
        if (recipe.leather > 0) h += ' | 🧵 Кожа: ' + recipe.leather;
        h += ' | ⏱️ ' + timeStr;
        h += '</div>';
        h += '<div style="font-size:11px;color:#6a5a48;">🏗️ ' + buildingIcons.join(' ');
        if (!buildingsMet) h += ' <span style="color:#c96a5a;">— нет зданий</span>';
        h += '</div>';
        h += '</div>';
        h += '<div><button class="btn btn-small" onclick="queueSiegeItem(\'' + key + '\')" ' + (canCraft ? '' : 'disabled') + '>' + (canCraft ? '🔨 Создать' : (buildingsMet ? '❌ Ресурсы' : '🔒 Здания')) + '</button></div>';
        h += '</div></div>';
    }
    
    h += '</div>';
    h += '<button class="btn btn-secondary" onclick="closeSiegeCraft()" style="margin-top:10px;">Закрыть</button>';
    
    c.innerHTML = h; modal.classList.remove('hide');
}
function queueSiegeItem(siegeKey) {
    var storage = getCastleStorage(CASTLE_ID);
    var queue = getCastleQueue(CASTLE_ID);
    var recipe = SIEGE_RECIPES[siegeKey];
    if (!recipe) { setMessage('❌ Рецепт не найден.'); return; }
    if (queue.length >= 10) { setMessage('❌ Очередь заполнена.'); return; }
    
    var totalPlanks = getTotalQualityResource(storage, 'planks');
    var totalSteel = getTotalQualityResource(storage, 'steel');
    var totalLeather = getTotalQualityResource(storage, 'leather');
    
    if (totalPlanks < recipe.planks || totalSteel < recipe.steel || totalLeather < recipe.leather) {
        setMessage('❌ Недостаточно ресурсов.'); return;
    }
    
    if (recipe.planks > 0 && storage.planks && storage.planks['Обычное']) {
        var take = Math.min(storage.planks['Обычное'], recipe.planks);
        storage.planks['Обычное'] -= take;
        if (storage.planks['Обычное'] <= 0) delete storage.planks['Обычное'];
    }
    if (recipe.steel > 0 && storage.steel && storage.steel['Обычное']) {
        var take = Math.min(storage.steel['Обычное'], recipe.steel);
        storage.steel['Обычное'] -= take;
        if (storage.steel['Обычное'] <= 0) delete storage.steel['Обычное'];
    }
    if (recipe.leather > 0 && storage.leather && storage.leather['Обычное']) {
        var take = Math.min(storage.leather['Обычное'], recipe.leather);
        storage.leather['Обычное'] -= take;
        if (storage.leather['Обычное'] <= 0) delete storage.leather['Обычное'];
    }
    
    queue.push({ id: 'siege_' + siegeKey, name: SIEGE_WEAPONS[recipe.itemKey].name, timeLeft: recipe.time, isSiege: true, itemKey: recipe.itemKey, siegeKey: siegeKey });
    saveData();
    setMessage('✅ ' + SIEGE_WEAPONS[recipe.itemKey].name + ' добавлен в очередь');
    closeSiegeCraft();
}
function closeSiegeCraft() { var m = document.getElementById('modal-siege'); if (m) m.classList.add('hide'); }

// ============================================================
// СКЛАД
// ============================================================
function openCastleStorage() {
    if (!checkBucklerAccess()) return;
    var g = users[currentUser].game;
    var storage = getCastleStorage(CASTLE_ID);
    
    var modal = document.getElementById('modal-storage') || (function(){
        var o = document.createElement('div'); o.id = 'modal-storage'; o.className = 'modal-overlay hide';
        o.onclick = function(e) { if (e.target === this) closeCastleStorage(); };
        o.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📦 СКЛАД ЗАМКА</h3><button class="close-btn" onclick="closeCastleStorage()">✕</button></div><div id="modal-storage-content"></div></div>';
        document.body.appendChild(o); return o;
    })();
    
    var c = document.getElementById('modal-storage-content');
    var h = '<div class="modal-section"><h4>📦 СКЛАД ЗАМКА</h4>';
    
    var qualityResources = [
        {key:'iron',name:'⛏️ Руда'},{key:'steel',name:'⚒️ Сталь'},{key:'planks',name:'🪵 Доски'},
        {key:'leather',name:'🧵 Кожа'},{key:'hardenedLeather',name:'🟫 Дублёная кожа'},{key:'wood',name:'🪵 Древесина'}
    ];
    
    qualityResources.forEach(function(r) {
        var total = getTotalQualityResource(storage, r.key);
        h += '<div class="row"><span class="label">'+r.name+': '+total+'</span><span class="value"><button class="btn btn-small" onclick="showStorageQualityModal(\''+r.key+'\',\''+r.name+'\')">📋</button></span></div>';
    });
    
    var simpleResources = [
        {key:'coal',name:'🔥 Уголь'},{key:'salt',name:'🧂 Соль'},{key:'stone',name:'🪨 Камень'},
        {key:'valyrian_ore',name:'💎 Руда 14 огней'},{key:'valyrian_steel',name:'🌟 Валирийская сталь'}
    ];
    
    simpleResources.forEach(function(r) {
        h += '<div class="row"><span class="label">'+r.name+': '+(storage[r.key]||0)+'</span><span class="value"><button class="btn btn-small" onclick="takeSimpleFromStorage(\''+r.key+'\','+(storage[r.key]||0)+')">📤</button></span></div>';
    });
    h += '</div>';
    
    h += '<div class="modal-section"><h4>📥 ПОЛОЖИТЬ РЕСУРСЫ</h4>';
    g.inventory.forEach(function(item, i) {
        if (item.resourceType) {
            h += '<div class="row"><span class="label">'+item.name+' ('+(item.quality||'Обычное')+') ×'+(item.count||1)+'</span><span class="value"><button class="btn btn-small" onclick="donateToStorage('+i+')">📥</button></span></div>';
        }
    });
    h += '</div>';
    h += '<button class="btn btn-secondary" onclick="closeCastleStorage()">Закрыть</button>';
    c.innerHTML = h; modal.classList.remove('hide');
}
function showStorageQualityModal(key, name) {
    var storage = getCastleStorage(CASTLE_ID);
    var qualities = storage[key] || {};
    
    var modal = document.getElementById('modal-storage-quality') || (function(){
        var o = document.createElement('div'); o.id = 'modal-storage-quality'; o.className = 'modal-overlay hide';
        o.onclick = function(e) { if (e.target === this) closeCastleStorageQuality(); };
        o.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📋 ' + name + '</h3><button class="close-btn" onclick="closeCastleStorageQuality()">✕</button></div><div id="modal-storage-quality-content"></div></div>';
        document.body.appendChild(o); return o;
    })();
    
    var c = document.getElementById('modal-storage-quality-content');
    var h = '<div class="modal-section"><h4>' + name + ' на складе</h4>';
    
    var qualityOrder = ['Рваное','Плохое','Обычное','Хорошее','Качественное','Мастерское','Легендарное','Мифическое'];
    var hasAny = false;
    
    qualityOrder.forEach(function(q) {
        if (qualities[q] && qualities[q] > 0) {
            hasAny = true;
            var qData = QUALITIES[q] || {};
            h += '<div class="row"><span class="label" style="color:'+(qData.color||'#fff')+';">'+(qData.emoji||'')+' '+q+': '+qualities[q]+' шт.</span><span class="value"><button class="btn btn-small" onclick="takeQualityFromStorage(\''+key+'\',\''+q+'\','+qualities[q]+',\''+name+'\')">📤 Забрать</button></span></div>';
        }
    });
    
    if (!hasAny) h += '<p style="color:#6a5a48;">Пусто.</p>';
    h += '</div>';
    h += '<button class="btn btn-secondary" onclick="closeCastleStorageQuality()">Закрыть</button>';
    
    c.innerHTML = h; modal.classList.remove('hide');
}
function takeQualityFromStorage(key, quality, available, name) {
    var amount = parseInt(prompt('Сколько забрать? (доступно: ' + available + ')'));
    if (isNaN(amount) || amount <= 0 || amount > available) { setMessage('❌ Отменено.'); return; }
    
    var storage = getCastleStorage(CASTLE_ID);
    storage[key][quality] -= amount;
    if (storage[key][quality] <= 0) delete storage[key][quality];
    
    var remaining = amount;
    while (remaining > 0) {
        var stack = Math.min(remaining, 50);
        addToInventory(users[currentUser].game, { name: name, type: 'resource', resourceType: key, count: stack, quality: quality });
        remaining -= stack;
    }
    
    saveData(); setMessage('✅ Забрано: ' + amount + ' ' + quality); updateMenu();
    closeCastleStorageQuality(); openCastleStorage();
}
function takeSimpleFromStorage(key, available) {
    if (available <= 0) { setMessage('❌ Нет в наличии.'); return; }
    var amount = parseInt(prompt('Сколько забрать? (доступно: ' + available + ')'));
    if (isNaN(amount) || amount <= 0 || amount > available) { setMessage('❌ Отменено.'); return; }
    
    var storage = getCastleStorage(CASTLE_ID);
    storage[key] -= amount;
    
    var remaining = amount;
    while (remaining > 0) {
        var stack = Math.min(remaining, 50);
        addToInventory(users[currentUser].game, { name: key, type: 'resource', resourceType: key, count: stack, quality: 'Обычное' });
        remaining -= stack;
    }
    
    saveData(); setMessage('✅ Забрано: ' + amount); updateMenu(); openCastleStorage();
}
function donateToStorage(index) {
    var g = users[currentUser].game;
    var storage = getCastleStorage(CASTLE_ID);
    if (index >= g.inventory.length) { setMessage('❌ Предмет не найден.'); return; }
    var item = g.inventory[index];
    if (!item.resourceType) { setMessage('❌ Это не ресурс.'); return; }
    var count = item.count || 1;
    var quality = item.quality || 'Обычное';
    
    var qualityKeys = ['iron','steel','planks','leather','hardenedLeather','wood'];
    if (qualityKeys.indexOf(item.resourceType) !== -1) {
        addQualityResource(storage, item.resourceType, quality, count);
    } else {
        storage[item.resourceType] = (storage[item.resourceType] || 0) + count;
    }
    
    g.inventory.splice(index, 1);
    saveData(); setMessage('✅ ' + item.name + ' ×' + count + ' на складе.'); updateMenu(); openCastleStorage();
}
function closeCastleStorage() { var m = document.getElementById('modal-storage'); if (m) m.classList.add('hide'); }
function closeCastleStorageQuality() { var m = document.getElementById('modal-storage-quality'); if (m) m.classList.add('hide'); }

// ============================================================
// АМБАР
// ============================================================
function openCastleGranary() {
    if (!checkBucklerAccess()) return;
    var g = users[currentUser].game;
    var granary = getCastleGranary(CASTLE_ID);
    
    var modal = document.getElementById('modal-granary') || (function(){
        var o = document.createElement('div'); o.id = 'modal-granary'; o.className = 'modal-overlay hide';
        o.onclick = function(e) { if (e.target === this) closeCastleGranary(); };
        o.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🌾 АМБАР</h3><button class="close-btn" onclick="closeCastleGranary()">✕</button></div><div id="modal-granary-content"></div></div>';
        document.body.appendChild(o); return o;
    })();
    
    var c = document.getElementById('modal-granary-content');
    var h = '<div class="modal-section"><h4>🌾 АМБАР ЗАМКА</h4>';
    var res = [
        {key:'wheat',name:'🌾 Пшеница'},{key:'vegetables',name:'🥕 Овощи'},{key:'fish',name:'🐟 Рыба'},
        {key:'water',name:'💧 Вода'},{key:'bread',name:'🍞 Хлеб'},{key:'meat',name:'🥩 Мясо'},
        {key:'cheese',name:'🧀 Сыр'},{key:'apple',name:'🍎 Яблоко'},{key:'milk',name:'🥛 Молоко'},
        {key:'ale',name:'🍺 Эль'},{key:'wine',name:'🍷 Вино'}
    ];
    res.forEach(function(r) {
        h += '<div class="row"><span class="label">'+r.name+': '+(granary[r.key]||0)+'</span><span class="value"><button class="btn btn-small" onclick="takeFromGranary(\''+r.key+'\','+(granary[r.key]||0)+')">📤</button></span></div>';
    });
    h += '</div>';
    
    h += '<div class="modal-section"><h4>📥 ПОЛОЖИТЬ ЕДУ</h4>';
    g.inventory.forEach(function(item, i) {
        if (item.type === 'food' || (item.effect && (item.effect.food || item.effect.thirst))) {
            h += '<div class="row"><span class="label">'+item.name+' ×'+(item.count||1)+'</span><span class="value"><button class="btn btn-small" onclick="donateToGranary('+i+')">📥</button></span></div>';
        }
    });
    h += '</div>';
    h += '<button class="btn btn-secondary" onclick="closeCastleGranary()">Закрыть</button>';
    c.innerHTML = h; modal.classList.remove('hide');
}
function donateToGranary(index) {
    var g = users[currentUser].game;
    var granary = getCastleGranary(CASTLE_ID);
    if (index >= g.inventory.length) { setMessage('❌ Предмет не найден.'); return; }
    var item = g.inventory[index];
    var key = item.name.replace(/[🍞🥩🐟🧀🍎💧🍺🍷🥛]/g,'').trim().toLowerCase();
    var map = {'хлеб':'bread','мясо':'meat','рыба':'fish','сыр':'cheese','яблоко':'apple','вода':'water','эль':'ale','вино':'wine','молоко':'milk'};
    key = map[key] || key;
    var count = item.count || 1;
    granary[key] = (granary[key] || 0) + count;
    g.inventory.splice(index, 1);
    saveData(); setMessage('✅ Положено в амбар.'); updateMenu(); openCastleGranary();
}
function takeFromGranary(key, available) {
    if (available <= 0) { setMessage('❌ Нет в наличии.'); return; }
    var g = users[currentUser].game;
    var granary = getCastleGranary(CASTLE_ID);
    var amount = parseInt(prompt('Сколько забрать? (доступно: ' + available + ')'));
    if (isNaN(amount) || amount <= 0 || amount > available) { setMessage('❌ Отменено.'); return; }
    granary[key] -= amount;
    
    var names = {wheat:'🌾 Пшеница',vegetables:'🥕 Овощи',fish:'🐟 Рыба',water:'💧 Вода',bread:'🍞 Хлеб',meat:'🥩 Мясо',cheese:'🧀 Сыр',apple:'🍎 Яблоко',milk:'🥛 Молоко',ale:'🍺 Эль',wine:'🍷 Вино'};
    var remaining = amount;
    while (remaining > 0) {
        var stack = Math.min(remaining, 50);
        addToInventory(g, { name: names[key] || key, type: 'food', count: stack, quality: 'Обычное' });
        remaining -= stack;
    }
    
    saveData(); setMessage('✅ Забрано: ' + amount); updateMenu(); openCastleGranary();
}
function closeCastleGranary() { var m = document.getElementById('modal-granary'); if (m) m.classList.add('hide'); }

// ============================================================
// ОРУЖЕЙНАЯ
// ============================================================
function openCastleArmory() {
    if (!checkBucklerAccess()) return;
    var armory = getCastleArmory(CASTLE_ID);
    
    var modal = document.getElementById('modal-armory') || (function(){
        var o = document.createElement('div'); o.id = 'modal-armory'; o.className = 'modal-overlay hide';
        o.onclick = function(e) { if (e.target === this) closeCastleArmory(); };
        o.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🗡️ ОРУЖЕЙНАЯ</h3><button class="close-btn" onclick="closeCastleArmory()">✕</button></div><div id="modal-armory-content"></div></div>';
        document.body.appendChild(o); return o;
    })();
    
    var c = document.getElementById('modal-armory-content');
    var h = '<div class="modal-section"><h4>🗡️ ОРУЖЕЙНАЯ ЗАМКА</h4>';
    h += '<div class="tabs" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;">';
    h += '<button class="tab-btn active" onclick="showArmoryTab(\'weapons\')">🗡️ Оружие ('+armory.weapons.length+')</button>';
    h += '<button class="tab-btn" onclick="showArmoryTab(\'armor\')">🛡️ Броня ('+armory.armor.length+')</button>';
    h += '<button class="tab-btn" onclick="showArmoryTab(\'soldierWeapons\')">⚔️ Солд. оружие ('+armory.soldierWeapons.length+')</button>';
    h += '<button class="tab-btn" onclick="showArmoryTab(\'soldierArmor\')">🛡️ Солд. броня ('+armory.soldierArmor.length+')</button>';
    h += '<button class="tab-btn" onclick="showArmoryTab(\'siegeWeapons\')">🏗️ Осадные (' + (armory.siegeWeapons ? armory.siegeWeapons.length : 0) + ')</button>';
    h += '<button class="tab-btn" onclick="showArmoryTab(\'donate\')">📥 Положить</button>';
    h += '</div><div id="armory-tab-content"></div>';
    h += '<button class="btn btn-secondary" onclick="closeCastleArmory()" style="margin-top:10px;">Закрыть</button>';
    c.innerHTML = h; modal.classList.remove('hide');
    showArmoryTab('weapons');
}
function showArmoryTab(tab) {
    var container = document.getElementById('armory-tab-content');
    if (!container) return;
    var armory = getCastleArmory(CASTLE_ID);
    var h = '';
    var titles = { weapons:'🗡️ Оружие', armor:'🛡️ Броня', soldierWeapons:'⚔️ Солдатское оружие', soldierArmor:'🛡️ Солдатская броня', siegeWeapons:'🏗️ Осадные орудия' };
    
    if (tab === 'donate') {
        var g = users[currentUser].game;
        h += '<h4>📥 ПОЛОЖИТЬ В ОРУЖЕЙНУЮ</h4>';
        var hasItems = false;
        g.inventory.forEach(function(item, i) {
            if (isEquippable(item) || (item.type === 'siege')) {
                hasItems = true;
                h += '<div class="row"><span class="label">'+item.name+' ('+(item.quality||'Обычное')+')</span><span class="value"><button class="btn btn-small" onclick="donateToArmory('+i+')">📥</button></span></div>';
            }
        });
        if (!hasItems) h += '<p style="color:#6a5a48;">Нет предметов для передачи.</p>';
    } else if (tab === 'siegeWeapons') {
        var items = armory.siegeWeapons || [];
        h += '<h4>🏗️ Осадные орудия (' + items.length + ' шт.)</h4>';
        if (items.length === 0) h += '<p style="color:#6a5a48;">Пусто.</p>';
        else {
            var grouped = {};
            items.forEach(function(item) { var k = item.name; if (!grouped[k]) grouped[k] = {item:item,count:0}; grouped[k].count++; });
            for (var k in grouped) {
                h += '<div class="row"><span class="label">' + grouped[k].item.name + '</span><span class="value">×' + grouped[k].count + ' <button class="btn btn-small" onclick="takeSiegeFromArmory(\'' + k + '\')">📤</button></span></div>';
            }
        }
    } else {
        var items = armory[tab] || [];
        h += '<h4>'+titles[tab]+' ('+items.length+' шт.)</h4>';
        if (items.length === 0) h += '<p style="color:#6a5a48;">Пусто.</p>';
        else {
            var grouped = {};
            items.forEach(function(item) { var k = item.name + '|' + (item.quality||'Обычное'); if (!grouped[k]) grouped[k] = {item:item,count:0}; grouped[k].count++; });
            for (var k in grouped) {
                h += '<div class="row"><span class="label">'+grouped[k].item.name+' ('+(grouped[k].item.quality||'Обычное')+')</span><span class="value">×'+grouped[k].count+'</span></div>';
            }
        }
    }
    container.innerHTML = h;
}
function takeSiegeFromArmory(name) {
    var armory = getCastleArmory(CASTLE_ID);
    var g = users[currentUser].game;
    
    var amount = parseInt(prompt('Сколько забрать?'));
    if (isNaN(amount) || amount <= 0) { setMessage('❌ Отменено.'); return; }
    
    var taken = 0;
    for (var i = armory.siegeWeapons.length - 1; i >= 0; i--) {
        if (armory.siegeWeapons[i].name === name && taken < amount) {
            var item = armory.siegeWeapons.splice(i, 1)[0];
            addToInventory(g, item);
            taken++;
        }
    }
    
    if (taken > 0) {
        saveData(); setMessage('✅ Забрано: ' + taken + ' ' + name); updateMenu();
    } else {
        setMessage('❌ Не найдено.');
    }
    showArmoryTab('siegeWeapons');
}
function donateToArmory(index) {
    var g = users[currentUser].game;
    var armory = getCastleArmory(CASTLE_ID);
    if (index >= g.inventory.length) { setMessage('❌ Предмет не найден.'); return; }
    var item = g.inventory.splice(index, 1)[0];
    
    if (item.type === 'siege') {
        if (!armory.siegeWeapons) armory.siegeWeapons = [];
        armory.siegeWeapons.push(item);
    } else {
        var cat = 'weapons';
        if (item.armorClass === 'leather' || item.armorClass === 'plate') cat = 'armor';
        armory[cat].push(item);
    }
    saveData(); setMessage('✅ ' + item.name + ' перемещён в оружейную.'); updateMenu(); showArmoryTab('donate');
}
function closeCastleArmory() { var m = document.getElementById('modal-armory'); if (m) m.classList.add('hide'); }

// ============================================================
// КАЗАРМА
// ============================================================
function getAvailablePeasants() { return 0; }

function openCastleBarracks() {
    if (!checkBucklerAccess()) return;
    var house = HOUSES[CASTLE_ID];
    if (!house) { setMessage('❌ Дом не найден.'); return; }
    
    var garrison = getCastleGarrison(CASTLE_ID);
    var armory = getCastleArmory(CASTLE_ID);
    var stable = getCastleStable(CASTLE_ID);
    var peasants = getAvailablePeasants();
    
    var modal = document.getElementById('modal-barracks') || (function(){
        var o = document.createElement('div'); o.id = 'modal-barracks'; o.className = 'modal-overlay hide';
        o.onclick = function(e) { if (e.target === this) closeCastleBarracks(); };
        o.innerHTML = '<div class="modal-box" style="max-height:90vh;overflow-y:auto;"><div class="modal-header"><h3>⚔️ КАЗАРМЫ</h3><button class="close-btn" onclick="closeCastleBarracks()">✕</button></div><div id="modal-barracks-content"></div></div>';
        document.body.appendChild(o); return o;
    })();
    
    var c = document.getElementById('modal-barracks-content');
    
    var h = '<div class="modal-section"><h4>📊 РЕСУРСЫ ДОМА</h4>';
    h += '<div style="color:#b8a890;font-size:13px;">';
    h += '👨‍🌾 Крестьяне: <strong>' + peasants + '</strong><br>';
    h += '💰 Казна: <strong>' + (house.treasury || 0) + ' зол.</strong><br>';
    h += '🗡️ Оружие: <strong>' + (armory.soldierWeapons.length + armory.weapons.length) + '</strong><br>';
    h += '🛡️ Брони: <strong>' + (armory.soldierArmor.length + armory.armor.length) + '</strong><br>';
    h += '🐴 Лошадей: <strong>' + stable.shared.length + '</strong><br>';
    h += '🏗️ Осадных орудий: <strong>' + (armory.siegeWeapons ? armory.siegeWeapons.length : 0) + '</strong>';
    h += '</div></div>';
    
    var totalGarrison = garrison.infantry.length + garrison.cavalry.length + garrison.siege.length;
    h += '<div class="modal-section"><h4>⚔️ ГАРНИЗОН (' + totalGarrison + ' чел.)</h4>';
    if (totalGarrison === 0) {
        h += '<p style="color:#6a5a48;">Гарнизон пуст.</p>';
    } else {
        var grouped = {};
        garrison.infantry.forEach(function(u) { if (!grouped[u.type]) grouped[u.type] = 0; grouped[u.type]++; });
        garrison.cavalry.forEach(function(u) { if (!grouped[u.type]) grouped[u.type] = 0; grouped[u.type]++; });
        garrison.siege.forEach(function(u) { if (!grouped[u.type]) grouped[u.type] = 0; grouped[u.type]++; });
        for (var k in grouped) {
            var ut = UNIT_TYPES[k];
            var name = ut ? ut.emoji + ' ' + ut.name : k;
            h += '<div class="row"><span class="label">' + name + '</span><span class="value">×' + grouped[k] + '</span></div>';
        }
    }
    h += '</div>';
    
    h += '<div class="modal-section"><h4>🗡️ НАЙМ ПЕХОТЫ</h4>';
    ['light_swordsman','heavy_swordsman','light_spearman','heavy_spearman','archer','crossbowman'].forEach(function(type) {
        h += buildRecruitRow(type, peasants, stable, house);
    });
    h += '</div>';
    
    h += '<div class="modal-section"><h4>🐴 НАЙМ КОННИЦЫ</h4>';
    ['rider','heavy_rider','knight'].forEach(function(type) {
        h += buildRecruitRow(type, peasants, stable, house);
    });
    h += '</div>';
    
    h += '<div class="modal-section"><h4>🏗️ НАЙМ ОСАДНЫХ ОРУДИЙ</h4>';
    h += '<p style="color:#6a5a48;font-size:11px;">Требуется орудие в оружейной + крестьяне + золото.</p>';
    
    var siegeWeapons = armory.siegeWeapons || [];
    if (siegeWeapons.length === 0) {
        h += '<p style="color:#c96a5a;">Нет осадных орудий в оружейной.</p>';
    } else {
        var siegeGrouped = {};
        siegeWeapons.forEach(function(item) {
            var k = item.siegeType;
            if (!siegeGrouped[k]) siegeGrouped[k] = 0;
            siegeGrouped[k]++;
        });
        for (var sk in siegeGrouped) {
            var sw = SIEGE_WEAPONS[sk];
            var crewNeeded = SIEGE_CREW_REQUIREMENTS[sk] || 1;
            var canAfford = peasants >= crewNeeded && (house.treasury || 0) >= 20;
            h += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
            h += '<span class="label">' + sw.name + '<br><span style="font-size:10px;color:#6a5a48;">👨‍🌾' + crewNeeded + ' чел. 💰20 зол.</span></span>';
            h += '<span class="value">×' + siegeGrouped[sk];
            if (canAfford) h += ' <button class="btn btn-small" onclick="recruitSiegeCrew(\'' + sk + '\')">✅ Нанять</button>';
            else h += ' <span style="color:#c96a5a;font-size:11px;">Нет ресурсов</span>';
            h += '</span></div>';
        }
    }
    h += '</div>';
    
    h += '<button class="btn btn-secondary" onclick="closeCastleBarracks()" style="margin-top:10px;">Закрыть</button>';
    c.innerHTML = h; modal.classList.remove('hide');
}
function buildRecruitRow(type, peasants, stable, house) {
    var ut = UNIT_TYPES[type];
    var cost = UNIT_COSTS[type];
    if (!ut || !cost) return '';
    
    var canAffordGold = (house.treasury || 0) >= cost.gold;
    var canAffordPeasants = peasants >= cost.peasants;
    var hasHorse = true;
    if (cost.horse) {
        hasHorse = false;
        for (var i = 0; i < stable.shared.length; i++) {
            if (stable.shared[i].horseType === cost.horse) { hasHorse = true; break; }
        }
    }
    var canRecruit = canAffordGold && canAffordPeasants && hasHorse;
    
    var reqText = '💰' + cost.gold + ' зол. 👨‍🌾' + cost.peasants;
    if (cost.horse) reqText += ' 🐴';
    
    var h = '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
    h += '<span class="label">' + ut.emoji + ' ' + ut.name + '<br><span style="font-size:10px;color:#6a5a48;">' + reqText + '</span></span>';
    h += '<span class="value">';
    if (canRecruit) h += '<button class="btn btn-small" onclick="recruitUnit(\'' + type + '\')">✅ Нанять</button>';
    else {
        var reasons = [];
        if (!canAffordGold) reasons.push('💰');
        if (!canAffordPeasants) reasons.push('👨‍🌾');
        if (!hasHorse) reasons.push('🐴');
        h += '<span style="color:#c96a5a;font-size:11px;">Нет: ' + reasons.join(' ') + '</span>';
    }
    h += '</span></div>';
    return h;
}
function recruitUnit(type) {
    if (!checkBucklerAccess()) return;
    var ut = UNIT_TYPES[type];
    var cost = UNIT_COSTS[type];
    if (!ut || !cost) { setMessage('❌ Неизвестный тип войск.'); return; }
    
    var house = HOUSES[CASTLE_ID];
    var garrison = getCastleGarrison(CASTLE_ID);
    var stable = getCastleStable(CASTLE_ID);
    var peasants = getAvailablePeasants();
    
    if ((house.treasury || 0) < cost.gold) { setMessage('❌ Недостаточно золота в казне.'); return; }
    if (peasants < cost.peasants) { setMessage('❌ Недостаточно крестьян.'); return; }
    if (cost.horse) {
        var horseIdx = -1;
        for (var i = 0; i < stable.shared.length; i++) {
            if (stable.shared[i].horseType === cost.horse) { horseIdx = i; break; }
        }
        if (horseIdx === -1) { setMessage('❌ Нет нужной лошади в общаке.'); return; }
        stable.shared.splice(horseIdx, 1);
    }
    
    house.treasury -= cost.gold;
    
    var unit = { type: type, name: ut.name, emoji: ut.emoji, recruitedAt: Date.now() };
    if (ut.horse) garrison.cavalry.push(unit);
    else garrison.infantry.push(unit);
    
    saveData();
    setMessage('✅ ' + ut.emoji + ' ' + ut.name + ' нанят!');
    addHouseLog(CASTLE_ID, '⚔️ Нанят ' + ut.name);
    openCastleBarracks();
}
function recruitSiegeCrew(siegeType) {
    if (!checkBucklerAccess()) return;
    var sw = SIEGE_WEAPONS[siegeType];
    if (!sw) { setMessage('❌ Орудие не найдено.'); return; }
    
    var house = HOUSES[CASTLE_ID];
    var garrison = getCastleGarrison(CASTLE_ID);
    var armory = getCastleArmory(CASTLE_ID);
    var peasants = getAvailablePeasants();
    var crewNeeded = SIEGE_CREW_REQUIREMENTS[siegeType] || 1;
    var goldCost = 20;
    
    if ((house.treasury || 0) < goldCost) { setMessage('❌ Недостаточно золота.'); return; }
    if (peasants < crewNeeded) { setMessage('❌ Недостаточно крестьян. Нужно ' + crewNeeded + '.'); return; }
    
    var siegeIdx = -1;
    for (var i = 0; i < armory.siegeWeapons.length; i++) {
        if (armory.siegeWeapons[i].siegeType === siegeType) { siegeIdx = i; break; }
    }
    if (siegeIdx === -1) { setMessage('❌ Нет такого орудия в оружейной.'); return; }
    armory.siegeWeapons.splice(siegeIdx, 1);
    
    house.treasury -= goldCost;
    
    var unit = { type: 'siege_' + siegeType, name: sw.name, emoji: sw.name.split(' ')[0], siegeType: siegeType, recruitedAt: Date.now(), siege: true };
    garrison.siege.push(unit);
    
    saveData();
    setMessage('✅ ' + sw.name + ' нанят! (' + crewNeeded + ' чел.)');
    addHouseLog(CASTLE_ID, '🏗️ Нанят расчёт ' + sw.name);
    openCastleBarracks();
}
function closeCastleBarracks() { var m = document.getElementById('modal-barracks'); if (m) m.classList.add('hide'); }

// ============================================================
// ОСТАЛЬНЫЕ ЗДАНИЯ
// ============================================================
function openCastleDonjon() { if (!checkBucklerAccess()) return; setMessage('🗼 Вы в донжоне. Лорд Баклеров приветствует вас.'); }
function openCastleTraining() { if (!checkBucklerAccess()) return; setMessage('🎯 Тренировочная площадка. Пока недоступна.'); }
function openCastleMarket() { setMessage('🏪 Замковый рынок. Пока недоступен.'); }
function openCastleDungeon() { if (!checkBucklerAccess()) return; setMessage('⛓️ Темница замка. Пока недоступна.'); }

// ============================================================
// КАРТА ЗАМКА
// ============================================================
function openCastleMap() {
    var g = users[currentUser].game;
    var modal = document.getElementById('modal-map');
    var content = document.getElementById('modal-map-content');
    var h = '<div class="modal-section"><h4>🏰 Бронзовый Щит</h4></div><div class="modal-section">';
    CASTLE_BUILDINGS.forEach(function(b) {
        var isCurrent = b.id === g.location.place;
        h += '<div class="row"><span class="label">'+b.label+(isCurrent?' ⭐':'')+'</span>';
        h += '<span class="value">'+(isCurrent?'<span style="color:#6a5a48;">Вы здесь</span>':'<button class="btn btn-small" onclick="goToCastleBuilding(\''+b.id+'\')">🚶 Идти</button>')+'</span></div>';
    });
    h += '</div><button class="btn" onclick="document.getElementById(\'modal-map\').classList.add(\'hide\')">Закрыть</button>';
    content.innerHTML = h; modal.classList.remove('hide');
}
function goToCastleBuilding(building) {
    var g = users[currentUser].game;
    if (isBusy) { setMessage('⏳ Вы заняты.'); return; }
    if (building === g.location.place) { setMessage('📍 Вы уже здесь.'); return; }
    if (!CASTLE_BUILDINGS.some(function(b){return b.id===building})) { setMessage('❌ Здание не найдено.'); return; }
    g.location.place = building; g.location.location = 'Бронзовый Щит';
    document.getElementById('modal-map').classList.add('hide');
    updateMenu(); updateStory(); updateActions(); saveData();
}

// ============================================================
// STORY / ACTIONS
// ============================================================
window.updateStory = function() {
    var g = users[currentUser].game;
    var place = g.location.place;
    if (!CASTLE_BUILDINGS.some(function(b){return b.id===place})) { if (typeof _castlePrevUpdateStory==='function') return _castlePrevUpdateStory(); return; }
    document.getElementById('story-title').textContent = '🏰 Бронзовый Щит';
    var texts = { castle_gate:'🚪 Ворота замка.', castle_donjon:'🗼 Донжон.', castle_barracks:'⚔️ Казармы.', castle_training:'🎯 Тренировочная площадка.', castle_workshop:'🛠️ Мастерская.', castle_forge:'⚒️ Кузница.', castle_granary:'🌾 Амбар.', castle_storage:'📦 Склад.', castle_armory:'🗡️ Оружейная.', castle_stable:'🐴 Конюшня.', castle_market:'🏪 Рынок.', castle_tavern:'🍺 Таверна.', castle_dungeon:'⛓️ Темница.' };
    document.getElementById('story-text').textContent = texts[place] || '';
    if (typeof updateActions==='function') updateActions();
};
window.updateActions = function() {
    var g = users[currentUser].game;
    var place = g.location.place;
    var container = document.getElementById('actions-container');
    if (!container) return;
    if (!CASTLE_BUILDINGS.some(function(b){return b.id===place})) { if (typeof _castlePrevUpdateActions==='function') return _castlePrevUpdateActions(); return; }
    
    container.innerHTML = '';
    var actions = [];
    if (place==='castle_gate') actions.push({id:'leave_buckler_castle',label:'🚪 Выйти из замка'});
    if (place==='castle_donjon') actions.push({id:'donjon_open',label:'🗼 Донжон'});
    if (place==='castle_barracks') actions.push({id:'barracks_open',label:'⚔️ Казармы'});
    if (place==='castle_training') actions.push({id:'training_open',label:'🎯 Тренировка'});
    if (place==='castle_workshop') actions.push({id:'workshop_open',label:'🛠️ Производство'});
    if (place==='castle_forge') actions.push({id:'castle_forge_craft',label:'⚒️ Ковка'});
    if (place==='castle_granary') actions.push({id:'granary_open',label:'🌾 Амбар'});
    if (place==='castle_storage') actions.push({id:'storage_open',label:'📦 Склад'});
    if (place==='castle_armory') actions.push({id:'armory_open',label:'🗡️ Оружейная'});
    if (place==='castle_stable') actions.push({id:'stable_open',label:'🐴 Конюшня'});
    if (place==='castle_market') actions.push({id:'market_open',label:'🏪 Рынок'});
    if (place==='castle_tavern') actions.push({id:'tavern_open',label:'🍺 Таверна'});
    if (place==='castle_dungeon') actions.push({id:'dungeon_open',label:'⛓️ Темница'});
    actions.push({id:'castle_map',label:'🗺️ Карта замка'});
    actions.push({id:'inventory',label:'🎒 Инвентарь'});
    actions.push({id:'character',label:'👤 Персонаж'});
    actions.push({id:'menu',label:'📋 Меню'});
    
    actions.forEach(function(a) {
        var btn = document.createElement('button'); btn.className='btn-game'; btn.textContent=a.label;
        btn.onclick = function() {
            if (a.id==='castle_map') openCastleMap();
            else if (a.id==='leave_buckler_castle') { g.location.place='bl_-1_0'; g.location.location='Владения Баклеров'; g.location.locationId='bl_-1_0'; g.location.parentZone=null; setMessage('🚪 Вы вышли из замка.'); updateMenu(); updateStory(); updateActions(); saveData(); }
            else if (a.id==='castle_forge_craft') { if (!checkBucklerAccess()) return; if (typeof openCraftMenu==='function') openCraftMenu(); }
            else if (a.id==='stable_open') openCastleStable();
            else if (a.id==='workshop_open') openCastleWorkshop();
            else if (a.id==='storage_open') openCastleStorage();
            else if (a.id==='granary_open') openCastleGranary();
            else if (a.id==='armory_open') openCastleArmory();
            else if (a.id==='tavern_open') openCastleTavern();
            else if (a.id==='barracks_open') openCastleBarracks();
            else if (a.id==='donjon_open') openCastleDonjon();
            else if (a.id==='training_open') openCastleTraining();
            else if (a.id==='market_open') openCastleMarket();
            else if (a.id==='dungeon_open') openCastleDungeon();
            else if (typeof gameAction==='function') gameAction(a.id);
        };
        container.appendChild(btn);
    });
};
window.enterBucklerCastle = function() {
    var g = users[currentUser].game;
    g.location.place = 'castle_gate'; g.location.location = 'Бронзовый Щит'; g.location.parentZone = null;
    setMessage('🏰 Вы вошли в замок Бронзовый Щит.');
    updateMenu(); updateStory(); updateActions(); saveData();
};

// ============================================================
// РЕГИСТРАЦИЯ
// ============================================================
window.openCastleMap = openCastleMap;
window.goToCastleBuilding = goToCastleBuilding;
window.enterBucklerCastle = enterBucklerCastle;
window.openCastleTavern = openCastleTavern;
window.closeCastleTavern = closeCastleTavern;
window.openCastleStable = openCastleStable;
window.closeCastleStable = closeCastleStable;
window.stablePersonalHorse = stablePersonalHorse;
window.takePersonalHorse = takePersonalHorse;
window.donateHorseToShared = donateHorseToShared;
window.openCastleWorkshop = openCastleWorkshop;
window.closeCastleWorkshop = closeCastleWorkshop;
window.openSiegeCraft = openSiegeCraft;
window.closeSiegeCraft = closeSiegeCraft;
window.queueSiegeItem = queueSiegeItem;
window.openCastleStorage = openCastleStorage;
window.closeCastleStorage = closeCastleStorage;
window.openCastleGranary = openCastleGranary;
window.closeCastleGranary = closeCastleGranary;
window.openCastleArmory = openCastleArmory;
window.closeCastleArmory = closeCastleArmory;
window.takeSiegeFromArmory = takeSiegeFromArmory;
window.donateToArmory = donateToArmory;
window.donateToStorage = donateToStorage;
window.queueWorkshopItem = queueWorkshopItem;
window.cancelQueueItem = cancelQueueItem;
window.openCastleBarracks = openCastleBarracks;
window.closeCastleBarracks = closeCastleBarracks;
window.recruitUnit = recruitUnit;
window.recruitSiegeCrew = recruitSiegeCrew;

processWorkshopQueue();
console.log('🏰 Замок Бронзовый Щит загружен!');

// ============================================================
// js/regions/stormlands/castles/buckler_castle.js
// ЗАМОК БРОНЗОВЫЙ ЩИТ — ПОЛНАЯ ЛОГИКА
// ============================================================

var _castlePrevUpdateStory = window.updateStory;
var _castlePrevUpdateActions = window.updateActions;

// Глобальные хранилища
if (!window._castleStorages) window._castleStorages = {};
if (!window._castleGranaries) window._castleGranaries = {};
if (!window._castleArmories) window._castleArmories = {};
if (!window._castleQueues) window._castleQueues = {};
if (!window._castleHorseLimits) window._castleHorseLimits = {};

function getCastleStorage(castleId) {
    if (!window._castleStorages[castleId]) {
        window._castleStorages[castleId] = { iron: {}, coal: 0, steel: {}, planks: {}, leather: {}, hardenedLeather: {}, stone: 0, wood: {}, salt: 0, valyrian_ore: 0, valyrian_steel: 0 };
    }
    return window._castleStorages[castleId];
}

function getCastleGranary(castleId) {
    if (!window._castleGranaries[castleId]) {
        window._castleGranaries[castleId] = { wheat: 0, vegetables: 0, fish: 0, water: 0, bread: 0, meat: 0, cheese: 0, apple: 0, milk: 0, ale: 0, wine: 0 };
    }
    return window._castleGranaries[castleId];
}

function getCastleArmory(castleId) {
    if (!window._castleArmories[castleId]) {
        window._castleArmories[castleId] = { weapons: [], armor: [], soldierWeapons: [], soldierArmor: [] };
    }
    return window._castleArmories[castleId];
}

function getCastleQueue(castleId) {
    if (!window._castleQueues[castleId]) window._castleQueues[castleId] = [];
    return window._castleQueues[castleId];
}

function getCastleHorseLimits(castleId) {
    if (!window._castleHorseLimits[castleId]) {
        window._castleHorseLimits[castleId] = {
            war: { total: 50, sold: 0, resetTime: Date.now() + 7 * 24 * 60 * 60 * 1000 },
            heavy: { total: 30, sold: 0, resetTime: Date.now() + 7 * 24 * 60 * 60 * 1000 }
        };
    }
    var limits = window._castleHorseLimits[castleId];
    var now = Date.now();
    if (now > limits.war.resetTime) { limits.war.sold = 0; limits.war.resetTime = now + 7 * 24 * 60 * 60 * 1000; }
    if (now > limits.heavy.resetTime) { limits.heavy.sold = 0; limits.heavy.resetTime = now + 7 * 24 * 60 * 60 * 1000; }
    return limits;
}

// Функции для работы с качественными ресурсами
function addQualityResource(storageObj, key, quality, count) {
    if (!storageObj[key]) storageObj[key] = {};
    if (!storageObj[key][quality]) storageObj[key][quality] = 0;
    storageObj[key][quality] += count;
}

function removeQualityResource(storageObj, key, quality, count) {
    if (!storageObj[key] || !storageObj[key][quality] || storageObj[key][quality] < count) return false;
    storageObj[key][quality] -= count;
    if (storageObj[key][quality] <= 0) delete storageObj[key][quality];
    return true;
}

function getQualityResourceCount(storageObj, key, quality) {
    if (!storageObj[key] || !storageObj[key][quality]) return 0;
    return storageObj[key][quality];
}

function getTotalQualityResource(storageObj, key) {
    if (!storageObj[key]) return 0;
    var total = 0;
    for (var q in storageObj[key]) total += storageObj[key][q];
    return total;
}

function isBucklerMember() {
    var user = users[currentUser];
    return user && user.game && user.game.house === 'buckler';
}

function checkBucklerAccess() {
    if (!isBucklerMember()) {
        setMessage('❌ Только для членов дома Баклеров.');
        return false;
    }
    return true;
}

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

// ============================================================
// ТАВЕРНА
// ============================================================

function openCastleTavern() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    
    var modal = document.getElementById('modal-tavern');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-tavern'; overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeTavern(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🍺 ТАВЕРНА ЗАМКА</h3><button class="close-btn" onclick="closeTavern()">✕</button></div><div id="modal-tavern-content"></div></div>';
        document.body.appendChild(overlay); modal = overlay;
    }
    
    var content = document.getElementById('modal-tavern-content');
    var html = '<div class="modal-section"><h4>🍺 ТАВЕРНА БРОНЗОВОГО ЩИТА</h4>';
    html += '<p style="color:#6a5a48;">💰 ' + formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper) + '</p></div>';
    
    html += '<div class="modal-section"><h4>🍞 ЕДА</h4>';
    [{name:'🍞 Хлеб',price:5,food:20},{name:'🥩 Мясо',price:10,food:30},{name:'🐟 Рыба',price:8,food:25},{name:'🧀 Сыр',price:7,food:22},{name:'🍎 Яблоко',price:3,food:15}].forEach(function(item){
        html += '<div class="row"><span class="label">'+item.name+'</span><span class="value">'+formatCurrency(item.price)+' <button class="btn btn-small" onclick="buyTavernItem(\''+item.name+'\','+item.price+','+item.food+',0)">Купить</button></span></div>';
    });
    html += '</div>';
    
    html += '<div class="modal-section"><h4>🍺 НАПИТКИ</h4>';
    [{name:'💧 Вода',price:2,food:0,thirst:15},{name:'🍺 Эль',price:5,food:0,thirst:10},{name:'🍷 Вино',price:8,food:0,thirst:15},{name:'🥛 Молоко',price:4,food:10,thirst:10}].forEach(function(item){
        html += '<div class="row"><span class="label">'+item.name+'</span><span class="value">'+formatCurrency(item.price)+' <button class="btn btn-small" onclick="buyTavernItem(\''+item.name+'\','+item.price+','+item.food+','+item.thirst+')">Купить</button></span></div>';
    });
    html += '</div>';
    
    html += '<div class="modal-section"><h4>🛏️ ОТДЫХ</h4>';
    html += '<div class="row"><span class="label">Отдохнуть (10 МП)</span><span class="value"><button class="btn btn-small" onclick="restInTavern()">🛏️ Отдых</button></span></div></div>';
    
    html += '<button class="btn btn-secondary" onclick="closeTavern()" style="margin-top:10px;">Закрыть</button>';
    content.innerHTML = html; modal.classList.remove('hide');
}

function buyTavernItem(name, price, food, thirst) {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    if (!spendMoney(g, price)) { setMessage('❌ Недостаточно денег!'); return; }
    if (food > 0) g.food = Math.min(100, g.food + food);
    if (thirst > 0) g.thirst = Math.min(100, g.thirst + thirst);
    saveData(); setMessage('✅ Куплено: ' + name); updateMenu(); openCastleTavern();
}

function restInTavern() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    if (!spendMoney(g, 10)) { setMessage('❌ Недостаточно денег!'); return; }
    g.fatigue = Math.min(100, g.fatigue + 30);
    g.hp = Math.min(g.maxHp, g.hp + 15);
    saveData(); setMessage('🛏️ Вы отдохнули.'); updateMenu(); openCastleTavern();
}

function closeTavern() { var m = document.getElementById('modal-tavern'); if (m) m.classList.add('hide'); }

// ============================================================
// КОНЮШНЯ
// ============================================================

function openCastleStable() {
    if (!checkBucklerAccess()) return;
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    
    var modal = document.getElementById('modal-stable');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-stable'; overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeStable(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🐴 ЗАМКОВАЯ КОНЮШНЯ</h3><button class="close-btn" onclick="closeStable()">✕</button></div><div id="modal-stable-content"></div></div>';
        document.body.appendChild(overlay); modal = overlay;
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
            html += '<button class="btn btn-danger" onclick="sellCastleHorse(); closeStable();" style="margin-top:8px;">💰 Продать лошадь</button>';
            html += '</div>';
        }
    } else {
        html += '<p style="color:#6a5a48;text-align:center;padding:10px 0;">🐴 У вас нет лошади.</p>';
    }
    
    html += '<h4 style="color:#c9b694;margin-top:16px;">📦 БОЕВЫЕ ЛОШАДИ (-50% цены, для Баклеров)</h4>';
    
    var limits = getCastleHorseLimits(CASTLE_ID);
    var now = Date.now();
    
    var castleHorses = [
        { type: 'war', name: HORSE_TYPES['war'].name, emoji: '⚔️', price: Math.floor(HORSE_TYPES['war'].price * 0.5), limit: limits.war },
        { type: 'heavy', name: HORSE_TYPES['heavy'].name, emoji: '🛡️', price: Math.floor(HORSE_TYPES['heavy'].price * 0.5), limit: limits.heavy }
    ];
    
    castleHorses.forEach(function(h) {
        var available = h.limit.total - h.limit.sold;
        var isOwned = g.equipment && g.equipment.horse && g.equipment.horse.horseType === h.type;
        var canBuy = !g.equipment || !g.equipment.horse;
        var timeLeft = Math.ceil((h.limit.resetTime - now) / (24 * 60 * 60 * 1000));
        
        html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #1a1410;">';
        html += '<div>' + h.emoji + ' <strong>' + h.name + '</strong>';
        html += '<br><span style="font-size:11px;color:#6a5a48;">Доступно: ' + available + '/' + h.limit.total + ' | Сброс: ' + timeLeft + ' дн.</span>';
        if (isOwned) html += ' <span style="color:#7ac98a;">✅ Ваша</span>';
        html += '</div><div style="text-align:right;">';
        if (isOwned) html += '<span style="color:#7ac98a;">Уже куплена</span>';
        else if (canBuy && available > 0) html += formatCurrency(h.price * 210 * 56) + ' <button class="btn btn-small" onclick="buyCastleHorse(\'' + h.type + '\',' + h.price + '); closeStable();">✅</button>';
        else if (available <= 0) html += '<span style="color:#c96a5a;">Распродано</span>';
        else html += '<span style="color:#c96a5a;">Продайте текущую</span>';
        html += '</div></div>';
    });
    
    content.innerHTML = html; modal.classList.remove('hide');
}

function buyCastleHorse(type, price) {
    if (!checkBucklerAccess()) return;
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
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

function sellCastleHorse() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    if (!g.equipment || !g.equipment.horse) { setMessage('❌ У вас нет лошади.'); return; }
    var horseType = HORSE_TYPES[g.equipment.horse.horseType];
    if (!horseType) { setMessage('❌ Лошадь не найдена.'); return; }
    var refund = Math.floor(horseType.price * 0.3);
    g.copper += refund * 210 * 56; convertCurrency(g); g.equipment.horse = null;
    saveData(); setMessage('💰 Вы продали лошадь за ' + formatCurrency(refund * 210 * 56)); updateMenu();
}

function closeStable() { var m = document.getElementById('modal-stable'); if (m) m.classList.add('hide'); }

// ============================================================
// МАСТЕРСКАЯ
// ============================================================

function openCastleWorkshop() {
    if (!checkBucklerAccess()) return;
    var storage = getCastleStorage(CASTLE_ID);
    var queue = getCastleQueue(CASTLE_ID);
    var armory = getCastleArmory(CASTLE_ID);
    
    var modal = document.getElementById('modal-workshop');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-workshop'; overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeWorkshop(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🛠️ МАСТЕРСКАЯ</h3><button class="close-btn" onclick="closeWorkshop()">✕</button></div><div id="modal-workshop-content"></div></div>';
        document.body.appendChild(overlay); modal = overlay;
    }
    
    var content = document.getElementById('modal-workshop-content');
    var totalArmory = armory.weapons.length + armory.armor.length + armory.soldierWeapons.length + armory.soldierArmor.length;
    var totalIron = getTotalQualityResource(storage, 'iron');
    var totalSteel = getTotalQualityResource(storage, 'steel');
    var totalPlanks = getTotalQualityResource(storage, 'planks');
    
    var html = '<div class="modal-section"><h4>🛠️ МАСТЕРСКАЯ ЗАМКА</h4>';
    html += '<p style="color:#6a5a48;font-size:11px;">⚒️ Кузница: ✅ | 🪡 Кожевня: ❌ | 🪵 Плотник: ❌</p>';
    html += '<p style="color:#6a5a48;font-size:11px;">📦 Руда:' + totalIron + ' Уголь:' + storage.coal + ' Сталь:' + totalSteel + ' Доски:' + totalPlanks + '</p>';
    html += '<p style="color:#6a5a48;font-size:11px;">🗡️ Оружейная: ' + totalArmory + ' предм.</p>';
    
    if (queue.length > 0) {
        html += '<p style="color:#ffd700;font-size:11px;">⏳ Очередь: ' + queue.length + '/10</p>';
        queue.forEach(function(q, i) {
            html += '<div style="font-size:10px;color:#b8a890;">' + (i+1) + '. ' + q.name + ' — ' + q.timeLeft + ' мин ';
            html += '<button class="btn btn-small" style="background:#3d2a1a;font-size:9px;" onclick="cancelQueueItem(' + i + ')">❌</button></div>';
        });
    }
    html += '</div>';
    
    html += '<div class="modal-section"><h4>⚒️ РЕСУРСЫ</h4>';
    html += '<div class="row"><span class="label">Сталь (2 руды + 1 уголь)</span><span class="value"><button class="btn btn-small" onclick="queueWorkshopItem(\'steel\')">🔨 1ч</button></span></div>';
    html += '</div>';
    
    html += '<div class="modal-section"><h4>🗡️ ОРУЖИЕ (Кузница)</h4>';
    [{id:'sword',name:'Меч солдата',steel:3,planks:0},{id:'spear',name:'Копьё солдата',steel:1,planks:2},{id:'shield',name:'Щит солдата',steel:6,planks:0}].forEach(function(w){
        var c = w.steel+' стали' + (w.planks>0?' + '+w.planks+' досок':'');
        html += '<div class="row"><span class="label">'+w.name+' ('+c+')</span><span class="value"><button class="btn btn-small" onclick="queueWorkshopItem(\''+w.id+'\')">🔨 1ч</button></span></div>';
    });
    html += '</div>';
    
    html += '<div class="modal-section"><h4>🛡️ ЛАТНАЯ БРОНЯ</h4>';
    html += '<div class="row"><span class="label">Комплект латной брони (12 стали)</span><span class="value"><button class="btn btn-small" onclick="queueWorkshopItem(\'plate_armor\')">🔨 1ч</button></span></div>';
    html += '</div>';
    
    html += '<p style="color:#c96a5a;font-size:11px;">❌ Кожевня и Плотник отсутствуют.</p>';
    html += '<button class="btn btn-secondary" onclick="closeWorkshop()" style="margin-top:10px;">Закрыть</button>';
    content.innerHTML = html; modal.classList.remove('hide');
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
    
    // Проверка ресурсов (используем обычное качество для крафта)
    var totalIron = getTotalQualityResource(storage, 'iron');
    var totalSteel = getTotalQualityResource(storage, 'steel');
    var totalPlanks = getTotalQualityResource(storage, 'planks');
    
    if (totalIron < needsIron || storage.coal < needsCoal || totalSteel < needsSteel || totalPlanks < needsPlanks) {
        setMessage('❌ Недостаточно ресурсов на складе.'); return;
    }
    
    // Списываем ресурсы (обычное качество в первую очередь)
    if (needsIron > 0) {
        var remaining = needsIron;
        if (storage.iron['Обычное'] && storage.iron['Обычное'] > 0) {
            var take = Math.min(storage.iron['Обычное'], remaining);
            storage.iron['Обычное'] -= take;
            if (storage.iron['Обычное'] <= 0) delete storage.iron['Обычное'];
            remaining -= take;
        }
        needsIron = remaining;
    }
    if (needsSteel > 0) {
        var remaining = needsSteel;
        if (storage.steel['Обычное'] && storage.steel['Обычное'] > 0) {
            var take = Math.min(storage.steel['Обычное'], remaining);
            storage.steel['Обычное'] -= take;
            if (storage.steel['Обычное'] <= 0) delete storage.steel['Обычное'];
            remaining -= take;
        }
        needsSteel = remaining;
    }
    if (needsPlanks > 0) {
        var remaining = needsPlanks;
        if (storage.planks['Обычное'] && storage.planks['Обычное'] > 0) {
            var take = Math.min(storage.planks['Обычное'], remaining);
            storage.planks['Обычное'] -= take;
            if (storage.planks['Обычное'] <= 0) delete storage.planks['Обычное'];
            remaining -= take;
        }
        needsPlanks = remaining;
    }
    storage.coal -= needsCoal;
    
    queue.push({ id: itemId, name: name, timeLeft: 60, needsSteel: 0, needsIron: 0, needsCoal: 0, needsPlanks: 0 });
    setMessage('✅ Добавлено в очередь: ' + name + ' (1 час)');
    processWorkshopQueue(); closeWorkshop(); openCastleWorkshop();
}

function cancelQueueItem(index) {
    var queue = getCastleQueue(CASTLE_ID);
    var storage = getCastleStorage(CASTLE_ID);
    if (index >= queue.length) { setMessage('❌ Предмет не найден.'); return; }
    var item = queue.splice(index, 1)[0];
    
    if (item.id === 'steel') { addQualityResource(storage, 'iron', 'Обычное', 2); storage.coal += 1; }
    else if (item.id === 'sword') { addQualityResource(storage, 'steel', 'Обычное', 3); }
    else if (item.id === 'spear') { addQualityResource(storage, 'steel', 'Обычное', 1); addQualityResource(storage, 'planks', 'Обычное', 2); }
    else if (item.id === 'shield') { addQualityResource(storage, 'steel', 'Обычное', 6); }
    else if (item.id === 'plate_armor') { addQualityResource(storage, 'steel', 'Обычное', 12); }
    
    saveData();
    setMessage('❌ ' + item.name + ' удалён из очереди. Ресурсы возвращены.');
    closeWorkshop(); openCastleWorkshop();
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
            if (done.id === 'steel') { addQualityResource(storage, 'steel', 'Обычное', 1); setMessage('✅ Сталь готова!'); }
            else {
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

function closeWorkshop() { var m = document.getElementById('modal-workshop'); if (m) m.classList.add('hide'); }

// ============================================================
// СКЛАД
// ============================================================

function openCastleStorage() {
    if (!checkBucklerAccess()) return;
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    var storage = getCastleStorage(CASTLE_ID);
    
    var modal = document.getElementById('modal-storage');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-storage'; overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeStorage(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📦 СКЛАД ЗАМКА</h3><button class="close-btn" onclick="closeStorage()">✕</button></div><div id="modal-storage-content"></div></div>';
        document.body.appendChild(overlay); modal = overlay;
    }
    
    var content = document.getElementById('modal-storage-content');
    var html = '<div class="modal-section"><h4>📦 СКЛАД ЗАМКА</h4>';
    
    // Ресурсы с качеством
    var qualityResources = [
        {key:'iron',name:'⛏️ Руда'},{key:'steel',name:'⚒️ Сталь'},{key:'planks',name:'🪵 Доски'},
        {key:'leather',name:'🧵 Кожа'},{key:'hardenedLeather',name:'🟫 Дублёная кожа'},{key:'wood',name:'🪵 Древесина'}
    ];
    
    qualityResources.forEach(function(r) {
        var total = getTotalQualityResource(storage, r.key);
        html += '<div class="row"><span class="label">'+r.name+': '+total+'</span><span class="value"><button class="btn btn-small" onclick="showStorageQuality(\''+r.key+'\',\''+r.name+'\')">📋</button></span></div>';
    });
    
    // Ресурсы без качества
    var simpleResources = [
        {key:'coal',name:'🔥 Уголь'},{key:'salt',name:'🧂 Соль'},{key:'stone',name:'🪨 Камень'},
        {key:'valyrian_ore',name:'💎 Руда 14 огней'},{key:'valyrian_steel',name:'🌟 Валирийская сталь'}
    ];
    
    simpleResources.forEach(function(r) {
        html += '<div class="row"><span class="label">'+r.name+': '+(storage[r.key]||0)+'</span><span class="value"><button class="btn btn-small" onclick="takeSimpleFromStorage(\''+r.key+'\','+(storage[r.key]||0)+')">📤</button></span></div>';
    });
    html += '</div>';
    
    html += '<div class="modal-section"><h4>📥 ПОЛОЖИТЬ РЕСУРСЫ</h4>';
    g.inventory.forEach(function(item, i) {
        if (item.resourceType) {
            html += '<div class="row"><span class="label">'+item.name+' ('+(item.quality||'Обычное')+') ×'+(item.count||1)+'</span><span class="value"><button class="btn btn-small" onclick="donateToStorage('+i+')">📥</button></span></div>';
        }
    });
    html += '</div>';
    html += '<button class="btn btn-secondary" onclick="closeStorage()">Закрыть</button>';
    content.innerHTML = html; modal.classList.remove('hide');
}

function showStorageQuality(key, name) {
    var storage = getCastleStorage(CASTLE_ID);
    var qualities = storage[key] || {};
    var msg = name + ' на складе:\n';
    var hasAny = false;
    for (var q in qualities) {
        if (qualities[q] > 0) { msg += '• ' + q + ': ' + qualities[q] + ' шт.\n'; hasAny = true; }
    }
    if (!hasAny) msg += 'Пусто.\n';
    msg += '\nВведите качество и количество:\n(например: Обычное 5)';
    var input = prompt(msg);
    if (!input) return;
    var parts = input.split(' ');
    var quality = parts[0];
    var amount = parseInt(parts[1]);
    if (!quality || isNaN(amount) || amount <= 0 || !qualities[quality] || qualities[quality] < amount) {
        setMessage('❌ Неверный ввод.'); return;
    }
    
    qualities[quality] -= amount;
    if (qualities[quality] <= 0) delete qualities[quality];
    
    var remaining = amount;
    while (remaining > 0) {
        var stack = Math.min(remaining, 50);
        addToInventory(users[currentUser].game, { name: name, type: 'resource', resourceType: key, count: stack, quality: quality });
        remaining -= stack;
    }
    
    saveData(); setMessage('✅ Забрано: ' + amount + ' ' + quality); updateMenu(); openCastleStorage();
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
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    var storage = getCastleStorage(CASTLE_ID);
    if (index >= g.inventory.length) { setMessage('❌ Предмет не найден.'); return; }
    var item = g.inventory[index];
    if (!item.resourceType) { setMessage('❌ Это не ресурс.'); return; }
    var count = item.count || 1;
    var quality = item.quality || 'Обычное';
    
    // Проверяем, ресурс с качеством или без
    var qualityKeys = ['iron','steel','planks','leather','hardenedLeather','wood'];
    if (qualityKeys.indexOf(item.resourceType) !== -1) {
        addQualityResource(storage, item.resourceType, quality, count);
    } else {
        storage[item.resourceType] = (storage[item.resourceType] || 0) + count;
    }
    
    g.inventory.splice(index, 1);
    saveData(); setMessage('✅ ' + item.name + ' ×' + count + ' на складе.'); updateMenu(); openCastleStorage();
}

function closeStorage() { var m = document.getElementById('modal-storage'); if (m) m.classList.add('hide'); }

// ============================================================
// АМБАР
// ============================================================

function openCastleGranary() {
    if (!checkBucklerAccess()) return;
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    var granary = getCastleGranary(CASTLE_ID);
    
    var modal = document.getElementById('modal-granary');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-granary'; overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeGranary(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🌾 АМБАР</h3><button class="close-btn" onclick="closeGranary()">✕</button></div><div id="modal-granary-content"></div></div>';
        document.body.appendChild(overlay); modal = overlay;
    }
    
    var content = document.getElementById('modal-granary-content');
    var html = '<div class="modal-section"><h4>🌾 АМБАР ЗАМКА</h4>';
    var res = [
        {key:'wheat',name:'🌾 Пшеница'},{key:'vegetables',name:'🥕 Овощи'},{key:'fish',name:'🐟 Рыба'},
        {key:'water',name:'💧 Вода'},{key:'bread',name:'🍞 Хлеб'},{key:'meat',name:'🥩 Мясо'},
        {key:'cheese',name:'🧀 Сыр'},{key:'apple',name:'🍎 Яблоко'},{key:'milk',name:'🥛 Молоко'},
        {key:'ale',name:'🍺 Эль'},{key:'wine',name:'🍷 Вино'}
    ];
    res.forEach(function(r) {
        html += '<div class="row"><span class="label">'+r.name+': '+(granary[r.key]||0)+'</span><span class="value"><button class="btn btn-small" onclick="takeFromGranary(\''+r.key+'\','+(granary[r.key]||0)+')">📤</button></span></div>';
    });
    html += '</div>';
    
    html += '<div class="modal-section"><h4>📥 ПОЛОЖИТЬ ЕДУ</h4>';
    g.inventory.forEach(function(item, i) {
        if (item.type === 'food' || (item.effect && (item.effect.food || item.effect.thirst))) {
            html += '<div class="row"><span class="label">'+item.name+' ×'+(item.count||1)+'</span><span class="value"><button class="btn btn-small" onclick="donateToGranary('+i+')">📥</button></span></div>';
        }
    });
    html += '</div>';
    html += '<button class="btn btn-secondary" onclick="closeGranary()">Закрыть</button>';
    content.innerHTML = html; modal.classList.remove('hide');
}

function donateToGranary(index) {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
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
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
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

function closeGranary() { var m = document.getElementById('modal-granary'); if (m) m.classList.add('hide'); }

// ============================================================
// ОРУЖЕЙНАЯ
// ============================================================

function openCastleArmory() {
    if (!checkBucklerAccess()) return;
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    var armory = getCastleArmory(CASTLE_ID);
    
    var modal = document.getElementById('modal-armory');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-armory'; overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeArmory(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🗡️ ОРУЖЕЙНАЯ</h3><button class="close-btn" onclick="closeArmory()">✕</button></div><div id="modal-armory-content"></div></div>';
        document.body.appendChild(overlay); modal = overlay;
    }
    
    var content = document.getElementById('modal-armory-content');
    var html = '<div class="modal-section"><h4>🗡️ ОРУЖЕЙНАЯ ЗАМКА</h4>';
    html += '<div class="tabs" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;">';
    html += '<button class="tab-btn active" onclick="showArmoryTab(\'weapons\')">🗡️ Оружие ('+armory.weapons.length+')</button>';
    html += '<button class="tab-btn" onclick="showArmoryTab(\'armor\')">🛡️ Броня ('+armory.armor.length+')</button>';
    html += '<button class="tab-btn" onclick="showArmoryTab(\'soldierWeapons\')">⚔️ Солд. оружие ('+armory.soldierWeapons.length+')</button>';
    html += '<button class="tab-btn" onclick="showArmoryTab(\'soldierArmor\')">🛡️ Солд. броня ('+armory.soldierArmor.length+')</button>';
    html += '<button class="tab-btn" onclick="showArmoryTab(\'donate\')">📥 Положить</button>';
    html += '</div><div id="armory-tab-content"></div>';
    html += '<button class="btn btn-secondary" onclick="closeArmory()" style="margin-top:10px;">Закрыть</button>';
    content.innerHTML = html; modal.classList.remove('hide');
    showArmoryTab('weapons');
}

function showArmoryTab(tab) {
    var container = document.getElementById('armory-tab-content');
    if (!container) return;
    var armory = getCastleArmory(CASTLE_ID);
    var html = '';
    var titles = { weapons:'🗡️ Оружие', armor:'🛡️ Броня', soldierWeapons:'⚔️ Солдатское оружие', soldierArmor:'🛡️ Солдатская броня' };
    
    if (tab === 'donate') {
        var user = users[currentUser];
        if (!user) return;
        var g = user.game;
        html += '<h4>📥 ПОЛОЖИТЬ В ОРУЖЕЙНУЮ</h4>';
        var hasItems = false;
        g.inventory.forEach(function(item, i) {
            if (isEquippable(item)) {
                hasItems = true;
                html += '<div class="row"><span class="label">'+item.name+' ('+(item.quality||'Обычное')+')</span><span class="value"><button class="btn btn-small" onclick="donateToArmory('+i+')">📥</button></span></div>';
            }
        });
        if (!hasItems) html += '<p style="color:#6a5a48;">Нет предметов для передачи.</p>';
    } else {
        var items = armory[tab] || [];
        html += '<h4>'+titles[tab]+' ('+items.length+' шт.)</h4>';
        if (items.length === 0) html += '<p style="color:#6a5a48;">Пусто.</p>';
        else {
            var grouped = {};
            items.forEach(function(item) { var k = item.name + '|' + (item.quality||'Обычное'); if (!grouped[k]) grouped[k] = {item:item,count:0}; grouped[k].count++; });
            for (var k in grouped) {
                html += '<div class="row"><span class="label">'+grouped[k].item.name+' ('+(grouped[k].item.quality||'Обычное')+')</span><span class="value">×'+grouped[k].count+'</span></div>';
            }
        }
    }
    container.innerHTML = html;
}

function donateToArmory(index) {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    var armory = getCastleArmory(CASTLE_ID);
    if (index >= g.inventory.length) { setMessage('❌ Предмет не найден.'); return; }
    var item = g.inventory.splice(index, 1)[0];
    var cat = 'weapons';
    if (item.armorClass === 'leather' || item.armorClass === 'plate') cat = 'armor';
    if (item.isSoldierGear) {
        cat = (item.type === 'armor') ? 'soldierArmor' : 'soldierWeapons';
    }
    armory[cat].push(item);
    saveData(); setMessage('✅ ' + item.name + ' перемещён в оружейную.'); updateMenu(); showArmoryTab('donate');
}

function closeArmory() { var m = document.getElementById('modal-armory'); if (m) m.classList.add('hide'); }

// ============================================================
// ОСТАЛЬНЫЕ ЗДАНИЯ
// ============================================================

function openCastleDonjon() { if (!checkBucklerAccess()) return; setMessage('🗼 Вы в донжоне. Лорд Баклеров приветствует вас.'); }
function openCastleBarracks() { if (!checkBucklerAccess()) return; setMessage('⚔️ Казармы гарнизона.'); }
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
    var html = '<div class="modal-section"><h4>🏰 Бронзовый Щит</h4></div><div class="modal-section">';
    CASTLE_BUILDINGS.forEach(function(b) {
        var isCurrent = b.id === g.location.place;
        html += '<div class="row"><span class="label">'+b.label+(isCurrent?' ⭐':'')+'</span>';
        html += '<span class="value">'+(isCurrent?'<span style="color:#6a5a48;">Вы здесь</span>':'<button class="btn btn-small" onclick="goToCastleBuilding(\''+b.id+'\')">🚶 Идти</button>')+'</span></div>';
    });
    html += '</div><button class="btn" onclick="closeMap()">Закрыть</button>';
    content.innerHTML = html; modal.classList.remove('hide');
}

function goToCastleBuilding(building) {
    var g = users[currentUser].game;
    if (isBusy) { setMessage('⏳ Вы заняты.'); return; }
    if (building === g.location.place) { setMessage('📍 Вы уже здесь.'); return; }
    if (!CASTLE_BUILDINGS.some(function(b){return b.id===building})) { setMessage('❌ Здание не найдено.'); return; }
    g.location.place = building; g.location.location = 'Бронзовый Щит';
    closeMap(); updateMenu(); updateStory(); updateActions(); saveData();
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
            else if (a.id==='donjon_open') openCastleDonjon();
            else if (a.id==='barracks_open') openCastleBarracks();
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

window.openCastleMap = openCastleMap;
window.goToCastleBuilding = goToCastleBuilding;
window.updateStory = window.updateStory;
window.updateActions = window.updateActions;

processWorkshopQueue();
console.log('🏰 Замок Бронзовый Щит загружен!');

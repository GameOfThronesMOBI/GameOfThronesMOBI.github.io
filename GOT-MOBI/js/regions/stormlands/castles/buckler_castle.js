// ============================================================
// js/regions/stormlands/castles/buckler_castle.js
// ЗАМОК БРОНЗОВЫЙ ЩИТ — ПОЛНАЯ ЛОГИКА
// ============================================================

var _castlePrevUpdateStory = window.updateStory;
var _castlePrevUpdateActions = window.updateActions;

// Склад замка и оружейная (общие для всех замков)
if (!window._castleStorages) window._castleStorages = {};
if (!window._castleArmories) window._castleArmories = {};

function getCastleStorage(castleId) {
    if (!window._castleStorages[castleId]) {
        window._castleStorages[castleId] = { iron: 0, coal: 0, steel: 0, leather: 0, salt: 0, wood: 0, planks: 0, hardenedLeather: 0 };
    }
    return window._castleStorages[castleId];
}

function getCastleArmory(castleId) {
    if (!window._castleArmories[castleId]) {
        window._castleArmories[castleId] = [];
    }
    return window._castleArmories[castleId];
}

// Очереди производства
if (!window._castleQueues) window._castleQueues = {};
function getCastleQueue(castleId) {
    if (!window._castleQueues[castleId]) {
        window._castleQueues[castleId] = [];
    }
    return window._castleQueues[castleId];
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
    { id: 'castle_dungeon', label: '⛓️ Темница' }
];

var CASTLE_ID = 'buckler';

// ============================================================
// КОНЮШНЯ
// ============================================================

function openCastleStable() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (g.house !== 'buckler') {
        setMessage('❌ Только члены дома Баклеров могут покупать лошадей в замке.');
        return;
    }
    
    var modal = document.getElementById('modal-stable');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-stable';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeStable(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🐴 ЗАМКОВАЯ КОНЮШНЯ</h3><button class="close-btn" onclick="closeStable()">✕</button></div><div id="modal-stable-content"></div></div>';
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
            html += '<button class="btn btn-danger" onclick="sellCastleHorse(); closeStable();" style="margin-top:8px;">💰 Продать лошадь</button>';
            html += '</div>';
        }
    } else {
        html += '<p style="color:#6a5a48;text-align:center;padding:10px 0;">🐴 У вас нет лошади.</p>';
    }
    
    html += '<h4 style="color:#c9b694;margin-top:16px;">📦 БОЕВЫЕ ЛОШАДИ (только для Баклеров, -50% цены)</h4>';
    
    var castleHorses = [
        { type: 'war', name: 'Боевой конь', emoji: '⚔️', price: Math.floor(HORSE_TYPES['war'].price * 0.5), desc: 'Смелый и сильный.' },
        { type: 'heavy', name: 'Тяжёлый боевой конь', emoji: '🛡️', price: Math.floor(HORSE_TYPES['heavy'].price * 0.5), desc: 'Мощный и выносливый.' }
    ];
    
    castleHorses.forEach(function(h) {
        var isOwned = g.equipment && g.equipment.horse && g.equipment.horse.horseType === h.type;
        var canBuy = !g.equipment || !g.equipment.horse;
        
        html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #1a1410;">';
        html += '<div>' + h.emoji + ' <strong>' + h.name + '</strong>';
        if (isOwned) html += ' <span style="color:#7ac98a;">✅ Ваша</span>';
        html += '<br><span style="font-size:11px;color:#6a5a48;">' + h.desc + '</span></div>';
        html += '<div style="text-align:right;">';
        if (isOwned) {
            html += '<span style="color:#7ac98a;">Уже куплена</span>';
        } else if (canBuy) {
            html += '<span style="color:#c9b694;">' + formatCurrency(h.price * 210 * 56) + '</span><br>';
            html += '<button class="btn btn-small" onclick="buyCastleHorse(\'' + h.type + '\',' + h.price + '); closeStable();" style="margin-top:4px;">✅ Купить</button>';
        } else {
            html += '<span style="color:#c96a5a;">Продайте текущую</span>';
        }
        html += '</div></div>';
    });
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function buyCastleHorse(type, price) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (g.house !== 'buckler') { setMessage('❌ Только члены дома Баклеров.'); return; }
    
    var horse = HORSE_TYPES[type];
    if (!horse) { setMessage('❌ Такой лошади нет.'); return; }
    if (g.equipment && g.equipment.horse) { setMessage('❌ У вас уже есть лошадь!'); return; }
    if (!spendMoney(g, price * 210 * 56)) { setMessage('❌ Недостаточно денег!'); return; }
    
    g.equipment.horse = { type: 'horse', horseType: type, name: horse.name, hp: horse.hp, maxHp: horse.hp, speedBonus: horse.speedBonus, defensePercent: horse.defensePercent, inventorySlots: horse.inventorySlots };
    saveData();
    setMessage('✅ Вы купили ' + horse.name);
    updateMenu();
}

function sellCastleHorse() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    if (!g.equipment || !g.equipment.horse) { setMessage('❌ У вас нет лошади.'); return; }
    var horseType = HORSE_TYPES[g.equipment.horse.horseType];
    if (!horseType) { setMessage('❌ Лошадь не найдена.'); return; }
    var refund = Math.floor(horseType.price * 0.3);
    g.copper += refund * 210 * 56;
    convertCurrency(g);
    g.equipment.horse = null;
    saveData();
    setMessage('💰 Вы продали лошадь за ' + formatCurrency(refund * 210 * 56));
    updateMenu();
}

// ============================================================
// МАСТЕРСКАЯ
// ============================================================

function openCastleWorkshop() {
    var storage = getCastleStorage(CASTLE_ID);
    var queue = getCastleQueue(CASTLE_ID);
    var armory = getCastleArmory(CASTLE_ID);
    
    var modal = document.getElementById('modal-workshop');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-workshop';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeWorkshop(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🛠️ МАСТЕРСКАЯ</h3><button class="close-btn" onclick="closeWorkshop()">✕</button></div><div id="modal-workshop-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-workshop-content');
    
    var html = '<div class="modal-section"><h4>🛠️ МАСТЕРСКАЯ ЗАМКА</h4>';
    html += '<p style="color:#6a5a48;font-size:11px;">⚒️ Кузница: ✅ | 🪡 Кожевня: ❌ | 🪵 Плотник: ❌</p>';
    html += '<p style="color:#6a5a48;font-size:11px;">📦 Склад: Руда: ' + storage.iron + ' | Уголь: ' + storage.coal + ' | Сталь: ' + storage.steel + ' | Доски: ' + storage.planks + ' | Кожа: ' + storage.leather + '</p>';
    html += '<p style="color:#6a5a48;font-size:11px;">🗡️ Оружейная: ' + armory.length + ' предметов</p>';
    
    if (queue.length > 0) {
        html += '<p style="color:#ffd700;font-size:11px;">⏳ Очередь: ' + queue.length + '/10</p>';
        queue.forEach(function(q, i) {
            html += '<div style="font-size:10px;color:#b8a890;">' + (i+1) + '. ' + q.name + ' — ' + q.timeLeft + ' мин</div>';
        });
    }
    html += '</div>';
    
    // Ресурсы
    html += '<div class="modal-section"><h4>⚒️ ПРОИЗВОДСТВО РЕСУРСОВ</h4>';
    html += '<div class="row"><span class="label">Сталь (2 руды + 1 уголь)</span><span class="value"><button class="btn btn-small" onclick="queueWorkshopItem(\'steel\')">🔨 1 час</button></span></div>';
    html += '</div>';
    
    // Оружие (кузница)
    html += '<div class="modal-section"><h4>🗡️ ОРУЖИЕ (Кузница)</h4>';
    var weapons = [
        { id: 'sword', name: 'Меч солдата', steel: 3, planks: 0 },
        { id: 'spear', name: 'Копьё солдата', steel: 1, planks: 2 },
        { id: 'shield', name: 'Щит солдата', steel: 6, planks: 0 }
    ];
    weapons.forEach(function(w) {
        var costs = w.steel + ' стали';
        if (w.planks > 0) costs += ' + ' + w.planks + ' досок';
        html += '<div class="row"><span class="label">' + w.name + ' (' + costs + ')</span><span class="value"><button class="btn btn-small" onclick="queueWorkshopItem(\'' + w.id + '\')">🔨 1 час</button></span></div>';
    });
    html += '</div>';
    
    // Броня латная
    html += '<div class="modal-section"><h4>🛡️ ЛАТНАЯ БРОНЯ</h4>';
    html += '<div class="row"><span class="label">Комплект латной брони (12 стали)</span><span class="value"><button class="btn btn-small" onclick="queueWorkshopItem(\'plate_armor\')">🔨 1 час</button></span></div>';
    html += '</div>';
    
    // Броня кожаная
    html += '<div class="modal-section"><h4>🧵 КОЖАНАЯ БРОНЯ</h4>';
    html += '<p style="color:#c96a5a;font-size:11px;">❌ Нет кожевни.</p>';
    html += '</div>';
    
    // Луки
    html += '<div class="modal-section"><h4>🏹 ЛУКИ И АРБАЛЕТЫ (Плотник)</h4>';
    html += '<p style="color:#c96a5a;font-size:11px;">❌ Нет плотника.</p>';
    html += '</div>';
    
    html += '<button class="btn btn-secondary" onclick="closeWorkshop()" style="margin-top:10px;">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function queueWorkshopItem(itemId) {
    var queue = getCastleQueue(CASTLE_ID);
    var storage = getCastleStorage(CASTLE_ID);
    
    if (queue.length >= 10) { setMessage('❌ Очередь заполнена (макс. 10).'); return; }
    
    var name = '';
    var needsSteel = 0, needsIron = 0, needsCoal = 0, needsPlanks = 0;
    
    if (itemId === 'steel') { name = 'Сталь'; needsIron = 2; needsCoal = 1; }
    else if (itemId === 'sword') { name = 'Меч солдата'; needsSteel = 3; }
    else if (itemId === 'spear') { name = 'Копьё солдата'; needsSteel = 1; needsPlanks = 2; }
    else if (itemId === 'shield') { name = 'Щит солдата'; needsSteel = 6; }
    else if (itemId === 'plate_armor') { name = 'Комплект латной брони'; needsSteel = 12; }
    else { setMessage('❌ Неизвестный предмет.'); return; }
    
    if (storage.iron < needsIron || storage.coal < needsCoal || storage.steel < needsSteel || storage.planks < needsPlanks) {
        setMessage('❌ Недостаточно ресурсов на складе.');
        return;
    }
    
    storage.iron -= needsIron;
    storage.coal -= needsCoal;
    storage.steel -= needsSteel;
    storage.planks -= needsPlanks;
    
    queue.push({ id: itemId, name: name, timeLeft: 60, needsSteel: needsSteel });
    setMessage('✅ Добавлено в очередь: ' + name + ' (1 час)');
    processWorkshopQueue();
    closeWorkshop();
    openCastleWorkshop();
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
            
            if (done.id === 'steel') {
                storage.steel++;
                setMessage('✅ Сталь готова!');
            } else {
                var item = null;
                if (done.id === 'sword') item = SOLDIER_ITEMS.weapons.sword[0];
                else if (done.id === 'spear') item = SOLDIER_ITEMS.weapons.spear[0];
                else if (done.id === 'shield') item = SOLDIER_ITEMS.weapons.shield[0];
                else if (done.id === 'plate_armor') item = SOLDIER_ITEMS.armor.plate[0];
                
                if (item) {
                    armory.push({ name: item.name, type: done.id, isSoldierGear: true });
                    setMessage('✅ ' + item.name + ' готов!');
                }
            }
            saveData();
        }
        if (queue.length === 0) { clearInterval(window._workshopTimer); window._workshopTimer = null; }
    }, 60000);
}

function closeWorkshop() {
    var modal = document.getElementById('modal-workshop');
    if (modal) modal.classList.add('hide');
}

// ============================================================
// СКЛАД
// ============================================================

function openCastleStorage() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var storage = getCastleStorage(CASTLE_ID);
    
    var modal = document.getElementById('modal-storage');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-storage';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeStorage(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📦 СКЛАД ЗАМКА</h3><button class="close-btn" onclick="closeStorage()">✕</button></div><div id="modal-storage-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-storage-content');
    
    var html = '<div class="modal-section"><h4>📦 СКЛАД ЗАМКА</h4>';
    html += '<p style="color:#b8a890;">⛏️ Руда: ' + storage.iron + '</p>';
    html += '<p style="color:#b8a890;">🔥 Уголь: ' + storage.coal + '</p>';
    html += '<p style="color:#b8a890;">⚒️ Сталь: ' + storage.steel + '</p>';
    html += '<p style="color:#b8a890;">🪵 Доски: ' + storage.planks + '</p>';
    html += '<p style="color:#b8a890;">🧵 Кожа: ' + storage.leather + '</p>';
    html += '<p style="color:#b8a890;">🪵 Древесина: ' + storage.wood + '</p>';
    html += '</div>';
    
    html += '<div class="modal-section"><h4>📥 ПОЛОЖИТЬ РЕСУРСЫ</h4>';
    var resources = [
        { id: 'iron', name: 'Руда', type: 'iron' },
        { id: 'coal', name: 'Уголь', type: 'coal' },
        { id: 'leather', name: 'Кожа', type: 'leather' },
        { id: 'wood', name: 'Древесина', type: 'wood' },
        { id: 'planks', name: 'Доски', type: 'wood' }
    ];
    
    resources.forEach(function(r) {
        html += '<div class="row"><span class="label">' + r.name + '</span><span class="value"><button class="btn btn-small" onclick="donateToStorage(\'' + r.type + '\')">📥 Положить</button></span></div>';
    });
    html += '</div>';
    
    html += '<button class="btn btn-secondary" onclick="closeStorage()">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function donateToStorage(resourceType) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var storage = getCastleStorage(CASTLE_ID);
    
    var count = parseInt(prompt('Сколько положить?'));
    if (isNaN(count) || count <= 0) { setMessage('❌ Отменено.'); return; }
    
    var playerCount = 0;
    g.inventory.forEach(function(item) {
        if (item.resourceType === resourceType) playerCount += (item.count || 1);
    });
    
    if (playerCount < count) { setMessage('❌ У вас недостаточно ресурсов.'); return; }
    
    var removed = 0;
    for (var i = g.inventory.length - 1; i >= 0; i--) {
        if (g.inventory[i].resourceType === resourceType && removed < count) {
            if (g.inventory[i].count && g.inventory[i].count > 1) {
                var take = Math.min(g.inventory[i].count, count - removed);
                g.inventory[i].count -= take;
                removed += take;
                if (g.inventory[i].count === 0) g.inventory.splice(i, 1);
            } else {
                g.inventory.splice(i, 1);
                removed++;
            }
        }
    }
    
    storage[resourceType] += count;
    saveData();
    setMessage('✅ Вы положили ' + count + ' ' + resourceType + ' на склад замка.');
    updateMenu();
    openCastleStorage();
}

// ============================================================
// ОСТАЛЬНЫЕ ЗДАНИЯ
// ============================================================

function openCastleDonjon() {
    var g = users[currentUser].game;
    if (g.house !== 'buckler') { setMessage('🗼 Донжон закрыт для чужаков.'); return; }
    setMessage('🗼 Вы в донжоне. Лорд Баклеров приветствует вас.');
}

function openCastleBarracks() { setMessage('⚔️ Казармы гарнизона.'); }
function openCastleTraining() { setMessage('🎯 Тренировочная площадка. Пока недоступна.'); }
function openCastleGranary() { setMessage('🌾 Амбар. Пока недоступен.'); }
function openCastleArmory() {
    var armory = getCastleArmory(CASTLE_ID);
    if (armory.length === 0) { setMessage('🗡️ Оружейная пуста.'); return; }
    var msg = '🗡️ Оружейная замка:\n';
    var counts = {};
    armory.forEach(function(item) { counts[item.name] = (counts[item.name] || 0) + 1; });
    for (var name in counts) { msg += '• ' + name + ' ×' + counts[name] + '\n'; }
    alert(msg);
}
function openCastleMarket() { setMessage('🏪 Замковый рынок. Пока недоступен.'); }
function openCastleDungeon() { setMessage('⛓️ Темница замка. Пока недоступна.'); }

// ============================================================
// КАРТА ЗАМКА
// ============================================================

function openCastleMap() {
    var g = users[currentUser].game;
    var modal = document.getElementById('modal-map');
    var content = document.getElementById('modal-map-content');
    
    var html = '<div class="modal-section"><h4>🏰 Бронзовый Щит</h4></div><div class="modal-section">';
    for (var i = 0; i < CASTLE_BUILDINGS.length; i++) {
        var b = CASTLE_BUILDINGS[i];
        var isCurrent = b.id === g.location.place;
        html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
        html += '<span class="label">' + b.label + (isCurrent ? ' ⭐' : '') + '</span>';
        html += '<span class="value">' + (isCurrent ? '<span style="color:#6a5a48;">Вы здесь</span>' : '<button class="btn btn-small" onclick="goToCastleBuilding(\'' + b.id + '\')">🚶 Идти</button>') + '</span></div>';
    }
    html += '</div><button class="btn" onclick="closeMap()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function goToCastleBuilding(building) {
    var g = users[currentUser].game;
    if (isBusy) { setMessage('⏳ Вы заняты.'); return; }
    if (building === g.location.place) { setMessage('📍 Вы уже здесь.'); return; }
    var exists = CASTLE_BUILDINGS.some(function(b) { return b.id === building; });
    if (!exists) { setMessage('❌ Здание не найдено.'); return; }
    g.location.place = building;
    g.location.location = 'Бронзовый Щит';
    closeMap();
    updateMenu(); updateStory(); updateActions(); saveData();
}

// ============================================================
// STORY / ACTIONS
// ============================================================

window.updateStory = function() {
    var g = users[currentUser].game;
    var place = g.location.place;
    var isCastle = CASTLE_BUILDINGS.some(function(b) { return b.id === place; });
    if (!isCastle) { if (typeof _castlePrevUpdateStory === 'function') return _castlePrevUpdateStory(); return; }
    
    document.getElementById('story-title').textContent = '🏰 Бронзовый Щит';
    var texts = {
        'castle_gate': '🚪 Ворота замка.',
        'castle_donjon': '🗼 Донжон.',
        'castle_barracks': '⚔️ Казармы.',
        'castle_training': '🎯 Тренировочная площадка.',
        'castle_workshop': '🛠️ Мастерская.',
        'castle_forge': '⚒️ Кузница.',
        'castle_granary': '🌾 Амбар.',
        'castle_storage': '📦 Склад.',
        'castle_armory': '🗡️ Оружейная.',
        'castle_stable': '🐴 Конюшня.',
        'castle_market': '🏪 Рынок.',
        'castle_dungeon': '⛓️ Темница.'
    };
    document.getElementById('story-text').textContent = texts[place] || '';
    if (typeof updateActions === 'function') updateActions();
};

window.updateActions = function() {
    var g = users[currentUser].game;
    var place = g.location.place;
    var container = document.getElementById('actions-container');
    if (!container) return;
    
    var isCastle = CASTLE_BUILDINGS.some(function(b) { return b.id === place; });
    if (!isCastle) { if (typeof _castlePrevUpdateActions === 'function') return _castlePrevUpdateActions(); return; }
    
    container.innerHTML = '';
    var actions = [];
    
    if (place === 'castle_gate') actions.push({ id: 'leave_buckler_castle', label: '🚪 Выйти из замка' });
    if (place === 'castle_donjon') actions.push({ id: 'donjon_open', label: '🗼 Донжон' });
    if (place === 'castle_barracks') actions.push({ id: 'barracks_open', label: '⚔️ Казармы' });
    if (place === 'castle_training') actions.push({ id: 'training_open', label: '🎯 Тренировка' });
    if (place === 'castle_workshop') actions.push({ id: 'workshop_open', label: '🛠️ Производство' });
    if (place === 'castle_forge') actions.push({ id: 'castle_forge_craft', label: '⚒️ Ковка' });
    if (place === 'castle_granary') actions.push({ id: 'granary_open', label: '🌾 Запасы' });
    if (place === 'castle_storage') actions.push({ id: 'storage_open', label: '📦 Склад' });
    if (place === 'castle_armory') actions.push({ id: 'armory_open', label: '🗡️ Оружейная' });
    if (place === 'castle_stable') actions.push({ id: 'stable_open', label: '🐴 Конюшня' });
    if (place === 'castle_market') actions.push({ id: 'market_open', label: '🏪 Рынок' });
    if (place === 'castle_dungeon') actions.push({ id: 'dungeon_open', label: '⛓️ Темница' });
    
    actions.push({ id: 'castle_map', label: '🗺️ Карта замка' });
    actions.push({ id: 'inventory', label: '🎒 Инвентарь' });
    actions.push({ id: 'character', label: '👤 Персонаж' });
    actions.push({ id: 'menu', label: '📋 Меню' });
    
    actions.forEach(function(a) {
        var btn = document.createElement('button');
        btn.className = 'btn-game';
        btn.textContent = a.label;
        btn.onclick = function() {
            if (a.id === 'castle_map') openCastleMap();
            else if (a.id === 'leave_buckler_castle') { g.location.place = 'bl_-1_0'; g.location.location = 'Владения Баклеров'; g.location.locationId = 'bl_-1_0'; g.location.parentZone = null; setMessage('🚪 Вы вышли из замка.'); updateMenu(); updateStory(); updateActions(); saveData(); }
            else if (a.id === 'castle_forge_craft') { if (typeof openCraftMenu === 'function') openCraftMenu(); else setMessage('❌ Недоступно.'); }
            else if (a.id === 'stable_open') openCastleStable();
            else if (a.id === 'workshop_open') openCastleWorkshop();
            else if (a.id === 'storage_open') openCastleStorage();
            else if (a.id === 'donjon_open') openCastleDonjon();
            else if (a.id === 'barracks_open') openCastleBarracks();
            else if (a.id === 'training_open') openCastleTraining();
            else if (a.id === 'granary_open') openCastleGranary();
            else if (a.id === 'armory_open') openCastleArmory();
            else if (a.id === 'market_open') openCastleMarket();
            else if (a.id === 'dungeon_open') openCastleDungeon();
            else if (typeof gameAction === 'function') gameAction(a.id);
        };
        container.appendChild(btn);
    });
};

window.enterBucklerCastle = function() {
    var g = users[currentUser].game;
    g.location.place = 'castle_gate';
    g.location.location = 'Бронзовый Щит';
    g.location.parentZone = null;
    setMessage('🏰 Вы вошли в замок Бронзовый Щит.');
    updateMenu(); updateStory(); updateActions(); saveData();
};

window.openCastleMap = openCastleMap;
window.goToCastleBuilding = goToCastleBuilding;
window.updateStory = window.updateStory;
window.updateActions = window.updateActions;

processWorkshopQueue();
console.log('🏰 Замок Бронзовый Щит загружен!');

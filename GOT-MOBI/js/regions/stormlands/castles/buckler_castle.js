// ============================================================
// js/regions/stormlands/castles/buckler_castle.js
// ЗАМОК БРОНЗОВЫЙ ЩИТ — ПОЛНАЯ ЛОГИКА
// ============================================================

var _castlePrevUpdateStory = window.updateStory;
var _castlePrevUpdateActions = window.updateActions;

if (!window._castleStorages) window._castleStorages = {};
if (!window._castleArmories) window._castleArmories = {};

function getCastleStorage(castleId) {
    if (!window._castleStorages[castleId]) {
        window._castleStorages[castleId] = { 
            iron: 0, coal: 0, steel: 0, leather: 0, salt: 0, wood: 0, planks: 0, hardenedLeather: 0,
            stone: 0, wheat: 0, vegetables: 0, fish: 0, water: 0, valyrian_ore: 0, valyrian_steel: 0
        };
    }
    return window._castleStorages[castleId];
}

function getCastleArmory(castleId) {
    if (!window._castleArmories[castleId]) {
        window._castleArmories[castleId] = { weapons: [], armor: [], soldierWeapons: [], soldierArmor: [] };
    }
    return window._castleArmories[castleId];
}

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
            html += '<button class="btn btn-danger" onclick="sellCastleHorse(); closeStable();" style="margin-top:8px;">💰 Продать лошадь</button>';
            html += '</div>';
        }
    } else {
        html += '<p style="color:#6a5a48;text-align:center;padding:10px 0;">🐴 У вас нет лошади.</p>';
    }
    
    html += '<h4 style="color:#c9b694;margin-top:16px;">📦 БОЕВЫЕ ЛОШАДИ (-50% цены)</h4>';
    
    var castleHorses = [
        { type: 'war', name: 'Боевой конь', emoji: '⚔️', price: Math.floor(HORSE_TYPES['war'].price * 0.5) },
        { type: 'heavy', name: 'Тяжёлый боевой конь', emoji: '🛡️', price: Math.floor(HORSE_TYPES['heavy'].price * 0.5) }
    ];
    
    castleHorses.forEach(function(h) {
        var isOwned = g.equipment && g.equipment.horse && g.equipment.horse.horseType === h.type;
        var canBuy = !g.equipment || !g.equipment.horse;
        
        html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #1a1410;">';
        html += '<div>' + h.emoji + ' <strong>' + h.name + '</strong>' + (isOwned ? ' ✅' : '') + '</div>';
        html += '<div style="text-align:right;">';
        if (isOwned) html += '<span style="color:#7ac98a;">Уже куплена</span>';
        else if (canBuy) html += '<span style="color:#c9b694;">' + formatCurrency(h.price * 210 * 56) + '</span> <button class="btn btn-small" onclick="buyCastleHorse(\'' + h.type + '\',' + h.price + '); closeStable();">✅</button>';
        else html += '<span style="color:#c96a5a;">Продайте текущую</span>';
        html += '</div></div>';
    });
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function buyCastleHorse(type, price) {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    if (g.house !== 'buckler') { setMessage('❌ Только члены дома Баклеров.'); return; }
    var horse = HORSE_TYPES[type];
    if (!horse) { setMessage('❌ Такой лошади нет.'); return; }
    if (g.equipment && g.equipment.horse) { setMessage('❌ У вас уже есть лошадь!'); return; }
    if (!spendMoney(g, price * 210 * 56)) { setMessage('❌ Недостаточно денег!'); return; }
    g.equipment.horse = { type: 'horse', horseType: type, name: horse.name, hp: horse.hp, maxHp: horse.hp, speedBonus: horse.speedBonus, defensePercent: horse.defensePercent, inventorySlots: horse.inventorySlots };
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
    var totalArmory = armory.weapons.length + armory.armor.length + armory.soldierWeapons.length + armory.soldierArmor.length;
    
    var html = '<div class="modal-section"><h4>🛠️ МАСТЕРСКАЯ ЗАМКА</h4>';
    html += '<p style="color:#6a5a48;font-size:11px;">⚒️ Кузница: ✅ | 🪡 Кожевня: ❌ | 🪵 Плотник: ❌</p>';
    html += '<p style="color:#6a5a48;font-size:11px;">📦 Руда:' + storage.iron + ' Уголь:' + storage.coal + ' Сталь:' + storage.steel + ' Доски:' + storage.planks + ' Кожа:' + storage.leather + '</p>';
    html += '<p style="color:#6a5a48;font-size:11px;">🗡️ Оружейная: ' + totalArmory + ' предм.</p>';
    
    if (queue.length > 0) {
        html += '<p style="color:#ffd700;font-size:11px;">⏳ Очередь: ' + queue.length + '/10</p>';
        queue.forEach(function(q, i) {
            html += '<div style="font-size:10px;color:#b8a890;">' + (i+1) + '. ' + q.name + ' — ' + q.timeLeft + ' мин</div>';
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
    
    content.innerHTML = html;
    modal.classList.remove('hide');
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
    
    if (storage.iron < needsIron || storage.coal < needsCoal || storage.steel < needsSteel || storage.planks < needsPlanks) {
        setMessage('❌ Недостаточно ресурсов на складе.'); return;
    }
    storage.iron -= needsIron; storage.coal -= needsCoal; storage.steel -= needsSteel; storage.planks -= needsPlanks;
    queue.push({ id: itemId, name: name, timeLeft: 60 });
    setMessage('✅ Добавлено в очередь: ' + name + ' (1 час)');
    processWorkshopQueue();
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
            if (done.id === 'steel') { storage.steel++; setMessage('✅ Сталь готова!'); }
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
    var user = users[currentUser];
    if (!user) return;
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
    var res = [
        {key:'iron',name:'⛏️ Руда'},{key:'coal',name:'🔥 Уголь'},{key:'steel',name:'⚒️ Сталь'},
        {key:'planks',name:'🪵 Доски'},{key:'leather',name:'🧵 Кожа'},{key:'hardenedLeather',name:'🟤 Дублёная кожа'},
        {key:'stone',name:'🪨 Камень'},{key:'wheat',name:'🌾 Пшеница'},{key:'vegetables',name:'🥕 Овощи'},
        {key:'wood',name:'🪵 Древесина'},{key:'fish',name:'🐟 Рыба'},{key:'water',name:'💧 Вода'},
        {key:'salt',name:'🧂 Соль'},{key:'valyrian_ore',name:'💎 Руда 14 огней'},{key:'valyrian_steel',name:'🌟 Валирийская сталь'}
    ];
    res.forEach(function(r) { html += '<p style="color:#b8a890;">'+r.name+': '+storage[r.key]+'</p>'; });
    html += '</div>';
    
    html += '<div class="modal-section"><h4>📥 ПОЛОЖИТЬ РЕСУРСЫ</h4>';
    var userRes = [];
    g.inventory.forEach(function(item) {
        if (item.resourceType && item.count) userRes.push(item);
    });
    if (userRes.length === 0) html += '<p style="color:#6a5a48;">У вас нет ресурсов.</p>';
    else userRes.forEach(function(item, i) {
        html += '<div class="row"><span class="label">'+item.name+' ×'+(item.count||1)+'</span><span class="value"><button class="btn btn-small" onclick="donateToStorage('+i+')">📥</button></span></div>';
    });
    html += '</div>';
    html += '<button class="btn btn-secondary" onclick="closeStorage()">Закрыть</button>';
    content.innerHTML = html; modal.classList.remove('hide');
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
    storage[item.resourceType] = (storage[item.resourceType] || 0) + count;
    g.inventory.splice(index, 1);
    saveData(); setMessage('✅ ' + item.name + ' ×' + count + ' на складе.'); updateMenu(); openCastleStorage();
}

function closeStorage() { var m = document.getElementById('modal-storage'); if (m) m.classList.add('hide'); }

// ============================================================
// ОРУЖЕЙНАЯ
// ============================================================

function openCastleArmory() {
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
    html += '<button class="tab-btn active" onclick="showArmoryTab(\'weapons\')">🗡️ Оружие</button>';
    html += '<button class="tab-btn" onclick="showArmoryTab(\'armor\')">🛡️ Броня</button>';
    html += '<button class="tab-btn" onclick="showArmoryTab(\'soldierWeapons\')">⚔️ Солд. оружие</button>';
    html += '<button class="tab-btn" onclick="showArmoryTab(\'soldierArmor\')">🛡️ Солд. броня</button>';
    html += '<button class="tab-btn" onclick="showArmoryTab(\'donate\')">📥 Положить</button>';
    html += '</div>';
    html += '<div id="armory-tab-content"></div>';
    html += '<button class="btn btn-secondary" onclick="closeArmory()" style="margin-top:10px;">Закрыть</button>';
    content.innerHTML = html; modal.classList.remove('hide');
    showArmoryTab('weapons');
}

function showArmoryTab(tab) {
    var container = document.getElementById('armory-tab-content');
    if (!container) return;
    var armory = getCastleArmory(CASTLE_ID);
    var html = '';
    
    if (tab === 'weapons' || tab === 'armor' || tab === 'soldierWeapons' || tab === 'soldierArmor') {
        var items = armory[tab] || [];
        var titles = { weapons:'🗡️ Оружие', armor:'🛡️ Броня', soldierWeapons:'⚔️ Солдатское оружие', soldierArmor:'🛡️ Солдатская броня' };
        html += '<h4>'+titles[tab]+' ('+items.length+' шт.)</h4>';
        if (items.length === 0) html += '<p style="color:#6a5a48;">Пусто.</p>';
        else {
            var grouped = {};
            items.forEach(function(item) { var k = item.name; if (!grouped[k]) grouped[k] = 0; grouped[k]++; });
            for (var name in grouped) {
                html += '<div class="row"><span class="label">'+name+'</span><span class="value">×'+grouped[name]+'</span></div>';
            }
        }
    }
    
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
        if (item.type === 'sword' || item.type === 'spear' || item.type === 'shield' || item.type === 'bow' || item.type === 'crossbow') cat = 'soldierWeapons';
        else cat = 'soldierArmor';
    }
    if (!armory[cat]) armory[cat] = [];
    armory[cat].push(item);
    saveData(); setMessage('✅ ' + item.name + ' перемещён в оружейную.'); updateMenu(); showArmoryTab('donate');
}

function closeArmory() { var m = document.getElementById('modal-armory'); if (m) m.classList.add('hide'); }

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
    CASTLE_BUILDINGS.forEach(function(b) {
        var isCurrent = b.id === g.location.place;
        html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
        html += '<span class="label">'+b.label+(isCurrent?' ⭐':'')+'</span>';
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
    var texts = { castle_gate:'🚪 Ворота замка.', castle_donjon:'🗼 Донжон.', castle_barracks:'⚔️ Казармы.', castle_training:'🎯 Тренировочная площадка.', castle_workshop:'🛠️ Мастерская.', castle_forge:'⚒️ Кузница.', castle_granary:'🌾 Амбар.', castle_storage:'📦 Склад.', castle_armory:'🗡️ Оружейная.', castle_stable:'🐴 Конюшня.', castle_market:'🏪 Рынок.', castle_dungeon:'⛓️ Темница.' };
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
    if (place==='castle_granary') actions.push({id:'granary_open',label:'🌾 Запасы'});
    if (place==='castle_storage') actions.push({id:'storage_open',label:'📦 Склад'});
    if (place==='castle_armory') actions.push({id:'armory_open',label:'🗡️ Оружейная'});
    if (place==='castle_stable') actions.push({id:'stable_open',label:'🐴 Конюшня'});
    if (place==='castle_market') actions.push({id:'market_open',label:'🏪 Рынок'});
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
            else if (a.id==='castle_forge_craft') { if (typeof openCraftMenu==='function') openCraftMenu(); else setMessage('❌ Недоступно.'); }
            else if (a.id==='stable_open') openCastleStable();
            else if (a.id==='workshop_open') openCastleWorkshop();
            else if (a.id==='storage_open') openCastleStorage();
            else if (a.id==='armory_open') openCastleArmory();
            else if (a.id==='donjon_open') openCastleDonjon();
            else if (a.id==='barracks_open') openCastleBarracks();
            else if (a.id==='training_open') openCastleTraining();
            else if (a.id==='granary_open') openCastleGranary();
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

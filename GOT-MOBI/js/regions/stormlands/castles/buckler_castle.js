// ============================================================
// js/regions/stormlands/castles/buckler_castle.js
// ЗАМОК БРОНЗОВЫЙ ЩИТ — ПОЛНАЯ ЛОГИКА
// ============================================================

var _castlePrevUpdateStory = window.updateStory;
var _castlePrevUpdateActions = window.updateActions;

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

// ============================================================
// ЗАМКОВАЯ КОНЮШНЯ (только для членов дома Баклеров)
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
        { type: 'war', name: 'Боевой конь', emoji: '⚔️', price: Math.floor(HORSE_TYPES['war'].price * 0.5), desc: 'Смелый и сильный. Для рыцарей дома Баклеров.' },
        { type: 'heavy', name: 'Тяжёлый боевой конь', emoji: '🛡️', price: Math.floor(HORSE_TYPES['heavy'].price * 0.5), desc: 'Мощный и выносливый. Для тяжёлой кавалерии.' }
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
    
    if (g.house !== 'buckler') {
        setMessage('❌ Только члены дома Баклеров могут покупать лошадей в замке.');
        return;
    }
    
    var horse = HORSE_TYPES[type];
    if (!horse) { setMessage('❌ Такой лошади нет.'); return; }
    
    if (g.equipment && g.equipment.horse) {
        setMessage('❌ У вас уже есть лошадь!');
        return;
    }
    
    if (!spendMoney(g, price * 210 * 56)) {
        setMessage('❌ Недостаточно денег! Нужно: ' + formatCurrency(price * 210 * 56));
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
    
    saveData();
    setMessage('✅ Вы купили ' + horse.name + ' за ' + formatCurrency(price * 210 * 56));
    addLog('🐴 ' + currentUser + ' купил ' + horse.name + ' в замке Баклеров');
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
// МАСТЕРСКАЯ (производство солдатского снаряжения)
// ============================================================

function openCastleWorkshop() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
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
    
    // Проверяем какие здания есть в замке
    var hasForge = true;  // кузница есть всегда
    var hasLeather = false; // кожевни нет
    var hasWood = false; // плотника нет
    
    var html = '<div class="modal-section"><h4>🛠️ МАСТЕРСКАЯ ЗАМКА</h4>';
    html += '<p style="color:#6a5a48;font-size:11px;">Производство снаряжения для армии.</p>';
    html += '<p style="color:#6a5a48;font-size:11px;">⚒️ Кузница: ✅ | 🪡 Кожевня: ❌ | 🪵 Плотник: ❌</p>';
    html += '</div>';
    
    // Оружие (только если есть кузница)
    html += '<div class="modal-section"><h4>🗡️ ОРУЖИЕ</h4>';
    var weapons = [
        { name: 'Меч солдата', type: 'sword', iron: 2, coal: 1, time: '5 мин' },
        { name: 'Копьё солдата', type: 'spear', iron: 2, coal: 1, time: '5 мин' },
        { name: 'Щит солдата', type: 'shield', iron: 3, coal: 1, time: '8 мин' }
    ];
    
    weapons.forEach(function(w) {
        html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
        html += '<span class="label">' + w.name + '<br><span style="font-size:10px;color:#6a5a48;">⛏️ Руда: ' + w.iron + ' | 🔥 Уголь: ' + w.coal + ' | ⏳ ' + w.time + '</span></span>';
        html += '<span class="value"><button class="btn btn-small" onclick="craftSoldierItem(\'weapon\',\'' + w.type + '\')">🔨 Создать</button></span>';
        html += '</div>';
    });
    html += '</div>';
    
    // Броня латная (есть кузница)
    html += '<div class="modal-section"><h4>🛡️ ЛАТНАЯ БРОНЯ</h4>';
    html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
    html += '<span class="label">Комплект латной брони<br><span style="font-size:10px;color:#6a5a48;">⛏️ Руда: 8 | 🔥 Уголь: 4 | ⏳ 15 мин</span></span>';
    html += '<span class="value"><button class="btn btn-small" onclick="craftSoldierItem(\'armor\',\'plate\')">🔨 Создать</button></span>';
    html += '</div>';
    html += '</div>';
    
    // Броня кожаная (недоступна)
    html += '<div class="modal-section"><h4>🧵 КОЖАНАЯ БРОНЯ</h4>';
    html += '<p style="color:#c96a5a;font-size:11px;">❌ Нет кожевни. Постройте кожевню для производства.</p>';
    html += '</div>';
    
    // Луки (недоступны)
    html += '<div class="modal-section"><h4>🏹 ЛУКИ И АРБАЛЕТЫ</h4>';
    html += '<p style="color:#c96a5a;font-size:11px;">❌ Нет плотника. Постройте плотника для производства.</p>';
    html += '</div>';
    
    html += '<button class="btn btn-secondary" onclick="closeWorkshop()" style="margin-top:10px;">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function craftSoldierItem(category, type) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var item = null;
    var costIron = 0, costCoal = 0, costLeather = 0, costWood = 0;
    var timeMinutes = 5;
    
    if (category === 'weapon') {
        if (type === 'sword' || type === 'spear') { costIron = 2; costCoal = 1; timeMinutes = 5; }
        if (type === 'shield') { costIron = 3; costCoal = 1; timeMinutes = 8; }
        if (SOLDIER_ITEMS && SOLDIER_ITEMS.weapons && SOLDIER_ITEMS.weapons[type]) {
            item = SOLDIER_ITEMS.weapons[type][0];
        }
    }
    
    if (category === 'armor' && type === 'plate') {
        costIron = 8; costCoal = 4; timeMinutes = 15;
        if (SOLDIER_ITEMS && SOLDIER_ITEMS.armor && SOLDIER_ITEMS.armor.plate) {
            item = SOLDIER_ITEMS.armor.plate[0];
        }
    }
    
    if (!item) { setMessage('❌ Предмет не найден.'); return; }
    
    // Проверка ресурсов
    var ironCount = 0, coalCount = 0;
    g.inventory.forEach(function(inv) {
        if (inv.resourceType === 'iron') ironCount += (inv.count || 1);
        if (inv.resourceType === 'coal') coalCount += (inv.count || 1);
    });
    
    if (ironCount < costIron || coalCount < costCoal) {
        setMessage('❌ Недостаточно ресурсов. Нужно: Руда ' + costIron + ', Уголь ' + costCoal);
        return;
    }
    
    // Списываем ресурсы
    var removedIron = 0, removedCoal = 0;
    for (var i = g.inventory.length - 1; i >= 0; i--) {
        if (g.inventory[i].resourceType === 'iron' && removedIron < costIron) {
            if (g.inventory[i].count && g.inventory[i].count > 1) {
                g.inventory[i].count--;
                removedIron++;
            } else {
                g.inventory.splice(i, 1);
                removedIron++;
            }
        }
        if (g.inventory[i].resourceType === 'coal' && removedCoal < costCoal) {
            if (g.inventory[i].count && g.inventory[i].count > 1) {
                g.inventory[i].count--;
                removedCoal++;
            } else {
                g.inventory.splice(i, 1);
                removedCoal++;
            }
        }
    }
    
    // Создаём предмет (пока просто в инвентарь, потом будет в оружейную)
    addToInventory(g, {
        name: item.name,
        quality: 'Обычное',
        type: category === 'weapon' ? type : 'armor',
        baseDamage: item.baseDamage || 0,
        baseDefense: item.baseDefense || 0,
        defense: item.defense || 0,
        isSoldierGear: true,
        count: 1
    });
    
    saveData();
    setMessage('✅ Создано: ' + item.name);
    updateMenu();
    closeWorkshop();
}

function closeWorkshop() {
    var modal = document.getElementById('modal-workshop');
    if (modal) modal.classList.add('hide');
}

// ============================================================
// ОСТАЛЬНЫЕ ЗДАНИЯ (заглушки)
// ============================================================

function openCastleDonjon() {
    var g = users[currentUser].game;
    if (g.house !== 'buckler') {
        setMessage('🗼 Донжон закрыт для чужаков.');
        return;
    }
    setMessage('🗼 Вы в донжоне. Лорд Баклеров приветствует вас.');
}

function openCastleBarracks() {
    setMessage('⚔️ Казармы гарнизона. Здесь тренируются воины Бронзового Щита.');
}

function openCastleTraining() {
    setMessage('🎯 Тренировочная площадка. Пока недоступна.');
}

function openCastleGranary() {
    setMessage('🌾 Амбар с запасами зерна. Пока недоступен.');
}

function openCastleStorage() {
    setMessage('📦 Склад ресурсов. Пока недоступен.');
}

function openCastleArmory() {
    setMessage('🗡️ Оружейная замка. Пока недоступна.');
}

function openCastleMarket() {
    setMessage('🏪 Замковый рынок. Пока недоступен.');
}

function openCastleDungeon() {
    setMessage('⛓️ Темница замка. Пока недоступна.');
}

// ============================================================
// КАРТА ЗАМКА
// ============================================================

function openCastleMap() {
    var g = users[currentUser].game;
    var modal = document.getElementById('modal-map');
    var content = document.getElementById('modal-map-content');
    
    var html = '<div class="modal-section"><h4>🏰 Бронзовый Щит</h4></div>';
    html += '<div class="modal-section">';
    
    for (var i = 0; i < CASTLE_BUILDINGS.length; i++) {
        var b = CASTLE_BUILDINGS[i];
        var isCurrent = b.id === g.location.place;
        
        html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
        html += '<span class="label">' + b.label + (isCurrent ? ' ⭐' : '') + '</span>';
        if (!isCurrent) {
            html += '<span class="value"><button class="btn btn-small" onclick="goToCastleBuilding(\'' + b.id + '\')">🚶 Идти</button></span>';
        } else {
            html += '<span class="value" style="color:#6a5a48;">Вы здесь</span>';
        }
        html += '</div>';
    }
    
    html += '</div><button class="btn" onclick="closeMap()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function goToCastleBuilding(building) {
    var g = users[currentUser].game;
    
    if (isBusy) { setMessage('⏳ Вы заняты.'); return; }
    if (building === g.location.place) { setMessage('📍 Вы уже здесь.'); return; }
    
    var exists = false;
    for (var i = 0; i < CASTLE_BUILDINGS.length; i++) {
        if (CASTLE_BUILDINGS[i].id === building) { exists = true; break; }
    }
    if (!exists) { setMessage('❌ Здание не найдено.'); return; }
    
    g.location.place = building;
    g.location.location = 'Бронзовый Щит';
    
    setMessage('✅ Вы прибыли в ' + building);
    
    closeMap();
    updateMenu();
    updateStory();
    updateActions();
    saveData();
}

// ============================================================
// STORY
// ============================================================

window.updateStory = function() {
    var g = users[currentUser].game;
    var place = g.location.place;
    
    var isCastle = false;
    for (var i = 0; i < CASTLE_BUILDINGS.length; i++) {
        if (CASTLE_BUILDINGS[i].id === place) { isCastle = true; break; }
    }
    
    if (!isCastle) {
        if (typeof _castlePrevUpdateStory === 'function') return _castlePrevUpdateStory();
        return;
    }
    
    var titleEl = document.getElementById('story-title');
    var textEl = document.getElementById('story-text');
    
    if (titleEl) titleEl.textContent = '🏰 Бронзовый Щит';
    
    var texts = {
        'castle_gate': '🚪 Ворота замка. Отсюда можно выйти наружу.',
        'castle_donjon': '🗼 Донжон — сердце замка.',
        'castle_barracks': '⚔️ Казармы гарнизона.',
        'castle_training': '🎯 Тренировочная площадка.',
        'castle_workshop': '🛠️ Мастерская замка. Здесь производят снаряжение для армии.',
        'castle_forge': '⚒️ Замковая кузница.',
        'castle_granary': '🌾 Амбар с запасами.',
        'castle_storage': '📦 Склад ресурсов.',
        'castle_armory': '🗡️ Оружейная замка.',
        'castle_stable': '🐴 Замковая конюшня.',
        'castle_market': '🏪 Замковый рынок.',
        'castle_dungeon': '⛓️ Темница замка.'
    };
    
    if (textEl) textEl.textContent = texts[place] || 'Вы в ' + place;
    
    if (typeof updateActions === 'function') updateActions();
};

// ============================================================
// ACTIONS
// ============================================================

window.updateActions = function() {
    var g = users[currentUser].game;
    var place = g.location.place;
    var container = document.getElementById('actions-container');
    if (!container) return;
    
    var isCastle = false;
    for (var i = 0; i < CASTLE_BUILDINGS.length; i++) {
        if (CASTLE_BUILDINGS[i].id === place) { isCastle = true; break; }
    }
    
    if (!isCastle) {
        if (typeof _castlePrevUpdateActions === 'function') return _castlePrevUpdateActions();
        return;
    }
    
    container.innerHTML = '';
    var actions = [];
    
    if (place === 'castle_gate') {
        actions.push({ id: 'leave_buckler_castle', label: '🚪 Выйти из замка' });
    }
    if (place === 'castle_donjon') {
        actions.push({ id: 'donjon_open', label: '🗼 Донжон' });
    }
    if (place === 'castle_barracks') {
        actions.push({ id: 'barracks_open', label: '⚔️ Казармы' });
    }
    if (place === 'castle_training') {
        actions.push({ id: 'training_open', label: '🎯 Тренировка' });
    }
    if (place === 'castle_workshop') {
        actions.push({ id: 'workshop_open', label: '🛠️ Производство' });
    }
    if (place === 'castle_forge') {
        actions.push({ id: 'castle_forge_craft', label: '⚒️ Ковка' });
    }
    if (place === 'castle_granary') {
        actions.push({ id: 'granary_open', label: '🌾 Запасы' });
    }
    if (place === 'castle_storage') {
        actions.push({ id: 'storage_open', label: '📦 Склад' });
    }
    if (place === 'castle_armory') {
        actions.push({ id: 'armory_open', label: '🗡️ Оружейная' });
    }
    if (place === 'castle_stable') {
        actions.push({ id: 'stable_open', label: '🐴 Конюшня' });
    }
    if (place === 'castle_market') {
        actions.push({ id: 'market_open', label: '🏪 Рынок' });
    }
    if (place === 'castle_dungeon') {
        actions.push({ id: 'dungeon_open', label: '⛓️ Темница' });
    }
    
    actions.push({ id: 'castle_map', label: '🗺️ Карта замка' });
    actions.push({ id: 'inventory', label: '🎒 Инвентарь' });
    actions.push({ id: 'character', label: '👤 Персонаж' });
    actions.push({ id: 'menu', label: '📋 Меню' });
    
    for (var i = 0; i < actions.length; i++) {
        var a = actions[i];
        var btn = document.createElement('button');
        btn.className = 'btn-game';
        btn.textContent = a.label;
        btn.onclick = (function(action) {
            return function() {
                if (action.id === 'castle_map') { openCastleMap(); return; }
                if (action.id === 'leave_buckler_castle') {
                    g.location.place = 'bl_-1_0';
                    g.location.location = 'Владения Баклеров';
                    g.location.locationId = 'bl_-1_0';
                    g.location.parentZone = null;
                    setMessage('🚪 Вы вышли из замка.');
                    updateMenu(); updateStory(); updateActions(); saveData();
                    return;
                }
                if (action.id === 'castle_forge_craft') { if (typeof openCraftMenu === 'function') openCraftMenu(); else setMessage('❌ Недоступно.'); return; }
                if (action.id === 'stable_open') { openCastleStable(); return; }
                if (action.id === 'workshop_open') { openCastleWorkshop(); return; }
                if (action.id === 'donjon_open') { openCastleDonjon(); return; }
                if (action.id === 'barracks_open') { openCastleBarracks(); return; }
                if (action.id === 'training_open') { openCastleTraining(); return; }
                if (action.id === 'granary_open') { openCastleGranary(); return; }
                if (action.id === 'storage_open') { openCastleStorage(); return; }
                if (action.id === 'armory_open') { openCastleArmory(); return; }
                if (action.id === 'market_open') { openCastleMarket(); return; }
                if (action.id === 'dungeon_open') { openCastleDungeon(); return; }
                if (typeof gameAction === 'function') gameAction(action.id);
                else setMessage('❌ Действие временно недоступно.');
            };
        })(a);
        container.appendChild(btn);
    }
};

// Вход в замок
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

console.log('🏰 Замок Бронзовый Щит загружен!');

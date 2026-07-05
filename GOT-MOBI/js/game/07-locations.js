// ============================================================
// js/game/07-locations.js — ТОРГОВЛЯ, КРАФТ, МАГАЗИНЫ, АУКЦИОН, ТАВЕРНА
// ============================================================

// ============================================================
// 1. МАГАЗИНЫ NPC
// ============================================================

function openShop(shopType) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var modal = document.getElementById('modal-trade');
    var content = document.getElementById('modal-trade-content');
    
    var shopItems = getShopItems(shopType);
    var html = '<div class="modal-section"><h4>🏪 ' + shopType + '</h4>';
    html += '<p style="color:#6a5a48;">💰 ' + formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper) + '</p>';
    html += '</div>';
    
    // ТОВАРЫ ДЛЯ ПОКУПКИ
    html += '<div class="modal-section"><h4>📦 КУПИТЬ</h4>';
    if (shopItems.length === 0) {
        html += '<p style="color:#6a5a48;">Нет товаров.</p>';
    } else {
        shopItems.forEach(function(item) {
            var stock = getTraderStock(shopType, item.key) || 99;
            var canBuy = stock > 0 && g.gold * 210 * 56 + g.silver * 56 + g.copper >= item.price;
            html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label" style="font-size:13px;">' + item.label + '</span>';
            html += '<span class="value" style="font-size:11px;">' + formatCurrency(item.price) + ' | 📦' + stock;
            html += ' <button class="btn btn-small" onclick="buyFromShop(\'' + shopType + '\',\'' + item.key + '\',' + item.price + ')" ' + (canBuy ? '' : 'disabled') + '>' + (canBuy ? '✅ Купить' : '❌') + '</button>';
            html += '</span></div>';
        });
    }
    html += '</div>';
    
    // ПРОДАЖА ПРЕДМЕТОВ
    html += '<div class="modal-section"><h4>💰 ПРОДАТЬ</h4>';
    var sellItems = getSellableItems(g, shopType);
    if (sellItems.length === 0) {
        html += '<p style="color:#6a5a48;">Нет предметов для продажи.</p>';
    } else {
        sellItems.forEach(function(item) {
            html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label" style="font-size:13px;">' + item.label + '</span>';
            html += '<span class="value">' + formatCurrency(item.price) + ' <button class="btn btn-small" onclick="sellToShop(\'' + shopType + '\',' + item.index + ')">💰 Продать</button></span>';
            html += '</div>';
        });
    }
    html += '</div>';
    
    html += '<button class="btn" onclick="closeTrade()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function getShopItems(shopType) {
    var items = [];
    
    // ===== ОРУЖЕЙНАЯ ЛАВКА =====
    if (shopType === 'Оружейная лавка') {
        var weaponTypes = ['sword','spear','axe','mace','dagger','shield','bow','crossbow'];
        weaponTypes.forEach(function(type) {
            var list = ALL_ITEMS.weapons[type] || [];
            list.forEach(function(w) {
                var quality = 'Обычное';
                var key = w.name + '|' + quality;
                var price = Math.round((5 + w.level * 2 + (w.baseDamage || 0)) * 1.0);
                var label = w.name + ' (ур.' + w.level + ')';
                if (w.baseDamage) label += ' ⚔️' + w.baseDamage;
                if (w.defense) label += ' 🛡️' + w.defense;
                items.push({ key: key, label: label, price: price });
            });
        });
    }
    
    // ===== КОЖЕВНИК =====
    if (shopType === 'Кожевник') {
        // Кожа как ресурс
        var qualities = ['Плохое','Обычное','Хорошее','Качественное','Мастерское','Легендарное'];
        qualities.forEach(function(q) {
            var key = 'Кожа|' + q;
            var price = getResourcePrice('leather', q);
            items.push({ key: key, label: '🧵 Кожа (' + q + ')', price: price });
        });
        // Кожаная броня
        Object.keys(ALL_ITEMS.leather).forEach(function(type) {
            ALL_ITEMS.leather[type].forEach(function(item) {
                var quality = 'Обычное';
                var key = item.name + '|' + quality;
                var price = Math.round((5 + item.level * 2 + (item.baseDefense || 0)) * 1.0);
                var label = '🪡 ' + item.name + ' (ур.' + item.level + ')';
                if (item.baseDefense) label += ' 🛡️' + item.baseDefense;
                if (item.speedPercent) label += ' 🏃+' + item.speedPercent + '%';
                items.push({ key: key, label: label, price: price });
            });
        });
    }
    
    // ===== БРОННИК =====
    if (shopType === 'Бронник') {
        // Сталь как ресурс
        var qualities = ['Плохое','Обычное','Хорошее','Качественное','Мастерское','Легендарное'];
        qualities.forEach(function(q) {
            var key = 'Сталь|' + q;
            var price = getResourcePrice('steel', q);
            items.push({ key: key, label: '⚒️ Сталь (' + q + ')', price: price });
        });
        // Латная броня
        Object.keys(ALL_ITEMS.plate).forEach(function(type) {
            ALL_ITEMS.plate[type].forEach(function(item) {
                var quality = 'Обычное';
                var key = item.name + '|' + quality;
                var price = Math.round((5 + item.level * 2 + (item.baseDefense || 0)) * 1.0);
                var label = '🛡️ ' + item.name + ' (ур.' + item.level + ')';
                if (item.baseDefense) label += ' 🛡️' + item.baseDefense;
                if (item.speedPercent) label += ' 🏃+' + item.speedPercent + '%';
                items.push({ key: key, label: label, price: price });
            });
        });
    }
    
    // ===== ПЛОТНИК =====
    if (shopType === 'Плотник') {
        // Дерево как ресурс
        var qualities = ['Плохое','Обычное','Хорошее','Качественное','Мастерское','Легендарное'];
        qualities.forEach(function(q) {
            var key = 'Дерево|' + q;
            var price = getResourcePrice('wood', q);
            items.push({ key: key, label: '🪵 Дерево (' + q + ')', price: price });
        });
        // Луки и арбалеты
        ['bow','crossbow'].forEach(function(type) {
            ALL_ITEMS.weapons[type].forEach(function(item) {
                var quality = 'Обычное';
                var key = item.name + '|' + quality;
                var price = Math.round((5 + item.level * 2 + (item.baseDamage || 0)) * 1.0);
                var label = '🏹 ' + item.name + ' (ур.' + item.level + ')';
                if (item.baseDamage) label += ' ⚔️' + item.baseDamage;
                items.push({ key: key, label: label, price: price });
            });
        });
    }
    
    // ===== КУЗНИЦА =====
    if (shopType === 'Кузница') {
        // Ресурсы из CONSUMABLES
        if (typeof CONSUMABLES !== 'undefined') {
            if (CONSUMABLES.resources) {
                CONSUMABLES.resources.forEach(function(res) {
                    var qualities = ['Плохое','Обычное','Хорошее','Качественное','Мастерское','Легендарное'];
                    qualities.forEach(function(q) {
                        var key = res.name + '|' + q;
                        var price = getResourcePrice(res.resourceType, q);
                        items.push({ key: key, label: '⛏️ ' + res.name + ' (' + q + ')', price: price });
                    });
                });
            }
            if (CONSUMABLES.materials) {
                CONSUMABLES.materials.forEach(function(mat) {
                    var qualities = ['Плохое','Обычное','Хорошее','Качественное','Мастерское','Легендарное'];
                    qualities.forEach(function(q) {
                        var key = mat.name + '|' + q;
                        var price = getResourcePrice(mat.resourceType, q);
                        items.push({ key: key, label: '⚒️ ' + mat.name + ' (' + q + ')', price: price });
                    });
                });
            }
        } else {
            // Запасной вариант — ресурсы из ALL_ITEMS
            var resources = [
                { name: 'Руда железная', type: 'iron' },
                { name: 'Уголь', type: 'coal' },
                { name: 'Сталь', type: 'steel' },
                { name: 'Кожа', type: 'leather' },
                { name: 'Дерево', type: 'wood' }
            ];
            resources.forEach(function(res) {
                var qualities = ['Плохое','Обычное','Хорошее','Качественное','Мастерское','Легендарное'];
                qualities.forEach(function(q) {
                    var key = res.name + '|' + q;
                    var price = getResourcePrice(res.type, q);
                    items.push({ key: key, label: '⛏️ ' + res.name + ' (' + q + ')', price: price });
                });
            });
        }
    }
    
    return items;
}

function getSellableItems(g, shopType) {
    var items = [];
    var shopTypes = {
        'Оружейная лавка': ['sword','spear','axe','mace','dagger','shield','bow','crossbow'],
        'Кожевник': ['leather'],
        'Бронник': ['plate'],
        'Плотник': ['bow','crossbow','wood'],
        'Кузница': ['iron','coal','steel','valyrian_ore','valyrian_steel']
    };
    
    var allowedTypes = shopTypes[shopType] || [];
    
    g.inventory.forEach(function(item, index) {
        var isAllowed = false;
        
        // Проверка по типу ресурса
        if (item.type === 'resource') {
            if (allowedTypes.indexOf(item.resourceType) !== -1) isAllowed = true;
        }
        
        // Проверка по типу оружия
        if (item.type === 'sword' || item.type === 'spear' || item.type === 'axe' || 
            item.type === 'mace' || item.type === 'dagger' || item.type === 'shield' ||
            item.type === 'bow' || item.type === 'crossbow') {
            if (allowedTypes.indexOf(item.type) !== -1) isAllowed = true;
        }
        
        // Проверка по классу брони
        if (item.armorClass) {
            if (allowedTypes.indexOf(item.armorClass) !== -1) isAllowed = true;
        }
        
        if (isAllowed) {
            var price = getItemPrice(item);
            var countDisplay = '';
            if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
            items.push({ 
                index: index, 
                label: item.name + ' (' + (item.quality || 'Обычное') + ')' + countDisplay, 
                price: price 
            });
        }
    });
    
    return items;
}

function getItemPrice(item) {
    var basePrice = 5;
    if (item.type === 'resource') {
        var resourcePrices = { 
            'leather': 5, 'iron': 8, 'wood': 3, 'steel': 20, 'coal': 4,
            'valyrian_ore': 50000, 'valyrian_steel': 100000
        };
        basePrice = resourcePrices[item.resourceType] || 5;
    } else if (item.finalDamage) {
        basePrice = 5 + (item.level || 1) * 2 + (item.finalDamage || 0);
    } else if (item.finalDefense) {
        basePrice = 5 + (item.level || 1) * 2 + (item.finalDefense || 0);
    }
    var q = QUALITIES[item.quality] || QUALITIES['Обычное'];
    return Math.max(1, Math.round(basePrice * q.multiplier * 0.5));
}

function buyFromShop(shopType, itemKey, price) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!spendMoney(g, price)) {
        setMessage('❌ Недостаточно денег! Нужно: ' + formatCurrency(price));
        return;
    }
    
    var parts = itemKey.split('|');
    var name = parts[0];
    var quality = parts[1] || 'Обычное';
    var q = QUALITIES[quality] || QUALITIES['Обычное'];
    
    var item = { name: name, quality: quality, count: 1 };
    var found = false;
    
    // Поиск в ALL_ITEMS.weapons
    if (ALL_ITEMS && ALL_ITEMS.weapons) {
        for (var type in ALL_ITEMS.weapons) {
            ALL_ITEMS.weapons[type].forEach(function(w) {
                if (w.name === name) {
                    item.type = type;
                    item.level = w.level;
                    if (w.baseDamage) { item.baseDamage = w.baseDamage; item.finalDamage = Math.round(w.baseDamage * q.multiplier); }
                    if (w.defense) { item.defense = w.defense; item.finalDefense = Math.round(w.defense * q.multiplier); }
                    found = true;
                }
            });
        }
    }
    
    // Поиск в ALL_ITEMS.leather
    if (!found && ALL_ITEMS && ALL_ITEMS.leather) {
        for (var type in ALL_ITEMS.leather) {
            ALL_ITEMS.leather[type].forEach(function(w) {
                if (w.name === name) {
                    item.type = type;
                    item.armorClass = 'leather';
                    item.level = w.level;
                    if (w.baseDefense) { 
                        var def = Math.floor(w.baseDefense / 2);
                        item.baseDefense = w.baseDefense;
                        item.finalDefense = Math.round(def * q.multiplier);
                        item.agilityBonus = item.finalDefense;
                    }
                    found = true;
                }
            });
        }
    }
    
    // Поиск в ALL_ITEMS.plate
    if (!found && ALL_ITEMS && ALL_ITEMS.plate) {
        for (var type in ALL_ITEMS.plate) {
            ALL_ITEMS.plate[type].forEach(function(w) {
                if (w.name === name) {
                    item.type = type;
                    item.armorClass = 'plate';
                    item.level = w.level;
                    if (w.baseDefense) { 
                        item.baseDefense = w.baseDefense;
                        item.finalDefense = Math.round(w.baseDefense * q.multiplier);
                    }
                    found = true;
                }
            });
        }
    }
    
    // Если не нашли — это ресурс
    if (!found) {
        item.type = 'resource';
        if (name === 'Руда железная') item.resourceType = 'iron';
        else if (name === 'Уголь') item.resourceType = 'coal';
        else if (name === 'Сталь') item.resourceType = 'steel';
        else if (name === 'Кожа') item.resourceType = 'leather';
        else if (name === 'Дерево') item.resourceType = 'wood';
        else if (name === 'Руда 14 огней') item.resourceType = 'valyrian_ore';
        else if (name === 'Валирийская сталь') item.resourceType = 'valyrian_steel';
        else if (name === 'Шкура') item.resourceType = 'leather';
    }
    
    addToInventory(g, item);
    saveData();
    setMessage('✅ Вы купили ' + name + ' (' + quality + ')');
    openShop(shopType);
}

function sellToShop(shopType, index) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (index >= g.inventory.length) {
        setMessage('❌ Предмет не найден.');
        return;
    }
    
    var item = g.inventory[index];
    var price = getItemPrice(item);
    var count = item.count || 1;
    var totalPrice = price * count;
    
    g.copper += totalPrice;
    convertCurrency(g);
    g.inventory.splice(index, 1);
    
    saveData();
    setMessage('💰 Вы продали ' + item.name + ' за ' + formatCurrency(totalPrice));
    openShop(shopType);
}

// ============================================================
// 2. КРАФТ
// ============================================================

function openCraftMenu() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var modal = document.getElementById('modal-trade');
    var content = document.getElementById('modal-trade-content');
    
    var ironCount = 0, coalCount = 0, steelCount = 0;
    g.inventory.forEach(function(item) {
        if (item.resourceType === 'iron') ironCount += (item.count || 1);
        if (item.resourceType === 'coal') coalCount += (item.count || 1);
        if (item.resourceType === 'steel') steelCount += (item.count || 1);
    });
    
    var html = '<div class="modal-section"><h4>🔨 КРАФТ</h4>';
    html += '<p style="color:#6a5a48;">Ваши ресурсы:</p>';
    html += '<div style="color:#b8a890;font-size:13px;margin-bottom:10px;">';
    html += '⛏️ Руда: ' + ironCount + '<br>';
    html += '🔥 Уголь: ' + coalCount + '<br>';
    html += '⚒️ Сталь: ' + steelCount;
    html += '</div></div>';
    
    html += '<div class="modal-section"><h4>⚒️ Создать сталь</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Требуется: 2 руды + 1 уголь</p>';
    var canCraft = ironCount >= 2 && coalCount >= 1;
    html += '<button class="btn" onclick="craftSteel()" ' + (canCraft ? '' : 'disabled') + '>' + (canCraft ? '✅ Создать сталь' : '❌ Не хватает ресурсов') + '</button>';
    html += '</div>';
    
    html += '<button class="btn" onclick="closeTrade()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function craftSteel() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var removedIron = 0, removedCoal = 0;
    for (var i = g.inventory.length - 1; i >= 0; i--) {
        if (g.inventory[i].resourceType === 'iron' && removedIron < 2) {
            if (g.inventory[i].count && g.inventory[i].count > 1) {
                g.inventory[i].count--;
                removedIron++;
                if (g.inventory[i].count === 0) g.inventory.splice(i, 1);
            } else {
                g.inventory.splice(i, 1);
                removedIron++;
            }
        }
        if (g.inventory[i].resourceType === 'coal' && removedCoal < 1) {
            if (g.inventory[i].count && g.inventory[i].count > 1) {
                g.inventory[i].count--;
                removedCoal++;
                if (g.inventory[i].count === 0) g.inventory.splice(i, 1);
            } else {
                g.inventory.splice(i, 1);
                removedCoal++;
            }
        }
    }
    
    if (removedIron < 2 || removedCoal < 1) {
        setMessage('❌ Не хватает ресурсов.');
        return;
    }
    
    var smithLevel = g.professions['Кузнец'] || 1;
    var roll = Math.random() * 100;
    var quality = 'Обычное';
    
    if (smithLevel >= 30 && roll < 5) quality = 'Легендарное';
    else if (smithLevel >= 20 && roll < 15) quality = 'Мастерское';
    else if (smithLevel >= 10 && roll < 35) quality = 'Качественное';
    else if (smithLevel >= 5 && roll < 60) quality = 'Хорошее';
    else if (roll < 80) quality = 'Обычное';
    else quality = 'Плохое';
    
    addToInventory(g, {
        name: 'Сталь',
        quality: quality,
        type: 'resource',
        resourceType: 'steel',
        count: 1
    });
    
    g.professionXp['Кузнец'] = (g.professionXp['Кузнец'] || 0) + Math.round(3);
    while (g.professionXp['Кузнец'] >= g.professions['Кузнец'] * 10) {
        g.professionXp['Кузнец'] -= g.professions['Кузнец'] * 10;
        g.professions['Кузнец']++;
        setMessage('👷 Кузнец повышен до ' + g.professions['Кузнец'] + ' уровня!');
    }
    
    saveData();
    setMessage('✅ Вы скрафтили сталь (' + quality + ')!');
    openCraftMenu();
}

// ============================================================
// 3. ТАВЕРНА
// ============================================================

function openTavernTrade() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var modal = document.getElementById('modal-trade');
    var content = document.getElementById('modal-trade-content');
    
    var html = '<div class="modal-section"><h4>🍺 ТАВЕРНА</h4>';
    html += '<p style="color:#6a5a48;">💰 ' + formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper) + '</p>';
    html += '</div>';
    
    // ЕДА
    html += '<div class="modal-section"><h4>🍽️ ЕДА</h4>';
    if (typeof CONSUMABLES !== 'undefined' && CONSUMABLES.food) {
        CONSUMABLES.food.forEach(function(item) {
            var price = item.price || 5;
            html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label">' + item.name + '</span>';
            html += '<span class="value">' + formatCurrency(price) + ' <button class="btn btn-small" onclick="buyTavernItem(\'' + item.name + '\',' + price + ',\'food\')">Купить</button></span>';
            html += '</div>';
        });
    }
    html += '</div>';
    
    // НАПИТКИ
    html += '<div class="modal-section"><h4>🍷 НАПИТКИ</h4>';
    if (typeof CONSUMABLES !== 'undefined' && CONSUMABLES.drinks) {
        CONSUMABLES.drinks.forEach(function(item) {
            var price = item.price || 5;
            html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label">' + item.name + '</span>';
            html += '<span class="value">' + formatCurrency(price) + ' <button class="btn btn-small" onclick="buyTavernItem(\'' + item.name + '\',' + price + ',\'drink\')">Купить</button></span>';
            html += '</div>';
        });
    }
    html += '</div>';
    
    // ЗЕЛЬЯ
    html += '<div class="modal-section"><h4>🧪 ЗЕЛЬЯ</h4>';
    if (typeof CONSUMABLES !== 'undefined' && CONSUMABLES.potions) {
        CONSUMABLES.potions.forEach(function(item) {
            var price = item.price || 30;
            html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label">' + item.name + '</span>';
            html += '<span class="value">' + formatCurrency(price) + ' <button class="btn btn-small" onclick="buyTavernItem(\'' + item.name + '\',' + price + ',\'potion\')">Купить</button></span>';
            html += '</div>';
        });
    }
    html += '</div>';
    
    // КНИГИ
    html += '<div class="modal-section"><h4>📚 КНИГИ</h4>';
    if (typeof CONSUMABLES !== 'undefined' && CONSUMABLES.books) {
        CONSUMABLES.books.forEach(function(item) {
            var price = item.price || 100;
            html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label">' + item.name + '</span>';
            html += '<span class="value">' + formatCurrency(price) + ' <button class="btn btn-small" onclick="buyTavernItem(\'' + item.name + '\',' + price + ',\'book\')">Купить</button></span>';
            html += '</div>';
        });
    }
    html += '</div>';
    
    // ПРОДАЖА
    html += '<div class="modal-section"><h4>💰 ПРОДАТЬ</h4>';
    var sellItems = [];
    g.inventory.forEach(function(item, index) {
        if (item.type === 'food' || (item.effect && (item.effect.food || item.effect.thirst || item.effect.hp)) || item.isBook) {
            var price = 0;
            if (item.name.includes('Хлеб')) price = 3;
            else if (item.name.includes('Мясо')) price = 5;
            else if (item.name.includes('Рыба')) price = 4;
            else if (item.name.includes('Вода')) price = 1;
            else if (item.name.includes('Эль')) price = 3;
            else if (item.name.includes('Вино')) price = 4;
            else if (item.isBook) price = Math.round(item.xp * 2);
            else if (item.effect) {
                if (item.effect.food) price = Math.floor(item.effect.food / 2);
                else if (item.effect.thirst) price = Math.floor(item.effect.thirst / 2);
                else if (item.effect.hp) price = Math.floor(item.effect.hp / 2);
            }
            if (price > 0) {
                var countDisplay = '';
                if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
                sellItems.push({ index: index, label: item.name + ' (' + (item.quality || 'Обычное') + ')' + countDisplay, price: price });
            }
        }
    });
    if (sellItems.length === 0) {
        html += '<p style="color:#6a5a48;">Нет предметов для продажи.</p>';
    } else {
        sellItems.forEach(function(item) {
            html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label" style="font-size:13px;">' + item.label + '</span>';
            html += '<span class="value">' + formatCurrency(item.price) + ' <button class="btn btn-small" onclick="sellTavernItem(' + item.index + ',' + item.price + ')">💰 Продать</button></span>';
            html += '</div>';
        });
    }
    html += '</div>';
    
    html += '<button class="btn" onclick="closeTrade()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function buyTavernItem(itemName, price, category) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!spendMoney(g, price)) {
        setMessage('❌ Недостаточно денег! Нужно: ' + formatCurrency(price));
        return;
    }
    
    var item = { name: itemName, quality: 'Обычное', count: 1 };
    
    // Определяем тип предмета
    if (category === 'food') {
        item.type = 'food';
        var foodEffects = { '🍞 Хлеб': 20, '🥩 Мясо': 30, '🐟 Рыба': 25, '🧀 Сыр': 22, '🍎 Яблоко': 15 };
        item.effect = { food: foodEffects[itemName] || 20 };
    } else if (category === 'drink') {
        item.type = 'food';
        var drinkEffects = {
            '💧 Вода': { thirst: 15 },
            '🍺 Эль': { hp: 5, thirst: 10 },
            '🍷 Вино': { hp: 8, thirst: 15 },
            '🥛 Молоко': { food: 10, thirst: 10 }
        };
        item.effect = drinkEffects[itemName] || { thirst: 10 };
    } else if (category === 'potion') {
        item.type = 'food';
        var potionEffects = {
            '🧪 Малое зелье здоровья': { hp: 20 },
            '🧪 Среднее зелье здоровья': { hp: 50 },
            '🧪 Большое зелье здоровья': { hp: 100 },
            '🧪 Зелье восстановления': { hp: 50, fatigue: 30 },
            '🧪 Зелье выносливости': { hp: 10, fatigue: 20 }
        };
        item.effect = potionEffects[itemName] || { hp: 20 };
    } else if (category === 'book') {
        item.isBook = true;
        item.type = 'book';
        var bookData = CONSUMABLES.books.find(function(b) { return b.name === itemName; });
        if (bookData) {
            item.level = bookData.level;
            item.xp = bookData.xp;
        }
    }
    
    addToInventory(g, item);
    saveData();
    setMessage('✅ Вы купили ' + itemName);
    openTavernTrade();
}

function sellTavernItem(index, price) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (index >= g.inventory.length) {
        setMessage('❌ Предмет не найден.');
        return;
    }
    
    var item = g.inventory[index];
    var count = item.count || 1;
    var totalPrice = price * count;
    
    g.copper += totalPrice;
    convertCurrency(g);
    g.inventory.splice(index, 1);
    
    saveData();
    setMessage('💰 Вы продали ' + item.name + ' за ' + formatCurrency(totalPrice));
    openTavernTrade();
}

// ============================================================
// 4. АУКЦИОН
// ============================================================

function openGuild() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var modal = document.getElementById('modal-guild');
    var content = document.getElementById('modal-guild-content');
    
    var html = '<div class="modal-section"><h4>🏛️ ГИЛЬДИЯ ТОРГОВЦЕВ</h4>';
    html += '<p style="color:#6a5a48;">Комиссия: 1% от цены. Срок: 7 дней.</p></div>';
    html += '<div class="tabs">';
    html += '<button class="tab-btn" onclick="showGuildListings()">🛒 Все лоты</button>';
    html += '<button class="tab-btn" onclick="showGuildMyListings()">📦 Мои лоты</button>';
    html += '<button class="tab-btn" onclick="showGuildSell()">💰 Выставить</button>';
    html += '</div>';
    html += '<div id="guild-content" class="modal-section"></div>';
    html += '<button class="btn" onclick="closeGuild()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
    
    showGuildListings();
}

function closeGuild() {
    document.getElementById('modal-guild').classList.add('hide');
}

function showGuildListings() {
    var container = document.getElementById('guild-content');
    var html = '<h4>🛒 Все лоты</h4>';
    if (marketListings.length === 0) {
        html += '<p style="color:#6a5a48;">Нет активных лотов.</p>';
    } else {
        marketListings.forEach(function(listing, index) {
            var daysLeft = Math.ceil((listing.listedAt + 7 * 24 * 60 * 60 * 1000 - Date.now()) / (24 * 60 * 60 * 1000));
            html += '<div class="row" style="padding:4px 0;">';
            html += '<span class="label">' + listing.item.name + ' (' + (listing.item.quality || 'Обычное') + ')</span>';
            html += '<span class="value">' + formatCurrency(listing.price) + ' <button class="btn btn-small" onclick="buyListing(' + index + ')">Купить</button>';
            html += ' <span style="font-size:11px;color:#6a5a48;">' + daysLeft + ' дн.</span></span>';
            html += '</div>';
        });
    }
    container.innerHTML = html;
}

function showGuildMyListings() {
    var container = document.getElementById('guild-content');
    var myListings = [];
    marketListings.forEach(function(l) {
        if (l.seller === currentUser) myListings.push(l);
    });
    var html = '<h4>📦 Мои лоты</h4>';
    if (myListings.length === 0) {
        html += '<p style="color:#6a5a48;">У вас нет активных лотов.</p>';
    } else {
        myListings.forEach(function(listing) {
            var realIndex = marketListings.indexOf(listing);
            var daysLeft = Math.ceil((listing.listedAt + 7 * 24 * 60 * 60 * 1000 - Date.now()) / (24 * 60 * 60 * 1000));
            html += '<div class="row" style="padding:4px 0;">';
            html += '<span class="label">' + listing.item.name + ' (' + (listing.item.quality || 'Обычное') + ')</span>';
            html += '<span class="value">' + formatCurrency(listing.price) + ' <button class="btn btn-small" style="background:#3d2a1a;" onclick="removeListing(' + realIndex + ')">Снять</button>';
            html += ' <span style="font-size:11px;color:#6a5a48;">' + daysLeft + ' дн.</span></span>';
            html += '</div>';
        });
    }
    container.innerHTML = html;
}

function showGuildSell() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var container = document.getElementById('guild-content');
    var html = '<h4>💰 Выставить предмет</h4>';
    if (g.inventory.length === 0) {
        html += '<p style="color:#6a5a48;">У вас нет предметов для продажи.</p>';
    } else {
        html += '<p style="color:#6a5a48;">Выберите предмет:</p>';
        g.inventory.forEach(function(item, index) {
            var countDisplay = '';
            if (item.count && item.count > 1) countDisplay = ' ×' + item.count;
            html += '<div class="row" style="padding:4px 0;">';
            html += '<span class="label">' + item.name + ' (' + (item.quality || 'Обычное') + ')' + countDisplay + '</span>';
            html += '<span class="value"><button class="btn btn-small" onclick="sellItemToMarket(' + index + ')">Выставить</button></span>';
            html += '</div>';
        });
    }
    container.innerHTML = html;
}

function sellItemToMarket(itemIndex) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (itemIndex >= g.inventory.length) {
        setMessage('❌ Предмет не найден.');
        return;
    }
    
    var item = g.inventory[itemIndex];
    var priceInput = prompt(
        'Введите цену:\n' +
        'Примеры:\n' +
        '• 100 (медь)\n' +
        '• 5 ЗОЛ (золото)\n' +
        '• 2 СО (серебро)\n' +
        '• 1 ЗОЛ 50 МП'
    );
    
    if (!priceInput) { setMessage('❌ Отменено.'); return; }
    var price = parseCurrencyInput(priceInput);
    if (price === null || price < 1) { setMessage('❌ Цена должна быть не менее 1 МП.'); return; }
    
    var commission = Math.ceil(price * 0.01);
    if (!spendMoney(g, commission)) {
        setMessage('❌ Недостаточно денег для комиссии (' + formatCurrency(commission) + ').');
        return;
    }
    
    var itemCopy = JSON.parse(JSON.stringify(item));
    g.inventory.splice(itemIndex, 1);
    marketListings.push({
        item: itemCopy,
        price: price,
        seller: currentUser,
        listedAt: Date.now()
    });
    
    saveData();
    setMessage('✅ Вы выставили ' + item.name + ' на продажу за ' + formatCurrency(price));
    openGuild();
}

function buyListing(index) {
    if (index >= marketListings.length) {
        setMessage('❌ Лот не найден.');
        return;
    }
    
    var listing = marketListings[index];
    if (listing.seller === currentUser) {
        setMessage('❌ Вы не можете купить свой лот.');
        return;
    }
    
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!spendMoney(g, listing.price)) {
        setMessage('❌ Недостаточно денег для покупки.');
        return;
    }
    
    addToInventory(g, listing.item);
    var seller = users[listing.seller];
    if (seller) {
        seller.game.copper += listing.price;
        convertCurrency(seller.game);
        saveData();
    }
    
    marketListings.splice(index, 1);
    saveData();
    setMessage('✅ Вы купили ' + listing.item.name + ' за ' + formatCurrency(listing.price));
    openGuild();
}

function removeListing(index) {
    if (index >= marketListings.length) {
        setMessage('❌ Лот не найден.');
        return;
    }
    
    var listing = marketListings[index];
    if (listing.seller !== currentUser) {
        setMessage('❌ Это не ваш лот.');
        return;
    }
    
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    addToInventory(g, listing.item);
    marketListings.splice(index, 1);
    saveData();
    setMessage('✅ Вы сняли лот.');
    openGuild();
}

// ============================================================
// 5. ЗАКРЫТИЕ МОДАЛЬНЫХ ОКОН
// ============================================================

function closeTrade() {
    var modal = document.getElementById('modal-trade');
    if (modal) modal.classList.add('hide');
}

// ============================================================
// 6. РЕГИСТРАЦИЯ В ГЛОБАЛЬНУЮ ОБЛАСТЬ
// ============================================================

window.openShop = openShop;
window.openCraftMenu = openCraftMenu;
window.openGuild = openGuild;
window.openTavernTrade = openTavernTrade;
window.closeTrade = closeTrade;
window.closeGuild = closeGuild;
window.buyFromShop = buyFromShop;
window.sellToShop = sellToShop;
window.buyTavernItem = buyTavernItem;
window.sellTavernItem = sellTavernItem;
window.craftSteel = craftSteel;
window.showGuildListings = showGuildListings;
window.showGuildMyListings = showGuildMyListings;
window.showGuildSell = showGuildSell;
window.sellItemToMarket = sellItemToMarket;
window.buyListing = buyListing;
window.removeListing = removeListing;

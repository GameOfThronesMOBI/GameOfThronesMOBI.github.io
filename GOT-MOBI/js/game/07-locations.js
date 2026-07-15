// ============================================================
// js/game/07-locations.js — ТОРГОВЛЯ, КРАФТ, АУКЦИОН (ПОЛНЫЙ ФАЙЛ)
// ============================================================

function openShop(shopType) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var modal = document.getElementById('modal-trade');
    var content = document.getElementById('modal-trade-content');
    
    var categories = getShopCategories(shopType);
    
    var html = '<div class="modal-section"><h4>🏪 ' + shopType + '</h4>';
    html += '<p style="color:#6a5a48;">💰 ' + formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper) + '</p>';
    html += '</div>';
    
    html += '<div class="modal-section"><h4>📂 РАЗДЕЛЫ</h4>';
    html += '<div class="tabs" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;">';
    categories.forEach(function(cat) {
        html += '<button class="tab-btn" onclick="openCategory(\'' + shopType + '\',\'' + cat.id + '\')">' + cat.label + '</button>';
    });
    html += '</div>';
    html += '<div id="shop-category-content"></div>';
    html += '</div>';
    
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
    
    if (categories.length > 0) {
        openCategory(shopType, categories[0].id);
    }
}

function getShopCategories(shopType) {
    if (shopType === 'Кожевник') {
        return [
            { id: 'leather', label: '🧵 Кожа (ресурс)' },
            { id: 'helmet', label: '🪖 Шлемы' },
            { id: 'chestplate', label: '🦺 Нагрудники' },
            { id: 'shoulders', label: '💪 Наплечники' },
            { id: 'leggings', label: '👖 Поножи' },
            { id: 'boots', label: '👢 Сапоги' },
            { id: 'gloves', label: '🧤 Перчатки' },
            { id: 'belt', label: '🎗️ Пояса' }
        ];
    }
    if (shopType === 'КожевникРесурсы') {
        return [{ id: 'leather', label: '🧵 Кожа' }];
    }
    if (shopType === 'ТорговляКожа') {
        return [
            { id: 'helmet', label: '🪖 Шлемы' },
            { id: 'chestplate', label: '🦺 Нагрудники' },
            { id: 'shoulders', label: '💪 Наплечники' },
            { id: 'leggings', label: '👖 Поножи' },
            { id: 'boots', label: '👢 Сапоги' },
            { id: 'gloves', label: '🧤 Перчатки' },
            { id: 'belt', label: '🎗️ Пояса' }
        ];
    }
    if (shopType === 'Плотник') {
        return [
            { id: 'wood', label: '🪵 Дерево (ресурс)' },
            { id: 'bow', label: '🏹 Луки' },
            { id: 'crossbow', label: '🎯 Арбалеты' }
        ];
    }
    if (shopType === 'ПлотникРесурсы') {
        return [{ id: 'wood', label: '🪵 Дерево' }];
    }
    if (shopType === 'ТорговляДерево') {
        return [
            { id: 'bow', label: '🏹 Луки' },
            { id: 'crossbow', label: '🎯 Арбалеты' }
        ];
    }
    if (shopType === 'Кузница') {
        return [
            { id: 'iron', label: '⛏️ Руда' },
            { id: 'coal', label: '🔥 Уголь' },
            { id: 'steel', label: '⚒️ Сталь' },
            { id: 'valyrian_ore', label: '💎 Руда 14 огней' },
            { id: 'valyrian_steel', label: '🌟 Валирийская сталь' }
        ];
    }
    if (shopType === 'Торговля') {
        return [
            { id: 'sword', label: '🗡️ Мечи' },
            { id: 'spear', label: '🔱 Копья' },
            { id: 'axe', label: '🪓 Топоры' },
            { id: 'mace', label: '🔨 Булавы' },
            { id: 'dagger', label: '🔪 Кинжалы' },
            { id: 'shield', label: '🛡️ Щиты' },
            { id: 'helmet', label: '🪖 Шлемы' },
            { id: 'chestplate', label: '🦺 Нагрудники' },
            { id: 'shoulders', label: '💪 Наплечники' },
            { id: 'leggings', label: '👖 Поножи' },
            { id: 'boots', label: '👢 Сапоги' },
            { id: 'gloves', label: '🧤 Перчатки' },
            { id: 'belt', label: '🎗️ Пояса' }
        ];
    }
    return [];
}

function openCategory(shopType, categoryId) {
    var container = document.getElementById('shop-category-content');
    if (!container) return;
    
    var items = getCategoryItems(shopType, categoryId);
    
    var categoryNames = {
        'sword': '🗡️ Мечи', 'spear': '🔱 Копья', 'axe': '🪓 Топоры',
        'mace': '🔨 Булавы', 'dagger': '🔪 Кинжалы', 'shield': '🛡️ Щиты',
        'bow': '🏹 Луки', 'crossbow': '🎯 Арбалеты',
        'helmet': '🪖 Шлемы', 'chestplate': '🦺 Нагрудники',
        'shoulders': '💪 Наплечники', 'leggings': '👖 Поножи',
        'boots': '👢 Сапоги', 'gloves': '🧤 Перчатки',
        'belt': '🎗️ Пояса', 'cloak': '🧥 Плащи',
        'leather': '🧵 Кожа', 'steel': '⚒️ Сталь',
        'wood': '🪵 Дерево', 'iron': '⛏️ Руда',
        'coal': '🔥 Уголь', 'valyrian_ore': '💎 Руда 14 огней',
        'valyrian_steel': '🌟 Валирийская сталь'
    };
    
    var html = '<h4>' + (categoryNames[categoryId] || categoryId) + '</h4>';
    
    if (items.length === 0) {
        html += '<p style="color:#6a5a48;">Нет предметов в этом разделе.</p>';
    } else {
        var grouped = {};
        items.forEach(function(item) {
            var key = item.name;
            if (!grouped[key]) {
                grouped[key] = { name: item.name, level: item.level, stats: item.stats, qualities: [] };
            }
            grouped[key].qualities.push({
                quality: item.quality, price: item.price, key: item.key, stock: item.stock || 99
            });
        });
        
        html += '<div style="margin-top:10px;">';
        for (var name in grouped) {
            var data = grouped[name];
            var firstQ = data.qualities[0] || { quality: 'Обычное' };
            var qData = QUALITIES[firstQ.quality] || QUALITIES['Обычное'];
            html += '<div class="row" style="padding:8px 0; border-bottom:1px solid #1a1410;">';
            html += '<div style="flex:1;">';
            html += '<strong style="color:' + qData.color + ';">' + data.name + '</strong>';
            html += ' <span style="color:#6a5a48;font-size:11px;">(ур.' + data.level + ')</span>';
            if (data.stats) html += '<br><span style="font-size:11px;color:#b8a890;">' + data.stats + '</span>';
            html += '</div>';
            html += '<div style="text-align:right;">';
            html += '<button class="btn btn-small" onclick="openQualityModal(\'' + shopType + '\',\'' + name + '\',' + data.level + ',\'' + (data.stats || '') + '\')">🔍 Выбрать</button>';
            html += '</div>';
            html += '</div>';
        }
        html += '</div>';
    }
    
    container.innerHTML = html;
}

function getCategoryItems(shopType, categoryId) {
    var items = [];
    
    if (shopType === 'Кожевник' || shopType === 'КожевникРесурсы') {
        if (categoryId === 'leather') {
            ['Плохое','Обычное','Хорошее','Качественное','Мастерское','Легендарное'].forEach(function(quality) {
                var q = QUALITIES[quality] || QUALITIES['Обычное'];
                var key = 'Кожа|' + quality;
                items.push({
                    name: '🧵 Кожа', quality: quality, price: Math.round(5 * q.multiplier), key: key,
                    stats: '📦 ресурс', level: 1, stock: getTraderStock('Кожевник', key)
                });
            });
        }
    }
    if (shopType === 'Кожевник' || shopType === 'ТорговляКожа') {
        if (categoryId !== 'leather' && ALL_ITEMS && ALL_ITEMS.leather && ALL_ITEMS.leather[categoryId]) {
            ALL_ITEMS.leather[categoryId].forEach(function(w) {
                getQualitiesForLevel(w.level).forEach(function(quality) {
                    var q = QUALITIES[quality] || QUALITIES['Обычное'];
                    var price = Math.round((5 + w.level * 2 + (w.baseDefense || 0)) * q.multiplier);
                    var key = w.name + '|' + quality;
                    var stats = '🛡️ ' + Math.round((w.baseDefense || 0) * q.multiplier) + ' защиты';
                    items.push({
                        name: w.name, quality: quality, price: price, key: key,
                        stats: stats, level: w.level, stock: getTraderStock('Кожевник', key)
                    });
                });
            });
        }
    }
    
    if (shopType === 'Плотник' || shopType === 'ПлотникРесурсы') {
        if (categoryId === 'wood') {
            ['Плохое','Обычное','Хорошее','Качественное','Мастерское','Легендарное'].forEach(function(quality) {
                var q = QUALITIES[quality] || QUALITIES['Обычное'];
                var key = 'Дерево|' + quality;
                items.push({
                    name: '🪵 Дерево', quality: quality, price: Math.round(3 * q.multiplier), key: key,
                    stats: '📦 ресурс', level: 1, stock: getTraderStock('Плотник', key)
                });
            });
        }
    }
    if (shopType === 'Плотник' || shopType === 'ТорговляДерево') {
        if (categoryId !== 'wood' && ALL_ITEMS && ALL_ITEMS.weapons && ALL_ITEMS.weapons[categoryId]) {
            ALL_ITEMS.weapons[categoryId].forEach(function(w) {
                getQualitiesForLevel(w.level).forEach(function(quality) {
                    var q = QUALITIES[quality] || QUALITIES['Обычное'];
                    var price = Math.round((5 + w.level * 2 + (w.baseDamage || 0)) * q.multiplier);
                    var key = w.name + '|' + quality;
                    var stats = '⚔️ ' + Math.round((w.baseDamage || 0) * q.multiplier) + ' урона';
                    items.push({
                        name: w.name, quality: quality, price: price, key: key,
                        stats: stats, level: w.level, stock: getTraderStock('Плотник', key)
                    });
                });
            });
        }
    }
    
    if (shopType === 'Кузница') {
        var resourceNames = {
            'iron': { name: '⛏️ Руда железная', basePrice: 8 },
            'coal': { name: '🔥 Уголь', basePrice: 4 },
            'steel': { name: '⚒️ Сталь', basePrice: 20 },
            'valyrian_ore': { name: '💎 Руда 14 огней', basePrice: 50000 },
            'valyrian_steel': { name: '🌟 Валирийская сталь', basePrice: 100000 }
        };
        var res = resourceNames[categoryId];
        if (res) {
            var resQualities = ['Плохое','Обычное','Хорошее','Качественное','Мастерское','Легендарное'];
            if (categoryId === 'valyrian_ore' || categoryId === 'valyrian_steel') resQualities = ['Мифическое'];
            resQualities.forEach(function(quality) {
                var q = QUALITIES[quality] || QUALITIES['Обычное'];
                var key = res.name + '|' + quality;
                items.push({
                    name: res.name, quality: quality, price: Math.round(res.basePrice * q.multiplier), key: key,
                    stats: '📦 ресурс', level: 1, stock: getTraderStock('Кузница', key)
                });
            });
        }
    }
    
    if (shopType === 'Торговля') {
        if (['sword','spear','axe','mace','dagger','shield'].indexOf(categoryId) !== -1) {
            if (ALL_ITEMS && ALL_ITEMS.weapons && ALL_ITEMS.weapons[categoryId]) {
                ALL_ITEMS.weapons[categoryId].forEach(function(w) {
                    getQualitiesForLevel(w.level).forEach(function(quality) {
                        var q = QUALITIES[quality] || QUALITIES['Обычное'];
                        var price = Math.round((5 + w.level * 2 + (w.baseDamage || 0)) * q.multiplier);
                        var key = w.name + '|' + quality;
                        var stats = '⚔️ ' + Math.round((w.baseDamage || 0) * q.multiplier) + ' урона';
                        items.push({
                            name: w.name, quality: quality, price: price, key: key,
                            stats: stats, level: w.level, stock: getTraderStock('Кузница', key)
                        });
                    });
                });
            }
        }
        if (['helmet','chestplate','shoulders','leggings','boots','gloves','belt'].indexOf(categoryId) !== -1) {
            if (ALL_ITEMS && ALL_ITEMS.plate && ALL_ITEMS.plate[categoryId]) {
                ALL_ITEMS.plate[categoryId].forEach(function(w) {
                    getQualitiesForLevel(w.level).forEach(function(quality) {
                        var q = QUALITIES[quality] || QUALITIES['Обычное'];
                        var price = Math.round((5 + w.level * 2 + (w.baseDefense || 0)) * q.multiplier);
                        var key = w.name + '|' + quality;
                        var stats = '🛡️ ' + Math.round((w.baseDefense || 0) * q.multiplier) + ' защиты';
                        items.push({
                            name: w.name, quality: quality, price: price, key: key,
                            stats: stats, level: w.level, stock: getTraderStock('Кузница', key)
                        });
                    });
                });
            }
        }
    }
    
    return items;
}

function getQualitiesForLevel(level) {
    var qualities = ['Плохое','Обычное','Хорошее','Качественное'];
    if (level >= 40) qualities.push('Мастерское');
    if (level >= 60) qualities.push('Легендарное');
    if (level >= 80) qualities.push('Мифическое');
    if (level <= 1) qualities.unshift('Рваное');
    return qualities;
}

function openQualityModal(shopType, itemName, level, stats) {
    var modal = document.getElementById('modal-quality');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-quality';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeQualityModal(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🔍 ВЫБОР КАЧЕСТВА</h3><button class="close-btn" onclick="closeQualityModal()">✕</button></div><div id="modal-quality-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-quality-content');
    var allItems = [];
    var categories = getShopCategories(shopType);
    categories.forEach(function(cat) {
        var items = getCategoryItems(shopType, cat.id);
        items.forEach(function(item) { if (item.name === itemName) allItems.push(item); });
    });
    
    var qualities = [];
    var seen = {};
    allItems.forEach(function(item) {
        if (!seen[item.quality]) {
            seen[item.quality] = true;
            qualities.push({ quality: item.quality, price: item.price, key: item.key, stock: item.stock || 99, stats: item.stats });
        }
    });
    
    var qualityOrder = ['Рваное','Плохое','Обычное','Хорошее','Качественное','Мастерское','Легендарное','Мифическое'];
    qualities.sort(function(a, b) { return qualityOrder.indexOf(a.quality) - qualityOrder.indexOf(b.quality); });
    
    var firstQuality = qualities.length > 0 ? qualities[0].quality : 'Обычное';
    var firstQData = QUALITIES[firstQuality] || QUALITIES['Обычное'];
    
    var html = '<div class="modal-section"><h4 style="color:' + firstQData.color + ';">🔍 ' + itemName + ' (ур.' + level + ')</h4>';
    if (stats) html += '<p style="color:#6a5a48;font-size:12px;">' + stats + '</p>';
    html += '<p style="color:#6a5a48;font-size:12px;">Выберите качество:</p><div style="margin-top:10px;">';
    
    if (qualities.length === 0) {
        html += '<p style="color:#c96a5a;">❌ Нет доступных качеств для этого предмета.</p>';
    } else {
        qualities.forEach(function(q) {
            var qData = QUALITIES[q.quality] || QUALITIES['Обычное'];
            var canBuy = q.stock > 0;
            html += '<div class="row" style="padding:8px 0; border-bottom:1px solid #1a1410;">';
            html += '<div style="flex:1;"><span style="color:' + qData.color + '; font-weight:bold;">' + qData.emoji + ' ' + q.quality + '</span><br><span style="font-size:11px;color:#6a5a48;">📦 ' + q.stock + ' шт.</span></div>';
            html += '<div style="text-align:right;"><span style="color:#c9b694;">' + formatCurrency(q.price) + '</span>';
            if (canBuy) {
                html += ' <button class="btn btn-small" onclick="buyFromShop(\'' + shopType + '\',\'' + q.key + '\',' + q.price + '); closeQualityModal();">✅ Купить</button>';
            } else {
                html += ' <button class="btn btn-small" style="opacity:0.4;cursor:not-allowed;" disabled>❌ Нет</button>';
            }
            html += '</div></div>';
        });
    }
    
    html += '</div><button class="btn btn-secondary" onclick="closeQualityModal()" style="margin-top:10px;">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeQualityModal() {
    var modal = document.getElementById('modal-quality');
    if (modal) modal.classList.add('hide');
}

function buyFromShop(shopType, itemKey, price) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    if (!spendMoney(g, price)) { setMessage('❌ Недостаточно денег! Нужно: ' + formatCurrency(price)); return; }
    
    removeTraderStock(shopType, itemKey, 1);
    
    var parts = itemKey.split('|');
    var name = parts[0], quality = parts[1] || 'Обычное';
    var q = QUALITIES[quality] || QUALITIES['Обычное'];
    var item = { name: name, quality: quality, count: 1 }, found = false;
    
    if (ALL_ITEMS && ALL_ITEMS.weapons) {
        for (var type in ALL_ITEMS.weapons) {
            if (ALL_ITEMS.weapons[type]) {
                ALL_ITEMS.weapons[type].forEach(function(w) {
                    if (w.name === name) {
                        item.type = type; item.level = w.level;
                        if (w.baseDamage) { item.baseDamage = w.baseDamage; item.finalDamage = Math.round(w.baseDamage * q.multiplier); }
                        if (w.defense) { item.defense = w.defense; item.finalDefense = Math.round(w.defense * q.multiplier); }
                        found = true;
                    }
                });
            }
        }
    }
    if (!found && ALL_ITEMS && ALL_ITEMS.leather) {
        for (var type in ALL_ITEMS.leather) {
            if (ALL_ITEMS.leather[type]) {
                ALL_ITEMS.leather[type].forEach(function(w) {
                    if (w.name === name) {
                        item.type = type; item.armorClass = 'leather'; item.level = w.level;
                        if (w.baseDefense) { item.baseDefense = w.baseDefense; item.finalDefense = Math.round(Math.floor(w.baseDefense / 2) * q.multiplier); item.agilityBonus = item.finalDefense; }
                        found = true;
                    }
                });
            }
        }
    }
    if (!found && ALL_ITEMS && ALL_ITEMS.plate) {
        for (var type in ALL_ITEMS.plate) {
            if (ALL_ITEMS.plate[type]) {
                ALL_ITEMS.plate[type].forEach(function(w) {
                    if (w.name === name) {
                        item.type = type; item.armorClass = 'plate'; item.level = w.level;
                        if (w.baseDefense) { item.baseDefense = w.baseDefense; item.finalDefense = Math.round(w.baseDefense * q.multiplier); }
                        found = true;
                    }
                });
            }
        }
    }
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

function getSellableItems(g, shopType) {
    var items = [];
    var shopTypes = {
        'Кожевник': ['leather'], 'КожевникРесурсы': ['leather'], 'ТорговляКожа': ['leather'],
        'Плотник': ['bow','crossbow','wood'], 'ПлотникРесурсы': ['wood'], 'ТорговляДерево': ['bow','crossbow'],
        'Кузница': ['iron','coal','steel','valyrian_ore','valyrian_steel'],
        'Торговля': ['sword','spear','axe','mace','dagger','shield','plate']
    };
    var allowedTypes = shopTypes[shopType] || [];
    
    g.inventory.forEach(function(item, index) {
        var isAllowed = false;
        if (item.type === 'resource') { if (allowedTypes.indexOf(item.resourceType) !== -1) isAllowed = true; }
        if (['sword','spear','axe','mace','dagger','shield','bow','crossbow'].indexOf(item.type) !== -1) { if (allowedTypes.indexOf(item.type) !== -1) isAllowed = true; }
        if (item.armorClass) { if (allowedTypes.indexOf(item.armorClass) !== -1) isAllowed = true; }
        if (isAllowed) {
            var price = getItemPrice(item);
            var countDisplay = (item.count && item.count > 1) ? ' ×' + item.count : '';
            items.push({ index: index, label: item.name + ' (' + (item.quality || 'Обычное') + ')' + countDisplay, price: price });
        }
    });
    return items;
}

function getItemPrice(item) {
    var basePrice = 5;
    if (item.type === 'resource') {
        var rp = { leather:5, iron:8, wood:3, steel:20, coal:4, valyrian_ore:50000, valyrian_steel:100000 };
        basePrice = rp[item.resourceType] || 5;
    } else if (item.finalDamage) { basePrice = 5 + (item.level || 1) * 2 + (item.finalDamage || 0); }
    else if (item.finalDefense) { basePrice = 5 + (item.level || 1) * 2 + (item.finalDefense || 0); }
    else if (item.isBook) { basePrice = item.xp * 2 || 50; }
    else if (item.effect) { basePrice = item.effect.food || item.effect.thirst || item.effect.hp || 5; }
    var q = QUALITIES[item.quality] || QUALITIES['Обычное'];
    return Math.max(1, Math.round(basePrice * q.multiplier * 0.5));
}

function sellToShop(shopType, index) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    if (index >= g.inventory.length) { setMessage('❌ Предмет не найден.'); return; }
    var item = g.inventory[index];
    var price = getItemPrice(item);
    var count = item.count || 1;
    g.copper += price * count;
    convertCurrency(g);
    g.inventory.splice(index, 1);
    var quality = item.quality || 'Обычное';
    var key = item.name + '|' + quality;
    addTraderStock(shopType, key, count);
    saveData();
    setMessage('💰 Вы продали ' + item.name + ' за ' + formatCurrency(price * count));
    openShop(shopType);
}

// Крафт
function openCraftMenu() {
    var user = users[currentUser]; if (!user) return;
    var g = user.game;
    var modal = document.getElementById('modal-trade');
    var content = document.getElementById('modal-trade-content');
    var ironCount = 0, coalCount = 0, steelCount = 0;
    g.inventory.forEach(function(item) {
        if (item.resourceType === 'iron') ironCount += (item.count || 1);
        if (item.resourceType === 'coal') coalCount += (item.count || 1);
        if (item.resourceType === 'steel') steelCount += (item.count || 1);
    });
    var html = '<div class="modal-section"><h4>🔨 КРАФТ СТАЛИ</h4><p style="color:#6a5a48;">Ваши ресурсы:</p><div style="color:#b8a890;font-size:13px;margin-bottom:10px;">⛏️ Руда: ' + ironCount + '<br>🔥 Уголь: ' + coalCount + '<br>⚒️ Сталь: ' + steelCount + '</div></div>';
    html += '<div class="modal-section"><h4>⚒️ Создать сталь</h4><p style="color:#6a5a48;font-size:12px;">Требуется: 2 руды + 1 уголь</p>';
    html += '<button class="btn" onclick="craftSteel()" ' + (ironCount >= 2 && coalCount >= 1 ? '' : 'disabled') + '>' + (ironCount >= 2 && coalCount >= 1 ? '✅ Создать сталь' : '❌ Не хватает ресурсов') + '</button></div>';
    html += '<button class="btn" onclick="closeTrade()">Закрыть</button>';
    content.innerHTML = html; modal.classList.remove('hide');
}
function craftSteel() {
    var user = users[currentUser]; if (!user) return;
    var g = user.game;
    var removedIron = 0, removedCoal = 0;
    for (var i = g.inventory.length - 1; i >= 0; i--) {
        if (g.inventory[i].resourceType === 'iron' && removedIron < 2) {
            if (g.inventory[i].count > 1) { g.inventory[i].count--; removedIron++; if (g.inventory[i].count === 0) g.inventory.splice(i, 1); }
            else { g.inventory.splice(i, 1); removedIron++; }
        }
        if (g.inventory[i].resourceType === 'coal' && removedCoal < 1) {
            if (g.inventory[i].count > 1) { g.inventory[i].count--; removedCoal++; if (g.inventory[i].count === 0) g.inventory.splice(i, 1); }
            else { g.inventory.splice(i, 1); removedCoal++; }
        }
    }
    if (removedIron < 2 || removedCoal < 1) { setMessage('❌ Не хватает ресурсов.'); return; }
    var smithLevel = g.professions['Кузнец'] || 1, roll = Math.random() * 100, quality = 'Обычное';
    if (smithLevel >= 30 && roll < 5) quality = 'Легендарное';
    else if (smithLevel >= 20 && roll < 15) quality = 'Мастерское';
    else if (smithLevel >= 10 && roll < 35) quality = 'Качественное';
    else if (smithLevel >= 5 && roll < 60) quality = 'Хорошее';
    else if (roll < 80) quality = 'Обычное';
    else quality = 'Плохое';
    addToInventory(g, { name:'Сталь', quality:quality, type:'resource', resourceType:'steel', count:1 });
    g.professionXp['Кузнец'] = (g.professionXp['Кузнец'] || 0) + 3;
    while (g.professionXp['Кузнец'] >= g.professions['Кузнец'] * 10) { g.professionXp['Кузнец'] -= g.professions['Кузнец'] * 10; g.professions['Кузнец']++; }
    saveData(); setMessage('✅ Вы скрафтили сталь (' + quality + ')!'); openCraftMenu();
}

function openCraftLeatherMenu() {
    var user = users[currentUser]; if (!user) return;
    var g = user.game;
    var modal = document.getElementById('modal-trade');
    var content = document.getElementById('modal-trade-content');
    var skinCount = 0, leatherCount = 0;
    g.inventory.forEach(function(item) {
        if (item.resourceType === 'leather' && item.name === 'Шкура') skinCount += (item.count || 1);
        if (item.resourceType === 'leather' && item.name === 'Кожа') leatherCount += (item.count || 1);
    });
    var html = '<div class="modal-section"><h4>🔨 КРАФТ КОЖИ</h4><p style="color:#6a5a48;">Ваши ресурсы:</p><div style="color:#b8a890;font-size:13px;margin-bottom:10px;">🧵 Шкуры: ' + skinCount + '<br>🧵 Кожа: ' + leatherCount + '</div></div>';
    html += '<div class="modal-section"><h4>🧵 Выделать кожу</h4><p style="color:#6a5a48;font-size:12px;">Требуется: 3 шкуры</p>';
    html += '<button class="btn" onclick="craftLeather()" ' + (skinCount >= 3 ? '' : 'disabled') + '>' + (skinCount >= 3 ? '✅ Создать кожу' : '❌ Не хватает шкур') + '</button></div>';
    html += '<button class="btn" onclick="closeTrade()">Закрыть</button>';
    content.innerHTML = html; modal.classList.remove('hide');
}
function craftLeather() {
    var user = users[currentUser]; if (!user) return;
    var g = user.game;
    var removedSkins = 0;
    for (var i = g.inventory.length - 1; i >= 0; i--) {
        if (g.inventory[i].resourceType === 'leather' && g.inventory[i].name === 'Шкура' && removedSkins < 3) {
            if (g.inventory[i].count > 1) { g.inventory[i].count--; removedSkins++; if (g.inventory[i].count === 0) g.inventory.splice(i, 1); }
            else { g.inventory.splice(i, 1); removedSkins++; }
        }
    }
    if (removedSkins < 3) { setMessage('❌ Не хватает шкур.'); return; }
    var leatherLevel = g.professions['Кожевник'] || 1, roll = Math.random() * 100, quality = 'Обычное';
    if (leatherLevel >= 30 && roll < 5) quality = 'Легендарное';
    else if (leatherLevel >= 20 && roll < 15) quality = 'Мастерское';
    else if (leatherLevel >= 10 && roll < 35) quality = 'Качественное';
    else if (leatherLevel >= 5 && roll < 60) quality = 'Хорошее';
    else if (roll < 80) quality = 'Обычное';
    else quality = 'Плохое';
    addToInventory(g, { name:'Кожа', quality:quality, type:'resource', resourceType:'leather', count:1 });
    g.professionXp['Кожевник'] = (g.professionXp['Кожевник'] || 0) + 3;
    while (g.professionXp['Кожевник'] >= g.professions['Кожевник'] * 10) { g.professionXp['Кожевник'] -= g.professions['Кожевник'] * 10; g.professions['Кожевник']++; }
    saveData(); setMessage('✅ Вы выделяли кожу (' + quality + ')!'); openCraftLeatherMenu();
}

function openCraftWoodMenu() {
    var user = users[currentUser]; if (!user) return;
    var g = user.game;
    var modal = document.getElementById('modal-trade');
    var content = document.getElementById('modal-trade-content');
    var woodCount = 0, plankCount = 0;
    g.inventory.forEach(function(item) {
        if (item.resourceType === 'wood' && item.name === 'Дерево') woodCount += (item.count || 1);
        if (item.name === 'Доски') plankCount += (item.count || 1);
    });
    var html = '<div class="modal-section"><h4>🔨 КРАФТ ДЕРЕВА</h4><p style="color:#6a5a48;">Ваши ресурсы:</p><div style="color:#b8a890;font-size:13px;margin-bottom:10px;">🪵 Дерево: ' + woodCount + '<br>🪵 Доски: ' + plankCount + '</div></div>';
    html += '<div class="modal-section"><h4>🪵 Распилить доски</h4><p style="color:#6a5a48;font-size:12px;">Требуется: 2 дерева</p>';
    html += '<button class="btn" onclick="craftWood()" ' + (woodCount >= 2 ? '' : 'disabled') + '>' + (woodCount >= 2 ? '✅ Создать доски' : '❌ Не хватает дерева') + '</button></div>';
    html += '<button class="btn" onclick="closeTrade()">Закрыть</button>';
    content.innerHTML = html; modal.classList.remove('hide');
}
function craftWood() {
    var user = users[currentUser]; if (!user) return;
    var g = user.game;
    var removedWood = 0;
    for (var i = g.inventory.length - 1; i >= 0; i--) {
        if (g.inventory[i].resourceType === 'wood' && g.inventory[i].name === 'Дерево' && removedWood < 2) {
            if (g.inventory[i].count > 1) { g.inventory[i].count--; removedWood++; if (g.inventory[i].count === 0) g.inventory.splice(i, 1); }
            else { g.inventory.splice(i, 1); removedWood++; }
        }
    }
    if (removedWood < 2) { setMessage('❌ Не хватает дерева.'); return; }
    var woodLevel = g.professions['Плотник'] || 1, roll = Math.random() * 100, quality = 'Обычное';
    if (woodLevel >= 30 && roll < 5) quality = 'Легендарное';
    else if (woodLevel >= 20 && roll < 15) quality = 'Мастерское';
    else if (woodLevel >= 10 && roll < 35) quality = 'Качественное';
    else if (woodLevel >= 5 && roll < 60) quality = 'Хорошее';
    else if (roll < 80) quality = 'Обычное';
    else quality = 'Плохое';
    addToInventory(g, { name:'Доски', quality:quality, type:'resource', resourceType:'wood', count:1 });
    g.professionXp['Плотник'] = (g.professionXp['Плотник'] || 0) + 3;
    while (g.professionXp['Плотник'] >= g.professions['Плотник'] * 10) { g.professionXp['Плотник'] -= g.professions['Плотник'] * 10; g.professions['Плотник']++; }
    saveData(); setMessage('✅ Вы распилили доски (' + quality + ')!'); openCraftWoodMenu();
}

// Таверна
function openTavernTrade() {
    var user = users[currentUser]; if (!user) return;
    var g = user.game;
    var modal = document.getElementById('modal-trade');
    var content = document.getElementById('modal-trade-content');
    var html = '<div class="modal-section"><h4>🍺 ТАВЕРНА</h4><p style="color:#6a5a48;">💰 ' + formatCurrency(g.gold*210*56 + g.silver*56 + g.copper) + '</p></div>';
    html += '<div class="modal-section"><h4>📦 КУПИТЬ</h4>'; var hasItems = false;
    if (typeof CONSUMABLES !== 'undefined' && CONSUMABLES.food) {
        CONSUMABLES.food.forEach(function(item) { hasItems = true;
            html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;"><span class="label">' + item.name + '</span><span class="value">' + formatCurrency(item.price||5) + ' <button class="btn btn-small" onclick="buyFromConsumable(\'' + item.name + '\',' + (item.price||5) + ',\'food\')">Купить</button></span></div>';
        });
    }
    if (typeof CONSUMABLES !== 'undefined' && CONSUMABLES.drinks) {
        CONSUMABLES.drinks.forEach(function(item) { hasItems = true;
            html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;"><span class="label">' + item.name + '</span><span class="value">' + formatCurrency(item.price||5) + ' <button class="btn btn-small" onclick="buyFromConsumable(\'' + item.name + '\',' + (item.price||5) + ',\'drink\')">Купить</button></span></div>';
        });
    }
    if (!hasItems) html += '<p style="color:#6a5a48;">Нет товаров.</p>';
    html += '</div><div class="modal-section"><h4>💰 ПРОДАТЬ</h4>'; var sellItems = [];
    g.inventory.forEach(function(item, index) {
        if (item.type === 'food' || (item.effect && (item.effect.food || item.effect.thirst || item.effect.hp))) {
            var price = getItemPrice(item);
            if (price > 0) { var cd = (item.count && item.count > 1) ? ' ×' + item.count : ''; sellItems.push({ index:index, label:item.name + ' (' + (item.quality||'Обычное') + ')' + cd, price:price }); }
        }
    });
    if (sellItems.length === 0) { html += '<p style="color:#6a5a48;">Нет предметов для продажи.</p>'; }
    else { sellItems.forEach(function(item) { html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;"><span class="label" style="font-size:13px;">' + item.label + '</span><span class="value">' + formatCurrency(item.price) + ' <button class="btn btn-small" onclick="sellTavernItem(' + item.index + ',' + item.price + ')">💰 Продать</button></span></div>'; }); }
    html += '</div><button class="btn" onclick="closeTrade()">Закрыть</button>';
    content.innerHTML = html; modal.classList.remove('hide');
}
function buyFromConsumable(itemName, price, category) {
    var user = users[currentUser]; if (!user) return;
    var g = user.game;
    if (!spendMoney(g, price)) { setMessage('❌ Недостаточно денег!'); return; }
    var item = { name:itemName, quality:'Обычное', count:1 };
    if (category === 'food') { item.type = 'food'; if (typeof CONSUMABLES !== 'undefined' && CONSUMABLES.food) { CONSUMABLES.food.forEach(function(f) { if (f.name === itemName && f.effect) item.effect = f.effect; }); } if (!item.effect) item.effect = { food:20 }; }
    else if (category === 'drink') { item.type = 'food'; if (typeof CONSUMABLES !== 'undefined' && CONSUMABLES.drinks) { CONSUMABLES.drinks.forEach(function(d) { if (d.name === itemName && d.effect) item.effect = d.effect; }); } if (!item.effect) item.effect = { thirst:10 }; }
    addToInventory(g, item); saveData(); setMessage('✅ Вы купили ' + itemName); openTavernTrade();
}
function sellTavernItem(index, price) {
    var user = users[currentUser]; if (!user) return;
    var g = user.game; if (index >= g.inventory.length) { setMessage('❌ Предмет не найден.'); return; }
    var item = g.inventory[index]; var count = item.count || 1;
    g.copper += price * count; convertCurrency(g); g.inventory.splice(index, 1);
    saveData(); setMessage('💰 Вы продали ' + item.name + ' за ' + formatCurrency(price * count)); openTavernTrade();
}

// Аукцион
function openGuild() {
    var user = users[currentUser]; if (!user) return;
    var g = user.game;
    var modal = document.getElementById('modal-guild');
    var content = document.getElementById('modal-guild-content');
    var html = '<div class="modal-section"><h4>🏛️ ГИЛЬДИЯ ТОРГОВЦЕВ</h4><p style="color:#6a5a48;">Комиссия: 1% от цены. Срок: 7 дней.</p></div><div class="tabs"><button class="tab-btn" onclick="showGuildListings()">🛒 Все лоты</button><button class="tab-btn" onclick="showGuildMyListings()">📦 Мои лоты</button><button class="tab-btn" onclick="showGuildSell()">💰 Выставить</button></div><div id="guild-content" class="modal-section"></div><button class="btn" onclick="closeGuild()">Закрыть</button>';
    content.innerHTML = html; modal.classList.remove('hide'); showGuildListings();
}
function closeGuild() { document.getElementById('modal-guild').classList.add('hide'); }
function showGuildListings() {
    var container = document.getElementById('guild-content');
    var html = '<h4>🛒 Все лоты</h4>';
    if (marketListings.length === 0) { html += '<p style="color:#6a5a48;">Нет активных лотов.</p>'; }
    else { marketListings.forEach(function(listing, index) { var daysLeft = Math.ceil((listing.listedAt + 7*24*60*60*1000 - Date.now()) / (24*60*60*1000)); html += '<div class="row" style="padding:4px 0;"><span class="label">' + listing.item.name + ' (' + (listing.item.quality||'Обычное') + ')</span><span class="value">' + formatCurrency(listing.price) + ' <button class="btn btn-small" onclick="buyListing(' + index + ')">Купить</button> <span style="font-size:11px;color:#6a5a48;">' + daysLeft + ' дн.</span></span></div>'; }); }
    container.innerHTML = html;
}
function showGuildMyListings() {
    var container = document.getElementById('guild-content'); var myListings = [];
    marketListings.forEach(function(l) { if (l.seller === currentUser) myListings.push(l); });
    var html = '<h4>📦 Мои лоты</h4>';
    if (myListings.length === 0) { html += '<p style="color:#6a5a48;">У вас нет активных лотов.</p>'; }
    else { myListings.forEach(function(listing) { var realIndex = marketListings.indexOf(listing); var daysLeft = Math.ceil((listing.listedAt + 7*24*60*60*1000 - Date.now()) / (24*60*60*1000)); html += '<div class="row" style="padding:4px 0;"><span class="label">' + listing.item.name + ' (' + (listing.item.quality||'Обычное') + ')</span><span class="value">' + formatCurrency(listing.price) + ' <button class="btn btn-small" style="background:#3d2a1a;" onclick="removeListing(' + realIndex + ')">Снять</button> <span style="font-size:11px;color:#6a5a48;">' + daysLeft + ' дн.</span></span></div>'; }); }
    container.innerHTML = html;
}
function showGuildSell() {
    var user = users[currentUser]; if (!user) return;
    var g = user.game; var container = document.getElementById('guild-content');
    var html = '<h4>💰 Выставить предмет</h4>';
    if (g.inventory.length === 0) { html += '<p style="color:#6a5a48;">У вас нет предметов для продажи.</p>'; }
    else { html += '<p style="color:#6a5a48;">Выберите предмет:</p>'; g.inventory.forEach(function(item, index) { var cd = (item.count && item.count > 1) ? ' ×' + item.count : ''; html += '<div class="row" style="padding:4px 0;"><span class="label">' + item.name + ' (' + (item.quality||'Обычное') + ')' + cd + '</span><span class="value"><button class="btn btn-small" onclick="sellItemToMarket(' + index + ')">Выставить</button></span></div>'; }); }
    container.innerHTML = html;
}
function sellItemToMarket(itemIndex) {
    var user = users[currentUser]; if (!user) return;
    var g = user.game; if (itemIndex >= g.inventory.length) { setMessage('❌ Предмет не найден.'); return; }
    var item = g.inventory[itemIndex];
    var priceInput = prompt('Введите цену:\nПримеры:\n• 100 (медь)\n• 5 ЗОЛ (золото)\n• 2 СО (серебро)\n• 1 ЗОЛ 50 МП');
    if (!priceInput) { setMessage('❌ Отменено.'); return; }
    var price = parseCurrencyInput(priceInput);
    if (price === null || price < 1) { setMessage('❌ Цена должна быть не менее 1 МП.'); return; }
    var commission = Math.ceil(price * 0.01);
    if (!spendMoney(g, commission)) { setMessage('❌ Недостаточно денег для комиссии.'); return; }
    var itemCopy = JSON.parse(JSON.stringify(item)); g.inventory.splice(itemIndex, 1);
    marketListings.push({ item:itemCopy, price:price, seller:currentUser, listedAt:Date.now() });
    saveData(); setMessage('✅ Вы выставили ' + item.name + ' за ' + formatCurrency(price)); openGuild();
}
function buyListing(index) {
    if (index >= marketListings.length) { setMessage('❌ Лот не найден.'); return; }
    var listing = marketListings[index];
    if (listing.seller === currentUser) { setMessage('❌ Вы не можете купить свой лот.'); return; }
    var user = users[currentUser]; if (!user) return;
    var g = user.game;
    if (!spendMoney(g, listing.price)) { setMessage('❌ Недостаточно денег для покупки.'); return; }
    addToInventory(g, listing.item);
    var seller = users[listing.seller];
    if (seller) { seller.game.copper += listing.price; convertCurrency(seller.game); saveData(); }
    marketListings.splice(index, 1); saveData();
    setMessage('✅ Вы купили ' + listing.item.name + ' за ' + formatCurrency(listing.price)); openGuild();
}
function removeListing(index) {
    if (index >= marketListings.length) { setMessage('❌ Лот не найден.'); return; }
    var listing = marketListings[index];
    if (listing.seller !== currentUser) { setMessage('❌ Это не ваш лот.'); return; }
    var user = users[currentUser]; if (!user) return;
    var g = user.game; addToInventory(g, listing.item);
    marketListings.splice(index, 1); saveData(); setMessage('✅ Вы сняли лот.'); openGuild();
}
function closeTrade() { var modal = document.getElementById('modal-trade'); if (modal) modal.classList.add('hide'); }
function parseCurrencyInput(input) {
    input = input.trim().toUpperCase(); if (!input) return null; if (/^\d+$/.test(input)) return parseInt(input);
    var total = 0;
    var patterns = [{ regex:/(\d+)\s*ЗОЛ(ОТО)?/i, multiplier:210*56 },{ regex:/(\d+)\s*СО(РЕБРО)?/i, multiplier:56 },{ regex:/(\d+)\s*МП(ЕДЬ)?/i, multiplier:1 },{ regex:/(\d+)\s*G(OLD)?/i, multiplier:210*56 },{ regex:/(\d+)\s*S(ILVER)?/i, multiplier:56 },{ regex:/(\d+)\s*C(OPPER)?/i, multiplier:1 }];
    for (var pi = 0; pi < patterns.length; pi++) { var regex = new RegExp(patterns[pi].regex.source, 'gi'); var match; while ((match = regex.exec(input)) !== null) { var value = parseInt(match[1]); if (!isNaN(value)) total += value * patterns[pi].multiplier; } }
    if (total > 0) return total;
    var parts = input.split(' ');
    for (var i = 0; i < parts.length; i++) { var part = parts[i]; var num = parseInt(part); if (isNaN(num)) continue; var next = i + 1 < parts.length ? parts[i + 1] : ''; if (next === 'ЗОЛ' || next === 'ЗОЛОТО' || next === 'GOLD' || next === 'G') { total += num * 210 * 56; i++; } else if (next === 'СО' || next === 'СЕРЕБРО' || next === 'SILVER' || next === 'S') { total += num * 56; i++; } else if (next === 'МП' || next === 'МЕДЬ' || next === 'COPPER' || next === 'C') { total += num; i++; } else { total += num; } }
    return total;
}

// Регистрация
window.openShop = openShop;
window.openCraftMenu = openCraftMenu;
window.openCraftLeatherMenu = openCraftLeatherMenu;
window.openCraftWoodMenu = openCraftWoodMenu;
window.openGuild = openGuild;
window.openTavernTrade = openTavernTrade;
window.closeTrade = closeTrade;
window.closeGuild = closeGuild;
window.openCategory = openCategory;
window.openQualityModal = openQualityModal;
window.closeQualityModal = closeQualityModal;
window.buyFromShop = buyFromShop;
window.sellToShop = sellToShop;
window.buyFromConsumable = buyFromConsumable;
window.sellTavernItem = sellTavernItem;
window.craftSteel = craftSteel;
window.craftLeather = craftLeather;
window.craftWood = craftWood;
window.showGuildListings = showGuildListings;
window.showGuildMyListings = showGuildMyListings;
window.showGuildSell = showGuildSell;
window.sellItemToMarket = sellItemToMarket;
window.buyListing = buyListing;
window.removeListing = removeListing;

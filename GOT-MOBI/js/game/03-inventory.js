// ============================================================
// js/game/03-inventory.js — ИНВЕНТАРЬ И ЭКИПИРОВКА
// ============================================================

// ============================================================
// 1. ОТКРЫТИЕ ИНВЕНТАРЯ
// ============================================================

function openInventory() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var modal = document.getElementById('modal-inventory');
    var content = document.getElementById('modal-inventory-content');
    
    var maxInventory = getMaxInventory(g);
    var totalItems = 0;
    g.inventory.forEach(function(item) {
        if (isStackable(item) && item.count) {
            totalItems += item.count;
        } else {
            totalItems += 1;
        }
    });
    
    var html = '<div class="modal-section">';
    html += '<h4>🎒 ИНВЕНТАРЬ (' + totalItems + '/' + maxInventory + ')</h4>';
    if (g.equipment && g.equipment.horse) {
        var horse = HORSE_TYPES[g.equipment.horse.horseType];
        if (horse) {
            html += '<p style="color:#6a5a48;font-size:11px;">🐴 Лошадь даёт +' + horse.inventorySlots + ' дополнительных слотов.</p>';
        }
    }
    html += '<button class="btn btn-small" onclick="mergeStacks()" style="margin-top:4px;">🔗 Объединить все стеки</button>';
    html += '</div>';
    
    // ПРЕДМЕТЫ В ИНВЕНТАРЕ
    if (g.inventory.length === 0) {
        html += '<p style="color:#6a5a48;text-align:center;padding:20px 0;">🎒 Пусто</p>';
    } else {
        // Группируем для читаемости
        var grouped = {};
        g.inventory.forEach(function(item, i) {
            var key = item.name + '|' + (item.quality || 'Обычное') + '|' + (item.resourceType || '');
            if (!grouped[key]) {
                grouped[key] = { item: item, indices: [], count: 0 };
            }
            grouped[key].indices.push(i);
            grouped[key].count += (item.count || 1);
        });
        
        for (var key in grouped) {
            var data = grouped[key];
            var item = data.item;
            var index = data.indices[0];
            var quality = item.quality || 'Обычное';
            var q = QUALITIES[quality] || QUALITIES['Обычное'];
            var countDisplay = data.count > 1 ? ' ×' + data.count : '';
            var isStack = data.count > 1 && isStackable(item);
            
            html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410; flex-wrap:wrap;">';
            html += '<span class="label" style="color:' + q.color + ';">' + q.emoji + ' ' + item.name + ' (' + quality + ')' + countDisplay + '</span>';
            html += '<span class="value" style="font-size:11px;">';
            
            // Статистика
            var stats = '';
            if (item.finalDamage) stats = '⚔️ ' + item.finalDamage;
            else if (item.finalDefense) stats = '🛡️ ' + item.finalDefense;
            else if (item.type === 'resource') stats = '📦 ' + (item.resourceType || 'ресурс');
            else if (item.effect) {
                if (item.effect.food) stats = '🍖 +' + item.effect.food;
                else if (item.effect.thirst) stats = '💧 +' + item.effect.thirst;
                else if (item.effect.hp) stats = '❤️ +' + item.effect.hp;
            }
            if (stats) html += stats + ' ';
            
            // Кнопки
            if (isStack && item.count > 1) {
                html += '<button class="btn btn-small" onclick="splitStack(' + index + ')">🔪 Разделить</button>';
                html += '<button class="btn btn-small" onclick="mergeSpecificStack(' + index + ')">🔗 Объединить</button>';
            }
            
            if (isConsumable(item)) {
                if (isStack && item.count > 1) {
                    html += '<button class="btn btn-small" onclick="useOneFromStack(' + index + ')">🍽️ Использовать 1</button>';
                } else {
                    html += '<button class="btn btn-small" onclick="useItem(' + index + ')">🍽️ Использовать</button>';
                }
            }
            
            if (isEquippable(item)) {
                var levelReq = item.level || 1;
                if (g.level >= levelReq) {
                    var slot = getSlotForItem(item);
                    var isEquipped = false;
                    if (slot && g.equipment[slot] && g.equipment[slot].name === item.name) {
                        isEquipped = true;
                    }
                    if (isEquipped) {
                        html += '<button class="btn btn-small" style="background:#3d2a1a;" onclick="unequipItem(\'' + slot + '\')">Снять</button>';
                    } else {
                        html += '<button class="btn btn-small" onclick="equipItem(' + index + ')">Надеть</button>';
                    }
                } else {
                    html += '<button class="btn btn-small" style="opacity:0.4;cursor:not-allowed;" disabled>🔒 ур.' + levelReq + '</button>';
                }
            }
            
            if (item.isBook) {
                html += '<button class="btn btn-small" onclick="readBook(' + index + ')">📖 Читать</button>';
            }
            
            html += '</span></div>';
        }
    }
    
    // ===== НАДЕТО =====
    html += '<div class="modal-section"><h4>🛡️ НАДЕТО</h4>';
    var slots = [
        { key: 'rightHand', label: 'Правая рука' },
        { key: 'leftHand', label: 'Левая рука' },
        { key: 'helmet', label: 'Голова' },
        { key: 'chestplate', label: 'Грудь' },
        { key: 'shoulders', label: 'Плечи' },
        { key: 'leggings', label: 'Ноги' },
        { key: 'boots', label: 'Стопы' },
        { key: 'gloves', label: 'Руки' },
        { key: 'belt', label: 'Пояс' },
        { key: 'cloak', label: 'Спина' },
        { key: 'horse', label: '🐴 Лошадь' }
    ];
    slots.forEach(function(s) {
        var item = g.equipment[s.key];
        html += '<div class="row" style="padding:2px 0;">';
        html += '<span class="label">' + s.label + '</span>';
        html += '<span class="value">' + (item ? (item.quality ? item.quality + ' ' : '') + item.name + ' <button class="btn btn-small" style="background:#3d2a1a;" onclick="unequipItem(\'' + s.key + '\')">Снять</button>' : 'пусто') + '</span>';
        html += '</div>';
    });
    html += '</div>';
    
    html += '<button class="btn" onclick="closeInventory()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeInventory() {
    document.getElementById('modal-inventory').classList.add('hide');
}

// ============================================================
// 2. ПРОВЕРКА — МОЖНО ЛИ НАДЕТЬ
// ============================================================

function isEquippable(item) {
    if (!item) return false;
    var types = ['sword','spear','axe','mace','bow','crossbow','dagger','shield',
                 'helmet','chestplate','shoulders','leggings','boots','gloves','belt','cloak','horse'];
    return types.indexOf(item.type) !== -1;
}

function getSlotForItem(item) {
    if (!item) return null;
    var slotMap = {
        'sword': 'rightHand', 'spear': 'rightHand', 'axe': 'rightHand',
        'mace': 'rightHand', 'bow': 'rightHand', 'crossbow': 'rightHand',
        'dagger': 'rightHand', 'shield': 'leftHand',
        'helmet': 'helmet', 'chestplate': 'chestplate',
        'shoulders': 'shoulders', 'leggings': 'leggings',
        'boots': 'boots', 'gloves': 'gloves',
        'belt': 'belt', 'cloak': 'cloak',
        'horse': 'horse'
    };
    return slotMap[item.type] || null;
}

// ============================================================
// 3. НАДЕТЬ ПРЕДМЕТ
// ============================================================

function equipItem(index) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (index >= g.inventory.length) {
        setMessage('❌ Предмет не найден.');
        return;
    }
    
    var item = g.inventory[index];
    
    if (!isEquippable(item)) {
        setMessage('❌ Этот предмет нельзя надеть.');
        return;
    }
    
    if (item.level && g.level < item.level) {
        setMessage('❌ Требуется уровень ' + item.level + ' для надевания.');
        return;
    }
    
    var slot = getSlotForItem(item);
    if (!slot) {
        setMessage('❌ Неизвестный слот для этого предмета.');
        return;
    }
    
    // Снимаем то, что уже надето в этом слоте
    if (g.equipment[slot]) {
        addToInventory(g, g.equipment[slot]);
    }
    
    // Надеваем новый предмет
    g.equipment[slot] = item;
    g.inventory.splice(index, 1);
    
    // Если это лошадь — обновляем максимальное HP
    if (slot === 'horse') {
        var horse = HORSE_TYPES[item.horseType];
        if (horse) {
            g.equipment.horse.maxHp = horse.hp;
            g.equipment.horse.hp = horse.hp;
        }
    }
    
    setMessage('✅ Вы надели ' + item.name);
    addLog('⚔️ ' + currentUser + ' надел ' + item.name);
    updateMenu();
    saveData();
    openInventory();
}

// ============================================================
// 4. СНЯТЬ ПРЕДМЕТ
// ============================================================

function unequipItem(slot) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (!g.equipment[slot]) {
        setMessage('❌ Слот пуст.');
        return;
    }
    
    // Проверяем, есть ли место в инвентаре
    var maxInventory = getMaxInventory(g);
    var totalItems = 0;
    g.inventory.forEach(function(item) {
        if (isStackable(item) && item.count) {
            totalItems += item.count;
        } else {
            totalItems += 1;
        }
    });
    
    if (totalItems >= maxInventory) {
        setMessage('❌ Инвентарь переполнен!');
        return;
    }
    
    var item = g.equipment[slot];
    addToInventory(g, item);
    g.equipment[slot] = null;
    
    setMessage('✅ Вы сняли ' + item.name);
    addLog('⚔️ ' + currentUser + ' снял ' + item.name);
    updateMenu();
    saveData();
    openInventory();
}

// ============================================================
// 5. ИСПОЛЬЗОВАТЬ ПРЕДМЕТ
// ============================================================

function useItem(index) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    if (index >= g.inventory.length) {
        setMessage('❌ Предмет не найден.');
        return;
    }
    
    var item = g.inventory[index];
    
    // Еда/Напитки
    if (item.effect) {
        if (item.effect.food) g.food = Math.min(100, g.food + item.effect.food);
        if (item.effect.thirst) g.thirst = Math.min(100, g.thirst + item.effect.thirst);
        if (item.effect.hp) g.hp = Math.min(g.maxHp, g.hp + item.effect.hp);
        
        if (item.count && item.count > 1) {
            item.count--;
            if (item.count === 0) g.inventory.splice(index, 1);
        } else {
            g.inventory.splice(index, 1);
        }
        
        setMessage('✅ Использовано: ' + item.name);
        updateMenu();
        saveData();
        openInventory();
        return;
    }
    
    // Еда (совместимость со старыми предметами)
    if (item.name && (item.name.includes('Хлеб') || item.name.includes('Мясо') || item.name.includes('Рыба'))) {
        g.food = Math.min(100, g.food + 20);
        if (item.count && item.count > 1) {
            item.count--;
            if (item.count === 0) g.inventory.splice(index, 1);
        } else {
            g.inventory.splice(index, 1);
        }
        setMessage('🍞 Вы съели ' + item.name + '. Еда +20.');
        updateMenu(); saveData(); openInventory();
        return;
    }
    
    if (item.name && item.name.includes('Вода')) {
        g.thirst = Math.min(100, g.thirst + 15);
        if (item.count && item.count > 1) {
            item.count--;
            if (item.count === 0) g.inventory.splice(index, 1);
        } else {
            g.inventory.splice(index, 1);
        }
        setMessage('💧 Вы выпили воду. Жажда +15.');
        updateMenu(); saveData(); openInventory();
        return;
    }
    
    if (item.name && item.name.includes('Эль')) {
        g.hp = Math.min(g.maxHp, g.hp + 5);
        g.thirst = Math.min(100, g.thirst + 10);
        if (item.count && item.count > 1) {
            item.count--;
            if (item.count === 0) g.inventory.splice(index, 1);
        } else {
            g.inventory.splice(index, 1);
        }
        setMessage('🍺 Вы выпили эль. HP +5, жажда +10.');
        updateMenu(); saveData(); openInventory();
        return;
    }
    
    if (item.name && item.name.includes('Вино')) {
        g.hp = Math.min(g.maxHp, g.hp + 8);
        g.thirst = Math.min(100, g.thirst + 15);
        if (item.count && item.count > 1) {
            item.count--;
            if (item.count === 0) g.inventory.splice(index, 1);
        } else {
            g.inventory.splice(index, 1);
        }
        setMessage('🍷 Вы выпили вино. HP +8, жажда +15.');
        updateMenu(); saveData(); openInventory();
        return;
    }
    
    setMessage('❌ Этот предмет нельзя использовать.');
}

// ============================================================
// 6. РЕГИСТРАЦИЯ
// ============================================================

window.openInventory = openInventory;
window.closeInventory = closeInventory;
window.equipItem = equipItem;
window.unequipItem = unequipItem;
window.useItem = useItem;

console.log('🎒 Инвентарь загружен!');

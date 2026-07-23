// ============================================================
// js/debug.js — ОТЛАДКА, ЛОВЛЯ ОШИБОК, ВАЛИДАЦИЯ ДАННЫХ
// ============================================================

console.log('🔧 Debug-система загружена...');

// ============================================================
// 1. ГЛОБАЛЬНЫЙ ЛОВЕЦ ОШИБОК
// ============================================================

window.addEventListener('error', function(e) {
    var msg = '❌ ОШИБКА: ' + e.message;
    msg += '\n📄 Файл: ' + e.filename;
    msg += '\n📍 Строка: ' + e.lineno + ':' + e.colno;
    
    console.error(msg);
    
    // Показать Eruda если есть
    if (typeof eruda !== 'undefined' && eruda.show) {
        eruda.show();
    }
    
    // Сохранить в лог игры
    if (typeof addLog === 'function') {
        addLog('❌ ' + e.message + ' (' + (e.filename || '?').split('/').pop() + ':' + e.lineno + ')');
    }
    
    // Показать игроку
    if (typeof setMessage === 'function') {
        setMessage('⚠️ Произошла ошибка: ' + e.message);
    }
});

// ============================================================
// 2. ЛОВЕЦ НЕОБРАБОТАННЫХ ПРОМИСОВ
// ============================================================

window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ PROMISE ОШИБКА:', e.reason);
    
    if (typeof eruda !== 'undefined' && eruda.show) {
        eruda.show();
    }
    
    if (typeof addLog === 'function') {
        addLog('❌ Promise: ' + (e.reason ? e.reason.message || e.reason : 'неизвестно'));
    }
});

// ============================================================
// 3. БЕЗОПАСНЫЙ ВЫЗОВ ФУНКЦИЙ
// ============================================================

window.safeCall = function(fn, name) {
    try {
        fn();
    } catch(e) {
        console.error('❌ Ошибка в ' + (name || 'анонимной функции') + ':', e);
        if (typeof setMessage === 'function') {
            setMessage('❌ Ошибка: ' + e.message);
        }
        if (typeof addLog === 'function') {
            addLog('❌ safeCall ' + (name || '') + ': ' + e.message);
        }
        return false;
    }
    return true;
};

// Оборачиваем все игровые действия в safeCall для автоматического try/catch
var _originalGameAction = window.gameAction;
if (typeof _originalGameAction === 'function') {
    window.gameAction = function(action) {
        return window.safeCall(function() {
            _originalGameAction(action);
        }, 'gameAction(' + action + ')');
    };
}

// ============================================================
// 4. ВАЛИДАЦИЯ ДАННЫХ
// ============================================================

window.validateAllData = function() {
    var errors = [];
    var warnings = [];
    var totalUsers = 0;
    var onlineUsers = 0;
    
    if (typeof users === 'undefined') {
        console.error('❌ Глобальный объект users не найден!');
        return;
    }
    
    for (var name in users) {
        totalUsers++;
        var user = users[name];
        
        // Проверка структуры
        if (!user) { errors.push(name + ': пользователь null'); continue; }
        if (!user.game) { errors.push(name + ': нет game'); continue; }
        
        var g = user.game;
        if (g.online) onlineUsers++;
        
        // Проверка обязательных полей
        if (g.hp === undefined || g.hp === null) errors.push(name + ': нет hp');
        if (g.maxHp === undefined || g.maxHp === null) errors.push(name + ': нет maxHp');
        if (!g.location) { errors.push(name + ': нет location'); } else {
            if (!g.location.place) errors.push(name + ': нет location.place');
            if (!g.location.region) warnings.push(name + ': нет location.region');
            if (!g.location.location) warnings.push(name + ': нет location.location');
        }
        
        // Проверка числовых полей
        if (g.level !== undefined && g.level < 1) errors.push(name + ': уровень < 1');
        if (g.food !== undefined && (g.food < 0 || g.food > 100)) errors.push(name + ': еда вне диапазона: ' + g.food);
        if (g.thirst !== undefined && (g.thirst < 0 || g.thirst > 100)) errors.push(name + ': жажда вне диапазона: ' + g.thirst);
        if (g.fatigue !== undefined && (g.fatigue < 0 || g.fatigue > 100)) errors.push(name + ': усталость вне диапазона: ' + g.fatigue);
        if (g.hp !== undefined && g.hp < 0) errors.push(name + ': hp < 0: ' + g.hp);
        
        // Проверка эквипировки
        if (g.equipment) {
            var slots = ['rightHand','leftHand','helmet','chestplate','shoulders','leggings','boots','gloves','belt','cloak'];
            slots.forEach(function(s) {
                if (g.equipment[s] && !g.equipment[s].name) errors.push(name + ': предмет в слоте ' + s + ' без имени');
            });
        }
        
        // Проверка инвентаря
        if (g.inventory && Array.isArray(g.inventory)) {
            for (var i = 0; i < g.inventory.length; i++) {
                var item = g.inventory[i];
                if (!item) { errors.push(name + ': пустой предмет в инвентаре #' + i); continue; }
                if (!item.name) errors.push(name + ': предмет #' + i + ' без имени');
                if (item.count !== undefined && item.count < 1) errors.push(name + ': предмет #' + i + ' (' + item.name + ') счётчик < 1: ' + item.count);
                if (item.count === undefined && !isNaN(item)) errors.push(name + ': предмет #' + i + ' — число вместо объекта');
            }
        }
        
        // Проверка таймеров
        if (g.busyUntil && g.busyUntil < Date.now() - 24 * 60 * 60 * 1000) {
            warnings.push(name + ': busyUntil в прошлом (>24ч): ' + new Date(g.busyUntil).toLocaleString());
        }
    }
    
    // Проверка MARKET_STALLS
    if (typeof marketStalls !== 'undefined') {
        var stallCount = 0;
        for (var sid in marketStalls) {
            var stall = marketStalls[sid];
            if (stall && stall.owner) stallCount++;
            if (stall && stall.owner && !users[stall.owner]) {
                warnings.push('Лавка #' + sid + ': владелец ' + stall.owner + ' не существует');
            }
        }
    }
    
    // Вывод результатов
    console.log('═══ ВАЛИДАЦИЯ ДАННЫХ ═══');
    console.log('👥 Всего пользователей: ' + totalUsers);
    console.log('🟢 Онлайн: ' + onlineUsers);
    
    if (errors.length > 0) {
        console.error('❌ КРИТИЧЕСКИЕ ОШИБКИ (' + errors.length + '):');
        errors.forEach(function(e) { console.error('  • ' + e); });
    } else {
        console.log('✅ Критических ошибок нет');
    }
    
    if (warnings.length > 0) {
        console.warn('⚠️ ПРЕДУПРЕЖДЕНИЯ (' + warnings.length + '):');
        warnings.forEach(function(w) { console.warn('  • ' + w); });
    } else {
        console.log('✅ Предупреждений нет');
    }
    
    return { errors: errors, warnings: warnings, total: totalUsers, online: onlineUsers };
};

// ============================================================
// 5. АВТО-ПРОВЕРКА ПРИ ЗАГРУЗКЕ
// ============================================================

if (typeof users !== 'undefined' && Object.keys(users).length > 0) {
    console.log('🔍 Авто-проверка данных при загрузке...');
    setTimeout(function() {
        var result = window.validateAllData();
        if (result && result.errors.length > 0) {
            console.warn('⚠️ Найдены ошибки при загрузке, проверьте данные!');
        }
    }, 500);
}

// ============================================================
// 6. БЫСТРЫЕ КОМАНДЫ В КОНСОЛИ
// ============================================================

window.debugHelp = function() {
    console.log('═══ ОТЛАДОЧНЫЕ КОМАНДЫ ═══');
    console.log('validateAllData()  — проверка всех данных');
    console.log('debugHelp()        — эта справка');
    console.log('showAllUsers()     — список пользователей');
    console.log('fixCurrentUser()   — восстановить текущего игрока');
    console.log('showEruda()        — показать панель Eruda');
};

window.showAllUsers = function() {
    console.log('═══ ПОЛЬЗОВАТЕЛИ ═══');
    for (var name in users) {
        var g = users[name].game;
        console.log(name + ': ур.' + g.level + ' | ' + g.location.place + ' | HP:' + g.hp + '/' + g.maxHp + ' | ' + (g.online ? '🟢' : '⚫'));
    }
};

window.showEruda = function() {
    if (typeof eruda !== 'undefined') {
        eruda.show();
        console.log('✅ Eruda открыта');
    } else {
        console.log('❌ Eruda не подключена');
    }
};

window.fixCurrentUser = function() {
    if (!currentUser) { console.log('❌ Нет текущего пользователя'); return; }
    var g = users[currentUser].game;
    
    // Исправление типовых проблем
    if (g.hp > g.maxHp) { console.log('🔧 HP > maxHp, исправлено'); g.hp = g.maxHp; }
    if (g.food > 100) { console.log('🔧 food > 100, исправлено'); g.food = 100; }
    if (g.thirst > 100) { console.log('🔧 thirst > 100, исправлено'); g.thirst = 100; }
    if (g.fatigue > 100) { console.log('🔧 fatigue > 100, исправлено'); g.fatigue = 100; }
    if (g.food < 0) { console.log('🔧 food < 0, исправлено'); g.food = 0; }
    if (g.thirst < 0) { console.log('🔧 thirst < 0, исправлено'); g.thirst = 0; }
    if (g.fatigue < 0) { console.log('🔧 fatigue < 0, исправлено'); g.fatigue = 0; }
    if (!g.location.region) { console.log('🔧 Нет региона, выставлен Королевские земли'); g.location.region = 'Королевские земли'; }
    if (!g.location.location) { console.log('🔧 Нет локации, выставлена Королевская Гавань'); g.location.location = 'Королевская Гавань'; }
    
    if (typeof normalizeInventory === 'function') normalizeInventory(g);
    
    if (typeof saveData === 'function') saveData();
    console.log('✅ Исправления применены');
};

// ============================================================
// 7. ЗАПУСК
// ============================================================

console.log('✅ Debug-система готова. Вызови debugHelp() для списка команд.');
console.log('📋 Быстрая проверка: validateAllData()');

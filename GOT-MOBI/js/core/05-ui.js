// ============================================================
// js/core/05-ui.js — UI С ПОИСКОМ (ГОТОВО)
// ============================================================

function createActionButton(actionId, label) {
    var btn = document.createElement('button');
    btn.className = 'btn-game';
    btn.textContent = label;
    
    btn.onclick = function() {
        // ===== ПОИСК =====
        if (actionId === 'search') {
            window.doSearch();
            return;
        }
        
        // ===== ВСЁ ОСТАЛЬНОЕ =====
        if (typeof gameAction === 'function') {
            gameAction(actionId);
        } else {
            setMessage('❌ Действие недоступно.');
        }
    };
    
    return btn;
}

window.updateActions = function() {
    var container = document.getElementById('actions-container');
    if (!container) return;
    container.innerHTML = '';
    
    var g = users[currentUser]?.game;
    if (!g) return;
    
    var place = g.location.place || 'Таверна';
    var actions = [
        { id: 'inventory', label: '🎒 Инвентарь' },
        { id: 'character', label: '👤 Персонаж' },
        { id: 'menu', label: '📋 Меню' },
        { id: 'map', label: '🗺️ Карта' }
    ];
    
    if (place === 'Дорога') {
        actions.unshift(
            { id: 'enter_city', label: '🚶 Войти' },
            { id: 'search', label: '🔍 Поиск' }
        );
    }
    
    if (place === 'Таверна') {
        actions.unshift(
            { id: 'tavern_eat', label: '🍞 Попросить еды' },
            { id: 'rest', label: '🛏️ Отдохнуть' }
        );
    }
    
    if (place === 'Ворота') {
        if (!g.outside) {
            actions.unshift({ id: 'leave_city', label: '🚪 Выйти' });
        } else {
            actions.unshift({ id: 'enter_city', label: '🚶 Войти' });
        }
    }
    
    if (place === 'Дом') {
        actions.unshift(
            { id: 'home_rest', label: '🛏️ Отдохнуть' },
            { id: 'home_storage', label: '📦 Склад' },
            { id: 'home_leave', label: '🚪 Выйти' }
        );
    }
    
    for (var i = 0; i < actions.length; i++) {
        var btn = createActionButton(actions[i].id, actions[i].label);
        container.appendChild(btn);
    }
};

// ============================================================
// ПОИСК (ВСТРОЕН В UI)
// ============================================================

window.doSearch = function() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var region = g.location.region || 'Королевские земли';
    var place = g.location.place || 'Дорога';
    var luck = Math.min(25, g.luck || 0);
    var luckBonus = Math.floor(luck / 10);
    
    if (g.food < 20) {
        setMessage('🍽️ Вы слишком голодны для поиска!');
        return;
    }
    if (g.fatigue < 20) {
        setMessage('😴 Вы слишком устали для поиска!');
        return;
    }
    
    var treasureChance = Math.min(4.5, 2 + luckBonus);
    if (Math.random() * 100 < treasureChance) {
        findTreasure();
        return;
    }
    
    var monsterChance = Math.min(47.5, 45 + luckBonus);
    if (Math.random() * 100 < monsterChance) {
        var mob = getRandomMobByRegionAndLevel(region, place);
        if (mob) {
            setMessage('⚔️ Вы встретили ' + mob.name + ' (уровень ' + mob.level + ')');
            addLog('⚔️ ' + currentUser + ' встретил ' + mob.name);
            startBattle(mob);
            return;
        }
    }
    
    setMessage('🔍 Вы никого не нашли.');
};

window.findTreasure = function() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var luck = Math.min(25, g.luck || 0);
    var bonusLuck = Math.min(5, Math.floor(luck / 5));
    
    var goldAmount = 2 + Math.floor(Math.random() * 8) + bonusLuck;
    g.copper += goldAmount;
    convertCurrency(g);
    setMessage('🪙 Вы нашли клад! +' + goldAmount + ' золота!');
    addLog('🪙 ' + currentUser + ' нашёл клад: ' + goldAmount + ' золота');
    updateMenu();
    saveData();
};

console.log('✅ UI с поиском загружен!');

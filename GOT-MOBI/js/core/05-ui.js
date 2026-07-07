// ============================================================
// js/core/05-ui.js — UI + ПОИСК (БЕЗ БОЕВКИ)
// ============================================================

console.log('🔧 UI + Поиск загружены');

// ============================================================
// 1. ПОИСК (УПРОЩЁННЫЙ, БЕЗ БОЕВКИ)
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
    
    // Клад
    var treasureChance = Math.min(4.5, 2 + luckBonus);
    if (Math.random() * 100 < treasureChance) {
        var goldAmount = 2 + Math.floor(Math.random() * 8) + luckBonus;
        g.copper += goldAmount;
        convertCurrency(g);
        setMessage('🪙 Вы нашли клад! +' + goldAmount + ' золота!');
        updateMenu();
        saveData();
        return;
    }
    
    // Монстры
    var monsterChance = Math.min(47.5, 45 + luckBonus);
    if (Math.random() * 100 < monsterChance) {
        // Ищем мобов
        var mobs = [];
        if (typeof MOBS !== 'undefined') {
            var regionKey = ({
                'Королевские земли': 'crownlands',
                'Север': 'north',
                'Западные земли': 'westlands',
                'Простор': 'reach',
                'Речные земли': 'riverlands',
                'Штормовые земли': 'stormlands',
                'Дорн': 'dorne',
                'Долина': 'vale',
                'Железные острова': 'iron_islands'
            })[region] || 'crownlands';
            
            var regionMobs = MOBS[regionKey] || MOBS.crownlands || [];
            var locationLevel = (typeof LOCATION_LEVELS !== 'undefined') ? (LOCATION_LEVELS[place] || 1) : 1;
            var minLevel = Math.max(1, locationLevel - 3);
            var maxLevel = locationLevel + 3;
            
            mobs = regionMobs.filter(function(m) {
                return m.level >= minLevel && m.level <= maxLevel;
            });
        }
        
        // Если мобы нашлись — встречаем случайного
        if (mobs.length > 0) {
            var mob = mobs[Math.floor(Math.random() * mobs.length)];
            setMessage('⚔️ Вы встретили ' + mob.name + ' (уровень ' + mob.level + ')!\n\n❤️ HP: ' + mob.hp + '\n⚔️ Урон: ' + mob.damage + '\n🛡️ Защита: ' + mob.defense + '\n\n⚠️ Боевая система в разработке. Моб не атакует.');
            return;
        }
    }
    
    setMessage('🔍 Вы никого не нашли.');
};

// ============================================================
// 2. КНОПКИ (UI)
// ============================================================

function createActionButton(actionId, label) {
    var btn = document.createElement('button');
    btn.className = 'btn-game';
    btn.textContent = label;
    
    btn.onclick = function() {
        if (actionId === 'search') {
            window.doSearch();
            return;
        }
        if (typeof gameAction === 'function') {
            gameAction(actionId);
        } else {
            setMessage('❌ Действие недоступно.');
        }
    };
    
    return btn;
}

// ============================================================
// 3. ОБНОВЛЕНИЕ КНОПОК
// ============================================================

window.updateActions = function() {
    var container = document.getElementById('actions-container');
    if (!container) return;
    container.innerHTML = '';
    
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    var place = g.location.place || 'Таверна';
    
    var actions = [
        { id: 'inventory', label: '🎒 Инвентарь' },
        { id: 'character', label: '👤 Персонаж' },
        { id: 'menu', label: '📋 Меню' },
        { id: 'map', label: '🗺️ Карта' }
    ];
    
    if (place === 'Таверна') {
        actions = [
            { id: 'tavern_eat', label: '🍞 Попросить еды' },
            { id: 'tavern_buy', label: '🛒 Торговля' },
            { id: 'wash', label: '🧹 Помыть посуду' },
            { id: 'sweep', label: '🧹 Подмести пол' },
            { id: 'rest', label: '🛏️ Отдохнуть' },
            { id: 'talk', label: '🗣️ Поговорить' }
        ].concat(actions);
    }
    
    if (place === 'Рынок') {
        actions = [{ id: 'market_stalls', label: '🏪 Рынок' }].concat(actions);
    }
    
    if (place === 'Кузница') {
        actions = [
            { id: 'shop_resources', label: '⚒️ Кузница' },
            { id: 'craft', label: '🔨 Крафт' }
        ].concat(actions);
    }
    
    if (place === 'Оружейная лавка') {
        actions = [{ id: 'shop_weapons', label: '🗡️ Оружейная' }].concat(actions);
    }
    
    if (place === 'Кожевник') {
        actions = [{ id: 'shop_leather', label: '🪡 Кожевник' }].concat(actions);
    }
    
    if (place === 'Бронник') {
        actions = [{ id: 'shop_plate', label: '🛡️ Бронник' }].concat(actions);
    }
    
    if (place === 'Плотник') {
        actions = [{ id: 'shop_bows', label: '🪵 Плотник' }].concat(actions);
    }
    
    if (place === 'Конюшня') {
        actions = [{ id: 'stable_open', label: '🐴 Конюшня' }].concat(actions);
    }
    
    if (place === 'Гильдия торговцев') {
        actions = [
            { id: 'auction_list', label: '🏛️ Аукцион' },
            { id: 'auction_my', label: '📦 Мои лоты' },
            { id: 'auction_sell', label: '💰 Выставить' }
        ].concat(actions);
    }
    
    if (place === 'Магистрат') {
        actions = [{ id: 'magistrate_open', label: '📜 Магистрат' }].concat(actions);
    }
    
    if (place === 'Ворота') {
        if (!g.outside) {
            actions = [{ id: 'leave_city', label: '🚪 Выйти' }].concat(actions);
        } else {
            actions = [{ id: 'enter_city', label: '🚶 Войти' }].concat(actions);
        }
    }
    
    if (place === 'Дорога') {
        actions = [
            { id: 'enter_city', label: '🚶 Войти' },
            { id: 'search', label: '🔍 Поиск' }
        ].concat(actions);
    }
    
    if (place === 'Королевский квартал' || place === 'Торговый квартал' || place === 'Квартал бедноты') {
        var hasHouse = g.housing && g.housing.type && HOUSING_TYPES[g.housing.type] && HOUSING_TYPES[g.housing.type].district === place;
        if (hasHouse) {
            actions = [{ id: 'housing_enter', label: '🏠 Зайти домой' }].concat(actions);
        } else {
            actions = [{ id: 'housing_view', label: '🏠 Купить жильё' }].concat(actions);
        }
    }
    
    if (place === 'Дом') {
        actions = [
            { id: 'home_rest', label: '🛏️ Отдохнуть' },
            { id: 'home_storage', label: '📦 Склад' },
            { id: 'home_leave', label: '🚪 Выйти из дома' }
        ].concat(actions);
    }
    
    if (place === 'Великая септа') {
        actions = [{ id: 'temple_open', label: '⛪ Септа' }].concat(actions);
    }
    
    if (place === 'Порт') {
        actions = [{ id: 'port_travel', label: '⛵ Порт' }].concat(actions);
    }
    
    if (place === 'Тюрьма') {
        actions = [
            { id: 'jail_pay', label: '💰 Заплатить штраф' },
            { id: 'jail_wait', label: '⏳ Ждать освобождения' },
            { id: 'jail_escape', label: '🏃 Попытаться сбежать' }
        ].concat(actions);
    }
    
    if (place === 'Библиотека мейстеров') {
        actions = [{ id: 'library_open', label: '📚 Библиотека' }].concat(actions);
    }
    
    if (place === 'Гильдия наёмников') {
        actions = [{ id: 'guildhall_open', label: '🗡️ Гильдия' }].concat(actions);
    }
    
    if (place === 'Бордель') {
        actions = [
            { id: 'brothel_rest', label: '🛏️ Отдых' },
            { id: 'brothel_dice', label: '🎲 Кости' }
        ].concat(actions);
    }
    
    for (var i = 0; i < actions.length; i++) {
        var btn = createActionButton(actions[i].id, actions[i].label);
        container.appendChild(btn);
    }
};

console.log('✅ UI + Поиск загружены!');

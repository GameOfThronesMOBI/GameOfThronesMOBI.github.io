// ============================================================
// js/core/05-ui.js — UI + ПОИСК + БОЕВКА (ВСЁ В ОДНОМ)
// ============================================================

console.log('🔧 UI + Поиск + Боевка загружены');

// ============================================================
// 1. БОЕВКА
// ============================================================

window._battle = null;

window.getMobsForLocation = function(region, place) {
    var m = {'Королевские земли':'crownlands','Север':'north','Западные земли':'westlands','Простор':'reach','Речные земли':'riverlands','Штормовые земли':'stormlands','Дорн':'dorne','Долина':'vale','Железные острова':'iron_islands'};
    var k = m[region] || 'crownlands';
    var mobs = MOBS[k] || MOBS.crownlands || [];
    var lvl = LOCATION_LEVELS[place] || 1;
    var min = Math.max(1, lvl - 3);
    var max = lvl + 3;
    var f = mobs.filter(function(m) { return m.level >= min && m.level <= max; });
    return f.length > 0 ? f : mobs.slice(0, 5);
};

window.getRandomMobByRegionAndLevel = function(region, place) {
    var mobs = window.getMobsForLocation(region, place);
    if (mobs.length === 0) return { name:'Крыса', hp:8, damage:2, defense:0, xp:3, level:1, type:'animal', agility:2 };
    return mobs[Math.floor(Math.random() * mobs.length)];
};

window.startBattle = function(mob) {
    var g = users[currentUser].game;
    window._battle = {
        mob: mob,
        playerHp: g.hp,
        mobHp: mob.hp,
        maxPlayerHp: getMaxHp(g),
        inProgress: true,
        log: []
    };
    isBusy = true;
    document.getElementById('busy-status').classList.remove('hide');
    document.getElementById('busy-status').textContent = '⚔️ Бой с ' + mob.name + '!';
    setMessage('⚔️ БОЙ С ' + mob.name.toUpperCase() + ' (ур.' + mob.level + ')\n\n❤️ Враг HP: ' + mob.hp + '/' + mob.hp + '\n❤️ Вы HP: ' + g.hp + '/' + getMaxHp(g) + '\n\n🔄 Ваш ход.');
    window.updateActions();
};

window.battleAction = function(action) {
    var b = window._battle;
    if (!b || !b.inProgress) return;
    var g = users[currentUser].game;
    
    if (action === 'battle_attack') {
        var dmg = (g.stats.damage || 1) + Math.floor(Math.random() * 4);
        b.mobHp = Math.max(0, b.mobHp - dmg);
        b.log.push('⚔️ Вы нанесли ' + dmg + ' урона.');
        
        if (b.mobHp <= 0) {
            var xp = b.mob.xp || 5;
            g.xp += xp;
            var gold = Math.floor(Math.random() * 10) + 1;
            g.copper += gold;
            convertCurrency(g);
            setMessage('⚔️ ПОБЕДА! +' + xp + ' XP, +' + gold + ' МП');
            window._battle = null;
            isBusy = false;
            document.getElementById('busy-status').classList.add('hide');
            window.updateActions();
            updateMenu();
            saveData();
            return;
        }
        
        var mdmg = b.mob.damage + Math.floor(Math.random() * 3);
        b.playerHp = Math.max(0, b.playerHp - mdmg);
        b.log.push('🐺 ' + b.mob.name + ' нанёс ' + mdmg + ' урона.');
        
        if (b.playerHp <= 0) {
            setMessage('💀 Вас убил ' + b.mob.name + '. Вы возродились в таверне.');
            g.hp = getMaxHp(g);
            g.location.place = 'Таверна';
            g.location.location = 'Королевская Гавань';
            g.outside = false;
            window._battle = null;
            isBusy = false;
            document.getElementById('busy-status').classList.add('hide');
            window.updateActions();
            updateMenu();
            updateStory();
            saveData();
            return;
        }
        
        setMessage('⚔️ БОЙ С ' + b.mob.name.toUpperCase() + '\n\n❤️ Враг HP: ' + b.mobHp + '/' + b.mob.hp + '\n❤️ Вы HP: ' + b.playerHp + '/' + b.maxPlayerHp + '\n\n' + b.log.slice(-2).join('\n'));
        updateMenu();
    }
    
    if (action === 'battle_flee') {
        if (Math.random() * 100 < 30) {
            setMessage('🏃 Вы сбежали!');
            window._battle = null;
            isBusy = false;
            document.getElementById('busy-status').classList.add('hide');
            window.updateActions();
            return;
        }
        setMessage('🏃 Побег не удался!');
    }
    
    window.updateActions();
};

// ============================================================
// 2. ПОИСК
// ============================================================

window.doSearch = function() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var region = g.location.region || 'Королевские земли';
    var place = g.location.place || 'Дорога';
    var luck = Math.min(25, g.luck || 0);
    var luckBonus = Math.floor(luck / 10);
    
    if (g.food < 20) { setMessage('🍽️ Вы слишком голодны для поиска!'); return; }
    if (g.fatigue < 20) { setMessage('😴 Вы слишком устали для поиска!'); return; }
    
    var treasureChance = Math.min(4.5, 2 + luckBonus);
    if (Math.random() * 100 < treasureChance) {
        var goldAmount = 2 + Math.floor(Math.random() * 8) + luckBonus;
        g.copper += goldAmount;
        convertCurrency(g);
        setMessage('🪙 Вы нашли клад! +' + goldAmount + ' золота!');
        updateMenu(); saveData();
        return;
    }
    
    var monsterChance = Math.min(47.5, 45 + luckBonus);
    if (Math.random() * 100 < monsterChance) {
        var mob = window.getRandomMobByRegionAndLevel(region, place);
        if (mob) {
            setMessage('⚔️ Вы встретили ' + mob.name + ' (уровень ' + mob.level + ')!');
            window.startBattle(mob);
            return;
        }
    }
    
    setMessage('🔍 Вы никого не нашли.');
};

// ============================================================
// 3. КНОПКИ
// ============================================================

function createActionButton(actionId, label) {
    var btn = document.createElement('button');
    btn.className = 'btn-game';
    btn.textContent = label;
    btn.onclick = function() {
        if (actionId === 'search') { window.doSearch(); return; }
        if (actionId === 'battle_attack' || actionId === 'battle_flee' || actionId === 'battle_mount' || actionId === 'battle_dismount') {
            if (typeof window.battleAction === 'function') { window.battleAction(actionId); }
            return;
        }
        if (typeof gameAction === 'function') { gameAction(actionId); }
        else { setMessage('❌ Действие недоступно.'); }
    };
    return btn;
}

// ============================================================
// 4. ОБНОВЛЕНИЕ КНОПОК
// ============================================================

window.updateActions = function() {
    var container = document.getElementById('actions-container');
    if (!container) return;
    container.innerHTML = '';
    
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    var place = g.location.place || 'Таверна';
    
    if (window._battle && window._battle.inProgress) {
        var battleActions = [
            { id: 'battle_attack', label: '⚔️ Атака' },
            { id: 'battle_flee', label: '🏃 Побег' }
        ];
        for (var i = 0; i < battleActions.length; i++) {
            var btn = createActionButton(battleActions[i].id, battleActions[i].label);
            container.appendChild(btn);
        }
        return;
    }
    
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
    if (place === 'Рынок') { actions = [{ id: 'market_stalls', label: '🏪 Рынок' }].concat(actions); }
    if (place === 'Кузница') { actions = [{ id: 'shop_resources', label: '⚒️ Кузница' }, { id: 'craft', label: '🔨 Крафт' }].concat(actions); }
    if (place === 'Оружейная лавка') { actions = [{ id: 'shop_weapons', label: '🗡️ Оружейная' }].concat(actions); }
    if (place === 'Кожевник') { actions = [{ id: 'shop_leather', label: '🪡 Кожевник' }].concat(actions); }
    if (place === 'Бронник') { actions = [{ id: 'shop_plate', label: '🛡️ Бронник' }].concat(actions); }
    if (place === 'Плотник') { actions = [{ id: 'shop_bows', label: '🪵 Плотник' }].concat(actions); }
    if (place === 'Конюшня') { actions = [{ id: 'stable_open', label: '🐴 Конюшня' }].concat(actions); }
    if (place === 'Гильдия торговцев') { actions = [{ id: 'auction_list', label: '🏛️ Аукцион' }, { id: 'auction_my', label: '📦 Мои лоты' }, { id: 'auction_sell', label: '💰 Выставить' }].concat(actions); }
    if (place === 'Магистрат') { actions = [{ id: 'magistrate_open', label: '📜 Магистрат' }].concat(actions); }
    if (place === 'Ворота') {
        if (!g.outside) { actions = [{ id: 'leave_city', label: '🚪 Выйти' }].concat(actions); }
        else { actions = [{ id: 'enter_city', label: '🚶 Войти' }].concat(actions); }
    }
    if (place === 'Дорога') { actions = [{ id: 'enter_city', label: '🚶 Войти' }, { id: 'search', label: '🔍 Поиск' }].concat(actions); }
    if (place === 'Королевский квартал' || place === 'Торговый квартал' || place === 'Квартал бедноты') {
        var hasHouse = g.housing && g.housing.type && HOUSING_TYPES[g.housing.type] && HOUSING_TYPES[g.housing.type].district === place;
        if (hasHouse) { actions = [{ id: 'housing_enter', label: '🏠 Зайти домой' }].concat(actions); }
        else { actions = [{ id: 'housing_view', label: '🏠 Купить жильё' }].concat(actions); }
    }
    if (place === 'Дом') { actions = [{ id: 'home_rest', label: '🛏️ Отдохнуть' }, { id: 'home_storage', label: '📦 Склад' }, { id: 'home_leave', label: '🚪 Выйти из дома' }].concat(actions); }
    if (place === 'Великая септа') { actions = [{ id: 'temple_open', label: '⛪ Септа' }].concat(actions); }
    if (place === 'Порт') { actions = [{ id: 'port_travel', label: '⛵ Порт' }].concat(actions); }
    if (place === 'Тюрьма') { actions = [{ id: 'jail_pay', label: '💰 Заплатить штраф' }, { id: 'jail_wait', label: '⏳ Ждать освобождения' }, { id: 'jail_escape', label: '🏃 Попытаться сбежать' }].concat(actions); }
    if (place === 'Библиотека мейстеров') { actions = [{ id: 'library_open', label: '📚 Библиотека' }].concat(actions); }
    if (place === 'Гильдия наёмников') { actions = [{ id: 'guildhall_open', label: '🗡️ Гильдия' }].concat(actions); }
    if (place === 'Бордель') { actions = [{ id: 'brothel_rest', label: '🛏️ Отдых' }, { id: 'brothel_dice', label: '🎲 Кости' }].concat(actions); }
    
    for (var i = 0; i < actions.length; i++) {
        var btn = createActionButton(actions[i].id, actions[i].label);
        container.appendChild(btn);
    }
};

console.log('✅ ВСЁ ЗАГРУЖЕНО!');

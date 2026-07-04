// ============================================================
// ЯДРО: ЗАПУСК И РОУТЕР
// ============================================================

function gameAction(action) {
    setMessage('');
    if (isBusy && !['character','inventory','refresh','map','menu','enter_city','leave_city'].includes(action) && !action.startsWith('battle_')) {
        setMessage('⏳ Вы заняты.');
        return;
    }
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    
    switch(action) {
        case 'menu': openMainMenu(); break;
        case 'guild': openGuild(); break;
        case 'shop': openShop(g.location.place); break;
        case 'craft': openCraftMenu(); break;
        case 'open_stable': openStable(); break;
        case 'open_temple': openTemple(); break;
        case 'open_port': openPort(); break;
        case 'open_market': openMarket(); break;
        case 'open_magistrate': openMagistrate(); break;
        case 'enter_city':
            g.location.place = 'Ворота';
            g.location.location = 'Королевская Гавань';
            g.outside = false;
            setMessage('🚪 Вы вошли в город.');
            updateMenu(); updateStory(); updateActions(); saveData();
            break;
        case 'leave_city':
            g.location.place = 'Дорога';
            g.location.location = 'Дорога';
            g.outside = true;
            setMessage('🛤️ Вы вышли на Дорогу.');
            updateMenu(); updateStory(); updateActions(); saveData();
            break;
        case 'eat':
            if (g.food >= 100) { setMessage('🍖 Вы сыты.'); return; }
            g.food = Math.min(g.food + 25, 100);
            setMessage('🍞 Еда +25.');
            updateMenu(); saveData();
            break;
        case 'trade': openTavernTrade(); break;
        case 'wash':
            startBusy('Моете посуду', 1, function() {
                g.copper += 1;
                convertCurrency(g);
                setMessage('🧹 +1 МП.');
                updateMenu(); saveData();
            });
            break;
        case 'sweep':
            startBusy('Подметаете пол', 5, function() {
                g.copper += 5;
                convertCurrency(g);
                setMessage('🧹 +5 МП.');
                updateMenu(); saveData();
            });
            break;
        case 'rest':
            if (!spendMoney(g, 10)) { setMessage('❌ Недостаточно денег.'); return; }
            g.fatigue = Math.min(100, g.fatigue + 30);
            g.hp = Math.min(g.maxHp, g.hp + 15);
            setMessage('🛏️ +30 уст, +15 HP.');
            updateMenu(); saveData();
            break;
        case 'talk':
            const msgs = ['🍺 «Добро пожаловать!»','🍺 «Хочешь заработать?»','🍺 «Будь осторожен за воротами.»'];
            setMessage(msgs[Math.floor(Math.random() * 3)]);
            break;
        case 'search':
            if (searchCooldown) { setMessage('⏳ Подождите 5 сек.'); return; }
            searchCooldown = true;
            setTimeout(function() { searchCooldown = false; }, 5000);
            doSearch();
            break;
        case 'map': openMap(); break;
        case 'inventory': openInventory(); break;
        case 'character': openCharacter(); break;
        case 'refresh': location.reload(); break;
        case 'battle_attack': case 'battle_defend': case 'battle_dodge': case 'battle_flee':
            battleAction(action);
            break;
        case 'open_library': openLibrary(); break;
        case 'open_guildhall': openGuildHall(); break;
        case 'open_brothel': openBrothel(); break;
    }
}

function startBusy(actionName, minutes, callback) {
    if (isBusy) return;
    isBusy = true;
    document.getElementById('busy-status').classList.remove('hide');
    document.getElementById('busy-status').textContent = '⏳ ' + actionName + '... (' + minutes + ' мин)';
    updateActions();
    if (busyTimer) clearTimeout(busyTimer);
    busyTimer = setTimeout(function() {
        isBusy = false;
        document.getElementById('busy-status').classList.add('hide');
        busyTimer = null;
        if (callback) callback();
        updateActions();
    }, minutes * 60 * 1000);
}

function handleLogout() {
    if (isBusy) { setMessage('⏳ Вы заняты.'); return; }
    if (currentUser && users[currentUser]) {
        users[currentUser].game.online = false;
        users[currentUser].game.lastActive = Date.now();
        addLog('👤 ' + currentUser + ' вышел');
        saveData();
    }
    localStorage.removeItem('got_user');
    currentUser = null;
    showPage('login');
    document.getElementById('login-name').value = '';
    document.getElementById('login-password').value = '';
    if (busyTimer) { clearTimeout(busyTimer); busyTimer = null; }
    isBusy = false;
    document.getElementById('busy-status').classList.add('hide');
    if (resourceInterval) { clearInterval(resourceInterval); resourceInterval = null; }
    if (autoSaveInterval) { clearInterval(autoSaveInterval); autoSaveInterval = null; }
}

// ============================================================
// ЗАПУСК
// ============================================================
loadData();
const savedUser = localStorage.getItem('got_user');
if (savedUser && users[savedUser]) {
    currentUser = savedUser;
    enterGame(savedUser);
} else {
    showPage('login');
    }

// ============================================================
// КОРОЛЕВСКАЯ ГАВАНЬ — ВСЕ ЗДАНИЯ
// ============================================================

function getLocationText(place) {
    const texts = {
        'Таверна': 'Добро пожаловать в таверну. Здесь можно поесть, поработать и поговорить с трактирщиком.',
        'Рынок': '🏪 Центральный рынок Королевской Гавани.',
        'Кузница': 'Вы в кузнице. Здесь можно купить ресурсы и скрафтить предметы.',
        'Оружейная лавка': 'Вы в оружейной лавке. Здесь можно купить и продать оружие.',
        'Кожевник': 'Вы у кожевника. Здесь можно купить и продать кожаную броню.',
        'Бронник': 'Вы у бронника. Здесь можно купить и продать латную броню.',
        'Плотник': 'Вы у плотника. Здесь можно купить и продать луки и арбалеты.',
        'Конюшня': '🐴 Королевская конюшня.',
        'Гильдия торговцев': 'Вы в гильдии торговцев. Здесь можно торговать на аукционе.',
        'Магистрат': '📜 Магистрат — центр управления городом.',
        'Ворота': 'Вы у городских ворот.',
        'Королевский квартал': '👑 Элитный район.',
        'Торговый квартал': '🏙️ Центр торговли.',
        'Квартал бедноты': '🏚️ Окраина города. Можно встретить пьянчуг.',
        'Дом': '🏠 Ваш дом.',
        'Великая септа': '⛪ Великая Септа Бейлора.',
        'Порт': '⛵ Порт Королевской Гавани.',
        'Тюрьма': '⛓️ Вы в тюрьме.',
        'Дорога': '🛤️ Дорога у ворот Королевской Гавани.',
        'Библиотека мейстеров': '📚 Библиотека мейстеров.',
        'Гильдия наёмников': '🗡️ Гильдия наёмников.',
        'Бордель': '💃 Бордель Королевской Гавани.'
    };
    return texts[place] || 'Вы находитесь в ' + place + '.';
}

function getExits(place, outside) {
    const allExits = {
        'Таверна': ['Рынок', 'Ворота'],
        'Рынок': ['Таверна', 'Кузница', 'Кожевник', 'Гильдия торговцев', 'Магистрат', 'Королевский квартал', 'Торговый квартал', 'Квартал бедноты', 'Гильдия наёмников'],
        'Кузница': ['Рынок', 'Оружейная лавка'],
        'Оружейная лавка': ['Кузница', 'Бронник'],
        'Кожевник': ['Рынок', 'Плотник'],
        'Бронник': ['Оружейная лавка', 'Плотник'],
        'Плотник': ['Кожевник', 'Бронник'],
        'Конюшня': ['Ворота', 'Рынок'],
        'Гильдия торговцев': ['Рынок', 'Торговый квартал'],
        'Магистрат': ['Рынок', 'Королевский квартал'],
        'Ворота': ['Таверна', 'Конюшня', 'Великая септа', 'Порт'],
        'Королевский квартал': ['Рынок', 'Магистрат', 'Великая септа', 'Библиотека мейстеров'],
        'Торговый квартал': ['Рынок', 'Гильдия торговцев'],
        'Квартал бедноты': ['Рынок', 'Тюрьма', 'Бордель'],
        'Дом': ['Королевский квартал', 'Торговый квартал', 'Квартал бедноты'],
        'Великая септа': ['Ворота', 'Королевский квартал'],
        'Порт': ['Ворота'],
        'Тюрьма': ['Квартал бедноты'],
        'Дорога': [],
        'Библиотека мейстеров': ['Королевский квартал'],
        'Гильдия наёмников': ['Рынок'],
        'Бордель': ['Квартал бедноты']
    };
    
    let exits = allExits[place] || [];
    
    if (place === 'Ворота') exits.push('Дорога');
    if (place === 'Дорога') exits = ['Ворота'];
    
    return exits;
}

function updateStory() {
    const user = users[currentUser];
    if (!user) return;
    const place = user.game.location.place;
    document.getElementById('story-title').textContent = '📍 ' + place + ' (ур.' + (LOCATION_LEVELS[place] || 1) + ')';
    document.getElementById('story-text').textContent = getLocationText(place);
}

function updateActions() {
    const user = users[currentUser];
    if (!user) return;
    const place = user.game.location.place;
    const container = document.getElementById('actions-container');
    container.innerHTML = '';
    
    const g = user.game;
    let actions = [];
    
    if (place === 'Таверна') {
        actions = [
            { id: 'eat', label: '🍞 Попросить еды (+25)' },
            { id: 'trade', label: '🛒 Торговля в таверне' },
            { id: 'wash', label: '🧹 Помыть посуду (1 мин → 1 МП)' },
            { id: 'sweep', label: '🧹 Подмести пол (5 мин → 5 МП)' },
            { id: 'rest', label: '🛏️ Отдохнуть (10 МП → +30 уст., +15 HP)' },
            { id: 'talk', label: '🗣️ Поговорить с трактирщиком' }
        ];
    }
    
    if (place === 'Дорога') {
        actions.push({ id: 'search', label: '🔍 Поиск' });
        actions.push({ id: 'enter_city', label: '🚪 Войти в Королевскую Гавань' });
    }
    
    if (place === 'Ворота' && !g.outside) {
        actions.unshift({ id: 'leave_city', label: '🚪 Выйти на Дорогу' });
    }
    
    actions.push({ id: 'map', label: '🗺️ Карта' });
    actions.push({ id: 'refresh', label: '🔄 Обновить' });
    
    actions.forEach(a => {
        const btn = document.createElement('button');
        btn.className = 'btn-game';
        btn.textContent = a.label;
        btn.onclick = function() { gameAction(a.id); };
        container.appendChild(btn);
    });
}

function openMap() {
    const user = users[currentUser];
    if (!user) return;
    const modal = document.getElementById('modal-map');
    const content = document.getElementById('modal-map-content');
    const place = user.game.location.place;
    const exits = getExits(place, user.game.outside);
    
    let html = '<div class="modal-section"><h4>📍 ' + place + ' (ур. ' + (LOCATION_LEVELS[place] || 1) + ')</h4></div>';
    html += '<div class="modal-section">';
    
    if (exits.length === 0) {
        html += '<p style="color:#6a5a48;">Нет доступных переходов.</p>';
    } else {
        exits.forEach(function(exitId) {
            html += '<div class="row">';
            html += '<span class="label">📍 ' + exitId + '</span>';
            html += '<span class="value"><button class="btn btn-small" onclick="moveToLocation(\'' + exitId + '\')">🚶 Идти</button></span>';
            html += '</div>';
        });
    }
    
    html += '</div><button class="btn" onclick="closeMap()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeMap() {
    document.getElementById('modal-map').classList.add('hide');
}

function moveToLocation(target) {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    
    if (isBusy) { setMessage('⏳ Вы заняты.'); return; }
    
    if (target === 'Дорога') {
        g.location.place = 'Дорога';
        g.location.location = 'Дорога';
        g.outside = true;
        setMessage('🛤️ Вы вышли на Королевский тракт.');
    } else if (g.location.place === 'Дорога' && target === 'Ворота') {
        g.location.place = 'Ворота';
        g.location.location = 'Королевская Гавань';
        g.outside = false;
        setMessage('🚪 Вы вошли в Королевскую Гавань.');
    } else {
        g.location.place = target;
        g.location.location = 'Королевская Гавань';
        setMessage('✅ Вы прибыли в ' + target + '.');
    }
    
    closeMap();
    updateMenu();
    updateStory();
    updateActions();
    saveData();
}

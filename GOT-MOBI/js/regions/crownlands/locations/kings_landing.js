// ============================================================
// ДИАГНОСТИКА ЗАГРУЗКИ
// ============================================================
(function() {
    var errors = [];
    
    if (typeof users === 'undefined') errors.push('users');
    if (typeof LOCATION_LEVELS === 'undefined') errors.push('LOCATION_LEVELS');
    if (typeof updateMenu === 'undefined') errors.push('updateMenu');
    if (typeof gameAction === 'undefined') errors.push('gameAction');
    if (typeof saveData === 'undefined') errors.push('saveData');
    if (typeof setMessage === 'undefined') errors.push('setMessage');
    
    var gameMsg = document.getElementById('game-message');
    if (gameMsg) {
        if (errors.length === 0) {
            gameMsg.textContent = '✅ ГОРОД ЗАГРУЖЕН!';
            gameMsg.style.color = '#7ac98a';
        } else {
            gameMsg.textContent = '❌ Ошибки: ' + errors.join(', ');
            gameMsg.style.color = '#c96a5a';
        }
    }
})();

// ============================================================
// КОРОЛЕВСКАЯ ГАВАНЬ — ГОРОД
// ============================================================

function getLocationText(place) {
    var texts = {
        'Таверна': 'Добро пожаловать в таверну. Здесь можно поесть, поработать и поговорить с трактирщиком.',
        'Рынок': '🏪 Центральный рынок Королевской Гавани.',
        'Кузница': 'Вы в кузнице. Здесь можно купить ресурсы и скрафтить предметы.',
        'Оружейная лавка': 'Вы в оружейной лавке.',
        'Кожевник': 'Вы у кожевника. Здесь можно купить кожаную броню.',
        'Бронник': 'Вы у бронника. Здесь можно купить латную броню.',
        'Плотник': 'Вы у плотника. Здесь можно купить луки и арбалеты.',
        'Конюшня': '🐴 Королевская конюшня.',
        'Гильдия торговцев': 'Вы в гильдии торговцев.',
        'Магистрат': '📜 Магистрат — центр управления городом.',
        'Ворота': 'Вы у городских ворот.',
        'Королевский квартал': '👑 Элитный район.',
        'Торговый квартал': '🏙️ Центр торговли.',
        'Квартал бедноты': '🏚️ Окраина города.',
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

function getExits(place) {
    var allExits = {
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
        'Дорога': ['Ворота'],
        'Библиотека мейстеров': ['Королевский квартал'],
        'Гильдия наёмников': ['Рынок'],
        'Бордель': ['Квартал бедноты']
    };
    return allExits[place] || [];
}

function updateStory() {
    var user = users[currentUser];
    if (!user) return;
    var place = user.game.location.place;
    document.getElementById('story-title').textContent = '📍 ' + place + ' (ур.' + (LOCATION_LEVELS[place] || 1) + ')';
    document.getElementById('story-text').textContent = getLocationText(place);
}

function updateActions() {
    var user = users[currentUser];
    if (!user) return;
    var place = user.game.location.place;
    var container = document.getElementById('actions-container');
    container.innerHTML = '';
    
    var actions = [];
    
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
    
    if (place === 'Ворота') {
        actions.push({ id: 'leave_city', label: '🚪 Выйти на Дорогу' });
    }
    
    if (place === 'Дорога') {
        actions.push({ id: 'search', label: '🔍 Поиск' });
        actions.push({ id: 'enter_city', label: '🚪 Войти в Королевскую Гавань' });
    }
    
    actions.push({ id: 'map', label: '🗺️ Карта' });
    actions.push({ id: 'refresh', label: '🔄 Обновить' });
    
    for (var i = 0; i < actions.length; i++) {
        var a = actions[i];
        var btn = document.createElement('button');
        btn.className = 'btn-game';
        btn.textContent = a.label;
        btn.setAttribute('data-action', a.id);
        btn.onclick = function() {
            var actionId = this.getAttribute('data-action');
            if (typeof gameAction === 'function') {
                gameAction(actionId);
            } else {
                var msg = document.getElementById('game-message');
                if (msg) msg.textContent = '❌ gameAction не найдена!';
            }
        };
        container.appendChild(btn);
    }
}

function openMap() {
    var user = users[currentUser];
    if (!user) return;
    var modal = document.getElementById('modal-map');
    var content = document.getElementById('modal-map-content');
    var place = user.game.location.place;
    var exits = getExits(place);
    
    var html = '<div class="modal-section"><h4>📍 ' + place + ' (ур. ' + (LOCATION_LEVELS[place] || 1) + ')</h4></div>';
    html += '<div class="modal-section">';
    
    if (exits.length === 0) {
        html += '<p style="color:#6a5a48;">Нет доступных переходов.</p>';
    } else {
        for (var i = 0; i < exits.length; i++) {
            var exitId = exits[i];
            html += '<div class="row">';
            html += '<span class="label">📍 ' + exitId + '</span>';
            html += '<span class="value"><button class="btn btn-small" onclick="moveToLocation(\'' + exitId + '\')">🚶 Идти</button></span>';
            html += '</div>';
        }
    }
    
    html += '</div><button class="btn" onclick="closeMap()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeMap() {
    document.getElementById('modal-map').classList.add('hide');
}

function moveToLocation(target) {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    
    if (isBusy) { setMessage('⏳ Вы заняты.'); return; }
    
    closeMap();
    
    if (target === 'Дорога') {
        g.location.place = 'Дорога';
        g.location.location = 'Дорога';
        g.outside = true;
        setMessage('🛤️ Вы вышли на Королевский тракт.');
    } else if (target === 'Ворота' && g.outside) {
        g.location.place = 'Ворота';
        g.location.location = 'Королевская Гавань';
        g.outside = false;
        setMessage('🚪 Вы вошли в Королевскую Гавань.');
    } else {
        g.location.place = target;
        g.location.location = 'Королевская Гавань';
        g.outside = false;
        setMessage('✅ Вы прибыли в ' + target + '.');
    }
    
    updateMenu();
    updateStory();
    updateActions();
    saveData();
}

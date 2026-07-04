// ============================================================
// КОРОЛЕВСКАЯ ГАВАНЬ — ВСЕ ЗДАНИЯ
// ============================================================

function getLocationText(place) {
    var texts = {
        'Таверна': 'Добро пожаловать в таверну. Здесь можно поесть, поработать и поговорить с трактирщиком.',
        'Рынок': '🏪 Центральный рынок Королевской Гавани. Здесь можно торговать с другими игроками.',
        'Кузница': 'Вы в кузнице. Здесь можно купить ресурсы и скрафтить предметы.',
        'Оружейная лавка': 'Вы в оружейной лавке. Здесь можно купить и продать оружие.',
        'Кожевник': 'Вы у кожевника. Здесь можно купить и продать кожаную броню.',
        'Бронник': 'Вы у бронника. Здесь можно купить и продать латную броню.',
        'Плотник': 'Вы у плотника. Здесь можно купить и продать луки и арбалеты.',
        'Конюшня': '🐴 Королевская конюшня. Здесь можно купить лошадь.',
        'Гильдия торговцев': 'Вы в гильдии торговцев. Здесь можно торговать на аукционе.',
        'Магистрат': '📜 Магистрат — центр управления городом. Здесь можно купить жильё и лавки.',
        'Ворота': 'Вы у городских ворот. Отсюда можно выйти на Дорогу.',
        'Королевский квартал': '👑 Элитный район. Здесь живут самые богатые и влиятельные люди.',
        'Торговый квартал': '🏙️ Центр торговли. Здесь селятся ремесленники и купцы.',
        'Квартал бедноты': '🏚️ Окраина города. Жильё здесь дёшево, но опасно.',
        'Дом': '🏠 Ваш дом. Здесь можно отдохнуть и хранить вещи.',
        'Великая септа': '⛪ Великая Септа Бейлора. Здесь можно исцелиться и получить благословение.',
        'Порт': '⛵ Порт Королевской Гавани. Морские путешествия.',
        'Тюрьма': '⛓️ Вы в тюрьме. Заплатите штраф или ждите освобождения.',
        'Дорога': '🛤️ Дорога у ворот Королевской Гавани.',
        'Библиотека мейстеров': '📚 Библиотека мейстеров. Здесь можно купить и читать книги.',
        'Гильдия наёмников': '🗡️ Гильдия наёмников. Ежедневные задания и контракты.',
        'Бордель': '💃 Бордель Королевской Гавани. Отдых, развлечения и игра в кости.'
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
    
    // ТАВЕРНА
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
    
    // МАГАЗИНЫ (универсальная кнопка)
    if (place === 'Оружейная лавка' || place === 'Кожевник' || place === 'Бронник' || place === 'Плотник' || place === 'Кузница') {
        actions.push({ id: 'shop', label: '🛒 Открыть магазин' });
        if (place === 'Кузница') {
            actions.push({ id: 'craft', label: '🔨 Крафт' });
        }
    }
    
    // КОНЮШНЯ
    if (place === 'Конюшня') {
        actions.push({ id: 'open_stable', label: '🐴 Купить лошадь' });
    }
    
    // СЕПТА
    if (place === 'Великая септа') {
        actions.push({ id: 'open_temple', label: '⛪ Войти в Септу' });
    }
    
    // ПОРТ
    if (place === 'Порт') {
        actions.push({ id: 'open_port', label: '⛵ Открыть карту портов' });
    }
    
    // РЫНОК
    if (place === 'Рынок') {
        actions.push({ id: 'open_market', label: '🏪 Торговые лавки' });
    }
    
    // ГИЛЬДИЯ ТОРГОВЦЕВ
    if (place === 'Гильдия торговцев') {
        actions.push({ id: 'guild', label: '🏛️ Аукцион' });
    }
    
    // МАГИСТРАТ
    if (place === 'Магистрат') {
        actions.push({ id: 'open_magistrate', label: '📜 Недвижимость и лавки' });
    }
    
    // ЖИЛЫЕ КВАРТАЛЫ
    if (place === 'Королевский квартал' || place === 'Торговый квартал' || place === 'Квартал бедноты') {
        actions.push({ id: 'buy_house', label: '🏠 Купить жильё' });
        actions.push({ id: 'enter_house', label: '🔑 Войти в дом' });
    }
    
    // ДОМ
    if (place === 'Дом') {
        actions.push({ id: 'rest_home', label: '🛏️ Отдохнуть' });
        actions.push({ id: 'storage', label: '📦 Склад' });
        actions.push({ id: 'leave_house', label: '🚪 Выйти в район' });
    }
    
    // БИБЛИОТЕКА
    if (place === 'Библиотека мейстеров') {
        actions.push({ id: 'open_library', label: '📚 Читать книги' });
    }
    
    // ГИЛЬДИЯ НАЁМНИКОВ
    if (place === 'Гильдия наёмников') {
        actions.push({ id: 'open_guildhall', label: '🗡️ Задания' });
    }
    
    // БОРДЕЛЬ
    if (place === 'Бордель') {
        actions.push({ id: 'open_brothel', label: '💃 Услуги и кости' });
    }
    
    // ТЮРЬМА
    if (place === 'Тюрьма') {
        actions.push({ id: 'jail_pay', label: '💰 Заплатить штраф' });
        actions.push({ id: 'jail_wait', label: '⏳ Ждать освобождения' });
        actions.push({ id: 'jail_escape', label: '🏃 Попытаться сбежать' });
    }
    
    // ВОРОТА
    if (place === 'Ворота') {
        actions.push({ id: 'leave_city', label: '🚪 Выйти на Дорогу' });
    }
    
    // ДОРОГА
    if (place === 'Дорога') {
        actions.push({ id: 'search', label: '🔍 Поиск' });
        actions.push({ id: 'enter_city', label: '🚪 Войти в Королевскую Гавань' });
    }
    
    // ОБЩИЕ КНОПКИ
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
            gameAction(actionId);
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

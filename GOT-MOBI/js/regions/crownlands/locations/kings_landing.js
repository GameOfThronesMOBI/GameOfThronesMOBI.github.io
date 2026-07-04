// ============================================================
// КОРОЛЕВСКАЯ ГАВАНЬ — ГОРОД
// ============================================================

function getLocationText(place) {
    var texts = {
        'Таверна': '🍺 Таверна «У Золотого Дракона». Здесь можно поесть, поработать и поговорить с трактирщиком.',
        'Рынок': '🏪 Центральный рынок Королевской Гавани. Торговые лавки игроков.',
        'Кузница': '⚒️ Кузница. Покупка ресурсов и крафт предметов.',
        'Оружейная лавка': '🗡️ Оружейная лавка. Покупка и продажа оружия.',
        'Кожевник': '🪡 Кожевник. Покупка и продажа кожаной брони.',
        'Бронник': '🛡️ Бронник. Покупка и продажа латной брони.',
        'Плотник': '🪵 Плотник. Покупка и продажа луков и арбалетов.',
        'Конюшня': '🐴 Королевская конюшня. Покупка и продажа лошадей.',
        'Гильдия торговцев': '🏛️ Гильдия торговцев. Аукцион редких предметов.',
        'Магистрат': '📜 Магистрат. Управление недвижимостью и торговыми лавками.',
        'Ворота': '🚪 Главные ворота Королевской Гавани. Выход на Дорогу и вход в Красный Замок.',
        'Красный Замок': '🏰 Вход в Красный Замок — резиденцию короля.',
        'Королевский квартал': '👑 Королевский квартал. Элитное жильё.',
        'Торговый квартал': '🏙️ Торговый квартал. Среднее жильё.',
        'Квартал бедноты': '🏚️ Квартал бедноты. Дешёвое жильё.',
        'Дом': '🏠 Ваш дом. Отдых и хранение вещей.',
        'Великая септа': '⛪ Великая Септа Бейлора. Исцеление, благословение и удача.',
        'Порт': '⛵ Порт Королевской Гавани. Морские путешествия.',
        'Тюрьма': '⛓️ Тюрьма. Штраф, ожидание или побег.',
        'Дорога': '🛤️ Королевский тракт. Поиск приключений.',
        'Библиотека мейстеров': '📚 Библиотека мейстеров. Покупка и чтение книг.',
        'Гильдия наёмников': '🗡️ Гильдия наёмников. Ежедневные задания и контракты.',
        'Бордель': '💃 Бордель. Отдых, развлечения и игра в кости.'
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
        'Ворота': ['Красный Замок', 'Таверна', 'Конюшня', 'Великая септа', 'Порт', 'Дорога'],
        'Красный Замок': ['Ворота'],
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
    document.getElementById('story-title').textContent = '📍 ' + place;
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
        actions.push({ id: 'tavern_eat', label: '🍞 Попросить еды (+25)' });
        actions.push({ id: 'tavern_buy', label: '🛒 Купить еду и напитки' });
        actions.push({ id: 'wash', label: '🧹 Помыть посуду (1 мин → +1 МП)' });
        actions.push({ id: 'sweep', label: '🧹 Подмести пол (5 мин → +5 МП)' });
        actions.push({ id: 'rest', label: '🛏️ Отдохнуть (10 МП → +30 уст., +15 HP)' });
        actions.push({ id: 'talk', label: '🗣️ Поговорить с трактирщиком' });
    }
    
    // МАГАЗИНЫ
    if (place === 'Оружейная лавка') {
        actions.push({ id: 'shop_weapons', label: '🗡️ Купить оружие' });
        actions.push({ id: 'shop_sell', label: '💰 Продать оружие' });
    }
    if (place === 'Кожевник') {
        actions.push({ id: 'shop_leather', label: '🪡 Купить кожаную броню' });
        actions.push({ id: 'shop_sell', label: '💰 Продать броню' });
    }
    if (place === 'Бронник') {
        actions.push({ id: 'shop_plate', label: '🛡️ Купить латную броню' });
        actions.push({ id: 'shop_sell', label: '💰 Продать броню' });
    }
    if (place === 'Плотник') {
        actions.push({ id: 'shop_bows', label: '🏹 Купить луки и арбалеты' });
        actions.push({ id: 'shop_sell', label: '💰 Продать оружие' });
    }
    if (place === 'Кузница') {
        actions.push({ id: 'shop_resources', label: '⛏️ Купить ресурсы' });
        actions.push({ id: 'shop_sell', label: '💰 Продать ресурсы' });
        actions.push({ id: 'craft', label: '🔨 Крафт' });
    }
    
    // КОНЮШНЯ
    if (place === 'Конюшня') {
        actions.push({ id: 'stable_buy', label: '🐴 Купить лошадь' });
        actions.push({ id: 'stable_sell', label: '💰 Продать лошадь' });
    }
    
    // ВЕЛИКАЯ СЕПТА
    if (place === 'Великая септа') {
        actions.push({ id: 'temple_heal', label: '💉 Бесплатное исцеление (раз в 2ч)' });
        actions.push({ id: 'temple_bless', label: '🙏 Благословение (+10% XP, раз в день)' });
        actions.push({ id: 'temple_luck', label: '🍀 Купить удачу (1000 зол → +5)' });
    }
    
    // РЫНОК
    if (place === 'Рынок') {
        actions.push({ id: 'market_stalls', label: '🏪 Смотреть все лавки' });
        actions.push({ id: 'market_my_stall', label: '📦 Моя лавка' });
    }
    
    // ГИЛЬДИЯ ТОРГОВЦЕВ (АУКЦИОН)
    if (place === 'Гильдия торговцев') {
        actions.push({ id: 'auction_list', label: '📋 Все лоты' });
        actions.push({ id: 'auction_my', label: '📦 Мои лоты' });
        actions.push({ id: 'auction_sell', label: '💼 Выставить на продажу' });
    }
    
    // МАГИСТРАТ
    if (place === 'Магистрат') {
        actions.push({ id: 'magistrate_housing', label: '🏠 Купить жильё' });
        actions.push({ id: 'magistrate_stall_buy', label: '🏪 Купить лавку (80 зол)' });
        actions.push({ id: 'magistrate_stall_pay', label: '💰 Оплатить аренду лавки' });
        actions.push({ id: 'magistrate_rent_pay', label: '💳 Оплатить аренду жилья' });
        actions.push({ id: 'magistrate_confiscated', label: '📦 Конфискат' });
    }
    
    // ЖИЛЫЕ КВАРТАЛЫ
    if (place === 'Королевский квартал' || place === 'Торговый квартал' || place === 'Квартал бедноты') {
        actions.push({ id: 'housing_view', label: '🏠 Смотреть жильё' });
        actions.push({ id: 'housing_enter', label: '🔑 Войти в свой дом' });
    }
    
    // ДОМ
    if (place === 'Дом') {
        actions.push({ id: 'home_rest', label: '🛏️ Отдохнуть (бесплатно)' });
        actions.push({ id: 'home_storage', label: '📦 Открыть склад' });
        actions.push({ id: 'home_leave', label: '🚪 Выйти из дома' });
    }
    
    // БИБЛИОТЕКА
    if (place === 'Библиотека мейстеров') {
        actions.push({ id: 'library_buy', label: '📖 Купить книгу' });
        actions.push({ id: 'library_read', label: '📚 Читать книгу' });
    }
    
    // ГИЛЬДИЯ НАЁМНИКОВ
    if (place === 'Гильдия наёмников') {
        actions.push({ id: 'quest_take', label: '📋 Взять задание' });
        actions.push({ id: 'quest_abandon', label: '❌ Отказаться от задания' });
        actions.push({ id: 'quest_progress', label: '📊 Прогресс задания' });
    }
    
    // БОРДЕЛЬ
    if (place === 'Бордель') {
        actions.push({ id: 'brothel_rest', label: '🛏️ Отдых с девушкой (+50 уст, 20 зол)' });
        actions.push({ id: 'brothel_dice', label: '🎲 Игра в кости (PvP)' });
    }
    
    // ТЮРЬМА
    if (place === 'Тюрьма') {
        actions.push({ id: 'jail_pay', label: '💰 Заплатить штраф' });
        actions.push({ id: 'jail_wait', label: '⏳ Ждать освобождения' });
        actions.push({ id: 'jail_escape', label: '🏃 Попытаться сбежать (10%)' });
    }
    
    // ПОРТ
    if (place === 'Порт') {
        actions.push({ id: 'port_travel', label: '⛵ Путешествовать' });
    }
    
    // ВОРОТА
    if (place === 'Ворота') {
        actions.push({ id: 'enter_red_keep', label: '🏰 Войти в Красный Замок' });
        actions.push({ id: 'leave_city', label: '🚪 Выйти на Дорогу' });
    }
    
    // КРАСНЫЙ ЗАМОК (переход)
    if (place === 'Красный Замок') {
        actions.push({ id: 'enter_red_keep', label: '🏰 Войти в Красный Замок' });
    }
    
    // ДОРОГА
    if (place === 'Дорога') {
        actions.push({ id: 'search', label: '🔍 Поиск' });
        actions.push({ id: 'enter_city', label: '🚪 Войти в Королевскую Гавань' });
    }
    
    // ОБЩИЕ КНОПКИ
    actions.push({ id: 'map', label: '🗺️ Карта' });
    actions.push({ id: 'inventory', label: '🎒 Инвентарь' });
    actions.push({ id: 'character', label: '👤 Персонаж' });
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
    
    var html = '<div class="modal-section"><h4>📍 ' + place + '</h4></div>';
    html += '<div class="modal-section"><p style="color:#6a5a48;">Куда идти?</p>';
    
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
    
    if (target === 'Красный Замок' && typeof enterRedKeep === 'function') {
        enterRedKeep();
        return;
    }
    
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

// ============================================================
// КОРОЛЕВСКАЯ ГАВАНЬ — ПОЛНЫЙ ГОРОД
// ВСЕ здания, ВСЕ предметы, ВСЕ цены, ВСЕ эмодзи
// ============================================================

// ============================================================
// ЦЕНЫ И АССОРТИМЕНТ КОРОЛЕВСКОЙ ГАВАНИ
// ============================================================
var KL_PRICES = {
    // ТАВЕРНА
    tavern: [
        { name: '🍞 Хлеб', price: 5, food: 20, quality: 'Обычное', type: 'food', emoji: '🍞' },
        { name: '🥩 Мясо', price: 10, food: 30, quality: 'Обычное', type: 'food', emoji: '🥩' },
        { name: '💧 Вода', price: 2, thirst: 15, quality: 'Обычное', type: 'food', emoji: '💧' },
        { name: '🍺 Эль', price: 5, thirst: 10, hp: 5, quality: 'Обычное', type: 'food', emoji: '🍺' },
        { name: '🍷 Вино', price: 8, thirst: 15, hp: 8, quality: 'Обычное', type: 'food', emoji: '🍷' }
    ],
    
    // ОРУЖЕЙНАЯ ЛАВКА
    weapons: [
        { name: '🗡️ Деревянный меч', price: 15, type: 'sword', level: 1, baseDamage: 3, quality: 'Рваное', emoji: '🗡️' },
        { name: '🗡️ Ржавый меч', price: 30, type: 'sword', level: 5, baseDamage: 5, quality: 'Плохое', emoji: '🗡️' },
        { name: '🗡️ Короткий меч', price: 60, type: 'sword', level: 10, baseDamage: 7, quality: 'Обычное', emoji: '🗡️' },
        { name: '🗡️ Длинный меч', price: 150, type: 'sword', level: 25, baseDamage: 16, quality: 'Хорошее', emoji: '⚔️' },
        { name: '🗡️ Стальной меч', price: 400, type: 'sword', level: 35, baseDamage: 22, quality: 'Качественное', emoji: '⚔️' },
        { name: '🔱 Копьё охотника', price: 45, type: 'spear', level: 15, baseDamage: 9, quality: 'Обычное', emoji: '🔱' },
        { name: '🔱 Стальное копьё', price: 250, type: 'spear', level: 40, baseDamage: 22, quality: 'Качественное', emoji: '🔱' },
        { name: '🪓 Боевой топор', price: 80, type: 'axe', level: 10, baseDamage: 8, quality: 'Обычное', emoji: '🪓' },
        { name: '🪓 Стальной топор', price: 300, type: 'axe', level: 30, baseDamage: 19, quality: 'Качественное', emoji: '🪓' },
        { name: '🔨 Булава разбойника', price: 55, type: 'mace', level: 10, baseDamage: 8, quality: 'Обычное', emoji: '🔨' },
        { name: '🏹 Короткий лук', price: 40, type: 'bow', level: 1, baseDamage: 3, quality: 'Обычное', emoji: '🏹' },
        { name: '🏹 Охотничий лук', price: 100, type: 'bow', level: 5, baseDamage: 5, quality: 'Обычное', emoji: '🏹' },
        { name: '🎯 Лёгкий арбалет', price: 120, type: 'crossbow', level: 5, baseDamage: 5, quality: 'Обычное', emoji: '🎯' },
        { name: '🔪 Ржавый кинжал', price: 10, type: 'dagger', level: 1, baseDamage: 2, quality: 'Рваное', emoji: '🔪' },
        { name: '🔪 Стальной кинжал', price: 80, type: 'dagger', level: 20, baseDamage: 10, quality: 'Обычное', emoji: '🔪' },
        { name: '🛡️ Деревянный щит', price: 25, type: 'shield', level: 1, defense: 2, quality: 'Рваное', emoji: '🛡️' },
        { name: '🛡️ Стальной щит', price: 200, type: 'shield', level: 25, defense: 12, quality: 'Обычное', emoji: '🛡️' }
    ],
    
    // КОЖЕВНИК
    leather: [
        { name: '🪖 Кожаный шлем', price: 40, type: 'helmet', level: 10, baseDefense: 3, quality: 'Обычное', armorClass: 'leather', emoji: '🪖' },
        { name: '🪖 Кожаный шлем разбойника', price: 90, type: 'helmet', level: 15, baseDefense: 5, quality: 'Хорошее', armorClass: 'leather', emoji: '🪖' },
        { name: '🦺 Кожаный нагрудник', price: 70, type: 'chestplate', level: 10, baseDefense: 5, quality: 'Обычное', armorClass: 'leather', emoji: '🦺' },
        { name: '🦺 Кожаный нагрудник наёмника', price: 160, type: 'chestplate', level: 20, baseDefense: 11, quality: 'Хорошее', armorClass: 'leather', emoji: '🦺' },
        { name: '👢 Кожаные сапоги', price: 35, type: 'boots', level: 10, baseDefense: 2, speedPercent: 3, quality: 'Обычное', armorClass: 'leather', emoji: '👢' },
        { name: '🧤 Кожаные перчатки', price: 25, type: 'gloves', level: 10, baseDefense: 2, quality: 'Обычное', armorClass: 'leather', emoji: '🧤' },
        { name: '🎗️ Кожаный пояс', price: 30, type: 'belt', level: 10, baseDefense: 2, quality: 'Обычное', armorClass: 'leather', emoji: '🎗️' },
        { name: '🧥 Кожаный плащ', price: 45, type: 'cloak', level: 10, baseDefense: 2, quality: 'Обычное', armorClass: 'leather', emoji: '🧥' },
        { name: '💪 Кожаные наплечники', price: 50, type: 'shoulders', level: 10, baseDefense: 2, quality: 'Обычное', armorClass: 'leather', emoji: '💪' },
        { name: '👖 Кожаные поножи', price: 55, type: 'leggings', level: 10, baseDefense: 2, quality: 'Обычное', armorClass: 'leather', emoji: '👖' }
    ],
    
    // БРОННИК
    plate: [
        { name: '🪖 Латный шлем', price: 100, type: 'helmet', level: 10, baseDefense: 5, quality: 'Обычное', armorClass: 'plate', emoji: '🪖' },
        { name: '🪖 Латный шлем рыцаря', price: 250, type: 'helmet', level: 30, baseDefense: 13, quality: 'Хорошее', armorClass: 'plate', emoji: '🪖' },
        { name: '🦺 Латный нагрудник', price: 200, type: 'chestplate', level: 10, baseDefense: 8, quality: 'Обычное', armorClass: 'plate', emoji: '🦺' },
        { name: '🦺 Латный нагрудник рыцаря', price: 500, type: 'chestplate', level: 30, baseDefense: 24, quality: 'Хорошее', armorClass: 'plate', emoji: '🦺' },
        { name: '👢 Латные сапоги', price: 80, type: 'boots', level: 10, baseDefense: 4, speedPercent: 2, quality: 'Обычное', armorClass: 'plate', emoji: '👢' },
        { name: '🧤 Латные перчатки', price: 60, type: 'gloves', level: 10, baseDefense: 4, quality: 'Обычное', armorClass: 'plate', emoji: '🧤' },
        { name: '🎗️ Латный пояс', price: 70, type: 'belt', level: 10, baseDefense: 4, quality: 'Обычное', armorClass: 'plate', emoji: '🎗️' },
        { name: '🧥 Латный плащ', price: 120, type: 'cloak', level: 10, baseDefense: 4, quality: 'Обычное', armorClass: 'plate', emoji: '🧥' },
        { name: '💪 Латные наплечники', price: 110, type: 'shoulders', level: 10, baseDefense: 4, quality: 'Обычное', armorClass: 'plate', emoji: '💪' },
        { name: '👖 Латные поножи', price: 130, type: 'leggings', level: 10, baseDefense: 4, quality: 'Обычное', armorClass: 'plate', emoji: '👖' }
    ],
    
    // ПЛОТНИК
    bows: [
        { name: '🏹 Короткий лук', price: 40, type: 'bow', level: 1, baseDamage: 3, quality: 'Обычное', emoji: '🏹' },
        { name: '🏹 Длинный лук', price: 150, type: 'bow', level: 25, baseDamage: 13, quality: 'Хорошее', emoji: '🏹' },
        { name: '🏹 Лук рыцаря', price: 350, type: 'bow', level: 35, baseDamage: 18, quality: 'Качественное', emoji: '🏹' },
        { name: '🎯 Лёгкий арбалет', price: 120, type: 'crossbow', level: 5, baseDamage: 5, quality: 'Обычное', emoji: '🎯' },
        { name: '🎯 Арбалет стражи', price: 280, type: 'crossbow', level: 20, baseDamage: 12, quality: 'Хорошее', emoji: '🎯' },
        { name: '🎯 Тяжёлый арбалет', price: 500, type: 'crossbow', level: 35, baseDamage: 21, quality: 'Качественное', emoji: '🎯' }
    ],
    
    // КУЗНИЦА
    resources: [
        { name: '⛏️ Руда железная', price: 8, type: 'resource', resourceType: 'iron', quality: 'Обычное', emoji: '⛏️' },
        { name: '🔥 Уголь', price: 4, type: 'resource', resourceType: 'coal', quality: 'Обычное', emoji: '🔥' },
        { name: '⚒️ Сталь', price: 50, type: 'resource', resourceType: 'steel', quality: 'Обычное', emoji: '⚒️' },
        { name: '⛏️ Руда железная (хор.)', price: 20, type: 'resource', resourceType: 'iron', quality: 'Хорошее', emoji: '⛏️' },
        { name: '⚒️ Сталь (кач.)', price: 150, type: 'resource', resourceType: 'steel', quality: 'Качественное', emoji: '⚒️' }
    ],
    
    // КОНЮШНЯ
    horses: [
        { name: '🐴 Рабочая лошадь', price: 50, type: 'work', speed: 10, defense: 0, hp: 80, slots: 5, emoji: '🐴' },
        { name: '🏇 Верховая лошадь', price: 150, type: 'riding', speed: 25, defense: 2, hp: 100, slots: 10, emoji: '🏇' },
        { name: '⚔️🐴 Боевой конь', price: 400, type: 'war', speed: 20, defense: 5, hp: 150, slots: 8, emoji: '⚔️🐴' },
        { name: '🏃🐴 Скакун', price: 600, type: 'racer', speed: 50, defense: 0, hp: 70, slots: 3, emoji: '🏃🐴' },
        { name: '🛡️🐴 Тяжелый скакун', price: 800, type: 'heavy', speed: 15, defense: 8, hp: 200, slots: 15, emoji: '🛡️🐴' },
        { name: '👑🐴 Королевский скакун', price: 1500, type: 'royal', speed: 40, defense: 6, hp: 180, slots: 12, emoji: '👑🐴' },
        { name: '🔥🐴 Огненный жеребец', price: 3000, type: 'fire', speed: 60, defense: 10, hp: 250, slots: 10, emoji: '🔥🐴' }
    ],
    
    // СЕПТА
    temple: [
        { name: '🧪 Малое зелье здоровья', price: 30, hp: 20, emoji: '🧪' },
        { name: '🧪 Среднее зелье здоровья', price: 80, hp: 50, emoji: '🧪' },
        { name: '🧪 Большое зелье здоровья', price: 150, hp: 100, emoji: '🧪' },
        { name: '🧪 Зелье восстановления', price: 200, hp: 50, fatigue: 30, emoji: '🧪' }
    ],
    
    // БОРДЕЛЬ
    brothel: [
        { name: '🛏️ Отдых с девушкой', price: 20, fatigue: 50, hp: 10, emoji: '💃' },
        { name: '🍷 Вино с компанией', price: 50, fatigue: 30, hp: 5, xpBuff: 5, emoji: '🍷' },
        { name: '💃 Танец', price: 100, fatigue: 20, damageBuff: 10, emoji: '💃' },
        { name: '👑 VIP-комната', price: 200, fatigue: 80, hp: 20, xpBuff: 15, emoji: '👑' }
    ],
    
    // БИБЛИОТЕКА
    books: [
        { name: '📖 Искусство войны (ур.1)', price: 100, xp: 50, level: 1, emoji: '📖' },
        { name: '📖 Искусство войны (ур.5)', price: 200, xp: 100, level: 5, emoji: '📖' },
        { name: '📖 Искусство войны (ур.10)', price: 350, xp: 150, level: 10, emoji: '📖' },
        { name: '📖 Искусство войны (ур.15)', price: 500, xp: 200, level: 15, emoji: '📖' },
        { name: '📖 Искусство войны (ур.20)', price: 700, xp: 300, level: 20, emoji: '📖' },
        { name: '📖 Искусство войны (ур.25)', price: 1000, xp: 400, level: 25, emoji: '📖' }
    ]
};

// ============================================================
// ТЕКСТЫ ЛОКАЦИЙ
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

// ============================================================
// ПЕРЕХОДЫ
// ============================================================
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

// ============================================================
// ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
// ============================================================
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
    
    // СЕПТА
    if (place === 'Великая септа') {
        actions.push({ id: 'temple_heal', label: '💉 Бесплатное исцеление (раз в 2ч)' });
        actions.push({ id: 'temple_bless', label: '🙏 Благословение (+10% XP, раз в день)' });
        actions.push({ id: 'temple_luck', label: '🍀 Купить удачу (1000 зол → +5)' });
        actions.push({ id: 'temple_potions', label: '🧪 Купить зелья' });
    }
    
    // РЫНОК
    if (place === 'Рынок') {
        actions.push({ id: 'market_stalls', label: '🏪 Смотреть все лавки' });
        actions.push({ id: 'market_my_stall', label: '📦 Моя лавка' });
    }
    
    // АУКЦИОН
    if (place === 'Гильдия торговцев') {
        actions.push({ id: 'auction_list', label: '📋 Все лоты' });
        actions.push({ id: 'auction_my', label: '📦 Мои лоты' });
        actions.push({ id: 'auction_sell', label: '💼 Выставить лот' });
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
    
    // КРАСНЫЙ ЗАМОК
    if (place === 'Красный Замок') {
        actions.push({ id: 'enter_red_keep', label: '🏰 Войти в Красный Замок' });
    }
    
    // ДОРОГА
    if (place === 'Дорога') {
        actions.push({ id: 'search', label: '🔍 Поиск' });
        actions.push({ id: 'enter_city', label: '🚪 Войти в Королевскую Гавань' });
    }
    
    // ОБЩИЕ
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

// ============================================================
// КАРТА
// ============================================================
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

// ============================================================
// ПОКУПКА ПРЕДМЕТОВ
// ============================================================
function buyItem(item, price) {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    
    if (!spendMoney(g, price)) {
        setMessage('❌ Недостаточно денег! Нужно: ' + formatCurrency(price));
        return;
    }
    
    var newItem = {
        name: item.name,
        quality: item.quality || 'Обычное',
        type: item.type || 'item',
        count: 1
    };
    
    if (item.baseDamage) { newItem.baseDamage = item.baseDamage; newItem.finalDamage = item.baseDamage; }
    if (item.baseDefense) { newItem.baseDefense = item.baseDefense; newItem.finalDefense = item.baseDefense; }
    if (item.armorClass) newItem.armorClass = item.armorClass;
    if (item.resourceType) newItem.resourceType = item.resourceType;
    if (item.food) { if (!newItem.effect) newItem.effect = {}; newItem.effect.food = item.food; }
    if (item.thirst) { if (!newItem.effect) newItem.effect = {}; newItem.effect.thirst = item.thirst; }
    if (item.hp) { if (!newItem.effect) newItem.effect = {}; newItem.effect.hp = item.hp; }
    if (item.fatigue) { if (!newItem.effect) newItem.effect = {}; newItem.effect.fatigue = item.fatigue; }
    
    addToInventory(g, newItem);
    convertCurrency(g);
    setMessage('✅ Вы купили ' + item.name + ' за ' + formatCurrency(price) + '.');
    updateMenu();
    saveData();
}

// ============================================================
// ПОКАЗ АССОРТИМЕНТА
// ============================================================
function showShopItems(shopType) {
    var modal = document.getElementById('modal-trade');
    var content = document.getElementById('modal-trade-content');
    var items = [];
    
    if (shopType === 'weapons') items = KL_PRICES.weapons;
    else if (shopType === 'leather') items = KL_PRICES.leather;
    else if (shopType === 'plate') items = KL_PRICES.plate;
    else if (shopType === 'bows') items = KL_PRICES.bows;
    else if (shopType === 'resources') items = KL_PRICES.resources;
    else if (shopType === 'tavern') items = KL_PRICES.tavern;
    else if (shopType === 'horses') items = KL_PRICES.horses;
    else if (shopType === 'temple') items = KL_PRICES.temple;
    else if (shopType === 'brothel') items = KL_PRICES.brothel;
    else if (shopType === 'books') items = KL_PRICES.books;
    
    var titleMap = {
        'weapons': '🗡️ ОРУЖИЕ',
        'leather': '🪡 КОЖАНАЯ БРОНЯ',
        'plate': '🛡️ ЛАТНАЯ БРОНЯ',
        'bows': '🏹 ЛУКИ И АРБАЛЕТЫ',
        'resources': '⛏️ РЕСУРСЫ',
        'tavern': '🍺 ТАВЕРНА',
        'horses': '🐴 КОНЮШНЯ',
        'temple': '⛪ СЕПТА',
        'brothel': '💃 БОРДЕЛЬ',
        'books': '📚 БИБЛИОТЕКА'
    };
    
    var html = '<div class="modal-section"><h4>' + (titleMap[shopType] || 'ТОВАРЫ') + '</h4>';
    
    if (items.length === 0) {
        html += '<p style="color:#6a5a48;">Товаров нет.</p>';
    } else {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var q = QUALITIES[item.quality] || QUALITIES['Обычное'];
            html += '<div class="row" style="padding:6px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label" style="color:' + q.color + ';">' + (item.emoji || '📦') + ' ' + item.name + '</span>';
            html += '<span class="value">' + formatCurrency(item.price) + ' <button class="btn btn-small" onclick="buyItem(KL_PRICES.' + shopType + '[' + i + '], ' + item.price + '); showShopItems(\'' + shopType + '\');">Купить</button></span>';
            html += '</div>';
        }
    }
    
    html += '</div><button class="btn" onclick="document.getElementById(\'modal-trade\').classList.add(\'hide\')">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

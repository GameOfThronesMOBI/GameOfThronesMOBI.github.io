// ============================================================
// КРАСНЫЙ ЗАМОК — КОРОЛЕВСКАЯ ГАВАНЬ
// ============================================================

// ============================================================
// ОПИСАНИЯ ЛОКАЦИЙ КРАСНОГО ЗАМКА
// ============================================================
function getRedKeepText(place) {
    var texts = {
        'Ворота Красного Замка': '🚪 Массивные дубовые ворота с золотыми гвоздями. Стража в красных плащах стоит на посту.',
        'Внешний двор': '🏰 Просторный двор, вымощенный булыжником. Слышен звон стали и ржание лошадей.',
        'Казармы': '🛡️ Длинное каменное здание с рядами коек. Здесь отдыхает гарнизон Красного Замка.',
        'Оружейная замка': '🗡️ Стены увешаны мечами, копьями и щитами. Оружие для королевской стражи.',
        'Склад': '📦 Прохладное помещение с бочками, ящиками и тюками. Припасы для замка.',
        'Амбар': '🌾 Запах зерна и сушёного мяса. Продовольствие на случай осады.',
        'Тренировочная площадка': '⚔️ Открытая площадка с манекенами и мишенями. Здесь тренируются рыцари.',
        'Конюшни замка': '🐴 Тёплое стойло с отборными скакунами. Гарнизонные лошади.',
        'Темницы': '⛓️ Сырые каменные камеры глубоко под землёй. Факелы едва освещают решётки.',
        'Главный зал': '👑 Огромный зал с высокими сводами. Отсюда расходятся коридоры во все части замка.',
        'Тронный зал': '👑 Железный Трон возвышается в центре зала. Тысяча мечей побеждённых врагов.',
        'Казначейство': '💰 Тяжёлая дубовая дверь с тремя замками. Здесь хранится казна короны.',
        'Кухня': '🍗 Пылающие очаги и длинные столы. Повара готовят еду для всего замка.',
        'Библиотека мейстера': '📜 Полки уставлены древними фолиантами. Мейстер склонился над свитком.',
        'Покои лорда': '🕯️ Роскошные покои с балдахином и камином. Здесь отдыхает лорд замка.',
        'Обеденный зал': '🍷 Длинный стол с канделябрами. Здесь проходят пиры и советы.',
        'Комната шёпота': '🕵️ Тёмная комната без окон. Шёпот здесь слышен громче крика.',
        'Зал совета': '⚖️ Круглый стол с креслами. Здесь собирается Малый Совет.',
        'Башня лучников': '🏹 Высокая башня с бойницами. Отсюда простреливается весь двор.',
        'Надвратная башня': '🔥 Массивная башня над главными воротами. Котлы с кипящим маслом наготове.',
        'Стены': '🛡️ Широкие стены с зубцами. Вид на всю Королевскую Гавань.'
    };
    return texts[place] || 'Вы находитесь в ' + place + '.';
}

// ============================================================
// ПЕРЕХОДЫ КРАСНОГО ЗАМКА
// ============================================================
function getRedKeepExits(place) {
    var exits = {
        // ВНЕШНИЙ ДВОР И ВОРОТА
        'Ворота Красного Замка': ['Внешний двор', 'Покинуть Красный Замок'],
        'Внешний двор': ['Ворота Красного Замка', 'Казармы', 'Оружейная замка', 'Склад', 'Амбар', 'Тренировочная площадка', 'Конюшни замка', 'Темницы', 'Главный зал', 'Башня лучников', 'Надвратная башня', 'Стены'],
        
        // ВНУТРИ СТЕН
        'Казармы': ['Внешний двор'],
        'Оружейная замка': ['Внешний двор'],
        'Склад': ['Внешний двор'],
        'Амбар': ['Внешний двор'],
        'Тренировочная площадка': ['Внешний двор'],
        'Конюшни замка': ['Внешний двор'],
        'Темницы': ['Внешний двор'],
        
        // БАШНИ
        'Башня лучников': ['Внешний двор', 'Стены'],
        'Надвратная башня': ['Внешний двор', 'Стены'],
        'Стены': ['Внешний двор', 'Башня лучников', 'Надвратная башня'],
        
        // ГЛАВНОЕ ЗДАНИЕ
        'Главный зал': ['Внешний двор', 'Тронный зал', 'Казначейство', 'Кухня', 'Библиотека мейстера', 'Покои лорда', 'Обеденный зал', 'Комната шёпота', 'Зал совета'],
        'Тронный зал': ['Главный зал'],
        'Казначейство': ['Главный зал'],
        'Кухня': ['Главный зал'],
        'Библиотека мейстера': ['Главный зал'],
        'Покои лорда': ['Главный зал'],
        'Обеденный зал': ['Главный зал'],
        'Комната шёпота': ['Главный зал'],
        'Зал совета': ['Главный зал']
    };
    return exits[place] || [];
}

// ============================================================
// ДЕЙСТВИЯ В КРАСНОМ ЗАМКЕ
// ============================================================
function getRedKeepActions(place, g) {
    var actions = [];
    
    if (place === 'Ворота Красного Замка') {
        actions.push({ id: 'enter_red_keep', label: '🏰 Войти во Внешний двор' });
    }
    
    if (place === 'Внешний двор') {
        actions.push({ id: 'red_keep_leave', label: '🚪 Выйти к Воротам Красного Замка' });
    }
    
    // Заглушки для будущих функций
    if (place === 'Казармы') actions.push({ id: 'placeholder', label: '🚧 Тренировка армии (скоро)' });
    if (place === 'Оружейная замка') actions.push({ id: 'placeholder', label: '🚧 Экипировка стражи (скоро)' });
    if (place === 'Склад') actions.push({ id: 'placeholder', label: '🚧 Склад припасов (скоро)' });
    if (place === 'Амбар') actions.push({ id: 'placeholder', label: '🚧 Продовольствие (скоро)' });
    if (place === 'Тренировочная площадка') actions.push({ id: 'placeholder', label: '🚧 Спарринги (скоро)' });
    if (place === 'Конюшни замка') actions.push({ id: 'placeholder', label: '🚧 Гарнизонные лошади (скоро)' });
    if (place === 'Темницы') actions.push({ id: 'placeholder', label: '🚧 Пленники (скоро)' });
    if (place === 'Главный зал') actions.push({ id: 'placeholder', label: '🚧 Главный зал (скоро)' });
    if (place === 'Тронный зал') actions.push({ id: 'placeholder', label: '🚧 Железный Трон (скоро)' });
    if (place === 'Казначейство') actions.push({ id: 'placeholder', label: '🚧 Казна (скоро)' });
    if (place === 'Кухня') actions.push({ id: 'placeholder', label: '🚧 Приготовление еды (скоро)' });
    if (place === 'Библиотека мейстера') actions.push({ id: 'placeholder', label: '🚧 Исследования (скоро)' });
    if (place === 'Покои лорда') actions.push({ id: 'placeholder', label: '🚧 Отдых лорда (скоро)' });
    if (place === 'Обеденный зал') actions.push({ id: 'placeholder', label: '🚧 Пиры и советы (скоро)' });
    if (place === 'Комната шёпота') actions.push({ id: 'placeholder', label: '🚧 Шпионаж (скоро)' });
    if (place === 'Зал совета') actions.push({ id: 'placeholder', label: '🚧 Совет (скоро)' });
    if (place === 'Башня лучников') actions.push({ id: 'placeholder', label: '🚧 Оборона (скоро)' });
    if (place === 'Надвратная башня') actions.push({ id: 'placeholder', label: '🚧 Защита ворот (скоро)' });
    if (place === 'Стены') actions.push({ id: 'placeholder', label: '🚧 Дозор (скоро)' });
    
    return actions;
}

// ============================================================
// КАРТА КРАСНОГО ЗАМКА
// ============================================================
function openRedKeepMap() {
    var user = users[currentUser];
    if (!user) return;
    var modal = document.getElementById('modal-map');
    var content = document.getElementById('modal-map-content');
    var place = user.game.location.place;
    var exits = getRedKeepExits(place);
    
    var html = '<div class="modal-section"><h4>📍 Красный Замок — ' + place + '</h4></div>';
    html += '<div class="modal-section"><p style="color:#6a5a48;">Куда идти?</p>';
    
    if (exits.length === 0) {
        html += '<p style="color:#6a5a48;">Нет переходов.</p>';
    } else {
        for (var i = 0; i < exits.length; i++) {
            var exitId = exits[i];
            html += '<div class="row">';
            html += '<span class="label">📍 ' + exitId + '</span>';
            
            if (exitId === 'Покинуть Красный Замок') {
                html += '<span class="value"><button class="btn btn-small" onclick="leaveRedKeep()">🚪 Выйти</button></span>';
            } else {
                html += '<span class="value"><button class="btn btn-small" onclick="moveInRedKeep(\'' + exitId + '\')">🚶 Идти</button></span>';
            }
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

// ============================================================
// ПЕРЕМЕЩЕНИЕ ПО КРАСНОМУ ЗАМКУ
// ============================================================
function moveInRedKeep(target) {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    
    g.location.place = target;
    g.location.location = 'Красный Замок';
    
    closeMap();
    updateRedKeepUI();
    saveData();
}

function leaveRedKeep() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    
    g.location.place = 'Ворота';
    g.location.location = 'Королевская Гавань';
    
    closeMap();
    updateMenu();
    updateStory();
    updateActions();
    saveData();
}

// ============================================================
// ВХОД В КРАСНЫЙ ЗАМОК (из города)
// ============================================================
function enterRedKeep() {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    
    g.location.place = 'Ворота Красного Замка';
    g.location.location = 'Красный Замок';
    
    setMessage('🏰 Вы вошли в Красный Замок.');
    updateRedKeepUI();
    saveData();
}

// ============================================================
// ОБНОВЛЕНИЕ ИНТЕРФЕЙСА КРАСНОГО ЗАМКА
// ============================================================
function updateRedKeepUI() {
    var user = users[currentUser];
    if (!user) return;
    var place = user.game.location.place;
    
    document.getElementById('menu-location').textContent = place + ' 🏰';
    
    document.getElementById('story-title').textContent = '📍 ' + place;
    document.getElementById('story-text').textContent = getRedKeepText(place);
    
    var container = document.getElementById('actions-container');
    container.innerHTML = '';
    
    var actions = getRedKeepActions(place, user.game);
    
    actions.push({ id: 'red_keep_map', label: '🗺️ Карта замка' });
    actions.push({ id: 'red_keep_leave', label: '🚪 Покинуть Красный Замок' });
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
            redKeepAction(actionId);
        };
        container.appendChild(btn);
    }
}

// ============================================================
// ОБРАБОТКА ДЕЙСТВИЙ КРАСНОГО ЗАМКА
// ============================================================
function redKeepAction(action) {
    var user = users[currentUser];
    if (!user) return;
    var g = user.game;
    
    if (action === 'red_keep_map') { openRedKeepMap(); return; }
    if (action === 'red_keep_leave' || action === 'enter_red_keep') { leaveRedKeep(); return; }
    if (action === 'inventory') { setMessage('🚧 Инвентарь в разработке.'); return; }
    if (action === 'character') { setMessage('🚧 Персонаж в разработке.'); return; }
    if (action === 'refresh') { location.reload(); return; }
    
    setMessage('🚧 Эта функция появится позже.');
                                                   }

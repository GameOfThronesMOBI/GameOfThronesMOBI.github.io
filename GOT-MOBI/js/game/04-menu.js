// ============================================================
// js/game/04-menu.js — МЕНЮ, ДОМА, СТОЛИЦЫ
// ============================================================

// ============================================================
// 1. ГЛАВНОЕ МЕНЮ
// ============================================================

function openMainMenu() {
    var modal = document.getElementById('modal-menu');
    var content = document.getElementById('modal-menu-content');
    
    var html = '<div class="modal-section">';
    html += '<button class="btn" style="margin:4px 0;" onclick="openHouses()">🏘️ Дома Вестероса</button>';
    html += '<button class="btn" style="margin:4px 0;background:#3d2e20;border-color:#8a7a5a;" onclick="openCapitals()">🏙️ Столицы регионов</button>';
    html += '<button class="btn" style="margin:4px 0;background:#2a1a12;border-color:#4a2a20;" onclick="showKingsLanding()">👑 Королевская Гавань — Железный Трон</button>';
    html += '<button class="btn btn-secondary" style="margin-top:10px;" onclick="closeMenu()">Закрыть</button>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeMenu() {
    var modal = document.getElementById('modal-menu');
    if (modal) modal.classList.add('hide');
}

// ============================================================
// 2. СТОЛИЦЫ РЕГИОНОВ
// ============================================================

var CAPITALS = {
    north: {
        id: 'white_harbor',
        name: 'Белая Гавань',
        region: 'north',
        regionName: '❄️ Север',
        emoji: '🏙️',
        controller: null,
        description: 'Крупнейший порт Севера. Центр торговли с Эссосом.',
        income: 500
    },
    westlands: {
        id: 'lannisport',
        name: 'Ланниспорт',
        region: 'westlands',
        regionName: '🦁 Западные земли',
        emoji: '🏙️',
        controller: null,
        description: 'Третий по величине город Вестероса. Порт и золото.',
        income: 800
    },
    reach: {
        id: 'oldtown',
        name: 'Старомест',
        region: 'reach',
        regionName: '🌹 Простор',
        emoji: '🏙️',
        controller: null,
        description: 'Второй по величине город. Цитадель мейстеров и торговля.',
        income: 700
    },
    riverlands: {
        id: 'maidenpool',
        name: 'Девичье озеро',
        region: 'riverlands',
        regionName: '🐟 Речные земли',
        emoji: '🏙️',
        controller: null,
        description: 'Город на перекрёстке речных путей. Рынок и торговля.',
        income: 400
    },
    stormlands: {
        id: 'weeping_town',
        name: 'Скорбящий Городок',
        region: 'stormlands',
        regionName: '⛈️ Штормовые земли',
        emoji: '🏙️',
        controller: null,
        description: 'Портовый город на Дорнийском море. Торговля с югом.',
        income: 350
    },
    dorne: {
        id: 'sandy_shore',
        name: 'Песчаный Берег',
        region: 'dorne',
        regionName: '☀️ Дорн',
        emoji: '🏙️',
        controller: null,
        description: 'Портовый город на юге Дорна. Торговля с Эссосом.',
        income: 450
    },
    vale: {
        id: 'gulltown',
        name: 'Чаячий город',
        region: 'vale',
        regionName: '🦅 Долина',
        emoji: '🏙️',
        controller: null,
        description: 'Крупнейший порт Долины. Торговля с Севером и Эссосом.',
        income: 400
    },
    iron_islands: {
        id: 'lordsport',
        name: 'Лордпорт',
        region: 'iron_islands',
        regionName: '🐙 Железные острова',
        emoji: '🏙️',
        controller: null,
        description: 'Крупнейший порт Железных островов на Пайке.',
        income: 300
    }
};

var KINGS_LANDING = {
    id: 'kings_landing',
    name: 'Королевская Гавань',
    emoji: '👑',
    controller: null,
    description: 'Столица Семи Королевств. Железный Трон. Кто владеет Гаванью — тот правит Вестеросом.',
    income: 2000
};

function openCapitals() {
    var modal = document.getElementById('modal-houses');
    var content = document.getElementById('modal-houses-content');
    
    var menuModal = document.getElementById('modal-menu');
    if (menuModal) menuModal.classList.add('hide');
    
    var html = '<div class="modal-section"><h4>🏙️ СТОЛИЦЫ РЕГИОНОВ</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Захват столицы региона делает дом Великим. Все столицы нейтральны на старте.</p>';
    html += '</div>';
    
    for (var key in CAPITALS) {
        var capital = CAPITALS[key];
        var controllerHouse = null;
        
        if (capital.controller) {
            for (var id in HOUSES) {
                if (HOUSES[id].id === capital.controller) {
                    controllerHouse = HOUSES[id];
                    break;
                }
            }
        }
        
        html += '<div class="modal-section" style="border:1px solid #2a201a;border-radius:12px;padding:14px;margin:10px 0;background:#120e0b;">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
        html += '<div>';
        html += '<span style="font-size:20px;">' + capital.emoji + '</span> ';
        html += '<strong style="color:#c9b694;font-size:16px;">' + capital.name + '</strong>';
        html += '<br><span style="color:#6a5a48;font-size:12px;">' + capital.regionName + '</span>';
        html += '<br><span style="color:#6a5a48;font-size:12px;">' + capital.description + '</span>';
        html += '<br><span style="color:#6a5a48;font-size:12px;">💰 Налог: ' + capital.income + ' зол./день</span>';
        
        if (controllerHouse) {
            html += '<br><span style="color:#e74c3c;font-size:13px;">🏰 Контролирует: ' + controllerHouse.sigil + ' ' + controllerHouse.name + ' (Великий Дом)</span>';
        } else {
            html += '<br><span style="color:#7ac98a;font-size:13px;">⚔️ НЕЙТРАЛЬНА — можно захватить!</span>';
        }
        
        html += '</div>';
        html += '</div>';
        html += '</div>';
    }
    
    html += '<button class="btn btn-secondary" onclick="openHouses()" style="margin-top:4px;">🏘️ К списку домов</button>';
    html += '<button class="btn btn-secondary" onclick="closeHouses()" style="margin-top:4px;">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function showKingsLanding() {
    var modal = document.getElementById('modal-houses');
    var content = document.getElementById('modal-houses-content');
    
    var menuModal = document.getElementById('modal-menu');
    if (menuModal) menuModal.classList.add('hide');
    
    var controllerHouse = null;
    if (KINGS_LANDING.controller) {
        for (var id in HOUSES) {
            if (HOUSES[id].id === KINGS_LANDING.controller) {
                controllerHouse = HOUSES[id];
                break;
            }
        }
    }
    
    var html = '<div class="modal-section" style="border:2px solid #ffd700;border-radius:12px;padding:14px;background:#120e0b;">';
    html += '<div style="text-align:center;font-size:32px;margin-bottom:8px;">👑</div>';
    html += '<h3 style="color:#ffd700;text-align:center;font-size:20px;">КОРОЛЕВСКАЯ ГАВАНЬ</h3>';
    html += '<p style="color:#ffd700;text-align:center;font-size:14px;">Железный Трон</p>';
    html += '<p style="color:#6a5a48;text-align:center;font-size:12px;">' + KINGS_LANDING.description + '</p>';
    html += '<p style="color:#6a5a48;text-align:center;font-size:12px;">💰 Налог со всего королевства: ' + KINGS_LANDING.income + ' зол./день</p>';
    
    if (controllerHouse) {
        html += '<div style="text-align:center;margin-top:10px;">';
        html += '<span style="color:#ffd700;font-size:16px;">👑 ' + controllerHouse.sigil + ' ' + controllerHouse.name + '</span>';
        html += '<br><span style="color:#ffd700;font-size:13px;">ПРАВИТ СЕМЬЮ КОРОЛЕВСТВАМИ</span>';
        html += '</div>';
    } else {
        html += '<div style="text-align:center;margin-top:10px;">';
        html += '<span style="color:#7ac98a;font-size:16px;">⚔️ НЕЙТРАЛЬНА</span>';
        html += '<br><span style="color:#7ac98a;font-size:13px;">Железный Трон свободен!</span>';
        html += '</div>';
    }
    
    html += '</div>';
    
    html += '<button class="btn btn-secondary" onclick="openMainMenu()" style="margin-top:10px;">⬅️ Назад в меню</button>';
    html += '<button class="btn btn-secondary" onclick="closeHouses()">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

// ============================================================
// 3. ДОМА ВЕСТЕРОСА
// ============================================================

function openHouses() {
    var modal = document.getElementById('modal-houses');
    var content = document.getElementById('modal-houses-content');
    
    var menuModal = document.getElementById('modal-menu');
    if (menuModal) menuModal.classList.add('hide');
    
    if (typeof HOUSES === 'undefined') {
        var html = '<div class="modal-section"><h4>🏘️ ДОМА ВЕСТЕРОСА</h4>';
        html += '<p style="color:#c96a5a;">❌ Данные о домах не загружены.</p>';
        html += '<button class="btn btn-secondary" onclick="closeHouses()">Закрыть</button>';
        html += '</div>';
        content.innerHTML = html;
        modal.classList.remove('hide');
        return;
    }
    
    var regions = {
        'north': { label: '❄️ СЕВЕР', houses: [] },
        'westlands': { label: '🦁 ЗАПАДНЫЕ ЗЕМЛИ', houses: [] },
        'reach': { label: '🌹 ПРОСТОР', houses: [] },
        'riverlands': { label: '🐟 РЕЧНЫЕ ЗЕМЛИ', houses: [] },
        'stormlands': { label: '⛈️ ШТОРМОВЫЕ ЗЕМЛИ', houses: [] },
        'dorne': { label: '☀️ ДОРН', houses: [] },
        'vale': { label: '🦅 ДОЛИНА', houses: [] },
        'iron_islands': { label: '🐙 ЖЕЛЕЗНЫЕ ОСТРОВА', houses: [] }
    };
    
    for (var id in HOUSES) {
        var house = HOUSES[id];
        if (house.region && regions[house.region]) {
            regions[house.region].houses.push(house);
        }
    }
    
    // Определяем, кто владеет столицами и Королевской Гаванью
    var greatHouses = {};
    for (var key in CAPITALS) {
        if (CAPITALS[key].controller) {
            greatHouses[CAPITALS[key].controller] = 'great_house';
        }
    }
    var royalHouse = KINGS_LANDING.controller || null;
    
    var html = '<div class="modal-section"><h4>🏘️ ДОМА ВЕСТЕРОСА</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Все дома независимы. Иерархия строится через захват столиц.</p>';
    html += '</div>';
    
    for (var regionKey in regions) {
        var region = regions[regionKey];
        if (region.houses.length === 0) continue;
        
        region.houses.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });
        
        html += '<div class="modal-section" style="border-top:1px solid #2a201a;padding-top:10px;margin-top:10px;">';
        html += '<h4 style="color:#c9b694;">' + region.label + ' (' + region.houses.length + ')</h4>';
        
        region.houses.forEach(function(house) {
            var sigil = house.sigil || '🏰';
            var displayName = house.name;
            var style = '';
            
            // Проверяем, владеет ли дом Королевской Гаванью
            if (royalHouse === house.id) {
                style = 'color:#ffd700;font-weight:bold;';
                displayName = '👑 ' + displayName;
            }
            // Проверяем, владеет ли дом столицей региона
            else if (greatHouses[house.id]) {
                style = 'color:#e74c3c;font-weight:bold;';
                displayName = '🏰 ' + displayName;
            }
            
            html += '<div class="row" style="padding:4px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label" style="' + style + '">' + sigil + ' ' + displayName + '</span>';
            html += '<span class="value"><button class="btn btn-small" onclick="showHouseInfo(\'' + house.id + '\')">📜 Подробнее</button></span>';
            html += '</div>';
        });
        
        html += '</div>';
    }
    
    html += '<button class="btn" style="margin-top:8px;background:#3d2e20;border-color:#8a7a5a;" onclick="openCapitals()">🏙️ Столицы регионов</button>';
    html += '<button class="btn" style="margin-top:4px;background:#2a1a12;border-color:#4a2a20;" onclick="showKingsLanding()">👑 Королевская Гавань</button>';
    html += '<button class="btn btn-secondary" onclick="closeHouses()" style="margin-top:10px;">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeHouses() {
    var modal = document.getElementById('modal-houses');
    if (modal) modal.classList.add('hide');
}

// ============================================================
// 4. ИНФОРМАЦИЯ О ДОМЕ
// ============================================================

function showHouseInfo(houseId) {
    if (typeof HOUSES === 'undefined') {
        setMessage('❌ Данные о домах не загружены.');
        return;
    }
    
    var house = HOUSES[houseId];
    if (!house) {
        setMessage('❌ Дом не найден.');
        return;
    }
    
    var modal = document.getElementById('modal-houses');
    var content = document.getElementById('modal-houses-content');
    
    var regionNames = {
        'north': '❄️ Север',
        'westlands': '🦁 Западные земли',
        'reach': '🌹 Простор',
        'riverlands': '🐟 Речные земли',
        'stormlands': '⛈️ Штормовые земли',
        'dorne': '☀️ Дорн',
        'vale': '🦅 Долина',
        'iron_islands': '🐙 Железные острова'
    };
    
    // Определяем статус дома
    var isRoyal = KINGS_LANDING.controller === house.id;
    var isGreat = false;
    var capitalName = '';
    for (var key in CAPITALS) {
        if (CAPITALS[key].controller === house.id) {
            isGreat = true;
            capitalName = CAPITALS[key].name;
            break;
        }
    }
    
    var sigil = house.sigil || '🏰';
    var color = house.color || '#b8a890';
    
    if (isRoyal) color = '#ffd700';
    else if (isGreat) color = '#e74c3c';
    
    var html = '<div class="modal-section">';
    html += '<button class="btn btn-secondary" style="margin-bottom:10px;" onclick="openHouses()">⬅️ Назад к списку</button>';
    html += '</div>';
    
    html += '<div class="modal-section" style="border:2px solid ' + color + ';border-radius:12px;padding:14px;background:#120e0b;">';
    html += '<div style="font-size:24px;text-align:center;margin-bottom:6px;">' + sigil + '</div>';
    html += '<h3 style="color:' + color + ';text-align:center;font-size:20px;font-weight:400;">' + house.name + '</h3>';
    html += '<p style="color:#6a5a48;text-align:center;font-style:italic;font-size:14px;">' + (house.motto || '—') + '</p>';
    
    if (isRoyal) {
        html += '<p style="color:#ffd700;text-align:center;font-size:16px;font-weight:bold;">👑 КОРОЛЬ ВЕСТЕРОСА</p>';
    } else if (isGreat) {
        html += '<p style="color:#e74c3c;text-align:center;font-size:16px;font-weight:bold;">🏰 ВЕЛИКИЙ ДОМ</p>';
        html += '<p style="color:#6a5a48;text-align:center;font-size:12px;">Контролирует: ' + capitalName + '</p>';
    }
    
    html += '</div>';
    
    html += '<div class="modal-section">';
    html += '<div class="row"><span class="label">📍 Регион</span><span class="value">' + (regionNames[house.region] || house.region || '—') + '</span></div>';
    html += '<div class="row"><span class="label">🏰 Замок</span><span class="value">' + (house.castle || '—') + '</span></div>';
    html += '<div class="row"><span class="label">👑 Сюзерен</span><span class="value">' + (house.liege || 'Нет') + '</span></div>';
    html += '</div>';
    
    html += '<div class="modal-section"><h4>⚔️ АРМИЯ</h4>';
    if (house.army) {
        html += '<div class="row"><span class="label">🗡️ Пехота</span><span class="value">' + (house.army.infantry || 0) + '</span></div>';
        html += '<div class="row"><span class="label">🐴 Кавалерия</span><span class="value">' + (house.army.cavalry || 0) + '</span></div>';
        html += '<div class="row"><span class="label">⛵ Корабли</span><span class="value">' + (house.army.ships || 0) + '</span></div>';
    } else {
        html += '<p style="color:#6a5a48;">Нет данных</p>';
    }
    html += '</div>';
    
    html += '<div class="modal-section"><h4>💰 ЭКОНОМИКА</h4>';
    html += '<div class="row"><span class="label">💰 Казна</span><span class="value">' + (house.treasury || 0) + ' зол.</span></div>';
    html += '<div class="row"><span class="label">🤝 Верность</span><span class="value">' + (house.loyalty || 0) + '%</span></div>';
    html += '<div class="row"><span class="label">🌟 Репутация</span><span class="value">' + (house.reputation || 0) + '%</span></div>';
    html += '</div>';
    
    html += '<button class="btn btn-secondary" onclick="openHouses()" style="margin-top:10px;">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

// ============================================================
// 5. РЕГИСТРАЦИЯ
// ============================================================

window.openMainMenu = openMainMenu;
window.closeMenu = closeMenu;
window.openHouses = openHouses;
window.closeHouses = closeHouses;
window.showHouseInfo = showHouseInfo;
window.openCapitals = openCapitals;
window.showKingsLanding = showKingsLanding;

console.log('📋 Меню + Дома + Столицы загружены!');

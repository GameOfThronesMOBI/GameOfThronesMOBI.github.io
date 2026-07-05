// ============================================================
// js/game/04-menu.js — МЕНЮ, ДОМА
// ============================================================

// ============================================================
// 1. ГЛАВНОЕ МЕНЮ
// ============================================================

function openMainMenu() {
    var modal = document.getElementById('modal-menu');
    var content = document.getElementById('modal-menu-content');
    
    var html = '<div class="modal-section">';
    html += '<button class="btn" style="margin:4px 0;" onclick="openHouses()">🏘️ Дома Вестероса</button>';
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
// 2. ДОМА ВЕСТЕРОСА
// ============================================================

function openHouses() {
    var modal = document.getElementById('modal-houses');
    var content = document.getElementById('modal-houses-content');
    
    // Закрываем меню
    var menuModal = document.getElementById('modal-menu');
    if (menuModal) menuModal.classList.add('hide');
    
    if (typeof HOUSES === 'undefined') {
        var html = '<div class="modal-section"><h4>🏘️ ДОМА ВЕСТЕРОСА</h4>';
        html += '<p style="color:#c96a5a;">❌ Данные о домах не загружены.</p>';
        html += '<p style="color:#6a5a48;font-size:12px;">Убедитесь, что файл js/data/houses.js подключён.</p>';
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
    
    var html = '<div class="modal-section"><h4>🏘️ ДОМА ВЕСТЕРОСА</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;">Великие Дома и их вассалы. Нажмите на дом для подробной информации.</p>';
    html += '</div>';
    
    for (var regionKey in regions) {
        var region = regions[regionKey];
        if (region.houses.length === 0) continue;
        
        region.houses.sort(function(a, b) {
            if (a.type === 'great_house' && b.type !== 'great_house') return -1;
            if (b.type === 'great_house' && a.type !== 'great_house') return 1;
            return a.name.localeCompare(b.name);
        });
        
        html += '<div class="modal-section" style="border-top:1px solid #2a201a;padding-top:10px;margin-top:10px;">';
        html += '<h4 style="color:#c9b694;">' + region.label + ' (' + region.houses.length + ')</h4>';
        
        region.houses.forEach(function(house) {
            var isGreat = house.type === 'great_house';
            var style = isGreat ? 'color:#ffd700;' : '';
            var sigil = house.sigil || '🏰';
            html += '<div class="row" style="padding:4px 0; border-bottom:1px solid #1a1410;">';
            html += '<span class="label" style="' + style + '">' + sigil + ' ' + house.name + (isGreat ? ' 👑' : '') + '</span>';
            html += '<span class="value"><button class="btn btn-small" onclick="showHouseInfo(\'' + house.id + '\')">📜 Подробнее</button></span>';
            html += '</div>';
        });
        
        html += '</div>';
    }
    
    html += '<button class="btn btn-secondary" onclick="closeHouses()" style="margin-top:10px;">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeHouses() {
    var modal = document.getElementById('modal-houses');
    if (modal) modal.classList.add('hide');
}

// ============================================================
// 3. ИНФОРМАЦИЯ О ДОМЕ
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
    
    var typeLabels = {
        'great_house': '👑 Великий Дом',
        'vassal': '🛡️ Вассал'
    };
    
    var sigil = house.sigil || '🏰';
    var isGreat = house.type === 'great_house';
    var color = house.color || (isGreat ? '#ffd700' : '#b8a890');
    
    var html = '<div class="modal-section">';
    html += '<button class="btn btn-secondary" style="margin-bottom:10px;" onclick="openHouses()">⬅️ Назад к списку</button>';
    html += '</div>';
    
    html += '<div class="modal-section" style="border:1px solid ' + color + ';border-radius:12px;padding:14px;background:#120e0b;">';
    html += '<div style="font-size:24px;text-align:center;margin-bottom:6px;">' + sigil + '</div>';
    html += '<h3 style="color:' + color + ';text-align:center;font-size:20px;font-weight:400;">' + house.name + '</h3>';
    html += '<p style="color:#6a5a48;text-align:center;font-style:italic;font-size:14px;">' + (house.motto || '—') + '</p>';
    html += '<p style="color:#6a5a48;text-align:center;font-size:12px;">' + (typeLabels[house.type] || house.type) + '</p>';
    html += '</div>';
    
    html += '<div class="modal-section">';
    html += '<div class="row"><span class="label">📍 Регион</span><span class="value">' + (regionNames[house.region] || house.region || '—') + '</span></div>';
    html += '<div class="row"><span class="label">🏰 Замок</span><span class="value">' + (house.castleId || '—') + '</span></div>';
    html += '<div class="row"><span class="label">🏙️ Столица</span><span class="value">' + (house.capital || '—') + '</span></div>';
    html += '<div class="row"><span class="label">👑 Сюзерен</span><span class="value">' + (house.liege || '—') + '</span></div>';
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
// 4. РЕГИСТРАЦИЯ
// ============================================================

window.openMainMenu = openMainMenu;
window.closeMenu = closeMenu;
window.openHouses = openHouses;
window.closeHouses = closeHouses;
window.showHouseInfo = showHouseInfo;

console.log('📋 Меню загружено!');

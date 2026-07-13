// ============================================================
// movement.js — ПОЛНАЯ СИСТЕМА ПЕРЕМЕЩЕНИЙ + КОМПАС (РОЗА ВЕТРОВ)
// ============================================================

console.log('🧭 Система перемещений загружается...');

// ============================================================
// 1. ОТКРЫТЬ КОМПАС (РОЗА ВЕТРОВ)
// ============================================================

function openCompass() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var current = g.location.locationId || g.location.place;
    var transitions = window.KL_TRANSITIONS ? KL_TRANSITIONS[current] : null;
    if (!transitions) {
        setMessage('❌ Из этой локации нельзя никуда пойти.');
        return;
    }
    
    var loc = window.KL_AREAS ? KL_AREAS[current] : null;
    
    var ownerName = '';
    if (loc && loc.owner) {
        if (loc.owner === 'crown') {
            ownerName = '👑 Корона';
        } else if (window.HOUSES && HOUSES[loc.owner]) {
            ownerName = HOUSES[loc.owner].sigil + ' ' + HOUSES[loc.owner].name;
        } else if (window.users && users[loc.owner]) {
            ownerName = '👤 ' + users[loc.owner].name;
        } else {
            ownerName = loc.owner;
        }
    }
    
    var modal = document.getElementById('modal-compass');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-compass';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeCompass(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>🧭 КОМПАС</h3><button class="close-btn" onclick="closeCompass()">✕</button></div><div id="modal-compass-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-compass-content');
    
    var html = '<div class="modal-section"><h4>🧭 КОМПАС</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;text-align:center;">📍 ' + (loc ? loc.name : current);
    if (ownerName) html += ' | ' + ownerName;
    html += '</p>';
    html += '<p style="color:#6a5a48;font-size:12px;text-align:center;">Выберите направление:</p>';
    
    html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr 1fr 1fr;gap:6px;max-width:280px;margin:10px auto;">';
    
    var dirLabels = {
        'nw': '↖️ СЗ',
        'n': '⬆️ Север',
        'ne': '↗️ СВ',
        'w': '⬅️ Запад',
        'e': '➡️ Восток',
        'sw': '↙️ ЮЗ',
        's': '⬇️ Юг',
        'se': '↘️ ЮВ'
    };
    
    var grid = [
        ['nw', 'n', 'ne'],
        ['w', null, 'e'],
        ['sw', 's', 'se']
    ];
    
    for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 3; col++) {
            var dir = grid[row][col];
            
            if (dir === null) {
                html += '<div style="display:flex;align-items:center;justify-content:center;background:#1a1410;border:1px solid #3d3026;border-radius:50%;aspect-ratio:1;font-size:24px;">📍</div>';
                continue;
            }
            
            var next = transitions[dir];
            var label = dirLabels[dir] || dir;
            
            if (next) {
                var nextLoc = window.KL_AREAS ? KL_AREAS[next] : null;
                var nextName = nextLoc ? nextLoc.name : next;
                html += '<button class="btn btn-game" onclick="moveTo(\'' + dir + '\'); closeCompass();" style="padding:8px;font-size:13px;display:flex;flex-direction:column;align-items:center;justify-content:center;aspect-ratio:1;">' + label + '<br><span style="font-size:9px;color:#6a5a48;">' + nextName + '</span></button>';
            } else {
                html += '<div style="display:flex;align-items:center;justify-content:center;background:#120e0b;border:1px solid #1a1410;border-radius:8px;color:#3d3026;font-size:13px;aspect-ratio:1;">' + label + '</div>';
            }
        }
    }
    
    html += '</div></div>';
    html += '<button class="btn btn-secondary" onclick="closeCompass()" style="margin-top:10px;">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

// ============================================================
// 2. ЗАКРЫТЬ КОМПАС
// ============================================================

function closeCompass() {
    var modal = document.getElementById('modal-compass');
    if (modal) modal.classList.add('hide');
}

// ============================================================
// 3. ПЕРЕМЕЩЕНИЕ (moveTo)
// ============================================================

function moveTo(direction) {
    var g = users[currentUser].game;
    if (!g) return;
    
    var current = g.location.locationId || g.location.place;
    var transitions = window.KL_TRANSITIONS ? KL_TRANSITIONS[current] : null;
    if (!transitions) {
        setMessage('❌ Из этой локации нельзя никуда пойти.');
        return;
    }
    
    var next = transitions[direction];
    if (!next) {
        setMessage('❌ В этом направлении нет пути.');
        return;
    }
    
    var isLoc = false;
    if (window.KL_AREAS) {
        for (var id in KL_AREAS) {
            if (id === next) { isLoc = true; break; }
        }
    }
    
    if (!isLoc && next !== 'kl_crossroads' && !KL_TRANSITIONS[next]) {
        var regionMap = {
            'riverlands': 'Речные земли',
            'stormlands': 'Штормовые земли',
            'reach': 'Простор',
            'north': 'Север',
            'westlands': 'Западные земли',
            'vale': 'Долина',
            'dorne': 'Дорн',
            'iron_islands': 'Железные острова'
        };
        g.location.region = regionMap[next] || 'Королевские земли';
        g.location.place = next;
        g.location.locationId = next;
        setMessage('🚶 Вы перешли в ' + next);
        updateMenu();
        updateStory();
        updateActions();
        saveData();
        return;
    }
    
    g.location.place = next;
    g.location.locationId = next;
    setMessage('🚶 Вы пошли на ' + direction);
    updateMenu();
    updateStory();
    updateActions();
    saveData();
}

// ============================================================
// 4. РЕГИСТРАЦИЯ
// ============================================================

window.openCompass = openCompass;
window.closeCompass = closeCompass;
window.moveTo = moveTo;

console.log('✅ Система перемещений загружена!');

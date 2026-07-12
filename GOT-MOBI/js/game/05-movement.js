// ============================================================
// movement.js — ПОЛНАЯ СИСТЕМА ПЕРЕМЕЩЕНИЙ + КОМПАС (ФИКС)
// ============================================================

console.log('🧭 Система перемещений загружается...');

// ============================================================
// 1. ОТКРЫТЬ КОМПАС
// ============================================================

function openCompass() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    var place = g.location.place;
    
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
    html += '<p style="color:#6a5a48;font-size:12px;">📍 Текущая локация: <strong>' + (loc ? loc.name : current) + '</strong>';
    if (ownerName) {
        html += ' | ' + ownerName;
    }
    html += '</p>';
    html += '<p style="color:#6a5a48;font-size:12px;">Выберите направление:</p>';
    html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:10px;">';
    
    var dirLabels = {
        'nw': '↖️ СЗ',
        'n': '⬆️ С',
        'ne': '↗️ СВ',
        'w': '⬅️ З',
        'e': '➡️ В',
        'sw': '↙️ ЮЗ',
        's': '⬇️ Ю',
        'se': '↘️ ЮВ'
    };
    
    var directions = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
    
    for (var i = 0; i < directions.length; i++) {
        var dir = directions[i];
        var next = transitions[dir];
        var label = dirLabels[dir] || dir;
        
        if (next) {
            var nextLoc = window.KL_AREAS ? KL_AREAS[next] : null;
            var nextName = nextLoc ? nextLoc.name : next;
            var nextOwner = '';
            if (nextLoc && nextLoc.owner) {
                if (nextLoc.owner === 'crown') {
                    nextOwner = '👑';
                } else if (window.HOUSES && HOUSES[nextLoc.owner]) {
                    nextOwner = HOUSES[nextLoc.owner].sigil;
                }
            }
            html += '<button class="btn btn-game" onclick="moveTo(\'' + dir + '\'); closeCompass();" style="padding:10px;font-size:14px;">' + label + '<br><span style="font-size:10px;color:#6a5a48;">' + nextOwner + ' ' + nextName + '</span></button>';
        } else {
            html += '<div style="padding:10px;background:#120e0b;border:1px solid #2a201a;border-radius:8px;text-align:center;color:#3d3026;font-size:14px;">' + label + '<br><span style="font-size:10px;">🚫</span></div>';
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
// 3. ПЕРЕМЕЩЕНИЕ (moveTo) — ИСПРАВЛЕНО
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

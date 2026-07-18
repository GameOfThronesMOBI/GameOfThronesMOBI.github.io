// ============================================================
// movement.js — КОМПАС С ЭМОДЗИ, ДОМАМИ И КООРДИНАТАМИ (ФИНАЛ)
// ============================================================

console.log('🧭 Система перемещений загружается...');

function getLocationEmoji(loc, nextId) {
    if (!loc) return '📍';
    
    // 👑 Королевская Гавань
    if (nextId === 'kl_0_0') return '👑';
    
    // 🏘️ Деревня (в приоритете)
    if (loc.places && loc.places.some(function(p) { return p === 'Деревня'; })) return '🏘️';
    
    // ⛏️ Шахта
    if (loc.places && loc.places.some(function(p) { return p === 'Шахта'; })) return '⛏️';
    
    // 🏰 Замок
    if (loc.type === 'castle') return '🏰';
    
    // 🌲 Лес
    if (loc.type === 'forest') return '🌲';
    
    // 🛤️ Дорога
    if (loc.type === 'road') return '🛤️';
    
    // ⛰️ Горы
    if (loc.type === 'mountain') return '⛰️';
    
    // 🌊 Берег
    if (loc.type === 'coast') return '🌊';
    
    // 🌊 Река
    if (loc.type === 'river') return '🌊';
    
    // 🌾 Равнина
    if (loc.type === 'plain') return '🌾';
    
    // 🌇 Город
    if (loc.type === 'city') return '🌇';
    
    // 🌫️ Транзит — не показываем
    if (loc.type === 'transit') return '';
    
    return '📍';
}

function openCompass() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var current = g.location.locationId || g.location.place;
    var transitions = window.WORLD_TRANSITIONS ? WORLD_TRANSITIONS[current] : null;
    if (!transitions) {
        setMessage('❌ Из этой локации нельзя никуда пойти.');
        return;
    }
    
    var loc = window.WORLD_AREAS ? WORLD_AREAS[current] : null;
    
    var ownerName = '';
    if (loc && loc.owner) {
        if (loc.owner === 'crown') {
            ownerName = '👑 Корона';
        } else if (loc.owner === 'none') {
            ownerName = '';
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
    html += '<p style="color:#6a5a48;font-size:11px;text-align:center;">📍 ' + (loc ? loc.name : current);
    if (ownerName) html += ' | ' + ownerName;
    html += '</p>';
    
    html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr 1fr 1fr;gap:4px;max-width:300px;margin:10px auto;">';
    
    var dirLabels = {
        'nw': '↖️', 'n': '⬆️', 'ne': '↗️',
        'w': '⬅️', 'e': '➡️',
        'sw': '↙️', 's': '⬇️', 'se': '↘️'
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
                var centerEmoji = getLocationEmoji(loc, current);
                if (centerEmoji === '') centerEmoji = '📍';
                html += '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;background:#1a1410;border:1px solid #3d3026;border-radius:12px;aspect-ratio:1;font-size:20px;padding:2px;">' + centerEmoji + '<br><span style="font-size:7px;color:#6a5a48;">' + (loc ? loc.x + ',' + loc.y : '') + '</span></div>';
                continue;
            }
            
            var next = transitions[dir];
            
            if (next) {
                var nextLoc = WORLD_AREAS ? WORLD_AREAS[next] : null;
                var emoji = nextLoc ? getLocationEmoji(nextLoc, next) : '📍';
                var nextName = nextLoc ? nextLoc.name : next;
                
                var houseInfo = '';
                if (nextLoc && nextLoc.owner && nextLoc.owner !== 'crown' && nextLoc.owner !== 'none') {
                    var house = (typeof HOUSES !== 'undefined' && HOUSES[nextLoc.owner]) ? HOUSES[nextLoc.owner] : null;
                    if (house) {
                        houseInfo = '<br><span style="font-size:7px;color:#ffd700;">' + house.sigil + ' ' + house.name + '</span>';
                    }
                }
                
                var coords = nextLoc ? nextLoc.x + ',' + nextLoc.y : '';
                
                html += '<button class="btn btn-game" onclick="moveTo(\'' + dir + '\'); closeCompass();" style="padding:4px;font-size:9px;display:flex;flex-direction:column;align-items:center;justify-content:center;aspect-ratio:1;line-height:1.1;">';
                html += '<span style="font-size:14px;">' + dirLabels[dir] + '</span>';
                if (emoji) html += '<span style="font-size:14px;">' + emoji + '</span>';
                html += '<span style="font-size:8px;color:#c9b694;">' + nextName + '</span>';
                html += houseInfo;
                html += '<span style="font-size:6px;color:#6a5a48;">' + coords + '</span>';
                html += '</button>';
            } else {
                html += '<div style="display:flex;align-items:center;justify-content:center;background:#120e0b;border:1px solid #1a1410;border-radius:8px;color:#3d3026;font-size:16px;aspect-ratio:1;">' + dirLabels[dir] + '</div>';
            }
        }
    }
    
    html += '</div></div>';
    html += '<button class="btn btn-secondary" onclick="closeCompass()" style="margin-top:10px;">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeCompass() {
    var modal = document.getElementById('modal-compass');
    if (modal) modal.classList.add('hide');
}

function moveTo(direction) {
    var g = users[currentUser].game;
    if (!g) return;
    
    var current = g.location.locationId || g.location.place;
    var transitions = window.WORLD_TRANSITIONS ? WORLD_TRANSITIONS[current] : null;
    if (!transitions) {
        setMessage('❌ Из этой локации нельзя никуда пойти.');
        return;
    }
    
    var next = transitions[direction];
    if (!next) {
        setMessage('❌ В этом направлении нет пути.');
        return;
    }
    
    var nextLoc = WORLD_AREAS ? WORLD_AREAS[next] : null;
    var nextName = nextLoc ? nextLoc.name : next;
    
    g.location.place = next;
    g.location.locationId = next;
    setMessage('🚶 Вы перешли в ' + nextName);
    updateMenu();
    updateStory();
    updateActions();
    saveData();
}

window.openCompass = openCompass;
window.closeCompass = closeCompass;
window.moveTo = moveTo;

console.log('✅ Система перемещений загружена!');

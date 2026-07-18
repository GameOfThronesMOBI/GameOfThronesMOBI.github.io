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
    
    var hasAny = false;
    
    for (var d in dirLabels) {
        var targetId = transitions[d];
        if (targetId) {
            var targetLoc = KL_AREAS[targetId];
            // Если цель — транзитная зона, ищем следующую за ней в том же направлении
            if (targetLoc && targetLoc.type === 'transit') {
                var nextTransitions = KL_TRANSITIONS[targetId];
                if (nextTransitions && nextTransitions[d]) {
                    targetId = nextTransitions[d];
                    targetLoc = KL_AREAS[targetId];
                }
            }
            
            if (targetLoc && targetLoc.type === 'transit') {
                // Если дальше тоже транзитная — пропускаем и её
                var nextTransitions2 = KL_TRANSITIONS[targetId];
                if (nextTransitions2 && nextTransitions2[d]) {
                    targetId = nextTransitions2[d];
                    targetLoc = KL_AREAS[targetId];
                }
            }
            
            // Если после всех пропусков цель всё ещё транзитная или не найдена — пропускаем
            if (!targetLoc || targetLoc.type === 'transit') continue;
            
            hasAny = true;
            var nextName = targetLoc ? targetLoc.name : targetId;
            html += '<button class="btn btn-game" onclick="moveToDirection(\'' + d + '\'); closeCompass();" style="padding:12px;font-size:14px;margin:4px 0;">' + dirLabels[d] + ' — ' + nextName + '</button>';
        }
    }
    
    if (!hasAny) {
        html += '<p style="color:#6a5a48;text-align:center;">Нет доступных направлений.</p>';
    }
    
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
// 3. ПЕРЕМЕЩЕНИЕ С ПРОПУСКОМ ТРАНЗИТНЫХ ЗОН
// ============================================================

function moveToDirection(direction) {
    var g = users[currentUser].game;
    if (!g) return;
    
    var current = g.location.locationId || g.location.place;
    var transitions = window.KL_TRANSITIONS ? KL_TRANSITIONS[current] : null;
    if (!transitions) {
        setMessage('❌ Из этой локации нельзя никуда пойти.');
        return;
    }
    
    var targetId = transitions[direction];
    if (!targetId) {
        setMessage('❌ В этом направлении нет пути.');
        return;
    }
    
    // Проходим транзитные зоны автоматически
    var steps = 0;
    var maxSteps = 3; // Максимум 3 шага (кольца 2, 3, 4)
    
    while (targetId && steps < maxSteps) {
        var targetLoc = KL_AREAS[targetId];
        if (targetLoc && targetLoc.type === 'transit') {
            var nextTransitions = KL_TRANSITIONS[targetId];
            if (nextTransitions && nextTransitions[direction]) {
                targetId = nextTransitions[direction];
                steps++;
            } else {
                break;
            }
        } else {
            break;
        }
    }
    
    var finalLoc = KL_AREAS[targetId];
    var finalName = finalLoc ? finalLoc.name : targetId;
    
    g.location.place = targetId;
    g.location.locationId = targetId;
    
    if (steps > 0) {
        setMessage('🚶 Вы прошли ' + (steps + 1) + ' зоны и достигли ' + finalName);
    } else {
        setMessage('🚶 Вы перешли в ' + finalName);
    }
    
    updateMenu();
    updateStory();
    updateActions();
    saveData();
}

// ============================================================
// 4. ОБЫЧНОЕ ПЕРЕМЕЩЕНИЕ (moveTo) — ОСТАВЛЯЕМ ДЛЯ СОВМЕСТИМОСТИ
// ============================================================

function moveTo(direction) {
    moveToDirection(direction);
}

// ============================================================
// 5. РЕГИСТРАЦИЯ
// ============================================================

window.openCompass = openCompass;
window.closeCompass = closeCompass;
window.moveTo = moveTo;
window.moveToDirection = moveToDirection;

console.log('✅ Система перемещений загружена!');

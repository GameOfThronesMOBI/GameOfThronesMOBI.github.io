// ============================================================
// movement.js — КОМПАС (ГЛОБАЛЬНЫЙ, WORLD_*) ФИНАЛ + КАРТА МИРА
// ============================================================

console.log('🧭 Система перемещений загружается...');

var _showOwners = false;

function getLocationEmoji(loc, nextId) {
    if (!loc) return '📍';
    if (nextId === 'kl_0_0') return '👑';
    if (loc.places && loc.places.some(function(p) { return p === 'Лесосека'; })) return '🪓';
    if (loc.places && loc.places.some(function(p) { return p === 'Шахта'; })) return '⛏️';
    if (loc.places && loc.places.some(function(p) { return p === 'Деревня'; })) return '🏘️';
    if (loc.type === 'castle') return '🏰';
    if (loc.type === 'forest') return '🌲';
    if (loc.type === 'road') return '🛤️';
    if (loc.type === 'mountain') return '⛰️';
    if (loc.type === 'coast') {
        if (loc.resourceType === 'shallows') return '🌊';
        return '🏖️';
    }
    if (loc.type === 'river') return '🏞️';
    if (loc.type === 'plain') return '🌾';
    if (loc.type === 'city') return '🌇';
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
    
    // Кнопка МИР
    html += '<div style="text-align:center;margin-bottom:8px;">';
    html += '<button class="btn btn-game" onclick="openWorldMap(); closeCompass();" style="display:inline-block;width:auto;padding:6px 16px;">🌍 Мир</button>';
    html += '</div>';
    
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
    g.location.parentZone = null;
    setMessage('🚶 Вы перешли в ' + nextName);
    updateMenu();
    updateStory();
    updateActions();
    saveData();
}

// ============================================================
// ГЛОБАЛЬНАЯ КАРТА МИРА
// ============================================================

window.openWorldMap = function() {
    var g = users[currentUser].game;
    var currentId = g.location.parentZone || g.location.locationId || g.location.place;
    var currentLoc = WORLD_AREAS[currentId];
    if (!currentLoc) { setMessage('📍 Вы не на внешней локации.'); return; }
    
    var allZones = [];
    var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    for (var id in WORLD_AREAS) {
        var z = WORLD_AREAS[id];
        allZones.push(z);
        if (z.x < minX) minX = z.x;
        if (z.x > maxX) maxX = z.x;
        if (z.y < minY) minY = z.y;
        if (z.y > maxY) maxY = z.y;
    }
    
    if (allZones.length === 0) { setMessage('❌ Мир пуст.'); return; }
    
    var cols = maxX - minX + 1;
    var rows = maxY - minY + 1;
    var cellSize = Math.max(14, Math.min(30, Math.floor(460 / Math.max(cols, rows))));
    
    var modal = document.getElementById('modal-world-map');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-world-map';
        overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeWorldMap(); };
        overlay.innerHTML = '<div class="modal-box" style="max-width:100%;width:95vw;"><div class="modal-header"><h3>🌍 МИР</h3><button class="close-btn" onclick="closeWorldMap()">✕</button></div><div id="modal-world-map-content"></div></div>';
        document.body.appendChild(overlay);
        modal = overlay;
    }
    
    var content = document.getElementById('modal-world-map-content');
    
    var typeColors = {
        'road': '#8B7355', 'forest': '#2d5016', 'plain': '#7a9a3a', 'mountain': '#6b6b6b',
        'river': '#2980b9', 'coast': '#d4b896', 'sea': '#0d3b5c', 'shallows': '#1a5276',
        'crossroads': '#8B7355', 'castle': '#4a3728', 'castle_gate': '#4a3728',
        'village': '#6b8a3a', 'mine': '#3d3d3d', 'swamp': '#3d5020', 'wall': '#3d3d3d',
        'training': '#5a4738', 'barracks': '#5a4738', 'forge': '#5a4738', 'armory': '#5a4738',
        'library': '#5a4738', 'septa': '#5a4738', 'garden': '#3a6b3a', 'kitchen': '#5a4738',
        'hall': '#5a4738', 'chambers': '#5a4738', 'dungeon': '#1a1a1a', 'crypt': '#1a1a1a',
        'hideout': '#1a1a1a', 'balcony': '#5a4738', 'cellar': '#3d3d3d', 'stables': '#5a4738',
        'arena': '#8B7355', 'field': '#7a9a3a', 'camp': '#6b6b3a', 'bandit_camp': '#5a3a2a',
        'tower': '#6b6b6b', 'lighthouse': '#6b6b6b', 'bridge': '#8B7355', 'docks': '#8B7355',
        'harbor': '#1a6b8a', 'trading_post': '#8B7355', 'ruins': '#5a5a4a', 'cave': '#3d3d3d',
        'nest': '#5a3a2a', 'rock': '#6b6b6b', 'reef': '#1a6b8a', 'island': '#3a6b3a',
        'wreck': '#5a4a3a', 'abyss': '#0a1a2a', 'maelstrom': '#0d3b5c', 'pirate_island': '#3a5a2a',
        'cape': '#6b6b6b', 'bay': '#1a6b8a', 'hunting': '#4a6b2a', 'logging_camp': '#5a4a2a',
        'farm': '#8a9a3a', 'border': '#4a3728'
    };
    
    var lookup = {};
    for (var i = 0; i < allZones.length; i++) {
        var z = allZones[i];
        lookup[z.x + ',' + z.y] = z;
    }
    
    var areas = {};
    for (var i = 0; i < allZones.length; i++) {
        var z = allZones[i];
        if (!areas[z.area]) areas[z.area] = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
        if (z.x < areas[z.area].minX) areas[z.area].minX = z.x;
        if (z.x > areas[z.area].maxX) areas[z.area].maxX = z.x;
        if (z.y < areas[z.area].minY) areas[z.area].minY = z.y;
        if (z.y > areas[z.area].maxY) areas[z.area].maxY = z.y;
    }
    
    function getCastleInfo(zone) {
        if (!zone || !zone.owner) return null;
        if (zone.owner === 'crown') return { castle: 'Красный замок', house: 'Баратеоны', sigil: '🦌' };
        if (window.HOUSES && HOUSES[zone.owner]) {
            var house = HOUSES[zone.owner];
            return { castle: house.castle, house: house.name, sigil: house.sigil };
        }
        return null;
    }
    
    var html = '<div class="modal-section">';
    html += '<h4>🌍 МИР ВЕСТЕРОСА</h4>';
    html += '<p style="color:#6a5a48;font-size:12px;text-align:center;">';
    html += '⭐ Вы | 👑 Столица | 🏰 Замок | 🏘️ Деревня | ⛏️ Шахта | 🪓 Лесосека | 🏚️ Руины';
    html += '</p>';
    html += '<p style="color:#6a5a48;font-size:11px;text-align:center;">Всего зон: ' + allZones.length + ' | Областей: ' + Object.keys(areas).length + '</p>';
    
    html += '<div style="text-align:center;margin:6px 0;">';
    html += '<button class="btn btn-small" onclick="toggleOwnerColors()" id="btn-toggle-owners" style="font-size:11px;">🎨 Показать владения</button>';
    html += '</div>';
    html += '</div>';
    
    html += '<div class="modal-section" style="max-height:120px;overflow-y:auto;">';
    html += '<p style="color:#6a5a48;font-size:11px;">📋 ОБЛАСТИ:</p>';
    for (var a in areas) {
        var aa = areas[a];
        var areaCastle = '';
        for (var i = 0; i < allZones.length; i++) {
            if (allZones[i].area === a && (allZones[i].type === 'castle' || allZones[i].type === 'castle_gate')) {
                var ci = getCastleInfo(allZones[i]);
                if (ci) areaCastle = ' 🏰 ' + ci.castle + ' ' + ci.sigil + ' ' + ci.house;
                break;
            }
        }
        if (!areaCastle && a === 'Королевская Гавань') {
            areaCastle = ' 🏰 Красный замок 🦌 Баратеоны';
        }
        html += '<span style="display:inline-block;margin:2px 6px;font-size:11px;color:#b8a890;">📍 ' + a + ' (' + (aa.maxX-aa.minX+1) + '×' + (aa.maxY-aa.minY+1) + ')' + areaCastle + '</span>';
    }
    html += '</div>';
    
    // Контейнер карты с абсолютным позиционированием
    var mapWidth = cols * cellSize;
    var mapHeight = rows * cellSize;
    var padding = Math.floor(cellSize * 1.5);
    
    html += '<div style="overflow:auto;max-width:100%;max-height:60vh;margin-top:8px;">';
    html += '<div style="position:relative;width:' + mapWidth + 'px;height:' + (mapHeight + padding*2) + 'px;min-width:' + mapWidth + 'px;background:#0a0806;border-radius:8px;">';
    
    for (var y = minY; y <= maxY; y++) {
        for (var x = minX; x <= maxX; x++) {
            var zone = lookup[x + ',' + y];
            var bg = '#0a0806';
            var emoji = '';
            var isCurrent = false;
            var castleInfo = zone ? getCastleInfo(zone) : null;
            
            if (zone) {
                var colorKey = zone.type;
                if (zone.type === 'coast' && zone.resourceType === 'shallows') {
                    colorKey = 'shallows';
                }
                bg = typeColors[colorKey] || '#3d3026';
                
                if (_showOwners && zone.owner) {
                    if (zone.owner === 'crown') {
                        bg = '#ffd700';
                    } else if (window.HOUSES && HOUSES[zone.owner] && HOUSES[zone.owner].color) {
                        bg = HOUSES[zone.owner].color;
                    } else if (window.users && users[zone.owner]) {
                        bg = '#8a7a5a';
                    }
                }
                
                var ownerEmoji = '';
                if (zone.owner) {
                    if (zone.owner === 'crown') {
                        ownerEmoji = '👑';
                    } else if (window.HOUSES && HOUSES[zone.owner]) {
                        ownerEmoji = HOUSES[zone.owner].sigil;
                    } else if (window.users && users[zone.owner]) {
                        ownerEmoji = '👤';
                    }
                }
                
                var isAreaCenter = (zone.zoneNumber === 0 || (zone.places && zone.places.indexOf('Столб с указателями') !== -1));
                
                if (zone.type === 'crossroads' && zone.actions && zone.actions.some(function(a) { return a.id === 'enter_city'; })) {
                    emoji = '👑';
                } else if (zone.type === 'castle' || zone.type === 'castle_gate') {
                    emoji = '🏰';
                } else if (zone.type === 'village') {
                    emoji = '🏘️';
                } else if (zone.places && zone.places.indexOf('Деревня') !== -1) {
                    emoji = '🏘️';
                } else if (zone.places && zone.places.indexOf('Шахта') !== -1) {
                    emoji = '⛏️';
                } else if (zone.places && zone.places.indexOf('Лесосека') !== -1) {
                    emoji = '🪓';
                } else if (zone.type === 'ruins') {
                    emoji = '🏚️';
                } else if (isAreaCenter && ownerEmoji && !_showOwners) {
                    emoji = ownerEmoji;
                } else if (_showOwners && ownerEmoji) {
                    emoji = ownerEmoji;
                }
                
                if (zone.id === currentId) isCurrent = true;
            }
            
            // Текст замка/города
            var subText = '';
            var subText2 = '';
            if (zone) {
                if (zone.type === 'crossroads' && zone.actions && zone.actions.some(function(a) { return a.id === 'enter_city'; })) {
                    subText = zone.area;
                } else if ((zone.type === 'castle' || zone.type === 'castle_gate') && castleInfo) {
                    subText = castleInfo.castle;
                }
                if (castleInfo && (subText || zone.type === 'crossroads')) {
                    subText2 = castleInfo.sigil + ' ' + castleInfo.house;
                }
            }
            
            var fontSize = Math.max(10, Math.floor(cellSize * 0.45));
            var fontSizeSmall = Math.max(9, Math.floor(cellSize * 0.35));
            var emojiSize = Math.max(12, Math.floor(cellSize * 0.55));
            
            var left = (x - minX) * cellSize + 1;
            var top = (y - minY) * cellSize + padding + 1;
            
            html += '<div style="';
            html += 'position:absolute;';
            html += 'left:' + left + 'px;top:' + top + 'px;';
            html += 'width:' + (cellSize-2) + 'px;height:' + (cellSize-2) + 'px;';
            html += 'background:' + bg + ';';
            html += 'border-radius:2px;';
            html += 'overflow:visible;';
            html += 'display:flex;align-items:center;justify-content:center;';
            if (isCurrent) html += 'box-shadow:inset 0 0 0 2px #ffd700;';
            html += '">';
            
            html += '<span style="font-size:' + emojiSize + 'px;line-height:1;">';
            if (isCurrent) {
                html += '⭐';
            } else if (emoji) {
                html += emoji;
            }
            html += '</span>';
            
            html += '</div>';
            
            // Текст замка/города — абсолютно, поверх клетки
            if (subText || subText2) {
                var labelTop = top + cellSize + 2;
                html += '<div style="position:absolute;left:' + (left + cellSize/2) + 'px;top:' + labelTop + 'px;transform:translateX(-50%);text-align:center;z-index:100;pointer-events:none;">';
                if (subText) {
                    html += '<div style="font-size:' + fontSize + 'px;font-weight:bold;color:#ffd700;padding:1px 4px;white-space:nowrap;margin-bottom:1px;opacity:0.7;">' + subText + '</div>';
                }
                if (subText2) {
                    html += '<div style="font-size:' + fontSizeSmall + 'px;color:#ccc;padding:1px 3px;white-space:nowrap;opacity:0.7;">' + subText2 + '</div>';
                }
                html += '</div>';
            }
        }
    }
    
    html += '</div></div>';
    
    html += '<div class="modal-section" style="margin-top:12px;">';
    html += '<p style="color:#6a5a48;font-size:12px;">📍 Вы: ' + currentLoc.name + ' [' + currentLoc.x + ',' + currentLoc.y + ']</p>';
    html += '</div>';
    
    html += '<button class="btn btn-secondary" onclick="closeWorldMap()" style="margin-top:8px;">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
};

window.closeWorldMap = function() {
    var modal = document.getElementById('modal-world-map');
    if (modal) modal.classList.add('hide');
};

window.toggleOwnerColors = function() {
    _showOwners = !_showOwners;
    var btn = document.getElementById('btn-toggle-owners');
    if (btn) btn.textContent = _showOwners ? '🎨 Скрыть владения' : '🎨 Показать владения';
    openWorldMap();
};

window.openCompass = openCompass;
window.closeCompass = closeCompass;
window.moveTo = moveTo;

console.log('✅ Система перемещений + Карта мира загружены!');

// ============================================================
// movement.js — КОМПАС + КАРТА МИРА + АРМИЯ + АНИМАЦИЯ + ОТРЯДЫ + СБОР
// ПОЛНАЯ ВЕРСИЯ
// ============================================================

console.log('🧭 Система перемещений загружается...');

var _showOwners = false;
var _showCoords = false;
var _showLevels = false;
var _showArmies = true;

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

// ============================================================
// КОМПАС
// ============================================================

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
                
                var isWater = false;
                if (nextLoc) {
                    isWater = (nextLoc.type === 'river' || nextLoc.type === 'sea' || nextLoc.type === 'shallows' ||
                               nextLoc.type === 'abyss' || nextLoc.type === 'maelstrom' || nextLoc.type === 'bay' ||
                               nextLoc.type === 'reef' || (nextLoc.type === 'coast' && nextLoc.resourceType === 'shallows'));
                }
                
                html += '<button class="btn btn-game" onclick="moveTo(\'' + dir + '\'); closeCompass();" style="padding:4px;font-size:9px;display:flex;flex-direction:column;align-items:center;justify-content:center;aspect-ratio:1;line-height:1.1;' + (isWater ? 'opacity:0.5;' : '') + '">';
                html += '<span style="font-size:14px;">' + dirLabels[dir] + '</span>';
                if (emoji) html += '<span style="font-size:14px;">' + emoji + '</span>';
                html += '<span style="font-size:8px;color:' + (isWater ? '#c96a5a' : '#c9b694') + ';">' + nextName + '</span>';
                if (isWater) html += '<span style="font-size:6px;color:#c96a5a;">⛵ корабль</span>';
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
    
    if (nextLoc) {
        var isWater = (nextLoc.type === 'river' || nextLoc.type === 'sea' || nextLoc.type === 'shallows' ||
                       nextLoc.type === 'abyss' || nextLoc.type === 'maelstrom' || nextLoc.type === 'bay' ||
                       nextLoc.type === 'reef' || (nextLoc.type === 'coast' && nextLoc.resourceType === 'shallows'));
        if (isWater) {
            setMessage('⛵ У вас нет корабля, чтобы ходить по воде.');
            return;
        }
    }
    
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
    
    var houseId = g.house;
    var mySquad = window.getMySquad ? window.getMySquad() : null;
    var myRank = g.houseRank;
    var isHighCommand = myRank && ['lord','heir','war_master'].indexOf(myRank) !== -1;
    
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
        if (!zone) return null;
        if (zone.type === 'crossroads' && zone.actions && zone.actions.some(function(a) { return a.id === 'enter_city'; })) {
            var owner = zone.owner;
            if (owner === 'crown') {
                return { castle: 'Красный замок', house: 'Корона', sigil: '👑', throne: 'Железный Трон' };
            } else if (owner && window.HOUSES && HOUSES[owner]) {
                var house = HOUSES[owner];
                return { castle: 'Красный замок', house: house.name, sigil: house.sigil, throne: 'Железный Трон' };
            } else {
                return { castle: 'Красный замок', house: 'Null', sigil: '❓', throne: 'Железный Трон' };
            }
        }
        if (zone.type === 'castle' || zone.type === 'castle_gate') {
            var owner = zone.owner;
            if (owner && owner !== 'crown' && window.HOUSES && HOUSES[owner]) {
                var house = HOUSES[owner];
                return { castle: house.castle || 'Замок', house: house.name, sigil: house.sigil };
            } else if (owner === 'crown') {
                return { castle: 'Королевский замок', house: 'Корона', sigil: '👑' };
            } else {
                return { castle: 'Замок', house: 'Null', sigil: '❓' };
            }
        }
        return null;
    }
    
    // Сбор информации о войсках по зонам
    var troopsByZone = {};
    if (window._castleGarrisons && _showArmies) {
        // Свои войска
        if (houseId) {
            var ownGarrison = window._castleGarrisons[houseId];
            if (ownGarrison) {
                ['infantry','cavalry','siege'].forEach(function(cat) {
                    if (ownGarrison[cat]) {
                        ownGarrison[cat].forEach(function(u) {
                            var loc = u.location || 'castle';
                            if (!troopsByZone[loc]) troopsByZone[loc] = {};
                            if (!troopsByZone[loc]._own) troopsByZone[loc]._own = { count: 0, squads: {} };
                            troopsByZone[loc]._own.count++;
                            if (u.squadId) {
                                if (!troopsByZone[loc]._own.squads[u.squadId]) troopsByZone[loc]._own.squads[u.squadId] = 0;
                                troopsByZone[loc]._own.squads[u.squadId]++;
                            }
                        });
                    }
                });
            }
        }
        
        // Вражеские войска
        for (var hid in window._castleGarrisons) {
            if (hid === houseId) continue;
            if (HOUSES[hid] && houseId && HOUSES[hid].liege === houseId) continue;
            var garr = window._castleGarrisons[hid];
            ['infantry','cavalry','siege'].forEach(function(cat) {
                if (garr[cat]) {
                    garr[cat].forEach(function(u) {
                        var loc = u.location || 'castle';
                        if (!troopsByZone[loc]) troopsByZone[loc] = {};
                        if (!troopsByZone[loc]._enemy) troopsByZone[loc]._enemy = 0;
                        troopsByZone[loc]._enemy++;
                    });
                }
            });
        }
        
        // Войска других домов
        if (houseId) {
            var squads = window.getSquads(houseId);
            for (var cmdName in squads) {
                var squad = squads[cmdName];
                var loc = squad.location || 'castle';
                if (!troopsByZone[loc]) troopsByZone[loc] = {};
                if (!troopsByZone[loc]._squads) troopsByZone[loc]._squads = {};
                if (!troopsByZone[loc]._squads[cmdName]) troopsByZone[loc]._squads[cmdName] = { count: 0, isMine: false };
                
                if (mySquad && mySquad.commanderName === cmdName) {
                    troopsByZone[loc]._squads[cmdName].isMine = true;
                }
            }
        }
    }
    
    var ownerGroups = [];
    if (_showOwners) {
        var visited = {};
        for (var i = 0; i < allZones.length; i++) {
            var z = allZones[i];
            var key = z.x + ',' + z.y;
            if (visited[key]) continue;
            if (!z.owner || z.owner === 'none') continue;
            
            var group = { owner: z.owner, zones: [], minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
            var queue = [z];
            visited[key] = true;
            
            while (queue.length > 0) {
                var cz = queue.shift();
                group.zones.push(cz);
                if (cz.x < group.minX) group.minX = cz.x;
                if (cz.x > group.maxX) group.maxX = cz.x;
                if (cz.y < group.minY) group.minY = cz.y;
                if (cz.y > group.maxY) group.maxY = cz.y;
                
                for (var d in {n:[0,-1],s:[0,1],w:[-1,0],e:[1,0]}) {
                    var nx = cz.x + {n:[0,-1],s:[0,1],w:[-1,0],e:[1,0]}[d][0];
                    var ny = cz.y + {n:[0,-1],s:[0,1],w:[-1,0],e:[1,0]}[d][1];
                    var nkey = nx + ',' + ny;
                    var nz = lookup[nkey];
                    if (nz && !visited[nkey] && nz.owner === group.owner) {
                        visited[nkey] = true;
                        queue.push(nz);
                    }
                }
            }
            
            if (group.zones.length >= 2) {
                ownerGroups.push(group);
            }
        }
    }
    
    var html = '<div class="modal-section"><h4>🌍 МИР ВЕСТЕРОСА</h4>';
    
    // Легенда
    html += '<div style="background:#120e0b;border:1px solid #2a201a;border-radius:8px;padding:8px;margin-bottom:8px;">';
    html += '<p style="color:#c9b694;font-size:11px;margin-bottom:4px;">📋 ОБОЗНАЧЕНИЯ:</p>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;font-size:10px;color:#b8a890;">';
    html += '<span>⭐ Вы</span>';
    html += '<span>👑 Столица</span>';
    html += '<span>🏰 Замок</span>';
    html += '<span>🏘️ Деревня</span>';
    html += '<span>⛏️ Шахта</span>';
    html += '<span>🪓 Лесосека</span>';
    html += '</div>';
    
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;font-size:10px;color:#b8a890;margin-top:4px;">';
    html += '<span>🟢 Мои войска</span>';
    html += '<span>🟡 Мой отряд</span>';
    html += '<span>🟠 Другие отряды дома</span>';
    html += '<span>⚪ Войска</span>';
    html += '<span>🔴 Враги</span>';
    html += '</div>';
    html += '</div>';
    
    // Кнопка сбора
    if (houseId) {
        html += '<div style="text-align:center;margin:6px 0;display:flex;justify-content:center;gap:6px;flex-wrap:wrap;">';
        
        if (mySquad && (mySquad.role === 'commander' || mySquad.role === 'captain')) {
            html += '<button class="btn btn-small" onclick="openRallyModal()" style="background:#3d2e20;border-color:#8a7a5a;">📦 Сбор моего отряда</button>';
        }
        
        if (isHighCommand) {
            html += '<button class="btn btn-small" onclick="openHighCommandRallyModal()" style="background:#3d2e20;border-color:#8a7a5a;">📦 Сбор отряда</button>';
        }
        
        html += '</div>';
    }
    
    html += '<p style="color:#6a5a48;font-size:12px;text-align:center;">';
    html += '⭐ Вы | 👑 Столица | 🏰 Замок | 🏘️ Деревня | ⛏️ Шахта | 🪓 Лесосека | 🏚️ Руины';
    if (houseId) html += ' | 🟢 Свои | 🟡 Отряд | 🟠 Дом | 🔴 Враги';
    html += '</p>';
    html += '<p style="color:#6a5a48;font-size:11px;text-align:center;">Всего зон: ' + allZones.length + ' | Областей: ' + Object.keys(areas).length + '</p>';
    
    html += '<div style="text-align:center;margin:6px 0;display:flex;justify-content:center;gap:10px;flex-wrap:wrap;">';
    html += '<label style="font-size:11px;color:#b8a890;cursor:pointer;" onclick="toggleCoords()"><input type="checkbox" id="chk-coords" ' + (_showCoords ? 'checked' : '') + '> 📍 Координаты</label>';
    html += '<label style="font-size:11px;color:#b8a890;cursor:pointer;" onclick="toggleLevels()"><input type="checkbox" id="chk-levels" ' + (_showLevels ? 'checked' : '') + '> 📈 Уровни</label>';
    html += '<label style="font-size:11px;color:#b8a890;cursor:pointer;" onclick="toggleOwnerColors()"><input type="checkbox" id="chk-owners" ' + (_showOwners ? 'checked' : '') + '> 🎨 Владения</label>';
    html += '<label style="font-size:11px;color:#b8a890;cursor:pointer;" onclick="toggleArmies()"><input type="checkbox" id="chk-armies" ' + (_showArmies ? 'checked' : '') + '> ⚔️ Войска</label>';
    if (houseId) {
        html += '<button class="btn btn-small" onclick="closeWorldMap(); setTimeout(function(){ openMyHouse(); setTimeout(function(){ showHouseTab(\'command\'); }, 200); }, 100);" style="font-size:11px;">👑 Командование</button>';
    }
    html += '</div>';
    html += '</div>';
    
    var mapWidth = cols * cellSize;
    var mapHeight = rows * cellSize;
    var padding = Math.floor(cellSize * 2);
    
    html += '<div style="overflow:auto;max-width:100%;max-height:60vh;margin-top:8px;">';
    html += '<div id="world-map-container" style="position:relative;width:' + mapWidth + 'px;height:' + (mapHeight + padding*2) + 'px;min-width:' + mapWidth + 'px;background:#0a0806;border-radius:8px;">';
    
    html += '<div id="marching-layer" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:50;"></div>';
    
    // Рамки владений
    for (var gi = 0; gi < ownerGroups.length; gi++) {
        var group = ownerGroups[gi];
        var frameLeft = (group.minX - minX) * cellSize + 1;
        var frameTop = (group.minY - minY) * cellSize + padding + 1;
        var frameW = (group.maxX - group.minX + 1) * cellSize - 2;
        var frameH = (group.maxY - group.minY + 1) * cellSize - 2;
        
        var houseColor = '#ffd700';
        var houseLabel = '';
        if (group.owner === 'crown') {
            houseColor = '#ffd700';
            houseLabel = '👑 Корона';
        } else if (window.HOUSES && HOUSES[group.owner]) {
            houseColor = HOUSES[group.owner].color || '#ffd700';
            houseLabel = HOUSES[group.owner].sigil + ' ' + HOUSES[group.owner].name;
        }
        
        html += '<div style="position:absolute;left:' + frameLeft + 'px;top:' + frameTop + 'px;width:' + frameW + 'px;height:' + frameH + 'px;border:3px solid ' + houseColor + ';border-radius:4px;pointer-events:none;z-index:5;box-shadow:0 0 6px ' + houseColor + ';"></div>';
        
        var labelX = frameLeft + frameW/2;
        var labelY = frameTop + frameH/2;
        var labelFontSize = Math.max(12, Math.floor(Math.min(frameW, frameH) * 0.15));
        html += '<div style="position:absolute;left:' + labelX + 'px;top:' + labelY + 'px;transform:translate(-50%,-50%);text-align:center;pointer-events:none;z-index:10;">';
        html += '<span style="font-size:' + labelFontSize + 'px;font-weight:bold;color:#fff;background:rgba(0,0,0,0.7);padding:3px 8px;border-radius:4px;white-space:nowrap;opacity:0.9;text-shadow:0 0 4px #000;">' + houseLabel + '</span>';
        html += '</div>';
    }
    
    // Отрисовка зон
    for (var y = minY; y <= maxY; y++) {
        for (var x = minX; x <= maxX; x++) {
            var zone = lookup[x + ',' + y];
            var bg = '#0a0806';
            var emoji = '';
            var isCurrent = false;
            var castleInfo = zone ? getCastleInfo(zone) : null;
            
            if (zone) {
                var colorKey = zone.type;
                if (zone.type === 'coast' && zone.resourceType === 'shallows') colorKey = 'shallows';
                bg = typeColors[colorKey] || '#3d3026';
                
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
                }
                
                if (zone.id === currentId) isCurrent = true;
            }
            
            // Маркер войск
            var troopEmoji = '';
            var troopColor = '';
            if (zone && _showArmies && troopsByZone[zone.id]) {
                var td = troopsByZone[zone.id];
                
                if (td._own && td._own.count > 0) {
                    troopEmoji = '🟢';
                    troopColor = '#7ac98a';
                    
                    // Проверяем, есть ли там наш отряд
                    if (mySquad && td._own.squads) {
                        for (var sId in td._own.squads) {
                            if (sId === mySquad.commanderName) {
                                // Наш отряд — проверяем, это мои войска или нет
                                if (mySquad.role === 'commander' || mySquad.role === 'captain') {
                                    var isMine = false;
                                    if (mySquad.role === 'commander') isMine = true;
                                    else if (mySquad.role === 'captain') isMine = true;
                                    troopEmoji = isMine ? '🟢' : '🟡';
                                    troopColor = isMine ? '#7ac98a' : '#ffd700';
                                } else {
                                    troopEmoji = '🟡';
                                    troopColor = '#ffd700';
                                }
                            } else {
                                // Другой отряд дома
                                if (!troopEmoji || troopEmoji === '🟢') {
                                    troopEmoji = '🟠';
                                    troopColor = '#ff8c00';
                                }
                            }
                        }
                    }
                }
                
                if (td._enemy && td._enemy > 0) {
                    if (!troopEmoji || troopEmoji === '🟢') {
                        troopEmoji = '🔴';
                        troopColor = '#c96a5a';
                    }
                }
            }
            
            var subText = '';
            var subText2 = '';
            if (zone) {
                if (zone.type === 'crossroads' && zone.actions && zone.actions.some(function(a) { return a.id === 'enter_city'; })) {
                    subText = zone.area;
                } else if ((zone.type === 'castle' || zone.type === 'castle_gate') && castleInfo) {
                    subText = castleInfo.castle;
                }
                if (castleInfo) {
                    if (castleInfo.throne) {
                        subText2 = castleInfo.sigil + ' ' + castleInfo.house;
                    } else if (subText || zone.type === 'crossroads') {
                        subText2 = castleInfo.sigil + ' ' + castleInfo.house;
                    }
                }
            }
            
            var fontSize = Math.max(11, Math.floor(cellSize * 0.5));
            var fontSizeSmall = Math.max(10, Math.floor(cellSize * 0.4));
            var emojiSize = Math.max(14, Math.floor(cellSize * 0.6));
            var coordSize = Math.max(8, Math.floor(cellSize * 0.3));
            
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
            
            if (emoji) {
                html += '<span style="font-size:' + emojiSize + 'px;line-height:1;position:relative;z-index:2;">';
                if (isCurrent) html += '⭐'; else html += emoji;
                html += '</span>';
                if (troopEmoji) {
                    html += '<span style="position:absolute;top:1px;right:1px;font-size:' + Math.max(10, cellSize*0.35) + 'px;z-index:4;line-height:1;color:' + troopColor + ';">' + troopEmoji + '</span>';
                }
            } else if (troopEmoji) {
                html += '<span style="font-size:' + (emojiSize + 4) + 'px;line-height:1;position:relative;z-index:2;color:' + troopColor + ';">';
                if (isCurrent) html += '⭐'; else html += troopEmoji;
                html += '</span>';
            } else if (isCurrent) {
                html += '<span style="font-size:' + emojiSize + 'px;line-height:1;position:relative;z-index:2;">⭐</span>';
            }
            
            if (_showCoords) {
                html += '<span style="position:absolute;top:1px;left:2px;font-size:' + coordSize + 'px;color:#fff;opacity:0.9;z-index:3;line-height:1;pointer-events:none;text-shadow:0 0 2px #000;">' + x + ',' + y + '</span>';
            }
            if (_showLevels && zone && zone.level) {
                html += '<span style="position:absolute;bottom:1px;right:2px;font-size:' + coordSize + 'px;color:#ffd700;opacity:0.9;z-index:3;line-height:1;pointer-events:none;text-shadow:0 0 2px #000;">ур.' + zone.level + '</span>';
            }
            
            html += '</div>';
            
            if (subText || subText2) {
                var labelTop = top + cellSize + 2;
                html += '<div style="position:absolute;left:' + (left + cellSize/2) + 'px;top:' + labelTop + 'px;transform:translateX(-50%);text-align:center;z-index:100;pointer-events:none;">';
                if (subText) {
                    html += '<div style="font-size:' + fontSize + 'px;font-weight:bold;color:#ffd700;padding:1px 4px;white-space:nowrap;margin-bottom:1px;opacity:0.9;">' + subText + '</div>';
                }
                if (subText2) {
                    html += '<div style="font-size:' + fontSizeSmall + 'px;color:#ccc;padding:1px 3px;white-space:nowrap;opacity:0.9;">' + subText2 + '</div>';
                }
                html += '</div>';
            }
        }
    }
    
    html += '</div></div>';
    
    html += '<div class="modal-section" style="max-height:120px;overflow-y:auto;margin-top:8px;">';
    html += '<p style="color:#6a5a48;font-size:11px;">📋 ОБЛАСТИ:</p>';
    for (var a in areas) {
        var aa = areas[a];
        var areaOwner = '';
        for (var i = 0; i < allZones.length; i++) {
            if (allZones[i].area === a && allZones[i].owner && allZones[i].owner !== 'crown' && allZones[i].owner !== 'none') {
                if (window.HOUSES && HOUSES[allZones[i].owner]) {
                    areaOwner = ' ' + HOUSES[allZones[i].owner].sigil + ' ' + HOUSES[allZones[i].owner].name;
                }
                break;
            }
        }
        if (!areaOwner && a === 'Королевская Гавань') {
            areaOwner = ' 👑 Корона';
        }
        html += '<span style="display:inline-block;margin:2px 6px;font-size:11px;color:#b8a890;">📍 ' + a + ' (' + (aa.maxX-aa.minX+1) + '×' + (aa.maxY-aa.minY+1) + ')' + areaOwner + '</span>';
    }
    html += '</div>';
    
    html += '<div class="modal-section" style="margin-top:8px;">';
    html += '<p style="color:#6a5a48;font-size:12px;">📍 Вы: ' + currentLoc.name + ' [' + currentLoc.x + ',' + currentLoc.y + ']</p>';
    html += '</div>';
    
    html += '<button class="btn btn-secondary" onclick="closeWorldMap()" style="margin-top:8px;">Закрыть</button>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
    
    setTimeout(function() {
        var container = document.getElementById('world-map-container');
        if (container) {
            container.addEventListener('click', function(e) {
                var target = e.target;
                while (target && target !== container) {
                    if (target.style && target.style.position === 'absolute' && target.style.background && target.style.background !== '') {
                        var l = parseInt(target.style.left);
                        var t = parseInt(target.style.top);
                        var zx = minX + Math.floor((l - 1) / cellSize);
                        var zy = minY + Math.floor((t - 1 - padding) / cellSize);
                        var zone = lookup[zx + ',' + zy];
                        if (zone && zone.id) {
                            var isWater = (zone.type === 'river' || zone.type === 'sea' || zone.type === 'shallows' ||
                                zone.type === 'abyss' || zone.type === 'maelstrom' || zone.type === 'bay' ||
                                zone.type === 'reef' || (zone.type === 'coast' && zone.resourceType === 'shallows'));
                            if (!isWater && typeof handleZoneClick === 'function') {
                                handleZoneClick(zone.id);
                            }
                        }
                        return;
                    }
                    target = target.parentElement;
                }
            });
        }
    }, 100);
    
    setTimeout(function() { window.refreshMarchingMarkers(minX, minY, cellSize, padding, lookup); }, 200);
};

// ============================================================
// МОДАЛКИ СБОРА
// ============================================================

function openRallyModal() {
    var user = users[currentUser];
    var houseId = user.game.house;
    var mySquad = window.getMySquad();
    if (!mySquad) { setMessage('❌ Вы не в отряде.'); return; }
    
    var squad = mySquad.squad;
    
    var modal = document.getElementById('modal-rally');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-rally'; overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeRallyModal(); };
        overlay.innerHTML = '<div class="modal-box" style="max-height:90vh;overflow-y:auto;"><div class="modal-header"><h3>📦 СБОР ОТРЯДА</h3><button class="close-btn" onclick="closeRallyModal()">✕</button></div><div id="modal-rally-content"></div></div>';
        document.body.appendChild(overlay); modal = overlay;
    }
    
    var content = document.getElementById('modal-rally-content');
    var html = '<div class="modal-section"><h4>📦 СБОР ОТРЯДА</h4>';
    html += '<p style="color:#6a5a48;">Выберите кого собирать:</p>';
    
    html += '<div style="margin:10px 0;">';
    html += '<label style="display:block;padding:6px 0;color:#b8a890;cursor:pointer;">';
    html += '<input type="checkbox" id="rally_select_all" onchange="toggleAllRally()" checked> <strong>ВСЕ</strong>';
    html += '</label>';
    html += '<hr style="border-color:#2a201a;">';
    
    // Свои юниты
    if (mySquad.role === 'commander' && squad.units.length > 0) {
        html += '<p style="color:#c9b694;font-size:12px;">⭐ Мои юниты (' + squad.units.length + ')</p>';
        html += '<label style="display:block;padding:4px 0;color:#b8a890;cursor:pointer;padding-left:10px;">';
        html += '<input type="checkbox" class="rally-check" data-target="commander_units" checked> Все мои юниты';
        html += '</label>';
    }
    
    if (mySquad.role === 'captain') {
        var cap = squad.captains[mySquad.captainName];
        if (cap && cap.units.length > 0) {
            html += '<p style="color:#c9b694;font-size:12px;">🗡️ Мои юниты (' + cap.units.length + ')</p>';
            html += '<label style="display:block;padding:4px 0;color:#b8a890;cursor:pointer;padding-left:10px;">';
            html += '<input type="checkbox" class="rally-check" data-target="captain_units" checked> Все мои юниты';
            html += '</label>';
        }
    }
    
    // Капитаны (для командора)
    if (mySquad.role === 'commander') {
        for (var capName in squad.captains) {
            var cap = squad.captains[capName];
            var capTotal = cap.units.length;
            for (var sgtName in cap.sergeants) {
                capTotal += cap.sergeants[sgtName].units.length;
            }
            html += '<p style="color:#c9b694;font-size:12px;margin-top:6px;">🗡️ Капитан ' + capName + ' (' + capTotal + ')</p>';
            html += '<label style="display:block;padding:4px 0;color:#b8a890;cursor:pointer;padding-left:10px;">';
            html += '<input type="checkbox" class="rally-check" data-target="captain_' + capName + '" checked> Все юниты капитана';
            html += '</label>';
            
            for (var sgtName in cap.sergeants) {
                var sgt = cap.sergeants[sgtName];
                html += '<label style="display:block;padding:4px 0;color:#b8a890;cursor:pointer;padding-left:20px;">';
                html += '<input type="checkbox" class="rally-check" data-target="sergeant_' + capName + '_' + sgtName + '" checked> 🛡️ ' + sgtName + ' (' + sgt.units.length + ')';
                html += '</label>';
            }
        }
    }
    
    // Сержанты (для капитана)
    if (mySquad.role === 'captain') {
        var cap = squad.captains[mySquad.captainName];
        if (cap) {
            for (var sgtName in cap.sergeants) {
                var sgt = cap.sergeants[sgtName];
                html += '<p style="color:#c9b694;font-size:12px;margin-top:6px;">🛡️ Сержант ' + sgtName + ' (' + sgt.units.length + ')</p>';
                html += '<label style="display:block;padding:4px 0;color:#b8a890;cursor:pointer;padding-left:10px;">';
                html += '<input type="checkbox" class="rally-check" data-target="sergeant_' + mySquad.captainName + '_' + sgtName + '" checked> Все юниты сержанта';
                html += '</label>';
            }
        }
    }
    
    html += '</div>';
    
    html += '<button class="btn" onclick="confirmRally()" style="margin-top:10px;">✅ Собрать выбранных</button>';
    html += '<button class="btn btn-secondary" onclick="closeRallyModal()">Закрыть</button>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function toggleAllRally() {
    var allChecked = document.getElementById('rally_select_all').checked;
    var checks = document.querySelectorAll('.rally-check');
    checks.forEach(function(c) { c.checked = allChecked; });
}

function confirmRally() {
    var selected = [];
    var checks = document.querySelectorAll('.rally-check:checked');
    checks.forEach(function(c) { selected.push(c.getAttribute('data-target')); });
    
    if (selected.length === 0) { setMessage('❌ Ничего не выбрано.'); return; }
    
    closeRallyModal();
    closeWorldMap();
    
    window._awaitingTarget = true;
    window._targetData = { fromZone: 'rally', isRally: true, rallySelected: selected };
    setMessage('🗺️ Выберите точку сбора на карте.');
    setTimeout(function() { openWorldMap(); }, 300);
}

function openHighCommandRallyModal() {
    var houseId = users[currentUser].game.house;
    var squads = window.getSquads(houseId);
    var cmdNames = Object.keys(squads);
    
    if (cmdNames.length === 0) { setMessage('❌ Нет командоров.'); return; }
    
    var modal = document.getElementById('modal-rally');
    if (!modal) {
        var overlay = document.createElement('div');
        overlay.id = 'modal-rally'; overlay.className = 'modal-overlay hide';
        overlay.onclick = function(e) { if (e.target === this) closeRallyModal(); };
        overlay.innerHTML = '<div class="modal-box"><div class="modal-header"><h3>📦 СБОР ОТРЯДА</h3><button class="close-btn" onclick="closeRallyModal()">✕</button></div><div id="modal-rally-content"></div></div>';
        document.body.appendChild(overlay); modal = overlay;
    }
    
    var content = document.getElementById('modal-rally-content');
    var html = '<div class="modal-section"><h4>📦 ВЫБЕРИТЕ КОМАНДОРА</h4>';
    
    cmdNames.forEach(function(name) {
        html += '<button class="btn btn-game" onclick="selectCommanderForRally(\'' + name + '\')" style="margin:4px 0;">⭐ ' + name + '</button>';
    });
    
    html += '<button class="btn btn-secondary" onclick="closeRallyModal()" style="margin-top:10px;">Закрыть</button>';
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function selectCommanderForRally(cmdName) {
    closeRallyModal();
    closeWorldMap();
    
    window._awaitingTarget = true;
    window._targetData = { fromZone: 'rally', isRally: true, commanderName: cmdName, rallyAll: true };
    setMessage('🗺️ Выберите точку сбора для командора ' + cmdName + '.');
    setTimeout(function() { openWorldMap(); }, 300);
}

function closeRallyModal() {
    var m = document.getElementById('modal-rally');
    if (m) m.classList.add('hide');
}

// ============================================================
// МАРШ-МАРКЕРЫ
// ============================================================

window.refreshMarchingMarkers = function(minX, minY, cellSize, padding, lookup) {
    var layer = document.getElementById('marching-layer');
    if (!layer) return;
    
    layer.innerHTML = '';
    
    var houseId = users[currentUser] && users[currentUser].game ? users[currentUser].game.house : null;
    if (!houseId) return;
    
    var garrison = window._castleGarrisons && window._castleGarrisons[houseId] ? window._castleGarrisons[houseId] : null;
    if (!garrison || !garrison.marching) return;
    
    garrison.marching.forEach(function(m) {
        if (!m.path || m.currentStep >= m.path.length - 1) return;
        
        var currentZoneId = m.path[m.currentStep];
        var nextZoneId = m.path[m.currentStep + 1];
        var currentZone = WORLD_AREAS[currentZoneId];
        var nextZone = WORLD_AREAS[nextZoneId];
        if (!currentZone || !nextZone) return;
        
        var fromX = (currentZone.x - minX) * cellSize + cellSize/2;
        var fromY = (currentZone.y - minY) * cellSize + cellSize/2 + padding;
        var toX = (nextZone.x - minX) * cellSize + cellSize/2;
        var toY = (nextZone.y - minY) * cellSize + cellSize/2 + padding;
        
        var speed = m.speedPerZone || 2;
        var moveTimeMs = speed * 60 * 1000;
        
        var curX = fromX;
        var curY = fromY;
        
        if (m.phase === 'moving') {
            var timeLeft = m.nextPhaseTime - Date.now();
            var progress = 1 - (timeLeft / moveTimeMs);
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;
            curX = fromX + (toX - fromX) * progress;
            curY = fromY + (toY - fromY) * progress;
        }
        
        var emoji = '🟢';
        if (m.isSquad || m.isRally) emoji = '👑';
        else if (m.isScout) emoji = '👁️';
        else if (m.units) {
            var hasC = false, hasS = false;
            m.units.forEach(function(u) {
                if (u.siege) hasS = true;
                else if (u.horse || u.type === 'rider' || u.type === 'heavy_rider' || u.type === 'knight') hasC = true;
            });
            if (hasS) emoji = '🟤';
            else if (hasC) emoji = '🐴';
        }
        
        var displayText = emoji + ' ' + m.units.length;
        if (m.phase === 'waiting') {
            displayText = '⏳ ' + displayText;
        }
        
        var marker = document.createElement('div');
        marker.style.cssText = 'position:absolute;left:' + curX + 'px;top:' + curY + 'px;font-size:11px;z-index:51;transform:translate(-50%,-50%);pointer-events:none;';
        if (m.phase === 'moving') {
            marker.style.cssText += 'transition:left ' + (speed*60) + 's linear, top ' + (speed*60) + 's linear;';
        }
        marker.textContent = displayText;
        marker.style.color = '#7ac98a';
        marker.style.fontWeight = 'bold';
        marker.style.textShadow = '0 0 3px #000';
        
        layer.appendChild(marker);
        
        if (m.phase === 'moving') {
            setTimeout(function() {
                marker.style.left = toX + 'px';
                marker.style.top = toY + 'px';
            }, 50);
        }
    });
    
    setTimeout(function() { window.refreshMarchingMarkers(minX, minY, cellSize, padding, lookup); }, 2000);
};

window.closeWorldMap = function() {
    var modal = document.getElementById('modal-world-map');
    if (modal) modal.classList.add('hide');
};

window.toggleOwnerColors = function() {
    _showOwners = !_showOwners;
    document.getElementById('chk-owners').checked = _showOwners;
    openWorldMap();
};

window.toggleCoords = function() {
    _showCoords = !_showCoords;
    document.getElementById('chk-coords').checked = _showCoords;
    openWorldMap();
};

window.toggleLevels = function() {
    _showLevels = !_showLevels;
    document.getElementById('chk-levels').checked = _showLevels;
    openWorldMap();
};

window.toggleArmies = function() {
    _showArmies = !_showArmies;
    document.getElementById('chk-armies').checked = _showArmies;
    openWorldMap();
};

// ============================================================
// ОБРАБОТЧИК КЛИКА ПО КАРТЕ ДЛЯ СБОРА
// ============================================================

var _originalHandleZoneClick = window.handleZoneClick;
window.handleZoneClick = function(zoneId) {
    if (window._awaitingTarget && window._targetData && window._targetData.isRally) {
        var data = window._targetData;
        window._awaitingTarget = false;
        
        if (data.rallyAll) {
            // Сбор всего отряда командора
            window.rallySquadTo(data.commanderName, zoneId);
            setMessage('📦 Войска командора ' + data.commanderName + ' выдвигаются в точку сбора.');
        } else if (data.rallySelected) {
            // Сбор выбранных юнитов
            rallySelectedUnits(data.rallySelected, zoneId);
        }
        
        window._targetData = null;
        closeWorldMap();
        return;
    }
    
    if (_originalHandleZoneClick) {
        _originalHandleZoneClick(zoneId);
    }
};

function rallySelectedUnits(selected, targetZoneId) {
    var user = users[currentUser];
    var houseId = user.game.house;
    var mySquad = window.getMySquad();
    if (!mySquad) return;
    
    var squad = mySquad.squad;
    var garrison = window._castleGarrisons[houseId];
    var allUnits = [];
    
    ['infantry','cavalry','siege'].forEach(function(cat) {
        if (garrison[cat]) {
            for (var i = garrison[cat].length - 1; i >= 0; i--) {
                var u = garrison[cat][i];
                if (!u.isScout && u.squadId === mySquad.commanderName) {
                    var shouldTake = false;
                    
                    if (selected.indexOf('commander_units') !== -1 && u.commander === currentUser && !u.captainId) shouldTake = true;
                    if (selected.indexOf('captain_units') !== -1 && u.captainId === currentUser && !u.sergeantId) shouldTake = true;
                    
                    for (var si = 0; si < selected.length; si++) {
                        var s = selected[si];
                        if (s.indexOf('captain_') === 0 && u.captainId === s.replace('captain_', '')) shouldTake = true;
                        if (s.indexOf('sergeant_') === 0) {
                            var parts = s.replace('sergeant_', '').split('_');
                            if (u.sergeantId === parts[parts.length-1] && u.captainId === parts.slice(0, -1).join('_')) shouldTake = true;
                        }
                    }
                    
                    if (shouldTake) {
                        allUnits.push(garrison[cat].splice(i, 1)[0]);
                    }
                }
            }
        }
    });
    
    if (allUnits.length === 0) { setMessage('❌ Нет выбранных юнитов.'); return; }
    
    var speedPerZone = 2;
    var hasC = false, hasS = false;
    allUnits.forEach(function(u) { if(u.siege)hasS=true; else if(u.horse||u.type==='rider'||u.type==='heavy_rider'||u.type==='knight')hasC=true; });
    if (hasS) speedPerZone = 5; else if (hasC) speedPerZone = 1;
    
    var currentLoc = squad.location === 'castle' ? 'bl_-1_0' : squad.location;
    var path = findPath(currentLoc, targetZoneId);
    var marchId = 'rally_select_' + Date.now() + '_' + Math.floor(Math.random()*1000);
    var marchData = {
        id: marchId, units: allUnits, path: path, currentStep: 0,
        action: 'move', houseId: houseId, speedPerZone: speedPerZone,
        moveTimeMs: speedPerZone * 60 * 1000, waitTimeMs: 10000,
        phase: 'waiting', nextPhaseTime: Date.now() + 10000,
        isSquad: true, squadId: mySquad.commanderName, isRally: true
    };
    
    if (!garrison.marching) garrison.marching = [];
    garrison.marching.push(marchData);
    
    saveData();
    setMessage('📦 ' + allUnits.length + ' юнитов выдвигаются в точку сбора.');
    addHouseLog(houseId, '📦 Сбор ' + allUnits.length + ' юнитов → ' + getZoneName(targetZoneId));
    processMarchStep(marchId);
}

function getZoneName(zoneId) {
    var z = WORLD_AREAS[zoneId];
    return z ? z.name : zoneId;
}

// ============================================================
// РЕГИСТРАЦИЯ
// ============================================================

window.openCompass = openCompass;
window.closeCompass = closeCompass;
window.moveTo = moveTo;
window.openWorldMap = openWorldMap;
window.closeWorldMap = closeWorldMap;
window.toggleOwnerColors = toggleOwnerColors;
window.toggleCoords = toggleCoords;
window.toggleLevels = toggleLevels;
window.toggleArmies = toggleArmies;
window.openRallyModal = openRallyModal;
window.toggleAllRally = toggleAllRally;
window.confirmRally = confirmRally;
window.closeRallyModal = closeRallyModal;
window.openHighCommandRallyModal = openHighCommandRallyModal;
window.selectCommanderForRally = selectCommanderForRally;

console.log('✅ Система перемещений + Карта мира + Отряды + Сбор загружены!');

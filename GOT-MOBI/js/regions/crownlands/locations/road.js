var ROAD_LEVEL = 5;

var _roadOriginalUpdateStory = window.updateStory;
var _roadOriginalUpdateActions = window.updateActions;

window.updateStory = function() {
    var g = users[currentUser].game;
    if (g.location.place !== 'Дорога') {
        if (typeof _roadOriginalUpdateStory === 'function') return _roadOriginalUpdateStory();
        return;
    }
    document.getElementById('story-title').textContent = '📍 Дорога (ур.' + ROAD_LEVEL + ')';
    document.getElementById('story-text').textContent = '🛤️ Королевский тракт.';
    updateActions();
};

window.updateActions = function() {
    var g = users[currentUser].game;
    if (g.location.place !== 'Дорога') {
        if (typeof _roadOriginalUpdateActions === 'function') return _roadOriginalUpdateActions();
        return;
    }
    var container = document.getElementById('actions-container');
    if (!container) return;
    container.innerHTML = '';
    var actions = [
        { id: 'enter_city', label: '🚶 Войти в город' },
        { id: 'search', label: '🔍 Поиск' },
        { id: 'inventory', label: '🎒 Инвентарь' },
        { id: 'character', label: '👤 Персонаж' },
        { id: 'menu', label: '📋 Меню' }
    ];
    for (var i = 0; i < actions.length; i++) {
        var a = actions[i];
        var btn = document.createElement('button');
        btn.className = 'btn-game';
        btn.textContent = a.label;
        btn.onclick = (function(id) { return function() {
            if (id === 'enter_city') {
                g.location.place = 'Ворота'; g.location.location = 'Королевская Гавань'; g.outside = false;
                setMessage('🚪 Вы вошли в Королевскую Гавань.');
                updateMenu(); updateStory(); updateActions(); saveData(); return;
            }
            if (id === 'search') {
                if (typeof window.doSearch === 'function') { window.doSearch(); return; }
                setMessage('❌ Боевая система не загружена.'); return;
            }
            if (typeof gameAction === 'function') gameAction(id);
        }; })(a.id);
        container.appendChild(btn);
    }
};

// ============================================================
// js/game/07-locations.js — ТОРГОВЛЯ, КРАФТ, МАГАЗИНЫ
// ============================================================

// ============================================================
// 1. МАГАЗИНЫ NPC
// ============================================================

function openShop(shopType) {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var modal = document.getElementById('modal-trade');
    var content = document.getElementById('modal-trade-content');
    
    var html = '<div class="modal-section"><h4>🏪 ' + shopType + '</h4>';
    html += '<p style="color:#6a5a48;">💰 ' + formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper) + '</p>';
    html += '</div>';
    html += '<div class="modal-section"><h4>📦 КУПИТЬ</h4>';
    html += '<p style="color:#6a5a48;">🛒 Товары временно недоступны.</p>';
    html += '</div>';
    html += '<div class="modal-section"><h4>💰 ПРОДАТЬ</h4>';
    html += '<p style="color:#6a5a48;">📦 Продажа временно недоступна.</p>';
    html += '</div>';
    html += '<button class="btn" onclick="closeTrade()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function openCraftMenu() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var modal = document.getElementById('modal-trade');
    var content = document.getElementById('modal-trade-content');
    
    var html = '<div class="modal-section"><h4>🔨 КРАФТ</h4>';
    html += '<p style="color:#6a5a48;">⏳ Крафт в разработке.</p>';
    html += '</div>';
    html += '<button class="btn" onclick="closeTrade()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function openGuild() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var modal = document.getElementById('modal-guild');
    var content = document.getElementById('modal-guild-content');
    
    var html = '<div class="modal-section"><h4>🏛️ ГИЛЬДИЯ ТОРГОВЦЕВ</h4>';
    html += '<p style="color:#6a5a48;">⏳ Аукцион в разработке.</p>';
    html += '</div>';
    html += '<button class="btn" onclick="closeGuild()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function openTavernTrade() {
    var user = users[currentUser];
    if (!user) { setMessage('❌ Игрок не найден.'); return; }
    var g = user.game;
    
    var modal = document.getElementById('modal-trade');
    var content = document.getElementById('modal-trade-content');
    
    var html = '<div class="modal-section"><h4>🍺 ТАВЕРНА</h4>';
    html += '<p style="color:#6a5a48;">💰 ' + formatCurrency(g.gold * 210 * 56 + g.silver * 56 + g.copper) + '</p>';
    html += '</div>';
    html += '<div class="modal-section"><h4>📦 КУПИТЬ</h4>';
    html += '<p style="color:#6a5a48;">🛒 Товары временно недоступны.</p>';
    html += '</div>';
    html += '<button class="btn" onclick="closeTrade()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeTrade() {
    document.getElementById('modal-trade').classList.add('hide');
}

function closeGuild() {
    document.getElementById('modal-guild').classList.add('hide');
}

// ============================================================
// 2. РЕГИСТРАЦИЯ В ГЛОБАЛЬНУЮ ОБЛАСТЬ
// ============================================================

window.openShop = openShop;
window.openCraftMenu = openCraftMenu;
window.openGuild = openGuild;
window.openTavernTrade = openTavernTrade;
window.closeTrade = closeTrade;
window.closeGuild = closeGuild;

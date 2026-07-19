// ============================================================
// js/data/drops.js — ДОБЫЧА РЕСУРСОВ
// ============================================================

function getQualityChances(level) {
    if (level >= 80) return { 'Легендарное': 10, 'Мастерское': 20, 'Качественное': 30, 'Хорошее': 25, 'Обычное': 15 };
    if (level >= 60) return { 'Легендарное': 5, 'Мастерское': 15, 'Качественное': 25, 'Хорошее': 30, 'Обычное': 25 };
    if (level >= 40) return { 'Мастерское': 5, 'Качественное': 20, 'Хорошее': 35, 'Обычное': 40 };
    if (level >= 20) return { 'Качественное': 10, 'Хорошее': 30, 'Обычное': 60 };
    if (level >= 10) return { 'Хорошее': 10, 'Обычное': 90 };
    return { 'Обычное': 100 };
}

function getGatherTime(professionLevel) {
    return Math.max(1, 5 * (1 - (professionLevel || 0) * 0.005));
}

function rollResource(loc, professionLevel) {
    var res = loc.resources;
    if (!res || res.length === 0) return null;
    
    // Выбор ресурса
    var item;
    if (typeof res[0] === 'string') {
        item = { name: res[Math.floor(Math.random() * res.length)] };
    } else {
        var roll = Math.random() * 100;
        var cumulative = 0;
        for (var i = 0; i < res.length; i++) {
            cumulative += res[i].chance || 0;
            if (roll <= cumulative) { item = { name: res[i].name }; break; }
        }
        if (!item) item = { name: res[res.length - 1].name };
    }
    
    // Качество от уровня локации + профессии
    var chances = getQualityChances(loc.level || 1);
    var bonus = (professionLevel || 0) * 0.2; // +0.2% за уровень профессии
    
    if (bonus > 0) {
        var qualitiesAbove = [];
        for (var q in chances) {
            if (q !== 'Обычное') qualitiesAbove.push(q);
        }
        var perQuality = bonus / qualitiesAbove.length;
        
        for (var i = 0; i < qualitiesAbove.length; i++) {
            chances[qualitiesAbove[i]] = (chances[qualitiesAbove[i]] || 0) + perQuality;
        }
        chances['Обычное'] = Math.max(0, (chances['Обычное'] || 0) - bonus);
    }
    
    var qRoll = Math.random() * 100;
    var qCum = 0;
    for (var q in chances) {
        qCum += chances[q];
        if (qRoll <= qCum) { item.quality = q; break; }
    }
    
    // Количество: +1 за каждые 20 уровней профессии
    item.count = 1 + Math.floor((professionLevel || 0) / 20);
    
    return item;
}

// ============================================================
// ВСЕ ДОМА ВЕСТЕРОСА (houses.js) — ФИНАЛЬНАЯ ВЕРСИЯ
// Все 99 домов. Все независимы на старте.
// ============================================================

var HOUSES = {
    // ============================================================
    // 1. СЕВЕР (The North) — 13 домов
    // Столица: Белая Гавань (нейтральная)
    // ============================================================
    stark: {
        id: 'stark', name: 'Старки', sigil: '🐺', region: 'north', type: 'independent',
        castle: 'Винтерфелл', castleId: 'winterfell', liege: null,
        army: { infantry: 1200, cavalry: 500, ships: 0 }, treasury: 3000, loyalty: 85, reputation: 90,
        motto: 'Зима близко.', color: '#8cb3d9'
    },
    bolton: {
        id: 'bolton', name: 'Болтоны', sigil: '🩸', region: 'north', type: 'independent',
        castle: 'Дредфорт', castleId: 'dreadfort', liege: null,
        army: { infantry: 300, cavalry: 100, ships: 0 }, treasury: 1000, loyalty: 70, reputation: 40,
        motto: 'Наша сталь остра.', color: '#c0392b'
    },
    karstark: {
        id: 'karstark', name: 'Карстарки', sigil: '⭐', region: 'north', type: 'independent',
        castle: 'Кархолд', castleId: 'karhold', liege: null,
        army: { infantry: 200, cavalry: 80, ships: 0 }, treasury: 800, loyalty: 85, reputation: 70,
        motto: 'Зимнее солнце', color: '#d4af37'
    },
    mormont: {
        id: 'mormont', name: 'Мормонты', sigil: '🐻', region: 'north', type: 'independent',
        castle: 'Медвежий остров', castleId: 'bear_island', liege: null,
        army: { infantry: 150, cavalry: 50, ships: 20 }, treasury: 500, loyalty: 95, reputation: 85,
        motto: 'Здесь мы стоим.', color: '#8e44ad'
    },
    umber: {
        id: 'umber', name: 'Амберы', sigil: '🪓', region: 'north', type: 'independent',
        castle: 'Последний Очаг', castleId: 'last_hearth', liege: null,
        army: { infantry: 250, cavalry: 60, ships: 0 }, treasury: 600, loyalty: 90, reputation: 75,
        motto: 'Мы выстоим', color: '#e74c3c'
    },
    glover: {
        id: 'glover', name: 'Гловеры', sigil: '🧤', region: 'north', type: 'independent',
        castle: 'Темнолесье', castleId: 'deepwood_motte', liege: null,
        army: { infantry: 180, cavalry: 40, ships: 10 }, treasury: 400, loyalty: 80, reputation: 70,
        motto: 'Честь и долг', color: '#2c3e50'
    },
    reed: {
        id: 'reed', name: 'Риды', sigil: '🌿', region: 'north', type: 'independent',
        castle: 'Серая Стража', castleId: 'greywater_watch', liege: null,
        army: { infantry: 100, cavalry: 30, ships: 0 }, treasury: 300, loyalty: 95, reputation: 80,
        motto: 'Болото помнит', color: '#27ae60'
    },
    manderly: {
        id: 'manderly', name: 'Мандерли', sigil: '🐟', region: 'north', type: 'independent',
        castle: 'Белая Гавань', castleId: 'white_harbor', liege: null,
        army: { infantry: 200, cavalry: 50, ships: 30 }, treasury: 1200, loyalty: 85, reputation: 80,
        motto: 'Верность и сила', color: '#2980b9'
    },
    hornwood: {
        id: 'hornwood', name: 'Хорнвуды', sigil: '🌲', region: 'north', type: 'independent',
        castle: 'Хорнвуд', castleId: 'hornwood', liege: null,
        army: { infantry: 150, cavalry: 40, ships: 0 }, treasury: 350, loyalty: 80, reputation: 65,
        motto: 'Лес помнит', color: '#2d5016'
    },
    tallhart: {
        id: 'tallhart', name: 'Толхарты', sigil: '🌾', region: 'north', type: 'independent',
        castle: 'Толхарт', castleId: 'tallhart', liege: null,
        army: { infantry: 120, cavalry: 30, ships: 0 }, treasury: 280, loyalty: 75, reputation: 60,
        motto: 'Зерно и сталь', color: '#c0392b'
    },
    slate: {
        id: 'slate', name: 'Слейты', sigil: '⛰️', region: 'north', type: 'independent',
        castle: 'Чёрная Крепость', castleId: 'black_keep', liege: null,
        army: { infantry: 100, cavalry: 20, ships: 0 }, treasury: 200, loyalty: 70, reputation: 55,
        motto: 'Крепче камня', color: '#7f8c8d'
    },
    flint: {
        id: 'flint', name: 'Флинты', sigil: '🔥', region: 'north', type: 'independent',
        castle: 'Флинт', castleId: 'flint', liege: null,
        army: { infantry: 90, cavalry: 15, ships: 0 }, treasury: 180, loyalty: 75, reputation: 60,
        motto: 'Огонь в крови', color: '#e67e22'
    },
    norrey: {
        id: 'norrey', name: 'Норри', sigil: '🌿', region: 'north', type: 'independent',
        castle: 'Норри', castleId: 'norrey', liege: null,
        army: { infantry: 80, cavalry: 10, ships: 0 }, treasury: 150, loyalty: 80, reputation: 65,
        motto: 'Хранители гор', color: '#27ae60'
    },

    // ============================================================
    // 2. ЗАПАДНЫЕ ЗЕМЛИ (The Westerlands) — 17 домов
    // Столица: Ланниспорт (нейтральный)
    // ============================================================
    lannister: {
        id: 'lannister', name: 'Ланнистеры', sigil: '🦁', region: 'westlands', type: 'independent',
        castle: 'Утёс Кастерли', castleId: 'casterly_rock', liege: null,
        army: { infantry: 1500, cavalry: 800, ships: 50 }, treasury: 10000, loyalty: 30, reputation: 70,
        motto: 'Слышишь мой рёв?', color: '#d4af37'
    },
    reyne: {
        id: 'reyne', name: 'Рейны', sigil: '🦀', region: 'westlands', type: 'independent',
        castle: 'Кастамере', castleId: 'castamere', liege: null,
        army: { infantry: 200, cavalry: 60, ships: 0 }, treasury: 600, loyalty: 75, reputation: 50,
        motto: 'Мы не забываем.', color: '#c0392b'
    },
    marbrand: {
        id: 'marbrand', name: 'Марбранды', sigil: '🔥', region: 'westlands', type: 'independent',
        castle: 'Эшмарк', castleId: 'ashemark', liege: null,
        army: { infantry: 180, cavalry: 50, ships: 0 }, treasury: 500, loyalty: 80, reputation: 70,
        motto: 'Огонь и сталь', color: '#e67e22'
    },
    crakehall: {
        id: 'crakehall', name: 'Крейкхоллы', sigil: '🐗', region: 'westlands', type: 'independent',
        castle: 'Крейкхолл', castleId: 'crakehall', liege: null,
        army: { infantry: 220, cavalry: 70, ships: 0 }, treasury: 550, loyalty: 75, reputation: 65,
        motto: 'Сила и честь', color: '#2c3e50'
    },
    brax: {
        id: 'brax', name: 'Браксы', sigil: '🐴', region: 'westlands', type: 'independent',
        castle: 'Хорнвейл', castleId: 'hornvale', liege: null,
        army: { infantry: 160, cavalry: 80, ships: 0 }, treasury: 450, loyalty: 70, reputation: 60,
        motto: 'Быстрее ветра', color: '#8e44ad'
    },
    farman: {
        id: 'farman', name: 'Фарманы', sigil: '⚓', region: 'westlands', type: 'independent',
        castle: 'Прекрасный остров', castleId: 'fair_isle', liege: null,
        army: { infantry: 120, cavalry: 30, ships: 40 }, treasury: 400, loyalty: 80, reputation: 65,
        motto: 'Море наш дом', color: '#3498db'
    },
    westerling: {
        id: 'westerling', name: 'Вестерлинги', sigil: '⛰️', region: 'westlands', type: 'independent',
        castle: 'Утёс', castleId: 'the_crag', liege: null,
        army: { infantry: 130, cavalry: 40, ships: 0 }, treasury: 350, loyalty: 65, reputation: 55,
        motto: 'Скала не сдаётся', color: '#95a5a6'
    },
    plumm: {
        id: 'plumm', name: 'Пламмы', sigil: '💎', region: 'westlands', type: 'independent',
        castle: 'Пламм', castleId: 'plumm', liege: null,
        army: { infantry: 110, cavalry: 35, ships: 0 }, treasury: 300, loyalty: 70, reputation: 60,
        motto: 'Богатство и честь', color: '#9b59b6'
    },
    serrett: {
        id: 'serrett', name: 'Серретты', sigil: '🪙', region: 'westlands', type: 'independent',
        castle: 'Серретт', castleId: 'serrett', liege: null,
        army: { infantry: 100, cavalry: 25, ships: 0 }, treasury: 400, loyalty: 75, reputation: 60,
        motto: 'Серебро и сталь', color: '#bdc3c7'
    },
    clegane: {
        id: 'clegane', name: 'Клиганы', sigil: '🐕', region: 'westlands', type: 'independent',
        castle: 'Крепость Клиганов', castleId: 'clegane_keep', liege: null,
        army: { infantry: 80, cavalry: 20, ships: 0 }, treasury: 200, loyalty: 95, reputation: 20,
        motto: 'Псы всегда верны', color: '#2c3e50'
    },
    lefford: {
        id: 'lefford', name: 'Леффорды', sigil: '🏔️', region: 'westlands', type: 'independent',
        castle: 'Золотой Зуб', castleId: 'golden_tooth', liege: null,
        army: { infantry: 140, cavalry: 45, ships: 0 }, treasury: 600, loyalty: 80, reputation: 70,
        motto: 'Золото — наша сила', color: '#f1c40f'
    },
    betley: {
        id: 'betley', name: 'Бетли', sigil: '🏹', region: 'westlands', type: 'independent',
        castle: 'Бетли', castleId: 'betley', liege: null,
        army: { infantry: 90, cavalry: 20, ships: 0 }, treasury: 220, loyalty: 70, reputation: 55,
        motto: 'Меткий выстрел', color: '#27ae60'
    },
    erene: {
        id: 'erene', name: 'Эрены', sigil: '🌿', region: 'westlands', type: 'independent',
        castle: 'Эрен', castleId: 'erene', liege: null,
        army: { infantry: 85, cavalry: 15, ships: 0 }, treasury: 180, loyalty: 65, reputation: 50,
        motto: 'Зелень и покой', color: '#2ecc71'
    },
    estwick: {
        id: 'estwick', name: 'Эствики', sigil: '🪨', region: 'westlands', type: 'independent',
        castle: 'Эствик', castleId: 'estwick', liege: null,
        army: { infantry: 75, cavalry: 10, ships: 0 }, treasury: 150, loyalty: 60, reputation: 45,
        motto: 'Крепче камня', color: '#7f8c8d'
    },
    green: {
        id: 'green', name: 'Грины', sigil: '🌾', region: 'westlands', type: 'independent',
        castle: 'Грин', castleId: 'green', liege: null,
        army: { infantry: 70, cavalry: 10, ships: 0 }, treasury: 140, loyalty: 70, reputation: 50,
        motto: 'Зелёные поля', color: '#27ae60'
    },
    yaz: {
        id: 'yaz', name: 'Язы', sigil: '⚔️', region: 'westlands', type: 'independent',
        castle: 'Яз', castleId: 'yaz', liege: null,
        army: { infantry: 60, cavalry: 15, ships: 0 }, treasury: 120, loyalty: 75, reputation: 55,
        motto: 'Честь и сталь', color: '#2c3e50'
    },
    payne: {
        id: 'payne', name: 'Пейны', sigil: '🪦', region: 'westlands', type: 'independent',
        castle: 'Пейн', castleId: 'payne', liege: null,
        army: { infantry: 50, cavalry: 10, ships: 0 }, treasury: 100, loyalty: 90, reputation: 30,
        motto: 'Смерть не ждёт', color: '#2c3e50'
    },

    // ============================================================
    // 3. ПРОСТОР (The Reach) — 14 домов
    // Столица: Старомест (нейтральный)
    // ============================================================
    tyrell: {
        id: 'tyrell', name: 'Тиреллы', sigil: '🌹', region: 'reach', type: 'independent',
        castle: 'Хайгарден', castleId: 'highgarden', liege: null,
        army: { infantry: 1000, cavalry: 600, ships: 100 }, treasury: 4000, loyalty: 85, reputation: 80,
        motto: 'Вырастая, мы становимся сильнее.', color: '#27ae60'
    },
    hightower: {
        id: 'hightower', name: 'Хайтауэры', sigil: '🏛️', region: 'reach', type: 'independent',
        castle: 'Хайтауэр', castleId: 'hightower', liege: null,
        army: { infantry: 250, cavalry: 100, ships: 40 }, treasury: 1200, loyalty: 80, reputation: 75,
        motto: 'Свет знаний', color: '#8e44ad'
    },
    tarly: {
        id: 'tarly', name: 'Тарли', sigil: '🏹', region: 'reach', type: 'independent',
        castle: 'Хорнхилл', castleId: 'horn_hill', liege: null,
        army: { infantry: 200, cavalry: 70, ships: 0 }, treasury: 800, loyalty: 90, reputation: 85,
        motto: 'Первый в бою', color: '#2c3e50'
    },
    redwyne: {
        id: 'redwyne', name: 'Редвины', sigil: '🍷', region: 'reach', type: 'independent',
        castle: 'Арбор', castleId: 'arbor', liege: null,
        army: { infantry: 150, cavalry: 50, ships: 80 }, treasury: 900, loyalty: 85, reputation: 75,
        motto: 'Вино и сила', color: '#e74c3c'
    },
    rowan: {
        id: 'rowan', name: 'Рованы', sigil: '🌲', region: 'reach', type: 'independent',
        castle: 'Золотая Роща', castleId: 'golden_grove', liege: null,
        army: { infantry: 180, cavalry: 60, ships: 0 }, treasury: 650, loyalty: 75, reputation: 65,
        motto: 'Золотой лес', color: '#f1c40f'
    },
    oakheart: {
        id: 'oakheart', name: 'Окхарты', sigil: '🌳', region: 'reach', type: 'independent',
        castle: 'Старый Дуб', castleId: 'old_oak', liege: null,
        army: { infantry: 160, cavalry: 50, ships: 0 }, treasury: 550, loyalty: 80, reputation: 70,
        motto: 'Древняя сила', color: '#2d5016'
    },
    fossoway: {
        id: 'fossoway', name: 'Фоссовеи', sigil: '🍎', region: 'reach', type: 'independent',
        castle: 'Фоссовей', castleId: 'fossoway', liege: null,
        army: { infantry: 130, cavalry: 40, ships: 0 }, treasury: 400, loyalty: 80, reputation: 65,
        motto: 'Красное яблоко', color: '#e74c3c'
    },
    ashford: {
        id: 'ashford', name: 'Эшфорды', sigil: '🌸', region: 'reach', type: 'independent',
        castle: 'Эшфорд', castleId: 'ashford', liege: null,
        army: { infantry: 120, cavalry: 35, ships: 0 }, treasury: 350, loyalty: 75, reputation: 60,
        motto: 'Цветы и сталь', color: '#e91e63'
    },
    merryweather: {
        id: 'merryweather', name: 'Мерривезеры', sigil: '🎭', region: 'reach', type: 'independent',
        castle: 'Мерривезер', castleId: 'merryweather', liege: null,
        army: { infantry: 100, cavalry: 30, ships: 0 }, treasury: 300, loyalty: 70, reputation: 55,
        motto: 'Игра и честь', color: '#9b59b6'
    },
    florent: {
        id: 'florent', name: 'Флоренты', sigil: '🌿', region: 'reach', type: 'independent',
        castle: 'Брайтуотер', castleId: 'brightwater_keep', liege: null,
        army: { infantry: 140, cavalry: 45, ships: 0 }, treasury: 450, loyalty: 60, reputation: 50,
        motto: 'Свет и вода', color: '#2ecc71'
    },
    crane: {
        id: 'crane', name: 'Крейны', sigil: '🦢', region: 'reach', type: 'independent',
        castle: 'Красное Озеро', castleId: 'red_lake', liege: null,
        army: { infantry: 90, cavalry: 25, ships: 0 }, treasury: 250, loyalty: 80, reputation: 65,
        motto: 'Красное озеро', color: '#e74c3c'
    },
    webber: {
        id: 'webber', name: 'Вебберы', sigil: '🕷️', region: 'reach', type: 'independent',
        castle: 'Веббер', castleId: 'webber', liege: null,
        army: { infantry: 80, cavalry: 20, ships: 0 }, treasury: 200, loyalty: 70, reputation: 50,
        motto: 'Тишина и паутина', color: '#34495e'
    },
    went: {
        id: 'went', name: 'Уэнты', sigil: '🏰', region: 'reach', type: 'independent',
        castle: 'Уэнт', castleId: 'went', liege: null,
        army: { infantry: 70, cavalry: 15, ships: 0 }, treasury: 180, loyalty: 75, reputation: 55,
        motto: 'Верность стенам', color: '#7f8c8d'
    },
    caswell: {
        id: 'caswell', name: 'Касвеллы', sigil: '🛡️', region: 'reach', type: 'independent',
        castle: 'Касвелл', castleId: 'caswell', liege: null,
        army: { infantry: 60, cavalry: 10, ships: 0 }, treasury: 150, loyalty: 80, reputation: 60,
        motto: 'Щит и меч', color: '#2c3e50'
    },

    // ============================================================
    // 4. РЕЧНЫЕ ЗЕМЛИ (The Riverlands) — 12 домов
    // Столица: Девичье озеро (нейтральное)
    // ============================================================
    tully: {
        id: 'tully', name: 'Талли', sigil: '🐟', region: 'riverlands', type: 'independent',
        castle: 'Риверран', castleId: 'riverrun', liege: null,
        army: { infantry: 800, cavalry: 400, ships: 0 }, treasury: 2500, loyalty: 75, reputation: 80,
        motto: 'Семья, долг, честь.', color: '#2980b9'
    },
    frey: {
        id: 'frey', name: 'Фреи', sigil: '🌉', region: 'riverlands', type: 'independent',
        castle: 'Близнецы', castleId: 'twins', liege: null,
        army: { infantry: 180, cavalry: 50, ships: 0 }, treasury: 600, loyalty: 60, reputation: 30,
        motto: 'Мы не забываем долги', color: '#bdc3c7'
    },
    mallister: {
        id: 'mallister', name: 'Маллистеры', sigil: '🦅', region: 'riverlands', type: 'independent',
        castle: 'Сигард', castleId: 'seagard', liege: null,
        army: { infantry: 150, cavalry: 40, ships: 10 }, treasury: 400, loyalty: 90, reputation: 80,
        motto: 'Честь превыше всего', color: '#8e44ad'
    },
    blackwood: {
        id: 'blackwood', name: 'Блэквуды', sigil: '🌳', region: 'riverlands', type: 'independent',
        castle: 'Блэквуд', castleId: 'blackwood', liege: null,
        army: { infantry: 160, cavalry: 45, ships: 0 }, treasury: 450, loyalty: 85, reputation: 75,
        motto: 'Древняя кровь', color: '#2c3e50'
    },
    bracken: {
        id: 'bracken', name: 'Бракены', sigil: '🌿', region: 'riverlands', type: 'independent',
        castle: 'Бракен', castleId: 'bracken', liege: null,
        army: { infantry: 140, cavalry: 40, ships: 0 }, treasury: 400, loyalty: 65, reputation: 55,
        motto: 'Зелёная земля', color: '#27ae60'
    },
    darry: {
        id: 'darry', name: 'Дарри', sigil: '🦁', region: 'riverlands', type: 'independent',
        castle: 'Дарри', castleId: 'darry', liege: null,
        army: { infantry: 120, cavalry: 35, ships: 0 }, treasury: 350, loyalty: 70, reputation: 60,
        motto: 'Верность льву', color: '#f1c40f'
    },
    vance: {
        id: 'vance', name: 'Вэнсы', sigil: '🗡️', region: 'riverlands', type: 'independent',
        castle: 'Вэнс', castleId: 'vance', liege: null,
        army: { infantry: 110, cavalry: 30, ships: 0 }, treasury: 300, loyalty: 75, reputation: 60,
        motto: 'Острый клинок', color: '#bdc3c7'
    },
    piper: {
        id: 'piper', name: 'Пайперы', sigil: '🎵', region: 'riverlands', type: 'independent',
        castle: 'Пайпер', castleId: 'piper', liege: null,
        army: { infantry: 100, cavalry: 25, ships: 0 }, treasury: 250, loyalty: 80, reputation: 65,
        motto: 'Мелодия и сталь', color: '#e67e22'
    },
    root: {
        id: 'root', name: 'Руты', sigil: '🌱', region: 'riverlands', type: 'independent',
        castle: 'Рут', castleId: 'root', liege: null,
        army: { infantry: 80, cavalry: 15, ships: 0 }, treasury: 200, loyalty: 70, reputation: 55,
        motto: 'Корни сильны', color: '#27ae60'
    },
    shawney: {
        id: 'shawney', name: 'Шоуни', sigil: '⚔️', region: 'riverlands', type: 'independent',
        castle: 'Шоуни', castleId: 'shawney', liege: null,
        army: { infantry: 70, cavalry: 15, ships: 0 }, treasury: 180, loyalty: 65, reputation: 50,
        motto: 'Меч и щит', color: '#7f8c8d'
    },
    lychester: {
        id: 'lychester', name: 'Линчестеры', sigil: '🏹', region: 'riverlands', type: 'independent',
        castle: 'Линчестер', castleId: 'lychester', liege: null,
        army: { infantry: 60, cavalry: 10, ships: 0 }, treasury: 150, loyalty: 75, reputation: 60,
        motto: 'Меткий выстрел', color: '#2c3e50'
    },
    terrick: {
        id: 'terrick', name: 'Террики', sigil: '🌾', region: 'riverlands', type: 'independent',
        castle: 'Террик', castleId: 'terrick', liege: null,
        army: { infantry: 50, cavalry: 10, ships: 0 }, treasury: 120, loyalty: 70, reputation: 50,
        motto: 'Зерно и честь', color: '#f1c40f'
    },

    // ============================================================
    // 5. ШТОРМОВЫЕ ЗЕМЛИ (The Stormlands) — 11 домов
    // Столица: Скорбящий Городок (нейтральный)
    // ============================================================
    baratheon: {
        id: 'baratheon', name: 'Баратеоны', sigil: '🦌', region: 'stormlands', type: 'independent',
        castle: 'Штормовой Предел', castleId: 'storms_end', liege: null,
        army: { infantry: 900, cavalry: 500, ships: 30 }, treasury: 3000, loyalty: 80, reputation: 75,
        motto: 'Ярость и буря.', color: '#2c3e50'
    },
    connington: {
        id: 'connington', name: 'Коннингтоны', sigil: '🦅', region: 'stormlands', type: 'independent',
        castle: 'Гнездо Грифона', castleId: 'griffins_roost', liege: null,
        army: { infantry: 160, cavalry: 45, ships: 0 }, treasury: 500, loyalty: 85, reputation: 75,
        motto: 'Грифон не сдаётся', color: '#2c3e50'
    },
    swann: {
        id: 'swann', name: 'Сванны', sigil: '🦢', region: 'stormlands', type: 'independent',
        castle: 'Каменный Шлем', castleId: 'stone_helm', liege: null,
        army: { infantry: 140, cavalry: 35, ships: 0 }, treasury: 400, loyalty: 80, reputation: 70,
        motto: 'Честь и верность', color: '#ecf0f1'
    },
    dondarrion: {
        id: 'dondarrion', name: 'Дондаррионы', sigil: '⚡', region: 'stormlands', type: 'independent',
        castle: 'Чёрная Крепость', castleId: 'black_keep', liege: null,
        army: { infantry: 130, cavalry: 40, ships: 0 }, treasury: 380, loyalty: 85, reputation: 70,
        motto: 'Молния и гром', color: '#f1c40f'
    },
    caron: {
        id: 'caron', name: 'Карроны', sigil: '🎵', region: 'stormlands', type: 'independent',
        castle: 'Каррон', castleId: 'caron', liege: null,
        army: { infantry: 110, cavalry: 30, ships: 0 }, treasury: 300, loyalty: 70, reputation: 55,
        motto: 'Песня и сталь', color: '#e67e22'
    },
    selmy: {
        id: 'selmy', name: 'Селми', sigil: '🛡️', region: 'stormlands', type: 'independent',
        castle: 'Селми', castleId: 'selmy', liege: null,
        army: { infantry: 100, cavalry: 25, ships: 0 }, treasury: 280, loyalty: 85, reputation: 75,
        motto: 'Честь и долг', color: '#2c3e50'
    },
    trant: {
        id: 'trant', name: 'Транты', sigil: '⚔️', region: 'stormlands', type: 'independent',
        castle: 'Трант', castleId: 'trant', liege: null,
        army: { infantry: 90, cavalry: 20, ships: 0 }, treasury: 250, loyalty: 70, reputation: 45,
        motto: 'Меч и щит', color: '#7f8c8d'
    },
    morrigan: {
        id: 'morrigan', name: 'Морригены', sigil: '🐦‍⬛', region: 'stormlands', type: 'independent',
        castle: 'Морриген', castleId: 'morrigan', liege: null,
        army: { infantry: 80, cavalry: 15, ships: 0 }, treasury: 200, loyalty: 75, reputation: 60,
        motto: 'Тень и клюв', color: '#2c3e50'
    },
    staunton: {
        id: 'staunton', name: 'Стаунтоны', sigil: '🪨', region: 'stormlands', type: 'independent',
        castle: 'Стаунтон', castleId: 'staunton', liege: null,
        army: { infantry: 70, cavalry: 15, ships: 0 }, treasury: 180, loyalty: 70, reputation: 55,
        motto: 'Крепче скалы', color: '#95a5a6'
    },
    buckler: {
        id: 'buckler', name: 'Баклеры', sigil: '🛡️', region: 'stormlands', type: 'independent',
        castle: 'Баклер', castleId: 'buckler', liege: null,
        army: { infantry: 60, cavalry: 10, ships: 0 }, treasury: 150, loyalty: 80, reputation: 65,
        motto: 'Щит и честь', color: '#2c3e50'
    },
    errol: {
        id: 'errol', name: 'Эрролы', sigil: '🦅', region: 'stormlands', type: 'independent',
        castle: 'Эррол', castleId: 'errol', liege: null,
        army: { infantry: 50, cavalry: 10, ships: 0 }, treasury: 120, loyalty: 75, reputation: 60,
        motto: 'Орёл и гром', color: '#2c3e50'
    },

    // ============================================================
    // 6. ДОРН (Dorne) — 11 домов
    // Столица: Песчаный Берег (нейтральный)
    // ============================================================
    martell: {
        id: 'martell', name: 'Мартеллы', sigil: '☀️', region: 'dorne', type: 'independent',
        castle: 'Солнечное Копьё', castleId: 'sunspear', liege: null,
        army: { infantry: 800, cavalry: 400, ships: 30 }, treasury: 3500, loyalty: 85, reputation: 75,
        motto: 'Непокорённые.', color: '#e67e22'
    },
    dayne: {
        id: 'dayne', name: 'Дейны', sigil: '⭐', region: 'dorne', type: 'independent',
        castle: 'Звездопад', castleId: 'starfall', liege: null,
        army: { infantry: 150, cavalry: 40, ships: 0 }, treasury: 500, loyalty: 90, reputation: 85,
        motto: 'Свет звезды', color: '#f1c40f'
    },
    yronwood: {
        id: 'yronwood', name: 'Йронвуды', sigil: '🦂', region: 'dorne', type: 'independent',
        castle: 'Йронвуд', castleId: 'yronwood', liege: null,
        army: { infantry: 160, cavalry: 45, ships: 0 }, treasury: 450, loyalty: 75, reputation: 65,
        motto: 'Скорпион и песок', color: '#e67e22'
    },
    manwoody: {
        id: 'manwoody', name: 'Мэнвуды', sigil: '🏔️', region: 'dorne', type: 'independent',
        castle: 'Мэнвуди', castleId: 'manwoody', liege: null,
        army: { infantry: 120, cavalry: 35, ships: 0 }, treasury: 350, loyalty: 80, reputation: 65,
        motto: 'Гора и честь', color: '#7f8c8d'
    },
    santagar: {
        id: 'santagar', name: 'Сантагары', sigil: '🌵', region: 'dorne', type: 'independent',
        castle: 'Сантагар', castleId: 'santagar', liege: null,
        army: { infantry: 100, cavalry: 30, ships: 0 }, treasury: 300, loyalty: 75, reputation: 60,
        motto: 'Пустыня и сталь', color: '#27ae60'
    },
    gargalen: {
        id: 'gargalen', name: 'Гаргалены', sigil: '🐍', region: 'dorne', type: 'independent',
        castle: 'Гаргален', castleId: 'gargalen', liege: null,
        army: { infantry: 90, cavalry: 25, ships: 0 }, treasury: 280, loyalty: 70, reputation: 55,
        motto: 'Змея и яд', color: '#27ae60'
    },
    uller: {
        id: 'uller', name: 'Уллеры', sigil: '🌵', region: 'dorne', type: 'independent',
        castle: 'Уллер', castleId: 'uller', liege: null,
        army: { infantry: 80, cavalry: 20, ships: 0 }, treasury: 220, loyalty: 70, reputation: 55,
        motto: 'Колючка и песок', color: '#2ecc71'
    },
    fowler: {
        id: 'fowler', name: 'Фаулеры', sigil: '🦅', region: 'dorne', type: 'independent',
        castle: 'Фаулер', castleId: 'fowler', liege: null,
        army: { infantry: 70, cavalry: 15, ships: 0 }, treasury: 180, loyalty: 80, reputation: 65,
        motto: 'Орёл и солнце', color: '#f1c40f'
    },
    blackmont: {
        id: 'blackmont', name: 'Блэкмонты', sigil: '🏔️', region: 'dorne', type: 'independent',
        castle: 'Блэкмонт', castleId: 'blackmont', liege: null,
        army: { infantry: 60, cavalry: 10, ships: 0 }, treasury: 150, loyalty: 75, reputation: 60,
        motto: 'Чёрная гора', color: '#2c3e50'
    },
    dalt: {
        id: 'dalt', name: 'Далты', sigil: '🌊', region: 'dorne', type: 'independent',
        castle: 'Далт', castleId: 'dalt', liege: null,
        army: { infantry: 50, cavalry: 10, ships: 5 }, treasury: 120, loyalty: 70, reputation: 50,
        motto: 'Море и песок', color: '#3498db'
    },
    jordayne: {
        id: 'jordayne', name: 'Джордайны', sigil: '🌊', region: 'dorne', type: 'independent',
        castle: 'Джордайн', castleId: 'jordayne', liege: null,
        army: { infantry: 40, cavalry: 10, ships: 0 }, treasury: 100, loyalty: 75, reputation: 55,
        motto: 'Волна и честь', color: '#2980b9'
    },

    // ============================================================
    // 7. ДОЛИНА (The Vale) — 10 домов
    // Столица: Чаячий город (нейтральный)
    // ============================================================
    arryn: {
        id: 'arryn', name: 'Аррены', sigil: '🦅', region: 'vale', type: 'independent',
        castle: 'Орлиное Гнездо', castleId: 'eyrie', liege: null,
        army: { infantry: 700, cavalry: 350, ships: 0 }, treasury: 2500, loyalty: 85, reputation: 80,
        motto: 'Высоко как честь.', color: '#95a5a6'
    },
    royce: {
        id: 'royce', name: 'Ройсы', sigil: '🪨', region: 'vale', type: 'independent',
        castle: 'Рунный Камень', castleId: 'runestone', liege: null,
        army: { infantry: 180, cavalry: 50, ships: 0 }, treasury: 600, loyalty: 85, reputation: 75,
        motto: 'Древняя память', color: '#7f8c8d'
    },
    hunter: {
        id: 'hunter', name: 'Хантеры', sigil: '🏹', region: 'vale', type: 'independent',
        castle: 'Хантер', castleId: 'hunter', liege: null,
        army: { infantry: 140, cavalry: 40, ships: 0 }, treasury: 450, loyalty: 80, reputation: 65,
        motto: 'Меткий выстрел', color: '#27ae60'
    },
    redfort: {
        id: 'redfort', name: 'Редфорты', sigil: '🔴', region: 'vale', type: 'independent',
        castle: 'Редфорт', castleId: 'redfort', liege: null,
        army: { infantry: 130, cavalry: 35, ships: 0 }, treasury: 400, loyalty: 80, reputation: 65,
        motto: 'Красная крепость', color: '#e74c3c'
    },
    waynwood: {
        id: 'waynwood', name: 'Вейнвуды', sigil: '🌿', region: 'vale', type: 'independent',
        castle: 'Вейнвуд', castleId: 'waynwood', liege: null,
        army: { infantry: 120, cavalry: 30, ships: 0 }, treasury: 350, loyalty: 80, reputation: 65,
        motto: 'Зелёная долина', color: '#2ecc71'
    },
    corbray: {
        id: 'corbray', name: 'Корбрэи', sigil: '🗡️', region: 'vale', type: 'independent',
        castle: 'Корбрэй', castleId: 'corbray', liege: null,
        army: { infantry: 110, cavalry: 35, ships: 0 }, treasury: 320, loyalty: 75, reputation: 60,
        motto: 'Острый клинок', color: '#bdc3c7'
    },
    belmore: {
        id: 'belmore', name: 'Белморы', sigil: '🛡️', region: 'vale', type: 'independent',
        castle: 'Белмор', castleId: 'belmore', liege: null,
        army: { infantry: 90, cavalry: 25, ships: 0 }, treasury: 280, loyalty: 75, reputation: 60,
        motto: 'Щит и честь', color: '#2c3e50'
    },
    eyon: {
        id: 'eyon', name: 'Эйоны', sigil: '🦅', region: 'vale', type: 'independent',
        castle: 'Эйон', castleId: 'eyon', liege: null,
        army: { infantry: 80, cavalry: 20, ships: 0 }, treasury: 220, loyalty: 80, reputation: 65,
        motto: 'Орёл и скала', color: '#7f8c8d'
    },
    hardy: {
        id: 'hardy', name: 'Харди', sigil: '⛰️', region: 'vale', type: 'independent',
        castle: 'Харди', castleId: 'hardy', liege: null,
        army: { infantry: 70, cavalry: 15, ships: 0 }, treasury: 180, loyalty: 70, reputation: 55,
        motto: 'Твёрдый как камень', color: '#95a5a6'
    },
    melcolm: {
        id: 'melcolm', name: 'Мелкомбы', sigil: '🏔️', region: 'vale', type: 'independent',
        castle: 'Мелкомб', castleId: 'melcolm', liege: null,
        army: { infantry: 60, cavalry: 10, ships: 0 }, treasury: 150, loyalty: 75, reputation: 60,
        motto: 'Гора и честь', color: '#7f8c8d'
    },

    // ============================================================
    // 8. ЖЕЛЕЗНЫЕ ОСТРОВА (The Iron Islands) — 11 домов
    // Столица: Лордпорт (нейтральный)
    // ============================================================
    greyjoy: {
        id: 'greyjoy', name: 'Грейджои', sigil: '🐙', region: 'iron_islands', type: 'independent',
        castle: 'Пайк', castleId: 'pyke', liege: null,
        army: { infantry: 700, cavalry: 300, ships: 200 }, treasury: 2000, loyalty: 70, reputation: 40,
        motto: 'Мы не сеем.', color: '#34495e'
    },
    harlaw: {
        id: 'harlaw', name: 'Харлоу', sigil: '📖', region: 'iron_islands', type: 'independent',
        castle: 'Харлоу', castleId: 'harlaw_rock', liege: null,
        army: { infantry: 120, cavalry: 30, ships: 30 }, treasury: 300, loyalty: 85, reputation: 70,
        motto: 'Мудрость сильнее стали', color: '#8e44ad'
    },
    blacktyde: {
        id: 'blacktyde', name: 'Блэктайды', sigil: '🌑', region: 'iron_islands', type: 'independent',
        castle: 'Блэктайд', castleId: 'blacktyde', liege: null,
        army: { infantry: 100, cavalry: 25, ships: 20 }, treasury: 250, loyalty: 70, reputation: 50,
        motto: 'Тёмная волна', color: '#2c3e50'
    },
    goodbrother: {
        id: 'goodbrother', name: 'Гудбразеры', sigil: '🐗', region: 'iron_islands', type: 'independent',
        castle: 'Гудбразер', castleId: 'goodbrother', liege: null,
        army: { infantry: 110, cavalry: 25, ships: 15 }, treasury: 280, loyalty: 75, reputation: 55,
        motto: 'Сила и кабан', color: '#2c3e50'
    },
    botley: {
        id: 'botley', name: 'Ботли', sigil: '⚓', region: 'iron_islands', type: 'independent',
        castle: 'Ботли', castleId: 'botley', liege: null,
        army: { infantry: 90, cavalry: 20, ships: 25 }, treasury: 220, loyalty: 80, reputation: 60,
        motto: 'Море и якорь', color: '#3498db'
    },
    saltcliffe: {
        id: 'saltcliffe', name: 'Солтклиффы', sigil: '🧂', region: 'iron_islands', type: 'independent',
        castle: 'Солтклифф', castleId: 'saltcliffe', liege: null,
        army: { infantry: 80, cavalry: 15, ships: 15 }, treasury: 200, loyalty: 70, reputation: 50,
        motto: 'Соль и сталь', color: '#ecf0f1'
    },
    drumm: {
        id: 'drumm', name: 'Драммы', sigil: '🥁', region: 'iron_islands', type: 'independent',
        castle: 'Драмм', castleId: 'drumm', liege: null,
        army: { infantry: 70, cavalry: 15, ships: 10 }, treasury: 180, loyalty: 75, reputation: 55,
        motto: 'Барабан и волна', color: '#2c3e50'
    },
    merryn: {
        id: 'merryn', name: 'Меррины', sigil: '🌊', region: 'iron_islands', type: 'independent',
        castle: 'Меррин', castleId: 'merryn', liege: null,
        army: { infantry: 60, cavalry: 10, ships: 10 }, treasury: 150, loyalty: 70, reputation: 50,
        motto: 'Морская пена', color: '#3498db'
    },
    kenning: {
        id: 'kenning', name: 'Кеннинги', sigil: '⚔️', region: 'iron_islands', type: 'independent',
        castle: 'Кеннинг', castleId: 'kenning', liege: null,
        army: { infantry: 50, cavalry: 10, ships: 5 }, treasury: 120, loyalty: 75, reputation: 55,
        motto: 'Меч и море', color: '#2c3e50'
    },
    stonehouse: {
        id: 'stonehouse', name: 'Стоунхаусы', sigil: '🪨', region: 'iron_islands', type: 'independent',
        castle: 'Стоунхаус', castleId: 'stonehouse', liege: null,
        army: { infantry: 40, cavalry: 5, ships: 5 }, treasury: 100, loyalty: 70, reputation: 45,
        motto: 'Камень и море', color: '#95a5a6'
    },
    orkwood: {
        id: 'orkwood', name: 'Орквуды', sigil: '🌳', region: 'iron_islands', type: 'independent',
        castle: 'Орквуд', castleId: 'orkwood', liege: null,
        army: { infantry: 30, cavalry: 5, ships: 5 }, treasury: 80, loyalty: 75, reputation: 50,
        motto: 'Дерево и волна', color: '#27ae60'
    }
};

// ============================================================
// ВСЕ ДОМА ВЕСТЕРОСА (houses.js) — ФИНАЛЬНАЯ ВЕРСИЯ
// Все 100 домов. Все независимы на старте.
// Только: id, name, sigil, region, type, castle, castleId, liege, motto, color
// Цвета уникальные, по лору
// ============================================================

var HOUSES = {
    // ============================================================
    // 1. СЕВЕР (The North) — 13 домов
    // ============================================================
    stark: {
        id: 'stark', name: 'Старки', sigil: '🐺', region: 'north', type: 'independent',
        castle: 'Винтерфелл', castleId: 'winterfell', liege: null,
        motto: 'Зима близко.', color: '#b0bec5'
    },
    bolton: {
        id: 'bolton', name: 'Болтоны', sigil: '🩸', region: 'north', type: 'independent',
        castle: 'Дредфорт', castleId: 'dreadfort', liege: null,
        motto: 'Наша сталь остра.', color: '#e91e63'
    },
    karstark: {
        id: 'karstark', name: 'Карстарки', sigil: '⭐', region: 'north', type: 'independent',
        castle: 'Кархолд', castleId: 'karhold', liege: null,
        motto: 'Зимнее солнце', color: '#ff8f00'
    },
    mormont: {
        id: 'mormont', name: 'Мормонты', sigil: '🐻', region: 'north', type: 'independent',
        castle: 'Медвежий остров', castleId: 'bear_island', liege: null,
        motto: 'Здесь мы стоим.', color: '#4a148c'
    },
    umber: {
        id: 'umber', name: 'Амберы', sigil: '🪓', region: 'north', type: 'independent',
        castle: 'Последний Очаг', castleId: 'last_hearth', liege: null,
        motto: 'Мы выстоим', color: '#bf360c'
    },
    glover: {
        id: 'glover', name: 'Гловеры', sigil: '🧤', region: 'north', type: 'independent',
        castle: 'Темнолесье', castleId: 'deepwood_motte', liege: null,
        motto: 'Честь и долг', color: '#37474f'
    },
    reed: {
        id: 'reed', name: 'Риды', sigil: '🌿', region: 'north', type: 'independent',
        castle: 'Серая Стража', castleId: 'greywater_watch', liege: null,
        motto: 'Болото помнит', color: '#33691e'
    },
    manderly: {
        id: 'manderly', name: 'Мандерли', sigil: '🐟', region: 'north', type: 'independent',
        castle: 'Белая Гавань', castleId: 'white_harbor', liege: null,
        motto: 'Верность и сила', color: '#0d47a1'
    },
    hornwood: {
        id: 'hornwood', name: 'Хорнвуды', sigil: '🌲', region: 'north', type: 'independent',
        castle: 'Хорнвуд', castleId: 'hornwood', liege: null,
        motto: 'Лес помнит', color: '#1b5e20'
    },
    tallhart: {
        id: 'tallhart', name: 'Толхарты', sigil: '🌾', region: 'north', type: 'independent',
        castle: 'Толхарт', castleId: 'tallhart', liege: null,
        motto: 'Зерно и сталь', color: '#827717'
    },
    slate: {
        id: 'slate', name: 'Слейты', sigil: '⛰️', region: 'north', type: 'independent',
        castle: 'Чёрная Крепость', castleId: 'black_keep', liege: null,
        motto: 'Крепче камня', color: '#546e7a'
    },
    flint: {
        id: 'flint', name: 'Флинты', sigil: '🔥', region: 'north', type: 'independent',
        castle: 'Флинт', castleId: 'flint', liege: null,
        motto: 'Огонь в крови', color: '#d84315'
    },
    norrey: {
        id: 'norrey', name: 'Норри', sigil: '🌿', region: 'north', type: 'independent',
        castle: 'Норри', castleId: 'norrey', liege: null,
        motto: 'Хранители гор', color: '#558b2f'
    },

    // ============================================================
    // 2. ЗАПАДНЫЕ ЗЕМЛИ (The Westerlands) — 17 домов
    // ============================================================
    lannister: {
        id: 'lannister', name: 'Ланнистеры', sigil: '🦁', region: 'westlands', type: 'independent',
        castle: 'Утёс Кастерли', castleId: 'casterly_rock', liege: null,
        motto: 'Слышишь мой рёв?', color: '#dc143c'
    },
    reyne: {
        id: 'reyne', name: 'Рейны', sigil: '🦀', region: 'westlands', type: 'independent',
        castle: 'Кастамере', castleId: 'castamere', liege: null,
        motto: 'Мы не забываем.', color: '#b71c1c'
    },
    marbrand: {
        id: 'marbrand', name: 'Марбранды', sigil: '🔥', region: 'westlands', type: 'independent',
        castle: 'Эшмарк', castleId: 'ashemark', liege: null,
        motto: 'Огонь и сталь', color: '#ff6d00'
    },
    crakehall: {
        id: 'crakehall', name: 'Крейкхоллы', sigil: '🐗', region: 'westlands', type: 'independent',
        castle: 'Крейкхолл', castleId: 'crakehall', liege: null,
        motto: 'Сила и честь', color: '#5d4037'
    },
    brax: {
        id: 'brax', name: 'Браксы', sigil: '🐴', region: 'westlands', type: 'independent',
        castle: 'Хорнвейл', castleId: 'hornvale', liege: null,
        motto: 'Быстрее ветра', color: '#6a1b9a'
    },
    farman: {
        id: 'farman', name: 'Фарманы', sigil: '⚓', region: 'westlands', type: 'independent',
        castle: 'Прекрасный остров', castleId: 'fair_isle', liege: null,
        motto: 'Море наш дом', color: '#01579b'
    },
    westerling: {
        id: 'westerling', name: 'Вестерлинги', sigil: '⛰️', region: 'westlands', type: 'independent',
        castle: 'Утёс', castleId: 'the_crag', liege: null,
        motto: 'Скала не сдаётся', color: '#78909c'
    },
    plumm: {
        id: 'plumm', name: 'Пламмы', sigil: '💎', region: 'westlands', type: 'independent',
        castle: 'Пламм', castleId: 'plumm', liege: null,
        motto: 'Богатство и честь', color: '#7b1fa2'
    },
    serrett: {
        id: 'serrett', name: 'Серретты', sigil: '🪙', region: 'westlands', type: 'independent',
        castle: 'Серретт', castleId: 'serrett', liege: null,
        motto: 'Серебро и сталь', color: '#9e9e9e'
    },
    clegane: {
        id: 'clegane', name: 'Клиганы', sigil: '🐕', region: 'westlands', type: 'independent',
        castle: 'Крепость Клиганов', castleId: 'clegane_keep', liege: null,
        motto: 'Псы всегда верны', color: '#3e2723'
    },
    lefford: {
        id: 'lefford', name: 'Леффорды', sigil: '🏔️', region: 'westlands', type: 'independent',
        castle: 'Золотой Зуб', castleId: 'golden_tooth', liege: null,
        motto: 'Золото — наша сила', color: '#f9a825'
    },
    betley: {
        id: 'betley', name: 'Бетли', sigil: '🏹', region: 'westlands', type: 'independent',
        castle: 'Бетли', castleId: 'betley', liege: null,
        motto: 'Меткий выстрел', color: '#43a047'
    },
    erene: {
        id: 'erene', name: 'Эрены', sigil: '🌿', region: 'westlands', type: 'independent',
        castle: 'Эрен', castleId: 'erene', liege: null,
        motto: 'Зелень и покой', color: '#00c853'
    },
    estwick: {
        id: 'estwick', name: 'Эствики', sigil: '🪨', region: 'westlands', type: 'independent',
        castle: 'Эствик', castleId: 'estwick', liege: null,
        motto: 'Крепче камня', color: '#8d6e63'
    },
    green: {
        id: 'green', name: 'Грины', sigil: '🌾', region: 'westlands', type: 'independent',
        castle: 'Грин', castleId: 'green', liege: null,
        motto: 'Зелёные поля', color: '#689f38'
    },
    yaz: {
        id: 'yaz', name: 'Язы', sigil: '⚔️', region: 'westlands', type: 'independent',
        castle: 'Яз', castleId: 'yaz', liege: null,
        motto: 'Честь и сталь', color: '#455a64'
    },
    payne: {
        id: 'payne', name: 'Пейны', sigil: '🪦', region: 'westlands', type: 'independent',
        castle: 'Пейн', castleId: 'payne', liege: null,
        motto: 'Смерть не ждёт', color: '#212121'
    },

    // ============================================================
    // 3. ПРОСТОР (The Reach) — 14 домов
    // ============================================================
    tyrell: {
        id: 'tyrell', name: 'Тиреллы', sigil: '🌹', region: 'reach', type: 'independent',
        castle: 'Хайгарден', castleId: 'highgarden', liege: null,
        motto: 'Вырастая, мы становимся сильнее.', color: '#4caf50'
    },
    hightower: {
        id: 'hightower', name: 'Хайтауэры', sigil: '🏛️', region: 'reach', type: 'independent',
        castle: 'Хайтауэр', castleId: 'hightower', liege: null,
        motto: 'Свет знаний', color: '#9c27b0'
    },
    tarly: {
        id: 'tarly', name: 'Тарли', sigil: '🏹', region: 'reach', type: 'independent',
        castle: 'Хорнхилл', castleId: 'horn_hill', liege: null,
        motto: 'Первый в бою', color: '#2e7d32'
    },
    redwyne: {
        id: 'redwyne', name: 'Редвины', sigil: '🍷', region: 'reach', type: 'independent',
        castle: 'Арбор', castleId: 'arbor', liege: null,
        motto: 'Вино и сила', color: '#c62828'
    },
    rowan: {
        id: 'rowan', name: 'Рованы', sigil: '🌲', region: 'reach', type: 'independent',
        castle: 'Золотая Роща', castleId: 'golden_grove', liege: null,
        motto: 'Золотой лес', color: '#ffab00'
    },
    oakheart: {
        id: 'oakheart', name: 'Окхарты', sigil: '🌳', region: 'reach', type: 'independent',
        castle: 'Старый Дуб', castleId: 'old_oak', liege: null,
        motto: 'Древняя сила', color: '#388e3c'
    },
    fossoway: {
        id: 'fossoway', name: 'Фоссовеи', sigil: '🍎', region: 'reach', type: 'independent',
        castle: 'Фоссовей', castleId: 'fossoway', liege: null,
        motto: 'Красное яблоко', color: '#d32f2f'
    },
    ashford: {
        id: 'ashford', name: 'Эшфорды', sigil: '🌸', region: 'reach', type: 'independent',
        castle: 'Эшфорд', castleId: 'ashford', liege: null,
        motto: 'Цветы и сталь', color: '#f06292'
    },
    merryweather: {
        id: 'merryweather', name: 'Мерривезеры', sigil: '🎭', region: 'reach', type: 'independent',
        castle: 'Мерривезер', castleId: 'merryweather', liege: null,
        motto: 'Игра и честь', color: '#8e24aa'
    },
    florent: {
        id: 'florent', name: 'Флоренты', sigil: '🌿', region: 'reach', type: 'independent',
        castle: 'Брайтуотер', castleId: 'brightwater_keep', liege: null,
        motto: 'Свет и вода', color: '#00bfa5'
    },
    crane: {
        id: 'crane', name: 'Крейны', sigil: '🦢', region: 'reach', type: 'independent',
        castle: 'Красное Озеро', castleId: 'red_lake', liege: null,
        motto: 'Красное озеро', color: '#ef5350'
    },
    webber: {
        id: 'webber', name: 'Вебберы', sigil: '🕷️', region: 'reach', type: 'independent',
        castle: 'Веббер', castleId: 'webber', liege: null,
        motto: 'Тишина и паутина', color: '#424242'
    },
    went: {
        id: 'went', name: 'Уэнты', sigil: '🏰', region: 'reach', type: 'independent',
        castle: 'Уэнт', castleId: 'went', liege: null,
        motto: 'Верность стенам', color: '#795548'
    },
    caswell: {
        id: 'caswell', name: 'Касвеллы', sigil: '🛡️', region: 'reach', type: 'independent',
        castle: 'Касвелл', castleId: 'caswell', liege: null,
        motto: 'Щит и меч', color: '#607d8b'
    },

    // ============================================================
    // 4. РЕЧНЫЕ ЗЕМЛИ (The Riverlands) — 12 домов
    // ============================================================
    tully: {
        id: 'tully', name: 'Талли', sigil: '🐟', region: 'riverlands', type: 'independent',
        castle: 'Риверран', castleId: 'riverrun', liege: null,
        motto: 'Семья, долг, честь.', color: '#1565c0'
    },
    frey: {
        id: 'frey', name: 'Фреи', sigil: '🌉', region: 'riverlands', type: 'independent',
        castle: 'Близнецы', castleId: 'twins', liege: null,
        motto: 'Мы не забываем долги', color: '#90a4ae'
    },
    mallister: {
        id: 'mallister', name: 'Маллистеры', sigil: '🦅', region: 'riverlands', type: 'independent',
        castle: 'Сигард', castleId: 'seagard', liege: null,
        motto: 'Честь превыше всего', color: '#4527a0'
    },
    blackwood: {
        id: 'blackwood', name: 'Блэквуды', sigil: '🌳', region: 'riverlands', type: 'independent',
        castle: 'Блэквуд', castleId: 'blackwood', liege: null,
        motto: 'Древняя кровь', color: '#1a237e'
    },
    bracken: {
        id: 'bracken', name: 'Бракены', sigil: '🌿', region: 'riverlands', type: 'independent',
        castle: 'Бракен', castleId: 'bracken', liege: null,
        motto: 'Зелёная земля', color: '#827717'
    },
    darry: {
        id: 'darry', name: 'Дарри', sigil: '🦁', region: 'riverlands', type: 'independent',
        castle: 'Дарри', castleId: 'darry', liege: null,
        motto: 'Верность льву', color: '#f57c00'
    },
    vance: {
        id: 'vance', name: 'Вэнсы', sigil: '🗡️', region: 'riverlands', type: 'independent',
        castle: 'Вэнс', castleId: 'vance', liege: null,
        motto: 'Острый клинок', color: '#bdbdbd'
    },
    piper: {
        id: 'piper', name: 'Пайперы', sigil: '🎵', region: 'riverlands', type: 'independent',
        castle: 'Пайпер', castleId: 'piper', liege: null,
        motto: 'Мелодия и сталь', color: '#e65100'
    },
    root: {
        id: 'root', name: 'Руты', sigil: '🌱', region: 'riverlands', type: 'independent',
        castle: 'Рут', castleId: 'root', liege: null,
        motto: 'Корни сильны', color: '#66bb6a'
    },
    shawney: {
        id: 'shawney', name: 'Шоуни', sigil: '⚔️', region: 'riverlands', type: 'independent',
        castle: 'Шоуни', castleId: 'shawney', liege: null,
        motto: 'Меч и щит', color: '#8d6e63'
    },
    lychester: {
        id: 'lychester', name: 'Линчестеры', sigil: '🏹', region: 'riverlands', type: 'independent',
        castle: 'Линчестер', castleId: 'lychester', liege: null,
        motto: 'Меткий выстрел', color: '#5d4037'
    },
    terrick: {
        id: 'terrick', name: 'Террики', sigil: '🌾', region: 'riverlands', type: 'independent',
        castle: 'Террик', castleId: 'terrick', liege: null,
        motto: 'Зерно и честь', color: '#f9a825'
    },

    // ============================================================
    // 5. ШТОРМОВЫЕ ЗЕМЛИ (The Stormlands) — 12 домов
    // ============================================================
    baratheon: {
        id: 'baratheon', name: 'Баратеоны', sigil: '🦌', region: 'stormlands', type: 'independent',
        castle: 'Штормовой Предел', castleId: 'storms_end', liege: null,
        motto: 'Ярость и буря.', color: '#1e272e'
    },
    connington: {
        id: 'connington', name: 'Коннингтоны', sigil: '🦅', region: 'stormlands', type: 'independent',
        castle: 'Гнездо Грифона', castleId: 'griffins_roost', liege: null,
        motto: 'Грифон не сдаётся', color: '#b71c1c'
    },
    swann: {
        id: 'swann', name: 'Сванны', sigil: '🦢', region: 'stormlands', type: 'independent',
        castle: 'Каменный Шлем', castleId: 'stone_helm', liege: null,
        motto: 'Честь и верность', color: '#eceff1'
    },
    dondarrion: {
        id: 'dondarrion', name: 'Дондаррионы', sigil: '⚡', region: 'stormlands', type: 'independent',
        castle: 'Чёрная Крепость', castleId: 'black_keep', liege: null,
        motto: 'Молния и гром', color: '#7c4dff'
    },
    grandison: {
        id: 'grandison', name: 'Грандисоны', sigil: '🦁', region: 'stormlands', type: 'independent',
        castle: 'Грандвью', castleId: 'grandview', liege: null,
        motto: 'Бодрствуй и охраняй', color: '#ffab00'
    },
    caron: {
        id: 'caron', name: 'Карроны', sigil: '🎵', region: 'stormlands', type: 'independent',
        castle: 'Каррон', castleId: 'caron', liege: null,
        motto: 'Песня и сталь', color: '#ff6e40'
    },
    selmy: {
        id: 'selmy', name: 'Селми', sigil: '🛡️', region: 'stormlands', type: 'independent',
        castle: 'Селми', castleId: 'selmy', liege: null,
        motto: 'Честь и долг', color: '#3e2723'
    },
    trant: {
        id: 'trant', name: 'Транты', sigil: '⚔️', region: 'stormlands', type: 'independent',
        castle: 'Трант', castleId: 'trant', liege: null,
        motto: 'Меч и щит', color: '#616161'
    },
    morrigan: {
        id: 'morrigan', name: 'Морригены', sigil: '🐦‍⬛', region: 'stormlands', type: 'independent',
        castle: 'Морриген', castleId: 'morrigan', liege: null,
        motto: 'Тень и клюв', color: '#263238'
    },
    staunton: {
        id: 'staunton', name: 'Стаунтоны', sigil: '🪨', region: 'stormlands', type: 'independent',
        castle: 'Стаунтон', castleId: 'staunton', liege: null,
        motto: 'Крепче скалы', color: '#8d6e63'
    },
    buckler: {
        id: 'buckler', name: 'Баклеры', sigil: '🛡️', region: 'stormlands', type: 'independent',
        castle: 'Бронзовый Щит', castleId: 'buckler', liege: null,
        motto: 'Щит и честь', color: '#cd7f32'
    },
    errol: {
        id: 'errol', name: 'Эрролы', sigil: '🦅', region: 'stormlands', type: 'independent',
        castle: 'Эррол', castleId: 'errol', liege: null,
        motto: 'Орёл и гром', color: '#ffd54f'
    },

    // ============================================================
    // 6. ДОРН (Dorne) — 11 домов
    // ============================================================
    martell: {
        id: 'martell', name: 'Мартеллы', sigil: '☀️', region: 'dorne', type: 'independent',
        castle: 'Солнечное Копьё', castleId: 'sunspear', liege: null,
        motto: 'Непокорённые.', color: '#e65100'
    },
    dayne: {
        id: 'dayne', name: 'Дейны', sigil: '⭐', region: 'dorne', type: 'independent',
        castle: 'Звездопад', castleId: 'starfall', liege: null,
        motto: 'Свет звезды', color: '#c6ff00'
    },
    yronwood: {
        id: 'yronwood', name: 'Йронвуды', sigil: '🦂', region: 'dorne', type: 'independent',
        castle: 'Йронвуд', castleId: 'yronwood', liege: null,
        motto: 'Скорпион и песок', color: '#ff6d00'
    },
    manwoody: {
        id: 'manwoody', name: 'Мэнвуды', sigil: '🏔️', region: 'dorne', type: 'independent',
        castle: 'Мэнвуди', castleId: 'manwoody', liege: null,
        motto: 'Гора и честь', color: '#a1887f'
    },
    santagar: {
        id: 'santagar', name: 'Сантагары', sigil: '🌵', region: 'dorne', type: 'independent',
        castle: 'Сантагар', castleId: 'santagar', liege: null,
        motto: 'Пустыня и сталь', color: '#8bc34a'
    },
    gargalen: {
        id: 'gargalen', name: 'Гаргалены', sigil: '🐍', region: 'dorne', type: 'independent',
        castle: 'Гаргален', castleId: 'gargalen', liege: null,
        motto: 'Змея и яд', color: '#64dd17'
    },
    uller: {
        id: 'uller', name: 'Уллеры', sigil: '🌵', region: 'dorne', type: 'independent',
        castle: 'Уллер', castleId: 'uller', liege: null,
        motto: 'Колючка и песок', color: '#76ff03'
    },
    fowler: {
        id: 'fowler', name: 'Фаулеры', sigil: '🦅', region: 'dorne', type: 'independent',
        castle: 'Фаулер', castleId: 'fowler', liege: null,
        motto: 'Орёл и солнце', color: '#ffd600'
    },
    blackmont: {
        id: 'blackmont', name: 'Блэкмонты', sigil: '🏔️', region: 'dorne', type: 'independent',
        castle: 'Блэкмонт', castleId: 'blackmont', liege: null,
        motto: 'Чёрная гора', color: '#3e2723'
    },
    dalt: {
        id: 'dalt', name: 'Далты', sigil: '🌊', region: 'dorne', type: 'independent',
        castle: 'Далт', castleId: 'dalt', liege: null,
        motto: 'Море и песок', color: '#00838f'
    },
    jordayne: {
        id: 'jordayne', name: 'Джордайны', sigil: '🌊', region: 'dorne', type: 'independent',
        castle: 'Джордайн', castleId: 'jordayne', liege: null,
        motto: 'Волна и честь', color: '#006064'
    },

    // ============================================================
    // 7. ДОЛИНА (The Vale) — 10 домов
    // ============================================================
    arryn: {
        id: 'arryn', name: 'Аррены', sigil: '🦅', region: 'vale', type: 'independent',
        castle: 'Орлиное Гнездо', castleId: 'eyrie', liege: null,
        motto: 'Высоко как честь.', color: '#90caf9'
    },
    royce: {
        id: 'royce', name: 'Ройсы', sigil: '🪨', region: 'vale', type: 'independent',
        castle: 'Рунный Камень', castleId: 'runestone', liege: null,
        motto: 'Древняя память', color: '#6d4c41'
    },
    hunter: {
        id: 'hunter', name: 'Хантеры', sigil: '🏹', region: 'vale', type: 'independent',
        castle: 'Хантер', castleId: 'hunter', liege: null,
        motto: 'Меткий выстрел', color: '#81c784'
    },
    redfort: {
        id: 'redfort', name: 'Редфорты', sigil: '🔴', region: 'vale', type: 'independent',
        castle: 'Редфорт', castleId: 'redfort', liege: null,
        motto: 'Красная крепость', color: '#d50000'
    },
    waynwood: {
        id: 'waynwood', name: 'Вейнвуды', sigil: '🌿', region: 'vale', type: 'independent',
        castle: 'Вейнвуд', castleId: 'waynwood', liege: null,
        motto: 'Зелёная долина', color: '#69f0ae'
    },
    corbray: {
        id: 'corbray', name: 'Корбрэи', sigil: '🗡️', region: 'vale', type: 'independent',
        castle: 'Корбрэй', castleId: 'corbray', liege: null,
        motto: 'Острый клинок', color: '#cfd8dc'
    },
    belmore: {
        id: 'belmore', name: 'Белморы', sigil: '🛡️', region: 'vale', type: 'independent',
        castle: 'Белмор', castleId: 'belmore', liege: null,
        motto: 'Щит и честь', color: '#4e342e'
    },
    eyon: {
        id: 'eyon', name: 'Эйоны', sigil: '🦅', region: 'vale', type: 'independent',
        castle: 'Эйон', castleId: 'eyon', liege: null,
        motto: 'Орёл и скала', color: '#78909c'
    },
    hardy: {
        id: 'hardy', name: 'Харди', sigil: '⛰️', region: 'vale', type: 'independent',
        castle: 'Харди', castleId: 'hardy', liege: null,
        motto: 'Твёрдый как камень', color: '#9e9e9e'
    },
    melcolm: {
        id: 'melcolm', name: 'Мелкомбы', sigil: '🏔️', region: 'vale', type: 'independent',
        castle: 'Мелкомб', castleId: 'melcolm', liege: null,
        motto: 'Гора и честь', color: '#8d6e63'
    },

    // ============================================================
    // 8. ЖЕЛЕЗНЫЕ ОСТРОВА (The Iron Islands) — 11 домов
    // ============================================================
    greyjoy: {
        id: 'greyjoy', name: 'Грейджои', sigil: '🐙', region: 'iron_islands', type: 'independent',
        castle: 'Пайк', castleId: 'pyke', liege: null,
        motto: 'Мы не сеем.', color: '#111111'
    },
    harlaw: {
        id: 'harlaw', name: 'Харлоу', sigil: '📖', region: 'iron_islands', type: 'independent',
        castle: 'Харлоу', castleId: 'harlaw_rock', liege: null,
        motto: 'Мудрость сильнее стали', color: '#5e35b1'
    },
    blacktyde: {
        id: 'blacktyde', name: 'Блэктайды', sigil: '🌑', region: 'iron_islands', type: 'independent',
        castle: 'Блэктайд', castleId: 'blacktyde', liege: null,
        motto: 'Тёмная волна', color: '#1a1a1a'
    },
    goodbrother: {
        id: 'goodbrother', name: 'Гудбразеры', sigil: '🐗', region: 'iron_islands', type: 'independent',
        castle: 'Гудбразер', castleId: 'goodbrother', liege: null,
        motto: 'Сила и кабан', color: '#4e342e'
    },
    botley: {
        id: 'botley', name: 'Ботли', sigil: '⚓', region: 'iron_islands', type: 'independent',
        castle: 'Ботли', castleId: 'botley', liege: null,
        motto: 'Море и якорь', color: '#0277bd'
    },
    saltcliffe: {
        id: 'saltcliffe', name: 'Солтклиффы', sigil: '🧂', region: 'iron_islands', type: 'independent',
        castle: 'Солтклифф', castleId: 'saltcliffe', liege: null,
        motto: 'Соль и сталь', color: '#f5f5f5'
    },
    drumm: {
        id: 'drumm', name: 'Драммы', sigil: '🥁', region: 'iron_islands', type: 'independent',
        castle: 'Драмм', castleId: 'drumm', liege: null,
        motto: 'Барабан и волна', color: '#bf360c'
    },
    merryn: {
        id: 'merryn', name: 'Меррины', sigil: '🌊', region: 'iron_islands', type: 'independent',
        castle: 'Меррин', castleId: 'merryn', liege: null,
        motto: 'Морская пена', color: '#00695c'
    },
    kenning: {
        id: 'kenning', name: 'Кеннинги', sigil: '⚔️', region: 'iron_islands', type: 'independent',
        castle: 'Кеннинг', castleId: 'kenning', liege: null,
        motto: 'Меч и море', color: '#3e2723'
    },
    stonehouse: {
        id: 'stonehouse', name: 'Стоунхаусы', sigil: '🪨', region: 'iron_islands', type: 'independent',
        castle: 'Стоунхаус', castleId: 'stonehouse', liege: null,
        motto: 'Камень и море', color: '#5d4037'
    },
    orkwood: {
        id: 'orkwood', name: 'Орквуды', sigil: '🌳', region: 'iron_islands', type: 'independent',
        castle: 'Орквуд', castleId: 'orkwood', liege: null,
        motto: 'Дерево и волна', color: '#33691e'
    }
};

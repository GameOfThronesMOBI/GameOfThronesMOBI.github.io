// ============================================================
// КОРОЛЕВСКАЯ ГАВАНЬ — СЕТКА ПЕРЕХОДОВ
// ============================================================

const KL_TRANSITIONS = {
    // ===== ЗАМОК (центр) =====
    'kings_landing': {
        n: 'kl_n_1',
        ne: 'kl_ne_1',
        e: null,          // море
        se: null,         // море
        s: 'kl_s_1',
        sw: 'kl_sw_1',
        w: null,          // море
        nw: 'kl_nw_1'
    },

    // ===== 1-е КОЛЬЦО =====

    // Север (n1)
    'kl_n_1': {
        n: 'kl_n_2',
        ne: 'kl_ne_1',
        e: null,
        se: null,
        s: 'kings_landing',
        sw: null,
        w: 'kl_nw_1',
        nw: 'kl_nw_2'
    },

    // Северо-восток (ne1)
    'kl_ne_1': {
        n: 'kl_ne_2',
        ne: 'kl_ne_2',
        e: null,
        se: null,
        s: null,
        sw: 'kings_landing',
        w: 'kl_n_1',
        nw: 'kl_n_2'
    },

    // Северо-запад (nw1)
    'kl_nw_1': {
        n: 'kl_nw_2',
        ne: 'kl_n_1',
        e: null,
        se: 'kings_landing',
        s: null,
        sw: null,
        w: null,
        nw: 'kl_nw_2'
    },

    // Юг (s1)
    'kl_s_1': {
        n: 'kings_landing',
        ne: null,
        e: null,
        se: null,
        s: 'kl_s_2',
        sw: 'kl_sw_1',
        w: null,
        nw: null
    },

    // Юго-запад (sw1)
    'kl_sw_1': {
        n: null,
        ne: 'kings_landing',
        e: null,
        se: 'kl_s_2',
        s: 'kl_sw_2',
        sw: 'kl_sw_2',
        w: null,
        nw: null
    },

    // ===== 2-е КОЛЬЦО =====

    // Север (n2)
    'kl_n_2': {
        n: 'kl_n_3',
        ne: 'kl_ne_2',
        e: null,
        se: null,
        s: 'kl_n_1',
        sw: null,
        w: 'kl_nw_2',
        nw: 'kl_nw_3'
    },

    // Северо-восток (ne2)
    'kl_ne_2': {
        n: 'kl_ne_3',
        ne: 'kl_ne_3',
        e: null,
        se: null,
        s: null,
        sw: 'kl_ne_1',
        w: 'kl_n_2',
        nw: 'kl_n_3'
    },

    // Северо-запад (nw2)
    'kl_nw_2': {
        n: 'kl_nw_3',
        ne: 'kl_n_2',
        e: null,
        se: 'kl_nw_1',
        s: null,
        sw: null,
        w: null,
        nw: 'kl_nw_3'
    },

    // Юг (s2)
    'kl_s_2': {
        n: 'kl_s_1',
        ne: null,
        e: null,
        se: null,
        s: 'kl_s_3',
        sw: 'kl_sw_2',
        w: null,
        nw: null
    },

    // Юго-запад (sw2)
    'kl_sw_2': {
        n: null,
        ne: 'kl_sw_1',
        e: null,
        se: 'kl_s_3',
        s: 'kl_sw_3',
        sw: 'kl_sw_3',
        w: null,
        nw: null
    },

    // ===== 3-е КОЛЬЦО =====

    // Север (n3) — граница
    'kl_n_3': {
        n: 'riverlands',     // выход в Речные земли
        ne: 'kl_ne_3',
        e: null,
        se: null,
        s: 'kl_n_2',
        sw: null,
        w: 'kl_nw_3',
        nw: 'kl_nw_4'
    },

    // Северо-восток (ne3) — граница
    'kl_ne_3': {
        n: 'kl_ne_4',
        ne: 'kl_ne_4',
        e: null,
        se: null,
        s: null,
        sw: 'kl_ne_2',
        w: 'kl_n_3',
        nw: 'kl_n_4'
    },

    // Северо-запад (nw3) — граница
    'kl_nw_3': {
        n: 'kl_nw_4',
        ne: 'kl_n_3',
        e: null,
        se: 'kl_nw_2',
        s: null,
        sw: null,
        w: null,
        nw: 'kl_nw_4'
    },

    // Юг (s3) — граница
    'kl_s_3': {
        n: 'kl_s_2',
        ne: null,
        e: null,
        se: null,
        s: 'stormlands',     // выход в Штормовые земли
        sw: 'kl_sw_3',
        w: null,
        nw: null
    },

    // Юго-запад (sw3) — граница
    'kl_sw_3': {
        n: null,
        ne: 'kl_sw_2',
        e: null,
        se: 'kl_s_4',
        s: 'reach',          // выход в Простор
        sw: 'kl_sw_4',
        w: null,
        nw: null
    },

    // ===== 4-е КОЛЬЦО (только для ne и nw — берег/лес) =====

    // Северо-восток (ne4)
    'kl_ne_4': {
        n: 'kl_ne_5',
        ne: 'kl_ne_5',
        e: null,
        se: null,
        s: null,
        sw: 'kl_ne_3',
        w: null,
        nw: null
    },

    // Северо-запад (nw4)
    'kl_nw_4': {
        n: 'kl_nw_5',
        ne: null,
        e: null,
        se: 'kl_nw_3',
        s: null,
        sw: null,
        w: null,
        nw: 'kl_nw_5'
    },

    // ===== 5-е КОЛЬЦО (только для ne и nw) =====

    // Северо-восток (ne5)
    'kl_ne_5': {
        n: 'kl_ne_6',
        ne: 'kl_ne_6',
        e: null,
        se: null,
        s: null,
        sw: 'kl_ne_4',
        w: null,
        nw: null
    },

    // Северо-запад (nw5)
    'kl_nw_5': {
        n: 'kl_nw_6',
        ne: null,
        e: null,
        se: 'kl_nw_4',
        s: null,
        sw: null,
        w: null,
        nw: 'kl_nw_6'
    },

    // ===== 6-е КОЛЬЦО (только для ne и nw) — тупики =====

    // Северо-восток (ne6) — тупик
    'kl_ne_6': {
        sw: 'kl_ne_5'
        // дальше море
    },

    // Северо-запад (nw6) — тупик
    'kl_nw_6': {
        se: 'kl_nw_5'
        // дальше лес
    }
};

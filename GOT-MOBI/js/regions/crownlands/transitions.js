var KL_TRANSITIONS = {
    // ===== ПЕРЕКРЁСТОК =====
    'kl_crossroads': {
        n: 'kl_n_1',
        ne: 'kl_ne_1',
        nw: 'kl_nw_1',
        s: 'kl_s_1',
        sw: 'kl_sw_1'
        // e, se, w — море/город
    },

    // ===== СЕВЕР (дорога, 8 направлений) =====
    'kl_n_1': {
        n: 'kl_n_2',
        s: 'kl_crossroads',
        ne: 'kl_ne_1',
        nw: 'kl_nw_1',
        e: null,
        w: null,
        se: null,
        sw: null
    },
    'kl_n_2': {
        n: 'kl_n_3',
        s: 'kl_n_1',
        ne: 'kl_ne_2',
        nw: 'kl_nw_2',
        e: null,
        w: null,
        se: null,
        sw: null
    },
    'kl_n_3': {
        n: 'kl_n_4',
        s: 'kl_n_2',
        ne: 'kl_ne_3',
        nw: 'kl_nw_3',
        e: null,
        w: null,
        se: null,
        sw: null
    },
    'kl_n_4': {
        n: 'riverlands',
        s: 'kl_n_3',
        ne: 'kl_ne_4',
        nw: 'kl_nw_4',
        e: null,
        w: null,
        se: null,
        sw: null
    },

    // ===== СЕВЕРО-ВОСТОК (берег, только 5 направлений) =====
    'kl_ne_1': {
        ne: 'kl_ne_2',
        sw: 'kl_crossroads',
        n: 'kl_n_1',
        s: 'kl_s_1',
        nw: 'kl_n_2'
        // e, se, w — море
    },
    'kl_ne_2': {
        ne: 'kl_ne_3',
        sw: 'kl_ne_1',
        n: 'kl_n_2',
        s: 'kl_s_2',
        nw: 'kl_n_3'
    },
    'kl_ne_3': {
        ne: 'kl_ne_4',
        sw: 'kl_ne_2',
        n: 'kl_n_3',
        s: 'kl_s_3',
        nw: 'kl_n_4'
    },
    'kl_ne_4': {
        ne: 'kl_ne_5',
        sw: 'kl_ne_3',
        n: 'kl_n_4',
        s: 'kl_s_4',
        nw: 'kl_n_5'
    },
    'kl_ne_5': {
        ne: 'kl_ne_6',
        sw: 'kl_ne_4'
    },
    'kl_ne_6': {
        sw: 'kl_ne_5'
    },

    // ===== СЕВЕРО-ЗАПАД (лес, 8 направлений) =====
    'kl_nw_1': {
        n: 'kl_nw_2',
        s: 'kl_s_1',
        ne: 'kl_n_1',
        nw: 'kl_nw_2',
        e: 'kl_n_1',
        w: null,
        se: 'kl_crossroads',
        sw: null
    },
    'kl_nw_2': {
        n: 'kl_nw_3',
        s: 'kl_s_2',
        ne: 'kl_n_2',
        nw: 'kl_nw_3',
        e: 'kl_n_2',
        w: null,
        se: 'kl_nw_1',
        sw: null
    },
    'kl_nw_3': {
        n: 'kl_nw_4',
        s: 'kl_s_3',
        ne: 'kl_n_3',
        nw: 'kl_nw_4',
        e: 'kl_n_3',
        w: null,
        se: 'kl_nw_2',
        sw: null
    },
    'kl_nw_4': {
        n: 'kl_nw_5',
        s: 'kl_s_4',
        ne: 'kl_n_4',
        nw: 'kl_nw_5',
        e: 'kl_n_4',
        w: null,
        se: 'kl_nw_3',
        sw: null
    },
    'kl_nw_5': {
        nw: 'kl_nw_6',
        se: 'kl_nw_4'
    },
    'kl_nw_6': {
        se: 'kl_nw_5'
    },

    // ===== ЮГ (дорога, 8 направлений) =====
    'kl_s_1': {
        n: 'kl_crossroads',
        s: 'kl_s_2',
        ne: 'kl_ne_1',
        nw: 'kl_nw_1',
        e: 'kl_ne_1',
        w: 'kl_nw_1',
        se: null,
        sw: 'kl_sw_1'
    },
    'kl_s_2': {
        n: 'kl_s_1',
        s: 'kl_s_3',
        ne: 'kl_ne_2',
        nw: 'kl_nw_2',
        e: 'kl_ne_2',
        w: 'kl_nw_2',
        se: null,
        sw: 'kl_sw_2'
    },
    'kl_s_3': {
        n: 'kl_s_2',
        s: 'kl_s_4',
        ne: 'kl_ne_3',
        nw: 'kl_nw_3',
        e: 'kl_ne_3',
        w: 'kl_nw_3',
        se: null,
        sw: 'kl_sw_3'
    },
    'kl_s_4': {
        n: 'kl_s_3',
        s: 'stormlands',
        ne: 'kl_ne_4',
        nw: 'kl_nw_4',
        e: 'kl_ne_4',
        w: 'kl_nw_4',
        se: null,
        sw: 'kl_sw_4'
    },

    // ===== ЮГО-ЗАПАД (дорога, 8 направлений) =====
    'kl_sw_1': {
        n: 'kl_n_1',
        s: 'kl_sw_2',
        ne: 'kl_crossroads',
        nw: 'kl_s_1',
        e: 'kl_s_1',
        w: null,
        se: 'kl_s_2',
        sw: 'kl_sw_2'
    },
    'kl_sw_2': {
        n: 'kl_n_2',
        s: 'kl_sw_3',
        ne: 'kl_sw_1',
        nw: 'kl_s_2',
        e: 'kl_s_2',
        w: null,
        se: 'kl_s_3',
        sw: 'kl_sw_3'
    },
    'kl_sw_3': {
        n: 'kl_n_3',
        s: 'kl_sw_4',
        ne: 'kl_sw_2',
        nw: 'kl_s_3',
        e: 'kl_s_3',
        w: null,
        se: 'kl_s_4',
        sw: 'kl_sw_4'
    },
    'kl_sw_4': {
        n: 'kl_n_4',
        s: 'reach',
        ne: 'kl_sw_3',
        nw: 'kl_s_4',
        e: 'kl_s_4',
        w: null,
        se: 'kl_s_5',
        sw: 'reach'
    }
};

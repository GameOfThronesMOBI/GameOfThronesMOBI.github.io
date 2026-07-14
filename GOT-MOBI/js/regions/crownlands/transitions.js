var KL_TRANSITIONS = {
    'kl_crossroads': {
        n: 'kl_n_1', ne: 'kl_ne_1', e: null, se: 'kl_se_1',
        s: 'kl_s_1', sw: 'kl_sw_1', w: 'kl_w_1', nw: 'kl_nw_1'
    },

    // ⬆️ СЕВЕРНАЯ ДОРОГА
    'kl_n_1': { n:'kl_n_2', s:'kl_crossroads', ne:'kl_ne_1', nw:'kl_nw_1' },
    'kl_n_2': { n:'kl_n_3', s:'kl_n_1', ne:'kl_ne_2', nw:'kl_nw_2' },
    'kl_n_3': { n:'kl_n_4', s:'kl_n_2', ne:'kl_ne_3', nw:'kl_nw_3' },
    'kl_n_4': { n:null, s:'kl_n_3', ne:'kl_ne_4', nw:'kl_nw_4' },

    // ↗️ СЕВЕРО-ВОСТОЧНЫЙ БЕРЕГ
    'kl_ne_1': { n:'kl_ne_2', s:'kl_crossroads', sw:'kl_n_1', w:'kl_n_1', nw:'kl_n_1' },
    'kl_ne_2': { n:'kl_ne_3', s:'kl_ne_1', sw:'kl_n_2', w:'kl_n_2', nw:'kl_n_2' },
    'kl_ne_3': { n:'kl_ne_4', s:'kl_ne_2', sw:'kl_n_3', w:'kl_n_3', nw:'kl_n_3' },
    'kl_ne_4': { n:null, s:'kl_ne_3', sw:'kl_n_4', w:'kl_n_4', nw:'kl_n_4' },

    // ↘️ ЮГО-ВОСТОЧНЫЙ БЕРЕГ
    'kl_se_1': { se:'kl_se_2', s:'kl_se_2', n:'kl_crossroads', nw:'kl_crossroads', sw:'kl_s_1', w:'kl_s_1' },
    'kl_se_2': { se:'kl_se_3', s:'kl_se_3', n:'kl_se_1', nw:'kl_se_1', sw:'kl_s_2', w:'kl_s_2' },
    'kl_se_3': { se:'kl_se_4', s:'kl_se_4', n:'kl_se_2', nw:'kl_se_2', sw:'kl_s_3', w:'kl_s_3' },
    'kl_se_4': { se:null, s:null, n:'kl_se_3', nw:'kl_se_3', sw:'kl_s_4', w:'kl_s_4' },

    // ⬇️ ЮЖНАЯ ДОРОГА
    'kl_s_1': { s:'kl_s_2', n:'kl_crossroads', ne:'kl_se_1', e:'kl_se_1', se:'kl_se_1', sw:'kl_sw_1', w:'kl_sw_1', nw:'kl_crossroads' },
    'kl_s_2': { s:'kl_s_3', n:'kl_s_1', ne:'kl_se_2', e:'kl_se_2', se:'kl_se_2', sw:'kl_sw_2', w:'kl_sw_2', nw:'kl_s_1' },
    'kl_s_3': { s:'kl_s_4', n:'kl_s_2', ne:'kl_se_3', e:'kl_se_3', se:'kl_se_3', sw:'kl_sw_3', w:'kl_sw_3', nw:'kl_s_2' },
    'kl_s_4': { s:null, n:'kl_s_3', ne:'kl_se_4', e:'kl_se_4', se:'kl_se_4', sw:'kl_sw_4', w:'kl_sw_4', nw:'kl_s_3' },

    // ↙️ ЮГО-ЗАПАДНАЯ РЕКА
    'kl_sw_1': { sw:'kl_sw_2', s:'kl_sw_2', n:'kl_crossroads', ne:'kl_s_1', e:'kl_s_1', se:'kl_s_1', w:'kl_w_1', nw:'kl_crossroads' },
    'kl_sw_2': { sw:'kl_sw_3', s:'kl_sw_3', n:'kl_sw_1', ne:'kl_s_2', e:'kl_s_2', se:'kl_s_2', w:'kl_w_2', nw:'kl_sw_1' },
    'kl_sw_3': { sw:'kl_sw_4', s:'kl_sw_4', n:'kl_sw_2', ne:'kl_s_3', e:'kl_s_3', se:'kl_s_3', w:'kl_w_3', nw:'kl_sw_2' },
    'kl_sw_4': { sw:null, s:null, n:'kl_sw_3', ne:'kl_s_4', e:'kl_s_4', se:'kl_s_4', w:'kl_w_4', nw:'kl_sw_3' },

    // ⬅️ ЗАПАДНАЯ ДОРОГА
    'kl_w_1': { w:'kl_w_2', s:'kl_w_2', n:'kl_nw_1', ne:'kl_sw_1', e:'kl_sw_1', se:'kl_crossroads', nw:'kl_nw_1' },
    'kl_w_2': { w:'kl_w_3', s:'kl_w_3', n:'kl_nw_2', ne:'kl_sw_2', e:'kl_sw_2', se:'kl_w_1', nw:'kl_nw_2' },
    'kl_w_3': { w:'kl_w_4', s:'kl_w_4', n:'kl_nw_3', ne:'kl_sw_3', e:'kl_sw_3', se:'kl_w_2', nw:'kl_nw_3' },
    'kl_w_4': { w:null, s:null, n:'kl_nw_4', ne:'kl_sw_4', e:'kl_sw_4', se:'kl_w_3', nw:'kl_nw_4' },

    // ↖️ СЕВЕРО-ЗАПАДНЫЙ ЛЕС
    'kl_nw_1': { nw:'kl_nw_2', n:'kl_nw_2', s:'kl_w_1', ne:'kl_n_1', e:'kl_n_1', se:'kl_crossroads', sw:'kl_w_1' },
    'kl_nw_2': { nw:'kl_nw_3', n:'kl_nw_3', s:'kl_w_2', ne:'kl_n_2', e:'kl_n_2', se:'kl_nw_1', sw:'kl_w_2' },
    'kl_nw_3': { nw:'kl_nw_4', n:'kl_nw_4', s:'kl_w_3', ne:'kl_n_3', e:'kl_n_3', se:'kl_nw_2', sw:'kl_w_3' },
    'kl_nw_4': { nw:null, n:null, s:'kl_w_4', ne:'kl_n_4', e:'kl_n_4', se:'kl_nw_3', sw:'kl_w_4' }
};

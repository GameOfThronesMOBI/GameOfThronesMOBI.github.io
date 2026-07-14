var KL_TRANSITIONS = {
    'kl_crossroads': { n:'kl_n_1', ne:'kl_ne_1', se:'kl_se_1', s:'kl_s_1', sw:'kl_sw_1', w:'kl_w_1', nw:'kl_nw_1' },

    'kl_n_1': { n:'kl_n_2', s:'kl_crossroads' },
    'kl_n_2': { n:'kl_n_3', s:'kl_n_1' },
    'kl_n_3': { n:'kl_n_4', s:'kl_n_2' },
    'kl_n_4': { s:'kl_n_3' },

    'kl_ne_1': { n:'kl_ne_2', sw:'kl_crossroads' },
    'kl_ne_2': { n:'kl_ne_3', s:'kl_ne_1' },
    'kl_ne_3': { n:'kl_ne_4', s:'kl_ne_2' },
    'kl_ne_4': { s:'kl_ne_3' },

    'kl_se_1': { s:'kl_se_2', nw:'kl_crossroads' },
    'kl_se_2': { n:'kl_se_1', s:'kl_se_3' },
    'kl_se_3': { n:'kl_se_2', s:'kl_se_4' },
    'kl_se_4': { n:'kl_se_3' },

    'kl_s_1': { n:'kl_crossroads', s:'kl_s_2' },
    'kl_s_2': { n:'kl_s_1', s:'kl_s_3' },
    'kl_s_3': { n:'kl_s_2', s:'kl_s_4' },
    'kl_s_4': { n:'kl_s_3' },

    'kl_sw_1': { ne:'kl_crossroads', s:'kl_sw_2' },
    'kl_sw_2': { n:'kl_sw_1', s:'kl_sw_3' },
    'kl_sw_3': { n:'kl_sw_2', s:'kl_sw_4' },
    'kl_sw_4': { n:'kl_sw_3' },

    'kl_w_1': { e:'kl_crossroads', w:'kl_w_2' },
    'kl_w_2': { e:'kl_w_1', w:'kl_w_3' },
    'kl_w_3': { e:'kl_w_2', w:'kl_w_4' },
    'kl_w_4': { e:'kl_w_3' },

    'kl_nw_1': { se:'kl_crossroads', nw:'kl_nw_2' },
    'kl_nw_2': { se:'kl_nw_1', nw:'kl_nw_3' },
    'kl_nw_3': { se:'kl_nw_2', nw:'kl_nw_4' },
    'kl_nw_4': { se:'kl_nw_3' }
};

// ============================================================
// js/regions/stormlands/areas/buckler.js — 121 ЗОНА (11×11)
// Владения Баклеров. Стыковка с КЛ: y=5 (КЛ) → y=6 (Баклеры)
// Дорога: 0,6 → 0,7 → 0,8 → -1,9 → -1,10 → -1,11(ЗАМОК) → -1,12 → -1,13 → -1,14 → -1,15 → -1,16
// Горы: нижний левый угол (x=-5..-3, y=13..16; -2, y=15..16)
// Лес: верхний левый угол (x=-5..-1, y=6..10)
// Озеро: 2,9 3,9 2,10 3,10
// Берег: 5,6
// Шахта: -3,15
// Остальное: равнины + 3 деревни (3,12; 0,9; -3,11)
// ============================================================

const BUCKLER_AREAS = {

    // ==================== ЦЕНТР ====================
    'bl_0_0': { id:'bl_0_0', name:'Равнина', x:0, y:11, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },

    // ==================== РЯД y=6 (Север, стык с КЛ) ====================
    'bl_-5_-5': { id:'bl_-5_-5', name:'Лес', x:-5, y:6, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина','Шкура','Мясо'] },
    'bl_-4_-5': { id:'bl_-4_-5', name:'Лес', x:-4, y:6, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина','Шкура','Мясо'] },
    'bl_-3_-5': { id:'bl_-3_-5', name:'Лес', x:-3, y:6, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина','Шкура','Мясо'] },
    'bl_-2_-5': { id:'bl_-2_-5', name:'Лес', x:-2, y:6, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина','Шкура','Мясо'] },
    'bl_-1_-5': { id:'bl_-1_-5', name:'Лес', x:-1, y:6, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина','Шкура','Мясо'] },
    'bl_0_-5':  { id:'bl_0_-5', name:'Тракт', x:0, y:6, type:'road', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_1_-5':  { id:'bl_1_-5', name:'Равнина', x:1, y:6, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_2_-5':  { id:'bl_2_-5', name:'Равнина', x:2, y:6, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_3_-5':  { id:'bl_3_-5', name:'Равнина', x:3, y:6, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_4_-5':  { id:'bl_4_-5', name:'Равнина', x:4, y:6, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_5_-5':  { id:'bl_5_-5', name:'Берег', x:5, y:6, type:'coast', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'coast', resources:['Рыба','Соль'] },

    // ==================== РЯД y=7 ====================
    'bl_-5_-4': { id:'bl_-5_-4', name:'Лес', x:-5, y:7, type:'forest', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина','Шкура','Мясо'] },
    'bl_-4_-4': { id:'bl_-4_-4', name:'Лес', x:-4, y:7, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина','Шкура','Мясо'] },
    'bl_-3_-4': { id:'bl_-3_-4', name:'Лес', x:-3, y:7, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина','Шкура','Мясо'] },
    'bl_-2_-4': { id:'bl_-2_-4', name:'Лес', x:-2, y:7, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина','Шкура','Мясо'] },
    'bl_-1_-4': { id:'bl_-1_-4', name:'Равнина', x:-1, y:7, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_0_-4':  { id:'bl_0_-4', name:'Тракт', x:0, y:7, type:'road', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_1_-4':  { id:'bl_1_-4', name:'Равнина', x:1, y:7, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_2_-4':  { id:'bl_2_-4', name:'Равнина', x:2, y:7, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_3_-4':  { id:'bl_3_-4', name:'Равнина', x:3, y:7, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_4_-4':  { id:'bl_4_-4', name:'Равнина', x:4, y:7, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_5_-4':  { id:'bl_5_-4', name:'Равнина', x:5, y:7, type:'plain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },

    // ==================== РЯД y=8 ====================
    'bl_-5_-3': { id:'bl_-5_-3', name:'Лес', x:-5, y:8, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина','Шкура','Мясо'] },
    'bl_-4_-3': { id:'bl_-4_-3', name:'Лес', x:-4, y:8, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина','Шкура','Мясо'] },
    'bl_-3_-3': { id:'bl_-3_-3', name:'Лес', x:-3, y:8, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина','Шкура','Мясо'] },
    'bl_-2_-3': { id:'bl_-2_-3', name:'Равнина', x:-2, y:8, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_-1_-3': { id:'bl_-1_-3', name:'Равнина', x:-1, y:8, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_0_-3':  { id:'bl_0_-3', name:'Тракт', x:0, y:8, type:'road', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_1_-3':  { id:'bl_1_-3', name:'Равнина', x:1, y:8, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_2_-3':  { id:'bl_2_-3', name:'Равнина', x:2, y:8, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_3_-3':  { id:'bl_3_-3', name:'Равнина', x:3, y:8, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_4_-3':  { id:'bl_4_-3', name:'Равнина', x:4, y:8, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_5_-3':  { id:'bl_5_-3', name:'Равнина', x:5, y:8, type:'plain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },

    // ==================== РЯД y=9 ====================
    'bl_-5_-2': { id:'bl_-5_-2', name:'Лес', x:-5, y:9, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина','Шкура','Мясо'] },
    'bl_-4_-2': { id:'bl_-4_-2', name:'Лес', x:-4, y:9, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина','Шкура','Мясо'] },
    'bl_-3_-2': { id:'bl_-3_-2', name:'Равнина', x:-3, y:9, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_-2_-2': { id:'bl_-2_-2', name:'Равнина', x:-2, y:9, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_-1_-2': { id:'bl_-1_-2', name:'Тракт', x:-1, y:9, type:'road', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_0_-2':  { id:'bl_0_-2', name:'Равнина', x:0, y:9, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', places:['Деревня'], resources:['Пшеница','Овощи'] },
    'bl_1_-2':  { id:'bl_1_-2', name:'Равнина', x:1, y:9, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_2_-2':  { id:'bl_2_-2', name:'Озеро', x:2, y:9, type:'river', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'river', resources:['Рыба','Вода'] },
    'bl_3_-2':  { id:'bl_3_-2', name:'Озеро', x:3, y:9, type:'river', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'river', resources:['Рыба','Вода'] },
    'bl_4_-2':  { id:'bl_4_-2', name:'Равнина', x:4, y:9, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_5_-2':  { id:'bl_5_-2', name:'Равнина', x:5, y:9, type:'plain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },

    // ==================== РЯД y=10 ====================
    'bl_-5_-1': { id:'bl_-5_-1', name:'Лес', x:-5, y:10, type:'forest', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина','Шкура','Мясо'] },
    'bl_-4_-1': { id:'bl_-4_-1', name:'Равнина', x:-4, y:10, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_-3_-1': { id:'bl_-3_-1', name:'Равнина', x:-3, y:10, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_-2_-1': { id:'bl_-2_-1', name:'Равнина', x:-2, y:10, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_-1_-1': { id:'bl_-1_-1', name:'Тракт', x:-1, y:10, type:'road', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_0_-1':  { id:'bl_0_-1', name:'Равнина', x:0, y:10, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_1_-1':  { id:'bl_1_-1', name:'Равнина', x:1, y:10, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_2_-1':  { id:'bl_2_-1', name:'Озеро', x:2, y:10, type:'river', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'river', resources:['Рыба','Вода'] },
    'bl_3_-1':  { id:'bl_3_-1', name:'Озеро', x:3, y:10, type:'river', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'river', resources:['Рыба','Вода'] },
    'bl_4_-1':  { id:'bl_4_-1', name:'Равнина', x:4, y:10, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_5_-1':  { id:'bl_5_-1', name:'Равнина', x:5, y:10, type:'plain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },

    // ==================== РЯД y=11 (Центр + Замок) ====================
    'bl_-5_0': { id:'bl_-5_0', name:'Равнина', x:-5, y:11, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_-4_0': { id:'bl_-4_0', name:'Равнина', x:-4, y:11, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_-3_0': { id:'bl_-3_0', name:'Равнина', x:-3, y:11, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', places:['Деревня'], resources:['Пшеница','Овощи'] },
    'bl_-2_0': { id:'bl_-2_0', name:'Равнина', x:-2, y:11, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_-1_0': { id:'bl_-1_0', name:'Бронзовый Щит', x:-1, y:11, type:'castle', level:11, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_0_0':  { id:'bl_0_0', name:'Равнина', x:0, y:11, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_1_0':  { id:'bl_1_0', name:'Равнина', x:1, y:11, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_2_0':  { id:'bl_2_0', name:'Равнина', x:2, y:11, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_3_0':  { id:'bl_3_0', name:'Равнина', x:3, y:11, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_4_0':  { id:'bl_4_0', name:'Равнина', x:4, y:11, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_5_0':  { id:'bl_5_0', name:'Равнина', x:5, y:11, type:'plain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },

    // ==================== РЯД y=12 ====================
    'bl_-5_1': { id:'bl_-5_1', name:'Равнина', x:-5, y:12, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_-4_1': { id:'bl_-4_1', name:'Равнина', x:-4, y:12, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_-3_1': { id:'bl_-3_1', name:'Равнина', x:-3, y:12, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_-2_1': { id:'bl_-2_1', name:'Равнина', x:-2, y:12, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_-1_1': { id:'bl_-1_1', name:'Тракт', x:-1, y:12, type:'road', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_0_1':  { id:'bl_0_1', name:'Равнина', x:0, y:12, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_1_1':  { id:'bl_1_1', name:'Равнина', x:1, y:12, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_2_1':  { id:'bl_2_1', name:'Равнина', x:2, y:12, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_3_1':  { id:'bl_3_1', name:'Равнина', x:3, y:12, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', places:['Деревня'], resources:['Пшеница','Овощи'] },
    'bl_4_1':  { id:'bl_4_1', name:'Равнина', x:4, y:12, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_5_1':  { id:'bl_5_1', name:'Равнина', x:5, y:12, type:'plain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },

    // ==================== РЯД y=13 ====================
    'bl_-5_2': { id:'bl_-5_2', name:'Горы', x:-5, y:13, type:'mountain', level:8, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_-4_2': { id:'bl_-4_2', name:'Горы', x:-4, y:13, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_-3_2': { id:'bl_-3_2', name:'Горы', x:-3, y:13, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_-2_2': { id:'bl_-2_2', name:'Равнина', x:-2, y:13, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_-1_2': { id:'bl_-1_2', name:'Тракт', x:-1, y:13, type:'road', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_0_2':  { id:'bl_0_2', name:'Равнина', x:0, y:13, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_1_2':  { id:'bl_1_2', name:'Равнина', x:1, y:13, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_2_2':  { id:'bl_2_2', name:'Равнина', x:2, y:13, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_3_2':  { id:'bl_3_2', name:'Равнина', x:3, y:13, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_4_2':  { id:'bl_4_2', name:'Равнина', x:4, y:13, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_5_2':  { id:'bl_5_2', name:'Равнина', x:5, y:13, type:'plain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },

    // ==================== РЯД y=14 ====================
    'bl_-5_3': { id:'bl_-5_3', name:'Горы', x:-5, y:14, type:'mountain', level:8, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_-4_3': { id:'bl_-4_3', name:'Горы', x:-4, y:14, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_-3_3': { id:'bl_-3_3', name:'Горы', x:-3, y:14, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_-2_3': { id:'bl_-2_3', name:'Равнина', x:-2, y:14, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_-1_3': { id:'bl_-1_3', name:'Тракт', x:-1, y:14, type:'road', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_0_3':  { id:'bl_0_3', name:'Равнина', x:0, y:14, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_1_3':  { id:'bl_1_3', name:'Равнина', x:1, y:14, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_2_3':  { id:'bl_2_3', name:'Равнина', x:2, y:14, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_3_3':  { id:'bl_3_3', name:'Равнина', x:3, y:14, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_4_3':  { id:'bl_4_3', name:'Равнина', x:4, y:14, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_5_3':  { id:'bl_5_3', name:'Равнина', x:5, y:14, type:'plain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },

    // ==================== РЯД y=15 ====================
    'bl_-5_4': { id:'bl_-5_4', name:'Горы', x:-5, y:15, type:'mountain', level:8, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_-4_4': { id:'bl_-4_4', name:'Горы', x:-4, y:15, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_-3_4': { id:'bl_-3_4', name:'Шахта', x:-3, y:15, type:'mountain', level:8, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:[{name:'Камень',chance:80},{name:'Железная руда',chance:10},{name:'Уголь',chance:10}], places:['Шахта'] },
    'bl_-2_4': { id:'bl_-2_4', name:'Горы', x:-2, y:15, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_-1_4': { id:'bl_-1_4', name:'Тракт', x:-1, y:15, type:'road', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_0_4':  { id:'bl_0_4', name:'Равнина', x:0, y:15, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_1_4':  { id:'bl_1_4', name:'Равнина', x:1, y:15, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_2_4':  { id:'bl_2_4', name:'Равнина', x:2, y:15, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_3_4':  { id:'bl_3_4', name:'Равнина', x:3, y:15, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_4_4':  { id:'bl_4_4', name:'Равнина', x:4, y:15, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_5_4':  { id:'bl_5_4', name:'Равнина', x:5, y:15, type:'plain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },

    // ==================== РЯД y=16 (Юг) ====================
    'bl_-5_5': { id:'bl_-5_5', name:'Горы', x:-5, y:16, type:'mountain', level:8, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_-4_5': { id:'bl_-4_5', name:'Горы', x:-4, y:16, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_-3_5': { id:'bl_-3_5', name:'Горы', x:-3, y:16, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_-2_5': { id:'bl_-2_5', name:'Горы', x:-2, y:16, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_-1_5': { id:'bl_-1_5', name:'Тракт', x:-1, y:16, type:'road', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_0_5':  { id:'bl_0_5', name:'Равнина', x:0, y:16, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_1_5':  { id:'bl_1_5', name:'Равнина', x:1, y:16, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_2_5':  { id:'bl_2_5', name:'Равнина', x:2, y:16, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_3_5':  { id:'bl_3_5', name:'Равнина', x:3, y:16, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_4_5':  { id:'bl_4_5', name:'Равнина', x:4, y:16, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] },
    'bl_5_5':  { id:'bl_5_5', name:'Равнина', x:5, y:16, type:'plain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница','Овощи'] }
};

// Добавляем в глобальный мир
Object.assign(WORLD_AREAS, BUCKLER_AREAS);
buildWorldTransitions();

console.log('✅ Владения Баклеров загружены (121 зона, 11×11)');

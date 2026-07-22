// ============================================================
// js/regions/stormlands/areas/buckler.js — 121 ЗОНА (11×11)
// Владения Баклеров. Стыковка с КЛ: y=5 (КЛ) → y=6 (Баклеры)
// Дорога: 0,6 → 0,7 → 0,8 → -1,9 → -1,10 → -1,11(ЗАМОК) → -1,12 → -1,13 → -1,14 → -1,15 → -1,16
// ============================================================

const BUCKLER_AREAS = {

    // ==================== ЦЕНТР ====================
    'bl_0_0': { id:'bl_0_0', name:'Центральная равнина', x:0, y:11, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница'] },

    // ==================== РЯД y=6 (Север, стык с КЛ) ====================
    'bl_-5_-5': { id:'bl_-5_-5', name:'Северо-западный лес', x:-5, y:6, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-4_-5': { id:'bl_-4_-5', name:'Северная опушка', x:-4, y:6, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-3_-5': { id:'bl_-3_-5', name:'Северный лес', x:-3, y:6, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-2_-5': { id:'bl_-2_-5', name:'Северный ручей', x:-2, y:6, type:'river', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'river', resources:['Рыба','Вода'] },
    'bl_-1_-5': { id:'bl_-1_-5', name:'Северо-западная равнина', x:-1, y:6, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница'] },
    'bl_0_-5':  { id:'bl_0_-5', name:'Северный тракт', x:0, y:6, type:'road', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_1_-5':  { id:'bl_1_-5', name:'Северо-восточный холм', x:1, y:6, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_2_-5':  { id:'bl_2_-5', name:'Северо-восточные холмы', x:2, y:6, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_3_-5':  { id:'bl_3_-5', name:'Восточный холм', x:3, y:6, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень','Железная руда'] },
    'bl_4_-5':  { id:'bl_4_-5', name:'Восточная опушка', x:4, y:6, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_5_-5':  { id:'bl_5_-5', name:'Крайний восток', x:5, y:6, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },

    // ==================== РЯД y=7 ====================
    'bl_-5_-4': { id:'bl_-5_-4', name:'Западная чаща', x:-5, y:7, type:'forest', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-4_-4': { id:'bl_-4_-4', name:'Западный лес', x:-4, y:7, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-3_-4': { id:'bl_-3_-4', name:'Лес', x:-3, y:7, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-2_-4': { id:'bl_-2_-4', name:'Лес', x:-2, y:7, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-1_-4': { id:'bl_-1_-4', name:'Равнина', x:-1, y:7, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница'] },
    'bl_0_-4':  { id:'bl_0_-4', name:'Северный тракт 2', x:0, y:7, type:'road', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_1_-4':  { id:'bl_1_-4', name:'Холм', x:1, y:7, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_2_-4':  { id:'bl_2_-4', name:'Холмы', x:2, y:7, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_3_-4':  { id:'bl_3_-4', name:'Холм', x:3, y:7, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень','Железная руда'] },
    'bl_4_-4':  { id:'bl_4_-4', name:'Опушка', x:4, y:7, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_5_-4':  { id:'bl_5_-4', name:'Лес', x:5, y:7, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },

    // ==================== РЯД y=8 ====================
    'bl_-5_-3': { id:'bl_-5_-3', name:'Западный лес', x:-5, y:8, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-4_-3': { id:'bl_-4_-3', name:'Лес', x:-4, y:8, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-3_-3': { id:'bl_-3_-3', name:'Лес', x:-3, y:8, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-2_-3': { id:'bl_-2_-3', name:'Лес', x:-2, y:8, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-1_-3': { id:'bl_-1_-3', name:'Поле', x:-1, y:8, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница'] },
    'bl_0_-3':  { id:'bl_0_-3', name:'Северный тракт 3', x:0, y:8, type:'road', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_1_-3':  { id:'bl_1_-3', name:'Холм', x:1, y:8, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_2_-3':  { id:'bl_2_-3', name:'Холмы', x:2, y:8, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_3_-3':  { id:'bl_3_-3', name:'Шахта', x:3, y:8, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:[{name:'Камень',chance:60},{name:'Железная руда',chance:25},{name:'Уголь',chance:15}] },
    'bl_4_-3':  { id:'bl_4_-3', name:'Лес', x:4, y:8, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_5_-3':  { id:'bl_5_-3', name:'Лес', x:5, y:8, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },

    // ==================== РЯД y=9 ====================
    'bl_-5_-2': { id:'bl_-5_-2', name:'Западный лес', x:-5, y:9, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-4_-2': { id:'bl_-4_-2', name:'Лес', x:-4, y:9, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-3_-2': { id:'bl_-3_-2', name:'Лес', x:-3, y:9, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-2_-2': { id:'bl_-2_-2', name:'Ручей', x:-2, y:9, type:'river', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'river', resources:['Рыба','Вода'] },
    'bl_-1_-2': { id:'bl_-1_-2', name:'Дорога к замку', x:-1, y:9, type:'road', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_0_-2':  { id:'bl_0_-2', name:'Подножие холма', x:0, y:9, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень','Железная руда'] },
    'bl_1_-2':  { id:'bl_1_-2', name:'Холм', x:1, y:9, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_2_-2':  { id:'bl_2_-2', name:'Холмы', x:2, y:9, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_3_-2':  { id:'bl_3_-2', name:'Холм', x:3, y:9, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень','Железная руда'] },
    'bl_4_-2':  { id:'bl_4_-2', name:'Лес', x:4, y:9, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_5_-2':  { id:'bl_5_-2', name:'Лес', x:5, y:9, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },

    // ==================== РЯД y=10 ====================
    'bl_-5_-1': { id:'bl_-5_-1', name:'Западный лес', x:-5, y:10, type:'forest', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-4_-1': { id:'bl_-4_-1', name:'Лес', x:-4, y:10, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-3_-1': { id:'bl_-3_-1', name:'Лес', x:-3, y:10, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-2_-1': { id:'bl_-2_-1', name:'Деревня', x:-2, y:10, type:'village', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', places:['Деревня'], resources:['Пшеница','Овощи'] },
    'bl_-1_-1': { id:'bl_-1_-1', name:'Дорога к замку', x:-1, y:10, type:'road', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_0_-1':  { id:'bl_0_-1', name:'Придорожная деревня', x:0, y:10, type:'village', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', places:['Деревня'], resources:['Пшеница','Овощи'] },
    'bl_1_-1':  { id:'bl_1_-1', name:'Холм', x:1, y:10, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_2_-1':  { id:'bl_2_-1', name:'Холмы', x:2, y:10, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_3_-1':  { id:'bl_3_-1', name:'Холм', x:3, y:10, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень','Железная руда'] },
    'bl_4_-1':  { id:'bl_4_-1', name:'Лес', x:4, y:10, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_5_-1':  { id:'bl_5_-1', name:'Лес', x:5, y:10, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },

    // ==================== РЯД y=11 (Центр + Замок) ====================
    'bl_-5_0': { id:'bl_-5_0', name:'Западная чаща', x:-5, y:11, type:'forest', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-4_0': { id:'bl_-4_0', name:'Лес', x:-4, y:11, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-3_0': { id:'bl_-3_0', name:'Лес', x:-3, y:11, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-2_0': { id:'bl_-2_0', name:'Лес', x:-2, y:11, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-1_0': { id:'bl_-1_0', name:'Замок Бронзовый Щит', x:-1, y:11, type:'castle', level:11, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_0_0':  { id:'bl_0_0', name:'Центральная равнина', x:0, y:11, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница'] },
    'bl_1_0':  { id:'bl_1_0', name:'Восточный холм', x:1, y:11, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_2_0':  { id:'bl_2_0', name:'Восточные холмы', x:2, y:11, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень','Железная руда'] },
    'bl_3_0':  { id:'bl_3_0', name:'Холм', x:3, y:11, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_4_0':  { id:'bl_4_0', name:'Лес', x:4, y:11, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_5_0':  { id:'bl_5_0', name:'Лес', x:5, y:11, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },

    // ==================== РЯД y=12 ====================
    'bl_-5_1': { id:'bl_-5_1', name:'Юго-западный лес', x:-5, y:12, type:'forest', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-4_1': { id:'bl_-4_1', name:'Лес', x:-4, y:12, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-3_1': { id:'bl_-3_1', name:'Лес', x:-3, y:12, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-2_1': { id:'bl_-2_1', name:'Лес', x:-2, y:12, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-1_1': { id:'bl_-1_1', name:'Южная дорога', x:-1, y:12, type:'road', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_0_1':  { id:'bl_0_1', name:'Равнина', x:0, y:12, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница'] },
    'bl_1_1':  { id:'bl_1_1', name:'Холм', x:1, y:12, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_2_1':  { id:'bl_2_1', name:'Холмы', x:2, y:12, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_3_1':  { id:'bl_3_1', name:'Холм', x:3, y:12, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_4_1':  { id:'bl_4_1', name:'Лес', x:4, y:12, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_5_1':  { id:'bl_5_1', name:'Лес', x:5, y:12, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },

    // ==================== РЯД y=13 ====================
    'bl_-5_2': { id:'bl_-5_2', name:'Южный лес', x:-5, y:13, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-4_2': { id:'bl_-4_2', name:'Лес', x:-4, y:13, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-3_2': { id:'bl_-3_2', name:'Деревня', x:-3, y:13, type:'village', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', places:['Деревня'], resources:['Пшеница','Овощи'] },
    'bl_-2_2': { id:'bl_-2_2', name:'Поле', x:-2, y:13, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница'] },
    'bl_-1_2': { id:'bl_-1_2', name:'Южная дорога', x:-1, y:13, type:'road', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_0_2':  { id:'bl_0_2', name:'Равнина', x:0, y:13, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница'] },
    'bl_1_2':  { id:'bl_1_2', name:'Холм', x:1, y:13, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_2_2':  { id:'bl_2_2', name:'Холмы', x:2, y:13, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_3_2':  { id:'bl_3_2', name:'Холм', x:3, y:13, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень','Железная руда'] },
    'bl_4_2':  { id:'bl_4_2', name:'Лес', x:4, y:13, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_5_2':  { id:'bl_5_2', name:'Лес', x:5, y:13, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },

    // ==================== РЯД y=14 ====================
    'bl_-5_3': { id:'bl_-5_3', name:'Южный лес', x:-5, y:14, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-4_3': { id:'bl_-4_3', name:'Лес', x:-4, y:14, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-3_3': { id:'bl_-3_3', name:'Лес', x:-3, y:14, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-2_3': { id:'bl_-2_3', name:'Лес', x:-2, y:14, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-1_3': { id:'bl_-1_3', name:'Южная дорога', x:-1, y:14, type:'road', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_0_3':  { id:'bl_0_3', name:'Равнина', x:0, y:14, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница'] },
    'bl_1_3':  { id:'bl_1_3', name:'Холм', x:1, y:14, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_2_3':  { id:'bl_2_3', name:'Холмы', x:2, y:14, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_3_3':  { id:'bl_3_3', name:'Холм', x:3, y:14, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_4_3':  { id:'bl_4_3', name:'Лес', x:4, y:14, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_5_3':  { id:'bl_5_3', name:'Лес', x:5, y:14, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },

    // ==================== РЯД y=15 ====================
    'bl_-5_4': { id:'bl_-5_4', name:'Юго-западный лес', x:-5, y:15, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-4_4': { id:'bl_-4_4', name:'Лес', x:-4, y:15, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-3_4': { id:'bl_-3_4', name:'Лес', x:-3, y:15, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-2_4': { id:'bl_-2_4', name:'Лес', x:-2, y:15, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-1_4': { id:'bl_-1_4', name:'Южная дорога', x:-1, y:15, type:'road', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_0_4':  { id:'bl_0_4', name:'Равнина', x:0, y:15, type:'plain', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница'] },
    'bl_1_4':  { id:'bl_1_4', name:'Холм', x:1, y:15, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_2_4':  { id:'bl_2_4', name:'Холмы', x:2, y:15, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_3_4':  { id:'bl_3_4', name:'Холм', x:3, y:15, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_4_4':  { id:'bl_4_4', name:'Лес', x:4, y:15, type:'forest', level:5, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_5_4':  { id:'bl_5_4', name:'Лес', x:5, y:15, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },

    // ==================== РЯД y=16 (Южная граница) ====================
    'bl_-5_5': { id:'bl_-5_5', name:'Юго-западная опушка', x:-5, y:16, type:'plain', level:8, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница'] },
    'bl_-4_5': { id:'bl_-4_5', name:'Южная опушка', x:-4, y:16, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-3_5': { id:'bl_-3_5', name:'Южные холмы', x:-3, y:16, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_-2_5': { id:'bl_-2_5', name:'Южный лес', x:-2, y:16, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_-1_5': { id:'bl_-1_5', name:'Южная застава', x:-1, y:16, type:'road', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:[] },
    'bl_0_5':  { id:'bl_0_5', name:'Южная равнина', x:0, y:16, type:'plain', level:8, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница'] },
    'bl_1_5':  { id:'bl_1_5', name:'Юго-восточный холм', x:1, y:16, type:'mountain', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_2_5':  { id:'bl_2_5', name:'Юго-восточные холмы', x:2, y:16, type:'mountain', level:7, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'mountain', resources:['Камень'] },
    'bl_3_5':  { id:'bl_3_5', name:'Юго-восточная опушка', x:3, y:16, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_4_5':  { id:'bl_4_5', name:'Южная опушка', x:4, y:16, type:'forest', level:6, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resourceType:'forest', resources:['Древесина'] },
    'bl_5_5':  { id:'bl_5_5', name:'Юго-восточная граница', x:5, y:16, type:'plain', level:8, owner:'buckler', region:'Штормовые земли', area:'Владения Баклеров', resources:['Пшеница'] }
};

// Добавляем в глобальный мир
Object.assign(WORLD_AREAS, BUCKLER_AREAS);
buildWorldTransitions();

console.log('✅ Владения Баклеров загружены (121 зона, 11×11)');

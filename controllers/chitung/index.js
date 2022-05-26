/**
 * 七筒 部分功能
 * 参考自 七筒 开放版
 * https://github.com/KadokawaR/Chitung-public
 * chitung
 */

module.exports = (message) => {

    // 求签
    require('./mahjong/fortuneTeller')(message);

    // lottery
    require('./lottery')(message);
    
}
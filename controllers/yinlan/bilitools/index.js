/**
 * 洇岚 B站相关
 * yinlan.bilitools
 */

module.exports = (message) => {

    // 管理
    require('./manage')(message);

    // 搜up
    require('./search')(message);

}
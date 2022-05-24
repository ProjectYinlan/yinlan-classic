/**
 * 管理类功能控制器索引
 */

module.exports = (message) => {

    // 参数设置
    require('./group/config')(message);

    // 广播
    require('./bot/broadcast')(message);

}
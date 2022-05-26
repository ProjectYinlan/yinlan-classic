/**
 * 洇岚 B站相关 账户相关
 */

const { Logger, message } = require('mirai-ts');
const db = require('../../../db');
const log = new Logger({
    prefix: '[bilitools]'
})

/**
 * 检查B站账户信息
 * @param {message?} message 可选
 * @return {boolean}
 */
module.exports = async (message) => {
    
    result = db.prepare('select cookie from yinlan_bilitools_account where flag = 1;').get();

    if (!result || result.cookie) {
        if (message) message.reply(`Bot尚未绑定B站账户，请通知Bot管理员使用“.bilitools bind”进行绑定`);
        return false;
    }

    return result.cookie;

}
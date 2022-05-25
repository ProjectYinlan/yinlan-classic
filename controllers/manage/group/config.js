/**
 * 参数配置
 */

const db = require('../../../db');

const utils = require('../../../utils');

const functionList = [
    'manage.group.event.memberJoinRequestResend',
    'chitung.mahjong.fortuneTeller',
    'chitung.lottery.c4',
    'chitung.lottery.bummer'
]

module.exports = async (message) => {

    // 消息判断
    const { msg, msgAry } = utils.compareKeyword('yinlan', message, { type: 'group' });
    if (!msg || msgAry[1] != 'config') return;

    // 判断权限
    if (!utils.verifyPermission(message, 'manager')) return;

    // 子命令
    let text = "";
    let permissionList = [];
    switch (msgAry[2]) {

        case 'list':
            permissionList = db.prepare('select * from functionValid where id = ?;').all(message.sender.group.id);
            
            if (permissionList.length == 0) {
                text = "本群暂无自定义功能控制";
                break;
            }

            text = `共 ${permissionList.length} 个自定义功能控制`;
            for (let i = 0; i < permissionList.length; i++) {
                const { name, valid } = permissionList[i];
                text += `\n${i+1}. ${name} - ${valid ? "on" : "off"}`;
            }
            break;

        case 'get':
            if (!msgAry[3]) {
                text = "请填写 functionName";
                break;
            }

            permissionList = utils.string2MultiLayer(msgAry[3]);
            text = `有关 ${msgAry[3]} 的自定义功能控制`;
            let j = 0;
            for (let i = 0; i < permissionList.length; i++) {
                const permission = permissionList[i];
                result = db.prepare('select * from functionValid where id = ? and name = ?;').get(message.sender.group.id, permission);
                if (!result) continue;
                const { name, valid } = result;
                text += `\n${i + 1}. ${name} - ${valid ? "on" : "off"}`;
                j++;
            }
            if (j == 0) text = `本群暂无有关 ${msgAry[3]} 的自定义功能控制`;
            break;

        case 'set':
            if (!msgAry[3]) {
                text = "请填写 functionName";
                break;
            }
            functionName = msgAry[3];

            if (!msgAry[4] || (msgAry[4] != 'on' && msgAry[4] != 'off')) {
                text = "请填写正确的 valid";
                break;
            }

            let valid = 0;
            if (msgAry[4] == 'on') valid = 1;

            // 先检测是否有
            if (!db.prepare('select * from functionValid where id = ? and name = ?;').get(message.sender.group.id, functionName)) {
                const { changes } = db.prepare('insert into functionValid (id, name, valid) values (?, ?, ?);').run(message.sender.group.id, functionName, valid);
                if (changes === 0) {
                    text = "数据库操作出现错误";
                    break;
                }
            } else {
                const { changes } = db.prepare('update functionValid set valid = ? where id = ? and name = ?;').run(valid, message.sender.group.id, functionName);
                if (changes === 0) {
                    text = "数据库操作出现错误";
                    break;
                }
            }

            text = `操作成功`;
            break;
    
        default:
            text = "指令有误，请使用 .yinlan help config 查看帮助";
            break;
    }

    message.reply(text);

}
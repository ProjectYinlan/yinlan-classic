/**
 * 公告群发
 */

const { Logger, check } = require('mirai-ts');
const log = new Logger({
    prefix: '[broadcast]'
})

const bot = require('../../../app');
const db = require('../../../db');

const note = require('../../../config/event-note.json');
const { name, admin, manageGroup } = require('../../../config.json').bot;

const utils = require('../../../utils');

/**
 * 暴露方法
 */
module.exports = async (message) => {

    // 判断权限
    if (!utils.verifyPermission(message, 'botAdmin')) return;

    // 读取队列
    r = db.prepare('select * from eventList where id = ?;').get(message.sender.id);

    const now = (new Date()).getTime();

    // 判断是否已经发过
    if (r) {

        const { ts } = r;

        // 判断是否过期
        if ((now - ts) > (5 * 60 * 1000)) {

            // 回复是否过期
            await message.reply("公告群发已过期", true);

            // 数据库删除对应条目
            const { changes } = db.prepare('delete from eventList where ts = ?;').run(ts);

            // 判断数据库操作是否成功
            if (changes === 0) await message.reply("数据库操作出现错误", true);

            return;
        }

        // 没过期

        // 获取当前群列表
        const groupList = (await bot.api.groupList()).data;

        // 回复操作
        await message.reply(`共 ${groupList.length} 个群，开始执行群发，预计需要 ${groupList.length * 0.2} 秒`, true);

        // 插 成功数量 的 flag
        let success = 0;

        // 遍历
        for (let j = 0; j < groupList.length; j++) {
            const { id } = groupList[j];
            result = await bot.api.sendGroupMessage(message.messageChain, id);
            if (result.code === 0) success++;
            await utils.wait(200);
        }

        // 完成信息
        const text = `成功发送 ${success} 个群，共 ${groupList.length} 个群`;
        log.info(`${message.sender.memberName}(${message.sender.id}) ` + text);
        await message.reply(text, true);

        // 数据库删除对应条目
        const { changes } = db.prepare('delete from eventList where ts = ?;').run(ts);

        // 判断数据库操作是否成功
        if (changes === 0) await message.reply("数据库操作出现错误", true);

        return;
    }

    // 判断是否为指令
    const { msg } = utils.compareKeyword('broadcast', message);
    if (msg) {

        // 数据库增加条目
        const { changes } = db.prepare('insert into eventList (id, ts) values (?, ?);').run(message.sender.id, now);
        if (changes === 0) {
            await message.reply("数据库操作出现错误", true);
            return;
        }

        log.info(`${message.sender.memberName}(${message.sender.id}) 进入广播模式`);
        await message.reply("已进入广播模式，请发送一条消息，该模式有效时间5分钟，全局通用", true);
    };
    return;
}
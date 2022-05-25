/**
 * C4
 * chitung.lottery.c4
 */

const schedule = require('node-schedule');

const db = require('../../../db');
const utils = require('../../../utils');

const config = require('../../../config.json');

const { message, Message } = require('mirai-ts');
const { bot } = require('../../../app');

/**
 * c4
 * 该功能 每日 6:00 清理 flag
 * 计划任务注册 -> /controllers/schedule.js
 * @param {message} message 
 */
module.exports = async (message) => {
    
    // 命令判断
    const { msg } = utils.compareKeyword('c4', message, { type: 'group', lowerCase: true });
    if (!msg) return;

    const active = utils.functionValid(message, 'chitung.lottery.c4', true);
    if (!active) {
        message.reply("本群暂未开启C4功能。");
        return;
    }

    // 判断权限
    const { permission } = await bot.api.memberInfo(message.sender.group.id, bot.qq);
    if (permission == 'MEMBER') {
        message.reply(`${config.bot.name}目前还没有管理员权限，请授予${config.bot.name}权限解锁更多功能。`);
        return;
    }

    // 获取今天是否已经触发
    let result = db.prepare('select * from chitung_lottery_c4 where id = ?;').get(message.sender.group.id);
    if (result && result.status == 1) {
        message.reply("今日的C4已经被触发过啦！请明天再来尝试作死！");
        return;
    }

    // 计算概率
    // 群员数的平方分之一
    const memberNum = (await bot.api.memberList(message.sender.group.id)).data.length;
    const ratio = 1 / (memberNum * memberNum);

    if (Math.random() < ratio) {

        // 中咧！
        await bot.api.muteAll(message.sender.group.id);
        await message.reply("中咧！");
        await message.reply([Message.At(message.sender.id), Message.Plain("成功触发了C4！大家一起恭喜TA！\n五分钟后将自动解除")]);
        schedule.scheduleJob(((new Date()).getTime() + 5 * 60 * 1000), () => {
            bot.api.unmuteAll(message.sender.group.id);
        })
        
        // 判断数据库条目是否存在
        let changes;
        if (!result) {
            changes = db.prepare('insert into chitung_lottery_c4 (id, status) values (?, ?);').run(message.sender.group.id, 1).changes;
        } else {
            db.prepare('update chitung_lottery_c4 set status = ? where id = ?;').run(1, message.sender.group.id);
        }
        if (changes == 0) {
            message.reply("数据库操作出错");
            return;
        }

    } else {
        
        message.reply("没有中！");

    }

    return;

}


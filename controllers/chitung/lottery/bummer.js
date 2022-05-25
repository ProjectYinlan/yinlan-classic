/**
 * bummer
 * chitung.lottery.bummer
 */

const utils = require('../../../utils');

const { message, Message } = require('mirai-ts');
const { bot } = require('../../../app');

const config = require('../../../config.json');

const officialBots = [
    1285419596,
    2811520355
]

/**
 * bummer
 * @param {message} message 
 */
module.exports = async (message) => {

    // 命令判断
    const { msg } = utils.compareKeyword('bummer', message, { type: 'group', lowerCase: true });
    if (!msg) return;

    const active = utils.functionValid(message, 'chitung.lottery.bummer', true);
    if (!active) {
        message.reply("本群暂未开启Bummer功能。");
        return;
    }

    // 判断权限
    const { permission } = await bot.api.memberInfo(message.sender.group.id, bot.qq);
    if (permission == 'MEMBER') {
        message.reply(`${config.bot.name}目前还没有管理员权限，请授予${config.bot.name}权限解锁更多功能。`);
        return;
    }

    // 获取群员 & 过滤管理
    let memberList = (await bot.api.memberList(message.sender.group.id)).data.filter((memberItem) => {
        if (memberItem.permission == 'MEMBER') {
            return memberItem;
        };
    });
    if (memberList.length == 0) {
        message.reply("要么都是管理员要么都没有人玩Bummer了？别闹。");
        return;
    }

    // 排除官方Bot
    memberList = memberList.filter((memberItem) => {
        if (!officialBots.includes(memberItem.id)) {
            return memberItem;
        }
    })
    if (memberList.length == 0) {
        message.reply("你想让我去禁言官方Bot？不可以的吧。");
        return;
    }

    // 抽取倒霉蛋
    const victim = memberList[parseInt(Math.random()*(memberList.length), 10)];

    let msgChain = [];

    // 如果他是极限一换一，我觉得可以双倍时长
    if (victim.id == message.sender.id) {

        bot.api.mute(message.sender.group.id, victim.id, 240);
        msgChain = [
            Message.Plain(`Ok Bummer! ${victim.memberName}\n`),
            Message.At(victim.id),
            Message.Plain("尝试随机极限一换一。他成功把自己换出去了！")
        ];
        
    } else {

        bot.api.mute(message.sender.group.id, victim.id, 120);
        
        // 如果发送者是普通群员，也将被禁言
        if (message.sender.permission == 'MEMBER') {

            bot.api.mute(message.sender.group.id, message.sender.id, 120);

        }

        msgChain = [
            Message.Plain(`Ok Bummer! ${victim.memberName}\n${(message.sender.permission != 'MEMBER') ? "管理员" : ""}`),
            Message.At(message.sender.id),
            Message.Plain(`${(message.sender.permission == 'MEMBER') ? "以自己为代价" : ""}随机带走了`),
            Message.At(victim.id)
        ]

    }

    message.reply(msgChain);
    return;

}
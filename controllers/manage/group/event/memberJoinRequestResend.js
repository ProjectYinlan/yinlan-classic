/**
 * 加群申请转发同意
 * manage.group.event.memberJoinRequestResend
 * 
 * 消息样例
 * [入群申请] 1653466426014734
 * 申请人：洇岚 - FurDevs.CN (2811520355)
 * 附言：来自：群成员你的邀请
 * 处理方式：群友可回复这条消息【同意】，进行处理
 * 
 */

const { message, EventType } = require('mirai-ts');
const { bot, responder } = require('../../../../app');
const utils = require('../../../../utils');

/**
 * 加群申请转发同意
 * manage.group.event.memberJoinRequestResend
 * @param {message} message
 */
module.exports = async (message) => {

    // 消息检测
    const { msg } = utils.compareKeyword("同意", message, { type: 'group', mode: 'equal' });
    if (!msg) return;

    const quoteMessage = message.get('Quote');
    if (
        !quoteMessage || 
        quoteMessage.senderId != bot.qq || 
        quoteMessage.origin[0].type != 'Plain'
        ) return;

    const quoteMsg = quoteMessage.origin[0].text;
    const quoteMsgAry = quoteMsg.match(/^.*?(\d+)\n.*?\((\d+)\)\n附言：(\S+)\n.*$/);
    if (!quoteMsgAry) return;

    // 判断启用
    const active = utils.functionValid(groupId, 'manage.group.event.memberJoinRequestResend', false);
    if (!active) return;

    const
        eventId = quoteMsgAry[1],
        fromId = quoteMsgAry[2],
        requestMsg = quoteMsgAry[3]

    // 啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊
    // 我怎么构造 EventType.BotInvitedJoinGroupRequestEvent 啊啊啊啊啊啊啊啊啊啊
    // const aaa = new EventType.BotInvitedJoinGroupRequestEvent({eventId, fromId, groupId: message.sender.group.id})
    // a = responder.memberJoinRequest(aaa, 0);

    
    console.log(a);

}
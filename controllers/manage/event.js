/**
 * 事件监听处理
 * manage.event
 */

const { Logger } = require('mirai-ts');
const log = new Logger({
    prefix: '[event]'
})

const { bot } = require('../../app');
const note = require('../../config/event-note.json');
const { name, admin, manageGroup } = require('../../config.json').bot;

const utils = require('../../utils');

const kaomojis = require('../../data/kaomoji.json').data;

/**
 * 上线提醒
 */
botOn();
async function botOn () {
    let msg = note.online;
    if (!msg) return;
    msg = msg.replace(/{{name}}/g, name);
    await logText(msg);
}

/**
 * 入群打招呼
 */
bot.on('BotJoinGroupEvent', async (data) => {
    const { group, invitor, reply } = data;
    const text = `[邀请入群] 已由 ${(invitor.permission == 'MEMBER') ? "群员" : "群管"} ${invitor.memberName}(${invitor.id}) 邀请入 ${group.name}(${group.id})`;
    await logText(text);
    
    let msg = note.joinGroup;
    if (!msg) return;
    msg = msg.replace(/{{name}}/g, name);
    await bot.api.sendGroupMessage(msg, group.id);
})

/**
 * 从群中被移除
 */
bot.on('BotLeaveEventKick', async (data) => {
    const { group, operator } = data;
    const text = `[退群] 已被 ${operator.memberName}(${operator.id}) 从 ${group.name}(${group.id}) 中移除`;
    logText(text);
})

/**
 * 欢迎入群
 */
bot.on('MemberJoinEvent', async (data) => {
    const { group, id, memberName } = data.member;
    let msg = note.newGroupMember;
    if (!msg) return;
    msg = msg.replace(/{{memberName}}/g, memberName);
    msg = msg.replace(/{{memberId}}/g, id);
    await bot.api.sendGroupMessage(msg, group.id);
})

/**
 * 成员被踢
 */
bot.on('MemberLeaveEventKick', async (data) => {
    const { member, operator } = data;
    let msg = note.kickGroupMember;
    if (!msg) return;
    msg = msg.replace(/{{memberName}}/g, member.memberName);
    msg = msg.replace(/{{memberId}}/g, member.id);
    msg = msg.replace(/{{operatorName}}/g, operator.memberName);
    msg = msg.replace(/{{operatorId}}/g, operator.id);
    await bot.api.sendGroupMessage(msg, member.group.id);
})

/**
 * 成员退群
 */
bot.on('MemberLeaveEventQuit', async (data) => {
    const { group, id, memberName } = data;
    let msg = note.quitGroupMember;
    if (!msg) return;
    msg = msg.replace(/{{memberName}}/g, memberName);
    msg = msg.replace(/{{memberId}}/g, id);
    await bot.api.sendGroupMessage(msg, group.id);
})

/**
 * 群名称修改
 */
bot.on('GroupNameChangeEvent', async (data) => {
    const { group, current, origin } = data;
    let msg = note.changeGroupName;
    if (!msg) return;
    msg = msg.replace(/{{currentName}}/g, current);
    msg = msg.replace(/{{originName}}/g, origin);
    await bot.api.sendGroupMessage(msg, group.id);
})

/**
 * 戳一戳
 */
bot.on('NudgeEvent', async (data) => {
    if (data.target != bot.qq) return;
    const { fromId, subject, reply } = data;
    await bot.api.sendNudge(fromId, subject.id, subject.kind);
    let msg = note.nudge;
    if (!msg) return;
    const kaomoji = kaomojis[parseInt(Math.random()*kaomojis.length)];
    msg = msg.replace(/{{randomKaomoji}}/g, kaomoji);
    await reply(msg);
})

/**
 * 加群申请转发
 * manage.group.event.memberJoinRequestResend
 */
bot.on('MemberJoinRequestEvent', async (data) => {

    const { fromId, groupId, eventId, message, nick } = data;
    
    // 判断启用
    const active = utils.functionValid(groupId, 'manage.group.event.memberJoinRequestResend', false);
    if (!active) return;

    const content = 
        `[入群申请] ${eventId}\n` +
        `申请人：${nick} (${fromId})\n` +
        `附言：${message}\n` +
        `处理方式：群友可回复这条消息【同意】，进行处理`;
    await bot.api.sendGroupMessage(content, groupId);

})


/**
 * 将消息发送至管理群聊并输出log
 * @param {string} text 发送文本
 */
async function logText (text) {
    log.info(text);
    await bot.api.sendGroupMessage(text, manageGroup);
}
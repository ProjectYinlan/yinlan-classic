/**
 * 搜up
 * yinlan.bilitools.search
 * 
 * 路过的玖叁(UID:12583120[Lv.5])
 * 粉丝710 视频24 未开播
 * 个签：如人饮水冷暖自知。
 * 个人主页 https://space.bilibili.com/12583120
 * 直播间 https://live.bilibili.com/1064790
 */

const biliAPI = require('bili-api');
const { Message } = require('mirai-ts');

const utils = require('../../../utils');

module.exports = async (message) => {
    
    const { msg, msgAry } = utils.compareKeyword('搜up', message);
    if (!msg) return;

    let upInfo;
    try {
        upInfo = await biliAPI({ uname: msgAry[1] }, ['info']);
    } catch (error) {
    }

    let content = "啥都木有";
    if (upInfo) {
        const { mid, uname, usign, fans, videos, upic, level, is_live, room_id } = upInfo.search.data.result[0];
        contentPlain = 
            `${uname} (UID:${mid}) [Lv.${level}]\n` +
            `粉丝${fans} 视频${videos} ${room_id ? (is_live ? "直播中" : "未开播") : ""}\n` +
            `签名：${usign}\n` +
            `主页：https://space.bilibili.com/${mid}` +
            `${room_id ? ("\n直播：https://live.bilibili.com/" + room_id) : ""}`
        content = [
            Message.Image(null, "https:" + upic),
            Message.Plain(contentPlain)
        ]
    }

    message.reply(content);

}
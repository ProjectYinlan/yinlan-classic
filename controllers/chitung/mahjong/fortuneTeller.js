/**
 * 求签
 * https://github.com/KadokawaR/Chitung-public/blob/main/src/main/kotlin/mirai/chitung/plugin/core/responder/mahjong/FortuneTeller.kt
 */
const path = require('path');
const random = require('random-seed');
const { Message } = require('mirai-ts');

const utils = require('../../../utils');

const luck = [
    "大凶",  //一筒
    "末吉",
    "吉",
    "吉凶相半",
    "吉",
    "末吉",
    "大大吉",  //七筒
    "吉",
    "小凶後吉",  //九筒
    "吉",  //一条
    "末吉",
    "吉",
    "小凶後吉",
    "吉",
    "末吉",
    "大吉",
    "吉凶相半",
    "吉",  //九条
    "末吉",  //一万
    "半吉",
    "凶後吉",
    "半吉",
    "末吉",
    "半吉",
    "大凶",
    "半吉",
    "吉凶相半",  //九万
    "半吉",  //东
    "末吉",  //南
    "凶後大吉",  //西
    "凶後吉",  //北
    "小吉",  //中
    "小凶後吉",  //白
    "大吉",  //发
    "吉凶相半",  //春
    "小吉",
    "末吉",
    "小吉",  //冬
    "大吉",  //梅
    "中吉",
    "大吉",
    "中吉"  //菊
]

const saying = [
    "别出门了，今天注意安全。",  //一筒
    "是吉是凶并不清楚，暂定为吉！",
    "还算不错！",
    "吉凶各一半，要小心哦！",
    "其实还不错！",
    "是吉是凶并不清楚，暂定为吉！",
    "实现愿望的最高幸运，今天你会心想事成！",  //七筒
    "还不错！",
    "丢失的运气会补回来的！",  //九筒
    "还不错！",  //一条
    "是吉是凶并不清楚，暂定为吉！",
    "还可以的！",
    "丢失的运气会补回来的！",
    "还不错！",
    "是吉是凶并不清楚，暂定为吉！",
    "是仅次于大大吉的超级好运！",
    "吉凶各一半，要小心哦！",
    "还不错！",  //九条
    "是吉是凶并不清楚，暂定为吉！",  //一万
    "勉勉强强的好运！",
    "一阵不走运之后会好运的！",
    "勉勉强强的好运！",
    "是吉是凶并不清楚，暂定为吉！",
    "勉勉强强的好运！",
    "别出门了，今天注意安全。",
    "勉勉强强的好运！",
    "吉凶各一半，小心一些总不会错！",  //九万
    "勉勉强强的好运！",  //东
    "是吉是凶并不清楚，暂定为吉！",  //南
    "一阵不走运之后会行大运的！",  //西
    "一阵不走运之后会好运的！",  //北
    "微小但一定会到来的好运！",  //中
    "丢失的运气会补回来的！",  //白
    "是仅次于大大吉的超级好运！会有很好的财运！",  //发
    "吉凶各一半，要小心哦！",  //春
    "微小但一定会到来的好运！",
    "是吉是凶并不清楚，暂定为吉！",
    "微小但一定会到来的好运！",  //冬
    "是仅次于大大吉的超级好运！",  //梅
    "非常好的运气！",
    "是仅次于大大吉的超级好运！",
    "非常好的运气！姻缘不错！" //菊
]

const MAHJONG_PIC_DIR_PATH = path.resolve('controllers', 'chitung', 'resources', 'pics', 'mahjong');

/**
 * 获取当日幸运数字
 * @param {number} id QQ
 * @returns {number} 
 */
function getMahjongOfTheDay(id) {
    const now = new Date();
    const datetime = now.getFullYear() * 1000 + (now.getMonth() + 1) * 100 + now.getDate();
    const rand = random(datetime);
    return rand(144);
}

/**
 * 获取麻将
 * @param {number} mahjongOfTheDay
 * @returns
 */
function getMahjong(mahjongOfTheDay) {
    const
        chineseNum = [
            "一", "二", "三", "四", "五", "六", "七", "八", "九"
        ],
        fengXiang = [
            "東", "南", "西", "北"
        ],
        zhongFaBai = [
            "红中", "發财", "白板"
        ],
        huaPai = [
            "春", "夏", "秋", "冬", "梅", "兰", "竹", "菊"
        ]

    let mahjongNumero, mahjongName;

    if (mahjongOfTheDay < 36) {
        mahjongNumero = mahjongOfTheDay % 9;
        mahjongName = chineseNum[mahjongNumero] + "筒";
    } else if (mahjongOfTheDay < 72) {
        mahjongNumero = mahjongOfTheDay % 9;
        mahjongName = chineseNum[mahjongNumero] + "条";
    } else if (mahjongOfTheDay < 108) {
        mahjongNumero = mahjongOfTheDay % 9;
        mahjongName = chineseNum[mahjongNumero] + "萬";
    } else if (mahjongOfTheDay < 124) {
        mahjongNumero = mahjongOfTheDay % 4;
        mahjongName = fengXiang[mahjongNumero] + "风";
    } else if (mahjongOfTheDay < 136) {
        mahjongNumero = mahjongOfTheDay % 3;
        mahjongName = zhongFaBai[mahjongNumero];
    } else {
        mahjongNumero = mahjongOfTheDay - 136;
        mahjongName = "花牌（" + huaPai[mahjongNumero] + "）";
    }

    return mahjongName;
}

/**
 * 获取回复内容
 * @param {number} id QQ 
 * @returns 
 */
function whatDoesMahjongSay (id) {
    let mahjongOfTheDay = getMahjongOfTheDay(id);
    let mahjongNumero;
    if (mahjongOfTheDay < 36) {
        mahjongNumero = mahjongOfTheDay % 9;
    } else if (mahjongOfTheDay < 72) {
        mahjongNumero = (mahjongOfTheDay - 36) % 9 + 9;
    } else if (mahjongOfTheDay < 108) {
        mahjongNumero = (mahjongOfTheDay - 72) % 9 + 18;
    } else if (mahjongOfTheDay < 124) {
        mahjongNumero = (mahjongOfTheDay - 108) % 4 + 27;
    } else if (mahjongOfTheDay < 136) {
        mahjongNumero = (mahjongOfTheDay - 124) % 3 + 31;
    } else {
        mahjongNumero = mahjongOfTheDay - 102;
    }
    return (
        `今天的占卜麻将牌是: ${getMahjong(mahjongOfTheDay)}\n` +
        `运势是: ${luck[mahjongNumero]}\n` +
        `${saying[mahjongNumero]}`
    );
}

module.exports = (message) => {

    // 消息判断
    const { msg } = utils.compareKeyword('.求签', message, { mode: 'equal' });
    if (!msg) return;

    // 计算随机图路径
    const MAHJONG_PIC_PATH = path.resolve(
        MAHJONG_PIC_DIR_PATH,
        (Math.random() < 0.5) ? 'Red' : 'Yellow',
        getMahjong(getMahjongOfTheDay(message.sender.id)) + '.png'
    );

    // 回复消息
    message.reply([
        Message.Plain(whatDoesMahjongSay(message.sender.id)),
        Message.Image(null, null, null, utils.imgBase64Encode(MAHJONG_PIC_PATH))
    ]);

    return;

}
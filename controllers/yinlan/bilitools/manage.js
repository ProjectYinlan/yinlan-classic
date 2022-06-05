/**
 * 洇岚 Bilitools 管理
 */

const axios = require("axios");
const qrcode = require('qrcode');
const qs = require('qs');

const { Message } = require("mirai-ts");
const utils = require("../../../utils");
const { bot } = require("../../../app");
const db = require("../../../db");

const getAccount = require('./getAccount');

axios.default.withCredentials = true;

module.exports = async (message) => {

    keywordRoute(message);
    bilitoolsRoute(message);

}

/**
 * 被动指令路由
 * @param {message} message
 */
function keywordRoute (message) {

    getLoginInfo(message);

}

/**
 * 指令路由
 * @param {message} message
 */
async function bilitoolsRoute (message) {
    const {msg, msgAry} = utils.compareKeyword('bilitools', message);
    if (!msg) return;
    if (!utils.verifyPermission(message, 'botAdmin')) return;

    let content;
    switch (msgAry[1]) {

        case 'bind':
            content = await genLoginQR();
            break;

        case 'account':
            content = await getAccountInfo();
            break;
    
        default:
            return;
    }

    message.reply(content);
}

/**
 * 获取二维码登录的二维码
 * 超时 180s
 */
async function genLoginQR () {

    const { url, oauthKey } = await axios.get('http://passport.bilibili.com/qrcode/getLoginUrl').then(resp => resp.data.data);

    imgStr = (await qrcode.toBuffer(url)).toString('base64')

    return [
        Message.Plain(`[绑定B站] ${oauthKey}`),
        Message.Image(null, null, null, imgStr),
        Message.Plain("请使用手机端B站扫描上方二维码，有效期180秒\n扫描后请回复该消息“验证B站”")
    ]

}

/**
 * 使用二维码登录
 */
async function getLoginInfo (message) {

    // 消息检测
    const { msg } = utils.compareKeyword("验证B站", message, { mode: 'equal' });
    if (!msg) return;

    const quoteMessage = message.get('Quote');
    if (
        !quoteMessage || 
        quoteMessage.senderId != bot.qq || 
        quoteMessage.origin[0].type != 'Plain'
        ) return;

    const quoteMsg = quoteMessage.origin[0].text;
    const quoteMsgAry = quoteMsg.match(/^\[\S+\]\s(\w+)/);
    if (!quoteMsgAry) return;
    
    const oauthKey = quoteMsgAry[1];

    // 请求
    resp = await axios({
        method: 'post',
        url: 'http://passport.bilibili.com/qrcode/getLoginInfo',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({
            oauthKey
        })
    });

    const { data } = resp;

    let content;

    // 状态码判断
    if (typeof(data.data) == 'number') {
        switch (data.data) {
            case -2:
                content = "二维码已失效或信息不完整";
                break;
    
            case -4:
                content = "未扫描二维码";
                break;
    
            case -5:
                content = "未确认登录";
                break;
        
            default:
                content = `遇到未知错误，请联系开发者\ncode: ${data.code}\nmsg: ${data.message}`;
                break;
        }
        message.reply(content);
        return;
    }

    // 获取 cookie 以及去掉 expire
    let cookie = resp.headers['set-cookie'];
    cookie = cookie.map((item) => {
        t = item.split(";");
        return t[0];
    })
    cookie = cookie.join(';');

    // 获取信息
    result = await getAccountInfoByCookie(cookie);

    if (!result) {
        message.reply("登陆失败");
        return;
    }

    const { uname, mid } = result;
    message.reply(`登陆成功~ 欢迎您 ${uname} (${mid})~`);
    
    // 写入数据库
    result = db.prepare('select cookie from yinlan_bilitools_account where flag = 1;').get();
    let changes;
    if (!result) {
        changes = db.prepare('insert into yinlan_bilitools_account (flag, cookie) values (1, ?);').run(cookie).changes;
    }
    changes = db.prepare('update yinlan_bilitools_account set cookie = ? where flag = 1;').run(cookie).changes;

    if (changes == 0) {
        message.reply("数据库操作出错");
        return;
    }

    message.reply("绑定成功~");

}

/**
 * 获取当前绑定账号信息
 */
async function getAccountInfo() {

    result = await getAccount();

    if (!result || result.cookie) return "未绑定账号，请使用 “.bilitools bind” 进行绑定";
    
    result = await getAccountInfoByCookie(result);

    if (!result) return "登陆失败";

    const { uname, mid } = result;
    return `当前已绑定 ${uname} (${mid})`;

}

/**
 * 通过cookie获取信息
 */
async function getAccountInfoByCookie(cookie) {


    resp = await axios({
        method: 'get',
        url: 'https://api.bilibili.com/x/web-interface/nav',
        headers: {cookie}
    }).then(resp => resp.data);

    if (resp.code != 0) return false;

    return resp.data;

}
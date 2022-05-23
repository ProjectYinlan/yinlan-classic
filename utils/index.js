/**
 * 工具类
 */

const { check, message } = require('mirai-ts');

const fs = require('fs');

const config = require('../config.json');

module.exports = {
    /**
     * 命令比对
     * @param {String | RegExp} condition 条件
     * @param {message} message message对象
     * @param {Object} options 
     *        { 
     *          type: , // 信息来源
     *          friend: , // QQ
     *          group: , // 群号
     *          mode: , // substring | include | regax | equal
     *        }
     *        一些其他选项，比如限制群聊/单发，限制源群，限制发送人
     * @return {Boolean} 若命令匹配，返回object {msg, msgAry, quote(如有)}，否则false
     */
    compareKeyword: (condition, message, options) => {

        if (options) {

            // 判断来源
            if (options.type) {
                switch (options.type) {
    
                    case 'friend':
                        if (message.type != 'FriendMessage') return false;
                        break;
    
                    case 'group':
                        if (message.type != 'GroupMessage') return false;
                        break;
                    
                    case 'all':
                    default:
                        break;
                }
            }
    
            if (options.friend) {
                if (!message.friend(options.friend)) return false;
            }
    
            if (options.group) {
                if (!message.group(options.group)) return false;
            }

        }

        
        let msg = message.plain;

        let msgAry = msg.split(' ');

        // 判断模式
        if (options && options.mode) {
            
            // substring | include | regax | equal
            switch (options.mode) {

                // 第一个元素匹配模式
                case 'substring':
                    if ( (msgAry[0].substr(0, 1) != '.' ) || (msgAry[0].substr(1) != condition) ) return false;
                    break;
                    
                // 包含模式
                case 'include':
                    if ( !msg.includes(condition) ) return false;
                    break;

                // 正则模式
                case 'regax':
                    if ( !condition.test(msg) ) return false;
                    break;

                // 完全匹配模式
                case 'equal':
                    if ( msg != condition ) return false;
                    break;
            }

        } else {
            if ( (msgAry[0].substr(0, 1) != '.' ) || (msgAry[0].substr(1) != condition) ) return false;
        }



        return {
            msg,
            msgAry
        }
    },

    /**
     * 权限校验
     * @param {message} message message对象
     * @param {string} type botAdmin, manager, owner
     * @return {Boolean} 
     */
    verifyPermission: (message, type) => {
        
        switch (type) {

            case 'botAdmin':
                if (!config.bot.admin.includes(message.sender.id)) return false;
                break;

            case 'manager':
                if (message.sender.permission != 'OWNER' && message.sender.permission != 'ADMINISTRATOR') return false;
                break;

            case 'owner':
                if (message.sender.permission != 'OWNER') return false;
                break;
        
            default:
                return false;
        }

        return true;

    },

    /**
     * 等待
     * @param {numebr} ms 
     * @returns 
     */
    wait: (ms) => {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve()
            }, ms)
        })
    },

    /**
     * 读取本地图片转base64
     * @param {string} file 
     * @returns 
     */
    imgBase64Encode(file) {
        var bitmap = fs.readFileSync(file);
        return Buffer.from(bitmap).toString('base64');
    }
}
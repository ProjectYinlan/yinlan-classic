/**
 * 配置文件模板以及检测
 */
const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const { Logger } = require('mirai-ts');

const log = new Logger({
    prefix: '[configCheck]'
});


module.exports = {

    /**
     * 初始化
     */
    init: () => {

        // ===========config.json============
        
        // 检查 config.json
        if (!fs.existsSync('config.json')) {
            log.error("请检查 config.json 是否存在，如为第一次运行，请参照 config.template.json 配置 config.json");
            exit();
        };

        // 检查 config.json 的每一项是否正确
        // (不会ts坐大牢)
        const config = require('../config.json');
        if (
            typeof(config.connect.qq) != 'number' ||
            (config.connect.yml && typeof(config.connect.yml) != 'string' ) ||

            typeof(config.bot.name) != 'string' ||
            (!config.bot.admin || !config.bot.admin.length) ||
            typeof(config.bot.manageGroup) != 'number'
        ) {
            log.error("请检查 config.json 是否正确，请参照 config.template.json 配置 config.json");
            exit();
        }

        // 检查 yml 是否存在
        let ymlPath = config.connect.yml || path.resolve("../mcl/config/net.mamoe.mirai-api-http/setting.yml");
        if (!fs.existsSync(ymlPath)) {
            log.error("请检查 config.json 中的 yml 文件是否存在，如果 config.json 没有配置，请检查环境是否完整，或指定一个 yml");
            exit();
        }


        // ===========config/*.json============

        // 检查 config 目录是否存在
        if (!fs.existsSync(path.resolve('config'))) {
            log.info("config 文件夹不存在，将建立");
            fs.mkdirSync(path.resolve('config'));
        }

        // 获取 config-template 中的文件
        let fileList = new Array;
        fileList = fs.readdirSync(path.resolve(__dirname, 'config-template'));
        
        // 排除非 json 文件
        for (let i = 0; i < fileList.length; i++) {
            const fileItem = fileList[i];
            if (fileItem.split('.').pop().toLowerCase() == 'json') {
                fileList.push(fileItem);
            }
            fileList.shift();
        }

        // 遍历每个 json 文件，读取对应关系
        for (let i = 0; i < fileList.length; i++) {
            const fileName = fileList[i];
            const filePath = path.resolve(__dirname, 'config-template/', fileName);
            const configPath = path.resolve(`config/${fileName}`);

            // 判断存在
            if (!fs.existsSync(configPath)) {
                log.info(`${fileName} 不存在，将初始化`);
                fs.writeFileSync(configPath, fs.readFileSync(filePath));
                continue;
            }

            // 判断节点是否正确
            const originConfig = require(filePath);
            const originConfigKeys = Object.keys(originConfig);
            const targetConfig = require(configPath);

            for (let i = 0; i < originConfigKeys.length; i++) {
                const originConfigKey = originConfigKeys[i];
                if (typeof(targetConfig[originConfigKey]) == 'undefined') {
                    log.error(`${fileName} 配置结构不完整，未找到 ${originConfigKey} 键`);
                    exit();
                }
                if (typeof(originConfig[originConfigKey]) != typeof(targetConfig[originConfigKey])) {
                    log.error(`${fileName} 配置中，${originConfigKey} 键对应值类型不正确，应为 ${typeof(originConfig[originConfigKey])}`);
                    exit();
                }
                
            }
            
        }

        log.info("配置文件检查已完毕");

    }


}
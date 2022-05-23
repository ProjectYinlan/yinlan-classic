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

const TEMPLATE_PATH = path.resolve(__dirname, 'template');

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

        let fileList = new Array;

        // ===========config/*.json============

        // 检查 config 目录是否存在
        if (!fs.existsSync(path.resolve('config'))) {
            log.info("config 文件夹不存在，将建立");
            fs.mkdirSync(path.resolve('config'));
        }

        // 获取 template/config 中的文件
        fileList = fs.readdirSync(path.resolve(TEMPLATE_PATH, 'config'));
        
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
            const filePath = path.resolve(TEMPLATE_PATH, 'config', fileName);
            const configPath = path.resolve('config', fileName);

            // 判断存在
            if (!fs.existsSync(configPath)) {
                log.info(`${fileName} 不存在，将初始化`);
                fs.copyFileSync(configPath, filePath);
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

        // ===========data/*============
        // 检查 data 目录是否存在
        if (!fs.existsSync(path.resolve('data'))) {
            log.info("data 文件夹不存在，将建立");
            fs.mkdirSync(path.resolve('data'));
        }

        // 获取 template/data 中的文件
        fileList = fs.readdirSync(path.resolve(TEMPLATE_PATH, 'data'));

        // 获取 data 中的文件
        targetFileList = fs.readdirSync(path.resolve('data'));

        // 判断 template/data 中的某文件 是否存在于 data 中
        for (let i = 0; i < fileList.length; i++) {
            const fileItem = fileList[i];
            if (!targetFileList.includes(fileItem)) {
                log.info(`data 文件夹中 ${fileItem} 不存在，将初始化`);
                fs.copyFileSync(
                    path.resolve(TEMPLATE_PATH, 'data', fileItem),
                    path.resolve('data', fileItem)
                );
            }
        }

        log.info("配置文件检查已完毕");

    }


}
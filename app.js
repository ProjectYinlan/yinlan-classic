/**
 * 洇岚
 */

const { Mirai } = require("mirai-ts");
const config = require('./config.json');
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
// const { Message } = require("mirai-ts");

const configCheck = require('./utils/configCheck');

init();

/**
 * 初始化
 */
async function init() {

	// 配置文件检查
	configCheck.init();

	const { qq } = config.connect;

	const setting = yaml.load(
		fs.readFileSync(
			config.connect.yml || path.resolve("../mcl/config/net.mamoe.mirai-api-http/setting.yml")
		)
	);

	// 实例化 bot
	const bot = new Mirai(setting);

	// 登录
	await bot.link(qq);

	module.exports = bot;

	// 添加事件监听
	require('./controllers/eventHandler');

	bot.on("message", (msg) => {
		console.log(msg.get('Plain'));
	});

	bot.on("GroupRecallEvent", ({ operator }) => {
	});


	bot.listen();

}

/**
 * 洇岚
 */

const { Mirai, Resp } = require("mirai-ts");
const config = require('./config.json');
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const manageCtrl = require('./controllers/manage');
const chitungCtrl = require('./controllers/chitung');

require('./utils/preload');

init();

/**
 * 初始化
 */
async function init() {

	// 定时任务注册
	require('./controllers/schedule');

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

	const responder = new Resp(bot.api);

	module.exports = {
		bot,
		responder
	};



	// const utils = require("./utils");


	// 添加事件监听
	require('./controllers/manage/event');

	bot.on('message', async (message) => {

		// 管理控制器
		manageCtrl(message);

		// 七筒
		chitungCtrl(message);


		// r = await bot.api.memberList(message.sender.group.id);
		// console.log(message.get('Quote'));

		console.log(message)
	})

	bot.listen();

}

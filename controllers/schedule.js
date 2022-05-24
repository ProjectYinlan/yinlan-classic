/**
 * 计划任务注册
 */

const schedule = require('node-schedule');
/**
 * node-schedule 模块支持 cron 风格定时
 * 
    *    *    *    *    *    *
    ┬    ┬    ┬    ┬    ┬    ┬
    │    │    │    │    │    │
    │    │    │    │    │    └ 周 (0 - 7) (0 和 7 都是周日)
    │    │    │    │    └───── 月 (1 - 12)
    │    │    │    └────────── 日 (1 - 31)
    │    │    └─────────────── 时 (0 - 23)
    │    └──────────────────── 分 (0 - 59)
    └───────────────────────── 秒 (0 - 59, 可选)
 */

const { Logger } = require('mirai-ts');
const log = new Logger({
    prefix: '[schedule]'
});

const db = require('../db');

/**
 * C4
 * chitung.lottery.c4
 */
schedule.scheduleJob('0 6 * * *', () => {
    const { changes } = db.prepare('update chitung_lotteryC4 set status = ?;').run(0);
    log.info(`[chitung.lottery.c4] 已刷新 ${changes} 个 C4 flags`);
});

log.info("已注册定时任务");
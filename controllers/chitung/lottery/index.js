/**
 * 抽取幸运群友的控制器
 * Bummer & C4 （因为 Winner 含有美术作品，故在此暂时不引入
 * https://github.com/KadokawaR/Chitung-public/blob/main/src/main/kotlin/mirai/chitung/plugin/core/responder/lotterywinner/LotteryMachine.kt
 */

module.exports = (message) => {

    // Bummer
    require('./bummer')(message);

    // C4
    require('./c4')(message);
}
const { Mirai } = require("mirai-ts");
const config = require('./config.json');
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
// const { Message } = require("mirai-ts");

const {qq} = config.connect;

const setting = yaml.load(
  fs.readFileSync(
      config.connect.yml || path.resolve("../mcl/config/net.mamoe.mirai-api-http/setting.yml")
  )
);

const mirai = new Mirai(setting);

async function app() {
  // 登录 QQ
  await mirai.link(qq);

  mirai.on("message", (msg) => {
  });

  mirai.on("GroupRecallEvent", ({ operator }) => {
  });

  mirai.listen((msg) => {
  });
}

app();
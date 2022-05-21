
## 配置文件说明

### config.json

核心配置文件

注：yml 路径这一项可以移除，默认为`../mcl/config/net.mamoe.mirai-api-http/setting.yml`

```JSON
{
    "connect": {
        "qq": 123456789,            // Bot QQ
        "yml": "setting.yml"        // mirai-api-http 的 yml 配置文件路径
    },
    "bot":{
        "name": "洇岚开发版",         // Bot 名称
        "admin": [                  // 管理员列表
            987654321
        ],
        "manageGroup": 1101101110   // 管理用群
    }
}
```

### config/event-note.json

关于各种事件的提示语，支持 {{}} 替换部分变量，所有变量均已在模板中列出。

注：为空（字符串空：`""`）时则在触发该事件时不回复。

```JSON
// template
{
    "newFriend": "您好，我是{{name}}，您可以使用“.help”指令来查询帮助。",

    "joinGroup": "很高兴为您服务。这里是{{name}}，您可以使用“.help”指令来查询帮助。",
    "rejectGroup": "抱歉，暂时不接受加群请求。\n原因：{{reason}}",
    "newGroupMember": "欢迎 {{memberName}}({{memberId}}) 加入本群。",
    "kickGroupMember": "{{memberName}}({{memberId}}) 被管理员 {{operatorName}}({{operatorId}})移出群聊。",
    "quitGroupMember": "{{memberName}}({{memberId}}) 退出了群聊。",
    "changeGroupName": "好名字。\n原名字：{{originName}}\n现名字：{{currentName}}",

    "online": "{{name}} 已上线。",

    "nudge": "{{randomKaomoji}}"        // randomKaomoji 为默认随机颜文字，可以到 data/kaomoji.json 修改
}
```
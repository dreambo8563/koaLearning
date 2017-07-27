const router = require('koa-joi-router');
const Joi = router.Joi;

const body = router()

body.prefix('/body')
// http://localhost:3000/body { 	"name":"xxx", 	"obj":{"foo":123},
// 	"birthday":"2019-09-09", 	"email":"SS@TTY.com", 	"money":9, 	"list":[] } {
//   "error_code" : 222,     "error_msg" : "error" }
body.post('/', {
    validate: {
        body: {
            // 必填 string 最大5个字符
            name: Joi
                .string()
                .max(5)
                .required(),
            // 如果有必须email格式
            email: Joi
                .string()
                .email(),
            // 非必填, 如果有长度限制
            password: Joi
                .string()
                .max(5),
            // 必须有,且必须为对象, 且对象内必须有foo这个字段,且这个字段必须是数字,最小为0 且为必填
            obj: Joi
                .object({
                foo: Joi
                    .number()
                    .min(0)
                    .required()
            })
                .required(),
            // 如果没有则给默认值55,有必须是数字
            age: Joi
                .number()
                .default(55),
            // 有的话必须是true 或false
            man: Joi.boolean(),
            // 有的话必须是正数
            money: Joi
                .number()
                .positive(),
            // 有的话必须是数组
            list: Joi.array(),
            // 有的话必须是时间戳格式
            time: Joi
                .date()
                .timestamp(),
            // 必填, 必须可以转为Date类型的string
            birthday: Joi
                .string()
                .isoDate()
                .required(),
            // 有的话 必须是token格式 数组字母下划线
            _csrf: Joi
                .string()
                .token()
        },
        // 必须content-type application/json
        type: 'json',
        // 对返回的结构做限制,当返回code时 200/201的时候body里必须有 userId字段且为string,不能有限制外的字段
        output: {
            '200,201': {
                body: {
                    userId: Joi
                        .string()
                        .required(),
                    name: Joi.string()
                }
            },
            // 对返回的结构做限制,当返回code时 500-599的时候body 可以有error_code 数字,error_msg string
            "500-599": {
                body: { // this rule only runs when a status 500 - 600 is used
                    error_code: Joi.number(),
                    error_msg: Joi.string()
                }
            }
        }
    }
}, ctx => {
    ctx.status = 202;
    const error = {
        error_code: 222,
        error_msg: "error"
    }
    const userInfo = {
        userId: "id",
        name: "xx"
    }
    ctx.body = userInfo
})

module.exports = body
const router = require('koa-joi-router');
const Joi = router.Joi;

const qs = router()

// http://localhost:4000/qs?name=xx&age=23 { "name": "xx", "age": 23 }
// http://localhost:4000/qs?name=xx { "name": "xx", "age": 18 } 统一前缀
// http://localhost:4000/qs?name=xx&list=9&list=99 { "name": "xx", "list": [
// "9", "99" ], "age": 18 }

qs.prefix('/qs')

qs.get('/', {
    validate: {
        // qs验证
        query: {
            // 必填且为string
            name: Joi
                .string()
                .required(),
            // 数组
            list: Joi.array(),
            // 必须是数字且最大88 如果没有默认18
            age: Joi
                .number()
                .max(88)
                .default(18)
        }
    }
}, ctx => {
    const {request} = ctx
    ctx.body = request.query
})

module.exports = qs
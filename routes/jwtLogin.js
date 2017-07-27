const router = require('koa-joi-router');
const Joi = router.Joi;
const redis = require("redis");
const uuidV1 = require('uuid/v1');
const bluebird = require('bluebird')
const jwt = require('jsonwebtoken');
const koajwt = require('koa-jwt');
const config = require('../config/conf')
try {
    const client = redis.createClient(
        {host:'redis'}
    );
} catch (error) {
    console.log(error);
}

const jwtRoute = router()
// 从cookies获取token app.use(koajwt({secret: 'A very secret key', cookie:
// 'X-Token'}));
const jwtAuthMiddleWare = koajwt({
    secret: config.jwtKey,
    getToken: ctx => ctx.get(config.tokenField)
})
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

jwtRoute.prefix('/jwt')

jwtRoute.post('/signup', {
    validate: {
        // json 类型
        type: 'json',
        body: {
            // 必填
            username: Joi
                .string()
                .required(),
            // 必填 字符长度限制
            password: Joi
                .string()
                .min(6)
                .max(11)
                .required()
        }
    }
}, async(ctx) => {
    const {request} = ctx
    const {body} = request
    // 通过验证后 获得参数 定义 redis里 账户key个格式
    const key = `${body.username}:${body.password}`

    // 如果发现以前有这个账户 则返回msg
    const exist = await client.existsAsync(key)

    if (exist) {
        ctx.status = 200
        ctx.body = {
            code: 1,
            msg: "you already have a account"
        }
        return
    }
    // 如果是新账户 添加账户信息进redis

    client
        .multi()
        .hset(key, "username", body.username)
        .hset(key, "password", body.password)
        .execAsync()
    ctx.body = key
})

jwtRoute.post('/login', {
    validate: {
        type: 'json',
        body: {
            username: Joi
                .string()
                .required(),
            password: Joi
                .string()
                .min(6)
                .max(11)
                .required()
        }
    }
}, async(ctx) => {
    const {request} = ctx
    const {body} = request
    const key = `${body.username}:${body.password}`

    // 查找是否有这个账户
    const exist = await client.existsAsync(key)

    // 没有返回msg
    if (!exist) {
        ctx.status = 200
        ctx.body = {
            code: 1,
            msg: "name or password wrong"
        }
        return
    }

    // 有账户的话就生成token
    const id = uuidV1()
    const token = jwt.sign({
        username: body.username, // 自定义数据
        id: id, // 自定义数据
        iss: config.jwtIss, // 处理jwt的名称
        iat: Date.now() // 创建token的时间
    }, config.jwtKey) // 盐

    // 添加 用户id为key token为value到redis 并设置失效时长

    client
        .multi()
        .setex(id, config.tokenExpire, token)
        .execAsync()

    // 把 token设置到header 或者 cookies也行
    ctx
        .response
        .set(config.tokenField, token)
    ctx.body = token

});

jwtRoute.get('/getInfo', jwtAuthMiddleWare, async(ctx) => {
    // token 解码后 会放到ctx.state.user 里
    const {user} = ctx.state
    // 查找是否有这个id的信息 - 查看是否已过期
    const exist = await client.existsAsync(user.id);

    if (exist) {
        // 没过期就更新过期时间
        ctx.body = user
        client
            .multi()
            .expire(user.id, config.tokenExpire)
            .execAsync()
    } else {
        // 过期返回信息
        ctx.body = 'token 已过期'
    }
})

module.exports = jwtRoute
const Koa = require('koa');
const session = require('koa-session');
const redisStore = require('koa-redis');
const path = require('path')

const staticCache = require('koa-static-cache')
const responseTime = require('koa-response-time');
const logger = require('koa-logger')

const qs = require('./routes/qs')
const params = require('./routes/params')
const fileUpload = require('./routes/fileUpload')
const body = require('./routes/body')
const sessionRoute = require('./routes/session')
const jwtRoute = require('./routes/jwtLogin')
const sendFile = require('./routes/sendFile')
const config = require('./config/conf')


const app = new Koa();

// 用户 signed cookies 的盐
app.keys = config.cookieSignKey

// 日志输出
app.use(logger())
// 对静态资源添加etag
app.use(staticCache(path.join(__dirname, config.staticPath)))
// 添加相应时间header
app.use(responseTime());

// session 设置 redis存储
app.use(session({
    store: redisStore(),
    maxAge: config.sessionMaxAge
}, app));

// const public = router();
app.use(qs.middleware())
app.use(params.middleware())
app.use(fileUpload.middleware())
app.use(body.middleware())
app.use(sessionRoute.middleware())
app.use(jwtRoute.middleware())
app.use(sendFile.middleware())

// 处理任何未处理的报错
app.on('error', (err, ctx) => console.error('server error', err, ctx));

// 可以启动多个端口实例,运行一套路由,一般用于http和https同时启用
app.listen(3000);
app.listen(4000);

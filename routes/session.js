const router = require('koa-joi-router');
const Joi = router.Joi;

const session = router()

session.prefix('/session')

session.get('/count', ctx => {
    // index 设置了session 并且直接录入redis
    let n = ctx.session.views || 0;
    ctx.session.views = ++n;
    ctx.body = n + ' views';
    // 设置cookies
    ctx
        .cookies
        .set('name', 'tobi', {signed: true});
})

session.get('/remove', ctx => {
    ctx.session = null;
    // 获取cookies
    ctx.body = ctx
        .cookies
        .get("name", {signed: true})
})

module.exports = session
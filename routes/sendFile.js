const router = require('koa-joi-router');
const send = require('koa-send');
const path = require('path')
const Joi = router.Joi;

const sendFile = router()

sendFile.prefix('/sendFile')

sendFile.get('/', async(ctx) => {
    const {response} = ctx
    response.set('Content-Disposition', 'attachment; filename=a.txt')
    await send(ctx, path.resolve(__dirname, '/public/a.txt'));
})

module.exports = sendFile
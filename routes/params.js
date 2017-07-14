const router = require('koa-joi-router');
const Joi = router.Joi;

const params = router()

params.prefix('/params')

// http://localhost:4000/params/123
// {
// "id": 123
// }
params.get('/:id', {
    validate: {
        params: {
            id: Joi
                .number()
                .required()
        }
    }
}, ctx => {
    const {request} = ctx
    ctx.body = request.params
})

module.exports = params
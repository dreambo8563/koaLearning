const router = require('koa-joi-router');
const Joi = router.Joi;
const fs = require('fs')
const path = require('path')
const conf = require('../config/conf')

const fileUpload = router()

// postman formdata body - xx file xx.jpg body - name vincent
fileUpload.prefix('/fileupload')
fileUpload.post('/', {
    validate: {
        type: 'multipart',
        // 大小限制
        limit: conf.fileLimit
    }
}, async(ctx) => {
    const parts = ctx.request.parts;
    let part;

    try {
        while ((part = await parts)) {
            // do something with the incoming part stream part.pipe(someOtherStream);
            // console.log(part);
            part.pipe(fs.createWriteStream(path.join('./upload', part.filename)))
        }
    } catch (err) {
        // handle the error
        console.log(err);
    }

    console.log(parts.field); // form data
    ctx.body = "good"

})

module.exports = fileUpload
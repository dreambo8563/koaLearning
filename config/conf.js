const conf = {
    fileLimit: '100kb',
    jwtKey: 'jwtSecretKey',
    tokenField: 'x-token',
    jwtIss: 'koa-node',
    tokenExpire: 100,
    staticPath: '/public',
    cookieSignKey: ['cookiesKeys'],
    sessionMaxAge: 1000 *60 //60s
}

module.exports = conf
// 通过vue.config.js修改webpack的默认配置
module.exports = {
    chainWebpack: config => {
        config.when(process.env.NONE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')
        })

        config.when(process.env.NONE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
        })
    }
}
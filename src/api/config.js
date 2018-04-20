// 配置线上环境和线下环境

let baseUrl
let routerMode = 'history'
let imgBaseUrl = ''

if (process.env.NODE_ENV === 'development') {
  baseUrl = 'http://192.168.3.47:8080' // http://192.168.3.44:8080
} else if (process.env.NODE_ENV === 'production') {
  baseUrl = 'http://fangsir007.com:9999' // http://fangsir007.com:9999
}

export {
  baseUrl,
  routerMode,
  imgBaseUrl
}

import axios from 'axios';

// 拦截请求
axios.interceptors.request.use((config) => {
  config.withCredentials = true
  // message.loading('加载中', 0)
  return config
})

// 拦截相应

axios.interceptors.response.use(function (config) {
  // message.destroy()
  return config
})

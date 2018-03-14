import axios from 'axios'
import { baseUrl } from './config'

export default {
  get: function(url, data = null) {
    var result = axios({
      method: 'get',
      params: data,
      url: baseUrl + url
    })
    return result
  },
  post: function(url, data) {
    var result = axios({
      method: 'post',
      url: baseUrl + url,
      data: data
    })
    return result
  },
  url: function(url) {
    return baseUrl + url
  },
  formData: function (url, data) {
    var result = axios({
      method: 'post',
      url: baseUrl + url,
      data: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }]
    })
    return result
  }
}

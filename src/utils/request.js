import axios from 'axios'
import { Loading, Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

let loading

function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

function endLoading() {
  loading.close()
}

let needLoadingRequestCount = 0

export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

// 创建axios实例
const service = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  withCredentials: true,
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 60000 // 请求超时时间,
})
// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    showFullScreenLoading()
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    tryHideFullScreenLoading()
    const res = response.data
    // 返回的状态码不是200
    if (res.code !== 200 && res.code !== '200') {
      console.log('返回的状态码不是200')
      Message({
        message: res.message || res.msg,
        type: 'error',
        duration: 3 * 1000
      })
      // 500:非法的token; 512:其他客户端登录了;  514:Token 过期了;
      if (res.code === 499 || res.code === 501 || res.code === 502) {
        MessageBox.confirm(
          '获取信息失败，服务器连接出现错误',
          '确定登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    tryHideFullScreenLoading()
    console.log('服务器端返回错误状态：', error) // for debug
    console.dir(error)
    if (error.stack.includes('timeout')) {
      Message({
        message: '服务器响应时间超时！请确保网络环境通畅后重试！',
        type: 'error',
        duration: 3 * 1000
      })
    } else {
      Message({
        message: error.message || error.msg || error,
        type: 'error',
        duration: 3 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service

import request from '@/utils/request'

export function login(username, password, year, admdivcode) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password,
      year,
      admdivcode
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}

export function getYearAndAdmdiv() {
  console.log('获取下拉请求发送')
  return request({
    url: '/yearAndAdmdiv',
    method: 'get'
  })
}
// /yearAndAdmdiv

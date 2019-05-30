// 基础资料的api
import request from '@/utils/request'

export function getTree(urlPath) {
  if (urlPath === '/sys/user') {
    return request({
      url: '/sys/user/findAllGroups',
      method: 'get'
    })
  }
  if (urlPath === '单位用户') {
    return request({
      url: '/sys/user/getGroupByTypeAndId?userType=2',
      method: 'get'
    })
  }
  if (urlPath === '银行用户') {
    return request({
      url: '/sys/user/getGroupByTypeAndId?userType=3',
      method: 'get'
    })
  }
  return request({
    url: urlPath + '/tree',
    method: 'get'
  })
}

// 获取所有列表信息，暂时是全部列表。
// desc=desc，就降序，不然升序。
// order:字段名，按该字段名来排序。
// params是一个对象，{pid:guid的值,desc:xxx,order:xxx}
export function getTableListInfo(urlPath, params) {
  // if (urlPath === '/sys/user') {
  //   return request({
  //     url: '/sys/user/getUserByGroupId',
  //     method: 'get',
  //     params
  //   })
  // }

  return request({
    url: urlPath + '/find',
    method: 'get',
    params
  })
}

// 获取详细信息,需要传值为{guid:xxx}
export function getDetail(urlPath, params) {
  if (urlPath === '/sys/user') {
    return request({
      url: '/sys/user/getUserByGroupId',
      method: 'get',
      params: {
        id: params.guid
      }
    })
  }
  return request({
    url: urlPath + '/get',
    method: 'get',
    params
  })
}

// 获取资金性质列表弹层中的数据
export function getFundType() {
  var url = `/bas/basFundtype/find`
  var params = {
    isenabled: 1
  }
  return request({
    url,
    method: 'get',
    params
  })
}

// 获取资金性质列表弹层中的数据
export function getBasChargetype() {
  var url = `/bas/basChargetype/find`
  var params = {
    isenabled: 1
  }
  return request({
    url,
    method: 'get',
    params
  })
}

// 获取银行汇缴结算户列表弹层中的数据
export function getBankAccount() {
  var url = `/bas/basRemittedbank/find?pid=-1`
  return request({
    url,
    method: 'get'
  })
}

// 获取票据购领证页面中的领用票据仓库下拉数据。
// basBillStorage
export function getBasBillStorage() {
  var url = `/bas/basBillstorage/find?pid=-1`
  return request({
    url,
    method: 'get'
  })
}

// 票据领用证页面的 获取 领用证对应收费单位的列表
// findPermit2Agency
export function getGrantTree(params, urlPath) {
  var url = `/authority/query/find${urlPath}`
  console.log('getGrantTree', url)
  console.log('getGrantTree', params)
  return request({
    url,
    method: 'get',
    params
  })
}

export function saveGrant(params, urlPath) {
  var url = `/authority/update/update${urlPath}`
  return request({
    url,
    method: 'post',
    data: params
  })
}

export function findYearCheck(guid) {
  var url = '/bas/basBillpermit/findYearCheck?guid=' + guid
  console.log('发送的年检数据guid为：', guid)
  return request({
    url,
    method: 'get'
  })
}

// 获取领用证对应项目。
export function getPermit2Project(guid) {
  var url = '/authority/query/findPermit2Project?guid=' + guid
  return request({
    url,
    method: 'get'
  })
}

// 获取领用证对应项目。
// http://127.0.0.1:8899/webapi/authority/query/findPolProjectFnoPrj?fnoId=402810816a6cbb1c016a6cda4cef000a
export function findPolProjectFnoPrj(guid) {
  var url = '/authority/query/findPolProjectFnoPrj?fnoId=' + guid
  return request({
    url,
    method: 'get'
  })
}
// 密码重置
// http://10.2.1.123:88/sys/user/initialUserPwd?userid=1
export function pwdReset(params) {
  var url = '/sys/user/initialUserPwd'
  return request({
    url,
    method: 'post',
    params

  })
}

// 批量添加管理员
// http://10.2.1.123:88/sys/user/batchCreateAdmUser
export function batchCreateAdmUser(params) {
  var url = '/sys/user/batchCreateAdmUser'
  return request({
    url,
    method: 'get'
  })
}

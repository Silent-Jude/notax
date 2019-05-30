import request from '@/utils/request'

// 获取全部非税收入类别
export function getChargetype() {
  return request({
    url: '/bas/basChargetype/find?isenabled=1',
    method: 'get'
  })
}

// 获取全部票据种类信息
export function getBillInfos() {
  return request({
    url: '/bas/basBillinfo/find?isenabled=1',
    method: 'get'
  })
}

// 仓库列表
export function getStorages() {
  return request({
    url: '/bas/basBillstorage/find?isleaf=1',
    method: 'get'
  })
}

// 获取全部资金性质弹层
export function getFundtype() {
  return request({
    url: '/bas/basFundtype/find?isenabled=1',
    method: 'get'
  })
}

// 获取全部预算科目名称弹层
export function getBudgetsubject() {
  return request({
    url: '/bas/basBudgetsubject/find?isenabled=1',
    method: 'get'
  })
}

// 获取全部会计科目名称弹层
// 暂时不做。
// export function getBudgetsubject() {
//   return request({
//     url: '/bas/basBudgetsubject/find?isenabled=1',
//     method: 'get'
//   })
// }

export function getStockIns(flag, pageIndex, pageSize, startDate, endDate, filterName, filterValue, billId, track, billNumber) {
  console.log('ajax--------------------------------------')
  return request({
    url: '/bill/bilStorage/list',
    method: 'get',
    params: {
      flag,
      pageIndex,
      pageSize,
      startDate,
      endDate,
      filterName,
      filterValue,
      billId,
      track,
      billNumber
    }
  })
}

export function getCodeLabelDictionary() {
  return request({
    url: '/sys/sysDatadictionary/allCodeValue',
    method: 'get'
  })
}

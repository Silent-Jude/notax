import request from '@/utils/request'

export default {
  // 查询
  // http://10.2.1.123:88/bank/getTrack?payBillNo=0011842984&track=2018
  getTrack(params) {
    var url = `/bank/getTrack?payBillNo=${params.payBillNo}&track=${params.track}`
    return request({
      url,
      method: 'get'
    })
  },

  // 收款
  // http://10.2.1.123:88/bank/chargeTrade?bankid=1&banksn=1&branchid=1&chargedate=1&guid=8a902ec36a33955d016a44007c400273&payee=1
  chargeTrade(params) {
    console.log(params)
    var url = `/bank/chargeTrade?bankid=${params.bankid}&banksn=${params.banksn}&branchid=${params.branchid}&chargedate=${params.chargedate}&guid=${params.guid}&payee=${params.payee}`
    return request({
      url,
      method: 'get'
    })
  },

  // 取消收款
  // http://10.2.1.123:88/bank/unChargeTrade?guid=8a902ec36a33955d016a44007c400273
  unChargeTrade(params) {
    console.log(params)
    var url = `/bank/unChargeTrade?guid=${params.guid}`
    return request({
      url,
      method: 'get'
    })
  },

  // 银行名称
  // http://10.2.1.123:88/bas/basRemittedbank/find?isenabled=1
  basRemittedbank() {
    var url = `/bas/basRemittedbank/find?isenabled=1`
    return request({
      url,
      method: 'get'
    })
  },

  // 按银行汇总
  // http://10.2.1.123/bank/findBankSummary?bankId=1&chargeEndDate=1&chargeStartDate=1&filter=1&pageIndex=1&pageSize=10&selectedValue=1&tradeEndDate=1&tradeStartDate=1
  findBankSummary(params) {
    var url = `/bank/findBankSummary?bankId=${params.bankId}&chargeEndDate=${params.chargeEndDate}&chargeStartDate=${params.chargeStartDate}&filter=${params.filter}&pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&selectedValue=${params.selectedValue}&tradeEndDate=${params.tradeEndDate}&tradeStartDate=${params.tradeStartDate}`
    return request({
      url,
      method: 'get'
    })
  },

  // 全部
  // http://10.2.1.123/bank/findBankFundsDaily?bankId=1&chargeEndDate=1&chargeStartDate=1&filter=1&pageIndex=1&pageSize=10&selectedValue=1&tradeEndDate=1&tradeStartDate=1
  findBankFundsDaily(params) {
    var url = `/bank/findBankFundsDaily?bankId=${params.bankId}&chargeEndDate=${params.chargeEndDate}&chargeStartDate=${params.chargeStartDate}&filter=${params.filter}&pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&selectedValue=${params.selectedValue}&tradeEndDate=${params.tradeEndDate}&tradeStartDate=${params.tradeStartDate}`
    return request({
      url,
      method: 'get'
    })
  },

  // 自动对账
  // http://10.2.1.123/bank/checkFounds?bankid=838383834b439e0b014b4d87c38f0f8b&endDateStr=2018-01-30&startDateStr=2018-01-01
  checkFounds(params) {
    var url = `/bank/checkFounds?bankid=${params.bankId}&endDateStr=${params.chargeEndDate}&startDateStr=${params.chargeStartDate}`
    return request({
      url,
      method: 'get'
    })
  },

  // 指派单位
  // http://10.2.1.123/bas/basChargeagency/find?isenabled=1
  basChargeagency(params) {
    var url = `/bas/basChargeagency/find?isenabled=1`
    return request({
      url,
      method: 'get'
    })
  },

  // 指派
  // http://10.2.1.123/bank/changeAgencyID?agencyId=A9F884DFC3C94FC58DC0103E82E6E0D6&fundId=758788691DC64A3FA39875033E305D5C
  changeAgencyID(fundId, agencyId) {
    var url = `/bank/changeAgencyID?agencyId=${agencyId}&fundId=${fundId}`
    return request({
      url,
      method: 'get'
    })
  },
  // 资金
  // http://10.2.1.123/bank/findBankFundsDailyGridZZ
  findBankFundsDailyGridZZ(bankGuid, params) {
    console.log('bankGuid', bankGuid)
    console.log('params', params)
    var url = `/bank/findBankFundsDailyGridZZ?bankGuid=${bankGuid}&edate=${params.edate}&pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&sdate=${params.sdate}&selectedValue=${params.selectedValue}&value=${params.value}`
    // url = `/bank/findBankFundsDailyGridZZ?bankGuid=${'8a903a8d3d8c367c013d8fced49a000b'}&edate=${'2019-4-28'}
    // &pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&sdate=${'2010-01-01'}&selectedValue=${params.selectedValue}&value=${params.value}`
    return request({
      url,
      method: 'get'
    })
  },

  // 收入
  // http://10.2.1.123/bank/findBankFundsDailyGridSR?bankGuid=8a903a8d3d8c367c013d8fced49a000b&pageIndex=1&pageSize=1
  findBankFundsDailyGridSR(bankGuid, params) {
    console.log('bankGuid', bankGuid)
    console.log('params', params)
    var url = `/bank/findBankFundsDailyGridSR?bankGuid=${bankGuid}&pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&selectedValue=${params.selectedValue}&value=${params.value}`
    return request({
      url,
      method: 'get'
    })
  },

  // 手工对账
  // http://10.2.1.123/bank/manualFound
  manualFound(foundGUID, tradeGUID) {
    var url = `/bank/manualFound?foundGUID=${foundGUID}&tradeGUID=${tradeGUID}`
    return request({
      url,
      method: 'get'
    })
  },

  // 修改前查询
  // /bank/getColFund
  getColFund(guid) {
    var url = `/bank/getColFund?guid=${guid}`
    return request({
      url,
      method: 'get'
    })
  },

  // 修改
  // http://10.2.1.123/bank/updateColFund
  updateColFund(params) {
    var url = `/bank/updateColFund`
    return request({
      url,
      method: 'post',
      params
    })
  }

}

import request from '@/utils/request'

export default {
// 直接缴汇
// 查询
// http://10.2.1.123/billing/query/colTradeByCondition?pageIndex=1&pageSize=1
  basChargeagency(params) {
    var url = `/billing/query/colTradeByCondition`
    return request({
      url,
      method: 'get',
      params
    })
  },
  getListPrintData(param) {
    var params = JSON.parse(JSON.stringify(param))
    params.pageSize = '10000'
    return request({
      url: `/billing/query/colTradeByCondition`,
      method: 'get',
      params
    })
  },

  // 双击查询
  // http://10.2.1.123/billing/trade/get?guid=8a902ec36a33955d016a441b553d02b4
  billing(guid) {
    var url = `/billing/trade/get?guid=${guid}`
    return request({
      url,
      method: 'get'
    })
  },

  // 回单guid type 0回单 1取消
  // http://10.2.1.123/billing/trade/receipt
  receipt(guid, type) {
    var url = `billing/trade/receipt?guid=${guid}&type=${type}`
    return request({
      url,
      method: 'post'

    })
  },

  // 开票单位List
  basChargeagencyfind() {
    return request({
      url: '/bas/basChargeagency/find?isleaf=1&isenabled=1',
      method: 'get'
    }).then(res => {
      this.BasagencyList = res.data
    })
  },

  // 开票单位选择后查询
  getPayBillNo(datas) {
    return request({
      url: '/billing/query/getPayBillNo',
      method: 'get',
      params: {
        agencyId: datas.currentRow.guid,
        billId: this.billinfo.guid
      }
    }).then(res => {
      this.colTrade.track = res.data.track
      this.colTrade.paybillno = res.data.paybillno
    })
  },

  // billINFO
  billINFO() {
    request({
      url: '/billing/query/nontaxParamCodeToBillInfo',
      method: 'get',
      params: {
        code: '303001'
      }
    }).then(res => {
      // console.log('billINFO', res)
      this.billinfo = res.data
      this.colTrade.billid = res.data.guid
    })
  },

  // 加载单位库存
  findBillStoreAgencycheck(agency, billinfo) {
    return request({
      url: '/billing/query/findBillStoreAgencycheck',
      method: 'get',
      params: {
        agencyId: agency,
        billId: billinfo
      }
    })
  },

  // 收款银行
  basRemittedbank() {
    request({
      url: '/bas/basRemittedbank/find?isleaf=1&isenabled=1',
      method: 'get'
    }).then(res => {
      // console.log('r', res)
      this.BasRemittedbank = res.data
    })
  },

  // 付款人
  // 付款人LIST
  sysContributors(agency) {
    return request({
      url: 'bas/sysContributors/find',
      method: 'get',
      params: {
        isleaf: 1,
        isenabled: 1,
        agencyid: agency
      }
    })
  },

  // 添加项目
  agency2Project(agency) {
    return request({
      url: '/billing/query/agency2Project',
      method: 'get',
      params: {
        agencyId: agency
      }
    })
  },

  saveColTrade(colTrade) {
    // 'busitype': '', // 新增的时候 busitype 固定为 0000
    return request({
      url: '/billing/trade/saveColTrade',
      method: 'post',
      data: colTrade
    })
  },

  audit(guid, type) {
    // 审核反审
    // var url = '/billing/trade/auditTrade'
    var params = {
      guid: guid,
      type: type
    }
    return request({
      url: '/billing/trade/auditTrade',
      method: 'post',
      params: params
    })
  },

  // 删除
  // http://10.2.1.123/billing/trade/deleteColTrade?guid=1
  deleteColTrade(guid) {
    return request({
      url: `/billing/trade/deleteColTrade?guid=${guid}`,
      method: 'post'
    })
  },

  // 作废
  // http://10.2.1.123/billing/trade/cancelTrade?guid=11212&type=1
  cancelTrade(guid, type) {
    return request({
      url: `/billing/trade/cancelTrade?guid=${guid}&type=${type}`,
      method: 'post'
    })
  },

  // 集中汇缴
  // http://10.2.1.123/billing/query/findAgencyBillStore?agencyId=1
  findAgencyBillStore(agencyId) {
    return request({
      url: `/billing/query/findAgencyBillStore?agencyId=${agencyId}`
    })
  },

  //   /billing/query/checkBillNumber
  // 检查票号
  checkBillNumber(bilVerificationDetail) {
    console.log('bilVerificationDetail', bilVerificationDetail)
    return request({
      url: `/billing/query/checkBillNumber`,
      method: 'post',
      data: bilVerificationDetail
    })
  },

  // 查询校验位
  // http://10.2.1.123:88/bill/detectCheckmark?billid=1&endnum=1&startnum=1&track=1
  detectCheckmark(params) {
    return request({
      url: `/bill/detectCheckmark?billid=${params.billid}&endnum=${params.endnumber}&startnum=${params.startnumber}&track=${params.track}`
    })
  }
}

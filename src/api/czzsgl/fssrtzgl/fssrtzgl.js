import request from '@/utils/request'

export default {
  // 非税收入调整管理
  // list查询
  // http://10.2.1.123/applyAdj/list
  // http://10.2.1.123/applyAdj/list?pageIndex=1&pageSize=10&state=1
  list(params) {
    console.log('list', params)
    var url = `/applyAdj/list`
    return request({
      url,
      method: 'get',
      params
    })
  },
  // 删除
  // http://10.2.1.123/applyAdj/remove?guid=1
  remove(guid) {
    console.log('remove', guid)
    var url = `/applyAdj/remove?guid=${guid}`
    return request({
      url,
      method: 'post'
    })
  },
  // 送审
  // http://10.2.1.123/applyAdj/sendReported?guid=402810816aae9561016ab03c189a0023
  sendReported(guid) {
    console.log('sendReported', guid)
    var url = `/applyAdj/sendReported?guid=${guid}`
    return request({
      url,
      method: 'post'
    })
  },
  // 审核。http://10.2.1.123/applyAdj/audited
  // auditOpinion
  // guid
  // type
  billAudit(params) {
    // console.log(this.$route.meta.title)
    return request({
      url: '/applyAdj/audited',
      method: 'post',
      params
    })
  },
  // 查询
  // http://10.2.1.123/applyAdj/get?guid=402810816aae9561016ab04df706003b
  get(guid) {
    console.log('guid', guid)
    var url = `/applyAdj/get?guid=${guid}`
    return request({
      url,
      method: 'get'
    })
  },
  // 缴款书
  // http://10.2.1.123/financial/findTradeOfSelect?type=1
  findTradeOfSelect(type) {
    console.log('type', type)
    var url = `/financial/findTradeOfSelect?type=${type}`
    return request({
      url,
      method: 'get'
    })
  },

  // 单位对应项目
  // http://10.2.1.123/billing/query/agency2Project?agencyId=6F2D96130746C2744B46CBCDA2DC6DFD
  agency2Project(agencyId) {
    console.log('agencyId', agencyId)
    var url = `/billing/query/agency2Project?agencyId=${agencyId}`
    return request({
      url,
      method: 'get'
    })
  },
  // 选中缴款书查明细
  // http://10.2.1.123/financial/findColTradeDetailById?guid=6C41D3899411C71A56384780CA753C40
  findColTradeDetailById(guid) {
    console.log('guid', guid)
    var url = `/financial/findColTradeDetailById?guid=${guid}`
    return request({
      url,
      method: 'get'
    })
  },

  // 保存
  // http://10.2.1.123/applyAdj/save
  save(data) {
    data = JSON.parse(data)
    // 状态问题
    data.audited = '0'
    data.reported = '0'
    data.colApplyAdjDetails = {}
    var olddetails = data.olddetails
    var newDetails = data.newDetails
    olddetails = olddetails.map(item => {
      item.adjusted = '0'
      item.proid = item.pguid
      item.billid = data.billid
      item.year = data.year
      return item
    })
    newDetails = newDetails.map(item => {
      item.adjusted = '1'
      item.proid = item.pguid
      item.billid = data.billid
      item.year = data.year
      return item
    })
    data.colApplyAdjDetails.colApplyAdjDetail = olddetails.concat(newDetails)

    // data = {
    //   'accredit': '0',
    //   'admdivcode': '420822',
    //   'agencyid': 'DCEDE10D9BC576F5F981F2F29AD0BF04',
    //   'amt': 8000,
    //   'approved': '0',
    //   'auditdate': null,
    //   'audited': '0',
    //   'auditnote': null,
    //   'auditor': null,
    //   'bankagencyno': null,
    //   'bankcode': 'F5183EA3E0CBC106D8E018E14FDD10B0',
    //   'banksn': null,
    //   'billaudited': null,
    //   'billdate': '0001-01-01 00:00:00',
    //   'billid': '1B5C443DEDEA11B9D33C077EB82CC2F2',
    //   'branch': null,
    //   'canceldate': '0001-01-01 00:00:00',
    //   'cancelled': '0',
    //   'canceller': null,
    //   'charged': '0',
    //   'chargedate': '0001-01-01 00:00:00',
    //   'colApplyAdjDetails': {
    //     'colApplyAdjDetail': [
    //       {
    //       // 'adjid': 'string',
    //       // 'amt': 0,
    //       // 'banksn': 'string',
    //       // 'createdate': '2019-05-14T03:52:59.628Z',
    //       // 'creator': 'string',
    //       // 'guid': 'string',
    //       // 'idcode': 'string',
    //       // 'modifier': 'string',
    //       // 'modifydate': '2019-05-14T03:52:59.628Z',
    //       // 'num': 0,
    //       // 'operagc': 'string',
    //       // 'overduefine': 0,
    //       // 'remark': 'string',
    //       // 'track': 'string',
    //       // 'tradeid': 'string',

    //       // 调整标志 :0 调整前，1 调整后
    //         'adjusted': '1',
    //         // 外面billid
    //         'billid': '1B5C443DEDEA11B9D33C077EB82CC2F2',
    //         // proid->pguid
    //         'proid': '20E57D9CFD6A4C44E076D8A54353724C',
    //         'admdivcode': '420822',
    //         'year': '2019',

    //         'chargelower': '0-0',
    //         'pguid': '20E57D9CFD6A4C44E076D8A54353724C',
    //         'nontaxcode': '103042784',
    //         'num': 1,
    //         'guid': '402810816ab3bab5016ab42d81090010',
    //         'amt': 8000,
    //         'nontaxname': '保育费和教育费',
    //         'chargeunit': '元'
    //       }]
    //   },
    //   'collectbankacctno': null,
    //   'collectbankcode': null,
    //   'collected': '0',
    //   'confirm': '0',
    //   'createdate': '2019-05-14 00:00:00',
    //   'creator': 'TBYF',
    //   'derated': '0',
    //   'drawer': null,
    //   'guid': '402810816ab3bab5016ab42d8104000e',
    //   'hallno': null,
    //   'hitinacctdate': '0001-01-01 00:00:00',
    //   'instead': '0',
    //   'modifier': null,
    //   'modifydate': '0001-01-01 00:00:00',
    //   'noticeno': 'ADJ20190514000004',
    //   'num': 0,
    //   'operagc': null,
    //   'outputted': '0',
    //   'payee': '常兵',
    //   'payer': '沙洋县食品药品监督局',
    //   'payerbankacctno': null,
    //   'payerbankname': null,
    //   'permit': null,
    //   'proid': null,
    //   'receipted': '0',
    //   'remark': null,
    //   'reportdate': null,
    //   'reported': '0',
    //   'reporter': null,
    //   'safecode': null,
    //   'track': '2018',
    //   'tradedate': '2019-01-22 00:00:00',
    //   'tradeid': '10D91FFA795FC01740F11CC1E1224448',
    //   'tradeno': null,
    //   'year': '2019'
    // }
    var datas = JSON.stringify(data)
    console.log('datas', datas)

    return request({
      url: '/applyAdj/save',
      method: 'post',
      data: datas
    })
  }
}

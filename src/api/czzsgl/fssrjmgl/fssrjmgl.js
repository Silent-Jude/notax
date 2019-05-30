import request from '@/utils/request'

export default {

  // 开票单位List
  basChargeagencyfind() {
    return request({
      url: '/bas/basChargeagency/find?isleaf=1&isenabled=1',
      method: 'get'
    })
  },
  // 非税收入管理
  // list查询---
  // http://10.2.1.123/applyDer/list?pageIndex=1&pageSize=10&state=1
  list(params) {
    console.log('list', params)
    var url = `/applyDer/list`
    return request({
      url,
      method: 'get',
      params
    })
  },
  // 删除-------
  // http://10.2.1.123/applyDer/remove
  remove(guid) {
    console.log('remove', guid)
    var url = `/applyDer/remove?guid=${guid}`
    return request({
      url,
      method: 'post'
    })
  },

  // 送审-----
  // http://10.2.1.123/applyDer/sendReported
  sendReported(guid) {
    console.log('sendReported', guid)
    var url = `/applyDer/sendReported?guid=${guid}`
    return request({
      url,
      method: 'post'
    })
  },

  // 审核。--------
  // auditOpinion
  // guid
  // type
  billAudit(params) {
    // console.log(this.$route.meta.title)
    return request({
      url: '/applyDer/audited',
      method: 'post',
      params
    })
  },
  // 查询-------
  // http://10.2.1.123/applyDer/get
  get(guid) {
    console.log('guid', guid)
    var url = `/applyDer/get?guid=${guid}`
    return request({
      url,
      method: 'get'
    })
  },
  // 缴款书----
  // http://10.2.1.123/financial/findTradeOfSelect?type=1
  findTradeOfSelect(agencyid, type) {
    console.log('type', type)
    var url = `/financial/findTradeOfSelect?type=${type}&agencyId=${agencyid}`
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
  // 选中缴款书查明细------
  // http://10.2.1.123/financial/findColTradeDetailById?guid=6C41D3899411C71A56384780CA753C40
  findColTradeDetailById(guid) {
    console.log('guid', guid)
    var url = `/financial/findColTradeDetailById?guid=${guid}`
    return request({
      url,
      method: 'get'
    })
  },

  // 保存----
  // http://10.2.1.123/applyDer/save
  save(data) {
    data = JSON.parse(data)
    data.colApplyDerDetail = {}
    data.colApplyDerDetail.colApplyDerDetail = data.details

    // data = {
    //   'admdivcode': '420822',
    //   'agencyid': '111EDDAF8031555840BBCFEA9C86F9BA',
    //   'auditdate': null,
    //   'audited': '0',
    //   'auditnote': null,
    //   'auditor': null,
    //   'causa': '123123',
    //   'colApplyDerDetail': {
    //     'colApplyDerDetail':
    //     [{
    //       'standard': null,
    //       'creator': null,
    //       'remart': '0',
    //       'year': '2019',
    //       'num': 1,
    //       'modifier': null,
    //       'amt': 40000,
    //       'createdate': '2019-04-24 00:00:00',
    //       'remark': null,
    //       'nontaxname': '普通高中学费',
    //       'admdivcode': '420822',
    //       'chargeunit': '元',
    //       'chargelower': 0,
    //       'modifydate': '0001-01-01 00:00:00',
    //       'nontaxcode': '103042753',
    //       'proid': 'C30C071B3DA1651AB4BABB56AC10FA97',
    //       'operagc': null,
    //       'guid': '402810816a4ae418016a4e1891700032',
    //       'actamt': 40000,
    //       'derid': '402810816a4ae418016a4e18916c0031',
    //       'deramt': 0,
    //       'chargelimit': 0
    //     },
    //     {
    //       'standard': null,
    //       'creator': null,
    //       'remart': '0',
    //       'year': '2019',
    //       'num': 1,
    //       'modifier': null,
    //       'amt': 4340,
    //       'createdate': '2019-04-24 00:00:00',
    //       'remark': null,
    //       'nontaxname': '住宿费',
    //       'admdivcode': '420822',
    //       'chargeunit': '元',
    //       'chargelower': 0,
    //       'modifydate': '0001-01-01 00:00:00',
    //       'nontaxcode': '103042781',
    //       'proid': '80A409BF3E377C9A5F8725EFDADE4FDE',
    //       'operagc': null,
    //       'guid': '402810816a4ae418016a4e1891700033',
    //       'actamt': 4217,
    //       'derid': '402810816a4ae418016a4e18916c0031',
    //       'deramt': 123,
    //       'chargelimit': 0
    //     },
    //     {
    //       'standard': null,
    //       'creator': null,
    //       'remart': '0',
    //       'year': '2019',
    //       'num': 1,
    //       'modifier': null,
    //       'amt': 15086,
    //       'createdate': '2019-04-24 00:00:00',
    //       'remark': null,
    //       'nontaxname': '书本费',
    //       'admdivcode': '420822',
    //       'chargeunit': '元',
    //       'chargelower': 0,
    //       'modifydate': '0001-01-01 00:00:00',
    //       'nontaxcode': '1031307',
    //       'proid': 'DDFB22EB0D3ECA6F933E3BF95031FE0C',
    //       'operagc': null,
    //       'guid': '402810816a4ae418016a4e1891700034',
    //       'actamt': 14873,
    //       'derid': '402810816a4ae418016a4e18916c0031',
    //       'deramt': 213,
    //       'chargelimit': 0
    //     }
    //     ]
    //   },
    //   'createdate': '2019-04-24 00:00:00',
    //   'creator': 'TBYF',
    //   'deridx': '123123',
    //   'dertype': '缓征',
    //   'guid': '402810816a4ae418016a4e18916c0031',
    //   'instead': '0',
    //   'modifier': 'TBYF',
    //   'modifydate': '2019-05-15 00:00:00',
    //   'operagc': null,
    //   'operator': null,
    //   'receipno': 'JMK20190424000002',
    //   // 'receipNo': 'JMK20190424000002',
    //   'remark': '0AD5ABA1E00169C7571D238E6A197BE0',
    //   'reportdate': null,
    //   'reported': '0',
    //   'reporter': null,
    //   'tradeid': null,
    //   'writedate': '2019-04-25 00:00:00',
    //   'writer': '21',
    //   'year': '2019'
    // }
    var datas = JSON.stringify(data)
    console.log('datas', datas)

    return request({
      url: '/applyDer/save',
      method: 'post',
      data: datas
    })
  }
}

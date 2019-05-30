import request from '@/utils/request'

export default {

  // 开票单位List
  basChargeagencyfind() {
    return request({
      url: '/bas/basChargeagency/find?isleaf=1&isenabled=1',
      method: 'get'
    })
  },
  // 非税收入退付管理++++++
  // list查询---
  // http://10.2.1.123/applyRfd/list
  list(params) {
    console.log('list', params)
    var url = `/applyRfd/list`
    return request({
      url,
      method: 'get',
      params
    })
  },
  // 删除-------+++++
  // http://10.2.1.123/applyRfd/remove
  remove(guid) {
    console.log('remove', guid)
    var url = `/applyRfd/remove?guid=${guid}`
    return request({
      url,
      method: 'post'
    })
  },

  // 送审-----+++++
  // http://10.2.1.123/applyRfd/sendReported
  sendReported(guid) {
    console.log('sendReported', guid)
    var url = `/applyRfd/sendReported?guid=${guid}`
    return request({
      url,
      method: 'post'
    })
  },

  // 审核。--------++++
  // auditOpinion
  // guid
  // type
  billAudit(params) {
    // console.log(this.$route.meta.title)
    return request({
      url: '/applyRfd/audited',
      method: 'post',
      params
    })
  },
  // 查询-------+++
  // http://10.2.1.123/applyRfd/get
  get(guid) {
    console.log('guid', guid)
    var url = `/applyRfd/get?guid=${guid}`
    return request({
      url,
      method: 'get'
    })
  },
  // 缴款书----++++
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

  // 保存----+++
  // http://10.2.1.123/applyRfd/save
  save(data) {
    data = JSON.parse(data)
    data.colApplyRfdDetail = {}
    data.audited = '0'
    data.confirm = '0'
    data.receipted = '0'
    data.colApplyRfdDetail.colApplyRfdDetail = data.details.filter(item => item.st === true)
    var datas = JSON.stringify(data)
    console.log('datas', datas)

    return request({
      url: '/applyRfd/save',
      method: 'post',
      data: datas
    })
  }
}

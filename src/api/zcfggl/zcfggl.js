import request from '@/utils/request'

export default {
  polProjectFnoFileLib(params) {
    // http://127.0.0.1/pol/polProjectFnoFileLib/find?fnofile_like=1&agencyname_like=123&flevel=D112_01&ftype=D113_01&startDate=2019-01-01&endDate=2019-01-01
    return request({
      url: `/pol/polProjectFnoFileLib/find`,
      method: 'get',
      params

    })
  },
  ftopic_like(params) {
    console.log('params', params)
    // http:// 127.0.0.1/pol/polProjectFnoFileLib/find?ftopic_like=%E5%BE%85%E5%BD%95%E5%85%A5&startDate=2019-01-01&endDate=2019-01-01
    return request({
      url: `/pol/polProjectFnoFileLib/find`,
      method: 'get',
      params
    })
  },
  // 获取全部非税收入类别
  getChargetype() {
    return request({
      url: '/bas/basChargetype/find?isenabled=1',
      method: 'get'
    })
  },

  // http://10.2.1.123/bas/basChargeproject/find?isenabled=1
  basChargeproject() {
    return request({
      url: '/bas/basChargeproject/find?isleaf=1&isenabled=1',
      method: 'get'
    })
  },
  // 项目库存查询
  findChargeAgencyChgPro(params) {
    // http:// 127.0.0.1:8899/webapi/bas/basChargeproject/find?chargetypeguid=79F28526191BBB0D3921DACAB7CF87B7&guid=AC1F703FA6752A06FF44D1880051A48D
    return request({
      url: `bas/basChargeproject/find?chargetypeguid=${params.chargetypeguid}&guid=${params.guid}&${params.key}=${params.val}`,
      method: 'get'
    })
  },
  // 查询文号对应收费项目
  // http://10.2.1.123/authority/query/findPolProjectFnoPrj?projectId=1
  findPolProjectFnoPrj(guid) {
    return request({
      url: `authority/query/findPolProjectFnoPrj?projectId=${guid}`,
      method: 'get'
    })
  },
  // 单位名称
  // http://10.2.1.123/bas/basChargeagency/find
  basChargeagency(guid) {
    return request({
      url: `/bas/basChargeagency/find?isleaf=1&isenabled=1`,
      method: 'get'
    })
  },
  // 单位收费项目
  // http://10.2.1.123/pol/polProjectFnoFileLib/findChargeAgencyChgPro
  findChargeAgencyChgProPs(params) {
    console.log('params', params)
    return request({
      url: `/pol/polProjectFnoFileLib/findChargeAgencyChgPro`,
      method: 'post',
      params
    })
  },
  // 单位详情左边
  // http://127.0.0.1:8899/webapi/bas/basChargeagency/get?guid=074C90443430B091AD98401C20566507
  basChargeagencyget(guid) {
    // console.log('guid', guid)
    return request({
      url: `/bas/basChargeagency/get?guid=${guid}`,
      method: 'get'
    })
  },
  // 单位详情右边上
  // http://127.0.0.1:8899/webapi/authority/query/findChgAgency2Chgpro?agencyId=BFEE402F161652AF6D470D4517D5C8D5
  findChgAgency2Chgpro(agencyId) {
    // console.log('agencyId', agencyId)
    return request({
      url: `/authority/query/findChgAgency2Chgpro?agencyId=${agencyId}`,
      method: 'get'
    })
  },
  // 单位详情右边下
  // http://10.2.1.123/authority/query/findAgencyId2Bill?agencyId=111EDDAF8031555840BBCFEA9C86F9BA
  findAgencyId2Bill(agencyId) {
    // console.log('agencyId', agencyId)
    return request({
      url: `/authority/query/findAgencyId2Bill?agencyId=${agencyId}`,
      method: 'get'
    })
  }
}

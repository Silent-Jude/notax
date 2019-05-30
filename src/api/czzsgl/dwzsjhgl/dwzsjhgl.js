import request from '@/utils/request'
export default {
  // 单位征收计划配置
  // 查询
  // http://10.2.1.123/plan/conf/list?year=1
  list(year) {
    console.log('year', year)
    // var url = `/plan/conf/list`
    var url = `/plan/conf/list?year=${year}`
    return request({
      url,
      method: 'get'
    })
  },
  // 单位征收计划配置
  // 删除
  // http://10.2.1.123/plan/conf/remove?guid=1
  remove(guid) {
    var url = `/plan/conf/remove?guid=${guid}`
    return request({
      url,
      method: 'post'
    })
  },
  // 单位征收计划配置
  // 保存
  // http://10.2.1.123/plan/conf/save
  save(data) {
    console.log('data', data)
    var url = `/plan/conf/save`
    return request({
      url,
      method: 'post',
      data
    })
  },
  // 非税收入执收目标查询（单位）
  // 执收单位
  // http://127.0.0.1/bas/basChargeagency/find?isleaf=1&isenabled=1
  find(data) {
    return request({
      url: `/bas/basChargeagency/find?isleaf=1&isenabled=1`
    })
  },
  // 非税收入执收目标查询（单位）
  // http://10.2.1.123/plan/findColPlanUnitAndCurrency
  findColPlanUnitAndCurrency(params) {
    console.log('params', params)
    var url = `/plan/findColPlanUnitAndCurrency`
    return request({
      url,
      method: 'get',
      params
    })
  },

  // http://10.2.1.123/bas/basBudgetsubject/find?isleaf=1&isenabled=1
  basBudgetsubject(data) {
    return request({
      url: `/bas/basBudgetsubject/find?isleaf=1&isenabled=1`
    })
  },

  // 非税收入征收目标查询（科目）
  // http://10.2.1.123/plan/findColPlanProgramSubjectAndCurrency
  findColPlanProgramSubjectAndCurrency(params) {
    console.log('params1', params)
    var url = `/plan/findColPlanProgramSubjectAndCurrency`
    return request({
      url,
      method: 'get',
      params
    })
  },

  // http://10.2.1.123/plan/list?pageIndex=1&pageSize=10&state=1
  planList(params) {
    console.log('params', params)
    var url = `/plan/list`
    return request({
      url,
      method: 'get',
      params
    })
  },
  // 送审
  // http://10.2.1.123/plan/sendAudited
  sendAudited(guid) {
    console.log('guid', guid)
    var url = `/plan/sendAudited?guid=${guid}`
    return request({
      url,
      method: 'post'
    })
  },
  // get
  // http://10.2.1.123/plan/get?guid=1
  get(guid) {
    console.log('guid', guid)
    var url = `/plan/get?guid=${guid}`
    return request({
      url,
      method: 'get'
    })
  },

  // remove
  // http://10.2.1.123/plan/remove?guid=1
  planRemove(guid) {
    console.log('guid', guid)
    var url = `/plan/remove?guid=${guid}`
    return request({
      url,
      method: 'post'
    })
  },
  // findChargeProjectOrChargeTypeOrBudgetSubjec
  // http://10.2.1.123/plan/findChargeProjectOrChargeTypeOrBudgetSubjec?agencyid=1&typename=1
  findChargeProjectOrChargeTypeOrBudgetSubjec(agencyid, typename) {
    // <el-option label="预算科目" value="D114_03"/>
    // <el-option label="收费类别" value="D114_02"/>
    // <el-option label="收费项目" value="D114_01"/>
    // typename = typename === '预算科目' ? 'D114_03' : typename
    // typename = typename === '收费类别' ? 'D114_02' : typename
    // typename = typename === '收费项目' ? 'D114_01' : typename
    console.log('agencyid', agencyid)
    console.log('queryyear', typename)
    var url = `/plan/findChargeProjectOrChargeTypeOrBudgetSubjec?agencyid=${agencyid}&typename=${typename}`
    return request({
      url,
      method: 'get'
    })
  },
  // 计划
  // 保存
  // http://10.2.1.123/plan/save
  planSave(data) {
    // currency
    data = JSON.parse(data)
    data.colPlanDetails = {}
    data.colPlanDetails.colPlanDetail = data.details
    var num = 1
    switch (data.currency) {
      case '千元':
        num = 1000
        break
      case '万元':
        num = 10000
        break
      case '十万元':
        num = 100000
        break
      case '百万元':
        num = 1000000
        break
      case '千万元':
        num = 10000000
        break
      case '亿元':
        num = 100000000
        break
    }
    data.colPlanDetails.colPlanDetail.forEach(item => {
      item.planamt = Number(item.planamt) * Number(num)
      item.actamt = Number(item.actamt) * Number(num)
      item.prevyearnum = Number(item.prevyearnum) * Number(num)
      item.ratifyprevyearnum = Number(item.ratifyprevyearnum) * Number(num)
    })
    data = JSON.stringify(data)
    console.log('data', data)
    var url = `/plan/save`
    return request({
      url,
      method: 'post',
      data
    })
  },
  // 审核。
  // auditOpinion
  // guid
  // type
  billAudit(params) {
    console.log(params)
    return request({
      url: '/plan/audited',
      method: 'post',
      params
    })
  }
}

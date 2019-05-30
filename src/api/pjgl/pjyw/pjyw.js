import request from '@/utils/request'
// import Bus from '@/utils/Bus'
var urllist = {
  '/pjgl/pjyw/pjyztzs': 'bilAdviceNote',
  '/pjgl/pjyw/pjrk': 'bilStorage',
  '/pjgl/pjyw/pjyk': 'bilMoveRecord',
  '/pjgl/pjyw/pjlysq': 'bilAgencyPurchase',
  '/pjgl/pjyw/pjly': 'bilApply',
  '/pjgl/pjyw/pjrz': 'bilCert',
  '/pjgl/pjyw/pjth': 'bilBack',
  '/pjgl/pjyw/zypjhxgl': 'bilVerification',
  '/pjgl/pjyw/yxdspjzfgl': 'bilInvalid',
  '/pjgl/pjyw/pjfz': 'bilRepeal',
  '/pjgl/pjyw/pjxh': 'bilDestory',
  '/pjgl/pjyw/dwypjh': 'bilUseplan'
  // 定义凭证规则: '',
  // 票据收支业务制证: '',
  // 票据领用证年检: '',
  // 财政退库: 'synBilRefund'
}
function formatTime(time) {
  var t = new Date(time)
  var t1 = t.getFullYear()
  var t2 = t.getMonth() + 1
  var t3 = t.getDate()
  return `${t1}-${t2}-${t3}`
}
export default {
  // 获取打印的列表数据。
  getListPrintData(param) {
    var url = '/bill/' + urllist[this.$route.fullPath] + '/list'
    console.log('查看一下url', url)
    var tstartDate = param.startDate ? formatTime(param.startDate) : ''
    var tendDate = param.endDate ? formatTime(param.endDate) : ''
    var params = {
      flag: param.flag, // 0全部，1已审核，2未审核
      pageIndex: param.pageIndex, // 页数
      pageSize: '10000', // 页数量
      billId: param.billId || '', // 票据ID
      agencyId: param.agencyId || '',
      track: param.track || '', // 字轨
      startDate: tstartDate, // 起始日期
      endDate: tendDate, // 终止日期
      filterName: param.filterName || '', // 条件名称
      filterValue: param.filterValue || '', // 条件值
      billNumber: param.billNumber || '' // 票号
    }
    return request({
      url,
      method: 'get',
      params
    })
  },

  // 获取list api数据
  // http://10.2.1.123/bill/bilStorage/list?flag=0&pageIndex=1&pageSize=1
  getList(param) {
    console.log('收到的param是：', param)
    // 选中行索引
    var currentRowIndex = this.$store.getters.currentRowIndex
    // console.log(this.$store.getters.currentRowIndex)
    var tstartDate = param.startDate ? formatTime(param.startDate) : ''
    var tendDate = param.endDate ? formatTime(param.endDate) : ''
    var params = {
      flag: param.flag, // 0全部，1已审核，2未审核
      pageIndex: param.pageIndex, // 页数
      pageSize: param.pageSize, // 页数量
      billId: param.billId || '', // 票据ID
      agencyId: param.agencyId || '',
      track: param.track || '', // 字轨
      startDate: tstartDate, // 起始日期
      endDate: tendDate, // 终止日期
      filterName: param.filterName || '', // 条件名称
      filterValue: param.filterValue || '', // 条件值
      billNumber: param.billNumber || '' // 票号
    }
    var url = '/bill/' + urllist[this.$route.fullPath] + '/list'
    console.log('收到的查询列表参数信息为：', params)
    request({
      url,
      method: 'get',
      params
    })
      .then(res => {
        console.log(res)
        // console.log(res.data.data)
        if (res.data.data.length !== 0) {
          // 选中行
          var index = 0
          // 判断是否有足够的数据
          if (parseInt(currentRowIndex) + 1 > res.data.data.length) {
            index = res.data.data.length - 1 // 数据不够时
          } else {
            index = currentRowIndex // 数据充足时
          }
          this.tableData = res.data.data
          this.$forceUpdate()
          this.details = res.data.data[index].details
          this.currentRow = res.data.data[index]
          this.form.totalCount = res.data.pageInfo
            ? res.data.pageInfo.totalCount
            : 0

          // 设置第一行选中
          if (this.$refs.singleTable) {
            this.$refs.singleTable.setCurrentRow(this.tableData[index])
          }
        } else {
          this.tableData = []
          this.form.totalCount = 0
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 票据种类列表
  // http://10.2.1.123/bas/basBillinfo/find?isleaf=1
  getBasBillinfo(param) {
    console.log('发送了请求，========')
    return request({
      url: '/bas/basBillinfo/find?isleaf=1',
      method: 'get'
    })
  },
  // 票据仓库列表
  // http://10.2.1.123/bas/basBillstorage/find?ishall=1&isenabled=1
  getBasBillstorage(param) {
    return request({
      url: '/bas/basBillstorage/find?ishall=1&isenabled=1',
      method: 'get'
    })
  },
  // 票据印刷厂
  // http://10.2.1.123//bas/basBillprinting/find?isleaf=1
  getBasBillprinting(param) {
    return request({
      url: '/bas/basBillprinting/find?isleaf=1',
      method: 'get'
    })
  },
  // 票据废止，移库，财政退库3个页面使用的 库存票据
  // /bill/querybillstorefinance?storeId=' + storeId
  getQueryBillStoreFinance(storeId) {
    console.log('发送的库存票据参数为,', storeId)
    return request({
      url: '/bill/querybillstorefinance?storeId=' + storeId,
      method: 'get'
    })
  },

  // 银行代收票据作废管理页面的  库存票据使用。
  getQueryBillStoreAgency(agencyId, permitId) {
    console.log('发送的库存票据参数为,', agencyId, permitId)
    return request({
      url: `/bill/queryBillStoreAgency?storeType=BankAc&agencyId=${agencyId}&permitId=${permitId}`,
      method: 'get'
    })
  },
  // 票据入库中，领用入库时，弹层里面的库存票据数据来源。
  getQueryBillStoreWaitEnter(printingId) {
    console.log('发送的库存票据参数为,', printingId)
    return request({
      url: `/bill/queryBillStoreWaitEnter?printingId=${printingId}`,
      method: 'get'
    })
  },

  // 删除
  // http://10.2.1.123/bill/synBilRefund/remove?guid=b520169e20e10bc007f
  delete(guid) {
    var url =
      '/bill/' + urllist[this.$route.fullPath] + '/remove?guid=' + guid
    return request({
      url: url,
      method: 'post'
    })
  },

  // 票据领用申请添加 -- 执收单位
  // http://10.2.1.123/bill/queryBaseData?dataType=CertVerifAgency
  getBasChargeagency(storeId) {
    return request({
      url: '/bill/queryBaseData?dataType=CertVerifAgency',
      method: 'get'
    })
  },
  // 票据领用
  // 添加-执收单位
  getBasChargeagency1(storeId) {
    return request({
      url: '/bill/queryBaseData?dataType=PurchaseAgency',
      method: 'get'
    })
  },

  // 票据领用申请添加 -- 双击表头 -- 票证种类信息
  // http://10.2.1.123/bill/agency2billInfo?agencyId=8800CE90751DF0CF6AB0AED73026DE36&permitId=483B7DB4C7518ACB3D3E9BF7FEC8DB00
  getBillInfo(param) {
    return request({
      url:
        '/bill/agency2billInfo?agencyId=' +
        param.agencyid +
        '&permitId=' +
        param.perimitguid,
      method: 'get'
    })
  },

  // 票据领用
  // 双击添加-库存票据,
  getquerybillstorefinance(param, storeId) {
    console.log('发送的数据参数为', param)
    console.log(param.perimitguid)
    console.log(storeId)
    return request({
      url:
        '/bill/querybillstorefinance?agencyId=' +
        param.agencyid +
        '&permitId=' +
        param.perimitguid +
        '&storeId=' +
        storeId,
      method: 'get'
    })
  },

  // 销票单位
  // /bill/queryBaseData  ?dataType=CertVerifAgency
  // http://10.2.1.123/bill/queryBaseData?dataType=CertVerifAgency
  getBaseData(storeId) {
    return request({
      url: '/bill/queryBaseData?dataType=CertVerifAgency',
      method: 'get'
    })
  },

  // /bill/queryBillStoreAgency
  // agencyId，permitId，来自领用单位。
  // 专用票据核销管理添加 -- 双击表头 -- 库存票据
  getBillStoreAgency(param) {
    // console.log(param.agencyid)// 8800CE90751DF0CF6AB0AED73026DE36
    // console.log(param.perimitguid)// 483B7DB4C7518ACB3D3E9BF7FEC8DB00
    return request({
      url:
        '/bill/queryBillStoreAgency?agencyId=' +
        param.agencyid +
        '&permitId=' +
        param.perimitguid,
      method: 'get'
    })
  },

  //   /bill/agency2project
  // agencyId= 上面消票单位 单位ID
  // 表2
  getagency2project(param) {
    // console.log(param.agencyid)
    // console.log(param.perimitguid)
    return request({
      url: '/bill/agency2project?agencyId=' + param.agencyid,
      method: 'get'
    })
  },
  // 票据领用申请——添加——保存。
  // http://10.2.1.123/bill/bilAgencyPurchase/save
  addSave(params) {
    console.log('发送了新增保存请求，发送的数据为', params)
    return request({
      url: '/bill/' + urllist[this.$route.fullPath] + '/save',
      method: 'post',
      data: params
    })
  },
  // 票据领用申请——修改——保存。
  updateSave(params) {
    console.log('这事一条修改请求，收到的参数为：', params)
    return request({
      url: '/bill/' + urllist[this.$route.fullPath] + '/update',
      method: 'post',
      data: params
    })
  },
  // 送审。
  sendAudit(params) {
    console.log('发送的guid参数是：', params)
    return request({
      url: '/bill/' + urllist[this.$route.fullPath] + '/sendAudit',
      method: 'post',
      params
    })
  },
  // 审核。http://10.2.1.123/bill/bilAgencyPurchase/audit
  // auditOpinion
  // guid
  // type
  billAudit(params) {
    // console.log(this.$route.meta.title)
    return request({
      url: '/bill/' + urllist[this.$route.fullPath] + '/audit',
      method: 'post',
      params
    })
  },

  initGet() {
    return request({
      url: '/bill/' + urllist[this.$route.fullPath] + '/get?guid=-1',
      method: 'get'
    })
  },

  // 票据认证
  // 认证单位
  // /bill/agency2certagency   agencyId，来自
  getagency2certagency(param) {
    // console.log(param.agencyid)
    return request({
      url: '/bill/agency2certagency?agencyId=' + param.agencyid,
      method: 'get'
    })
  },
  // 票据认证
  // 双击添加-库存票据
  // /bill/queryBillStoreWaitCert  agencyId，permitId，来自领用单位。
  getqueryBillStoreWaitCert(param) {
    return request({
      url: '/bill/queryBillStoreWaitCert?agencyId=' + param.agencyid + '&permitId=' + param.perimitguid,
      method: 'get'
    })
  },

  // 票据退回
  // 双击添加
  // /bill/queryBillStoreAgency
  // ?storeType=all&agencyId=?&permitId=?
  // agencyId，permitId来自退回单位
  getBillStoreAgency1(param) {
    return request({
      url:
        '/bill/queryBillStoreAgency?storeType=all&agencyId=' +
        param.agencyid +
        '&permitId=' +
        param.perimitguid,
      method: 'get'
    })
  },

  // 票据销毁添加页面双击分页表格。
  // /bill/queryBillStoreVerificationPaging?pageIndex=1&pageSize=10
  // http:.../bill/queryBillStoreVerificationPaging?flag=0&pageIndex=1&pageSize=1
  getQueryBillStoreVerificationPaging(param) {
    // 选中行索引
    console.log('收到的查询数据为：', param)
    var currentRowIndex = this.$store.getters.currentRowIndex
    var params = {
      pageIndex: param.pageIndex, // 页数
      pageSize: param.pageSize, // 页数量
      permitId: param.permitId || '', // 领用证ID
      agencyId: param.agencyId || '', // 执收单位id
      filterName: param.filterName || '', // 条件名称
      filterValue: param.filterValue || '', // 条件值
      storeId: param.storeId || '', // 仓库id
      // 票号 -----startnumber
      billNumber: ''
    }
    var url = '/bill/queryBillStoreVerificationPaging'
    console.log('收到的查询列表参数信息为：', params)
    request({
      url,
      method: 'get',
      params
    })
      .then(res => {
        console.log('票据销毁的返回值为：', res)
        // console.log(res.data.data)
        if (res.data.data.length !== 0) {
          // 选中行
          var index = 0
          // 判断是否有足够的数据
          if (parseInt(currentRowIndex) + 1 > res.data.data.length) {
            index = res.data.data.length - 1 // 数据不够时
          } else {
            index = currentRowIndex // 数据充足时
          }
          this.tableData = res.data.data
          this.$forceUpdate()
          // this.details = res.data.data[index].details
          this.currentRow = res.data.data[index]
          this.form.totalCount = res.data.pageInfo
            ? res.data.pageInfo.totalCount
            : 0

          // 设置第一行选中
          if (this.$refs.singleTable) {
            this.$refs.singleTable.setCurrentRow(this.tableData[index])
          }
        } else {
          this.tableData = []
          this.form.totalCount = 0
        }
      })
      .catch(err => {
        console.log(err)
      })
  },

  // 票据印制通知书，票据入库，非印制入库时，获取起始号码。
  // /bill/bilStorage/getStartNumber?billid=213&track=123
  // /bill/bilAdviceNote/getStartNumber获取起始号
  getStartNumber(billid, track) {
    console.log('获取了开始号码')
    return request({
      url: `/bill/${urllist[this.$route.fullPath]}/getStartNumber?billid=${billid}&track=${track}`,
      method: 'get'
    })
  },

  // /bill/detectCheckmark
  getCheckMark(params) {
    console.log('收到的参数为', params)
    return request({
      url: `/bill/detectCheckmark`,
      method: 'get',
      params
    })
  },

  // 获取领销记录打印列表。
  // /bill/detectCheckmark
  getRecordPrintList(permitId) {
    return request({
      url: `/bill/bilApply/getPrintBillNeckAll?permitId=${permitId}`,
      method: 'get'
    })
  },
  // 保存打印位置行数信息。
  // /bill/bilApply/savepermitprintposition
  savePrintPosition(permitId, printposition) {
    return request({
      url: `/bill/bilApply/savepermitprintposition?permitId=${permitId}&printposition=${printposition}`,
      method: 'post'
      // data: {
      //   permitId,
      //   printposition
      // }
      // params
    })
  },
  //  bas/basBillpermit/get
  getPrintPosition(guid) {
    console.log(guid)
    return request({
      url: `/bas/basBillpermit/get?guid=${guid}`,
      method: 'get'
    })
  },
  // /bill/bilApply/saveApplyDetailPrintState
  changeGetPrintState(state, selectedGuidArray) {
    return request({
      url: `/bill/bilApply/saveApplyDetailPrintState`,
      method: 'post',
      data: {
        printed: state,
        guid: selectedGuidArray
      }
    })
  },

  // /bill/bilApply/saveverificationdetailprintstate
  changeSellPrintState(state, selectedGuidArray) {
    return request({
      url: `/bill/bilApply/saveverificationdetailprintstate`,
      method: 'post',
      data: {
        printed: state,
        guid: selectedGuidArray
      }
    })
  },
  // /bas/basBillpermit/getByAgencyid?agencyid=
  // 专用票据核销管理里面的票据领销记录打印列表获取，同时还获取到了位置值。
  getRecordPrintListByAgencyId(agencyid) {
    return request({
      url: `/bas/basBillpermit/getByAgencyid?agencyid=${agencyid}`,
      method: 'get'
    })
  }

}

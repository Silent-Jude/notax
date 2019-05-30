import request from '@/utils/request'
var urllist = {
  '/pjgl/pjywcx/pjyztzscx': 'billAdviceNoteData',
  '/pjgl/pjywcx/pjrkcx': 'billStorageData',
  '/pjgl/pjywcx/pjykcx': 'billMoveData',
  '/pjgl/pjywcx/dwpjlysqdcx': 'billAgencyPurchaseData',
  '/pjgl/pjywcx/pjlydcx': 'billApplyData',
  '/pjgl/pjywcx/pjrzywcx': 'billCertData',
  '/pjgl/pjywcx/zypjhxzfywcx': 'billVerificationData',
  '/pjgl/pjywcx/fssrybjkszfywcx': 'billInvalidData',
  '/pjgl/pjywcx/pjfzywcx': 'billRepealData',
  '/pjgl/pjywcx/pjthywcx': 'billBackData',
  '/pjgl/pjywcx/pjxhywcx': 'billDestoryData',
  '/pjgl/pjywcx/pjhmcx': 'billNumberData',
  '/pjgl/pjywcx/zypjsyqkcx': ''
}

var urllist1 = {
  '/pjgl/pjywcx/pjyztzscx': 'bilAdviceNote',
  '/pjgl/pjywcx/pjrkcx': 'bilStorage',
  '/pjgl/pjywcx/pjykcx': 'bilMoveRecord',
  '/pjgl/pjywcx/dwpjlysqdcx': 'bilAgencyPurchase',
  '/pjgl/pjywcx/pjlydcx': 'bilApply',
  '/pjgl/pjywcx/pjrzywcx': 'bilCert',
  '/pjgl/pjywcx/pjthywcx': 'bilBack',
  '/pjgl/pjywcx/zypjhxzfywcx': 'bilVerification',
  '/pjgl/pjywcx/fssrybjkszfywcx': 'bilInvalid',
  '/pjgl/pjywcx/pjfzywcx': 'bilRepeal',
  '/pjgl/pjywcx/pjxhywcx': 'bilDestory',
  '/pjgl/pjywcx/pjhmcx': '',
  '/pjgl/pjywcx/zypjsyqkcx': ''
  // 单位用票计划: 'bilUseplan',
  // 定义凭证规则: '',
  // 票据收支业务制证: '',
  // 票据领用证年检: '',
  // 财政退库: 'synBilRefund',
}
// function formatTime(time) {
//   var t = new Date(time)
//   var t1 = t.getFullYear()
//   var t2 = t.getMonth() + 1
//   var t3 = t.getDate()
//   return `${t1}-${t2}-${t3}`
// }
// function formatTime(time) {
//   var t = new Date(time)
//   var t1 = t.getFullYear()
//   var t2 = t.getMonth() + 1
//   var t3 = t.getDate()
//   return `${t1}-${t2}-${t3}`
// }
export default {
  // 双击表格查询
  // http://10.2.1.123:88/bill/bilStorage/get?guid=55D79E819786B45658AF557A9502DAC7
  getBillInfoguid(guid) {
    var url = '/bill/' + urllist1[this.$route.fullPath] + '/get?guid=' + guid
    return request({
      url,
      method: 'get'
    })
  },
  // 获取票据业务查询主页面的table表格数据 api数据
  // http://10.2.1.123:88/bill/inquiry/billAdviceNoteData
  getBillInfoList(params) {
    // 选中行索引
    var currentRowIndex = this.$store.getters.currentRowIndex
    console.log('选中行索引', currentRowIndex)
    var url = '/bill/inquiry/' + urllist[this.$route.fullPath]
    // console.log('url', url)
    // console.log('params', params)
    request({
      url,
      method: 'get',
      params
    }).then(res => {
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
        this.$refs.singleTable.clearSort()
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
  // 获取打印的列表数据。
  getListPrintData(param) {
    var url = '/bill/inquiry/' + urllist[this.$route.fullPath]
    console.log('查看一下url', url)
    // var tstartDate = param.startDate ? formatTime(param.startDate) : ''
    // var tendDate = param.endDate ? formatTime(param.endDate) : ''
    // var params = {
    //   flag: param.flag, // 0全部，1已审核，2未审核
    //   pageIndex: param.pageIndex, // 页数
    //   pageSize: '10000', // 页数量
    //   billId: param.billId || '', // 票据ID
    //   agencyId: param.agencyId || '',
    //   track: param.track || '', // 字轨
    //   startDate: tstartDate, // 起始日期
    //   endDate: tendDate, // 终止日期
    //   filterName: param.filterName || '', // 条件名称
    //   filterValue: param.filterValue || '', // 条件值
    //   billNumber: param.billNumber || '' // 票号
    // }
    var params = JSON.parse(JSON.stringify(param))
    params.pageSize = '10000'
    return request({
      url,
      method: 'get',
      params
    })
  }
}

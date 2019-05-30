import request from '@/utils/request'

function formatTime(time) {
  var t = new Date(time)
  var t1 = t.getFullYear()
  var t2 = t.getMonth() + 1
  var t3 = t.getDate()
  return `${t1}-${t2}-${t3}`
}
export default {
  getList(param) {
    var currentRowIndex = this.$store.getters.currentRowIndex
    var tstartDate = param.startDate ? formatTime(param.startDate) : ''
    var tendDate = param.endDate ? formatTime(param.endDate) : ''
    var params = {
      flag: param.flag, // 0全部，1已审核，2未审核
      pageIndex: param.pageIndex, // 页数
      pageSize: param.pageSize, // 页数量
      startDate: tstartDate, // 起始日期
      endDate: tendDate, // 终止日期
      filterName: param.filterName || '', // 条件名称
      filterValue: param.filterValue || '' // 条件值
    }
    var url = '/sys/announcement/list'
    request({
      url,
      method: 'get',
      params
    })
      .then(res => {
        console.log(res)
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

  // 删除
  // http://10.2.1.123/bill/synBilRefund/remove?guid=b520169e20e10bc007f
  delete(guid) {
    var url = '/sys/announcement/remove?guid=' + guid
    return request({
      url: url,
      method: 'post'
    })
  },

  // 审核。http://10.2.1.123/bill/bilAgencyPurchase/audit
  // auditOpinion
  // guid
  // type
  billAudit(params) {
    // console.log(this.$route.meta.title)
    var url = '/sys/announcement/audit'
    return request({
      url,
      method: 'post',
      params
    })
  }
}

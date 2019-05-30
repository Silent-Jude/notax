import request from '@/utils/request'

export default {
  // 单位票据库存查询
  // http://10.2.1.123:88/bill/query/queryAgencyBillStore?type=1%2C1
  queryAgencyBillStore(param) {
    var currentRowIndex = this.$store.getters.currentRowIndex
    console.log('选中行索引', currentRowIndex)
    console.log('单位票据库存查询', JSON.stringify(param))
    request({
      url: `/bill/query/queryAgencyBillStore?AgencyId=${param.AgencyId}&billId=${param.billId}&type=${param.type}`,
      method: 'get'
    }).then(res => {
      // 选中行
      var index = 0
      // 判断是否有足够的数据
      if (parseInt(currentRowIndex) + 1 > res.data.length) {
        index = res.data.length - 1 // 数据不够时
      } else {
        index = currentRowIndex // 数据充足时
      }
      this.currentRow = res.data[index]
      console.log(res.data)
      this.tableData = res.data
      this.$refs.singleTable.clearSort()
      // 设置第一行选中
      if (this.$refs.singleTable) {
        this.$refs.singleTable.setCurrentRow(this.tableData[index])
      }
    })
  },
  // 单位票据库存明细查询
  // http://10.2.1.123:88/bill/query/queryAgencyBillStoreDetail?billId=89F66A09C1467A1DFC318DAB7B5B3D14&endNumber=0005480876&startNumber=0005480868&track=2017
  queryAgencyBillStoreDetail(param) {
    console.log('单位票据库存查询', JSON.stringify(param))
    request({
      url: `/bill/query/queryAgencyBillStoreDetail?billId=${param.billid}&endNumber=${param.endnumber}&startNumber=${param.startnumber}&track=${param.track}`,
      method: 'get'
    }).then(res => {
      console.log(res.data)
      this.detail = res.data
      this.dialogTableVisible = true
      if (this.$refs.clearDetail) {
        this.$refs.clearDetail.clearSort()
      }
    })
  },
  // 财政票据库存查询
  // http://10.2.1.123:88/bill/query/queryFinanceBillStore?billId=C78A8F7337D4A73BF0F334216CAEA77D&billNumber=1&storageId=470E15EA018A94A28DECF4D0821F9941&track=2019&type=1%2C1
  queryFinanceBillStore(param) {
    var currentRowIndex = this.$store.getters.currentRowIndex
    console.log('选中行索引', currentRowIndex)
    console.log('单位票据库存查询', JSON.stringify(param))
    request({
      url: `/bill/query/queryFinanceBillStore?billId=${param.billId}&billNumber=${param.billNumber}&storageId=${param.storageId}&track=${param.track}&type=${param.type}`,
      method: 'get'
    }).then(res => {
      // 选中行
      var index = 0
      // 判断是否有足够的数据
      if (parseInt(currentRowIndex) + 1 > res.data.length) {
        index = res.data.length - 1 // 数据不够时
      } else {
        index = currentRowIndex // 数据充足时
      }
      this.currentRow = res.data[index]
      console.log(res.data)
      this.tableData = res.data
      this.$refs.singleTable.clearSort()
      // 设置第一行选中
      if (this.$refs.singleTable) {
        this.$refs.singleTable.setCurrentRow(this.tableData[index])
      }
    })
  },
  // 财政票据库存明细查询
  // http://10.2.1.123:88/bill/query/queryFinanceBillStoreDetail?billId=402810816a427221016a42bcaeac002f&endNumber=0000000036&startNumber=0000000036&track=2019
  queryFinanceBillStoreDetail(param) {
    console.log('单位票据库存查询', JSON.stringify(param))
    request({
      url: `/bill/query/queryFinanceBillStoreDetail?endNumber=${param.endnumber}&startNumber=${param.startnumber}&track=${param.track}`,
      method: 'get'
    }).then(res => {
      console.log(res.data)
      this.detail = res.data
      this.dialogTableVisible = true
      if (this.$refs.clearDetail) {
        this.$refs.clearDetail.clearSort()
      }
    })
  }
}

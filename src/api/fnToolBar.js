import request from '@/utils/request'
import Bus from '@/utils/Bus'
var LAST_CLICK_TIME = 0
var urllist = {
  '非税收入类别': '/bas/basChargetype',
  '资金管理方式': '/bas/basFundtype',
  '政府收支分类科目': '/bas/basBudgetsubject',
  '非税收入项目': '/bas/basChargeproject',
  '业务处（科）室': '/bas/basBusinessoffices',
  '主管部门': '/bas/basDepartment',
  '执收（罚）单位': '/bas/basChargeagency',
  '银行汇缴结算户': '/bas/basRemittedbank',
  '银行代收网点': '/sys/basBankbranch',
  '票证印制厂': '/bas/basBillprinting',
  '票证种类信息': '/bas/basBillinfo',
  '会计科目': '',
  '财务辅助核算部门': '',
  '财务辅助核算项目': '',
  '账套管理': '',
  '银行前置机': '/bas/basBankfrontmac',
  '票证仓库信息': '/bas/basBillstorage',
  '票据购领证': '/bas/basBillpermit',
  '票据购领证1': '/bas/basBillpermit',
  '票据领用证': '/bas/basBillpermit',
  '财务基础数据同步': '',
  '非税参数': '/sys/sysNontaxparams',
  '政策法规文件管理': '/pol/polProjectFnoFileLib'
}

export default {
  // 关闭返回首页
  close() {
    var status = this.$store.getters.savestate
    if (status === 0) {
      this.$router.push('/')
      this.$message({
        showClose: true,
        message: '回到首页',
        type: 'success'
      })
    } else {
      return
    }
  },
  // 添加状态修改
  add() {
    var status = this.$store.getters.savestate
    var id = this.$store.state.app.detailInfo.id
    var guid = this.$store.state.app.detailInfo.guid
    var selectedGuid = this.$store.state.app.selectedSubMenuGuid
    if (status === 0) {
      if (!(guid || selectedGuid || id)) {
        this.$message({
          showClose: true,
          message: '请选择一个父节来点添加',
          type: 'error'
        })
        return
      } else if (this.$route.path === '/jczl/yxdswd' && selectedGuid === '-1') {
        this.$message({
          showClose: true,
          message: '本页数据只能在具体银行节点下进行添加，请选择具体银行节点！',
          type: 'error'
        })
      } else if (this.$route.path === '/qxgl/czyh' || this.$route.path === '/qxgl/dwyh' || this.$route.path === '/qxgl/yhyh' && this.$store.state.app.selectedNodeInfo.hasChildren) {
        this.$message({
          showClose: true,
          message: '请选择节点',
          type: 'error'
        })
      } else {
        this.$store.dispatch('SETSAVESTATE', 1)
        this.$message({
          showClose: true,
          message: '请前往添加',
          type: 'success',
          duration: 3000
        })
        // 添加之前置空表单
        Bus.$emit('clearForm')
      }
    } else {
      return
    }
  },
  // 修改状态修改
  update() {
    var status = this.$store.getters.savestate
    // var guid = this.$store.state.app.detailInfo.guid
    var selectedGuid = this.$store.state.app.selectedSubMenuGuid
    var selectedNode = this.$store.state.app.selectedNodeInfo
    var targetTab = this.$store.state.app.selectedTargetTab
    // console.log('节点细信息', selectedNode)
    if (status === 0) {
      if (this.$route.path === '/qxgl/czyh' || this.$route.path === '/qxgl/dwyh' || this.$route.path === '/qxgl/yhyh') {
        if (Array.isArray(this.$store.state.app.detailInfo) && this.$store.state.app.detailInfo.length > 0) {
          Bus.$emit('czyh')
          this.$store.dispatch('SETSAVESTATE', 2)
          this.$message({
            showClose: true,
            message: '请前往修改',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: '请选择要修改的节点',
            type: 'error'
          })
        }
        return
      }
      if (!(selectedGuid)) {
        // if (!(guid || selectedGuid)) {
        this.$message({
          showClose: true,
          message: '请选择要修改的节点',
          type: 'error'
        })
        return
      } else if (selectedGuid === '-1') {
        this.$message({
          showClose: true,
          message: '根节点无法修改！！',
          type: 'error'
        })
      } else if (selectedNode.state !== undefined && selectedNode.state !== null && selectedNode.state.isbankbranch === false) {
        this.$message({
          showClose: true,
          message: '不能修改银行节点，请重新选择其他网点！',
          type: 'error'
        })
      } else {
        this.$store.dispatch('SETSAVESTATE', 2)
        this.$message({
          showClose: true,
          message: '请前往修改',
          type: 'success'
        })
        if (targetTab !== null) {
          targetTab.parentNode.firstElementChild.click()
        }
      }
    } else {
      return
    }
  },
  // 重置表单
  reset() {
    var status = this.$store.getters.savestate
    if (!(status === 0)) {
      Bus.$emit('resetForm')
    }
  },
  // 保存添加/修改
  save() {
    var status = this.$store.getters.savestate
    if (!(status === 0)) {
      // 触发formgroup组件中的bus
      Bus.$emit('submitForm')
    }
  },
  grantSave() {
    Bus.$emit('grantSave')
  },
  // 取消编辑，返回编辑前的状态。
  abolish() {
    var status = this.$store.getters.savestate
    if (status === 0) {
      return
    }
    var msg = ''
    if (status === 1) {
      msg = '您刚才增加的内容还没有保存，是否取消本次新增？'
    } else if (status === 2) {
      msg = '您刚才的修改还没有保存，是否取消修改？'
    }
    this.$confirm(msg, '警告', {
      confirmButtonText: '确定取消',
      cancelButtonText: '返回编辑',
      type: 'warning'
    }).then(() => {
      this.$store.dispatch('SETSAVESTATE', 0)
      Bus.$emit('resetForm')
    }).catch(() => {

      // Bus.$emit('resetForm')
    })
  },
  grantAbolish() {
    this.$confirm('您刚才授权的内容还没有保存，是否取消本次授权？', '警告', {
      confirmButtonText: '取消授权',
      cancelButtonText: '继续授权',
      type: 'warning'
    }).then(() => {
      this.$store.dispatch('SETSAVESTATE', 0)
      // Bus.$emit('resetForm')
      console.log('需要重新发送请求获取数据')
      Bus.$emit('getRightTreeInfo', { guid: this.$store.state.sjqx.selectedLeftTreeNodeGuid })
      Bus.$emit('filter')
    }).catch(() => {
      console.log('我取消了，还是继续编辑吧')
      // Bus.$emit('resetForm')
    })
  },
  // 删除
  expurgate() {
    var status = this.$store.getters.savestate
    if (!(status === 0)) {
      return
    }
    if (this.$route.path === '/qxgl/czyh' || this.$route.path === '/qxgl/dwyh' || this.$route.path === '/qxgl/yhyh') {
      Bus.$emit('del')
      return
    }
    // 应该还需判断子节点
    if (this.$store.state.app.selectedSubMenuGuid === '-1') {
      this.$message({
        showClose: true,
        message: '根节点无法删除！！',
        type: 'error'
      })
      return
    } else if (!this.$store.state.app.detailInfo.guid && !this.$store.state.app.detailInfo.id || this.$store.state.app.selectedSubMenuGuid === '') {
      this.$message({
        showClose: true,
        message: '请选择要删除的节点',
        type: 'error'
      })
      return
    }
    this.$confirm('确定要删除此项？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    }).then(() => {
      var status = this.$store.getters.savestate
      // 判断路由地址
      // console.log(this.$route.meta.title)
      var url = urllist[this.$route.meta.title] + '/remove'
      var params = {
        guid: this.$store.state.app.detailInfo.guid
      }
      if (this.$store.state.app.detailInfo.id) {
        if (this.$route.meta.title === '角色管理') {
          url = '/sys/sysRole/remove'
        }
        params = {
          id: this.$store.state.app.detailInfo.id
        }
      }
      if (status === 0) {
        request({
          url,
          method: 'post',
          params
        }).then(res => {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          // 获取更新之后的数据。
          Bus.$emit('getTreeNodeInfo')
          // 设置当前节点状态
          console.log(this.$store.state.app.detailInfo)
          Bus.$emit('handleFocusCurrentNode', this.$store.state.app.detailInfo.parentguid)
          Bus.$emit('SetSubMenuGuid', this.$store.state.app.detailInfo.parentguid)
          console.log(this.$store.state.app.detailInfo.parentguid)
          if (this.$store.state.app.detailInfo.id) {
            Bus.$emit('handleFocusCurrentNode', this.$store.state.app.detailInfo.parentid)
            Bus.$emit('SetSubMenuGuid', this.$store.state.app.detailInfo.parentid)
          }
        }).catch((err) => {
          console.log(err)
        })
      } else {
        return
      }
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  },
  // 刷新
  refresh() {
    var status = this.$store.getters.savestate
    if (!(status === 0)) {
      return
    }
    if (this.$route.path === '/qxgl/czyh' || this.$route.path === '/qxgl/dwyh' || this.$route.path === '/qxgl/yhyh') {
      Bus.$emit('refresh')
      return
    }

    if (!this.$store.state.app.detailInfo.guid) {
      this.$message({
        showClose: true,
        message: '请选择要更新的节点',
        type: 'error'
      })
      return
    }
    var url = urllist[this.$route.meta.title] + '/get'
    var params = {
      guid: this.$store.state.app.detailInfo.guid
    }
    request({
      url,
      method: 'get',
      params
    }).then(res => {
      this.$message({
        showClose: true,
        message: '成功刷新',
        type: 'success'
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  // 刷新  票据查询 触发事件
  refresh1() {
    Bus.$emit('refresh1')
  },
  reportRefresh() {
    Bus.$emit('reportRefresh')
    // console.log(this.$refs)
    // this.$refs.iframe.contentWindow.search()
  },

  cancel() {
    // alert('cancel对应的字段居然是作废？无语')
  },
  designate() {
    alert('指派')
  },
  filter() {
    alert('过滤')
  },
  grant() {
    var selectedGuid = this.$store.state.sjqx.selectedLeftTreeNodeGuid
    if (selectedGuid === '') {
      this.$message({
        showClose: true,
        message: '请先选择一个部门！',
        type: 'error'
      })
      return
    } else if (selectedGuid === '-1') {
      this.$message({
        showClose: true,
        message: '根节点无法授权，请先选择一个部门！',
        type: 'error'
      })
      return
    } else {
      this.$store.dispatch('SETSAVESTATE', 1)
      Bus.$emit('filter')
      this.$message({
        showClose: true,
        message: '请选择授权内容！',
        type: 'success',
        duration: 3000
      })
    }
    // alert('授权')
  },
  upload() {
    Bus.$emit('upload')
  },
  download() {
    Bus.$emit('download')
  },
  find() {
    alert('文件查看')
  },
  audit() {
    alert('审核')
  },
  grantbtn() {
    Bus.$emit('grantbtn')
  },
  unaudit() {
    alert('反审')
  },
  batchsave() {
    alert('作废')
  },
  receipt() {
    alert('回单')
  },
  POS() {
    alert('POS')
  },
  query1() {
    Bus.$emit('query1')
  },
  query() {
    if (this.$store.state.sjqx.selectedLeftTreeNodeGuid) {
      Bus.$emit('getRightTreeInfo', { guid: this.$store.state.sjqx.selectedLeftTreeNodeGuid })
    } else {
      this.$message({
        showClose: true,
        message: '请选择需要查询的节点！',
        type: 'error',
        duration: 3000
      })
    }
    // alert('查询')
  },
  yearbooks() {
    alert('年鉴')
  },
  datasync() {
    alert('财务数据同步')
  },
  nodatasync() {
    alert('非税数据同步')
  },
  print() {
    alert('打印')
  },

  reportPrint() {
    Bus.$emit('reportPrint')
  },
  automatic() {
    Bus.$emit('automatic')
  },
  reconciliation() {
    Bus.$emit('reconciliation')
  },
  assigned() {
    Bus.$emit('assigned')
  },
  clear() {
    Bus.$emit('clear')
  },
  reportClear() {
    Bus.$emit('reportClear')
  },
  preview() {
    alert('预览')
  },
  gathering() {
    alert('确认收款')
  },
  Cancel() {
    alert('取消收款')
  },
  // 表格打印部分
  tablePrintSet() {
    var selectedGuid = this.$store.state.app.selectedSubMenuGuid
    if (selectedGuid) {
      Bus.$emit('tablePrintSet')
    } else {
      this.$alert('请先选择节点', {
        center: true,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        customClass: 'texty',
        callback: action => {
        }
      })
    }
  },
  tablePrint() {
    var selectedGuid = this.$store.state.app.selectedSubMenuGuid
    if (selectedGuid) {
      Bus.$emit('tablePrint')
    } else {
      this.$alert('请先选择节点', {
        center: true,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        customClass: 'texty',
        callback: action => {
        }
      })
    }
  },
  tablePrintPreview() {
    var selectedGuid = this.$store.state.app.selectedSubMenuGuid
    if (selectedGuid) {
      Bus.$emit('tablePrintPreview')
    } else {
      this.$alert('请先选择节点', {
        center: true,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        customClass: 'texty',
        callback: action => {
        }
      })
    }
  },
  tablePrintExport() {
    var selectedGuid = this.$store.state.app.selectedSubMenuGuid
    if (selectedGuid) {
      Bus.$emit('tablePrintExport')
    } else {
      this.$alert('请先选择节点', {
        center: true,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        customClass: 'texty',
        callback: action => {
        }
      })
    }
  },
  // 表格打印部分
  // 票据购领证打印
  billpermitPrint() {
    var selectedGuid = this.$store.state.app.selectedSubMenuGuid
    if (selectedGuid && selectedGuid !== '-1') {
      Bus.$emit('billpermitPrint')
    } else {
      this.$alert('请先选择要打印的票据', {
        center: true,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        customClass: 'texty',
        callback: action => {
        }
      })
    }
  },
  billpermitPreview() {
    var selectedGuid = this.$store.state.app.selectedSubMenuGuid
    if (selectedGuid && selectedGuid !== '-1') {
      Bus.$emit('billpermitPreview')
    } else {
      this.$alert('请先选择要打印的票据', {
        center: true,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        customClass: 'texty',
        callback: action => {
        }
      })
    }
  },
  billpermitSet() {
    var selectedGuid = this.$store.state.app.selectedSubMenuGuid
    if (selectedGuid && selectedGuid !== '-1') {
      Bus.$emit('billpermitSet')
    } else {
      this.$alert('请先选择要打印的票据', {
        center: true,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        customClass: 'texty',
        callback: action => {
        }
      })
    }
  },
  billpermitExport() {
    var selectedGuid = this.$store.state.app.selectedSubMenuGuid
    if (selectedGuid && selectedGuid !== '-1') {
      Bus.$emit('billpermitExport')
    } else {
      this.$alert('请先选择要打印的票据', {
        center: true,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        customClass: 'texty',
        callback: action => {
        }
      })
    }
  },
  // 票据业务，外面的列表打印
  listPrint() {
    Bus.$emit('listPrint')
  },
  listPreview() {
    Bus.$emit('listPreview')
  },
  listSet() {
    Bus.$emit('listSet')
  },
  listExport() {
    Bus.$emit('listExport')
  },
  // 票据业务，外面的列表打印

  // 票据业务，里面的列表打印
  addPrint() {
    Bus.$emit('addPrint')
  },
  addPreview() {
    Bus.$emit('addPreview')
  },
  addSet() {
    Bus.$emit('addSet')
  },
  addExport() {
    Bus.$emit('addExport')
  },
  // 票据业务，里面的列表打印

  // 票据业务，里面的列表打印
  grantPrint() {
    Bus.$emit('grantPrint')
  },
  grantPreview() {
    Bus.$emit('grantPreview')
  },
  grantSet() {
    Bus.$emit('grantSet')
  },
  grantExport() {
    Bus.$emit('grantExport')
  },
  // 票据业务，里面的列表打印

  educe() {
    alert('导出')
  },
  reportExport() {
    Bus.$emit('reportExport')
  },
  openquery() {
    alert('开启业务查询')
  },
  openbusiness() {
    alert('开启业务办理')
  },
  closebusiness() {
    alert('关闭业务')
  },
  yearend() {
    alert('年结')
  },
  mmcz() {
    Bus.$emit('mmcz')
  },
  make() {
    alert('开始制证')
  },
  unmake() {
    alert('取消制证')
  },
  quittance() {
    alert('收据')
  },
  quittancePrint() {
    alert('收据打印')
  },
  sendaudit() {
    alert('送审')
  },
  planquery() {
    alert('计划确认')
  },
  collection() {
    Bus.$emit('collection')
  },
  uncollection() {
    Bus.$emit('uncollection')
  },
  billAdd() {
    var status = this.$store.getters.savestate
    if (!(status === 0)) {
      return
    }
    Bus.$emit('add')
  },
  billUpdate() {
    Bus.$emit('billUpdate')
  },
  billUpdate2() {
    Bus.$emit('billUpdate2')
  },
  billDelete() {
    Bus.$emit('billDelete')
  },
  billAddDelete() {
    Bus.$emit('billAddDelete')
  },
  billSave() {
    Bus.$emit('billSave')
  },
  billAbolish() {
    Bus.$emit('billAbolish')
  },
  billRefresh() {
    Bus.$emit('onSubmit')
  },
  billSendAudit() {
    Bus.$emit('billSendAudit')
  },
  billAudit() {
    Bus.$emit('billAudit')
  },
  billAddAudit() {
    Bus.$emit('billAddAudit')
  },
  billUnaudit() {
    Bus.$emit('billUnaudit')
  },
  billAddUnaudit() {
    Bus.$emit('billAddUnaudit')
  },
  billClose() {
    Bus.$emit('billClose')
  },
  queryClose() {
    Bus.$emit('queryClose')
  },
  billAddUpdate() {
    Bus.$emit('billAddUpdate')
  },
  billAddSendAudit() {
    Bus.$emit('billAddSendAudit')
  },
  exchange() {
    // 一个简单的防抖处理，3秒内不会重复触发。
    if (new Date() - LAST_CLICK_TIME < 3000) {
      return
    } else {
      LAST_CLICK_TIME = new Date()
      this.$store.dispatch('SetExchangeState')
    }
  },
  batchAdd() {
    Bus.$emit('batchAdd')
  }
}

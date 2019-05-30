<!--pjglz 票据购领证 -->
<template>
  <div>
    <toolBar :client-butns-array="clientButnsArray" />
    <treeComponent v-if="refreshTree" :data="data">
      <base-locate slot="header" />
      <tab slot="tabs" :other-tabs-array="otherTabsArray">
        <formgroup slot="detail" :form="detailInfo" />
        <listInfo slot="listInfo" :tb-head="listInfoTableHead" />
        <formgroupunit slot="ssdw" :form="detailInfo.basChargeagency" />
        <printContent slot="dynr" :form-print-data="formPrintData"/>
        <employUnit slot="sydw"/>
        <yearCheck slot="njxx"/>
        <usableBill slot="kypj"/>
      </tab>
    </treeComponent>
    <pjglzPrint :template-list="templateDataList" :form-print-data="formPrintData"/>
  </div>
</template>

<script>
import Bus from '@/utils/Bus'
import { mapState } from 'vuex'
import { getTree, getDetail, getTableListInfo } from '@/api/jczl'
import baseLocate from '@/components/treeHeader/baseLocate'
import treeComponent from '@/components/treeComponent'
import tab from '@/components/tab'
import toolBar from '@/components/toolBar'
import formgroup from './formgroup'
import formgroupunit from './formgroupunit'
import listInfo from '@/components/listInfo'
import printContent from './printContent'
import pjglzPrint from './pjglzPrint'
import employUnit from './employUnit'
import yearCheck from './yearCheck'
import usableBill from './usableBill'
import { getPrintTemplateData, savePrintTemplateData } from '@/api/webPrint'

// import listInfo from './listInfo'

export default {
  components: {
    usableBill, //  可用票据页面组件
    yearCheck, //  年检信息组件
    employUnit, //  使用单位组件
    pjglzPrint, // 套打设置组件。
    printContent, // 打印内容tab页面中的组件。
    formgroupunit, // 所属单位
    treeComponent, // 节点树组件
    baseLocate, // 节点数的头部。
    formgroup, // 右侧详情信息表单。
    toolBar, // 上方工具条栏
    tab, // 右侧tab选项卡
    listInfo // 右侧列表信息
  },
  data() {
    return {
      // formPrintData: [],
      templateDataList: [],
      templateInitData: {
        guid: '',
        userid: null,
        templatecontent: {
          lineWidth: 90, //  需要服务器记录。
          lineHeight: 8, //  需要服务器记录。
          lineNumber: 12, //  需要服务器记录。
          textAlign: 'center', //  需要服务器记录。
          fontSize: 14, //  需要服务器记录。
          billProjectLineWidth: 180, //  需要服务器记录。
          billProjectLineHeight: 8, //  需要服务器记录。
          billProjectLineNumber: 12, //  需要服务器记录。
          lodopPrintStr: `
          this.LODOP.PRINT_INIT("套打样式初始化设置");
this.LODOP.SET_PRINT_MODE("PRINT_SETUP_PROGRAM",true);
this.LODOP.SET_PRINT_MODE("PROGRAM_CONTENT_BYVAR",true);
this.LODOP.ADD_PRINT_TEXTA("区划编码",380,102,80,24,"区划编码");
this.LODOP.ADD_PRINT_TEXTA("区划名称",423,204,80,24,"区划名称");
this.LODOP.ADD_PRINT_TEXTA("单位编码",55,353,80,24,"单位编码");
this.LODOP.ADD_PRINT_TEXTA("单位名称",52,102,80,24,"单位名称");
this.LODOP.ADD_PRINT_TEXTA("单位地址",94,102,80,24,"单位地址");
this.LODOP.ADD_PRINT_TEXTA("领用证编号",14,353,80,24,"领用证编号");
this.LODOP.ADD_PRINT_TEXTA("办理日期",385,0,80,24,"办理日期");
this.LODOP.ADD_PRINT_TEXTA("收费许可证号",129,351,80,24,"收费许可证号");
this.LODOP.ADD_PRINT_TEXTA("票据管理部门",385,200,80,24,"票据管理部门");
this.LODOP.ADD_PRINT_TEXTA("票据经办人",385,300,80,24,"票据经办人");
this.LODOP.ADD_PRINT_TEXTA("票据经办人电话",385,400,80,24,"票据经办人电话");
this.LODOP.ADD_PRINT_TEXTA("银行执收范围",385,500,80,24,"银行执收范围");
this.LODOP.ADD_PRINT_TEXTA("单位执收范围",420,0,80,24,"单位执收范围");
this.LODOP.ADD_PRINT_TEXTA("核销票据种类",420,100,80,24,"核销票据种类");
this.LODOP.ADD_PRINT_TEXTA("单位性质",132,104,80,24,"单位性质");
this.LODOP.ADD_PRINT_TEXTA("负责人",179,108,80,24,"负责人");
this.LODOP.ADD_PRINT_TEXTA("负责人电话",179,212,80,24,"负责人电话");
this.LODOP.ADD_PRINT_TEXTA("经办人",227,103,80,24,"经办人");
this.LODOP.ADD_PRINT_TEXTA("经办人电话",226,211,80,24,"经办人电话");
this.LODOP.ADD_PRINT_TEXTA("经办人身份证号",455,100,80,24,"经办人身份证号");
this.LODOP.ADD_PRINT_TEXTA("机构代码",94,352,80,24,"机构代码");
this.LODOP.ADD_PRINT_TEXTA("预算拨款性质",455,300,80,24,"预算拨款性质");
this.LODOP.ADD_PRINT_TEXTA("打印人",455,400,80,24,"打印人");
this.LODOP.ADD_PRINT_TEXTA("项目集合",455,500,80,24,"项目集合");
this.LODOP.ADD_PRINT_TEXTA("换证日期",490,0,80,24,"换证日期");
this.LODOP.ADD_PRINT_TABLE(321,45,"182.01mm","98mm","<table data-v-054d1ee0=\\"\\" class=\\"preview-table\\" style=\\"table-layout: fixed; margin: 0px auto; text-align: center; font-size: 12px; width: 179mm; height: 95mm;\\"> <tr data-v-054d1ee0=\\"\\"><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\">\\n                001001 非税收入一般缴款书（机打）\\n              </td> <td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\">\\n                \\n              </td></tr> <tr data-v-054d1ee0=\\"\\"><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td></tr><tr data-v-054d1ee0=\\"\\"><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td></tr><tr data-v-054d1ee0=\\"\\"><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td></tr><tr data-v-054d1ee0=\\"\\"><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td></tr><tr data-v-054d1ee0=\\"\\"><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td></tr><tr data-v-054d1ee0=\\"\\"><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td></tr><tr data-v-054d1ee0=\\"\\"><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td></tr><tr data-v-054d1ee0=\\"\\"><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td></tr><tr data-v-054d1ee0=\\"\\"><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td></tr><tr data-v-054d1ee0=\\"\\"><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td></tr><tr data-v-054d1ee0=\\"\\"><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td><td data-v-054d1ee0=\\"\\" style=\\"white-space: nowrap; overflow: hidden; word-break: keep-all; width: 90mm; height: 8mm; vertical-align: middle;\\"></td></tr></table>");
          `
        },
        isdefault: 1, // 是否现在使用的模板
        templatecode: this.$route.path,
        templatename: '标准打印模板',
        isstandardtemplage: 1 // 是否标准模板
      },
      otherTabsArray: ['ssdw', 'sydw', 'njxx', 'kypj', 'dynr'],
      data: [],
      refreshTree: true,
      urlPath: '/bas/basBillpermit',
      clientButnsArray: ['close', 'refresh', 'save', 'abolish', 'billpermitPreview', 'nianjian', 'update', 'add', 'delete', 'billpermitPrint', 'billpermitSet', 'billpermitExport'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      // listInfo的表头，需要手动传进去。
      listInfoTableHead: [
        { label: '单位编码', prop: 'basChargeagency.agencycode', width: 150 },
        { label: '单位名称', prop: 'basChargeagency.agencyname', width: 150 },
        { label: '领用证编号', prop: 'permitno', width: 150 },
        { label: '办理日期', prop: 'transactdate', width: 150 },
        { label: '收费许可证号', prop: 'chargepermitno', width: 150 },
        { label: '经办人', prop: 'attn', width: 150 },
        { label: '经办人联系电话', prop: 'attntel', width: 150 },
        { label: '票据管理部门', prop: 'billmanagement', width: 150 },
        { label: '银行执收范围', prop: 'bankchargescope', width: 150 },
        { label: '单位执收范围', prop: 'agencychargescope', width: 150 }
      ]
    }
  },

  computed: {
    ...mapState({
      detailInfo: state => state.app.detailInfo,
      savestate: state => state.app.savestate
    }),
    formPrintData() {
      if (this.detailInfo.permitno !== undefined) {
        console.log('又值')
        return (
          [
            { key: 1, label: '区划编码', value: this.$store.state.app.detailInfo.admdivcode },
            { key: 2, label: '区划名称', value: '待添加' },
            { key: 3, label: '单位编码', value: this.$store.state.app.detailInfo.basChargeagency.agencycode },
            { key: 4, label: '单位名称', value: this.$store.state.app.detailInfo.basChargeagency.agencyname },
            { key: 24, label: '单位地址', value: this.$store.state.app.detailInfo.basChargeagency.address },
            { key: 5, label: '领用证编号', value: this.$store.state.app.detailInfo.permitno },
            { key: 6, label: '办理日期', value: this.$store.state.app.detailInfo.transactdate },
            { key: 7, label: '收费许可证号', value: this.$store.state.app.detailInfo.chargepermitno },
            { key: 8, label: '票据管理部门', value: this.$store.state.app.detailInfo.billmanagement },
            { key: 9, label: '票据经办人', value: this.$store.state.app.detailInfo.attn },
            { key: 10, label: '票据经办人电话', value: this.$store.state.app.detailInfo.basChargeagency.attntel },
            { key: 11, label: '银行执收范围', value: this.$store.state.app.detailInfo.bankchargescope },
            { key: 12, label: '单位执收范围', value: this.$store.state.app.detailInfo.agencychargescope },
            { key: 13, label: '核销票据种类', value: '' },
            { key: 14, label: '单位性质', value: this.$getCodeLabel(this.$store.state.app.detailInfo.basChargeagency.agencykind) },
            { key: 15, label: '负责人', value: this.$store.state.app.detailInfo.basChargeagency.treasurer },
            { key: 25, label: '负责人电话', value: this.$store.state.app.detailInfo.basChargeagency.treasurertel },
            { key: 16, label: '经办人', value: this.$store.state.app.detailInfo.basChargeagency.attn },
            { key: 17, label: '经办人电话', value: this.$store.state.app.detailInfo.basChargeagency.attntel },
            { key: 18, label: '经办人身份证号', value: this.$store.state.app.detailInfo.identityid },
            { key: 19, label: '机构代码', value: this.$store.state.app.detailInfo.basChargeagency.orgcode },
            { key: 20, label: '预算拨款性质', value: this.$store.state.app.detailInfo.basChargeagency.budgetkind },
            { key: 21, label: '打印人', value: this.$store.state.user.userInfo.name },
            { key: 22, label: '项目集合', value: '' },
            { key: 23, label: '换证日期', value: this.$store.state.app.detailInfo.transactdate }
          ]
        )
      } else {
        console.log('空值')
        return []
      }
    }
  },

  watch: {
    // detailInfo: {
    //   handler(newVal) {
    //     console.log('监听的detailinfo为，', newVal)
    //     if (newVal.permitno !== undefined) {
    //       console.log('赋值了')
    //       var formPrintData = [
    //         { key: 1, label: '区划编码', value: this.$store.state.app.detailInfo.admdivcode },
    //         { key: 2, label: '区划名称', value: '待添加' },
    //         { key: 3, label: '单位编码', value: this.$store.state.app.detailInfo.basChargeagency.agencycode },
    //         { key: 4, label: '单位名称', value: this.$store.state.app.detailInfo.basChargeagency.agencyname },
    //         { key: 24, label: '单位地址', value: this.$store.state.app.detailInfo.basChargeagency.address },
    //         { key: 5, label: '领用证编号', value: this.$store.state.app.detailInfo.permitno },
    //         { key: 6, label: '办理日期', value: this.$store.state.app.detailInfo.transactdate },
    //         { key: 7, label: '收费许可证号', value: this.$store.state.app.detailInfo.chargepermitno },
    //         { key: 8, label: '票据管理部门', value: this.$store.state.app.detailInfo.billmanagement },
    //         { key: 9, label: '票据经办人', value: this.$store.state.app.detailInfo.attn },
    //         { key: 10, label: '票据经办人电话', value: this.$store.state.app.detailInfo.basChargeagency.attntel },
    //         { key: 11, label: '银行执收范围', value: this.$store.state.app.detailInfo.bankchargescope },
    //         { key: 12, label: '单位执收范围', value: this.$store.state.app.detailInfo.agencychargescope },
    //         { key: 13, label: '核销票据种类', value: '' },
    //         { key: 14, label: '单位性质', value: this.$store.state.app.detailInfo.basChargeagency.agencykind },
    //         { key: 15, label: '负责人', value: this.$store.state.app.detailInfo.basChargeagency.treasurer },
    //         { key: 25, label: '负责人电话', value: this.$store.state.app.detailInfo.basChargeagency.treasurertel },
    //         { key: 16, label: '经办人', value: this.$store.state.app.detailInfo.basChargeagency.attn },
    //         { key: 17, label: '经办人电话', value: this.$store.state.app.detailInfo.basChargeagency.attntel },
    //         { key: 18, label: '经办人身份证号', value: this.$store.state.app.detailInfo.identityid },
    //         { key: 19, label: '机构代码', value: this.$store.state.app.detailInfo.basChargeagency.orgcode },
    //         { key: 20, label: '预算拨款性质', value: this.$store.state.app.detailInfo.basChargeagency.budgetkind },
    //         { key: 21, label: '打印人', value: this.$store.state.user.userInfo.name },
    //         { key: 22, label: '项目集合', value: '' },
    //         { key: 23, label: '换证日期', value: this.$store.state.app.detailInfo.transactdate }
    //       ]
    //       this.formPrintData = [...formPrintData]
    //       console.log('监听到了变化', this.formPrintData)
    //     }
    //   },
    //   immediate: true,
    //   deep: true
    // }
  },
  beforeCreate() {
    this.$store.commit('INITDETAILINFO')
  },
  created() {
    this.getPrintData()
    this.$store.dispatch('SetSubMenuGuid', '')
    // 组件创建时，立即调用获取树节点api，生成树，并将树节点信息存在data中。
    this.getTreeNodeInfo()
    // bus总线接受tabs点击时，传递过来的获取table列表信息的请求。
    Bus.$off('getTableListRequest')
    Bus.$on('getTableListRequest', params => {
      this.getTableListRequest(params)
    })
    // 手动设置treeComponent组件的显示与隐藏（创建和销毁）
    Bus.$off('handleShowTree')
    Bus.$on('handleShowTree', (boolValue) => {
      this.handleShowTree(boolValue)
    })

    // 获取详情信息
    Bus.$off('getDetailRequest')
    Bus.$on('getDetailRequest', (params) => {
      this.getDetailRequest(params)
    })

    // 获取树形列表节点信息。
    Bus.$off('getTreeNodeInfo')
    Bus.$on('getTreeNodeInfo', () => {
      this.getTreeNodeInfo()
    })
  },
  beforeDestroy() {
  },
  methods: {

    getPrintData() {
      var templateCode = this.$route.path
      getPrintTemplateData(templateCode).then(res => {
        if (res.data.length > 0) {
          this.templateDataList = res.data
          console.log('服务器有数据，使用服务器数据')
        } else {
          this.templateDataList.push(JSON.parse(JSON.stringify(this.templateInitData)))
          this.templateDataList[0].templatecontent = JSON.stringify(this.templateDataList[0].templatecontent)
          savePrintTemplateData(this.templateDataList[0]).then(res => {
            this.templateDataList[0].guid = res.data.guid
          })
          console.log('服务器没有数据，用本地的数据！')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取树形列表节点信息。
    getTreeNodeInfo() {
      getTree(this.urlPath).then(res => {
        var dataArr = [res.data]
        this.data = dataArr
      }).catch((err) => {
        console.log(err)
      })
    },
    // 手动控制treeComponent组件的显示和隐藏。
    handleShowTree(bool) {
      this.refreshTree = bool
    },
    // 自定义事件，用来接受treeComponents触发的获取详细信息事件。
    getDetailRequest(params) {
      getDetail(this.urlPath, params).then(res => {
        var formData = res.data
        // 针对id为-1的特殊处理，因为后台没有传这部分数据，会导致后面add的时候出错。
        if (formData.id === '-1') {
          formData.basChargeagency = {}
          // formData.storagename = ''
          // formData.pinyinshortcode = ''
          // formData.defaultprice = ''
          formData.guid = -1
          formData.isenabled = 1
        }
        // 这里也坑爹，突然传了一个null/undefined
        if (!formData.basChargeagency) {
          formData.basChargeagency = {}
        }
        // 获取到详细信息之后，存到vuex中去。
        this.$store.dispatch('SetDetailInfo', formData)
      })
    },
    // 自定义事件，用了接受treeComponents触发的获取列表信息事件。
    getTableListRequest(params) {
      getTableListInfo(this.urlPath, params).then(res => {
        // 获取到列表信息之后，存到vuex中去。
        console.log('收到的list信息为', res.data)
        this.$store.dispatch('SetListInfo', res.data)
      })
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
</style>

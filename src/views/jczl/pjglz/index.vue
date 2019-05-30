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
        <employUnit/>
      </tab>
    </treeComponent>
    <pjglzPrint :template-list="templateDataList" :form-print-data="formPrintData" />
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
import { getPrintTemplateData, savePrintTemplateData } from '@/api/webPrint'

// import listInfo from './listInfo'

export default {
  components: {
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
      templateDataList: [],
      templateInitData: {
        guid: '',
        userid: null,
        templatecontent: {
          lodopPrintStr: ``
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
      ],
      formPrintData: [
        { key: 1, text: '区划编码', value: '区划编码2' },
        { key: 2, text: '区划名称', value: '区划名称2' },
        { key: 3, text: '单位编码', value: '单位编码2' },
        { key: 3, text: '领用证编号', value: '领用证编号2' },
        { key: 4, text: '办理日期', value: '办理日期2' },
        { key: 5, text: '收费许可证号', value: '收费许可证号2' },
        { key: 6, text: '票据管理部门', value: '票据管理部门2' },
        { key: 7, text: '票据经办人', value: '票据经办人2' },
        { key: 8, text: '票据经办人电话', value: '票据经办人电话2' },
        { key: 9, text: '银行执收范围', value: '银行执收范围2' },
        { key: 10, text: '单位执收范围', value: '单位执收范围2' },
        { key: 11, text: '核销票据种类', value: '核销票据种类2' },
        { key: 12, text: '单位性质', value: '单位性质2' },
        { key: 13, text: '负责人', value: '负责人2' },
        { key: 14, text: '经办人', value: '经办人2' },
        { key: 15, text: '经办人电话', value: '经办人电话2' },
        { key: 16, text: '经办人身份证号', value: '经办人身份证号2' },
        { key: 17, text: '机构代码', value: '机构代码2' },
        { key: 18, text: '预算拨款性质', value: '预算拨款性质2' },
        { key: 19, text: '打印人', value: '打印人2' },
        { key: 20, text: '项目集合', value: '项目集合2' },
        { key: 21, text: '换证日期', value: '换证日期2' }
      ]
    }
  },

  computed: {
    ...mapState({
      detailInfo: state => state.app.detailInfo,
      savestate: state => state.app.savestate
    })
  },

  watch: {
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
    // 自定义事件，用来接受treeComponents触发的获取详细信息事件。
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

<!--fssrxm 非税收入项目  -->
<template>
  <div>
    <toolBar :client-butns-array="clientButnsArray" />
    <treeComponent v-if="refreshTree" :data="data">
      <base-locate slot="header" />
      <tab slot="tabs" :other-tabs-array="otherTabsArray">
        <formgroup slot="detail" :form="detailInfo" />
        <listInfo slot="listInfo" :tb-head="listInfoTableHead" />
      </tab>
    </treeComponent>
    <tablePrintSet :print-data="listInfo" :template-data="templateDataList"/>
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
import listInfo from '@/components/listInfo'
import tablePrintSet from '@/components/tablePrintSet'
import { getPrintTemplateData, savePrintTemplateData } from '@/api/webPrint'

export default {
  components: {
    tablePrintSet,
    treeComponent, // 节点树组件
    baseLocate, // 节点数的头部。
    formgroup, // 右侧详情信息表单。
    toolBar, // 上方工具条栏
    tab, // 右侧tab选项卡
    listInfo // 右侧列表信息
  },
  data() {
    return {
      templateInitData: {
        guid: '',
        userid: null,
        templatecontent: {
          title: `${this.$route.meta.title}`,
          printHeadHeight: 50, // 打印头部区域的高度，单位mm
          printHead: [
            { text: '制表人', value: this.$store.state.user.name, checked: true }
          ],
          tableHead: [
            { text: '收费项目编号', key: 'nontaxcode', width: '100', checked: true },
            { text: '收费项目名称', key: 'nontaxname', width: '220', checked: true },
            { text: '是否末级', key: 'isleaf', width: '100', checked: false },
            { text: '是否启用', key: 'isenabled', width: '100', checked: false },
            { text: '收费类别编码', key: 'basChargetype.chargetypecode', width: '100', checked: true },
            { text: '收费类别名称', key: 'basChargetype.chargetypename', width: '220', checked: true },
            { text: '资金性质编码', key: 'basFundtype.fundtypecode', width: '100', checked: false },
            { text: '资金性质名称', key: 'basFundtype.fundtypename', width: '220', checked: false },
            { text: '收费上限', key: 'chargelimit', width: '100', checked: true },
            { text: '收费下限', key: 'chargelower', width: '100', checked: true },
            { text: '营业税率', key: 'salestax', width: '100', checked: false },
            { text: '是否公用项目', key: 'ispublicprogram', width: '100', checked: false },
            { text: '费证查询标志', key: 'allowquerymark', width: '100', checked: false },
            { text: '内部往来标志', key: 'internalcontactmark', width: '100', checked: false },
            { text: '单位', key: 'chargeunit', width: '100', checked: true },
            { text: '会计科目编码', key: 'subcode', width: '100', checked: false },
            { text: '会计科目名称', key: 'subname', width: '100', checked: false },
            { text: '收费文号', key: 'chargedocno', width: '150', checked: false },
            { text: '收费项目全称', key: 'nontaxfallname', width: '100', checked: false }],
          printFoot: [
            { text: '制表人', value: this.$store.state.user.name, checked: true }
          ]
        },
        isdefault: 1, // 是否现在使用的模板
        templatecode: this.$route.path,
        templatename: `标准模板（${this.$route.meta.title}）`,
        isstandardtemplage: 1 // 是否标准模板
      },
      templateDataList: [],
      otherTabsArray: ['projectDocument', 'sflbtzxx', 'sfbztzxx', 'sfxmtzxx'],
      data: [],
      refreshTree: true,
      urlPath: '/bas/basChargeproject',
      clientButnsArray: ['close', 'add', 'update', 'delete', 'refresh', 'save', 'abolish', 'tablePrintPreview', 'grant', 'update', 'add', 'delete', 'tablePrint', 'tablePrintSet', 'tablePrintExport'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      // listInfo的表头，需要手动传进去。
      listInfoTableHead: [
        { label: '收费项目编号', prop: 'nontaxcode', width: 180 },
        { label: '收费项目名称', prop: 'nontaxname', width: 180 },
        { label: '是否末级', prop: 'isleaf' },
        { label: '是否启用', prop: 'isenabled', width: 180 },
        { label: '收费类别编码', prop: 'basChargetype.chargetypecode', width: 180 },
        { label: '收费类别名称', prop: 'basChargetype.chargetypename', width: 180 },
        { label: '资金性质编码', prop: 'basFundtype.fundtypecode', width: 180 },
        { label: '资金性质名称', prop: 'basFundtype.fundtypename', width: 180 },
        { label: '收费上限', prop: 'chargelimit', width: 180 },
        { label: '收费下限', prop: 'chargelower', width: 180 },
        { label: '营业税率', prop: 'salestax', width: 180 },
        { label: '是否公用项目', prop: 'ispublicprogram', width: 180 },
        { label: '费证查询标志', prop: 'allowquerymark', width: 180 },
        { label: '内部往来标志', prop: 'internalcontactmark', width: 180 },
        { label: '收费计量单位', prop: 'chargeunit', width: 180 },
        { label: '会计科目编码', prop: 'subcode', width: 180 },
        { label: '会计科目名称', prop: 'subname', width: 180 },
        { label: '收费文号', prop: 'chargedocno', width: 180 },
        { label: '收费项目全称', prop: 'nontaxfallname', width: 180 }
      ]
    }
  },

  computed: {
    ...mapState({
      listInfo: state => state.app.listInfo,
      detailInfo: state => state.app.detailInfo,
      savestate: state => state.app.savestate
    })
  },

  watch: {
  },

  created() {
    // 组件创建时，立即获取打印模板数据。
    this.getPrintData()
    this.$store.dispatch('SetSubMenuGuid', '')
    this.$store.commit('INITDETAILINFO')
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
        console.log(res.data)
        if (res.data.length > 0) {
          this.templateDataList = res.data
          console.log('获取了服务器数据！')
        } else {
          this.templateDataList.push(JSON.parse(JSON.stringify(this.templateInitData)))
          this.templateDataList[0].templatecontent = JSON.stringify(this.templateInitData.templatecontent)
          savePrintTemplateData(this.templateDataList[0])
          console.log('获取了本地数据，并将本地数据存到了服务器！')
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
        console.log('收到的对象是', res.data)
        if (formData.basChargetype === undefined) {
          formData.basChargetype = {}
        }
        if (formData.basFundtype === undefined) {
          formData.basFundtype = {}
        }
        if (formData.basBudgetsubject === undefined) {
          formData.basBudgetsubject = {}
        }

        // 针对id为-1的特殊处理，因为后台没有传这部分数据，会导致后面add的时候出错。
        if (formData.id === '-1') {
          formData.nontaxcode = ''
          formData.nontaxname = ''
          formData.guid = '-1'
          formData.basChargetype = {}
          formData.basFundtype = {}
          formData.basBudgetsubject = {}
          formData.isenabled = 1
        }
        // 获取到详细信息之后，存到vuex中去。
        this.$store.dispatch('SetDetailInfo', formData)
      })
    },
    // 自定义事件，用了接受treeComponents触发的获取列表信息事件。
    getTableListRequest(params) {
      getTableListInfo(this.urlPath, params).then(res => {
        console.log('收到的列表信息为：', res.data)

        // 获取到列表信息之后，存到vuex中去。
        this.$store.dispatch('SetListInfo', res.data)
      })
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
</style>

<!--fssrxm 非税收入项目  -->
<template>
  <div>
    <toolBar :client-butns-array="clientButnsArray"/>
    <treeComponent v-if="refreshTree" :data="data">
      <base-locate slot="header"/>
      <tab slot="tabs" :other-tabs-array="otherTabsArray">
        <formgroup slot="detail" :form="detailInfo"/>
        <listInfo slot="listInfo" :tb-head="listInfoTableHead"/>
      </tab>
    </treeComponent>
    <tablePrintSet :print-data="listInfo" :template-data="templateDataList"/>
    <sq ref="sq"/>
  </div>
</template>

<script>
import Bus from '@/utils/Bus'
import { mapState } from 'vuex'
import { getDetail, getTableListInfo, getTree } from '@/api/jczl'
import baseLocate from '@/components/treeHeader/baseLocate'
import treeComponent from '@/components/treeComponent'
import tab from '@/components/tab'
import toolBar from '@/components/toolBar'
import formgroup from './formgroup'
import sq from './sq'
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
    listInfo, // 右侧列表信息
    sq
  },
  data() {
    return {
      templateData: [
        {
          guid: '',
          userid: null,
          templatecontent: {
            title: `${this.$route.meta.title}`,
            printHeadHeight: 50, // 打印头部区域的高度，单位mm
            printHead: [
              { text: '制表人', value: this.$store.state.user.name, checked: true }
            ],
            tableHead: [
              { text: '编码', key: 'fno', width: '100', checked: true },
              { text: '名称', key: 'fname', width: '220', checked: true },
              { text: '文件文号', key: 'fnofile', width: '100', checked: false },
              { text: '发文机关', key: 'agencyname', width: '100', checked: false },
              { text: '主题词', key: 'ftopic', width: '100', checked: true },
              { text: '文件名称', key: 'fileName', width: '220', checked: true }
            ],
            printFoot: [
              { text: '制表人', value: this.$store.state.user.name, checked: true }
            ]
          },
          isdefault: 1, // 是否现在使用的模板
          templatecode: this.$route.path,
          templatename: `标准模板（${this.$route.meta.title}）`,
          isstandardtemplage: 1 // 是否标准模板
        }
      ],
      templateDataList: [],
      // otherTabsArray: [],
      otherTabsArray: ['chargeNum'],
      data: [],
      refreshTree: true,
      urlPath: '/pol/polProjectFnoFileLib',
      clientButnsArray: ['upload', 'download', 'close', 'add', 'update', 'delete', 'refresh', 'save', 'abolish', 'tablePrintPreview', 'grantbtn', 'update', 'add', 'delete', 'tablePrint', 'tablePrintSet', 'tablePrintExport'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      // listInfo的表头，需要手动传进去。
      listInfoTableHead: [
        { label: '编码', prop: 'fno', width: 180 },
        { label: '文件级次', prop: 'flevel', width: 180 },
        { label: '文件类型', prop: 'ftype', width: 180 },
        { label: '发文日期', prop: 'deliverdate', width: 180 },
        { label: '发文机关', prop: 'agencyname', width: 180 },
        { label: '主题词', prop: 'ftopic', width: 180 },
        { label: '失效日期', prop: 'overdue', width: 180 },
        { label: '文件文号', prop: 'fnofile', width: 180 },
        { label: '文件名称', prop: 'fileName', width: 180 },
        { label: 'admdivcode', prop: 'admdivcode', width: 180 },
        { label: 'year', prop: 'year', width: 180 }
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

  watch: {},

  created() {
    // 授权
    Bus.$off('grantbtn')
    Bus.$on('grantbtn', () => {
      this.$refs.sq.dialogTableVisible = true
    })
    // // 上传
    // Bus.$off('upload')
    // Bus.$on('upload', () => {
    //   // this.$refs.sq.uploaddownload = true
    // })
    // 下载
    // Bus.$off('download')
    // Bus.$on('download', () => {
    //   // this.$refs.sq.dialogTableVisible = true
    // })
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
          this.templateDataList = JSON.parse(JSON.stringify(this.templateData))
          this.templateDataList[0].templatecontent = JSON.stringify(this.templateData[0].templatecontent)
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

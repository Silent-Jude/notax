<!--zsfdw 执收（罚）单位 -->
<template>
  <div>
    <toolBar :client-butns-array="clientButnsArray" />
    <treeComponent v-if="refreshTree" :data="data">
      <base-locate slot="header" />
      <tab slot="tabs">
        <formgroup slot="detail" :form="detailInfo" />
        <listInfo slot="listInfo" :tb-head="listInfoTableHead"/>
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
            { text: '单位代码', key: 'agencycode', width: '100', checked: true },
            { text: '单位名称', key: 'agencyname', width: '100', checked: true },
            { text: '拼音简码', key: 'pinyincode', width: '100', checked: false },
            { text: '单位性质', key: 'agencykind', width: '100', checked: false },
            { text: '单位等级', key: 'agencyrank', width: '100', checked: false },
            { text: '组织机构代码', key: 'orgcode', width: '100', checked: false },
            { text: '负责人', key: 'treasurer', width: '100', checked: false },
            { text: '负责人电话', key: 'treasurertel', width: '100', checked: false },
            { text: '经办人', key: 'attn', width: '100', checked: true },
            { text: '经办人电话', key: 'attntel', width: '100', checked: true },
            { text: '预算拨款性质', key: 'budgetkind', width: '100', checked: false },
            { text: '单位类型代码', key: 'agencytypecode', width: '100', checked: false },
            { text: '联系地址', key: 'address', width: '100', checked: false }],
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
      data: [],
      refreshTree: true,
      urlPath: '/bas/basChargeagency',
      clientButnsArray: ['close', 'refresh', 'save', 'abolish', 'tablePrintPreview', 'update', 'add', 'delete', 'tablePrint', 'tablePrintSet', 'tablePrintExport'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      // listInfo的表头，需要手动传进去。
      listInfoTableHead: [
        { label: '单位代码', prop: 'agencycode', width: 100 },
        { label: '单位名称', prop: 'agencyname', width: 100 },
        { label: '拼音简码', prop: 'pinyincode' },
        { label: '单位性质', prop: 'agencykind', width: 100 },
        { label: '单位等级', prop: 'agencyrank', width: 100 },
        { label: '组织机构代码', prop: 'orgcode', width: 100 },
        { label: '负责人', prop: 'treasurer', width: 100 },
        { label: '负责人电话', prop: 'treasurertel', width: 100 },
        { label: '经办人', prop: 'attn', width: 100 },
        { label: '经办人电话', prop: 'attntel', width: 100 },
        { label: '预算拨款性质', prop: 'budgetkind', width: 100 },
        { label: '单位类型代码', prop: 'agencytypecode', width: 100 },
        { label: '联系地址', prop: 'address', width: 100 }
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
  beforeCreate() {
    this.$store.commit('INITDETAILINFO')
  },
  created() {
    // 组件创建时，立即获取打印模板数据。
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
    Bus.$off('getPrintData')
    Bus.$on('getPrintData', () => {
      this.getPrintData()
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
          formData.agencycode = ''
          formData.agencyname = ''
          formData.guid = '-1'
          formData.isenabled = 1
        }
        console.log(formData)
        // 获取到详细信息之后，存到vuex中去。
        this.$store.dispatch('SetDetailInfo', formData)
      })
    },
    // 自定义事件，用了接受treeComponents触发的获取列表信息事件。
    getTableListRequest(params) {
      getTableListInfo(this.urlPath, params).then(res => {
        // 获取到列表信息之后，存到vuex中去。
        console.log('收到的列表信息为：', res.data)
        this.$store.dispatch('SetListInfo', res.data)
      })
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
</style>

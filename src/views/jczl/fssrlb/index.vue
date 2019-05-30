<!--fssrlb 非税收入类别  -->
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

// var name = Store.user.name

export default {
  components: {
    tablePrintSet, // 表格打印设置组件。
    treeComponent, // 节点树组件
    baseLocate, // 节点数的头部。
    formgroup, // 右侧详情信息表单。
    toolBar, // 上方工具条栏
    tab, // 右侧tab选项卡
    listInfo // 右侧列表信息
  },
  data() {
    return {
      // LODOP: '', // 调用getLodop获取LODOP对象
      templateInitData: {
        guid: '',
        userid: null,
        templatecontent: {
          title: `${this.$route.meta.title}`,
          direction: 1,
          printHeadHeight: 50, // 打印头部区域的高度，单位mm
          printHead: [
            { text: '制表人', value: this.$store.state.user.name, checked: true }
          ],
          tableHead: [
            { text: '收费类别编码', key: 'chargetypecode', width: 120, checked: true },
            { text: '收费类别名称', key: 'chargetypename', width: 200, checked: true },
            { text: '区划', key: 'admdivcode', width: 100, checked: false },
            { text: '业务日期', key: 'createdate', width: 220, checked: false },
            { text: '年度', key: 'year', width: 90, checked: false },
            { text: '创建人', key: 'creator', width: 180, checked: true },
            { text: '备注', key: 'remark', width: 100, checked: false }
          ],
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
      urlPath: '/bas/basChargetype',
      clientButnsArray: ['close', 'refresh', 'save', 'abolish', 'tablePrintPreview', 'refresh', 'update', 'add', 'delete', 'tablePrint', 'tablePrintSet', 'tablePrintExport'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      // listInfo的表头，需要手动传进去。
      listInfoTableHead: [
        { label: '收费类别编码', prop: 'chargetypecode', width: 180 },
        { label: '收费类别名称', prop: 'chargetypename', width: 180 },
        { label: '备注', prop: 'remark' }
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
    // console.log('看看lodop', this.LODOP)
    this.$store.dispatch('SetSubMenuGuid', '')
    console.log('已经把数据data加载完毕。vuex中的detailinfo', this.detailInfo)
    // this.$store.commit('INITDETAILINFO')
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
  mounted() {
    console.log('文档dom加载完毕，vuex中的detailinfo：', this.detailInfo)
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
          console.log('本地服务器数据是：', this.templateInitData)
          // var obj = JSON.parse(JSON.stringify(this.templateInitData))
          this.templateDataList.push(JSON.parse(JSON.stringify(this.templateInitData)))
          // this.templateDataList[0].templatecontent = JSON.stringify(this.templateInitData.templatecontent)
          console.log('templateInitData是：', this.templateInitData)
          console.log('转换后是：', JSON.parse(JSON.stringify(this.templateInitData)))

          console.log('templateDataList是：', this.templateDataList)
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
        // 针对id为-1的特殊处理，因为后台没有传这部分数据，会导致后面add的时候出错。
        if (formData.id === '-1') {
          formData.chargetypecode = ''
          formData.chargetypename = ''
          formData.guid = '-1'
          formData.isenabled = 1
        }
        // 获取到详细信息之后，存到vuex中去。
        this.$store.dispatch('SetDetailInfo', res.data)
      })
    },
    // 自定义事件，用了接受treeComponents触发的获取列表信息事件。
    getTableListRequest(params) {
      getTableListInfo(this.urlPath, params).then(res => {
        // 获取到列表信息之后，存到vuex中去。
        this.$store.dispatch('SetListInfo', res.data)
      })
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
</style>

<!--pzyzc 票证印制厂 -->
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

export default {
  components: {
    treeComponent, // 节点树组件
    baseLocate, // 节点数的头部。
    formgroup, // 右侧详情信息表单。
    toolBar, // 上方工具条栏
    tab, // 右侧tab选项卡
    listInfo // 右侧列表信息
  },
  data() {
    return {
      data: [],
      refreshTree: true,
      urlPath: '/bas/basBillprinting',
      clientButnsArray: ['close', 'refresh', 'save', 'abolish', 'tablePrintPreview', 'update', 'add', 'delete', 'tablePrint', 'tablePrintSet', 'tablePrintExport'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      // listInfo的表头，需要手动传进去。
      listInfoTableHead: [
        { label: '印刷厂编码', prop: 'printingid', width: 200 },
        { label: '印刷厂名称', prop: 'printingname', width: 200 },
        { label: '印刷厂地址', prop: 'address', width: 200 },
        { label: '拼音编码', prop: 'pinyinshotcode', width: 200 },
        { label: '机构代码', prop: 'agencycode', width: 200 },
        { label: '邮政编码', prop: 'zipcode', width: 200 },
        { label: '置业执照编码', prop: 'buslicensecode', width: 200 },
        { label: '国税编码', prop: 'irscode', width: 200 },
        { label: '地税编码', prop: 'localtaxcode', width: 200 },
        { label: '特种许可证号', prop: 'specialpermitno', width: 200 },
        { label: '印刷许可证号', prop: 'printpermitno', width: 200 },
        { label: '法人代表', prop: 'legalperson', width: 200 },
        { label: '法人电话', prop: 'legalpersontel', width: 200 },
        { label: '财政负责人', prop: 'treasurer', width: 200 },
        { label: '业务负责人', prop: 'busleader', width: 200 },
        { label: '业务电话', prop: 'busleadertel', width: 200 },
        { label: '开户银行', prop: 'bankname', width: 200 },
        { label: '银行账号', prop: 'bankacctno', width: 200 },
        { label: '开户名称', prop: 'acctname', width: 200 }
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
          formData.printingid = ''
          formData.printingname = ''
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
        this.$store.dispatch('SetListInfo', res.data)
      })
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
</style>

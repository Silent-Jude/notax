<!--yxdswd 银行代收网点 -->
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
      urlPath: '/sys/basBankbranch',
      clientButnsArray: ['close', 'refresh', 'save', 'abolish', 'tablePrintPreview', 'update', 'add', 'delete', 'tablePrint', 'tablePrintSet', 'tablePrintExport'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      // listInfo的表头，需要手动传进去。
      listInfoTableHead: [
        { label: '银行网点编码', prop: 'bankbranchcode', width: 150 },
        { label: '银行网点名称', prop: 'bankbranchname', width: 150 },
        { label: '经办人', prop: 'attn' },
        { label: '经办人联系电话', prop: 'attntel', width: 150 },
        { label: '会计科目代码', prop: 'accountclsenumcode', width: 150 },
        { label: '联系地址', prop: 'address', width: 150 }
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
        console.log('树节点的信息为：', dataArr)
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
        console.log('收到的详细细信息：', res.data)
        var formData = res.data
        // 针对id为-1的特殊处理，因为后台没有传这部分数据，会导致后面add的时候出错。
        if (formData.id === '-1') {
          formData.bankbranchcode = ''
          formData.bankbranchname = ''
          formData.isenabled = 1
          formData.guid = -1
        }
        // 银行代收网点传空数据的时候。
        if (formData.bankbranchcode === undefined) {
          formData.bankbranchcode = ''
          formData.bankbranchname = ''
          formData.isenabled = 1
          formData.guid = -1
        }
        // 获取到详细信息之后，存到vuex中去。
        this.$store.dispatch('SetDetailInfo', formData)
      })
    },
    // 自定义事件，用了接受treeComponents触发的获取列表信息事件。
    getTableListRequest(params) {
      getTableListInfo(this.urlPath, params).then(res => {
        // 获取到列表信息之后，存到vuex中去。
        this.$store.dispatch('SetListInfo', res.data)
        console.log('收到的列表信息listInfo为：', res.data)
      }).catch(err => { console.log(err) })
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
</style>

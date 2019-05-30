<!--ywksdysfdw 业务科室对应收费单位  -->
<template>
  <div>
    <toolBar :client-butns-array="clientButnsArray" />
    <!-- <button @click="grantSave">保存授权</button> -->
    <TreeLayout v-if="refreshTree" :data="leftTreeData">
      <leftLocate slot="header" :title="leftTitle" />
      <TabList slot="tabs" :label-array="labelArray">
        <!-- <formgroup slot="detail" :form="detailInfo" /> -->
        <div slot="detail" class="tree-menu">
          <rightLocate class="right-locate" />
          <el-scrollbar class="right-scrollbar" style="height:100%">
            <el-tree ref="rightTree" :data="rightTreeData" :filter-node-method="isGrantState" :props="rightTreeProps" :default-checked-keys="rightTreeCheckedId" :default-expanded-keys="rightTreeExpandedNode" highlight-current node-key="id" show-checkbox/>
          </el-scrollbar>
        </div>
        <listInfo slot="listInfo" :list-info="tableListData" :tb-head="listInfoTableHead" />
      </TabList>
    </TreeLayout>
    <tablePrintSet :print-data="tableListData" :template-data="templateDataList" :form-print-data="formPrintData"/>

  </div>
</template>

<script>
import Pinyin from '@/utils/chinesePY'
import Bus from '@/utils/Bus'
import { mapState } from 'vuex'
import sjqx from '@/api/xtgl/sjqx'
import leftLocate from '../components/leftLocate'
import rightLocate from '../components/rightLocate'
import TreeLayout from '../components/TreeLayout'
import TabList from '../components/TabList'
import toolBar from '@/components/toolBar'
import listInfo from '../components/listInfo'
import { _flatten } from '@/utils/Common'
import tablePrintSet from '@/components/tablePrintSet'
import { getPrintTemplateData, savePrintTemplateData } from '@/api/webPrint'

export default {
  components: {
    tablePrintSet, // 表格打印设置组件。
    TreeLayout, // 节点树组件
    leftLocate, // 节点数的头部。
    rightLocate, // 右侧定位
    toolBar, // 上方工具条栏
    TabList, // 右侧tab选项卡
    listInfo // 右侧列表信息
  },
  props: {
    specialData: {
      type: Object,
      required: false,
      default() {
        return {
          normalListTableHead: [ // 正序列表表格的表头。
            { label: '单位编码', prop: 'agencycode', width: 350 },
            { label: '单位名称', prop: 'agencyname', width: 350 }
          ],
          reverseListTableHead: [// 反向列表表格表头
            { label: '处室编号', prop: 'officecode', width: 350 },
            { label: '处室名称', prop: 'officename', width: 350 }
          ],
          normalLeftTitle: '业务科室',
          normalRightTitle: '执收单位',
          normalLeftTreeParams: 'agencyId',
          normalRightTreeParams: 'officeId'
        }
      }
    }
  },
  data() {
    return {
      templateDataList: [], // 准备发送到打印组件的的模板列表

      nodeText: '',
      leftTreeData: [], // 左侧树的数据。
      rightTreeData: [], // 右侧树数据。
      tableListData: [], // 左侧选中节点对应的表格数据
      rightTreeCheckedId: [], // 右侧树被选中的节点的id
      rightTreeExpandedNode: ['-1'], // 右侧树展开节点
      refreshTree: true, // 用于控制tree重新渲染。
      // urlPath: '/authority/query/findOffice2ChargeAgency',
      clientButnsArray: ['close', 'grant', 'exchange', 'grantSave', 'grantAbolish', 'query', 'grantPreview', 'grantPrint', 'grantSet', 'grantExport'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      // listInfo的表头，需要手动传进去。
      // listInfoTableHead: [ // 列表表格的表头。
      //   { label: '单位编码', prop: 'agencycode', width: 350 },
      //   { label: '单位名称', prop: 'agencyname', width: 350 }
      // ],
      rightTreeProps: {// 右 树节点的label和children
        children: 'children',
        label: 'text'
      }
    }
  },

  computed: {
    ...mapState({
      detailInfo: state => state.app.detailInfo,
      savestate: state => state.app.savestate,
      currentNodeIndexRight: state => state.sjqx.currentNodeIndexRight,
      leftTreeNodeFamilyIdList: state => state.sjqx.leftTreeNodeFamilyIdList,
      exchangeState: state => state.sjqx.exchangeState,
      selectedLeftTreeNodeGuid: state => state.sjqx.selectedLeftTreeNodeGuid
    }),
    grantState() {
      if (this.savestate > 0) {
        return true
      } else {
        return false
      }
    },
    leftTitle() {
      if (this.exchangeState === 'normal') {
        return this.specialData.normalLeftTitle
      } else {
        return this.specialData.normalRightTitle
      }
    },
    rightTitle() {
      if (this.exchangeState === 'normal') {
        return this.specialData.normalRightTitle
      } else {
        return this.specialData.normalLeftTitle
      }
    },
    labelArray() {
      return [this.rightTitle, this.rightTitle + '列表']
    },
    leftTreeParams() {
      return this.specialData.normalLeftTreeParams
    },
    rightTreeParams() {
      return this.specialData.normalRightTreeParams
    },
    listInfoTableHead() {
      if (this.exchangeState === 'normal') {
        return this.specialData.normalListTableHead
      } else {
        return this.specialData.reverseListTableHead
      }
    },
    templateInitData() {
      return {
        guid: '',
        userid: null,
        templatecontent: {
          title: `${this.leftTitle}对应${this.rightTitle}`,
          direction: 1,
          printHeadHeight: 50, // 打印头部区域的高度，单位mm
          printHead: [
            { text: '制表人', value: this.$store.state.user.name, checked: true },
            { text: this.leftTitle, value: this.nodeText, checked: true }
          ],
          tableHead: this.printTableHead,
          printFoot: [
            { text: '制表人', value: this.$store.state.user.name, checked: true },
            { text: this.leftTitle, value: this.$store.state.user.name, checked: true }
          ]
        },
        isdefault: 1, // 是否现在使用的模板
        templatecode: this.$route.path + '/' + this.exchangeState,
        templatename: `标准模板（${this.leftTitle}对应${this.rightTitle}）`,
        isstandardtemplage: 1 // 是否标准模板
      }
    },
    formPrintData() {
      return [
        { text: '制表人', value: this.$store.state.user.name, checked: true },
        { text: this.leftTitle, value: this.nodeText, checked: true }
      ]
    },
    printTableHead() {
      return this.listInfoTableHead.map(item => ({ text: item.label, key: item.prop, width: item.width, checked: true }))
    }
  },

  watch: {
    exchangeState(newVal, oldVal) {
      this.getLeftTreeNodeInfo()
      this.getRightTreeInfo({ guid: '-1' })
    }
    // savestate: {
    //   handler(newVal) {
    //     this.$nextTick(() => {
    //       this.$refs.rightTree.filter(newVal)
    //     })
    //   },
    //   immediate: true
    // }
  },
  beforeCreate() {
    this.$store.commit('INITDETAILINFO')
  },
  created() {
    Bus.$off('sendNodeText')
    Bus.$on('sendNodeText', (val) => {
      this.nodeText = val
    })
    Bus.$off('grantPrint')
    Bus.$on('grantPrint', () => {
      this.grantPrint()
    })
    Bus.$off('grantPreview')
    Bus.$on('grantPreview', () => {
      this.grantPreview()
    })
    Bus.$off('grantSet')
    Bus.$on('grantSet', () => {
      this.grantSet()
    })
    Bus.$off('grantExport')
    Bus.$on('grantExport', () => {
      this.grantExport()
    })

    Bus.$off('clearRightTableData')
    Bus.$on('clearRightTableData', () => {
      this.tableListData = []
    })

    this.$store.dispatch('SetExchangeState', 'normal')
    // 组件创建时，立即调用获取树节点api，生成树，并将树节点信息存在data中。
    this.getLeftTreeNodeInfo()

    Bus.$off('getLeftTreeNodeInfo')
    Bus.$on('getLeftTreeNodeInfo', () => {
      this.getLeftTreeNodeInfo()
    })
    // 手动设置treeComponent组件的显示与隐藏（创建和销毁）
    Bus.$off('handleShowTree')
    Bus.$on('handleShowTree', (boolValue) => {
      this.handleShowTree(boolValue)
    })
    // 获取详情信息
    Bus.$off('getRightTreeInfo')
    Bus.$on('getRightTreeInfo', (params) => {
      this.getRightTreeInfo(params)
    })
    // 进入授权状态。
    Bus.$off('filter')
    Bus.$on('filter', () => {
      this.filter()
    })
    // 授权保存。
    Bus.$off('grantSave')
    Bus.$on('grantSave', () => {
      this.grantSave()
    })
    Bus.$off('nextPositionRight')
    Bus.$on('nextPositionRight', (inputVal, searchType) => {
      this.handleExpandedNode(inputVal, searchType)
    })
    // Bus.$off('setExchangeState')
    // Bus.$on('setExchangeState', () => {
    //   this.setExchangeState()
    // }),
  },
  mounted() {
    console.log('文档dom加载完毕，vuex中的detailinfo：', this.detailInfo)
  },
  beforeDestroy() {
  },
  methods: {
    getPrintData() {
      var templateCode = this.$route.path + '/' + this.exchangeState
      getPrintTemplateData(templateCode).then(res => {
        console.log(res.data)
        if (res.data.length > 0) {
          this.templateDataList = res.data
          console.log('获取了服务器数据！', res.data)
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
    checkCouldPrint() {
      if (!this.selectedLeftTreeNodeGuid) {
        this.$alert('请先选择左侧节点！')
        return false
      }
      if (this.tableListData.length === 0) {
        this.$alert('没有数据信息！')
        return false
      }
      return true
    },
    grantPrint() {
      if (this.checkCouldPrint()) {
        Bus.$emit('tablePrint')
      }
    },
    grantPreview() {
      if (this.checkCouldPrint()) {
        Bus.$emit('tablePrintPreview')
        console.log('打印数据是：', this.tableListData)
      }
    },
    grantSet() {
      if (this.checkCouldPrint()) {
        Bus.$emit('tablePrintSet')
      }
    },
    grantExport() {
      if (this.checkCouldPrint()) {
        Bus.$emit('tablePrintExport')
      }
    },

    // setExchangeState(){
    //   this.$store.dispatch('SetExchangeState')
    // },

    isChecked(id) {
      return this.rightTreeCheckedId.includes(id)
    },
    // 注意，这里data数据返回的checked，并没有卵用。
    // 因为checked判断是由服务器返回的ckIds数组来判断，所以只能根据id是否在ckIds中存在判断勾选。
    isGrantState(grantState, data, node) {
      if (grantState) {
        return true
      } else {
        if (this.isChecked(data.id)) {
          return true
        } else {
          return false
        }
      }
    },

    filter() {
      console.log('过滤了一次')
      this.$refs.rightTree.filter(this.grantState)
      this.$nextTick(() => {
        this.rightTreeExpandedNode = [-1]
        console.log('设置完毕')
      })
    },
    grantSave() {
      // 右侧树 包含办选节点 去掉-1
      var nodes = this.$refs.rightTree.getCheckedNodes(false, true)
      console.log('所有待选节点为：', nodes)
      var checkedRightTreeNodeList = []
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id !== '-1') {
          checkedRightTreeNodeList.push(nodes[i].id)
        }
      }
      // 不授权 传一个-1
      if (checkedRightTreeNodeList.length < 1) {
        checkedRightTreeNodeList.push('-1')
      }
      Bus.$emit('getLeftTreeNodeFamilyIdList')

      if (this.exchangeState === 'normal') {
        // var leftTreeParams = this.specialData.normalRightTreeParams
        // var rightTreeParams = this.specialData.normalLeftTreeParams
        const params = {
          // 查询的时候左边树是agency，右边office，现在提交又变成了左边是office，右边是agency，很神奇。
          [this.rightTreeParams]: this.leftTreeNodeFamilyIdList,
          [this.leftTreeParams]: checkedRightTreeNodeList,
          // agencyId: checkedRightTreeNodeList,
          type: 'NORMAL'
        }
        this.saveGrant(params).then(res => {
          this.$alert('授权成功！', {
            center: true,
            closeOnClickModal: true,
            closeOnPressEscape: true,
            callback: action => { }
          })
          this.$store.dispatch('SETSAVESTATE', 0)
          this.filter()
          this.getRightTreeInfo({ guid: this.selectedLeftTreeNodeGuid })
        }).catch(err => { console.log(err) })
      } else {
        // 现在是reverse状态
        const params = {
          // 查询的时候左边树是office，右边agency，现在提交又变成了左边是agency，右边是office，很神奇。
          [this.leftTreeParams]: this.leftTreeNodeFamilyIdList,
          [this.rightTreeParams]: checkedRightTreeNodeList,
          type: 'REVERSE'
        }
        this.saveGrant(params).then(res => {
          this.$alert('授权成功！', {
            center: true,
            closeOnClickModal: true,
            closeOnPressEscape: true,
            callback: action => { }
          })
          console.log('反序保存后，服务器返回的结果是', res)
          this.$store.dispatch('SETSAVESTATE', 0)
          this.filter()
          this.getRightTreeInfo({ guid: this.selectedLeftTreeNodeGuid })
        }).catch(err => { console.log(err) })
      }
    },
    // 获取左侧树形列表节点信息。
    getLeftTreeNodeInfo() {
      console.log('马上获取左侧树')
      this.$store.dispatch('SetSelectedLeftTreeNodeGuid', '')
      if (this.exchangeState === 'normal') {
        // var leftTreeParams = this.leftTreeParams
        this.getTree({ [this.leftTreeParams]: -1 }).then(res => {
          console.log('正序，exchangeState为：', this.exchangeState)

          console.log('拿到了左侧树服务器数据')
          // var dataArr = [res.data]
          this.leftTreeData = [res.data]
          // 获取左侧树时，立即获取打印模板数据。
          this.getPrintData()
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.getTree({ [this.rightTreeParams]: -1 }).then(res => {
          console.log('反序，exchangeState为：', this.exchangeState)

          console.log('拿到了左侧树服务器数据')
          // var dataArr = [res.data]
          this.leftTreeData = [res.data]
          // 获取左侧树时，立即获取打印模板数据。
          this.getPrintData()
        }).catch((err) => {
          console.log(err)
        })
      }

      this.$store.commit('SET_EXPANDEDNODE', ['-1'])
    },
    // 手动控制treeComponent组件的显示和隐藏。
    handleShowTree(bool) {
      this.refreshTree = bool
    },
    // 自定义事件，用来接受treeComponents触发的获取详细信息事件。
    getRightTreeInfo(params) {
      console.log('马上获取右侧树信息')
      if (this.exchangeState === 'normal') {
        this.getTree({ [this.rightTreeParams]: params.guid }).then(res => {
          console.log('正序拿到了右侧树服务器数据', res)
          // var formData = res.data
          // 针对选择左侧节点id为-1的特殊处理，因为后台对于-1节点，返回的数据结构与非-1不一样。少套了一层。
          // 后面通过传参为-1来判断，一样的道理。
          if (res.data.id === '-1') {
            this.rightTreeData = [res.data]
            this.rightTreeCheckedId = []
            this.rightTreeExpandedNode = ['-1']
            // 这里应该返回所有列表信息，但是接口没有给数据。
            this.tableListData = []
          } else {
            this.rightTreeData = [res.data.tree]
            this.$nextTick(() => {
              this.filter()
            })
            this.rightTreeCheckedId = res.data.ckIds
            // 此处为展开选中节点，但是严重影响渲染速度。若希望更流畅，则建议直接展开-1节点。
            // this.rightTreeExpandedNode = res.data.ckIds
            this.rightTreeExpandedNode = ['-1']
            this.tableListData = res.data.list
          }
          console.log('收到的列表表单数据为：', this.tableListData)
          // this.rightTreeExpandedNode = ['-1']
        })
      } else {
        this.getTree({ [this.leftTreeParams]: params.guid }).then(res => {
          console.log('反序拿到了右侧树服务器数据', res)
          // 为什么这里要根据-1特殊判断？因为服务器传递-1时的数据结构，居然和非-1时不一样。
          if (params.guid === '-1') {
            this.rightTreeData = [res.data]
            this.rightTreeCheckedId = []
            this.rightTreeExpandedNode = ['-1']
            // 这里应该返回所有列表信息，但是接口没有给数据。
            this.tableListData = []
          } else {
            this.rightTreeData = [res.data.tree]
            this.$nextTick(() => {
              this.filter()
            })
            this.rightTreeCheckedId = res.data.ckIds
            // 不想说话，想静静。
            if (res.data.ckIds[0] === null) {
              this.rightTreeExpandedNode = []
              this.rightTreeCheckedId = []
            } else {
            // 此处为展开选中节点，但是严重影响渲染速度。若希望更流畅，则建议直接展开-1节点。
              // this.rightTreeExpandedNode = res.data.ckIds
              this.rightTreeExpandedNode = ['-1']
              this.rightTreeCheckedId = res.data.ckIds
            }
            this.tableListData = res.data.list
          }
          console.log('收到的列表表单数据为：', this.tableListData)
          // this.rightTreeExpandedNode = ['-1']
        })
      }
    },
    handleFocusCurrentNode(guid) {
      this.$refs.rightTree.setCurrentKey(guid)
      this.$nextTick(() => {
        var currentNode = this.$refs.rightTree.$el.getElementsByClassName('is-current')[0]
        if (currentNode) {
          currentNode.focus()
          currentNode.click()
        }
      })
    },
    // 展开节点方法（按拼音或者代码）
    handleExpandedNode(inputVal, searchType) {
      // console.log(this.data)
      // 思路，首先将对象扁平化，然后查找。
      var arr = _flatten(this.rightTreeData, ['id', 'text', 'parentId'])
      // 带查找的目标对象信息。
      var target = {}
      if (searchType === 'spell') {
        // 获取查找到的节点信息。
        target = this.findNextNodePinyin(arr, inputVal)
      } else if (searchType === 'code') {
        target = this.findNextNodeCode(arr, inputVal)
      }
      console.log('找到的目标节点是：', target)

      // 找到节点后，获取到节点guid，并且手动刷新treeComponent组件以恢复组件树的默认收缩状态，然后根据保存的guid，在vuex中保存展开的节点guid，选中节点的guid
      if (target) {
        var { id } = target
        console.log('找到的目标节点是：', target)
        // 向父组件index发送手动刷新tree组件事件，恢复被展开的树。
        // Bus.$emit('handleShowTree', false)
        // this.handleShowTree(false)
        // this.$nextTick(() => {
        // this.handleShowTree(true)
        // Bus.$emit('handleShowTree', true)
        // console.log('我已经刷新完了，你猜猜看有什么结果') // 结果是你把右侧表格组件给刷没了，因为右侧的组件也是包裹在treeComponent中的。导致右侧的组件无法接受到
        // 问题已经解决，通过bus传值，可以触发index中的事件，从而重新获取值。
        // this.$store.commit('SET_EXPANDEDNODE', [id])
        this.rightTreeExpandedNode = [id]
        // 手动设置选中的节点
        // this.$store.dispatch('SetSelectedLeftTreeNodeGuid', id)
        // this.$refs.tree.setCurrentKey(id)
        // 手动触发节点点击事件。
        console.log('找到的目标节点是：', target)
        this.handleFocusCurrentNode(target.id)
        // })
      }
    },

    // 按代码查找下一个tree的node节点功能函数。
    findNextNodeCode(arr, code) {
      console.log('按代码找')
      // var index = 0
      var res = arr.find((item, i, arr) => {
        // 只有当前的i等于记录下的index时，才执行
        if (i === this.currentNodeIndexRight) {
          if (arr[this.currentNodeIndexRight].text.indexOf(code) !== -1) {
            this.$store.commit('SET_CURRENTNODEINDEXRIGHT', this.currentNodeIndexRight + 1)
            return true
          } else {
            this.$store.commit('SET_CURRENTNODEINDEXRIGHT', this.currentNodeIndexRight + 1)
            return false
          }
        } else if (this.currentNodeIndexRight === arr.length) {
          // 到达边界值时，归零index，并重新调用next，查找下一个。但是会连续查2次，为什么？
          this.$store.commit('SET_CURRENTNODEINDEXRIGHT', 0)
          this.$store.commit('SET_CURRENTNODEINDEXRIGHT', this.currentNodeIndexRight + 1)
        }
      })
      // 返回找到的节点信息。
      if (res) {
        return { id: res.id, text: res.text }
      }
    },
    // 按拼音查找下一个tree的node节点功能函数。
    findNextNodePinyin(arr, code) {
      // var index = 0
      var res = arr.find((item, i, arr) => {
        // 只有当前的i等于记录下的index时，才执行
        if (i === this.currentNodeIndexRight) {
          // 将被查找的汉字，转化为英文单词开头。
          if (Pinyin.getWordsCode(arr[this.currentNodeIndexRight].text).indexOf(code) !== -1) {
            this.$store.commit('SET_CURRENTNODEINDEXRIGHT', this.currentNodeIndexRight + 1)
            return true
          } else {
            this.$store.commit('SET_CURRENTNODEINDEXRIGHT', this.currentNodeIndexRight + 1)
            return false
          }
        } else if (this.currentNodeIndexRight === arr.length) {
          this.$store.commit('SET_CURRENTNODEINDEXRIGHT', 0)
          this.$store.commit('SET_CURRENTNODEINDEXRIGHT', this.currentNodeIndexRight + 1)
        }
      })
      // 返回找到的节点信息。
      if (res) {
        return { id: res.id, text: res.text }
      }
    },
    // 自定义事件，用了接受treeComponents触发的获取列表信息事件。
    // getTableListRequest(params) {
    //   console.log('这里没有列表接口，列表数据应该是另外的api获取')
    // },
    // 获取树函数
    getTree: sjqx.getTree,
    // 保存授权
    saveGrant: sjqx.saveGrant
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
// .right-tree{
//   // height: 100%;
// }
.tree-menu {
  position: relative;
  .right-locate {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5
  }
  .right-scrollbar{
    padding-top: 50px
  }
}
</style>

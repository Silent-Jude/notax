<!-- 右侧授权树组件。 -->
<template>
  <!-- <el-dialog :visible.sync="grantDialog" :modal="false"> -->
  <div :class="{none:grantDialog===false}" class="shadow">
    <div class="grant">
      <rightLocate class="right-locate" />
      <el-scrollbar class="right-scrollbar" style="height:400px">
        <el-tree ref="rightTree" :data="rightTreeData" :props="rightTreeProps" :default-checked-keys="rightTreeCheckedId" :default-expanded-keys="rightTreeExpandedNode" highlight-current node-key="id" show-checkbox/>
      </el-scrollbar>
      <div class="btns">
        <el-button type="danger" plain @click="cancel">取消</el-button>
        <el-button type="primary" plain @click="confirm">确定</el-button>
      </div>
    </div>
  </div>
  <!-- </el-dialog> -->
</template>

<script>
import Pinyin from '@/utils/chinesePY'
import Bus from '@/utils/Bus'
import { _flatten } from '@/utils/Common'
import { mapState } from 'vuex'
import { getGrantTree, saveGrant } from '@/api/jczl'
import rightLocate from './rightLocate'

export default {
  components: {
    rightLocate // 右侧定位
  },
  props: {
    urlPath: {
      type: String,
      required: false,
      default() {
        return ''
      }
    },
    rightTreeParams: {
      type: String,
      required: false,
      default() {
        return ''
      }
    },
    leftTreeParams: {
      type: String,
      required: false,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      grantDialog: false,
      tableListData: [], // 左侧选中节点对应的表格数据
      exchangeState: 'normal',
      rightTreeProps: {// 右 树节点的label和children
        children: 'children',
        label: 'text'
      },
      rightTreeCheckedId: [], // 右侧树被选中的节点的id
      rightTreeExpandedNode: ['-1'], // 右侧树展开节点
      rightTreeData: [] // 右侧树数据。

    }
  },

  computed: {
    ...mapState({
      selectedSubMenuGuid: state => state.app.selectedSubMenuGuid,
      leftTreeNodeFamilyIdList: state => state.sjqx.leftTreeNodeFamilyIdList,
      currentNodeIndexRight: state => state.sjqx.currentNodeIndexRight
    })

  },

  watch: {},

  created() {
    Bus.$off('openGrantDialog')
    Bus.$on('openGrantDialog', (params) => {
      this.openGrantDialog()
    })
    Bus.$off('openBillDialog')
    Bus.$on('openBillDialog', (params) => {
      this.openGrantDialog()
    })
    // 获取右侧树详情信息
    Bus.$off('getRightTreeInfo')
    Bus.$on('getRightTreeInfo', (params) => {
      this.getRightTreeInfo(params)
    })
    Bus.$off('nextPositionRight')
    Bus.$on('nextPositionRight', (inputVal, searchType) => {
      this.handleExpandedNode(inputVal, searchType)
    })
  },

  methods: {
    confirm() {
      this.grantDialog = false
      this.grantSave()
    },
    cancel() {
      this.grantDialog = false
    },
    openGrantDialog() {
      this.grantDialog = true
    },
    isChecked(id) {
      return this.rightTreeCheckedId.includes(id)
    },
    // 注意，这里data数据返回的checked，并没有卵用。
    // 因为checked判断是由服务器返回的ckIds数组来判断，所以只能根据id是否在ckIds中存在判断勾选。
    // isGrantState(grantState, data, node) {
    //   if (grantState) {
    //     return true
    //   } else {
    //     if (this.isChecked(data.id)) {
    //       return true
    //     } else {
    //       return false
    //     }
    //   }
    // },
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
      // 找到节点后，获取到节点guid，并且手动刷新treeComponent组件以恢复组件树的默认收缩状态，然后根据保存的guid，在vuex中保存展开的节点guid，选中节点的guid
      if (target) {
        var { id } = target
        this.rightTreeExpandedNode = [id]
        this.handleFocusCurrentNode(target.id)
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
    // 自定义事件，用来接受treeComponents触发的获取详细信息事件。
    getRightTreeInfo(params) {
      console.log('马上获取右侧树信息12312312')
      if (this.exchangeState === 'normal') {
        console.log('马上发请求，urlpath是', this.urlPath)
        console.log('参数是：', { [this.rightTreeParams]: params.guid })
        getGrantTree({ [this.rightTreeParams]: params.guid }, 'Permit2Agency').then(res => {
          console.log('正序拿到了右侧树服务器数据', res)
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
            this.rightTreeCheckedId = res.data.ckIds
            // 此处为展开选中节点，但是严重影响渲染速度。若希望更流畅，则建议直接展开-1节点。
            // this.rightTreeExpandedNode = res.data.ckIds
            this.rightTreeExpandedNode = ['-1']
            this.tableListData = res.data.list
          }
          Bus.$emit('sendTableListData', this.tableListData)
          // this.rightTreeExpandedNode = ['-1']
        })
      }
    },
    // filter() {
    //   console.log('过滤了一次')
    //   this.$refs.rightTree.filter(this.grantState)
    // },
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
        const params = {
          // 查询的时候左边树是agency，右边office，现在提交又变成了左边是office，右边是agency，很神奇。
          [this.rightTreeParams]: this.leftTreeNodeFamilyIdList,
          [this.leftTreeParams]: checkedRightTreeNodeList,
          // agencyId: checkedRightTreeNodeList,
          type: 'NORMAL'
        }
        saveGrant(params, 'Permit2Agency').then(res => {
          this.$alert('授权成功！', {
            center: true,
            closeOnClickModal: true,
            closeOnPressEscape: true,
            callback: action => { }
          })
          this.$store.dispatch('SETSAVESTATE', 0)
          this.getRightTreeInfo({ guid: this.selectedSubMenuGuid })
        }).catch(err => { console.log(err) })
      }
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.shadow{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0,0,0,0.5)
}
.none{
  display: none
}
.grant{
  width: 500px;
  height: 500px;
  background: #DFE8F6;
  border: 1px solid rgb(176, 193, 219);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  // z-index: 5
  .btns{
    display: flex;
    justify-content: space-around
  }
}
</style>

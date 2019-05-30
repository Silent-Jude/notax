<!-- 树形结构布局 -->
<!--
使用方法：
    <treeComponent :data="data">
      <template slot="header">
        <h1>我是树形控件头部的组件</h1>
      </template>
      <template slot="right">
        <tab/>
      </template>
    </treeComponent>
 -->
<template>
  <div class="tree-wrap">
    <div class="left-wrap">
      <div class="left-head">
        <slot name="header" />
      </div>
      <div class="tree-menu">
        <el-scrollbar class="mycccccc" style="height:100%">
          <el-tree ref="tree" :disabled="disabled" :data="data" :props="defaultProps" :default-expanded-keys="expandedNode" :expand-on-click-node="false" accordion highlight-current node-key="id" @node-click="handleNodeClick"/>
        </el-scrollbar>
      </div>
    </div>
    <div class="right-wrap">
      <slot name="tabs">这里存放tabs的内容</slot>
    </div>
  </div>
</template>

<script>

import Pinyin from '@/utils/chinesePY'
import Bus from '@/utils/Bus'
import { mapState } from 'vuex'
import { _flatten } from '@/utils/Common'
import tab from '@/components/tab'
export default {
  components: {
    tab
  },
  props: {
    data: {
      type: Array,
      required: true,
      default: function() {
        return [{
          text: '一级 1',
          children: [{
            text: '二级 1-1',
            children: [{
              text: '三级 1-1-1'
            }]
          }]
        }, {
          text: '一级 2',
          children: [{
            text: '二级 2-1',
            children: [{
              text: '三级 2-1-1'
            }]
          }, {
            text: '二级 2-2',
            children: [{
              text: '三级 2-2-1'
            }]
          }]
        }, {
          text: '一级 3',
          children: [{
            text: '二级 3-1',
            children: [{
              text: '三级 3-1-1'
            }]
          }, {
            text: '二级 3-2',
            children: [{
              text: '三级 3-2-1'
            }]
          }]
        }]
      }
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'text'
      }
    }
  },
  computed: {
    ...mapState({
      selectedTabsId: state => state.app.selectedTabsId,
      expandedNode: state => state.app.expandedNode,
      currendNodeIndex: state => state.app.currendNodeIndex,
      selectedSubMenuGuid: state => state.app.selectedSubMenuGuid,
      savestate: state => state.app.savestate
    }),
    disabled() {
      if (this.savestate > 0) {
        return true
      } else {
        return false
      }
    }
  },

  watch: {
  },

  created() {
    Bus.$off('nextPosition')
    Bus.$on('nextPosition', (inputVal, searchType) => {
      this.handleExpandedNode(inputVal, searchType)
    })
    Bus.$off('clearCurrentIndex')
    Bus.$on('clearCurrentIndex', () => {
      this.$store.commit('SET_CURRENTNODEINDEX', 0)
    })
    Bus.$off('handleFocusCurrentNode')
    Bus.$on('handleFocusCurrentNode', (guid) => {
      this.handleFocusCurrentNode(guid)
    })
    Bus.$off('getLeftTreeNodeFamilyIdList')
    Bus.$on('getLeftTreeNodeFamilyIdList', () => {
      this.getLeftTreeNodeFamilyIdList()
    })
  },
  mounted() {
    this.handleFocusCurrentNode(this.selectedSubMenuGuid)
  },
  beforeDestroy() {
  },

  methods: {
    getLeftTreeNodeFamilyIdList() {
      // 左侧树 所选节点 所有父节点 不包含-1
      var leftTreeNodeFamilyIdList = []
      var leftTree = this.$refs.tree.getCurrentNode()
      console.log('getLeftTreeNodeFamilyIdList', leftTree)
      leftTreeNodeFamilyIdList.push(leftTree.id)
      leftTree = this.$refs.tree.getNode(leftTree.parentId)
      while (leftTree.key !== '-1') {
        leftTreeNodeFamilyIdList.push(leftTree.key)
        leftTree = this.$refs.tree.getNode(leftTree.parent.key)
      }
      // this.$emit('getLeftTreeNodeFamilyIdList', leftTreeNodeFamilyIdList)
      this.$store.dispatch('SetLeftTreeNodeFamilyIdList', leftTreeNodeFamilyIdList)
    },
    handleFocusCurrentNode(guid) {
      console.log('进入设置')
      // 模拟选中当前vuex中保存guid的节点
      this.$store.commit('SET_EXPANDEDNODE', [guid])
      this.$refs.tree.setCurrentKey(guid)
      // 定位选择到的节点。

      // 找到当前模拟选中的节点，触发focus事件定位。
      console.log(this.$refs.tree.getCurrentNode())

      this.$nextTick(() => {
        var currentNode = document.getElementsByClassName('is-current')[0]
        console.log(currentNode)
        if (currentNode) {
          currentNode.focus()
          // currentNode.click()
          console.log('设置完毕')
        }
      })
    },
    handleNodeClick(data, node, tree) {
      if (this.savestate === 0) {
        // 不在编辑状态下时，点击才有用，在编辑状态下，不会触发点击事件。
        // 把被点击的guid的值存到vuex中。
        this.$store.commit('SET_SUBMENUGUID', data.id)
        this.$store.dispatch('SetSelectedNodeInfo', data)
        // 针对银行代收网点的特殊处理
        console.log('点击的节点信息为:', data)
        if (data.bankcode && this.$route.path === '/jczl/yxdswd') {
          Bus.$commit('getBankCode', data.bankcode)
          console.log('发送的bankcode为', data.bankcode)
        }
        // if (data.id !== '-1') {}
        if (this.$route.path === '/jczl/pjglz11' && data.id !== '-1') {
          Bus.$emit('getRightTreeInfo', { guid: data.id })
          Bus.$emit('getBillGrantTree', { guid: data.id })
          Bus.$emit('getYearCheck', { guid: data.id })
          Bus.$emit('getPermit2Project', data.id)
        }
        Bus.$emit('getDetailRequest', { guid: data.id })
        Bus.$emit('getTableListRequest', { pid: data.id })
        Bus.$emit('findPolProjectFnoPrj', { guid: data.id })
      } else {
        // node.preventDefault() 无效，因为eleme自己封装了node对象。
        // 采用蒙层方案解决。
      }
    },
    // 展开节点方法（按拼音或者代码）
    handleExpandedNode(inputVal, searchType) {
      // console.log(this.data)
      // 思路，首先将对象扁平化，然后查找。
      var arr = _flatten(this.data, ['id', 'text', 'parentId'])
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
        // 向父组件index发送手动刷新tree组件事件，恢复被展开的树。
        Bus.$emit('handleShowTree', false)
        this.$nextTick(() => {
          Bus.$emit('handleShowTree', true)
          // console.log('我已经刷新完了，你猜猜看有什么结果') // 结果是你把右侧表格组件给刷没了，因为右侧的组件也是包裹在treeComponent中的。导致右侧的组件无法接受到
          // 问题已经解决，通过bus传值，可以触发index中的事件，从而重新获取值。
          this.$store.commit('SET_EXPANDEDNODE', [id])
          // 手动设置选中的节点
          this.$store.commit('SET_SUBMENUGUID', id)
          // this.$refs.tree.setCurrentKey(id)
          // 手动触发节点点击事件。
          this.handleNodeClick(target)
        })
      }
    },
    // 按代码查找下一个tree的node节点功能函数。
    findNextNodeCode(arr, code) {
      // var index = 0
      var res = arr.find((item, i, arr) => {
        // 只有当前的i等于记录下的index时，才执行
        if (i === this.currendNodeIndex) {
          if (arr[this.currendNodeIndex].text.indexOf(code) !== -1) {
            this.$store.commit('SET_CURRENTNODEINDEX', this.currendNodeIndex + 1)
            return true
          } else {
            this.$store.commit('SET_CURRENTNODEINDEX', this.currendNodeIndex + 1)
            return false
          }
        } else if (this.currendNodeIndex === arr.length) {
          // 到达边界值时，归零index，并重新调用next，查找下一个。但是会连续查2次，为什么？
          this.$store.commit('SET_CURRENTNODEINDEX', 0)
          this.$store.commit('SET_CURRENTNODEINDEX', this.currendNodeIndex + 1)
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
        if (i === this.currendNodeIndex) {
          // 将被查找的汉字，转化为英文单词开头。
          if (Pinyin.getWordsCode(arr[this.currendNodeIndex].text).indexOf(code) !== -1) {
            this.$store.commit('SET_CURRENTNODEINDEX', this.currendNodeIndex + 1)
            return true
          } else {
            this.$store.commit('SET_CURRENTNODEINDEX', this.currendNodeIndex + 1)
            return false
          }
        } else if (this.currendNodeIndex === arr.length) {
          this.$store.commit('SET_CURRENTNODEINDEX', 0)
          this.$store.commit('SET_CURRENTNODEINDEX', this.currendNodeIndex + 1)
        }
      })
      // 返回找到的节点信息。

      if (res) {
        return { id: res.id, text: res.text }
      }
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss'>
.tree-wrap {
  background: #dfe8f6;
  height: 100%;
  display: flex;
  position: relative;
  .el-tree-node__label {
    font-size: 12px;
  }

  .left-wrap {
    flex: none;
    width: 360px;
    height: 100%;
    border: 1px solid #b0c8ec;
    // .left-head {
    // }
    .tree-menu {
      // height: 100%;
      .el-scrollbar {
        background: #fff;
        border-radius: 3px;
      }
    }
  }
}
</style>

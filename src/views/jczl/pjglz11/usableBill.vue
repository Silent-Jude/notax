<!-- 可用票据页面组件 -->
<template>
  <div>
    <div>
      <el-button type="primary" plain @click="openBillDialog">可用票据授权</el-button>
      <el-button type="primary" plain @click="openProjectDialog">可用票据对应项目授权</el-button>
    </div>
    <el-scrollbar class="right-scrollbar" style="height:200px">
      <el-table ref="billListTable" :data="billListData" max-height="360" border style="width: 100%" highlight-current-row @current-change="currentRowChange" @row-click="showRow">
        <el-table-column type="index" width="50" />
        <el-table-column prop="billcode" label="票据编码" sortable show-overflow-tooltip center width="120" />
        <el-table-column prop="billname" label="票据名称" sortable show-overflow-tooltip center width="220" />
        <el-table-column prop="pinyincode" label="拼音简码" sortable show-overflow-tooltip center width="100" />
        <el-table-column prop="pricingmet" label="计价方式" sortable show-overflow-tooltip center width="100" />
        <el-table-column prop="portions" label="每本份数" sortable show-overflow-tooltip center width="100" />
        <el-table-column prop="warnlimitupper" label="库存上限" sortable show-overflow-tooltip center width="100" />
      </el-table>
    </el-scrollbar>
    <el-scrollbar class="right-scrollbar" style="height:200px">
      <el-table :data="projectListData" max-height="360" border style="width: 100%" highlight-current-row>
        <el-table-column type="index" width="50" />
        <el-table-column prop="nontaxcode" label="收费项目编码" sortable show-overflow-tooltip center width="150" />
        <el-table-column prop="nontaxname" label="收费项目名称" sortable show-overflow-tooltip center width="300" />
        <el-table-column prop="chargelimit" label="收费上限" sortable show-overflow-tooltip center width="100" />
        <el-table-column prop="chargelower" label="收费下限" sortable show-overflow-tooltip center width="100" />
      </el-table>
    </el-scrollbar>
    <billGrantTree ref="billGrant" :right-tree-params="billGrantRightTreeParams" :left-tree-params="billGrantLeftTreeParams" url-path="Permit2Bill"/>
    <projectGrantTree ref="projectGrant" :right-tree-params="projectGrantLeftTreeParams" :left-tree-params="projectGrantRightTreeParams" url-path="Bill2ChgPro"/>
  </div>
</template>

<script>
import rightAuthTree from '@/components/rightAuthTree'
import billGrantTree from '@/components/rightAuthTree/billGrantTree'
import projectGrantTree from '@/components/rightAuthTree/projectGrantTree'

import Bus from '@/utils/Bus'

export default {
  components: {
    projectGrantTree,
    rightAuthTree,
    billGrantTree
  },
  data() {
    return {
      projectListData: [],
      billListData: [],
      billGrantLeftTreeParams: 'billId',
      billGrantRightTreeParams: 'permitId',

      projectGrantLeftTreeParams: 'billId',
      projectGrantRightTreeParams: 'chgproId',
      specialData: {
      },
      listInfo: [],
      grantDialog: false
    }
  },

  computed: {},

  watch: {
    billListData: {
      handler(newArray, oldArray) {
        console.log('看看长度', newArray.length)
        if (newArray.length > 0) {
          this.$refs.billListTable.setCurrentRow(newArray[0])
        }
      },
      immediate: true,
      deep: true
    }
  },

  created() {
    Bus.$off('sendBillListData')
    Bus.$on('sendBillListData', (params) => {
      this.billListData = params
    })
    Bus.$off('sendProjectListData')
    Bus.$on('sendProjectListData', (params) => {
      console.log('下面子表的数据是：', params)
      this.projectListData = params
    })
  },

  methods: {
    showRow(row) {
      console.log(row)
    },
    // getLeftTreeNodeFamilyIdList() {
    //   // 左侧树 所选节点 所有父节点 不包含-1
    //   var leftTreeNodeFamilyIdList = []
    //   var leftTree = this.$refs.tree.getCurrentNode()
    //   console.log('getLeftTreeNodeFamilyIdList', leftTree)
    //   leftTreeNodeFamilyIdList.push(leftTree.id)
    //   leftTree = this.$refs.tree.getNode(leftTree.parentId)
    //   while (leftTree.key !== '-1') {
    //     leftTreeNodeFamilyIdList.push(leftTree.key)
    //     leftTree = this.$refs.tree.getNode(leftTree.parent.key)
    //   }
    //   // this.$emit('getLeftTreeNodeFamilyIdList', leftTreeNodeFamilyIdList)
    //   this.$store.dispatch('SetLeftTreeNodeFamilyIdList', leftTreeNodeFamilyIdList)
    // },

    currentRowChange(currentRow, oldRow) {
      console.log('当前行改变了', currentRow, oldRow)
      if (currentRow) {
        this.$store.dispatch('Set_SelectedBillRowGuid', currentRow.guid)
        Bus.$emit('getProjectGrantTree', { guid: currentRow.guid })
      }
    },

    openProjectDialog() {
      this.$refs.projectGrant.grantDialog = true
    },
    openBillDialog() {
      // Bus.$emit('openBillDialog')
      this.$refs.billGrant.grantDialog = true
    }

  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
</style>

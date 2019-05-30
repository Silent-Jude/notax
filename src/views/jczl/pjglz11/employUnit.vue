<!-- 使用单位tab页面组件。 -->
<template>
  <div>
    <div>
      <el-button type="primary" plain @click="openGrantDialog">领用证对应使用单位授权</el-button>
    </div>
    <el-scrollbar class="right-scrollbar" style="height:400px">
      <el-table :data="tableListData" max-height="360" border style="width: 100%" highlight-current-row>
        <el-table-column type="index" width="50" />
        <el-table-column prop="agencycode" label="单位编码" sortable center width="350" />
        <el-table-column prop="agencyname" label="单位名称" sortable center width="350" />
      </el-table>
    </el-scrollbar>
    <rightAuthTree ref="agencyGrant" :right-tree-params="rightTreeParams" :left-tree-params="leftTreeParams"/>
  </div>
</template>

<script>
import rightAuthTree from '@/components/rightAuthTree'
import Bus from '@/utils/Bus'

export default {
  components: {
    rightAuthTree
  },
  data() {
    return {
      // urlPath: 'Permit2Agency',
      tableListData: [],
      leftTreeParams: 'agencyId',
      rightTreeParams: 'permitId',
      specialData: {
      },
      listInfo: [],
      grantDialog: false
    }
  },

  computed: {},

  watch: {},

  created() {
    Bus.$off('sendTableListData')
    Bus.$on('sendTableListData', (params) => {
      this.tableListData = params
    })
  },

  methods: {
    openGrantDialog() {
      // Bus.$emit('openGrantDialog')
      this.$refs.agencyGrant.grantDialog = true
    }

  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
</style>

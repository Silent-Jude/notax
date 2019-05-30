<!-- 使用单位tab页面组件。 -->
<template>
  <div>
    <div>
      <el-button type="primary" plain>领用证对应使用单位授权</el-button>
    </div>
    <el-table
      :data="listInfo"
      border
      style="width: 100%"
      highlight-current-row
    >
      <el-table-column
        type="index"
        width="50"/>
      <el-table-column
        prop="agencycode"
        label="单位编码"
        sortable
        center
        width="350"/>
      <el-table-column
        prop="agencyname"
        label="单位名称"
        sortable
        center
        width="350"/>
    </el-table>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
    }
  },

  computed: {},

  watch: {},

  created() {},

  methods: {}
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
</style>

<template>
  <div>
    <div class="tabletop" >
      <el-scrollbar style="height:100%;width:100%;">
        <el-table
          :data="listInfo"
          border
          style="width: 100%">
          <template v-for="item in tabletitle">
            <el-table-column
              :prop="item"
              :label="item"
              :key="item"
            />
          </template>
        </el-table>
      </el-scrollbar>
    </div>
    <div class="tablebottom">
      <!-- <el-pagination
        :total="1000"
        background
        layout="prev, pager, next"/> -->
      <!-- <el-pagination
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="100"
        :total="400"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div> -->
    </div>
</div></template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      listInfo: state => state.app.listInfo
      // listInfo: 'listInfo'
    }),
    tabletitle() {
      var title = []
      // console.log(this.$store.state.app.listInfo)
      // console.log(this.listInfo)
      var o = this.listInfo[0] || {}
      for (const i in o) {
        title.push(i)
      }
      // title.unshift('')
      // console.log(title)
      return title
    }
  }
}
</script>

<style lang="scss">
.el-table{
overflow:initial;
}
.el-table__header-wrapper{
  overflow:initial;
}
.el-table__body-wrapper{
  overflow: initial!important;
}
.el-scrollbar__wrap {
  overflow-x: scroll!important;
}
// .el-scrollbar__view{
//   // width: 1000px;
// }
.el-tab-pane{
  height: 100%;
}
.el-tab-pane>div{
  height: 100%;

}
.el-tab-pane .tabletop{
  // height: calc(100% - 80px);
  height: 100%;
}
// .el-tab-pane .tablebottom{
//   margin: 10px auto 0;
//   text-align: center;
//   .el-pagination{
//     display: inline-block;
//   }
// }
// .el-table--border{
//   // height:  calc(100% - 80px);
// }
.el-table th>.cell{
    font-weight: 700;
    font-size: 14px;
}
.el-table td, .el-table th{
  padding: 4px 0;
}
</style>


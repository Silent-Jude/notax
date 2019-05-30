<!--票据购领证的列表信息  -->
<template>
  <div class="pjglz">
    <div class="tabletop" >
      <el-scrollbar style="height:100%;width:100%;">
        <el-table
          :data="listInfo"
          :default-sort = "{prop: 'date', order: 'descending'}"
          border
          height="430"
          style="width: 100%"
          highlight-current-row
        >
          <el-table-column
            type="index"
            width="50"/>
          <el-table-column
            prop="chargetypecode"
            label="收费类别编码"
            sortable
            width="180"/>
          <el-table-column
            prop="chargetypename"
            label="收费类别名称"
            sortable
            width="180"/>
          <el-table-column
            prop="remark"
            label="备注"/>
        </el-table>
      </el-scrollbar>
    </div>
    <div class="tablebottom"/>
  </div>
</template>

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
    })
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss">
.pjglz{

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
}
</style>


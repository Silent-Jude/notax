<!--列表信息的基础模板-->
<template>
  <div>
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
            v-for="value in tbHead"
            :key="value.label"
            :label="value.label"
            :prop="value.prop"
            :width="value.width||180"
            sortable >
            <template slot-scope="scope" >
              <span v-if="value.prop === 'flevel'|| value.prop === 'ftype'">
                {{ $getCodeLabel(scope.row[value.prop]) }}
              </span>
              <span v-else>{{ scope.row[value.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
    <div class="tablebottom"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    // 表头数据
    tbHead: {
      type: Array,
      require: true,
      default() {
        return []
      }
    }
  },
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
    console.log(this.tbHead)
  },
  updated() {
    console.log('<<<<', this.listInfo)
  },
  methods: {
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


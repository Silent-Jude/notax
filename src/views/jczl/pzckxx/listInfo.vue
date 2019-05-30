<!--票证仓库信息的列表信息  -->
<template>
  <div class="pzckxx">
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
            prop="storagecode"
            label="仓库编码"
            sortable
            width="150"/>
          <el-table-column
            prop="storagename"
            label="仓库名称"
            sortable
            width="250"/>
          <el-table-column
            prop="pinyinshortcode"
            label="拼音简码"
            sortable
            width="150"/>
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
.pzckxx{

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
.el-tab-pane{
  height: 100%;
}
.el-tab-pane>div{
  height: 100%;

}
.el-tab-pane .tabletop{
  height: 100%;
}
.el-table th>.cell{
    font-weight: 700;
    font-size: 14px;
}
.el-table td, .el-table th{
  padding: 4px 0;
}
}
</style>


<!--银行前置机的列表信息  -->
<template>
  <div class="yxqzj">
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
            prop="basRemittedbank.bankcode"
            label="银行编码"
            sortable
            width="150"/>
          <el-table-column
            prop="bankname"
            label="银行名称"
            sortable
            width="250"/>
          <el-table-column
            prop="bank1001"
            label="设置1001交易"
            sortable
            width="150"/>
          <el-table-column
            prop="bank6001"
            label="设置6001交易"
            sortable
            width="150"/>
          <el-table-column
            prop="version"
            label="前置机协议版本号"
            sortable
            width="150"/>
          <el-table-column
            prop="backfileextmark"
            label="是否采用压缩格式上传标志"
            sortable
            width="150"/>
          <el-table-column
            prop="auditedmark"
            label="审核标志"
            align="center"
            sortable
            width="150"/>
          <el-table-column
            prop="accconfirmmark"
            label="对账待查确认标志"
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
.yxqzj{

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


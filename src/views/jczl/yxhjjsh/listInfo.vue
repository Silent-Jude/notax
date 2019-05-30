<!--银行汇缴结算户的列表信息  -->
<template>
  <div class="yxhjjsh">
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
            prop="bankcode"
            label="银行编码"
            sortable
            width="200"/>
          <el-table-column
            prop="bankname"
            label="银行名称"
            sortable
            width="200"/>
          <el-table-column
            prop="chgagencybankaccount"
            label="执收单位账号"
            sortable
            width="200"/>
          <el-table-column
            prop="chgagencyacctname"
            label="执收单位开户名称"
            sortable
            width="200"/>
          <el-table-column
            prop="chgagencybankcode"
            label="执收单位开户行代码"
            sortable
            width="200"/>
          <el-table-column
            prop="chgagencybankname"
            label="执收单位开户行名称"
            sortable
            width="200"/>
          <el-table-column
            prop="attn"
            label="经办人"
            sortable
            width="200"/>
          <el-table-column
            prop="pwd"
            label="密码"
            sortable
            width="200"/>
          <el-table-column
            prop="attntel"
            label="经办人联系电话"
            sortable
            width="200"/>
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
    console.log('收到的list信息为', this.listInfo)
  },
  methods: {
  }
}
</script>

<style lang="scss">
.yxhjjsh{

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


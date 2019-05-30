<!--票证种类信息的列表信息  -->
<template>
  <div class="pzzlxx">
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
            prop="billcode"
            label="票据编号"
            sortable
            width="150"/>
          <el-table-column
            prop="billname"
            label="票据名称"
            sortable
            width="250"/>
          <el-table-column
            prop="pinyincode"
            label="拼音编码"
            sortable
            width="150"/>
          <el-table-column
            prop="specification"
            label="票据规格"
            sortable
            width="150"/>
          <el-table-column
            prop="partsnum"
            label="票据联数"
            sortable
            width="150"/>
          <el-table-column
            prop="pricingmet"
            label="计价方式"
            sortable
            width="150"/>
          <el-table-column
            prop="portions"
            label="每本份数"
            sortable
            width="150"/>
          <el-table-column
            prop="costprice"
            label="成本单价"
            sortable
            width="150"/>
          <el-table-column
            prop="insiderprice"
            label="内部价格"
            sortable
            width="150"/>
          <el-table-column
            prop="agencyprice"
            label="单价"
            sortable
            width="150"/>
          <el-table-column
            prop="agentchargemark"
            label="银行代收标志"
            sortable
            width="150"/>
          <el-table-column
            prop="checkmark"
            label="校验标志"
            sortable
            width="150"/>
          <el-table-column
            prop="itemsnum"
            label="条目数"
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
    console.log('收到的list信息为', this.listInfo)
  },
  methods: {
  }
}
</script>

<style lang="scss">
.pzzlxx{

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


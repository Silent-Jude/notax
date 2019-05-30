<!--非税收入项目的列表信息  -->
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
            prop="nontaxcode"
            label="收费项目编号"
            sortable
            width="100"/>
          <el-table-column
            prop="nontaxname"
            label="收费项目名称"
            sortable
            width="100"/>
          <el-table-column
            prop="isleaf"
            label="是否末级"
            sortable
            width="100"/>
          <el-table-column
            prop="isenabled"
            label="是否启用"
            sortable
            width="100"/>
          <el-table-column
            prop="chargetypeguid"
            label="收费类别编码"
            sortable
            width="100"/>
          <el-table-column
            prop="basChargetype.chargetypename"
            label="收费类别名称"
            sortable
            width="100"/>
          <el-table-column
            prop="fundtypeguid"
            label="资金性质编码"
            sortable
            width="100"/>
          <el-table-column
            prop="basFundtype.fundtypename"
            label="资金性质名称"
            sortable
            width="100"/>
          <el-table-column
            prop="chargelimit"
            label="收费上限"
            sortable
            width="100"/>
          <el-table-column
            prop="chargelower"
            label="收费下限"
            sortable
            width="100"/>
          <el-table-column
            prop="salestax"
            label="营业税率"
            sortable
            width="100"/>
          <el-table-column
            prop="ispublicprogram"
            label="是否公用项目"
            sortable
            width="100"/>
          <el-table-column
            prop="allowquerymark"
            label="费证查询标志"
            sortable
            width="100"/>
          <el-table-column
            prop="internalcontactmark"
            label="内部往来标志"
            sortable
            width="100"/>
          <el-table-column
            prop="chargeunit"
            label="收费计量单位"
            sortable
            width="100"/>
          <el-table-column
            prop="buzhidao"
            label="会计科目编码"
            sortable
            width="100"/>
          <el-table-column
            prop="buzhidao"
            label="会计科目名称"
            sortable
            width="100"/>
          <el-table-column
            prop="buzhidao"
            label="收费文号"
            sortable
            width="150"/>
          <el-table-column
            prop="nontaxfallname"
            label="收费项目全称"
            sortable
            width="100"/>
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

<style lang="scss" scoped>
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
</style>


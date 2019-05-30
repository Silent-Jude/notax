<!--执收（罚）单位的列表信息  -->
<template>
  <div class="zsfdw">
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
            prop="agencycode"
            label="单位代码"
            sortable
            show-overflow-tooltip
            width="100"/>
          <el-table-column
            prop="agencyname"
            label="单位名称"
            sortable
            show-overflow-tooltip
            width="100"/>
          <el-table-column
            prop="pinyincode"
            label="拼音简码"
            sortable
            show-overflow-tooltip
            width="100"/>
          <el-table-column
            prop="agencykind"
            label="单位性质"
            sortable
            show-overflow-tooltip
            width="100"/>
          <el-table-column
            prop="agencyrank"
            label="单位等级"
            sortable
            show-overflow-tooltip
            width="100"/>
          <el-table-column
            prop="orgcode"
            label="组织机构代码"
            sortable
            show-overflow-tooltip
            width="100"/>
          <el-table-column
            prop="treasurer"
            label="负责人"
            sortable
            show-overflow-tooltip
            width="100"/>
          <el-table-column
            prop="treasurertel"
            label="负责人电话"
            sortable
            show-overflow-tooltip
            width="100"/>
          <el-table-column
            prop="attn"
            label="经办人"
            sortable
            show-overflow-tooltip
            width="100"/>
          <el-table-column
            prop="attntel"
            label="经办人电话"
            sortable
            show-overflow-tooltip
            width="100"/>
          <el-table-column
            prop="budgetkind"
            label="预算拨款性质"
            sortable
            show-overflow-tooltip
            width="100"/>
          <el-table-column
            prop="agencytypecode"
            label="单位类型代码"
            sortable
            show-overflow-tooltip
            width="100"/>
          <el-table-column
            prop="address"
            label="联系地址"
            sortable
            show-overflow-tooltip
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

<style lang="scss">
.zsfdw{

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


<!--票证印制厂的列表信息  -->
<template>
  <div class="pzyzc">
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
            prop="printingid"
            label="印刷厂编码"
            sortable
            width="200"/>
          <el-table-column
            prop="printingname"
            label="印刷厂名称"
            sortable
            width="200"/>
          <el-table-column
            prop="address"
            label="印刷厂地址"
            sortable
            width="200"/>
          <el-table-column
            prop="pinyinshotcode"
            label="拼音编码"
            sortable
            width="200"/>
          <el-table-column
            prop="agencycode"
            label="机构代码"
            sortable
            width="200"/>
          <el-table-column
            prop="zipcode"
            label="邮政编码"
            sortable
            width="200"/>
          <el-table-column
            prop="buslicensecode"
            label="置业执照编码"
            sortable
            width="200"/>
          <el-table-column
            prop="irscode"
            label="国税编码"
            sortable
            width="200"/>
          <el-table-column
            prop="localtaxcode"
            label="地税编码"
            sortable
            width="200"/>
          <el-table-column
            prop="specialpermitno"
            label="特种许可证号"
            sortable
            width="200"/>
          <el-table-column
            prop="printpermitno"
            label="印刷许可证号"
            sortable
            width="200"/>
          <el-table-column
            prop="legalperson"
            label="法人代表"
            sortable
            width="200"/>
          <el-table-column
            prop="legalpersontel"
            label="法人电话"
            sortable
            width="200"/>
          <el-table-column
            prop="treasurer"
            label="财政负责人"
            sortable
            width="200"/>
          <el-table-column
            prop="busleader"
            label="业务负责人"
            sortable
            width="200"/>
          <el-table-column
            prop="busleadertel"
            label="业务电话"
            sortable
            width="200"/>
          <el-table-column
            prop="bankname"
            label="开户银行"
            sortable
            width="200"/>
          <el-table-column
            prop="bankacctno"
            label="银行账号"
            sortable
            width="200"/>
          <el-table-column
            prop="acctname"
            label="开户名称"
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
.pzyzc{

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


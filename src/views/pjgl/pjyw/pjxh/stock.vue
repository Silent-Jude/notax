<!-- 票据销毁-add增加-选择库存票据页面 -->
<template>
  <div>
    <el-dialog :visible.sync="stockDialogVisible" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false" title="请选择库存票据" width="90%" @close="returnDefault">

      <el-form ref="form" :model="form" size="mini" label-width="80px">
        <el-row>
          <el-col :span="2">
            <el-form-item label="" label-width="20px">
              <el-checkbox-group v-model="form.isfilter" @change="isfilterChange">
                <el-checkbox label="筛选" name="type"/>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="" label-width="0px">
              <el-select :disabled="!form.isfilter" v-model="form.filterName" placeholder="票据编号">
                <el-option label="票据编号" value="billcode"/>
                <el-option label="单位代码" value="agencycode"/>
                <el-option label="单位名称" value="agencyname"/>
                <el-option label="领用证编号" value="auditmark"/>
                <el-option label="领用证名称" value="reviewer"/>
                <el-option label="票据名称" value="billname"/>
                <el-option label="字轨 " value="track"/>
                <el-option label="起始号码 " value="startnumber"/>
                <el-option label="终止号码 " value="endnumber"/>
                <el-option label="份数 " value="num"/>
                <el-option label="本数 " value="counts"/>
                <el-option label="单价 " value="price"/>
                <el-option label="计价方式 " value="pricingmet"/>
                <el-option label="每本份数 " value="portions"/>
                <el-option label="仓库编码 " value="storagecode"/>
                <el-option label="仓库名称 " value="storagename"/>
                <el-option label="业务来源类型 " value="verificationtype"/>
                <el-option label="票号 " value="无"/>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="等于" label-width="50px">
              <el-input :disabled="!form.isfilter" v-model="form.filterValue" clearable/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="领用证">
              <el-input
                v-model="basChargeagency"
                clearable
                placeholder="请选择领用证" >
                <el-button slot="append" icon="el-icon-caret-bottom" @click="showbasChargeagency()"/>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="入库仓库">
              <el-input
                v-model="storagename"
                clearable
                placeholder="请选择入库仓库" >
                <el-button slot="append" icon="el-icon-caret-bottom" @click="showStorage()"/>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" size="mini" @click="submitForm">查询</el-button>
          </el-col>
        </el-row>

        <!-- <el-row>
          <el-pagination
            :current-page="form.pageIndex"
            :page-sizes="[10, 15, 20, 25, 30]"
            :page-size="form.pageSize"
            :total="form.totalCount"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </el-row> -->
      </el-form>

      <div class="wrap-box wrap">
        <el-scrollbar style="height:100%;width:100%;">
          <el-table
            ref="singleTable"
            :data="tableData"
            highlight-current-row
            border
            style="width: 100%"
            @row-dblclick = "dbRow"
            @current-change="handleCurrentChangedetails"
            @row-click="showListDetail">
            <el-table-column
              type="index"/>
            <el-table-column
              prop="billcode"
              show-overflow-tooltip
              sortable
              width="110"
              align="center"
              label="票据编号"/>
            <el-table-column
              prop="agencycode"
              show-overflow-tooltip
              sortable
              width="110"
              align="center"
              label="单位代码"/>
            <el-table-column
              prop="agencyname"
              show-overflow-tooltip
              sortable
              width="210"
              align="center"
              label="单位名称"/>
            <el-table-column
              prop="auditmark"
              show-overflow-tooltip
              sortable
              width="110"
              align="center"
              label="领用证编号">
            <!-- <template slot-scope="scope">
                {{ scope.row.auditmark | markFilter }}
              </template> -->
            </el-table-column>
            <el-table-column
              prop="reviewer"
              show-overflow-tooltip
              sortable
              width="210"
              align="center"
              label="领用证名称"/>
            <el-table-column
              prop="billname"
              show-overflow-tooltip
              sortable
              width="210"
              align="center"
              label="票据名称"/>
            <el-table-column
              prop="track"
              show-overflow-tooltip
              sortable
              width="90"
              align="center"
              label="字轨"/>
            <el-table-column
              prop="startnumber"
              show-overflow-tooltip
              sortable
              width="150"
              align="center"
              label="起始号码"/>
            <el-table-column
              prop="endnumber"
              show-overflow-tooltip
              sortable
              width="150"
              align="center"
              label="终止号码"/>
            <el-table-column
              prop="inventory"
              show-overflow-tooltip
              sortable
              width="90"
              align="center"
              label="份数"/>
            <el-table-column
              prop="counts"
              show-overflow-tooltip
              sortable
              width="90"
              align="center"
              label="本数"/>
            <el-table-column
              prop="price"
              show-overflow-tooltip
              sortable
              width="90"
              align="center"
              label="单价"/>
            <el-table-column
              prop="pricingmet"
              show-overflow-tooltip
              sortable
              width="120"
              align="center"
              label="计价方式"/>
            <el-table-column
              prop="portions"
              show-overflow-tooltip
              sortable
              width="90"
              align="center"
              label="每本份数"/>
            <el-table-column
              prop="storagecode"
              show-overflow-tooltip
              sortable
              width="110"
              align="center"
              label="仓库编码"/>
            <el-table-column
              prop="storagename"
              show-overflow-tooltip
              sortable
              width="200"
              align="center"
              label="仓库名称"/>
            <el-table-column
              prop="verificationtype"
              show-overflow-tooltip
              sortable
              width="150"
              align="center"
              label="业务来源类型"/>
          </el-table>
        </el-scrollbar>
      </div>

      <el-row>
        <el-pagination
          :current-page="form.pageIndex"
          :page-sizes="[10, 15, 20, 25, 30]"
          :page-size="form.pageSize"
          :total="form.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </el-row>
      <el-row type="flex" justify="space-around">
        <!-- <el-col :span="3"> -->
        <el-button type="danger" @click="cancel">取消</el-button>

        <el-button type="primary" @click="confirm">确定</el-button>
        <!-- </el-col> -->
        <!-- <el-col :span="3"> -->
        <!-- </el-col> -->
      </el-row>
      <layer ref="basChargeagency" :tb-head="basChargeagencyHead" :form="basChargeagencyForm" :table-data="basChargeagencyList" title="请选择执收单位领用证" @select="getbasChargeagencySelect"/>
      <layer ref="basBillstorage" :tb-head="basBillstorageHead" :form="basBillstorageForm" :table-data="basBillstorageList" title="请选择入库仓库" @select="basBillstorageSelect"/>

    </el-dialog>
  </div>
</template>

<script>
import Bus from '@/utils/Bus'
import layer from '@/components/layer'

import pjyw from '@/api/pjgl/pjyw/pjyw.js'

export default {
  components: {
    layer

  },
  props: {
    stockDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 票据仓库选择好之后显示的名称
      storagename: '',
      // 票据仓库
      basBillstorageList: [],
      // 票据仓库表单和下拉选数据
      basBillstorageForm: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '仓库编码',
            key: 'storagecode'
          },
          {
            val: '仓库名称',
            key: 'storagename'
          },
          {
            val: '拼音简码',
            key: 'pinyinshortcode'
          },
          {
            val: '是否总库',
            key: 'mainstoragemark'
          },
          {
            val: '是否启用',
            key: 'isenabled'
          }
        ],
        equal: ''
      },
      // 票据仓库信息表头
      basBillstorageHead: [
        {
          prop: 'storagecode',
          label: '仓库编码'
        },
        {
          prop: 'storagename',
          label: '仓库名称'
        },
        {
          prop: 'pinyinshortcode',
          label: '拼音简码'
        },
        {
          prop: 'mainstoragemark',
          label: '是否总库'
        },
        {
          prop: 'isenabled',
          label: '是否启用'
        }
      ],
      // 执收单位选择好之后显示的名称。
      basChargeagency: '',
      // 执收单位列表中的表格数据
      basChargeagencyList: [],
      // 执收单位表单和下拉选数据。
      basChargeagencyForm: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '执收单位编码',
            key: 'agencycode'
          },
          {
            val: '执收单位名称',
            key: 'agencyname'
          },
          {
            val: '拼音简码',
            key: 'pinyincode'
          },
          {
            val: '领用证编码',
            key: 'permitno'
          },
          {
            val: '领用证名称',
            key: 'billpermitname'
          },
          {
            val: '经办人',
            key: 'attn'
          },
          {
            val: '办理日期',
            key: 'transactdate'
          }
        ],
        equal: ''
      },
      // 执收单位对话框表头
      basChargeagencyHead: [
        {
          prop: 'agencycode',
          label: '执收单位编码'
        },
        {
          prop: 'agencyname',
          label: '执收单位名称'
        },
        {
          prop: 'pinyincode',
          label: '拼音简码'
        },
        {
          prop: 'permitno',
          label: '领用证编码'
        },
        {
          prop: 'billpermitname',
          label: '领用证名称'
        },
        {
          prop: 'attn',
          label: '经办人'
        },
        {
          prop: 'transactdate',
          label: '办理日期'
        }
      ],
      // 当前表单数据
      form: {
        // 总条数数
        totalCount: 0,
        // 页码
        pageIndex: 1,
        // 页条数
        pageSize: 10,
        // 执收单位id---agencyId
        agencyId: '',
        // 领用证ID
        permitId: '',
        // 仓库id
        storeId: '',
        // 条件名称
        filterName: '',
        // 条件值
        filterValue: '',
        // 是否筛选
        isfilter: false

      },
      // 当前表格数据
      tableData: [],
      // 当前表格选择项
      currentRow: {}
    }
  },

  computed: {},

  watch: {
    // 执收单位关联的agencyid basChargeagency为空agencyid也清空
    basChargeagency(newValue) {
      if (!newValue) {
        console.log('清空了1：')
        this.form.agencyId = ''
        this.form.permitId = ''
      }
    },
    storagename(newValue) {
      if (!newValue) {
        console.log('清空了2：')
        this.form.storeId = ''
      }
    }
  },

  created() {
    // 获取执收单位列表
    this.getBasChargeagency().then(res => {
      this.basChargeagencyList = res.data
    })
    // 获取票据仓库数据
    this.getBasBillstorage().then(res => {
      this.basBillstorageList = res.data
    })
    // 获取表格数据
    this.getQueryBillStoreVerificationPaging(this.form)
  },

  methods: {
    // 票据仓库
    getBasBillstorage: pjyw.getBasBillstorage,
    // 获取执收单位对话框数据
    getBasChargeagency: pjyw.getBasChargeagency,
    // 获取票据销毁分页查询数据。
    getQueryBillStoreVerificationPaging: pjyw.getQueryBillStoreVerificationPaging,

    // 提交表单信息，获取查询数据list
    submitForm() {
      this.getQueryBillStoreVerificationPaging(this.form)
    },
    // 表格双击事件。
    dbRow(row, event) {
      console.log('当前选择行的数据为row：', row)
    },
    // 筛选框改变
    isfilterChange(val) {
      if (val) {
        // 设置默认选中项
        this.form.filterName = 'billcode'
        this.form.filterValue = ''
      } else {
        this.form.filterName = ''
        this.form.filterValue = ''
      }
    },
    // form表单初始化
    returnDefault(done) {
      this.basChargeagency = ''
      this.storagename = ''
      this.form.filterName = ''
      this.form.filterValue = ''
      this.form.isfilter = false
      this.form.pageIndex = 1
      this.form.pageSize = 10
      // this.resetForm()
      // done()
    },
    resetForm() {

    },
    // 确认选择
    confirm() {
      console.log('选择好的当前行数据为：', this.currentRow)
      if (!this.currentRow) {
        this.$message.error('请您先选择')
        return
      }
      var data = JSON.parse(JSON.stringify(this.currentRow))
      this.$emit('select', data)
      Bus.$emit('cancelStock', false)

      // this.dialogTableVisible = false
      // console.dir('选择好的数据为：', this.form)
    },
    // 取消选择
    cancel() {
      this.returnDefault()
      // this.stockDialogVisible = false
      Bus.$emit('cancelStock', false)
    },
    // 表格行选择设置
    handleCurrentChangedetails(val) {
      // var i = this.tableData.findIndex(item => {
      //   return item === val
      // })
      // i = i >= 0 ? i : 0
      // this.$store.dispatch('SetCurrentRowIndex', i)
      this.currentRow = val === null ? {} : val
    },
    // 显示当前行数据
    showListDetail(row) {
      console.log('当前点击行的数据为', row)
    },
    // 当前表格 页条数改变
    handleSizeChange(val) {
      this.form.pageSize = val
      this.getQueryBillStoreVerificationPaging(this.form)
      // this.getList(this.form)
    },
    // 当前表格 页码改变 翻页
    handleCurrentChange(val) {
      this.form.pageIndex = val
      this.getQueryBillStoreVerificationPaging(this.form)
    },
    // 显示执收单位对话选择框
    showbasChargeagency() {
      this.$refs.basChargeagency.dialogTableVisible = true
    },
    // 获取执收单位对话框选择到的行信息。
    getbasChargeagencySelect(datas) {
      this.basChargeagency = datas.currentRow.agencyname
      // this.agency2billInfoCurrent = datas.currentRow
      this.form.agencyId = datas.currentRow.agencyid
      // 要问字段。
      this.form.permitId = datas.currentRow.perimitguid
      console.log('选择的信息是', datas)
      // console.log(this.form.agencyId)
    },
    // 显示票据仓库对话选择框
    showStorage() {
      this.$refs.basBillstorage.dialogTableVisible = true
    },
    basBillstorageSelect(datas) {
      console.log('选择的信息是', datas)

      this.storagename = datas.currentRow.storagename
      this.form.storeId = datas.currentRow.guid
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>

  .wrap-box{
    flex: 1;
    padding: 5px;
    height: 350px;
}

</style>

<template>
  <div class="title">
    <toolBar :client-butns-array="clientButnsArray" />
    <h1>项目库查询</h1>
    <div>
      <el-form ref="form" :model="form" size="mini" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="类别名称">
              <el-input
                v-model="chargetypename"
                clearable>
                <el-button slot="append" icon="el-icon-caret-bottom" @click="show1()"/>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="2">
            <el-form-item label-width="20px" label="">
              <el-checkbox v-model="form.xxx" label="筛选" name="type"/>
            </el-form-item>
          </el-col> -->
          <el-col :span="4">
            <el-form-item label-width="50px" label="筛选">
              <el-select v-model="form.key" placeholder="" clearable>
                <el-option value="nontaxcode_like" label="收费项目编码"/>
                <el-option value="nontaxname_like" label="收费项目名称"/>
                <el-option value="chargeunit_like" label="收费计量单位"/>
                <el-option value="chargelimit_like" label="收费项目上限"/>
                <el-option value="chargelower_like" label="收费项目下限"/>
                <el-option value="chargetypecode_like" label="收费类别编码"/>
                <el-option value="chargetypename_like" label="收费类别名称"/>
                <el-option value="fundtypecode_like" label="资金性质编码"/>
                <el-option value="fundtypename_like" label="资金性质名称"/>
                <el-option value="levelnum_like" label="级别"/>
                <el-option value="salestax_like" label="营业税率"/>
                <el-option value="remark" label="备注"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="50px" label="等于">
              <el-input v-model="form.val" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="项目名称">
              <el-input
                v-model="guidname"
                clearable>
                <el-button slot="append" icon="el-icon-caret-bottom" @click="show2()"/>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="wrap-box wrap">
        <el-scrollbar style="height:100%;width:100%;">
          <el-table
            ref="singleTable"
            :data="tableData"
            border
            style="width: 100%"
            highlight-current-row
            @row-dblclick = "dbRow"
            @current-change= "changeRow">
            <el-table-column
              sortable
              center
              type="index"/>
            <el-table-column
              v-for="value in tbHead"
              :key="value.label"
              :label="value.label"
              :prop="value.prop"
              :width="value.width||180"
              center
              sortable >
              <!-- <template slot-scope="scope" >
                <span v-if="value.prop === 'flevel'|| value.prop === 'ftype'">
                  {{ $getCodeLabel(scope.row[value.prop]) }}
                </span>
                <span v-else>{{ scope.row[value.prop] }}</span>
              </template> -->
            </el-table-column>

          </el-table>
        </el-scrollbar>
      </div>
      <div class="wrap-box wrap">
        <el-scrollbar style="height:100%;width:100%;">
          <el-table
            :data="tableData2"
            border
            style="width: 100%"
            highlight-current-row
            @row-dblclick = "dbRow2">
            <el-table-column
              sortable
              header-align="center"
              align="center"
              type="index"/>
            <el-table-column
              v-for="value in tbHead2"
              :key="value.label"
              :label="value.label"
              :prop="value.prop"
              :width="value.width||180"
              sortable
              header-align="center"
              align="center"
            >
              <template slot-scope="scope" >
                <span v-if="value.prop === 'flevel'|| value.prop === 'ftype'">
                  {{ $getCodeLabel(scope.row[value.prop]) }}
                </span>
                <span v-else>{{ scope.row[value.prop] }}</span>
              </template>
            </el-table-column>

          </el-table>
          <!-- 明细 -->
          <el-dialog :visible.sync="dialogFormVisible" title="明细">
            <el-form disabled size="mini" label-width="100px" >
              <el-row>
                <el-col :span="12">
                  <el-form-item label="行政区划">
                    <el-input v-model="form3.admdivcode"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="年度">
                    <el-input v-model="form3.year"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="收费项目编码">
                    <el-input v-model="form3.nontaxcode"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="收费计量单位">
                    <el-input v-model="form3.chargeunit"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="收费项目名称">
                    <el-input v-model="form3.nontaxname"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="收费项目全称">
                    <el-input v-model="form3.nontaxfallname"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="收费标准上限">
                    <el-input v-model="form3.chargelimit"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="收费标准下限">
                    <el-input v-model="form3.chargelower"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="所属收费类别">
                    <el-input v-model="form3.chargetypename"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="所属资金性质">
                    <el-input v-model="form3.fundtypename"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="预算科目名称">
                    <el-input v-model="form3.incomesortname"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="征管方式">
                    <el-input v-model="form3.collectionmet"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="">
                    <el-radio-group v-model="form3.isenabled">
                      <el-radio :label="0">停用</el-radio>
                      <el-radio :label="1">启用</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="">
                    <el-checkbox v-model="form3.ispublicprogram" true-label="1">公用项目标志</el-checkbox>
                    <el-checkbox v-model="form3.allowquerymark" true-label="1">费征查询是否显示</el-checkbox>
                    <el-checkbox v-model="form3.internalcontactmark" true-label="1">是否为往来项目</el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注">
                    <el-input v-model="form3.remark" type="textarea"/>
                  </el-form-item>
                </el-col>
            </el-row></el-form>
          </el-dialog>
        </el-scrollbar>
      </div>

      <layer ref="layer1" :tb-head="typeHead" :form="formtype" :table-data="typeList" title="选择所需项目" @select="gettype"/>
      <layer ref="layer2" :tb-head="proHead" :form="formpro" :table-data="proList" title="选择所需项目" @select="getpro"/>
    </div>
  </div>
</template>

<script>
import layer from '@/components/layer'
import zcfggl from '@/api/zcfggl/zcfggl.js'
import Bus from '@/utils/Bus'
import toolBar from '@/components/toolBar'
export default {
  components: {
    layer,
    toolBar
  },
  data() {
    return {
      // 明细
      form3: {},
      dialogFormVisible: false,
      clientButnsArray: ['close', 'clear', 'refresh1', 'print', 'tablePrintPreview', 'tablePrintSet', 'export'],
      // 上面表
      tableData: [],
      tbHead: [
        { prop: 'nontaxcode', width: '120', label: '收费项目编码' },
        { prop: 'nontaxname', width: '160', label: '收费项目名称' },
        { prop: 'chargeunit', width: '120', label: '收费计量单位' },
        { prop: 'chargelimit', width: '120', label: '收费项目上限' },
        { prop: 'chargelower', width: '120', label: '收费项目下限' },
        { prop: 'basChargetype.chargetypecode', width: '120', label: '收费类别编码' },
        { prop: 'basChargetype.chargetypename', width: '160', label: '收费类别名称' },
        { prop: 'basFundtype.fundtypecode', width: '120', label: '资金性质编码' },
        { prop: 'basFundtype.fundtypename', width: '160', label: '资金性质名称' },
        { prop: 'basFundtype.levelnum', width: '100', label: '级别' },
        { prop: 'salestax', width: '120', label: '营业税率' },
        { prop: 'remark', width: '120', label: '备注' }
      ],
      tableData2: [],
      tbHead2: [
        { prop: 'fnofile', width: '120', label: '文件文号' },
        { prop: 'fname', width: '200', label: '文件名称' },
        { prop: 'ftype', width: '120', label: '文件类型' },
        { prop: 'flevel', width: '200', label: '文件级次' }
      ],
      proHead: [
        {
          prop: 'nontaxcode',
          width: '200px',
          label: '收费类别编码'
        },
        {
          prop: 'nontaxname',
          width: '200px',
          label: '收费类别名称'
        }
      ],
      formpro: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '收费类别编码',
            key: 'nontaxcode'
          },
          {
            val: '收费类别名称',
            key: 'nontaxname'
          }
        ],
        equal: ''
      },
      proList: [],
      typeHead: [
        {
          prop: 'chargetypecode',
          width: '200px',
          label: '收费类别编码'
        },
        {
          prop: 'chargetypename',
          width: '200px',
          label: '收费类别名称'
        }
      ],
      formtype: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '收费类别编码',
            key: 'chargetypecode'
          },
          {
            val: '收费类别名称',
            key: 'chargetypename'
          }
        ],
        equal: ''
      },
      typeList: [],
      chargetypename: '',
      guidname: '',
      form: {
        chargetypeguid: '',
        guid: '',
        key: '',
        val: ''
      }
    }
  },
  watch: {
    chargetypename(n) {
      if (!n) {
        this.form.chargetypeguid = ''
      }
    },
    guidname(n) {
      if (!n) {
        this.form.guid = ''
      }
    }
  },
  created() {
    this.onSubmit()
    Bus.$off('clear')
    Bus.$on('clear', () => {
      //       chargetypename: '',
      // guidname: '',
      // form: {
      //   chargetypeguid: '',
      //   guid: '',
      //   key: '',
      //   val: ''
      // }
      this.chargetypename = ''
      this.guidname = ''
      this.form.chargetypeguid = ''
      this.form.guid = ''
      this.form.key = ''
      this.form.val = ''
    })
    Bus.$off('refresh1')
    Bus.$on('refresh1', () => {
      this.onSubmit()
    })
    zcfggl.basChargeproject().then(res => {
      // console.log('2', res)
      this.proList = res.data
    })
    zcfggl.getChargetype().then(res => {
      // console.log(res)
      this.typeList = res.data
    })
  },
  methods: {
    dbRow2(row) {
      window.open(process.env.BASE_API + '/pol/polProjectFnoFileLib/download?guid=' + row.guid)
    },
    dbRow(row) {
      this.dialogFormVisible = true
      this.form3 = row
    },
    changeRow(row) {
      console.log('rrrrrrr', row)
      if (row && row.guid) {
        zcfggl.findPolProjectFnoPrj(row.guid).then(res => {
          console.log('-----', res)
          this.tableData2 = res.data.list
        })
      }
    },
    gettype(val) {
      console.log(val)
      this.chargetypename = val.currentRow.foreignname
      this.form.chargetypeguid = val.currentRow.guid
    },
    getpro(val) {
      console.log(val)
      this.guidname = val.currentRow.nontaxname
      this.form.guid = val.currentRow.guid
    },
    show1() {
      this.$refs.layer1.dialogTableVisible = true
    },
    show2() {
      this.$refs.layer2.dialogTableVisible = true
    },
    onSubmit() {
      zcfggl.findChargeAgencyChgPro(this.form).then(res => {
        console.log('cx', res.data)
        this.tableData = res.data
        this.$refs.singleTable.setCurrentRow(this.tableData[0])
        if (res.data.length > 0) {
          // 加载下面表
          zcfggl.findPolProjectFnoPrj(res.data[0].guid).then(res => {
            this.tableData2 = res.data.list
          })
        } else {
          this.tableData2 = []
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  display: flex;
  flex-direction: column;
  height: 100%;
  h1{
    height: 40px;
    line-height: 40px;
    text-decoration: underline;
    font-size: 20px;
    text-align: center;
    font-weight: 700;
    margin-bottom: 20px;
  }
    .wrap-box{
    // flex: 1;
    padding: 5px;
    height: 150px;
}

}
</style>


<template>
  <div class="title">
    <toolBar :client-butns-array="clientButnsArray" />
    <h1>单位收费项目</h1>
    <div>
      <el-form ref="form" :model="form" size="mini" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="单位名称">
              <el-input
                v-model="agencyname"
                clearable>
                <el-button slot="append" icon="el-icon-caret-bottom" @click="show1()"/>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="50px" label="筛选">
              <el-select v-model="form.filterName" placeholder="" clearable>
                <el-option value="agencycode" label="执收单位编码"/>
                <el-option value="agencyname" label="执收单位名称"/>
                <el-option value="nontaxcode" label="收费单位编码"/>
                <el-option value="nontaxname" label="收费项目名称"/>
                <el-option value="chargeunit" label="收费计量单位"/>
                <el-option value="chargelimit" label="收费项目上限"/>
                <el-option value="chargelower" label="收费项目下限"/>
                <el-option value="remark" label="备注"/>
                <el-option value="incomesortcode" label="预算科目编码"/>
                <el-option value="incomesortname" label="预算科目名称"/>
                <el-option value="chargetypecode" label="收费类别编码"/>
                <el-option value="chargetypename" label="收费类别名称"/>
                <el-option value="fundtypecode" label="资金性质编码"/>
                <el-option value="fundtypename" label="资金性质名称"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="50px" label="等于">
              <el-input v-model="form.filterValue" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="项目名称">
              <el-input
                v-model="nontaxname"
                clearable>
                <el-button slot="append" icon="el-icon-caret-bottom" @click="show2()"/>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1.5">
            <el-form-item label="项目级次"/>
          </el-col>
          <el-col :span="3">
            <el-form-item label="从" label-width="35px">
              <el-select v-model="form.sLevelnum" placeholder="">
                <el-option label="末级" value="0"/>
                <el-option label="1级" value="1"/>
                <el-option label="2级" value="2"/>
                <el-option label="3级" value="3"/>
                <el-option label="4级" value="4"/>
                <el-option label="5级" value="5"/>
                <el-option label="6级" value="6"/>
                <el-option label="7级" value="7"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="至" label-width="35px">
              <el-select v-model="form.eLevelnum" placeholder="">
                <el-option label="末级" value="0"/>
                <el-option label="1级" value="1"/>
                <el-option label="2级" value="2"/>
                <el-option label="3级" value="3"/>
                <el-option label="4级" value="4"/>
                <el-option label="5级" value="5"/>
                <el-option label="6级" value="6"/>
                <el-option label="7级" value="7"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 分页 -->
        <el-row>
          <el-pagination
            :current-page="form.pageIndex"
            :page-sizes="[10, 15, 20, 25, 30]"
            :page-size="form.pageSize"
            :total="totalCount"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
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
            @row-click = "clickRow"
            @current-change= "changeRow">
            <el-table-column
              :formatter="$tableCodeToLabel"
              sortable
              center
              type="index"/>
            <el-table-column
              v-for="value in tbHead"
              :formatter="$tableCodeToLabel"
              :key="value.label"
              :label="value.label"
              :prop="value.prop"
              :width="value.width||180"
              sortable
              header-align="center"
              align="center"
              center
            >
              <template slot-scope="scope" >
                <span v-if="value.prop === 'isleaf'|| value.prop === 'isenabled'|| value.prop === 'usedmark'">
                  {{ scope.row[value.prop] | markFilter }}
                </span>
                <span v-else-if="value.prop === 'agencycode'|| value.prop === 'nontaxcode'" style="color:#409EFF;text-decoration: underline;cursor: pointer;">
                  {{ scope.row[value.prop] | markFilter }}
                </span>
                <span v-else>{{ scope.row[value.prop] }}</span>
              </template>
            </el-table-column>

          </el-table>
        </el-scrollbar>
      </div>
      <div class="wrap-box wrap">
        <el-scrollbar style="height:100%;width:100%;">
          <el-table
            :data="tableData2"
            border
            sortable
            header-align="center"
            align="center"
            style="width: 100%"
            highlight-current-row
            @row-dblclick = "dbRow2">
            <el-table-column
              :formatter="$tableCodeToLabel"
              sortable
              header-align="center"
              align="center"
              type="index"/>
            <el-table-column
              v-for="value in tbHead2"
              :formatter="$tableCodeToLabel"
              :key="value.label"
              :label="value.label"
              :prop="value.prop"
              :width="value.width||180"
              sortable
              header-align="center"
              align="center"
            />
          </el-table>
        </el-scrollbar>
      </div>
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
      <!-- 单位详细 -->
      <el-dialog :visible.sync="dialogFormVisible1" width="90%" title="单位详细">
        <div class="details">
          <div class="form-box">
            <el-form disabled size="mini" label-width="100px" >
              <el-row>
                <el-col :span="12">
                  <el-form-item label="行政区划">
                    <el-input v-model="form0.admdivcode"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="年度">
                    <el-input v-model="form0.year"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="执收单位编码">
                    <el-input v-model="form0.agencycode"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="外部编码">
                    <el-input v-model="form0.foreigncode"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="执收单位名称">
                    <el-input v-model="form0.agencyname"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="单位简称">
                    <el-input v-model="form0.agencyshortname"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系地址">
                    <el-input v-model="form0.address"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="机构代码">
                    <el-input v-model="form0.orgcode"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="拼音简码">
                    <el-input v-model="form0.pinyincode"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="负责人">
                    <el-input v-model="form0.treasurer"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="负责人电话">
                    <el-input v-model="form0.treasurertel"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="经办人">
                    <el-input v-model="form0.attn"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="经办人电话">
                    <el-input v-model="form0.attntel"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="所属收费区域">
                    <el-input v-model="form0.chargearea"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="预算拨款性质">
                    <el-input v-model="form0.budgetkind"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单位性质">
                    <el-input v-model="form0.agencykind"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="">
                    <el-radio-group v-model="form0.ishall">
                      <el-radio :label="0">单位</el-radio>
                      <el-radio :label="1">大厅</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="">
                    <el-radio-group v-model="form0.isenabled">
                      <el-radio :label="0">停用</el-radio>
                      <el-radio :label="1">启用</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="单位等级">
                    <el-input v-model="form0.agencyrank"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="">
                    <el-checkbox v-model="form0.remotedisplaymark" label="异地显示" name="type"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="tab-box">
            <el-scrollbar style="height:50%;width:100%;">
              <el-table
                :data="form1"
                border
                style="width: 100%"
                highlight-current-row
                sortable
                header-align="center"
                align="center"
              >
                <el-table-column
                  :formatter="$tableCodeToLabel"
                  type="index"
                  sortable
                  header-align="center"
                  align="center"
                  width="50"/>
                <el-table-column
                  :formatter="$tableCodeToLabel"
                  sortable
                  prop="nontaxcode"
                  label="收费项目编码"
                  header-align="center"
                  align="center"
                  width="140"/>
                <el-table-column
                  :formatter="$tableCodeToLabel"
                  sortable
                  prop="nontaxname"
                  label="收费项目名称"
                  header-align="center"
                  align="center"
                  width="160"/>
                <el-table-column
                  :formatter="$tableCodeToLabel"
                  sortable
                  prop="chargeunit"
                  label="计量单位"
                  header-align="center"
                  align="center"
                  width="100"/>
                <el-table-column
                  :formatter="$tableCodeToLabel"
                  sortable
                  prop="chargelower"
                  label="收费标准"
                  header-align="center"
                  align="center"
                  width="100"/>
                <el-table-column
                  :formatter="$tableCodeToLabel"
                  sortable
                  prop="basChargetype"
                  label="所属收费类别"
                  header-align="center"
                  align="center"
                  width="140">
                  <template slot-scope="scope" >
                    <span>{{ scope.row.basChargetype.chargetypename }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :formatter="$tableCodeToLabel"
                  sortable
                  prop="basFundtype"
                  label="所属资金管理方式"
                  header-align="center"
                  align="center"
                  width="160">
                  <template slot-scope="scope" >
                    <span>{{ scope.row.basFundtype.fundtypename }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :formatter="$tableCodeToLabel"
                  sortable
                  prop="basBudgetsubject"
                  label="预算科目"
                  header-align="center"
                  align="center"
                  width="160">
                  <template slot-scope="scope" >
                    <span>{{ scope.row.basBudgetsubject&& scope.row.basBudgetsubject.incomesortname }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-scrollbar>
            <el-scrollbar style="height:50%;width:100%;">
              <el-table
                :data="form2"
                border
                style="width: 100%"
                highlight-current-row
                sortable
                header-align="center"
                align="center"
              >
                <el-table-column
                  :formatter="$tableCodeToLabel"
                  type="index"
                  sortable
                  header-align="center"
                  align="center"
                  width="50"/>
                <el-table-column
                  :formatter="$tableCodeToLabel"
                  sortable
                  prop="billcode"
                  label="票据编号"
                  header-align="center"
                  align="center"
                  width="120"/>
                <el-table-column
                  :formatter="$tableCodeToLabel"
                  sortable
                  prop="billname"
                  label="票据名称"
                  header-align="center"
                  align="center"
                  width="160"/>
                <el-table-column
                  :formatter="$tableCodeToLabel"
                  sortable
                  prop="pricingmet"
                  label="计价方式"
                  header-align="center"
                  align="center"
                  width="120"/>
                <el-table-column
                  :formatter="$tableCodeToLabel"
                  sortable
                  prop="portions"
                  label="每本份数"
                  header-align="center"
                  align="center"
                  width="100"/>
                <el-table-column
                  :formatter="$tableCodeToLabel"
                  sortable
                  prop="costprice"
                  label="成本单价"
                  header-align="center"
                  align="center"
                  width="100"/>
                <el-table-column
                  :formatter="$tableCodeToLabel"
                  sortable
                  prop="insiderprice"
                  label="内部单价"
                  header-align="center"
                  align="center"
                  width="100"/>
                <el-table-column
                  :formatter="$tableCodeToLabel"
                  sortable
                  prop="agencyprice"
                  label="单价"
                  header-align="center"
                  align="center"
                  width="100"/>
                <el-table-column
                  :formatter="$tableCodeToLabel"
                  sortable
                  prop="agentchargemark"
                  label="银行代收标志"
                  header-align="center"
                  align="center"
                  width="140">
                  <template slot-scope="scope" >
                    {{ scope.row.agentchargemark === 0 ? '√' : '×' }}
                  </template>
                </el-table-column>
                <el-table-column
                  :formatter="$tableCodeToLabel"
                  sortable
                  prop="itemsnum"
                  label="条目数"
                  header-align="center"
                  align="center"
                  width="100"/>
              </el-table>
            </el-scrollbar>
          </div>
        </div>
      </el-dialog>

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
      // 单位详细
      form0: {},
      form1: [],
      form2: [],
      dialogFormVisible1: false,
      clientButnsArray: ['close', 'clear', 'refresh1', 'print', 'tablePrintPreview', 'tablePrintSet', 'export'],
      // 上面表
      tableData: [],
      tbHead: [
        { prop: 'agencycode', width: '120', label: '执收单位编码' },
        { prop: 'agencyname', width: '160', label: '执收单位名称' },
        { prop: 'nontaxcode', width: '120', label: '收费单位编码' },
        { prop: 'nontaxname', width: '140', label: '收费项目名称' },
        { prop: 'chargeunit', width: '120', label: '收费计量单位' },
        { prop: 'chargelimit', width: '120', label: '收费项目上限' },
        { prop: 'chargelower', width: '120', label: '收费项目下限' },
        { prop: 'incomesortcode', width: '120', label: '预算科目编码' },
        { prop: 'incomesortname', width: '160', label: '预算科目名称' },
        { prop: 'chargetypecode', width: '100', label: '收费类别编码' },
        { prop: 'chargetypename', width: '120', label: '收费类别名称' },
        { prop: 'fundtypecode', width: '100', label: '资金性质编码' },
        { prop: 'fundtypename', width: '120', label: '资金性质名称' },
        { prop: 'isleaf', width: '100', label: '末级标志' },
        { prop: 'isenabled', width: '100', label: '是否启用' },
        { prop: 'usedmark', width: '100', label: '使用标志' },
        { prop: 'remark', width: '100', label: '备注' }
      ],
      // 下面表
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
          prop: 'agencycode',
          width: '120px',
          label: '单位编码'
        },
        {
          prop: 'agencyname',
          width: '160px',
          label: '单位名称'
        },
        {
          prop: 'pinyincode',
          width: '140px',
          label: '拼音简码'
        },
        {
          prop: 'orgcode',
          width: '120px',
          label: '机构代码'
        }

      ],
      formtype: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '单位编码',
            key: 'agencycode'
          },
          {
            val: '单位名称',
            key: 'agencyname'
          },
          {
            val: '拼音简码',
            key: 'pinyincode'
          },
          {
            val: '机构代码',
            key: 'orgcode'
          }
        ],
        equal: ''
      },
      typeList: [],
      // 上面表单
      agencyname: '',
      nontaxname: '',
      totalCount: 0,

      form: {
        sLevelnum: '0',
        eLevelnum: '0',
        filterName: '',
        filterValue: '',
        pageIndex: 1,
        pageSize: 10,
        agencyCode: '',
        nontaxCode: ''
      }
    }
  },
  watch: {
    agencyname(n) {
      if (!n) {
        this.form.agencyCode = ''
      }
    },
    nontaxname(n) {
      if (!n) {
        this.form.nontaxCode = ''
      }
    }
  },
  created() {
    this.form.pageIndex = 1
    this.onSubmit()
    Bus.$off('clear')
    Bus.$on('clear', () => {
      this.agencyname = ''
      this.nontaxname = ''
      this.form.sLevelnum = '0'
      this.form.eLevelnum = '0'
      this.form.filterName = ''
      this.form.filterValue = ''
      this.form.eLevelnum = '0'
      this.form.eLevelnum = '0'
    })
    Bus.$off('refresh1')
    Bus.$on('refresh1', () => {
      this.form.pageIndex = 1
      this.onSubmit()
    })
    zcfggl.basChargeproject().then(res => {
      // console.log('2', res)
      this.proList = res.data
    })
    zcfggl.basChargeagency().then(res => {
      // console.log(res)
      this.typeList = res.data
    })
  },
  methods: {
    // 当前表格 页码改变 翻页
    handleCurrentChange(val) {
      this.form.pageIndex = val
      this.onSubmit(this.form)
    },
    // 当前表格 页条数改变
    handleSizeChange(val) {
      this.form.pageSize = val
      this.onSubmit(this.form)
    },
    // 下表 下载
    dbRow2(row) {
      window.open(process.env.BASE_API + '/pol/polProjectFnoFileLib/download?guid=' + row.guid)
    },
    // 上表
    clickRow(row, e, column) {
      console.log(row)
      // agencycode
      // nontaxcode
      // 详情
      if (column.property === 'agencycode') {
        zcfggl.basChargeagencyget(row.chargeagencyguid).then(res => {
          // console.log('1:', res)
          this.form0 = res.data
        })
        zcfggl.findChgAgency2Chgpro(row.chargeagencyguid).then(res => {
          // console.log('2:', JSON.stringify(res.data.list))
          this.form1 = res.data.list
        })
        zcfggl.findAgencyId2Bill(row.chargeagencyguid).then(res => {
          // console.log('3:', JSON.stringify(res.data.list))
          this.form2 = res.data.list
        })
        this.dialogFormVisible1 = true
      }
      // 明细
      if (column.property === 'nontaxcode') {
        this.dialogFormVisible = true
        this.form3 = row
      }
    },
    // 加载下表内容
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
      this.agencyname = val.currentRow.agencyname
      this.form.agencyCode = val.currentRow.agencycode
    },
    getpro(val) {
      console.log(val)
      this.nontaxname = val.currentRow.nontaxname
      this.form.nontaxCode = val.currentRow.nontaxcode
    },
    show1() {
      this.$refs.layer1.dialogTableVisible = true
    },
    show2() {
      this.$refs.layer2.dialogTableVisible = true
    },

    onSubmit() {
      zcfggl.findChargeAgencyChgProPs(this.form).then(res => {
        // -----------总数
        console.log('cx', res)
        this.tableData = res.data.data
        this.totalCount = res.data.pageInfo.totalCount
        this.$refs.singleTable.setCurrentRow(this.tableData[0])
        if (res.data.data.length > 0) {
          // 加载下面表
          zcfggl.findPolProjectFnoPrj(res.data.data[0].guid).then(res => {
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
.details{
   display: flex;
   height: 520px;
  .form-box{
    width: 50%;
    flex: 1;
    margin-right: 10px;
  }
  .tab-box{
    width: 50%;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}

}
</style>


<template>
  <div>
    <el-dialog :visible.sync="dialogTableVisible" :title="title" :close-on-click-modal="false" :before-close="returnDefault" width="90%">
      <toolBar :client-butns-array="clientButnsArray"/>
      <!-- 筛选表单 -->
      <h1 class="title">{{ title }}</h1>
      <el-form ref="form" :disabled="toolBarState!==1" :model="form" size="mini" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="业务日期">
              <el-date-picker v-model="form.storagedate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd hh:mm:ss"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编码">
              <el-input v-model="form.receipno" disabled clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库类型">
              <el-radio-group v-model="form.type" @change="changeType">
                <el-radio label="0">领用入库</el-radio>
                <el-radio label="1">印制入库</el-radio>
                <el-radio label="2">历史入库</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="承印单位" >
              <el-input v-model="printUnit" :disabled="!requiredPrintUnit" placeholder="请输入承印单位">
                <span v-if="requiredPrintUnit" slot="suffix" class="required">*</span>
                <el-button v-if="requiredPrintUnit" slot="append" icon="el-icon-caret-bottom" @click="showPrintUnit()" />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库仓库">
              <el-input v-model="moveInBillStorage" placeholder="请输入入库仓库">
                <span slot="suffix" class="required">*</span>
                <el-button slot="append" icon="el-icon-caret-bottom" @click="showMoveInBillStorage()" />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col v-if="toolBarState===1" :span="3">
            <el-button size="mini" type="danger" @click="deleteSelected()">删除所选</el-button>
          </el-col>
          <el-col :span="5">
            <el-form-item label="制单人">
              <el-input v-model="form.operator" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="送审人">
              <el-input v-model="form.delivered" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="审核人">
              <el-input v-model="form.reviewer" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="经手人">
              <el-input v-model="form.attn"/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <!-- 显示表格 -->
      <div class="wrap-add">
        <el-scrollbar class="wrap" style="height:100%;width:100%;">
          <el-table :data="tableData.concat({})" highlight-current-row border style="width: 100%" @selection-change="handleSelectionChange" @current-change="handleCurrentChange" @cell-dblclick="cell" @row-dblclick="elect">
            <el-table-column type="selection" width="30" />
            <el-table-column width="90" type="index" show-overflow-tooltip sortable >
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-button v-if="Object.keys(scope.row).length !==0" size="mini" type="primary" plain @click="addModification(scope.$index, scope.row)">{{ scope.$index + 1 }} 修改</el-button>
                  <el-button v-else size="mini" type="primary" @click="addModification(scope.$index, scope.row)">添加</el-button>
                </div>
                <p v-else>{{ scope.$index + 1 }}</p>
              </template>
            </el-table-column>
            <el-table-column width="100" show-overflow-tooltip sortable prop="billcode" label="票据编号" />
            <el-table-column width="200" show-overflow-tooltip sortable prop="billname" label="票据名称" />
            <el-table-column prop="track" show-overflow-tooltip sortable label="字轨" />
            <el-table-column width="150" prop="startnumber" show-overflow-tooltip sortable label="起始号码">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-changeStartNumberNoLimitByNum="scope.row" v-if="Object.keys(scope.row).length !==0 && !requiredPrintUnit && notUpdate" v-model="scope.row.startnumber" size="mini"/>
                  <el-input v-changeStartNumberByNum="scope.row" v-if="Object.keys(scope.row).length !==0 && requiredPrintUnit && notUpdate" v-model="scope.row.startnumber" size="mini"/>
                </div>
                <p v-else>{{ scope.row.startnumber }}</p>
              </template>
            </el-table-column>
            <el-table-column width="150" prop="endnumber" show-overflow-tooltip sortable label="终止号码">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-changeEndNumberNoLimitByNum="scope.row" v-if="Object.keys(scope.row).length !==0 && !requiredPrintUnit && notUpdate" v-model="scope.row.endnumber" size="mini"/>
                  <el-input v-changeEndNumberByNum="scope.row" v-if="Object.keys(scope.row).length !==0 && requiredPrintUnit && notUpdate" v-model="scope.row.endnumber" size="mini"/>
                </div>
                <p v-else>{{ scope.row.endnumber }}</p>
              </template>
            </el-table-column>
            <el-table-column width="120" prop="num" show-overflow-tooltip sortable label="份数">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <!-- <el-input v-changeInventoryNoLimit="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.inventory" size="mini" /> -->
                  <el-input v-changeInventoryNoLimitByNum="scope.row" v-if="Object.keys(scope.row).length !==0 && !requiredPrintUnit && notUpdate" v-model="scope.row.num" size="mini"/>
                  <el-input v-changeInventoryByNum="scope.row" v-if="Object.keys(scope.row).length !==0 && requiredPrintUnit && notUpdate" v-model="scope.row.num" size="mini"/>
                </div>
                <p v-else>{{ scope.row.num }}</p>
              </template>
            </el-table-column>
            <el-table-column width="120" prop="counts" show-overflow-tooltip sortable label="本数">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-changeCountsNoLimitByNum="scope.row" v-if="Object.keys(scope.row).length !==0 && !requiredPrintUnit && notUpdate" v-model="scope.row.counts" size="mini"/>
                  <el-input v-changeCountsByNum="scope.row" v-if="Object.keys(scope.row).length !==0 && requiredPrintUnit && notUpdate" v-model="scope.row.counts" size="mini"/>
                </div>
                <p v-else>{{ scope.row.counts }}</p>
              </template>
            </el-table-column>
            <el-table-column width="120" prop="price" show-overflow-tooltip sortable label="单价">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-change-price="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.price" size="mini"/>
                </div>
                <p v-else>{{ scope.row.price }}</p>
              </template>
            </el-table-column>
            <el-table-column width="120" prop="amount" show-overflow-tooltip sortable label="金额"/>
            <el-table-column width="120" prop="remark" show-overflow-tooltip sortable label="备注"/>
          </el-table>
        </el-scrollbar>
      </div>
    </el-dialog>
    <!-- 请选承印单位 -->
    <layer ref="layer1" :tb-head="basBillPrintingHead" :form="basBillPrintingForm" :table-data="basBillPrintingTableList" title="请选承印单位" @select="selectedBasBillPrinting" />
    <!-- 请选入库仓库 -->
    <layer ref="layer2" :tb-head="basBillStorageHead" :form="basBillStorageForm" :table-data="basBillStorageTableList" title="请选移入票据仓库" @select="selectedMoveInBillStorage" />
    <!-- 请选择库存票据 -->
    <layer ref="layer3" :tb-head="queryBillStoreFinanceHead" :form="queryBillStoreFinanceForm" :table-data="queryBillStoreFinanceTableList" title="请选择库存票据" @select="selectedQueryBillStoreFinance" @cancelUpdate="cancelUpdate"/>
    <!-- 请选择票证种类信息 -->
    <layer ref="layer4" :tb-head="basBillInfoHead" :form="basBillInfoForm" :table-data="basBillInfoTableList" title="请选择票证种类信息" @select="basBillInfoSelect" />

    <tablePrintSetAdd :print-data="tableData" :template-data="templateDataList" :form-print-data="formPrintData"/>

  </div>
</template>
<script>
import { mapState } from 'vuex'
import Bus from '@/utils/Bus'
import layer from '@/components/layer'
import pjyw from '@/api/pjgl/pjyw/pjyw.js'
import toolBar from '@/components/toolBar'
import { deleteJsonKey } from '@/utils/Common'
import { formatNumber, getRestNumberArray, cutoffCheckMark } from '@/utils/validate'
import tablePrintSetAdd from '@/components/tablePrintSetAdd' // add
import { getPrintTemplateData, savePrintTemplateData } from '@/api/webPrint' // add

export default {
  name: 'Add',
  components: {
    tablePrintSetAdd, // 表格打印设置组件。add
    toolBar, // 上方工具条栏
    layer
  },
  props: {
    // 表单数据
    form: {
      type: Object,
      default: function() {
        return {
          type: '0',
          storagedate: new Date(), // 业务日期
          receipno: '', // 单据编码
          operator: '', // 制单人
          delivered: '', // 送审人
          reviewer: '', // 审核人审核人审核人
          attn: ''// 经手人
        }
      }
    },
    // 标题
    title: {
      type: String,
      default: '标题'
    }
  },
  data() {
    return {
      templateInitData: { //  add
        guid: '',
        userid: null,
        templatecontent: {
          title: '票据入库通知单',
          direction: 2,
          printHeadHeight: 50, // 打印头部区域的高度，单位mm
          printHead: [
            { text: '制表人', value: '', checked: true },
            { text: '业务日期', value: '', checked: true },
            { text: '票据编码', value: '', checked: true },
            { text: '承印单位', value: '', checked: true },
            { text: '入库仓库', value: '', checked: true },
            { text: '备注', value: '', checked: true },
            { text: '审核人', value: '', checked: true },
            { text: '入库类型', value: '', checked: true },
            { text: '经办人', value: '', checked: true },
            { text: '打印时间', value: '', checked: true }
            // { text: '本数合计', value: this.$store.state.user.name, checked: true }
            // { text: '份数合计', value: this.$store.state.user.name, checked: true }
            // { text: '制表人', value: this.$store.state.user.name, checked: true }
            // { text: '制表人', value: this.$store.state.user.name, checked: true }
            // { text: '制表人', value: this.$store.state.user.name, checked: true }
            // { text: '制表人', value: this.$store.state.user.name, checked: true }
          ],
          tableHead: [
            { text: '票据编码', key: 'billcode', width: '120', checked: true },
            { text: '票据名称', key: 'billname', width: '170', checked: true },
            { text: '字轨', key: 'track', width: '70', checked: true },
            { text: '起始号码', key: 'startnumber', width: '120', checked: true },
            { text: '终止号码', key: 'endnumber', width: '120', checked: true },
            { text: '份数', key: 'num', width: '70', checked: true },
            { text: '本数', key: 'counts', width: '70', checked: true },
            { text: '单价', key: 'price', width: '70', checked: true },
            { text: '金额', key: 'amount', width: '70', checked: true },
            { text: '备注', key: 'remark', width: '120', checked: true }
          ],
          printFoot: [
            { text: '制表人', value: '', checked: true },
            { text: '业务日期', value: '', checked: true },
            { text: '票据编码', value: '', checked: true },
            { text: '承印单位', value: '', checked: true },
            { text: '入库仓库', value: '', checked: true },
            { text: '备注', value: '', checked: true },
            { text: '审核人', value: '', checked: true },
            { text: '入库类型', value: '', checked: true },
            { text: '经办人', value: '', checked: true },
            { text: '打印时间', value: '', checked: true }
          ]
        },
        isdefault: 1, // 是否现在使用的模板
        templatecode: this.$route.path + '/add',
        templatename: '标准模板',
        isstandardtemplage: 1 // 是否标准模板
      },
      templateDataList: [], //  add
      // listPrintData: [], //  add 打印数据列表，只有在点击打印，预览，导出，设置时才加载。
      notUpdate: true,
      clientButnsArray: ['billClose', 'billAdd', 'billAddUpdate', 'billAddDelete', 'billSave', 'billAbolish', 'billAddAudit', 'billAddUnaudit', 'addPreview', 'addPrint', 'addSet', 'addExport'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      auditOpinion: '通过',
      audioForm: {
        auditdate: new Date(),
        reviewer: ''
      },
      // 修改和新增等操作时，需要提交的数据项。
      submitData: {
        storage: {
          'type': 0,
          'accredit': null,
          'printed': null,
          'storeid': null,
          'admdivcode': null, // 根据登陆时候用户信息获取
          'approvaldate': null, // 送审的时候才需要传递，值为送审时候的时间。但是这里应该由后端自动生成。
          'approvalmark': 0, // 送审标志， 没有送审的时候，值默认为0，1为已送审。
          'attn': null, //  form.attn
          'auditOpinion': null, // 审核意见，弹审核文本框的时候，文本框中的内容。新增保存时一定为空。
          'auditdate': null, // 审核日期，但是这里应该由后端自动生成。
          'auditmark': 0, // 审核标志，0为未审核，1为已审核。
          'billpermitid': null, // 领用证的guid，在票据仓库数据中。
          'carrytype': 0, // 直接填0，结转需要的，代表是否正常业务。
          'createdate': null, // 创建时间，后台生成，设null
          'creator': null, // 新增操作时，记录的用户的用户名称，根据登陆时候用户信息获取
          'delivered': null, // 送审人，点击送审的时候的用户名，如果没有送审就为空。
          'guid': null, // 新增的时候为空，修改的时候由外面的主表带进来。
          'mark': 0, // 默认填0，这个领用申请业务中是0
          'modifier': null, // 修改人，新增为空，修改，送审，审核，反审核时为用户名。
          'modifydate': null, // 修改时间，同上时间。
          'operator': null, // 操作员，即用户信名，任何操作时，记录用户名。
          'payinagencyid': null, // 单位的guid，选择单位的时候传进来。在票据仓库数据中。
          'personnel': null, // 发票人，该页面一直填null
          'receipNo': null, // 单据编码，后台生成，新增时为null，修改的时候由后台传。
          'releasedate': null, // 发票时间，空。
          'remark': null, // 这里没有备注，就null
          'storagedate': null, // 业务时间，用户选择表单中获取。
          'reviewer': null, // 审核人，非审核操作为null，审核时候为用户名。
          'reviewerinfo': null, // 本页面填空null
          'year': null// 根据登陆时候用户信息获取
        }, bilStorageDetails: { bilStorageDetail: [] }
      },
      // 添加的勾选项
      addSelect: [],
      // 当前从下拉列表中选中的票据仓库集合
      selectedBasBillPrintingList: {},
      selectedMoveInBillStorageList: {},
      // 当前表格选择项
      currentRow: {},
      // 组件是否显示
      dialogTableVisible: false,
      // 入库仓库，承印单位显示名称
      printUnit: '',
      moveInBillStorage: '',
      // 表格数据
      tableData: [],
      // 票据仓库的下拉form
      basBillStorageForm: {
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
            key: 'pinyincode'
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
      queryBillStoreFinanceForm: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            key: 'billcode',
            val: '票据编码'
          },
          {
            key: 'billname',
            val: '票据名称'
          },
          {
            key: 'track',
            val: '字轨'
          },
          {
            key: 'startnumber',
            val: '起始号码'
          },
          {
            key: 'endnumber',
            val: '终止号码'
          },
          {
            key: 'num',
            val: '份数'
          },
          {
            key: 'counts',
            val: '本数'
          },
          {
            key: 'price',
            val: '单价'
          },
          {
            key: 'pricingmet',
            val: '计价方式'
          },
          {
            key: 'portions',
            val: '每本份数'
          },
          {
            key: '',
            val: '票号'
          }

        ],
        equal: ''
      },
      // 票据仓库表格数据
      basBillStorageTableList: [],
      // 库存票据表格数据
      queryBillStoreFinanceTableList: [],
      // 票据仓库表头数据
      basBillStorageHead: [
        {
          prop: 'storagecode',
          label: '仓库编码'
        },
        {
          prop: 'storagename',
          label: '仓库名称',
          width: '220'
        },
        {
          prop: 'pinyincode',
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
      // 库存票据表头数据
      queryBillStoreFinanceHead: [
        {
          prop: 'billcode',
          label: '票据编码'
        },
        {
          prop: 'billname',
          label: '票据名称',
          width: '220'
        },
        {
          prop: 'track',
          label: '字轨'
        },
        {
          prop: 'startnumber',
          label: '起始号码'
        },
        {
          prop: 'endnumber',
          label: '终止号码'
        },
        {
          prop: 'num',
          label: '份数'
        },
        {
          prop: 'counts',
          label: '本数'
        },
        {
          prop: 'price',
          label: '单价'
        },
        {
          prop: 'pricingmet',
          label: '计价方式'
        },
        {
          prop: 'portions',
          label: '每本份数'
        }
      ],
      // 请选择承印单位表头数据
      basBillPrintingHead: [
        {
          prop: 'printingid',
          label: '印刷厂编码'
        },
        {
          prop: 'printingname',
          label: '印刷厂名称'
        },
        {
          prop: 'pinyincode',
          label: '拼音简码'
        },
        {
          prop: 'busleader',
          label: '业务负责人'
        },
        {
          prop: 'legalperson',
          label: '企业法人'
        },
        {
          prop: 'isenabled',
          label: '是否启用'
        }
      ],
      // 承印单位表单数据
      basBillPrintingForm: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '印刷厂编码',
            key: 'printingid'
          },
          {
            val: '印刷厂名称',
            key: 'printingname'
          },
          {
            val: '拼音简码',
            key: 'pinyincode'
          },
          {
            val: '业务负责人',
            key: 'busleader'
          },
          {
            val: '企业法人',
            key: 'legalperson'
          },
          {
            val: '是否启用',
            key: 'attn'
          }
        ],
        equal: ''
      },
      // 承印单位加载的数据
      basBillPrintingTableList: [],
      // 票据种类信息下拉选和表单信息
      basBillInfoForm: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '票据编码',
            key: 'billcode'
          },
          {
            val: '票据名称',
            key: 'billname'
          },
          {
            val: '拼音简码',
            key: 'pinyincode'
          },
          {
            val: '单价',
            key: 'unitprice'
          },
          {
            val: '计价方式',
            key: 'pricingmet'
          },
          {
            val: '每本份数',
            key: 'portions'
          },
          {
            val: '票号',
            key: ''
          }
        ],
        equal: ''
      },
      // 票证种类信息表头数据
      basBillInfoHead: [
        {
          prop: 'billcode',
          label: '票据编码'
        },
        {
          prop: 'billname',
          label: '票据名称'
        },
        {
          prop: 'pinyincode',
          label: '拼音简码'
        },
        {
          prop: 'unitprice',
          label: '单价'
        },
        {
          prop: 'pricingmet',
          label: '计价方式'
        },
        {
          prop: 'portions',
          label: '每本份数'
        }
      ],
      // 票证种类信息表格数据
      basBillInfoTableList: []
    }
  },
  computed: {

    ...mapState({
      toolBarState: state => state.pjyw.toolBarState,
      userInfo: state => state.user.userInfo,
      updateMark: state => state.pjyw.updateMark,
      sendAuditUpdateMark: state => state.pjyw.sendAuditUpdateMark
    }),
    requiredPrintUnit() {
      // 只有领用类型为 ： 印制入库，type为'1'，则需要设置承印单位。
      if (this.form.type === '1') {
        return true
      } else {
        return false
      }
    },
    formPrintData() {
      return [
        { text: '制表人', value: this.$store.state.user.name, checked: true },
        { text: '业务日期', value: this.form.storagedate, checked: true },
        { text: '票据编码', value: this.form.receipno, checked: true },
        { text: '承印单位', value: this.printUnit, checked: true },
        { text: '入库仓库', value: this.moveInBillStorage, checked: true },
        { text: '备注', value: '', checked: true },
        { text: '审核人', value: this.form.reviewer, checked: true },
        { text: '入库类型', value: this.form.type, checked: true },
        { text: '经办人', value: this.attn, checked: true },
        { text: '打印时间', value: new Date().toLocaleString(), checked: true }
      ]
    }

  },
  watch: {

    // storageWarehouse发生改变storageWarehouse为空storageWarehouse也清空
    printUnit(newValue) {
      if (!newValue) {
        // this.form = ''
      }
    },
    'form.type': {
      handler(newVal, oldVal) {
        console.log('值改变了，但是没有执行清空', newVal, oldVal)
        // this.tableData.length = 0
        // this.selectedBasBillPrintingList = {}
        // this.printUnit = ''
      },
      immediate: true
    }

  },
  created() {
    // Bus.$off('addExport')
    // Bus.$on('addExport', () => {
    //   this.getPrintList().then(res => {
    //     Bus.$emit('tablePrintExport')
    //   })
    // })
    // Bus.$off('addPreview')
    // Bus.$on('addPreview', () => {
    //   this.getPrintList().then(res => {
    //     Bus.$emit('tablePrintPreview')
    //   })
    // })
    // Bus.$off('addPrint')
    // Bus.$on('addPrint', () => {
    //   this.getPrintList().then(res => {
    //     Bus.$emit('tablePrint')
    //   })
    // })
    // // Bus.$off('listSet')
    // Bus.$off('listSet')
    // Bus.$on('listSet', () => {
    //   this.getPrintList().then(res => {
    //     Bus.$emit('tablePrintSet')
    //   })
    // })

    // 组件创建时，立即获取打印模板数据。
    this.getPrintData()// add
    this.audioForm.reviewer = this.userInfo.name
    Bus.$off('billAddDelete')
    Bus.$on('billAddDelete', () => {
      this.billAddDelete()
    })
    Bus.$off('billClose')
    Bus.$on('billClose', () => {
      this.cancel()
    })
    Bus.$off('billAbolish')
    Bus.$on('billAbolish', () => {
      this.cancel()
    })
    Bus.$off('billSave')
    Bus.$on('billSave', () => {
      this.save()
    })
    Bus.$off('billAddUpdate')
    Bus.$on('billAddUpdate', () => {
      this.update()
    })
    Bus.$off('billAddSendAudit')
    Bus.$on('billAddSendAudit', () => {
      this.billAddSendAudit()
    })
    Bus.$off('billAddUnaudit')
    Bus.$on('billAddUnaudit', () => {
      this.unaudit()
    })
    Bus.$off('billAddAudit')
    Bus.$on('billAddAudit', () => {
      this.billAddAudit()
    })
    // // 票种
    // this.ticketList().then(res => {
    //   res.data
    // })
    // 票据仓库
    this.getBasBillstorage().then(res => {
      console.log(res)
      this.basBillStorageTableList = res.data
    })
    // 承印单位
    this.getBasBillprinting().then(res => {
      console.log('承印单位信息为：', res)
      this.basBillPrintingTableList = res.data
    })
  },
  mounted() {
    // this.$refs.layer2.setCurrentRow(this.basBillStorageTableList[0])
  },
  methods: {
    getPrintData() { //  add
      var templateCode = this.$route.path + '/add'
      getPrintTemplateData(templateCode).then(res => {
        console.log(res.data)
        if (res.data.length > 0) {
          this.templateDataList = res.data
          console.log('获取了服务器数据！')
        } else {
          this.templateDataList.push(JSON.parse(JSON.stringify(this.templateInitData)))
          this.templateDataList[0].templatecontent = JSON.stringify(this.templateInitData.templatecontent)
          savePrintTemplateData(this.templateDataList[0])
          console.log('获取了本地数据，并将本地数据存到了服务器！')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    changeType(val) {
      console.log('单选框的radio为:', val)
      console.log('单选框的值改变，执行清空')
      this.tableData.length = 0
      this.selectedBasBillPrintingList = {}
      this.printUnit = ''
    },
    cancelUpdate(val) {
      this.notUpdate = val
    },
    // 反审函数,type=1
    unaudit() {
      var guid = this.submitData.storage.guid
      // 这里审核通过接口api
      this.billAudit({ guid: guid, type: 1, auditOpinion: null }).then(res => {
        console.log(res)
        this.$alert('反审成功！', {
          center: true,
          closeOnClickModal: true,
          closeOnPressEscape: true,
          callback: action => {
          }
        })
        this.$store.dispatch('SetToolBarState', 3)
      }).catch(err => {
        console.log(err)
      })
    },
    // 审核通过,type=0
    passAudit() {
      var guid = this.submitData.storage.guid
      // if (!this.requiredPrintUnit) {

      // }

      // 这里审核通过接口api
      this.billAudit({ guid: guid, type: '0', auditOpinion: this.auditOpinion }).then(res => {
        console.log(res)
        this.$alert('审核通过！', {
          center: true,
          closeOnClickModal: true,
          closeOnPressEscape: true,
          callback: action => {
          }
        })
        this.$store.dispatch('SetToolBarState', 4)
        this.dialogAudit = false
      }).catch(err => {
        console.log(err)
      })
    },

    // 审核
    billAddAudit() {
      this.passAudit()
    },
    // 修改其实只是回到了待添加状态。
    update() {
      console.log('现在里面的编号是', this.form.receipno)
      this.$store.dispatch('SetToolBarState', 1)
      // 同时设置修改标记为真，表示保存按钮处于修改保存状态。
      this.$store.dispatch('SetUpdateMark', true)
      console.log('当前表格数据为', this.tableData)
      this.getBasBillinfo().then(res => {
        this.tableData.forEach(item => {
          var matchItem = res.data.find(resItem => {
            return resItem.guid === item.billid
          })
          console.log('找到了', matchItem)
          this.$set(item, 'checkmark', matchItem.checkmark)
          this.$set(item, 'codelength', matchItem.codelength)
        })
      }).catch(err => {
        console.log('获取校验位信息失败', err)
      })
    },
    // 恢复默认状态
    returnDefault(done) {
      // 关闭恢复0状态
      this.$store.dispatch('SetToolBarState', 0)
      // 关闭刷新主表数据。
      Bus.$emit('onSubmit')
      done()
    },
    // 编辑单元格
    cell(row, column, cell, event, $index) {
      // console.log(cell.children[0].children[0].children[0].removeAttribute('disabled'))
    },
    // 保存....................
    // 保存分为2种，一种是添加保存，一种是修改保存。
    save() {
      console.log('点击保存时，当前状态码为', this.toolBarState)
      console.log('点击保存时form为：', this.form)

      if (this.updateMark) {
        if (this.tableData.length === 0) {
          this.$message.error('请添加详细数据！')
        } else {
          // 修改保存状态
          console.log('现在是修改保存状态')
          this.submitData.storage.modifier = this.userInfo.name
          this.submitData.storage.operator = this.userInfo.name
          // 命名不规范，开发泪两行，找的我好苦。
          this.submitData.storage.receipNo = this.form.receipno
          // 修改保存时，也要以当前tableData中的数据为准。
          this.submitData.bilStorageDetails.bilStorageDetail = JSON.parse(JSON.stringify(this.tableData))
          // deleteJsonKey(this.submitData.bilStorageDetails.bilStorageDetail, 'guid')
          this.updateSave(JSON.stringify(this.submitData)).then(res => {
            if (res.code === '200') {
              this.$alert('保存成功！', {
                type: 'success',
                center: true,
                closeOnClickModal: true,
                closeOnPressEscape: true,
                callback: action => {
                }
              })
            }
            this.$store.dispatch('SetToolBarState', 3)
          }).catch(err => {
            console.log('接口返回错误信息', err)
          })
        }
      } else {
        // 添加保存状态
        if (this.tableData.length === 0) {
          this.$message.error('请添加详细数据！')
        } else {
          // 保存和修改转json
          this.submitData.storage.admdivcode = this.userInfo.admdivcode
          this.submitData.storage.attn = this.form.attn
          // this.submitData.storage.billpermitid = this.selectedBasBillPrintingList.perimitguid
          this.submitData.storage.creator = this.userInfo.name
          this.submitData.storage.modifier = null
          this.submitData.storage.operator = this.userInfo.name
          // this.submitData.storage.payinagencyid = this.selectedBasBillPrintingList.agencyid
          // this.submitData.storage.outstorecodeid = this.selectedBasBillPrintingList.guid
          this.submitData.storage.storeid = this.selectedMoveInBillStorageList.guid
          this.submitData.storage.printingid = this.selectedBasBillPrintingList.guid

          this.submitData.storage.type = this.form.type
          this.submitData.storage.storagedate = this.form.storagedate
          this.submitData.storage.year = this.userInfo.year
          this.submitData.bilStorageDetails.bilStorageDetail = JSON.parse(JSON.stringify(this.tableData))
          deleteJsonKey(this.submitData.bilStorageDetails.bilStorageDetail, 'guid')
          // 主表也不要guid，为什么不早说呢  o(╥﹏╥)o
          delete this.submitData.storage.guid
          // 进行保存，进入待送审核状态。
          // 调用保存api
          this.addSave(JSON.stringify(this.submitData)).then(res => {
            // console.log('testArray:', this.testArray)
            this.$alert('保存成功！', {
              type: 'success',
              center: true,
              closeOnClickModal: true,
              closeOnPressEscape: true,
              callback: action => {
              }
            })
            this.form.receipno = res.data.storage.receipNo
            this.submitData.storage = JSON.parse(JSON.stringify(res.data.storage))
            // 坑爹的命名。
            this.submitData.storage.receipno = res.data.storage.receipNo
            // 进入下一步待审状态。
            this.$store.dispatch('SetToolBarState', 3)
            // 设置修改标记为真，表示保存成功，现在只能进行修改而不是新增。
            this.$store.dispatch('SetUpdateMark', true)
            console.log('收到的编号是', res.data.storage.receipNo)
          }).catch(err => { console.log(err) })
        }
      }

      console.log('点击保存之后，当前submitData数据为', this.submitData)
    },
    // 获取校验位信息。
    getCheckMark: pjyw.getCheckMark,
    // 承印单位
    getBasBillprinting: pjyw.getBasBillprinting,
    // 库存票据
    getQueryBillStoreWaitEnter: pjyw.getQueryBillStoreWaitEnter,
    // 票种
    // ticketList: pjyw.ticketList,
    // 票据仓库
    getBasBillstorage: pjyw.getBasBillstorage,
    // 获取全部票种信息
    getBasBillinfo: pjyw.getBasBillinfo,
    // 获取票种信息的起始号码。
    getStartNumber: pjyw.getStartNumber,
    // 增加保存。
    addSave: pjyw.addSave,
    // 修改保存。
    updateSave: pjyw.updateSave,
    // add页面主表数据删除
    delete: pjyw.delete,
    // 送审
    sendAudit: pjyw.sendAudit,
    // 审核，退回，反审，3个api公用。
    // 0通过，2退回，1反审。
    billAudit: pjyw.billAudit,
    // 添加修改
    addModification(index, row) {
      console.log(index, Object.getOwnPropertyNames(row).length)
      console.log(Object.getOwnPropertyNames(row))
      if (this.requiredPrintUnit && this.printUnit === '') {
        this.$message.error('入库类型为印制入库！必须选择承印单位！')
        return
      }
      if (!this.moveInBillStorage) {
        this.$message.error('请您先选择入库仓库')
        return
      }
      if (this.requiredPrintUnit) {
        // 印制入库时，弹出的是库存票据。
        this.getQueryBillStoreWaitEnter(this.selectedBasBillPrintingList.guid).then(res => {
        // 改为弹出层里面的table-data的字段
          this.queryBillStoreFinanceTableList = res.data
          this.$refs.layer3.dialogTableVisible = true
          if (Object.getOwnPropertyNames(row).length !== 1) {
            this.notUpdate = false
          }
        })
      } else {
        // 非印制入库时，弹出的是票种信息。
        console.log('马上获取票种信息')
        this.getBasBillinfo().then(res => {
          console.log('收到的票种信息为', res)
          // 改为弹出层里面的table-data的字段
          this.basBillInfoTableList = res.data
          this.$refs.layer4.dialogTableVisible = true
          if (Object.getOwnPropertyNames(row).length !== 1) {
            this.notUpdate = false
          }
        })
      }
    },
    // 表格添加，修改
    elect(row, event, column) {
      console.log(row)
    },
    // 表格行选择设置
    handleCurrentChange(val) {
      this.currentRow = val
    },
    // 勾选
    handleSelectionChange(val) {
      this.addSelect = val
    },
    // 添加
    confirm() {
      this.dialogTableVisible = false
      this.$store.dispatch('SetToolBarState', 0)
    },
    // 取消
    cancel() {
      // 关闭刷新主表数据。
      Bus.$emit('onSubmit')
      this.$store.dispatch('SetToolBarState', 0)
      this.dialogTableVisible = false
    },
    // 删除勾选
    deleteSelected() {
      this.addSelect.forEach(item => {
        // 判断是否最后空项
        if (Object.keys(item).length !== 0) {
          var findex = this.tableData.findIndex(i => {
            return i === item
          })
          this.tableData.splice(findex, 1)
        }
      })
    },
    // 请输入承印单位框
    // showPrint() {
    //   this.$refs.layer1.dialogTableVisible = true
    // },
    // 显示承印单位框
    showPrintUnit() {
      this.$refs.layer1.dialogTableVisible = true
      Bus.$emit('setSelectedRow')
    },
    // 显示票据入库框
    showMoveInBillStorage() {
      this.$refs.layer2.dialogTableVisible = true
      Bus.$emit('setSelectedRow')
    },
    // 选择后 监听数据
    // 选择承印单位
    selectedBasBillPrinting(datas) {
      this.printUnit = datas.currentRow.printingname
      // this.printUnit = datas.currentRow.printUnit
      this.selectedBasBillPrintingList = datas.currentRow
      // 每次重新选择票据仓库，需要清空tabledata中的数据
      this.tableData = []
    },
    // 选择票据入库
    selectedMoveInBillStorage(datas) {
      this.moveInBillStorage = datas.currentRow.storagename
      this.selectedMoveInBillStorageList = datas.currentRow
      // 每次重新选择票据仓库，需要清空tabledata中的数据
      this.tableData = []
    },
    // 印制入库时，选择库存票据信息。
    selectedQueryBillStoreFinance(datas) {
      datas.currentRow.storageid = this.submitData.storage.guid
      var targetBillId = datas.currentRow.billid
      // 相同找到tabledata表格数组中相同billid的项目
      var sameBillIdItemList = this.tableData.filter(item => {
        if (item.billid === targetBillId) {
          if (+item.checkmark === 0) {
            // 外面无校验位
            if (+datas.currentRow.checkmark === 0) {
              // 里面无校验位，外面无。
              return +item.startnumber >= +datas.currentRow.startnumber && +item.endnumber <= +datas.currentRow.endnumber
            } else {
              // 里面有校验位，外面无。表现形式不一致
              return false
            }
          } else {
            // 外面有校验位
            if (+datas.currentRow.checkmark === 0) {
              // 里面无校验位，外面有校验位。表现形式不一致
              return false
            } else {
              // 里面有校验位，外面也有校验位。
              return +item.startnumber.slice(0, -1) >= +datas.currentRow.startnumber.slice(0, -1) && +item.endnumber.slice(0, -1) <= +datas.currentRow.endnumber.slice(0, -1)
            }
          }
        } else {
          return false
        }
      })
      if (sameBillIdItemList.length === 0) {
        // 说明没有相同项，可以直接加。
        this.getBasBillinfo().then(res => {
          // 根据billid找票种，以此来获取校验位信息。
          var matchItem = res.data.find(resItem => {
            return resItem.guid === datas.currentRow.billid
          })
          this.$set(datas.currentRow, 'checkmark', matchItem.checkmark)
          this.$set(datas.currentRow, 'codelength', matchItem.codelength)
          console.log('设置好的mark和length为', datas.currentRow.checkmark, datas.currentRow.codelength)
          datas.currentRow.agebcypurchaseid = null
          datas.currentRow.operator = this.userInfo.name
          datas.currentRow.guid = ''
          var rowdata = datas.currentRow
          if (this.currentRow !== null) {
            // 当前行不为空，则是修改。
            var findex = this.tableData.findIndex((item) => {
              return item === this.currentRow
            })
            delete rowdata.guid
            this.tableData.splice(findex, 1, rowdata)
          } else {
            // 当前行为空，是增加。
            delete rowdata.guid
            this.tableData.push(rowdata)
          }
          this.notUpdate = true
        }).catch(err => {
          console.log('获取校验位信息失败', err)
          this.notUpdate = true
        })
      } else {
        console.log('有相同，准备分段处理。')
        // 有相同billid项目，要判断号段。
        // 先得去服务器拿效验信息。
        this.getBasBillinfo().then(res => {
          var matchItem = res.data.find(resItem => {
            return resItem.guid === datas.currentRow.billid
          })
          this.$set(datas.currentRow, 'checkmark', matchItem.checkmark)
          this.$set(datas.currentRow, 'codelength', matchItem.codelength)
          // 拿到了效验信息。
          // 对一些其他信息进行赋值。
          datas.currentRow.operator = this.userInfo.name
          datas.currentRow.guid = ''
          // 先对相同项进行排序。
          if (+datas.currentRow.checkmark === 1) {
            sameBillIdItemList.sort((a, b) => cutoffCheckMark(a.startnumber) - cutoffCheckMark(b.startnumber))
            console.log('排序完成')
          } else {
            sameBillIdItemList.sort((a, b) => a.startnumber - b.startnumber)
            console.log('排序完成')
          }
          var restNumberArray = getRestNumberArray(sameBillIdItemList, datas.currentRow.startnumber, datas.currentRow.endnumber, datas.currentRow.checkmark)
          datas.currentRow.startnumber = formatNumber(restNumberArray[0].startnumber, datas.currentRow.checkmark, datas.currentRow.codelength)
          datas.currentRow.endnumber = formatNumber(restNumberArray[0].endnumber, datas.currentRow.checkmark, datas.currentRow.codelength)
          datas.currentRow.num = restNumberArray[0].endnumber - restNumberArray[0].startnumber + 1
          datas.currentRow.counts = datas.currentRow.num / datas.currentRow.portions
          restNumberArray.shift()
          datas.currentRow.guid = ''
          var rowdata = datas.currentRow
          if (this.currentRow !== null) {
            // 当前行不为空，则是修改。
            var findex = this.tableData.findIndex((item) => {
              return item === this.currentRow
            })
            this.tableData.splice(findex, 1, rowdata)
          } else {
            // 当前行为空，是增加。
            this.tableData.push(rowdata)
          }
          this.notUpdate = true
        }).catch(err => {
          var msg = err.stack
          if (msg.includes('TypeError')) {
            Bus.$emit('billNumberOutRange', `该票种下的号段已经全部添加！请检查！`)
          }
          this.notUpdate = true
        })
      }
    },
    // 非印制入库时， 选择票证种类信息
    basBillInfoSelect(datas) {
      // 先获取开始号码。
      this.getStartNumber(datas.currentRow.guid, datas.currentRow.year).then(res => {
        this.$set(datas.currentRow, 'startnumber', res.data.startNumber)
        this.$set(datas.currentRow, 'num', '1')
        this.$set(datas.currentRow, 'counts', datas.currentRow.num / datas.currentRow.portions)
        this.$set(datas.currentRow, 'track', datas.currentRow.year)
        this.$set(datas.currentRow, 'endnumber', datas.currentRow.startnumber)
        this.$set(datas.currentRow, 'price', '0')
        this.$set(datas.currentRow, 'amount', '0')
        // 票种信息中没有billid，所以 该业务需要赋值billid，且在后面删除guid的字段。
        datas.currentRow.billid = datas.currentRow.guid
        datas.currentRow.agebcypurchaseid = null
        datas.currentRow.operator = this.userInfo.name
        delete datas.currentRow.guid
        var rowdata = datas.currentRow

        // 这里是无限制判断。
        if (this.currentRow !== null) {
        // 当前行不为空，则是修改。
          var findex = this.tableData.findIndex((item) => {
            return item === this.currentRow
          })
          this.tableData.splice(findex, 1, rowdata)
        } else {
        // 当前行为空，是增加。
          this.tableData.push(rowdata)
        }
      }).catch(err => {
        console.log('获取开始号码失败！！请联系管理员', err)
      })
    },
    billAddDelete() {
      console.log('要删除的数据guid是', this.submitData.storage.guid)
      console.log('要删除的编号是', this.submitData.storage.receipno)
      this.$confirm('您确定要删除单据编码为【' + this.submitData.storage.receipno + '】的业务单据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete(this.submitData.storage.guid).then(res => {
          if (res.code === '200') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.cancel()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  font-size: 28px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.wrap-add {
  height: 200px;
  .el-table {
    overflow: initial;
  }
  .el-table__body-wrapper {
    overflow: initial !important;
  }
  .el-scrollbar__view {
    width: fit-content;
  }
}
</style>


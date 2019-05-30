<template>
  <div>
    <el-dialog :visible.sync="dialogTableVisible" :title="title" :close-on-click-modal="false" :before-close="returnDefault" width="90%">
      <toolBar :client-butns-array="clientButnsArray" />
      <!-- 筛选表单 -->
      <h1 class="title">{{ title }}</h1>
      <el-form ref="form" :disabled="toolBarState!==1" :model="form" size="mini" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="发售日期">
              <el-date-picker v-model="form.applydate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd hh:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编码">
              <el-input v-model="form.receipno" disabled clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-form-item label="执收单位">
                <el-input v-model="chargeAgencyName" placeholder="请输入执收单位">
                  <el-button slot="append" icon="el-icon-caret-bottom" @click="showBasChargeAgency()" />
                </el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="领用仓库">
                <el-input v-model="receiveBillStorageName" placeholder="请输入领用仓库">
                  <el-button slot="append" icon="el-icon-caret-bottom" @click="showBasBillStorage()" />
                </el-input>
              </el-form-item>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="8">
                <el-form-item label="出库字轨">
                  <el-input v-model="form.outstoretrack" placeholder="请输入出库字轨" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出库单号">
                  <el-input v-model="form.outstoreno" placeholder="请输入出库单号" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="20px">
                  <div class="record-print-btn" @click="openRecordPrint">票据领销记录打印</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="缴款方式">
                  <el-select v-model="form.tradetype" placeholder="">
                    <el-option label="现金缴款" value="D109_01" />
                    <el-option label="转账缴款" value="D109_02" />
                    <el-option label="POS刷卡" value="D109_03" />
                    <el-option label="支票缴款" value="D109_04" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="缴款书号">
                  <el-input v-model="form.tradeid" placeholder="请输入缴款书号" clearable/>
                </el-form-item>
              </el-col>
            </el-row>
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
            <el-form-item label="审核人">
              <el-input v-model="form.reviewer" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="经办人">
              <el-input v-model="form.attn" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <!-- 显示表格 -->
      <div class="wrap-add">
        <el-scrollbar class="wrap" style="height:100%;width:100%;">
          <el-table :data="tableData.concat({})" highlight-current-row border style="width: 100%" @selection-change="handleSelectionChange" @current-change="handleCurrentChange" @cell-dblclick="cell" @row-dblclick="elect">
            <el-table-column type="selection" width="30" />
            <el-table-column width="90" type="index" show-overflow-tooltip sortable>
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
                  <el-input v-change-start-number-by-num="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.startnumber" size="mini" />
                </div>
                <p v-else>{{ scope.row.startnumber }}</p>
              </template>
            </el-table-column>
            <el-table-column width="150" prop="endnumber" show-overflow-tooltip sortable label="终止号码">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-change-end-number-by-num="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.endnumber" size="mini" />
                </div>
                <p v-else>{{ scope.row.endnumber }}</p>
              </template>
            </el-table-column>
            <el-table-column width="120" prop="num" show-overflow-tooltip sortable label="份数">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-changeInventoryByNum="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.num" size="mini" />
                </div>
                <p v-else>{{ scope.row.num }}</p>
              </template>
            </el-table-column>
            <el-table-column width="120" prop="counts" show-overflow-tooltip sortable label="本数">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-change-counts-by-num="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.counts" size="mini" />
                </div>
                <p v-else>{{ scope.row.counts }}</p>
              </template>
            </el-table-column>
            <el-table-column width="120" prop="price" show-overflow-tooltip sortable label="单价">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-change-price="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.price" size="mini" />
                </div>
                <p v-else>{{ scope.row.price }}</p>
              </template>
            </el-table-column>
            <el-table-column width="120" prop="amount" show-overflow-tooltip sortable label="金额" />
            <el-table-column :formatter="$tableCodeToLabel" width="120" prop="pricingmet" show-overflow-tooltip sortable label="计价方式" />
            <el-table-column :formatter="$tableCodeToLabel" prop="portions" show-overflow-tooltip sortable label="每本份数" />
            <el-table-column prop="copies" label="结存份数" />
            <el-table-column prop="balancecount" label="结存本数" />
          </el-table>
        </el-scrollbar>
      </div>

      <el-dialog :visible.sync="dialogAudit" title="票据审核信息" append-to-body>
        <el-form :model="audioForm" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="审核日期">
                <el-date-picker v-model="audioForm.auditdate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd hh:mm:ss" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="审核人">
                <el-input v-model="audioForm.reviewer" disabled/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-input :autosize="{ minRows: 8, maxRows: 10 }" v-model="auditOpinion" type="textarea" />
        <div slot="footer" class="dialog-footer">
          <el-row>
            <el-col :span="8">
              <el-button type="primary" @click="passAudit">通 过</el-button>
            </el-col>
            <el-col :span="8">
              <el-button type="warning" @click="backAudit">退 回</el-button>
            </el-col>
            <el-col :span="8">
              <el-button type="danger" @click="dialogAudit = false">关 闭</el-button>
            </el-col>
          </el-row>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="recordPrintDialog" :close-on-press-escape="false" class="record-print-wrap" width="80%" title="票据领销记录打印" append-to-body>
        <el-row type="flex" justify="space-between">
          <el-col :span="8">
            <h1 class="title">{{ selectedBasChargeAgency.agencycode }} {{ chargeAgencyName }}</h1>
          </el-col>
          <el-col :span="12">
            <div class="right-control">
              <span>已打印：{{ hadPrintedNum }} 行记录，每页只能打印 {{ totalLineNum }} 行。 </span>
              <span style="padding-left:30px">指定打印行位置：</span>
              <!-- <el-input v-model.number="printposition" size="mini" style="width:60px" /> -->
              <el-input-number v-model.trim.number="printposition" :min="1" :max="totalLineNum" class="start-num" style="width:88px" size="mini" controls-position="right" />
            </div>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="5">
            <el-button type="danger" size="mini" @click="changePrintState(0)">设置为未打印状态</el-button>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" size="mini" @click="changePrintState(1)">设置为已打印状态</el-button>
          </el-col>
        </el-row>
        <div class="table-wrap">
          <el-scrollbar style="height:100%;width:100%;">
            <el-table :data="recordPrintList" highlight-current-row border stripe style="width: 100%" @selection-change="setSelectedPrintList" @row-click="checkDetail">
              <el-table-column type="selection" width="30" />
              <el-table-column type="index" width="50" />
              <el-table-column v-for="(item,i) of recordPrintHead" :key="i" :label="item.label" :prop="item.prop" :width="item.width" show-overflow-tooltip sortable/>
            </el-table>
          </el-scrollbar>
        </div>
        <el-row type="flex" justify="end">
          <el-button plain size="mini" @click="checkState">测试</el-button>
          <el-button plain size="mini" @click="exit">退出</el-button>
          <el-button plain size="mini" @click="setUp">设置</el-button>
          <el-button plain size="mini" @click="preview">预览</el-button>
          <el-button plain size="mini" @click="print">打印</el-button>
        </el-row>

        <!-- <el-dialog :visible.sync="printMessageDialog" append-to-body="" width="90%">
          当前正在打印状态，正在打印第{{ currentPageCount }}页，总共有{{ totalPrintCount }}页。
        </el-dialog> -->

      </el-dialog>

    </el-dialog>
    <!-- 请选择执收单位 -->
    <layer ref="layer2" :tb-head="basChargeagencyHead" :form="basChargeAgencyForm" :table-data="basChargeAgencyTableList" title="请选择执收单位" @select="basChargeAgencySelect" />
    <!-- 请选择领用仓库 -->
    <layer ref="layer1" :tb-head="basBillStorageHead" :form="basBillStorageForm" :table-data="basBillStorageTableList" title="请选择执收单位" @select="basBillStorageSelect" />
    <!-- 请选择票证种类信息 -->
    <layer ref="layer3" :tb-head="basBillInfoHead" :form="basBillInfoForm" :table-data="basBillInfoTableList" title="请选择票证种类信息" @select="basBillInfoSelect" />
    <tablePrintSetAdd :print-data="tableData" :template-data="templateDataList" :form-print-data="formPrintData" />
    <recordPrint ref="recordPrint" :template-list="recordTemplateList" :table-print-data="couldPrintList" :start-line-num="printposition" />

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
import recordPrint from './recordPrint'
export default {
  components: {
    recordPrint, // 领销记录打印组件。
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
          // date: new Date(),
          applydate: new Date(), // 业务日期
          receipno: '', // 单据编码
          operator: '', // 制单人
          delivered: '', // 送审人
          reviewer: '', // 审核人
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
      recordTemplateInitData: {
        guid: '',
        userid: null,
        templatecontent: {
          title: '票据领销记录打印单',
          direction: 1,
          printHeadHeight: 50, // 打印头部区域的高度，单位mm
          textAlign: 'left',
          fontSize: 12,
          lineHeight: 8,
          upwardMaxLineNumber: 12,
          downMaxLineNumber: 12,
          restHeight: 24,
          printHead: [
            
          ],
          tableHead: [
            { text: '日期', key: 'applydate', width: '30', checked: true },
            { text: '票据编码', key: 'billcode', width: '30', checked: true },
            { text: '票据名称', key: 'billname', width: '50', checked: true },
            { text: '字轨', key: 'track', width: '20', checked: true },
            { text: '起始号码', key: 'startnumber', width: '40', checked: true },
            { text: '终止号码', key: 'endnumber', width: '40', checked: true },
            { text: '份数', key: 'num', width: '20', checked: true },
            { text: '本数', key: 'counts', width: '20', checked: true },
            { text: '单价', key: 'price', width: '20', checked: true },
            { text: '金额', key: 'amount', width: '20', checked: true },
            { text: '计价方式', key: 'pricingmet', width: '30', checked: true },
            { text: '操作员', key: 'toperator', width: '30', checked: true },
            { text: '审核人', key: 'reviewer', width: '30', checked: true },
            { text: '累计领销份数', key: 'totalapplynumber', width: '30', checked: true },
            { text: '作废份数', key: 'invalidnum', width: '30', checked: true },
            { text: '当期结存', key: 'totalnum', width: '30', checked: true }
          ],
          printFoot: [
            
          ]
        },
        isdefault: 1, // 是否现在使用的模板
        templatecode: this.$route.path + '/record',
        templatename: '标准模板',
        isstandardtemplage: 1 // 是否标准模板
      }, // 领销记录模板初始数据。
      recordTemplateList: [],
      templateInitData: { //  add
        guid: '',
        userid: null,
        templatecontent: {
          title: '票据领用通知单',
          direction: 2,
          printHeadHeight: 50, // 打印头部区域的高度，单位mm
          printHead: [
            { text: '制表人', value: '', checked: true },
            { text: '领用日期', value: '', checked: true },
            { text: '单据编码', value: '', checked: true },
            { text: '出库字轨', value: '', checked: true },
            { text: '出库单号', value: '', checked: true },
            { text: '领用仓库', value: '', checked: true },
            { text: '申请单据', value: '', checked: true },
            { text: '操作员', value: '', checked: true },
            { text: '经办人', value: '', checked: true },
            { text: '缴款方式', value: '', checked: true },
            { text: '缴款书号', value: '', checked: true }
          ],
          tableHead: [
            { text: '票据编码', key: 'billcode', width: '100', checked: true },
            { text: '票据名称', key: 'billname', width: '200', checked: true },
            { text: '字轨', key: 'track', width: '70', checked: true },
            { text: '起始号码', key: 'startnumber', width: '150', checked: true },
            { text: '终止号码', key: 'endnumber', width: '150', checked: true },
            { text: '份数', key: 'num', width: '120', checked: true },
            { text: '本数', key: 'counts', width: '120', checked: true },
            { text: '单价', key: 'price', width: '120', checked: true },
            { text: '金额', key: 'amount', width: '120', checked: true },
            { text: '计价方式', key: 'pricingmet', width: '120', checked: true },
            { text: '每本份数', key: 'portions', width: '120', checked: true },
            { text: '结存份数', key: 'copies', width: '120', checked: true },
            { text: '结存本数', key: 'balancecount', width: '120', checked: true }
          ],
          printFoot: [
            { text: '制表人', value: '', checked: true },
            { text: '领用日期', value: '', checked: true },
            { text: '单据编码', value: '', checked: true },
            { text: '出库字轨', value: '', checked: true },
            { text: '出库单号', value: '', checked: true },
            { text: '领用仓库', value: '', checked: true },
            { text: '申请单据', value: '', checked: true },
            { text: '操作员', value: '', checked: true },
            { text: '经办人', value: '', checked: true },
            { text: '缴款方式', value: '', checked: true },
            { text: '缴款书号', value: '', checked: true }
          ]
        },
        isdefault: 1, // 是否现在使用的模板
        templatecode: this.$route.path + '/add',
        templatename: '标准模板（票据领用证明细）',
        isstandardtemplage: 1 // 是否标准模板
      },
      templateDataList: [], //  add
      printposition: 1,
      recordPrintList: [],
      recordPrintDialog: false,
      recordPrintHead: [
        { label: '日期', prop: 'applydate', width: 180 },
        { label: '是否已打印', prop: 'printed', width: 180 },
        { label: '领/销', prop: 'mark', width: 180 },
        { label: '票据名称', prop: 'billname', width: 180 },
        { label: '字轨', prop: 'track', width: 180 },
        { label: '起始号码', prop: 'startnumber', width: 180 },
        { label: '终止号码', prop: 'endnumber', width: 180 },
        { label: '份数', prop: 'num', width: 180 },
        { label: '本数', prop: 'counts', width: 180 },
        { label: '单价', prop: 'price', width: 180 },
        { label: '金额', prop: 'amount', width: 180 },
        { label: '操作员', prop: 'toperator', width: 180 },
        { label: '审核人', prop: 'reviewer', width: 180 },
        { label: '累计领销份数', prop: 'totalapplynumber', width: 180 },
        { label: '作废份数', prop: 'invalidnum', width: 180 },
        { label: '当期结存', prop: 'totalnum', width: 180 }

      ],
      selectedPrintList: [],
      // notUpdate: true,
      clientButnsArray: ['billClose', 'billAdd', 'billAddUpdate', 'billAddDelete', 'billSave', 'billAbolish', 'billAddAudit', 'billAddUnaudit', 'addPreview', 'addPrint', 'addSet', 'addExport'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      // clientButnsArray: ['billClose', 'billAdd', 'billAddUpdate', 'billAddDelete', 'billSave', 'billAbolish', 'billAddAudit', 'billAddUnaudit', 'tablePrintPreview', 'print', 'set', 'export'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      auditOpinion: '通过',
      audioForm: {
        auditdate: new Date(),
        reviewer: ''
      },
      // 修改和新增等操作时，需要提交的数据项。
      submitData: {
        apply: {
          'accredit': 0, // 是否已制证0
          'applydate': null, // 领用日期
          'certmark': null, // 认证标志
          'invalidmark': null, // 作废标志
          'outstoreno': null, // 出库单号form.outstoreno
          'outstoretrack': null, // 出库单字轨form.outstoretrack
          'paybackacc': null, // 缴款人账号
          'payee': null, // 收款人
          'payeebank': null, // 收款人开户行
          'payeebankacc': null, // 收款人银行帐号
          'payment': null, // 缴款人
          'paymentmark': null, // 缴款标志
          'paytback': null, // 缴款人开户银行
          'permitid': null, // 票据准用证号GUID  selectedBasChargeAgency.perimitguid
          'printed': null, // 是否打印
          'purchaseid': null, // 购领申请单据编码GUID
          'storeid': null, // 退回仓库编码GUID   selectedBasBillStorage.guid
          'tradeid': null, // 集中汇缴时录入的单据编码（收费流水主库GUID）
          'tradetype': null, // 缴款方式

          'admdivcode': null, // 根据登陆时候用户信息获取
          'approvaldate': null, // 送审的时候才需要传递，值为送审时候的时间。但是这里应该由后端自动生成。
          'approvalmark': 0, // 送审标志， 没有送审的时候，值默认为0，1为已送审。
          'attn': null, //  form.attn
          'auditOpinion': null, // 审核意见，弹审核文本框的时候，文本框中的内容。新增保存时一定为空。
          'auditdate': null, // 审核日期，但是这里应该由后端自动生成。
          'auditmark': 0, // 审核标志，0为未审核，1为已审核。
          'billpermitid': null, // 领用证的guid，在执收单位数据中。
          'carrytype': 0, // 直接填0，结转需要的，代表是否正常业务。
          'createdate': null, // 创建时间，后台生成，设null
          'creator': null, // 新增操作时，记录的用户的用户名称，根据登陆时候用户信息获取
          'delivered': null, // 送审人，点击送审的时候的用户名，如果没有送审就为空。
          'guid': null, // 新增的时候为空，修改的时候由外面的主表带进来。
          'mark': 0, // 默认填0，这个领用申请业务中是0
          'modifier': null, // 修改人，新增为空，修改，送审，审核，反审核时为用户名。
          'modifydate': null, // 修改时间，同上时间。
          'operator': null, // 操作员，即用户信名，任何操作时，记录用户名。
          'payinagencyid': null, // 单位的guid，选择单位的时候传进来。在执收单位数据中。
          'personnel': null, // 发票人，该页面一直填null
          'receipNo': null, // 单据编码，后台生成，新增时为null，修改的时候由后台传。
          'releasedate': null, // 发票时间，空。
          'remark': null, // 这里没有备注，就null
          'reviewer': null, // 审核人，非审核操作为null，审核时候为用户名。
          'reviewerinfo': null, // 本页面填空null
          'year': null// 根据登陆时候用户信息获取
        }, bilApplyDetails: { bilApplyDetail: [] }
      },
      // 添加的勾选项
      addSelect: [],

      // 选择的执收单位表格中的行数据集合
      selectedBasChargeAgency: {},
      // 选择的票证仓库表格中的行数据集合
      selectedBasBillStorage: {},
      // 当前表格选择项
      currentRow: {},
      // 组件是否显示
      dialogTableVisible: false,
      // 内层审核dialog是否显示
      dialogAudit: false,
      // 表单数据
      chargeAgencyName: '',
      receiveBillStorageName: '',
      // 表格数据
      tableData: [],
      // 请选择印刷厂,请选择票据仓库,请选择票证种类信息表单数据
      basChargeAgencyForm: {
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
          },
          {
            val: '票号',
            key: ''
          }
        ],
        equal: ''
      },
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
            val: '字轨',
            key: 'track'
          },
          {
            val: '起始号码',
            key: 'startnumber'
          },
          {
            val: '终止号码',
            key: 'endnumber'
          },
          {
            val: '份数',
            key: 'num'
          },
          {
            val: '本数',
            key: 'counts'
          },
          {
            val: '单价',
            key: 'price'
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
      // 执收单位
      basChargeAgencyTableList: [],
      basBillStorageTableList: [],
      // 票证种类信息
      basBillInfoTableList: [],
      // 请选择执收单位表头数据
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
      basBillStorageHead: [
        {
          prop: 'storagecode',
          label: '仓库编码'
        },
        {
          prop: 'storagename',
          label: '仓库名称'
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
          prop: 'inventory',
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
      ]
    }
  },
  computed: {
    ...mapState({
      toolBarState: state => state.pjyw.toolBarState,
      userInfo: state => state.user.userInfo,
      updateMark: state => state.pjyw.updateMark,
      sendAuditUpdateMark: state => state.pjyw.sendAuditUpdateMark
    }),
    formPrintData() {
      return [
        { text: '制表人', value: this.$store.state.user.name, checked: true },
        { text: '领用日期', value: this.form.applydate, checked: true },
        { text: '单据编码', value: this.form.receipno, checked: true },
        { text: '出库字轨', value: this.form.outstoretrack, checked: true },
        { text: '出库单号', value: this.form.outstoreno, checked: true },
        { text: '领用仓库', value: this.receiveBillStorageName, checked: true },
        // { text: '申请单据', value: '', checked: true },// 此处需求暂时未完成，前期制作票据业务时不知道需求，现在发需求再来改动量比较大。
        { text: '操作员', value: this.userInfo.name, checked: true }, // ?
        { text: '经办人', value: this.form.attn, checked: true },
        { text: '缴款方式', value: this.$getCodeLabel(this.form.tradetype), checked: true },
        { text: '缴款书号', value: this.form.tradeid, checked: true }
      ]
    },
    couldPrintList() {
      return this.selectedPrintList.filter(item => item.printed === '×')
    },
    selectedGetGuidList() {
      return this.selectedPrintList.filter(item => item.mark === '领').map(item => item.lyjl_mx_guid)
    },
    selectedSellGuidList() {
      return this.selectedPrintList.filter(item => item.mark === '销').map(item => item.lyjl_mx_guid)
    },
    hadPrintedNum() {
      return this.recordPrintList.filter(item => item.printed === '√').length
    },
    employTemplate() {
      var target = this.recordTemplateList.find(item => item.isdefault === 1)
      if (target) {
        return target
      } else {
        var standardtemplate = this.recordTemplateList.find(item => item.isstandardtemplage === 1)
        if (standardtemplate) {
          return standardtemplate
        } else {
          console.log('没有找到标准模板或者默认模板，请联系管理员或者自行添加新模板。')
          return { templatecontent: {}}
        }
      }
    },
    totalLineNum() {
      return this.employTemplate.templatecontent.upwardMaxLineNumber + this.employTemplate.templatecontent.downMaxLineNumber
    }
  },
  watch: {
    // storageWarehouse发生改变storageWarehouse为空storageWarehouse也清空
    chargeAgencyName(n) {
      if (!n) {
        // this.form.= ''
      }
    }

  },
  created() {
    //  获取领销记录打印数据
    this.getRecordPrintData()
    // 组件创建时，立即获取打印模板数据。
    this.getPrintData()// add
    this.audioForm.reviewer = this.userInfo.name
    Bus.$off('savePrintPosition')
    Bus.$on('savePrintPosition', (num) => {
      this.printposition = num
      this.savePrintPosition(this.submitData.apply.permitid, num)
      this.changePrintState(1)
    })
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
    // 执收单位
    this.getBasChargeagency1().then(res => {
      this.basChargeAgencyTableList = res.data
    })
    this.getBasBillstorage().then(res => {
      this.basBillStorageTableList = res.data
    })
  },
  mounted() {
    // this.$refs.layer2.setCurrentRow(this.basChargeAgencyTableList[0])
  },
  methods: {
    // test() {
    //   console.log(this.$refs.recordPrint)
    //   console.log(this.recordTemplateList)
    //   console.log(this.employTemplate)
    //   console.log('this.totalLineNum:', this.totalLineNum)
    // },
    checkState() {
      Bus.$emit('checkState')
    },
    exit() {
      this.recordPrintDialog = false
    },
    setUp() {
      this.$refs.recordPrint.recordPrintDialogHandClick = true
      this.$refs.recordPrint.recordPrintDialog = true
    },
    preview() {
      Bus.$emit('recordPreview')
      console.log('我已经发送了recordPreview')
    },
    print() {
      Bus.$emit('recordPrint')
    },
    changePrintState(state) { // 改变打印状态，0未打印，1已打印
      // var str = state === 0 ? '未' : '已'
      if (this.selectedPrintList.length > 0) {
        // console.log('已选中的数组为：', this.selectedGetGuidList)
        // this.$confirm(`确定将所选数据设置为【${str}】打印状态？`, '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        this.changeGetPrintState(state, this.selectedGetGuidList).then(res => {
          if (res.code === '200') {
            this.selectedPrintList.filter(item => item.mark === '领').forEach(item => {
              item.printed = state === 0 ? '×' : '√'
            })
          }
        }).catch(err => {
          console.log(err)
        })
        this.changeSellPrintState(state, this.selectedSellGuidList).then(res => {
          if (res.code === '200') {
            this.selectedPrintList.filter(item => item.mark === '销').forEach(item => {
              item.printed = state === 0 ? '×' : '√'
            })
          }
        }).catch(err => {
          console.log(err)
        })
        // 发送请求，将数据置为已打印状态。
        // }).catch(() => {
        // })
      } else {
        this.$alert('尚未选择任何内容，请先勾选数据！', '警告', {
          confirmButtonText: '确定'
        })
      }
    },
    // confirmSetHadPrint() {

    // },
    checkDetail(row) {
      console.log(row)
    },
    setSelectedPrintList(val) {
      this.selectedPrintList = val
    },
    openRecordPrint() {
      // this.getRecordPrintList(this.submitData.apply.permitid).then(res => {
      //   this.recordPrintList = res.data
      //   console.log('收到了看看数据，', res)
      // }).catch(err => {
      //   console.log(err)
      // })
      // this.getPrintPosition(this.submitData.apply.permitid).then(res => {
      //   this.printposition = res.data.printposition
      // }).catch(err => {
      //   console.log(err)
      // })
      // 同时执行p1和p2，并在它们都完成后执行then:
      Promise.all([this.getRecordPrintList(this.submitData.apply.permitid), this.getPrintPosition(this.submitData.apply.permitid)]).then(res => {
        console.log(res[0].data)
        console.log('收到的是：', res[1].data)
        this.recordPrintList = res[0].data
        this.printposition = +res[1].data.printposition
        this.recordPrintDialog = true
        this.$refs.recordPrint.recordPrintDialogHandClick = false
        this.$refs.recordPrint.recordPrintDialog = false
        this.$refs.recordPrint.templateUpdateDialog = false
        if (this.recordPrintList === null) {
          this.recordPrintList = []
        }
        // this.recordPrintList = res
      })
    },
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
    getRecordPrintData() { //  add
      var templateCode = this.$route.path + '/record'
      getPrintTemplateData(templateCode).then(res => {
        if (res.data.length > 0) {
          this.recordTemplateList = res.data
          console.log('获取了服务器领销记录模板数据！')
        } else {
          this.recordTemplateList.push(JSON.parse(JSON.stringify(this.recordTemplateInitData)))
          this.recordTemplateList[0].templatecontent = JSON.stringify(this.recordTemplateInitData.templatecontent)
          savePrintTemplateData(this.recordTemplateList[0])
          console.log('获取了本地领销记录模板数据，并将本地数据存到了服务器！')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 反审函数,type=1
    unaudit() {
      var guid = this.submitData.apply.guid
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
    // 审核不通过，退回函数,type=2
    backAudit() {
      var guid = this.submitData.apply.guid
      // 这里审核通过接口api
      this.billAudit({ guid: guid, type: 2, auditOpinion: this.auditOpinion }).then(res => {
        console.log(res)
        this.$alert('退回成功！', {
          center: true,
          closeOnClickModal: true,
          closeOnPressEscape: true,
          callback: action => {
          }
        })
        this.$store.dispatch('SetToolBarState', 2)
        this.dialogAudit = false
      }).catch(err => {
        console.log(err)
      })
    },
    // 审核通过,type=0
    passAudit() {
      var guid = this.submitData.apply.guid
      // 这里审核通过接口api
      this.billAudit({ guid: guid, type: 0, auditOpinion: this.auditOpinion }).then(res => {
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

    billAddAudit() {
      // 这里的审核只是调出了一个模态框。
      this.dialogAudit = true
    },
    billAddSendAudit() {
      var guid = this.submitData.apply.guid
      this.sendAudit({ guid: guid }).then(res => {
        console.log(res)
        // api调通之后要放到then里面
        this.$alert('送审成功！', {
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
    // 修改其实只是回到了待添加状态。
    update() {
      console.log('现在里面的编号是', this.form.receipno)
      this.$store.dispatch('SetToolBarState', 1)
      // 同时设置修改标记为真，表示保存按钮处于修改保存状态。
      this.$store.dispatch('SetUpdateMark', true)
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
      if (this.tableData.length === 0) {
        this.$message.error('请添加详细数据！')
        return
      }
      if (this.updateMark) {
        // 修改保存状态
        console.log('现在是修改保存状态')
        this.submitData.apply.modifier = this.userInfo.name
        this.submitData.apply.operator = this.userInfo.name
        this.submitData.apply.receipNo = this.form.receipno
        // 修改保存时，也要以当前tableData中的数据为准。
        this.submitData.bilApplyDetails.bilApplyDetail = JSON.parse(JSON.stringify(this.tableData))
        // deleteJsonKey(this.submitData.bilApplyDetails.bilApplyDetail, 'guid')
        console.log('刚刚保存的编号是', this.submitData.apply.receipNo)
        console.log(this.form.receipno)
        console.log('修改保存状态中，待提交的数据为：', this.submitData)
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
          console.log('收到的结果是', res.code)
          // 进入下一步待送审状态。

          this.$store.dispatch('SetToolBarState', 3)
        }).catch(err => {
          console.log('接口返回错误信息', err)
        })
      } else {
        // 添加保存状态
        // 保存和修改转json
        this.submitData.apply.outstoreno = this.form.outstoreno
        this.submitData.apply.outstoretrack = this.form.outstoretrack

        this.submitData.apply.admdivcode = this.userInfo.admdivcode
        this.submitData.apply.attn = this.form.attn
        this.submitData.apply.billpermitid = this.selectedBasChargeAgency.perimitguid
        this.submitData.apply.creator = this.userInfo.name
        this.submitData.apply.modifier = null
        this.submitData.apply.operator = this.userInfo.name

        this.submitData.apply.payinagencyid = this.selectedBasChargeAgency.agencyid
        this.submitData.apply.permitid = this.selectedBasChargeAgency.perimitguid
        this.submitData.apply.storeid = this.selectedBasBillStorage.guid

        this.submitData.apply.applydate = this.form.applydate
        this.submitData.apply.year = this.userInfo.year
        this.submitData.bilApplyDetails.bilApplyDetail = JSON.parse(JSON.stringify(this.tableData))
        deleteJsonKey(this.submitData.bilApplyDetails.bilApplyDetail, 'guid')
        // 主表也不要guid，为什么不早说呢  o(╥﹏╥)o
        delete this.submitData.apply.guid
        // 进行保存，进入待送审核状态。
        // 调用保存api
        this.addSave(JSON.stringify(this.submitData)).then(res => {
          // var item = JSON.parse(JSON.stringify(res.data))
          // this.testArray.push(item)
          // console.log('testArray:', this.testArray)
          this.$alert('保存成功！', {
            type: 'success',
            center: true,
            closeOnClickModal: true,
            closeOnPressEscape: true,
            callback: action => {
            }
          })
          this.form.receipno = res.data.apply.receipNo
          this.submitData.apply = JSON.parse(JSON.stringify(res.data.apply))
          // 坑爹的命名。
          this.submitData.apply.receipno = res.data.apply.receipNo
          // 进入下一步待审状态。
          this.$store.dispatch('SetToolBarState', 3)
          // 设置修改标记为真，表示保存成功，现在只能进行修改而不是新增。
          this.$store.dispatch('SetUpdateMark', true)
          console.log('收到的编号是', res.data.apply.receipNo)
        }).catch(err => { console.log(err) })
      }
      console.log('点击保存之后，当前submitData数据为', this.submitData)
    },
    // // 关闭添加
    // close() {
    //   this.dialogTableVisible = false
    // },
    // 删除
    expurgate() {
      // this.addSelect.forEach(item => {
      //   // 判断是否最后空项
      //   if (Object.keys(item).length !== 0) {
      //     var findex = this.tableData.findIndex(i => {
      //       return i === item
      //     })
      //     this.tableData.splice(findex, 1)
      //   }
      // })
    },
    // 改变销售记录打印状态
    changeSellPrintState: pjyw.changeSellPrintState,
    // 改变领用记录打印状态
    changeGetPrintState: pjyw.changeGetPrintState,
    // 获取打印位置。
    getPrintPosition: pjyw.getPrintPosition,
    // 保存打印位置数字。
    savePrintPosition: pjyw.savePrintPosition,
    // 获取票据领销打印列表数据
    getRecordPrintList: pjyw.getRecordPrintList,
    // 库存票据
    getquerybillstorefinance: pjyw.getquerybillstorefinance,
    // 票种
    // ticketList: pjyw.ticketList,
    // 执收单位
    getBasChargeagency1: pjyw.getBasChargeagency1,
    getBasBillstorage: pjyw.getBasBillstorage,
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
    addModification() {
      if (!this.chargeAgencyName) {
        this.$message.error('请您先选择执收单位')
        return
      }
      this.getquerybillstorefinance(this.selectedBasChargeAgency, this.selectedBasBillStorage.guid).then(res => {
        console.log(res)
        // 改为弹出层里面的table-data的字段
        this.basBillInfoTableList = res.data
        this.$refs.layer3.dialogTableVisible = true
      })
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
      alert('添加')
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
    // 请输入入库仓库框
    showBasChargeAgency() {
      this.$refs.layer2.dialogTableVisible = true
      Bus.$emit('setSelectedRow')
    },
    showBasBillStorage() {
      this.$refs.layer1.dialogTableVisible = true
      Bus.$emit('setSelectedRow')
    },
    // 选择后 监听数据
    // 选择执收单位
    basChargeAgencySelect(datas) {
      console.log(datas.currentRow)
      this.chargeAgencyName = datas.currentRow.agencyname
      this.selectedBasChargeAgency = datas.currentRow
      // 每次重新选择执收单位，需要清空tabledata中的数据
      this.tableData = []
    },
    // 选择票证仓库信息
    basBillStorageSelect(datas) {
      console.log(datas.currentRow)
      this.receiveBillStorageName = datas.currentRow.storagename
      this.selectedBasBillStorage = datas.currentRow
      // 每次重新选择执收单位，需要清空tabledata中的数据
      this.tableData = []
    },
    // 选择票证种类信息
    basBillInfoSelect(datas) {
      // 如果选择的是inventory，而服务器传的又是num，那么需要手动赋值num
      this.$set(datas.currentRow, 'num', datas.currentRow.inventory)
      // datas.currentRow.billid = datas.currentRow.billid
      datas.currentRow.agebcypurchaseid = null
      datas.currentRow.operator = this.userInfo.name
      delete datas.currentRow.guid

      var targetBillId = datas.currentRow.billid
      // 相同找到tabledata表格数组中相同billid的项目
      var sameBillIdItemList = this.tableData.filter(item => {
        // return item.billid === targetBillId
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
        // 先处理其他需要设置的属性。
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
        // 不用加，因为data对象里面有校验信息，不用从服务器获取。不存在时差。
        // this.notUpdate = true
      } else {
        console.log('有相同，准备分段处理。')
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
        const rowdata = datas.currentRow
        if (this.currentRow !== null) {
          // 当前行不为空，则是修改。
          const findex = this.tableData.findIndex((item) => {
            return item === this.currentRow
          })
          this.tableData.splice(findex, 1, rowdata)
        } else {
          // 当前行为空，是增加。
          this.tableData.push(rowdata)
          // this.notUpdate = true
        }
      }
      // var rowdata = datas.currentRow

      // var finditem = this.tableData.find((item) => {
      //   return item.billid === rowdata.guid
      // })
      // if (finditem) {
      //   // 先判断是否有该guid存在。
      //   this.$message.error('该票种已存在，请不要重复添加')
      // } else if (this.currentRow !== null) {
      //   // 当前行不为空，则是修改。
      //   var findex = this.tableData.findIndex((item) => {
      //     return item === this.currentRow
      //   })
      //   this.tableData.splice(findex, 1, rowdata)
      // } else {
      //   // 当前行为空，是增加。
      //   this.tableData.push(rowdata)
      // }

      // // datas.currentRow.receipNo = null
      // console.log('选择的数据是', datas.currentRow)
      // console.log('tableData的数据是：', this.tableData)
    },
    billAddDelete() {
      console.log('要删除的数据guid是', this.submitData.apply.guid)
      console.log('要删除的编号是', this.submitData.apply.receipno)
      this.$confirm('您确定要删除单据编码为【' + this.submitData.apply.receipno + '】的业务单据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete(this.submitData.apply.guid).then(res => {
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

<style lang="scss">
// .wrap-add,
// .table-wrap {
//   height: 200px;
//   .el-table {
//     overflow: visible;
//   }
//   .el-table__body-wrapper {
//     overflow: visible !important;
//   }
//   .el-scrollbar__view {
//     // width: fit-content;
//   }
// }
</style>
<style lang="scss" scoped>
.record-print-btn {
  padding: 3px;
  display: inline;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  background: #fff;
  cursor: pointer;
  &:hover {
    background: #ecf5ff;
    border: 1px solid #cae1fa;
  }
}
.record-print-wrap {
  .title {
    font-size: 24px;
    font-weight: 500;
  }
  .right-control {
    display: flex;
    height: 28px;
    line-height: 28px;
  }
  .table-wrap {
    height: 340px;
    width: 100%;
  }
}
</style>


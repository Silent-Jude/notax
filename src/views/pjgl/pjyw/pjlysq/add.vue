<template>
  <div>
    <el-dialog :visible.sync="dialogTableVisible" :title="title" :close-on-click-modal="false" :before-close="returnDefault" width="80%">
      <toolBar :client-butns-array="clientButnsArray"/>
      <!-- 筛选表单 -->
      <h1 class="title">{{ title }}</h1>
      <el-form ref="form" :disabled="toolBarState!==1||sendAuditUpdateMark===true" :model="form" size="mini" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="业务日期">
              <el-date-picker v-model="form.requestdate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd hh:mm:ss"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编码">
              <el-input v-model="form.receipno" disabled clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执收单位">
              <el-input v-model="chargeAgencyName" placeholder="请输入执收单位">
                <el-button slot="append" icon="el-icon-caret-bottom" @click="showBasChargeAgency()" />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col v-if="toolBarState===1&&sendAuditUpdateMark!==true" :span="3">
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
                <div v-if="toolBarState===1&&sendAuditUpdateMark!==true">
                  <el-button v-if="Object.keys(scope.row).length !==0" size="mini" type="primary" plain @click="addModification(scope.$index, scope.row)">{{ scope.$index + 1 }} 修改</el-button>
                  <el-button v-else size="mini" type="primary" @click="addModification(scope.$index, scope.row)">添加</el-button>
                </div>
                <p v-else>{{ scope.$index + 1 }}</p>
              </template>
            </el-table-column>
            <el-table-column width="100" show-overflow-tooltip sortable prop="billcode" label="票据编号" />
            <el-table-column width="200" show-overflow-tooltip sortable prop="billname" label="票据名称" />
            <el-table-column width="100" show-overflow-tooltip sortable prop="specification" label="票据规格">
              <template slot-scope="scope">
                <div v-if="toolBarState===1&&sendAuditUpdateMark!==true">
                  <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.specification" size="mini" />
                </div>
                <p v-else>{{ scope.row.specification }}</p>
              </template>
            </el-table-column>
            <el-table-column width="120" show-overflow-tooltip sortable prop="portions" label="每本份数"/>
            <el-table-column width="150" show-overflow-tooltip sortable prop="num" label="单位申请数份数">
              <template slot-scope="scope">
                <div v-if="toolBarState===1&&sendAuditUpdateMark!==true">
                  <el-input v-changeUnitNum="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.num" size="mini"/>
                </div>
                <p v-else>{{ scope.row.num }}</p>
              </template>
            </el-table-column>
            <el-table-column width="110" show-overflow-tooltip sortable prop="counts" label="单位申请本数">
              <!-- <template slot-scope="scope"><el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.inventory" size="mini" @change="changeInventory(scope)"/></template> -->
              <template slot-scope="scope">
                <div v-if="toolBarState===1&&sendAuditUpdateMark!==true">
                  <el-input v-changeUnitCounts="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.counts" size="mini" />
                </div>
                <p v-else>{{ scope.row.counts }}</p>
              </template>
            </el-table-column>

            <el-table-column width="110" show-overflow-tooltip sortable prop="checknumber" label="财政核定数份数">
              <template slot-scope="scope">
                <div v-if="toolBarState===1&&sendAuditUpdateMark===true">
                  <el-input v-changeCheckNumber="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.checknumber" size="mini" />
                </div>
                <p v-else>{{ scope.row.checknumber }}</p>
              </template>
            </el-table-column>
            <el-table-column width="110" show-overflow-tooltip sortable prop="checkcount" label="财政核定数本数">
              <template slot-scope="scope">
                <div v-if="toolBarState===1&&sendAuditUpdateMark===true">
                  <el-input v-changeCheckCount="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.checkcount" size="mini" />
                </div>
                <p v-else>{{ scope.row.checkcount }}</p>
              </template>
            </el-table-column>
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
        <el-input :autosize="{ minRows: 8, maxRows: 10 }" v-model="auditOpinion" type="textarea"/>
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
    </el-dialog>
    <!-- 请选择执收单位 -->
    <layer ref="layer2" :tb-head="basChargeAgencyHead" :form="basChargeAgencyForm" :table-data="basChargeAgencyTableList" title="请选择执收单位" @select="basChargeAgencySelect" />
    <!-- 请选择票证种类信息 -->
    <layer ref="layer3" :tb-head="basBillInfoHead" :form="basBillInfoForm" :table-data="basBillInfoTableList" title="请选择票证种类信息" @select="basBillInfoSelect" />

  </div>
</template>
<script>
import { mapState } from 'vuex'
import Bus from '@/utils/Bus'
import layer from '@/components/layer'
import pjyw from '@/api/pjgl/pjyw/pjyw.js'
import toolBar from '@/components/toolBar'
import { deleteJsonKey } from '@/utils/Common'

export default {
  components: {
    toolBar, // 上方工具条栏
    layer
  },
  directives: {
    changeUnitNum: {
      bind: (el, binding) => {
        var oldValue = ''
        var rowData = binding.value
        el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
          oldValue = el.firstElementChild.value
        }
        el.firstElementChild.onchange = function() {
          var inputValue = el.firstElementChild.value
          if (isNaN(Number(inputValue))) {
            Bus.$emit('billNumberOutRange', `输入的数字非法！份数只能为数字！`)
            rowData.num = oldValue
            el.firstElementChild.value = oldValue
            return
          }
          if (Number(inputValue) < 0) {
            Bus.$emit('billNumberOutRange', `输入的数字非法！份数不能为负数！`)
            rowData.num = oldValue
            el.firstElementChild.value = oldValue
            return
          }
          rowData.counts = inputValue / rowData.portions
          rowData.checknumber = inputValue
          rowData.checkcount = rowData.checknumber / rowData.portions
        }
      }
    },
    changeUnitCounts: {
      bind: (el, binding) => {
        var oldValue = ''
        var rowData = binding.value
        el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
          oldValue = el.firstElementChild.value
        }
        el.firstElementChild.onchange = function() {
          var inputValue = el.firstElementChild.value
          if (isNaN(Number(inputValue))) {
            Bus.$emit('billNumberOutRange', `输入的数字非法！本数只能为数字！`)
            rowData.counts = oldValue
            el.firstElementChild.value = oldValue
            return
          }
          if (Number(inputValue) < 0) {
            Bus.$emit('billNumberOutRange', `输入的数字非法！本数不能为负数！`)
            rowData.counts = oldValue
            el.firstElementChild.value = oldValue
            return
          }
          rowData.num = inputValue * rowData.portions
          rowData.checkcount = inputValue
          rowData.checknumber = rowData.checkcount * rowData.portions
        }
      }
    },
    changeCheckNumber: {
      bind: (el, binding) => {
        var oldValue = ''
        var rowData = binding.value
        el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
          oldValue = el.firstElementChild.value
        }
        el.firstElementChild.onchange = function() {
          var inputValue = el.firstElementChild.value
          if (isNaN(Number(inputValue))) {
            Bus.$emit('billNumberOutRange', `输入的数字非法！份数只能为数字！`)
            rowData.checknumber = oldValue
            el.firstElementChild.value = oldValue
            return
          }
          if (Number(inputValue) < 0) {
            Bus.$emit('billNumberOutRange', `输入的数字非法！份数不能为负数！`)
            rowData.checknumber = oldValue
            el.firstElementChild.value = oldValue
            return
          }
          rowData.checkcount = inputValue / rowData.portions
        }
      }
    },
    changeCheckCount: {
      bind: (el, binding) => {
        var oldValue = ''
        var rowData = binding.value
        el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
          oldValue = el.firstElementChild.value
        }
        el.firstElementChild.onchange = function() {
          var inputValue = el.firstElementChild.value
          if (isNaN(Number(inputValue))) {
            Bus.$emit('billNumberOutRange', `输入的数字非法！本数只能为数字！`)
            rowData.checkcount = oldValue
            el.firstElementChild.value = oldValue
            return
          }
          if (Number(inputValue) < 0) {
            Bus.$emit('billNumberOutRange', `输入的数字非法！本数不能为负数！`)
            rowData.checkcount = oldValue
            el.firstElementChild.value = oldValue
            return
          }
          rowData.checknumber = inputValue * rowData.portions
        }
      }
    }
  },
  props: {
    // 表单数据
    form: {
      type: Object,
      default: function() {
        return {
          // date: new Date(),
          requestdate: new Date(), // 业务日期
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
      clientButnsArray: ['billClose', 'billAdd', 'billAddUpdate', 'billAddDelete', 'billSave', 'billAbolish', 'billAddSendAudit', 'billAddAudit', 'billAddUnaudit', 'tablePrintPreview', 'print', 'set', 'export'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      auditOpinion: '通过',
      audioForm: {
        auditdate: new Date(),
        reviewer: ''
      },
      // 修改和新增等操作时，需要提交的数据项。
      submitData: {
        agencyPurchase: {
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
          'requestdate': null, // 业务时间，用户选择表单中获取。
          'reviewer': null, // 审核人，非审核操作为null，审核时候为用户名。
          'reviewerinfo': null, // 本页面填空null
          'year': null// 根据登陆时候用户信息获取
        }, bilAgencyPurchaseDetails: { bilAgencyPurchaseDetail: [] }
      },
      // 添加的勾选项
      addSelect: [],
      // 选择的执收单位表单中的列数据集合
      selectedBasChargeAgency: {},
      // 当前表格选择项
      currentRow: {},
      // 组件是否显示
      dialogTableVisible: false,
      // 内层审核dialog是否显示
      dialogAudit: false,
      // 执收单位显示名称
      chargeAgencyName: '',
      // 表格数据
      tableData: [],
      // 执收单位下拉选和表单数据
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
          }
        ],
        equal: ''
      },
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
      // 执收单位表格数据
      basChargeAgencyTableList: [],
      // 票证种类信息表格数据
      basBillInfoTableList: [],
      // 执收单位表头数据
      basChargeAgencyHead: [
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
      ]
    }
  },
  computed: {

    ...mapState({
      toolBarState: state => state.pjyw.toolBarState,
      userInfo: state => state.user.userInfo,
      updateMark: state => state.pjyw.updateMark,
      sendAuditUpdateMark: state => state.pjyw.sendAuditUpdateMark
    })

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
    // 执收单位
    this.getBasChargeagency().then(res => {
      this.basChargeAgencyTableList = res.data
    })
  },
  mounted() {
  },
  methods: {
    // 反审函数,type=1
    unaudit() {
      var guid = this.submitData.agencyPurchase.guid
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
      var guid = this.submitData.agencyPurchase.guid
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
      var guid = this.submitData.agencyPurchase.guid
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
      var guid = this.submitData.agencyPurchase.guid
      this.sendAudit({ guid: guid }).then(res => {
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
      if (this.toolBarState === 3) {
        // 如果已经送审，再点击修改，则送审修改状态值为真。
        this.$store.dispatch('SetSendAuditUpdateMark', true)
      } else {
        this.$store.dispatch('SetSendAuditUpdateMark', false)
      }
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
    // num,counts,checknumber,checkcount 联动
    changeNum(scope) {
      scope.row.counts = scope.row.num / scope.row.portions
      scope.row.checknumber = scope.row.num
      scope.row.checkcount = scope.row.counts
    },
    changeCounts(scope) {
      scope.row.num = scope.row.counts * scope.row.portions
      scope.row.checknumber = scope.row.num
      scope.row.checkcount = scope.row.counts
    },
    changeChecknumber(scope) {
      scope.row.checkcount = scope.row.checknumber / scope.row.portions
    },
    changeCheckcount(scope) {
      scope.row.checknumber = scope.row.checkcount * scope.row.portions
    },
    // 编辑单元格
    cell(row, column, cell, event, $index) {
      // console.log(cell.children[0].children[0].children[0].removeAttribute('disabled'))
    },
    // 保存....................
    // 保存分为2种，一种是添加保存，一种是修改保存。
    save() {
      console.log('点击保存时,待提交的数据为', this.submitData)
      if (this.updateMark) {
        // 修改保存状态
        console.log('现在是修改保存状态')
        this.submitData.agencyPurchase.modifier = this.userInfo.name
        this.submitData.agencyPurchase.operator = this.userInfo.name
        // 命名不规范，开发泪两行，找的我好苦。
        this.submitData.agencyPurchase.receipNo = this.form.receipno
        // 修改保存时，也要以当前tableData中的数据为准。
        this.submitData.bilAgencyPurchaseDetails.bilAgencyPurchaseDetail = JSON.parse(JSON.stringify(this.tableData))
        // deleteJsonKey(this.submitData.bilAgencyPurchaseDetails.bilAgencyPurchaseDetail, 'guid')
        console.log('刚刚保存的编号是', this.submitData.agencyPurchase.receipNo)
        console.log(this.form.receipno)
        console.log('修改保存状态中，待提交的数据为：', this.submitData)
        console.log('修改保存状态中，待提交的送审标志为：', this.submitData.agencyPurchase.approvalmark)

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
          console.log('收到的结果是', res)
          // 进入下一步待送审状态。
          if (this.sendAuditUpdateMark) {
            // 已送审，未审核状态下，修改数据后，应该还是处于送审状态。
            this.$store.dispatch('SetToolBarState', 3)
          } else {
            // 非送审修改时，则进入待送审状态。且设置组件内的送审状态为1
            this.$store.dispatch('SetToolBarState', 2)
            this.submitData.agencyPurchase.approvalmark = 1
          }
        }).catch(err => {
          console.log('接口返回错误信息', err)
        })
      } else {
        // 添加保存状态
        if (this.tableData.length === 0) {
          this.$message.error('请添加详细数据！')
        } else {
          // 保存和修改转json
          this.submitData.agencyPurchase.admdivcode = this.userInfo.admdivcode
          this.submitData.agencyPurchase.attn = this.form.attn
          this.submitData.agencyPurchase.billpermitid = this.selectedBasChargeAgency.perimitguid
          this.submitData.agencyPurchase.creator = this.userInfo.name
          this.submitData.agencyPurchase.modifier = null
          this.submitData.agencyPurchase.operator = this.userInfo.name
          this.submitData.agencyPurchase.payinagencyid = this.selectedBasChargeAgency.agencyid
          this.submitData.agencyPurchase.requestdate = this.form.requestdate
          this.submitData.agencyPurchase.year = this.userInfo.year
          this.submitData.bilAgencyPurchaseDetails.bilAgencyPurchaseDetail = JSON.parse(JSON.stringify(this.tableData))
          deleteJsonKey(this.submitData.bilAgencyPurchaseDetails.bilAgencyPurchaseDetail, 'guid')
          // 主表也不要guid，为什么不早说呢  o(╥﹏╥)o
          delete this.submitData.agencyPurchase.guid
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

            this.form.receipno = res.data.agencyPurchase.receipNo
            this.submitData.agencyPurchase = JSON.parse(JSON.stringify(res.data.agencyPurchase))
            // 坑爹的命名。
            this.submitData.agencyPurchase.receipno = res.data.agencyPurchase.receipNo
            // 进入下一步待审状态。
            this.$store.dispatch('SetToolBarState', 3)
            // 设置修改标记为真，表示保存成功，现在只能进行修改而不是新增。
            this.$store.dispatch('SetUpdateMark', true)
            console.log('收到的编号是', res.data.agencyPurchase.receipNo)
          }).catch(err => { console.log(err) })
        }
      }
      console.log('点击保存之后，当前submitData数据为', this.submitData)
    },

    // 删除
    expurgate() {
    },
    // 库存票据
    getBillInfo: pjyw.getBillInfo,
    // 执收单位
    getBasChargeagency: pjyw.getBasChargeagency,
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
      this.getBillInfo(this.selectedBasChargeAgency).then(res => {
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
    // 选择执收单位
    basChargeAgencySelect(datas) {
      this.chargeAgencyName = datas.currentRow.agencyname
      this.selectedBasChargeAgency = datas.currentRow
      // 每次重新选择执收单位，需要清空tabledata中的数据
      this.tableData = []
    },
    // 选择票证种类信息
    basBillInfoSelect(datas) {
      this.$set(datas.currentRow, 'counts', 1)
      this.$set(datas.currentRow, 'num', datas.currentRow.counts * datas.currentRow.portions)
      this.$set(datas.currentRow, 'checkcount', 1)
      this.$set(datas.currentRow, 'checknumber', datas.currentRow.checkcount * datas.currentRow.portions)

      datas.currentRow.counts = 1
      datas.currentRow.checkcount = 1
      datas.currentRow.num = datas.currentRow.portions
      datas.currentRow.checknumber = datas.currentRow.portions

      datas.currentRow.billid = datas.currentRow.guid
      datas.currentRow.agebcypurchaseid = null
      datas.currentRow.operator = this.userInfo.name
      delete datas.currentRow.guid

      var rowdata = datas.currentRow
      var finditem = this.tableData.find((item) => {
        return item.billid === rowdata.guid
      })
      if (finditem) {
        // 先判断是否有该guid存在。
        this.$message.error('该票种已存在，请不要重复添加')
      } else if (this.currentRow !== null) {
        // 当前行不为空，则是修改。
        var findex = this.tableData.findIndex((item) => {
          return item === this.currentRow
        })
        this.tableData.splice(findex, 1, rowdata)
      } else {
        // 当前行为空，是增加。
        this.tableData.push(rowdata)
      }
    },
    billAddDelete() {
      this.$confirm('您确定要删除单据编码为【' + this.submitData.agencyPurchase.receipno + '】的业务单据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete(this.submitData.agencyPurchase.guid).then(res => {
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
    // width: fit-content;
  }
}
</style>


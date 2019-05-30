<template>
  <div>
    <el-dialog :visible.sync="dialogTableVisible" :title="title" :close-on-click-modal="false" :before-close="returnDefault" width="80%">
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
          <el-col :span="6">
            <el-form-item label="合同号">
              <el-input v-model="form.agreement" >
                <span slot="suffix" class="required">*</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="交货日期">
              <el-date-picker v-model="form.deliverydate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd hh:mm:ss"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-form-item label="委托单位">
                <el-input v-model="form.accredit" placeholder="请输入委托单位">
                  <span slot="suffix" class="required">*</span>
                </el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="承印单位">
                <el-input v-model="printUnit" placeholder="请输入承印单位">
                  <el-button slot="append" icon="el-icon-caret-bottom" @click="showStorage()" />
                  <span slot="suffix" class="required">*</span>
                </el-input>
              </el-form-item>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea"/>
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
            <el-table-column width="100" show-overflow-tooltip sortable prop="billcode" label="票据编码" />
            <el-table-column show-overflow-tooltip sortable prop="billname" label="票据名称" width="240"/>
            <el-table-column prop="track" show-overflow-tooltip sortable label="字轨" width="100">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.track" size="mini" />
                </div>
                <p v-else>{{ scope.row.track }}</p>
              </template>
            </el-table-column>
            <el-table-column width="150" prop="startnumber" show-overflow-tooltip sortable label="起始号码">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-changeStartNumberNoLimitByNum="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.startnumber" size="mini"/>
                </div>
                <p v-else>{{ scope.row.startnumber }}</p>
              </template>
            </el-table-column>
            <el-table-column width="150" prop="endnumber" show-overflow-tooltip sortable label="终止号码">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-changeEndNumberNoLimitByNum="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.endnumber" size="mini" />
                </div>
                <p v-else>{{ scope.row.endnumber }}</p>
              </template>
            </el-table-column>
            <el-table-column width="120" prop="num" show-overflow-tooltip sortable label="份数">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-changeInventoryNoLimitByNum="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.num" size="mini" />
                </div>
                <p v-else>{{ scope.row.num }}</p>
              </template>
            </el-table-column>
            <el-table-column width="120" prop="counts" show-overflow-tooltip sortable label="本数">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-changeCountsNoLimitByNum="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.counts" size="mini" />
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
            <el-table-column width="120" prop="amount" show-overflow-tooltip sortable label="金额"/>
            <el-table-column width="140" show-overflow-tooltip sortable prop="pricingmet" label="计价方式" />
            <el-table-column width="120" prop="remark" show-overflow-tooltip sortable label="备注">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.remark" size="mini" />
                </div>
                <p v-else>{{ scope.row.remark }}</p>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>

      </div>

    </el-dialog>
    <!-- 请选择承印单位 -->
    <layer ref="layer2" :tb-head="basBillPrintingHead" :form="basBillPrintingForm" :table-data="basBillPrintingTableList" title="请选择印刷厂" @select="basBillPrintingSelect" />
    <!-- 请选择票证种类信息 -->
    <layer ref="layer3" :tb-head="basBillinfoHead" :form="basBillinfoForm" :table-data="basBillInfoTableList" title="请选择票证种类信息" @select="basBillInfoSelect" />

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
  props: {
    // 表单数据
    form: {
      type: Object,
      default: function() {
        return {
          // date: new Date(),STORAGEDATE
          storagedate: new Date(), // 业务日期
          deliverydate: new Date(), // 交货日期
          receipno: '', // 单据编码
          operator: '', // 制单人
          delivered: '', // 送审人
          reviewer: '', // 审核人
          attn: '', // 经手人
          agreement: ''// 合同号
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
      clientButnsArray: ['billClose', 'billAdd', 'billAddUpdate', 'billAddDelete', 'billSave', 'billAbolish', 'billAddAudit', 'billAddUnaudit', 'tablePrintPreview', 'print', 'set', 'export'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      auditOpinion: '通过',
      audioForm: {
        auditdate: new Date(),
        reviewer: ''
      },
      submitData: {
        'adviceNote': {
          'guid': null, // 新增的时候为空，修改的时候由外面的主表带进来
          'accredit': null, // ----是否已制证x
          'admdivcode': null, // 根据登陆时候用户信息获取
          'agreement': '', // ----合同号码  form.agreement
          'auditdate': null, // 审核日期，但是这里应该由后端自动生成。
          'auditmark': 0, // 审核标志，0为未审核，1为已审核。
          'businessowner': '', // ----业务负责人  busleader
          'carrytype': 0, // 直接填0，结转需要的，代表是否正常业务。
          'createdate': null, // 创建时间，后台生成，设null
          'creator': null, // 新增操作时，记录的用户的用户名称，根据登陆时候用户信息获取
          'deliverydate': null, //
          'entrustagency': 'string', //  ----交货日期 form.deliverydate
          'payinagencyid': null, // 单位的guid，选择单位的时候传进来。在承印单位数据中。
          'modifier': null, // 修改人，新增为空，修改，送审，审核，反审核时为用户名。
          'modifydate': null, // 修改时间，同上时间。
          'operator': null, // 操作员，即用户信名，任何操作时，记录用户名。
          'printingid': '', // ----印刷厂编码GUID   guid
          'receipNo': null, // 单据编码，后台生成，新增时为null，修改的时候由后台传。
          'remark': null, // 这里没有备注，就null
          'reviewer': null, // 审核人，非审核操作为null，审核时候为用户名。
          'storagedate': null, // form.storagedate
          'storeid': 'string', // ----来源仓库编码GUID storageid
          'year': null// 根据登陆时候用户信息获取
        },
        'bilAdviceNoteDetails': {
          'bilAdviceNoteDetail': [
            // {
            //   'admdivcode': 'string', //
            //   'advicenoteid': 'string',
            //   'amount': 0,
            //   'billid': 'string', //
            //   'counts': 0, //
            //   'createdate': '2019-04-10T09:31:04.606Z', //
            //   'creator': 'string', //
            //   'endnumber': 'string',
            //   'guid': 'string', //
            //   'modifier': 'string', //
            //   'modifydate': '2019-04-10T09:31:04.606Z', //
            //   'num': 0, //
            //   'operator': 'string', //
            //   'price': 0,
            //   'receipNo': 'string', //
            //   'remark': 'string', //
            //   'startnumber': 'string',
            //   'track': 'string',
            //   'year': 'string'//
            // }
          ]
        }
      },
      // 添加的勾选项
      addSelect: [],
      // 当前从下拉列表中选中的承印单位集合
      selectedBasBillPrintingList: {},
      // 当前表格选择项
      currentRow: {},
      // 组件是否显示
      dialogTableVisible: false,
      // 内层审核dialog是否显示
      dialogAudit: false,
      // 承印单位显示名
      printUnit: '',
      // 表格数据
      tableData: [],
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
      basBillinfoForm: {
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
            val: '成本价格',
            key: ''
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
      // 承印单位
      basBillPrintingTableList: [],
      // 票证种类信息
      basBillInfoTableList: [],
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

      basBillinfoHead: [
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
          prop: '',
          label: '成交价格'
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
    printUnit(newValue) {
      if (!newValue) {
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
    // // 票种
    // this.ticketList().then(res => {
    //   res.data
    // })
    // 承印单位
    this.getBasBillprinting().then(res => {
      console.log(res)
      this.basBillPrintingTableList = res.data
    })
  },
  mounted() {
    // this.$refs.layer2.setCurrentRow(this.basBillPrintingTableList[0])
  },
  methods: {
    // 反审函数,type=1
    unaudit() {
      var guid = this.submitData.adviceNote.guid
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
      var guid = this.submitData.adviceNote.guid
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

    // 审核
    billAddAudit() {
      this.passAudit()
    },
    // 修改其实只是回到了待添加状态。
    update() {
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
      if (this.tableData.length === 0) {
        this.$message.error('请先添加详细数据！')
        return
      }
      if (!this.form.agreement) {
        this.$message.error('合同号不能为空！')
        return
      }
      if (!this.form.accredit) {
        this.$message.error('委托单位不能为空！')
        return
      }
      if (!this.printUnit) {
        this.$message.error('承印单位不能为空！')
        return
      }
      if (this.updateMark) {
        // 修改保存状态
        this.submitData.adviceNote.modifier = this.userInfo.name
        this.submitData.adviceNote.operator = this.userInfo.name
        this.submitData.adviceNote.receipNo = this.form.receipno
        // 修改保存时，也要以当前tableData中的数据为准。
        this.submitData.bilAdviceNoteDetails.bilAdviceNoteDetail = JSON.parse(JSON.stringify(this.tableData))
        // deleteJsonKey(this.submitData.bilAdviceNoteDetails.bilAdviceNoteDetail, 'guid')
        this.updateSave(JSON.stringify(this.submitData)).then(res => {
          // console.log(res)
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
      } else {
        // 添加保存状态
        // 保存和修改转json
        this.submitData.adviceNote.agreement = this.form.agreement
        this.submitData.adviceNote.businessowner = this.selectedBasBillPrintingList.busleader
        this.submitData.adviceNote.entrustagency = this.form.deliverydate
        this.submitData.adviceNote.printingid = this.selectedBasBillPrintingList.guid
        this.submitData.adviceNote.remark = this.form.remark
        this.submitData.adviceNote.agreement = this.form.agreement
        this.submitData.adviceNote.storagedate = this.form.storagedate

        this.submitData.adviceNote.admdivcode = this.userInfo.admdivcode
        this.submitData.adviceNote.attn = this.form.attn
        this.submitData.adviceNote.creator = this.userInfo.name
        this.submitData.adviceNote.modifier = null
        this.submitData.adviceNote.operator = this.userInfo.name
        // this.submitData.adviceNote.storagedate = this.form.storagedate
        this.submitData.adviceNote.deliverydate = this.form.deliverydate
        this.submitData.adviceNote.year = this.userInfo.year
        this.submitData.bilAdviceNoteDetails.bilAdviceNoteDetail = JSON.parse(JSON.stringify(this.tableData))
        deleteJsonKey(this.submitData.bilAdviceNoteDetails.bilAdviceNoteDetail, 'guid')
        // 主表也不要guid，为什么不早说呢  o(╥﹏╥)o
        delete this.submitData.adviceNote.guid
        // 进行保存，进入待送审核状态。
        // 调用保存api
        this.addSave(JSON.stringify(this.submitData)).then(res => {
          console.log(res)
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
          // 将服务器返回的数据，再次存回表单。因为有些数据是服务器端返回的。
          // this.tableData.forEach((item, i) => {
          //   Object.assign(item, res.data.bilAgencyPurchaseDetails.bilAgencyPurchaseDetail[i])
          //   console.log(item)
          // })
          this.form.receipno = res.data.adviceNote.receipNo
          this.submitData.adviceNote = JSON.parse(JSON.stringify(res.data.adviceNote))
          this.submitData.adviceNote.receipno = res.data.adviceNote.receipNo
          // 进入下一步待审核状态。
          this.$store.dispatch('SetToolBarState', 3)
          // 设置修改标记为真，表示保存成功，现在只能进行修改而不是新增。
          this.$store.dispatch('SetUpdateMark', true)
          console.log('收到的编号是', res.data.adviceNote.receipNo)
        }).catch(err => { console.log(err) })
      }
      console.log('点击保存之后，当前submitData数据为', this.submitData)
    },
    // 票证种类信息
    getBasBillinfo: pjyw.getBasBillinfo,
    // 票种
    // ticketList: pjyw.ticketList,
    // 承印单位
    getBasBillprinting: pjyw.getBasBillprinting,
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
    addModification() {
      if (this.selectedBasBillPrintingList.guid === undefined) {
        this.$message.error('请先选择承印单位！')
        return
      }
      this.getBasBillinfo().then(res => {
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

    showStorage() {
      this.$refs.layer2.dialogTableVisible = true
      Bus.$emit('setSelectedRow')
    },
    // 选择承印单位
    basBillPrintingSelect(datas) {
      console.log(datas.currentRow)
      // printingid / printingname
      this.printUnit = datas.currentRow.printingname
      this.selectedBasBillPrintingList = datas.currentRow
      // 每次重新选择承印单位，需要清空tabledata中的数据
      this.tableData = []
    },
    // 选择票证种类信息
    basBillInfoSelect(datas) {
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
        // var finditem = this.tableData.find((item) => {
        //   return item.billid === rowdata.billid
        // })
        // if (finditem) {
        // // 先判断是否有该guid存在。
        //   // this.$message.error('该票种已存在，请不要重复添加')
        // } else
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
      console.log('要删除的数据guid是', this.submitData.adviceNote.guid)
      console.log('要删除的编号是', this.submitData.adviceNote.receipno)
      this.$confirm('您确定要删除单据编码为【' + this.submitData.adviceNote.receipno + '】的业务单据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete(this.submitData.adviceNote.guid).then(res => {
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
.required{
  color: red
}
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


<template>
  <div>
    <el-dialog :visible.sync="dialogTableVisible" :title="title" :close-on-click-modal="false" :before-close="returnDefault" width="80%">
      <toolBar :client-butns-array="clientButnsArray" />
      <!-- 筛选表单 -->
      <h1 class="title">{{ title }}</h1>
      <el-form ref="form" :disabled="toolBarState!==1" :model="form" size="mini" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="业务日期">
              <el-date-picker v-model="form.repealdate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd hh:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编码">
              <el-input v-model="form.receipno" disabled clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="票据仓库">
              <!-- 0=0 -->
              <el-input v-model="backBillStorageName" placeholder="请选择票据仓库">
                <el-button slot="append" icon="el-icon-caret-bottom" @click="showBackBillStorage()" />
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
            <el-form-item label="审核人">
              <el-input v-model="form.reviewer" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="经手人">
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
            <el-table-column width="80" show-overflow-tooltip sortable type="index">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-button v-if="Object.keys(scope.row).length !==0" size="mini" type="primary" plain @click="addModification(scope.$index, scope.row)">{{ scope.$index + 1 }} 修改</el-button>
                  <el-button v-else size="mini" type="primary" @click="addModification(scope.$index, scope.row)">添加</el-button>
                </div>
                <p v-else>{{ scope.$index + 1 }}</p>
              </template>
            </el-table-column>
            <el-table-column width="100" prop="billcode" show-overflow-tooltip sortable label="票据编码" />
            <el-table-column width="200" prop="billname" show-overflow-tooltip sortable label="票据名称" />
            <el-table-column prop="track" show-overflow-tooltip sortable label="字轨"/>
            <el-table-column width="150" prop="startnumber" show-overflow-tooltip sortable label="起始号码">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-changeStartNumberByNum="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.startnumber" size="mini" @change="changeStartnumber(scope)" />
                </div>
                <p v-else>{{ scope.row.startnumber }}</p>
              </template>
            </el-table-column>
            <el-table-column width="150" prop="endnumber" show-overflow-tooltip sortable label="终止号码">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-changeEndNumberByNum="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.endnumber" size="mini" @change="changeEndnumber(scope)" />
                </div>
                <p v-else>{{ scope.row.endnumber }}</p>
              </template>
            </el-table-column>
            <el-table-column width="120" show-overflow-tooltip sortable prop="num" label="份数">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-changeInventoryByNum="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.num" size="mini" @change="changeNum(scope)" />
                </div>
                <p v-else>{{ scope.row.num }}</p>
              </template>
            </el-table-column>
            <el-table-column width="120" show-overflow-tooltip sortable prop="counts" label="本数">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-changeCountsByNum="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.counts" size="mini" @change="changeCounts(scope)" />
                </div>
                <p v-else>{{ scope.row.counts }}</p>
              </template>
            </el-table-column>
            <el-table-column width="120" show-overflow-tooltip sortable prop="price" label="单价">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-change-price="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.price" size="mini" @change="changePrice(scope)" />
                </div>
                <p v-else>{{ scope.row.price }}</p>
              </template>
            </el-table-column>
            <el-table-column width="120" prop="amount" show-overflow-tooltip sortable label="金额"/>
            <!-- c端这里计价方式根本无法修改成功 -->
            <el-table-column width="120" prop="pricingmet" show-overflow-tooltip sortable label="计价方式"/>
            <el-table-column prop="portions" show-overflow-tooltip sortable label="每本份数" />
          </el-table>
        </el-scrollbar>
      </div>
    </el-dialog>
    <!-- 请选择票据仓库 -->
    <layer ref="layer2" :tb-head="basBillStorageHead" :form="basBillStorageForm" :table-data="basBillStorageTableList" title="请选择票据仓库" @select="basBillStorageSelect" />
    <!-- 请选择库存票据 -->
    <layer ref="layer3" :tb-head="queryBillStoreFinanceHead" :form="queryBillStoreFinanceForm" :table-data="queryBillStoreFinanceTableList" title="请选择库存票据" @select="queryBillStoreFinanceSelect" />

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
          // date: new Date(),
          repealdate: new Date(), // 业务日期
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
      clientButnsArray: ['billClose', 'billAdd', 'billAddUpdate', 'billAddDelete', 'billSave', 'billAbolish', 'billAddAudit', 'billAddUnaudit', 'tablePrintPreview', 'print', 'set', 'export'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      auditOpinion: '通过',
      audioForm: {
        auditdate: new Date(),
        reviewer: ''
      },
      // 修改和新增等操作时，需要提交的数据项。
      submitData: {
        repeal: {
          'admdivcode': null, // 根据登陆时候用户信息获取
          'approvaldate': null, // 送审的时候才需要传递，值为送审时候的时间。但是这里应该由后端自动生成。
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
          'repealdate': null, // 废止时间。
          'remark': null, // 这里没有备注，就null
          'reviewer': null, // 审核人，非审核操作为null，审核时候为用户名。
          'reviewerinfo': null, // 本页面填空null
          'year': null, // 根据登陆时候用户信息获取
          'storeid': null
        }, bilRepealDetails: { bilRepealDetail: [] }
      },
      // 添加的勾选项
      addSelect: [],
      selectedBasChargeAgency: {},
      // 当前表格选择项
      currentRow: {},
      // 组件是否显示
      dialogTableVisible: false,
      // 内层审核dialog是否显示
      dialogAudit: false,
      // 表单数据
      backBillStorageName: '',
      // 表格数据
      tableData: [],
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
      queryBillStoreFinanceForm: {
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
            val: '金额',
            key: 'amount'
          },
          {
            val: '计价方式',
            key: 'pricingmet'
          },
          {
            val: '票号',
            key: ''
          }
        ],
        equal: ''
      },
      // 票据仓库
      basBillStorageTableList: [],
      // 票证种类信息
      queryBillStoreFinanceTableList: [],
      // 请选择票据仓库信息表头
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

      queryBillStoreFinanceHead: [
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
          prop: 'amount',
          label: '金额'
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
      updateMark: state => state.pjyw.updateMark
    })

  },
  watch: {
    // storageWarehouse发生改变storageWarehouse为空storageWarehouse也清空
    backBillStorageName(n) {
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
    // 获取票据仓库数据
    this.getBasBillstorage().then(res => {
      this.basBillStorageTableList = res.data
    })
  },
  mounted() {
    // this.$refs.layer2.setCurrentRow(this.basBillStorageTableList[0])
  },
  methods: {
    // 反审函数,type=1
    unaudit() {
      var guid = this.submitData.repeal.guid
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
      var guid = this.submitData.repeal.guid
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
      this.passAudit()
    },
    // 修改其实只是回到了待添加状态。
    update() {
      console.log('现在里面的编号是', this.form.receipno)
      this.$store.dispatch('SetToolBarState', 1)
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
    // // num,counts,checknumber,checkcount 联动
    // changeNum(scope) {
    //   scope.row.counts = scope.row.num / scope.row.portions
    //   scope.row.checknumber = scope.row.num
    //   scope.row.checkcount = scope.row.counts
    // },
    // changeCounts(scope) {
    //   scope.row.num = scope.row.counts * scope.row.portions
    //   scope.row.checknumber = scope.row.num
    //   scope.row.checkcount = scope.row.counts
    // },
    // changeChecknumber(scope) {
    //   scope.row.checkcount = scope.row.checknumber / scope.row.portions
    // },
    // changeCheckcount(scope) {
    //   scope.row.checknumber = scope.row.checkcount * scope.row.portions
    // },
    changeStartnumber(scope) { },
    changeEndnumber(scope) { },
    changeNum(scope) { },
    changeCounts(scope) { },
    changePrice(scope) { },
    changeAmount(scope) { },

    // 编辑单元格
    cell(row, column, cell, event, $index) {
    },
    // 保存....................
    // 保存分为2种，一种是添加保存，一种是修改保存。
    save() {
      console.log('点击保存时,待提交的数据为', this.submitData)
      if (this.updateMark) {
        // 修改保存状态
        console.log('现在是修改保存状态')
        this.submitData.repeal.modifier = this.userInfo.name
        this.submitData.repeal.operator = this.userInfo.name
        // 命名不规范，开发泪两行，找的我好苦。
        this.submitData.repeal.receipNo = this.form.receipno
        // 修改保存时，也要以当前tableData中的数据为准。
        this.submitData.bilRepealDetails.bilRepealDetail = JSON.parse(JSON.stringify(this.tableData))
        // deleteJsonKey(this.submitData.bilRepealDetails.bilRepealDetail, 'guid')
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
          // 进入下一步待审状态。
          // 非送审修改时，则进入待审状态。
          this.$store.dispatch('SetToolBarState', 2)
          // this.submitData.repeal.approvalmark = 1
        }).catch(err => {
          console.log('接口返回错误信息', err)
        })
      } else {
        // 添加保存状态
        if (this.tableData.length === 0) {
          this.$message.error('请添加详细数据！')
        } else {
          // 保存和修改转json
          this.submitData.repeal.admdivcode = this.userInfo.admdivcode
          this.submitData.repeal.attn = this.form.attn
          this.submitData.repeal.creator = this.userInfo.name
          this.submitData.repeal.modifier = null
          this.submitData.repeal.operator = this.userInfo.name

          this.submitData.repeal.storeid = this.selectedBasChargeAgency.guid

          // this.submitData.repeal.billpermitid = this.selectedBasChargeAgency.perimitguid
          // this.submitData.repeal.payinagencyid = this.selectedBasChargeAgency.agencyid

          // 时间这里改下字段。
          this.submitData.repeal.repealdate = this.form.repealdate

          this.submitData.repeal.year = this.userInfo.year
          this.submitData.bilRepealDetails.bilRepealDetail = JSON.parse(JSON.stringify(this.tableData))
          deleteJsonKey(this.submitData.bilRepealDetails.bilRepealDetail, 'guid')
          // 主表也不要guid，为什么不早说呢  o(╥﹏╥)o
          delete this.submitData.repeal.guid
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
            this.form.receipno = res.data.repeal.receipNo
            this.submitData.repeal = JSON.parse(JSON.stringify(res.data.repeal))
            // 坑爹的命名。
            this.submitData.repeal.receipno = res.data.repeal.receipNo
            // 进入下一步待审状态。
            this.$store.dispatch('SetToolBarState', 3)
            // 设置修改标记为真，表示保存成功，现在只能进行修改而不是新增。
            this.$store.dispatch('SetUpdateMark', true)
            console.log('收到的编号是', res.data.repeal.receipNo)
          }).catch(err => { console.log(err) })
        }
      }
      console.log('点击保存之后，当前submitData数据为', this.submitData)
    },

    // 删除
    expurgate() {

    },
    // 库存票据
    getQueryBillStoreFinance: pjyw.getQueryBillStoreFinance,
    // 票据仓库
    getBasBillstorage: pjyw.getBasBillstorage,
    // 增加保存。
    addSave: pjyw.addSave,
    // 修改保存。
    updateSave: pjyw.updateSave,
    // add页面主表数据删除
    delete: pjyw.delete,
    // 审核，退回，反审，3个api公用。
    // 0通过，1反审。
    billAudit: pjyw.billAudit,
    // 添加修改
    addModification() {
      if (!this.backBillStorageName) {
        this.$message.error('请您先选择票据仓库')
        return
      }
      this.getQueryBillStoreFinance(this.selectedBasChargeAgency.guid).then(res => {
        // 改为弹出层里面的table-data的字段
        console.log('收到的库存票据信息为：', res)
        this.queryBillStoreFinanceTableList = res.data
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
    showBackBillStorage() {
      this.$refs.layer2.dialogTableVisible = true
      Bus.$emit('setSelectedRow')
    },
    // 选择后 监听数据
    // 选择票据仓库
    basBillStorageSelect(datas) {
      console.log('选择的票据仓库数据为', datas)
      this.backBillStorageName = datas.currentRow.storagename
      this.selectedBasChargeAgency = datas.currentRow
      // 每次重新选择执收单位，需要清空tabledata中的数据
      this.tableData = []
    },
    // 选择票证种类信息
    queryBillStoreFinanceSelect(datas) {
      // datas.currentRow.agebcypurchaseid = null
      // datas.currentRow.operator = this.userInfo.name
      // var rowdata = datas.currentRow

      // var rowUniqueNumber = rowdata.billid + rowdata.startnumber
      // var finditem = this.tableData.find((item) => {
      //   var tableItemUniqueNumber = item.billid + item.startnumber
      //   return tableItemUniqueNumber === rowUniqueNumber
      // })

      // // 待会改去重
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
      // delete datas.currentRow.guid

      // 如果选择的是inventory，而服务器传的又是num，那么需要手动赋值num
      this.$set(datas.currentRow, 'num', datas.currentRow.inventory)
      // datas.currentRow.billid = datas.currentRow.billid
      // 该业务不用覆盖billid
      datas.currentRow.agebcypurchaseid = null
      datas.currentRow.operator = this.userInfo.name
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
        console.log('相同列表数组为：', sameBillIdItemList)
        if (+datas.currentRow.checkmark === 1) {
          sameBillIdItemList.sort((a, b) => cutoffCheckMark(a.startnumber) - cutoffCheckMark(b.startnumber))
          console.log('排序完成')
        } else {
          sameBillIdItemList.sort((a, b) => a.startnumber - b.startnumber)
          console.log('排序完成')
        }
        var restNumberArray = getRestNumberArray(sameBillIdItemList, datas.currentRow.startnumber, datas.currentRow.endnumber, datas.currentRow.checkmark)
        console.log('剩余项数组为：', restNumberArray)
        if (restNumberArray.length === 0) {
          Bus.$emit('billNumberOutRange', `该票种下的号段已经全部添加！请检查！`)
          return
        }
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
          console.log('123', rowdata.guid)
          delete rowdata.guid
          this.tableData.splice(findex, 1, rowdata)
        } else {
          // 当前行为空，是增加。
          console.log('123', rowdata.guid)
          delete rowdata.guid
          this.tableData.push(rowdata)
          // this.notUpdate = true
        }
      }
    },
    billAddDelete() {
      console.log('要删除的数据guid是', this.submitData.repeal.guid)
      console.log('要删除的编号是', this.submitData.repeal.receipno)
      this.$confirm('您确定要删除单据编码为【' + this.submitData.repeal.receipno + '】的业务单据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete(this.submitData.repeal.guid).then(res => {
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


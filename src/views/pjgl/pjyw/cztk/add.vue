<template>
  <div>
    <el-dialog :visible.sync="dialogTableVisible" :title="title" :close-on-click-modal="false" :before-close="returnDefault" width="80%">
      <toolBar :client-butns-array="clientButnsArray" />
      <!-- 筛选表单 -->
      <h1 class="title">{{ title }}</h1>
      <el-form ref="form" :model="form" size="mini" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="业务日期">
              <el-date-picker v-model="form.storagedate" type="date" placeholder="选择日期" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编码">
              <el-input v-model="form.receipno" disabled clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="票据仓库">
              <el-input v-model="storageWarehouse" clearable placeholder="请输入票据仓库">
                <el-button slot="append" icon="el-icon-caret-bottom" @click="showStorage()" />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col v-if="toolBarState===1" :span="3">
            <el-button size="mini" type="danger" @click="deleteSelected()">删除所选</el-button>
          </el-col>
          <el-col :span="7">
            <el-form-item label="制单人">
              <el-input v-model="form.operator" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="送审人">
              <el-input v-model="form.delivered" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="审核人">
              <el-input v-model="form.reviewer" disabled/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <!-- 显示表格 -->
      <div class="wrap-add">
        <el-scrollbar style="height:100%;width:100%;">
          <el-table :data="tableData.concat({})" highlight-current-row border style="width: 100%" @selection-change="handleSelectionChange" @current-change="handleCurrentChange" @cell-dblclick="cell" @row-dblclick="elect">
            <el-table-column type="selection" width="30" />
            <el-table-column width="80" type="index">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-button v-if="Object.keys(scope.row).length !==0" size="mini" type="primary" plain @click="addModification(scope.$index, scope.row)">{{ scope.$index + 1 }} 修改</el-button>
                  <el-button v-else size="mini" type="primary" @click="addModification(scope.$index, scope.row)">添加</el-button>
                </div>
                <p v-else>{{ scope.$index + 1 }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="billcode" label="票据编号" />
            <el-table-column prop="billname" label="票据名称" />
            <el-table-column prop="track" label="字轨">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.track" size="mini" />
                </div>
                <p v-else>{{ scope.row.track }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="startnumber" width="110" label="起始号码">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.startnumber" size="mini" @change="changeStartnumber(scope)" />
                </div>
                <p v-else>{{ scope.row.startnumber }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="endnumber" width="110" label="终止号码">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.endnumber" size="mini" @change="changeEndnumber(scope)" />
                </div>
                <p v-else>{{ scope.row.endnumber }}</p>
              </template>

            </el-table-column>
            <el-table-column prop="inventory" width="90" label="份数">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.inventory" size="mini" @change="changeInventory(scope)" />
                </div>
                <p v-else>{{ scope.row.inventory }}</p>
              </template>

            </el-table-column>
            <el-table-column prop="counts" label="本数">

              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.portions" size="mini" />
                </div>
                <p v-else>{{ scope.row.portions }}</p>
              </template>

            </el-table-column>
            <el-table-column prop="price" label="单价" />
            <el-table-column prop="amount" label="金额" />
            <el-table-column prop="pricingmet" label="计价方式">

              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.entryvalue" size="mini" />
                </div>
                <p v-else>{{ scope.row.entryvalue }}</p>
              </template>

            </el-table-column>
            <el-table-column prop="portions" label="每本份数" />
          </el-table>
        </el-scrollbar>
      </div>

    </el-dialog>

    <layer ref="layer2" :tb-head="tbHead" :form="formStorage" :table-data="storage" title="请选择票据仓库" @select="storagegetSelect" />
    <!-- 请选择库存票据 -->
    <layer ref="layer3" :tb-head="repertoryHead" :form="formRepertory" :table-data="repertory" title="请选择库存票据" @select="repertorySelect" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Bus from '@/utils/Bus'
import layer from '@/components/layer'
import pjyw from '@/api/pjgl/pjyw/pjyw.js'
import toolBar from '@/components/toolBar'
import request from '@/utils/request'

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
          date: new Date(),
          storagedate: '', // 业务日期
          receipno: '', // 单据编码
          operator: '', // 制单人
          delivered: '', // 送审人
          reviewer: '' // 审核人
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
      clientButnsArray: ['billClose', 'billAdd', 'billAddUpdate', 'billDelete', 'billSave', 'billAbolish', 'billAddSendAudit', 'billAddAudit', 'billAddUnaudit', 'tablePrintPreview', 'print', 'set', 'export'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。

      // 添加的勾选项
      addSelect: [],
      // 当前选择票据仓库集合
      storageCurrent: [],
      // 当前表格选择项
      currentRow: {},
      // 组件是否显示
      dialogTableVisible: false,
      // 表单数据
      storageWarehouse: '',
      // form: {
      //   date: new Date(),
      //   billsCoding: '',
      //   storageType: 0,
      //   printingUnit: '',

      //   remark: '',
      //   prepared: '',
      //   auditor: '',
      //   handle: ''
      // },
      // 表格数据
      tableData: [],
      // 请选择印刷厂,请选择票据仓库,请选择票证种类信息表单数据
      formStorage: {
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
      formRepertory: {
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
            key: 'inventory'
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
          }
        ],
        equal: ''
      },
      // 仓库
      storage: [],
      // 库存票据
      repertory: [],
      // 请选择印刷厂,请选择票据仓库,请选择票证种类信息表头数据
      tbHead: [
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

      repertoryHead: [
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
      toolBarState: state => state.pjyw.toolBarState
    })
  },
  watch: {
    // storageWarehouse发生改变storageWarehouse为空storageWarehouse也清空
    storageWarehouse(n) {
      if (!n) {
        // this.form.= ''
      }
    }
  },
  created() {
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
      this.sendAudit()
    })
    Bus.$off('billAddUnaudit')
    Bus.$on('billAddUnaudit', () => {
      this.unaudit()
    })
    Bus.$off('billAddAudit')
    Bus.$on('billAddAudit', () => {
      this.audit()
    })
    // // 票种
    // this.ticketList().then(res => {
    //   res.data
    // })
    // 仓库
    this.getBasBillstorage().then(res => {
      console.log('收到的仓库信息为', res.data)
      this.storage = res.data
    })
  },
  methods: {
    unaudit() {
      console.log('反审核')
      // 这里反审核接口api
      // 这里反审核接口api
      // 这里反审核接口api
      this.$store.dispatch('SetToolBarState', 3)
    },
    audit() {
      console.log('审核')
      // 这里审核接口api
      // 这里审核接口api
      // 这里审核接口api
      this.$store.dispatch('SetToolBarState', 4)
    },
    sendAudit() {
      this.$store.dispatch('SetToolBarState', 3)
      // 这里调用送审接口api
      // 这里调用送审接口api
      // 这里调用送审接口api
      request({
        url: '/bill/synBilRefund/sendAudit',
        methods: 'post'
        // params
      }).then(res => {

      }).catch(err => { console.log(err) })

      // api调通之后要放到then里面
      this.$alert('送审成功！', {
        center: true,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        callback: action => {
        }
      })
    },
    // 修改其实只是回到了待添加状态。
    update() {
      this.$store.dispatch('SetToolBarState', 1)
    },
    // 恢复默认状态
    returnDefault(done) {
      this.$store.dispatch('SetToolBarState', 0)
      done()
    },

    // startnumber endnumber inventory 联动
    changeStartnumber(scope) {
      scope.row.inventory = scope.row.endnumber - scope.row.startnumber + 1
      scope.row.amount = scope.row.inventory * scope.row.price
    },
    changeEndnumber(scope) {
      scope.row.inventory = scope.row.endnumber - scope.row.startnumber + 1
      scope.row.amount = scope.row.inventory * scope.row.price
    },
    changeInventory(scope) {
      scope.row.endnumber = parseInt(scope.row.inventory) + parseInt(scope.row.startnumber) - 1
      scope.row.amount = scope.row.inventory * scope.row.price
    },
    // 编辑单元格
    cell(row, column, cell, event, $index) {
      // console.log(cell.children[0].children[0].children[0].removeAttribute('disabled'))
    },
    // 保存....................
    save() {
      if (this.tableData.length === 0) {
        this.$alert('请添加详细数据！', {
          center: true,
          closeOnClickModal: true,
          closeOnPressEscape: true,
          callback: action => {
          }
        })
      } else {
        // 进行保存，进入待送审核状态。
        // 调用保存api
        // 调用保存api
        // 调用保存api
        // var data = { agencyPurchase: {
        //   'admdivcode': null,
        //   'approvaldate': null,
        //   'approvalmark': null,
        //   'attn': null,
        //   'auditOpinion': null,
        //   'auditdate': null,
        //   'auditmark': null,
        //   'billpermitid': null,
        //   'carrytype': null,
        //   'createdate': null,
        //   'creator': null,
        //   'delivered': null,
        //   'guid': null,
        //   'mark': null,
        //   'modifier': null,
        //   'modifydate': null,
        //   'operator': null,
        //   'payinagencyid': null,
        //   'personnel': null,
        //   'receipNo': null,
        //   'releasedate': null,
        //   'remark': null,
        //   'requestdate': null,
        //   'reviewer': null,
        //   'reviewerinfo': null,
        //   'year': null
        // }, bilAgencyPurchaseDetails: { bilAgencyPurchaseDetail: [
        //   {
        //     'admdivcode': null,
        //     'agebcypurchaseid': null,
        //     'billid': null,
        //     'checkcount': null,
        //     'checknumber': null,
        //     'counts': null,
        //     'createdate': null,
        //     'creator': null,
        //     'guid': null,
        //     'modifier': null,
        //     'modifydate': null,
        //     'num': null,
        //     'operator': null,
        //     'receipNo': null,
        //     'remark': null,
        //     'year': null
        //   }
        // ] }}

        this.$store.dispatch('SetToolBarState', 2)
        console.log(this.currentRow)
      }
    },
    // 关闭添加
    close() {
      this.dialogTableVisible = false
    },
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
    // 库存票据
    getQueryBillStoreFinance: pjyw.getQueryBillStoreFinance,
    // 票种
    // ticketList: pjyw.ticketList,
    // 仓库
    getBasBillstorage: pjyw.getBasBillstorage,
    // 添加修改
    addModification() {
      if (!this.storageWarehouse) {
        this.$message.error('请您先选择仓库')
        return
      }
      this.getQueryBillStoreFinance(this.storageCurrent.guid).then(res => {
        console.log('财政库数据为：', res.data)
        this.repertory = res.data.data
        // console.log(res.data.data)
        this.$refs.layer3.dialogTableVisible = true
      })
    },
    // 表格添加，修改
    elect(row, event, column) {
      // // 是否点击表最右边单元
      // if (column.label) {
      //   return
      // }
      // if (!this.storageWarehouse) {
      //   this.$message.error('请您先选择仓库')
      //   return
      // }
      // this.getQueryBillStoreFinance(this.storageCurrent.guid).then(res => {
      //   this.repertory = res.data.data
      //   // console.log(res.data.data)
      //   this.$refs.layer3.dialogTableVisible = true
      // })
    },
    // 表格行选择设置
    handleCurrentChange(val) {
      this.currentRow = val
      console.log(this.currentRow)
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
      this.dialogTableVisible = false
      this.$store.dispatch('SetToolBarState', 0)
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
    // 请输入入库仓库框
    showStorage() {
      this.$refs.layer2.dialogTableVisible = true
    },
    // 选择后 监听数据
    // 请选择票据仓库
    storagegetSelect(datas) {
      this.storageWarehouse = datas.currentRow.storagename
      this.storageCurrent = datas.currentRow
    },
    // 库存票据
    repertorySelect(datas) {
      var rowdata = datas.currentRow
      if (this.currentRow !== null) { // 修改当前行
        var findex = this.tableData.findIndex((item) => {
          return item === this.currentRow
        })
        this.tableData.splice(findex, 1, rowdata)
      } else { // 添加新行
        var finditem = this.tableData.find((item) => {
          return item.guid === rowdata.guid
        })
        if (!finditem) {
          this.tableData.push(rowdata)
        } else {
          this.$message.error('已存在，请勿重复选择')
        }
      }
      console.log('tableData的数据是：', this.tableData)
    }
    // getSelect(datas) {
    //   console.log(datas.currentRow)
    //   if (datas.title === '请选择印刷厂') { // 请选择印刷厂框的数据
    //     this.form.printingUnit = datas.currentRow.date
    //   } else if (datas.title === '请选择票据仓库') { // 请选择请选择票据仓库的数据
    //     this.form.storageWarehouse = datas.currentRow.storagename
    //     this.form.storageWarehouse = datas.currentRow.date
    //   } else if (datas.title === '请选择票证种类信息') { // 请选择票证种类信息框的数据 =>表格
    //     var rowdata = datas.currentRow
    //     if (Object.keys(this.currentRow).length) { // 修改当前行
    //       var findex = this.tableData.findIndex((item) => {
    //         return item === this.currentRow
    //       })
    //       this.tableData.splice(findex, 1, rowdata)
    //     } else { // 添加新行
    //       this.tableData.push(rowdata)
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
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
.title {
  height: 40px;
  line-height: 40px;
  text-decoration: underline;
  font-size: 20px;
  text-align: center;
  font-weight: 700;
}
</style>


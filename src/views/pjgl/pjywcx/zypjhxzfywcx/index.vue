<!-- zypjhxzfywcx 专用票据核销（作废）业务查询 -->
<template>
  <el-scrollbar style="height:100%;width:100%;">
    <div class="pjyztzs">
      <toolBar :client-butns-array="clientButnsArray" />
      <h1>票据核销业务查询</h1>
      <!-- 上表 -->
      <el-form ref="form" :model="form" size="mini" label-width="80px">
        <el-row>
          <el-col :span="2">
            <el-form-item label-width="20px" label="">
              <el-checkbox-group v-model="form.isdate" @change="isdateChange">
                <el-checkbox label="日期" name="type"/>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="" label-width="0px">
              <el-date-picker
                :disabled="!form.isdate"
                v-model="form.startVerificDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item label="至" label-width="40px"/>
          </el-col>
          <el-col :span="3">
            <el-form-item label="" label-width="0px">
              <el-date-picker
                :disabled="!form.isdate"
                v-model="form.endVerificDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="20px" label="">
              <el-radio-group v-model="form.type">
                <el-radio :label="1">明细</el-radio>
                <el-radio :label="2">汇总</el-radio>
                <el-radio :label="3">明细及明细</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="单位名称">
              <el-input
                v-model="printingname"
                clearable
                placeholder="请输入单位名称" >
                <el-button slot="append" icon="el-icon-caret-bottom" @click="showdwmc()"/>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="票据名称">
              <el-input
                v-model="billname"
                clearable
                placeholder="请输入票据名称" >
                <el-button slot="append" icon="el-icon-caret-bottom" @click="showpjmc()"/>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-row>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="onSubmit">查找</el-button>
            </el-form-item>
          </el-col>
        </el-row> -->
        <!-- 分页 -->
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
      </el-form>

      <!-- 下表格 -->
      <div class="wrap-box wrap">
        <el-scrollbar style="height:100%;width:100%;">
          <el-table
            ref="singleTable"
            :data="tableData"
            border
            style="width: 100%"
            highlight-current-row
            @row-dblclick = "dbRow"
            @current-change="handleCurrentChangeIndex">
            <el-table-column
              type="index"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="agencycode"
              show-overflow-tooltip
              label="执收单位编码"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="170"
              prop="agencyname"
              show-overflow-tooltip
              label="执收单位名称"/>
            <!-- <el-table-column
              prop="auditmark"
              label="审核状态">
              <template slot-scope="scope">
                {{ scope.row.auditmark | markFilter }}
              </template>
            </el-table-column> -->
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="billcode"
              show-overflow-tooltip
              label="票据编码"/>
            <el-table-column
              prop="billname"
              sortable
              header-align="center"
              align="center"
              width="170"
              show-overflow-tooltip
              label="票据名称"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="track"
              show-overflow-tooltip
              label="字轨"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="startnumber"
              show-overflow-tooltip
              label="起始号码"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="endnumber"
              show-overflow-tooltip
              label="终止号码"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="num"
              show-overflow-tooltip
              label="份数"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="counts"
              show-overflow-tooltip
              label="本数"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="price"
              show-overflow-tooltip
              label="单价"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="amount"
              show-overflow-tooltip
              label="金额"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="auditdate"
              show-overflow-tooltip
              label="审核日期"/>
          </el-table>
        </el-scrollbar>
      </div>

      <!-- 单位名称层 -->
      <layer ref="layer" @select="selectdwmc"/>
      <!-- 票据名称层 -->
      <layer1 ref="layer1" @select="selectpjmc"/>

      <!-- 添加对话框 -->
      <add ref="layerAdd"/>

      <tablePrintSet :print-data="listPrintData" :template-data="templateDataList" :form-print-data="formPrintData"/>

    </div>
  </el-scrollbar>
</template>

<script>
import toolBar from '@/components/toolBar'
import Bus from '@/utils/Bus'
import layer from '@/components/pjglLayer/dwmcLayer'
import layer1 from '@/components/pjglLayer/pjmcLayer'
import pjywcx from '@/api/pjgl/pjywcx/pjywcx.js'
import add from './add'
import tablePrintSet from '@/components/tablePrintSet' // add
import { getPrintTemplateData, savePrintTemplateData } from '@/api/webPrint' // add

export default {
  components: {
    tablePrintSet, // 表格打印设置组件。add

    toolBar, // 上方工具条栏
    layer,
    layer1,
    add
  },
  data() {
    return {
      templateInitData: { //  add
        // return {
        guid: '',
        userid: null,
        templatecontent: {
          title: `${this.$route.meta.title}`,
          direction: 1,
          printHeadHeight: 50, // 打印头部区域的高度，单位mm
          printHead: [
          ],
          tableHead: [
            { text: '执收单位名称', key: 'agencyname', width: '200', checked: true },
            { text: '执收单位编码', key: 'agencycode', width: '90', checked: true },
            { text: '票据编号', key: 'billcode', width: '180', checked: true },
            { text: '票据名称', key: 'billname', width: '280', checked: true },
            { text: '字轨', key: 'track', width: '180', checked: true },
            { text: '起始号码', key: 'startnumber', width: '180', checked: true },
            { text: '终止号码', key: 'endnumber', width: '180', checked: true },
            { text: '份数', key: 'num', width: '90', checked: true },
            { text: '本数', key: 'counts', width: '90', checked: true },
            { text: '金额', key: 'amount', width: '90', checked: true }
          ],
          printFoot: [
          ]
        },
        isdefault: 1, // 是否现在使用的模板
        templatecode: this.$route.path,
        templatename: `标准模板（${this.$route.meta.title}）`,
        isstandardtemplage: 1 // 是否标准模板
        // }
      },
      templateDataList: [], //  add
      listPrintData: [], //  add 打印数据列表，只有在点击打印，预览，导出，设置时才加载。

      // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      clientButnsArray: ['close', 'clear', 'refresh1', 'listPreview', 'listPrint', 'listSet', 'listExport'],

      // 单位名称   关联id
      printingname: '',
      // 票据名称名称  关联id
      billname: '',
      // 表单数据
      form: {
        // 提交数据
        billId: '',
        endVerificDate: '',
        pageIndex: 1,
        pageSize: 10,
        agencyId: '',
        startVerificDate: '',
        type: 1,

        // 是否开启日期
        isdate: false,
        // 总条数
        totalCount: 0
      },
      // 当前表格数据
      tableData: [],
      // 当前表格选择项
      currentRow: {}
    }
  },

  computed: {
    formPrintData() {
      return [
        { text: '单位名称', value: this.printingname, checked: true },
        { text: '票据名称', value: this.billname, checked: true },

        { text: '制表人', value: this.$store.state.user.name, checked: true },
        // { text: '筛选条件值', value: this.form.filterValue, checked: false },
        { text: '终止日期', value: this.form.endDate, checked: true },
        { text: '字轨', value: this.form.track, checked: false },
        // { text: '筛选条件', value: this.form.filterName, checked: true },
        { text: '起始日期', value: this.form.startDate, checked: true }
      ]
    }
  },

  watch: {
    // 单位名称 关联id printingname为空printingId也清空
    printingname(n) {
      if (!n) {
        this.form.agencyId = ''
      }
    },
    // 票据名称 关联id billname为空billId也清空
    billname(n) {
      if (!n) {
        this.form.billId = ''
      }
    }
  },

  created() {
    Bus.$off('listExport')
    Bus.$on('listExport', () => {
      this.getPrintList().then(res => {
        Bus.$emit('tablePrintExport')
      })
    })
    Bus.$off('listPreview')
    Bus.$on('listPreview', () => {
      this.getPrintList().then(res => {
        console.log('收到了要打印的数据，马上调用打印预览。')
        Bus.$emit('tablePrintPreview')
      })
    })
    Bus.$off('listPrint')
    Bus.$on('listPrint', () => {
      this.getPrintList().then(res => {
        Bus.$emit('tablePrint')
      })
    })
    Bus.$off('listSet')
    Bus.$on('listSet', () => {
      console.log('查看当前应用模板', this.templateDataList)
      console.log(this.form)
      console.log(this.templateInitData)
      this.getPrintList().then(res => {
        Bus.$emit('tablePrintSet')
      })
    })

    // Bus.$off('getPrintList')
    // Bus.$on('getPrintList', () => {
    //   this.getPrintList()
    // })
    // 组件创建时，立即获取打印模板数据。
    this.getPrintData()// add

    // 清除
    Bus.$off('clear')
    Bus.$on('clear', () => {
      this.clear()
    })
    // 刷新
    Bus.$off('refresh1')
    Bus.$on('refresh1', () => {
      this.form.pageIndex = 1
      this.onSubmit()
    })
    // 初次进入设置第一行为选中行
    this.$store.dispatch('SetCurrentRowIndex', 0)
    // 获取当前表格数据
    this.getBillInfoList(this.form)
  },

  methods: {

    getPrintData() { //  add
      var templateCode = this.$route.path
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
    getPrintList() {
      return new Promise((resolve, reject) => {
        this.getListPrintData(this.form).then(res => {
          this.listPrintData = res.data.data
          resolve(res)
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      })
    },
    // 获取打印列表数据
    getListPrintData: pjywcx.getListPrintData,

    // 单位名称选择后监听
    selectdwmc(val) {
      console.log('单位名称选择数据', val)
      this.form.agencyId = val.currentRow.guid
      this.printingname = val.currentRow.agencyname
    },
    // 票据名称选择后监听
    selectpjmc(val) {
      console.log(' 票据名称选择数据', val)
      this.form.billId = val.currentRow.guid
      this.billname = val.currentRow.billname
    },
    // 单位名称
    showdwmc() {
      this.$refs.layer.dialogTableVisible = true
    },
    // 显示票据名称层
    showpjmc() {
      this.$refs.layer1.dialogTableVisible = true
    },
    // 双击参看
    dbRow() {
      if (this.currentRow.guid === null) {
        return
      }
      this.getBillInfoguid(this.currentRow.guid).then(res => {
        console.log(JSON.stringify(res.data))
        this.$refs.layerAdd.getdata = res.data
        this.$refs.layerAdd.index = -1
        this.$refs.layerAdd.dialogTableVisible = true
        if (this.$refs.layerAdd.$refs.clearDetail) {
          this.$refs.layerAdd.$refs.clearDetail.clearSort()
        }
        if (this.$refs.layerAdd.$refs.clearDetail2) {
          this.$refs.layerAdd.$refs.clearDetail2.clearSort()
        }
        if (this.$refs.layerAdd.$refs.clearDetail3) {
          this.$refs.layerAdd.$refs.clearDetail3.clearSort()
        }
      })
    },
    // 表格行选择设置
    handleCurrentChangeIndex(val) {
      // 记录选中行数。
      var i = this.tableData.findIndex(item => {
        return item === val
      })
      i = i >= 0 ? i : 0
      this.$store.dispatch('SetCurrentRowIndex', i)

      this.currentRow = val === null ? {} : val
    },
    // 关闭返回首页
    close() {
      var status = this.$store.getters.savestate
      if (status === 0) {
        this.$router.push('/')
        this.$message({
          showClose: true,
          message: '回到首页',
          type: 'success'
        })
      } else {
        return
      }
    },
    // 清除重置
    clear() {
      // 印刷厂名称   关联id
      this.printingname = ''
      // 票据名称名称  关联id
      this.billname = ''
      // 表单数据
      this.form.billId = ''
      this.form.endVerificDate = ''
      this.form.startVerificDate = ''
      this.form.agencyId = ''
      this.form.isdate = false
    },
    // 获取表格数据方法
    getBillInfoList: pjywcx.getBillInfoList,
    // 查看表格一行对应数据方法
    getBillInfoguid: pjywcx.getBillInfoguid,
    // 日期框是否开启-设置起始和终止时间
    isdateChange(val) {
      if (val) {
        var time = new Date()
        this.form.startVerificDate = `${time.getFullYear()}-${time.getMonth() + 1}-1`
        // 设置当前时间
        this.form.endVerificDate = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
      } else {
        this.form.startVerificDate = ''
        this.form.endVerificDate = ''
      }
    },
    // 当前表格查找 ==> 筛选按钮
    onSubmit() {
      this.getBillInfoList(this.form)
    },
    // 当前表格 页条数改变
    handleSizeChange(val) {
      this.form.pageSize = val
      this.getBillInfoList(this.form)
    },
    // 当前表格 页码改变 翻页
    handleCurrentChange(val) {
      this.form.pageIndex = val
      this.getBillInfoList(this.form)
    }
  }
}

</script>
<style lang="scss" scoped>
.el-scrollbar__view{
  height: 100%;
}
.toolbar {
  font-size: 12px;
  $toolba-bg: #fff;
  height: 50px;
  background: $toolba-bg;
  border-bottom: 1px solid #9bbce8;
  ul {
    display: flex;
    height: 100%;
    li {
      background: $toolba-bg;
      cursor: pointer;
      display: flex;
      min-width: 70px;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      border-right: 1px solid #f2f2f2;
      span {
        width: 30px;
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        text-align: center;
        margin-top: 2px;
      }
    }
    .no-border {
      border: 0 none;
    }
    .dis-tap {
      color: #8b8588;
      cursor: not-allowed;
    }
  }
}
.view{
  height: 100%;
}
</style>

<style rel='stylesheet/scss' lang='scss' scoped>
.pjyztzs{
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
    // margin-bottom: 20px;
  }
  .wrap-box{
    flex: 1;
    padding: 5px;
    height: 200px;
}
}
</style>


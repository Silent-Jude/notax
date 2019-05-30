<!-- 领销记录打印模板 -->
<template>
  <!-- <div :class="{hidden:!recordPrintDialog}"> -->
  <el-dialog :visible.sync="recordPrintDialog" :close-on-press-escape="false" :close-on-click-modal="false" :modal="false" :class="{hidden:!recordPrintDialogHandClick}" class="appleer" center width="80%" title="请选择打印模板">
    <div :class="{none:updateState}" class="template-wrap">
      <div class="template-list">
        <el-radio v-for="(item,i) of templateList" :key="i" :value="employTemplateData.templatename" :label="item.templatename" class="template-item" @click.native.prevent="selectedTemplate(item,$event)">
          <div class="template-label">
            <span>
              {{ item.templatename }}
            </span>
            <span class="el-icon-edit" @click="modifyTitle(item)">修改名称</span>
          </div>
        </el-radio>
      </div>
      <div class="toolbar">
        <ul class="button-group">
          <li>
            <el-button type="primary" size="mini" plain @click="query">
              设为默认
            </el-button>
          </li>
          <li>
            <el-button type="primary" size="mini" plain @click="add">
              增加模板
            </el-button>
          </li>
          <li>
            <el-button type="primary" size="mini" plain @click="update">
              修改模板
            </el-button>
          </li>
          <li>
            <el-button type="primary" size="mini" plain @click="remove">
              删除模板
            </el-button>
          </li>
          <li>
            <el-button type="primary" size="mini" plain @click="exit">
              退出选择
            </el-button>
          </li>
        </ul>
      </div>
    </div>
    <el-dialog :modal="false" :close-on-press-escape="false" :class="{hidden:!recordPrintDialogHandClick}" :visible.sync="templateUpdateDialog" :close-on-click-modal="false" append-to-body width="95%">
      <!-- <div :class="{none:!(updateState && printContentType === 'billProject')}" class="bill-template-wrap"> -->
      <div class="set-template-wrap">
        <el-row class="first-row">
          <el-col :span="4" class="">
            <span>上页最大打印行数</span>
            <el-input v-model.trim.number="employTemplateData.templatecontent.upwardMaxLineNumber" size="mini" class="line-number" />
          </el-col>
          <el-col :span="4">
            <span>下页最大打印行数</span>
            <el-input v-model.trim.number="employTemplateData.templatecontent.downMaxLineNumber" size="mini" class="line-width" />
          </el-col>
          <el-col :span="7">
            <span>单行打印区的高度（单位：毫米）</span>
            <el-input v-model.trim.number="employTemplateData.templatecontent.lineHeight" size="mini" class="line-height" />
          </el-col>
          <el-col :span="9">
            <span>上页和下页之间的空白高度（单位：毫米）</span>
            <el-input v-model.trim.number="employTemplateData.templatecontent.restHeight" size="mini" class="line-height" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <span>打印字体大小</span>
            <el-input v-model.trim.number="employTemplateData.templatecontent.fontSize" size="mini" class="font-size" />
            <span>（字体过小时可能无法获取正确预览结果。）</span>
          </el-col>
          <el-col :span="12">
            <span>请设置文本对齐方式：</span>
            <el-button-group>
              <el-button type="primary" plain size="mini" icon="el-icon-arrow-left" @click="employTemplateData.templatecontent.textAlign='left'">左对齐</el-button>
              <el-button type="primary" plain size="mini" icon="el-icon-share" @click="employTemplateData.templatecontent.textAlign='center'">居中</el-button>
              <el-button type="primary" plain size="mini" icon="el-icon-arrow-right" @click="employTemplateData.templatecontent.textAlign='right'">右对齐</el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </div>
      <el-scrollbar style="height:100%;width:100%;">
        <div class="thead-control">
          <table :style="`text-align:${employTemplateData.templatecontent.textAlign};font-size:${employTemplateData.templatecontent.fontSize}px;width:${totalTableWidth}mm;margin:0 auto;border-width: 1px;border-style: solid;border-collapse: collapse`" class="print-table">
            <thead>
              <tr>
                <!-- v-dragging="{item:item,list:checkedTableHead,group:'tbHead'}"  -->
                <th v-for="(item,i) in checkedTableHead" :key="i" :style="`text-align:${employTemplateData.templatecontent.textAlign};white-space:nowrap;overflow:hidden;word-break:keep-all;width:${item.width}mm;height:${employTemplateData.templatecontent.lineHeight}mm;border-width: 1px;border-style: solid;border-collapse: collapse`">{{ item.text }}</th>
              </tr>
            </thead>
          </table>
          <printItemControl v-if="employTemplateData" :template-data="employTemplateData.templatecontent.tableHead" class="print-table-control">
            <template slot="title">
              <div> | </div>
              <div>列宽 </div>
            </template>
            <template slot-scope="{ item }">
              |
              <el-input v-model="item.width" size="mini" type="text" class="input-width" />
            </template>
          </printItemControl>
        </div>
      </el-scrollbar>
      <!-- 非常重要的打印数据html模板 -->
      <div ref="printTable" class="preview">
        <table :style="`table-layout:fixed;border-collapse:collapse;text-align:${employTemplateData.templatecontent.textAlign};font-size:${employTemplateData.templatecontent.fontSize}px;width:${totalTableWidth}mm;height:${totalTableHeight}mm;margin:0 auto;border:none;box-sizing:border-box`" class="preview-table">
          <template v-for="count in printCount">
            <tr v-for="upwardItem in employTemplateData.templatecontent.upwardMaxLineNumber" :key=" upwardItem+(count-1)*totalLineNum">
              <td v-for="(col,i) of checkedTableHead" :key="'col-'+i" :style="`text-align:${employTemplateData.templatecontent.textAlign};white-space:nowrap;overflow:hidden;word-break:keep-all;width:${col.width}mm;height:${employTemplateData.templatecontent.lineHeight}mm;border:none;box-sizing:border-box;`" >
                {{ tableContent(upwardItem+(count-1)*totalLineNum)[col.key] }}
              </td>
            </tr>
            <tr :key="count+'middleEmpty'">
              <td :style="`width:${totalTableWidth}mm;height:${employTemplateData.templatecontent.restHeight}mm;border:none;box-sizing:border-box;`"/>
            </tr>
            <tr v-for="downItem in employTemplateData.templatecontent.downMaxLineNumber" :key=" downItem+employTemplateData.templatecontent.upwardMaxLineNumber+(count-1)*totalLineNum">
              <td v-for="(col,i) of checkedTableHead" :key="'col-'+i" :style="`text-align:${employTemplateData.templatecontent.textAlign};white-space:nowrap;overflow:hidden;word-break:keep-all;width:${col.width}mm;height:${employTemplateData.templatecontent.lineHeight}mm;border:none;box-sizing:border-box;`" >
                {{ tableContent(downItem+employTemplateData.templatecontent.upwardMaxLineNumber+(count-1)*totalLineNum)[col.key] }}
              </td>
            </tr>
          </template>
        </table>
      </div>
      <!-- <div>{{totalTableWidth}}</div> -->
      <!-- <div v-if="(tablePrintRowNum+startLineNum)>totalLineNum" style="text-align:center">...</div> -->
      <div class="footer">
        <!-- <el-button size="mini" @click="checkState">测试</el-button> -->
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirm">确 定</el-button>
      </div>
      <!-- </div> -->
    </el-dialog>

  </el-dialog>
  <!-- </div> -->

</template>

<script>
import { savePrintTemplateData, removePrintTemplateData } from '@/api/webPrint'
import printItemControl from '@/components/tablePrintSet/printItemControl'
import { getLodop } from '@/assets/LodopFuncsNew' // 导入模块
import Bus from '@/utils/Bus'
import pjyw from '@/api/pjgl/pjyw/pjyw.js'

export default {
  components: {
    printItemControl //  表头宽度和顺序控制器。
  },
  props: {
    tablePrintData: { //  表格打印数据。
      type: Array,
      default() {
        return []
      }
    },
    startLineNum: { //  开始行号。
      type: Number,
      default() {
        return 1
      }
    },
    templateList: { //  模板列表
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      printMessageDialog: false,
      isExist: 0, //  当前任务是否还在打印队列中，1在，0不在
      totalPrintCount: 0, //  总共打印页数。
      currentPageCount: 0, //  当前任务已经打印的页数。
      isPrintedOk: 0, // 当前打印任务是否成功，1成功，0不成功
      printTaskId: null, //  当前打印任务的编码jobid
      recordPrintDialogHandClick: false,
      LODOP: null,
      // alwaysTrue: true,
      templateUpdateDialog: true,
      updateState: false,
      recordPrintDialog: true
    }
  },

  computed: {
    employTemplateData: { // 当前应用模板
      get() {
        var target = this.templateList.find(item => item.isdefault === 1)
        if (!target) {
          target = this.templateList.find(item => item.isstandardtemplage === 1)
        }
        if (target) {
          if (typeof (target.templatecontent) === 'string') {
            target.templatecontent = JSON.parse(target.templatecontent)
          }
          // target.templatecontent.printHead = JSON.parse(JSON.stringify(this.formPrintData))
          // target.templatecontent.printFoot = JSON.parse(JSON.stringify(this.formPrintData))
          return target
        } else {
          console.log('看看此时的templatelist到底是什么？', this.templateList)
          return {
            templatecontent: {
              upwardMaxLineNumber: 1,
              downMaxLineNumber: 1
            }
          }
        }
      },
      set(val) {
        return val
      }
    },
    tablePrintRowNum() {
      return this.tablePrintData.length
    },
    totalLineNum() {
      return this.employTemplateData.templatecontent.upwardMaxLineNumber + this.employTemplateData.templatecontent.downMaxLineNumber
    },
    checkedTableHead() {
      if (this.employTemplateData.templatecontent.tableHead) {
        return this.employTemplateData.templatecontent.tableHead.filter(item => item.checked)
      }
    },
    totalTableWidth() {
      if (this.employTemplateData.templatecontent.tableHead) {
        return this.checkedTableHead.reduce((prev, item) => prev + +item.width, 0)
      }
    },
    totalTableHeight() {
      return this.employTemplateData.templatecontent.lineHeight * this.totalLineNum + this.employTemplateData.templatecontent.restHeight
    },
    firstPagePrintCount() { //  首页需要打印的项条数
      if (this.tablePrintRowNum + this.startLineNum - 1 >= this.totalLineNum) {
        return this.totalLineNum - this.startLineNum + 1
      } else {
        return this.tablePrintRowNum
      }
    },
    printCount() { //  需要的打印页数
      return Math.ceil((this.tablePrintRowNum + (this.startLineNum - 1)) / this.totalLineNum)
    },
    lastPagePrintCount() { //  最后一页需要打印的项条数。
      return (this.tablePrintRowNum + (this.startLineNum - 1)) % this.totalLineNum
    },
    // 顶部的 上方空白行数。
    upwardBlankNumTop() {
      if (this.startLineNum > this.employTemplateData.templatecontent.upwardMaxLineNumber) {
        return this.employTemplateData.templatecontent.upwardMaxLineNumber
      } else {
        return this.startLineNum - 1
      }
    },
    // 首页上方打印数据列表。
    upwardPrintData() {
      var endIndex = 0
      // if(startLineNum > this.employTemplateData.templatecontent.upwardMaxLineNumber) {
      //   endIndex = 0
      // }
      if (this.startLineNum > this.employTemplateData.templatecontent.upwardMaxLineNumber) {
        endIndex = 0
      } else {
        if (this.tablePrintRowNum + this.startLineNum - 1 <= this.employTemplateData.templatecontent.upwardMaxLineNumber) {
          endIndex = this.tablePrintRowNum
        } else {
          endIndex = this.employTemplateData.templatecontent.upwardMaxLineNumber - this.upwardBlankNumTop
        }
      }
      return this.tablePrintData.slice(0, endIndex)
    },
    // 上方的底部空白行数。
    upwardBlankNumBottom() {
      if (this.upwardMaxLineNumber - (this.startLineNum + this.tablePrintRowNum - 1) >= 0) {
        return this.upwardMaxLineNumber - (this.startLineNum + this.tablePrintRowNum - 1)
      } else {
        return 0
      }
    },
    //  下方的顶部空白
    downwardBlankNumTop() {
      if (this.startLineNum - this.employTemplateData.templatecontent.upwardMaxLineNumber - 1 >= 0) {
        return this.startLineNum - this.employTemplateData.templatecontent.upwardMaxLineNumber - 1
      } else {
        return 0
      }
    },
    // 下方打印数据列表。
    downwardPrintData() {
      var endIndex = this.tablePrintRowNum
      var restLength = this.tablePrintRowNum - this.upwardPrintData.length
      var startIndex = endIndex - restLength
      return this.tablePrintData.slice(startIndex, endIndex)
    },
    //  下方的底部空白
    downwardBlankNumBottom() {
      if (this.employTemplateData.templatecontent.downMaxLineNumber - (this.startLineNum + this.tablePrintRowNum - this.employTemplateData.templatecontent.upwardMaxLineNumber - 1) >= 0) {
        return this.employTemplateData.templatecontent.downMaxLineNumber - (this.startLineNum + this.tablePrintRowNum - this.employTemplateData.templatecontent.upwardMaxLineNumber - 1)
      } else {
        return 0
      }
    }

  },

  watch: {
    // isPrintedOk(newVal, oldVal) {
    //   console.log('改变了')
    //   if (newVal === 0) {
    //     console.log('弹窗了啊')
    //     this.printMessageDialog = true
    //     this.$alert(`正在打印第${this.currentPageCount}页。。。,总共有${this.totalPrintCount}页`, {
    //       center: true,
    //       closeOnClickModal: true,
    //       closeOnPressEscape: true,
    //       callback: action => {
    //       }
    //     })
    //   }
    // }
  },

  created() {
    Bus.$off('recordPrint')
    Bus.$on('recordPrint', () => {
      this.recordPrint()
    })
    console.log('recordPrint数据加载完成，')
    Bus.$off('recordPreview')
    Bus.$on('recordPreview', () => {
      this.recordPreview()
    })
    Bus.$off('checkState')
    Bus.$on('checkState', () => {
      this.checkState()
    })
  },
  mounted() {
    // this.recordPrintDialog = false
    // this.templateUpdateDialog = false
    console.log('要看数据吗？：', this.printCount, this.employTemplateData.templatecontent.upwardMaxLineNumber, this.employTemplateData.templatecontent.downMaxLineNumber)
  },
  methods: {
    // 保存打印位置数字。
    savePrintPosition: pjyw.savePrintPosition,
    loopCheck() {
      var timer = setInterval(() => {
        this.checkState()
        console.log('进入定时器')
        if (+this.isPrintedOk === 1) {
          this.$alert('打印任务执行成功！已经开始打印！')
          clearInterval(timer)
          console.log('打印结束，', this.lastPagePrintCount + 1)
          Bus.$emit('savePrintPosition', this.lastPagePrintCount + 1)
        }
      }, 2000)
    },
    checkState() {
      // this.LODOP.SET_PRINT_MODE('CATCH_PRINT_STATUS', true)
      var isPrintedOkTaskId = '' //  当前任务是否打印完成
      // var timeTaskId = ''
      // var countTaskId = ''
      // var isexistTaskId = ''
      // var currentPageCountTaskId = '' // 当前打印页数
      this.LODOP.On_Return_Remain = true
      this.LODOP.On_Return = (TaskID, Value) => {
        if (TaskID === isPrintedOkTaskId) {
          console.log('isPrintedOk:' + Value)
          this.isPrintedOk = Value
          this.$store.dispatch('SetIsPrintedOk', Value)
        }
      }
      // countTaskId = this.LODOP.GET_VALUE('PRINT_STATUS_TOTAL_PAGES', this.printTaskId)
      // currentPageCountTaskId = this.LODOP.GET_VALUE('PRINT_STATUS_PAGES_PRINTED', this.printTaskId)
      isPrintedOkTaskId = this.LODOP.GET_VALUE('PRINT_STATUS_OK', this.printTaskId)
      // timeTaskId = this.LODOP.GET_VALUE('PRINT_STATUS_ADDTIME', this.printTaskId)
      // isexistTaskId = this.LODOP.GET_VALUE('PRINT_STATUS_EXIST', this.printTaskId)
    },
    recordPrint() {
      // 载入模板设置。
      this.loadPrintTemplate()
      // 清空回调，避免返回代码。
      if (this.LODOP.CVERSION) {
        this.LODOP.On_Return = (TaskID, Value) => {
          if (Value) {
            this.$message({
              message: '打印任务发送成功！请放入纸张开始打印',
              type: 'success',
              duration: 5000
            })
            this.printTaskId = Value
            // this.printMessageDialog = true
            this.loopCheck()
          }
          // this.checkState()
          // this.$alert(`正在打印第${this.currentPageCount}页。。。,总共有${this.totalPrintCount}页`)
          // var jobId = this.LODOP.GET_VALUE('PRINT_STATUS_JOBID')
          // console.log('任务id为：', jobId)
        }
      }
      // 最后载入参数表单上的数据
      // this.loadPrintData()
      this.isPrintedOk = 0
      console.log('清空打印状态。')
      this.LODOP.PRINTA()
    },
    recordPreview() {
      // 每个点击事件都要获取右侧选择列表。
      // this.getRightSelectedKeys()
      // 载入模板设置。
      this.loadPrintTemplate()
      // 清空回调，避免返回代码。
      if (this.LODOP.CVERSION) {
        this.LODOP.On_Return = null
      }
      // 最后载入数据
      // this.loadPrintData()
      this.LODOP.PREVIEW()
    },
    tableContent(rowIndex, value) {
      if (rowIndex < this.startLineNum) {
        return ''
      } else if (rowIndex >= this.startLineNum && rowIndex < (this.startLineNum + this.tablePrintRowNum)) {
        return this.tablePrintData[rowIndex - this.startLineNum]
      } else {
        return ''
      }
    },
    randomColor() {
      return `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
    },
    evil(fn) {
      const Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
      return new Fn('console.log("函数里的this是",this);' + fn)
    },
    loadPrintTemplate() {
      this.LODOP = getLodop()
      this.LODOP.PRINT_INIT('套打样式初始化设置')
      // 开启项目名控制项目属性值
      this.LODOP.SET_PRINT_MODE('PROGRAM_CONTENT_BYVAR', true)
      // 设置打印维护窗口关闭后是否返回程序代码,否则只返回打印次数
      this.LODOP.SET_PRINT_MODE('PRINT_SETUP_PROGRAM', true)
      this.LODOP.SET_PRINT_MODE('CATCH_PRINT_STATUS', true)
      // this.LODOP.ADD_PRINT_SETUP_BKIMG(`F:\\project\\notax\\src\\assets\\bill\\jks.jpg`)
      // this.LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '205mm')
      // this.LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '102mm')
      // this.LODOP.ADD_PRINT_TABLE(0,0,)
      this.LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', true)
      // vue中禁止使用eval，故此使用自定义evil来模拟eval。
      // 注意这里this的指向问题。
      // 应用来自服务器的处理好的字符串模板
      this.evil(this.employTemplateData.templatecontent.lodopPrintStr).bind(this)()
      // this.rightSelectedData.forEach((item, i) => {
      //   if (!this.employTemplateData.templatecontent.lodopPrintStr.includes(item.label)) {
      //     // 右侧有，打印模板没有。
      //     console.log('有一个右侧有，但是当前打印的字符串中却没有的数据，说明是新增加的。')
      //     this.LODOP.ADD_PRINT_TEXTA(item.label, 350 + 35 * parseInt(i / 6), i % 6 * 100, 80, 24, item.label)
      //   } else {
      //     // 说明右侧有，打印模板中也有。就不做处理。
      //   }
      // })
      // 每次新增表格打印项之前，需要检查一下字符串中是否已经有了表格，有了就不增加，直接替换内容。
      var reg = new RegExp(`<table.*<\/table>`, 'g')
      var tableStr = this.$refs.printTable.innerHTML
      if (!reg.test(this.employTemplateData.templatecontent.lodopPrintStr)) {
        // 没有就增加。
        console.log('没有就增加')
        // if (this.printContentType === 'bill') {
        // tableStr = this.$refs.billPrintTable.innerHTML
        // debug
        this.LODOP.ADD_PRINT_TABLE(100, 100, this.totalTableWidth + 'mm', this.totalTableHeight + 'mm', tableStr)
        // } else {
        // tableStr = this.$refs.projectPrintTable.innerHTML
        // this.LODOP.ADD_PRINT_TABLE(100, 100, this.employTemplateData.templatecontent.billProjectLineWidth + 'mm', this.employTemplateData.templatecontent.billProjectLineHeight * (this.employTemplateData.templatecontent.billProjectLineNumber + 1) + 'mm', tableStr)
        // }
      } else {
        console.log('有表，就替换表的内容，位置不变。')
        // 有表，就替换表的内容，位置不变。
        this.LODOP.SET_PRINT_STYLEA(0, 'CONTENT', tableStr)
        // if (this.printContentType === 'bill') {
        // tableStr = this.$refs.billPrintTable.innerHTML
        // this.LODOP.ADD_PRINT_TABLE(100, 100, this.employTemplateData.templatecontent.lineWidth * 2 + 'mm', this.employTemplateData.templatecontent.lineHeight * (this.employTemplateData.templatecontent.lineNumber + 1) + 'mm', tableStr)
        // this.LODOP.SET_PRINT_STYLEA(0, 'WIDTH', this.employTemplateData.templatecontent.lineWidth + 'mm')
        // this.LODOP.SET_PRINT_STYLEA(0, 'HEIGHT', this.employTemplateData.templatecontent.lineHeight * (this.employTemplateData.templatecontent.lineNumber + 1) + 'mm')
        // } else {
        // tableStr = this.$refs.projectPrintTable.innerHTML
        // this.LODOP.ADD_PRINT_TABLE(100, 100, this.employTemplateData.templatecontent.billProjectLineWidth + 'mm', this.employTemplateData.templatecontent.billProjectLineHeight * (this.employTemplateData.templatecontent.billProjectLineNumber + 1) + 'mm', tableStr)
        this.LODOP.SET_PRINT_STYLEA(0, 'WIDTH', this.totalTableWidth + 'mm')
        // 这个系数非常重要 ，加0.8倍行高+5mm  ，因为lodop的html转打印时，会进行分割判断，所以实际需要的高度大于html文本高度，导致html易被切割到下一页。此系数大约5mm——20mm不被切割，每页12行数据时。
        // 设置border-collapse:collapse之后，比heml高1点即可。
        this.LODOP.SET_PRINT_STYLEA(0, 'HEIGHT', this.totalTableHeight + 1 + 'mm')
        console.log('冲设之后的高度是：', this.totalTableHeight + 1)
        console.log('冲设之后的html高度是：', this.totalTableHeight)
        // }
        // this.employTemplateData.templatecontent.lodopPrintStr = this.employTemplateData.templatecontent.lodopPrintStr.replace(reg,`${tableStr}`)
        // console.log('替换之后的字符串是：',this.employTemplateData.templatecontent.lodopPrintStr)
      }
    },
    // test() { console.log(this.tablePrintData) },
    confirm() {
      this.loadPrintTemplate()
      if (this.LODOP.CVERSION) {
        this.LODOP.On_Return = (TaskID, Value) => {
          var str = Value.replace(/LODOP/ig, 'this.LODOP')
          this.employTemplateData.templatecontent.lodopPrintStr = str
          console.log('关闭设计器之后的回调数据为：', Value)
          this.savePrintData()
          console.log(this.employTemplateData.templatecontent.lodopPrintStr)
        }
      }
      this.LODOP.PRINT_SETUP()
      // 这里打开设计器。
      // this.updateState = false
      this.templateUpdateDialog = false
      // this.recordPrintDialogHandClick = false
    },
    cancel() {
      this.templateUpdateDialog = false
    },
    savePrintData() {
      // var paramsObj = JSON.parse(JSON.stringify(this.employTemplateData))
      // paramsObj.templatecontent = JSON.stringify(paramsObj.templatecontent)
      return new Promise((resolve, reject) => {
        savePrintTemplateData(this.employTemplateData).then(res => {
          this.$alert('当前模板保存成功！', {
            type: 'success',
            center: true,
            closeOnClickModal: true,
            closeOnPressEscape: true,
            callback: action => {
            }
          })
          resolve(res)
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      })
      // this.templateData.splice(this.templateData.length - 1, 1, res.data)
      // this.employTemplateData.guid = res.data.guid
      // this.employTemplateData
    },
    exit() {
      this.recordPrintDialog = false
      this.recordPrintDialogHandClick = false
    },
    remove() {
      removePrintTemplateData(this.employTemplateData.guid).then(res => {
        var targetIndex = this.templateList.findIndex(item => item.guid === this.employTemplateData.guid)
        this.templateList.splice(targetIndex, 1)
        if (targetIndex) {
          this.templateList.find(item => item.isstandardtemplage === 1).isdefault = 1
          // this.getRightSelectedKeys()
        }
        this.$alert('用户模板删除成功！', {
          type: 'success',
          center: true,
          closeOnClickModal: true,
          closeOnPressEscape: true,
          callback: action => {
          }
        })
      }).catch(err => { console.log(err) })
    },
    update() {
      this.templateUpdateDialog = true
      // this.getRightSelectedKeys()
    },
    add() {
      this.$prompt('新输入新模板名称！', '提示', {
        confirmButtonText: '确定新增',
        cancelButtonText: '取消新增',
        inputPattern: /.*[^\s]/,
        inputValidator: val => this.templateList.find(item => item.templatename === val) ? '模板名称不能重复！请检查！' : true,
        closeOnClickModal: false,
        inputErrorMessage: '模板名称不能为空！'
      }).then(({ value }) => {
        const tempObject = JSON.parse(JSON.stringify(this.employTemplateData))
        tempObject.guid = ''
        tempObject.userid = ''
        tempObject.isstandardtemplage = 0
        tempObject.isdefault = 1
        tempObject.userid = ''
        tempObject.templatename = value
        this.employTemplateData.isdefault = 0
        this.templateList.push(tempObject)
        // push之后，employTemplateData就会发生改变
        this.savePrintData().then(res => {
          this.employTemplateData.guid = res.data.guid
          // this.getRightSelectedKeys()
        })
        console.log('新增的时候，看看数据是什么', this.employTemplateData)
      }).catch(() => {
      })
    },
    query() {
      this.savePrintData()
    },
    selectedTemplate(item, event) {
      console.log(item)
      // console.log(event)
      this.templateList.forEach(item => {
        item.isdefault = 0
      })
      item.isdefault = 1
      this.employTemplateData.templatename = item.templatename
    },
    modifyTitle(item) {
      this.$prompt('修改后的模板名称', '提示', {
        confirmButtonText: '确定修改',
        cancelButtonText: '取消修改',
        inputPattern: /.*[^\s]/,
        closeOnClickModal: false,
        inputValidator: val => this.templateList.find(item => item.templatename === val) ? '模板名称不能重复！请检查！' : true,
        inputErrorMessage: '模板名称不能为空！'
      }).then(({ value }) => {
        item.templatename = value
        console.log(this.employTemplateData)
        this.savePrintData()
      }).catch(() => {
      })
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.hidden {
  display: none;
}
.template-wrap {
  display: flex;
  // margin-left:50px;
  // margin-top:100px;
  // transform:translateY(-100%);
  .template-list {
    flex: 0 0 60%;
    border: 1px dashed #66b1ff;
    display: flex;
    flex-direction: column;
    padding-left: 15px;
    padding-top: 15px;
    .el-radio + .el-radio {
      margin: 0;
    }
    .template-item {
      margin-bottom: 10px;
      .template-label {
        width: 300px;
        display: inline-flex;
        justify-content: space-between;
      }
    }
  }
  .toolbar {
    height: 300px;
    flex: 0 0 40%;
    .button-group {
      margin-left: 40px;
      display: flex;
      flex-direction: column;
      li {
        padding-top: 10px;
      }
    }
  }
}
.set-template-wrap {
  // height: 28px;
  // line-height: 28px;
  margin-bottom: 5px;
  .line-number,
  .line-height,
  .font-size,
  .line-width {
    width: 80px;
  }
}
.thead-control {
  height: 370px;
  display: flex;
  flex-flow: nowrap row;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  .input-width {
    width: 70px;
  }
}
.preview {
  display: none;
}
.footer {
  display: flex;
  justify-content: center;
}
.recordPrint{
  display: none
}
.first-row{
  margin-top: 10px
}
</style>

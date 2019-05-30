<!-- 模板设置选择组件。用于套打模板选择。 -->
<template>
  <div :class="{none:!templateSelectDialogVisible}" class="shadow">
    <div class="pjglz-print" >
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
              <el-button type="primary" plain @click="query">
                设为默认
              </el-button>
            </li>
            <li>
              <el-button type="primary" plain @click="add">
                增加模板
              </el-button>
            </li>
            <li>
              <el-button type="primary" plain @click="update">
                修改模板
              </el-button>
            </li>
            <li>
              <el-button type="primary" plain @click="remove">
                删除模板
              </el-button>
            </li>
            <li>
              <el-button type="primary" plain @click="exit">
                退出选择
              </el-button>
            </li>
          </ul>
        </div>
      </div>

      <!-- 双行打印模板预览 -->
      <div :class="{none:!(updateState && printContentType === 'bill')}" class="bill-template-wrap">
        <div class="set-template-wrap">
          <el-row>
            <el-col :span="6" class="">
              <span>请输入最大打印行数</span>
              <el-input v-model.trim.number="employTemplateData.templatecontent.lineNumber" size="mini" class="line-number" />
            </el-col>
            <el-col :span="9">
              <span>请输入单行打印区的高度（单位：毫米）</span>
              <el-input v-model.trim.number="employTemplateData.templatecontent.lineHeight" size="mini" class="line-height" />
            </el-col>
            <el-col :span="9">
              <span>请输入单列打印区的宽度（单位：毫米）</span>
              <el-input v-model.trim.number="employTemplateData.templatecontent.lineWidth" size="mini" class="line-width" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span>请输入打印字体大小</span>
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
        <!-- <el-row>
          <el-col :offset="8" :span="9">
            <span>请输入单列打印区的宽度（单位：毫米）</span>
            <el-input v-model.trim.number="employTemplateData.templatecontent.lineWidth" size="mini" class="line-width" />
          </el-col>
        </el-row> -->
        </div>
        <div ref="billPrintTable" class="preview">
          <!-- ;border-width: 1px;border-style: solid;border-collapse: collapse -->
          <table :style="`table-layout:fixed;text-align:${employTemplateData.templatecontent.textAlign};font-size:${employTemplateData.templatecontent.fontSize}px;width:${employTemplateData.templatecontent.lineWidth*2-1}mm;height:${employTemplateData.templatecontent.lineHeight*employTemplateData.templatecontent.lineNumber-1}mm;margin:0 auto;boder:none`" class="preview-table">
            <!-- 上方空白 -->
            <tr v-for="row in startLineNum-1" :key="'row-'+row">
              <td v-for="col in 2" :key="'col-'+col" :style="`white-space:nowrap;overflow:hidden;word-break:keep-all;width:${employTemplateData.templatecontent.lineWidth}mm;height:${employTemplateData.templatecontent.lineHeight}mm;boder:none;vertical-align:middle;`" />
            </tr>
            <!-- 中间打印内容 -->
            <tr v-for="row in tablePrintRowNum" :class="{none:row+startLineNum>employTemplateData.templatecontent.lineNumber}" :key="'printRow-'+row">
              <template v-if="position === 'left'">
                <td :style="`white-space:nowrap;overflow:hidden;word-break:keep-all;width:${employTemplateData.templatecontent.lineWidth}mm;height:${employTemplateData.templatecontent.lineHeight}mm;boder:none;vertical-align:middle;`">
                  {{ tablePrintData[2*row-2] }}
                </td>
                <td :style="`white-space:nowrap;overflow:hidden;word-break:keep-all;width:${employTemplateData.templatecontent.lineWidth}mm;height:${employTemplateData.templatecontent.lineHeight}mm;boder:none;vertical-align:middle;`">
                  {{ tablePrintData[2*row-1] }}
                </td>
              </template>
              <template v-else>
                <td :style="`white-space:nowrap;overflow:hidden;word-break:keep-all;width:${employTemplateData.templatecontent.lineWidth}mm;height:${employTemplateData.templatecontent.lineHeight}mm;boder:none;vertical-align:middle;`">
                  {{ tablePrintData[2*row-3] }}
                </td>
                <td :style="`white-space:nowrap;overflow:hidden;word-break:keep-all;width:${employTemplateData.templatecontent.lineWidth}mm;height:${employTemplateData.templatecontent.lineHeight}mm;boder:none;vertical-align:middle;`">
                  {{ tablePrintData[2*row-2] }}
                </td>
              </template>
            </tr>
            <!-- 底部空白 -->
            <template v-if="!isNaN(employTemplateData.templatecontent.lineNumber - startLineNum - tablePrintRowNum+1) && (employTemplateData.templatecontent.lineNumber - startLineNum - tablePrintRowNum+1)>=0">
              <tr v-for="row in (employTemplateData.templatecontent.lineNumber - startLineNum - tablePrintRowNum+1)" :key="'restRow-'+row">
                <td v-for="col in 2" :key="'restCol-'+col" :style="`white-space:nowrap;overflow:hidden;word-break:keep-all;width:${employTemplateData.templatecontent.lineWidth}mm;height:${employTemplateData.templatecontent.lineHeight}mm;boder:none;vertical-align:middle;`" />
              </tr>
            </template>
          </table>
        </div>
        <div v-if="(tablePrintRowNum+startLineNum)>employTemplateData.templatecontent.lineNumber" style="text-align:center">...</div>
        <div class="footer">
          <el-button size="mini" @click="cancel">取 消</el-button>
          <el-button size="mini" type="primary" @click="confirm">确 定</el-button>
        </div>
      </div>

      <!-- 单行打印模板预览 -->
      <div :class="{none:!(updateState && printContentType === 'billProject')}" class="bill-template-wrap">
        <div class="set-template-wrap">
          <el-row>
            <el-col :span="6" class="">
              <span>请输入最大打印行数</span>
              <el-input v-model.trim.number="employTemplateData.templatecontent.billProjectLineNumber" size="mini" class="line-number" />
            </el-col>
            <el-col :span="9">
              <span>请输入单行打印区的高度（单位：毫米）</span>
              <el-input v-model.trim.number="employTemplateData.templatecontent.billProjectLineHeight" size="mini" class="line-height" />
            </el-col>
            <el-col :span="9">
              <span>请输入单列打印区的宽度（单位：毫米）</span>
              <el-input v-model.trim.number="employTemplateData.templatecontent.billProjectLineWidth" size="mini" class="line-width" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span>请输入打印字体大小</span>
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
        <div ref="projectPrintTable" class="preview">
          <table :style="`table-layout:fixed;text-align:${employTemplateData.templatecontent.textAlign};font-size:${employTemplateData.templatecontent.fontSize}px;width:${employTemplateData.templatecontent.billProjectLineWidth}mm;height:${employTemplateData.templatecontent.billProjectLineHeight*employTemplateData.templatecontent.billProjectLineNumber-1}mm;margin:0 auto;boder:none`" class="preview-table">
            <tr v-for="row in startLineNum-1" :key="'row-'+row">
              <td v-for="col in 1" :key="'col-'+col" :style="`white-space:nowrap;overflow:hidden;word-break:keep-all;width:${employTemplateData.templatecontent.billProjectLineWidth}mm;height:${employTemplateData.templatecontent.billProjectLineHeight}mm;boder:none;vertical-align:middle;`" />
            </tr>
            <tr v-for="row in tablePrintRowNum" :class="{none:row+startLineNum>employTemplateData.templatecontent.billProjectLineNumber}" :key="'printRow-'+row">
              <template >
                <td :style="`white-space:nowrap;overflow:hidden;word-break:keep-all;width:${employTemplateData.templatecontent.billProjectLineWidth}mm;height:${employTemplateData.templatecontent.billProjectLineHeight}mm;boder:none;vertical-align:middle;`">
                  {{ tablePrintData[row-1] }}
                </td>
              </template>
            </tr>
            <template v-if="!isNaN(employTemplateData.templatecontent.billProjectLineNumber - startLineNum - tablePrintRowNum+1) && (employTemplateData.templatecontent.billProjectLineNumber - startLineNum - tablePrintRowNum+1) >=0 ">
              <!-- {{ employTemplateData.templatecontent.billProjectLineNumber - startLineNum - tablePrintRowNum+1 }} -->
              <tr v-for="row in (employTemplateData.templatecontent.billProjectLineNumber - startLineNum - tablePrintRowNum+1)" :key="'restRow-'+row">
                <td v-for="col in 1" :key="'restCol-'+col" :style="`white-space:nowrap;overflow:hidden;word-break:keep-all;width:${employTemplateData.templatecontent.billProjectLineWidth}mm;height:${employTemplateData.templatecontent.billProjectLineHeight}mm;boder:none;vertical-align:middle;`" />
              </tr>
            <!-- <template/> -->
            </template>
          </table>
        </div>
        <div v-if="(tablePrintRowNum+startLineNum)>employTemplateData.templatecontent.billProjectLineNumber" style="text-align:center">...</div>
        <div class="footer">
          <el-button size="mini" @click="cancel">取 消</el-button>
          <el-button size="mini" type="primary" @click="confirm">确 定</el-button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Bus from '@/utils/Bus'
import { savePrintTemplateData, removePrintTemplateData } from '@/api/webPrint'
import { getLodop } from '@/assets/LodopFuncsNew' // 导入模块

export default {
  components: {
  },
  props: {
    templateList: {
      type: Array,
      default() {
        return []
      }
    },
    formPrintData: {
      type: Array,
      default() {
        return []
      }
    }
    // tablePrintData: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // }
  },
  data() {
    return {
      // employTemplateData.templatecontent.billProjectLineWidth: 180, //  需要服务器记录。
      // employTemplateData.templatecontent.billProjectLineHeight: 8, //  需要服务器记录。
      // employTemplateData.templatecontent.billProjectLineNumber: 12, //  需要服务器记录。
      // employTemplateData.templatecontent.textAlign: 'center', //  需要服务器记录。
      // employTemplateData.templatecontent.fontSize: 14, //  需要服务器记录。
      printContentType: 'bill', // 由用户界面传入，不需要存服务器。
      // employTemplateData.templatecontent.lineWidth: 90, //  需要服务器记录。
      // employTemplateData.templatecontent.lineHeight: 8, //  需要服务器记录。
      // employTemplateData.templatecontent.lineNumber: 12, //  需要服务器记录。
      tablePrintData: [],
      rightSelectedData: [],
      // formPrintData: [],
      startLineNum: 1, // 由用户界面传入，不需要存服务器。
      position: 'left', // 由用户界面传入，不需要存服务器。
      updateState: false,
      // str: '',
      LODOP: '', // 准备用来调用getLodop获取LODOP对象
      // isCurrent: '',
      templateSelectDialogVisible: false
    }
  },
  computed: {
    tablePrintRowNum() {
      console.log('此时的数据是-----', this.tablePrintData)
      console.log('此时的长度是-----', this.tablePrintData.length)
      if (this.printContentType === 'bill') {
        if (this.position === 'left') {
          return Math.ceil(this.tablePrintData.length / 2)
        } else {
          return Math.floor(this.tablePrintData.length / 2) + 1
        }
      } else {
        return this.tablePrintData.length
      }
    },
    printSourceDate() {
      const object = {}
      this.formPrintData.forEach(item => {
        object[item.label] = item.value
      })
      return object
    },
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
          return target
        } else {
          console.log('看看此时的templatelist到底是什么？', this.templateList)
          return { templatecontent: {}}
        }
      },
      set(val) {
        return val
      }
    }
  },

  watch: {},

  created() {
    console.log('看看created的时候：', this.employTemplateData.templatecontent.lineNumber - this.startLineNum - this.tablePrintRowNum + 1)
    console.log('看看created的时候：', this.employTemplateData.templatecontent.lineNumber, this.startLineNum, this.tablePrintRowNum)
    Bus.$off('sendPrintContentType')
    Bus.$on('sendPrintContentType', (printContentType) => {
      console.log('收到的打印内容类型是：', printContentType)
      this.printContentType = printContentType
    })
    Bus.$off('sendStartLineNum')
    Bus.$on('sendStartLineNum', (startLineNum) => {
      console.log('收到的开始号码是：', startLineNum)
      this.startLineNum = startLineNum
    })
    Bus.$off('sendPosition')
    Bus.$on('sendPosition', (position) => {
      console.log('收到的位置是：', position)
      this.position = position
    })
    Bus.$off('sendFormPrintData')
    Bus.$on('sendFormPrintData', (rightSelectedData) => {
      console.log('收到的打印数据为', rightSelectedData)
      this.rightSelectedData = rightSelectedData
    })
    Bus.$off('sendTablePrintData')
    Bus.$on('sendTablePrintData', (tablePrintData) => {
      console.log('收到了传来的table数据', tablePrintData)
      if (this.printContentType === 'bill') {
        this.tablePrintData = tablePrintData.map(item => item.billcode + ' ' + item.billname)
      } else {
        this.tablePrintData = tablePrintData.map(item => item.billcode + ' ' + item.billname + ' ' + item.nontaxcode + ' ' + item.nontaxname)
      }
    })

    Bus.$off('billpermitPrint')
    Bus.$on('billpermitPrint', () => {
      this.billpermitPrint()
    })
    Bus.$off('billpermitPreview')
    Bus.$on('billpermitPreview', () => {
      this.billpermitPreview()
    })
    Bus.$off('billpermitSet')
    Bus.$on('billpermitSet', () => {
      this.billpermitSet()
    })
    Bus.$off('billpermitExport')
    Bus.$on('billpermitExport', () => {
      this.billpermitExport()
    })
  },
  mounted() {
    console.log('看看mounted的时候：', this.employTemplateData.templatecontent.lineNumber - this.startLineNum - this.tablePrintRowNum + 1)
  },
  methods: {

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
      this.updateState = false
    },
    cancel() {
      this.updateState = false
      console.log('查看当前模板打印设置字符串', this.employTemplateData.templatecontent.lodopPrintStr)
      this.loadPrintTemplate()
      console.log('再次查看当前模板打印设置字符串', this.employTemplateData.templatecontent.lodopPrintStr)
      console.log('再次查看当前右侧选择的数据：', this.rightSelectedData)
      // this.LODOP.PRINT_SETUP()
    },
    evil(fn) {
      const Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
      return new Fn('console.log("函数里的this是",this);' + fn)
    },
    billpermitPrint() {
      // 每个点击事件都要获取右侧选择列表。
      // this.getRightSelectedKeys()

      // 载入模板设置。
      this.loadPrintTemplate()
      // 清空回调，避免返回代码。
      if (this.LODOP.CVERSION) {
        this.LODOP.On_Return = null
      }
      // 最后载入数据
      this.loadPrintData()
      this.LODOP.PRINTA()
    },
    billpermitPreview() {
      // 每个点击事件都要获取右侧选择列表。
      // this.getRightSelectedKeys()

      // 载入模板设置。
      this.loadPrintTemplate()
      // 清空回调，避免返回代码。
      if (this.LODOP.CVERSION) {
        this.LODOP.On_Return = null
      }
      // 最后载入数据
      this.loadPrintData()
      this.LODOP.PREVIEW()
    },
    billpermitExport() {
      // 每个点击事件都要获取右侧选择列表。
      // this.getRightSelectedKeys()
      // 载入模板设置。
      this.loadPrintTemplate()
      // 清空回调，避免返回代码。
      if (this.LODOP.CVERSION) {
        this.LODOP.On_Return = null
      }
      // 最后载入数据
      this.loadPrintData()
      this.LODOP.SET_SAVE_MODE('Orientation', 2) // Excel文件的页面设置:横向打印   1-纵向,2-横向;
      this.LODOP.SET_SAVE_MODE('PaperSize', 9) // Excel文件的页面设置:纸张大小   9-对应A4
      this.LODOP.SET_SAVE_MODE('Zoom', 90) // Excel文件的页面设置:缩放比例
      this.LODOP.SET_SAVE_MODE('CenterHorizontally', true)// Excel文件的页面设置:页面水平居中
      this.LODOP.SET_SAVE_MODE('CenterVertically', true) // Excel文件的页面设置:页面垂直居中
      this.LODOP.SET_SAVE_MODE('QUICK_SAVE', true)// 快速生成（无表格样式,数据量较大时或许用到）
      this.LODOP.SAVE_TO_FILE('download.xls')
    },
    loadPrintData() {
      this.formPrintData.forEach(item => {
        this.LODOP.SET_PRINT_STYLEA(item.label, 'CONTENT', '')
      })
      this.rightSelectedData.forEach((item, i) => {
        this.LODOP.SET_PRINT_STYLEA(item.label, 'CONTENT', this.printSourceDate[item.label])
      })
    },
    loadPrintTemplate() {
      this.LODOP = getLodop()
      this.LODOP.PRINT_INIT('套打样式初始化设置')
      // 开启项目名控制项目属性值
      this.LODOP.SET_PRINT_MODE('PROGRAM_CONTENT_BYVAR', true)
      // 设置打印维护窗口关闭后是否返回程序代码,否则只返回打印次数
      this.LODOP.SET_PRINT_MODE('PRINT_SETUP_PROGRAM', true)
      // this.LODOP.ADD_PRINT_SETUP_BKIMG(`F:\\project\\notax\\src\\assets\\bill\\jks.jpg`)
      // this.LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '205mm')
      // this.LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '102mm')
      // this.LODOP.ADD_PRINT_TABLE(0,0,)
      this.LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', true)
      // 获取剩余项，即未选中的项，以便后面删除字符串中所包含的未选中项的数据。
      // var restArray = this.formPrintData.filter(item => !this.rightSelectedData.includes(item))
      // // 应用之前，需要根据右侧列表check一下，需要删除待打印列表没有，而字符串中却有的项。
      // restArray.forEach(item => {
      //   var reg = new RegExp(`.*"${item.label}".*`, 'g')
      //   this.employTemplateData.templatecontent.lodopPrintStr = this.employTemplateData.templatecontent.lodopPrintStr.replace(reg, '')
      // })

      // 这里的占位符一直在上面，不能删，否则位置信息就无法纪录。解决办法是在赋值数据的时候，先把数据全部置空，然后
      // 再给选中数据赋值。

      // vue中禁止使用eval，故此使用自定义evil来模拟eval。
      // 注意这里this的指向问题。
      // 应用来自服务器的处理好的字符串模板
      this.evil(this.employTemplateData.templatecontent.lodopPrintStr).bind(this)()
      this.rightSelectedData.forEach((item, i) => {
        if (!this.employTemplateData.templatecontent.lodopPrintStr.includes(item.label)) {
          // 右侧有，打印模板没有。
          console.log('有一个右侧有，但是当前打印的字符串中却没有的数据，说明是新增加的。')
          this.LODOP.ADD_PRINT_TEXTA(item.label, 350 + 35 * parseInt(i / 6), i % 6 * 100, 80, 24, item.label)
        } else {
          // 说明右侧有，打印模板中也有。就不做处理。
        }
      })
      // 每次新增表格打印项之前，需要检查一下字符串中是否已经有了表格，有了就不增加，直接替换内容。
      var reg = new RegExp(`<table.*<\/table>`, 'g')
      var tableStr = this.printContentType === 'bill' ? this.$refs.billPrintTable.innerHTML : this.$refs.projectPrintTable.innerHTML
      if (!reg.test(this.employTemplateData.templatecontent.lodopPrintStr)) {
        // 没有就增加。
        console.log('没有就增加')
        if (this.printContentType === 'bill') {
          // tableStr = this.$refs.billPrintTable.innerHTML
          this.LODOP.ADD_PRINT_TABLE(100, 100, this.employTemplateData.templatecontent.lineWidth * 2 + 'mm', this.employTemplateData.templatecontent.lineHeight * (this.employTemplateData.templatecontent.lineNumber + 1) + 'mm', tableStr)
        } else {
          // tableStr = this.$refs.projectPrintTable.innerHTML
          this.LODOP.ADD_PRINT_TABLE(100, 100, this.employTemplateData.templatecontent.billProjectLineWidth + 'mm', this.employTemplateData.templatecontent.billProjectLineHeight * (this.employTemplateData.templatecontent.billProjectLineNumber + 1) + 'mm', tableStr)
        }
      } else {
        console.log('有表，就替换表的内容，位置不变。')
        // 有表，就替换表的内容，位置不变。
        this.LODOP.SET_PRINT_STYLEA(0, 'CONTENT', tableStr)
        if (this.printContentType === 'bill') {
          // tableStr = this.$refs.billPrintTable.innerHTML
        // this.LODOP.ADD_PRINT_TABLE(100, 100, this.employTemplateData.templatecontent.lineWidth * 2 + 'mm', this.employTemplateData.templatecontent.lineHeight * (this.employTemplateData.templatecontent.lineNumber + 1) + 'mm', tableStr)
          this.LODOP.SET_PRINT_STYLEA(0, 'WIDTH', this.employTemplateData.templatecontent.lineWidth + 'mm')
          this.LODOP.SET_PRINT_STYLEA(0, 'HEIGHT', this.employTemplateData.templatecontent.lineHeight * (this.employTemplateData.templatecontent.lineNumber + 1) + 'mm')
        } else {
          // tableStr = this.$refs.projectPrintTable.innerHTML
        // this.LODOP.ADD_PRINT_TABLE(100, 100, this.employTemplateData.templatecontent.billProjectLineWidth + 'mm', this.employTemplateData.templatecontent.billProjectLineHeight * (this.employTemplateData.templatecontent.billProjectLineNumber + 1) + 'mm', tableStr)
          this.LODOP.SET_PRINT_STYLEA(0, 'WIDTH', this.employTemplateData.templatecontent.billProjectLineWidth + 'mm')
          // 这个系数非常重要 ，加0.8倍行高+5mm  ，因为lodop的html转打印时，会进行分割判断，所以实际需要的高度大于html文本高度，导致html易被切割到下一页。此系数大约5mm——20mm不被切割，每页12行数据时。
          this.LODOP.SET_PRINT_STYLEA(0, 'HEIGHT', this.employTemplateData.templatecontent.billProjectLineHeight * (this.employTemplateData.templatecontent.billProjectLineNumber + 0.8) + 5 + 'mm')
          console.log('冲设之后的高度是：', this.employTemplateData.templatecontent.billProjectLineHeight * (this.employTemplateData.templatecontent.billProjectLineNumber + 1))
          console.log('冲设之后的html高度是：', this.employTemplateData.templatecontent.billProjectLineHeight * this.employTemplateData.templatecontent.billProjectLineNumber - 1)
        }
        // this.employTemplateData.templatecontent.lodopPrintStr = this.employTemplateData.templatecontent.lodopPrintStr.replace(reg,`${tableStr}`)
        // console.log('替换之后的字符串是：',this.employTemplateData.templatecontent.lodopPrintStr)
      }
    },
    // confirm() {
    //   this.loadPrintTemplate()
    //   // this.LODOP.PRINT_DESIGN()
    //   if (this.LODOP.CVERSION) {
    //     this.LODOP.On_Return = (TaskID, Value) => {
    //       var str = Value.replace(/LODOP/ig, 'this.LODOP')
    //       this.employTemplateData.templatecontent.lodopPrintStr = str
    //       console.log('关闭设计器之后的回调数据为：', Value)
    //       this.savePrintData()
    //       console.log(this.employTemplateData.templatecontent.lodopPrintStr)
    //     }
    //   }
    //   this.LODOP.PRINT_SETUP()
    //   // 这里打开设计器。
    //   this.updateState = false
    // },
    // savePrintData
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
      this.$prompt('请输入修改后的模板名称', '提示', {
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
    },
    query() {
      this.savePrintData()
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
    update() {
      this.updateState = true
      // this.getRightSelectedKeys()
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
    exit() {
      this.templateSelectDialogVisible = false
    },
    billpermitSet() {
      this.templateSelectDialogVisible = true
      console.log('收到的选择好的form为：')
      console.table(this.rightSelectedData)
      console.log('收到的选择好的table为：', this.tablePrintData)
      console.log('看看created的时候：', this.employTemplateData.templatecontent.lineNumber, this.startLineNum, this.tablePrintRowNum)
      // console.log('收到的选择好的table为：', this.tablePrintData)
    }
  }
}

</script>
<style lang="scss">

</style>

<style rel='stylesheet/scss' lang='scss' scoped>
.shadow{
  background:rgba(0,0,0,0.3);
  position: fixed;
  top: 0;
  left: 0;
  width:100%;
  height:100%;
  z-index:5

}
.pjglz-print {
  width:90%;
  height:90%;
  position:fixed;
  top:50%;
  left:50%;
  background:#fff;
  transform:translate(-50%,-50%);
}
.none {
  display: none !important;
}
.template-wrap {
  display: flex;
  margin-left:50px;
  margin-top:100px;
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
      flex-direction:column;
      li {
        padding-top: 10px;
      }
    }
  }
}
.bill-template-wrap {
  margin-top:20px;
  margin-left:20px;
  // margin-top:50%;
  // transform:translateY(-80%);
  .set-template-wrap {
    height: 28px;
    line-height: 28px;
    margin-bottom:5px;
    .line-number,
    .line-height,
    .font-size,
    .line-width {
      width: 80px;
    }
  }
  .preview {
    // height:390px!important;
    // overflow: scroll;
    .preview-table {
      box-sizing: border-box;
      border-width: 1px;
      border-style: solid;
      border-collapse: collapse;
      td{
        // box-sizing: border-box;
        border-width: 1px;
        border-style: solid;
        border-collapse: collapse;
      }
    }
  }

  .footer {
    text-align: center;
    padding-top: 6px;
  }
}
</style>

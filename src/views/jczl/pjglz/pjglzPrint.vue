<!-- 模板设置选择组件。用于套打模板选择。 -->
<template>
  <el-dialog :visible.sync="templateSelectDialogVisible" class="pjglz-print" center width="70%" title="打印模板设置">
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

    <div :class="{none:!updateState}" class="bill-template-wrap">
      <div class="set-template-wrap">
        <el-row>
          <el-col :span="8" class="">
            <span>请输入最大打印行数</span>
            <el-input v-model.trim.number="lineNumber" size="mini" class="line-number" />
          </el-col>
          <el-col :span="16">
            <span>请输入单行打印区的高度（单位：毫米）</span>
            <el-input v-model.trim.number="lineHeight" size="mini" class="line-height" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="8" :span="16">
            <span>请输入单列打印区的宽度（单位：毫米）</span>
            <el-input v-model.trim.number="lineWidth" size="mini" class="line-width" />
          </el-col>
        </el-row>
      </div>
      <div ref="printTable" class="preview">
        <table :style="`table-layout:fixed;width:${lineWidth*2-1}mm;height:${lineHeight*lineNumber-1}mm;margin:0 auto;border-width: 1px;border-style: solid;border-collapse: collapse`" class="preview-table">

          <tr v-for="row in startLineNum-1" :key="'row-'+row">
            <td v-for="col in 2" :key="'col-'+col" :style="`white-space:nowrap;overflow:hidden;word-break:keep-all;width:${lineWidth}mm;height:${lineHeight}mm;border-width: 1px;border-style: solid;border-collapse: collapse;vertical-align:middle;`" />
          </tr>
          <tr v-for="row in tablePrintRowNum" :key="'printRow-'+row">
            <template v-if="position === 'left'">
              <td :style="`white-space:nowrap;overflow:hidden;word-break:keep-all;width:${lineWidth}mm;height:${lineHeight}mm;border-width: 1px;border-style: solid;border-collapse: collapse;vertical-align:middle;`">
                {{ tablePrintData[2*row-2] }}
              </td>
              <td :style="`white-space:nowrap;overflow:hidden;word-break:keep-all;width:${lineWidth}mm;height:${lineHeight}mm;border-width: 1px;border-style: solid;border-collapse: collapse;vertical-align:middle;`">
                {{ tablePrintData[2*row-1] }}
              </td>
            </template>
            <template v-else>
              <td :style="`white-space:nowrap;overflow:hidden;word-break:keep-all;width:${lineWidth}mm;height:${lineHeight}mm;border-width: 1px;border-style: solid;border-collapse: collapse;vertical-align:middle;`">
                {{ tablePrintData[2*row-3] }}
              </td>
              <td :style="`white-space:nowrap;overflow:hidden;word-break:keep-all;width:${lineWidth}mm;height:${lineHeight}mm;border-width: 1px;border-style: solid;border-collapse: collapse;vertical-align:middle;`">
                {{ tablePrintData[2*row-2] }}
              </td>
            </template>
          </tr>
          <tr v-for="row in (lineNumber - startLineNum - tablePrintRowNum+1)" :key="'restRow-'+row">
            <td v-for="col in 2" :key="'restCol-'+col" :style="`white-space:nowrap;overflow:hidden;word-break:keep-all;width:${lineWidth}mm;height:${lineHeight}mm;border-width: 1px;border-style: solid;border-collapse: collapse;vertical-align:middle;`" />
          </tr>
        </table>
      </div>
      <div class="footer">
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirm">确 定</el-button>
      </div>
    </div>

  </el-dialog>
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
    }
    // formPrintData: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // }
    // tablePrintData: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // }
  },
  data() {
    return {
      lineWidth: 90,
      lineHeight: 8,
      lineNumber: 12,
      tablePrintData: [],
      formPrintData: [],
      startLineNum: 1,
      position: 'left',
      updateState: false,
      str: '',
      LODOP: '', // 准备用来调用getLodop获取LODOP对象
      isCurrent: '',
      templateSelectDialogVisible: false
    }
  },
  computed: {
    tablePrintRowNum() {
      if (this.position === 'left') {
        return Math.ceil(this.tablePrintData.length / 2)
      } else {
        return Math.floor(this.tablePrintData.length / 2) + 1
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
        }
      },
      set(val) {
        return val
      }
    }
  },

  watch: {},

  created() {
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
    Bus.$on('sendFormPrintData', (formPrintData) => {
      this.formPrintData = formPrintData
    })
    Bus.$off('sendTablePrintData')
    Bus.$on('sendTablePrintData', (tablePrintData) => {
      console.log('收到了传来的table数据')
      this.tablePrintData = tablePrintData
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

  methods: {
    confirm() {
      this.loadPrintTemplate()
      // this.LODOP.PRINT_DESIGN()
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
      this.LODOP.PRINT()
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
      this.LODOP.ADD_PRINT_SETUP_BKIMG(`F:\\project\\notax\\src\\assets\\bill\\jks.jpg`)
      this.LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '205mm')
      this.LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '102mm')
      this.LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', true)
      var restArray = this.formPrintData.filter(item => !this.rightSelectedData.includes(item))
      // 应用之前，需要根据右侧列表check一下，需要删除右侧列表没有，而字符串中却有的项。
      restArray.forEach(item => {
        var reg = new RegExp(`.*"${item.label}".*`, 'g')
        this.employTemplateData.templatecontent.lodopPrintStr = this.employTemplateData.templatecontent.lodopPrintStr.replace(reg, '')
      })
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
      console.log('收到的选择好的form为：', this.formPrintData)
      console.log('收到的选择好的table为：', this.tablePrintData)
    }
  }
}

</script>
<style lang="scss">
.pjglz-print {
  .el-dialog--center .el-dialog__body {
    padding-top: 0;
  }
}
</style>

<style rel='stylesheet/scss' lang='scss' scoped>
.none {
  display: none !important;
}
.template-wrap {
  display: flex;
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
      li {
        padding-top: 10px;
      }
    }
  }
}
.bill-template-wrap {
  .set-template-wrap {
    height: 28px;
    line-height: 28px;
    .line-number,
    .line-height,
    .line-width {
      width: 80px;
    }
  }
  .preview {
    .preview-table {
      box-sizing: border-box;
    }
  }

  .footer {
    text-align: center;
    padding-top: 6px;
  }
}
</style>

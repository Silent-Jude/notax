<!-- 表格打印设置组件 -->
<template>
  <!-- <el-dialog :visible.sync="dialogTableVisible" class="print-set" title="打印设置" width="100%" @close="close" @open="open"> -->
  <div :class="{hidden:!dialogTableVisible}" class="print-set ">
    <el-scrollbar style="height:100%;width:100%;">
      <div class="tool-bar">
        <!-- <el-button-group> -->
        <p style="font-size:20px;margin-top:20px;margin-bottom:10px;text-align:center">模板选择</p>
        <el-select v-if="employTemplateData" :value="employTemplateData.templatename" value-key="templatename" placeholder="请选择模板" @change="changeTemplate">
          <el-option v-for="item in templateData" :key="item.templatename" :label="item.templatename" :value="item.templatename" @click.native="optionClick(item)">
            <div class="inner-text">
              <span>{{ item.templatename }}</span>
              <span class="el-icon-edit" @click="modifyTitle(item)" />
            </div>
          </el-option>
        </el-select>
        <el-button style="margin-top:20px" plain type="primary" icon="el-icon-close" @click="close">退出设置</el-button>
        <!-- <el-button plain type="primary" icon="el-icon-sort" @click="returnDefault">恢复默认</el-button> -->
        <el-button plain type="primary" icon="el-icon-view" @click="tablePrintPreview">打印预览</el-button>
        <el-button plain type="primary" icon="el-icon-printer" @click="tablePrint">开始打印</el-button>
        <el-button plain type="primary" icon="el-icon-document" @click="tablePrintExport">导出表格</el-button>
        <el-button plain type="primary" icon="el-icon-circle-check-outline" @click="savePrintData">保存模板</el-button>
        <el-button plain type="primary" icon="el-icon-plus" @click="addTemplate">新增模板</el-button>
        <el-button plain type="primary" icon="el-icon-remove-outline" @click="removeTemplate">删除模板</el-button>
        <el-button plain type="primary" icon="el-icon-remove-outline" @click="setup">详细设计</el-button>
        <!-- </el-button-group> -->
      </div>
      <!-- <button @click="tablePrintPreview">预览</button> -->
      <div class="print-view-wrap">
        <!-- <div class="print-positon"/> -->
        <el-row>
          <el-col :span="8">
            打印文件头部区域高度设置：<input v-if="employTemplateData" v-model="employTemplateData.templatecontent.printHeadHeight" type="text" class="print-distance">毫米
          </el-col>
          <el-col :span="8">
            设置打印纸张方向：
            <el-switch v-if="employTemplateData" v-model="employTemplateData.templatecontent.direction" :active-value="2" :inactive-value="1" style="display: inline-block" active-color="#13ce66" inactive-color="#ff4949" active-text="横向" inactive-text="竖向" />
          </el-col>
        </el-row>
        <div class="print-head-wrap">
          <div ref="div1" class="div1" style="margin:0;padding:0;">
            <p v-if="employTemplateData" style="font-size:26px;font-weight:500;margin:0;padding:0;text-align:center;margin:5px 0 5px;padding:0;">
              <span>{{ employTemplateData.templatecontent.title }}</span>
              <span class="el-icon-edit" @click="modifyTitleName(employTemplateData.templatecontent)" />
            </p>
            <ul class="print-head" style="margin:0;padding:0;height:100px;display: flex;justify-content:space-between;flex-flow: wrap row-reverse;align-items:flex-end;list-style:none;">
              <li v-for="(item,i) in checkedPrintHead" :key="i" class="print-item" style="margin:0;padding:0;margin-bottom:5px;flex:0 0 33.3%;display:flex;justify-content:space-between">
                <span style="margin:0;padding:0;flex:0 0 40%">{{ item.text }}:</span>
                <span class="hidden" style="margin:0;padding:0;flex:1 1 60%">{{ item.value }}</span>
              </li>
            </ul>
          </div>
          <printItemControl v-if="employTemplateData" :template-data="employTemplateData.templatecontent.printHead" class="print-head-control" />
        </div>
        <div class="print-positon">表格打印列不建议设置太多，否则打印输出可能不正确</div>
        <div class="print-table-wrap" style="margin:0;padding:0;">
          <div ref="div2" class="div2">
            <table style="margin:0 auto;border-width: 1px;border-style: solid;border-collapse: collapse" class="print-table">
              <thead>
                <tr>
                  <!-- v-dragging="{item:item,list:checkedTableHead,group:'tbHead'}"  -->
                  <th v-for="(item,i) in checkedTableHead" :key="i" :style="`width:${item.width}px;border-width: 1px;border-style: solid;border-collapse: collapse`">{{ item.text }}</th>
                </tr>
              </thead>
              <tbody class="none">
                <tr v-for="(rowData,i) in printData" :key="i">
                  <td v-for="(item ,index) in checkedTableHead" :key="index" :style="`width:${item.width}px;border-width: 1px;border-style: solid;border-collapse: collapse;vertical-align:middle;`" align="center">
                    {{ rowData[item.key] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <printItemControl v-if="employTemplateData" :template-data="employTemplateData.templatecontent.tableHead" class="print-table-control">
            <template slot="title">
              <div> | </div>
              <div>列宽 </div>
            </template>
            <template slot-scope="{ item }">
              |
              <el-input v-model="item.width" size="mini" type="text" class="width" />
            </template>
          </printItemControl>
        </div>
        <div class="print-positon">打印尾部设置:</div>
        <div class="print-foot-wrap" style="margin:0;padding:0;">
          <div ref="div3" class="div3">
            <ul class="print-foot" style="margin:0;padding:0; display: flex;justify-content:space-between;flex-flow: wrap row-reverse;align-items:flex-start;list-style:none;">
              <li v-for="(item,i) in checkedPrintFoot" :key="i" class="print-item" style="margin:0;padding:0;margin-top:5px;flex:0 0 33.3%;display:flex;justify-content:space-between">
                <span style="margin:0;padding:0;flex:0 0 40%">{{ item.text }}:</span>
                <span class="hidden" style="margin:0;padding:0;flex:1 1 60%">{{ item.value }}</span>
              </li>
            </ul>
          </div>
          <printItemControl v-if="employTemplateData" :template-data="employTemplateData.templatecontent.printFoot" class="print-foot-control" />
        </div>
      </div>
    </el-scrollbar>
  </div>
  <!-- </el-dialog> -->
</template>

<script>
import printItemControl from './printItemControl'
import Bus from '@/utils/Bus'
import { getLodop } from '@/assets/LodopFuncsNew' // 导入模块
import { savePrintTemplateData, removePrintTemplateData } from '@/api/webPrint'
// import { deepClone } from '@/utils/Common'

export default {
  components: {
    printItemControl
  },
  props: {
    formPrintData: { //  表单参数数据。
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    printData: { //  打印表格数据
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    templateData: { //  模板表头和模板设置等数据。
      type: Array,
      default() {
        return []
      }
    }
    // defaultData: { //  默认数据，弃用。
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // }
  },
  data() {
    return {
      // direction: 1, // 1竖，2横
      // templateData
      // checkedTexts: [],
      // printHeadHeight: '10',
      dialogTableVisible: false,
      LODOP: '' // 准备用来调用getLodop获取LODOP对象
    }
  },

  computed: {
    employTemplateData: { // 当前应用模板
      get() {
        var target = this.templateData.find(item => item.isdefault === 1)
        // console.log(target)
        if (!target) {
          target = this.templateData.find(item => item.isstandardtemplage === 1)
        }
        if (target) {
          if (typeof (target.templatecontent) === 'string') {
            target.templatecontent = JSON.parse(target.templatecontent)
          }
          if (this.formPrintData.length > 0) {
            target.templatecontent.printHead = JSON.parse(JSON.stringify(this.formPrintData))
            target.templatecontent.printFoot = JSON.parse(JSON.stringify(this.formPrintData))
          }
          return target
        }
      },
      set(val) {
        return val
      }
    },
    checkedPrintHead() {
      if (this.employTemplateData) {
        console.log('1', this.employTemplateData)
        return this.employTemplateData.templatecontent.printHead.filter(item => item.checked)
      }
    },
    checkedTableHead() {
      if (this.employTemplateData) {
        console.log('2', this.employTemplateData)

        return this.employTemplateData.templatecontent.tableHead.filter(item => item.checked)
      }
    },
    checkedPrintFoot() {
      if (this.employTemplateData) {
        console.log('3', this.employTemplateData)

        return this.employTemplateData.templatecontent.printFoot.filter(item => item.checked)
      }
    }
  },

  watch: {
    dialogTableVisible(newVal, oldVal) {
      if (newVal === false) {
        Bus.$emit('getPrintData')
        console.table(this.templateData, ['templatename', 'isdefault', 'templatecontent', 'userid'])
      }
    }
  },

  created() {
    Bus.$off('tablePrintExport')
    Bus.$on('tablePrintExport', () => {
      this.tablePrintExport()
    })
    Bus.$off('tablePrintPreview')
    Bus.$on('tablePrintPreview', () => {
      this.tablePrintPreview()
    })
    Bus.$off('tablePrint')
    Bus.$on('tablePrint', () => {
      this.tablePrint()
    })
    Bus.$off('tablePrintSet')
    Bus.$on('tablePrintSet', () => {
      this.tablePrintSet()
    })
  },
  mounted() {
  },
  methods: {
    setup() {
      this.printSet()
      // this.LODOP.PRINT_SETUP()
      this.LODOP.PRINT_DESIGN()
    },
    addTemplate() {
      this.$prompt('新输入新模板名称！', '提示', {
        confirmButtonText: '确定新增',
        cancelButtonText: '取消新增',
        inputPattern: /.*[^\s]/,
        inputValidator: val => this.templateData.find(item => item.templatename === val) ? '模板名称不能重复！请检查！' : true,
        closeOnClickModal: false,
        inputErrorMessage: '模板名称不能为空！'
      }).then(({ value }) => {
        const tempObject = JSON.parse(JSON.stringify(this.employTemplateData))
        tempObject.guid = ''
        tempObject.userid = ''
        tempObject.isstandardtemplage = 0
        tempObject.isdefault = 1
        tempObject.userid = ''
        tempObject.title = '票据入库'
        tempObject.templatename = value
        this.employTemplateData.isdefault = 0
        this.templateData.push(tempObject)
        // this.savePrintData()
        this.savePrintData().then(res => {
          this.employTemplateData.guid = res.data.guid
        })
      }).catch(() => {
      })
    },
    removeTemplate() {
      removePrintTemplateData(this.employTemplateData.guid).then(res => {
        console.log(res)
        var targetIndex = this.templateData.findIndex(item => item.guid === this.employTemplateData.guid)
        this.templateData.splice(targetIndex, 1)
        this.templateData.find(item => item.isstandardtemplage === 1).isdefault = 1
      }).catch(err => { console.log(err) })
    },
    changeTemplate(val) {
    },
    optionClick(item) {
      this.templateData.forEach(item => {
        item.isdefault = 0
      })
      item.isdefault = 1
      this.employTemplateData.templatename = item.templatename
    },
    modifyTitleName(obj) {
      this.$prompt('请输入修改后的表头名称！', '提示', {
        confirmButtonText: '确定修改',
        cancelButtonText: '取消修改',
        inputPattern: /.*[^\s]/,
        closeOnClickModal: false,
        // inputValidator: val => this.templateData.find(item => item.templatename === val) ? '模板名称不能重复！请检查！' : true,
        // if () {
        //   return '模板名称不能重复！请检查！'
        // }
        inputErrorMessage: '打印表头名称不能为空！'
      }).then(({ value }) => {
        this.$set(obj, 'title', value)
        // Object.assign({},employTemplateData,{title:value})
        // employTemplateData.title = value
      }).catch(() => {
      })
    },
    modifyTitle(item) {
      this.$prompt('请输入修改后的模板名称', '提示', {
        confirmButtonText: '确定修改',
        cancelButtonText: '取消修改',
        inputPattern: /.*[^\s]/,
        closeOnClickModal: false,
        inputValidator: val => this.templateData.find(item => item.templatename === val) ? '模板名称不能重复！请检查！' : true,
        // if () {
        //   return '模板名称不能重复！请检查！'
        // }
        inputErrorMessage: '模板名称不能为空！'
      }).then(({ value }) => {
        item.templatename = value
      }).catch(() => {
      })
    },
    checkLook() {
    },
    savePrintData() {
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
    },
    printSet() {
      this.LODOP = getLodop()
      this.LODOP.PRINT_INIT('表格预览')
      this.LODOP.SET_PRINT_PAGESIZE(this.employTemplateData.templatecontent.direction, 0, 0, 'A4')
      // console.log('当前设置的高度是：', this.employTemplateData.templatecontent.printHeadHeight)
      var printHeadHeight = +this.employTemplateData.templatecontent.printHeadHeight
      var strStyle = '<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse;}</style>'
      this.LODOP.ADD_PRINT_TABLE(`${printHeadHeight + 10}mm`, '5%', '95%', `90%`, strStyle + this.$refs.div2.innerHTML)
      this.LODOP.SET_PRINT_STYLEA(0, 'Vorient', 3)
      this.LODOP.SET_PRINT_STYLEA(0, 'Offset2Top', `${-printHeadHeight}mm`) // 表示从次页开始的上边距偏移量
      this.LODOP.ADD_PRINT_HTM('1%', '2%', '95%', `${printHeadHeight}mm`, this.$refs.div1.innerHTML)
      // this.LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1) // 此行代码的作用是使得div1中的内容随着分页反复出现，相当于是页眉。
      this.LODOP.ADD_PRINT_HTM('2%', '0%', '95%', '10%', this.$refs.div3.innerHTML)
      this.LODOP.SET_PRINT_STYLEA(0, 'LinkedItem', 1) // 内容项与别人关联后，会紧跟被关联者之后打印，位置和区域大小随被关联项而定，此时其Top和left不再是上边距和左边距，而是与关联项的间隔空隙及左边距偏移。0表示自己，1表示第一个，-1表示自己的前一个。
    },
    // returnDefault() {
    //   this.employTemplateData.templatecontent = JSON.parse(JSON.stringify(this.defaultData[0].templatecontent))
    // },
    tablePrintSet() {
      this.dialogTableVisible = true
    },
    tablePrint() {
      this.printSet()
      this.LODOP.PRINT()
    },
    tablePrintPreview() {
      console.log('打印模板是：', this.employTemplateData)
      this.printSet()
      this.LODOP.PREVIEW()
    },
    tablePrintExport() {
      // this.LODOP = getLodop()
      // this.LODOP.PRINT_INIT('表格导出')
      // this.LODOP.ADD_PRINT_TABLE(100, 20, 500, 80, document.documentElement.innerHTML)
      this.printSet()
      this.LODOP.SET_SAVE_MODE('Orientation', 2) // Excel文件的页面设置:横向打印   1-纵向,2-横向;
      this.LODOP.SET_SAVE_MODE('PaperSize', 9) // Excel文件的页面设置:纸张大小   9-对应A4
      this.LODOP.SET_SAVE_MODE('Zoom', 90) // Excel文件的页面设置:缩放比例
      this.LODOP.SET_SAVE_MODE('CenterHorizontally', true)// Excel文件的页面设置:页面水平居中
      this.LODOP.SET_SAVE_MODE('CenterVertically', true) // Excel文件的页面设置:页面垂直居中
      this.LODOP.SET_SAVE_MODE('QUICK_SAVE', true)// 快速生成（无表格样式,数据量较大时或许用到）
      this.LODOP.SAVE_TO_FILE('download.xls')
    },
    close() {
      this.dialogTableVisible = false
    },
    open() { },
    showDetail(row) {
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.print-set {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  z-index: 4;
  &.hidden {
    display: none;
  }

  .hidden {
    visibility: hidden;
  }
  .none {
    display: none;
  }

  .tool-bar {
    width: 140px;
    font-size: 20px;
    position: absolute;
    top: 2%;
    left: 87%;
    .el-button + .el-button {
      margin: 0;
    }
    .inner-text {
      display: flex;
    }
  }
  .print-view-wrap {
    width: 80%;
    margin: 50px 40px;

    // margin-left:50px;
    // margin-right:200px;
    .print-positon {
      padding-left: 15%;
      // text-align: center;
    }
    .print-distance {
      width: 50px;
      border: 1px solid #000;
      margin-left: 15px;
      margin-right: 15px;
    }
    .print-head-wrap {
      border: 1px dashed rgba(0, 0, 0, 0.3);
      padding: 10px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      .div1 {
        flex: 0 0 60%;
        border: 1px dashed #555;
      }
      .print-head-control {
        margin-right: 10px;
        flex: none;
      }
    }
    .print-table-wrap {
      border: 1px dashed rgba(0, 0, 0, 0.3);
      padding: 10px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      .div2 {
        flex: 0 0 60%;
        padding-top: 10px;
      }
      .print-table-control {
        margin-right: 10px;
        flex: none;
      }
      .width {
        // margin-top:5px;
        // border: 1px solid #000;
        width: 80px;
        height: 28px;
        .el-input__inner {
          padding: 0;
        }
      }
    }
    .print-foot-wrap {
      border: 1px dashed rgba(0, 0, 0, 0.3);
      padding: 10px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      .div3 {
        flex: 0 0 60%;
      }
      .print-foot-control {
        margin-right: 10px;
        flex: none;
      }
    }
  }
}
</style>

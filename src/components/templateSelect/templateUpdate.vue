<!-- 修改模板页面组件 -->
<template>
  <el-dialog :visible.sync="templateUpdateDialogVisible" center width="70%" title="请选择待打印的数据项">
    <div class="source-wrap">
      <el-transfer
        v-model="rightSelectedKey"
        :titles="['可选数据项','待打印数据项']"
        :button-texts="['移出打印区','移入打印区']"
        :data="formPrintData"
        filterable
        @change="changeSelectData"
      />
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Bus from '@/utils/Bus'
import { getLodop } from '@/assets/LodopFuncsNew' // 导入模块

export default {
  components: {},
  props: {
    // tablePrintData
    formPrintData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      str: '',
      LODOP: '', // 准备用来调用getLodop获取LODOP对象
      templateUpdateDialogVisible: false,
      rightSelectedKey: []
    }
  },

  computed: {
    rightSelectedData() {
      const data = this.formPrintData.filter(item => this.rightSelectedKey.includes(item.key))
      console.log(data)
      return data
    }
  },

  watch: {},
  created() {
    Bus.$off('openUpdateDialog')
    Bus.$on('openUpdateDialog', () => {
      this.openUpdateDialog()
    })
    Bus.$off('billPrint')
    Bus.$on('billPrint', () => {
      this.billPrint()
    })
    Bus.$off('billPrintPreview')
    Bus.$on('billPrintPreview', () => {
      this.billPrintPreview()
    })
  },

  methods: {
    evil(fn) {
      const Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
      return new Fn('console.log("函数里的this是",this);' + fn)
    },
    billPrint() {
      this.initPrintModel()
      this.LODOP.PRINT()
    },
    billPrintPreview() {
      // vue中禁止使用eval，故此使用自定义evil来模拟eval。
      // 注意这里this的指向问题。
      this.evil(this.str).bind(this)()
      this.LODOP.SET_PRINT_STYLEA(0, 'ContentVName', '变量名')
      this.LODOP.PREVIEW()
    },
    exportExcel() {},
    initPrintModel() {
      this.LODOP = getLodop()
      this.LODOP.PRINT_INIT('套打样式初始化设置')
      // 开启项目名控制项目属性值
      this.LODOP.SET_PRINT_MODE('PROGRAM_CONTENT_BYVAR', true)
      // 设置打印维护窗口关闭后是否返回程序代码,否则只返回打印次数
      this.LODOP.SET_PRINT_MODE('PRINT_SETUP_PROGRAM', true)
      this.rightSelectedData.forEach((item, i) => {
        this.LODOP.ADD_PRINT_TEXTA(item.label, 100 * parseInt(i / 3), i % 3 * 100, 100, 40, item.label)
      })
      // this.evil(this.str).bind(this)()
      if (this.LODOP.CVERSION) {
        this.LODOP.On_Return = (TaskID, Value) => {
          this.str = Value
          this.str = this.str.replace(/LODOP/ig, 'this.LODOP')
          console.log(this.str)
        }
      }
    },
    confirm() {
      console.log('右侧key为：', this.rightSelectedKey)
      console.log('左侧数据为：', this.formPrintData)
      console.log('右侧数据为：', this.rightSelectedData)
      this.templateUpdateDialogVisible = false
      this.initPrintModel()
      // this.LODOP.PRINT_DESIGN()
      this.LODOP.PRINT_SETUP()
      // 这里打开设计器。
    },
    cancel() {
      this.templateUpdateDialogVisible = false
    },
    openUpdateDialog() {
      this.templateUpdateDialogVisible = true
    },
    changeSelectData() {}
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
</style>

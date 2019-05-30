<!-- 票据购领证打印（仅首页）组件 -->
<template>
  <div>
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllBasicItemChange">全选</el-checkbox>
    <fieldset class="fieldset_wrap">
      <legend>基础信息打印（注意：打钩的表示需要打印的，没有打钩的表示不需要打印的）</legend>
      <el-scrollbar style="height:100%;width:100%;">
        <el-checkbox-group v-model="checkedBasicItems" class="check-list" @change="basicItemChange">
          <el-checkbox v-for="(items,i) of formPrintData" :key="i" :label="items.value">{{ items.text }}</el-checkbox>
        </el-checkbox-group>
      </el-scrollbar>
    </fieldset>
    <fieldset class="fieldset_wrap">
      <legend>票据信息打印（注意：打钩的表示已经打印的，未打钩的表示需要打印的）</legend>
      <el-row class="position">
        <el-col :span="6">
          <span>打印起始行</span>
          <el-input-number v-model.trim.number="startLineNum" :min="1" :max="12" class="start-num" size="mini" controls-position="right" @change="startLineNumChange"/>
        </el-col>
        <el-col :span="9">
          <el-switch
            v-model="position"
            style="display: inline-block"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="right"
            inactive-value="left"
            active-text="从右列开始打印"
            inactive-text="从左列开始打印"/>
        </el-col>
        <el-col :span="9">
          <el-radio v-model="printContentType" label="bill">可用票据打印</el-radio>
          <el-radio v-model="printContentType" label="billProject">可用票据对应项目打印</el-radio>
        </el-col>
      </el-row>
      <el-scrollbar style="height:100%;width:100%;">
        <el-checkbox-group v-if="printContentType === 'bill'" v-model="checkedBillInfoItems" class="check-list" @change="billInfoItemChange">
          <el-checkbox v-for="(items,i) of billInfoData" :key="i" :label="items.value">{{ items.text }}</el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-else v-model="checkedBillInfoItems" class="check-list" @change="billInfoItemChange">
          <el-checkbox v-for="(items,i) of billProjectData" :key="i" :label="items.value">{{ items.text }}</el-checkbox>
        </el-checkbox-group>
      </el-scrollbar>
    </fieldset>
    <button @click="test">看数据</button>
  </div>
</template>

<script>
import Bus from '@/utils/Bus'

export default {
  components: {},
  props: {
    formPrintData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      printContentType: 'bill', // 打印数据类型
      checkedBillInfoItems: [], // 当前选中的票据信息项的text所组成的数组。
      billInfoData: [ // 待勾选的可打印的票种信息数据
        { text: '可用票据打印信息001', value: '可用票据打印信息占位值1' },
        { text: '可用票据打印信息002', value: '可用票据打印信息占位值2' },
        { text: '可用票据打印信息003', value: '可用票据打印信息占位值3' },
        { text: '可用票据打印信息004', value: '可用票据打印信息占位值4' }
      ],
      billProjectData: [
        { text: '可用票据对应项目打印信息001', value: '可用票据对应项目打印信息占位值1' },
        { text: '可用票据对应项目打印信息002', value: '可用票据对应项目打印信息占位值2' },
        { text: '可用票据对应项目打印信息003', value: '可用票据对应项目打印信息占位值3' },
        { text: '可用票据对应项目打印信息004', value: '可用票据对应项目打印信息占位值4' }
      ],
      startLineNum: 1,
      position: 'left',
      checkAll: false,
      checkedBasicItems: [''], // 当前选中的基础信息打印项的text所组成的数组
      isIndeterminate: false
    }
  },

  computed: {
    checkedFormPrintData() { //  已勾选的表单打印项。
      var formPrintData = this.checkedBasicItems.map(checkedItem => this.formPrintData.find(item => item.value === checkedItem))
      Bus.$emit('sendFormPrintData', formPrintData)
      return this.checkedBasicItems.map(checkedItem => this.formPrintData.find(item => item.value === checkedItem))
    },
    checkedTablePrintData() { //  剩余的未勾选表格打印项
      var tablePrintData = []
      if (this.printContentType === 'bill') {
        tablePrintData = this.billInfoData.filter(item => !this.checkedBillInfoItems.includes(item.value)).map(item => item.value)
      } else {
        tablePrintData = this.billProjectData.filter(item => !this.checkedBillInfoItems.includes(item.value)).map(item => item.value)
      }
      Bus.$emit('sendTablePrintData', tablePrintData)
      return tablePrintData
    }
  },

  watch: {
    printContentType() {
      this.checkedBillInfoItems = []
    },
    startLineNum: {
      handler(newVal) {
        Bus.$emit('sendStartLineNum', this.startLineNum)
      },
      immediate: true
    },
    position: {
      handler(newVal) {
        Bus.$emit('sendPosition', this.position)
      },
      immediate: true
    }
  },

  created() {
  },
  mounted() {
    Bus.$emit('sendFormPrintData', this.checkedFormPrintData)
    Bus.$emit('sendTablePrintData', this.checkedTablePrintData)
    Bus.$emit('sendStartLineNum', this.startLineNum)
    Bus.$emit('sendPosition', this.position)
  },
  methods: {
    test() {
      console.log('看数据')
      console.log('上面数据：', this.checkedFormPrintData)

      console.log('下面数据：', this.checkedTablePrintData)
    },
    getFormPrintTextArray() {
      return this.formPrintData.map(item => item.text)
    },
    billInfoItemChange(val) {
      console.log(val)
      // console.log(this.checkedTablePrintData)
      console.log(this.printContentType)
      console.log(this.startLineNum)
    },

    checkAllBasicItemChange(val) {
      console.log(val)
      this.checkedBasicItems = val ? this.getFormPrintTextArray() : []
      this.isIndeterminate = false
    },
    basicItemChange(val) {
      console.log(val)
      const checkedCount = val.length
      this.checkAll = checkedCount === this.formPrintData.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.formPrintData.length
      // console.log()
    },
    startLineNumChange(val) {
      console.log(val)
    }

  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.fieldset_wrap {
  padding-left: 10px;
  margin-bottom: 15px;
  .check-list {
    height: 150px;
    display: flex;
    flex-flow: column nowrap;
    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
  }
}
.position{
  padding-top: 10px
}
.start-num{
  width:88px
}
</style>

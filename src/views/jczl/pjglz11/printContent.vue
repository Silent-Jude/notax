<!-- 票据购领证打印（仅首页）组件 -->
<template>
  <div>
    <button @click="test">test</button>

    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllBasicItemChange">全选</el-checkbox>
    <fieldset class="fieldset_wrap">
      <legend>基础信息打印（注意：打钩的表示需要打印的，没有打钩的表示不需要打印的）</legend>
      <el-scrollbar style="height:100%;width:100%;">
        <el-checkbox-group v-model="checkedBasicItems" class="check-list" @change="basicItemChange">
          <el-checkbox v-for="(item,i) of formPrintData" :key="i" :label="item">{{ item.label }}</el-checkbox>
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
            :disabled="printContentType === 'billProject'"
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
          <el-checkbox v-for="(item,i) of billInfoData" :key="i" :label="item">{{ item.billcode }} {{ item.billname }}</el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-else v-model="checkedBillInfoItems" class="check-list" @change="billInfoItemChange">
          <el-checkbox v-for="(item,i) of billProjectData" :key="i" :label="item">{{ item.billcode }} {{ item.billname }} {{ item.nontaxcode }} {{ item.nontaxname }}</el-checkbox>
        </el-checkbox-group>
      </el-scrollbar>
    </fieldset>
  </div>
</template>

<script>
import Bus from '@/utils/Bus'
import { getPermit2Project } from '@/api/jczl'

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
      checkedBillInfoItems: [], // 当前选中的票据信息项的 所组成的数组。
      billInfoData: [ // 待勾选的可打印的票种信息数据
      ],
      billProjectData: [
      ],
      startLineNum: 1,
      position: 'left',
      checkAll: false,
      checkedBasicItems: [

      ], // 当前选中的基础信息打印项所组成的数组
      isIndeterminate: false
    }
  },

  computed: {
    // tableStr(){
    //   return this.printContentType ==='bill'?this.$refs.billPrintTable.innerHTML:this.$refs.projectPrintTable.innerHTML
    // },
    // checkedFormPrintData() { //  已勾选的表单打印项。
    //   var formPrintData = this.checkedBasicItems.map(checkedItem => this.formPrintData.find(item => item.label === checkedItem))
    //   Bus.$emit('sendFormPrintData', formPrintData)
    //   return formPrintData
    // },
    checkedTablePrintData() { //  剩余的未勾选表格打印项
      var tablePrintData = []
      if (this.printContentType === 'bill') {
        tablePrintData = this.billInfoData.filter(item => !this.checkedBillInfoItems.includes(item))
      } else {
        tablePrintData = this.billProjectData.filter(item => !this.checkedBillInfoItems.includes(item))
      }
      Bus.$emit('sendTablePrintData', tablePrintData)
      return tablePrintData
    }
  },

  watch: {
    formPrintData(newVal, oldVal) {
      console.log('收到的新数据是：', newVal)
    },
    checkedBasicItems: {
      handler() {
        Bus.$emit('sendFormPrintData', this.checkedBasicItems)
      },
      immediate: true
    },
    checkedBillInfoItems: {
      handler() {
        Bus.$emit('sendTablePrintData', this.checkedTablePrintData)
      },
      immediate: true
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
    },
    printContentType: {
      handler(newVal) {
        this.checkedBillInfoItems = []
        Bus.$emit('sendPrintContentType', this.printContentType)
        // if (newVal === 'billProject') {}
      },
      immediate: true
    }
  },

  created() {
    Bus.$off('sendBillInfoData')
    Bus.$on('sendBillInfoData', (params) => {
      Bus.$emit('sendTablePrintData', params)
      this.billInfoData = params
    })
    Bus.$off('getPermit2Project')
    Bus.$on('getPermit2Project', (guid) => {
      this.getPermit2Project(guid)
      this.clearCheckedItems()
      this.printContentType = 'bill'
    })
    // Bus.$off('sendBillInfoData')
    // Bus.$on('sendBillInfoData', (params) => {
    //   Bus.$emit('sendTablePrintData', params)
    //   this.billInfoData = params
    // })
  },
  mounted() {
    Bus.$emit('sendFormPrintData', this.checkedBasicItems)
    Bus.$emit('sendTablePrintData', this.checkedTablePrintData)
    Bus.$emit('sendStartLineNum', this.startLineNum)
    Bus.$emit('sendPosition', this.position)
  },
  methods: {
    clearCheckedItems() {
      this.checkedBasicItems = []
    },
    test() {
      console.log('收到的formdata是为：')
      console.table(this.formPrintData)
      console.log('当前的选择项是：', this.checkedBasicItems)
    },
    // 没有保存打印状态的字段。
    // getCheckedItems() {
    //   if (this.printContentType === 'bill') {
    //     return this.billInfoData.filter(item => item.printed === '1')
    //   } else {
    //     return []
    //   }
    // },
    getPermit2Project(guid) {
      getPermit2Project(guid).then(res => {
        this.billProjectData = res.data
      }).catch(err => {
        console.log(err)
      })
    },

    // getFormPrintTextArray() {
    //   return this.formPrintData.map(item => item.label)
    // },
    billInfoItemChange(val) {
      console.log(this.checkedBillInfoItems)
      console.log(val)
      // console.log(this.checkedTablePrintData)
      console.log(this.printContentType)
      console.log(this.startLineNum)
    },
    checkAllBasicItemChange(val) {
      console.log(val)
      this.checkedBasicItems = val ? this.formPrintData : []
      this.isIndeterminate = false
    },
    basicItemChange(val) {
      console.log(val)
      Bus.$emit('sendFormPrintData', val)
      const checkedCount = val.length
      this.checkAll = checkedCount === this.formPrintData.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.formPrintData.length
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

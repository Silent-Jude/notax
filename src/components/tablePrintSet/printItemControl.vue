<!-- 打印项控制组件。 -->
<template>
  <div class="print-item-control">
    <div class="control-top">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <slot name="title"/>
    </div>
    <div style="margin: 15px 0;"/>
    <el-checkbox-group v-model="checkedTexts" class="check-list" @change="handleCheckedItemsChange">
      <el-checkbox v-dragging="{item:item, list: templateData , group: groupCode }" v-for="(item,i) in templateData" :key="i" :label="item.text" class="check-item" >{{ item.text }} <slot :item="item"/></el-checkbox>
    </el-checkbox-group>
    <div class="custom">
      <el-button class="el-icon-plus add" @click="addItem">
        新增自定义项
      </el-button>
      <el-button class="el-icon-remove-outline remove" @click="removeItem">
        删除自定义项
      </el-button>
    </div>

    <el-dialog :visible.sync="removeCustomDialog" title="请勾选需要删除的自定义项！">
      <el-checkbox-group>
        <el-checkbox v-for="(item,i) of custom" :key="i" :label="item.text">{{ item.text }}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="removeCustomDialog = false">取 消</el-button>
        <el-button type="primary" @click="removeCustomDialog = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    templateData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      removeCustomDialog: false,
      custom: [],
      groupCode: '',
      checkedTexts: []
    }
  },

  computed: {
    checkAll: {
      get() {
        if (this.templateData.every(item => item.checked === true)) {
          return true
        }
        return false
      },
      set(val) {
        return val
      }
    },
    isIndeterminate: {
      get() {
      // 每一个都false,那么返回false
      // 每一个都true ，那么返回false，且checkAll为true
      // 否则返回true
        if (this.templateData.every(item => item.checked === true)) {
          return false
        }
        if (this.templateData.every(item => item.checked === false)) {
          return false
        }
        return true
      },
      set(val) {
        return val
      }
    }
  },

  watch: {
    templateData: {
      handler(newArray) {
        this.checkedTexts = newArray.filter(item => item.checked === true).map(item => item.text)
      },
      immediate: true,
      deep: true
    }
  },

  created() {
    this.groupCode = String(new Date().getTime()) + Math.random()
  },
  mounted() {
  },

  methods: {
    removeItem() {
      this.templateData.forEach((item, i) => {
        if (item.custom) {
          this.templateData.splice(i, 1)
        }
      })
    },
    addItem() {
      this.$prompt('请输入新增自定义项的名称！', '提示', {
        confirmButtonText: '确定新增',
        cancelButtonText: '取消新增',
        inputPattern: /.*[^\s]/,
        inputValidator: val => {
          if (this.templateData.find(item => item.text === val)) {
            return '已存在相同的项目，请检查！'
          }
        },
        closeOnClickModal: false,
        inputErrorMessage: '自定义项的名称不能为空！'
      }).then(({ value }) => {
        this.templateData.push({
          text: value,
          key: '',
          checked: false,
          custom: true
        })
      }).catch(() => {
      })
    },
    handleCheckAllChange(val) {
      if (val) {
        this.checkedTexts = this.templateData.map(item => item.text)
        this.templateData.forEach(item => { item.checked = true })
      } else {
        this.checkedTexts = []
        this.templateData.forEach(item => { item.checked = false })
      }
      this.isIndeterminate = false
    },
    handleCheckedItemsChange(value) {
      this.templateData.forEach(item => {
        if (value.includes(item.text)) {
          item.checked = true
        } else {
          item.checked = false
        }
      })
      console.log(value)
      console.dir(this.templateData)
      const checkedCount = value.length
      this.checkAll = checkedCount === this.templateData.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.templateData.length
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.print-item-control{
 .el-checkbox+.el-checkbox{
    margin-left: 0
  }
  .el-button+.el-button{
    margin-left: 0
  }
  .control-top{
    height: 20px;
    line-height: 20px;
    text-align: end;
    display:flex;
    justify-content:space-between;
  }
  .check-list{
    display: flex;
    flex-direction: column;
    align-items:flex-start;
    // .width{
    //   margin-top:5px;
    //   border: 1px solid #000;
    //   width:50px
    // }
  }
  .custom{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .add,.remove{
      height: 20px;
      padding: 0;
      border: none;
      margin-top: 15px
    }
  }
}

</style>

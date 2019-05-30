<!-- 打印项控制组件。 -->
<template>
  <div class="print-item-control">
    <div class="control-top">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <slot name="title" />
    </div>
    <div style="margin: 15px 0;" />
    <el-checkbox-group v-model="checkedTexts" class="check-list" @change="handleCheckedCitiesChange">
      <el-checkbox v-dragging="{item:item, list: templateData , group: groupCode }" v-for="(item,i) in templateData" :key="i" :label="item.text" class="check-item">{{ item.text }}
        <slot :item="item" />
      </el-checkbox>
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

    <div v-if="messageBoxVisible" class="shadow">
      <div class="message-box">
        <el-row>
          <el-col>
            <h1 class="title">提示</h1>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <p class="message">请输入新增模板的名称！</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-input v-model.trim="addTempLateName" type="text" class="input" @input="validator" />
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <p v-if="errMessage!==true" class="error">{{ errMessage }}</p>
            <p v-else> &nbsp; </p>
          </el-col>
        </el-row>
        <el-row class="foot">
          <el-col :offset="12">
            <el-button size="mini" type="info" plain @click="cancel">取消新增</el-button>
            <el-button size="mini" type="primary" @click="confirm">确认新增</el-button>
          </el-col>
        </el-row>
      </div>
    </div>

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
      errMessage: true,
      addTempLateName: '',
      messageBoxVisible: false,
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
    validator() {
      this.errMessage = this.templateData.find(item => item.text === this.addTempLateName) ? '已存在相同的项目，请检查！' : true
    },
    cancel() {
      this.messageBoxVisible = false
    },
    confirm() {
      if (this.addTempLateName) {
        if (this.errMessage === true) {
          this.messageBoxVisible = false
          this.templateData.push({
            text: this.addTempLateName,
            key: '',
            checked: false,
            custom: true
          })
        }
      } else {
        this.errMessage = '模板名称不能为空！'
      }
    },
    removeItem() {
      this.templateData.forEach((item, i) => {
        if (item.custom) {
          this.templateData.splice(i, 1)
        }
      })
    },
    addItem() {
      this.messageBoxVisible = true
      // this.$prompt('请输入新增自定义项的名称！', '提示', {
      //   confirmButtonText: '确定新增',
      //   cancelButtonText: '取消新增',
      //   inputPattern: /.*[^\s]/,
      //   inputValidator: val => {
      //     if (this.templateData.find(item => item.text === val)) {
      //       return '已存在相同的项目，请检查！'
      //     }
      //   },
      //   closeOnClickModal: false,
      //   inputErrorMessage: '自定义项的名称不能为空！'
      // }).then(({ value }) => {
      //   this.templateData.push({
      //     text: value,
      //     key: '',
      //     checked: false,
      //     custom: true
      //   })
      // }).catch(() => {
      // })
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
    handleCheckedCitiesChange(value) {
      this.templateData.forEach(item => {
        if (value.includes(item.text)) {
          item.checked = true
        } else {
          item.checked = false
        }
      })
      console.dir(this.templateData)
      const checkedCount = value.length
      this.checkAll = checkedCount === this.templateData.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.templateData.length
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.print-item-control {
  .el-checkbox + .el-checkbox {
    margin-left: 0;
  }
  .el-button + .el-button {
    margin-left: 0;
  }
  .control-top {
    height: 20px;
    line-height: 20px;
    text-align: end;
    display: flex;
    justify-content: space-between;
  }
  .check-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    // .width{
    //   margin-top:5px;
    //   border: 1px solid #000;
    //   width:50px
    // }
  }
  .custom {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .add,
    .remove {
      height: 20px;
      padding: 0;
      border: none;
      margin-top: 15px;
    }
  }
}
.shadow {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
  .message-box {
    width: 425px;
    height: 214px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .title {
      text-align: left;
      font-size: 18px;
      font-weight: 700;
      color: rgb(48, 49, 51);
      margin-left: 20px;
      // outline-color:rgb(48, 49, 51)
    }
    .message {
      color: rgb(96, 98, 102);
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 20px;
      margin-left: 20px;
    }
    .input {
      padding-left: 20px;
      padding-right: 20px;
    }
    .error {
      color: red;
      padding-left: 20px;
    }
    .foot {
      margin-top: 30px;
    }
  }
}
</style>

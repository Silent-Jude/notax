<template>
  <div class="formgroup">
    <el-form ref="form" :rules="rules" :disabled="$store.getters.savestate===0" :model="form" size="mini" label-width="100px">
      <el-row>
        <el-col :span="16">
          <el-form-item label="行政区划">
            <el-input v-model="form.admdivcode" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="年度">
            <el-date-picker v-model="form.year" disabled type="year" placeholder="选择年" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="仓库编码" prop="storagecode">
            <el-input v-model="form.storagecode" @focus="clearValidate"/>
          </el-form-item>
        </el-col>
        <el-col :span="12"/>
      </el-row>
      <el-form-item label="仓库名称" prop="storagename">
        <el-input v-model="form.storagename" @focus="clearValidate"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="拼音简码" prop="pinyinshortcode">
            <el-input v-model="form.pinyinshortcode"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="默认价格" prop="defaultprice">
            <el-select v-model="form.defaultprice" placeholder="">
              <el-option label="单位价格" value="D108_01"/>
              <el-option label="成本价格" value="D108_02"/>
              <el-option label="财政价格" value="D108_03"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="工体费单位编码" prop="chgagencycode">
            <el-input v-model="form.chgagencycode"/>
          </el-form-item>
        </el-col>
        <el-col :span="12"/>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item >
            <el-checkbox-group v-model="form.mainstoragemark">
              <el-checkbox label="1" name="mainstoragemark">总库标志</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="isenabled">
            <el-radio-group v-model="form.isenabled" :disabled="$store.getters.savestate===0" @focus="clearValidate">
              <el-radio :label="0">停用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Bus from '@/utils/Bus'
import request from '@/utils/request'
export default {
  name: 'Formgroup',
  props: {
    form: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      iptstate: (this.$store.getters.savestate === 0),
      rules: {
        // 定义规则。
        storagecode: [
          { required: true, message: '仓库编码不能为空！', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
        ],
        storagename: [
          { required: true, message: '仓库名称不能为空！', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        isenabled: [
          { required: true, message: '请选择是否启用！', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      selectedSubMenuGuid: state => state.app.selectedSubMenuGuid
    }),
    mainStorageMarkBool: {
      get() {
        return +(this.form.mainstoragemark) === 1
      },
      set(val) {
        return val
        // if (val) {
        //   return
        // } else {
        //   return 0
        // }
      }
    }
    // mainStorageMarkNumber() {
    // }
  },
  created() {
    Bus.$off('submitForm')
    Bus.$on('submitForm', () => {
      this.submitForm()
    })
    Bus.$off('resetForm')
    Bus.$on('resetForm', () => {
      this.resetForm('form')
    })
    Bus.$off('checkForm')
    Bus.$on('checkForm', () => {
      this.checkForm()
    })
    Bus.$off('clearForm')
    Bus.$on('clearForm', () => {
      this.clearForm()
    })
  },
  methods: {
    // 保存提交
    submitForm(formName) {
      console.log('提交的数据表单资料是：', this.form)
      this.$refs.form.validate((valid) => {
        if (valid) {
          var status = this.$store.getters.savestate
          var params = {}
          // 不同的api接口，直接替换一下url字段即可。
          var url = '/bas/basBillstorage'
          if (status === 0) {
            return
          } else if (status === 1) {
            // status为1时，点击保存键是添加功能。
            params = Object.assign({}, this.form)
            params.parentguid = params.guid
            // guid不能传过去，否则会变成修改。
            delete params.guid
            delete params.id
            params.levelnum++
            // 保存添加-----------------
            url = url + '/save'
            request({
              url,
              method: 'post',
              params
            }).then(res => {
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              })
              // 获取更新之后的数据。
              Bus.$emit('getTreeNodeInfo')
              // 修改按钮组状态
              this.$store.dispatch('SETSAVESTATE', 0)
              // 设置父节点状态
              Bus.$emit('handleFocusCurrentNode', res.data.guid)
            }).catch((err) => {
              console.log(err)
            })
          } else if (status === 2) {
            // status为2时，点击保存键是提交修改功能。
            params = this.form
            // 保存修改-------------------
            url = url + '/update'
            request({
              url,
              method: 'post',
              params
            }).then(res => {
              this.$message({
                showClose: true,
                message: '修改成功',
                type: 'success'
              })
              // 获取更新之后的数据。
              Bus.$emit('getTreeNodeInfo')
              this.$store.dispatch('SETSAVESTATE', 0)
              // 设置当前节点状态
              Bus.$emit('handleFocusCurrentNode', this.selectedSubMenuGuid)
            }).catch((err) => {
              console.log('修改服务器端返回错误码！', err)
            })
          }
        } else {
          this.$message({
            showClose: true,
            message: '填写有误，请重新填写',
            type: 'error'
          })
          return false
        }
      })
    },
    clearValidate() {
      this.$refs['form'].clearValidate()
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate()
      Bus.$emit('getDetailRequest', { guid: this.selectedSubMenuGuid })
      console.log(this.form)
    },
    clearForm() {
      this.$refs['form'].resetFields()
    }

  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>

</style>

<template>
  <div class="formgroup">
    <el-form ref="form" :rules="rules" :model="form" size="mini" label-width="110px">
      <el-row>
        <el-col :span="16">
          <el-form-item label="行政区划">
            <el-input v-model="form.admdivcode" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="年度" label-width="50px">
            <el-date-picker v-model="form.year" disabled type="year" placeholder="选择年" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="资金性质编码" prop="fundtypecode">
            <el-input v-model="form.fundtypecode" :disabled="$store.getters.savestate===0" @focus="clearValidate"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="" label-width="60px">
            <el-radio-group v-model="form.isenabled" :disabled="$store.getters.savestate===0">
              <el-radio :label="0">停用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="资金性质名称" prop="fundtypename">
        <el-input v-model="form.fundtypename" :disabled="$store.getters.savestate===0" @focus="clearValidate"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" :disabled="$store.getters.savestate===0" type="textarea"/>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="$store.getters.savestate===0" @click="submitForm('form')">提交</el-button>
        <el-button :disabled="$store.getters.savestate===0" @click="resetForm('form')">重置</el-button>
      </el-form-item>
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
        return {
        }
      }
    }
  },
  data() {
    return {
      iptstate: (this.$store.getters.savestate === 0),
      rules: {
        // 定义规则。
        fundtypecode: [
          { required: true, message: '资金性质编码不能为空！', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
        ],
        fundtypename: [
          { required: true, message: '资金性质名称不能为空！', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      selectedSubMenuGuid: state => state.app.selectedSubMenuGuid
    })
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
      console.log(this.form)
      this.$refs.form.validate((valid) => {
        if (valid) {
          var status = this.$store.getters.savestate
          var params = {}
          // 不同的api接口，直接替换一下url字段即可。
          var url = 'basFundtype'
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
            url = '/bas/' + url + '/save'
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
            url = '/bas/' + url + '/update'
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


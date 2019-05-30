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
          <el-form-item label="银行网点编码" prop="bankbranchcode">
            <el-input v-model="form.bankbranchcode" @focus="clearValidate"/>
          </el-form-item>
        </el-col>
        <el-col :span="12"/>
      </el-row>
      <el-form-item label="银行网点名称" prop="bankbranchname">
        <el-input v-model="form.bankbranchname" @focus="clearValidate"/>
      </el-form-item>
      <el-form-item label="所属银行" prop="parentguid">
        <el-input v-model="form.parentguid"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人" prop="attn">
            <el-input v-model="form.attn"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="attntel ">
            <el-input v-model="form.attntel"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="联系地址" prop="address">
        <el-input v-model="form.address"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="会计科目代码" prop="accountclsenumcode">
            <el-input v-model="form.accountclsenumcode"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="isenabled">
            <el-radio-group v-model="form.isenabled" @focus="clearValidate">
              <el-radio :label="0">停用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="" prop="buscollbranck">
            <el-checkbox v-model="form.buscollbranck">是否业务归集网点</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12"/>
      </el-row>
      <el-form-item>
        <el-button @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
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
        return {}
      }
    }
  },
  data() {
    return {
      bankcode: '',
      iptstate: (this.$store.getters.savestate === 0),
      rules: {
        // 定义规则。
        bankbranchcode: [
          { required: true, message: '银行网点编码不能为空！', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
        ],
        bankbranchname: [
          { required: true, message: '银行网点名称不能为空！', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
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
    })
  },
  created() {
    Bus.$off('getBankCode')
    Bus.$on('getBankCode', (bankcode) => {
      console.log('收到的bankid为', bankcode)
      this.bankcode = bankcode
    })

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
  mounted() {
  },
  methods: {
    // 保存提交
    submitForm(formName) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          var status = this.$store.getters.savestate
          var params = {}
          // 不同的api接口，直接替换一下url字段即可。
          var url = '/sys/basBankbranch'
          if (status === 0) {
            return
          } else if (status === 1) {
            // status为1时，点击保存键是添加功能。
            params = Object.assign({}, this.form)
            // 这里不一样！！不能在全部下面添加。只能在下面节点添加。且传过去的parentguid必须是当前选中节点的guid，逻辑单独处理。
            params.parentguid = this.selectedSubMenuGuid
            params.bankcode = this.selectedSubMenuGuid
            // params.parentguid = params.guid
            // guid不能传过去，否则会变成修改。
            delete params.guid
            delete params.id
            if (params.levelnum) {
              params.levelnum++
            } else {
              params.levelnum = 1
            }
            // 保存添加-----------------

            url = url + '/save'
            console.log('发送的参数为:', params)
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


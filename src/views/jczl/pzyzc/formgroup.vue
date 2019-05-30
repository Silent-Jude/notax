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
          <el-form-item label="印刷厂编码" prop="printingid">
            <el-input v-model="form.printingid" @focus="clearValidate"/>
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
      <el-form-item label="印刷厂名称" prop="printingname">
        <el-input v-model="form.printingname" @focus="clearValidate"/>
      </el-form-item>
      <el-form-item label="印刷厂地址" prop="address">
        <el-input v-model="form.address"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="拼音编码" prop="pinyinshotcode">
            <el-input v-model="form.pinyinshotcode"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机构代码" prop="agencycode">
            <el-input v-model="form.agencycode"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="邮政编码" prop="zipcode">
            <el-input v-model="form.zipcode"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="置业执照编码" prop="buslicensecode">
            <el-input v-model="form.buslicensecode"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="国税编码" prop="irscode">
            <el-input v-model="form.irscode"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地税编码" prop="localtaxcode">
            <el-input v-model="form.localtaxcode"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="特种许可证号" prop="specialpermitno">
            <el-input v-model="form.specialpermitno"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="印刷许可证号" prop="printpermitno">
            <el-input v-model="form.printpermitno"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="法人代表" prop="legalperson">
            <el-input v-model="form.legalperson"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法人电话" prop="legalpersontel">
            <el-input v-model="form.legalpersontel"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="财政负责人" prop="treasurer">
            <el-input v-model="form.treasurer"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="财政电话" prop="treasurertel">
            <el-input v-model="form.treasurertel"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="业务负责人" prop="busleader">
            <el-input v-model="form.busleader"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务电话" prop="busleadertel">
            <el-input v-model="form.busleadertel"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="开户银行" prop="bankname">
        <el-input v-model="form.bankname"/>
      </el-form-item>
      <el-form-item label="银行账号" prop="bankacctno">
        <el-input v-model="form.bankacctno"/>
      </el-form-item>
      <el-form-item label="开户名称" prop="acctname">
        <el-input v-model="form.acctname"/>
      </el-form-item>
      <el-form-item label="对应仓库" prop="storageid">
        <el-input v-model="form.storageid"/>
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
      iptstate: (this.$store.getters.savestate === 0),
      rules: {
        // 定义规则。
        printingid: [
          { required: true, message: '印刷厂编码不能为空！', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
        ],
        printingname: [
          { required: true, message: '印刷厂名称不能为空！', trigger: 'blur' },
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
          var url = '/bas/basBillprinting'
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


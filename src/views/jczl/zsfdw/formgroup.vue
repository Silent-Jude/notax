<template>
  <div class="formgroup">
    <el-form ref="form" :rules="rules" :model="form" :disabled="$store.getters.savestate===0" size="mini" label-width="100px">
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
        <el-col :span="16">
          <el-form-item label="执收单位编码" prop="agencycode">
            <el-input v-model="form.agencycode" :disabled="$store.getters.savestate===0" @focus="clearValidate"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单位性质" prop="agencykind">
            <el-select v-model="form.agencykind">
              <el-option label="区域一" value="shanghai"/>
              <el-option label="区域二" value="beijing"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="执收单位名称" prop="agencyname">
        <el-input v-model="form.agencyname" :disabled="$store.getters.savestate===0" @focus="clearValidate"/>
      </el-form-item>
      <el-form-item label="联系地址" prop="address">
        <el-input v-model="form.address"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构代码" prop="orgcode">
            <el-input v-model="form.orgcode"/>
          </el-form-item>
        </el-col>
        <el-col :span="12"/>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="财政负责人" prop="treasurer">
            <el-input v-model="form.treasurer"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="treasurertel">
            <el-input v-model="form.treasurertel" :disabled="$store.getters.savestate===0"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="单位简称" prop="agencyshortname">
        <el-input v-model="form.agencyshortname" :disabled="$store.getters.savestate===0"/>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="外部编码" prop="foreigncode">
            <el-input v-model="form.foreigncode" :disabled="$store.getters.savestate===0"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="拼音简码" prop="pinyincode">
            <el-input v-model="form.pinyincode" :disabled="$store.getters.savestate===0"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="经办人" prop="attn">
            <el-input v-model="form.attn" :disabled="$store.getters.savestate===0"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经办人电话" prop="attntel">
            <el-input v-model="form.attntel" :disabled="$store.getters.savestate===0"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="所属收费区域" prop="chargearea">
        <el-input v-model="form.chargearea" :disabled="$store.getters.savestate===0"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="预算拨款性质" prop="budgetkind">
            <el-select v-model="form.budgetkind" :disabled="$store.getters.savestate===0" placeholder="2019">
              <el-option label="区域一" value="shanghai"/>
              <el-option label="区域二" value="beijing"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位等级" prop="agencyrank">
            <el-select v-model="form.agencyrank" :disabled="$store.getters.savestate===0" placeholder="2019">
              <el-option label="区域一" value="shanghai"/>
              <el-option label="区域二" value="beijing"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="" label-width="60px" prop="ishall">
            <el-radio-group v-model="form.ishall" :disabled="$store.getters.savestate===0">
              <el-radio :label="0">单位</el-radio>
              <el-radio :label="1">大厅</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="remotedisplaymark">
            <el-checkbox-group v-model="form.remotedisplaymark" :disabled="$store.getters.savestate===0">
              <el-checkbox label="异地显示" name="type"/>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="" label-width="60px" prop="isenabled">
            <el-radio-group v-model="form.isenabled" :disabled="$store.getters.savestate===0" @focus="clearValidate">
              <el-radio :label="0">停用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12"/>
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
        agencycode: [
          { required: true, message: '执收单位编码不能为空！', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
        ],
        agencyname: [
          { required: true, message: '执收单位名称不能为空！', trigger: 'blur' },
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
          var url = 'basChargeagency'
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

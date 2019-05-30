<template>
  <div class="formgroup">
    <el-form ref="form" :rules="rules" :disabled="$store.getters.savestate===0" :model="form" size="mini" label-width="100px">
      <el-row>
        <el-col :span="16">
          <el-form-item label="行政区划">
            <el-input v-model="form.admdivcode"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="年度">
            <el-date-picker v-model="form.year" disabled type="year" placeholder="选择年" />
          </el-form-item>
        </el-col>
      </el-row>
      <fieldset class="fieldset_wrap">
        <legend>领用证基本信息</legend>
        <el-form-item label="执收单位" prop="">
          <!-- basChargeagency. -->
          <el-input v-model="form.basChargeagency.agencyname" @focus="clearValidate"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="领用证编号" prop="permitno">
              <el-input v-model="form.permitno" @focus="clearValidate"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="办理日期" prop="transactdate">
              <el-date-picker
                v-model="form.transactdate"
                type="date"
                placeholder="选择年"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="领用证名称" prop="billpermitname">
          <el-input v-model="form.billpermitname" @focus="clearValidate"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="收费许可证号" prop="chargepermitno">
              <el-input v-model="form.chargepermitno"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="票据主管部门" prop="billmanagement">
              <el-input v-model="form.billmanagement"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="票据管理员" prop="attn">
              <el-input v-model="form.attn"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="换证日期" prop="retransactdatemark">
              <el-date-picker
                v-model="form.transactdate"
                type="date"
                placeholder="选择年"/>
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <el-row>
        <el-col :span="12">
          <el-form-item label="经办人身份证" prop="attn">
            <el-input v-model="form.identityid"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经手人电话" prop="attntel">
            <el-input v-model="form.attntel" @focus="clearValidate"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="单位适用价格" prop="applypricetype">
            <el-select v-model="form.applypricetype" placeholder="2019">
              <el-option label="财政价格" value="D108_03"/>
              <el-option label="成本价格" value="D108_02"/>
              <el-option label="单位价格" value="D108_01"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="领用票据仓库" prop="billreceivestorage">
            <el-select v-model="form.billreceivestorage" placeholder="请选择领用票据仓库">
              <el-option v-for="(item,i) of basBillStorage" :key="i" :label="item.storagename" :value="item.storagecode"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="autoattestmark">
            <el-checkbox v-model="form.autoattestmark" label="自动认领"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="级别" prop="permitlevel">
            <el-select v-model="form.permitlevel" placeholder="请选择级别">
              <el-option label="本级" value="D110_01"/>
              <el-option label="下级" value="D110_02"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="">
            <el-radio-group v-model="form.isenabled">
              <el-radio :label="0">停用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="银行执收范围" prop="bankchargescope">
        <el-input v-model="form.bankchargescope" type="textarea"/>
      </el-form-item>
      <el-form-item label="单位执收范围" prop="agencychargescope">
        <el-input v-model="form.agencychargescope" type="textarea"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Bus from '@/utils/Bus'
import request from '@/utils/request'
import { getBasBillStorage } from '@/api/jczl'
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
      basBillStorage: [],
      iptstate: (this.$store.getters.savestate === 0),
      rules: {
        // 定义规则。
        chargetypecode: [
          { required: true, message: '收费类别编码不能为空！', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
        ],
        chargetypename: [
          { required: true, message: '收费类别名称不能为空！', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      detailInfo: state => state.app.detailInfo,
      selectedSubMenuGuid: state => state.app.selectedSubMenuGuid
    })
  },
  created() {
    getBasBillStorage().then(res => {
      this.basBillStorage = res.data
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
  methods: {
    // 保存提交
    submitForm(formName) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          var status = this.$store.getters.savestate
          var params = {}
          // 不同的api接口，直接替换一下url字段即可。
          var url = '/bas/basBillpermit'
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
              console.log(err)
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
      console.log(this.detailInfo)
    },
    clearForm() {
      this.$refs['form'].resetFields()
    }

  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.fieldset_wrap{
  padding-left: 10px;
  padding-right: 10px;

  margin-bottom: 15px
}
</style>

<template>
  <div class="formgroup">
    <el-form ref="form" :rules="rules" :disabled="$store.getters.savestate===0" :model="form" size="mini" label-width="108px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="银行编码">
            <el-input v-model="form.basRemittedbank.bankcode" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="版本控制" prop="version">
            <el-select v-model="form.version" placeholder="请选择版本号" @focus="clearValidate">
              <el-option label="V1.0版" value="D111_02" />
              <el-option label="V2.0版" value="D111_01" />
              <el-option label="V3.0版" value="D111_03" />
            </el-select>
          </el-form-item>
          <!-- 需要发送请求后台查询版本编码对应的版本文字。 -->
        </el-col>
      </el-row>
      <el-form-item label="银行名称" prop="bankname">
        <el-input
          v-model="form.bankname"
          clearable
          placeholder="请选择银行汇缴账户" >
          <el-button slot="append" icon="el-icon-caret-bottom" @click="showBankAccount"/>
        </el-input>
      </el-form-item>
      <!-- 需要弹出选择框 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="签到日期">
            <el-input v-model="form.signdate" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="签到时间">
            <el-input v-model="form.signtime" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="会话标识">
            <el-input v-model="form.sid" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年度">
            <el-date-picker v-model="form.year" disabled type="year" placeholder="选择年" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="前次签到日期">
            <el-input v-model="form.lastsigndate" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="前次签到时间">
            <el-input v-model="form.lastsigntime" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="1001金额单位" prop="bank1001">
            <el-select v-model="form.bank1001" placeholder="请选择金额单位">
              <el-option label="元" value="0" />
              <el-option label="分" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="6001金额单位" prop="bank6001">
            <el-select v-model="form.bank6001" placeholder="请选择金额单位">
              <el-option label="元" value="0" />
              <el-option label="分" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="上次资金日报日期" prop="funddailydailymark">
            <el-input v-model="form.funddailydailymark" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上次收入日报日期" prop="incdailyuploaddate">
            <el-input v-model="form.incdailyuploaddate" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label-width="0" label="" prop="strictctlfunddailymark">
            <el-checkbox v-model="form.strictctlfunddailymark">严格控制资金日报上传</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="0" label="" prop="strictctlincdailymark">
            <el-checkbox v-model="form.strictctlincdailymark">严格控制收入日报上传</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="0" label="" prop="enablesecuritycode">
            <el-checkbox v-model="form.enablesecuritycode">补录交易启用安全码</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label-width="0" label="" prop="backfileextmark">
            <el-checkbox v-model="form.backfileextmark">采用压缩文件格式</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="0" label="" prop="accconfirmmark">
            <el-checkbox v-model="form.accconfirmmark">对账包含待查流水号</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="0" label="" prop="isenabled">
            <el-radio-group v-model="form.isenabled" @focus="clearValidate">
              <el-radio :label="0">停用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label-width="0" label="" prop="bank4002">
            <el-checkbox v-model="form.bank4002">检查4002交易流水号</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="0" label="" prop="splitcontributionsmark">
            <el-checkbox v-model="form.splitcontributionsmark">汇总全额明细拆分</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="0" label="" prop="lockstate">
            <el-radio-group v-model="form.lockstate" @focus="clearValidate">
              <el-radio :label="'0'">锁定</el-radio>
              <el-radio :label="'1'">解锁</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 请选择银行汇缴结算户 -->
    <layer ref="bankAccount" :modal="false" :tb-head="bankAccountHead" :form="bankAccountForm" :table-data="bankAccountTableList" title="请选择银行汇缴结算户" @select="bankAccountSelected" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Bus from '@/utils/Bus'
import request from '@/utils/request'
import layer from '@/components/layer'
import { getBankAccount } from '@/api/jczl'
export default {
  name: 'Formgroup',
  components: {
    layer
  },
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
      bankAccountTableList: [],
      bankAccountForm: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            key: 'bankcode',
            val: '银行编码'
          },
          {
            key: 'bankname',
            val: '银行名称'
          }
        ],
        equal: ''
      },
      bankAccountHead: [
        {
          width: 200,
          prop: 'bankcode',
          label: '银行编码'
        },
        {
          width: 400,
          prop: 'bankname',
          label: '银行名称'
        }
      ],
      iptstate: (this.$store.getters.savestate === 0),
      rules: {
        // 定义规则。
        // bankname: [
        //   { required: true, message: '银行名称不能为空！', trigger: 'blur' },
        //   { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
        // ],
        version: [
          { required: true, message: '版本号不能为空！', trigger: 'blur' }
        ],
        lockstate: [
          { required: true, message: '请选择锁定状态！', trigger: 'blur' }
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
    this.getBankAccountTableList()
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
    bankAccountSelected(datas) {
      this.form.bankname = datas.currentRow.bankname
      this.form.basRemittedbank.bankcode = datas.currentRow.bankcode
      console.log(datas)
      // this.
    },
    getBankAccountTableList() {
      getBankAccount().then(res => {
        this.bankAccountTableList = res.data
      })
    },

    showBankAccount() {
      this.$refs.bankAccount.dialogTableVisible = true
    },
    // 保存提交
    submitForm(formName) {
      console.log(this.form)
      this.$refs.form.validate((valid) => {
        if (valid) {
          var status = this.$store.getters.savestate
          var params = {}
          // 不同的api接口，直接替换一下url字段即可。
          var url = '/bas/basBankfrontmac'
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

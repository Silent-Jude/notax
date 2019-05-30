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
          <el-form-item label="票据编码" prop="billcode">
            <el-input v-model="form.billcode " @focus="clearValidate"/>
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
      <el-form-item label="票据名称" prop="billname">
        <el-input v-model="form.billname" @focus="clearValidate"/>
      </el-form-item>
      <el-form-item label="票据规格" prop="specification">
        <el-input v-model="form.specification" @focus="clearValidate"/>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="拼音编码" prop="pinyincode">
            <el-input v-model="form.pinyincode" @focus="clearValidate"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="票据联数" prop="partsnum">
            <el-input v-model="form.partsnum" @focus="clearValidate"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="计价方式" prop="pricingmet">
            <el-select v-model="form.pricingmet" placeholder="请选择计价方式！" @focus="clearValidate">
              <el-option label="方式一" value="1"/>
              <el-option label="方式二" value="2"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="每本份数" prop="portions">
            <el-input v-model="form.portions" @focus="clearValidate"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="成本单价" prop="costprice">
            <el-input v-model="form.costprice" @focus="clearValidate"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="内部价格" prop="insiderprice">
            <el-input v-model="form.insiderprice" @focus="clearValidate"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="单位价格" prop="agencyprice">
            <el-input v-model="form.agencyprice" @focus="clearValidate"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="过期年限" prop="overyear">
            <el-input v-model="form.overyear" @focus="clearValidate"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="票据类型" prop="privatebilltype">
            <el-select v-model="form.privatebilltype" placeholder="2019">
              <el-option label="类型一" value="1"/>
              <el-option label="类型二" value="2"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" prop="agentchargemark">
            <el-checkbox v-model="form.agentchargemark" @focus="clearValidate">是否银行代收</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" prop="checkmark">
            <el-checkbox v-model="form.checkmark" @focus="clearValidate">校验标志</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="条目数" prop="itemsnum">
            <el-input-number v-model="form.itemsnum" :min="1" :max="10" controls-position="right" size="mini" class="numberCount"/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="号码长度" label-width="96px" prop="codelength">
            <el-input-number v-model="form.codelength" :min="1" :max="10" controls-position="right" size="mini" class="numberCount"/>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="" label-width="30px" prop="includetrack">
            <el-checkbox v-model="form.includetrack" @focus="clearValidate">票据号码中前两位表示字轨</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="工本费项目" prop="costchgproid">
            <el-input v-model="form.costchgproid"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="缴款期限" label-width="96px" prop="timelimit">
            <el-input-number v-model="form.timelimit"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="预警下限" prop="warnlimitlower">
            <el-input v-model="form.warnlimitlower" @focus="clearValidate"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预警上限" prop="warnlimitupper">
            <el-input v-model="form.warnlimitupper" @focus="clearValidate"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <el-form-item label="" label-width="16px" prop="collectprojectmark">
            <el-checkbox v-model="form.collectprojectmark">汇总项目</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="25px" label="" prop="chargeprojectid ">
            <el-input v-model="form.chargeprojectid"/>
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
        billcode: [
          { required: true, message: '票据编码不能为空！', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
        ],
        billname: [
          { required: true, message: '票据名称不能为空！', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        specification: [
          { required: true, message: '票据规格不能为空！', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        pinyincode: [
          { required: true, message: '拼音编码不能为空！', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        partsnum: [
          { required: true, message: '票据联数不能为空！', trigger: 'blur' }

        ],
        pricingmet: [
          { required: true, message: '请选择计价方式！', trigger: 'blur' }
        ],
        portions: [
          { required: true, message: '每本份数不能为空！', trigger: 'blur' }

        ],
        costprice: [
          { required: true, message: '成本单价不能为空！', trigger: 'blur' }

        ],
        insiderprice: [
          { required: true, message: '内部价格不能为空！', trigger: 'blur' }

        ],
        agencyprice: [
          { required: true, message: '单位价格不能为空！', trigger: 'blur' }

        ],
        overyear: [
          { required: true, message: '过期年限不能为空！', trigger: 'blur' }

        ],
        // 是否银行代收
        // agentchargemark: [
        //   { required: true, message: '是否银行代收不能为空！', trigger: 'blur' },
        //   { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        // ],
        // 校验标志
        // checkmark: [
        //   { required: true, message: '校验标志不能为空！', trigger: 'blur' },
        //   { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        // ],
        // 字轨
        // includetrack: [
        //   { required: true, message: '字轨不能为空！', trigger: 'blur' },
        //   { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        // ],
        warnlimitlower: [
          { required: true, message: '预警下限不能为空！', trigger: 'blur' }

        ],
        warnlimitupper: [
          { required: true, message: '预警上限不能为空！', trigger: 'blur' }

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
    console.log(this.form)
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
          var url = '/bas/basBillinfo'
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
.numberCount{
  width:100px;
  .el-input__inner{
    padding: 0 !important
  }
}
</style>

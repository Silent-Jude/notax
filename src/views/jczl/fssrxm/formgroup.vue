<template>
  <div class="formgroup">
    <el-form ref="form" :rules="rules" :disabled="$store.getters.savestate===0" :model="form" size="mini" label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="行政区划">
            <el-input v-model="form.admdivcode" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年度" label-width="50px">
            <el-date-picker v-model="form.year" disabled type="year" placeholder="选择年" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="收费项目编码" prop="nontaxcode">
            <el-input v-model="form.nontaxcode" @focus="clearValidate" />
          </el-form-item>
        </el-col>
        <el-col :span="12" />
      </el-row>

      <el-form-item label="收费项目名称" prop="nontaxname">
        <el-input v-model="form.nontaxname" @focus="clearValidate" />
      </el-form-item>
      <el-form-item label="收费项目全称" prop="nontaxfallname">
        <el-input v-model="form.nontaxfallname" />
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="收费计量单位" prop="chargeunit">
            <el-input v-model="form.chargeunit" />
          </el-form-item>
        </el-col>
        <el-col :span="12" />
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="收费标准下限">
            <el-input v-model="form.chargelower" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收费标准上限">
            <el-input v-model="form.chargelimit" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="所属收费类别">
        <el-input v-model="form.basChargetype.chargetypename" placeholder="请选择收费类别">
          <el-button slot="append" icon="el-icon-caret-bottom" @click="showChargetype" />
        </el-input>
      </el-form-item>
      <el-form-item label="所属资金性质">
        <el-input v-model="form.basFundtype.fundtypename" placeholder="请选择资金性质">
          <el-button slot="append" icon="el-icon-caret-bottom" @click="showFundtype" />
        </el-input>
      </el-form-item>
      <el-form-item label="预算科目名称">
        <el-input v-model="form.basBudgetsubject.incomesortname" placeholder="请选择科目名称">
          <el-button slot="append" icon="el-icon-caret-bottom" @click="showBudgetsubject" />
        </el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="征管方式" prop="collectionmet">
            <el-select v-model="form.collectionmet" placeholder="请选择">
              <el-option v-for="(item,i) of optionArray" :key="i" :label="item.value" :value="item.code" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" label-width="60px" prop="resource">
            <el-radio-group v-model="form.isenabled">
              <el-radio :label="0">停用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="">
        <el-row>
          <el-checkbox v-model="form.ispublicprogram" true-label="1" false-label="0">公用项目标志</el-checkbox>
          <el-checkbox v-model="form.allowquerymark" true-label="1" false-label="0">费征查询是否显示</el-checkbox>
          <el-checkbox v-model="form.internalcontactmark" true-label="1" false-label="0">是否为外来项目</el-checkbox>
        </el-row>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" />
      </el-form-item>

      <el-form-item>
        <el-button @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 选择所属收费类别 -->
    <layer ref="layer1" :tb-head="basChargetypeHead" :form="basChargetypeForm" :table-data="basChargetype" title="请选择收费类别" @select="basChargetypeSelect" />
    <!-- 选择所属资金性质 -->
    <layer ref="layer2" :tb-head="basFundtypeHead" :form="basFundtypeForm" :table-data="basFundtype" title="请选择资金性质" @select="basFundtypeSelect" />
    <!-- 选择预算科目名称 -->
    <layer ref="layer3" :tb-head="basBudgetsubjectHead" :form="basBudgetsubjectForm" :table-data="basBudgetsubject" title="请选择预算科目" @select="basBudgetsubjectSelect" />
  </div>
</template>

<script>
import layer from '@/components/layer'
import { mapState } from 'vuex'
import Bus from '@/utils/Bus'
import request from '@/utils/request'
import { getChargetype, getFundtype, getBudgetsubject } from '@/api/CommonApi'
// import { getBasChargetype } from '@/api/jczl'
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
      // 科目数据数组。
      basBudgetsubject: [],
      basBudgetsubjectForm: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '科目编号',
            key: 'incomesortcode'
          },
          {
            val: '科目名称',
            key: 'incomesortname'
          }
        ],
        equal: ''
      },
      basBudgetsubjectHead: [
        {
          prop: 'incomesortcode',
          label: '科目编号'
        },
        {
          prop: 'incomesortname',
          label: '科目名称'
        }
      ],
      // 资金性质编码
      basFundtype: [],
      basFundtypeForm: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '资金性质编码',
            key: 'fundtypecode'
          },
          {
            val: '资金性质名称',
            key: 'fundtypename'
          }
        ],
        equal: ''
      },
      basFundtypeHead: [
        {
          prop: 'fundtypecode',
          label: '资金性质编码'
        },
        {
          prop: 'fundtypename',
          label: '资金性质名称'
        }
      ],
      // 非税收入类别数据存放数组。
      basChargetype: [],
      basChargetypeHead: [
        {
          prop: 'chargetypecode',
          label: '收费类别编码'
        },
        {
          prop: 'chargetypename',
          label: '收费类别名称'
        }
      ],
      basChargetypeForm: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '收费类别编码',
            key: 'chargetypecode'
          },
          {
            val: '收费类别名称',
            key: 'chargetypename'
          }
        ],
        equal: ''
      },
      codeHead: 'D101',
      codeMap: {},
      optionArray: [],
      iptstate: (this.$store.getters.savestate === 0),
      rules: {
        // 定义规则。
        nontaxcode: [
          { required: true, message: '收费项目编码不能为空！', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
        ],
        nontaxname: [
          { required: true, message: '收费项目名称不能为空！', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      selectedSubMenuGuid: state => state.app.selectedSubMenuGuid,
      detailInfo: state => state.app.detailInfo
    })
  },
  created() {
    // getBasChargetype().then(res => {

    // })
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

    request({
      url: '/sys/sysDatadictionary/allKey',
      methods: 'get'
    }).then(res => {
      this.codeMap = res.data
      this.getOptionArray()
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    basBudgetsubjectSelect(datas) {
      this.form.incomesortguid = datas.currentRow.guid
      this.$set(this.form, 'basBudgetsubject', { incomesortname: datas.currentRow.incomesortname })
    },
    basFundtypeSelect(datas) {
      this.form.fundtypeguid = datas.currentRow.guid
      this.$set(this.form, 'basFundtype', { fundtypename: datas.currentRow.fundtypename })
    },
    basChargetypeSelect(datas) {
      this.form.chargetypeguid = datas.currentRow.guid
      this.$set(this.form, 'basChargetype', { chargetypename: datas.currentRow.chargetypename })
    },
    showBudgetsubject() {
      getBudgetsubject().then(res => {
        this.basBudgetsubject = res.data
        console.log('收到的预算科目为', this.basBudgetsubject)
        this.$refs.layer3.dialogTableVisible = true
      }).catch(err => { console.log(err) })
    },
    showFundtype() {
      getFundtype().then(res => {
        this.basFundtype = res.data
        this.$refs.layer2.dialogTableVisible = true
      }).catch(err => { console.log(err) })
    },
    showChargetype() {
      getChargetype().then(res => {
        this.basChargetype = res.data
        this.$refs.layer1.dialogTableVisible = true
      }).catch(err => { console.log(err) })
    },
    getOptionArray() {
      if (this.codeMap.hasOwnProperty(this.codeHead)) {
        this.optionArray = this.codeMap[this.codeHead].codes
      }
    },
    // 保存提交
    submitForm(formName) {
      console.log(this.form)
      this.$refs.form.validate((valid) => {
        if (valid) {
          var status = this.$store.getters.savestate
          var params = {}
          // 不同的api接口，直接替换一下url字段即可。
          var url = '/bas/basChargeproject'
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
    },
    setCollectionmet(val) {
      this.form.collectionmet = val
    }

  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.el-form-item--mini {
  margin-bottom: 15px;
}

</style>

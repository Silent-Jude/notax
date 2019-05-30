<template>

  <div class="formgroup">
    <el-row v-if="uploaddownload">
      <div style="margin-left:110px;margin-bottom:10px;">
        <el-upload
          ref="upload"
          :action="uploadPath"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :data="uploadData"
          :auto-upload="false"
          class="upload-demo">
          <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="mini" type="success" @click="submitUpload">上传文件</el-button>
        </el-upload>
      </div>
    </el-row>
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
          <el-form-item label="编码" prop="fno">
            <el-input v-model="form.fno" @focus="clearValidate" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-show="form.fileName" label="文件" prop="fno">
            <!-- <span @click="download">{{ form.fileName }}</span> -->
            <span style="color:red;">{{ form.fileName && '已有附件' }}</span>
            <el-button size="mini" @click="removeFile">删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="名称" prop="fname">
        <el-input v-model="form.fname" @focus="clearValidate" />
      </el-form-item>
      <el-form-item label="文件文号" prop="fnofile">
        <el-input v-model="form.fnofile" />
      </el-form-item>

      <el-row>
        <el-col :span="24">
          <el-form-item label="发文机关" prop="agencyname">
            <el-input v-model="form.agencyname" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12" /> -->
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="文件级次">
            <el-select v-model="form.flevel" placeholder="">
              <el-option v-for="item in flevel" :key="item.value" :label="item.value" :value="item.code"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件类型">
            <el-select v-model="form.ftype" placeholder="">
              <el-option v-for="item in ftype" :key="item.value" :label="item.value" :value="item.code"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="发文日期">
            <el-date-picker
              v-model="form.deliverdate"
              value-format="yyyy-MM-dd hh:mm:ss"
              type="date"
              placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="失效日期">
            <el-date-picker
              v-model="form.overdue"
              value-format="yyyy-MM-dd hh:mm:ss"
              type="date"
              placeholder="选择日期"/>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- <el-form-item label="预算科目名称">
        <el-input v-model="form.basBudgetsubject.incomesortname" placeholder="请选择科目名称">
          <el-button slot="append" icon="el-icon-caret-bottom" @click="showBudgetsubject" />
        </el-input>
      </el-form-item> -->
      <el-form-item label="主题词" prop="ftopic">
        <el-input v-model="form.ftopic" type="textarea" />
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
import { codesByKey } from '@/api/codesByKey.js'
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
      uploaddownload: false,
      flevel: [],
      ftype: [],
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
      },
      // URL
      uploadPath: process.env.BASE_API + '/pol/polProjectFnoFileLib/saveFile',
      // 主表GUID
      uploadData: {
        mainGuid: ''
      }
    }
  },
  computed: {
    ...mapState({
      selectedSubMenuGuid: state => state.app.selectedSubMenuGuid,
      detailInfo: state => state.app.detailInfo
    })
  },
  watch: {
    detailInfo() {
      this.uploaddownload = false
    }
  },
  created() {
    Bus.$off('download')
    Bus.$on('download', () => {
      alert(21)
      // this.$refs.sq.dialogTableVisible = true
      this.download()
    })
    // 上传
    Bus.$off('upload')
    Bus.$on('upload', () => {
      this.uploaddownload = true
    })
    codesByKey('D112').then(res => {
      this.flevel = res.data
    })
    codesByKey('D113').then(res => {
      this.ftype = res.data
    })
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
          var url = '/pol/polProjectFnoFileLib'
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
    },

    submitUpload() {
      this.uploadData.mainGuid = this.form.guid
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    download() {
      window.open(process.env.BASE_API + '/pol/polProjectFnoFileLib/download?guid=' + this.form.guid)
    },
    removeFile() {
      var url = '/pol/polProjectFnoFileLib/removeFile?guid=' + this.form.guid
      request({
        url,
        method: 'post'
      }).then(res => {
        console.log(res)
        this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
        this.form.fileName = ''
      })
    }

  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
  .el-form-item--mini {
    margin-bottom: 15px;
  }

</style>

<template>
  <div class="formgroup">
    <el-form ref="form" :model="form" disabled size="mini" label-width="100px">
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
        <legend>单位基本信息</legend>
        <el-row>
          <el-col :span="12">
            <el-form-item label="执行单位编码">
              <el-input v-model="form.agencycode"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位性质">
              <el-select v-model="form.agencykind" placeholder="请选择单位性质">
                <el-option label="行政" value="D104_01"/>
                <el-option label="事业" value="D104_02"/>
                <el-option label="其他" value="D104_03"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="执行单位名称">
          <el-input v-model="form.agencyname"/>
        </el-form-item>
        <el-form-item label="联系地址">
          <el-input v-model="form.address"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="机构代码">
              <el-input v-model="form.orgcode"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- <el-form-item label="">
            <el-checkbox label="是否末级" name="type"/>
          </el-form-item> -->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="财务负责人">
              <el-input v-model="form.treasurer"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话">
              <el-input v-model="form.treasurertel"/>
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <el-form-item label="单位简称">
        <el-input v-model="form.agencyshortname"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="外部编码">
            <el-input v-model="form.foreigncode"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="拼音简码">
            <el-input v-model="form.pinyincode"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="经办人">
            <el-input v-model="form.attn"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经办人电话">
            <el-input v-model="form.attntel"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="所属收费区域">
        <el-input v-model="form.chargearea"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="预算拨款性质">
            <el-select v-model="form.budgetkind" placeholder="请选择预算拨款性质">
              <el-option label="全额预算单位" value="D103_01"/>
              <el-option label="差额预算单位" value="D103_02"/>
              <el-option label="自收自支单位" value="D103_03"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位等级">
            <el-select v-model="form.agencyrank" placeholder="请选择单位等级">
              <el-option label="本级单位" value="D105_01"/>
              <el-option label="本级财政" value="D105_02"/>
              <el-option label="下级财政" value="D105_03"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="" prop="ishall">
            <el-radio-group v-model="form.ishall">
              <el-radio :label="0">单位</el-radio>
              <el-radio :label="1">大厅</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="remotedisplaymark">
            <el-checkbox label="异地显示" name="remotedisplaymark"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="" prop="isenabled">
            <el-radio-group v-model="form.isenabled">
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
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
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

<template>
  <div class="formgroup">
    <el-form ref="form" :model="form" size="mini" label-width="100px">
      <el-row>
        <el-col :span="16"><el-form-item label="套帐">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"/>
            <el-option label="区域二" value="beijing"/>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="8"><el-form-item label="活动名称">
          <el-input v-model="form.name"/>
        </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="会计科目编码">
        <el-input v-model="form.admdivcode"/>
      </el-form-item>
      <el-form-item label="会计科目名称">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="会计科目类别">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"/>
          <el-option label="区域二" value="beijing"/>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="方向">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"/>
              <el-option label="区域二" value="beijing"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="币种">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"/>
              <el-option label="区域二" value="beijing"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="核算数量">
            <el-input v-model="form.name"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计量单位">
            <el-input v-model="form.name"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="">
        <el-checkbox-group v-model="form.type">
          <el-row>
            <el-checkbox label="是否辅助单位" name="type"/>
            <el-checkbox label="是否辅助部门" name="type"/>
            <el-checkbox label="是否辅助项目" name="type"/>
          </el-row>
          <el-row>
            <el-checkbox label="是否银行科目" name="type"/>
            <el-checkbox label="是否外币核算" name="type"/>
          </el-row>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.desc" type="textarea"/>
      </el-form-item>
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


<template>
  <div class="formgroup">
    <el-form ref="form" :model="form" size="mini" label-width="100px">
      <el-row>
        <el-col :span="16">
          <el-form-item label="套账">
            <el-select v-model="form.region" placeholder="2019">
              <el-option label="区域一" value="shanghai"/>
              <el-option label="区域二" value="beijing"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8"/>
      </el-row>

      <el-row>
        <el-col :span="16">
          <el-form-item label="行政区划">
            <el-input v-model="form.name"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="年度">
            <el-select v-model="form.region" placeholder="2019">
              <el-option label="区域一" value="shanghai"/>
              <el-option label="区域二" value="beijing"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="核算项目编码">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="核算项目编名称">
        <el-input v-model="form.name"/>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="对应编码">
            <el-input v-model="form.name"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="核算项目类型">
            <el-select v-model="form.region" placeholder="">
              <el-option label="区域一" value="shanghai"/>
              <el-option label="区域二" value="beijing"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="国库编码">
        <el-input v-model="form.name"/>
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
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        num4: 1
      },
      num8: 1
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    handleChange(value) {
      console.log(value)
    }
  }
}
</script>


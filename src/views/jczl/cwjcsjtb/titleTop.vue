<template>
  <div class="title">
    <h1>辅助核算同步</h1>
    <div>
      <el-form ref="form" :model="form" size="mini" label-width="70px">
        <el-row>
          <el-col :span="4">
            <el-form-item label-width="50px" label="套账">
              <el-select v-model="form.region" placeholder="">
                <el-option label="区域一" value="shanghai"/>
                <el-option label="区域二" value="beijing"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="业务类型">
              <el-input v-model="form.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="当前年度">
              <el-input v-model="form.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="50px" label="备注">
              <el-input v-model="form.name"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <el-button size="mini" type="primary" @click="onSubmit">同步到财务</el-button>
          </el-col>
          <el-col :span="3">
            <el-button size="mini" type="primary">同步到非税</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
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
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  h1{
    height: 40px;
    line-height: 40px;
    text-decoration: underline;
    font-size: 20px;
    text-align: center;
    font-weight: 700;
    margin-bottom: 20px;
  }

}
</style>


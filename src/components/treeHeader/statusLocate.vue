<!-- 根据状态定位，
全部，启用，停用，三种状态。
-->
<template>
  <div class="location-search">
    <fieldset class="fileset-wrap">
      <legend>定位</legend>
      <div class="wrap">
        <el-input v-model="inputVal" size="mini" placeholder="请输入代码或拼音" class="input-search" />
        <template>
          <!-- <div class="radio-type"> -->
          <el-radio v-model="searchType" label="code">代码</el-radio>
          <el-radio v-model="searchType" label="spell">拼音</el-radio>
          <!-- </div> -->
        </template>
        <el-button size="mini" class="next">下一个</el-button>
      </div>
      <div class="status">
        <template>
          <el-radio-group v-model="status">
            <el-radio label="all">全部</el-radio>
            <el-radio label="enabled">启用</el-radio>
            <el-radio label="disable">停用</el-radio>
          </el-radio-group>
        </template>
      </div>
    </fieldset>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      inputVal: '',
      searchType: '',
      status: ''
    }
  },

  computed: {},

  watch: {},

  created() { },

  methods: {}
}

</script>
<style rel='stylesheet/scss' lang='scss'>
.location-search {
  // max-width: 30px;
  background: #edf0f6;
  padding-bottom: 10px;
  padding-top: 10px;
  padding-left: 5px;
  padding-right: 5px;
  .fileset-wrap {
    padding: 5px;
    .wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .input-search {
        width: 150px;
      }
      .next {
        padding-left: 5px;
        padding-right: 5px;
      }
      .el-radio + .el-radio {
        margin-left: 10px;
      }
    }
    .status{
      margin-top: 5px;
      .el-radio-group{
        border:1px solid #dcdfe6;
        padding: 5px
      }
    }
  }
}
</style>

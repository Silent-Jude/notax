<!-- 基础定位样式，
支持 代码-拼音
定位 -->
<template>
  <div class="location-search">
    <div class="top">
      <el-input v-model="input3" size="mini" placeholder="请输入代码或拼音" class="search-input">
        <template slot="prepend">快速查找：</template>
      </el-input>
      <template>
        <!-- <div class="radio-type"> -->
        <el-radio v-model="searchType" label="code">代码</el-radio>
        <el-radio v-model="searchType" label="spell">拼音</el-radio>
        <!-- </div> -->
      </template>
    </div>
    <div class="button-group">
      <el-button size="mini">去查找</el-button>
      <el-button size="mini">下一个</el-button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      inputVal: '',
      searchType: ''
    }
  },

  computed: {},

  watch: {},

  created() {},

  methods: {}
}

</script>
<style rel='stylesheet/scss' lang='scss'>
.location-search{
  max-width:340px;
  background: #EDF0F6;
  padding-bottom: 10px;
  padding-top: 10px;
  padding-left: 5px;
  padding-right: 5px;
  .top{
    display: flex;
    justify-content: space-between;
    height: 28px;
    line-height: 28px;
    .search-input{
      width: 200px;
      margin-right: 10px
    }
    // .radio-type{
    //   border-radius: 4px;
    //   border: 1px solid #dcdfe6
    // }
    .el-input-group__prepend{
      padding-left: 5px;
      padding-right: 5px;
      color: #333
    }
    .el-radio+.el-radio{
      margin-left: 10px
    }
    .el-radio{
    height: 28px;
    line-height: 28px;
    }
  }
  .button-group{
    margin-top: 10px;
    display: flex;
    justify-content: space-between
  }
}
</style>

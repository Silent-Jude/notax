<template>
  <div class="set">
    <el-dialog :visible.sync="setdialogTableVisible" title="报表设置">
      <div class="con">
        <div class="lf">
          <ul>
            <li>
              <el-checkbox v-model="checked">标准缴款书</el-checkbox>
            </li>
            <li>
              <el-checkbox v-model="checked">标准缴款书</el-checkbox>
            </li>
          </ul>
        </div>
        <div class="rt">
          <li>
            <el-button type="primary">关闭</el-button>
          </li>
          <li>
            <el-button type="primary">设置</el-button>
          </li>
          <li>
            <el-button type="primary">增加</el-button>
          </li>
          <li>
            <el-button type="primary">修改</el-button>
          </li>
          <li>
            <el-button type="primary">删除</el-button>
          </li>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      setdialogTableVisible: false,
      checked: false
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.set{
  li{
    list-style: none;
  }
  .con{
    display: flex;
    height: 500px;
    .lf{
      flex: 1;
    }
    .rt{
      width: 100px;
      li{
        margin: 20px 10px;
      }
    }
  }
}
</style>

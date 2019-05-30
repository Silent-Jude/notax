<template>
  <div class="head">
    <div class="left">
      政府非税收入管理信息系统 — 财政管理端
    </div>
    <div class="right">
      <ul>
        <li>数据更新</li>
        <li @click="logout">重新登录</li>
        <li>修改密码</li>
        <li>关于</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeadTop',
  methods: {
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.head{
  box-sizing: border-box;
  $head-h:60px;
  $head-bg:#DFE8F6;
  $head-bd:#99BBE8;
  height: $head-h;
  line-height: $head-h;
  background: $head-bg;
  // border-top: 1px solid $head-bd;
  border-bottom: 1px solid $head-bd;
  .left{
    float: left;
    font-size: 26px;
    padding-left: 80px;
    color: #1C7CD5;
    text-shadow: -3px 4px 4px #8E919D;
    font-weight: 700;
    background: url(../assets/404_images/404.png) no-repeat 20px 0;
    background-size: 60px 60px;
  }
  .right{
    float: right;
    color: #3637FD;
     li{
       font-weight: 700;
      float: left;
      margin: 0 15px;
      cursor: pointer;
      text-decoration: underline;
    }
  }
}
</style>


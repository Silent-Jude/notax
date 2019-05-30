<template>
  <div class="foot">
    <div class="left">
      <ul>
        <li><span>业务年度:</span>【{{ yearNb }}】</li>
        <li><span>行政区别:</span>【{{ administrativeNb }}】</li>
        <li><span>业务处室:</span>【{{ businessNb }}】</li>
        <li><span>用户名称:</span>【{{ userNb }}】</li>
      </ul>
    </div>
    <div class="right">
      <span>当前时间:</span>{{ datetime }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'Foot',
  data() {
    return {
      datetime: '',
      yearNb: '2019',
      administrativeNb: '420501',
      businessNb: '001 财政局非税',
      userNb: '999信息中心'
    }
  },
  mounted() {
    setInterval(this.date, 500)
  },
  methods: {
    date() {
      const date = new Date()
      const dateGetHours = ('0' + date.getHours()).substr(-2)
      const dateGetMinutes = ('0' + date.getMinutes()).substr(-2)
      const dateGetSeconds = ('0' + date.getSeconds()).substr(-2)
      this.datetime = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${dateGetHours}:${dateGetMinutes}:${dateGetSeconds}`
    }
  }
}
</script>

<style lang="scss" scoped>
.foot{
  box-sizing: border-box;
  $foot-bd:#A5C2EA;
  $foot-bg:#DFE8F6;
  height: 30px;
  line-height: 30px;
  padding: 0 20px;
  background: $foot-bg;
   border-top: 1px solid $foot-bd;
   span{
     margin: 0 5px;
   }
  .left{
    float: left;
    ul{
      li{
      float: left;
      margin-right: 10px;
    }
    }
  }
  .right{
    float: right;
    span{
      margin: 0 10px;
    }
  }
}

</style>


<!-- 测试公共组件页面 -->
<!-- 使用方法：将需要测试的组件，导入之后引用即可。 -->
<!--
-->
<template>
  <div>
    <status-locate/>
  </div>
</template>

<script>
import statusLocate from './treeHeader/statusLocate.vue'

export default {
  components: {
    statusLocate
  },
  data() {
    return {
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }]
    }
  },

  computed: {},

  watch: {},

  created() {},

  methods: {}
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
</style>

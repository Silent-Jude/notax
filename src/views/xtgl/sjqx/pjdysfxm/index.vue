<!-- 票据对应收费项目 -->
<template>
  <indexModel :special-data="specialData"/>
</template>

<script>
import indexModel from '../ywksdysfdw/index'
export default {
  components: {
    indexModel // 根据业务科室对应收费单位的模板来
  },
  data() {
    return {
      specialData: {
        normalListTableHead: [ // 正序列表表格的表头。字段不知道。瞎写的。
          { label: '收费项目编号', prop: 'nontaxcode', width: 350 },
          { label: '收费项目名称', prop: 'nontaxname', width: 350 }
        ],
        reverseListTableHead: [// 反向列表表格表头
          { label: '票据编号', prop: 'billcode', width: 350 },
          { label: '票据名称', prop: 'billname', width: 350 }
        ],
        normalLeftTitle: '票据种类',
        normalRightTitle: '收费项目',
        // normalLeftTreeParams: 'billId',
        // normalRightTreeParams: 'chgproId'
        normalLeftTreeParams: 'chgproId',
        normalRightTreeParams: 'billId'
      }
    }
  },
  // 获取右侧树的API有问题，等后台改。
  computed: {},

  watch: {},

  created() {},

  methods: {}
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
</style>

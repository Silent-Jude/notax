<!-- 业务科室对应收费项目 -->
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
          { label: '项目编码', prop: 'nontaxcode', width: 350 },
          { label: '项目名称', prop: 'nontaxname', width: 350 }

        ],
        reverseListTableHead: [// 反向列表表格表头
          // 反序没有数据，字段不知道。瞎写的。
          { label: '处室编号', prop: 'officecode', width: 350 },
          { label: '处室名称', prop: 'officename', width: 350 }
        ],
        normalLeftTitle: '业务科室',
        normalRightTitle: '收费项目',
        normalLeftTreeParams: 'chgproId',
        normalRightTreeParams: 'officeId'
      }
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

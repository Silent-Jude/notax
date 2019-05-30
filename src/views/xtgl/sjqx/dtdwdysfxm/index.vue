<!-- 大厅单位对应收费项目 -->
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
          { label: '收费项目编号', prop: 'nontaxcode', width: 190 },
          { label: '收费项目名称', prop: 'nontaxname', width: 190 },
          { label: '收费上限', prop: 'chargelimit', width: 190 },
          { label: '收费下限', prop: 'chargelower', width: 190 }
        ],
        reverseListTableHead: [// 反向列表表格表头
          // 反序没有数据，字段不知道。瞎写的。
          { label: '大厅单位编码', prop: 'agencycode', width: 350 },
          { label: '大厅单位名称', prop: 'agencyname', width: 350 }
        ],
        normalLeftTitle: '大厅单位',
        normalRightTitle: '单位收费项目',
        normalLeftTreeParams: 'chgproId',
        normalRightTreeParams: 'hall2AgencyId'
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

<!-- 票据领用证对应收费单位 -->
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
          { label: '单位编号', prop: 'agencycode', width: 350 },
          { label: '单位名称', prop: 'agencyname', width: 350 }
        ],
        reverseListTableHead: [// 反向列表表格表头
          { label: '票据领用证编号', prop: 'permitno', width: 350 },
          { label: '票据领用证名称', prop: 'billpermitname', width: 350 }
        ],
        normalLeftTitle: '票据领用证',
        normalRightTitle: '执收单位',
        normalLeftTreeParams: 'agencyId',
        normalRightTreeParams: 'permitId'
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

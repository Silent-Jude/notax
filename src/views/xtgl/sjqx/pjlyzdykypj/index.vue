<!-- 票据领用证对应可用票据 -->
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
          { label: '票据编号', prop: 'billcode', width: 350 },
          { label: '票据名称', prop: 'billname', width: 350 }
        ],
        reverseListTableHead: [// 反向列表表格表头
          // 反序没有数据，字段不知道。瞎写的。
          { label: '购领证编号', prop: 'permitno', width: 190 },
          { label: '购领证名称', prop: 'billpermitname', width: 190 }
        ],
        normalLeftTitle: '票据领用证',
        normalRightTitle: '可用票据',
        normalLeftTreeParams: 'billId',
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

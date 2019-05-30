<!-- 主管部门对应收费单位 -->
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
          // 反序没有数据，字段不知道。瞎写的。
          { label: '主管部门编号', prop: 'deptcode', width: 350 },
          { label: '主管部门名称', prop: 'deptname', width: 350 }
        ],
        normalLeftTitle: '主管部门',
        normalRightTitle: '执收单位',
        normalLeftTreeParams: 'agencyId',
        normalRightTreeParams: 'deptId'
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

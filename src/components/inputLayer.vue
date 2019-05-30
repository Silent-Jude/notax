<!-- 能够弹出弹层的input框,基于layer和el-input实现。 -->
<template>
  <div>
    <el-input
      :value="inputVal"
      clearable
      placeholder="请输入票据名称"
      @input="$emit('input',$event.target.value)" >
      <el-button slot="append" icon="el-icon-caret-bottom" @click="showLayer()"/>
      <layer ref="layer" :tb-head="layerModelData.tableHead" :form="layerModelData.formOptionObject" :table-data="layerModelData.tableData" :title="layerModelData.title" @select="getSelectedInfo"/>
    </el-input>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    inputVal: {
      type: [String, Number],
      default() {
        return ''
      }
    },
    layerModelData: {
      type: Object,
      require: true,
      default() {
        return {
          title: '请输入弹层标题',
          tableHead: [
            {
              prop: 'value',
              label: '字段名'
            },
            {
              prop: 'value',
              label: '字段名'
            }
          ],
          tableData: [],
          formOptionObject: {
            coding: '',
            equal: '',
            codingoption: [{
              val: '字段名',
              key: 'value' }
            ]
          }
        }
      }
    }
  },
  data() {
    return {
    }
  },

  computed: {},

  watch: {},

  created() {},

  methods: {
    // 票据名称对话框显示
    showLayer() {
      this.$refs.layer.dialogTableVisible = true
    },
    getSelectedInfo(datas) {
      this.$emit('selected', datas)
      // return datas
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
</style>

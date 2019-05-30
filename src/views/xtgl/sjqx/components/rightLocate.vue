<!-- 右侧定位，
支持 代码-拼音
定位 -->
<template>
  <div class="location-search">
    <!-- <fieldset class="fileset-wrap"> -->
    <!-- <legend>定位</legend> -->
    <div class="wrap">
      <el-input :disabled="disabled" v-model="inputVal" size="mini" placeholder="请输入代码或拼音" class="input-search" @change="clearCurrentIndexRight" />
      <!-- <template> -->
      <!-- <div class="radio-type"> -->
      <el-radio :disabled="disabled" v-model="searchType" label="code">代码</el-radio>
      <el-radio :disabled="disabled" v-model="searchType" label="spell">拼音</el-radio>
      <!-- </div> -->
      <!-- </template> -->
      <el-button :disabled="disabled" size="mini" class="next" @click="nextPositionRight">下一个</el-button>
    </div>
    <!-- </fieldset> -->
  </div>
</template>

<script>

import { mapState } from 'vuex'
import Bus from '@/utils/Bus'
export default {
  components: {},
  data() {
    return {
      inputVal: '',
      searchType: ''
    }
  },

  computed: {
    ...mapState({
      rightSearchValue: state => state.sjqx.rightSearchValue,
      rightSearchType: state => state.sjqx.rightSearchType,
      savestate: state => state.app.savestate
    }),
    disabled() {
      if (this.savestate > 0) {
        return false
      } else {
        return true
      }
    }

  },

  watch: {},

  created() { },
  mounted() {
    this.inputVal = this.rightSearchValue
    this.searchType = this.rightSearchType
  },
  methods: {
    saveInputToStore() {
      this.$store.commit('SET_RIGHTSEARCHVALUE', this.inputVal)
      this.$store.commit('SET_RIGHTSEARCHTYPE', this.searchType)
    },
    nextPositionRight() {
      if (this.searchType === '') {
        // 当没有点击代码或者拼音时，提示需要进行选择。
        this.$alert('请选择定位方式！', {
          center: true,
          closeOnClickModal: true,
          closeOnPressEscape: true,
          callback: action => {
          }
        })
        console.log('右边的下一个')
      } else {
        // console.log(`输入框值是${this.inputVal},查找方式为：${this.searchType}`)
        // 触发父组件事件，父组件是 treeComponent
        Bus.$emit('nextPositionRight', this.inputVal, this.searchType)
        this.saveInputToStore()
        console.log('右边的下一个')
      }
    },
    clearCurrentIndexRight() {
      Bus.$emit('clearCurrentIndexRight')
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
// .dis-tap {
//   color: #8b8588;
//   cursor: not-allowed;
// }
.location-search {
  // max-width: 30px;
  background: #edf0f6;
  padding-bottom: 10px;
  padding-top: 10px;
  padding-left: 5px;
  padding-right: 5px;
  // .fileset-wrap {
  // padding: 5px;
  .wrap {
    display: flex;
    width: 400px;
    align-items: center;
    justify-content: space-between;
    .input-search {
      width: 150px;
    }
    .next {
      padding-left: 5px;
      padding-right: 5px;
    }
    .el-radio + .el-radio {
      margin-left: 10px;
    }
  }
  // }
}
</style>

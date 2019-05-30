<!-- 基础定位样式，
支持 代码-拼音
定位 -->
<template>
  <div class="location-search">
    <fieldset class="fileset-wrap">
      <legend>定位</legend>
      <div class="wrap">
        <el-input :disabled="disabled" v-model="inputVal" size="mini" placeholder="请输入代码或拼音" class="input-search" @change="clearCurrentIndex" />
        <!-- <template> -->
        <!-- <div class="radio-type"> -->
        <el-radio :disabled="disabled" v-model="searchType" label="code">代码</el-radio>
        <el-radio :disabled="disabled" v-model="searchType" label="spell">拼音</el-radio>
        <!-- </div> -->
        <!-- </template> -->
        <el-button :disabled="disabled" size="mini" class="next" @click="nextPosition">下一个</el-button>
      </div>
    </fieldset>
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
      inputSearchValue: state => state.app.inputSearchValue,
      inputSearchType: state => state.app.inputSearchType,
      savestate: state => state.app.savestate
    }),
    disabled() {
      if (this.savestate > 0) {
        return true
      } else {
        return false
      }
    }

  },

  watch: {},

  created() { },
  mounted() {
    this.inputVal = this.inputSearchValue
    this.searchType = this.inputSearchType
  },
  methods: {
    saveInputToStore() {
      this.$store.commit('SET_INPUTSEARCHVALUE', this.inputVal)
      this.$store.commit('SET_SEARCHTYPE', this.searchType)
    },
    nextPosition() {
      if (this.searchType === '') {
        // 当没有点击代码或者拼音时，提示需要进行选择。
        this.$alert('请选择定位方式！', {
          center: true,
          closeOnClickModal: true,
          closeOnPressEscape: true,
          callback: action => {
          }
        })
      } else {
        // console.log(`输入框值是${this.inputVal},查找方式为：${this.searchType}`)
        // 触发父组件事件，父组件是 treeComponent
        Bus.$emit('nextPosition', this.inputVal, this.searchType)
        this.saveInputToStore()
      }
    },
    clearCurrentIndex() {
      Bus.$emit('clearCurrentIndex')
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss'>
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
  .fileset-wrap {
    padding: 5px;
    .wrap {
      display: flex;
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
  }
}
</style>

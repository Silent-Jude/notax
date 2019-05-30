<!-- tab选项卡导航 -->
<template>
  <div class="tab">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane :label="labelArray[0]" name="0">
        <slot name="detail">请插入详细信息的表单name=detail</slot>
      </el-tab-pane>
      <el-tab-pane :label="labelArray[1]" name="1">
        <slot name="listInfo">请插入列表信息的表格，name=listInfo</slot>
      </el-tab-pane>
      <!-- <el-tab-pane v-if="hasTab('projectDocument')" label="项目文号" name="2">
        <slot name="projectDocument">请插入项目文号的表格，name=projectDocument</slot>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import Bus from '@/utils/Bus'
export default {
  name: 'Tab',
  components: {
  },
  props: {
    otherTabsArray: {
      type: Array,
      require: false,
      default() {
        return []
      }
    },
    labelArray: {
      type: Array,
      require: true,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      activeName: '0'
    }
  },
  computed: {
    ...mapState({
      selectedLeftTreeNodeGuid: state => state.sjqx.selectedLeftTreeNodeGuid
    })
  },
  methods: {
    hasTab(tabName) {
      return this.otherTabsArray.indexOf(tabName) !== -1
    },
    handleClick(tab, event) {
      // 在vue中保存选中的tabs的index信息。
      this.$store.dispatch('SetSelectedTabsId', tab.index)
      if (tab.index !== 0) {
        // 存节点对象。
        this.$store.dispatch('SetTarget', event.target)
      } else {
        this.$store.dispatch('SetTarget', null)
      }

      if (parseInt(tab.index) === 0) {
        // Bus.$emit('getRightTreeInfo', { guid: this.selectedLeftTreeNodeGuid })
      } else if (parseInt(tab.index) === 1) {
        if (this.selectedLeftTreeNodeGuid) {
          // 当选择了定位树中的节点时，才能发送请求获取列表数据。
          // Bus.$emit('getTableListRequest', { pid: this.selectedLeftTreeNodeGuid })
          // 这里需要调用index中的事件，所以需要使用bus，跨了2级。
        } else {
          // 没有选择定位梳中的节点，需要提示选择节点。
          // 或者不做处理，显示为全部数据。
          this.$alert('请先选择需要查看的节点', {
            center: true,
            closeOnClickModal: true,
            closeOnPressEscape: true,
            customClass: 'texty',
            callback: action => {
            }
          })
        }
      }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.texty {
  font-size: 30px;
}
.el-tabs__content {
  z-index: 4;
}
.el-tab-pane {
  overflow: scroll;
}
</style>

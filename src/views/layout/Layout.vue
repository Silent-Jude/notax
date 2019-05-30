<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="disabled" class="shield" />
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <head-top/>
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <navbar class="toggle-sidebar" />
      <app-main/>
    </div>
    <foot/>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import HeadTop from '@/components/headTop'
import Foot from '@/components/foot'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import Bus from '@/utils/Bus'
import { getCodeLabelDictionary } from '@/api/CommonApi'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    HeadTop,
    Foot
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      savestate: state => state.app.savestate,
      grantState: state => state.sjqx.grantState
    }),
    disabled() {
      if (this.savestate > 0 || this.grantState) {
        return true
      } else {
        return false
      }
    },
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  created() {
    getCodeLabelDictionary().then(res => {
      this.$store.dispatch('set_allcodelabeldictionary', res.data)
    }).catch(err => { console.log(err) })
    this.$store.dispatch('set_BillInfos')
    Bus.$off('billNumberOutRange')
    Bus.$on('billNumberOutRange', (msg) => {
      this.$alert(msg, {
        center: true,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        callback: action => {
        }
      })
    })
    Bus.$off('alert')
    Bus.$on('alert', (msg) => {
      this.$alert(msg, {
        center: true,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        callback: action => {
        }
      })
    })
  },

  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  }
}
</script>
<style lang="scss">
.el-tab-pane {
  overflow: hidden;
}
.el-date-editor.el-input {
  width: auto;
}
.tree-wrap .right-wrap {
  width: calc(100% - 360px);
}
.view {
  height: calc(100% - 50px);
  // border: 1px solid #9BBCE8;
  // background: #ccc;
}
.right-wrap {
  .tab {
    height: 100%;
    .el-tabs {
      height: 100%;
      .el-tabs__content {
        height: calc(100% - 37px);
        overflow: auto;
        // padding-bottom: 3px;
      }
    }
  }
}
.left-wrap {
  // padding-bottom: 3px;
  display: flex;
  flex-direction: column;
  background: #fff;
  .left-head {
    background: #dfe8f6;
    .location-search {
      background: #dfe8f6;
      .fileset-wrap {
        border: 1px solid #c6d7f1;
      }
    }
  }
  .tree-menu {
    flex: 1;
    background: #fff;
    // overflow: auto;
    overflow-y: scroll;
    padding: 10px;
    background: #dfe8f6;
    .el-tree {
      height: 100%;
      overflow-y: scroll;
      border-bottom: 4px solid #fff;
      border-top: 4px solid #fff;
      border-radius: 3px;
      .el-tree-node {
        height: 100%;
        overflow-y: scroll;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
  .shield {
    background: rgba(0, 0, 0, 0.1);
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: not-allowed;
    z-index: 4;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

#app .sidebar-container {
  bottom: 30px;
  top: 60px;
  height: auto;
}

#app .main-container {
  min-height: auto;
  // width: calc(100% - 220px);
  .toggle-sidebar {
    background: #232730;
    position: absolute;
    top: 280px;
    left: -20px;
    z-index: 2;
  }
}
.app-wrapper {
  height: auto;
}
.app-main {
  min-height: auto;
  height: calc(100vh - 91px);
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid #9bbce8;
  background: #DFE8F6;
}
</style>


<template>
  <div class="tab">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="详细信息" name="0">
        <slot name="detail">请插入详细信息的表单name=detail</slot>
      </el-tab-pane>
      <el-tab-pane label="列表信息" name="1">
        <slot name="listInfo">请插入列表信息的表格，name=listInfo</slot>
      </el-tab-pane>
      <el-tab-pane v-if="hasTab('projectDocument')" label="项目文号" name="2">
        <!-- <slot name="projectDocument">请插入项目文号的表格，name=projectDocument</slot> -->
        <el-table :data="projectDocumentData" style="width: 100%">
          <el-table-column
            v-for="(item,i) of projectDocumentHead"
            :key="i"
            :label="item.label"
            :prop="item.prop"
            width="100"/>
        </el-table>
      </el-tab-pane>
      <el-tab-pane v-if="hasTab('sflbtzxx')" label="收费类别调整信息" name="3">
        <!-- <slot name="sflbtzxx">请插入收费类别调整信息的表格，name=sflbtzxx</slot> -->
        <el-table :data="sflbtzxxData" style="width: 100%">
          <el-table-column
            v-for="(item,i) of sflbtzxxHead"
            :key="i"
            :label="item.label"
            :prop="item.prop"
            width="100"/>
        </el-table>

      </el-tab-pane>
      <el-tab-pane v-if="hasTab('sfbztzxx')" label="收费标准调整信息" name="4">
        <!-- <slot name="sfbztzxx">请插入收费标准调整信息的表格，name=sfbztzxx</slot> -->

        <el-table :data="sfbztzxxData" style="width: 100%">
          <el-table-column
            v-for="(item,i) of sfbztzxxHead"
            :key="i"
            :label="item.label"
            :prop="item.prop"
            width="100"/>
        </el-table>

      </el-tab-pane>
      <el-tab-pane v-if="hasTab('sfxmtzxx')" label="收费项目取消信息" name="5">
        <!-- <slot name="sfxmtzxx">请插入收费项目取消信息的表格，name=sfxmtzxx</slot> -->
        <el-table :data="sfxmtzxxData" style="width: 100%">
          <el-table-column
            v-for="(item,i) of sfxmtzxxHead"
            :key="i"
            :label="item.label"
            :prop="item.prop"
            width="100"/>
        </el-table>
      </el-tab-pane>
      <el-tab-pane v-if="hasTab('kysfxm')" label="可用收费项目" name="6">
        <slot name="kysfxm">请插入可用收费项目的表格，name=kysfxm</slot>
      </el-tab-pane>
      <el-tab-pane v-if="hasTab('ssdw')" label="所属单位" name="7">
        <slot name="ssdw">请插入所属单位组件，name=ssdw</slot>
      </el-tab-pane>
      <el-tab-pane v-if="hasTab('sydw')" label="使用单位" name="8">
        <slot name="sydw">请插入使用单位组件，name=sydw</slot>
      </el-tab-pane>
      <el-tab-pane v-if="hasTab('njxx')" label="年检信息" name="9">
        <slot name="njxx">请插入年检信息组件，name=njxx</slot>
      </el-tab-pane>
      <el-tab-pane v-if="hasTab('kypj')" label="可用票据" name="10">
        <slot name="kypj">请插入可用票据组件，name=kypj</slot>
      </el-tab-pane>
      <el-tab-pane v-if="hasTab('dynr')" label="打印内容" name="11">
        <slot name="dynr">请插入打印内容组件，name=dynr</slot>
      </el-tab-pane>
      <!-- <el-tab-pane v-for="(item,i) of tabsArray" :key="i" :label="item" :name="`${i+2}`">{{ item }}</el-tab-pane> -->
      <el-tab-pane v-if="hasTab('chargeNum')" label="收费文号对应收费项目" name="7">
        <el-table :data="chargeNumData" style="width: 100%">
          <el-table-column
            type="index"
            width="50"/>
          <el-table-column
            v-for="(item,i) of chargeNumHead"
            :key="i"
            :label="item.label"
            :prop="item.prop"
            width="150"/>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { findPolProjectFnoPrj } from '@/api/jczl'
import { mapState } from 'vuex'
import Bus from '@/utils/Bus'
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
    }
  },
  data() {
    return {
      activeName: '0',
      sflbtzxxData: [],
      sflbtzxxHead: [
        { label: '收费项目编码', prop: '' },
        { label: '收费项目名称', prop: '' },
        { label: '原收费类别编码', prop: '' },
        { label: '原收费类名称', prop: '' },
        { label: '新收费类别编码', prop: '' },
        { label: '新收费类别名称', prop: '' },
        { label: '文件号', prop: '' },
        { label: '文件主题', prop: '' },
        { label: '调整时间', prop: '' }
      ],

      sfbztzxxData: [],
      sfbztzxxHead: [
        { label: '收费项目编码', prop: '' },
        { label: '收费项目名称', prop: '' },
        { label: '原收费上限', prop: '' },
        { label: '原收费下限', prop: '' },
        { label: '新收费上限', prop: '' },
        { label: '新收费下限', prop: '' },
        { label: '文件号', prop: '' },
        { label: '文件主题', prop: '' },
        { label: '调整时间', prop: '' }
      ],

      sfxmtzxxData: [],
      sfxmtzxxHead: [
        { label: '收费项目编码', prop: '' },
        { label: '收费项目名称', prop: '' },
        { label: '文件号', prop: '' },
        { label: '文件主题', prop: '' },
        { label: '取消时间', prop: '' }
      ],
      projectDocumentData: [],
      projectDocumentHead: [
        { label: '文件名称', prop: '' },
        { label: '文件文号', prop: '' },
        { label: '发文机关', prop: '' },
        { label: '文件级次', prop: '' },
        { label: '文件类型', prop: '' }
      ],
      chargeNumData: [],
      chargeNumHead: [
        { label: '收费项目编号', prop: 'nontaxcode' },
        { label: '收费项目名称', prop: 'nontaxname' },
        { label: '收费上限', prop: 'chargelimit' },
        { label: '收费下限', prop: 'chargelower' }
      ]
    }
  },
  computed: {
    ...mapState({
      selectedSubMenuGuid: state => state.app.selectedSubMenuGuid
    })
  },
  created() {
    Bus.$off('findPolProjectFnoPrj')
    Bus.$on('findPolProjectFnoPrj', ({ guid }) => {
      if (guid && guid !== '-1') {
        findPolProjectFnoPrj(guid).then(res => {
          console.log('res+++++', res.data.list)
          this.chargeNumData = res.data.list
        })
      }
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

      // if (parseInt(tab.index) === 0) {
      // } else if (parseInt(tab.index) === 1) {
      if (this.selectedSubMenuGuid) {
        if (tab.index === 0 || tab.index === 1) {
        // 当选择了定位树中的节点时，才能发送请求获取列表数据。
          Bus.$emit('getDetailRequest', { guid: this.selectedSubMenuGuid })
          Bus.$emit('getTableListRequest', { pid: this.selectedSubMenuGuid })
        }
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
      // }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.texty{
  font-size: 30px
}
.el-tabs__content{
  z-index: 4
}
.el-tab-pane{
  overflow: scroll;
}
</style>

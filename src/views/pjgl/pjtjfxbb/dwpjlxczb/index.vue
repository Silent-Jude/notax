<!-- dwpjlxczb  单位票据领销存总表-->
<template>
  <div class="dwpjlxczb">
    <toolBar :client-butns-array="clientButnsArray" />
    <h1>单位票据领销存总表</h1>
    <iframe ref="iframe" :src="urlPath" class="iframe" frameborder="0" scrolling="yes" name="iframe" seamless>您的浏览器版本过低，无法显示报表内容！建议升级浏览器或更换浏览器！</iframe>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Bus from '@/utils/Bus'
import toolBar from '@/components/toolBar'

export default {
  components: {
    toolBar // 上方工具条栏
  },
  data() {
    return {
      clientButnsArray: ['close', 'reportRefresh', 'reportClear', 'reportPrint', 'reportExport'] // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
    }
  },

  computed: {
    ...mapState({
      mainHeight: state => state.app.mainHeight
    }),
    urlPath() {
      return this.$route.meta.url
    }
  },

  watch: {},

  created() {
    Bus.$off('reportRefresh')
    Bus.$on('reportRefresh', () => {
      this.reportRefresh()
    })
    Bus.$off('reportClear')
    Bus.$on('reportClear', () => {
      this.reportClear()
    })
    Bus.$off('reportPrint')
    Bus.$on('reportPrint', () => {
      this.reportPrint()
    })
    Bus.$off('reportExport')
    Bus.$on('reportExport', () => {
      this.reportExport()
    })
  },
  mounted() {
    // 要用nextTick，否则高度赋值不成功。
    this.$nextTick(() => {
      this.$refs.iframe.height = this.mainHeight - 89
    })
  },
  methods: {
    reportRefresh() {
      this.$refs.iframe.contentWindow.search()
    },
    reportClear() {
      this.$refs.iframe.contentWindow.Reset()
    },
    reportPrint() {
      this.$refs.iframe.contentWindow.Print()
    },
    reportExport() {
      this.$refs.iframe.contentWindow.Export()
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.dwpjlxczb{
  h1{
    height: 40px;
    line-height: 40px;
    text-decoration: underline;
    font-size: 20px;
    text-align: center;
    font-weight: 700;
  }
  .iframe{
    width: 100%;
  }
}
</style>

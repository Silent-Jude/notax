<!--  根据传入的字段，获取服务器端返回的 代码 对应的文字，所构成的option-->
<template>
  <div/>
</template>

<script>
import request from '@/utils/request'
export default {
  components: {},
  props: {
    initialValue: {
      type: String,
      required: false,
      default() {
        return ''
      }
    },
    codeHead: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      codeMap: {},
      optionArray: [],
      selectedValue: ''
    }
  },

  computed: {
  },
  watch: {
    initialValue: {
      handler(newVal, oldVal) {
        if (!oldVal) {
          this.selectedValue = this.initialValue
        }
        // this.codeHead = newVal.replace(/[_].*/, '')
        this.getOptionArray()
        // this.selectedValue = this.optionArray
      },
      immediate: true
    }
  },

  created() {
    request({
      url: '/sys/sysDatadictionary/allKey',
      methods: 'get'
    }).then(res => {
      this.codeMap = res.data
      console.log(this.codeMap)
    }).catch(err => {
      console.log(err)
    })
  },

  methods: {
    getOptionArray() {
      if (this.codeMap.hasOwnProperty(this.codeHead)) {
        this.optionArray = this.codeMap[this.codeHead].codes
      }
    },
    sendValue() {
      this.$emit('hadSelected', this.selectedValue)
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
</style>

<!-- 非税参数 -->
<template>
  <div class="notax-params">
    <toolBar :client-butns-array="clientButnsArray" />
    <treeComponent v-if="refreshTree" :data="data">
      <base-locate slot="header" />
      <div slot="tabs">
        <fieldset class="fileset-wrap">
          <legend>功能信息</legend>
          <div class="wrap">
            <el-form ref="form" :disabled="$store.getters.savestate===0" :rules="rules" :model="detailInfo" label-position="left" label-width="80px">
              <el-form-item label="参数编码 " prop="paramcode">
                <el-input v-model="detailInfo.paramcode" @focus="clearValidate"/>
              </el-form-item>
              <el-form-item label="参数名称 " prop="paramname">
                <el-input v-model="detailInfo.paramname" @focus="clearValidate"/>
              </el-form-item>
              <el-form-item label="参数类型">
                <!-- <el-input v-model="detailInfo.paramtype"></el-input> -->
                <el-select v-model="detailInfo.paramtype" style="width:250px">
                  <el-option :value="0" label="文本类型" />
                  <el-option :value="1" label="功能类型" />
                </el-select>
              </el-form-item>
              <el-form-item label="参数值">
                <el-input v-model="detailInfo.paramvalue"/>
              </el-form-item>
              <el-form-item label="参数描述">
                <el-input :rows="5" v-model="detailInfo.remark" type="textarea"/>
              </el-form-item>
            </el-form>
          </div>
        </fieldset>
      </div>
    </treeComponent>
  </div>
</template>

<script>
import Bus from '@/utils/Bus'
import { mapState } from 'vuex'
import { getTree, getDetail } from '@/api/jczl'
import request from '@/utils/request'
import baseLocate from '@/components/treeHeader/baseLocate'
import treeComponent from '@/components/treeComponent'
import tab from '@/components/tab'
import toolBar from '@/components/toolBar'
// import { async } from 'q'
// import formgroup from './formgroup'
// import listInfo from '@/components/listInfo'
export default {
  components: {
    treeComponent, // 节点树组件
    baseLocate, // 节点数的头部。
    // formgroup, // 右侧详情信息表单。
    toolBar, // 上方工具条栏
    tab // 右侧tab选项卡
    // listInfo // 右侧列表信息
  },
  data() {
    return {
      sourceData: {},
      detailInfo: {
        paramcode: '',
        paramname: '',
        paramtype: '',
        paramvalue: '',
        remark: ''
      },
      data: [],
      refreshTree: true,
      urlPath: '/sys/sysNontaxparams',
      clientButnsArray: ['close', 'refresh', 'save', 'abolish', 'refresh', 'update', 'add', 'delete'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      // listInfo的表头，需要手动传进去。
      listInfoTableHead: [
        { label: '收费类别编码', prop: 'chargetypecode', width: 180 },
        { label: '收费类别名称', prop: 'chargetypename', width: 180 },
        { label: '备注', prop: 'remark' }
      ],
      rules: {
        // 定义规则。
        paramcode: [
          { required: true, message: '参数编码不能为空！', trigger: 'blur' },
          { min: 1, max: 8, message: '请输入长度为1-8位的字符串！', trigger: 'blur' }
        ],
        paramname: [
          { required: true, message: '参数名称不能为空！', trigger: 'blur' },
          { min: 1, max: 22, message: '请输入长度为1-22的字符串或汉字！', trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    ...mapState({
      // detailInfo: state => state.app.detailInfo,
      savestate: state => state.app.savestate,
      selectedSubMenuGuid: state => state.app.selectedSubMenuGuid
    })
  },

  watch: {
  },
  beforeCreate() {
    this.$store.commit('INITDETAILINFO')
  },
  created() {
    console.log('已经把数据data加载完毕。vuex中的detailinfo', this.detailInfo)
    Bus.$off('submitForm')
    Bus.$on('submitForm', () => {
      this.submitForm()
    })
    Bus.$off('resetForm')
    Bus.$on('resetForm', () => {
      this.resetForm('form')
    })
    // this.$store.commit('INITDETAILINFO')
    Bus.$off('clearForm')
    Bus.$on('clearForm', () => {
      this.clearForm()
    })
    // bus总线接受tabs点击时，传递过来的获取table列表信息的请求。
    Bus.$off('getTableListRequest')
    Bus.$on('getTableListRequest', params => {
      this.getTableListRequest(params)
    })
    // 手动设置treeComponent组件的显示与隐藏（创建和销毁）
    Bus.$off('handleShowTree')
    Bus.$on('handleShowTree', (boolValue) => {
      this.handleShowTree(boolValue)
    })
    // 获取详情信息
    Bus.$off('getDetailRequest')
    Bus.$on('getDetailRequest', (params) => {
      this.getDetailRequest(params)
    })
    // 获取树形列表节点信息。
    Bus.$off('getTreeNodeInfo')
    Bus.$on('getTreeNodeInfo', () => {
      this.getTreeNodeInfo()
    })

    this.getTreeNodeInfo()
  },
  mounted() {
    console.log('文档dom加载完毕，vuex中的detailinfo：', this.detailInfo)
  },
  beforeDestroy() {
  },
  methods: {
    clearValidate() {
      this.$refs['form'].clearValidate()
    },
    // 保存提交
    submitForm(formName) {
      console.log('收到的表单数据是：', this.detailInfo)
      this.$refs.form.validate((valid) => {
        if (valid) {
          var status = this.$store.getters.savestate
          var params = {}
          // 不同的api接口，直接替换一下url字段即可。
          var url = '/sys/sysNontaxparams'
          if (status === 0) {
            return
          } else if (status === 1) {
            // status为1时，点击保存键是添加功能。
            params = JSON.parse(JSON.stringify(this.detailInfo))
            params.parentguid = this.sourceData.guid

            delete params.guid
            delete params.id
            // params.levelnum++
            params.levelnum = 0
            // 保存添加-----------------
            url = url + '/save'
            console.log('保存提交的数据是:', params)
            request({
              url,
              method: 'post',
              params
            }).then(res => {
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              })
              // 修改按钮组状态
              this.$store.dispatch('SETSAVESTATE', 0)
              // async function refreshTree () {
              // 获取更新之后的数据。
              Bus.$emit('getTreeNodeInfo')
              // }
              // async function setParentNodeState () {
              // await refreshTree()
              // 设置父节点状态
              Bus.$emit('handleFocusCurrentNode', res.data.guid)
              // }
              // setParentNodeState()
            }).catch((err) => {
              console.log(err)
            })
          } else if (status === 2) {
            // status为2时，点击保存键是提交修改功能。
            params = this.detailInfo
            if (params.guid === '') {
              params = Object.assign({}, this.sourceData, this.detailInfo)
              console.log('有问题啊,hack一下')
              console.log(params)
            }
            // 保存修改-------------------
            console.log('发送的修改参数为', params)
            url = url + '/update'
            request({
              url,
              method: 'post',
              params
            }).then(res => {
              this.$message({
                showClose: true,
                message: '修改成功',
                type: 'success'
              })
              // 获取更新之后的数据。
              Bus.$emit('getTreeNodeInfo')
              this.$store.dispatch('SETSAVESTATE', 0)
              // 设置当前节点状态
              Bus.$emit('handleFocusCurrentNode', this.selectedSubMenuGuid)
            }).catch((err) => {
              console.log(err)
            })
          }
        } else {
          this.$message({
            showClose: true,
            message: '填写有误，请重新填写',
            type: 'error'
          })
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs.form.clearValidate()
      this.getDetailRequest({ guid: this.selectedSubMenuGuid })
    },
    // 清空表单。
    clearForm() {
      for (var key in this.detailInfo) {
        this.detailInfo[key] = ''
      }
      this.detailInfo.paramtype = 0
      // console.log('清除完毕')
    },
    // 获取树形列表节点信息。
    getTreeNodeInfo() {
      getTree(this.urlPath).then(res => {
        var dataArr = [res.data]
        this.data = dataArr
        console.log('节点树更新完毕')
      }).catch((err) => {
        console.log(err)
      })
    },
    // 手动控制treeComponent组件的显示和隐藏。
    handleShowTree(bool) {
      this.refreshTree = bool
    },
    // 自定义事件，用来接受treeComponents触发的获取详细信息事件。
    getDetailRequest(params) {
      getDetail(this.urlPath, params).then(res => {
        var formData = JSON.parse(JSON.stringify(res.data))
        // 针对id为-1的特殊处理，因为后台没有传这部分数据，会导致后面add的时候出错。
        if (formData.id === '-1') {
          formData.chargetypecode = ''
          formData.chargetypename = ''
          formData.guid = '-1'
          formData.isenabled = 1
        }
        this.detailInfo = formData
        this.sourceData = JSON.parse(JSON.stringify(formData))
        console.log('接受到的详细信息为', this.detailInfo)
        // 获取到详细信息之后，存到vuex中去。
        this.$store.dispatch('SetDetailInfo', res.data)
      })
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.fileset-wrap {
  position: relative;
  padding-left: 10px;
  border: 1px solid #c6d7f1;
  border-bottom: none;
  z-index: 4;
  .el-input,
  .el-textarea {
    width: 250px;
  }
  .wrap {
    padding-left: 20px
  }
}
</style>

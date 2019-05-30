<template>
  <div class="jsgl">
    <toolBar :client-butns-array="clientButnsArray" />
    <treeComponent v-if="refreshTree" :data="data">
      <base-locate slot="header" />
      <div slot="tabs" class="el-tabs__content">
        <el-form ref="detailInfo" :model="detailInfo" :disabled="$store.getters.savestate===0" size="mini" label-width="100px">
          <el-row>
            <el-col :span="14">
              <el-form-item label-width="80px" label="角色信息"/>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label="角色编码">
                <el-input v-model="detailInfo.rolecode"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label="角色名称">
                <el-input v-model="detailInfo.rolename"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label="角色描述">
                <el-input v-model="detailInfo.description" type="textarea"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item style="display:none;">
            <el-button @click="submitForm('detailInfo')">提交</el-button>
            <el-button @click="resetForm('detailInfo')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </treeComponent>
  </div>
</template>

<script>
import request from '@/utils/request'
import Bus from '@/utils/Bus'
import { mapState } from 'vuex'
import { getTree, getDetail, getTableListInfo } from '@/api/jczl'
import treeComponent from '@/components/treeComponent'
import toolBar from '@/components/toolBar'
import baseLocate from '@/components/treeHeader/baseLocate'
export default {
  components: {
    treeComponent,
    toolBar,
    baseLocate
  },
  data() {
    return {
      form: {},
      clientButnsArray: ['close', 'save', 'abolish', 'refresh', 'update', 'add', 'delete'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      urlPath: '/sys/sysRole',
      refreshTree: true,
      data: []
    }
  },
  computed: {
    ...mapState({
      listInfo: state => state.app.listInfo,
      detailInfo: state => state.app.detailInfo,
      selectedSubMenuGuid: state => state.app.selectedSubMenuGuid,
      savestate: state => state.app.savestate
    })
  },
  beforeCreate() {
    this.$store.commit('INITDETAILINFO')
  },
  created() {
    Bus.$off('submitForm')
    Bus.$on('submitForm', () => {
      this.submitForm()
    })
    Bus.$off('clearForm')
    Bus.$on('clearForm', () => {
      this.resetForm()
    })
    this.$store.dispatch('SetSubMenuGuid', '')
    // 组件创建时，立即调用获取树节点api，生成树，并将树节点信息存在data中。
    this.getTreeNodeInfo()
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
    Bus.$off('getPrintData')
    Bus.$on('getPrintData', () => {
      this.getPrintData()
    })
  },
  methods: {
    // 保存提交
    submitForm(formName) {
      console.log('提交的数据表单资料是：', this.detailInfo)
      if (!this.detailInfo.rolecode) {
        this.$message.error('请输入角色编码')
        return
      }
      if (!this.detailInfo.rolename) {
        this.$message.error('请输入角色名称')
        return
      }

      // this.$refs.form.validate((valid) => {
      //   if (valid) {
      var status = this.$store.getters.savestate
      var params = {}
      // 不同的api接口，直接替换一下url字段即可。
      var url = '/sys/sysRole'
      if (status === 0) {
        return
      } else if (status === 1) {
        // status为1时，点击保存键是添加功能。
        params = Object.assign({ parentid: '-1' }, this.detailInfo)
        // params.parentguid = params.guid
        // guid不能传过去，否则会变成修改。
        // delete params.guid
        // delete params.id
        // params.levelnum++
        // 保存添加-----------------
        url = url + '/save'
        request({
          url,
          method: 'post',
          params
        }).then(res => {
          console.log('res', res)
          this.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })
          // 获取更新之后的数据。
          Bus.$emit('getTreeNodeInfo')
          // 修改按钮组状态
          this.$store.dispatch('SETSAVESTATE', 0)
          // 设置父节点状态
          Bus.$emit('handleFocusCurrentNode', res.data.id)
        }).catch((err) => {
          console.log(err)
        })
      } else if (status === 2) {
        // status为2时，点击保存键是提交修改功能。
        params = this.detailInfo
        // 保存修改-------------------
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
      //   } else {
      //     this.$message({
      //       showClose: true,
      //       message: '填写有误，请重新填写',
      //       type: 'error'
      //     })
      //     return false
      //   }
      // })
    },
    resetForm(formName) {
      this.$store.dispatch('SetDetailInfo', {})
    },
    // 获取树形列表节点信息。
    getTreeNodeInfo() {
      getTree(this.urlPath).then(res => {
        var dataArr = [res.data]
        this.data = dataArr
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
        var formData = res.data
        // 针对id为-1的特殊处理，因为后台没有传这部分数据，会导致后面add的时候出错。
        if (formData.id === '-1') {
          formData.chargetypecode = ''
          formData.chargetypename = ''
          formData.guid = '-1'
          formData.isenabled = 1
        }
        // 获取到详细信息之后，存到vuex中去。
        this.$store.dispatch('SetDetailInfo', res.data)
      })
    },
    // 自定义事件，用了接受treeComponents触发的获取列表信息事件。
    getTableListRequest(params) {
      getTableListInfo(this.urlPath, params).then(res => {
        // 获取到列表信息之后，存到vuex中去。
        this.$store.dispatch('SetListInfo', res.data)
      })
    }
  }

}
</script>


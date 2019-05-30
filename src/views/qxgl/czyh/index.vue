<template>
  <div class="jsgl">
    <toolBar :client-butns-array="clientButnsArray" />
    <treeComponent v-if="refreshTree" :data="data">
      <base-locate slot="header" />
      <div slot="tabs" class="el-tabs__content detail">
        <el-scrollbar style="height:50%;width:100%;">
          <el-table
            ref="layerTable"
            :data="table"
            highlight-current-row
            border
            style="width: 100%"
            @row-click="rowClick">
            <el-table-column
              type="index"/>
            <el-table-column
              v-for="value in tabletitle"
              :key="value.label"
              :label="value.label"
              :prop="value.prop"
              width="110"/>
          </el-table>
        </el-scrollbar>
        <el-form v-show="$store.getters.savestate===0" ref="form" :model="form" :disabled="$store.getters.savestate===0" size="mini" label-width="100px">
          <el-row>
            <el-col :span="11">
              <el-form-item label-width="80px" label="用户信息"/>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="用户编码">
                <el-input v-model="form.usercode"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户别名">
                <el-input v-model="form.pername"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="用户名称">
                <el-input v-model="form.username"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户密码">
                <el-input v-model="form.password" type="password"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="性别">
                <el-select v-model="form.sex" placeholder="">
                  <el-option label="男" value="男"/>
                  <el-option label="女" value="女"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="E-mail"
              >
                <el-input v-model="form.mail" @focus="clearValidate"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="电话">
                <el-input v-model="form.telephone"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户类别">
                <el-input v-model="form.usertp" disabled/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="备注">
                <el-input v-model="form.remark" type="textarea"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <!-- <el-form-item style="display:none;"> -->
            <el-button @click="submitForm('form')">提交</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
        <el-form v-if="!($store.getters.savestate===0)" ref="form1" :model="form1" :disabled="$store.getters.savestate===0" size="mini" label-width="100px">
          <el-row>
            <el-col :span="11">
              <el-form-item label-width="80px" label="用户信息"/>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="用户编码">
                <el-input :disabled="dis" v-model="form1.usercode"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户别名">
                <el-input v-model="form1.pername"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="用户名称">
                <el-input v-model="form1.username"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户密码">
                <el-input :disabled="dis" v-model="form1.password" type="password"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="性别">
                <el-select v-model="form1.sex" placeholder="">
                  <el-option label="男" value="男"/>
                  <el-option label="女" value="女"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="E-mail"
              >
                <el-input v-model="form1.mail" @focus="clearValidate"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="电话">
                <el-input v-model="form1.telephone"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户类别">
                <el-input v-model="form1.usertp" disabled/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="备注">
                <el-input v-model="form1.remark" type="textarea"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <!-- <el-form-item style="display:none;"> -->
            <el-button @click="submitForm('form1')">提交</el-button>
            <el-button @click="resetForm('form1')">重置</el-button>
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
import { getTree, getDetail, getTableListInfo, pwdReset } from '@/api/jczl'
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
      dis: false,
      cindex: 0,
      tabletitle: [
        {
          prop: 'usercode',
          label: '用户编码'
        },
        {
          prop: 'username',
          label: '用户名称'
        },
        {
          prop: 'sex',
          label: '性别'
        },
        {
          prop: 'telephone',
          label: '电话'
        },
        {
          prop: 'address',
          label: '地址'
        },
        {
          prop: 'remark',
          label: '备注'
        }
      ],
      form1: {
        sex: '男',
        usertp: '财政用户'
      },
      clientButnsArray: ['close', 'cz', 'save', 'abolish', 'refresh', 'update', 'add', 'delete', 'tablePrintPreview', 'tablePrint', 'tablePrintSet', 'tablePrintExport'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      urlPath: '/sys/user',
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
    }),
    form() {
      if (Array.isArray(this.detailInfo) && this.detailInfo.length > 0) {
        this.$refs.layerTable.setCurrentRow(this.table[this.cindex])
        return this.table[this.cindex]
      } else {
        return { }
      }
    },
    table() {
      if (Array.isArray(this.detailInfo)) {
        return this.detailInfo
      } else {
        return []
      }
    }
  },
  watch: {
    table() {
      this.cindex = 0
    }
  },
  beforeCreate() {
    this.$store.commit('INITDETAILINFO')
  },
  created() {
    Bus.$off('refresh')
    Bus.$on('refresh', () => {
      Bus.$emit('handleFocusCurrentNode', this.selectedSubMenuGuid)
      Bus.$emit('SetSubMenuGuid', this.selectedSubMenuGuid)
      this.getDetailRequest({ guid: this.selectedSubMenuGuid })
    })
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
      // this.getTableListRequest(params)
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
    Bus.$off('czyh')
    Bus.$on('czyh', () => {
      this.dis = true
      this.form1 = JSON.parse(JSON.stringify(this.form))
    })
    Bus.$off('mmcz')
    Bus.$on('mmcz', () => {
      // alert(this.form.guid)
      if (this.form.guid) {
        pwdReset({ userid: this.form.guid }).then(res => {
          this.$message({
            showClose: true,
            message: '密码重置成功，重置密码为' + res.msg,
            type: 'success'
          })
        })
      } else {
        this.$message({
          showClose: true,
          message: '请选择要重置的节点',
          type: 'error'
        })
      }
    })
    Bus.$off('del')
    Bus.$on('del', () => {
      if (this.form.guid) {
        this.$confirm('确定要删除此项？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          var status = this.$store.getters.savestate
          // 判断路由地址
          // console.log(this.$route.meta.title)
          var url = '/sys/user/remove'
          var params = {
            guid: this.form.guid
          }
          if (status === 0) {
            request({
              url,
              method: 'post',
              params
            }).then(res => {
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              })
              // 获取更新之后的数据。
              Bus.$emit('getTreeNodeInfo')
              // 设置当前节点状态
              console.log(this.$store.state.app.detailInfo)
              Bus.$emit('handleFocusCurrentNode', this.selectedSubMenuGuid)
              Bus.$emit('SetSubMenuGuid', this.selectedSubMenuGuid)
              console.log(this.$store.state.app.detailInfo.parentguid)
              this.getDetailRequest({ guid: this.selectedSubMenuGuid })
            }).catch((err) => {
              console.log(err)
            })
          } else {
            return
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message({
          showClose: true,
          message: '请选择要删除的节点',
          type: 'error'
        })
        return
      }
    })
  },
  methods: {
    clearValidate() {
      this.$refs['form'].clearValidate()
    },
    rowClick(val) {
      this.$store.dispatch('SETSAVESTATE', 0)
      this.cindex = (this.table.findIndex(item => {
        return item === val
      }))
    },
    // 保存提交
    submitForm(formName) {
      console.log('提交的数据表单资料是：', this.form1)

      if (!this.form1.usercode) {
        this.$message.error('请输入用户编码')
        return
      }
      if (!this.form1.username) {
        this.$message.error('请输入用户名称')
        return
      }
      if (!this.form1.password) {
        this.$message.error('请输入用户密码')
        return
      }
      if (!this.form1.mail) {
        this.$message.error('请输入邮箱')
        return
      }
      if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.form1.mail)) {
        this.$message.error('请输入规范的邮箱')
        return
      }
      var status = this.$store.getters.savestate
      var params = {}
      // 不同的api接口，直接替换一下url字段即可。
      var url = '/sys/user'
      if (status === 0) {
        return
      } else if (status === 1) {
        // 密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)：^[a-zA-Z]\w{5,17}$
        if (!/^[a-zA-Z]\w{5,17}$/.test(this.form1.password)) {
          this.$message.error('密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)')
          return
        }
        // alert('tj')
        // PERUNITTYPE 1,2,3
        // status为1时，点击保存键是添加功能。
        // groupid: this.$store.state.app.selectedNodeInfo.id
        params = Object.assign({
          perunittype: '1',
        	isenabled: '1',
          groupid: this.$store.state.app.selectedNodeInfo.id,
          admdivcode: this.$store.getters.userInfo.admdivcode,
          year: this.$store.getters.userInfo.year,
          appid: 'fsgl' }, this.form1)
        console.log('提交的数据表单资料是params：', params)

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
          this.getDetailRequest({ guid: res.data.groupid })
          Bus.$emit('handleFocusCurrentNode', res.data.groupid)
        }).catch((err) => {
          console.log(err)
        })
      } else if (status === 2) {
        // alert('xg')
        // status为2时，点击保存键是提交修改功能。
        params = this.form1
        console.log('f1', params)
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
          this.getDetailRequest({ guid: res.data.groupid })
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
      this.dis = false
      this.form1.sex = '男'
      this.form1.usertp = '财政用户'
      this.form1.usercode = ''
      this.form1.pername = ''
      this.form1.username = ''
      this.form1.password = ''
      this.form1.mail = ''
      this.form1.telephone = ''
      this.form1.remark = ''
      // this.$store.dispatch('SetDetailInfo', [])
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
    }
    // 自定义事件，用了接受treeComponents触发的获取列表信息事件。
    // getTableListRequest(params) {
    //   getTableListInfo(this.urlPath, params).then(res => {
    //     // 获取到列表信息之后，存到vuex中去。
    //     this.$store.dispatch('SetListInfo', res.data)
    //   })
    // }
  }

}
</script>
<style lang="scss" scoped>
.detail {
  height:100%;
  display: flex;
  flex-direction: column;
}
</style>


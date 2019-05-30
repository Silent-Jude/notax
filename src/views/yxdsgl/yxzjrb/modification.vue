<template>
  <el-dialog :visible.sync="dialogTableVisible" title="编辑资金流水" width="70%">
    <div class="toolbar">
      <!-- 工具条 -->
      <ul>
        <li @click="close()">
          <span class="iconfont icon-guanbi" />
          <p>关闭</p>
        </li>
        <li :class="{'dis-tap':!btnsavestate}" @click="update()">
          <span class="iconfont icon-wulumuqishigongandashujuguanlipingtai-ico- " />
          <p>修改</p>
        </li>
        <li :class="{'dis-tap':btnsavestate}" class="top" @click="save()">
          <span class="iconfont icon-baocun" />
          <p>保存</p>
        </li>
        <li :class="{'dis-tap':btnsavestate}" class="top" @click="abolish()">
          <span class="iconfont icon-tuanduicankaoxian-" />
          <p>取消</p>
        </li>
      </ul>
    </div>
    <!-- 提交表单内容 -->
    <el-form ref="form" size="mini" label-width="80px" style="margin-top: 5px;">
      <el-row>
        <el-col :span="8">
          <el-form-item label="入账日期">
            <el-date-picker
              v-model="form.chargedate"
              value-format="yyyy-MM-dd"
              type="date"
              disabled
              placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="银行流水号">
            <el-input v-model="form.banksn" disabled clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="柜员编号">
            <el-input v-model="form.safecode" disabled clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="银行名称">
            <el-input v-model="form.bankname" disabled clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行网点">
            <el-input v-model="form.bankbranchname" disabled clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="收款账户名">
            <el-input v-model="form.chgagencyacctname" disabled clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对方账户名">
            <el-input :disabled="btnsavestate" v-model="form.peerbankacctname" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="收款账号">
            <el-input v-model="form.chgagencybankaccount" disabled clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对方账号">
            <el-input :disabled="btnsavestate" v-model="form.peerbankacctno" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="收款开户行">
            <el-input v-model="form.chgagencybankname" disabled clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对方开户行">
            <el-input :disabled="btnsavestate" v-model="form.peeracctbank" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="摘要">
            <el-input :disabled="btnsavestate" v-model="form.summary" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input :disabled="btnsavestate" v-model="form.remark" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="指派单位">
            <el-input
              :disabled="btnsavestate"
              v-model="form.agencyname"
              clearable
              placeholder="请输入指派单位" >
              <el-button slot="append" :disabled="btnsavestate" icon="el-icon-caret-bottom" @click="show"/>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="借方">
            <el-input v-model="form.income" disabled clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="贷方">
            <el-input v-model="form.expenditure" disabled clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="资金类型">
            <el-select :disabled="btnsavestate || form.approved !== '2'" v-model="form.fundtype" >
              <el-option label="非税收入" value="0"/>
              <el-option label="利息收入" value="1"/>
              <el-option label="冲正" value="2"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="银行结余">
            <el-input v-model="form.balance" disabled clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="表单结余">
            <el-input v-model="form.formbalance" disabled clearable/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 指派层 -->
    <layer ref="layer1" :tb-head="assignedHead" :form="assignedForm" :table-data="assignedData" title="请选择所属项目" @select="selectassigned" />
  </el-dialog>
</template>
<script>
import yhdsgl from '@/api/yhdsgl/yhdsgl.js'
import layer from '@/components/layer.vue'
export default {
  components: {
    layer
  },
  props: {

  },
  data() {
    return {
      dialogTableVisible: false,
      // 按钮状态
      btnsavestate: true,
      // 保存数据
      form: {},
      // 指派单位表头
      assignedHead: [
        {
          prop: 'agencycode',
          label: '指收单位编码',
          width: '120px'
        },
        {
          prop: 'agencyname',
          label: '执收单位名称',
          width: '170px'
        },
        {
          prop: 'pinyinshortcode',
          label: '拼音简码'
        },
        {
          prop: 'orgcode',
          label: '机构代码'
        },
        {
          prop: 'isleaf',
          label: '末级标志'
        }
      ],
      // 指派单位
      assignedData: [],
      // 指派单位表单
      assignedForm: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '指收单位编码',
            key: 'agencycode'
          },
          {
            val: '执收单位名称',
            key: 'agencyname'
          },
          {
            val: 'pinyinshortcode',
            key: '拼音简码'
          },
          {
            val: '机构代码',
            key: 'orgcode'
          },
          {
            val: '末级标志',
            key: 'isleaf'
          }
        ],
        equal: ''
      }
    }
  },
  computed: {

  },
  watch: {
  },
  created() {
    // 指派单位数据
    yhdsgl.basChargeagency().then(res => {
      this.assignedData = res.data
    })
  },
  mounted() {},
  methods: {
    // 指派单位选择后监听
    selectassigned(val) {
      console.log(val)
      console.log(val.currentRow)
      this.form.agencyname = val.currentRow.agencyname
      this.form.agencyid = val.currentRow.guid
    },
    // 修改
    updateColFund: yhdsgl.updateColFund,
    // 指派单位
    show() {
      this.$refs.layer1.dialogTableVisible = true
    },
    // 关闭
    close() {
      this.btnsavestate = true
      this.dialogTableVisible = false
    },
    // 修改
    update() {
      this.btnsavestate = false
    },
    // 保存
    save() {
      this.updateColFund(this.form).then(res => {
        this.$emit('update')
        this.btnsavestate = true
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      })
    },
    // 取消
    abolish() {
      this.btnsavestate = true
      this.dialogTableVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
$toolba-bg: #cfdef3;
$hover-bg: #c1d6f0;
.toolbar {
  font-size: 12px;
  // $toolba-bg: #cfdef3;
  color: #000;
  height: 50px;
  background: $toolba-bg;
  // border-top: 1px solid #9BBCE8;
  border-bottom: 1px solid #9bbce8;
  ul {
    display: flex;
    height: 100%;
    li {
      background: $toolba-bg;
      cursor: pointer;
      display: flex;
      min-width: 70px;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      border-right: 1px solid #f2f2f2;
      &:hover {
        background: $hover-bg;
        border: 1px solid #538cd9;
      }
      span {
        width: 30px;
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        text-align: center;
        margin-top: 2px;
      }
    }
    .no-border {
      border: 0 none;
    }
    .dis-tap {
      color: #8b8588;
      pointer-events: none;
      cursor: not-allowed;
    }
  }
}
</style>


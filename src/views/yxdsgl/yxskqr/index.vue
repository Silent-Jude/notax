<!--yxskqr 银行收款确认 -->
<template>
  <div class="yxskqr">
    <div class="toolbar">
      <ul>
        <li @click="close()">
          <span class="iconfont icon-guanbi" />
          <p>关闭</p>
        </li>
        <li :class="{'dis-tap': collectionData.charged !== '0'}" @click="collection()">
          <span class="iconfont icon-shoukuanguanli"/>
          <p>确认收款</p>
        </li>
        <li :class="{'dis-tap': collectionData.charged !== '1'}" @click="uncollection()">
          <span class="iconfont icon-guanbi"/>
          <p>取消收款</p>
        </li>
        <li @click="onSubmit()">
          <span class="iconfont icon-jinrongxianxingge-"/>
          <p>查询</p>
        </li>
      </ul>
    </div>
    <!-- 票 -->
    <div class="bill-wrap">
      <div class="bill">
        <div class="row-one">
          <ul>
            <li>
              <input id="" :checked="dataList.audited == 1" type="checkbox" disabled name=""><label>审核</label>
              <span>{{ dataList.auditdate?dataList.auditdate.substring(0,10):dataList.auditdate }}</span>
            </li>
            <li>
              <input id="" :checked="dataList.cancelled == 1" type="checkbox" disabled name=""><label>作废</label>
              <span>{{ dataList.canceldate?dataList.canceldate.substring(0,10):dataList.canceldate }}</span>
            </li>
            <li>
              <input id="" :checked="dataList.charged == 1" type="checkbox" disabled name=""><label>收款</label>
              <span>{{ dataList.chargedate?dataList.chargedate.substring(0,10):dataList.chargedate }}</span>
            </li>
            <li>
              <input id="" :checked="dataList.receipted == 1" type="checkbox" disabled name=""><label>回单</label>
              <span>{{ dataList.regcanceldate?dataList.regcanceldate.substring(0,10):dataList.regcanceldate }}</span>
            </li>
          </ul>
          <div class="bill-num">
            <input id="" v-model="form.track" class="year" placeholder="字轨" type="text" name="" @keyup.enter="onSubmit">
            <input id="" v-model="form.payBillNo" placeholder="请输入缴款书编号" class="num" type="text" name="" @keyup.enter="onSubmit">
          </div>
        </div>
        <div class="row-tow">
          <span>{{ dataList.billdate?dataList.billdate.substring(0,4):dataList.billdate }}</span>
          <span>{{ dataList.billdate?dataList.billdate.substring(5,7):dataList.billdate }}</span>
          <span>{{ dataList.billdate?dataList.billdate.substring(8,10):dataList.billdate }}</span>
          <span>{{ dataList.agencyList[0].agencycode }}</span>
        </div>
        <div class="row-three">
          <span>{{ dataList.agencyList[0].agencyname }}</span>
          <input id="" :checked="dataList.collected == 1" type="checkbox" disabled name="">
          <input id="" :checked="dataList.derated == 1" type="checkbox" disabled name="">
          <span>{{ dataList.agencyList[0].internationalcode }}</span>
        </div>
        <div class="tb">
          <span>{{ dataList.payer }}</span>
          <span>{{ dataList.bankList[0].chgagencyacctname }}</span>
        </div>
        <div class="tb">
          <span>{{ dataList.payerbankacctno }}</span>
          <span>{{ dataList.bankList[0].chgagencybankaccount }}</span>
        </div>
        <div class="tb">
          <span>{{ dataList.payeracctbank }}</span>
          <span>{{ dataList.bankList[0].chgagencybankname }}</span>
        </div>
        <div class="tb1">
          <span>{{ Arabia_To_Chinese }}</span>
          <span>{{ getComma }}</span>
        </div>
        <div class="tb2">
          <div class="tb2-1"/>
          <div v-for="item in dataList.detail" :key="item.proid" class="tb2-1">
            <span>{{ item.proList[0].nontaxcode }}</span>
            <span>{{ item.proList[0].nontaxname }}</span>
            <span>{{ item.proList[0].chargeunit }}</span>
            <span style="text-align: right; width:55px;">{{ item.num }}</span>
            <span>{{ item.proList[0].chargelimit }}-{{ item.proList[0].chargelower }}</span>
            <span style="text-align: right; width:100px;">{{ item.amt.toFixed(2) }}</span>
          </div>
        </div>
        <div class="tb3">
          <span/>
          <span/>
          <span>{{ dataList.remark }}</span>
        </div>
        <div class="row-four">
          <span>{{ dataList.safecode }}</span>
        </div>
      </div>
    </div>
    <!-- 确认收款层 -->
    <el-dialog :visible.sync="dialogFormVisible" title="确认收款" width="450px">
      <el-form label-width="60px" size="mini">
        <el-form-item label="收款日期">
          <el-date-picker
            v-model="collectionData.chargedate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"/>
        </el-form-item>
        <el-form-item label="流水号">
          <el-input v-model="collectionData.banksn" clearable=""/>
        </el-form-item>
        <el-form-item label="银行网点">
          <span style="font-weight: normal; font-size:12px;">{{ collectionData.branchid }}</span>
        </el-form-item>
        <el-form-item label="柜员">
          <span style="font-weight: normal; font-size:12px;">{{ collectionData.payee }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="collectionfn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import yhdsgl from '@/api/yhdsgl/yhdsgl.js'
import formatMoney from '@/utils/formatMoney.js'
function formatTime() {
  var t = new Date()
  var t1 = t.getFullYear()
  var t2 = t.getMonth() + 1
  var t3 = t.getDate()
  return `${t1}-${t2}-${t3}`
}
export default {
  components: {},
  data() {
    return {
      // 确认收款层
      dialogFormVisible: false,
      // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      clientButnsArray: ['close', 'collection', 'uncollection', 'query1'],
      // 提交数据
      form: {
        payBillNo: '',
        track: ''
      },
      // 确认
      collectionData: {},
      // 显示数据
      dataList: {
        safecode: '',
        receipted: '',
        charged: '',
        cancelled: '',
        audited: '',
        remark: '',
        totamt: '',
        billdate: '',
        payer: '',
        payeracctbank: '',
        payerbankacctno: '',
        bankList: [{
          chgagencyacctname: '',
          chgagencybankaccount: '',
          chgagencybankname: ''
        }],
        agencyList: [{
          agencycode: '',
          agencyname: '',
          internationalcode: ''
        }],
        detail: [
        ]
      }
    }
  },

  computed: {
    // 金额转换大写
    Arabia_To_Chinese() {
      return formatMoney.Arabia_To_Chinese(this.dataList.totamt)
    },
    // 数字加千分位
    getComma() {
      return formatMoney.getComma(this.dataList.totamt)
    }
  },

  watch: {},

  created() {},
  methods: {
    // 查询接口
    getTrack: yhdsgl.getTrack,
    // 关闭返回首页
    close() {
      this.$router.push('/')
      this.$message({
        showClose: true,
        message: '回到首页',
        type: 'success'
      })
    },
    // 确认收款层
    collection() {
      this.dialogFormVisible = true
    },
    // 收款
    collectionfn() {
      yhdsgl.chargeTrade(this.collectionData).then(res => {
        this.onSubmit()
        this.$message({
          message: '收款成功',
          type: 'success'
        })
      })
      this.dialogFormVisible = false
    },
    // 取消收款
    uncollection() {
      yhdsgl.unChargeTrade(this.collectionData).then(res => {
        this.onSubmit()
        this.$message({
          message: '取消成功',
          type: 'success'
        })
      })
    },
    // 查询
    onSubmit() {
      if (this.form.payBillNo && this.form.track) {
        this.getTrack(this.form).then(res => {
          console.log('查询', JSON.stringify(res.data))
          this.dataList = res.data
          this.collectionData = Object.assign({}, res.data, { chargedate: formatTime() }, { branchid: this.$store.getters.userInfo.officename }, { payee: this.$store.getters.userInfo.name })
        })
      } else {
        this.$message.error('请输入缴款书编号和字轨')
      }
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
// $toolba-bg: #DFE8F6;
$toolba-bg: #cfdef3;
$hover-bg: #c1d6f0;
.yxskqr{
  display: flex;
  flex-direction: column;
  height: 100%;
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
  .bill-wrap{
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    // background: rgba(0, 0, 0, .2);
    .bill{
      width: 800px;
      height: 400px;
      background: url("../../../assets/bill/jks.jpg");
      position: relative;
      .row-one{
        height: 56px;
        width: 100%;
        ul{
          position:absolute;
          left: 64px;
          li{
            height: 13px;
            line-height: 13px;
            margin-bottom: 1px;
            input{
              -webkit-appearance:checkbox;
              vertical-align: middle;
              margin-right: 4px;
            }
            span{
              margin-left: 6px;
            }
          }
        }
        .bill-num{
          height: 20px;
          width: 155px;
          position: absolute;
          top: 36px;
          right: 38px;
          .year{
            top: 1px;
            position: absolute;
            left: 4px;
            height: 18px;
            line-height: 18px;
            width: 30px;
            // background: rgba(0, 0, 0, .2);
            background: #fff;
            box-sizing: border-box;
            border: 1px solid #9bbce8;
            text-indent: 2px;
          }
          .num{
            top: 1px;
            position: absolute;
            right: 0px;
            height: 18px;
            line-height: 18px;
            width: 98px;
            // background: rgba(0, 0, 0, .2);
            background: #fff;
            box-sizing: border-box;
            border: 1px solid #9bbce8;
            text-indent: 2px;
          }
        }
      }
      .row-tow{
        height: 14px;
        line-height: 16px;
        span{
          position: absolute;
        }
        span:nth-child(1){
          left: 148px;
        }
        span:nth-child(2){
          left: 195px;
        }
        span:nth-child(3){
          left: 230px;
        }
        span:nth-child(4){
          left: 620px;
        }
      }
      .row-three{
        height: 22px;
        line-height: 24px;
        span,input{
          position: absolute;
        }
         span:nth-child(1){
          left: 132px;
        }
         input:nth-child(2){
          -webkit-appearance:checkbox;
          margin-top: 7px;
          left: 452px;
        }
         input:nth-child(3){
          -webkit-appearance:checkbox;
          margin-top: 7px;
          left: 504px;
        }
         span:nth-child(4){
          left: 620px;
        }
      }
      .tb{
        height: 26px;
        line-height: 26px;
        span{
          position: absolute;
        }
        span:nth-child(1){
          left: 177px;
        }
        span:nth-child(2){
          left: 508px;
        }
      }
      .tb1{
        height: 20px;
        line-height: 20px;
        span{
          position: absolute;
        }
        span:nth-child(1){
          left: 154px;
        }
        span:nth-child(2){
          left: 530px;
        }
      }
      .tb2{
        .tb2-1{
          height: 24px;
        }
        height: 120px;
        line-height: 24px;
        span{
          position: absolute;
        }
        span:nth-child(1){
          left: 74px;
        }
        span:nth-child(2){
          left: 154px;
        }
        span:nth-child(3){
          left: 406px;
        }
        span:nth-child(4){
          left: 470px;
        }
        span:nth-child(5){
          left: 540px;
        }
        span:nth-child(6){
          left: 618px;
        }
      }
      .tb3{
        height: 56px;
        line-height: 22px;
        span{
          position: absolute;
        }
        span:nth-child(1){
          left: 200px;
        }
        span:nth-child(2){
          left: 378px;
        }
        span:nth-child(3){
          left: 506px;
          width: 220px;
          line-height: 16px;
        }
      }
      .row-four{
        height: 30px;
        line-height: 30px;
        span{
          position: absolute;
          left: 160px;
        }
      }
    }
  }
}
</style>

<!--yxskqr 银行收款确认 -->
<template>
  <div class="yxskqr">
    <!-- <toolBar :client-butns-array="clientButnsArray"/> -->
    <el-button @click="getColTrade('402810816a66fc10016a67df97cc0027')">查询</el-button>
    <el-button @click="save()">save</el-button>
    <el-button @click="sh(1)">审核</el-button>
    <el-button @click="sh(0)">反审</el-button>
    <el-button @click="jzhj()">集中汇缴</el-button>
    <div class="bill-wrap">
      <div class="bill">
        <div class="row-one">
          <ul>
            <li>
              <input id="" :checked="colTrade.audited == 1" type="checkbox" disabled name=""><label>审核</label>
              <span>{{ colTrade.auditdate?colTrade.auditdate.substring(0,10):colTrade.auditdate }}</span>
            </li>
            <li>
              <input id="" :checked="colTrade.cancelled == 1" type="checkbox" disabled name=""><label>作废</label>
              <span>{{ colTrade.canceldate?colTrade.canceldate.substring(0,10):colTrade.canceldate }}</span>
            </li>
            <li>
              <input id="" :checked="colTrade.charged == 1" type="checkbox" disabled name=""><label>收款</label>
              <span>{{ colTrade.chargedate?colTrade.chargedate.substring(0,10):colTrade.chargedate }}</span>
            </li>
            <li>
              <input id="" :checked="colTrade.receipted == 1" type="checkbox" disabled name=""><label>回单</label>
              <span>{{ colTrade.regcanceldate?colTrade.regcanceldate.substring(0,10):colTrade.regcanceldate }}</span>
            </li>
          </ul>
          <div class="bill-num">
            <input id="" v-model="colTrade.track" class="year" placeholder="字轨" type="text" name="">
            <input
              id=""
              v-model="colTrade.paybillno"
              placeholder="请输入编号"
              class="num"
              type="text"
              name=""
              @dblclick="selectStoreAgency()">
          </div>
        </div>
        <div class="row-tow">
          <span>{{ colTrade.billdate?colTrade.billdate.substring(0,4):colTrade.billdate }}</span>
          <span>{{ colTrade.billdate?colTrade.billdate.substring(5,7):colTrade.billdate }}</span>
          <span>{{ colTrade.billdate?colTrade.billdate.substring(8,10):colTrade.billdate }}</span>
          <span>{{ agency.agencycode }}</span>
        </div>
        <div class="row-three">
          <span @click="showBasagency()"><input v-model="agency.agencyname"></span>
          <input :checked="colTrade.collected == 1" type="checkbox" disabled>
          <input :checked="colTrade.derated == 1" type="checkbox" disabled>
          <span>{{ agency.orgcode }}</span>
        </div>
        <div class="tb">
          <span><input v-model="colTrade.payer"></span>
          <span><input v-model="bank.chgagencyacctname" @click="selectBank()"></span>
        </div>
        <div class="tb">
          <span><input v-model="colTrade.payerbankacctno"></span>
          <span><input v-model="bank.chgagencybankaccount"></span>
        </div>
        <div class="tb">
          <span><input v-model="colTrade.payeracctbank"></span>
          <span><input v-model="bank.chgagencybankname"></span>
        </div>
        <div class="tb1">
          <span>{{ Arabia_To_Chinese }}</span>
          <span>{{ getComma }}</span>
        </div>

        <div class="tb2">
          <div class="tb2-1"/>
          <div v-for="(item,index) in colTrade.colTradeDetails.colTradeDetail" :key="index" class="tb2-1">
            <span @click="addPro(index)">{{ projectList[index].nontaxcode }}</span>
            <span>{{ projectList[index].nontaxname }}</span>
            <span>{{ projectList[index].chargeunit }}</span>
            <span><input v-model="item.num"></span>
            <span>{{ projectList[index].chargelower }}-{{ projectList[index].chargelimit }}</span>
            <span><input v-model="item.amt"></span>
          </div>
          <div v-if="colTrade.colTradeDetails.colTradeDetail.length<4" class="tb2-1">
            <span @click="addPro(colTrade.colTradeDetails.colTradeDetail.length)"><button>add</button> </span>
            <span/>
            <span/>
            <span/>
            <span/>
            <span/>
          </div>

        </div>
        <div class="tb3">
          <span>{{ colTrade.drawer }}</span>
          <span>{{ colTrade.auditor }}</span>
          <span>{{ colTrade.remark }}</span>
        </div>
        <div class="row-four">
          <span>{{ colTrade.safecode }}</span>
        </div>
      </div>
    </div>
    <!-- 2 -->
    <layer
      ref="layer"
      :tb-head="tbHead"
      :form="formBasagency"
      :table-data="BasagencyList"
      title="请选择开票单位"
      @select="getSelect"/>
    <layer
      ref="layer1"
      :tb-head="absHead"
      :form="formabs"
      :table-data="AgencyBillStore"
      title="请选择票据库存"
      @select="getStore"/>
    <layer
      ref="layer2"
      :tb-head="yhHead"
      :form="formyh"
      :table-data="BasRemittedbank"
      title="银行"
      @select="getBank"/>
    <layer
      ref="layer3"
      :tb-head="xmHead"
      :form="formxm"
      :table-data="BasPro"
      title="项目"
      @select="getPro"/>

    <el-dialog ref="layer4" :visible.sync="dialogTableVisible" width="80%" title="核销">
      <el-table
        :data="colTrade.bilVerification.bilVerificationDetails.bilVerificationDetail"
        :row-class-name="rowClassName"
        height="100px"
        @row-click="clickInvalids"
      >
        <el-table-column label="票据编码" width="150">
          <template slot-scope="scope">
            <!-- <button @click="">删除</button>
            <button @click="">add</button> -->
          </template>
        </el-table-column>
        <el-table-column label="票据编码" width="150">
          <template slot-scope="scope">
            {{ VerificationBillInfoList[scope.$index].billcode }}
          </template>
        </el-table-column>
        <el-table-column label="票据名称" width="150">
          <template slot-scope="scope">
            {{ VerificationBillInfoList[scope.$index].billname }}
          </template>
        </el-table-column>
        <el-table-column property="startnumber" label="起始号码" width="150"/>
        <el-table-column property="endnumber" label="终止号码" width="200"/>
        <el-table-column property="num" label="份数"/>
        <el-table-column property="counts" label="本数"/>
        <el-table-column property="price" label="单价"/>
        <el-table-column property="amount" label="amount"/>
      </el-table>

      <el-table
        ref="invalids"
        :data="colTrade.bilVerification.bilVerificationDetails.bilVerificationDetail[0].bilVerificationInvalids.bilVerificationInvalid"
        height="100px">
        <el-table-column property="startnumber" label="起始号码" width="150"/>
        <el-table-column property="endnumber" label="终止号码" width="200"/>
        <el-table-column property="num" label="数量" width="200"/>
        <el-table-column property="reason" label="作废原因" width="200"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import toolBar from '@/components/toolBar'
import Bus from '@/utils/Bus'
import formatMoney from '@/utils/formatMoney.js'
import request from '@/utils/request'
import layer from '@/components/layer'

// function formatTime() {
//   var t = new Date()
//   var t1 = t.getFullYear()
//   var t2 = t.getMonth() + 1
//   var t3 = t.getDate()
//   return `${t1}-${t2}-${t3}`
// }

export default {
  components: {
    toolBar,
    layer
  },
  data() {
    return {
      // 确认收款层
      dialogFormVisible: false,
      // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      // clientButnsArray: ['close', 'collection', 'uncollection', 'query', 'sh', 'unsh', 'unsh'],
      // 提交数据
      // form: {
      //   payBillNo: '',
      //   track: ''
      // },
      // 确认
      // collectionData: {
      //   // chargedate: formatTime()
      //   // bankid: '',
      //   // banksn: '',
      //   // branchid: '',
      //   // guid: '',
      //   // payee: ''
      // },

      // 内
      colTradeDetail: {
        'admdivcode': '',
        'amt': 0,
        'banksn': '',
        'billid': '',
        'createdate': null,
        'creator': '',
        'guid': '',
        'modifier': '',
        'modifydate': null,
        'num': '',
        'operagc': '',
        'overduefine': 0,
        'paybillno': '',
        'proid': '',
        'remark': '',
        'track': '',
        'tradeid': '',
        'year': ''
      },
      agency: {},
      bank: {},
      projectList: [],
      VerificationBillInfoList: [],
      // 保存数据
      colTrade: {
        'accredit': '',
        'additional': '',
        'admdivcode': '',
        'agencyid': '',
        'approved': '',
        'auditdate': '',
        'audited': '',
        'auditor': '',
        'bankid': '',
        'banksn': '',
        'billdate': null,
        'billid': '',
        'branchid': '',
        'busitype': '', // 新增的时候 busitype 固定为 0000
        'canceldate': null,
        'cancelled': '',
        'canceller': '',
        'carrytype': '',
        'charged': '',
        'chargedate': null,
        'collected': '',
        'confirm': '',
        'createdate': null,
        'creator': '',
        'derated': '',
        'drawer': '',
        'guid': '',
        'hallno': '',
        'hitinacctdate': null,
        'instead': '',
        'modifier': '',
        'modifydate': null,
        'noticeno': '',
        'operagc': '',
        'paybillno': '',
        'payee': '',
        'payer': '',
        'payeracctbank': '',
        'payerbankacctno': '',
        'receipted': '',
        'receiptnumber': '',
        'regcanceldate': null,
        'regcancelled': '',
        'regcanceller': '',
        'reliefapplyid': '',
        'remark': '',
        'safecode': '',
        'totamt': '',
        'track': '',
        'tradedate': null,
        'tradeno': '',
        'year': '',
        'colTradeDetails': {
          'colTradeDetail': []
        },
        'bilVerification': {
          'admdivcode': '',
          'approvaldate': '',
          'approvalmark': '',
          'auditOpinion': '',
          'auditdate': '',
          'auditmark': '',
          'bilVerificationDetails': {
            'bilVerificationDetail': [
              {
                'admdivcode': '',
                'amount': 0,
                'balancecount': 0,
                'bilVerificationCharges': {
                  'bilVerificationCharge': [
                    {
                      'accounts': 0,
                      'accountspay': 0,
                      'admdivcode': '',
                      'amount': 0,
                      'bilBasChargeProjects': {
                        'basChargeProject': [
                          {
                            'accountclsenumguid': '',
                            'admdivcode': '',
                            'allowquerymark': '',
                            'billguid': '',
                            'chargedocno': '',
                            'chargelimit': 0,
                            'chargelower': 0,
                            'chargetypeguid': '',
                            'chargeunit': '',
                            'collectionmet': '',
                            'createdate': '',
                            'creator': '',
                            'fundtypeguid': '',
                            'guid': '',
                            'incomesortguid': '',
                            'internalcontactmark': '',
                            'isenabled': '',
                            'isleaf': '',
                            'ispublicprogram': '',
                            'levelnum': '',
                            'modifier': '',
                            'modifydate': '',
                            'nid': '',
                            'nontaxcode': '',
                            'nontaxfallname': '',
                            'nontaxname': '',
                            'parentguid': '',
                            'remark': '',
                            'salestax': 0,
                            'usedmark': '',
                            'year': ''
                          }
                        ]
                      },
                      'createdate': '',
                      'creator': '',
                      'enddate': '',
                      'guid': '',
                      'inconvenient': 0,
                      'modifier': '',
                      'modifydate': '',
                      'nontaxid': '',
                      'operator': '',
                      'receipNo': '',
                      'remark': '',
                      'startdate': '',
                      'unpaidacc': 0,
                      'verifdetailid': '',
                      'year': ''
                    }
                  ]
                },
                'bilVerificationInvalids': {
                  'bilVerificationInvalid': [
                    {
                      'admdivcode': '',
                      'amount': 0,
                      'billid': '',
                      'counts': 0,
                      'createdate': '',
                      'creator': '',
                      'endnumber': '',
                      'guid': '',
                      'modifier': '',
                      'modifydate': '',
                      'num': 0,
                      'operator': '',
                      'price': 0,
                      'reason': '',
                      'receipNo': '',
                      'remark': '',
                      'startnumber': '',
                      'track': '',
                      'veridetailid': '',
                      'year': ''
                    }
                  ]
                },
                'billid': '',
                'copies': 0,
                'counts': 0,
                'createdate': '',
                'creator': '',
                'endnumber': '',
                'guid': '',
                'invalidnum': 0,
                'modifier': '',
                'modifydate': '',
                'num': 0,
                'operator': '',
                'price': 0,
                'printed': '',
                'receipNo': '',
                'remark': '',
                'startnumber': '',
                'totalverifnum': 0,
                'track': '',
                'verificationid': '',
                'year': ''
              }
            ]
          },
          'billpermitid': '',
          'carrytype': '',
          'createdate': '',
          'creator': '',
          'delivered': '',
          'guid': '',
          'modifier': '',
          'modifydate': '',
          'operator': '',
          'payinagencyid': '',
          'printed': '',
          'receipNo': '',
          'remark': '',
          'reviewer': '',
          'tradeid': '',
          'verificdate': '',
          'year': ''
        }
      },
      // 票据名称对话框表头
      tbHead: [
        {
          prop: 'agencycode',
          label: '单位编码'
        },
        {
          prop: 'agencyname',
          label: '票据名称'
        }
        // {
        //   prop: 'pinyincode',
        //   label: '拼音简码'
        // },
        // {
        //   prop: 'unitprice',
        //   label: '单价'
        // },
        // {
        //   prop: 'pricingmet',
        //   label: '计价方式'
        // },
        // {
        //   prop: 'portions',
        //   label: '每本份数'
        // }
      ],
      // 票据名称对话框表单数据
      formBasagency: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            prop: 'agencycode',
            label: '单位编码'
          },
          {
            prop: 'agencyname',
            label: '票据名称'
          },
          {
            val: '拼音简码',
            key: 'pinyincode'
          },
          {
            val: '单价',
            key: 'unitprice'
          },
          {
            val: '计价方式',
            key: 'pricingmet'
          },
          {
            val: '每本份数',
            key: 'portions'
          }
        ],
        equal: ''
      },
      // 票据种类表格数据
      BasagencyList: [],

      // 票种信息
      billinfo: {},

      // 单位票据库存
      AgencyBillStore: [],
      absHead: [
        {
          prop: 'billcode',
          label: '单位编码'
        },
        {
          prop: 'startnumber',
          label: '单位编码'
        },
        {
          prop: 'endnumber',
          label: '票据名称'
        }
        // {
        //   prop: 'pinyincode',
        //   label: '拼音简码'
        // },
        // {
        //   prop: 'unitprice',
        //   label: '单价'
        // },
        // {
        //   prop: 'pricingmet',
        //   label: '计价方式'
        // },
        // {
        //   prop: 'portions',
        //   label: '每本份数'
        // }
      ],
      formabs: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            prop: 'agencycode',
            label: '单位编码'
          },
          {
            prop: 'agencyname',
            label: '票据名称'
          },
          {
            val: '拼音简码',
            key: 'pinyincode'
          },
          {
            val: '单价',
            key: 'unitprice'
          },
          {
            val: '计价方式',
            key: 'pricingmet'
          },
          {
            val: '每本份数',
            key: 'portions'
          }
        ],
        equal: ''
      },
      // 单位票据库存
      BasRemittedbank: [],
      yhHead: [
        {
          prop: 'bankcode',
          label: '单位编码'
        },
        {
          prop: 'bankname',
          label: '单位编码'
        },
        {
          prop: 'endnumber',
          label: '票据名称'
        }
        // {
        //   prop: 'pinyincode',
        //   label: '拼音简码'
        // },
        // {
        //   prop: 'unitprice',
        //   label: '单价'
        // },
        // {
        //   prop: 'pricingmet',
        //   label: '计价方式'
        // },
        // {
        //   prop: 'portions',
        //   label: '每本份数'
        // }
      ],
      formyh: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            prop: 'agencycode',
            label: '单位编码'
          },
          {
            prop: 'agencyname',
            label: '票据名称'
          },
          {
            val: '拼音简码',
            key: 'pinyincode'
          },
          {
            val: '单价',
            key: 'unitprice'
          },
          {
            val: '计价方式',
            key: 'pricingmet'
          },
          {
            val: '每本份数',
            key: 'portions'
          }
        ],
        equal: ''
      }, // 单位票据库存
      BasPro: [],
      xmHead: [
        {
          prop: 'nontaxcode',
          label: '单位编码'
        },
        {
          prop: 'nontaxname',
          label: '单位编码'
        },
        {
          prop: 'endnumber',
          label: '票据名称'
        }
        // {
        //   prop: 'pinyincode',
        //   label: '拼音简码'
        // },
        // {
        //   prop: 'unitprice',
        //   label: '单价'
        // },
        // {
        //   prop: 'pricingmet',
        //   label: '计价方式'
        // },
        // {
        //   prop: 'portions',
        //   label: '每本份数'
        // }
      ],
      formxm: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            prop: 'agencycode',
            label: '单位编码'
          },
          {
            prop: 'agencyname',
            label: '票据名称'
          },
          {
            val: '拼音简码',
            key: 'pinyincode'
          },
          {
            val: '单价',
            key: 'unitprice'
          },
          {
            val: '计价方式',
            key: 'pricingmet'
          },
          {
            val: '每本份数',
            key: 'portions'
          }
        ],
        equal: ''
      },
      LastEditProIndex: -1,
      dialogTableVisible: false
    }
  },

  computed: {
    // 金额转换大写
    Arabia_To_Chinese() {
      return formatMoney.Arabia_To_Chinese(this.colTrade.totamt)
    },
    // 数字加千分位
    getComma() {
      return formatMoney.getComma(this.colTrade.totamt)
    }
  },

  watch: {},

  created() {
    // 确认收款
    Bus.$off('collection')
    Bus.$on('collection', () => {
      this.collection()
    })
    // 取消收款
    Bus.$off('uncollection')
    Bus.$on('uncollection', () => {
      this.uncollection()
    })
    // 查询
    Bus.$off('query')
    Bus.$on('query', () => {
      this.onSubmit()
    })

    // billINFO
    request({
      url: '/billing/query/nontaxParamCodeToBillInfo',
      method: 'get',
      params: {
        code: '303001'
      }
    }).then(res => {
      this.billinfo = res.data
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })

    // 开票单位List
    request({
      url: '/bas/basChargeagency/find?isleaf=1&isenabled=1',
      method: 'get'
    }).then(res => {
      this.BasagencyList = res.data
    })
    // 收款银行
    request({
      url: '/bas/basRemittedbank/find?isleaf=1&isenabled=1',
      method: 'get'
    }).then(res => {
      this.BasRemittedbank = res.data
    })
  },
  methods: {
    // 查询接口
    // getTrack: yhdsgl.getTrack,
    // 确认收款层
    collection() {
    },
    sh(type) {
      // 审核
      var url = '/billing/trade/auditTrade'
      var params = {
        guid: this.colTrade.guid,
        type: type
      }
      request({
        url,
        method: 'post',
        params: params
      }).then(res => {
        console.log(res)
      })
    },
    // 取消收款
    uncollection() {

    },
    getColTrade(guid) {
      // 查询单条
      var url = '/billing/trade/get'
      request({
        url,
        method: 'get',
        params: {
          guid: guid
        }
      }).then(res => {
        this.colTrade = res.data.colTrade
        this.agency = res.data.agency
        this.bank = res.data.bank
        this.projectList = res.data.projectList
        this.VerificationBillInfoList = res.data.VerificationBillInfoList
      })
    },
    // 票据名称对话框显示
    showBasagency() {
      this.$refs.layer.dialogTableVisible = true
    },
    // 查询
    onSubmit() {
    },
    // 添加项目
    addPro(index) {
      request({
        url: '/billing/query/agency2Project',
        method: 'get',
        params: {
          agencyId: this.agency.guid
        }
      }).then(res => {
        this.LastEditProIndex = index
        this.BasPro = res.data
        this.$refs.layer3.dialogTableVisible = true
      })
    },
    // 获取选择名称
    getSelect(datas) {
      this.agency = datas.currentRow
      this.colTrade.agencyid = datas.currentRow.guid

      request({
        url: '/billing/query/getPayBillNo',
        method: 'get',
        params: {
          agencyId: datas.currentRow.guid,
          billId: this.billinfo.guid
        }
      }).then(res => {
        this.colTrade.track = res.data.track
        this.colTrade.paybillno = res.data.paybillno
      })
    },
    selectBank() {
      this.$refs.layer2.dialogTableVisible = true
    },
    // 加载单位库存
    selectStoreAgency() {
      request({
        url: '/billing/query/findBillStoreAgencycheck',
        method: 'get',
        params: {
          agencyId: this.agency.guid,
          billId: this.billinfo.guid
        }
      }).then(res => {
        this.AgencyBillStore = res.data
        this.$refs.layer1.dialogTableVisible = true
      })
    },
    // 选择库存
    getStore(datas) {
      this.colTrade.track = datas.currentRow.track
      this.colTrade.paybillno = datas.currentRow.startnumber
    },
    // 选择银行
    getBank(datas) {
      this.bank = datas.currentRow
      this.colTrade.bankid = this.bank.guid
    },
    // 选择项目
    getPro(datas) {
      if (this.colTrade.colTradeDetails.colTradeDetail[this.LastEditProIndex] == null) {
        this.projectList.push(datas.currentRow)
        this.colTrade.colTradeDetails.colTradeDetail.push({
          proid: datas.currentRow.guid,
          num: 1,
          amt: datas.currentRow.chargelimit
        })
      } else {
        this.projectList[this.LastEditProIndex] = datas.currentRow
        this.colTrade.colTradeDetails.colTradeDetail[this.LastEditProIndex].proid = datas.currentRow.guid
      }
    },
    save() {
      this.colTrade.busitype = '0000'
      // 'busitype': '', // 新增的时候 busitype 固定为 0000

      request({
        url: '/billing/trade/saveColTrade',
        method: 'post',
        data: this.colTrade
      }).then(res => {
      })
    },
    // 集中汇缴
    jzhj() {
      this.dialogTableVisible = true
    },
    clickInvalids(row) {
      const index = row.index
      this.$refs.invalids.data = this.colTrade.bilVerification.bilVerificationDetails.bilVerificationDetail[index].bilVerificationInvalids.bilVerificationInvalid
    },
    rowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex
      console.log(row)
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
  .yxskqr {
    display: flex;
    flex-direction: column;
    height: 100%;

    .bill-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      // background: rgba(0, 0, 0, .2);
      .bill {
        width: 800px;
        height: 400px;
        background: url("../../../assets/bill/jks.jpg");
        position: relative;

        .row-one {
          height: 56px;
          width: 100%;

          ul {
            position: absolute;
            left: 64px;

            li {
              height: 13px;
              line-height: 13px;
              margin-bottom: 1px;

              input {
                -webkit-appearance: checkbox;
                vertical-align: middle;
                margin-right: 4px;
              }

              span {
                margin-left: 6px;
              }
            }
          }

          .bill-num {
            height: 20px;
            width: 155px;
            position: absolute;
            top: 36px;
            right: 38px;

            .year {
              top: 1px;
              position: absolute;
              left: 4px;
              height: 18px;
              line-height: 18px;
              width: 30px;
              background: rgba(0, 0, 0, .2);
              box-sizing: border-box;
              border: 1px solid #9bbce8;
              text-indent: 2px;
            }

            .num {
              top: 1px;
              position: absolute;
              right: 0px;
              height: 18px;
              line-height: 18px;
              width: 98px;
              background: rgba(0, 0, 0, .2);
              box-sizing: border-box;
              border: 1px solid #9bbce8;
              text-indent: 2px;
            }
          }
        }

        .row-tow {
          height: 14px;
          line-height: 16px;

          span {
            position: absolute;
          }

          span:nth-child(1) {
            left: 148px;
          }

          span:nth-child(2) {
            left: 195px;
          }

          span:nth-child(3) {
            left: 230px;
          }

          span:nth-child(4) {
            left: 620px;
          }
        }

        .row-three {
          height: 22px;
          line-height: 24px;

          span, input {
            position: absolute;
          }

          span:nth-child(1) {
            left: 132px;
          }

          input:nth-child(2) {
            -webkit-appearance: checkbox;
            margin-top: 7px;
            left: 452px;
          }

          input:nth-child(3) {
            -webkit-appearance: checkbox;
            margin-top: 7px;
            left: 504px;
          }

          span:nth-child(4) {
            left: 620px;
          }
        }

        .tb {
          height: 26px;
          line-height: 26px;

          span {
            position: absolute;
          }

          span:nth-child(1) {
            left: 177px;
          }

          span:nth-child(2) {
            left: 508px;
          }
        }

        .tb1 {
          height: 20px;
          line-height: 20px;

          span {
            position: absolute;
          }

          span:nth-child(1) {
            left: 154px;
          }

          span:nth-child(2) {
            left: 530px;
          }
        }

        .tb2 {
          .tb2-1 {
            height: 24px;
          }

          height: 120px;
          line-height: 24px;

          span {
            position: absolute;
          }

          span:nth-child(1) {
            left: 74px;
          }

          span:nth-child(2) {
            left: 154px;
          }

          span:nth-child(3) {
            left: 406px;
          }

          span:nth-child(4) {
            left: 470px;
          }

          span:nth-child(5) {
            left: 540px;
          }

          span:nth-child(6) {
            left: 618px;
          }
        }

        .tb3 {
          height: 56px;
          line-height: 22px;

          span {
            position: absolute;
          }

          span:nth-child(1) {
            left: 200px;
          }

          span:nth-child(2) {
            left: 378px;
          }

          span:nth-child(3) {
            left: 506px;
            width: 220px;
            line-height: 16px;
          }
        }

        .row-four {
          height: 30px;
          line-height: 30px;

          span {
            position: absolute;
            left: 160px;
          }
        }
      }
    }
  }
</style>

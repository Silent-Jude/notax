<!--直接缴款 -->
<template>
  <div class="yxskqr">
    <!-- 工具条 -->
    <div class="toolbar">
      <!-- {{ audited }}
      {{ cancelled }}
      {{ receipted }}
      {{ charged }} -->
      <ul>
        <li @click="close()">
          <span class="iconfont icon-guanbi" />
          <p>关闭</p>
        </li>
        <li :class="{'dis-tap':audited == '01'}" @click="clear()">
          <span class="iconfont icon-tianjia" />
          <p>添加</p>
        </li>
        <!-- 未审核时 -->
        <li :class="{'dis-tap':audited == '01'|| audited == '1'|| charged == '1'}" @click="update()">
          <span class="iconfont icon-wulumuqishigongandashujuguanlipingtai-ico- " />
          <p>修改</p>
        </li>
        <!-- 未审核时 -->
        <li :class="{'dis-tap':audited == '01'|| audited == '1' || charged == '1'}" @click="del()">
          <span class="iconfont icon-shanchu " />
          <p>删除</p>
        </li>
        <li :class="{'dis-tap':audited != '01'}" @click="save()">
          <span class="iconfont icon-baocun" />
          <p>保存</p>
        </li>
        <li :class="{'dis-tap':audited != '01'}" @click="clear()">
          <span class="iconfont icon-tuanduicankaoxian-" />
          <p>取消</p>
        </li>
        <!-- 未审核时 -->
        <li :class="{'dis-tap':audited =='01'||audited=='1'|| receipted=='1' || charged == '1'}" @click="billAudit()">
          <span class="iconfont icon-shenhe" />
          <p>审核</p>
        </li>
        <li :class="{'dis-tap':audited =='01'||audited=='0'||receipted=='1'|| cancelled=='1' || charged == '1'}" @click="billUnaudit()">
          <span class="iconfont icon-fanshenhe" />
          <p>反审</p>
        </li>
        <li :class="{'dis-tap':audited =='01'||audited =='0'||cancelled=='1'||receipted=='1' || charged == '1'}" @click="cancel()">
          <span class="iconfont icon-ico_caiwuguanli_dingdanzuofei " />
          <p>作废</p>
        </li>
        <li :class="{'dis-tap':audited =='01'||audited =='0'||cancelled=='0'||receipted=='1' || charged == '1'}" @click="uncollection()">
          <span class="iconfont icon-guanbi"/>
          <p>取消</p>
        </li>
        <li :class="{'dis-tap':receipted =='01'||receipted=='1' || charged != '1'}" @click="receipt">
          <span class="iconfont icon-huidanqueren" />
          <p>回单</p>
        </li>
        <li :class="{'dis-tap':receipted=='01'||receipted=='0' ||charged != '1'}" @click="abolish">
          <span class="iconfont icon-tuanduicankaoxian-" />
          <p>取消</p>
        </li>
        <li @click="query">
          <span class="iconfont icon-jinrongxianxingge-" />
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
            <input id="" v-model="colTrade.track" :disabled="audited !=='01'" class="year" type="text" name="">
            <input id="" v-model="colTrade.paybillno" :disabled="audited !=='01'" class="num" type="text" name="" @change="paybillnoChange" @dblclick="selectStoreAgency">
            <i v-show="audited =='01'" class="el-icon-search" style="font-size:16px;position: absolute;right: 2px;top:2px"/>
          </div>
        </div>
        <div class="row-tow">
          <span>{{ colTrade.billdate?colTrade.billdate.substring(0,4):colTrade.billdate }}</span>
          <span>{{ colTrade.billdate?colTrade.billdate.substring(5,7):colTrade.billdate }}</span>
          <span>{{ colTrade.billdate?colTrade.billdate.substring(8,10):colTrade.billdate }}</span>
          <span>{{ agency.agencycode }}</span>
        </div>
        <div class="row-three">
          <span style="margin-top:5px;">
            <input v-model="agency.agencyname" :disabled="audited !=='01'" readonly style="width:250px;" type="text" @dblclick="showBasagency()">
            <i v-show="audited =='01'" class="el-icon-search" style="font-size:16px;position: absolute;left: 230px;top:0px"/>
          </span>
          <button v-show="audited == '01'" style="height:26px;position: absolute;left: 390px;width:80px;border:1px solid #9bbce8;" @click="remit">&nbsp;</button>
          <input id="" :checked="colTrade.collected == 1" style="left:452px;" type="checkbox" disabled name="">
          <button
            v-show=" colTrade.collected == 1 && audited =='01'"
            style="position: absolute;height:20px;line-height:20px;left: 390px;width:80px;border:1px solid #9bbce8;margin-top:-22px;text-align: center;"
            @click="remitdel">删除</button>
          <input id="" :checked="colTrade.derated == 1" style="left:505px;-webkit-appearance: checkbox;margin-top:7px;" type="checkbox" disabled name="">
          <span style="left:620px;">{{ agency.orgcode }}</span>
        </div>
        <div class="tb">
          <span>
            <input v-model="colTrade.payer" :disabled="audited !=='01'" style="width:220px;" type="text" @dblclick="selectPay">
            <i v-show="audited =='01'" class="el-icon-search" style="font-size:16px;position: absolute;left: 200px;top:5px"/>
          </span>
          <span>
            <input v-model="bank.chgagencyacctname" :disabled="audited !=='01'" readonly style="width:215px;" type="text" @dblclick="selectBank">
            <i v-show="audited =='01'" class="el-icon-search" style="font-size:16px;position: absolute;left: 196px;top:5px"/>
          </span>
        </div>
        <div class="tb">
          <span><input v-model="colTrade.payerbankacctno" :disabled="audited !=='01'" style="width:220px;" type="text"></span>
          <!-- <span>{{ colTrade.payerbankacctno }}</span> -->
          <span>{{ bank.chgagencybankaccount }}</span>
        </div>
        <div class="tb">
          <span><input v-model="colTrade.payeracctbank" :disabled="audited !=='01'" style="width:220px;" type="text"></span>
          <!-- <span>{{ colTrade.payeracctbank }}</span> -->
          <span>{{ bank.chgagencybankname }}</span>
        </div>
        <div class="tb1">
          <span>{{ Arabia_To_Chinese }}</span>
          <span>{{ getComma }}</span>
        </div>
        <div class="tb2">
          <div class="tb2-1"/>
          <div v-for="(item,index) in colTrade.colTradeDetails.colTradeDetail" :key="item.proid" class="tb2-1">
            <span > <button v-show="audited =='01'" :disabled="audited !=='01'" class="del" @click="delitem(index)">x</button> <button :disabled="audited !=='01'" style="font-style: normal" @dblclick="addPro(index)">{{ projectList[index].nontaxcode }}</button></span>
            <span>{{ projectList[index].nontaxname }}</span>
            <span>{{ projectList[index].chargeunit }}</span>
            <span><input v-model="item.num" :disabled="audited !=='01'" style="width:55px; text-align: right;" type="text"></span>
            <span>{{ projectList[index].chargelower }}-{{ projectList[index].chargelimit }}</span>
            <span><input v-model="item.amt" :disabled="audited !=='01'" style="width:100px; text-align: right;" type="text"></span>
          </div>
          <div v-if="colTrade.colTradeDetails.colTradeDetail.length<4" class="tb2-1">
            <span>
              <button v-show="audited =='01'" :disabled="audited !=='01'" class="add" @click="addPro(colTrade.colTradeDetails.colTradeDetail.length)">添加</button>
            </span>
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
          <span><textarea id="" v-model="colTrade.remark" :disabled="audited !=='01'" name="" style="width:215px;height:50px;resize:none" /></span>
        </div>
        <div class="row-four">
          <span>{{ colTrade.safecode }}</span>
        </div>
      </div>
    </div>
    <!-- 查询层 -->
    <query ref="query" @select="selectQuery"/>
    <!-- 选择票据 -->
    <layer ref="layer1" :tb-head="billHead" :form="billForm" :table-data="AgencyBillStore" title="选择票据" @select="getStore" />
    <!-- 单位名称 -->
    <layer ref="layer" :tb-head="tbHead" :form="formBasagency" :table-data="BasagencyList" title="选择所属项目" @select="getSelect" />
    <!-- 收款人全称 -->
    <layer ref="layer2" :tb-head="yhHead" :form="formyh" :table-data="BasRemittedbank" title="选择收款人" @select="getBank" />
    <!-- 付款人全称 -->
    <layer ref="layer0" :tb-head="payHead" :form="formpay" :table-data="paybank" title="选择缴款人" @select="payBank" />
    <!-- 项目 -->
    <layer ref="layer3" :tb-head="xmHead" :form="formxm" :table-data="BasPro" title="请选择非税收入项目" @select="getPro" />
    <!-- 集中汇缴 -->
    <jzhj ref="layer4" :agency-id="agency.guid || ''" @zjjh="zjjhFn" />

  </div>

</template>

<script>
import dwzsgl from '@/api/dwzsgl/dwzsgl.js'
import formatMoney from '@/utils/formatMoney.js'
import query from './query'
import layer from '@/components/layer'
import jzhj from './jzhj'
export default {
  components: {
    query,
    layer,
    jzhj
  },
  data() {
    return {
      // 选择票据
      AgencyBillStore: [],
      billHead: [
        {
          prop: 'billcode',
          label: '票据编码'
        },
        {
          prop: 'track',
          label: '字轨'
        },
        {
          prop: 'startnumber',
          label: '起始号码'
        },
        {
          prop: 'endnumber',
          label: '终止号码'
        },
        {
          prop: 'counts',
          label: '数量'
        }
      ],
      billForm: {
        coding: '',
        // 下拉框选项
        codingoption: [
        ],
        equal: ''
      },
      // 单位名称
      BasagencyList: [],
      tbHead: [
        {
          prop: 'agencycode',
          label: '指收单位编码',
          width: '120px'
        },
        {
          prop: 'agencyname',
          label: '执收单位名称',
          width: '200px'
        },
        {
          prop: 'pinyinshortcode',
          label: '拼音简码'
        },
        {
          prop: 'orgcode',
          label: '机构代码',
          width: '170px'
        },
        {
          prop: 'isleaf',
          label: '末级标志'
        }
      ],
      formBasagency: {
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
            val: '拼音简码',
            key: 'pinyinshortcode'
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
      },
      // 收款人全称
      BasRemittedbank: [],
      formyh: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '银行编码',
            key: 'bankcode'
          },
          {
            val: '银行名称',
            key: 'bankname'
          },
          {
            val: '收款人全称',
            key: 'chgagencyacctname'
          },
          {
            val: '收款人账号',
            key: 'chgagencybankaccount'
          },
          {
            val: '收款人开户行',
            key: 'chgagencybankname'
          }
        ],
        equal: ''
      },
      yhHead: [
        {
          prop: 'bankcode',
          label: '银行编码',
          width: '100px'
        },
        {
          prop: 'bankname',
          label: '银行名称',
          width: '200px'
        },
        {
          prop: 'chgagencyacctname',
          label: '收款人全称',
          width: '200px'
        },
        {
          prop: 'chgagencybankaccount',
          label: '收款人账号',
          width: '200px'
        },
        {
          prop: 'chgagencybankname',
          label: '收款人开户行',
          width: '200px'
        }
      ],
      // 交款人
      paybank: [],
      formpay: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '银行编码',
            key: 'bankcode'
          },
          {
            val: '银行名称',
            key: 'bankname'
          },
          {
            val: '收款人全称',
            key: 'name'
          },
          {
            val: '收款人账号',
            key: 'bankaccount'
          },
          {
            val: '收款人开户行',
            key: 'acctname'
          }
        ],
        equal: ''
      },
      payHead: [
        {
          prop: 'bankcode',
          label: '银行编码',
          width: '100px'
        },
        {
          prop: 'bankname',
          label: '银行名称',
          width: '200px'
        },
        {
          prop: 'name',
          label: '交款人全称',
          width: '200px'
        },
        {
          prop: 'bankaccount',
          label: '交款人账号',
          width: '200px'
        },
        {
          prop: 'acctname',
          label: '交款人开户名称',
          width: '200px'
        }
      ],
      // 项目
      BasPro: [],
      formxm: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '收费项目编码',
            key: 'nontaxcode'
          },
          {
            val: '收费项目名称',
            key: 'nontaxname'
          },
          {
            val: '收费计量单位',
            key: 'chargeunit'
          },
          {
            val: '收费标准上限',
            key: 'chargelimit'
          },
          {
            val: '收费标准下限',
            key: 'chargelower'
          },
          {
            val: '备注',
            key: 'remark'
          }
        ],
        equal: ''
      },
      xmHead: [
        {
          prop: 'nontaxcode',
          label: '收费项目编码',
          width: '170px'
        },
        {
          prop: 'nontaxname',
          label: '收费项目名称',
          width: '200px'
        },
        {
          prop: 'chargeunit',
          label: '收费计量单位',
          width: '170px'
        },
        {
          prop: 'chargelimit',
          label: '收费标准上限',
          width: '170px'
        },
        {
          prop: 'chargelower',
          label: '收费标准下限',
          width: '170px'
        }
      ],
      // 回单状态
      receipted: '01',
      // 审核状态
      audited: '01',
      // 作废状态
      cancelled: '01',
      // 收费标志
      charged: '0',
      // 查看行
      rowData: {},
      // 保存 内
      colTradeDetail: {
        'admdivcode': '',
        'amt': 0,
        'banksn': '',
        'billid': '',
        'createdate': null,
        'creator': '',
        'guid': null,
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
      // 执收单位编码 执收单位 组织机构代码
      agency: {},
      // 收款人 1，2，3
      bank: {},
      // 项目列表数组
      projectList: [],
      VerificationBillInfoList: [],
      // 保存数据
      colTrade: {
        'accredit': '0',
        'additional': '0',
        'admdivcode': '',
        'agencyid': '',
        'approved': '0',
        'auditdate': '',
        'audited': '0',
        'auditor': '',
        'bankid': '',
        'banksn': '',
        'billdate': null,
        'billid': '',
        'branchid': '',
        'busitype': '0000', // 新增的时候 busitype 固定为 0000
        'canceldate': null,
        'cancelled': '0',
        'canceller': '',
        'carrytype': '',
        'charged': '0',
        'chargedate': null,
        'collected': '0',
        'confirm': '0',
        'createdate': null,
        'creator': '',
        'derated': '0',
        'drawer': '',
        'guid': null,
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
        'receipted': '0',
        'receiptnumber': '',
        'regcanceldate': null,
        'regcancelled': '0',
        'regcanceller': '',
        'reliefapplyid': '',
        'remark': '',
        'safecode': '',
        'totamt': '', // 总金额totamt和
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
              // {
              //   'admdivcode': '',
              //   'amount': 0,
              //   'balancecount': 0,
              //   'bilVerificationCharges': {
              //     'bilVerificationCharge': [
              //       {
              //         'accounts': 0,
              //         'accountspay': 0,
              //         'admdivcode': '',
              //         'amount': 0,
              //         'bilBasChargeProjects': {
              //           'basChargeProject': [
              //             {
              //               'accountclsenumguid': '',
              //               'admdivcode': '',
              //               'allowquerymark': '',
              //               'billguid': '',
              //               'chargedocno': '',
              //               'chargelimit': 0,
              //               'chargelower': 0,
              //               'chargetypeguid': '',
              //               'chargeunit': '',
              //               'collectionmet': '',
              //               'createdate': '',
              //               'creator': '',
              //               'fundtypeguid': '',
              //               'guid': null,
              //               'incomesortguid': '',
              //               'internalcontactmark': '',
              //               'isenabled': '',
              //               'isleaf': '',
              //               'ispublicprogram': '',
              //               'levelnum': '',
              //               'modifier': '',
              //               'modifydate': '',
              //               'nid': '',
              //               'nontaxcode': '',
              //               'nontaxfallname': '',
              //               'nontaxname': '',
              //               'parentguid': '',
              //               'remark': '',
              //               'salestax': 0,
              //               'usedmark': '',
              //               'year': ''
              //             }
              //           ]
              //         },
              //         'createdate': '',
              //         'creator': '',
              //         'enddate': '',
              //         'guid': null,
              //         'inconvenient': 0,
              //         'modifier': '',
              //         'modifydate': '',
              //         'nontaxid': '',
              //         'operator': '',
              //         'receipNo': '',
              //         'remark': '',
              //         'startdate': '',
              //         'unpaidacc': 0,
              //         'verifdetailid': '',
              //         'year': ''
              //       }
              //     ]
              //   },
              //   'bilVerificationInvalids': {
              //     'bilVerificationInvalid': [
              //       {
              //         'admdivcode': '',
              //         'amount': 0,
              //         'billid': '',
              //         'counts': 0,
              //         'createdate': '',
              //         'creator': '',
              //         'endnumber': '',
              //         'guid': null,
              //         'modifier': '',
              //         'modifydate': '',
              //         'num': 0,
              //         'operator': '',
              //         'price': 0,
              //         'reason': '',
              //         'receipNo': '',
              //         'remark': '',
              //         'startnumber': '',
              //         'track': '',
              //         'veridetailid': '',
              //         'year': ''
              //       }
              //     ]
              //   },
              //   'billid': '',
              //   'copies': 0,
              //   'counts': 0,
              //   'createdate': '',
              //   'creator': '',
              //   'endnumber': '',
              //   'guid': null,
              //   'invalidnum': 0,
              //   'modifier': '',
              //   'modifydate': '',
              //   'num': 0,
              //   'operator': '',
              //   'price': 0,
              //   'printed': '',
              //   'receipNo': '',
              //   'remark': '',
              //   'startnumber': '',
              //   'totalverifnum': 0,
              //   'track': '',
              //   'verificationid': '',
              //   'year': ''
              // }
            ]
          },
          'billpermitid': '',
          'carrytype': '',
          'createdate': '',
          'creator': '',
          'delivered': '',
          'guid': null,
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
      }
    }
  },

  computed: {
    // 金额转换大写
    Arabia_To_Chinese() {
      return formatMoney.Arabia_To_Chinese(this.colTrade.totamt)
    },
    // // 数字加千分位
    getComma() {
      return formatMoney.getComma(this.colTrade.totamt)
    }
  },

  watch: {},

  created() {
    // 开票单位
    this.basChargeagencyfind()
    // billINFO
    this.billINFO()
    // 收款银行
    this.basRemittedbank()
  },
  methods: {
    // 集中缴汇修改监听
    zjjhFn(val) {
      console.log('val', val)
      this.colTrade.collected = '1'
      this.colTrade.bilVerification.bilVerificationDetails.bilVerificationDetail = val.tableData
      this.VerificationBillInfoList = val.VerificationBillInfoList
    },
    // 集中汇缴
    async remit() {
      // console.log(this.agency)
      if (this.agency.guid) {
        for (let i = 0; i < this.colTrade.bilVerification.bilVerificationDetails.bilVerificationDetail.length; i++) {
          this.colTrade.bilVerification.bilVerificationDetails.bilVerificationDetail[i].inventory = this.colTrade.bilVerification.bilVerificationDetails.bilVerificationDetail[i].num
          if (this.colTrade.bilVerification.bilVerificationDetails.bilVerificationDetail[i].checkmark && this.colTrade.bilVerification.bilVerificationDetails.bilVerificationDetail[i].codelength) {
            continue
          } else {
            await dwzsgl.detectCheckmark(this.colTrade.bilVerification.bilVerificationDetails.bilVerificationDetail[i]).then(res => {
              console.log('r', res)
              this.colTrade.bilVerification.bilVerificationDetails.bilVerificationDetail[i].checkmark = res.data.checkmark
              this.colTrade.bilVerification.bilVerificationDetails.bilVerificationDetail[i].codelength = res.data.codelength
              this.colTrade.bilVerification.bilVerificationDetails.bilVerificationDetail[i].portions = res.data.portions
            })
          }
        }
        this.$refs.layer4.dialogTableVisible = true
        console.log('123', this.colTrade.bilVerification.bilVerificationDetails.bilVerificationDetail)
        this.$refs.layer4.tableData = JSON.parse(JSON.stringify(this.colTrade.bilVerification.bilVerificationDetails.bilVerificationDetail))
        // this.$refs.layer4.tableData = data
        this.$refs.layer4.VerificationBillInfoList = JSON.parse(JSON.stringify(this.VerificationBillInfoList))
      }
    },
    // 集中汇缴删除
    remitdel() {
      this.$confirm('确定要删除集中汇缴的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.colTrade.collected = '0'
        this.colTrade.bilVerification.bilVerificationDetails.bilVerificationDetail = []
        this.VerificationBillInfoList = []
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    // 票号校验
    paybillnoChange() {
      var val = this.colTrade.paybillno
      // 针对直接用接口拿的票号
      if (this._startnumber == null) {
        // 加载单位库存
        this.findBillStoreAgencycheck(this.agency.guid, this.billinfo.guid).then(res => {
          console.log('ii', res)
          this.AgencyBillStore = res.data
          this.AgencyBillStore.forEach(obj => {
            if (obj.startnumber.length === val.length) {
              var int1 = parseInt(obj.startnumber.substr(0, obj.startnumber.length - obj.checkmark))
              var int2 = parseInt(obj.endnumber.substr(0, obj.startnumber.length - obj.checkmark))
              var intV = parseInt(val.substr(0, obj.startnumber.length - obj.checkmark))
              if (int1 <= intV && int2 >= intV) {
                this._startnumber = obj.startnumber
                this._endnumber = obj.endnumber
                this._checkmark = obj.checkmark
                this._codelength = obj.startnumber.length
              }
            }
          })
        })
        return
      }

      var intStart = parseInt(this._startnumber.substr(0, (this._codelength - this._checkmark)))
      var intEnd = parseInt(this._endnumber.substr(0, (this._codelength - this._checkmark)))
      // alert(intStart + '---' + intEnd)
      var intVal = parseInt(val.substr(0, (this._codelength - this._checkmark)))
      if (intStart > intVal || intEnd < intVal) {
        // alert('无库存')
        this.colTrade.paybillno = this._startnumber
      } else {
        // 补0
        while ((intVal + '').length < (this._codelength - this._checkmark)) {
          intVal = '0' + intVal
        }
        var newnum = intVal
        if (+this._checkmark === 1) {
          newnum = intVal + this.CalcMy_x(intVal)
        }
        this.colTrade.paybillno = newnum
      }
    },
    CalcMy_x(aStr) {
      var myx = ''
      var m_table = [1, 0, 0, 9, 8, 7, 6, 5, 4, 3, 2]
      var len
      var aMod, sum, Wi

      sum = 0
      len = aStr.length
      if (len > 0) {
        for (var i = 0; i < len; i++) {
          Wi = parseInt(Math.exp((len - (i + 1) + 1) * Math.log(2)) + 0.5, 10) % 11
          sum += Wi * parseInt(aStr.substr(i, 1), 10)
        }
        aMod = sum % 11
        if (+aMod === 2) {
          myx = 'X'
        } else {
          aMod = m_table[aMod]
          myx = aMod + ''
        }
      }
      return myx
    },
    // 开票单位
    basChargeagencyfind: dwzsgl.basChargeagencyfind,
    // 开票单位选择后查询
    getPayBillNo: dwzsgl.getPayBillNo,
    // billINFO
    billINFO: dwzsgl.billINFO,
    // 单位库存
    findBillStoreAgencycheck: dwzsgl.findBillStoreAgencycheck,
    // 收款银行
    basRemittedbank: dwzsgl.basRemittedbank,
    // 付款人
    sysContributors: dwzsgl.sysContributors,
    // 添加项目
    agency2Project: dwzsgl.agency2Project,
    // 保存
    saveColTrade: dwzsgl.saveColTrade,
    // 回单
    receipt() {
      dwzsgl.receipt(this.rowData.guid, 0).then(res => {
        this.$message({
          message: '回单成功',
          type: 'success'
        })
        this.receipted = '1'
      })
    },
    // 取消回单
    abolish() {
      dwzsgl.receipt(this.rowData.guid, 1).then(res => {
        this.$message({
          message: '取消回单成功',
          type: 'success'
        })
        this.receipted = '0'
      })
    },
    // 查询双击监听
    selectQuery(val) {
      this.rowData = val
      // val.receipted 0 1
      this.audited = val.audited
      this.cancelled = val.cancelled
      this.receipted = val.receipted
      this.charged = val.charged
      dwzsgl.billing(val.guid).then(res => {
        console.log('res', res.data)
        // 保存相关
        this.colTrade = res.data.colTrade
        // 执收单位编码 执收单位 组织机构代码
        this.agency = res.data.agency
        // 收款人 1，2，3
        this.bank = res.data.bank
        // 项目列表数组
        this.projectList = res.data.projectList
        this.VerificationBillInfoList = res.data.VerificationBillInfoList
      })
    },
    // 查询层
    query() {
      var time = new Date()
      if (this.$refs.query.$refs.singleTable) {
        this.$refs.query.$refs.singleTable.clearSort()
      }
      this.$refs.query.dialogTableVisible = true
      this.$refs.query.totalCount = 0
      this.$refs.query.payBillNo1 = ''
      this.$refs.query.payBillNo2 = ''
      this.$refs.query.payer1 = ''
      this.$refs.query.payer2 = ''
      this.$refs.query.tableData = []
      this.$refs.query.isdate1 = true
      this.$refs.query.isdate2 = true
      this.$refs.query.form = {
        agencyId: '', // 不传
        billEndDate: `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`,
        billStartDate: `${time.getFullYear()}-${time.getMonth() + 1}-1`,
        chargeEndDate: `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`,
        chargeStartDate: `${time.getFullYear()}-${time.getMonth() + 1}-1`,
        flag: 0,
        pageIndex: 1,
        pageSize: 10,
        payBillNo: '', // 23,21
        payer: '', // 21,12
        totamt: '', // 不传
        tradeType: 2// 1/2
      }
    },
    // 双击
    // 加载单位库存
    selectStoreAgency() {
      if (!this.agency.guid || !this.billinfo.guid) {
        this.AgencyBillStore = []
        this.$refs.layer1.dialogTableVisible = true
      } else {
        this.findBillStoreAgencycheck(this.agency.guid, this.billinfo.guid).then(res => {
          console.log(res)
          this.AgencyBillStore = res.data
          this.$refs.layer1.dialogTableVisible = true
        })
      }
    },
    // 选择库存
    getStore(datas) {
      this.colTrade.track = datas.currentRow.track
      this.colTrade.paybillno = datas.currentRow.startnumber

      this._startnumber = datas.currentRow.startnumber
      this._endnumber = datas.currentRow.endnumber
      this._checkmark = datas.currentRow.checkmark
      this._codelength = datas.currentRow.startnumber.length
    },
    // 获取选择名称
    getSelect(datas) {
      this.projectList = []
      this.colTrade.colTradeDetails.colTradeDetail = []
      this.agency = datas.currentRow
      this.colTrade.agencyid = datas.currentRow.guid
      this.colTrade.operagc = datas.currentRow.guid
      this.getPayBillNo(datas)

      this.colTrade.collected = '0'
      this.colTrade.bilVerification.bilVerificationDetails.bilVerificationDetail = []
      this.VerificationBillInfoList = []
    },
    // 双击
    // 票据名称对话框显示
    showBasagency() {
      this.$refs.layer.dialogTableVisible = true
    },
    // 双击收款人
    selectBank() {
      this.$refs.layer2.dialogTableVisible = true
    },
    // 双击交款人
    selectPay() {
      console.log(this.agency.guid)
      if (!this.agency.guid) {
      // if (this.agency.guid) {
        this.paybank = []
        this.$refs.layer0.dialogTableVisible = true
      } else {
        this.sysContributors(this.agency.guid).then(res => {
          console.log(res)
          this.paybank = res.data
          this.$refs.layer0.dialogTableVisible = true
        })
      }
    },
    // 选择交款人
    payBank(val) {
      console.log(val.currentRow)
      this.colTrade.payer = val.currentRow.name
      this.colTrade.payerbankacctno = val.currentRow.bankaccount
      this.colTrade.payeracctbank = val.currentRow.bankname
    },
    // 选择银行
    getBank(datas) {
      this.bank = datas.currentRow
      this.colTrade.bankid = this.bank.guid
    },
    // 添加项目
    addPro(index) {
      if (!this.agency.guid) {
        return
      }
      this.agency2Project(this.agency.guid).then(res => {
        console.log(res)
        this.LastEditProIndex = index
        this.BasPro = res.data
        this.$refs.layer3.dialogTableVisible = true
      })
    },
    // 删除项目
    delitem(index) {
      this.projectList.splice(index, 1)
      this.colTrade.colTradeDetails.colTradeDetail.splice(index, 1)
    },
    // 选择项目
    getPro(datas) {
      console.log('ll', this.projectList)
      // 重复添加
      if (this.projectList.length > 0) {
        console.log('1', datas.currentRow.guid)
        console.log('2', this.projectList)
        var bl = this.projectList.find(item => {
          console.log(item.guid)
          return item.guid === datas.currentRow.guid
        })
        console.log('bl', bl)
        console.log('dt', datas.currentRow.guid)
        if (bl) {
          this.$message.error('收费项目重复')
          return
        }
      }

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
    // 作废
    cancelTrade: dwzsgl.cancelTrade,
    cancel() {
      this.$confirm('是否确认作废?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cancelTrade(this.colTrade.guid, 0).then(res => {
          this.cancelled = '1'
          console.log(res)
          this.$message({
            type: 'success',
            message: '作废成功!'
          })
        })
      }).catch(() => {

        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      })
    },
    uncollection() {
      this.cancelTrade(this.colTrade.guid, 1).then(res => {
        this.cancelled = '0'
        console.log(res)
        this.$message({
          type: 'success',
          message: '取消作废成功!'
        })
      })
    },
    // 修改
    update() {
      this.audited = '01'
    },
    // 保存
    save() {
      for (var i = 0; i < this.colTrade.colTradeDetails.colTradeDetail.length; i++) {
        if (+this.colTrade.colTradeDetails.colTradeDetail[i].amt === 0) {
          this.$message.error('金额不能未零')
          return
        }
      }
      if (this.colTrade.collected === '0') {
        this.$message.error('请选择集中汇缴项目')
        return
      }
      // console.log('==', this.$store.getters.userInfo)
      // admdivcode
      // billid-
      // year
      this.colTrade.busitype = '0000'
      // 总金额
      this.colTrade.totamt = 0
      this.colTrade.colTradeDetails.colTradeDetail.forEach(val => {
        this.colTrade.totamt += Number(val.amt)
      })
      this.colTrade.admdivcode = this.$store.getters.userInfo.admdivcode
      this.colTrade.year = this.$store.getters.userInfo.year
      console.log('this.colTrade', JSON.stringify(this.colTrade))
      this.saveColTrade(this.colTrade).then(res => {
        // console.log('res', res.data)
        // // 保存相关
        // this.colTrade = res.data.colTrade
        // // 执收单位编码 执收单位 组织机构代码
        // this.agency = res.data.agency
        // // 收款人 1，2，3
        // this.bank = res.data.bank
        // // 项目列表数组
        // this.projectList = res.data.projectList
        // this.VerificationBillInfoList = res.data.VerificationBillInfoList
        this.audited = res.data.audited
        this.cancelled = res.data.cancelled
        // this.receipted = res.data.receipted
        this.colTrade = res.data
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      })
    },
    // 关闭返回首页
    close() {
      this.$router.push('/')
      this.$message({
        showClose: true,
        message: '回到首页',
        type: 'success'
      })
    },
    // 删除
    del() {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(this.colTrade.guid)
        dwzsgl.deleteColTrade(this.colTrade.guid).then(res => {
          this.clear()
          console.log(res)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    // 审核反审
    audit: dwzsgl.audit,
    // 审核
    billAudit() {
      this.audit(this.colTrade.guid, 0).then(res => {
        this.audited = '1'
        this.$message({
          message: '审核成功',
          type: 'success'
        })
        console.log('sh', res)
      })
    },
    // 反审核
    billUnaudit() {
      this.audit(this.colTrade.guid, 1).then(res => {
        this.audited = '0'
        this.$message({
          message: '反审成功',
          type: 'success'
        })
        console.log('fsh', res)
      })
    },
    // 添加 取消
    clear() {
      this.audited = '01'
      this.cancelled = '01'
      this.receipted = '01'
      this.charged = '0'
      this.colTradeDetail = {
        'admdivcode': '',
        'amt': 0,
        'banksn': '',
        'billid': '',
        'createdate': null,
        'creator': '',
        'guid': null,
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
      }
      this.agency = {}
      this.bank = {}
      this.projectList = []
      this.VerificationBillInfoList = []
      this.colTrade = {
        'accredit': '0',
        'additional': '0',
        'admdivcode': '',
        'agencyid': '',
        'approved': '0',
        'auditdate': '',
        'audited': '0',
        'auditor': '',
        'bankid': '',
        'banksn': '',
        'billdate': null,
        'billid': '',
        'branchid': '',
        'busitype': '0000', // 新增的时候 busitype 固定为 0000
        'canceldate': null,
        'cancelled': '0',
        'canceller': '',
        'carrytype': '',
        'charged': '0',
        'chargedate': null,
        'collected': '0',
        'confirm': '0',
        'createdate': null,
        'creator': '',
        'derated': '0',
        'drawer': '',
        'guid': null,
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
        'receipted': '0',
        'receiptnumber': '',
        'regcanceldate': null,
        'regcancelled': '0',
        'regcanceller': '',
        'reliefapplyid': '',
        'remark': '',
        'safecode': '',
        'totamt': '', // 总金额totamt和
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
              // {
              //   'admdivcode': '',
              //   'amount': 0,
              //   'balancecount': 0,
              //   'bilVerificationCharges': {
              //     'bilVerificationCharge': [
              //       {
              //         'accounts': 0,
              //         'accountspay': 0,
              //         'admdivcode': '',
              //         'amount': 0,
              //         'bilBasChargeProjects': {
              //           'basChargeProject': [
              //             {
              //               'accountclsenumguid': '',
              //               'admdivcode': '',
              //               'allowquerymark': '',
              //               'billguid': '',
              //               'chargedocno': '',
              //               'chargelimit': 0,
              //               'chargelower': 0,
              //               'chargetypeguid': '',
              //               'chargeunit': '',
              //               'collectionmet': '',
              //               'createdate': '',
              //               'creator': '',
              //               'fundtypeguid': '',
              //               'guid': null,
              //               'incomesortguid': '',
              //               'internalcontactmark': '',
              //               'isenabled': '',
              //               'isleaf': '',
              //               'ispublicprogram': '',
              //               'levelnum': '',
              //               'modifier': '',
              //               'modifydate': '',
              //               'nid': '',
              //               'nontaxcode': '',
              //               'nontaxfallname': '',
              //               'nontaxname': '',
              //               'parentguid': '',
              //               'remark': '',
              //               'salestax': 0,
              //               'usedmark': '',
              //               'year': ''
              //             }
              //           ]
              //         },
              //         'createdate': '',
              //         'creator': '',
              //         'enddate': '',
              //         'guid': null,
              //         'inconvenient': 0,
              //         'modifier': '',
              //         'modifydate': '',
              //         'nontaxid': '',
              //         'operator': '',
              //         'receipNo': '',
              //         'remark': '',
              //         'startdate': '',
              //         'unpaidacc': 0,
              //         'verifdetailid': '',
              //         'year': ''
              //       }
              //     ]
              //   },
              //   'bilVerificationInvalids': {
              //     'bilVerificationInvalid': [
              //       {
              //         'admdivcode': '',
              //         'amount': 0,
              //         'billid': '',
              //         'counts': 0,
              //         'createdate': '',
              //         'creator': '',
              //         'endnumber': '',
              //         'guid': null,
              //         'modifier': '',
              //         'modifydate': '',
              //         'num': 0,
              //         'operator': '',
              //         'price': 0,
              //         'reason': '',
              //         'receipNo': '',
              //         'remark': '',
              //         'startnumber': '',
              //         'track': '',
              //         'veridetailid': '',
              //         'year': ''
              //       }
              //     ]
              //   },
              //   'billid': '',
              //   'copies': 0,
              //   'counts': 0,
              //   'createdate': '',
              //   'creator': '',
              //   'endnumber': '',
              //   'guid': null,
              //   'invalidnum': 0,
              //   'modifier': '',
              //   'modifydate': '',
              //   'num': 0,
              //   'operator': '',
              //   'price': 0,
              //   'printed': '',
              //   'receipNo': '',
              //   'remark': '',
              //   'startnumber': '',
              //   'totalverifnum': 0,
              //   'track': '',
              //   'verificationid': '',
              //   'year': ''
              // }
            ]
          },
          'billpermitid': '',
          'carrytype': '',
          'createdate': '',
          'creator': '',
          'delivered': '',
          'guid': null,
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
      }
      this.billINFO()
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
    .bill{
      width: 800px;
      height: 400px;
      background: url("../../../assets/bill/jks.jpg");
      position: relative;
      input[type='text'],textarea{
        background: transparent;
        box-sizing: border-box;
        border: 1px solid #9bbce8;
        text-indent: 2px;
      }
      input[disabled],
      textarea[disabled]{
        border: none;
      }
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
          left: 70px;
          // width: 70px;
          .add{
            width: 73px;
            height: 24px;
            background: #409eff;
            color: #fff;
            border-radius: 4px;
          }
          .add:hover{
            cursor: pointer;
            background: #66b1ff;
            border-color: #66b1ff;
            color: #fff;
          }
          .del{
            font-size: 12px;
            width: 20px;
            line-height: 20px;
            height: 20px;
            background: #f56c6c;
            color: #fff;
            border-radius: 50%;
          }
          .del:hover{
            cursor: pointer;
            background: #f78989;
            border-color: #f78989;
            color: #fff;
          }
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

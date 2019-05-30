<!-- 测试页面，不用登陆。 -->
<template>
  <el-dialog :visible.sync="dialogTableVisible" class="print-set" title="打印设置" width="100%">
    <div>我是断网之后的测试页面。</div>
    <button @click="tablePrintPreview">打印预览</button>
    <p>----------------------div1:------------------------------------------------------------------------------------</p>
    <div class="print-head-wrap">
      <div id="div1">
        <p style="font-size:26px;font-weight:500;margin:0;padding:0;text-align:center">打印标题</p>
        <ul class="print-head" style="display: flex;justify-content: flex-start;flex-flow: wrap row;list-style:none;">
          <li v-for="(item,i) in checkedPrintHead" :key="i" class="print-item" style="flex:0 0 33.3%;display:flex;justify-content:space-around">
            <span style="flex:0 0 40%">{{ item.text }}：</span>
            <span class="hidden" style="flex:1 1 60%">{{ item.value }}</span>
          </li>
        </ul>
      </div>
      <div class="print-head-control">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"/>
        <el-checkbox-group v-model="checkedTexts" class="check-list" @change="handleCheckedCitiesChange">
          <el-checkbox v-dragging="{item:item,list:printHead,group:'printHead'}" v-for="(item,i) in printHead" :key="i" :label="item.text" class="check-item" >{{ item.text }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>

    <p>----------------------div2:------------------------------------------------------------------------------------</p>
    <div id="div2">
      <table style="border-width: 1px;border-style: solid;border-collapse: collapse">
        <thead>
          <tr>
            <th v-dragging="{item:item,list:tableHead,group:'tbHead'}" v-for="(item,i) in tableHead" :key="i" style="border-width: 1px;border-style: solid;border-collapse: collapse">{{ item.label }}</th>
          </tr>
        </thead>
        <tbody class="none">
          <tr v-for="(rowData,i) in data" :key="i">
            <td v-for="(item ,index) in tableHead" :key="index" style="border-width: 1px;border-style: solid;border-collapse: collapse">
              {{ rowData[item.prop] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>----------------------div3:------------------------------------------------------------------------------------</p>
    <div id="div3">
      <div class="print-foot">
        <div v-for="(item,i) in printHead" :key="i" class="print-item">
          {{ item }}
        </div>
      </div>
    </div>
  </el-dialog>

</template>

<script>
import { getLodop } from '@/assets/LodopFuncsNew' // 导入模块
// const cityOptions = ['上海', '北京', '广州', '深圳']
export default {
  components: {},
  data() {
    return {
      // checkAll: false,
      // checkedCities: ['上海', '广州'],
      // // cities: cityOptions,
      // isIndeterminate: true,
      checkedTexts: [],
      // checkAll: false,
      // isIndeterminate: false,
      LODOP: '', // 准备用来调用getLodop获取LODOP对象
      tableHead: [
        { label: '收费类别编码', prop: 'chargetypecode', width: 180 },
        { label: '收费类别名称', prop: 'chargetypename', width: 180 },
        { label: '备注', prop: 'remark' }
      ],
      printHead: [
        { text: '年份', key: 'year', value: '2019', checked: false },
        { text: '制单人', key: 'producter', value: '王某某', checked: true },
        { text: '区划', key: 'adiv', value: '沙洋', checked: true },
        { text: '审核人', key: 'auditer', value: '李某某adasdasd瓦达', checked: true },
        { text: '操作人', key: 'operator', value: '周某某', checked: true },
        { text: '编号', key: 'code', value: '20195417', checked: false },
        { text: '用户名', key: 'uname', value: '不锈钢玻璃123123123213123心4654687', checked: true }
      ],
      // printHead: ['上海', '北京', '广州', '深圳'],
      dialogTableVisible: false,
      data: [
        {
          guid: '402880d5432360820143239b681f0116',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '020520',
          chargetypename: '专项捐款',
          parentguid: '402880d5432360820143239b418300ee',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '020520',
          foreignname: '专项捐款',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:03',
          modifier: null,
          modifydate: '2013-12-24 03:57:03'
        },
        {
          guid: '402880d5432360820143239b69f30118',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '0206',
          chargetypename: '往来专项资金',
          parentguid: '402880d5432360820143239b1be200c6',
          remarks: null,
          levelnum: '2',
          isleaf: '0',
          foreigncode: '0206',
          foreignname: '往来专项资金',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:04',
          modifier: null,
          modifydate: '2013-12-24 03:57:04'
        },
        {
          guid: '402880d5432360820143239b6c16011a',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '020601',
          chargetypename: '房管局专项资金',
          parentguid: '402880d5432360820143239b69f30118',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '020601',
          foreignname: '房管局专项资金',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:04',
          modifier: null,
          modifydate: '2013-12-24 03:57:04'
        },
        {
          guid: '402880d5432360820143239b6dfa011c',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '020602',
          chargetypename: '住宅小区物业维修金东',
          parentguid: '402880d5432360820143239b69f30118',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '020602',
          foreignname: '住宅小区物业维修金东',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:05',
          modifier: null,
          modifydate: '2013-12-24 03:57:05'
        },
        {
          guid: '402880d5432360820143239b6ffd011e',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '020603',
          chargetypename: '住房中心专项资金',
          parentguid: '402880d5432360820143239b69f30118',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '020603',
          foreignname: '住房中心专项资金',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:05',
          modifier: null,
          modifydate: '2013-12-24 03:57:05'
        },
        {
          guid: '402880d5432360820143239b722f0120',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '020604',
          chargetypename: '房改办专项资金',
          parentguid: '402880d5432360820143239b69f30118',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '020604',
          foreignname: '房改办专项资金',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:06',
          modifier: null,
          modifydate: '2013-12-24 03:57:06'
        },
        {
          guid: '402880d5432360820143239b74040122',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '020605',
          chargetypename: '白蚁防治后备基金',
          parentguid: '402880d5432360820143239b69f30118',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '020605',
          foreignname: '白蚁防治后备基金',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:06',
          modifier: null,
          modifydate: '2013-12-24 03:57:06'
        },
        {
          guid: '402880d5432360820143239b75e80124',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '020606',
          chargetypename: '技能培训帮扶资金',
          parentguid: '402880d5432360820143239b69f30118',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '020606',
          foreignname: '技能培训帮扶资金',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:07',
          modifier: null,
          modifydate: '2013-12-24 03:57:07'
        },
        {
          guid: '402880d5432360820143239b77ad0126',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '020607',
          chargetypename: '教育奖励基金',
          parentguid: '402880d5432360820143239b69f30118',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '020607',
          foreignname: '教育奖励基金',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:07',
          modifier: null,
          modifydate: '2013-12-24 03:57:07'
        },
        {
          guid: '402880d5432360820143239b79810128',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '020608',
          chargetypename: '应缴代收上级财政专户',
          parentguid: '402880d5432360820143239b69f30118',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '020608',
          foreignname: '应缴代收上级财政专户',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:08',
          modifier: null,
          modifydate: '2013-12-24 03:57:08'
        },
        {
          guid: '402880d5432360820143239b7b94012a',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '020609',
          chargetypename: '住宅小区物业维修基金',
          parentguid: '402880d5432360820143239b69f30118',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '020609',
          foreignname: '住宅小区物业维修基金',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:08',
          modifier: null,
          modifydate: '2013-12-24 03:57:08'
        },
        {
          guid: '402880d5432360820143239b64470112',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '020518',
          chargetypename: '矿山地质环境恢复治理备用金',
          parentguid: '402880d5432360820143239b418300ee',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '020518',
          foreignname: '矿山地质环境恢复治理备用金',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:02',
          modifier: null,
          modifydate: '2013-12-24 03:57:02'
        },
        {
          guid: '402880d5432360820143239b667a0114',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '020519',
          chargetypename: '网银待结算资金',
          parentguid: '402880d5432360820143239b418300ee',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '020519',
          foreignname: '网银待结算资金',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:03',
          modifier: null,
          modifydate: '2013-12-24 03:57:03'
        },
        {
          guid: '402880d5432360820143239b7d2a012c',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '020610',
          chargetypename: '房改资金',
          parentguid: '402880d5432360820143239b69f30118',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '020610',
          foreignname: '房改资金',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:09',
          modifier: null,
          modifydate: '2013-12-24 03:57:09'
        },
        {
          guid: '402880d5432360820143239b7edf012e',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '0207',
          chargetypename: '异地代收罚款',
          parentguid: '402880d5432360820143239b1be200c6',
          remarks: null,
          levelnum: '2',
          isleaf: '0',
          foreigncode: '0207',
          foreignname: '异地代收罚款',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:09',
          modifier: null,
          modifydate: '2013-12-24 03:57:09'
        },
        {
          guid: '402880d5432360820143239b844c0134',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '0301',
          chargetypename: '代收上级分成收入',
          parentguid: '402880d5432360820143239b82970132',
          remarks: null,
          levelnum: '2',
          isleaf: '0',
          foreigncode: '0301',
          foreignname: '代收上级分成收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:11',
          modifier: null,
          modifydate: '2013-12-24 03:57:11'
        },
        {
          guid: '402880d5432360820143239b86310136',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '030101',
          chargetypename: '办证费分成收入',
          parentguid: '402880d5432360820143239b844c0134',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '030101',
          foreignname: '办证费分成收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:11',
          modifier: null,
          modifydate: '2013-12-24 03:57:11'
        },
        {
          guid: '402880d5432360820143239b87f50138',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '030102',
          chargetypename: '联合办班分成收入',
          parentguid: '402880d5432360820143239b844c0134',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '030102',
          foreignname: '联合办班分成收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:12',
          modifier: null,
          modifydate: '2013-12-24 03:57:12'
        },
        {
          guid: '402880d5432360820143239b899b013a',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '030103',
          chargetypename: '计算机考试分成收入',
          parentguid: '402880d5432360820143239b844c0134',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '030103',
          foreignname: '计算机考试分成收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:12',
          modifier: null,
          modifydate: '2013-12-24 03:57:12'
        },
        {
          guid: '402880d5432360820143239b8b50013c',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '030104',
          chargetypename: '专业技术评审费分成收',
          parentguid: '402880d5432360820143239b844c0134',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '030104',
          foreignname: '专业技术评审费分成收',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:12',
          modifier: null,
          modifydate: '2013-12-24 03:57:12'
        },
        {
          guid: '402880d5432360820143239b8d15013e',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '030105',
          chargetypename: '司法考试费分成收入',
          parentguid: '402880d5432360820143239b844c0134',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '030105',
          foreignname: '司法考试费分成收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:13',
          modifier: null,
          modifydate: '2013-12-24 03:57:13'
        },
        {
          guid: '402880d5432360820143239b8eea0140',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '030106',
          chargetypename: '产权登记费分成收入',
          parentguid: '402880d5432360820143239b844c0134',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '030106',
          foreignname: '产权登记费分成收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:13',
          modifier: null,
          modifydate: '2013-12-24 03:57:13'
        },
        {
          guid: '402880d5432360820143239b90cd0142',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '030107',
          chargetypename: '森林植被恢复分成收入',
          parentguid: '402880d5432360820143239b844c0134',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '030107',
          foreignname: '森林植被恢复分成收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:14',
          modifier: null,
          modifydate: '2013-12-24 03:57:14'
        },
        {
          guid: '402880d5432360820143239b92830144',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '030108',
          chargetypename: '执业(执业)考试分成收',
          parentguid: '402880d5432360820143239b844c0134',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '030108',
          foreignname: '执业(执业)考试分成收',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:14',
          modifier: null,
          modifydate: '2013-12-24 03:57:14'
        },
        {
          guid: '402880d5432360820143239b94570146',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '030109',
          chargetypename: '教育考试费分成收入',
          parentguid: '402880d5432360820143239b844c0134',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '030109',
          foreignname: '教育考试费分成收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:15',
          modifier: null,
          modifydate: '2013-12-24 03:57:15'
        },
        {
          guid: '402880d5432360820143239b960c0148',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '030110',
          chargetypename: '代收渔民捕捞费',
          parentguid: '402880d5432360820143239b844c0134',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '030110',
          foreignname: '代收渔民捕捞费',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:15',
          modifier: null,
          modifydate: '2013-12-24 03:57:15'
        },
        {
          guid: '402880d5432360820143239b97e1014a',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '030111',
          chargetypename: '执业兽医资格考试分成收入',
          parentguid: '402880d5432360820143239b844c0134',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '030111',
          foreignname: '执业兽医资格考试分成收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:16',
          modifier: null,
          modifydate: '2013-12-24 03:57:16'
        },
        {
          guid: '402880d5432360820143239b99a5014c',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '0302',
          chargetypename: '代收下级分成收入',
          parentguid: '402880d5432360820143239b82970132',
          remarks: null,
          levelnum: '2',
          isleaf: '0',
          foreigncode: '0302',
          foreignname: '代收下级分成收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:16',
          modifier: null,
          modifydate: '2013-12-24 03:57:16'
        },
        {
          guid: '402880d5432360820143239b9bf7014e',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '030201',
          chargetypename: '交警规费分成收入',
          parentguid: '402880d5432360820143239b99a5014c',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '030201',
          foreignname: '交警规费分成收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:17',
          modifier: null,
          modifydate: '2013-12-24 03:57:17'
        },
        {
          guid: '402880d5432360820143239b9dbb0150',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '030202',
          chargetypename: '代收分包监测费收入',
          parentguid: '402880d5432360820143239b99a5014c',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '030202',
          foreignname: '代收分包监测费收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:17',
          modifier: null,
          modifydate: '2013-12-24 03:57:17'
        },
        {
          guid: '402880d5432360820143239b9f8f0152',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '030203',
          chargetypename: '联合办案收入',
          parentguid: '402880d5432360820143239b99a5014c',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '030203',
          foreignname: '联合办案收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:18',
          modifier: null,
          modifydate: '2013-12-24 03:57:18'
        },
        {
          guid: '402880d5432360820143239b80c30130',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '020701',
          chargetypename: '异地代收罚没款',
          parentguid: '402880d5432360820143239b7edf012e',
          remarks: null,
          levelnum: '3',
          isleaf: '1',
          foreigncode: '020701',
          foreignname: '异地代收罚没款',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:10',
          modifier: null,
          modifydate: '2013-12-24 03:57:10'
        },
        {
          guid: '402880d5432360820143239b82970132',
          year: '2014',
          admdivcode: '420501',
          chargetypecode: '03',
          chargetypename: '代收上下级分成收入',
          parentguid: '-1',
          remarks: null,
          levelnum: '1',
          isleaf: '0',
          foreigncode: '03',
          foreignname: '代收上下级分成收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:57:10',
          modifier: null,
          modifydate: '2013-12-24 03:57:10'
        },
        {
          guid: '3C4972DF7E7E53773DAFA6C1E9035F00',
          year: '2015',
          admdivcode: '420501',
          chargetypecode: '01',
          chargetypename: '非税收入',
          parentguid: '-1',
          remarks: null,
          levelnum: '1',
          isleaf: '0',
          foreigncode: '01',
          foreignname: '非税收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:56:39',
          modifier: null,
          modifydate: '2013-12-24 03:56:39'
        },
        {
          guid: '17DA6BA02C8D2E51B3D3D4ED904E957E',
          year: '2015',
          admdivcode: '420501',
          chargetypecode: '0101',
          chargetypename: '政府性基金收入',
          parentguid: '3C4972DF7E7E53773DAFA6C1E9035F00',
          remarks: null,
          levelnum: '2',
          isleaf: '1',
          foreigncode: '0101',
          foreignname: '政府性基金收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:56:40',
          modifier: null,
          modifydate: '2013-12-24 03:56:40'
        },
        {
          guid: '04C6DAB981978C5D1876A5A2906D9F8F',
          year: '2015',
          admdivcode: '420501',
          chargetypecode: '0102',
          chargetypename: '专项收入',
          parentguid: '3C4972DF7E7E53773DAFA6C1E9035F00',
          remarks: null,
          levelnum: '2',
          isleaf: '1',
          foreigncode: '0102',
          foreignname: '专项收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:56:41',
          modifier: null,
          modifydate: '2013-12-24 03:56:41'
        },
        {
          guid: 'BB1561D71B48A3B506584E4F297C8B1C',
          year: '2015',
          admdivcode: '420501',
          chargetypecode: '0103',
          chargetypename: '彩票基金收入',
          parentguid: '3C4972DF7E7E53773DAFA6C1E9035F00',
          remarks: null,
          levelnum: '2',
          isleaf: '1',
          foreigncode: '0103',
          foreignname: '彩票基金收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:56:41',
          modifier: null,
          modifydate: '2013-12-24 03:56:41'
        },
        {
          guid: '7CC43738D1031932BDEA0C78E12C248D',
          year: '2015',
          admdivcode: '420501',
          chargetypecode: '0104',
          chargetypename: '行政事业性收费',
          parentguid: '3C4972DF7E7E53773DAFA6C1E9035F00',
          remarks: null,
          levelnum: '2',
          isleaf: '1',
          foreigncode: '0104',
          foreignname: '行政事业性收费',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:56:41',
          modifier: null,
          modifydate: '2013-12-24 03:56:41'
        },
        {
          guid: 'A58AAAA86CF5B6A7694CB1DE8ED41FC4',
          year: '2015',
          admdivcode: '420501',
          chargetypecode: '0105',
          chargetypename: '罚没收入',
          parentguid: '3C4972DF7E7E53773DAFA6C1E9035F00',
          remarks: null,
          levelnum: '2',
          isleaf: '1',
          foreigncode: '0105',
          foreignname: '罚没收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:56:42',
          modifier: null,
          modifydate: '2013-12-24 03:56:42'
        },
        {
          guid: '7F38FE18CEF8292F1132A71207A8772D',
          year: '2015',
          admdivcode: '420501',
          chargetypecode: '0106',
          chargetypename: '资本经营收入',
          parentguid: '3C4972DF7E7E53773DAFA6C1E9035F00',
          remarks: null,
          levelnum: '2',
          isleaf: '1',
          foreigncode: '0106',
          foreignname: '资本经营收入',
          remark: null,
          isenabled: 1,
          creator: '财政用户',
          createdate: '2013-12-24 03:56:43',
          modifier: null,
          modifydate: '2013-12-24 03:56:43'
        }
      ]
    }
  },

  computed: {
  },

  watch: {
  },
  created() {
    this.checkedTexts = this.printHead.filter(item => item.checked === true).map(item => item.text)
    // 下面的写法数组中存在undefined数据。
    // this.checkedTexts = this.printHead.map(item => item.checked === true ? item.text : undefined)
    console.log('测试页面数据准备好了')
  },
  mounted() {
    console.log('测试页面dom渲染完毕。')
  },
  methods: {
    // handleCheckAllChange(val) {
    //   this.checkedCities = val ? this.printHead : []
    //   this.isIndeterminate = false
    // },
    // handleCheckedCitiesChange(value) {
    //   const checkedCount = value.length
    //   this.checkAll = checkedCount === this.printHead.length
    //   this.isIndeterminate = checkedCount > 0 && checkedCount < this.printHead.length
    // },
    handleCheckAllChange(val) {
      if (val) {
        // var textArray = []
        this.checkedTexts = this.printHead.map(item => item.text)
        this.printHead.forEach(item => { item.checked = true })
      } else {
        this.checkedTexts = []
        this.printHead.forEach(item => { item.checked = false })
      }
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      console.log('点击时，value是', value)
      this.printHead.forEach(item => {
        if (value.includes(item.text)) {
          item.checked = true
        } else {
          item.checked = false
        }
      })
      const checkedCount = value.length
      this.checkAll = checkedCount === this.printHead.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.printHead.length
    },

    tablePrintPreview() {
      this.LODOP = getLodop()
      this.LODOP.PRINT_INIT('表格预览')
      var strStyle = '<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>'
      // 设置打印表格。
      this.LODOP.ADD_PRINT_TABLE('20%', '5%', '90%', '70%', strStyle + document.getElementById('div2').innerHTML)
      this.LODOP.SET_PRINT_STYLEA(0, 'Vorient', 3)
      this.LODOP.SET_PRINT_STYLEA(0, 'Offset2Top', '-13%')
      // 设置打印头部。
      this.LODOP.ADD_PRINT_HTM('1%', '5%', '90%', '20%', document.getElementById('div1').innerHTML)
      // this.LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1) // 此行代码的作用是使得div1中的内容随着分页反复出现，相当于是页眉。
      this.LODOP.ADD_PRINT_HTM('2%', '5%', '90%', '10%', document.getElementById('div3').innerHTML)
      this.LODOP.SET_PRINT_STYLEA(0, 'LinkedItem', 1) // 内容项与别人关联后，会紧跟被关联者之后打印，位置和区域大小随被关联项而定，此时其Top和left不再是上边距和左边距，而是与关联项的间隔空隙及左边距偏移。0表示自己，1表示第一个，-1表示自己的前一个。
      this.LODOP.PREVIEW()
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.hidden{
  visibility: hidden;
}
.none{
  display: none;
}
.print-head-wrap{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  #div1{
    flex:0 0 60%
  }
  .print-head-control{
    flex:none
  }
  .el-checkbox+.el-checkbox{
    margin-left: 0
  }
  .check-list{
    display: flex;
    flex-direction: column;
    align-items:flex-start;
    .check-item{
    }
  }
}

</style>

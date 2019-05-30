<template>
  <div>
    <el-dialog :visible.sync="dialogTableVisible" :title="title" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="returnDefault" width="90%">
      <toolBar :client-butns-array="clientButnsArray" />
      <!-- 筛选表单 -->
      <h1 class="title">{{ title }}</h1>
      <el-form ref="form" :disabled="toolBarState!==1" :model="form" size="mini" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="业务日期">
              <el-date-picker v-model="form.requestdate" type="date" placeholder="选择日期" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编码">
              <el-input v-model="form.receipno" disabled clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="操作人">
              <el-input v-model="form.operator" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="40px">
              <div class="record-print-btn" @click="openRecordPrint">票据领销记录打印</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="销票单位">
              <el-input v-model="agencyname" clearable placeholder="请输入销票单位">
                <el-button slot="append" icon="el-icon-caret-bottom" @click="showStorage()" />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="经手人">
              <el-input v-model="form.attn" clearable/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col v-if="toolBarState===1" :span="3">
            <el-button size="mini" type="danger" @click="deleteSelected()">删除所选</el-button>
          </el-col>
          <el-col :span="5">
            <el-form-item label="制单人">
              <el-input v-model="form.operator" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="送审人">
              <el-input v-model="form.delivered" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="审核人">
              <el-input v-model="form.reviewer" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="经手人">
              <el-input v-model="form.attn" clearable/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <!-- 显示表格 -->
      <div class="wrap-add">
        <!-- 表1 -->
        <el-scrollbar class="wrap" style="height:50%;width:100%;">
          <el-table :data="tableData.concat({})" show-summary highlight-current-row border style="width: 100%" @selection-change="handleSelectionChange" @current-change="handleCurrentChange" @cell-dblclick="cell" @row-click="handleCurrentChangedetailsIndex" @row-dblclick="elect">
            <el-table-column type="selection" width="60" />
            <el-table-column width="90" show-overflow-tooltip sortable type="index">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-button v-if="Object.keys(scope.row).length !==0" size="mini" type="primary" plain @click="addModification(scope.$index, scope.row)">{{ scope.$index + 1 }} 修改</el-button>
                  <el-button v-else size="mini" type="primary" @click="addModification(scope.$index, scope.row)">添加</el-button>
                </div>
                <p v-else>{{ scope.$index + 1 }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="billcode" width="100" show-overflow-tooltip sortable label="票据编码" />
            <el-table-column prop="billname" width="200" show-overflow-tooltip sortable label="票据名称">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.billname" size="mini" />
                </div>
                <p v-else>{{ scope.row.billname }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="track" width="80" show-overflow-tooltip sortable label="字轨">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.track" size="mini" />
                </div>
                <p v-else>{{ scope.row.track }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="startnumber" align="center" width="150" show-overflow-tooltip sortable label="起始号码">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-changeStartNumberByNum="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.startnumber" size="mini" />
                </div>
                <p v-else>{{ scope.row.startnumber }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="endnumber" align="center" width="150" show-overflow-tooltip sortable label="终止号码">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-changeEndNumberByNum="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.endnumber" size="mini" />
                </div>
                <p v-else>{{ scope.row.endnumber }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="num" align="center" width="120" show-overflow-tooltip sortable label="份数">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-changeInventoryByNum="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.num" size="mini" />
                </div>
                <p v-else>{{ scope.row.num }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="counts" align="center" width="120" show-overflow-tooltip sortable label="本数">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-changeCountsByNum="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.counts" size="mini" />
                </div>
                <p v-else>{{ scope.row.counts }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="price" align="center" width="120" show-overflow-tooltip sortable label="单价">
              <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-change-price="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.price" size="mini" />
                </div>
                <p v-else>{{ scope.row.price }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="amount" align="center" width="120" show-overflow-tooltip sortable label="金额">
              <!-- <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.amount" size="mini"/>
                </div>
                <p v-else>{{ scope.row.amount }}</p>
              </template> -->
            </el-table-column>
            <el-table-column :formatter="$tableCodeToLabel" prop="pricingmet" align="center" width="120" show-overflow-tooltip sortable label="计价方式">
              <!-- <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.pricingmet" size="mini"/>
                </div>
                <p v-else>{{ scope.row.pricingmet }}</p>
              </template> -->
            </el-table-column>
            <el-table-column :formatter="$tableCodeToLabel" prop="portions" align="center" width="120" show-overflow-tooltip sortable label="每本份数">
              <!-- <template slot-scope="scope">
                <div v-if="toolBarState===1">
                  <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.portions" size="mini"/>
                </div>
                <p v-else>{{ scope.row.portions }}</p>
              </template> -->
            </el-table-column>
            <el-table-column prop="invalidnum" align="center" width="120" show-overflow-tooltip sortable label="累计核销份数" />
            <el-table-column prop="totalverifnum" align="center" width="120" show-overflow-tooltip sortable label="作废份数" />
            <el-table-column prop="copies" align="center" width="120" show-overflow-tooltip sortable label="结存份数" />
            <el-table-column prop="balancecount" align="center" width="120" show-overflow-tooltip sortable label="结存本数" />
          </el-table>
        </el-scrollbar>
        <!-- 表2 表3 -->
        <div style="height:50%;width:100%;display:flex;">
          <el-scrollbar class="wrap" style="height:100%;width:60%;">
            <el-table :data="tableDataTable2.concat({})" show-summary highlight-current-row border style="width: 100%" @selection-change="handleSelectionChange2" @current-change="handleCurrentChangeTable2" @cell-dblclick="cell" @row-dblclick="elect">
              <el-table-column type="selection" width="60" />
              <el-table-column width="90" align="center" show-overflow-tooltip sortable type="index">
                <template slot-scope="scope">
                  <div v-if="toolBarState===1">
                    <el-button v-if="Object.keys(scope.row).length !==0" size="mini" plain type="primary" @click="addModificationTable2(scope.$index, scope.row)">{{ scope.$index + 1 }}修改</el-button>
                    <el-button v-else size="mini" type="primary" @click="addModificationTable2(scope.$index, scope.row)">添加</el-button>
                  </div>
                  <p v-else>{{ scope.$index + 1 }}</p>
                </template>
              </el-table-column>
              <el-table-column prop="nontaxcode" width="110" align="center" show-overflow-tooltip sortable label="收费项目编码" />
              <el-table-column prop="nontaxname" width="200" align="center" show-overflow-tooltip sortable label="收费项目名称">
                <template slot-scope="scope">
                  <div v-if="toolBarState===1">
                    <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.nontaxname" size="mini" />
                  </div>
                  <p v-else>{{ scope.row.nontaxname }}</p>
                </template>
              </el-table-column>
              <el-table-column prop="amount" width="100" align="center" show-overflow-tooltip sortable label="票面金额">
                <template slot-scope="scope">
                  <div v-if="toolBarState===1">
                    <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.amount" size="mini" />
                  </div>
                  <p v-else>{{ scope.row.amount }}</p>
                </template>
              </el-table-column>
              <el-table-column prop="accountspay" width="120" align="center" show-overflow-tooltip sortable label="应缴专户">
                <template slot-scope="scope">
                  <div v-if="toolBarState===1">
                    <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.accountspay" size="mini" />
                  </div>
                  <p v-else>{{ scope.row.accountspay }}</p>
                </template>
              </el-table-column>
              <el-table-column prop="accounts" width="120" align="center" show-overflow-tooltip sortable label="实缴专户">
                <template slot-scope="scope">
                  <div v-if="toolBarState===1">
                    <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.accounts" size="mini" />
                  </div>
                  <p v-else>{{ scope.row.accounts }}</p>
                </template>
              </el-table-column>
              <el-table-column prop="inconvenient" width="120" align="center" show-overflow-tooltip sortable label="不便进专户">
                <template slot-scope="scope">
                  <div v-if="toolBarState===1">
                    <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.inconvenient" size="mini" />
                  </div>
                  <p v-else>{{ scope.row.inconvenient }}</p>
                </template>
              </el-table-column>
              <el-table-column prop="unpaidacc" width="120" align="center" show-overflow-tooltip sortable label="未缴专户">
                <template slot-scope="scope">
                  <div v-if="toolBarState===1">
                    <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.unpaidacc" size="mini" />
                  </div>
                  <p v-else>{{ scope.row.unpaidacc }}</p>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>

          <el-scrollbar class="wrap" style="height:100%;width:40%;padding-left:10px;">
            <el-table
              :data="tableDataTable3.tableArray.concat({})"
              highlight-current-row
              border
              style="width: 100%"
              @row-click="showDetail"
              @selection-change="handleSelectionChange3">
              <el-table-column type="selection" width="60" />
              <!-- <el-table-column
                type="index"/> -->
              <el-table-column width="90" align="center" show-overflow-tooltip sortable type="index">
                <template slot-scope="scope">
                  <div v-if="toolBarState===1">
                    <el-button
                      v-if="scope.$index === tableDataTable3.tableArray.length "
                      size="mini"
                      type="primary"
                      @click="addTable3Row(scope.$index, scope.row)">添加</el-button>
                    <p v-else>{{ scope.$index + 1 }}</p>
                    <!-- <el-button
                      v-else
                      size="mini"
                      plain
                      type="primary"
                      @click="updateTable3Row(scope.$index, scope.row)">修改</el-button> -->
                  </div>
                  <p v-else>{{ scope.$index + 1 }}</p>
                </template>
              </el-table-column>
              <el-table-column prop="startnumber" width="150" align="center" show-overflow-tooltip sortable label="起始号码">
                <template slot-scope="scope">
                  <div v-if="toolBarState===1">
                    <p v-if="scope.$index === tableDataTable3.tableArray.length"> {{ scope.row.startnumber }}
                    </p>
                    <el-input v-changeTable3StartNumberByNum="scope.row" v-else v-model="scope.row.startnumber" :disabled="currentRowIndex === ''" size="mini"/>
                  </div>
                  <p v-else> {{ scope.row.startnumber }}
                  </p>
                  <!-- <div v-if="toolBarState===1 && currentMainTableIndex!=='' ">
                    <el-input v-if="scope.$index === tableDataTable3.tableArray.length-1" v-changeTable3StartNumberByNum="scope.row" v-model="scope.row.startnumber" :disabled="currentRowIndex === ''" size="mini" @change="changePush(scope)" />
                  </div>
                  <p v-else>{{ scope.row.startnumber }}</p> -->
                </template>
              </el-table-column>
              <el-table-column prop="endnumber" width="150" align="center" show-overflow-tooltip sortable label="终止号码">
                <template slot-scope="scope">
                  <!-- <div v-if="toolBarState===1 && currentMainTableIndex!==''">
                    <el-input v-if="scope.$index === tableDataTable3.tableArray.length-1" v-changeTable3EndNumberByNum="scope.row" v-model="scope.row.endnumber" :disabled="currentRowIndex === ''" size="mini" @change="changePush(scope)" />
                  </div>
                  <p v-else>{{ scope.row.endnumber }}</p> -->
                  <div v-if="toolBarState===1">
                    <p v-if="scope.$index === tableDataTable3.tableArray.length"> {{ scope.row.endnumber }}
                    </p>
                    <el-input v-changeTable3EndNumberByNum="scope.row" v-else v-model="scope.row.endnumber" :disabled="currentRowIndex === ''" size="mini"/>
                  </div>
                  <p v-else> {{ scope.row.endnumber }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column prop="num" width="120" align="center" show-overflow-tooltip sortable label="份数">
                <template slot-scope="scope">
                  <!-- <div v-if="toolBarState===1 && currentMainTableIndex!==''">
                    <el-input v-if="scope.$index === tableDataTable3.tableArray.length-1" v-changeTable3Num="scope.row" v-model="scope.row.num" :disabled="currentRowIndex === ''" size="mini" @change="changePush(scope)" />
                  </div>
                  <p v-else>{{ scope.row.num }}</p> -->
                  <div v-if="toolBarState===1">
                    <p v-if="scope.$index === tableDataTable3.tableArray.length"> {{ scope.row.num }}
                    </p>
                    <el-input v-changeTable3Num="scope.row" v-else v-model="scope.row.num" :disabled="currentRowIndex === ''" size="mini"/>
                  </div>
                  <p v-else> {{ scope.row.num }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column prop="reason" width="120" align="center" show-overflow-tooltip sortable label="作废原因">
                <template slot-scope="scope">
                  <!-- <div v-if="toolBarState===1&& currentMainTableIndex!==''">
                    <el-input v-if="scope.$index === tableDataTable3.tableArray.length-1" v-model="scope.row.reason" :disabled="currentRowIndex === ''" size="mini" @change="changePush(scope)" />
                  </div>
                  <p v-else>{{ scope.row.reason }}</p> -->
                  <div v-if="toolBarState===1">
                    <p v-if="scope.$index === tableDataTable3.tableArray.length"> {{ scope.row.reason }}
                    </p>
                    <el-input v-else v-model="scope.row.reason" :disabled="currentRowIndex === ''" size="mini"/>
                  </div>
                  <p v-else> {{ scope.row.reason }}
                  </p>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </div>

      </div>

      <el-dialog :visible.sync="recordPrintDialog" :close-on-press-escape="false" class="record-print-wrap" width="80%" title="票据领销记录打印" append-to-body>
        <el-row type="flex" justify="space-between">
          <el-col :span="8">
            <h1 class="title">{{ agency2billInfoCurrent.agencycode }} {{ agencyname }}</h1>
          </el-col>
          <el-col :span="12">
            <div class="right-control">
              <span>已打印：{{ hadPrintedNum }} 行记录，每页只能打印 {{ totalLineNum }} 行。 </span>
              <span style="padding-left:30px">指定打印行位置：</span>
              <!-- <el-input v-model.number="printposition" size="mini" style="width:60px" /> -->
              <el-input-number v-model.trim.number="printposition" :min="1" :max="totalLineNum" class="start-num" style="width:88px" size="mini" controls-position="right" />
            </div>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="5">
            <el-button type="danger" size="mini" @click="changePrintState(0)">设置为未打印状态</el-button>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" size="mini" @click="changePrintState(1)">设置为已打印状态</el-button>
          </el-col>
        </el-row>
        <div class="table-wrap">
          <el-scrollbar style="height:100%;width:100%;">
            <el-table :data="recordPrintList" highlight-current-row border stripe style="width: 100%" @selection-change="setSelectedPrintList" @row-click="checkDetail">
              <el-table-column type="selection" width="30" />
              <el-table-column type="index" width="50" />
              <el-table-column v-for="(item,i) of recordPrintHead" :key="i" :label="item.label" :prop="item.prop" :width="item.width" show-overflow-tooltip sortable/>
            </el-table>
          </el-scrollbar>
        </div>
        <el-row type="flex" justify="end">
          <el-button plain size="mini" @click="checkState">测试</el-button>
          <el-button plain size="mini" @click="exit">退出</el-button>
          <el-button plain size="mini" @click="setUp">设置</el-button>
          <el-button plain size="mini" @click="preview">预览</el-button>
          <el-button plain size="mini" @click="print">打印</el-button>
        </el-row>

        <!-- <el-dialog :visible.sync="printMessageDialog" append-to-body="" width="90%">
          当前正在打印状态，正在打印第{{ currentPageCount }}页，总共有{{ totalPrintCount }}页。
        </el-dialog> -->

      </el-dialog>

    </el-dialog>

    <el-dialog :close-on-click-modal="false" :visible.sync="dialogAudit" title="票据审核信息" append-to-body>
      <el-form :model="audioForm" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="审核日期">
              <el-date-picker v-model="audioForm.auditdate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd hh:mm:ss" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核人">
              <el-input v-model="audioForm.reviewer" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-input :autosize="{ minRows: 8, maxRows: 10 }" v-model="auditOpinion" type="textarea" />
      <div slot="footer" class="dialog-footer">
        <el-row>
          <el-col :span="8">
            <el-button type="primary" @click="passAudit">通 过</el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="warning" @click="backAudit">退 回</el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="danger" @click="dialogAudit = false">关 闭</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!-- 销票单位 -->
    <!-- 请选择执收单位 -->
    <layer ref="layer2" :tb-head="basChargeagencyHead" :form="basChargeagencyForm" :table-data="basChargeagency" title="请选择执收单位" @select="basChargeagencySelect" />
    <!-- 请选择库存票据 -->
    <layer ref="layer3" :tb-head="basBillinfoHead" :form="basBillinfoForm" :table-data="basBillinfo" title="请选择库存票据" @select="basBillinfoSelect" />

    <!-- 请选择你所需要的项目 -->
    <layer ref="layer4" :tb-head="basBillinfoHeadTable2" :form="basBillinfoFormTable2" :table-data="basBillinfoTable2" title="请选择你所需要的项目" @select="basBillinfoSelectTable2" />

    <tablePrintSetAdd :print-data="tableData" :template-data="templateDataList" :form-print-data="formPrintData" />
    <recordPrint ref="recordPrint" :template-list="recordTemplateList" :table-print-data="couldPrintList" :start-line-num="printposition" />

  </div>
</template>
<script>
import { mapState } from 'vuex'
import Bus from '@/utils/Bus'
import layer from '@/components/layer'
import pjyw from '@/api/pjgl/pjyw/pjyw.js'
import toolBar from '@/components/toolBar'
import { deleteJsonKey } from '@/utils/Common'
import { CalcMy_x } from '@/utils/pjyw'
// import { formatNumber, getRestNumberArray, cutoffCheckMark } from '@/utils/validate'
import tablePrintSetAdd from '@/components/tablePrintSetAdd' // add
import { getPrintTemplateData, savePrintTemplateData } from '@/api/webPrint' // add
import recordPrint from '@/views/pjgl/pjyw/pjly/recordPrint'

export default {
  components: {
    recordPrint, // 领销记录打印组件。
    tablePrintSetAdd, // 表格打印设置组件。add
    toolBar, // 上方工具条栏
    layer
  },
  directives: {
    changeTable3Num: {
      bind: function(el, binding) {
        console.log('执行改变份数指令')
        var rowData = binding.value
        var numberLength = 0
        var restZeroLength = 0
        var oldInventory = ''
        if (+rowData.checkmark === 1) {
          numberLength = rowData.codelength - 1
        } else {
          numberLength = rowData.codelength
        }
        var minEndNumber = +(rowData.minNumber.slice(0, numberLength))
        var maxEndNumber = +(rowData.maxNumber.slice(0, numberLength))

        el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
          oldInventory = el.firstElementChild.value.toString()
        }
        el.firstElementChild.onchange = function() {
          var inputInventory = el.firstElementChild.value.toString() // 记录输入的份数
          if (isNaN(Number(inputInventory))) {
            Bus.$emit('billNumberOutRange', `输入的数字非法！号码只能为数字！`)
            rowData.num = oldInventory
            el.firstElementChild.value = oldInventory
            return
          }
          if (inputInventory <= 0) {
            Bus.$emit('billNumberOutRange', `份数必须大于0！！`)
            rowData.num = oldInventory
            el.firstElementChild.value = oldInventory
            return
          }
          var reviseValue = ''
          var reviseNumber = ''
          var computedEndNumber = ''
          if (+rowData.checkmark === 1) { // 根据是否含有校验位，计算好的票据endnumber，此时还未经过任何校验。
            // computedEndNumber = +(rowData.endnumber.slice(0, numberLength)) - inputInventory
            computedEndNumber = +(rowData.startnumber.slice(0, numberLength)) + +inputInventory - 1
          } else {
            computedEndNumber = +rowData.startnumber + +inputInventory - 1
          }
          // 计算出来的computedEndNumber,肯定不会超过codelength
          if (+computedEndNumber > +maxEndNumber || +computedEndNumber < +minEndNumber) { // 超过票据范围
            restZeroLength = numberLength - computedEndNumber.toString().length
            for (let i = 0; i < restZeroLength; i++) {
              reviseValue += '0'
            }
            reviseValue += computedEndNumber
            if (+rowData.checkmark === 1) { // 超限，且有校验位时
              reviseNumber = CalcMy_x(reviseValue)
              reviseValue += reviseNumber
            }
            Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${rowData.startnumber}】至【${reviseValue}】的票据，请检查`)
            el.firstElementChild.value = oldInventory
            rowData.num = oldInventory
            return
          }
          // 这里的computedEndNumber,一定没有超过票据范围
          restZeroLength = numberLength - computedEndNumber.toString().length
          for (let i = 0; i < restZeroLength; i++) {
            reviseValue += '0'
          }
          reviseValue += computedEndNumber
          if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
            reviseNumber = CalcMy_x(reviseValue)
            reviseValue += reviseNumber
          }
          // 这里改endnumber
          rowData.endnumber = reviseValue
          // // 有些页面，传的是num
          rowData.num = rowData.num
          // 这里改counts
          rowData.counts = rowData.num / rowData.portions
        }
      }
    },
    changeTable3StartNumberByNum: {
      bind: function(el, binding) {
        console.log('执行并且绑定了startNumber指令', binding.value)
        console.log('当前绑定行的信息为：', binding.value.checkmark, binding.value.codelength)
        var rowData = binding.value
        var numberLength = 0
        var restZeroLength = 0
        var oldValue = ''
        if (+rowData.checkmark === 1) {
          numberLength = rowData.codelength - 1
        } else {
          numberLength = rowData.codelength
        }
        var minStartNumber = +(rowData.minNumber.slice(0, numberLength))
        var maxStartNumber = +(rowData.maxNumber.slice(0, numberLength))
        // console.log(minStartNumber, maxStartNumber)

        console.log(minStartNumber, maxStartNumber, numberLength)

        el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
          oldValue = el.firstElementChild.value.toString()
        }
        el.firstElementChild.onchange = function() {
          console.log('当前行的checkmark为：', rowData.checkmark, rowData.codelength)
          var inputValue = el.firstElementChild.value.toString() // 记录输入的值
          if (isNaN(Number(inputValue))) {
            Bus.$emit('billNumberOutRange', `输入的数字非法！号码只能为数字！`)
            rowData.startnumber = oldValue
            el.firstElementChild.value = oldValue
            return
          }
          var reviseValue = ''
          var reviseNumber = ''
          if (inputValue.length > rowData.codelength) { // 不管有没有校验位，值长度超范围都报错
            Bus.$emit('billNumberOutRange', `该票种有校验位，并且票据号码长度必须为${rowData.codelength}位`)
            el.firstElementChild.value = oldValue
            rowData.startnumber = oldValue
            return
          }

          // 这一团判断起始号应该小于终止号
          // if (+rowData.checkmark === 1) {
          //   console.log('有校验位========')
          //   if (inputValue.length === rowData.codelength) {
          //     if (+(inputValue.slice(0, inputValue.length - 1)) > +rowData.endnumber.slice(0, rowData.endnumber.length - 1)) {
          //       Bus.$emit('billNumberOutRange', `起始号码必须小于于终止号码！`)
          //       el.firstElementChild.value = oldValue
          //       rowData.startnumber = oldValue
          //       return
          //     }
          //   } else if (inputValue.length < rowData.codelength) {
          //     console.log('小于codelength========')

          //     if (+inputValue > +rowData.endnumber.slice(0, rowData.endnumber.length - 1)) {
          //       Bus.$emit('billNumberOutRange', `起始号码必须小于终止号码！`)
          //       el.firstElementChild.value = oldValue
          //       rowData.startnumber = oldValue
          //       return
          //     }
          //   }
          // } else {
          //   if (+inputValue > +rowData.endnumber) {
          //     Bus.$emit('billNumberOutRange', `起始号码必须小于终止号码！`)
          //     el.firstElementChild.value = oldValue
          //     rowData.startnumber = oldValue
          //     return
          //   }
          // }

          if (inputValue.length === rowData.codelength) { // 值长度等于规定长度时
            if (+rowData.checkmark === 1) { // 有校验位时
              inputValue = inputValue.slice(0, inputValue.length - 1)
              if (inputValue > maxStartNumber || inputValue < minStartNumber) { // 值超标时
                restZeroLength = numberLength - inputValue.length
                for (let i = 0; i < restZeroLength; i++) {
                  reviseValue += '0'
                }
                reviseValue += inputValue
                reviseNumber = CalcMy_x(reviseValue)
                reviseValue += reviseNumber
                Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${reviseValue}】至【${rowData.endnumber}】的票据，请检查`)
                el.firstElementChild.value = oldValue
                rowData.startnumber = oldValue
                return
              }
            } else { // 无校验位
              if (+inputValue > +maxStartNumber || +inputValue < +minStartNumber) { // 值超标时
                restZeroLength = numberLength - inputValue.length
                for (let i = 0; i < restZeroLength; i++) {
                  reviseValue += '0'
                }
                reviseValue += inputValue
                reviseNumber = CalcMy_x(reviseValue)
                reviseValue += reviseNumber
                Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${reviseValue}】至【${rowData.endnumber}】的票据，请检查`)
                el.firstElementChild.value = oldValue
                rowData.startnumber = oldValue
                return
              }
            }
          } else { // 值长度不够，一定没有输入校验位时
            if (+inputValue > +maxStartNumber || +inputValue < +minStartNumber) { // 值超标时
              restZeroLength = numberLength - inputValue.length
              for (let i = 0; i < restZeroLength; i++) {
                reviseValue += '0'
              }
              reviseValue += inputValue
              if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
                reviseNumber = CalcMy_x(reviseValue)
                reviseValue += reviseNumber
              }
              console.log(inputValue, minStartNumber, maxStartNumber)
              Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${reviseValue}】至【${rowData.endnumber}】的票据，请检查`)
              el.firstElementChild.value = oldValue
              rowData.startnumber = oldValue
              return
            }
          }
          // 这里的数据都是合格数据
          restZeroLength = numberLength - inputValue.length
          for (let i = 0; i < restZeroLength; i++) {
            reviseValue += '0'
          }
          reviseValue += inputValue
          if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
            reviseNumber = CalcMy_x(reviseValue)
            reviseValue += reviseNumber
          }
          el.firstElementChild.value = reviseValue
          // 这里必须改一下，因为如果不改，那么rowData中的值会自动去掉开始的0，可能是el-input在进行双向绑定赋值时，调用了类似trim去多余的0
          // 或者是将string类型转换成了int类型，导致去了0
          rowData.startnumber = reviseValue
          console.log('合法值是：', reviseValue)
          console.log('绑定的验证信息为：', binding.value.checkmark, binding.value.codelength)

          // 这里改动份数
          if (+rowData.checkmark === 1) {
            rowData.num = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
          } else {
            rowData.num = rowData.endnumber - rowData.startnumber + 1
          }
          if (+rowData.checkmark === 1) {
            rowData.num = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
          } else {
            rowData.num = rowData.endnumber - rowData.startnumber + 1
          }
          // 为负数置为空，因为没有填其他参数
          if (rowData.num < 0) {
            rowData.num = ''
          }

          // 这里改本数
          rowData.counts = rowData.num / rowData.portions
        }
      }
    },
    changeTable3EndNumberByNum: {
      bind: function(el, binding) {
        console.log('执行EndNumber指令')
        var rowData = binding.value
        var numberLength = 0
        var restZeroLength = 0
        var oldValue = ''

        if (+rowData.checkmark === 1) {
          numberLength = rowData.codelength - 1
        } else {
          numberLength = rowData.codelength
        }
        var minEndNumber = +(rowData.minNumber.slice(0, numberLength))
        var maxEndNumber = +(rowData.maxNumber.slice(0, numberLength))

        el.firstElementChild.onfocus = function() { // 保存旧值，用以恢复
          oldValue = el.firstElementChild.value.toString()
        }
        el.firstElementChild.onchange = function() {
          console.log('执行end的change')
          var inputValue = el.firstElementChild.value.toString() // 记录输入的值
          if (isNaN(Number(inputValue))) {
            Bus.$emit('billNumberOutRange', `输入的数字非法！号码只能为数字！`)
            rowData.endnumber = oldValue
            el.firstElementChild.value = oldValue
            return
          }
          var reviseValue = ''
          var reviseNumber = ''
          if (inputValue.length > rowData.codelength) { // 不管有没有校验位，值长度超范围都报错
            Bus.$emit('billNumberOutRange', `该票种有校验位，并且票据号码长度必须为${rowData.codelength}位`)
            el.firstElementChild.value = oldValue
            rowData.endnumber = oldValue
            return
          }
          if (inputValue.length === rowData.codelength) { // 值长度等于规定长度时
            if (+rowData.checkmark === 1) { // 有校验位时
              inputValue = inputValue.slice(0, inputValue.length - 1)
              if (inputValue > maxEndNumber || inputValue < minEndNumber) { // 值超标时
                restZeroLength = numberLength - inputValue.length
                for (let i = 0; i < restZeroLength; i++) {
                  reviseValue += '0'
                }
                reviseValue += inputValue
                reviseNumber = CalcMy_x(reviseValue)
                reviseValue += reviseNumber
                Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${rowData.startnumber}】至【${reviseValue}】的票据，请检查`)
                el.firstElementChild.value = oldValue
                rowData.endnumber = oldValue
                return
              }
            } else { // 无校验位
              if (+inputValue > +maxEndNumber || +inputValue < +minEndNumber) { // 值超标时
                restZeroLength = numberLength - inputValue.length
                for (let i = 0; i < restZeroLength; i++) {
                  reviseValue += '0'
                }
                reviseValue += inputValue
                reviseNumber = CalcMy_x(reviseValue)
                reviseValue += reviseNumber
                Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${rowData.startnumber}】至【${reviseValue}】的票据，请检查`)
                el.firstElementChild.value = oldValue
                rowData.endnumber = oldValue
                return
              }
            }
          } else { // 值长度不够，一定没有输入校验位时
            if (+inputValue > +maxEndNumber || +inputValue < +minEndNumber) { // 值超标时
              console.log('此时输入的值为', inputValue)
              console.log(`限制范围是${minEndNumber}——${maxEndNumber}`)
              restZeroLength = numberLength - inputValue.length
              for (let i = 0; i < restZeroLength; i++) {
                reviseValue += '0'
              }
              reviseValue += inputValue
              if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
                reviseNumber = CalcMy_x(reviseValue)
                reviseValue += reviseNumber
              }
              console.log(reviseValue)
              console.log(reviseNumber)

              Bus.$emit('billNumberOutRange', `在仓库库存中不存在号码段【${rowData.startnumber}】至【${reviseValue}】的票据，请检查`)
              el.firstElementChild.value = oldValue
              rowData.endnumber = oldValue
              return
            }
          }
          // 这里的数据都是合格数据
          restZeroLength = numberLength - inputValue.length
          for (let i = 0; i < restZeroLength; i++) {
            reviseValue += '0'
          }
          reviseValue += inputValue
          if (+rowData.checkmark === 1) { // 有校验位时,加上校验位
            reviseNumber = CalcMy_x(reviseValue)
            reviseValue += reviseNumber
          }
          el.firstElementChild.value = reviseValue
          // 这里必须改一下，因为如果不改，那么rowData中的值会自动去掉开始的0，可能是el-input在进行双向绑定赋值时，调用了类似trim去多余的0
          // 或者是将string类型转换成了int类型，导致去了0
          rowData.endnumber = reviseValue
          // 这里改动份数
          if (+rowData.checkmark === 1) {
            rowData.num = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
          } else {
            rowData.num = rowData.endnumber - rowData.startnumber + 1
          }
          if (+rowData.checkmark === 1) {
            rowData.num = rowData.endnumber.slice(0, rowData.endnumber.length - 1) - rowData.startnumber.slice(0, rowData.startnumber.length - 1) + 1
          } else {
            rowData.num = rowData.endnumber - rowData.startnumber + 1
          }
          // 为负数置为空，因为没有填其他参数
          if (rowData.num < 0) {
            rowData.num = ''
          }
          // 这里改本数
          rowData.counts = rowData.num / rowData.portions
        }
      }
    }
  },
  props: {
    // 表单数据
    form: {
      type: Object,
      default: function() {
        return {
          // date: new Date(),
          requestdate: new Date(), // 业务日期
          receipno: '', // 单据编码
          operator: '', // 制单人
          delivered: '', // 送审人
          reviewer: '', // 审核人
          attn: '', //  经手人
        }
      }
    },
    // 标题
    title: {
      type: String,
      default: '标题'
    }
  },
  data() {
    return {
      recordTemplateInitData: {
        guid: '',
        userid: null,
        templatecontent: {
          title: '票据领销记录打印单',
          textAlign: 'left',
          fontSize: 12,
          lineHeight: 8,
          upwardMaxLineNumber: 12,
          downMaxLineNumber: 12,
          restHeight: 24,
          tableHead: [
            { text: '日期', key: 'applydate', width: '30', checked: true },
            { text: '票据编码', key: 'billcode', width: '30', checked: true },
            { text: '票据名称', key: 'billname', width: '50', checked: true },
            { text: '字轨', key: 'track', width: '20', checked: true },
            { text: '起始号码', key: 'startnumber', width: '40', checked: true },
            { text: '终止号码', key: 'endnumber', width: '40', checked: true },
            { text: '份数', key: 'num', width: '20', checked: true },
            { text: '本数', key: 'counts', width: '20', checked: true },
            { text: '单价', key: 'price', width: '20', checked: true },
            { text: '金额', key: 'amount', width: '20', checked: true },
            { text: '计价方式', key: 'pricingmet', width: '30', checked: true },
            { text: '操作员', key: 'toperator', width: '30', checked: true },
            { text: '审核人', key: 'reviewer', width: '30', checked: true },
            { text: '累计领销份数', key: 'totalapplynumber', width: '30', checked: true },
            { text: '作废份数', key: 'invalidnum', width: '30', checked: true },
            { text: '当期结存', key: 'totalnum', width: '30', checked: true }
          ]
        },
        isdefault: 1, // 是否现在使用的模板
        templatecode: this.$route.path + '/record',
        templatename: '标准模板',
        isstandardtemplage: 1 // 是否标准模板
      }, // 领销记录模板初始数据。
      recordTemplateList: [],
      templateInitData: { 
        guid: '',
        userid: null,
        templatecontent: {
          title: '核销记录明细',
          direction: 1,
          printHeadHeight: 50, // 打印头部区域的高度，单位mm
          printHead: [
            { text: '制表人', value: '', checked: true },
            { text: '业务日期', value: '', checked: true },
            { text: '单据编码', value: '', checked: true },
            { text: '销票单位', value: '', checked: true },
            { text: '经办人', value: '', checked: true }
          ],
          tableHead: [
            { text: '票据编码', key: 'billcode', width: '100', checked: true },
            { text: '票据名称', key: 'billname', width: '200', checked: true },
            { text: '字轨', key: 'track', width: '70', checked: true },
            { text: '起始号码', key: 'startnumber', width: '150', checked: true },
            { text: '终止号码', key: 'endnumber', width: '150', checked: true },
            { text: '份数', key: 'num', width: '120', checked: true },
            { text: '本数', key: 'counts', width: '120', checked: true },
            { text: '单价', key: 'price', width: '120', checked: true },
            { text: '金额', key: 'amount', width: '120', checked: true },
            { text: '计价方式', key: 'pricingmet', width: '120', checked: true },
            { text: '每本份数', key: 'portions', width: '120', checked: true },
            { text: '累计核销份数', key: 'totalverifnum', width: '120', checked: true },
            { text: '作废份数', key: 'invalidnum', width: '120', checked: true },
            { text: '结存份数', key: 'copies', width: '120', checked: true },
            { text: '结存本数', key: 'balancecount', width: '120', checked: true }
          ],
          printFoot: [
            { text: '制表人', value: '', checked: true },
            { text: '业务日期', value: '', checked: true },
            { text: '单据编码', value: '', checked: true },
            { text: '销票单位', value: '', checked: true },
            { text: '经办人', value: '', checked: true }
          ]
        },
        isdefault: 1, // 是否现在使用的模板
        templatecode: this.$route.path + '/add',
        templatename: '标准模板（核销记录明细）',
        isstandardtemplage: 1 // 是否标准模板
      },
      templateDataList: [], //  add
      printposition: 1,
      recordPrintList: [],
      recordPrintDialog: false,
      recordPrintHead: [ //  列表显示表头。
        { label: '日期', prop: 'applydate', width: 180 },
        { label: '是否已打印', prop: 'printed', width: 180 },
        { label: '领/销', prop: 'mark', width: 180 },
        { label: '票据名称', prop: 'billname', width: 180 },
        { label: '字轨', prop: 'track', width: 180 },
        { label: '起始号码', prop: 'startnumber', width: 180 },
        { label: '终止号码', prop: 'endnumber', width: 180 },
        { label: '份数', prop: 'num', width: 180 },
        { label: '本数', prop: 'counts', width: 180 },
        { label: '单价', prop: 'price', width: 180 },
        { label: '金额', prop: 'amount', width: 180 },
        { label: '操作员', prop: 'toperator', width: 180 },
        { label: '审核人', prop: 'reviewer', width: 180 },
        { label: '累计领销份数', prop: 'totalapplynumber', width: 180 },
        { label: '作废份数', prop: 'invalidnum', width: 180 },
        { label: '当期结存', prop: 'totalnum', width: 180 }
      ],
      selectedPrintList: [],

      table3UpdateState: false,
      table3InitRow: {
        startnumber: '',
        endnumber: '',
        num: '',
        reason: '',
        checkmark: '',
        codelength: '',
        minNumber: '',
        maxNumber: ''
      },
      currentMainTableIndex: '',
      clientButnsArray: ['billClose', 'billAdd', 'billAddUpdate', 'billAddDelete', 'billSave', 'billAbolish', 'billAddAudit', 'billAddUnaudit', 'addPreview', 'addPrint', 'addSet', 'addExport'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      // 审核信息
      auditOpinion: '通过',
      audioForm: {
        auditdate: new Date(),
        reviewer: ''
      },
      submitData: {
        'admdivcode': null, // 根据登陆时候用户信息获取
        'approvaldate': null, // 送审的时候才需要传递，值为送审时候的时间。但是这里应该由后端自动生成
        'approvalmark': 0, // 送审标志， 没有送审的时候，值默认为0，1为已送审。
        'auditOpinion': null, // 审核意见，弹审核文本框的时候，文本框中的内容。新增保存时一定为空。
        'auditdate': null, // 审核日期，但是这里应该由后端自动生成。
        'auditmark': 0, // 审核标志，0为未审核，1为已审核。
        // basBillPermits: { basBillPermit: [] },
        // basChargeAgencys: { basChargeAgency: [] },
        bilVerificationDetails: { bilVerificationDetail: [] },
        // bilVerificationCharges
        // bilVerificationCharge
        // bilVerificationInvalids
        // bilVerificationInvalid
        'billpermitid': null, // 领用证的guid，在执收单位数据中。
        'carrytype': 0, // 直接填0，结转需要的，代表是否正常业务。
        'createdate': null, // 创建时间，后台生成，设null
        'creator': null, // 新增操作时，记录的用户的用户名称，根据登陆时候用户信息获取
        'delivered': null, // 送审人，点击送审的时候的用户名，如果没有送审就为空。
        'guid': null, // 新增的时候为空，修改的时候由外面的主表带进来。
        'modifier': null, // 修改人，新增为空，修改，送审，审核，反审核时为用户名。
        'modifydate': null, // 修改时间，同上时间。
        'operator': null, // 操作员，即用户信名，任何操作时，记录用户名。
        'payinagencyid': null, // 单位的guid，选择单位的时候传进来。在执收单位数据中。
        'printed': null,
        'receipNo': null, // 单据编码，后台生成，新增时为null，修改的时候由后台传。
        'remark': null, // 这里没有备注，就null
        'reviewer': null, // 审核人，非审核操作为null，审核时候为用户名。
        'tradeid': null,
        'verificdate': null,
        'year': null// 根据登陆时候用户信息获取
      },
      // 修改和新增等操作时，需要提交的数据项。
      // submitData1: {
      //   agencyPurchase: {
      //     'admdivcode': null, // 根据登陆时候用户信息获取
      //     'approvaldate': null, // 送审的时候才需要传递，值为送审时候的时间。但是这里应该由后端自动生成。
      //     'approvalmark': 0, // 送审标志， 没有送审的时候，值默认为0，1为已送审。
      //     'attn': null, //  form.attn
      //     'auditOpinion': null, // 审核意见，弹审核文本框的时候，文本框中的内容。新增保存时一定为空。
      //     'auditdate': null, // 审核日期，但是这里应该由后端自动生成。
      //     'auditmark': 0, // 审核标志，0为未审核，1为已审核。
      //     'billpermitid': null, // 领用证的guid，在执收单位数据中。
      //     'carrytype': 0, // 直接填0，结转需要的，代表是否正常业务。
      //     'createdate': null, // 创建时间，后台生成，设null
      //     'creator': null, // 新增操作时，记录的用户的用户名称，根据登陆时候用户信息获取
      //     'delivered': null, // 送审人，点击送审的时候的用户名，如果没有送审就为空。
      //     'guid': null, // 新增的时候为空，修改的时候由外面的主表带进来。
      //     'mark': 0, // 默认填0，这个领用申请业务中是0
      //     'modifier': null, // 修改人，新增为空，修改，送审，审核，反审核时为用户名。
      //     'modifydate': null, // 修改时间，同上时间。
      //     'operator': null, // 操作员，即用户信名，任何操作时，记录用户名。
      //     'payinagencyid': null, // 单位的guid，选择单位的时候传进来。在执收单位数据中。
      //     'personnel': null, // 发票人，该页面一直填null
      //     'receipNo': null, // 单据编码，后台生成，新增时为null，修改的时候由后台传。
      //     'releasedate': null, // 发票时间，空。
      //     'remark': null, // 这里没有备注，就null
      //     'requestdate': null, // 业务时间，用户选择表单中获取。
      //     'reviewer': null, // 审核人，非审核操作为null，审核时候为用户名。
      //     'reviewerinfo': null, // 本页面填空null
      //     'year': null// 根据登陆时候用户信息获取
      //   }, bilAgencyPurchaseDetails: { bilAgencyPurchaseDetail: [] }
      // },
      // 需要提交的bilAgencyPurchaseDetail数组，方便封装到对象里面。
      bilVerificationDetail: [],
      // 添加的勾选项 表1
      addSelect: [],
      // 添加的勾选项 表2
      addSelect2: [],
      // 添加的勾选项 表3
      addSelect3: [],
      // 销票单位选中集合
      // 当前选择执收单位集合
      agency2billInfoCurrent: {},
      // 当前表格选择项 表1 选择行
      currentRow: {},
      // 行标
      currentRowIndex: '',
      // 表2 选择行
      currentRowTable2: {},
      // 组件是否显示
      dialogTableVisible: false,
      // 表单数据 销票单位
      agencyname: '',
      // 内层审核dialog是否显示
      dialogAudit: false,
      // form: {
      //   date: new Date(),
      //   billsCoding: '',
      //   storageType: 0,
      //   printingUnit: '',

      //   remark: '',
      //   prepared: '',
      //   auditor: '',
      //   handle: ''
      // },
      // 表格数据 表1
      tableData: [],
      // 表2 表格数据
      tableDataTable2: [],
      // 表3 表格数据
      tableDataTable3: {
        tableArray: [],
        checkInfo: {
          checkmark: '',
          codelength: '',
          minNumber: '',
          maxNumber: ''
        }},
      // 销票单位表单
      basChargeagencyForm: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '执收单位编码',
            key: 'agencycode'
          },
          {
            val: '执收单位名称',
            key: 'agencyname'
          },
          {
            val: '拼音简码',
            key: 'pinyincode'
          },
          {
            val: '领用证编码',
            key: 'permitno'
          },
          {
            val: '领用证名称',
            key: 'billpermitname'
          },
          {
            val: '经办人',
            key: 'attn'
          },
          {
            val: '办理日期',
            key: 'transactdate'
          }
        ],
        equal: ''
      },
      // 表1 请选择库存票据表单
      basBillinfoForm: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '票据编号',
            key: 'billcode'
          },
          {
            val: '票据名称',
            key: 'billname'
          },
          {
            val: '字轨',
            key: 'track'
          },
          {
            val: '起始号码',
            key: 'startnumber'
          },
          {
            val: '终止号码',
            key: 'endnumber'
          },
          {
            val: '份数',
            key: 'num'
          },
          {
            val: '本数',
            key: 'counts'
          },
          {
            val: '单价',
            key: 'price'
          },
          {
            val: '计价方式',
            key: 'pricingmet'
          },
          {
            val: '每本份数',
            key: 'portions'
          },
          {
            val: '金额',
            key: 'amount'
          },
          {
            val: '票号',
            key: ''
          }
        ],
        equal: ''
      },
      // 表2 请选择你所需要的项目表单
      basBillinfoFormTable2: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '收费项目编号',
            key: 'nontaxcode'
          },
          {
            val: '收费项目名称',
            key: 'nontaxname'
          },
          {
            val: '计量单位',
            key: 'chargeunit'
          },
          {
            val: '上限',
            key: 'chargelimit'
          },
          {
            val: '下限',
            key: 'chargelower'
          },
          {
            val: '末级标志',
            key: 'isleaf'
          },
          {
            val: '票号',
            key: ''
          }
        ],
        equal: ''
      },
      // 销票单位数据
      basChargeagency: [],
      // 表1 请选择库存票据数据
      basBillinfo: [],
      // 表2 请选择你所需要的项目数据
      basBillinfoTable2: [],
      // 销票单位表头
      basChargeagencyHead: [
        {
          prop: 'agencycode',
          label: '执收单位编码'
        },
        {
          prop: 'agencyname',
          label: '执收单位名称'
        },
        {
          prop: 'pinyincode',
          label: '拼音简码'
        },
        {
          prop: 'permitno',
          label: '领用证编码'
        },
        {
          prop: 'billpermitname',
          label: '领用证名称'
        },
        {
          prop: 'attn',
          label: '经办人'
        },
        {
          prop: 'transactdate',
          label: '办理日期'
        }
      ],
      // 表1 请选择库存票据表头
      basBillinfoHead: [
        {
          prop: 'billcode',
          label: '票据编号'
        },
        {
          prop: 'billname',
          label: '票据名称'
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
          prop: 'num',
          label: '份数'
        },
        {
          prop: 'counts',
          label: '本数'
        },
        {
          prop: 'price',
          label: '单价'
        },
        {
          prop: 'pricingmet',
          label: '计价方式'
        },
        {
          prop: 'portions',
          label: '每本份数'
        },
        {
          prop: 'amount',
          label: '金额'
        }

      ],
      // 表2  请选择你所需要的项目表头
      basBillinfoHeadTable2: [
        {
          prop: 'nontaxcode',
          label: '收费项目编号'
        },
        {
          prop: 'nontaxname',
          label: '收费项目名称'
        },
        {
          prop: 'chargeunit',
          label: '计量单位'
        },
        {
          prop: 'chargelimit',
          label: '上限'
        },
        {
          prop: 'chargelower',
          label: '下限'
        },
        {
          prop: 'isleaf',
          label: '末级标志'
        }
      ]

    }
  },
  computed: {
    ...mapState({
      toolBarState: state => state.pjyw.toolBarState,
      userInfo: state => state.user.userInfo,
      updateMark: state => state.pjyw.updateMark,
      sendAuditUpdateMark: state => state.pjyw.sendAuditUpdateMark
    }),
    formPrintData() {
      return [
        { text: '制表人', value: this.$store.state.user.name, checked: true },
        { text: '业务日期', value: this.form.requestdate, checked: true },
        { text: '单据编码', value: this.form.receipno, checked: true },
        { text: '销票单位', value: this.agencyname, checked: true },
        { text: '经办人', value: this.form.attn, checked: true }
      ]
    },
    couldPrintList() {
      return this.selectedPrintList.filter(item => item.printed === '×')
    },
    selectedGetGuidList() {
      return this.selectedPrintList.filter(item => item.mark === '领').map(item => item.lyjl_mx_guid)
    },
    selectedSellGuidList() {
      return this.selectedPrintList.filter(item => item.mark === '销').map(item => item.lyjl_mx_guid)
    },
    hadPrintedNum() {
      return this.recordPrintList.filter(item => item.printed === '√').length
    },
    employTemplate() {
      var target = this.recordTemplateList.find(item => item.isdefault === 1)
      if (target) {
        return target
      } else {
        var standardtemplate = this.recordTemplateList.find(item => item.isstandardtemplage === 1)
        if (standardtemplate) {
          return standardtemplate
        } else {
          console.log('没有找到标准模板或者默认模板，请联系管理员或者自行添加新模板。')
          return { templatecontent: {}}
        }
      }
    },
    totalLineNum() {
      return this.employTemplate.templatecontent.upwardMaxLineNumber + this.employTemplate.templatecontent.downMaxLineNumber
    }
  },
  watch: {
    dialogTableVisible(newVal, oldVal) {
      console.log('可见度改变，清空当前主表序号')
      this.currentMainTableIndex = ''
    },
    // storageWarehouse发生改变storageWarehouse为空storageWarehouse也清空
    agencyname(n) {
      if (!n) {
        // this.form.= ''
      }
    }
  },
  created() {
    //  获取领销记录打印数据
    this.getRecordPrintData()
    // 组件创建时，立即获取打印模板数据。
    this.getPrintData()// add
    this.audioForm.reviewer = this.userInfo.name
    Bus.$off('billAddDelete')
    Bus.$on('billAddDelete', () => {
      this.billAddDelete()
    })
    Bus.$off('billClose')
    Bus.$on('billClose', () => {
      this.cancel()
    })
    Bus.$off('billAbolish')
    Bus.$on('billAbolish', () => {
      this.cancel()
    })
    Bus.$off('billSave')
    Bus.$on('billSave', () => {
      this.save()
    })
    Bus.$off('billAddUpdate')
    Bus.$on('billAddUpdate', () => {
      this.update()
    })
    Bus.$off('billAddSendAudit')
    Bus.$on('billAddSendAudit', () => {
      this.billAddSendAudit()
    })
    Bus.$off('billAddUnaudit')
    Bus.$on('billAddUnaudit', () => {
      this.unaudit()
    })
    Bus.$off('billAddAudit')
    Bus.$on('billAddAudit', () => {
      this.billAddAudit()
    })
    // // 票种
    // this.ticketList().then(res => {
    //   res.data
    // })
    // 销票单位
    // 执收单位
    this.getBaseData().then(res => {
      this.basChargeagency = res.data
    })
  },
  methods: {
    checkState() {
      Bus.$emit('checkState')
    },
    exit() {
      this.recordPrintDialog = false
    },
    setUp() {
      this.$refs.recordPrint.recordPrintDialogHandClick = true
      this.$refs.recordPrint.recordPrintDialog = true
    },
    preview() {
      Bus.$emit('recordPreview')
      console.log('我已经发送了recordPreview')
    },
    print() {
      Bus.$emit('recordPrint')
    },
    changePrintState(state) { // 改变打印状态，0未打印，1已打印
      // var str = state === 0 ? '未' : '已'
      if (this.selectedPrintList.length > 0) {
        // console.log('已选中的数组为：', this.selectedGetGuidList)
        // this.$confirm(`确定将所选数据设置为【${str}】打印状态？`, '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        this.changeGetPrintState(state, this.selectedGetGuidList).then(res => {
          if (res.code === '200') {
            this.selectedPrintList.filter(item => item.mark === '领').forEach(item => {
              item.printed = state === 0 ? '×' : '√'
            })
          }
        }).catch(err => {
          console.log(err)
        })
        this.changeSellPrintState(state, this.selectedSellGuidList).then(res => {
          if (res.code === '200') {
            this.selectedPrintList.filter(item => item.mark === '销').forEach(item => {
              item.printed = state === 0 ? '×' : '√'
            })
          }
        }).catch(err => {
          console.log(err)
        })
        // 发送请求，将数据置为已打印状态。
        // }).catch(() => {
        // })
      } else {
        this.$alert('尚未选择任何内容，请先勾选数据！', '警告', {
          confirmButtonText: '确定'
        })
      }
    },
    // confirmSetHadPrint() {

    // },
    checkDetail(row) {
      console.log(row)
    },
    setSelectedPrintList(val) {
      this.selectedPrintList = val
    },
    openRecordPrint() {
      // this.getRecordPrintList(this.submitData.apply.permitid).then(res => {
      //   this.recordPrintList = res.data
      //   console.log('收到了看看数据，', res)
      // }).catch(err => {
      //   console.log(err)
      // })
      // this.getPrintPosition(this.submitData.apply.permitid).then(res => {
      //   this.printposition = res.data.printposition
      // }).catch(err => {
      //   console.log(err)
      // })
      // 同时执行p1和p2，并在它们都完成后执行then:
      Promise.all([this.getRecordPrintList(this.submitData.billpermitid), this.getPrintPosition(this.submitData.billpermitid)]).then(res => {
        console.log(res[0].data)
        console.log('收到的是：', res[1].data)
        this.recordPrintList = res[0].data
        this.printposition = +res[1].data.printposition
        this.recordPrintDialog = true
        this.$refs.recordPrint.recordPrintDialogHandClick = false
        this.$refs.recordPrint.recordPrintDialog = false
        this.$refs.recordPrint.templateUpdateDialog = false
        // this.recordPrintList = res
      })
      //  这里要先根据agencyid找准用证的billpermitid，即返回结果的guid
      // this.getRecordPrintListByAgencyId(this.submitData.payinagencyid).then(res => {
      //   console.log('根据agencyid获取的结果：', res)
      //   this.printposition = +res.data.printposition
      //   this.getRecordPrintList(res.data.guid).then(res => {
      //   console.log('根据guid获取的结果：', res)
      //     this.recordPrintList = res.data
      //     this.recordPrintDialog = true
      //     this.$refs.recordPrint.recordPrintDialogHandClick = false
      //     this.$refs.recordPrint.recordPrintDialog = false
      //     this.$refs.recordPrint.templateUpdateDialog = false
      //     if (this.recordPrintList === null) {
      //       this.recordPrintList = []
      //     }
      //   })
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    getPrintData() { //  add
      var templateCode = this.$route.path + '/add'
      getPrintTemplateData(templateCode).then(res => {
        console.log(res.data)
        if (res.data.length > 0) {
          this.templateDataList = res.data
          console.log('获取了服务器数据！')
        } else {
          this.templateDataList.push(JSON.parse(JSON.stringify(this.templateInitData)))
          this.templateDataList[0].templatecontent = JSON.stringify(this.templateInitData.templatecontent)
          savePrintTemplateData(this.templateDataList[0])
          console.log('获取了本地数据，并将本地数据存到了服务器！')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getRecordPrintData() { //  add
      var templateCode = this.$route.path + '/record'
      getPrintTemplateData(templateCode).then(res => {
        if (res.data.length > 0) {
          this.recordTemplateList = res.data
          console.log('获取了服务器领销记录模板数据！')
        } else {
          this.recordTemplateList.push(JSON.parse(JSON.stringify(this.recordTemplateInitData)))
          this.recordTemplateList[0].templatecontent = JSON.stringify(this.recordTemplateInitData.templatecontent)
          savePrintTemplateData(this.recordTemplateList[0])
          console.log('获取了本地领销记录模板数据，并将本地数据存到了服务器！')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    showDetail(val) {
      console.log('当前点击行信息为:', val)
    },
    // 表3增加新行
    changePush(scope) {
      var row = this.tableDataTable3.tableArray.find(item => {
        return item === scope.row
      })
      if (row) { // 判断是否最后一行,最后一行就新增
        return
      }
      console.log('看看scope', scope)
      console.log('新增的行为', scope.row)
      console.log('大对象为：', this.tableDataTable3)
      scope.row.checkmark = this.tableDataTable3.checkInfo.checkmark
      scope.row.codelength = this.tableDataTable3.checkInfo.codelength
      scope.row.minNumber = this.tableDataTable3.checkInfo.minNumber
      scope.row.maxNumber = this.tableDataTable3.checkInfo.maxNumber

      this.tableDataTable3.tableArray.push(scope.row)
      console.log('增加之后的大对象为：', this.tableDataTable3)

      // bilVerificationCharges  bilVerificationInvalids
      // bilVerificationCharge   bilVerificationInvalid
      this.tableData[this.currentRowIndex].bilVerificationInvalids = {}
      this.tableData[this.currentRowIndex].bilVerificationInvalids.bilVerificationInvalid = []
      this.tableData[this.currentRowIndex].bilVerificationInvalids.bilVerificationInvalid = JSON.parse(JSON.stringify(this.tableDataTable3.tableArray))
    },
    // 点击表1详情行 更改表2表3
    handleCurrentChangedetailsIndex(row) {
      console.log('主表行信息为：', row)
      var i = this.tableData.findIndex(item => {
        return item === row
      })
      this.currentMainTableIndex = i
      console.log('选择的主表序号为：', this.currentMainTableIndex)
      // console.log(i)
      if (i >= 0) { // 拿到行标 修改表2表3
        this.currentRowIndex = i
        this.tableDataTable2 = this.tableData[i].charges || []
        this.tableDataTable3.tableArray = this.tableData[i].invalids || []
        console.log(this.tableData[i].checkmark)
        console.log(this.tableData[i].codelength)
        // 为每条已有的数据增加校验信息。
        this.tableDataTable3.tableArray.forEach(item => {
          item.checkmark = this.tableData[i].checkmark
          item.codelength = this.tableData[i].codelength
          item.minNumber = this.tableData[i].startnumber
          item.maxNumber = this.tableData[i].endnumber
        })
        // 为tableDataTable3添加校验位信息。
        this.tableDataTable3.checkInfo.checkmark = this.tableData[i].checkmark
        this.tableDataTable3.checkInfo.codelength = this.tableData[i].codelength
        this.tableDataTable3.checkInfo.minNumber = this.tableData[i].startnumber
        this.tableDataTable3.checkInfo.maxNumber = this.tableData[i].endnumber
        console.log(this.tableDataTable3.tableArray)
        // 为新增的初始行设置效验信息。
        this.table3InitRow.checkmark = this.tableData[i].checkmark
        this.table3InitRow.codelength = this.tableData[i].codelength
        this.table3InitRow.minNumber = this.tableData[i].startnumber
        this.table3InitRow.maxNumber = this.tableData[i].endnumber

        // this.tableDataTable3.checkmark = this.tableData[i].checkmark
        // this.tableDataTable3.codelength = this.tableData[i].codelength
      }
    },
    // 反审函数,type=1
    unaudit() {
      var guid = this.submitData.guid
      // 这里审核通过接口api
      this.billAudit({ guid: guid, type: 1, auditOpinion: null }).then(res => {
        console.log(res)
        this.$alert('反审成功！', {
          center: true,
          closeOnClickModal: true,
          closeOnPressEscape: true,
          callback: action => {
          }
        })
        this.$store.dispatch('SetToolBarState', 3)
      }).catch(err => {
        console.log(err)
      })
    },
    // 审核不通过，退回函数,type=2
    backAudit() {
      var guid = this.submitData.guid
      // 这里审核通过接口api
      this.billAudit({ guid: guid, type: 2, auditOpinion: this.auditOpinion }).then(res => {
        console.log(res)

        this.$alert('退回成功！', {
          center: true,
          closeOnClickModal: true,
          closeOnPressEscape: true,
          callback: action => {
          }
        })

        this.$store.dispatch('SetToolBarState', 2)
        this.dialogAudit = false
      }).catch(err => {
        console.log(err)
      })
    },
    // 审核通过,type=0
    passAudit() {
      var guid = this.submitData.guid
      // 这里审核通过接口api
      this.billAudit({ guid: guid, type: 0, auditOpinion: this.auditOpinion }).then(res => {
        console.log(res)
        this.$alert('审核通过！', {
          center: true,
          closeOnClickModal: true,
          closeOnPressEscape: true,
          callback: action => {
          }
        })
        this.$store.dispatch('SetToolBarState', 4)
        this.dialogAudit = false
      }).catch(err => {
        console.log(err)
      })
    },
    billAddAudit() {
      // 这里的审核只是调出了一个模态框。
      this.dialogAudit = true
      console.log('开启')
    },
    billAddSendAudit() {
      var guid = this.submitData.guid
      this.sendAudit({ guid: guid }).then(res => {
        console.log(res)
        // api调通之后要放到then里面
        this.$alert('送审成功！', {
          center: true,
          closeOnClickModal: true,
          closeOnPressEscape: true,
          callback: action => {
          }
        })
        this.$store.dispatch('SetToolBarState', 3)
      }).catch(err => {
        console.log(err)
      })
    },
    // 修改其实只是回到了待添加状态。
    update() {
      if (this.toolBarState === 3) {
        // 如果已经送审，再点击修改，则送审修改状态值为真。
        this.$store.dispatch('SetSendAuditUpdateMark', true)
      } else {
        this.$store.dispatch('SetSendAuditUpdateMark', false)
      }
      console.log('现在里面的编号是', this.form.receipno)
      this.$store.dispatch('SetToolBarState', 1)
      // 同时设置修改标记为真，表示保存按钮处于修改保存状态。
      this.$store.dispatch('SetUpdateMark', true)
    },
    // 恢复默认状态
    returnDefault(done) {
      // 关闭恢复0状态
      this.$store.dispatch('SetToolBarState', 0)
      // 关闭刷新主表数据。
      Bus.$emit('onSubmit')
      done()
    },
    // startnumber endnumber inventory 联动
    // changeStartnumber(scope) {
    //   scope.row.inventory = scope.row.endnumber - scope.row.startnumber + 1
    //   scope.row.amount = scope.row.inventory * scope.row.price
    // },
    // changeEndnumber(scope) {
    //   scope.row.inventory = scope.row.endnumber - scope.row.startnumber + 1
    //   scope.row.amount = scope.row.inventory * scope.row.price
    // },
    // changeInventory(scope) {
    //   scope.row.endnumber = scope.row.inventory + scope.row.startnumber - 1
    //   scope.row.amount = scope.row.inventory * scope.row.price
    // },
    // 编辑单元格
    cell(row, column, cell, event, $index) {
      // console.log(cell.children[0].children[0].children[0].removeAttribute('disabled'))
    },
    // 保存....................
    // 保存分为2种，一种是添加保存，一种是修改保存。
    save() {
      console.log('点击保存时,待提交的数据为', this.submitData)
      if (this.updateMark) {
        // 修改保存状态
        console.log('现在是修改保存状态')
        this.submitData.modifier = this.userInfo.name
        this.submitData.operator = this.userInfo.name
        this.submitData.attn = this.userInfo.name

        // 命名不规范，开发泪两行，找的我好苦。
        this.submitData.receipNo = this.form.receipno
        // 修改保存时，也要以当前tableData中的数据为准。
        this.submitData.bilVerificationDetails.bilVerificationDetail = JSON.parse(JSON.stringify(this.tableData))

        // deleteJsonKey(this.submitData.bilVerificationDetails.bilVerificationDetail, 'guid')
        console.log('刚刚保存的编号是', this.submitData.receipNo)
        console.log(this.form.receipno)
        console.log('修改保存状态中，待提交的数据为：', this.submitData)
        console.log('修改保存状态中，待提交的送审标志为：', this.submitData.approvalmark)

        this.updateSave(JSON.stringify(this.submitData)).then(res => {
          if (res.code === '200') {
            this.$alert('保存成功！', {
              type: 'success',
              center: true,
              closeOnClickModal: true,
              closeOnPressEscape: true,
              callback: action => {
              }
            })
          }
          console.log('收到的结果是', res)
          // 进入下一步待送审状态。
          if (this.sendAuditUpdateMark) {
            // 已送审，未审核状态下，修改数据后，应该还是处于送审状态。
            this.$store.dispatch('SetToolBarState', 3)
          } else {
            // 非送审修改时，则进入待送审状态。且设置组件内的送审状态为1
            this.$store.dispatch('SetToolBarState', 2)
            this.submitData.approvalmark = 1
          }
        }).catch(err => {
          console.log('接口返回错误信息', err)
        })
      } else {
        // 添加保存状态
        if (this.tableData.length === 0) {
          this.$message.error('请添加详细数据！')
        } else {
          // 保存和修改转json
          this.submitData.admdivcode = this.userInfo.admdivcode
          this.submitData.attn = this.form.attn
          this.submitData.billpermitid = this.agency2billInfoCurrent.perimitguid
          this.submitData.creator = this.userInfo.name
          this.submitData.modifier = null
          this.submitData.operator = this.userInfo.name
          this.submitData.attn = this.userInfo.name

          this.submitData.payinagencyid = this.agency2billInfoCurrent.agencyid
          this.submitData.requestdate = this.form.requestdate
          this.submitData.year = this.userInfo.year
          this.submitData.bilVerificationDetails.bilVerificationDetail = JSON.parse(JSON.stringify(this.tableData))
          deleteJsonKey(this.submitData.bilVerificationDetails.bilVerificationDetail, 'guid')
          // 主表也不要guid，为什么不早说呢  o(╥﹏╥)o
          delete this.submitData.guid
          // 进行保存，进入待送审核状态。
          // 调用保存api
          this.addSave(JSON.stringify(this.submitData)).then(res => {
            // var item = JSON.parse(JSON.stringify(res.data))
            // this.testArray.push(item)
            // console.log('testArray:', this.testArray)
            this.$alert('保存成功！', {
              type: 'success',
              center: true,
              closeOnClickModal: true,
              closeOnPressEscape: true,
              callback: action => {
              }
            })
            // 将服务器返回的数据，再次存回表单。因为有些数据是服务器端返回的。
            // this.tableData.forEach((item, i) => {
            //   Object.assign(item, res.data.bilVerificationDetails.bilVerificationDetail[i])
            //   console.log(item)
            // })

            this.form.receipno = res.data.receipNo
            this.submitData = JSON.parse(JSON.stringify(res.data))
            // 坑爹的命名。
            this.submitData.receipno = res.data.receipNo
            // 进入下一步待审状态。
            this.$store.dispatch('SetToolBarState', 3)
            // 设置修改标记为真，表示保存成功，现在只能进行修改而不是新增。
            this.$store.dispatch('SetUpdateMark', true)
            console.log('收到的编号是', res.data.receipNo)
          }).catch(err => { console.log(err) })
        }
      }
      console.log('点击保存之后，当前submitData数据为', this.submitData)
    },
    // 关闭添加
    // close() {
    //   this.dialogTableVisible = false
    // },
    // 删除
    expurgate() {
      // this.addSelect.forEach(item => {
      //   // 判断是否最后空项
      //   if (Object.keys(item).length !== 0) {
      //     var findex = this.tableData.findIndex(i => {
      //       return i === item
      //     })
      //     this.tableData.splice(findex, 1)
      //   }
      // })
    },
    // 不知道接口对不对。
    // 改变销售记录打印状态
    changeSellPrintState: pjyw.changeSellPrintState,
    // 改变领用记录打印状态
    changeGetPrintState: pjyw.changeGetPrintState,
    // 获取打印位置。
    getPrintPosition: pjyw.getPrintPosition,
    // 保存打印位置数字。
    savePrintPosition: pjyw.savePrintPosition,
    // 获取票据领销打印列表数据
    getRecordPrintList: pjyw.getRecordPrintList,
    // // 根据agencyid获取billpermitid
    // getRecordPrintListByAgencyId: pjyw.getRecordPrintListByAgencyId,
    // 表1 库存票据
    getBillStoreAgency: pjyw.getBillStoreAgency,
    // 表2 请选择你所需要的项目
    getagency2project: pjyw.getagency2project,
    // 增加保存。
    addSave: pjyw.addSave,
    // 修改保存。
    updateSave: pjyw.updateSave,
    // add页面主表数据删除
    delete: pjyw.delete,
    // 送审
    sendAudit: pjyw.sendAudit,
    // 审核，退回，反审，3个api公用。
    // 0通过，2退回，1反审。
    billAudit: pjyw.billAudit,
    // 票种
    // ticketList: pjyw.ticketList,
    // 销票单位
    // 执收单位
    getBaseData: pjyw.getBaseData,
    // 添加修改 表1
    addModification() {
      if (!this.agencyname) {
        this.$message.error('请您先选择销票单位')
        return
      }
      this.getBillStoreAgency(this.agency2billInfoCurrent).then(res => {
        // console.log(res)
        // 改为弹出层里面的table-data的字段
        this.basBillinfo = res.data
        this.$refs.layer3.dialogTableVisible = true
      })
    },
    // 添加修改
    // 表2
    addModificationTable2() {
      if (this.currentRowIndex === '') {
        this.$message.error('请您先选择库存票据')
        return
      }
      if (!this.agencyname) {
        this.$message.error('请您先选择销票单位')
        return
      }
      this.getagency2project(this.agency2billInfoCurrent).then(res => {
        // console.log(res)
        // 改为弹出层里面的table-data的字段
        this.basBillinfoTable2 = res.data
        this.$refs.layer4.dialogTableVisible = true
      })
    },
    // 添加修改
    // 表3
    updateTable3Row(index, row) {
      this.table3UpdateState = true
    },
    addTable3Row(index, row) {
      this.tableDataTable3.tableArray.push({
        checkmark: this.tableData[this.currentRowIndex].checkmark,
        codelength: this.tableData[this.currentRowIndex].codelength,
        minNumber: this.tableData[this.currentRowIndex].startnumber,
        maxNumber: this.tableData[this.currentRowIndex].endnumber,
        'admdivcode': this.$store.getters.userInfo.admdivcode,
        'amount': 0,
        'billid': '',
        'counts': 0,
        'createdate': '',
        'creator': '',
        'guid': null,
        'modifier': '',
        'modifydate': '',
        'operator': '',
        'price': 0,
        'receipNo': '',
        'remark': '',
        'track': '',
        'veridetailid': '',
        'year': this.$store.getters.userInfo.year,
        'startnumber': '',
        'endnumber': '',
        'num': '',
        'reason': ''
      })
      console.log('看看行数', index, this.tableDataTable3.tableArray.length)
    },
    // 表格添加，修改
    elect(row, event, column) {
    },
    // 表格行选择设置 表1
    handleCurrentChange(val) {
      this.currentRow = val
      // console.log(this.currentRow)
    },
    // 表格行选择设置
    // 表2
    handleCurrentChangeTable2(val) {
      this.currentRowTable2 = val
      // console.log(this.currentRowTable2)
    },
    // 勾选
    handleSelectionChange(val) {
      this.addSelect = val
    },
    handleSelectionChange2(val) {
      this.addSelect2 = val
    },
    handleSelectionChange3(val) {
      this.addSelect3 = val
      console.log(this.addSelect3)
    },
    // 添加
    confirm() {
      this.dialogTableVisible = false
      this.$store.dispatch('SetToolBarState', 0)
    },
    // 取消
    cancel() {
      Bus.$emit('onSubmit')
      this.dialogTableVisible = false
      this.$store.dispatch('SetToolBarState', 0)
    },
    // 删除勾选
    deleteSelected() {
      this.addSelect2.forEach(item => {
        // 判断是否最后空项
        if (Object.keys(item).length !== 0) {
          var findex = this.tableDataTable2.findIndex(i => {
            return i === item
          })
          this.tableDataTable2.splice(findex, 1)
        }
      })
      this.tableData[this.currentRowIndex].bilVerificationCharges = {}
      this.tableData[this.currentRowIndex].bilVerificationCharges.bilVerificationCharge = []
      this.tableData[this.currentRowIndex].bilVerificationCharges.bilVerificationCharge = JSON.parse(JSON.stringify(this.tableDataTable2))
      deleteJsonKey(this.tableData[this.currentRowIndex].bilVerificationCharges.bilVerificationCharge, 'guid')
      this.addSelect3.forEach(item => {
        // 判断是否最后空项
        if (Object.keys(item).length !== 0) {
          var findex = this.tableDataTable3.tableArray.findIndex(i => {
            return i === item
          })
          this.tableDataTable3.tableArray.splice(findex, 1)
        }
      })
      console.log('00')
      console.log(this.tableDataTable3.tableArray)
      this.tableData[this.currentRowIndex].bilVerificationInvalids = {}
      this.tableData[this.currentRowIndex].bilVerificationInvalids.bilVerificationInvalid = []
      this.tableData[this.currentRowIndex].bilVerificationInvalids.bilVerificationInvalid = JSON.parse(JSON.stringify(this.tableDataTable3.tableArray))
      this.addSelect.forEach(item => {
        // 判断是否最后空项
        if (Object.keys(item).length !== 0) {
          var findex = this.tableData.findIndex(i => {
            return i === item
          })
          this.tableData.splice(findex, 1)
        }
      })
    },
    // 请输入承印单位框
    // showPrint() {
    //   this.$refs.layer1.dialogTableVisible = true
    // },
    // 请输入销票单位
    showStorage() {
      this.$refs.layer2.dialogTableVisible = true
    },
    // 选择后 监听数据
    // 销票单位
    basChargeagencySelect(datas) {
      this.tableData = []
      this.tableDataTable2 = []
      this.tableDataTable3.tableArray = []
      this.agencyname = datas.currentRow.agencyname
      this.agency2billInfoCurrent = datas.currentRow
      // console.log('收到的票据仓库中的信息为：', datas)
      this.bilVerificationDetail.push(datas.currentRow)
      // console.log(this.bilVerificationDetail)
    },
    // 库存票据
    basBillinfoSelect(datas) {
      var rowdata = datas.currentRow
      rowdata.guid = null
      // console.log(rowdata.guid)
      console.log(this.currentRow === null)
      if (this.currentRow !== null) { // 修改当前行
        var findex = this.tableData.findIndex((item) => {
          return item === this.currentRow
        })
        this.tableData.splice(findex, 1, rowdata)
      } else { // 添加新行
        var finditem = this.tableData.find((item) => {
          // return item.guid === rowdata.guid
          return item.certid === rowdata.certid
        })
        if (!finditem) {
          this.tableData.push(rowdata)
        } else {
          this.$message.error('已存在，请勿重复选择')
        }
      }
      console.log('tableData的数据是：', this.tableData)
    },
    billAddDelete() {
      console.log('要删除的数据guid是', this.submitData.guid)
      console.log('要删除的编号是', this.submitData.receipno)
      this.$confirm('您确定要删除单据编码为【' + this.submitData.receipno + '】的业务单据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete(this.submitData.guid).then(res => {
          if (res.code === '200') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.cancel()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '已取消删除'
        })
      })
    },
    // 库存票据
    // 表2
    basBillinfoSelectTable2(datas) {
      datas.currentRow.nontaxid = datas.currentRow.guid

      var rowdata = datas.currentRow
      // console.log(rowdata.guid)
      console.log(this.currentRowTable2 !== null)
      if (this.currentRowTable2 !== null) { // 修改当前行
        var findex = this.tableDataTable2.findIndex((item) => {
          return item === this.currentRowTable2
        })
        this.tableDataTable2.splice(findex, 1, rowdata)
        // bilVerificationCharges
        // bilVerificationCharge

        this.tableData[this.currentRowIndex].bilVerificationCharges = {}
        this.tableData[this.currentRowIndex].bilVerificationCharges.bilVerificationCharge = []
        this.tableData[this.currentRowIndex].bilVerificationCharges.bilVerificationCharge = JSON.parse(JSON.stringify(this.tableDataTable2))
        deleteJsonKey(this.tableData[this.currentRowIndex].bilVerificationCharges.bilVerificationCharge, 'guid')
      } else { // 添加新行
        var finditem = this.tableDataTable2.find((item) => {
          return item.guid === rowdata.guid
        })
        if (!finditem) {
          this.tableDataTable2.push(rowdata)
          this.tableData[this.currentRowIndex].bilVerificationCharges = this.tableData[this.currentRowIndex].bilVerificationCharges || {}

          this.tableData[this.currentRowIndex].bilVerificationCharges = {}
          this.tableData[this.currentRowIndex].bilVerificationCharges.bilVerificationCharge = []
          this.tableData[this.currentRowIndex].bilVerificationCharges.bilVerificationCharge = JSON.parse(JSON.stringify(this.tableDataTable2))
          deleteJsonKey(this.tableData[this.currentRowIndex].bilVerificationCharges.bilVerificationCharge, 'guid')
        } else {
          this.$message.error('已存在，请勿重复选择')
        }
      }
      // this.tableDataTable2.splice(0, 1, rowdata)
      console.log('tableData2的数据是：', this.tableDataTable2)
    }
  }
}
</script>

<style lang="scss" scoped>
.record-print-btn {
  padding: 3px;
  display: inline;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  background: #fff;
  cursor: pointer;
  &:hover {
    background: #ecf5ff;
    border: 1px solid #cae1fa;
  }
}
.record-print-wrap {
  .title {
    font-size: 24px;
    font-weight: 500;
  }
  .right-control {
    display: flex;
    height: 28px;
    line-height: 28px;
  }
  .table-wrap {
    height: 340px;
    width: 100%;
  }
}
</style>

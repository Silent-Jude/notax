<template>
  <div v-if="dialogTableVisible" class="jzhj">
    <el-dialog :visible.sync="dialogTableVisible" width="80%" title="非税收入专用票据号码录入" @open="open">
      <el-button
        size="mini"
        type="danger"
        @click="deleteSelected()">删除所选</el-button>
      <h1>非税收入专用票据明细</h1>
      <el-scrollbar style="height:100%;width:100%;">
        <el-table
          ref="singleTable"
          :data="tableData.concat({})"
          height="180px"
          border
          style="width: 100%"
          highlight-current-row
          @selection-change="handleSelectionChange"
          @current-change="handleCurrentChange"
          @row-click="handleCurrentChangedetailsIndex">
          <el-table-column type="selection" width="30" />
          <el-table-column width="80" show-overflow-tooltip sortable align="center" type="index">
            <template slot-scope="scope">
              <div>
                <el-button v-if="Object.keys(scope.row).length !==0" size="mini" type="primary" @click="addModification(scope.$index, scope.row)">{{ scope.$index + 1 }} 添加</el-button>
                <el-button v-else size="mini" type="primary" @click="addModification(scope.$index, scope.row)">+添加</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="120"
            prop="billcode"
            show-overflow-tooltip
            label="票据编码">
            <template slot-scope="scope">
              {{ VerificationBillInfoList[scope.$index]&& VerificationBillInfoList[scope.$index].billcode }}
            </template>
          </el-table-column>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="170"
            prop="billname"
            show-overflow-tooltip
            label="票据名称">
            <template slot-scope="scope">
              {{ VerificationBillInfoList[scope.$index]&& VerificationBillInfoList[scope.$index].billname }}
            </template>
          </el-table-column>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="80"
            prop="track"
            show-overflow-tooltip
            label="字轨">
            <template slot-scope="scope">
              <el-input v-if="Object.keys(scope.row).length !==0" v-model="scope.row.track" size="mini"/>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="150"
            prop="startnumber"
            show-overflow-tooltip
            label="起始号码">
            <template slot-scope="scope">
              <el-input v-changeStartNumberNoLimitByNum="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.startnumber" size="mini"/>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="150"
            prop="endnumber"
            show-overflow-tooltip
            label="终止号码">
            <template slot-scope="scope">
              <el-input v-changeEndNumberNoLimitByNum="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.endnumber" size="mini"/>
            </template>
          </el-table-column>
          <!-- inventory -->
          <el-table-column
            prop="num"
            sortable
            header-align="center"
            align="center"
            width="120"
            show-overflow-tooltip
            label="份数">
            <template slot-scope="scope">
              <el-input v-changeInventoryNoLimitByNum="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.num" size="mini"/>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="120"
            prop="counts"
            show-overflow-tooltip
            label="本数">
            <template slot-scope="scope">
              <el-input v-changeCountsNoLimitByNum="scope.row" v-if="Object.keys(scope.row).length !==0" v-model="scope.row.counts" size="mini"/>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="100"
            prop="portions"
            show-overflow-tooltip
            label="每本份数"/>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="100"
            prop="price"
            show-overflow-tooltip
            label="单价"/>
        </el-table>
      </el-scrollbar>
      <h1>其中:作废票据号码登记</h1>

      <el-scrollbar style="height:100%;width:100%;">
        <el-table
          ref="singleTable2"
          :data="tableData2.concat({})"
          height="180px"
          border
          style="width: 100%"
          highlight-current-row
          @selection-change="handleSelectionChange2">
          <el-table-column
            type="selection"
            width="60"/>
          <el-table-column
            width="90"
            align="center"
            show-overflow-tooltip
            sortable
            type="index">
            <template slot-scope="scope">
              <div>
                <el-button
                  v-if="scope.$index == tableData2.length"
                  size="mini"
                  type="primary"
                  @click="addTable2Row(scope.$index, scope.row)">添加</el-button>
                <p v-else>{{ scope.$index + 1 }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="150"
            prop="startnumber"
            show-overflow-tooltip
            label="起始号码">
            <template slot-scope="scope">
              <div>
                <p v-if="scope.$index == tableData2.length">{{ scope.row.startnumber }}</p>
                <el-input v-changeTable3StartNumberByNum="scope.row" v-else v-model="scope.row.startnumber" size="mini" @change="changePush(scope)"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="endnumber"
            width="150"
            align="center"
            show-overflow-tooltip
            sortable
            label="终止号码">
            <template slot-scope="scope">
              <div>
                <p v-if="scope.$index == tableData2.length">{{ scope.row.endnumber }}</p>
                <el-input v-changeTable3EndNumberByNum="scope.row" v-else v-model="scope.row.endnumber" size="mini" @change="changePush(scope)"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="inventory"
            width="120"
            align="center"
            show-overflow-tooltip
            sortable
            label="份数">
            <template slot-scope="scope">
              <div>
                <p v-if="scope.$index == tableData2.length">{{ scope.row.endnumber }}</p>
                <el-input v-changeTable3Num="scope.row" v-else v-model="scope.row.num" size="mini" @change="changePush(scope)"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="reason"
            width="120"
            align="center"
            show-overflow-tooltip
            sortable
            label="作废原因">
            <template slot-scope="scope">
              <div>
                <p v-if="scope.$index == tableData2.length">{{ scope.row.endnumber }}</p>
                <el-input v-else v-model="scope.row.reason" size="mini" @change="changePush(scope)"/>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 请选择你所需要的项目 -->
    <layer ref="layer3" :tb-head="xmHead" :form="{}" :table-data="xmdata" title="请选择你所需要的项目" @select="getxm" />

  </div>
</template>
<script>
import layer from '@/components/layer'
import dwzsgl from '@/api/dwzsgl/dwzsgl.js'
import Bus from '@/utils/Bus'
import { CalcMy_x } from '@/utils/pjyw'
export default {
  components: {
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
          // 这里改本数
          rowData.counts = rowData.num / rowData.portions
        }
      }
    }
  },
  props: {
    agencyId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 票据编码名称
      VerificationBillInfoList: [],
      // 请选择你所需要的项目
      xmHead: [
        {
          prop: 'billcode',
          label: '票据编码',
          width: '120px'
        },
        {
          prop: 'billname',
          label: '票据名称',
          width: '170px'
        },
        {
          prop: 'track',
          label: '字轨',
          width: '70px'
        },
        {
          prop: 'startnumber',
          label: '起始号码',
          width: '120px'
        },
        {
          prop: 'endnumber',
          label: '终止号码',
          width: '120px'
        },
        {
          prop: 'inventory',
          label: '份数',
          width: '70px'
        },
        {
          prop: 'counts',
          label: '本数',
          width: '70px'
        },
        {
          prop: 'portions',
          label: '每本份数',
          width: '100px'
        },
        {
          prop: 'checkmark',
          label: '校验标志',
          width: '100px'
        },
        {
          prop: 'price',
          label: '单价',
          width: '70px'
        }
      ],
      xmdata: [],
      // 添加的勾选项 表1
      addSelect: [],
      // 添加的勾选项 表2
      addSelect2: [],
      // 当前表格选择项 表1 选择行
      currentRow: {},
      // 行标
      currentRowIndex: 0,
      tableData: [],
      dialogTableVisible: false
    }
  },
  computed: {
    tableData2() {
      // if (this.tableData.length === 0) {
      //   return []
      // }
      if (this.tableData[this.currentRowIndex]) {
        this.tableData[this.currentRowIndex].bilVerificationInvalids.bilVerificationInvalid.forEach(item => {
          item.checkmark = this.tableData[this.currentRowIndex].checkmark
          item.codelength = this.tableData[this.currentRowIndex].codelength
          item.minNumber = this.tableData[this.currentRowIndex].startnumber
          item.maxNumber = this.tableData[this.currentRowIndex].endnumber
        })
        // console.log('ii', this.tableData[this.currentRowIndex].bilVerificationInvalids.bilVerificationInvalid)
        return this.tableData[this.currentRowIndex].bilVerificationInvalids.bilVerificationInvalid
      } else {
        return []
      }
      // if (!this.tableData[this.currentRowIndex]) {
      //   this.tableData[this.currentRowIndex] = {}
      //   this.tableData[this.currentRowIndex].bilVerificationInvalids = {}
      //   this.tableData[this.currentRowIndex].bilVerificationInvalids.bilVerificationInvalid = []
      // }
      // return this.tableData[this.currentRowIndex].bilVerificationInvalids.bilVerificationInvalid
    }
  },
  methods: {
    changePush() {

    },
    // 表2
    addTable2Row(index, row) {
      if (this.currentRowIndex >= 0 && this.currentRowIndex < this.tableData.length) {
        this.tableData[this.currentRowIndex].bilVerificationInvalids.bilVerificationInvalid.push({
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
      }

      // this.tableDataTable3.tableArray.push(this.table3InitRow)
      // console.log(index, this.tableDataTable3.tableArray.length)
      // this.tableDataTable3.tableArray.push(this.table3InitRow)
    },
    // 确定
    confirm() {
      dwzsgl.checkBillNumber(this.tableData).then(res => {
        console.log(res)
        if (res.data === true) {
          this.$emit('zjjh', {
            tableData: this.tableData,
            VerificationBillInfoList: this.VerificationBillInfoList
          })
          this.dialogTableVisible = false
        } else {
          this.$message.error('汇缴明细中的票据号码段与核销记录中的号码段重复，不能完成汇缴')
        }
      })
    },
    open() {
      if (this.$refs.singleTable) {
        this.$refs.singleTable.setCurrentRow(this.tableData[0])
        this.currentRowIndex = 0
      }
    },
    findAgencyBillStore: dwzsgl.findAgencyBillStore,
    // 勾选
    handleSelectionChange(val) {
      this.addSelect = val
    },
    // 表格行选择设置 表1
    handleCurrentChange(val) {
      this.currentRow = val
      // console.log(this.currentRow)
    },
    // 点击表1详情行 更改表2
    handleCurrentChangedetailsIndex(row) {
      var i = this.tableData.findIndex(item => {
        return item === row
      })
      // console.log(i)
      if (i >= 0) { // 拿到行标 修改表2表3
        this.currentRowIndex = i
        // this.tableDataTable2 = this.tableData[i].charges || []
        // this.tableDataTable3 = this.tableData[i].invalids || []
      }
    },
    handleSelectionChange2(val) {
      this.addSelect2 = val
    }, // 删除勾选
    deleteSelected() {
      console.log(this.addSelect)
      console.log(this.addSelect2)
      this.addSelect2.forEach(item => {
        // 判断是否最后空项
        if (Object.keys(item).length !== 0) {
          var findex = this.tableData[this.currentRowIndex].bilVerificationInvalids.bilVerificationInvalid.findIndex(i => {
            return i === item
          })
          this.tableData[this.currentRowIndex].bilVerificationInvalids.bilVerificationInvalid.splice(findex, 1)
          // this.tableDataTable3.tableArray.splice(findex, 1)
        }
      })
      this.addSelect.forEach(item => {
        // 判断是否最后空项
        if (Object.keys(item).length !== 0) {
          var findex = this.tableData.findIndex(i => {
            return i === item
          })
          this.tableData.splice(findex, 1)
          this.VerificationBillInfoList.splice(findex, 1)
        }
      })
    },
    // 添加
    addModification() {
      this.findAgencyBillStore(this.agencyId).then(res => {
        console.log('jzhj', res)
        this.$refs.layer3.dialogTableVisible = true
        this.xmdata = res.data
      })
    },
    // 添加行监听
    getxm(val) {
      // console.log('us', this.$store.getters.userInfo)
      // console.log(val)
      var data = JSON.parse(JSON.stringify(val.currentRow))
      data.num = data.inventory
      data.codelength = data.startnumber.length
      data.year = this.$store.getters.userInfo.year
      data.admdivcode = this.$store.getters.userInfo.admdivcode
      // tableData[currentRowIndex].bilVerificationInvalids.bilVerificationInvalid.concat({})
      data.bilVerificationInvalids = {}
      data.bilVerificationInvalids.bilVerificationInvalid = []
      this.tableData.push(data)
      this.VerificationBillInfoList.push(data)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.jzhj{
  h1{
    padding: 3px;
  }
}
</style>

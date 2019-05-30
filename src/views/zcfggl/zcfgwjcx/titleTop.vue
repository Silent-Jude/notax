<template>
  <div class="title">
    <toolBar :client-butns-array="clientButnsArray" />
    <h1>文件查询</h1>
    <div>
      <el-form ref="form" :model="form" size="mini" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="文件文号">
              <el-input v-model="form.fnofile_like" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item label-width="10px" label="">
              <!-- <el-checkbox-group > -->
              <el-checkbox v-model="isdate" label="日期" name="type" @change="isdateChange"/>
            <!-- </el-checkbox-group> -->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="20px" label="">
              <el-date-picker
                v-model="form.startDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item label-width="60px" label="至"/>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="20px" label="">
              <el-date-picker
                v-model="form.endDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="文件机关">
              <el-input v-model="form.agencyname_like" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label-width="" label="文件级次">
              <el-select v-model="form.flevel" placeholder="" clearable>
                <el-option v-for="item in flevel" :key="item.value" :label="item.value" :value="item.code"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label-width="" label="文件类型">
              <el-select v-model="form.ftype" placeholder="" clearable>
                <el-option v-for="item in ftype" :key="item.value" :label="item.value" :value="item.code"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="wrap-box wrap">
      <el-scrollbar style="height:100%;width:100%;">
        <el-table
          ref="singleTable"
          :data="tableData"
          border
          style="width: 100%"
          highlight-current-row
          @row-dblclick = "dbRow"
          @current-change= "changeRow">
          <el-table-column
            sortable
            header-align="center"
            align="center"
            type="index"/>
          <el-table-column
            v-for="value in tbHead"
            :key="value.label"
            :label="value.label"
            :prop="value.prop"
            :width="value.width||180"
            header-align="center"
            align="center"
            sortable >
            <template slot-scope="scope" >
              <span v-if="value.prop === 'flevel'|| value.prop === 'ftype'">
                {{ $getCodeLabel(scope.row[value.prop]) }}
              </span>
              <span v-else>{{ scope.row[value.prop] }}</span>
            </template>
          </el-table-column>

        </el-table>
      </el-scrollbar>
    </div>
    <el-tabs v-model="activeName" class="tb" style="margin-top:15px;" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="1">
        <div class="wrap-box wrap">
          <el-scrollbar style="height:100%;width:100%;">
            <el-table
              :data="tableData2"
              border
              style="width: 100%"
              highlight-current-row
              @row-dblclick = "dbRow">
              <el-table-column
                sortable
                header-align="center"
                align="center"
                type="index"/>
              <el-table-column
                v-for="value in tbHead"
                :key="value.label"
                :label="value.label"
                :prop="value.prop"
                :width="value.width||180"
                header-align="center"
                align="center"
                sortable >
                <template slot-scope="scope" >
                  <span v-if="value.prop === 'flevel'|| value.prop === 'ftype'">
                    {{ $getCodeLabel(scope.row[value.prop]) }}
                  </span>
                  <span v-else>{{ scope.row[value.prop] }}</span>
                </template>
              </el-table-column>

            </el-table>
          </el-scrollbar>
        </div>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="2">
        <div class="wrap-box wrap">
          <el-scrollbar style="height:100%;width:100%;">
            <el-table
              :data="tableData3"
              border
              style="width: 100%"
              highlight-current-row
              @row-dblclick = "dbRow3">
              <el-table-column
                sortable
                header-align="center"
                align="center"
                type="index"/>
              <el-table-column
                v-for="value in tbHead3"
                :key="value.label"
                :label="value.label"
                :prop="value.prop"
                :width="value.width||180"
                header-align="center"
                align="center"
                sortable >
                <!-- <template slot-scope="scope" >
                  <span v-if="value.prop === 'flevel'|| value.prop === 'ftype'">
                    {{ $getCodeLabel(scope.row[value.prop]) }}
                  </span>
                  <span v-else>{{ scope.row[value.prop] }}</span>
                </template> -->
              </el-table-column>

            </el-table>
          </el-scrollbar>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 明细 -->
    <el-dialog :visible.sync="dialogFormVisible" title="明细">
      <el-form disabled size="mini" label-width="100px" >
        <el-row>
          <el-col :span="12">
            <el-form-item label="行政区划">
              <el-input v-model="form3.admdivcode"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年度">
              <el-input v-model="form3.year"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="收费项目编码">
              <el-input v-model="form3.nontaxcode"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收费计量单位">
              <el-input v-model="form3.chargeunit"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="收费项目名称">
              <el-input v-model="form3.nontaxname"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="收费项目全称">
              <el-input v-model="form3.nontaxfallname"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="收费标准上限">
              <el-input v-model="form3.chargelimit"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收费标准下限">
              <el-input v-model="form3.chargelower"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="所属收费类别">
              <el-input v-model="form3.chargetypename"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="所属资金性质">
              <el-input v-model="form3.fundtypename"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="预算科目名称">
              <el-input v-model="form3.incomesortname"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="征管方式">
              <el-input v-model="form3.collectionmet"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="">
              <el-radio-group v-model="form3.isenabled">
                <el-radio :label="0">停用</el-radio>
                <el-radio :label="1">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <el-checkbox v-model="form3.ispublicprogram" true-label="1">公用项目标志</el-checkbox>
              <el-checkbox v-model="form3.allowquerymark" true-label="1">费征查询是否显示</el-checkbox>
              <el-checkbox v-model="form3.internalcontactmark" true-label="1">是否为往来项目</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form3.remark" type="textarea"/>
            </el-form-item>
          </el-col>
      </el-row></el-form>
    </el-dialog>
  </div>
</template>

<script>
import { codesByKey } from '@/api/codesByKey.js'
import { findPolProjectFnoPrj } from '@/api/jczl'
import zcfggl from '@/api/zcfggl/zcfggl.js'
import toolBar from '@/components/toolBar'
import Bus from '@/utils/Bus'
export default {
  components: {
    toolBar
  },
  data() {
    return {
      // 明细
      form3: {},
      dialogFormVisible: false,
      // 下面tab
      activeName: '1',
      tableData2: [],
      tableData3: [],
      tbHead3: [
        { prop: 'nontaxcode', width: '120', label: '收费项目编号' },
        { prop: 'nontaxname', width: '160', label: '收费项目名称' },
        { prop: 'chargetypecode', width: '160', label: '收费类别编码' },
        { prop: 'chargetypename', width: '160', label: '收费类别名称' },
        { prop: 'fundtypecode', width: '160', label: '资金性质编码' },
        { prop: 'fundtypename', width: '160', label: '资金性质名称' },
        { prop: 'ispublicprogram', width: '160', label: '是否公用项目' },
        { prop: 'chargelimit', width: '100', label: '收费上限' },
        { prop: 'chargelower', width: '100', label: '收费下限' },
        { prop: 'allowquerymark', width: '120', label: '费证查询标志' },
        { prop: 'internalcontactmark', width: '140', label: '内部往来标志' },
        { prop: 'chargeunit', width: '140', label: '收费计量单位' },
        { prop: 'subcode', width: '140', label: '会计科目编码' },
        { prop: 'subname', width: '140', label: '会计科目名称' },
        { prop: 'chargedocno', width: '120', label: '收费文号' },
        { prop: 'nontaxfallname', width: '140', label: '收费项目全称' }
      ],
      // 上面表
      tableData: [],
      tbHead: [
        { prop: 'flevel', width: '160', label: '文件级次' },
        { prop: 'fnofile', width: '120', label: '文件文号' },
        { prop: 'fname', width: '160', label: '文件名称' },
        { prop: 'ftype', width: '120', label: '文件类型' },
        { prop: 'deliverdate', width: '120', label: '发文日期' },
        { prop: 'agencyname', width: '160', label: '发文机关' },
        { prop: 'ftopic', width: '160', label: '主题词' },
        { prop: 'fno', width: '120', label: '编号' },
        { prop: 'overdue', width: '120', label: '失效日期' }
      ],

      isdate: true,
      // 文件级次
      flevel: [],
      // 文件类型
      ftype: [],
      clientButnsArray: ['close', 'clear', 'refresh1', 'print', 'tablePrintPreview', 'tablePrintSet', 'export'],
      form: {
        // fnofile_like=文件文号&agencyname_like=文件机关&flevel=文件级次&ftype=文件类型&startDate=2019-01-01&endDate=2019-01-01
        fnofile_like: '',
        agencyname_like: '',
        flevel: '',
        ftype: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  mounted() {
  },
  created() {
    var time = new Date()
    this.form.startDate = `${time.getFullYear()}-${time.getMonth() + 1}-1`
    // 设置当前时间
    this.form.endDate = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
    // 文件级次
    codesByKey('D112').then(res => {
      this.flevel = res.data
    })
    // 文件类型
    codesByKey('D113').then(res => {
      this.ftype = res.data
    })
    Bus.$off('clear')
    Bus.$on('clear', () => {
      this.form.fnofile_like = ''
      this.form.agencyname_like = ''
      this.form.flevel = ''
      this.form.ftype = ''
      this.form.startDate = ''
      this.form.endDate = ''
    })
    Bus.$off('refresh1')
    Bus.$on('refresh1', () => {
      this.onSubmit()
    })
    this.onSubmit()
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    // 查看明细
    dbRow3(row) {
      this.dialogFormVisible = true
      this.form3 = row
    },
    // 下载
    dbRow(row) {
      window.open(process.env.BASE_API + '/pol/polProjectFnoFileLib/download?guid=' + row.guid)
    },
    // 加载下面两个表
    changeRow(row) {
      zcfggl.ftopic_like({
        ftopic_like: row.ftopic,
        startDate: this.form.startDate,
        endDate: this.form.endDate
      }).then(res => {
        console.log('dd', res)
        this.tableData2 = res.data
      })
      findPolProjectFnoPrj(row.guid).then(res => {
        console.log('len', res.data.list.length)
        this.tableData3 = res.data.list
      })
    },
    // 查询
    onSubmit() {
      zcfggl.polProjectFnoFileLib(this.form).then(res => {
        console.log('r', res)
        this.tableData = res.data
        this.$refs.singleTable.setCurrentRow(this.tableData[0])
        if (res.data.length > 0) {
          // 加载下面两个表
          zcfggl.ftopic_like({
            ftopic_like: res.data[0].ftopic,
            startDate: this.form.startDate,
            endDate: this.form.endDate
          }).then(res => {
            console.log('dd', res)
            this.tableData2 = res.data
          })
          findPolProjectFnoPrj(res.data[0].guid).then(res => {
            this.tableData3 = res.data.list
          })
        } else {
          this.tableData2 = []
          this.tableData3 = []
        }
      })
    },
    isdateChange(val) {
      // 设置日期
      if (val) {
        var time = new Date()
        this.form.startDate = `${time.getFullYear()}-${time.getMonth() + 1}-1`
        // 设置当前时间
        this.form.endDate = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
      } else {
        this.form.startDate = ''
        this.form.endDate = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  display: flex;
  flex-direction: column;
  height: 100%;
  h1{
    height: 40px;
    line-height: 40px;
    text-decoration: underline;
    font-size: 20px;
    text-align: center;
    font-weight: 700;
    margin-bottom: 20px;
  }
  .wrap-box{
    // flex: 1;
    padding: 5px;
    height: 150px;
}
.tb{
  flex: 1;
}

}
</style>


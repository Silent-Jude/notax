<template>
  <div class="toolbar">
    <ul>
      <li v-if="hasButton('close')" :class="{'dis-tap':!btnsavestate}" @click="close()">
        <span class="iconfont icon-guanbi" />
        <p>关闭</p>
      </li>

      <li v-if="hasButton('queryClose')" @click="queryClose()">
        <span class="iconfont icon-guanbi" />
        <p>关闭</p>
      </li>

      <li v-if="hasButton('automatic')" :class="{'dis-tap':!btnsavestate}" @click="automatic()">
        <span class="iconfont icon-shengchengduizhangdan "/>
        <p>自动对账</p>
      </li>
      <li v-if="hasButton('reconciliation')" :class="{'dis-tap':!btnsavestate}" @click="reconciliation()">
        <span class="iconfont icon-shengchengduizhangdan "/>
        <p>手工对账</p>
      </li>

      <li v-if="hasButton('collection')" :class="{'dis-tap':!btnsavestate}" @click="collection()">
        <span class="iconfont icon-shoukuanguanli"/>
        <p>确认收款</p>
      </li>
      <li v-if="hasButton('uncollection')" :class="{'dis-tap':!btnsavestate}" @click="uncollection()">
        <span class="iconfont icon-guanbi"/>
        <p>取消收款</p>
      </li>
      <li v-if="hasButton('query1')" :class="{'dis-tap':!btnsavestate}" @click="query1()">
        <span class="iconfont icon-jinrongxianxingge-"/>
        <p>查询</p>
      </li>
      <li v-if="hasButton('reportClear')" :class="{'dis-tap':!btnsavestate}" @click="reportClear()">
        <span class="iconfont icon-qingchu" />
        <p>清除</p>
      </li>
      <li v-if="hasButton('clear')" :class="{'dis-tap':!btnsavestate}" @click="clear()">
        <span class="iconfont icon-qingchu"/>
        <p>清除</p>
      </li>
      <li v-if="hasButton('add')" :class="{'dis-tap':!btnsavestate}" @click="add()">
        <span class="iconfont icon-tianjia" />
        <p>添加</p>
      </li>
      <li v-if="hasButton('update')" :class="{'dis-tap':!btnsavestate}" @click="update()">
        <span class="iconfont icon-wulumuqishigongandashujuguanlipingtai-ico- " />
        <p>修改</p>
      </li>
      <li v-if="hasButton('delete'||'del')" :class="{'dis-tap':!btnsavestate}" @click="expurgate()">
        <span class="iconfont icon-shanchu " />
        <p>删除</p>
      </li>
      <li v-if="hasButton('refresh')" :class="{'dis-tap':!btnsavestate}" @click="refresh()">
        <span class="iconfont icon-shuaxin" />
        <p>刷新</p>
      </li>
      <!-- 票据查询 触发事件 -->
      <li v-if="hasButton('refresh1')" :class="{'dis-tap':!btnsavestate}" @click="refresh1()">
        <span class="iconfont icon-shuaxin" />
        <p>刷新</p>
      </li>

      <li v-if="hasButton('reportRefresh')" :class="{'dis-tap':!btnsavestate}" @click="reportRefresh()">
        <span class="iconfont icon-shuaxin" />
        <p>刷新</p>
      </li>
      <li v-if="hasButton('grant'||'sq')" :class="{'dis-tap':!btnsavestate}" @click="grant()">
        <span class="iconfont icon-shouquan" />
        <p>授权</p>
      </li>
      <li v-if="hasButton('grantbtn')" :class="{'dis-tap':!btnsavestate}" @click="grantbtn()">
        <span class="iconfont icon-shouquan" />
        <p>授权</p>
      </li>
      <li v-if="hasButton('save')" :class="{'dis-tap':btnsavestate}" class="top" @click="save()">
        <span class="iconfont icon-baocun" />
        <p>保存</p>
      </li>
      <li v-if="hasButton('abolish')" :class="{'dis-tap':btnsavestate}" class="top" @click="abolish()">
        <span class="iconfont icon-tuanduicankaoxian-" />
        <p>取消</p>
      </li>

      <li v-if="hasButton('grantSave')" :class="{'dis-tap':btnsavestate}" class="top" @click="grantSave()">
        <span class="iconfont icon-baocun" />
        <p>保存</p>
      </li>
      <li v-if="hasButton('grantAbolish')" :class="{'dis-tap':btnsavestate}" class="top" @click="grantAbolish()">
        <span class="iconfont icon-tuanduicankaoxian-" />
        <p>取消</p>
      </li>

      <!-- 数据库没有此项，前端写死。 -->
      <li v-if="hasButton('nianjian')" :class="{'dis-tap':!btnsavestate}" @click="yearbooks()">
        <span class="iconfont icon-jianquan " />
        <p>年检</p>
      </li>

      <!-- 财政执收管理-非税收入调整管理-单位录入调整申请 -->
      <li v-if="hasButton('czbillClose')" @click="billClose()">
        <span class="iconfont icon-guanbi" />
        <p>关闭</p>
      </li>
      <li v-if="hasButton('czclear')" :class="{'dis-tap':!btnsavestate}" @click="clear()">
        <span class="iconfont icon-qingchu"/>
        <p>清除</p>
      </li>
      <li v-if="hasButton('czbillAdd')" @click="billAdd()">
        <span class="iconfont icon-tianjia" />
        <p>添加</p>
      </li>
      <li v-if="hasButton('czbillUpdate')" :class="{'dis-tap':(isedit || !getCurrentRow || getCurrentRow && getCurrentRow.reported ==='1')}" @click="billUpdate()">
        <span class="iconfont icon-wulumuqishigongandashujuguanlipingtai-ico- " />
        <p>修改</p>
      </li>
      <li v-if="hasButton('czbillUpdatef')" :class="{'dis-tap':(isedit || getCurrentRow.audited ==='1')}" @click="billUpdate()">
        <span class="iconfont icon-wulumuqishigongandashujuguanlipingtai-ico- " />
        <p>修改</p>
      </li>
      <li v-if="hasButton('czbillUpdate2')" :class="{'dis-tap':(isedit || !getCurrentRow || getCurrentRow && getCurrentRow.reported ==='1')}" @click="billUpdate2()">
        <span class="iconfont icon-wulumuqishigongandashujuguanlipingtai-ico- " />
        <p>修改</p>
      </li>
      <li v-if="hasButton('czbillUpdatef2')" :class="{'dis-tap':(isedit || getCurrentRow.audited ==='1')}" @click="billUpdate2()">
        <span class="iconfont icon-wulumuqishigongandashujuguanlipingtai-ico- " />
        <p>修改</p>
      </li>
      <li v-if="hasButton('czbillDelete')" :class="{'dis-tap':(isedit || !getCurrentRow || getCurrentRow && getCurrentRow.reported ==='1')}" @click="billDelete()">
        <span class="iconfont icon-shanchu " />
        <p>删除</p>
      </li>
      <li v-if="hasButton('czbillRefresh')" @click="billRefresh()">
        <span class="iconfont icon-shuaxin" />
        <p>刷新</p>
      </li>
      <li v-if="hasButton('czbillSendAudit')" :class="{'dis-tap':(isedit || !getCurrentRow || getCurrentRow && getCurrentRow.reported ==='1')}" @click="billSendAudit()">
        <span class="iconfont icon-shenhe" />
        <p>送审</p>
      </li>
      <li v-if="hasButton('czbillAddAudit')" :class="{'dis-tap':(isedit || !getCurrentRow || getCurrentRow && getCurrentRow.reported !=='1' || getCurrentRow && getCurrentRow.reported ==='1' && getCurrentRow.audited ==='1')}" @click="billAddAudit()">
        <span class="iconfont icon-shenhe" />
        <p>审核</p>
      </li>
      <li v-if="hasButton('czbillUnaudit')" :class="{'dis-tap':(isedit || !getCurrentRow || getCurrentRow && getCurrentRow.reported !=='1' || getCurrentRow && getCurrentRow.reported ==='1'&& getCurrentRow.audited ==='0')}" @click="billUnaudit()">
        <span class="iconfont icon-fanshenhe" />
        <p>反审核</p>
      </li>
      <li v-if="hasButton('czbillSave')" :class="{'dis-tap':(!isedit)}" class="top" @click="billSave()">
        <span class="iconfont icon-baocun" />
        <p>保存</p>
      </li>
      <li v-if="hasButton('czbillAbolish')" :class="{'dis-tap':!isedit}" class="top" @click="billAbolish()">
        <span class="iconfont icon-tuanduicankaoxian-" />
        <p>取消</p>
      </li>
      <li v-if="hasButton('czbillAdd2')" :class="{'dis-tap':isedit}" @click="billAdd()">
        <span class="iconfont icon-tianjia" />
        <p>添加</p>
      </li>
      <li v-if="hasButton('cz')" @click="mmcz()">
        <span class="iconfont icon-zhongzhi " />
        <p>重置</p>
      </li>
      <!-- 票据管理-票据业务栏，按钮组 -->
      <li v-if="hasButton('billClose')" @click="billClose()">
        <span class="iconfont icon-guanbi" />
        <p>关闭</p>
      </li>
      <li v-if="hasButton('billAdd')" :class="{'dis-tap':isDisabled([1])}" @click="billAdd()">
        <span class="iconfont icon-tianjia" />
        <p>添加</p>
      </li>
      <li v-if="hasButton('billUpdate')" :class="{'dis-tap':isDisabled([1,5])}" @click="billUpdate()">
        <span class="iconfont icon-wulumuqishigongandashujuguanlipingtai-ico- " />
        <p>修改</p>
      </li>
      <li v-if="hasButton('billAddUpdate')" :class="{'dis-tap':isDisabled([1,4,5])}" @click="billAddUpdate()">
        <span class="iconfont icon-wulumuqishigongandashujuguanlipingtai-ico- " />
        <p>修改</p>
      </li>
      <li v-if="hasButton('billDelete')" :class="{'dis-tap':isDisabled([1,5])}" @click="billDelete()">
        <span class="iconfont icon-shanchu " />
        <p>删除</p>
      </li>
      <li v-if="hasButton('billAddDelete')" :class="{'dis-tap':isDisabled([1,3,4,5])}" @click="billAddDelete()">
        <span class="iconfont icon-shanchu " />
        <p>删除</p>
      </li>
      <li v-if="hasButton('billSave')" :class="{'dis-tap':isDisabled([0,2,3,4,5])}" class="top" @click="billSave()">
        <span class="iconfont icon-baocun" />
        <p>保存</p>
      </li>
      <li v-if="hasButton('billAbolish')" :class="{'dis-tap':isDisabled([0,2,3,4,5])}" class="top" @click="billAbolish()">
        <span class="iconfont icon-tuanduicankaoxian-" />
        <p>取消</p>
      </li>

      <li v-if="hasButton('query')" :class="{'dis-tap':!btnsavestate}" @click="query()">
        <span class="iconfont icon-jinrongxianxingge-" />
        <p>查询</p>
      </li>

      <li v-if="hasButton('billRefresh')" :class="{'dis-tap':isDisabled([])}" @click="billRefresh()">
        <span class="iconfont icon-shuaxin" />
        <p>刷新</p>
      </li>
      <li v-if="hasButton('billSendAudit')" :class="{'dis-tap':isDisabled([1,3,4,5])}" @click="billSendAudit()">
        <span class="iconfont icon-shenhe" />
        <p>送审</p>
      </li>
      <li v-if="hasButton('billAddSendAudit')" :class="{'dis-tap':isDisabled([1,3,4,5])}" @click="billAddSendAudit()">
        <span class="iconfont icon-shenhe" />
        <p>送审</p>
      </li>
      <li v-if="hasButton('billAudit')" :class="{'dis-tap':isDisabled([0,1,2,4,5])}" @click="billAudit()">
        <span class="iconfont icon-shenhe" />
        <p>审核</p>
      </li>
      <li v-if="hasButton('billAddAudit')" :class="{'dis-tap':isDisabled([1,2,4,5])}" @click="billAddAudit()">
        <span class="iconfont icon-shenhe" />
        <p>审核</p>
      </li>
      <li v-if="hasButton('billUnaudit')" :class="{'dis-tap':isDisabled([0,1,2,3,5])}" @click="billUnaudit()">
        <span class="iconfont icon-fanshenhe" />
        <p>反审核</p>
      </li>
      <li v-if="hasButton('billAddUnaudit')" :class="{'dis-tap':isDisabled([1,2,3,5])}" @click="billAddUnaudit()">
        <span class="iconfont icon-fanshenhe" />
        <p>反审核</p>
      </li>

      <!-- 基础资料的表格类型打印。 -->
      <li v-if="hasButton('tablePrint')" :class="{'dis-tap':!btnsavestate}" @click="tablePrint()">
        <span class="iconfont icon-dayin " />
        <p>打印</p>
      </li>
      <li v-if="hasButton('tablePrintPreview')" :class="{'dis-tap':!btnsavestate}" @click="tablePrintPreview()">
        <span class="iconfont icon-icon_yulan " />
        <p>预览</p>
      </li>
      <li v-if="hasButton('tablePrintSet')" :class="{'dis-tap':!btnsavestate}" @click="tablePrintSet()">
        <span class="iconfont icon-shezhi" />
        <p>设置</p>
      </li>
      <li v-if="hasButton('tablePrintExport')" :class="{'dis-tap':!btnsavestate}" @click="tablePrintExport()">
        <span class="iconfont icon-daochu" />
        <p>导出</p>
      </li>

      <!-- 票据业务列表list的表格类型打印。 -->
      <li v-if="hasButton('listPrint')" :class="{'dis-tap':!btnsavestate}" @click="listPrint()">
        <span class="iconfont icon-dayin " />
        <p>打印</p>
      </li>
      <li v-if="hasButton('listPreview')" :class="{'dis-tap':!btnsavestate}" @click="listPreview()">
        <span class="iconfont icon-icon_yulan " />
        <p>预览</p>
      </li>
      <li v-if="hasButton('listSet')" :class="{'dis-tap':!btnsavestate}" @click="listSet()">
        <span class="iconfont icon-shezhi" />
        <p>设置</p>
      </li>
      <li v-if="hasButton('listExport')" :class="{'dis-tap':!btnsavestate}" @click="listExport()">
        <span class="iconfont icon-daochu" />
        <p>导出</p>
      </li>
      <!-- 票据业务add页面的表格类型打印。 -->
      <li v-if="hasButton('addPrint')" :class="{'dis-tap':!btnsavestate}" @click="addPrint()">
        <span class="iconfont icon-dayin " />
        <p>打印</p>
      </li>
      <li v-if="hasButton('addPreview')" :class="{'dis-tap':!btnsavestate}" @click="addPreview()">
        <span class="iconfont icon-icon_yulan " />
        <p>预览</p>
      </li>
      <li v-if="hasButton('addSet')" :class="{'dis-tap':!btnsavestate}" @click="addSet()">
        <span class="iconfont icon-shezhi" />
        <p>设置</p>
      </li>
      <li v-if="hasButton('addExport')" :class="{'dis-tap':!btnsavestate}" @click="addExport()">
        <span class="iconfont icon-daochu" />
        <p>导出</p>
      </li>
      <!-- 票据购领证打印 -->
      <li v-if="hasButton('billpermitPrint')" :class="{'dis-tap':!btnsavestate}" @click="billpermitPrint()">
        <span class="iconfont icon-dayin " />
        <p>打印</p>
      </li>
      <li v-if="hasButton('billpermitPreview')" :class="{'dis-tap':!btnsavestate}" @click="billpermitPreview()">
        <span class="iconfont icon-icon_yulan " />
        <p>预览</p>
      </li>
      <li v-if="hasButton('billpermitSet')" :class="{'dis-tap':!btnsavestate}" @click="billpermitSet()">
        <span class="iconfont icon-shezhi" />
        <p>设置</p>
      </li>
      <li v-if="hasButton('billpermitExport')" :class="{'dis-tap':!btnsavestate}" @click="billpermitExport()">
        <span class="iconfont icon-daochu" />
        <p>导出</p>
      </li>

      <!-- 授权页面打印功能 -->
      <li v-if="hasButton('grantPrint')" :class="{'dis-tap':!btnsavestate}" @click="grantPrint()">
        <span class="iconfont icon-dayin " />
        <p>打印</p>
      </li>
      <li v-if="hasButton('grantPreview')" :class="{'dis-tap':!btnsavestate}" @click="grantPreview()">
        <span class="iconfont icon-icon_yulan " />
        <p>预览</p>
      </li>
      <li v-if="hasButton('grantSet')" :class="{'dis-tap':!btnsavestate}" @click="grantSet()">
        <span class="iconfont icon-shezhi" />
        <p>设置</p>
      </li>
      <li v-if="hasButton('grantExport')" :class="{'dis-tap':!btnsavestate}" @click="grantExport()">
        <span class="iconfont icon-daochu" />
        <p>导出</p>
      </li>

      <!-- 打印部分，暂未实现 -->
      <li v-if="hasButton('print')" :class="{'dis-tap':!btnsavestate}" @click="print()">
        <span class="iconfont icon-dayin " />
        <p>打印</p>
      </li>
      <li v-if="hasButton('reportPrint')" :class="{'dis-tap':!btnsavestate}" @click="reportPrint()">
        <span class="iconfont icon-dayin " />
        <p>打印</p>
      </li>
      <li v-if="hasButton('preview')" :class="{'dis-tap':!btnsavestate}" @click="preview()">
        <span class="iconfont icon-icon_yulan " />
        <p>预览</p>
      </li>

      <li v-if="hasButton('export')" :class="{'dis-tap':!btnsavestate}" @click="educe()">
        <span class="iconfont icon-daochu" />
        <p>导出</p>
      </li>
      <li v-if="hasButton('reportExport')" :class="{'dis-tap':!btnsavestate}" @click="reportExport()">
        <span class="iconfont icon-daochu" />
        <p>导出</p>
      </li>
      <li v-if="hasButton('XML')" :class="{'dis-tap':!btnsavestate}" @click="reportExport()">
        <span class="iconfont icon-daochu" />
        <p>XML</p>
      </li>
      <li v-if="hasButton('make')" :class="{'dis-tap':!btnsavestate}" @click="make()">
        <span class="iconfont icon-guanbi" />
        <p>开始制证</p>
      </li>
      <li v-if="hasButton('unmake')" :class="{'dis-tap':!btnsavestate}" @click="unmake()">
        <span class="iconfont icon-guanbi" />
        <p>取消制证</p>
      </li>
      <li v-if="hasButton('assigned')" :class="{'dis-tap':!btnsavestate}" @click="assigned()">
        <span class="iconfont icon-shangjizhipai" />
        <p>指派</p>
      </li>

      <li v-if="hasButton('mmcz')" :class="{'dis-tap':btnsavestate}" @click="mmcz()">
        <span class="iconfont icon-zhongzhi " />
        <p>密码重置</p>
      </li>
      <!-- 数据库没有此项，前端写死。 -->
      <li v-if="hasButton('filter')" :class="{'dis-tap':!btnsavestate}" @click="filter()">
        <span class="iconfont icon-filter_rows" />
        <p>过滤</p>
      </li>
      <!-- 数据库没有此项，前端写死。 -->

      <li v-if="hasButton('upload')" :class="{'dis-tap':uploaddownload.fileName || !uploaddownload.guid || uploaddownload.guid ==='-1'}" @click="upload()">
        <span class="iconfont icon-wenjianshangchuan" />
        <p>文件上传</p>
      </li>
      <li v-if="hasButton('download')" :class="{'dis-tap':!uploaddownload.fileName}" @click="download()">
        <span class="iconfont icon-wenjianxiazai" />
        <p>文件下载</p>
      </li>
      <li v-if="hasButton('ckofficefile')" :class="{'dis-tap':!btnsavestate}" @click="find()">
        <span class="iconfont icon-chakan" />
        <p>文件查看</p>
      </li>
      <li v-if="hasButton('sendaudit')" :class="{'dis-tap':!btnsavestate}" @click="sendaudit()">
        <span class="iconfont icon-shenhe" />
        <p>送审</p>
      </li>
      <li v-if="hasButton('sh'||'audit')" :class="{'dis-tap':!btnsavestate}" @click="audit()">
        <span class="iconfont icon-shenhe" />
        <p>审核</p>
      </li>
      <li v-if="hasButton('fsh'||'unaudit')" :class="{'dis-tap':!btnsavestate}" @click="unaudit()">
        <span class="iconfont icon-fanshenhe" />
        <p>反审核</p>
      </li>
      <li v-if="hasButton('cancel')" :class="{'dis-tap':!btnsavestate}" @click="cancel()">
        <span class="iconfont icon-ico_caiwuguanli_dingdanzuofei " />
        <p>作废</p>
      </li>
      <li v-if="hasButton('batchsave')" :class="{'dis-tap':!btnsavestate}" @click="batchsave()">
        <span class="iconfont icon-ico_caiwuguanli_dingdanzuofei " />
        <p>批量作废</p>
      </li>
      <li v-if="hasButton('receipt')" :class="{'dis-tap':!btnsavestate}" @click="receipt()">
        <span class="iconfont icon-huidanqueren" />
        <p>回单</p>
      </li>
      <li v-if="hasButton('poscharge')" :class="{'dis-tap':!btnsavestate}" @click="POS()">
        <span class="iconfont icon-_POS " />
        <p>POS</p>
      </li>
      <li v-if="hasButton('exchange')" :class="{'dis-tap':!btnsavestate || waitState}" @click="exchange();countDown()">
        <span class="iconfont icon-huhuan " />
        <p>互换</p>
      </li>

      <li v-if="hasButton('batchAdd')" @click="batchAdd()">
        <span class="iconfont icon-tianjia" />
        <p>批量添加管理员</p>
      </li>

      <!--
      <li v-if="hasButton('sync')" :class="{'dis-tap':!btnsavestate}" @click="datasync()">
        <span class="iconfont icon-yunduantongbu"/>
        <p>财务数据同步</p>
      </li>
      <li v-if="hasButton('sync')" :class="{'dis-tap':!btnsavestate}" @click="nodatasync()">
        <span class="iconfont icon-yunduantongbu"/>
        <p>非税数据同步</p>
      </li>

      <li :class="{'dis-tap':!btnsavestate}" @click="automatic()">
        <span class="iconfont icon-shengchengduizhangdan "/>
        <p>自动对账</p>
      </li>
      <li :class="{'dis-tap':!btnsavestate}" @click="reconciliation()">
        <span class="iconfont icon-shengchengduizhangdan "/>
        <p>手动对账</p>
      </li>

      <li v-if="hasButton('collection')" :class="{'dis-tap':!btnsavestate}" @click="collection()">
        <span class="iconfont icon-shoukuanguanli"/>
        <p>确认收款</p>
      </li>
      <li v-if="hasButton('uncollection')" :class="{'dis-tap':!btnsavestate}" @click="uncollection()">
        <span class="iconfont icon-guanbi"/>
        <p>取消收款</p>
      </li>

      <li :class="{'dis-tap':!btnsavestate}" @click="openquery()">
        <span class="iconfont icon-banli "/>
        <p>开启业务查询</p>
      </li>
      <li :class="{'dis-tap':!btnsavestate}" @click="openbusiness()">
        <span class="iconfont icon-banli "/>
        <p>开启业务办理</p>
      </li>
      <li :class="{'dis-tap':!btnsavestate}" @click="closebusiness()">
        <span class="iconfont icon-guanbi"/>
        <p>关闭业务</p>
      </li>
      <li :class="{'dis-tap':!btnsavestate}" @click="yearend()">
        <span class="iconfont icon-zhijiandan- "/>
        <p>年结</p>
      </li>
      <li v-if="hasButton('receipt')" :class="{'dis-tap':!btnsavestate}" @click="quittance()">
        <span class="iconfont icon-zhijiandan- "/>
        <p>收据</p>
      </li>
      <li v-if="hasButton('receiptprint')" :class="{'dis-tap':!btnsavestate}" @click="quittancePrint()">
        <span class="iconfont icon-zhijiandan- "/>
        <p>收据打印</p>
      </li> -->

    </ul>
  </div>

</template>

<script>

import fnToolBar from '@/api/fnToolBar'
import { mapState } from 'vuex'
export default {
  name: 'Toolbar',
  props: {
    getCurrentRow: {
      type: Object,
      require: false,
      default() {
        return {}
      }
    },
    isedit: {
      type: Boolean,
      require: false,
      default() {
        return false
      }
    },
    clientButnsArray: {
      type: Array,
      require: false,
      default() {
        return ['close']
      }
    }
  },
  data() {
    return {
      waitState: false,
      formdata: {},
      serverButnsArray: this.$route.meta.butns
    }
  },
  computed: {
    ...mapState({
      toolBarState: state => state.pjyw.toolBarState
    }),
    butnsArray() {
      if (this.serverButnsArray) {
        // return [...this.serverButnsArray, ...this.clientButnsArray]
        return [...this.clientButnsArray]
      } else {
        return [...this.clientButnsArray]
      }
    },
    btnsavestate() {
      return this.$store.getters.savestate === 0
    },
    uploaddownload() {
      return this.$store.state.app.detailInfo
    }

  },
  watch: {
  },
  created() {
    console.log('服务器端返回的按钮信息为：', this.serverButnsArray)
  },
  methods: {
    countDown() {
      this.waitState = true
      var timer = setTimeout(() => {
        this.waitState = false
        clearTimeout(timer)
      }, 3000)
    },
    // toolBarState,工具栏的状态。0默认状态，1待添加，2待送审，3待审核，4已审核,5仅供展示数据。
    isDisabled(disabledStateArray) {
      return disabledStateArray.indexOf(this.toolBarState) !== -1
    },
    hasButton(btnName) {
      return this.butnsArray.indexOf(btnName) !== -1
    },
    preview: fnToolBar.preview,
    cancel: fnToolBar.cancel,
    unmake: fnToolBar.unmake,
    make: fnToolBar.make,
    quittancePrint: fnToolBar.quittancePrint,
    quittance: fnToolBar.quittance,
    sendaudit: fnToolBar.sendaudit,
    close: fnToolBar.close,
    add: fnToolBar.add,
    update: fnToolBar.update,
    save: fnToolBar.save,
    mmcz: fnToolBar.mmcz,
    abolish: fnToolBar.abolish,
    expurgate: fnToolBar.expurgate,
    refresh: fnToolBar.refresh,
    educe: fnToolBar.educe,
    filter: fnToolBar.filter,
    grant: fnToolBar.grant,
    grantbtn: fnToolBar.grantbtn,
    upload: fnToolBar.upload,
    download: fnToolBar.download,
    find: fnToolBar.find,
    audit: fnToolBar.audit,
    unaudit: fnToolBar.unaudit,
    batchsave: fnToolBar.batchsave,
    receipt: fnToolBar.receipt,
    POS: fnToolBar.POS,
    query: fnToolBar.query,
    query1: fnToolBar.query1,
    yearbooks: fnToolBar.yearbooks,
    datasync: fnToolBar.datasync,
    nodatasync: fnToolBar.nodatasync,
    print: fnToolBar.print,
    automatic: fnToolBar.automatic,
    reconciliation: fnToolBar.reconciliation,
    assigned: fnToolBar.assigned,
    clear: fnToolBar.clear,
    planquery: fnToolBar.planquery,
    gathering: fnToolBar.gathering,
    openquery: fnToolBar.openquery,
    openbusiness: fnToolBar.openbusiness,
    closebusiness: fnToolBar.closebusiness,
    yearend: fnToolBar.yearend,

    // 表格类型打印。
    tablePrint: fnToolBar.tablePrint,
    tablePrintPreview: fnToolBar.tablePrintPreview,
    tablePrintExport: fnToolBar.tablePrintExport,
    tablePrintSet: fnToolBar.tablePrintSet,

    // 列表类型打印。
    listPrint: fnToolBar.listPrint,
    listPreview: fnToolBar.listPreview,
    listExport: fnToolBar.listExport,
    listSet: fnToolBar.listSet,

    // add页面的列表类型打印。
    addPrint: fnToolBar.addPrint,
    addPreview: fnToolBar.addPreview,
    addExport: fnToolBar.addExport,
    addSet: fnToolBar.addSet,
    // 票据购领证打印
    billpermitPrint: fnToolBar.billpermitPrint,
    billpermitPreview: fnToolBar.billpermitPreview,
    billpermitSet: fnToolBar.billpermitSet,
    billpermitExport: fnToolBar.billpermitExport,

    //  数据权限打印
    grantPrint: fnToolBar.grantPrint,
    grantPreview: fnToolBar.grantPreview,
    grantSet: fnToolBar.grantSet,
    grantExport: fnToolBar.grantExport,
    // 票据管理-票据业务栏，按钮组
    billClose: fnToolBar.billClose,
    billAdd: fnToolBar.billAdd,
    billUpdate: fnToolBar.billUpdate,
    billDelete: fnToolBar.billDelete,
    billSave: fnToolBar.billSave,
    billAbolish: fnToolBar.billAbolish,
    billRefresh: fnToolBar.billRefresh,
    billSendAudit: fnToolBar.billSendAudit,
    billAudit: fnToolBar.billAudit,
    billAddAudit: fnToolBar.billAddAudit,
    billUnaudit: fnToolBar.billUnaudit,
    billAddUpdate: fnToolBar.billAddUpdate,
    billAddSendAudit: fnToolBar.billAddSendAudit,
    billAddUnaudit: fnToolBar.billAddUnaudit,
    billAddDelete: fnToolBar.billAddDelete,

    billUpdate2: fnToolBar.billUpdate2,
    // 报表页面功能。
    reportRefresh: fnToolBar.reportRefresh,
    reportClear: fnToolBar.reportClear,
    reportPrint: fnToolBar.reportPrint,
    reportExport: fnToolBar.reportExport,

    // 数据授权页面
    grantSave: fnToolBar.grantSave,
    grantAbolish: fnToolBar.grantAbolish,
    exchange: fnToolBar.exchange,

    // 票据查询 触发事件
    refresh1: fnToolBar.refresh1,

    // 取消收款
    uncollection: fnToolBar.uncollection,
    // 确认收款
    collection: fnToolBar.collection,
    // 查询关闭
    queryClose: fnToolBar.queryClose,
    // 批量添加
    batchAdd: fnToolBar.batchAdd

  }
}
</script>

<style lang="scss" scoped>
// $toolba-bg: #DFE8F6;
$toolba-bg: #cfdef3;
$hover-bg: #c1d6f0;

.top {
  z-index: 4;
}
.toolbar {
  background: #cfdef3!important;
  font-size: 12px;
  // $toolba-bg: #cfdef3;
  color: #000;
  height: 50px;
  background: $toolba-bg;
  // border-top: 1px solid #9BBCE8;
  border-bottom: 1px solid #9bbce8;
  ul {
    display: flex;
    flex-wrap: wrap;
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


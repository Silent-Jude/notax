<template>
  <div class="toolbar">
    <ul>
      <li @click="close()">
        <span class="iconfont icon-guanbi" />
        <p>关闭</p>
      </li>
      <li @click="add()">
        <span class="iconfont icon-tianjia" />
        <p>添加</p>
      </li>
      <li @click="update()">
        <span class="iconfont icon-wulumuqishigongandashujuguanlipingtai-ico- " />
        <p>修改</p>
      </li>
      <li @click="expurgate()">
        <span class="iconfont icon-shanchu " />
        <p>删除</p>
      </li>
      <li @click="refresh()">
        <span class="iconfont icon-shuaxin" />
        <p>刷新</p>
      </li>
      <li @click="audit()">
        <span class="iconfont icon-shenhe" />
        <p>审核</p>
      </li>
      <li @click="unaudit()">
        <span class="iconfont icon-fanshenhe" />
        <p>反审</p>
      </li>
      <!-- <li @click="save()">
        <span class="iconfont icon-baocun" />
        <p>保存</p>
      </li> -->
      <!-- <li @click="abolish()">
        <span class="iconfont icon-tuanduicankaoxian-" />
        <p>取消</p>
      </li> -->
      <li @click="print()">
        <span class="iconfont icon-dayin "/>
        <p>打印</p>
      </li>
      <li @click="preview()">
        <span class="iconfont icon-icon_yulan "/>
        <p>预览</p>
      </li>
      <li @click="set()">
        <span class="iconfont icon-shezhi"/>
        <p>设置</p>
      </li>
      <li @click="educe()">
        <span class="iconfont icon-daochu" />
        <p>导出</p>
      </li>

      <!-- <li @click="make()">
        <span class="iconfont icon-guanbi" />
        <p>开始制证</p>
      </li>
      <li @click="unmake()">
        <span class="iconfont icon-guanbi" />
        <p>取消制证</p>
      </li>
      <li @click="assigned()">
        <span class="iconfont icon-guanbi" />
        <p>指派</p>
      </li> -->

      <!-- <li @click="mmcz()">
        <span class="iconfont icon-zhongzhi " />
        <p>密码重置</p>
      </li> -->
      <!-- 数据库没有此项，前端写死。 -->
      <!-- <li @click="filter()">
        <span class="iconfont icon-filter_rows" />
        <p>过滤</p>
      </li>
      <li @click="grant()">
        <span class="iconfont icon-shouquan" />
        <p>授权</p>
      </li>
      <li @click="upload()">
        <span class="iconfont icon-wenjianshangchuan" />
        <p>文件上传</p>
      </li>
      <li @click="download()">
        <span class="iconfont icon-wenjianxiazai" />
        <p>文件下载</p>
      </li> -->
      <!-- 数据库没有此项，前端写死。 -->
      <!-- <li @click="find()">
        <span class="iconfont icon-chakan" />
        <p>文件查看</p>
      </li>
      <li @click="sendaudit()">
        <span class="iconfont icon-shenhe" />
        <p>送审</p>
      </li>
      <li @click="cancel()">
        <span class="iconfont icon-ico_caiwuguanli_dingdanzuofei " />
        <p>作废</p>
      </li>
      <li @click="batchsave()">
        <span class="iconfont icon-ico_caiwuguanli_dingdanzuofei " />
        <p>批量作废</p>
      </li>
      <li @click="receipt()">
        <span class="iconfont icon-huidanqueren" />
        <p>回单</p>
      </li>
      <li @click="POS()">
        <span class="iconfont icon-_POS " />
        <p>POS</p>
      </li>
      <li @click="query()">
        <span class="iconfont icon-jinrongxianxingge-"/>
        <p>查询</p>
      </li>
      <li @click="yearbooks()">
        <span class="iconfont icon-jianquan "/>
        <p>年鉴</p>
      </li>
      <li @click="datasync()">
        <span class="iconfont icon-yunduantongbu"/>
        <p>财务数据同步</p>
      </li>
      <li @click="nodatasync()">
        <span class="iconfont icon-yunduantongbu"/>
        <p>非税数据同步</p>
      </li>

      <li @click="automatic()">
        <span class="iconfont icon-shengchengduizhangdan "/>
        <p>自动对账</p>
      </li>
      <li @click="reconciliation()">
        <span class="iconfont icon-shengchengduizhangdan "/>
        <p>手动对账</p>
      </li>
      <li @click="clear()">
        <span class="iconfont icon-qingchu"/>
        <p>清除</p>
      </li>

      <li @click="collection()">
        <span class="iconfont icon-shoukuanguanli"/>
        <p>确认收款</p>
      </li>
      <li @click="uncollection()">
        <span class="iconfont icon-guanbi"/>
        <p>取消收款</p>
      </li>

      <li @click="openquery()">
        <span class="iconfont icon-banli "/>
        <p>开启业务查询</p>
      </li>
      <li @click="openbusiness()">
        <span class="iconfont icon-banli "/>
        <p>开启业务办理</p>
      </li>
      <li @click="closebusiness()">
        <span class="iconfont icon-guanbi"/>
        <p>关闭业务</p>
      </li>
      <li @click="yearend()">
        <span class="iconfont icon-zhijiandan- "/>
        <p>年结</p>
      </li>
      <li @click="quittance()">
        <span class="iconfont icon-zhijiandan- "/>
        <p>收据</p>
      </li>
      <li @click="quittancePrint()">
        <span class="iconfont icon-zhijiandan- "/>
        <p>收据打印</p>
      </li> -->

    </ul>
  </div>

</template>

<script>

export default {
  name: 'Toolbar',
  props: {

  },
  data() {
    return {

    }
  },
  computed: {

  },
  watch: {
  },
  created() {

  }
}
</script>

<style lang="scss" scoped>
.top {
  z-index: 1999;
}
.toolbar {
  font-size: 12px;
  // $toolba-bg: #cfdef3;
  $toolba-bg: #fff;
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
      cursor: not-allowed;
    }
  }
}
</style>


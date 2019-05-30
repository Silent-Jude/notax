<template>
  <div class="menus">
    <ul class="rowul">
      <li class="pjrk" @click="billInStorage">
        <span class=""/>
        <p>票据入库</p>
      </li>
      <li class="pjly" @click="billReceive">
        <span class=""/>
        <p>票据领用</p>
      </li>
      <li class="pjhx" @click="billVerification">
        <span class=""/>
        <p>票据核销</p>
      </li>
      <li class="dwypjh" @click="unitBillPlan">
        <span class=""/>
        <p>单位用票计划</p>
      </li>
    </ul>
    <ul class="rowul" @click="fiscalDateSynchronize">
      <li class="sxjczsjtb">
        <span class=""/>
        <p>上下级财政数据同步</p>
      </li>
    </ul>
    <ul class="rowul">
      <li class="czpjgxczb" @click="fiscalBillPurchaseTable">
        <span class=""/>
        <p>财政票据购销存总表</p>
      </li>
      <li class="czkccx" @click="fiscalInventoryQuery">
        <span class=""/>
        <p>财政库存查询</p>
      </li>
      <li class="pjlskcb" @click="billFlowInventoryTable">
        <span class=""/>
        <p>票据流水库存表</p>
      </li>
      <li class="czpjhzb-jd" @click="quarterSummaryTable">
        <span class=""/>
        <p>财政票据汇总表(季度)</p>
      </li>
      <li class="czpjhzb-yf" @click="monthSummaryTable">
        <span class=""/>
        <p>财政票据汇总表(月份)</p>
      </li>
      <li class="czpjglsyjh" @click="fiscalBillUsePlan">
        <span class=""/>
        <p>财政票据购领使用计划</p>
      </li>
    </ul>

  </div>
</template>

<script>
export default {
  methods: {
    billInStorage() {
      this.$router.push('/pjgl/pjyw/pjrk')
    },
    billReceive() {
      this.$router.push('/pjgl/pjyw/pjly')
    },
    billVerification() {
      this.$router.push('/pjgl/pjyw/zypjhxgl')
    },
    unitBillPlan() {
      this.$router.push('/pjgl/pjyw/dwypjh')
    },
    fiscalDateSynchronize() {
      // this.$router.push('/pjgl/pjyw/pjrk')
    },
    fiscalBillPurchaseTable() {
      this.$router.push('/pjgl/pjtjfxbb/czpjlxczb')
    },
    fiscalInventoryQuery() {
      this.$router.push('/pjgl/pjkccx/czpjkccx')
    },
    billFlowInventoryTable() {
      // this.$router.push('/pjgl/pjyw/pjrk')
    },
    quarterSummaryTable() {
      // this.$router.push('/pjgl/pjyw/pjrk')
    },
    monthSummaryTable() {
      this.$router.push('/pjgl/pjtjfxbb/czpjhzcxyf')
    },
    fiscalBillUsePlan() {
      this.$router.push('/pjgl/pjtjfxbb/czpjsyjhb')
    }
  }
}
</script>

<style lang="scss" scoped>
.menus{
  .rowul{
    margin-top: 60px;
    display: flex;
    li{
      cursor: pointer;
      margin-left: 40px;
      padding: 5px;
      box-sizing: border-box;
      width: 100px;
      height: 110px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      box-shadow: 3px 3px 10px 3px #4F5253,
      -3px 3px 10px 3px #4F5253;

      p{
        font-size: 16px;
        text-align: center;
      }
    }
    .pjrk{
        background: rgba(255,255,255,0.8) url('../../assets/dashboard/icon_01.png') no-repeat 0 0 /contain
      }
      .pjly{
        background: rgba(255,255,255,0.8) url('../../assets/dashboard/icon_02.png') no-repeat 0 0 /contain
      }
      .pjhx{
        background: rgba(255,255,255,0.8) url('../../assets/dashboard/icon_03.png') no-repeat 0 0 /contain
      }
      .dwypjh{
        background: rgba(255,255,255,0.8) url('../../assets/dashboard/icon_04.png') no-repeat 0 0 /contain
      }
      .sxjczsjtb{
        background: rgba(255,255,255,0.8) url('../../assets/dashboard/icon_05.png') no-repeat 0 0 /contain
      }
      .czpjgxczb{
        background: rgba(255,255,255,0.8) url('../../assets/dashboard/icon_06.png') no-repeat 0 0 /contain
      }
      .czkccx{
        background: rgba(255,255,255,0.8) url('../../assets/dashboard/icon_07.png') no-repeat 0 0 /contain
      }
      .pjlskcb{
        background: rgba(255,255,255,0.8) url('../../assets/dashboard/icon_06.png') no-repeat 0 0 /contain
      }
      .czpjhzb-jd{
        background: rgba(255,255,255,0.8) url('../../assets/dashboard/icon_06.png') no-repeat 0 0 /contain
      }
      .czpjhzb-yf{
        background: rgba(255,255,255,0.8) url('../../assets/dashboard/icon_06.png') no-repeat 0 0 /contain
      }
      .czpjglsyjh{
        background: rgba(255,255,255,0.8) url('../../assets/dashboard/icon_06.png') no-repeat 0 0 /contain
      }
  }
}
</style>


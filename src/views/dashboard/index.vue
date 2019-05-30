<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name:{{ name }}</div>
    <div class="dashboard-text">roles:<span v-for="(role,i) in roles" :key="i">{{ role }}</span></div> -->
    <menus/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import menus from './menus'

export default {
  name: 'Dashboard',
  components: {
    menus
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    background: #fff url('../../assets/dashboard/dashboard.jpg') no-repeat 0 0 /cover
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

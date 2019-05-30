<template>
  <section class="app-main">
    <!-- <transition name="fade-transform" mode="out-in"> -->
    <!-- or name="fade" -->
    <!-- <router-view :key="key"></router-view> -->
    <router-view class="view"/>
    <!-- </transition> -->
  </section>
</template>

<script>

export default {
  name: 'AppMain',
  components: {
  },
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  },
  mounted() {
    var mainBody = document.getElementsByClassName('app-main')[0]
    if (mainBody) {
      var mainHeight = mainBody.offsetHeight
      this.$store.dispatch('SetMainHeight', mainHeight)
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
}
</style>

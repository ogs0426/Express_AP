<template>
  <div>
    <MainHeader></MainHeader>
    <section>
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
import MainHeader from './Header'

export default {
  name: 'home',
  components: {
    MainHeader
  }
}
</script>

<style lang="less">
</style>
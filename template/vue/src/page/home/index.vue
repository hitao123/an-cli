<template>
  <div class="home">
    home page
    <HelloWorld></HelloWorld>
  </div>  
</template>

<script>
import HelloWorld from '../../components/HelloWorld'
export default {
  name: 'home',
  components: {
    HelloWorld
  }
}
</script>

<style lang="less" scoped>
  .home {
    color: blue;
  }
</style>

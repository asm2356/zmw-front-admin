<template>
  <div id="app">
    <router-view :key="Date.now()"/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>
<style>
</style>

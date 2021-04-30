<template>
  <div class="app">
    <h1>Daily Drinks</h1>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style lang="scss" scoped>
.app {
  height: 80vh;
}
h1 {
	margin: 0;
	padding: 20px 0;
  color: #66c2ff;
  font-size: 32px;
  font-weight: 600;
  text-align: center;
}
</style>

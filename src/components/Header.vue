<template>
  <div class="header">
    <div class="sub_header">
      <h1 class="title">BEAT LEDGER</h1>
      <router-link to="/about" class="about">About</router-link>
    </div>
    <p class="login">Login</p>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {},
  components: {},
};
</script>

<style scoped>
.header {
  /* white-space: nowrap; */
  /* overflow: hidden; */
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
</style>
<template>
  <div class="header">
    <div class="sub_header">
      <h1 class="title">BEAT LEDGER</h1>
      <router-link to="/about" class="about">About</router-link>
    </div>
    <div>
      <Login />
    </div>
  </div>
</template>

<script>
import Login from "./Login.vue";

export default {
  name: "Header",
  props: {},
  components: {
    Login,
  },
};
</script>

<style scoped>
.header {
  /* white-space: nowrap; */
  /* overflow: hidden; */

  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: blanchedalmond;
}
</style>
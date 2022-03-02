<template>
  <div class="header">
    <div class="sub_header">
      <h1 class="title">BEAT LEDGER</h1>
      <router-link to="/about" class="about">About</router-link>
    </div>
    <div class="sub_header">
      <template v-if="loggedIn">
        <p class="beat_btn" id="createBeatBtn">Create Beat</p>
        <p class="btn" id="keyfileName">{{ publicKey }}</p>
      </template>
      <Login v-else @updateUserKey="updateUK($event)" />
    </div>
  </div>
</template>

<script>
import Login from "./Login.vue";

export default {
  name: "Header",
  emits: ["updateUserKey"],
  props: {},
  components: {
    Login,
  },
  data() {
    return {
      loggedIn: false,
      publicKey: "hello",
    };
  },
  methods: {
    updateUK(userKey) {
      this.loggedIn = true;
      this.publicKey = userKey;
      console.log("this better show correctly: " + userKey);
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: blanchedalmond;
}
.sub_header {
  display: flex;
  align-items: end;
  justify-content: space-between;
}
.btn {
  background: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  font-size: 12px;
  font-family: inherit;

  padding: 6px 8px;
  margin-right: 8px;
}
.btn:focus {
  outline: none;
}
.beat_btn {
  background: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 12px;
  font-family: inherit;

  padding: 6px 8px;
  margin-right: 8px;
}
.beat_btn:focus {
  outline: none;
}
.beat_btn:active {
  transform: scale(0.98);
}
</style>
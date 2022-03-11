<template>
  <div class="header">
    <div class="sub_header">
      <h1 class="title">BEAT LEDGER</h1>
      <router-link to="/about" class="about">About</router-link>
    </div>
    <div class="sub_header">
      <template v-if="isLoggedIn">
        <CreateBeat />
        <p class="btn" id="keyfileName">{{ w_public_key }}</p>
        <p @click="logout" class="beat_btn">Logout</p>
      </template>
      <Login v-else />
    </div>
  </div>
</template>

<script>
import Login from "./Login.vue";
import CreateBeat from "./CreateBeat.vue";
import { mapState } from "vuex";

export default {
  name: "Header",
  components: {
    Login,
    CreateBeat,
  },
  computed: mapState(["isLoggedIn", "w_public_key", "w_private_key"]),
  methods: {
    logout() {
      this.$store.commit("setIsLoggedIn", false);
    },
    createBeat() {
      try {
        if (this.w_public_key == "") {
          throw "No account found, not logged in!";
        }
      } catch (e) {
        console.error(e);
      }
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
  align-items: flex-end;
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
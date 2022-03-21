<template>
  <div class="header">
    <div class="sub_header">
      <h1 class="title">BEAT LEDGER</h1>
      <router-link to="/about" class="about">About</router-link>
    </div>
    <div class="sub_header">
      <input class="input_field" type="Search" v-model="searchContent" />
      <p @click="startChain" class="beat_btn">{{ searchToggle }}</p>
    </div>
    <div class="sub_header">
      <template v-if="isLoggedInValue">
        <CreateBeat :keyFile="keyFile" />
        <p class="wallet_address" id="keyfileName">{{ keyFile.public_key }}</p>
        <p @click="logout" class="beat_btn">Logout</p>
      </template>
      <Login @login-successful="loginSuccessful" v-else />
    </div>
  </div>
</template>

<script>
import Login from "./Login.vue";
import CreateBeat from "./CreateBeat.vue";
// import { mapState } from "vuex";

export default {
  name: "Header",
  components: {
    Login,
    CreateBeat,
  },
  emits: ["continueChain"],
  data() {
    return {
      isLoggedInValue: this.$ls.get("isLoggedIn", false),
      keyFileValue: this.$ls.get("keyFile", {
        public_key: "",
        private_key: Object,
      }),
      searchToggle: "Search",
      searchContent: "",
    };
  },
  computed: {
    // ...mapState(["w_public_key", "w_private_key"]),
    isLoggedIn: {
      get: function () {
        return this.isLoggedInValue;
      },
      set: function (boolVal) {
        this.isLoggedInValue = boolVal;
        this.$ls.set("isLoggedIn", boolVal);
      },
    },
    keyFile: {
      get: function () {
        return this.keyFileValue;
      },
      set: function (newKeyFile) {
        this.keyFileValue = newKeyFile;
        this.$ls.set("keyFile", newKeyFile);
      },
    },
  },
  methods: {
    logout() {
      this.isLoggedIn = false;
    },
    createBeat() {
      try {
        if (this.keyFileValue.public_key == "") {
          throw "No account found, not logged in!";
        }
      } catch (e) {
        console.error(e);
        this.keyFile = e;
      }
    },
    loginSuccessful(e) {
      this.isLoggedIn = true;
      this.keyFile = e;
    },
    startChain() {
      if (this.searchToggle == "Search" && this.searchContent == "") {
        alert("Please type something in the search box");
      } else if (this.searchToggle == "Search") {
        this.$emit("continueChain", {
          showSearch: true,
          searchContent: this.searchContent,
        });
        this.searchToggle = "Exit";
      } else if (this.searchToggle == "Exit") {
        this.$emit("continueChain", {
          showSearch: false,
          searchContent: this.searchContent,
        });
        this.searchContent = "";
        this.searchToggle = "Search";
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
.wallet_address {
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
.wallet_address:focus {
  outline: none;
}
.input_field {
  border-radius: 5px;
  padding: 6px 8px;
  margin-right: 8px;
}
.input_field:focus {
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
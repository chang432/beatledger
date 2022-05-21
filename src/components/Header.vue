<template>
  <div class="main header">
    <div class="sub_header">
      <img class="beat_logo" src="../assets/beat_logo.png" />
      <router-link to="/about" class="btn">About</router-link>
    </div>
    <div class="sub_header center_header">
      <input class="input_field" type="Search" v-model="searchContent" />
      <p @click="startChain" class="btn">{{ searchToggle }}</p>
    </div>
    <div class="sub_header center_header">
      <template v-if="isLoggedInValue">
        <UploadBeat :keyFile="keyFile" />
        <p class="wallet_address" id="keyfileName">{{ keyFile.public_key }}</p>
        <p @click="logout" class="btn logout_btn">Logout</p>
      </template>
      <Login @login-successful="loginSuccessful" v-else />
    </div>
  </div>
</template>

<script>
import Login from "./Login.vue";
import UploadBeat from "./UploadBeat.vue";
import logger from "../utilities/logger";
// import { mapState } from "vuex";

export default {
  name: "Header",
  components: {
    Login,
    UploadBeat,
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
    UploadBeat() {
      try {
        if (this.keyFileValue.public_key == "") {
          throw "No account found, not logged in!";
        }
      } catch (e) {
        logger.error(e);
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
  align-items: flex-end;
  justify-content: space-between;
  height: 120px;
}
.sub_header {
  display: flex;
  align-items: flex-end;
  margin-bottom: 22px;
}
.center_header {
  align-items: center;
}
.beat_logo {
  width: 350px;
  height: 60px;
  margin-bottom: 5.5px;
  margin-left: 30px;
  margin-right: 30px;

  /* code to fix blurriness from scaling down image */
  image-rendering: -moz-crisp-edges; /* Firefox */
  image-rendering: -o-crisp-edges; /* Opera */
  image-rendering: -webkit-optimize-contrast; /* Webkit (non-standard naming) */
  image-rendering: crisp-edges;
  -ms-interpolation-mode: nearest-neighbor; /* IE (non-standard property) */
}
.input_field {
  padding: 2px 2px;
  min-width: 100%;
  margin-right: 8px;
}
.input_field:focus {
  outline: none;
}
.wallet_address {
  background: #393939;
  color: #ffffff;
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
.logout_btn {
  margin-right: 15px;
}
</style>
<template>
  <button @click="open = true" class="btn login_btn">Login</button>

  <Teleport to="body">
    <div v-if="open" class="login_div">
      <p class="text">Upload Keyfile</p>
      <div class="key_file_div">
        <input type="file" id="key_file" accept=".json" />
      </div>
      <button @click="upload" class="btn popup_btn">Upload</button>
      <hr class="line_separator" />
      <p class="text">Generate Keyfile</p>
      <button @click="generate" class="btn popup_btn">Create</button>
    </div>
    <div v-if="open" class="outside_div" @click="open = false"></div>
  </Teleport>
</template>

<script>
import API from "../api/api";

export default {
  name: "Login",
  data() {
    return {
      open: false,
    };
  },
  emits: ["loginSuccessful"],
  methods: {
    upload() {
      let file = document.getElementById("key_file").files[0];
      API.uploadKeyFile(this, file);
    },
    async generate() {
      await API.generate();
    },
  },
};
</script>

<style scoped>
.login_div {
  position: absolute;
  padding: 5px;
  display: block;

  /* centers the login box */
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;

  /* border: 1px solid black; */
  border-radius: 5px;
  background-color: #474747;

  width: 400px;
  height: 300px;
  z-index: 999;
}
.line_separator {
  width: 92%;
  margin: 0px auto 20px;
  height: 1px;
  border: none;
  background-color: #000;
  border-color: #000;
  display: block;
}
.key_file_div {
  margin-left: 18%;
  text-align: center;
  margin-bottom: 20px;
}
.text {
  background-color: #474747;
  color: #ffffff;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
.popup_btn {
  display: block;
  background-color: #333333;
  margin: 0px auto 20px;
  width: 30%;
  padding: 8px 0px;
}
.login_btn {
  background-color: transparent;
  color:black;
  margin-right: 15px;
}
.outside_div {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 998;
}
</style>
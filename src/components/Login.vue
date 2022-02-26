<template>
  <button @click="open = true">Open Modal</button>

  <Teleport to="body">
    <div v-if="open" class="login_div">
      <p class="text" style="margin-top: 20px">Upload Keyfile</p>
      <!-- <hr class="break" /> -->
      <div class="key_file_div">
        <input type="file" id="key_file" accept=".json" />
      </div>
      <!-- <break /> -->
      <button @click="open = false" class="btn">Login</button>
      <hr class="line_separator" />
      <!-- <break /> -->
      <p class="text">Generate Keyfile</p>
      <!-- <break /> -->
      <button @click="generate" class="btn">Create Account</button>
    </div>
    <div v-if="open" class="outside_div" @click="open = false"></div>
  </Teleport>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      open: false,
    };
  },
  methods: {
    login() {
      // let file = document.getElementById("key_file").files[0];
      console.log("login");
    },
    generate() {
      console.log("hello");
    },
  },
};
</script>

<style scoped>
.outside_div {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: -1;
}
.login_div {
  position: absolute;
  padding: 5px;
  /* flex-flow: wrap; */
  /* justify-content: space-between; */
  display: block;

  /* centers the login box */
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;

  border: 1px solid black;
  border-radius: 5px;
  background-color: cadetblue;

  width: 400px;
  height: 300px;
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
  text-align: center;
  margin-bottom: 20px;
}
.btn {
  display: block;
  width: 30%;
  background: #000;
  color: #fff;
  border: none;
  padding: 8px 0px;
  margin: 0px auto 20px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 12px;
  font-family: inherit;
}
.btn:focus {
  outline: none;
}
.btn:active {
  transform: scale(0.98);
}
</style>
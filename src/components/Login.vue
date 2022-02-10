<template>
  <div class="login_div">
    <p>Upload Keyfile</p>
    <break />
    <div class="special_div">
      <input type="file" id="key_file" accept=".json" />
    </div>
    <break />
    <button @click="login" class="btn">Login</button>
    <hr class="line_separator" />
    <break />
    <p>Generate Keyfile</p>
    <break />
    <button @click="generate" class="btn">Create Account</button>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {},
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
.login_div break {
  width: 100%;
  padding-top: 2.5px;
}
.login_div {
  display: flex;
  padding: 5px;
  flex-flow: wrap;
  justify-content: center;

  border: 1px solid black;
  border-radius: 5px;

  max-width: 400px;
  max-height: 300px;
}
.line_separator {
  width: 92%;
  margin-top: 10px;
}
.special_div {
  margin-left: 18%;
}
.btn {
  display: inline-block;
  background: #000;
  color: #fff;
  border: none;
  padding: 5px 10px;
  margin: 5px;
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
.btn-block {
  display: block;
  width: 100%;
}
</style>
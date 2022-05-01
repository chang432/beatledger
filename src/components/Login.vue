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
      if (file != null) {
        this.open = false;

        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async (f) => {
          try {
            var fileContent = JSON.parse(f.target.result);
            var addy = await API.ar.wallets.getAddress(fileContent);
            var kf = {
              public_key: addy,
              private_key: fileContent,
            };
            this.$emit("loginSuccessful", kf);
          } catch (err) {
            console.error(err);
          }
        };
      } else {
        alert("Key File not Uploaded");
      }
    },
    async generate() {
      API.ar.wallets.generate().then(async (key) => {
        console.log(JSON.stringify(key));
        var public_key = await API.ar.wallets.getAddress(key);
        var filename = "arweave-key-" + public_key + ".json";
        var file = new Blob([JSON.stringify(key)], { type: JSON });
        if (window.navigator.msSaveOrOpenBlob)
          // IE10+
          window.navigator.msSaveOrOpenBlob(file, filename);
        else {
          // Others
          var a = document.createElement("a"),
            url = URL.createObjectURL(file);
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 0);
        }
      });
    },
  },
};
</script>

<style scoped>
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
  background-color: #1f1f1f;
  margin-right: 30px;
}
.outside_div {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 998;
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

  /* border: 1px solid black; */
  border-radius: 5px;
  background-color: #474747;

  width: 400px;
  height: 300px;
  z-index: 999;
}
</style>
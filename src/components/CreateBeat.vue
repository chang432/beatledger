<template>
  <div>
    <button @click="test" class="btn beat_btn">Create Beat</button>

    <Teleport to="body">
      <div v-if="open" class="beat_div">
        <form @submit="sendTxWithText">
          <label for="fname">Beat Name</label>
          <input type="text" v-model="beat_name" id="fname" name="firstname" />

          <label for="lname">Note</label>
          <input type="text" v-model="note" id="lname" name="lastname" />

          <div>
            <p style="display: inline-block">Mp3:</p>
            <input
              style="display: inline-block"
              type="file"
              id="real_audio_file"
              accept="audio/*"
            />
          </div>

          <input type="submit" value="submit" />
        </form>
      </div>
      <div v-if="open" class="outside_div" @click="open = false"></div>
    </Teleport>
  </div>
</template> 

<script>
import { mapActions } from "vuex";
import API from "../api/api";

export default {
  name: "CreateBeat",
  data() {
    return {
      open: false,
      beat_name: "",
      note: "",
    };
  },
  props: {
    keyFile: Object,
  },
  methods: {
    ...mapActions(["uploadBeat"]),
    async test(e) {
      e.preventDefault();
      this.open = true;
    },
    async sendTxWithText(e) {
      e.preventDefault();

      // validate length
      // if (!withinMaxLength) {
      //   alert("Please specify a beat name less than X characters");
      //   return;
      // }

      // validate characters?

      const isUnique = await API.isUniqueBeatName(this.beat_name);
      if (!isUnique) {
        alert("Please specify an original beat name");
        return;
      }

      await this.uploadBeat({
        public_key: this.keyFile.public_key,
        private_key: this.keyFile.private_key,
        beat_name: this.beat_name,
        note: this.note,
      }).then(() => {
        if (this.$store.state.uploadBeatComplete) {
          this.open = false;
          alert(
            "Beat successfully uploaded, please wait for some time for it to be confirmed and uploaded to the network!"
          );
        }
      });
    },
  },
};
</script>

<style scoped>
input[type="text"],
select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type="submit"] {
  width: 100%;
  background-color: #4caf50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input[type="submit"]:hover {
  background-color: #45a049;
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
.popup_btn {
  margin: 0px auto 20px;
  width: 30%;
  padding: 8px 0px;
}
.beat_btn {
  padding: 6px 8px;
  margin-right: 8px;
}
.btn {
  display: block;
  background: #000;
  color: #fff;
  border: none;
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
.outside_div {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 998;
}
.beat_div {
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
  z-index: 999;
}
</style>
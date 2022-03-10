<template>
  <button @click="test" class="btn beat_btn">Create Beat</button>

  <Teleport to="body">
    <div v-if="open" class="beat_div">
      <form @submit="sendTxWithText1">
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
</template>

<script>
import Arweave from "arweave";

const ar_one = Arweave.init({
  host: "localhost",
  port: 1984,
  protocol: "http",
});

export default {
  name: "CreateBeat",
  props: {
    keyFile: {
      w_address: String,
      w_private_key: Object,
    },
  },
  data() {
    return {
      open: false,
      beat_name: "",
      note: "",
    };
  },
  methods: {
    async test(e) {
      e.preventDefault();
      this.open = true;
    },
    async sendTxWithText1(e) {
      e.preventDefault();
      const publicKey = this.keyFile.w_address;
      const privateKey = this.keyFile.w_private_key;
      const beat_name = this.beat_name;
      const note = this.note;

      console.log(document.getElementById("real_audio_file").files);
      let real_file = document.getElementById("real_audio_file").files[0];
      console.log("real audio file: " + real_file);
      const frr = new FileReader();
      frr.readAsArrayBuffer(real_file);
      frr.onload = async function () {
        var arrayBufferOne = frr.result;

        var walletAddress = publicKey;
        console.log("wallet address: " + walletAddress);
        console.log("private key: " + privateKey);
        // var walletAddress = "COXrqeUGtPaDUZIeTCwuG6jH7F6jw8trS9bgNhtb2-k";

        await ar_one.api.get("mint/" + walletAddress + "/10000000000000000");

        let transaction = await ar_one.createTransaction(
          {
            data: arrayBufferOne,
          },
          privateKey
        );
        transaction.addTag("Content-Type", "text/mpeg");
        transaction.addTag("App-Name", "BeatLedger");
        transaction.addTag("Name", beat_name);
        transaction.addTag("Note", note);

        await ar_one.transactions.sign(transaction, privateKey);

        let uploader = await ar_one.transactions.getUploader(transaction);

        while (!uploader.isComplete) {
          await uploader.uploadChunk();
          console.log(
            `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
          );
        }

        console.log("Tx successfully sent!");
      };
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
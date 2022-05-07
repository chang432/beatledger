<template>
  <div class="main">
    <div class="header_label">
      <p class="header_label_child">Name</p>
      <p class="header_label_child">Note</p>
      <p class="header_label_child flex_grow_big">Beat Id</p>
      <p class="header_label_child flex_grow_big">Author Id</p>
    </div>
    <div class="spinner" v-if="showLoader">
      <fa :icon="['fa', 'spinner']" size="2x" class="fa-spin" />
    </div>
    <div :key="beat.tx_id" v-for="beat in beats">
      <BeatModule @playPauseEvent="playPauseLogic" :beat="beat" />
    </div>
    <form @submit="sendTxWithText" class="add-form">
      <div>
        <label>Beat Name:</label>
        <input type="text" v-model="beat_name" name="beat_name" />
      </div>
      <div>
        <label>Note:</label>
        <input type="text" v-model="note" name="note" />
      </div>
      <div>
        <p style="display: inline-block">Mp3:</p>
        <input
          style="display: inline-block"
          type="file"
          id="audio_file"
          accept="audio/*"
        />
      </div>
      <input type="submit" value="submit" />
    </form>
    <audio id="audio_player1" />
  </div>
</template>

<script>
import BeatModule from "./Beat";
import ArDB from "ardb";
import API from "../api/api";

export default {
  name: "BeatList",
  data() {
    return {
      ardb: null,
      beats: [],
      beat_name: "",
      note: "",
      showLoader: false,
    };
  },
  components: {
    BeatModule,
  },
  methods: {
    getTxData(beat_id) {
      return new Promise((resolve) => {
        API.ar.transactions.getData(beat_id, { decode: true }).then((data) => {
          // data is Uint8Array
          const blob = new Blob([data], {
            type: "audio/mpeg",
          });
          resolve(blob);
        });
      });
    },
    async searchLoad(searchEntry) {
      this.showLoader = true;
      this.beats = await API.queryAllBeatsFiltered(searchEntry);
      this.showLoader = false;
    },
    async defaultLoad() {
      this.showLoader = true;
      this.beats = await API.queryAllBeats();
      this.showLoader = false;
      console.log("Website successfully refreshed");
    },
    playMp3Logic() {
      let file = document.getElementById("audio_file").files[0];

      // get bytes size of mp3
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = async function () {
        var arrayBuffer = this.result;
        console.log(arrayBuffer);
        console.log(arrayBuffer.byteLength);

        console.log(arrayBuffer);
        const blob = new Blob([arrayBuffer]);
        var url = URL.createObjectURL(blob);
        let audio_player = document.getElementById("audio_player1");
        audio_player.src = url;
        console.log(url);
        audio_player.play();
      };
    },
    async sendTxWithText(e) {
      e.preventDefault();

      let beat_name = this.beat_name;
      let note = this.note;

      let file1 = document.getElementById("audio_file").files[0];
      const fr = new FileReader();
      fr.readAsArrayBuffer(file1);
      fr.onload = async function () {
        var arrayBuffer = fr.result;
        console.log(arrayBuffer);

        var wallet = await API.ar.wallets.generate();

        var walletAddress = await API.ar.wallets.getAddress(wallet);
        await API.ar.api.get("mint/" + walletAddress + "/10000000000000000");

        let transaction = await API.ar.createTransaction(
          {
            data: arrayBuffer,
          },
          wallet
        );
        transaction.addTag("Content-Type", "text/mpeg");
        transaction.addTag("App-Name", "BeatLedger");
        transaction.addTag("Name", beat_name);
        transaction.addTag("Note", note);

        await API.ar.transactions.sign(transaction, wallet);

        let uploader = await API.ar.transactions.getUploader(transaction);

        while (!uploader.isComplete) {
          await uploader.uploadChunk();
          console.log(
            `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
          );
        }

        console.log("Tx successfully sent!");
      };
    },
    playPauseLogic(event) {
      console.log("playPauseRefresh");
      var new_beats = [];

      for (const beat of this.beats) {
        if (beat.tx_id == event.beat.tx_id) {
          if (beat.playPauseState == "faPauseComponent") {
            beat.playPauseState = "faPlayComponent";
          } else {
            beat.playPauseState = "faPauseComponent";
          }
        } else {
          beat.playPauseState = "faPlayComponent";
        }
        new_beats.push(beat);
      }

      this.beats = new_beats;
    },
    viewTxId(tx_id) {
      // window.open("https://viewblock.io/arweave/tx/" + tx_id);
      window.open("http://localhost:1984/tx/" + tx_id);
    },
    viewOwnerAddress(owner_address) {
      // window.open("https://viewblock.io/arweave/address/" + owner_address);
      window.open("http://localhost:1984/wallet/" + owner_address + "/balance");
    },
  },
  async mounted() {
    this.defaultLoad();
  },
  created() {
    this.ardb = new ArDB(API.ar);
  },
};
</script>

<style scoped>
.header_label {
  display: flex;
  margin: 5px 10px;
}
.header_label_child {
  color: #ffffff;
  font-size: 12px;
  font-family: "Roboto", sans-serif;
  flex: 1 1 0;
}
.flex_grow_big {
  flex: 2 1 0;
}
.spinner {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
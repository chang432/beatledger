<template>
  <div>
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
    <button @click="test_txs_no_data">hmm</button>
  </div>
</template>

<script>
import BeatModule from "./Beat";
import Arweave from "arweave";
import ArDB from "ardb";

// test gateway for Arlocal
const arweave = Arweave.init({
  host: "localhost",
  port: 1984,
  protocol: "http",
});

const ardb = new ArDB(arweave);

export default {
  name: "BeatList",
  data() {
    return {
      beats: [],
      beat_name: "",
      note: "",
      mp3: "",
    };
  },
  components: {
    BeatModule,
  },
  methods: {
    getTxData(beat_id) {
      return new Promise((resolve) => {
        arweave.transactions.getData(beat_id, { decode: true }).then((data) => {
          // data is Uint8Array
          const blob = new Blob([data], {
            type: "audio/mpeg",
          });
          resolve(blob);
        });
      });
    },
    refresh() {
      var new_beats = [];

      new Promise((resolve) => {
        ardb
          .search("transactions")
          .appName("BeatLedger")
          .find()
          .then((txs) => {
            resolve(txs);
          });
      })
        .then((txs) => {
          for (const tx of txs) {
            let new_beat = {
              name: tx.tags[2].value,
              tx_id: tx.id,
              owner_address: tx.owner.address,
              note: tx.tags[3].value,
              playPauseState: "faPlayComponent",
            };
            new_beats.push(new_beat);
          }
          return new_beats;
        })
        .then((new_beats) => {
          Promise.all(
            new_beats.map(async (obj) => {
              obj.blob = await this.getTxData(obj.tx_id);
              return obj;
            })
          ).then((new_beats) => {
            this.beats = new_beats;
          });
        });

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

        var wallet = await arweave.wallets.generate();

        var walletAddress = await arweave.wallets.getAddress(wallet);
        await arweave.api.get("mint/" + walletAddress + "/10000000000000000");

        let transaction = await arweave.createTransaction(
          {
            data: arrayBuffer,
          },
          wallet
        );
        transaction.addTag("Content-Type", "text/mpeg");
        transaction.addTag("App-Name", "BeatLedger");
        transaction.addTag("Name", beat_name);
        transaction.addTag("Note", note);

        await arweave.transactions.sign(transaction, wallet);
        await arweave.transactions.post(transaction);

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
    async fetchBeats() {
      const res = await fetch("http://localhost:5000/beats");
      const data = await res.json();

      return data;
    },
  },
  async mounted() {
    this.refresh();
  },
};
</script>

<style scoped>
</style>
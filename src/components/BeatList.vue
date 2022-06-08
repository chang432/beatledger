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
    <form @submit="uploadBeatTest" class="add-form">
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
    <button @click="uploadBeatsTestMany">Multi Upload</button>
    <audio id="audio_player1" />
    <button @click="testQueryBeatsWithCursors">query beat with cursors</button>
    <v-pagination
      class="pagination"
      v-if="isProductionQuery"
      v-model="page"
      :pages="total_pages"
      :range-size="1"
      active-color="#ffffff"
      @update:modelValue="pageChangeTrigger"
    />
  </div>
</template>

<script>
import BeatModule from "./Beat";
import API from "../api/api";
import logger from "../utilities/logger";

export default {
  name: "BeatList",
  data() {
    return {
      ardb: null,
      beats: [],
      beat_name: "",
      note: "",
      showLoader: false,
      page: 1,
      total_pages: 0,
      isProductionQuery: false,
    };
  },
  components: {
    BeatModule,
  },
  methods: {
    testQueryBeatsWithCursors() {
      API.queryBeatsWithCursor();
      logger.log("cursors: " + JSON.stringify(this.$store.state.cursors));
    },
    async searchLoad(searchEntry) {
      this.showLoader = true;
      this.beats = await API.queryAllBeatsFiltered(searchEntry);
      this.showLoader = false;
    },
    async defaultLoad() {
      this.showLoader = true;

      if (!logger.isProductionQuery) {
        // test query
        logger.log("test beats query starting", "header");
        this.beats = await API.queryAllBeatsArdb();
      } else {
        // real query
        logger.log("real beats query starting", "header");
        await API.queryCursors();

        this.total_pages = this.$store.state.totalPages;
        let cursors = this.$store.state.cursors;

        await API.queryBeatsWithCursor(cursors[this.page - 1]);

        logger.log("total beats: ", this.$store.state.totalBeats);
      }

      logger.log("query finished", "header");
      this.showLoader = false;
    },
    playMp3Logic() {
      let file = document.getElementById("audio_file").files[0];

      // get bytes size of mp3
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = async function () {
        var arrayBuffer = this.result;
        logger.log(arrayBuffer);
        logger.log(arrayBuffer.byteLength);

        logger.log(arrayBuffer);
        const blob = new Blob([arrayBuffer]);
        var url = URL.createObjectURL(blob);
        let audio_player = document.getElementById("audio_player1");
        audio_player.src = url;
        logger.log(url);
        audio_player.play();
      };
    },
    async uploadBeatTest(e) {
      e.preventDefault();

      let beat_name = this.beat_name;
      let note = this.note;

      let file1 = document.getElementById("audio_file").files[0];
      const fr = new FileReader();
      fr.readAsArrayBuffer(file1);
      fr.onload = async function () {
        var arrayBuffer = fr.result;
        await API.uploadBeatTest(beat_name, note, arrayBuffer);
      };
    },
    async uploadBeatsTestMany() {
      let fileHandle;

      // open file picker
      [fileHandle] = await window.showOpenFilePicker();

      const fileData = await fileHandle.getFile();

      const fr = new FileReader();
      fr.readAsArrayBuffer(fileData);
      fr.onload = async function () {
        API.uploadBeatsTestMany(fr.result);
      };
    },
    playPauseLogic(event) {
      logger.log("playPauseRefresh");
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
    pageChangeTrigger(new_page) {
      logger.log(`Changing to page: ${new_page}`);
      this.defaultLoad();
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
    this.isProductionQuery = logger.isProductionQuery;
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
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
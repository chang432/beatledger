<template>
  <div class="beatentry">
    <div class="beat_top_section">
      <div class="beat_top_section_child">
        <p class="beat_name">{{ beat.name }}</p>
      </div>
      <div class="beat_top_section_child">
        <p class="beat_note">{{ beat.note }}</p>
      </div>
      <div class="beat_top_section_child_bigger">
        <p @click="viewTxId(beat.tx_id)" class="tx_address">
          {{ beat.tx_id }}
        </p>
      </div>
      <div class="beat_top_section_child_bigger">
        <p @click="viewOwnerAddress(beat.owner_address)" class="owner_address">
          {{ beat.owner_address }}
        </p>
      </div>
    </div>
    <div class="bot_section">
      <component
        @click="togglePlayPause()"
        :is="beat.playPauseState"
      ></component>
      <p>MUSIC_PLAYER_HERE</p>
    </div>
    <audio id="beat_player" />
  </div>
</template>

<script>
const faPlayComponent = {
  template: '<fa icon="play"></fa>',
};

const faPauseComponent = {
  template: '<fa icon="pause"></fa>',
};

export default {
  name: "Beat",
  props: {
    beat: Object,
  },
  data() {
    return {};
  },
  components: {
    faPlayComponent,
    faPauseComponent,
  },
  methods: {
    togglePlayPause() {
      // audio logic
      var url = URL.createObjectURL(this.beat.blob);
      let audio_player = document.getElementById("beat_player");
      audio_player.src = url;

      if (this.beat.playPauseState == "faPlayComponent") {
        audio_player.play();
      } else {
        audio_player.pause();
      }

      this.$emit("playPauseEvent", this);
    },
  },
};
</script>

<style scoped>
.beatentry {
  margin: 0px 3px 3px;
  padding: 10px;
  background-color: #474747;
}
.beat_top_section {
  white-space: nowrap;
  overflow: hidden;
  display: flex;
}
.beat_top_section_child {
  flex: 1 1 0;
}
.beat_top_section_child_bigger {
  flex: 2 1 0;
}
.tx_address {
  display: inline-block;
  background: #b1a9a9;
  padding-left: 4px;
  padding-right: 4px;
  border-radius: 5px;
  cursor: pointer;
}
.by_separator {
  display: inline-block;
  margin-left: 8px;
  margin-right: 8px;
}
.owner_address {
  display: inline-block;
  background: #b1a9a9;
  padding-left: 4px;
  padding-right: 4px;
  border-radius: 5px;
  cursor: pointer;
}

.bot_section {
  /* background: #b1a9a9; */
  margin-top: 10px;
  white-space: nowrap;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
}
.play_icon {
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}
.beat_name {
  display: inline-block;
  padding-right: 4px;
}
.beat_note {
  display: inline-block;
}
</style>
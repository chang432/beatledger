<template>
  <div class="main">
    <BeatList ref="beatListComponent" />
  </div>
</template>

<script>
import BeatList from "../components/BeatList.vue";

export default {
  name: "Main",
  components: {
    BeatList,
  },
  data() {
    return {};
  },
  methods: {
    continueChain1({ showSearch, searchContent }) {
      if (showSearch) {
        this.$refs.beatListComponent.searchLoad(searchContent);
      } else {
        this.$refs.beatListComponent.defaultLoad();
      }
    },
  },
};
</script>

<style>
</style>
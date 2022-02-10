<template>
  <div>
    <div class="main">
      <BeatList />
    </div>
    <div>
      <Login />
    </div>
  </div>
</template>

<script>
import BeatList from "../components/BeatList.vue";
import Login from "../components/Login.vue";

export default {
  name: "Main",
  components: {
    BeatList,
    Login,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style>
</style>
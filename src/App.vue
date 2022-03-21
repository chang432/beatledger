<template>
  <div>
    <Header @continueChain="continueChain" />
    <router-view v-slot="{ Component }">
      <component ref="mainComponent" :is="Component" />
    </router-view>
    <Footer />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
  data() {
    return {};
  },
  methods: {
    continueChain(payload) {
      this.$refs.mainComponent.$.ctx.continueChain1(payload);
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap");
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: "Poppins", sans-serif;
}
.sub_header {
  display: flex;
  align-items: flex-end;
}
.title {
  margin-left: 10px;
  margin-right: 15px;
}
.about {
  margin-bottom: 5px;
}
.login {
  margin-right: 10px;
  margin-bottom: 5px;
}
</style>

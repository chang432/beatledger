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
@import url("https://fonts.googleapis.com/css2?family=Righteous&display=swap");
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: "Righteous", cursive;
}
.btn {
  font-size: 20px;
  text-decoration: none;
  color: #ffffff;
  font-family: "Righteous", cursive;
  cursor: pointer;
  border: none;
}
.btn:active {
  transform: scale(0.98);
}
</style>

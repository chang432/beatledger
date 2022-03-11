import { createStore } from "vuex";

export default createStore({
  state () {
    return {
      isLoggedIn: false,
      w_public_key: "",
      w_private_key: Object,
    }
  },
  mutations: {
    setIsLoggedIn (state, status) {
      state.isLoggedIn = status
    },
    setPublicKey (state, newPublicKey) {
      state.w_public_key = newPublicKey
    },
    setPrivateKey (state, newPrivateKey) {
      state.w_private_key = newPrivateKey
    }
  }
})

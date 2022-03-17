import { createStore } from "vuex";
import Arweave from "arweave";

const ar = Arweave.init({
  host: "localhost",
  port: 1984,
  protocol: "http",
});

export default createStore({
  state () {
    return {
      uploadStatus: 'Await',
      uploadBeatComplete: false,
    }
  },
  mutations: {
    setUploadStatus (state, newStatus) {
      state.uploadStatus = newStatus
    },
    setUploadBeatComplete (state, newStatus) {
      state.uploadBeatComplete = newStatus
    },
  },
  actions: {
    async uploadBeat ({ commit }, data) {
      commit("setUploadBeatComplete", false)

      const public_key = data.public_key;
      const private_key = data.private_key;
      const beat_name = data.beat_name;
      const note = data.note;

      let real_file = document.getElementById("real_audio_file").files[0];

      await new Promise((resolve) => {
        const fr = new FileReader();
        fr.readAsArrayBuffer(real_file);
        fr.onload = async function () {
          var arrayBufferOne = fr.result;

          var walletAddress = public_key;

          await ar.api.get("mint/" + walletAddress + "/10000000000000000");

          let transaction = await ar.createTransaction(
            {
              data: arrayBufferOne,
            },
            private_key
          );
          transaction.addTag("Content-Type", "text/mpeg");
          transaction.addTag("App-Name", "BeatLedger");
          transaction.addTag("Name", beat_name);
          transaction.addTag("Note", note);

          await ar.transactions.sign(transaction, private_key);

          let uploader = await ar.transactions.getUploader(transaction);

          while (!uploader.isComplete) {
            await uploader.uploadChunk();
            commit("setUploadStatus", `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`)
          }

          commit("setUploadBeatComplete", true)
          resolve()
          console.log("Tx successfully sent!");
        };
      });
    },
  }
})

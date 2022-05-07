// const arweave = require('./arweave').default
const Ar = require('arweave').default
const ArDB = require('ardb').default

const ar = Ar.init({
  host: "localhost",
  port: 1984,
  protocol: "http",
});

const ardb = new ArDB(ar);

const API = {
  ar: ar,

  isUniqueBeatName (beat_name) {
    return new Promise((resolve, reject) => {
      // Filter by beat owner
      ardb
        .search("transactions")
        .appName("BeatLedger")
        .tag("Name", beat_name)
        .findAll()
        .then((txs) => {
          if (txs.length > 0) {
            resolve(false);
          } else {
            resolve(true);
          }
        }).catch((err) => {
          reject(err)
        })
    })
  },

  async getTxData (beat_id) {
    return new Promise((resolve) => {
      ar.transactions.getData(beat_id, { decode: true }).then((data) => {
        // data is Uint8Array
        const blob = new Blob([data], {
          type: "audio/mpeg",
        });
        resolve(blob);
      });
    });
  },

  async queryAllBeats () {
    var new_beats = [];

    const query_beats = await new Promise((resolve) => {
      ardb
        .search("transactions")
        .appName("BeatLedger")
        .findAll()
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
      .catch(err => { console.log(err) });

    return new Promise((resolve) => {
      Promise.all(
        query_beats.map(async (obj) => {
          // console.log(obj);
          obj.blob = await this.getTxData(obj.tx_id);
          return obj;
        })
      ).then((new_beats) => {
        resolve(new_beats);
      });
    })
  },

  async queryAllBeatsFiltered (searchEntry) {
    var new_beats = [];

    const queryByBeatOwner = await new Promise((resolve) => {
      // Filter by beat owner
      ardb
        .search("transactions")
        .appName("BeatLedger")
        .from(searchEntry)
        .findAll()
        .then((txs) => {
          resolve(txs);
        });
    });

    const queryByBeatName = await new Promise((resolve) => {
      // Filter by beat name
      ardb
        .search("transactions")
        .appName("BeatLedger")
        .tag("Name", searchEntry)
        .findAll()
        .then((txs) => {
          resolve(txs);
        });
    });

    return await new Promise((resolve) => {
      Promise.all([queryByBeatOwner, queryByBeatName])
        .then((combined_txs) => {
          for (const tx_arr of combined_txs) {
            for (const tx of tx_arr) {
              let new_beat = {
                name: tx.tags[2].value,
                tx_id: tx.id,
                owner_address: tx.owner.address,
                note: tx.tags[3].value,
                playPauseState: "faPlayComponent",
              };
              new_beats.push(new_beat);
            }
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
            resolve(new_beats)
          });
        });
    })

  },

  async uploadBeatTest (beat_name, note, arrayBuffer) {
    // var arrayBuffer = fr.result;
    console.log(arrayBuffer);

    var wallet = await ar.wallets.generate();

    var walletAddress = await ar.wallets.getAddress(wallet);
    await ar.api.get("mint/" + walletAddress + "/10000000000000000");

    let transaction = await ar.createTransaction(
      {
        data: arrayBuffer,
      },
      wallet
    );
    transaction.addTag("Content-Type", "text/mpeg");
    transaction.addTag("App-Name", "BeatLedger");
    transaction.addTag("Name", beat_name);
    transaction.addTag("Note", note);

    await ar.transactions.sign(transaction, wallet);

    let uploader = await ar.transactions.getUploader(transaction);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(
        `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
      );
    }

    console.log("Tx successfully sent!");
  },

  async generate () {
    ar.wallets.generate().then(async (key) => {
      console.log(JSON.stringify(key));
      var public_key = await ar.wallets.getAddress(key);
      var filename = "arweave-key-" + public_key + ".json";
      var file = new Blob([JSON.stringify(key)], { type: JSON });
      if (window.navigator.msSaveOrOpenBlob)
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
      else {
        // Others
        var a = document.createElement("a"),
          url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      }
    });
  },

  async uploadKeyFile (instance, file) {
    if (file != null) {
      this.open = false;

      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = async (f) => {
        try {
          var fileContent = JSON.parse(f.target.result);
          var addy = await ar.wallets.getAddress(fileContent);
          var kf = {
            public_key: addy,
            private_key: fileContent,
          };
          instance.$emit("loginSuccessful", kf);
        } catch (err) {
          console.error(err);
        }
      };
    } else {
      alert("Key File not Uploaded");
    }
  }
}

export default API

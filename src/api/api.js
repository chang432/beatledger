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
  }
}

export default API

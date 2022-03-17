// const arweave = require('./arweave').default
const Ar = require('arweave').default

const ar = Ar.init({
  host: "localhost",
  port: 1984,
  protocol: "http",
});

const API = {
  // arweave: arweave,
  ar: ar
}

export default API

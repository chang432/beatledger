var fs = require('fs');
const Arweave = require('arweave');
const { default: ArLocal } = require("arlocal");

(async () => {
  let port = 1985;
  let arlocal = new ArLocal(port);
  await arlocal.start();
  const arweave_test = Arweave.init({
    host: "127.0.0.1",
    port,
    protocol: "http",
  });
  const wallet = await arweave_test.wallets.generate();
  const walletAddress = await arweave_test.wallets.getAddress(wallet);
  await arweave_test.api.get(
    "mint/" + walletAddress + "/10000000000000000"
  );
  const data = await fs.promises.readFile(`${process.cwd()}/cold-feet.mp3`)
  const transaction = await arweave_test.createTransaction(
    {
      data,
    },
    wallet
  );
  transaction.addTag("Content-Type", "audio/mpeg");
  await arweave_test.transactions.sign(transaction, wallet);
  await arweave_test.transactions.post(transaction);
  const txData = await arweave_test.transactions.getData(transaction.id, {
    decode: true,
  });
  console.log("txData: " + txData);
  console.log("---------------");
  console.log("data: " + arrayBuffer);

  await arlocal.stop();
})();
import Client from "bitcoin-core";
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Endereço do front-end (ajuste conforme necessário)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const client = new Client({
  network: "testnet",
  username: "polaruser",
  password: "polarpass",
  host: "54.211.151.85",
  port: 18443,
});

app.get("/block/:blockNumber", async (req, res) => {
  const { blockNumber } = req.params;
  try {
    const blockHash = await client.command(
      "getblockhash",
      parseInt(blockNumber)
    );
    const block = await client.command("getblock", blockHash);
    res.json(block);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/transaction/:txid", async (req, res) => {
  const { txid } = req.params;
  try {
    const transaction = await client.command("gettransaction", txid);
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Consultar status do nó
app.get("/node-status", async (req, res) => {
  try {
    const info = await client.command("getblockchaininfo");
    const networkInfo = await client.command("getnetworkinfo");
    res.json({ ...info, ...networkInfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 1. Gerar uma nova carteira
app.post("/create-wallet", async (req, res) => {
  const { label } = req.body;
  try {
    const address = await client.command("getnewaddress", label);
    res.json({ label, address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Listar todas as carteiras geradas (endereços)
app.get("/list-wallets", async (req, res) => {
  try {
    const wallets = await client.command("listlabels");
    const result = await Promise.all(
      wallets.map(async (label) => {
        const addresses = await client.command("getaddressesbylabel", label);
        return { label, addresses: Object.keys(addresses) };
      })
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Enviar Bitcoins
app.post("/send", async (req, res) => {
  const { fromAddress, toAddress, amount } = req.body;
  try {
    const utxos = await client.command("listunspent", 1, 9999999, [
      fromAddress,
    ]);
    const balance = utxos.reduce((sum, utxo) => sum + utxo.amount, 0);

    if (balance < amount) {
      throw new Error("Insufficient funds");
    }

    const inputs = utxos.map((utxo) => ({
      txid: utxo.txid,
      vout: utxo.vout,
    }));

    const outputs = {};
    outputs[toAddress] = amount;
    const fee = 0.0001;
    if (balance > amount + fee) {
      outputs[fromAddress] = balance - amount - fee;
    }

    const rawTx = await client.command("createrawtransaction", inputs, outputs);
    const signedTx = await client.command(
      "signrawtransactionwithwallet",
      rawTx
    );
    const txId = await client.command("sendrawtransaction", signedTx.hex);

    res.json({ txId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Minerar Blocos
app.post("/mine-blocks", async (req, res) => {
  const { numBlocks } = req.body;
  try {
    // Gera um endereço para receber a recompensa
    const address = await client.command("getnewaddress");

    const newBlocks = await client.command(
      "generatetoaddress",
      numBlocks,
      address
    );
    res.json({ minedBlocks: newBlocks, rewardAddress: address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/add-funds", async (req, res) => {
  const { address, numBlocks } = req.body;

  if (!address || !numBlocks) {
    return res.status(400).json({
      error: "É necessário fornecer o endereço e o número de blocos a minerar.",
    });
  }

  try {
    const newBlocks = await client.command(
      "generatetoaddress",
      numBlocks,
      address
    );
    res.json({
      message: `Minerados ${numBlocks} blocos. Recompensa enviada para o endereço.`,
      minedBlocks: newBlocks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/wallet/:address", async (req, res) => {
  const { address } = req.params;

  if (!address) {
    return res
      .status(400)
      .json({ error: "É necessário fornecer o endereço da carteira." });
  }

  try {
    const utxos = await client.command("listunspent", 1, 9999999, [address]);
    const balance = utxos.reduce((sum, utxo) => sum + utxo.amount, 0);

    const transactions = utxos.map((utxo) => ({
      txid: utxo.txid,
      amount: utxo.amount,
      confirmations: utxo.confirmations,
    }));

    res.json({
      address,
      balance,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

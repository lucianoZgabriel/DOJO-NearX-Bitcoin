import Client from "bitcoin-core";
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Endereço do front-end (ajuste conforme necessário)
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
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
  const { label } = req.body; // Rótulo para identificar a carteira
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
    const wallets = await client.command("listlabels"); // Lista de rótulos
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
  const { address, amount } = req.body; // Para qual endereço e quanto enviar
  try {
    const txId = await client.command("sendtoaddress", address, amount);
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

    // Minerar blocos e enviar recompensas para o endereço gerado
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

// Endpoint para adicionar fundos a uma carteira
app.post("/add-funds", async (req, res) => {
  const { address, numBlocks } = req.body;

  if (!address || !numBlocks) {
    return res.status(400).json({
      error: "É necessário fornecer o endereço e o número de blocos a minerar.",
    });
  }

  try {
    // Minerar blocos e enviar a recompensa para o endereço especificado
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

// Endpoint para consultar informações de uma carteira
app.get("/wallet/:address", async (req, res) => {
  const { address } = req.params;

  if (!address) {
    return res
      .status(400)
      .json({ error: "É necessário fornecer o endereço da carteira." });
  }

  try {
    // Consultar saldo total disponível no endereço
    const utxos = await client.command("listunspent", 1, 9999999, [address]);
    const balance = utxos.reduce((sum, utxo) => sum + utxo.amount, 0);

    // Opcional: Listar transações associadas ao endereço
    const transactions = utxos.map((utxo) => ({
      txid: utxo.txid,
      amount: utxo.amount,
      confirmations: utxo.confirmations,
    }));

    res.json({
      address,
      balance,
      transactions, // Inclui transações associadas ao endereço
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

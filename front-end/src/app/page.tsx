"use client";

import SearchBar from "./components/SearchBar";
import { useState } from "react";
import { fetchBlockByNumber, fetchTransactionById } from "./api/bitcoinApi";

interface Transaction {
  txid: string;
  amount: number;
  confirmations: number;
  time: number;
  details: {
    address: string;
    amount: number;
    category: string;
  }[];
}

interface Block {
  hash: string;
  confirmations: number;
  height: number;
  time: number;
  difficulty: number;
  nTx: number;
  tx: string[];
}

export default function Home() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [type, setType] = useState("");

  const handleBlockSearch = async (query: string) => {
    try {
      setError("");
      const block = await fetchBlockByNumber(parseInt(query));
      setResult(block);
      setType("block");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao buscar bloco. Verifique o número e tente novamente.");
      }
      setResult(null);
    }
  };

  const handleTransactionSearch = async (query: string) => {
    try {
      setError("");
      const transaction = await fetchTransactionById(query);
      setResult(transaction);
      setType("transaction");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Erro ao buscar transação. Verifique o ID da transação e tente novamente.",
        );
      }
      setResult(null);
    }
  };

  const formatBlock = (block: Block) => (
    <div className="space-y-4">
      <p>
        <strong>Hash:</strong> {block.hash}
      </p>
      <p>
        <strong>Confirmações:</strong> {block.confirmations}
      </p>
      <p>
        <strong>Altura:</strong> {block.height}
      </p>
      <p>
        <strong>Data/Hora:</strong>{" "}
        {new Date(block.time * 1000).toLocaleString()}
      </p>
      <p>
        <strong>Dificuldade:</strong> {block.difficulty}
      </p>
      <p>
        <strong>Transações:</strong> {block.nTx}
      </p>
      <div>
        <strong>Transações (IDs):</strong>
        <ul className="list-disc list-inside">
          {block.tx.slice(0, 5).map((tx: string, idx: number) => (
            <li key={idx}>{tx}</li>
          ))}
          {block.tx.length > 5 && <p>... e mais {block.tx.length - 5}.</p>}
        </ul>
      </div>
    </div>
  );

  const formatTransaction = (transaction: Transaction) => (
    <div className="space-y-4">
      <p>
        <strong>ID da Transação:</strong> {transaction.txid}
      </p>
      <p>
        <strong>Valor:</strong> {transaction.amount} BTC
      </p>
      <p>
        <strong>Confirmações:</strong> {transaction.confirmations}
      </p>
      <p>
        <strong>Data/Hora:</strong>{" "}
        {new Date(transaction.time * 1000).toLocaleString()}
      </p>
      <div>
        <strong>Detalhes:</strong>
        <ul className="list-disc list-inside">
          {transaction.details.map(
            (detail: Transaction["details"][0], idx: number) => (
              <li key={idx}>
                Endereço: {detail.address} | Valor: {detail.amount} BTC |
                Categoria: {detail.category}
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        Explorador de Blocos Bitcoin
      </h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Pesquisar Bloco</h2>
        <SearchBar
          placeholder="Digite o número do bloco"
          onSearch={handleBlockSearch}
        />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Pesquisar Transação</h2>
        <SearchBar
          placeholder="Digite o ID da transação"
          onSearch={handleTransactionSearch}
        />
      </section>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 p-4 border rounded bg-dark text-white">
          <h2 className="text-2xl font-bold mb-4">
            {type === "block" ? "Detalhes do Bloco" : "Detalhes da Transação"}
          </h2>
          {type === "block" && formatBlock(result)}
          {type === "transaction" && formatTransaction(result)}
        </div>
      )}
    </div>
  );
}

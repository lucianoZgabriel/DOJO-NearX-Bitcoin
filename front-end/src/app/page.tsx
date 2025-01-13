// src/app/page.tsx
"use client";

import { useState } from "react";
import SearchBar from "./components/common/SearchBar";
import BlockDetails from "./components/blocks/BlockDetails";
import TransactionDetails from "./components/transactions/TransactionDetails";
import ErrorMessage from "./components/common/ErrorMessage";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { blocksApi } from "./api/blocks";
import { transactionsApi } from "./api/transactions";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [searchType, setSearchType] = useState<"block" | "transaction" | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const blockQuery = useQuery({
    queryKey: ["block", searchQuery],
    queryFn: () => blocksApi.getByNumber(parseInt(searchQuery)),
    enabled: searchType === "block" && !!searchQuery,
  });

  const transactionQuery = useQuery({
    queryKey: ["transaction", searchQuery],
    queryFn: () => transactionsApi.getById(searchQuery),
    enabled: searchType === "transaction" && !!searchQuery,
  });

  const handleBlockSearch = (query: string) => {
    setSearchType("block");
    setSearchQuery(query);
  };

  const handleTransactionSearch = (query: string) => {
    setSearchType("transaction");
    setSearchQuery(query);
  };

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

      {/* Block Results */}
      {blockQuery.isLoading && <LoadingSpinner />}
      {blockQuery.error && (
        <ErrorMessage message={(blockQuery.error as Error).message} />
      )}
      {blockQuery.data && (
        <div className="mt-6 p-4 border rounded bg-dark text-white">
          <h2 className="text-2xl font-bold mb-4">Detalhes do Bloco</h2>
          <BlockDetails block={blockQuery.data} />
        </div>
      )}

      {/* Transaction Results */}
      {transactionQuery.isLoading && <LoadingSpinner />}
      {transactionQuery.error && (
        <ErrorMessage message={(transactionQuery.error as Error).message} />
      )}
      {transactionQuery.data && (
        <div className="mt-6 p-4 border rounded bg-dark text-white">
          <h2 className="text-2xl font-bold mb-4">Detalhes da Transação</h2>
          <TransactionDetails transaction={transactionQuery.data} />
        </div>
      )}
    </div>
  );
}

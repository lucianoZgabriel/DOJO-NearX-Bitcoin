// src/app/page.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { nodeApi } from "./api/node";
import { blocksApi } from "./api/blocks";
import { transactionsApi } from "./api/transactions";
import SearchBar from "./components/common/SearchBar";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ErrorMessage from "./components/common/ErrorMessage";
import BlockDetails from "./components/blocks/BlockDetails";
import TransactionDetails from "./components/transactions/TransactionDetails";
import Link from "next/link";
import { Blocks, Wallet, Activity, ArrowRight } from "lucide-react";
import StatCard from "./components/common/StatCard";

export default function Home() {
  const [searchType, setSearchType] = useState<"block" | "transaction" | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: nodeStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ["node-status"],
    queryFn: nodeApi.getStatus,
    refetchInterval: 10000,
  });

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

  const handleSearch = (type: "block" | "transaction") => (query: string) => {
    setSearchType(type);
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-neonGreen to-neonBlue bg-clip-text text-transparent">
            Bitcoin Network Explorer
          </h1>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Explore the Bitcoin network in real-time. Search blocks, track
            transactions, and monitor network statistics.
          </p>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
            <div className="flex flex-col gap-4">
              <SearchBar
                placeholder="Search by block height..."
                onSearch={handleSearch("block")}
              />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 text-sm text-gray-400 bg-dark">or</span>
                </div>
              </div>
              <SearchBar
                placeholder="Search by transaction ID..."
                onSearch={handleSearch("transaction")}
              />
            </div>
          </div>
        </div>
        <div className="mt-8">
          {/* Block Results */}
          {searchType === "block" && (
            <>
              {blockQuery.isLoading && <LoadingSpinner />}
              {blockQuery.error && (
                <ErrorMessage message={(blockQuery.error as Error).message} />
              )}
              {blockQuery.data && (
                <div className="mt-6 p-6 border rounded-xl bg-white/5 backdrop-blur-sm border-white/10 text-left">
                  <h2 className="text-2xl font-bold mb-4">Block Details</h2>
                  <BlockDetails block={blockQuery.data} />
                </div>
              )}
            </>
          )}

          {/* Transaction Results */}
          {searchType === "transaction" && (
            <>
              {transactionQuery.isLoading && <LoadingSpinner />}
              {transactionQuery.error && (
                <ErrorMessage
                  message={(transactionQuery.error as Error).message}
                />
              )}
              {transactionQuery.data && (
                <div className="mt-6 p-6 border rounded-xl bg-white/5 backdrop-blur-sm border-white/10 text-left">
                  <h2 className="text-2xl font-bold mb-4">
                    Transaction Details
                  </h2>
                  <TransactionDetails transaction={transactionQuery.data} />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Network Stats Section */}
      {isLoadingStatus ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : nodeStatus ? (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-8 text-white">
              Network Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Latest Block"
                value={nodeStatus.blocks}
                icon={<Blocks size={24} />}
              />
              <StatCard
                title="Network"
                value={nodeStatus.chain}
                icon={<Activity size={24} />}
              />
              <StatCard
                title="Connections"
                value={nodeStatus.connections}
                icon={<Activity size={24} />}
              />
              <StatCard
                title="Difficulty"
                value={nodeStatus.difficulty}
                icon={<Activity size={24} />}
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* Quick Actions Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-white">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Wallet Management Card */}
            <Link href="/carteiras" className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Wallet className="text-neonGreen" size={24} />
                  <ArrowRight
                    className="text-gray-400 group-hover:text-white transition-colors"
                    size={20}
                  />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Manage Wallets
                </h3>
                <p className="text-gray-400">
                  Create and manage Bitcoin wallets, send transactions, and
                  track balances.
                </p>
              </div>
            </Link>

            {/* Mining Card */}
            <Link href="/mine" className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Blocks className="text-neonGreen" size={24} />
                  <ArrowRight
                    className="text-gray-400 group-hover:text-white transition-colors"
                    size={20}
                  />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Mine Blocks
                </h3>
                <p className="text-gray-400">
                  Mine new blocks on the test network and earn test Bitcoin.
                </p>
              </div>
            </Link>

            {/* Network Status Card */}
            <Link href="/status" className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="text-neonGreen" size={24} />
                  <ArrowRight
                    className="text-gray-400 group-hover:text-white transition-colors"
                    size={20}
                  />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Network Status
                </h3>
                <p className="text-gray-400">
                  Monitor detailed network statistics and performance metrics.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { walletsApi } from "@/app/api/wallets";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/app/components/common/LoadingSpinner";
import ErrorMessage from "@/app/components/common/ErrorMessage";
import WalletActions from "@/app/components/wallets/WalletActions";
import { Wallet as WalletIcon, Plus } from "lucide-react";

interface Wallet {
  label: string;
  addresses: string[];
  balance?: number;
  transactions?: Array<{
    txid: string;
    amount: number;
    confirmations: number;
  }>;
}

export default function WalletsPage() {
  const [newWalletLabel, setNewWalletLabel] = useState("");
  const queryClient = useQueryClient();

  const createWalletMutation = useMutation({
    mutationFn: (label: string) => walletsApi.create(label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      setNewWalletLabel("");
    },
  });

  const {
    data: wallets,
    isLoading,
    error,
  } = useQuery<Wallet[]>({
    queryKey: ["wallets"],
    queryFn: async () => {
      const walletsData = await walletsApi.listAll();
      const walletsWithBalance = await Promise.all(
        walletsData.map(async (wallet: Wallet) => {
          if (wallet.addresses && wallet.addresses.length > 0) {
            try {
              const walletInfo = await walletsApi.getInfo(wallet.addresses[0]);
              return {
                ...wallet,
                balance: walletInfo.balance,
                transactions: walletInfo.transactions,
              };
            } catch (err) {
              console.error(`Error fetching balance for ${wallet.label}:`, err);
              return wallet;
            }
          }
          return wallet;
        }),
      );
      return walletsWithBalance;
    },
  });

  const handleCreateWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newWalletLabel.trim()) {
      createWalletMutation.mutate(newWalletLabel.trim());
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neonGreen to-neonBlue bg-clip-text text-transparent">
            Bitcoin Wallets
          </h1>
          <form onSubmit={handleCreateWallet} className="flex gap-4">
            <input
              type="text"
              value={newWalletLabel}
              onChange={(e) => setNewWalletLabel(e.target.value)}
              placeholder="New wallet name"
              className="px-4 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-gray-400 
                focus:border-neonGreen/50 focus:ring-1 focus:ring-neonGreen/50"
            />
            <button
              type="submit"
              disabled={
                createWalletMutation.isPending || !newWalletLabel.trim()
              }
              className="flex items-center gap-2 bg-neonGreen text-dark px-4 py-2 rounded font-medium 
                hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              {createWalletMutation.isPending ? "Creating..." : "Create Wallet"}
            </button>
          </form>
        </div>

        {/* Mensagem de erro da criação */}
        {createWalletMutation.error && (
          <div className="mb-4">
            <ErrorMessage
              message={(createWalletMutation.error as Error).message}
            />
          </div>
        )}

        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message={(error as Error).message} />}

        {wallets && wallets.length > 0 ? (
          <div className="grid gap-6">
            {wallets.map((wallet) => (
              <div
                key={`${wallet.label}-${wallet.addresses[0]}`}
                className="bg-white/5 rounded-lg border border-white/10 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <WalletIcon className="w-6 h-6 text-neonGreen" />
                      <h2 className="text-xl font-semibold">{wallet.label}</h2>
                    </div>
                    {wallet.balance !== undefined && (
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Balance</p>
                        <p className="text-xl font-semibold text-neonGreen">
                          {wallet.balance} BTC
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Address</p>
                    <p className="font-mono text-sm break-all bg-white/5 p-2 rounded">
                      {wallet.addresses[0] || "Address not available"}
                    </p>

                    {wallet.transactions && wallet.transactions.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-400 mb-2">
                          Recent Transactions
                        </p>
                        <div className="bg-white/5 rounded p-3 space-y-2">
                          {wallet.transactions.map((tx) => (
                            <div
                              key={tx.txid}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="font-mono">{tx.txid}</span>
                              <span className="text-neonGreen">
                                {tx.amount} BTC
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <WalletActions walletAddress={wallet.addresses[0]} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No wallets found. Create one to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

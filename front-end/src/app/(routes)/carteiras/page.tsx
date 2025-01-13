"use client";

import { useState } from "react";
import { walletsApi } from "@/app/api/wallets";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/app/components/common/LoadingSpinner";
import ErrorMessage from "@/app/components/common/ErrorMessage";

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
              console.error(`Erro ao buscar saldo para ${wallet.label}:`, err);
              return wallet;
            }
          }
          return wallet;
        }),
      );

      return walletsWithBalance;
    },
  });

  const handleCreateWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWalletLabel.trim()) {
      setNewWalletLabel("");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Carteiras Bitcoin</h1>

      <form onSubmit={handleCreateWallet} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newWalletLabel}
            onChange={(e) => setNewWalletLabel(e.target.value)}
            placeholder="Nome da nova carteira"
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            Criar Carteira
          </button>
        </div>
      </form>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message={(error as Error).message} />}

      {wallets && (
        <div className="grid gap-4">
          {wallets.map((wallet) => (
            <div
              key={`${wallet.label}-${wallet.addresses[0]}`}
              className="p-4 border rounded bg-dark text-white"
            >
              <div className="space-y-2">
                <p className="text-lg">
                  <strong>Label:</strong> {wallet.label}
                </p>
                <p className="break-all">
                  <strong>Endereço:</strong>{" "}
                  {wallet.addresses[0] || "Endereço não disponível"}
                </p>
                {wallet.balance !== undefined && (
                  <p>
                    <strong>Saldo:</strong> {wallet.balance} BTC
                  </p>
                )}
                {wallet.transactions && wallet.transactions.length > 0 && (
                  <div>
                    <p className="mt-2">
                      <strong>Transações Recentes:</strong>
                    </p>
                    <ul className="list-disc list-inside">
                      {wallet.transactions.map((tx) => (
                        <li key={tx.txid} className="text-sm">
                          ID: {tx.txid.substring(0, 8)}... | Valor: {tx.amount}{" "}
                          BTC
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsApi } from "@/app/api/transactions";
import { walletsApi } from "@/app/api/wallets";
import LoadingSpinner from "@/app/components/common/LoadingSpinner";
import ErrorMessage from "@/app/components/common/ErrorMessage";
import { Send, CoinsIcon } from "lucide-react";

interface WalletActionsProps {
  walletAddress: string;
}

export default function WalletActions({ walletAddress }: WalletActionsProps) {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState<number>(0);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [numBlocks, setNumBlocks] = useState<number>(1);

  const sendMutation = useMutation({
    mutationFn: () => transactionsApi.send(recipientAddress, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      setAmount(0);
      setRecipientAddress("");
    },
  });

  const addFundsMutation = useMutation({
    mutationFn: () => walletsApi.addFunds(walletAddress, numBlocks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      setNumBlocks(1);
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > 0 && recipientAddress) {
      sendMutation.mutate();
    }
  };

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    if (numBlocks > 0) {
      addFundsMutation.mutate();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {/* Send Bitcoin Form */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Send className="w-5 h-5 text-neonGreen" />
          <h3 className="text-lg font-semibold">Send Bitcoin</h3>
        </div>
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full p-2 rounded bg-white/5 border border-white/10 text-white focus:border-neonGreen/50 focus:ring-1 focus:ring-neonGreen/50"
              placeholder="Enter recipient's address"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Amount (BTC)
            </label>
            <input
              type="number"
              step="0.00000001"
              min="0"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-2 rounded bg-white/5 border border-white/10 text-white focus:border-neonGreen/50 focus:ring-1 focus:ring-neonGreen/50"
            />
          </div>

          <button
            type="submit"
            disabled={sendMutation.isPending || !amount || !recipientAddress}
            className="w-full bg-neonGreen text-dark font-medium px-4 py-2 rounded transition-colors hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendMutation.isPending ? "Sending..." : "Send Bitcoin"}
          </button>

          {sendMutation.error && (
            <ErrorMessage message={(sendMutation.error as Error).message} />
          )}

          {sendMutation.data && (
            <div className="mt-2 p-2 border border-white/10 rounded bg-white/5">
              <p className="text-sm">
                <span className="font-medium">Transaction ID:</span>{" "}
                <span className="break-all">{sendMutation.data.txId}</span>
              </p>
            </div>
          )}
        </form>
      </div>

      {/* Add Funds Form */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <CoinsIcon className="w-5 h-5 text-neonGreen" />
          <h3 className="text-lg font-semibold">Add Funds</h3>
        </div>
        <form onSubmit={handleAddFunds} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Number of Blocks to Mine
            </label>
            <input
              type="number"
              min="1"
              value={numBlocks}
              onChange={(e) => setNumBlocks(parseInt(e.target.value))}
              className="w-full p-2 rounded bg-white/5 border border-white/10 text-white focus:border-neonGreen/50 focus:ring-1 focus:ring-neonGreen/50"
            />
          </div>

          <button
            type="submit"
            disabled={addFundsMutation.isPending || numBlocks < 1}
            className="w-full bg-neonGreen text-dark font-medium px-4 py-2 rounded transition-colors hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
          >
            {addFundsMutation.isPending ? "Mining..." : "Mine Blocks for Funds"}
          </button>

          {addFundsMutation.error && (
            <ErrorMessage message={(addFundsMutation.error as Error).message} />
          )}

          {addFundsMutation.data && (
            <div className="mt-2 p-2 border border-white/10 rounded bg-white/5">
              <p className="text-sm">{addFundsMutation.data.message}</p>
              <p className="text-sm mt-1">
                <span className="font-medium">Blocks mined:</span>{" "}
                {addFundsMutation.data.minedBlocks.length}
              </p>
            </div>
          )}
        </form>
      </div>

      {(sendMutation.isPending || addFundsMutation.isPending) && (
        <div className="col-span-2">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}

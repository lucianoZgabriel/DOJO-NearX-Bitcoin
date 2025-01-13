"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsApi } from "@/app/api/transactions";
import { walletsApi } from "@/app/api/wallets";
import LoadingSpinner from "@/app/components/common/LoadingSpinner";
import ErrorMessage from "@/app/components/common/ErrorMessage";

interface WalletActionsProps {
  walletAddress: string;
}

export default function WalletActions({ walletAddress }: WalletActionsProps) {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState<number>(0);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [numBlocks, setNumBlocks] = useState<number>(1);

  // Mutation for sending bitcoins
  const sendMutation = useMutation({
    mutationFn: () => transactionsApi.send(recipientAddress, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      setAmount(0);
      setRecipientAddress("");
    },
  });

  // Mutation for adding funds
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
    <div className="grid gap-6 md:grid-cols-2">
      {/* Send Bitcoin Form */}
      <div className="p-4 border rounded bg-dark">
        <h3 className="text-lg font-semibold mb-4">Send Bitcoin</h3>
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label
              htmlFor="recipientAddress"
              className="block text-sm font-medium mb-2"
            >
              Recipient Address
            </label>
            <input
              id="recipientAddress"
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full p-2 border rounded bg-transparent"
              placeholder="Enter recipient's address"
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-2">
              Amount (BTC)
            </label>
            <input
              id="amount"
              type="number"
              step="0.00000001"
              min="0"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-2 border rounded bg-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={sendMutation.isPending || !amount || !recipientAddress}
            className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 disabled:opacity-50"
          >
            {sendMutation.isPending ? "Sending..." : "Send Bitcoin"}
          </button>

          {sendMutation.error && (
            <ErrorMessage message={(sendMutation.error as Error).message} />
          )}

          {sendMutation.data && (
            <div className="mt-2 p-2 border rounded">
              <p className="text-sm">
                <span className="font-medium">Transaction ID:</span>{" "}
                <span className="break-all">{sendMutation.data.txId}</span>
              </p>
            </div>
          )}
        </form>
      </div>

      {/* Add Funds Form */}
      <div className="p-4 border rounded bg-dark">
        <h3 className="text-lg font-semibold mb-4">Add Funds (Mine Blocks)</h3>
        <form onSubmit={handleAddFunds} className="space-y-4">
          <div>
            <label
              htmlFor="numBlocks"
              className="block text-sm font-medium mb-2"
            >
              Number of Blocks to Mine
            </label>
            <input
              id="numBlocks"
              type="number"
              min="1"
              value={numBlocks}
              onChange={(e) => setNumBlocks(parseInt(e.target.value))}
              className="w-full p-2 border rounded bg-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={addFundsMutation.isPending || numBlocks < 1}
            className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 disabled:opacity-50"
          >
            {addFundsMutation.isPending ? "Mining..." : "Mine Blocks for Funds"}
          </button>

          {addFundsMutation.error && (
            <ErrorMessage message={(addFundsMutation.error as Error).message} />
          )}

          {addFundsMutation.data && (
            <div className="mt-2 p-2 border rounded">
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

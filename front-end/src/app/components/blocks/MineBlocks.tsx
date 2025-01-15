"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { blocksApi } from "@/app/api/blocks";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";

export default function MineBlocks() {
  const [numBlocks, setNumBlocks] = useState<number>(1);
  const [result, setResult] = useState<{
    minedBlocks: string[];
    rewardAddress: string;
  } | null>(null);

  const mineMutation = useMutation({
    mutationFn: blocksApi.mineBlocks,
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numBlocks > 0) {
      mineMutation.mutate(numBlocks);
    }
  };

  return (
    <div className="p-6 border rounded bg-dark">
      <h2 className="text-2xl font-bold mb-4">Mine Blocks</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="numBlocks" className="block text-sm font-medium mb-2">
            Number of blocks to mine
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
          disabled={mineMutation.isPending}
          className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 disabled:opacity-50"
        >
          {mineMutation.isPending ? "Mining..." : "Mine Blocks"}
        </button>
      </form>

      {mineMutation.isPending && <LoadingSpinner />}
      {mineMutation.error && (
        <ErrorMessage message={(mineMutation.error as Error).message} />
      )}

      {result && (
        <div className="mt-4 p-4 border rounded space-y-2">
          <h3 className="font-semibold">Mining Result:</h3>
          <p>
            <span className="font-medium">Reward Address:</span>{" "}
            <span className="break-all">{result.rewardAddress}</span>
          </p>
          <div>
            <span className="font-medium">Mined Blocks:</span>
            <ul className="list-disc list-inside mt-2">
              {result.minedBlocks.slice(0, 5).map((block, index) => (
                <li key={index} className="break-all">
                  {block}
                </li>
              ))}
              {result.minedBlocks.length > 5 && (
                <li>...and {result.minedBlocks.length - 5} more blocks</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { nodeApi } from "@/app/api/node";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/app/components/common/LoadingSpinner";
import ErrorMessage from "@/app/components/common/ErrorMessage";

export default function StatusPage() {
  const {
    data: nodeStatus,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["node-status"],
    queryFn: nodeApi.getStatus,
    refetchInterval: 30000,
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        Bitcoin Node Status
      </h1>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message={(error as Error).message} />}
      {nodeStatus && (
        <div className="grid gap-4">
          <div className="p-4 border rounded bg-dark text-white">
            <p>
              <strong>Chain:</strong> {nodeStatus.chain}
            </p>
            <p>
              <strong>Blocks:</strong> {nodeStatus.blocks}
            </p>
            <p>
              <strong>Headers:</strong> {nodeStatus.headers}
            </p>
            <p>
              <strong>Best Block Hash:</strong> {nodeStatus.bestblockhash}
            </p>
            <p>
              <strong>Difficulty:</strong> {nodeStatus.difficulty}
            </p>
            <p>
              <strong>Version:</strong> {nodeStatus.version}
            </p>
            <p>
              <strong>Protocol Version:</strong> {nodeStatus.protocolversion}
            </p>
            <p>
              <strong>Connections:</strong> {nodeStatus.connections}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

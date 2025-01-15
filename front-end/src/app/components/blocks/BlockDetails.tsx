import { Block } from "@/app/api/types";

interface BlockDetailsProps {
  block: Block;
}

export default function BlockDetails({ block }: BlockDetailsProps) {
  return (
    <div className="space-y-4">
      <p>
        <strong>Hash:</strong> {block.hash}
      </p>
      <p>
        <strong>Confirmations:</strong> {block.confirmations}
      </p>
      <p>
        <strong>Height:</strong> {block.height}
      </p>
      <p>
        <strong>Date/Time:</strong>{" "}
        {new Date(block.time * 1000).toLocaleString()}
      </p>
      <p>
        <strong>Difficulty:</strong> {block.difficulty}
      </p>
      <p>
        <strong>Transactions:</strong> {block.nTx}
      </p>
      <div>
        <strong>Transactions (IDs):</strong>
        <ul className="list-disc list-inside">
          {block.tx.slice(0, 5).map((tx: string, idx: number) => (
            <li key={idx}>{tx}</li>
          ))}
          {block.tx.length > 5 && <p>... and more {block.tx.length - 5}.</p>}
        </ul>
      </div>
    </div>
  );
}

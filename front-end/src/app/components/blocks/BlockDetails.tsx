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
}

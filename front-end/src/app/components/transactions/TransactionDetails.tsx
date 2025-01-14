import { Transaction } from "@/app/api/types";

interface TransactionDetailsProps {
  transaction: Transaction;
}

export default function TransactionDetails({
  transaction,
}: TransactionDetailsProps) {
  return (
    <div className="space-y-4">
      <p>
        <strong>Transaction ID:</strong> {transaction.txid}
      </p>
      <p>
        <strong>Value:</strong> {transaction.amount} BTC
      </p>
      <p>
        <strong>Confirmations:</strong> {transaction.confirmations}
      </p>
      <p>
        <strong>Date/Time:</strong>{" "}
        {new Date(transaction.time * 1000).toLocaleString()}
      </p>
      <div>
        <strong>Details:</strong>
        <ul className="list-disc list-inside">
          {transaction.details.map((detail, idx: number) => (
            <li key={idx}>
              Address: {detail.address} | Value: {detail.amount} BTC | Category:{" "}
              {detail.category}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

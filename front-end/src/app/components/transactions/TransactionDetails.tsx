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
        <strong>ID da Transação:</strong> {transaction.txid}
      </p>
      <p>
        <strong>Valor:</strong> {transaction.amount} BTC
      </p>
      <p>
        <strong>Confirmações:</strong> {transaction.confirmations}
      </p>
      <p>
        <strong>Data/Hora:</strong>{" "}
        {new Date(transaction.time * 1000).toLocaleString()}
      </p>
      <div>
        <strong>Detalhes:</strong>
        <ul className="list-disc list-inside">
          {transaction.details.map((detail, idx: number) => (
            <li key={idx}>
              Endereço: {detail.address} | Valor: {detail.amount} BTC |
              Categoria: {detail.category}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

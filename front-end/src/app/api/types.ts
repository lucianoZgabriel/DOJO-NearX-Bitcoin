export interface Block {
  hash: string;
  confirmations: number;
  height: number;
  time: number;
  difficulty: number;
  nTx: number;
  tx: string[];
}

export interface Transaction {
  txid: string;
  amount: number;
  confirmations: number;
  time: number;
  details: {
    address: string;
    amount: number;
    category: string;
  }[];
}

export interface Wallet {
  label: string;
  address: string;
  balance?: number;
  transactions?: {
    txid: string;
    amount: number;
    confirmations: number;
  }[];
}

interface Network {
  name: string;
  limited: boolean;
  reachable: boolean;
  proxy: string;
  proxy_randomize_credentials: boolean;
}

export interface NodeStatus {
  chain: string;
  blocks: number;
  headers: number;
  bestblockhash: string;
  difficulty: number;
  version: number;
  protocolversion: number;
  connections: number;
  networks: Network[];
}

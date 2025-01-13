import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
});

export const fetchBlockByNumber = async (blockNumber: number) => {
  try {
    const response = await api.get(`/block/${blockNumber}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || "Erro ao buscar o bloco");
    }
    throw error;
  }
};

export const fetchTransactionById = async (txid: string) => {
  try {
    const response = await api.get(`/transaction/${txid}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Erro ao buscar a transação",
      );
    }
    throw error;
  }
};

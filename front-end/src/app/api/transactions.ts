import { api } from "./config";
import { AxiosError } from "axios";

export const transactionsApi = {
  getById: async (txid: string) => {
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
  },

  send: async (address: string, amount: number) => {
    try {
      const response = await api.post("/send", { address, amount });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.error || "Erro ao enviar transação",
        );
      }
      throw error;
    }
  },
};

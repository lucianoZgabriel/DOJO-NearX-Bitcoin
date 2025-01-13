import { api } from "./config";
import { AxiosError } from "axios";

export const walletsApi = {
  create: async (label: string) => {
    try {
      const response = await api.post("/create-wallet", { label });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.error || "Erro ao criar carteira",
        );
      }
      throw error;
    }
  },

  listAll: async () => {
    try {
      const response = await api.get("/list-wallets");
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.error || "Erro ao listar carteiras",
        );
      }
      throw error;
    }
  },

  getInfo: async (address: string) => {
    try {
      const response = await api.get(`/wallet/${address}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.error ||
            "Erro ao buscar informações da carteira",
        );
      }
      throw error;
    }
  },

  addFunds: async (address: string, numBlocks: number) => {
    try {
      const response = await api.post("/add-funds", { address, numBlocks });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.error || "Erro ao adicionar fundos",
        );
      }
      throw error;
    }
  },
};

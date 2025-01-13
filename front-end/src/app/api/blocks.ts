import { api } from "./config";
import { AxiosError } from "axios";

export const blocksApi = {
  getByNumber: async (blockNumber: number) => {
    try {
      const response = await api.get(`/block/${blockNumber}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.error || "Erro ao buscar o bloco",
        );
      }
      throw error;
    }
  },

  mineBlocks: async (numBlocks: number) => {
    try {
      const response = await api.post("/mine-blocks", { numBlocks });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.error || "Erro ao minerar blocos",
        );
      }
      throw error;
    }
  },
};

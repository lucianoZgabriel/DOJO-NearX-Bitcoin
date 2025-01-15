import { api } from "./config";
import { AxiosError } from "axios";

export const nodeApi = {
  getStatus: async () => {
    try {
      const response = await api.get("/node-status");
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.error || "Error fetching node status",
        );
      }
      throw error;
    }
  },
};

import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/utils/api";
import axios from "axios";
import type { LoginForm } from "@/types/user";

export const useUserStore = defineStore("User", () => {
  const token = ref(localStorage.getItem("token") || "");

  const login = async (data: LoginForm) => {
    try {
      const res = await api.post("/users/login", data);
      localStorage.setItem("token", res.data.token);
      token.value = res.data.token || "";

      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data?.error || "Request failed");
        throw new Error(err.response?.data?.error || "Request failed");
      } else if (err instanceof Error) {
        console.error(err.message);
        throw err;
      } else {
        console.error("Unknown error:", err);
        throw new Error("Unknown error");
      }
    }
  };

  return { login, token };
});

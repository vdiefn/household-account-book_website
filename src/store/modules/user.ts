import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/utils/api";
import axios, { AsioxError } from "axios";
import type { LoginForm } from "@/types/user";

export const useUserStore = defineStore("User", () => {
  const token = ref("");
  const login = async (data: LoginForm) => {
    try {
      const res = await api.post("/users/login", data);
      localStorage.setItem("TOKEN", res.data.token);
      token.value = res.data.token || "";
      return "OK";
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data?.error || "Request failed");
      } else if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("Unknown error:", err);
      }
    }
  };
  return { login, token };
});

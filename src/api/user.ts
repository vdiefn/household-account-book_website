import api from "@/utils/api";
import type { LoginForm } from "@/types/user";

export const reqLogin = (data: LoginForm) => {
  return api.post("/users/login", data);
};

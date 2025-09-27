import api from "@/utils/api";
import type { LoginForm, RegisterForm } from "@/types/user";

export const reqLogin = (data: LoginForm) => {
  return api.post("/users/login", data);
};

export const reqRegister = (data: RegisterForm) => {
  return api.post("/users/register", data);
};

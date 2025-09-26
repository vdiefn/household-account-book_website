import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { reqLogin } from "@/api/user";
import type { LoginForm, UserInfo } from "@/types/user";

export const useUserStore = defineStore("User", () => {
  const token = ref(localStorage.getItem("token") || "");
  const state = ref<boolean>(false);
  const userInfo = ref<UserInfo>({
    _id: "",
    email: "",
    name: "",
    createdAt: "",
  });

  const isLogin = computed(() => {
    return state.value;
  });

  const handleLogin = async (data: LoginForm) => {
    try {
      const res = await reqLogin(data);
      localStorage.setItem("token", res.data.token);
      token.value = res.data.token || "";
      userInfo.value = res.data.user;
      return res;
    } catch (err: any) {
      throw new Error(err.response.data.error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    token.value = "";
    userInfo.value = {
      _id: "",
      email: "",
      name: "",
      createdAt: "",
    };
  };

  return { handleLogin, handleLogout, token, userInfo, isLogin };
});

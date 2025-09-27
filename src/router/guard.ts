import pinia from "../store";
import { useUserStore } from "../store/modules/user";

import type { Router } from "vue-router";

// const userStore = useUserStore(pinia);

export const setGuards = (router: Router): Router => {
  router.beforeEach((to) => {
    const userStore = useUserStore(pinia);
    const token = userStore.token;
    const userInfo = userStore.userInfo;

    const whiteList: string[] = ["login", "register"];

    if (!token && !whiteList.includes(to.name as string)) {
      return { name: "login" };
    }

    if (to.name === "login" && token) return { path: "/" };

    if (!userInfo) {
      userStore.handleLogout();
      return { path: "/login" };
    }
    return true;
  });

  return router;
};

import { createRouter, createWebHistory } from "vue-router";
import { setGuards } from "@/router/guard";

export const routes = [
  {
    path: "/login",
    component: () => import("@/views/Login.vue"),
    name: "login",
  },
  {
    path: "/register",
    component: () => import("@/views/Register.vue"),
    name: "register",
  },
  {
    path: "/",
    component: () => import("@/layout/index.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/Home.vue"),
        meta: { title: "Dashboard", icon: ["far", "house"] },
      },
      {
        path: "chart",
        name: "chart",
        component: () => import("@/views/Chart.vue"),
        meta: { title: "Chart", icon: ["fas", "chart-line"] },
      },
      {
        path: "record",
        name: "record",
        component: () => import("@/views/Record.vue"),
        meta: { title: "Record", icon: ["fas", "table-list"] },
      },
    ],
  },
  { path: "/404", component: () => import("@/views/404.vue"), name: "404" },
  { path: "/:pathMatch(.*)*", redirect: "/404", name: "any" },
];

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

// export default router;

export const useRouter = () => {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  return setGuards(router);
};

import { createRouter, createWebHistory } from "vue-router";

export const routes = [
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
  { path: "/404", component: () => import("@/views/404.vue") },
  { path: "/:pathMatch(.*)*", redirect: "/404" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

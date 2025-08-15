import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/layout/index.vue"),
      name: "Layout",
      children: [
        {
          path: "",
          component: () => import("@/views/Home.vue"),
          name: "Home",
        },
      ],
    },
    {
      path: "/404",
      component: () => import("@/views/404.vue"),
      name: "404",
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/404",
      name: "Any",
    },
  ],
});

export default router;

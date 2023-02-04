import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/sets",
      name: "sets",
      component: () => import("../views/SetsView.vue"),
    },
    {
      path: "/sets/:id",
      name: "set",
      component: () => import("../views/SetView.vue"),
    },
  ],
});

export default router;

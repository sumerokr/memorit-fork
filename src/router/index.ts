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
      path: "/sets2",
      name: "sets2",
      component: () => import("../views/Sets2View.vue"),
    },
    {
      path: "/sets/:id",
      name: "set",
      component: () => import("../views/SetView.vue"),
    },
    {
      path: "/sets/:id/play",
      name: "play",
      component: () => import("../views/PlayView.vue"),
    },
    {
      path: "/seed",
      name: "seed",
      component: () => import("../views/SeedView.vue"),
    },
  ],
});

export default router;

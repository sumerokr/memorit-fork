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
      path: "/set2/:id",
      name: "set2",
      component: () => import("../views/Set2View.vue"),
      children: [
        {
          path: "/set2/:id/cards",
          name: "cards",
          component: () => import("../views/CardsView.vue"),
        },
        {
          path: "/set2/:id/new",
          name: "new-card",
          component: () => import("../views/NewCardView.vue"),
        },
      ],
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

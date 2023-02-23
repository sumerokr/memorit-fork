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
      path: "/sets/:cardSetId",
      name: "set",
      component: () => import("../views/SetView.vue"),
      props: true,
    },
    {
      path: "/sets/new",
      name: "new-card-set",
      component: () => import("../views/NewSetView.vue"),
    },
    {
      path: "/sets/:cardSetId/cards",
      name: "cards",
      component: () => import("../views/CardsView.vue"),
      props: true,
    },
    {
      path: "/sets/:cardSetId/cards/new",
      name: "new-card",
      component: () => import("../views/NewCardView.vue"),
      props: true,
    },
    {
      path: "/sets/:cardSetId/study",
      name: "study",
      component: () => import("../views/PlayView.vue"),
      props: true,
    },
    {
      path: "/seed",
      name: "seed",
      component: () => import("../views/SeedView.vue"),
    },
  ],
});

export default router;

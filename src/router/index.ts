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
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/sets",
      name: "sets",
      component: () => import("../views/SetsView.vue"),
    },
    {
      path: "/sets/:cardSetId",
      name: "set",
      component: () => import("../views/CardSetView.vue"),
      props: true,
    },
    {
      path: "/sets/new",
      name: "new-card-set",
      component: () => import("../views/CreateCardSetView0.vue"),
    },
    {
      path: "/sets/new/create",
      name: "new-card-set-create",
      component: () => import("../views/CreateCardSetView.vue"),
    },
    {
      path: "/sets/new/generate",
      name: "new-card-set-generate",
      component: () => import("../views/GenerateCardSetView.vue"),
    },
    {
      path: "/sets/:cardSetId/edit",
      name: "card-set-edit",
      component: () => import("../views/UpdateCardSetView.vue"),
      props: true,
    },
    {
      path: "/sets/:cardSetId/cards",
      name: "cards",
      component: () => import("../views/CardsView.vue"),
      props: true,
    },
    {
      path: "/sets/:cardSetId/cards/:id/edit",
      name: "card-edit",
      component: () => import("../views/UpdateCardView.vue"),
      props: true,
    },
    {
      path: "/sets/:cardSetId/cards/new",
      name: "new-card",
      component: () => import("../views/CreateCardView.vue"),
      props: true,
    },
    // {
    //   path: "/sets/:cardSetId/study",
    //   name: "study",
    //   component: () => import("../views/PlayView.vue"),
    //   props: true,
    // },
    {
      path: "/seed",
      name: "seed",
      component: () => import("../views/SeedView.vue"),
    },
  ],
});

export default router;

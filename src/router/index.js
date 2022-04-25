import { createRouter, createWebHistory } from "vue-router";
import UserView from "../views/UserView.vue";
import ListImagesView from "../views/ListImagesView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "User",
      component: UserView,
    },
    {
      path: "/images/list/:id",
      name: "ListImages",
      component: ListImagesView,
    },
  ],
});

export default router;

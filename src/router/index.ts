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
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/products",
      name: "products",
      component: () => import("../views/ProductsView.vue"),
    },
    {
      path: "/auth",
      name: "auth",
      component: () => import("../views/admin/AuthView.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/admin/AdminView.vue"),
      meta: { requiresAuth: true },
    },
  ],
});
//Not using from for now
router.beforeEach((to, from) => {
  const isAuthenticated = localStorage.getItem("token");

  if (to.name === "admin" && !isAuthenticated) {
    return { name: "auth" };
  }
});

export default router;

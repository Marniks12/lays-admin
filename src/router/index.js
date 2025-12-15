import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/Loginview.vue";

const routes = [
  { path: "/", component: LoginView },
  { path: "/dashboard", component: () => import("../views/DashboardView.vue") },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});

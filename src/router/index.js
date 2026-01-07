import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("../views/SignupView.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/DashboardView.vue"),
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/vote",
    name: "vote",
    component: () => import("../views/VoteView.vue"),
    meta: { requiresAuth: true, role: "user" },
  },
  // (later)
  // {
  //   path: "/configurator",
  //   component: () => import("../views/ConfiguratorView.vue"),
  //   meta: { requiresAuth: true, role: "user" },
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔑 JWT payload uitlezen (zonder jwt-decode)
function getTokenPayload() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const base64 = token.split(".")[1];
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  const payload = getTokenPayload();

  // ❌ niet ingelogd → beschermde routes blokkeren
  if (to.meta.requiresAuth && !token) {
    return "/";
  }

  // ❌ token kapot → force logout
  if (token && !payload) {
    localStorage.removeItem("token");
    return "/";
  }

  // ✅ al ingelogd → niet terug naar login/signup
  if ((to.path === "/" || to.path === "/signup") && payload) {
    return payload.role === "admin" ? "/dashboard" : "/vote";
  }

  // 🔐 role-based toegang
  if (to.meta.role && payload?.role !== to.meta.role) {
    return payload.role === "admin" ? "/dashboard" : "/vote";
  }
});

export default router;


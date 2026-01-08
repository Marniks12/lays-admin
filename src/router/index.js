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
    component: () => import("../views/signupView.vue"),
  },
  {
    path: "/configurator",
    name: "configurator",
    component: () => import("../views/configuratorView.vue"),
    meta: { requiresAuth: true, role: "user" },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/dashboardView.vue"),
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/vote",
    name: "vote",
    component: () => import("../views/voteView.vue"),
    meta: { requiresAuth: true, role: "user" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔑 JWT payload uitlezen (zonder extra package)
function getTokenPayload() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  const payload = getTokenPayload();

  // 🔒 beschermde routes
  if (to.meta.requiresAuth && !token) {
    return "/";
  }

  // ❌ corrupte token
  if (token && !payload) {
    localStorage.removeItem("token");
    return "/";
  }

  // ✅ al ingelogd → niet terug naar login/signup
  if ((to.path === "/" || to.path === "/signup") && payload) {
    return payload.role === "admin"
      ? "/dashboard"
      : "/configurator";
  }

  // 🔐 role-based toegang
  if (to.meta.role && payload?.role !== to.meta.role) {
    return payload.role === "admin"
      ? "/dashboard"
      : "/configurator";
  }
});

export default router;

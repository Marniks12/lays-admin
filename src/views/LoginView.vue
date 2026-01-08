<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Login</h1>

      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>

      <p class="signup">
        Nog geen account?
        <span @click="goSignup">Maak er één</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

/**
 * 👉 API base URL uit Vercel environment variables
 */
const API_URL = import.meta.env.VITE_API_URL;

function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

const login = async () => {
  error.value = "";

  try {
    const res = await fetch(`${API_URL}/api/v1/user/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    if (!res.ok) {
      error.value = "Login failed";
      return;
    }

    const { token } = await res.json();
    localStorage.setItem("token", token);

    const payload = decodeToken(token);

    // ✅ ADMIN → dashboard
    if (payload?.role === "admin") {
      router.push("/dashboard");
    }
    // ✅ USER → CONFIGURATOR
    else {
      router.push("/configurator");
    }
  } catch (err) {
    error.value = "Server unreachable";
    console.error(err);
  }
};

const goSignup = () => {
  router.push("/signup");
};
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff7cc;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 320px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.login-card input {
  width: 100%;
  padding: 0.7rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.login-card button {
  width: 100%;
  padding: 0.7rem;
  background: #e21b1b;
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: bold;
}

.error {
  color: red;
  margin-top: 1rem;
}

.signup span {
  color: #e21b1b;
  cursor: pointer;
  font-weight: bold;
}
</style>

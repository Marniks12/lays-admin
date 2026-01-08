<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Create account</h1>

      <form @submit.prevent="signup">
        <input v-model="firstName" placeholder="First name" required />
        <input v-model="lastName" placeholder="Last name" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Create account</button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>

      <p class="signup">
        Al een account?
        <span @click="goLogin">Login</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const error = ref("");

const signup = async () => {
  error.value = "";

  const res = await fetch("http://localhost:3000/api/v1/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    }),
  });

  if (!res.ok) {
    error.value = "Signup failed";
    return;
  }

  router.push("/");
};

const goLogin = () => router.push("/");
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
  width: 340px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.login-card input {
  width: 100%;
  padding: 0.7rem;
  margin-bottom: 0.8rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.login-card button {
  width: 100%;
  padding: 0.7rem;
  background: #e21b1b;
  color: white;
  border-radius: 20px;
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

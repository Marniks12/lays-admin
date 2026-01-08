<template>
  <div class="page">
    <!-- TOP BAR -->
    <header class="topbar">
      <img src="/public/ar-lays-big-change-ar-lays-4x3-d080a2f7f0aa45bbab0fccd2078b7152.jpg" class="logo" />
      <div class="actions">
        <button class="secondary" @click="goConfigurator">
          ← Terug naar configurator
        </button>
        <button class="primary" @click="logout">Logout</button>
      </div>
    </header>

    <!-- CONTENT -->
    <main class="content">
      <h1>Vote on community designs</h1>

      <p v-if="error" class="error">{{ error }}</p>

      <div class="grid">
        <div class="card" v-for="d in designs" :key="d._id">
          <img v-if="d.previewImage" :src="d.previewImage" />

          <p><strong>Color:</strong> {{ d.bagColor }}</p>
          <p><strong>Pattern:</strong> {{ d.pattern || "none" }}</p>
          <p><strong>Chips:</strong> {{ d.chipsType || "none" }}</p>
          <p class="votes">👍 {{ d.votes }}</p>

          <button class="primary" @click="vote(d._id)">
            Vote
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const designs = ref([]);
const error = ref("");

const loadDesigns = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/v1/design/public");
    if (!res.ok) throw new Error();
    designs.value = await res.json();
  } catch {
    error.value = "Could not load designs";
  }
};

const vote = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:3000/api/v1/design/${id}/vote`,
    {
      method: "POST",
      headers: token
        ? { Authorization: "Bearer " + token }
        : {}
    }
  );

  if (!res.ok) {
    alert("You must be logged in to vote");
    return;
  }

  loadDesigns();
};

const logout = () => {
  localStorage.removeItem("token");
  router.push("/");
};

const goConfigurator = () => {
  router.push("/configurator");
};

onMounted(loadDesigns);
</script>

<style scoped>
/* PAGE */
.page {
  min-height: 100vh;
  background: linear-gradient(#ffe066, #ffd000);
  font-family: Arial, sans-serif;
}

/* TOPBAR */
.topbar {
  height: 70px;
  background: #ffcc00;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
}

.logo {
  height: 42px;
}

.actions {
  display: flex;
  gap: 12px;
}

/* CONTENT */
.content {
  padding: 40px;
}

h1 {
  color: #c70000;
  margin-bottom: 25px;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 25px;
}

/* CARD */
.card {
  background: #fff8e1;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  text-align: center;
}

.card img {
  width: 100%;
  height: 160px;
  object-fit: contain;
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
}

.votes {
  margin: 10px 0;
  font-weight: bold;
}

/* BUTTONS */
button {
  border: none;
  cursor: pointer;
  border-radius: 30px;
  padding: 10px 18px;
  font-weight: bold;
}

button.primary {
  background: #d71920;
  color: white;
}

button.primary:hover {
  background: #b8161b;
}

button.secondary {
  background: white;
  color: #d71920;
  border: 2px solid #d71920;
}

button.secondary:hover {
  background: #ffecec;
}

.error {
  color: red;
  margin-bottom: 20px;
}
</style>

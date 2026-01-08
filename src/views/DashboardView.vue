<template>
  <div class="page">
    <!-- TOPBAR -->
    <header class="topbar">
      <img
        src="/ar-lays-big-change-ar-lays-4x3-d080a2f7f0aa45bbab0fccd2078b7152.jpg"
        class="logo"
        alt="Lays logo"
      />

      <button class="logout" @click="logout">Logout</button>
    </header>

    <!-- CONTENT -->
    <main class="content">
      <h1>Admin dashboard</h1>

      <div class="grid">
        <div v-for="d in designs" :key="d._id" class="card">
          <img v-if="d.previewImage" :src="d.previewImage" />

          <p><b>Color:</b> {{ d.bagColor }}</p>
          <p><b>Pattern:</b> {{ d.pattern || "none" }}</p>
          <p><b>Chips:</b> {{ d.chipsType || "none" }}</p>

          <p class="votes">👍 {{ d.votes }} votes</p>

          <button class="danger" @click="deleteDesign(d._id)">
            Delete design
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

/**
 * 👉 API base URL uit environment variables
 */
const API_URL = import.meta.env.VITE_API_URL;

const loadDesigns = async () => {
  try {
    const res = await fetch(`${API_URL}/api/v1/design`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    designs.value = await res.json();
  } catch (err) {
    console.error("Load failed", err);
  }
};

const deleteDesign = async (id) => {
  if (!confirm("Are you sure you want to delete this design?")) return;

  await fetch(`${API_URL}/api/v1/design/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  loadDesigns();
};

const logout = () => {
  localStorage.removeItem("token");
  router.push("/");
};

onMounted(loadDesigns);
</script>

<style scoped>
/* PAGE */
.page {
  min-height: 100vh;
  background: linear-gradient(#ffe066, #ffd000);
}

/* TOPBAR */
.topbar {
  height: 70px;
  background: #ffcc00;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.logo {
  height: 42px;
}

.logout {
  background: #c70000;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
}

/* CONTENT */
.content {
  padding: 30px;
}

h1 {
  color: #c70000;
  margin-bottom: 5px;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 22px;
}

/* CARD */
.card {
  background: #fff8e1;
  border-radius: 18px;
  padding: 15px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.card img {
  width: 100%;
  height: 170px;
  object-fit: contain;
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
}

.votes {
  margin: 10px 0;
  font-weight: bold;
}

/* BUTTON */
.danger {
  background: #d71920;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
}

.danger:hover {
  background: #b8161b;
}
</style>

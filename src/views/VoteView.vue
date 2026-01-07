<template>
  <div>
    <button @click="logout">Logout</button>
    <h1>Vote on designs</h1>

    <div class="grid">
      <div class="card" v-for="d in designs" :key="d._id">
        <img v-if="d.previewImage" :src="d.previewImage" />

        <p><strong>Color:</strong> {{ d.bagColor }}</p>
        <p><strong>Pattern:</strong> {{ d.pattern || "none" }}</p>
        <p><strong>Chips:</strong> {{ d.chipsType || "none" }}</p>
        <p><strong>Votes:</strong> {{ d.votes }}</p>

        <button @click="vote(d._id)">👍 Vote</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const designs = ref([]);

const loadDesigns = async () => {
  const res = await fetch("http://localhost:3000/api/v1/design");
  designs.value = await res.json();
};

const vote = async (id) => {
  await fetch(`http://localhost:3000/api/v1/design/${id}/vote`, {
    method: "POST",
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
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.card {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 10px;
}

img {
  width: 100%;
  height: 140px;
  object-fit: contain;
}
</style>

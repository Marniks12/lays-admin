<template>
  <div>
    <h1>Admin Dashboard</h1>
    <button @click="loadBags">Load Bags</button>

    <ul>
      <li v-for="bag in bags" :key="bag._id">
        {{ bag.name }}
        <button @click="remove(bag._id)">❌</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";

const bags = ref([]);

const loadBags = async () => {
  const res = await fetch("http://localhost:3000/api/v1/bag", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  bags.value = await res.json();
};

const remove = async (id) => {
  await fetch(`http://localhost:3000/api/v1/bag/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  loadBags();
};
</script>

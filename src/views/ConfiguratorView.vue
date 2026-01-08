<template>
  <div class="configurator-wrapper">
    <div class="top-actions">
      <button @click="logout" class="logout-btn">Logout</button>
    </div>

    <iframe
      src="http://localhost:5174"
      class="configurator-frame"
    />

    <button class="community-btn" @click="goCommunity">
      Bekijk community designs
    </button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const logout = () => {
  localStorage.removeItem("token");
  router.push("/");
};

const goCommunity = () => {
  router.push("/vote");
};
</script>

<style scoped>
  
.configurator-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-actions {
  background: #ffcc00;
  padding: 10px;
  display: flex;
  justify-content: flex-end;
}

.logout-btn {
  background: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
}

.configurator-frame {
  flex: 1;
  border: none;
  width: 100%;
}

.community-btn {
  background: #d71920;
  color: white;
  border: none;
  padding: 16px;
  font-size: 16px;
  cursor: pointer;
}
</style>

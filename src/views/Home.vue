<script lang="ts" setup>
import { ref, onMounted } from "vue";
import api from "@/utils/api";

const data = ref({});

const getData = async () => {
  try {
    const res = await api.get("/records");
    data.value = res;
    console.log(res);
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  getData();
});
</script>
<template>
  <div class="container">
    <h5>Home</h5>
  </div>
</template>
<style lang="scss" scoped>
.container {
  border: 1px solid white;
  height: 90%;
  width: 98%;
  border-radius: 15px;
  padding: 1rem;
  background-color: white;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
}
</style>

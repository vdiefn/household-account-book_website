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
  <h5>Home</h5>
</template>
<style lang="scss" scoped></style>

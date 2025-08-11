<script setup lang="ts">
import { ref, onMounted } from "vue"
const data = ref({})

const getData = async () => {
  try {
    const res = await fetch("https://household-account-book-api.onrender.com", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
    data.value = await res.json()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  getData()
})
</script>

<template>
  <div class="mb-4">
    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </div>
</template>

<style scoped></style>

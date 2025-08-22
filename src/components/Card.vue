<script lang="ts" setup>
const props = defineProps<{
  title: string;
  amount: number;
}>();
</script>
<template>
  <el-card shadow="never">
    <div class="info-wrapper">
      <span>{{ props.title }}</span>
      <h3>{{ props.amount }}</h3>
    </div>
  </el-card>
</template>
<style lang="scss" scoped>
:deep(.el-card__body) {
  padding: 5px 10px;
}

.info-wrapper {
  width: 150px;
  display: flex;
  flex-direction: row;
  gap: 25px;
}
</style>

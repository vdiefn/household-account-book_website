<script lang="ts" setup>
const props = defineProps<{
  title: string;
  amount: number;
  textColor?: string;
}>();
</script>
<template>
  <ElCard class="card">
    <div class="title-wrapper">
      <h5>{{ props.title }}</h5>
    </div>
    <div class="amount-wrapper">
      <h2 :style="{ color: props.textColor }">$ {{ props.amount }}</h2>
    </div>
  </ElCard>
</template>
<style lang="scss" scoped>
.card {
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    padding: 5px 10px;
  }

  .title-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

  .amount-wrapper {
    margin: 0 auto;
    padding: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;

    h2 {
      font-size: 2.5rem;
    }
  }
}
</style>

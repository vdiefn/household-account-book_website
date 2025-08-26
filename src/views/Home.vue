<script lang="ts" setup>
import { DashboardCard } from "@/components";
import api from "@/utils/api";
import { ref, onMounted } from "vue";

import type { Summary } from "@/types/summary";

const monthSummary = ref<Summary>({
  income: 0,
  expense: 0,
});
const weekSummary = ref<Summary>({
  income: 0,
  expense: 0,
});

const getMonthSummary = async (): Promise<void> => {
  try {
    const res = await api.get("/summary/month");
    monthSummary.value = res.data;
    console.log(monthSummary.value);
  } catch (error) {
    console.error(error);
  }
};

const getWeekSummary = async (): Promise<void> => {
  try {
    const res = await api.get("/summary/week");
    weekSummary.value = res.data;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  getMonthSummary();
  getWeekSummary();
});
</script>
<template>
  <DefaultContainer>
    <template #header>
      <div>
        <h3>Dashboard</h3>
      </div>
    </template>
    <div class="card-wrapper">
      <DashboardCard
        :title="'本周支出'"
        :amount="weekSummary.expense"
        :textColor="'tomato'"
      />
      <DashboardCard
        :title="'本周收入'"
        :amount="weekSummary.income"
        :textColor="'mediumseagreen'"
      />
      <DashboardCard
        :title="'本月支出'"
        :amount="monthSummary.expense"
        :textColor="'tomato'"
      />
      <DashboardCard
        :title="'本月收入'"
        :amount="monthSummary.income"
        :textColor="'mediumseagreen'"
      />
    </div>
    <div class="chart-wrapper"></div>
  </DefaultContainer>
</template>
<style lang="scss" scoped>
.card-wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(150px, 1fr));
  grid-gap: 10px;
  margin-top: 1rem;
}
</style>

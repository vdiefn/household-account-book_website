<script lang="ts" setup>
import { DashboardCard } from "@/components";
import api from "@/utils/api";
import { ref, onMounted, computed } from "vue";
import { getDaysInMonth } from "@/utils/dayjs";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
} from "echarts/components";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

import type { Summary, BarChartItem } from "@/types/summary";
import type { BarSeriesOption } from "echarts/charts";

type EChartsOption = echarts.ComposeOption<BarSeriesOption>;

echarts.use([
  BarChart,
  LegendComponent,
  ToolboxComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
  LabelLayout,
  GridComponent,
]);

const barChartData = ref<BarChartItem[]>([]);
const barChartIncomeData = ref<number[]>([]);
const barChartExpenseData = ref<number[]>([]);
const barChartRef = ref<HTMLDivElement | null>(null);
const barChartInstance = ref<echarts.ECharts | null>(null);
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

const daysInMonthList = computed(() => {
  const days = getDaysInMonth();
  return Array.from({ length: days }, (_, i) => i + 1);
});

const barChartOption: EChartsOption = {
  xAxis: {
    type: "category",
    data: daysInMonthList.value,
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: "bar",
    },
  ],
};

const getMonthTrend = async (): Promise<void> => {
  try {
    const res = await api.get("/summary/month-trend");
    barChartData.value = res.data;
    barChartInstance.value = echarts.init(barChartRef.value);
    barChartIncomeData.value = barChartData.value.map((item) => item.income);
    barChartExpenseData.value = barChartData.value.map((item) => item.expense);
    barChartInstance.value.setOption({
      ...barChartOption,
      series: [
        {
          type: "bar",
          data: barChartIncomeData.value,
        },
        {
          type: "bar",
          data: barChartExpenseData.value,
        },
      ],
    });
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  getMonthSummary();
  getWeekSummary();
  getMonthTrend();
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
        :textColor="'LightSalmon'"
      />
      <DashboardCard
        :title="'本周收入'"
        :amount="weekSummary.income"
        :textColor="'mediumseagreen'"
      />
      <DashboardCard
        :title="'本月支出'"
        :amount="monthSummary.expense"
        :textColor="'LightSalmon'"
      />
      <DashboardCard
        :title="'本月收入'"
        :amount="monthSummary.income"
        :textColor="'mediumseagreen'"
      />
    </div>
    <div class="trend-info-wrapper">
      <div class="chart-wrapper">
        <div ref="barChartRef" style="width: 90%; height: 400px"></div>
      </div>
      <div class="info-wrapper"></div>
    </div>
  </DefaultContainer>
</template>
<style lang="scss" scoped>
.card-wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(150px, 1fr));
  grid-gap: 10px;
  margin: 1rem 0;
  padding: 1rem;
}
.trend-info-wrapper {
  margin: 1rem 0;
  padding: 1rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 1rem;
  border: 1px solid red;

  .chart-wrapper {
    border: 1px solid blue;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 0;
  }

  .info-wrapper {
    border: 1px solid green;
  }
}
</style>

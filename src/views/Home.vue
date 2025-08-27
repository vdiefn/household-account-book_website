<script lang="ts" setup>
import { DashboardCard } from "@/components";
import api from "@/utils/api";
import { ref, onMounted, computed } from "vue";
import { getDaysInMonth, formatDate } from "@/utils/dayjs";
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
import type { Record, RecordQuery } from "@/types/record";
import type { BarSeriesOption } from "echarts/charts";

type EChartsOption = echarts.ComposeOption<BarSeriesOption>;

echarts.use([
  BarChart,
  LegendComponent,
  ToolboxComponent,
  TitleComponent,
  TooltipComponent,
  CanvasRenderer,
  LabelLayout,
  GridComponent,
]);

const barChartData = ref<BarChartItem[]>([]);
const barChartIncomeData = ref<number[]>([]);
const barChartExpenseData = ref<number[]>([]);
const barChartRef = ref<HTMLDivElement | null>(null);
const barChartInstance = ref<echarts.ECharts | null>(null);
const loading = ref(false);
const data = ref<Record[]>([]);
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
  title: {
    text: "當月收入/支出趨勢圖",
  },
  tooltip: {
    trigger: "item",
    axisPointer: {
      type: "shadow",
    },
    formatter: (params: any) => {
      return `${params.seriesName}<br>${params.name}日 : ${params.value}`;
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "15%",
    containLabel: true,
  },
  legend: {
    data: ["收入", "支出"],
    left: "center",
    bottom: 0,
  },
  xAxis: {
    type: "category",
    data: daysInMonthList.value,
    name: "日期",
    nameLocation: "middle",
    nameGap: 30,
    axisTick: {
      alignWithLabel: true,
    },
  },
  yAxis: {
    type: "value",
    name: "金額",
  },
  series: [],
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
          name: "收入",
        },
        {
          type: "bar",
          data: barChartExpenseData.value,
          name: "支出",
        },
      ],
    });
  } catch (err) {
    console.error(err);
  }
};

const getData = async (): Promise<void> => {
  const params = {} as RecordQuery;
  loading.value = true;

  try {
    const res = await api.get("/records", {
      params,
      paramsSerializer: {
        indexes: null,
      },
    });
    data.value = res.data.records;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getMonthSummary();
  getWeekSummary();
  getMonthTrend();
  getData();
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
      <div class="info-wrapper">
        <el-table :data="data.slice(0, 8)" style="width: 100%">
          <el-table-column prop="date" label="Date" width="180">
            <template #default="{ row }">
              {{ formatDate(row.date) }}
            </template>
          </el-table-column>
          <el-table-column prop="category" label="類別">
            <template #default="{ row }">
              {{ row.category?.name }}
            </template>
          </el-table-column>
          <el-table-column prop="type" label="支出/收入">
            <template #default="{ row }">
              <template v-if="row.type === 'income'">
                <el-tag type="success">
                  {{ "收入" }}
                </el-tag>
              </template>
              <template v-if="row.type === 'expense'">
                <el-tag type="warning">
                  {{ "支出" }}
                </el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="項目名稱" />
          <el-table-column prop="amount" label="金額" />
        </el-table>
      </div>
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
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;

  .chart-wrapper,
  .info-wrapper {
    border: 1px solid lightgrey;
    border-radius: 5px;
  }

  .chart-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 0;
  }

  .info-wrapper {
    padding: 1rem;
  }
}
</style>

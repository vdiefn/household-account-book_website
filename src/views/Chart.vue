<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { ElDialog } from "element-plus";
import { DefaultContainer } from "@/components";
import api from "@/utils/api";
import { formatDate, getStartOfMonth, getEndOfMonth } from "@/utils/dayjs";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

import type { Record, RecordQuery } from "@/types/record";
import type { Category } from "@/types/category";
import type { ComputedRef } from "vue";
import type { PieSeriesOption } from "echarts/charts";
import type { ComposeOption } from "echarts/core";
import type { ECElementEvent } from "echarts/types/dist/shared";

type ECOption = ComposeOption<PieSeriesOption>;
echarts.use([
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
  LabelLayout,
]);

interface PieDataItem {
  name: string;
  value: number;
}

const data = ref<Record[]>([]);
const startOfMonth = getStartOfMonth();
const endOfMonth = getEndOfMonth();
const selectDate = ref<[string, string] | []>([startOfMonth, endOfMonth]);
const categoryList = ref<Category[]>([]);
const loading = ref(false);
const canvasExpense = ref<HTMLDivElement | null>(null);
const canvasIncome = ref<HTMLDivElement | null>(null);
const chartInstanceExpense = ref<echarts.ECharts | null>(null);
const chartInstanceIncome = ref<echarts.ECharts | null>(null);
const dialogVisible = ref(false);
const detailData = ref<Record[]>([]);

const handleChartClick = (params: ECElementEvent) => {
  detailData.value = data.value.filter(
    (item) => item.category.name === params.name,
  );
  dialogVisible.value = true;
};

const getData = async (): Promise<void> => {
  const params = {} as RecordQuery;
  loading.value = true;

  if (selectDate.value[0]) {
    params.startDate = selectDate.value[0];
  }

  if (selectDate.value[1]) {
    params.endDate = selectDate.value[1];
  }

  try {
    const res = await api.get("/records", {
      params,
      paramsSerializer: {
        indexes: null,
      },
    });
    data.value = res.data.records;

    if (!chartInstanceExpense.value && canvasExpense.value) {
      chartInstanceExpense.value = echarts.init(canvasExpense.value);
      chartInstanceExpense.value.setOption(pieChartOptionExpense);
      chartInstanceExpense.value.on("click", handleChartClick);
    }

    if (!chartInstanceIncome.value && canvasIncome.value) {
      chartInstanceIncome.value = echarts.init(canvasIncome.value);
      chartInstanceIncome.value.setOption(pieChartOptionIncome);
      chartInstanceIncome.value.on("click", handleChartClick);
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const getCategory = async (): Promise<void> => {
  try {
    const res = await api.get("/categories");
    categoryList.value = res.data.categories;
  } catch (err) {
    console.error(err);
  }
};

const pieChartDataExpense: ComputedRef<PieDataItem[]> = computed(() => {
  const pieData: { [key: string]: number } = data.value
    .filter((item) => item.type === "expense")
    .reduce((a: { [key: string]: number }, c) => {
      if (a[c.category.name]) {
        a[c.category.name] += c.amount;
      } else {
        a[c.category.name] = c.amount;
      }
      return a;
    }, {});
  return Object.entries(pieData).map(([name, value]) => ({
    name,
    value,
  }));
});

const pieChartDataIncome: ComputedRef<PieDataItem[]> = computed(() => {
  const pieData: { [key: string]: number } = data.value
    .filter((item) => item.type === "income")
    .reduce((a: { [key: string]: number }, c) => {
      if (a[c.category.name]) {
        a[c.category.name] += c.amount;
      } else {
        a[c.category.name] = c.amount;
      }
      return a;
    }, {});
  return Object.entries(pieData).map(([name, value]) => ({
    name,
    value,
  }));
});

const pieChartOptionExpense: ECOption = {
  title: {
    text: "支出",
    subtext: "",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  series: [
    {
      name: "說明",
      type: "pie",
      radius: "50%",
      data: pieChartDataExpense.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};

const pieChartOptionIncome: ECOption = {
  title: {
    text: "收入",
    subtext: "",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  series: [
    {
      name: "說明",
      type: "pie",
      radius: "50%",
      data: pieChartDataIncome.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};

onMounted(() => {
  getData();
  getCategory();
});

watch(pieChartDataExpense, (newData) => {
  if (chartInstanceExpense.value) {
    chartInstanceExpense.value.setOption({
      series: [{ data: newData }],
    });
  }
});

watch(pieChartDataIncome, (newData) => {
  if (chartInstanceIncome.value) {
    chartInstanceIncome.value.setOption({
      series: [{ data: newData }],
    });
  }
});
</script>

<template>
  <DefaultContainer>
    <template #header>
      <h4>Chart</h4>
      <div class="header-action">
        <div class="left-action">
          <el-date-picker
            v-model="selectDate"
            class="date-picker"
            type="daterange"
            range-separator="-"
            start-placeholder="起始日"
            end-placeholder="結束日"
            format="YYYY/MM/DD"
          />
          <el-button @click="getData">
            <template #icon>
              <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            </template>
          </el-button>
        </div>
      </div>
    </template>
    <div class="canvas-wrapper">
      <div ref="canvasExpense" style="width: 500px; height: 500px"></div>
      <div ref="canvasIncome" style="width: 500px; height: 500px"></div>
    </div>
  </DefaultContainer>
  <el-dialog
    v-model="dialogVisible"
    title="明細"
    width="600px"
    align-center
    draggable
  >
    <el-table :data="detailData" style="width: 100%">
      <el-table-column prop="createdAt" label="日期">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="項目" />
      <el-table-column prop="amount" label="金額" />
    </el-table>
  </el-dialog>
</template>

<style scoped lang="scss">
.header-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .left-action {
    margin-left: 15px;
    display: flex;
    align-items: center;
    gap: 5px;
    justify-content: flex-start;
    width: 100%;

    .el-input,
    .el-select {
      width: 220px;
    }

    :deep(.el-date-editor--daterange) {
      width: 250px !important;
      flex: 0 0 auto;
    }
  }

  .right-action {
    justify-content: flex-end;
  }
}
.canvas-wrapper {
  margin: auto 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>

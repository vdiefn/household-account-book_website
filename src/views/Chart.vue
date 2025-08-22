<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { DefaultContainer } from "@/components";
import api from "@/utils/api";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw";
import type { Record, RecordQuery } from "@/types/record";
import type { Category } from "@/types/category";
import * as echarts from "echarts/core";
import { PieChart, BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  PieChart,
  BarChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
  LabelLayout,
]);

type Typekey = "expense" | "income";

const data = ref<Record[]>([]);
const startOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");
const endOfMonth = dayjs().endOf("month").format("YYYY-MM-DD");
const selectCategories = ref<string[]>([]);
const selectType = ref<string[]>(["income", "expense"]);
const selectDate = ref<[string, string] | []>([startOfMonth, endOfMonth]);
const categoryList = ref<Category[]>([]);
const loading = ref(false);
const canvas = ref<HTMLDivElement | null>(null);
const chartInstance = ref<echarts.ECharts | null>(null);

const getData = async (): Promise<void> => {
  const params = {} as RecordQuery;
  loading.value = true;

  if (selectType.value) {
    const selected = Array.isArray(selectType.value)
      ? selectType.value
      : [selectType.value];
    params.selectType = selected;
  }

  if (selectDate.value[0]) {
    params.startDate = selectDate.value[0];
  }

  if (selectDate.value[1]) {
    params.endDate = selectDate.value[1];
  }

  if (selectCategories.value) {
    const selected = Array.isArray(selectCategories.value)
      ? selectCategories.value
      : [selectCategories.value];
    params.selectCategories = selected;
  }

  try {
    const res = await api.get("/records", {
      params,
      paramsSerializer: {
        indexes: null,
      },
    });
    data.value = res.data.records as Record[];
    chartInstance.value = echarts.init(canvas.value);
    chartInstance.value.setOption(barChartOption);
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

const pieChartData = computed(() => {
  const pieData = data.value.reduce(
    (a: { [key in Typekey]: number }, c) => {
      if (a[c.type]) {
        a[c.type] += c.amount;
      } else {
        a[c.type] = c.amount;
      }
      return a;
    },
    { expense: 0, income: 0 },
  );
  return Object.entries(pieData).map(([name, value]) => ({
    name,
    value,
  }));
});

const barChartData = computed(() => {
  const summary: { [key: string]: number } = {};
  data.value.forEach((item) => {
    const categoryName = item.category.name;
    if (summary[categoryName]) {
      summary[categoryName] += item.amount;
    } else {
      summary[categoryName] = item.amount;
    }
  });
  const categories = Object.keys(summary);
  const values = Object.values(summary);
  return { categories, values };
});

const barChartOption = {
  title: {
    text: "各類別金額統計",
    left: "center",
  },
  tooltip: { trigger: "axis" },
  xAxis: {
    type: "category",
    data: barChartData.value.categories,
  },
  yAxis: { type: "value" },
  series: [
    {
      name: "金額",
      type: "bar",
      data: barChartData.value.values,
    },
  ],
};

const pieChartOption = {
  title: {
    text: "收入 vs 支出",
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
      name: "Access From",
      type: "pie",
      radius: "50%",
      data: pieChartData.value,
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

watch(barChartData, (newData) => {
  if (chartInstance.value) {
    // chartInstance.value.setOption({
    //   series: [{ data: newData }],
    // });
    chartInstance.value.setOption({
      xAxis: { data: newData.categories },
      series: [{ data: newData.values }],
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
          <el-select v-model="selectType" multiple placeholder="選擇支出/收入">
            <el-option label="收入" value="income" />
            <el-option label="支出" value="expense" />
          </el-select>
          <el-select
            v-model="selectCategories"
            multiple
            placeholder="選擇類型名稱"
          >
            <el-option
              v-for="item in categoryList"
              :key="item._id"
              :value="item._id"
              :label="item.name"
            />
          </el-select>
          <el-date-picker
            v-model="selectDate"
            class="date-picker"
            type="daterange"
            range-separator="-"
            start-placeholder="起始日"
            end-placeholder="結束日"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
          <el-button @click="getData">
            <template #icon>
              <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            </template>
          </el-button>
        </div>
      </div>
    </template>
    <div ref="canvas" style="width: 500px; height: 500px"></div>
  </DefaultContainer>
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
</style>

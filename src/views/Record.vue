<script lang="ts" setup>
import { DefaultContainer } from "@/components";
import { ref, onMounted } from "vue";
import api from "@/utils/api";
import type { Record, RecordQuery } from "@/types/record";

type SelectType = "%" | "income" | "expense";

const data = ref<Record[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const selectItems = ref<string[]>([]);
const selectType = ref<SelectType>("%");
const selectDate = ref<[string, string] | []>([]);
const titleList = ref<string[]>([]);

const getData = async (): Promise<void> => {
  const params = {} as RecordQuery;
  let typeList: string[] = [];

  if (selectType.value) {
    if (selectType.value === "%") {
      typeList = ["expense", "income"];
    } else {
      typeList = [selectType.value];
    }
    params.selectType = typeList;
  }

  if (selectDate.value[0]) {
    params.startDate = selectDate.value[0];
  }

  if (selectDate.value[1]) {
    params.endDate = selectDate.value[1];
  }

  if (selectItems.value) {
    const selected = Array.isArray(selectItems.value)
      ? selectItems.value
      : [selectItems.value];
    params.selectItems = selected;
  }

  try {
    const res = await api.get("/records", {
      params,
      paramsSerializer: {
        indexes: null,
      },
    });
    data.value = res.data.records as Record[];
  } catch (error) {
    console.error(error);
  }
};

const getTitle = async (): Promise<void> => {
  try {
    const res = await api.get("/titles");
    titleList.value = res.data.titles as string[];
  } catch (err) {
    console.error(err);
  }
};

const handleCurrentChange = () => {};

const handleSizeChange = () => {};

onMounted(() => {
  getData();
  getTitle();
});
</script>
<template>
  <DefaultContainer>
    <template #header>
      <h4>Record</h4>
      <div class="header-action">
        <div class="left-action">
          <el-select v-model="selectType" placeholder="選擇支出/收入">
            <el-option label="全部" value="%" />
            <el-option label="收入" value="income" />
            <el-option label="支出" value="expense" />
          </el-select>
          <el-select v-model="selectItems" multiple placeholder="選擇項目名稱">
            <el-option
              v-for="item in titleList"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
          <el-date-picker
            v-model="selectDate"
            class="date-picker"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
          <el-button @click="getData">
            <template #icon>
              <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            </template>
          </el-button>
        </div>
        <div class="right-action">
          <el-button type="primary">新增</el-button>
        </div>
      </div>
    </template>
    <el-table :data="data" stripe>
      <el-table-column type="selection" />
      <el-table-column prop="date" label="建立日期">
        <template #default="{ row }">
          {{ new Date(row.date).toLocaleDateString("zh-TW") }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="支出/收入" />
      <el-table-column prop="title" label="項目名稱" />
      <el-table-column prop="amount" label="金額" />
      <el-table-column label="operations">
        <template #default>
          <el-button type="primary" size="small">編輯</el-button>
          <el-button type="danger" size="small">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <div class="pagination-block">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="data.length"
          :page-sizes="[10, 15, 20, 30]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>
  </DefaultContainer>
</template>
<style lang="scss" scoped>
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

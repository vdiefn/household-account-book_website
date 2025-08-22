<script lang="ts" setup>
import { DefaultContainer, CreateOrEditRecord, Card } from "@/components";
import { ref, onMounted, useTemplateRef, computed } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import api from "@/utils/api";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw";
import type { Record, RecordQuery } from "@/types/record";
import type { Category } from "@/types/category";

type SelectType = "%" | "income" | "expense";

const data = ref<Record[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const startOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");
const endOfMonth = dayjs().endOf("month").format("YYYY-MM-DD");
const selectCategories = ref<string[]>([]);
const selectType = ref<SelectType>("%");
const selectDate = ref<[string, string] | []>([startOfMonth, endOfMonth]);
const categoryList = ref<Category[]>([]);
const loading = ref(false);
const keyword = ref("");
const createOrEditRecordRef = useTemplateRef("createOrEditRecordRef");
dayjs.locale("zh-cn");
dayjs().format();

const filterData = computed(() => {
  return data.value.filter((item) => {
    return (
      !keyword.value ||
      item.name.toLowerCase().includes(keyword.value.toLowerCase())
    );
  });
});

const expenseAmount = computed(() => {
  return filterData.value
    .filter((item) => item.type === "expense")
    .reduce((a, c) => (a += c.amount), 0);
});

const incomeAmount = computed(() => {
  return filterData.value
    .filter((item) => item.type === "income")
    .reduce((a, c) => (a += c.amount), 0);
});

const balance = computed(() => {
  return incomeAmount.value - expenseAmount.value;
});

const getData = async (): Promise<void> => {
  const params = {} as RecordQuery;
  let typeList: string[] = [];
  loading.value = true;

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
    console.log(data.value);
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

const handleCreateRecord = () => {
  createOrEditRecordRef.value?.open({ type: "create" });
};

const handleDeleteRecord = async (record: Record): Promise<void> => {
  await ElMessageBox.confirm(`請確認是否刪除：${record.name}`, "Warning", {
    confirmButtonText: "確認",
    cancelButtonText: "取消",
    type: "warning",
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        instance.confirmButtonLoading = true;
        try {
          const response = await api.delete(`/records/${record._id}`);

          if (response.status === 200) {
            ElMessage({
              type: "success",
              message: "刪除成功",
            });
            done();
            await getData();
          } else {
            ElMessage({
              type: "error",
              message: response.data.message,
            });
            instance.confirmButtonLoading = false;
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        done();
      }
    },
  });
};

const handleEditRecord = (row: Record) => {
  createOrEditRecordRef.value?.open({ type: "edit", data: row });
};

const handleCurrentChange = () => {};

const handleSizeChange = () => {};

onMounted(() => {
  getData();
  getCategory();
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
        <div class="right-action">
          <el-button type="primary" @click="handleCreateRecord">新增</el-button>
        </div>
      </div>
    </template>
    <div class="amount-wrapper">
      <Card :title="'支出'" :amount="expenseAmount" />
      <el-card shadow="never">
        <div class="info-wrapper" style="">
          <span>{{ "結餘" }}</span>
          <template v-if="balance > 0">
            <h2 style="color: green">{{ balance }}</h2>
          </template>
          <template v-else>
            <h2 style="color: red">{{ balance }}</h2>
          </template>
        </div>
      </el-card>
      <Card :title="'收入'" :amount="incomeAmount" />
    </div>
    <el-table :data="filterData" stripe v-loading="loading">
      <el-table-column type="selection" />
      <el-table-column prop="date" label="建立日期">
        <template #default="{ row }">
          {{ new Date(row.date).toLocaleDateString("zh-TW") }}
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
      <el-table-column label="operations">
        <template #header>
          <el-input v-model="keyword" size="small" placeholder="搜尋項目名稱" />
        </template>
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEditRecord(row)">
            編輯
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDeleteRecord(row)"
          >
            刪除
          </el-button>
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
  <CreateOrEditRecord
    ref="createOrEditRecordRef"
    @form-update="getData"
    :categoryList="categoryList"
  />
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
.amount-wrapper {
  border-radius: 5px;
  width: 100%;
  margin: 1rem auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .el-card {
    :deep(.el-card__body) {
      padding: 5px 10px;
    }

    .info-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 250px;
    }
  }
}
</style>

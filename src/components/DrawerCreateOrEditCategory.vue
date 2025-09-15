<script lang="ts" setup>
import { ref, computed } from "vue";
import { useCategoryStore } from "@/store/modules/category";
import type { Category } from "@/types/category";

const categoryStore = useCategoryStore();
const drawer = ref(false);
const keyword = ref("");

const open = () => {
  drawer.value = true;
};

const filterData = computed(() => {
  return categoryStore.categoryData.filter((item) =>
    item.name.toLowerCase().includes(keyword.value.toLowerCase()),
  );
});

const handleCreateCategory = () => {};

const handleEditCategory = (data: Category) => {
  console.log(data);
};

const handleDeleteCategory = (data: Category) => {
  console.log(data);
};

defineExpose({ open });
</script>
<template>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>設定類別</h4>
    </template>
    <div class="action-wrapper">
      <el-input placeholder="請輸入查詢關鍵字" v-model="keyword" />
      <el-button type="primary" @click="handleCreateCategory">新增</el-button>
    </div>
    <el-table :data="filterData" table-layout="auto">
      <el-table-column property="name" label="名稱" />
      <el-table-column width="1">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="handleEditCategory(row)"
          >
            編輯
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDeleteCategory(row)"
          >
            刪除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>
<style lang="scss" scoped>
.action-wrapper {
  display: flex;
  justify-content: space-between;

  .el-input {
    width: 150px;
  }
}

.el-table {
  margin-top: 1rem;

  :deep(.cell) {
    white-space: nowrap;
  }
}
</style>

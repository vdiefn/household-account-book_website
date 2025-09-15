<script lang="ts" setup>
import { ref, reactive } from "vue";
import api from "@/utils/api";
import { ElMessage } from "element-plus";
import { formatDate } from "@/utils/dayjs";
import type { Category } from "@/types/category";
import type { Record } from "@/types/record";

type OpenMode =
  | {
      type: "create";
    }
  | {
      type: "edit";
      data: Record;
    };

const props = defineProps<{
  categoryList: Category[];
}>();

const dialogVisible = ref(false);
const currentMode = ref<"create" | "edit">("create");
const form = reactive({
  name: "",
  category: "",
  amount: 1,
  type: "",
  date: "",
  note: "",
  _id: "",
});
const emit = defineEmits<{ (e: "form-update"): void }>();

const open = (mode: OpenMode) => {
  Object.assign(form, {
    name: "",
    amount: 1,
    type: "",
    date: "",
    note: "",
    category: "",
  });
  if (mode.type === "create") {
    currentMode.value = "create";
    form.date = formatDate(new Date());
  } else if (mode.type === "edit") {
    currentMode.value = "edit";
    Object.assign(form, mode.data);
    form.category = mode.data.category._id;
  }

  dialogVisible.value = true;
};

const confirm = async (): Promise<void> => {
  const payload = {
    name: form.name,
    category: form.category,
    amount: form.amount,
    type: form.type,
    date: form.date,
    note: form.note,
    _id: currentMode.value === "create" ? "" : form._id,
  };
  console.log(payload);
  const method = currentMode.value === "create" ? "post" : "put";
  const url =
    currentMode.value === "create" ? "/records" : `/records/${form._id}`;
  try {
    const res = await api[method](url, payload);

    if (res.status === 200) {
      ElMessage({
        message: res.data.message,
        type: "success",
      });
      emit("form-update");
      dialogVisible.value = false;
    } else {
      ElMessage({
        message:
          res.data?.message || currentMode.value === "create"
            ? "新增失敗"
            : "修改失敗",
        type: "error",
      });
    }
  } catch (err) {
    console.error(err);
  }
};

defineExpose({ open });
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="currentMode === 'create' ? '新增資料' : '修改資料'"
    width="500"
    align-center
  >
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="名稱">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="支出/收入">
        <el-select v-model="form.type" placeholder="please select your zone">
          <el-option label="支出" value="expense" />
          <el-option label="收入" value="income" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="form.date"
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="分類">
        <el-select v-model="form.category" placeholder="選擇Category名稱">
          <el-option
            v-for="item in props.categoryList"
            :key="item._id"
            :value="item._id"
            :label="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="金額">
        <el-input-number v-model="form.amount" :min="1" />
      </el-form-item>
      <el-form-item label="備註">
        <el-input v-model="form.note" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">確認</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>

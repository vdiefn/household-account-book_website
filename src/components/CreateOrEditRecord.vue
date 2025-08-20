<script lang="ts" setup>
import { ref, reactive } from "vue";
import api from "@/utils/api";
import { ElMessage } from "element-plus";

const dialogVisible = ref(false);
const form = reactive({
  title: "",
  amount: "",
  type: "",
  date: "",
  note: "",
});
const emit = defineEmits<{ (e: "form-update"): void }>();

const open = () => {
  Object.assign(form, { title: "", amount: "", type: "", date: "", note: "" });
  dialogVisible.value = true;
};

const confirm = async (): Promise<void> => {
  try {
    const res = await api.post("/record", form);
    console.log(res);
    if (res.status === 201) {
      ElMessage({
        message: res.data.message,
        type: "success",
      });
      emit("form-update");
      dialogVisible.value = false;
    } else {
      ElMessage({
        message: res.data?.message || "新增失敗",
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
    title="新增一筆紀錄"
    width="500"
    align-center
  >
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="名稱">
        <el-input v-model="form.title" />
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

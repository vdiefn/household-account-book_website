<script lang="ts" setup>
import { ref } from "vue";
const dialogVisible = ref(false);

const open = () => {
  dialogVisible.value = true;
};

defineExpose({ open });
</script>
<template>
  <el-dialog v-model="dialogVisible" title="Warning" width="500" align-center>
    <span>Open the dialog from the center from the screen</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>

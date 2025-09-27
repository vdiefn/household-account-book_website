<script lang="ts" setup>
import { useUserStore } from "@/store/modules/user";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { formatTime } from "@/utils/dayjs";

const userStore = useUserStore();
const currentTime = ref<Date | string>(new Date());
const handleLogout = () => {
  console.log("登出");
};

let timer = 0;
onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = formatTime(currentTime.value);
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
  timer = 0;
});
</script>
<template>
  <div class="header-container">
    <div class="info-wrapper">
      <div class="text-wrapper">
        <p>{{ formatTime(currentTime) }}</p>
        <el-popover class="box-item" placement="bottom" :width="100">
          <template #reference>
            <i>
              <font-awesome-icon icon="fa-solid fa-circle-user" size="2xl" />
            </i>
          </template>
          <template #default>
            <div
              style="display: flex; flex-direction: column; align-items: center"
            >
              <p>username{{ userStore.userInfo.name }}</p>
              <ElButton size="small" style="width: 100%">修改密碼</ElButton>
            </div>
          </template>
        </el-popover>
      </div>

      <ElButton @click="handleLogout" circle type="success" plain>
        <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
      </ElButton>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.header-container {
  width: 100%;
  height: $header-height;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  opacity: 10;

  .info-wrapper {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-radius: $header-radius;
    padding: 0 12px;
    background-color: $background-color;
    width: 20%;
    height: 100%;
    border-top-left-radius: $header-radius;
    border-bottom-left-radius: $header-radius;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);

    .text-wrapper {
      text-align: center;
      flex: 1;
      display: flex;
      justify-content: space-around;
      align-items: center;

      p {
        margin: 0;
        font-weight: 700;
        font-size: 1rem;
        color: $default-text-color;
      }

      .box-item {
        margin-top: 10px;
      }
    }

    button {
      margin-right: 1rem;
    }
  }
}
</style>

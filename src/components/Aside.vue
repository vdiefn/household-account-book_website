<script lang="ts" setup>
import { routes } from "../router";
import { useRouter } from "vue-router";

const router = useRouter();
const sidebar = routes.find((r) => r.path === "/")?.children || [];

const handleSelect = (name: string) => {
  router.push({ name });
};
</script>
<template>
  <div class="aside-container">
    <el-menu @select="handleSelect">
      <el-menu-item v-for="item in sidebar" :key="item.name" :index="item.name">
        <div class="menu-item-wrapper">
          <font-awesome-icon :icon="item.meta.icon" />
          <span>{{ item.meta.title }}</span>
        </div>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<style lang="scss" scoped>
.aside-container {
  height: 90%;
  background-color: white;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  margin-top: 15%;

  .el-menu {
    margin: auto;

    .el-menu-item {
      display: flex;
      align-items: center;

      .menu-item-wrapper {
        display: flex;
        align-items: center;
        gap: 10px;

        .menu-icon,
        span {
          font-size: 1.1rem;
        }
      }
    }
  }
}
</style>

<script lang="ts" setup>
import { RouterView } from "vue-router";
import { Aside, Header } from "@/components";
import { ref } from "vue";
import { ElDrawer } from "element-plus";

const drawerVisible = ref(false);
</script>
<template>
  <div class="container">
    <el-drawer v-model="drawerVisible" direction="ltr" size="40%">
      <Aside></Aside>
    </el-drawer>
    <div class="btn-wrapper">
      <el-button
        class="drawer-btn"
        type="info"
        @click="drawerVisible = true"
        link
      >
        <font-awesome-icon icon="fa-solid fa-bars" />
      </el-button>
    </div>
    <aside class="sidebar">
      <Aside></Aside>
    </aside>

    <div class="main-container">
      <header class="header">
        <Header></Header>
      </header>
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid red;
  background-image: url("/background-image.jpg");
  background-repeat: no-repeat;
  background-size: cover;

  .btn-wrapper {
    margin: 1rem;
  }

  .sidebar {
    display: none;
  }

  .header {
    display: none;
  }

  .content {
    flex: 1;
    margin: 0 auto;
    width: 95%;
  }
}

@media (min-width: $breakpoint-desktop) {
  .container {
    display: grid;
    grid-template-columns: 1fr 7fr;
    grid-template-rows: 100%;
    gap: 1rem;

    .btn-wrapper {
      display: none;
    }

    .sidebar {
      display: inline-block;
    }

    .main-container {
      display: grid;
      grid-template-rows: 50px 1fr;
      gap: 1rem;
      margin: 1rem;

      .header {
        display: flex;
        align-items: center;
      }

      .content {
        display: block;
        width: 100%;
      }
    }
  }
}
</style>

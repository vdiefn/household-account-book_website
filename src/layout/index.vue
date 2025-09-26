<script lang="ts" setup>
import { RouterView } from "vue-router";
import Aside from "@/components/Aside.vue";
import Header from "@/components/Header.vue";
</script>
<template>
  <div class="container">
    <aside>
      <Aside></Aside>
    </aside>
    <main>
      <Header></Header>
      <RouterView></RouterView>
    </main>
  </div>
</template>
<style lang="scss" scoped>
.container {
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 100%;
  position: relative;

  &::before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: url("/background-image.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    z-index: -1;
  }

  aside {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    height: 100%;
  }
}
</style>

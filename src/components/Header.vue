<script lang="ts" setup>
const handleLogout = () => {
  console.log("登出");
};
</script>
<template>
  <div class="header-wrapper">
    <div class="button-wrapper">
      <div class="text-wrapper">
        <p>2025/09/26</p>
        <p>User name</p>
      </div>
      <ElButton @click="handleLogout">登出</ElButton>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.header-wrapper {
  width: 98%;
  height: $header-height;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .button-wrapper {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 12px;
    background-color: $background-color;
    width: 30%;
    height: 100%;
    border-top-left-radius: $header-radius;
    border-bottom-left-radius: $header-radius;
    text-align: center;

    .text-wrapper {
      border: 1px solid red;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
  }
}
</style>

<script lang="ts" setup></script>
<template>
  <section class="default-container">
    <header class="default-header">
      <slot name="header"></slot>
    </header>
    <slot name="default"></slot>
    <footer class="default-footer">
      <slot name="footer"></slot>
    </footer>
  </section>
</template>
<style lang="scss" scoped>
.default-container {
  border: 1px solid $background-border;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: $background-radius;
  padding: 1rem;
  background-color: $background-color;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
}

.default-header {
  display: flex;
  align-items: center;
  color: $default-text-color;
}

.default-footer {
  display: flex;
  justify-content: center;
  margin: 2rem auto;
}
</style>

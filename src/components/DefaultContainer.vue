<script lang="ts" setup></script>
<template>
  <section class="default-container">
    <header class="default-header">
      <slot name="header" />
    </header>
    <slot name="default" />
    <footer class="default-footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
<style lang="scss" scoped>
.default-container {
  border: 1px solid $background-border;
  height: 83%;
  width: 98%;
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
}

.default-footer {
  display: flex;
  justify-content: center;
  margin: 2rem auto;
}
</style>

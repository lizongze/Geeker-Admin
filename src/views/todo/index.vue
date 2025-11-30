<template>
  <div class="todo-page">
    <TodoApp />
  </div>
</template>

<script setup lang="ts">
import TodoApp from "@/components/todo/TodoApp.vue";
</script>

<style scoped>
.todo-page {
  min-height: 100vh;
  background: #f5f7fa;
}
</style>

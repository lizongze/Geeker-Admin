<template>
  <div class="todo-app">
    <!-- 简单布局使用模板 -->
    <div class="todo-app__header">
      <h1 class="todo-app__title">待办事项</h1>
      <p class="todo-app__subtitle">管理您的日常任务</p>
    </div>

    <!-- 复杂渲染逻辑使用TSX动态组件 -->
    <component :is="renderContent" />
  </div>
</template>

<script setup lang="tsx">
import { ref } from "vue";
import { ElCard, ElSkeleton, ElAlert, ElEmpty } from "element-plus";
import { useTodoStore } from "./stores/todoStore";
import TodoForm from "./components/TodoForm.vue";
import TodoFilter from "./components/TodoFilter.vue";
import TodoList from "./components/TodoList.vue";
import TodoStats from "./components/TodoStats.vue";
import type { ITodoItem } from "./types";

const todoStore = useTodoStore();

// 编辑状态
const editingTodo = ref<{ id: string; title: string } | null>(null);

// 处理添加待办事项
const handleAddTodo = (title: string): void => {
  todoStore.addTodo(title);
};

// 处理切换完成状态
const handleToggleTodo = (id: string): void => {
  todoStore.toggleTodo(id);
};

// 处理开始编辑
const handleStartEdit = (todo: ITodoItem): void => {
  editingTodo.value = { id: todo.id, title: todo.title };
};

// 处理保存编辑
const handleSaveEdit = (id: string, title: string): void => {
  todoStore.editTodo(id, title);
  editingTodo.value = null;
};

// 处理取消编辑
const handleCancelEdit = (): void => {
  editingTodo.value = null;
};

// 处理删除待办事项
const handleDeleteTodo = (id: string): void => {
  todoStore.deleteTodo(id);
};

// 处理筛选变更
const handleFilterChange = (filter: string): void => {
  todoStore.setFilter(filter as any);
};

// 处理清除已完成
const handleClearCompleted = (): void => {
  todoStore.clearCompleted();
};

// 复杂渲染逻辑使用TSX函数
const renderContent = () => {
  if (todoStore.loading) {
    return (
      <div class="todo-app__loading">
        <ElCard class="todo-app__loading-card">
          <ElSkeleton rows={5} animated />
        </ElCard>
      </div>
    );
  }

  if (todoStore.error) {
    return (
      <div class="todo-app__error">
        <ElAlert title={todoStore.error} type="error" show-icon closable={false} />
      </div>
    );
  }

  return (
    <div class="todo-app__content">
      <ElCard class="todo-app__card">
        {/* 添加待办事项表单 */}
        <TodoForm onAddTodo={handleAddTodo} class="todo-app__form" />

        {/* 统计信息 */}
        {todoStore.hasTodos && <TodoStats stats={todoStore.stats} class="todo-app__stats" />}

        {/* 筛选器 */}
        {todoStore.hasTodos && (
          <TodoFilter
            currentFilter={todoStore.filter}
            hasCompleted={todoStore.hasCompleted}
            onUpdateFilter={handleFilterChange}
            onClearCompleted={handleClearCompleted}
            class="todo-app__filter"
          />
        )}

        {/* 待办事项列表 */}
        {todoStore.hasTodos ? (
          <TodoList
            todos={todoStore.filteredTodos}
            editingTodo={editingTodo.value}
            onToggleTodo={handleToggleTodo}
            onStartEdit={handleStartEdit}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onDeleteTodo={handleDeleteTodo}
            class="todo-app__list"
          />
        ) : (
          <div class="todo-app__empty">
            <ElEmpty description="暂无待办事项" />
          </div>
        )}
      </ElCard>
    </div>
  );
};
</script>

<style scoped>
/* 模板的局部样式 */
.todo-app {
  max-width: 800px;
  min-height: 100vh;
  padding: 20px;
  margin: 0 auto;
  background-color: #f5f7fa;
}
.todo-app__header {
  margin-bottom: 30px;
  text-align: center;
}
.todo-app__title {
  margin-bottom: 8px;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
}
.todo-app__subtitle {
  margin: 0;
  font-size: 1rem;
  color: #718096;
}
</style>

<style>
/* TSX renderFunc 的全局BEM样式 */
.todo-app__loading {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
.todo-app__loading-card {
  width: 100%;
  max-width: 600px;
}
.todo-app__error {
  margin: 20px 0;
}
.todo-app__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.todo-app__card {
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%);
}
.todo-app__form {
  margin-bottom: 24px;
}
.todo-app__stats {
  margin-bottom: 16px;
}
.todo-app__filter {
  margin-bottom: 20px;
}
.todo-app__list {
  min-height: 200px;
}
.todo-app__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 40px 0;
}

/* 响应式设计 */
@media (width <= 768px) {
  .todo-app {
    padding: 16px;
  }
  .todo-app__title {
    font-size: 2rem;
  }
}
</style>

<template>
  <div class="todo-app">
    <!-- 主应用布局 -->
    <div class="todo-app__container">
      <!-- 应用标题 -->
      <div class="todo-app__header">
        <h1 class="todo-app__title">
          <i class="el-icon-notebook-2" style="margin-right: 8px"></i>
          TodoList 任务管理
        </h1>
        <p class="todo-app__subtitle">高效管理您的日常任务</p>
      </div>

      <!-- 任务添加组件 -->
      <TodoAdd :on-submit="handleAddTodo" :on-cancel="handleCancelAdd" :submitting="submitting" class="todo-app__add-section" />

      <!-- 任务筛选和统计组件 -->
      <TodoFilter
        :stats="stats"
        :current-filter="filter"
        :search-keyword="searchKeyword"
        :on-update-filter="updateFilter"
        :on-update-search="updateSearch"
        :on-clear-completed="clearCompleted"
        class="todo-app__filter-section"
      />

      <!-- 任务列表组件 -->
      <TodoList
        :todos="filteredTodos"
        :loading="loading"
        :error="error"
        :on-toggle-todo="handleToggleTodo"
        :on-delete-todo="handleDeleteTodo"
        :on-edit-todo="handleEditTodo"
        class="todo-app__list-section"
      />

      <!-- 底部信息 -->
      <div class="todo-app__footer">
        <p class="todo-app__footer-text">数据自动保存到本地存储 • 当前版本 v1.0.0</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
// import { ref } from 'vue';
import { ElMessage } from "element-plus";
import TodoAdd from "./TodoAdd.vue";
import TodoList from "./TodoList.vue";
import TodoFilter from "./TodoFilter.vue";
import { useTodoManager, useTodoForm } from "./composables";
import type { ITodoFormData } from "./types";

// 使用任务管理组合函数
const {
  todos,
  filteredTodos,
  loading,
  error,
  filter,
  searchKeyword,
  stats,
  addTodo,
  deleteTodo,
  toggleTodo,
  updateTodoContent,
  clearCompleted,
  updateFilter,
  updateSearch
} = useTodoManager();

// 使用表单管理组合函数
const { submitting } = useTodoForm();

// 添加新任务
const handleAddTodo = async (formData: ITodoFormData) => {
  try {
    submitting.value = true;
    const newTodo = addTodo(formData);
    ElMessage.success(`任务"${newTodo.title}"添加成功`);
  } catch (err) {
    ElMessage.error("添加任务失败");
    console.error("添加任务失败:", err);
  } finally {
    submitting.value = false;
  }
};

// 取消添加
const handleCancelAdd = () => {
  ElMessage.info("已取消添加任务");
};

// 编辑任务
const handleEditTodo = (id: string, content: string, priority?: string) => {
  const updated = updateTodoContent(id, content, priority as any);
  if (updated) {
    ElMessage.success("任务编辑成功");
  } else {
    ElMessage.error("任务编辑失败");
  }
};

// 处理删除任务
const handleDeleteTodo = (id: string) => {
  const deleted = deleteTodo(id);
  if (deleted) {
    ElMessage.success("任务删除成功");
  }
};

// 处理切换任务状态
const handleToggleTodo = (id: string) => {
  const toggled = toggleTodo(id);
  if (toggled) {
    const todo = todos.value.find(t => t.id === id);
    if (todo) {
      const action = todo.completed ? "完成" : "取消完成";
      ElMessage.success(`任务"${todo.title}"已${action}`);
    }
  }
};

// // 处理清除已完成任务
// const handleClearCompleted = () => {
//   clearCompleted();
//   ElMessage.success('已清除所有已完成任务');
// };

// // 处理筛选更新
// const handleUpdateFilter = (newFilter: string) => {
//   updateFilter(newFilter as any);
// };

// // 处理搜索更新
// const handleUpdateSearch = (keyword: string) => {
//   updateSearch(keyword);
// };
</script>

<style scoped>
.todo-app {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.todo-app__container {
  max-width: 800px;
  margin: 0 auto;
  overflow: hidden;
  background: rgb(255 255 255 / 95%);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgb(0 0 0 / 10%);
}
.todo-app__header {
  padding: 30px;
  color: white;
  text-align: center;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}
.todo-app__title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 600;
}
.todo-app__subtitle {
  margin: 0;
  font-size: 16px;
  font-weight: 300;
  opacity: 0.9;
}
.todo-app__add-section {
  border-bottom: 1px solid #e2e8f0;
}
.todo-app__filter-section {
  border-bottom: 1px solid #e2e8f0;
}
.todo-app__list-section {
  min-height: 400px;
  padding: 20px;
}
.todo-app__footer {
  padding: 16px 20px;
  text-align: center;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}
.todo-app__footer-text {
  margin: 0;
  font-size: 12px;
  color: #718096;
}

@media (width <= 768px) {
  .todo-app {
    padding: 10px;
  }
  .todo-app__header {
    padding: 20px;
  }
  .todo-app__title {
    font-size: 24px;
  }
  .todo-app__subtitle {
    font-size: 14px;
  }
  .todo-app__list-section {
    padding: 15px;
  }
}

@media (width <= 480px) {
  .todo-app__title {
    flex-direction: column;
    gap: 8px;
    font-size: 20px;
  }
  .todo-app__header {
    padding: 15px;
  }
}
</style>

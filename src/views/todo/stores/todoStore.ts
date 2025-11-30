import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ITodoItem, TodoFilterType, ITodoStats } from "../types";

// 生成唯一ID
const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// 获取当前时间戳
const getCurrentTime = (): string => {
  return new Date().toISOString();
};

// 本地存储键名
const TODO_STORAGE_KEY = "vue-todo-list";

export const useTodoStore = defineStore("todo", () => {
  // 状态
  const todos = ref<ITodoItem[]>([]);
  const filter = ref<TodoFilterType>("all");
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 从本地存储加载数据
  const loadFromStorage = (): void => {
    try {
      const stored = localStorage.getItem(TODO_STORAGE_KEY);
      if (stored) {
        todos.value = JSON.parse(stored);
      }
    } catch (err) {
      error.value = "加载本地数据失败";
      console.error("加载本地存储失败:", err);
    }
  };

  // 保存到本地存储
  const saveToStorage = (): void => {
    try {
      localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos.value));
    } catch (err) {
      error.value = "保存本地数据失败";
      console.error("保存到本地存储失败:", err);
    }
  };

  // 计算属性
  const filteredTodos = computed(() => {
    switch (filter.value) {
      case "active":
        return todos.value.filter(todo => !todo.completed);
      case "completed":
        return todos.value.filter(todo => todo.completed);
      default:
        return todos.value;
    }
  });

  const stats = computed((): ITodoStats => {
    const total = todos.value.length;
    const completed = todos.value.filter(todo => todo.completed).length;
    const active = total - completed;
    return { total, active, completed };
  });

  const hasTodos = computed(() => todos.value.length > 0);
  const hasCompleted = computed(() => todos.value.some(todo => todo.completed));

  // 操作方法
  const addTodo = (title: string): void => {
    if (!title.trim()) return;

    const newTodo: ITodoItem = {
      id: generateId(),
      title: title.trim(),
      completed: false,
      createdAt: getCurrentTime(),
      updatedAt: getCurrentTime()
    };

    todos.value.unshift(newTodo);
    saveToStorage();
  };

  const toggleTodo = (id: string): void => {
    const todo = todos.value.find(todo => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      todo.updatedAt = getCurrentTime();
      saveToStorage();
    }
  };

  const editTodo = (id: string, title: string): void => {
    const todo = todos.value.find(todo => todo.id === id);
    if (todo && title.trim()) {
      todo.title = title.trim();
      todo.updatedAt = getCurrentTime();
      saveToStorage();
    }
  };

  const deleteTodo = (id: string): void => {
    const index = todos.value.findIndex(todo => todo.id === id);
    if (index !== -1) {
      todos.value.splice(index, 1);
      saveToStorage();
    }
  };

  const clearCompleted = (): void => {
    todos.value = todos.value.filter(todo => !todo.completed);
    saveToStorage();
  };

  const setFilter = (newFilter: TodoFilterType): void => {
    filter.value = newFilter;
  };

  // 初始化时加载数据
  loadFromStorage();

  return {
    // 状态
    todos,
    filter,
    loading,
    error,

    // 计算属性
    filteredTodos,
    stats,
    hasTodos,
    hasCompleted,

    // 方法
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    clearCompleted,
    setFilter,
    loadFromStorage,
    saveToStorage
  };
});

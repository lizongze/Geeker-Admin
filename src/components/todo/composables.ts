import { ref, computed, watch } from "vue";
import type { Ref } from "vue";
import type { ITodo, TodoFilterType, ITodoStats, ITodoFormData } from "./types";

// 任务管理组合函数
export function useTodoManager() {
  const todos: Ref<ITodo[]> = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const filter: Ref<TodoFilterType> = ref("all");
  const searchKeyword = ref("");

  // 统计信息
  const stats = computed<ITodoStats>(() => {
    const total = todos.value.length;
    const completed = todos.value.filter(todo => todo.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      active,
      completionRate
    };
  });

  // 过滤后的任务列表
  const filteredTodos = computed(() => {
    let filtered = todos.value;

    // 根据筛选条件过滤
    if (filter.value === "active") {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter.value === "completed") {
      filtered = filtered.filter(todo => todo.completed);
    }

    // 根据搜索关键词过滤
    if (searchKeyword.value.trim()) {
      const keyword = searchKeyword.value.toLowerCase();
      filtered = filtered.filter(
        todo =>
          todo.title.toLowerCase().includes(keyword) || (todo.description && todo.description.toLowerCase().includes(keyword))
      );
    }

    return filtered;
  });

  // 添加任务
  const addTodo = (formData: ITodoFormData) => {
    const newTodo: ITodo = {
      id: generateId(),
      title: formData.title.trim(),
      description: formData.description?.trim(),
      completed: false,
      priority: formData.priority || "medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    todos.value.unshift(newTodo);
    saveToLocalStorage();
    return newTodo;
  };

  // 删除任务
  const deleteTodo = (id: string) => {
    const index = todos.value.findIndex(todo => todo.id === id);
    if (index !== -1) {
      todos.value.splice(index, 1);
      saveToLocalStorage();
      return true;
    }
    return false;
  };

  // 切换任务完成状态
  const toggleTodo = (id: string) => {
    const todo = todos.value.find(todo => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      todo.updatedAt = new Date().toISOString();
      saveToLocalStorage();
      return true;
    }
    return false;
  };

  // 编辑任务内容
  const updateTodoContent = (id: string, title: string, priority?: Priority) => {
    const todo = todos.value.find(t => t.id === id);
    if (todo) {
      todo.title = title;
      if (priority) {
        todo.priority = priority;
      }
      todo.updatedAt = new Date().toISOString();
      saveToLocalStorage();
      return true;
    }
    return false;
  };

  // 更新任务
  const updateTodo = (id: string, updates: Partial<ITodoFormData>) => {
    const todo = todos.value.find(todo => todo.id === id);
    if (todo) {
      Object.assign(todo, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      saveToLocalStorage();
      return true;
    }
    return false;
  };

  // 清除已完成任务
  const clearCompleted = () => {
    todos.value = todos.value.filter(todo => !todo.completed);
    saveToLocalStorage();
  };

  // 更新筛选条件
  const updateFilter = (newFilter: TodoFilterType) => {
    filter.value = newFilter;
  };

  // 更新搜索关键词
  const updateSearch = (keyword: string) => {
    searchKeyword.value = keyword;
  };

  // 从本地存储加载数据
  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem("vue3-todo-list");
      if (stored) {
        todos.value = JSON.parse(stored);
      }
    } catch (err) {
      console.error("加载本地存储数据失败:", err);
      error.value = "加载数据失败";
    }
  };

  // 保存到本地存储
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem("vue3-todo-list", JSON.stringify(todos.value));
    } catch (err) {
      console.error("保存到本地存储失败:", err);
      error.value = "保存数据失败";
    }
  };

  // 生成唯一ID
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // 初始化时加载数据
  loadFromLocalStorage();

  // 监听数据变化自动保存
  watch(todos, saveToLocalStorage, { deep: true });

  return {
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
    updateTodo,
    clearCompleted,
    updateFilter,
    updateSearch,
    loadFromLocalStorage,
    saveToLocalStorage
  };
}

// 任务表单管理组合函数
export function useTodoForm() {
  const formData = ref<ITodoFormData>({
    title: "",
    description: "",
    priority: "medium"
  });

  const errors = ref<Record<string, string>>({});
  const submitting = ref(false);

  const validateForm = (): boolean => {
    errors.value = {};

    if (!formData.value.title.trim()) {
      errors.value.title = "任务标题不能为空";
    } else if (formData.value.title.trim().length > 100) {
      errors.value.title = "任务标题不能超过100个字符";
    }

    if (formData.value.description && formData.value.description.length > 500) {
      errors.value.description = "任务描述不能超过500个字符";
    }

    return Object.keys(errors.value).length === 0;
  };

  const resetForm = () => {
    formData.value = {
      title: "",
      description: "",
      priority: "medium"
    };
    errors.value = {};
  };

  return {
    formData,
    errors,
    submitting,
    validateForm,
    resetForm
  };
}

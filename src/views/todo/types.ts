// TodoList应用类型定义

export interface ITodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TodoFilterType = "all" | "active" | "completed";

export interface ITodoState {
  todos: ITodoItem[];
  filter: TodoFilterType;
  loading: boolean;
  error: string | null;
}

export interface ITodoFormData {
  title: string;
}

export interface ITodoActions {
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  editTodo: (id: string, title: string) => void;
  deleteTodo: (id: string) => void;
  clearCompleted: () => void;
  setFilter: (filter: TodoFilterType) => void;
}

export interface ITodoStats {
  total: number;
  active: number;
  completed: number;
}

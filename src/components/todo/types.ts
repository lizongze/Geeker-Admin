// TodoList应用类型定义

export interface ITodo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  priority?: "low" | "medium" | "high";
}

export type TodoFilterType = "all" | "active" | "completed";

export interface ITodoStats {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
}

export interface ITodoSearchParams {
  keyword: string;
  filter: TodoFilterType;
}

export interface ITodoFormData {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
}

export interface ITodoApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ITodoListResponse {
  todos: ITodo[];
  total: number;
  page: number;
  pageSize: number;
}

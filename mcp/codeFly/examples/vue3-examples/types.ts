// 通用类型定义范例 - 不包含具体业务类型
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface ListResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "checkbox" | "date";
  required?: boolean;
  options?: Array<{ label: string; value: any }>;
}

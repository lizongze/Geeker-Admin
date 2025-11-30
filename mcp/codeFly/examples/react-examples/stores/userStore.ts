import { makeAutoObservable, flow } from "mobx";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export class UserStore {
  users: User[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // 使用flow处理异步操作
  fetchUsers = flow(function* (this: UserStore) {
    this.loading = true;
    this.error = null;

    try {
      // 模拟API调用
      const response: User[] = yield fetch("/api/users").then(res => res.json());
      this.users = response;
    } catch (error) {
      this.error = error instanceof Error ? error.message : "获取用户列表失败";
    } finally {
      this.loading = false;
    }
  });

  addUser = (user: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
  };

  removeUser = (id: string) => {
    this.users = this.users.filter(user => user.id !== id);
  };

  updateUser = (id: string, updates: Partial<User>) => {
    const user = this.users.find(u => u.id === id);
    if (user) {
      Object.assign(user, updates);
    }
  };

  get userCount() {
    return this.users.length;
  }
}

export const userStore = new UserStore();

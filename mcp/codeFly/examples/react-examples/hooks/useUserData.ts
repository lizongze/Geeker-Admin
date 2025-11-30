import { useEffect } from "react";
import { userStore } from "../stores/userStore";

export const useUserData = () => {
  useEffect(() => {
    userStore.fetchUsers();
  }, []);

  return {
    users: userStore.users,
    loading: userStore.loading,
    error: userStore.error,
    addUser: userStore.addUser,
    removeUser: userStore.removeUser,
    updateUser: userStore.updateUser,
    userCount: userStore.userCount
  };
};

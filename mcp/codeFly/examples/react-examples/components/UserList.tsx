import React from "react";
import { observer } from "mobx-react-lite";
import { useUserData } from "../hooks/useUserData";
import { User } from "../stores/userStore";

export const UserList: React.FC = observer(() => {
  const { users, loading, error, removeUser } = useUserData();

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (error) {
    return <div className="error">错误: {error}</div>;
  }

  return (
    <div className="user-list">
      <h2>用户列表 ({users.length})</h2>
      {users.length === 0 ? (
        <div className="empty">暂无用户</div>
      ) : (
        <div className="users">
          {users.map(user => (
            <UserItem key={user.id} user={user} onRemove={removeUser} />
          ))}
        </div>
      )}
    </div>
  );
});

const UserItem: React.FC<{ user: User; onRemove: (id: string) => void }> = ({ user, onRemove }) => {
  return (
    <div className="user-item">
      <div className="user-info">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <span className="role">{user.role}</span>
      </div>
      <button onClick={() => onRemove(user.id)}>删除</button>
    </div>
  );
};

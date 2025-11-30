<template>
  <div class="todo-list">
    <!-- 复杂内容渲染使用TSX -->
    <component :is="renderContent" />
  </div>
</template>

<script setup lang="tsx">
import { ref } from "vue";
import {
  ElEmpty,
  ElSkeleton,
  ElAlert,
  ElCard,
  ElCheckbox,
  ElButton,
  ElTag,
  ElMessageBox,
  ElInput,
  ElSelect,
  ElOption
} from "element-plus";
import type { ITodo, Priority } from "./types";

interface IProps {
  todos: ITodo[];
  loading?: boolean;
  error?: string | null;
  onToggleTodo?: (id: string) => void;
  onDeleteTodo?: (id: string) => void;
  onEditTodo?: (id: string, todo: ITodo) => void;
}

const props = withDefaults(defineProps<IProps>(), {
  loading: false,
  error: null
});

// 编辑状态管理
const editingId = ref<string | null>(null);
const editContent = ref("");
const editPriority = ref<Priority>("medium");

// 开始编辑
const startEdit = (todo: ITodo) => {
  editingId.value = todo.id;
  editContent.value = todo.title;
  editPriority.value = todo.priority || "medium";
};

// 保存编辑
const saveEdit = () => {
  if (editingId.value && editContent.value.trim()) {
    props.onEditTodo?.(editingId.value, editContent.value.trim(), editPriority.value);
    editingId.value = null;
    editContent.value = "";
  }
};

// 取消编辑
const cancelEdit = () => {
  editingId.value = null;
  editContent.value = "";
};

// 处理删除确认
const handleDelete = async (todo: ITodo) => {
  try {
    await ElMessageBox.confirm(`确定要删除任务"${todo.title}"吗？`, "删除确认", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });
    props.onDeleteTodo?.(todo.id);
  } catch (error) {
    // 用户取消删除
  }
};

// 处理切换完成状态
const handleToggle = (todo: ITodo) => {
  props.onToggleTodo?.(todo.id);
};

// 优先级标签颜色映射
const priorityColorMap = {
  low: "info",
  medium: "warning",
  high: "danger"
};

// 优先级标签文本映射
const priorityTextMap = {
  low: "低",
  medium: "中",
  high: "高"
};

// 渲染单个任务项
const renderTodoItem = (todo: ITodo) => {
  const isEditing = editingId.value === todo.id;

  return (
    <ElCard
      class={`todo-list__item ${todo.completed ? "todo-list__item--completed" : ""}`}
      shadow="hover"
      onDblclick={() => !todo.completed && startEdit(todo)}
    >
      <div class="todo-list__item-content">
        <div class="todo-list__item-main">
          <ElCheckbox
            modelValue={todo.completed}
            onChange={() => handleToggle(todo)}
            class="todo-list__checkbox"
            disabled={isEditing}
          />

          <div class="todo-list__item-info">
            {isEditing ? (
              <div class="todo-list__edit-form">
                <ElInput v-model={editContent.value} placeholder="请输入任务内容" size="small" style="margin-bottom: 8px;" />
                <div style="display: flex; gap: 8px; align-items: center;">
                  <ElSelect v-model={editPriority.value} size="small" style="width: 80px;">
                    <ElOption value="low" label="低" />
                    <ElOption value="medium" label="中" />
                    <ElOption value="high" label="高" />
                  </ElSelect>
                  <ElButton type="primary" size="small" onClick={saveEdit}>
                    保存
                  </ElButton>
                  <ElButton size="small" onClick={cancelEdit}>
                    取消
                  </ElButton>
                </div>
              </div>
            ) : (
              <>
                <div class="todo-list__title">
                  {todo.completed ? (
                    <span style="text-decoration: line-through; color: #999;">{todo.title}</span>
                  ) : (
                    <span>{todo.title}</span>
                  )}
                </div>

                {todo.description && <div class="todo-list__description">{todo.description}</div>}

                <div class="todo-list__meta">
                  <ElTag size="small" type={priorityColorMap[todo.priority || "medium"]} class="todo-list__priority">
                    {priorityTextMap[todo.priority || "medium"]}
                  </ElTag>

                  <span class="todo-list__time">{new Date(todo.createdAt).toLocaleDateString()}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {!isEditing && (
          <div class="todo-list__item-actions">
            <ElButton type="danger" size="small" onClick={() => handleDelete(todo)} class="todo-list__delete-btn">
              删除
            </ElButton>
          </div>
        )}
      </div>
    </ElCard>
  );
};

// 渲染加载状态
const renderLoading = () => {
  return (
    <div class="todo-list__loading">
      <ElSkeleton rows={5} animated />
    </div>
  );
};

// 渲染错误状态
const renderError = () => {
  return (
    <div class="todo-list__error">
      <ElAlert title={props.error} type="error" show-icon closable={false} />
    </div>
  );
};

// 渲染空状态
const renderEmpty = () => {
  return (
    <div class="todo-list__empty">
      <ElEmpty description="暂无任务" />
    </div>
  );
};

// 渲染任务列表
const renderTodoItems = () => {
  if (props.todos.length === 0) {
    return renderEmpty();
  }

  return <div class="todo-list__items">{props.todos.map(todo => renderTodoItem(todo))}</div>;
};

// 主内容渲染函数
const renderContent = () => {
  if (props.loading) {
    return renderLoading();
  }

  if (props.error) {
    return renderError();
  }

  return renderTodoItems();
};
</script>

<style scoped>
.todo-list {
  min-height: 400px;
}
</style>

<style>
.todo-list__loading,
.todo-list__error,
.todo-list__empty {
  padding: 40px 0;
  text-align: center;
}
.todo-list__items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.todo-list__item {
  transition: all 0.3s ease;
}
.todo-list__item--completed {
  background-color: #f8f9fa;
  opacity: 0.7;
}
.todo-list__item-content {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
}
.todo-list__item-main {
  display: flex;
  flex: 1;
  gap: 12px;
  align-items: flex-start;
}
.todo-list__checkbox {
  margin-top: 2px;
}
.todo-list__item-info {
  flex: 1;
  min-width: 0;
}
.todo-list__title {
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 500;
  color: #2d3748;
  word-break: break-word;
}
.todo-list__description {
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.4;
  color: #718096;
  word-break: break-word;
}
.todo-list__meta {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 12px;
  color: #a0aec0;
}
.todo-list__priority {
  margin-right: 8px;
}
.todo-list__time {
  font-size: 12px;
}
.todo-list__item-actions {
  flex-shrink: 0;
}
.todo-list__delete-btn {
  min-width: 60px;
}

@media (width <= 768px) {
  .todo-list__item-content {
    flex-direction: column;
    gap: 12px;
  }
  .todo-list__item-actions {
    align-self: flex-end;
  }
  .todo-list__meta {
    flex-wrap: wrap;
  }
}
</style>

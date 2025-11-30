<template>
  <div class="todo-list">
    <div class="todo-list__container">
      <div v-for="todo in todos" :key="todo.id" class="todo-list__item" :class="{ 'todo-list__item--completed': todo.completed }">
        <div class="todo-list__item-content">
          <el-checkbox :model-value="todo.completed" @change="() => onToggleTodo?.(todo.id)" class="todo-list__checkbox" />

          <span
            v-if="!isEditing(todo)"
            class="todo-list__title"
            :class="{ 'todo-list__title--completed': todo.completed }"
            @dblclick="() => onStartEdit?.(todo)"
          >
            {{ todo.title }}
          </span>

          <el-input
            v-else
            v-model="editTitle"
            size="small"
            @keypress="handleKeyPress"
            @blur="handleSave(todo)"
            class="todo-list__edit-input"
            maxlength="100"
            autofocus
          />

          <div class="todo-list__actions">
            <el-button
              v-if="!isEditing(todo)"
              type="primary"
              size="small"
              @click="() => onStartEdit?.(todo)"
              class="todo-list__action-button"
            >
              <el-icon>
                <Edit />
              </el-icon>
            </el-button>

            <el-button
              v-if="isEditing(todo)"
              type="success"
              size="small"
              @click="handleSave(todo)"
              class="todo-list__edit-button"
            >
              <el-icon>
                <Check />
              </el-icon>
            </el-button>

            <el-button v-if="isEditing(todo)" type="warning" size="small" @click="handleCancel" class="todo-list__edit-button">
              <el-icon>
                <Close />
              </el-icon>
            </el-button>

            <el-button type="danger" size="small" @click="handleDeleteConfirm(todo)" class="todo-list__action-button">
              <el-icon>
                <Delete />
              </el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElCheckbox, ElButton, ElIcon, ElInput, ElMessageBox } from "element-plus";
import { Edit, Delete, Check, Close } from "@element-plus/icons-vue";
import { ref } from "vue";
import type { ITodoItem } from "../types";

interface IProps {
  todos: ITodoItem[];
  editingTodo?: { id: string; title: string } | null;
  onToggleTodo?: (id: string) => void;
  onStartEdit?: (todo: ITodoItem) => void;
  onSaveEdit?: (id: string, title: string) => void;
  onCancelEdit?: () => void;
  onDeleteTodo?: (id: string) => void;
}

const props = defineProps<IProps>();
const editTitle = ref("");

// 检查是否正在编辑
const isEditing = (todo: ITodoItem) => {
  return props.editingTodo?.id === todo.id;
};

// 处理删除确认
const handleDeleteConfirm = async (todo: ITodoItem): Promise<void> => {
  try {
    await ElMessageBox.confirm(`确定要删除"${todo.title}"吗？`, "确认删除", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });
    props.onDeleteTodo?.(todo.id);
  } catch {
    // 用户取消删除
  }
};

// 处理键盘事件
const handleKeyPress = (event: KeyboardEvent): void => {
  if (event.key === "Enter") {
    handleSave();
  } else if (event.key === "Escape") {
    handleCancel();
  }
};

// 处理保存编辑
const handleSave = (todo: ITodoItem): void => {
  if (editTitle.value.trim()) {
    props.onSaveEdit?.(todo.id, editTitle.value);
  } else {
    editTitle.value = todo.title;
    props.onCancelEdit?.();
  }
};

// 处理取消编辑
const handleCancel = (): void => {
  editTitle.value = "";
  props.onCancelEdit?.();
};
</script>

<style scoped>
.todo-list {
  width: 100%;
}
.todo-list__container {
  overflow: hidden;
  border: none;
  border-radius: 8px;
}
.todo-list__item {
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}
.todo-list__item:last-child {
  border-bottom: none;
}
.todo-list__item:hover {
  background-color: #f7fafc;
}
.todo-list__item--completed {
  background-color: #f0fff4;
  opacity: 0.7;
}
.todo-list__item--completed:hover {
  background-color: #e6ffed;
}
.todo-list__item-content {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
}
.todo-list__checkbox {
  flex-shrink: 0;
}
.todo-list__title {
  flex: 1;
  font-size: 1rem;
  color: #2d3748;
  word-break: break-word;
  cursor: pointer;
  transition: all 0.2s ease;
}
.todo-list__title--completed {
  color: #718096;
  text-decoration: line-through;
}
.todo-list__title:hover {
  color: #4a5568;
}
.todo-list__actions {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
}
.todo-list__action-button {
  min-width: 32px;
  height: 32px;
  padding: 0;
}
.todo-list__edit-input {
  flex: 1;
  margin-right: 12px;
}
.todo-list__edit-input--active {
  border-color: #3b82f6;
}

/* 响应式设计 */
@media (width <= 768px) {
  .todo-list__item {
    padding: 12px 16px;
  }
  .todo-list__item-content {
    gap: 8px;
  }
  .todo-list__actions {
    flex-direction: column;
    gap: 4px;
  }
  .todo-list__action-button {
    min-width: 28px;
    height: 28px;
  }
}
</style>

<template>
  <div class="todo-filter">
    <component :is="renderFilter" />
  </div>
</template>

<script setup lang="tsx">
import { ElRadioGroup, ElRadioButton, ElButton } from "element-plus";
import type { TodoFilterType } from "../types";

interface IProps {
  currentFilter: TodoFilterType;
  hasCompleted: boolean;
  onUpdateFilter?: (filter: string) => void;
  onClearCompleted?: () => void;
}

const props = defineProps<IProps>();

// 筛选选项
const filterOptions = [
  { label: "全部", value: "all" },
  { label: "未完成", value: "active" },
  { label: "已完成", value: "completed" }
];

// 渲染筛选器
const renderFilter = () => (
  <div class="todo-filter__container">
    <div class="todo-filter__group">
      <span class="todo-filter__label">筛选:</span>
      <ElRadioGroup modelValue={props.currentFilter} onChange={props.onUpdateFilter} class="todo-filter__radio-group">
        {filterOptions.map(option => (
          <ElRadioButton key={option.value} label={option.value} class="todo-filter__radio-button">
            {option.label}
          </ElRadioButton>
        ))}
      </ElRadioGroup>
    </div>

    {props.hasCompleted && (
      <ElButton type="warning" size="small" onClick={props.onClearCompleted} class="todo-filter__clear-button">
        清除已完成
      </ElButton>
    )}
  </div>
);
</script>

<style scoped>
.todo-filter {
  width: 100%;
}
</style>

<style>
/* TSX renderFunc 的全局BEM样式 */
.todo-filter__container {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #e2e8f0;
}
.todo-filter__group {
  display: flex;
  gap: 12px;
  align-items: center;
}
.todo-filter__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #718096;
}
.todo-filter__radio-group {
  display: flex;
  gap: 4px;
}
.todo-filter__radio-button {
  min-width: 80px;
  text-align: center;
}
.todo-filter__clear-button {
  flex-shrink: 0;
}

/* 响应式设计 */
@media (width <= 768px) {
  .todo-filter__container {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  .todo-filter__group {
    justify-content: space-between;
  }
  .todo-filter__radio-group {
    flex: 1;
    justify-content: flex-end;
  }
  .todo-filter__radio-button {
    min-width: 70px;
    font-size: 0.875rem;
  }
}

@media (width <= 480px) {
  .todo-filter__group {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
  .todo-filter__radio-group {
    justify-content: space-between;
  }
  .todo-filter__radio-button {
    flex: 1;
    min-width: auto;
  }
}
</style>

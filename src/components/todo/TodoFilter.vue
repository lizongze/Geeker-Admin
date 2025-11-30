<template>
  <div class="todo-filter">
    <!-- 复杂内容渲染使用TSX -->
    <component :is="renderFilterContent" />
  </div>
</template>

<script setup lang="tsx">
// import { computed } from 'vue';
import { ElInput, ElButton, ElRadioGroup, ElRadioButton, ElDivider } from "element-plus";
import type { TodoFilterType, ITodoStats } from "./types";

interface IProps {
  stats: ITodoStats;
  currentFilter: TodoFilterType;
  searchKeyword: string;
  onUpdateFilter?: (filter: TodoFilterType) => void;
  onUpdateSearch?: (keyword: string) => void;
  onClearCompleted?: () => void;
}

const props = defineProps<IProps>();

// 筛选选项
const filterOptions = [
  { label: "全部", value: "all" },
  { label: "未完成", value: "active" },
  { label: "已完成", value: "completed" }
];

// 处理搜索输入
const handleSearchInput = (value: string) => {
  props.onUpdateSearch?.(value);
};

// 处理筛选切换
const handleFilterChange = (value: TodoFilterType) => {
  props.onUpdateFilter?.(value);
};

// 处理清除已完成任务
const handleClearCompleted = () => {
  props.onClearCompleted?.();
};

// 渲染统计信息
const renderStats = () => {
  return (
    <div class="todo-filter__stats">
      <div class="todo-filter__stat-item">
        <span class="todo-filter__stat-label">总计:</span>
        <span class="todo-filter__stat-value">{props.stats.total}</span>
      </div>

      <div class="todo-filter__stat-item">
        <span class="todo-filter__stat-label">已完成:</span>
        <span class="todo-filter__stat-value">{props.stats.completed}</span>
      </div>

      <div class="todo-filter__stat-item">
        <span class="todo-filter__stat-label">未完成:</span>
        <span class="todo-filter__stat-value">{props.stats.active}</span>
      </div>

      <div class="todo-filter__stat-item">
        <span class="todo-filter__stat-label">完成率:</span>
        <span class="todo-filter__stat-value">{props.stats.completionRate}%</span>
      </div>
    </div>
  );
};

// 渲染搜索框
const renderSearch = () => {
  return (
    <div class="todo-filter__search">
      <ElInput
        modelValue={props.searchKeyword}
        onUpdate:modelValue={handleSearchInput}
        placeholder="搜索任务..."
        clearable
        prefix-icon="Search"
        class="todo-filter__search-input"
      />
    </div>
  );
};

// 渲染筛选器
const renderFilterButtons = () => {
  return (
    <div class="todo-filter__buttons">
      <ElRadioGroup modelValue={props.currentFilter} onChange={handleFilterChange} class="todo-filter__radio-group">
        {filterOptions.map(option => (
          <ElRadioButton key={option.value} label={option.value} class="todo-filter__radio-btn">
            {option.label}
          </ElRadioButton>
        ))}
      </ElRadioGroup>
    </div>
  );
};

// 渲染操作按钮
const renderActions = () => {
  const hasCompleted = props.stats.completed > 0;

  return (
    <div class="todo-filter__actions">
      <ElButton type="danger" size="small" disabled={!hasCompleted} onClick={handleClearCompleted} class="todo-filter__clear-btn">
        清除已完成
      </ElButton>
    </div>
  );
};

// 主内容渲染函数
const renderFilterContent = () => {
  return (
    <div class="todo-filter__content">
      <div class="todo-filter__header">
        {renderStats()}
        {renderActions()}
      </div>

      <ElDivider />

      <div class="todo-filter__controls">
        {renderSearch()}
        {renderFilterButtons()}
      </div>
    </div>
  );
};
</script>

<style scoped>
.todo-filter {
  padding: 20px;
  margin-bottom: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
}
</style>

<style>
.todo-filter__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.todo-filter__header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}
.todo-filter__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.todo-filter__stat-item {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
}
.todo-filter__stat-label {
  color: #718096;
}
.todo-filter__stat-value {
  font-weight: 600;
  color: #2d3748;
}
.todo-filter__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}
.todo-filter__search {
  flex: 1;
  min-width: 200px;
}
.todo-filter__search-input {
  max-width: 300px;
}
.todo-filter__buttons {
  flex-shrink: 0;
}
.todo-filter__radio-group {
  display: flex;
  gap: 0;
}
.todo-filter__radio-btn {
  margin: 0;
}
.todo-filter__actions {
  flex-shrink: 0;
}
.todo-filter__clear-btn {
  min-width: 100px;
}

@media (width <= 768px) {
  .todo-filter__header {
    flex-direction: column;
    align-items: stretch;
  }
  .todo-filter__stats {
    justify-content: space-around;
  }
  .todo-filter__controls {
    flex-direction: column;
    align-items: stretch;
  }
  .todo-filter__search {
    min-width: auto;
  }
  .todo-filter__search-input {
    width: 100%;
    max-width: none;
  }
  .todo-filter__buttons {
    width: 100%;
  }
  .todo-filter__radio-group {
    justify-content: center;
    width: 100%;
  }
}

@media (width <= 480px) {
  .todo-filter__stats {
    justify-content: space-between;
  }
  .todo-filter__stat-item {
    flex-direction: column;
    gap: 4px;
    text-align: center;
  }
}
</style>

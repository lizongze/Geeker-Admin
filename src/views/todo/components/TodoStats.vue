<template>
  <div class="todo-stats">
    <component :is="renderStats" />
  </div>
</template>

<script setup lang="tsx">
import { computed } from "vue";
import { ElStatistic } from "element-plus";
import type { ITodoStats } from "../types";

interface IProps {
  stats: ITodoStats;
}

const props = defineProps<IProps>();

// 统计项配置
const statItems = [
  {
    title: "总任务数",
    value: props.stats.total,
    color: "#3b82f6",
    icon: "📋"
  },
  {
    title: "未完成",
    value: props.stats.active,
    color: "#f59e0b",
    icon: "⏳"
  },
  {
    title: "已完成",
    value: props.stats.completed,
    color: "#10b981",
    icon: "✅"
  }
];

// 计算完成百分比
const completionRate = computed(() => {
  if (props.stats.total === 0) return 0;
  return Math.round((props.stats.completed / props.stats.total) * 100);
});

// 渲染统计信息
const renderStats = () => (
  <div class="todo-stats__container">
    <div class="todo-stats__grid">
      {statItems.map(item => (
        <div key={item.title} class="todo-stats__item">
          <div class="todo-stats__icon" style={{ color: item.color }}>
            {item.icon}
          </div>
          <div class="todo-stats__content">
            <ElStatistic value={item.value} title={item.title} class="todo-stats__statistic" />
          </div>
        </div>
      ))}
    </div>

    <div class="todo-stats__progress">
      <div class="todo-stats__progress-label">
        <span>完成进度</span>
        <span class="todo-stats__progress-percent">{completionRate.value}%</span>
      </div>
      <div class="todo-stats__progress-bar">
        <div class="todo-stats__progress-fill" style={{ width: `${completionRate.value}%` }} />
      </div>
    </div>
  </div>
);
</script>

<style scoped>
.todo-stats {
  width: 100%;
}
</style>

<style>
/* TSX renderFunc 的全局BEM样式 */
.todo-stats__container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid #e2e8f0;
}
.todo-stats__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.todo-stats__item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}
.todo-stats__icon {
  flex-shrink: 0;
  font-size: 1.5rem;
}
.todo-stats__content {
  flex: 1;
}
.todo-stats__statistic :deep(.el-statistic__content) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}
.todo-stats__statistic :deep(.el-statistic__title) {
  margin-bottom: 4px;
  font-size: 0.875rem;
  color: #718096;
}
.todo-stats__progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.todo-stats__progress-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #718096;
}
.todo-stats__progress-percent {
  font-weight: 600;
  color: #10b981;
}
.todo-stats__progress-bar {
  height: 6px;
  overflow: hidden;
  background-color: #e2e8f0;
  border-radius: 3px;
}
.todo-stats__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* 响应式设计 */
@media (width <= 768px) {
  .todo-stats__grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .todo-stats__item {
    padding: 10px;
  }
  .todo-stats__icon {
    font-size: 1.25rem;
  }
  .todo-stats__statistic :deep(.el-statistic__content) {
    font-size: 1.125rem;
  }
}
</style>

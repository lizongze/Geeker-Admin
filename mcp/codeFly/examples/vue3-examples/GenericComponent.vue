<template>
  <div class="generic-component">
    <!-- 简单逻辑使用模板 -->
    <div class="header">
      <h2>{{ title }}</h2>
      <slot name="header-actions"></slot>
    </div>
    ```
    <div v-if="loading" class="loading-state">加载中...</div>

    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>

    <div v-else class="content">
      <!-- 复杂渲染逻辑使用TSX动态组件 -->
      <component :is="renderContent" />
    </div>

    <div class="footer">
      <slot name="footer-actions"></slot>
    </div>
    ```
  </div>
</template>
<script setup lang="tsx">
// import { computed } from 'vue'

interface Props {
  title: string;
  loading?: boolean;
  error?: string;
  items?: any[];
  emptyMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: "",
  items: () => [],
  emptyMessage: "暂无数据"
});

// 复杂渲染逻辑使用TSX函数
const renderContent = () => {
  if (props.items.length === 0) {
    return <div class="empty-state"> {props.emptyMessage} </div>;
  }

  // 这里只是一个通用示例，实际渲染逻辑会根据具体需求变化
  return (
    <div class="items-container">
      {props.items.map((item, index) => (
        <div key={item.id || index} class="item">
          {props.renderItem ? props.renderItem(item) : <span>{JSON.stringify(item)} </span>}
        </div>
      ))}
    </div>
  );
};
</script>
<style scoped>
.generic-component {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.header h2 {
  margin: 0;
  color: #2d3748;
}
.loading-state,
.error-state {
  padding: 2rem;
  text-align: center;
}
.loading-state {
  color: #718096;
}
.error-state {
  color: #e53e3e;
}
.footer {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style>
<style>
.empty-state {
  padding: 3rem;
  color: #a0aec0;
  text-align: center;
}
.items-container {
  space-y: 0.5rem;
}
.item {
  padding: 0.75rem;
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}
</style>

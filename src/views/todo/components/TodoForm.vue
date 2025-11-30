<template>
  <div class="todo-form">
    <component :is="renderForm" />
  </div>
</template>

<script setup lang="tsx">
import { ref } from "vue";
import { ElInput, ElButton, ElIcon } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

interface IProps {
  onAddTodo?: (title: string) => void;
}

const props = defineProps<IProps>();

const title = ref("");
const isSubmitting = ref(false);

// 处理添加待办事项
const handleSubmit = (): void => {
  if (!title.value.trim()) return;

  isSubmitting.value = true;

  try {
    props.onAddTodo?.(title.value);
    title.value = "";
  } finally {
    isSubmitting.value = false;
  }
};

// 处理键盘事件
const handleKeyPress = (event: KeyboardEvent): void => {
  if (event.key === "Enter") {
    handleSubmit();
  }
};

// 渲染表单
const renderForm = () => (
  <div class="todo-form__container">
    <div class="todo-form__input-group">
      <ElInput
        v-model={title.value}
        placeholder="添加新的待办事项..."
        size="large"
        onKeypress={handleKeyPress}
        class="todo-form__input"
        maxlength={100}
        show-word-limit
      />
      <ElButton
        type="primary"
        size="large"
        loading={isSubmitting.value}
        onClick={handleSubmit}
        class="todo-form__button"
        disabled={!title.value.trim()}
      >
        <ElIcon>
          <Plus />
        </ElIcon>
        添加
      </ElButton>
    </div>

    <div class="todo-form__hint">按 Enter 键快速添加</div>
  </div>
);
</script>

<style scoped>
.todo-form {
  width: 100%;
}
</style>

<style>
/* TSX renderFunc 的全局BEM样式 */
.todo-form__container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.todo-form__input-group {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.todo-form__input {
  flex: 1;
}
.todo-form__button {
  flex-shrink: 0;
  min-width: 100px;
}
.todo-form__hint {
  font-size: 0.875rem;
  color: #718096;
  text-align: center;
}

/* 响应式设计 */
@media (width <= 768px) {
  .todo-form__input-group {
    flex-direction: column;
  }
  .todo-form__button {
    width: 100%;
    min-width: auto;
  }
}
</style>

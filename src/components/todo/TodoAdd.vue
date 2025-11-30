<template>
  <div class="todo-add">
    <!-- 简单表单部分使用模板 -->
    <el-form :model="formData" :rules="formRules" ref="formRef" label-width="80px" class="todo-add__form">
      <el-form-item label="任务标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入任务标题" maxlength="100" show-word-limit />
      </el-form-item>

      <el-form-item label="任务描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入任务描述（可选）"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="优先级" prop="priority">
        <el-select v-model="formData.priority" placeholder="请选择优先级">
          <el-option label="低" value="low" />
          <el-option label="中" value="medium" />
          <el-option label="高" value="high" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <!-- 复杂按钮组使用TSX渲染 -->
        <component :is="renderFormActions" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import type { ITodoFormData } from "./types";

interface IProps {
  onSubmit?: (formData: ITodoFormData) => void;
  onCancel?: () => void;
  submitting?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  submitting: false
});

const formRef = ref<FormInstance>();
const formData = reactive<ITodoFormData>({
  title: "",
  description: "",
  priority: "medium"
});

// 表单验证规则
const formRules: FormRules = {
  title: [
    { required: true, message: "请输入任务标题", trigger: "blur" },
    { min: 1, max: 100, message: "标题长度在 1 到 100 个字符", trigger: "blur" }
  ],
  description: [{ max: 500, message: "描述不能超过 500 个字符", trigger: "blur" }]
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    const valid = await formRef.value.validate();
    if (valid) {
      props.onSubmit?.({
        title: formData.title,
        description: formData.description,
        priority: formData.priority
      });

      // 重置表单
      formRef.value.resetFields();
      formData.description = "";
      formData.priority = "medium";
    }
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

// 取消操作
const handleCancel = () => {
  props.onCancel?.();
  if (formRef.value) {
    formRef.value.resetFields();
    formData.description = "";
    formData.priority = "medium";
  }
};

// TSX渲染表单操作按钮
const renderFormActions = () => {
  return (
    <div class="todo-add__actions">
      <el-button type="primary" onClick={handleSubmit} loading={props.submitting} class="todo-add__submit-btn">
        添加任务
      </el-button>

      <el-button onClick={handleCancel} class="todo-add__cancel-btn">
        取消
      </el-button>
    </div>
  );
};
</script>

<style scoped>
.todo-add {
  padding: 20px;
  margin-bottom: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
}
.todo-add__form {
  max-width: 600px;
}
</style>

<style>
.todo-add__actions {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
}
.todo-add__submit-btn {
  min-width: 100px;
}
.todo-add__cancel-btn {
  min-width: 80px;
}

@media (width <= 768px) {
  .todo-add__actions {
    flex-direction: column;
    gap: 8px;
  }
  .todo-add__submit-btn,
  .todo-add__cancel-btn {
    width: 100%;
  }
}
</style>

<template>
  <div class="todo-demo">
    <div class="todo-demo__header">
      <h2>TodoList 演示应用</h2>
      <p>这是一个完整的Vue3 + Element Plus TodoList应用演示</p>
    </div>

    <TodoApp />

    <div class="todo-demo__features">
      <h3>功能特性</h3>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="feature-card">
            <i class="el-icon-circle-plus-outline"></i>
            <h4>添加任务</h4>
            <p>支持标题、描述和优先级设置</p>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="feature-card">
            <i class="el-icon-check"></i>
            <h4>标记完成</h4>
            <p>一键切换任务完成状态</p>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="feature-card">
            <i class="el-icon-delete"></i>
            <h4>删除任务</h4>
            <p>支持任务删除和批量清除</p>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="feature-card">
            <i class="el-icon-search"></i>
            <h4>搜索筛选</h4>
            <p>支持关键词搜索和状态筛选</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import TodoApp from "./TodoApp.vue";
</script>

<style scoped>
.todo-demo {
  min-height: 100vh;
  padding: 20px;
  background: #f5f7fa;
}
.todo-demo__header {
  padding: 20px;
  margin-bottom: 30px;
  text-align: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
}
.todo-demo__header h2 {
  margin: 0 0 10px;
  font-size: 28px;
  color: #2d3748;
}
.todo-demo__header p {
  margin: 0;
  font-size: 16px;
  color: #718096;
}
.todo-demo__features {
  padding: 30px;
  margin-top: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
}
.todo-demo__features h3 {
  margin: 0 0 20px;
  font-size: 24px;
  color: #2d3748;
  text-align: center;
}
.feature-card {
  height: 100%;
  padding: 20px;
  text-align: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;
}
.feature-card:hover {
  border-color: #4f46e5;
  box-shadow: 0 4px 8px rgb(0 0 0 / 10%);
  transform: translateY(-2px);
}
.feature-card i {
  margin-bottom: 15px;
  font-size: 48px;
  color: #4f46e5;
}
.feature-card h4 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #2d3748;
}
.feature-card p {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: #718096;
}

@media (width <= 768px) {
  .todo-demo {
    padding: 10px;
  }
  .todo-demo__header {
    padding: 15px;
  }
  .todo-demo__header h2 {
    font-size: 24px;
  }
  .todo-demo__features {
    padding: 20px;
  }
  .feature-card {
    margin-bottom: 15px;
  }
}
</style>

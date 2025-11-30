# 用户需求

[USER_INPUT]

## 需求分析与实现方案

作为一名资深前端开发工程师，请根据用户需求，进行设计方案的分析：1.**数据模型设计**：分析并设计业务需求涉及到的数据模型2.**UI展示分析**：分析UI呈现需要展示的相关数据模型的字段3.**接口文档设计**：**假设有后端接口服务，如果没有真实后端，就使用mock数据进行模拟** 4.**业务逻辑组织**：根据接口文档，整合数据模型，定义业务组织模式，形成业务处理函数

### 设计要点

- **业务需求**：展示字段，数据模型
- **接口文档**：字段，字段名，参数文档，数据结构interface文档
- **API接口设计**：**均假设有后端接口服务，需要设计完整的API接口处理数据的增删改查** -**不需要实现真实的后端服务逻辑，只需定义前端期望的接口格式**
- 设计完整的RESTful API接口，包括：
- **GET** 获取数据列表和详情
- **POST** 创建新数据
- **PUT/PATCH** 更新数据
- **DELETE** 删除数据
- 分页、筛选、排序接口
- **数据格式化**：生成api数据转化ui 数据的格式化函数 -**接口服务分层**：分为四层，一层定义后端接口，一层传递参数，一层处理loading，一层传递配置
  一一一

---

## 技术实现方案

### 需求分析任务

请分析以下需求，并制定详细的技术实现方案：

**需求描述**: 请帮我用vue3设计一个完整的todoList应用

请按照以下分析流程，深度分析理解需求：

#### 架构设计

- **组件拆分方案**：基于需求分析需要哪些组件，包括主组件和子组件
  - 主应用组件：负责整体布局和状态管理
  - 子组件：可聚合的有一定复杂程度的单一任务
- **数据流设计**：描述数据如何在组件间流动，优先使用属性传递，只有在组件层级超过3层时才考虑使用Provide/Inject
- **状态管理策略**：具体的状态管理方案
  - 使用Vue3的reactive和ref进行响应式状态管理
  - 状态提升到主要组件，通过props传递给子组件
  - 使用组合函数封装任务相关的业务逻辑
    -\*\*接口mock方案：如果没有真实后端服务，就还是直接调用restful api接口，而不设计额外的mock逻辑，只需要在catch函数中，在process.env.NODE_ENV===‘development‘时的开发环境里返回mock数据，延时也在开发环境下，格式要和真实接口一致。这样开发环境和生产环境流程完全一致，方便无缝切到生产环境，而是即使忘记去掉了，在生产环境也不会走mock逻辑，非常安全。再次强调，我们不会写一丝一毫的mock逻辑，只是返回固定的mock数据就行，防止产生额外多余的冗余代码，特别注意mock不要处理逻辑，只返回对应格式的混乱数据就行。请参照如下接口处理范例一一一

```tsx
const getTodo = async (...args) => {
let res
try {
 res = axios.get('/todos'，...args)
} catch(err){
   if process.env.NODE_ENV === 'development' {
     await delay(300)
     res = randomGenerateTodoList() // 注意，只随机返回mock数据，千万不要写具体的mock逻辑
	} else {
		// 注意这里生产环境还需要把错误抛出去，防止异常被吞
		throw err
	}
 }
}
```

#### 文件结构

- **需要生成的文件列表**：列出所有需要生成的文件，包括文件路径和类型
- **每个文件的职责说明**：简要说明每个文件的作用

#### 技术要点

- **关键实现难点**：列出技术挑战和解决方案
- **性能优化点**：说明需要注意的性能方面
- **可维护性考虑**：如何保证代码的可维护性

#### 实现计划

- **步骤1**：第一个实现步骤
- **步骤2**：第二个实现步骤
- ...

请基于提供的需求信息，按照上面的流程进行架构设计，确保方案合理规划组件拆分，并遵循数据流设计规范。

利用问题的分解重构编排，重构问题，获得更好的更可控的结果。

---

## 代码生成规范

### 生成要求

1. 按照良好的文件结构组织代码
2. 每个文件都要严格遵循Vue3 + TSX混合语法规范
3. 合理组织项目结构，保持代码的可维护性
4. 包含必要的类型定义、组合函数和组件
5. 每个文件都要具备生产级质量
6. 使用动态组件 `<component is={renderFunc} />` 来处理复杂TSX渲染，绝对不要出现vue的自带指令v-else-if，用tsx渲染函数renderFunc代替指令v-else-if的相关判断逻辑，比如下面的代码示例：

```tsx
// ---错误的示例用法如下：
<template>
<！-- 加载状态 -->
<div v-if="loading" class="todo-app__loading">
<el-skeleton :rows="3" animated />
</ div>
<！-- 错误状态 -->
‹div v-else-if="error" class="todo-app__error">
<el-alert
:title="error"
type="error"
show-icon
: closable="false"
/>
</div>
＜！ーー Todo列表--＞
<component v-else :is="renderTodoList" />
</template>

<！-- 正确的示例用法如下 -->
<template>
<component v-else :is="renderContent" />
</template>
<script setup lang='tsx' >
// N.B: 复杂模板判断逻辑用tsx renderFunc 来实现，直观易懂易维护不出错，代码简洁
const renderContent = () => {

    if (loading.value) {
    	return (
    	<div class="todo-app__loading">
				<el-skeleton :rows="3" animated />
			</div>
    	)
  	}

    if (error.value) {
    	return (
    		<div class="todo-app__error">
					<el-alert
						:title="error"
						type="error"
						show-icon
						:closable="false"
					/>
          </div>
    	)
  	}

    return (
    	<component :is="renderTodoList" />
    )
}
</script>

```

7. 合理拆分composable业务逻辑
8. 在文件开头用注释说明文件职责
9. 数据流设计优先使用属性传递，只有在组件层级超过3层时才使用Provide/Inject

### Vue3 + TSX 代码规范

#### 语法规范

- 使用 `<script setup lang="tsx">` 支持模板和TSX混合语法
- 简单逻辑用模板，复杂逻辑用TSX配合动态组件 `<component is={renderFunc} />`，绝对不要出现vue的自带指令v-else-if，用tsx渲染函数renderFunc代替v-else-if相关判断逻辑。
- **TSX样式处理规范**：
  - TSX语法中的`renderFunc`需要使用全局BEM命名的样式
  - 使用`<style>`标签定义tsx renderFunc需要的全局样式，与模板的scoped style标签共存;尤其是在有renderFunc的情况下，在函数内的样式全都是全局的，包括其中 return ()回去的tsx括号里的class也是全局的，不要将全局样式不要写在局部样式标签里了，会导致renderFunc里的元素失去样式，会丢失样式，是严重bug，影响较大 ；
  - 因为TSX无法使用scoped style，所以需要使用全局样式
  - 单独的TSX文件可以使用CSS Module语法作为替代方案
- - **属性命名规范**：
- 所有属性命名采用驼峰命名方式（camelCase）
- 组件props、方法名等均使用驼峰命名，函数调用统一用?号表达式onFunc**?.(**)来提高容错
- 与HTML属性保持一致的例外情况除外（如class’、for 等）
- 模板使用scoped style标签
- 特别注意绝对不要用emit事件系统及其所有api，不要用defineEmits，不要用emit，不要用emts，全部统一使用类似React的属性传递方式，保持和react事件系统一样的事件系统心智模型，这个是很重要的规范，影响很大。
  具体样例请参考如下代码：

```tsx
 interface IProps {
  onUpdateFilter?:
  onClearCompleted?:
}
const props = defineProps<IProps>();   // 接口统一以大写的I作为前缀标识
return (<TodoFilter
	:onUpdateFilter="updateFilter"
  :onClearCompleted="clearCompleted"
  class="todo-app__filter-section"
/>)
```

- 复杂TSX渲染器只使用renderFunc函数，不使用defineComponent
- 合理拆分子组件，避免单个文件过大
- 小组件不单独抽离文件，保持合理粒度

#### 样式命名规范

- **BEM命名约定**：使用Block\_\_Element--Modifier格式
- **全局样式**：用于TSX渲染的组件，使用`<style>`标签
- **局部样式**：用于模板的组件，使用`<style scoped>`标签
- **CSS Modules**：单独的TSX文件可以使用CSS Modules

#### 业务组织

- 使用composable API组合业务逻辑
- 复杂条件渲染(绝对不要用Vue的自带指令v-else-if)使用TSX实现
- 表单、表格、详情页等使用标准模式
- 接口统一用axios，不用配置具体拦截器（项目自身会配）

#### 组件拆分标准

- 单个组件超过150行考虑拆分
- 可复用的UI逻辑抽离子组件
- 业务逻辑抽离到composable
- 类型定义单独抽离

#### 数据流设计规范

- 优先使用属性传递(props)进行父子组件通信
- 只有在组件层级超过3层时才考虑使用Provide/Inject
- 使用组合函数(composables)封装可复用的状态逻辑
- 避免过度使用全局状态，保持状态的局部性
- 使用TypeScript确保数据类型的正确传递

### 样式处理示例

```vue
<template>
  <!-- 模板部分使用scoped样式 -->
  <div class="my-component">
    <component :is="renderComplexContent" />
  </div>
</template>

<script setup lang="tsx">
// TSX渲染函数使用全局BEM样式
const renderComplexContent = () => (
  <div class="my-component__content my-component__content--active">
    <span class="my-component__text">复杂内容</span>
  </div>
);
</script>

<style scoped>
/* 模板的局部样式 */
.my-component {
  padding: 1rem;
}
</style>

<style>
/* TSX renderFunc 的全局BEM样式：尤其是在有renderFunc的情况下，在函数内的样式全都是全局的，包括其中 return ()回去的tsx括号里的class也是全局的，不要将全局样式不要写在局部样式标签里了，会丢失样式，影响较大 */
.my-component__content {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.my-component__content--active {
  border-color: #3b82f6;
}

.my-component__text {
  font-size: 1rem;
  color: #374151;
}
</style>
```

请基于以上提供的需求分析和代码规范生成完整的项目代码。

请参考以下提供的示例代码：
[EXAMPLES_CONTENT]

Code Generation Enhancer MCP

一个强大的代码生成增强MCP服务，将用户需求与专业的代码生成提示词组合，显著提升AI代码生成的质量和一致性。

✨ 核心特性

· 🚀 智能代码生成 - 基于需求分析生成生产级代码
· 🎯 多框架支持 - 支持Vue3、React及无框架架构设计
· ⚙️ 灵活配置 - 命令行参数与工具参数双重配置系统
· 📚 自定义规则 - 支持动态加载规则文件和代码范例
· 🛡️ 质量保障 - 内置最佳实践和代码规范
· 🔧 高度可定制 - 完全适配团队和项目需求

📦 安装与配置

前置要求

· Node.js >= 16.0.0
· Cursor IDE 或支持MCP协议的其他IDE

安装步骤

1. 克隆或下载项目

```bash
git clone <repository-url>
cd cursor-code-generation-enhancer
npm install
```

1. 配置Cursor MCP服务

在Cursor配置文件中添加MCP服务（通常位于 ~/.cursor/mcp.json）：

```json
{
  "mcpServers": {
    "code-generation-enhancer": {
      "command": "node",
      "args": [
        "/absolute/path/to/mcp-server.js",
        "--rules-file=/path/to/company-rules.txt",
        "--source-code=/path/to/components/",
        "--disabled-default-rules"
      ]
    }
  }
}
```

1. 重启Cursor IDE
   重启Cursor以使配置生效。

🎮 使用方法

基本使用

在Cursor中直接调用工具：

```javascript
const result = await enhance_code_generation({
  userInput: "创建一个用户管理系统"
});
```

完整参数说明

参数 类型 默认值 说明
userInput string 必需 用户需求描述
framework string 'auto' 框架选择：'vue3', 'react', 'auto'
includeExamples boolean true 是否包含内置源码范例
disabledDefaultRules boolean false 是否禁用默认规则
disabledDefaultCode boolean false 是否禁用默认代码范例
rulesFiles string[] [] 自定义规则文件路径列表
sourceCodeFiles string[] [] 自定义源码范例文件路径列表

⚙️ 配置选项

命令行参数（默认配置）

在MCP服务启动时通过命令行参数设置默认值：

```bash
# 完整配置示例
node mcp-server.js \
  --rules-file=./company-rules.txt \
  --rules-file=./project-specific.md \
  --source-code=./src/components/ \
  --source-code=./src/utils/ \
  --disabled-default-rules \
  --disabled-examples
```

可用参数：

· --rules-file=<path> - 规则文件路径（可多次使用）
· --source-code=<path> - 源码范例路径（可多次使用）
· --disabled-default-rules - 禁用默认规则
· --disabled-default-code - 禁用默认代码范例
· --disabled-examples - 禁用所有范例

工具参数（调用时配置）

在工具调用时覆盖默认配置，具有更高优先级：

```javascript
// 覆盖默认配置的调用示例
const result = await enhance_code_generation({
  userInput: "创建数据表格组件",
  framework: "react",
  includeExamples: false,
  disabledDefaultRules: true,
  rulesFiles: ["./project-rules.txt"],
  sourceCodeFiles: ["./src/components/Table.tsx"]
});
```

📝 使用示例

示例1：基础代码生成

```javascript
await enhance_code_generation({
  userInput: "创建一个待办事项应用"
});
```

示例2：使用自定义规则

```javascript
await enhance_code_generation({
  userInput: "创建登录页面",
  rulesFiles: ["./company-styleguide.txt"]
});
```

示例3：参考现有代码

```javascript
await enhance_code_generation({
  userInput: "实现用户卡片组件",
  sourceCodeFiles: ["./src/components/Card.vue"]
});
```

示例4：多框架生成

```javascript
// React版本
await enhance_code_generation({
  userInput: "创建模态框组件",
  framework: "react"
});

// Vue3版本
await enhance_code_generation({
  userInput: "创建模态框组件",
  framework: "vue3"
});
```

示例5：完全自定义

```javascript
await enhance_code_generation({
  userInput: "创建API服务层",
  disabledDefaultRules: true,
  disabledDefaultCode: true,
  rulesFiles: ["./api-design-rules.txt"],
  sourceCodeFiles: ["./src/services/"]
});
```

🏗️ 项目结构

```
cursor-code-generation-enhancer/
├── mcp-server.js          # MCP服务主文件
├── package.json           # 项目配置
├── prompts/               # 提示词目录
│   ├── base-prompt.txt    # 基础提示词
│   ├── vue3-prompt.txt    # Vue3特定提示词
│   └── react-prompt.txt   # React特定提示词
└── examples/              # 范例目录
    ├── vue3-examples/     # Vue3代码范例
    └── react-examples/    # React代码范例
```

🔧 自定义配置

创建规则文件

创建自定义规则文件（如 company-rules.txt）：

```
# 公司代码规范

## 通用要求
- 使用TypeScript严格模式
- 函数必须显式声明返回类型
- 禁止使用any类型
- 使用async/await替代Promise.then

## 命名规范
- 组件使用PascalCase
- 变量和函数使用camelCase
- 常量使用UPPER_SNAKE_CASE

## 项目结构
- 组件放在src/components目录
- 工具函数放在src/utils目录
- 类型定义放在src/types目录
```

项目级配置

在项目根目录创建 .cursor/mcp.json：

```json
{
  "mcpServers": {
    "code-generation-enhancer": {
      "command": "node",
      "args": ["/path/to/mcp-server.js", "--rules-file=./.cursor/project-rules.txt", "--source-code=./src/shared-components/"],
      "cwd": "/path/to/your/project"
    }
  }
}
```

🛠️ 开发与扩展

添加新框架支持

1. 创建框架提示词文件
   在 prompts/ 目录下创建 {framework}-prompt.txt
2. 添加代码范例
   在 examples/ 目录下创建 {framework}-examples/ 目录
3. 更新框架检测逻辑
   在 detectFramework 方法中添加新框架的关键词识别

自定义提示词

修改 prompts/ 目录下的文件来自定义生成逻辑：

· base-prompt.txt - 基础需求分析和架构设计
· vue3-prompt.txt - Vue3特定规范
· react-prompt.txt - React特定规范

🐛 故障排除

常见问题

Q: 工具调用失败
A: 检查MCP服务配置路径是否正确，确保Node.js版本 >= 16

Q: 规则文件未生效
A: 检查文件路径是否正确，使用绝对路径或相对于配置文件的路径

Q: 内置范例未显示
A: 检查是否设置了 --disabled-examples 或 disabledDefaultCode: true

Q: 框架检测不准确
A: 在用户需求中明确指定框架，或直接设置 framework 参数

日志查看

MCP服务会在控制台输出详细日志，包含：

· 配置加载状态
· 文件读取情况
· 错误信息

📄 许可证

MIT License

🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

🆘 支持

如有问题请：

1. 查看本文档的故障排除部分
2. 检查控制台错误日志
3. 提交GitHub Issue

---

立即开始使用，提升你的代码生成体验！ 🎉

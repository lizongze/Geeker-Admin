// mcp-server.js
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";

import { fileURLToPath } from "url";
import path, { dirname } from "path";
// import { readFile, readdir } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CodeGenerationEnhancer {
  constructor() {
    this.server = new Server(
      {
        name: "code-generation-enhancer",
        version: "5.0.0"
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    // 从命令行参数读取默认配置
    this.defaultRulesFiles = this.getArgsByPrefix("--rules-file");
    this.defaultSourceCodeFiles = this.getArgsByPrefix("--source-code");
    this.defaultDisabledDefaultRules = this.hasFlag("--disabled-default-rules");
    this.defaultDisabledDefaultCode = this.hasFlag("--disabled-default-code");
    this.defaultIncludeExamples = !this.hasFlag("--disabled-examples");
    this.defaultDisableCustomize = this.hasFlag("--disabled-customize"); // 新增配置项

    this.promptsDir = path.join(__dirname, "prompts");
    this.examplesDir = path.join(__dirname, "examples");

    console.error(`默认配置 - 规则文件: ${this.defaultRulesFiles.length} 个`);
    console.error(`默认配置 - 源码范例: ${this.defaultSourceCodeFiles.length} 个`);
    console.error(`默认配置 - 禁用默认规则: ${this.defaultDisabledDefaultRules}`);
    console.error(`默认配置 - 禁用默认代码范例: ${this.defaultDisabledDefaultCode}`);
    console.error(`默认配置 - 包含范例: ${this.defaultIncludeExamples}`);
    console.error(`默认配置 - 禁止用户自定义: ${this.defaultDisableCustomize}`); // 新增日志

    this.setupServer();
  }

  // 从命令行参数获取指定前缀的所有参数值
  getArgsByPrefix(prefix) {
    const args = process.argv.slice(2);
    const values = [];

    for (let i = 0; i < args.length; i++) {
      if (args[i] === prefix && args[i + 1]) {
        values.push(args[i + 1]);
        i++; // 跳过下一个参数
      } else if (args[i].startsWith(`${prefix}=`)) {
        values.push(args[i].split("=")[1]);
      }
    }

    return values;
  }

  // 检查是否存在指定的标志参数
  hasFlag(flag) {
    const args = process.argv.slice(2);
    return args.includes(flag);
  }

  // 读取规则文件内容（增强容错）
  readRulesFiles(rulesFiles) {
    if (!rulesFiles || rulesFiles.length === 0) {
      return "";
    }

    let rulesContent = "\n\n## 自定义规则\n\n";
    let foundFiles = 0;

    rulesFiles.forEach((filePath, index) => {
      try {
        const absolutePath = path.resolve(filePath);
        if (!fs.existsSync(absolutePath)) {
          console.error(`规则文件不存在: ${absolutePath}`);
          rulesContent += `### 规则文件 ${index + 1}: ${path.basename(filePath)}\n\n*文件未找到: ${filePath}*\n\n`;
          return;
        }

        const content = fs.readFileSync(absolutePath, "utf8");
        const fileName = path.basename(filePath);
        rulesContent += `### 规则文件 ${index + 1}: ${fileName}\n\n${content}\n\n`;
        foundFiles++;
      } catch (error) {
        console.error(`读取规则文件时出错 ${filePath}:`, error);
        rulesContent += `### 规则文件 ${index + 1}: ${path.basename(filePath)}\n\n*读取文件时出错: ${error.message}*\n\n`;
      }
    });

    if (foundFiles === 0 && rulesFiles.length > 0) {
      console.error(`所有规则文件均未找到或无法读取: ${rulesFiles.join(", ")}`);
    }

    return rulesContent;
  }

  // 读取源码范例文件内容（增强容错）
  readSourceCodeFiles(sourceCodeFiles) {
    if (!sourceCodeFiles || sourceCodeFiles.length === 0) {
      return "";
    }

    let sourceCodeContent = "\n\n## 自定义源码范例\n\n";
    let foundFiles = 0;

    sourceCodeFiles.forEach(filePath => {
      try {
        const absolutePath = path.resolve(filePath);
        if (!fs.existsSync(absolutePath)) {
          console.error(`源码范例文件不存在: ${absolutePath}`);
          sourceCodeContent += `### 文件: ${path.basename(filePath)}\n\n*文件未找到: ${filePath}*\n\n`;
          return;
        }

        const content = fs.readFileSync(absolutePath, "utf8");
        const fileName = path.basename(filePath);
        const fileExt = path.extname(filePath).toLowerCase();

        sourceCodeContent += `### 文件: ${fileName}\n\n\`\`\`${this.getFileExtension(fileExt)}\n${content}\n\`\`\`\n\n`;
        foundFiles++;
      } catch (error) {
        console.error(`读取源码范例文件时出错 ${filePath}:`, error);
        sourceCodeContent += `### 文件: ${path.basename(filePath)}\n\n*读取文件时出错: ${error.message}*\n\n`;
      }
    });

    if (foundFiles === 0 && sourceCodeFiles.length > 0) {
      console.error(`所有源码范例文件均未找到或无法读取: ${sourceCodeFiles.join(", ")}`);
    }

    return sourceCodeContent;
  }

  // 获取文件扩展名用于代码块标记
  getFileExtension(ext) {
    const extMap = {
      ".ts": "typescript",
      ".tsx": "tsx",
      ".js": "javascript",
      ".jsx": "jsx",
      ".vue": "vue",
      ".css": "css",
      ".scss": "scss",
      ".json": "json",
      ".md": "markdown",
      ".txt": "text",
      ".py": "python",
      ".java": "java",
      ".cpp": "cpp",
      ".c": "c",
      ".html": "html",
      ".xml": "xml",
      ".yaml": "yaml",
      ".yml": "yaml"
    };
    return extMap[ext] || "";
  }

  // 读取通用提示词文件（严格容错：文件不存在时返回空）
  readBasePrompt() {
    try {
      const basePromptPath = path.join(this.promptsDir, "base-prompt.md");
      if (!fs.existsSync(basePromptPath)) {
        console.error("基础提示词文件不存在:", basePromptPath);
        return "";
      }
      return fs.readFileSync(basePromptPath, "utf8");
    } catch (error) {
      console.error("读取基础提示词文件时出错:", error);
      return "";
    }
  }

  // 读取框架特定提示词文件（严格容错：文件不存在时返回空）
  readFrameworkPrompt(framework) {
    try {
      const promptPath = path.join(this.promptsDir, `${framework}-prompt.md`);
      if (!fs.existsSync(promptPath)) {
        console.error(`框架提示词文件不存在: ${promptPath}`);
        return "";
      }
      return fs.readFileSync(promptPath, "utf8");
    } catch (error) {
      console.error(`读取${framework}提示词文件时出错:`, error);
      return "";
    }
  }

  // 读取内置范例文件内容（严格容错：禁用或文件不存在时返回空）
  readExampleFiles(framework) {
    try {
      const frameworkExamplesDir = path.join(this.examplesDir, `${framework}-examples`);
      if (!fs.existsSync(frameworkExamplesDir)) {
        console.error(`内置范例目录不存在: ${frameworkExamplesDir}`);
        return "";
      }

      const files = this.getAllFiles(frameworkExamplesDir);
      if (files.length === 0) {
        console.error(`内置范例目录为空: ${frameworkExamplesDir}`);
        return "";
      }

      let examplesContent = `\n\n## ${framework.toUpperCase()} 内置参考范例\n\n`;
      let successfullyReadFiles = 0;

      files.forEach(file => {
        try {
          const relativePath = path.relative(frameworkExamplesDir, file);
          const content = fs.readFileSync(file, "utf8");
          const fileExt = path.extname(file).toLowerCase();

          examplesContent += `### 文件: ${relativePath}\n\n\`\`\`${this.getFileExtension(fileExt)}\n${content}\n\`\`\`\n\n`;
          successfullyReadFiles++;
        } catch (error) {
          console.error(`读取内置范例文件时出错 ${file}:`, error);
          // 静默跳过错误文件
        }
      });

      if (successfullyReadFiles === 0) {
        console.error(`所有内置范例文件均无法读取`);
        return "";
      }

      return examplesContent;
    } catch (error) {
      console.error(`读取${framework}内置范例文件时出错:`, error);
      return "";
    }
  }

  // 递归获取所有文件（增强容错）
  getAllFiles(dir) {
    try {
      let results = [];
      const list = fs.readdirSync(dir);

      list.forEach(file => {
        try {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);

          if (stat && stat.isDirectory()) {
            results = results.concat(this.getAllFiles(filePath));
          } else {
            results.push(filePath);
          }
        } catch (error) {
          console.error(`处理文件时出错 ${file}:`, error);
          // 继续处理其他文件
        }
      });

      return results;
    } catch (error) {
      console.error(`读取目录时出错 ${dir}:`, error);
      return [];
    }
  }

  // 检测用户需求中的框架倾向
  detectFramework(userInput) {
    const input = userInput.toLowerCase();

    // React相关关键词
    const reactKeywords = ["react", "jsx", "mobx", "redux", "hook", "useState", "useEffect"];
    // Vue相关关键词
    const vueKeywords = ["vue", "composition api", "options api", "v-model", "v-for", "v-if", "vuex", "pinia"];

    const reactScore = reactKeywords.filter(keyword => input.includes(keyword)).length;
    const vueScore = vueKeywords.filter(keyword => input.includes(keyword)).length;

    if (reactScore > vueScore) {
      return "react";
    } else if (vueScore > reactScore) {
      return "vue3";
    } else {
      // 不再默认使用Vue3，返回空字符串表示无特定框架
      return "";
    }
  }

  setupServer() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      // 如果禁用了自定义，则修改工具描述
      const toolDescription = this.defaultDisableCustomize
        ? `将用户需求与代码生成提示词组合，增强AI的代码生成质量。

**重要使用说明**：
- 当前已启用开发者模式，禁止用户自定义规则文件和源码范例文件
- 仅使用预配置的默认规则和内置范例
- rulesFiles和sourceCodeFiles参数将被忽略

**使用案例**：
1. 用户说"创建登录页面" → 仅使用预配置规则
2. 用户说"实现卡片组件" → 仅使用内置范例
3. 用户说"同时生成React和Vue3版本" → 分别调用两次工具，分别设置framework为"react"和"vue3"`
        : `将用户需求与代码生成提示词组合，增强AI的代码生成质量。

**重要使用说明**：
- 如果用户提到了规则文件（如"./rules.md"、"按照xxx文件的规范"），请使用rulesFiles参数传递文件路径
- 如果用户提到了参考代码文件（如"参考xxx文件的实现"），请使用sourceCodeFiles参数传递文件路径
- 文件路径可以是相对路径或绝对路径，可以同时指定多个文件
- 不要在userInput中复制文件内容，而是使用对应的文件参数
- 可以为每个框架单独调用工具来生成多框架代码

**使用案例**：
1. 用户说"按照./company-rules.md的规范创建登录页面" → 使用rulesFiles: ["./company-rules.md"]
2. 用户说"参考./Button.vue实现卡片组件" → 使用sourceCodeFiles: ["./Button.vue"] 
3. 用户说"同时生成React和Vue3版本" → 分别调用两次工具，分别设置framework为"react"和"vue3"`;

      return {
        tools: [
          {
            name: "enhance_code_generation",
            description: toolDescription,
            inputSchema: {
              type: "object",
              properties: {
                userInput: {
                  type: "string",
                  description: "用户的需求描述（不要在这里包含文件内容或重复规范要求）"
                },
                framework: {
                  type: "string",
                  description: "指定框架: vue3 或 react（可选，不指定则自动检测或无框架）",
                  enum: ["vue3", "react", "auto"],
                  default: "auto"
                },
                includeExamples: {
                  type: "boolean",
                  description: "是否包含内置源码范例",
                  default: true
                },
                disabledDefaultRules: {
                  type: "boolean",
                  description: "是否禁用默认规则",
                  default: false
                },
                disabledDefaultCode: {
                  type: "boolean",
                  description: "是否禁用默认代码范例",
                  default: false
                },
                // 如果禁用了自定义，则隐藏文件相关参数
                ...(this.defaultDisableCustomize
                  ? {}
                  : {
                      rulesFiles: {
                        type: "array",
                        description:
                          '**重要：当用户提到规则文件时使用此参数**。规则文件路径列表，如["./styleguide.md", "./company-rules.md"]',
                        items: {
                          type: "string"
                        }
                      },
                      sourceCodeFiles: {
                        type: "array",
                        description:
                          '**重要：当用户提到参考代码时使用此参数**。源码范例文件路径列表，如["./components/Button.vue", "./utils/api.ts"]',
                        items: {
                          type: "string"
                        }
                      }
                    })
              },
              required: ["userInput"]
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      if (request.params.name === "enhance_code_generation") {
        const userInput = request.params.arguments?.userInput;
        const specifiedFramework = request.params.arguments?.framework;
        const includeExamples = request.params.arguments?.includeExamples !== false;
        const disabledDefaultRules = request.params.arguments?.disabledDefaultRules;
        const disabledDefaultCode = request.params.arguments?.disabledDefaultCode;
        const rulesFiles = this.defaultDisableCustomize ? [] : request.params.arguments?.rulesFiles; // 禁用自定义时忽略用户传入的文件
        const sourceCodeFiles = this.defaultDisableCustomize ? [] : request.params.arguments?.sourceCodeFiles; // 禁用自定义时忽略用户传入的文件

        if (!userInput) {
          throw new Error("userInput参数是必需的");
        }

        // 合并配置：工具参数优先，没有则使用默认配置
        const finalIncludeExamples = includeExamples !== undefined ? includeExamples : this.defaultIncludeExamples;
        const finalDisabledDefaultRules =
          disabledDefaultRules !== undefined ? disabledDefaultRules : this.defaultDisabledDefaultRules;
        const finalDisabledDefaultCode =
          disabledDefaultCode !== undefined ? disabledDefaultCode : this.defaultDisabledDefaultCode;

        // 如果禁用了自定义，则强制使用默认文件，忽略用户传入的文件
        const finalRulesFiles = this.defaultDisableCustomize
          ? this.defaultRulesFiles
          : rulesFiles && rulesFiles.length > 0
            ? rulesFiles
            : this.defaultRulesFiles;

        const finalSourceCodeFiles = this.defaultDisableCustomize
          ? this.defaultSourceCodeFiles
          : sourceCodeFiles && sourceCodeFiles.length > 0
            ? sourceCodeFiles
            : this.defaultSourceCodeFiles;

        console.error(`最终配置 - 包含范例: ${finalIncludeExamples}`);
        console.error(`最终配置 - 禁用默认规则: ${finalDisabledDefaultRules}`);
        console.error(`最终配置 - 禁用默认代码范例: ${finalDisabledDefaultCode}`);
        console.error(`最终配置 - 规则文件: ${finalRulesFiles.length} 个`);
        console.error(`最终配置 - 源码范例: ${finalSourceCodeFiles.length} 个`);
        console.error(`最终配置 - 禁止用户自定义: ${this.defaultDisableCustomize}`);

        // 确定使用的框架
        let framework = "";
        if (specifiedFramework && specifiedFramework !== "auto") {
          framework = specifiedFramework;
        } else if (specifiedFramework === "auto") {
          framework = this.detectFramework(userInput);
        }

        console.error(`使用框架: ${framework || "无特定框架"}`);

        // 构建增强的提示词，将用户需求放在最前面
        let enhancedPrompt = `# 用户需求\n\n${userInput}\n\n`;

        // 添加框架信息（如果有）
        if (framework) {
          enhancedPrompt += `## 使用技术栈\n\n${framework.toUpperCase()}\n\n`;
        }

        // 读取基础提示词（不包含框架特定规则）
        // 注意：基础提示词不受 disabledDefaultRules 影响，因为它提供的是通用分析框架
        const basePrompt = this.readBasePrompt();
        if (basePrompt) {
          enhancedPrompt += basePrompt.replace("[USER_INPUT]", userInput);
        }

        // 如果没有禁用默认规则，且指定了框架，则添加框架特定提示词
        if (!finalDisabledDefaultRules && framework) {
          const frameworkPrompt = this.readFrameworkPrompt(framework);
          if (frameworkPrompt) {
            enhancedPrompt += frameworkPrompt.replace("[USER_INPUT]", userInput);
          }
        }

        // 添加规则文件内容（在源码范例之前）
        const rulesContent = this.readRulesFiles(finalRulesFiles);
        enhancedPrompt += rulesContent;

        // 添加内置源码范例（如果包含范例且不禁用默认代码且有框架）
        if (finalIncludeExamples && !finalDisabledDefaultCode && framework) {
          const examplesContent = this.readExampleFiles(framework);
          enhancedPrompt += examplesContent;
        }

        // 添加自定义源码范例（在内置范例之后）
        const sourceCodeContent = this.readSourceCodeFiles(finalSourceCodeFiles);
        enhancedPrompt += sourceCodeContent;

        const getWrappedPrompt = curEnhancedPrompt => {
          return `# 代码生成增强提示词:
            我已经为您准备了针对${framework}框架的增强提示词，包含最佳实践和参考范例。
            **请直接使用以下增强后的提示词来生成代码：**
            
            ${curEnhancedPrompt}
            
            ---

            **提示：** 请基于这个增强提示词生成完整的代码实现。
          `;
        };

        return {
          content: [
            {
              type: "text",
              text: getWrappedPrompt(enhancedPrompt)
            }
          ]
        };
      }

      throw new Error(`未知的工具: ${request.params.name}`);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Code Generation Enhancer MCP服务器运行中...");
  }
}

// 启动服务器
const server = new CodeGenerationEnhancer();
server.run().catch(console.error);

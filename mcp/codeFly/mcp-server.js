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
        version: "1.0.0"
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.promptsDir = path.join(__dirname, "prompts");
    this.examplesDir = path.join(__dirname, "examples");

    this.setupServer();
  }

  // 读取提示词文件
  readPromptFile(framework) {
    try {
      const promptPath = path.join(this.promptsDir, `${framework}-prompt.md`);
      if (!fs.existsSync(promptPath)) {
        throw new Error(`提示词文件不存在: ${promptPath}`);
      }
      return fs.readFileSync(promptPath, "utf8");
    } catch (error) {
      console.error(`读取${framework}提示词文件时出错:`, error);
      throw error;
    }
  }

  // 读取范例文件内容
  readExampleFiles(framework) {
    try {
      const frameworkExamplesDir = path.join(this.examplesDir, `${framework}-examples`);
      if (!fs.existsSync(frameworkExamplesDir)) {
        console.error("范例目录不存在:", frameworkExamplesDir);
        return `\n\n// ${framework}范例文件目录不存在\n`;
      }

      const files = this.getAllFiles(frameworkExamplesDir);
      let examplesContent = `\n\n## ${framework.toUpperCase()} 参考范例\n\n`;

      files.forEach(file => {
        const relativePath = path.relative(frameworkExamplesDir, file);
        const content = fs.readFileSync(file, "utf8");
        examplesContent += `\`\`\`\n文件名: ${relativePath}\n代码:\n${content}\n\`\`\`\n\n`;
      });

      return examplesContent;
    } catch (error) {
      console.error(`读取${framework}范例文件时出错:`, error);
      return `\n\n// 读取${framework}范例文件时出错\n`;
    }
  }

  // 递归获取所有文件
  getAllFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat && stat.isDirectory()) {
        results = results.concat(this.getAllFiles(filePath));
      } else {
        results.push(filePath);
      }
    });

    return results;
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
      // 默认使用Vue3
      return "vue3";
    }
  }

  setupServer() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "enhance_code_generation",
            description: "将用户需求与代码生成提示词组合，增强AI的代码生成质量",
            inputSchema: {
              type: "object",
              properties: {
                userInput: {
                  type: "string",
                  description: "用户的需求描述"
                },
                framework: {
                  type: "string",
                  description: "指定框架: vue3 或 react",
                  enum: ["vue3", "react"],
                  default: "auto"
                },
                includeExamples: {
                  type: "boolean",
                  description: "是否包含源码范例",
                  default: true
                }
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

        if (!userInput) {
          throw new Error("userInput参数是必需的");
        }

        // 确定使用的框架
        let framework;
        if (specifiedFramework && specifiedFramework !== "auto") {
          framework = specifiedFramework;
        } else {
          framework = this.detectFramework(userInput);
        }

        console.error(`使用框架: ${framework}`);

        // 读取对应框架的提示词
        let promptTemplate;
        try {
          promptTemplate = this.readPromptFile(framework);
        } catch (error) {
          // 如果指定框架的提示词不存在，回退到Vue3
          if (framework !== "vue3") {
            console.error(`回退到Vue3提示词: ${error.message}`);
            framework = "vue3";
            promptTemplate = this.readPromptFile("vue3");
          } else {
            throw error;
          }
        }

        let enhancedPrompt = promptTemplate.replace("[USER_INPUT]", userInput);

        if (includeExamples) {
          const examplesContent = this.readExampleFiles(framework);
          enhancedPrompt = enhancedPrompt.replace("[EXAMPLES_CONTENT]", examplesContent);
        } else {
          enhancedPrompt = enhancedPrompt.replace("[EXAMPLES_CONTENT]", "");
        }

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

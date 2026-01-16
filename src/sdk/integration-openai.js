/**
 * OpenAI API 集成示例
 * 
 * 这个文件展示了如何将 RoboEyes SDK 与 OpenAI API 集成
 * 
 * 使用前需要安装 OpenAI SDK:
 * npm install openai
 */

import { getTools, createExecutor } from './index.js';
import { EyeController } from '../eyes/EyeController.js';
import { MoodEffects } from '../effects/MoodEffects.js';
import { EffectsManager } from '../effects/EffectsManager.js';

/**
 * OpenAI 集成类
 */
export class OpenAIIntegration {
  constructor(openaiClient, canvas) {
    this.openai = openaiClient;
    this.canvas = canvas;
    
    // 初始化 RoboEyes
    this.effectsManager = new EffectsManager(canvas);
    this.moodEffects = new MoodEffects(canvas, this.effectsManager);
    this.eyeController = new EyeController(canvas);
    this.executor = createExecutor(this.eyeController, this.moodEffects);
    
    // 获取工具定义
    this.tools = getTools();
  }

  /**
   * 处理用户消息并执行 AI 返回的工具调用
   * @param {string} userMessage - 用户消息
   * @param {Array} conversationHistory - 对话历史（可选）
   * @returns {Promise<object>} AI 响应和执行结果
   */
  async processMessage(userMessage, conversationHistory = []) {
    try {
      // 构建消息列表
      const messages = [
        {
          role: 'system',
          content: '你是一个控制机器人眼睛表情的助手。用户会描述想要的表情或动作，你需要使用可用的工具来实现。'
        },
        ...conversationHistory,
        {
          role: 'user',
          content: userMessage
        }
      ];

      // 调用 OpenAI API
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages,
        tools: this.tools,
        tool_choice: 'auto'
      });

      const assistantMessage = completion.choices[0].message;
      const toolCalls = assistantMessage.tool_calls || [];

      // 执行工具调用
      const toolResults = [];
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        
        const result = await this.executor.execute(functionName, functionArgs);
        toolResults.push({
          tool_call_id: toolCall.id,
          role: 'tool',
          name: functionName,
          content: JSON.stringify(result)
        });
      }

      return {
        assistantMessage: assistantMessage.content,
        toolCalls: toolCalls.map(tc => ({
          name: tc.function.name,
          arguments: JSON.parse(tc.function.arguments)
        })),
        toolResults: toolResults
      };
    } catch (error) {
      console.error('处理消息时出错:', error);
      throw error;
    }
  }

  /**
   * 处理带工具结果的完整对话流程
   * @param {string} userMessage - 用户消息
   * @param {Array} conversationHistory - 对话历史
   * @returns {Promise<object>} 完整的对话响应
   */
  async processMessageWithFollowUp(userMessage, conversationHistory = []) {
    // 第一轮：获取工具调用
    const firstResponse = await this.processMessage(userMessage, conversationHistory);
    
    // 如果有工具调用，需要发送结果回 AI 获取最终回复
    if (firstResponse.toolResults.length > 0) {
      const messages = [
        {
          role: 'system',
          content: '你是一个控制机器人眼睛表情的助手。'
        },
        ...conversationHistory,
        {
          role: 'user',
          content: userMessage
        },
        {
          role: 'assistant',
          content: firstResponse.assistantMessage,
          tool_calls: firstResponse.toolCalls.map((tc, idx) => ({
            id: `call_${idx}`,
            type: 'function',
            function: {
              name: tc.name,
              arguments: JSON.stringify(tc.arguments)
            }
          }))
        },
        ...firstResponse.toolResults
      ];

      // 获取 AI 的最终回复
      const finalCompletion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages
      });

      return {
        ...firstResponse,
        finalMessage: finalCompletion.choices[0].message.content
      };
    }

    return firstResponse;
  }
}

/**
 * 使用示例
 */
export async function example() {
  // 注意：需要先安装 OpenAI SDK
  // import OpenAI from 'openai';
  // const openai = new OpenAI({ apiKey: 'your-api-key' });
  
  // const canvas = document.getElementById('eye-canvas');
  // const integration = new OpenAIIntegration(openai, canvas);
  
  // // 处理用户消息
  // const result = await integration.processMessage('让机器人眼睛显示开心的表情');
  // console.log('执行结果:', result);
  
  // // 处理复杂消息
  // const result2 = await integration.processMessageWithFollowUp(
  //   '让机器人眼睛显示困惑的表情，然后看向左边'
  // );
  // console.log('完整结果:', result2);
}

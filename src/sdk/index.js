/**
 * RoboEyes AI Tools SDK
 * 
 * An SDK for AI LLM integration that provides complete tool definitions and executor.
 * 
 * Usage example:
 * ```javascript
 * import { getTools, createExecutor } from './sdk/index.js';
 * import { EyeController } from './eyes/EyeController.js';
 * 
 * // Create EyeController instance
 * const eyeController = new EyeController(canvas);
 * 
 * // Get tool definitions (for AI LLM)
 * const tools = getTools();
 * 
 * // Create executor
 * const executor = createExecutor(eyeController);
 * 
 * // Execute tool call
 * const result = await executor.execute('setMood', { mood: 'HAPPY' });
 * ```
 */

export { ROBOT_EYES_TOOLS, COLOR_MAP, normalizeColor } from './tools.js';
export { ToolsExecutor } from './executor.js';

/**
 * Get all tool definitions (OpenAI Function Calling format)
 * @returns {Array} Array of tool definitions
 */
export function getTools() {
  return ROBOT_EYES_TOOLS.map(tool => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }
  }));
}

/**
 * Get tool definitions (simplified format, for other AI platforms)
 * @returns {Array} Array of tool definitions
 */
export function getToolsSimple() {
  return ROBOT_EYES_TOOLS;
}

/**
 * Create tool executor
 * @param {EyeController} eyeController - EyeController instance
 * @param {MoodEffects} moodEffects - MoodEffects instance (optional)
 * @returns {ToolsExecutor} Tool executor instance
 */
export function createExecutor(eyeController, moodEffects = null) {
  return new ToolsExecutor(eyeController, moodEffects);
}

/**
 * Execute tool calls in batch
 * @param {ToolsExecutor} executor - Tool executor
 * @param {Array} toolCalls - Array of tool calls, format: [{ name: 'toolName', arguments: {...} }]
 * @returns {Promise<Array>} Array of execution results
 */
export async function executeBatch(executor, toolCalls) {
  const results = [];
  for (const toolCall of toolCalls) {
    const result = await executor.execute(toolCall.name, toolCall.arguments || {});
    results.push(result);
  }
  return results;
}

/**
 * Validate tool call parameters
 * @param {string} toolName - Tool name
 * @param {object} parameters - Tool parameters
 * @returns {object} Validation result { valid: boolean, errors: Array }
 */
export function validateToolCall(toolName, parameters) {
  const tool = ROBOT_EYES_TOOLS.find(t => t.name === toolName);
  if (!tool) {
    return {
      valid: false,
      errors: [`Unknown tool: ${toolName}`]
    };
  }

  const errors = [];
  const schema = tool.parameters;

  // Check required parameters
  if (schema.required) {
    for (const requiredParam of schema.required) {
      if (!(requiredParam in parameters)) {
        errors.push(`Missing required parameter: ${requiredParam}`);
      }
    }
  }

  // Check parameter types and values
  if (schema.properties) {
    for (const [paramName, paramSchema] of Object.entries(schema.properties)) {
      if (paramName in parameters) {
        const value = parameters[paramName];
        
        // Check enum values
        if (paramSchema.enum && !paramSchema.enum.includes(value)) {
          errors.push(`Parameter ${paramName} must be one of: ${paramSchema.enum.join(', ')}`);
        }
        
        // Check number range
        if (paramSchema.type === 'number') {
          if (typeof value !== 'number') {
            errors.push(`Parameter ${paramName} must be a number`);
          } else {
            if (paramSchema.minimum !== undefined && value < paramSchema.minimum) {
              errors.push(`Parameter ${paramName} must be >= ${paramSchema.minimum}`);
            }
            if (paramSchema.maximum !== undefined && value > paramSchema.maximum) {
              errors.push(`Parameter ${paramName} must be <= ${paramSchema.maximum}`);
            }
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

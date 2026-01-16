# Quick Start Guide

## 5-Minute Quick Start

### 1. Import SDK

```javascript
import { getTools, createExecutor } from './sdk/index.js';
import { EyeController } from './eyes/EyeController.js';
```

### 2. Initialize

```javascript
const canvas = document.getElementById('eye-canvas');
const eyeController = new EyeController(canvas);
const executor = createExecutor(eyeController);
```

### 3. Use Tools

```javascript
// Set mood
await executor.execute('setMood', { mood: 'HAPPY' });

// Set color
await executor.execute('setEyeColor', { color: 'yellow' });

// Set position
await executor.execute('setPosition', { position: 'N' });
```

### 4. Integrate with AI

```javascript
// Get tool definitions (for AI LLM)
const tools = getTools();

// Use with OpenAI API
const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Make the robot eyes show happiness' }],
  tools: tools
});

// Execute tool calls returned by AI
for (const toolCall of completion.choices[0].message.tool_calls) {
  await executor.execute(
    toolCall.function.name,
    JSON.parse(toolCall.function.arguments)
  );
}
```

## Common Scenarios

### Express Happiness
```javascript
await executor.execute('setMood', { mood: 'HAPPY' });
await executor.execute('setEyeColor', { color: 'yellow' });
await executor.execute('startLaughAnimation');
```

### Express Confusion
```javascript
await executor.execute('setMood', { mood: 'SUSPICIOUS' });
await executor.execute('setPosition', { position: 'W' });
await executor.execute('startConfusedAnimation');
```

### Thinking State
```javascript
await executor.execute('setMood', { mood: 'FOCUSED' });
await executor.execute('startThinkingAnimation');
```

## More Examples

For more detailed examples, refer to the main README.md file.

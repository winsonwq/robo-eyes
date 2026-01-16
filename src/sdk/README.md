# RoboEyes AI Tools SDK

An SDK for AI LLM integration that wraps all RoboEyes functionality into standard AI Tools format, making it easy for AI models to control the robot eyes.

## Features

- ✅ Complete tool definitions (JSON Schema)
- ✅ Tool executor
- ✅ Parameter validation
- ✅ Batch execution support
- ✅ OpenAI Function Calling format compatible
- ✅ Support for multiple AI platforms

## Installation

The SDK is already included in the project. Simply import it:

```javascript
import { getTools, createExecutor } from './sdk/index.js';
```

## Quick Start

### 1. Basic Usage

```javascript
import { EyeController } from './eyes/EyeController.js';
import { getTools, createExecutor } from './sdk/index.js';

// Create EyeController instance
const canvas = document.getElementById('eye-canvas');
const eyeController = new EyeController(canvas);

// Get tool definitions (for AI LLM)
const tools = getTools();
console.log('Available tools:', tools);

// Create executor
const executor = createExecutor(eyeController);

// Execute tool call
const result = await executor.execute('setMood', { mood: 'HAPPY' });
console.log(result);
```

### 2. Integration with AI LLM (OpenAI)

```javascript
import { getTools, createExecutor } from './sdk/index.js';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: 'your-api-key' });
const executor = createExecutor(eyeController);

// Get tool definitions
const tools = getTools();

// Call AI
const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'user', content: 'Make the robot eyes show a happy expression' }
  ],
  tools: tools,
  tool_choice: 'auto'
});

// Execute tool calls
const toolCalls = completion.choices[0].message.tool_calls;
for (const toolCall of toolCalls) {
  const result = await executor.execute(
    toolCall.function.name,
    JSON.parse(toolCall.function.arguments)
  );
  console.log(result);
}
```

### 3. Batch Execution

```javascript
import { executeBatch } from './sdk/index.js';

const toolCalls = [
  { name: 'setMood', arguments: { mood: 'HAPPY' } },
  { name: 'setPosition', arguments: { position: 'N' } },
  { name: 'setEyeColor', arguments: { color: 'cyan' } }
];

const results = await executeBatch(executor, toolCalls);
console.log(results);
```

### 4. Parameter Validation

```javascript
import { validateToolCall } from './sdk/index.js';

const validation = validateToolCall('setMood', { mood: 'INVALID' });
if (!validation.valid) {
  console.error('Validation failed:', validation.errors);
}
```

## Available Tools

### Mood Control
- `setMood` - Set emotion expression

### Position Control
- `setPosition` - Set eye gaze direction
- `setPositionRange` - Set position movement range

### Color Control
- `setEyeColor` - Set eye color
- `setBackgroundColor` - Set background color
- `setColors` - Set both eye and background colors

### Eye Actions
- `openEyes` - Open eyes
- `closeEyes` - Close eyes
- `blink` - Perform blink action

### Animation Effects
- `startLaughAnimation` / `stopLaughAnimation` - Laugh animation
- `startConfusedAnimation` / `stopConfusedAnimation` - Confused animation
- `setFlicker` - Flicker effect
- `startThinkingAnimation` / `stopThinkingAnimation` - Thinking animation
- `startSpeakingAnimation` / `stopSpeakingAnimation` - Speaking animation

### Auto Features
- `setAutoblink` - Set auto blink
- `setIdleMode` - Set idle mode

### Custom Configuration
- `setCustomEyeConfig` - Set custom eye configuration

## Tool Parameters

### setMood
```javascript
{
  mood: 'HAPPY' // Options: DEFAULT, HAPPY, TIRED, ANGRY, SUSPICIOUS, SERIOUS, IRRITATED, SAD, HAPPYBLUSH, FOCUSED, EFFORT, SURPRISED, EXCITED, DETERMINED
}
```

### setPosition
```javascript
// Method 1: Use predefined direction
{
  position: 'N' // Options: DEFAULT, N, NE, E, SE, S, SW, W, NW
}

// Method 2: Use custom coordinates
{
  position: { x: 0.5, y: -0.3 } // x, y range: -1 to 1
}
```

### setEyeColor
```javascript
{
  color: 'cyan' // Supports color names or hex: white, cyan, green, red, yellow, purple, orange, blue, or #ffffff
}
```

### setAutoblink
```javascript
{
  active: true,      // Enable or disable
  interval: 3,       // Interval in seconds (optional)
  variation: 2       // Variation range in seconds (optional)
}
```

### setCustomEyeConfig
```javascript
{
  shape: 'ELLIPSE',  // ELLIPSE, RECTANGLE, ROUNDED_RECT
  leftEye: {
    scaleX: 1.0,     // 0.1 to 2.0
    scaleY: 1.0      // 0.1 to 2.0
  },
  rightEye: {
    scaleX: 1.0,
    scaleY: 1.0
  },
  borderRadius: 1.0, // 0 to 1
  rotation: 0         // -180 to 180 degrees
}
```

## API Reference

### getTools()
Returns an array of tool definitions in OpenAI Function Calling format.

### getToolsSimple()
Returns an array of tool definitions in simplified format.

### createExecutor(eyeController, moodEffects?)
Creates a tool executor instance.

**Parameters:**
- `eyeController` (EyeController): EyeController instance
- `moodEffects` (MoodEffects, optional): MoodEffects instance

**Returns:** ToolsExecutor instance

### executeBatch(executor, toolCalls)
Execute multiple tool calls in batch.

**Parameters:**
- `executor` (ToolsExecutor): Tool executor
- `toolCalls` (Array): Array of tool calls

**Returns:** Promise<Array> Array of execution results

### validateToolCall(toolName, parameters)
Validate tool call parameters.

**Parameters:**
- `toolName` (string): Tool name
- `parameters` (object): Tool parameters

**Returns:** { valid: boolean, errors: Array }

## Example Scenarios

### Scenario 1: Express Happiness
```javascript
await executor.execute('setMood', { mood: 'HAPPY' });
await executor.execute('setEyeColor', { color: 'yellow' });
await executor.execute('startLaughAnimation');
```

### Scenario 2: Express Confusion
```javascript
await executor.execute('setMood', { mood: 'SUSPICIOUS' });
await executor.execute('setPosition', { position: 'W' });
await executor.execute('startConfusedAnimation');
```

### Scenario 3: Thinking State
```javascript
await executor.execute('setMood', { mood: 'FOCUSED' });
await executor.execute('setPosition', { position: 'N' });
await executor.execute('startThinkingAnimation');
```

## Notes

1. Make sure to create and initialize the `EyeController` instance before using the SDK
2. Some tools (like `setMood`) require a `MoodEffects` instance to work fully
3. Color parameters support both color names and hex format, automatically converted
4. Position parameters can be either string direction or coordinate object

## License

MIT License

/**
 * RoboEyes AI Tools Executor
 * Executor for AI Tools calls
 */

import { normalizeColor } from './tools.js';

/**
 * Tool executor class
 * Converts AI Tools calls to actual EyeController method calls
 */
export class ToolsExecutor {
  constructor(eyeController, moodEffects = null) {
    this.eyeController = eyeController;
    this.moodEffects = moodEffects;
  }

  /**
   * Execute tool call
   * @param {string} toolName - Tool name
   * @param {object} parameters - Tool parameters
   * @returns {object} Execution result
   */
  async execute(toolName, parameters) {
    try {
      let result;

      switch (toolName) {
        case 'setMood':
          result = this.executeSetMood(parameters);
          break;
        case 'setPosition':
          result = this.executeSetPosition(parameters);
          break;
        case 'setEyeColor':
          result = this.executeSetEyeColor(parameters);
          break;
        case 'setBackgroundColor':
          result = this.executeSetBackgroundColor(parameters);
          break;
        case 'setColors':
          result = this.executeSetColors(parameters);
          break;
        case 'openEyes':
          result = this.executeOpenEyes(parameters);
          break;
        case 'closeEyes':
          result = this.executeCloseEyes(parameters);
          break;
        case 'blink':
          result = this.executeBlink(parameters);
          break;
        case 'startLaughAnimation':
          result = this.executeStartLaughAnimation(parameters);
          break;
        case 'stopLaughAnimation':
          result = this.executeStopLaughAnimation(parameters);
          break;
        case 'startConfusedAnimation':
          result = this.executeStartConfusedAnimation(parameters);
          break;
        case 'stopConfusedAnimation':
          result = this.executeStopConfusedAnimation(parameters);
          break;
        case 'setFlicker':
          result = this.executeSetFlicker(parameters);
          break;
        case 'startThinkingAnimation':
          result = this.executeStartThinkingAnimation(parameters);
          break;
        case 'stopThinkingAnimation':
          result = this.executeStopThinkingAnimation(parameters);
          break;
        case 'startSpeakingAnimation':
          result = this.executeStartSpeakingAnimation(parameters);
          break;
        case 'stopSpeakingAnimation':
          result = this.executeStopSpeakingAnimation(parameters);
          break;
        case 'setAutoblink':
          result = this.executeSetAutoblink(parameters);
          break;
        case 'setIdleMode':
          result = this.executeSetIdleMode(parameters);
          break;
        case 'setPositionRange':
          result = this.executeSetPositionRange(parameters);
          break;
        case 'setCustomEyeConfig':
          result = this.executeSetCustomEyeConfig(parameters);
          break;
        default:
          throw new Error(`Unknown tool: ${toolName}`);
      }

      return {
        success: true,
        tool: toolName,
        result: result
      };
    } catch (error) {
      return {
        success: false,
        tool: toolName,
        error: error.message
      };
    }
  }

  // Tool execution methods

  executeSetMood({ mood }) {
    this.eyeController.setMood(mood);
    if (this.moodEffects) {
      this.moodEffects.setMood(mood);
    }
    return { message: `Mood set to: ${mood}` };
  }

  executeSetPosition({ position }) {
    this.eyeController.setPosition(position);
    return { message: `Position set to: ${JSON.stringify(position)}` };
  }

  executeSetEyeColor({ color }) {
    const normalizedColor = normalizeColor(color);
    this.eyeController.setEyeColor(normalizedColor);
    return { message: `Eye color set to: ${normalizedColor}` };
  }

  executeSetBackgroundColor({ color }) {
    this.eyeController.setBgColor(color);
    return { message: `Background color set to: ${color}` };
  }

  executeSetColors({ eyeColor, bgColor }) {
    const normalizedEyeColor = normalizeColor(eyeColor);
    this.eyeController.setColors(normalizedEyeColor, bgColor);
    return { 
      message: `Eye color set to: ${normalizedEyeColor}, Background color set to: ${bgColor}` 
    };
  }

  executeOpenEyes() {
    this.eyeController.open();
    return { message: 'Eyes opened' };
  }

  executeCloseEyes() {
    this.eyeController.close();
    return { message: 'Eyes closed' };
  }

  executeBlink() {
    this.eyeController.blink();
    return { message: 'Blink action performed' };
  }

  executeStartLaughAnimation() {
    this.eyeController.anim_laugh();
    return { message: 'Laugh animation started' };
  }

  executeStopLaughAnimation() {
    this.eyeController.anim_laughStop();
    return { message: 'Laugh animation stopped' };
  }

  executeStartConfusedAnimation() {
    this.eyeController.anim_confused();
    return { message: 'Confused animation started' };
  }

  executeStopConfusedAnimation() {
    this.eyeController.anim_confusedStop();
    return { message: 'Confused animation stopped' };
  }

  executeSetFlicker({ active }) {
    this.eyeController.setHFlicker(active);
    return { message: `Flicker effect ${active ? 'enabled' : 'disabled'}` };
  }

  executeStartThinkingAnimation() {
    this.eyeController.anim_thinking();
    return { message: 'Thinking animation started' };
  }

  executeStopThinkingAnimation() {
    this.eyeController.anim_thinkingStop();
    return { message: 'Thinking animation stopped' };
  }

  executeStartSpeakingAnimation() {
    this.eyeController.anim_speaking();
    return { message: 'Speaking animation started' };
  }

  executeStopSpeakingAnimation() {
    this.eyeController.anim_speakingStop();
    return { message: 'Speaking animation stopped' };
  }

  executeSetAutoblink({ active, interval = 3, variation = 2 }) {
    this.eyeController.setAutoblinker(active, interval, variation);
    return { 
      message: `Auto blink ${active ? 'enabled' : 'disabled'}`,
      interval,
      variation
    };
  }

  executeSetIdleMode({ active, interval = 3, variation = 1 }) {
    this.eyeController.setIdleMode(active, interval, variation);
    return { 
      message: `Idle mode ${active ? 'enabled' : 'disabled'}`,
      interval,
      variation
    };
  }

  executeSetPositionRange({ range }) {
    this.eyeController.setPositionRange(range);
    return { message: `Position range set to: ${range}` };
  }

  executeSetCustomEyeConfig(config) {
    this.eyeController.setCustomEyeConfig(config);
    return { message: 'Custom eye configuration applied', config };
  }
}

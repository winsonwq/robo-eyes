import { EyeRenderer } from '../core/EyeRenderer.js';
import { AnimationSystem, BlinkController, Tween } from '../core/AnimationSystem.js';

export class EyeController {
  constructor(canvas) {
    this.renderer = new EyeRenderer(canvas);
    this.animations = new AnimationSystem();
    this.blinkController = new BlinkController({
      minInterval: 3000,
      maxInterval: 5000,
      blinkDuration: 120
    });

    this.currentMood = 'DEFAULT';
    this.targetPosition = { x: 0, y: 0 };
    this.currentPosition = { x: 0, y: 0 };
    this.animLaugh = false;
    this.animConfused = false;
    this.animFlicker = false;
    this.animThinking = false;
    this.animSpeaking = false;
    this.isClosed = false;
    this.autoblinker = true;
    this.idleMode = true;

    this.setupAnimations();
    this.animations.start();
  }

  setupAnimations() {
    this.animations.add('blink', {
      active: true,
      update: (deltaTime) => {
        if (!this.isClosed) {
          this.blinkController.update(Date.now());
          this.renderer.setBlink(this.blinkController.eyeHeight);
        }
      }
    });

    this.animations.add('position', {
      active: true,
      update: () => {
        // 平滑更新眼睛位置（用于"看"不同方向）
        this.currentPosition.x += (this.targetPosition.x - this.currentPosition.x) * 0.25;
        this.currentPosition.y += (this.targetPosition.y - this.currentPosition.y) * 0.25;
        this.renderer.currentPosition = this.currentPosition;
      }
    });

    this.animations.add('update', {
      active: true,
      update: () => {
        // 只更新动画状态，不渲染
        this.renderer.animLaughY = this.animLaugh ? Math.sin(Date.now() / 50) * 2 : 0;
        this.renderer.animConfusedX = this.animConfused ? Math.sin(Date.now() / 100) * 3 : 0;
        this.renderer.animFlicker = this.animFlicker ? (Math.random() - 0.5) * 5 : 0;
        this.renderer.animThinking = this.animThinking;
        this.renderer.animSpeaking = this.animSpeaking;
        this.renderer.isClosed = this.isClosed;
      }
    });
  }

  render() {
    // 不渲染背景，由 MoodEffects 处理
    this.renderer.render(false);
  }

  setCustomEyeConfig(config) {
    this.renderer.setCustomEyeConfig(config);
  }

  setMood(mood) {
    this.currentMood = mood;
    this.renderer.setMood(mood);
  }

  setEyeColor(color) {
    this.renderer.setEyeColor(color);
  }

  setBgColor(color) {
    this.renderer.setBgColor(color);
  }

  setColors(eyeColor, bgColor) {
    this.renderer.setColors(eyeColor, bgColor);
  }

  setPosition(position) {
    if (typeof position === 'string') {
      const pos = this.renderer.positions[position];
      if (pos) {
        this.targetPosition = { ...pos };
      }
    } else {
      this.targetPosition = { ...position };
    }
  }

  blink() {
    this.blinkController.blink();
  }

  open() {
    this.isClosed = false;
    this.renderer.open();
  }

  close() {
    this.isClosed = true;
    this.renderer.close();
  }

  anim_laugh() {
    this.animLaugh = true;
  }

  anim_laughStop() {
    this.animLaugh = false;
  }

  anim_confused() {
    this.animConfused = true;
  }

  anim_confusedStop() {
    this.animConfused = false;
  }

  setHFlicker(active, amplitude = 5) {
    this.animFlicker = active;
  }

  anim_thinking() {
    this.animThinking = true;
  }

  anim_thinkingStop() {
    this.animThinking = false;
  }

  anim_speaking() {
    this.animSpeaking = true;
  }

  anim_speakingStop() {
    this.animSpeaking = false;
  }

  setAutoblinker(active, interval = 3, variation = 2) {
    this.autoblinker = active;
    if (active) {
      this.blinkController.minInterval = interval * 1000;
      this.blinkController.maxInterval = (interval + variation) * 1000;
    }
  }

  setIdleMode(active, interval = 3, variation = 1) {
    this.idleMode = active;
    if (active) {
      this.startIdleBehavior(interval, variation);
    }
  }

  startIdleBehavior(interval, variation) {
    const nextChange = (interval + Math.random() * variation - variation / 2) * 1000;
    
    setTimeout(() => {
      if (this.idleMode) {
        const positions = ['DEFAULT', 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const randomPos = positions[Math.floor(Math.random() * positions.length)];
        this.setPosition(randomPos);
        this.startIdleBehavior(interval, variation);
      }
    }, Math.max(500, nextChange));
  }

  destroy() {
    this.animations.stop();
    this.animations.animations.clear();
  }
}

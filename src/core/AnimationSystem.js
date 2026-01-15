export class AnimationSystem {
  constructor() {
    this.animations = new Map();
    this.lastTime = 0;
    this.deltaTime = 0;
    this.isRunning = false;
  }

  add(name, animation) {
    this.animations.set(name, animation);
  }

  remove(name) {
    this.animations.delete(name);
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop();
  }

  stop() {
    this.isRunning = false;
  }

  loop() {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    this.deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    for (const animation of this.animations.values()) {
      if (animation.active) {
        animation.update(this.deltaTime);
      }
    }

    requestAnimationFrame(() => this.loop());
  }

  getDeltaTime() {
    return this.deltaTime;
  }
}

export class Tween {
  constructor(options = {}) {
    this.startValue = options.startValue || 0;
    this.endValue = options.endValue || 1;
    this.duration = options.duration || 1000;
    this.easing = options.easing || this.easeInOutQuad;
    this.onUpdate = options.onUpdate || (() => {});
    this.onComplete = options.onComplete || (() => {});
    
    this.currentValue = this.startValue;
    this.progress = 0;
    this.isPlaying = false;
    this.isComplete = false;
  }

  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  easeOutElastic(t) {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }

  play() {
    if (this.isComplete) {
      this.progress = 0;
      this.isComplete = false;
    }
    this.isPlaying = true;
    this.startTime = performance.now();
    this.animate();
  }

  animate() {
    if (!this.isPlaying) return;

    const elapsed = performance.now() - this.startTime;
    this.progress = Math.min(elapsed / this.duration, 1);
    
    const easedProgress = this.easing(this.progress);
    this.currentValue = this.startValue + (this.endValue - this.startValue) * easedProgress;
    
    this.onUpdate(this.currentValue);

    if (this.progress >= 1) {
      this.isPlaying = false;
      this.isComplete = true;
      this.onComplete();
    } else {
      requestAnimationFrame(() => this.animate());
    }
  }

  stop() {
    this.isPlaying = false;
  }

  reset() {
    this.progress = 0;
    this.currentValue = this.startValue;
    this.isPlaying = false;
    this.isComplete = false;
  }
}

export class BlinkController {
  constructor(options = {}) {
    this.minInterval = options.minInterval || 2000;
    this.maxInterval = options.maxInterval || 6000;
    this.blinkDuration = options.blinkDuration || 150;
    this.isBlinking = false;
    this.eyeHeight = 1;
    this.nextBlinkTime = this.getRandomInterval();
    this.lastBlinkTime = 0;
  }

  getRandomInterval() {
    return Date.now() + this.minInterval + Math.random() * (this.maxInterval - this.minInterval);
  }

  update(currentTime) {
    if (this.isBlinking) {
      const elapsed = currentTime - this.lastBlinkTime;
      if (elapsed >= this.blinkDuration) {
        this.isBlinking = false;
        this.eyeHeight = 1;
        this.nextBlinkTime = this.getRandomInterval();
      } else {
        const progress = elapsed / this.blinkDuration;
        this.eyeHeight = Math.max(0.1, 1 - Math.sin(progress * Math.PI) * 0.9);
      }
    } else if (currentTime >= this.nextBlinkTime) {
      this.isBlinking = true;
      this.lastBlinkTime = currentTime;
    }
  }

  blink() {
    if (!this.isBlinking) {
      this.isBlinking = true;
      this.lastBlinkTime = Date.now();
    }
  }

  forceOpen() {
    this.isBlinking = false;
    this.eyeHeight = 1;
    this.nextBlinkTime = this.getRandomInterval();
  }
}

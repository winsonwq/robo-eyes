import { EyeController } from './eyes/EyeController.js';
import { AnimationSystem } from './core/AnimationSystem.js';
import { EffectsManager } from './effects/EffectsManager.js';
import { MoodEffects } from './effects/MoodEffects.js';
import { ControlPanel } from './core/ControlPanel.js';

const MOODS = ['DEFAULT', 'HAPPY', 'TIRED', 'ANGRY', 'SUSPICIOUS', 'SERIOUS', 'IRRITATED', 'SAD', 'HAPPYBLUSH'];
const POSITIONS = ['DEFAULT', 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

class RoboEyesApp {
  constructor() {
    this.canvas = document.getElementById('eye-canvas');
    this.eyeController = new EyeController(this.canvas);
    this.animations = new AnimationSystem();
    this.effectsManager = new EffectsManager(this.canvas);
    this.moodEffects = new MoodEffects(this.canvas, this.effectsManager);

    this.autoblinkEnabled = true;
    this.idleEnabled = true;
    this.fpsCounter = this.initFPSCounter();
    this.lastFrameTime = performance.now();

    // 初始化控制面板
    this.controlPanel = new ControlPanel(this.eyeController, this.moodEffects);

    this.setupEventListeners();
    this.setupAnimations();

    this.eyeController.setMood('DEFAULT');
    this.moodEffects.setMood('DEFAULT');
    this.eyeController.open();
    
    // 加载默认预设
    this.controlPanel.loadMoodPreset('DEFAULT');

    this.animations.start();
  }

  initFPSCounter() {
    const display = document.getElementById('fps');
    let frameCount = 0;
    let lastTime = performance.now();

    return {
      update: () => {
        frameCount++;
        const currentTime = performance.now();
        if (currentTime - lastTime >= 1000) {
          const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
          display.textContent = `${fps} FPS`;
          frameCount = 0;
          lastTime = currentTime;
        }
      }
    };
  }

  setupEventListeners() {
    document.querySelectorAll('.btn-mood').forEach(btn => {
      // Mood 按钮现在由 ControlPanel 处理
      // 这里保留以兼容，但实际由 ControlPanel 处理
    });

    document.querySelectorAll('.pos-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pos = e.target.dataset.pos;
        this.eyeController.setPosition(pos);
      });
    });

    document.getElementById('btn-open').addEventListener('click', () => {
      this.eyeController.open();
    });

    document.getElementById('btn-close').addEventListener('click', () => {
      this.eyeController.close();
    });

    document.getElementById('btn-blink').addEventListener('click', () => {
      this.eyeController.blink();
    });

    const laughBtn = document.getElementById('btn-laugh');
    laughBtn.addEventListener('click', () => {
      if (this.eyeController.animLaugh) {
        this.eyeController.anim_laughStop();
      } else {
        this.eyeController.anim_laugh();
      }
      laughBtn.classList.toggle('active', this.eyeController.animLaugh);
    });

    const confusedBtn = document.getElementById('btn-confused');
    confusedBtn.addEventListener('click', () => {
      if (this.eyeController.animConfused) {
        this.eyeController.anim_confusedStop();
      } else {
        this.eyeController.anim_confused();
      }
      confusedBtn.classList.toggle('active', this.eyeController.animConfused);
    });

    const flickerBtn = document.getElementById('btn-flicker');
    flickerBtn.addEventListener('click', () => {
      this.eyeController.animFlicker = !this.eyeController.animFlicker;
      this.eyeController.setHFlicker(this.eyeController.animFlicker);
      flickerBtn.classList.toggle('active', this.eyeController.animFlicker);
    });

    const thinkingBtn = document.getElementById('btn-thinking');
    thinkingBtn.addEventListener('click', () => {
      if (this.eyeController.animThinking) {
        this.eyeController.anim_thinkingStop();
      } else {
        this.eyeController.anim_thinking();
      }
      thinkingBtn.classList.toggle('active', this.eyeController.animThinking);
    });

    const speakingBtn = document.getElementById('btn-speaking');
    speakingBtn.addEventListener('click', () => {
      if (this.eyeController.animSpeaking) {
        this.eyeController.anim_speakingStop();
      } else {
        this.eyeController.anim_speaking();
      }
      speakingBtn.classList.toggle('active', this.eyeController.animSpeaking);
    });

    const autoblinkBtn = document.getElementById('btn-autoblink');
    autoblinkBtn.addEventListener('click', () => {
      this.autoblinkEnabled = !this.autoblinkEnabled;
      this.eyeController.setAutoblinker(this.autoblinkEnabled);
      autoblinkBtn.textContent = `Autoblink: ${this.autoblinkEnabled ? 'ON' : 'OFF'}`;
    });

    const idleBtn = document.getElementById('btn-idle');
    idleBtn.addEventListener('click', () => {
      this.idleEnabled = !this.idleEnabled;
      this.eyeController.setIdleMode(this.idleEnabled);
      idleBtn.textContent = `Idle: ${this.idleEnabled ? 'ON' : 'OFF'}`;
    });

    // 颜色选择
    const colorMap = {
      white: '#ffffff',
      cyan: '#00d4ff',
      green: '#00ff00',
      red: '#ff0000',
      yellow: '#ffff00',
      purple: '#ff00ff',
      orange: '#ff8800',
      blue: '#0088ff'
    };

    document.querySelectorAll('.btn-color').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const colorName = e.target.dataset.color;
        const color = colorMap[colorName];
        if (color) {
          // 移除所有 active 状态
          document.querySelectorAll('.btn-color').forEach(b => b.classList.remove('active'));
          // 添加当前按钮的 active 状态
          e.target.classList.add('active');
          // 设置眼睛颜色
          this.eyeController.setEyeColor(color);
        }
      });
    });

    // 默认选中白色
    document.querySelector('.btn-color[data-color="white"]')?.classList.add('active');
  }

  setupAnimations() {
    this.animations.add('fps', {
      active: true,
      update: () => {
        this.fpsCounter.update();
      }
    });

    this.animations.add('moodEffects', {
      active: true,
      update: (deltaTime) => {
        const currentTime = performance.now();
        const delta = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;
        
        this.moodEffects.update(delta);
        this.effectsManager.update(delta);
        
        // Thinking 和 Speaking 动画效果由 renderAnimationEffects 处理
      }
    });

    this.animations.add('renderComplete', {
      active: true,
      update: () => {
        // 完整的渲染流程，确保正确的顺序
        this.renderComplete();
      }
    });
  }

  renderComplete() {
    // 1. 先渲染背景和光晕（最底层）
    this.moodEffects.renderBackground();
    
    // 2. 渲染眼睛
    this.eyeController.render();
    
    // 3. 最后渲染粒子效果（最上层）
    this.effectsManager.render();
    
    // 4. 渲染 thinking 和 speaking 的特殊效果
    this.renderAnimationEffects();
  }


  renderAnimationEffects() {
    const ctx = this.canvas.getContext('2d');
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const time = Date.now() * 0.001;
    
    // Thinking: 渲染思考光晕（简化版，无粒子）
    if (this.eyeController.animThinking) {
      ctx.save();
      const pulse = 0.5 + Math.sin(time * 2) * 0.3;
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 50
      );
      gradient.addColorStop(0, `rgba(150, 200, 255, ${0.2 * pulse})`);
      gradient.addColorStop(1, 'rgba(150, 200, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.restore();
    }
    
    // Speaking: 慢速的波纹扩散效果（广播效果）
    if (this.eyeController.animSpeaking) {
      ctx.save();
      // 更慢的速度，更温和的波纹
      const slowTime = time * 0.5; // 速度减半
      for (let i = 0; i < 3; i++) {
        const rippleTime = slowTime - i * 0.6; // 间隔更大
        if (rippleTime < 0) continue;
        
        const radius = (rippleTime * 40) % 90; // 更慢的扩散速度
        const alpha = 0.25 * (1 - radius / 90); // 更柔和的透明度
        
        if (alpha > 0) {
          ctx.strokeStyle = `rgba(100, 255, 200, ${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
  }

  destroy() {
    this.animations.stop();
    this.eyeController.destroy();
  }
}

const app = new RoboEyesApp();
export default app;

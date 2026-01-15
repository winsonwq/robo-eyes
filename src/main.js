import { EyeController } from './eyes/EyeController.js';
import { AnimationSystem } from './core/AnimationSystem.js';

const MOODS = ['DEFAULT', 'HAPPY', 'TIRED', 'ANGRY', 'SUSPICIOUS', 'SERIOUS', 'IRRITATED', 'SAD', 'HAPPYBLUSH'];
const POSITIONS = ['DEFAULT', 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

class RoboEyesApp {
  constructor() {
    this.canvas = document.getElementById('eye-canvas');
    this.eyeController = new EyeController(this.canvas);
    this.animations = new AnimationSystem();

    this.autoblinkEnabled = true;
    this.idleEnabled = true;
    this.fpsCounter = this.initFPSCounter();

    this.setupEventListeners();
    this.setupAnimations();

    this.eyeController.setMood('DEFAULT');
    this.eyeController.open();

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
      btn.addEventListener('click', (e) => {
        const mood = e.target.dataset.mood;
        document.querySelectorAll('.btn-mood').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.eyeController.setMood(mood);
      });
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
  }

  destroy() {
    this.animations.stop();
    this.eyeController.destroy();
  }
}

const app = new RoboEyesApp();
export default app;

import { MoodDefinitions } from '../core/MoodSystem.js';

export class MoodEffects {
  constructor(canvas, effectsManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.effectsManager = effectsManager;
    this.width = canvas.width;
    this.height = canvas.height;
    this.currentMood = 'DEFAULT';
    this.time = 0;
    this.moodDefinitions = MoodDefinitions;
    
    // 保留旧的配置以兼容（将被移除）
    this.moodConfigs = {
      DEFAULT: {
        bgGradient: ['#0a0a0a', '#0a0a0a'],
        particles: null,
        overlay: null,
        glow: null,
        borderGlow: null,
        scanline: null,
        ripple: null
      },
      HAPPY: {
        bgGradient: ['#2a4a2a', '#0f2a0f'],
        particles: null,
        overlay: {
          type: 'colorShift',
          color: '255, 255, 100',
          strength: 0.4
        },
        glow: {
          color: '255, 255, 100',
          intensity: 0.8,
          pattern: 'radial'
        },
        borderGlow: {
          color: '255, 255, 100',
          intensity: 0.6
        },
        scanline: null,
        ripple: null
      },
      TIRED: {
        bgGradient: ['#1a1a2a', '#0a0a15'],
        particles: null,
        overlay: {
          type: 'colorShift',
          color: '100, 100, 180',
          strength: 0.6
        },
        glow: {
          color: '100, 100, 180',
          intensity: 0.3,
          pattern: 'static'
        },
        borderGlow: null,
        scanline: null,
        ripple: null
      },
      ANGRY: {
        bgGradient: ['#4a0a0a', '#2a0505'],
        particles: null,
        overlay: {
          type: 'colorShift',
          color: '255, 50, 50',
          strength: 0.7
        },
        glow: {
          color: '255, 50, 50',
          intensity: 1.2,
          pattern: 'pulse'
        },
        borderGlow: {
          color: '255, 50, 50',
          intensity: 1.0
        },
        scanline: {
          color: '255, 50, 50',
          intensity: 0.6
        },
        ripple: {
          color: '255, 50, 50',
          intensity: 0.5
        }
      },
      SUSPICIOUS: {
        bgGradient: ['#3a3a1a', '#1a1a0a'],
        particles: null,
        overlay: {
          type: 'colorShift',
          color: '255, 255, 150',
          strength: 0.5
        },
        glow: {
          color: '255, 255, 150',
          intensity: 0.6,
          pattern: 'flicker'
        },
        borderGlow: {
          color: '255, 255, 150',
          intensity: 0.5,
          flicker: true
        },
        scanline: {
          color: '255, 255, 150',
          intensity: 0.5
        },
        ripple: null
      },
      SERIOUS: {
        bgGradient: ['#1a1a3a', '#0a0a1a'],
        particles: null,
        overlay: {
          type: 'colorShift',
          color: '100, 150, 255',
          strength: 0.5
        },
        glow: {
          color: '100, 150, 255',
          intensity: 0.5,
          pattern: 'stable'
        },
        borderGlow: {
          color: '100, 150, 255',
          intensity: 0.3
        },
        scanline: null,
        ripple: null
      },
      IRRITATED: {
        bgGradient: ['#4a2a0a', '#2a1505'],
        particles: null,
        overlay: {
          type: 'colorShift',
          color: '255, 180, 80',
          strength: 0.6
        },
        glow: {
          color: '255, 180, 80',
          intensity: 0.8,
          pattern: 'irregular'
        },
        borderGlow: {
          color: '255, 180, 80',
          intensity: 0.6
        },
        scanline: null,
        ripple: {
          color: '255, 180, 80',
          intensity: 0.3
        }
      },
      SAD: {
        bgGradient: ['#1a1a3a', '#0a0a1a'],
        particles: null,
        overlay: {
          type: 'colorShift',
          color: '80, 120, 255',
          strength: 0.7
        },
        glow: {
          color: '80, 120, 255',
          intensity: 0.4,
          pattern: 'fade'
        },
        borderGlow: null,
        scanline: null,
        ripple: {
          color: '80, 120, 255',
          intensity: 0.2
        }
      },
      HAPPYBLUSH: {
        bgGradient: ['#4a2a2a', '#2a1a1a'],
        particles: null,
        overlay: {
          type: 'colorShift',
          color: '255, 120, 180',
          strength: 0.6
        },
        glow: {
          color: '255, 120, 180',
          intensity: 0.9,
          pattern: 'romantic'
        },
        borderGlow: {
          color: '255, 120, 180',
          intensity: 0.7
        },
        scanline: null,
        ripple: {
          color: '255, 120, 180',
          intensity: 0.4
        }
      },
      FOCUSED: {
        bgGradient: ['#1a2a3a', '#0a1a2a'],
        particles: null,
        overlay: {
          type: 'colorShift',
          color: '100, 200, 255',
          strength: 0.4
        },
        glow: {
          color: '100, 200, 255',
          intensity: 0.6,
          pattern: 'stable'
        },
        borderGlow: {
          color: '100, 200, 255',
          intensity: 0.4
        },
        scanline: null,
        ripple: null
      },
      EFFORT: {
        bgGradient: ['#3a2a1a', '#2a1a0a'],
        particles: null,
        overlay: {
          type: 'colorShift',
          color: '255, 200, 100',
          strength: 0.5
        },
        glow: {
          color: '255, 200, 100',
          intensity: 0.7,
          pattern: 'pulse'
        },
        borderGlow: {
          color: '255, 200, 100',
          intensity: 0.5
        },
        scanline: null,
        ripple: null
      },
      SURPRISED: {
        bgGradient: ['#2a3a4a', '#1a2a3a'],
        particles: null,
        overlay: {
          type: 'colorShift',
          color: '150, 200, 255',
          strength: 0.5
        },
        glow: {
          color: '150, 200, 255',
          intensity: 0.8,
          pattern: 'pulse'
        },
        borderGlow: {
          color: '150, 200, 255',
          intensity: 0.6
        },
        scanline: null,
        ripple: {
          color: '150, 200, 255',
          intensity: 0.3
        }
      },
      EXCITED: {
        bgGradient: ['#3a4a2a', '#2a3a1a'],
        particles: null,
        overlay: {
          type: 'colorShift',
          color: '255, 255, 100',
          strength: 0.5
        },
        glow: {
          color: '255, 255, 100',
          intensity: 1.0,
          pattern: 'pulse'
        },
        borderGlow: {
          color: '255, 255, 100',
          intensity: 0.8
        },
        scanline: null,
        ripple: {
          color: '255, 255, 100',
          intensity: 0.4
        }
      },
      DETERMINED: {
        bgGradient: ['#2a2a3a', '#1a1a2a'],
        particles: null,
        overlay: {
          type: 'colorShift',
          color: '200, 150, 255',
          strength: 0.4
        },
        glow: {
          color: '200, 150, 255',
          intensity: 0.7,
          pattern: 'stable'
        },
        borderGlow: {
          color: '200, 150, 255',
          intensity: 0.5
        },
        scanline: null,
        ripple: null
      }
    };
  }

  setMood(mood) {
    this.currentMood = mood;
    // 清除之前的叠加层效果
    this.effectsManager.clearOverlayEffects();
  }

  setCustomBackground(backgroundConfig) {
    // 设置自定义背景配置
    this.customBackground = backgroundConfig;
  }

  update(deltaTime) {
    this.time += deltaTime;
    const moodDef = this.moodDefinitions[this.currentMood] || this.moodDefinitions.DEFAULT;
    const bg = moodDef.background || {};
    
    // 更新叠加层效果
    if (bg.overlay) {
      this.updateOverlay(bg.overlay);
    }
  }

  spawnParticles(config) {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const direction = config.direction || 'random';
    
    for (let i = 0; i < config.count; i++) {
      const angle = (Math.PI * 2 / config.count) * i + Math.random() * 0.8;
      const distance = 20 + Math.random() * 40;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      let vx, vy, gravity;
      
      switch (direction) {
        case 'up':
          vx = (Math.random() - 0.5) * 40;
          vy = -50 - Math.random() * 30;
          gravity = -20;
          break;
        case 'down':
          vx = (Math.random() - 0.5) * 30;
          vy = 30 + Math.random() * 20;
          gravity = 100;
          break;
        case 'explode':
          const explodeAngle = (Math.PI * 2 / config.count) * i;
          const speed = 80 + Math.random() * 40;
          vx = Math.cos(explodeAngle) * speed;
          vy = Math.sin(explodeAngle) * speed;
          gravity = 50;
          break;
        case 'rain':
          vx = (Math.random() - 0.5) * 20;
          vy = 40 + Math.random() * 30;
          gravity = 120;
          break;
        case 'float':
          vx = (Math.random() - 0.5) * 30;
          vy = -20 - Math.random() * 20;
          gravity = -10;
          break;
        case 'chaos':
          vx = (Math.random() - 0.5) * 100;
          vy = (Math.random() - 0.5) * 100;
          gravity = 0;
          break;
        case 'static':
          vx = (Math.random() - 0.5) * 10;
          vy = (Math.random() - 0.5) * 10;
          gravity = 0;
          break;
        default: // random
          vx = (Math.random() - 0.5) * 60;
          vy = (Math.random() - 0.5) * 60 - 30;
          gravity = 80;
      }
      
      this.effectsManager.addParticle({
        x,
        y,
        vx,
        vy,
        size: config.size + Math.random() * 2,
        color: config.color,
        life: 1.5 + Math.random() * 1,
        gravity,
        type: config.type,
        glow: config.glow
      });
    }
  }

  updateOverlay(config) {
    // 持续添加叠加层效果，确保始终有一个活跃的叠加层
    const existingOverlay = this.effectsManager.overlayEffects.find(
      e => e.type === config.type
    );
    
    if (!existingOverlay || existingOverlay.life < 0.5) {
      this.effectsManager.addOverlayEffect({
        type: config.type,
        x: this.width / 2,
        y: this.height / 2,
        radius: Math.max(this.width, this.height) * 1.5,
        color: config.color,
        strength: config.strength,
        life: 1.0,
        maxLife: 1.0
      });
    } else {
      // 刷新现有叠加层的生命值
      existingOverlay.life = Math.min(existingOverlay.maxLife, existingOverlay.life + 0.2);
    }
  }

  renderBackground() {
    // 优先使用自定义背景，否则使用 mood 定义
    let bg;
    if (this.customBackground) {
      bg = this.customBackground;
    } else {
      const moodDef = this.moodDefinitions[this.currentMood] || this.moodDefinitions.DEFAULT;
      bg = moodDef.background || {};
    }
    
    // 创建渐变背景
    const gradient = this.ctx.createLinearGradient(
      0, 0,
      0, this.height
    );
    const bgGradient = bg.gradient || ['#0a0a0a', '#0a0a0a'];
    gradient.addColorStop(0, bgGradient[0]);
    gradient.addColorStop(0.5, bgGradient[1] || bgGradient[0]);
    gradient.addColorStop(1, bgGradient[1] || bgGradient[0]);
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // 渲染光晕效果
    if (bg.glow) {
      this.renderGlow(bg.glow);
    }
    
    // 渲染边框光效
    if (bg.borderGlow) {
      this.renderBorderGlow(bg.borderGlow);
    }
    
    // 扫描线效果
    if (bg.scanline) {
      this.renderScanline(bg.scanline);
    }
    
    // 波纹效果
    if (bg.ripple) {
      this.renderRipple(bg.ripple);
    }
  }

  renderGlow(config) {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const time = this.time * 0.001;
    const pattern = config.pattern || 'pulse';
    
    let pulse, radius;
    
    switch (pattern) {
      case 'pulse':
        pulse = 0.6 + Math.sin(time * 2.5) * 0.4;
        radius = Math.max(this.width, this.height) * 0.8 * pulse;
        break;
      case 'flicker':
        pulse = 0.5 + Math.sin(time * 8) * 0.5;
        radius = Math.max(this.width, this.height) * 0.7 * pulse;
        break;
      case 'irregular':
        pulse = 0.5 + (Math.sin(time * 3) + Math.sin(time * 5) * 0.5) * 0.5;
        radius = Math.max(this.width, this.height) * 0.75 * pulse;
        break;
      case 'romantic':
        pulse = 0.7 + Math.sin(time * 1.5) * 0.3;
        radius = Math.max(this.width, this.height) * 0.9 * pulse;
        break;
      case 'stable':
        pulse = 0.8;
        radius = Math.max(this.width, this.height) * 0.7;
        break;
      case 'fade':
        pulse = 0.4 + Math.sin(time * 1) * 0.2;
        radius = Math.max(this.width, this.height) * 0.6 * pulse;
        break;
      case 'static':
        pulse = 0.5;
        radius = Math.max(this.width, this.height) * 0.6;
        break;
      default: // radial
        pulse = 0.7 + Math.sin(time * 2) * 0.3;
        radius = Math.max(this.width, this.height) * 0.8 * pulse;
    }
    
    // 多层光晕效果
    const layers = pattern === 'romantic' ? 3 : 2;
    for (let i = 0; i < layers; i++) {
      const layerPulse = pulse * (1 - i * 0.25);
      const layerRadius = radius * (1 - i * 0.15);
      
      const gradient = this.ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, layerRadius
      );
      const alpha1 = config.intensity * layerPulse * (0.5 - i * 0.1);
      const alpha2 = config.intensity * layerPulse * (0.25 - i * 0.05);
      gradient.addColorStop(0, `rgba(${config.color}, ${alpha1})`);
      gradient.addColorStop(0.4, `rgba(${config.color}, ${alpha2})`);
      gradient.addColorStop(1, `rgba(${config.color}, 0)`);
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  renderBorderGlow(config) {
    const time = this.time * 0.001;
    let pulse, thickness;
    
    if (config.flicker) {
      pulse = 0.4 + Math.sin(time * 10) * 0.6;
      thickness = 2 + pulse * 3;
    } else {
      pulse = 0.7 + Math.sin(time * 3) * 0.3;
      thickness = 3 + pulse * 2;
    }
    
    this.ctx.save();
    this.ctx.strokeStyle = `rgba(${config.color}, ${config.intensity * pulse})`;
    this.ctx.lineWidth = thickness;
    this.ctx.shadowColor = `rgb(${config.color})`;
    this.ctx.shadowBlur = 20 * pulse;
    
    // 绘制边框
    this.ctx.strokeRect(0, 0, this.width, this.height);
    
    // 添加内层边框光效
    this.ctx.strokeStyle = `rgba(${config.color}, ${config.intensity * pulse * 0.5})`;
    this.ctx.lineWidth = 1;
    this.ctx.shadowBlur = 10 * pulse;
    this.ctx.strokeRect(2, 2, this.width - 4, this.height - 4);
    
    this.ctx.restore();
  }

  renderScanline(config) {
    const time = this.time * 0.001;
    const scanlineY = (this.height * 0.3 + Math.sin(time * 2) * this.height * 0.4) % this.height;
    
    this.ctx.save();
    this.ctx.strokeStyle = `rgba(${config.color}, ${config.intensity})`;
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = `rgb(${config.color})`;
    this.ctx.shadowBlur = 10;
    this.ctx.beginPath();
    this.ctx.moveTo(0, scanlineY);
    this.ctx.lineTo(this.width, scanlineY);
    this.ctx.stroke();
    this.ctx.restore();
  }

  renderRipple(config) {
    const time = this.time * 0.001;
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    
    // 创建多个波纹
    for (let i = 0; i < 3; i++) {
      const rippleTime = time - i * 0.5;
      if (rippleTime < 0) continue;
      
      const radius = (rippleTime * 100) % (Math.max(this.width, this.height) * 0.8);
      const alpha = config.intensity * (1 - radius / (Math.max(this.width, this.height) * 0.8));
      
      if (alpha > 0) {
        this.ctx.save();
        this.ctx.strokeStyle = `rgba(${config.color}, ${alpha})`;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
      }
    }
  }

  renderOverlay() {
    // 叠加层效果由 EffectsManager 处理
    // 这里可以添加额外的叠加效果
  }
}

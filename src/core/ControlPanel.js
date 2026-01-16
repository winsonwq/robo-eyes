import { MoodDefinitions, EyeShapes } from './MoodSystem.js';

/**
 * 控制面板管理器
 * 管理所有维度的实时控制
 */
export class ControlPanel {
  constructor(eyeController, moodEffects) {
    this.eyeController = eyeController;
    this.moodEffects = moodEffects;
    this.currentMood = 'DEFAULT';
    
    // 当前的自定义配置
    this.customConfig = {
      shape: EyeShapes.ELLIPSE,
      leftEye: { scaleX: 1.0, scaleY: 1.0 },
      rightEye: { scaleX: 1.0, scaleY: 1.0 },
      borderRadius: 1.0,
      rotation: 0,
      background: {
        gradient: ['#0a0a0a', '#0a0a0a'],
        glow: null,
        borderGlow: null,
        scanline: null,
        ripple: null
      }
    };
    
    this.setupControls();
  }

  setupControls() {
    // Mood 预设按钮 - 只加载预设，不锁定控制
    document.querySelectorAll('.btn-mood').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mood = e.target.dataset.mood;
        this.loadMoodPreset(mood);
        document.querySelectorAll('.btn-mood').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });

    // 眼睛形状
    const eyeShapeSelect = document.getElementById('eye-shape');
    eyeShapeSelect.addEventListener('change', (e) => {
      this.customConfig.shape = e.target.value;
      this.applyCustomConfig();
    });

    // 左眼大小
    const leftWidthSlider = document.getElementById('left-eye-width');
    const leftHeightSlider = document.getElementById('left-eye-height');
    leftWidthSlider.addEventListener('input', (e) => {
      this.customConfig.leftEye.scaleX = parseFloat(e.target.value);
      document.getElementById('left-width-value').textContent = e.target.value;
      this.applyCustomConfig();
    });
    leftHeightSlider.addEventListener('input', (e) => {
      this.customConfig.leftEye.scaleY = parseFloat(e.target.value);
      document.getElementById('left-height-value').textContent = e.target.value;
      this.applyCustomConfig();
    });

    // 右眼大小
    const rightWidthSlider = document.getElementById('right-eye-width');
    const rightHeightSlider = document.getElementById('right-eye-height');
    rightWidthSlider.addEventListener('input', (e) => {
      this.customConfig.rightEye.scaleX = parseFloat(e.target.value);
      document.getElementById('right-width-value').textContent = e.target.value;
      this.applyCustomConfig();
    });
    rightHeightSlider.addEventListener('input', (e) => {
      this.customConfig.rightEye.scaleY = parseFloat(e.target.value);
      document.getElementById('right-height-value').textContent = e.target.value;
      this.applyCustomConfig();
    });

    // 圆角和旋转
    const radiusSlider = document.getElementById('border-radius');
    const rotationSlider = document.getElementById('eye-rotation');
    radiusSlider.addEventListener('input', (e) => {
      this.customConfig.borderRadius = parseFloat(e.target.value);
      document.getElementById('radius-value').textContent = e.target.value;
      this.applyCustomConfig();
    });
    rotationSlider.addEventListener('input', (e) => {
      this.customConfig.rotation = parseInt(e.target.value);
      document.getElementById('rotation-value').textContent = e.target.value;
      this.applyCustomConfig();
    });

    // 背景颜色
    const bgColor1 = document.getElementById('bg-color-1');
    const bgColor2 = document.getElementById('bg-color-2');
    bgColor1.addEventListener('input', (e) => {
      this.customConfig.background.gradient[0] = e.target.value;
      this.applyCustomConfig();
    });
    bgColor2.addEventListener('input', (e) => {
      this.customConfig.background.gradient[1] = e.target.value;
      this.applyCustomConfig();
    });

    // 光晕效果
    const glowColor = document.getElementById('glow-color');
    const glowIntensity = document.getElementById('glow-intensity');
    const glowPattern = document.getElementById('glow-pattern');
    glowColor.addEventListener('input', (e) => {
      if (!this.customConfig.background.glow) {
        this.customConfig.background.glow = { color: '', intensity: 0, pattern: 'radial' };
      }
      this.customConfig.background.glow.color = this.hexToRgbString(e.target.value);
      this.applyCustomConfig();
    });
    glowIntensity.addEventListener('input', (e) => {
      if (!this.customConfig.background.glow) {
        this.customConfig.background.glow = { color: '255, 255, 255', intensity: 0, pattern: 'radial' };
      }
      this.customConfig.background.glow.intensity = parseFloat(e.target.value);
      document.getElementById('glow-intensity-value').textContent = e.target.value;
      this.applyCustomConfig();
    });
    glowPattern.addEventListener('change', (e) => {
      if (e.target.value === 'none') {
        this.customConfig.background.glow = null;
      } else {
        if (!this.customConfig.background.glow) {
          this.customConfig.background.glow = { color: '255, 255, 255', intensity: 0.5, pattern: e.target.value };
        }
        this.customConfig.background.glow.pattern = e.target.value;
      }
      this.applyCustomConfig();
    });

    // 边框光效
    const borderColor = document.getElementById('border-color');
    const borderIntensity = document.getElementById('border-intensity');
    borderColor.addEventListener('input', (e) => {
      if (!this.customConfig.background.borderGlow) {
        this.customConfig.background.borderGlow = { color: '', intensity: 0 };
      }
      this.customConfig.background.borderGlow.color = this.hexToRgbString(e.target.value);
      this.applyCustomConfig();
    });
    borderIntensity.addEventListener('input', (e) => {
      if (parseFloat(e.target.value) === 0) {
        this.customConfig.background.borderGlow = null;
      } else {
        if (!this.customConfig.background.borderGlow) {
          this.customConfig.background.borderGlow = { color: '255, 255, 255', intensity: 0 };
        }
        this.customConfig.background.borderGlow.intensity = parseFloat(e.target.value);
      }
      document.getElementById('border-intensity-value').textContent = e.target.value;
      this.applyCustomConfig();
    });

    // 扫描线
    const scanlineColor = document.getElementById('scanline-color');
    const scanlineIntensity = document.getElementById('scanline-intensity');
    scanlineColor.addEventListener('input', (e) => {
      if (!this.customConfig.background.scanline) {
        this.customConfig.background.scanline = { color: '', intensity: 0 };
      }
      this.customConfig.background.scanline.color = this.hexToRgbString(e.target.value);
      this.applyCustomConfig();
    });
    scanlineIntensity.addEventListener('input', (e) => {
      if (parseFloat(e.target.value) === 0) {
        this.customConfig.background.scanline = null;
      } else {
        if (!this.customConfig.background.scanline) {
          this.customConfig.background.scanline = { color: '255, 255, 255', intensity: 0 };
        }
        this.customConfig.background.scanline.intensity = parseFloat(e.target.value);
      }
      document.getElementById('scanline-intensity-value').textContent = e.target.value;
      this.applyCustomConfig();
    });

    // 波纹
    const rippleColor = document.getElementById('ripple-color');
    const rippleIntensity = document.getElementById('ripple-intensity');
    rippleColor.addEventListener('input', (e) => {
      if (!this.customConfig.background.ripple) {
        this.customConfig.background.ripple = { color: '', intensity: 0 };
      }
      this.customConfig.background.ripple.color = this.hexToRgbString(e.target.value);
      this.applyCustomConfig();
    });
    rippleIntensity.addEventListener('input', (e) => {
      if (parseFloat(e.target.value) === 0) {
        this.customConfig.background.ripple = null;
      } else {
        if (!this.customConfig.background.ripple) {
          this.customConfig.background.ripple = { color: '255, 255, 255', intensity: 0 };
        }
        this.customConfig.background.ripple.intensity = parseFloat(e.target.value);
      }
      document.getElementById('ripple-intensity-value').textContent = e.target.value;
      this.applyCustomConfig();
    });
  }

  loadMoodPreset(moodName) {
    this.currentMood = moodName;
    const preset = MoodDefinitions[moodName] || MoodDefinitions.DEFAULT;
    
    // 加载预设到自定义配置
    this.customConfig = {
      shape: preset.shape || EyeShapes.ELLIPSE,
      leftEye: { ...preset.leftEye },
      rightEye: { ...preset.rightEye },
      borderRadius: preset.borderRadius || 1.0,
      rotation: preset.rotation || 0,
      background: {
        gradient: [...(preset.background?.gradient || ['#0a0a0a', '#0a0a0a'])],
        glow: preset.background?.glow ? { ...preset.background.glow } : null,
        borderGlow: preset.background?.borderGlow ? { ...preset.background.borderGlow } : null,
        scanline: preset.background?.scanline ? { ...preset.background.scanline } : null,
        ripple: preset.background?.ripple ? { ...preset.background.ripple } : null
      }
    };
    
    // 更新 UI 控件
    this.updateUIFromConfig();
    
    // 应用配置
    this.applyCustomConfig();
  }

  updateUIFromConfig() {
    // 更新形状选择器
    document.getElementById('eye-shape').value = this.customConfig.shape;
    
    // 更新眼睛大小滑块
    document.getElementById('left-eye-width').value = this.customConfig.leftEye.scaleX;
    document.getElementById('left-width-value').textContent = this.customConfig.leftEye.scaleX.toFixed(2);
    document.getElementById('left-eye-height').value = this.customConfig.leftEye.scaleY;
    document.getElementById('left-height-value').textContent = this.customConfig.leftEye.scaleY.toFixed(2);
    document.getElementById('right-eye-width').value = this.customConfig.rightEye.scaleX;
    document.getElementById('right-width-value').textContent = this.customConfig.rightEye.scaleX.toFixed(2);
    document.getElementById('right-eye-height').value = this.customConfig.rightEye.scaleY;
    document.getElementById('right-height-value').textContent = this.customConfig.rightEye.scaleY.toFixed(2);
    
    // 更新圆角和旋转
    document.getElementById('border-radius').value = this.customConfig.borderRadius;
    document.getElementById('radius-value').textContent = this.customConfig.borderRadius.toFixed(2);
    document.getElementById('eye-rotation').value = this.customConfig.rotation;
    document.getElementById('rotation-value').textContent = this.customConfig.rotation;
    
    // 更新背景颜色
    document.getElementById('bg-color-1').value = this.customConfig.background.gradient[0];
    document.getElementById('bg-color-2').value = this.customConfig.background.gradient[1] || this.customConfig.background.gradient[0];
    
    // 更新光晕
    if (this.customConfig.background.glow && this.customConfig.background.glow.color) {
      document.getElementById('glow-color').value = this.rgbStringToHex(this.customConfig.background.glow.color);
      document.getElementById('glow-intensity').value = this.customConfig.background.glow.intensity || 0;
      document.getElementById('glow-intensity-value').textContent = (this.customConfig.background.glow.intensity || 0).toFixed(1);
      document.getElementById('glow-pattern').value = this.customConfig.background.glow.pattern || 'radial';
    } else {
      document.getElementById('glow-intensity').value = 0;
      document.getElementById('glow-intensity-value').textContent = '0';
      document.getElementById('glow-pattern').value = 'none';
    }
    
    // 更新边框光效
    if (this.customConfig.background.borderGlow && this.customConfig.background.borderGlow.color) {
      document.getElementById('border-color').value = this.rgbStringToHex(this.customConfig.background.borderGlow.color);
      document.getElementById('border-intensity').value = this.customConfig.background.borderGlow.intensity || 0;
      document.getElementById('border-intensity-value').textContent = (this.customConfig.background.borderGlow.intensity || 0).toFixed(1);
    } else {
      document.getElementById('border-intensity').value = 0;
      document.getElementById('border-intensity-value').textContent = '0';
    }
    
    // 更新扫描线
    if (this.customConfig.background.scanline && this.customConfig.background.scanline.color) {
      document.getElementById('scanline-color').value = this.rgbStringToHex(this.customConfig.background.scanline.color);
      document.getElementById('scanline-intensity').value = this.customConfig.background.scanline.intensity || 0;
      document.getElementById('scanline-intensity-value').textContent = (this.customConfig.background.scanline.intensity || 0).toFixed(1);
    } else {
      document.getElementById('scanline-intensity').value = 0;
      document.getElementById('scanline-intensity-value').textContent = '0';
    }
    
    // 更新波纹
    if (this.customConfig.background.ripple && this.customConfig.background.ripple.color) {
      document.getElementById('ripple-color').value = this.rgbStringToHex(this.customConfig.background.ripple.color);
      document.getElementById('ripple-intensity').value = this.customConfig.background.ripple.intensity || 0;
      document.getElementById('ripple-intensity-value').textContent = (this.customConfig.background.ripple.intensity || 0).toFixed(1);
    } else {
      document.getElementById('ripple-intensity').value = 0;
      document.getElementById('ripple-intensity-value').textContent = '0';
    }
  }

  applyCustomConfig() {
    // 应用眼睛配置到 EyeRenderer
    // 这里需要通过 eyeController 来设置
    // 我们需要扩展 EyeRenderer 来支持动态配置
    
    // 应用背景效果到 MoodEffects
    this.moodEffects.setCustomBackground(this.customConfig.background);
    
    // 应用眼睛形状和大小
    this.eyeController.setCustomEyeConfig({
      shape: this.customConfig.shape,
      leftEye: this.customConfig.leftEye,
      rightEye: this.customConfig.rightEye,
      borderRadius: this.customConfig.borderRadius,
      rotation: this.customConfig.rotation
    });
  }

  hexToRgbString(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
    }
    return '255, 255, 255';
  }

  rgbStringToHex(rgbString) {
    if (!rgbString) return '#ffffff';
    const parts = rgbString.split(',').map(s => parseInt(s.trim()));
    if (parts.length !== 3) return '#ffffff';
    return `#${parts.map(p => p.toString(16).padStart(2, '0')).join('')}`;
  }
}

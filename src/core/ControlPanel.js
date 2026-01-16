import { MoodDefinitions, EyeShapes } from './MoodSystem.js';

/**
 * Control Panel Manager
 * Manages real-time control of all dimensions
 */
export class ControlPanel {
  constructor(eyeController, moodEffects) {
    this.eyeController = eyeController;
    this.moodEffects = moodEffects;
    this.currentMood = 'DEFAULT';
    
    // Current custom configuration
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
        scanline: null
      }
    };
    
    this.setupControls();
  }

  setupControls() {
    // Mood preset buttons - only load presets, don't lock controls
    document.querySelectorAll('.btn-mood').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mood = e.target.dataset.mood;
        this.loadMoodPreset(mood);
        document.querySelectorAll('.btn-mood').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });

    // Eye shape
    const eyeShapeSelect = document.getElementById('eye-shape');
    eyeShapeSelect.addEventListener('change', (e) => {
      this.customConfig.shape = e.target.value;
      this.applyCustomConfig();
    });

    // Left eye size
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

    // Right eye size
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

    // Border radius and rotation
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

    // Position control - overall movement range
    const posRangeSlider = document.getElementById('position-range');
    
    posRangeSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      document.getElementById('pos-range-value').textContent = value.toFixed(1);
      this.eyeController.setPositionRange(value);
      // Re-apply current position button position (if selected)
      const activePosBtn = document.querySelector('.pos-btn.active');
      if (activePosBtn) {
        const pos = activePosBtn.dataset.pos;
        this.eyeController.setPosition(pos);
      } else {
        // If no button is selected, use default position
        this.eyeController.setPosition('DEFAULT');
      }
    });

    // Background color
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

    // Glow effect
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

    // Border glow effect
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

    // Scanline
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

  }

  loadMoodPreset(moodName) {
    this.currentMood = moodName;
    const preset = MoodDefinitions[moodName] || MoodDefinitions.DEFAULT;
    
    // Load preset to custom configuration
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
      }
    };
    
    // Update UI controls
    this.updateUIFromConfig();
    
    // Apply configuration
    this.applyCustomConfig();
  }

  updateUIFromConfig() {
    // Update shape selector
    document.getElementById('eye-shape').value = this.customConfig.shape;
    
    // Update eye size sliders
    document.getElementById('left-eye-width').value = this.customConfig.leftEye.scaleX;
    document.getElementById('left-width-value').textContent = this.customConfig.leftEye.scaleX.toFixed(2);
    document.getElementById('left-eye-height').value = this.customConfig.leftEye.scaleY;
    document.getElementById('left-height-value').textContent = this.customConfig.leftEye.scaleY.toFixed(2);
    document.getElementById('right-eye-width').value = this.customConfig.rightEye.scaleX;
    document.getElementById('right-width-value').textContent = this.customConfig.rightEye.scaleX.toFixed(2);
    document.getElementById('right-eye-height').value = this.customConfig.rightEye.scaleY;
    document.getElementById('right-height-value').textContent = this.customConfig.rightEye.scaleY.toFixed(2);
    
    // Update border radius and rotation
    document.getElementById('border-radius').value = this.customConfig.borderRadius;
    document.getElementById('radius-value').textContent = this.customConfig.borderRadius.toFixed(2);
    document.getElementById('eye-rotation').value = this.customConfig.rotation;
    document.getElementById('rotation-value').textContent = this.customConfig.rotation;
    
    // Update background color
    document.getElementById('bg-color-1').value = this.customConfig.background.gradient[0];
    document.getElementById('bg-color-2').value = this.customConfig.background.gradient[1] || this.customConfig.background.gradient[0];
    
    // Update glow
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
    
    // Update border glow
    if (this.customConfig.background.borderGlow && this.customConfig.background.borderGlow.color) {
      document.getElementById('border-color').value = this.rgbStringToHex(this.customConfig.background.borderGlow.color);
      document.getElementById('border-intensity').value = this.customConfig.background.borderGlow.intensity || 0;
      document.getElementById('border-intensity-value').textContent = (this.customConfig.background.borderGlow.intensity || 0).toFixed(1);
    } else {
      document.getElementById('border-intensity').value = 0;
      document.getElementById('border-intensity-value').textContent = '0';
    }
    
    // Update scanline
    if (this.customConfig.background.scanline && this.customConfig.background.scanline.color) {
      document.getElementById('scanline-color').value = this.rgbStringToHex(this.customConfig.background.scanline.color);
      document.getElementById('scanline-intensity').value = this.customConfig.background.scanline.intensity || 0;
      document.getElementById('scanline-intensity-value').textContent = (this.customConfig.background.scanline.intensity || 0).toFixed(1);
    } else {
      document.getElementById('scanline-intensity').value = 0;
      document.getElementById('scanline-intensity-value').textContent = '0';
    }
    
  }

  applyCustomConfig() {
    // Apply eye configuration to EyeRenderer
    // This needs to be set through eyeController
    // We need to extend EyeRenderer to support dynamic configuration
    
    // Apply background effects to MoodEffects
    this.moodEffects.setCustomBackground(this.customConfig.background);
    
    // Apply eye shape and size
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

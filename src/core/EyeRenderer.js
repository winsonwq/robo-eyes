import { MoodDefinitions, EyeShapes } from './MoodSystem.js';

export class EyeRenderer {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;

    this.options = {
      eyeWidth: 50,
      eyeHeight: 60,
      borderRadius: 12,
      spaceBetween: 20,
      eyeColor: '#ffffff',
      bgColor: '#000000',
      ...options
    };

    this.currentMood = 'DEFAULT';
    this.targetPosition = { x: 0, y: 0 };
    this.currentPosition = { x: 0, y: 0 };
    this.blinkProgress = 0;
    this.isBlinking = false;
    this.isClosed = false;
    this.closingProgress = 0; // 关闭动画进度 (0-1)
    this.openingProgress = 1; // 打开动画进度 (0-1)
    this.animLaughY = 0;
    this.animConfusedX = 0;
    this.animFlicker = 0;
    this.animThinking = false;
    this.animSpeaking = false;
    this.thinkingOffset = 0;
    this.speakingPhase = 0;
    this.speakingScale = 1;
    this.curiosityEnabled = false; // Default off to avoid eye asymmetry issues
    this.moodDefinitions = MoodDefinitions;
    this.customConfig = null; // Custom configuration

    // 保留旧的 moods 定义以兼容（将被移除）
    this.moods = {
      DEFAULT: { 
        eyeScaleY: 1.0, 
        eyeScaleX: 1.0, 
        borderRadiusScale: 1.0,
        rotation: 0,
        verticalOffset: 0,
        brightness: 1.0
      },
      HAPPY: { 
        eyeScaleY: 0.65,      // Flatter (reduced from 0.75 to 0.65)
        eyeScaleX: 1.25,      // Wider (increased from 1.1 to 1.25)
        borderRadiusScale: 1.4, // Rounder (increased from 1.2 to 1.4)
        rotation: 0,
        verticalOffset: -2,   // Slightly move up, appear happier
        brightness: 1.1       // Brighter
      },
      TIRED: { 
        eyeScaleY: 0.4,       // Very flat (reduced from 0.5 to 0.4)
        eyeScaleX: 1.0, 
        borderRadiusScale: 0.7, // Less round (reduced from 0.8 to 0.7)
        rotation: 0,
        verticalOffset: 1,    // Slightly move down, appear tired
        brightness: 0.7       // Darker
      },
      ANGRY: { 
        eyeScaleY: 0.85,      // Slightly narrower
        eyeScaleX: 0.85,      // Narrower (reduced from 0.9 to 0.85)
        borderRadiusScale: 0.5, // Sharper (reduced from 0.6 to 0.5)
        rotation: -3,        // Inner corner tilts down, appear angry
        verticalOffset: 0,
        brightness: 0.9
      },
      SUSPICIOUS: { 
        eyeScaleY: 0.8,       // Slightly flatter
        eyeScaleX: 1.0, 
        borderRadiusScale: 0.85, // Slightly less round
        rotation: 2,         // Slightly tilted
        verticalOffset: -1,
        brightness: 0.95
      },
      SERIOUS: { 
        eyeScaleY: 0.9,       // Slightly flatter
        eyeScaleX: 0.95,      // Slightly narrower
        borderRadiusScale: 0.85, // Slightly less round
        rotation: 0,
        verticalOffset: 0,
        brightness: 0.9
      },
      IRRITATED: { 
        eyeScaleY: 0.7,       // Flatter (reduced from 0.8 to 0.7)
        eyeScaleX: 0.9,       // Narrower (reduced from 0.95 to 0.9)
        borderRadiusScale: 0.6, // Less round (reduced from 0.7 to 0.6)
        rotation: -2,        // Slightly tilted
        verticalOffset: 0,
        brightness: 0.85
      },
      SAD: { 
        eyeScaleY: 0.6,       // Flatter (reduced from 0.7 to 0.6)
        eyeScaleX: 1.0, 
        borderRadiusScale: 1.2, // Rounder (increased from 1.1 to 1.2)
        rotation: 3,         // Outer corner tilts down, appear sad
        verticalOffset: 1,    // Slightly move down
        brightness: 0.75      // Darker
      },
      HAPPYBLUSH: { 
        eyeScaleY: 0.55,      // Very flat (reduced from 0.7 to 0.55)
        eyeScaleX: 1.3,       // Very wide (increased from 1.15 to 1.3)
        borderRadiusScale: 1.5, // Very round (increased from 1.3 to 1.5)
        rotation: 0,
        verticalOffset: -3,   // Significantly move up
        brightness: 1.15      // Brighter
      },
      FOCUSED: {
        eyeScaleY: 0.85,      // Slightly smaller, more focused
        eyeScaleX: 0.9,       // Slightly narrower，内聚
        borderRadiusScale: 0.9, // Slightly less round
        rotation: 0,
        verticalOffset: 0,
        brightness: 1.0
      },
      EFFORT: {
        eyeScaleY: 0.5,       // Narrower, show effort
        eyeScaleX: 0.85,      // Narrower
        borderRadiusScale: 0.6, // Sharper
        rotation: -1,         // Slightly tilt down
        verticalOffset: 1,    // Slightly move down
        brightness: 0.95
      },
      SURPRISED: {
        eyeScaleY: 1.2,       // Larger
        eyeScaleX: 1.1,       // Wider
        borderRadiusScale: 1.3, // Rounder
        rotation: 0,
        verticalOffset: -2,   // Slightly move up
        brightness: 1.1
      },
      EXCITED: {
        eyeScaleY: 1.1,       // Larger
        eyeScaleX: 1.2,       // Wider
        borderRadiusScale: 1.4, // Very round
        rotation: 0,
        verticalOffset: -2,   // Slightly move up
        brightness: 1.2       // Brighter
      },
      DETERMINED: {
        eyeScaleY: 0.8,       // Slightly smaller
        eyeScaleX: 0.9,       // Slightly narrower
        borderRadiusScale: 0.7, // Sharper
        rotation: 0,
        verticalOffset: 0,
        brightness: 1.05      // Slightly brighter
      }
    };
    
    // Eye position offset (original version moves entire eye position to "look" in different directions)
    // Offset relative to canvas size to make movement more visible
    // Max horizontal offset ~12-15% of canvas width, vertical ~10-12% of canvas height
    this.baseMaxOffsetX = this.width * 0.12;  // Base max offset X (~38 pixels)
    this.baseMaxOffsetY = this.height * 0.11;  // Base max offset Y (~20 pixels)
    
    // Position movement range multiplier (for controlling overall displacement size, 0-3.0)
    this.positionRange = 1.0;
    // Currently selected position key (for reapplying range)
    this.currentPositionKey = 'DEFAULT';
    
    // Calculate actual max offset (adjusted by range)
    this.updateMaxOffsets();
    
    // Update actual max offset value (based on positionRange)
    this.updateMaxOffsets();
    
    // Position definitions (will be updated in updateMaxOffsets)
    this.positions = {};
    this.updatePositions();
  }

  updateMaxOffsets() {
    // Calculate actual max offset based on positionRange
    this.maxOffsetX = this.baseMaxOffsetX * this.positionRange;
    this.maxOffsetY = this.baseMaxOffsetY * this.positionRange;
  }

  updatePositions() {
    // Update all position definitions based on current maxOffsetX/Y
    this.positions = {
      DEFAULT: { x: 0, y: 0 },
      N: { x: 0, y: -this.maxOffsetY },
      NE: { x: this.maxOffsetX * 0.707, y: -this.maxOffsetY * 0.707 },
      E: { x: this.maxOffsetX, y: 0 },
      SE: { x: this.maxOffsetX * 0.707, y: this.maxOffsetY * 0.707 },
      S: { x: 0, y: this.maxOffsetY },
      SW: { x: -this.maxOffsetX * 0.707, y: this.maxOffsetY * 0.707 },
      W: { x: -this.maxOffsetX, y: 0 },
      NW: { x: -this.maxOffsetX * 0.707, y: -this.maxOffsetY * 0.707 }
    };
  }

  setMood(mood) {
    this.currentMood = mood;
  }

  setCustomEyeConfig(config) {
    // Store custom configuration
    this.customConfig = config;
  }

  getCurrentEyeConfig(isLeft) {
    // If custom config exists, use it; otherwise use mood definition
    if (this.customConfig) {
      const eyeConfig = isLeft ? this.customConfig.leftEye : this.customConfig.rightEye;
      return {
        shape: this.customConfig.shape,
        scaleX: eyeConfig.scaleX,
        scaleY: eyeConfig.scaleY,
        borderRadius: this.customConfig.borderRadius,
        rotation: this.customConfig.rotation
      };
    }
    
    // Otherwise use mood definition
    const moodDef = this.moodDefinitions[this.currentMood] || this.moodDefinitions.DEFAULT;
    const eyeConfig = isLeft ? moodDef.leftEye : moodDef.rightEye;
    return {
      shape: moodDef.shape || EyeShapes.ELLIPSE,
      scaleX: eyeConfig.scaleX,
      scaleY: eyeConfig.scaleY,
      borderRadius: moodDef.borderRadius || 1.0,
      rotation: moodDef.rotation || 0
    };
  }

  setEyeColor(color) {
    this.options.eyeColor = color;
  }

  setBgColor(color) {
    this.options.bgColor = color;
  }

  setColors(eyeColor, bgColor) {
    if (eyeColor) this.options.eyeColor = eyeColor;
    if (bgColor) this.options.bgColor = bgColor;
  }

  setPosition(position) {
    if (typeof position === 'string') {
      this.currentPositionKey = position; // Save currently selected position key
      const pos = this.positions[position] || this.positions.DEFAULT;
      this.targetPosition = { ...pos };
    } else {
      this.currentPositionKey = null; // Clear position key (directly set coordinates)
      this.targetPosition = { ...position };
    }
  }

  setPositionRange(range) {
    this.positionRange = range;
    // Update max offset value
    this.updateMaxOffsets();
    // Update all position definitions
    this.updatePositions();
    // Re-apply currently saved position string (if any)
    if (this.currentPositionKey) {
      this.setPosition(this.currentPositionKey);
    }
  }

  setBlink(blink) {
    if (blink <= 0.05) {
      this.isClosed = true;
      this.blinkProgress = 1;
    } else {
      this.isClosed = false;
      this.blinkProgress = 1 - blink;
    }
    this.isBlinking = blink < 0.95;
  }

  open() {
    this.isClosed = false;
    this.openingProgress = 0; // Start opening animation
    this.closingProgress = 0;
  }

  close() {
    this.isClosed = true;
    this.closingProgress = 0; // Start closing animation
    this.openingProgress = 0;
  }

  setLaugh(active) {
    if (active) {
      this.animLaughY = Math.sin(Date.now() / 50) * 2;
    } else {
      this.animLaughY = 0;
    }
  }

  setConfused(active) {
    if (active) {
      this.animConfusedX = Math.sin(Date.now() / 100) * 3;
    } else {
      this.animConfusedX = 0;
    }
  }

  setFlicker(active, amplitude = 5) {
    if (active) {
      this.animFlicker = (Math.random() - 0.5) * amplitude;
    } else {
      this.animFlicker = 0;
    }
  }

  setCuriosity(active) {
    this.curiosityEnabled = active;
  }

  render(renderBackground = false) {
    // If background rendering is needed (default mode), use default background color
    if (renderBackground) {
      this.ctx.fillStyle = this.options.bgColor;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // Smoothly update eye position (for "looking" in different directions)
    this.currentPosition.x += (this.targetPosition.x - this.currentPosition.x) * 0.25;
    this.currentPosition.y += (this.targetPosition.y - this.currentPosition.y) * 0.25;

    // Calculate left edge positions of both eyes (base position)
    const leftEyeX = this.centerX - this.options.spaceBetween / 2 - this.options.eyeWidth;
    const rightEyeX = this.centerX + this.options.spaceBetween / 2;

    // Draw both eyes (original version moves entire eye position to "look" in different directions)
    this.drawEye(leftEyeX, this.centerY, true);
    this.drawEye(rightEyeX, this.centerY, false);
  }

  drawEye(x, y, isLeft) {
    // Get current eye configuration (custom or mood preset)
    const config = this.getCurrentEyeConfig(isLeft);
    
    let eyeWidth = this.options.eyeWidth * config.scaleX;
    let eyeHeight = this.options.eyeHeight * config.scaleY;
    
    // Curiosity mode: when eyes move to extreme left or right, outer eye height increases
    // 原版特性：setCuriosity() 开启时，外眼高度在移动到最左/最右时增加
    // Note: this feature causes eye asymmetry, default off
    // If enabled, ensure both eyes apply the same effect, or only enable in specific cases
    if (this.curiosityEnabled) {
      const normalizedOffsetX = this.maxOffsetX > 0 ? this.currentPosition.x / this.maxOffsetX : 0; // Normalize to -1 to 1
      const absOffsetX = Math.abs(normalizedOffsetX);
      
      // Only apply effect at extreme left/right, and apply same effect to both eyes to maintain symmetry
      if (absOffsetX > 0.5) {
        // When looking at extreme left/right, both eyes slightly increase height (maintain symmetry)
        const curiosityFactor = (absOffsetX - 0.5) * 0.3; // Max increase 15%, same for both eyes
        eyeHeight *= (1 + curiosityFactor);
      }
    }
    
    // Adjust border radius based on configuration
    let baseRadius = this.options.borderRadius * config.borderRadius;
    const radius = Math.min(baseRadius, eyeWidth / 2, eyeHeight / 2);

    // Update opening/closing animation progress
    if (this.isClosed) {
      // Closing animation: from 0 to 1, duration 300ms
      this.closingProgress = Math.min(1, this.closingProgress + 0.05);
      this.openingProgress = 0;
    } else {
      // Opening animation: from 0 to 1, duration 300ms
      this.openingProgress = Math.min(1, this.openingProgress + 0.05);
      this.closingProgress = 0;
    }
    
    // Blink effect
    let blinkScale = 1;
    if (this.isClosed) {
      // When closing: use closing animation progress, smoother
      const closeEase = 1 - Math.pow(1 - this.closingProgress, 3); // Easing function
      blinkScale = Math.max(0.01, 1 - closeEase);
    } else if (this.isBlinking) {
      blinkScale = Math.max(0.1, 1 - this.blinkProgress * 0.9);
    } else if (this.openingProgress < 1) {
      // When opening: use opening animation progress
      const openEase = 1 - Math.pow(1 - this.openingProgress, 2); // Easing function
      blinkScale = Math.max(0.1, openEase);
    }

    eyeHeight *= blinkScale;

    // Thinking animation: eyes move left and right
    if (this.animThinking) {
      this.thinkingOffset = Math.sin(Date.now() / 800) * 8;
    } else {
      this.thinkingOffset *= 0.9; // Smooth stop
    }
    
    // Eye position offset (for "looking" in different directions)
    const moodDef = this.moodDefinitions[this.currentMood] || this.moodDefinitions.DEFAULT;
    const offsetX = this.currentPosition.x + this.animConfusedX + this.animFlicker + this.thinkingOffset;
    const offsetY = this.currentPosition.y + this.animLaughY + (moodDef.position?.y || 0);
    
    // Both eyes move in same direction (look in same direction)
    const drawX = x + offsetX;
    const drawY = y + offsetY;

    // Save context state
    this.ctx.save();
    
    // Apply rotation (if any)
    if (config.rotation) {
      this.ctx.translate(drawX + eyeWidth / 2, drawY);
      this.ctx.rotate((config.rotation * Math.PI) / 180);
      this.ctx.translate(-(drawX + eyeWidth / 2), -drawY);
    }

    // Calculate base color and brightness
    const baseColor = this.options.eyeColor;
    const brightness = moodDef.color?.brightness || 1.0; // Brightness still read from mood definition
    
    // Convert color to RGB and apply brightness
    const rgb = this.hexToRgb(baseColor);
    const adjustedR = Math.min(255, Math.round(rgb.r * brightness));
    const adjustedG = Math.min(255, Math.round(rgb.g * brightness));
    const adjustedB = Math.min(255, Math.round(rgb.b * brightness));
    const adjustedColor = `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`;

    // Draw eye body (with gradient effect)
    const eyeX = drawX;
    const eyeY = drawY - eyeHeight / 2;
    
    // Create gradient (from top to bottom, slightly darker)
    const gradient = this.ctx.createLinearGradient(
      eyeX, eyeY,
      eyeX, eyeY + eyeHeight
    );
    const lightColor = adjustedColor;
    const darkColor = `rgb(${Math.max(0, adjustedR - 20)}, ${Math.max(0, adjustedG - 20)}, ${Math.max(0, adjustedB - 20)})`;
    gradient.addColorStop(0, lightColor);
    gradient.addColorStop(0.5, adjustedColor);
    gradient.addColorStop(1, darkColor);
    
    this.ctx.fillStyle = gradient;
    
    // Draw different eyes based on shape type
    const shape = config.shape || EyeShapes.ELLIPSE;
    this.drawEyeShape(shape, eyeX, eyeY, eyeWidth, eyeHeight, radius);

    // Add highlight effect (bright light on upper part of eye)
    if (eyeHeight > 5 && !this.isClosed && blinkScale > 0.3) {
      const highlightHeight = eyeHeight * 0.3;
      const highlightY = eyeY + eyeHeight * 0.15;
      const highlightWidth = eyeWidth * 0.6;
      const highlightX = eyeX + eyeWidth * 0.2;
      const highlightRadius = Math.min(radius * 0.5, highlightHeight / 2);
      
      const highlightGradient = this.ctx.createLinearGradient(
        highlightX, highlightY,
        highlightX, highlightY + highlightHeight
      );
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      this.ctx.fillStyle = highlightGradient;
      // Highlight uses circle, suitable for all shapes
      this.ctx.beginPath();
      this.ctx.arc(highlightX + highlightWidth / 2, highlightY + highlightHeight / 2, Math.min(highlightWidth, highlightHeight) / 2, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Add inner shadow effect (enhance 3D feel)
    if (eyeHeight > 8 && !this.isClosed && blinkScale > 0.3) {
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(eyeX + radius, eyeY);
      this.ctx.lineTo(eyeX + eyeWidth - radius, eyeY);
      this.ctx.quadraticCurveTo(eyeX + eyeWidth, eyeY, eyeX + eyeWidth, eyeY + radius);
      this.ctx.stroke();
    }

    // Restore context state
    this.ctx.restore();
  }

  // Helper method: convert hex color to RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  }

  drawEyeShape(shape, x, y, width, height, radius) {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    
    this.ctx.beginPath();
    
    switch (shape) {
      case EyeShapes.CIRCLE:
        const circleRadius = Math.min(width, height) / 2;
        this.ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
        break;
        
      case EyeShapes.HEART:
        this.drawHeartShape(centerX, centerY, width, height);
        break;
        
      case EyeShapes.STAR:
        this.drawStarShape(centerX, centerY, Math.min(width, height) / 2, 5);
        break;
        
      case EyeShapes.DIAMOND:
        this.drawDiamondShape(centerX, centerY, width, height);
        break;
        
      case EyeShapes.SQUARE:
        this.ctx.rect(x, y, width, height);
        break;
        
      case EyeShapes.RECTANGLE:
        this.ctx.rect(x, y, width, height);
        break;
        
      case EyeShapes.ELLIPSE:
      default:
        this.drawRoundedRect(x, y, width, height, radius);
        return; // Already filled, return directly
    }
    
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawHeartShape(centerX, centerY, width, height) {
    const size = Math.min(width, height) / 2;
    this.ctx.moveTo(centerX, centerY + size * 0.3);
    this.ctx.bezierCurveTo(centerX, centerY, centerX - size, centerY, centerX - size, centerY + size * 0.5);
    this.ctx.bezierCurveTo(centerX - size, centerY + size * 1.2, centerX, centerY + size * 1.6, centerX, centerY + size * 2);
    this.ctx.bezierCurveTo(centerX, centerY + size * 1.6, centerX + size, centerY + size * 1.2, centerX + size, centerY + size * 0.5);
    this.ctx.bezierCurveTo(centerX + size, centerY, centerX, centerY, centerX, centerY + size * 0.3);
  }

  drawStarShape(centerX, centerY, radius, points) {
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? radius : radius / 2;
      const angle = (i * Math.PI / points) - Math.PI / 2;
      const px = centerX + Math.cos(angle) * r;
      const py = centerY + Math.sin(angle) * r;
      if (i === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
  }

  drawDiamondShape(centerX, centerY, width, height) {
    this.ctx.moveTo(centerX, centerY - height / 2);
    this.ctx.lineTo(centerX + width / 2, centerY);
    this.ctx.lineTo(centerX, centerY + height / 2);
    this.ctx.lineTo(centerX - width / 2, centerY);
  }

  drawRoundedRect(x, y, width, height, radius) {
    if (width < 0) width = 0;
    if (height < 0) height = 0;
    if (radius > width / 2) radius = width / 2;
    if (radius > height / 2) radius = height / 2;

    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
    this.ctx.fill();
  }
}

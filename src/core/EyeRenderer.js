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
    this.animLaughY = 0;
    this.animConfusedX = 0;
    this.animFlicker = 0;
    this.curiosityEnabled = true; // 原版的 setCuriosity 功能

    // Mood 定义：通过眼睛形状（高度、宽度、圆角、倾斜角度、位置偏移）来体现情绪
    // 原版 RoboEyes 没有瞳孔，只有眼睛形状本身
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
        eyeScaleY: 0.65,      // 更扁（从0.75降到0.65）
        eyeScaleX: 1.25,      // 更宽（从1.1增到1.25）
        borderRadiusScale: 1.4, // 更圆（从1.2增到1.4）
        rotation: 0,
        verticalOffset: -2,   // 稍微上移，显得更开心
        brightness: 1.1       // 更亮
      },
      TIRED: { 
        eyeScaleY: 0.4,       // 很扁（从0.5降到0.4）
        eyeScaleX: 1.0, 
        borderRadiusScale: 0.7, // 更不圆（从0.8降到0.7）
        rotation: 0,
        verticalOffset: 1,    // 稍微下移，显得疲惫
        brightness: 0.7       // 更暗
      },
      ANGRY: { 
        eyeScaleY: 0.85,      // 稍微变窄
        eyeScaleX: 0.85,      // 更窄（从0.9降到0.85）
        borderRadiusScale: 0.5, // 更尖锐（从0.6降到0.5）
        rotation: -3,        // 内眼角向下倾斜，显得愤怒
        verticalOffset: 0,
        brightness: 0.9
      },
      SUSPICIOUS: { 
        eyeScaleY: 0.8,       // 稍微变扁
        eyeScaleX: 1.0, 
        borderRadiusScale: 0.85, // 稍微不圆
        rotation: 2,         // 稍微倾斜
        verticalOffset: -1,
        brightness: 0.95
      },
      SERIOUS: { 
        eyeScaleY: 0.9,       // 稍微变扁
        eyeScaleX: 0.95,      // 稍微变窄
        borderRadiusScale: 0.85, // 稍微不圆
        rotation: 0,
        verticalOffset: 0,
        brightness: 0.9
      },
      IRRITATED: { 
        eyeScaleY: 0.7,       // 更扁（从0.8降到0.7）
        eyeScaleX: 0.9,       // 更窄（从0.95降到0.9）
        borderRadiusScale: 0.6, // 更不圆（从0.7降到0.6）
        rotation: -2,        // 稍微倾斜
        verticalOffset: 0,
        brightness: 0.85
      },
      SAD: { 
        eyeScaleY: 0.6,       // 更扁（从0.7降到0.6）
        eyeScaleX: 1.0, 
        borderRadiusScale: 1.2, // 更圆（从1.1增到1.2）
        rotation: 3,         // 外眼角向下倾斜，显得悲伤
        verticalOffset: 1,    // 稍微下移
        brightness: 0.75      // 更暗
      },
      HAPPYBLUSH: { 
        eyeScaleY: 0.55,      // 很扁（从0.7降到0.55）
        eyeScaleX: 1.3,       // 很宽（从1.15增到1.3）
        borderRadiusScale: 1.5, // 很圆（从1.3增到1.5）
        rotation: 0,
        verticalOffset: -3,   // 明显上移
        brightness: 1.15      // 更亮
      }
    };
    
    // 眼睛位置偏移（原版通过移动整个眼睛位置来"看"不同方向）
    // 偏移量相对于画布大小，让移动更明显
    // 水平方向最大偏移约画布宽度的 12-15%，垂直方向约画布高度的 10-12%
    this.maxOffsetX = this.width * 0.12;  // 约 38 像素（320 * 0.12）
    this.maxOffsetY = this.height * 0.11; // 约 20 像素（180 * 0.11）
    
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
      this.targetPosition = this.positions[position] || this.positions.DEFAULT;
    } else {
      this.targetPosition = position;
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
  }

  close() {
    this.isClosed = true;
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

  render() {
    this.ctx.fillStyle = this.options.bgColor;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 平滑更新眼睛位置（用于"看"不同方向）
    this.currentPosition.x += (this.targetPosition.x - this.currentPosition.x) * 0.25;
    this.currentPosition.y += (this.targetPosition.y - this.currentPosition.y) * 0.25;

    // 计算两只眼睛的左边缘位置（基础位置）
    const leftEyeX = this.centerX - this.options.spaceBetween / 2 - this.options.eyeWidth;
    const rightEyeX = this.centerX + this.options.spaceBetween / 2;

    // 绘制两只眼睛（原版通过移动整个眼睛位置来"看"不同方向）
    this.drawEye(leftEyeX, this.centerY, true);
    this.drawEye(rightEyeX, this.centerY, false);
  }

  drawEye(x, y, isLeft) {
    const mood = this.moods[this.currentMood] || this.moods.DEFAULT;
    
    // 根据 mood 调整眼睛尺寸
    let eyeWidth = this.options.eyeWidth * mood.eyeScaleX;
    let eyeHeight = this.options.eyeHeight * mood.eyeScaleY;
    
    // Curiosity 模式：当眼睛移动到极左或极右时，外侧眼的高度增加
    // 原版特性：setCuriosity() 开启时，外眼高度在移动到最左/最右时增加
    if (this.curiosityEnabled) {
      const normalizedOffsetX = this.maxOffsetX > 0 ? this.currentPosition.x / this.maxOffsetX : 0; // 归一化到 -1 到 1
      if (isLeft && normalizedOffsetX < -0.5) {
        // 左眼在极左位置，增加高度（向外看时眼睛变高）
        const curiosityFactor = Math.abs(normalizedOffsetX + 0.5) * 0.6; // 最多增加 30%
        eyeHeight *= (1 + curiosityFactor);
      } else if (!isLeft && normalizedOffsetX > 0.5) {
        // 右眼在极右位置，增加高度（向外看时眼睛变高）
        const curiosityFactor = (normalizedOffsetX - 0.5) * 0.6; // 最多增加 30%
        eyeHeight *= (1 + curiosityFactor);
      }
    }
    
    // 根据 mood 调整圆角
    let baseRadius = this.options.borderRadius * mood.borderRadiusScale;
    const radius = Math.min(baseRadius, eyeWidth / 2, eyeHeight / 2);

    // 眨眼效果
    let blinkScale = 1;
    if (this.isClosed) {
      blinkScale = Math.max(0.02, 1 - this.blinkProgress);
    } else if (this.isBlinking) {
      blinkScale = Math.max(0.1, 1 - this.blinkProgress * 0.9);
    }

    eyeHeight *= blinkScale;

    // 眼睛位置偏移（用于"看"不同方向）
    // 原版通过移动整个眼睛位置来实现"看"的效果
    // 注意：看同一方向时，左右眼应该同向移动（不是相反）
    const offsetX = this.currentPosition.x + this.animConfusedX + this.animFlicker;
    const offsetY = this.currentPosition.y + this.animLaughY + (mood.verticalOffset || 0);
    
    // 左右眼同向移动（看同一方向）
    const drawX = x + offsetX;
    const drawY = y + offsetY;

    // 保存上下文状态
    this.ctx.save();
    
    // 应用旋转（如果有）
    if (mood.rotation) {
      this.ctx.translate(drawX + eyeWidth / 2, drawY);
      this.ctx.rotate((mood.rotation * Math.PI) / 180);
      this.ctx.translate(-(drawX + eyeWidth / 2), -drawY);
    }

    // 计算基础颜色和亮度
    const baseColor = this.options.eyeColor;
    const brightness = mood.brightness || 1.0;
    
    // 将颜色转换为 RGB 并应用亮度
    const rgb = this.hexToRgb(baseColor);
    const adjustedR = Math.min(255, Math.round(rgb.r * brightness));
    const adjustedG = Math.min(255, Math.round(rgb.g * brightness));
    const adjustedB = Math.min(255, Math.round(rgb.b * brightness));
    const adjustedColor = `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`;

    // 绘制眼睛主体（带渐变效果）
    const eyeX = drawX;
    const eyeY = drawY - eyeHeight / 2;
    
    // 创建渐变（从上到下，稍微变暗）
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
    this.drawRoundedRect(eyeX, eyeY, eyeWidth, eyeHeight, radius);

    // 添加高光效果（眼睛上半部分的亮光）
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
      this.drawRoundedRect(highlightX, highlightY, highlightWidth, highlightHeight, highlightRadius);
    }

    // 添加内阴影效果（增强立体感）
    if (eyeHeight > 8 && !this.isClosed && blinkScale > 0.3) {
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(eyeX + radius, eyeY);
      this.ctx.lineTo(eyeX + eyeWidth - radius, eyeY);
      this.ctx.quadraticCurveTo(eyeX + eyeWidth, eyeY, eyeX + eyeWidth, eyeY + radius);
      this.ctx.stroke();
    }

    // 恢复上下文状态
    this.ctx.restore();
  }

  // 辅助方法：将十六进制颜色转换为 RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
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

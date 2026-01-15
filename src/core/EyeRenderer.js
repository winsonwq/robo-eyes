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

    // Mood 定义：通过眼睛形状（高度、宽度、圆角）来体现情绪
    // 原版 RoboEyes 没有瞳孔，只有眼睛形状本身
    this.moods = {
      DEFAULT: { eyeScaleY: 1.0, eyeScaleX: 1.0, borderRadiusScale: 1.0 },
      HAPPY: { eyeScaleY: 0.75, eyeScaleX: 1.1, borderRadiusScale: 1.2 },      // 更扁、更宽、更圆
      TIRED: { eyeScaleY: 0.5, eyeScaleX: 1.0, borderRadiusScale: 0.8 },      // 很扁，半闭状态
      ANGRY: { eyeScaleY: 0.9, eyeScaleX: 0.9, borderRadiusScale: 0.6 },      // 更窄、更尖锐
      SUSPICIOUS: { eyeScaleY: 0.85, eyeScaleX: 1.0, borderRadiusScale: 0.9 },
      SERIOUS: { eyeScaleY: 0.95, eyeScaleX: 1.0, borderRadiusScale: 0.9 },
      IRRITATED: { eyeScaleY: 0.8, eyeScaleX: 0.95, borderRadiusScale: 0.7 },
      SAD: { eyeScaleY: 0.7, eyeScaleX: 1.0, borderRadiusScale: 1.1 },       // 更扁、更圆
      HAPPYBLUSH: { eyeScaleY: 0.7, eyeScaleX: 1.15, borderRadiusScale: 1.3 }  // 很扁、很宽、很圆
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
    const offsetY = this.currentPosition.y + this.animLaughY;
    
    // 左右眼同向移动（看同一方向）
    const drawX = x + offsetX;
    const drawY = y + offsetY;

    // 绘制眼睛（原版只有眼睛形状，没有瞳孔）
    this.ctx.fillStyle = this.options.eyeColor;
    this.drawRoundedRect(drawX, drawY - eyeHeight / 2, eyeWidth, eyeHeight, radius);
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

/**
 * Mood 系统 - 将 mood 定义为多个维度的组合
 * 每个 mood 由以下维度组成：
 * - 眼睛形状（shape）
 * - 左右眼大小（leftEye, rightEye）
 * - 颜色（color）
 * - 动画（animation）
 * - 背景效果（background）
 * - 位置偏移（position）
 */

export const EyeShapes = {
  CIRCLE: 'circle',      // 圆形
  ELLIPSE: 'ellipse',    // 椭圆
  HEART: 'heart',        // 爱心
  STAR: 'star',          // 星形
  DIAMOND: 'diamond',    // 菱形
  SQUARE: 'square',      // 方形
  RECTANGLE: 'rectangle' // 矩形
};

export const MoodDefinitions = {
  DEFAULT: {
    shape: EyeShapes.ELLIPSE,
    leftEye: { scaleX: 1.0, scaleY: 1.0 },
    rightEye: { scaleX: 1.0, scaleY: 1.0 },
    borderRadius: 1.0,
    rotation: 0,
    position: { x: 0, y: 0 },
    color: { brightness: 1.0 },
    animation: null,
    background: {
      gradient: ['#0a0a0a', '#0a0a0a'],
      overlay: null,
      glow: null,
      borderGlow: null
    }
  },
  
  HAPPY: {
    shape: EyeShapes.HEART,  // 开心时变成爱心形状！
    leftEye: { scaleX: 1.2, scaleY: 1.2 },
    rightEye: { scaleX: 1.2, scaleY: 1.2 },
    borderRadius: 1.5,
    rotation: 0,
    position: { x: 0, y: -2 },
    color: { brightness: 1.2 },
    animation: { type: 'gentle', intensity: 0.3 },
    background: {
      gradient: ['#2a4a2a', '#0f2a0f'],
      overlay: { type: 'colorShift', color: '255, 255, 100', strength: 0.4 },
      glow: { color: '255, 255, 100', intensity: 0.8, pattern: 'radial' },
      borderGlow: { color: '255, 255, 100', intensity: 0.6 }
    }
  },
  
  TIRED: {
    shape: EyeShapes.ELLIPSE,
    leftEye: { scaleX: 0.9, scaleY: 0.4 },
    rightEye: { scaleX: 0.9, scaleY: 0.4 },
    borderRadius: 0.7,
    rotation: 0,
    position: { x: 0, y: 1 },
    color: { brightness: 0.7 },
    animation: null,
    background: {
      gradient: ['#1a1a2a', '#0a0a15'],
      overlay: { type: 'colorShift', color: '100, 100, 180', strength: 0.6 },
      glow: { color: '100, 100, 180', intensity: 0.3, pattern: 'static' },
      borderGlow: null
    }
  },
  
  ANGRY: {
    shape: EyeShapes.DIAMOND,  // 愤怒时变成菱形，更尖锐
    leftEye: { scaleX: 0.85, scaleY: 0.85 },
    rightEye: { scaleX: 0.85, scaleY: 0.85 },
    borderRadius: 0.3,
    rotation: -3,
    position: { x: 0, y: 0 },
    color: { brightness: 0.9 },
    animation: { type: 'pulse', intensity: 0.5 },
    background: {
      gradient: ['#4a0a0a', '#2a0505'],
      overlay: { type: 'colorShift', color: '255, 50, 50', strength: 0.7 },
      glow: { color: '255, 50, 50', intensity: 1.2, pattern: 'pulse' },
      borderGlow: { color: '255, 50, 50', intensity: 1.0 },
      scanline: { color: '255, 50, 50', intensity: 0.6 },
      ripple: { color: '255, 50, 50', intensity: 0.5 }
    }
  },
  
  SURPRISED: {
    shape: EyeShapes.CIRCLE,  // 惊讶时变成圆形
    leftEye: { scaleX: 1.1, scaleY: 1.2 },
    rightEye: { scaleX: 1.1, scaleY: 1.2 },
    borderRadius: 1.3,
    rotation: 0,
    position: { x: 0, y: -2 },
    color: { brightness: 1.1 },
    animation: { type: 'pulse', intensity: 0.4 },
    background: {
      gradient: ['#2a3a4a', '#1a2a3a'],
      overlay: { type: 'colorShift', color: '150, 200, 255', strength: 0.5 },
      glow: { color: '150, 200, 255', intensity: 0.8, pattern: 'pulse' },
      borderGlow: { color: '150, 200, 255', intensity: 0.6 },
      ripple: { color: '150, 200, 255', intensity: 0.3 }
    }
  },
  
  EXCITED: {
    shape: EyeShapes.STAR,  // 兴奋时变成星形！
    leftEye: { scaleX: 1.2, scaleY: 1.1 },
    rightEye: { scaleX: 1.2, scaleY: 1.1 },
    borderRadius: 1.4,
    rotation: 0,
    position: { x: 0, y: -2 },
    color: { brightness: 1.2 },
    animation: { type: 'gentle', intensity: 0.5 },
    background: {
      gradient: ['#3a4a2a', '#2a3a1a'],
      overlay: { type: 'colorShift', color: '255, 255, 100', strength: 0.5 },
      glow: { color: '255, 255, 100', intensity: 1.0, pattern: 'pulse' },
      borderGlow: { color: '255, 255, 100', intensity: 0.8 },
      ripple: { color: '255, 255, 100', intensity: 0.4 }
    }
  },
  
  FOCUSED: {
    shape: EyeShapes.ELLIPSE,
    leftEye: { scaleX: 0.9, scaleY: 0.85 },
    rightEye: { scaleX: 0.9, scaleY: 0.85 },
    borderRadius: 0.9,
    rotation: 0,
    position: { x: 0, y: 0 },
    color: { brightness: 1.0 },
    animation: null,
    background: {
      gradient: ['#1a2a3a', '#0a1a2a'],
      overlay: { type: 'colorShift', color: '100, 200, 255', strength: 0.4 },
      glow: { color: '100, 200, 255', intensity: 0.6, pattern: 'stable' },
      borderGlow: { color: '100, 200, 255', intensity: 0.4 }
    }
  },
  
  EFFORT: {
    shape: EyeShapes.RECTANGLE,  // 使劲时变成矩形，更硬朗
    leftEye: { scaleX: 0.85, scaleY: 0.5 },
    rightEye: { scaleX: 0.85, scaleY: 0.5 },
    borderRadius: 0.3,
    rotation: -1,
    position: { x: 0, y: 1 },
    color: { brightness: 0.95 },
    animation: { type: 'pulse', intensity: 0.3 },
    background: {
      gradient: ['#3a2a1a', '#2a1a0a'],
      overlay: { type: 'colorShift', color: '255, 200, 100', strength: 0.5 },
      glow: { color: '255, 200, 100', intensity: 0.7, pattern: 'pulse' },
      borderGlow: { color: '255, 200, 100', intensity: 0.5 }
    }
  },
  
  SAD: {
    shape: EyeShapes.ELLIPSE,
    leftEye: { scaleX: 1.0, scaleY: 0.6 },
    rightEye: { scaleX: 1.0, scaleY: 0.6 },
    borderRadius: 1.2,
    rotation: 3,
    position: { x: 0, y: 1 },
    color: { brightness: 0.75 },
    animation: null,
    background: {
      gradient: ['#1a1a3a', '#0a0a1a'],
      overlay: { type: 'colorShift', color: '80, 120, 255', strength: 0.7 },
      glow: { color: '80, 120, 255', intensity: 0.4, pattern: 'fade' },
      ripple: { color: '80, 120, 255', intensity: 0.2 }
    }
  },
  
  SERIOUS: {
    shape: EyeShapes.ELLIPSE,
    leftEye: { scaleX: 0.95, scaleY: 0.9 },
    rightEye: { scaleX: 0.95, scaleY: 0.9 },
    borderRadius: 0.85,
    rotation: 0,
    position: { x: 0, y: 0 },
    color: { brightness: 0.9 },
    animation: null,
    background: {
      gradient: ['#1a1a3a', '#0a0a1a'],
      overlay: { type: 'colorShift', color: '100, 150, 255', strength: 0.5 },
      glow: { color: '100, 150, 255', intensity: 0.5, pattern: 'stable' },
      borderGlow: { color: '100, 150, 255', intensity: 0.3 }
    }
  },
  
  DETERMINED: {
    shape: EyeShapes.DIAMOND,  // 坚定时用菱形
    leftEye: { scaleX: 0.9, scaleY: 0.8 },
    rightEye: { scaleX: 0.9, scaleY: 0.8 },
    borderRadius: 0.5,
    rotation: 0,
    position: { x: 0, y: 0 },
    color: { brightness: 1.05 },
    animation: null,
    background: {
      gradient: ['#2a2a3a', '#1a1a2a'],
      overlay: { type: 'colorShift', color: '200, 150, 255', strength: 0.4 },
      glow: { color: '200, 150, 255', intensity: 0.7, pattern: 'stable' },
      borderGlow: { color: '200, 150, 255', intensity: 0.5 }
    }
  },
  
  SUSPICIOUS: {
    shape: EyeShapes.ELLIPSE,
    leftEye: { scaleX: 1.0, scaleY: 0.8 },
    rightEye: { scaleX: 1.0, scaleY: 0.8 },
    borderRadius: 0.85,
    rotation: 2,
    position: { x: 0, y: -1 },
    color: { brightness: 0.95 },
    animation: { type: 'flicker', intensity: 0.2 },
    background: {
      gradient: ['#3a3a1a', '#1a1a0a'],
      overlay: { type: 'colorShift', color: '255, 255, 150', strength: 0.5 },
      glow: { color: '255, 255, 150', intensity: 0.6, pattern: 'flicker' },
      borderGlow: { color: '255, 255, 150', intensity: 0.5, flicker: true },
      scanline: { color: '255, 255, 150', intensity: 0.5 }
    }
  },
  
  IRRITATED: {
    shape: EyeShapes.ELLIPSE,
    leftEye: { scaleX: 0.9, scaleY: 0.7 },
    rightEye: { scaleX: 0.9, scaleY: 0.7 },
    borderRadius: 0.6,
    rotation: -2,
    position: { x: 0, y: 0 },
    color: { brightness: 0.85 },
    animation: { type: 'irregular', intensity: 0.3 },
    background: {
      gradient: ['#4a2a0a', '#2a1505'],
      overlay: { type: 'colorShift', color: '255, 180, 80', strength: 0.6 },
      glow: { color: '255, 180, 80', intensity: 0.8, pattern: 'irregular' },
      borderGlow: { color: '255, 180, 80', intensity: 0.6 },
      ripple: { color: '255, 180, 80', intensity: 0.3 }
    }
  },
  
  HAPPYBLUSH: {
    shape: EyeShapes.HEART,  // 害羞时也是爱心
    leftEye: { scaleX: 1.3, scaleY: 0.55 },
    rightEye: { scaleX: 1.3, scaleY: 0.55 },
    borderRadius: 1.5,
    rotation: 0,
    position: { x: 0, y: -3 },
    color: { brightness: 1.15 },
    animation: { type: 'gentle', intensity: 0.4 },
    background: {
      gradient: ['#4a2a2a', '#2a1a1a'],
      overlay: { type: 'colorShift', color: '255, 120, 180', strength: 0.6 },
      glow: { color: '255, 120, 180', intensity: 0.9, pattern: 'romantic' },
      borderGlow: { color: '255, 120, 180', intensity: 0.7 },
      ripple: { color: '255, 120, 180', intensity: 0.4 }
    }
  }
};

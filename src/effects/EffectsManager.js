export class EffectsManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.particles = [];
    this.overlayEffects = [];
    this.time = 0;
  }

  update(deltaTime) {
    this.time += deltaTime;
    this.updateParticles(deltaTime);
    this.updateOverlayEffects(deltaTime);
  }

  updateParticles(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.life -= deltaTime;
      
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      particle.vy += particle.gravity * deltaTime;
      particle.opacity = particle.life / particle.maxLife;
      
      if (particle.bounce && particle.y > this.height - particle.size) {
        particle.y = this.height - particle.size;
        particle.vy *= -particle.bounce;
      }
    }
  }

  updateOverlayEffects(deltaTime) {
    for (let i = this.overlayEffects.length - 1; i >= 0; i--) {
      const effect = this.overlayEffects[i];
      effect.life -= deltaTime;
      
      if (effect.life <= 0) {
        this.overlayEffects.splice(i, 1);
      }
    }
  }

  render() {
    this.renderParticles();
    this.renderOverlayEffects();
  }

  renderParticles() {
    for (const particle of this.particles) {
      this.ctx.save();
      
      // Enhance particle brightness and glow
      const glowIntensity = particle.glow || 0;
      this.ctx.shadowColor = `rgb(${particle.color})`;
      this.ctx.shadowBlur = glowIntensity * particle.opacity;
      
      // Use higher opacity
      this.ctx.globalAlpha = Math.min(1, particle.opacity * 1.2);
      
      // Set color based on particle type
      if (particle.type === 'star') {
        // Stars use brighter color
        this.ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`;
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${particle.opacity * 0.8})`;
        this.ctx.lineWidth = 1;
        this.drawStar(particle.x, particle.y, particle.size, particle.points || 5);
        this.ctx.stroke();
      } else if (particle.type === 'heart') {
        this.ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`;
        this.drawHeart(particle.x, particle.y, particle.size);
      } else {
        // Circular particle
        this.ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add inner highlight
        if (particle.size > 2) {
          this.ctx.globalAlpha = particle.opacity * 0.5;
          this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.6})`;
          this.ctx.beginPath();
          this.ctx.arc(particle.x - particle.size * 0.3, particle.y - particle.size * 0.3, particle.size * 0.4, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
      
      this.ctx.restore();
    }
  }

  drawStar(x, y, size, points) {
    const ctx = this.ctx;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? size : size / 2;
      const angle = (i * Math.PI / points) - Math.PI / 2;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  drawHeart(x, y, size) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.3);
    ctx.bezierCurveTo(x, y, x - size, y, x - size, y + size * 0.5);
    ctx.bezierCurveTo(x - size, y + size * 1.2, x, y + size * 1.6, x, y + size * 2);
    ctx.bezierCurveTo(x, y + size * 1.6, x + size, y + size * 1.2, x + size, y + size * 0.5);
    ctx.bezierCurveTo(x + size, y, x, y, x, y + size * 0.3);
    ctx.fill();
  }

  renderOverlayEffects() {
    for (const effect of this.overlayEffects) {
      if (effect.type === 'glow') {
        this.renderGlowEffect(effect);
      } else if (effect.type === 'blur') {
        this.renderBlurEffect(effect);
      } else if (effect.type === 'colorShift') {
        this.renderColorShiftEffect(effect);
      } else if (effect.type === 'ripple') {
        this.renderRippleEffect(effect);
      }
    }
  }

  renderGlowEffect(effect) {
    const gradient = this.ctx.createRadialGradient(
      effect.x, effect.y, 0,
      effect.x, effect.y, effect.radius
    );
    gradient.addColorStop(0, `rgba(${effect.color}, ${effect.strength * (effect.life / effect.maxLife)})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  renderBlurEffect(effect) {
    this.ctx.filter = `blur(${effect.amount * (effect.life / effect.maxLife)}px)`;
    this.ctx.fillStyle = effect.color || 'transparent';
    this.ctx.fillRect(effect.x - effect.radius, effect.y - effect.radius, effect.radius * 2, effect.radius * 2);
    this.ctx.filter = 'none';
  }

  renderColorShiftEffect(effect) {
    // Enhance overlay effect, use blending mode
    const alpha = effect.strength * 0.6 * (effect.life / effect.maxLife);
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'screen';
    this.ctx.fillStyle = `rgba(${effect.color}, ${alpha})`;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();
  }

  renderRippleEffect(effect) {
    const alpha = effect.strength * (effect.life / effect.maxLife);
    const radius = effect.radius * (1 - effect.life / effect.maxLife);
    
    this.ctx.save();
    this.ctx.strokeStyle = `rgba(${effect.color}, ${alpha})`;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.restore();
  }

  addParticle(options) {
    const particle = {
      x: options.x || this.width / 2,
      y: options.y || this.height / 2,
      vx: options.vx || (Math.random() - 0.5) * 100,
      vy: options.vy || (Math.random() - 0.5) * 100 - 50,
      size: options.size || 5,
      color: options.color || '255, 255, 255',
      life: options.life || 1,
      maxLife: options.life || 1,
      opacity: 1,
      gravity: options.gravity || 0,
      bounce: options.bounce || 0,
      type: options.type || 'circle',
      glow: options.glow || 0,
      points: options.points || 5,
      ...options
    };
    this.particles.push(particle);
    return particle;
  }

  addParticleBurst(x, y, options = {}) {
    const count = options.count || 20;
    const spread = options.spread || 360;
    const speed = options.speed || 150;
    
    for (let i = 0; i < count; i++) {
      const angle = (spread / count) * i * (Math.PI / 180);
      this.addParticle({
        x,
        y,
        vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.4),
        vy: Math.sin(angle) * speed * (0.8 + Math.random() * 0.4),
        color: options.color || '255, 200, 100',
        size: options.size || (3 + Math.random() * 4),
        life: options.life || (0.5 + Math.random() * 0.5),
        gravity: options.gravity || 200,
        bounce: options.bounce || 0.5,
        type: options.type || 'circle',
        ...options
      });
    }
  }

  addOverlayEffect(options) {
    const effect = {
      type: options.type || 'glow',
      x: options.x || this.width / 2,
      y: options.y || this.height / 2,
      radius: options.radius || 100,
      color: options.color || '255, 255, 255',
      strength: options.strength || 0.5,
      life: options.life || 1,
      maxLife: options.life || 1,
      ...options
    };
    this.overlayEffects.push(effect);
    return effect;
  }

  clearParticles() {
    this.particles = [];
  }

  clearOverlayEffects() {
    this.overlayEffects = [];
  }
}

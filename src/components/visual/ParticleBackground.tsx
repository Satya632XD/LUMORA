import React, { useEffect, useRef } from 'react';
import { ThemeId, AnimationLevel } from '../../types/sudoku';

interface ParticleBackgroundProps {
  theme: ThemeId;
  animationLevel: AnimationLevel;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  angle: number;
  angularSpeed: number;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ theme, animationLevel }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (animationLevel === 'off') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle settings depending on theme
    const particleCount = animationLevel === 'full' ? 45 : animationLevel === 'medium' ? 25 : 12;
    const particles: Particle[] = [];

    const getThemeColors = (): string[] => {
      switch (theme) {
        case 'aurora':
          return ['#2dd4bf', '#38bdf8', '#818cf8', '#a7f3d0'];
        case 'crystal':
          return ['#67e8f9', '#c084fc', '#f0abfc', '#e0f2fe'];
        case 'midnight':
          return ['#818cf8', '#a5b4fc', '#c7d2fe', '#6366f1'];
        case 'zen':
          return ['#86efac', '#ca8a04', '#fde047', '#fbcfe8']; // sage, bamboo, sakura
        case 'royal':
          return ['#fbbf24', '#f59e0b', '#fde68a', '#f43f5e'];
        default:
          return ['#2dd4bf', '#38bdf8'];
      }
    };

    const colors = getThemeColors();

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * (theme === 'zen' ? 6 : 3.5) + 1.2,
        speedX: (Math.random() - 0.5) * (theme === 'zen' ? 0.8 : 0.4),
        speedY: theme === 'zen' ? Math.random() * 0.7 + 0.3 : (Math.random() - 0.5) * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    let wavePhase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Aurora undulating light ribbons
      if (theme === 'aurora') {
        wavePhase += 0.008;
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, 'rgba(45, 212, 191, 0.07)');
        grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.05)');
        grad.addColorStop(1, 'rgba(129, 140, 248, 0.08)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.4 + Math.sin(wavePhase) * 60);
        ctx.bezierCurveTo(
          width * 0.33,
          height * 0.3 + Math.cos(wavePhase * 0.8) * 80,
          width * 0.66,
          height * 0.5 + Math.sin(wavePhase * 1.2) * 70,
          width,
          height * 0.35 + Math.cos(wavePhase) * 60
        );
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
      }

      // Render Particles
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.angle += p.angularSpeed;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (theme === 'zen') {
          // Render floating sakura/bamboo leaf shape
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.8, p.size * 0.9, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (theme === 'crystal') {
          // Render diamond/shard
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 1.5);
          ctx.lineTo(p.size, 0);
          ctx.lineTo(0, p.size * 1.5);
          ctx.lineTo(-p.size, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          // Soft circular glow star/ember
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, animationLevel]);

  // Dynamic CSS Background Gradients
  const getThemeBackground = () => {
    switch (theme) {
      case 'aurora':
        return 'bg-gradient-to-br from-[#06131f] via-[#0b2238] to-[#040f1a]';
      case 'crystal':
        return 'bg-gradient-to-br from-[#070e1e] via-[#111936] to-[#0d0f1a]';
      case 'midnight':
        return 'bg-gradient-to-br from-[#04060c] via-[#090d1f] to-[#030408]';
      case 'zen':
        return 'bg-gradient-to-br from-[#0f1410] via-[#1a231b] to-[#0a0f0a]';
      case 'royal':
        return 'bg-gradient-to-br from-[#0e0717] via-[#1b0d2d] to-[#09040f]';
      default:
        return 'bg-[#06131f]';
    }
  };

  return (
    <div className={`fixed inset-0 pointer-events-none transition-colors duration-1000 ${getThemeBackground()} z-0`}>
      {animationLevel !== 'off' && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      )}
      {/* Subtle vignette layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
    </div>
  );
};

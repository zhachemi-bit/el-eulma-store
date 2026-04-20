import { useEffect, useRef } from 'react';

interface FireCanvasProps {
  opacity?: number;
  active?: boolean;
  transparent?: boolean;
}

export function FireCanvas({ opacity = 1, active = true, transparent = true }: FireCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d', { alpha: transparent });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: FlameParticle[] = [];

    const handleResize = () => {
      const parent = c.parentElement;
      if (parent) {
        c.width = parent.clientWidth;
        c.height = parent.clientHeight;
      } else {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
      }
    };

    class FlameParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      type: 'flame' | 'ember' | 'smoke';

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = canvasHeight + Math.random() * 20;
        
        const rand = Math.random();
        if (rand > 0.90) {
          this.type = 'ember';
        } else if (rand > 0.3) {
          this.type = 'flame';
        } else {
          this.type = 'smoke';
        }
        
        if (this.type === 'ember') {
          this.vx = (Math.random() - 0.5) * 6;
          this.vy = -Math.random() * 8 - 4;
          this.life = Math.random() * 60 + 50;
          this.size = Math.random() * 2 + 1;
        } else if (this.type === 'flame') {
          this.vx = (Math.random() - 0.5) * 2; 
          this.vy = -Math.random() * 5 - 2;
          this.life = Math.random() * 40 + 30;
          this.size = Math.random() * 30 + 10;
        } else {
          this.vx = (Math.random() - 0.5) * 3;
          this.vy = -Math.random() * 3 - 1;
          this.life = Math.random() * 50 + 40;
          this.size = Math.random() * 40 + 20; 
        }
        this.maxLife = this.life;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        if (this.type === 'flame') {
          this.size *= 0.96;
          this.vx += (Math.random() - 0.5) * 1.5;
        } else if (this.type === 'ember') {
          this.vx += (Math.random() - 0.5) * 0.5;
        } else if (this.type === 'smoke') {
          this.size *= 1.01;
          this.vx += (Math.random() - 0.5) * 0.5;
        }
      }

      draw() {
        if (!ctx) return;
        const ratio = this.life / this.maxLife;
        let color = '';

        if (this.type === 'ember') {
          color = `rgba(255, ${Math.floor(ratio * 255)}, 0, ${ratio})`;
        } else if (this.type === 'smoke') {
          color = `rgba(50, 0, 0, ${ratio * 0.3})`;
        } else {
          if (ratio > 0.8) color = `rgba(255, 255, 100, ${ratio * 0.7})`;
          else if (ratio > 0.5) color = `rgba(255, 150, 0, ${ratio * 0.6})`;
          else color = `rgba(255, 0, 0, ${ratio * 0.4})`;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    function init() {
      if (!ctx || !c) return;
      handleResize();
      animate();
    }

    function animate() {
      if (!ctx || !c) return;
      animationFrameId = requestAnimationFrame(animate);

      if (transparent) {
        ctx.clearRect(0, 0, c.width, c.height);
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = "rgba(10, 0, 0, 0.4)"; 
        ctx.fillRect(0, 0, c.width, c.height);
      }

      ctx.globalCompositeOperation = 'lighter';

      const spawnsPerFrame = Math.max(1, Math.floor(c.width / 80)); 
      for (let i = 0; i < spawnsPerFrame; i++) {
        particles.push(new FlameParticle(c.width, c.height));
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].life <= 0) {
          particles.splice(i, 1);
        }
      }
    }

    init();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, transparent]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 block pointer-events-none"
      style={{ opacity }}
    />
  );
}

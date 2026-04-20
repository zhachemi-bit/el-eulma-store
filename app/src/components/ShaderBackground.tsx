import { useEffect, useRef } from 'react';

// const COLOR_ARRAY = ['#233656', '#415B76', '#7B9BA6', '#CDD6D5', '#EEF4F2'];
const COLOR_ARRAY = ['#1f6f5f', '#2fa084', '#6fcf97', '#c2f1b4ff', '#9aebd0ff'];

const MAX_RADIUS = 40;
const CIRCLE_COUNT = 800;

interface ShaderBackgroundProps {
  className?: string;
  /** Overlay opacity (0-1) to darken for text readability */
  overlayOpacity?: number;
}

export function ShaderBackground({
  className = '',
  overlayOpacity = 0.35,
}: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mouse = { x: -1000, y: -1000 };

    // Size the canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };

    // Circle class
    class Circle {
      x: number;
      y: number;
      dx: number;
      dy: number;
      radius: number;
      minRadius: number;
      color: string;

      constructor(x: number, y: number, dx: number, dy: number, radius: number) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.minRadius = radius;
        this.color = COLOR_ARRAY[Math.floor(Math.random() * COLOR_ARRAY.length)];
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx!.fillStyle = this.color;
        ctx!.fill();
      }

      update() {
        if (this.x + this.radius > canvas!.width || this.x - this.radius < 0) {
          this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas!.height || this.y - this.radius < 0) {
          this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        // Mouse interactivity — grow near cursor
        if (
          mouse.x - this.x < 50 &&
          mouse.x - this.x > -50 &&
          mouse.y - this.y < 50 &&
          mouse.y - this.y > -50
        ) {
          if (this.radius < MAX_RADIUS) {
            this.radius += 1;
          }
        } else if (this.radius > this.minRadius) {
          this.radius -= 1;
        }

        this.draw();
      }
    }

    // Initialize circles
    let circles: Circle[] = [];

    const init = () => {
      circles = [];
      for (let i = 0; i < CIRCLE_COUNT; i++) {
        const radius = Math.random() * 3 + 1;
        const x = Math.random() * (canvas!.width - radius * 2) + radius;
        const y = Math.random() * (canvas!.height - radius * 2) + radius;
        const dx = Math.random() - 0.5;
        const dy = Math.random() - 0.5;
        circles.push(new Circle(x, y, dx, dy, radius));
      }
    };
    init();

    // Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      for (let i = 0; i < circles.length; i++) {
        circles[i].update();
      }
    };
    animate();

    // Resize handler — reinitialize circles
    const onResize = () => {
      resize();
      init();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        //backgroundColor: '#0a0f1a',
        backgroundColor: '#ffffffff',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
      {/* Dark overlay for text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export default ShaderBackground;

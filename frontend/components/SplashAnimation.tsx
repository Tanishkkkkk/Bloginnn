'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface SplashAnimationProps {
  onRevealStart: () => void;
  onComplete: () => void;
}

export default function SplashAnimation({ onRevealStart, onComplete }: SplashAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const [phase, setPhase] = useState<'drawing' | 'complete' | 'wiping'>('drawing');
  const [startSweep, setStartSweep] = useState(false);

  // Phase orchestration timers
  useEffect(() => {
    // 1. Start sweep line after logo starts drawing
    const tSweep = setTimeout(() => setStartSweep(true), 750);
    
    // 2. Trigger home content reveal start at 1.4s (wipe starts)
    const tReveal = setTimeout(() => {
      setPhase('wiping');
      onRevealStart();
    }, 1450);

    // 3. Fully unmount the splash animation at 2.1s
    const tComplete = setTimeout(() => {
      setPhase('complete');
      onComplete();
    }, 2150);

    return () => {
      clearTimeout(tSweep);
      clearTimeout(tReveal);
      clearTimeout(tComplete);
    };
  }, [onRevealStart, onComplete]);

  // Particle System Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }> = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Create custom particle configuration
    const colors = ['#7c3aed', '#a855f7', '#ec4899', '#3b82f6'];
    const particleCount = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 15000));
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.25 + 0.08,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Ambient radial light background fill
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 1.4
      );
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(1, '#f1f5f9');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;

      particles.forEach(p => {
        // Drift particles
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Mouse organic repulsion
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            const angle = Math.atan2(dy, dx);
            p.x += Math.cos(angle) * force * 1.8;
            p.y += Math.sin(angle) * force * 1.8;
          }
        }

        // Render particles with soft bloom filter
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0; // reset
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const logoLetters = 'bLOgINN'.split('');

  // Circular contraction-wipe clip-path
  const wipeClipPath = phase === 'wiping' 
    ? 'circle(0% at 50% 50%)' 
    : 'circle(150% at 50% 50%)';

  return (
    <AnimatePresence>
      {phase !== 'complete' && (
        <motion.div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            overflow: 'hidden',
            pointerEvents: phase === 'wiping' ? 'none' : 'auto',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            clipPath: wipeClipPath,
            WebkitClipPath: wipeClipPath,
            transition: 'clip-path 0.85s cubic-bezier(0.76, 0, 0.24, 1), -webkit-clip-path 0.85s cubic-bezier(0.76, 0, 0.24, 1)'
          }}
        >
          {/* Canvas for mouse-interactive dust particles */}
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />

          {/* Central content container */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              userSelect: 'none'
            }}
          >
            {/* Ambient Purple Backlight Aura */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0, 0.5, 0.3], scale: [0.6, 1.1, 1] }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: '320px',
                height: '320px',
                background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: -1,
              }}
            />

            {/* Custom Infinite Vector Quill Logo */}
            <div style={{ marginBottom: '1.75rem', position: 'relative' }}>
              <svg viewBox="0 0 120 120" style={{ width: 90, height: 90 }}>
                <defs>
                  <linearGradient id="vector-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Outermost Glowing Infinity loop orbit */}
                <motion.path
                  d="M 60,20 C 35,20 15,38 15,60 C 15,82 35,100 60,100 C 85,100 105,82 105,60 C 105,38 85,20 60,20 Z"
                  fill="none"
                  stroke="url(#vector-grad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.95 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  style={{ filter: 'url(#glow-filter)' }}
                />

                {/* Inner White Dynamic Creative Loop */}
                <motion.path
                  d="M 38,60 C 38,70 45,76 50,76 C 55,76 65,60 70,60 C 75,60 82,66 82,60 C 82,54 75,44 70,44 C 65,44 55,60 50,60 C 45,60 38,50 38,60 Z"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.25, duration: 1.1, ease: 'easeInOut' }}
                />
                
                {/* Central shining nib point */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="5"
                  fill="#7c3aed"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.25, 1], opacity: 1 }}
                  transition={{ delay: 0.75, duration: 0.4, ease: 'easeOut' }}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(124, 58, 237, 0.4))' }}
                />
              </svg>
            </div>

            {/* Staggered text characters with sweep highlight */}
            <div style={{ position: 'relative', overflow: 'hidden', padding: '0.2rem 1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: '3.75rem',
                  fontWeight: 900,
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.03em',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {logoLetters.map((char, i) => {
                  const isLastTwoN = i >= logoLetters.length - 2;
                  return (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 25, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{
                        delay: 0.35 + i * 0.08,
                        duration: 0.6,
                        ease: [0.215, 0.61, 0.355, 1] // cubic bezier easeOutSine-like
                      }}
                      style={isLastTwoN ? { fontStyle: 'italic', fontWeight: 900, textDecoration: 'underline', textUnderlineOffset: '6px' } : {}}
                      className="gradient-text"
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </div>

              {/* Glowing sweep flare line */}
              {startSweep && (
                <motion.div
                  initial={{ left: '-30%', opacity: 0 }}
                  animate={{ left: '130%', opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '20%',
                    background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.3), #7c3aed, rgba(236, 72, 153, 0.3), transparent)',
                    filter: 'blur(6px) drop-shadow(0 0 10px rgba(124, 58, 237, 0.3))',
                    pointerEvents: 'none',
                    zIndex: 2
                  }}
                />
              )}
            </div>

            {/* Sub-label under logo */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
              style={{
                marginTop: '0.75rem',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Ideas Unfolded
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

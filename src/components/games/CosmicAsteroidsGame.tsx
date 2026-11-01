import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Shield, Zap, Play } from 'lucide-react';
import { playSound } from '../../utils/audio.ts';

interface CosmicAsteroidsGameProps {
  onClose: () => void;
  onScoreSubmit?: (score: number) => void;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface Asteroid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  points: number;
}

export const CosmicAsteroidsGame: React.FC<CosmicAsteroidsGameProps> = ({ onClose, onScoreSubmit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'READY' | 'PLAYING' | 'GAME_OVER'>('READY');
  const [score, setScore] = useState<number>(0);
  const [shields, setShields] = useState<number>(3);
  const [wave, setWave] = useState<number>(1);
  const [highScore, setHighScore] = useState<number>(26400);

  // Ship state refs for high performance 60FPS loop
  const shipRef = useRef({
    x: 180,
    y: 260,
    angle: -Math.PI / 2,
    vx: 0,
    vy: 0,
    rotationSpeed: 0,
    isThrusting: false,
    invincibleTimer: 0
  });

  const bulletsRef = useRef<Bullet[]>([]);
  const asteroidsRef = useRef<Asteroid[]>([]);
  const keysRef = useRef<{ left: boolean; right: boolean; thrust: boolean; fire: boolean }>({
    left: false,
    right: false,
    thrust: false,
    fire: false
  });

  const fireCooldownRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const initAsteroids = useCallback((count: number, width: number, height: number) => {
    const list: Asteroid[] = [];
    for (let i = 0; i < count; i++) {
      const edge = Math.floor(Math.random() * 4);
      let x = 0;
      let y = 0;
      if (edge === 0) { x = Math.random() * width; y = 0; }
      else if (edge === 1) { x = width; y = Math.random() * height; }
      else if (edge === 2) { x = Math.random() * width; y = height; }
      else { x = 0; y = Math.random() * height; }

      const speed = 0.8 + Math.random() * 1.2;
      const angle = Math.random() * Math.PI * 2;
      list.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 24,
        points: 8
      });
    }
    asteroidsRef.current = list;
  }, []);

  const startGame = () => {
    const canvas = canvasRef.current;
    const w = canvas ? canvas.width : 360;
    const h = canvas ? canvas.height : 480;

    shipRef.current = {
      x: w / 2,
      y: h / 2,
      angle: -Math.PI / 2,
      vx: 0,
      vy: 0,
      rotationSpeed: 0,
      isThrusting: false,
      invincibleTimer: 2.0
    };
    bulletsRef.current = [];
    setScore(0);
    setShields(3);
    setWave(1);
    initAsteroids(4, w, h);
    setGameState('PLAYING');
    playSound.click();
  };

  const fireBullet = useCallback(() => {
    if (gameState !== 'PLAYING') return;
    const ship = shipRef.current;
    const speed = 7.0;
    bulletsRef.current.push({
      x: ship.x + Math.cos(ship.angle) * 16,
      y: ship.y + Math.sin(ship.angle) * 16,
      vx: ship.vx + Math.cos(ship.angle) * speed,
      vy: ship.vy + Math.sin(ship.angle) * speed,
      life: 55
    });
    playSound.laser();
  }, [gameState]);

  // Touch control callbacks
  const setControl = (key: 'left' | 'right' | 'thrust', pressed: boolean) => {
    keysRef.current[key] = pressed;
  };

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = true;
      if (e.key === 'ArrowUp' || e.key === 'w') keysRef.current.thrust = true;
      if (e.key === ' ' || e.key === 'k') {
        if (!keysRef.current.fire) {
          fireBullet();
          keysRef.current.fire = true;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = false;
      if (e.key === 'ArrowUp' || e.key === 'w') keysRef.current.thrust = false;
      if (e.key === ' ' || e.key === 'k') keysRef.current.fire = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [fireBullet]);

  // Canvas render and physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const loop = () => {
      if (!isRunning) return;

      const w = canvas.width;
      const h = canvas.height;

      // Clear Canvas
      ctx.fillStyle = '#0B0F14';
      ctx.fillRect(0, 0, w, h);

      // Starfield dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (let i = 0; i < 20; i++) {
        const sx = ((i * 37) % w);
        const sy = ((i * 47) % h);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      if (gameState === 'PLAYING') {
        const ship = shipRef.current;

        // Rotation
        if (keysRef.current.left) ship.angle -= 0.08;
        if (keysRef.current.right) ship.angle += 0.08;

        // Thrust
        if (keysRef.current.thrust) {
          ship.vx += Math.cos(ship.angle) * 0.14;
          ship.vy += Math.sin(ship.angle) * 0.14;
        }

        // Friction
        ship.vx *= 0.985;
        ship.vy *= 0.985;

        // Update position & screen wrap
        ship.x = (ship.x + ship.vx + w) % w;
        ship.y = (ship.y + ship.vy + h) % h;

        if (ship.invincibleTimer > 0) {
          ship.invincibleTimer -= 0.016;
        }

        // Update Bullets
        bulletsRef.current = bulletsRef.current.filter(b => {
          b.x = (b.x + b.vx + w) % w;
          b.y = (b.y + b.vy + h) % h;
          b.life -= 1;
          return b.life > 0;
        });

        // Draw Bullets
        ctx.fillStyle = '#00D9A6';
        ctx.shadowColor = '#00D9A6';
        ctx.shadowBlur = 8;
        bulletsRef.current.forEach(b => {
          ctx.beginPath();
          ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.shadowBlur = 0;

        // Update & Draw Asteroids
        const newAsteroids: Asteroid[] = [];
        asteroidsRef.current.forEach(ast => {
          ast.x = (ast.x + ast.vx + w) % w;
          ast.y = (ast.y + ast.vy + h) % h;

          let destroyed = false;

          // Check bullet hit
          for (let bi = bulletsRef.current.length - 1; bi >= 0; bi--) {
            const b = bulletsRef.current[bi];
            const dist = Math.hypot(b.x - ast.x, b.y - ast.y);
            if (dist < ast.radius) {
              destroyed = true;
              bulletsRef.current.splice(bi, 1);
              playSound.score();
              setScore(s => s + (ast.radius > 16 ? 50 : 100));

              // Split asteroid if large
              if (ast.radius > 14) {
                newAsteroids.push({
                  x: ast.x,
                  y: ast.y,
                  vx: -ast.vy * 1.2,
                  vy: ast.vx * 1.2,
                  radius: ast.radius / 1.6,
                  points: 6
                });
                newAsteroids.push({
                  x: ast.x,
                  y: ast.y,
                  vx: ast.vy * 1.2,
                  vy: -ast.vx * 1.2,
                  radius: ast.radius / 1.6,
                  points: 6
                });
              }
              break;
            }
          }

          // Check ship collision
          if (!destroyed && ship.invincibleTimer <= 0) {
            const shipDist = Math.hypot(ship.x - ast.x, ship.y - ast.y);
            if (shipDist < ast.radius + 10) {
              playSound.explosion();
              setShields(prev => {
                const nextShields = prev - 1;
                if (nextShields <= 0) {
                  setGameState('GAME_OVER');
                  onScoreSubmit?.(score);
                } else {
                  ship.invincibleTimer = 2.0;
                }
                return nextShields;
              });
            }
          }

          if (!destroyed) {
            newAsteroids.push(ast);
          }
        });

        asteroidsRef.current = newAsteroids;

        // If all asteroids destroyed, next wave
        if (newAsteroids.length === 0) {
          setWave(wv => wv + 1);
          initAsteroids(4 + wave, w, h);
          playSound.victory();
        }

        // Draw Asteroids
        ctx.strokeStyle = '#7C5CFF';
        ctx.fillStyle = 'rgba(124, 92, 255, 0.12)';
        ctx.lineWidth = 1.5;
        newAsteroids.forEach(ast => {
          ctx.beginPath();
          ctx.arc(ast.x, ast.y, ast.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fill();
        });

        // Draw Ship
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.angle);

        // Flash if invincible
        if (ship.invincibleTimer <= 0 || Math.floor(ship.invincibleTimer * 10) % 2 === 0) {
          ctx.strokeStyle = '#F5F7FA';
          ctx.lineWidth = 2;
          ctx.fillStyle = '#151B23';
          ctx.beginPath();
          ctx.moveTo(14, 0);
          ctx.lineTo(-10, -8);
          ctx.lineTo(-6, 0);
          ctx.lineTo(-10, 8);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Thruster Flame
          if (keysRef.current.thrust) {
            ctx.fillStyle = '#00D9A6';
            ctx.beginPath();
            ctx.moveTo(-6, 0);
            ctx.lineTo(-14, -4);
            ctx.lineTo(-18, 0);
            ctx.lineTo(-14, 4);
            ctx.closePath();
            ctx.fill();
          }
        }
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      isRunning = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState, initAsteroids, onScoreSubmit, score, wave]);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#0B0F14] text-[#F5F7FA] overflow-hidden select-none">
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-[#28313D] bg-[#151B23]/90 backdrop-blur-md z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            aria-label="Back to Arcade"
            className="w-9 h-9 rounded-xl bg-[#0B0F14] border border-[#28313D] flex items-center justify-center text-[#9AA4B2] hover:text-[#F5F7FA] active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-[#F5F7FA] leading-tight font-display">
              Galactic Shard
            </h2>
            <div className="text-[11px] text-[#9AA4B2] font-mono">Wave {wave} · Shields: {shields}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-[#9AA4B2] uppercase">Score</div>
          <div className="text-base font-bold text-[#00D9A6] font-mono tabular-nums leading-tight">{score}</div>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative flex-1 w-full bg-[#0B0F14] flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={360}
          height={420}
          className="w-full h-full max-w-sm max-h-[480px] bg-[#0B0F14]"
        />

        {/* Start Game Overlay */}
        {gameState === 'READY' && (
          <div className="absolute inset-0 bg-[#0B0F14]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40">
            <h3 className="text-2xl font-bold font-display text-[#F5F7FA] mb-2">Galactic Shard</h3>
            <p className="text-xs text-[#9AA4B2] max-w-xs mb-6">
              Rotate, thrust and fire plasma cannons to disintegrate incoming asteroid fields.
            </p>
            <button
              onClick={startGame}
              className="w-full max-w-xs h-12 rounded-xl bg-[#7C5CFF] hover:bg-[#6847ea] text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#7C5CFF]/30 active:scale-95 transition-transform"
            >
              <Play className="w-5 h-5 fill-white" />
              Launch Ship
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-[#0B0F14]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40">
            <h3 className="text-xl font-bold font-display text-[#F5F7FA] mb-1">Starship Destroyed</h3>
            <div className="text-xs text-[#9AA4B2] mb-3">All shields depleted</div>
            <div className="text-2xl font-bold text-[#00D9A6] font-mono mb-4">{score} PTS</div>
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-xl bg-[#7C5CFF] text-white font-bold text-sm shadow-lg shadow-[#7C5CFF]/30 active:scale-95"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* On-Screen Mobile Arcade Buttons */}
      <div className="shrink-0 px-4 py-3 bg-[#151B23] border-t border-[#28313D] flex items-center justify-between gap-2 z-30">
        <div className="flex gap-2">
          <button
            onPointerDown={() => setControl('left', true)}
            onPointerUp={() => setControl('left', false)}
            onPointerLeave={() => setControl('left', false)}
            className="w-12 h-12 rounded-xl bg-[#0B0F14] border border-[#28313D] active:border-[#7C5CFF] text-[#F5F7FA] font-bold text-sm flex items-center justify-center"
          >
            ↺
          </button>
          <button
            onPointerDown={() => setControl('right', true)}
            onPointerUp={() => setControl('right', false)}
            onPointerLeave={() => setControl('right', false)}
            className="w-12 h-12 rounded-xl bg-[#0B0F14] border border-[#28313D] active:border-[#7C5CFF] text-[#F5F7FA] font-bold text-sm flex items-center justify-center"
          >
            ↻
          </button>
        </div>

        <button
          onPointerDown={() => setControl('thrust', true)}
          onPointerUp={() => setControl('thrust', false)}
          onPointerLeave={() => setControl('thrust', false)}
          className="flex-1 h-12 rounded-xl bg-[#0B0F14] border border-[#28313D] active:border-[#00D9A6] active:bg-[#00D9A6]/10 text-xs font-bold text-[#00D9A6] flex items-center justify-center gap-1"
        >
          <Zap className="w-4 h-4" />
          THRUST
        </button>

        <button
          onClick={fireBullet}
          className="w-16 h-12 rounded-xl bg-[#7C5CFF] text-white font-bold text-xs flex items-center justify-center active:scale-95 shadow-md shadow-[#7C5CFF]/30"
        >
          FIRE
        </button>
      </div>
    </div>
  );
};

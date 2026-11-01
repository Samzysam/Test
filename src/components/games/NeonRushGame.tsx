import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Pause, ArrowLeft, Shield, Zap, Trophy, Users } from 'lucide-react';
import { playSound } from '../../utils/audio.ts';

interface NeonRushGameProps {
  onClose: () => void;
  onScoreSubmit?: (score: number) => void;
  isPassAndPlay?: boolean;
}

interface Obstacle {
  id: number;
  lane: number; // 0, 1, 2
  y: number; // percentage 0 to 100
  type: 'barrier' | 'orb';
}

export const NeonRushGame: React.FC<NeonRushGameProps> = ({
  onClose,
  onScoreSubmit,
  isPassAndPlay = false
}) => {
  const [gameState, setGameState] = useState<'READY' | 'PLAYING' | 'PAUSED' | 'ROUND_OVER'>('READY');
  const [lane, setLane] = useState<number>(1); // 0 = Left, 1 = Center, 2 = Right
  const [score, setScore] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [energy, setEnergy] = useState<number>(30); // 0 - 100
  const [boostActive, setBoostActive] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.2);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [highScore, setHighScore] = useState<number>(19800);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  
  // Pass & Play multi-turn support
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  const [p1Score, setP1Score] = useState<number | null>(null);
  const [p2Score, setP2Score] = useState<number | null>(null);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const nextIdRef = useRef<number>(1);

  const moveLane = useCallback((targetLane: number) => {
    if (gameState !== 'PLAYING') return;
    const clamped = Math.max(0, Math.min(2, targetLane));
    setLane(clamped);
    playSound.tab();
  }, [gameState]);

  const triggerBoost = useCallback(() => {
    if (energy >= 40 && !boostActive) {
      setBoostActive(true);
      playSound.victory();
      setTimeout(() => {
        setBoostActive(false);
      }, 4000);
    }
  }, [energy, boostActive]);

  const startGame = () => {
    setScore(0);
    setMultiplier(1);
    setEnergy(40);
    setBoostActive(false);
    setSpeed(1.2);
    setObstacles([]);
    setLane(1);
    setGameState('PLAYING');
    playSound.click();
    lastTimeRef.current = performance.now();
  };

  const handleGameOver = useCallback((finalScore: number) => {
    setGameState('ROUND_OVER');
    playSound.explosion();
    
    if (isPassAndPlay) {
      if (activePlayer === 1) {
        setP1Score(finalScore);
      } else {
        setP2Score(finalScore);
      }
    } else {
      if (finalScore > highScore) {
        setHighScore(finalScore);
      }
      onScoreSubmit?.(finalScore);
    }
  }, [activePlayer, highScore, isPassAndPlay, onScoreSubmit]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveLane(lane - 1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveLane(lane + 1);
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        triggerBoost();
      } else if (e.key === 'p' || e.key === 'Escape') {
        setGameState(prev => (prev === 'PLAYING' ? 'PAUSED' : prev === 'PAUSED' ? 'PLAYING' : prev));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lane, moveLane, triggerBoost]);

  // Main game loop
  useEffect(() => {
    if (gameState !== 'PLAYING') {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const currentSpeed = boostActive ? speed * 1.8 : speed;

    const updateLoop = (time: number) => {
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Update score & speed
      setScore(prev => {
        const added = Math.round(dt * 120 * multiplier * (boostActive ? 2 : 1));
        return prev + added;
      });

      setSpeed(prev => Math.min(prev + dt * 0.02, 3.2));

      // Energy decay if boosting
      if (boostActive) {
        setEnergy(prev => Math.max(0, prev - dt * 25));
      }

      // Spawning obstacles
      spawnTimerRef.current += dt;
      const spawnInterval = Math.max(0.65, 1.4 / currentSpeed);
      if (spawnTimerRef.current > spawnInterval) {
        spawnTimerRef.current = 0;
        const randomLane = Math.floor(Math.random() * 3);
        const isOrb = Math.random() < 0.45;
        const newObj: Obstacle = {
          id: nextIdRef.current++,
          lane: randomLane,
          y: -10,
          type: isOrb ? 'orb' : 'barrier'
        };
        setObstacles(prev => [...prev, newObj]);
      }

      // Move obstacles and check collisions
      setObstacles(prev => {
        const next: Obstacle[] = [];
        let collisionOccurred = false;

        for (const item of prev) {
          const newY = item.y + (currentSpeed * 45) * dt;

          // Check hit window (craft is at y: 82%)
          if (newY >= 75 && newY <= 90 && item.lane === lane) {
            if (item.type === 'orb') {
              // Collected energy orb
              playSound.score();
              setEnergy(e => Math.min(100, e + 15));
              setMultiplier(m => Math.min(5, m + 0.2));
              continue; // remove orb
            } else if (item.type === 'barrier') {
              if (boostActive) {
                // Boost obliterates barriers!
                playSound.score();
                continue;
              } else {
                collisionOccurred = true;
                break;
              }
            }
          }

          if (newY < 110) {
            next.push({ ...item, y: newY });
          }
        }

        if (collisionOccurred) {
          handleGameOver(score);
          return [];
        }

        return next;
      });

      requestRef.current = requestAnimationFrame(updateLoop);
    };

    requestRef.current = requestAnimationFrame(updateLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, speed, boostActive, multiplier, lane, score, handleGameOver]);

  const handleNextPassAndPlayTurn = () => {
    setActivePlayer(2);
    startGame();
  };

  const handleResetMatch = () => {
    setActivePlayer(1);
    setP1Score(null);
    setP2Score(null);
    startGame();
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#0B0F14] text-[#F5F7FA] overflow-hidden select-none">
      {/* Game Header Bar */}
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
            <h2 className="text-sm font-bold text-[#F5F7FA] leading-tight flex items-center gap-1.5 font-display">
              Neon Rush
              {isPassAndPlay && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FF4D36]/20 text-[#FF4D36] border border-[#FF4D36]/30">
                  P{activePlayer} Turn
                </span>
              )}
            </h2>
            <div className="text-[11px] text-[#9AA4B2] font-mono tabular-nums">
              Multiplier: {multiplier.toFixed(1)}x · Speed: {speed.toFixed(1)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-[#9AA4B2] uppercase tracking-wider">Score</div>
            <div className="text-base font-bold text-[#FF9E2C] font-mono tabular-nums leading-tight">
              {score.toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="w-8 h-8 rounded-lg bg-[#0B0F14] border border-[#28313D] flex items-center justify-center text-[#9AA4B2] hover:text-[#F5F7FA]"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>
        </div>
      </div>

      {/* Energy & Boost Indicator */}
      <div className="shrink-0 px-4 py-1.5 bg-[#151B23]/60 border-b border-[#28313D] flex items-center gap-2 z-20">
        <Zap className={`w-3.5 h-3.5 ${boostActive ? 'text-[#FF9E2C] animate-pulse' : 'text-[#FF4D36]'}`} />
        <div className="flex-1 h-2 bg-[#0B0F14] rounded-full overflow-hidden border border-[#28313D]">
          <div
            className={`h-full transition-all duration-200 ${
              boostActive ? 'bg-gradient-to-r from-[#FF4D36] to-[#FF9E2C]' : 'bg-[#FF4D36]'
            }`}
            style={{ width: `${energy}%` }}
          />
        </div>
        <button
          onClick={triggerBoost}
          disabled={energy < 40 || boostActive || gameState !== 'PLAYING'}
          className={`text-[11px] font-bold px-2 py-0.5 rounded-md transition-all ${
            energy >= 40 && !boostActive && gameState === 'PLAYING'
              ? 'bg-[#FF4D36] text-white hover:bg-[#ff3820] shadow-sm active:scale-95'
              : 'bg-[#28313D]/60 text-[#9AA4B2] cursor-not-allowed opacity-50'
          }`}
        >
          {boostActive ? 'EMBER BOOST' : 'BOOST'}
        </button>
      </div>

      {/* 3D-feel Track Playing Field */}
      <div className="relative flex-1 w-full bg-[#0B0F14] overflow-hidden flex justify-center">
        {/* Animated Cyber Grid Canvas Backdrop */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FF4D36]/20 via-[#0B0F14] to-[#0B0F14]" />
        
        {/* Track Perspective Container */}
        <div className="relative w-full max-w-sm h-full mx-auto flex">
          {/* Lane Dividers */}
          <div className="absolute inset-y-0 left-1/3 w-px bg-gradient-to-b from-transparent via-[#28313D] to-[#FF4D36]/40 border-r border-dashed border-[#FF4D36]/30" />
          <div className="absolute inset-y-0 left-2/3 w-px bg-gradient-to-b from-transparent via-[#28313D] to-[#FF4D36]/40 border-r border-dashed border-[#FF4D36]/30" />

          {/* Lane 0, 1, 2 Tap Hitboxes for Touchscreen Play */}
          <div
            onClick={() => moveLane(0)}
            className="flex-1 h-full cursor-pointer z-10 active:bg-white/5 transition-colors"
            title="Tap to switch Left"
          />
          <div
            onClick={() => moveLane(1)}
            className="flex-1 h-full cursor-pointer z-10 active:bg-white/5 transition-colors"
            title="Tap Center lane"
          />
          <div
            onClick={() => moveLane(2)}
            className="flex-1 h-full cursor-pointer z-10 active:bg-white/5 transition-colors"
            title="Tap to switch Right"
          />

          {/* Render Falling Obstacles & Orbs */}
          {obstacles.map(item => {
            const laneLeftPercent = item.lane === 0 ? '16.6%' : item.lane === 1 ? '50%' : '83.3%';

            if (item.type === 'orb') {
              return (
                <div
                  key={item.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform"
                  style={{
                    left: laneLeftPercent,
                    top: `${item.y}%`,
                    width: '32px',
                    height: '32px'
                  }}
                >
                  <div className="w-5 h-5 rounded-full bg-[#FF9E2C] shadow-[0_0_12px_#FF9E2C] flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform"
                style={{
                  left: laneLeftPercent,
                  top: `${item.y}%`,
                  width: '76px',
                  height: '24px'
                }}
              >
                <div className="w-full h-full rounded-md bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 border border-rose-400 shadow-[0_0_14px_rgba(244,63,94,0.7)] flex items-center justify-center text-[10px] font-bold text-white tracking-widest font-mono">
                  BARRIER
                </div>
              </div>
            );
          })}

          {/* Hovercraft Player Vehicle */}
          {gameState === 'PLAYING' && (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 bottom-[14%] transition-all duration-150 ease-out z-20 pointer-events-none"
              style={{
                left: lane === 0 ? '16.6%' : lane === 1 ? '50%' : '83.3%'
              }}
            >
              <div
                className={`relative w-14 h-16 flex flex-col items-center justify-center ${
                  boostActive ? 'scale-110 drop-shadow-[0_0_20px_#FF9E2C]' : 'drop-shadow-[0_0_14px_#FF4D36]'
                }`}
              >
                {/* Sleek Cyber Hovercraft SVG */}
                <svg viewBox="0 0 60 70" className="w-full h-full">
                  <defs>
                    <linearGradient id="craftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF4D36" />
                      <stop offset="100%" stopColor="#FF9E2C" />
                    </linearGradient>
                  </defs>
                  {/* Wings */}
                  <polygon points="30,5 58,55 45,62 30,48 15,62 2,55" fill="#151B23" stroke="#FF4D36" strokeWidth="2" />
                  {/* Cockpit Canopy */}
                  <polygon points="30,12 40,36 30,44 20,36" fill="url(#craftGrad)" />
                  {/* Thruster exhaust flames */}
                  <polygon points="26,50 34,50 30,68" fill={boostActive ? '#FF9E2C' : '#FF4D36'} className="animate-pulse" />
                </svg>

                {/* Energy wake particles */}
                <div className="absolute -bottom-2 w-8 h-1 rounded-full bg-[#FF9E2C] blur-sm animate-ping" />
              </div>
            </div>
          )}
        </div>

        {/* OVERLAYS */}
        {/* Ready Overlay */}
        {gameState === 'READY' && (
          <div className="absolute inset-0 bg-[#0B0F14]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40">
            <div className="w-16 h-16 rounded-2xl bg-[#FF4D36]/20 border border-[#FF4D36]/40 flex items-center justify-center mb-4 text-[#FF4D36]">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-display text-[#F5F7FA] mb-2">
              {isPassAndPlay ? `Player ${activePlayer} Ready?` : 'Neon Rush: Cyber Runner'}
            </h3>
            <p className="text-sm text-[#9AA4B2] max-w-xs mb-6">
              Switch lanes to dodge hazard barriers and collect ember flux orbs to charge ember boost!
            </p>
            <div className="flex gap-2 mb-6 text-xs text-[#9AA4B2]">
              <span className="px-2.5 py-1 rounded bg-[#151B23] border border-[#28313D]">Tap screen left / right</span>
              <span className="px-2.5 py-1 rounded bg-[#151B23] border border-[#28313D]">A / D / Arrow Keys</span>
            </div>
            <button
              onClick={startGame}
              className="w-full max-w-xs h-12 rounded-xl bg-[#FF4D36] hover:bg-[#ff3820] text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D36]/25 active:scale-95 transition-transform"
            >
              <Play className="w-5 h-5 fill-white" />
              Start Run
            </button>
          </div>
        )}

        {/* Game Over / Round Summary Overlay */}
        {gameState === 'ROUND_OVER' && (
          <div className="absolute inset-0 bg-[#0B0F14]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-3 text-rose-400">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-display text-[#F5F7FA] mb-1">
              Barrier Impact!
            </h3>
            <div className="text-xs text-[#9AA4B2] mb-4">Run Terminated</div>

            {/* Score Breakdown Card */}
            <div className="w-full max-w-xs bg-[#151B23] border border-[#28313D] rounded-2xl p-4 mb-5">
              <div className="text-xs text-[#9AA4B2] uppercase tracking-wider mb-1">Final Score</div>
              <div className="text-3xl font-extrabold text-[#00D9A6] font-mono tabular-nums mb-3">
                {score.toLocaleString()}
              </div>

              {isPassAndPlay ? (
                <div className="pt-3 border-t border-[#28313D] text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#9AA4B2]">Player 1 Score:</span>
                    <span className="font-mono font-bold text-[#F5F7FA]">
                      {p1Score !== null ? p1Score.toLocaleString() : `${score.toLocaleString()} (Recorded)`}
                    </span>
                  </div>
                  {p2Score !== null && (
                    <div className="flex justify-between">
                      <span className="text-[#9AA4B2]">Player 2 Score:</span>
                      <span className="font-mono font-bold text-[#F5F7FA]">{p2Score.toLocaleString()}</span>
                    </div>
                  )}
                  {activePlayer === 2 && p1Score !== null && (
                    <div className="mt-2 pt-2 border-t border-[#28313D] text-center font-bold text-[#7C5CFF]">
                      {score > p1Score ? '🎉 Player 2 Wins the Duel!' : score < p1Score ? '🎉 Player 1 Wins the Duel!' : '🤝 Tied Match!'}
                    </div>
                  )}
                </div>
              ) : (
                <div className="pt-2 border-t border-[#28313D] flex justify-between text-xs text-[#9AA4B2]">
                  <span>Best Personal Record:</span>
                  <span className="font-mono font-bold text-[#F5F7FA]">{Math.max(highScore, score).toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-xs space-y-2.5">
              {isPassAndPlay && activePlayer === 1 ? (
                <button
                  onClick={handleNextPassAndPlayTurn}
                  className="w-full h-11 rounded-xl bg-[#7C5CFF] text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Users className="w-4 h-4" />
                  Pass Device to Player 2
                </button>
              ) : (
                <button
                  onClick={isPassAndPlay ? handleResetMatch : startGame}
                  className="w-full h-11 rounded-xl bg-[#7C5CFF] text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md shadow-[#7C5CFF]/20"
                >
                  <RotateCcw className="w-4 h-4" />
                  {isPassAndPlay ? 'Rematch Duel' : 'Play Again'}
                </button>
              )}

              <button
                onClick={onClose}
                className="w-full h-10 rounded-xl bg-[#151B23] border border-[#28313D] text-[#9AA4B2] hover:text-[#F5F7FA] text-sm font-medium active:scale-95 transition-colors"
              >
                Back to Arcade Hub
              </button>
            </div>
          </div>
        )}
      </div>

      {/* On-Screen Mobile Thumb Controls */}
      <div className="shrink-0 px-4 py-3 bg-[#151B23] border-t border-[#28313D] flex items-center justify-between gap-3 z-30">
        <button
          onClick={() => moveLane(lane - 1)}
          disabled={lane === 0 || gameState !== 'PLAYING'}
          className="flex-1 h-14 rounded-xl bg-[#0B0F14] border border-[#28313D] active:border-[#7C5CFF] active:bg-[#7C5CFF]/10 disabled:opacity-40 flex items-center justify-center text-[#F5F7FA] font-bold text-sm transition-all"
        >
          ← LEFT
        </button>
        <button
          onClick={triggerBoost}
          disabled={energy < 40 || boostActive || gameState !== 'PLAYING'}
          className={`h-14 px-5 rounded-xl border flex flex-col items-center justify-center font-bold text-xs transition-all ${
            energy >= 40 && !boostActive
              ? 'bg-[#7C5CFF] border-[#7C5CFF] text-white active:scale-95 shadow-md shadow-[#7C5CFF]/30'
              : 'bg-[#0B0F14] border-[#28313D] text-[#9AA4B2] opacity-40'
          }`}
        >
          <Zap className="w-4 h-4 mb-0.5" />
          BOOST
        </button>
        <button
          onClick={() => moveLane(lane + 1)}
          disabled={lane === 2 || gameState !== 'PLAYING'}
          className="flex-1 h-14 rounded-xl bg-[#0B0F14] border border-[#28313D] active:border-[#7C5CFF] active:bg-[#7C5CFF]/10 disabled:opacity-40 flex items-center justify-center text-[#F5F7FA] font-bold text-sm transition-all"
        >
          RIGHT →
        </button>
      </div>
    </div>
  );
};

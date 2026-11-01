import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, RotateCcw, Undo2, Trophy, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { playSound } from '../../utils/audio.ts';

interface QuantumGridGameProps {
  onClose: () => void;
  onScoreSubmit?: (score: number) => void;
}

type Board = (number | null)[][];

const BOARD_SIZE = 4;

export const QuantumGridGame: React.FC<QuantumGridGameProps> = ({ onClose, onScoreSubmit }) => {
  const [board, setBoard] = useState<Board>(() => getEmptyBoard());
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(18400);
  const [previousState, setPreviousState] = useState<{ board: Board; score: number } | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(true);

  function getEmptyBoard(): Board {
    return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
  }

  const addRandomTile = useCallback((currentBoard: Board): Board => {
    const emptyCells: { r: number; c: number }[] = [];
    currentBoard.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === null) emptyCells.push({ r, c });
      });
    });

    if (emptyCells.length === 0) return currentBoard;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const val = Math.random() < 0.85 ? 2 : 4;
    const newBoard = currentBoard.map(row => [...row]);
    newBoard[randomCell.r][randomCell.c] = val;
    return newBoard;
  }, []);

  const resetGame = useCallback(() => {
    let b = getEmptyBoard();
    b = addRandomTile(b);
    b = addRandomTile(b);
    setBoard(b);
    setScore(0);
    setPreviousState(null);
    setGameOver(false);
    setWon(false);
    playSound.click();
  }, [addRandomTile]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Check if any moves can be made
  const checkGameOver = (currentBoard: Board): boolean => {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (currentBoard[r][c] === null) return false;
        if (c < BOARD_SIZE - 1 && currentBoard[r][c] === currentBoard[r][c + 1]) return false;
        if (r < BOARD_SIZE - 1 && currentBoard[r][c] === currentBoard[r + 1][c]) return false;
      }
    }
    return true;
  };

  const move = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (gameOver) return;

    let hasMoved = false;
    let earnedPoints = 0;
    const nextBoard = board.map(row => [...row]);

    // Save previous for Undo
    setPreviousState({
      board: board.map(row => [...row]),
      score: score
    });

    const slideRow = (row: (number | null)[]) => {
      // Filter non-null
      const filtered = row.filter(val => val !== null) as number[];
      const result: (number | null)[] = [];
      let i = 0;
      while (i < filtered.length) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          const merged = filtered[i] * 2;
          result.push(merged);
          earnedPoints += merged;
          if (merged === 2048) setWon(true);
          i += 2;
        } else {
          result.push(filtered[i]);
          i++;
        }
      }
      while (result.length < BOARD_SIZE) {
        result.push(null);
      }
      return result;
    };

    if (direction === 'LEFT') {
      for (let r = 0; r < BOARD_SIZE; r++) {
        const originalRow = nextBoard[r];
        const newRow = slideRow(originalRow);
        if (JSON.stringify(originalRow) !== JSON.stringify(newRow)) hasMoved = true;
        nextBoard[r] = newRow;
      }
    } else if (direction === 'RIGHT') {
      for (let r = 0; r < BOARD_SIZE; r++) {
        const originalRow = nextBoard[r];
        const reversed = [...originalRow].reverse();
        const newRow = slideRow(reversed).reverse();
        if (JSON.stringify(originalRow) !== JSON.stringify(newRow)) hasMoved = true;
        nextBoard[r] = newRow;
      }
    } else if (direction === 'UP') {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const col = [nextBoard[0][c], nextBoard[1][c], nextBoard[2][c], nextBoard[3][c]];
        const newCol = slideRow(col);
        for (let r = 0; r < BOARD_SIZE; r++) {
          if (nextBoard[r][c] !== newCol[r]) hasMoved = true;
          nextBoard[r][c] = newCol[r];
        }
      }
    } else if (direction === 'DOWN') {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const col = [nextBoard[0][c], nextBoard[1][c], nextBoard[2][c], nextBoard[3][c]].reverse();
        const newCol = slideRow(col).reverse();
        for (let r = 0; r < BOARD_SIZE; r++) {
          if (nextBoard[r][c] !== newCol[r]) hasMoved = true;
          nextBoard[r][c] = newCol[r];
        }
      }
    }

    if (hasMoved) {
      const spawnedBoard = addRandomTile(nextBoard);
      const newScore = score + earnedPoints;
      setBoard(spawnedBoard);
      setScore(newScore);
      if (newScore > bestScore) setBestScore(newScore);

      if (earnedPoints > 0) {
        playSound.merge();
      } else {
        playSound.tab();
      }

      if (checkGameOver(spawnedBoard)) {
        setGameOver(true);
        playSound.lose();
        onScoreSubmit?.(newScore);
      }
    }
  }, [addRandomTile, bestScore, board, gameOver, onScoreSubmit, score]);

  const handleUndo = () => {
    if (previousState) {
      setBoard(previousState.board);
      setScore(previousState.score);
      setPreviousState(null);
      setGameOver(false);
      playSound.tab();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') move('UP');
      if (e.key === 'ArrowDown' || e.key === 's') move('DOWN');
      if (e.key === 'ArrowLeft' || e.key === 'a') move('LEFT');
      if (e.key === 'ArrowRight' || e.key === 'd') move('RIGHT');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move]);

  // Touch Swipe detection
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 30) {
        if (dx > 0) move('RIGHT');
        else move('LEFT');
      }
    } else {
      if (Math.abs(dy) > 30) {
        if (dy > 0) move('DOWN');
        else move('UP');
      }
    }
  };

  // Get tile style based on value
  const getTileClasses = (val: number | null) => {
    if (!val) return 'bg-[#151B23]/40 border-[#28313D]/40';
    switch (val) {
      case 2:
        return 'bg-[#151B23] border-[#28313D] text-[#9AA4B2]';
      case 4:
        return 'bg-[#1e2531] border-[#374457] text-[#F5F7FA]';
      case 8:
        return 'bg-[#7C5CFF]/20 border-[#7C5CFF]/50 text-[#7C5CFF] shadow-[0_0_8px_rgba(124,92,255,0.3)]';
      case 16:
        return 'bg-[#7C5CFF]/30 border-[#7C5CFF]/70 text-[#c8bcff] shadow-[0_0_12px_rgba(124,92,255,0.4)]';
      case 32:
        return 'bg-[#7C5CFF] border-[#9d84ff] text-white font-bold shadow-[0_0_14px_rgba(124,92,255,0.6)]';
      case 64:
        return 'bg-[#00D9A6]/20 border-[#00D9A6]/60 text-[#00D9A6] font-bold shadow-[0_0_12px_rgba(0,217,166,0.4)]';
      case 128:
        return 'bg-[#00D9A6]/35 border-[#00D9A6]/80 text-[#5ff7d3] font-bold shadow-[0_0_16px_rgba(0,217,166,0.6)]';
      case 256:
      case 512:
        return 'bg-[#00D9A6] border-emerald-300 text-[#0B0F14] font-extrabold shadow-[0_0_20px_rgba(0,217,166,0.8)]';
      case 1024:
      case 2048:
        return 'bg-gradient-to-br from-[#7C5CFF] via-[#00D9A6] to-amber-300 border-amber-300 text-white font-black shadow-[0_0_24px_rgba(124,92,255,0.9)] animate-pulse';
      default:
        return 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400 text-white font-black';
    }
  };

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
              Quantum Grid
            </h2>
            <div className="text-[11px] text-[#9AA4B2]">Fuse cores to 2048</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={!previousState || gameOver}
            title="Undo Last Move"
            className="w-8 h-8 rounded-lg bg-[#0B0F14] border border-[#28313D] disabled:opacity-30 flex items-center justify-center text-[#9AA4B2] hover:text-[#F5F7FA] active:scale-95 transition-all"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={resetGame}
            title="Restart Grid"
            className="w-8 h-8 rounded-lg bg-[#0B0F14] border border-[#28313D] flex items-center justify-center text-[#9AA4B2] hover:text-[#F5F7FA] active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Score Banner */}
      <div className="shrink-0 px-4 py-2.5 bg-[#151B23]/50 border-b border-[#28313D] flex items-center justify-between">
        <div className="bg-[#0B0F14] border border-[#28313D] rounded-xl px-3 py-1 flex-1 mr-2 text-center">
          <div className="text-[10px] text-[#9AA4B2] uppercase tracking-wider">Score</div>
          <div className="text-lg font-extrabold text-[#00D9A6] font-mono tabular-nums">{score.toLocaleString()}</div>
        </div>
        <div className="bg-[#0B0F14] border border-[#28313D] rounded-xl px-3 py-1 flex-1 text-center">
          <div className="text-[10px] text-[#9AA4B2] uppercase tracking-wider">Best</div>
          <div className="text-lg font-extrabold text-[#F5F7FA] font-mono tabular-nums">{bestScore.toLocaleString()}</div>
        </div>
      </div>

      {/* Main Board Area */}
      <div
        className="flex-1 w-full p-4 flex flex-col items-center justify-center touch-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full max-w-[340px] aspect-square p-2.5 bg-[#151B23] border border-[#28313D] rounded-3xl shadow-2xl flex flex-col justify-between">
          <div className="grid grid-cols-4 grid-rows-4 gap-2.5 w-full h-full">
            {board.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`w-full h-full rounded-2xl border flex items-center justify-center transition-all duration-150 ${getTileClasses(
                    cell
                  )}`}
                >
                  {cell !== null && (
                    <span
                      className={`font-mono font-bold select-none ${
                        cell > 512 ? 'text-lg' : cell > 64 ? 'text-xl' : 'text-2xl'
                      }`}
                    >
                      {cell}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Win Prompt Overlay */}
          {won && (
            <div className="absolute inset-0 bg-[#0B0F14]/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center z-20">
              <Sparkles className="w-12 h-12 text-[#00D9A6] mb-2 animate-bounce" />
              <h3 className="text-2xl font-bold font-display text-[#F5F7FA] mb-1">Singularity Achieved!</h3>
              <p className="text-xs text-[#9AA4B2] mb-4">You fused the 2048 Quantum Core.</p>
              <button
                onClick={() => setWon(false)}
                className="px-6 py-2.5 rounded-xl bg-[#00D9A6] text-[#0B0F14] font-bold text-sm shadow-lg shadow-[#00D9A6]/20 active:scale-95"
              >
                Continue Playing
              </button>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-[#0B0F14]/92 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-2 text-rose-400">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-[#F5F7FA] mb-1">Matrix Locked</h3>
              <p className="text-xs text-[#9AA4B2] mb-3">No further moves available.</p>
              <div className="text-sm font-mono text-[#00D9A6] font-bold mb-4">Score: {score.toLocaleString()}</div>
              <button
                onClick={resetGame}
                className="px-6 py-2.5 rounded-xl bg-[#7C5CFF] text-white font-bold text-sm shadow-lg shadow-[#7C5CFF]/30 active:scale-95"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* D-Pad Directional Controls for Mobile Ergonomics */}
      <div className="shrink-0 px-4 py-3 bg-[#151B23] border-t border-[#28313D] flex items-center justify-center gap-2">
        <div className="flex flex-col items-center gap-1.5 w-full max-w-[200px]">
          <button
            onClick={() => move('UP')}
            className="w-12 h-10 rounded-xl bg-[#0B0F14] border border-[#28313D] active:border-[#7C5CFF] active:bg-[#7C5CFF]/20 flex items-center justify-center text-xs font-bold text-[#F5F7FA]"
          >
            ▲
          </button>
          <div className="flex items-center gap-2 w-full justify-center">
            <button
              onClick={() => move('LEFT')}
              className="w-12 h-10 rounded-xl bg-[#0B0F14] border border-[#28313D] active:border-[#7C5CFF] active:bg-[#7C5CFF]/20 flex items-center justify-center text-xs font-bold text-[#F5F7FA]"
            >
              ◀
            </button>
            <button
              onClick={() => move('DOWN')}
              className="w-12 h-10 rounded-xl bg-[#0B0F14] border border-[#28313D] active:border-[#7C5CFF] active:bg-[#7C5CFF]/20 flex items-center justify-center text-xs font-bold text-[#F5F7FA]"
            >
              ▼
            </button>
            <button
              onClick={() => move('RIGHT')}
              className="w-12 h-10 rounded-xl bg-[#0B0F14] border border-[#28313D] active:border-[#7C5CFF] active:bg-[#7C5CFF]/20 flex items-center justify-center text-xs font-bold text-[#F5F7FA]"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

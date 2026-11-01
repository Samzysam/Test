import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Bot, Users, Trophy, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { playSound } from '../../utils/audio.ts';

interface TacticalBoardGameProps {
  onClose: () => void;
  onScoreSubmit?: (score: number) => void;
  defaultMode?: 'solo_ai' | 'pass_and_play';
}

const ROWS = 6;
const COLS = 7;
type Player = 1 | 2; // 1 = Purple, 2 = Teal
type Cell = Player | null;

export const TacticalBoardGame: React.FC<TacticalBoardGameProps> = ({
  onClose,
  onScoreSubmit,
  defaultMode = 'solo_ai'
}) => {
  const [mode, setMode] = useState<'solo_ai' | 'pass_and_play'>(defaultMode);
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'master'>('medium');
  const [board, setBoard] = useState<Cell[][]>(() => createEmptyBoard());
  const [turn, setTurn] = useState<Player>(1);
  const [winner, setWinner] = useState<Player | 'DRAW' | null>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [scores, setScores] = useState<{ p1: number; p2: number; draws: number }>({ p1: 0, p2: 0, draws: 0 });

  function createEmptyBoard(): Cell[][] {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  }

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setTurn(1);
    setWinner(null);
    setWinningCells([]);
    setIsAiThinking(false);
    playSound.tab();
  }, []);

  const checkWinner = (grid: Cell[][]): { winner: Player | 'DRAW' | null; winningCoords: [number, number][] } => {
    // Check horizontal
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        const p = grid[r][c];
        if (p && p === grid[r][c + 1] && p === grid[r][c + 2] && p === grid[r][c + 3]) {
          return { winner: p, winningCoords: [[r, c], [r, c + 1], [r, c + 2], [r, c + 3]] };
        }
      }
    }

    // Check vertical
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c < COLS; c++) {
        const p = grid[r][c];
        if (p && p === grid[r + 1][c] && p === grid[r + 2][c] && p === grid[r + 3][c]) {
          return { winner: p, winningCoords: [[r, c], [r + 1, c], [r + 2, c], [r + 3, c]] };
        }
      }
    }

    // Check diagonal (down-right)
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        const p = grid[r][c];
        if (p && p === grid[r + 1][c + 1] && p === grid[r + 2][c + 2] && p === grid[r + 3][c + 3]) {
          return { winner: p, winningCoords: [[r, c], [r + 1, c + 1], [r + 2, c + 2], [r + 3, c + 3]] };
        }
      }
    }

    // Check diagonal (up-right)
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        const p = grid[r][c];
        if (p && p === grid[r - 1][c + 1] && p === grid[r - 2][c + 2] && p === grid[r - 3][c + 3]) {
          return { winner: p, winningCoords: [[r, c], [r - 1, c + 1], [r - 2, c + 2], [r - 3, c + 3]] };
        }
      }
    }

    // Check if full (draw)
    const isFull = grid[0].every(cell => cell !== null);
    if (isFull) {
      return { winner: 'DRAW', winningCoords: [] };
    }

    return { winner: null, winningCoords: [] };
  };

  const dropDisc = useCallback((col: number): boolean => {
    if (winner || isAiThinking) return false;

    // Find lowest empty row in col
    let targetRow = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === null) {
        targetRow = r;
        break;
      }
    }

    if (targetRow === -1) return false; // Column is full

    const newBoard = board.map(r => [...r]);
    newBoard[targetRow][col] = turn;
    setBoard(newBoard);
    playSound.click();

    const result = checkWinner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinningCells(result.winningCoords);
      if (result.winner === 1) {
        playSound.victory();
        setScores(s => ({ ...s, p1: s.p1 + 1 }));
        onScoreSubmit?.(100);
      } else if (result.winner === 2) {
        playSound.lose();
        setScores(s => ({ ...s, p2: s.p2 + 1 }));
      } else {
        playSound.tab();
        setScores(s => ({ ...s, draws: s.draws + 1 }));
      }
    } else {
      setTurn(turn === 1 ? 2 : 1);
    }

    return true;
  }, [board, isAiThinking, onScoreSubmit, turn, winner]);

  // AI Turn Logic
  useEffect(() => {
    if (mode === 'solo_ai' && turn === 2 && !winner) {
      setIsAiThinking(true);

      const timer = setTimeout(() => {
        // AI chooses column
        const validCols: number[] = [];
        for (let c = 0; c < COLS; c++) {
          if (board[0][c] === null) validCols.push(c);
        }

        if (validCols.length === 0) {
          setIsAiThinking(false);
          return;
        }

        let chosenCol = validCols[Math.floor(Math.random() * validCols.length)];

        if (aiDifficulty !== 'easy') {
          // Check if AI can win immediately
          for (const c of validCols) {
            let row = -1;
            for (let r = ROWS - 1; r >= 0; r--) {
              if (board[r][c] === null) { row = r; break; }
            }
            if (row !== -1) {
              const testBoard = board.map(r => [...r]);
              testBoard[row][c] = 2;
              if (checkWinner(testBoard).winner === 2) {
                chosenCol = c;
                break;
              }
            }
          }

          // Check if Player 1 can win immediately, and block it
          if (chosenCol === validCols[0] || aiDifficulty === 'master') {
            for (const c of validCols) {
              let row = -1;
              for (let r = ROWS - 1; r >= 0; r--) {
                if (board[r][c] === null) { row = r; break; }
              }
              if (row !== -1) {
                const testBoard = board.map(r => [...r]);
                testBoard[row][c] = 1;
                if (checkWinner(testBoard).winner === 1) {
                  chosenCol = c;
                  break;
                }
              }
            }
          }

          // Center column bias for Master AI
          if (aiDifficulty === 'master' && validCols.includes(3) && Math.random() < 0.6) {
            chosenCol = 3;
          }
        }

        dropDisc(chosenCol);
        setIsAiThinking(false);
      }, 550);

      return () => clearTimeout(timer);
    }
  }, [aiDifficulty, board, dropDisc, mode, turn, winner]);

  const isWinningCell = (r: number, c: number) => {
    return winningCells.some(([wr, wc]) => wr === r && wc === c);
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
              Tactical Matrix
            </h2>
            <div className="text-[11px] text-[#9AA4B2]">
              {mode === 'solo_ai' ? `Vs AI Bot (${aiDifficulty})` : 'Pass & Play (2 Players)'}
            </div>
          </div>
        </div>

        <button
          onClick={resetGame}
          title="Restart Match"
          className="w-8 h-8 rounded-lg bg-[#0B0F14] border border-[#28313D] flex items-center justify-center text-[#9AA4B2] hover:text-[#F5F7FA] active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Mode Selector and Turn Banner */}
      <div className="shrink-0 px-4 py-2.5 bg-[#151B23]/70 border-b border-[#28313D] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 bg-[#0B0F14] border border-[#28313D] rounded-xl">
            <button
              onClick={() => { setMode('solo_ai'); resetGame(); }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                mode === 'solo_ai' ? 'bg-[#FF4D36] text-white' : 'text-[#9AA4B2] hover:text-[#F5F7FA]'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              Vs AI
            </button>
            <button
              onClick={() => { setMode('pass_and_play'); resetGame(); }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                mode === 'pass_and_play' ? 'bg-[#FF4D36] text-white' : 'text-[#9AA4B2] hover:text-[#F5F7FA]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              2P Local
            </button>
          </div>

          {mode === 'solo_ai' && (
            <select
              value={aiDifficulty}
              onChange={(e) => { setAiDifficulty(e.target.value as any); resetGame(); }}
              className="bg-[#0B0F14] border border-[#28313D] text-xs font-medium text-[#F5F7FA] rounded-lg px-2 py-1 outline-none focus:border-[#FF4D36]"
            >
              <option value="easy">Easy Bot</option>
              <option value="medium">Medium Bot</option>
              <option value="master">Master AI</option>
            </select>
          )}
        </div>

        {/* Turn Status Tracker */}
        <div className="flex items-center justify-between bg-[#0B0F14] border border-[#28313D] rounded-xl px-3 py-1.5">
          <div className="flex items-center gap-2">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                turn === 1 ? 'bg-[#FF4D36] shadow-[0_0_8px_#FF4D36]' : 'bg-[#00D9A6] shadow-[0_0_8px_#00D9A6]'
              }`}
            />
            <span className="text-xs font-bold text-[#F5F7FA]">
              {winner
                ? winner === 'DRAW'
                  ? 'Stalemate!'
                  : winner === 1
                  ? mode === 'solo_ai' ? 'You Won!' : 'Player 1 Wins!'
                  : mode === 'solo_ai' ? 'AI Bot Won!' : 'Player 2 Wins!'
                : turn === 1
                ? mode === 'solo_ai' ? 'Your Turn (Ember Red)' : 'Player 1 Turn (Ember Red)'
                : isAiThinking
                ? 'AI Computing Move...'
                : 'Player 2 Turn (Teal)'}
            </span>
          </div>

          <div className="text-[11px] font-mono tabular-nums text-[#9AA4B2]">
            P1: {scores.p1} · P2: {scores.p2}
          </div>
        </div>
      </div>

      {/* Interactive Board Area */}
      <div className="flex-1 w-full p-3 flex flex-col items-center justify-center">
        <div className="w-full max-w-[360px] bg-[#151B23] border border-[#28313D] rounded-3xl p-3 shadow-2xl flex flex-col gap-2">
          {/* Column Drop Arrow Indicators */}
          <div className="grid grid-cols-7 gap-1.5 px-1">
            {Array.from({ length: COLS }).map((_, c) => {
              const isColAvailable = board[0][c] === null && !winner && !isAiThinking;
              return (
                <button
                  key={c}
                  onClick={() => dropDisc(c)}
                  disabled={!isColAvailable}
                  className={`h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                    isColAvailable
                      ? 'bg-[#0B0F14] border border-[#28313D] hover:border-[#FF4D36] text-[#FF4D36] active:scale-95'
                      : 'opacity-20 cursor-not-allowed text-[#9AA4B2]'
                  }`}
                  aria-label={`Drop token in column ${c + 1}`}
                >
                  ▼
                </button>
              );
            })}
          </div>

          {/* 7x6 Matrix Grid */}
          <div className="grid grid-cols-7 gap-1.5 bg-[#0B0F14] p-2 rounded-2xl border border-[#28313D]">
            {board.map((row, r) =>
              row.map((cell, c) => {
                const isWin = isWinningCell(r, c);
                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => dropDisc(c)}
                    disabled={board[0][c] !== null || !!winner || isAiThinking}
                    className={`aspect-square w-full rounded-full flex items-center justify-center transition-all relative ${
                      cell === null
                        ? 'bg-[#151B23]/70 border border-[#28313D]/60 hover:bg-[#151B23]'
                        : cell === 1
                        ? 'bg-[#FF4D36] border border-[#ff6b4a] shadow-[0_0_10px_rgba(255,77,54,0.6)]'
                        : 'bg-[#00D9A6] border border-[#5ff7d3] shadow-[0_0_10px_rgba(0,217,166,0.6)]'
                    } ${isWin ? 'scale-110 ring-2 ring-white animate-bounce' : ''}`}
                  >
                    {/* Visual Shape Symbol for Non-Hue Accessibility */}
                    {cell === 1 && (
                      <div className="w-2.5 h-2.5 rotate-45 bg-white/90 rounded-sm" />
                    )}
                    {cell === 2 && (
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-[#0B0F14] bg-white/90" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Winner Announcement Card */}
        {winner && (
          <div className="mt-4 w-full max-w-[360px] bg-[#151B23] border border-[#28313D] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-[#9AA4B2]">Match Finished</div>
              <div className="text-sm font-bold text-[#F5F7FA]">
                {winner === 'DRAW' ? 'Stalemate!' : winner === 1 ? 'Player 1 Victorious!' : 'Player 2 Victorious!'}
              </div>
            </div>
            <button
              onClick={resetGame}
              className="px-4 py-2 rounded-xl bg-[#FF4D36] hover:bg-[#ff3820] text-white font-semibold text-xs shadow-md shadow-[#FF4D36]/30 active:scale-95 transition-transform"
            >
              Play Rematch
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

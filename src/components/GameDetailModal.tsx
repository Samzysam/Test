import React, { useState } from 'react';
import { X, Play, Star, Trophy, Users, Shield, Clock, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { GameItem, GameMode } from '../types.ts';
import { playSound } from '../utils/audio.ts';

interface GameDetailModalProps {
  game: GameItem | null;
  onClose: () => void;
  onPlayGame: (game: GameItem, mode: GameMode) => void;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({
  game,
  onClose,
  onPlayGame
}) => {
  if (!game) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'leaderboard' | 'trophies'>('overview');
  const [selectedMode, setSelectedMode] = useState<GameMode>(game.modes[0]);

  const handleLaunch = () => {
    playSound.click();
    onPlayGame(game, selectedMode);
  };

  const getModeLabel = (mode: GameMode) => {
    switch (mode) {
      case 'solo_ai':
        return 'Solo / Vs AI';
      case 'pass_and_play':
        return 'Pass & Play (2P)';
      case 'local_wifi':
        return 'Local Wi-Fi';
      case 'online_ranked':
        return 'Online Match';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] bg-[#151B23] border border-[#28313D] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-[#0B0F14]/80 backdrop-blur-md border border-[#28313D] flex items-center justify-center text-[#9AA4B2] hover:text-[#F5F7FA] active:scale-95 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Artwork Header */}
        <div className="relative h-48 w-full bg-[#0B0F14] shrink-0 overflow-hidden">
          <img
            src={game.bannerImage || game.image}
            alt={game.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151B23] via-[#151B23]/40 to-transparent" />

          {/* Title and metadata over hero bottom */}
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="text-xl font-extrabold text-[#F5F7FA] font-display leading-tight drop-shadow-md">
              {game.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-[#9AA4B2] font-mono tabular-nums">
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {game.rating}
              </span>
              <span aria-hidden="true">·</span>
              <span>{game.playCount} plays</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#00D9A6]">{game.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span>{game.avgDuration}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Game Modes Segmented Selector */}
          <div>
            <div className="text-[11px] font-bold text-[#9AA4B2] uppercase tracking-wider mb-2">
              Select Match Mode
            </div>
            <div className="grid grid-cols-2 gap-2">
              {game.modes.map(mode => (
                <button
                  key={mode}
                  onClick={() => {
                    playSound.tab();
                    setSelectedMode(mode);
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    selectedMode === mode
                      ? 'bg-[#FF4D36]/15 border-[#FF4D36] text-[#F5F7FA] shadow-sm'
                      : 'bg-[#0B0F14] border-[#28313D] text-[#9AA4B2] hover:text-[#F5F7FA]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-[#FF4D36]" />
                  <span>{getModeLabel(mode)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sub-Tabs Nav */}
          <div className="flex items-center gap-1 p-1 bg-[#0B0F14] rounded-xl border border-[#28313D]">
            {(['overview', 'rules', 'leaderboard', 'trophies'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  playSound.tab();
                  setActiveTab(tab);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-[#FF4D36] text-white shadow-sm'
                    : 'text-[#9AA4B2] hover:text-[#F5F7FA]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-3">
              <p className="text-xs text-[#9AA4B2] leading-relaxed">
                {game.description}
              </p>

              <div>
                <h5 className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider mb-2">
                  Key Features
                </h5>
                <ul className="space-y-1.5">
                  {game.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#9AA4B2]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00D9A6] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: How To Play */}
          {activeTab === 'rules' && (
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider">
                Rules & Control Guide
              </h5>
              <div className="space-y-2">
                {game.howToPlay.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#0B0F14] border border-[#28313D] flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#FF4D36]/20 text-[#FF4D36] text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-[#9AA4B2] leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Leaderboard */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] text-[#9AA4B2] uppercase font-mono px-2">
                <span>Rank · Player</span>
                <span>Score</span>
              </div>
              <div className="divide-y divide-[#28313D]/60 bg-[#0B0F14] border border-[#28313D] rounded-xl overflow-hidden">
                {game.achievements.length > 0 ? (
                  <div className="p-4 text-center text-xs text-[#9AA4B2]">
                    High scores are tracked live in the <strong className="text-[#FF4D36]">Ranked</strong> tab with dedicated ELO ratings.
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Tab 4: Trophies / Achievements */}
          {activeTab === 'trophies' && (
            <div className="space-y-2">
              {game.achievements.map(ach => (
                <div
                  key={ach.id}
                  className="p-3 rounded-xl bg-[#0B0F14] border border-[#28313D] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        ach.unlocked
                          ? 'bg-[#00D9A6]/20 border border-[#00D9A6]/40 text-[#00D9A6]'
                          : 'bg-[#151B23] border border-[#28313D] text-[#9AA4B2]'
                      }`}
                    >
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#F5F7FA]">{ach.title}</div>
                      <div className="text-[11px] text-[#9AA4B2]">{ach.desc}</div>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono font-bold text-[#FF9E2C] shrink-0">
                    +{ach.xp} XP
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pinned Bottom CTA Action Bar */}
        <div className="p-4 bg-[#151B23] border-t border-[#28313D] shrink-0">
          <button
            onClick={handleLaunch}
            className="w-full h-12 rounded-xl bg-[#FF4D36] hover:bg-[#ff3820] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D36]/30 active:scale-[0.98] transition-all"
          >
            <Play className="w-5 h-5 fill-white" />
            Launch Game ({getModeLabel(selectedMode)})
          </button>
        </div>
      </div>
    </div>
  );
};

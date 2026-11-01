import React, { useState } from 'react';
import { ArrowLeft, Flame, Trophy, Calendar, Gift, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { ChallengeItem, GameItem } from '../../types.ts';
import { playSound } from '../../utils/audio.ts';

interface ChallengesViewProps {
  challenges: ChallengeItem[];
  games: GameItem[];
  onClose: () => void;
  onClaimChallenge: (chId: string) => void;
  onLaunchGameById: (gameId: string) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  challenges,
  games,
  onClose,
  onClaimChallenge,
  onLaunchGameById
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'daily' | 'weekly' | 'seasonal'>('all');

  const filtered = challenges.filter(ch => {
    if (filterCategory === 'all') return true;
    return ch.category === filterCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F14] text-[#F5F7FA] flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-[#28313D] bg-[#151B23]/90 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onClose}
            aria-label="Back"
            className="w-9 h-9 rounded-xl bg-[#0B0F14] border border-[#28313D] flex items-center justify-center text-[#9AA4B2] hover:text-[#F5F7FA] active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-[#F5F7FA] font-display flex items-center gap-1.5">
              <span>Missions & Seasonal Events</span>
            </h2>
            <div className="text-[11px] text-[#9AA4B2]">Complete objectives to earn XP & Arcade Coins</div>
          </div>
        </div>
      </div>

      {/* Seasonal Hero Banner */}
      <div className="shrink-0 p-4 bg-gradient-to-r from-[#1C2330] via-[#1F171E] to-[#151B23] border-b border-[#28313D] relative overflow-hidden">
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF4D36]">
              <Flame className="w-4 h-4 fill-[#FF4D36]" />
              <span>SEASON 1: EMBER CONVERGENCE</span>
            </div>
            <h3 className="text-base font-bold text-[#F5F7FA] font-display mt-0.5">
              Seasonal Conquest Campaign
            </h3>
            <p className="text-xs text-[#9AA4B2] mt-0.5 max-w-sm">
              Complete weekly milestones to unlock the exclusive Ember Sovereign profile crest & title.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] font-mono text-[#FF9E2C] font-semibold">18 Days Left</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="shrink-0 px-4 py-2.5 bg-[#151B23]/50 border-b border-[#28313D]">
        <div className="flex items-center gap-1 p-1 bg-[#0B0F14] rounded-xl border border-[#28313D]">
          {(['all', 'daily', 'weekly', 'seasonal'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { playSound.tab(); setFilterCategory(tab); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-colors ${
                filterCategory === tab ? 'bg-[#FF4D36] text-white shadow-sm' : 'text-[#9AA4B2] hover:text-[#F5F7FA]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-8">
        {filtered.map(ch => {
          const isFinished = ch.progress >= ch.target;
          const progressPercent = Math.min(100, Math.round((ch.progress / ch.target) * 100));

          return (
            <div
              key={ch.id}
              className="p-4 rounded-2xl bg-[#151B23] border border-[#28313D] flex flex-col gap-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                      ch.category === 'seasonal'
                        ? 'bg-[#FF4D36]/20 text-[#FF4D36] border border-[#FF4D36]/30'
                        : ch.category === 'weekly'
                        ? 'bg-[#FF9E2C]/20 text-[#FF9E2C] border border-[#FF9E2C]/30'
                        : 'bg-[#00D9A6]/20 text-[#00D9A6] border border-[#00D9A6]/30'
                    }`}>
                      {ch.category}
                    </span>
                    <span className="text-[10px] text-[#9AA4B2] font-mono">{ch.expiresIn}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#F5F7FA] mt-1">{ch.title}</h4>
                  <p className="text-xs text-[#9AA4B2] mt-0.5">{ch.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-[#00D9A6]">+{ch.rewardXP} XP</div>
                  <div className="text-[11px] font-mono font-bold text-[#FF9E2C]">+{ch.rewardCoins} Coins</div>
                  {ch.rewardCosmetic && (
                    <div className="text-[10px] text-[#FF4D36] font-bold mt-0.5">
                      🎁 {ch.rewardCosmetic.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#9AA4B2] font-mono tabular-nums">
                  <span>Progress: {ch.progress} / {ch.target} {ch.unit}</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-[#0B0F14] rounded-full overflow-hidden border border-[#28313D]">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isFinished ? 'bg-[#00D9A6]' : 'bg-[#FF4D36]'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-1">
                {ch.claimed ? (
                  <span className="text-xs text-[#9AA4B2] flex items-center gap-1 font-medium">
                    <CheckCircle className="w-3.5 h-3.5 text-[#00D9A6]" />
                    Reward Claimed
                  </span>
                ) : isFinished ? (
                  <button
                    onClick={() => {
                      playSound.victory();
                      onClaimChallenge(ch.id);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-[#00D9A6] text-[#0B0F14] font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#00D9A6]/20 active:scale-95 transition-transform"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    Claim Rewards
                  </button>
                ) : ch.gameId ? (
                  <button
                    onClick={() => {
                      playSound.click();
                      onClose();
                      onLaunchGameById(ch.gameId!);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-[#FF4D36] text-white font-bold text-xs active:scale-95 transition-transform"
                  >
                    Play Target Game
                  </button>
                ) : (
                  <span className="text-xs text-[#9AA4B2] font-mono">In Progress</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { User, Trophy, Flame, Shield, Volume2, Cpu, Smartphone, RefreshCw, CheckCircle2, History, ChevronRight, Sparkles, Award, Download } from 'lucide-react';
import { UserProfile, GameItem } from '../../types.ts';
import { playSound } from '../../utils/audio.ts';

interface ProfileViewProps {
  user: UserProfile;
  games: GameItem[];
  onUpdateSettings: (key: keyof UserProfile['settings'], value: boolean) => void;
  onUpdateAvatarFrame: (frameId: string) => void;
  onResetStats: () => void;
  onOpenStore: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  games,
  onUpdateSettings,
  onUpdateAvatarFrame,
  onResetStats,
  onOpenStore
}) => {
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'game_stats' | 'history' | 'settings'>('overview');
  const [selectedGameStatId, setSelectedGameStatId] = useState<string>('tactical_board');
  const [showFrameCustomizer, setShowFrameCustomizer] = useState<boolean>(false);

  const xpPercent = Math.min(100, Math.round((user.currentXP / user.nextLevelXP) * 100));

  const availableFrames = [
    { id: 'ember_phoenix', name: 'Ember Phoenix', borderClass: 'border-[#FF4D36] ring-2 ring-[#FF4D36]/40 shadow-[0_0_12px_rgba(255,77,54,0.4)]' },
    { id: 'gold_laurel', name: 'Gilded Laurel', borderClass: 'border-amber-400 ring-2 ring-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.4)]' },
    { id: 'neon_core', name: 'Cyber Conduit', borderClass: 'border-[#00D9A6] ring-2 ring-[#00D9A6]/40 shadow-[0_0_12px_rgba(0,217,166,0.4)]' },
    { id: 'default', name: 'Standard Slate', borderClass: 'border-[#28313D]' }
  ];

  const currentFrameObj = availableFrames.find(f => f.id === user.avatarFrame) || availableFrames[0];

  const selectedGameStat = user.gameStats[selectedGameStatId];
  const selectedGameObj = games.find(g => g.id === selectedGameStatId) || games[0];

  return (
    <div className="space-y-4 px-4 pb-20 pt-2">
      {/* 1. PLAYER HERO CARD */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-[#1C2330] via-[#151B23] to-[#121820] border border-[#28313D] shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#FF4D36]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            {/* Customizable Avatar & Frame */}
            <div
              onClick={() => { playSound.click(); setShowFrameCustomizer(true); }}
              className="relative cursor-pointer group"
              title="Change Profile Frame"
            >
              <div className={`w-16 h-16 rounded-2xl bg-[#0B0F14] ${currentFrameObj.borderClass} p-1 transition-all group-hover:scale-105 flex items-center justify-center`}>
                <div className="w-full h-full bg-gradient-to-tr from-[#FF4D36] to-[#FF9E2C] rounded-xl flex items-center justify-center text-xl font-bold font-display text-white shadow-inner">
                  {user.name.charAt(0)}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-[#FF4D36] text-[10px] font-mono font-bold text-white shadow-sm">
                Lv.{user.level}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#F5F7FA] font-display">
                  {user.name}
                </h2>
                {user.isArcadePlus && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FF9E2C]/20 text-[#FF9E2C] border border-[#FF9E2C]/40 font-bold">
                    PLUS
                  </span>
                )}
              </div>
              <div className="text-xs text-[#9AA4B2] font-mono">{user.tag}</div>
              <div className="text-[11px] font-mono font-bold text-[#FF4D36] mt-0.5">
                Permanent ID: {user.id}
              </div>
            </div>
          </div>

          <button
            onClick={() => { playSound.click(); setShowFrameCustomizer(true); }}
            className="text-[11px] text-[#FF4D36] hover:underline font-semibold"
          >
            Edit Frame
          </button>
        </div>

        {/* Level XP Bar */}
        <div className="mt-4 pt-3.5 border-t border-[#28313D]/70 space-y-1.5">
          <div className="flex justify-between text-xs font-mono tabular-nums text-[#9AA4B2]">
            <span>Level {user.level} Progression</span>
            <span>{user.currentXP.toLocaleString()} / {user.nextLevelXP.toLocaleString()} XP ({xpPercent}%)</span>
          </div>
          <div className="h-2 w-full bg-[#0B0F14] rounded-full overflow-hidden border border-[#28313D]">
            <div
              className="h-full bg-gradient-to-r from-[#FF4D36] to-[#FF9E2C] transition-all duration-300"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Profile Section Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#151B23] rounded-2xl border border-[#28313D]">
        {(['overview', 'game_stats', 'history', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { playSound.tab(); setActiveProfileTab(tab); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl capitalize transition-colors ${
              activeProfileTab === tab ? 'bg-[#FF4D36] text-white shadow-sm' : 'text-[#9AA4B2] hover:text-[#F5F7FA]'
            }`}
          >
            {tab === 'game_stats' ? 'Game Stats' : tab}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & OVERALL STATS */}
      {activeProfileTab === 'overview' && (
        <div className="space-y-4">
          {/* Bento Stats Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#151B23] border border-[#28313D] text-center">
              <div className="text-xl font-extrabold text-[#F5F7FA] font-mono tabular-nums">
                {user.totalMatches}
              </div>
              <div className="text-[11px] text-[#9AA4B2] mt-0.5">Total Matches</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#151B23] border border-[#28313D] text-center">
              <div className="text-xl font-extrabold text-[#00D9A6] font-mono tabular-nums">
                {user.totalWins}W / {user.totalLosses}L
              </div>
              <div className="text-[11px] text-[#9AA4B2] mt-0.5">Wins / Losses</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#151B23] border border-[#28313D] text-center">
              <div className="text-xl font-extrabold text-[#FF4D36] font-mono tabular-nums">
                {user.winRate}%
              </div>
              <div className="text-[11px] text-[#9AA4B2] mt-0.5">Win Rate</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#151B23] border border-[#28313D] text-center">
              <div className="text-xl font-extrabold text-[#FF9E2C] font-mono tabular-nums">
                {user.totalPlaytime}
              </div>
              <div className="text-[11px] text-[#9AA4B2] mt-0.5">Total Playtime</div>
            </div>
          </div>

          {/* Quick Favourite Games Strip */}
          <div className="p-4 rounded-2xl bg-[#151B23] border border-[#28313D] space-y-2">
            <div className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider">
              Favourite Games ({user.favouriteGameIds.length})
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {user.favouriteGameIds.map(gId => {
                const g = games.find(gm => gm.id === gId);
                if (!g) return null;
                return (
                  <div key={gId} className="flex items-center gap-2 p-2 rounded-xl bg-[#0B0F14] border border-[#28313D] shrink-0">
                    <img src={g.image} alt={g.title} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <div className="text-xs font-bold text-[#F5F7FA] truncate">{g.title}</div>
                      <div className="text-[10px] text-[#00D9A6] font-mono">{g.playerCountLabel}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SEPARATE INDIVIDUAL GAME STATISTICS */}
      {activeProfileTab === 'game_stats' && (
        <div className="space-y-4">
          {/* Game Selector */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {games.map(g => (
              <button
                key={g.id}
                onClick={() => { playSound.tab(); setSelectedGameStatId(g.id); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedGameStatId === g.id
                    ? 'bg-[#FF4D36] text-white shadow-sm'
                    : 'bg-[#151B23] border border-[#28313D] text-[#9AA4B2]'
                }`}
              >
                {g.title}
              </button>
            ))}
          </div>

          {selectedGameStat ? (
            <div className="p-4 rounded-3xl bg-[#151B23] border border-[#28313D] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#28313D]">
                <div>
                  <h3 className="text-sm font-bold text-[#F5F7FA] font-display">{selectedGameObj.title}</h3>
                  <div className="text-xs text-[#00D9A6] font-mono">Individual Competitive Statistics</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-[#FF4D36]">{selectedGameStat.skillRating} ELO</div>
                  <div className="text-[10px] text-[#FF9E2C] font-mono">{selectedGameStat.rankTitle}</div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#0B0F14] border border-[#28313D]">
                  <div className="text-xs text-[#9AA4B2]">Matches Played</div>
                  <div className="text-lg font-bold text-[#F5F7FA] font-mono mt-0.5">{selectedGameStat.matches}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0B0F14] border border-[#28313D]">
                  <div className="text-xs text-[#9AA4B2]">Wins / Losses</div>
                  <div className="text-lg font-bold text-[#00D9A6] font-mono mt-0.5">
                    {selectedGameStat.wins}W / {selectedGameStat.losses}L
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#0B0F14] border border-[#28313D]">
                  <div className="text-xs text-[#9AA4B2]">Win Rate</div>
                  <div className="text-lg font-bold text-[#FF4D36] font-mono mt-0.5">{selectedGameStat.winRate}%</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0B0F14] border border-[#28313D]">
                  <div className="text-xs text-[#9AA4B2]">Personal Best</div>
                  <div className="text-lg font-bold text-[#FF9E2C] font-mono mt-0.5">{selectedGameStat.highscore.toLocaleString()}</div>
                </div>
              </div>

              <div className="text-[11px] text-[#9AA4B2] font-mono text-center">
                Total Time Logged: {selectedGameStat.playtime}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#9AA4B2] bg-[#151B23] rounded-2xl border border-[#28313D]">
              No matches recorded for this title yet. Play a game to record stats!
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RECENT MATCH HISTORY */}
      {activeProfileTab === 'history' && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-[#9AA4B2] font-mono uppercase px-2">
            <span>Match Details</span>
            <span>Outcome · XP</span>
          </div>

          <div className="space-y-2">
            {user.recentMatches.map(match => (
              <div
                key={match.id}
                className="p-3 rounded-2xl bg-[#151B23] border border-[#28313D] flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                      match.result === 'WIN'
                        ? 'bg-[#00D9A6]/20 text-[#00D9A6] border border-[#00D9A6]/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {match.result}
                    </span>
                    <h4 className="text-xs font-bold text-[#F5F7FA]">{match.gameTitle}</h4>
                  </div>
                  <div className="text-[11px] text-[#9AA4B2] mt-0.5 font-mono">
                    {match.mode} {match.opponentName ? `vs ${match.opponentName}` : ''}
                  </div>
                  <div className="text-[10px] text-[#9AA4B2] mt-0.5">{match.date}</div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-[#FF9E2C]">
                    Score: {match.score.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-mono text-[#00D9A6]">
                    +{match.xpEarned} XP
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS & PREFERENCES */}
      {activeProfileTab === 'settings' && (
        <div className="space-y-3">
          <div className="divide-y divide-[#28313D]/60 bg-[#151B23] border border-[#28313D] rounded-2xl overflow-hidden">
            {/* Low-End Battery Saver */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#0B0F14] border border-[#28313D] flex items-center justify-center text-[#00D9A6]">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F5F7FA]">Budget Phone Battery Saver</div>
                  <div className="text-[11px] text-[#9AA4B2]">Locks physics loop to 60fps & reduces particle density</div>
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings('lowEndPhoneSaver', !user.settings.lowEndPhoneSaver)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  user.settings.lowEndPhoneSaver ? 'bg-[#00D9A6]' : 'bg-[#0B0F14] border border-[#28313D]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  user.settings.lowEndPhoneSaver ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Sound FX */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#0B0F14] border border-[#28313D] flex items-center justify-center text-[#FF4D36]">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F5F7FA]">Arcade Synthesizer SFX</div>
                  <div className="text-[11px] text-[#9AA4B2]">Procedural chimes, laser bolts, and score sounds</div>
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings('soundFX', !user.settings.soundFX)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  user.settings.soundFX ? 'bg-[#FF4D36]' : 'bg-[#0B0F14] border border-[#28313D]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  user.settings.soundFX ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Direct Invites */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#0B0F14] border border-[#28313D] flex items-center justify-center text-[#FF9E2C]">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F5F7FA]">Allow Direct Invites</div>
                  <div className="text-[11px] text-[#9AA4B2]">Receive game challenges from friends</div>
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings('allowDirectInvites', !user.settings.allowDirectInvites)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  user.settings.allowDirectInvites ? 'bg-[#FF4D36]' : 'bg-[#0B0F14] border border-[#28313D]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  user.settings.allowDirectInvites ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <a
              href="/nova-arcade-source.zip"
              download="nova-arcade-source.zip"
              onClick={() => playSound.victory()}
              className="w-full py-3 px-4 rounded-xl bg-[#FF4D36] hover:bg-[#ff3820] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D36]/25 active:scale-98 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Complete Project Files (.ZIP)</span>
            </a>

            <button
              onClick={onResetStats}
              className="w-full py-2.5 rounded-xl bg-[#151B23] border border-[#28313D] hover:border-rose-500/50 text-xs text-[#9AA4B2] hover:text-rose-400 flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Session Statistics & Cache</span>
            </button>
          </div>
        </div>
      )}

      {/* FRAME CUSTOMIZER MODAL */}
      {showFrameCustomizer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#151B23] border border-[#28313D] rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#F5F7FA] font-display">Customise Profile Frame</h3>
                <div className="text-xs text-[#9AA4B2]">Select unlocked cosmetic frame</div>
              </div>
              <button
                onClick={() => setShowFrameCustomizer(false)}
                className="w-7 h-7 rounded-lg bg-[#0B0F14] border border-[#28313D] flex items-center justify-center text-[#9AA4B2]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {availableFrames.map(frame => {
                const isSelected = user.avatarFrame === frame.id;
                return (
                  <button
                    key={frame.id}
                    onClick={() => {
                      playSound.tab();
                      onUpdateAvatarFrame(frame.id);
                      setShowFrameCustomizer(false);
                    }}
                    className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#FF4D36]/15 border-[#FF4D36] text-[#F5F7FA]'
                        : 'bg-[#0B0F14] border-[#28313D] text-[#9AA4B2] hover:text-[#F5F7FA]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-[#151B23] ${frame.borderClass} flex items-center justify-center font-bold text-xs text-white`}>
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-xs font-bold">{frame.name}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#FF4D36]" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setShowFrameCustomizer(false);
                onOpenStore();
              }}
              className="w-full py-2.5 rounded-xl bg-[#0B0F14] border border-[#28313D] text-xs font-bold text-[#FF9E2C] hover:text-white"
            >
              Get More Frames in Arcade Store →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

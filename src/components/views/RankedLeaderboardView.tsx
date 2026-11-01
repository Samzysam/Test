import React, { useState } from 'react';
import { Award, Globe, Users, Calendar, Trophy, ChevronDown, Flame, Shield, ArrowUpRight } from 'lucide-react';
import { OverallLeaderboardEntry, GameSkillLeaderboardEntry, GameItem } from '../../types.ts';
import { playSound } from '../../utils/audio.ts';

interface RankedLeaderboardViewProps {
  overallLeaderboard: OverallLeaderboardEntry[];
  gameLeaderboards: Record<string, GameSkillLeaderboardEntry[]>;
  games: GameItem[];
  onPlayGame: (game: GameItem) => void;
}

export const RankedLeaderboardView: React.FC<RankedLeaderboardViewProps> = ({
  overallLeaderboard,
  gameLeaderboards,
  games,
  onPlayGame
}) => {
  const [majorTab, setMajorTab] = useState<'overall' | 'game_specific'>('overall');
  const [scopeFilter, setScopeFilter] = useState<'global' | 'friends' | 'seasonal'>('global');
  const [selectedGameId, setSelectedGameId] = useState<string>('tactical_board');

  const selectedGame = games.find(g => g.id === selectedGameId) || games[0];
  const currentGameRankings = gameLeaderboards[selectedGameId] || [];

  // Filter overall
  const filteredOverall = overallLeaderboard.filter(entry => {
    if (scopeFilter === 'friends') {
      return entry.isFriend || entry.isUser;
    }
    return true;
  });

  // Filter game-specific
  const filteredGameRankings = currentGameRankings.filter(entry => {
    if (scopeFilter === 'friends') {
      return entry.isFriend || entry.isUser;
    }
    return true;
  });

  return (
    <div className="space-y-4 px-4 pb-20 pt-2">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-[#F5F7FA] font-display">
          Ranked & Leaderboards
        </h2>
        <div className="text-xs text-[#9AA4B2]">
          Ember Convergence Season 1 · 18 Days Remaining
        </div>
      </div>

      {/* Major Category Switcher (A. Overall XP vs B. Individual Game Skill Rating) */}
      <div className="flex items-center gap-1 p-1 bg-[#151B23] rounded-2xl border border-[#28313D]">
        <button
          onClick={() => { playSound.tab(); setMajorTab('overall'); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${
            majorTab === 'overall' ? 'bg-[#FF4D36] text-white shadow-sm' : 'text-[#9AA4B2] hover:text-[#F5F7FA]'
          }`}
        >
          Overall Arcade XP
        </button>
        <button
          onClick={() => { playSound.tab(); setMajorTab('game_specific'); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${
            majorTab === 'game_specific' ? 'bg-[#FF4D36] text-white shadow-sm' : 'text-[#9AA4B2] hover:text-[#F5F7FA]'
          }`}
        >
          Individual Game Skill
        </button>
      </div>

      {/* Sub Filter: Global vs Friends vs Seasonal */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-0.5 bg-[#0B0F14] rounded-xl border border-[#28313D]">
          <button
            onClick={() => { playSound.tab(); setScopeFilter('global'); }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              scopeFilter === 'global' ? 'bg-[#151B23] text-[#F5F7FA] border border-[#28313D]' : 'text-[#9AA4B2]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Global</span>
          </button>
          <button
            onClick={() => { playSound.tab(); setScopeFilter('friends'); }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              scopeFilter === 'friends' ? 'bg-[#151B23] text-[#F5F7FA] border border-[#28313D]' : 'text-[#9AA4B2]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Friends</span>
          </button>
          <button
            onClick={() => { playSound.tab(); setScopeFilter('seasonal'); }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              scopeFilter === 'seasonal' ? 'bg-[#151B23] text-[#F5F7FA] border border-[#28313D]' : 'text-[#9AA4B2]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Seasonal</span>
          </button>
        </div>

        {/* If Game Specific, Game Picker */}
        {majorTab === 'game_specific' && (
          <div className="relative">
            <select
              value={selectedGameId}
              onChange={(e) => {
                playSound.tab();
                setSelectedGameId(e.target.value);
              }}
              className="bg-[#151B23] border border-[#28313D] text-xs font-bold text-[#F5F7FA] rounded-xl px-2.5 py-1.5 outline-none focus:border-[#FF4D36]"
            >
              {games.map(g => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* CATEGORY A: OVERALL ARCADE LEADERBOARD */}
      {majorTab === 'overall' && (
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-[#151B23] border border-[#28313D] flex items-center justify-between text-xs">
            <span className="text-[#9AA4B2]">Overall Leaderboard tracks cumulative Arcade XP earned across all titles.</span>
          </div>

          {/* Table Header */}
          <div className="flex items-center justify-between text-[11px] text-[#9AA4B2] font-mono uppercase px-3">
            <span>Rank · Player</span>
            <span>Level · Arcade XP</span>
          </div>

          {/* List */}
          <div className="divide-y divide-[#28313D]/60 bg-[#151B23] border border-[#28313D] rounded-2xl overflow-hidden">
            {filteredOverall.map(entry => (
              <div
                key={entry.id}
                className={`p-3 flex items-center justify-between transition-colors ${
                  entry.isUser ? 'bg-[#FF4D36]/15 border-l-2 border-[#FF4D36]' : 'hover:bg-[#1a212b]'
                }`}
              >
                {/* Left: Rank & Player info */}
                <div className="flex items-center gap-3">
                  <span className={`w-6 font-mono font-bold text-center ${
                    entry.rank === 1 ? 'text-amber-400 text-sm' :
                    entry.rank === 2 ? 'text-slate-300 text-sm' :
                    entry.rank === 3 ? 'text-amber-600 text-sm' : 'text-[#9AA4B2] text-xs'
                  }`}>
                    #{entry.rank}
                  </span>

                  <div className="w-10 h-10 rounded-xl bg-[#0B0F14] border border-[#28313D] flex items-center justify-center font-bold text-sm text-white shrink-0">
                    {entry.name.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className={`text-xs font-bold ${entry.isUser ? 'text-[#FF4D36]' : 'text-[#F5F7FA]'}`}>
                        {entry.name}
                      </h4>
                      {entry.isFriend && (
                        <span className="text-[9px] px-1 rounded bg-[#00D9A6]/20 text-[#00D9A6] border border-[#00D9A6]/30">
                          Friend
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#9AA4B2] font-mono">{entry.tag}</div>
                  </div>
                </div>

                {/* Right: Level & XP */}
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-[#F5F7FA]">
                    {entry.arcadeXP.toLocaleString()} XP
                  </div>
                  <div className="text-[10px] text-[#FF9E2C] font-mono">
                    Lv.{entry.level}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CATEGORY B: INDIVIDUAL GAME LEADERBOARDS (Separate skill rating per game!) */}
      {majorTab === 'game_specific' && (
        <div className="space-y-3">
          {/* Game Banner Header */}
          <div className="p-3.5 rounded-2xl bg-[#151B23] border border-[#28313D] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img src={selectedGame.image} alt={selectedGame.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-[#F5F7FA] font-display truncate">{selectedGame.title}</h3>
                <div className="text-[11px] text-[#00D9A6] font-mono">Separate Competitive ELO Rating</div>
              </div>
            </div>

            <button
              onClick={() => onPlayGame(selectedGame)}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF4D36] text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-transform shrink-0"
            >
              <span>Play</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Table Header */}
          <div className="flex items-center justify-between text-[11px] text-[#9AA4B2] font-mono uppercase px-3">
            <span>Rank · Player</span>
            <span>Rating · W/L · Win%</span>
          </div>

          {/* List */}
          <div className="divide-y divide-[#28313D]/60 bg-[#151B23] border border-[#28313D] rounded-2xl overflow-hidden">
            {filteredGameRankings.map(entry => (
              <div
                key={entry.id}
                className={`p-3 flex items-center justify-between transition-colors ${
                  entry.isUser ? 'bg-[#FF4D36]/15 border-l-2 border-[#FF4D36]' : 'hover:bg-[#1a212b]'
                }`}
              >
                {/* Left */}
                <div className="flex items-center gap-3">
                  <span className={`w-6 font-mono font-bold text-center ${
                    entry.rank === 1 ? 'text-amber-400 text-sm' :
                    entry.rank === 2 ? 'text-slate-300 text-sm' : 'text-[#9AA4B2] text-xs'
                  }`}>
                    #{entry.rank}
                  </span>

                  <div className="w-9 h-9 rounded-xl bg-[#0B0F14] border border-[#28313D] flex items-center justify-center font-bold text-xs text-white shrink-0">
                    {entry.name.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className={`text-xs font-bold ${entry.isUser ? 'text-[#FF4D36]' : 'text-[#F5F7FA]'}`}>
                        {entry.name}
                      </h4>
                      {entry.isFriend && (
                        <span className="text-[9px] px-1 rounded bg-[#00D9A6]/20 text-[#00D9A6]">
                          Friend
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#FF9E2C] font-mono font-medium">{entry.rankTitle}</div>
                  </div>
                </div>

                {/* Right: Skill Rating and Win Rate */}
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-[#F5F7FA]">
                    {entry.skillRating} ELO
                  </div>
                  <div className="text-[10px] text-[#9AA4B2] font-mono">
                    {entry.wins}W / {entry.losses}L · <span className="text-[#00D9A6] font-bold">{entry.winRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

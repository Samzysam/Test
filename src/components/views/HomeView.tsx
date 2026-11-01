import React from 'react';
import { Play, Sparkles, ChevronRight, Zap, Flame, Heart, RotateCcw, Trophy, ArrowRight, Star } from 'lucide-react';
import { GameItem, GameCategory, UserProfile, ChallengeItem, SecondaryScreen } from '../../types.ts';
import { GameCard } from '../GameCard.tsx';
import { playSound } from '../../utils/audio.ts';

interface HomeViewProps {
  games: GameItem[];
  user: UserProfile;
  challenges: ChallengeItem[];
  onSelectGame: (game: GameItem) => void;
  onQuickPlay: (game: GameItem) => void;
  onToggleFavourite: (gameId: string) => void;
  onNavigateTab: (tab: any) => void;
  onOpenSecondary: (screen: SecondaryScreen) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  games,
  user,
  challenges,
  onSelectGame,
  onQuickPlay,
  onToggleFavourite,
  onNavigateTab,
  onOpenSecondary
}) => {
  const featuredGame = games.find(g => g.isFeatured) || games[0];

  // Recently played games mapped
  const recentGamesList = user.recentlyPlayed.map(item => {
    const game = games.find(g => g.id === item.gameId);
    return game ? { game, lastPlayed: item.lastPlayed, highscore: item.highscore } : null;
  }).filter(Boolean) as { game: GameItem; lastPlayed: string; highscore: number }[];

  // Favourite games mapped
  const favouriteGames = games.filter(g => user.favouriteGameIds.includes(g.id));

  // Recommended based on activity (e.g. if played Tactical Board, recommend puzzle/tactical; plus trending)
  const recommendedGames = games.filter(g => g.id !== featuredGame.id).slice(0, 3);

  // Active Daily & Weekly Challenges preview
  const activeDaily = challenges.find(c => c.category === 'daily' && !c.claimed) || challenges.find(c => c.category === 'daily');
  const activeWeekly = challenges.find(c => c.category === 'weekly' && !c.claimed) || challenges.find(c => c.category === 'weekly');

  return (
    <div className="space-y-6 pb-20">
      {/* 1. FEATURED: GAME OF THE WEEK BANNER */}
      <section className="px-4 pt-2">
        <div
          onClick={() => {
            playSound.click();
            onSelectGame(featuredGame);
          }}
          className="relative w-full rounded-3xl overflow-hidden border border-[#28313D] bg-[#151B23] shadow-2xl cursor-pointer group active:scale-[0.99] transition-all"
        >
          {/* Banner Artwork */}
          <div className="relative aspect-[16/9] w-full bg-[#0B0F14] overflow-hidden">
            <img
              src={featuredGame.bannerImage || featuredGame.image}
              alt={featuredGame.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Cinematic Red Ember Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#151B23] via-[#151B23]/40 to-transparent" />

            {/* Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B0F14]/85 backdrop-blur-md border border-[#FF4D36]/40 text-[#FF4D36] text-[11px] font-bold shadow-lg">
              <Flame className="w-3.5 h-3.5 fill-[#FF4D36]" />
              <span>GAME OF THE WEEK</span>
            </div>
          </div>

          {/* Banner Meta */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#F5F7FA] font-display leading-tight">
                {featuredGame.title}
              </h3>
              <p className="text-xs text-[#9AA4B2] mt-1 max-w-md line-clamp-1">
                {featuredGame.tagline}
              </p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-[#9AA4B2] font-mono tabular-nums">
                <span className="text-amber-400 font-semibold">★ {featuredGame.rating}</span>
                <span aria-hidden="true">·</span>
                <span>{featuredGame.playCount} Players</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#00D9A6]">{featuredGame.difficulty}</span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                playSound.click();
                onQuickPlay(featuredGame);
              }}
              className="w-full sm:w-auto h-11 px-6 rounded-xl bg-[#FF4D36] hover:bg-[#ff3820] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D36]/30 active:scale-95 transition-transform shrink-0"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>PLAY NOW</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. RECENTLY PLAYED (With Resume Button) */}
      {recentGamesList.length > 0 && (
        <section className="px-4">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-sm font-bold text-[#F5F7FA] font-display flex items-center gap-1.5 uppercase tracking-wider">
              <RotateCcw className="w-3.5 h-3.5 text-[#FF4D36]" />
              <span>Recently Played</span>
            </h4>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            {recentGamesList.map(item => (
              <GameCard
                key={item.game.id}
                game={item.game}
                layout="resume"
                lastPlayedLabel={item.lastPlayed}
                highscore={item.highscore}
                onSelect={onSelectGame}
                onQuickPlay={onQuickPlay}
                isFavourite={user.favouriteGameIds.includes(item.game.id)}
                onToggleFavourite={onToggleFavourite}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. DAILY & WEEKLY CHALLENGES STRIP */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-sm font-bold text-[#F5F7FA] font-display flex items-center gap-1.5 uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-[#FF9E2C]" />
            <span>Missions & Rewards</span>
          </h4>
          <button
            onClick={() => {
              playSound.click();
              onOpenSecondary('challenges');
            }}
            className="text-xs text-[#FF4D36] hover:underline font-semibold flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Daily Mission Card */}
          {activeDaily && (
            <div
              onClick={() => {
                playSound.click();
                onOpenSecondary('challenges');
              }}
              className="p-3.5 rounded-2xl bg-[#151B23] border border-[#28313D] hover:border-[#FF4D36]/40 cursor-pointer transition-colors flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#FF9E2C] uppercase tracking-wider">
                    Daily Mission · {activeDaily.expiresIn}
                  </span>
                  <h5 className="text-xs font-bold text-[#F5F7FA] mt-0.5">{activeDaily.title}</h5>
                  <p className="text-[11px] text-[#9AA4B2] line-clamp-1 mt-0.5">{activeDaily.description}</p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="text-[11px] font-mono font-bold text-[#00D9A6]">+{activeDaily.rewardXP} XP</div>
                  <div className="text-[10px] font-mono font-bold text-[#FF9E2C]">+{activeDaily.rewardCoins} Coins</div>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-[10px] text-[#9AA4B2] font-mono tabular-nums">
                  <span>Progress</span>
                  <span>{activeDaily.progress} / {activeDaily.target}</span>
                </div>
                <div className="h-1.5 w-full bg-[#0B0F14] rounded-full overflow-hidden border border-[#28313D]">
                  <div
                    className="h-full bg-[#FF4D36]"
                    style={{ width: `${Math.min(100, (activeDaily.progress / activeDaily.target) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Weekly Challenge Card */}
          {activeWeekly && (
            <div
              onClick={() => {
                playSound.click();
                onOpenSecondary('challenges');
              }}
              className="p-3.5 rounded-2xl bg-[#151B23] border border-[#28313D] hover:border-[#FF4D36]/40 cursor-pointer transition-colors flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#FF4D36] uppercase tracking-wider">
                    Weekly Challenge · {activeWeekly.expiresIn}
                  </span>
                  <h5 className="text-xs font-bold text-[#F5F7FA] mt-0.5">{activeWeekly.title}</h5>
                  <p className="text-[11px] text-[#9AA4B2] line-clamp-1 mt-0.5">{activeWeekly.description}</p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="text-[11px] font-mono font-bold text-[#00D9A6]">+{activeWeekly.rewardXP} XP</div>
                  <div className="text-[10px] font-mono font-bold text-[#FF9E2C]">+{activeWeekly.rewardCoins} Coins</div>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-[10px] text-[#9AA4B2] font-mono tabular-nums">
                  <span>Progress</span>
                  <span>{activeWeekly.progress} / {activeWeekly.target}</span>
                </div>
                <div className="h-1.5 w-full bg-[#0B0F14] rounded-full overflow-hidden border border-[#28313D]">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF4D36] to-[#FF9E2C]"
                    style={{ width: `${Math.min(100, (activeWeekly.progress / activeWeekly.target) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. FAVOURITE GAMES */}
      {favouriteGames.length > 0 && (
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-[#F5F7FA] font-display flex items-center gap-1.5 uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 text-[#FF4D36] fill-[#FF4D36]" />
              <span>Your Favourites ({favouriteGames.length})</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {favouriteGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                isFavourite={true}
                onSelect={onSelectGame}
                onQuickPlay={onQuickPlay}
                onToggleFavourite={onToggleFavourite}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. GAME RECOMMENDATIONS (Based on Player Activity) */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-base font-bold text-[#F5F7FA] font-display">
              Recommended for You
            </h4>
            <div className="text-xs text-[#9AA4B2]">
              Curated from your high win-rate in Tactical Matrix and Runner games
            </div>
          </div>
          <button
            onClick={() => {
              playSound.tab();
              onNavigateTab('arcade');
            }}
            className="text-xs text-[#FF4D36] hover:underline font-semibold"
          >
            Catalog
          </button>
        </div>

        <div className="space-y-2.5">
          {recommendedGames.map(game => (
            <GameCard
              key={game.id}
              game={game}
              layout="horizontal"
              isFavourite={user.favouriteGameIds.includes(game.id)}
              onSelect={onSelectGame}
              onQuickPlay={onQuickPlay}
              onToggleFavourite={onToggleFavourite}
            />
          ))}
        </div>
      </section>

      {/* 6. ARCADE PLUS PROMO BANNER */}
      <section className="px-4">
        <div
          onClick={() => {
            playSound.click();
            onOpenSecondary('arcade_plus');
          }}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#1C2330] via-[#151B23] to-[#1a151b] border border-[#FF4D36]/30 hover:border-[#FF4D36]/60 cursor-pointer transition-all shadow-xl flex items-center justify-between gap-4 group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF9E2C]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ARCADE PLUS SUBSCRIPTION</span>
            </div>
            <h4 className="text-base font-bold text-[#F5F7FA] font-display">
              Elevate Your Gaming Identity
            </h4>
            <p className="text-xs text-[#9AA4B2] max-w-sm">
              Exclusive Phoenix cosmetic sets, advanced match telemetry, animated profile frames and zero ads.
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-2xl bg-[#FF4D36] text-white shadow-lg shadow-[#FF4D36]/30 group-hover:scale-105 transition-transform">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </section>
    </div>
  );
};

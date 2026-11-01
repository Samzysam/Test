import React, { useState, useMemo } from 'react';
import { GameItem, GameCategory } from '../../types.ts';
import { GameCard } from '../GameCard.tsx';
import { Filter, SlidersHorizontal, Star } from 'lucide-react';
import { playSound } from '../../utils/audio.ts';

interface ArcadeCatalogViewProps {
  games: GameItem[];
  favouriteGameIds: string[];
  onSelectGame: (game: GameItem) => void;
  onQuickPlay: (game: GameItem) => void;
  onToggleFavourite: (gameId: string) => void;
}

export const ArcadeCatalogView: React.FC<ArcadeCatalogViewProps> = ({
  games,
  favouriteGameIds,
  onSelectGame,
  onQuickPlay,
  onToggleFavourite
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'az'>('popular');

  const categories: { id: GameCategory; label: string }[] = [
    { id: 'all', label: 'All Games' },
    { id: 'arcade', label: 'Arcade' },
    { id: 'puzzle', label: 'Puzzle' },
    { id: 'board', label: 'Board' },
    { id: 'casual', label: 'Casual' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'multiplayer', label: '2P / Party' }
  ];

  const processedGames = useMemo(() => {
    let list = games.filter(g => {
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'multiplayer') return g.isMultiplayerReady;
      return g.category === selectedCategory;
    });

    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'az') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [games, selectedCategory, sortBy]);

  return (
    <div className="space-y-4 px-4 pb-20 pt-2">
      {/* Title & Filter Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#F5F7FA] font-display">
            Arcade Catalog
          </h2>
          <div className="text-xs text-[#9AA4B2] font-mono tabular-nums">
            {processedGames.length} Titles Ready to Launch
          </div>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1.5 bg-[#151B23] border border-[#28313D] rounded-xl px-2.5 py-1 text-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF4D36]" />
          <select
            value={sortBy}
            onChange={(e) => {
              playSound.tab();
              setSortBy(e.target.value as any);
            }}
            className="bg-transparent text-xs text-[#F5F7FA] outline-none"
          >
            <option value="popular" className="bg-[#151B23]">Popularity</option>
            <option value="rating" className="bg-[#151B23]">Top Rated</option>
            <option value="az" className="bg-[#151B23]">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              playSound.tab();
              setSelectedCategory(cat.id);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#FF4D36] text-white shadow-md shadow-[#FF4D36]/20'
                : 'bg-[#151B23] border border-[#28313D] text-[#9AA4B2] hover:text-[#F5F7FA]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Games */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {processedGames.map(game => (
          <GameCard
            key={game.id}
            game={game}
            isFavourite={favouriteGameIds.includes(game.id)}
            onSelect={onSelectGame}
            onQuickPlay={onQuickPlay}
            onToggleFavourite={onToggleFavourite}
          />
        ))}
      </div>
    </div>
  );
};

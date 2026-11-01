import React, { useState, useMemo } from 'react';
import { Search, X, Play, Star } from 'lucide-react';
import { GameItem, GameCategory } from '../types.ts';
import { playSound } from '../utils/audio.ts';

interface SearchModalProps {
  games: GameItem[];
  onClose: () => void;
  onSelectGame: (game: GameItem) => void;
  onQuickPlay: (game: GameItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  games,
  onClose,
  onSelectGame,
  onQuickPlay
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');

  const categories: { id: GameCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'arcade', label: 'Arcade' },
    { id: 'puzzle', label: 'Puzzle' },
    { id: 'board', label: 'Board' },
    { id: 'casual', label: 'Casual' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'multiplayer', label: 'Multiplayer' }
  ];

  const filteredGames = useMemo(() => {
    return games.filter(g => {
      const matchesCategory = selectedCategory === 'all' || g.category === selectedCategory || (selectedCategory === 'multiplayer' && g.isMultiplayerReady);
      const matchesQuery = query.trim() === '' ||
        g.title.toLowerCase().includes(query.toLowerCase()) ||
        g.tagline.toLowerCase().includes(query.toLowerCase()) ||
        g.description.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [games, query, selectedCategory]);

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#151B23] border border-[#28313D] rounded-2xl sm:rounded-3xl p-4 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Search Input Box */}
        <div className="relative flex items-center mb-3">
          <Search className="absolute left-3.5 w-4 h-4 text-[#9AA4B2]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search arcade titles, puzzles, boards..."
            className="w-full h-11 pl-10 pr-10 bg-[#0B0F14] border border-[#28313D] focus:border-[#FF4D36] rounded-xl text-sm text-[#F5F7FA] placeholder-[#9AA4B2] outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="absolute right-2.5 w-7 h-7 rounded-lg bg-[#151B23] border border-[#28313D] flex items-center justify-center text-[#9AA4B2] hover:text-[#F5F7FA]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                playSound.tab();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#FF4D36] text-white shadow-sm'
                  : 'bg-[#0B0F14] border border-[#28313D] text-[#9AA4B2] hover:text-[#F5F7FA]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Result List */}
        <div className="flex-1 overflow-y-auto space-y-2 divide-y divide-[#28313D]/40">
          {filteredGames.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#9AA4B2]">
              No arcade games found matching &quot;{query}&quot;. Try exploring other categories.
            </div>
          ) : (
            filteredGames.map(game => (
              <div
                key={game.id}
                onClick={() => {
                  playSound.click();
                  onSelectGame(game);
                }}
                className="pt-2 flex items-center gap-3 cursor-pointer group hover:bg-[#0B0F14]/50 p-2 rounded-xl transition-colors"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#0B0F14] shrink-0 border border-[#28313D]">
                  <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#F5F7FA] truncate group-hover:text-[#FF4D36] transition-colors">
                    {game.title}
                  </h4>
                  <p className="text-[11px] text-[#9AA4B2] truncate mt-0.5">{game.tagline}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-[#9AA4B2] font-mono">
                    <span className="flex items-center gap-0.5 text-amber-400">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      {game.rating}
                    </span>
                    <span>·</span>
                    <span>{game.playCount}</span>
                    <span>·</span>
                    <span className="capitalize text-[#00D9A6]">{game.category}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playSound.click();
                    onQuickPlay(game);
                  }}
                  className="w-8 h-8 rounded-lg bg-[#FF4D36] text-white flex items-center justify-center shrink-0 active:scale-95"
                  aria-label={`Play ${game.title}`}
                >
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

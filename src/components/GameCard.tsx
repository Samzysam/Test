import React from 'react';
import { Play, Star, Heart, RotateCcw } from 'lucide-react';
import { GameItem } from '../types.ts';
import { playSound } from '../utils/audio.ts';

interface GameCardProps {
  game: GameItem;
  isFavourite?: boolean;
  onSelect: (game: GameItem) => void;
  onQuickPlay: (game: GameItem) => void;
  onToggleFavourite?: (gameId: string) => void;
  layout?: 'standard' | 'compact' | 'horizontal' | 'resume';
  lastPlayedLabel?: string;
  highscore?: number;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavourite = false,
  onSelect,
  onQuickPlay,
  onToggleFavourite,
  layout = 'standard',
  lastPlayedLabel,
  highscore
}) => {
  // Resume card layout for Recently Played
  if (layout === 'resume') {
    return (
      <div
        onClick={() => {
          playSound.click();
          onSelect(game);
        }}
        className="w-72 shrink-0 bg-[#151B23] hover:bg-[#1b232e] border border-[#28313D] hover:border-[#FF4D36]/40 rounded-2xl p-3 flex flex-col justify-between cursor-pointer active:scale-[0.99] transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#0B0F14] border border-[#28313D]">
            <img
              src={game.image}
              alt={game.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-[#F5F7FA] font-display truncate">
              {game.title}
            </h4>
            <div className="text-[11px] text-[#9AA4B2] mt-0.5">
              {lastPlayedLabel || 'Recently played'}
            </div>
            {highscore !== undefined && (
              <div className="text-[10px] text-[#FF9E2C] font-mono mt-1 font-semibold">
                Highscore: {highscore.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#28313D]/70 flex items-center justify-between">
          <span className="text-[11px] text-[#00D9A6] font-mono font-medium">
            Ready to Resume
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              playSound.click();
              onQuickPlay(game);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#FF4D36] hover:bg-[#ff3820] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#FF4D36]/25 active:scale-95 transition-transform"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resume</span>
          </button>
        </div>
      </div>
    );
  }

  // Horizontal list row layout
  if (layout === 'horizontal') {
    return (
      <div
        onClick={() => {
          playSound.click();
          onSelect(game);
        }}
        className="w-full bg-[#151B23] hover:bg-[#1b232e] border border-[#28313D] hover:border-[#FF4D36]/40 rounded-2xl p-3 flex items-center gap-3.5 cursor-pointer active:scale-[0.99] transition-all group"
      >
        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#0B0F14] border border-[#28313D]/60">
          <img
            src={game.image}
            alt={game.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#F5F7FA] font-display truncate leading-snug">
              {game.title}
            </h4>
            {onToggleFavourite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSound.tab();
                  onToggleFavourite(game.id);
                }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9AA4B2] hover:text-[#FF4D36] active:scale-90 transition-all"
                title={isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
              >
                <Heart className={`w-4 h-4 ${isFavourite ? 'fill-[#FF4D36] text-[#FF4D36]' : ''}`} />
              </button>
            )}
          </div>
          <p className="text-xs text-[#9AA4B2] line-clamp-1 mt-0.5">
            {game.tagline}
          </p>

          <div className="flex items-center gap-2 mt-2 text-[11px] text-[#9AA4B2] font-mono tabular-nums">
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {game.rating}
            </span>
            <span aria-hidden="true">·</span>
            <span>{game.playCount} plays</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#00D9A6]">{game.playerCountLabel}</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            playSound.click();
            onQuickPlay(game);
          }}
          className="w-10 h-10 rounded-xl bg-[#FF4D36] hover:bg-[#ff3820] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#FF4D36]/25 active:scale-90 transition-transform ml-1"
          aria-label={`Play ${game.title}`}
        >
          <Play className="w-4 h-4 fill-white ml-0.5" />
        </button>
      </div>
    );
  }

  // Standard Card Layout
  return (
    <div
      onClick={() => {
        playSound.click();
        onSelect(game);
      }}
      className="bg-[#151B23] hover:bg-[#1a212b] border border-[#28313D] hover:border-[#FF4D36]/50 rounded-2xl overflow-hidden flex flex-col cursor-pointer active:scale-[0.99] transition-all group"
    >
      {/* Artwork Container */}
      <div className="relative aspect-[4/3] w-full bg-[#0B0F14] overflow-hidden">
        <img
          src={game.image}
          alt={game.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Subtle gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#151B23] via-transparent to-transparent opacity-85" />

        {/* Favourite Button in Corner */}
        {onToggleFavourite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              playSound.tab();
              onToggleFavourite(game.id);
            }}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-xl bg-[#0B0F14]/70 backdrop-blur-md border border-[#28313D] flex items-center justify-center text-[#9AA4B2] hover:text-[#FF4D36] active:scale-90 transition-all z-10"
            title={isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
          >
            <Heart className={`w-4 h-4 ${isFavourite ? 'fill-[#FF4D36] text-[#FF4D36]' : ''}`} />
          </button>
        )}

        {/* Quick Launch Floating CTA */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playSound.click();
            onQuickPlay(game);
          }}
          className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-[#FF4D36] hover:bg-[#ff3820] text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-[#FF4D36]/30 active:scale-95 transition-transform"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          Play
        </button>
      </div>

      {/* Content Meta */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <h4 className="text-sm font-bold text-[#F5F7FA] font-display line-clamp-1 leading-snug">
            {game.title}
          </h4>
          <p className="text-xs text-[#9AA4B2] line-clamp-1 mt-1">
            {game.tagline}
          </p>
        </div>

        {/* Zero-Pill Unboxed Clean Metadata */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#28313D]/60 text-[11px] text-[#9AA4B2] font-mono tabular-nums">
          <span className="flex items-center gap-1 text-amber-400 font-medium">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {game.rating}
          </span>
          <span aria-hidden="true">·</span>
          <span>{game.playCount} plays</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#00D9A6] truncate">{game.playerCountLabel}</span>
        </div>
      </div>
    </div>
  );
};

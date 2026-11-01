import React from 'react';
import { Search, Bell, ShoppingBag, Flame, Smartphone, Monitor, Coins } from 'lucide-react';
import { NavTab, UserProfile, SecondaryScreen } from '../types.ts';
import { playSound } from '../utils/audio.ts';

interface HeaderProps {
  user: UserProfile;
  unreadCount: number;
  unclaimedChallengesCount: number;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenSecondary: (screen: SecondaryScreen) => void;
  onNavigateTab: (tab: NavTab) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  unreadCount,
  unclaimedChallengesCount,
  onOpenSearch,
  onOpenNotifications,
  onOpenSecondary,
  onNavigateTab,
  isMobileFrame,
  onToggleMobileFrame
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0F14]/90 backdrop-blur-md border-b border-[#28313D] px-4 py-2.5 flex items-center justify-between">
      {/* Brand Zone */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            playSound.tab();
            onNavigateTab('home');
          }}
          className="flex items-center gap-2 text-left group"
        >
          {/* Red Ember Flame Icon */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF4D36] via-[#FF6B4A] to-[#FF9E2C] p-0.5 shadow-md shadow-[#FF4D36]/25 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0B0F14] rounded-[10px] flex items-center justify-center">
              <Flame className="w-4 h-4 text-[#FF4D36] fill-[#FF4D36]" />
            </div>
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-[#F5F7FA] font-display">
              NovaArcade
            </span>
          </div>
        </button>
      </div>

      {/* Middle Currency & Action shortcuts */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Arcade Coins Pill */}
        <button
          onClick={() => {
            playSound.click();
            onOpenSecondary('store');
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#151B23] border border-[#28313D] hover:border-[#FF9E2C]/50 active:scale-95 transition-all text-xs font-mono font-bold text-[#FF9E2C]"
          title="Open Arcade Store"
        >
          <Coins className="w-3.5 h-3.5 fill-[#FF9E2C] text-[#FF9E2C]" />
          <span>{user.arcadeCoins.toLocaleString()}</span>
        </button>

        {/* Challenges Shortcut */}
        <button
          onClick={() => {
            playSound.click();
            onOpenSecondary('challenges');
          }}
          aria-label="Challenges"
          className="relative w-8 h-8 rounded-xl bg-[#151B23] border border-[#28313D] hover:border-[#FF4D36]/50 flex items-center justify-center text-[#9AA4B2] hover:text-[#F5F7FA] active:scale-95 transition-all"
          title="Daily & Weekly Missions"
        >
          <Flame className="w-4 h-4 text-[#FF4D36]" />
          {unclaimedChallengesCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00D9A6] ring-2 ring-[#0B0F14]" />
          )}
        </button>

        {/* Store Shortcut */}
        <button
          onClick={() => {
            playSound.click();
            onOpenSecondary('store');
          }}
          aria-label="Arcade Store"
          className="w-8 h-8 rounded-xl bg-[#151B23] border border-[#28313D] hover:border-[#FF4D36]/50 flex items-center justify-center text-[#9AA4B2] hover:text-[#F5F7FA] active:scale-95 transition-all"
          title="Arcade Store"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>

        {/* Search Trigger */}
        <button
          onClick={() => {
            playSound.click();
            onOpenSearch();
          }}
          aria-label="Search Games"
          className="w-8 h-8 rounded-xl bg-[#151B23] border border-[#28313D] hover:border-[#FF4D36]/50 flex items-center justify-center text-[#9AA4B2] hover:text-[#F5F7FA] active:scale-95 transition-all"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Trigger */}
        <button
          onClick={() => {
            playSound.click();
            onOpenNotifications();
          }}
          aria-label="Notifications"
          className="relative w-8 h-8 rounded-xl bg-[#151B23] border border-[#28313D] hover:border-[#FF4D36]/50 flex items-center justify-center text-[#9AA4B2] hover:text-[#F5F7FA] active:scale-95 transition-all"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FF4D36] text-[9px] font-bold text-white flex items-center justify-center font-mono">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Viewport Frame Toggle (for desktop screen testing) */}
        <button
          onClick={() => {
            playSound.click();
            onToggleMobileFrame();
          }}
          title={isMobileFrame ? 'Expand to Full Viewport' : 'Switch to Mobile Phone Frame'}
          className="hidden sm:flex items-center justify-center w-8 h-8 rounded-xl bg-[#151B23] border border-[#28313D] hover:border-[#FF4D36]/50 text-[#9AA4B2] hover:text-[#F5F7FA] transition-colors"
        >
          {isMobileFrame ? <Monitor className="w-4 h-4 text-[#FF4D36]" /> : <Smartphone className="w-4 h-4 text-[#00D9A6]" />}
        </button>

        {/* Profile Avatar Trigger */}
        <button
          onClick={() => {
            playSound.tab();
            onNavigateTab('profile');
          }}
          aria-label="User Profile"
          className="flex items-center gap-1.5 pl-1 pr-1.5 py-0.5 rounded-xl bg-[#151B23] border border-[#28313D] hover:border-[#FF4D36]/60 active:scale-95 transition-all ml-0.5"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF4D36] to-[#FF9E2C] flex items-center justify-center text-xs font-bold text-white shadow-sm">
            {user.name.charAt(0)}
          </div>
          <span className="text-[11px] font-mono font-bold text-[#FF9E2C] tabular-nums">
            Lv.{user.level}
          </span>
        </button>
      </div>
    </header>
  );
};

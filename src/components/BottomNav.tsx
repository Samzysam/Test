import React from 'react';
import { Home, Gamepad2, Award, Users, User } from 'lucide-react';
import { NavTab } from '../types.ts';
import { playSound } from '../utils/audio.ts';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadFriendsCount?: number;
  unclaimedQuestsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  unreadFriendsCount = 0,
  unclaimedQuestsCount = 0
}) => {
  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badgeCount?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'arcade', label: 'Arcade', icon: Gamepad2 },
    { id: 'ranked', label: 'Ranked', icon: Award },
    { id: 'friends', label: 'Friends', icon: Users, badgeCount: unreadFriendsCount },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#151B23]/95 backdrop-blur-lg border-t border-[#28313D] max-w-full">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 px-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                playSound.tab();
                onSelectTab(tab.id);
              }}
              className="relative flex flex-col items-center justify-center min-h-[48px] touch-manipulation group"
            >
              {/* Active Ember Indicator Dot */}
              {isActive && (
                <div className="absolute top-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4D36] shadow-[0_0_8px_#FF4D36]" />
              )}

              <div className="relative mt-1">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'text-[#FF4D36] scale-110' : 'text-[#9AA4B2] group-hover:text-[#F5F7FA]'
                  }`}
                />
                {tab.badgeCount && tab.badgeCount > 0 ? (
                  <span className="absolute -top-1 -right-2 min-w-[14px] h-3.5 px-1 rounded-full bg-[#FF4D36] text-[9px] font-bold text-white flex items-center justify-center font-mono">
                    {tab.badgeCount}
                  </span>
                ) : null}
              </div>

              <span
                className={`text-[10px] font-medium tracking-tight mt-1 whitespace-nowrap transition-colors ${
                  isActive ? 'text-[#F5F7FA] font-bold' : 'text-[#9AA4B2]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

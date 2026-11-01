import React from 'react';
import { X, Bell, Trophy, Zap, Check, CheckCheck, Swords, UserPlus } from 'lucide-react';
import { NotificationItem } from '../types.ts';
import { playSound } from '../utils/audio.ts';

interface NotificationsModalProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onNavigateToFriends: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onClose,
  onMarkAllAsRead,
  onNavigateToFriends
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#151B23] border border-[#28313D] rounded-2xl sm:rounded-3xl p-4 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#28313D]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FF4D36]" />
            <h3 className="text-sm font-bold text-[#F5F7FA] font-display">Notifications & Game Invites</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSound.tab();
                onMarkAllAsRead();
              }}
              className="text-[11px] text-[#00D9A6] hover:underline font-medium"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              aria-label="Close notifications"
              className="w-7 h-7 rounded-lg bg-[#0B0F14] border border-[#28313D] flex items-center justify-center text-[#9AA4B2] hover:text-[#F5F7FA]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#28313D]/60 mt-2">
          {notifications.map(item => (
            <div
              key={item.id}
              onClick={() => {
                if (item.type === 'friend_request' || item.type === 'game_invite') {
                  onClose();
                  onNavigateToFriends();
                }
              }}
              className={`py-3 px-1 flex items-start gap-3 transition-colors cursor-pointer rounded-xl hover:bg-[#0B0F14]/40 ${
                !item.read ? 'bg-[#FF4D36]/5' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  item.type === 'game_invite'
                    ? 'bg-[#FF4D36]/20 text-[#FF4D36]'
                    : item.type === 'friend_request'
                    ? 'bg-[#FF9E2C]/20 text-[#FF9E2C]'
                    : 'bg-[#00D9A6]/20 text-[#00D9A6]'
                }`}
              >
                {item.type === 'game_invite' ? (
                  <Swords className="w-4 h-4" />
                ) : item.type === 'friend_request' ? (
                  <UserPlus className="w-4 h-4" />
                ) : (
                  <Trophy className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#F5F7FA] truncate">{item.title}</h4>
                  <span className="text-[10px] text-[#9AA4B2] font-mono shrink-0">{item.time}</span>
                </div>
                <p className="text-[11px] text-[#9AA4B2] mt-0.5 leading-relaxed">
                  {item.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Search, UserPlus, Check, X, Users, Swords, MoreVertical, ShieldAlert, UserMinus, Gamepad2, Trophy, Clock, CheckCircle2 } from 'lucide-react';
import { Friend, FriendRequest, GameItem } from '../../types.ts';
import { playSound } from '../../utils/audio.ts';

interface FriendsViewProps {
  friends: Friend[];
  requests: FriendRequest[];
  games: GameItem[];
  onAcceptRequest: (reqId: string) => void;
  onDeclineRequest: (reqId: string) => void;
  onSendRequest: (targetTag: string) => boolean;
  onRemoveFriend: (friendId: string) => void;
  onBlockFriend: (friendId: string) => void;
  onInviteToGame: (friend: Friend, game: GameItem) => void;
}

export const FriendsView: React.FC<FriendsViewProps> = ({
  friends,
  requests,
  games,
  onAcceptRequest,
  onDeclineRequest,
  onSendRequest,
  onRemoveFriend,
  onBlockFriend,
  onInviteToGame
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'requests'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addPlayerInput, setAddPlayerInput] = useState<string>('');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [selectedFriendForDetails, setSelectedFriendForDetails] = useState<Friend | null>(null);
  const [inviteFriendTarget, setInviteFriendTarget] = useState<Friend | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addPlayerInput.trim()) return;
    const success = onSendRequest(addPlayerInput.trim());
    if (success) {
      playSound.victory();
      showToast(`Friend request sent to ${addPlayerInput}!`);
      setAddPlayerInput('');
    } else {
      playSound.tab();
      showToast(`User ${addPlayerInput} is already a friend or has pending request.`);
    }
  };

  const filteredFriends = friends.filter(f => !f.isBlocked && (
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.playerId.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  const onlineFriends = filteredFriends.filter(f => f.status === 'online' || f.status === 'ingame');
  const offlineFriends = filteredFriends.filter(f => f.status === 'offline');

  return (
    <div className="space-y-4 px-4 pb-20 pt-2">
      {/* Title & Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#F5F7FA] font-display">
            Friends & Rivals
          </h2>
          <div className="text-xs text-[#9AA4B2] font-mono">
            {friends.filter(f => f.status !== 'offline').length} Friends Online · {friends.length} Total
          </div>
        </div>

        {/* Requests pill if pending */}
        {requests.length > 0 && (
          <button
            onClick={() => setActiveTab('requests')}
            className="px-2.5 py-1 rounded-xl bg-[#FF4D36]/20 border border-[#FF4D36]/40 text-xs font-bold text-[#FF4D36] flex items-center gap-1.5 active:scale-95"
          >
            <span>{requests.length} Pending</span>
          </button>
        )}
      </div>

      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="p-3 rounded-2xl bg-[#00D9A6]/15 border border-[#00D9A6]/40 text-xs font-bold text-[#00D9A6] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#151B23] rounded-2xl border border-[#28313D]">
        <button
          onClick={() => { playSound.tab(); setActiveTab('all'); }}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'all' ? 'bg-[#FF4D36] text-white shadow-sm' : 'text-[#9AA4B2] hover:text-[#F5F7FA]'
          }`}
        >
          All Friends ({friends.length})
        </button>
        <button
          onClick={() => { playSound.tab(); setActiveTab('requests'); }}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'requests' ? 'bg-[#FF4D36] text-white shadow-sm' : 'text-[#9AA4B2] hover:text-[#F5F7FA]'
          }`}
        >
          Friend Requests ({requests.length})
        </button>
      </div>

      {/* Add Friend Input Bar */}
      <form onSubmit={handleAddPlayer} className="flex gap-2">
        <div className="relative flex-1">
          <UserPlus className="absolute left-3.5 top-3 w-4 h-4 text-[#9AA4B2]" />
          <input
            type="text"
            value={addPlayerInput}
            onChange={(e) => setAddPlayerInput(e.target.value)}
            placeholder="Add by gamer tag (e.g. @EchoStrike)"
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#151B23] border border-[#28313D] focus:border-[#FF4D36] text-xs text-[#F5F7FA] placeholder-[#9AA4B2] outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={!addPlayerInput.trim()}
          className="px-4 h-10 rounded-xl bg-[#FF4D36] disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1 shrink-0 active:scale-95 transition-transform"
        >
          <span>Send</span>
        </button>
      </form>

      {/* Search Friends Filter */}
      {activeTab === 'all' && (
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#9AA4B2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter friends list..."
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#0B0F14] border border-[#28313D] text-xs text-[#F5F7FA] placeholder-[#9AA4B2] outline-none"
          />
        </div>
      )}

      {/* TAB 1: FRIENDS LIST */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          {/* Online & In-Game Group */}
          <div>
            <div className="text-[11px] font-bold text-[#00D9A6] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00D9A6] animate-pulse" />
              <span>Online & In-Game ({onlineFriends.length})</span>
            </div>

            {onlineFriends.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#151B23]/50 border border-[#28313D] text-center text-xs text-[#9AA4B2]">
                No friends currently online. Send requests or invite nearby gamers!
              </div>
            ) : (
              <div className="space-y-2">
                {onlineFriends.map(friend => (
                  <div
                    key={friend.id}
                    className="p-3 rounded-2xl bg-[#151B23] border border-[#28313D] hover:border-[#FF4D36]/40 flex items-center justify-between gap-3 transition-colors relative"
                  >
                    {/* Left: Avatar & Tag */}
                    <div
                      onClick={() => setSelectedFriendForDetails(friend)}
                      className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                    >
                      <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-xl bg-[#0B0F14] border border-[#FF4D36]/40 p-0.5 flex items-center justify-center">
                          <div className="w-full h-full bg-[#151B23] rounded-[10px] flex items-center justify-center font-bold text-sm text-white">
                            {friend.name.charAt(0)}
                          </div>
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#151B23] ${
                          friend.status === 'ingame' ? 'bg-[#FF9E2C]' : 'bg-[#00D9A6]'
                        }`} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-[#F5F7FA] truncate">{friend.name}</h4>
                          <span className="text-[10px] font-mono text-[#FF9E2C]">Lv.{friend.level}</span>
                        </div>
                        <div className="text-[11px] text-[#9AA4B2] font-mono truncate">{friend.tag}</div>
                        <div className="text-[10px] text-[#00D9A6] font-medium truncate mt-0.5">
                          {friend.status === 'ingame' ? `Playing: ${friend.currentGame}` : 'Online in Hub'}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setInviteFriendTarget(friend)}
                        className="px-2.5 py-1.5 rounded-xl bg-[#FF4D36] hover:bg-[#ff3820] text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
                      >
                        <Swords className="w-3.5 h-3.5" />
                        <span>Invite</span>
                      </button>

                      {/* Dropdown Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setOpenDropdownId(openDropdownId === friend.id ? null : friend.id)}
                          className="w-8 h-8 rounded-lg bg-[#0B0F14] border border-[#28313D] flex items-center justify-center text-[#9AA4B2] hover:text-[#F5F7FA]"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {openDropdownId === friend.id && (
                          <div className="absolute right-0 top-9 w-40 bg-[#0B0F14] border border-[#28313D] rounded-xl shadow-2xl p-1 z-30 space-y-0.5 animate-in fade-in">
                            <button
                              onClick={() => {
                                setSelectedFriendForDetails(friend);
                                setOpenDropdownId(null);
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-[#F5F7FA] hover:bg-[#151B23]"
                            >
                              View Stats
                            </button>
                            <button
                              onClick={() => {
                                onRemoveFriend(friend.id);
                                setOpenDropdownId(null);
                                showToast(`Removed ${friend.name} from friends.`);
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-rose-400 hover:bg-[#151B23] flex items-center gap-1.5"
                            >
                              <UserMinus className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                            <button
                              onClick={() => {
                                onBlockFriend(friend.id);
                                setOpenDropdownId(null);
                                showToast(`Blocked ${friend.name}.`);
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-[#9AA4B2] hover:bg-[#151B23] flex items-center gap-1.5"
                            >
                              <ShieldAlert className="w-3 h-3" />
                              <span>Block User</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Offline Friends Group */}
          <div>
            <div className="text-[11px] font-bold text-[#9AA4B2] uppercase tracking-wider mb-2">
              Offline ({offlineFriends.length})
            </div>

            <div className="space-y-2">
              {offlineFriends.map(friend => (
                <div
                  key={friend.id}
                  className="p-3 rounded-2xl bg-[#151B23]/70 border border-[#28313D] flex items-center justify-between gap-3 opacity-75"
                >
                  <div
                    onClick={() => setSelectedFriendForDetails(friend)}
                    className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#0B0F14] border border-[#28313D] flex items-center justify-center font-bold text-sm text-[#9AA4B2]">
                      {friend.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-[#F5F7FA] truncate">{friend.name}</h4>
                        <span className="text-[10px] font-mono text-[#9AA4B2]">Lv.{friend.level}</span>
                      </div>
                      <div className="text-[11px] text-[#9AA4B2] font-mono truncate">{friend.tag}</div>
                      <div className="text-[10px] text-[#9AA4B2] mt-0.5">Last active: {friend.lastActive}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedFriendForDetails(friend)}
                    className="px-2.5 py-1.5 rounded-xl bg-[#0B0F14] border border-[#28313D] text-[#9AA4B2] text-xs font-medium"
                  >
                    Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FRIEND REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-3">
          {requests.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#9AA4B2]">
              No pending friend requests. Share your gamer tag with rivals to connect!
            </div>
          ) : (
            requests.map(req => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-[#151B23] border border-[#28313D] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#FF4D36] to-[#FF9E2C] flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {req.fromUser.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#F5F7FA] truncate">{req.fromUser.name}</h4>
                    <div className="text-[11px] text-[#9AA4B2] font-mono">{req.fromUser.tag} · Lv.{req.fromUser.level}</div>
                    <div className="text-[10px] text-[#9AA4B2] mt-0.5">Sent {req.sentAt}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      playSound.victory();
                      onAcceptRequest(req.id);
                      showToast(`Accepted ${req.fromUser.name}'s friend request!`);
                    }}
                    className="w-9 h-9 rounded-xl bg-[#00D9A6] text-[#0B0F14] flex items-center justify-center font-bold active:scale-95 transition-transform"
                    title="Accept Friend Request"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                  <button
                    onClick={() => {
                      playSound.tab();
                      onDeclineRequest(req.id);
                    }}
                    className="w-9 h-9 rounded-xl bg-[#0B0F14] border border-[#28313D] text-[#9AA4B2] hover:text-rose-400 flex items-center justify-center active:scale-95 transition-transform"
                    title="Decline Friend Request"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* FRIEND DETAILS MODAL */}
      {selectedFriendForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#151B23] border border-[#28313D] rounded-3xl p-5 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedFriendForDetails(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-[#0B0F14] border border-[#28313D] flex items-center justify-center text-[#9AA4B2]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Lockup */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#0B0F14] border border-[#FF4D36] flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-[#FF4D36]/20">
                {selectedFriendForDetails.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F5F7FA] font-display">{selectedFriendForDetails.name}</h3>
                <div className="text-xs text-[#9AA4B2] font-mono">{selectedFriendForDetails.tag}</div>
                <div className="text-[11px] text-[#FF9E2C] font-mono font-bold mt-0.5">
                  ID: {selectedFriendForDetails.playerId}
                </div>
              </div>
            </div>

            {/* Stats Bento */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="p-2.5 rounded-xl bg-[#0B0F14] border border-[#28313D]">
                <div className="text-xs text-[#9AA4B2]">Level</div>
                <div className="text-sm font-bold text-[#F5F7FA] font-mono mt-0.5">{selectedFriendForDetails.level}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B0F14] border border-[#28313D]">
                <div className="text-xs text-[#9AA4B2]">Win Rate</div>
                <div className="text-sm font-bold text-[#00D9A6] font-mono mt-0.5">{selectedFriendForDetails.winRate}%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B0F14] border border-[#28313D]">
                <div className="text-xs text-[#9AA4B2]">Arcade XP</div>
                <div className="text-sm font-bold text-[#FF4D36] font-mono mt-0.5">
                  {selectedFriendForDetails.arcadeXP.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0B0F14] border border-[#28313D] text-xs text-[#9AA4B2]">
              Favourite Game: <span className="font-bold text-[#F5F7FA]">{selectedFriendForDetails.favouriteGame}</span>
            </div>

            <button
              onClick={() => {
                const target = selectedFriendForDetails;
                setSelectedFriendForDetails(null);
                setInviteFriendTarget(target);
              }}
              className="w-full h-11 rounded-xl bg-[#FF4D36] text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <Swords className="w-4 h-4" />
              <span>Invite to Match</span>
            </button>
          </div>
        </div>
      )}

      {/* GAME INVITATION MODAL */}
      {inviteFriendTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#151B23] border border-[#28313D] rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#F5F7FA] font-display">
                  Invite {inviteFriendTarget.name}
                </h3>
                <div className="text-xs text-[#9AA4B2]">Choose game to challenge friend</div>
              </div>
              <button
                onClick={() => setInviteFriendTarget(null)}
                className="w-7 h-7 rounded-lg bg-[#0B0F14] border border-[#28313D] flex items-center justify-center text-[#9AA4B2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {games.map(game => (
                <button
                  key={game.id}
                  onClick={() => {
                    playSound.victory();
                    onInviteToGame(inviteFriendTarget, game);
                    setInviteFriendTarget(null);
                    showToast(`Game invite sent to ${inviteFriendTarget.name} for ${game.title}!`);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#0B0F14] border border-[#28313D] hover:border-[#FF4D36] flex items-center gap-3 text-left transition-colors active:scale-98"
                >
                  <img src={game.image} alt={game.title} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#F5F7FA] truncate">{game.title}</div>
                    <div className="text-[10px] text-[#9AA4B2]">{game.playerCountLabel}</div>
                  </div>
                  <span className="text-xs text-[#FF4D36] font-bold">Invite →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

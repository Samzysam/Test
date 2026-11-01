import React, { useState, useEffect } from 'react';
import {
  GAMES_DATA,
  INITIAL_USER_PROFILE,
  INITIAL_FRIENDS,
  INITIAL_FRIEND_REQUESTS,
  OVERALL_ARCADE_LEADERBOARD,
  GAME_SPECIFIC_LEADERBOARDS,
  INITIAL_CHALLENGES,
  INITIAL_NOTIFICATIONS,
  STORE_ITEMS
} from './data/games.ts';
import {
  GameItem,
  NavTab,
  SecondaryScreen,
  UserProfile,
  Friend,
  FriendRequest,
  ChallengeItem,
  StoreItem,
  NotificationItem,
  GameMode
} from './types.ts';
import { Header } from './components/Header.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { HomeView } from './components/views/HomeView.tsx';
import { ArcadeCatalogView } from './components/views/ArcadeCatalogView.tsx';
import { RankedLeaderboardView } from './components/views/RankedLeaderboardView.tsx';
import { FriendsView } from './components/views/FriendsView.tsx';
import { ProfileView } from './components/views/ProfileView.tsx';
import { ChallengesView } from './components/views/ChallengesView.tsx';
import { StoreView } from './components/views/StoreView.tsx';
import { ArcadePlusModal } from './components/views/ArcadePlusModal.tsx';
import { GameDetailModal } from './components/GameDetailModal.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { NotificationsModal } from './components/NotificationsModal.tsx';
import { NeonRushGame } from './components/games/NeonRushGame.tsx';
import { QuantumGridGame } from './components/games/QuantumGridGame.tsx';
import { TacticalBoardGame } from './components/games/TacticalBoardGame.tsx';
import { CosmicAsteroidsGame } from './components/games/CosmicAsteroidsGame.tsx';
import { setAudioEnabled, playSound } from './utils/audio.ts';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export default function App() {
  const [games, setGames] = useState<GameItem[]>(GAMES_DATA);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [requests, setRequests] = useState<FriendRequest[]>(INITIAL_FRIEND_REQUESTS);
  const [challenges, setChallenges] = useState<ChallengeItem[]>(INITIAL_CHALLENGES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Navigation states
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [activeSecondaryScreen, setActiveSecondaryScreen] = useState<SecondaryScreen | null>(null);

  // Modals & Active Game State
  const [selectedGameForDetails, setSelectedGameForDetails] = useState<GameItem | null>(null);
  const [activePlayingGame, setActivePlayingGame] = useState<{ game: GameItem; mode: GameMode } | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Device Frame Viewport Toggle: true by default for authentic mobile feel on desktop
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Sync Audio Setting
  useEffect(() => {
    setAudioEnabled(user.settings.soundFX);
  }, [user.settings.soundFX]);

  const handleQuickPlay = (game: GameItem) => {
    setActivePlayingGame({ game, mode: 'solo_ai' });
    setSelectedGameForDetails(null);
  };

  const handleLaunchGame = (game: GameItem, mode: GameMode) => {
    setActivePlayingGame({ game, mode });
    setSelectedGameForDetails(null);
  };

  const handleToggleFavourite = (gameId: string) => {
    setUser(prev => {
      const exists = prev.favouriteGameIds.includes(gameId);
      const updated = exists
        ? prev.favouriteGameIds.filter(id => id !== gameId)
        : [...prev.favouriteGameIds, gameId];
      return { ...prev, favouriteGameIds: updated };
    });
  };

  const handleScoreSubmit = (score: number) => {
    if (!activePlayingGame) return;
    const currentGameId = activePlayingGame.game.id;
    const isWin = score > 50;

    // 1. Update Challenge Progress
    setChallenges(prev =>
      prev.map(ch => {
        if (!ch.completed && (ch.gameId === currentGameId || !ch.gameId)) {
          const added = ch.unit === 'points' ? score : 1;
          const newProgress = Math.min(ch.target, ch.progress + added);
          return {
            ...ch,
            progress: newProgress,
            completed: newProgress >= ch.target
          };
        }
        return ch;
      })
    );

    // 2. Update User Profile, Matches, and Individual Game Stats
    setUser(prev => {
      const addedXP = Math.min(300, Math.round(score / 40) + 30);
      let newXP = prev.currentXP + addedXP;
      let newLevel = prev.level;
      let nextTarget = prev.nextLevelXP;

      if (newXP >= nextTarget) {
        newLevel += 1;
        newXP -= nextTarget;
        nextTarget = Math.round(nextTarget * 1.25);
        playSound.victory();
      }

      // Update Individual Game Stats
      const currentStat = prev.gameStats[currentGameId] || {
        matches: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        skillRating: 1500,
        rankTitle: 'Gold II',
        highscore: 0,
        playtime: '1h 0m'
      };

      const updatedMatches = currentStat.matches + 1;
      const updatedWins = currentStat.wins + (isWin ? 1 : 0);
      const updatedLosses = currentStat.losses + (isWin ? 0 : 1);
      const updatedWinRate = Math.round((updatedWins / updatedMatches) * 100);
      const updatedEloDelta = isWin ? 25 : -15;
      const updatedElo = Math.max(1000, currentStat.skillRating + updatedEloDelta);

      const updatedGameStats = {
        ...prev.gameStats,
        [currentGameId]: {
          ...currentStat,
          matches: updatedMatches,
          wins: updatedWins,
          losses: updatedLosses,
          winRate: updatedWinRate,
          skillRating: updatedElo,
          highscore: Math.max(currentStat.highscore, score)
        }
      };

      // Add to recent match history
      const newMatchEntry = {
        id: `match_${Date.now()}`,
        gameId: currentGameId,
        gameTitle: activePlayingGame.game.title,
        result: (isWin ? 'WIN' : 'LOSS') as 'WIN' | 'LOSS',
        mode: activePlayingGame.mode === 'pass_and_play' ? '2P Pass & Play' : 'Ranked Solo',
        score,
        date: 'Just now',
        xpEarned: addedXP
      };

      // Update Recently Played list
      const filteredRecent = prev.recentlyPlayed.filter(r => r.gameId !== currentGameId);
      const updatedRecent = [
        { gameId: currentGameId, lastPlayed: 'Just now', highscore: Math.max(currentStat.highscore, score) },
        ...filteredRecent
      ];

      return {
        ...prev,
        level: newLevel,
        currentXP: newXP,
        nextLevelXP: nextTarget,
        totalMatches: prev.totalMatches + 1,
        totalWins: prev.totalWins + (isWin ? 1 : 0),
        totalLosses: prev.totalLosses + (isWin ? 0 : 1),
        winRate: Math.round(((prev.totalWins + (isWin ? 1 : 0)) / (prev.totalMatches + 1)) * 100),
        gameStats: updatedGameStats,
        recentMatches: [newMatchEntry, ...prev.recentMatches.slice(0, 7)],
        recentlyPlayed: updatedRecent
      };
    });
  };

  // Challenges claim handler
  const handleClaimChallenge = (challengeId: string) => {
    const ch = challenges.find(c => c.id === challengeId);
    if (!ch || ch.claimed) return;

    setChallenges(prev =>
      prev.map(c => (c.id === challengeId ? { ...c, claimed: true } : c))
    );

    setUser(prev => {
      let newXP = prev.currentXP + ch.rewardXP;
      let newLevel = prev.level;
      let nextTarget = prev.nextLevelXP;

      if (newXP >= nextTarget) {
        newLevel += 1;
        newXP -= nextTarget;
        nextTarget = Math.round(nextTarget * 1.25);
      }

      const updatedCoins = prev.arcadeCoins + ch.rewardCoins;
      const updatedUnlocked = ch.rewardCosmetic
        ? [...prev.unlockedItems, ch.rewardCosmetic.id]
        : prev.unlockedItems;

      return {
        ...prev,
        level: newLevel,
        currentXP: newXP,
        nextLevelXP: nextTarget,
        arcadeCoins: updatedCoins,
        unlockedItems: updatedUnlocked
      };
    });
  };

  // Store purchase handler
  const handlePurchaseStoreItem = (item: StoreItem): boolean => {
    if (item.isPaid) {
      // Simulate real money payment
      setUser(prev => ({
        ...prev,
        unlockedItems: [...prev.unlockedItems, item.id]
      }));
      return true;
    }

    // Free reward coin check
    const cost = item.costCoins || 0;
    if (user.arcadeCoins < cost) return false;

    setUser(prev => ({
      ...prev,
      arcadeCoins: prev.arcadeCoins - cost,
      unlockedItems: [...prev.unlockedItems, item.id]
    }));
    return true;
  };

  // Friends handlers
  const handleAcceptFriendRequest = (reqId: string) => {
    const req = requests.find(r => r.id === reqId);
    if (!req) return;

    const newFriend: Friend = {
      id: req.fromUser.id,
      playerId: req.fromUser.playerId,
      name: req.fromUser.name,
      tag: req.fromUser.tag,
      avatarSeed: req.fromUser.avatarSeed,
      avatarFrame: 'default',
      level: req.fromUser.level,
      status: 'online',
      lastActive: 'Just now',
      arcadeXP: 18400,
      winRate: 60,
      favouriteGame: 'Tactical Matrix'
    };

    setFriends(prev => [newFriend, ...prev]);
    setRequests(prev => prev.filter(r => r.id !== reqId));
  };

  const handleDeclineFriendRequest = (reqId: string) => {
    setRequests(prev => prev.filter(r => r.id !== reqId));
  };

  const handleSendFriendRequest = (targetTag: string): boolean => {
    const clean = targetTag.startsWith('@') ? targetTag : `@${targetTag}`;
    if (friends.some(f => f.tag.toLowerCase() === clean.toLowerCase())) {
      return false;
    }
    // Simulate sent request
    return true;
  };

  const handleRemoveFriend = (friendId: string) => {
    setFriends(prev => prev.filter(f => f.id !== friendId));
  };

  const handleBlockFriend = (friendId: string) => {
    setFriends(prev => prev.map(f => f.id === friendId ? { ...f, isBlocked: true } : f));
  };

  const handleInviteFriendToGame = (friend: Friend, game: GameItem) => {
    // Send simulated invite & open notification
    const newNotif: NotificationItem = {
      id: `inv_${Date.now()}`,
      title: 'Invitation Sent',
      message: `You invited ${friend.name} to play ${game.title}.`,
      time: 'Just now',
      read: true,
      type: 'game_invite'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleUpdateAvatarFrame = (frameId: string) => {
    setUser(prev => ({ ...prev, avatarFrame: frameId }));
  };

  const handleTogglePlusSubscription = () => {
    setUser(prev => ({ ...prev, isArcadePlus: !prev.isArcadePlus }));
  };

  const handleUpdateSettings = (key: keyof UserProfile['settings'], value: boolean) => {
    setUser(prev => ({
      ...prev,
      settings: { ...prev.settings, [key]: value }
    }));
  };

  const handleResetStats = () => {
    setUser(INITIAL_USER_PROFILE);
    setChallenges(INITIAL_CHALLENGES);
    playSound.click();
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const unclaimedChallengesCount = challenges.filter(c => c.completed && !c.claimed).length;

  return (
    <div className="min-h-screen w-full bg-[#0B0F14] text-[#F5F7FA] flex flex-col items-center justify-start antialiased selection:bg-[#FF4D36]/30 selection:text-[#F5F7FA]">
      {/* Outer wrapper: switches between phone frame and full responsive width */}
      <div
        className={`w-full transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-[430px] my-0 sm:my-3 sm:rounded-[42px] sm:border-[8px] sm:border-[#1E2633] sm:shadow-[0_0_55px_rgba(255,77,54,0.12)] min-h-screen sm:min-h-[890px] flex flex-col bg-[#0B0F14] relative overflow-hidden ring-1 ring-white/10'
            : 'max-w-4xl min-h-screen flex flex-col bg-[#0B0F14]'
        }`}
      >
        {/* Mobile Phone Top Hardware Bezel / Status Bar (Only in mobile frame view) */}
        {isMobileFrame && (
          <div className="shrink-0 h-8 bg-[#0B0F14] px-6 pt-1.5 flex items-center justify-between text-[11px] text-[#9AA4B2] font-mono select-none z-50">
            <span className="font-semibold text-xs text-[#F5F7FA]">9:41</span>
            {/* Camera Punchhole */}
            <div className="w-3.5 h-3.5 rounded-full bg-black border border-[#28313D] shadow-inner" />
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3 text-[#F5F7FA]" />
              <Wifi className="w-3 h-3 text-[#F5F7FA]" />
              <BatteryMedium className="w-3.5 h-3.5 text-[#00D9A6]" />
            </div>
          </div>
        )}

        {/* Top App Header */}
        <Header
          user={user}
          unreadCount={unreadNotificationsCount}
          unclaimedChallengesCount={unclaimedChallengesCount}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenSecondary={(scr) => setActiveSecondaryScreen(scr)}
          onNavigateTab={setCurrentTab}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        />

        {/* Primary View Container */}
        <main className="flex-1 w-full overflow-y-auto">
          {currentTab === 'home' && (
            <HomeView
              games={games}
              user={user}
              challenges={challenges}
              onSelectGame={setSelectedGameForDetails}
              onQuickPlay={handleQuickPlay}
              onToggleFavourite={handleToggleFavourite}
              onNavigateTab={setCurrentTab}
              onOpenSecondary={(scr) => setActiveSecondaryScreen(scr)}
            />
          )}

          {currentTab === 'arcade' && (
            <ArcadeCatalogView
              games={games}
              favouriteGameIds={user.favouriteGameIds}
              onSelectGame={setSelectedGameForDetails}
              onQuickPlay={handleQuickPlay}
              onToggleFavourite={handleToggleFavourite}
            />
          )}

          {currentTab === 'ranked' && (
            <RankedLeaderboardView
              overallLeaderboard={OVERALL_ARCADE_LEADERBOARD}
              gameLeaderboards={GAME_SPECIFIC_LEADERBOARDS}
              games={games}
              onPlayGame={handleQuickPlay}
            />
          )}

          {currentTab === 'friends' && (
            <FriendsView
              friends={friends}
              requests={requests}
              games={games}
              onAcceptRequest={handleAcceptFriendRequest}
              onDeclineRequest={handleDeclineFriendRequest}
              onSendRequest={handleSendFriendRequest}
              onRemoveFriend={handleRemoveFriend}
              onBlockFriend={handleBlockFriend}
              onInviteToGame={handleInviteFriendToGame}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              user={user}
              games={games}
              onUpdateSettings={handleUpdateSettings}
              onUpdateAvatarFrame={handleUpdateAvatarFrame}
              onResetStats={handleResetStats}
              onOpenStore={() => setActiveSecondaryScreen('store')}
            />
          )}
        </main>

        {/* Fixed Bottom Navigation Bar (Home, Arcade, Ranked, Friends, Profile) */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          unreadFriendsCount={requests.length}
          unclaimedQuestsCount={unclaimedChallengesCount}
        />

        {/* Mobile Gesture Bar Indicator */}
        {isMobileFrame && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full bg-white/20 z-50 pointer-events-none" />
        )}
      </div>

      {/* SECONDARY SCREENS */}
      {/* 1. Challenges Screen */}
      {activeSecondaryScreen === 'challenges' && (
        <ChallengesView
          challenges={challenges}
          games={games}
          onClose={() => setActiveSecondaryScreen(null)}
          onClaimChallenge={handleClaimChallenge}
          onLaunchGameById={(gId) => {
            const target = games.find(g => g.id === gId) || games[0];
            handleQuickPlay(target);
          }}
        />
      )}

      {/* 2. Store Screen */}
      {activeSecondaryScreen === 'store' && (
        <StoreView
          user={user}
          onClose={() => setActiveSecondaryScreen(null)}
          onPurchaseItem={handlePurchaseStoreItem}
          onOpenArcadePlus={() => setActiveSecondaryScreen('arcade_plus')}
        />
      )}

      {/* 3. Arcade Plus Modal */}
      {activeSecondaryScreen === 'arcade_plus' && (
        <ArcadePlusModal
          user={user}
          onClose={() => setActiveSecondaryScreen(null)}
          onTogglePlusSubscription={handleTogglePlusSubscription}
        />
      )}

      {/* GAME DETAIL MODAL SHEET */}
      <GameDetailModal
        game={selectedGameForDetails}
        onClose={() => setSelectedGameForDetails(null)}
        onPlayGame={handleLaunchGame}
      />

      {/* SEARCH MODAL */}
      {isSearchOpen && (
        <SearchModal
          games={games}
          onClose={() => setIsSearchOpen(false)}
          onSelectGame={(g) => {
            setIsSearchOpen(false);
            setSelectedGameForDetails(g);
          }}
          onQuickPlay={(g) => {
            setIsSearchOpen(false);
            handleQuickPlay(g);
          }}
        />
      )}

      {/* NOTIFICATIONS MODAL */}
      {isNotificationsOpen && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          onNavigateToFriends={() => {
            setIsNotificationsOpen(false);
            setCurrentTab('friends');
          }}
        />
      )}

      {/* ACTIVE PLAYABLE IN-ARCADE MINI-GAMES FULLSCREEN MODAL */}
      {activePlayingGame && (
        <div className="fixed inset-0 z-50 bg-[#0B0F14] flex flex-col items-center justify-center animate-in fade-in duration-200">
          <div className="w-full h-full max-w-lg bg-[#0B0F14] flex flex-col shadow-2xl relative overflow-hidden">
            {activePlayingGame.game.componentId === 'neon_rush' && (
              <NeonRushGame
                onClose={() => setActivePlayingGame(null)}
                onScoreSubmit={handleScoreSubmit}
                isPassAndPlay={activePlayingGame.mode === 'pass_and_play'}
              />
            )}

            {activePlayingGame.game.componentId === 'quantum_grid' && (
              <QuantumGridGame
                onClose={() => setActivePlayingGame(null)}
                onScoreSubmit={handleScoreSubmit}
              />
            )}

            {activePlayingGame.game.componentId === 'tactical_board' && (
              <TacticalBoardGame
                onClose={() => setActivePlayingGame(null)}
                onScoreSubmit={handleScoreSubmit}
                defaultMode={activePlayingGame.mode === 'pass_and_play' ? 'pass_and_play' : 'solo_ai'}
              />
            )}

            {activePlayingGame.game.componentId === 'retro_asteroids' && (
              <CosmicAsteroidsGame
                onClose={() => setActivePlayingGame(null)}
                onScoreSubmit={handleScoreSubmit}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

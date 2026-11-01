export type GameCategory = 'all' | 'casual' | 'strategy' | 'puzzle' | 'board' | 'multiplayer' | 'arcade';

export type GameMode = 'solo_ai' | 'pass_and_play' | 'local_wifi' | 'online_ranked';

export type NavTab = 'home' | 'arcade' | 'ranked' | 'friends' | 'profile';

export type SecondaryScreen = 'store' | 'challenges' | 'arcade_plus' | 'settings';

export interface GameAchievement {
  id: string;
  title: string;
  desc: string;
  unlocked: boolean;
  xp: number;
}

export interface GameItem {
  id: string;
  title: string;
  tagline: string;
  category: 'casual' | 'strategy' | 'puzzle' | 'board' | 'multiplayer' | 'arcade';
  modes: GameMode[];
  image: string;
  bannerImage?: string;
  rating: number;
  playCount: string;
  playerCountLabel: string;
  avgDuration: string;
  difficulty: 'Easy' | 'Medium' | 'Tactical' | 'Challenging';
  description: string;
  howToPlay: string[];
  features: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  isAIChallenger?: boolean;
  isMultiplayerReady?: boolean;
  achievements: GameAchievement[];
  componentId?: 'neon_rush' | 'quantum_grid' | 'tactical_board' | 'retro_asteroids';
}

export interface GameSpecificStat {
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
  skillRating: number; // Individual ELO, e.g. 1850
  rankTitle: string; // e.g. "Diamond II"
  highscore: number;
  playtime: string;
}

export interface MatchHistoryEntry {
  id: string;
  gameId: string;
  gameTitle: string;
  result: 'WIN' | 'LOSS' | 'DRAW';
  mode: string;
  score: number;
  opponentName?: string;
  date: string;
  xpEarned: number;
}

export interface UserProfile {
  id: string; // Permanent ID, e.g. #NV-84920
  name: string;
  tag: string; // @Kaelen_V
  avatarSeed: string;
  avatarFrame: string; // e.g. 'ember_phoenix', 'neon_core', 'obsidian', 'default'
  profileBackground: string;
  level: number;
  currentXP: number;
  nextLevelXP: number;
  arcadeCoins: number;
  isArcadePlus: boolean;
  totalPlaytime: string;
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  totalTrophies: number;
  favouriteGameIds: string[];
  recentlyPlayed: {
    gameId: string;
    lastPlayed: string;
    highscore: number;
  }[];
  gameStats: Record<string, GameSpecificStat>;
  recentMatches: MatchHistoryEntry[];
  unlockedItems: string[];
  settings: {
    soundFX: boolean;
    hapticFeedback: boolean;
    lowEndPhoneSaver: boolean;
    streamerMode: boolean;
    allowDirectInvites: boolean;
  };
}

export interface Friend {
  id: string;
  playerId: string;
  name: string;
  tag: string;
  avatarSeed: string;
  avatarFrame: string;
  level: number;
  status: 'online' | 'ingame' | 'offline';
  currentGame?: string;
  lastActive: string;
  arcadeXP: number;
  winRate: number;
  favouriteGame: string;
  isBlocked?: boolean;
}

export interface FriendRequest {
  id: string;
  fromUser: {
    id: string;
    playerId: string;
    name: string;
    tag: string;
    level: number;
    avatarSeed: string;
  };
  sentAt: string;
  type: 'incoming' | 'outgoing';
}

export interface OverallLeaderboardEntry {
  rank: number;
  id: string;
  playerId: string;
  name: string;
  tag: string;
  avatarSeed: string;
  avatarFrame: string;
  level: number;
  arcadeXP: number;
  isUser?: boolean;
  isFriend?: boolean;
}

export interface GameSkillLeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  tag: string;
  avatarSeed: string;
  skillRating: number;
  rankTitle: string;
  wins: number;
  losses: number;
  winRate: number;
  isUser?: boolean;
  isFriend?: boolean;
}

export interface ChallengeItem {
  id: string;
  title: string;
  category: 'daily' | 'weekly' | 'seasonal';
  description: string;
  progress: number;
  target: number;
  unit: string;
  rewardXP: number;
  rewardCoins: number;
  rewardCosmetic?: {
    id: string;
    name: string;
    type: string;
  };
  completed: boolean;
  claimed: boolean;
  gameId?: string;
  expiresIn: string;
}

export interface StoreItem {
  id: string;
  name: string;
  category: 'avatar' | 'frame' | 'background' | 'title' | 'board_theme' | 'emote';
  costCoins?: number;
  costRealMoney?: string;
  isPaid: boolean;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
  preview: string;
  owned: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'friend_request' | 'game_invite' | 'challenge' | 'system';
  data?: any;
}

export interface LocalLobbyRoom {
  id: string;
  roomCode: string;
  name: string;
  hostDevice: string;
  gameTitle: string;
  gameId: string;
  playerCount: number;
  maxPlayers: number;
  ping: number;
  isLocalWifi: boolean;
}

export type QuestItem = ChallengeItem;


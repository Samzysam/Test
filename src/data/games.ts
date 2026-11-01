import {
  GameItem,
  UserProfile,
  Friend,
  FriendRequest,
  OverallLeaderboardEntry,
  GameSkillLeaderboardEntry,
  ChallengeItem,
  StoreItem,
  NotificationItem
} from '../types.ts';

export const FEATURED_HERO_IMAGE = '/src/assets/images/hero_arcade_featured_1793525799516.jpg';

export const GAMES_DATA: GameItem[] = [
  {
    id: 'neon_rush',
    title: 'Neon Rush: Cyber Runner',
    tagline: 'High-octane obstacle runner across glowing ember skyways.',
    category: 'arcade',
    modes: ['solo_ai', 'pass_and_play', 'local_wifi', 'online_ranked'],
    image: '/src/assets/images/game_cover_cyber_runner_1793525815768.jpg',
    bannerImage: '/src/assets/images/hero_arcade_featured_1793525799516.jpg',
    rating: 4.9,
    playCount: '124K',
    playerCountLabel: '1-2 Players',
    avgDuration: '2-4 min',
    difficulty: 'Challenging',
    description: 'Pilot your hyper-drift velocity craft down 3 cybernetic lanes. Dodge firewall barriers, collect flux energy orbs, and trigger hyper-boost streaks to shatter the leaderboard.',
    howToPlay: [
      'Tap Left or Right on mobile (or use arrow keys / A & D) to switch lanes.',
      'Dodge glowing hazard barriers and static pylon fences.',
      'Collect energy orbs to fill your boost meter and multiply your score.',
      'Survive as speed accelerates with each sector checkpoint.'
    ],
    features: [
      'Real-time procedural hazard generation',
      'Hyper-drift score multiplier loop',
      'Pass & Play alternate turn duel mode',
      'Smooth 60FPS physics optimized for budget Androids'
    ],
    isFeatured: true,
    isPopular: true,
    isAIChallenger: false,
    isMultiplayerReady: true,
    achievements: [
      { id: 'nr_1', title: 'Speed Demon', desc: 'Reach Sector 5 with full energy', unlocked: true, xp: 150 },
      { id: 'nr_2', title: 'Orb Collector', desc: 'Gather 50 energy orbs in one run', unlocked: false, xp: 200 },
      { id: 'nr_3', title: 'Zero Scratches', desc: 'Survive 60 seconds without colliding', unlocked: true, xp: 120 }
    ],
    componentId: 'neon_rush'
  },
  {
    id: 'quantum_grid',
    title: 'Quantum Grid 2048',
    tagline: 'Slide and fuse quantum power cores to synthesize core 2048.',
    category: 'puzzle',
    modes: ['solo_ai', 'pass_and_play'],
    image: '/src/assets/images/game_cover_quantum_puzzle_1793525816652.jpg',
    rating: 4.8,
    playCount: '98K',
    playerCountLabel: '1 Player / Pass & Play',
    avgDuration: '5-10 min',
    difficulty: 'Medium',
    description: 'A stylish futuristic fusion puzzle. Slide quantum energy cells across the magnetic grid to combine identical values. Strategize space conservation to construct the ultimate Singularity Core.',
    howToPlay: [
      'Swipe up, down, left, or right (or use on-screen D-pad / arrow keys).',
      'When two cells with the same number collide, they fuse into one with double value.',
      'A new quantum cell spawns on every valid move.',
      'Plan moves carefully—the game ends when the grid fills completely with no moves left.'
    ],
    features: [
      'Haptic merge audio and visual ripple feedback',
      'Undo last move utility',
      'Pass & Play target score race mode',
      'Smart state auto-save'
    ],
    isFeatured: false,
    isPopular: true,
    isAIChallenger: false,
    isMultiplayerReady: true,
    achievements: [
      { id: 'qg_1', title: 'Fusion Starter', desc: 'Synthesize a 256 Quantum Core', unlocked: true, xp: 100 },
      { id: 'qg_2', title: 'Core Master', desc: 'Reach the 2048 Singularity', unlocked: false, xp: 500 },
      { id: 'qg_3', title: 'Tactical Reversal', desc: 'Use Undo to escape a tight spot', unlocked: true, xp: 50 }
    ],
    componentId: 'quantum_grid'
  },
  {
    id: 'tactical_board',
    title: 'Tactical Matrix: Four in a Row',
    tagline: 'Connect 4 energy tokens in a line against adaptive AI or friends.',
    category: 'board',
    modes: ['solo_ai', 'pass_and_play', 'local_wifi', 'online_ranked'],
    image: '/src/assets/images/game_cover_tactical_board_1793525816735.jpg',
    rating: 4.9,
    playCount: '112K',
    playerCountLabel: '1-2 Players (Pass & Play)',
    avgDuration: '3-6 min',
    difficulty: 'Tactical',
    description: 'The definitive digital adaptation of vertical strategy. Drop your glowing cyber discs into the 7-column matrix. Battle an intelligent AI with 3 distinct difficulty engines, or challenge a friend in Pass & Play mode.',
    howToPlay: [
      'Tap any of the 7 column headers to drop your colored disc.',
      'Player 1 is Red Ember; Player 2 / AI is Electric Teal.',
      'Be the first to align 4 discs horizontally, vertically, or diagonally.',
      'Block your opponent from completing their lines while setting up dual-threat traps.'
    ],
    features: [
      'Smart Minimax AI bot with Easy, Medium, and Master difficulties',
      'Pass & Play dual-thumb interface for same-device competition',
      'Live win-rate tracker and rematch engine',
      'High-contrast board tokens with distinct shape accents for accessibility'
    ],
    isFeatured: false,
    isPopular: true,
    isAIChallenger: true,
    isMultiplayerReady: true,
    achievements: [
      { id: 'tb_1', title: 'AI Slayer', desc: 'Defeat Master AI in under 15 moves', unlocked: false, xp: 300 },
      { id: 'tb_2', title: 'Diagonal Dominion', desc: 'Win with a diagonal connect-four', unlocked: true, xp: 150 },
      { id: 'tb_3', title: 'Local Champion', desc: 'Win 3 Pass & Play matches', unlocked: true, xp: 180 }
    ],
    componentId: 'tactical_board'
  },
  {
    id: 'retro_asteroids',
    title: 'Galactic Shard: Space Blaster',
    tagline: 'Defend your starship from shattering crystalline asteroid fields.',
    category: 'arcade',
    modes: ['solo_ai', 'online_ranked'],
    image: '/src/assets/images/game_cover_retro_asteroids_1793525816969.jpg',
    rating: 4.7,
    playCount: '76K',
    playerCountLabel: '1 Player',
    avgDuration: '2-5 min',
    difficulty: 'Challenging',
    description: 'Classic vector-style arcade action upgraded with particle sparks and physics. Rotate, thrust, and discharge twin plasma blasters to shatter incoming crystalline meteors into smaller shards.',
    howToPlay: [
      'Use on-screen steering controls (Rotate Left/Right, Thrust) or arrow keys.',
      'Tap Fire to release plasma bolts.',
      'Large crystals split into medium ones, then disintegrate into dust.',
      'Avoid ship collisions and preserve your 3 shield generators.'
    ],
    features: [
      'Physics inertia simulation with screen wrapping',
      'Shattering particle blast effects with low-power optimizations',
      'Progressive difficulty waves with speed modifiers',
      'Dual touch joystick and button mode'
    ],
    isFeatured: false,
    isPopular: true,
    isAIChallenger: false,
    isMultiplayerReady: false,
    achievements: [
      { id: 'ga_1', title: 'Asteroid Cleanser', desc: 'Destroy 100 space shards', unlocked: true, xp: 200 },
      { id: 'ga_2', title: 'Sharpshooter', desc: 'Score 15,000 without missing 3 shots', unlocked: false, xp: 350 },
      { id: 'ga_3', title: 'Hyperspace Survivor', desc: 'Complete wave 5', unlocked: false, xp: 250 }
    ],
    componentId: 'retro_asteroids'
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: '#NV-84920',
  name: 'Kaelen Voss',
  tag: '@Kaelen_V',
  avatarSeed: 'Kaelen',
  avatarFrame: 'ember_phoenix',
  profileBackground: 'ember_void',
  level: 19,
  currentXP: 2450,
  nextLevelXP: 3200,
  arcadeCoins: 1850,
  isArcadePlus: false,
  totalPlaytime: '42h 15m',
  totalMatches: 168,
  totalWins: 114,
  totalLosses: 54,
  winRate: 68,
  totalTrophies: 12,
  favouriteGameIds: ['neon_rush', 'tactical_board'],
  recentlyPlayed: [
    { gameId: 'neon_rush', lastPlayed: '15m ago', highscore: 24120 },
    { gameId: 'tactical_board', lastPlayed: '2h ago', highscore: 42 },
    { gameId: 'quantum_grid', lastPlayed: 'Yesterday', highscore: 18400 }
  ],
  gameStats: {
    neon_rush: {
      matches: 78,
      wins: 54,
      losses: 24,
      winRate: 69,
      skillRating: 1940,
      rankTitle: 'Master III',
      highscore: 24120,
      playtime: '18h 40m'
    },
    tactical_board: {
      matches: 52,
      wins: 38,
      losses: 14,
      winRate: 73,
      skillRating: 2085,
      rankTitle: 'Grandmaster I',
      highscore: 42,
      playtime: '12h 10m'
    },
    quantum_grid: {
      matches: 24,
      wins: 14,
      losses: 10,
      winRate: 58,
      skillRating: 1620,
      rankTitle: 'Diamond II',
      highscore: 18400,
      playtime: '6h 45m'
    },
    retro_asteroids: {
      matches: 14,
      wins: 8,
      losses: 6,
      winRate: 57,
      skillRating: 1540,
      rankTitle: 'Platinum I',
      highscore: 26400,
      playtime: '4h 40m'
    }
  },
  recentMatches: [
    {
      id: 'm_1',
      gameId: 'tactical_board',
      gameTitle: 'Tactical Matrix',
      result: 'WIN',
      mode: 'Ranked 1v1',
      score: 100,
      opponentName: 'Vortex_Rider',
      date: 'Today, 14:22',
      xpEarned: 85
    },
    {
      id: 'm_2',
      gameId: 'neon_rush',
      gameTitle: 'Neon Rush',
      result: 'WIN',
      mode: 'Solo Run',
      score: 22800,
      date: 'Today, 11:05',
      xpEarned: 110
    },
    {
      id: 'm_3',
      gameId: 'tactical_board',
      gameTitle: 'Tactical Matrix',
      result: 'LOSS',
      mode: 'Vs Master AI',
      score: 45,
      opponentName: 'DeepMatrix_AI',
      date: 'Yesterday',
      xpEarned: 30
    },
    {
      id: 'm_4',
      gameId: 'quantum_grid',
      gameTitle: 'Quantum Grid',
      result: 'WIN',
      mode: 'Core 1024 Target',
      score: 16200,
      date: 'Yesterday',
      xpEarned: 95
    }
  ],
  unlockedItems: ['ember_phoenix', 'default_frame', 'fire_avatar_1', 'ember_void'],
  settings: {
    soundFX: true,
    hapticFeedback: true,
    lowEndPhoneSaver: false,
    streamerMode: false,
    allowDirectInvites: true
  }
};

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'f_1',
    playerId: '#NV-11029',
    name: 'Vortex_Rider',
    tag: '@VortexRider',
    avatarSeed: 'Vortex',
    avatarFrame: 'ember_phoenix',
    level: 24,
    status: 'online',
    lastActive: 'Active now',
    arcadeXP: 34800,
    winRate: 72,
    favouriteGame: 'Neon Rush: Cyber Runner'
  },
  {
    id: 'f_2',
    playerId: '#NV-49210',
    name: 'Sora_Blade',
    tag: '@SoraBlade',
    avatarSeed: 'Sora',
    avatarFrame: 'gold_laurel',
    level: 21,
    status: 'ingame',
    currentGame: 'Tactical Matrix (Ranked)',
    lastActive: 'In Match',
    arcadeXP: 29400,
    winRate: 67,
    favouriteGame: 'Tactical Matrix'
  },
  {
    id: 'f_3',
    playerId: '#NV-78342',
    name: 'CyberNova',
    tag: '@CyberNova',
    avatarSeed: 'Nova',
    avatarFrame: 'neon_core',
    level: 18,
    status: 'online',
    lastActive: '5m ago',
    arcadeXP: 22100,
    winRate: 64,
    favouriteGame: 'Quantum Grid 2048'
  },
  {
    id: 'f_4',
    playerId: '#NV-90145',
    name: 'PixelKnight',
    tag: '@PixelKnight',
    avatarSeed: 'Pixel',
    avatarFrame: 'default',
    level: 14,
    status: 'offline',
    lastActive: '3h ago',
    arcadeXP: 14500,
    winRate: 58,
    favouriteGame: 'Galactic Shard'
  },
  {
    id: 'f_5',
    playerId: '#NV-33921',
    name: 'LunarEcho',
    tag: '@LunarEcho',
    avatarSeed: 'Lunar',
    avatarFrame: 'default',
    level: 12,
    status: 'offline',
    lastActive: '1d ago',
    arcadeXP: 11200,
    winRate: 52,
    favouriteGame: 'Neon Rush'
  }
];

export const INITIAL_FRIEND_REQUESTS: FriendRequest[] = [
  {
    id: 'req_1',
    fromUser: {
      id: 'u_101',
      playerId: '#NV-62841',
      name: 'EchoStrike',
      tag: '@EchoStrike',
      level: 16,
      avatarSeed: 'Echo'
    },
    sentAt: '20m ago',
    type: 'incoming'
  },
  {
    id: 'req_2',
    fromUser: {
      id: 'u_102',
      playerId: '#NV-81903',
      name: 'Solaris_Ace',
      tag: '@SolarisAce',
      level: 20,
      avatarSeed: 'Solaris'
    },
    sentAt: '2h ago',
    type: 'incoming'
  }
];

export const OVERALL_ARCADE_LEADERBOARD: OverallLeaderboardEntry[] = [
  { rank: 1, id: 'lb_1', playerId: '#NV-99120', name: 'IgnisGrandmaster', tag: '@IgnisGM', avatarSeed: 'Ignis', avatarFrame: 'ember_phoenix', level: 35, arcadeXP: 68400 },
  { rank: 2, id: 'lb_2', playerId: '#NV-11029', name: 'Vortex_Rider', tag: '@VortexRider', avatarSeed: 'Vortex', avatarFrame: 'ember_phoenix', level: 24, arcadeXP: 34800, isFriend: true },
  { rank: 3, id: 'lb_3', playerId: '#NV-44910', name: 'ApexPhantom', tag: '@ApexPhantom', avatarSeed: 'Apex', avatarFrame: 'gold_laurel', level: 23, arcadeXP: 31200 },
  { rank: 4, id: 'lb_4', playerId: '#NV-49210', name: 'Sora_Blade', tag: '@SoraBlade', avatarSeed: 'Sora', avatarFrame: 'gold_laurel', level: 21, arcadeXP: 29400, isFriend: true },
  { rank: 5, id: 'lb_5', playerId: '#NV-84920', name: 'Kaelen Voss (You)', tag: '@Kaelen_V', avatarSeed: 'Kaelen', avatarFrame: 'ember_phoenix', level: 19, arcadeXP: 26450, isUser: true },
  { rank: 6, id: 'lb_6', playerId: '#NV-78342', name: 'CyberNova', tag: '@CyberNova', avatarSeed: 'Nova', avatarFrame: 'neon_core', level: 18, arcadeXP: 22100, isFriend: true },
  { rank: 7, id: 'lb_7', playerId: '#NV-67120', name: 'HexaMind', tag: '@HexaMind', avatarSeed: 'Hexa', avatarFrame: 'default', level: 17, arcadeXP: 19800 },
  { rank: 8, id: 'lb_8', playerId: '#NV-90145', name: 'PixelKnight', tag: '@PixelKnight', avatarSeed: 'Pixel', avatarFrame: 'default', level: 14, arcadeXP: 14500, isFriend: true }
];

export const GAME_SPECIFIC_LEADERBOARDS: Record<string, GameSkillLeaderboardEntry[]> = {
  neon_rush: [
    { rank: 1, id: 'gl_1', name: 'Vortex_Rider', tag: '@VortexRider', avatarSeed: 'Vortex', skillRating: 2350, rankTitle: 'Grandmaster', wins: 142, losses: 32, winRate: 81, isFriend: true },
    { rank: 2, id: 'gl_2', name: 'LightDrifter', tag: '@LightDrifter', avatarSeed: 'Light', skillRating: 2210, rankTitle: 'Grandmaster', wins: 118, losses: 35, winRate: 77 },
    { rank: 3, id: 'gl_3', name: 'Kaelen Voss (You)', tag: '@Kaelen_V', avatarSeed: 'Kaelen', skillRating: 1940, rankTitle: 'Master III', wins: 54, losses: 24, winRate: 69, isUser: true },
    { rank: 4, id: 'gl_4', name: 'CyberNova', tag: '@CyberNova', avatarSeed: 'Nova', skillRating: 1820, rankTitle: 'Master I', wins: 48, losses: 28, winRate: 63, isFriend: true }
  ],
  tactical_board: [
    { rank: 1, id: 'tb_1', name: 'DeepTactics_Bot', tag: '@DeepBot', avatarSeed: 'Bot', skillRating: 2400, rankTitle: 'Grandmaster', wins: 210, losses: 18, winRate: 92 },
    { rank: 2, id: 'tb_2', name: 'Kaelen Voss (You)', tag: '@Kaelen_V', avatarSeed: 'Kaelen', skillRating: 2085, rankTitle: 'Grandmaster I', wins: 38, losses: 14, winRate: 73, isUser: true },
    { rank: 3, id: 'tb_3', name: 'Sora_Blade', tag: '@SoraBlade', avatarSeed: 'Sora', skillRating: 1990, rankTitle: 'Master II', wins: 62, losses: 29, winRate: 68, isFriend: true },
    { rank: 4, id: 'tb_4', name: 'ChessMaster99', tag: '@Chess99', avatarSeed: 'Chess', skillRating: 1840, rankTitle: 'Diamond III', wins: 45, losses: 26, winRate: 63 }
  ],
  quantum_grid: [
    { rank: 1, id: 'qg_1', name: 'HexaMind', tag: '@HexaMind', avatarSeed: 'Hexa', skillRating: 2280, rankTitle: 'Grandmaster', wins: 88, losses: 16, winRate: 84 },
    { rank: 2, id: 'qg_2', name: 'Kaelen Voss (You)', tag: '@Kaelen_V', avatarSeed: 'Kaelen', skillRating: 1620, rankTitle: 'Diamond II', wins: 14, losses: 10, winRate: 58, isUser: true },
    { rank: 3, id: 'qg_3', name: 'CyberNova', tag: '@CyberNova', avatarSeed: 'Nova', skillRating: 1590, rankTitle: 'Platinum III', wins: 18, losses: 14, winRate: 56, isFriend: true }
  ],
  retro_asteroids: [
    { rank: 1, id: 'ra_1', name: 'StarSniper', tag: '@StarSniper', avatarSeed: 'Sniper', skillRating: 2150, rankTitle: 'Grandmaster', wins: 95, losses: 22, winRate: 81 },
    { rank: 2, id: 'ra_2', name: 'CosmoAce', tag: '@CosmoAce', avatarSeed: 'Cosmo', skillRating: 1890, rankTitle: 'Master I', wins: 56, losses: 22, winRate: 71 },
    { rank: 3, id: 'ra_3', name: 'Kaelen Voss (You)', tag: '@Kaelen_V', avatarSeed: 'Kaelen', skillRating: 1540, rankTitle: 'Platinum I', wins: 8, losses: 6, winRate: 57, isUser: true }
  ]
};

export const INITIAL_CHALLENGES: ChallengeItem[] = [
  // Daily Missions
  {
    id: 'ch_d1',
    title: 'Daily Velocity',
    category: 'daily',
    description: 'Score 15,000 points in Neon Rush: Cyber Runner',
    progress: 12400,
    target: 15000,
    unit: 'points',
    rewardXP: 120,
    rewardCoins: 50,
    completed: false,
    claimed: false,
    gameId: 'neon_rush',
    expiresIn: '14h 22m'
  },
  {
    id: 'ch_d2',
    title: 'Grid Fusion',
    category: 'daily',
    description: 'Synthesize a 512 Quantum Core in Quantum Grid',
    progress: 512,
    target: 512,
    unit: 'core',
    rewardXP: 100,
    rewardCoins: 40,
    completed: true,
    claimed: false,
    gameId: 'quantum_grid',
    expiresIn: '14h 22m'
  },
  {
    id: 'ch_d3',
    title: 'Tactical Clash',
    category: 'daily',
    description: 'Win 2 matches in Tactical Matrix',
    progress: 2,
    target: 2,
    unit: 'wins',
    rewardXP: 140,
    rewardCoins: 60,
    completed: true,
    claimed: true,
    gameId: 'tactical_board',
    expiresIn: '14h 22m'
  },

  // Weekly Challenges
  {
    id: 'ch_w1',
    title: 'Decade of Victories',
    category: 'weekly',
    description: 'Win 10 matches across any game mode',
    progress: 7,
    target: 10,
    unit: 'matches',
    rewardXP: 450,
    rewardCoins: 250,
    completed: false,
    claimed: false,
    expiresIn: '4d 18h'
  },
  {
    id: 'ch_w2',
    title: 'Arcade Polymath',
    category: 'weekly',
    description: 'Play 4 different arcade games in the platform',
    progress: 4,
    target: 4,
    unit: 'games',
    rewardXP: 350,
    rewardCoins: 180,
    rewardCosmetic: {
      id: 'frame_polymath',
      name: 'Polymath Ember Ring',
      type: 'Profile Frame'
    },
    completed: true,
    claimed: false,
    expiresIn: '4d 18h'
  },
  {
    id: 'ch_w3',
    title: 'Party Initiator',
    category: 'weekly',
    description: 'Complete 3 multiplayer or Pass & Play matches',
    progress: 2,
    target: 3,
    unit: 'matches',
    rewardXP: 300,
    rewardCoins: 150,
    completed: false,
    claimed: false,
    expiresIn: '4d 18h'
  },
  {
    id: 'ch_w4',
    title: 'AI Conquering Engine',
    category: 'weekly',
    description: 'Win 5 matches against Master AI in Tactical Matrix',
    progress: 3,
    target: 5,
    unit: 'wins',
    rewardXP: 500,
    rewardCoins: 300,
    completed: false,
    claimed: false,
    gameId: 'tactical_board',
    expiresIn: '4d 18h'
  },
  {
    id: 'ch_w5',
    title: 'Arcade Marathon',
    category: 'weekly',
    description: 'Play for a total of 3 cumulative hours this week',
    progress: 2.1,
    target: 3.0,
    unit: 'hours',
    rewardXP: 400,
    rewardCoins: 220,
    completed: false,
    claimed: false,
    expiresIn: '4d 18h'
  },

  // Seasonal Event: Ember Convergence Season 1
  {
    id: 'ch_s1',
    title: 'Ember Convergence Grand Tour',
    category: 'seasonal',
    description: 'Accumulate 10,000 seasonal arcade points and win 15 ranked duels',
    progress: 6850,
    target: 10000,
    unit: 'pts',
    rewardXP: 1200,
    rewardCoins: 800,
    rewardCosmetic: {
      id: 'title_ember_lord',
      name: 'Ember Sovereign Title & Badge',
      type: 'Exclusive Title'
    },
    completed: false,
    claimed: false,
    expiresIn: '18d remaining'
  }
];

export const STORE_ITEMS: StoreItem[] = [
  // Free Rewards (Purchasable with Arcade Coins)
  {
    id: 'frame_ember_phoenix',
    name: 'Ember Phoenix Crest',
    category: 'frame',
    costCoins: 800,
    isPaid: false,
    rarity: 'Legendary',
    description: 'A blazing animated avatar frame radiating glowing embers and solar plumage.',
    preview: '🔥',
    owned: true
  },
  {
    id: 'frame_neon_core',
    name: 'Cybernetic Conduit',
    category: 'frame',
    costCoins: 500,
    isPaid: false,
    rarity: 'Epic',
    description: 'Pulsing laser circuit frame with reactive edge conduits.',
    preview: '⚡',
    owned: false
  },
  {
    id: 'frame_gold_laurel',
    name: 'Victors Gilded Laurel',
    category: 'frame',
    costCoins: 650,
    isPaid: false,
    rarity: 'Epic',
    description: 'Ancient bronze and gold wreath awarded for competitive milestones.',
    preview: '👑',
    owned: false
  },
  {
    id: 'bg_ember_void',
    name: 'Ember Nebula Backdrop',
    category: 'background',
    costCoins: 400,
    isPaid: false,
    rarity: 'Rare',
    description: 'Deep cosmic obsidian nebula shimmering with drifting red sparks.',
    preview: '🌌',
    owned: true
  },
  {
    id: 'title_grandmaster',
    name: 'Title: "The Unshakable"',
    category: 'title',
    costCoins: 350,
    isPaid: false,
    rarity: 'Rare',
    description: 'Prestige title displayed beneath your gamertag in lobbies and scoreboards.',
    preview: '🏷️',
    owned: false
  },
  {
    id: 'board_theme_crimson',
    name: 'Crimson Glass Board Theme',
    category: 'board_theme',
    costCoins: 600,
    isPaid: false,
    rarity: 'Epic',
    description: 'Obsidian glass tokens and scarlet grid glow for Tactical Matrix.',
    preview: '♟️',
    owned: false
  },
  {
    id: 'emote_fire_gg',
    name: 'Animated Emote: "Flaming GG"',
    category: 'emote',
    costCoins: 250,
    isPaid: false,
    rarity: 'Common',
    description: 'Send this fiery salute to opponents in multiplayer and Pass & Play matches.',
    preview: '💬',
    owned: false
  },

  // Paid Store (Purely cosmetic bundles, real money)
  {
    id: 'bundle_crimson_phoenix',
    name: 'Crimson Phoenix Prestige Bundle',
    category: 'frame',
    costRealMoney: '$4.99',
    isPaid: true,
    rarity: 'Legendary',
    description: 'Includes Exclusive Phoenix Avatar Frame, Ember Trail Effect, and "Solar Ascendant" Title.',
    preview: '💎',
    owned: false
  },
  {
    id: 'bundle_cyber_ronin',
    name: 'Cyber Ronin Neon Collection',
    category: 'avatar',
    costRealMoney: '$3.99',
    isPaid: true,
    rarity: 'Epic',
    description: 'Set of 4 illustrated cyber samurai avatars, matching neon nameplate & battle card back.',
    preview: '⚔️',
    owned: false
  },
  {
    id: 'bundle_starlight_emotes',
    name: 'Cosmic Animated Emote Pack',
    category: 'emote',
    costRealMoney: '$1.99',
    isPaid: true,
    rarity: 'Rare',
    description: '8 expressive in-match reaction emotes including Laser Clap, Thinking Bot, and Mind Blown.',
    preview: '✨',
    owned: false
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Friend Request Received',
    message: 'EchoStrike (@EchoStrike) sent you a friend request.',
    time: '20m ago',
    read: false,
    type: 'friend_request'
  },
  {
    id: 'notif_2',
    title: 'Game Invite',
    message: 'Vortex_Rider invited you to a Tactical Matrix match!',
    time: '45m ago',
    read: false,
    type: 'game_invite'
  },
  {
    id: 'notif_3',
    title: 'Challenge Completed!',
    message: 'You completed "Grid Fusion"! Claim 100 XP and 40 Arcade Coins.',
    time: '2h ago',
    read: false,
    type: 'challenge'
  }
];

export const MOCK_LOCAL_ROOMS = [
  {
    id: 'room_1',
    roomCode: '7492',
    name: 'LivingRoom-Pad',
    hostDevice: 'Galaxy Tab S9',
    gameTitle: 'Tactical Matrix',
    gameId: 'tactical_board',
    playerCount: 1,
    maxPlayers: 2,
    ping: 12,
    isLocalWifi: true
  },
  {
    id: 'room_2',
    roomCode: '3819',
    name: "Alex's Pixel 9",
    hostDevice: 'Google Pixel 9 Pro',
    gameTitle: 'Neon Rush Duel',
    gameId: 'neon_rush',
    playerCount: 1,
    maxPlayers: 2,
    ping: 18,
    isLocalWifi: true
  },
  {
    id: 'room_3',
    roomCode: '9045',
    name: 'GameLounge-Host',
    hostDevice: 'Local Gateway AP',
    gameTitle: 'Quantum Grid Race',
    gameId: 'quantum_grid',
    playerCount: 2,
    maxPlayers: 4,
    ping: 24,
    isLocalWifi: true
  }
];


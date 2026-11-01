import React, { useState } from 'react';
import { Users, Wifi, Globe, Play, Plus, RefreshCw, Smartphone, ShieldCheck, Zap, Lock, Eye, Trophy, Clock } from 'lucide-react';
import { GameItem, LocalLobbyRoom } from '../../types.ts';
import { MOCK_LOCAL_ROOMS } from '../../data/games.ts';
import { playSound } from '../../utils/audio.ts';

interface MultiplayerHubViewProps {
  games: GameItem[];
  onLaunchGame: (game: GameItem, mode: 'pass_and_play' | 'local_wifi') => void;
}

export const MultiplayerHubView: React.FC<MultiplayerHubViewProps> = ({
  games,
  onLaunchGame
}) => {
  const [hubMode, setHubMode] = useState<'pass_and_play' | 'local_radar' | 'tournaments'>('pass_and_play');
  const [rooms, setRooms] = useState<LocalLobbyRoom[]>(MOCK_LOCAL_ROOMS);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newRoomName, setNewRoomName] = useState<string>('My Arcade Party');
  const [isPrivateRoom, setIsPrivateRoom] = useState<boolean>(false);
  const [selectedGameId, setSelectedGameId] = useState<string>('tactical_board');
  const [pinCode, setPinCode] = useState<string>('');
  const [joinSuccessMessage, setJoinSuccessMessage] = useState<string | null>(null);

  const passAndPlayGames = games.filter(g => g.modes.includes('pass_and_play'));

  const handleScanWifi = () => {
    setIsScanning(true);
    playSound.tab();
    setTimeout(() => {
      setIsScanning(false);
      playSound.victory();
    }, 700);
  };

  const handleJoinRoom = (room: LocalLobbyRoom) => {
    playSound.click();
    const game = games.find(g => g.id === room.gameId) || games[0];
    setJoinSuccessMessage(`Connected to ${room.name} (${room.hostDevice})! Launching match...`);
    setTimeout(() => {
      setJoinSuccessMessage(null);
      onLaunchGame(game, 'local_wifi');
    }, 850);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const game = games.find(g => g.id === selectedGameId) || games[0];
    const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
    const newRoom: LocalLobbyRoom = {
      id: `room_${Date.now()}`,
      roomCode: generatedPin,
      name: newRoomName + (isPrivateRoom ? ' (Private)' : ''),
      hostDevice: 'Your Phone (Host)',
      gameTitle: game.title,
      gameId: game.id,
      playerCount: 1,
      maxPlayers: 2,
      ping: 8,
      isLocalWifi: true
    };
    setRooms([newRoom, ...rooms]);
    setShowCreateModal(false);
    playSound.victory();
    setJoinSuccessMessage(`Lobby created! Room Code: ${newRoom.roomCode}. Waiting for opponent...`);
    setTimeout(() => {
      setJoinSuccessMessage(null);
      onLaunchGame(game, 'local_wifi');
    }, 1200);
  };

  const handleJoinByPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode) return;
    const targetRoom = rooms.find(r => r.roomCode === pinCode.trim()) || rooms[0];
    handleJoinRoom(targetRoom);
  };

  return (
    <div className="space-y-4 px-4 pb-20 pt-2">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-[#F5F7FA] font-display">
          Multiplayer Party Hub
        </h2>
        <div className="text-xs text-[#9AA4B2]">
          Play together on one phone, across local Wi-Fi, or custom rooms
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#151B23] rounded-2xl border border-[#28313D]">
        <button
          onClick={() => { playSound.tab(); setHubMode('pass_and_play'); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
            hubMode === 'pass_and_play' ? 'bg-[#FF4D36] text-white shadow-sm' : 'text-[#9AA4B2] hover:text-[#F5F7FA]'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Pass & Play</span>
        </button>

        <button
          onClick={() => { playSound.tab(); setHubMode('local_radar'); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
            hubMode === 'local_radar' ? 'bg-[#FF4D36] text-white shadow-sm' : 'text-[#9AA4B2] hover:text-[#F5F7FA]'
          }`}
        >
          <Wifi className="w-3.5 h-3.5" />
          <span>Local Wi-Fi</span>
        </button>

        <button
          onClick={() => { playSound.tab(); setHubMode('tournaments'); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
            hubMode === 'tournaments' ? 'bg-[#FF4D36] text-white shadow-sm' : 'text-[#9AA4B2] hover:text-[#F5F7FA]'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Tournaments</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {joinSuccessMessage && (
        <div className="p-3 rounded-2xl bg-[#00D9A6]/15 border border-[#00D9A6]/40 text-xs font-bold text-[#00D9A6] flex items-center gap-2 animate-in fade-in">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{joinSuccessMessage}</span>
        </div>
      )}

      {/* TAB 1: PASS & PLAY */}
      {hubMode === 'pass_and_play' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#151B23] border border-[#28313D]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF4D36] mb-1">
              <Zap className="w-4 h-4 fill-[#FF4D36]" />
              <span>OFFLINE SAME-DEVICE DUELS</span>
            </div>
            <p className="text-xs text-[#9AA4B2] leading-relaxed">
              No internet or cables needed. Pass the phone back and forth or play simultaneously on opposite sides of the screen.
            </p>
          </div>

          <div className="space-y-3">
            {passAndPlayGames.map(game => (
              <div
                key={game.id}
                className="p-3.5 rounded-2xl bg-[#151B23] border border-[#28313D] hover:border-[#FF4D36]/50 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={game.image} alt={game.title} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#28313D]" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[#F5F7FA] font-display truncate">{game.title}</h4>
                    <p className="text-xs text-[#9AA4B2] line-clamp-1">{game.tagline}</p>
                    <div className="text-[11px] text-[#00D9A6] font-mono mt-1">
                      {game.id === 'tactical_board' ? 'Dual-thumb turn based' : 'Alternate round showdown'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onLaunchGame(game, 'pass_and_play')}
                  className="px-4 py-2.5 rounded-xl bg-[#FF4D36] hover:bg-[#ff3820] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#FF4D36]/30 active:scale-95 transition-all shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Duel</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LOCAL WI-FI RADAR & PRIVATE ROOMS */}
      {hubMode === 'local_radar' && (
        <div className="space-y-4">
          {/* Join by PIN */}
          <form
            onSubmit={handleJoinByPin}
            className="p-4 rounded-2xl bg-[#151B23] border border-[#28313D] flex items-center gap-2"
          >
            <input
              type="text"
              maxLength={4}
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              placeholder="Enter 4-Digit Room Code"
              className="flex-1 h-11 px-3.5 rounded-xl bg-[#0B0F14] border border-[#28313D] text-xs font-mono font-bold tracking-widest text-[#F5F7FA] placeholder-[#9AA4B2] outline-none focus:border-[#FF4D36]"
            />
            <button
              type="submit"
              disabled={!pinCode}
              className="h-11 px-4 rounded-xl bg-[#FF4D36] disabled:opacity-40 text-white text-xs font-bold active:scale-95 transition-transform"
            >
              Join PIN
            </button>
          </form>

          {/* Action Row */}
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-[#F5F7FA] flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-[#00D9A6]" />
              <span>Nearby Rooms on Local Wi-Fi</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleScanWifi}
                disabled={isScanning}
                className="w-8 h-8 rounded-lg bg-[#151B23] border border-[#28313D] flex items-center justify-center text-[#9AA4B2] hover:text-[#F5F7FA] active:scale-95 transition-all"
                title="Rescan"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-[#FF4D36]' : ''}`} />
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-3 py-1.5 rounded-lg bg-[#FF4D36] text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Host Room</span>
              </button>
            </div>
          </div>

          {/* Rooms List */}
          <div className="space-y-2.5">
            {rooms.map(room => (
              <div
                key={room.id}
                className="p-3.5 rounded-2xl bg-[#151B23] border border-[#28313D] hover:border-[#00D9A6]/50 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[#F5F7FA] truncate">{room.name}</h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0B0F14] border border-[#28313D] text-[#FF4D36] font-mono">
                      #{room.roomCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-[#9AA4B2] font-mono">
                    <span className="text-[#00D9A6]">{room.gameTitle}</span>
                    <span>·</span>
                    <span>{room.hostDevice}</span>
                    <span>·</span>
                    <span className="text-[#00D9A6]">{room.ping}ms</span>
                  </div>
                </div>

                <button
                  onClick={() => handleJoinRoom(room)}
                  className="px-4 py-2 rounded-xl bg-[#00D9A6] text-[#0B0F14] text-xs font-bold active:scale-95 transition-transform shrink-0"
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOM TOURNAMENTS & SPECTATOR (With Coming Soon tags) */}
      {hubMode === 'tournaments' && (
        <div className="space-y-4">
          {/* Custom Tournaments Card */}
          <div className="p-4 rounded-3xl bg-[#151B23] border border-[#28313D] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#FF9E2C]" />
                <h3 className="text-sm font-bold text-[#F5F7FA] font-display">Custom Bracket Tournaments</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF4D36]/20 text-[#FF4D36] border border-[#FF4D36]/40 font-mono font-bold">
                Coming Soon
              </span>
            </div>
            <p className="text-xs text-[#9AA4B2] leading-relaxed">
              Create single-elimination or round-robin tournaments for up to 32 players across your campus, office, or gaming club.
            </p>
            <div className="p-3 rounded-2xl bg-[#0B0F14] border border-[#28313D] flex items-center justify-between text-xs text-[#9AA4B2]">
              <span>Tournament Engine Integration</span>
              <span className="text-[#FF9E2C] font-mono font-medium">In Development (Q1 2027)</span>
            </div>
          </div>

          {/* Spectator Mode Card */}
          <div className="p-4 rounded-3xl bg-[#151B23] border border-[#28313D] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#00D9A6]" />
                <h3 className="text-sm font-bold text-[#F5F7FA] font-display">Live Match Spectator Mode</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00D9A6]/20 text-[#00D9A6] border border-[#00D9A6]/40 font-mono font-bold">
                Coming Soon
              </span>
            </div>
            <p className="text-xs text-[#9AA4B2] leading-relaxed">
              Watch friends duel in real time with synchronized turn camera, commentator emoji reactions, and live win probabilities.
            </p>
            <div className="p-3 rounded-2xl bg-[#0B0F14] border border-[#28313D] flex items-center justify-between text-xs text-[#9AA4B2]">
              <span>Low-Latency WebRTC Streamer</span>
              <span className="text-[#00D9A6] font-mono font-medium">Coming in v2.4</span>
            </div>
          </div>
        </div>
      )}

      {/* Host Room Dialog Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreateRoom}
            className="w-full max-w-md bg-[#151B23] border border-[#28313D] rounded-3xl p-5 shadow-2xl space-y-4"
          >
            <h3 className="text-sm font-bold text-[#F5F7FA] font-display">
              Host Local Wi-Fi Party Room
            </h3>

            <div>
              <label className="text-[11px] font-bold text-[#9AA4B2] uppercase block mb-1">
                Room Name
              </label>
              <input
                type="text"
                required
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="w-full h-10 px-3 bg-[#0B0F14] border border-[#28313D] rounded-xl text-xs text-[#F5F7FA] outline-none focus:border-[#FF4D36]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#9AA4B2] uppercase block mb-1">
                Select Game
              </label>
              <select
                value={selectedGameId}
                onChange={(e) => setSelectedGameId(e.target.value)}
                className="w-full h-10 px-3 bg-[#0B0F14] border border-[#28313D] rounded-xl text-xs text-[#F5F7FA] outline-none focus:border-[#FF4D36]"
              >
                {games.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.title} ({g.playerCountLabel})
                  </option>
                ))}
              </select>
            </div>

            {/* Private Room PIN Toggle */}
            <div className="p-3 rounded-xl bg-[#0B0F14] border border-[#28313D] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#FF9E2C]" />
                <div>
                  <div className="text-xs font-bold text-[#F5F7FA]">Private Room (PIN Protected)</div>
                  <div className="text-[10px] text-[#9AA4B2]">Only players with 4-digit PIN can join</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isPrivateRoom}
                onChange={(e) => setIsPrivateRoom(e.target.checked)}
                className="w-4 h-4 accent-[#FF4D36]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 h-10 rounded-xl bg-[#0B0F14] border border-[#28313D] text-xs font-bold text-[#9AA4B2]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-10 rounded-xl bg-[#FF4D36] text-white text-xs font-bold active:scale-95"
              >
                Start Lobby
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { X, Sparkles, Check, ShieldCheck, Flame, Zap, Crown } from 'lucide-react';
import { UserProfile } from '../../types.ts';
import { playSound } from '../../utils/audio.ts';

interface ArcadePlusModalProps {
  user: UserProfile;
  onClose: () => void;
  onTogglePlusSubscription: () => void;
}

export const ArcadePlusModal: React.FC<ArcadePlusModalProps> = ({
  user,
  onClose,
  onTogglePlusSubscription
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const freePerks = [
    'Access to all core arcade games',
    'Offline gameplay & instant loading',
    'Local multiplayer & Pass & Play',
    'Standard AI difficulty bot engines',
    'Daily and weekly challenges',
    'Basic player statistics & level progression',
    'Standard achievements & trophy hall',
    'Earn Arcade Coins in games & quests',
    'Access to competitive ELO leaderboards'
  ];

  const plusPerks = [
    'Exclusive Phoenix cosmetic collection & animated frames',
    'Premium profile customization (auras & animated banners)',
    'Advanced player statistics & performance analysis',
    'Detailed match history telemetry & win-loss breakdown',
    '100% Ad-free experience across all devices',
    'Exclusive "Plus Member" badge on leaderboards',
    '+50% bonus Arcade Coins on all daily challenges',
    'Priority matchmaking queue & early tournament access'
  ];

  const handleSubscribe = () => {
    playSound.victory();
    onTogglePlusSubscription();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] bg-[#151B23] border border-[#FF4D36]/40 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#0B0F14]/80 border border-[#28313D] flex items-center justify-center text-[#9AA4B2] hover:text-[#F5F7FA]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Header */}
        <div className="p-5 bg-gradient-to-br from-[#1F1418] via-[#151B23] to-[#141C25] border-b border-[#28313D] text-center relative overflow-hidden shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF4D36] to-[#FF9E2C] flex items-center justify-center mx-auto mb-2 text-white shadow-lg shadow-[#FF4D36]/30">
            <Crown className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-[#F5F7FA] font-display">
            NovaArcade <span className="text-[#FF4D36]">Plus</span>
          </h2>
          <p className="text-xs text-[#9AA4B2] max-w-sm mx-auto mt-1">
            Premium cosmetic prestige, deeper performance analytics, and member flair.
          </p>

          {/* Pricing Selector */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => { playSound.tab(); setBillingCycle('annual'); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-[#FF4D36] text-white shadow-md shadow-[#FF4D36]/30'
                  : 'bg-[#0B0F14] text-[#9AA4B2] border border-[#28313D]'
              }`}
            >
              Annual: $39.99 / yr <span className="text-[#00D9A6] font-mono">(Save 33%)</span>
            </button>
            <button
              onClick={() => { playSound.tab(); setBillingCycle('monthly'); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-[#FF4D36] text-white shadow-md shadow-[#FF4D36]/30'
                  : 'bg-[#0B0F14] text-[#9AA4B2] border border-[#28313D]'
              }`}
            >
              Monthly: $4.99 / mo
            </button>
          </div>
        </div>

        {/* Scrollable Benefits Matrix */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Core Non-P2W Guarantee Box */}
          <div className="p-3 rounded-2xl bg-[#0B0F14] border border-[#28313D] flex items-start gap-2.5 text-xs text-[#9AA4B2]">
            <ShieldCheck className="w-4 h-4 text-[#00D9A6] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong className="text-[#F5F7FA]">Fair Play Commitment:</strong> We never lock core games, fair competitive matchmaking, or essential multiplayer features behind a subscription.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Free Tier */}
            <div className="p-3.5 rounded-2xl bg-[#0B0F14] border border-[#28313D] flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#F5F7FA] uppercase tracking-wider mb-2">
                  Free Membership
                </h4>
                <ul className="space-y-1.5 text-[11px] text-[#9AA4B2]">
                  {freePerks.map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#00D9A6] shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-3 pt-2 border-t border-[#28313D] text-[10px] text-[#9AA4B2]">
                Always Free Forever
              </div>
            </div>

            {/* Plus Tier */}
            <div className="p-3.5 rounded-2xl bg-[#1C2330] border border-[#FF4D36]/60 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-[#FF4D36] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Arcade Plus</span>
                  </h4>
                  <span className="text-[10px] text-[#00D9A6] font-mono font-bold">
                    {billingCycle === 'annual' ? '$3.33/mo' : '$4.99/mo'}
                  </span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-[#F5F7FA]">
                  {plusPerks.map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#FF4D36] shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-3 pt-2 border-t border-[#FF4D36]/30 text-[10px] text-[#FF9E2C]">
                Cancel Anytime in Account Settings
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-[#151B23] border-t border-[#28313D] shrink-0 flex flex-col gap-2">
          <button
            onClick={handleSubscribe}
            className="w-full h-11 rounded-xl bg-[#FF4D36] hover:bg-[#ff3820] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D36]/30 active:scale-95 transition-transform"
          >
            <Crown className="w-4 h-4" />
            <span>
              {user.isArcadePlus
                ? 'Manage / Cancel Plus Membership'
                : `Join Arcade Plus (${billingCycle === 'annual' ? '$39.99/yr' : '$4.99/mo'})`}
            </span>
          </button>
          <div className="text-center text-[10px] text-[#9AA4B2]">
            Subscription automatically renews unless cancelled 24 hours prior to billing date.
          </div>
        </div>
      </div>
    </div>
  );
};

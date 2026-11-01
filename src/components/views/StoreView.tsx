import React, { useState } from 'react';
import { ArrowLeft, Coins, ShoppingBag, Sparkles, Check, ShieldCheck, Tag, CreditCard } from 'lucide-react';
import { StoreItem, UserProfile } from '../../types.ts';
import { STORE_ITEMS } from '../../data/games.ts';
import { playSound } from '../../utils/audio.ts';

interface StoreViewProps {
  user: UserProfile;
  onClose: () => void;
  onPurchaseItem: (item: StoreItem) => boolean;
  onOpenArcadePlus: () => void;
}

export const StoreView: React.FC<StoreViewProps> = ({
  user,
  onClose,
  onPurchaseItem,
  onOpenArcadePlus
}) => {
  const [storeTab, setStoreTab] = useState<'free_rewards' | 'paid_store'>('free_rewards');
  const [purchaseToast, setPurchaseToast] = useState<string | null>(null);

  const freeItems = STORE_ITEMS.filter(item => !item.isPaid);
  const paidItems = STORE_ITEMS.filter(item => item.isPaid);

  const handleBuy = (item: StoreItem) => {
    const success = onPurchaseItem(item);
    if (success) {
      playSound.victory();
      setPurchaseToast(`Unlocked "${item.name}"!`);
      setTimeout(() => setPurchaseToast(null), 3000);
    } else {
      playSound.tab();
      setPurchaseToast(`Insufficient Arcade Coins! Complete challenges to earn more.`);
      setTimeout(() => setPurchaseToast(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F14] text-[#F5F7FA] flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-[#28313D] bg-[#151B23]/90 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onClose}
            aria-label="Back"
            className="w-9 h-9 rounded-xl bg-[#0B0F14] border border-[#28313D] flex items-center justify-center text-[#9AA4B2] hover:text-[#F5F7FA] active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-[#F5F7FA] font-display flex items-center gap-1.5">
              <span>Arcade Store & Rewards</span>
            </h2>
            <div className="text-[11px] text-[#9AA4B2]">Customise your profile and game boards</div>
          </div>
        </div>

        {/* User Balance Display */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0B0F14] border border-[#28313D] font-mono font-bold text-xs text-[#FF9E2C]">
          <Coins className="w-4 h-4 fill-[#FF9E2C] text-[#FF9E2C]" />
          <span>{user.arcadeCoins.toLocaleString()} Coins</span>
        </div>
      </div>

      {/* Reassurance Banner */}
      <div className="shrink-0 px-4 py-2 bg-[#151B23] border-b border-[#28313D] flex items-center justify-between text-[11px] text-[#00D9A6]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Fair Play Guarantee: All purchases are 100% cosmetic. No pay-to-win mechanics.</span>
        </div>
      </div>

      {/* Tabs: Free Rewards vs Paid Store */}
      <div className="shrink-0 px-4 py-2.5 bg-[#151B23]/50 border-b border-[#28313D] flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-[#0B0F14] rounded-xl border border-[#28313D] flex-1 max-w-xs">
          <button
            onClick={() => { playSound.tab(); setStoreTab('free_rewards'); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              storeTab === 'free_rewards' ? 'bg-[#FF4D36] text-white shadow-sm' : 'text-[#9AA4B2]'
            }`}
          >
            Coins Catalog (Free)
          </button>
          <button
            onClick={() => { playSound.tab(); setStoreTab('paid_store'); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              storeTab === 'paid_store' ? 'bg-[#FF4D36] text-white shadow-sm' : 'text-[#9AA4B2]'
            }`}
          >
            Bundles & Bundles
          </button>
        </div>

        <button
          onClick={onOpenArcadePlus}
          className="text-xs font-bold text-[#FF9E2C] hover:underline flex items-center gap-1 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Arcade Plus</span>
        </button>
      </div>

      {/* Purchase Feedback Toast */}
      {purchaseToast && (
        <div className="mx-4 mt-2 p-3 rounded-2xl bg-[#00D9A6]/15 border border-[#00D9A6]/40 text-xs font-bold text-[#00D9A6] flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{purchaseToast}</span>
        </div>
      )}

      {/* Store Items Grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-8">
        {/* FREE REWARDS SECTION */}
        {storeTab === 'free_rewards' && (
          <div className="space-y-3">
            <div className="text-xs text-[#9AA4B2]">
              Earn coins by completing daily missions, weekly challenges, and maintaining login streaks.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {freeItems.map(item => {
                const isOwned = user.unlockedItems.includes(item.id) || item.owned;
                const canAfford = (user.arcadeCoins >= (item.costCoins || 0));

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#151B23] border border-[#28313D] flex flex-col justify-between gap-3 shadow-sm hover:border-[#FF4D36]/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#0B0F14] border border-[#28313D] flex items-center justify-center text-2xl shrink-0">
                        {item.preview}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-[#F5F7FA] truncate">{item.name}</h4>
                          <span className={`text-[9px] px-1 rounded font-mono ${
                            item.rarity === 'Legendary' ? 'bg-[#FF4D36]/20 text-[#FF4D36]' :
                            item.rarity === 'Epic' ? 'bg-[#FF9E2C]/20 text-[#FF9E2C]' : 'bg-[#00D9A6]/20 text-[#00D9A6]'
                          }`}>
                            {item.rarity}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#9AA4B2] mt-0.5 leading-relaxed">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#28313D]/60">
                      <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#FF9E2C]">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{item.costCoins} Coins</span>
                      </div>

                      {isOwned ? (
                        <span className="text-xs font-bold text-[#00D9A6] flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Unlocked
                        </span>
                      ) : (
                        <button
                          onClick={() => handleBuy(item)}
                          disabled={!canAfford}
                          className="px-4 py-1.5 rounded-xl bg-[#FF4D36] disabled:opacity-40 text-white font-bold text-xs active:scale-95 transition-transform shadow-md shadow-[#FF4D36]/20"
                        >
                          Buy with Coins
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PAID STORE SECTION */}
        {storeTab === 'paid_store' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#1C2330] border border-[#FF4D36]/40 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#F5F7FA]">Premium Cosmetic Collections</h4>
                <p className="text-[11px] text-[#9AA4B2]">Support arcade development with purely aesthetic player flair.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {paidItems.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#151B23] border border-[#28313D] flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-[#0B0F14] border border-[#FF4D36]/40 flex items-center justify-center text-3xl shrink-0 shadow-lg shadow-[#FF4D36]/20">
                      {item.preview}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#F5F7FA]">{item.name}</h4>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FF4D36]/20 text-[#FF4D36] font-bold">
                          {item.rarity}
                        </span>
                      </div>
                      <p className="text-xs text-[#9AA4B2] mt-0.5 max-w-sm">{item.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playSound.victory();
                      setPurchaseToast(`Purchased bundle "${item.name}"!`);
                      setTimeout(() => setPurchaseToast(null), 3000);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#00D9A6] text-[#0B0F14] font-bold text-xs flex items-center gap-1.5 shrink-0 active:scale-95 transition-transform"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{item.costRealMoney}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

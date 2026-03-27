'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Award, Lock, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const REWARD_TIERS = [
  { name: 'T-Shirt', points: 500, icon: '👕' },
  { name: 'Long Sleeve', points: 1250, icon: '🧥' },
  { name: 'Hoodie', points: 2000, icon: '🧤' },
  { name: 'Backpack', points: 2750, icon: '🎒' },
];

interface BadgeData {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  earnedAt?: string;
  icon?: string;
}

interface BadgesData {
  badges: BadgeData[];
  totalPoints: number;
}

export default function BadgesPage() {
  const [data, setData] = useState<BadgesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claimingTier, setClaimingTier] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/development/badges')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch badges');
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleClaim = async (tierName: string) => {
    setClaimingTier(tierName);
    try {
      const res = await fetch('/api/development/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimTier: tierName }),
      });
      if (!res.ok) throw new Error('Failed to claim');
      toast({
        title: 'Reward claimed!',
        description: `Your ${tierName} has been claimed.`,
      });
    } catch (err) {
      toast({
        title: 'Claim failed',
        description: (err as Error).message,
        variant: 'destructive',
      });
    } finally {
      setClaimingTier(null);
    }
  };

  const totalPoints = data?.totalPoints ?? 0;

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-700">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Badges & Rewards</h1>
        <p className="text-slate-600 mt-1">
          Earn badges and claim rewards with your points.
        </p>
      </div>

      {/* Reward tiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-blue-600" />
            Reward Tiers
          </CardTitle>
          <p className="text-sm text-slate-600">
            Your points: <span className="font-semibold text-blue-600">{totalPoints} pts</span>
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {REWARD_TIERS.map((tier) => {
                const canClaim = totalPoints >= tier.points;
                return (
                  <div
                    key={tier.name}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{tier.icon}</span>
                      <div>
                        <p className="font-medium text-slate-900">{tier.name}</p>
                        <p className="text-sm text-slate-600">
                          {tier.points} points required
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 shrink-0"
                      disabled={!canClaim || claimingTier === tier.name}
                      onClick={() => handleClaim(tier.name)}
                    >
                      {claimingTier === tier.name
                        ? 'Claiming...'
                        : canClaim
                        ? 'Claim'
                        : 'Locked'}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Badges grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Badges
          </CardTitle>
          <p className="text-sm text-slate-600">
            Earn badges by completing assignments and drills.
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
          ) : data?.badges?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-lg border ${
                    badge.earned
                      ? 'border-blue-200 bg-blue-50/50'
                      : 'border-slate-200 bg-slate-50/50 opacity-75'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {badge.earned ? (
                      <Award className="h-10 w-10 text-blue-600 shrink-0" />
                    ) : (
                      <Lock className="h-10 w-10 text-slate-400 shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-slate-900">{badge.name}</p>
                      <p className="text-sm text-slate-600 mt-1">
                        {badge.description}
                      </p>
                      {badge.earnedAt && (
                        <p className="text-xs text-slate-500 mt-1">
                          Earned {badge.earnedAt}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-8">
              No badges available yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

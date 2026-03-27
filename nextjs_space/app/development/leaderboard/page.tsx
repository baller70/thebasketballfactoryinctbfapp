'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const FILTER_TABS = [
  'Overall',
  'Ball Handling',
  'Shooting',
  'Finishing',
  'Defense',
  'Speed & Agility',
  'Footwork',
] as const;

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  image?: string;
  points: number;
  categoryPoints?: number;
}

export default function LeaderboardPage() {
  const [data, setData] = useState<Record<string, LeaderboardEntry[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Overall');

  useEffect(() => {
    // API expects category=all or categoryId; use 'all' for Overall, category names may need backend mapping
    const category = activeTab === 'Overall' ? 'all' : activeTab;
    fetch(`/api/development/leaderboard?category=${encodeURIComponent(category)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch leaderboard');
        return res.json();
      })
      .then((res) => {
        const list = res.leaderboard ?? [];
        setData((prev) => ({
          ...prev,
          [activeTab]: list.map((p: { playerId: string; rank: number; name: string; points: number; profileImage?: string }) => ({
            id: p.playerId,
            rank: p.rank,
            name: p.name,
            points: p.points,
            image: p.profileImage ?? undefined,
          })),
        }));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const entries = data[activeTab] ?? [];
  const topThree = entries.slice(0, 3);

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
        <h1 className="text-2xl font-bold text-slate-900">Leaderboard</h1>
        <p className="text-slate-600 mt-1">
          See how you rank against other players.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rankings</CardTitle>
          <p className="text-sm text-slate-600">
            Filter by skill category
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap h-auto gap-2 bg-slate-100 p-2">
              {FILTER_TABS.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Top 3 podium */}
                  {topThree.length > 0 && (
                    <div className="flex justify-center gap-4 mb-8 py-6 bg-slate-50 rounded-lg">
                      {topThree[1] && (
                        <div className="flex flex-col items-center order-2">
                          <div className="relative">
                            <Avatar className="h-16 w-16 border-4 border-slate-300">
                              <AvatarImage src={topThree[1].image} />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {topThree[1].name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -top-2 -right-2 bg-slate-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                              2
                            </div>
                          </div>
                          <p className="font-medium text-slate-900 mt-2">
                            {topThree[1].name}
                          </p>
                          <p className="text-sm text-blue-600 font-semibold">
                            {topThree[1].points} pts
                          </p>
                        </div>
                      )}
                      {topThree[0] && (
                        <div className="flex flex-col items-center order-1">
                          <div className="relative">
                            <Avatar className="h-20 w-20 border-4 border-amber-400">
                              <AvatarImage src={topThree[0].image} />
                              <AvatarFallback className="bg-amber-100 text-amber-700">
                                {topThree[0].name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
                              1
                            </div>
                          </div>
                          <p className="font-medium text-slate-900 mt-2">
                            {topThree[0].name}
                          </p>
                          <p className="text-sm text-blue-600 font-semibold">
                            {topThree[0].points} pts
                          </p>
                        </div>
                      )}
                      {topThree[2] && (
                        <div className="flex flex-col items-center order-3">
                          <div className="relative">
                            <Avatar className="h-14 w-14 border-4 border-amber-700">
                              <AvatarImage src={topThree[2].image} />
                              <AvatarFallback className="bg-amber-200 text-amber-800">
                                {topThree[2].name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -top-2 -right-2 bg-amber-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                              3
                            </div>
                          </div>
                          <p className="font-medium text-slate-900 mt-2">
                            {topThree[2].name}
                          </p>
                          <p className="text-sm text-blue-600 font-semibold">
                            {topThree[2].points} pts
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Full list */}
                  <div className="space-y-2">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50"
                      >
                        <span
                          className={cn(
                            'w-8 text-center font-bold',
                            entry.rank === 1 && 'text-amber-500',
                            entry.rank === 2 && 'text-slate-400',
                            entry.rank === 3 && 'text-amber-700',
                            entry.rank > 3 && 'text-slate-600'
                          )}
                        >
                          {entry.rank}
                        </span>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={entry.image} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                            {entry.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex-1 font-medium text-slate-900">
                          {entry.name}
                        </span>
                        <span className="font-semibold text-blue-600">
                          {entry.points} pts
                        </span>
                      </div>
                    ))}
                  </div>

                  {entries.length === 0 && !loading && (
                    <p className="text-center text-slate-500 py-8">
                      No rankings available for this category.
                    </p>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}


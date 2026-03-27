'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Award, CheckCircle, Clock } from 'lucide-react';

const SKILL_CATEGORIES = [
  'Ball Handling',
  'Shooting',
  'Finishing',
  'Defense',
  'Speed & Agility',
  'Footwork',
] as const;

interface OverviewData {
  totalPoints: number;
  badgesEarned: number;
  skillsCompleted?: number;
  skillProgress?: Record<string, number>;
  skillCategoryScores?: Record<string, number>;
  recentActivity?: { id: string; type: string; description: string; date: string }[];
  recentPointHistory?: { id: string; action: string; points: number; details: string; createdAt: string }[];
  upcomingAssignments?: { id: string; title: string; category: string; dueDate: string }[];
  pendingAssignmentsCount?: number;
}

export default function DevelopmentOverviewPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/development/overview')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch overview');
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const playerName = session?.user?.name?.split(' ')[0] ?? 'Player';

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
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {playerName}!
        </h1>
        <p className="text-slate-600 mt-1">
          Track your progress and keep improving.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {loading ? (
          <>
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Points
                </CardTitle>
                <Trophy className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {data?.totalPoints ?? 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Badges Earned
                </CardTitle>
                <Award className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {data?.badgesEarned ?? 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Skills Completed
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {data?.skillsCompleted ?? (data?.skillCategoryScores ? Object.keys(data.skillCategoryScores).length : 0)}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Skill progress */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Category Progress</CardTitle>
          <p className="text-sm text-slate-600">
            Your progress across skill categories
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {SKILL_CATEGORIES.map((_) => (
                <Skeleton key={_} className="h-6 w-full" />
              ))}
            </div>
          ) : (
            SKILL_CATEGORIES.map((category) => {
              const progress = data?.skillProgress?.[category] ?? data?.skillCategoryScores?.[category] ?? 0;
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">{category}</span>
                    <span className="text-slate-600">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-sm text-slate-600">Your latest achievements</p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (data?.recentActivity?.length || data?.recentPointHistory?.length) ? (
              <ul className="space-y-3">
                {(data.recentActivity ?? data.recentPointHistory ?? []).map((item: { id: string; description?: string; details?: string; date?: string; createdAt?: string }) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-50"
                  >
                    <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {item.description ?? item.details ?? 'Activity'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.date ?? (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 py-4">
                No recent activity yet. Complete assignments to see your progress!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
            <p className="text-sm text-slate-600">What&apos;s next</p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : data?.upcomingAssignments?.length ? (
              <ul className="space-y-3">
                {data.upcomingAssignments.map((assignment) => (
                  <li
                    key={assignment.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-50"
                  >
                    <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {assignment.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {assignment.category}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          Due {assignment.dueDate}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 py-4">
                No upcoming assignments. Check back later!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

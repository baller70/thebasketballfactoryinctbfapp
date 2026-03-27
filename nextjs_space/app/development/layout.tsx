'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  ClipboardList,
  Trophy,
  Award,
  HelpCircle,
  LogOut,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/development', label: 'Overview', icon: LayoutDashboard },
  { href: '/development/assignments', label: 'Assignments & Drills', icon: ClipboardList },
  { href: '/development/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/development/badges', label: 'Badges & Rewards', icon: Award },
  { href: '/development/extra-help', label: 'Extra Help', icon: HelpCircle },
];

export default function DevelopmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isLoginPage = pathname === '/development/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-blue-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Sign in required
          </h2>
          <p className="text-slate-600 mb-4">
            Please sign in to access the Player Development Portal.
          </p>
          <Link href="/development/login">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const user = session.user;
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/development" className="flex items-center gap-2">
              <span className="text-xl font-bold text-blue-600">
                Basketball Factory
              </span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/development' &&
                        pathname.startsWith(item.href));
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            'group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6',
                            isActive
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                          )}
                        >
                          <Icon
                            className={cn(
                              'h-5 w-5 shrink-0',
                              isActive ? 'text-blue-600' : 'text-slate-400'
                            )}
                            aria-hidden="true"
                          />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="flex items-center gap-x-3 px-2 py-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.image ?? undefined} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {user?.name ?? 'Player'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-x-2 text-slate-600 hover:text-red-600"
                  onClick={() => signOut({ callbackUrl: '/development/login' })}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-area-pb">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/development' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center flex-1 py-2 text-xs',
                    isActive ? 'text-blue-600' : 'text-slate-500'
                  )}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="truncate max-w-[4rem]">
                    {item.label.split(' ')[0]}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Spacer for mobile bottom nav */}
        <div className="lg:hidden h-20" />
      </main>
    </div>
  );
}

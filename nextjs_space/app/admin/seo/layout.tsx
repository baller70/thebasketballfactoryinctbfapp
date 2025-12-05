
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard,
  Search,
  FileText,
  TrendingUp,
  Upload,
  Sparkles,
  FileCheck,
  BarChart3,
  Settings,
  Target
} from 'lucide-react'

const seoNavigation = [
  { name: 'Dashboard', href: '/admin/seo', icon: LayoutDashboard, exact: true },
  { name: 'Keywords', href: '/admin/seo/keywords', icon: Search },
  { name: 'Pages', href: '/admin/seo/pages', icon: FileText },
  { name: 'Competitors', href: '/admin/seo/competitors', icon: TrendingUp },
  { name: 'Import Data', href: '/admin/seo/import', icon: Upload },
  { name: 'Generate Content', href: '/admin/seo/generate', icon: Sparkles },
  { name: 'Content Review', href: '/admin/seo/content-review', icon: FileCheck },
  { name: 'Reports', href: '/admin/seo/reports', icon: BarChart3 },
  { name: 'Settings', href: '/admin/seo/settings', icon: Settings },
]

export default function SEOLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* SEO Sidebar Navigation */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
            <div className="flex items-center gap-2 text-white">
              <Target className="w-5 h-5" />
              <h2 className="font-bold text-lg">SEO TOOLS</h2>
            </div>
            <p className="text-blue-100 text-xs mt-1">
              Complete SEO Management System
            </p>
          </div>
          
          <nav className="p-2">
            {seoNavigation.map((item) => {
              const isActive = item.exact 
                ? pathname === item.href 
                : pathname.startsWith(item.href)
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mb-1 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="text-sm">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Quick Stats */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              System Status
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Automation</span>
                <span className="text-green-600 font-semibold">Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Google Analytics</span>
                <span className="text-blue-600 font-semibold">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}

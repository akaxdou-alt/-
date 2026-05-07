import { ChefHat, ClipboardList, Home, Refrigerator } from 'lucide-react';
import { familyId } from '../firebase';

const tabs = [
  { id: 'menu', label: '菜单', icon: ChefHat },
  { id: 'order', label: '今晚点单', icon: ClipboardList },
  { id: 'fridge', label: '冰箱', icon: Refrigerator },
  { id: 'admin', label: '管理', icon: Home },
];

export function AppShell({ activeTab, onTabChange, children, orderCount }) {
  return (
    <div className="min-h-screen bg-[#fff9f2]">
      <header className="sticky top-0 z-20 border-b border-rose-100/80 bg-[#fff9f2]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              {familyId}
            </p>
            <h1 className="text-2xl font-bold text-stone-900">今晚吃什么</h1>
          </div>
          <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-rose-700 shadow-sm ring-1 ring-rose-100">
            已点 {orderCount} 道
          </div>
        </div>
      </header>

      <main className="safe-bottom mx-auto max-w-5xl px-4 py-5">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-rose-100 bg-white/95 backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-4 gap-1 px-2 pb-[env(safe-area-inset-bottom)] pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg px-2 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-rose-100 text-rose-700'
                    : 'text-stone-500 hover:bg-amber-50 hover:text-stone-900'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

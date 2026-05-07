import { ChefHat, ClipboardList, Home, Refrigerator } from 'lucide-react';

const tabs = [
  { id: 'menu', label: '菜单', icon: ChefHat },
  { id: 'order', label: '今晚点单', icon: ClipboardList },
  { id: 'fridge', label: '冰箱', icon: Refrigerator },
  { id: 'admin', label: '管理', icon: Home },
];

export function AppShell({ activeTab, onTabChange, children, orderCount }) {
  return (
    <div className="min-h-screen bg-[#070812] text-slate-100">
      <header className="sticky top-0 z-20 border-b border-cyan-400/20 bg-[#070812]/88 shadow-[0_0_28px_rgba(34,211,238,0.12)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-300">
              cyber dinner
            </p>
            <h1 className="mt-1 truncate text-xl font-black text-white sm:text-2xl">
              今晚吃什么 · 小窦cyber饭店
            </h1>
          </div>
          <div className="shrink-0 rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.22)]">
            已点 {orderCount} 道
          </div>
        </div>
      </header>

      <main className="safe-bottom mx-auto max-w-5xl px-4 py-5">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-cyan-400/20 bg-[#090b16]/95 shadow-[0_-12px_34px_rgba(217,70,239,0.12)] backdrop-blur-xl">
        <div className="mx-auto grid max-w-5xl grid-cols-4 gap-1 px-2 pb-[env(safe-area-inset-bottom)] pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg px-2 text-xs font-bold transition ${
                  isActive
                    ? 'border border-cyan-300/50 bg-cyan-300/15 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.24)]'
                    : 'text-slate-400 hover:bg-fuchsia-400/10 hover:text-fuchsia-100'
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

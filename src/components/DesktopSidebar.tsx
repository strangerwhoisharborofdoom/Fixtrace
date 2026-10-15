import React from 'react';
import {
  LayoutDashboard,
  Tv2,
  Sparkles,
  ClipboardList,
  Calculator,
  HardHat,
  BarChart3,
  ShieldAlert,
  QrCode,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DesktopSidebar: React.FC = () => {
  const { activeTab, setActiveTab, t, user, unreadCount } = useApp();

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'appliances', label: t.nav.appliances, icon: Tv2 },
    { id: 'diagnose', label: t.nav.diagnose, icon: Sparkles, badge: 'AI' },
    { id: 'requests', label: t.nav.requests, icon: ClipboardList },
    { id: 'calculator', label: t.nav.calculator, icon: Calculator },
    { id: 'technicians', label: t.nav.technicians, icon: HardHat },
    { id: 'analytics', label: t.nav.analytics, icon: BarChart3 },
    { id: 'admin', label: t.nav.admin, icon: ShieldAlert },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800 bg-slate-900/40 p-4 shrink-0 no-print">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-lime-400 text-slate-950 shadow-md shadow-lime-400/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
                    isActive ? 'bg-slate-950 text-lime-400' : 'bg-lime-400/20 text-lime-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick QR link helper */}
      <div className="mt-auto p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
        <div className="flex items-center gap-2 mb-2">
          <QrCode className="w-4 h-4 text-lime-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Digital Passport</span>
        </div>
        <p className="text-xs text-slate-400 mb-3 leading-relaxed">
          Every appliance has a permanent verifiable maintenance passport.
        </p>
        <button
          onClick={() => setActiveTab('appliances')}
          className="w-full text-center text-xs font-semibold py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
        >
          View Passports
        </button>
      </div>
    </aside>
  );
};

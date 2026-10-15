import React, { useState } from 'react';
import {
  LayoutDashboard,
  Tv2,
  Sparkles,
  ClipboardList,
  Menu,
  Calculator,
  HardHat,
  BarChart3,
  ShieldAlert,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, t, unreadCount } = useApp();
  const [showDrawer, setShowDrawer] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'appliances', label: 'Appliances', icon: Tv2 },
    { id: 'diagnose', label: 'Diagnose', icon: Sparkles, isAi: true },
    { id: 'requests', label: 'Requests', icon: ClipboardList },
  ];

  const moreTabs = [
    { id: 'calculator', label: t.nav.calculator, icon: Calculator },
    { id: 'technicians', label: t.nav.technicians, icon: HardHat },
    { id: 'analytics', label: t.nav.analytics, icon: BarChart3 },
    { id: 'admin', label: t.nav.admin, icon: ShieldAlert },
  ];

  return (
    <>
      {/* Mobile Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-bold text-white uppercase tracking-wider">FixTrace Hub</span>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {moreTabs.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowDrawer(false);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 text-xs font-semibold ${
                      activeTab === item.id
                        ? 'bg-lime-400 text-slate-950 border-lime-400'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 lg:hidden px-2 py-1.5 flex items-center justify-around no-print">
        {mainTabs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive ? 'text-lime-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  item.isAi && isActive
                    ? 'bg-lime-400 text-slate-950 shadow-md shadow-lime-400/30'
                    : item.isAi
                    ? 'bg-lime-400/10 text-lime-400'
                    : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}

        {/* More Menu */}
        <button
          onClick={() => setShowDrawer(true)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all text-slate-400 hover:text-slate-200`}
        >
          <div className="p-1.5 rounded-lg">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </nav>
    </>
  );
};

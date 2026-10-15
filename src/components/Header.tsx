import React, { useState } from 'react';
import {
  Wrench,
  Globe,
  Bell,
  ShieldCheck,
  User,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language, UserRole } from '../types';

export const Header: React.FC<{ onOpenNotifications: () => void }> = ({ onOpenNotifications }) => {
  const {
    language,
    setLanguage,
    t,
    isDemoMode,
    toggleDemoMode,
    resetDemoData,
    user,
    setUserRole,
    unreadCount,
    setActiveTab,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const roles: { id: UserRole; label: string; desc: string }[] = [
    { id: 'customer', label: 'Customer', desc: 'Household appliance owner' },
    { id: 'technician', label: 'Technician', desc: 'Diagnose & submit quotes' },
    { id: 'shop', label: 'Repair Shop', desc: 'Manage jobs & roster' },
    { id: 'admin', label: 'Administrator', desc: 'Verify techs & audit logs' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="w-10 h-10 rounded-xl bg-lime-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-lime-400/20 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white">Fix</span>
              <span className="text-xl font-extrabold tracking-tight text-lime-400">Trace</span>
            </div>
            <span className="text-[10px] font-medium tracking-wide text-slate-400 uppercase hidden sm:inline-block">
              Repair Intelligence
            </span>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Demo Mode Badge & Controls */}
          {isDemoMode ? (
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-lg text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="hidden md:inline">{t.common.demoBadge}</span>
              <button
                onClick={resetDemoData}
                title="Reset sample data"
                className="p-1 hover:text-white rounded hover:bg-amber-500/20 transition-colors ml-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{t.common.liveBadge}</span>
            </div>
          )}

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowLangMenu(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-lime-400" />
              <span className="capitalize hidden sm:inline">{user.role}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50">
                <div className="px-2.5 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Role / Workspace
                </div>
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setUserRole(r.id);
                      setShowRoleMenu(false);
                      if (r.id === 'technician' || r.id === 'shop') {
                        setActiveTab('technicians');
                      } else if (r.id === 'admin') {
                        setActiveTab('admin');
                      } else {
                        setActiveTab('dashboard');
                      }
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex flex-col gap-0.5 transition-colors ${
                      user.role === r.id
                        ? 'bg-lime-400/10 text-lime-400 font-semibold border border-lime-400/20'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="capitalize">{r.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{r.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowRoleMenu(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-300" />
              <span className="uppercase font-mono text-[11px]">{language}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50">
                <button
                  onClick={() => {
                    setLanguage('en');
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                    language === 'en' ? 'bg-lime-400/10 text-lime-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>English</span>
                  <span className="font-mono text-[10px] text-slate-400">EN</span>
                </button>
                <button
                  onClick={() => {
                    setLanguage('kn');
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                    language === 'kn' ? 'bg-lime-400/10 text-lime-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>ಕನ್ನಡ (Kannada)</span>
                  <span className="font-mono text-[10px] text-slate-400">KN</span>
                </button>
                <button
                  onClick={() => {
                    setLanguage('hi');
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                    language === 'hi' ? 'bg-lime-400/10 text-lime-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>हिन्दी (Hindi)</span>
                  <span className="font-mono text-[10px] text-slate-400">HI</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-lime-400 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

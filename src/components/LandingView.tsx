import React from 'react';
import {
  Wrench,
  Sparkles,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Tv2,
  HardHat,
  Cpu,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingView: React.FC<{ onEnterApp: () => void }> = ({ onEnterApp }) => {
  const {
    setActiveTab,
    setSelectedApplianceId,
    setIsDemoMode,
    t,
  } = useApp();

  const handleExploreSamplePassport = () => {
    setSelectedApplianceId('app-001'); // LG Front Load Washer with rich service history
    setActiveTab('passport');
    onEnterApp();
  };

  const handleStartDiagnose = () => {
    setActiveTab('diagnose');
    onEnterApp();
  };

  const handleExploreDemo = () => {
    setIsDemoMode(true);
    setActiveTab('dashboard');
    onEnterApp();
  };

  return (
    <div className="space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-6 sm:pt-12 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FixTrace • Appliance Intelligence Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Intelligent appliance care.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-lime-300 to-emerald-400">
            Never replace what can be repaired.
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Permanent digital Repair Passports, multimodal AI symptom diagnostics, verified technician bids, and spare parts warranties for Indian households.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleStartDiagnose}
            className="px-6 py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-sm shadow-xl shadow-lime-400/20 flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>Diagnose a Fault with AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleExploreSamplePassport}
            className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 flex items-center gap-2 transition-colors"
          >
            <QrCode className="w-4 h-4 text-lime-400" />
            <span>Explore Sample Repair Passport</span>
          </button>

          <button
            onClick={handleExploreDemo}
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-800 flex items-center gap-2 transition-colors"
          >
            <span>Enter Interactive Demo</span>
          </button>
        </div>
      </div>

      {/* 4 Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1 */}
        <div
          onClick={() => {
            setActiveTab('dashboard');
            onEnterApp();
          }}
          className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-lime-400/40 transition-all cursor-pointer space-y-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-lime-400/10 text-lime-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <Tv2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-lime-400 transition-colors">
            Register Appliance
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Create an immutable record of ownership, purchase receipts, and model specs with QR identification stickers.
          </p>
        </div>

        {/* Pillar 2 */}
        <div
          onClick={handleStartDiagnose}
          className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-lime-400/40 transition-all cursor-pointer space-y-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-lime-400/10 text-lime-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-lime-400 transition-colors">
            Diagnose a Problem
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-modal intake in Kannada, Hindi, or English. Gemini analyzes sounds, error codes, and electrical hazards.
          </p>
        </div>

        {/* Pillar 3 */}
        <div
          onClick={() => {
            setActiveTab('technicians');
            onEnterApp();
          }}
          className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-lime-400/40 transition-all cursor-pointer space-y-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-lime-400/10 text-lime-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <HardHat className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-lime-400 transition-colors">
            Verified Technicians
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Itemized quotes from vetted local HVAC, laundry, and kitchen appliance professionals with genuine spare parts.
          </p>
        </div>

        {/* Pillar 4 */}
        <div
          onClick={handleExploreSamplePassport}
          className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-lime-400/40 transition-all cursor-pointer space-y-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-lime-400/10 text-lime-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-lime-400 transition-colors">
            Digital Repair Passport
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Scan QR sticker on any device chassis to view authenticated service history, replaced parts, and post-repair warranties.
          </p>
        </div>
      </div>

      {/* 3-Tier Truth Guarantee Box */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-mono font-bold text-lime-400 uppercase tracking-wider">
            Integrity Standard
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            The FixTrace 3-Tier Truth System
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            We strictly separate customer observations, AI diagnostic hypotheses, and technician-certified facts so users and buyers always have unvarnished truth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
            <span className="text-sky-400 font-bold uppercase text-[10px]">Tier 1: Customer Report</span>
            <h4 className="font-bold text-white">Reported Symptoms</h4>
            <p className="text-slate-400 leading-relaxed">
              Customer descriptions, timestamps, error codes, and photos captured when the fault was first observed.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
            <span className="text-lime-400 font-bold uppercase text-[10px]">Tier 2: AI Preliminary</span>
            <h4 className="font-bold text-white">Component Hypotheses</h4>
            <p className="text-slate-400 leading-relaxed">
              Statistical likelihood generated by Gemini 3.8 Flash, with safety alerts and safe customer checks.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
            <span className="text-emerald-400 font-bold uppercase text-[10px]">Tier 3: Certified Fact</span>
            <h4 className="font-bold text-white">Technician Verification</h4>
            <p className="text-slate-400 leading-relaxed">
              Physical multimeter readings, OEM part numbers, actual costs, and technician-signed warranty terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  CheckCircle2,
  Clock,
  IndianRupee,
  ShieldAlert,
  Percent,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR, formatKolkataDate } from '../utils/formatters';

export const AnalyticsView: React.FC = () => {
  const { records, repairRequests, quotes, appliances, isDemoMode } = useApp();

  // Category breakdown
  const categorySpend: Record<string, number> = {};
  records.forEach((r) => {
    const app = appliances.find((a) => a.id === r.applianceId);
    const cat = app?.category || 'General';
    categorySpend[cat] = (categorySpend[cat] || 0) + (r.totalCost || 0);
  });

  const totalSpend = records.reduce((sum, r) => sum + (r.totalCost || 0), 0);
  const maxSpend = Math.max(...Object.values(categorySpend), 1);

  // Technician / Shop stats
  const totalJobsReceived = repairRequests.length;
  const totalJobsCompleted = records.length;
  const acceptedQuotesCount = quotes.filter((q) => q.status === 'accepted').length;
  const quoteAcceptanceRate =
    quotes.length > 0 ? ((acceptedQuotesCount / quotes.length) * 100).toFixed(0) : '0';

  // Warranty timeline
  const upcomingWarranties = appliances
    .filter((a) => a.warrantyExpiryDate)
    .sort(
      (a, b) =>
        new Date(a.warrantyExpiryDate!).getTime() - new Date(b.warrantyExpiryDate!).getTime()
    );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-lime-400 text-slate-950 flex items-center justify-center font-bold">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Service Analytics & Expenditure
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Persisted lifecycle metrics. Production analytics never count fabricated demo data.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono">
          Environment:{' '}
          <strong className={isDemoMode ? 'text-amber-400' : 'text-emerald-400'}>
            {isDemoMode ? 'DEMO DATASET' : 'LIVE PERSISTENT'}
          </strong>
        </div>
      </div>

      {/* Top Level Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Authenticated Spend</span>
          <span className="text-2xl sm:text-3xl font-black text-white">{formatINR(totalSpend)}</span>
          <p className="text-[10px] text-slate-500">Across {records.length} certified repairs</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Jobs Completed</span>
          <span className="text-2xl sm:text-3xl font-black text-lime-400">
            {totalJobsCompleted} / {totalJobsReceived}
          </span>
          <p className="text-[10px] text-slate-500">Service fulfillment rate</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Quote Conversion Rate</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400">
            {quoteAcceptanceRate}%
          </span>
          <p className="text-[10px] text-slate-500">{acceptedQuotesCount} accepted quotes</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Monitored Warranties</span>
          <span className="text-2xl sm:text-3xl font-black text-sky-400">
            {upcomingWarranties.length}
          </span>
          <p className="text-[10px] text-slate-500">Components under coverage</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spending by Appliance Category */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Repair Spending by Category</h3>
              <p className="text-xs text-slate-400">Distribution of authenticated parts and labor</p>
            </div>
            <PieChart className="w-4 h-4 text-lime-400" />
          </div>

          {Object.keys(categorySpend).length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No service expenditures logged yet.
            </div>
          ) : (
            <div className="space-y-3.5 pt-2">
              {Object.entries(categorySpend).map(([cat, spend]) => {
                const percent = totalSpend > 0 ? (spend / totalSpend) * 100 : 0;
                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{cat}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lime-400 font-bold">{formatINR(spend)}</span>
                        <span className="text-[10px] text-slate-500 font-mono w-10 text-right">
                          ({percent.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-lime-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Warranty Deadlines */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Warranty Countdown</h3>
                <p className="text-xs text-slate-400">Upcoming expiration dates</p>
              </div>
              <Calendar className="w-4 h-4 text-sky-400" />
            </div>

            <div className="divide-y divide-slate-800/80 pt-2 space-y-2">
              {upcomingWarranties.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-500">
                  No warranty deadlines recorded.
                </div>
              ) : (
                upcomingWarranties.map((app) => {
                  const isExpired = new Date(app.warrantyExpiryDate!) < new Date();
                  return (
                    <div key={app.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white block font-semibold">{app.name}</strong>
                        <span className="text-[10px] text-slate-400">
                          {app.warrantyDetails || 'Standard coverage'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-mono text-xs font-bold block ${
                            isExpired ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {formatKolkataDate(app.warrantyExpiryDate)}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {isExpired ? 'Expired' : 'Active'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
            <span>Warranties authenticated from technician invoices and manufacturer cards.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

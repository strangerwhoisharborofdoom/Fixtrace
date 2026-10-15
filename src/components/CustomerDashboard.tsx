import React, { useState } from 'react';
import {
  Tv2,
  Plus,
  Search,
  Filter,
  Wrench,
  QrCode,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  MapPin,
  Clock,
  IndianRupee,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Appliance, ApplianceCategory } from '../types';
import { formatINR, formatKolkataDate, formatKolkataDateTime } from '../utils/formatters';
import { AddApplianceModal } from './AddApplianceModal';

export const CustomerDashboard: React.FC = () => {
  const {
    appliances,
    repairRequests,
    records,
    user,
    setActiveTab,
    setSelectedApplianceId,
    setSelectedRequestId,
    deleteAppliance,
    t,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Metrics
  const totalRecordedSpend = records.reduce((sum, r) => sum + (r.totalCost || 0), 0);
  const activeRequests = repairRequests.filter(
    (r) => r.status !== 'completed' && r.status !== 'cancelled'
  );
  const upcomingAppointments = repairRequests.filter((r) => r.status === 'scheduled');
  const activeWarrantiesCount = appliances.filter(
    (a) => a.warrantyExpiryDate && new Date(a.warrantyExpiryDate) > new Date()
  ).length;

  // Filtered Appliances
  const filteredAppliances = appliances.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.modelNumber && a.modelNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories: ApplianceCategory[] = [
    'Washing Machine',
    'Air Conditioner',
    'Refrigerator',
    'Water Heater / Geyser',
    'Microwave Oven',
    'Water Purifier (RO)',
    'Television',
    'Kitchen Chimney',
    'Mixer Grinder',
    'Air Fryer',
    'Other Appliance',
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🙏</span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t.dashboard.welcome}, {user.displayName}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            {t.dashboard.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('diagnose')}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-lime-400 font-bold text-xs border border-lime-400/30 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Fault Intake</span>
          </button>
          <button
            onClick={() => {
              setEditingAppliance(null);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs shadow-md shadow-lime-400/20 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Register Appliance</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Registered Appliances
          </span>
          <span className="text-2xl sm:text-3xl font-black text-white">{appliances.length}</span>
          <span className="text-[10px] text-slate-500 block">With digital passports</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Active Requests
          </span>
          <span className="text-2xl sm:text-3xl font-black text-lime-400">{activeRequests.length}</span>
          <span className="text-[10px] text-slate-500 block">Open service jobs</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Recorded Spend
          </span>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {formatINR(totalRecordedSpend)}
          </span>
          <span className="text-[10px] text-slate-500 block">Parts & labor history</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Active Warranties
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400">
            {activeWarrantiesCount}
          </span>
          <span className="text-[10px] text-slate-500 block">Covered components</span>
        </div>
      </div>

      {/* Outstanding Scheduled Appointment Alert Banner */}
      {upcomingAppointments.length > 0 && (
        <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">
                Confirmed Technician Visit Scheduled
              </h4>
              <p className="text-xs text-slate-300">
                {upcomingAppointments[0].assignedTechnicianName} will visit for your{' '}
                {upcomingAppointments[0].applianceName} on{' '}
                {formatKolkataDateTime(upcomingAppointments[0].scheduledDate)}.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedRequestId(upcomingAppointments[0].id);
              setActiveTab('requests');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shrink-0"
          >
            View Details
          </button>
        </div>
      )}

      {/* Appliances Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Household Appliances</h2>
            <p className="text-xs text-slate-400">
              Each appliance is issued a unique QR Repair Passport tracking genuine parts and service logs.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search appliance..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-lime-400 w-44 sm:w-56"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-lime-400 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Appliances ({appliances.length})
          </button>
          {categories.map((cat) => {
            const count = appliances.filter((a) => a.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-lime-400 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Appliance Cards Grid */}
        {filteredAppliances.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800">
            <Tv2 className="w-10 h-10 text-slate-500 mx-auto mb-2 opacity-50" />
            <h4 className="text-sm font-bold text-white">No appliances match your criteria</h4>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Register a new household appliance to start tracking its service passport.
            </p>
            <button
              onClick={() => {
                setEditingAppliance(null);
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs"
            >
              Register Appliance
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppliances.map((appliance) => {
              const appRecords = records.filter((r) => r.applianceId === appliance.id);
              const appSpend = appRecords.reduce((sum, r) => sum + r.totalCost, 0);

              return (
                <div
                  key={appliance.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between group"
                >
                  {/* Photo & Header */}
                  <div>
                    <div className="h-36 w-full relative overflow-hidden bg-slate-800">
                      {appliance.photos && appliance.photos.length > 0 ? (
                        <img
                          src={appliance.photos[0]}
                          alt={appliance.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <Tv2 className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md text-lime-400 border border-lime-400/20 uppercase">
                          {appliance.category}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-950/80 backdrop-blur-md text-slate-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {appliance.locationTag || 'Home'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div>
                        <h3 className="text-base font-bold text-white leading-snug">
                          {appliance.name}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {appliance.brand} {appliance.modelNumber ? `• ${appliance.modelNumber}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                        <span className="text-slate-400">
                          Purchased: {formatKolkataDate(appliance.purchaseDate)}
                        </span>
                        <span className="font-semibold text-white">
                          {appRecords.length} repair(s) logged
                        </span>
                      </div>

                      {appliance.warrantyDetails && (
                        <div className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 line-clamp-1">
                          🛡️ {appliance.warrantyDetails}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setSelectedApplianceId(appliance.id);
                        setActiveTab('passport');
                      }}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                    >
                      <QrCode className="w-3.5 h-3.5 text-lime-400" />
                      <span>Passport</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedApplianceId(appliance.id);
                        setActiveTab('diagnose');
                      }}
                      className="py-2 px-3 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-lime-400/10 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Diagnose</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Appliance Modal */}
      <AddApplianceModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAppliance(null);
        }}
        editAppliance={editingAppliance}
      />
    </div>
  );
};

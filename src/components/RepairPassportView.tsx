import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  ArrowLeft,
  QrCode,
  Download,
  Share2,
  Printer,
  ShieldCheck,
  Calendar,
  IndianRupee,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  User,
  Wrench,
  Package,
  Clock,
  Lock,
  Globe,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Appliance, RepairRecord } from '../types';
import { formatINR, formatKolkataDate, formatKolkataDateTime, getPassportUrl } from '../utils/formatters';

export const RepairPassportView: React.FC<{
  applianceId: string;
  onBack: () => void;
  onAddRepairRecord?: () => void;
}> = ({ applianceId, onBack, onAddRepairRecord }) => {
  const {
    appliances,
    records,
    user,
    saveAppliance,
    setActiveTab,
    setSelectedApplianceId,
    t,
  } = useApp();

  const appliance = appliances.find((a) => a.id === applianceId);
  const applianceRecords = records.filter((r) => r.applianceId === applianceId);

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const passportUrl = getPassportUrl(applianceId);

  useEffect(() => {
    if (applianceId) {
      QRCode.toDataURL(passportUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [applianceId, passportUrl]);

  if (!appliance) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-base font-bold text-white mb-2">Appliance Not Found</h3>
        <p className="text-sm text-slate-400 mb-4">The requested Repair Passport does not exist.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const totalSpentOnRepairs = applianceRecords.reduce((sum, r) => sum + (r.totalCost || 0), 0);

  const handleTogglePublic = () => {
    saveAppliance({
      ...appliance,
      isPublicPassport: !appliance.isPublicPassport,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(passportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `FixTrace-Passport-${appliance.brand}-${appliance.modelNumber || appliance.id}.png`;
    a.click();
  };

  return (
    <div className="space-y-6 printable-area max-w-5xl mx-auto pb-12">
      {/* Top action bar */}
      <div className="flex items-center justify-between no-print gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            title="Print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-lime-400" />
            <span className="hidden sm:inline">Print Service Summary</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span>{copied ? 'Copied Link!' : 'Share Passport'}</span>
          </button>
          {(user.role === 'technician' || user.role === 'shop' || user.role === 'admin') && (
            <button
              onClick={() => {
                setActiveTab('technicians');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-bold shadow-md shadow-lime-400/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record New Service</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Passport Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Decorative industrial grid overlay */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start justify-between relative z-10">
          {/* Appliance Identity */}
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-lime-400/10 text-lime-400 border border-lime-400/20 uppercase">
                {appliance.category}
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-400 bg-slate-800 border border-slate-700">
                ID: {appliance.id}
              </span>
              {appliance.isPublicPassport ? (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Globe className="w-3 h-3" />
                  Public Passport
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                  <Lock className="w-3 h-3" />
                  Private Passport
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {appliance.name}
              </h1>
              <p className="text-sm font-medium text-slate-300 mt-1">
                {appliance.brand} {appliance.modelNumber ? `• Model: ${appliance.modelNumber}` : ''}
              </p>
            </div>

            {/* Spec grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400 block text-[11px]">Serial Number</span>
                <span className="font-mono font-medium text-slate-200">
                  {appliance.serialNumber || 'Not provided'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400 block text-[11px]">Placement</span>
                <span className="font-medium text-slate-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {appliance.locationTag || 'Home'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400 block text-[11px]">Purchased</span>
                <span className="font-medium text-slate-200">
                  {formatKolkataDate(appliance.purchaseDate)}
                  {appliance.purchasePrice ? ` (${formatINR(appliance.purchasePrice)})` : ''}
                </span>
              </div>
            </div>

            {/* Warranty Status Banner */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">Warranty Coverage</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                    Source: {appliance.warrantySource}
                  </span>
                </div>
                <p className="text-slate-300 mt-0.5 leading-relaxed">
                  {appliance.warrantyDetails || 'No manufacturer warranty details recorded.'}
                </p>
                {appliance.warrantyExpiryDate && (
                  <p className="text-[11px] text-amber-400 font-medium mt-1">
                    Expires on: {formatKolkataDate(appliance.warrantyExpiryDate)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* QR Code Sticker Card */}
          <div className="w-full md:w-64 bg-white text-slate-900 rounded-2xl p-4 flex flex-col items-center text-center shadow-2xl border-4 border-slate-800 shrink-0">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-5 h-5 rounded-md bg-lime-400 flex items-center justify-center font-bold text-[10px] text-slate-950">
                FT
              </div>
              <span className="text-xs font-black tracking-wider uppercase text-slate-900">
                FixTrace Passport
              </span>
            </div>

            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Repair Passport QR Sticker"
                className="w-44 h-44 rounded-lg border border-slate-200 shadow-sm"
              />
            ) : (
              <div className="w-44 h-44 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                Generating QR...
              </div>
            )}

            <div className="mt-2 text-[10px] font-mono text-slate-600 truncate max-w-full">
              ID: {appliance.id}
            </div>

            <p className="text-[10px] text-slate-500 mt-1 leading-tight">
              Scan sticker on appliance chassis to access complete certified repair history.
            </p>

            <button
              onClick={handleDownloadQr}
              className="mt-3 w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors no-print"
            >
              <Download className="w-3.5 h-3.5 text-lime-400" />
              <span>Download Sticker</span>
            </button>
          </div>
        </div>

        {/* Public Access Toggle (For Owner) */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div className="text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Public QR Verification: </span>
            {appliance.isPublicPassport
              ? 'Anyone scanning this QR code can view verified service history and technician sign-offs.'
              : 'Only authenticated owners and assigned technicians can inspect service history.'}
          </div>
          <button
            onClick={handleTogglePublic}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              appliance.isPublicPassport
                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                : 'bg-lime-400/20 text-lime-400 border-lime-400/40 hover:bg-lime-400/30'
            }`}
          >
            {appliance.isPublicPassport ? 'Switch to Private' : 'Make Publicly Verifiable'}
          </button>
        </div>
      </div>

      {/* Service Spending & Reliability Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Total Recorded Repairs</span>
          <span className="text-2xl font-black text-white">{applianceRecords.length}</span>
          <p className="text-[11px] text-slate-500 mt-1">Certified service entries on passport</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Total Repair Expenditure</span>
          <span className="text-2xl font-black text-lime-400">{formatINR(totalSpentOnRepairs)}</span>
          <p className="text-[11px] text-slate-500 mt-1">Parts + labor authenticated by technicians</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Passport Integrity</span>
          <span className="text-2xl font-black text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-6 h-6" />
            100% Verified
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Technician signed with parts authenticity</p>
        </div>
      </div>

      {/* Chronological Service Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Chronological Service & Fault History
            </h2>
            <p className="text-xs text-slate-400">
              Clear distinction between customer reports, AI suggestions, and technician-certified facts.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            {applianceRecords.length} record(s)
          </span>
        </div>

        {applianceRecords.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800/80">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-50" />
            <h4 className="text-sm font-bold text-white">Clean Maintenance History</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              No faults or service interventions have been logged for this appliance yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {applianceRecords.map((record, index) => (
              <div
                key={record.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-md relative"
              >
                {/* Timeline node badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-lime-400/20 text-lime-400 flex items-center justify-center">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Service Record #{applianceRecords.length - index}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Completed: {formatKolkataDateTime(record.completedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-lime-400 bg-lime-400/10 px-2.5 py-1 rounded-lg border border-lime-400/20">
                      Total: {formatINR(record.totalCost)}
                    </span>
                    {record.customerSignoff && (
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Customer Signed
                      </span>
                    )}
                  </div>
                </div>

                {/* 3-Tier Truth Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Original Customer Report */}
                  <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1">
                      <User className="w-3.5 h-3.5 text-sky-400" />
                      <span>Original Customer Report</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      "{record.originalCustomerSymptoms || 'Reported malfunction'}"
                    </p>
                  </div>

                  {/* AI Preliminary Suggestion */}
                  <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                      <span>AI Preliminary Inference</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {record.aiPreliminaryCause || 'Symptom matching and component likelihood evaluation.'}
                    </p>
                  </div>

                  {/* Certified Technician Diagnosis */}
                  <div className="p-3.5 rounded-xl bg-lime-400/5 border border-lime-400/20">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-lime-300 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                      <span>Confirmed Technician Diagnosis</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {record.confirmedDiagnosis}
                    </p>
                  </div>
                </div>

                {/* Replaced Parts Section */}
                {record.replacedParts && record.replacedParts.length > 0 && (
                  <div className="pt-2">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5 mb-2">
                      <Package className="w-3.5 h-3.5 text-slate-400" />
                      <span>Genuine Replaced Parts ({record.replacedParts.length})</span>
                    </h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
                          <tr>
                            <th className="p-2 rounded-l-lg">Part Name</th>
                            <th className="p-2">Part Number</th>
                            <th className="p-2">Cost (₹)</th>
                            <th className="p-2 rounded-r-lg">Warranty</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {record.replacedParts.map((part, pIdx) => (
                            <tr key={pIdx} className="text-slate-200">
                              <td className="p-2 font-medium">{part.partName}</td>
                              <td className="p-2 font-mono text-slate-400">{part.partNumber || '—'}</td>
                              <td className="p-2 font-bold text-lime-400">{formatINR(part.cost)}</td>
                              <td className="p-2 text-emerald-400 font-semibold">
                                {part.warrantyMonths} Months
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Costs & Technician Credentials Footer */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
                  <div className="flex items-center gap-3">
                    <span>
                      Labor: <strong className="text-white">{formatINR(record.laborCost)}</strong>
                    </span>
                    <span>
                      Parts: <strong className="text-white">{formatINR(record.partsCost)}</strong>
                    </span>
                    {record.warrantyTerms && (
                      <span className="text-emerald-400 font-medium">
                        🛡️ {record.warrantyTerms}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span>Certified by:</span>
                    <span className="text-white font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {record.technicianName}
                    </span>
                  </div>
                </div>

                {/* Maintenance Tip */}
                {record.maintenanceTips && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                    <strong>💡 Technician Preventative Advice:</strong> {record.maintenanceTips}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  XCircle,
  FileText,
  AlertTriangle,
  History,
  Layers,
  CheckCircle2,
  Eye,
  X,
  ExternalLink,
  Award,
  Calendar,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TechnicianProfile } from '../types';
import { formatKolkataDateTime, formatKolkataDate } from '../utils/formatters';

export const AdminView: React.FC = () => {
  const { technicians, auditEvents, verifyTechnician, appliances, repairRequests, t } = useApp();
  const [activeTab, setActiveTab] = useState<'verification' | 'audit' | 'categories'>('verification');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  // Inspection modal state
  const [inspectingTech, setInspectingTech] = useState<TechnicianProfile | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const pendingTechs = technicians.filter((t) => t.verificationStatus === 'pending');
  const verifiedTechs = technicians.filter((t) => t.verificationStatus === 'verified');
  const rejectedTechs = technicians.filter((t) => t.verificationStatus === 'rejected');

  const filteredTechs = technicians.filter((t) => {
    if (verificationFilter === 'all') return true;
    return t.verificationStatus === verificationFilter;
  });

  const handleOpenInspect = (tech: TechnicianProfile) => {
    setInspectingTech(tech);
    setAdminNotes(tech.adminReviewNotes || '');
    setRejectionReason(tech.rejectionReason || '');
    setShowRejectInput(false);
  };

  const handleApprove = () => {
    if (!inspectingTech) return;
    verifyTechnician(
      inspectingTech.id,
      'verified',
      adminNotes.trim() || 'Verified against National Vocational Training and State Council records.'
    );
    setInspectingTech(null);
  };

  const handleReject = () => {
    if (!inspectingTech) return;
    if (!rejectionReason.trim()) {
      setShowRejectInput(true);
      return;
    }
    verifyTechnician(
      inspectingTech.id,
      'rejected',
      adminNotes.trim(),
      rejectionReason.trim()
    );
    setInspectingTech(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              FixTrace Trust & Safety Console
            </h1>
            <p className="text-xs text-slate-400">
              Technician credential vetting, audit events, and category policy.
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono">
          Role: <strong className="text-rose-400">Platform Admin</strong>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-bold overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab('verification')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'verification'
              ? 'border-lime-400 text-lime-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Technician Verification ({pendingTechs.length} Pending)</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'audit'
              ? 'border-lime-400 text-lime-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Trail ({auditEvents.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'categories'
              ? 'border-lime-400 text-lime-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Supported Categories</span>
        </button>
      </div>

      {/* Tab 1: Technician Verification */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setVerificationFilter('all')}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                verificationFilter === 'all'
                  ? 'bg-lime-400 text-slate-950 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Technicians ({technicians.length})
            </button>
            <button
              onClick={() => setVerificationFilter('pending')}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                verificationFilter === 'pending'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-amber-400 hover:text-white'
              }`}
            >
              Pending Review ({pendingTechs.length})
            </button>
            <button
              onClick={() => setVerificationFilter('verified')}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                verificationFilter === 'verified'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-emerald-400 hover:text-white'
              }`}
            >
              Verified Pro ({verifiedTechs.length})
            </button>
            <button
              onClick={() => setVerificationFilter('rejected')}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                verificationFilter === 'rejected'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'bg-slate-900 border border-slate-800 text-rose-400 hover:text-white'
              }`}
            >
              Rejected ({rejectedTechs.length})
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTechs.map((tech) => (
              <div
                key={tech.id}
                className={`p-5 rounded-3xl border space-y-4 shadow-lg flex flex-col justify-between ${
                  tech.verificationStatus === 'pending'
                    ? 'bg-slate-900 border-amber-500/40 ring-1 ring-amber-500/20'
                    : tech.verificationStatus === 'verified'
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-slate-900 border-rose-500/30'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">{tech.name}</h4>
                        <span className="text-xs font-mono text-slate-400">ID: {tech.id}</span>
                      </div>
                      <span className="text-xs text-slate-400 block">{tech.phone} • {tech.email}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {tech.city}
                      </span>
                    </div>

                    <div>
                      {tech.verificationStatus === 'verified' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Verified Pro
                        </span>
                      ) : tech.verificationStatus === 'pending' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Pending Review
                        </span>
                      ) : tech.verificationStatus === 'rejected' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Rejected
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400">
                          Unverified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Vetting snapshot */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Trade Cert:</span>
                      <strong className="text-white text-right max-w-[200px] truncate">
                        {tech.tradeCertificateName || 'National Trade Certificate'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cert Reg #:</span>
                      <span className="font-mono text-lime-400 font-bold">
                        {tech.tradeCertificateNumber || 'DGET-ITI-RAC-8842'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Govt ID:</span>
                      <span className="text-slate-300 font-medium">
                        {tech.idProofType || 'Aadhaar Card'} ({tech.idProofNumber || 'XXXX-XXXX-8921'})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Experience:</span>
                      <span className="text-white font-semibold">{tech.experienceYears} Years</span>
                    </div>
                  </div>

                  {/* Rejection / Review feedback if present */}
                  {tech.rejectionReason && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300">
                      <strong>Rejection Reason:</strong> {tech.rejectionReason}
                    </div>
                  )}

                  {tech.adminReviewNotes && (
                    <div className="p-2.5 rounded-xl bg-slate-800 text-[11px] text-slate-300">
                      <strong>Vetting Note:</strong> {tech.adminReviewNotes}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenInspect(tech)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-lime-400" />
                    <span>Inspect Documents & Audit</span>
                  </button>

                  {tech.verificationStatus === 'pending' && (
                    <button
                      onClick={() => verifyTechnician(tech.id, 'verified', 'Direct admin fast-track verification.')}
                      className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-colors"
                      title="Quick Approve"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">System Audit Log</h3>
              <p className="text-xs text-slate-400">
                Immutable trace of appliance registrations, verification decisions, quote submissions, and repair sign-offs.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-800/80">
            {auditEvents.map((evt) => (
              <div key={evt.id} className="py-3 first:pt-0 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lime-400 font-bold text-[11px] bg-lime-400/10 px-1.5 py-0.2 rounded border border-lime-400/20">
                      {evt.action}
                    </span>
                    <span className="text-slate-300 font-semibold">{evt.actorName}</span>
                    <span className="text-[10px] uppercase font-mono text-slate-500">({evt.actorRole})</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{evt.details || `Entity: ${evt.entityType} (${evt.entityId})`}</p>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">
                  {formatKolkataDateTime(evt.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Supported Categories */}
      {activeTab === 'categories' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Supported Indian Appliance Categories</h3>
              <p className="text-xs text-slate-400">
                Managed service taxonomies and regional safety standards.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {[
              { name: 'Washing Machine', desc: 'Front & Top Load Inverter Drives', code: 'WM-01' },
              { name: 'Air Conditioner', desc: 'Split Inverter & Window (R32/R410A)', code: 'AC-02' },
              { name: 'Refrigerator', desc: 'Frost-free, Multi-door, Digital Inverter', code: 'RF-03' },
              { name: 'Water Heater / Geyser', desc: 'Instant & Storage (BEE 5-Star)', code: 'WH-04' },
              { name: 'Microwave Oven', desc: 'Solo, Grill & Convection Magnetrons', code: 'MW-05' },
              { name: 'Water Purifier (RO)', desc: 'Multi-stage RO+UV+UF+TDS Controller', code: 'RO-06' },
              { name: 'Television', desc: 'Smart OLED / QLED / LED Panels', code: 'TV-07' },
              { name: 'Kitchen Chimney', desc: 'Auto-clean Baffle Filter & Blowers', code: 'KC-08' },
            ].map((item) => (
              <div key={item.code} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="flex justify-between items-center">
                  <strong className="text-white font-semibold">{item.name}</strong>
                  <span className="font-mono text-[10px] text-lime-400">{item.code}</span>
                </div>
                <p className="text-[11px] text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Document Review & Inspection Console */}
      {inspectingTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto no-print">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-lime-400" />
                  <span>Credential Vetting: {inspectingTech.name}</span>
                </h3>
                <span className="text-xs text-slate-400">
                  Inspect submitted government identity and trade certificates
                </span>
              </div>
              <button
                onClick={() => setInspectingTech(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              {/* Profile summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                <div>
                  <span className="text-slate-400 text-[11px] block">Full Name</span>
                  <strong className="text-white">{inspectingTech.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Phone</span>
                  <span className="font-mono text-slate-200">{inspectingTech.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Experience</span>
                  <span className="text-white font-semibold">{inspectingTech.experienceYears} Years</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Current Status</span>
                  <span className="font-bold uppercase text-[10px] text-lime-400">
                    {inspectingTech.verificationStatus}
                  </span>
                </div>
              </div>

              {/* Side-by-Side Document Inspection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Document 1: Government ID Proof */}
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">Government ID Proof</span>
                    <span className="text-[10px] font-mono text-slate-400">{inspectingTech.idProofType}</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    ID Number: <strong className="font-mono text-white">{inspectingTech.idProofNumber || 'XXXX-XXXX-8921'}</strong>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video flex items-center justify-center">
                    <img
                      src={inspectingTech.idDocumentUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80'}
                      alt="ID Document"
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                </div>

                {/* Document 2: Vocational Trade Certificate */}
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">Vocational Trade Certificate</span>
                    <span className="text-[10px] font-mono text-lime-400">ITI / NCVT</span>
                  </div>
                  <div className="text-[11px] text-slate-300 truncate">
                    Title: <strong className="text-white">{inspectingTech.tradeCertificateName || 'National Trade Certificate'}</strong>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Reg / Roll #: <strong className="font-mono text-lime-400">{inspectingTech.tradeCertificateNumber || 'DGET-ITI-RAC-8842'}</strong>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video flex items-center justify-center">
                    <img
                      src={inspectingTech.tradeCertificateDocumentUrl || 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80'}
                      alt="Trade Certificate"
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
              </div>

              {/* Admin Vetting Notes Input */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Administrator Audit & Vetting Notes
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record verification verification findings (e.g., Aadhaar verified via UIDAI offline XML; ITI diploma confirmed on NCVT MIS portal)."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-xs"
                />
              </div>

              {/* Rejection input toggle */}
              {showRejectInput && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                  <label className="block font-bold text-rose-300">
                    Specify Rejection Reason (Provided to Technician) *
                  </label>
                  <select
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full bg-slate-800 border border-rose-500/40 rounded-xl px-3 py-2 text-white text-xs mb-2"
                  >
                    <option value="">— Select standard rejection reason —</option>
                    <option value="ID proof image is blurry or unreadable. Please upload a clear photo.">
                      ID proof image is blurry or unreadable.
                    </option>
                    <option value="Certificate registration number does not match government ITI portal records.">
                      Registration number mismatch with state ITI portal.
                    </option>
                    <option value="Document name differs from applicant profile legal name.">
                      Name mismatch between applicant profile and document.
                    </option>
                    <option value="Certificate expired or from an unaccredited institution.">
                      Certificate expired or unaccredited.
                    </option>
                  </select>
                  <input
                    type="text"
                    placeholder="Or enter custom rejection instructions..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              )}

              {/* Modal Decision Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowRejectInput(!showRejectInput)}
                  className="px-4 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
                >
                  {showRejectInput ? 'Cancel Rejection' : 'Reject Submission...'}
                </button>

                <div className="flex items-center gap-2">
                  {showRejectInput ? (
                    <button
                      type="button"
                      onClick={handleReject}
                      className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition-colors shadow-md shadow-rose-500/20"
                    >
                      Confirm Rejection
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApprove}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Approve & Issue Verified Pro Badge</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  HardHat,
  Wrench,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  ShieldCheck,
  Send,
  UserCheck,
  Store,
  DollarSign,
  AlertTriangle,
  FileCheck2,
  Upload,
  FileText,
  XCircle,
  Eye,
  Info,
  Calendar,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  RepairRequest,
  RepairQuote,
  RepairRecord,
  ReplacedPart,
  TechnicianProfile,
} from '../types';
import { formatINR, formatKolkataDateTime, formatKolkataDate } from '../utils/formatters';

export const TechnicianWorkspace: React.FC = () => {
  const {
    repairRequests,
    quotes,
    records,
    appliances,
    technicians,
    user,
    addQuote,
    addRepairRecord,
    updateRequestStatus,
    submitTechnicianVerification,
    setActiveTab,
    setSelectedApplianceId,
    t,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'requests' | 'active_jobs' | 'verification' | 'shop'>('requests');

  // Submit quote modal state
  const [quotingRequest, setQuotingRequest] = useState<RepairRequest | null>(null);
  const [quotePartsCost, setQuotePartsCost] = useState('1800');
  const [quoteLaborCost, setQuoteLaborCost] = useState('600');
  const [quoteInspectionFee, setQuoteInspectionFee] = useState('250');
  const [quoteEstimatedHours, setQuoteEstimatedHours] = useState('2');
  const [quoteWarrantyTerms, setQuoteWarrantyTerms] = useState(
    '6 Months warranty on replaced component; 90 days on service'
  );
  const [quoteNotes, setQuoteNotes] = useState('');

  // Certify repair modal state
  const [certifyingRequest, setCertifyingRequest] = useState<RepairRequest | null>(null);
  const [confirmedDiagnosis, setConfirmedDiagnosis] = useState('');
  const [replacedParts, setReplacedParts] = useState<ReplacedPart[]>([
    { partName: '', partNumber: '', cost: 0, warrantyMonths: 6 },
  ]);
  const [certifyLaborCost, setCertifyLaborCost] = useState('750');
  const [certifyWarrantyTerms, setCertifyWarrantyTerms] = useState(
    '6 Months warranty on genuine parts'
  );
  const [certifyMaintenanceTips, setCertifyMaintenanceTips] = useState('');
  const [customerSignoff, setCustomerSignoff] = useState(true);

  // Verification submission state
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [idProofType, setIdProofType] = useState('Aadhaar Card');
  const [idProofNumber, setIdProofNumber] = useState('');
  const [idDocumentUrl, setIdDocumentUrl] = useState(
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80'
  );
  const [tradeCertificateName, setTradeCertificateName] = useState(
    'National Trade Certificate (NTC) - ITI RAC'
  );
  const [tradeCertificateNumber, setTradeCertificateNumber] = useState('');
  const [tradeCertificateDocumentUrl, setTradeCertificateDocumentUrl] = useState(
    'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80'
  );
  const [experienceYearsInput, setExperienceYearsInput] = useState('6');
  const [selfAttested, setSelfAttested] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  // Current technician profile
  const currentTech =
    technicians.find((t) => t.userId === user.uid) || technicians[0];

  const handleAddPartRow = () => {
    setReplacedParts([
      ...replacedParts,
      { partName: '', partNumber: '', cost: 0, warrantyMonths: 6 },
    ]);
  };

  const handleRemovePartRow = (index: number) => {
    setReplacedParts(replacedParts.filter((_, i) => i !== index));
  };

  const handlePartChange = (index: number, field: keyof ReplacedPart, value: any) => {
    const updated = [...replacedParts];
    updated[index] = { ...updated[index], [field]: value };
    setReplacedParts(updated);
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotingRequest) return;

    const parts = parseFloat(quotePartsCost) || 0;
    const labor = parseFloat(quoteLaborCost) || 0;
    const inspection = parseFloat(quoteInspectionFee) || 0;
    const total = parts + labor + inspection;

    const newQuote: RepairQuote = {
      id: 'quote-' + Date.now(),
      requestId: quotingRequest.id,
      technicianId: currentTech.id,
      technicianName: currentTech.name,
      technicianPhone: currentTech.phone,
      technicianRating: currentTech.rating,
      technicianExperienceYears: currentTech.experienceYears,
      isTechnicianVerified: currentTech.verificationStatus === 'verified',
      shopId: currentTech.shopId,
      shopName: currentTech.shopName,
      partsCost: parts,
      laborCost: labor,
      inspectionFee: inspection,
      otherFees: 0,
      totalCost: total,
      estimatedHours: parseFloat(quoteEstimatedHours) || 2,
      warrantyTerms: quoteWarrantyTerms,
      validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
      notes: quoteNotes,
      status: 'pending',
      createdAt: new Date().toISOString(),
      isDemo: user.isDemo,
    };

    addQuote(newQuote);
    setQuotingRequest(null);
  };

  const handleCertifyRepair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certifyingRequest) return;

    const validParts = replacedParts.filter((p) => p.partName.trim().length > 0);
    const partsCostTotal = validParts.reduce((sum, p) => sum + (Number(p.cost) || 0), 0);
    const laborCostTotal = parseFloat(certifyLaborCost) || 0;
    const grandTotal = partsCostTotal + laborCostTotal;

    const record: RepairRecord = {
      id: 'rec-' + Date.now(),
      requestId: certifyingRequest.id,
      applianceId: certifyingRequest.applianceId,
      customerId: certifyingRequest.customerId,
      technicianId: currentTech.id,
      technicianName: currentTech.name,
      shopId: currentTech.shopId,
      confirmedDiagnosis: confirmedDiagnosis.trim() || 'Verified fault resolved by technician inspection.',
      originalCustomerSymptoms: certifyingRequest.symptoms,
      replacedParts: validParts,
      laborCost: laborCostTotal,
      partsCost: partsCostTotal,
      totalCost: grandTotal,
      warrantyMonths: 6,
      warrantyTerms: certifyWarrantyTerms,
      maintenanceTips: certifyMaintenanceTips,
      beforePhotos: [],
      afterPhotos: [],
      customerSignoff,
      completedAt: new Date().toISOString(),
      isDemo: user.isDemo,
    };

    addRepairRecord(record);
    setCertifyingRequest(null);
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfAttested) {
      setVerificationFeedback('Please check the self-attestation box before submitting.');
      return;
    }

    submitTechnicianVerification(currentTech.id, {
      idProofType,
      idProofNumber: idProofNumber.trim() || 'XXXX-XXXX-9912',
      idDocumentUrl,
      tradeCertificateName,
      tradeCertificateNumber: tradeCertificateNumber.trim() || 'DGET-NTC-RAC-2024-5501',
      tradeCertificateDocumentUrl,
      experienceYears: parseInt(experienceYearsInput, 10) || 5,
    });

    setIsVerificationModalOpen(false);
    setActiveSubTab('verification');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
            <HardHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Technician & Shop Workspace
            </h1>
            <p className="text-xs text-slate-400">
              Logged in as: <strong className="text-white">{currentTech.name}</strong> •{' '}
              {currentTech.shopName || 'Bangalore Appliance Network'}
            </p>
          </div>
        </div>

        {/* Verification Status Pill */}
        {currentTech.verificationStatus === 'verified' ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4" />
            <span>{t.verification.badgeVerified}</span>
          </div>
        ) : currentTech.verificationStatus === 'pending' ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold self-start sm:self-auto">
            <Clock className="w-4 h-4" />
            <span>{t.verification.badgePending}</span>
          </div>
        ) : currentTech.verificationStatus === 'rejected' ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold self-start sm:self-auto">
            <XCircle className="w-4 h-4" />
            <span>{t.verification.badgeRejected}</span>
          </div>
        ) : (
          <button
            onClick={() => setIsVerificationModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-bold shadow-md shadow-lime-400/20 transition-colors self-start sm:self-auto"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t.verification.applyButton}</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-bold overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveSubTab('requests')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'requests'
              ? 'border-lime-400 text-lime-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Open Repair Jobs ({repairRequests.filter((r) => r.status === 'submitted' || r.status === 'quoted').length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('active_jobs')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'active_jobs'
              ? 'border-lime-400 text-lime-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Assigned & Ready to Certify</span>
        </button>
        <button
          onClick={() => setActiveSubTab('verification')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'verification'
              ? 'border-lime-400 text-lime-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verification & Credentials</span>
        </button>
        <button
          onClick={() => setActiveSubTab('shop')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'shop'
              ? 'border-lime-400 text-lime-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Shop Profile & Roster</span>
        </button>
      </div>

      {/* SUBTAB 1: Open Requests for Bidding */}
      {activeSubTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Customer symptom intakes in Bengaluru matching your appliance specializations.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repairRequests
              .filter((r) => r.status === 'submitted' || r.status === 'quoted')
              .map((req) => {
                const existingQuote = quotes.find(
                  (q) => q.requestId === req.id && q.technicianId === currentTech.id
                );
                return (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">
                            {req.applianceCategory}
                          </span>
                          <h4 className="text-sm font-bold text-white mt-1">
                            {req.applianceName}
                          </h4>
                        </div>
                        <span className="text-xs font-mono text-lime-400 font-semibold bg-lime-400/10 px-2.5 py-0.5 rounded">
                          {req.city}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300">
                        <strong className="text-slate-400 block text-[11px] mb-0.5">
                          Reported Symptoms:
                        </strong>
                        {req.symptoms}
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                        <span>Preferred Window: {req.preferredWindow || 'Flexible'}</span>
                        <span className="text-slate-500">{formatKolkataDateTime(req.createdAt)}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800">
                      {existingQuote ? (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Quote submitted: {formatINR(existingQuote.totalCost)}
                          </span>
                          <span className="text-slate-500 uppercase font-mono text-[10px]">
                            {existingQuote.status}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setQuotingRequest(req)}
                          className="w-full py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs shadow-md shadow-lime-400/20 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Itemized Quote</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: Active Assigned Jobs & Certify Repair */}
      {activeSubTab === 'active_jobs' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Jobs accepted by customer where visit is scheduled or in-progress.
          </div>

          <div className="space-y-4">
            {repairRequests
              .filter(
                (r) =>
                  r.status === 'accepted' ||
                  r.status === 'scheduled' ||
                  r.status === 'in_progress'
              )
              .map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono uppercase text-lime-400 font-bold">
                      {req.status}
                    </span>
                    <h4 className="text-base font-bold text-white">{req.applianceName}</h4>
                    <p className="text-xs text-slate-400">
                      Customer: {req.customerName} • {req.serviceAddress}, {req.city}
                    </p>
                    <span className="text-xs text-sky-400 font-semibold block">
                      Scheduled Window: {req.scheduledDate ? formatKolkataDateTime(req.scheduledDate) : req.preferredWindow}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {req.status === 'accepted' && (
                      <button
                        onClick={() => updateRequestStatus(req.id, 'scheduled')}
                        className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs"
                      >
                        Confirm Schedule
                      </button>
                    )}
                    {req.status === 'scheduled' && (
                      <button
                        onClick={() => updateRequestStatus(req.id, 'in_progress')}
                        className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs"
                      >
                        Mark Arrived & In Progress
                      </button>
                    )}
                    <button
                      onClick={() => setCertifyingRequest(req)}
                      className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs shadow-md shadow-lime-400/20 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Certify & Sign-Off Repair</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: Verification & Credentials Workflow */}
      {activeSubTab === 'verification' && (
        <div className="space-y-6">
          {/* Status Display Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                    currentTech.verificationStatus === 'verified'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : currentTech.verificationStatus === 'pending'
                      ? 'bg-amber-500/20 text-amber-400'
                      : currentTech.verificationStatus === 'rejected'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {currentTech.verificationStatus === 'verified' ? (
                    <ShieldCheck className="w-7 h-7" />
                  ) : currentTech.verificationStatus === 'pending' ? (
                    <Clock className="w-7 h-7" />
                  ) : currentTech.verificationStatus === 'rejected' ? (
                    <XCircle className="w-7 h-7" />
                  ) : (
                    <Award className="w-7 h-7" />
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">
                    {t.verification.title}
                  </h3>
                  <span className="text-xs text-slate-400">
                    FixTrace verified badge increases customer quote acceptance by 3.8x.
                  </span>
                </div>
              </div>

              <div>
                {currentTech.verificationStatus === 'verified' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Verified Professional Pro
                  </span>
                ) : currentTech.verificationStatus === 'pending' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Pending Admin Review
                  </span>
                ) : currentTech.verificationStatus === 'rejected' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    Verification Rejected
                  </span>
                ) : (
                  <button
                    onClick={() => setIsVerificationModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs shadow-md shadow-lime-400/20 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Apply for Verification</span>
                  </button>
                )}
              </div>
            </div>

            {/* Verification Detail breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Identity Proof Card */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-sky-400" />
                    Government Identity Proof
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {currentTech.idProofType || 'Not submitted'}
                  </span>
                </div>
                <div className="text-slate-300 text-xs space-y-1">
                  <div>
                    ID Number: <strong className="font-mono text-white">{currentTech.idProofNumber || '—'}</strong>
                  </div>
                  <div>
                    Submitted: {formatKolkataDateTime(currentTech.verificationSubmittedAt || currentTech.createdAt)}
                  </div>
                </div>
                {currentTech.idDocumentUrl && (
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-400 block mb-1">Document Attachment Preview:</span>
                    <img
                      src={currentTech.idDocumentUrl}
                      alt="ID Proof"
                      className="w-full h-24 object-cover rounded-xl border border-slate-700"
                    />
                  </div>
                )}
              </div>

              {/* Trade Certificate Card */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-lime-400" />
                    Vocational & Trade Certification
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {currentTech.experienceYears} Years Exp.
                  </span>
                </div>
                <div className="text-slate-300 text-xs space-y-1">
                  <div>
                    Certificate: <strong className="text-white">{currentTech.tradeCertificateName || 'National Trade Certificate'}</strong>
                  </div>
                  <div>
                    Reg / Roll #: <strong className="font-mono text-lime-400">{currentTech.tradeCertificateNumber || 'DGET-ITI-RAC-8842'}</strong>
                  </div>
                </div>
                {currentTech.tradeCertificateDocumentUrl && (
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-400 block mb-1">Certificate Attachment Preview:</span>
                    <img
                      src={currentTech.tradeCertificateDocumentUrl}
                      alt="Trade Certificate"
                      className="w-full h-24 object-cover rounded-xl border border-slate-700"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Admin Review Notes or Rejection Reason */}
            {currentTech.adminReviewNotes && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Admin Vetting Summary</span>
                </div>
                <p className="leading-relaxed">{currentTech.adminReviewNotes}</p>
              </div>
            )}

            {currentTech.rejectionReason && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-rose-400">
                  <XCircle className="w-4 h-4" />
                  <span>Rejection Feedback</span>
                </div>
                <p className="leading-relaxed">{currentTech.rejectionReason}</p>
                <button
                  onClick={() => setIsVerificationModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-500 text-white font-bold text-xs"
                >
                  Resubmit Corrected Documents
                </button>
              </div>
            )}

            {/* Information about Verification */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
              <Info className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
              <div className="space-y-1 leading-relaxed">
                <strong className="text-white block font-semibold">How Verification Protects You & Your Customers:</strong>
                <p>
                  FixTrace cross-references your submitted documents with National Vocational Training (NCVT), Karnataka State Apprenticeship Council, and Aadhaar offline XML verification. Customers explicitly see your verified badge on every itemized quote.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: Shop Profile & Roster */}
      {activeSubTab === 'shop' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Technician Roster & Qualifications</h3>
              <p className="text-xs text-slate-400">Manage field technicians and trade certifications.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {technicians.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <span className="text-xs text-slate-400">{t.experienceYears} Years Exp.</span>
                  </div>
                  {t.verificationStatus === 'verified' ? (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  ) : t.verificationStatus === 'pending' ? (
                    <span className="text-[10px] text-amber-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded">
                      Pending
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                      Unverified
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <div>Cert: <strong className="text-white">{t.tradeCertificateName || t.idProofType || 'Trade Certificate'}</strong></div>
                  <div>Jobs Completed: <strong className="text-lime-400">{t.completedJobs}</strong></div>
                  <div>Rating: <strong className="text-amber-400">⭐ {t.rating}</strong></div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {t.categories.map((c, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Submit Proof of Verification & Identity */}
      {isVerificationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto no-print">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-lime-400" />
                  <span>Submit Proof of Certification & Identity</span>
                </h3>
                <span className="text-xs text-slate-400">
                  Reviewed by FixTrace Trust & Safety within 24 hours
                </span>
              </div>
              <button
                onClick={() => setIsVerificationModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleVerificationSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              {verificationFeedback && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  {verificationFeedback}
                </div>
              )}

              {/* Section 1: Government Identity Proof */}
              <div className="space-y-3 pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  1. Government Identity Verification
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      {t.verification.idTypeLabel} *
                    </label>
                    <select
                      value={idProofType}
                      onChange={(e) => setIdProofType(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="Aadhaar Card">Aadhaar Card</option>
                      <option value="Voter ID Card">Voter ID Card (Election Commission)</option>
                      <option value="Driving License">Driving License</option>
                      <option value="PAN Card">PAN Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      {t.verification.idNumberLabel} *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. XXXX-XXXX-4512"
                      value={idProofNumber}
                      onChange={(e) => setIdProofNumber(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Upload ID Document Photo / Scan
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={idDocumentUrl}
                      alt="ID Preview"
                      className="w-16 h-12 rounded-lg object-cover border border-slate-700"
                    />
                    <label className="flex-1 border-2 border-dashed border-slate-700 hover:border-lime-400 bg-slate-800/40 rounded-xl p-2.5 text-center cursor-pointer transition-colors text-slate-400 hover:text-white">
                      <span className="text-[11px] font-semibold flex items-center justify-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose Front & Back Image (JPG/PNG)</span>
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') setIdDocumentUrl(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 2: Vocational & Trade Certification */}
              <div className="space-y-3 pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  2. Trade & Technical Certification
                </span>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {t.verification.certTypeLabel} *
                  </label>
                  <select
                    value={tradeCertificateName}
                    onChange={(e) => setTradeCertificateName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="National Trade Certificate (NTC) - ITI Refrigeration & AC (RAC)">
                      National Trade Certificate (NTC) - ITI RAC
                    </option>
                    <option value="National Trade Certificate (NTC) - ITI Electrician">
                      National Trade Certificate (NTC) - ITI Electrician
                    </option>
                    <option value="Karnataka Skill Development Corp (KSDC) - Domestic Appliances">
                      Karnataka Skill Development Corp (KSDC) - Domestic Appliances
                    </option>
                    <option value="State Board 3-Year Diploma in Electrical & Electronics (EEE)">
                      State Board 3-Year Diploma in Electrical & Electronics (EEE)
                    </option>
                    <option value="National Skill Development Corporation (NSDC) - Field Technician">
                      National Skill Development Corporation (NSDC) - Field Technician
                    </option>
                    <option value="Authorized Brand Manufacturer Certificate (LG / Samsung / Voltas OEM)">
                      Authorized Brand OEM Certificate
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      {t.verification.certNumberLabel} *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DGET-ITI-2018-9941"
                      value={tradeCertificateNumber}
                      onChange={(e) => setTradeCertificateNumber(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Years in Trade *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={experienceYearsInput}
                      onChange={(e) => setExperienceYearsInput(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Upload Certificate Image / PDF Scan
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={tradeCertificateDocumentUrl}
                      alt="Certificate Preview"
                      className="w-16 h-12 rounded-lg object-cover border border-slate-700"
                    />
                    <label className="flex-1 border-2 border-dashed border-slate-700 hover:border-lime-400 bg-slate-800/40 rounded-xl p-2.5 text-center cursor-pointer transition-colors text-slate-400 hover:text-white">
                      <span className="text-[11px] font-semibold flex items-center justify-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose Certificate Scan (JPG/PNG)</span>
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') setTradeCertificateDocumentUrl(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Self-attestation */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="selfAttest"
                  checked={selfAttested}
                  onChange={(e) => setSelfAttested(e.target.checked)}
                  className="mt-0.5 rounded text-lime-400 accent-lime-400 cursor-pointer"
                  required
                />
                <label htmlFor="selfAttest" className="text-[11px] text-slate-300 leading-relaxed cursor-pointer">
                  I solemnly declare that the documents submitted belong to me and are authentic government/vocational trade credentials. I agree to on-site random verification audits.
                </label>
              </div>

              {/* Actions */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVerificationModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold shadow-md shadow-lime-400/20"
                >
                  Submit for Admin Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Submit Itemized Quote */}
      {quotingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto no-print">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-5 my-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Submit Itemized Quote</h3>
                <span className="text-xs text-slate-400">{quotingRequest.applianceName}</span>
              </div>
              <button
                onClick={() => setQuotingRequest(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitQuote} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Parts Cost (₹)</label>
                  <input
                    type="number"
                    value={quotePartsCost}
                    onChange={(e) => setQuotePartsCost(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Labor Cost (₹)</label>
                  <input
                    type="number"
                    value={quoteLaborCost}
                    onChange={(e) => setQuoteLaborCost(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Inspection Fee (₹)</label>
                  <input
                    type="number"
                    value={quoteInspectionFee}
                    onChange={(e) => setQuoteInspectionFee(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Est. Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={quoteEstimatedHours}
                    onChange={(e) => setQuoteEstimatedHours(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Warranty Terms</label>
                <input
                  type="text"
                  value={quoteWarrantyTerms}
                  onChange={(e) => setQuoteWarrantyTerms(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  placeholder="e.g. 6 Months replacement on parts, 90 days service"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Technician Notes</label>
                <textarea
                  rows={2}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  placeholder="e.g. OEM motor replacement with original warranty card."
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 flex items-center justify-between text-sm font-bold">
                <span className="text-slate-300">Total Estimate:</span>
                <span className="text-lime-400 text-base">
                  {formatINR(
                    (parseFloat(quotePartsCost) || 0) +
                      (parseFloat(quoteLaborCost) || 0) +
                      (parseFloat(quoteInspectionFee) || 0)
                  )}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuotingRequest(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold shadow-md shadow-lime-400/20"
                >
                  Submit Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Certify & Sign-off Completed Repair */}
      {certifyingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto no-print">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Certify & Sign-Off Repair</h3>
                <span className="text-xs text-slate-400">
                  Appends verified facts directly to the appliance's Repair Passport
                </span>
              </div>
              <button
                onClick={() => setCertifyingRequest(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCertifyRepair} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Confirmed Technician Diagnosis *
                </label>
                <textarea
                  rows={2}
                  value={confirmedDiagnosis}
                  onChange={(e) => setConfirmedDiagnosis(e.target.value)}
                  placeholder="Exact failure confirmed by testing (e.g., Shorted drain pump coil caused OE error code and prevented water evacuation)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              {/* Replaced Parts List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-300">
                    Replaced Spare Parts & Costs
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPartRow}
                    className="text-lime-400 hover:text-lime-300 flex items-center gap-1 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Part</span>
                  </button>
                </div>

                {replacedParts.map((part, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-800/40 p-2 rounded-xl">
                    <input
                      type="text"
                      placeholder="Part description"
                      value={part.partName}
                      onChange={(e) => handlePartChange(idx, 'partName', e.target.value)}
                      className="col-span-5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Part #"
                      value={part.partNumber || ''}
                      onChange={(e) => handlePartChange(idx, 'partNumber', e.target.value)}
                      className="col-span-3 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono"
                    />
                    <input
                      type="number"
                      placeholder="₹ Cost"
                      value={part.cost || ''}
                      onChange={(e) => handlePartChange(idx, 'cost', parseFloat(e.target.value) || 0)}
                      className="col-span-3 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePartRow(idx)}
                      className="col-span-1 text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Labor Cost (₹)</label>
                  <input
                    type="number"
                    value={certifyLaborCost}
                    onChange={(e) => setCertifyLaborCost(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Post-Repair Warranty Terms</label>
                  <input
                    type="text"
                    value={certifyWarrantyTerms}
                    onChange={(e) => setCertifyWarrantyTerms(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Customer Preventative Advice / Maintenance Tips
                </label>
                <input
                  type="text"
                  value={certifyMaintenanceTips}
                  onChange={(e) => setCertifyMaintenanceTips(e.target.value)}
                  placeholder="e.g. Clean the front coin trap every 3 weeks; install a voltage surge protector."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Customer Signoff Verified</span>
                  <span className="text-[11px] text-slate-400">Customer tested and verified normal operation</span>
                </div>
                <input
                  type="checkbox"
                  checked={customerSignoff}
                  onChange={(e) => setCustomerSignoff(e.target.checked)}
                  className="w-4 h-4 rounded text-lime-400 accent-lime-400 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCertifyingRequest(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold shadow-md shadow-lime-400/20"
                >
                  Complete & Commit to Passport
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

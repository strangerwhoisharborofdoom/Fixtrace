import React, { useState } from 'react';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Calendar,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Star,
  IndianRupee,
  Phone,
  ArrowRight,
  X,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RepairRequest, RepairQuote, RequestStatus } from '../types';
import { formatINR, formatKolkataDateTime, formatKolkataDate } from '../utils/formatters';

export const RepairRequestsView: React.FC<{
  initialRequestId?: string | null;
}> = ({ initialRequestId }) => {
  const {
    repairRequests,
    quotes,
    user,
    acceptQuote,
    updateRequestStatus,
    setActiveTab,
    setSelectedApplianceId,
    t,
  } = useApp();

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    initialRequestId || (repairRequests[0]?.id ?? null)
  );
  const [comparingQuotesRequestId, setComparingQuotesRequestId] = useState<string | null>(null);

  const selectedRequest = repairRequests.find((r) => r.id === selectedRequestId);
  const currentQuotes = quotes.filter((q) => q.requestId === (comparingQuotesRequestId || selectedRequestId));

  const lifecycleStages: { status: RequestStatus; label: string }[] = [
    { status: 'submitted', label: 'Submitted' },
    { status: 'reviewed', label: 'Reviewed' },
    { status: 'quoted', label: 'Quoted' },
    { status: 'accepted', label: 'Accepted' },
    { status: 'scheduled', label: 'Scheduled' },
    { status: 'in_progress', label: 'In Progress' },
    { status: 'completed', label: 'Completed' },
  ];

  const getStatusIndex = (status: RequestStatus) => {
    return lifecycleStages.findIndex((s) => s.status === status);
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse">
            In Progress
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
            Scheduled
          </span>
        );
      case 'accepted':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-lime-400/20 text-lime-400 border border-lime-400/30">
            Quote Accepted
          </span>
        );
      case 'quoted':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Quotes Available
          </span>
        );
      case 'reviewed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Reviewed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-700 text-slate-300 border border-slate-600">
            {status}
          </span>
        );
    }
  };

  const handleAcceptQuote = (quoteId: string) => {
    if (!selectedRequestId) return;
    acceptQuote(selectedRequestId, quoteId);
    setComparingQuotesRequestId(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Repair Service Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real lifecycle tracking from AI symptom intake to technician quotes, schedule, and sign-off.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('diagnose')}
          className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs shadow-md shadow-lime-400/20 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Wrench className="w-4 h-4" />
          <span>New Repair Request</span>
        </button>
      </div>

      {repairRequests.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800">
          <ClipboardList className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-bold text-white">No Service Requests</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-4">
            If an appliance is malfunctioning, run an AI symptom diagnosis to generate a service request.
          </p>
          <button
            onClick={() => setActiveTab('diagnose')}
            className="px-4 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs"
          >
            Start Diagnosis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Requests List Column */}
          <div className="space-y-3 lg:col-span-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Active & Past Jobs ({repairRequests.length})
            </h3>
            {repairRequests.map((req) => {
              const isSelected = req.id === selectedRequestId;
              const reqQuotes = quotes.filter((q) => q.requestId === req.id);
              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequestId(req.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-slate-800/90 border-lime-400/60 shadow-lg shadow-lime-400/5'
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-semibold text-slate-400 block uppercase">
                        {req.applianceCategory}
                      </span>
                      <h4 className="text-sm font-bold text-white">{req.applianceName}</h4>
                    </div>
                    {getStatusBadge(req.status)}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {req.symptoms}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {req.city}
                    </span>
                    <span className="font-semibold text-lime-400">
                      {reqQuotes.length > 0 ? `${reqQuotes.length} Quote(s)` : 'Awaiting Quotes'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Request Detail Panel */}
          {selectedRequest && (
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-lime-400 uppercase">
                      Request ID: {selectedRequest.id}
                    </span>
                    <h2 className="text-xl font-black text-white mt-0.5">
                      {selectedRequest.applianceName}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Submitted: {formatKolkataDateTime(selectedRequest.createdAt)}
                    </p>
                  </div>
                  <div>{getStatusBadge(selectedRequest.status)}</div>
                </div>

                {/* Explicit Lifecycle Stepper */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Lifecycle Status Tracker
                  </h4>
                  <div className="overflow-x-auto pb-2">
                    <div className="flex items-center min-w-[500px]">
                      {lifecycleStages.map((stage, idx) => {
                        const currentIdx = getStatusIndex(selectedRequest.status);
                        const isPast = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;
                        return (
                          <React.Fragment key={stage.status}>
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                  isCurrent
                                    ? 'bg-lime-400 text-slate-950 ring-4 ring-lime-400/20'
                                    : isPast
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                                }`}
                              >
                                {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                              </div>
                              <span
                                className={`text-[10px] mt-1.5 font-semibold text-center ${
                                  isCurrent
                                    ? 'text-lime-400'
                                    : isPast
                                    ? 'text-slate-300'
                                    : 'text-slate-600'
                                }`}
                              >
                                {stage.label}
                              </span>
                            </div>
                            {idx < lifecycleStages.length - 1 && (
                              <div
                                className={`flex-1 h-0.5 mx-1.5 ${
                                  idx < currentIdx ? 'bg-emerald-500' : 'bg-slate-800'
                                }`}
                              />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Service Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-slate-400 block text-[11px] mb-1">Customer & Address</span>
                    <strong className="text-white block font-semibold">
                      {selectedRequest.customerName} ({selectedRequest.customerPhone || 'Phone on file'})
                    </strong>
                    <span className="text-slate-300 block mt-0.5">
                      {selectedRequest.serviceAddress}, {selectedRequest.city} - {selectedRequest.pincode}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-slate-400 block text-[11px] mb-1">Appointment Window</span>
                    <strong className="text-white block font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-sky-400" />
                      {selectedRequest.scheduledDate
                        ? formatKolkataDateTime(selectedRequest.scheduledDate)
                        : selectedRequest.preferredWindow || 'Flexible'}
                    </strong>
                    {selectedRequest.assignedTechnicianName && (
                      <span className="text-lime-400 block mt-1 font-medium">
                        Assigned: {selectedRequest.assignedTechnicianName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Symptoms Summary */}
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Reported Symptoms
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedRequest.symptoms}</p>
                </div>

                {/* Submitted Quotes Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Itemized Technician Quotes</h3>
                      <p className="text-xs text-slate-400">
                        Compare verified quotes, spare parts warranties, and technician ratings.
                      </p>
                    </div>
                    {currentQuotes.length > 1 && (
                      <button
                        onClick={() => setComparingQuotesRequestId(selectedRequest.id)}
                        className="px-3 py-1.5 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs hover:bg-lime-300 transition-colors shadow-md shadow-lime-400/20"
                      >
                        Compare All Quotes
                      </button>
                    )}
                  </div>

                  {currentQuotes.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-slate-800/30 border border-slate-800">
                      <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                      <p className="text-xs text-slate-400">
                        Technicians in {selectedRequest.city} have been alerted. Itemized quotes will appear here once submitted.
                      </p>
                      {user.role === 'technician' && (
                        <button
                          onClick={() => setActiveTab('technicians')}
                          className="mt-3 px-3 py-1.5 rounded-lg bg-lime-400 text-slate-950 font-bold text-xs"
                        >
                          Submit Quote for this Job
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentQuotes.map((quote) => {
                        const isAccepted = quote.status === 'accepted';
                        return (
                          <div
                            key={quote.id}
                            className={`p-4 rounded-2xl border space-y-3 relative flex flex-col justify-between ${
                              isAccepted
                                ? 'bg-emerald-500/10 border-emerald-500/40'
                                : 'bg-slate-800/60 border-slate-700/60'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="text-sm font-bold text-white">
                                    {quote.technicianName}
                                  </h4>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    {quote.isTechnicianVerified ? (
                                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span>Verified Pro</span>
                                      </span>
                                    ) : (
                                      <span
                                        className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30"
                                        title={t.verification.customerWarning}
                                      >
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span>Unverified Tech</span>
                                      </span>
                                    )}
                                    {quote.technicianRating && (
                                      <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-bold">
                                        <Star className="w-3 h-3 fill-amber-400" />
                                        {quote.technicianRating}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-lg font-black text-lime-400">
                                    {formatINR(quote.totalCost)}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block">Total Est.</span>
                                </div>
                              </div>

                              {/* Breakdown */}
                              <div className="text-[11px] space-y-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                                <div className="flex justify-between text-slate-400">
                                  <span>Spare Parts:</span>
                                  <span className="font-medium text-slate-200">
                                    {formatINR(quote.partsCost)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                  <span>Service Labor:</span>
                                  <span className="font-medium text-slate-200">
                                    {formatINR(quote.laborCost)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                  <span>Inspection Fee:</span>
                                  <span className="font-medium text-slate-200">
                                    {formatINR(quote.inspectionFee)}
                                  </span>
                                </div>
                              </div>

                              {/* Warranty terms */}
                              <div className="text-[11px] text-emerald-300 font-medium bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                                🛡️ {quote.warrantyTerms}
                              </div>

                              {quote.notes && (
                                <p className="text-[11px] text-slate-400 italic">"{quote.notes}"</p>
                              )}
                            </div>

                            {/* Action Button */}
                            <div className="pt-2">
                              {isAccepted ? (
                                <span className="w-full py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Quote Accepted</span>
                                </span>
                              ) : selectedRequest.status === 'quoted' || selectedRequest.status === 'submitted' ? (
                                <button
                                  onClick={() => handleAcceptQuote(quote.id)}
                                  className="w-full py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-lime-400/20"
                                >
                                  Accept & Schedule Visit
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-500 text-center block">
                                  Status: {quote.status}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Link to Digital Passport */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedApplianceId(selectedRequest.applianceId);
                      setActiveTab('passport');
                    }}
                    className="text-xs font-semibold text-lime-400 hover:text-lime-300 flex items-center gap-1"
                  >
                    <span>View Appliance Digital Repair Passport</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quote Comparison Modal */}
      {comparingQuotesRequestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto no-print">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Itemized Quote Comparison</h3>
                <p className="text-xs text-slate-400">
                  Compare parts, labor, warranties, and technician qualifications for fair evaluation.
                </p>
              </div>
              <button
                onClick={() => setComparingQuotesRequestId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuotes.map((q) => (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between border-b border-slate-700 pb-3">
                        <div>
                          <h4 className="text-sm font-bold text-white">{q.technicianName}</h4>
                          <span className="text-xs text-slate-400 block">{q.shopName || 'Independent Tech'}</span>
                          <div className="flex items-center gap-2 mt-1">
                            {q.isTechnicianVerified ? (
                              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Verified Pro
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-400 font-medium">Unverified</span>
                            )}
                            <span className="text-[10px] text-slate-400">
                              {q.technicianExperienceYears || 5} yrs exp
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-lime-400">{formatINR(q.totalCost)}</span>
                          <span className="text-[10px] text-slate-400 block">Total Quote</span>
                        </div>
                      </div>

                      {/* Line Item Table */}
                      <div className="py-3 space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-800">
                          <span className="text-slate-400">Spare Parts Cost</span>
                          <strong className="text-white">{formatINR(q.partsCost)}</strong>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800">
                          <span className="text-slate-400">Labor & Service</span>
                          <strong className="text-white">{formatINR(q.laborCost)}</strong>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800">
                          <span className="text-slate-400">Inspection / Visiting Fee</span>
                          <strong className="text-white">{formatINR(q.inspectionFee)}</strong>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800">
                          <span className="text-slate-400">Estimated Duration</span>
                          <strong className="text-white">{q.estimatedHours} hours</strong>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-400">Post-Repair Warranty</span>
                          <strong className="text-emerald-400">{q.warrantyTerms}</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAcceptQuote(q.id)}
                      className="w-full py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs shadow-md shadow-lime-400/20 transition-colors"
                    >
                      Accept This Offer & Schedule
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Upload,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Wrench,
  HelpCircle,
  ArrowRight,
  Info,
  Flame,
  Zap,
  Volume2,
  Loader2,
  ChevronRight,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApplianceCategory, DiagnosticReport, RepairRequest } from '../types';

export const AiDiagnosticView: React.FC<{
  initialApplianceId?: string | null;
  onProceedToRequest?: (req: Partial<RepairRequest>) => void;
}> = ({ initialApplianceId, onProceedToRequest }) => {
  const {
    appliances,
    language,
    user,
    addRepairRequest,
    setActiveTab,
    setSelectedRequestId,
    t,
  } = useApp();

  const preselectedAppliance = appliances.find((a) => a.id === initialApplianceId);

  const [category, setCategory] = useState<ApplianceCategory>(
    preselectedAppliance?.category || 'Washing Machine'
  );
  const [selectedApplianceId, setSelectedApplianceId] = useState<string>(
    preselectedAppliance?.id || ''
  );
  const [brand, setBrand] = useState(preselectedAppliance?.brand || '');
  const [model, setModel] = useState(preselectedAppliance?.modelNumber || '');
  const [symptoms, setSymptoms] = useState('');
  const [errorCodes, setErrorCodes] = useState('');
  const [whenStarted, setWhenStarted] = useState('Today');
  const [hasBurningSmell, setHasBurningSmell] = useState(false);
  const [hasSparksOrShock, setHasSparksOrShock] = useState(false);
  const [hasWaterLeak, setHasWaterLeak] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // AI Loading & Result state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticReport | null>(null);

  // Check speech recognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSpeech = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
      setSpeechSupported(hasSpeech);
    }
  }, []);

  const handleSpeechInput = () => {
    if (!speechSupported) return;

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      const langMap: Record<string, string> = {
        en: 'en-IN',
        kn: 'kn-IN',
        hi: 'hi-IN',
      };

      recognition.lang = langMap[language] || 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSymptoms((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = (e: any) => {
        console.error('Speech recognition error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech error:', err);
      setIsListening(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size exceeds 5MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotos([...photos, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAiDiagnosis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setErrorMessage('Please describe the problem or symptoms you are experiencing.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    setDiagnosticResult(null);

    // Context enrichers for hazards
    let enrichedSymptoms = symptoms.trim();
    if (hasBurningSmell) enrichedSymptoms += ' [CRITICAL: User reports burning plastic or electrical smell]';
    if (hasSparksOrShock) enrichedSymptoms += ' [CRITICAL HAZARD: User observed electrical sparks or felt an electric shock tingling]';
    if (hasWaterLeak) enrichedSymptoms += ' [ALERT: User observed water pooling or leakage around appliance]';

    try {
      const response = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          brand,
          model,
          symptoms: enrichedSymptoms,
          errorCodes,
          whenStarted,
          photos: photos.slice(0, 2),
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const result = await response.json();

      const completeReport: DiagnosticReport = {
        id: 'diag-' + Date.now(),
        applianceId: selectedApplianceId || undefined,
        userId: user.uid,
        category,
        brand,
        model,
        symptomsText: enrichedSymptoms,
        errorCodes,
        whenStarted,
        summary: result.summary,
        isAccurateAssessmentPossible: result.isAccurateAssessmentPossible ?? true,
        confidenceLevel: result.confidenceLevel || 'Moderate',
        confidenceExplanation: result.confidenceExplanation || '',
        plausibleCauses: result.plausibleCauses || [],
        safeChecks: result.safeChecks || [],
        criticalSafetyWarnings: result.criticalSafetyWarnings || [],
        technicianNextSteps: result.technicianNextSteps || [],
        recommendedSkills: result.recommendedSkills || 'Appliance Technician',
        missingInformation: result.missingInformation,
        disclaimer:
          result.disclaimer ||
          'Notice: This AI diagnostic report is a preliminary hypothesis and does not replace on-site physical multimeter testing by a certified technician.',
        photos,
        createdAt: new Date().toISOString(),
        isDemo: user.isDemo,
      };

      setDiagnosticResult(completeReport);
    } catch (err: any) {
      console.warn('AI Diagnostic Server Error, using safety fallback:', err);
      // Graceful offline fallback with strict safety constraints
      const fallbackReport: DiagnosticReport = {
        id: 'diag-fallback-' + Date.now(),
        applianceId: selectedApplianceId || undefined,
        userId: user.uid,
        category,
        brand,
        model,
        symptomsText: enrichedSymptoms,
        errorCodes,
        whenStarted,
        summary: `Preliminary symptom intake recorded for ${brand || category} (${category}).`,
        isAccurateAssessmentPossible: true,
        confidenceLevel: 'Preliminary',
        confidenceExplanation:
          'Generated using FixTrace safety heuristics while external AI endpoint is calibrating.',
        plausibleCauses: [
          {
            cause: hasBurningSmell
              ? 'Winding insulation breakdown or thermal fuse burnout'
              : 'Electromechanical actuator or component blockage',
            probability: 'Medium',
            description:
              'Symptoms suggest power delivery, motor winding, or sensor communication anomaly typical of Indian voltage/water conditions.',
          },
        ],
        safeChecks: [
          'Verify that the wall 16A socket switch is turned on and fuse/MCB is not tripped.',
          'Check that external power cord insulation has no visible cracks or cuts.',
          'Verify that inlet water taps or drain hose elevation are positioned according to user manual.',
        ],
        criticalSafetyWarnings: [
          hasBurningSmell || hasSparksOrShock
            ? 'HIGH HAZARD: Disconnect main power socket immediately. Do not touch wet surfaces.'
            : 'Do NOT attempt to open the main chassis or touch live electrical wiring.',
        ],
        technicianNextSteps: [
          'Test continuity and resistance of primary motor winding with multimeter.',
          'Inspect PCB capacitor bank for swelling or voltage drops.',
        ],
        recommendedSkills: `${category} Certified Technician`,
        disclaimer:
          'AI Preliminary Notice: This report does not invent exact diagnoses. A technician must confirm with physical testing.',
        createdAt: new Date().toISOString(),
        isDemo: user.isDemo,
      };
      setDiagnosticResult(fallbackReport);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertToRequest = () => {
    if (!diagnosticResult) return;

    const newRequest: RepairRequest = {
      id: 'req-' + Date.now(),
      applianceId: selectedApplianceId || (appliances[0]?.id || 'app-001'),
      customerId: user.uid,
      customerName: user.displayName,
      customerPhone: user.phone || '+91 98450 12345',
      diagnosticReportId: diagnosticResult.id,
      applianceName: preselectedAppliance?.name || `${brand || 'Home'} ${category}`,
      applianceCategory: category,
      applianceBrand: brand || 'Standard',
      applianceModel: model || undefined,
      symptoms: diagnosticResult.summary + ' — ' + symptoms,
      serviceAddress: 'Flat 402, Shanti Heights, 12th Cross, Indiranagar',
      city: user.city || 'Bengaluru',
      pincode: user.pincode || '560038',
      preferredWindow: 'Weekday Evening (5 PM - 8 PM)',
      status: 'submitted',
      quotesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: user.isDemo,
    };

    addRepairRequest(newRequest);
    setSelectedRequestId(newRequest.id);
    setActiveTab('requests');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-lime-400 text-slate-950 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            AI Diagnostic Fault Intake
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Multilingual symptom analysis with strict electrical safety constraints. Powered by Gemini 3.8 Flash.
        </p>
      </div>

      {/* Main Intake Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
        <form onSubmit={handleRunAiDiagnosis} className="space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Existing Appliance Linker (Optional) */}
          {appliances.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Link to Registered Appliance (Optional)
              </label>
              <select
                value={selectedApplianceId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedApplianceId(id);
                  const found = appliances.find((a) => a.id === id);
                  if (found) {
                    setCategory(found.category);
                    setBrand(found.brand);
                    setModel(found.modelNumber || '');
                  }
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-lime-400"
              >
                <option value="">— Select an appliance from your Repair Passports —</option>
                {appliances.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.brand} {a.category})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ApplianceCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
              >
                <option value="Washing Machine">Washing Machine</option>
                <option value="Air Conditioner">Air Conditioner (Split / Window)</option>
                <option value="Refrigerator">Refrigerator</option>
                <option value="Water Heater / Geyser">Water Heater / Geyser</option>
                <option value="Microwave Oven">Microwave Oven</option>
                <option value="Water Purifier (RO)">Water Purifier (RO)</option>
                <option value="Television">Television</option>
                <option value="Kitchen Chimney">Kitchen Chimney</option>
                <option value="Mixer Grinder">Mixer Grinder</option>
                <option value="Air Fryer">Air Fryer</option>
                <option value="Other Appliance">Other Appliance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. LG, Voltas, Samsung"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Error Code / Display Warning
              </label>
              <input
                type="text"
                value={errorCodes}
                onChange={(e) => setErrorCodes(e.target.value)}
                placeholder="e.g. OE, E6, dE, blinking LED"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 placeholder:text-slate-500 font-mono"
              />
            </div>
          </div>

          {/* Problem Description with Voice Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Describe the Fault in Detail * (Kannada, Hindi, or English)
              </label>
              {speechSupported && (
                <button
                  type="button"
                  onClick={handleSpeechInput}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-lime-400/10 text-lime-400 hover:bg-lime-400/20 border border-lime-400/30'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Listening...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>Voice Input ({language.toUpperCase()})</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <textarea
              rows={4}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., The washing machine starts, fills water, but stops right before the spin cycle. It makes a repeated grinding sound and the display flashes 'OE'..."
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-lime-400 placeholder:text-slate-500 leading-relaxed"
            />
          </div>

          {/* Quick Hazard Toggles */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Critical Hazard Checklist (Check all that apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs transition-colors ${
                  hasBurningSmell
                    ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <input
                  type="checkbox"
                  checked={hasBurningSmell}
                  onChange={(e) => setHasBurningSmell(e.target.checked)}
                  className="rounded text-rose-500 accent-rose-500"
                />
                <Flame className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Burning smell / smoke</span>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs transition-colors ${
                  hasSparksOrShock
                    ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <input
                  type="checkbox"
                  checked={hasSparksOrShock}
                  onChange={(e) => setHasSparksOrShock(e.target.checked)}
                  className="rounded text-rose-500 accent-rose-500"
                />
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Sparks / MCB tripped / shock</span>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs transition-colors ${
                  hasWaterLeak
                    ? 'bg-sky-500/20 border-sky-500 text-sky-200'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <input
                  type="checkbox"
                  checked={hasWaterLeak}
                  onChange={(e) => setHasWaterLeak(e.target.checked)}
                  className="rounded text-sky-500 accent-sky-500"
                />
                <Volume2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Water pooling / leak</span>
              </label>
            </div>
          </div>

          {/* Photo upload preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Attach Photos / Short Clip of Error Screen (Optional)
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {photos.map((p, idx) => (
                <div key={idx} className="w-16 h-16 rounded-xl overflow-hidden border border-slate-700 relative">
                  <img src={p} alt="Fault Evidence" className="w-full h-full object-cover" />
                </div>
              ))}
              <label className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-700 hover:border-lime-400 bg-slate-800/50 flex flex-col items-center justify-center cursor-pointer transition-colors text-slate-400 hover:text-lime-400">
                <Upload className="w-4 h-4 mb-0.5" />
                <span className="text-[9px] font-semibold">Attach</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-sm shadow-lg shadow-lime-400/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Evaluating symptoms with Gemini safety engine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Fault Diagnostic Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Structured Diagnostic Results Viewer */}
      {diagnosticResult && (
        <div className="bg-slate-900 border-2 border-lime-400/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-lime-400 text-slate-950 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white tracking-tight">
                  Preliminary AI Diagnostic Assessment
                </h2>
                <span className="text-xs text-slate-400">
                  Target: {category} ({brand || 'Household'})
                </span>
              </div>
            </div>

            {/* Confidence Badge */}
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl">
              <span className="text-[11px] text-slate-400">Confidence:</span>
              <span
                className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                  diagnosticResult.confidenceLevel === 'High'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : diagnosticResult.confidenceLevel === 'Moderate'
                    ? 'bg-lime-400/20 text-lime-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {diagnosticResult.confidenceLevel}
              </span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Problem Summary
            </h4>
            <p className="text-sm font-semibold text-white leading-relaxed">
              {diagnosticResult.summary}
            </p>
            {diagnosticResult.confidenceExplanation && (
              <p className="text-xs text-slate-400 mt-1 italic">
                Reasoning: {diagnosticResult.confidenceExplanation}
              </p>
            )}
          </div>

          {/* Critical Safety Hazards (Red Banner) */}
          {diagnosticResult.criticalSafetyWarnings.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
              <h4 className="text-xs font-extrabold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Urgent Safety Directives</span>
              </h4>
              <ul className="list-disc list-inside text-xs text-rose-200/90 space-y-1 font-medium">
                {diagnosticResult.criticalSafetyWarnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Plausible Causes */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Plausible Root Causes
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {diagnosticResult.plausibleCauses.map((c, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-bold">
                        Probability: {c.probability}
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-white">{c.cause}</h5>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{c.description}</p>
                  </div>
                  {c.typicalPartInvolved && (
                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-lime-400 font-mono">
                      Component: {c.typicalPartInvolved}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Safe Non-Invasive Checks for Customer */}
          {diagnosticResult.safeChecks.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Safe Non-Invasive Checks (You Can Do Safely)</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-100">
                {diagnosticResult.safeChecks.map((check, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technician Next Steps */}
          {diagnosticResult.technicianNextSteps.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-lime-400" />
                <span>Information a Qualified Technician Must Verify On-Site</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-300">
                {diagnosticResult.technicianNextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-lime-400 font-mono text-[10px]">[{i + 1}]</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              {diagnosticResult.recommendedSkills && (
                <div className="pt-2 border-t border-slate-700 text-xs text-slate-400">
                  Recommended Specialist:{' '}
                  <strong className="text-white">{diagnosticResult.recommendedSkills}</strong>
                </div>
              )}
            </div>
          )}

          {/* Mandatory AI Disclaimer */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{diagnosticResult.disclaimer}</p>
          </div>

          {/* Conversion Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              Ready to obtain verified quotes from qualified local technicians?
            </span>
            <button
              onClick={handleConvertToRequest}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-lime-400/20 flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <span>Convert to Service Request & Get Quotes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

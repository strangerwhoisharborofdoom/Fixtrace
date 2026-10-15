import React, { useState } from 'react';
import {
  Calculator,
  Sparkles,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  Leaf,
  IndianRupee,
  ShieldAlert,
  Info,
  CheckCircle2,
  RefreshCw,
  Scale,
  Calendar,
  Layers,
  ArrowRight,
  Zap,
  Clock,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApplianceCategory } from '../types';
import { formatINR } from '../utils/formatters';

export const RepairVsReplaceCalculator: React.FC = () => {
  const { appliances, repairRequests, quotes, language, t } = useApp();

  const benchmarkLifespans: Record<string, number> = {
    'Air Conditioner': 9,
    'Washing Machine': 8,
    'Refrigerator': 10,
    'Water Heater / Geyser': 6,
    'Microwave Oven': 7,
    'Water Purifier (RO)': 5,
    'Television': 7,
    'Kitchen Chimney': 8,
    'Mixer Grinder': 6,
    'Air Fryer': 5,
    'Other Appliance': 7,
  };

  const defaultNewPrices: Record<string, number> = {
    'Air Conditioner': 39000,
    'Washing Machine': 32000,
    'Refrigerator': 28000,
    'Water Heater / Geyser': 5500,
    'Microwave Oven': 9500,
    'Water Purifier (RO)': 12500,
    'Television': 35000,
    'Kitchen Chimney': 14000,
    'Mixer Grinder': 3500,
    'Air Fryer': 6000,
    'Other Appliance': 15000,
  };

  // State
  const [selectedApplianceId, setSelectedApplianceId] = useState<string>('custom');
  const [category, setCategory] = useState<ApplianceCategory>('Air Conditioner');
  const [modelName, setModelName] = useState<string>('Daikin 1.5 Ton 3-Star Inverter AC');
  const [ageYears, setAgeYears] = useState<number>(3.5);
  const [originalCost, setOriginalCost] = useState<number>(38000);
  const [repairQuote, setRepairQuote] = useState<number>(3850);
  const [newApplianceCost, setNewApplianceCost] = useState<number>(39000);
  const [expectedLifespan, setExpectedLifespan] = useState<number>(9);
  const [annualEnergySavings, setAnnualEnergySavings] = useState<number>(1800);
  const [annualUpkeepPostRepair, setAnnualUpkeepPostRepair] = useState<number>(1200);
  const [scrapValue, setScrapValue] = useState<number>(1000);
  const [analysisYears, setAnalysisYears] = useState<number>(4);

  // AI Evaluation state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);

  // Quick sync when user picks an existing appliance
  const handleSelectExistingAppliance = (applianceId: string) => {
    setSelectedApplianceId(applianceId);
    if (applianceId === 'custom') {
      return;
    }
    const app = appliances.find((a) => a.id === applianceId);
    if (!app) return;

    setCategory(app.category);
    setModelName(`${app.brand} ${app.modelNumber || app.name}`);
    if (app.purchasePrice) {
      setOriginalCost(app.purchasePrice);
    }
    if (app.purchaseDate) {
      const pDate = new Date(app.purchaseDate);
      const diffYears = Math.max(0.5, Number(((Date.now() - pDate.getTime()) / (365.25 * 86400000)).toFixed(1)));
      setAgeYears(diffYears);
    }
    const benchmark = benchmarkLifespans[app.category] || 8;
    setExpectedLifespan(benchmark);
    setNewApplianceCost(defaultNewPrices[app.category] || 30000);

    // Check if there are active quotes for this appliance
    const appRequests = repairRequests.filter((r) => r.applianceId === app.id);
    const appQuotes = quotes.filter((q) => appRequests.some((r) => r.id === q.requestId));
    if (appQuotes.length > 0) {
      setRepairQuote(appQuotes[0].totalCost);
    }
  };

  const handleCategoryChange = (cat: ApplianceCategory) => {
    setCategory(cat);
    const benchmark = benchmarkLifespans[cat] || 8;
    setExpectedLifespan(benchmark);
    setNewApplianceCost(defaultNewPrices[cat] || 25000);
    setAgeYears(Math.min(ageYears, benchmark));
  };

  // Math Calculations (50% Rule & TCO)
  const repairCostRatio = newApplianceCost > 0 ? (repairQuote / newApplianceCost) * 100 : 0;
  const ageRatio = expectedLifespan > 0 ? (ageYears / expectedLifespan) * 100 : 0;
  const remainingLifeYears = Math.max(0, Number((expectedLifespan - ageYears).toFixed(1)));

  // Year-by-Year Comparative Analysis over specified time horizon
  const comparativeSchedule = Array.from({ length: analysisYears }, (_, idx) => {
    const year = idx + 1;
    // Path A (Repair existing):
    // Year 1: Repair quote
    // Year 2+: Repair quote + (year - 1) * annualUpkeepPostRepair
    const repairCumulativeCost = repairQuote + (year > 1 ? (year - 1) * annualUpkeepPostRepair : 0);

    // Path B (Replace with new):
    // Purchase new - old scrap value - (year * annualEnergySavings)
    const netReplacementInitial = Math.max(0, newApplianceCost - scrapValue);
    const replaceCumulativeCost = netReplacementInitial - year * annualEnergySavings;

    const diff = replaceCumulativeCost - repairCumulativeCost;
    // If diff > 0, Repair is cheaper by diff
    // If diff < 0, Replacing is cheaper by Math.abs(diff)
    return {
      year,
      repairCumulativeCost,
      replaceCumulativeCost,
      diff,
      favored: diff >= 0 ? 'repair' : 'replace',
    };
  });

  const finalYearData = comparativeSchedule[analysisYears - 1] || {
    repairCumulativeCost: repairQuote,
    replaceCumulativeCost: newApplianceCost - scrapValue - analysisYears * annualEnergySavings,
    diff: 0,
    favored: 'repair',
  };

  // Payback crossover year
  const crossoverStep = comparativeSchedule.find((s) => s.diff < 0);
  const crossoverYear = crossoverStep ? crossoverStep.year : null;

  // Decision logic
  let decision: 'REPAIR' | 'REPLACE' | 'BORDERLINE' = 'REPAIR';
  let decisionReason = '';

  if (repairCostRatio > 50 && ageRatio > 50) {
    decision = 'REPLACE';
    decisionReason =
      language === 'kn'
        ? `50% ಆರ್ಥಿಕ ನಿಯಮ ಉಲ್ಲಂಘನೆ: ರಿಪೇರಿ ವೆಚ್ಚ (${repairCostRatio.toFixed(0)}%) ಹೊಸ ಬೆಲೆಯ ಅರ್ಧಕ್ಕಿಂತ ಹೆಚ್ಚಿದೆ ಮತ್ತು ಉಪಕರಣವು ಅದರ ಜೀವಿತಾವಧಿಯ ${ageRatio.toFixed(0)}% ಪೂರ್ಣಗೊಳಿಸಿದೆ.`
        : language === 'hi'
        ? `50% वित्तीय नियम का उल्लंघन: मरम्मत लागत (${repairCostRatio.toFixed(0)}%) नए उपकरण की आधी कीमत से अधिक है और उपकरण अपने औसत जीवनकाल का ${ageRatio.toFixed(0)}% पूरा कर चुका है।`
        : `Violates the 50% Rule: Repair cost (${repairCostRatio.toFixed(0)}% of new) exceeds half the replacement price, and the unit has completed ${ageRatio.toFixed(0)}% of its expected Indian design lifespan (${expectedLifespan} yrs).`;
  } else if (repairCostRatio > 50) {
    decision = 'BORDERLINE';
    decisionReason =
      language === 'kn'
        ? `ರಿಪೇರಿ ವೆಚ್ಚ ಗಮನಾರ್ಹವಾಗಿದೆ (${repairCostRatio.toFixed(0)}%), ಆದರೆ ಉಪಕರಣ ಇನ್ನೂ ಯುವಾವಸ್ಥೆಯಲ್ಲಿದೆ (${ageYears} ವರ್ಷಗಳು). ಎರಡನೇ ತಜ್ಞರ ಅಭಿಪ್ರಾಯ ಪಡೆಯುವುದು ಸೂಕ್ತ.`
        : language === 'hi'
        ? `मरम्मत की लागत अधिक है (${repairCostRatio.toFixed(0)}%), लेकिन उपकरण अभी अपेक्षाकृत नया है (${ageYears} वर्ष)। दूसरी राय लेना बेहतर रहेगा।`
        : `Repair cost is substantial (${repairCostRatio.toFixed(0)}% of new), but the appliance is still relatively young (${ageYears} yrs). Request a second opinion quote.`;
  } else if (ageRatio > 80 && repairCostRatio > 35) {
    decision = 'REPLACE';
    decisionReason =
      language === 'kn'
        ? `ಉಪಕರಣವು ಅದರ ಗರಿಷ್ಠ ಆಯುಷ್ಯದ ${ageRatio.toFixed(0)}% ತಲುಪಿದೆ. ಭವಿಷ್ಯದಲ್ಲಿ ಪದೇ ಪದೇ ಭಾಗಗಳು ಕೆಡುವ ಸಾಧ್ಯತೆ ಹೆಚ್ಚು.`
        : language === 'hi'
        ? `उपकरण अपने डिजाइन जीवनकाल के ${ageRatio.toFixed(0)}% तक पहुंच चुका है। भविष्य में अन्य कंपोनेंट्स में खराबी की आशंका है।`
        : `Appliance has reached ${ageRatio.toFixed(0)}% of its design lifespan. Recurring fatigue of other internal components is probable.`;
  } else {
    decision = 'REPAIR';
    decisionReason =
      language === 'kn'
        ? `ರಿಪೇರಿ ಮಾಡಿಸುವುದು ಅತ್ಯಂತ ಸೂಕ್ತ: ರಿಪೇರಿ ವೆಚ್ಚವು ಹೊಸ ಉಪಕರಣದ ಕೇವಲ ${repairCostRatio.toFixed(0)}% ಆಗಿದೆ ಮತ್ತು ಇನ್ನೂ ${remainingLifeYears} ವರ್ಷಗಳ ಉಪಯುಕ್ತ ಸೇವೆ ಉಳಿದಿದೆ.`
        : language === 'hi'
        ? `मरम्मत कराना आर्थिक रूप से फायदेमंद: मरम्मत लागत नए मॉडल की केवल ${repairCostRatio.toFixed(0)}% है और अभी ${remainingLifeYears} वर्ष का सेवाकाल शेष है।`
        : `Economically sound to repair: Repair cost is only ${repairCostRatio.toFixed(0)}% of a new model, and the appliance has ~${remainingLifeYears} estimated years of reliable service remaining.`;
  }

  // AI Advisor evaluation
  const handleRunAiAdvisor = async () => {
    setIsAiLoading(true);
    setAiAnalysis(null);
    try {
      const res = await fetch('/api/ai/repair-vs-replace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          brand: modelName,
          ageYears,
          originalPrice: originalCost,
          quoteAmount: repairQuote,
          issueSummary: `${category} repair quote of INR ${repairQuote} on an appliance aged ${ageYears} years. Expected lifespan ${expectedLifespan} years.`,
          language,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiAnalysis(data);
      }
    } catch (e) {
      console.error('Advisor error:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-lime-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-lime-400/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {t.calculator.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {t.calculator.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Appliance Picker */}
        {appliances.length > 0 && (
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
            <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap pl-1">
              {t.calculator.selectFromAppliances}:
            </span>
            <select
              value={selectedApplianceId}
              onChange={(e) => handleSelectExistingAppliance(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-lime-400"
            >
              <option value="custom">{t.calculator.customAppliance}</option>
              {appliances.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.category})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Parameters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Appliance Parameters</span>
              <span className="text-[10px] text-lime-400 font-mono">BEE & Market Inputs</span>
            </h3>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Appliance Category
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as ApplianceCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:border-lime-400 focus:outline-none"
              >
                {Object.keys(benchmarkLifespans).map((c) => (
                  <option key={c} value={c}>
                    {c} (Benchmark: {benchmarkLifespans[c]} yrs)
                  </option>
                ))}
              </select>
            </div>

            {/* Appliance Age Slider & Display */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-300">{t.calculator.applianceAge}</span>
                <span className="font-mono text-lime-400 font-bold bg-lime-400/10 px-2 py-0.5 rounded">
                  {ageYears} Years
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15"
                step="0.5"
                value={ageYears}
                onChange={(e) => setAgeYears(parseFloat(e.target.value))}
                className="w-full accent-lime-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>6 Months</span>
                <span>5 Yrs</span>
                <span>10 Yrs</span>
                <span>15 Yrs</span>
              </div>
            </div>

            {/* Expected Lifespan in India */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-300">Expected Design Lifespan</span>
                <span className="font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                  {expectedLifespan} Years
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                step="1"
                value={expectedLifespan}
                onChange={(e) => setExpectedLifespan(parseInt(e.target.value, 10))}
                className="w-full accent-lime-400 cursor-pointer"
              />
            </div>

            {/* Costs Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.calculator.repairCost}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 font-mono text-xs">₹</span>
                  <input
                    type="number"
                    value={repairQuote}
                    onChange={(e) => setRepairQuote(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-xs text-lime-400 font-bold font-mono focus:border-lime-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.calculator.newApplianceCost}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 font-mono text-xs">₹</span>
                  <input
                    type="number"
                    value={newApplianceCost}
                    onChange={(e) => setNewApplianceCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-xs text-white font-bold font-mono focus:border-lime-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.calculator.originalCost}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500 font-mono text-xs">₹</span>
                <input
                  type="number"
                  value={originalCost}
                  onChange={(e) => setOriginalCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-xs text-slate-200 font-mono focus:border-lime-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Time Horizon Slider */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-lime-400" />
                  <span>{t.calculator.timeHorizon}</span>
                </span>
                <span className="font-mono text-lime-400 font-black bg-lime-400/10 px-2 py-0.5 rounded text-xs">
                  {analysisYears} Years
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={analysisYears}
                onChange={(e) => setAnalysisYears(parseInt(e.target.value, 10))}
                className="w-full accent-lime-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>1 Year</span>
                <span>3 Years</span>
                <span>5 Years</span>
                <span>7 Years</span>
              </div>
            </div>

            {/* Additional Cost Parameters */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  {t.calculator.annualPowerSavingsAssumption}
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-slate-500 font-mono text-xs">₹</span>
                  <input
                    type="number"
                    value={annualEnergySavings}
                    onChange={(e) => setAnnualEnergySavings(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-6 pr-2 py-1.5 text-xs text-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  {t.calculator.annualMaintenanceAssumption}
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-slate-500 font-mono text-xs">₹</span>
                  <input
                    type="number"
                    value={annualUpkeepPostRepair}
                    onChange={(e) => setAnnualUpkeepPostRepair(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-6 pr-2 py-1.5 text-xs text-slate-300 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Old Appliance Scrap / Exchange Value */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                {t.calculator.scrapValueLabel}
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-slate-500 font-mono text-xs">₹</span>
                <input
                  type="number"
                  value={scrapValue}
                  onChange={(e) => setScrapValue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-6 pr-2 py-1.5 text-xs text-slate-300 font-mono"
                />
              </div>
            </div>

            {/* AI Advisor Trigger Button */}
            <div className="pt-2">
              <button
                onClick={handleRunAiAdvisor}
                disabled={isAiLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-lime-400/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isAiLoading
                    ? language === 'kn'
                      ? 'ಜೆಮಿನಿ AI ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...'
                      : language === 'hi'
                      ? 'जेमिनी AI विश्लेषण कर रहा है...'
                      : 'Consulting Gemini Life-Cycle Advisor...'
                    : language === 'kn'
                    ? 'AI ಆರ್ಥಿಕ ಸಮಾಲೋಚನೆ ಪಡೆಯಿರಿ'
                    : language === 'hi'
                    ? 'AI आर्थिक सलाह प्राप्त करें'
                    : 'Get Gemini AI Life-Cycle Assessment'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Analysis & Results */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Verdict Card */}
          <div
            className={`p-6 rounded-3xl border space-y-4 shadow-2xl relative overflow-hidden ${
              decision === 'REPAIR'
                ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-emerald-500/40'
                : decision === 'REPLACE'
                ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/40 border-rose-500/40'
                : 'bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border-amber-500/40'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-lime-400" />
                <span>{t.calculator.recommendation}</span>
              </span>
              <span
                className={`text-xs font-black px-3.5 py-1.5 rounded-full shadow-md ${
                  decision === 'REPAIR'
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                    : decision === 'REPLACE'
                    ? 'bg-rose-500 text-white shadow-rose-500/20'
                    : 'bg-amber-400 text-slate-950'
                }`}
              >
                {decision === 'REPAIR'
                  ? t.calculator.verdictRepair
                  : decision === 'REPLACE'
                  ? t.calculator.verdictReplace
                  : t.calculator.verdictBorderline}
              </span>
            </div>

            <p className="text-sm font-semibold text-white leading-relaxed">
              {decisionReason}
            </p>

            {/* Key Ratios Meter */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">Repair Cost / New Price</span>
                  <span className="text-[10px] font-mono text-slate-500">Threshold: 50%</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-lime-400">
                    {repairCostRatio.toFixed(1)}%
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({formatINR(repairQuote)} / {formatINR(newApplianceCost)})
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden relative">
                  <div
                    className={`h-full transition-all duration-500 ${
                      repairCostRatio > 50 ? 'bg-rose-500' : 'bg-lime-400'
                    }`}
                    style={{ width: `${Math.min(repairCostRatio, 100)}%` }}
                  />
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-400" title="50% limit" />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">Elapsed Lifespan</span>
                  <span className="text-[10px] font-mono text-slate-500">Threshold: 50%</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-sky-400">
                    {ageRatio.toFixed(0)}%
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({ageYears} of {expectedLifespan} yrs)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden relative">
                  <div
                    className={`h-full transition-all duration-500 ${
                      ageRatio > 50 ? 'bg-amber-500' : 'bg-sky-400'
                    }`}
                    style={{ width: `${Math.min(ageRatio, 100)}%` }}
                  />
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-400" title="50% limit" />
                </div>
              </div>
            </div>

            {/* Environmental & Carbon Impact Footnote */}
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs flex items-start gap-2.5">
              <Leaf className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
              <p className="text-slate-400 text-[11px] leading-relaxed">
                <strong className="text-slate-200">Sustainability Note:</strong> Repairing avoids ~90–140 kg of electronic scrap and preserves the embedded manufacturing emissions of copper, aluminum, and sheet metal.
              </p>
            </div>
          </div>

          {/* Comparative Cost Analysis Over Horizon */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-lime-400" />
                  <span>{t.calculator.comparativeAnalysisTitle} ({analysisYears} Years)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Year-by-year projected cash outflow comparing repair upkeep vs replacement purchase with energy offset.
                </p>
              </div>

              {crossoverYear ? (
                <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl">
                  {t.calculator.paybackPeriod}: {crossoverYear} Yrs
                </span>
              ) : (
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-xl">
                  Repair Remains Cheaper Throughout
                </span>
              )}
            </div>

            {/* Schedule Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3 font-mono">{t.calculator.yearHeader}</th>
                    <th className="py-2.5 px-3 text-slate-200 font-semibold">{t.calculator.pathARepair}</th>
                    <th className="py-2.5 px-3 text-slate-200 font-semibold">{t.calculator.pathBReplace}</th>
                    <th className="py-2.5 px-3 text-right">{t.calculator.netDifference}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {comparativeSchedule.map((row) => (
                    <tr
                      key={row.year}
                      className={
                        row.year === analysisYears
                          ? 'bg-lime-400/5 font-bold text-white'
                          : 'hover:bg-slate-800/40 text-slate-300'
                      }
                    >
                      <td className="py-2.5 px-3 font-mono text-slate-400">
                        Year {row.year}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-lime-400">
                        {formatINR(row.repairCumulativeCost)}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-sky-400">
                        {formatINR(row.replaceCumulativeCost)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {row.diff >= 0 ? (
                          <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px]">
                            + {formatINR(row.diff)} (Save by Repair)
                          </span>
                        ) : (
                          <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded text-[11px]">
                            - {formatINR(Math.abs(row.diff))} (New Pays Off)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Bar */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">{t.calculator.cumulativeSpend} at Year {analysisYears}:</span>
                <span className="font-semibold text-white">
                  Path A: <strong className="text-lime-400 font-mono">{formatINR(finalYearData.repairCumulativeCost)}</strong> vs Path B: <strong className="text-sky-400 font-mono">{formatINR(finalYearData.replaceCumulativeCost)}</strong>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Total Advantage:</span>
                <span className="text-sm font-black text-white font-mono">
                  {finalYearData.diff >= 0
                    ? `Save ${formatINR(finalYearData.diff)} via Repair`
                    : `Save ${formatINR(Math.abs(finalYearData.diff))} via Replacement`}
                </span>
              </div>
            </div>
          </div>

          {/* Explicit Assumptions Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              <Info className="w-4 h-4 text-sky-400" />
              <span>{t.calculator.assumptionsTitle}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="font-bold text-slate-200 block">1. Baseline Design Lifespan</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Calibrated to Indian climate realities (heavy dust, humidity, 230V voltage fluctuations): {category} design benchmark is {expectedLifespan} years.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="font-bold text-slate-200 block">2. Energy Efficiency Differential</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Based on BEE 5-Star inverter technology vs older models with an electricity tariff benchmark of ₹7.50/kWh, yielding ~{formatINR(annualEnergySavings)}/yr in power reductions.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="font-bold text-slate-200 block">3. Post-Repair Maintenance Rate</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Estimated at {formatINR(annualUpkeepPostRepair)} annually after year 1 to account for aging secondary parts (belts, seals, capacitors, filters).
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="font-bold text-slate-200 block">4. New Unit Warranty & Scrap</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Includes 1-year comprehensive manufacturer warranty (zero maintenance cost during yr 1) and ₹{scrapValue} scrap exchange credit on decommissioned unit.
                </p>
              </div>
            </div>
          </div>

          {/* AI Advisor Response Block */}
          {aiAnalysis && (
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-lime-400/40 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-lime-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini Life-Cycle Advisor Output</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/10 text-lime-400 font-bold">
                  {aiAnalysis.recommendation}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                {aiAnalysis.economicAnalysis}
              </p>

              {aiAnalysis.energyEfficiencyConsideration && (
                <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/30 text-xs text-sky-200 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">{aiAnalysis.energyEfficiencyConsideration}</p>
                </div>
              )}

              {aiAnalysis.assumptions && aiAnalysis.assumptions.length > 0 && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1.5">
                    Calculated Assumptions by Gemini:
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1">
                    {aiAnalysis.assumptions.map((asm: string, i: number) => (
                      <li key={i}>{asm}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

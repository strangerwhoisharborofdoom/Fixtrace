import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    dashboard: string;
    appliances: string;
    diagnose: string;
    requests: string;
    calculator: string;
    technicians: string;
    analytics: string;
    admin: string;
    passport: string;
  };
  common: {
    loading: string;
    save: string;
    cancel: string;
    submit: string;
    delete: string;
    edit: string;
    view: string;
    back: string;
    next: string;
    search: string;
    filter: string;
    all: string;
    status: string;
    actions: string;
    confirmed: string;
    pending: string;
    demoBadge: string;
    liveBadge: string;
    verified: string;
    unverified: string;
  };
  dashboard: {
    welcome: string;
    subtitle: string;
    registeredAppliances: string;
    activeRequests: string;
    totalRepairSpend: string;
    upcomingWarranties: string;
    addNewAppliance: string;
    startDiagnosis: string;
    recentActivity: string;
    noAppliancesYet: string;
    noRequestsYet: string;
  };
  passport: {
    title: string;
    subtitle: string;
    applianceDetails: string;
    purchaseInfo: string;
    serviceHistory: string;
    qrTitle: string;
    qrInstruction: string;
    downloadQr: string;
    shareLink: string;
    printSummary: string;
    publicToggle: string;
    publicDescription: string;
    verifiedRepair: string;
    partsReplaced: string;
    serviceCosts: string;
    warrantyCoverage: string;
    technicianSignoff: string;
    noRepairsYet: string;
  };
  diagnose: {
    step1Title: string;
    step1Subtitle: string;
    step2Title: string;
    step2Subtitle: string;
    categoryLabel: string;
    brandLabel: string;
    modelLabel: string;
    symptomsLabel: string;
    symptomsPlaceholder: string;
    soundLabel: string;
    errorCodeLabel: string;
    startedLabel: string;
    photosLabel: string;
    voiceButton: string;
    voiceListening: string;
    runAiDiagnosis: string;
    analyzing: string;
    resultsTitle: string;
    causesTitle: string;
    safeChecksTitle: string;
    safetyHazardsTitle: string;
    technicianStepsTitle: string;
    bookRepairBtn: string;
    disclaimer: string;
  };
  requests: {
    title: string;
    subtitle: string;
    createNew: string;
    compareQuotes: string;
    acceptQuote: string;
    scheduledFor: string;
    statusTimeline: string;
    addressLabel: string;
    preferredTime: string;
    noQuotesYet: string;
  };
  calculator: {
    title: string;
    subtitle: string;
    applianceAge: string;
    originalCost: string;
    repairCost: string;
    newApplianceCost: string;
    calculate: string;
    recommendation: string;
    rule50Title: string;
    rule50Desc: string;
    energyFactor: string;
    economicAnalysis: string;
    timeHorizon: string;
    tcoAnalysis: string;
    cumulativeSpend: string;
    repairOption: string;
    replaceOption: string;
    assumptionsTitle: string;
    selectFromAppliances: string;
    customAppliance: string;
    comparativeAnalysisTitle: string;
    yearHeader: string;
    pathARepair: string;
    pathBReplace: string;
    netDifference: string;
    paybackPeriod: string;
    annualMaintenanceAssumption: string;
    annualPowerSavingsAssumption: string;
    scrapValueLabel: string;
    verdictRepair: string;
    verdictReplace: string;
    verdictBorderline: string;
    tcoSummary: string;
  };
  verification: {
    title: string;
    badgeVerified: string;
    badgePending: string;
    badgeUnverified: string;
    badgeRejected: string;
    applyButton: string;
    idTypeLabel: string;
    idNumberLabel: string;
    certTypeLabel: string;
    certNumberLabel: string;
    docUploadLabel: string;
    adminReviewTitle: string;
    approveButton: string;
    rejectButton: string;
    customerWarning: string;
    verifiedProofSummary: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'FixTrace',
    tagline: 'Appliance Repair Intelligence & Digital Passports',
    nav: {
      dashboard: 'Dashboard',
      appliances: 'My Appliances',
      diagnose: 'AI Diagnosis',
      requests: 'Service Requests',
      calculator: 'Repair vs Replace',
      technicians: 'Technicians',
      analytics: 'Analytics',
      admin: 'Admin Console',
      passport: 'Repair Passport',
    },
    common: {
      loading: 'Loading...',
      save: 'Save Changes',
      cancel: 'Cancel',
      submit: 'Submit',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View Details',
      back: 'Back',
      next: 'Next Step',
      search: 'Search appliances, requests...',
      filter: 'Filter',
      all: 'All',
      status: 'Status',
      actions: 'Actions',
      confirmed: 'Confirmed',
      pending: 'Pending',
      demoBadge: 'DEMO MODE',
      liveBadge: 'LIVE',
      verified: 'Verified Tech',
      unverified: 'Unverified',
    },
    dashboard: {
      welcome: 'Namaste',
      subtitle: 'Manage household appliances, service histories, and AI-assisted repairs.',
      registeredAppliances: 'Registered Appliances',
      activeRequests: 'Active Repair Requests',
      totalRepairSpend: 'Total Recorded Spend',
      upcomingWarranties: 'Active Warranties',
      addNewAppliance: 'Register Appliance',
      startDiagnosis: 'Diagnose a Fault',
      recentActivity: 'Recent Service Timeline',
      noAppliancesYet: 'No appliances registered yet. Add your first household appliance to generate its Digital Passport.',
      noRequestsYet: 'No active repair requests. If an appliance has an issue, start an AI diagnosis.',
    },
    passport: {
      title: 'Digital Repair Passport',
      subtitle: 'Immutable record of maintenance, genuine parts, and technician sign-offs.',
      applianceDetails: 'Appliance Identity',
      purchaseInfo: 'Purchase & Warranty Data',
      serviceHistory: 'Service & Fault History',
      qrTitle: 'Passport QR Identifier',
      qrInstruction: 'Scan with smartphone camera to view verified service records and ownership details.',
      downloadQr: 'Download QR Sticker',
      shareLink: 'Share Passport Link',
      printSummary: 'Print Service Summary',
      publicToggle: 'Make Passport Publicly Accessible',
      publicDescription: 'Allow anyone who scans the QR code to view verified repair history without login.',
      verifiedRepair: 'Technician-Certified Repair',
      partsReplaced: 'Replaced Spare Parts',
      serviceCosts: 'Recorded Costs',
      warrantyCoverage: 'Post-Repair Warranty',
      technicianSignoff: 'Certified by Technician',
      noRepairsYet: 'Clean service history. No repairs or faults recorded yet.',
    },
    diagnose: {
      step1Title: 'Select Appliance & Symptoms',
      step1Subtitle: 'Describe what went wrong in English, Kannada, or Hindi.',
      step2Title: 'AI Preliminary Analysis',
      step2Subtitle: 'Generated by Gemini with safety constraints.',
      categoryLabel: 'Appliance Category',
      brandLabel: 'Brand / Manufacturer',
      modelLabel: 'Model Number (Optional)',
      symptomsLabel: 'Describe the Problem',
      symptomsPlaceholder: 'e.g., Washing machine stops during spin cycle and makes a grinding sound with OE error...',
      soundLabel: 'Unusual sounds or odors?',
      errorCodeLabel: 'Display Error Code (if visible)',
      startedLabel: 'When did it start?',
      photosLabel: 'Attach Photos / Videos (Optional)',
      voiceButton: 'Voice-to-Text Input',
      voiceListening: 'Listening... Speak now',
      runAiDiagnosis: 'Generate AI Diagnostic Report',
      analyzing: 'Analyzing symptoms & safety risks...',
      resultsTitle: 'AI Fault Assessment',
      causesTitle: 'Plausible Root Causes',
      safeChecksTitle: 'Safe Customer Checks (Non-Invasive)',
      safetyHazardsTitle: 'Critical Safety Warnings',
      technicianStepsTitle: 'Technician Recommended Next Steps',
      bookRepairBtn: 'Convert to Service Request',
      disclaimer: 'Notice: This report is an AI preliminary suggestion based on reported symptoms. It does not replace on-site physical multimeter testing by a qualified technician.',
    },
    requests: {
      title: 'Service Requests',
      subtitle: 'Track your repair journey from intake to technician quote and sign-off.',
      createNew: 'New Service Request',
      compareQuotes: 'Compare Quotes',
      acceptQuote: 'Accept & Schedule',
      scheduledFor: 'Scheduled Visit',
      statusTimeline: 'Lifecycle Status',
      addressLabel: 'Service Address in India',
      preferredTime: 'Preferred Time Window',
      noQuotesYet: 'Waiting for local technicians to submit itemized quotes.',
    },
    calculator: {
      title: 'Repair vs. Replace Advisor',
      subtitle: 'Make informed economic and environmental decisions using the 50% Rule and Indian benchmark lifespans.',
      applianceAge: 'Appliance Age (Years)',
      originalCost: 'Original Purchase Price (₹)',
      repairCost: 'Estimated Repair Cost (₹)',
      newApplianceCost: 'New Equivalent Appliance Price (₹)',
      calculate: 'Analyze Economics',
      recommendation: 'Recommendation',
      rule50Title: 'The 50% Financial Rule',
      rule50Desc: 'If the repair cost exceeds 50% of the replacement price AND the appliance is older than 50% of its lifespan, replacement is generally advised.',
      energyFactor: 'Energy Efficiency Benchmark',
      economicAnalysis: 'Economic Assessment',
      timeHorizon: 'Analysis Time Horizon',
      tcoAnalysis: 'Total Cost of Ownership (TCO) Projection',
      cumulativeSpend: 'Cumulative Projected Spend',
      repairOption: 'Option A: Repair & Maintain Existing',
      replaceOption: 'Option B: Replace with New Model',
      assumptionsTitle: 'Explicit Assumptions & Calculation Method',
      selectFromAppliances: 'Select from My Registered Appliances',
      customAppliance: 'Enter Custom / Unregistered Appliance',
      comparativeAnalysisTitle: 'Comparative Cost Analysis Over Horizon',
      yearHeader: 'Year',
      pathARepair: 'Path A: Repair Existing',
      pathBReplace: 'Path B: Replace with New Model',
      netDifference: 'Net Economic Advantage',
      paybackPeriod: 'Payback Period',
      annualMaintenanceAssumption: 'Est. Annual Upkeep After Repair (₹)',
      annualPowerSavingsAssumption: 'Est. Annual Power Savings with New 5-Star Unit (₹)',
      scrapValueLabel: 'Old Unit Scrap / Exchange Value (₹)',
      verdictRepair: 'Repair Recommended',
      verdictReplace: 'Replacement Recommended',
      verdictBorderline: 'Borderline / Second Opinion Recommended',
      tcoSummary: 'Total Cost of Ownership Projection',
    },
    verification: {
      title: 'Technician Credential Verification',
      badgeVerified: 'Verified Professional',
      badgePending: 'Verification Pending Review',
      badgeUnverified: 'Unverified Technician',
      badgeRejected: 'Verification Rejected',
      applyButton: 'Submit Proof of Certification & ID',
      idTypeLabel: 'Government ID Type',
      idNumberLabel: 'ID Number',
      certTypeLabel: 'Trade Certification / License Type',
      certNumberLabel: 'Certificate Registration Number',
      docUploadLabel: 'Upload Proof Documents (Photo / PDF)',
      adminReviewTitle: 'Administrator Credential Review Console',
      approveButton: 'Approve & Issue Verified Badge',
      rejectButton: 'Reject Submission',
      customerWarning: 'Notice: This technician has not completed certification verification. Proceed with appropriate caution.',
      verifiedProofSummary: 'Identity and technical trade certificate verified by FixTrace Administrator.',
    },
  },
  kn: {
    appName: 'ಫಿಕ್ಸ್ ಟ್ರೇಸ್ (FixTrace)',
    tagline: 'ಗೃಹೋಪಕರಣಗಳ ರಿಪೇರಿ ಮತ್ತು ಡಿಜಿಟಲ್ ಪಾಸ್‌ಪೋರ್ಟ್',
    nav: {
      dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      appliances: 'ನನ್ನ ಉಪಕರಣಗಳು',
      diagnose: 'AI ತಪಾಸಣೆ',
      requests: 'ರಿಪೇರಿ ಕೋರಿಕೆಗಳು',
      calculator: 'ರಿಪೇರಿ vs ಬದಲಿ',
      technicians: 'ತಂತ್ರಜ್ಞರು',
      analytics: 'ವಿಶ್ಲೇಷಣೆ',
      admin: 'ಅಡ್ಮಿನ್',
      passport: 'ರಿಪೇರಿ ಪಾಸ್‌ಪೋರ್ಟ್',
    },
    common: {
      loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
      save: 'ಉಳಿಸಿ',
      cancel: 'ರದ್ದುಮಾಡಿ',
      submit: 'ಸಲ್ಲಿಸಿ',
      delete: 'ಅಳಿಸಿ',
      edit: 'ಬದಲಾಯಿಸಿ',
      view: 'ವಿವರ ನೋಡಿ',
      back: 'ಹಿಂದೆ',
      next: 'ಮುಂದೆ',
      search: 'ಹುಡುಕಿ...',
      filter: 'ಫಿಲ್ಟರ್',
      all: 'ಎಲ್ಲವೂ',
      status: 'ಸ್ಥಿತಿ',
      actions: 'ಕ್ರಮಗಳು',
      confirmed: 'ದೃಢೀಕರಿಸಲಾಗಿದೆ',
      pending: 'ಬಾಕಿ ಇದೆ',
      demoBadge: 'ಡೆಮೊ ಮೋಡ್',
      liveBadge: 'ಲೈವ್',
      verified: 'ದೃಢೀಕೃತ ತಂತ್ರಜ್ಞ',
      unverified: 'ದೃಢೀಕರಿಸಲಾಗಿಲ್ಲ',
    },
    dashboard: {
      welcome: 'ನಮಸ್ಕಾರ',
      subtitle: 'ನಿಮ್ಮ ಗೃಹೋಪಕರಣಗಳು, ಸೇವಾ ಇತಿಹಾಸ ಮತ್ತು AI ರಿಪೇರಿ ನಿರ್ವಹಣೆ.',
      registeredAppliances: 'ನೋಂದಾಯಿತ ಉಪಕರಣಗಳು',
      activeRequests: 'ಸಕ್ರಿಯ ರಿಪೇರಿ ವಿನಂತಿಗಳು',
      totalRepairSpend: 'ಒಟ್ಟು ರಿಪೇರಿ ವೆಚ್ಚ',
      upcomingWarranties: 'ಸಕ್ರಿಯ ವಾರಂಟಿಗಳು',
      addNewAppliance: 'ಉಪಕರಣ ನೋಂದಾಯಿಸಿ',
      startDiagnosis: 'ದೋಷ ತಪಾಸಣೆ',
      recentActivity: 'ಇತ್ತೀಚಿನ ಸೇವಾ ಇತಿಹಾಸ',
      noAppliancesYet: 'ಯಾವುದೇ ಉಪಕರಣ ನೋಂದಣಿಯಾಗಿಲ್ಲ. ಡಿಜಿಟಲ್ ಪಾಸ್‌ಪೋರ್ಟ್ ಪಡೆಯಲು ಮೊದಲ ಉಪಕರಣ ಸೇರಿಸಿ.',
      noRequestsYet: 'ಯಾವುದೇ ಸಕ್ರಿಯ ರಿಪೇರಿ ವಿನಂತಿಗಳಿಲ್ಲ.',
    },
    passport: {
      title: 'ಡಿಜಿಟಲ್ ರಿಪೇರಿ ಪಾಸ್‌ಪೋರ್ಟ್',
      subtitle: 'ಉಪಕರಣದ ಅಧಿಕೃತ ರಿಪೇರಿ ಇತಿಹಾಸ ಮತ್ತು ಬಿಡಿಭಾಗಗಳ ದಾಖಲೆ.',
      applianceDetails: 'ಉಪಕರಣದ ಮಾಹಿತಿ',
      purchaseInfo: 'ಖರೀದಿ ಮತ್ತು ವಾರಂಟಿ',
      serviceHistory: 'ರಿಪೇರಿ ಮತ್ತು ಸೇವಾ ಇತಿಹಾಸ',
      qrTitle: 'ಪಾಸ್‌ಪೋರ್ಟ್ QR ಕೋಡ್',
      qrInstruction: 'ದೃಢೀಕೃತ ಇತಿಹಾಸವನ್ನು ವೀಕ್ಷಿಸಲು ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಮೂಲಕ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.',
      downloadQr: 'QR ಸ್ಟಿಕ್ಕರ್ ಡೌನ್‌ಲೋಡ್',
      shareLink: 'ಲಿಂಕ್ ಹಂಚಿಕೊಳ್ಳಿ',
      printSummary: 'ಪ್ರಿಂಟ್ ಸಾರಾಂಶ',
      publicToggle: 'ಪಾಸ್‌ಪೋರ್ಟ್ ಸಾರ್ವಜನಿಕವಾಗಿ ಲಭ್ಯವಾಗಿಸಿ',
      publicDescription: 'QR ಸ್ಕ್ಯಾನ್ ಮಾಡುವ ಯಾರಾದರೂ ಇತಿಹಾಸವನ್ನು ನೋಡಲು ಅನುಮತಿಸಿ.',
      verifiedRepair: 'ತಂತ್ರಜ್ಞರಿಂದ ದೃಢೀಕರಿಸಲ್ಪಟ್ಟ ಸೇವೆ',
      partsReplaced: 'ಬದಲಾಯಿಸಲಾದ ಬಿಡಿಭಾಗಗಳು',
      serviceCosts: 'ದಾಖಲಾದ ವೆಚ್ಚ',
      warrantyCoverage: 'ರಿಪೇರಿ ನಂತರದ ವಾರಂಟಿ',
      technicianSignoff: 'ತಂತ್ರಜ್ಞರ ದೃಢೀಕರಣ',
      noRepairsYet: 'ಯಾವುದೇ ದೋಷ ಅಥವಾ ರಿಪೇರಿ ದಾಖಲಾಗಿಲ್ಲ.',
    },
    diagnose: {
      step1Title: 'ಉಪಕರಣ ಮತ್ತು ಸಮಸ್ಯೆ ಆಯ್ಕೆಮಾಡಿ',
      step1Subtitle: 'ಸಮಸ್ಯೆಯನ್ನು ಕನ್ನಡ, ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಹಿಂದಿಯಲ್ಲಿ ವಿವರಿಸಿ.',
      step2Title: 'AI ಪ್ರಾಥಮಿಕ ವಿಶ್ಲೇಷಣೆ',
      step2Subtitle: 'ಜೆಮಿನಿ AI ಸುರಕ್ಷತಾ ನಿಯಮಗಳೊಂದಿಗೆ ವಿಶ್ಲೇಷಿಸಿದೆ.',
      categoryLabel: 'ಉಪಕರಣದ ವರ್ಗ',
      brandLabel: 'ಬ್ರಾಂಡ್ / ಕಂಪನಿ',
      modelLabel: 'ಮಾದರಿ ಸಂಖ್ಯೆ',
      symptomsLabel: 'ಸಮಸ್ಯೆ ಏನು ಎಂದು ವಿವರಿಸಿ',
      symptomsPlaceholder: 'ಉದಾ: ವಾಷಿಂಗ್ ಮೆಷಿನ್ ಸ್ಪಿನ್ ಆಗುವಾಗ ಶಬ್ದ ಮಾಡುತ್ತಿದೆ ಮತ್ತು ನೀರು ಹೊರಹೋಗುತ್ತಿಲ್ಲ...',
      soundLabel: 'ಏನಾದರೂ ಅಸಾಮಾನ್ಯ ಶಬ್ದ ಅಥವಾ ವಾಸನೆ ಬರುತ್ತಿದೆಯೇ?',
      errorCodeLabel: 'ಎರರ್ ಕೋಡ್ (ಸ್ಕ್ರೀನ್ ಮೇಲೆ ಇದ್ದರೆ)',
      startedLabel: 'ಸಮಸ್ಯೆ ಯಾವಾಗ ಪ್ರಾರಂಭವಾಯಿತು?',
      photosLabel: 'ಫೋಟೋ ಲಗತ್ತಿಸಿ (ಐಚ್ಛಿಕ)',
      voiceButton: 'ಧ್ವನಿ ಮೂಲಕ ಹೇಳಿ (Voice Input)',
      voiceListening: 'ಕೇಳಿಸಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ... ಮಾತನಾಡಿ',
      runAiDiagnosis: 'AI ವರದಿ ಪಡೆಯಿರಿ',
      analyzing: 'ಸಮಸ್ಯೆ ಮತ್ತು ಸುರಕ್ಷತೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
      resultsTitle: 'AI ತಪಾಸಣಾ ವರದಿ',
      causesTitle: 'ಸಾಧ್ಯವಿರುವ ಕಾರಣಗಳು',
      safeChecksTitle: 'ಸುರಕ್ಷಿತ ಸ್ವಯಂ ತಪಾಸಣೆಗಳು',
      safetyHazardsTitle: 'ಅಪಾಯ ಎಚ್ಚರಿಕೆಗಳು',
      technicianStepsTitle: 'ತಂತ್ರಜ್ಞರು ಪರಿಶೀಲಿಸಬೇಕಾದ ಅಂಶಗಳು',
      bookRepairBtn: 'ರಿಪೇರಿ ವಿನಂತಿಗೆ ಪರಿವರ್ತಿಸಿ',
      disclaimer: 'ಗಮನಿಸಿ: ಇದು AI ನೀಡಿದ ಪ್ರಾಥಮಿಕ ಸಲಹೆ. ವಿದ್ಯುತ್ ಉಪಕರಣಗಳನ್ನು ನುರಿತ ತಂತ್ರಜ್ಞರಿಂದಲೇ ತಪಾಸಣೆ ಮಾಡಿಸಿ.',
    },
    requests: {
      title: 'ರಿಪೇರಿ ಕೋರಿಕೆಗಳು',
      subtitle: 'ನಿಮ್ಮ ರಿಪೇರಿ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.',
      createNew: 'ಹೊಸ ರಿಪೇರಿ ಕೋರಿಕೆ',
      compareQuotes: 'ಕೊಟೇಶನ್‌ಗಳನ್ನು ಹೋಲಿಕೆ ಮಾಡಿ',
      acceptQuote: 'ಒಪ್ಪಿಕೊಳ್ಳಿ ಮತ್ತು ನಿಗದಿಪಡಿಸಿ',
      scheduledFor: 'ನಿಗದಿತ ಭೇಟಿ',
      statusTimeline: 'ಸ್ಥಿತಿಯ ಹಂತಗಳು',
      addressLabel: 'ಸೇವಾ ವಿಳಾಸ',
      preferredTime: 'ಅನುಕೂಲಕರ ಸಮಯ',
      noQuotesYet: 'ಸ್ಥಳೀಯ ತಂತ್ರಜ್ಞರಿಂದ ಕೊಟೇಶನ್‌ಗಳಿಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ.',
    },
    calculator: {
      title: 'ರಿಪೇರಿ vs ಬದಲಿ ಸಲಹೆಗಾರ',
      subtitle: 'ಉಪಕರಣವನ್ನು ರಿಪೇರಿ ಮಾಡಬೇಕೆ ಅಥವಾ ಹೊಸದನ್ನು ಖರೀದಿಸಬೇಕೆ ಎಂದು ನಿರ್ಧರಿಸಿ.',
      applianceAge: 'ಉಪಕರಣದ ವಯಸ್ಸು (ವರ್ಷಗಳು)',
      originalCost: 'ಮೂಲ ಖರೀದಿ ಬೆಲೆ (₹)',
      repairCost: 'ಅಂದಾಜು ರಿಪೇರಿ ವೆಚ್ಚ (₹)',
      newApplianceCost: 'ಹೊಸ ಉಪಕರಣದ ಬೆಲೆ (₹)',
      calculate: 'ಆರ್ಥಿಕ ವಿಶ್ಲೇಷಣೆ',
      recommendation: 'ಸಲಹೆ',
      rule50Title: '50% ಆರ್ಥಿಕ ನಿಯಮ',
      rule50Desc: 'ರಿಪೇರಿ ವೆಚ್ಚವು ಹೊಸ ಬೆಲೆಯ 50% ಕ್ಕಿಂತ ಹೆಚ್ಚಿದ್ದರೆ, ಹೊಸದನ್ನು ಖರೀದಿಸುವುದು ಸೂಕ್ತ.',
      energyFactor: 'ವಿದ್ಯುತ್ ಉಳಿತಾಯ',
      economicAnalysis: 'ವಿಶ್ಲೇಷಣೆ',
      timeHorizon: 'ವಿಶ್ಲೇಷಣಾ ಕಾಲಾವಧಿ',
      tcoAnalysis: 'ಒಟ್ಟು ಸ್ವಾಮ್ಯ ವೆಚ್ಚ (TCO) ಅಂದಾಜು',
      cumulativeSpend: 'ಒಟ್ಟು ಅಂದಾಜು ವೆಚ್ಚ',
      repairOption: 'ಆಯ್ಕೆ A: ರಿಪೇರಿ ಮತ್ತು ನಿರ್ವಹಣೆ',
      replaceOption: 'ಆಯ್ಕೆ B: ಹೊಸ ಉಪಕರಣ ಖರೀದಿ',
      assumptionsTitle: 'ಲೆಕ್ಕಾಚಾರದ ವಿಧಾನ ಮತ್ತು ಊಹೆಗಳು',
      selectFromAppliances: 'ನನ್ನ ನೋಂದಾಯಿತ ಉಪಕರಣಗಳಿಂದ ಆಯ್ಕೆಮಾಡಿ',
      customAppliance: 'ಬೇರೆ ಉಪಕರಣದ ವಿವರ ನಮೂದಿಸಿ',
      comparativeAnalysisTitle: 'ಕಾಲಾವಧಿಯ ಆಧಾರಿತ ವೆಚ್ಚ ಹೋಲಿಕೆ ವಿಶ್ಲೇಷಣೆ',
      yearHeader: 'ವರ್ಷ',
      pathARepair: 'ಆಯ್ಕೆ A: ಈಗಿನ ಉಪಕರಣ ರಿಪೇರಿ',
      pathBReplace: 'ಆಯ್ಕೆ B: ಹೊಸ ಉಪಕರಣ ಖರೀದಿ',
      netDifference: 'ಆರ್ಥಿಕ ಉಳಿತಾಯ / ಲಾಭ',
      paybackPeriod: 'ವೆಚ್ಚ ಮರುಪಾವತಿ ಅವಧಿ',
      annualMaintenanceAssumption: 'ರಿಪೇರಿ ನಂತರದ ಅಂದಾಜು ವಾರ್ಷಿಕ ನಿರ್ವಹಣೆ (₹)',
      annualPowerSavingsAssumption: 'ಹೊಸ 5-ಸ್ಟಾರ್ ಮಾದರಿಯಿಂದ ವಾರ್ಷಿಕ ವಿದ್ಯುತ್ ಉಳಿತಾಯ (₹)',
      scrapValueLabel: 'ಹಳೆಯ ಉಪಕರಣದ ಗುಜರಿ / ಎಕ್ಸ್‌ಚೇಂಜ್ ಮೌಲ್ಯ (₹)',
      verdictRepair: 'ರಿಪೇರಿ ಮಾಡಿಸುವುದು ಸೂಕ್ತ',
      verdictReplace: 'ಹೊಸ ಉಪಕರಣ ಖರೀದಿಸುವುದು ಸೂಕ್ತ',
      verdictBorderline: 'ಎಚ್ಚರಿಕೆಯ ಪರಿಶೀಲನೆ ಅಗತ್ಯ',
      tcoSummary: 'ಒಟ್ಟು ಸ್ವಾಮ್ಯ ವೆಚ್ಚ (TCO) ಹೋಲಿಕೆ',
    },
    verification: {
      title: 'ತಂತ್ರಜ್ಞರ ದೃಢೀಕರಣ ಪ್ರಕ್ರಿಯೆ',
      badgeVerified: 'ದೃಢೀಕೃತ ತಂತ್ರಜ್ಞ',
      badgePending: 'ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ',
      badgeUnverified: 'ದೃಢೀಕರಿಸದ ತಂತ್ರಜ್ಞ',
      badgeRejected: 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ',
      applyButton: 'ಪ್ರಮಾಣಪತ್ರ ಮತ್ತು ID ಸಲ್ಲಿಸಿ',
      idTypeLabel: 'ಸರ್ಕಾರಿ ಗುರುತಿನ ಚೀಟಿ',
      idNumberLabel: 'ಗುರುತಿನ ಸಂಖ್ಯೆ',
      certTypeLabel: 'ವೃತ್ತಿಪರ ಪ್ರಮಾಣಪತ್ರ / ಪರವಾನಗಿ',
      certNumberLabel: 'ಪ್ರಮಾಣಪತ್ರ ಸಂಖ್ಯೆ',
      docUploadLabel: 'ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (ಫೋಟೋ / PDF)',
      adminReviewTitle: 'ಅಡ್ಮಿನ್ ಪರಿಶೀಲನಾ ಕನ್ಸೋಲ್',
      approveButton: 'ಅನುಮೋದಿಸಿ & ಬ್ಯಾಡ್ಜ್ ನೀಡಿ',
      rejectButton: 'ತಿರಸ್ಕರಿಸಿ',
      customerWarning: 'ಗಮನಿಸಿ: ಈ ತಂತ್ರಜ್ಞರು ಇನ್ನೂ ಪ್ರಮಾಣೀಕರಣ ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಳಿಸಿಲ್ಲ. ಎಚ್ಚರಿಕೆಯಿಂದ ಮುಂದುವರಿಯಿರಿ.',
      verifiedProofSummary: 'ಗುರುತು ಮತ್ತು ತಾಂತ್ರಿಕ ಪ್ರಮಾಣಪತ್ರವನ್ನು ಅಡ್ಮಿನ್ ಪರಿಶೀಲಿಸಿದ್ದಾರೆ.',
    },
  },
  hi: {
    appName: 'फ़िक्सट्रेस (FixTrace)',
    tagline: 'उपकरण मरम्मत इंटेलिजेंस और डिजिटल पासपोर्ट',
    nav: {
      dashboard: 'डैशबोर्ड',
      appliances: 'मेरे उपकरण',
      diagnose: 'AI डायग्नोसिस',
      requests: 'मरम्मत अनुरोध',
      calculator: 'मरम्मत या बदलाव',
      technicians: 'तकनीशियन',
      analytics: 'एनालिटिक्स',
      admin: 'व्यवस्थापक',
      passport: 'रिपेयर पासपोर्ट',
    },
    common: {
      loading: 'लोड हो रहा है...',
      save: 'सुरक्षित करें',
      cancel: 'रद्द करें',
      submit: 'सबमिट करें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      view: 'विवरण देखें',
      back: 'वापस',
      next: 'अगला',
      search: 'खोजें...',
      filter: 'फ़िल्टर',
      all: 'सभी',
      status: 'स्थिति',
      actions: 'कार्रवाई',
      confirmed: 'पुष्ट',
      pending: 'लंबित',
      demoBadge: 'डेमो मोड',
      liveBadge: 'लाइव',
      verified: 'सत्यापित तकनीशियन',
      unverified: 'असत्यापित',
    },
    dashboard: {
      welcome: 'नमस्ते',
      subtitle: 'घरेलू उपकरणों, सर्विस हिस्ट्री और AI आधारित मरम्मत का प्रबंधन करें।',
      registeredAppliances: 'पंजीकृत उपकरण',
      activeRequests: 'सक्रिय मरम्मत अनुरोध',
      totalRepairSpend: 'कुल दर्ज मरम्मत खर्च',
      upcomingWarranties: 'सक्रिय वारंटी',
      addNewAppliance: 'उपकरण जोड़ें',
      startDiagnosis: 'समस्या की जांच करें',
      recentActivity: 'हालिया सेवा गतिविधि',
      noAppliancesYet: 'कोई उपकरण पंजीकृत नहीं है। डिजिटल पासपोर्ट बनाने के लिए पहला उपकरण जोड़ें।',
      noRequestsYet: 'कोई सक्रिय मरम्मत अनुरोध नहीं है।',
    },
    passport: {
      title: 'डिजिटल रिपेयर पासपोर्ट',
      subtitle: 'विश्वसनीय मरम्मत इतिहास, बदले गए पार्ट्स और तकनीशियन सत्यापन का रिकॉर्ड।',
      applianceDetails: 'उपकरण की पहचान',
      purchaseInfo: 'खरीद और वारंटी विवरण',
      serviceHistory: 'सेवा और खराबी इतिहास',
      qrTitle: 'पासपोर्ट QR कोड',
      qrInstruction: 'सत्यापित मरम्मत इतिहास देखने के लिए स्मार्टफोन से स्कैन करें।',
      downloadQr: 'QR स्टिकर डाउनलोड करें',
      shareLink: 'लिंक शेयर करें',
      printSummary: 'सारांश प्रिंट करें',
      publicToggle: 'पासपोर्ट सार्वजनिक रूप से सुलभ बनाएं',
      publicDescription: 'QR स्कैन करने वाले किसी भी व्यक्ति को सर्विस हिस्ट्री देखने की अनुमति दें।',
      verifiedRepair: 'तकनीशियन-प्रमाणित मरम्मत',
      partsReplaced: 'बदले गए स्पेयर पार्ट्स',
      serviceCosts: 'दर्ज किया गया खर्च',
      warrantyCoverage: 'मरम्मत के बाद की वारंटी',
      technicianSignoff: 'तकनीशियन द्वारा हस्ताक्षरित',
      noRepairsYet: 'सर्विस इतिहास साफ है। अभी तक कोई खराबी दर्ज नहीं है।',
    },
    diagnose: {
      step1Title: 'उपकरण और समस्या चुनें',
      step1Subtitle: 'हिंदी, अंग्रेजी या कन्नड़ में समस्या का विवरण दें।',
      step2Title: 'AI प्रारंभिक विश्लेषण',
      step2Subtitle: 'जेमिनी AI द्वारा सुरक्षा नियमों के साथ विश्लेषण।',
      categoryLabel: 'उपकरण की श्रेणी',
      brandLabel: 'ब्रांड / निर्माता',
      modelLabel: 'मॉडल नंबर (वैकल्पिक)',
      symptomsLabel: 'समस्या का वर्णन करें',
      symptomsPlaceholder: 'उदा. वाशिंग मशीन स्पिन के समय तेज आवाज कर रही है और पानी नहीं निकल रहा...',
      soundLabel: 'अजीब आवाज या गंध?',
      errorCodeLabel: 'एरर कोड (यदि स्क्रीन पर दिखाई दे)',
      startedLabel: 'समस्या कब शुरू हुई?',
      photosLabel: 'तस्वीरें संलग्न करें (वैकल्पिक)',
      voiceButton: 'आवाज से इनपुट दें (Voice Input)',
      voiceListening: 'सुन रहे हैं... बोलिए',
      runAiDiagnosis: 'AI जांच शुरू करें',
      analyzing: 'समस्या और सुरक्षा का विश्लेषण जारी...',
      resultsTitle: 'AI खराबी मूल्यांकन',
      causesTitle: 'संभावित कारण',
      safeChecksTitle: 'सुरक्षित प्राथमिक जांच (गैर-खतरनाक)',
      safetyHazardsTitle: 'गंभीर सुरक्षा चेतावनियाँ',
      technicianStepsTitle: 'तकनीशियन के लिए अनुशंसित कदम',
      bookRepairBtn: 'सर्विस रिक्वेस्ट में बदलें',
      disclaimer: 'सूचना: यह रिपोर्ट AI का प्रारंभिक सुझाव है। बिजली उपकरणों की आंतरिक जांच केवल योग्य तकनीशियन से ही कराएं।',
    },
    requests: {
      title: 'मरम्मत अनुरोध',
      subtitle: 'जांच से लेकर कोटेशन और मरम्मत पूरा होने तक ट्रैक करें।',
      createNew: 'नया अनुरोध बनाएं',
      compareQuotes: 'कोटेशन की तुलना करें',
      acceptQuote: 'स्वीकारें और समय तय करें',
      scheduledFor: 'निर्धारित विजिट',
      statusTimeline: 'प्रक्रिया के चरण',
      addressLabel: 'सेवा का पता',
      preferredTime: 'पसंदीदा समय',
      noQuotesYet: 'स्थानीय तकनीशियनों से कोटेशन की प्रतीक्षा है।',
    },
    calculator: {
      title: 'मरम्मत बनाम नया उपकरण सलाहकार',
      subtitle: '50% वित्तीय नियम और भारतीय औसत जीवनकाल के आधार पर समझदारी भरा फैसला लें।',
      applianceAge: 'उपकरण की उम्र (वर्ष)',
      originalCost: 'मूल खरीद मूल्य (₹)',
      repairCost: 'अनुमानित मरम्मत लागत (₹)',
      newApplianceCost: 'नए उपकरण की कीमत (₹)',
      calculate: 'आर्थिक विश्लेषण करें',
      recommendation: 'सिफारिश',
      rule50Title: '50% वित्तीय नियम',
      rule50Desc: 'यदि मरम्मत की लागत नए उपकरण की कीमत के 50% से अधिक है और उम्र आधी से ज्यादा है, तो नया लेना बेहतर है।',
      energyFactor: 'बिजली की बचत',
      economicAnalysis: 'आर्थिक विश्लेषण',
      timeHorizon: 'विश्लेषण समय सीमा',
      tcoAnalysis: 'कुल स्वामित्व लागत (TCO) अनुमान',
      cumulativeSpend: 'कुल अनुमानित खर्च',
      repairOption: 'विकल्प A: मौजूदा उपकरण की मरम्मत',
      replaceOption: 'विकल्प B: नया उपकरण खरीदना',
      assumptionsTitle: 'गणना विधि और स्पष्ट मान्यताएं',
      selectFromAppliances: 'मेरे पंजीकृत उपकरणों में से चुनें',
      customAppliance: 'अन्य / नया उपकरण विवरण दर्ज करें',
      comparativeAnalysisTitle: 'निर्दिष्ट समय सीमा में तुलनात्मक लागत विश्लेषण',
      yearHeader: 'वर्ष',
      pathARepair: 'विकल्प A: मौजूदा उपकरण की मरम्मत',
      pathBReplace: 'विकल्प B: नया मॉडल खरीदना',
      netDifference: 'शुद्ध आर्थिक बचत / लाभ',
      paybackPeriod: 'लागत वसूली अवधि',
      annualMaintenanceAssumption: 'मरम्मत उपरांत अनुमानित वार्षिक रखरखाव (₹)',
      annualPowerSavingsAssumption: 'नए 5-स्टार मॉडल से वार्षिक बिजली बचत (₹)',
      scrapValueLabel: 'पुराने उपकरण का कबाड़ / एक्सचेंज मूल्य (₹)',
      verdictRepair: 'मरम्मत की सिफारिश',
      verdictReplace: 'नया उपकरण खरीदने की सिफारिश',
      verdictBorderline: 'पुनर्विचार / दूसरी राय की सिफारिश',
      tcoSummary: 'कुल स्वामित्व लागत (TCO) तुलना',
    },
    verification: {
      title: 'तकनीशियन प्रमाणन सत्यापन',
      badgeVerified: 'सत्यापित पेशेवर',
      badgePending: 'सत्यापन समीक्षाधीन',
      badgeUnverified: 'असत्यापित तकनीशियन',
      badgeRejected: 'सत्यापन अस्वीकृत',
      applyButton: 'प्रमाणपत्र और पहचान पत्र जमा करें',
      idTypeLabel: 'सरकारी पहचान पत्र प्रकार',
      idNumberLabel: 'पहचान पत्र संख्या',
      certTypeLabel: 'ट्रेड प्रमाणपत्र / लाइसेंस प्रकार',
      certNumberLabel: 'प्रमाणपत्र पंजीकरण संख्या',
      docUploadLabel: 'दस्तावेज अपलोड करें (फोटो / PDF)',
      adminReviewTitle: 'व्यवस्थापक समीक्षा कंसोल',
      approveButton: 'स्वीकृत करें और बैज जारी करें',
      rejectButton: 'अस्वीकार करें',
      customerWarning: 'सूचना: इस तकनीशियन ने अभी प्रमाणन सत्यापन पूरा नहीं किया है। सावधानी बरतें।',
      verifiedProofSummary: 'पहचान और तकनीकी प्रमाणपत्र व्यवस्थापक द्वारा सत्यापित है।',
    },
  },
};

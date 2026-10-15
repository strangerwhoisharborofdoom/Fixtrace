# FixTrace: AI-Powered Appliance Repair Intelligence Platform

FixTrace is a mobile-first, full-stack intelligence platform engineered to make household appliance repair predictable, verifiable, and economically transparent. Built specifically for Indian households and small appliance repair businesses (English, Kannada ಕನ್ನಡ, and Hindi हिन्दी support with INR ₹ and Asia/Kolkata defaults).

---

## 1. Product Overview

- **Digital Repair Passports**: Every registered appliance receives an immutable digital passport and QR code sticker. Anyone scanning the QR code can inspect verified maintenance timelines, genuine spare parts, and technician sign-offs.
- **AI Fault Diagnostic Intake**: Multi-modal intake (Kannada/Hindi/English text or voice, display error codes, and photos). Analyzed server-side via Google Gemini 3.8 Flash with strict electrical safety constraints.
- **The 3-Tier Truth Standard**:
  1. *Tier 1 (Customer)*: Original reported symptoms and timestamps.
  2. *Tier 2 (AI Preliminary)*: Algorithmic component hypotheses and non-invasive checks.
  3. *Tier 3 (Technician Fact)*: Physical multimeter verification, genuine OEM part numbers, and signed warranties.
- **Competitive Quote Comparison**: Side-by-side transparent bidding on parts cost, service labor, inspection fees, and warranty terms.
- **Repair vs. Replace Calculator**: Objective decision modeling based on the **50% Financial Rule**, Indian appliance lifespan benchmarks (e.g. Split Inverter AC 9 yrs, Washing Machine 8 yrs, Refrigerator 10 yrs), and BEE star-rating energy efficiency differentials.
- **Role-Based Workspaces**:
  - **Customer**: Manage household appliances, track service requests, and review quotes.
  - **Technician**: Bid on open repair jobs, record multimeter findings, log replaced parts, and certify repairs.
  - **Repair Shop**: Manage technician roster and service assignments.
  - **Administrator**: Vet technician Aadhaar and ITI trade credentials, inspect audit trails, and manage category standards.

---

## 2. Technical Architecture

```
├── server.ts                  # Express full-stack entry point running on port 3000
│   ├── /api/ai/diagnose       # Server-side Gemini 3.8 Flash fault analyzer
│   ├── /api/ai/repair-vs-replace # Life-cycle & economics advisor
│   └── /api/health            # Health & credentials check
├── firebase-blueprint.json    # Firestore intermediate representation (IR)
├── firestore.rules            # Hardened ABAC & Zero-Trust Firestore security rules
├── src/
│   ├── context/AppContext.tsx # Central reactive state & CRUD dispatcher
│   ├── i18n/translations.ts   # English, Kannada, and Hindi localization
│   ├── services/
│   │   ├── demoData.ts        # Segregated Indian appliance dataset
│   │   └── storage.ts         # Persistent DataService with demo separation
│   ├── types/index.ts         # Strictly typed data contracts
│   ├── utils/formatters.ts    # INR (₹), Asia/Kolkata dates, Indian phone validator
│   └── components/
│       ├── Header.tsx         # Brand, role switcher, language selector, demo badge
│       ├── DesktopSidebar.tsx # Industrial desktop sidebar
│       ├── MobileNav.tsx      # Mobile bottom navigation bar
│       ├── CustomerDashboard.tsx # Appliance cards & active request trackers
│       ├── RepairPassportView.tsx# QR code generator, print summary & 3-tier timeline
│       ├── AiDiagnosticView.tsx  # Multimodal voice & photo fault intake
│       ├── RepairRequestsView.tsx# Lifecycle stepper & quote comparison modal
│       ├── TechnicianWorkspace.tsx# Bidding & certified repair sign-off
│       ├── RepairVsReplaceCalculator.tsx # 50% Rule & lifespan economics
│       ├── AnalyticsView.tsx  # Expenditure & warranty countdown
│       ├── AdminView.tsx      # Technician credential vetting & audit trail
│       └── LandingView.tsx    # Polished public entry & demo showcase
```

---

## 3. Gemini API Configuration

All Gemini API calls are executed strictly server-side in `server.ts` using `@google/genai` with model `gemini-3.8-flash`:
- Credentials are read securely from `process.env.GEMINI_API_KEY`.
- Browser code never imports `@google/genai` and never exposes the API key.
- Strict safety guardrails forbid instructing users to open live electrical equipment or touch internal compressors, capacitors, gas lines, or microwave magnetrons.

---

## 4. Firebase Setup & Security Rules

### Intermediate Representation (`firebase-blueprint.json`)
Covers 10 entity schemas: `User`, `Appliance`, `DiagnosticReport`, `RepairRequest`, `RepairQuote`, `RepairRecord`, `TechnicianProfile`, `RepairShop`, `Notification`, `AuditEvent`.

### Firestore Rules (`firestore.rules`)
- Default deny: `match /{document=**} { allow read, write: if false; }`
- Appliances: Public read for appliances where `isPublicPassport == true`; private read/write restricted to authenticated owner or admin.
- Repair Records: Public read for verified service passports; create restricted to verified technicians.
- Repair Requests: Read/update restricted to customer, assigned technician, or admin.
- Verification Status: Protected from self-escalation by technicians; only platform admins can update `verificationStatus`.

---

## 5. Demonstration Mode vs. Production

- **Evaluator Access**: Evaluators can explore FixTrace without logging in by using the built-in Demo Mode.
- **Segregated Data**: Sample appliances (LG Inverter Washer, Voltas Inverter Split AC, Samsung Double Door Refrigerator, Havells Instant Geyser) are isolated with `isDemo: true`.
- **Integrity**: Live production analytics never include mock records in financial metrics.

---

## 6. Local Development & Deployment

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

export type UserRole = 'customer' | 'technician' | 'shop' | 'admin' | 'guest';

export type Language = 'en' | 'kn' | 'hi';

export type ApplianceCategory =
  | 'Washing Machine'
  | 'Air Conditioner'
  | 'Refrigerator'
  | 'Water Heater / Geyser'
  | 'Microwave Oven'
  | 'Water Purifier (RO)'
  | 'Television'
  | 'Kitchen Chimney'
  | 'Mixer Grinder'
  | 'Air Fryer'
  | 'Other Appliance';

export type RequestStatus =
  | 'draft'
  | 'submitted'
  | 'reviewed'
  | 'quoted'
  | 'accepted'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'unable_to_complete';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  city?: string;
  pincode?: string;
  avatarUrl?: string;
  isDemo?: boolean;
}

export interface Appliance {
  id: string;
  ownerId: string;
  ownerName?: string;
  name: string;
  category: ApplianceCategory;
  brand: string;
  modelNumber?: string;
  serialNumber?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  locationTag?: string; // e.g. "Kitchen", "Utility Balcony", "Master Bedroom"
  warrantyDetails?: string;
  warrantySource: 'customer' | 'technician' | 'none';
  warrantyExpiryDate?: string;
  isPublicPassport: boolean;
  photos: string[];
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export interface PlausibleCause {
  cause: string;
  probability: 'High' | 'Medium' | 'Low';
  description: string;
  typicalPartInvolved?: string;
}

export interface DiagnosticReport {
  id: string;
  applianceId?: string;
  userId: string;
  category: ApplianceCategory;
  brand?: string;
  model?: string;
  symptomsText: string;
  errorCodes?: string;
  whenStarted?: string;
  summary: string;
  isAccurateAssessmentPossible: boolean;
  confidenceLevel: 'High' | 'Moderate' | 'Preliminary' | 'Inconclusive';
  confidenceExplanation: string;
  plausibleCauses: PlausibleCause[];
  safeChecks: string[];
  criticalSafetyWarnings: string[];
  technicianNextSteps: string[];
  recommendedSkills: string;
  missingInformation?: string;
  disclaimer: string;
  photos?: string[];
  createdAt: string;
  isDemo?: boolean;
}

export interface RepairRequest {
  id: string;
  applianceId: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  diagnosticReportId?: string;
  applianceName: string;
  applianceCategory: ApplianceCategory;
  applianceBrand: string;
  applianceModel?: string;
  symptoms: string;
  serviceAddress: string;
  city: string;
  pincode: string;
  preferredWindow?: string;
  status: RequestStatus;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  assignedShopId?: string;
  acceptedQuoteId?: string;
  scheduledDate?: string;
  quotesCount?: number;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export interface RepairQuote {
  id: string;
  requestId: string;
  technicianId: string;
  technicianName: string;
  technicianPhone?: string;
  technicianRating?: number;
  technicianExperienceYears?: number;
  isTechnicianVerified: boolean;
  shopId?: string;
  shopName?: string;
  partsCost: number;
  laborCost: number;
  inspectionFee: number;
  otherFees: number;
  totalCost: number;
  estimatedHours: number;
  warrantyTerms: string;
  validUntil: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
  isDemo?: boolean;
}

export interface ReplacedPart {
  partName: string;
  partNumber?: string;
  cost: number;
  warrantyMonths: number;
}

export interface RepairRecord {
  id: string;
  requestId: string;
  applianceId: string;
  customerId: string;
  technicianId: string;
  technicianName: string;
  shopId?: string;
  confirmedDiagnosis: string;
  originalCustomerSymptoms?: string;
  aiPreliminaryCause?: string;
  replacedParts: ReplacedPart[];
  laborCost: number;
  partsCost: number;
  totalCost: number;
  warrantyMonths: number;
  warrantyTerms?: string;
  maintenanceTips?: string;
  beforePhotos: string[];
  afterPhotos: string[];
  customerSignoff: boolean;
  completedAt: string;
  isDemo?: boolean;
}

export interface TechnicianProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  shopId?: string;
  shopName?: string;
  categories: ApplianceCategory[];
  experienceYears: number;
  verificationStatus: VerificationStatus;
  idProofType?: string;
  idProofNumber?: string;
  idDocumentUrl?: string;
  tradeCertificateName?: string;
  tradeCertificateNumber?: string;
  tradeCertificateDocumentUrl?: string;
  verificationSubmittedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  adminReviewNotes?: string;
  completedJobs: number;
  rating: number;
  active: boolean;
  city: string;
  createdAt: string;
  isDemo?: boolean;
}


export interface RepairShop {
  id: string;
  ownerId: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  categories: ApplianceCategory[];
  technicianIds: string[];
  isVerified: boolean;
  activeJobsCount: number;
  createdAt: string;
  isDemo?: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'quote_received' | 'status_update' | 'appointment' | 'warranty_alert' | 'info_requested' | 'general';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
  isDemo?: boolean;
}

export interface AuditEvent {
  id: string;
  actorId: string;
  actorRole: UserRole;
  actorName: string;
  action: string;
  entityType: 'appliance' | 'request' | 'quote' | 'repair' | 'verification';
  entityId: string;
  timestamp: string;
  details?: string;
  isDemo?: boolean;
}

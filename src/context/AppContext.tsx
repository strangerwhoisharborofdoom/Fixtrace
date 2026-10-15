import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Appliance,
  RepairRequest,
  RepairQuote,
  RepairRecord,
  TechnicianProfile,
  NotificationItem,
  AuditEvent,
  UserProfile,
  Language,
  UserRole,
} from '../types';
import { DataService, defaultStorage } from '../services/storage';
import { translations, Translations } from '../i18n/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  toggleDemoMode: () => void;
  resetDemoData: () => void;
  user: UserProfile;
  setUserRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedApplianceId: string | null;
  setSelectedApplianceId: (id: string | null) => void;
  selectedRequestId: string | null;
  setSelectedRequestId: (id: string | null) => void;

  // Data lists
  appliances: Appliance[];
  repairRequests: RepairRequest[];
  quotes: RepairQuote[];
  records: RepairRecord[];
  technicians: TechnicianProfile[];
  notifications: NotificationItem[];
  auditEvents: AuditEvent[];

  // Data Actions
  saveAppliance: (appliance: Appliance) => Appliance;
  deleteAppliance: (id: string) => boolean;
  addRepairRequest: (req: RepairRequest) => RepairRequest;
  updateRequestStatus: (id: string, status: RepairRequest['status'], patch?: Partial<RepairRequest>) => void;
  addQuote: (quote: RepairQuote) => RepairQuote;
  acceptQuote: (requestId: string, quoteId: string) => boolean;
  addRepairRecord: (record: RepairRecord) => RepairRecord;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  submitTechnicianVerification: (id: string, payload: Partial<TechnicianProfile>) => boolean;
  verifyTechnician: (
    id: string,
    status: TechnicianProfile['verificationStatus'],
    reviewNotes?: string,
    rejectionReason?: string
  ) => void;
  refreshData: () => void;

  // Notification helper
  unreadCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('fixtrace_lang') as Language) || 'en';
  });

  const [isDemoMode, setIsDemoModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('fixtrace_is_demo');
    return saved !== null ? saved === 'true' : true;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedApplianceId, setSelectedApplianceId] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const [storageService, setStorageService] = useState<DataService>(() => new DataService(isDemoMode));
  const [user, setUser] = useState<UserProfile>(() => storageService.getUser());

  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [quotes, setQuotes] = useState<RepairQuote[]>([]);
  const [records, setRecords] = useState<RepairRecord[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);

  const refreshData = () => {
    setAppliances(storageService.getAppliances());
    setRepairRequests(storageService.getRepairRequests());
    setQuotes(storageService.getQuotes());
    setRecords(storageService.getRepairRecords());
    setTechnicians(storageService.getTechnicians());
    setNotifications(storageService.getNotifications());
    setAuditEvents(storageService.getAuditEvents());
    setUser(storageService.getUser());
  };

  useEffect(() => {
    const service = new DataService(isDemoMode);
    setStorageService(service);
    setAppliances(service.getAppliances());
    setRepairRequests(service.getRepairRequests());
    setQuotes(service.getQuotes());
    setRecords(service.getRepairRecords());
    setTechnicians(service.getTechnicians());
    setNotifications(service.getNotifications());
    setAuditEvents(service.getAuditEvents());
    setUser(service.getUser());
  }, [isDemoMode]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('fixtrace_lang', lang);
  };

  const setIsDemoMode = (val: boolean) => {
    setIsDemoModeState(val);
    localStorage.setItem('fixtrace_is_demo', String(val));
  };

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
  };

  const resetDemoData = () => {
    storageService.resetDemoData();
    refreshData();
  };

  const setUserRole = (role: UserRole) => {
    const updated = { ...user, role };
    storageService.updateUser(updated);
    setUser(updated);
  };

  const saveAppliance = (appliance: Appliance) => {
    const saved = storageService.saveAppliance(appliance);
    refreshData();
    return saved;
  };

  const deleteAppliance = (id: string) => {
    const res = storageService.deleteAppliance(id);
    refreshData();
    if (selectedApplianceId === id) {
      setSelectedApplianceId(null);
    }
    return res;
  };

  const addRepairRequest = (req: RepairRequest) => {
    const saved = storageService.addRepairRequest(req);
    refreshData();
    return saved;
  };

  const updateRequestStatus = (
    id: string,
    status: RepairRequest['status'],
    patch?: Partial<RepairRequest>
  ) => {
    storageService.updateRequestStatus(id, status, patch);
    refreshData();
  };

  const addQuote = (quote: RepairQuote) => {
    const saved = storageService.addQuote(quote);
    refreshData();
    return saved;
  };

  const acceptQuote = (requestId: string, quoteId: string) => {
    const res = storageService.acceptQuote(requestId, quoteId);
    refreshData();
    return res;
  };

  const addRepairRecord = (record: RepairRecord) => {
    const saved = storageService.addRepairRecord(record);
    refreshData();
    return saved;
  };

  const markNotificationRead = (id: string) => {
    storageService.markNotificationRead(id);
    refreshData();
  };

  const markAllNotificationsRead = () => {
    storageService.markAllNotificationsRead();
    refreshData();
  };

  const submitTechnicianVerification = (id: string, payload: Partial<TechnicianProfile>) => {
    const res = storageService.submitTechnicianVerification(id, payload);
    refreshData();
    return res;
  };

  const verifyTechnician = (
    id: string,
    status: TechnicianProfile['verificationStatus'],
    reviewNotes?: string,
    rejectionReason?: string
  ) => {
    storageService.verifyTechnician(id, status, reviewNotes, rejectionReason);
    refreshData();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        isDemoMode,
        setIsDemoMode,
        toggleDemoMode,
        resetDemoData,
        user,
        setUserRole,
        activeTab,
        setActiveTab,
        selectedApplianceId,
        setSelectedApplianceId,
        selectedRequestId,
        setSelectedRequestId,
        appliances,
        repairRequests,
        quotes,
        records,
        technicians,
        notifications,
        auditEvents,
        saveAppliance,
        deleteAppliance,
        addRepairRequest,
        updateRequestStatus,
        addQuote,
        acceptQuote,
        addRepairRecord,
        markNotificationRead,
        markAllNotificationsRead,
        submitTechnicianVerification,
        verifyTechnician,
        refreshData,
        unreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );

};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

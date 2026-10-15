import {
  Appliance,
  RepairRequest,
  RepairQuote,
  RepairRecord,
  TechnicianProfile,
  RepairShop,
  NotificationItem,
  AuditEvent,
  UserProfile,
} from '../types';
import {
  DEMO_USER,
  DEMO_APPLIANCES,
  DEMO_REPAIR_RECORDS,
  DEMO_REPAIR_REQUESTS,
  DEMO_QUOTES,
  DEMO_TECHNICIANS,
  DEMO_REPAIR_SHOPS,
  DEMO_NOTIFICATIONS,
  DEMO_AUDIT_EVENTS,
} from './demoData';

const PREFIX = 'fixtrace_v1_';

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

export class DataService {
  private isDemo: boolean;

  constructor(isDemo: boolean = true) {
    this.isDemo = isDemo;
    this.initializeIfEmpty();
  }

  public setMode(isDemo: boolean) {
    this.isDemo = isDemo;
    this.initializeIfEmpty();
  }

  private getKey(name: string): string {
    return (this.isDemo ? 'demo_' : 'prod_') + name;
  }

  private initializeIfEmpty() {
    if (this.isDemo) {
      if (!localStorage.getItem(PREFIX + this.getKey('appliances'))) {
        setStorage(this.getKey('appliances'), DEMO_APPLIANCES);
      }
      if (!localStorage.getItem(PREFIX + this.getKey('records'))) {
        setStorage(this.getKey('records'), DEMO_REPAIR_RECORDS);
      }
      if (!localStorage.getItem(PREFIX + this.getKey('requests'))) {
        setStorage(this.getKey('requests'), DEMO_REPAIR_REQUESTS);
      }
      if (!localStorage.getItem(PREFIX + this.getKey('quotes'))) {
        setStorage(this.getKey('quotes'), DEMO_QUOTES);
      }
      if (!localStorage.getItem(PREFIX + this.getKey('technicians'))) {
        setStorage(this.getKey('technicians'), DEMO_TECHNICIANS);
      }
      if (!localStorage.getItem(PREFIX + this.getKey('shops'))) {
        setStorage(this.getKey('shops'), DEMO_REPAIR_SHOPS);
      }
      if (!localStorage.getItem(PREFIX + this.getKey('notifications'))) {
        setStorage(this.getKey('notifications'), DEMO_NOTIFICATIONS);
      }
      if (!localStorage.getItem(PREFIX + this.getKey('audit_events'))) {
        setStorage(this.getKey('audit_events'), DEMO_AUDIT_EVENTS);
      }
      if (!localStorage.getItem(PREFIX + this.getKey('user'))) {
        setStorage(this.getKey('user'), DEMO_USER);
      }
    } else {
      // In prod mode, initialize empty arrays if not present
      if (!localStorage.getItem(PREFIX + this.getKey('appliances'))) {
        setStorage(this.getKey('appliances'), []);
      }
      if (!localStorage.getItem(PREFIX + this.getKey('records'))) {
        setStorage(this.getKey('records'), []);
      }
      if (!localStorage.getItem(PREFIX + this.getKey('requests'))) {
        setStorage(this.getKey('requests'), []);
      }
      if (!localStorage.getItem(PREFIX + this.getKey('quotes'))) {
        setStorage(this.getKey('quotes'), []);
      }
      if (!localStorage.getItem(PREFIX + this.getKey('technicians'))) {
        setStorage(this.getKey('technicians'), []);
      }
      if (!localStorage.getItem(PREFIX + this.getKey('notifications'))) {
        setStorage(this.getKey('notifications'), []);
      }
    }
  }

  // User
  public getUser(): UserProfile {
    return getStorage<UserProfile>(this.getKey('user'), DEMO_USER);
  }

  public updateUser(user: UserProfile) {
    setStorage(this.getKey('user'), user);
  }

  // Appliances
  public getAppliances(): Appliance[] {
    return getStorage<Appliance[]>(this.getKey('appliances'), []);
  }

  public getApplianceById(id: string): Appliance | undefined {
    return this.getAppliances().find((a) => a.id === id);
  }

  public saveAppliance(appliance: Appliance): Appliance {
    const list = this.getAppliances();
    const existingIndex = list.findIndex((a) => a.id === appliance.id);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...appliance, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(appliance);
    }
    setStorage(this.getKey('appliances'), list);
    this.addAudit('CREATE_OR_UPDATE_APPLIANCE', 'appliance', appliance.id, `Saved appliance: ${appliance.name}`);
    return appliance;
  }

  public deleteAppliance(id: string): boolean {
    const list = this.getAppliances();
    const filtered = list.filter((a) => a.id !== id);
    setStorage(this.getKey('appliances'), filtered);
    this.addAudit('DELETE_APPLIANCE', 'appliance', id, `Deleted appliance ID: ${id}`);
    return true;
  }

  // Repair Records (Service history on passport)
  public getRepairRecords(applianceId?: string): RepairRecord[] {
    const list = getStorage<RepairRecord[]>(this.getKey('records'), []);
    if (applianceId) {
      return list.filter((r) => r.applianceId === applianceId);
    }
    return list;
  }

  public addRepairRecord(record: RepairRecord): RepairRecord {
    const list = this.getRepairRecords();
    list.unshift(record);
    setStorage(this.getKey('records'), list);

    // Also update request status to completed
    if (record.requestId) {
      this.updateRequestStatus(record.requestId, 'completed');
    }

    this.addAudit('CERTIFY_REPAIR', 'repair', record.id, `Certified repair for ${record.applianceId}`);
    return record;
  }

  // Repair Requests
  public getRepairRequests(): RepairRequest[] {
    return getStorage<RepairRequest[]>(this.getKey('requests'), []);
  }

  public getRequestById(id: string): RepairRequest | undefined {
    return this.getRepairRequests().find((r) => r.id === id);
  }

  public addRepairRequest(req: RepairRequest): RepairRequest {
    const list = this.getRepairRequests();
    list.unshift(req);
    setStorage(this.getKey('requests'), list);
    this.addAudit('CREATE_REPAIR_REQUEST', 'request', req.id, `Submitted service request for ${req.applianceName}`);
    return req;
  }

  public updateRequestStatus(
    id: string,
    status: RepairRequest['status'],
    patch?: Partial<RepairRequest>
  ): RepairRequest | undefined {
    const list = this.getRepairRequests();
    const index = list.findIndex((r) => r.id === id);
    if (index >= 0) {
      list[index] = {
        ...list[index],
        ...patch,
        status,
        updatedAt: new Date().toISOString(),
      };
      setStorage(this.getKey('requests'), list);
      this.addAudit('UPDATE_REQUEST_STATUS', 'request', id, `Status transitioned to ${status}`);
      return list[index];
    }
    return undefined;
  }

  // Quotes
  public getQuotes(requestId?: string): RepairQuote[] {
    const list = getStorage<RepairQuote[]>(this.getKey('quotes'), []);
    if (requestId) {
      return list.filter((q) => q.requestId === requestId);
    }
    return list;
  }

  public addQuote(quote: RepairQuote): RepairQuote {
    const list = this.getQuotes();
    list.unshift(quote);
    setStorage(this.getKey('quotes'), list);

    // Update request status to 'quoted' and increment count
    const req = this.getRequestById(quote.requestId);
    if (req) {
      const currentQuotes = this.getQuotes(quote.requestId);
      this.updateRequestStatus(quote.requestId, 'quoted', {
        quotesCount: currentQuotes.length,
      });
      // Add notification for customer
      this.addNotification({
        id: 'notif-' + Date.now(),
        userId: req.customerId,
        type: 'quote_received',
        title: `New Quote Received: ₹${quote.totalCost}`,
        message: `${quote.technicianName} submitted an itemized quote for your ${req.applianceName}.`,
        link: 'requests',
        read: false,
        createdAt: new Date().toISOString(),
        isDemo: this.isDemo,
      });
    }

    this.addAudit('SUBMIT_QUOTE', 'quote', quote.id, `Submitted quote of ₹${quote.totalCost}`);
    return quote;
  }

  public acceptQuote(requestId: string, quoteId: string): boolean {
    const quotes = this.getQuotes();
    const targetQuote = quotes.find((q) => q.id === quoteId);
    if (!targetQuote) return false;

    // Mark target quote accepted and others declined
    const updatedQuotes = quotes.map((q) => {
      if (q.requestId === requestId) {
        return {
          ...q,
          status: (q.id === quoteId ? 'accepted' : 'declined') as 'accepted' | 'declined',
        };
      }
      return q;
    });
    setStorage(this.getKey('quotes'), updatedQuotes);

    // Update request status to 'accepted' then 'scheduled'
    this.updateRequestStatus(requestId, 'accepted', {
      acceptedQuoteId: quoteId,
      assignedTechnicianId: targetQuote.technicianId,
      assignedTechnicianName: targetQuote.technicianName,
    });

    this.addAudit('ACCEPT_QUOTE', 'quote', quoteId, `Customer accepted quote ₹${targetQuote.totalCost}`);
    return true;
  }

  // Technicians
  public getTechnicians(): TechnicianProfile[] {
    return getStorage<TechnicianProfile[]>(this.getKey('technicians'), []);
  }

  public submitTechnicianVerification(id: string, payload: Partial<TechnicianProfile>): boolean {
    const list = this.getTechnicians();
    const index = list.findIndex((t) => t.id === id);
    if (index >= 0) {
      list[index] = {
        ...list[index],
        ...payload,
        verificationStatus: 'pending',
        verificationSubmittedAt: new Date().toISOString(),
      };
      setStorage(this.getKey('technicians'), list);
      this.addAudit('SUBMIT_VERIFICATION', 'verification', id, `Technician ${list[index].name} submitted proof of identity & trade certification.`);
      this.addNotification({
        id: 'notif-' + Date.now(),
        userId: 'admin-001',
        type: 'general',
        title: `Verification Request: ${list[index].name}`,
        message: `${list[index].name} submitted trade certificate (${payload.tradeCertificateName || 'Trade Cert'}) for admin review.`,
        link: 'admin',
        read: false,
        createdAt: new Date().toISOString(),
        isDemo: this.isDemo,
      });
      return true;
    }
    return false;
  }

  public verifyTechnician(
    id: string,
    status: TechnicianProfile['verificationStatus'],
    reviewNotes?: string,
    rejectionReason?: string
  ): boolean {
    const list = this.getTechnicians();
    const index = list.findIndex((t) => t.id === id);
    if (index >= 0) {
      list[index] = {
        ...list[index],
        verificationStatus: status,
        verifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
        adminReviewNotes: reviewNotes || list[index].adminReviewNotes,
        rejectionReason: status === 'rejected' ? rejectionReason : undefined,
      };
      setStorage(this.getKey('technicians'), list);
      this.addAudit(
        status === 'verified' ? 'APPROVE_VERIFICATION' : 'REJECT_VERIFICATION',
        'verification',
        id,
        `Admin updated verification to ${status}. Notes: ${reviewNotes || rejectionReason || 'None'}`
      );
      // Notify the technician
      this.addNotification({
        id: 'notif-' + Date.now(),
        userId: list[index].userId,
        type: 'general',
        title: status === 'verified' ? 'Professional Verification Approved! 🎉' : 'Verification Update Required',
        message:
          status === 'verified'
            ? 'Your trade certifications and identity proof have been verified. Your bids will now show the Verified Pro badge to customers.'
            : `Your verification submission could not be approved. Reason: ${rejectionReason || 'Please resubmit legible documents.'}`,
        link: 'technicians',
        read: false,
        createdAt: new Date().toISOString(),
        isDemo: this.isDemo,
      });
      return true;
    }
    return false;
  }


  // Notifications
  public getNotifications(): NotificationItem[] {
    return getStorage<NotificationItem[]>(this.getKey('notifications'), []);
  }

  public addNotification(notification: NotificationItem): NotificationItem {
    const list = this.getNotifications();
    list.unshift(notification);
    setStorage(this.getKey('notifications'), list);
    return notification;
  }

  public markNotificationRead(id: string): void {
    const list = this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    setStorage(this.getKey('notifications'), updated);
  }

  public markAllNotificationsRead(): void {
    const list = this.getNotifications();
    const updated = list.map((n) => ({ ...n, read: true }));
    setStorage(this.getKey('notifications'), updated);
  }

  // Audit
  public getAuditEvents(): AuditEvent[] {
    return getStorage<AuditEvent[]>(this.getKey('audit_events'), []);
  }

  public addAudit(action: string, entityType: AuditEvent['entityType'], entityId: string, details?: string) {
    const events = this.getAuditEvents();
    const event: AuditEvent = {
      id: 'audit-' + Date.now(),
      actorId: this.getUser().uid,
      actorRole: this.getUser().role,
      actorName: this.getUser().displayName,
      action,
      entityType,
      entityId,
      timestamp: new Date().toISOString(),
      details,
      isDemo: this.isDemo,
    };
    events.unshift(event);
    setStorage(this.getKey('audit_events'), events);
  }

  // Reset Demo
  public resetDemoData(): void {
    if (!this.isDemo) return;
    setStorage(this.getKey('appliances'), DEMO_APPLIANCES);
    setStorage(this.getKey('records'), DEMO_REPAIR_RECORDS);
    setStorage(this.getKey('requests'), DEMO_REPAIR_REQUESTS);
    setStorage(this.getKey('quotes'), DEMO_QUOTES);
    setStorage(this.getKey('technicians'), DEMO_TECHNICIANS);
    setStorage(this.getKey('shops'), DEMO_REPAIR_SHOPS);
    setStorage(this.getKey('notifications'), DEMO_NOTIFICATIONS);
    setStorage(this.getKey('audit_events'), DEMO_AUDIT_EVENTS);
    setStorage(this.getKey('user'), DEMO_USER);
  }
}

export const defaultStorage = new DataService(true);

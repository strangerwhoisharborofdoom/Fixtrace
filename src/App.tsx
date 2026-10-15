import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { DesktopSidebar } from './components/DesktopSidebar';
import { MobileNav } from './components/MobileNav';
import { LandingView } from './components/LandingView';
import { CustomerDashboard } from './components/CustomerDashboard';
import { RepairPassportView } from './components/RepairPassportView';
import { AiDiagnosticView } from './components/AiDiagnosticView';
import { RepairRequestsView } from './components/RepairRequestsView';
import { TechnicianWorkspace } from './components/TechnicianWorkspace';
import { RepairVsReplaceCalculator } from './components/RepairVsReplaceCalculator';
import { AnalyticsView } from './components/AnalyticsView';
import { AdminView } from './components/AdminView';
import { NotificationModal } from './components/NotificationModal';

function MainLayout() {
  const {
    activeTab,
    setActiveTab,
    selectedApplianceId,
    setSelectedApplianceId,
    selectedRequestId,
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showLanding, setShowLanding] = useState<boolean>(false);

  // Check if URL has passport deep link (/passport/:id)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/passport/')) {
        const id = path.replace('/passport/', '');
        if (id) {
          setSelectedApplianceId(id);
          setActiveTab('passport');
          setShowLanding(false);
        }
      }
    }
  }, [setSelectedApplianceId, setActiveTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-lime-400 selection:text-slate-950">
      {/* Global Header */}
      <Header onOpenNotifications={() => setIsNotificationsOpen(true)} />

      {/* Main Container */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Desktop Sidebar (hidden on public landing or on mobile) */}
        {!showLanding && <DesktopSidebar />}

        {/* Dynamic Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-h-[calc(100vh-4rem)]">
          {showLanding ? (
            <LandingView onEnterApp={() => setShowLanding(false)} />
          ) : (
            <>
              {activeTab === 'dashboard' && <CustomerDashboard />}
              {activeTab === 'appliances' && <CustomerDashboard />}
              {activeTab === 'passport' && selectedApplianceId && (
                <RepairPassportView
                  applianceId={selectedApplianceId}
                  onBack={() => setActiveTab('dashboard')}
                />
              )}
              {activeTab === 'diagnose' && (
                <AiDiagnosticView initialApplianceId={selectedApplianceId} />
              )}
              {activeTab === 'requests' && (
                <RepairRequestsView initialRequestId={selectedRequestId} />
              )}
              {activeTab === 'calculator' && <RepairVsReplaceCalculator />}
              {activeTab === 'technicians' && <TechnicianWorkspace />}
              {activeTab === 'analytics' && <AnalyticsView />}
              {activeTab === 'admin' && <AdminView />}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {!showLanding && <MobileNav />}

      {/* Notification Drawer Modal */}
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

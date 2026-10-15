import React from 'react';
import { X, CheckCheck, Bell, ExternalLink, Calendar, Wrench, ShieldCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatKolkataDateTime } from '../utils/formatters';

export const NotificationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
    unreadCount,
  } = useApp();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'quote_received':
        return <Wrench className="w-4 h-4 text-lime-400" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-sky-400" />;
      case 'warranty_alert':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm no-print">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-lime-400" />
            <h2 className="text-base font-bold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="text-xs bg-lime-400/20 text-lime-400 px-2 py-0.5 rounded-full font-semibold">
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 divide-y divide-slate-800/60">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No notifications yet.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  markNotificationRead(item.id);
                  if (item.link) {
                    setActiveTab(item.link);
                    onClose();
                  }
                }}
                className={`pt-2.5 first:pt-0 p-3 rounded-xl transition-colors cursor-pointer flex gap-3 ${
                  !item.read ? 'bg-slate-800/80 border border-slate-700' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="mt-0.5 w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs font-semibold ${!item.read ? 'text-white' : 'text-slate-300'}`}>
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
                      {formatKolkataDateTime(item.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

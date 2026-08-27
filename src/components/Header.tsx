import React from 'react';
import { Calendar, RefreshCw, UserCheck, Shield, Award, Sparkles, School } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onSwitchUser: () => void;
  onOpenSync: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  selectedDate,
  onDateChange,
  onSwitchUser,
  onOpenSync
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <header className="bg-slate-900 text-white px-4 md:px-6 py-3 flex items-center justify-between gap-4 border-b border-slate-800 shrink-0">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center font-black text-slate-900 text-sm shrink-0 shadow-xs">
          AS
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-extrabold tracking-tight text-white">
              Akal Academy
            </span>
            <span className="bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
              Baru Sahib
            </span>
            <span className="text-[10px] font-medium text-slate-300 bg-white/10 px-1.5 py-0.5 rounded tracking-wide uppercase">
              {isAdmin ? 'ADMIN' : 'TEACHER'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
            <span>{currentUser?.name || 'Administrator Portal'}</span>
            <span className="text-slate-600">•</span>
            <span>Campus Main</span>
            {currentUser?.teacherId && (
              <span className="text-[10px] text-amber-400/90 font-mono">({currentUser.teacherId})</span>
            )}
          </div>
        </div>
      </div>

      {/* Date, Cloud Sync & Role Switcher */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 text-xs">
          <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-transparent text-slate-200 text-xs font-semibold outline-none cursor-pointer"
            id="header-date-picker"
          />
        </div>

        <button
          onClick={onOpenSync}
          className="hidden sm:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold transition cursor-pointer"
          id="header-sync-btn"
          title="Google Sheets & Cloud Sync"
        >
          <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
          <span>Sheets Sync</span>
        </button>

        <button
          onClick={onSwitchUser}
          className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs px-3.5 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          id="header-switch-role-btn"
        >
          {isAdmin ? (
            <>
              <UserCheck className="w-3.5 h-3.5" />
              <span>Switch to Teacher</span>
            </>
          ) : (
            <>
              <Shield className="w-3.5 h-3.5" />
              <span>Switch to Admin</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

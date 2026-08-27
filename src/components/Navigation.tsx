import React from 'react';
import {
  Shield,
  UserCheck,
  Clock,
  FileSpreadsheet,
  Users,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { UserRole } from '../types';

export type TabId = 'dashboard' | 'attendance' | 'timetable' | 'leaves' | 'students' | 'sync';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  pendingLeavesCount: number;
  unassignedSubstitutionsCount: number;
  userRole: UserRole;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  pendingLeavesCount,
  unassignedSubstitutionsCount,
  userRole
}) => {
  const tabs = [
    { id: 'dashboard' as TabId, label: 'Dashboard', icon: Shield, badge: 0 },
    {
      id: 'attendance' as TabId,
      label: 'Staff Attendance',
      icon: UserCheck,
      badge: 0
    },
    {
      id: 'timetable' as TabId,
      label: 'Master Timetable',
      icon: Clock,
      badge: unassignedSubstitutionsCount,
      badgeColor: 'bg-amber-600'
    },
    {
      id: 'leaves' as TabId,
      label: 'Leave Requests',
      icon: FileSpreadsheet,
      badge: pendingLeavesCount,
      badgeColor: 'bg-rose-600'
    },
    { id: 'students' as TabId, label: 'Student Register', icon: Users, badge: 0 },
    { id: 'sync' as TabId, label: 'Cloud Sync', icon: RefreshCw, badge: 0 }
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-4 md:px-6 flex overflow-x-auto gap-0 scrollbar-none shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 md:px-5 py-3.5 text-[13px] font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
              isActive
                ? 'border-amber-600 text-amber-600 bg-amber-500/5 font-bold'
                : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-50/80'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-500'}`} />
            <span>{tab.label}</span>
            {tab.badge > 0 ? (
              <span className="bg-[#ef4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[10px] leading-tight">
                {tab.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
};

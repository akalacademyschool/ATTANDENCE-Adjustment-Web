import React from 'react';
import {
  Users,
  Clock,
  UserCheck,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Calendar,
  BookOpen,
  Send,
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  Teacher,
  LeaveRequest,
  TimetableSlot,
  StaffAttendanceRecord,
  User,
  PeriodInfo
} from '../types';
import { TabId } from './Navigation';

interface DashboardViewProps {
  currentUser: User | null;
  selectedDate: string;
  teachers: Teacher[];
  attendance: Record<string, StaffAttendanceRecord>;
  leaves: LeaveRequest[];
  timetableSlots: TimetableSlot[];
  periods: PeriodInfo[];
  onNavigateTab: (tab: TabId) => void;
  onOpenApplyLeave: () => void;
  onOpenSubstitutionModal: (slot: TimetableSlot) => void;
  onQuickApproveLeave: (id: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  selectedDate,
  teachers,
  attendance,
  leaves,
  timetableSlots,
  periods,
  onNavigateTab,
  onOpenApplyLeave,
  onOpenSubstitutionModal,
  onQuickApproveLeave
}) => {
  const isTeacher = currentUser?.role === 'TEACHER';
  const currentTeacherId = currentUser?.teacherId || 'T0002';
  const currentTeacher = teachers.find((t) => t.id === currentTeacherId);

  const nonAdminTeachers = teachers.filter((t) => t.id !== 'T0001');
  const presentCount = nonAdminTeachers.filter(
    (t) => (attendance[t.id]?.status || 'Present') === 'Present'
  ).length;
  const leaveCount = nonAdminTeachers.filter(
    (t) => attendance[t.id]?.status === 'Leave' || attendance[t.id]?.status === 'Absent'
  ).length;
  const pendingLeaves = leaves.filter((l) => l.status === 'Pending');

  // Find slots where the assigned teacher is on leave / absent
  const absentTeacherIds = nonAdminTeachers
    .filter(
      (t) => attendance[t.id]?.status === 'Leave' || attendance[t.id]?.status === 'Absent'
    )
    .map((t) => t.id);

  const affectedSlots = timetableSlots.filter(
    (s) => absentTeacherIds.includes(s.teacherId) && !s.substitutionTeacherId
  );

  const resolvedSubstitutions = timetableSlots.filter((s) => s.substitutionTeacherId);

  // For teacher view: my slots today
  const mySlots = timetableSlots.filter(
    (s) => s.teacherId === currentTeacherId || s.substitutionTeacherId === currentTeacherId
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-5 md:p-6 text-white shadow-sm border border-slate-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded border border-amber-500/30">
              Akal Academy Baru Sahib
            </span>
            <span className="text-xs text-slate-300 font-medium">Session 2026-27</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            {isTeacher
              ? `Welcome, ${currentUser?.name}`
              : 'School Operations & Faculty Dashboard'}
          </h2>
          <p className="text-xs md:text-sm text-slate-300">
            {isTeacher
              ? `Department: ${currentTeacher?.subject || 'Mathematics'} | Free Periods: [${
                  currentTeacher?.freePeriods.map((p) => `P${p}`).join(', ') || 'None'
                }]`
              : `Academic tracking for ${new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}`}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {isTeacher ? (
            <button
              onClick={onOpenApplyLeave}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
              id="dashboard-apply-leave-btn"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Apply for Leave</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => onNavigateTab('attendance')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-slate-600 transition flex items-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark Attendance</span>
              </button>
              <button
                onClick={() => onNavigateTab('timetable')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2.5 rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Master Timetable</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-slate-300 transition cursor-pointer"
          id="stat-card-staff-present"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Staff Present
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-[24px] font-extrabold text-slate-900 my-1">
            {presentCount}{' '}
            <span className="text-sm font-semibold text-slate-500">
              / {nonAdminTeachers.length}
            </span>
          </div>
          <div className="text-[11px] font-medium text-emerald-600">
            {((presentCount / (nonAdminTeachers.length || 1)) * 100).toFixed(0)}% Attendance Rate
          </div>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-slate-300 transition cursor-pointer"
          id="stat-card-on-leave"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              On Leave
            </span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-[24px] font-extrabold text-amber-600 my-1">{leaveCount}</div>
          <div className="text-[11px] font-medium text-amber-600">
            {affectedSlots.length > 0
              ? `${affectedSlots.length} substitutions required`
              : 'Substitutions assigned'}
          </div>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => onNavigateTab('leaves')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-slate-300 transition cursor-pointer"
          id="stat-card-pending-leaves"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Pending Approvals
            </span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
          </div>
          <div className="text-[24px] font-extrabold text-blue-600 my-1">{pendingLeaves.length}</div>
          <div className="text-[11px] font-medium text-blue-600">
            {pendingLeaves.length > 0 ? 'Action required by Admin' : 'All caught up'}
          </div>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => onNavigateTab('students')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-slate-300 transition cursor-pointer"
          id="stat-card-classes"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Active Classes
            </span>
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-[24px] font-extrabold text-slate-900 my-1">24</div>
          <div className="text-[11px] font-medium text-slate-700">Grade I - Grade XII</div>
        </div>
      </div>

      {/* Substitution Alerts & Urgent Action */}
      {affectedSlots.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 md:p-5 shadow-xs">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0">
                !
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950">
                  {affectedSlots.length} Timetable Period{affectedSlots.length > 1 ? 's' : ''}{' '}
                  Require Substitution
                </h3>
                <p className="text-xs text-amber-800">
                  Teachers assigned to these periods are currently marked on leave or absent today.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('timetable')}
              className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Review in Timetable Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {affectedSlots.slice(0, 3).map((slot) => (
              <div
                key={slot.id}
                className="bg-white p-3 rounded-lg border border-amber-200 flex items-center justify-between gap-2 shadow-xs"
              >
                <div>
                  <span className="font-bold text-xs text-slate-900">
                    {slot.periodId} • {slot.className}
                  </span>
                  <p className="text-[11px] text-slate-600">
                    {slot.subject} ({slot.teacherName})
                  </p>
                </div>
                <button
                  onClick={() => onOpenSubstitutionModal(slot)}
                  className="bg-slate-900 hover:bg-slate-800 text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded transition cursor-pointer"
                >
                  Assign Sub
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teacher View Schedule OR Admin Overview */}
      {isTeacher ? (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                My Class Schedule for Today ({selectedDate})
              </h3>
              <p className="text-xs text-slate-500">
                Showing periods assigned to {currentUser?.name}
              </p>
            </div>
            <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded font-bold">
              {mySlots.length} Classes Today
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {periods.map((p, idx) => {
              const slot = mySlots.find((s) => s.periodId === p.id);
              const isFree = currentTeacher?.freePeriods.includes(idx + 1);

              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-xl border transition ${
                    slot
                      ? slot.substitutionTeacherId === currentTeacherId
                        ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400/50'
                        : 'bg-slate-50 border-slate-200'
                      : isFree
                      ? 'bg-emerald-50/50 border-emerald-200 border-dashed'
                      : 'bg-white border-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-800">{p.id}</span>
                    <span className="text-[10px] text-slate-500">{p.time}</span>
                  </div>

                  {slot ? (
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        {slot.className}
                      </span>
                      <span className="text-xs text-slate-600 block mt-0.5">
                        {slot.subject} ({slot.room || 'R-201'})
                      </span>
                      {slot.substitutionTeacherId === currentTeacherId && (
                        <span className="mt-1.5 inline-block bg-amber-200 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Substitution Duty
                        </span>
                      )}
                    </div>
                  ) : isFree ? (
                    <div className="py-1">
                      <span className="text-xs font-bold text-emerald-700">Free Period</span>
                      <p className="text-[10px] text-emerald-600">Available for substitutions</p>
                    </div>
                  ) : (
                    <div className="py-1">
                      <span className="text-xs text-slate-400">Off Duty</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Admin View: Pending Leave Approvals & Faculty Quick Status */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Leaves List */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-[13px] text-slate-900">Pending Leave Applications</h3>
              </div>
              <button
                onClick={() => onNavigateTab('leaves')}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-slate-100 flex-1">
              {pendingLeaves.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  No pending leave applications requiring approval.
                </div>
              ) : (
                pendingLeaves.slice(0, 3).map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{req.teacherName}</span>
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {req.leaveType}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{req.reason}</p>
                      <span className="text-[10px] text-slate-400">
                        {req.startDate} to {req.endDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onQuickApproveLeave(req.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-md transition shadow-xs cursor-pointer"
                      >
                        Approve & Sync
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Staff Today Status */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-[13px] text-slate-900">Faculty Today Roster</h3>
              </div>
              <button
                onClick={() => onNavigateTab('attendance')}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition cursor-pointer"
              >
                Open Register
              </button>
            </div>

            <div className="divide-y divide-slate-100 flex-1 max-h-72 overflow-y-auto">
              {nonAdminTeachers.map((t) => {
                const att = attendance[t.id] || { status: 'Present' };
                return (
                  <div
                    key={t.id}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 transition text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{t.name}</span>
                      <span className="text-slate-500 text-[11px] block">{t.subject}</span>
                    </div>
                    <div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          att.status === 'Present'
                            ? 'bg-[#dcfce7] text-[#166534]'
                            : att.status === 'Leave'
                            ? 'bg-[#fef3c7] text-[#92400e]'
                            : att.status === 'Half Day'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-[#fee2e2] text-[#991b1b]'
                        }`}
                      >
                        {att.status} {att.leaveType ? `(${att.leaveType})` : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

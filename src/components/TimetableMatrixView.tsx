import React, { useState } from 'react';
import {
  Clock,
  UserCheck,
  AlertCircle,
  Download,
  CheckCircle,
  Sparkles,
  Users,
  Grid,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import {
  Teacher,
  TimetableSlot,
  PeriodInfo,
  StaffAttendanceRecord,
  User
} from '../types';

interface TimetableMatrixViewProps {
  currentUser: User | null;
  selectedDate: string;
  teachers: Teacher[];
  periods: PeriodInfo[];
  classes: string[];
  timetableSlots: TimetableSlot[];
  attendance: Record<string, StaffAttendanceRecord>;
  onOpenSubstitutionModal: (slot: TimetableSlot) => void;
  onClearSubstitution: (slotId: string) => void;
}

export const TimetableMatrixView: React.FC<TimetableMatrixViewProps> = ({
  currentUser,
  selectedDate,
  teachers,
  periods,
  classes,
  timetableSlots,
  attendance,
  onOpenSubstitutionModal,
  onClearSubstitution
}) => {
  const [viewMode, setViewMode] = useState<'BY_CLASS' | 'BY_TEACHER'>('BY_CLASS');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = currentUser?.role === 'ADMIN';

  // Calculate free teachers per period
  const getFreeTeachersForPeriod = (periodIndex: number) => {
    return teachers.filter(
      (t) =>
        t.id !== 'T0001' &&
        t.freePeriods.includes(periodIndex) &&
        (attendance[t.id]?.status || 'Present') === 'Present'
    );
  };

  // Find slot for Class & Period
  const getSlot = (className: string, periodId: string) => {
    return timetableSlots.find(
      (s) => s.className === className && s.periodId === periodId
    );
  };

  // Find slots for Teacher & Period
  const getTeacherSlot = (teacherId: string, periodId: string) => {
    return timetableSlots.find(
      (s) =>
        (s.teacherId === teacherId || s.substitutionTeacherId === teacherId) &&
        s.periodId === periodId
    );
  };

  const displayedClasses =
    selectedClassFilter === 'ALL'
      ? classes
      : classes.filter((c) => c === selectedClassFilter);

  const nonAdminTeachers = teachers.filter((t) => t.id !== 'T0001');

  // Export Matrix to CSV
  const handleExportCSV = () => {
    const headers = ['Period', 'Time', ...classes];
    const rows = periods.map((p) => {
      const rowValues = [p.id, `"${p.time}"`];
      classes.forEach((cls) => {
        const slot = getSlot(cls, p.id);
        if (slot) {
          const teacher = slot.substitutionTeacherName
            ? `${slot.teacherName} (Sub: ${slot.substitutionTeacherName})`
            : slot.teacherName;
          rowValues.push(`"${slot.subject} - ${teacher}"`);
        } else {
          rowValues.push('"Free / Self Study"');
        }
      });
      return rowValues.join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Akal_Timetable_Matrix_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-base text-slate-900">
              Master High-Density Timetable Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Active session timetable with instant substitution allocator
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('BY_CLASS')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'BY_CLASS'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Class-wise Matrix
            </button>
            <button
              onClick={() => setViewMode('BY_TEACHER')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'BY_TEACHER'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Teacher-wise Matrix
            </button>
          </div>

          {viewMode === 'BY_CLASS' && (
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 font-medium outline-none cursor-pointer"
            >
              <option value="ALL">All Classes ({classes.length})</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleExportCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export Matrix</span>
          </button>
        </div>
      </div>

      {/* Period Free Teacher Availability Bar */}
      <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800 shadow-sm flex items-center gap-4 overflow-x-auto">
        <span className="text-xs font-bold text-amber-400 shrink-0 uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>Faculty Free Periods Availability:</span>
        </span>
        <div className="flex gap-2 shrink-0">
          {periods.map((p, idx) => {
            const freeOnes = getFreeTeachersForPeriod(idx + 1);
            return (
              <div
                key={p.id}
                className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] flex items-center gap-1.5"
                title={`Free teachers in ${p.id}: ${
                  freeOnes.map((t) => t.name).join(', ') || 'None'
                }`}
              >
                <span className="font-bold text-slate-300">{p.id}:</span>
                <span
                  className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                    freeOnes.length > 0
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {freeOnes.length} Free
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CLASS-WISE MATRIX VIEW */}
      {viewMode === 'BY_CLASS' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <th className="p-3 border-r border-slate-200 w-20 sticky left-0 bg-slate-100 z-10">
                    Period
                  </th>
                  <th className="p-3 border-r border-slate-200 w-32 sticky left-20 bg-slate-100 z-10">
                    Timing
                  </th>
                  {displayedClasses.map((cls) => (
                    <th
                      key={cls}
                      className="p-3 border-r border-slate-200 min-w-[200px] text-center"
                    >
                      <span className="font-bold text-slate-900 block">{cls}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {periods.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 font-bold text-slate-900 border-r border-slate-200 sticky left-0 bg-white font-mono z-10">
                      {p.id}
                    </td>
                    <td className="p-3 text-slate-500 border-r border-slate-200 sticky left-20 bg-white font-medium z-10 whitespace-nowrap">
                      {p.time}
                    </td>
                    {displayedClasses.map((cls) => {
                      const slot = getSlot(cls, p.id);
                      if (!slot) {
                        return (
                          <td
                            key={cls}
                            className="p-3 border-r border-slate-200 text-center text-slate-400 italic"
                          >
                            - Free / Lab -
                          </td>
                        );
                      }

                      const teacherAtt = attendance[slot.teacherId]?.status || 'Present';
                      const isTeacherAbsent =
                        teacherAtt === 'Leave' || teacherAtt === 'Absent';
                      const hasSub = !!slot.substitutionTeacherId;

                      return (
                        <td
                          key={cls}
                          className={`p-2.5 border-r border-slate-200 align-top transition ${
                            isTeacherAbsent && !hasSub
                              ? 'bg-rose-50/80 border-rose-200'
                              : hasSub
                              ? 'bg-amber-50/70 border-amber-200'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 text-[11px]">
                                {slot.subject}
                              </span>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                                {slot.room || 'R-201'}
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-600 flex items-center gap-1">
                              <span className={isTeacherAbsent ? 'line-through text-slate-400' : ''}>
                                {slot.teacherName}
                              </span>
                            </div>

                            {/* Absent Teacher Alert & Assign Button */}
                            {isTeacherAbsent && !hasSub && (
                              <div className="pt-1">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded mb-1">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>{teacherAtt}</span>
                                </span>
                                {isAdmin && (
                                  <button
                                    onClick={() => onOpenSubstitutionModal(slot)}
                                    className="w-full bg-rose-700 hover:bg-rose-600 text-white text-[10px] font-bold py-1 px-1.5 rounded transition shadow-xs cursor-pointer block text-center"
                                  >
                                    + Assign Substitution
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Assigned Substitution Badge */}
                            {hasSub && (
                              <div className="pt-1 space-y-1">
                                <div className="bg-amber-100/90 text-amber-900 border border-amber-300 p-1.5 rounded text-[10px]">
                                  <span className="font-bold block">Sub:</span>
                                  <span className="font-semibold text-slate-900">
                                    {slot.substitutionTeacherName}
                                  </span>
                                </div>
                                {isAdmin && (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => onOpenSubstitutionModal(slot)}
                                      className="text-[9px] font-bold text-amber-800 hover:underline cursor-pointer"
                                    >
                                      Change
                                    </button>
                                    <span className="text-slate-300">•</span>
                                    <button
                                      onClick={() => onClearSubstitution(slot.id)}
                                      className="text-[9px] font-bold text-rose-700 hover:underline cursor-pointer"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TEACHER-WISE MATRIX VIEW */}
      {viewMode === 'BY_TEACHER' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <th className="p-3 border-r border-slate-200 w-20 sticky left-0 bg-slate-100 z-10">
                    Period
                  </th>
                  <th className="p-3 border-r border-slate-200 w-32 sticky left-20 bg-slate-100 z-10">
                    Timing
                  </th>
                  {nonAdminTeachers.map((t) => {
                    const status = attendance[t.id]?.status || 'Present';
                    return (
                      <th
                        key={t.id}
                        className="p-3 border-r border-slate-200 min-w-[170px] text-center"
                      >
                        <span className="font-bold text-slate-900 block">{t.name}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-0.5 ${
                            status === 'Present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {status}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {periods.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 font-bold text-slate-900 border-r border-slate-200 sticky left-0 bg-white font-mono z-10">
                      {p.id}
                    </td>
                    <td className="p-3 text-slate-500 border-r border-slate-200 sticky left-20 bg-white font-medium z-10 whitespace-nowrap">
                      {p.time}
                    </td>
                    {nonAdminTeachers.map((t) => {
                      const slot = getTeacherSlot(t.id, p.id);
                      const isFreePeriod = t.freePeriods.includes(idx + 1);
                      const isSubstitution = slot?.substitutionTeacherId === t.id;

                      if (slot) {
                        return (
                          <td
                            key={t.id}
                            className={`p-2.5 border-r border-slate-200 align-top ${
                              isSubstitution ? 'bg-amber-50' : ''
                            }`}
                          >
                            <span className="font-bold text-slate-900 block">
                              {slot.className}
                            </span>
                            <span className="text-[11px] text-slate-600 block">
                              {slot.subject}
                            </span>
                            {isSubstitution && (
                              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold mt-1 inline-block">
                                Sub Duty
                              </span>
                            )}
                          </td>
                        );
                      }

                      if (isFreePeriod) {
                        return (
                          <td
                            key={t.id}
                            className="p-2.5 border-r border-slate-200 text-center bg-emerald-50/40 text-emerald-800 font-bold"
                          >
                            Free Period
                          </td>
                        );
                      }

                      return (
                        <td
                          key={t.id}
                          className="p-2.5 border-r border-slate-200 text-center text-slate-400"
                        >
                          -
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

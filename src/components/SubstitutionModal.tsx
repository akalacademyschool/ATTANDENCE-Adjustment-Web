import React, { useState } from 'react';
import { UserCheck, Clock, Check, X, AlertTriangle, User } from 'lucide-react';
import { Teacher, TimetableSlot, PeriodInfo, StaffAttendanceRecord } from '../types';

interface SubstitutionModalProps {
  slot: TimetableSlot;
  teachers: Teacher[];
  periods: PeriodInfo[];
  attendance: Record<string, StaffAttendanceRecord>;
  timetableSlots: TimetableSlot[];
  onAssignSubstitution: (slotId: string, teacherId: string, teacherName: string) => void;
  onClose: () => void;
}

export const SubstitutionModal: React.FC<SubstitutionModalProps> = ({
  slot,
  teachers,
  periods,
  attendance,
  timetableSlots,
  onAssignSubstitution,
  onClose
}) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');

  const periodIndex = parseInt(slot.periodId.replace('P', '')) || 1;
  const periodInfo = periods.find((p) => p.id === slot.periodId);

  // Faculty who are available (Present, not the original teacher, and either have free period or are not currently teaching another slot in this period)
  const nonAdminTeachers = teachers.filter(
    (t) => t.id !== 'T0001' && t.id !== slot.teacherId
  );

  // Check if teacher is already teaching in this period
  const isTeachingInPeriod = (teacherId: string) => {
    return timetableSlots.some(
      (s) =>
        s.id !== slot.id &&
        s.periodId === slot.periodId &&
        (s.teacherId === teacherId || s.substitutionTeacherId === teacherId)
    );
  };

  const eligibleTeachers = nonAdminTeachers.map((t) => {
    const isPresent = (attendance[t.id]?.status || 'Present') === 'Present';
    const hasFreePeriod = t.freePeriods.includes(periodIndex);
    const isBusy = isTeachingInPeriod(t.id);

    return {
      teacher: t,
      isPresent,
      hasFreePeriod,
      isBusy,
      score: isPresent && hasFreePeriod && !isBusy ? 2 : isPresent && !isBusy ? 1 : 0
    };
  }).sort((a, b) => b.score - a.score);

  const handleConfirm = () => {
    const chosen = teachers.find((t) => t.id === selectedTeacherId);
    if (!chosen) return;
    onAssignSubstitution(slot.id, chosen.id, chosen.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span>Assign Faculty Substitution</span>
              <span className="bg-amber-500 text-slate-950 font-mono text-[11px] font-black px-1.5 py-0.5 rounded">
                {slot.periodId}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {slot.className} • {slot.subject} ({periodInfo?.time})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Current Assigned Teacher Status */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center justify-between text-xs">
          <div>
            <span className="text-rose-900 font-bold block">Assigned Faculty:</span>
            <span className="text-slate-800 font-semibold">{slot.teacherName}</span>
          </div>
          <span className="bg-rose-200 text-rose-950 px-2 py-0.5 rounded-full font-bold text-[10px]">
            {attendance[slot.teacherId]?.status || 'Absent'} (Sub Required)
          </span>
        </div>

        {/* Available Faculty Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Select Substitute Teacher for {slot.periodId}:
          </label>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 border border-slate-200 rounded-xl p-2">
            {eligibleTeachers.map(({ teacher, isPresent, hasFreePeriod, isBusy }) => {
              const isSelected = selectedTeacherId === teacher.id;
              const isRecommended = isPresent && hasFreePeriod && !isBusy;

              return (
                <div
                  key={teacher.id}
                  onClick={() => !isBusy && isPresent && setSelectedTeacherId(teacher.id)}
                  className={`p-2.5 rounded-lg flex items-center justify-between gap-2 transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 border-2 border-amber-500 shadow-xs'
                      : isBusy || !isPresent
                      ? 'opacity-50 cursor-not-allowed bg-slate-50'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{teacher.name}</span>
                      {isRecommended && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                          Free in {slot.periodId} (Recommended)
                        </span>
                      )}
                      {!isPresent && (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                          Not Present
                        </span>
                      )}
                      {isBusy && (
                        <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                          Teaching Another Class
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">{teacher.subject}</span>
                  </div>

                  <div className="shrink-0">
                    <input
                      type="radio"
                      name="substitute-teacher"
                      checked={isSelected}
                      disabled={isBusy || !isPresent}
                      onChange={() => setSelectedTeacherId(teacher.id)}
                      className="accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedTeacherId}
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer ${
              selectedTeacherId
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Confirm Substitution
          </button>
        </div>
      </div>
    </div>
  );
};

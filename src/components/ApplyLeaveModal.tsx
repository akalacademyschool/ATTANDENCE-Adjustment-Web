import React, { useState } from 'react';
import { Send, Calendar, AlertCircle } from 'lucide-react';
import { Teacher, User } from '../types';

interface ApplyLeaveModalProps {
  currentUser: User | null;
  teachers: Teacher[];
  onApplyLeave: (leaveData: {
    teacherId: string;
    teacherName: string;
    startDate: string;
    endDate: string;
    leaveType: string;
    reason: string;
  }) => void;
  onClose: () => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  currentUser,
  teachers,
  onApplyLeave,
  onClose
}) => {
  const isTeacher = currentUser?.role === 'TEACHER';
  const defaultTeacherId = currentUser?.teacherId || 'T0002';

  const [teacherId, setTeacherId] = useState<string>(defaultTeacherId);
  const [startDate, setStartDate] = useState('2026-08-28');
  const [endDate, setEndDate] = useState('2026-08-28');
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [reason, setReason] = useState('');

  const facultyMembers = teachers.filter((t) => t.id !== 'T0001');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const teacher = teachers.find((t) => t.id === teacherId);
    const teacherName = teacher?.name || 'Tr. Faculty Member';

    onApplyLeave({
      teacherId,
      teacherName,
      startDate,
      endDate,
      leaveType,
      reason: reason.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-sm text-slate-900">Apply for Faculty Leave</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Teacher Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Faculty Member
            </label>
            {isTeacher ? (
              <div className="w-full px-3 py-2 text-xs bg-slate-100 rounded-lg border border-slate-200 font-bold text-slate-900">
                {currentUser?.name} ({currentUser?.teacherId})
              </div>
            ) : (
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                {facultyMembers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} - {t.subject} ({t.id})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Leave Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Leave Type
            </label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none cursor-pointer font-medium"
            >
              <option value="Casual Leave">Casual Leave (CL)</option>
              <option value="Sick Leave">Sick / Medical Leave (ML)</option>
              <option value="Duty Leave">Academic Duty / Examination Leave</option>
              <option value="Earned Leave">Earned Leave (EL)</option>
              <option value="Emergency Leave">Personal Emergency Leave</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Reason for Absence / Details
            </label>
            <textarea
              required
              rows={3}
              placeholder="State reason clearly for administration records..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none resize-none"
            />
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
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Leave Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

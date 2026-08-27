import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Filter,
  UserPlus
} from 'lucide-react';
import { Teacher, StaffAttendanceRecord, User } from '../types';

interface AttendanceViewProps {
  currentUser: User | null;
  selectedDate: string;
  teachers: Teacher[];
  attendance: Record<string, StaffAttendanceRecord>;
  onUpdateAttendance: (teacherId: string, record: StaffAttendanceRecord) => void;
  onBulkMarkPresent: () => void;
  onAddTeacher: (teacher: Teacher) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  currentUser,
  selectedDate,
  teachers,
  attendance,
  onUpdateAttendance,
  onBulkMarkPresent,
  onAddTeacher
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('');
  const [newTeacherFreePeriods, setNewTeacherFreePeriods] = useState('2, 5');

  const isAdmin = currentUser?.role === 'ADMIN';
  const facultyMembers = teachers.filter((t) => t.id !== 'T0001');

  // Filtered teachers
  const filteredTeachers = facultyMembers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());

    const attStatus = attendance[t.id]?.status || 'Present';
    const matchesFilter = statusFilter === 'ALL' || attStatus === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const presentCount = facultyMembers.filter(
    (t) => (attendance[t.id]?.status || 'Present') === 'Present'
  ).length;
  const leaveCount = facultyMembers.filter((t) => attendance[t.id]?.status === 'Leave').length;
  const absentCount = facultyMembers.filter((t) => attendance[t.id]?.status === 'Absent').length;
  const halfDayCount = facultyMembers.filter((t) => attendance[t.id]?.status === 'Half Day').length;

  const handleExportCSV = () => {
    const headers = ['Faculty ID', 'Name', 'Subject / Department', 'Attendance Status', 'Leave Type', 'Check In Time', 'Date'];
    const rows = facultyMembers.map((t) => {
      const record = attendance[t.id] || { status: 'Present' };
      return [
        t.id,
        `"${t.name}"`,
        `"${t.subject}"`,
        record.status,
        record.leaveType || 'N/A',
        record.checkInTime || '08:30 AM',
        selectedDate
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Akal_Staff_Attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveNewTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim() || !newTeacherSubject.trim()) return;

    const newId = `T00${String(teachers.length + 1).padStart(2, '0')}`;
    const free = newTeacherFreePeriods
      .split(',')
      .map((p) => parseInt(p.trim()))
      .filter((p) => !isNaN(p) && p >= 1 && p <= 8);

    onAddTeacher({
      id: newId,
      name: newTeacherName.trim(),
      subject: newTeacherSubject.trim(),
      freePeriods: free.length > 0 ? free : [2, 5]
    });

    setNewTeacherName('');
    setNewTeacherSubject('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Action Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-base text-slate-900">
              Faculty Attendance Register
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Log date: {selectedDate} • {facultyMembers.length} Total Faculty Members
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && (
            <>
              <button
                onClick={onBulkMarkPresent}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                id="btn-mark-all-present"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark All Present</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                <span>Add Faculty</span>
              </button>
            </>
          )}

          <button
            onClick={handleExportCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 transition flex items-center gap-1.5 cursor-pointer"
            id="btn-export-attendance-csv"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`p-3 rounded-lg border text-left transition cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-[11px] uppercase tracking-wider block opacity-75 font-semibold">
            All Staff
          </span>
          <span className="text-xl font-bold">{facultyMembers.length}</span>
        </button>

        <button
          onClick={() => setStatusFilter('Present')}
          className={`p-3 rounded-lg border text-left transition cursor-pointer ${
            statusFilter === 'Present'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-emerald-700 border-slate-200 hover:bg-emerald-50/50'
          }`}
        >
          <span className="text-[11px] uppercase tracking-wider block opacity-75 font-semibold">
            Present
          </span>
          <span className="text-xl font-bold">{presentCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('Leave')}
          className={`p-3 rounded-lg border text-left transition cursor-pointer ${
            statusFilter === 'Leave'
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
              : 'bg-white text-amber-700 border-slate-200 hover:bg-amber-50/50'
          }`}
        >
          <span className="text-[11px] uppercase tracking-wider block opacity-75 font-semibold">
            On Leave
          </span>
          <span className="text-xl font-bold">{leaveCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('Absent')}
          className={`p-3 rounded-lg border text-left transition cursor-pointer ${
            statusFilter === 'Absent'
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-white text-rose-700 border-slate-200 hover:bg-rose-50/50'
          }`}
        >
          <span className="text-[11px] uppercase tracking-wider block opacity-75 font-semibold">
            Absent
          </span>
          <span className="text-xl font-bold">{absentCount}</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by teacher name, ID, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none"
            id="attendance-search-input"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 font-medium outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Present">Present Only</option>
            <option value="Leave">Leave Only</option>
            <option value="Absent">Absent Only</option>
            <option value="Half Day">Half Day Only</option>
          </select>
        </div>
      </div>

      {/* Faculty Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Faculty ID</th>
                <th className="px-5 py-3.5">Teacher Name</th>
                <th className="px-5 py-3.5">Department / Subject</th>
                <th className="px-5 py-3.5">Free Periods</th>
                <th className="px-5 py-3.5">Current Status</th>
                <th className="px-5 py-3.5 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                    No faculty records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((t) => {
                  const record = attendance[t.id] || { status: 'Present' };
                  const isCurrentLoggedUser = currentUser?.teacherId === t.id;

                  return (
                    <tr
                      key={t.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isCurrentLoggedUser ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-500">
                        {t.id}
                        {isCurrentLoggedUser && (
                          <span className="ml-1.5 text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-sans font-bold">
                            You
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{t.name}</div>
                        <div className="text-[11px] text-slate-500">{t.email || `${t.id.toLowerCase()}@akalacademy.edu.in`}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 font-medium">{t.subject}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1 flex-wrap">
                          {t.freePeriods.length > 0 ? (
                            t.freePeriods.map((p) => (
                              <span
                                key={p}
                                className="bg-slate-100 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-200"
                              >
                                P{p}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-400">None</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            record.status === 'Present'
                              ? 'bg-[#dcfce7] text-[#166534]'
                              : record.status === 'Leave'
                              ? 'bg-[#fef3c7] text-[#92400e]'
                              : record.status === 'Half Day'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-[#fee2e2] text-[#991b1b]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              record.status === 'Present'
                                ? 'bg-emerald-600'
                                : record.status === 'Leave'
                                : 'bg-amber-600'
                            }`}
                          />
                          {record.status} {record.leaveType ? `• ${record.leaveType}` : ''}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {(['Present', 'Leave', 'Absent', 'Half Day'] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => onUpdateAttendance(t.id, { status: st })}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition cursor-pointer ${
                                record.status === st
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Add New Faculty Member</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewTeacher} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teacher Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tr. Baldev Singh"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject / Department</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chemistry, Economics, Arts"
                  value={newTeacherSubject}
                  onChange={(e) => setNewTeacherSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Free Periods (comma separated numbers 1 to 8)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2, 5, 7"
                  value={newTeacherFreePeriods}
                  onChange={(e) => setNewTeacherFreePeriods(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition shadow-xs"
                >
                  Save Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

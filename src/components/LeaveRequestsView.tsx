import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Send,
  Filter,
  Search,
  Download,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { LeaveRequest, User } from '../types';

interface LeaveRequestsViewProps {
  currentUser: User | null;
  leaves: LeaveRequest[];
  onApproveLeave: (id: number) => void;
  onRejectLeave: (id: number) => void;
  onOpenApplyLeave: () => void;
}

export const LeaveRequestsView: React.FC<LeaveRequestsViewProps> = ({
  currentUser,
  leaves,
  onApproveLeave,
  onRejectLeave,
  onOpenApplyLeave
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Pending' | 'Approved' | 'Rejected'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = currentUser?.role === 'ADMIN';
  const isTeacher = currentUser?.role === 'TEACHER';

  const filteredLeaves = leaves.filter((l) => {
    const matchesFilter = statusFilter === 'ALL' || l.status === statusFilter;
    const matchesSearch =
      l.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.reason.toLowerCase().includes(searchQuery.toLowerCase());

    // If teacher, only show own leaves unless they want to see all
    if (isTeacher && currentUser?.teacherId) {
      return matchesFilter && matchesSearch && l.teacherId === currentUser.teacherId;
    }
    return matchesFilter && matchesSearch;
  });

  const pendingCount = leaves.filter((l) => l.status === 'Pending').length;
  const approvedCount = leaves.filter((l) => l.status === 'Approved').length;
  const rejectedCount = leaves.filter((l) => l.status === 'Rejected').length;

  const handleExportCSV = () => {
    const headers = ['Request ID', 'Faculty ID', 'Teacher Name', 'Start Date', 'End Date', 'Leave Type', 'Reason', 'Status', 'Applied At'];
    const rows = leaves.map((l) => [
      l.id,
      l.teacherId,
      `"${l.teacherName}"`,
      l.startDate,
      l.endDate,
      `"${l.leaveType}"`,
      `"${l.reason.replace(/"/g, '""')}"`,
      l.status,
      `"${l.createdAt}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Akal_Leave_Applications_Register.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-base text-slate-900">
              Faculty Leave Applications & Approvals
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isTeacher
              ? `My submitted leave requests and approval status`
              : `Admin review portal • Approving automatically syncs attendance`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenApplyLeave}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            id="leaves-apply-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Apply for Leave</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Tabs */}
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
            Total Requests
          </span>
          <span className="text-xl font-bold">{leaves.length}</span>
        </button>

        <button
          onClick={() => setStatusFilter('Pending')}
          className={`p-3 rounded-lg border text-left transition cursor-pointer ${
            statusFilter === 'Pending'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-blue-700 border-slate-200 hover:bg-blue-50/50'
          }`}
        >
          <span className="text-[11px] uppercase tracking-wider block opacity-75 font-semibold">
            Pending Review
          </span>
          <span className="text-xl font-bold">{pendingCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('Approved')}
          className={`p-3 rounded-lg border text-left transition cursor-pointer ${
            statusFilter === 'Approved'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-emerald-700 border-slate-200 hover:bg-emerald-50/50'
          }`}
        >
          <span className="text-[11px] uppercase tracking-wider block opacity-75 font-semibold">
            Approved & Synced
          </span>
          <span className="text-xl font-bold">{approvedCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('Rejected')}
          className={`p-3 rounded-lg border text-left transition cursor-pointer ${
            statusFilter === 'Rejected'
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-white text-rose-700 border-slate-200 hover:bg-rose-50/50'
          }`}
        >
          <span className="text-[11px] uppercase tracking-wider block opacity-75 font-semibold">
            Rejected
          </span>
          <span className="text-xl font-bold">{rejectedCount}</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by teacher name, leave type, reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 font-medium outline-none cursor-pointer"
          >
            <option value="ALL">All ({leaves.length})</option>
            <option value="Pending">Pending ({pendingCount})</option>
            <option value="Approved">Approved ({approvedCount})</option>
            <option value="Rejected">Rejected ({rejectedCount})</option>
          </select>
        </div>
      </div>

      {/* Leaves List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-200">
          {filteredLeaves.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              <CheckCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              No leave requests found matching the selected criteria.
            </div>
          ) : (
            filteredLeaves.map((req) => (
              <div
                key={req.id}
                className="p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50 transition"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900">
                      {req.teacherName}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      ({req.teacherId})
                    </span>
                    <span className="bg-slate-100 text-slate-800 text-xs px-2.5 py-0.5 rounded-full font-bold border border-slate-200">
                      {req.leaveType}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        req.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-normal leading-relaxed">
                    <strong className="font-semibold text-slate-800">Reason: </strong>
                    {req.reason}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap pt-0.5">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Date: {req.startDate} {req.startDate !== req.endDate ? `to ${req.endDate}` : '(1 Day)'}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Applied: {req.createdAt}</span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {req.status === 'Pending' && isAdmin && (
                    <>
                      <button
                        onClick={() => onApproveLeave(req.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                        id={`btn-approve-leave-${req.id}`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve & Sync</span>
                      </button>
                      <button
                        onClick={() => onRejectLeave(req.id)}
                        className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                        id={`btn-reject-leave-${req.id}`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {req.status === 'Approved' && (
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Synced to Attendance</span>
                    </span>
                  )}

                  {req.status === 'Rejected' && (
                    <span className="text-xs text-rose-700 font-bold bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Declined</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

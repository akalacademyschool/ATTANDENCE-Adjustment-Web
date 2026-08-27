import React, { useState } from 'react';
import {
  Users,
  Search,
  Download,
  Plus,
  UserPlus,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Filter
} from 'lucide-react';
import { Student, User } from '../types';

interface StudentRegisterViewProps {
  currentUser: User | null;
  selectedDate: string;
  students: Student[];
  classes: string[];
  onUpdateStudentStatus: (studentId: string, status: 'Present' | 'Absent' | 'Late') => void;
  onBulkMarkStudents: (className: string, status: 'Present' | 'Absent') => void;
  onAddStudent: (student: Student) => void;
}

export const StudentRegisterView: React.FC<StudentRegisterViewProps> = ({
  currentUser,
  selectedDate,
  students,
  classes,
  onUpdateStudentStatus,
  onBulkMarkStudents,
  onAddStudent
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('Class X-A');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newRollNo, setNewRollNo] = useState('');
  const [newGender, setNewGender] = useState<'Male' | 'Female'>('Male');
  const [newGuardian, setNewGuardian] = useState('');
  const [newContact, setNewContact] = useState('');

  const classStudents = students.filter((s) => s.className === selectedClass);
  const filteredStudents = classStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.includes(searchQuery) ||
      s.guardianName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = classStudents.filter((s) => s.status === 'Present').length;
  const absentCount = classStudents.filter((s) => s.status === 'Absent').length;
  const lateCount = classStudents.filter((s) => s.status === 'Late').length;

  const handleExportCSV = () => {
    const headers = ['Roll No', 'Student Name', 'Class', 'Gender', 'Attendance Status', 'Guardian Name', 'Contact Number', 'Date'];
    const rows = classStudents.map((s) => [
      s.rollNo,
      `"${s.name}"`,
      `"${s.className}"`,
      s.gender,
      s.status,
      `"${s.guardianName}"`,
      `"${s.contactNumber}"`,
      selectedDate
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Akal_${selectedClass.replace(/\s+/g, '_')}_Attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRollNo.trim()) return;

    const newStudent: Student = {
      id: `ST-${Date.now().toString().slice(-4)}`,
      rollNo: newRollNo.trim(),
      name: newName.trim(),
      className: selectedClass,
      section: selectedClass.includes('-B') ? 'B' : 'A',
      gender: newGender,
      guardianName: newGuardian.trim() || 'Parent/Guardian',
      contactNumber: newContact.trim() || '+91 98765 00000',
      status: 'Present'
    };

    onAddStudent(newStudent);
    setNewName('');
    setNewRollNo('');
    setNewGuardian('');
    setNewContact('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-base text-slate-900">
              Student Attendance Register
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Log date: {selectedDate} • Select class section to mark daily roll call
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onBulkMarkStudents(selectedClass, 'Present')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark All Present</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Student</span>
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

      {/* Class Section Selector & Summary Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
        <div className="lg:col-span-8 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {classes.map((cls) => {
            const count = students.filter((s) => s.className === cls).length;
            const isSelected = selectedClass === cls;
            return (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{cls}</span>
                <span
                  className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-4 flex items-center justify-end gap-2 text-xs font-bold">
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {presentCount} Present
          </span>
          <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            {absentCount} Absent
          </span>
          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            {lateCount} Late
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={`Search ${selectedClass} by student name, roll number, or guardian...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Student Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Roll No</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Gender</th>
                <th className="p-3.5">Guardian & Contact</th>
                <th className="p-3.5">Attendance Status</th>
                <th className="p-3.5 text-right">Mark Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                    No students found in {selectedClass}. Click "Add Student" to enroll.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-mono font-bold text-slate-600">{s.rollNo}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900">{s.name}</span>
                      <span className="block text-[11px] text-slate-400 font-mono">{s.id}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded">
                        {s.gender}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800">{s.guardianName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{s.contactNumber}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          s.status === 'Present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'Late'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            s.status === 'Present'
                              ? 'bg-emerald-600'
                              : s.status === 'Late'
                              ? 'bg-amber-600'
                              : 'bg-rose-600'
                          }`}
                        />
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {(['Present', 'Absent', 'Late'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => onUpdateStudentStatus(s.id, st)}
                            className={`px-2 py-1 rounded text-[11px] font-semibold border transition cursor-pointer ${
                              s.status === st
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                Enroll Student into {selectedClass}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1010"
                    value={newRollNo}
                    onChange={(e) => setNewRollNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mehtab Singh"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Guardian Name</label>
                <input
                  type="text"
                  placeholder="e.g. S. Hardeep Singh"
                  value={newGuardian}
                  onChange={(e) => setNewGuardian(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98160 55443"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
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
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

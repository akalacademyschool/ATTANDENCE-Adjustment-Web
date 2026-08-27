import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabId } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { AttendanceView } from './components/AttendanceView';
import { TimetableMatrixView } from './components/TimetableMatrixView';
import { LeaveRequestsView } from './components/LeaveRequestsView';
import { StudentRegisterView } from './components/StudentRegisterView';
import { CloudSyncView } from './components/CloudSyncView';
import { SubstitutionModal } from './components/SubstitutionModal';
import { ApplyLeaveModal } from './components/ApplyLeaveModal';

import {
  User,
  Teacher,
  LeaveRequest,
  TimetableSlot,
  Student,
  StaffAttendanceRecord,
  SyncLog
} from './types';

import {
  INITIAL_TEACHERS,
  PERIODS,
  CLASSES_LIST,
  INITIAL_TIMETABLE_SLOTS,
  INITIAL_LEAVES,
  INITIAL_STUDENTS,
  INITIAL_SYNC_LOGS
} from './data/initialData';

export default function AkalAcademyWebApp() {
  // Current user state
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('akal_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      username: 'admin',
      name: 'Administrator',
      role: 'ADMIN'
    };
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  // Selected date
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-27');

  // Teachers State
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('akal_teachers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_TEACHERS;
  });

  // Staff Attendance State
  const [attendance, setAttendance] = useState<Record<string, StaffAttendanceRecord>>(() => {
    const saved = localStorage.getItem('akal_staff_attendance');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      T0002: { status: 'Present', checkInTime: '08:25 AM' },
      T0003: { status: 'Present', checkInTime: '08:20 AM' },
      T0004: { status: 'Present', checkInTime: '08:30 AM' },
      T0005: { status: 'Present', checkInTime: '08:15 AM' },
      T0006: { status: 'Present', checkInTime: '08:28 AM' },
      T0007: { status: 'Present', checkInTime: '08:10 AM' },
      T0008: { status: 'Present', checkInTime: '08:35 AM' },
      T0009: { status: 'Present', checkInTime: '08:18 AM' },
      T0010: { status: 'Present', checkInTime: '08:22 AM' }
    };
  });

  // Leave Requests State
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('akal_leaves');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_LEAVES;
  });

  // Timetable Slots State
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>(() => {
    const saved = localStorage.getItem('akal_timetable');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_TIMETABLE_SLOTS;
  });

  // Students Register State
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('akal_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_STUDENTS;
  });

  // Sync Activity Logs State
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(() => {
    const saved = localStorage.getItem('akal_sync_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_SYNC_LOGS;
  });

  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [substitutionSlot, setSubstitutionSlot] = useState<TimetableSlot | null>(null);
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('akal_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('akal_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('akal_staff_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('akal_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('akal_timetable', JSON.stringify(timetableSlots));
  }, [timetableSlots]);

  useEffect(() => {
    localStorage.setItem('akal_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('akal_sync_logs', JSON.stringify(syncLogs));
  }, [syncLogs]);

  // Handle Switch User (Admin <-> Teacher)
  const handleSwitchUser = () => {
    if (currentUser.role === 'ADMIN') {
      setCurrentUser({
        username: 'harpreet',
        name: 'Tr. Harpreet Singh',
        role: 'TEACHER',
        teacherId: 'T0002'
      });
    } else {
      setCurrentUser({
        username: 'admin',
        name: 'Administrator',
        role: 'ADMIN'
      });
    }
  };

  // Staff Attendance Updates
  const handleUpdateStaffAttendance = (teacherId: string, record: StaffAttendanceRecord) => {
    setAttendance((prev) => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        ...record,
        checkInTime: record.checkInTime || prev[teacherId]?.checkInTime || '08:30 AM'
      }
    }));
  };

  const handleBulkMarkPresent = () => {
    const updated: Record<string, StaffAttendanceRecord> = {};
    teachers.forEach((t) => {
      if (t.id !== 'T0001') {
        updated[t.id] = { status: 'Present', checkInTime: '08:30 AM' };
      }
    });
    setAttendance(updated);
  };

  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers((prev) => [...prev, newTeacher]);
    setAttendance((prev) => ({
      ...prev,
      [newTeacher.id]: { status: 'Present', checkInTime: '08:30 AM' }
    }));
  };

  // Leave Approvals & Rejections (auto-syncs to attendance)
  const handleApproveLeave = (id: number) => {
    setLeaves((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          // Automatically sync to attendance
          setAttendance((attPrev) => ({
            ...attPrev,
            [l.teacherId]: {
              status: 'Leave',
              leaveType: l.leaveType,
              notes: `Approved leave: ${l.reason}`
            }
          }));
          return { ...l, status: 'Approved' };
        }
        return l;
      })
    );

    // Add to audit log
    const targetLeave = leaves.find((l) => l.id === id);
    if (targetLeave) {
      addSyncLog({
        type: 'AUTOMATIC',
        dataset: 'Leave Approved & Attendance Synced',
        status: 'SUCCESS',
        recordsAffected: 1,
        details: `Approved leave for ${targetLeave.teacherName} (${targetLeave.leaveType}) and updated staff attendance register.`
      });
    }
  };

  const handleRejectLeave = (id: number) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'Rejected' } : l))
    );
  };

  const handleApplyLeave = (leaveData: {
    teacherId: string;
    teacherName: string;
    startDate: string;
    endDate: string;
    leaveType: string;
    reason: string;
  }) => {
    const newLeave: LeaveRequest = {
      id: Date.now(),
      teacherId: leaveData.teacherId,
      teacherName: leaveData.teacherName,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      leaveType: leaveData.leaveType,
      reason: leaveData.reason,
      status: 'Pending',
      createdAt: `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };

    setLeaves((prev) => [newLeave, ...prev]);

    addSyncLog({
      type: 'UPLOAD',
      dataset: 'Faculty Leave Application',
      status: 'SUCCESS',
      recordsAffected: 1,
      details: `New leave request submitted by ${leaveData.teacherName} (${leaveData.leaveType})`
    });
  };

  // Substitution Handlers
  const handleAssignSubstitution = (
    slotId: string,
    subTeacherId: string,
    subTeacherName: string
  ) => {
    setTimetableSlots((prev) =>
      prev.map((s) => {
        if (s.id === slotId) {
          return {
            ...s,
            substitutionTeacherId: subTeacherId,
            substitutionTeacherName: subTeacherName
          };
        }
        return s;
      })
    );

    const slot = timetableSlots.find((s) => s.id === slotId);
    if (slot) {
      addSyncLog({
        type: 'AUTOMATIC',
        dataset: 'Timetable Substitution Assigned',
        status: 'SUCCESS',
        recordsAffected: 1,
        details: `Assigned ${subTeacherName} as substitute for ${slot.className} (${slot.periodId} - ${slot.subject}) replacing ${slot.teacherName}.`
      });
    }
  };

  const handleClearSubstitution = (slotId: string) => {
    setTimetableSlots((prev) =>
      prev.map((s) => {
        if (s.id === slotId) {
          const copy = { ...s };
          delete copy.substitutionTeacherId;
          delete copy.substitutionTeacherName;
          return copy;
        }
        return s;
      })
    );
  };

  // Student Attendance Handlers
  const handleUpdateStudentStatus = (
    studentId: string,
    status: 'Present' | 'Absent' | 'Late'
  ) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
  };

  const handleBulkMarkStudents = (className: string, status: 'Present' | 'Absent') => {
    setStudents((prev) =>
      prev.map((s) => (s.className === className ? { ...s, status } : s))
    );
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [...prev, newStudent]);
  };

  // Sync Log Helper
  const addSyncLog = (log: Omit<SyncLog, 'id' | 'timestamp'>) => {
    const newLog: SyncLog = {
      id: `log-${Date.now()}`,
      timestamp: `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString()}`,
      ...log
    };
    setSyncLogs((prev) => [newLog, ...prev]);
  };

  // Cloud Sync Actions
  const handleTriggerSync = (dataset: string) => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      addSyncLog({
        type: 'DOWNLOAD',
        dataset: dataset === 'All Datasets' ? 'Master Academic Sheets' : dataset,
        status: 'SUCCESS',
        recordsAffected: teachers.length + timetableSlots.length + students.length,
        details: `Successfully synchronized ${dataset} with Akal Academy Central Google Sheets.`
      });
    }, 1000);
  };

  const handleExportFullJson = () => {
    const backupData = {
      academy: 'Akal Academy Baru Sahib',
      exportedAt: new Date().toISOString(),
      teachers,
      attendance,
      leaves,
      timetableSlots,
      students,
      syncLogs
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Akal_Academy_Backup_${selectedDate}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportJson = (jsonData: any) => {
    if (jsonData.teachers) setTeachers(jsonData.teachers);
    if (jsonData.attendance) setAttendance(jsonData.attendance);
    if (jsonData.leaves) setLeaves(jsonData.leaves);
    if (jsonData.timetableSlots) setTimetableSlots(jsonData.timetableSlots);
    if (jsonData.students) setStudents(jsonData.students);

    addSyncLog({
      type: 'UPLOAD',
      dataset: 'JSON Database Restore',
      status: 'SUCCESS',
      recordsAffected: (jsonData.teachers?.length || 0) + (jsonData.students?.length || 0),
      details: 'Restored academic records from uploaded JSON database file.'
    });

    alert('Database successfully restored from JSON backup!');
  };

  // Compute Badges
  const pendingLeavesCount = leaves.filter((l) => l.status === 'Pending').length;
  const absentTeacherIds = teachers
    .filter(
      (t) =>
        t.id !== 'T0001' &&
        (attendance[t.id]?.status === 'Leave' || attendance[t.id]?.status === 'Absent')
    )
    .map((t) => t.id);

  const unassignedSubstitutionsCount = timetableSlots.filter(
    (s) => absentTeacherIds.includes(s.teacherId) && !s.substitutionTeacherId
  ).length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-amber-200 selection:text-slate-900">
      {/* High Density Header */}
      <Header
        currentUser={currentUser}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onSwitchUser={handleSwitchUser}
        onOpenSync={() => setActiveTab('sync')}
      />

      {/* Navigation Tabs Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingLeavesCount={pendingLeavesCount}
        unassignedSubstitutionsCount={unassignedSubstitutionsCount}
        userRole={currentUser.role}
      />

      {/* Main Content View Area */}
      <main className="p-4 md:p-6 max-w-7xl w-full mx-auto flex-1 pb-12">
        {activeTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            selectedDate={selectedDate}
            teachers={teachers}
            attendance={attendance}
            leaves={leaves}
            timetableSlots={timetableSlots}
            periods={PERIODS}
            onNavigateTab={setActiveTab}
            onOpenApplyLeave={() => setShowApplyLeaveModal(true)}
            onOpenSubstitutionModal={(slot) => setSubstitutionSlot(slot)}
            onQuickApproveLeave={handleApproveLeave}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceView
            currentUser={currentUser}
            selectedDate={selectedDate}
            teachers={teachers}
            attendance={attendance}
            onUpdateAttendance={handleUpdateStaffAttendance}
            onBulkMarkPresent={handleBulkMarkPresent}
            onAddTeacher={handleAddTeacher}
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableMatrixView
            currentUser={currentUser}
            selectedDate={selectedDate}
            teachers={teachers}
            periods={PERIODS}
            classes={CLASSES_LIST}
            timetableSlots={timetableSlots}
            attendance={attendance}
            onOpenSubstitutionModal={(slot) => setSubstitutionSlot(slot)}
            onClearSubstitution={handleClearSubstitution}
          />
        )}

        {activeTab === 'leaves' && (
          <LeaveRequestsView
            currentUser={currentUser}
            leaves={leaves}
            onApproveLeave={handleApproveLeave}
            onRejectLeave={handleRejectLeave}
            onOpenApplyLeave={() => setShowApplyLeaveModal(true)}
          />
        )}

        {activeTab === 'students' && (
          <StudentRegisterView
            currentUser={currentUser}
            selectedDate={selectedDate}
            students={students}
            classes={CLASSES_LIST}
            onUpdateStudentStatus={handleUpdateStudentStatus}
            onBulkMarkStudents={handleBulkMarkStudents}
            onAddStudent={handleAddStudent}
          />
        )}

        {activeTab === 'sync' && (
          <CloudSyncView
            syncLogs={syncLogs}
            onTriggerSync={handleTriggerSync}
            onExportFullJson={handleExportFullJson}
            onImportJson={handleImportJson}
            isSyncing={isSyncing}
          />
        )}
      </main>

      {/* Modals */}
      {substitutionSlot && (
        <SubstitutionModal
          slot={substitutionSlot}
          teachers={teachers}
          periods={PERIODS}
          attendance={attendance}
          timetableSlots={timetableSlots}
          onAssignSubstitution={handleAssignSubstitution}
          onClose={() => setSubstitutionSlot(null)}
        />
      )}

      {showApplyLeaveModal && (
        <ApplyLeaveModal
          currentUser={currentUser}
          teachers={teachers}
          onApplyLeave={handleApplyLeave}
          onClose={() => setShowApplyLeaveModal(false)}
        />
      )}
    </div>
  );
}

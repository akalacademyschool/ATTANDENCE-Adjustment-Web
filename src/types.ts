export type UserRole = 'ADMIN' | 'TEACHER';

export interface User {
  username: string;
  name: string;
  role: UserRole;
  teacherId?: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  freePeriods: number[]; // e.g. [2, 5] for Period 2, 5
  email?: string;
  phone?: string;
}

export interface LeaveRequest {
  id: number;
  teacherId: string;
  teacherName: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  comments?: string;
}

export interface TimetableSlot {
  id: string;
  periodId: string; // P1, P2...
  className: string; // "Class X-A"
  subject: string;
  teacherId: string;
  teacherName: string;
  room?: string;
  substitutionTeacherId?: string;
  substitutionTeacherName?: string;
}

export interface PeriodInfo {
  id: string;
  name: string;
  time: string;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  className: string;
  section: string;
  gender: 'Male' | 'Female';
  guardianName: string;
  contactNumber: string;
  status: 'Present' | 'Absent' | 'Late';
}

export interface StaffAttendanceRecord {
  status: 'Present' | 'Absent' | 'Leave' | 'Half Day';
  leaveType?: string;
  checkInTime?: string;
  notes?: string;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  type: 'UPLOAD' | 'DOWNLOAD' | 'AUTOMATIC';
  dataset: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  recordsAffected: number;
  details: string;
}

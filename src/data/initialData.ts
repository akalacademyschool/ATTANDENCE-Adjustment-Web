import { Teacher, PeriodInfo, TimetableSlot, Student, LeaveRequest, StaffAttendanceRecord, SyncLog } from '../types';

export const INITIAL_TEACHERS: Teacher[] = [
  { id: 'T0001', name: 'Principal Office', subject: 'Administration', freePeriods: [], email: 'principal@akalacademy.edu.in', phone: '+91 98160 11001' },
  { id: 'T0002', name: 'Tr. Harpreet Singh', subject: 'Mathematics', freePeriods: [2, 5], email: 'harpreet.s@akalacademy.edu.in', phone: '+91 98160 11002' },
  { id: 'T0003', name: 'Tr. Gurpreet Kaur', subject: 'Science', freePeriods: [1, 4], email: 'gurpreet.k@akalacademy.edu.in', phone: '+91 98160 11003' },
  { id: 'T0004', name: 'Tr. Manjit Singh', subject: 'Punjabi / Div. Div.', freePeriods: [3, 6], email: 'manjit.s@akalacademy.edu.in', phone: '+91 98160 11004' },
  { id: 'T0005', name: 'Tr. Simranjit Kaur', subject: 'English', freePeriods: [2, 7], email: 'simranjit.k@akalacademy.edu.in', phone: '+91 98160 11005' },
  { id: 'T0006', name: 'Tr. Rajwinder Kaur', subject: 'Social Studies', freePeriods: [1, 3], email: 'rajwinder.k@akalacademy.edu.in', phone: '+91 98160 11006' },
  { id: 'T0007', name: 'Tr. Amandeep Singh', subject: 'Physical Education', freePeriods: [4, 5], email: 'amandeep.s@akalacademy.edu.in', phone: '+91 98160 11007' },
  { id: 'T0008', name: 'Tr. Kuldeep Kaur', subject: 'Hindi', freePeriods: [2, 6], email: 'kuldeep.k@akalacademy.edu.in', phone: '+91 98160 11008' },
  { id: 'T0009', name: 'Tr. Jaswinder Singh', subject: 'Computer Science & AI', freePeriods: [3, 5, 8], email: 'jaswinder.s@akalacademy.edu.in', phone: '+91 98160 11009' },
  { id: 'T0010', name: 'Tr. Navneet Kaur', subject: 'Physics', freePeriods: [1, 6], email: 'navneet.k@akalacademy.edu.in', phone: '+91 98160 11010' }
];

export const PERIODS: PeriodInfo[] = [
  { id: 'P1', name: 'Period 1', time: '08:45 - 09:30 AM' },
  { id: 'P2', name: 'Period 2', time: '09:30 - 10:15 AM' },
  { id: 'P3', name: 'Period 3', time: '10:15 - 11:00 AM' },
  { id: 'P4', name: 'Period 4', time: '11:15 - 12:00 PM' },
  { id: 'P5', name: 'Period 5', time: '12:00 - 12:45 PM' },
  { id: 'P6', name: 'Period 6', time: '01:30 - 02:15 PM' },
  { id: 'P7', name: 'Period 7', time: '02:15 - 03:00 PM' },
  { id: 'P8', name: 'Period 8', time: '03:00 - 03:40 PM' }
];

export const CLASSES_LIST = [
  'Class X-A',
  'Class X-B',
  'Class IX-A',
  'Class IX-B',
  'Class VIII-A',
  'Class XI-Sci',
  'Class XII-Sci'
];

export const INITIAL_TIMETABLE_SLOTS: TimetableSlot[] = [
  // Class X-A
  { id: 's-1', periodId: 'P1', className: 'Class X-A', subject: 'Mathematics', teacherId: 'T0002', teacherName: 'Tr. Harpreet Singh', room: 'R-201' },
  { id: 's-2', periodId: 'P2', className: 'Class X-A', subject: 'English', teacherId: 'T0005', teacherName: 'Tr. Simranjit Kaur', room: 'R-201' },
  { id: 's-3', periodId: 'P3', className: 'Class X-A', subject: 'Punjabi', teacherId: 'T0004', teacherName: 'Tr. Manjit Singh', room: 'R-201' },
  { id: 's-4', periodId: 'P4', className: 'Class X-A', subject: 'Science (Bio/Chem)', teacherId: 'T0003', teacherName: 'Tr. Gurpreet Kaur', room: 'Lab-1' },
  { id: 's-5', periodId: 'P5', className: 'Class X-A', subject: 'Social Studies', teacherId: 'T0006', teacherName: 'Tr. Rajwinder Kaur', room: 'R-201' },
  { id: 's-6', periodId: 'P6', className: 'Class X-A', subject: 'Hindi', teacherId: 'T0008', teacherName: 'Tr. Kuldeep Kaur', room: 'R-201' },
  { id: 's-7', periodId: 'P7', className: 'Class X-A', subject: 'Comp Science / AI', teacherId: 'T0009', teacherName: 'Tr. Jaswinder Singh', room: 'IT-Lab' },
  { id: 's-8', periodId: 'P8', className: 'Class X-A', subject: 'Physical Ed. / Sports', teacherId: 'T0007', teacherName: 'Tr. Amandeep Singh', room: 'Ground' },

  // Class X-B
  { id: 's-9', periodId: 'P1', className: 'Class X-B', subject: 'Science (Physics)', teacherId: 'T0010', teacherName: 'Tr. Navneet Kaur', room: 'R-202' },
  { id: 's-10', periodId: 'P2', className: 'Class X-B', subject: 'Mathematics', teacherId: 'T0002', teacherName: 'Tr. Harpreet Singh', room: 'R-202' },
  { id: 's-11', periodId: 'P3', className: 'Class X-B', subject: 'English', teacherId: 'T0005', teacherName: 'Tr. Simranjit Kaur', room: 'R-202' },
  { id: 's-12', periodId: 'P4', className: 'Class X-B', subject: 'Hindi', teacherId: 'T0008', teacherName: 'Tr. Kuldeep Kaur', room: 'R-202' },
  { id: 's-13', periodId: 'P5', className: 'Class X-B', subject: 'Science (Chem)', teacherId: 'T0003', teacherName: 'Tr. Gurpreet Kaur', room: 'Lab-2' },
  { id: 's-14', periodId: 'P6', className: 'Class X-B', subject: 'Social Studies', teacherId: 'T0006', teacherName: 'Tr. Rajwinder Kaur', room: 'R-202' },
  { id: 's-15', periodId: 'P7', className: 'Class X-B', subject: 'Punjabi', teacherId: 'T0004', teacherName: 'Tr. Manjit Singh', room: 'R-202' },
  { id: 's-16', periodId: 'P8', className: 'Class X-B', subject: 'Divinity & Values', teacherId: 'T0004', teacherName: 'Tr. Manjit Singh', room: 'Gurdwara Hall' },

  // Class IX-A
  { id: 's-17', periodId: 'P1', className: 'Class IX-A', subject: 'English', teacherId: 'T0005', teacherName: 'Tr. Simranjit Kaur', room: 'R-101' },
  { id: 's-18', periodId: 'P2', className: 'Class IX-A', subject: 'Social Studies', teacherId: 'T0006', teacherName: 'Tr. Rajwinder Kaur', room: 'R-101' },
  { id: 's-19', periodId: 'P3', className: 'Class IX-A', subject: 'Mathematics', teacherId: 'T0002', teacherName: 'Tr. Harpreet Singh', room: 'R-101' },
  { id: 's-20', periodId: 'P4', className: 'Class IX-A', subject: 'Physical Ed.', teacherId: 'T0007', teacherName: 'Tr. Amandeep Singh', room: 'Ground' },
  { id: 's-21', periodId: 'P5', className: 'Class IX-A', subject: 'Punjabi', teacherId: 'T0004', teacherName: 'Tr. Manjit Singh', room: 'R-101' },
  { id: 's-22', periodId: 'P6', className: 'Class IX-A', subject: 'Science', teacherId: 'T0003', teacherName: 'Tr. Gurpreet Kaur', room: 'Lab-1' },
  { id: 's-23', periodId: 'P7', className: 'Class IX-A', subject: 'Hindi', teacherId: 'T0008', teacherName: 'Tr. Kuldeep Kaur', room: 'R-101' },
  { id: 's-24', periodId: 'P8', className: 'Class IX-A', subject: 'Computer Science', teacherId: 'T0009', teacherName: 'Tr. Jaswinder Singh', room: 'IT-Lab' },

  // Class IX-B
  { id: 's-25', periodId: 'P1', className: 'Class IX-B', subject: 'Punjabi', teacherId: 'T0004', teacherName: 'Tr. Manjit Singh', room: 'R-102' },
  { id: 's-26', periodId: 'P2', className: 'Class IX-B', subject: 'Science', teacherId: 'T0003', teacherName: 'Tr. Gurpreet Kaur', room: 'R-102' },
  { id: 's-27', periodId: 'P3', className: 'Class IX-B', subject: 'Social Studies', teacherId: 'T0006', teacherName: 'Tr. Rajwinder Kaur', room: 'R-102' },
  { id: 's-28', periodId: 'P4', className: 'Class IX-B', subject: 'Mathematics', teacherId: 'T0002', teacherName: 'Tr. Harpreet Singh', room: 'R-102' },
  { id: 's-29', periodId: 'P5', className: 'Class IX-B', subject: 'Hindi', teacherId: 'T0008', teacherName: 'Tr. Kuldeep Kaur', room: 'R-102' },
  { id: 's-30', periodId: 'P6', className: 'Class IX-B', subject: 'English', teacherId: 'T0005', teacherName: 'Tr. Simranjit Kaur', room: 'R-102' },
  { id: 's-31', periodId: 'P7', className: 'Class IX-B', subject: 'Physical Ed.', teacherId: 'T0007', teacherName: 'Tr. Amandeep Singh', room: 'Ground' },
  { id: 's-32', periodId: 'P8', className: 'Class IX-B', subject: 'Ethics & Values', teacherId: 'T0004', teacherName: 'Tr. Manjit Singh', room: 'R-102' }
];

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 1,
    teacherId: 'T0002',
    teacherName: 'Tr. Harpreet Singh',
    startDate: '2026-08-28',
    endDate: '2026-08-28',
    leaveType: 'Sick Leave',
    reason: 'Medical checkup and recovery',
    status: 'Pending',
    createdAt: '2026-08-27 08:30 AM'
  },
  {
    id: 2,
    teacherId: 'T0006',
    teacherName: 'Tr. Rajwinder Kaur',
    startDate: '2026-08-25',
    endDate: '2026-08-26',
    leaveType: 'Casual Leave',
    reason: 'Family wedding event in Amritsar',
    status: 'Approved',
    createdAt: '2026-08-24 10:15 AM',
    comments: 'Approved by Vice Principal'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  { id: 'ST-101', rollNo: '1001', name: 'Gurshaan Singh', className: 'Class X-A', section: 'A', gender: 'Male', guardianName: 'S. Balwinder Singh', contactNumber: '+91 98765 43210', status: 'Present' },
  { id: 'ST-102', rollNo: '1002', name: 'Jasleen Kaur', className: 'Class X-A', section: 'A', gender: 'Female', guardianName: 'Dr. Paramjit Singh', contactNumber: '+91 98765 43211', status: 'Present' },
  { id: 'ST-103', rollNo: '1003', name: 'Manavjot Singh', className: 'Class X-A', section: 'A', gender: 'Male', guardianName: 'S. Sukhdev Singh', contactNumber: '+91 98765 43212', status: 'Present' },
  { id: 'ST-104', rollNo: '1004', name: 'Navreet Kaur', className: 'Class X-A', section: 'A', gender: 'Female', guardianName: 'S. Harbhajan Singh', contactNumber: '+91 98765 43213', status: 'Late' },
  { id: 'ST-105', rollNo: '1005', name: 'Taranpreet Singh', className: 'Class X-A', section: 'A', gender: 'Male', guardianName: 'S. Jagdish Singh', contactNumber: '+91 98765 43214', status: 'Absent' },
  { id: 'ST-106', rollNo: '1006', name: 'Amritpal Kaur', className: 'Class X-A', section: 'A', gender: 'Female', guardianName: 'S. Gurmit Singh', contactNumber: '+91 98765 43215', status: 'Present' },
  { id: 'ST-107', rollNo: '1007', name: 'Fatehveer Singh', className: 'Class X-A', section: 'A', gender: 'Male', guardianName: 'S. Gurcharan Singh', contactNumber: '+91 98765 43216', status: 'Present' },
  { id: 'ST-108', rollNo: '1008', name: 'Harleen Kaur', className: 'Class X-A', section: 'A', gender: 'Female', guardianName: 'S. Manmohan Singh', contactNumber: '+91 98765 43217', status: 'Present' },

  // Class X-B
  { id: 'ST-201', rollNo: '2001', name: 'Dilpreet Singh', className: 'Class X-B', section: 'B', gender: 'Male', guardianName: 'S. Mohinder Singh', contactNumber: '+91 98765 43220', status: 'Present' },
  { id: 'ST-202', rollNo: '2002', name: 'Bhavneet Kaur', className: 'Class X-B', section: 'B', gender: 'Female', guardianName: 'S. Ravinder Singh', contactNumber: '+91 98765 43221', status: 'Present' },
  { id: 'ST-203', rollNo: '2003', name: 'Simarjit Singh', className: 'Class X-B', section: 'B', gender: 'Male', guardianName: 'S. Avtar Singh', contactNumber: '+91 98765 43222', status: 'Present' },
  { id: 'ST-204', rollNo: '2004', name: 'Prabhjot Kaur', className: 'Class X-B', section: 'B', gender: 'Female', guardianName: 'S. Jaswant Singh', contactNumber: '+91 98765 43223', status: 'Absent' },

  // Class IX-A
  { id: 'ST-301', rollNo: '3001', name: 'Ekampreet Singh', className: 'Class IX-A', section: 'A', gender: 'Male', guardianName: 'S. Gurpal Singh', contactNumber: '+91 98765 43230', status: 'Present' },
  { id: 'ST-302', rollNo: '3002', name: 'Kiranpreet Kaur', className: 'Class IX-A', section: 'A', gender: 'Female', guardianName: 'S. Kulwant Singh', contactNumber: '+91 98765 43231', status: 'Present' },
  { id: 'ST-303', rollNo: '3003', name: 'Angad Singh', className: 'Class IX-A', section: 'A', gender: 'Male', guardianName: 'S. Amarjit Singh', contactNumber: '+91 98765 43232', status: 'Present' }
];

export const INITIAL_SYNC_LOGS: SyncLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-27 08:00:12 AM',
    type: 'AUTOMATIC',
    dataset: 'Faculty Master & Timetable',
    status: 'SUCCESS',
    recordsAffected: 10,
    details: 'Synced 10 faculty records with Akal Academy Central Google Sheet'
  },
  {
    id: 'log-2',
    timestamp: '2026-08-26 05:45:00 PM',
    type: 'UPLOAD',
    dataset: 'Daily Staff Attendance',
    status: 'SUCCESS',
    recordsAffected: 8,
    details: 'Uploaded evening attendance ledger to Baru_Sahib_2026_Q3.xlsx'
  }
];

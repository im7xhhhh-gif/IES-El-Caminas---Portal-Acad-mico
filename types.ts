
export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  TEACHER = 'teacher'
}

export type MessageStatus = 'sent' | 'read' | 'replied';

export interface Message {
  id: string;
  studentId: string;
  studentName: string;
  teacherName: string; // The specific teacher this is for
  subjectId: string;
  subjectName: string;
  title: string; // Asunto
  body: string; // Mensaje
  response?: string; // Respuesta
  status: MessageStatus;
  sentAt: string; // ISO Date
  repliedAt?: string; // ISO Date
}

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string; // Optional because we might sanitize it out in UI
  role: UserRole;
  // Academic Data
  academicYear?: string;
  level?: string;
  cycle?: string;
  group?: string;
}

export interface Subject {
  id: string;
  name: string;
  teacherName: string;
}

export interface Grade {
  studentId: string;
  subjectId: string;
  semester1?: number; // 0-10, undefined if not graded
  semester2?: number; // 0-10, undefined if not graded
}

export interface Attendance {
  studentId: string;
  subjectId: string;
  absences: number; // Number of hours missed
  justified?: number; // Subset of absences that are justified
}

export interface StudentWithData extends User {
  grades: Grade[];
  attendance: Attendance[];
}

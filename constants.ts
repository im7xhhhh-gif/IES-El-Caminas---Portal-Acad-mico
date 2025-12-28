
import { User, UserRole, Subject, Grade, Attendance, Message } from './types';

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub1', name: 'Sistemas Informáticos', teacherName: 'Ana García' },
  { id: 'sub2', name: 'Bases de Datos', teacherName: 'Carlos Rodríguez' },
  { id: 'sub3', name: 'Programación', teacherName: 'Laura Martínez' },
  { id: 'sub4', name: 'Lenguajes de Marcas', teacherName: 'David López' },
  { id: 'sub5', name: 'Entornos de Desarrollo', teacherName: 'Elena Sánchez' },
  { id: 'sub6', name: 'IPE I', teacherName: 'Miguel Fernández' },
  { id: 'sub7', name: 'Inglés Profesional', teacherName: 'Sarah Smith' },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'admin1',
    name: 'Administrador Principal',
    username: 'admin',
    password: 'admin123',
    role: UserRole.ADMIN,
  },
  {
    id: 'teacher1',
    name: 'Ana García',
    username: 'ana.garcia',
    password: 'ana123',
    role: UserRole.TEACHER,
  },
  {
    id: '2984619',
    name: 'Imad El Ghoufairi Khouadri',
    username: '2984619',
    password: 'elgh2305',
    role: UserRole.STUDENT,
    academicYear: '2025-2026',
    level: '1º',
    cycle: 'Desarrollo de Aplicaciones Multiplataforma',
    group: '1º Desarrollo de Aplicaciones Multiplataforma'
  },
  {
    id: '1209362',
    name: 'Walid Taibi El Ghoufairi',
    username: '1209362',
    password: 'elgh2810',
    role: UserRole.STUDENT,
    academicYear: '2025-2026',
    level: '1º',
    cycle: 'Desarrollo de Aplicaciones Multiplataforma',
    group: '1º Desarrollo de Aplicaciones Multiplataforma'
  },
];

// Updated grades: 
// 1. No semester2 notes.
// 2. English: Imad (10), Walid (9).
// 3. Others: Random between 6.0 and 9.7.
export const INITIAL_GRADES: Grade[] = [
  // --- IMAD (2984619) ---
  { studentId: '2984619', subjectId: 'sub1', semester1: 8.7 }, // Sistemas
  { studentId: '2984619', subjectId: 'sub2', semester1: 7.2 }, // Bases
  { studentId: '2984619', subjectId: 'sub3', semester1: 9.4 }, // Programación
  { studentId: '2984619', subjectId: 'sub4', semester1: 6.9 }, // Marcas
  { studentId: '2984619', subjectId: 'sub5', semester1: 8.1 }, // Entornos
  { studentId: '2984619', subjectId: 'sub6', semester1: 7.5 }, // IPE
  { studentId: '2984619', subjectId: 'sub7', semester1: 10.0 }, // Inglés (Requested 10)

  // --- WALID (1209362) ---
  { studentId: '1209362', subjectId: 'sub1', semester1: 6.2 }, // Sistemas
  { studentId: '1209362', subjectId: 'sub2', semester1: 7.9 }, // Bases
  { studentId: '1209362', subjectId: 'sub3', semester1: 8.5 }, // Programación
  { studentId: '1209362', subjectId: 'sub4', semester1: 9.6 }, // Marcas
  { studentId: '1209362', subjectId: 'sub5', semester1: 6.8 }, // Entornos
  { studentId: '1209362', subjectId: 'sub6', semester1: 7.3 }, // IPE
  { studentId: '1209362', subjectId: 'sub7', semester1: 9.0 }, // Inglés (Requested 9)
];

// Initial Attendance
// Imad: 3 hours total.
// Walid: 13 hours total.
export const INITIAL_ATTENDANCE: Attendance[] = [
  { studentId: '2984619', subjectId: 'sub1', absences: 3 }, // Imad Total: 3
  
  { studentId: '1209362', subjectId: 'sub2', absences: 8 }, // Walid Part 1
  { studentId: '1209362', subjectId: 'sub5', absences: 5 }, // Walid Part 2 (Total 13)
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg1',
    studentId: '2984619',
    studentName: 'Imad El Ghoufairi Khouadri',
    teacherName: 'Ana García',
    subjectId: 'sub1',
    subjectName: 'Sistemas Informáticos',
    title: 'Duda sobre la práctica 3',
    body: 'Buenos días profesora, tengo una duda sobre el ejercicio 2 de la práctica de Linux. ¿Podría explicarme si debemos usar permisos octales?',
    status: 'replied',
    sentAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    response: 'Hola Imad. Sí, es preferible que uséis la notación octal para este ejercicio. Un saludo.',
    repliedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'msg2',
    studentId: '1209362',
    studentName: 'Walid Taibi El Ghoufairi',
    teacherName: 'Laura Martínez',
    subjectId: 'sub3',
    subjectName: 'Programación',
    title: 'Falta de asistencia justificada',
    body: 'Hola Laura, mañana no podré asistir a clase por cita médica. Le llevaré el justificante el lunes.',
    status: 'sent',
    sentAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  }
];

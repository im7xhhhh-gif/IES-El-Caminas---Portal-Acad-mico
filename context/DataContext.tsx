
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Subject, Grade, Attendance, UserRole, Message } from '../types';
import { INITIAL_USERS, INITIAL_SUBJECTS, INITIAL_GRADES, INITIAL_ATTENDANCE, INITIAL_MESSAGES } from '../constants';

interface DataContextType {
  users: User[];
  subjects: Subject[];
  grades: Grade[];
  attendance: Attendance[];
  messages: Message[];
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  updateStudentId: (oldId: string, newId: string) => void;
  deleteUser: (id: string) => void;
  updateGrade: (studentId: string, subjectId: string, semester: 1 | 2, score: number) => void;
  updateAttendance: (studentId: string, subjectId: string, absences: number) => void;
  getStudentData: (studentId: string) => { grades: Grade[], attendance: Attendance[] };
  sendMessage: (msg: Omit<Message, 'id' | 'status' | 'sentAt'>) => void;
  replyMessage: (messageId: string, response: string) => void;
  markAsRead: (messageId: string) => void;
  deleteMessage: (messageId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from local storage or fall back to constants
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem('ies_users');
    return stored ? JSON.parse(stored) : INITIAL_USERS;
  });

  const [subjects] = useState<Subject[]>(INITIAL_SUBJECTS); // Static for this demo

  const [grades, setGrades] = useState<Grade[]>(() => {
    const stored = localStorage.getItem('ies_grades');
    return stored ? JSON.parse(stored) : INITIAL_GRADES;
  });

  const [attendance, setAttendance] = useState<Attendance[]>(() => {
    const stored = localStorage.getItem('ies_attendance');
    return stored ? JSON.parse(stored) : INITIAL_ATTENDANCE;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = localStorage.getItem('ies_messages');
    return stored ? JSON.parse(stored) : INITIAL_MESSAGES;
  });

  // Persist to local storage
  useEffect(() => { localStorage.setItem('ies_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('ies_grades', JSON.stringify(grades)); }, [grades]);
  useEffect(() => { localStorage.setItem('ies_attendance', JSON.stringify(attendance)); }, [attendance]);
  useEffect(() => { localStorage.setItem('ies_messages', JSON.stringify(messages)); }, [messages]);

  const addUser = (user: User) => {
    setUsers([...users, user]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // New function to handle ID changes securely across all data tables
  const updateStudentId = (oldId: string, newId: string) => {
    if (oldId === newId) return;
    
    // 1. Update User List
    setUsers(prev => prev.map(u => u.id === oldId ? { ...u, id: newId } : u));
    
    // 2. Update Grades
    setGrades(prev => prev.map(g => g.studentId === oldId ? { ...g, studentId: newId } : g));
    
    // 3. Update Attendance
    setAttendance(prev => prev.map(a => a.studentId === oldId ? { ...a, studentId: newId } : a));
    
    // 4. Update Messages
    setMessages(prev => prev.map(m => m.studentId === oldId ? { ...m, studentId: newId } : m));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    // Also cleanup grades/attendance for this user
    setGrades(grades.filter(g => g.studentId !== id));
    setAttendance(attendance.filter(a => a.studentId !== id));
    setMessages(messages.filter(m => m.studentId !== id));
  };

  const updateGrade = (studentId: string, subjectId: string, semester: 1 | 2, score: number) => {
    setGrades(prev => {
      const existing = prev.find(g => g.studentId === studentId && g.subjectId === subjectId);
      if (existing) {
        return prev.map(g => {
            if (g.studentId === studentId && g.subjectId === subjectId) {
                return semester === 1 ? { ...g, semester1: score } : { ...g, semester2: score };
            }
            return g;
        });
      }
      // Create new grade entry
      const newGrade: Grade = { studentId, subjectId };
      if (semester === 1) newGrade.semester1 = score;
      else newGrade.semester2 = score;
      
      return [...prev, newGrade];
    });
  };

  const updateAttendance = (studentId: string, subjectId: string, absences: number) => {
    setAttendance(prev => {
      const existing = prev.find(a => a.studentId === studentId && a.subjectId === subjectId);
      if (existing) {
        return prev.map(a => (a.studentId === studentId && a.subjectId === subjectId) ? { ...a, absences } : a);
      }
      return [...prev, { studentId, subjectId, absences }];
    });
  };

  const getStudentData = (studentId: string) => {
    return {
      grades: grades.filter(g => g.studentId === studentId),
      attendance: attendance.filter(a => a.studentId === studentId)
    };
  };

  // Messaging Logic
  const sendMessage = (msgData: Omit<Message, 'id' | 'status' | 'sentAt'>) => {
    const newMessage: Message = {
      ...msgData,
      id: Date.now().toString(),
      status: 'sent',
      sentAt: new Date().toISOString()
    };
    setMessages([newMessage, ...messages]);
  };

  const replyMessage = (messageId: string, response: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          response,
          status: 'replied',
          repliedAt: new Date().toISOString()
        };
      }
      return msg;
    }));
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.status === 'sent') {
        return { ...msg, status: 'read' };
      }
      return msg;
    }));
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
  };

  return (
    <DataContext.Provider value={{ 
      users, subjects, grades, attendance, messages,
      addUser, updateUser, updateStudentId, deleteUser, 
      updateGrade, updateAttendance, getStudentData,
      sendMessage, replyMessage, markAsRead, deleteMessage
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};

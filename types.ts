export type Language = 'en' | 'mr';

export interface Translation {
  [key: string]: {
    en: string;
    mr: string;
  };
}

export enum UserRole {
  STUDENT = 'STUDENT',
  LIBRARY_ADMIN = 'LIBRARY_ADMIN',
  GUEST = 'GUEST'
}

export interface UserBase {
  id: string;
  email: string;
  password?: string; // In a real app, this would be hashed
  role: UserRole;
  name: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  coverUrl?: string;
  status: 'AVAILABLE' | 'ISSUED';
  dueDate?: string;
  issuedTo?: string; // Student ID
  issuedToName?: string; // Helper for display
  type: 'PHYSICAL' | 'DIGITAL' | 'NEWSPAPER';
  link?: string; // For digital
  libraryId?: string; // To know which library owns this book
}

export interface Transaction {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  libraryId: string;
  issueDate: string;
  returnDate?: string;
  status: 'ACTIVE' | 'RETURNED';
}

export interface Library extends UserBase {
  description: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  imageUrl: string;
  enrolledStudents: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'ALERT' | 'INFO' | 'DEADLINE';
}

export interface Student extends UserBase {
  enrolledLibraryIds: string[];
}
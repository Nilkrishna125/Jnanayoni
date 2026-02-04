import { createContext, useContext, useState, ReactNode } from 'react';
import { Book, Library, Student, UserRole, Transaction } from '../types';
import { MOCK_BOOKS, MOCK_LIBRARIES, MOCK_STUDENT } from '../constants';

interface DataContextType {
  // Auth
  currentUser: (Student | Library) | null;
  userRole: UserRole | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  logout: () => void;

  // Data
  books: Book[];
  addBook: (book: Book) => void;
  updateBookStatus: (bookId: string, status: 'AVAILABLE' | 'ISSUED', studentId?: string, studentName?: string, dueDate?: string) => void;
  
  libraries: Library[];
  
  // History
  transactions: Transaction[];
  getLibraryHistory: (libraryId: string) => Transaction[];
  getStudentHistory: (studentId: string) => Transaction[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // --- MOCK DATABASE STATE ---
  
  // Pre-populate with a demo student and admin
  const [students, setStudents] = useState<Student[]>([
    { ...MOCK_STUDENT, email: 'student@demo.com', password: 'password', role: UserRole.STUDENT }
  ]);
  
  // Mock libraries are treated as "Admin Users"
  const [libraries, setLibraries] = useState<Library[]>(MOCK_LIBRARIES.map(lib => ({
    ...lib,
    email: 'admin@library.com', // Demo email for the first library
    password: 'password',
    role: UserRole.LIBRARY_ADMIN
  })));

  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS.map(b => ({
    ...b, 
    libraryId: 'lib_1',
    // Sync mock issued status with student name for search display
    issuedToName: b.issuedTo === 'std_1' ? 'Rahul Deshmukh' : undefined
  })));

  const [transactions, setTransactions] = useState<Transaction[]>([
    // Mock past transaction
    {
      id: 'tx_1',
      bookId: 'bk_2',
      bookTitle: 'Introduction to Algorithms',
      studentId: 'std_1',
      studentName: 'Rahul Deshmukh',
      libraryId: 'lib_1',
      issueDate: '2023-11-01',
      status: 'ACTIVE'
    }
  ]);

  const [currentUser, setCurrentUser] = useState<(Student | Library) | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // --- AUTH METHODS ---

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (role === UserRole.STUDENT) {
      const user = students.find(s => s.email === email && s.password === password);
      if (user) {
        setCurrentUser(user);
        setUserRole(UserRole.STUDENT);
        return true;
      }
    } else {
      const user = libraries.find(l => l.email === email && l.password === password);
      if (user) {
        setCurrentUser(user);
        setUserRole(UserRole.LIBRARY_ADMIN);
        return true;
      }
    }
    return false;
  };

  const register = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if email exists
    if (role === UserRole.STUDENT) {
      if (students.find(s => s.email === email)) return false;
      const newUser: Student = {
        id: `std_${Date.now()}`,
        name,
        email,
        password,
        role: UserRole.STUDENT,
        enrolledLibraryIds: ['lib_1'] // Auto enroll in demo library
      };
      setStudents(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setUserRole(UserRole.STUDENT);
    } else {
      if (libraries.find(l => l.email === email)) return false;
      const newLib: Library = {
        id: `lib_${Date.now()}`,
        name,
        email,
        password,
        role: UserRole.LIBRARY_ADMIN,
        description: 'New Library',
        address: 'Update address in profile',
        contactPhone: '',
        contactEmail: email, // Fix: Add contactEmail
        imageUrl: 'https://picsum.photos/800/400',
        enrolledStudents: []
      };
      setLibraries(prev => [...prev, newLib]);
      setCurrentUser(newLib);
      setUserRole(UserRole.LIBRARY_ADMIN);
    }
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole(null);
  };

  // --- DATA METHODS ---

  const addBook = (book: Book) => {
    setBooks(prev => [...prev, book]);
  };

  const updateBookStatus = (bookId: string, status: 'AVAILABLE' | 'ISSUED', studentId?: string, studentName?: string, dueDate?: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    // Log Transaction
    if (status === 'ISSUED' && studentId && studentName && book.libraryId) {
       const newTx: Transaction = {
         id: `tx_${Date.now()}`,
         bookId: book.id,
         bookTitle: book.title,
         studentId: studentId,
         studentName: studentName,
         libraryId: book.libraryId,
         issueDate: new Date().toISOString().split('T')[0],
         status: 'ACTIVE'
       };
       setTransactions(prev => [...prev, newTx]);
    } else if (status === 'AVAILABLE') {
       // Close active transaction
       setTransactions(prev => prev.map(tx => 
          (tx.bookId === bookId && tx.status === 'ACTIVE') 
          ? { ...tx, status: 'RETURNED', returnDate: new Date().toISOString().split('T')[0] }
          : tx
       ));
    }

    setBooks(prev => prev.map(b => 
      b.id === bookId 
        ? { 
            ...b, 
            status, 
            issuedTo: status === 'AVAILABLE' ? undefined : studentId, 
            issuedToName: status === 'AVAILABLE' ? undefined : studentName,
            dueDate: status === 'AVAILABLE' ? undefined : dueDate 
          } 
        : b
    ));
  };

  const getLibraryHistory = (libraryId: string) => {
    return transactions.filter(t => t.libraryId === libraryId);
  };

  const getStudentHistory = (studentId: string) => {
    return transactions.filter(t => t.studentId === studentId);
  };

  return (
    <DataContext.Provider value={{ 
      currentUser, 
      userRole, 
      login, 
      register, 
      logout,
      books, 
      addBook, 
      updateBookStatus, 
      libraries,
      transactions,
      getLibraryHistory,
      getStudentHistory
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
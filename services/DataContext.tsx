import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, auth } from '../firebase'; 
import { collection, onSnapshot, addDoc, doc, updateDoc, query } from 'firebase/firestore';import { signOut, onAuthStateChanged } from 'firebase/auth';
import { Book, Student, UserRole } from '../types'; // Import your existing types

// define the shape of your context
interface DataContextType {
  books: Book[];
  students: Student[];
  loading: boolean;
  currentUser: any; // We use 'any' to allow both Firebase User and your App's User types to mix
  userRole: UserRole | null; // Strictly typed to match App.tsx
  logout: () => Promise<void>;
  addBook: (book: any) => Promise<void>;
  // Updated to match the 5 arguments your LibraryPortal passes
  updateBookStatus: (bookId: string, status: string, userId?: string, userName?: string, dueDate?: string) => Promise<void>;
  getLibraryHistory: (libraryId?: string) => any[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  // We initialize currentUser as 'any' to prevent "Property 'id' does not exist" errors
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. LISTEN TO AUTH STATE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // ADAPTER: Convert Firebase User to App User (uid -> id)
        const appUser = {
          ...user,
          id: user.uid, // This fixes the "property id does not exist" error
          name: user.displayName || user.email?.split('@')[0], // Fallback for name
          role: UserRole.STUDENT // Default role
        };

        setCurrentUser(appUser);

        // Simple Role Logic (You can make this more complex later)
        // If email contains 'admin', treat as Library Admin
        if (user.email?.includes('admin')) {
          setUserRole(UserRole.LIBRARY_ADMIN);
        } else {
          setUserRole(UserRole.STUDENT);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. LISTEN TO BOOKS
  useEffect(() => {
    const q = query(collection(db, "books")); // Removed orderBy to prevent index errors for now
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any;
      setBooks(booksData);
    });
    return () => unsubscribe();
  }, []);

  // 3. ACTIONS
  const logout = async () => {
    await signOut(auth);
    setUserRole(null);
  };

  const addBook = async (newBook: any) => {
    await addDoc(collection(db, "books"), {
      ...newBook,
      createdAt: new Date(),
      status: 'Available'
    });
  };

  // ADAPTER: Accepts all 5 arguments to stop the "Expected 2 got 5" error
  const updateBookStatus = async (bookId: string, status: string, userId?: string, userName?: string, dueDate?: string) => {
    const bookRef = doc(db, "books", bookId);
    
    // Create the update object
    const updateData: any = { status: status };
    
    // If issuing, add the user details
    if (status === 'ISSUED' && userId) {
      updateData.issuedTo = userId;
      updateData.issuedToName = userName;
      updateData.dueDate = dueDate;
      updateData.issueDate = new Date().toISOString();
    } 
    // If returning, clear the user details
    else if (status === 'AVAILABLE') {
      updateData.issuedTo = null;
      updateData.issuedToName = null;
      updateData.dueDate = null;
    }

    await updateDoc(bookRef, updateData);
    
    // Optional: Log this transaction to a 'history' collection here
  };

  const getLibraryHistory = (_libraryId?: string) => {
    // Return empty array for now to pass build
    return []; 
  };

  return (
    <DataContext.Provider value={{ 
      books, 
      students: [], 
      loading, 
      currentUser, 
      userRole, 
      logout, 
      addBook, 
      updateBookStatus,
      getLibraryHistory 
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
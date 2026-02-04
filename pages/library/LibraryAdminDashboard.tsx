import React, { useState } from 'react';
import { useLanguage } from '../../services/LanguageContext';
import { useData } from '../../services/DataContext';
import { Upload, Users, Book as BookIcon, AlertCircle, Plus, Search, Image as ImageIcon, History } from 'lucide-react';
import { Book, Library, Transaction } from '../../types';

export const LibraryAdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { books, addBook, currentUser, getLibraryHistory } = useData();
  const [activeTab, setActiveTab] = useState<'RECORDS' | 'BOOKS' | 'STUDENTS' | 'UPLOAD' | 'PROFILE'>('RECORDS');

  // Helper to ensure type safety
  const currentLibrary = currentUser as Library;
  
  // Filter books for this logged in library
  const myLibraryBooks = books.filter(b => b.libraryId === currentLibrary?.id || (!b.libraryId && currentLibrary?.id === 'lib_1'));
  const issuedBooks = myLibraryBooks.filter(b => b.status === 'ISSUED');
  const libraryHistory = currentLibrary ? getLibraryHistory(currentLibrary.id) : [];

  // Book Search State
  const [bookSearchTerm, setBookSearchTerm] = useState('');

  // Add Book Form State
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: '',
    author: '',
    isbn: '',
    type: 'PHYSICAL',
    coverUrl: ''
  });
  const [addSuccess, setAddSuccess] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBook(prev => ({ ...prev, coverUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author || !newBook.isbn) return;

    const book: Book = {
      id: `bk_${Date.now()}`,
      title: newBook.title,
      author: newBook.author,
      isbn: newBook.isbn,
      status: 'AVAILABLE',
      type: 'PHYSICAL',
      coverUrl: newBook.coverUrl || 'https://picsum.photos/200/300', 
      libraryId: currentLibrary?.id
    };

    addBook(book);
    setNewBook({ title: '', author: '', isbn: '', type: 'PHYSICAL', coverUrl: '' });
    setAddSuccess('Book added successfully!');
    setTimeout(() => setAddSuccess(''), 3000);
  };

  // Student Search
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  
  // Group history by student for the Students Tab
  const getUniqueStudents = () => {
    const studentsMap = new Map<string, { id: string, name: string, history: Transaction[] }>();
    libraryHistory.forEach(tx => {
       if (!studentsMap.has(tx.studentId)) {
         studentsMap.set(tx.studentId, { id: tx.studentId, name: tx.studentName, history: [] });
       }
       studentsMap.get(tx.studentId)!.history.push(tx);
    });
    return Array.from(studentsMap.values());
  };

  const filteredStudents = getUniqueStudents().filter(s => 
    s.name.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  // Filter books for display
  const filteredBooks = myLibraryBooks.filter(b => 
    b.title.toLowerCase().includes(bookSearchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(bookSearchTerm.toLowerCase()) ||
    (b.issuedToName && b.issuedToName.toLowerCase().includes(bookSearchTerm.toLowerCase()))
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'RECORDS':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                 <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
                   <BookIcon className="w-6 h-6" />
                 </div>
                 <div>
                   <p className="text-sm text-gray-500">Currently Issued</p>
                   <p className="text-2xl font-bold text-gray-900">{issuedBooks.length}</p>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                 <div className="p-3 bg-red-100 text-red-600 rounded-lg mr-4">
                   <AlertCircle className="w-6 h-6" />
                 </div>
                 <div>
                   <p className="text-sm text-gray-500">Total Transactions</p>
                   <p className="text-2xl font-bold text-gray-900">{libraryHistory.length}</p>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                 <div className="p-3 bg-green-100 text-green-600 rounded-lg mr-4">
                   <Users className="w-6 h-6" />
                 </div>
                 <div>
                   <p className="text-sm text-gray-500">Unique Readers</p>
                   <p className="text-2xl font-bold text-gray-900">{getUniqueStudents().length}</p>
                 </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-800">{t('issuedRecords')}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('title')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('studentName')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dueDate')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {issuedBooks.length > 0 ? issuedBooks.map(book => (
                      <tr key={book.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.issuedToName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.dueDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Issued
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No books currently issued.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'BOOKS':
        return (
          <div className="space-y-6">
             {/* Add Book Form */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Plus className="w-5 h-5 mr-2" /> Add New Book
                </h2>
                {addSuccess && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">{addSuccess}</div>}
                <form onSubmit={handleAddBook}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Book Title</label>
                      <input 
                        type="text" 
                        className="w-full border p-2 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500" 
                        placeholder="e.g. Clean Code"
                        value={newBook.title}
                        onChange={e => setNewBook({...newBook, title: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Author</label>
                      <input 
                        type="text" 
                        className="w-full border p-2 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500" 
                        placeholder="e.g. Robert Martin"
                        value={newBook.author}
                        onChange={e => setNewBook({...newBook, author: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">ISBN / ID</label>
                      <input 
                        type="text" 
                        className="w-full border p-2 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500" 
                        placeholder="e.g. 978-0132350884"
                        value={newBook.isbn}
                        onChange={e => setNewBook({...newBook, isbn: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Image Upload Row */}
                  <div className="mb-4">
                     <label className="block text-xs font-medium text-gray-700 mb-1">Cover Image</label>
                     <div className="flex items-center space-x-4">
                        <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                           <ImageIcon className="w-4 h-4 mr-2" />
                           Upload Cover
                           <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                        {newBook.coverUrl && (
                          <div className="flex items-center text-sm text-green-600">
                             <img src={newBook.coverUrl} alt="Preview" className="h-10 w-8 object-cover rounded border mr-2" />
                             Image Selected
                          </div>
                        )}
                     </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" className="w-full md:w-auto bg-indigo-600 text-white px-6 py-2 rounded-md text-sm hover:bg-indigo-700 transition">
                      Add to Inventory
                    </button>
                  </div>
                </form>
             </div>

             {/* Book List */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                  <h3 className="font-semibold text-gray-800">Library Inventory ({myLibraryBooks.length})</h3>
                  <div className="relative w-full md:w-64">
                    <input 
                      type="text" 
                      placeholder="Search title, author, or student..." 
                      className="w-full pl-8 pr-2 py-1.5 text-sm border rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
                      value={bookSearchTerm}
                      onChange={(e) => setBookSearchTerm(e.target.value)}
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-2 top-2.5" />
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                   <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50 sticky top-0">
                       <tr>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ISBN</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holder Info</th>
                       </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                       {filteredBooks.map(book => (
                         <tr key={book.id}>
                           <td className="px-6 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-8 flex-shrink-0 bg-gray-200 mr-3 overflow-hidden rounded">
                                  {book.coverUrl && <img src={book.coverUrl} alt="" className="h-full w-full object-cover" />}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{book.title}</div>
                                  <div className="text-xs text-gray-500">{book.author}</div>
                                </div>
                              </div>
                           </td>
                           <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{book.isbn}</td>
                           <td className="px-6 py-3 whitespace-nowrap text-sm">
                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${book.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                               {book.status}
                             </span>
                           </td>
                           <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                             {book.status === 'ISSUED' ? (
                               <span className="font-medium text-indigo-600 flex items-center">
                                 <Users className="w-3 h-3 mr-1" />
                                 {book.issuedToName || 'Unknown Student'}
                               </span>
                             ) : (
                               <span className="text-gray-400">-</span>
                             )}
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
             </div>
          </div>
        );
      
      case 'STUDENTS':
        return (
           <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Student History & Records</h3>
                  <div className="relative w-64">
                    <input 
                      type="text" 
                      placeholder="Search student name..." 
                      className="w-full pl-8 pr-2 py-1.5 text-sm border rounded-md" 
                      value={studentSearchTerm}
                      onChange={(e) => setStudentSearchTerm(e.target.value)}
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-2 top-2.5" />
                  </div>
                </div>
                
                {filteredStudents.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No student records found.</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredStudents.map(student => (
                      <div key={student.id} className="p-6 hover:bg-gray-50 transition">
                         <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center">
                             <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                               {student.name.charAt(0)}
                             </div>
                             <div>
                               <h4 className="text-sm font-bold text-gray-900">{student.name}</h4>
                               <p className="text-xs text-gray-500">ID: {student.id}</p>
                             </div>
                           </div>
                           <div className="text-right">
                              <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-600">
                                Total Activity: {student.history.length}
                              </span>
                           </div>
                         </div>
                         
                         {/* History Mini Table */}
                         <div className="ml-13 pl-13 border-l-2 border-gray-100 ml-5 pl-4">
                           <h5 className="text-xs font-semibold text-gray-500 mb-2 flex items-center">
                             <History className="w-3 h-3 mr-1" /> Transaction History
                           </h5>
                           <div className="overflow-x-auto">
                            <table className="min-w-full text-xs text-left">
                              <thead>
                                <tr className="text-gray-400 border-b border-gray-100">
                                  <th className="py-1">Book</th>
                                  <th className="py-1">Issued On</th>
                                  <th className="py-1">Status</th>
                                  <th className="py-1">Returned On</th>
                                </tr>
                              </thead>
                              <tbody>
                                {student.history.map(tx => (
                                  <tr key={tx.id} className="border-b border-gray-50 last:border-0">
                                    <td className="py-2 font-medium text-gray-700">{tx.bookTitle}</td>
                                    <td className="py-2 text-gray-500">{tx.issueDate}</td>
                                    <td className="py-2">
                                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${tx.status === 'ACTIVE' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                        {tx.status}
                                      </span>
                                    </td>
                                    <td className="py-2 text-gray-500">{tx.returnDate || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                           </div>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
           </div>
        );

      case 'UPLOAD':
        return (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('uploadResource')}</h2>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="type" className="text-indigo-600" defaultChecked />
                    <span>ePaper / Newspaper</span>
                  </label>
                  <label className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="type" className="text-indigo-600" />
                    <span>PDF Book</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('title')}</label>
                <input type="text" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2" placeholder="e.g., Daily Times - Oct 27" />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
                 <Upload className="mx-auto h-12 w-12 text-gray-400" />
                 <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop PDF file</p>
                 <p className="text-xs text-gray-500 mt-1">PDF up to 10MB</p>
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="notify" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="notify" className="ml-2 block text-sm text-gray-900">
                  Send notification to enrolled students
                </label>
              </div>

              <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {t('upload')}
              </button>
            </form>
          </div>
        );

      case 'PROFILE':
        return (
           <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
             <h2 className="text-xl font-bold mb-6">Library Profile Settings</h2>
             <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">Library Name</label>
                  <div className="mt-1">
                     <input type="text" defaultValue={currentLibrary?.name} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2" />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">About Section</label>
                  <div className="mt-1">
                    <textarea rows={4} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2" defaultValue={currentLibrary?.description}></textarea>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                  <input type="email" defaultValue={currentLibrary?.email} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input type="text" defaultValue={currentLibrary?.contactPhone} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" />
                </div>
                
                <div className="sm:col-span-6">
                   <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save Changes</button>
                </div>
             </div>
           </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Library Administration</h1>
           <p className="text-sm text-gray-500 mt-1">{currentLibrary?.name}</p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0 overflow-x-auto pb-2 md:pb-0">
           {['RECORDS', 'BOOKS', 'STUDENTS', 'UPLOAD', 'PROFILE'].map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
             >
               {tab.charAt(0) + tab.slice(1).toLowerCase()}
             </button>
           ))}
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
};
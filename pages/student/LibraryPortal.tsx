import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../../services/LanguageContext';
import { useData } from '../../services/DataContext';
import { MOCK_LIBRARIES } from '../../constants';
import { Book } from '../../types';
import { QrCode, BookOpen, FileText, History, Info, Mail, Phone, Search } from 'lucide-react';
import { QRScanner } from '../../components/QRScanner';

type Tab = 'HOME' | 'CATALOG' | 'ISSUE' | 'MY_BOOKS' | 'DIGITAL';

export const LibraryPortal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { books, updateBookStatus, currentUser } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('HOME');
  const [scannedBook, setScannedBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const library = MOCK_LIBRARIES.find(l => l.id === id);

  if (!library) return <div className="p-8 text-center text-red-500">Library not found</div>;

  // Live data filtering for this library/user context
  const libraryBooks = books.filter(b => b.libraryId === library.id || (!b.libraryId && library.id === 'lib_1')); 
  const myIssuedBooks = libraryBooks.filter(b => b.issuedTo === currentUser?.id && b.status === 'ISSUED');
  const digitalResources = libraryBooks.filter(b => (b.type === 'DIGITAL' || b.type === 'NEWSPAPER'));
  
  // Search Filter
  const filteredBooks = libraryBooks.filter(b => 
    b.type === 'PHYSICAL' && 
    (b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     b.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleScanSuccess = (decodedText: string) => {
    // Find book in live state
    const book = books.find(b => b.id === decodedText || b.isbn === decodedText);
    
    if (book && book.status === 'AVAILABLE') {
       // Update state through context with Current User details
       updateBookStatus(
         book.id, 
         'ISSUED', 
         currentUser?.id, 
         currentUser?.name, 
         '2023-12-01' // Mock due date
       );
       
       setScannedBook({
         ...book, 
         status: 'ISSUED', 
         dueDate: '2023-12-01', 
         issuedTo: currentUser?.id
       });
    } else if (book) {
       // Show even if already issued
       setScannedBook(book);
    } else {
       // Mock for unknown book
       const mockBook: Book = { 
         id: decodedText, 
         title: 'Scanned Book Title (Mock)', 
         author: 'Unknown',
         isbn: decodedText, 
         status: 'ISSUED', 
         dueDate: '2023-12-01',
         type: 'PHYSICAL',
         libraryId: id 
       };
       setScannedBook(mockBook);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'HOME':
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Section */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg h-64 md:h-80">
              <img src={library.imageUrl} alt={library.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-2">{library.name}</h2>
                  <p className="text-lg opacity-90">{library.description}</p>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-indigo-500" />
                  {t('about')}
                </h3>
                <p className="text-gray-600">{library.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex items-center text-gray-600">
                     <Mail className="w-4 h-4 mr-2" /> {library.contactEmail}
                  </div>
                  <div className="flex items-center text-gray-600">
                     <Phone className="w-4 h-4 mr-2" /> {library.contactPhone}
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <h3 className="text-lg font-semibold text-indigo-900 mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-indigo-600">{myIssuedBooks.length}</div>
                    <div className="text-sm text-gray-500">Books Issued</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-green-600">{digitalResources.length}</div>
                    <div className="text-sm text-gray-500">Digital Resources</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'CATALOG':
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Library Catalog</h2>
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Search by title or author..." 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.length > 0 ? filteredBooks.map(book => (
                <div key={book.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                  <div className="h-40 bg-gray-200 w-full overflow-hidden">
                     {book.coverUrl ? (
                       <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-gray-400">
                         <BookOpen className="w-12 h-12" />
                       </div>
                     )}
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-bold text-gray-900 line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400 font-mono">{book.isbn}</span>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${book.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {book.status}
                      </span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No books found matching your search.
                </div>
              )}
            </div>
          </div>
        );

      case 'ISSUE':
        return (
          <div className="max-w-md mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center">{t('issueBook')}</h2>
            
            {!scannedBook ? (
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <p className="text-center text-gray-600 mb-4">
                  Point your camera at the QR code on the back of the book.
                </p>
                <QRScanner onScanSuccess={handleScanSuccess} />
              </div>
            ) : (
              <div className={`p-6 rounded-xl border text-center ${scannedBook.status === 'ISSUED' && scannedBook.issuedTo === currentUser?.id ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${scannedBook.status === 'ISSUED' && scannedBook.issuedTo === currentUser?.id ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  <BookOpen className={`w-8 h-8 ${scannedBook.status === 'ISSUED' && scannedBook.issuedTo === currentUser?.id ? 'text-green-600' : 'text-yellow-600'}`} />
                </div>
                
                {scannedBook.status === 'ISSUED' && scannedBook.issuedTo === currentUser?.id ? (
                  <>
                    <h3 className="text-xl font-bold text-green-800 mb-2">{t('bookIssued')}</h3>
                    <p className="text-green-700 mb-4">
                      <strong>{scannedBook.title}</strong> has been issued to your account.
                    </p>
                    <p className="text-sm text-green-600 mb-6">Due Date: {scannedBook.dueDate}</p>
                  </>
                ) : (
                  <>
                     <h3 className="text-xl font-bold text-yellow-800 mb-2">Book Already Issued</h3>
                     <p className="text-yellow-700 mb-4">This book is currently not available.</p>
                  </>
                )}
                
                <button 
                  onClick={() => setScannedBook(null)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Scan Another
                </button>
              </div>
            )}
          </div>
        );

      case 'MY_BOOKS':
        return (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-2xl font-bold mb-6">{t('myBooks')}</h2>
             {myIssuedBooks.length === 0 ? (
               <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                 <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                 <p className="text-gray-500">No books currently issued.</p>
               </div>
             ) : (
               <div className="grid gap-6 md:grid-cols-2">
                 {myIssuedBooks.map(book => (
                   <div key={book.id} className="bg-white flex rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                     <div className="w-24 bg-gray-200 flex-shrink-0">
                       <img src={book.coverUrl || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="Cover" />
                     </div>
                     <div className="p-4 flex-1">
                       <h4 className="font-bold text-gray-900 line-clamp-1">{book.title}</h4>
                       <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                       <div className="flex items-center text-sm text-orange-600 bg-orange-50 w-fit px-2 py-1 rounded">
                         <History className="w-3 h-3 mr-1" />
                         Due: {book.dueDate}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        );

      case 'DIGITAL':
        return (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-2xl font-bold mb-6">{t('digitalLibrary')}</h2>
             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
               {digitalResources.map(res => (
                 <div key={res.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition p-4">
                    <div className="flex items-start justify-between mb-4">
                       <div className={`p-2 rounded-lg ${res.type === 'NEWSPAPER' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                         <FileText className="w-6 h-6" />
                       </div>
                       <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                         {res.type}
                       </span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{res.title}</h4>
                    <p className="text-sm text-gray-500 mb-4">{res.author}</p>
                    <a href={res.link} className="block w-full text-center py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      View / Download
                    </a>
                 </div>
               ))}
             </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('HOME')}
          className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === 'HOME' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Info className="w-4 h-4 mr-2" />
          Home
        </button>
        <button 
          onClick={() => setActiveTab('CATALOG')}
          className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === 'CATALOG' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Search className="w-4 h-4 mr-2" />
          Catalog
        </button>
        <button 
          onClick={() => setActiveTab('ISSUE')}
          className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === 'ISSUE' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <QrCode className="w-4 h-4 mr-2" />
          Issue
        </button>
        <button 
          onClick={() => setActiveTab('MY_BOOKS')}
          className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === 'MY_BOOKS' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          My Books
        </button>
        <button 
          onClick={() => setActiveTab('DIGITAL')}
          className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === 'DIGITAL' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <FileText className="w-4 h-4 mr-2" />
          eLibrary
        </button>
      </div>

      {renderContent()}
    </div>
  );
};
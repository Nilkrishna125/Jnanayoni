import { Library, Book, Notification, Student, Translation, UserRole } from './types';

export const TRANSLATIONS: Translation = {
  welcome: { en: 'Welcome to Jñānayoni', mr: 'ज्ञानयोनी मध्ये आपले स्वागत आहे' },
  selectRole: { en: 'Select your role to continue', mr: 'पुढे जाण्यासाठी आपली भूमिका निवडा' },
  student: { en: 'Reader / Student', mr: 'वाचक / विद्यार्थी' },
  libraryAdmin: { en: 'Library Society', mr: 'ग्रंथालय संस्था' },
  selectLibrary: { en: 'Select Library', mr: 'ग्रंथालय निवडा' },
  myLibraries: { en: 'My Libraries', mr: 'माझी ग्रंथालये' },
  dashboard: { en: 'Dashboard', mr: 'डॅशबोर्ड' },
  issueBook: { en: 'Issue Book (QR)', mr: 'पुस्तक जारी करा (QR)' },
  myBooks: { en: 'My Books', mr: 'माझी पुस्तके' },
  digitalLibrary: { en: 'Digital Library', mr: 'डिजिटल ग्रंथालय' },
  notifications: { en: 'Notifications', mr: 'सूचना' },
  scanQr: { en: 'Scan QR Code', mr: 'QR कोड स्कॅन करा' },
  cameraPermission: { en: 'Camera permission required', mr: 'कॅमेरा परवानगी आवश्यक आहे' },
  simulatingScan: { en: 'Scanning...', mr: 'स्कॅन करत आहे...' },
  bookIssued: { en: 'Book Issued Successfully!', mr: 'पुस्तक यशस्वीरित्या जारी केले!' },
  about: { en: 'About', mr: 'माहिती' },
  contact: { en: 'Contact', mr: 'संपर्क' },
  uploadResource: { en: 'Upload Resource', mr: 'संसाधन अपलोड करा' },
  todaysPaper: { en: "Today's ePaper", mr: 'आजचे वर्तमानपत्र' },
  issuedRecords: { en: 'Issued Records', mr: 'जारी केलेल्या नोंदी' },
  studentName: { en: 'Student Name', mr: 'विद्यार्थ्याचे नाव' },
  dueDate: { en: 'Due Date', mr: 'अंतिम तारीख' },
  status: { en: 'Status', mr: 'स्थिती' },
  fine: { en: 'Fine', mr: 'दंड' },
  upload: { en: 'Upload', mr: 'अपलोड करा' },
  title: { en: 'Title', mr: 'शीर्षक' },
  author: { en: 'Author', mr: 'लेखक' },
  logout: { en: 'Logout', mr: 'बाहेर पडा' },
  available: { en: 'Available', mr: 'उपलब्ध' },
  issued: { en: 'Issued', mr: 'जारी केले' },
  return: { en: 'Return', mr: 'परत करा' },
};

export const MOCK_LIBRARIES: Library[] = [
  {
    id: 'lib_1',
    name: 'Saraswati Public Library',
    description: 'A historic library with a vast collection of literature and history books.',
    address: '123 Heritage Road, Pune',
    contactEmail: 'contact@saraswatilib.com',
    contactPhone: '+91 98765 43210',
    imageUrl: 'https://picsum.photos/800/400?random=1',
    enrolledStudents: ['std_1'],
    email: 'admin@saraswatilib.com',
    role: UserRole.LIBRARY_ADMIN
  },
  {
    id: 'lib_2',
    name: 'Modern Digital Archive',
    description: 'Focused on digital resources, scientific journals, and e-learning.',
    address: '45 Tech Park, Mumbai',
    contactEmail: 'info@modernarchive.org',
    contactPhone: '+91 91234 56789',
    imageUrl: 'https://picsum.photos/800/400?random=2',
    enrolledStudents: ['std_1'],
    email: 'info@modernarchive.org',
    role: UserRole.LIBRARY_ADMIN
  }
];

export const MOCK_STUDENT: Student = {
  id: 'std_1',
  name: 'Rahul Deshmukh',
  enrolledLibraryIds: ['lib_1', 'lib_2'],
  email: 'rahul@example.com',
  role: UserRole.STUDENT
};

export const MOCK_BOOKS: Book[] = [
  {
    id: 'bk_1',
    title: 'History of Maratha Empire',
    author: 'James Grant Duff',
    isbn: '978-1234567890',
    status: 'AVAILABLE',
    type: 'PHYSICAL',
    coverUrl: 'https://picsum.photos/200/300?random=3'
  },
  {
    id: 'bk_2',
    title: 'Introduction to Algorithms',
    author: 'Cormen, Leiserson',
    isbn: '978-0262033848',
    status: 'ISSUED',
    dueDate: '2023-11-15', // Past date for notification simulation
    issuedTo: 'std_1',
    type: 'PHYSICAL',
    coverUrl: 'https://picsum.photos/200/300?random=4'
  },
  {
    id: 'bk_3',
    title: 'Daily Times (ePaper)',
    author: 'Daily Times Group',
    isbn: 'N/A',
    status: 'AVAILABLE',
    type: 'NEWSPAPER',
    link: '#',
    coverUrl: 'https://picsum.photos/200/300?random=5'
  },
  {
    id: 'bk_4',
    title: 'React Design Patterns',
    author: 'Various',
    isbn: 'N/A',
    status: 'AVAILABLE',
    type: 'DIGITAL',
    link: '#',
    coverUrl: 'https://picsum.photos/200/300?random=6'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'not_1',
    title: "Today's ePaper Available",
    message: 'The Daily Times for today has been uploaded by Saraswati Public Library.',
    date: '2023-10-27',
    read: false,
    type: 'INFO'
  },
  {
    id: 'not_2',
    title: 'Book Due Soon',
    message: 'Introduction to Algorithms is due tomorrow.',
    date: '2023-11-14',
    read: false,
    type: 'DEADLINE'
  }
];
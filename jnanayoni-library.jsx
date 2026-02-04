import React, { useState, useEffect, useRef } from 'react';
import { Camera, Book, Users, Upload, Bell, Calendar, FileText, Home, LogOut, Menu, X, BookOpen, Clock, AlertCircle, Check, QrCode, Image as ImageIcon, Mail, Phone, MapPin, Settings } from 'lucide-react';

// Translations
const translations = {
  en: {
    appName: "Jñānayoni",
    tagline: "Knowledge Repository",
    selectLanguage: "Select Language",
    libraryLogin: "Library Society Login",
    readerLogin: "Reader Login",
    login: "Login",
    email: "Email",
    password: "Password",
    selectLibrary: "Select Your Library",
    dashboard: "Dashboard",
    issuedBooks: "Issued Books",
    availableBooks: "Available Online Books",
    history: "Past Issued Books",
    issueBook: "Issue Book",
    scanQR: "Scan Book QR Code",
    notifications: "Notifications",
    about: "About",
    contact: "Contact",
    logout: "Logout",
    todaysEpaper: "Today's E-Paper",
    uploadEpaper: "Upload Today's E-Paper",
    uploadBooks: "Upload PDF Books",
    issuedRecords: "Issued Books Records",
    enrolledStudents: "Enrolled Students",
    updateAbout: "Update About Section",
    uploadPhotos: "Upload Library Photos",
    updateContact: "Update Contact Info",
    pendingFines: "Pending Fines",
    currentIssued: "Currently Issued",
    overdueBooks: "Overdue Books",
    dueDate: "Due Date",
    fine: "Fine",
    returnDate: "Return Date",
    studentName: "Student Name",
    bookTitle: "Book Title",
    issueDate: "Issue Date",
    status: "Status",
    save: "Save",
    upload: "Upload",
    cancel: "Cancel",
    submit: "Submit",
    viewAll: "View All",
    noBooks: "No books available",
    success: "Success!",
    bookIssued: "Book issued successfully",
    loading: "Loading...",
    welcome: "Welcome",
    libraryInfo: "Library Information",
    address: "Address",
    phone: "Phone",
    email: "Email",
    hours: "Operating Hours",
  },
  mr: {
    appName: "ज्ञानयोनी",
    tagline: "ज्ञान भांडार",
    selectLanguage: "भाषा निवडा",
    libraryLogin: "ग्रंथालय सोसायटी लॉगिन",
    readerLogin: "वाचक लॉगिन",
    login: "लॉगिन",
    email: "ईमेल",
    password: "पासवर्ड",
    selectLibrary: "तुमचे ग्रंथालय निवडा",
    dashboard: "डॅशबोर्ड",
    issuedBooks: "जारी केलेली पुस्तके",
    availableBooks: "उपलब्ध ऑनलाइन पुस्तके",
    history: "मागील जारी पुस्तके",
    issueBook: "पुस्तक जारी करा",
    scanQR: "पुस्तक QR कोड स्कॅन करा",
    notifications: "सूचना",
    about: "बद्दल",
    contact: "संपर्क",
    logout: "लॉग आउट",
    todaysEpaper: "आजचे ई-पेपर",
    uploadEpaper: "आजचे ई-पेपर अपलोड करा",
    uploadBooks: "PDF पुस्तके अपलोड करा",
    issuedRecords: "जारी पुस्तकांचे रेकॉर्ड",
    enrolledStudents: "नोंदणीकृत विद्यार्थी",
    updateAbout: "बद्दल विभाग अपडेट करा",
    uploadPhotos: "ग्रंथालय फोटो अपलोड करा",
    updateContact: "संपर्क माहिती अपडेट करा",
    pendingFines: "प्रलंबित दंड",
    currentIssued: "सध्या जारी",
    overdueBooks: "मुदतबाह्य पुस्तके",
    dueDate: "देय तारीख",
    fine: "दंड",
    returnDate: "परतीची तारीख",
    studentName: "विद्यार्थ्याचे नाव",
    bookTitle: "पुस्तकाचे शीर्षक",
    issueDate: "जारी तारीख",
    status: "स्थिती",
    save: "जतन करा",
    upload: "अपलोड",
    cancel: "रद्द करा",
    submit: "सबमिट करा",
    viewAll: "सर्व पहा",
    noBooks: "पुस्तके उपलब्ध नाहीत",
    success: "यशस्वी!",
    bookIssued: "पुस्तक यशस्वीरित्या जारी केले",
    loading: "लोड होत आहे...",
    welcome: "स्वागत आहे",
    libraryInfo: "ग्रंथालय माहिती",
    address: "पत्ता",
    phone: "फोन",
    email: "ईमेल",
    hours: "कार्यालयीन वेळ",
  }
};

// Main App Component
export default function JnanayoniLibrary() {
  const [language, setLanguage] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const [notification, setNotification] = useState(null);

  const t = language ? translations[language] : translations.en;

  useEffect(() => {
    loadUserData();
    loadNotifications();
  }, [isLoggedIn]);

  const loadUserData = async () => {
    if (!isLoggedIn) return;
    try {
      const result = await window.storage.get(`user_${userType}_data`);
      if (result) {
        setUserData(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('No user data found');
    }
  };

  const loadNotifications = async () => {
    try {
      const result = await window.storage.get('notifications', true);
      if (result) {
        setNotification(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('No notifications');
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Language Selection Screen
  if (!language) {
    return <LanguageSelection onSelect={setLanguage} />;
  }

  // Login Selection Screen
  if (!userType) {
    return <LoginTypeSelection t={t} onSelect={setUserType} />;
  }

  // Login Screen
  if (!isLoggedIn) {
    return (
      <LoginScreen
        t={t}
        userType={userType}
        onLogin={(library) => {
          setIsLoggedIn(true);
          setSelectedLibrary(library);
        }}
        onBack={() => setUserType(null)}
      />
    );
  }

  // Main App
  return (
    <div className="app-container">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <Header
        t={t}
        userType={userType}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        onLogout={() => {
          setIsLoggedIn(false);
          setUserType(null);
          setSelectedLibrary(null);
          setCurrentView('home');
        }}
      />

      <div className="main-layout">
        <Sidebar
          t={t}
          userType={userType}
          currentView={currentView}
          setCurrentView={setCurrentView}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
        />

        <main className="content-area">
          {notification && (
            <div className="notification-banner">
              <Check size={20} />
              <span>{notification}</span>
            </div>
          )}

          {userType === 'reader' ? (
            <ReaderContent
              t={t}
              currentView={currentView}
              selectedLibrary={selectedLibrary}
              showNotification={showNotification}
            />
          ) : (
            <LibraryContent
              t={t}
              currentView={currentView}
              showNotification={showNotification}
            />
          )}
        </main>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #fff;
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .main-layout {
          display: flex;
          min-height: calc(100vh - 70px);
        }

        .content-area {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .notification-banner {
          position: fixed;
          top: 90px;
          right: 20px;
          background: linear-gradient(135deg, #00d4aa 0%, #00a87e 100%);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 8px 32px rgba(0, 212, 170, 0.4);
          animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
          z-index: 1000;
          font-weight: 500;
        }

        @keyframes slideInRight {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes fadeOut {
          to { opacity: 0; }
        }

        @media (max-width: 768px) {
          .content-area {
            padding: 1rem;
          }

          .notification-banner {
            top: 80px;
            right: 10px;
            left: 10px;
            padding: 0.875rem 1rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}

// Language Selection Component
function LanguageSelection({ onSelect }) {
  return (
    <div className="lang-container">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <div className="lang-card">
        <div className="lang-header">
          <BookOpen size={48} className="header-icon" />
          <h1>Jñānayoni</h1>
          <p>ज्ञानयोनी</p>
          <span className="tagline">Knowledge Repository • ज्ञान भांडार</span>
        </div>

        <h2>Select Language / भाषा निवडा</h2>

        <div className="lang-buttons">
          <button onClick={() => onSelect('en')} className="lang-btn">
            <span className="lang-flag">🇬🇧</span>
            <span>English</span>
          </button>
          <button onClick={() => onSelect('mr')} className="lang-btn">
            <span className="lang-flag">🇮🇳</span>
            <span>मराठी</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .lang-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          position: relative;
          overflow: hidden;
        }

        .lang-container::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(255, 107, 107, 0.1) 0%, transparent 70%);
          top: -100px;
          right: -100px;
          animation: pulse 4s ease-in-out infinite;
        }

        .lang-container::after {
          content: '';
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(78, 205, 196, 0.1) 0%, transparent 70%);
          bottom: -50px;
          left: -50px;
          animation: pulse 4s ease-in-out infinite 2s;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        .lang-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          animation: slideUp 0.6s ease;
          position: relative;
          z-index: 1;
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .lang-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .header-icon {
          color: #ff6b6b;
          margin-bottom: 1rem;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .lang-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          letter-spacing: 1px;
        }

        .lang-header p {
          font-size: 1.75rem;
          color: #4ecdc4;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .tagline {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 400;
        }

        .lang-card h2 {
          text-align: center;
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2rem;
          font-weight: 500;
        }

        .lang-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .lang-btn {
          background: linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(78, 205, 196, 0.2) 100%);
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 1.25rem;
          border-radius: 16px;
          font-size: 1.25rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
        }

        .lang-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
          border-color: rgba(255, 255, 255, 0.4);
          background: linear-gradient(135deg, rgba(255, 107, 107, 0.3) 0%, rgba(78, 205, 196, 0.3) 100%);
        }

        .lang-btn:active {
          transform: translateY(0);
        }

        .lang-flag {
          font-size: 2rem;
        }

        @media (max-width: 480px) {
          .lang-card {
            padding: 2rem 1.5rem;
          }

          .lang-header h1 {
            font-size: 2rem;
          }

          .lang-header p {
            font-size: 1.5rem;
          }

          .lang-btn {
            padding: 1rem;
            font-size: 1.125rem;
          }
        }
      `}</style>
    </div>
  );
}

// Login Type Selection Component
function LoginTypeSelection({ t, onSelect }) {
  return (
    <div className="login-type-container">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <div className="login-type-card">
        <h1>{t.appName}</h1>
        <p className="subtitle">{t.tagline}</p>

        <div className="login-type-buttons">
          <button onClick={() => onSelect('library')} className="type-btn library-btn">
            <Users size={40} />
            <span>{t.libraryLogin}</span>
          </button>
          <button onClick={() => onSelect('reader')} className="type-btn reader-btn">
            <Book size={40} />
            <span>{t.readerLogin}</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .login-type-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .login-type-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          animation: slideUp 0.6s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .login-type-card h1 {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          margin-bottom: 3rem;
        }

        .login-type-buttons {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .type-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(255, 255, 255, 0.15);
          color: white;
          padding: 2rem;
          border-radius: 20px;
          font-size: 1.25rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
        }

        .type-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(78, 205, 196, 0.3);
          border-color: rgba(78, 205, 196, 0.5);
        }

        .library-btn:hover {
          background: linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(254, 202, 87, 0.2) 100%);
        }

        .reader-btn:hover {
          background: linear-gradient(135deg, rgba(78, 205, 196, 0.2) 0%, rgba(68, 160, 141, 0.2) 100%);
        }

        @media (max-width: 480px) {
          .login-type-card {
            padding: 2rem 1.5rem;
          }

          .login-type-card h1 {
            font-size: 2rem;
          }

          .type-btn {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

// Login Screen Component
function LoginScreen({ t, userType, onLogin, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState('');

  // Sample libraries
  const libraries = [
    { id: 'lib1', name: 'Mumbai Central Library', nameMarathi: 'मुंबई मध्यवर्ती ग्रंथालय' },
    { id: 'lib2', name: 'Pune Knowledge Hub', nameMarathi: 'पुणे ज्ञान केंद्र' },
    { id: 'lib3', name: 'Nashik Public Library', nameMarathi: 'नाशिक सार्वजनिक ग्रंथालय' },
  ];

  const handleLogin = () => {
    if (userType === 'reader' && !selectedLibrary) {
      alert('Please select a library');
      return;
    }
    onLogin(userType === 'reader' ? selectedLibrary : null);
  };

  return (
    <div className="login-container">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <button onClick={onBack} className="back-btn">
        ← {t.cancel}
      </button>

      <div className="login-card">
        <h2>{userType === 'library' ? t.libraryLogin : t.readerLogin}</h2>

        {userType === 'reader' && (
          <div className="form-group">
            <label>{t.selectLibrary}</label>
            <select
              value={selectedLibrary}
              onChange={(e) => setSelectedLibrary(e.target.value)}
              className="form-control"
            >
              <option value="">{t.selectLibrary}</option>
              {libraries.map(lib => (
                <option key={lib.id} value={lib.id}>
                  {lib.name} • {lib.nameMarathi}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>{t.email}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder={t.email}
          />
        </div>

        <div className="form-group">
          <label>{t.password}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder={t.password}
          />
        </div>

        <button onClick={handleLogin} className="login-btn">
          {t.login}
        </button>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          position: relative;
        }

        .back-btn {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateX(-3px);
        }

        .login-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          max-width: 450px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          animation: slideUp 0.6s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .login-card h2 {
          text-align: center;
          font-size: 1.75rem;
          color: #4ecdc4;
          margin-bottom: 2rem;
          font-weight: 600;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .form-control {
          width: 100%;
          padding: 0.875rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          font-family: 'Poppins', sans-serif;
          transition: all 0.3s ease;
        }

        .form-control:focus {
          outline: none;
          border-color: #4ecdc4;
          background: rgba(255, 255, 255, 0.08);
        }

        .form-control option {
          background: #1a1a2e;
          color: white;
        }

        .login-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
          font-family: 'Poppins', sans-serif;
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(78, 205, 196, 0.4);
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 2rem 1.5rem;
          }

          .back-btn {
            top: 10px;
            left: 10px;
            padding: 0.625rem 1rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}

// Header Component
function Header({ t, userType, showMobileMenu, setShowMobileMenu, onLogout }) {
  return (
    <header className="header">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <div className="header-content">
        <div className="header-left">
          <button
            className="mobile-menu-btn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="logo">
            <BookOpen size={28} />
            <span>{t.appName}</span>
          </div>
        </div>

        <div className="header-right">
          <button className="notification-btn">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>
          <button onClick={onLogout} className="logout-btn">
            <LogOut size={18} />
            <span>{t.logout}</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .header {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem 1.5rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: background 0.2s ease;
        }

        .mobile-menu-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: #4ecdc4;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .notification-btn {
          position: relative;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          padding: 0.625rem;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ff6b6b;
          color: white;
          font-size: 0.625rem;
          font-weight: 700;
          padding: 0.125rem 0.375rem;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }

        .logout-btn {
          background: rgba(255, 107, 107, 0.2);
          border: 1px solid rgba(255, 107, 107, 0.3);
          color: white;
          padding: 0.625rem 1rem;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          font-family: 'Poppins', sans-serif;
        }

        .logout-btn:hover {
          background: rgba(255, 107, 107, 0.3);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .header {
            padding: 0.875rem 1rem;
          }

          .mobile-menu-btn {
            display: block;
          }

          .logo span {
            font-size: 1.25rem;
          }

          .logout-btn span {
            display: none;
          }

          .logout-btn {
            padding: 0.625rem;
          }
        }
      `}</style>
    </header>
  );
}

// Sidebar Component
function Sidebar({ t, userType, currentView, setCurrentView, showMobileMenu, setShowMobileMenu }) {
  const readerMenuItems = [
    { id: 'home', icon: Home, label: t.dashboard },
    { id: 'issued', icon: Book, label: t.issuedBooks },
    { id: 'available', icon: BookOpen, label: t.availableBooks },
    { id: 'history', icon: Clock, label: t.history },
    { id: 'issue', icon: QrCode, label: t.issueBook },
    { id: 'about', icon: FileText, label: t.about },
    { id: 'contact', icon: Mail, label: t.contact },
  ];

  const libraryMenuItems = [
    { id: 'home', icon: Home, label: t.dashboard },
    { id: 'epaper', icon: FileText, label: t.uploadEpaper },
    { id: 'books', icon: Upload, label: t.uploadBooks },
    { id: 'records', icon: Book, label: t.issuedRecords },
    { id: 'students', icon: Users, label: t.enrolledStudents },
    { id: 'about', icon: Settings, label: t.updateAbout },
    { id: 'photos', icon: ImageIcon, label: t.uploadPhotos },
    { id: 'contact', icon: Mail, label: t.updateContact },
  ];

  const menuItems = userType === 'reader' ? readerMenuItems : libraryMenuItems;

  return (
    <>
      <aside className={`sidebar ${showMobileMenu ? 'mobile-open' : ''}`}>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        <nav className="nav-menu">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => {
                setCurrentView(item.id);
                setShowMobileMenu(false);
              }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {showMobileMenu && (
        <div className="sidebar-overlay" onClick={() => setShowMobileMenu(false)} />
      )}

      <style jsx>{`
        .sidebar {
          width: 280px;
          background: rgba(255, 255, 255, 0.03);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem 1rem;
          transition: transform 0.3s ease;
        }

        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          padding: 0.875rem 1rem;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.875rem;
          font-size: 0.9375rem;
          font-weight: 500;
          transition: all 0.2s ease;
          text-align: left;
          font-family: 'Poppins', sans-serif;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          transform: translateX(3px);
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgba(78, 205, 196, 0.2) 0%, rgba(68, 160, 141, 0.2) 100%);
          color: #4ecdc4;
          border-left: 3px solid #4ecdc4;
        }

        .sidebar-overlay {
          display: none;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            top: 70px;
            left: 0;
            bottom: 0;
            z-index: 99;
            transform: translateX(-100%);
            background: rgba(26, 26, 46, 0.98);
            backdrop-filter: blur(20px);
          }

          .sidebar.mobile-open {
            transform: translateX(0);
          }

          .sidebar-overlay {
            display: block;
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 98;
          }
        }
      `}</style>
    </>
  );
}

// Reader Content Component
function ReaderContent({ t, currentView, selectedLibrary, showNotification }) {
  if (currentView === 'home') {
    return <ReaderDashboard t={t} selectedLibrary={selectedLibrary} />;
  }
  if (currentView === 'issued') {
    return <IssuedBooks t={t} />;
  }
  if (currentView === 'available') {
    return <AvailableBooks t={t} />;
  }
  if (currentView === 'history') {
    return <BooksHistory t={t} />;
  }
  if (currentView === 'issue') {
    return <IssueBook t={t} showNotification={showNotification} />;
  }
  if (currentView === 'about') {
    return <AboutSection t={t} />;
  }
  if (currentView === 'contact') {
    return <ContactSection t={t} />;
  }
  return null;
}

// Library Content Component
function LibraryContent({ t, currentView, showNotification }) {
  if (currentView === 'home') {
    return <LibraryDashboard t={t} />;
  }
  if (currentView === 'epaper') {
    return <UploadEpaper t={t} showNotification={showNotification} />;
  }
  if (currentView === 'books') {
    return <UploadBooks t={t} showNotification={showNotification} />;
  }
  if (currentView === 'records') {
    return <IssuedRecords t={t} />;
  }
  if (currentView === 'students') {
    return <EnrolledStudents t={t} />;
  }
  if (currentView === 'about') {
    return <UpdateAbout t={t} showNotification={showNotification} />;
  }
  if (currentView === 'photos') {
    return <UploadPhotos t={t} showNotification={showNotification} />;
  }
  if (currentView === 'contact') {
    return <UpdateContact t={t} showNotification={showNotification} />;
  }
  return null;
}

// Reader Dashboard
function ReaderDashboard({ t, selectedLibrary }) {
  const [stats, setStats] = useState({
    issued: 3,
    available: 127,
    overdue: 1
  });

  return (
    <div className="dashboard">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <h1>{t.welcome}!</h1>
      <p className="subtitle">Mumbai Central Library • मुंबई मध्यवर्ती ग्रंथालय</p>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">
            <Book size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.issued}</h3>
            <p>{t.currentIssued}</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">
            <BookOpen size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.available}</h3>
            <p>{t.availableBooks}</p>
          </div>
        </div>

        <div className="stat-card red">
          <div className="stat-icon">
            <AlertCircle size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.overdue}</h3>
            <p>{t.overdueBooks}</p>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h2>{t.todaysEpaper}</h2>
        <div className="epaper-card">
          <FileText size={48} />
          <h3>The Times of India - Feb 4, 2026</h3>
          <button className="primary-btn">View E-Paper</button>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        h1 {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1rem;
          margin-bottom: 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .stat-card.blue {
          border-left: 4px solid #4ecdc4;
        }

        .stat-card.green {
          border-left: 4px solid #95e1d3;
        }

        .stat-card.red {
          border-left: 4px solid #ff6b6b;
        }

        .stat-icon {
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 12px;
          color: #4ecdc4;
        }

        .stat-info h3 {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.25rem;
        }

        .stat-info p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
        }

        .recent-section {
          margin-top: 2.5rem;
        }

        .recent-section h2 {
          font-size: 1.5rem;
          color: white;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .epaper-card {
          background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(254, 202, 87, 0.1) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2.5rem;
          text-align: center;
          color: #feca57;
        }

        .epaper-card h3 {
          color: white;
          font-size: 1.25rem;
          margin: 1rem 0 1.5rem;
        }

        .primary-btn {
          background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
          border: none;
          color: white;
          padding: 0.875rem 2rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4);
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 1.5rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .stat-card {
            padding: 1.25rem;
          }

          .stat-info h3 {
            font-size: 1.5rem;
          }

          .epaper-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

// Issued Books Component
function IssuedBooks({ t }) {
  const issuedBooks = [
    {
      id: 1,
      title: 'The Great Gatsby',
      titleMarathi: 'द ग्रेट गॅट्सबी',
      issueDate: '2026-01-20',
      dueDate: '2026-02-10',
      status: 'issued'
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      titleMarathi: 'टु किल अ मॉकिंगबर्ड',
      issueDate: '2026-01-25',
      dueDate: '2026-02-15',
      status: 'issued'
    },
    {
      id: 3,
      title: '1984',
      titleMarathi: '१९८४',
      issueDate: '2026-01-15',
      dueDate: '2026-02-05',
      status: 'overdue'
    },
  ];

  return (
    <div className="content-section">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <h1>{t.issuedBooks}</h1>

      <div className="books-list">
        {issuedBooks.map(book => (
          <div key={book.id} className={`book-card ${book.status}`}>
            <div className="book-header">
              <Book size={24} />
              <div>
                <h3>{book.title}</h3>
                <p className="marathi">{book.titleMarathi}</p>
              </div>
            </div>
            <div className="book-details">
              <div className="detail-row">
                <span className="label">{t.issueDate}:</span>
                <span>{book.issueDate}</span>
              </div>
              <div className="detail-row">
                <span className="label">{t.dueDate}:</span>
                <span className={book.status === 'overdue' ? 'overdue-text' : ''}>
                  {book.dueDate}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">{t.status}:</span>
                <span className={`status-badge ${book.status}`}>
                  {book.status === 'overdue' ? t.overdueBooks : t.currentIssued}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .content-section {
          animation: fadeIn 0.4s ease;
        }

        h1 {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 2rem;
        }

        .books-list {
          display: grid;
          gap: 1.5rem;
        }

        .book-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .book-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .book-card.overdue {
          border-left: 4px solid #ff6b6b;
        }

        .book-card.issued {
          border-left: 4px solid #4ecdc4;
        }

        .book-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.25rem;
          color: #4ecdc4;
        }

        .book-header h3 {
          color: white;
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .marathi {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
        }

        .book-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9375rem;
        }

        .label {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
        }

        .overdue-text {
          color: #ff6b6b;
          font-weight: 600;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.overdue {
          background: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
        }

        .status-badge.issued {
          background: rgba(78, 205, 196, 0.2);
          color: #4ecdc4;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 1.5rem;
          }

          .book-card {
            padding: 1.25rem;
          }

          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}

// Available Books Component
function AvailableBooks({ t }) {
  const books = [
    { id: 1, title: 'Pride and Prejudice', titleMr: 'प्राईड अँड प्रेजुडिस', author: 'Jane Austen', pages: 432 },
    { id: 2, title: 'The Catcher in the Rye', titleMr: 'द कॅचर इन द राय', author: 'J.D. Salinger', pages: 277 },
    { id: 3, title: 'Brave New World', titleMr: 'ब्रेव्ह न्यू वर्ल्ड', author: 'Aldous Huxley', pages: 311 },
    { id: 4, title: 'The Hobbit', titleMr: 'द हॉबिट', author: 'J.R.R. Tolkien', pages: 310 },
  ];

  return (
    <div className="content-section">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <h1>{t.availableBooks}</h1>
      <div className="books-grid">
        {books.map(book => (
          <div key={book.id} className="available-book-card">
            <div className="book-icon"><BookOpen size={48} /></div>
            <h3>{book.title}</h3>
            <p className="marathi">{book.titleMr}</p>
            <p className="author">{book.author}</p>
            <p className="pages">{book.pages} pages</p>
            <button className="read-btn">Read Online</button>
          </div>
        ))}
      </div>
      <style jsx>{`
        .content-section { animation: fadeIn 0.4s ease; }
        h1 { font-size: 2rem; font-weight: 700; color: white; margin-bottom: 2rem; }
        .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; }
        .available-book-card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 2rem 1.5rem; text-align: center; transition: all 0.3s ease; }
        .available-book-card:hover { transform: translateY(-5px); box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3); }
        .book-icon { color: #4ecdc4; margin-bottom: 1rem; }
        .available-book-card h3 { color: white; font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; }
        .marathi { color: rgba(255, 255, 255, 0.5); font-size: 0.875rem; margin-bottom: 0.75rem; }
        .author { color: rgba(255, 255, 255, 0.7); font-size: 0.9375rem; margin-bottom: 0.5rem; }
        .pages { color: rgba(255, 255, 255, 0.5); font-size: 0.8125rem; margin-bottom: 1.25rem; }
        .read-btn { background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); border: none; color: white; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 600; cursor: pointer; width: 100%; font-family: 'Poppins', sans-serif; }
        .read-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(78, 205, 196, 0.4); }
        @media (max-width: 768px) { h1 { font-size: 1.5rem; } .books-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

// Books History
function BooksHistory({ t }) {
  const history = [
    { id: 1, title: 'Animal Farm', titleMr: 'अॅनिमल फार्म', issueDate: '2025-12-01', returnDate: '2025-12-20' },
    { id: 2, title: 'Fahrenheit 451', titleMr: 'फारेनहाइट ४५१', issueDate: '2025-11-15', returnDate: '2025-12-05' },
    { id: 3, title: 'Lord of the Flies', titleMr: 'लॉर्ड ऑफ द फ्लाईज', issueDate: '2025-11-01', returnDate: '2025-11-20' },
  ];

  return (
    <div className="content-section">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <h1>{t.history}</h1>
      <div className="history-list">
        {history.map(book => (
          <div key={book.id} className="history-card">
            <div className="history-header">
              <Clock size={20} />
              <div>
                <h3>{book.title}</h3>
                <p className="marathi">{book.titleMr}</p>
              </div>
            </div>
            <div className="history-dates">
              <div><span className="label">{t.issueDate}:</span> <span>{book.issueDate}</span></div>
              <div><span className="label">{t.returnDate}:</span> <span>{book.returnDate}</span></div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .content-section { animation: fadeIn 0.4s ease; }
        h1 { font-size: 2rem; font-weight: 700; color: white; margin-bottom: 2rem; }
        .history-list { display: grid; gap: 1.25rem; }
        .history-card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 1.5rem; border-left: 4px solid #95e1d3; }
        .history-header { display: flex; gap: 1rem; margin-bottom: 1rem; color: #95e1d3; }
        .history-header h3 { color: white; font-size: 1.125rem; font-weight: 600; }
        .marathi { color: rgba(255, 255, 255, 0.6); font-size: 0.875rem; }
        .history-dates { display: flex; gap: 2rem; }
        .label { color: rgba(255, 255, 255, 0.5); font-size: 0.8125rem; }
        @media (max-width: 768px) { h1 { font-size: 1.5rem; } .history-dates { flex-direction: column; gap: 0.5rem; } }
      `}</style>
    </div>
  );
}

// Issue Book (QR Scanner)
function IssueBook({ t, showNotification }) {
  const [scanning, setScanning] = useState(false);
  const startScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      showNotification(t.bookIssued);
    }, 2000);
  };

  return (
    <div className="content-section">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <h1>{t.issueBook}</h1>
      <div className="scanner-container">
        <div className="scanner-card">
          <QrCode size={64} style={{color: '#4ecdc4', marginBottom: '1.5rem'}} />
          <h2>{t.scanQR}</h2>
          <p>Position the book's QR code within the frame</p>
          {scanning ? (
            <div className="scanning-animation">
              <div className="scan-line"></div>
              <p style={{color: '#4ecdc4', fontWeight: 600}}>{t.loading}</p>
            </div>
          ) : (
            <button onClick={startScan} className="scan-btn">
              <Camera size={20} /> <span>Start Scanning</span>
            </button>
          )}
        </div>
      </div>
      <style jsx>{`
        .content-section { animation: fadeIn 0.4s ease; }
        h1 { font-size: 2rem; font-weight: 700; color: white; margin-bottom: 2rem; }
        .scanner-container { display: flex; justify-content: center; min-height: 400px; }
        .scanner-card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 3rem 2.5rem; text-align: center; max-width: 500px; width: 100%; }
        .scanner-card h2 { color: white; font-size: 1.5rem; margin-bottom: 0.75rem; }
        .scanner-card > p { color: rgba(255, 255, 255, 0.6); margin-bottom: 2rem; }
        .scan-btn { background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); border: none; color: white; padding: 1rem 2rem; border-radius: 12px; font-size: 1.125rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.75rem; font-family: 'Poppins', sans-serif; }
        .scan-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(78, 205, 196, 0.4); }
        .scanning-animation { position: relative; height: 200px; border: 2px dashed #4ecdc4; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .scan-line { position: absolute; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, #4ecdc4, transparent); animation: scan 2s linear infinite; }
        @keyframes scan { from { top: 0; } to { top: 100%; } }
      `}</style>
    </div>
  );
}

// About & Contact Sections
function AboutSection({ t }) {
  return (
    <div className="content-section">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <h1>{t.about}</h1>
      <div className="about-card">
        <h2>Mumbai Central Library</h2>
        <h3 style={{color: '#4ecdc4', fontSize: '1.5rem', marginBottom: '2rem'}}>मुंबई मध्यवर्ती ग्रंथालय</h3>
        <p style={{lineHeight: 1.7, marginBottom: '1.5rem', color: 'rgba(255, 255, 255, 0.8)'}}>
          Established in 1947, Mumbai Central Library has been serving the community for over 75 years. We are committed to fostering a love for reading and learning among all age groups.
        </p>
        <p style={{lineHeight: 1.7, marginBottom: '2rem', color: '#4ecdc4'}}>
          १९४७ मध्ये स्थापित, मुंबई मध्यवर्ती ग्रंथालय ७५ वर्षांहून अधिक काळ समाजाची सेवा करत आहे.
        </p>
        <div className="features-grid">
          <div className="feature">
            <Book size={32} style={{color: '#4ecdc4', marginBottom: '1rem'}} />
            <h4>50,000+ Books</h4>
            <p>Extensive collection</p>
          </div>
          <div className="feature">
            <Users size={32} style={{color: '#4ecdc4', marginBottom: '1rem'}} />
            <h4>5,000+ Members</h4>
            <p>Active community</p>
          </div>
          <div className="feature">
            <Clock size={32} style={{color: '#4ecdc4', marginBottom: '1rem'}} />
            <h4>Open 7 Days</h4>
            <p>Flexible hours</p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .content-section { animation: fadeIn 0.4s ease; }
        h1 { font-size: 2rem; font-weight: 700; color: white; margin-bottom: 2rem; }
        .about-card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 2.5rem; max-width: 800px; }
        .about-card h2 { color: white; font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-top: 2.5rem; }
        .feature { text-align: center; padding: 1.5rem; background: rgba(255, 255, 255, 0.03); border-radius: 12px; }
        .feature h4 { color: white; font-size: 1.125rem; margin-bottom: 0.5rem; }
        .feature p { color: rgba(255, 255, 255, 0.6); font-size: 0.875rem; }
      `}</style>
    </div>
  );
}

function ContactSection({ t }) {
  return (
    <div className="content-section">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <h1>{t.contact}</h1>
      <div className="contact-card">
        <h2>{t.libraryInfo}</h2>
        <div className="contact-info">
          <div className="contact-item">
            <MapPin size={24} style={{color: '#4ecdc4'}} />
            <div>
              <h4>{t.address}</h4>
              <p>123 Library Street, Central Mumbai</p>
              <p style={{color: 'rgba(78, 205, 196, 0.7)'}}>१२३ ग्रंथालय मार्ग, मध्य मुंबई</p>
            </div>
          </div>
          <div className="contact-item">
            <Phone size={24} style={{color: '#4ecdc4'}} />
            <div>
              <h4>{t.phone}</h4>
              <p>+91 22 1234 5678</p>
            </div>
          </div>
          <div className="contact-item">
            <Mail size={24} style={{color: '#4ecdc4'}} />
            <div>
              <h4>{t.email}</h4>
              <p>info@mumbaicentral.library</p>
            </div>
          </div>
          <div className="contact-item">
            <Clock size={24} style={{color: '#4ecdc4'}} />
            <div>
              <h4>{t.hours}</h4>
              <p>Mon-Fri: 8AM-8PM</p>
              <p>Sat-Sun: 9AM-6PM</p>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .content-section { animation: fadeIn 0.4s ease; }
        h1 { font-size: 2rem; font-weight: 700; color: white; margin-bottom: 2rem; }
        .contact-card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 2.5rem; max-width: 700px; }
        .contact-card h2 { color: white; font-size: 1.75rem; margin-bottom: 2rem; }
        .contact-info { display: flex; flex-direction: column; gap: 2rem; }
        .contact-item { display: flex; gap: 1.5rem; align-items: flex-start; }
        .contact-item h4 { color: white; font-size: 1.125rem; margin-bottom: 0.5rem; }
        .contact-item p { color: rgba(255, 255, 255, 0.7); font-size: 0.9375rem; }
      `}</style>
    </div>
  );
}

// Library Portal Components
function LibraryDashboard({ t }) {
  const stats = { totalIssued: 245, overdue: 12, students: 456, fines: 3500 };
  return (
    <div className="dashboard">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <h1>{t.dashboard}</h1>
      <p style={{color: 'rgba(255, 255, 255, 0.6)', marginBottom: '2rem'}}>Library Management Portal</p>
      <div className="stats-grid">
        <div className="stat-card" style={{borderLeft: '4px solid #4ecdc4'}}>
          <div style={{background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '12px', color: '#4ecdc4'}}>
            <Book size={32} />
          </div>
          <div>
            <h3 style={{fontSize: '2rem', color: 'white', marginBottom: '0.25rem'}}>{stats.totalIssued}</h3>
            <p style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem'}}>{t.currentIssued}</p>
          </div>
        </div>
        <div className="stat-card" style={{borderLeft: '4px solid #ff6b6b'}}>
          <div style={{background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '12px', color: '#ff6b6b'}}>
            <AlertCircle size={32} />
          </div>
          <div>
            <h3 style={{fontSize: '2rem', color: 'white', marginBottom: '0.25rem'}}>{stats.overdue}</h3>
            <p style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem'}}>{t.overdueBooks}</p>
          </div>
        </div>
        <div className="stat-card" style={{borderLeft: '4px solid #95e1d3'}}>
          <div style={{background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '12px', color: '#95e1d3'}}>
            <Users size={32} />
          </div>
          <div>
            <h3 style={{fontSize: '2rem', color: 'white', marginBottom: '0.25rem'}}>{stats.students}</h3>
            <p style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem'}}>{t.enrolledStudents}</p>
          </div>
        </div>
        <div className="stat-card" style={{borderLeft: '4px solid #feca57'}}>
          <div style={{background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '12px', color: '#feca57'}}>
            <Calendar size={32} />
          </div>
          <div>
            <h3 style={{fontSize: '2rem', color: 'white', marginBottom: '0.25rem'}}>₹{stats.fines}</h3>
            <p style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem'}}>{t.pendingFines}</p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .dashboard { animation: fadeIn 0.4s ease; }
        h1 { font-size: 2rem; font-weight: 700; color: white; margin-bottom: 0.5rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; }
        .stat-card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 1.5rem; display: flex; align-items: center; gap: 1.25rem; transition: all 0.3s ease; }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); }
        @media (max-width: 768px) { .stats-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

function UploadEpaper({ t, showNotification }) {
  return (
    <div className="content-section">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <h1>{t.uploadEpaper}</h1>
      <div style={{background: 'rgba(255, 255, 255, 0.05)', border: '2px dashed rgba(255, 255, 255, 0.2)', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto'}}>
        <Upload size={64} style={{color: '#4ecdc4', marginBottom: '1.5rem'}} />
        <h2 style={{color: 'white', fontSize: '1.5rem', marginBottom: '0.75rem'}}>Upload Today's Newspaper</h2>
        <p style={{color: 'rgba(255, 255, 255, 0.6)', marginBottom: '2rem'}}>Upload PDF files (max 50MB)</p>
        <input type="file" accept=".pdf" style={{display: 'none'}} id="epaper" />
        <label htmlFor="epaper" style={{background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', border: 'none', color: 'white', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', display: 'inline-block', fontFamily: 'Poppins', margin: '0.5rem'}}>Choose File</label>
        <button onClick={() => showNotification('E-Paper uploaded!')} style={{background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', border: 'none', color: 'white', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins', margin: '0.5rem'}}>{t.upload}</button>
      </div>
      <style jsx>{`
        .content-section { animation: fadeIn 0.4s ease; }
        h1 { font-size: 2rem; font-weight: 700; color: white; margin-bottom: 2rem; }
      `}</style>
    </div>
  );
}

function UploadBooks({ t, showNotification }) {
  return (
    <div className="content-section">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <h1>{t.uploadBooks}</h1>
      <div style={{background: 'rgba(255, 255, 255, 0.05)', border: '2px dashed rgba(255, 255, 255, 0.2)', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto'}}>
        <BookOpen size={64} style={{color: '#4ecdc4', marginBottom: '1.5rem'}} />
        <h2 style={{color: 'white', fontSize: '1.5rem', marginBottom: '0.75rem'}}>Upload PDF Books</h2>
        <p style={{color: 'rgba(255, 255, 255, 0.6)', marginBottom: '2rem'}}>Add books to online collection</p>
        <input type="file" accept=".pdf" style={{display: 'none'}} id="book" />
        <label htmlFor="book" style={{background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', border: 'none', color: 'white', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', display: 'inline-block', fontFamily: 'Poppins', margin: '0.5rem'}}>Choose PDF</label>
        <button onClick={() => showNotification('Book uploaded!')} style={{background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', border: 'none', color: 'white', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins', margin: '0.5rem'}}>{t.upload}</button>
      </div>
      <style jsx>{`
        .content-section { animation: fadeIn 0.4s ease; }
        h1 { font-size: 2rem; font-weight: 700; color: white; margin-bottom: 2rem; }
      `}</style>
    </div>
  );
}

function IssuedRecords({ t }) {
  const records = [
    { id: 1, student: 'Raj Sharma', book: 'The Great Gatsby', issueDate: '2026-01-20', dueDate: '2026-02-10', status: 'issued' },
    { id: 2, student: 'Priya Patel', book: '1984', issueDate: '2026-01-15', dueDate: '2026-02-05', status: 'overdue' },
  ];

  return (
    <div className="content-section">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <h1>{t.issuedRecords}</h1>
      <div style={{display: 'grid', gap: '1.25rem'}}>
        {records.map(r => (
          <div key={r.id} style={{background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderLeft: `4px solid ${r.status === 'overdue' ? '#ff6b6b' : '#4ecdc4'}`, borderRadius: '16px', padding: '1.5rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem'}}>
              <h3 style={{color: 'white', fontSize: '1.125rem'}}>{r.student}</h3>
              <span style={{padding: '0.375rem 0.875rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: r.status === 'overdue' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(78, 205, 196, 0.2)', color: r.status === 'overdue' ? '#ff6b6b' : '#4ecdc4'}}>{r.status === 'overdue' ? t.overdueBooks : t.currentIssued}</span>
            </div>
            <p style={{color: '#4ecdc4', marginBottom: '1rem'}}>{r.book}</p>
            <div style={{display: 'flex', gap: '2rem', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)'}}>
              <span>{t.issueDate}: {r.issueDate}</span>
              <span>{t.dueDate}: {r.dueDate}</span>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .content-section { animation: fadeIn 0.4s ease; }
        h1 { font-size: 2rem; font-weight: 700; color: white; margin-bottom: 2rem; }
      `}</style>
    </div>
  );
}

function EnrolledStudents({ t }) {
  const students = [
    { id: 1, name: 'Raj Sharma', email: 'raj@email.com', enrolled: '2025-09-01', books: 3 },
    { id: 2, name: 'Priya Patel', email: 'priya@email.com', enrolled: '2025-09-15', books: 2 },
  ];

  return (
    <div className="content-section">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <h1>{t.enrolledStudents}</h1>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem'}}>
        {students.map(s => (
          <div key={s.id} style={{background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '2rem', textAlign: 'center'}}>
            <div style={{background: 'rgba(78, 205, 196, 0.2)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#4ecdc4'}}>
              <Users size={32} />
            </div>
            <h3 style={{color: 'white', fontSize: '1.25rem', marginBottom: '0.5rem'}}>{s.name}</h3>
            <p style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem', marginBottom: '1.5rem'}}>{s.email}</p>
            <div style={{borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: 'rgba(255, 255, 255, 0.5)'}}>Enrolled:</span>
                <span style={{color: 'white'}}>{s.enrolled}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: 'rgba(255, 255, 255, 0.5)'}}>Books Issued:</span>
                <span style={{color: 'white'}}>{s.books}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .content-section { animation: fadeIn 0.4s ease; }
        h1 { font-size: 2rem; font-weight: 700; color: white; margin-bottom: 2rem; }
      `}</style>
    </div>
  );
}

function UpdateAbout({ t, showNotification }) {
  const [about, setAbout] = useState('');
  return (
    <div className="content-section">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <h1>{t.updateAbout}</h1>
      <div style={{background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '2rem', maxWidth: '700px'}}>
        <label style={{display: 'block', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1rem'}}>Library Description (English & Marathi)</label>
        <textarea value={about} onChange={e => setAbout(e.target.value)} rows="10" style={{width: '100%', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: 'white', fontFamily: 'Poppins', marginBottom: '1.5rem'}} placeholder="Enter library description..." />
        <button onClick={async () => { try { await window.storage.set('library_about', about, true); showNotification('About section updated!'); } catch(e) {} }} style={{background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', border: 'none', color: 'white', padding: '1rem 2.5rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins'}}>{t.save}</button>
      </div>
      <style jsx>{`
        .content-section { animation: fadeIn 0.4s ease; }
        h1 { font-size: 2rem; font-weight: 700; color: white; margin-bottom: 2rem; }
      `}</style>
    </div>
  );
}

function UploadPhotos({ t, showNotification }) {
  return (
    <div className="content-section">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <h1>{t.uploadPhotos}</h1>
      <div style={{background: 'rgba(255, 255, 255, 0.05)', border: '2px dashed rgba(255, 255, 255, 0.2)', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto'}}>
        <ImageIcon size={64} style={{color: '#4ecdc4', marginBottom: '1.5rem'}} />
        <h2 style={{color: 'white', fontSize: '1.5rem', marginBottom: '0.75rem'}}>Upload Library Photos</h2>
        <p style={{color: 'rgba(255, 255, 255, 0.6)', marginBottom: '2rem'}}>Add images to showcase your library</p>
        <input type="file" accept="image/*" multiple style={{display: 'none'}} id="photos" />
        <label htmlFor="photos" style={{background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', border: 'none', color: 'white', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', display: 'inline-block', fontFamily: 'Poppins', margin: '0.5rem'}}>Choose Images</label>
        <button onClick={() => showNotification('Photos uploaded!')} style={{background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', border: 'none', color: 'white', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins', margin: '0.5rem'}}>{t.upload}</button>
      </div>
      <style jsx>{`
        .content-section { animation: fadeIn 0.4s ease; }
        h1 { font-size: 2rem; font-weight: 700; color: white; margin-bottom: 2rem; }
      `}</style>
    </div>
  );
}

function UpdateContact({ t, showNotification }) {
  const [contact, setContact] = useState({address: '', phone: '', email: '', hours: ''});
  return (
    <div className="content-section">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <h1>{t.updateContact}</h1>
      <div style={{background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '2rem', maxWidth: '600px'}}>
        <div style={{marginBottom: '1.5rem'}}>
          <label style={{display: 'block', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem', fontSize: '0.875rem'}}>{t.address}</label>
          <input type="text" value={contact.address} onChange={e => setContact({...contact, address: e.target.value})} style={{width: '100%', padding: '0.875rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: 'white', fontFamily: 'Poppins'}} />
        </div>
        <div style={{marginBottom: '1.5rem'}}>
          <label style={{display: 'block', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem', fontSize: '0.875rem'}}>{t.phone}</label>
          <input type="tel" value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} style={{width: '100%', padding: '0.875rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: 'white', fontFamily: 'Poppins'}} />
        </div>
        <div style={{marginBottom: '1.5rem'}}>
          <label style={{display: 'block', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem', fontSize: '0.875rem'}}>{t.email}</label>
          <input type="email" value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} style={{width: '100%', padding: '0.875rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: 'white', fontFamily: 'Poppins'}} />
        </div>
        <div style={{marginBottom: '1.5rem'}}>
          <label style={{display: 'block', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem', fontSize: '0.875rem'}}>{t.hours}</label>
          <textarea value={contact.hours} onChange={e => setContact({...contact, hours: e.target.value})} rows="3" style={{width: '100%', padding: '0.875rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: 'white', fontFamily: 'Poppins'}} />
        </div>
        <button onClick={async () => { try { await window.storage.set('library_contact', JSON.stringify(contact), true); showNotification('Contact updated!'); } catch(e) {} }} style={{background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', border: 'none', color: 'white', padding: '1rem 2.5rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins', marginTop: '1rem'}}>{t.save}</button>
      </div>
      <style jsx>{`
        .content-section { animation: fadeIn 0.4s ease; }
        h1 { font-size: 2rem; font-weight: 700; color: white; margin-bottom: 2rem; }
      `}</style>
    </div>
  );
}

import React, { useState } from 'react';
import { useLanguage } from '../services/LanguageContext';
import { Bell, BookOpen, LogOut, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_NOTIFICATIONS } from '../constants';

interface NavbarProps {
  onLogout: () => void;
  showNotifications?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogout, showNotifications = true }) => {
  const { language, setLanguage, t } = useLanguage();
  const [showNotifs, setShowNotifs] = useState(false);
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'mr' : 'en');
  };

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <nav className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <BookOpen className="h-8 w-8 mr-2" />
            <span className="font-bold text-xl tracking-tight">Jñānayoni</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-500 transition text-sm font-medium"
            >
              <Globe className="w-4 h-4 mr-1" />
              {language === 'en' ? 'English' : 'मराठी'}
            </button>

            {showNotifications && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="p-2 rounded-full hover:bg-indigo-600 relative"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-xl overflow-hidden z-50 ring-1 ring-black ring-opacity-5">
                    <div className="p-3 bg-gray-50 border-b font-semibold flex justify-between items-center">
                      <span>{t('notifications')}</span>
                      <span className="text-xs text-indigo-600 cursor-pointer" onClick={() => setShowNotifs(false)}>Close</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {MOCK_NOTIFICATIONS.map(notif => (
                        <div key={notif.id} className={`p-4 border-b hover:bg-gray-50 ${!notif.read ? 'bg-blue-50' : ''}`}>
                          <div className="flex items-start">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">{notif.title}</h4>
                              <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                              <p className="text-[10px] text-gray-400 mt-2">{notif.date}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onLogout}
              className="flex items-center px-3 py-2 rounded-md hover:bg-indigo-600 text-sm font-medium"
            >
              <LogOut className="w-5 h-5 mr-1" />
              <span className="hidden sm:inline">{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
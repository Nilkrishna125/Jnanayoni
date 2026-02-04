import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../services/LanguageContext';
import { BookOpen, GraduationCap, Building2, Globe } from 'lucide-react';
import { UserRole } from '../types';

interface LandingProps {
  onRoleSelect: (role: UserRole) => void;
}

export const Landing: React.FC<LandingProps> = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="absolute top-4 right-4">
         <button
            onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
            className="flex items-center px-4 py-2 rounded-full bg-white shadow-md text-indigo-600 hover:bg-gray-50 transition"
          >
            <Globe className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Switch to मराठी' : 'English मध्ये स्विच करा'}
          </button>
      </div>

      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-indigo-600 rounded-full shadow-lg">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Jñānayoni
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('welcome')}
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Student Card */}
        <button
          onClick={() => navigate('/auth/student')}
          className="group relative bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col items-center text-center"
        >
          <div className="mb-6 p-4 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
            {t('student')}
          </h2>
          <p className="text-gray-500">
            Access libraries, issue books, and view digital resources.
          </p>
        </button>

        {/* Library Admin Card */}
        <button
          onClick={() => navigate('/auth/library')}
          className="group relative bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col items-center text-center"
        >
          <div className="mb-6 p-4 bg-indigo-100 text-indigo-600 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
            <Building2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
            {t('libraryAdmin')}
          </h2>
          <p className="text-gray-500">
            Manage books, students, events, and digital uploads.
          </p>
        </button>
      </div>

      <div className="mt-12 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Jñānayoni Library Systems
      </div>
    </div>
  );
};
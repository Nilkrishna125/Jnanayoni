import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../services/LanguageContext';
import { MOCK_LIBRARIES, MOCK_STUDENT } from '../../constants';
import { Library } from '../../types';
import { ArrowRight, MapPin } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const enrolledLibraries = MOCK_LIBRARIES.filter(lib => 
    MOCK_STUDENT.enrolledLibraryIds.includes(lib.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('myLibraries')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {enrolledLibraries.map((library: Library) => (
          <div 
            key={library.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 flex flex-col"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={library.imageUrl} 
                alt={library.name} 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{library.name}</h3>
              <div className="flex items-start text-gray-500 mb-4 text-sm">
                <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                <span>{library.address}</span>
              </div>
              <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">
                {library.description}
              </p>
              
              <button
                onClick={() => navigate(`/student/library/${library.id}`)}
                className="w-full mt-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Enter Library
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../services/LanguageContext';
import { useData } from '../services/DataContext';
import { UserRole } from '../types';
import { BookOpen, User, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

interface AuthPageProps {
  role: UserRole;
}

export const AuthPage: React.FC<AuthPageProps> = ({ role }) => {
  const { t, language } = useLanguage();
  const { login, register } = useData();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Basic Validation
      if (!email || !password) {
        throw new Error(language === 'en' ? 'Please fill in all fields' : 'कृपया सर्व फील्ड भरा');
      }
      if (!isLogin && !name) {
        throw new Error(language === 'en' ? 'Please enter your name' : 'कृपया तुमचे नाव प्रविष्ट करा');
      }

      let success = false;
      if (isLogin) {
        success = await login(email, password, role);
        if (!success) throw new Error('Invalid email or password');
      } else {
        success = await register(email, password, name, role);
        if (!success) throw new Error('Email already registered');
      }

      if (success) {
        if (role === UserRole.STUDENT) {
          navigate('/student/dashboard');
        } else {
          navigate('/library/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-indigo-600 p-2 rounded-lg">
             <BookOpen className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin 
            ? (role === UserRole.STUDENT ? 'Student Login' : 'Library Login') 
            : (role === UserRole.STUDENT ? 'Student Registration' : 'Library Registration')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <button onClick={() => {setIsLogin(!isLogin); setError('');}} className="font-medium text-indigo-600 hover:text-indigo-500">
            {isLogin ? 'create a new account' : 'sign in to existing account'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          
          {/* Demo Credentials Hint */}
          <div className="mb-6 bg-blue-50 p-3 rounded-md text-xs text-blue-700">
             <p className="font-bold mb-1">Demo Credentials:</p>
             {role === UserRole.STUDENT ? (
               <p>Email: <b>student@demo.com</b> | Pass: <b>password</b></p>
             ) : (
               <p>Email: <b>admin@library.com</b> | Pass: <b>password</b></p>
             )}
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {role === UserRole.STUDENT ? 'Full Name' : 'Library Name'}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2.5 border"
                    placeholder={role === UserRole.STUDENT ? "John Doe" : "City Public Library"}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2.5 border"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2.5 border"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-md">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Register')}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
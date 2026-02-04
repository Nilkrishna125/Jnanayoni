import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types'; // Import your types

// Define what props this page accepts
interface AuthPageProps {
  role?: UserRole;
}

export const AuthPage: React.FC<AuthPageProps> = ({ role }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Navigate based on the role passed or default logic
      if (role === UserRole.LIBRARY_ADMIN) {
        navigate('/library/dashboard');
      } else {
        navigate('/student/portal');
      }
    } catch (error: any) {
      alert("Login Failed: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="mb-6 text-2xl font-bold text-center">
          {role === UserRole.LIBRARY_ADMIN ? 'Library Admin' : 'Student'} Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email"
            className="w-full p-2 border rounded"
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password"
            className="w-full p-2 border rounded"
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit" className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LogoDoodle from './layout/LogoDoodle';

const LoginForm = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <>

          {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-[#4a4a4a] rounded-md shadow-sm placeholder-gray-400 bg-white dark:bg-[#2f2f2f] text-gray-900 dark:text-bajet-cream focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <a href="#" className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-gray-300">Forgot password?</a>
              </div>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-[#4a4a4a] rounded-md shadow-sm placeholder-gray-400 bg-white dark:bg-[#2f2f2f] text-gray-900 dark:text-bajet-cream focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-[0_0_15px_rgba(249,115,22,0.4)] text-sm font-medium text-white bg-[#0f172a] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <a href="/register" onClick={onSwitch} className="font-semibold text-[#0f172a] dark:text-white hover:underline transition-colors cursor-pointer">
                Sign up
              </a>
            </p>
          </div>
    </>
  );
};

export default LoginForm;

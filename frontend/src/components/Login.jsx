import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LogoDoodle from './layout/LogoDoodle';

const Login = () => {
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
    <div className="min-h-screen bg-gray-200 dark:bg-black flex items-center justify-center p-4 sm:p-8 transition-colors">
      
      <div className="flex w-full max-w-5xl bg-white dark:bg-[#3a3a3a] rounded-3xl shadow-2xl overflow-hidden min-h-[650px]">
        {/* Left Column - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
          <img 
            src="/src/assets/auth_bg_kampung.jpg" 
            alt="Kampung Welcome Landscape" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 flex items-center justify-center z-10 drop-shadow-2xl">
            <LogoDoodle align="center" fontSize="4rem" height="80px" forceTheme="dark" />
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-8 sm:px-12 lg:px-16 xl:px-20 relative bg-white dark:bg-[#3a3a3a]">
          <div className="w-full max-w-sm mx-auto">
            
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-bajet-cream">
                Login
              </h2>
            </div>

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
              <Link to="/register" className="font-semibold text-[#0f172a] dark:text-white hover:underline transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

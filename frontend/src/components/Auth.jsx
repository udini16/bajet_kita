import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoDoodle from './layout/LogoDoodle';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(location.pathname !== '/register');

  useEffect(() => {
    setIsLogin(location.pathname !== '/register');
  }, [location.pathname]);

  const handleSwitchToRegister = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  const handleSwitchToLogin = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-black flex items-center justify-center p-4 sm:p-8 transition-colors overflow-hidden">
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

        {/* Right Column - Forms Container */}
        <div className="w-full lg:w-1/2 relative bg-white dark:bg-[#3a3a3a] overflow-hidden">
          
          {/* Login Form Wrapper */}
          <div 
            className={`absolute inset-0 flex flex-col justify-center py-12 px-8 sm:px-12 lg:px-16 xl:px-20 transition-transform duration-500 ease-in-out ${isLogin ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <div className="w-full max-w-sm mx-auto">
              <div className="flex flex-col items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-bajet-cream">Login</h2>
              </div>
              <LoginForm onSwitch={handleSwitchToRegister} />
            </div>
          </div>

          {/* Register Form Wrapper */}
          <div 
            className={`absolute inset-0 flex flex-col justify-center py-12 px-8 sm:px-12 lg:px-16 xl:px-20 transition-transform duration-500 ease-in-out ${isLogin ? 'translate-x-full' : 'translate-x-0'}`}
          >
            <div className="w-full max-w-sm mx-auto">
              <div className="flex flex-col items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-bajet-cream">Register</h2>
              </div>
              <RegisterForm onSwitch={handleSwitchToLogin} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;

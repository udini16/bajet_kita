import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LogoDoodle from './layout/LogoDoodle';
import api from '../utils/axios';

const CheckIcon = () => (
  <svg className="w-4 h-4 text-white opacity-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'iconFadeIn 0.3s ease-out 0.8s forwards' }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4 text-white opacity-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'iconFadeIn 0.3s ease-out 0.8s forwards' }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ErrorIcon = ({ message }) => (
  <div className="absolute bg-red-500 shadow-sm z-0 flex items-center justify-center cursor-pointer group" style={{ animation: 'lineToBadge 1s ease-in-out forwards' }}>
    <XIcon />
    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-max bg-gray-800 dark:bg-gray-700 text-white text-xs rounded py-1 px-2 z-20 shadow-lg">
      {message}
      <div className="absolute top-full right-2 border-[5px] border-transparent border-t-gray-800 dark:border-t-gray-700"></div>
    </div>
  </div>
);

const ValidIcon = () => (
  <div className="absolute bg-green-500 shadow-sm z-0 flex items-center justify-center" style={{ animation: 'lineToBadge 1s ease-in-out forwards' }}>
    <CheckIcon />
  </div>
);

const Register = () => {
  const [name, setName] = useState('');
  const [isNameTouched, setIsNameTouched] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  
  const [emailStatus, setEmailStatus] = useState('idle'); // idle, checking, available, taken, invalid
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkEmail = async () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        setEmailStatus('idle');
        return;
      }
      if (!emailRegex.test(email)) {
        setEmailStatus('invalid');
        return;
      }
      setEmailStatus('checking');
      try {
        const res = await api.post('/check-email', { email });
        setEmailStatus(res.data.available ? 'available' : 'taken');
      } catch (err) {
        setEmailStatus('invalid');
      }
    };

    const timer = setTimeout(() => {
      checkEmail();
    }, 500);

    return () => clearTimeout(timer);
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== passwordConfirmation) {
      return setError("Passwords do not match");
    }
    if (emailStatus !== 'available') {
      return setError("Please provide a valid and unique email");
    }
    try {
      await register(name, email, password, passwordConfirmation);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  const isNameValid = name.trim().length > 0 && isNameTouched;
  const isEmailValid = emailStatus === 'available';
  const isEmailError = emailStatus === 'taken' || emailStatus === 'invalid';
  const isPasswordValid = password.length >= 8;
  const isPasswordError = password.length > 0 && password.length < 8;
  const isConfirmValid = passwordConfirmation.length > 0 && password === passwordConfirmation;
  const isConfirmError = passwordConfirmation.length > 0 && password !== passwordConfirmation;

  const getInputClasses = (isValid, isError) => {
    const base = "appearance-none relative z-10 block w-full px-3 py-2 pr-10 border rounded-md sm:text-sm text-gray-900 dark:text-bajet-cream focus:outline-none focus:ring-0 placeholder-gray-400 transition-colors duration-300 ";
    if (isValid) return base + "bg-green-50/50 dark:bg-green-900/20 border-green-500 dark:border-green-500";
    if (isError) return base + "bg-red-50/50 dark:bg-red-900/20 border-red-500 dark:border-red-500";
    return base + "bg-transparent border-gray-300 dark:border-[#4a4a4a]";
  };

  const getEmailErrorMessage = () => {
    if (emailStatus === 'taken') return 'Email is already taken';
    if (emailStatus === 'invalid') return 'Invalid email format';
    return '';
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
            <LogoDoodle align="center" fontSize="4rem" height="80px" />
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-8 sm:px-12 lg:px-16 xl:px-20 relative bg-white dark:bg-[#3a3a3a]">
          <div className="w-full max-w-sm mx-auto">
            
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-bajet-cream">
                Register
              </h2>
            </div>

          {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <div className="mt-1 relative overflow-hidden rounded-md bg-white dark:bg-[#2f2f2f]">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setIsNameTouched(false);
                  }}
                  onBlur={() => setIsNameTouched(true)}
                  className={getInputClasses(isNameValid, false)}
                />
                {isNameValid && <ValidIcon />}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
              <div className="mt-1 relative overflow-hidden rounded-md bg-white dark:bg-[#2f2f2f]">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={getInputClasses(isEmailValid, isEmailError)}
                />
                {isEmailValid && <ValidIcon />}
                {isEmailError && <ErrorIcon message={getEmailErrorMessage()} />}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="mt-1 relative overflow-hidden rounded-md bg-white dark:bg-[#2f2f2f]">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={getInputClasses(isPasswordValid, isPasswordError)}
                />
                {isPasswordValid && <ValidIcon />}
                {isPasswordError && <ErrorIcon message="Must be at least 8 characters" />}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
              <div className="mt-1 relative overflow-hidden rounded-md bg-white dark:bg-[#2f2f2f]">
                <input
                  type="password"
                  required
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className={getInputClasses(isConfirmValid, isConfirmError)}
                />
                {isConfirmValid && <ValidIcon />}
                {isConfirmError && <ErrorIcon message="Passwords do not match" />}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-[0_0_15px_rgba(249,115,22,0.4)] text-sm font-medium text-white bg-[#0f172a] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign up
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#0f172a] dark:text-white hover:underline transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Register;


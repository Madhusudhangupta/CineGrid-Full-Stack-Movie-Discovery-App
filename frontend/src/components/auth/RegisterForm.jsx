import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '@/utils/api';
import { useTranslation } from 'react-i18next';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { motion } from 'framer-motion';

export default function RegisterForm() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', { name, email, password });
      navigate('/login');
    } catch (err) {
      setError(t('error.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-900"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-center mb-6">{t('Register')}</h2>

      {/* Name */}
      <div className="relative mb-6">
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder=" "
          autoComplete="name"
          className="peer w-full p-3 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all"
        />
        <label
          htmlFor="name"
          className="absolute left-3 top-3 text-gray-500 dark:text-gray-400 text-sm transition-all 
            peer-placeholder-shown:top-3 
            peer-placeholder-shown:text-base 
            peer-placeholder-shown:text-gray-400 
            peer-focus:top-[-0.5rem] 
            peer-focus:text-xs 
            peer-focus:text-blue-500 
            peer-focus:dark:text-blue-400 
            bg-white dark:bg-gray-800 px-1"
        >
          {t('Name')}
        </label>
      </div>

      {/* Email */}
      <div className="relative mb-6">
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder=" "
          autoComplete="email"
          className="peer w-full p-3 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all"
        />
        <label
          htmlFor="email"
          className="absolute left-3 top-3 text-gray-500 dark:text-gray-400 text-sm transition-all 
            peer-placeholder-shown:top-3 
            peer-placeholder-shown:text-base 
            peer-placeholder-shown:text-gray-400 
            peer-focus:top-[-0.5rem] 
            peer-focus:text-xs 
            peer-focus:text-blue-500 
            peer-focus:dark:text-blue-400 
            bg-white dark:bg-gray-800 px-1"
        >
          {t('Email')}
        </label>
      </div>

      {/* Password */}
      <div className="relative mb-6">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder=" "
          autoComplete="new-password"
          className="peer w-full p-3 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all pr-10"
        />
        <label
          htmlFor="password"
          className="absolute left-3 top-3 text-gray-500 dark:text-gray-400 text-sm transition-all 
            peer-placeholder-shown:top-3 
            peer-placeholder-shown:text-base 
            peer-placeholder-shown:text-gray-400 
            peer-focus:top-[-0.5rem] 
            peer-focus:text-xs 
            peer-focus:text-blue-500 
            peer-focus:dark:text-blue-400 
            bg-white dark:bg-gray-800 px-1"
        >
          {t('Password')}
        </label>

        {/* Show/Hide Password Button */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label={showPassword ? t('Hide password') : t('Show password')}
        >
          {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
        </button>
      </div>

      {/* Error */}
      {error && (
        <motion.p
          className="text-red-500 mb-3 text-sm text-center"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!name || !email || !password || loading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white p-3 rounded-lg font-medium transition-all flex items-center justify-center"
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 
              0 0 5.373 0 12h4z"
            ></path>
          </svg>
        ) : (
          t('Register')
        )}
      </button>

      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        {t("Already have an account?")}{' '}
        <Link
          to="/login"
          className="text-blue-500 hover:underline hover:text-blue-600 dark:hover:text-blue-400"
        >
          {t('Login')}
        </Link>
      </div>
    </motion.form>
  );
}

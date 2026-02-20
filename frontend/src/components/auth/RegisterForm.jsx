import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/utils/api';
import { useTranslation } from 'react-i18next';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { motion } from 'framer-motion';

export default function RegisterForm() {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const MotionForm = motion.form;
  const MotionP = motion.p;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/register', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim(),
        password,
      });
      navigate('/login');
    } catch (err) {
      const data = err?.response?.data;
      const apiError = data?.error || data?.message;
      const validationDetails = Array.isArray(data?.details) ? data.details[0] : '';
      const networkError = err?.message === 'Network Error' ? 'Unable to reach server. Check backend is running.' : '';
      setError(apiError || validationDetails || networkError || t('error.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionForm
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-900"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-center mb-6">{t('Register')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="auth-field">
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder=" "
            autoComplete="given-name"
            className="auth-input"
          />
          <label
            htmlFor="firstName"
            className="auth-label"
          >
            First name
          </label>
        </div>

        <div className="auth-field">
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder=" "
            autoComplete="family-name"
            className="auth-input"
          />
          <label
            htmlFor="lastName"
            className="auth-label"
          >
            Last name
          </label>
        </div>
      </div>

      <div className="auth-field mb-6">
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))}
          required
          placeholder=" "
          autoComplete="username"
          className="auth-input"
        />
        <label
          htmlFor="username"
          className="auth-label"
        >
          Username
        </label>
      </div>

      <div className="auth-field mb-6">
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder=" "
          autoComplete="email"
          className="auth-input"
        />
        <label
          htmlFor="email"
          className="auth-label"
        >
          {t('Email')}
        </label>
      </div>

      <div className="auth-field mb-6">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder=" "
          autoComplete="new-password"
          className="auth-input pr-10"
        />
        <label
          htmlFor="password"
          className="auth-label"
        >
          {t('Password')}
        </label>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label={showPassword ? t('Hide password') : t('Show password')}
        >
          {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
        </button>
      </div>

      <div className="auth-field mb-6">
        <input
          id="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder=" "
          autoComplete="new-password"
          className="auth-input pr-10"
        />
        <label
          htmlFor="confirmPassword"
          className="auth-label"
        >
          Confirm password
        </label>
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
        >
          {showConfirmPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
        </button>
      </div>

      {error && (
        <MotionP
          className="text-red-500 mb-3 text-sm text-center"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          {error}
        </MotionP>
      )}

      <button
        type="submit"
        disabled={
          !firstName.trim() ||
          !lastName.trim() ||
          !username.trim() ||
          !email.trim() ||
          !password ||
          !confirmPassword ||
          loading
        }
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white p-3 rounded-lg font-medium transition-all flex items-center justify-center"
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          t('Register')
        )}
      </button>

      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        {t('Already have an account?')}{' '}
        <Link
          to="/login"
          className="text-blue-500 hover:underline hover:text-blue-600 dark:hover:text-blue-400"
        >
          {t('Login')}
        </Link>
      </div>
    </MotionForm>
  );
}

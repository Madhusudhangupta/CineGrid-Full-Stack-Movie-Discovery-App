import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '@/store/authSlice';
import { Link } from 'react-router-dom';
import api from '@/utils/api';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { motion } from 'framer-motion';

export default function LoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const MotionForm = motion.form;
  const MotionP = motion.p;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { identifier, password });
      localStorage.setItem('token', response.data.token);
      dispatch(login(response.data.user));
      navigate('/');
    } catch {
      setError('Invalid credentials');
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
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

      {/* Email or Username */}
      <div className="auth-field mb-6">
        <input
          id="identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          placeholder=" "
          autoComplete="username"
          className="auth-input"
        />
        <label
          htmlFor="identifier"
          className="auth-label"
        >
          Email or Username
        </label>
      </div>


      {/* Password */}
      <div className="auth-field mb-6">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder=" "
          autoComplete="current-password"
          className="auth-input pr-10"
        />
        
        {/* Floating Label */}
        <label
          htmlFor="password"
          className="auth-label"
        >
          Password
        </label>

        {/* Show/Hide Password Button */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
        </button>
      </div>


      {/* Error */}
      {error && (
        <MotionP
          className="text-red-500 mb-3 text-sm text-center"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          {error}
        </MotionP>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!identifier || !password || loading}
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
          Login
        )}
      </button>

      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-blue-500 hover:underline hover:text-blue-600 dark:hover:text-blue-400"
        >
          Register
        </Link>
      </div>


    </MotionForm>
  );
}

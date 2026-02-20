
import LoginForm from '@/components/auth/LoginForm';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-4 sm:py-8">
      <div className="mx-auto mb-4 w-full max-w-md text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Sign in to continue with your watchlists and personalized recommendations.
        </p>
      </div>
      <LoginForm />
    </section>
  );
}

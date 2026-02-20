
import RegisterForm from '@/components/auth/RegisterForm';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Register() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-4 sm:py-8">
      <div className="mx-auto mb-4 w-full max-w-md text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Create your account to save watchlists and recommendations.
        </p>
      </div>
      <RegisterForm />
    </section>
  );
}

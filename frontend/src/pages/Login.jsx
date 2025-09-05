
import LoginForm from '@/components/auth/LoginForm';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('login')}</h1>
      <LoginForm />
    </div>
  );
}
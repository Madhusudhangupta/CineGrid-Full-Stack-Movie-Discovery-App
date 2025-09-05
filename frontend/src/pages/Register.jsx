
import RegisterForm from '@/components/auth/RegisterForm';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('register')}</h1>
      <RegisterForm />
    </div>
  );
}

import { useTranslation } from 'react-i18next';

export default function Offline() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold">{t('offline')}</h1>
      <p>You are currently offline. Please check your connection.</p>
    </div>
  );
}
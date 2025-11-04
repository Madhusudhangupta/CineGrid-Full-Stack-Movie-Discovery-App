
import { useAuth } from '@/hooks/useAuth';
import UserProfile from '@/components/user/UserProfile';
import Watchlist from '@/components/user/WatchList';
import Achievements from '@/components/user/Achievements';
import Recommendations from '@/components/user/Recommendations';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();

  if (!isAuthenticated) {
    return <div className="container mx-auto p-4 text-red-500">{t('loginRequired')}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{t('profile')}</h1>
      <UserProfile user={user} />
      <Watchlist />
      <Recommendations />
      <Achievements />
    </div>
  );
}

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Watchlist from '@/components/user/WatchList';
import Achievements from '@/components/user/Achievements';
import Recommendations from '@/components/user/Recommendations';
import { useTranslation } from 'react-i18next';

const formatMemberSince = (dateValue) => {
  if (!dateValue) return 'Recently';
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return 'Recently';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
};

export default function Profile() {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const firstName = user?.firstName || user?.name?.split(' ')?.[0] || 'User';
  const lastName = user?.lastName || user?.name?.split(' ')?.slice(1).join(' ') || '';
  const fullName = `${firstName} ${lastName}`.trim() || user?.name || 'User';
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  const username = user?.username ? `@${user.username}` : '';

  return (
    <section className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-4 sm:py-8">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr),320px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-sky-500 text-lg font-bold text-white sm:h-16 sm:w-16 sm:text-xl">
              {initials}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                {fullName}
              </h1>
              {username && (
                <p className="mt-1 text-sm text-sky-600 dark:text-sky-300">{username}</p>
              )}
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{user?.email}</p>
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Account</h2>
          <div className="mt-3 space-y-3 text-sm">
            <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-white/5">
              <p className="text-slate-500 dark:text-slate-400">Member since</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {formatMemberSince(user?.createdAt)}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-white/5">
              <p className="text-slate-500 dark:text-slate-400">Primary email</p>
              <p className="font-medium break-all text-slate-900 dark:text-white">{user?.email}</p>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-white/5">
              <p className="text-slate-500 dark:text-slate-400">Status</p>
              <p className="font-medium text-emerald-600 dark:text-emerald-400">Active</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-6 space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-5">
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">{t('watchlist')}</h2>
          <Watchlist />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-5">
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">{t('recommendations')}</h2>
          <Recommendations />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-5">
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Achievements</h2>
          <Achievements />
        </section>
      </div>
    </section>
  );
}

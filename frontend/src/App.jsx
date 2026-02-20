import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import SearchBar from '@/components/layout/SearchBar';

export default function App() {
  const location = useLocation();
  const hideSearchBar =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/offline';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020b1f] dark:text-slate-100">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-6">
        {!hideSearchBar && (
          <div className="mb-5">
            <SearchBar />
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}

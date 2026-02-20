import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';
import { clearResults } from '@/store/searchSlice';
import { useAuth } from '@/hooks/useAuth';
import DarkModeSwitch from '@/components/layout/DarkModeSwitch';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function Header() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const accountRef = useRef(null);

  const accountLabel = useMemo(() => {
    const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
    return fullName || user?.username || user?.email || 'Account';
  }, [user]);

  const accountInitial = useMemo(() => {
    const src = user?.firstName || user?.username || user?.email || 'U';
    return src.charAt(0).toUpperCase();
  }, [user]);

  const linkClass = ({ isActive }) =>
    `inline-flex h-9 items-center rounded-full px-3 text-sm font-medium transition ${
      isActive
        ? 'bg-white/20 text-white shadow-sm ring-1 ring-white/30'
        : 'text-white/85 hover:bg-white/10 hover:text-white'
    }`;

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    setAccountOpen(false);
    setMobileOpen(false);
  };

  const handleGoHome = () => {
    dispatch(clearResults());
    setAccountOpen(false);
    setMobileOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const onClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07142e]/85 shadow-lg shadow-black/20 backdrop-blur-xl">
      <div className="header-grad relative">
        <div className="mx-auto flex h-15 w-full max-w-7xl items-center gap-3 px-3 sm:h-16 sm:px-4">

          {/* Logo */}
          <NavLink
            to="/"
            onClick={handleGoHome}
            className="flex items-baseline gap-1 select-none"
          >
            <span className="text-lg font-extrabold tracking-wide text-sky-400 sm:text-xl lg:text-2xl">
              CINE
            </span>
            <span className="text-lg font-light tracking-wide text-white sm:text-xl lg:text-2xl">
              SPHERE
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-2 lg:gap-3 md:flex">
            <NavLink to="/discover" className={linkClass}>
              Discover
            </NavLink>
          </nav>

          {/* Right Section */}
          <div className="ml-auto flex items-center gap-2">

            <DarkModeSwitch />

            {isAuthenticated ? (
              <div ref={accountRef} className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm text-white hover:bg-white/20"
                  aria-label="Open account menu"
                  aria-expanded={accountOpen}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/85 text-xs font-semibold text-white">
                    {accountInitial}
                  </span>
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-white/15 bg-[#081733] p-2 shadow-xl shadow-black/30">
                    <div className="mb-1 rounded-lg px-2 py-1.5">
                      <p className="truncate text-sm font-semibold text-white">
                        {accountLabel}
                      </p>
                      <p className="truncate text-xs text-white/60">
                        {user?.email || ''}
                      </p>
                    </div>

                    <NavLink
                      to="/profile"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-white"
                    >
                      Profile
                    </NavLink>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-300 hover:bg-rose-500/15"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center gap-2">
                  <NavLink
                    to="/login"
                    className="rounded-full px-3 py-1.5 text-sm text-white/90 hover:bg-white/10 hover:text-white"
                  >
                    Log in
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
                  >
                    Sign up
                  </NavLink>
                </div>

                {/* Mobile Menu Button */}
                <button
                  type="button"
                  onClick={() => setMobileOpen((v) => !v)}
                  className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white hover:bg-white/10"
                  aria-expanded={mobileOpen}
                >
                  {mobileOpen ? '✕' : '☰'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Auth Menu */}
        {!isAuthenticated && mobileOpen && (
          <div className="border-t border-white/10 px-4 py-3 md:hidden">
            <div className="grid grid-cols-2 gap-2">
              <NavLink
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-white/20 px-3 py-2 text-center text-white hover:bg-white/10"
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-white/20 px-3 py-2 text-center text-white hover:bg-white/10"
              >
                Sign up
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
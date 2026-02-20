import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, systemThemeChanged } from '@/store/themeSlice';

export default function DarkModeSwitch() {
  const dispatch = useDispatch();
  const { isDarkMode, userPref } = useSelector((s) => s.theme);

  // Apply/remove the 'dark' class on <html> and persist
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add('dark');
    else root.classList.remove('dark');
    // meta theme-color (nice-to-have for mobile address bar)
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDarkMode ? '#0b1020' : '#ffffff');
  }, [isDarkMode]);

  // Follow system preference only if user hasn't chosen explicitly
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => dispatch(systemThemeChanged(e.matches ? 'dark' : 'light'));
    // Initial sync when userPref is null (handled in slice init)
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else mq.removeListener(handler);
    };
  }, [dispatch, userPref]);

  const onToggle = () => dispatch(toggleTheme());

  return (
    <button
      type="button"
      onClick={onToggle}
      className="px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      aria-pressed={isDarkMode}
      aria-label="Toggle dark mode"
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? '🌙' : '☀️'}
    </button>
  );
}

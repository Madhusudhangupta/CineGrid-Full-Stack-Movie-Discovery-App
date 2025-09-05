import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '@/store/themeSlice';
import { useEffect } from 'react';
import { MdOutlineLightMode, MdDarkMode } from 'react-icons/md';

export default function DarkModeSwitch() {
  const { isDarkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white hover:text-amber-500 transition-colors duration-300"
    >
      {isDarkMode ? (
        <MdOutlineLightMode className="text-2xl" />
      ) : (
        <MdDarkMode className="text-2xl" />
      )}
    </button>
  );
}

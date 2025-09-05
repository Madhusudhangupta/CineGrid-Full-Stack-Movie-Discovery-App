
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DarkModeSwitch from './DarkModeSwitch';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t } = useTranslation();
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
         <NavLink
            to="/"
            className="text-xl font-bold hover:text-gray-300 transition-colors"
          >
            {t('welcome')}
        </NavLink>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <DarkModeSwitch />
        </div>
      </div>
    </header>
  );
}
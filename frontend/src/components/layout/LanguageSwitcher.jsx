
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <select
      onChange={(e) => changeLanguage(e.target.value)}
      className="p-2 rounded bg-gray-200 dark:bg-gray-600"
    >
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}
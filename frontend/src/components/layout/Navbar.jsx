import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';
import { useTranslation } from 'react-i18next';
import { FaUserCircle } from 'react-icons/fa'; 

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
  };

  return (
    <nav className="bg-gray-700 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Left nav links */}
        <ul className="flex space-x-4">
          <li><NavLink to="/" className="hover:underline">{t('home')}</NavLink></li>
          {isAuthenticated ? (
            <>
              {/* Optional logout button in menu */}
              <li>
                <button onClick={handleLogout} className="hover:underline">
                  {t('logout')}
                </button>
              </li>
            </>
          ) : (
            <>
              <li><NavLink to="/login" className="hover:underline">{t('login')}</NavLink></li>
              <li><NavLink to="/register" className="hover:underline">{t('register')}</NavLink></li>
            </>
          )}
        </ul>

        {/* Right profile icon */}
        {isAuthenticated && (
          <NavLink to="/profile" className="text-white hover:text-blue-300" title={t('profile')}>
            <FaUserCircle size={28} />
          </NavLink>
        )}
      </div>
    </nav>
  );
}

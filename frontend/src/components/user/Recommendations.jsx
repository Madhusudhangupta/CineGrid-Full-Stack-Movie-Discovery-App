
import { useState, useEffect } from 'react';
import api from '@/utils/api';
import MovieCard from '@/components/movie/MovieCard';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

export default function Recommendations() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/recommendations')
        .then((response) => setRecommendations(response.data))
        .catch((err) => setError(t('error.fetchRecommendations')));
    }
  }, [isAuthenticated, t]);

  if (!isAuthenticated) {
    return <div className="container mx-auto p-4 text-red-500">{t('loginRequired')}</div>;
  }

  return (
    <div className="my-4">
      <h2 className="text-xl font-bold">{t('recommendations')}</h2>
      {error && <p className="text-red-500">{error}</p>}
      {recommendations.length === 0 ? (
        <p>{t('noRecommendations')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recommendations.map((rec) => (
            <div key={rec._id} className="border p-4 rounded">
              <MovieCard movie={rec.movie} />
              {rec.reason && <p className="mt-2">{t('reason')}: {rec.reason}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
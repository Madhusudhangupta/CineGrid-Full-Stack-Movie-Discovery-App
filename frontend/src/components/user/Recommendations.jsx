
import { useState, useEffect } from 'react';
import api from '@/utils/api';
import MovieCard from '@/components/movie/MovieCard';
import { useAuth } from '@/hooks/useAuth';

export default function Recommendations() {
  const { isAuthenticated } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/recommendations')
        .then((response) => setRecommendations(response.data))
        .catch(() => setError('Failed to load recommendations'));
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div className="container mx-auto p-4 text-red-500">Please log in to view recommendations</div>;
  }

  return (
    <div className="my-4">
      <h2 className="text-xl font-bold">Recommendations</h2>
      {error && <p className="text-red-500">{error}</p>}
      {recommendations.length === 0 ? (
        <p>No recommendations available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recommendations.map((rec) => (
            <div key={rec._id} className="border p-4 rounded">
              <MovieCard movie={rec.movie} />
              {rec.reason && <p className="mt-2">Reason: {rec.reason}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

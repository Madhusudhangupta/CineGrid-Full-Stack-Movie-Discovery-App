
import { useWatchlist } from '@/hooks/useWatchlist';
import MovieCard from '@/components/movie/MovieCard';
import { useTranslation } from 'react-i18next';

export default function Watchlist() {
  const { t } = useTranslation();
  const { watchlist } = useWatchlist();

  return (
    <div className="my-4">
      <h2 className="text-xl font-bold">{t('watchlist')}</h2>
      {watchlist.length === 0 ? (
        <p>{t('noWatchlist')}</p>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
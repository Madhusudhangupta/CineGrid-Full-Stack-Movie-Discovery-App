import { Link } from 'react-router-dom';
import { useWatchlist } from '@/hooks/useWatchlist';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

export default function MovieCard({ movie }) {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const isInWatchlist = watchlist.some((item) => item.id === movie.id);

  const handleClick = () => {
    isInWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie.id);
  };

  return (
    <div className="relative w-full h-full border rounded-md p-3 bg-gray-100 dark:bg-gray-800 text-black dark:text-white flex flex-col transition-transform transform hover:scale-[1.02] hover:shadow-md">
      {/* Floating Heart Icon */}
      <div className="absolute top-2 right-2 z-10 group">
        <button
          onClick={handleClick}
          className="text-red-600 dark:text-red-400 text-2xl sm:text-3xl hover:scale-110 transition-transform drop-shadow-md"
          aria-label={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >

          {isInWatchlist ? <AiFillHeart /> : <AiOutlineHeart />}
        </button>
        <div className="absolute top-full right-0 mt-1 px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        </div>
      </div>

      {/* Poster & Title */}
      <Link to={`/movie/${movie.id}`} className="flex flex-col items-center flex-grow">
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover rounded"
        />
        <h3 className="text-md font-medium mt-2 text-center min-h-[3rem] flex items-center justify-center text-wrap">
          {movie.title}
        </h3>
      </Link>
    </div>
  );
}

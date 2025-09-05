
import MovieCard from './MovieCard';

export default function SimilarMovies({ movies }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">Similar Movies</h2>
      <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
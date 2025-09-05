
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieById, fetchSimilarMovies, fetchReviews } from '@/utils/api';
import SimilarMovies from '@/components/movie/SimilarMovies';
import ReviewsList from '@/components/reviews/ReviewsList';
import ReviewForm from '@/components/reviews/ReviewForm';
import TrailerModal from '@/components/movie/TrailerModal';
import { useAuth } from '@/hooks/useAuth';

export default function MovieDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovieById(id)
      .then(setMovie)
      .catch((err) => setError('Failed to load movie details'));
    fetchSimilarMovies(id).then(setSimilarMovies);
    fetchReviews(id).then(setReviews);
  }, [id]);

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!movie) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-auto max-w-full h-48 sm:h-56 md:h-64 lg:h-96 xl:h-[30rem] xl:max-w-[24rem] 2xl:h-[36rem] 2xl:max-w-[28rem] object-cover rounded mx-auto"
      />

      <p>{movie.overview}</p>
      <TrailerModal movieId={id} />
      {isAuthenticated && <ReviewForm movieId={id} setReviews={setReviews} />}
      <ReviewsList reviews={reviews} />
      <SimilarMovies movies={similarMovies} />
    </div>
  );
}
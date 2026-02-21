// cinesphere/frontend/src/pages/MovieDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieById, fetchSimilarMovies, fetchReviews } from "@/utils/api";
import TrailerModal from "@/components/movie/TrailerModal";
import ReviewsList from "@/components/reviews/ReviewsList";
import ReviewForm from "@/components/reviews/ReviewForm";
import SimilarMovies from "@/components/movie/SimilarMovies";
import WhereToWatch from "@/components/movie/WhereToWatch";
import RatingsSummary from "@/components/reviews/RatingsSummary";
import { useAuth } from "@/hooks/useAuth";
import { useWatchlist } from "@/hooks/useWatchlist";
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

const MovieDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  const isInWatchlist = watchlist.some((item) => item.id === Number(id));

  const handleAddToWatchlist = (e) => {
    e.preventDefault();
    if (isInWatchlist) {
      removeFromWatchlist(Number(id));
    } else {
      addToWatchlist(Number(id));
    }
  };

  useEffect(() => {
    setMovie(null);
    Promise.all([
      fetchMovieById(id),
      fetchSimilarMovies(id),
      fetchReviews(id, { page: 1, limit: 10 }),
    ])
      .then(([m, s, r]) => {
        setMovie(m);
        setSimilarMovies(s);
        setReviews(r.items || r);
      })
      .catch((e) => setError(e?.message || "Failed to load movie"));
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!movie) return <p className="opacity-70">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[320px] flex-shrink-0">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded w-full object-cover shadow-lg"
            loading="lazy"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">{movie.title}</h1>
              {movie.tagline && <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{movie.tagline}</p>}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-sm text-slate-700">{movie.release_date?.slice(0,4)}</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-sm text-slate-700">{movie.runtime} min</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-sm text-slate-700">{movie.original_language?.toUpperCase()}</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-yellow-100 text-sm text-yellow-800">⭐ {movie.vote_average?.toFixed(1)}</span>
              </div>

              {Array.isArray(movie.genres) && movie.genres.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <button key={g.id} className="text-xs px-2 py-1 rounded-md border border-slate-200 text-slate-700 dark:text-slate-200 bg-white/60 dark:bg-white/5">{g.name}</button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-shrink-0 flex flex-col items-end gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToWatchlist}
                  className="text-red-600 dark:text-red-400 text-3xl hover:scale-110 transition-transform"
                  aria-label={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                >
                  {isInWatchlist ? <AiFillHeart /> : <AiOutlineHeart />}
                </button>

                <TrailerModal movieId={id} />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                {Array.isArray(movie.production_companies) && movie.production_companies.slice(0,3).map((pc) => (
                  pc.logo_path ? (
                    <img key={pc.id} src={`https://image.tmdb.org/t/p/w92${pc.logo_path}`} alt={pc.name} title={pc.name} className="h-6 object-contain"/>
                  ) : (
                    <span key={pc.id} className="px-1">{pc.name}</span>
                  )
                ))}
              </div>
            </div>
          </div>

          <section className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Overview</h2>
            <p className="text-slate-700 dark:text-slate-300">{movie.overview}</p>
          </section>

          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <RatingsSummary movieId={Number(id)} />
            <WhereToWatch movieId={Number(id)} />
          </div>
        </div>
      </header>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Similar Movies</h2>
        <SimilarMovies movies={similarMovies} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Reviews</h2>
        {isAuthenticated && <ReviewForm movieId={Number(id)} setReviews={setReviews} />}
        <ReviewsList reviews={reviews} />
      </div>
    </div>
  );
};

export default MovieDetail;



// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { fetchMovieById, fetchSimilarMovies, fetchReviews } from '@/utils/api';
// import SimilarMovies from '@/components/movie/SimilarMovies';
// import ReviewsList from '@/components/reviews/ReviewsList';
// import ReviewForm from '@/components/reviews/ReviewForm';
// import TrailerModal from '@/components/movie/TrailerModal';
// import { useAuth } from '@/hooks/useAuth';

// export default function MovieDetail() {
//   const { id } = useParams();
//   const { isAuthenticated } = useAuth();
//   const [movie, setMovie] = useState(null);
//   const [similarMovies, setSimilarMovies] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchMovieById(id)
//       .then(setMovie)
//       .catch((err) => setError('Failed to load movie details'));
//     fetchSimilarMovies(id).then(setSimilarMovies);
//     fetchReviews(id).then(setReviews);
//   }, [id]);

//   if (error) {
//     return <div className="container mx-auto p-4 text-red-500">{error}</div>;
//   }

//   if (!movie) return <div className="container mx-auto p-4">Loading...</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold">{movie.title}</h1>
//       <img
//         src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//         alt={movie.title}
//         className="w-auto max-w-full h-48 sm:h-56 md:h-64 lg:h-96 xl:h-[30rem] xl:max-w-[24rem] 2xl:h-[36rem] 2xl:max-w-[28rem] object-cover rounded mx-auto"
//       />

//       <p>{movie.overview}</p>
//       <TrailerModal movieId={id} />
//       {isAuthenticated && <ReviewForm movieId={id} setReviews={setReviews} />}
//       <ReviewsList reviews={reviews} />
//       <SimilarMovies movies={similarMovies} />
//     </div>
//   );
// }
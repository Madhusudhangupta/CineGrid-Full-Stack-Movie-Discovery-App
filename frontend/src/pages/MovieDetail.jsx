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

const MovieDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

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
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          className="rounded w-full md:w-[300px] h-auto"
          loading="lazy"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-semibold">{movie.title}</h1>
          <p className="opacity-80 mt-2">{movie.overview}</p>
          <TrailerModal movieId={id} />
          <RatingsSummary movieId={Number(id)} />
          <WhereToWatch movieId={Number(id)} />
        </div>
      </div>

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
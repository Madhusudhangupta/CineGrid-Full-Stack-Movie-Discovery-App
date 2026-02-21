import { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { postReview } from '@/utils/api';

export default function ReviewForm({ movieId, setReviews }) {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const review = await postReview({ movieId, rating, comment });
      setReviews((prev) => [...prev, review]);
      setRating(1);
      setComment('');
    } catch {
      setError('Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-4">
      {/* Star Rating */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Rating</label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              type="button"
              key={num}
              onClick={() => setRating(num)}
              className="focus:outline-none"
              aria-label={`Rate ${num} star${num > 1 ? 's' : ''}`}
            >
              {num <= rating ? (
                <AiFillStar className="text-yellow-400 text-2xl" />
              ) : (
                <AiOutlineStar className="text-yellow-400 text-2xl" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm">Comment</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
      >
        "Submit"
      </button>
    </form>
  );
}

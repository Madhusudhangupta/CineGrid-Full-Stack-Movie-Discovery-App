
import ReviewCard from './ReviewCard';

export default function ReviewsList({ reviews }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => <ReviewCard key={review._id} review={review} />)
      )}
    </div>
  );
}
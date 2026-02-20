
import ReviewCard from './ReviewCard';

export default function ReviewsList({ reviews }) {
  const reviewItems = Array.isArray(reviews) ? reviews : (reviews?.items || []);
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">Reviews</h2>
      {reviewItems.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviewItems.map((review) => <ReviewCard key={review._id} review={review} />)
      )}
    </div>
  );
}

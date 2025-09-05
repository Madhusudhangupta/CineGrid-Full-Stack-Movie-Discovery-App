
export default function ReviewCard({ review }) {
  return (
    <div className="border p-4 rounded my-2">
      <p className="font-bold">{review.user.name}</p>
      <p>Rating: {review.rating}/5</p>
      <p>{review.comment}</p>
      <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
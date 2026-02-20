
import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

export default function CommentsSection({ movieId }) {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/comments/${movieId}`)
      .then((response) => setComments(response.data?.items || []))
      .catch(() => setError('Failed to load comments'));
  }, [movieId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please log in to comment');
      return;
    }
    try {
      const response = await api.post('/comments', { movieId, comment: newComment });
      setComments((prev) => [...prev, response.data]);
      setNewComment('');
    } catch {
      setError('Failed to post comment');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((comment) => comment._id !== commentId));
    } catch {
      setError('Failed to delete comment');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">Comments</h2>
      {error && <p className="text-red-500">{error}</p>}
      {comments.length === 0 ? (
        <p>No comments yet</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="border p-4 rounded my-2">
            <p className="font-bold">{comment.user.name}</p>
            <p>{comment.comment}</p>
            <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
            {isAuthenticated && comment.user?._id === (user?.id || user?._id) && (
              <button
                onClick={() => handleDelete(comment._id)}
                className="text-red-500 mt-2"
              >
                Delete
              </button>
            )}
          </div>
        ))
      )}
      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="my-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Write a comment..."
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
        </form>
      )}
    </div>
  );
}

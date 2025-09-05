
import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

export default function CommentsSection({ movieId }) {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/comments/${movieId}`)
      .then((response) => setComments(response.data))
      .catch((err) => setError(t('error.fetchComments')));
  }, [movieId, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError(t('error.loginRequired'));
      return;
    }
    try {
      const response = await api.post('/comments', { movieId, comment: newComment });
      setComments((prev) => [...prev, response.data]);
      setNewComment('');
    } catch (err) {
      setError(t('error.commentFailed'));
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((comment) => comment._id !== commentId));
    } catch (err) {
      setError(t('error.deleteComment'));
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">{t('comments')}</h2>
      {error && <p className="text-red-500">{error}</p>}
      {comments.length === 0 ? (
        <p>{t('noComments')}</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="border p-4 rounded my-2">
            <p className="font-bold">{comment.user.name}</p>
            <p>{comment.comment}</p>
            <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
            {isAuthenticated && comment.user._id === useAuth().user?.id && (
              <button
                onClick={() => handleDelete(comment._id)}
                className="text-red-500 mt-2"
              >
                {t('delete')}
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
            placeholder={t('writeComment')}
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">{t('submit')}</button>
        </form>
      )}
    </div>
  );
}
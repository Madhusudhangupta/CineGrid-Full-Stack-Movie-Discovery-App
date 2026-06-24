import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFeed } from '@/utils/api';
import Shimmer from '@/components/layout/Shimmer';

const ActivityItem = ({ activity }) => {
  const { user, type, media, mediaType, rating, listId, createdAt } = activity;
  const timeAgo = new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const renderContent = () => {
    switch (type) {
      case 'USER_RATED_MOVIE':
        return (
          <p className="text-sm text-slate-700 dark:text-slate-300">
            rated <Link to={`/${mediaType}/${media?.id}`} className="font-semibold text-sky-600 hover:underline">{media?.title || media?.name || 'a title'}</Link> {rating} ⭐
          </p>
        );
      case 'USER_ADDED_TO_WATCHLIST':
        return (
          <p className="text-sm text-slate-700 dark:text-slate-300">
            added <Link to={`/${mediaType}/${media?.id}`} className="font-semibold text-sky-600 hover:underline">{media?.title || media?.name || 'a title'}</Link> to their watchlist
          </p>
        );
      case 'USER_CREATED_CUSTOM_LIST':
        return (
          <p className="text-sm text-slate-700 dark:text-slate-300">
            created a new list: <span className="font-semibold text-sky-600">{listId?.name || 'Unknown List'}</span>
          </p>
        );
      default:
        return <p className="text-sm text-slate-700 dark:text-slate-300">performed an activity</p>;
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 border-b border-slate-100 dark:border-white/10 last:border-0">
      <div className="flex-shrink-0">
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-slate-900 dark:text-white truncate">{user?.name}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">{timeAgo}</span>
        </div>
        <div className="mt-1">
          {renderContent()}
        </div>
        {media && (type === 'USER_RATED_MOVIE' || type === 'USER_ADDED_TO_WATCHLIST') && (
          <div className="mt-3 flex gap-3 p-2 rounded bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
            {media.poster_path && (
              <img src={`https://image.tmdb.org/t/p/w92${media.poster_path}`} alt="poster" className="w-12 h-auto object-cover rounded" />
            )}
            <div className="flex flex-col justify-center">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{media.title || media.name}</span>
              <span className="text-xs text-slate-500">{media.release_date?.substring(0,4) || media.first_air_date?.substring(0,4)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ActivityFeed() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchFeed(1, 20)
      .then((data) => {
        if (mounted) {
          setFeed(data.items || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || 'Failed to load feed');
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  if (loading) return <Shimmer />;
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;
  if (feed.length === 0) return <p className="text-sm text-slate-500 p-4">No recent activity. Follow more users to see their updates here!</p>;

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-white/10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Activity Feed</h2>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-white/10 max-h-[600px] overflow-y-auto custom-scrollbar">
        {feed.map(item => (
          <ActivityItem key={item._id} activity={item} />
        ))}
      </div>
    </div>
  );
}

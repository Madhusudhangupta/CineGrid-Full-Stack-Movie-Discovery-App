import { useEffect, useState } from 'react';
import { fetchProfileStats } from '@/utils/api';
import Shimmer from '@/components/layout/Shimmer';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef'];

export default function ProfileStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchProfileStats()
      .then((data) => {
        if (mounted) {
          setStats(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || 'Failed to load stats');
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  if (loading) return <Shimmer />;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!stats) return null;

  const { totalWatchTime, topGenres, moviesWatched, tvShowsWatched } = stats;

  const formatWatchTime = (minutes) => {
    if (!minutes) return '0h';
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h`;
    return `${hours}h ${minutes % 60}m`;
  };

  const chartData = topGenres?.map((g) => ({ name: g.name, value: g.count })) || [];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-white/5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Watch Time</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {formatWatchTime(totalWatchTime)}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-white/5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Movies Watched</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {moviesWatched || 0}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-white/5">
          <p className="text-sm text-slate-500 dark:text-slate-400">TV Shows Watched</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {tvShowsWatched || 0}
          </p>
        </div>
      </div>

      {/* Genre Chart */}
      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 text-left w-full">Top Genres</p>
        {chartData.length > 0 ? (
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-slate-400 mt-8">Watch more titles to see your top genres.</p>
        )}
      </div>
    </div>
  );
}

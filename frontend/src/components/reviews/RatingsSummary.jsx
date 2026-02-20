import { useEffect, useMemo, useState } from 'react';
import { fetchReviewSummary } from '@/utils/api';

export default function RatingsSummary({ movieId }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchReviewSummary(movieId).then(setSummary).catch(() => setSummary({ count: 0, avg: 0 }));
  }, [movieId]);

  const bars = useMemo(() => {
    if (!summary) return [];
    const dist = [summary.dist5, summary.dist4, summary.dist3, summary.dist2, summary.dist1];
    const labels = ['5★', '4★', '3★', '2★', '1★'];
    const total = Math.max(summary.count, 1);
    return dist.map((v, i) => ({
      label: labels[i],
      pct: Math.round((v / total) * 100),
      count: v,
    }));
  }, [summary]);

  if (!summary) return <div className="text-sm opacity-70">Loading rating…</div>;

  return (
    <div className="mt-4 border rounded-lg p-3">
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-3xl font-semibold">{(summary.avg || 0).toFixed(1)}</span>
        <span className="text-sm opacity-70">{summary.count} ratings</span>
      </div>
      <div className="flex flex-col gap-1">
        {bars.map((b) => (
          <div key={b.label} className="flex items-center gap-2">
            <span className="w-8 text-xs text-right">{b.label}</span>
            <div className="flex-1 h-2 rounded bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-2 bg-gray-900 dark:bg-gray-100"
                style={{ width: `${b.pct}%` }}
                title={`${b.count} (${b.pct}%)`}
              />
            </div>
            <span className="w-10 text-xs text-right opacity-70">{b.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

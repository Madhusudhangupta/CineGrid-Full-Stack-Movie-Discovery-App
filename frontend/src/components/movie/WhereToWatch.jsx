import { useEffect, useMemo, useState } from 'react';
import { fetchProviders } from '@/utils/api';

export default function WhereToWatch({ movieId, region = 'IN' }) {
  const [providers, setProviders] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProviders(movieId)
      .then(setProviders)
      .catch((e) => setError(e?.message || 'Failed to load providers'));
  }, [movieId]);

  const regionProviders = useMemo(() => (providers && providers[region]) || null, [providers, region]);

  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!providers) return <p className="text-sm opacity-70">Loading watch providers…</p>;
  if (!regionProviders) return <p className="text-sm opacity-70">No providers for your region.</p>;

  const renderRow = (label, list) =>
    list?.length ? (
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span className="text-sm font-semibold w-24">{label}:</span>
        {list.map((p) => (
          <span
            key={`${label}-${p.provider_id}`}
            className="text-sm border rounded px-2 py-1 bg-white/60 dark:bg-gray-800/60"
            title={p.provider_name}
          >
            {p.provider_name}
          </span>
        ))}
      </div>
    ) : null;

  return (
    <div className="border rounded-lg p-3 mt-4">
      <h3 className="font-semibold mb-2">Where to watch</h3>
      {renderRow('Stream', regionProviders.flatrate)}
      {renderRow('Rent', regionProviders.rent)}
      {renderRow('Buy', regionProviders.buy)}
      {regionProviders.link ? (
        <a
          href={regionProviders.link}
          target="_blank"
          rel="noreferrer"
          className="text-sm underline opacity-80"
        >
          See all providers
        </a>
      ) : null}
    </div>
  );
}

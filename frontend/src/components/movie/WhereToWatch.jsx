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

  if (error) return <div className="mt-4 border rounded-lg p-3 w-full h-full"><h3 className="font-semibold mb-2">Where to watch</h3><p className="text-sm text-red-500">{error}</p></div>;
  if (!providers) return <div className="mt-4 border rounded-lg p-3 w-full h-full"><h3 className="font-semibold mb-2">Where to watch</h3><p className="text-sm opacity-70">Loading watch providers…</p></div>;
  if (!regionProviders) return <div className="mt-4 border rounded-lg p-3 w-full h-full"><h3 className="font-semibold mb-2">Where to watch</h3><p className="text-sm opacity-70">No providers for your region.</p></div>;

  const renderRow = (label, list) =>
    list?.length ? (
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span className="text-sm font-semibold w-24">{label}:</span>
        {list.map((p) => (
          <div
            key={`${label}-${p.provider_id}`}
            className="flex items-center gap-1.5 text-sm border rounded px-2 py-1 bg-white/60 dark:bg-gray-800/60"
            title={p.provider_name}
          >
            {p.logo_path && (
              <img
                src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                alt={p.provider_name}
                className="w-5 h-5 rounded-sm object-cover"
              />
            )}
            <span>{p.provider_name}</span>
          </div>
        ))}
      </div>
    ) : null;

  return (
    <div className="mt-4 border rounded-lg p-3 w-full h-full">
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

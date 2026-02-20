
import { useState, useRef, useEffect } from 'react';

export default function useInfiniteScroll({ hasMore, onLoadMore, rootMargin = '200px' }) {
  const [enabled, setEnabled] = useState(true);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore) {
          onLoadMore?.();
        }
      },
      { root: null, rootMargin, threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [enabled, hasMore, onLoadMore, rootMargin]);

  return { sentinelRef, setEnabled };
}

// export const useInfiniteScroll = (callback, options = {}) => {
//   const [isFetching, setIsFetching] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + document.documentElement.scrollTop >=
//         document.documentElement.offsetHeight - (options.threshold || 100)
//       ) {
//         setIsFetching(true);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [options.threshold]);

//   useEffect(() => {
//     if (!isFetching) return;
//     callback();
//     setIsFetching(false);
//   }, [isFetching, callback]);

//   return [isFetching, setIsFetching];
// };
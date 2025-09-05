
import { useState } from 'react';
import api from '@/utils/api';

export default function TrailerModal({ movieId }) {
  const [trailer, setTrailer] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchTrailer = async () => {
    try {
      const response = await api.get(`/movies/${movieId}/videos`);
      const trailerVideo = response.data.results.find((video) => video.type === 'Trailer');
      setTrailer(trailerVideo);
      setIsOpen(true);
    } catch (error) {
      console.error('Failed to fetch trailer:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchTrailer} className="bg-blue-500 text-white p-2 rounded my-2">
        Watch Trailer
      </button>
      {isOpen && trailer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <button onClick={() => setIsOpen(false)} className="text-red-500 mb-2">Close</button>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Trailer"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/utils/api';

export default function PersonDetail() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/people/${id}`)
      .then((response) => setPerson(response.data))
      .catch(() => setError('Failed to load person details'));
  }, [id]);

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!person) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{person.name}</h1>
      <img src={`https://image.tmdb.org/t/p/w500${person.profile_path}`} alt={person.name} className="my-4" />
      <p>{person.biography}</p>
    </div>
  );
}

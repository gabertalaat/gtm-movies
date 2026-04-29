import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getPersonDetails(id: string) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!apiKey) {
    console.log('ERROR: API KEY is missing in.env.local');
    throw new Error('API Key is missing');
  }

  const url = `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&language=ar&append_to_response=movie_credits`;
  console.log('Fetching:', url);

  const res = await fetch(url, {
    cache: 'no-store'
  });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    const errorBody = await res.text();
    console.log('TMDB Error:', res.status, errorBody);
    throw new Error(`Failed to fetch person: ${res.status}`);
  }

  return res.json();
}

// عدل السطر ده بس ↓↓
export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ← ده صح
  const person = await getPersonDetails(id);

  const movies = person.movie_credits?.cast
?.sort((a: any, b: any) => b.popularity - a.popularity)
?.slice(0, 20) || [];

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-yellow-400 hover:underline mb-8 block">← رجوع للرئيسية</Link>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <img
            src={person.profile_path? `https://image.tmdb.org/t/p/w500${person.profile_path}` : 'https://via.placeholder.com/500'}
            alt={person.name}
            className="rounded-lg w-full"
          />
          <div className="md:col-span-2">
            <h1 className="text-5xl font-bold mb-4">{person.name}</h1>
            <p className="text-gray-400 mb-4">
              {person.birthday && `تاريخ الميلاد: ${person.birthday}`}
              {person.place_of_birth && ` | مكان الميلاد: ${person.place_of_birth}`}
            </p>
            <h2 className="text-2xl font-bold mb-4">نبذة</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {person.biography || 'لا توجد نبذة متاحة'}
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6">أفلام {person.name}</h2>
        {movies.length === 0? (
          <div className="text-center text-2xl text-gray-400">لا توجد أفلام متاحة</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie: any) => (
              <Link href={`/movie/${movie.id}`} key={movie.id}>
                <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 group">
                  <img
                    src={movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : 'https://via.placeholder.com/500x750?text=No+Image'
                    }
                    alt={movie.title}
                    className="w-full h-auto"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold truncate group-hover:text-yellow-400">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">{movie.character}</p>
                    <p className="text-xs text-gray-500 mt-1">{movie.release_date?.split('-')[0]}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
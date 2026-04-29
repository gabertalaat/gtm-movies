'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
};

const genres = [
  { id: 28, name: 'أكشن' },
  { id: 35, name: 'كوميدي' },
  { id: 27, name: 'رعب' },
  { id: 12, name: 'مغامرة' },
  { id: 18, name: 'دراما' },
  { id: 878, name: 'خيال علمي' },
];

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  async function fetchMovies() {
    setLoading(true);
    let url = '';

    if (searchTerm) {
      // 1. لو بيبحث
      url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchTerm)}&language=ar`;
    } else if (selectedGenre) {
      // 2. لو اختار تصنيف
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${selectedGenre}&language=ar&sort_by=popularity.desc`;
    } else {
      // 3. الصفحة الرئيسية العادية
      url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=ar`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setMovies(data.results || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchMovies();
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm, selectedGenre]);

  function handleGenreClick(genreId: number) {
    setSearchTerm(''); // امسح السيرش لما تختار تصنيف
    setSelectedGenre(selectedGenre === genreId? null : genreId); // لو دوست تاني يلغي الفلتر
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedGenre(null); // امسح الفلتر لما تسيرش
    setSearchTerm(e.target.value);
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 text-yellow-400">
          GTM Movies
        </h1>

        {/* شريط البحث */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="ابحث عن أي فيلم..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-4 rounded-lg bg-gray-800 text-white text-lg border-2 border-gray-700 focus:border-yellow-400 outline-none"
          />
        </div>

        {/* أزرار التصنيفات */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreClick(genre.id)}
              className={`px-6 py-2 rounded-full font-bold transition-colors ${
                selectedGenre === genre.id
              ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* عرض الأفلام */}
        {loading? (
          <div className="text-center text-2xl text-gray-400">جاري التحميل...</div>
        ) : movies.length === 0? (
          <div className="text-center text-2xl text-gray-400">لا توجد نتائج</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
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
                    <h2 className="text-lg font-bold truncate group-hover:text-yellow-400">
                      {movie.title}
                    </h2>
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                      <span>⭐ {movie.vote_average.toFixed(1)}</span>
                      <span>{movie.release_date?.split('-')[0]}</span>
                    </div>
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
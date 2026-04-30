
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

// التصنيفات العادية بتاعتك
const genres = [
  { id: 28, name: 'أكشن' },
  { id: 35, name: 'كوميدي' },
  { id: 27, name: 'رعب' },
  { id: 12, name: 'مغامرة' },
  { id: 18, name: 'دراما' },
  { id: 878, name: 'خيال علمي' },
];

// الأقسام الرئيسية زي عرب سيد
const mainCategories = [
  { name: 'أفلام أجنبي', type: 'trending' },
  { name: 'أفلام عربي', type: 'arabic' },
  { name: 'أفلام نتفليكس', type: 'netflix' },
  { name: 'المضاف حديثاً', type: 'now_playing' },
  { name: 'الأعلى تقييماً', type: 'top_rated' },
  { name: 'مسلسلات', type: 'tv' },
];

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('trending');
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
      // 3. الأقسام الرئيسية
      switch (selectedCategory) {
        case 'arabic':
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=ar&region=EG&sort_by=popularity.desc&language=ar`;
          break;
        case 'netflix':
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_watch_providers=8&watch_region=EG&sort_by=popularity.desc&language=ar`;
          break;
        case 'now_playing':
          url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ar&region=EG`;
          break;
        case 'top_rated':
          url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=ar`;
          break;
        case 'tv':
          url = `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}&language=ar`;
          break;
        default: // trending
          url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=ar`;
      }
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
  }, [searchTerm, selectedGenre, selectedCategory]);

  function handleGenreClick(genreId: number) {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedGenre(selectedGenre === genreId? null : genreId);
  }

  function handleCategoryClick(type: string) {
    setSearchTerm('');
    setSelectedGenre(null);
    setSelectedCategory(type);
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedGenre(null);
    setSelectedCategory('');
    setSearchTerm(e.target.value);
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* اللوجو - ستايل Netflix */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-black tracking-tight mb-2 bg-gradient-to-b from-red-600 to-red-800 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            GTM Movies
          </h1>
          <p className="text-gray-400 text-sm tracking-wider">أسرع موقع أفلام في مصر</p>
        </div>

        {/* شريط البحث */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="ابحث عن أي فيلم أو مسلسل..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-4 rounded-lg bg-gray-800 text-white text-lg border-2 border-gray-700 focus:border-yellow-500 outline-none"
          />
        </div>

        {/* الأقسام الرئيسية زي عرب سيد */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          {mainCategories.map((cat) => (
            <button
              key={cat.type}
              onClick={() => handleCategoryClick(cat.type)}
              className={`px-6 py-2 rounded-full font-bold transition-all border ${
                selectedCategory === cat.type
                ? 'bg-yellow-500 text-black border-yellow-500'
                  : 'bg-transparent text-white border-gray-700 hover:border-yellow-500 hover:bg-yellow-500/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* أزرار التصنيفات */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreClick(genre.id)}
              className={`px-4 py-1 rounded-full text-sm font-bold transition-colors ${
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <Link href={`/movie/${movie.id}`} key={movie.id}>
                <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 group">
                  <img
                    src={
                      movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : 'https://via.placeholder.com/500x750?text=No+Image'
                    }
                    alt={movie.title}
                    className="w-full h-auto"
                  />
                  <div className="p-3">
                    <h2 className="text-sm font-bold truncate group-hover:text-yellow-400">
                      {movie.title}
                    </h2>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                      <span>⭐ {movie.vote_average?.toFixed(1)}</span>
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

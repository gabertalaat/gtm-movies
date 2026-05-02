'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
};

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  useEffect(() => {
    async function fetchData() {
      try {
        // خلفية البوسترات
        const moviesRes = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=ar`
        );
        const moviesData = await moviesRes.json();
        setMovies(moviesData.results?.slice(0, 18) || []);

        // الأكثر شهرة
        const trendingRes = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ar&region=EG`
        );
        const trendingData = await trendingRes.json();
        setTrending(trendingData.results?.slice(0, 10) || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [apiKey]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-2xl text-gray-400">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* الهيدر */}
      <header className="absolute top-0 w-full z-40 px-4 md:px-12 py-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl font-black tracking-[0.05em] text-[#E50914] transform -skew-x-12"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
          GTM MOVIES
        </h1>
        <div className="flex gap-3">
          <button className="px-4 py-1 border border-gray-500 rounded text-sm hover:border-white">
            العربية
          </button>
          <button className="px-4 py-1 bg-[#E50914] rounded text-sm font-bold hover:bg-red-700">
            دخول
          </button>
        </div>
      </header>

      {/* الهيرو - خلفية البوسترات */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        {/* خلفية البوسترات */}
        <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-6 gap-1 opacity-40">
          {movies.map((movie, i) => (
            <img
              key={i}
              src={movie.poster_path
               ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                : 'https://via.placeholder.com/300x450'}
              alt=""
              className="w-full h-full object-cover"
            />
          ))}
        </div>

        {/* طبقة سودا فوق البوسترات */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60"></div>

        {/* المحتوى */}
        <div className="relative z-10 px-4 max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            أفلام ومسلسلات وبرامج
            <br />
            لا حصر لها والمزيد
          </h2>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            شاهد في أي وقت. مجاني 100%
          </p>
          <Link href="/browse">
            <button className="px-8 py-4 bg-[#E50914] text-xl font-bold rounded hover:bg-red-700 transition-all flex items-center gap-2 mx-auto">
              ابدأ التصفح
              <span className="text-2xl">‹</span>
            </button>
          </Link>
        </div>

        {/* خط منحني تحت */}
        <div className="absolute bottom-0 w-full h-20">
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E50914] to-transparent"></div>
        </div>
      </section>

      {/* الأكثر شهرة الآن */}
      <section className="bg-black px-4 md:px-12 pb-12 -mt-1">
        <h3 className="text-2xl font-bold mb-6">الأكثر شهرة الآن</h3>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {trending.map((movie, index) => (
            <Link href={`/movie/${movie.id}`} key={movie.id} className="flex-shrink-0">
              <div className="relative group">
                <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-8xl font-black text-gray-800 group-hover:text-gray-700 z-0"
                      style={{ WebkitTextStroke: '2px #333' }}>
                  {index + 1}
                </span>
                <img
                  src={movie.poster_path
                   ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                    : 'https://via.placeholder.com/300x450'}
                  alt={movie.title}
                  className="w-32 md:w-44 rounded relative z-10 hover:scale-105 transition-transform"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

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
  const [lang, setLang] = useState('ar');

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') || 'ar';
    setLang(savedLang);
    document.documentElement.lang = savedLang;
    document.documentElement.dir = savedLang === 'ar'? 'rtl' : 'ltr';
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'ar'? 'en' : 'ar';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar'? 'rtl' : 'ltr';
    window.location.reload();
  };

  const t = {
    ar: {
      login: 'دخول',
      hero1: 'أفلام ومسلسلات وبرامج',
      hero2: 'لا حصر لها والمزيد',
      subtext: 'شاهد في أي وقت. مجاني 100%',
      browse: 'ابدأ التصفح',
      trending: 'الأكثر شهرة الآن'
    },
    en: {
      login: 'Sign In',
      hero1: 'Unlimited movies, TV',
      hero2: 'shows, and more',
      subtext: 'Watch anywhere. Free 100%',
      browse: 'Get Started',
      trending: 'Trending Now'
    }
  }[lang];

  useEffect(() => {
    async function fetchData() {
      const apiLang = lang === 'ar'? 'ar' : 'en';
      try {
        const moviesRes = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=${apiLang}`
        );
        const moviesData = await moviesRes.json();
        setMovies(moviesData.results?.slice(0, 18) || []);

        const trendingRes = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=${apiLang}&region=EG`
        );
        const trendingData = await trendingRes.json();
        setTrending(trendingData.results?.slice(0, 10) || []);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    fetchData();
  }, [lang, apiKey]);

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="absolute top-0 w-full z-40 px-4 md:px-12 py-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl font-black tracking-[0.05em] text-[#E50914] transform -skew-x-12"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
          GTM MOVIES
        </h1>
        <div className="flex gap-3">
          <button
            onClick={toggleLang}
            className="px-4 py-1 border border-gray-500 rounded text-sm hover:border-white font-bold"
          >
            {lang === 'ar'? 'EN' : 'AR'}
          </button>
          <button className="px-4 py-1 bg-[#E50914] rounded text-sm font-bold hover:bg-red-700">
            {t.login}
          </button>
        </div>
      </header>

      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
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

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60"></div>

        <div className="relative z-10 px-4 max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            {t.hero1}
            <br />
            {t.hero2}
          </h2>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            {t.subtext}
          </p>
          <Link href="/browse">
            <button className="px-8 py-4 bg-[#E50914] text-xl font-bold rounded hover:bg-red-700 transition-all flex items-center gap-2 mx-auto">
              {lang === 'ar'? (
                <>
                  <span className="text-2xl">›</span>
                  {t.browse}
                </>
              ) : (
                <>
                  {t.browse}
                  <span className="text-2xl">›</span>
                </>
              )}
            </button>
          </Link>
        </div>

        <div className="absolute bottom-0 w-full h-20">
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-transparent via-[#E50914] to-transparent shadow-[0_0_20px_#E50914]"></div>
        </div>
      </section>

      <section className="bg-black px-4 md:px-12 pb-12 -mt-1">
        <h3 className="text-2xl font-bold mb-6">{t.trending}</h3>
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

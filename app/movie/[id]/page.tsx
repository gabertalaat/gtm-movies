'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
};

type Cast = {
  id: number;
  name: string;
  profile_path: string;
  character: string;
};

export default function MoviePage({ params }: { params: { id: string } }) {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  useEffect(() => {
    async function fetchMovie() {
      try {
        // تفاصيل الفيلم
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/movie/${params.id}?api_key=${apiKey}&language=ar`
        );
        const movieData = await movieRes.json();
        setMovie(movieData);

        // طاقم العمل
        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${params.id}/credits?api_key=${apiKey}&language=ar`
        );
        const creditsData = await creditsRes.json();
        setCast(creditsData.cast?.slice(0, 8) || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [params.id, apiKey]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-2xl text-gray-400">جاري التحميل...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-2xl text-gray-400">الفيلم غير موجود</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* الخلفية الكبيرة */}
      <div className="relative h-[70vh]">
        <img
          src={
            movie.backdrop_path
             ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
              : 'https://via.placeholder.com/1920x1080'
          }
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient من تحت */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

        {/* الهيدر */}
        <header className="absolute top-0 w-full z-40 px-4 md:px-12 py-4">
          <Link href="/browse">
            <h1 className="text-2xl md:text-4xl font-black tracking-[0.05em] text-[#E50914] transform -skew-x-12 inline-block"
                style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
              GTM MOVIES
            </h1>
          </Link>
        </header>

        {/* معلومات الفيلم فوق الخلفية */}
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-12 pb-8">
          <h1 className="text-4xl md:text-7xl font-black mb-4 drop-shadow-2xl">
            {movie.title}
          </h1>

          <div className="flex items-center gap-4 mb-6 text-lg">
            <span className="text-green-500 font-bold">
              ⭐ {movie.vote_average?.toFixed(1)}
            </span>
            <span>{movie.release_date?.split('-')[0]}</span>
            <span>{movie.runtime} دقيقة</span>
            <span className="px-2 py-1 border border-gray-400 text-xs">HD</span>
          </div>

          {/* زر التشغيل */}
          <button className="px-8 py-3 bg-white text-black text-xl font-bold rounded hover:bg-gray-300 transition-all flex items-center gap-3 mb-8">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            تشغيل
          </button>

          <p className="max-w-2xl text-lg text-gray-200 leading-relaxed">
            {movie.overview}
          </p>
        </div>
      </div>

      {/* المحتوى تحت */}
      <div className="px-4 md:px-12 py-8 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* البوستر */}
          <img
            src={
              movie.poster_path
               ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750'
            }
            alt={movie.title}
            className="w-48 md:w-64 rounded-lg shadow-2xl"
          />

          {/* التفاصيل */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4 text-gray-400">القصة</h2>
            <p className="text-gray-300 leading-loose mb-8">
              {movie.overview}
            </p>

            <h2 className="text-2xl font-bold mb-4 text-gray-400">التصنيف</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="px-4 py-1 bg-gray-800 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-4 text-gray-400">طاقم العمل</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {cast.map((actor) => (
                <div key={actor.id} className="text-center flex-shrink-0 w-24">
                  <img
                    src={
                      actor.profile_path
                       ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                        : 'https://via.placeholder.com/200x300?text=No+Image'
                    }
                    alt={actor.name}
                    className="w-24 h-24 rounded-full object-cover mb-2"
                  />
                  <p className="text-xs font-bold truncate">{actor.name}</p>
                  <p className="text-xs text-gray-500 truncate">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

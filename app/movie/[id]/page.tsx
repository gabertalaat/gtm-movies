import Link from 'next/link';
import { Metadata } from 'next';

async function getMovieDetails(id: string) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  console.log('API KEY FROM ENV:', apiKey);

  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=ar&append_to_response=videos,credits`, {
    next: { revalidate: 3600 }
  });
  if (!res.ok) throw new Error('Failed to fetch movie');
  return res.json();
}

// الكود ده اللي ضيفته عشان الـ SEO - بيشتغل تلقائي لكل فيلم
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetails(id);
  const year = movie.release_date?.split('-')[0];

  return {
    title: `مشاهدة فيلم ${movie.title} ${year} مترجم | GTM MOVIES`,
    description: `شاهد فيلم ${movie.title} ${year} على موقع gtm movies مترجم اون لاين HD. ${movie.overview?.slice(0, 155)}...`,
    keywords: [
      'GTM MOVIES', 'gtm movies', 'Gtm Movies', 'GTM movies',
      `مشاهدة فيلم ${movie.title}`,
      `فيلم ${movie.title} مترجم`,
      `فيلم ${movie.title} اون لاين`,
      `${movie.title} ${year}`,
      'جي تي ام موفيز',
      'افلام اون لاين'
    ],
    openGraph: {
      title: `مشاهدة فيلم ${movie.title} مترجم - GTM MOVIES`,
      description: movie.overview,
      images: [
        {
          url: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`,
          width: 1280,
          height: 720,
          alt: movie.title,
        },
      ],
      type: 'video.movie',
    },
    twitter: {
      card: 'summary_large_image',
      title: `فيلم ${movie.title} - GTM MOVIES`,
      description: `شاهده الآن على gtm movies`,
      images: [`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`],
    },
  };
}

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  const trailer = movie.videos.results.find((v: any) =>
    (v.type === 'Trailer' || v.type === 'Teaser' || v.type === 'Clip' || v.type === 'Featurette') && v.site === 'YouTube'
  );

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="relative h-96">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12">
          <Link href="/" className="text-yellow-400 hover:underline mb-4 block">← رجوع للرئيسية</Link>
          <h1 className="text-4xl md:text-6xl font-bold">{movie.title}</h1>
          <p className="text-xl text-yellow-400 mt-2">⭐ {movie.vote_average.toFixed(1)} | {movie.release_date?.split('-')[0]}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 md:p-12 grid md:grid-cols-3 gap-8">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded-lg w-full"
        />
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold mb-4">القصة</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">{movie.overview}</p>

          <h3 className="text-2xl font-bold mb-4">الممثلين</h3>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {movie.credits.cast.slice(0, 6).map((actor: any) => (
              <Link href={`/person/${actor.id}`} key={actor.id} className="text-center flex-shrink-0 w-24 hover:scale-105 transition-transform">
                <img src={actor.profile_path? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/185'} alt={actor.name} className="w-24 h-24 rounded-full object-cover mb-2" />
                <p className="text-sm hover:text-yellow-400">{actor.name}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">التريلر</h3>
            {trailer? (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative group"
              >
                <img
                  src={`https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`}
                  alt="شاهد التريلر"
                  className="w-full aspect-video rounded-lg object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                  <div className="bg-red-600 rounded-full p-5 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 0 004 4.11V15.89a1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 rounded text-sm">
                  شاهده على YouTube
                </div>
              </a>
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400 text-lg">لا توجد فيديوهات متاحة الآن</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

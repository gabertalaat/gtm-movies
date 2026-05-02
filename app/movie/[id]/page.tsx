import { Metadata } from 'next';

type Props = { params: { id: string } }

async function getMovie(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ar`
  );
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const movie = await getMovie(params.id);
  
  return {
    title: `مشاهدة فيلم ${movie.title} مترجم | GTM MOVIES`,
    description: `شاهد فيلم ${movie.title} ${movie.release_date?.split('-')[0]} على موقع gtm movies مترجم اون لاين HD. ${movie.overview?.slice(0, 150)}...`,
    keywords: [
      `GTM MOVIES`, `gtm movies`, `فيلم ${movie.title}`, 
      `مشاهدة ${movie.title}`, `${movie.title} مترجم`
    ],
  };
}

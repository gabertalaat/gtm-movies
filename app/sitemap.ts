import { MetadataRoute } from 'next';

const baseUrl = 'https://gtm-movies.vercel.app';

async function getMoviesForSitemap() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  // بنجيب 5 صفحات = 100 فيلم عشان نغطي أكبر عدد
  const pages = [1, 2, 3, 4, 5]; 
  const requests = pages.map(page => 
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ar&page=${page}`)
  );
  
  const responses = await Promise.all(requests);
  const movies = await Promise.all(responses.map(res => res.json()));
  
  return movies.flatMap(data => data.results);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const movies = await getMoviesForSitemap();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  const moviePages: MetadataRoute.Sitemap = movies.map((movie: any) => ({
    url: `${baseUrl}/movie/${movie.id}`,
    lastModified: new Date(movie.release_date || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...moviePages];
}

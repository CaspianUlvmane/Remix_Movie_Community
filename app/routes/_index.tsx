import type { MetaFunction } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react";
import { getSession, commitSession } from "utils/sessions";

export const meta: MetaFunction = () => {
  return [
    { title: "Test Remix app" },
    { name: "description", content: "Wow this works" },
  ];
};

export async function loader({ request }: LoaderArgs) {

  const session = await getSession(request.headers.get("Cookie"));

  const url = await fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', {
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YTc4MTEzZTJhYWJhZGU0NGQzNzVlZGRmNGI2NjZlOSIsIm5iZiI6MTczMTkyMTI4Ni4zNTQ4MzUzLCJzdWIiOiI2NzNiMDQ5ZWY3NDFlYjA0MjhiNjI2ZmUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.EQCgYI17ha_PqjbVxtXYwkGDMyB0u-6MgcRdP9ev-jc'
    }
  })

  return await url.json()
}

export default function Index() {

  const movies = useLoaderData()


  return (
    <div className="py-6 sm:py-8 lg:py-12">
      <div className="flex max-w-screen-lg mx-auto align-middle justify-center">
        <h2 className="p-4 text-3xl font-bold font-sans">Top Trending Movies</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8 lg:max-w-screen-md xl:max-w-screen-lg md:max-w-screen-sm mx-auto">
        {movies.results.map((movie: any) => (
          <div className="flex flex-col overflow-hidden rounded-lg border-2 border-pink-400">

            <Link to={`movie/${movie.id}/comments`} prefetch="intent" className="group relative block h-48 overflow-hidden bg-pink-400 md:h-64">
              <img className="w-full h-full min-h-12 absolute inset-0 object-cover object-center transition duration-200 group-hover:scale-110" src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt="" />
            </Link>

            <div className="flex flex-1 flex-col p-4 sm:p.6">
              <Link to={`movie/${movie.id}/comments`} prefetch="intent" className="text-xl transition duration-200 text-pink-400 hover:text-pink-700">
                {movie.title}
              </Link>
              <p className="line-clamp-3">{movie.overview}</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

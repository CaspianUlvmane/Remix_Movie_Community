import type { LoaderArgs } from "@remix-run/node"
import { useLoaderData, Link, Outlet } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import i18next from "utils/i18next.server";

export async function loader({ params, request }: LoaderArgs) {
    let locale = await i18next.getLocale(request);
    let url = await fetch(`https://api.themoviedb.org/3/movie/${params.id}?language=${locale}`, {
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YTc4MTEzZTJhYWJhZGU0NGQzNzVlZGRmNGI2NjZlOSIsIm5iZiI6MTczMTkyMTMyMC45MjE1Nzk2LCJzdWIiOiI2NzNiMDQ5ZWY3NDFlYjA0MjhiNjI2ZmUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6cylwHLFfVgHMqykU4414qK4Uj1bWJ0Nq662fWWarik'
        }
    });
    let movie = await url.json()

    url = await fetch(`https://api.themoviedb.org/3/movie/${params.id}/release_dates`, {
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YTc4MTEzZTJhYWJhZGU0NGQzNzVlZGRmNGI2NjZlOSIsIm5iZiI6MTczMTkyMTMyMC45MjE1Nzk2LCJzdWIiOiI2NzNiMDQ5ZWY3NDFlYjA0MjhiNjI2ZmUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6cylwHLFfVgHMqykU4414qK4Uj1bWJ0Nq662fWWarik'
        }
    })
    let release_dates = await url.json()
    let certification = release_dates.results
    return { movie, certification }
}

export default function movieId() {
    const data = useLoaderData()
    let { movie, certification } = data
    console.log(movie);

    let rating
    certification.forEach(element => {
        if (element.iso_3166_1 === "US") {
            rating = element.release_dates[0].certification
            return
        }
    });

    const { t } = useTranslation()

    return (
        <div className="min-h-screen p-10">
            <img src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} alt="" className="h-[40vh] object-cover w-full rounded-xl" />
            <h1 className="text-4xl font-bold text-center pt-5 text-pink-400">
                {movie.title}
            </h1>
            <div className="flex gap-x-10 mt-10">
                <div className="w-1/2 font-medium ">
                    <h1 className="py-2">
                        <span>{t("movieSite")}:</span><Link prefetch="intent" to={movie.homepage} target="_blank"> {movie.title}</Link>
                    </h1>
                    <p className="py-2">{movie.release_date} / {rating} / {movie.original_language}</p>
                    <p className="py-2">{movie.overview}</p>
                </div>
                <div className="w-1/2">
                    <Outlet />
                </div>
            </div>
        </div>

    )
}
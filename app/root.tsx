import {
  Links,
  Link,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { getSession } from "utils/sessions";


import "./tailwind.css";
import { useChangeLanguage } from "remix-i18next/react";
import { useTransition } from "react";
import i18next from "utils/i18next.server";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  let locale = await i18next.getLocale(request);
  const session = await getSession(request.headers.get("Cookie"));

  return { session, locale }

}

export function Layout({ children }: { children: React.ReactNode }) {
  let { locale, session } = useLoaderData<typeof loader>();
  // console.log(locale);

  // let { i18n } = useTransition();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  // useChangeLanguage(locale);

  const userId = session.data.userId ? session.data.userId : null

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <nav className="p-5 px-8 mt-6 font-bold text-2xl bg-pink-800 flex justify-between max-w-5xl rounded-full m-auto">
          <Link to={"/"} prefetch="intent">
            Remix <span className="text-pink-500">Test</span>
          </Link>
          {userId ? (
            <Link to={"/userSettings"} prefetch="intent" className="">
              My Pages
            </Link>
          )
            :
            (
              <Link to={"/signIn"} prefetch="intent" className="">
                Sign in
              </Link>
            )}

        </nav>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html >
  );
}

export default function App() {
  return <Outlet />;
}

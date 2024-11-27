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

  const session = await getSession(request.headers.get("Cookie"));

  return session

}

export function Layout({ children }: { children: React.ReactNode }) {

  const session = useLoaderData<typeof loader>()
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
            <Link to={"/signOut"} prefetch="intent" className="">
              Sign Out
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

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
import i18next from "utils/i18next.server";
import { useTranslation } from "react-i18next";

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


export let handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "common",
};

export function Layout({ children }: { children: React.ReactNode }) {
  let { locale, session } = useLoaderData<typeof loader>();
  console.log(locale);

  let { i18n } = useTranslation();

  let { t } = useTranslation();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);

  const userId = session.data.userId ? session.data.userId : null

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <nav className="p-5 px-8 mt-6 font-bold text-2xl bg-pink-800 flex justify-between max-w-5xl rounded-full m-auto">
          <Link to={"/"} prefetch="intent">
            Trend<span className="text-pink-500">Films</span>
          </Link>
          {userId ? (
            <Link to={"/userSettings"} prefetch="intent" className="">
              {t("myPages")}
            </Link>
          )
            :
            (
              <Link to={"/signIn"} prefetch="intent" className="">
                {t("logIn")}
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

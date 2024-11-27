import { data, Form, redirect, useLoaderData, useNavigation } from "@remix-run/react";
import { LoaderArgs } from "@remix-run/node"
import type { ActionArgs } from "@remix-run/node"
import { db } from "utils/db.server";
import { getSession, commitSession } from "utils/sessions";

export async function loader({ request }: LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", "");
    return redirect("/", {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    })
}